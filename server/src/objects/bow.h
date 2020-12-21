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
        AddCollider(new RectangleCollider(this, Vector2(-11, -50), Vector2(22, 101)));
    }
};

CLASS_REGISTER(BowObject);

#endif