#ifndef ARROW_CHARGEUP_H
#define ARROW_CHARGEUP_H

#include "weapons/weapon.h"
#include "weapons/bow.h"

#include "player.h"

class ArrowChargeUpAbility : public WeaponObject {
    Time lastUse = 0;
    Time timeSinceLastUse = 0;
    Time cooldown = 2000;

public:
    CLASS_CREATE(ArrowChargeUpAbility)
    ArrowChargeUpAbility(Game& game) : ArrowChargeUpAbility(game, Vector3()) {}
    ArrowChargeUpAbility(Game& game, Vector3 position) : WeaponObject(game, position) {}

    virtual void Tick(Time time) override {
        WeaponObject::Tick(time);
        // Calculate cooldown
        timeSinceLastUse = time - lastUse;
        if (timeSinceLastUse > cooldown) {
            if (attachedTo && attachedTo->GetCurrentWeapon() && dynamic_cast<BowObject*>(attachedTo->GetCurrentWeapon())) {
                dynamic_cast<BowObject*>(attachedTo->GetCurrentWeapon())->SetInstantFire(false);
            }
        }
    }

    virtual void Fire(Time time) override {
        WeaponObject::Fire(time);
        if (timeSinceLastUse < cooldown) {
            return;
        }

        lastUse = time;
        if (attachedTo && attachedTo->GetCurrentWeapon() && dynamic_cast<BowObject*>(attachedTo->GetCurrentWeapon())) {
            dynamic_cast<BowObject*>(attachedTo->GetCurrentWeapon())->SetInstantFire(true);
            game.PlayAudio("Archer/arrow-ulti-activate.wav", 1.f, attachedTo);
        }
    }

    virtual void Serialize(JSONWriter& obj) override {
        WeaponObject::Serialize(obj);
        obj.Key("tslu");
        obj.Uint64(timeSinceLastUse);
    }

    virtual void ProcessReplication(json& obj) override {
        WeaponObject::ProcessReplication(obj);
        timeSinceLastUse = obj["tslu"].GetUint64();
    }
};

CLASS_REGISTER(ArrowChargeUpAbility);

#endif
