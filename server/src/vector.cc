#include "vector.h"
#include "json/json.hpp"

const Vector2 Vector2::Zero;

void Vector2::Serialize(json& obj) {
    obj["x"] = x;
    obj["y"] = y;
}

Vector2& Vector2::Normalize() {
    double norm = Length();
    x /= norm;
    y /= norm;
    return *this;
}

Vector2 Vector2::Normalize() const {
    double norm = Length();
    return Vector2(x / norm, y / norm);
}

void Vector2::ProcessReplication(json& obj) {
    x = obj["x"];
    y = obj["y"];
}

bool AllEqual(bool a, bool b, bool c, bool d) {
    // Yuck
    return a == b && a == c && a == d;
}

bool AreLineSegmentsIntersecting(const Vector2& p1, const Vector2& p2, const Vector2& q1, const Vector2& q2) {
	Vector2 r = p2 - p1;
	Vector2 s = q2 - q1;

	double uNumerator = Vector2::CrossProduct(q1 - p1, r);
	double denominator = Vector2::CrossProduct(r, s);

	if (uNumerator == 0 && denominator == 0) {
		// They are coLlinear
		
		// Do they touch? (Are any of the points equal?)
		if (p1 == q1 || p1 == q2 || p2 == q1 || p2 == q2) {
			return true;
		}
		// Do they overlap? (Are all the point differences in either direction the same sign)
		return !AllEqual(
				(q1.x - p1.x < 0),
				(q1.x - p2.x < 0),
				(q2.x - p1.x < 0),
				(q2.x - p2.x < 0)) ||
			!AllEqual(
				(q1.y - p1.y < 0),
				(q1.y - p2.y < 0),
				(q2.y - p1.y < 0),
				(q2.y - p2.y < 0));
	}

	if (denominator == 0) {
		// lines are paralell
		return false;
	}

	double u = uNumerator / denominator;
	double t = Vector2::CrossProduct(q1 - p1, s) / denominator;

	return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);
}