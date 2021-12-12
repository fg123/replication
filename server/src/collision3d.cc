#include "collision.h"
#include "object.h"
#include "sat.h"
#include "bvh.h"
#include <queue>

size_t AABBAndAABBCollideCount;
size_t OBBAndOBBCollideCount;
size_t SphereAndSphereCollideCount;
size_t AABBAndSphereCollideCount;
size_t OBBAndSphereCollideCount;
size_t SphereAndMeshCollideCount;
size_t OBBAndMeshCollideCount;


void ClearCollisionStatistics() {
    AABBAndAABBCollideCount = 0;
    OBBAndOBBCollideCount = 0;
    SphereAndSphereCollideCount = 0;
    AABBAndSphereCollideCount = 0;
    OBBAndSphereCollideCount = 0;
    SphereAndMeshCollideCount = 0;
    OBBAndMeshCollideCount = 0;
}

void PrintCollisionStatistics() {
    LOG_DEBUG("====================================================");
    LOG_DEBUG("AABBAndAABBCollideCount: " << AABBAndAABBCollideCount);
    LOG_DEBUG("OBBAndOBBCollideCount: " << OBBAndOBBCollideCount);
    LOG_DEBUG("SphereAndSphereCollideCount: " << SphereAndSphereCollideCount);
    LOG_DEBUG("AABBAndSphereCollideCount: " << AABBAndSphereCollideCount);
    LOG_DEBUG("OBBAndSphereCollideCount: " << OBBAndSphereCollideCount);
    LOG_DEBUG("SphereAndMeshCollideCount: " << SphereAndMeshCollideCount);
    LOG_DEBUG("OBBAndMeshCollideCount: " << OBBAndMeshCollideCount);
}

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

bool IsPointInTriangle(const Vector3& point, const Vector3& t1, const Vector3& t2, const Vector3& t3) {
    // Lets define some local variables, we can change these
    // without affecting the references passed in
    Vector3 p = point;
    Vector3 a = t1;
    Vector3 b = t2;
    Vector3 c = t3;

    // Move the triangle so that the point becomes the
    // triangles origin
    a -= p;
    b -= p;
    c -= p;
    // Compute the normal vectors for triangles:
    // u = normal of PBC
    // v = normal of PCA
    // w = normal of PAB

    Vector3 u = glm::cross(b, c);
    Vector3 v = glm::cross(c, a);
    Vector3 w = glm::cross(a, b);

    // Test to see if the normals are facing
    // the same direction, return false if not
    if (glm::dot(u, v) < 0.0f) {
        return false;
    }

    if (glm::dot(u, w) < 0.0f) {
        return false;
    }

    // All normals facing the same way, return true
    return true;
}

/* Adapted from:
** File: PolyRoots.c
** Purpose: Find the roots of polynomials of degree 4 or less.
** Author:  James Painter
** Last Modified: 27 January 1988
**
**  Notes:  Stability of the solution is a major consideration here.
**  See:      ``Solving Quartics and Cubics for Graphics'',
**            Don Herbison-Evans
**            University of Waterloo Research Report
**            CS-86-56,  November, 1986
**
** Copyright (c), 1987 GRAIL, University of Washington
*/
size_t QuadraticRootsSolver(float A, float B, float C, float roots[2]) {
	float D;
	float q;

	if (A == 0) {
		if (B == 0) {
			return 0;
		}
        else {
			roots[0] = -C / B;
			return 1;
		}
	}
    else {
		/*  Compute the discrimanant D=b^2 - 4ac */
		D = B * B - 4 * A * C;
		if (D < 0) {
			return 0;
		} else {
			/* Two real roots */
			q = -(B + glm::sign(B) * glm::sqrt(D)) / 2.0f;
			roots[0] = q / A;
			if (q != 0) {
				roots[1] = C / q;
			}
            else {
				roots[1] = roots[0];
			}
			return 2;
		}
	}
}

