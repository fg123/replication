#ifndef BULLET_H
#define BULLET_H

#include "object.h"

class BulletObject : public Object {
    bool dead = false;
public:
    CLASS_CREATE(BulletObject)
    BulletObject(Game& game);

    virtual void OnCollide(CollisionResult& result) override;
};

CLASS_REGISTER(BulletObject);
#endif