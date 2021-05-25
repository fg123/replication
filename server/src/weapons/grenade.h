#pragma once

#include "input-hold-thrower.h"

class GrenadeObject : public ThrownProjectile {
    REPLICATED_D(bool, isPrimed, "ip", false);

    Time startTickingTime = 0;

    REPLICATED_D(Time, tickTimeDiff, "ttd", 0);

    Time tickBeforeExplode = 500;

    int damage = 25;
    int damageRange = 5;

public:
    CLASS_CREATE(GrenadeObject)

    GrenadeObject(Game& game) : GrenadeObject(game, 0) {}
    GrenadeObject(Game& game, ObjectID playerId);

    void Explode();

    virtual void OnCollide(CollisionResult& result) override;
    virtual void Tick(Time time) override;
};

CLASS_REGISTER(GrenadeObject);
