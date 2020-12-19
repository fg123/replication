#include "weapon.h"
#include "player.h"
#include "bullet.h"
#include "game.h"

#include <exception>

WeaponObject::WeaponObject(Game& game, Vector2 position) : WeaponObject(game) {
    SetPosition(position);
    // No Colliders
    collideExclusion |= (uint64_t)Tag::PLAYER;
    SetTag(Tag::WEAPON);
    Detach();
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
        colliders.clear();
    }
    SetDirty(true);
}

void WeaponObject::Detach() {
    attachedTo = nullptr;
    SetVelocity(Vector2::Zero);
    AddCollider(new RectangleCollider(this, Vector2(-3, -10), Vector2(74, 24)));
    SetDirty(true);
}

void WeaponObject::Tick(Time time) {
    Object::Tick(time);
    if (attachedTo) {
        // Attached!
        SetPosition(attachedTo->GetPosition());
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
