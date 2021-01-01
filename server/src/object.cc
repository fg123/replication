#include "object.h"
#include "game.h"

#include "json/json.hpp"

static const double GRAVITY = 3000;
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

Object::Object(Game& game) : game(game), airFriction(0.97, 1) {
}

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
        velocity.y += GRAVITY * timeFactor;
    }

    velocity *= airFriction;

    Vector2 positionDelta = GetVelocity() * timeFactor;
    position += positionDelta;

    isGrounded = false;
    game.HandleCollisions(this);

    if (std::abs(velocity.x) < EPSILON) {
        velocity.x = 0;
    }
    if (std::abs(velocity.y) < EPSILON) {
        velocity.y = 0;
    }

    // We are dirty if velocity changed last frame
    //    or position changed significantly
    if (position - positionDelta != lastFramePosition || velocity != lastFrameVelocity) {
        SetDirty(true);
    }

    lastFrameVelocity = velocity;
    lastFramePosition = position;
}

void Object::ResolveCollision(const Vector2& difference) {
    // if (isStatic) return;
    // TODO: this collision difference really should be negated
    if (std::isnan(difference.x) || std::isnan(difference.y)) {
        LOG_ERROR("ResolveCollision has nan difference " << difference);
        throw std::runtime_error("ResolveCollision has nan difference!");
    }
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
}

void Object::OnCollide(CollisionResult& result) {
    if (result.collidedWith->IsTagged(Tag::GROUND)) {
        isGrounded = true;
    }
}

CollisionResult Object::CollidesWith(Collider* other) {
    CollisionResult finalResult;
    for (auto& collider: colliders) {
        CollisionResult r = collider->CollidesWith(other);
        if (r.isColliding) {
            finalResult.isColliding = true;
            finalResult.collisionDifference += r.collisionDifference;
        }
    }
    return finalResult;
}

CollisionResult Object::CollidesWith(Object* other) {
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

CollisionResult Object::CollidesWith(const Vector2& p1, const Vector2& p2) {
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
    obj.Key("id");
    obj.Uint(id);

    obj.Key("t");
    obj.String(GetClass());

    obj.Key("p");
    obj.StartObject();
    position.Serialize(obj);
    obj.EndObject();

    obj.Key("v");
    obj.StartObject();
    velocity.Serialize(obj);
    obj.EndObject();

    obj.Key("z");
    obj.Int(z);

// The below isn't really used for client rendering
#ifdef BUILD_SERVER
    obj.Key("af");
    obj.StartObject();
    airFriction.Serialize(obj);
    obj.EndObject();

    obj.Key("s");
    obj.Bool(isStatic);

    obj.Key("ig");
    obj.Bool(isGrounded);

    obj.Key("ta");
    obj.Uint64(tags);

    obj.Key("ce");
    obj.Uint64(collideExclusion);
#endif

    obj.Key("c");
    obj.StartArray();
    for (auto& collider : colliders) {
        obj.StartObject();
        obj.Key("p");
        obj.StartObject();
        collider->position.Serialize(obj);
        obj.EndObject();

        obj.Key("t");
        obj.Int(collider->GetType());

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
}

void Object::ProcessReplication(json& object) {
    position.ProcessReplication(object["p"]);
    velocity.ProcessReplication(object["v"]);
    airFriction.ProcessReplication(object["af"]);

    SetIsStatic(object["s"].GetBool());
    z = object["z"].GetInt();
    tags = object["ta"].GetUint64();
    isGrounded = object["ig"].GetBool();
    collideExclusion = object["ce"].GetUint64();

    if (colliders.size() != object["c"].GetArray().Size()) {
        for (auto& collider : colliders) {
            delete collider;
        }
        colliders.clear();
    }
    if (colliders.empty()) {
        // Make some
        for (json& colliderInfo : object["c"].GetArray()) {
            if (colliderInfo["t"].GetInt() == 0) {
                AddCollider(new RectangleCollider(this, Vector2::Zero, Vector2::Zero));
            }
            else if (colliderInfo["t"].GetInt() == 1) {
                AddCollider(new CircleCollider(this, Vector2::Zero, 0));
            }
        }
    }
    size_t i = 0;
    for (json& colliderInfo : object["c"].GetArray()) {
        colliders[i]->position.ProcessReplication(colliderInfo["p"]);
        if (colliderInfo["t"].GetInt() == 0) {
            static_cast<RectangleCollider*>(colliders[i])->ProcessReplication(colliderInfo);
        }
        else if (colliderInfo["t"].GetInt() == 1) {
            static_cast<CircleCollider*>(colliders[i])->ProcessReplication(colliderInfo);
        }
        i += 1;
    }

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
}