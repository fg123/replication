#include "weapon.h"
#include "player.h"
#include "game.h"
#include "logging.h"

#include <exception>

WeaponObject::WeaponObject(Game& game, Vector3 position) : Object(game) {
    SetPosition(position);
    // No Colliders
    collisionExclusion |= (uint64_t)Tag::PLAYER;
    SetTag(Tag::WEAPON);
    Detach();
}

void WeaponObject::AttachToPlayer(PlayerObject* player, WeaponAttachmentPoint inAttachmentPoint) {
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
    LOG_DEBUG("Weapon Attach");
    // Associate hierarchy
    attachmentPoint = inAttachmentPoint;

    game.AssignParent(this, player);
    attachedTo = player;
    SetDirty(true);
    // No Collision
    collisionExclusion |= (uint64_t)Tag::OBJECT;
    SetTag(Tag::NO_KILLPLANE);
    SetTag(Tag::NO_GRAVITY);
}

void WeaponObject::Detach() {
    game.DetachParent(this);
    attachedTo = nullptr;
    SetVelocity(Vector3());
    collisionExclusion &= ~(uint64_t)Tag::OBJECT;
    RemoveTag(Tag::NO_KILLPLANE);
    RemoveTag(Tag::NO_GRAVITY);
    SetDirty(true);
}

void WeaponObject::Tick(Time time) {
    Object::Tick(time);
    if (attachedTo) {
        // Attached!
        SetIsStatic(false);
        SetPosition(attachedTo->GetAttachmentPoint(attachmentPoint));
        SetVelocity(attachedTo->GetVelocity());
        SetRotation(attachedTo->GetRotationWithPitch());
        #ifdef BUILD_CLIENT
            clientPosition = GetPosition();
            clientRotation = GetRotation();
            clientScale = GetScale();
        #endif

        if (attachedTo->GetCurrentWeapon() == this) {
            SetScale(Vector3(1));
            SetDirty(true);
        }
        else if (!IsZero(GetScale())) {
            SetScale(Vector3(0));
            SetDirty(true);
        }
    }
    else {
        if (isGrounded) {
            SetIsStatic(true);
        }
        if (IsZero(GetScale())) {
            SetScale(Vector3(1));
            SetDirty(true);
        }
        #ifdef BUILD_CLIENT
            if (PlayerObject* player = game.GetLocalPlayer()) {
                if (GetId() == player->pointedToObject) {
                    SetTag(Tag::DRAW_OUTLINE);
                }
                else {
                    RemoveTag(Tag::DRAW_OUTLINE);
                }
            }
        #endif
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


void WeaponWithCooldown::Tick(Time time) {
    WeaponObject::Tick(time);
    // Let server dictate
#ifdef BUILD_SERVER
    // LOG_DEBUG("CD " << cooldown);
    if (lastUseTime + cooldown < time) {
        currentCooldown = 0;
    }
    else {
        currentCooldown = (lastUseTime + cooldown) - time;
    }
    if (attachedTo) {
        SetDirty(true);
    }
    // LOG_DEBUG("LUT: " << lastUseTime << " CD: " << currentCooldown);
#endif

}

void WeaponWithCooldown::CooldownStart(Time time) {
    lastUseTime = time;
}

void WeaponWithCooldown::ResetCooldown() {
    lastUseTime = 0;
}