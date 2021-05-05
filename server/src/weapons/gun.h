#ifndef GUN_H
#define GUN_H

#include "weapon.h"
#include "game.h"

class GunBase : public WeaponObject {
protected:
    // Changable by underlying guns
    REPLICATED_D(float, fireRate, "fr", 10);
    REPLICATED(int, magazineSize, "magsize");

    REPLICATED(int, magazines, "mags");
    REPLICATED(int, bullets, "blts");

    REPLICATED(int, damage, "dmg");

    REPLICATED(Time, reloadTime, "rlt");

    bool automaticFire = false;
    float fireOffset;

private:
    Time nextFireTime = 0;
    Time reloadStartTime = 0;

    REPLICATED_D(Time, timeSinceReload, "tsr", 0);

    void ActualFire(Time time);
public:
    GunBase(Game& game) : GunBase(game, Vector3()) {}
    GunBase(Game& game, Vector3 position) : WeaponObject(game, position) {}

    virtual void StartReload(Time time) override;

    virtual void Tick(Time time) override;
    virtual void StartFire(Time time) override;
    virtual void Fire(Time time) override;
};

#endif