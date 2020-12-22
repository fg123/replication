#ifndef PISTOL_H
#define PISTOL_H

#include "weapon.h"
#include "game.h"
#include "bullet.h"

class PistolObject : public WeaponObject {
    int fireRate = 10;
    Time nextFireTime = 0;
public:
    CLASS_CREATE(PistolObject)
    
    PistolObject(Game& game) : PistolObject(game, Vector2::Zero) {}
    PistolObject(Game& game, Vector2 position) : WeaponObject(game, position) {}
    
    virtual void StartFire(Time time) override {
        if (time < nextFireTime) {
            return;
        }
        nextFireTime = time + (1000.0 / 10.0);
    #ifdef BUILD_SERVER
        BulletObject* bullet = new BulletObject(game);
        bullet->SetPosition(GetPosition() + attachedTo->GetAimDirection() * 50);
        bullet->SetVelocity(attachedTo->GetAimDirection() * 2000.0);
        game.AddObject(bullet);
    #endif
    }
};

CLASS_REGISTER(PistolObject);

#endif