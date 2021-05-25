#pragma once

#include "input-hold-thrower.h"

class ArrowObject : public ThrownProjectile {
    REPLICATED_D(bool, hitPlayer, "hp", false);

    Time timeLanded = 0;
    Time timeSinceLanded = 0;

    Vector3 savedVelocity;

    static const Time timeBeforeDie = 10000;

public:
    CLASS_CREATE(ArrowObject)

    ArrowObject(Game& game) : ArrowObject(game, 0) {}
    ArrowObject(Game& game, ObjectID playerId);

    virtual void OnCollide(CollisionResult& result) override;
    virtual void Tick(Time time) override;
};

CLASS_REGISTER(ArrowObject);