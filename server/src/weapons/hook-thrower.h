#ifndef HOOK_THROWER_H
#define HOOK_THROWER_H

#include "game.h"
#include "input-hold-thrower.h"
#include "hook.h"

class HookThrower : public InputHoldThrower<HookObject> {
public:
    CLASS_CREATE(HookThrower)
    
    HookThrower(Game& game) : HookThrower(game, Vector2::Zero) {}
    HookThrower(Game& game, Vector2 position) : InputHoldThrower<HookObject>(game, position) { 
        instantFire = true;
    }
};

CLASS_REGISTER(HookThrower);

#endif