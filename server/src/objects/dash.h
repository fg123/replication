#ifndef DASH_H
#define DASH_H

#include "weapon.h"
#include "player.h"

class DashWeapon : public WeaponObject {
    static const int DashAmount = 1500;

    Time lastDash = 0;
    Time timeSinceLastDash = 0;

    Time cooldown = 500;

public:
    CLASS_CREATE(DashWeapon)
    DashWeapon(Game& game) : DashWeapon(game, Vector2::Zero) {}
    DashWeapon(Game& game, Vector2 position) : WeaponObject(game, position) {}

    virtual void Tick(Time time) override {
        WeaponObject::Tick(time);
        // Calculate cooldown
        timeSinceLastDash = time - lastDash;
    }

    virtual void Fire(Time time) override {
        WeaponObject::Fire(time);
        if (timeSinceLastDash < cooldown) {
            return;
        }

        lastDash = time;
        
        Vector2 velocity = attachedTo->GetVelocity();
        velocity += attachedTo->GetAimDirection().Normalize() * DashAmount;
        
        attachedTo->SetVelocity(velocity);
    }

    virtual void Serialize(json& obj) override {
        WeaponObject::Serialize(obj);
        obj["tsld"] = timeSinceLastDash;
    }

    virtual void ProcessReplication(json& obj) override {
        WeaponObject::ProcessReplication(obj);
        timeSinceLastDash = obj["tsld"];
    }
};

CLASS_REGISTER(DashWeapon);

#endif
