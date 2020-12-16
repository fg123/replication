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
    std::unordered_map<ObjectID, Object*> gameObjects;
    
    std::unordered_set<PlayerSocketData*> players;
    std::mutex playersSetMutex;

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

    Object* GetObject(ObjectID id) { return gameObjects[id]; }
    ObjectID RequestId(Object* obj);

    // Communicate with Sockets (everything here must be locked)
    PlayerObject* AddPlayer(PlayerSocketData* data);
    void RemovePlayer(PlayerSocketData* data);
};

#endif