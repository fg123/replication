#ifndef COLLISION_H
#define COLLISION_H

#include "vector.h"
#include "replicable.h"
#include "json/json.hpp"
#include "ray-cast.h"

class Object;

struct CollisionResult {
    bool isColliding = false;
    Vector3 collisionDifference;
    Object* collidedWith;
};

struct Collider : Replicable {
    // Attached to a game object with position offset
    Object* owner;
    REPLICATED(Vector3, position, "p");

public:
    Collider(Object* owner, Vector3 position) : owner(owner), position(position) { }
    virtual ~Collider() { }
    virtual int GetType() = 0;

    // Detailed collision
    virtual CollisionResult CollidesWith(Collider* other) = 0;
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

    virtual bool CollidesWith(RayCastRequest& ray, RayCastResult& result) {
        throw "Not implemented ray cast!";
    }

    Vector3 GetPosition();
    Object* GetOwner() { return owner; }
    virtual void Serialize(JSONWriter& obj) override {
        Replicable::Serialize(obj);
        obj.Key("t");
        obj.Int(GetType());
    }
};

// Deprecated 2D Colliders
struct RectangleCollider : public Collider {
    REPLICATED(Vector3, size, "s");

    RectangleCollider(Object* owner, Vector3 position, Vector3 size) : Collider(owner, position),
        size(size) {}
    virtual int GetType() override { return 0; }
    CollisionResult CollidesWith(Collider* other) override;
};

// Deprecated 2D Colliders
struct CircleCollider : public Collider {
    REPLICATED(float, radius, "r");

    CircleCollider(Vector3 position, double radius) : CircleCollider(nullptr, position, radius) {}
    CircleCollider(Object* owner, Vector3 position, double radius) : Collider(owner, position),
            radius(radius) {}
    virtual int GetType() override { return 1; }
    CollisionResult CollidesWith(Collider* other) override;
};

inline bool IsPointInRect(const Vector3& RectPosition, const Vector3& RectSize, const Vector3& Point) {
    return
        (Point.x > RectPosition.x && Point.x < RectPosition.x + RectSize.x) &&
        (Point.y > RectPosition.y && Point.y < RectPosition.y + RectSize.y);
}

struct AABBCollider : public Collider {
    REPLICATED(Vector3, size, "s");

    AABBCollider(Object* owner, Vector3 position, Vector3 size) : Collider(owner, position),
        size(size) {}
    virtual int GetType() override { return 2; }
    CollisionResult CollidesWith(Collider* other) override;
    bool CollidesWith(RayCastRequest& ray, RayCastResult& result) override;
};

inline bool IsPointInAABB(const Vector3& RectPosition, const Vector3& RectSize, const Vector3& Point) {
    return
        (Point.x > RectPosition.x && Point.x < RectPosition.x + RectSize.x) &&
        (Point.y > RectPosition.y && Point.y < RectPosition.y + RectSize.y) &&
        (Point.z > RectPosition.z && Point.z < RectPosition.z + RectSize.z);
}

struct SphereCollider : public Collider {
    REPLICATED(float, radius, "r");

    SphereCollider(Vector3 position, double radius) : SphereCollider(nullptr, position, radius) {}
    SphereCollider(Object* owner, Vector3 position, double radius) : Collider(owner, position),
            radius(radius) {}
    virtual int GetType() override { return 3; }
    CollisionResult CollidesWith(Collider* other) override;
};

struct TwoPhaseCollider : public Replicable {
    REPLICATED(AABBCollider, aabbBroad, "ab");
    std::vector<Collider*> children;
    Object* owner;

    TwoPhaseCollider(Object* owner) :
        aabbBroad(owner, Vector3(), Vector3()),
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
            ret |= child->CollidesWith(ray, result);
        }
        return ret;
    }

    void AddCollider(Collider* collider) {
        children.push_back(collider);
        if (AABBCollider* aabb = dynamic_cast<AABBCollider*>(collider)) {
            if (children.size() == 1) {
                aabbBroad.position = aabb->position;
                aabbBroad.size = aabb->size;
            }
            else {
                aabbBroad.position = glm::min(aabbBroad.position, aabb->GetPosition());
                aabbBroad.size = glm::max(aabbBroad.position + aabbBroad.size,
                    aabb->position + aabb->size) - aabbBroad.position;
            }
        }
    }

    virtual void Serialize(JSONWriter& obj) override;
    virtual void ProcessReplication(json& obj) override;
};


void GenerateAABBCollidersFromModel(Object* obj);

#endif