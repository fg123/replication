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


        SetModel(game.GetModel("BulletTracer.obj"));

        // SetScale(Vector3(1, 1, glm::distance(from, to) / 2.0f));
        SetPosition(to);
        SetRotation(DirectionToQuaternion(glm::normalize(from - to)));
        SetScale(Vector3(1, 1, glm::distance(from, to)));
    }

    virtual void Tick(Time time) override {
        Object::Tick(time);
        float timeSince = glm::max(0.0f, (time - spawnTime) - 100.f);
        float travel = (timeSince / 500.f) * 100.0f;
        float totalTravel = glm::distance(from, to);

        float progress = 1.0f - glm::clamp(travel / totalTravel, 0.f, 1.f);
        SetScale(Vector3(1, 1, glm::mix(0.0f, glm::distance(from, to), progress)));

    #ifdef BUILD_SERVER
        if (travel > totalTravel) {
            game.DestroyObject(GetId());
        }
    #endif

    }
};

CLASS_REGISTER(BulletTracer);
