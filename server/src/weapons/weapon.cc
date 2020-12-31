#include "weapon.h"
#include "player.h"
#include "bullet.h"
#include "game.h"
#include "logging.h"

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
        LOG_ERROR("Can't attach to null! Use Detach() instead!");
        throw std::runtime_error("Can't attach to null! Use Detach() instead!");
    }
    if (attachedTo != nullptr && attachedTo != player) {
        LOG_ERROR("Weapon already attached!");
        throw std::runtime_error("Weapon already attached!");
    }
    else if (player == attachedTo) {
        return;
    }
    attachedTo = player;
    SetDirty(true);
    // No Collision
    collideExclusion |= (uint64_t)Tag::OBJECT;
    SetTag(Tag::NO_KILLPLANE);
}

void WeaponObject::Detach() {
    attachedTo = nullptr;
    SetVelocity(Vector2::Zero);
    collideExclusion &= ~(uint64_t)Tag::OBJECT;
    RemoveTag(Tag::NO_KILLPLANE);
    SetDirty(true);
}

void WeaponObject::Tick(Time time) {
    Object::Tick(time);
    if (attachedTo) {
        // Attached!
        // SetPosition(attachedTo->GetAttachmentPoint());
        SetTag(Tag::NO_GRAVITY);
        // SetVelocity(attachedTo->GetVelocity());
    }
    else {
        RemoveTag(Tag::NO_GRAVITY);
    }
}

void WeaponObject::Serialize(JSONWriter& obj) {
    Object::Serialize(obj);
    if (attachedTo) {
        obj.Key("attach");
        obj.Uint(attachedTo->GetId());
    }
}

void WeaponObject::ProcessReplication(json& obj) {
    Object::ProcessReplication(obj);
    if (obj.HasMember("attach")) {
        attachedTo = game.GetObject<PlayerObject>(obj["attach"].GetUint());
    }
    else {
        attachedTo = nullptr;
    }
}
