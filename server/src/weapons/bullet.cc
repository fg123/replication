#include "bullet.h"
#include "game.h"
#include "player.h"
#include "sprite.h"

BulletObject::BulletObject(Game& game, int damage, RayCastResult rayResult) :
    Object(game),
    damage(damage),
    rayResult(rayResult) {
    // Bullets should not affect anyone's position
    collisionExclusion = (uint64_t) Tag::OBJECT;

    SetTag(Tag::NO_GRAVITY);

#ifdef BUILD_SERVER
    SetModel(game.GetModel("Bullet.obj"));
    GenerateAABBCollidersFromModel(this);
#endif

    //AddCollider(new CircleCollider(this, Vector3(), 3.0));
    airFriction = Vector3(1, 1, 1);
}

BulletObject::BulletObject(Game& game) : BulletObject(game, 0, RayCastResult()) {

}

void BulletObject::OnCollide(CollisionResult& result) {
    // Check Player Hit
    if (result.collidedWith->IsTagged(Tag::PLAYER)) {
        static_cast<PlayerObject*>(result.collidedWith)->DealDamage(damage);
    }

    game.DestroyObject(GetId());
}
