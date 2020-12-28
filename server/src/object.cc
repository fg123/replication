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
    SetDirty(true);
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

void Object::Serialize(json& obj) {
    obj["id"] = id;
    obj["t"] = GetClass();
    position.Serialize(obj["p"]);
    velocity.Serialize(obj["v"]);
    airFriction.Serialize(obj["af"]);
    obj["s"] = isStatic;
    obj["z"] = z;
    obj["ig"] = isGrounded;

    obj["ta"] = tags;
    obj["ce"] = collideExclusion;

    for (auto& collider : colliders) {
        json colliderObj;
        collider->position.Serialize(colliderObj["p"]);
        colliderObj["t"] = collider->GetType();
        collider->Serialize(colliderObj);
        obj["c"].push_back(colliderObj);
    }
}

void Object::ProcessReplication(json& object) {
    position.ProcessReplication(object["p"]);
    velocity.ProcessReplication(object["v"]);
    airFriction.ProcessReplication(object["af"]);

    SetIsStatic(object["s"]);
    z = object["z"];
    tags = object["ta"];
    isGrounded = object["ig"];
    collideExclusion = object["ce"];

    if (colliders.size() != object["c"].size()) {
        for (auto& collider : colliders) {
            delete collider;
        }
        colliders.clear();
    }
    if (colliders.empty()) {
        // Make some
        for (json& colliderInfo : object["c"]) {
            if (colliderInfo["t"] == 0) {
                AddCollider(new RectangleCollider(this, Vector2::Zero, Vector2::Zero));
            }
            else if (colliderInfo["t"] == 1) {
                AddCollider(new CircleCollider(this, Vector2::Zero, 0));
            }
        }
    }
    size_t i = 0;
    for (json& colliderInfo : object["c"]) {
        colliders[i]->position.ProcessReplication(colliderInfo["p"]);
        if (colliderInfo["t"] == 0) {
            static_cast<RectangleCollider*>(colliders[i])->ProcessReplication(colliderInfo);
        }
        else if (colliderInfo["t"] == 1) {
            static_cast<CircleCollider*>(colliders[i])->ProcessReplication(colliderInfo);
        }
        i += 1;
    }
}