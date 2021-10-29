#pragma once

#include "scriptable-object.h"

// Make this templated probably, also might need to make a class of pickupable
//   things
class PlayerObject;

enum class WeaponAttachmentPoint : int {
    LEFT = 0, CENTER = 1, RIGHT = 2
};

template<>
inline void SerializeDispatch(WeaponAttachmentPoint& object, JSONWriter& obj) {
    obj.Int((int) object);
}

template<>
inline void ProcessReplicationDispatch(WeaponAttachmentPoint& object, json& obj) {
    object = (WeaponAttachmentPoint)obj.GetInt();
}

class WeaponObject : public ScriptableObject {
public:
    REPLICATED(std::string, name, "name");
    REPLICATED(std::string, logo, "logo");
    REPLICATED(WeaponAttachmentPoint, attachmentPoint, "atp");
    REPLICATED_D(float, currentSpread, "spread", 0.f);

    WeaponObject(Game& game) : WeaponObject(game, Vector3()) {
    }
    WeaponObject(Game& game, Vector3 position);

    PlayerObject* GetAttachedTo();
    void AttachToPlayer(PlayerObject* player, WeaponAttachmentPoint attachmentPoint =
        WeaponAttachmentPoint::RIGHT);
    void Detach();

    virtual void StartFire(Time time) {
        script.CallMemberFunction("StartFire", time);
    }
    virtual void Fire(Time time) {

    }
    virtual void ReleaseFire(Time time) {

    }

    virtual void StartAlternateFire(Time time) {

    }
    virtual void ReleaseAlternateFire(Time time) {

    }

    virtual void StartReload(Time time) {

    }

    virtual void Tick(Time time) override;
};

// Manages cooldown
class WeaponWithCooldown : public WeaponObject {
public:
    // Set by underlying class
    Time cooldown = 0;

private:
    REPLICATED_D(Time, currentCooldown, "cd", 0);

    Time lastUseTime = 0;

public:
    WeaponWithCooldown(Game& game) : WeaponWithCooldown(game, Vector3()) {}
    WeaponWithCooldown(Game& game, Vector3 position) : WeaponObject(game, position) {}

    virtual void Tick(Time time) override;

    bool IsOnCooldown() { return currentCooldown != 0; }
    void CooldownStart(Time time);

    void ResetCooldown();
};
