#pragma once

#include "vector.h"

#include <set>

class Object;

// This must be 32 bit because client side JS only supports 32 bit
using ObjectID = uint32_t;

struct RayCastRequest {
    Vector3 startPoint;
    Vector3 direction;

    uint64_t exclusionTags;
    std::set<ObjectID> excludeObjects;

    RayCastRequest();
};

struct RayCastResult {
    bool isHit = false;
    Vector3 hitLocation;
    Vector3 hitNormal;
    Object* hitObject = nullptr;
    float zDepth;
};
