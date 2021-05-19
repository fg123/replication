#pragma once

#include "vector.h"

#include <vector>

// Separating Axis Theorem
void SATProject(const Vector3& axis, Vector3* ptSet, size_t ptsSize, float& minAlong, float& maxAlong);

// Returns how much the two ranges overlap
float SATOverlaps(float min1, float max1, float min2, float max2);
