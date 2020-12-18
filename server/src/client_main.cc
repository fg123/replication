#include <emscripten.h>

#include <iostream>
#include "game.h"
#include "objects/player.h"
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
        // std::cout << input << std::endl;
        json object = json::parse(input);
        game.ProcessReplication(object);
    }

    EMSCRIPTEN_KEEPALIVE
    void HandleLocalInput(ObjectID object, const char* input) {
        //std::cout << object << " " << input << std::endl; 
        Object* obj = game.GetObject(object);
        if (obj) {
            json object = json::parse(input);
            static_cast<PlayerObject*>(obj)->ProcessInputData(object);
        }
    }
}