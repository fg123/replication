#ifndef MARINE_H
#define MARINE_H

#include "player.h"
#include "weapons/grenade-thrower.h"
#include "weapons/artillery-strike.h"

class Marine : public PlayerObject {
    
public:
    CLASS_CREATE(Marine)
    Marine(Game& game) : Marine(game, Vector2::Zero) {}
    Marine(Game& game, Vector2 position) : PlayerObject(game, position) {
        #ifdef BUILD_SERVER
            qWeapon = new GrenadeThrower { game };
            game.AddObject(qWeapon);
            qWeapon->AttachToPlayer(this);

            zWeapon = new ArtilleryStrikeWeapon { game };
            game.AddObject(zWeapon);
            zWeapon->AttachToPlayer(this);
        #endif
    }
};

CLASS_REGISTER(Marine);
#endif