#ifndef GRENADE_THROWER_H
#define GRENADE_THROWER_H

#include "game.h"
#include "input-hold-thrower.h"
#include "grenade.h"

class GrenadeThrower : public InputHoldThrower<GrenadeObject> {
public:
    CLASS_CREATE(GrenadeThrower)
    
    GrenadeThrower(Game& game) : GrenadeThrower(game, Vector2::Zero) {}
    GrenadeThrower(Game& game, Vector2 position) : InputHoldThrower<GrenadeObject>(game, position) {
        //AddCollider(new RectangleCollider(this, Vector2(-11, -50), Vector2(22, 101)));
    }
};

CLASS_REGISTER(GrenadeThrower);

#endif