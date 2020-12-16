#include "player.h"
#include "collision.h"

PlayerObject::PlayerObject(Game& game, Vector2 position) : Object(game) {
    SetTag(Tag::PLAYER);
    SetPosition(position);
    AddCollider(new CircleCollider(this, Vector2(0, -15), 10.0));
    AddCollider(new RectangleCollider(this, Vector2(-15, -5), Vector2(30, 33)));
}

void PlayerObject::Tick(Time time)  {
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
        // velocity.y = -300;
    }
    // if (keyboardState.find("s") != keyboardState.end()) {
    //     velocity.y = 300;
    // }
    SetVelocity(velocity);
    Object::Tick(time);
}

void PlayerObject::Serialize(json& obj) {
    Object::Serialize(obj);
    obj["h"] = health;
}