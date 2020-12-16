#ifndef PLAYER_OBJECT_H
#define PLAYER_OBJECT_H

#include "circle.h"
#include "vector.h"
#include "game.h"

#include <mutex>

class PlayerObject : public CircleObject {

public:
    std::mutex socketDataMutex;
    std::unordered_set<std::string> keyboardState;

    PlayerObject(Game& game, Vector2 position) :
        CircleObject(game, position, 20.0) {
            SetTag(Tag::PLAYER);
        }

    virtual void Tick(Time time) override {
        std::scoped_lock lock(socketDataMutex);
        Vector2 velocity = GetVelocity();
        if (keyboardState.find("a") != keyboardState.end()) {
            velocity.x = -300;
        }
        if (keyboardState.find("d") != keyboardState.end()) {
            velocity.x = 300;
        }
        if (keyboardState.find("w") != keyboardState.end()) {
            // Can only jump if touching ground
            if (IsGrounded()) {
                velocity.y = -1000;
            }
        }
        // if (keyboardState.find("s") != keyboardState.end()) {
        //     velocity.y = 300;
        // }
        SetVelocity(velocity);
        CircleObject::Tick(time);
    }

    virtual const char* GetClass() override { return "Marine"; }
};

#endif