#pragma once

#include "gun.h"
#include "game.h"

class PistolObject : public GunBase {
public:
    CLASS_CREATE(PistolObject)

    PistolObject(Game& game) : PistolObject(game, Vector3()) {}
    PistolObject(Game& game, Vector3 position) : GunBase(game, position) {
        fireRate = 3;
        magazineSize = 7;
        bullets = magazineSize;
        damage = 45;
        reloadTime = 1000;
        automaticFire = false;
        fireOffset = Vector3(0, 0, 1);
        name = "Wingboy";

        SetModel(game.GetModel("Pistol.obj"));
        GenerateOBBCollidersFromModel(this);
    }
};

CLASS_REGISTER(PistolObject);
