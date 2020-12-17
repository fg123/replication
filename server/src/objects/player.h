#ifndef PLAYER_OBJECT_H
#define PLAYER_OBJECT_H

#include "object.h"
#include "vector.h"
#include "weapon.h"

#include <mutex>
#include <unordered_set>

class Game;
class PlayerObject : public Object {
    int health = 100;

    // in Radians
    double aimAngle = 0;

    WeaponObject* currentWeapon = nullptr;
    
    Time canPickupTime = 0;
public:
    std::mutex socketDataMutex;
    std::unordered_set<std::string> keyboardState;
    Vector2 mousePosition;

    PlayerObject(Game& game, Vector2 position);
    ~PlayerObject();

    virtual void OnDeath() override;
    virtual void Tick(Time time) override;
    virtual const char* GetClass() override { return "Marine"; }
    virtual void Serialize(json& obj) override;
    virtual void OnCollide(CollisionResult& result) override;

    void PickupWeapon(WeaponObject* weapon);
    void DropWeapon();
};

#endif