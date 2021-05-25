#pragma once

#include "object.h"
#include "weapons/weapon.h"

const size_t MAX_AMMO_PER_STACK = 60;

class AmmoObject : public WeaponObject {
public:
    REPLICATED_D(int, ammoCount, "ac", 20);

    CLASS_CREATE(AmmoObject);
    AmmoObject(Game& game) : AmmoObject(game, Vector3()) { }

    AmmoObject(Game& game, Vector3 position) : WeaponObject(game, position) {
        SetModel(game.GetModel("Ammo.obj"));
        GenerateOBBCollidersFromModel(this);
    }

    virtual void Tick(Time time) override {
        WeaponObject::Tick(time);
        name = "Ammo (" + std::to_string(ammoCount) + ")";
    }
};

CLASS_REGISTER(AmmoObject);