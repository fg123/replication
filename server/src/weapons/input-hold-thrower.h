#ifndef INPUT_HOLD_THROW_H
#define INPUT_HOLD_THROW_H

#include "weapon.h"
#include "game.h"
#include "player.h"

class ThrownProjectile : public Object {
public:
    // Could be null if the weapon / person doesn't exist anymore
    WeaponObject* firedBy = nullptr;
    ThrownProjectile(Game& game) : Object(game) {}
    void SetFiredBy(WeaponObject* obj) { firedBy = obj; }

    virtual void Serialize(JSONWriter& obj) override {
        Object::Serialize(obj);
        if (firedBy) {
            obj.Key("tb");
            obj.Uint(firedBy->GetId());
        }
    }

    virtual void ProcessReplication(json& obj) override {
        Object::ProcessReplication(obj);
        if (obj.HasMember("tb")) {
            firedBy = game.GetObject<WeaponObject>(obj["tb"].GetUint());
        }
    }
};

template <class Projectile>
class InputHoldThrower : public WeaponObject {
    static_assert(std::is_base_of<ThrownProjectile, Projectile>::value,
        "Input Hold Thrower can only throw ThrownProjectiles");

    Time fireHoldDownTime = 0;
    Time chargeUpTime = 0;

    REPLICATED(Vector2, arrowFireVel, "afv");

    Time lastThrow = 0;

    REPLICATED_D(Time, timeSinceLastThrow, "tslt", 0);

protected:
    // Customizable by inheritor
    Time maxHoldDown = 1000;
    double powerMin = 100;
    double powerMax = 1500;

    REPLICATED_D(bool, instantFire, "inst", false);

    Time cooldown = 200;

public:
    InputHoldThrower(Game& game) : InputHoldThrower(game, Vector2::Zero) {}
    InputHoldThrower(Game& game, Vector2 position) :
        WeaponObject(game, position) {}

    virtual void Tick(Time time) override {
        WeaponObject::Tick(time);
        if (attachedTo && fireHoldDownTime != 0) {
            chargeUpTime = std::min(time - fireHoldDownTime, maxHoldDown);

            // 2 seconds max for charge up
            double power = (((double) chargeUpTime / (double) maxHoldDown) * (powerMax - powerMin)) + powerMin;
            arrowFireVel = attachedTo->GetAimDirection() * power;
        }
        else {
            chargeUpTime = 0;
            arrowFireVel = Vector2::Zero;
        }
        timeSinceLastThrow = time - lastThrow;
    }

    virtual void StartFire(Time time) override {
        if (instantFire && timeSinceLastThrow > cooldown) {
            double power = powerMax;
            arrowFireVel = attachedTo->GetAimDirection() * power;
            FireProjectile(time);
        }
    }

    virtual void Fire(Time time) override {
        // if (instantFire) {
        //     fireHoldDownTime;
        // }
        if (fireHoldDownTime == 0 && !instantFire && timeSinceLastThrow > cooldown) {
            fireHoldDownTime = time;
        }
    }

    void FireProjectile(Time time) {
        #ifdef BUILD_SERVER
            Projectile* proj = new Projectile(game);
            proj->SetFiredBy(this);
            proj->SetPosition(GetPosition() + attachedTo->GetAimDirection() * 15.0);
            proj->SetVelocity(arrowFireVel);
            game.AddObject(proj);
        #endif
        lastThrow = time;
    }

    virtual void ReleaseFire(Time time) override {
        WeaponObject::ReleaseFire(time);
        if (!instantFire) {
            fireHoldDownTime = 0;
            FireProjectile(time);
        }
    }
};

#endif