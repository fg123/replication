#ifndef BOMBMAKER_H
#define BOMBMAKER_H

#include "player.h"
#include "weapons/bomb-creator.h"
#include "weapons/pistol.h"

class Bombmaker : public PlayerObject {

public:
    CLASS_CREATE(Bombmaker)
    Bombmaker(Game& game) : Bombmaker(game, Vector2::Zero) {}
    Bombmaker(Game& game, Vector2 position) : PlayerObject(game, position) {
        #ifdef BUILD_SERVER
            qWeapon = new BombCreator { game };
            game.AddObject(qWeapon);
            qWeapon->AttachToPlayer(this);

            PistolObject* pistol = new PistolObject(game);
            game.AddObject(pistol);
            PickupWeapon(pistol);

            zWeapon = new BombExploder { game };
            game.AddObject(zWeapon);
            zWeapon->AttachToPlayer(this);
        #endif
    }
};

CLASS_REGISTER(Bombmaker);
#endif