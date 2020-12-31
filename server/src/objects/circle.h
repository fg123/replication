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

    virtual void Serialize(JSONWriter& obj) override {
        Object::Serialize(obj);
        obj.Key("radius");
        obj.Double(radius);
    }

    virtual void ProcessReplication(json& obj) override {
        Object::ProcessReplication(obj);
        radius = obj["radius"].GetDouble();
    }
};

CLASS_REGISTER(CircleObject);

#endif