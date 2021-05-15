#ifndef PORTAL_H
#define PORTAL_H

#include "weapons/weapon.h"
#include "object.h"
#include "game.h"

// The in game manisfestation of the portal
class PortalObject : public Object {
    Time cooldown = 500;
    bool canUse = false;

    Time timeCreated = 0;
    Time timeLasting = 20000;

    REPLICATED_D(int, hp, "h", 0);
    bool initialCooldownSet = false;
public:
    Time lastUse = 0;
    PortalObject* otherPortal = nullptr;

    CLASS_CREATE(PortalObject);

    PortalObject(Game& game) : Object(game) {
        // Don't affect anyone's position in game
        collisionExclusion |= (uint64_t) Tag::OBJECT;

        SetTag(Tag::NO_GRAVITY);

        SetModel(game.GetModel("Portal.obj"));
        GenerateAABBCollidersFromModel(this);
    }

    virtual void Tick(Time time) override {
        Object::Tick(time);
        if (!initialCooldownSet) {
            initialCooldownSet = true;
            lastUse = time;
        }
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
        LOG_DEBUG("Collide " << lastUse << "lastUse " << canUse << " " << otherPortal);
        if (canUse && result.collidedWith->IsTagged(Tag::PLAYER) && otherPortal != nullptr) {
            lastUse = lastTickTime;
            otherPortal->lastUse = otherPortal->lastTickTime;
            canUse = false;
            otherPortal->canUse = false;

            result.collidedWith->SetPosition(otherPortal->GetPosition());
            game.PlayAudio("HookReel.wav", 1.f, result.collidedWith);
        }
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
    PortalAbility(Game& game) : PortalAbility(game, Vector3()) {}
    PortalAbility(Game& game, Vector3 position) : WeaponWithCooldown(game, position) {
        cooldown = 10000;
    }

    virtual void Tick(Time time) override {
        WeaponWithCooldown::Tick(time);
    }

    virtual void StartFire(Time time) override {
        WeaponWithCooldown::StartFire(time);

        if (IsOnCooldown()) return;

        if (currentlyPortaling) {
            // TODO: Check if too close then we cancel
            game.PlayAudio("PortalEnd.wav", 1.f, attachedTo);
            #ifdef BUILD_SERVER
                PortalObject* secondPortal = new PortalObject(game);
                secondPortal->SetPosition(attachedTo->GetPosition());
                secondPortal->SetRotation(attachedTo->GetRotation());
                secondPortal->otherPortal = firstPortal;
                firstPortal->otherPortal = secondPortal;

                game.AddObject(secondPortal);
            #endif

            currentlyPortaling = false;
            firstPortal = nullptr;
            CooldownStart(time);
        }
        else {
            // Create First Portal
            game.PlayAudio("PortalStart.wav", 1.f, attachedTo);
            #ifdef BUILD_SERVER
                firstPortal = new PortalObject(game);
                firstPortal->SetPosition(attachedTo->GetPosition());
                firstPortal->SetRotation(attachedTo->GetRotation());
                game.AddObject(firstPortal);
            #endif
            currentlyPortaling = true;
        }
    }
};

CLASS_REGISTER(PortalAbility);


#endif