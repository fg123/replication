#ifndef WEAPON_H
#define WEAPON_H

#include "object.h"

// Make this templated probably, also might need to make a class of pickupable
//   things
class PlayerObject;

class WeaponObject : public Object {
protected:
    PlayerObject* attachedTo = nullptr;

public:

    WeaponObject(Game& game) : Object(game) {}
    WeaponObject(Game& game, Vector2 position);

    void AttachToPlayer(PlayerObject* player);
    void Detach();

    virtual void Fire(Time time) = 0;
    virtual void Tick(Time time) override;
    virtual void Serialize(json& obj) override;
    virtual void ProcessReplication(json& obj) override;
    
};

#endif