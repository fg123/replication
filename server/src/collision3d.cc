#include "collision.h"
#include "object.h"

bool AABBAndSphereCollidePotential(AABBCollider* rect, SphereCollider* circle) {
    Vector3 rectPosition = rect->GetPosition();
    Vector3 circPosition = circle->GetPosition();

    // Circle entirely to the left of rect
    if (circPosition.x + circle->radius < rectPosition.x) return false;

    // Circle entirely to the right of rect
    if (circPosition.x - circle->radius > rectPosition.x + rect->size.x) return false;

    // Circle entirely to the top of rect
    if (circPosition.y + circle->radius < rectPosition.y) return false;

    // Circle entirely to the bottom of rect
    if (circPosition.y - circle->radius > rectPosition.y + rect->size.y) return false;

    // Circle entirely to the front of rect
    if (circPosition.z + circle->radius < rectPosition.z) return false;

    // Circle entirely to the back of rect
    if (circPosition.z - circle->radius > rectPosition.z + rect->size.z) return false;

    // Do a more detailed check
    return true;
}

CollisionResult AABBAndSphereCollide(AABBCollider* rect, SphereCollider* circle) {
    // TODO;
    Vector3 rectPosition = rect->GetPosition();
    Vector3 circPosition = circle->GetPosition();

    Vector3 rectHalf (rect->size.x / 2.0f, rect->size.y / 2.0f, 0);
    Vector3 rectCenter (
        rectPosition.x + rectHalf.x,
        rectPosition.y + rectHalf.y,
        0
    );

    if (IsPointInRect(rectPosition, rect->size, circPosition)) {
        // Calculate how far back to move the circle to get it out of the rectangle
        // LOG_WARN("Circle (" << circle->GetOwner() << ") in Rectangle (" << rect->GetOwner() << ")");

        // LOG_DEBUG("Circle Position " << circPosition);
        // LOG_DEBUG("Circle Velocity " << circle->GetOwner()->GetVelocity());
        // LOG_DEBUG("Rectangle Position " << rectPosition);
        // LOG_DEBUG("Rectangle Size " << rect->size);

        // Clamp backwards to edge of rectangle
        Vector3 cVel = circle->GetOwner()->GetVelocity();
        Vector3 rVel = rect->GetOwner()->GetVelocity();

        // LastFrame should be where the circle was last frame:
        //   circPosition - cVel
        // But, if the rectangle is moving towards the circle instead (or both are moving)
        //   this position won't be correct.
        Vector3 lastFrame = circPosition - cVel + rVel; // Where we were last frame

        Vector3 topLeft = rectPosition - circle->radius;
        Vector3 topRight = rectPosition;
        topRight.x += rect->size.x + circle->radius;
        topRight.y -= circle->radius;

        Vector3 bottomLeft = rectPosition;
        bottomLeft.x -= circle->radius;
        bottomLeft.y += rect->size.y + circle->radius;
        Vector3 bottomRight = rectPosition + rect->size + circle->radius;

        // Test each intersection
        Vector3 intersectionPoint;

        if (LineSegmentsIntersectPoint(circPosition, lastFrame, topLeft, topRight, intersectionPoint)) {
        }
        else if (LineSegmentsIntersectPoint(circPosition, lastFrame, topRight, bottomRight, intersectionPoint)) {
        }
        else if (LineSegmentsIntersectPoint(circPosition, lastFrame, bottomRight, bottomLeft, intersectionPoint)) {
        }
        else if (LineSegmentsIntersectPoint(circPosition, lastFrame, topLeft, bottomLeft, intersectionPoint)) {
        }
        else {
            LOG_WARN("No intersection with edge!");
        }
        CollisionResult r;
        r.collisionDifference = -(intersectionPoint - circPosition);
        // LOG_DEBUG("Difference " << r.collisionDifference);
        // LOG_DEBUG("New Pos " << circPosition - r.collisionDifference);
        r.isColliding = true;
        return r;
    }

    // get difference vector between both centers
    Vector3 difference = circPosition - rectCenter;
    Vector3 clamped = glm::clamp(difference, -rectHalf, rectHalf);

    // add clamped value to AABB_center and we get the value of box closest to circle
    Vector3 closest = rectCenter + clamped;
    // retrieve vector between center circle and closest point AABB and check if length <= radius
    // LOG_DEBUG("Difference " << closest << " " << circPosition);
    difference = closest - circPosition;
    // Difference should point away from the rectangle.
    double differenceLength = glm::length(difference);

    difference = glm::normalize(difference);

    double overlapRange = circle->radius - differenceLength;

    CollisionResult r;
    r.isColliding = overlapRange > 0;
    if (r.isColliding) {
        // LOG_DEBUG("Circ Rect " << difference << " " << overlapRange);
        r.collisionDifference = difference * overlapRange;
    }
    return r;
}

