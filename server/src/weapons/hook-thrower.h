#pragma once

#include "game.h"
#include "input-hold-thrower.h"
#include "hook.h"

class HookThrower : public InputHoldThrower<HookObject> {
public:
    CLASS_CREATE(HookThrower)

    HookThrower(Game& game) : HookThrower(game, Vector3()) {}
    HookThrower(Game& game, Vector3 position) : InputHoldThrower<HookObject>(game, position) {
        instantFire = true;
        cooldown = 2000;
        powerMax = 60.f;
        maxDistance = HookObject::MaxLength;

        SetModel(game.GetModel("HookThrower.obj"));
    }
};

CLASS_REGISTER(HookThrower);
