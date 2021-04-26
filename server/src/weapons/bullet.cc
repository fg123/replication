#include "bullet.h"
#include "game.h"
#include "player.h"

BulletObject::BulletObject(Game& game, int damage) : Object(game), damage(damage) {
    // Bullets should not affect anyone's position
    collisionExclusion = (uint64_t) Tag::OBJECT;

    SetTag(Tag::NO_GRAVITY);
    AddCollider(new CircleCollider(this, Vector3(), 3.0));
    airFriction = Vector3(1, 1, 0);
}

BulletObject::BulletObject(Game& game) : BulletObject(game, 0) {

}

void BulletObject::OnCollide(CollisionResult& result) {

    // Check Player Hit
#ifdef BUILD_SERVER
    if (result.collidedWith->IsTagged(Tag::PLAYER)) {
        static_cast<PlayerObject*>(result.collidedWith)->DealDamage(damage);
    }
#endif

    game.DestroyObject(GetId());
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