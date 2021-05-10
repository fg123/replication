#ifndef GUN_H
#define GUN_H

#include "weapon.h"
#include "game.h"

// struct RecoilPattern {
//     std::vector<Vector2> corePoints;

//     std::vector<glm::vec4> cubicFunctions;

//     RecoilPattern(std::initializer_list<Vector2> l) : corePoints(l) {
//         // Generate Cubic Spline

//     }

//     float GetRecoil(float time) {
//         for (size_t i = 1; i < corePoints.size(); i++) {
//             if (corePoints[i].x < time) {
//                 return EvaluateCubic(cubicFunctions[i], time);
//             }
//         }
//     }

//     float EvaluateCubic(const glm::vec4& fn, const float& time) {
//         return fn[0] +
//             fn[1] * time +
//             fn[2] * time * time +
//             fn[3] * time * time * time;
//     }
// };

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

    // static RecoilPattern pattern;

private:
    Time lastFireTime = 0;
    Time nextFireTime = 0;
    Time reloadStartTime = 0;

    REPLICATED_D(Time, timeSinceReload, "tsr", 0);
    REPLICATED(float, currentSpread, "spread");

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