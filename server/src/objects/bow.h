#ifndef ASSAULT_RIFLE_H
#define ASSAULT_RIFLE_H

#include "weapon.h"
#include "game.h"

class BowObject : public WeaponObject {
    double fireRate = 1;
    Time nextFireTime = 0;
public:
    CLASS_CREATE(BowObject)
    
    BowObject(Game& game) : WeaponObject(game) {}
    BowObject(Game& game, Vector2 position) : WeaponObject(game, position) {}

    virtual void Fire(Time time) override;
};

CLASS_REGISTER(BowObject);

#endif