#ifndef ASSAULT_RIFLE_H
#define ASSAULT_RIFLE_H

#include "gun.h"
#include "game.h"

class AssaultRifleObject : public GunBase {
    double fireRate = 10;
    Time nextFireTime = 0;
public:
    CLASS_CREATE(AssaultRifleObject)

    AssaultRifleObject(Game& game) : AssaultRifleObject(game, Vector2::Zero) {}
    AssaultRifleObject(Game& game, Vector2 position);
};

CLASS_REGISTER(AssaultRifleObject);

#endif