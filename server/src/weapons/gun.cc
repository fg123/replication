#include "gun.h"
#include "bullet-tracer.h"
#include "player.h"
#include "bullet-hole.h"

void GunBase::Tick(Time time) {
    if (reloadStartTime != 0) {
        timeSinceReload = time - reloadStartTime;
    }
    else {
        timeSinceReload = 0;
    }

    if (reloadStartTime != 0 && time >= reloadStartTime + reloadTime) {
        reloadStartTime = 0;
        if (attachedTo->inventoryManager.GetAmmoCount() > 0) {
        #ifdef BUILD_SERVER
            bullets = attachedTo->inventoryManager.RemoveAmmo(magazineSize);
            game.RequestReplication(GetId());
        #endif
        }
    }

    if (time > lastFireTime + cooldownBeforeSpreadReduction) {
        currentSpread -= spreadReduction;
        if (currentSpread < 0.f) {
            currentSpread = 0;
        }
    }

    if (isADS) {
        attachmentPoint = WeaponAttachmentPoint::CENTER;
    }
    else {
        attachmentPoint = WeaponAttachmentPoint::RIGHT;
    }

#ifdef BUILD_CLIENT
    recoilRotationPitch += recoilRotationPitchVel;
    recoilRotationPitchVel *= 0.5;
    if (glm::abs(recoilRotationPitchVel) < 0.01f) {
        recoilRotationPitchVel = 0;
        recoilRotationPitch -= 5;
    }
    if (recoilRotationPitch < 0) {
        recoilRotationPitch = 0;
    }
#endif

    WeaponObject::Tick(time);
}

void GunBase::Serialize(JSONWriter& obj) {
    WeaponObject::Serialize(obj);
    #ifdef BUILD_CLIENT
        obj.Key("inventoryAmmo");
        obj.Uint(attachedTo->inventoryManager.GetAmmoCount());
    #endif
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
    if (!automaticFire) {
        recoilRotationPitchVel = 45.f;
    }

    attachedTo->pitchYawVelocity.x += 0.1;
    attachedTo->pitchYawVelocity.y += ((std::fmod(currentSpread, 12) < 6) ? -1 : 1) *
        (currentSpread / 4) * ((time % 128 <= 64) ? 0.02 : 0.04);

    Vector3 bulletEnd = attachedTo->GetPosition() + attachedTo->GetLookDirection() * 1000.f;
    RayCastRequest request;
    request.excludeObjects.insert(attachedTo->GetId());
    request.startPoint = attachedTo->GetPosition() + attachedTo->GetLookDirection();
    request.direction = attachedTo->GetLookDirection();

    RayCastResult result = game.RayCastInWorld(request);
    if (result.isHit) {
        bulletEnd = result.hitLocation;
    }

    // Ray Cast

    Vector3 startPosition = GetPosition() + fireOffset * GetRotation();

#ifdef BUILD_SERVER
    BulletTracer* bullet = new BulletTracer(game, startPosition, bulletEnd);
    game.AddObject(bullet);
#endif

    if (result.isHit) {
        if (result.hitObject->IsTagged(Tag::PLAYER)) {
            static_cast<PlayerObject*>(result.hitObject)->DealDamage(damage, attachedTo->GetId());
        }
        else {
            #ifdef BUILD_SERVER
                BulletHoleDecal* decal = new BulletHoleDecal(game);
                decal->SetPosition(result.hitLocation + result.hitNormal * 0.002f);
                decal->SetScale(Vector3(0.2f, 0.2f, 0.2f));
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
    if (reloadStartTime == 0 && attachedTo->inventoryManager.GetAmmoCount() > 0 && bullets != magazineSize) {
        reloadStartTime = time;
        game.PlayAudio("reload.wav", 1.0f, this);
    }
}