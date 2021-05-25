#pragma once

#include "gun.h"
#include "game.h"

class AssaultRifleObject : public GunBase {
public:
    CLASS_CREATE(AssaultRifleObject)

    AssaultRifleObject(Game& game) : AssaultRifleObject(game, Vector3()) {}
    AssaultRifleObject(Game& game, Vector3 position) : GunBase(game, position) {
        fireRate = 14;
        magazineSize = 25;
        bullets = magazineSize;
        damage = 14;
        reloadTime = 1000;
        automaticFire = true;
        fireOffset = Vector3(0, -0.17, 1.873);
        name = "R-303";

        SetModel(game.GetModel("Rifle.obj"));
        GenerateOBBCollidersFromModel(this);
    }
};

CLASS_REGISTER(AssaultRifleObject);
