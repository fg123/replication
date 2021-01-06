#ifndef FLOATING_TEXT_H
#define FLOATING_TEXT_H

#include "animation.h"
#include "vector.h"

struct FloatingTextAnimation : public Animation {
    Vector2 position;
    std::string text;
    std::string color;

    FloatingTextAnimation(Vector2 position, std::string text, std::string color)
        : position(position), text(text), color(color) { }

    virtual const char* GetKey() override { return "FloatingText"; }

    virtual void SerializeData(JSONWriter& obj) override {
        SerializeDispatch(position, "p", obj);
        SerializeDispatch(text, "t", obj);
        SerializeDispatch(color, "c", obj);
    }
};

#endif

