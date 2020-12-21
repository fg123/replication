#ifndef PLAYER_OBJECT_H
#define PLAYER_OBJECT_H

#include "object.h"
#include "vector.h"
#include "weapons/weapon.h"

#include <mutex>
#include <unordered_set>

class Game;
class PlayerObject : public Object {
protected:
    int health = 100;

    // in Radians
    double aimAngle = 0;

    WeaponObject* currentWeapon = nullptr;
    WeaponObject* qWeapon = nullptr;
    WeaponObject* zWeapon = nullptr;

    Time canPickupTime = 0;
public:

    std::mutex socketDataMutex;
    std::array<bool, 256> keyboardState {};
    std::array<bool, 256> lastKeyboardState {};

    std::array<bool, 5> mouseState {};
    std::array<bool, 5> lastMouseState {};

    Vector2 mousePosition;

    PlayerObject(Game& game);
    PlayerObject(Game& game, Vector2 position);
    ~PlayerObject();

    virtual void OnDeath() override;
    virtual void Tick(Time time) override;
    virtual void Serialize(json& obj) override;
    virtual void ProcessReplication(json& obj) override;
    virtual void OnCollide(CollisionResult& result) override;
    
    void ProcessInputData(json& obj);

    WeaponObject* GetWeapon() { return currentWeapon; }
    void PickupWeapon(WeaponObject* weapon);
    void DropWeapon();

    void DealDamage(int damage);

    Vector2 GetAimDirection() const;
    Vector2 GetAttachmentPoint() const;
};


#endif