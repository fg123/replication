#pragma once

#include "object.h"

class ArtilleryObject : public Object {
    int damageRange = 15;
    int damage = 100;

    Object* indicatorObject;
    ObjectID playerId;
public:
    CLASS_CREATE(ArtilleryObject)

    ArtilleryObject(Game& game) : ArtilleryObject(game, 0, nullptr) {}

    ArtilleryObject(Game& game, ObjectID playerId, Object* indicator) : Object(game),
        indicatorObject(indicator), playerId(playerId) {

        collisionExclusion |= (uint64_t) Tag::WEAPON;
        collisionExclusion |= (uint64_t) Tag::PLAYER;

        SetModel(game.GetModel("Artillery.obj"));
        GenerateOBBCollidersFromModel(this);

        airFriction = Vector3(1, 1, 1);
    }

    virtual void OnCollide(CollisionResult& result) override {
        if (result.collidedWith->IsTagged(Tag::WEAPON)) {
            // Ignore
            return;
        }
        #ifdef BUILD_SERVER
            Object* explode = game.CreateAndAddScriptedObject("Explosion");
            explode->SetPosition(GetPosition());
            game.DestroyObject(GetId());
            game.DestroyObject(indicatorObject->GetId());
        #endif
    }
};

CLASS_REGISTER(ArtilleryObject);

class ArtilleryIndObject : public Object {
    bool spawned = false;
    ObjectID playerId;
public:
    CLASS_CREATE(ArtilleryIndObject)

    ArtilleryIndObject(Game& game) : ArtilleryIndObject(game, 0, Vector3()) {}
    ArtilleryIndObject(Game& game, ObjectID playerId, Vector3 position) : Object(game), playerId(playerId) {
        SetPosition(position);

        SetModel(game.GetModel("ArtilleryIndicator.obj"));
        ArtilleryObject* proj = new ArtilleryObject(game, playerId, this);
        proj->SetPosition(Vector3(GetPosition().x, 100.0f, GetPosition().z));
        game.AddObject(proj);
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

        if (auto attachedTo = GetAttachedTo()) {
            RayCastRequest request;
            request.startPoint = attachedTo->GetPosition() + attachedTo->GetLookDirection();
            request.direction = attachedTo->GetLookDirection();

            RayCastResult result = game.RayCastInWorld(request);
            if (result.isHit) {
                ArtilleryIndObject* indicator = new ArtilleryIndObject(game, attachedTo->GetId(), result.hitLocation);
                indicator->SetRotation(DirectionToQuaternion(result.hitNormal));
                game.PlayAudio("incoming.wav", 1.0f, attachedTo);

                #ifdef BUILD_SERVER
                    game.AddObject(indicator);
                #endif
                CooldownStart(time);
            }
        }
    }
};

CLASS_REGISTER(ArtilleryStrike);
