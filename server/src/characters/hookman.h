#ifndef HOOKMAN_H
#define HOOKMAN_H

#include "player.h"
#include "weapons/hook-thrower.h"
#include "weapons/pistol.h"
#include "abilities/portal.h"

class Hookman : public PlayerObject {

public:
    CLASS_CREATE(Hookman)
    Hookman(Game& game) : Hookman(game, Vector2::Zero) {}
    Hookman(Game& game, Vector2 position) : PlayerObject(game, position) {
        #ifdef BUILD_SERVER
            qWeapon = new HookThrower { game };
            game.AddObject(qWeapon);
            qWeapon->AttachToPlayer(this);

            PistolObject* pistol = new PistolObject(game);
            game.AddObject(pistol);
            PickupWeapon(pistol);

            zWeapon = new PortalAbility { game };
            game.AddObject(zWeapon);
            zWeapon->AttachToPlayer(this);
        #endif
    }
};

CLASS_REGISTER(Hookman);
#endif