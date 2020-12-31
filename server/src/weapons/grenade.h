#ifndef GRENADE_H
#define GRENADE_H

#include "input-hold-thrower.h"

class GrenadeObject : public ThrownProjectile {
    bool isPrimed = false;
    Time startTickingTime = 0;
    Time tickTimeDiff = 0;

    Time tickBeforeExplode = 500;

public:
    CLASS_CREATE(GrenadeObject)

    GrenadeObject(Game& game);

    void Explode();

    virtual void OnCollide(CollisionResult& result) override;
    virtual void Tick(Time time) override;
    virtual void Serialize(JSONWriter& obj) override;
    virtual void ProcessReplication(json& obj) override;
};

CLASS_REGISTER(GrenadeObject);

#endif