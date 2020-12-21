#include "grenade.h"
#include "game.h"

GrenadeObject::GrenadeObject(Game& game) : Object(game) {
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
    Object::Tick(time);
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
    // IMPLEMENT EXPLODE
    game.QueueNextTick([this](Game& game) {
        game.DestroyObject(GetId());
    });
}

void GrenadeObject::Serialize(json& obj) {
    Object::Serialize(obj);
    obj["ip"] = isPrimed;
    obj["ttf"] = tickTimeDiff;
}

void GrenadeObject::ProcessReplication(json& obj) {
    Object::ProcessReplication(obj);
    isPrimed = obj["ip"];
    tickTimeDiff = obj["ttf"];
}
