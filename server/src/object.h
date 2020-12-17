#ifndef OBJECT_H
#define OBJECT_H

#include <cstdint>
#include "timer.h"
#include "vector.h"
#include "collision.h"

using ObjectID = uint64_t;

class Game;

enum class Tag : uint64_t {
    PLAYER = 0b001,
    GROUND = 0b010,
    WEAPON = 0b100
};

class Object : Replicable {
protected:
    Game& game;
    // All are measured in the same units, velocity is in position units
    //   per second
    Vector2 position;
    Vector2 velocity;
    Vector2 airFriction;

    ObjectID id;
    bool isDirty = false;
    bool isStatic = false;
    bool isGrounded = false;
    Time lastTickTime = 0;

    std::vector<Collider*> colliders;
    uint64_t tags;
    uint64_t collideExclusion = 0;

public:
    Object(Game& game);
    virtual ~Object();

    Time DeltaTime(Time currentTime);
    virtual void Tick(Time time);

    virtual void OnDeath() {}

    void ResolveCollision(const Vector2& difference);

    size_t GetColliderCount() const { return colliders.size(); }

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

    uint64_t IsCollideExcluded(uint64_t tags) { return collideExclusion & tags; }
    uint64_t GetTags() const { return tags; };
    void SetTag(Tag tag) { tags |= (uint64_t)tag; }
    void RemoveTag(Tag tag) { tags &= ~(uint64_t)tag; }
    bool IsTagged(Tag tag) const { return tags & (uint64_t)tag; }
    bool IsGrounded() const { return isGrounded; }

    virtual void OnCollide(CollisionResult& result);
};

#endif