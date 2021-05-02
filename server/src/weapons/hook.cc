#include "hook.h"

HookObject::HookObject(Game& game) : ThrownProjectile(game) {
    // Don't Collide with Weapons
    collisionExclusion |= (uint64_t) Tag::WEAPON;
    collisionExclusion |= (uint64_t) Tag::PLAYER;
    SetTag(Tag::NO_GRAVITY);
    AddCollider(new CircleCollider(this, Vector3(0, 0, 0), 5.0));
    airFriction = Vector3(1, 1, 0);
}


void HookObject::OnCollide(CollisionResult& result) {
    if (result.collidedWith->IsTagged(Tag::WEAPON)) {
        // Ignore
        return;
    }
    if (result.collidedWith->IsStatic()) {
        SetIsStatic(true);
        collisionExclusion |= (uint64_t) Tag::PLAYER;
    }
}

void HookObject::Tick(Time time) {
    ThrownProjectile::Tick(time);
    bool isDead = false;
    if (!IsStatic() &&
        glm::distance(firedBy->GetAttachedTo()->GetPosition(), GetPosition()) > 500) {
        isDead = true;

    }
    else if (IsStatic()) {
        Vector3 position = firedBy->GetAttachedTo()->GetPosition();
        Vector3 velocity = firedBy->GetAttachedTo()->GetVelocity();
        // Make regular direction twice as powerful as the aiming pull
        Vector3 direction = glm::normalize(GetPosition() - position) * 5.0f;
        Vector3 aimDirection = firedBy->GetAttachedTo()->GetAimDirection();
        velocity = glm::normalize(direction + aimDirection) * 1000.0f;
        firedBy->GetAttachedTo()->SetVelocity(velocity);
        hasForceBeenApplied = true;

        // TODO: Cut off the rope if it intersects map object
        CollisionResult r = game.CheckLineSegmentCollide(position + direction * 10.0f,
            GetPosition() - (direction * 10.0f), (uint64_t)Tag::GROUND);
        if (r.isColliding) {
            isDead = true;
        }
    }
    if (hasForceBeenApplied &&
        glm::distance(firedBy->GetAttachedTo()->GetPosition(), GetPosition()) < 100) {
        isDead = true;
    }
#ifdef BUILD_SERVER
    if (isDead) {
        game.DestroyObject(GetId());
    }
#endif
}

void HookObject::Serialize(JSONWriter& obj) {
    ThrownProjectile::Serialize(obj);
    obj.Key("owner");
    obj.Uint(firedBy->GetAttachedTo()->GetId());
}

void HookObject::ProcessReplication(json& obj) {
    ThrownProjectile::ProcessReplication(obj);
}

