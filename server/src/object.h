#pragma once

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

#define CLASS_CREATE(name)                                                     \
    protected:                                                                 \
        using super = name;                                                    \
    public:                                                                    \
        static Object* Create(Game& game) { return new name(game); }           \
        const char* GetClass() const override { return #name; }                \

#define CLASS_REGISTER(name) static ObjectRegister<name> name##_Register { #name }

// Bitflag, everything is AT LEAST an object.
enum Tag : uint64_t {
    // Every Object Should Have This Set
    OBJECT              = 0b0000000000000000001,
    // PlayerObject
    PLAYER              = 0b0000000000000000010,
    // Controls when a player object can jump
    GROUND              = 0b0000000000000000100,
    // WeaponObjects
    WEAPON              = 0b0000000000000001000,
    // Disables Gravity Force
    NO_GRAVITY          = 0b0000000000000010000,
    // Disable KillPlane / LivePlane
    NO_KILLPLANE        = 0b0000000000000100000,

    // Client Draw Control Flags

    // Draws after opaque
    // DRAW_TRANSPARENCY   = 0b0000000000001000000,
    NO_CAST_SHADOWS     = 0b0000000000001000000,

    // Draws after transparency (no z-buffer)
    DRAW_FOREGROUND     = 0b0000000000010000000,

    // Draw Outline
    DRAW_OUTLINE        = 0b0000000000100000000
};

class Object : public Replicable {
protected:
    Game& game;

    // All are measured in the same units, velocity is in position units
    //   per second these are used for "display"
    REPLICATED(Vector3, position, "p");
    REPLICATED(Quaternion, rotation, "r");
    REPLICATED(Vector3, scale, "sc");
    REPLICATED(Vector3, velocity, "v");

    Vector3 lastFramePosition;
    Vector3 lastFrameVelocity;

    ObjectID id;

    bool isDirty;
    REPLICATED(bool, isStatic, "st");
    REPLICATED(bool, isGrounded, "ig");

    Time lastTickTime = 0;

    Time spawnTime = 0;

    TwoPhaseCollider collider;
    // REPLICATED(TwoPhaseCollider, collider, "c");

    // In default mode, every collision will occur and all hits are reported
    //   to OnCollide
    REPLICATED(uint64_t, tags, "ta");
    REPLICATED(uint64_t, collisionExclusion, "ce");
    REPLICATED(uint64_t, collisionReporting, "cr");

    Model* model = nullptr;

public:

#ifdef BUILD_CLIENT
    // For Client-Side Interpolation

    // When Tick() generates a new position, we want to display this position
    //   offset by a singular Tick basically.
    Time lastClientDrawTime = 0;
    Time nextTickTargetTime = 0;
    Vector3 clientPosition;
    Quaternion clientRotation;
    Vector3 clientScale;

    // Replication Smoothing
    Vector3 clientMeshPositionOffset;
    Time clientSmoothingTargetTime = 0;

    bool IsVisibleInFrustrum(const Vector3& camPos, const Vector3& camDir);
#endif

    REPLICATED(Vector3, airFriction, "af");

#ifdef BUILD_SERVER
    size_t replicateSoftCounter = 0;
#endif

#ifdef BUILD_CLIENT
    void SetLastTickTime(Time time);
    float GetClientInterpolationRatio(Time now);
    virtual void PreDraw(Time time);
    bool createdThisFrameOnClient = false;
#endif

    Object(Game& game);
    virtual ~Object();

    Time DeltaTime(Time currentTime);
    virtual void Tick(Time time);

    virtual void OnDeath() {}

    // This is called on the first tick of the object on the client
    //   after it has been replicated
    virtual void OnClientCreate();

    virtual void OnCreate() {}

    void HandleAllCollisions();
    void ResolveCollision(Vector3 difference);

    size_t GetColliderCount() const { return collider.children.size(); }
    const TwoPhaseCollider& GetCollider() const { return collider; }
    CollisionResult CollidesWith(Collider* other);
    CollisionResult CollidesWith(Object* other);
    bool CollidesWith(const Vector3& p1, const Vector3& p2);
    bool CollidesWith(RayCastRequest& ray, RayCastResult& result);

    void AddCollider(Collider* col);

    void ClearColliders();

    ObjectID GetId() const { return id; }

    void SetId(ObjectID newId) { id = newId; }

    bool IsDirty() const { return isDirty; }
    void SetDirty(bool dirty) { isDirty = dirty; }

    virtual const char* GetClass() const = 0;

    virtual void Serialize(JSONWriter& obj) override;
    void ProcessReplication(json& object) override;

    Time GetSpawnTime() const { return spawnTime; }
    const Model* GetModel() const { return model; }
    const Vector3& GetPosition() const { return position; }
    const Vector3& GetScale() const { return scale; }
    const Quaternion& GetRotation() const { return rotation; }
    virtual Vector3 GetVelocity() { return velocity; }
    virtual Vector3 GetLookDirection() const { return glm::normalize(Vector::Forward * rotation); }

    #ifdef BUILD_CLIENT
    virtual Vector3 GetClientLookDirection() const { return glm::normalize(Vector::Forward * GetClientRotation()); }
    #endif

    void SetPosition(const Vector3& in);
    void SetRotation(const Quaternion& in);
    void SetScale(const Vector3& in);
    void SetVelocity(const Vector3& in);

    bool IsStatic() const { return isStatic; }
    void SetIsStatic(bool isStatic);

    uint64_t IsCollisionExcluded(uint64_t tags) { return collisionExclusion & tags; }
    uint64_t ShouldReportCollision(uint64_t tags) { return collisionReporting & tags; }
    uint64_t GetTags() const { return tags; };
    void SetTag(Tag tag) { tags |= (uint64_t)tag; }
    void RemoveTag(Tag tag) { tags &= ~(uint64_t)tag; }
    bool IsTagged(Tag tag) const { return tags & (uint64_t)tag; }
    bool IsTagged(uint64_t tag) const { return tags & (uint64_t)tag; }
    bool IsGrounded() const { return isGrounded; }

    virtual void OnCollide(CollisionResult& result);

    void SetModel(Model* newModel);

#ifdef BUILD_CLIENT
    virtual const Matrix4 GetTransform();
    const Vector3& GetClientPosition() const;
    const Vector3& GetClientScale() const;
    const Quaternion& GetClientRotation() const;
#endif
#ifdef BUILD_SERVER
    virtual const Matrix4 GetTransform();
#endif

    Model* GetModel();
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
