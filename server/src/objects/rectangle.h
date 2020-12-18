#ifndef RECTANGLE_OBJ_H
#define RECTANGLE_OBJ_H

#include "object.h"
#include "json/json.hpp"

class RectangleObject : public Object {
    Vector2 size;
public:
    CLASS_CREATE(RectangleObject)

    RectangleObject(Game& game) : Object(game) {}
    RectangleObject(Game& game, Vector2 position, Vector2 size) :
         RectangleObject(game) {
        this->size = size;
        SetPosition(position);
        AddCollider(new RectangleCollider(this, Vector2::Zero, size));
    }

    virtual void Serialize(json& obj) override {
        Object::Serialize(obj);
        size.Serialize(obj["size"]);
    }
};

CLASS_REGISTER(RectangleObject);
#endif