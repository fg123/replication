#include <emscripten.h>

#include "logging.h"

#include <deque>
#include <atomic>

#include "game.h"
#include "objects/player.h"
#include "object.h"
#include "json/json.hpp"
#include "perf.h"

#include "client_gl.h"

// We probably need to include all these so it registers
#include "characters/marine.h"
#include "characters/archer.h"
#include "characters/hookman.h"
#include "characters/bombmaker.h"

static const size_t MAX_INPUT_EVENT_QUEUE = 256;

static const bool CLIENT_ONLY = false;
static bool hasInitialReplication = false;

extern "C" {
    /** Client Interface for the JS Front End */

    EMSCRIPTEN_KEEPALIVE
    Game game;

    EMSCRIPTEN_KEEPALIVE
    ClientGL clientGl(game, "#game");

    EMSCRIPTEN_KEEPALIVE
    std::deque<JSONDocument> inputEvents;

    EMSCRIPTEN_KEEPALIVE
    void SetLocalPlayerClient(ObjectID client) {
        game.localPlayerId = client;
    }

    EMSCRIPTEN_KEEPALIVE
    Time lastTickTime = 0;

    EMSCRIPTEN_KEEPALIVE
    Time ping = 0;

    EMSCRIPTEN_KEEPALIVE
    void SetPing(Time inPing) {
        ping = inPing;
    }

    EMSCRIPTEN_KEEPALIVE
    int GetTickInterval() {
        return TickInterval;
    }

    EMSCRIPTEN_KEEPALIVE
    Time GetLastTickTime() {
        return lastTickTime;
    }

    EMSCRIPTEN_KEEPALIVE
    void SetupClientContext() {
        clientGl.SetupContext();
        clientGl.SetupGL();
    }

    EMSCRIPTEN_KEEPALIVE
    void TickGame() {
        try {
            // Don't worry about slow ticks here, each tick
            //   is guaranteed to be fixed interval, but when
            //   we fall behind HandleReplicate() will autocorrect
            lastTickTime += TickInterval;
            game.Tick(lastTickTime);
        } catch(std::runtime_error& error) {
            LOG_ERROR(error.what());
        } catch(...) {
            LOG_ERROR("Unhandled Exception!");
        }
    }

    EMSCRIPTEN_KEEPALIVE
    bool IsObjectAlive(ObjectID objectId) {
        Object* obj = game.GetObject(objectId);
        return obj != nullptr;
    }

    EMSCRIPTEN_KEEPALIVE
    bool IsObjectDirty(ObjectID objectId) {
        Object* obj = game.GetObject(objectId);
        return obj->IsDirty();
    }

    EMSCRIPTEN_KEEPALIVE
    const char* GetObjectSerialized(ObjectID objectId) {
        Object* obj = game.GetObject(objectId);
        rapidjson::StringBuffer buffer;
        buffer.Reserve(350);
        rapidjson::Writer writer(buffer);

        writer.StartObject();
        obj->Serialize(writer);
        writer.EndObject();

        size_t length = buffer.GetSize() + 1;
        char* writable = new char[length];
        std::copy_n(buffer.GetString(), length, writable);
        writable[length - 1] = 0;

        obj->SetDirty(false);
        return writable;
    }

    EMSCRIPTEN_KEEPALIVE
    void HandleLocalInput(ObjectID object, const char* input) {
        Object* obj = game.GetObject(object);
        if (obj) {
            if (!CLIENT_ONLY) {
                if (inputEvents.size() > MAX_INPUT_EVENT_QUEUE) {
                    LOG_WARN("Local input queue > " << MAX_INPUT_EVENT_QUEUE << ", server crashed?");
                    return;
                }
                inputEvents.emplace_back();
                inputEvents.back().Parse(input);
                static_cast<PlayerObject*>(obj)->OnInput(inputEvents.back());
            }
            else {
                JSONDocument doc;
                doc.Parse(input);
                static_cast<PlayerObject*>(obj)->OnInput(doc);
            }
        }
    }

    EMSCRIPTEN_KEEPALIVE
    void LoadMap(const char* map) {
        game.LoadMap(map);
        clientGl.OnModelsReplicated();
    }

    EMSCRIPTEN_KEEPALIVE
    void HandleReplicate(const char* input) {
        // LOG_DEBUG("Handle Replicate");
        if (hasInitialReplication && CLIENT_ONLY) {
            return;
        }
        hasInitialReplication = true;
        try {
            Vector3 oldPosition, serverPosition;
            if (Object* obj = game.GetLocalPlayer()) {
                // LOG_DEBUG("OldPosition Tick Time" << lastTickTime);
                oldPosition = obj->GetPosition();
            }
            JSONDocument object;
            object.Parse(input);

            bool hasPlayerIn = false;
            for (auto& event : object["objs"].GetArray()) {
                ObjectID ids = event["id"].GetUint();
                if (ids == game.localPlayerId) {
                    hasPlayerIn = true;
                }
                game.EnsureObjectExists(event);
            }

            for (auto& event : object["objs"].GetArray()) {
                game.ProcessReplication(event);
            }

            // If the replication doesn't correct player position, we can't
            //   assume we need to roll back.
            if (!hasPlayerIn) return;

            if (Object* obj = game.GetLocalPlayer()) {
                serverPosition = obj->GetPosition();
            }

            Time serverLastProcessedTime = object["time"].GetUint();

            // Calculate where the server is now
            uint64_t ticksSinceLastProcessed = object["ticks"].GetUint64();
            // LOG_DEBUG("ServerLastProcessedTime " << serverLastProcessedTime << " TicksSinceLastProcessed" << ticksSinceLastProcessed);
            Time serverCurrentTickTime = serverLastProcessedTime +
                (ticksSinceLastProcessed * TickInterval);

            // Delete inputs that the server has already processed (or that are too late?)
            while (!inputEvents.empty()) {
                Time inputTime = inputEvents.front()["time"].GetUint64();
                if (inputTime <= serverLastProcessedTime) {
                    inputEvents.pop_front();
                }
                else {
                    break;
                }
            }

            // Client too far ahead
            if (lastTickTime > serverCurrentTickTime + 1000) {
                LOG_WARN("Client ahead by " << lastTickTime - serverCurrentTickTime << ", resetting!");
                lastTickTime = serverCurrentTickTime;
                game.RollbackTime(lastTickTime);
                inputEvents.clear();
                return;
            }
            else if (lastTickTime < serverCurrentTickTime) {
                LOG_WARN("Server faster than client! Last tick client: " << lastTickTime << " Server Current: " << serverCurrentTickTime);
                // All inputs are non relevant anyway, shift client to present and just call it.
                inputEvents.clear();
                lastTickTime = ((serverCurrentTickTime + ping) / TickInterval) * TickInterval;
                return;
            }

            // There's a chance here that the server has gone on faster than us, but has not
            //    processed our input yet.
            // Regardless, start game back at oldest known state.

            // Queue up inputs that the server hasn't processed yet
            Time nextTick = serverCurrentTickTime;
            if (!inputEvents.empty() && inputEvents.front()["time"].GetUint64() < nextTick) {
                LOG_WARN("Input rewind next tick not accurate here!");
                nextTick = inputEvents.front()["time"].GetUint64();
            }

            if (Object* obj = game.GetLocalPlayer()) {
                obj->SetLastTickTime(nextTick - TickInterval);

                for (auto& jsonEvent : inputEvents) {
                    // Queue into Buffer
                    static_cast<PlayerObject*>(obj)->OnInput(jsonEvent);
                }

                Time ending = std::max(serverCurrentTickTime + ping, lastTickTime);

                // LOG_DEBUG("Bringing to present (" << serverLastProcessedTime << ", " << serverCurrentTickTime << ") " << nextTick << " -> " << ending);
                // LOG_DEBUG("Bringing to present with " << (ending - nextTick) / TickInterval << " ticks!");
                while (nextTick < ending) {
                    obj->Tick(nextTick);
                    nextTick += TickInterval;
                }
            }
            // LOG_DEBUG("To Present Done!");

            // Make sure this is never negative!!!
            if (nextTick > TickInterval) {
                lastTickTime = nextTick - TickInterval;
            }

            if (Object* obj = game.GetLocalPlayer()) {
                Vector3 newPosition = obj->GetPosition();
                Vector3 difference = (newPosition - oldPosition);
                if (glm::length(difference) > 0.01) {
                    LOG_WARN("Server Position Desync: " << newPosition << " - " << oldPosition << " = " << (newPosition - oldPosition));
                }
            }
        } catch(std::exception& e) {
            LOG_ERROR(e.what());
            LOG_ERROR(input);
        } catch(...) {
            LOG_ERROR(input);
            throw;
        }
    }

    EMSCRIPTEN_KEEPALIVE
    void Draw(int width, int height) {
        clientGl.Draw(width, height);
    }
}