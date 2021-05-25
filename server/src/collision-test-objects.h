#pragma once

#include "object.h"
#include "game.h"

class SphereObject : public Object {
public:
    CLASS_CREATE(SphereObject);

    SphereObject(Game& game) : Object(game) {
        SetTag(Tag::NO_GRAVITY);
        SetModel(game.GetModel("Icosphere.obj"));
        AddCollider(new SphereCollider(this, Vector3(0), 1.01f));
    }
};
CLASS_REGISTER(SphereObject);

class BoxObject : public Object {
public:
    CLASS_CREATE(BoxObject);
    BoxObject(Game& game) : Object(game) {
        SetTag(Tag::NO_GRAVITY);
        SetModel(game.GetModel("Cube.obj"));
        AddCollider(new OBBCollider(this, Vector3(-0.5f), Vector3(1)));
    }
};
CLASS_REGISTER(BoxObject);