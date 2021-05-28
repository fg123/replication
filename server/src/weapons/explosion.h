#pragma once

// Explosion Animation
#include "object.h"
#include "game.h"

class ExplosionObject : public Object {
    REPLICATED(float, radius, "rad");
    REPLICATED(float, damage, "dmg");

    std::unordered_set<Object*> damaged;

    float rotation = 0.f;

    ObjectID playerId;
public:
    CLASS_CREATE(ExplosionObject);

    ExplosionObject(Game& game);
    ExplosionObject(Game& game, ObjectID playerId, float radius, float damage);

    void Tick(Time time) override;

    void OnClientCreate() override;
};

CLASS_REGISTER(ExplosionObject);