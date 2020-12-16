#include "vector.h"
#include "json/json.hpp"

const Vector2 Vector2::Zero;

void Vector2::Serialize(json& obj) {
    obj["x"] = x;
    obj["y"] = y;
}

void Vector2::Normalize() {
    double norm = Length();
    x /= norm;
    y /= norm;
}