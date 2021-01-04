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

static const int TickInterval = 16;
static const int ReplicateInterval = 100;

struct PlayerSocketData {
#ifdef BUILD_SERVER
    uWS::WebSocket<false, true>* ws;
    bool hasInitialReplication = false;
    bool playerObjectDirty = true;
    bool isReady = false;
    std::string nextRespawnCharacter;

    uWS::Loop* eventLoop;
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

#ifdef BUILD_SERVER
    std::unordered_set<ObjectID> deadObjects;
    std::unordered_set<ObjectID> deadSinceLastReplicate;

    std::mutex newObjectsMutex;
    std::unordered_set<Object*> newObjects;

    std::unordered_set<ObjectID> replicateNextTick;
#endif

    Time gameTime;

public:
    Game();

#ifdef BUILD_SERVER
    Game(std::string mapPath);
#endif

    ~Game();

    // Simulate a tick of physics
    void Tick(Time time);

    // Adds a child to the parent
    void AssignParent(Object* child, Object* parent);

    // Removes the child from the parent (and make it a root object)
    void DetachParent(Object* child);

#ifdef BUILD_SERVER
    // Replicate objects in replicateNextTick to clients
    void Replicate(Time time);
    void RequestReplication(ObjectID objectId);
    void QueueAllDirtyForReplication(Time time);
    void InitialReplication(PlayerSocketData* data);

    void AddObject(Object* obj);
    void DestroyObject(ObjectID objectId);

    void SendData(PlayerSocketData* player, std::string message);
#endif

#ifdef BUILD_CLIENT
    void EnsureObjectExists(json& object);
    void ProcessReplication(json& incObject);

    void RollbackTime(Time time);
#endif

    void HandleCollisions(Object* obj);
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
    void GetUnitsInRange(const Vector2& position, double range,
        bool includeBoundingBox,
        std::vector<RangeQueryResult>& results);

    CollisionResult CheckLineSegmentCollide(const Vector2& start,
        const Vector2& end, uint64_t includeTags = ~0);
};

#endif