#ifndef BOX_CREATOR_H
#define BOX_CREATOR_H

#include "object.h"
#include "collision.h"

class Bomb : public Object {
    int damageRange = 5;
    int damage = 70;

public:
    CLASS_CREATE(Bomb);
    Bomb(Game& game) : Bomb(game, Vector3()) {}
    Bomb(Game& game, Vector3 position) : Object(game) {
        SetPosition(position);
        SetModel(game.GetModel("BombCrate.obj"));
        GenerateAABBCollidersFromModel(this);
        SetTag(Tag::GROUND);
    }

    void Explode() {
    #ifdef BUILD_SERVER
        ExplosionObject* explode = new ExplosionObject(game, damageRange, damage);
        explode->SetPosition(GetPosition());
        game.AddObject(explode);
        game.DestroyObject(GetId());
    #endif
    }
};

CLASS_REGISTER(Bomb);

class BombCreator : public WeaponWithCooldown {
    std::vector<Bomb*> bombs;

    REPLICATED_D(float, dropRange, "dr", 5);

public:
    CLASS_CREATE(BombCreator)
    BombCreator(Game& game) : BombCreator(game, Vector3()) {}
    BombCreator(Game& game, Vector3 position) : WeaponWithCooldown(game, position) {
        cooldown = 5000;
    }

    ~BombCreator() {
        for (Bomb* box : bombs) {
            game.DestroyObject(box->GetId());
        }
    }

#ifdef BUILD_SERVER
    virtual void StartFire(Time time) override {
        if (IsOnCooldown()) return;

        Vector3 rayCastEnd = attachedTo->GetPosition() + attachedTo->GetLookDirection() * dropRange;

        RayCastRequest request;
        request.startPoint = attachedTo->GetPosition() + attachedTo->GetLookDirection();
        request.direction = attachedTo->GetLookDirection();

        RayCastResult result = game.RayCastInWorld(request);
        if (result.isHit) {
            if (glm::distance(attachedTo->GetPosition(), result.hitLocation) < dropRange) {
                rayCastEnd = result.hitLocation;
            }
        }

        Bomb* bomb = new Bomb(game, rayCastEnd);
        bombs.push_back(bomb);
        game.AddObject(bomb);
        CooldownStart(time);
    }

    void ExplodeAll() {
        for (Bomb* bomb : bombs) {
            bomb->Explode();
        }
        bombs.clear();
    }
#endif
};

CLASS_REGISTER(BombCreator);

class BombExploder : public WeaponWithCooldown {
public:
    CLASS_CREATE(BombExploder)
    BombExploder(Game& game) : BombExploder(game, Vector3()) {}
    BombExploder(Game& game, Vector3 position) : WeaponWithCooldown(game, position) {
        cooldown = 10000;
    }

#ifdef BUILD_SERVER
    virtual void StartFire(Time time) override {
        if (IsOnCooldown()) return;
        static_cast<BombCreator*>(attachedTo->qWeapon)->ExplodeAll();
        CooldownStart(time);
    }
#endif
};

CLASS_REGISTER(BombExploder);

#endif