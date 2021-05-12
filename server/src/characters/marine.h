#ifndef MARINE_H
#define MARINE_H

#include "player.h"
#include "weapons/grenade-thrower.h"
#include "weapons/artillery-strike.h"
#include "weapons/assault-rifle.h"
#include "weapons/pistol.h"

class Marine : public PlayerObject {

public:
    CLASS_CREATE(Marine)
    Marine(Game& game) : Marine(game, Vector3()) {}
    Marine(Game& game, Vector3 position) : PlayerObject(game, position) {
        #ifdef BUILD_SERVER
            qWeapon = new GrenadeThrower { game };
            game.AddObject(qWeapon);
            qWeapon->AttachToPlayer(this);

            AssaultRifleObject* rifle = new AssaultRifleObject(game);
            game.AddObject(rifle);
            PickupWeapon(rifle);

            // PistolObject* pistol = new PistolObject(game);
            // game.AddObject(pistol);
            // PickupWeapon(pistol);

            zWeapon = new ArtilleryStrike { game };
            game.AddObject(zWeapon);
            zWeapon->AttachToPlayer(this);

        #endif
    }
};

CLASS_REGISTER(Marine);
#endif