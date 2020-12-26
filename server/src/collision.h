#ifndef COLLISION_H
#define COLLISION_H

#include "vector.h"
#include "json/json.hpp"

class Object;

struct CollisionResult {
    bool isColliding = false;
    Vector2 collisionDifference;
    Object* collidedWith;
};

struct Collider : Replicable {
    // Attached to a game object with position offset
    Object* owner;
    Vector2 position;
public:
    Collider(Object* owner, Vector2 position) : owner(owner), position(position) { }
    virtual ~Collider() { }
    virtual int GetType() = 0;
    virtual CollisionResult CollidesWith(Collider* other) = 0;
    virtual CollisionResult CollidesWith(const Vector2& p1, const Vector2& p2) = 0;
    Vector2 GetPosition();
    Object* GetOwner() { return owner; }
};

struct RectangleCollider : public Collider {
    Vector2 size;
    RectangleCollider(Object* owner, Vector2 position, Vector2 size) : Collider(owner, position),
        size(size) {}
    virtual int GetType() override { return 0; }
    CollisionResult CollidesWith(Collider* other) override;
    CollisionResult CollidesWith(const Vector2& p1, const Vector2& p2) override;
    virtual void Serialize(json& obj) override {
        size.Serialize(obj["size"]);
    }
    virtual void ProcessReplication(json& obj) override {
        size.ProcessReplication(obj["size"]);
    }
};

struct CircleCollider : public Collider {
    double radius;
    CircleCollider(Vector2 position, double radius) : CircleCollider(nullptr, position, radius) {}
    CircleCollider(Object* owner, Vector2 position, double radius) : Collider(owner, position),
            radius(radius) {}
    virtual int GetType() override { return 1; }
    CollisionResult CollidesWith(Collider* other) override;
    CollisionResult CollidesWith(const Vector2& p1, const Vector2& p2) override;
    virtual void Serialize(json& obj) override {
        obj["radius"] = radius;
    }
    virtual void ProcessReplication(json& obj) override {
        radius = obj["radius"];
    }
};

inline bool IsPointInRect(const Vector2& RectPosition, const Vector2& RectSize, const Vector2& Point) {
    return
        (Point.x > RectPosition.x && Point.x < RectPosition.x + RectSize.x) &&
        (Point.y > RectPosition.y && Point.y < RectPosition.y + RectSize.y);
}

#endif