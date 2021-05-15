#pragma once

#include "vector.h"

class Object;

struct RayCastRequest {
    Vector3 startPoint;
    Vector3 direction;

    uint64_t exclusionTags;

    RayCastRequest();
};

struct RayCastResult {
    bool isHit = false;
    Vector3 hitLocation;
    Vector3 hitNormal;
    Object* hitObject = nullptr;
    float zDepth;

    RayCastRequest castRequest;
};