bool AABBAndAABBCollide(const AABB& a, const AABB& b) {
    AABBAndAABBCollideCount++;
    bool leftCollide = (a.ptMin.x < b.ptMax.x);
    bool rightCollide = (a.ptMax.x > b.ptMin.x);

    bool topCollide = (a.ptMin.y < b.ptMax.y);
    bool bottomCollide = (a.ptMax.y > b.ptMin.y);

    bool frontCollide = (a.ptMin.z < b.ptMax.z);
    bool backCollide = (a.ptMax.z > b.ptMin.z);

    return (leftCollide && rightCollide) && (topCollide && bottomCollide) && (frontCollide && backCollide);
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

AABB OBBCollider::GetBroadAABB() {
    Vector3 arr[8];
    GenerateAABBRotatedCorners(GetWorldTransform(), size, arr);
    return AABB {arr, 8};
}

CollisionResult OBBAndOBBCollide(OBBCollider* rect1, OBBCollider* rect2) {
    OBBAndOBBCollideCount++;
    Quaternion r1Rotation = rect1->GetRotation();
    Quaternion r2Rotation = rect2->GetRotation();
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

CollisionResult SphereAndSphereCollide(const Vector3& sphere1Pos, float sphere1Rad,
    const Vector3& sphere2Pos, float sphere2Rad) {

    SphereAndSphereCollideCount++;
    float distance = glm::distance(sphere1Pos, sphere2Pos);
    float radii = (sphere1Rad + sphere2Rad);
    CollisionResult r;
    r.isColliding = distance < radii;
    if (r.isColliding) {
        Vector3 difference = IsZero(distance) ? Vector::Forward : glm::normalize(sphere2Pos - sphere1Pos);
        r.collisionDifference = -difference * (radii - distance);
    }
    return r;
}
CollisionResult SphereAndSphereCollide(SphereCollider* sphere1, SphereCollider* sphere2) {
    return SphereAndSphereCollide(sphere1->GetPosition(), sphere1->radius, sphere2->GetPosition(), sphere2->radius);
}

Vector3 AABBSurfaceNormal(AABB& rect, Vector3 point) {
    Vector3 hitVec = point - ((rect.ptMin + rect.ptMax) / 2.0f);
    Vector3 d = glm::abs(rect.ptMin - rect.ptMax) / 2.0f;
    Vector3 norm = (hitVec / d) * 1.00001f;
    return glm::normalize(Vector3((int)norm.x, (int)norm.y, (int)norm.z));
}

Vector3 ClosestPointOnAABB(const AABB& aabb, const Vector3& vec) {
    Vector3 rectSize = aabb.ptMax - aabb.ptMin;
    Vector3 rectPosition = aabb.ptMin;
    if (IsPointInAABB(rectPosition, rectSize, vec)) {
        return vec;
    }
    Vector3 rectHalf = rectSize / 2.0f;
    Vector3 rectCenter = rectPosition + rectHalf;

    // get difference vector between both centers
    Vector3 difference = vec - rectCenter;

    Vector3 clamped = glm::clamp(difference, -rectHalf, rectHalf);
    // add clamped value to AABB_center and we get the value of box closest to circle
    return rectCenter + clamped;
}

CollisionResult AABBAndSphereCollide(Vector3 rectPosition, Vector3 rectSize,
    Vector3 circPosition, float radius) {

    AABBAndSphereCollideCount++;

    // LOG_DEBUG("AABB AND SPHERE COLLIDE");
    // Find a position from
    Vector3 rectHalf = rectSize / 2.0f;
    Vector3 rectCenter = rectPosition + rectHalf;

    // get difference vector between both centers
    Vector3 difference = circPosition - rectCenter;

    Vector3 clamped = glm::clamp(difference, -rectHalf, rectHalf);
    // add clamped value to AABB_center and we get the value of box closest to circle
    Vector3 closest = rectCenter + clamped;
    Vector3 offset = circPosition - closest;
    // LOG_DEBUG("Closest " << closest);
    // LOG_DEBUG("Offset " << offset);
    if (!IsPointInAABB(rectPosition, rectSize, circPosition)) {
        CollisionResult r;
        r.isColliding = glm::length(offset) < radius;
        if (r.isColliding) {
            r.collisionDifference = (radius - glm::length(offset)) *
                glm::normalize(offset);
            // LOG_DEBUG("Difference " << r.collisionDifference);
        }
        return r;
    }
    // Inside the rectangle
    // LOG_DEBUG("Point inside");
    CollisionResult r;
    r.isColliding = true;

    // Find the shortest way out, clamp to each plane
    Vector3 points[] = {
        Vector3(rectHalf.x + radius, difference.y, difference.z),
        Vector3(-rectHalf.x - radius, difference.y, difference.z),
        Vector3(difference.x, rectHalf.y + radius, difference.z),
        Vector3(difference.x, -rectHalf.y - radius, difference.z),
        Vector3(difference.x, difference.y, rectHalf.z + radius),
        Vector3(difference.x, difference.y, -rectHalf.z - radius)
    };

    int min = 0;
    for (int i = 1; i < 6; i++) {
        if (glm::distance(difference, points[i]) < glm::distance(difference, points[min])) {
            min = i;
        }
    }

    Vector3 desiredSphereLocation = rectCenter + points[min];
    // LOG_DEBUG("Desired Location " << desiredSphereLocation);
    r.collisionDifference = desiredSphereLocation - circPosition;
    return r;
}

CollisionResult OBBAndSphereCollide(OBBCollider* rect, SphereCollider* circle) {
    OBBAndSphereCollideCount++;
    Matrix4 transform = rect->GetWorldTransform();

    Matrix4 inverse = glm::inverse(transform);

    // LOG_DEBUG("Rectangle: " << rect->GetPosition() << " " << rect->size);
    // Vector3 points[8];
    // GenerateAABBRotatedCorners(transform, rect->size, points);
    // LOG_DEBUG("Points:");
    // for (size_t i = 0; i < 8; i++) {
    //     LOG_DEBUG(" - " << points[i]);
    // }
    // LOG_DEBUG("Post Inverse Transform: ");
    // for (size_t i = 0; i < 8; i++) {
    //     // Vector4 result = inverse * Vector4(points[i], 1);
    //     LOG_DEBUG(" - " << Vector3(inverse * Vector4(points[i], 1)));
    // }

    // LOG_DEBUG("Transform " << transform);
    // LOG_DEBUG("Inverse " << inverse);

    // Bring Circle into Local Space
    Vector3 circPosition = Vector3(inverse * Vector4(circle->GetPosition(), 1));
    CollisionResult r = AABBAndSphereCollide(Vector3(0, 0, 0), rect->size, circPosition, circle->radius);
    if (r.isColliding) {
        r.collisionDifference = Vector3(transform * Vector4(r.collisionDifference, 0));
    }
    return r;
}

inline Vector3 ClosestPointOnPlane(const Vector3& planeNorm, float planeDist, const Vector3& point) {
    float distance = glm::dot(planeNorm, point) - planeDist;
    return point - distance * planeNorm;
}

inline Vector3 ClosestPointOnLineSegment(const Vector3& a, const Vector3& b, const Vector3& point) {
    float t = glm::dot(point - a, b - a) / glm::dot(b - a, b - a);
    t = glm::clamp(t, 0.f, 1.f);
    return a + t * (b - a);
}

inline Vector3 ClosestPointOnTriangle(BVHTriangle* t, const Vector3& point, Vector3& planePoint) {
    // Construct a plane from triangle
    Vector3 norm = glm::normalize(t->norm);
    float distance = glm::dot(norm, t->a);
    planePoint = ClosestPointOnPlane(norm, distance, point);
    if (IsPointInTriangle(planePoint, t->a, t->b, t->c)) {
        return planePoint;
    }

    // Closest Point on Each Edge
    Vector3 c1 = ClosestPointOnLineSegment(t->a, t->b, point);
    Vector3 c2 = ClosestPointOnLineSegment(t->b, t->c, point);
    Vector3 c3 = ClosestPointOnLineSegment(t->c, t->a, point);

    float mag1 = glm::distance(point, c1);
    float mag2 = glm::distance(point, c2);
    float mag3 = glm::distance(point, c3);

    if (mag1 < mag2 && mag1 < mag3) return c1;
    if (mag2 < mag1 && mag2 < mag3) return c2;
    return c3;
}

CollisionResult SphereAndMeshCollide(SphereCollider* sphere, StaticMeshCollider* collider) {
    SphereAndMeshCollideCount++;
    if (!collider->bvhTree) {
        return CollisionResult{};
    }
    Vector3 spherePosition = sphere->GetPosition();

    AABB broadRect = sphere->GetBroadAABB();
    // BVH Find Triangles to Test
    std::queue<BVHTree<BVHTriangle>*> checkQueue;
    checkQueue.emplace(collider->bvhTree);

    float minOverlap = INFINITY;
    // Vector3 reverseVelocity = -collider->owner->GetVelocity();

    CollisionResult result;

    while (!checkQueue.empty()) {
        BVHTree<BVHTriangle>* currNode = checkQueue.front();
        checkQueue.pop();
        if (currNode->tris.empty()) {
            // Internal Node
            if (AABBAndAABBCollide(broadRect, currNode->collider)) {
                for (const auto& p : currNode->children) {
                    checkQueue.push(p);
                }
            }
        }
        else {
            for (const auto& tri : currNode->tris) {
                Vector3 planePoint;
                Vector3 point = ClosestPointOnTriangle(tri, spherePosition, planePoint);
                float dist = glm::distance(point, sphere->GetPosition());
                if (dist < sphere->radius) {
                    // To move it out we move it from planePoint since that will allow
                    //   us to move it away from the triangle
                    float penetration = sphere->radius - glm::distance(planePoint, spherePosition);
                    if (!IsZero(penetration) && penetration < minOverlap) {
                        result.isColliding = true;
                        minOverlap = penetration;
                        result.collisionDifference = tri->norm * penetration;
                    }
                }
            }
        }
    }
    return result;
}

// Returns 0 if parallel, 1 if 1 intersection or 2 if fully inside
int CheckLineAndPlaneIntersection(
    BVHTriangle* t,
    const Vector3& lpt1, const Vector3& lpt2,
    Vector3& outputIntersection) {

    Vector3 norm = glm::normalize(t->norm);
    const Vector3 lineDir = lpt2 - lpt1;

    float top = glm::dot(t->a - lpt1, norm);
    float bottom = glm::dot(lineDir, norm);
    if (IsZero(bottom)) {
        // Line and Plane are Parallel
        if (IsZero(top)) {
            outputIntersection = t->center;
            return 2;
        }
        outputIntersection = t->center;
        return 0;
    }
    float d = top / bottom;
    outputIntersection = lpt1 + lineDir * d;
    return 1;
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

bool DoesLineSegmentPenetrateTriangle(BVHTriangle* tri, const Vector3& pt1,
    const Vector3& pt2, Vector3& penetratePoint) {
    RayCastRequest request;
    request.startPoint = pt1;
    request.direction = glm::normalize(pt2 - pt1);
    RayCastResult result;
    bool rayCastResult = RayIntersectTriangle(request, tri->a, tri->b, tri->c, tri->norm, result);
    penetratePoint = result.hitLocation;
    return rayCastResult && result.zDepth < glm::distance(pt1, pt2);
}

CollisionResult CapsuleAndMeshCollide(CapsuleCollider* capsule, StaticMeshCollider* collider) {
    if (!collider->bvhTree) {
        return CollisionResult{};
    }
    // Vector3 velocity = capsule->GetOwner()->GetVelocity();
    AABB broadRect = capsule->GetBroadAABB();

    // Get World Position of Two Points of the Capsule Segment
    Vector3 pt1 = capsule->GetWorldPoint1();
    Vector3 pt2 = capsule->GetWorldPoint2();
    // LOG_DEBUG(capsule->GetOwner()->GetPosition() << " " << pt1 << " " << pt2);

    std::queue<BVHTree<BVHTriangle>*> checkQueue;
    checkQueue.emplace(collider->bvhTree);

    float minOverlap = INFINITY;
    // Vector3 reverseVelocity = -collider->owner->GetVelocity();

    CollisionResult result;

    while (!checkQueue.empty()) {
        BVHTree<BVHTriangle>* currNode = checkQueue.front();
        checkQueue.pop();
        if (currNode->tris.empty()) {
            // Internal Node
            if (AABBAndAABBCollide(broadRect, currNode->collider)) {
                for (const auto& p : currNode->children) {
                    checkQueue.push(p);
                }
            }
        }
        else {
            // Test Triangles
            for (const auto& tri : currNode->tris) {
                // The basic principle here is that if the capsule line segment
                //   does not penetrate the triangle, the max movement to resolve
                //   is radius amount.

                // If it penetrates then we gotta do more stuff
                // Vector3 penetratePoint;
                // if (DoesLineSegmentPenetrateTriangle(tri, pt1, pt2, penetratePoint)) {
                //     // Find two vectors to the penetration point
                //     // these two vectors go in opposite directions
                //     result.isColliding = true;
                //     Vector3 pv1 = penetratePoint - pt1;
                //     Vector3 pv2 = penetratePoint - pt2;
                //     LOG_DEBUG("============FULL PENETRATION ");
                //     LOG_DEBUG("Points " << pt1 << " " << pt2);
                //     LOG_DEBUG("Penetration point " << penetratePoint);
                //     LOG_DEBUG("Triangle " << tri->a << " " << tri->b << " " << tri->c);
                //     // LOG_DEBUG("Penetration " << penetration << tri->norm);
                //     // LOG_DEBUG("Triangle
                //     float length;
                //     if (glm::dot(pv1, tri->norm) > 0) {
                //         // Same direction, shift pt1 to penetrate point
                //         length = glm::dot(pv1, tri->norm) / glm::length(tri->norm);
                //     }
                //     else {
                //         length = glm::dot(pv2, tri->norm) / glm::length(tri->norm);
                //     }

                //     if (length < minOverlap) {
                //         minOverlap = length;
                //         result.collisionDifference = tri->norm * length;
                //     }
                // }
                // else {
                    // Regular Test
                    Vector3 outIntersection;
                    // int lineTriResult =
                    CheckLineAndPlaneIntersection(tri, pt1, pt2, outIntersection);

                    // if (lineTriResult == 1) {
                        // LOG_DEBUG("Triangle " << tri->a << " " << tri->b << " " << tri->c);

                        // Handle just this one for now
                        Vector3 planePoint;

                        // Clamp plane intersection onto triangle
                        Vector3 point = ClosestPointOnTriangle(tri, outIntersection, planePoint);
                        // LOG_DEBUG("Closest Point on Triangle " << point);
                        // Project back onto line segment
                        Vector3 reference = ClosestPointOnLineSegment(pt1, pt2, point);
                        point = ClosestPointOnTriangle(tri, reference, planePoint);

                        float dist = glm::distance(point, reference);
                        // LOG_DEBUG("Dist " << dist);
                        if (!IsZero(dist - capsule->radius) && dist < capsule->radius) {
                            float penetration = capsule->radius - glm::distance(planePoint, reference);
                            float sign = glm::sign(glm::dot(reference - planePoint, tri->norm));
                            // LOG_DEBUG("========Regular Test");
                            // LOG_DEBUG("Plane Point " << planePoint);
                            // LOG_DEBUG("Points " << pt1 << " " << pt2);
                            // LOG_DEBUG("Reference " << reference);
                            // LOG_DEBUG("Penetration " << penetration << tri->norm);
                            // LOG_DEBUG("Triangle " << tri->a << " " << tri->b << " " << tri->c);

                            if (penetration < minOverlap) {
                                result.isColliding = true;
                                minOverlap = penetration;
                                result.collisionDifference = sign * tri->norm * penetration;
                            }
                        }
                // }
                // }
            }
        }
    }
    // if (result.isColliding) {
    //     LOG_DEBUG("========");
    // }
    return result;
}

CollisionResult OBBAndMeshCollide(OBBCollider* rect, StaticMeshCollider* collider) {
    OBBAndMeshCollideCount++;
    // #ifdef BUILD_SERVER
    //     LOG_DEBUG("Start AABB & Mesh Collide " << collider->mesh.name);
    // #endif
    if (!collider->bvhTree) {
        return CollisionResult{};
    }
    // Use BVH Tree to tell us which triangles to test

    AABB broadRect = rect->GetBroadAABB();
    Quaternion r1Rotation = rect->GetRotation();
    // LOG_DEBUG("AABB Mesh Collide");

    Vector3 r1Corners[8];
    GenerateAABBRotatedCorners(rect->GetWorldTransform(), rect->size, r1Corners);

    Vector3 rax1 = r1Rotation * Vector::Up;
    Vector3 rax2 = r1Rotation * Vector::Left;
    Vector3 rax3 = r1Rotation * Vector::Forward;

    std::queue<BVHTree<BVHTriangle>*> checkQueue;
    checkQueue.emplace(collider->bvhTree);

    float minOverlap = INFINITY;
    Vector3 minOverlapNormal;
    // Vector3 reverseVelocity = -collider->owner->GetVelocity();

    CollisionResult result;

    while (!checkQueue.empty()) {
        BVHTree<BVHTriangle>* currNode = checkQueue.front();
        checkQueue.pop();
        if (currNode->tris.empty()) {
            // Internal Node
            if (AABBAndAABBCollide(broadRect, currNode->collider)) {
                for (const auto& p : currNode->children) {
                    checkQueue.push(p);
                }
            }
        }
        else {
            // Test Triangles
            for (const auto& tri : currNode->tris) {
                // #ifdef BUILD_SERVER
                //         LOG_DEBUG("Test on Triangle " << tri.a << " " << tri.b <<
                //         " " << tri.c << " " << tri.norm);
                // #endif
                // Apply SAT
                // 3 normals for each box
                Vector3 e1 = tri->b - tri->a;
                Vector3 e2 = tri->c - tri->b;
                Vector3 e3 = tri->a - tri->c;

                Vector3 axes[] = {
                    rax1, rax2, rax3,
                    glm::cross(rax1, e1), glm::cross(rax1, e2), glm::cross(rax1, e3),
                    glm::cross(rax2, e1), glm::cross(rax2, e2), glm::cross(rax2, e3),
                    glm::cross(rax3, e1), glm::cross(rax3, e2), glm::cross(rax3, e3),
                    tri->norm
                };

                Vector3 r2Corners[] = { tri->a, tri->b, tri->c };

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
                        break;
                    }
                    // #ifdef BUILD_SERVER
                    // LOG_DEBUG(shape1Min << " " << shape1Max << " " << shape2Min << " " << shape2Max);
                    // LOG_DEBUG("Axes " << axes[i] << " overlap " << overlap);
                    // #endif

                    if (i == 12) {
                        float overlapToUse = shape2Min - shape1Min;
                        if (!IsZero(overlapToUse) &&
                            glm::abs(overlapToUse) < glm::abs(minOverlap)) {
                            minOverlap = overlapToUse;
                            minOverlapNormal = axes[i];
                            result.collisionDifference = minOverlapNormal * minOverlap;
                            result.isColliding = true;
                        }
                    }
                }

                // LOG_DEBUG("Test on Triangle " << a << " " << b << " " << c << " " << normal);
            }
        }
    }
    // if (didCollide) {
    //     CollisionResult result;
    //     result.isColliding = true;
    //     result.collisionDifference = minOverlapNormal * minOverlap;
    //     // LOG_DEBUG("=== Collision Diff " << minOverlapNormal << " " << minOverlap);
    //     return result;
    // }
    // if (result.isColliding) {
    //     LOG_DEBUG("=== Collision Diff " << minOverlapNormal << " " << minOverlap);
    // }
    // if (result.isColliding) {
    //     float factor1 = result.collisionDifference.x / reverseVelocity.x;

    //     if (IsZero(reverseVelocity.x)) reverseVelocity.x = 1;
    //     if (IsZero(reverseVelocity.y)) reverseVelocity.y = 1;
    //     if (IsZero(reverseVelocity.z)) reverseVelocity.z = 1;

    //     Vector3 factor = glm::max(Vector3(0, 0, 0), result.collisionDifference / reverseVelocity);
    //     float f = glm::max(factor.x, factor.y, factor.z);
    //     result.collisionDifference = f * reverseVelocity;

    // }
    // if (result.isColliding) {
    //     if (!IsZero(reverseVelocity.x) && !SameSign(reverseVelocity.x, result.collisionDifference.x)) {
    //         result.collisionDifference.x = 0;
    //     }
    //     if (!IsZero(reverseVelocity.y) && !SameSign(reverseVelocity.y, result.collisionDifference.y)) {
    //         result.collisionDifference.y = 0;
    //     }
    //     if (!IsZero(reverseVelocity.z) && !SameSign(reverseVelocity.z, result.collisionDifference.z)) {
    //         result.collisionDifference.z = 0;
    //     }
    // }
    return result;
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

CollisionResult CapsuleAndSphereCollide(CapsuleCollider* capsule, SphereCollider* sphere) {
    Vector3 capsulePt1 = capsule->GetWorldPoint1();
    Vector3 capsulePt2 = capsule->GetWorldPoint2();
    Vector3 point = ClosestPointOnLineSegment(capsulePt1, capsulePt2, sphere->GetPosition());
    Vector3 diff = sphere->GetPosition() - point;
    float penetration = sphere->radius + capsule->radius - glm::length(diff);
    CollisionResult result;
    if (penetration > 0) {
        result.isColliding = true;
        result.collisionDifference = -penetration * glm::normalize(diff);
    }
    return result;
}

CollisionResult StaticMeshCollider::CollidesWith(Collider* other) {
    // It never moves so this shouldn't be called
    // LOG_DEBUG("Test Static Mesh Collider");
    return CollisionResult{};
}

bool StaticMeshCollider::CollidesWith(RayCastRequest& ray, RayCastResult& result) {
    bool bresult = false;

    std::queue<BVHTree<BVHTriangle>*> checkQueue;
    checkQueue.emplace(bvhTree);

    while (!checkQueue.empty()) {
        BVHTree<BVHTriangle>* currNode = checkQueue.front();
        checkQueue.pop();
        if (currNode->tris.empty()) {
            // Internal Node
            RayCastResult fake;
            if (currNode->collider.CollidesWith(ray, fake)) {
                for (const auto& p : currNode->children) {
                    checkQueue.push(p);
                }
            }
        }
        else {
            for (size_t i = 0; i < currNode->tris.size(); i++) {
                bresult |= RayIntersectTriangle(ray, currNode->tris[i]->c,
                    currNode->tris[i]->b, currNode->tris[i]->a, currNode->tris[i]->norm, result);
            }
        }
    }

    return bresult;
}

CollisionResult TwoPhaseCollider::CollidesWith(TwoPhaseCollider* other) {
    if (children.empty()) return CollisionResult{};
    return TwoPhaseAndTwoPhaseCollide(this, other);
}

bool AABB::CollidesWith(RayCastRequest& ray, RayCastResult& result) {
    Vector3 invDirection = 1.0f / ray.direction;

    // r.org is origin of ray
    float t1 = (ptMin.x - ray.startPoint.x) * invDirection.x;
    float t2 = (ptMax.x - ray.startPoint.x) * invDirection.x;
    float t3 = (ptMin.y - ray.startPoint.y) * invDirection.y;
    float t4 = (ptMax.y - ray.startPoint.y) * invDirection.y;
    float t5 = (ptMin.z - ray.startPoint.z) * invDirection.z;
    float t6 = (ptMax.z - ray.startPoint.z) * invDirection.z;

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

    result.hitNormal = AABBSurfaceNormal(*this, result.hitLocation);
    // LOG_DEBUG("Hit Normal " << result.hitNormal);
    return true;
}

bool SphereAndRayCollide(const Vector3& sphereCenter, float radius, RayCastRequest& ray, RayCastResult& result) {
    const Vector3& d = ray.direction;
    const Vector3& e = ray.startPoint;
    const Vector3& c = sphereCenter;
    const Vector3 eminusc = e - c;
    float roots[2];
    int answers = QuadraticRootsSolver(glm::dot(d, d), 2 * glm::dot(d, eminusc), glm::dot(eminusc, eminusc) - (radius * radius), roots);

    // Only keep positive answers
    if (answers == 2 && roots[0] < 0.f) {
        answers -= 1;
        roots[0] = roots[1];
    }

    if (answers == 1 && roots[0] < 0.f) {
        answers = 0;
    }

    if (answers == 0) {
        return false;
    }

    if (answers == 2) {
        // Choose smallest one
        answers = 1;
        roots[0] = glm::min(roots[0], roots[1]);
    }

    if (answers == 1 && roots[0] >= 0.f) {
        // One Root
        if (result.isHit && result.zDepth < roots[0]) return false;
        result.isHit = true;
        result.zDepth = roots[0];
        result.hitLocation = e + roots[0] * d;
        result.hitNormal = glm::normalize(result.hitLocation - c);
        return true;
    }
    return false;
}


Vector3 ProjectPointToPlane(const Vector3& point, const Vector3& planePoint, const Vector3& planeNorm) {
    float t = (glm::dot(planeNorm, planePoint) - glm::dot(planeNorm, point)) / glm::length2(planeNorm);
    return point + t * planeNorm;
}

CollisionResult CapsuleAndCapsuleCollide(CapsuleCollider* capsule, CapsuleCollider* capsule2) {
    Vector3 capsulePt1 = capsule->GetWorldPoint1();
    Vector3 capsulePt2 = capsule->GetWorldPoint2();

    Vector3 capsulePtC = capsule2->GetWorldPoint1();
    Vector3 capsulePtD = capsule2->GetWorldPoint2();

    // Do plane projectino first
    Vector3 inPlaneA = ProjectPointToPlane(capsulePt1, capsulePtC, glm::normalize(capsulePtD - capsulePtC));
    Vector3 inPlaneB = ProjectPointToPlane(capsulePt2, capsulePtC, glm::normalize(capsulePtD - capsulePtC));
    Vector3 inPlaneBA = inPlaneB - inPlaneA;

    float t = glm::dot(capsulePtC - inPlaneA, inPlaneBA) / glm::dot(inPlaneBA, inPlaneBA);
    t = (inPlaneA != inPlaneB) ? t : 0.f; // Zero's t if parallel

    // Closest point on capsule1
    Vector3 segABtoLineCD = glm::lerp(capsulePt1, capsulePt2, glm::clamp(t, 0.f, 1.f));

    // Closest point on capsule 2
    Vector3 point = ClosestPointOnLineSegment(capsulePtC, capsulePtD, segABtoLineCD);
    // LOG_DEBUG(segABtoLineCD << " " << point);
    return SphereAndSphereCollide(segABtoLineCD, capsule->radius, point, capsule2->radius);
}


CollisionResult CapsuleAndOBBCollide(CapsuleCollider* capsule, OBBCollider* obb) {
    // LOG_DEBUG("Capsule and OBB Collide");
    Matrix4 transform = obb->GetWorldTransform();
    Matrix4 inverse = glm::inverse(transform);

    // Capsule Points into OBB space
    Vector3 capsulePt1 = Vector3(inverse * Vector4(capsule->GetWorldPoint1(), 1));
    Vector3 capsulePt2 = Vector3(inverse * Vector4(capsule->GetWorldPoint2(), 1));

    Vector3 size = obb->size;

    Vector3 cap1[] = {
        glm::clamp(ClosestPointOnPlane(Vector3(0, 0, 1), size.z, capsulePt1), Vector3(0, 0, 0), size),
        glm::clamp(ClosestPointOnPlane(Vector3(0, 1, 0), size.y, capsulePt1), Vector3(0, 0, 0), size),
        glm::clamp(ClosestPointOnPlane(Vector3(1, 0, 0), size.x, capsulePt1), Vector3(0, 0, 0), size),
        glm::clamp(ClosestPointOnPlane(Vector3(0, 0, -1), 0, capsulePt1), Vector3(0, 0, 0), size),
        glm::clamp(ClosestPointOnPlane(Vector3(0, -1, 0), 0, capsulePt1), Vector3(0, 0, 0), size),
        glm::clamp(ClosestPointOnPlane(Vector3(-1, 0, 0), 0, capsulePt1), Vector3(0, 0, 0), size),
    };
    Vector3 cap2[] = {
        glm::clamp(ClosestPointOnPlane(Vector3(0, 0, 1), size.z, capsulePt2), Vector3(0, 0, 0), size),
        glm::clamp(ClosestPointOnPlane(Vector3(0, 1, 0), size.y, capsulePt2), Vector3(0, 0, 0), size),
        glm::clamp(ClosestPointOnPlane(Vector3(1, 0, 0), size.x, capsulePt2), Vector3(0, 0, 0), size),
        glm::clamp(ClosestPointOnPlane(Vector3(0, 0, -1), 0, capsulePt2), Vector3(0, 0, 0), size),
        glm::clamp(ClosestPointOnPlane(Vector3(0, -1, 0), 0, capsulePt2), Vector3(0, 0, 0), size),
        glm::clamp(ClosestPointOnPlane(Vector3(-1, 0, 0), 0, capsulePt2), Vector3(0, 0, 0), size),
    };


    float distance = INFINITY;
    Vector3 planePoint;
    for (size_t i = 0; i < 6; i++) {
        float d = glm::distance(cap1[i], capsulePt1);
        if (d < distance) {
            distance = d;
            planePoint = cap1[i];
        }
    }
    for (size_t i = 0; i < 6; i++) {
        float d = glm::distance(cap2[i], capsulePt2);
        if (d < distance) {
            distance = d;
            planePoint = cap2[i];
        }
    }

    CollisionResult result;
    if (distance < capsule->radius) {
        result.isColliding = true;
        AABB rect {Vector3(0, 0, 0), size};
        result.collisionDifference = (capsule->radius - distance) * AABBSurfaceNormal(rect, planePoint);

        // Translate back to world space
        result.collisionDifference = Vector3(transform * Vector4(result.collisionDifference, 0));
    }
    return result;
}

inline Vector3 TransformPoint(const Vector3& point, const Matrix4& transform) {
    return Vector3(transform * Vector4(point, 1));
}

inline Vector3 TransformNormal(const Vector3& normal, const Matrix4& transform) {
    return Vector3(transform * Vector4(normal, 0));
}

StaticMeshCollider::StaticMeshCollider(Object* owner, const std::vector<Vertex*>& vertices,
    const Matrix4& transform) :
    Collider(owner, Vector3{}, Quaternion{}) {

    Matrix4 normalMatrix = glm::transpose(glm::inverse(transform));

    if (!vertices.empty()) {
        Vector3 min = TransformPoint(vertices[0]->position, transform);
        Vector3 max = TransformPoint(vertices[0]->position, transform);
        for (size_t i = 1; i < vertices.size(); i++) {
            min = glm::min(min, TransformPoint(vertices[i]->position, transform));
            max = glm::max(max, TransformPoint(vertices[i]->position, transform));
        }
        glm::vec3 bounds = max - min;
        broad = AABB(min, max);

        int axis = 0;
        if (bounds.y > bounds.x && bounds.y > bounds.z) axis = 1;
        if (bounds.z > bounds.x && bounds.z > bounds.y) axis = 2;

        std::vector<BVHTriangle*> triangles;

        for (size_t i = 0; i < vertices.size(); i += 3) {
            const Vector3& a = TransformPoint(vertices[i]->position, transform);
            const Vector3& b = TransformPoint(vertices[i+1]->position, transform);
            const Vector3& c = TransformPoint(vertices[i+2]->position, transform);

            Vector3 normal = (
                TransformNormal(vertices[i]->normal, normalMatrix) +
                TransformNormal(vertices[i+1]->normal, normalMatrix) +
                TransformNormal(vertices[i+2]->normal, normalMatrix)) / 3.f;
            triangles.push_back(new BVHTriangle(a, b, c, normal));
        }
        bvhTree = BVHTree<BVHTriangle>::Create(triangles, axis, 0);
        // for (auto& tri : triangles) {
        //     BVHTriangle* triangle = dynamic_cast<BVHTriangle*>(tri);
        //     // if (!triangle->parentVolume) {
        //     //     LOG_ERROR("Triangle " << triangle->a << " " << triangle->b <<
        //     //         " " << triangle->c << " was not placed in a BVH volume!");
        //     // }
        //     // else {
        //     //     AABB& col = triangle->parentVolume->collider;
        //     //     if (!IsPointInAABB(col.position, col.size, triangle->a)) {
        //     //         LOG_ERROR("A not in bound " << triangle->a);
        //     //         LOG_ERROR(col.position << " " << col.size);
        //     //     }
        //     //     if (!IsPointInAABB(col.position, col.size, triangle->b)) {
        //     //         LOG_ERROR("B not in bound " << triangle->b);
        //     //         LOG_ERROR(col.position << " " << col.size);
        //     //     }
        //     //     if (!IsPointInAABB(col.position, col.size, triangle->c)) {
        //     //         LOG_ERROR("C not in bound " << triangle->c);
        //     //         LOG_ERROR(col.position << " " << col.size);
        //     //     }
        //     // }
        // }
    }
}

StaticMeshCollider::~StaticMeshCollider() {
    delete bvhTree;
}


CollisionResult TwoPhaseCollider::CollidesWith(Collider* mesh) {
    CollisionResult finalResult;
    for (auto& colliderOther: children) {
        // AABB Early Exit Here
        if (!AABBAndAABBCollide(colliderOther->GetBroadAABB(), mesh->GetBroadAABB())) {
            continue;
        }
        CollisionResult r = colliderOther->CollidesWith(mesh);
        if (r.isColliding) {
            finalResult.isColliding = true;
            finalResult.collisionDifference += r.collisionDifference;
        }
    }
    return finalResult;
}


CollisionResult OBBCollider::CollidesWith(Collider* other) {
    if (other->GetType() == ColliderType::SPHERE) {
        CollisionResult r = OBBAndSphereCollide(this, static_cast<SphereCollider*>(other));
        r.collisionDifference *= -1;
        return r;
    }
    else if (other->GetType() == ColliderType::OBB) {
        return OBBAndOBBCollide(this, static_cast<OBBCollider*>(other));
    }
    else if (other->GetType() == ColliderType::STATIC_MESH) {
        // AABB Collider vs Mesh
        return OBBAndMeshCollide(this, static_cast<StaticMeshCollider*>(other));
    }
    else if (other->GetType() == ColliderType::CAPSULE) {
        CollisionResult r = CapsuleAndOBBCollide(static_cast<CapsuleCollider*>(other), this);
        r.collisionDifference *= -1;
        return r;
    }
    return CollisionResult{};
}


CollisionResult SphereCollider::CollidesWith(Collider* other) {
    if (other->GetType() == ColliderType::OBB) {
        return OBBAndSphereCollide(static_cast<OBBCollider*>(other), this);
    }
    else if (other->GetType() == ColliderType::SPHERE) {
        return SphereAndSphereCollide(this, static_cast<SphereCollider*>(other));
    }
    else if (other->GetType() == ColliderType::STATIC_MESH) {
        return SphereAndMeshCollide(this, static_cast<StaticMeshCollider*>(other));
    }
    else if (other->GetType() == ColliderType::CAPSULE) {
        CollisionResult r = CapsuleAndSphereCollide(static_cast<CapsuleCollider*>(other), this);
        r.collisionDifference *= -1;
        return r;
    }
    return CollisionResult{};
}


bool OBBCollider::CollidesWith(RayCastRequest& ray, RayCastResult& result) {
    Matrix4 transform = GetWorldTransform();
    Matrix4 inverse = glm::inverse(transform);

    // Bring Ray into Local Space
    RayCastRequest newRay {ray};
    newRay.startPoint = Vector3(inverse * Vector4(ray.startPoint, 1));
    newRay.direction = Vector3(inverse * Vector4(ray.direction, 0));
    RayCastResult newResult;
    if (AABB(Vector3(0, 0, 0), size).CollidesWith(newRay, newResult)) {
        newResult.isHit = true;
        newResult.hitLocation = Vector3(transform * Vector4(newResult.hitLocation, 1));
        newResult.hitNormal = Vector3(glm::transpose(inverse) * Vector4(newResult.hitNormal, 0));
        newResult.zDepth = glm::distance(newResult.hitLocation, ray.startPoint);
        if (!result.isHit || newResult.zDepth < result.zDepth) {
            result = newResult;
            return true;
        }
    }
    return false;
}

bool SphereCollider::CollidesWith(RayCastRequest& ray, RayCastResult& result) {
    return SphereAndRayCollide(GetPosition(), radius, ray, result);
}

bool CapsuleCollider::CollidesWith(RayCastRequest& ray, RayCastResult& result) {
    Vector3 capsulePt1 = GetWorldPoint1();
    Vector3 capsulePt2 = GetWorldPoint2();

    Vector3 inPlaneA = ProjectPointToPlane(capsulePt1, ray.startPoint, glm::normalize(ray.direction));
    Vector3 inPlaneB = ProjectPointToPlane(capsulePt2, ray.startPoint, glm::normalize(ray.direction));
    Vector3 inPlaneBA = inPlaneB - inPlaneA;

    float t = glm::dot(ray.startPoint - inPlaneA, inPlaneBA) / glm::dot(inPlaneBA, inPlaneBA);
    t = (inPlaneA != inPlaneB) ? t : 0.f; // Zero's t if parallel

    Vector3 segABtoLineCD = glm::lerp(capsulePt1, capsulePt2, glm::clamp(t, 0.f, 1.f));
    // LOG_DEBUG(capsulePt1 << " " << capsulePt2 << " " << segABtoLineCD);
    return SphereAndRayCollide(segABtoLineCD, radius, ray, result);
}

CollisionResult CapsuleCollider::CollidesWith(Collider* other) {
    if (other->GetType() == ColliderType::OBB) {
        return CapsuleAndOBBCollide(this, static_cast<OBBCollider*>(other));
    }
    else if (other->GetType() == ColliderType::SPHERE) {
        return CapsuleAndSphereCollide(this, static_cast<SphereCollider*>(other));
    }
    else if (other->GetType() == ColliderType::STATIC_MESH) {
        return CapsuleAndMeshCollide(this, static_cast<StaticMeshCollider*>(other));
    }
    else if (other->GetType() == ColliderType::CAPSULE) {
        return CapsuleAndCapsuleCollide(this, static_cast<CapsuleCollider*>(other));
    }
    return CollisionResult{};
}