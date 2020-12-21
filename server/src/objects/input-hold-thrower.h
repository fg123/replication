#ifndef INPUT_HOLD_THROW_H
#define INPUT_HOLD_THROW_H

#include "weapon.h"
#include "game.h"
#include "player.h"

template <class Projectile>
class InputHoldThrower : public WeaponObject {
    Time fireHoldDownTime = 0;
    Time chargeUpTime = 0;
    Vector2 arrowFireVel;
protected:
    // Customizable by inheritor
    Time maxHoldDown = 1000;
    double powerMin = 100;
    double powerMax = 1500;  
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
    }

    virtual void Fire(Time time) override {
        if (fireHoldDownTime == 0) {
            fireHoldDownTime = time;
        }
    }
    virtual void ReleaseFire(Time time) override {
        WeaponObject::ReleaseFire(time);
        // Calculate power based on how long held down
        // std::cout << "Time Diff " << time - fireHoldDownTime << std::endl;
        
        fireHoldDownTime = 0;
        
    #ifdef BUILD_SERVER
        Projectile* proj = new Projectile(game);
        proj->SetPosition(GetPosition() + attachedTo->GetAimDirection() * 15.0);
        proj->SetVelocity(arrowFireVel);
        game.AddObject(proj);
    #endif
    }

    virtual void Serialize(json& obj) override {
        WeaponObject::Serialize(obj);
        arrowFireVel.Serialize(obj["afv"]);
    }

    virtual void ProcessReplication(json& obj) override {
        WeaponObject::ProcessReplication(obj);
        arrowFireVel.ProcessReplication(obj["afv"]);
    }
};

#endif