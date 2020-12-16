#include "player.h"
#include "collision.h"
#include "game.h"

PlayerObject::PlayerObject(Game& game, Vector2 position) : Object(game) {
    SetTag(Tag::PLAYER);
    SetPosition(position);
    AddCollider(new CircleCollider(this, Vector2(0, -15), 10.0));
    AddCollider(new RectangleCollider(this, Vector2(-15, -5), Vector2(30, 33)));

    WeaponObject* obj = new WeaponObject(game, Vector2::Zero);
    game.AddObject(obj);
    PickupWeapon(obj);
}

void PlayerObject::OnDeath() {
    // This calls before you get destructed, but client will already know you're
    //   dead (but you don't actually get GCed until next tick)
    DropWeapon();
}

PlayerObject::~PlayerObject() {
    DropWeapon();
}

void PlayerObject::PickupWeapon(WeaponObject* weapon) {
    weapon->AttachToPlayer(this);
    currentWeapon = weapon;
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
    const Vector2& position = GetPosition();
    aimAngle = std::atan2(mousePosition.y - position.y, mousePosition.x - position.x);
    Object::Tick(time);
}

void PlayerObject::Serialize(json& obj) {
    Object::Serialize(obj);
    obj["h"] = health;
    obj["aa"] = aimAngle;
    if (currentWeapon) {
        obj["w"] = currentWeapon->GetId();
    }
    else {
        obj["w"] = nullptr;
    }
}