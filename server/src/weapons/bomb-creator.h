#ifndef BOX_CREATOR_H
#define BOX_CREATOR_H

#include "object.h"
#include "collision.h"

class Bomb : public Object {
    int damageRange = 100;
    int damage = 70;

public:
    CLASS_CREATE(Bomb);
    Bomb(Game& game) : Bomb(game, Vector3()) {}
    Bomb(Game& game, Vector3 position) : Object(game) {
        SetPosition(position);
        AddCollider(new CircleCollider(this, Vector3(), 24));
        collisionExclusion |= (uint64_t) Tag::PLAYER;
    }

    void Explode() {
        // IMPLEMENT EXPLODE, scale damage as required
        std::vector<Game::RangeQueryResult> results;
        game.GetUnitsInRange(position, damageRange, false, results);

        for (auto& result : results) {
            // Flat Damage for now
            if (result.first->IsTagged(Tag::PLAYER)) {
                static_cast<PlayerObject*>(result.first)->DealDamage(damage);
            }
        }
    #ifdef BUILD_SERVER
        game.DestroyObject(GetId());
        game.QueueAnimation(new ExplodeAnimation(position, damageRange));
    #endif
    }
};

CLASS_REGISTER(Bomb);

class BombCreator : public WeaponWithCooldown {
    std::vector<Bomb*> bombs;

    REPLICATED_D(int, dropRange, "dr", 300);

public:
    CLASS_CREATE(BombCreator)
    BombCreator(Game& game) : BombCreator(game, Vector3()) {}
    BombCreator(Game& game, Vector3 position) : WeaponWithCooldown(game, position) {
        cooldown = 5000;
    }

    ~BombCreator() {
        for (Bomb* box : bombs) {
            game.DestroyObject(box->GetId());
        }
    }

#ifdef BUILD_SERVER
    virtual void StartFire(Time time) override {
        if (IsOnCooldown()) return;
        if (glm::distance(Vector3(attachedTo->mousePosition, 0), attachedTo->GetPosition()) < dropRange) {
            Bomb* bomb = new Bomb(game, Vector3(attachedTo->mousePosition, 0));
            bombs.push_back(bomb);
            game.AddObject(bomb);
            CooldownStart(time);
        }
    }

    void ExplodeAll() {
        for (Bomb* bomb : bombs) {
            bomb->Explode();
        }
        bombs.clear();
    }
#endif
};

CLASS_REGISTER(BombCreator);

class BombExploder : public WeaponWithCooldown {
public:
    CLASS_CREATE(BombExploder)
    BombExploder(Game& game) : BombExploder(game, Vector3()) {}
    BombExploder(Game& game, Vector3 position) : WeaponWithCooldown(game, position) {
        cooldown = 10000;
    }

#ifdef BUILD_SERVER
    virtual void StartFire(Time time) override {
        if (IsOnCooldown()) return;
        static_cast<BombCreator*>(attachedTo->qWeapon)->ExplodeAll();
        CooldownStart(time);
    }
#endif
};

CLASS_REGISTER(BombExploder);

#endif