#include "inventory.h"
#include "player.h"
#include "game.h"
#include "objects.h"
#include "util.h"

const size_t INVENTORY_MAX_SIZE = 6;

bool InventoryManager::CanPickup(WeaponObject* weapon) {
    if (!weapon) return false;
    if (weapon->GetAttachedTo()) return false;
    if (primary == weapon || secondary == weapon ||
        Contains(objects, weapon)) return false;

    if (dynamic_cast<GunBase*>(weapon)) {
        return !primary || !secondary;
    }
    return objects.size() < INVENTORY_MAX_SIZE;
}

void InventoryManager::Pickup(WeaponObject* weapon) {
    if (dynamic_cast<GunBase*>(weapon)) {
        if (!primary) primary = weapon;
        else if (!secondary) secondary = weapon;
        else LOG_ERROR("Can't pick this up!");
    }
    else {
        objects.push_back(weapon);
    }
    weapon->AttachToPlayer(owner);
    CleanUpAmmo();
    ChooseNewCurrentWeapon();
}

void InventoryManager::Drop(int id) {
    if (id == 0) Drop(primary);
    else if (id == 1) Drop(secondary);
    else if (id == 2 && objects.size() > 0) Drop(objects[0]);
    else if (id == 3 && objects.size() > 1) Drop(objects[1]);
    else if (id == 4 && objects.size() > 2) Drop(objects[2]);
    else if (id == 5 && objects.size() > 3) Drop(objects[3]);
    else if (id == 6 && objects.size() > 4) Drop(objects[4]);
    else if (id == 7 && objects.size() > 5) Drop(objects[5]);
}

void InventoryManager::Swap() {
    WeaponObject* tmp = primary;
    primary = secondary;
    secondary = tmp;
}

void InventoryManager::Drop(WeaponObject* weapon) {
    if (!weapon) return;
    weapon->Detach();
    weapon->SetVelocity(owner->GetLookDirection() * 15.0f);
    weapon->SetRotation(Quaternion{});
    owner->lastPickupTime = game.GetGameTime();
    if (primary == weapon) {
        primary = nullptr;
    }
    if (secondary == weapon) {
        secondary = nullptr;
    }
    objects.erase(std::remove(objects.begin(), objects.end(), weapon), objects.end());
    ChooseNewCurrentWeapon();
    CleanUpAmmo();
}

void InventoryManager::ChooseNewCurrentWeapon() {
    if (currentWeapon && (currentWeapon == primary || currentWeapon == secondary)) return;
    if (primary) currentWeapon = primary;
    else if (secondary) currentWeapon = secondary;
    else if (!objects.empty()) currentWeapon = objects[0];
    else currentWeapon = nullptr;
}

void InventoryManager::ClearInventory() {
    Drop(primary);
    Drop(secondary);
    for (auto& obj : objects) {
        Drop(obj);
    }
}

WeaponObject* InventoryManager::GetCurrentWeapon() {
    return currentWeapon;
}

// Events
void InventoryManager::EquipPrimary() {
    currentWeapon = primary;
}

void InventoryManager::EquipSecondary() {
    currentWeapon = secondary;
}

void InventoryManager::EquipMedicalSupplies() {
     for (auto& object : objects) {
        if (MedkitObject* am = dynamic_cast<MedkitObject*>(object)) {
            currentWeapon = am;
            return;
        }
    }
}

void InventoryManager::EquipPrevious() {
    if (!currentWeapon) EquipSecondary();
    if (primary && currentWeapon == secondary) EquipPrimary();
    else if (secondary && currentWeapon == primary) EquipSecondary();
}

void InventoryManager::EquipNext() {
    if (!currentWeapon) EquipPrimary();
    if (primary && currentWeapon == secondary) EquipPrimary();
    else if (secondary && currentWeapon == primary) EquipSecondary();
}

void InventoryManager::EquipGrenade() {
    for (auto& object : objects) {
        if (GrenadeThrower* am = dynamic_cast<GrenadeThrower*>(object)) {
            currentWeapon = am;
            return;
        }
    }
}

void InventoryManager::HolsterAll() {
    currentWeapon = nullptr;
}

void InventoryManager::DropCurrentWeapon() {
    Drop(currentWeapon);
    ChooseNewCurrentWeapon();
}

void InventoryManager::Serialize(JSONWriter& obj) {
    // LOG_DEBUG("Player Object Serialize - Start");
    Replicable::Serialize(obj);
    if (currentWeapon) {
        obj.Key("c");
        obj.Uint(currentWeapon->GetId());
    }
    if (primary) {
        obj.Key("p");
        obj.Uint(primary->GetId());
    }
    if (secondary) {
        obj.Key("s");
        obj.Uint(secondary->GetId());
    }

    obj.Key("o");
    obj.StartArray();
    for (auto &weap : objects) {
        obj.Uint(weap->GetId());
    }
    obj.EndArray();
}

void InventoryManager::ProcessReplication(json& obj) {
    Replicable::ProcessReplication(obj);
    if (obj.HasMember("c")) {
        currentWeapon = game.GetObject<WeaponObject>(obj["c"].GetUint());
    }
    else {
        currentWeapon = nullptr;
    }

    if (obj.HasMember("p")) {
        primary = game.GetObject<WeaponObject>(obj["p"].GetUint());
    }
    else {
        primary = nullptr;
    }

    if (obj.HasMember("s")) {
        secondary = game.GetObject<WeaponObject>(obj["s"].GetUint());
    }
    else {
        secondary = nullptr;
    }

    objects.clear();

    for (const json &inv : obj["o"].GetArray()) {
        objects.push_back(game.GetObject<WeaponObject>(inv.GetUint()));
    }
}

size_t InventoryManager::GetAmmoCount() {
    size_t ammo = 0;
    for (auto& object : objects) {
        if (AmmoObject* am = dynamic_cast<AmmoObject*>(object)) {
            ammo += am->ammoCount;
        }
    }
    return ammo;
}

size_t InventoryManager::RemoveAmmo(int magazineSize) {
    int need = magazineSize;
    for (auto& object : objects) {
        if (AmmoObject* am = dynamic_cast<AmmoObject*>(object)) {
            if (am->ammoCount > need) {
                am->ammoCount -= need;
                need = 0;
            }
            else {
                need -= am->ammoCount;
                am->ammoCount = 0;
            }
            if (need == 0) return magazineSize;
        }
    }
    // Clean up Ammo
    CleanUpAmmo();
    return magazineSize - need;
}

void InventoryManager::CleanUpAmmo() {
    size_t ammo = GetAmmoCount();

    for (auto& object : objects) {
        if (AmmoObject* am = dynamic_cast<AmmoObject*>(object)) {
            am->ammoCount = glm::min(MAX_AMMO_PER_STACK, ammo);
            ammo -= am->ammoCount;
        }
    }
    for (size_t i = 0; i < objects.size(); i++) {
        if (AmmoObject* am = dynamic_cast<AmmoObject*>(objects[i])) {
            if (am->ammoCount == 0) {
                Drop(am);
                game.DestroyObject(am->GetId());
                i--;
            }
        }
    }
}