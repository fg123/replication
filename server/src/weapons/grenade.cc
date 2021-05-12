#include "grenade.h"
#include "game.h"
#include "explosion.h"

GrenadeObject::GrenadeObject(Game& game) : ThrownProjectile(game) {
    // Don't Collide with Weapons
    collisionExclusion |= (uint64_t) Tag::WEAPON;
    // AddCollider(new SphereCollider(this, Vector3(), 5.0));
    #ifdef BUILD_SERVER
        SetModel(game.GetModel("Grenade.obj"));
        GenerateAABBCollidersFromModel(this);
    #endif
    // airFriction = Vector3(1, 1, 1);
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
#ifdef BUILD_SERVER
    ExplosionObject* explode = new ExplosionObject(game, damageRange, damage);
    explode->SetPosition(GetPosition());
    game.AddObject(explode);
    game.DestroyObject(GetId());
#endif
}