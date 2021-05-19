#include "collision.h"
#include "object.h"
#include "sat.h"

std::ostream& operator<<(std::ostream& out, const CollisionResult& result) {
    out << "CollisionResult: " <<
        (result.isColliding ? "YES" : "NO");
    if (result.isColliding) {
        out << " " << result.collisionDifference;
    }
    if (result.collidedWith) {
        out << " " << result.collidedWith->GetClass();
    }
    return out;
}

CollisionResult AABBAndAABBCollideNoRotation(AABBCollider* rect1, AABBCollider* rect2) {
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

        r.collisionDifference.x = !biasX ? x2 + w2 - x1 : -(x1 + w1 - x2);
        r.collisionDifference.y = !biasY ? y2 + h2 - y1 : -(y1 + h1 - y2);
        r.collisionDifference.z = !biasZ ? z2 + d2 - z1 : -(z1 + d1 - z2);

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
    }
    return r;
}

void GenerateAABBRotatedCorners(Matrix4 transform, Vector3 size, Vector3* corners) {
    float x = size.x;
    float y = size.y;
    float z = size.z;
    corners[0] = Vector3(transform * Vector4(0, 0, 0, 1));
    corners[1] = Vector3(transform * Vector4(x, 0, 0, 1));
    corners[2] = Vector3(transform * Vector4(0, y, 0, 1));
    corners[3] = Vector3(transform * Vector4(x, y, 0, 1));
    corners[4] = Vector3(transform * Vector4(0, 0, z, 1));
    corners[5] = Vector3(transform * Vector4(x, 0, z, 1));
    corners[6] = Vector3(transform * Vector4(0, y, z, 1));
    corners[7] = Vector3(transform * Vector4(x, y, z, 1));
}

