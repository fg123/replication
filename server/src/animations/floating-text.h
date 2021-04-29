#ifndef FLOATING_TEXT_H
#define FLOATING_TEXT_H

#include "animation.h"
#include "vector.h"

struct FloatingTextAnimation : public Animation {
    Vector3 position;
    std::string text;
    std::string color;

    FloatingTextAnimation(Vector3 position, std::string text, std::string color)
        : position(position), text(text), color(color) { }

    virtual const char* GetKey() override { return "FloatingText"; }

    virtual void SerializeData(JSONWriter& obj) override {
        obj.Key("p");
        SerializeDispatch(position, obj);
        obj.Key("t");
        SerializeDispatch(text, obj);
        obj.Key("c");
        SerializeDispatch(color, obj);
    }
};

#endif

