#include "sat.h"

inline bool SATIsBetweenOrdered(float val, float lowerBound, float upperBound) {
    return lowerBound <= val && val <= upperBound ;
}

void SATProject(const Vector3& axis, Vector3* ptSet, size_t ptsSize, float& minAlong, float& maxAlong) {
    float firstDot = glm::dot(ptSet[0], axis);

    minAlong = firstDot;
    maxAlong = firstDot;
    for (size_t i = 1; i < ptsSize; i++) {
        // just dot it to get the min/max along this axis.
        float dotVal = glm::dot(ptSet[i], axis);
        minAlong = glm::min(minAlong, dotVal);
        maxAlong = glm::max(maxAlong, dotVal);
    }
}

float SATOverlaps(float min1, float max1, float min2, float max2) {
    if (min1 <= min2 && min2 <= max1) {
        return min2 - max1;
    }
    if (min2 <= min1 && min1 <= max2) {
        return max2 - min1;
    }
    return 0;
}