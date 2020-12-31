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
    ArrowChargeUpAbility(Game& game) : ArrowChargeUpAbility(game, Vector2::Zero) {}
    ArrowChargeUpAbility(Game& game, Vector2 position) : WeaponObject(game, position) {}

    virtual void Tick(Time time) override {
        WeaponObject::Tick(time);
        // Calculate cooldown
        timeSinceLastUse = time - lastUse;
        if (timeSinceLastUse > cooldown) {
            if (attachedTo && attachedTo->GetWeapon() && dynamic_cast<BowObject*>(attachedTo->GetWeapon())) {
                dynamic_cast<BowObject*>(attachedTo->GetWeapon())->SetInstantFire(false);
            }
        }
    }

    virtual void Fire(Time time) override {
        WeaponObject::Fire(time);
        if (timeSinceLastUse < cooldown) {
            return;
        }

        lastUse = time;
        if (attachedTo && attachedTo->GetWeapon() && dynamic_cast<BowObject*>(attachedTo->GetWeapon())) {
            dynamic_cast<BowObject*>(attachedTo->GetWeapon())->SetInstantFire(true);
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
