#pragma once

#include "vector.h"

class Object;

struct RayCastRequest {
    Vector3 startPoint;
    Vector3 direction;

    uint64_t exclusionTags = 0;
};

struct RayCastResult {
    bool isHit = false;
    Vector3 hitLocation;
    Object* hitObject = nullptr;
    float zDepth;

    RayCastRequest castRequest;
};
