#ifndef HOOKMAN_H
#define HOOKMAN_H

#include "player.h"
#include "weapons/hook-thrower.h"

class Hookman : public PlayerObject {
    
public:
    CLASS_CREATE(Hookman)
    Hookman(Game& game) : PlayerObject(game) {}
    Hookman(Game& game, Vector2 position) : PlayerObject(game, position) {
        #ifdef BUILD_SERVER
            qWeapon = new HookThrower { game };
            game.AddObject(qWeapon);
            qWeapon->AttachToPlayer(this);

            // zWeapon = new ArrowChargeUpAbility { game };
            // game.AddObject(zWeapon);
            // zWeapon->AttachToPlayer(this);
        #endif
    }
};

CLASS_REGISTER(Hookman);
#endif