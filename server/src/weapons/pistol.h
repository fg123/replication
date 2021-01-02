#ifndef PISTOL_H
#define PISTOL_H

#include "gun.h"
#include "game.h"
#include "bullet.h"

class PistolObject : public GunBase {
public:
    CLASS_CREATE(PistolObject)

    PistolObject(Game& game) : PistolObject(game, Vector2::Zero) {}
    PistolObject(Game& game, Vector2 position) : GunBase(game, position) {
        AddCollider(new RectangleCollider(this, Vector2(-26, -10), Vector2(60, 24)));

        fireRate = 3;
        magazineSize = 7;
        magazines = 8;
        bullets = magazineSize;
        damage = 45;
        reloadTime = 1000;
        automaticFire = false;
        fireOffset = 50;
    }
};

CLASS_REGISTER(PistolObject);

#endif