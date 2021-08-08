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
    std::vector<LootSpawnZone> lootSpawnZones;

    size_t totalLootValue;

    std::random_device rd;
    std::mt19937 gen;

    Time lastLootSpawnTime = 0;

public:
    CLASS_CREATE(MapObject)

    MapObject(Game& game) :
        Object(game), gen(rd()) {
        SetTag(Tag::NO_GRAVITY);
        SetIsStatic(true);

        #ifdef BUILD_SERVER
            InitializeMap();
        #endif
    }

    // Only really needs to be done on the server
    void InitializeMap();

    Object* LootSpawn();
    void SpawnLoot(Time time);
    virtual void Tick(Time time) override;
};

CLASS_REGISTER(MapObject);

class LightObject : public Object {
   REPLICATED(LightNode, light, "light");
public:
    CLASS_CREATE(LightObject)

    LightObject(Game& game) : Object(game), light() {}
    LightObject(Game& game, LightNode light) :
        Object(game), light(light) {
        SetTag(Tag::NO_GRAVITY);
        SetIsStatic(true);
    }
};

CLASS_REGISTER(LightObject);