#ifndef CIRCLE_OBJ_H
#define CIRCLE_OBJ_H

#include "object.h"
#include "json/json.hpp"

class CircleObject : public Object {
    double radius;
public:
    CircleObject(Game& game, Vector2 position, double radius) :
        Object(game), radius(radius) {
        SetPosition(position);

        AddCollider(new CircleCollider(this, Vector2::Zero, radius));
    }
    const char* GetClass() override { return "CircleObject"; }
    
    virtual void Serialize(json& obj) override {
        Object::Serialize(obj);
        obj["radius"] = radius;
    }
};

#endif