#ifndef BOW_H
#define BOW_H

#include "game.h"
#include "input-hold-thrower.h"
#include "arrow.h"

class BowObject : public InputHoldThrower<ArrowObject> {
public:
    CLASS_CREATE(BowObject)

    BowObject(Game& game) : BowObject(game, Vector2::Zero) {}
    BowObject(Game& game, Vector2 position) : InputHoldThrower<ArrowObject>(game, position) {
        cooldown = 500;
    }

    void SetInstantFire(bool fire) { instantFire = fire; }
};

CLASS_REGISTER(BowObject);

#endif