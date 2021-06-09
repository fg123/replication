#pragma once

#include "object.h"
#include "weapons/weapon.h"
#include "weapons/input-hold-thrower.h"

class NullProjectile : public ThrownProjectile {
public:
    CLASS_CREATE(NullProjectile)

    NullProjectile(Game& game) : NullProjectile(game, 0) {}
    NullProjectile(Game& game, ObjectID playerId) : ThrownProjectile(game, playerId) {
        LOG_ERROR("We actually made a null projectile!");
        throw "Cannot create instance of null projectile!";
    }
};

CLASS_REGISTER(NullProjectile);

class MedkitObject : public InputHoldThrower<NullProjectile> {
public:
    CLASS_CREATE(MedkitObject);
    MedkitObject(Game& game) : MedkitObject(game, Vector3()) { }

    MedkitObject(Game& game, Vector3 position) : InputHoldThrower<NullProjectile>(game, position) {
        SetModel(game.GetModel("Medkit.obj"));
        GenerateOBBCollidersFromModel(this);

        name = "Medkit";
        powerMin = 0;
        powerMax = 70;
        maxHoldDown = 3000;
    }

    virtual void Tick(Time time) override {
        InputHoldThrower<NullProjectile>::Tick(time);
        if (power >= 1.f) {
            ReleaseFire(time);
        }
    }

    virtual void FireProjectile(Time time) override {
        if (power >= 1.f) {
            attachedTo->HealFor(25);
            PlayerObject* attach = attachedTo;
            attachedTo->DropWeapon(this);

            attach->HolsterAllWeapons();
            game.DestroyObject(GetId());
        }
    }
};

CLASS_REGISTER(MedkitObject);