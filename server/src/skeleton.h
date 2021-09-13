#pragma once

#include "vector.h"
#include <vector>

struct Bone {
    size_t parent;
    Vector3 position;
    Quaternion rotation;
    float length;
};

struct Skeleton {
    std::vector<Bone> bones;
};
