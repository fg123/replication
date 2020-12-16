#ifndef RECTANGLE_OBJ_H
#define RECTANGLE_OBJ_H

#include "object.h"
#include "json/json.hpp"

class RectangleObject : public Object {
    Vector2 size;
public:
    RectangleObject(Game& game, Vector2 position, Vector2 size) :
        Object(game), size(size) {
        SetPosition(position);

        AddCollider(new RectangleCollider(this, Vector2::Zero, size));
    }

    const char* GetClass() override { return "RectangleObject"; }

    virtual void Serialize(json& obj) override {
        Object::Serialize(obj);
        size.Serialize(obj["size"]);
    }
};

#endif