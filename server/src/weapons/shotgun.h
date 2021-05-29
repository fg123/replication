#pragma once

#include "gun.h"
#include "game.h"

class ShotgunObject : public GunBase {
public:
    CLASS_CREATE(ShotgunObject)

    ShotgunObject(Game& game) : ShotgunObject(game, Vector3()) {}
    ShotgunObject(Game& game, Vector3 position) : GunBase(game, position) {
        fireRate = 3;
        magazineSize = 7;
        bullets = magazineSize;
        damage = 12;
        reloadTime = 1000;
        automaticFire = false;
        fireOffset = Vector3(0, 0, 1);
        name = "Mystiff";
        shotsPerFire = 7;
        multishotSpreadRadius = 0.1f;

        spreadIncreasePerShot = 10;

        SetModel(game.GetModel("Shotgun.obj"));
        GenerateOBBCollidersFromModel(this);
    }
};

CLASS_REGISTER(ShotgunObject);
