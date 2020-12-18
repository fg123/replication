#ifndef WEAPON_H
#define WEAPON_H

#include "object.h"

// Make this templated probably, also might need to make a class of pickupable
//   things
class PlayerObject;

class WeaponObject : public Object {
    PlayerObject* attachedTo = nullptr;

    double fireRate = 10;
    Time nextFireTime = 0;
public:
    CLASS_CREATE(WeaponObject)

    WeaponObject(Game& game) : Object(game) {}
    WeaponObject(Game& game, Vector2 position);

    void AttachToPlayer(PlayerObject* player);
    void Detach();

    void Fire(Time time);
    virtual void Tick(Time time) override;
    virtual void Serialize(json& obj) override;
    virtual void ProcessReplication(json& obj) override;
    
};

CLASS_REGISTER(WeaponObject);

#endif