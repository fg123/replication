#pragma once

#include "object.h"
#include "game.h"

class LiftObject : public Object {

public:
    CLASS_CREATE(LiftObject)

    LiftObject(Game& game) : LiftObject(game, Vector3(), 1, 1) {}
    LiftObject(Game& game, Vector3 position, float radius, float height) : Object(game) {
        SetPosition(position);
        SetTag(Tag::NO_GRAVITY);
        collisionExclusion |= Tag::OBJECT;
        collisionReporting |= Tag::PLAYER;

        SetModel(game.GetModel("Lift.obj"));
        AddCollider(new CapsuleCollider(this, Vector3(0, 0, 0), Vector3(radius, height, radius), radius));
        SetScale(Vector3(radius, height, radius));
    }

    void OnCollide(CollisionResult& result) override {
        Object::OnCollide(result);
        #ifdef BUILD_SERVER
        if (PlayerObject* player = dynamic_cast<PlayerObject*>(result.collidedWith)) {
            LOG_DEBUG(game.GetGameTime() << ": Push Up");
            Vector3 vel = player->GetVelocity();
            vel.y += 25.f;
            player->SetVelocity(vel);
        }
        #endif
    }
};

CLASS_REGISTER(LiftObject);