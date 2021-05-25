#ifndef VECTOR_H
#define VECTOR_H

#include <cmath>
#include <ostream>
#include "glm.h"

template<class T>
constexpr const T& clamp(const T& v, const T& lo, const T& hi) {
    return (v < lo) ? lo : (hi < v) ? hi : v;
}

using Vector2 = glm::vec2;
using Vector3 = glm::vec3;
using Vector4 = glm::vec4;
using Matrix3 = glm::mat3;
using Matrix4 = glm::mat4;
using Quaternion = glm::quat;

struct Vector {
    const static Vector3 Up;
    const static Vector3 Forward;
    const static Vector3 Left;
};

bool AreLineSegmentsIntersecting(const Vector3& p1, const Vector3& p2, const Vector3& q1, const Vector3& q2);
bool LineSegmentsIntersectPoint(const Vector3& p1, const Vector3& p2, const Vector3& q1, const Vector3& q2, Vector3& result);

template<typename T>
inline bool SameSign(T a, T b) {
    return (a * b) > 0;
}

inline Quaternion DirectionToQuaternion(const Vector3& direction) {
    if (glm::length(glm::cross(glm::normalize(direction), Vector::Up)) <= 0.0001f) {
        // Let Left be the Roll
        return glm::quat_cast(glm::lookAt(Vector3(0, 0, 0), direction, Vector::Left));
    }
    return glm::quat_cast(glm::lookAt(Vector3(0, 0, 0), direction, Vector::Up));
}

inline bool IsZero(float a) {
    return glm::abs(a) < 0.00001f;
}
inline bool IsZero(Vector3 a) {
    return glm::length(a) < 0.00001f;
}
inline bool IsZero(Quaternion a) {
    return IsZero(Vector3(a.x, a.y, a.z));
}
#endif