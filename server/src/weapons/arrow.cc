#include "arrow.h"
#include "game.h"
#include "player.h"

ArrowObject::ArrowObject(Game& game, ObjectID playerId) : ThrownProjectile(game, playerId) {
    SetModel(game.GetModel("Arrow.obj"));
    AddCollider(new OBBCollider(this, Vector3(-0.15, -0.15, -0.15), Vector3(0.3, 0.3, 0.3)));
    airFriction = Vector3(1, 1, 1);
}

void ArrowObject::OnCollide(CollisionResult& result) {
    // Check Player Hit
    if (!hitPlayer && result.collidedWith->IsTagged(Tag::PLAYER)) {
        hitPlayer = true;
        static_cast<PlayerObject*>(result.collidedWith)->DealDamage(50, playerId);
        SetVelocity(Vector3());
    }
    else if (result.collidedWith->IsStatic() && !IsStatic()) {
        LOG_DEBUG("Arrow Setting to Static " << result.collisionDifference);
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
    SetRotation(DirectionToQuaternion(GetVelocity()));
#ifdef BUILD_SERVER
    if (timeLanded != 0 && timeSinceLanded > timeBeforeDie) {
        game.DestroyObject(GetId());
    }
#endif
}