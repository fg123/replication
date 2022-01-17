#pragma once

#include "scriptable-object.h"
#include "vector.h"
#include "inventory.h"
#include "object-reference.h"
#include "weapons/weapon.h"

#include <mutex>
#include <unordered_set>
#include <queue>

class Game;

static const Vector3 RESPAWN_LOCATION = Vector3(-5, 5, -30);

struct PlayerSettings : public Replicable {
    REPLICATED_D(float, sensitivity, "sensitivity", 1.0f);
};

class PlayerObject : public ScriptableObject {
    void TryPickupItem();
    ObjectReference<WeaponObject> ScanPotentialWeapon();

protected:
    REPLICATED_D(float, health, "h", 100);

    // Yaw Pitch in degrees
    REPLICATED_D(float, rotationYaw, "ry", 0.0f);
    REPLICATED_D(float, rotationPitch, "rp", 0.0f);

    #ifdef BUILD_CLIENT
        float clientRotationYaw = 0.0f;
        float clientRotationPitch = 0.0f;
    #endif

    REPLICATED(Vector3, inputVelocity, "iv");
    REPLICATED(Vector3, inputAcceleration, "ia");

public:

#ifdef BUILD_CLIENT
    ObjectReference<Object> pointedToObject;
#endif

    PlayerSettings playerSettings;

    Time lastPickupTime = 0;

    REPLICATED_D(bool, canPickup, "cpt", true);

    REPLICATED(Vector2, pitchYawVelocity, "pyv");

    ALWAYS_REPLICATED(InventoryManager, inventoryManager, "im");

    std::mutex socketDataMutex;

    std::queue<JSONDocument> inputBuffer;

    // The last input from the client (given in client frame)
    Time lastClientInputTime = 0;

    // Ticks since we processed the last client input frame
    Time ticksSinceLastProcessed = 0;

    std::array<bool, 25> keyboardState {};
    std::array<bool, 25> lastKeyboardState {};

    std::array<bool, 5> mouseState {};
    std::array<bool, 5> lastMouseState {};

    REPLICATED_D(int, mouseWheelDelta, "mwd", 0);

    ObjectReference<WeaponObject> qWeapon;
    ObjectReference<WeaponObject> zWeapon;


    CLASS_CREATE(PlayerObject);

    PlayerObject(Game& game);
    PlayerObject(Game& game, Vector3 position);
    ~PlayerObject();

    virtual void OnDeath() override;
    virtual void Tick(Time time) override;
    virtual void Serialize(JSONWriter& obj) override;
    virtual void ProcessReplication(json& obj) override;
#ifdef BUILD_CLIENT
    virtual void PreDraw(Time time) override;
    Quaternion GetClientRotationWithPitch() const {
        Matrix4 matrix;
        matrix = glm::rotate(matrix, glm::radians(clientRotationYaw), Vector::Up);
        matrix = glm::rotate(matrix, glm::radians(clientRotationPitch), Vector3(matrix[0][0], matrix[1][0], matrix[2][0]));
        return glm::quat_cast(matrix);
    }
    virtual Vector3 GetClientLookDirection() const override {
        return glm::normalize(Vector::Forward * GetClientRotationWithPitch());
    }
#endif
    virtual void OnClientCreate() override {
        ScriptableObject::OnClientCreate();
        #ifdef BUILD_CLIENT
            clientRotationYaw = rotationYaw;
            clientRotationPitch = rotationPitch;
        #endif
    }
    void OnInput(const JSONDocument& obj);
    void ProcessInputData(const JSONDocument& obj);

    WeaponObject* GetCurrentWeapon() {
        return inventoryManager.GetCurrentWeapon();
    }

    virtual Vector3 GetVelocity() override { return velocity + inputVelocity; }
    Quaternion GetRotationWithPitch() const {
        Matrix4 matrix;
        matrix = glm::rotate(matrix, glm::radians(rotationYaw), Vector::Up);
        matrix = glm::rotate(matrix, glm::radians(rotationPitch), Vector3(matrix[0][0], matrix[1][0], matrix[2][0]));
        return glm::quat_cast(matrix);
    }
    virtual Vector3 GetLookDirection() const override {
        // Regular rotation does not factor in pitch
        return glm::normalize(Vector::Forward * GetRotationWithPitch());
    }
    void PickupWeapon(WeaponObject* weapon);
    void DropWeapon(WeaponObject* weapon);

    // Client Side Call from UI
    void InventoryDrop(int id);
    void InventorySwap();
    void HolsterAllWeapons();

    void SetHealth(float health) {
        this->health = health;
    }

    void DealDamage(float damage, ObjectID from);
    void HealFor(int damage);

    // TODO: add damage source
    virtual void OnTakeDamage(float damage) {
        script.CallMemberFunction("OnTakeDamage", damage);
    }

    Vector3 GetLeftAttachmentPoint() const;
    Vector3 GetRightAttachmentPoint() const;
    Vector3 GetCenterAttachmentPoint() const;

    Vector3 GetAttachmentPoint(WeaponAttachmentPoint attachmentPoint) const;

    void SetWeaponSlot(ObjectReference<WeaponObject>& weaponSlot, ObjectID newWeapon);
    // #ifdef BUILD_CLIENT
    // // Don't show rotation on client
    // const Matrix4 GetTransform() override {
    //     return glm::translate(clientPosition) * glm::scale(scale);
    // }
    // #endif
};

CLASS_REGISTER(PlayerObject);