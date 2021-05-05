#ifndef OBJECT_H
#define OBJECT_H

#include <cstdint>
#include <unordered_map>
#include <unordered_set>

#include "timer.h"
#include "vector.h"
#include "collision.h"
#include "logging.h"
#include "replicable.h"
#include "model.h"
#include "ray-cast.h"

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

class Object : public Replicable {
protected:
    Game& game;

#ifdef BUILD_CLIENT
    // For Client-Side Interpolation
    Vector3 clientPosition;
    bool clientPositionSet = false;
#endif

    // All are measured in the same units, velocity is in position units
    //   per second
    REPLICATED(Vector3, position, "p");
    REPLICATED(Quaternion, rotation, "r");
    REPLICATED(Vector3, lookDirection, "ld");
    REPLICATED(Vector3, scale, "sc");
    REPLICATED(Vector3, velocity, "v");

    Vector3 lastFramePosition;
    Vector3 lastFrameVelocity;

    REPLICATED(ObjectID, id, "id");

    bool isDirty;
    REPLICATED(bool, isStatic, "s");
    REPLICATED(bool, isGrounded, "ig");

    Time lastTickTime = 0;

    Time spawnTime = 0;

    std::vector<Collider*> colliders;

    // In default mode, every collision will occur and all hits are reported
    //   to OnCollide
    REPLICATED(uint64_t, tags, "ta");
    REPLICATED(uint64_t, collisionExclusion, "ce");
    REPLICATED(uint64_t, collisionReporting, "cr");

    Model* model = nullptr;

public:
    // For object hierarchy, this is all managed from the game, used for
    //   knowing who ticks(). Parents tick their own children.
    std::unordered_set<Object*> children;
    Object* parent = nullptr;

    REPLICATED(Vector3, airFriction, "af");

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

    void ResolveCollision(const Vector3& difference);

    size_t GetColliderCount() const { return colliders.size(); }

    CollisionResult CollidesWith(Collider* other);
    CollisionResult CollidesWith(Object* other);
    CollisionResult CollidesWith(const Vector3& p1, const Vector3& p2);

    void CollidesWith(RayCastRequest& ray, RayCastResult& result);

    void AddCollider(Collider* col) { colliders.push_back(col); }
    ObjectID GetId() const { return id; }

    void SetId(ObjectID newId) { id = newId; }

    bool IsDirty() const { return isDirty; }
    void SetDirty(bool dirty) { isDirty = dirty; }

    virtual const char* GetClass() const = 0;

    virtual void Serialize(JSONWriter& obj) override;
    void ProcessReplication(json& object) override;

    const Vector3& GetPosition() const { return position; }
    const Vector3& GetScale() const { return scale; }
    const Quaternion& GetRotation() const { return rotation; }
    virtual Vector3 GetVelocity() { return velocity; }
    const Vector3& GetLookDirection() const { return lookDirection; }

    void SetPosition(const Vector3& in) { position = in; }
    void SetRotation(const Quaternion& in) { rotation = in; }
    void SetScale(const Vector3& in) { scale = in; }
    void SetVelocity(const Vector3& in) { velocity = in; }

    bool IsStatic() const { return isStatic; }
    void SetIsStatic(bool isStatic);

    uint64_t IsCollisionExcluded(uint64_t tags) { return collisionExclusion & tags; }
    uint64_t ShouldReportCollision(uint64_t tags) { return collisionReporting & tags; }
    uint64_t GetTags() const { return tags; };
    void SetTag(Tag tag) { tags |= (uint64_t)tag; }
    void RemoveTag(Tag tag) { tags &= ~(uint64_t)tag; }
    bool IsTagged(Tag tag) const { return tags & (uint64_t)tag; }
    bool IsGrounded() const { return isGrounded; }

    virtual void OnCollide(CollisionResult& result);

#ifdef BUILD_SERVER
    // Server-Only can change model, rely on replication to client
    void SetModel(Model* newModel) {
        model = newModel;
        isDirty = true;
    }
#endif

#ifdef BUILD_CLIENT
    virtual const Matrix4 GetTransform() {
        // Vector3 direction =
        return glm::translate(clientPosition) *
            glm::transpose(glm::toMat4(rotation)) *
            glm::scale(scale);
    }
    const Vector3& GetClientPosition() const { return clientPosition; }
#endif

    Model* GetModel() {
        return model;
    }
};

// Non abstract Object
class GameObject : public Object {
public:
    CLASS_CREATE(GameObject);

    GameObject(Game& game) : Object(game) {}
    GameObject(Game& game, const Vector3& position) : GameObject(game) {
        SetPosition(position);
    }
};

CLASS_REGISTER(GameObject);

inline std::ostream& operator<<(std::ostream& os, const Object* obj) {
    if (!obj) {
        os << "[No Object]";
        return os;
    }
    os << "(" << obj->GetId() << ") " << obj->GetClass();
    return os;
}

#endif