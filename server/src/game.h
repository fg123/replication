#ifndef GAME_H
#define GAME_H

#include "object.h"
#include "timer.h"

#ifdef BUILD_SERVER
#include "uWebSocket/App.h"
#endif

#include <unordered_map>
#include <unordered_set>
#include <mutex>
#include <atomic>

class PlayerObject;

static const int TickRate = 128;
static const int ReplicateRate = 20;

struct PlayerSocketData {
#ifdef BUILD_SERVER
    uWS::WebSocket<false, true>* ws;
    bool hasInitialReplication = false;
    bool playerObjectDirty = true;
    bool isReady = false;
#endif
    PlayerObject* playerObject;
};

class Game {
    std::atomic<ObjectID> nextId;

    std::mutex queuedCallsMutex;
    std::vector<std::function<void(Game& game)>> queuedCalls;

    std::unordered_map<ObjectID, Object*> gameObjects;
    
    std::unordered_set<PlayerSocketData*> players;
    std::mutex playersSetMutex;

    std::unordered_set<Object*> deadObjects;

    Time gameTime;

    Vector2 killPlaneStart = { -3000, -2000 };
    Vector2 killPlaneEnd = Vector2 { 3000, 2000 };

public:
    Game();
    Game(std::string mapPath);
    ~Game();

    // Simulate a tick of physics, not everyone ticks every frame
    void Tick(Time time);


#ifdef BUILD_SERVER
    // Replicate objects that have changed to clients
    void Replicate(Time time);
    void InitialReplication(PlayerSocketData* data);
#endif

#ifdef BUILD_CLIENT
    void EnsureObjectExists(json& object);
    void ProcessReplication(json& incObject);
#endif

    void HandleCollisions(Object* obj);
    void AddObject(Object* obj);
    void DestroyObject(ObjectID objectId);
    Time GetGameTime() const { return gameTime; }

    Object* GetObjectImpl(ObjectID id) {
        if (gameObjects.find(id) != gameObjects.end())
            return gameObjects[id];
        else return nullptr;
    }

    template<class T = Object>
    T* GetObject(ObjectID id) {
        return static_cast<T*>(GetObjectImpl(id));
    }

    ObjectID RequestId();
    
    void ChangeId(ObjectID oldId, ObjectID newId);

    void QueueNextTick(const std::function <void(Game& game)>& func) {
        queuedCallsMutex.lock();
        queuedCalls.push_back(func);
        queuedCallsMutex.unlock();
    }

    // Communicate with Sockets (everything here must be locked)
#ifdef BUILD_SERVER
    void AddPlayer(PlayerSocketData* data, PlayerObject* playerObject);
    void RemovePlayer(PlayerSocketData* data);
    void OnPlayerDead(PlayerObject* playerObject);
#endif

    using RangeQueryResult = std::pair<Object*, double>;
    // Gets all units within a certain radial range (by position), if
    //   includeBoundingBox is set, counts unit if any part of bounding box
    //   is part of that range.
    void GetUnitsInRange(Vector2 position, double range,
        bool includeBoundingBox,
        std::vector<RangeQueryResult>& results);
    
    CollisionResult CheckLineSegmentCollide(const Vector2& start,
        const Vector2& end, uint64_t includeTags = ~0) {
        CollisionResult result;
        for (auto& object : gameObjects) {
            if (((uint64_t)object.second->GetTags() & includeTags) != 0) {
                CollisionResult r = object.second->CollidesWith(start, end);
                if (r.isColliding) {
                    r.collidedWith = object.second;
                    return r;
                }
            }
        }
        return CollisionResult{};
    }
};

#endif