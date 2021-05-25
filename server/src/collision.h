#pragma once

#include "vector.h"
#include "replicable.h"
#include "json/json.hpp"
#include "ray-cast.h"
#include "mesh.h"

class Object;
struct BVHTree;

struct CollisionResult {
    bool isColliding = false;
    Vector3 collisionDifference;
    Object* collidedWith = nullptr;
};
std::ostream& operator<<(std::ostream& out, const CollisionResult& result);

struct AABB {
    Vector3 ptMin;
    Vector3 ptMax;

    AABB() {}
    AABB(const Vector3& ptMin, const Vector3& ptMax) :
        ptMin(ptMin), ptMax(ptMax) {}

    AABB(const Vector3* arr, size_t size) {
        if (size == 0) return;
        Vector3 min = arr[0], max = arr[0];

        for (size_t i = 1; i < size; i++) {
            min = glm::min(min, arr[i]);
            max = glm::max(max, arr[i]);
        }
        ptMax = max;
        ptMin = min;
    }

    static AABB FromPoints(const Vector3& pt1, const Vector3& pt2, const Vector3& pt3) {
        Vector3 ptMin = glm::min(pt1, pt2, pt3) - 0.01f;
        Vector3 ptMax = glm::max(pt1, pt2, pt3) + 0.01f;
        return AABB(ptMin, ptMax);
    }

    void ExpandToContain(const Vector3& pt) {
        ptMin = glm::min(ptMin, pt - 0.01f);
        ptMax = glm::max(ptMax, pt + 0.01f);
    }

    static AABB FromTwo(AABB& a, AABB& b) {
        return AABB(glm::min(a.ptMin, b.ptMin), glm::max(a.ptMax, b.ptMax));
    }

    bool CollidesWith(RayCastRequest& ray, RayCastResult& result);
};

enum class ColliderType : int {
    OBB,
    SPHERE,
    STATIC_MESH,
    CAPSULE
};

struct Collider {
    // Attached to a game object with position offset
    Object* owner;

    Vector3 position;
    Quaternion rotation;

public:
    Collider(Object* owner, Vector3 position, Quaternion rotation) :
        owner(owner), position(position), rotation(rotation) { }

    virtual ~Collider() { }
    virtual ColliderType GetType() = 0;

    virtual AABB GetBroadAABB() = 0;

    // Narrow Phase Collision
    virtual CollisionResult CollidesWith(Collider* other) = 0;

    // Uses the ray collision model to calculate
    bool CollidesWith(const Vector3& p1, const Vector3& p2) {
        RayCastRequest request;
        request.startPoint = p1;
        request.direction = glm::normalize(p2 - p1);
        RayCastResult result;
        if (!CollidesWith(request, result)) {
            return false;
        }
        // Within bounds of line segment
        return result.zDepth < glm::distance(p1, p2);
    }

    virtual bool CollidesWith(RayCastRequest& ray, RayCastResult& result) = 0;

    Vector3 GetPosition();
    Quaternion GetRotation();

    Matrix4 GetWorldTransform();

    Object* GetOwner() { return owner; }
};

inline bool IsPointInAABB(const Vector3& RectPosition, const Vector3& RectSize, const Vector3& Point) {
    return
        (Point.x > RectPosition.x && Point.x < RectPosition.x + RectSize.x) &&
        (Point.y > RectPosition.y && Point.y < RectPosition.y + RectSize.y) &&
        (Point.z > RectPosition.z && Point.z < RectPosition.z + RectSize.z);
}

struct OBBCollider : public Collider {
    // REPLICATED(Vector3, size, "s");
    Vector3 size;

    OBBCollider() : OBBCollider(nullptr, Vector3{}, Vector3{}) {}

    OBBCollider(Object* owner, Vector3 position, Vector3 size, Quaternion rotation) :
        Collider(owner, position, rotation), size(size) {}

    OBBCollider(Object* owner, Vector3 position, Vector3 size) :
        OBBCollider(owner, position, size, Quaternion{}) {}

    virtual ColliderType GetType() override { return ColliderType::OBB; }

    virtual AABB GetBroadAABB() override;

    CollisionResult CollidesWith(Collider* other) override;
    bool CollidesWith(RayCastRequest& ray, RayCastResult& result) override;
};


struct SphereCollider : public Collider {
    // REPLICATED(float, radius, "r");
    float radius;

    SphereCollider(Object* owner, Vector3 position, double radius) :
        Collider(owner, position, Quaternion{}),
        radius(radius) {}

    virtual AABB GetBroadAABB() override {
        return AABB(GetPosition() - radius, GetPosition() + radius);
    }

    virtual ColliderType GetType() override { return ColliderType::SPHERE; }
    CollisionResult CollidesWith(Collider* other) override;
    bool CollidesWith(RayCastRequest& ray, RayCastResult& result) override;
};

struct StaticMeshCollider : public Collider {
    AABB broad;
    Mesh& mesh;

    BVHTree* bvhTree = nullptr;

    StaticMeshCollider(Object* owner, Mesh& mesh);

    ~StaticMeshCollider();

    virtual AABB GetBroadAABB() override {
        return broad;
    }

    virtual ColliderType GetType() override { return ColliderType::STATIC_MESH; }
    CollisionResult CollidesWith(Collider* other) override;
    bool CollidesWith(RayCastRequest& ray, RayCastResult& result) override;
};

struct CapsuleCollider : public Collider {
    Vector3 position2;
    float radius;

    CapsuleCollider(Object* owner, Vector3 position,
        Vector3 position2, float radius) : Collider(owner, position, Quaternion{}),
        position2(position2), radius(radius) {}

    ~CapsuleCollider() {}

    virtual AABB GetBroadAABB() override {
        return AABB(glm::min(position - radius, position2 - radius),
            glm::max(position + radius, position + radius));
    }

    virtual ColliderType GetType() override { return ColliderType::CAPSULE; }
    CollisionResult CollidesWith(Collider* other) override;
    bool CollidesWith(RayCastRequest& ray, RayCastResult& result) override;
};

struct TwoPhaseCollider {
    std::vector<Collider*> children;
    Object* owner;

    TwoPhaseCollider(Object* owner) :
        owner(owner) {}

    ~TwoPhaseCollider() {
        for (auto& collider : children) {
            delete collider;
        }
        children.clear();
    }

    CollisionResult CollidesWith(Collider* other);
    CollisionResult CollidesWith(TwoPhaseCollider* other);

    bool CollidesWith(const Vector3& p1, const Vector3& p2) {
        bool ret = false;
        for (auto& child : children) {
            ret |= child->CollidesWith(p1, p2);
        }
        return ret;
    }

    bool CollidesWith(RayCastRequest& ray, RayCastResult& result) {
        bool ret = false;
        for (auto& child : children) {
            RayCastResult fakeResult;
            if (!child->GetBroadAABB().CollidesWith(ray, fakeResult)) continue;
            ret |= child->CollidesWith(ray, result);
        }
        return ret;
    }

    void AddCollider(Collider* collider) {
        children.push_back(collider);
    }
};

void GenerateOBBCollidersFromModel(Object* obj);
void GenerateStaticMeshCollidersFromModel(Object* obj);