#include "hook.h"

HookObject::HookObject(Game& game) : ThrownProjectile(game) {
    // Don't Collide with Weapons
    collideExclusion |= (uint64_t) Tag::WEAPON;
    SetTag(Tag::NO_GRAVITY);
    AddCollider(new CircleCollider(this, Vector2(0, 0), 5.0));
    airFriction = Vector2(1, 1);
}


void HookObject::OnCollide(CollisionResult& result) {
    if (result.collidedWith->IsTagged(Tag::WEAPON)) {
        // Ignore
        return;
    }
    if (result.collidedWith->IsStatic()) {
        SetIsStatic(true);
        collideExclusion |= (uint64_t) Tag::PLAYER;
    }
}

void HookObject::Tick(Time time) {
    ThrownProjectile::Tick(time);
    bool isDead = false;
    if (!IsStatic() &&
        firedBy->GetAttachedTo()->GetPosition().Distance(GetPosition()) > 500) {
        isDead = true;

    }
    else if (IsStatic()) {
        Vector2 position = firedBy->GetAttachedTo()->GetPosition();
        Vector2 velocity = firedBy->GetAttachedTo()->GetVelocity();
        Vector2 direction = (GetPosition() - position).Normalize();
        Vector2 aimDirection = firedBy->GetAttachedTo()->GetAimDirection();
        velocity = (direction + aimDirection).Normalize() * 1000;
        firedBy->GetAttachedTo()->SetVelocity(velocity);
        hasForceBeenApplied = true;

        // TODO: Cut off the rope if it intersects map object
        CollisionResult r = game.CheckLineSegmentCollide(position + direction * 10,
            GetPosition() - (direction * 10), (uint64_t)Tag::GROUND);
        if (r.isColliding) {
            isDead = true;
        }
    }
    if (hasForceBeenApplied &&
        firedBy->GetAttachedTo()->GetPosition().Distance(GetPosition()) < 100) {
        isDead = true;
    }
#ifdef BUILD_SERVER
    if (isDead) {
        game.DestroyObject(GetId());
    }
#endif
}

void HookObject::Serialize(json& obj) {
    ThrownProjectile::Serialize(obj);
    obj["owner"] = firedBy->GetAttachedTo()->GetId();
}

void HookObject::ProcessReplication(json& obj) {
    ThrownProjectile::ProcessReplication(obj);
}

