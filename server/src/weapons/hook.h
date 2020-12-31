#ifndef HOOK_H
#define HOOK_H

#include "input-hold-thrower.h"

class HookObject : public ThrownProjectile {
    bool hasForceBeenApplied = false;
public:
    CLASS_CREATE(HookObject)

    HookObject(Game& game);

    virtual void OnCollide(CollisionResult& result) override;
    virtual void Tick(Time time) override;
    virtual void Serialize(JSONWriter& obj) override;
    virtual void ProcessReplication(json& obj) override;
};

CLASS_REGISTER(HookObject);

#endif