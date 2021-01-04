#ifndef OBJECT_H
#define OBJECT_H

#include <cstdint>
#include <unordered_map>
#include <unordered_set>

#include "timer.h"
#include "vector.h"
#include "collision.h"
#include "logging.h"

// This must be 32 bit because client side JS only supports 32 bit
using ObjectID = uint32_t;

class Game;
class Object;

using ObjectConstructor = Object*(*)(Game& game);
std::unordered_map<std::string, ObjectConstructor>& GetClassLookup();

template<class T>
struct ObjectRegister {
    ObjectRegister(const std::string& name) {
        auto& ClassLookup = GetClassLookup();
        if (ClassLookup.find(name) != ClassLookup.end()) {
            return;
        }
        LOG_INFO("Auto Registering " << name);
        if (name.size() > 20) {
            LOG_WARN("Class name " << name << " more than 20 characters! Might not have SSO!");
        }
        ClassLookup[name] = T::Create;
    }
};

#define CLASS_CREATE(name) \
    static Object* Create(Game& game) { return new name(game); } \
    const char* GetClass() const override { return #name; }

#define CLASS_REGISTER(name) static ObjectRegister<name> name##_Register { #name }

// Bitflag, everything is AT LEAST an object.
enum Tag : uint64_t {
    OBJECT          = 0b0000000000000000001,
    PLAYER          = 0b0000000000000000010,
    GROUND          = 0b0000000000000000100,
    WEAPON          = 0b0000000000000001000,
    NO_GRAVITY      = 0b0000000000000010000,
    NO_KILLPLANE    = 0b0000000000000100000
};

class Object : Replicable {
protected:
    Game& game;

    // All are measured in the same units, velocity is in position units
    //   per second
    REPLICATED(Vector2, position, "p");

    REPLICATED(int, z, "z");

    REPLICATED(Vector2, velocity, "v");

    Vector2 lastFramePosition;
    Vector2 lastFrameVelocity;

    REPLICATED(ObjectID, id, "id");

    bool isDirty;
    REPLICATED(bool, isStatic, "s");
    REPLICATED(bool, isGrounded, "ig");

    Time lastTickTime = 0;

    std::vector<Collider*> colliders;
    uint64_t tags = (uint64_t)Tag::OBJECT;
    uint64_t collideExclusion = 0;

public:
    // For object hierarchy, this is all managed from the game, used for
    //   knowing who ticks(). Parents tick their own children.
    std::unordered_set<Object*> children;
    Object* parent = nullptr;

    REPLICATED(Vector2, airFriction, "af");

#ifdef BUILD_SERVER
    size_t replicateSoftCounter = 0;
#endif

#ifdef BUILD_CLIENT
    void SetLastTickTime(Time time) {
        for (auto& child : children) {
            child->SetLastTickTime(time);
        }
        lastTickTime = time;
    }
#endif

    Object(Game& game);
    virtual ~Object();

    Time DeltaTime(Time currentTime);
    virtual void Tick(Time time);

    virtual void OnDeath() {}

    void ResolveCollision(const Vector2& difference);

    size_t GetColliderCount() const { return colliders.size(); }

    CollisionResult CollidesWith(Collider* other);
    CollisionResult CollidesWith(Object* other);
    CollisionResult CollidesWith(const Vector2& p1, const Vector2& p2);

    void AddCollider(Collider* col) { colliders.push_back(col); }
    ObjectID GetId() const { return id; }

    void SetId(ObjectID newId) { id = newId; }

    bool IsDirty() const { return isDirty; }
    void SetDirty(bool dirty) { isDirty = dirty; }

    virtual const char* GetClass() const = 0;
    virtual void Serialize(JSONWriter& obj) override;
    void ProcessReplication(json& object) override;

    const Vector2& GetPosition() const { return position; }
    virtual Vector2 GetVelocity() { return velocity; }

    void SetPosition(const Vector2& in) { position = in; }
    void SetVelocity(const Vector2& in) { velocity = in; }

    bool IsStatic() const { return isStatic; }
    void SetIsStatic(bool isStatic);

    uint64_t IsCollideExcluded(uint64_t tags) { return collideExclusion & tags; }
    uint64_t GetTags() const { return tags; };
    void SetTag(Tag tag) { tags |= (uint64_t)tag; }
    void RemoveTag(Tag tag) { tags &= ~(uint64_t)tag; }
    bool IsTagged(Tag tag) const { return tags & (uint64_t)tag; }
    bool IsGrounded() const { return isGrounded; }

    virtual void OnCollide(CollisionResult& result);
};

inline std::ostream& operator<<(std::ostream& os, const Object* obj) {
    if (!obj) {
        os << "[No Object]";
        return os;
    }
    os << "(" << obj->GetId() << ") " << obj->GetClass();
    return os;
}

#endif