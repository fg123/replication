#ifndef EXPLODE_H
#define EXPLODE_H

#include "animation.h"
#include "vector.h"

struct ExplodeAnimation : public Animation {
    Vector2 position;
    double size;

    ExplodeAnimation(Vector2 position, double size)
        : position(position), size(size) { }
    virtual const char* GetKey() override { return "Explode"; }
    virtual void SerializeData(JSONWriter& obj) override {
        SerializeDispatch(position, "p", obj);
        SerializeDispatch(size, "s", obj);
    }
};

#endif

