#pragma once

#include "object.h"
#include "timer.h"
#include "asset-manager.h"
#include "scene.h"

#include "animation.h"
#include "ray-cast.h"
#include "scripting.h"

#ifdef BUILD_SERVER
#include "uWebSocket/App.h"
#endif

#include <unordered_map>
#include <unordered_set>
#include <mutex>
#include <atomic>

class PlayerObject;

extern const int TickInterval;
extern const int ReplicateInterval;

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

#ifdef BUILD_SERVER
    std::mutex queuedCallsMutex;
    std::vector<std::function<void(Game& game)>> queuedCalls;
#endif

    std::unordered_map<ObjectID, Object*> gameObjects;

    std::unordered_set<PlayerSocketData*> players;
    std::mutex playersSetMutex;

    std::unordered_set<ObjectID> deadObjects;

#ifdef BUILD_SERVER
    // Notifies client of any animations
    std::vector<Animation*> animationPackets;

    std::unordered_set<ObjectID> deadSinceLastReplicate;

    std::mutex newObjectsMutex;
    std::unordered_map<ObjectID, Object*> newObjects;

    std::unordered_set<ObjectID> replicateNextTick;
#endif

    Time gameTime;

    ScriptManager scriptManager;
public:

#ifdef BUILD_CLIENT
    std::vector<TransformedLight*> lightNodes;
#endif

    Scene scene;

    Game();

#ifdef BUILD_CLIENT

    struct AudioRequest {
        Audio* audio;
        float volume;
        Vector3 location;
        ObjectID boundObject = -1;
        AudioRequest(Audio* audio, float volume,
            const Vector3& location) : audio(audio), volume(volume), location(location) {}
        AudioRequest(Audio* audio, float volume,
            ObjectID boundObject) : audio(audio), volume(volume), boundObject(boundObject) {}
    };

    std::vector<AudioRequest> audioRequests;
#endif

    PerformanceBuffer<Time> averageObjectTickTime { 100 };

    ~Game();

    // Load Map from JSON File, data-path
    void LoadMap(std::string mapPath);
    void CreateMapBaseObject();

    // Simulate a tick of physics
    void Tick(Time time);

    // Adds a child to the parent
    void AssignParent(Object* child, Object* parent);

    // Removes the child from the parent (and make it a root object)
    void DetachParent(Object* child);

#ifdef BUILD_SERVER
    // Replicate objects in replicateNextTick to clients
    void Replicate(Time time);

    void ReplicateAnimations(Time time);
    void RequestReplication(ObjectID objectId);
    void QueueAllForReplication(Time time);
    void InitialReplication(PlayerSocketData* data);

    void SendData(PlayerSocketData* player, std::string message);

    void QueueAnimation(Animation* animation) {
        // Make a copy of the animation packet
        animationPackets.push_back(animation);
    }
#endif

    Object* CreateScriptedObject(const std::string& className);
    Object* LoadScriptedObject(const std::string& className);

    void AddObject(Object* obj);
    void DestroyObject(ObjectID objectId);

#ifdef BUILD_CLIENT
    void EnsureObjectExists(json& object);
    void ProcessReplication(json& incObject);

    void RollbackTime(Time time);

    ObjectID localPlayerId = -1;
    PlayerObject* GetLocalPlayer();
#endif

    void HandleCollisions(Object* obj);

    RayCastResult RayCastInWorld(RayCastRequest request);

    Time GetGameTime() const { return gameTime; }

    bool ObjectExists(ObjectID id) const {
        return gameObjects.find(id) != gameObjects.end();
    }

    Object* GetObjectImpl(ObjectID id) {
        if (gameObjects.find(id) != gameObjects.end())
            return gameObjects[id];
        else return nullptr;
    }

    template<class T = Object>
    T* GetObject(ObjectID id) {
        return static_cast<T*>(GetObjectImpl(id));
    }

#ifdef BUILD_SERVER
    Object* GetObjectIncludingNewQueued(ObjectID id);
#endif

    const std::unordered_map<ObjectID, Object*>& GetGameObjects() const {
        return gameObjects;
    }

    AssetManager& GetAssetManager() {
        return scene.assetManager;
    }

    Model* GetModel(ModelID id) {
        return GetAssetManager().GetModel(id);
    }

    Model* GetModel(const std::string modelName) {
        return GetAssetManager().GetModel(modelName);
    }

    ObjectID RequestId();

    void ChangeId(ObjectID oldId, ObjectID newId);

#ifdef BUILD_SERVER
    void QueueNextTick(const std::function <void(Game& game)>& func) {
        queuedCallsMutex.lock();
        queuedCalls.push_back(func);
        queuedCallsMutex.unlock();
    }
#endif

    void PlayAudio(const std::string& audio, float volume, const Vector3& position);
    void PlayAudio(const std::string& audio, float volume, Object* boundObject);

    // Communicate with Sockets (everything here must be locked)
#ifdef BUILD_SERVER
    void AddPlayer(PlayerSocketData* data, PlayerObject* playerObject);
    void RemovePlayer(PlayerSocketData* data);
    void OnPlayerDead(PlayerObject* playerObject);
#endif

    using RangeQueryResult = std::pair<Object*, double>;
    // Gets all units within a certain radial range (by position)
    void GetUnitsInRange(const Vector3& position, float range,
        std::vector<RangeQueryResult>& results);

    bool CheckLineSegmentCollide(const Vector3& start,
        const Vector3& end, uint64_t includeTags = ~0);
};
