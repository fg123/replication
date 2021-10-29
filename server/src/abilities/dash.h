#pragma once

#include "weapons/weapon.h"
#include "player.h"

class DashAbility : public WeaponWithCooldown {
    static const int DashAmount = 20;

#ifdef BUILD_SERVER
    int noGravDuration = 2000;

    Time lastDash = 0;
#endif

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
        if (!GetAttachedTo()) {
            return;
        }

        if (time > noGravDuration + lastDash) {
            GetAttachedTo()->RemoveTag(Tag::NO_GRAVITY);
        }
    #endif
    }

    virtual void StartFire(Time time) override {
        WeaponWithCooldown::StartFire(time);
        if (IsOnCooldown()) return;
        CooldownStart(time);
        if (auto attachedTo = GetAttachedTo()) {
        #ifdef BUILD_SERVER
            lastDash = time;

            Vector3 velocity = attachedTo->GetVelocity();
            velocity.y = DashAmount;

            attachedTo->SetVelocity(velocity);
            attachedTo->SetTag(Tag::NO_GRAVITY);
        #endif
            game.PlayAudio("Archer/arrow-jump.wav", 1.f, attachedTo);
        }
    }
};

CLASS_REGISTER(DashAbility);
