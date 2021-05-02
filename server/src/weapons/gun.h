#ifndef GUN_H
#define GUN_H

#include "weapon.h"
#include "game.h"

class GunBase : public WeaponObject {
protected:
    // Changable by underlying guns
    float fireRate = 10;
    int magazineSize;

    int magazines;
    int bullets;

    int damage;

    Time reloadTime;

    bool automaticFire = false;
    float fireOffset;

private:
    Time nextFireTime = 0;
    Time reloadStartTime = 0;

    Time timeSinceReload = 0;

    void ActualFire(Time time);
public:
    GunBase(Game& game) : GunBase(game, Vector3()) {}
    GunBase(Game& game, Vector3 position) : WeaponObject(game, position) {}

    virtual void StartReload(Time time) override;

    virtual void Tick(Time time) override;
    virtual void StartFire(Time time) override;
    virtual void Fire(Time time) override;
    virtual void Serialize(JSONWriter& obj) override;
    virtual void ProcessReplication(json& obj) override;
};

#endif