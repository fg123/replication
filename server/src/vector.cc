#include "vector.h"
#include "json/json.hpp"
#include "logging.h"

bool AllEqual(bool a, bool b, bool c, bool d) {
    // Yuck
    return a == b && a == c && a == d;
}

template<typename TReal>
static bool ApproxEqual(TReal a, TReal b, TReal tolerance = std::numeric_limits<TReal>::epsilon())
{
    TReal diff = std::fabs(a - b);
    if (diff <= tolerance)
        return true;

    if (diff < std::fmax(std::fabs(a), std::fabs(b)) * tolerance)
        return true;

    return false;
}

// Checks if x between a and b closely
bool WithinBounds(const double& x, const double& a, const double& b) {
	if (ApproxEqual(x, a) || ApproxEqual(x, b)) {
		return true;
	}
	// LOG_DEBUG("Checks: " << std::min(a, b) << " <= " << x << " <= " << std::max(a, b) << " " << (std::min(a, b) <= x && x <= std::max(a, b)));
	return std::min(a, b) <= x && x <= std::max(a, b);
}

bool LineSegmentsIntersectPoint(const Vector3& p1, const Vector3& p2,
	const Vector3& q1, const Vector3& q2, Vector3& result) {
	// LOG_DEBUG("Check line segment intersection: " << p1 << " " << p2);
	// LOG_DEBUG("Line 2: " << q1 << " " << q2);
	// Line 1
	double a1 = p2.y - p1.y;
    double b1 = p1.x - p2.x;
    double c1 = a1 * (p1.x) + b1 * (p1.y);

    // Line 2
    double a2 = q2.y - q1.y;
    double b2 = q1.x - q2.x;
    double c2 = a2 * (q1.x) + b2 * (q1.y);

    double determinant = a1 * b2 - a2 * b1;

	// LOG_DEBUG("Determinant: " << determinant);
    if (determinant == 0)
    {
        return false;
    }
    else
    {
        double x = (b2 * c1 - b1 * c2) / determinant;
        double y = (a1 * c2 - a2 * c1) / determinant;
		// Check point is within bounds for both line segments

		// LOG_DEBUG("Intersection: " << Vector3(x, y));
		if (
			WithinBounds(x, p1.x, p2.x) &&
			WithinBounds(y, p1.y, p2.y) &&
			WithinBounds(x, q1.x, q2.x) &&
			WithinBounds(y, q1.y, q2.y)
		) {
			result.x = x;
			result.y = y;
			return true;
		}
    }
	return false;
}

bool AreLineSegmentsIntersecting(const Vector3& p1, const Vector3& p2, const Vector3& q1, const Vector3& q2) {
	Vector3 result;
	return LineSegmentsIntersectPoint(p1, p2, q1, q1, result);
}
