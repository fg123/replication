#ifndef PISTOL_H
#define PISTOL_H

#include "gun.h"
#include "game.h"
#include "bullet.h"

class PistolObject : public GunBase {
public:
    CLASS_CREATE(PistolObject)

    PistolObject(Game& game) : PistolObject(game, Vector3()) {}
    PistolObject(Game& game, Vector3 position) : GunBase(game, position) {
        fireRate = 3;
        magazineSize = 7;
        magazines = 8;
        bullets = magazineSize;
        damage = 45;
        reloadTime = 1000;
        automaticFire = false;
        fireOffset = 10;
    }
};

CLASS_REGISTER(PistolObject);

#endif