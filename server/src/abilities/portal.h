#ifndef PORTAL_H
#define PORTAL_H

#include "weapons/weapon.h"
#include "object.h"
#include "game.h"

// The in game manisfestation of the portal
class PortalObject : public Object {
    Time lastUse = 0;
    Time cooldown = 500;
    bool canUse = false;

    Time timeCreated = 0;
    Time timeLasting = 20000;

    REPLICATED_D(int, hp, "h", 0);

public:
    PortalObject* otherPortal = nullptr;

    CLASS_CREATE(PortalObject);
    PortalObject(Game& game) : PortalObject(game, Vector2::Zero) {}
    PortalObject(Game& game, Vector2 position) : Object(game) {
        // Don't affect anyone's position in game
        collisionExclusion |= (uint64_t) Tag::OBJECT;

        SetTag(Tag::NO_GRAVITY);
        SetPosition(position);
        AddCollider(new RectangleCollider(this, Vector2(-18, -38), Vector2(37, 76)));
    }

    virtual void Tick(Time time) override {
        Object::Tick(time);
        canUse = time > lastUse + cooldown;

    #ifdef BUILD_SERVER
        if (timeCreated == 0 && otherPortal) {
            timeCreated = time;
        }
        else if (timeCreated != 0) {
            if (time < timeCreated + timeLasting) {
                hp = ((double)((timeCreated + timeLasting) - time) / (double) timeLasting) * 100;
                SetDirty(true);
            }
            else {
                game.DestroyObject(GetId());
            }
        }
    #endif
    }

    virtual void OnCollide(CollisionResult& result) override {
        Object::OnCollide(result);
        #ifdef BUILD_SERVER
            if (canUse && result.collidedWith->IsTagged(Tag::PLAYER) && otherPortal != nullptr) {
                lastUse = lastTickTime;
                otherPortal->lastUse = otherPortal->lastTickTime;
                canUse = false;
                otherPortal->canUse = false;

                result.collidedWith->SetPosition(otherPortal->GetPosition());
            }
        #endif
    }

    virtual void Serialize(JSONWriter& obj) override {
        Object::Serialize(obj);
        if (otherPortal) {
            obj.Key("op");
            obj.Uint(otherPortal->GetId());
        }
    }

    virtual void ProcessReplication(json& obj) override {
        Object::ProcessReplication(obj);
        if (obj.HasMember("op")) {
            otherPortal = game.GetObject<PortalObject>(obj["op"].GetUint());
        }
        else {
            otherPortal = nullptr;
        }
    }
};

CLASS_REGISTER(PortalObject);

class PortalAbility : public WeaponWithCooldown {
    REPLICATED_D(bool, currentlyPortaling, "cp", false);

    PortalObject* firstPortal = nullptr;
public:
    CLASS_CREATE(PortalAbility)
    PortalAbility(Game& game) : PortalAbility(game, Vector2::Zero) {}
    PortalAbility(Game& game, Vector2 position) : WeaponWithCooldown(game, position) {
        cooldown = 10000;
    }

    virtual void Tick(Time time) override {
        WeaponWithCooldown::Tick(time);
    }

    virtual void StartFire(Time time) override {
        WeaponWithCooldown::StartFire(time);
    #ifdef BUILD_SERVER
        if (IsOnCooldown()) return;

        if (currentlyPortaling && firstPortal) {
            // TODO: Check if too close then we cancel
            PortalObject* secondPortal = new PortalObject(game, attachedTo->GetPosition());
            secondPortal->otherPortal = firstPortal;
            firstPortal->otherPortal = secondPortal;

            game.AddObject(secondPortal);
            currentlyPortaling = false;
            firstPortal = nullptr;
            CooldownStart(time);
        }
        else {
            // Create First Portal
            firstPortal = new PortalObject(game, attachedTo->GetPosition());
            game.AddObject(firstPortal);
            currentlyPortaling = true;
        }
    #endif
    }
};

CLASS_REGISTER(PortalAbility);


#endif