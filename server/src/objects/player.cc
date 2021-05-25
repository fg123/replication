#include "player.h"
#include "collision.h"
#include "game.h"
#include "logging.h"
#include "floating-text.h"

static const int LEFT_MOUSE_BUTTON = 1;
static const int RIGHT_MOUSE_BUTTON = 3;
static const int A_KEY = 65;
static const int S_KEY = 83;
static const int D_KEY = 68;
static const int F_KEY = 70;
static const int V_KEY = 86;
static const int R_KEY = 82;
static const int G_KEY = 71;
static const int Q_KEY = 81;
static const int Z_KEY = 90;
static const int W_KEY = 87;
static const int K_KEY = 75;
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
    { SPACE_KEY, 9 },
    { K_KEY, 10 },
    { V_KEY, 11 }
};

PlayerObject::PlayerObject(Game& game) : PlayerObject(game, Vector3()) {
}

PlayerObject::PlayerObject(Game& game, Vector3 position) : Object(game),
    inventoryManager(game, this) {
    SetTag(Tag::PLAYER);

    SetTag(Tag::NO_GRAVITY);

    SetPosition(position);

    collisionExclusion |= (uint64_t) Tag::PLAYER;

    SetModel(game.GetModel("NewPlayer.obj"));
    // GenerateOBBCollidersFromModel(this);
    AddCollider(new SphereCollider(this, Vector3(0, 0, 0), 0.25f));
    AddCollider(new OBBCollider(this, Vector3(-0.375, -1.6, -0.125), Vector3(0.75, 1.30, 0.25)));
    SetScale(Vector3(1, 1, 1));
}

