#include "grenade.h"
#include "game.h"

GrenadeObject::GrenadeObject(Game& game) : ThrownProjectile(game) {
    // Don't Collide with Weapons
    collideExclusion |= (uint64_t) Tag::WEAPON;
    AddCollider(new CircleCollider(this, Vector2(0, 0), 5.0));
    airFriction = Vector2(1, 1);
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
        collideExclusion |= (uint64_t) Tag::PLAYER;
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
    game.GetUnitsInRange(position, 200, false, results);

    // for (auto& result : results) {
    //     // Flat Damage for now
    //     result.first->Damage
    // }
#ifdef BUILD_SERVER
    game.DestroyObject(GetId());
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
