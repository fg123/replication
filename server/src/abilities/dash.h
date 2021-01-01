#ifndef DASH_H
#define DASH_H

#include "weapons/weapon.h"
#include "player.h"

class DashAbility : public WeaponObject {
    static const int DashAmount = 1300;
    Time lastDash = 0;
    Time timeSinceLastDash = 0;
    Time cooldown = 2000;

public:
    CLASS_CREATE(DashAbility)
    DashAbility(Game& game) : DashAbility(game, Vector2::Zero) {}
    DashAbility(Game& game, Vector2 position) : WeaponObject(game, position) {}

    virtual void Tick(Time time) override {
        WeaponObject::Tick(time);
        #ifdef BUILD_SERVER
        // Calculate cooldown
        timeSinceLastDash = time - lastDash;

        if (!attachedTo) {
            // Destroyed
            return;
        }

        if (timeSinceLastDash > cooldown) {
            attachedTo->RemoveTag(Tag::NO_GRAVITY);
            attachedTo->airFriction.y = 1;
        }
        #endif
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

    virtual void Serialize(JSONWriter& obj) override {
        WeaponObject::Serialize(obj);
        // Replicating this desyncs the client side prediction of these
        //   abilities
        // obj.Key("tsld");
        // obj.Uint64(timeSinceLastDash);
    }

    virtual void ProcessReplication(json& obj) override {
        WeaponObject::ProcessReplication(obj);
        // timeSinceLastDash = obj["tsld"].GetUint64();
    }
};

CLASS_REGISTER(DashAbility);

#endif
