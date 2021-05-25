#include "hook.h"
#include "hook-thrower.h"

HookObject::HookObject(Game& game, ObjectID playerId) : ThrownProjectile(game, playerId) {
    // Don't Collide with Weapons
    collisionExclusion |= (uint64_t) Tag::WEAPON;
    collisionExclusion |= (uint64_t) Tag::PLAYER;
    SetTag(Tag::NO_GRAVITY);
    #ifdef BUILD_SERVER
        SetModel(game.GetModel("BulletTracer.obj"));
        AddCollider(new OBBCollider(this, Vector3(-0.1, -0.1, -0.1), Vector3(0.2, 0.2, 0.2)));
    #endif

    game.PlayAudio("HookThrow.wav", 1.f, this);
    airFriction = Vector3(1, 1, 1);
}

void HookObject::OnCollide(CollisionResult& result) {
    if (result.collidedWith->IsTagged(Tag::WEAPON)) {
        // Ignore
        return;
    }
    if (result.collidedWith->IsStatic()) {
        SetIsStatic(true);
        collisionExclusion |= (uint64_t) Tag::PLAYER;
    }
}

void HookObject::Tick(Time time) {
    ThrownProjectile::Tick(time);
    // Always Rotate Towards Attached
    PlayerObject* playerObject = static_cast<PlayerObject*>(firedBy->GetAttachedTo());

    SetRotation(DirectionToQuaternion(firedBy->GetPosition() - GetPosition()));
    SetScale(Vector3(0.5f, 0.5f, glm::distance(firedBy->GetPosition(), GetPosition())));

    bool isDead = false;
    if (!IsStatic() &&
        glm::distance(firedBy->GetPosition(), GetPosition()) > HookObject::MaxLength) {
        isDead = true;
        static_cast<HookThrower*>(firedBy)->ResetCooldown();
    }
    else if (IsStatic()) {
        if (!audioPlayed) {
            game.PlayAudio("HookReel.wav", 1.f, playerObject);
            audioPlayed = true;
        }
        Vector3 position = playerObject->GetPosition();
        // Vector3 velocity = playerObject->Object::GetVelocity();
        // Make regular direction twice as powerful as the aiming pull
        Vector3 direction = glm::normalize(GetPosition() - position) * 5.0f;
        Vector3 aimDirection = playerObject->GetLookDirection();
        // velocity = glm::normalize(direction + aimDirection) * 1000.0f;
        playerObject->SetVelocity(glm::normalize(direction + aimDirection) * 15.0f);
        hasForceBeenApplied = true;

        // // TODO: Cut off the rope if it intersects map object
        // CollisionResult r = game.CheckLineSegmentCollide(position + direction * 10.0f,
        //     GetPosition() - (direction * 10.0f), (uint64_t)Tag::GROUND);
        // if (r.isColliding) {
        //     isDead = true;
        // }
    }

    if (hasForceBeenApplied &&
        glm::distance(playerObject->GetPosition(), GetPosition()) < 2.f) {
        isDead = true;
    }

    if (time - spawnTime > 5000.f) {
        isDead = true;
    }

#ifdef BUILD_SERVER
    if (isDead) {
        LOG_DEBUG("Kill HookObject");
        game.DestroyObject(GetId());
    }
#endif
}

