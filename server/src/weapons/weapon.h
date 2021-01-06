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
    WeaponObject(Game& game) : WeaponObject(game, Vector2::Zero) {
    }
    WeaponObject(Game& game, Vector2 position);

    PlayerObject* GetAttachedTo() { return attachedTo; }
    void AttachToPlayer(PlayerObject* player);
    void Detach();

    virtual void StartFire(Time time) {}
    virtual void Fire(Time time) {}
    virtual void ReleaseFire(Time time) {}

    virtual void StartReload(Time time) {}

    virtual void Tick(Time time) override;
    virtual void Serialize(JSONWriter& obj) override;
    virtual void ProcessReplication(json& obj) override;

};

// Manages cooldown
class WeaponWithCooldown : public WeaponObject {
public:
    // Set by underlying class
    Time cooldown = 0;

private:
    REPLICATED_D(Time, currentCooldown, "cd", 0);

    Time lastUseTime = 0;

public:
    WeaponWithCooldown(Game& game) : WeaponWithCooldown(game, Vector2::Zero) {}
    WeaponWithCooldown(Game& game, Vector2 position) : WeaponObject(game, position) {}

    virtual void Tick(Time time) override;

    bool IsOnCooldown() { return currentCooldown != 0; }
    void CooldownStart(Time time);
};
#endif