#include "weapon.h"
#include "player.h"

#include <exception>

WeaponObject::WeaponObject(Game& game, Vector2 position) : Object(game) {
    SetPosition(position);
    // No Colliders
}

void WeaponObject::AttachToPlayer(PlayerObject* player) {
    if (attachedTo) {
        throw std::runtime_error("Weapon already attached!");
    }
    else if (player == nullptr) {
        throw std::runtime_error("Can't attach to null! Use Detach() instead!");
    }
    attachedTo = player;
    if (attachedTo) {
        SetIsStatic(true);
    }
}

void WeaponObject::Detach() {
    attachedTo = nullptr;
    SetIsStatic(false);
}

void WeaponObject::Tick(Time time) {
    if (attachedTo) {
        // Attached!
        SetPosition(attachedTo->GetPosition());
        SetVelocity(attachedTo->GetVelocity());
    }
    Object::Tick(time);
}

void WeaponObject::Serialize(json& obj) {
    Object::Serialize(obj);
    if (attachedTo) {
        obj["attach"] = attachedTo->GetId();
    }
    else {
        obj["attach"] = nullptr;
    }
}