#include "collision.h"
#include "object.h"

CollisionResult AABBAndAABBCollide(AABBCollider* rect1, AABBCollider* rect2) {
    Vector3 position = rect1->GetPosition();
    Vector3 otherPos = rect2->GetPosition();

    float x1 = position.x;
    float x2 = otherPos.x;
    float y1 = position.y;
    float y2 = otherPos.y;
    float z1 = position.z;
    float z2 = otherPos.z;

    float w1 = rect1->size.x;
    float w2 = rect2->size.x;
    float h1 = rect1->size.y;
    float h2 = rect2->size.y;
    float d1 = rect1->size.z;
    float d2 = rect2->size.z;

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

CollisionResult SphereAndSphereCollide(SphereCollider* c1, SphereCollider* c2) {
    float distance = glm::distance(c1->GetPosition(), c2->GetPosition());
    float radii = (c1->radius + c2->radius);
    CollisionResult r;
    r.isColliding = distance < radii;
    if (r.isColliding) {
        Vector3 difference = glm::normalize(c2->GetPosition() - c1->GetPosition());
        r.collisionDifference = difference * (radii - distance);
    }
    return r;
}

CollisionResult AABBAndSphereCollide(AABBCollider* rect, SphereCollider* circle) {
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

CollisionResult TwoPhaseAndAABBCollide(TwoPhaseCollider* twoPhase, AABBCollider* aabb) {
    if (!AABBAndAABBCollide(&twoPhase->aabbBroad, aabb).isColliding) {
        // Early Out
        return CollisionResult{};
    }
    CollisionResult finalResult;
    for (auto& colliderOther: twoPhase->children) {
        CollisionResult r = colliderOther->CollidesWith(aabb);
        if (r.isColliding) {
            finalResult.isColliding = true;
            finalResult.collisionDifference += r.collisionDifference;
        }
    }
    return finalResult;
}

CollisionResult TwoPhaseAndSphereCollide(TwoPhaseCollider* twoPhase, SphereCollider* sphere) {
    if (!AABBAndSphereCollide(&twoPhase->aabbBroad, sphere).isColliding) {
        // Early Out
        return CollisionResult{};
    }
    CollisionResult finalResult;
    for (auto& colliderOther: twoPhase->children) {
        CollisionResult r = colliderOther->CollidesWith(sphere);
        if (r.isColliding) {
            finalResult.isColliding = true;
            finalResult.collisionDifference += r.collisionDifference;
        }
    }
    return finalResult;
}

CollisionResult TwoPhaseAndTwoPhaseCollide(TwoPhaseCollider* tp1, TwoPhaseCollider* tp2) {
    if (!AABBAndAABBCollide(&tp1->aabbBroad, &tp2->aabbBroad).isColliding) {
        // Early Out
        return CollisionResult{};
    }
    CollisionResult finalResult;
    for (auto& collider : tp2->children) {
        CollisionResult r = tp1->CollidesWith(collider);
        if (r.isColliding) {
            finalResult.isColliding = true;
            finalResult.collisionDifference += r.collisionDifference;
        }
    }
    return finalResult;
}

CollisionResult AABBCollider::CollidesWith(Collider* other) {
    if (other->GetType() == 3) {
        CollisionResult r = AABBAndSphereCollide(this, static_cast<SphereCollider*>(other));
        r.collisionDifference *= -1;
        return r;
    }
    else if (other->GetType() == 2) {
        // AABB Collider vs AABB Collider
        return AABBAndAABBCollide(this, static_cast<AABBCollider*>(other));
    }
}

CollisionResult SphereCollider::CollidesWith(Collider* other) {
    if (other->GetType() == 2) {
        return AABBAndSphereCollide(static_cast<AABBCollider*>(other), this);
    }
    else if (other->GetType() == 3) {
        // Trust the RTTI
        return SphereAndSphereCollide(this, static_cast<SphereCollider*>(other));
    }
}

CollisionResult TwoPhaseCollider::CollidesWith(TwoPhaseCollider* other) {
    return TwoPhaseAndTwoPhaseCollide(this, other);
}

CollisionResult TwoPhaseCollider::CollidesWith(Collider* other) {
    if (other->GetType() == 2) {
        return TwoPhaseAndAABBCollide(this, static_cast<AABBCollider*>(other));
    }
    else if (other->GetType() == 3) {
        // Trust the RTTI
        return TwoPhaseAndSphereCollide(this, static_cast<SphereCollider*>(other));
    }
    return CollisionResult{};
}


CollisionResult AABBCollider::CollidesWith(const Vector3& p1, const Vector3& p2) {
    // TODO:
    return CollisionResult();
}

bool AABBCollider::CollidesWith(RayCastRequest& ray, RayCastResult& result) {
    Vector3 pt_min = GetPosition();
    Vector3 pt_max = GetPosition() + size;
    Vector3 invDirection = 1.0f / ray.direction;

    // r.org is origin of ray
    float t1 = (pt_min.x - ray.startPoint.x) * invDirection.x;
    float t2 = (pt_max.x - ray.startPoint.x) * invDirection.x;
    float t3 = (pt_min.y - ray.startPoint.y) * invDirection.y;
    float t4 = (pt_max.y - ray.startPoint.y) * invDirection.y;
    float t5 = (pt_min.z - ray.startPoint.z) * invDirection.z;
    float t6 = (pt_max.z - ray.startPoint.z) * invDirection.z;

    float tmin = glm::max(glm::max(glm::min(t1, t2), glm::min(t3, t4)), glm::min(t5, t6));
    float tmax = glm::min(glm::min(glm::max(t1, t2), glm::max(t3, t4)), glm::max(t5, t6));

    // if tmax < 0, ray (line) is intersecting AABB, but the whole AABB is behind us
    if (tmax < 0) {
        return false;
    }

    // if tmin > tmax, ray doesn't intersect AABB
    if (tmin > tmax) {
        return false;
    }

    if (result.isHit && result.zDepth < tmin) {
        // Already have a result that's closer than ours
        return false;
    }
    result.isHit = true;
    result.hitLocation = ray.startPoint + ray.direction * tmin;
    result.zDepth = tmin;

    LOG_DEBUG("Hit Result: ");
    LOG_DEBUG("Box " << pt_min << " " << pt_max);
    LOG_DEBUG("Hit Location: " << result.hitLocation);
    Vector3 hitVec = result.hitLocation - ((pt_min + pt_max) / 2.0f);
    Vector3 d = glm::abs(pt_min - pt_max) / 2.0f;
    Vector3 norm = (hitVec / d) * 1.00001f;
    result.hitNormal = glm::normalize(Vector3((int)norm.x, (int)norm.y, (int)norm.z));
    LOG_DEBUG("Hit Normal " << result.hitNormal);
    return true;
}

CollisionResult SphereCollider::CollidesWith(const Vector3& p1, const Vector3& p2) {
    // TODO:
    return CollisionResult();
}

void TwoPhaseCollider::Serialize(JSONWriter& obj) {
    Replicable::Serialize(obj);
    obj.Key("c");
    obj.StartArray();
    // LOG_DEBUG("Colliders:");
    for (auto& collider : children) {
        obj.StartObject();
        collider->Serialize(obj);
        obj.EndObject();
    }
    obj.EndArray();
}

void TwoPhaseCollider::ProcessReplication(json& object) {
    Replicable::ProcessReplication(object);
    if (children.size() != object["c"].GetArray().Size()) {
        // LOG_WARN("Clearing colliders");
        for (auto& collider : children) {
            delete collider;
        }
        children.clear();
    }
    if (children.empty()) {
        for (json& colliderInfo : object["c"].GetArray()) {
            if (colliderInfo["t"].GetInt() == 0) {
                children.push_back(new RectangleCollider(owner, Vector3(), Vector3()));
            }
            else if (colliderInfo["t"].GetInt() == 1) {
                children.push_back(new CircleCollider(owner, Vector3(), 0));
            }
            else if (colliderInfo["t"].GetInt() == 2) {
                children.push_back(new AABBCollider(owner, Vector3(), Vector3()));
            }
            else if (colliderInfo["t"].GetInt() == 3) {
                children.push_back(new SphereCollider(owner, Vector3(), 0));
            }
        }
    }
    size_t i = 0;
    for (json& colliderInfo : object["c"].GetArray()) {
        children[i]->ProcessReplication(colliderInfo);
        i += 1;
        if (i >= children.size()) {
            break;
        }
    }
}