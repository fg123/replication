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
            inputEvents.emplace_back(object);
            static_cast<PlayerObject*>(obj)->OnInput(object);
        }
    }

    EMSCRIPTEN_KEEPALIVE
    void HandleReplicate(const char* input) {
        // LOG_DEBUG("Handle Replicate");
        try {
            Object* obj = game.GetObject(localClientId);
            Vector2 oldPosition, serverPosition;
            if (obj) {
                // LOG_DEBUG("OldPosition Tick Time" << lastTickTime);
                oldPosition = obj->GetPosition();
            }
            json object = json::parse(input);

            for (auto& event : object["objs"]) {
                game.EnsureObjectExists(event);
            }
            for (auto& event : object["objs"]) {
                game.ProcessReplication(event);
            }

            if (obj) {
                serverPosition = obj->GetPosition();
            }

            Time serverLastProcessedTime = (uint32_t) object["time"];
            if (!obj) return;


            // Calculate where the server is now
            uint64_t ticksSinceLastProcessed = object["ticks"];
            Time serverCurrentTickTime = serverLastProcessedTime +
                (ticksSinceLastProcessed * TickInterval);

            // Delete inputs that the server has already processed (or that are too late?)
            size_t thingsToDelete = 0;
            for (;thingsToDelete < inputEvents.size(); thingsToDelete++) {
                if (inputEvents[thingsToDelete]["time"] > serverLastProcessedTime) break;
            }
            inputEvents.erase(inputEvents.begin(), inputEvents.begin() + thingsToDelete);

            // There's a chance here that the server has gone on faster than us, but has not
            //    processed our input yet.
            // Regardless, start game back at oldest known state.

            // Queue up inputs that the server hasn't processed yet
            Time nextTick = serverCurrentTickTime;
            if (!inputEvents.empty() && inputEvents[0]["time"] < nextTick) {
                nextTick = inputEvents[0]["time"];
            }
            obj->SetLastTickTime(nextTick - TickInterval);
            for (auto& jsonEvent : inputEvents) {
                // Queue into Buffer
                static_cast<PlayerObject*>(obj)->OnInput(jsonEvent);
            }

            Time ending = std::max(serverCurrentTickTime + ping, lastTickTime);

            // LOG_DEBUG("Bringing to present (" << serverLastProcessedTime << ") " << nextTick << " -> " << ending);
            // LOG_DEBUG("Server Current Tick Time (" << serverCurrentTickTime << ") ");
            while (nextTick <= ending) {
                // LOG_DEBUG("Next Tick: " << nextTick);
                obj->Tick(nextTick);
                nextTick += TickInterval;
            }
            // LOG_DEBUG("To Present Done!");
            lastTickTime = nextTick;

            Vector2 newPosition = obj->GetPosition();
            Vector2 difference = (newPosition - oldPosition);
            if (difference.Length() > 5.0) {
                LOG_DEBUG("Server Position Desync: " << newPosition << " - " << oldPosition << " = " << (newPosition - oldPosition));
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