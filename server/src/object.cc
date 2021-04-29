#include "object.h"
#include "game.h"

#include "json/json.hpp"

static const double GRAVITY = 300;
static const double EPSILON = 10e-20;

std::unordered_map<std::string, ObjectConstructor>& GetClassLookup() {
    static std::unordered_map<std::string, ObjectConstructor> ClassLookup;
    return ClassLookup;
}

Time Object::DeltaTime(Time currentTime) {
    if (lastTickTime == 0) {
        lastTickTime = currentTime;
        return 0;
    }
    if (currentTime < lastTickTime) {
        LOG_WARN("Tick time inconsistency: " << currentTime
            << " < " << lastTickTime << " for object ("
            << GetId() << ") " << GetClass());
    }
    Time delta = currentTime - lastTickTime;
    lastTickTime = currentTime;
    return delta;
}

Object::Object(Game& game) :
    game(game),
    rotation(),
    scale(1, 1, 1),
    z(0),
    id(0),
    isDirty(true),
    isStatic(false),
    isGrounded(false),
    tags((uint64_t)Tag::OBJECT),
    collisionExclusion(0),
    collisionReporting(~0),
    airFriction(0.8, 0.8, 0.8)
{}

Object::~Object() {
    for (auto& collider : colliders) {
        delete collider;
    }
}

void Object::Tick(Time time) {
    // Tick my children
    for (auto& child : children) {
        child->Tick(time);
    }
    // Always replicate for now
    if (isStatic) return;

    Time delta = DeltaTime(time);
    if (delta == 0) return;

    // if (IsTagged(Tag::PLAYER)) {
    //     LOG_DEBUG(delta);
    // }
    // Apply Physics
    double timeFactor = delta / 1000.0;

    if (!isStatic && GetColliderCount() > 0 && !IsTagged(Tag::NO_GRAVITY)) {
        velocity.y -= GRAVITY * timeFactor;
    }

    velocity.x *= airFriction.x;
    velocity.y *= airFriction.y;
    velocity.z *= airFriction.z;

    Vector3 positionDelta = GetVelocity() * timeFactor;
    position += positionDelta;

    isGrounded = false;
    game.HandleCollisions(this);

    if (std::abs(velocity.x) < EPSILON) {
        velocity.x = 0;
    }
    if (std::abs(velocity.y) < EPSILON) {
        velocity.y = 0;
    }
    if (std::abs(velocity.z) < EPSILON) {
        velocity.z = 0;
    }

#ifdef BUILD_SERVER
    // We are dirty if velocity changed last frame
    //    or position changed significantly
    if (position - positionDelta != lastFramePosition ||
        GetVelocity() != lastFrameVelocity) {
        SetDirty(true);
    }
#endif
#ifdef BUILD_CLIENT
    // Always set dirty for client because we want client
    //   GetObjectSerialized to work properly
    SetDirty(true);
#endif

    lastFrameVelocity = GetVelocity();
    lastFramePosition = position;
}

void Object::ResolveCollision(const Vector3& difference) {
    // if (isStatic) return;
    // TODO: this collision difference really should be negated
    if (std::isnan(difference.x) || std::isnan(difference.y)) {
        LOG_ERROR("ResolveCollision has nan difference " << difference);
        throw std::runtime_error("ResolveCollision has nan difference!");
    }

    // LOG_DEBUG("Difference " << difference << " " << velocity);
    position -= difference;
    // We had to adjust the collision in a certain direction.
    // If the velocity does not match the direction of resolution, do nothing
    // If it does, we need to clamp it to zero.
    // This is kinda wonky and unintuitive because you decided to do -=
    //   collisionDifference, changing it around requires changing the
    //   calculations for collisionDifference in the collision subroutines

    if (SameSign(difference.x, velocity.x)) {
        velocity.x = 0;
    }
    if (SameSign(difference.y, velocity.y)) {
        velocity.y = 0;
    }
    if (SameSign(difference.z, velocity.z)) {
        velocity.z = 0;
    }
}

void Object::OnCollide(CollisionResult& result) {
    if (result.collidedWith->IsTagged(Tag::GROUND)) {
        isGrounded = true;
    }
}

CollisionResult Object::CollidesWith(Collider* other) {
    CollisionResult finalResult;
    for (auto& collider: colliders) {
        // Collider vs collider, do sanity check first
        if (!collider->CollidePotentialWith(other)) continue;
        CollisionResult r = collider->CollidesWith(other);
        if (r.isColliding) {
            finalResult.isColliding = true;
            finalResult.collisionDifference += r.collisionDifference;
        }
    }
    return finalResult;
}

