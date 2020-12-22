#ifndef ARROW_H
#define ARROW_H

#include "input-hold-thrower.h"

class ArrowObject : public ThrownProjectile {
    bool hitPlayer = false;
public:
    CLASS_CREATE(ArrowObject)

    ArrowObject(Game& game);

    virtual void OnCollide(CollisionResult& result) override;
    virtual void Tick(Time time) override;
    virtual void Serialize(json& obj) override;
    virtual void ProcessReplication(json& obj) override;
};

CLASS_REGISTER(ArrowObject);
#endif