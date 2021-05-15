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

    float spreadReduction = 0.5f;
    float spreadIncreasePerShot = 2;
    int cooldownBeforeSpreadReduction = 100;

    float recoilRotationPitch = 0;
    float recoilRotationPitchVel = 0;

private:
    Time lastFireTime = 0;
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
    #ifdef BUILD_CLIENT
    virtual const Matrix4 GetTransform() override {
        Matrix4 recoilMatrix;
        recoilMatrix = glm::rotate(recoilMatrix, glm::radians(recoilRotationPitch),
            Vector3(recoilMatrix[0][0], recoilMatrix[1][0], recoilMatrix[2][0]));

        return glm::translate(clientPosition) *
            glm::transpose(glm::toMat4(clientRotation)) *
            glm::transpose(recoilMatrix) *
            glm::scale(scale);
    }
    #endif
};

#endif