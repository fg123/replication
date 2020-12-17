#include "weapon.h"
#include "player.h"
#include "bullet.h"
#include "game.h"

#include <exception>

WeaponObject::WeaponObject(Game& game, Vector2 position) : Object(game) {
    SetPosition(position);
    // No Colliders
    collideExclusion |= (uint64_t)Tag::PLAYER;
    SetTag(Tag::WEAPON);
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
}

void WeaponObject::Detach() {
    attachedTo = nullptr;
    SetVelocity(Vector2::Zero);
    AddCollider(new RectangleCollider(this, Vector2(-3, -10), Vector2(74, 24)));
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
    else {
        obj["attach"] = nullptr;
    }
}

void WeaponObject::Fire(Time time) {
    if (time < nextFireTime) {
        return;
    }
    nextFireTime = time + (1000.0 / fireRate);

    BulletObject* bullet = new BulletObject(game);
    bullet->SetPosition(GetPosition() + attachedTo->GetAimDirection() * 30);
    bullet->SetVelocity(attachedTo->GetAimDirection() * 1000.0);
    game.AddObject(bullet);
}