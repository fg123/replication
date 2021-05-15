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
        else if (glm::abs(r.collisionDifference.y) < glm::abs(r.collisionDifference.x) &&
                 glm::abs(r.collisionDifference.y) < glm::abs(r.collisionDifference.z)) {
            r.collisionDifference.x = 0;
            r.collisionDifference.z = 0;
        }
        else if (glm::abs(r.collisionDifference.z) < glm::abs(r.collisionDifference.x) &&
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

Vector3 AABBSurfaceNormal(AABBCollider* rect, Vector3 point) {
    Vector3 pt_min = rect->GetPosition();
    Vector3 pt_max = rect->GetPosition() + rect->size;
    Vector3 hitVec = point - ((pt_min + pt_max) / 2.0f);
    Vector3 d = glm::abs(pt_min - pt_max) / 2.0f;
    Vector3 norm = (hitVec / d) * 1.00001f;
    return glm::normalize(Vector3((int)norm.x, (int)norm.y, (int)norm.z));
}

bool CheckAABBAndSphereCollide(const Vector3& rpos, const Vector3& rsize,
    const Vector3& cpos, const float& rad) {

    Vector3 rectHalf = rsize / 2.0f;
    Vector3 rectCenter = rpos + rectHalf;
    Vector3 difference = cpos - rectCenter;
    Vector3 closest = glm::clamp(difference, -rectHalf, rectHalf);

    float distanceToClosest = glm::length(closest);
    float distanceToCircle = glm::length(difference);

    return distanceToCircle < distanceToClosest + rad;
}

CollisionResult AABBAndSphereCollide(AABBCollider* rect, SphereCollider* circle) {
    Vector3 rectPosition = rect->GetPosition();
    Vector3 circPosition = circle->GetPosition();

    // Find a position from
    Vector3 rectHalf = rect->size / 2.0f;
    Vector3 rectCenter = rectPosition + rectHalf;

    // get difference vector between both centers
    Vector3 difference = circPosition - rectCenter;

    Vector3 clamped = glm::clamp(difference, -rectHalf, rectHalf);
    LOG_DEBUG("Clamped " << clamped);
    // add clamped value to AABB_center and we get the value of box closest to circle
    Vector3 closest = rectCenter + clamped;
    if (IsPointInAABB(rectPosition, rect->size, circPosition)) {

        closest = circPosition;
    }
    LOG_DEBUG("Closest " << closest);
    LOG_DEBUG("Circ Position " << circPosition);
    // retrieve vector between center circle and closest point AABB and check if length <= radius
    // LOG_DEBUG("Difference " << closest << " " << circPosition);

    // We want the circle to be at closest + radius * surface normal there
    Vector3 normal = AABBSurfaceNormal(rect, closest);
    // Vector3 desired = closest + glm::normalize() * circle->radius;

    float distanceToClosest = glm::length(clamped);
    float distanceToCircle = glm::length(difference);

    bool colliding = distanceToCircle < distanceToClosest + circle->radius;

    CollisionResult r;
    r.isColliding = colliding;
    if (r.isColliding) {
        // LOG_DEBUG("Circ Rect " << difference << " " << overlapRange);
        // r.collisionDifference = circPosition - desired;
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

    result.hitNormal = AABBSurfaceNormal(this, result.hitLocation);
    // LOG_DEBUG("Hit Normal " << result.hitNormal);
    return true;
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