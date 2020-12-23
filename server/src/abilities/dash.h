#ifndef DASH_H
#define DASH_H

#include "weapons/weapon.h"
#include "player.h"

class DashAbility : public WeaponObject {
    static const int DashAmount = 1800;
    Time lastDash = 0;
    Time timeSinceLastDash = 0;
    Time cooldown = 2000;

public:
    CLASS_CREATE(DashAbility)
    DashAbility(Game& game) : DashAbility(game, Vector2::Zero) {}
    DashAbility(Game& game, Vector2 position) : WeaponObject(game, position) {}

    virtual void Tick(Time time) override {
        WeaponObject::Tick(time);
        // Calculate cooldown
        timeSinceLastDash = time - lastDash;

        if (!attachedTo) {
            throw "what the heck";
        }
        if (timeSinceLastDash > cooldown) {
            attachedTo->RemoveTag(Tag::NO_GRAVITY);
            attachedTo->airFriction.y = 1;
        }
    }

    virtual void Fire(Time time) override {
        WeaponObject::Fire(time);
        if (timeSinceLastDash < cooldown) {
            return;
        }

        lastDash = time;
        
        Vector2 velocity = attachedTo->GetVelocity();
        velocity.y -= DashAmount;
        
        attachedTo->SetVelocity(velocity);
        attachedTo->SetTag(Tag::NO_GRAVITY);
        attachedTo->airFriction.y = 0.95;
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

CLASS_REGISTER(DashAbility);

#endif
