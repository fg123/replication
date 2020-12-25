#include "player.h"
#include "collision.h"
#include "game.h"
#include "logging.h"

static const int LEFT_MOUSE_BUTTON = 1;
static const int A_KEY = 65;
static const int S_KEY = 83;
static const int D_KEY = 68;
static const int F_KEY = 70;
static const int G_KEY = 71;
static const int Q_KEY = 81;
static const int Z_KEY = 90;
static const int W_KEY = 87;
static const int SPACE_KEY = 32;

PlayerObject::PlayerObject(Game& game) : PlayerObject(game, Vector2::Zero) {
    airFriction.x = 0.9;
}

PlayerObject::PlayerObject(Game& game, Vector2 position) : Object(game) {
    SetTag(Tag::PLAYER);
    SetPosition(position);

    AddCollider(new CircleCollider(this, Vector2(0, -15), 15.0));
    AddCollider(new RectangleCollider(this, Vector2(-15, -5), Vector2(30, 33)));
}

void PlayerObject::OnDeath() {
    // This calls before you get destructed, but client will already know you're
    //   dead (but you don't actually get GCed until next tick)
    if (currentWeapon) {
        game.DestroyObject(currentWeapon->GetId());
        currentWeapon->Detach();
        currentWeapon = nullptr;
    }
    if (qWeapon) {
        game.DestroyObject(qWeapon->GetId());
        qWeapon->Detach();
        qWeapon = nullptr;
    }
    if (zWeapon) {
        game.DestroyObject(zWeapon->GetId());
        zWeapon->Detach();
        zWeapon = nullptr;
    }

#ifdef BUILD_SERVER
    // Notify game so it can replace a new character
    game.OnPlayerDead(this);
#endif
}

PlayerObject::~PlayerObject() {
    
}

Vector2 PlayerObject::GetAimDirection() const {
    return Vector2(std::cos(aimAngle), std::sin(aimAngle));
}

void PlayerObject::PickupWeapon(WeaponObject* weapon) {
    weapon->AttachToPlayer(this);
    currentWeapon = weapon;
}

void PlayerObject::Tick(Time time)  {
    std::scoped_lock lock(socketDataMutex);
    Vector2 velocity = GetVelocity();
    if (keyboardState[A_KEY]) {
        velocity.x = -200;
    }
    if (keyboardState[D_KEY]) {
        velocity.x = 200;
    }
    // if (keyboardState[G_KEY]) {
    //     DropWeapon();
    // }
    if (keyboardState[W_KEY] || keyboardState[SPACE_KEY]) {
        // Can only jump if touching ground
        if (IsGrounded()) {
            velocity.y = -600;
        }
        // velocity.y = -300;
    }
    SetVelocity(velocity);

    if (currentWeapon) {
        if (mouseState[LEFT_MOUSE_BUTTON]) {
            if (!lastMouseState[LEFT_MOUSE_BUTTON]) {
                currentWeapon->StartFire(time);
            }
            currentWeapon->Fire(time);
        }
        else if (lastMouseState[LEFT_MOUSE_BUTTON]) {
            currentWeapon->ReleaseFire(time);
        }
    }
    if (qWeapon) {
        if (keyboardState[Q_KEY]) {
            if (!lastKeyboardState[Q_KEY]) {
                qWeapon->StartFire(time);
            }
            qWeapon->Fire(time);
        }
        else if (lastKeyboardState[Q_KEY]) {
            qWeapon->ReleaseFire(time);
        }
    }
    if (zWeapon) {
        if (keyboardState[Z_KEY]) {
            if (!lastKeyboardState[Z_KEY]) {
                zWeapon->StartFire(time);
            }
            zWeapon->Fire(time);
        }
        else if (lastKeyboardState[Z_KEY]) {
            zWeapon->ReleaseFire(time);
        }
    }
    const Vector2& position = GetPosition();

    aimAngle = std::atan2(mousePosition.y - position.y, mousePosition.x - position.x);

    Object::Tick(time);

    if (currentWeapon) {
        currentWeapon->SetPosition(GetAttachmentPoint());
    }

    if (zWeapon) {
        zWeapon->SetPosition(GetAttachmentPoint());
    }

    if (qWeapon) {
        qWeapon->SetPosition(GetAttachmentPoint());
    }

    lastMouseState = mouseState;
    lastKeyboardState = keyboardState;
}

void PlayerObject::Serialize(json& obj) {
    Object::Serialize(obj);
    obj["h"] = health;
    obj["aa"] = aimAngle;
    mousePosition.Serialize(obj["mp"]);
    if (currentWeapon) {
        obj["w"] = currentWeapon->GetId();
    }
    if (qWeapon) {
        obj["wq"] = qWeapon->GetId();
    }
    if (zWeapon) {
        obj["wz"] = zWeapon->GetId();
    }
}

void PlayerObject::ProcessReplication(json& obj) {
    Object::ProcessReplication(obj);
    health = obj["h"];
    aimAngle = obj["aa"];
    mousePosition.ProcessReplication(obj["mp"]);
    if (obj.contains("w")) {
        currentWeapon = game.GetObject<WeaponObject>(obj["w"]);
    }
    else {
        currentWeapon = nullptr;
    }
    if (obj.contains("wq")) {
        qWeapon = game.GetObject<WeaponObject>(obj["wq"]);
    }
    else {
        qWeapon = nullptr;
    }
    if (obj.contains("wz")) {
        zWeapon = game.GetObject<WeaponObject>(obj["wz"]);
    }
    else {
        zWeapon = nullptr;
    }
}

void PlayerObject::DropWeapon()  {
    if (currentWeapon) {
        // Throw Weapon
        currentWeapon->Detach();
        currentWeapon->SetVelocity(GetAimDirection() * 500.0);
        currentWeapon = nullptr;
        canPickupTime = game.GetGameTime() + 500;
    }
}

void PlayerObject::OnCollide(CollisionResult& result) {
    if (!currentWeapon && result.collidedWith->IsTagged(Tag::WEAPON)) {
        if (game.GetGameTime() > canPickupTime) {
            PickupWeapon(static_cast<WeaponObject*>(result.collidedWith));
        }
    }
    Object::OnCollide(result);
}

void PlayerObject::DealDamage(int damage) {
    health -= damage;
    if (health <= 0) {
        ObjectID id = GetId();
        game.DestroyObject(id);
    }
}

void PlayerObject::ProcessInputData(json& obj) {
    if (obj["event"] == "ku") {
        int key = obj["key"];
        std::scoped_lock lock(socketDataMutex);
        if (key >= 0 && key < 256) {
            keyboardState[key] = false;
        }
    }
    else if (obj["event"] == "kd") {
        int key = obj["key"];
        std::scoped_lock lock(socketDataMutex);
        if (key >= 0 && key < 256) {
            keyboardState[key] = true;
        }
    }
    else if (obj["event"] == "mm") {
        std::scoped_lock lock(socketDataMutex);
        mousePosition.x = obj["x"];
        mousePosition.y = obj["y"];
    }
    else if (obj["event"] == "md") {
        int button = obj["button"];
        std::scoped_lock lock(socketDataMutex);
        if (button >= 0 && button < 5) {
            mouseState[button] = true;
        }
    }
    else if (obj["event"] == "mu") {
        int button = obj["button"];
        std::scoped_lock lock(socketDataMutex);
        if (button >= 0 && button < 5) {
            mouseState[button] = false;
        }
    }
}

Vector2 PlayerObject::GetAttachmentPoint() const {
    return GetPosition() + GetAimDirection().Normalize() * 20.0;
}