void PlayerObject::OnDeath() {
    // This calls before you get destructed, but client will already know you're
    //   dead (but you don't actually get GCed until next tick)
    LOG_DEBUG("Player Death " << GetCurrentWeapon());

#ifdef BUILD_SERVER
    inventoryManager.ClearInventory();
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

void PlayerObject::PickupWeapon(WeaponObject* weapon) {
    if (inventoryManager.CanPickup(weapon)) {
        inventoryManager.Pickup(weapon);
    }
}

void PlayerObject::InventoryDrop(int id) {
    inventoryManager.Drop(id);
}

void PlayerObject::Tick(Time time) {
    {
        #ifdef BUILD_SERVER
            Time clientTime = lastClientInputTime + (ticksSinceLastProcessed * TickInterval);
        #else
            Time clientTime = time;
        #endif

        // if (glm::length(GetVelocity()) > 0.01) {
        //     LOG_DEBUG(clientTime << ": " << GetPosition());
        // }
        // LOG_DEBUG("Input Vel " << inputVelocity);
        // LOG_DEBUG("Regular Vel " << velocity);
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
    Vector3 leftRightComponent;
    Vector3 forwardBackwardComponent;
    Vector3 upDownComponent;

    bool hasMovement = false;

    if (keyboardState[KEY_MAP[A_KEY]]) {
        leftRightComponent = Vector::Left * rotation;
        hasMovement = true;
    }
    if (keyboardState[KEY_MAP[D_KEY]]) {
        leftRightComponent = -Vector::Left * rotation;
        hasMovement = true;
    }
    if (keyboardState[KEY_MAP[W_KEY]]) {
        forwardBackwardComponent = Vector::Forward * rotation;
        hasMovement = true;
    }
    if (keyboardState[KEY_MAP[S_KEY]]) {
        forwardBackwardComponent = -Vector::Forward * rotation;
        hasMovement = true;
    }
    if (IsTagged(Tag::NO_GRAVITY)) {
        if (keyboardState[KEY_MAP[F_KEY]]) {
            upDownComponent = Vector::Up;
            hasMovement = true;
        }
        if (keyboardState[KEY_MAP[V_KEY]]) {
            upDownComponent = -Vector::Up;
            hasMovement = true;
        }
    }

    // TODO: move speed
    if (hasMovement) {
        if (!IsTagged(Tag::NO_GRAVITY)) {
            leftRightComponent.y = 0;
            forwardBackwardComponent.y = 0;
        }
        inputVelocity = glm::normalize(leftRightComponent +
            forwardBackwardComponent + upDownComponent) * 8.0f;
    }
    else {
        inputVelocity *= 0.8;
        if (glm::length(inputVelocity) < 0.01) {
            inputVelocity = Vector3(0);
        }
    }

    if (keyboardState[KEY_MAP[K_KEY]]) {
        if (!lastKeyboardState[KEY_MAP[K_KEY]]) {
            DealDamage(100, GetId());
        }
    }
    if (keyboardState[KEY_MAP[G_KEY]] && !lastKeyboardState[KEY_MAP[G_KEY]]) {
        DropWeapon(GetCurrentWeapon());
    }
    if (keyboardState[KEY_MAP[SPACE_KEY]]) {
        // Can only jump if touching ground
        if (IsGrounded()) {
            // LOG_DEBUG("Applying Jump");
            velocity.y = 10;
        }
        // velocity.y = -300;
    }

    WeaponObject* currentWeapon = inventoryManager.GetCurrentWeapon();
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

        if (mouseState[RIGHT_MOUSE_BUTTON]) {
            if (!lastMouseState[RIGHT_MOUSE_BUTTON]) {
                currentWeapon->StartAlternateFire(time);
            }
        }
        else if (lastMouseState[RIGHT_MOUSE_BUTTON]) {
            currentWeapon->ReleaseAlternateFire(time);
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

    rotationPitch += pitchYawVelocity.x;
    rotationYaw += pitchYawVelocity.y;
    rotationPitch = std::fmod(rotationPitch, 360);
    rotationYaw = std::fmod(rotationYaw, 360);

    pitchYawVelocity *= 0.8;

    Matrix4 matrix;
    matrix = glm::rotate(matrix, glm::radians(rotationYaw), Vector::Up);
    // matrix = glm::rotate(matrix, glm::radians(rotationPitch), Vector3(matrix[0][0], matrix[1][0], matrix[2][0]));
    rotation = glm::quat_cast(matrix);

    Object::Tick(time);

    lastMouseState = mouseState;
    lastKeyboardState = keyboardState;
    ticksSinceLastProcessed += 1;
    isDirty = true;
    // LOG_DEBUG("Position: " << position << " Velocity: " << GetVelocity());
}

void PlayerObject::Serialize(JSONWriter& obj) {
    // LOG_DEBUG("Player Object Serialize - Start");
    Object::Serialize(obj);
    obj.Key("h");
    obj.Int(health);

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

    obj.Key("ms");
    obj.StartArray();
    for (const bool &ms : mouseState) {
        obj.Bool(ms);
    }
    obj.EndArray();

#ifdef BUILD_CLIENT
    obj.Key("client_p");
    Vector3 cp = GetClientPosition();
    SerializeDispatch(cp, obj);

    obj.Key("ld");
    Vector3 ld = GetLookDirection();
    SerializeDispatch(ld, obj);

    if (WeaponObject* currentWeapon = GetCurrentWeapon()) {
        obj.Key("w");
        obj.Uint(currentWeapon->GetId());
    }
#endif

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
    i = 0;
    for (const json &ms : obj["ms"].GetArray()) {
        mouseState[i] = ms.GetBool();
        i++;
    }
}

void PlayerObject::DropWeapon(WeaponObject* weapon)  {
    inventoryManager.Drop(weapon);
}

void PlayerObject::OnCollide(CollisionResult& result) {
    if (result.collidedWith->IsTagged(Tag::WEAPON)) {
        if (game.GetGameTime() > canPickupTime) {
            PickupWeapon(static_cast<WeaponObject*>(result.collidedWith));
        }
    }
    Object::OnCollide(result);
}

void PlayerObject::DealDamage(int damage, ObjectID from) {
    game.PlayAudio("ueh.wav", 1.0f, this);
#ifdef BUILD_SERVER
    health -= damage;
    game.QueueAnimation(new FloatingTextAnimation(from,
        GetPosition(), std::to_string(damage), "#FFF"));
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
        double moveX = obj["x"].GetDouble();
        double moveY = obj["y"].GetDouble();
        rotationYaw += moveX / 10;
        rotationPitch -= moveY / 10;
        rotationPitch = glm::clamp(rotationPitch, -89.f, 89.f);
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

Vector3 PlayerObject::GetRightAttachmentPoint() const {
    Vector3 left = glm::normalize(Vector::Left * rotation);
    // Vector3 up = glm::normalize(Vector::Up * rotation);

    return GetPosition()
        - left * 0.5f
        + GetLookDirection() * 1.0f;
}

Vector3 PlayerObject::GetLeftAttachmentPoint() const {
    Vector3 left = glm::normalize(Vector::Left * rotation);
    // Vector3 up = glm::normalize(Vector::Up * rotation);

    return GetPosition()
        + left * 0.5f
        + GetLookDirection() * 1.0f;
}

Vector3 PlayerObject::GetCenterAttachmentPoint() const {
    Vector3 up = glm::normalize(Vector::Up * rotation);

    return GetPosition() +
        + GetLookDirection() * 1.0f;
}


Vector3 PlayerObject::GetAttachmentPoint(WeaponAttachmentPoint attachmentPoint) const {
    if (attachmentPoint == WeaponAttachmentPoint::LEFT)
        return GetLeftAttachmentPoint();
    else if (attachmentPoint == WeaponAttachmentPoint::RIGHT)
        return GetRightAttachmentPoint();
    else
        return GetCenterAttachmentPoint();
}