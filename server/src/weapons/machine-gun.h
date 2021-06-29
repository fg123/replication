#pragma once

#include "gun.h"
#include "game.h"

class MachineGunObject : public GunBase {
public:
    CLASS_CREATE(MachineGunObject)

    MachineGunObject(Game& game) : MachineGunObject(game, Vector3()) {}
    MachineGunObject(Game& game, Vector3 position) : GunBase(game, position) {
        fireRate = 10;
        magazineSize = 40;
        bullets = magazineSize;
        damage = 14;
        reloadTime = 2000;
        automaticFire = true;
        fireOffset = Vector3(0, -0.153859, 1.86697);
        name = "Spitwater";
        logo = "MachineGun.png";

        SetModel(game.GetModel("MachineGun.obj"));
        GenerateOBBCollidersFromModel(this);
    }
};

CLASS_REGISTER(MachineGunObject);
