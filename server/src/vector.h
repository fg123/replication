#ifndef VECTOR_H
#define VECTOR_H

#include <cmath>
#include <ostream>
#include <algorithm>

#include "replicable.h"

struct Vector2 : Replicable {
    double x;
    double y;

    Vector2() : Vector2(0.0, 0.0) {}
    Vector2(double x, double y) : x(x), y(y) {}
    
    static const Vector2 Zero;

    inline double Distance(const Vector2& v) { return std::sqrt(std::pow(x - v.x, 2) + std::pow(y - v.y, 2)); }
    
    inline Vector2 & operator = (const Vector2 & v) { x = v.x; y = v.y; return *this; }
    inline Vector2 & operator = (const double & f) { x = f; y = f; return *this; }
    inline bool operator == (const Vector2 & v) const { return (x == v.x) && (y == v.y); }
    inline bool operator != (const Vector2 & v) const { return (x != v.x) || (y != v.y); }

    inline const Vector2 operator + (const Vector2 & v) const { return Vector2(x + v.x, y + v.y); }
    inline const Vector2 operator - (const Vector2 & v) const { return Vector2(x - v.x, y - v.y); }
    inline const Vector2 operator * (const Vector2 & v) const { return Vector2(x * v.x, y * v.y); }
    inline const Vector2 operator / (const Vector2 & v) const { return Vector2(x / v.x, y / v.y); }

    inline Vector2 & operator += (const Vector2 & v) { x += v.x; y += v.y; return *this; }
    inline Vector2 & operator -= (const Vector2 & v) { x -= v.x; y -= v.y; return *this; }
    inline Vector2 & operator *= (const Vector2 & v) { x *= v.x; y *= v.y; return *this; }
    inline Vector2 & operator /= (const Vector2 & v) { x /= v.x; y /= v.y; return *this; }

    inline const Vector2 operator - (void) { return Vector2(-x, -y); }
    inline const Vector2 operator + (double v) const { return Vector2(x + v, y + v); }
    inline const Vector2 operator - (double v) const { return Vector2(x - v, y - v); }
    inline const Vector2 operator * (double v) const { return Vector2(x * v, y * v); }
    inline const Vector2 operator / (double v) const { return Vector2(x / v, y / v); }

    inline Vector2 & operator += (double v) { x += v; y += v; return *this; }
    inline Vector2 & operator -= (double v) { x -= v; y -= v; return *this; }
    inline Vector2 & operator *= (double v) { x *= v; y *= v; return *this; }
    inline Vector2 & operator /= (double v) { x /= v; y /= v; return *this; }

    virtual void Serialize(json& obj) override;

    void Normalize();
    double Length() const { return std::sqrt(std::pow(x, 2) + std::pow(y, 2)); }
    inline Vector2 Clamp(const Vector2& min, const Vector2& max) const {
        return Vector2(std::clamp(x, min.x, max.x), std::clamp(y, min.y, max.y));
    }

    friend std::ostream& operator<<(std::ostream& os, const Vector2& v);
};

inline std::ostream& operator<<(std::ostream& os, const Vector2& v) {
    os << "(" << v.x << ", " << v.y << ")";
    return os;
}

inline bool IsPointInRect(const Vector2& RectPosition, const Vector2& RectSize, const Vector2& Point) {
    return 
        (Point.x > RectPosition.x && Point.x < RectPosition.x + RectSize.x) &&
        (Point.y > RectPosition.y && Point.y < RectPosition.y + RectSize.y);
}

template<typename T>
inline bool SameSign(T a, T b) {
    return (a * b) > 0;
}

#endif