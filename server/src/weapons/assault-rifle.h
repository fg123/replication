#ifndef ASSAULT_RIFLE_H
#define ASSAULT_RIFLE_H

#include "weapon.h"
#include "game.h"

class AssaultRifleObject : public WeaponObject {
    double fireRate = 10;
    Time nextFireTime = 0;
public:
    CLASS_CREATE(AssaultRifleObject)
    
    AssaultRifleObject(Game& game) : AssaultRifleObject(game, Vector2::Zero) {}
    AssaultRifleObject(Game& game, Vector2 position);
    
    virtual void Fire(Time time) override;
};

CLASS_REGISTER(AssaultRifleObject);

#endif