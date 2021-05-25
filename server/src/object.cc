#include "object.h"
#include "game.h"
#include "ray-cast.h"
#include "vector.h"
#include "json/json.hpp"

static const double GRAVITY = 30;
static const double EPSILON = 10e-10;

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
    id(0),
    isDirty(true),
    isStatic(false),
    isGrounded(false),
    spawnTime(game.GetGameTime()),
    collider(this),
    tags((uint64_t)Tag::OBJECT),
    collisionExclusion(0),
    collisionReporting(~0),
    airFriction(0.95, 0.95, 0.95)
{}

Object::~Object() {}

void Object::HandleAllCollisions() {
    Vector3 lastPosition = position;
    for (size_t i = 0; i < 5; i++) {
        game.HandleCollisions(this);
        if (IsZero(lastPosition - position)) {
            return;
        }
        lastPosition = position;
    }
    // LOG_WARN("Object still unstable after 1 iterations of collision resolution!");
}

void Object::Tick(Time time) {
    #ifdef BUILD_CLIENT
        debugLines.clear();
    #endif

    Time delta = DeltaTime(time);
    if (delta != 0) {

        // Apply Physics
        float timeFactor = delta / 1000.0;

        Vector3 positionDelta = GetVelocity() * timeFactor;
        isGrounded = false;
        if (!isStatic) {
            if (GetColliderCount() > 0 && !IsTagged(Tag::NO_GRAVITY)) {
                velocity.y -= GRAVITY * timeFactor;
            }

            velocity.x *= airFriction.x;
            if (velocity.y > 0) {
                velocity.y *= airFriction.y;
            }
            velocity.z *= airFriction.z;

            // No Tunneling
            position += positionDelta;
            HandleAllCollisions();

            // // Minimize Tunnelling by Creating Divisions
            // float AABBSize = glm::abs(glm::min(
            //     collider.aabbBroad.size.x,
            //     collider.aabbBroad.size.y,
            //     collider.aabbBroad.size.z));
            // float movement = glm::length(positionDelta);

            // int divisions = AABBSize < EPSILON ? 1 : glm::ceil(movement / AABBSize);

            // Vector3 subStepDelta = positionDelta;
            // for (int i = 0; i < divisions; i++) {
            //     position += subStepDelta / (float)divisions;
            //     HandleAllCollisions();
            //     if (IsStatic()) {
            //         break;
            //     }
            //     subStepDelta = GetVelocity() * timeFactor;
            // }

            // if (divisions == 0) {
            //     // We did not call HandleCollisions so reporting won't be triggered
            //     //   above, so we additionally handle collisions here.
            //     HandleAllCollisions();
            // }

            if (glm::abs(velocity.x) < EPSILON) {
                velocity.x = 0;
            }
            if (glm::abs(velocity.y) < EPSILON) {
                velocity.y = 0;
            }
            if (glm::abs(velocity.z) < EPSILON) {
                velocity.z = 0;
            }
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
            // Interpolate Over
            clientPosition += (position - clientPosition) / 2.0f;
            clientRotation = glm::slerp(clientRotation, rotation, 0.5f);

            // clientPosition = position;
            // clientRotation = rotation;

            // Always set dirty for client because we want client
            //   GetObjectSerialized to work properly
            SetDirty(true);
        #endif

        lastFrameVelocity = velocity;
        lastFramePosition = position;
    }
    // Tick my children
    for (auto& child : children) {
        child->Tick(time);
    }

    AddDebugLine(position, position + GetLookDirection(), Vector3(1, 0, 1));
}

void Object::ResolveCollision(Vector3 difference) {
    // if (isStatic) return;
    // TODO: this collision difference really should be negated
    if (std::isnan(difference.x) || std::isnan(difference.y) || std::isnan(difference.z)) {
        LOG_ERROR("ResolveCollision has nan difference " << difference);
        throw std::runtime_error("ResolveCollision has nan difference!");
    }
    if (!IsZero(difference.x) && SameSign(difference.x, velocity.x)) {
        difference.x = 0.f;
    }
    if (!IsZero(difference.y) && SameSign(difference.y, velocity.y)) {
        difference.y = 0.f;
    }
    if (!IsZero(difference.z) && SameSign(difference.z, velocity.z)) {
        difference.z = 0.f;
    }
    if (IsTagged(Tag::PLAYER) && glm::length(difference) > 0.01f) {
        LOG_DEBUG("Player Correction Difference " << difference);
    }
    position += difference;
    // We had to adjust the collision in a certain direction.
    // If the velocity does not match the direction of resolution, do nothing
    // If it does, we need to clamp it to zero.

    if (!IsZero(difference.x) && !SameSign(difference.x, velocity.x)) {
        velocity.x = 0;
    }
    if (!IsZero(difference.y) && !SameSign(difference.y, velocity.y)) {
        velocity.y = 0;
    }
    if (!IsZero(difference.z) && !SameSign(difference.z, velocity.z)) {
        velocity.z = 0;
    }
}


void Object::OnCollide(CollisionResult& result) {
    if (result.collidedWith->IsTagged(Tag::GROUND) &&
        result.collisionDifference.y > 0) {
        isGrounded = true;
    }
}

CollisionResult Object::CollidesWith(Collider* other) {
    return collider.CollidesWith(other);
}

CollisionResult Object::CollidesWith(Object* other) {
    if (GetColliderCount() == 0) {
        return CollisionResult();
    }
    return collider.CollidesWith(&other->collider);
}

bool Object::CollidesWith(RayCastRequest& ray, RayCastResult& result) {
    if (GetColliderCount() == 0) {
        return false;
    }
    bool r = collider.CollidesWith(ray, result);
    if (r) {
        result.hitObject = this;
    }
    return r;
}

bool Object::CollidesWith(const Vector3& p1, const Vector3& p2) {
    return collider.CollidesWith(p1, p2);
}

void Object::SetIsStatic(bool isStatic) {
    this->isStatic = isStatic;
    SetDirty(true);
}

void Object::Serialize(JSONWriter& obj) {
    Replicable::Serialize(obj);

    obj.Key("t");
    obj.String(GetClass());

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
}

void Object::ProcessReplication(json& object) {
    Replicable::ProcessReplication(object);

    if (object.HasMember("pa")) {
        parent = game.GetObject(object["pa"].GetInt());
    }
    else {
        parent = nullptr;
    }

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
#ifdef BUILD_CLIENT
    if (!clientPositionSet) {
        clientPosition = position;
        clientPositionSet = true;
    }
    if (!clientRotationSet) {
        clientRotation = rotation;
        clientRotationSet = true;
    }
#endif
    SetDirty(true);
}