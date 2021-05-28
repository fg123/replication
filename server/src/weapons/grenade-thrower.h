#pragma once

#include "game.h"
#include "input-hold-thrower.h"
#include "grenade.h"

class GrenadeThrower : public InputHoldThrower<GrenadeObject> {
public:
    CLASS_CREATE(GrenadeThrower)

    GrenadeThrower(Game& game) : GrenadeThrower(game, Vector3()) {}
    GrenadeThrower(Game& game, Vector3 position) : InputHoldThrower<GrenadeObject>(game, position) {
        cooldown = 2000;
        powerMin = 70;
        powerMax = 70;
        name = "Grenade";

        SetModel(game.GetModel("Grenade.obj"));
        GenerateOBBCollidersFromModel(this);
        AABB broad = collider.children[0]->GetBroadAABB();
        LOG_DEBUG(broad.ptMin << " " << broad.ptMax);
    }

    virtual void FireProjectile(Time time) override {
        InputHoldThrower<GrenadeObject>::FireProjectile(time);
        attachedTo->DropWeapon(this);
        game.DestroyObject(GetId());
    }
};

CLASS_REGISTER(GrenadeThrower);
