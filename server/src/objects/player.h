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

    CLASS_CREATE(PlayerObject)

    std::mutex socketDataMutex;
    std::unordered_set<std::string> keyboardState;
    bool mouseState[5];
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

    void PickupWeapon(WeaponObject* weapon);
    void DropWeapon();

    void DealDamage(int damage);

    Vector2 GetAimDirection() const;
};

CLASS_REGISTER(PlayerObject);

#endif