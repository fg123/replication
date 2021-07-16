#pragma once

#include "game.h"
#include "input-hold-thrower.h"
#include "smoke-grenade.h"

class SmokeGrenadeThrower : public InputHoldThrower<SmokeGrenadeObject> {
public:
    CLASS_CREATE(SmokeGrenadeThrower)

    SmokeGrenadeThrower(Game& game) : SmokeGrenadeThrower(game, Vector3()) {}
    SmokeGrenadeThrower(Game& game, Vector3 position) : InputHoldThrower<SmokeGrenadeObject>(game, position) {
        cooldown = 2000;
        powerMin = 10;
        powerMax = 100;
        name = "Grenade";
        logo = "Grenade.png";

        // SetModel(game.GetModel("Grenade.obj"));
        // GenerateOBBCollidersFromModel(this);
        // AABB broad = collider.children[0]->GetBroadAABB();
        // LOG_DEBUG(broad.ptMin << " " << broad.ptMax);
    }
};

CLASS_REGISTER(SmokeGrenadeThrower);
