#pragma once

#include "object.h"
#include "vector.h"
#include "game.h"

class BulletTracer : public Object {
    REPLICATED(Vector3, from, "from");
    REPLICATED(Vector3, to, "to");

#ifdef BUILD_CLIENT
    bool hasBeenSetup = false;
#endif

    GunBase* gunBase = nullptr;

public:
    CLASS_CREATE(BulletTracer)

    BulletTracer(Game& game) : BulletTracer(game, nullptr, Vector3()) {}
    BulletTracer(Game& game, GunBase* gunBase, Vector3 to) :
        Object(game),
        to(to),
        gunBase(gunBase) {

        if (gunBase) {
            from = gunBase->GetMuzzleLocation();
        }

        collisionExclusion = (uint64_t) Tag::OBJECT;

        SetTag(Tag::NO_GRAVITY);
        SetTag(Tag::NO_CAST_SHADOWS);


        SetModel(game.GetModel("BulletTracer.obj"));

        // SetScale(Vector3(1, 1, glm::distance(from, to) / 2.0f));
        SetPosition(to);
        SetRotation(DirectionToQuaternion(glm::normalize(from - to)));
        SetScale(Vector3(1, 1, glm::distance(from, to)));
    }

    virtual void Tick(Time time) override {
        Object::Tick(time);
        float timeSince = glm::max(0.0f, (float)(time - spawnTime));
        float travel = (timeSince / 500.f) * 100.0f;
        float totalTravel = glm::distance(from, to);

        float progress = 1.0f - glm::clamp(travel / totalTravel, 0.f, 1.f);
        SetScale(Vector3(1, 1, glm::mix(0.0f, glm::distance(from, to), progress)));

    #ifdef BUILD_SERVER
        if (travel > totalTravel) {
            game.DestroyObject(GetId());
        }
    #endif
    #ifdef BUILD_CLIENT
        if (gunBase) {
            from = gunBase->GetMuzzleLocation();
        }
    #endif
    }

    virtual void Serialize(JSONWriter& obj) override {
        Object::Serialize(obj);
        if (gunBase) {
            obj.Key("gun");
            obj.Uint64(gunBase->GetId());
        }
    }

    virtual void ProcessReplication(json& object) override {
        Object::ProcessReplication(object);

        if (object.HasMember("gun")) {
            gunBase = game.GetObject<GunBase>(object["gun"].GetInt());
        }
        else {
            gunBase = nullptr;
        }
    }
};

CLASS_REGISTER(BulletTracer);