CollisionResult AABBCollider::CollidesWith(Collider* other) {
    if (other->GetType() == 2) {
        // Trust the Ghetto RTTI
        RectangleCollider* otherRect = static_cast<RectangleCollider*>(other);
        Vector3 position = GetPosition();
        Vector3 otherPos = otherRect->GetPosition();

        double x1 = position.x;
        double x2 = otherPos.x;
        double y1 = position.y;
        double y2 = otherPos.y;
        double z1 = position.z;
        double z2 = otherPos.z;

        double w1 = size.x;
        double w2 = otherRect->size.x;
        double h1 = size.y;
        double h2 = otherRect->size.y;
        double d1 = size.z;
        double d2 = otherRect->size.z;

        bool leftCollide = (x1 < x2 + w2);
        bool rightCollide = (x1 + w1 > x2);
        bool topCollide = (y1 < y2 + h2);
        bool bottomCollide = (y1 + h1 > y2);
        bool frontCollide = (z1 < z2 + d2);
        bool backCollide = (z1 + d1 > z2);

        Vector3 myCenter    (x1 + w1 / 2.0, y1 + h1 / 2.0, z1 + d1 / 2.0);
        Vector3 otherCenter (x2 + w2 / 2.0, y2 + h2 / 2.0, z2 + d2 / 2.0);

        bool biasX = myCenter.x < otherCenter.x;
        bool biasY = myCenter.y < otherCenter.y;
        bool biasZ = myCenter.z < otherCenter.z;

        // LOG_DEBUG("Collides " << leftCollide << " " << rightCollide <<
        //                   " " << topCollide << " " << bottomCollide <<
        //                   " " << frontCollide << " " << backCollide);
        CollisionResult r;
        r.isColliding = (leftCollide && rightCollide) && (topCollide && bottomCollide) && (frontCollide && backCollide);
        if (r.isColliding) {

            r.collisionDifference.x = !biasX ? -(x2 + w2 - x1) : x1 + w1 - x2;
            r.collisionDifference.y = !biasY ? -(y2 + h2 - y1) : y1 + h1 - y2;
            r.collisionDifference.z = !biasZ ? -(z2 + d2 - z1) : z1 + d1 - z2;

            // Each of the collision differences allow for the box to completely
            //   come back out. Choose the smallest magnitude to resolve
            if (glm::abs(r.collisionDifference.x) < glm::abs(r.collisionDifference.y) &&
                glm::abs(r.collisionDifference.x) < glm::abs(r.collisionDifference.z)) {
                r.collisionDifference.y = 0;
                r.collisionDifference.z = 0;
            }
            if (glm::abs(r.collisionDifference.y) < glm::abs(r.collisionDifference.x) &&
                glm::abs(r.collisionDifference.y) < glm::abs(r.collisionDifference.z)) {
                r.collisionDifference.x = 0;
                r.collisionDifference.z = 0;
            }
            if (glm::abs(r.collisionDifference.z) < glm::abs(r.collisionDifference.x) &&
                glm::abs(r.collisionDifference.z) < glm::abs(r.collisionDifference.y)) {
                r.collisionDifference.x = 0;
                r.collisionDifference.y = 0;
            }
            // LOG_DEBUG("Collide! Correction " << r.collisionDifference);
            // LOG_DEBUG("1: " << position << " " << size);
            // LOG_DEBUG("2: " << otherPos << " " << otherRect->size);
        }
        return r;
    }
    else {
        CollisionResult r = AABBAndSphereCollide(this, static_cast<SphereCollider*>(other));
        r.collisionDifference *= -1;
        return r;
    }
}

CollisionResult SphereCollider::CollidesWith(Collider* other) {
    if (other->GetType() == 3) {
        // Trust the RTTI
        CircleCollider* otherCirc = static_cast<CircleCollider*>(other);
        double distance = glm::distance(GetPosition(), otherCirc->GetPosition());
        double radii = (radius + otherCirc->radius);
        CollisionResult r;
        r.isColliding = distance < radii;
        if (r.isColliding) {
            Vector3 difference = glm::normalize(otherCirc->GetPosition() - GetPosition());
            r.collisionDifference = difference * (radii - distance);
        }
        return r;
    }
    else {
        return AABBAndSphereCollide(static_cast<AABBCollider*>(other), this);
    }
}

CollisionResult AABBCollider::CollidesWith(const Vector3& p1, const Vector3& p2) {
    // TODO:
    return CollisionResult();
}

CollisionResult SphereCollider::CollidesWith(const Vector3& p1, const Vector3& p2) {
    // TODO:
    return CollisionResult();
}

bool AABBCollider::CollidePotentialWith(Collider* other) {
    if (other->GetType() == 2) {
        // Just do the collide check for rect / rect
        return CollidesWith(other).isColliding;
    }
    else {
        return AABBAndSphereCollidePotential(this, static_cast<SphereCollider*>(other));
    }
}

bool SphereCollider::CollidePotentialWith(Collider* other) {
    if (other->GetType() == 3) {
        // Just do the collide check for circ / circ
        return CollidesWith(other).isColliding;
    }
    else {
        return AABBAndSphereCollidePotential(static_cast<AABBCollider*>(other), this);
    }
}
