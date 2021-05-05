#include "gun.h"
#include "bullet.h"
#include "bullet-tracer.h"
#include "player.h"

void GunBase::Tick(Time time) {
    if (reloadStartTime != 0) {
        timeSinceReload = time - reloadStartTime;
    }
    else {
        timeSinceReload = 0;
    }

    if (reloadStartTime != 0 && time >= reloadStartTime + reloadTime) {
        reloadStartTime = 0;
        if (magazines > 0) {
        #ifdef BUILD_SERVER
            magazines -= 1;
            bullets = magazineSize;
            game.RequestReplication(GetId());
        #endif
        }
    }

    if (attachedTo) {
        SetRotation(attachedTo->GetRotation());
    }
    WeaponObject::Tick(time);
}

void GunBase::Fire(Time time) {
    if (automaticFire) {
        ActualFire(time);
    }
}

void GunBase::StartFire(Time time) {
    if (!automaticFire) {
        ActualFire(time);
    }
}

void GunBase::ActualFire(Time time) {
    if (time < nextFireTime) {
        // Firing cooldown
        return;
    }

    if (bullets == 0) {
        // Out of ammo
        return;
    }

    if (reloadStartTime != 0) {
        // Currently reloading
        return;
    }

    bullets -= 1;
    nextFireTime = time + (1000.0 / fireRate);

    Vector3 bulletEnd = attachedTo->GetPosition() + attachedTo->GetLookDirection() * 10000.f;
    RayCastRequest request;
    request.startPoint = attachedTo->GetPosition() + attachedTo->GetLookDirection();
    request.direction = attachedTo->GetLookDirection();

    RayCastResult result = game.RayCastInWorld(request);
    if (result.isHit) {
        bulletEnd = result.hitLocation;
    }

    // Ray Cast
#ifdef BUILD_SERVER
    // BulletObject* bullet = new BulletObject(game, damage);
    // Vector3 startPosition = GetPosition() + GetLookDirection();
    // bullet->SetPosition(startPosition);
    // bullet->SetVelocity(bulletDirection * 100.0f);
    // game.AddObject(bullet);
    // game.RequestReplication(GetId());

    BulletTracer* bullet = new BulletTracer(game, GetPosition(), bulletEnd);
    game.AddObject(bullet);
    game.RequestReplication(GetId());
#endif
}

void GunBase::StartReload(Time time) {
    if (reloadStartTime == 0 && magazines > 0 && bullets != magazineSize) {
        reloadStartTime = time;
    }
}