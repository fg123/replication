#ifndef DASH_H
#define DASH_H

#include "weapons/weapon.h"
#include "player.h"

class DashAbility : public WeaponWithCooldown {
    static const int DashAmount = 1300;

    int noGravDuration = 2000;

    Time lastDash = 0;

public:
    CLASS_CREATE(DashAbility)
    DashAbility(Game& game) : DashAbility(game, Vector3()) {}
    DashAbility(Game& game, Vector3 position) : WeaponWithCooldown(game, position) {
        cooldown = 2000;
    }

    virtual void Tick(Time time) override {
        WeaponWithCooldown::Tick(time);
    #ifdef BUILD_SERVER
        // Calculate duration
        if (!attachedTo) {
            return;
        }

        if (time > noGravDuration + lastDash) {
            attachedTo->RemoveTag(Tag::NO_GRAVITY);
            attachedTo->airFriction.y = 1;
        }
    #endif
    }

    virtual void StartFire(Time time) override {
        WeaponWithCooldown::StartFire(time);
    #ifdef BUILD_SERVER
        if (IsOnCooldown()) return;
        CooldownStart(time);
        lastDash = time;

        Vector3 velocity = attachedTo->GetVelocity();
        velocity.y = -DashAmount;

        attachedTo->SetVelocity(velocity);
        attachedTo->SetTag(Tag::NO_GRAVITY);
        attachedTo->airFriction.y = 0.95;
    #endif
    }
};

CLASS_REGISTER(DashAbility);

#endif
