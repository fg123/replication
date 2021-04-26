#include "grenade.h"
#include "game.h"
#include "explode.h"

GrenadeObject::GrenadeObject(Game& game) : ThrownProjectile(game) {
    // Don't Collide with Weapons
    collisionExclusion |= (uint64_t) Tag::WEAPON;
    AddCollider(new CircleCollider(this, Vector3(), 5.0));
    airFriction = Vector3(1, 1, 0);
}

void GrenadeObject::OnCollide(CollisionResult& result) {
    if (result.collidedWith->IsTagged(Tag::WEAPON)) {
        // Ignore
        return;
    }
    if (result.collidedWith->IsStatic()) {
        // Prime Grenade, once it lands it sticks
        isPrimed = true;
        SetIsStatic(true);
        collisionExclusion |= (uint64_t) Tag::PLAYER;
    }
}

void GrenadeObject::Tick(Time time) {
    ThrownProjectile::Tick(time);
    if (isPrimed && startTickingTime == 0) {
        startTickingTime = time;
    }
    else if (isPrimed) {
        tickTimeDiff = time - startTickingTime;
        if (tickTimeDiff > tickBeforeExplode) {
            Explode();
        }
    }
}

void GrenadeObject::Explode() {
    // IMPLEMENT EXPLODE, scale damage as required
    std::vector<Game::RangeQueryResult> results;
    game.GetUnitsInRange(position, damageRange, false, results);

    for (auto& result : results) {
        // Flat Damage for now
        if (result.first->IsTagged(Tag::PLAYER)) {
            static_cast<PlayerObject*>(result.first)->DealDamage(damage);
        }
    }
#ifdef BUILD_SERVER
    game.DestroyObject(GetId());
    game.QueueAnimation(new ExplodeAnimation(position, damageRange));
#endif
}

void GrenadeObject::Serialize(JSONWriter& obj) {
    ThrownProjectile::Serialize(obj);
    obj.Key("ip");
    obj.Bool(isPrimed);
    obj.Key("ttf");
    obj.Uint64(tickTimeDiff);
}

void GrenadeObject::ProcessReplication(json& obj) {
    ThrownProjectile::ProcessReplication(obj);
    isPrimed = obj["ip"].GetBool();
    tickTimeDiff = obj["ttf"].GetUint64();
}
