#ifndef PLAYER_OBJECT_H
#define PLAYER_OBJECT_H

#include "object.h"
#include "vector.h"
#include "weapons/weapon.h"

#include <mutex>
#include <unordered_set>
#include <queue>

class Game;
class PlayerObject : public Object {
protected:
    int health = 100;

    Time canPickupTime = 0;

    // Yaw Pitch in degrees
    REPLICATED_D(float, rotationYaw, "ry", 0.0f);
    REPLICATED_D(float, rotationPitch, "rp", 0.0f);

    Vector3 inputVelocity;

public:
    WeaponObject* currentWeapon = nullptr;
    WeaponObject* qWeapon = nullptr;
    WeaponObject* zWeapon = nullptr;

    std::mutex socketDataMutex;

    std::queue<JSONDocument> inputBuffer;

    // The last input from the client (given in client frame)
    Time lastClientInputTime = 0;

    // Ticks since we processed the last client input frame
    Time ticksSinceLastProcessed = 0;

    std::array<bool, 11> keyboardState {};
    std::array<bool, 11> lastKeyboardState {};

    std::array<bool, 5> mouseState {};
    std::array<bool, 5> lastMouseState {};

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

    WeaponObject* GetWeapon() { return currentWeapon; }
    virtual Vector3 GetVelocity() override { return velocity + inputVelocity; }
    void PickupWeapon(WeaponObject* weapon);
    void DropWeapon();

    void DealDamage(int damage);

    // TODO: add damage source
    virtual void OnTakeDamage(int damage) {};

    Vector3 GetAttachmentPoint() const;

    // #ifdef BUILD_CLIENT
    // // Don't show rotation on client
    // const Matrix4 GetTransform() override {
    //     return glm::translate(clientPosition) * glm::scale(scale);
    // }
    // #endif

};


#endif