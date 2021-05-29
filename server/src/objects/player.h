#pragma once

#include "object.h"
#include "vector.h"
#include "inventory.h"
#include "weapons/weapon.h"

#include <mutex>
#include <unordered_set>
#include <queue>

class Game;

class PlayerObject : public Object {
protected:
    int health = 100;

    // Yaw Pitch in degrees
    REPLICATED_D(float, rotationYaw, "ry", 0.0f);
    REPLICATED_D(float, rotationPitch, "rp", 0.0f);

    REPLICATED(Vector3, inputVelocity, "iv");

public:
    Time lastPickupTime = 0;

    REPLICATED_D(bool, canPickup, "cpt", true);

    REPLICATED(Vector2, pitchYawVelocity, "pyv");

    REPLICATED(InventoryManager, inventoryManager, "im");

    WeaponObject* qWeapon = nullptr;
    WeaponObject* zWeapon = nullptr;

    std::mutex socketDataMutex;

    std::queue<JSONDocument> inputBuffer;

    // The last input from the client (given in client frame)
    Time lastClientInputTime = 0;

    // Ticks since we processed the last client input frame
    Time ticksSinceLastProcessed = 0;

    std::array<bool, 20> keyboardState {};
    std::array<bool, 20> lastKeyboardState {};

    std::array<bool, 5> mouseState {};
    std::array<bool, 5> lastMouseState {};

    REPLICATED_D(int, mouseWheelDelta, "mwd", 0);

    PlayerObject(Game& game);
    PlayerObject(Game& game, Vector3 position);
    ~PlayerObject();

    virtual void OnDeath() override;
    virtual void Tick(Time time) override;
    virtual void Serialize(JSONWriter& obj) override;
    virtual void ProcessReplication(json& obj) override;
    virtual void OnCollide(CollisionResult& result) override;

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

    void DealDamage(int damage, ObjectID from);

    // TODO: add damage source
    virtual void OnTakeDamage(int damage) {};

    Vector3 GetLeftAttachmentPoint() const;
    Vector3 GetRightAttachmentPoint() const;
    Vector3 GetCenterAttachmentPoint() const;

    Vector3 GetAttachmentPoint(WeaponAttachmentPoint attachmentPoint) const;

    // #ifdef BUILD_CLIENT
    // // Don't show rotation on client
    // const Matrix4 GetTransform() override {
    //     return glm::translate(clientPosition) * glm::scale(scale);
    // }
    // #endif

};