CollisionResult AABBAndAABBCollide(AABBCollider* rect1, AABBCollider* rect2) {
    Quaternion r1Rotation = rect1->GetRotation();
    Quaternion r2Rotation = rect2->GetRotation();
    if (IsZero(r1Rotation) && IsZero(r2Rotation)) {
        // Fast Path
        return AABBAndAABBCollideNoRotation(rect1, rect2);
    }
    // Apply SAT
    // 3 normals for each box
    Vector3 ax1 = r1Rotation * Vector::Up;
    Vector3 ax2 = r1Rotation * Vector::Left;
    Vector3 ax3 = r1Rotation * Vector::Forward;
    Vector3 ax4 = r2Rotation * Vector::Up;
    Vector3 ax5 = r2Rotation * Vector::Left;
    Vector3 ax6 = r2Rotation * Vector::Forward;
    Vector3 axes[] = {
        ax1, ax2, ax3, ax4, ax5, ax6,
        glm::cross(ax1, ax4), glm::cross(ax1, ax5), glm::cross(ax1, ax6),
        glm::cross(ax2, ax4), glm::cross(ax2, ax5), glm::cross(ax2, ax6),
        glm::cross(ax3, ax4), glm::cross(ax3, ax5), glm::cross(ax3, ax6)
    };

    Vector3 r1Corners[8], r2Corners[8];
    GenerateAABBRotatedCorners(rect1->GetWorldTransform(), rect1->size, r1Corners);
    GenerateAABBRotatedCorners(rect2->GetWorldTransform(), rect2->size, r2Corners);

    float minOverlap = INFINITY;
    Vector3 minOverlapNormal;
    for (size_t i = 0; i < 15; i++) {
        if (IsZero(axes[i])) {
            continue;
        }
        float shape1Min, shape1Max, shape2Min, shape2Max;
        SATProject(axes[i], r1Corners, 8, shape1Min, shape1Max);
        SATProject(axes[i], r2Corners, 8, shape2Min, shape2Max);
        float overlap = SATOverlaps(shape1Min, shape1Max, shape2Min, shape2Max);
        if (IsZero(overlap)) {
            // No overlap on one axis means we are good
            return CollisionResult{};
        }
        // LOG_DEBUG("Axes " << axes[i] << " overlap " << overlap);
        if (glm::abs(overlap) < glm::abs(minOverlap)) {
            minOverlap = overlap;
            minOverlapNormal = axes[i];
        }
    }
    // if (IsZero(minOverlapNormal.y)) {
    //     LOG_DEBUG("=> AABB Collision " << minOverlapNormal << " " << minOverlap);
    // }
    CollisionResult result;
    result.isColliding = true;
    result.collisionDifference = minOverlapNormal * minOverlap;
    // LOG_DEBUG("Diff " << result.collisionDifference);
    return result;
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

CollisionResult AABBAndMeshCollide(AABBCollider* rect, StaticMeshCollider* collider) {
    // #ifdef BUILD_SERVER
    //     LOG_DEBUG("Start AABB & Mesh Collide " << collider->mesh.name);
    // #endif
    if (!AABBAndAABBCollide(rect, &collider->broad).isColliding) {
        return CollisionResult{};
    }
    auto& indices = collider->mesh.indices;
    auto& vertices = collider->mesh.vertices;

    Quaternion r1Rotation = rect->GetRotation();
    // LOG_DEBUG("AABB Mesh Collide");

    Vector3 r1Corners[8];
    GenerateAABBRotatedCorners(rect->GetWorldTransform(), rect->size, r1Corners);

    Vector3 rax1 = r1Rotation * Vector::Up;
    Vector3 rax2 = r1Rotation * Vector::Left;
    Vector3 rax3 = r1Rotation * Vector::Forward;

    for (size_t i = 0; i < indices.size(); i += 3) {
        const Vector3& a = vertices[indices[i]].position;
        const Vector3& b = vertices[indices[i+1]].position;
        const Vector3& c = vertices[indices[i+2]].position;

        Vector3 normal = (
            vertices[indices[i]].normal +
            vertices[indices[i+1]].normal +
            vertices[indices[i+2]].normal) / 3.f;
// #ifdef BUILD_SERVER
//         LOG_DEBUG("Test on Triangle " << a << " " << b << " " << c << " " << normal);
// #endif
        // Apply SAT
        // 3 normals for each box
        Vector3 e1 = b - a;
        Vector3 e2 = c - b;
        Vector3 e3 = a - c;

        Vector3 axes[] = {
            rax1, rax2, rax3,
            glm::cross(rax1, e1), glm::cross(rax1, e2), glm::cross(rax1, e3),
            glm::cross(rax2, e1), glm::cross(rax2, e2), glm::cross(rax2, e3),
            glm::cross(rax3, e1), glm::cross(rax3, e2), glm::cross(rax3, e3),
            normal
        };

        Vector3 r2Corners[] = { a, b, c };

        float minOverlap = INFINITY;
        Vector3 minOverlapNormal;
        bool didCollide = true;
        for (size_t i = 0; i < 13; i++) {
            if (IsZero(axes[i])) {
                continue;
            }
            float shape1Min, shape1Max, shape2Min, shape2Max;
            SATProject(axes[i], r1Corners, 8, shape1Min, shape1Max);
            SATProject(axes[i], r2Corners, 3, shape2Min, shape2Max);
            float overlap = SATOverlaps(shape1Min, shape1Max, shape2Min, shape2Max);
            if (IsZero(overlap)) {
                // No overlap on one axis means we are good
                // #ifdef BUILD_SERVER
                // LOG_DEBUG("No overlap: axes " << axes[i] << " overlap " << overlap);
                // #endif
                didCollide = false;
                break;
            }
            // #ifdef BUILD_SERVER
            // LOG_DEBUG(shape1Min << " " << shape1Max << " " << shape2Min << " " << shape2Max);
            // LOG_DEBUG("Axes " << axes[i] << " overlap " << overlap);
            // #endif
            if (i == 12) {
                minOverlap = shape2Min - shape1Min;
                minOverlapNormal = axes[i];
            }
        }
        if (!didCollide) {
            // Goto next triangle
            continue;
        }
        CollisionResult result;
        result.isColliding = true;
        result.collisionDifference = minOverlapNormal * minOverlap;
        // LOG_DEBUG("=== Collision Diff " << minOverlapNormal << " " << minOverlap);
        // LOG_DEBUG("Test on Triangle " << a << " " << b << " " << c << " " << normal);
        return result;
    }
    return CollisionResult{};
}

CollisionResult TwoPhaseCollider::CollidesWith(Collider* mesh) {
    CollisionResult finalResult;
    for (auto& colliderOther: children) {
        CollisionResult r = colliderOther->CollidesWith(mesh);
        if (r.isColliding) {
            finalResult.isColliding = true;
            finalResult.collisionDifference += r.collisionDifference;
        }
    }
    return finalResult;
}

CollisionResult TwoPhaseAndTwoPhaseCollide(TwoPhaseCollider* tp1, TwoPhaseCollider* tp2) {
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
    else if (other->GetType() == 4) {
        // AABB Collider vs Mesh
        return AABBAndMeshCollide(this, static_cast<StaticMeshCollider*>(other));
    }
}

CollisionResult SphereCollider::CollidesWith(Collider* other) {
    if (other->GetType() == 2) {
        return AABBAndSphereCollide(static_cast<AABBCollider*>(other), this);
    }
    else if (other->GetType() == 3) {
        return SphereAndSphereCollide(this, static_cast<SphereCollider*>(other));
    }
    // Mesh?
}

CollisionResult StaticMeshCollider::CollidesWith(Collider* other) {
    // It never moves so this shouldn't be called
    // LOG_DEBUG("Test Static Mesh Collider");
    return CollisionResult{};
}

bool RayIntersectTriangle(RayCastRequest& ray,
    const glm::vec3& a, const glm::vec3& b,
    const glm::vec3& c, const glm::vec3& norm, RayCastResult& result) {

    const glm::vec3& d = ray.direction;
    const glm::vec3& e = ray.startPoint;

    const glm::vec3 ab = a - b;
    const glm::vec3 ac = a - c;

    // Column Major
    glm::mat3x3 A = { ab, ac, d };

    float detA = glm::determinant(A);

    if (detA < 0.00001f) {
        return false;
    }

    const glm::vec3 ae = a - e;
    float t = glm::determinant(glm::mat3x3 { ab, ac, ae }) / detA;
    if (t < 0) return false;

    float gamma = glm::determinant(glm::mat3x3 { ab, ae, d }) / detA;
    if (gamma < 0 || gamma > 1) return false;

    float B = glm::determinant(glm::mat3x3 { ae, ac, d }) / detA;
    if (B < 0 || B + gamma > 1) return false;

    // if (outB) {
    //     *outB = B;
    // }
    // if (outGamma) {
    //     *outGamma = gamma;
    // }

    if (result.isHit && result.zDepth < t) {
        // Already have a result that's closer than ours
        return false;
    }
    result.isHit = true;
    result.hitLocation = e + t * d;
    result.hitNormal = norm;
    result.zDepth = t;

    return true;
}

bool StaticMeshCollider::CollidesWith(RayCastRequest& ray, RayCastResult& result) {
    auto& indices = mesh.indices;
    auto& vertices = mesh.vertices;

    bool bresult = false;

    for (size_t i = 0; i < indices.size(); i += 3) {
        const Vector3& a = vertices[indices[i]].position;
        const Vector3& b = vertices[indices[i+1]].position;
        const Vector3& c = vertices[indices[i+2]].position;

        Vector3 normal = (
            vertices[indices[i]].normal +
            vertices[indices[i+1]].normal +
            vertices[indices[i+2]].normal) / 3.f;
        bresult |= RayIntersectTriangle(ray, c, b, a, normal, result);
    }
    return bresult;
}

CollisionResult TwoPhaseCollider::CollidesWith(TwoPhaseCollider* other) {
    if (children.empty()) return CollisionResult{};
    return TwoPhaseAndTwoPhaseCollide(this, other);
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

// void TwoPhaseCollider::Serialize(JSONWriter& obj) {
//     Replicable::Serialize(obj);
//     obj.Key("c");
//     obj.StartArray();
//     // LOG_DEBUG("Colliders:");
//     for (auto& collider : children) {
//         obj.StartObject();
//         collider->Serialize(obj);
//         obj.EndObject();
//     }
//     obj.EndArray();
// }

// void TwoPhaseCollider::ProcessReplication(json& object) {
//     Replicable::ProcessReplication(object);
//     if (children.size() != object["c"].GetArray().Size()) {
//         // LOG_WARN("Clearing colliders");
//         for (auto& collider : children) {
//             delete collider;
//         }
//         children.clear();
//     }
//     if (children.empty()) {
//         for (json& colliderInfo : object["c"].GetArray()) {
//             // if (colliderInfo["t"].GetInt() == 0) {
//             //     children.push_back(new RectangleCollider(owner, Vector3(), Vector3()));
//             // }
//             // else if (colliderInfo["t"].GetInt() == 1) {
//             //     children.push_back(new CircleCollider(owner, Vector3(), 0));
//             // }
//             // else
//             if (colliderInfo["t"].GetInt() == 2) {
//                 children.push_back(new AABBCollider(owner, Vector3(), Vector3()));
//             }
//             else if (colliderInfo["t"].GetInt() == 3) {
//                 children.push_back(new SphereCollider(owner, Vector3(), 0));
//             }
//             else if (colliderInfo["t"].GetInt() == 4) {
//                 children.push_back(new MeshCollider(owner, nullptr));
//             }
//         }
//     }
//     size_t i = 0;
//     for (json& colliderInfo : object["c"].GetArray()) {
//         children[i]->ProcessReplication(colliderInfo);
//         i += 1;
//         if (i >= children.size()) {
//             break;
//         }
//     }
// }