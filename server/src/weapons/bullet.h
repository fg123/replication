#ifndef BULLET_H
#define BULLET_H

#include "object.h"

class BulletObject : public Object {
    bool dead = false;
    int damage;

public:
    CLASS_CREATE(BulletObject)

    BulletObject(Game& game);
    BulletObject(Game& game, int damage);

    virtual void OnCollide(CollisionResult& result) override;
    virtual void Serialize(JSONWriter& obj) override;
    virtual void ProcessReplication(json& obj) override;
};

CLASS_REGISTER(BulletObject);
#endif