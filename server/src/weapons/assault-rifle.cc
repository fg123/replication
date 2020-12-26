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
    bullet->SetPosition(GetPosition() + attachedTo->GetAimDirection() * 25);
    bullet->SetVelocity(attachedTo->GetAimDirection() * 2000.0);
    game.AddObject(bullet);
#endif
}

AssaultRifleObject::AssaultRifleObject(Game& game, Vector2 position) : WeaponObject(game, position) {
    AddCollider(new RectangleCollider(this, Vector2(-26, -10), Vector2(74, 24)));
}
