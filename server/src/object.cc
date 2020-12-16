#include "object.h"
#include "game.h"

#include "json/json.hpp"

static const double GRAVITY = 3000;
static const double AIR_FRICTION = 0.90;

Time Object::DeltaTime(Time currentTime) {
    if (lastTickTime == 0) {
        lastTickTime = currentTime;
        return 0;
    }
    Time delta = currentTime - lastTickTime;
    lastTickTime = currentTime;
    return delta;
}

Object::Object(Game& game) : game(game) {
    id = game.RequestId(this);
}

Object::~Object() {
    for (auto& collider : colliders) {
        delete collider;
    }
}

void Object::Tick(Time time) {
    // Always replicate for now
    SetDirty(true);

    if (isStatic) return;

    Time delta = DeltaTime(time);
    // Apply Physics
    double timeFactor = delta / 1000.0;

    if (!isStatic) {
        velocity.y += GRAVITY * timeFactor;
    }

    velocity.x *= AIR_FRICTION;
    //velocity.y *= AIR_FRICTION;

    Vector2 positionDelta = velocity * timeFactor;
    position += positionDelta;

    isGrounded = false;
    game.HandleCollisions(this);        
}

void Object::ResolveCollision(const CollisionResult& result) {
    if (result.collidedWith->IsTagged(Tag::GROUND)) {
        isGrounded = true;
    }
    // TODO: this collision difference really should be negated
    position -= result.collisionDifference;
    // We had to adjust the collision in a certain direction.
    // If the velocity does not match the direction of resolution, do nothing
    // If it does, we need to clamp it to zero.
    // This is kinda wonky and unintuitive because you decided to do -=
    //   collisionDifference, changing it around requires changing the 
    //   calculations for collisionDifference in the collision subroutines
    if (SameSign(result.collisionDifference.x, velocity.x)) {
        velocity.x = 0;
    }
    if (SameSign(result.collisionDifference.y, velocity.y)) {
        velocity.y = 0;
    }
}

CollisionResult Object::CollidesWith(Object* other) {
    for (auto& collider: colliders) {
        for (auto& colliderOther: other->colliders) {
            CollisionResult r = collider->CollidesWith(colliderOther);
            if (r.isColliding) {
                return r;
            }
        }
    }
    return CollisionResult();
}

void Object::Serialize(json& obj) {
    obj["id"] = id;
    obj["t"] = GetClass();
    position.Serialize(obj["p"]);
    velocity.Serialize(obj["v"]);
    obj["s"] = isStatic;

    obj["tags"] = tags;

    for (auto& collider : colliders) {
        json colliderObj;
        collider->position.Serialize(colliderObj["p"]);
        colliderObj["t"] = collider->GetType();
        collider->Serialize(colliderObj);
        obj["c"].push_back(colliderObj);
    }
}

void Object::ProcessReplication(json& object) {
    SetPosition(Vector2(object["p"]["x"], object["p"]["y"]));
    SetVelocity(Vector2(object["v"]["x"], object["v"]["y"]));
    SetIsStatic(object["s"]);

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