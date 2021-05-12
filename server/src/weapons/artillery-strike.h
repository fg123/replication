#pragma once

#include "object.h"
#include "explosion.h"

class ArtilleryObject : public Object {
    int damageRange = 15;
    int damage = 100;

    Object* indicatorObject;

public:
    CLASS_CREATE(ArtilleryObject)

    ArtilleryObject(Game& game) : ArtilleryObject(game, nullptr) {}

    ArtilleryObject(Game& game, Object* indicator) : Object(game), indicatorObject(indicator) {
        collisionExclusion |= (uint64_t) Tag::WEAPON;
        collisionExclusion |= (uint64_t) Tag::PLAYER;
        #ifdef BUILD_SERVER
            SetModel(game.GetModel("Artillery.obj"));
            GenerateAABBCollidersFromModel(this);
        #endif
        airFriction = Vector3(1, 1, 1);
    }

    virtual void OnCollide(CollisionResult& result) override {
        if (result.collidedWith->IsTagged(Tag::WEAPON)) {
            // Ignore
            return;
        }
        #ifdef BUILD_SERVER
            ExplosionObject* explode = new ExplosionObject(game, damageRange, damage);
            explode->SetPosition(GetPosition());
            game.AddObject(explode);
            game.DestroyObject(GetId());
            game.DestroyObject(indicatorObject->GetId());
        #endif
    }
};

CLASS_REGISTER(ArtilleryObject);

class ArtilleryIndObject : public Object {
    bool spawned = false;
public:
    CLASS_CREATE(ArtilleryIndObject)

    ArtilleryIndObject(Game& game) : ArtilleryIndObject(game, Vector3()) {}
    ArtilleryIndObject(Game& game, Vector3 position) : Object(game) {
        SetPosition(position);

        #ifdef BUILD_SERVER
            SetModel(game.GetModel("ArtilleryIndicator.obj"));
            ArtilleryObject* proj = new ArtilleryObject(game, this);
            proj->SetPosition(Vector3(GetPosition().x, 100.0f, GetPosition().z));
            game.AddObject(proj);
        #endif
    }
};

CLASS_REGISTER(ArtilleryIndObject);

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

        RayCastRequest request;
        request.startPoint = attachedTo->GetPosition() + attachedTo->GetLookDirection();
        request.direction = attachedTo->GetLookDirection();

        RayCastResult result = game.RayCastInWorld(request);
        if (result.isHit) {
            ArtilleryIndObject* indicator = new ArtilleryIndObject(game, result.hitLocation);
            indicator->SetRotation(DirectionToQuaternion(result.hitNormal));
            game.PlayAudio("incoming.wav", 1.0f, attachedTo);

            #ifdef BUILD_SERVER
                game.AddObject(indicator);
            #endif
            CooldownStart(time);
        }
    }
};

CLASS_REGISTER(ArtilleryStrike);
