#pragma once

#include <random>
#include "game.h"
#include "object.h"

struct LootSpawnZone {
    AABB spawnZone;
    std::unordered_set<ObjectID> objects;
};

// Manages the map, model and looting zones
class MapObject : public Object {
    REPLICATED(std::string, model, "model");

    bool collidersSetup = false;

    std::vector<LootSpawnZone> lootSpawnZones;

    size_t totalLootValue;

    std::random_device rd;
    std::mt19937 gen;

    Time lastLootSpawnTime = 0;

public:
    CLASS_CREATE(MapObject)

    MapObject(Game& game) : MapObject(game, "") {}
    MapObject(Game& game, const std::string& model) :
        Object(game), model(model), gen(rd()) {
        SetTag(Tag::NO_GRAVITY);
        SetIsStatic(true);
        SetTag(Tag::GROUND);

        if (!model.empty()) {
            SetModel(game.GetModel(model));
            #ifdef BUILD_SERVER
                InitializeMap();
                GenerateStaticMeshCollidersFromModel(this);
            #endif
        }
    }

    virtual void ProcessReplication(json& obj) override {
        Object::ProcessReplication(obj);
    #ifdef BUILD_CLIENT
        if (!collidersSetup) {
            collidersSetup = true;
            GenerateStaticMeshCollidersFromModel(this);
        }
    #endif
    }

    // Only really needs to be done on the server
    void InitializeMap();

    Object* LootSpawn();
    void SpawnLoot(Time time);
    virtual void Tick(Time time) override;
};

CLASS_REGISTER(MapObject);