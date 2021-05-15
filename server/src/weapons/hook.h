#ifndef HOOK_H
#define HOOK_H

#include "input-hold-thrower.h"

class HookObject : public ThrownProjectile {
    bool hasForceBeenApplied = false;
    bool audioPlayed = false;
public:
    constexpr static float MaxLength = 30.f;

    CLASS_CREATE(HookObject)

    HookObject(Game& game);

    virtual void OnCollide(CollisionResult& result) override;
    virtual void Tick(Time time) override;
};

CLASS_REGISTER(HookObject);

#endif