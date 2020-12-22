#ifndef INPUT_HOLD_THROW_H
#define INPUT_HOLD_THROW_H

#include "weapon.h"
#include "game.h"
#include "player.h"

class ThrownProjectile : public Object {
public:
    WeaponObject* firedBy;
    ThrownProjectile(Game& game) : Object(game) {}
    void SetFiredBy(WeaponObject* obj) { firedBy = obj; }

    virtual void Serialize(json& obj) override {
        Object::Serialize(obj);
        obj["tb"] = firedBy->GetId();
    }

    virtual void ProcessReplication(json& obj) override {
        Object::ProcessReplication(obj);
        firedBy = game.GetObject<WeaponObject>(obj["tb"]);
    }
};

template <class Projectile>
class InputHoldThrower : public WeaponObject {
    static_assert(std::is_base_of<ThrownProjectile, Projectile>::value,
        "Input Hold Thrower can only throw ThrownProjectiles");

    Time fireHoldDownTime = 0;
    Time chargeUpTime = 0;
    Vector2 arrowFireVel;

    Time lastThrow = 0;
    Time timeSinceLastThrow = 0;
protected:
    // Customizable by inheritor
    Time maxHoldDown = 1000;
    double powerMin = 100;
    double powerMax = 1500;
    bool instantFire = false;
    Time cooldown = 200;

public:
    InputHoldThrower(Game& game) : InputHoldThrower(game, Vector2::Zero) {}
    InputHoldThrower(Game& game, Vector2 position) : WeaponObject(game, position) {}

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

    virtual void Serialize(json& obj) override {
        WeaponObject::Serialize(obj);
        arrowFireVel.Serialize(obj["afv"]);
        obj["tslt"] = timeSinceLastThrow;
        obj["inst"] = instantFire;
    }

    virtual void ProcessReplication(json& obj) override {
        WeaponObject::ProcessReplication(obj);
        arrowFireVel.ProcessReplication(obj["afv"]);
        timeSinceLastThrow = obj["tslt"];
        instantFire = obj["inst"];
    }
};

#endif