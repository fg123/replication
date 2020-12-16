#include <emscripten.h>

#include <iostream>
#include "game.h"
#include "object.h"
#include "json/json.hpp"

extern "C" {
    /** Client Interface for the JS Front End */
    EMSCRIPTEN_KEEPALIVE
    Game game;

    EMSCRIPTEN_KEEPALIVE
    void TickGame(Time time) {
        game.Tick(time);
    }

    EMSCRIPTEN_KEEPALIVE
    double GetObjectX(ObjectID objectId) {
        Object* obj = game.GetObject(objectId);
        return obj->GetPosition().x;
    }

    EMSCRIPTEN_KEEPALIVE
    double GetObjectY(ObjectID objectId) {
        Object* obj = game.GetObject(objectId);
        return obj->GetPosition().y;
    }

    EMSCRIPTEN_KEEPALIVE
    void HandleReplicate(const char* input) {
        json object = json::parse(input);
        game.ProcessReplication(object);
    }
}