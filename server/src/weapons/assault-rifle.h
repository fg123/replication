#ifndef ASSAULT_RIFLE_H
#define ASSAULT_RIFLE_H

#include "gun.h"
#include "game.h"

class AssaultRifleObject : public GunBase {
public:
    CLASS_CREATE(AssaultRifleObject)

    AssaultRifleObject(Game& game) : AssaultRifleObject(game, Vector3()) {}
    AssaultRifleObject(Game& game, Vector3 position) : GunBase(game, position) {
        fireRate = 14;
        magazineSize = 25;
        magazines = 8;
        bullets = magazineSize;
        damage = 14;
        reloadTime = 1000;
        automaticFire = true;
        fireOffset = 10;
    }
};

CLASS_REGISTER(AssaultRifleObject);

#endif