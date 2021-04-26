#ifndef ARTILLERY_STRIKE
#define ARTILLERY_STRIKE

#include "object.h"
#include "explode.h"

class ArtilleryObject : public Object {
    int damageRange = 100;
    int damage = 50;

public:
    CLASS_CREATE(ArtilleryObject)

    ArtilleryObject(Game& game) : Object(game) {
        collisionExclusion |= (uint64_t) Tag::WEAPON;
        collisionExclusion |= (uint64_t) Tag::PLAYER;
        AddCollider(new RectangleCollider(this, Vector3(-22, -57, 0), Vector3(45, 114, 0)));
    }

    void Explode() {
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

    virtual void OnCollide(CollisionResult& result) override {
        if (result.collidedWith->IsTagged(Tag::WEAPON)) {
            // Ignore
            return;
        }
        if (result.collidedWith->IsStatic()) {
            SetIsStatic(true);
            collisionExclusion |= (uint64_t) Tag::PLAYER;
            Explode();
        }
    }
};

CLASS_REGISTER(ArtilleryObject);

class ArtilleryStrike : public WeaponWithCooldown {
public:
    CLASS_CREATE(ArtilleryStrike)
    ArtilleryStrike(Game& game) : ArtilleryStrike(game, Vector3()) {}
    ArtilleryStrike(Game& game, Vector3 position) : WeaponWithCooldown(game, position) {
        cooldown = 10000;
    }

    virtual void ReleaseFire(Time time) override {
        WeaponWithCooldown::ReleaseFire(time);

        if (IsOnCooldown()) return;
    #ifdef BUILD_SERVER
        ArtilleryObject* proj = new ArtilleryObject(game);
        proj->SetPosition(Vector3(attachedTo->mousePosition.x, 10, 0));
        game.AddObject(proj);
    #endif
        CooldownStart(time);
    }
};

CLASS_REGISTER(ArtilleryStrike);

#endif