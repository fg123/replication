#include "arrow.h"
#include "game.h"
#include "player.h"

ArrowObject::ArrowObject(Game& game) : ThrownProjectile(game) {
    collisionExclusion = (uint64_t) Tag::OBJECT;
    AddCollider(new CircleCollider(this, Vector3(), 3.0));
    airFriction = Vector3(1, 1, 0);
}

void ArrowObject::OnCollide(CollisionResult& result) {
    // Check Player Hit
    if (!hitPlayer && result.collidedWith->IsTagged(Tag::PLAYER)) {
        hitPlayer = true;
    #ifdef BUILD_SERVER
        static_cast<PlayerObject*>(result.collidedWith)->DealDamage(50);
    #endif
        SetVelocity(Vector3());
    }
    else if (result.collidedWith->IsStatic() && !IsStatic()) {
        LOG_DEBUG("Setting to Static");
        SetIsStatic(true);
        savedVelocity = GetVelocity();
        collisionExclusion |= (uint64_t) Tag::PLAYER;
    }
}

void ArrowObject::Tick(Time time) {
    ThrownProjectile::Tick(time);
    if (timeLanded == 0 && IsStatic()) {
        timeLanded = time;
    }
    timeSinceLanded = time - timeLanded;
    if (IsStatic()) {
        // For display purposes
        SetVelocity(savedVelocity);
    }
#ifdef BUILD_SERVER
    if (timeLanded != 0 && timeSinceLanded > timeBeforeDie) {
        game.DestroyObject(GetId());
    }
#endif
}