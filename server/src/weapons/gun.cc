#include "gun.h"
#include "bullet.h"
#include "player.h"

void GunBase::Tick(Time time) {
    WeaponObject::Tick(time);

    // Point Gun in same direction
    if (attachedTo) {
        // LOG_DEBUG("Rotation: " << rotation);
        SetRotation(attachedTo->GetRotation());
    }

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

#ifdef BUILD_SERVER
    bullets -= 1;
    nextFireTime = time + (1000.0 / fireRate);
    BulletObject* bullet = new BulletObject(game, damage);
    bullet->SetPosition(GetPosition() + GetLookDirection());
    bullet->SetVelocity(attachedTo->GetLookDirection() * 100.f);
    game.AddObject(bullet);
    game.RequestReplication(GetId());
#endif
}

void GunBase::StartReload(Time time) {
    if (reloadStartTime == 0 && magazines > 0 && bullets != magazineSize) {
        reloadStartTime = time;
    }
}

void GunBase::Serialize(JSONWriter& obj) {
    WeaponObject::Serialize(obj);
    obj.Key("fr");
    obj.Double(fireRate);

    obj.Key("magsize");
    obj.Int(magazineSize);

    obj.Key("mags");
    obj.Int(magazines);

    obj.Key("blts");
    obj.Int(bullets);

    obj.Key("dmg");
    obj.Int(damage);

    obj.Key("rlt");
    obj.Uint(reloadTime);

    obj.Key("tsr");
    obj.Uint(timeSinceReload);
}

void GunBase::ProcessReplication(json& obj) {
    WeaponObject::ProcessReplication(obj);
    fireRate = obj["fr"].GetDouble();
    magazineSize = obj["magsize"].GetInt();
    magazines = obj["mags"].GetInt();
    bullets = obj["blts"].GetInt();
    damage = obj["dmg"].GetInt();
    reloadTime = obj["rlt"].GetUint();
    timeSinceReload = obj["tsr"].GetUint();
}
