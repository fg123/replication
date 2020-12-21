#include "weapon.h"
#include "player.h"
#include "bullet.h"
#include "game.h"

#include <iostream>
#include <exception>

WeaponObject::WeaponObject(Game& game, Vector2 position) : WeaponObject(game) {
    SetPosition(position);
    // No Colliders
    collideExclusion |= (uint64_t)Tag::PLAYER;
    SetTag(Tag::WEAPON);
    Detach();
}

void WeaponObject::AttachToPlayer(PlayerObject* player) {
    if (player == nullptr) {
        std::cout << "Can't attach to null! Use Detach() instead!" << std::endl;
        throw std::runtime_error("Can't attach to null! Use Detach() instead!");
    }
    if (attachedTo != nullptr && attachedTo != player) {
        std::cout << "Weapon already attached!" << std::endl;
        throw std::runtime_error("Weapon already attached!");
    }
    else if (player == attachedTo) {
        return;
    }
    attachedTo = player;
    SetDirty(true);
    // No Collision
    collideExclusion |= (uint64_t)Tag::OBJECT;
}

void WeaponObject::Detach() {
    attachedTo = nullptr;
    SetVelocity(Vector2::Zero);
    collideExclusion &= ~(uint64_t)Tag::OBJECT;
    SetDirty(true);
}

void WeaponObject::Tick(Time time) {
    Object::Tick(time);
    if (attachedTo) {
        // Attached!
        SetPosition(attachedTo->GetAttachmentPoint());
        SetVelocity(attachedTo->GetVelocity());
    }
}

void WeaponObject::Serialize(json& obj) {
    Object::Serialize(obj);
    if (attachedTo) {
        obj["attach"] = attachedTo->GetId();
    }
}

void WeaponObject::ProcessReplication(json& obj) {
    Object::ProcessReplication(obj);
    if (obj.contains("attach")) {
        attachedTo = game.GetObject<PlayerObject>(obj["attach"]);
    }
    else {
        attachedTo = nullptr;
    }
}
