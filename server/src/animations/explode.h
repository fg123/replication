#ifndef EXPLODE_H
#define EXPLODE_H

#include "animation.h"
#include "vector.h"

struct ExplodeAnimation : public Animation {
    Vector3 position;
    double size;

    ExplodeAnimation(Vector3 position, double size)
        : position(position), size(size) { }
    virtual const char* GetKey() override { return "Explode"; }
    virtual void SerializeData(JSONWriter& obj) override {
        obj.Key("p");
        SerializeDispatch(position, obj);
        obj.Key("s");
        SerializeDispatch(size, obj);
    }
};

#endif

