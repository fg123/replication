#include "collision.h"
#include "object.h"

Vector3 Collider::GetPosition() {
    if (owner) {
        return position + owner->GetPosition();
    }
    else {
        return position;
    }
}

void GenerateAABBCollidersFromModel(Object* obj) {
    // Each Mesh Becomes a Collider
    // LOG_DEBUG("Generating Map Colliders");
    Model* model = obj->GetModel();
    if (model) {
        for (Mesh& mesh : model->meshes) {
            if (!mesh.vertices.empty()) {
                Vector3 min = mesh.vertices[0].position;
                Vector3 max = mesh.vertices[0].position;
                for (size_t i = 1; i < mesh.vertices.size(); i++) {
                    min = glm::min(min, mesh.vertices[i].position);
                    max = glm::max(max, mesh.vertices[i].position);
                }
                // LOG_DEBUG("Collider: " << min << " Size " << max - min);
                obj->AddCollider(new AABBCollider(obj, min, max - min));
            }
        }
    }
}

bool RectangleAndCircleCollidePotential(RectangleCollider* rect, CircleCollider* circle) {
    Vector3 rectPosition = rect->GetPosition();
    Vector3 circPosition = circle->GetPosition();

    // Circle entirely to the left of rect
    if (circPosition.x + circle->radius < rectPosition.x) return false;

    // Circle entirely to the right of rect
    if (circPosition.x - circle->radius > rectPosition.x + rect->size.x) return false;

    // Circle entirely to the top of rect
    if (circPosition.y + circle->radius < rectPosition.y) return false;

    // Circle entirely to the right of rect
    if (circPosition.y - circle->radius > rectPosition.y + rect->size.y) return false;

    // Do a more detailed check
    return true;
}

CollisionResult RectangleAndCircleCollide(RectangleCollider* rect, CircleCollider* circle) {
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
    float differenceLength = glm::length(difference);

    difference = glm::normalize(difference);

    float overlapRange = circle->radius - differenceLength;

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
        Vector3 position = GetPosition();
        Vector3 otherPos = otherRect->GetPosition();
        float x1 = position.x;
        float x2 = otherPos.x;
        float y1 = position.y;
        float y2 = otherPos.y;
        float w1 = size.x;
        float w2 = otherRect->size.x;
        float h1 = size.y;
        float h2 = otherRect->size.y;

        bool leftCollide = (x1 < x2 + w2);
        bool rightCollide = (x1 + w1 > x2);
        bool topCollide = (y1 < y2 + h2);
        bool bottomCollide = (y1 + h1 > y2);

        Vector3 myCenter (x1 + w1 / 2.0f, y1 + h1 / 2.0f, 0);
        Vector3 otherCenter (x2 + w2 / 2.0f, y2 + h2 / 2.0f, 0);

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
            // LOG_DEBUG("Difference " << r.collisionDifference);
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
        float distance = glm::distance(GetPosition(), otherCirc->GetPosition());
        float radii = (radius + otherCirc->radius);
        CollisionResult r;
        r.isColliding = distance < radii;
        if (r.isColliding) {
            Vector3 difference = glm::normalize(otherCirc->GetPosition() - GetPosition());
            r.collisionDifference = difference * (radii - distance);
        }
        return r;
    }
    else {
        return RectangleAndCircleCollide(static_cast<RectangleCollider*>(other), this);
    }
}

CollisionResult RectangleCollider::CollidesWith(const Vector3& p1, const Vector3& p2) {
    CollisionResult result;
    Vector3 RectPosition = GetPosition();
    if (IsPointInRect(RectPosition, size, p1) || IsPointInRect(RectPosition, size, p2)) {
        result.isColliding = true;
        return result;
    }
    Vector3 topRight = RectPosition;
    topRight.x += size.x;

    Vector3 bottomLeft = RectPosition;
    bottomLeft.y += size.y;

    Vector3 bottomRight = RectPosition + size;

    result.isColliding = AreLineSegmentsIntersecting(p1, p2, RectPosition, topRight) ||
        AreLineSegmentsIntersecting(p1, p2, topRight, bottomRight) ||
        AreLineSegmentsIntersecting(p1, p2, bottomRight, bottomLeft) ||
        AreLineSegmentsIntersecting(p1, p2, RectPosition, bottomLeft);
    return result;
}

CollisionResult CircleCollider::CollidesWith(const Vector3& p1, const Vector3& p2) {
    // TODO:
    return CollisionResult();
}

bool RectangleCollider::CollidePotentialWith(Collider* other) {
    if (other->GetType() == 0) {
        // Just do the collide check for rect / rect
        return CollidesWith(other).isColliding;
    }
    else {
        return RectangleAndCircleCollidePotential(this, static_cast<CircleCollider*>(other));
    }
}

bool CircleCollider::CollidePotentialWith(Collider* other) {
    if (other->GetType() == 1) {
        // Just do the collide check for circ / circ
        return CollidesWith(other).isColliding;
    }
    else {
        return RectangleAndCircleCollidePotential(static_cast<RectangleCollider*>(other), this);
    }
}
