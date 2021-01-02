#include <emscripten.h>

#include "logging.h"

#include <deque>

#include "game.h"
#include "objects/player.h"
#include "object.h"
#include "json/json.hpp"
#include "perf.h"

// We probably need to include all these so it registers
#include "characters/marine.h"
#include "characters/archer.h"
#include "characters/hookman.h"

static const size_t MAX_INPUT_EVENT_QUEUE = 100;

extern "C" {
    /** Client Interface for the JS Front End */

    EMSCRIPTEN_KEEPALIVE
    ObjectID localClientId;

    EMSCRIPTEN_KEEPALIVE
    Game game;

    EMSCRIPTEN_KEEPALIVE
    std::deque<JSONDocument> inputEvents;

    EMSCRIPTEN_KEEPALIVE
    void SetLocalPlayerClient(ObjectID client) {
        localClientId = client;
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
    const char* GetObjectSerialized(ObjectID objectId) {
        Object* obj = game.GetObject(objectId);
        rapidjson::StringBuffer buffer;
        rapidjson::Writer writer(buffer);

        writer.StartObject();
        obj->Serialize(writer);
        writer.EndObject();

        std::string s { buffer.GetString() };
        size_t length = s.size() + 1;
        char* writable = new char[length];
        std::copy(s.begin(), s.end(), writable);
        writable[length - 1] = 0;
        return writable;
    }

    EMSCRIPTEN_KEEPALIVE
    void HandleLocalInput(ObjectID object, const char* input) {
        Object* obj = game.GetObject(object);
        if (obj) {
            if (inputEvents.size() > MAX_INPUT_EVENT_QUEUE) {
                LOG_WARN("Local input queue > " << MAX_INPUT_EVENT_QUEUE << ", server crashed?");
                return;
            }
            inputEvents.emplace_back();
            inputEvents.back().Parse(input);
            static_cast<PlayerObject*>(obj)->OnInput(inputEvents.back());
        }
    }

    EMSCRIPTEN_KEEPALIVE
    void HandleReplicate(const char* input) {
        // LOG_DEBUG("Handle Replicate");
        try {
            Vector2 oldPosition, serverPosition;
            if (Object* obj = game.GetObject(localClientId)) {
                // LOG_DEBUG("OldPosition Tick Time" << lastTickTime);
                oldPosition = obj->GetPosition();
            }
            JSONDocument object;
            object.Parse(input);

            bool hasPlayerIn = false;

            std::unordered_set<ObjectID> replicateIds;

            for (auto& event : object["objs"].GetArray()) {
                ObjectID ids = event["id"].GetUint();
                // replicateIds.insert(ids);
                if (ids == localClientId) {
                    hasPlayerIn = true;
                    replicateIds.insert(ids);
                }
                game.EnsureObjectExists(event);
            }

            for (auto& event : object["objs"].GetArray()) {
                game.ProcessReplication(event);
            }

            // If the replication doesn't correct player position, we can't
            //   assume we need to roll back.
            if (!hasPlayerIn) return;

            if (Object* obj = game.GetObject(localClientId)) {
                serverPosition = obj->GetPosition();
            }

            Time serverLastProcessedTime = object["time"].GetUint();

            // Calculate where the server is now
            uint64_t ticksSinceLastProcessed = object["ticks"].GetUint64();
            // LOG_DEBUG("serverLastProcessedTime " << serverLastProcessedTime << " ticksSinceLastProcessed" << ticksSinceLastProcessed);
            Time serverCurrentTickTime = serverLastProcessedTime +
                (ticksSinceLastProcessed * TickInterval);

            // Delete inputs that the server has already processed (or that are too late?)
            while (!inputEvents.empty()) {
                if (inputEvents.front()["time"].GetUint64() < serverLastProcessedTime) {
                    inputEvents.pop_front();
                }
                else {
                    break;
                }
            }

            // Client too far ahead
            if (lastTickTime > serverCurrentTickTime + 1000) {
                LOG_DEBUG("Client ahead by " << lastTickTime - serverCurrentTickTime << ", resetting!");
                lastTickTime = serverCurrentTickTime;
                game.RollbackTime(lastTickTime);
                inputEvents.clear();
            }
            else if (lastTickTime < serverCurrentTickTime) {
                LOG_WARN("Server faster than client! Last tick client: " << lastTickTime << " Server Current: " << serverCurrentTickTime);
                // All inputs are non relevant anyway, shift client to present and just call it.
                inputEvents.clear();
                lastTickTime = (serverCurrentTickTime + ping) % TickInterval;
                return;
            }

            // There's a chance here that the server has gone on faster than us, but has not
            //    processed our input yet.
            // Regardless, start game back at oldest known state.

            // Queue up inputs that the server hasn't processed yet
            Time nextTick = serverCurrentTickTime;
            if (!inputEvents.empty() && inputEvents.front()["time"].GetUint64() < nextTick) {
                nextTick = inputEvents.front()["time"].GetUint64();
            }

            if (Object* obj = game.GetObject(localClientId)) {
                // obj->SetLastTickTime(nextTick - TickInterval);
                for (ObjectID objId : replicateIds) {
                    if (Object* replicateObj = game.GetObject(objId)) {
                        replicateObj->SetLastTickTime(nextTick - TickInterval);
                    }
                }

                for (auto& jsonEvent : inputEvents) {
                    // Queue into Buffer
                    static_cast<PlayerObject*>(obj)->OnInput(jsonEvent);
                }

                Time ending = std::max(serverCurrentTickTime + ping, lastTickTime);

                // LOG_DEBUG("Bringing to present (" << serverLastProcessedTime << ", " << serverCurrentTickTime << ") " << nextTick << " -> " << ending);
                // LOG_DEBUG("Bringing to present with " << (ending - nextTick) / TickInterval << " ticks!");
                while (nextTick < ending) {
                    // obj->Tick(nextTick);
                    for (ObjectID objId : replicateIds) {
                        if (Object* replicateObj = game.GetObject(objId)) {
                            replicateObj->Tick(nextTick);
                        }
                    }
                    nextTick += TickInterval;
                }
            }
            // LOG_DEBUG("To Present Done!");

            // Make sure this is never negative!!!
            if (nextTick > TickInterval) {
                lastTickTime = nextTick - TickInterval;
            }

            if (Object* obj = game.GetObject(localClientId)) {
                Vector2 newPosition = obj->GetPosition();
                Vector2 difference = (newPosition - oldPosition);
                if (difference.Length() > 5.0) {
                    LOG_DEBUG("Server Position Desync: " << newPosition << " - " << oldPosition << " = " << (newPosition - oldPosition));
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
}