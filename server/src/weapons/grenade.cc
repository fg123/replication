#include "grenade.h"
#include "game.h"
#include "explosion.h"

GrenadeObject::GrenadeObject(Game& game, ObjectID playerId) : ThrownProjectile(game, playerId) {
    // Don't Collide with Weapons
    collisionExclusion |= (uint64_t) Tag::WEAPON;
    SetModel(game.GetModel("Grenade.obj"));
    GenerateOBBCollidersFromModel(this);
    game.PlayAudio("GrenadeOut.wav", 1.f, this);
    airFriction = Vector3(0.97);
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
    Object* explode = game.LoadScriptedObject("Explosion");
    explode->SetPosition(GetPosition());
    game.DestroyObject(GetId());
#endif
// #ifdef BUILD_SERVER
//     ExplosionObject* explode = new ExplosionObject(game, playerId, damageRange, damage);
//     explode->SetPosition(GetPosition());
//     game.AddObject(explode);
//     game.DestroyObject(GetId());
// #endif
}