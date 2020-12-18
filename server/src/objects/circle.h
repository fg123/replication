#ifndef CIRCLE_OBJ_H
#define CIRCLE_OBJ_H

#include "object.h"
#include "json/json.hpp"

class CircleObject : public Object {
    double radius;
public:
    CLASS_CREATE(CircleObject)

    CircleObject(Game& game) : Object(game) {}
    CircleObject(Game& game, Vector2 position, double radius) :
        CircleObject(game) {
        this->radius = radius;
        SetPosition(position);

        AddCollider(new CircleCollider(this, Vector2::Zero, radius));
    }
    
    virtual void Serialize(json& obj) override {
        Object::Serialize(obj);
        obj["radius"] = radius;
    }
};

CLASS_REGISTER(CircleObject);

#endif