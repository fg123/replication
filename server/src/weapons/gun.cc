#include "gun.h"
#include "bullet.h"
#include "bullet-tracer.h"
#include "player.h"
#include "sprite.h"

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

    if (time > lastFireTime + cooldownBeforeSpreadReduction) {
        currentSpread -= spreadReduction;
        if (currentSpread < 0.f) {
            currentSpread = 0;
        }
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
    lastFireTime = time;
    nextFireTime = time + (1000.0 / fireRate);
    currentSpread += spreadIncreasePerShot;

    attachedTo->pitchYawVelocity.x += 0.1;
    attachedTo->pitchYawVelocity.y += ((std::fmod(currentSpread, 12) < 6) ? -1 : 1) *
        (currentSpread / 4) * ((time % 128 <= 64) ? 0.02 : 0.04);

    Vector3 bulletEnd = attachedTo->GetPosition() + attachedTo->GetLookDirection() * 10000.f;
    RayCastRequest request;
    request.startPoint = attachedTo->GetPosition() + attachedTo->GetLookDirection();
    request.direction = attachedTo->GetLookDirection();

    RayCastResult result = game.RayCastInWorld(request);
    if (result.isHit) {
        bulletEnd = result.hitLocation;
    }

    // Ray Cast
    // BulletObject* bullet = new BulletObject(game, damage, result);
    // // LOG_DEBUG(GetLookDirection() << " " << fireOffset);
    // Vector3 startPosition = GetPosition() + GetLookDirection() * fireOffset;
    // bullet->SetPosition(startPosition);
    // bullet->SetVelocity(glm::normalize(bulletEnd - startPosition) * 50.0f);
    // game.AddObject(bullet);
    // game.RequestReplication(GetId());

    Vector3 startPosition = GetPosition() + GetLookDirection() * fireOffset;

#ifdef BUILD_SERVER
    BulletTracer* bullet = new BulletTracer(game, startPosition, bulletEnd);
    game.AddObject(bullet);
#endif

    if (result.isHit) {
        if (result.hitObject->IsTagged(Tag::PLAYER)) {
            static_cast<PlayerObject*>(result.hitObject)->DealDamage(damage);
        }
        else {
            #ifdef BUILD_SERVER
                SpriteObject* decal = new SpriteObject(game, "textures/BulletHole/BulletHole.png");
                decal->SetPosition(result.hitLocation + result.hitNormal * 0.002f);
                decal->SetScale(Vector3(0.2f, 0.2f, 0.2f));
                LOG_DEBUG("Bullet Hole " << DirectionToQuaternion(result.hitNormal));
                decal->SetRotation(DirectionToQuaternion(result.hitNormal));
                game.AddObject(decal);
            #endif
        }
    }

#ifdef BUILD_SERVER
    game.RequestReplication(GetId());
#endif

    game.PlayAudio("bang.wav", 1.0f, GetPosition());

    SetDirty(true);
}

void GunBase::StartReload(Time time) {
    if (reloadStartTime == 0 && magazines > 0 && bullets != magazineSize) {
        reloadStartTime = time;
        game.PlayAudio("reload.wav", 1.0f, this);
    }
}