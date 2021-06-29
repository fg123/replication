#pragma once

#include "gun.h"
#include "game.h"

class SubmachineGunObject : public GunBase {
public:
    CLASS_CREATE(SubmachineGunObject)

    SubmachineGunObject(Game& game) : SubmachineGunObject(game, Vector3()) {}
    SubmachineGunObject(Game& game, Vector3 position) : GunBase(game, position) {
        fireRate = 10;
        magazineSize = 40;
        bullets = magazineSize;
        damage = 14;
        reloadTime = 500;
        automaticFire = true;
        fireOffset = Vector3(0, -0.11565, 1.10558);
        name = "Submachine";
        logo = "SubmachineGun.png";

        SetModel(game.GetModel("SubmachineGun.obj"));
        GenerateOBBCollidersFromModel(this);
    }
};

CLASS_REGISTER(SubmachineGunObject);
