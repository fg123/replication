#pragma once

#include "replicable.h"
#include "weapons/weapon.h"

#include <unordered_set>
// Manages the inventory for a player
class PlayerObject;

class InventoryManager : public Replicable {
    Game& game;

    PlayerObject* owner;

    WeaponObject* primary = nullptr;
    WeaponObject* secondary = nullptr;

    std::vector<WeaponObject*> objects;

    WeaponObject* currentWeapon = nullptr;

public:
    InventoryManager(Game& game, PlayerObject* owner) : game(game), owner(owner) {}
    ~InventoryManager() {}

    bool CanPickup(WeaponObject* weapon);
    void Pickup(WeaponObject* weapon);
    void Drop(WeaponObject* weapon);
    void Drop(int id);

    void ClearInventory();

    WeaponObject* GetCurrentWeapon();

    void ChooseNewCurrentWeapon();

    // Events
    void EquipPrimary();
    void EquipSecondary();
    void EquipGrenade();

    void DropCurrentWeapon();

    virtual void Serialize(JSONWriter& obj) override;
    virtual void ProcessReplication(json& obj) override;

    size_t GetAmmoCount();
    size_t RemoveAmmo(int magazineSize);
    void CleanUpAmmo();
};