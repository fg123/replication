#ifndef WEAPON_H
#define WEAPON_H

#include "object.h"

// Make this templated probably, also might need to make a class of pickupable
//   things
class PlayerObject;

class WeaponObject : public Object {
    PlayerObject* attachedTo = nullptr;
public:
    WeaponObject(Game& game, Vector2 position);
    virtual const char* GetClass() override { return "M4A1"; }

    void AttachToPlayer(PlayerObject* player);
    void Detach();
    
    virtual void Tick(Time time) override;

    virtual void Serialize(json& obj) override;
};

#endif