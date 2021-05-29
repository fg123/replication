#ifndef ARCHER_H
#define ARCHER_H

#include "player.h"
#include "abilities/dash.h"
#include "abilities/arrow-chargeup.h"
#include "weapons/bow.h"

class Archer : public PlayerObject {

public:
    CLASS_CREATE(Archer)
    Archer(Game& game) : Archer(game, Vector3()) {}
    Archer(Game& game, Vector3 position) : PlayerObject(game, position) {
        #ifdef BUILD_SERVER
            qWeapon = new DashAbility { game };
            game.AddObject(qWeapon);
            qWeapon->AttachToPlayer(this);

            // BowObject* bow = new BowObject(game);
            // game.AddObject(bow);
            // PickupWeapon(bow);

            // zWeapon = new ArrowChargeUpAbility { game };
            // game.AddObject(zWeapon);
            // zWeapon->AttachToPlayer(this);
        #endif
    }
};

CLASS_REGISTER(Archer);
#endif