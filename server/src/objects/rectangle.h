#ifndef RECTANGLE_OBJ_H
#define RECTANGLE_OBJ_H

#include "object.h"
#include "json/json.hpp"

class RectangleObject : public Object {
    REPLICATED(Vector2, size, "s");
public:
    CLASS_CREATE(RectangleObject)

    RectangleObject(Game& game) : Object(game) {}
    RectangleObject(Game& game, Vector2 position, Vector2 size) :
         RectangleObject(game) {
        this->size = size;
        SetPosition(position);
        AddCollider(new RectangleCollider(this, Vector2::Zero, size));
    }
};

CLASS_REGISTER(RectangleObject);
#endif