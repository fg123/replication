#pragma once

#include "vector.h"
#include "replicable.h"
#include "json/json.hpp"
#include "ray-cast.h"
#include "mesh.h"

class Object;

struct CollisionResult {
    bool isColliding = false;
    Vector3 collisionDifference;
    Object* collidedWith = nullptr;
};
std::ostream& operator<<(std::ostream& out, const CollisionResult& result);

struct Collider {
    // Attached to a game object with position offset
    Object* owner;
    // REPLICATED(Vector3, position, "p");
    // REPLICATED(Quaternion, rotation, "r");
    Vector3 position;
    Quaternion rotation;

public:
    Collider(Object* owner, Vector3 position, Quaternion rotation) :
        owner(owner), position(position), rotation(rotation) { }

    virtual ~Collider() { }
    virtual int GetType() = 0;

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

    virtual bool CollidesWith(RayCastRequest& ray, RayCastResult& result) {
        throw "Not implemented ray cast!";
    }

    Vector3 GetPosition();
    Quaternion GetRotation();

    Matrix4 GetWorldTransform();

    Object* GetOwner() { return owner; }
    // virtual void Serialize(JSONWriter& obj) override {
    //     Replicable::Serialize(obj);
    //     obj.Key("t");
    //     obj.Int(GetType());
    // }
};

struct AABBCollider : public Collider {
    // REPLICATED(Vector3, size, "s");
    Vector3 size;

    AABBCollider(Object* owner, Vector3 position, Vector3 size, Quaternion rotation) :
        Collider(owner, position, rotation), size(size) {}

    AABBCollider(Object* owner, Vector3 position, Vector3 size) :
        AABBCollider(owner, position, size, Quaternion{}) {}

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
    // REPLICATED(float, radius, "r");
    float radius;

    SphereCollider(Object* owner, Vector3 position, double radius) :
        Collider(owner, position, Quaternion{}),
        radius(radius) {}

    virtual int GetType() override { return 3; }
    CollisionResult CollidesWith(Collider* other) override;
};

struct StaticMeshCollider : public Collider {
    AABBCollider broad;

    Mesh& mesh;

    StaticMeshCollider(Object* owner, Mesh& mesh) :
        Collider(owner, Vector3{}, Quaternion{}),
        broad(owner, Vector3{}, Vector3{}),
        mesh(mesh) {

        if (!mesh.vertices.empty()) {
            Vector3 min = mesh.vertices[0].position;
            Vector3 max = mesh.vertices[0].position;
            for (size_t i = 1; i < mesh.vertices.size(); i++) {
                min = glm::min(min, mesh.vertices[i].position);
                max = glm::max(max, mesh.vertices[i].position);
            }
            broad = AABBCollider(owner, min, max - min);
        }
    }

    virtual int GetType() override { return 4; }
    CollisionResult CollidesWith(Collider* other) override;
    bool CollidesWith(RayCastRequest& ray, RayCastResult& result) override;
};

struct TwoPhaseCollider  {
    AABBCollider aabbBroad;
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

    void ExpandBroadIfNeeded(AABBCollider* aabb) {
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
    void AddCollider(Collider* collider) {
        children.push_back(collider);
        if (AABBCollider* aabb = dynamic_cast<AABBCollider*>(collider)) {
            ExpandBroadIfNeeded(aabb);
        }
        else if (StaticMeshCollider* mesh = dynamic_cast<StaticMeshCollider*>(collider)) {
            ExpandBroadIfNeeded(&mesh->broad);
        }
    }

};

void GenerateAABBCollidersFromModel(Object* obj);
void GenerateStaticMeshCollidersFromModel(Object* obj);