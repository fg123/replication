#pragma once

#include "object.h"
#include "game.h"

class SpectatorBox : public Object {

public:
    CLASS_CREATE(SpectatorBox)

    SpectatorBox(Game& game) : Object(game) {
        SetTag(Tag::NO_GRAVITY);
        SetIsStatic(true);
        SetTag(Tag::GROUND);

        SetModel(game.GetModel("SpectatorArea.obj"));
        GenerateStaticMeshCollidersFromModel(this);
    }

    virtual void Tick(Time time) override {
        Object::Tick(time);
        #ifdef BUILD_SERVER
            if (time - spawnTime > 5000) {
                game.DestroyObject(GetId());
            }
        #endif
    }
};

CLASS_REGISTER(SpectatorBox);