#ifndef HOOK_THROWER_H
#define HOOK_THROWER_H

#include "game.h"
#include "input-hold-thrower.h"
#include "hook.h"

class HookThrower : public InputHoldThrower<HookObject> {
public:
    CLASS_CREATE(HookThrower)

    HookThrower(Game& game) : HookThrower(game, Vector2()) {}
    HookThrower(Game& game, Vector2 position) : InputHoldThrower<HookObject>(game, position) {
        instantFire = true;
        cooldown = 2000;
    }
};

CLASS_REGISTER(HookThrower);

#endif