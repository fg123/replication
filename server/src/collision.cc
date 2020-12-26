#include "collision.h"
#include "object.h"

Vector2 Collider::GetPosition() {
    if (owner) {
        return position + owner->GetPosition();
    }
    else {
        return position;
    }
}

CollisionResult RectangleAndCircleCollide(RectangleCollider* rect, CircleCollider* circle) {
    Vector2 rectPosition = rect->GetPosition();
    Vector2 circPosition = circle->GetPosition();

    if (IsPointInRect(rectPosition, rect->size, circPosition)) {
        LOG_WARN("Circle (" << circle->GetOwner() << ") in Rectangle (" << rect->GetOwner() << ")");
    }

    Vector2 rectHalf (rect->size.x / 2.0f, rect->size.y / 2.0f);
    Vector2 rectCenter (
        rectPosition.x + rectHalf.x,
        rectPosition.y + rectHalf.y
    );
    // get difference vector between both centers
    Vector2 difference = circPosition - rectCenter;
    Vector2 clamped = difference.Clamp(-rectHalf, rectHalf);

    // add clamped value to AABB_center and we get the value of box closest to circle
    Vector2 closest = rectCenter + clamped;
    // retrieve vector between center circle and closest point AABB and check if length <= radius
    // LOG_DEBUG("Difference " << closest << " " << circPosition);
    difference = closest - circPosition;
    // Difference should point away from the rectangle.
    double differenceLength = difference.Length();

    difference.Normalize();

    double overlapRange = circle->radius - differenceLength;

    CollisionResult r;
    r.isColliding = overlapRange > 0;
    if (r.isColliding) {
        // LOG_DEBUG("Circ Rect " << difference << " " << overlapRange);
        r.collisionDifference = difference * overlapRange;
    }
    return r;
}

CollisionResult RectangleCollider::CollidesWith(Collider* other) {
    if (other->GetType() == 0) {
        // Trust the Ghetto RTTI
        RectangleCollider* otherRect = static_cast<RectangleCollider*>(other);
        Vector2 position = GetPosition();
        Vector2 otherPos = otherRect->GetPosition();
        double x1 = position.x;
        double x2 = otherPos.x;
        double y1 = position.y;
        double y2 = otherPos.y;
        double w1 = size.x;
        double w2 = otherRect->size.x;
        double h1 = size.y;
        double h2 = otherRect->size.y;

        bool leftCollide = (x1 < x2 + w2);
        bool rightCollide = (x1 + w1 > x2);
        bool topCollide = (y1 < y2 + h2);
        bool bottomCollide = (y1 + h1 > y2);

        Vector2 myCenter (x1 + w1 / 2.0f, y1 + h1 / 2.0f);
        Vector2 otherCenter (x2 + w2 / 2.0f, y2 + h2 / 2.0f);

        bool biasX = myCenter.x < otherCenter.x;
        bool biasY = myCenter.y < otherCenter.y;

        CollisionResult r;
        r.isColliding = (leftCollide && rightCollide) && (topCollide && bottomCollide);
        if (r.isColliding) {

            r.collisionDifference.x = !biasX ? -(x2 + w2 - x1) : x1 + w1 - x2;
            r.collisionDifference.y = !biasY ? -(y2 + h2 - y1) : y1 + h1 - y2;

            double diff = std::abs(r.collisionDifference.x) - std::abs(r.collisionDifference.y);
            if (diff > 0.01) {
                r.collisionDifference.x = 0;
            }
            else if (diff < -0.01) {
                r.collisionDifference.y = 0;
            }
        }
        return r;
    }
    else {
        CollisionResult r = RectangleAndCircleCollide(this, static_cast<CircleCollider*>(other));
        r.collisionDifference *= -1;
        return r;
    }
}

CollisionResult CircleCollider::CollidesWith(Collider* other) {
    if (other->GetType() == 1) {
        // Trust the RTTI
        CircleCollider* otherCirc = static_cast<CircleCollider*>(other);
        double distance = GetPosition().Distance(otherCirc->GetPosition());
        double radii = (radius + otherCirc->radius);
        CollisionResult r;
        r.isColliding = distance < radii;
        if (r.isColliding) {
            Vector2 difference = (otherCirc->GetPosition() - GetPosition());
            difference.Normalize();
            r.collisionDifference = difference * (radii - distance);
        }
        return r;
    }
    else {
        return RectangleAndCircleCollide(static_cast<RectangleCollider*>(other), this);
    }
}

bool AreLineSegmentsIntersecting(const Vector2& p1, const Vector2& p2, const Vector2& q1, const Vector2& q2);

CollisionResult RectangleCollider::CollidesWith(const Vector2& p1, const Vector2& p2) {
    CollisionResult result;
    Vector2 RectPosition = GetPosition();
    if (IsPointInRect(RectPosition, size, p1) || IsPointInRect(RectPosition, size, p2)) {
        result.isColliding = true;
        return result;
    }
    Vector2 topRight = RectPosition;
    topRight.x += size.x;

    Vector2 bottomLeft = RectPosition;
    bottomLeft.y += size.y;

    Vector2 bottomRight = RectPosition + size;

    result.isColliding = AreLineSegmentsIntersecting(p1, p2, RectPosition, topRight) ||
        AreLineSegmentsIntersecting(p1, p2, topRight, bottomRight) ||
        AreLineSegmentsIntersecting(p1, p2, bottomRight, bottomLeft) ||
        AreLineSegmentsIntersecting(p1, p2, RectPosition, bottomLeft);
    return result;
}

CollisionResult CircleCollider::CollidesWith(const Vector2& p1, const Vector2& p2) {
    // TODO:
    return CollisionResult();
}