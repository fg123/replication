#include "assault-rifle.h"
#include "bullet.h"
#include "player.h"

void AssaultRifleObject::Fire(Time time) {
    if (time < nextFireTime) {
        return;
    }
    nextFireTime = time + (1000.0 / fireRate);
#ifdef BUILD_SERVER
    BulletObject* bullet = new BulletObject(game);
    bullet->SetPosition(GetPosition() + attachedTo->GetAimDirection() * 50);
    bullet->SetVelocity(attachedTo->GetAimDirection() * 2000.0);
    game.AddObject(bullet);
#endif
}