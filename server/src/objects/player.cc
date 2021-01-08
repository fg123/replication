#include "player.h"
#include "collision.h"
#include "game.h"
#include "logging.h"
#include "floating-text.h"

static const int LEFT_MOUSE_BUTTON = 1;
static const int A_KEY = 65;
static const int S_KEY = 83;
static const int D_KEY = 68;
static const int F_KEY = 70;
static const int R_KEY = 82;
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
    { R_KEY, 5 },
    { Q_KEY, 6 },
    { Z_KEY, 7 },
    { W_KEY, 8 },
    { SPACE_KEY, 9 }
};

PlayerObject::PlayerObject(Game& game) : PlayerObject(game, Vector2::Zero) {
}

PlayerObject::PlayerObject(Game& game, Vector2 position) : Object(game) {
    airFriction.x = 0.8;

    SetTag(Tag::PLAYER);
    SetPosition(position);

    collisionExclusion |= (uint64_t) Tag::PLAYER;

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
        #ifdef BUILD_SERVER
            Time clientTime = lastClientInputTime + (ticksSinceLastProcessed * TickInterval);
        #else
            Time clientTime = time;
        #endif

        // if (GetVelocity().Length() > 1.0) {
        //     LOG_DEBUG(clientTime << ": " << GetPosition());
        // }

        std::scoped_lock lock(socketDataMutex);

        while (inputBuffer.size() > 0) {
            JSONDocument& front = inputBuffer.front();
            Time firstTime = front["time"].GetUint();
            // LOG_DEBUG("First " << firstTime << " client Time " << clientTime);
            if (firstTime == clientTime) {
                ProcessInputData(front);
                inputBuffer.pop();
            }
            else if (firstTime < clientTime) {
                // LOG_DEBUG("Input in the past! " << firstTime << " < " << clientTime);
                ProcessInputData(front);
                inputBuffer.pop();
            }
            else {
                break;
            }
        }
    }
    Vector2 velocity = GetVelocity();

    if (keyboardState[KEY_MAP[A_KEY]]) {
        velocity.x = -500;
    }

    if (keyboardState[KEY_MAP[D_KEY]]) {
        velocity.x = 500;
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
        if (keyboardState[KEY_MAP[R_KEY]]) {
            if (!lastKeyboardState[KEY_MAP[R_KEY]]) {
                currentWeapon->StartReload(time);
            }
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

void PlayerObject::Serialize(JSONWriter& obj) {
    // LOG_DEBUG("Player Object Serialize - Start");
    Object::Serialize(obj);
    obj.Key("h");
    obj.Int(health);

    obj.Key("aa");
    obj.Double(aimAngle);

    if (currentWeapon) {
        obj.Key("w");
        obj.Uint(currentWeapon->GetId());
    }
    if (qWeapon) {
        obj.Key("wq");
        obj.Uint(qWeapon->GetId());
    }
    if (zWeapon) {
        obj.Key("wz");
        obj.Uint(zWeapon->GetId());
    }
    obj.Key("kb");
    obj.StartArray();
    for (const bool &kb : keyboardState) {
        obj.Bool(kb);
    }
    obj.EndArray();
    // LOG_DEBUG("Player Object Serialize - End");
}

void PlayerObject::ProcessReplication(json& obj) {
    Object::ProcessReplication(obj);
    {
        std::scoped_lock lock(socketDataMutex);
        while (!inputBuffer.empty()) {
            inputBuffer.pop();
        }
    }
    health = obj["h"].GetInt();
    aimAngle = obj["aa"].GetDouble();
    if (obj.HasMember("w")) {
        currentWeapon = game.GetObject<WeaponObject>(obj["w"].GetUint());
    }
    else {
        currentWeapon = nullptr;
    }
    if (obj.HasMember("wq")) {
        qWeapon = game.GetObject<WeaponObject>(obj["wq"].GetUint());
    }
    else {
        qWeapon = nullptr;
    }
    if (obj.HasMember("wz")) {
        zWeapon = game.GetObject<WeaponObject>(obj["wz"].GetUint());
    }
    else {
        zWeapon = nullptr;
    }
    size_t i = 0;
    for (const json &kb : obj["kb"].GetArray()) {
        keyboardState[i] = kb.GetBool();
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
    game.QueueAnimation(new FloatingTextAnimation(GetPosition(), "-" + std::to_string(damage), "red"));
    if (health <= 0) {
        ObjectID id = GetId();
        game.DestroyObject(id);
    }
#endif
    OnTakeDamage(damage);
}

void PlayerObject::OnInput(const JSONDocument& obj) {
    std::scoped_lock lock(socketDataMutex);
    inputBuffer.emplace();
    inputBuffer.back().CopyFrom(obj, inputBuffer.back().GetAllocator());
}

void PlayerObject::ProcessInputData(const JSONDocument& obj) {
    // if (obj["event"] != "mm") {
    //     // Happens too often!
    //     LOG_DEBUG("Process Input Data: [" << obj["time"].GetUint64()
    //                 << "] " << obj["event"].GetString());
    // }
    if (obj["event"] == "ku") {
        int key = obj["key"].GetInt();
        if (KEY_MAP.find(key) != KEY_MAP.end()) {
            keyboardState[KEY_MAP[key]] = false;
        }
    }
    else if (obj["event"] == "kd") {
        int key = obj["key"].GetInt();
        if (KEY_MAP.find(key) != KEY_MAP.end()) {
            keyboardState[KEY_MAP[key]] = true;
        }
    }
    else if (obj["event"] == "mm") {
        mousePosition.x = obj["x"].GetDouble();
        mousePosition.y = obj["y"].GetDouble();
    }
    else if (obj["event"] == "md") {
        int button = obj["button"].GetInt();
        if (button >= 0 && button < 5) {
            mouseState[button] = true;
        }
    }
    else if (obj["event"] == "mu") {
        int button = obj["button"].GetInt();
        if (button >= 0 && button < 5) {
            mouseState[button] = false;
        }
    }
    #ifdef BUILD_SERVER
        // LOG_DEBUG("Setting last client input time: " << obj["time"]);
        // TODO: assert this is monotonically growing
        lastClientInputTime = obj["time"].GetUint64();
        ticksSinceLastProcessed = 0;
    #endif
}

Vector2 PlayerObject::GetAttachmentPoint() const {
    return GetPosition() + GetAimDirection().Normalize() * 20.0;
}