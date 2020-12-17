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

class PlayerObject;

struct PlayerSocketData {
#ifdef BUILD_SERVER
    uWS::WebSocket<false, true>* ws;
#endif
    PlayerObject* playerObject;
};

class Game {
    ObjectID nextId;

    std::mutex queuedCallsMutex;
    std::vector<std::function<void()>> queuedCalls;

    std::unordered_map<ObjectID, Object*> gameObjects;
    
    std::unordered_set<PlayerSocketData*> players;
    std::mutex playersSetMutex;

    std::unordered_set<Object*> deadObjects;

    Time gameTime;

public:
    Game();
    ~Game();

    // Simulate a tick of physics, not everyone ticks every frame
    void Tick(Time time);


#ifdef BUILD_SERVER
    // Replicate objects that have changed to clients
    void Replicate(Time time);
#endif
#ifdef BUILD_CLIENT
    void ProcessReplication(json& incObject);
#endif
    void HandleCollisions(Object* obj);
    void AddObject(Object* obj);
    void DestroyObject(Object* obj);
    Time GetGameTime() const { return gameTime; }
    
    Object* GetObject(ObjectID id) {
        if (gameObjects.find(id) != gameObjects.end())
            return gameObjects[id];
        else return nullptr;
    }

    ObjectID RequestId(Object* obj);
    
    void QueueNextTick(const std::function <void()>& func) {
        queuedCallsMutex.lock();
        queuedCalls.push_back(func);
        queuedCallsMutex.unlock();
    }

    // Communicate with Sockets (everything here must be locked)
    void AddPlayer(PlayerSocketData* data);
    void RemovePlayer(PlayerSocketData* data);
};

#endif