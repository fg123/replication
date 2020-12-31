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

std::unordered_map<int, size_t> KEY_MAP = {
    { D_KEY, 0 },
    { S_KEY, 1 },
    { A_KEY, 2 },
    { F_KEY, 3 },
    { G_KEY, 4 },
    { Q_KEY, 5 },
    { Z_KEY, 6 },
    { W_KEY, 7 },
    { SPACE_KEY, 8 }
};

PlayerObject::PlayerObject(Game& game) : PlayerObject(game, Vector2::Zero) {
}

PlayerObject::PlayerObject(Game& game, Vector2 position) : Object(game) {
    airFriction.x = 0.8;

    SetTag(Tag::PLAYER);
    SetPosition(position);

    AddCollider(new CircleCollider(this, Vector2(0, -15), 15.0));
    AddCollider(new RectangleCollider(this, Vector2(-15, -5), Vector2(30, 33)));
}

void PlayerObject::OnDeath() {
    // This calls before you get destructed, but client will already know you're
    //   dead (but you don't actually get GCed until next tick)
    LOG_DEBUG("Player Death " << currentWeapon);

#ifdef BUILD_SERVER
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

void PlayerObject::Tick(Time time) {
    {
        std::scoped_lock lock(socketDataMutex);
        #ifdef BUILD_SERVER
            Time clientTime = lastClientInputTime + (ticksSinceLastProcessed * TickInterval);
        #else
            Time clientTime = time;
        #endif
        while (inputBuffer.size() > 0) {
            Time firstTime = inputBuffer.front()["time"];
            // LOG_DEBUG("First " << firstTime << " client Time " << clientTime);
            if (firstTime <= clientTime) {
                ProcessInputData(inputBuffer.front());
                inputBuffer.pop();
            }
            else {
                break;
            }
        }
    }

    Vector2 velocity = GetVelocity();

    if (keyboardState[KEY_MAP[A_KEY]]) {
        velocity.x = -300;
    }

    if (keyboardState[KEY_MAP[D_KEY]]) {
        velocity.x = 300;
    }
    // if (keyboardState[G_KEY]) {
    //     DropWeapon();
    // }
    if (keyboardState[KEY_MAP[W_KEY]] || keyboardState[KEY_MAP[SPACE_KEY]]) {
        // Can only jump if touching ground
        if (IsGrounded()) {
            // LOG_DEBUG("Applying Jump");
            velocity.y = -600;
        }
        // velocity.y = -300;
    }
    SetVelocity(velocity);
#ifdef BUILD_SERVER
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
        if (keyboardState[KEY_MAP[Q_KEY]]) {
            if (!lastKeyboardState[KEY_MAP[Q_KEY]]) {
                qWeapon->StartFire(time);
            }
            qWeapon->Fire(time);
        }
        else if (lastKeyboardState[KEY_MAP[Q_KEY]]) {
            qWeapon->ReleaseFire(time);
        }
    }
    if (zWeapon) {
        if (keyboardState[KEY_MAP[Z_KEY]]) {
            if (!lastKeyboardState[KEY_MAP[Z_KEY]]) {
                zWeapon->StartFire(time);
            }
            zWeapon->Fire(time);
        }
        else if (lastKeyboardState[KEY_MAP[Z_KEY]]) {
            zWeapon->ReleaseFire(time);
        }
    }
#endif
    Object::Tick(time);

    const Vector2& position = GetPosition();
    aimAngle = std::atan2(mousePosition.y - position.y, mousePosition.x - position.x);

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
    ticksSinceLastProcessed += 1;
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
    for (const bool &kb : keyboardState) {
        obj["kb"].push_back(kb);
    }
}

void PlayerObject::ProcessReplication(json& obj) {
    Object::ProcessReplication(obj);
    {
        std::scoped_lock lock(socketDataMutex);
        while (!inputBuffer.empty()) {
            inputBuffer.pop();
        }
    }
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
    size_t i = 0;
    for (const json &kb : obj["kb"]) {
        keyboardState[i] = kb;
        i++;
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
#ifdef BUILD_SERVER
    if (health <= 0) {
        ObjectID id = GetId();
        game.DestroyObject(id);
    }
#endif
}

void PlayerObject::OnInput(json& obj) {
    std::scoped_lock lock(socketDataMutex);
    // LOG_DEBUG("Processing input " << obj["time"]);
    inputBuffer.push(obj);
}

void PlayerObject::ProcessInputData(json& obj) {
    if (obj["event"] == "ku") {
        int key = obj["key"];
        if (KEY_MAP.find(key) != KEY_MAP.end()) {
            keyboardState[KEY_MAP[key]] = false;
        }
    }
    else if (obj["event"] == "kd") {
        int key = obj["key"];
        if (KEY_MAP.find(key) != KEY_MAP.end()) {
            keyboardState[KEY_MAP[key]] = true;
        }
    }
    else if (obj["event"] == "mm") {
        mousePosition.x = obj["x"];
        mousePosition.y = obj["y"];
    }
    else if (obj["event"] == "md") {
        int button = obj["button"];
        if (button >= 0 && button < 5) {
            mouseState[button] = true;
        }
    }
    else if (obj["event"] == "mu") {
        int button = obj["button"];
        if (button >= 0 && button < 5) {
            mouseState[button] = false;
        }
    }
    #ifdef BUILD_SERVER
        // LOG_DEBUG("Setting last client input time: " << obj["time"]);
        // TODO: assert this is monotonically growing
        lastClientInputTime = obj["time"];
        ticksSinceLastProcessed = 0;
    #endif
}

Vector2 PlayerObject::GetAttachmentPoint() const {
    return GetPosition() + GetAimDirection().Normalize() * 20.0;
}