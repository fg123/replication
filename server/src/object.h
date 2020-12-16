#ifndef OBJECT_H
#define OBJECT_H

#include <cstdint>
#include "timer.h"
#include "vector.h"
#include "collision.h"

using ObjectID = uint64_t;

class Game;

enum class Tag : uint64_t {
    PLAYER = 0b01,
    GROUND = 0b10
};

class Object : Replicable {
    // All are measured in the same units, velocity is in position units
    //   per second
    Vector2 position;
    Vector2 velocity;

    std::vector<Collider*> colliders;
    Game& game;
    ObjectID id;
    bool isDirty = false;
    bool isStatic = false;
    bool isGrounded = false;
    Time lastTickTime = 0;

    uint64_t tags;

public:
    Object(Game& game);
    virtual ~Object();

    Time DeltaTime(Time currentTime);
    virtual void Tick(Time time);

    virtual void OnDeath() {}

    void ResolveCollision(const CollisionResult& result);

    CollisionResult CollidesWith(Object* other);
    void AddCollider(Collider* col) { colliders.push_back(col); }
    ObjectID GetId() const { return id; }

#ifdef BUILD_CLIENT
    // Very dangerous, only client side replication uses
    void SetId(ObjectID newId) { id = newId; }
#endif
    void ProcessReplication(json& object) override;

    bool IsDirty() const { return isDirty; }
    void SetDirty(bool dirty) { isDirty = dirty; }

    virtual const char* GetClass() { return "Object"; }
    virtual void Serialize(json& obj) override;

    const Vector2& GetPosition() const { return position; }
    const Vector2& GetVelocity() const { return velocity; }

    void SetPosition(const Vector2& in) { position = in; }
    void SetVelocity(const Vector2& in) { velocity = in; }

    void SetIsStatic(bool isStatic) { this->isStatic = isStatic; }

    void SetTag(Tag tag) { tags |= (uint64_t)tag; }
    void RemoveTag(Tag tag) { tags &= ~(uint64_t)tag; }
    bool IsTagged(Tag tag) const { return tags & (uint64_t)tag; }
    bool IsGrounded() const { return isGrounded; }
};

#endif