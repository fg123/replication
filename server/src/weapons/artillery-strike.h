#ifndef ARTILLERY_STRIKE
#define ARTILLERY_STRIKE

class ArtilleryObject : public Object {
public:
    CLASS_CREATE(ArtilleryObject)

    ArtilleryObject(Game& game) : Object(game) {
        // Don't Collide with Weapons
        collideExclusion |= (uint64_t) Tag::WEAPON;
        AddCollider(new RectangleCollider(this, Vector2(-22, -57), Vector2(45, 114)));
    }

    void Explode() {}

    virtual void OnCollide(CollisionResult& result) override {
        if (result.collidedWith->IsTagged(Tag::WEAPON)) {
            // Ignore
            return;
        }
        if (result.collidedWith->IsStatic()) {
            SetIsStatic(true);
            collideExclusion |= (uint64_t) Tag::PLAYER;
            // Explode();
        }
    }
};

CLASS_REGISTER(ArtilleryObject);

class ArtilleryStrike : public WeaponObject {
public:
    CLASS_CREATE(ArtilleryStrike)
    ArtilleryStrike(Game& game) : ArtilleryStrike(game, Vector2::Zero) {}
    ArtilleryStrike(Game& game, Vector2 position) : WeaponObject(game, position) {}

    virtual void Tick(Time time) override {
        WeaponObject::Tick(time);
        // Calculate cooldown
    }

    virtual void Fire(Time time) override {
        WeaponObject::Fire(time);

    }
    virtual void ReleaseFire(Time time) override {
        WeaponObject::ReleaseFire(time);

    #ifdef BUILD_SERVER
        ArtilleryObject* proj = new ArtilleryObject(game);
        proj->SetPosition(Vector2(attachedTo->mousePosition.x, 10));
        game.AddObject(proj);
    #endif

    }

    virtual void Serialize(JSONWriter& obj) override {
        WeaponObject::Serialize(obj);
    }

    virtual void ProcessReplication(json& obj) override {
        WeaponObject::ProcessReplication(obj);
    }
};

CLASS_REGISTER(ArtilleryStrike);

#endif