#include "bullet.h"
#include "game.h"
#include "player.h"

BulletObject::BulletObject(Game& game) : Object(game) {
    // Don't Collide with Weapons
    collideExclusion |= (uint64_t) Tag::WEAPON;
    SetTag(Tag::NO_GRAVITY);
    AddCollider(new CircleCollider(this, Vector2(0, 0), 3.0));
    airFriction = Vector2(1, 1);
}

void BulletObject::OnCollide(CollisionResult& result) {
    if (dead) return;

    if (result.collidedWith->IsTagged(Tag::WEAPON)) {
        // Ignore
        return;
    }
    
    // Check Player Hit
    if (result.collidedWith->IsTagged(Tag::PLAYER)) {
        static_cast<PlayerObject*>(result.collidedWith)->DealDamage(11);
    }

    dead = true;
    
    game.QueueNextTick([this](Game& game) {
        game.DestroyObject(GetId());
    });
}