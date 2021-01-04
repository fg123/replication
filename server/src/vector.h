#ifndef VECTOR_H
#define VECTOR_H

#include <cmath>
#include <ostream>

template<class T>
constexpr const T& clamp(const T& v, const T& lo, const T& hi) {
    return (v < lo) ? lo : (hi < v) ? hi : v;
}

struct Vector2 {
    double x;
    double y;

    Vector2() : Vector2(0.0, 0.0) {}
    Vector2(double x, double y) : x(x), y(y) {}

    static const Vector2 Zero;

    inline double Distance(const Vector2& v) const { return std::sqrt(std::pow(x - v.x, 2) + std::pow(y - v.y, 2)); }

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

    inline const Vector2 operator - (void) const { return Vector2(-x, -y); }
    inline const Vector2 operator + (double v) const { return Vector2(x + v, y + v); }
    inline const Vector2 operator - (double v) const { return Vector2(x - v, y - v); }
    inline const Vector2 operator * (double v) const { return Vector2(x * v, y * v); }
    inline const Vector2 operator / (double v) const { return Vector2(x / v, y / v); }

    inline Vector2 & operator += (double v) { x += v; y += v; return *this; }
    inline Vector2 & operator -= (double v) { x -= v; y -= v; return *this; }
    inline Vector2 & operator *= (double v) { x *= v; y *= v; return *this; }
    inline Vector2 & operator /= (double v) { x /= v; y /= v; return *this; }

    static inline double CrossProduct(const Vector2 & a, const Vector2 & b) {
        return a.x * b.y - a.y * b.x;
    }

    Vector2& Normalize();
    Vector2 Normalize() const;
    double Length() const { return std::sqrt(std::pow(x, 2) + std::pow(y, 2)); }
    inline Vector2 Clamp(const Vector2& min, const Vector2& max) const {
        return Vector2(clamp(x, min.x, max.x), clamp(y, min.y, max.y));
    }

    friend std::ostream& operator<<(std::ostream& os, const Vector2& v);

    bool CheckNan() const { return std::isnan(x) || std::isnan(y); }
    bool IsZero() const { return x == 0 && y == 0; }
};

bool AreLineSegmentsIntersecting(const Vector2& p1, const Vector2& p2, const Vector2& q1, const Vector2& q2);
bool LineSegmentsIntersectPoint(const Vector2& p1, const Vector2& p2, const Vector2& q1, const Vector2& q2, Vector2& result);

inline std::ostream& operator<<(std::ostream& os, const Vector2& v) {
    os << "(" << v.x << ", " << v.y << ")";
    return os;
}

template<typename T>
inline bool SameSign(T a, T b) {
    return (a * b) > 0;
}

#endif