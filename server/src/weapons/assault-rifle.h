#ifndef ASSAULT_RIFLE_H
#define ASSAULT_RIFLE_H

#include "gun.h"
#include "game.h"

class AssaultRifleObject : public GunBase {
public:
    CLASS_CREATE(AssaultRifleObject)

    AssaultRifleObject(Game& game) : AssaultRifleObject(game, Vector2::Zero) {}
    AssaultRifleObject(Game& game, Vector2 position) : GunBase(game, position) {
        AddCollider(new RectangleCollider(this, Vector2(-26, -10), Vector2(74, 24)));

        fireRate = 14;
        magazineSize = 25;
        magazines = 8;
        bullets = magazineSize;
        damage = 14;
        reloadTime = 1000;
        automaticFire = true;
        fireOffset = 70;
    }
};

CLASS_REGISTER(AssaultRifleObject);

#endif