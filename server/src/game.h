#pragma once

#include "object.h"
#include "timer.h"
#include "asset-manager.h"

#include "animation.h"
#include "ray-cast.h"

#ifdef BUILD_SERVER
#include "uWebSocket/App.h"
#endif

#include <unordered_map>
#include <unordered_set>
#include <mutex>
#include <atomic>

class PlayerObject;

#ifdef BUILD_SERVER
static const int TickInterval = 16;
#endif
#ifdef BUILD_CLIENT
static const int TickInterval = 16;
#endif
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

#ifdef BUILD_SERVER
    #define RESOURCE_PATH(path) (std::string("data/") + path)
#else
    #define RESOURCE_PATH(path) (path)
#endif

class Game {
    std::atomic<ObjectID> nextId;

    std::mutex queuedCallsMutex;
    std::vector<std::function<void(Game& game)>> queuedCalls;

    std::unordered_map<ObjectID, Object*> gameObjects;

    std::unordered_set<PlayerSocketData*> players;
    std::mutex playersSetMutex;

    std::unordered_set<ObjectID> deadObjects;

#ifdef BUILD_SERVER
    // Notifies client of any animations
    std::vector<Animation*> animationPackets;

    std::unordered_set<ObjectID> deadSinceLastReplicate;

    std::mutex newObjectsMutex;
    std::unordered_set<Object*> newObjects;

    std::unordered_set<ObjectID> replicateNextTick;

#endif

    Time gameTime;

    AssetManager assetManager;

public:
    Game();

#ifdef BUILD_CLIENT
    Model* CreateNewModel() {
        Model* model = new Model;
        assetManager.models.push_back(model);
        return model;
    }
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

    ~Game();

    // Load Map from JSON File, data-path
    void LoadMap(std::string mapPath);

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
    void QueueAllDirtyForReplication(Time time);
    void InitialReplication(PlayerSocketData* data);

    void SendData(PlayerSocketData* player, std::string message);

    void QueueAnimation(Animation* animation) {
        // Make a copy of the animation packet
        animationPackets.push_back(animation);
    }
#endif

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

    Object* GetObjectImpl(ObjectID id) {
        if (gameObjects.find(id) != gameObjects.end())
            return gameObjects[id];
        else return nullptr;
    }

    template<class T = Object>
    T* GetObject(ObjectID id) {
        return static_cast<T*>(GetObjectImpl(id));
    }

    const std::unordered_map<ObjectID, Object*>& GetGameObjects() const {
        return gameObjects;
    }

    AssetManager& GetAssetManager() {
        return assetManager;
    }

    Model* GetModel(ModelID id) {
        return assetManager.GetModel(id);
    }

    Model* GetModel(const std::string modelName) {
        return assetManager.GetModel(modelName);
    }

    ObjectID RequestId();

    void ChangeId(ObjectID oldId, ObjectID newId);

    void QueueNextTick(const std::function <void(Game& game)>& func) {
        queuedCallsMutex.lock();
        queuedCalls.push_back(func);
        queuedCallsMutex.unlock();
    }

    void PlayAudio(const std::string& audio, float volume, const Vector3& position);
    void PlayAudio(const std::string& audio, float volume, Object* boundObject);

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
    void GetUnitsInRange(const Vector3& position, float range,
        bool includeBoundingBox,
        std::vector<RangeQueryResult>& results);

    bool CheckLineSegmentCollide(const Vector3& start,
        const Vector3& end, uint64_t includeTags = ~0);
};
