#pragma once

#include "object.h"
#include "vector.h"
#include "game.h"

class BulletTracer : public Object {
    REPLICATED(Vector3, from, "from");
    REPLICATED(Vector3, to, "to");

public:
    CLASS_CREATE(BulletTracer)

    BulletTracer(Game& game) : BulletTracer(game, Vector3(), Vector3()) {}
    BulletTracer(Game& game, Vector3 from, Vector3 to) :
        Object(game),
        from(from),
        to(to) {

        collisionExclusion = (uint64_t) Tag::OBJECT;

        SetTag(Tag::NO_GRAVITY);

    #ifdef BUILD_SERVER
        SetModel(game.GetModel("BulletTracer.obj"));
    #endif
        // SetScale(Vector3(1, 1, glm::distance(from, to) / 2.0f));
        SetPosition(from);
        SetRotation(glm::quat_cast(glm::lookAt(from, to, Vector::Up)));
    }

    virtual void Tick(Time time) override {
        Object::Tick(time);

        float progress = glm::clamp((time - spawnTime) / 80.f, 0.f, 1.f);
        // LOG_DEBUG(progress);
        // LOG_DEBUG(progress << " " << glm::distance(from, to) << " " << glm::mix(0.0f, glm::distance(from, to), progress)));
        SetScale(Vector3(1, 1, glm::mix(0.0f, glm::distance(from, to), progress)));

    #ifdef BUILD_SERVER

        if (time > spawnTime + 500) {
            game.DestroyObject(GetId());
        }
    #endif

    }
};

CLASS_REGISTER(BulletTracer);
