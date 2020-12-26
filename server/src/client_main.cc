#include <emscripten.h>

#include "logging.h"

#include "game.h"
#include "objects/player.h"
#include "object.h"
#include "json/json.hpp"

// We probably need to include all these so it registers
#include "characters/marine.h"
#include "characters/archer.h"
#include "characters/hookman.h"

extern "C" {
    /** Client Interface for the JS Front End */

    EMSCRIPTEN_KEEPALIVE
    ObjectID localClientId;

    EMSCRIPTEN_KEEPALIVE
    Game game;

    EMSCRIPTEN_KEEPALIVE
    std::vector<json> inputEvents;

    EMSCRIPTEN_KEEPALIVE
    Time lastReplicatedTime = 0;

    EMSCRIPTEN_KEEPALIVE
    void SetLocalPlayerClient(ObjectID client) {
        localClientId = client;
    }

    EMSCRIPTEN_KEEPALIVE
    void TickGame(Time time) {
        try {
            game.Tick(time);
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
        json object;
        obj->Serialize(object);
        std::string s = object.dump();
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
            json object = json::parse(input);
            object["time"] = (uint32_t) object["time"];
            inputEvents.emplace_back(object);
            static_cast<PlayerObject*>(obj)->ProcessInputData(object);
        }
    }

    EMSCRIPTEN_KEEPALIVE
    void HandleReplicate(const char* input) {
        try {
            json object = json::parse(input);

            for (auto& event : object["objs"]) {
                game.EnsureObjectExists(event);
            }
            for (auto& event : object["objs"]) {
                game.ProcessReplication(event);
            }

            // Resolve Inputs:
            Time newTime = (uint32_t) object["time"];
            // LOG_DEBUG("New Time " << newTime << " Last Replicated " << lastReplicatedTime);
            size_t thingsToDelete = 0;
            for (;thingsToDelete < inputEvents.size(); thingsToDelete++) {
                // LOG_DEBUG("Input Event Time " << inputEvents[thingsToDelete]["time"]);
                if (inputEvents[thingsToDelete]["time"] > newTime) break;
            }
            // LOG_DEBUG("To Delete: " << thingsToDelete);
            inputEvents.erase(inputEvents.begin(), inputEvents.begin() + thingsToDelete);
            // Reapply inputs that server doesn't have yet

            Object* obj = game.GetObject(localClientId);
            lastReplicatedTime = newTime;

            if (obj && newTime != 0) {
                // Replay Actions to Now
                // LOG_DEBUG("Replaying actions... Start Tick: " << newTime);
                // game.RollbackTime(newTime);
                obj->SetLastTickTime(newTime);
                // LOG_DEBUG(inputEvents.size() << " queued locally!");
                Time nextTick = newTime;
                for (auto& jsonEvent : inputEvents) {
                    Time eventTime = jsonEvent["time"];
                    while (nextTick < eventTime) {
                        obj->Tick(nextTick);
                        nextTick += (1000.0 / TickRate);
                        // LOG_DEBUG(nextTick << " " << eventTime);
                    }
                    static_cast<PlayerObject*>(obj)->ProcessInputData(jsonEvent);
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