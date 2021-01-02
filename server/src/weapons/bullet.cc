#include "bullet.h"
#include "game.h"
#include "player.h"

BulletObject::BulletObject(Game& game, int damage) : Object(game), damage(0) {
    // Don't Collide with Weapons
    collideExclusion |= (uint64_t) Tag::WEAPON;
    SetTag(Tag::NO_GRAVITY);
    AddCollider(new CircleCollider(this, Vector2(0, 0), 3.0));
    airFriction = Vector2(1, 1);
}

BulletObject::BulletObject(Game& game) : BulletObject(game, 0) {

}

void BulletObject::OnCollide(CollisionResult& result) {
    if (dead) return;

    if (result.collidedWith->IsTagged(Tag::WEAPON)) {
        // Ignore
        return;
    }

    // Check Player Hit
    if (result.collidedWith->IsTagged(Tag::PLAYER)) {
        static_cast<PlayerObject*>(result.collidedWith)->DealDamage(damage);
    }

    dead = true;
    SetIsStatic(true);
    collideExclusion |= (uint64_t)Tag::OBJECT;
#ifdef BUILD_SERVER
    game.DestroyObject(GetId());
#endif
}

void BulletObject::Serialize(JSONWriter& obj) {
    Object::Serialize(obj);
    obj.Key("dmg");
    obj.Int(damage);
}

void BulletObject::ProcessReplication(json& obj) {
    Object::ProcessReplication(obj);
    damage = obj["dmg"].GetInt();
}