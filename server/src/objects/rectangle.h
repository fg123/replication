#ifndef RECTANGLE_OBJ_H
#define RECTANGLE_OBJ_H

#include "object.h"
#include "json/json.hpp"

class RectangleObject : public Object {
public:
    REPLICATED(Vector2, size, "si");

    CLASS_CREATE(RectangleObject)

    RectangleObject(Game& game) : Object(game) {}
    RectangleObject(Game& game, Vector2 position, Vector2 size) :
         RectangleObject(game) {
        this->size = size;
        SetPosition(position);
        AddCollider(new RectangleCollider(this, Vector2(), size));
    }

    void ExtendYBy(double d) {
        size.y += d;
        static_cast<RectangleCollider*>(colliders[0])->size.y += d;
    }
};

CLASS_REGISTER(RectangleObject);
#endif