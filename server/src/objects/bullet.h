#ifndef BULLET_H
#define BULLET_H

#include "object.h"

class BulletObject : public Object {
public:
    BulletObject(Game& game);

    const char* GetClass() override { return "BulletObject"; }
    virtual void OnCollide(CollisionResult& result) override;
};

#endif