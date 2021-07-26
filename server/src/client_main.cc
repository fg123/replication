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
#include "client_audio.h"
#include "global.h"

#include "objects.h"

static const size_t MAX_INPUT_EVENT_QUEUE = 256;

static bool hasInitialReplication = false;

extern "C" {
    /** Client Interface for the JS Front End */

    EMSCRIPTEN_KEEPALIVE
    Game game;

    EMSCRIPTEN_KEEPALIVE
    ClientGL clientGl(game, "#game");

    EMSCRIPTEN_KEEPALIVE
    ClientAudio clientAudio(game);

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
    bool isPaused = true;

    EMSCRIPTEN_KEEPALIVE
    bool isInventoryOpen = true;

    EMSCRIPTEN_KEEPALIVE
    void SetIsPaused(bool paused) {
        isPaused = paused;
    }

    EMSCRIPTEN_KEEPALIVE
    void SetIsInventoryOpen(bool inventoryOpen) {
        isInventoryOpen = inventoryOpen;
    }

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
        clientAudio.SetupContext();
    }

    EMSCRIPTEN_KEEPALIVE
    void SetupClientGL() {
        clientGl.SetupGL();
    }

    EMSCRIPTEN_KEEPALIVE
    const char* GetDefaultPlayerSettings() {
        PlayerSettings playerSettings;

        rapidjson::StringBuffer buffer;
        rapidjson::Writer writer(buffer);
        writer.StartObject();
        playerSettings.Serialize(writer);
        writer.EndObject();

        size_t length = buffer.GetSize() + 1;
        char* writable = new char[length];
        std::copy_n(buffer.GetString(), length, writable);
        writable[length - 1] = 0;
        return writable;
    }

    EMSCRIPTEN_KEEPALIVE
    void TickGame() {
        // LOG_DEBUG("Tick Game");
        try {
            // Don't worry about slow ticks here, each tick
            //   is guaranteed to be fixed interval, but when
            //   we fall behind HandleReplicate() will autocorrect
            lastTickTime += TickInterval;
            game.Tick(lastTickTime);
            // LOG_DEBUG("TickGame: " << lastTickTime);
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
    void ApplyPlayerSettings(ObjectID object, const char* input) {
        PlayerObject* obj = game.GetObject<PlayerObject>(object);
        if (obj) {
            JSONDocument doc;
            doc.Parse(input);
            obj->playerSettings.ProcessReplication(doc);
        }
    }

    EMSCRIPTEN_KEEPALIVE
    bool HandleLocalInput(ObjectID object, const char* input) {
        JSONDocument doc;
        doc.Parse(input);

        if (isInventoryOpen) return false;

        if (isPaused) {
            // UI Captured
            clientGl.HandleInput(doc);
            return false;
        }


        Object* obj = game.GetObject(object);
        if (obj) {
            if (!GlobalSettings.Client_IgnoreServer) {
                if (inputEvents.size() > MAX_INPUT_EVENT_QUEUE) {
                    LOG_WARN("Local input queue > " << MAX_INPUT_EVENT_QUEUE << ", server crashed?");
                    return true;
                }
                inputEvents.push_back(std::move(doc));
                static_cast<PlayerObject*>(obj)->OnInput(inputEvents.back());
            }
            else {
                static_cast<PlayerObject*>(obj)->OnInput(doc);
            }
        }
        return true;
    }

    EMSCRIPTEN_KEEPALIVE
    void LoadGlobalSettings(const char* settings) {
        LOG_DEBUG(settings);
        JSONDocument object;
        object.Parse(settings);
        GlobalSettings.ProcessReplication(object["globalSettings"]);
        game.LoadMap(GlobalSettings.MapPath);
    }

    EMSCRIPTEN_KEEPALIVE
    void WorldToScreenCoordinates(float* arr) {
        Vector2 result = clientGl.WorldToScreenCoordinates(Vector3(arr[0], arr[1], arr[2]));
        arr[0] = result.x;
        arr[1] = result.y;
    }

    EMSCRIPTEN_KEEPALIVE
    void HandleReplicate(const char* input) {
        // LOG_DEBUG("Handle Replicate");
        if (hasInitialReplication && GlobalSettings.Client_IgnoreServer) {
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

            // At this point we could have inputs that the server has not processed
            //   i.e. between serverLastProcessedTime and serverCurrentTickTime.
            // In this case, the input will go late to the server,
            //   and we will get a desync.

            // Here we have some correction algorithms that tries to resolve
            //   if the client and server get too much out of sync.

            // We also have ping, which represents the ROUND-TRIP time for
            //   packets. In order to ensure the server accurately receives
            //   client input, we need the client to be at least (ping / 2) amount
            //   of time ahead of the server. Otherwise inputs will always
            //   be missed by the time it gets to the server.

            // To be safe, we target for the client to be (2 * ping) in front
            //   of the server.

            // When the client gets an update with server time,  T_s

            // Client too far ahead
            // if (lastTickTime > serverCurrentTickTime + (2 * ping)) {
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
                // lastTickTime = ((serverCurrentTickTime + ping) / TickInterval) * TickInterval;
                lastTickTime = ((serverCurrentTickTime + (ping)) / TickInterval) * TickInterval;
                // LOG_WARN("New Tick: " << lastTickTime);
                // game.RollbackTime(lastTickTime);
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

                Time ending = std::max(serverCurrentTickTime, lastTickTime);

                // LOG_DEBUG("Bringing to present (" << serverLastProcessedTime << ", " << serverCurrentTickTime << ") " << nextTick << " -> " << ending);
                // LOG_DEBUG("Bringing to present with " << (ending - nextTick) / TickInterval << " ticks!");

                // Maximum 30 ticks forward-wind
                size_t i = 0;
                while (nextTick <= ending) {
                    obj->Tick(nextTick);
                    nextTick += TickInterval;
                    if (i++ > 30) {
                        break;
                    }
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

    EMSCRIPTEN_KEEPALIVE
    void TickAudio() {
        clientAudio.Tick();
    }
}