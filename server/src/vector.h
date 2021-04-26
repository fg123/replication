#ifndef VECTOR_H
#define VECTOR_H

#include <cmath>
#include <ostream>
#include "glm.h"

template<class T>
constexpr const T& clamp(const T& v, const T& lo, const T& hi) {
    return (v < lo) ? lo : (hi < v) ? hi : v;
}

using Vector2 = glm::dvec2;
using Vector3 = glm::dvec3;

bool AreLineSegmentsIntersecting(const Vector2& p1, const Vector2& p2, const Vector2& q1, const Vector2& q2);
bool LineSegmentsIntersectPoint(const Vector2& p1, const Vector2& p2, const Vector2& q1, const Vector2& q2, Vector2& result);

template<typename T>
inline bool SameSign(T a, T b) {
    return (a * b) > 0;
}

#endif