CollisionResult Object::CollidesWith(Object* other) {
    if (GetColliderCount() == 0) {
        return CollisionResult();
    }
    // Add up all the collisions
    CollisionResult finalResult;
    for (auto& colliderOther: other->colliders) {
        CollisionResult r = CollidesWith(colliderOther);
        if (r.isColliding) {
            finalResult.isColliding = true;
            finalResult.collisionDifference += r.collisionDifference;
        }
    }
    return finalResult;
}

CollisionResult Object::CollidesWith(const Vector3& p1, const Vector3& p2) {
    for (auto& collider: colliders) {
        CollisionResult r = collider->CollidesWith(p1, p2);
        if (r.isColliding) {
            return r;
        }
    }
    return CollisionResult{};
}

void Object::SetIsStatic(bool isStatic) {
    this->isStatic = isStatic;
    SetDirty(true);
}

void Object::Serialize(JSONWriter& obj) {
    Replicable::Serialize(obj);

    obj.Key("t");
    obj.String(GetClass());

    obj.Key("c");
    obj.StartArray();
    // LOG_DEBUG("Colliders:");
    for (auto& collider : colliders) {
        obj.StartObject();
        collider->Serialize(obj);
        obj.EndObject();
    }
    obj.EndArray();

#ifdef BUILD_SERVER
    if (parent) {
        obj.Key("pa");
        obj.Int(parent->GetId());
    }
    if (children.size() > 0) {
        obj.Key("ch");
        obj.StartArray();
        for (auto& child : children) {
            obj.Int(child->GetId());
        }
        obj.EndArray();
    }
#endif
    if (model) {
        obj.Key("m");
        obj.Int(model->GetId());
    }
#ifdef BUILD_CLIENT
    // Calculate a transformed matrix for drawing purposes
    glm::dmat4 transform = glm::translate(position) * glm::toMat4(rotation) * glm::scale(scale);

    obj.Key("transform");
    obj.StartArray();
    const double* vptr = glm::value_ptr(transform);
    for (size_t i = 0; i < 16; i++) {
        obj.Double(vptr[i]);
    }
    obj.EndArray();
#endif
}

void Object::ProcessReplication(json& object) {
    Replicable::ProcessReplication(object);

    // LOG_DEBUG(DumpJSON(object["c"]));
    if (colliders.size() != object["c"].GetArray().Size()) {
        // LOG_WARN("Clearing colliders");
        for (auto& collider : colliders) {
            delete collider;
        }
        colliders.clear();
    }

    // LOG_BREADCRUMB();
    if (colliders.empty()) {
        // Make some
        // LOG_WARN("Making colliders");
        for (json& colliderInfo : object["c"].GetArray()) {
            // LOG_DEBUG(DumpJSON(colliderInfo));
            if (colliderInfo["t"].GetInt() == 0) {
                AddCollider(new RectangleCollider(this, Vector3(), Vector3()));
            }
            else if (colliderInfo["t"].GetInt() == 1) {
                AddCollider(new CircleCollider(this, Vector3(), 0));
            }
            else if (colliderInfo["t"].GetInt() == 2) {
                AddCollider(new AABBCollider(this, Vector3(), Vector3()));
            }
            else if (colliderInfo["t"].GetInt() == 3) {
                AddCollider(new SphereCollider(this, Vector3(), 0));
            }
        }
    }
    // LOG_BREADCRUMB();
    size_t i = 0;
    for (json& colliderInfo : object["c"].GetArray()) {
        // LOG_BREADCRUMB();
        // LOG_DEBUG(object["c"].GetArray().Size());
        // LOG_DEBUG(DumpJSON(colliderInfo));
        colliders[i]->ProcessReplication(colliderInfo);
        // LOG_BREADCRUMB();
        i += 1;
        if (i >= colliders.size()) {
            break;
        }
    }
    // LOG_BREADCRUMB();
    if (object.HasMember("pa")) {
        parent = game.GetObject(object["pa"].GetInt());
    }
    else {
        parent = nullptr;
    }
    // LOG_BREADCRUMB();
    children.clear();
    if (object.HasMember("ch")) {
        for (json& value : object["ch"].GetArray()) {
            children.insert(game.GetObject(value.GetInt()));
        }
    }
    if (object.HasMember("m")) {
        model = game.GetModel(object["m"].GetInt());
    }
    else {
        model = nullptr;
    }
    SetDirty(true);
}