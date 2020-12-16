#ifndef GAME_H
#define GAME_H

#include "object.h"
#include "timer.h"
#include "uWebSocket/App.h"

#include <unordered_map>
#include <unordered_set>
#include <mutex>

class PlayerObject;

struct PlayerSocketData {
    uWS::WebSocket<false, true>* ws;
    PlayerObject* playerObject;
};

class Game {
Timer& gameTimer;
    ObjectID nextId;
    std::unordered_map<ObjectID, Object*> gameObjects;
    
    std::unordered_set<PlayerSocketData*> players;
    std::mutex playersSetMutex;

public:
    Game(Timer& gameTimer);
    ~Game();

    // Simulate a tick of physics, not everyone ticks every frame
    void Tick(Time time);

    // Replicate objects that have changed to clients
    void Replicate(Time time);

    void IsColliding(Object* obj, std::vector<CollisionResult>& results);
    void AddObject(Object* obj);
    void DestroyObject(Object* obj);

    ObjectID RequestId(Object* obj);

    // Communicate with Sockets (everything here must be locked)
    PlayerObject* AddPlayer(PlayerSocketData* data);
    void RemovePlayer(PlayerSocketData* data);
};

#endif