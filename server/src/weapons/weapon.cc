#include "weapon.h"
#include "player.h"
#include "game.h"
#include "logging.h"

#include <exception>

WeaponObject::WeaponObject(Game& game, Vector3 position) : ScriptableObject(game) {
    SetPosition(position);
    // No Colliders
    collisionExclusion |= (uint64_t)Tag::PLAYER;
    SetTag(Tag::WEAPON);
    Detach();

    className = "Weapon";
}

void WeaponObject::AttachToPlayer(PlayerObject* player, WeaponAttachmentPoint inAttachmentPoint) {
    LOG_DEBUG("Weapon Attach");
    // Associate hierarchy
    attachmentPoint = inAttachmentPoint;

    game.AssignParent(this, player);
    SetDirty(true);
    // No Collision
    collisionExclusion |= (uint64_t)Tag::OBJECT;
    SetTag(Tag::NO_KILLPLANE);
    SetTag(Tag::NO_GRAVITY);
}

void WeaponObject::Detach() {
    game.DetachParent(this);
    SetVelocity(Vector3());
    collisionExclusion &= ~(uint64_t)Tag::OBJECT;
    RemoveTag(Tag::NO_KILLPLANE);
    RemoveTag(Tag::NO_GRAVITY);
    SetDirty(true);
}

#ifdef BUILD_CLIENT
void WeaponObject::PreDraw(Time time) {
    ScriptableObject::PreDraw(time);
     if (auto attachedTo = GetAttachedTo()) {
        clientPosition = GetAttachedTo()->GetAttachmentPoint(attachmentPoint);
        clientRotation = GetAttachedTo()->GetClientRotationWithPitch();
        clientScale = GetAttachedTo()->GetClientScale();
        if (attachedTo->GetCurrentWeapon() == this) {
            clientScale = Vector3(1);
        }
        else if (!IsZero(GetScale())) {
            clientScale = Vector3(0);
        }
     }
}
#endif

void WeaponObject::Tick(Time time) {
    ScriptableObject::Tick(time);
    if (auto attachedTo = GetAttachedTo()) {
        // Attached!
        SetIsStatic(false);
        SetPosition(attachedTo->GetAttachmentPoint(attachmentPoint));
        SetVelocity(attachedTo->GetVelocity());
        SetRotation(attachedTo->GetRotationWithPitch());
        // #ifdef BUILD_CLIENT
        //     clientPosition = GetPosition();
        //     clientRotation = GetRotation();
        //     clientScale = GetScale();
        // #endif

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

PlayerObject* WeaponObject::GetAttachedTo() {
    return dynamic_cast<PlayerObject*>(game.GetRelationshipManager().GetParent(GetId()));
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
    if (GetAttachedTo()) {
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