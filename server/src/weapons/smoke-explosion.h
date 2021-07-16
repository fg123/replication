#pragma once

// Smoke Grenade
#include "object.h"
#include "game.h"

class SmokeObject : public Object {
    REPLICATED(float, radius, "rad");

    REPLICATED_D(float, rot, "rot", 0.f);

    ObjectID playerId;
public:
    CLASS_CREATE(SmokeObject);

    SmokeObject(Game& game);
    SmokeObject(Game& game, float radius);

    void Tick(Time time) override;

    void OnClientCreate() override;
};

CLASS_REGISTER(SmokeObject);