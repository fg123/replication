#include "arrow.h"
#include "game.h"
#include "player.h"

ArrowObject::ArrowObject(Game& game) : ThrownProjectile(game) {
    // Don't Collide with Weapons
    collideExclusion |= (uint64_t) Tag::WEAPON;
    AddCollider(new CircleCollider(this, Vector2(0, 0), 3.0));
    airFriction = Vector2(1, 1);
}

void ArrowObject::OnCollide(CollisionResult& result) {
    if (result.collidedWith->IsTagged(Tag::WEAPON)) {
        // Ignore
        return;
    }

    // Check Player Hit
    if (!hitPlayer && result.collidedWith->IsTagged(Tag::PLAYER)) {
        hitPlayer = true;
        static_cast<PlayerObject*>(result.collidedWith)->DealDamage(50);
        SetVelocity(Vector2::Zero);
    }
    else if (result.collidedWith->IsStatic() && !IsStatic()) {
        SetIsStatic(true);
        collideExclusion |= (uint64_t) Tag::PLAYER;
    }

    // game.QueueNextTick([this](Game& game) {
    //     game.DestroyObject(GetId());
    // });
}

void ArrowObject::Tick(Time time) {
    ThrownProjectile::Tick(time);
    if (timeLanded == 0 && IsStatic()) {
        timeLanded = time;
    }
    timeSinceLanded = time - timeLanded;
#ifdef BUILD_SERVER
    if (timeLanded != 0 && timeSinceLanded > timeBeforeDie) {
        game.DestroyObject(GetId());
    }
#endif
}

void ArrowObject::Serialize(json& obj) {
    ThrownProjectile::Serialize(obj);
    obj["hp"] = hitPlayer;
}

void ArrowObject::ProcessReplication(json& obj) {
    ThrownProjectile::ProcessReplication(obj);
    hitPlayer = obj["hp"];
}