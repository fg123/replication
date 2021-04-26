#ifndef ARROW_H
#define ARROW_H

#include "input-hold-thrower.h"

class ArrowObject : public ThrownProjectile {
    REPLICATED_D(bool, hitPlayer, "hp", false);

    Time timeLanded = 0;
    Time timeSinceLanded = 0;

    Vector3 savedVelocity;

    static const Time timeBeforeDie = 3000;

public:
    CLASS_CREATE(ArrowObject)

    ArrowObject(Game& game);

    virtual void OnCollide(CollisionResult& result) override;
    virtual void Tick(Time time) override;
};

CLASS_REGISTER(ArrowObject);
#endif