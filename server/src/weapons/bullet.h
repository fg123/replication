#pragma once

#include "object.h"
#include "ray-cast.h"

class BulletObject : public Object {
    REPLICATED(int, damage, "dmg");
    RayCastResult rayResult;
public:
    CLASS_CREATE(BulletObject)

    BulletObject(Game& game);
    BulletObject(Game& game, int damage, RayCastResult rayResult);

    virtual void OnCollide(CollisionResult& result) override;
};

CLASS_REGISTER(BulletObject);
