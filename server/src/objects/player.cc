#include "player.h"
#include "collision.h"
#include "game.h"

#include <iostream>

static const int LEFT_MOUSE_BUTTON = 1;

PlayerObject::PlayerObject(Game& game) : Object(game) {
    airFriction.x = 0.9;
}

PlayerObject::PlayerObject(Game& game, Vector2 position) : PlayerObject(game) {
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

Vector2 PlayerObject::GetAimDirection() const {
    return Vector2(std::cos(aimAngle), std::sin(aimAngle));
}

void PlayerObject::PickupWeapon(WeaponObject* weapon) {
    weapon->AttachToPlayer(this);
    currentWeapon = weapon;
}

void PlayerObject::Tick(Time time)  {
    std::scoped_lock lock(socketDataMutex);
    Vector2 velocity = GetVelocity();
    if (keyboardState.find("a") != keyboardState.end()) {
        velocity.x = -200;
    }
    if (keyboardState.find("d") != keyboardState.end()) {
        velocity.x = 200;
    }
    if (keyboardState.find("g") != keyboardState.end()) {
        DropWeapon();
    }
    if (keyboardState.find("w") != keyboardState.end()) {
        // Can only jump if touching ground
        if (IsGrounded()) {
            velocity.y = -1000;
        }
        // velocity.y = -300;
    }
    if (mouseState[LEFT_MOUSE_BUTTON]) {
        if (currentWeapon) {
            currentWeapon->Fire(time);
        }
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
}

void PlayerObject::ProcessReplication(json& obj) {
    Object::ProcessReplication(obj);
    health = obj["h"];
    aimAngle = obj["aa"];
    if (obj.contains("w")) {
        currentWeapon = game.GetObject<WeaponObject>(obj["w"]);
    }
    else {
        currentWeapon = nullptr;
    }
}

void PlayerObject::DropWeapon()  {
    if (currentWeapon) {
        // Throw Weapon
        currentWeapon->Detach();
        currentWeapon->SetVelocity(GetAimDirection() * 500.0);
        currentWeapon = nullptr;
        canPickupTime = game.GetGameTime() + 500;
    }
}

void PlayerObject::OnCollide(CollisionResult& result) {
    if (!currentWeapon && result.collidedWith->IsTagged(Tag::WEAPON)) {
        if (game.GetGameTime() > canPickupTime) {
            PickupWeapon(static_cast<WeaponObject*>(result.collidedWith));
        }
    }
    Object::OnCollide(result);
}

void PlayerObject::DealDamage(int damage) {
    health -= damage;
    if (health < 0) {
        health = 100;
    }
}

void PlayerObject::ProcessInputData(json& obj) {
    if (obj["event"] == "ku") {
        std::string key = obj["key"];
        std::scoped_lock lock(socketDataMutex);
        keyboardState.erase(key);
    }
    else if (obj["event"] == "kd") {
        std::string key = obj["key"];
        std::scoped_lock lock(socketDataMutex);
        keyboardState.insert(key);
    }
    else if (obj["event"] == "mm") {
        std::scoped_lock lock(socketDataMutex);
        mousePosition.x = obj["x"];
        mousePosition.y = obj["y"];
    }
    else if (obj["event"] == "md") {
        int button = obj["button"];
        std::scoped_lock lock(socketDataMutex);
        if (button >= 0 && button < 5) {
            mouseState[button] = true;
        }
    }
    else if (obj["event"] == "mu") {
        int button = obj["button"];
        std::scoped_lock lock(socketDataMutex);
        if (button >= 0 && button < 5) {
            mouseState[button] = false;
        }
    }
}