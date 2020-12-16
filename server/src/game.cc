#include "game.h"
#include <iostream>

#include "objects/rectangle.h"
#include "objects/circle.h"
#include "objects/player.h"
#include "json/json.hpp"

Game::Game() : nextId(0) {    
    auto* floor = new RectangleObject(*this, Vector2{100, 500}, Vector2{500, 100});
    floor->SetIsStatic(true);
    floor->SetTag(Tag::GROUND);
    AddObject(floor);

    AddObject(new RectangleObject(*this, Vector2{200, 100}, Vector2{50, 50}));
    // AddObject(new RectangleObject(*this, Vector2{300, 200}, Vector2{50, 50}));
    // AddObject(new RectangleObject(*this, Vector2{400, 200}, Vector2{50, 50}));
}

Game::~Game() {
    for (auto& t : gameObjects) {
        delete t.second;
    }
}

void Game::Tick(Time time) {
    for (auto& object : gameObjects) {
        object.second->Tick(time);
    }
}

#ifdef BUILD_SERVER
void Game::Replicate(Time time) {
    std::unordered_map<Object*, std::string> serialized;

    for (auto& object : gameObjects) {
        if (object.second->IsDirty()) {
            object.second->SetDirty(false);
            json obj;
            object.second->Serialize(obj);
            serialized.emplace(object.second, obj.dump());
        }
    }

    for (auto& player : players) {
        for (auto& object : serialized) {
            player->ws->send(object.second, uWS::OpCode::TEXT);
        }
    }
}
#endif

#ifdef BUILD_CLIENT
void Game::ProcessReplication(json& object) {
    ObjectID id = object["id"];
    if (gameObjects.find(id) == gameObjects.end()) {
        Object* obj = new Object(*this);
        obj->SetId(id);
        AddObject(obj);
    }
    Object* obj = GetObject(id);
    obj->ProcessReplication(object);
}
#endif

void Game::HandleCollisions(Object* obj) {
    for (auto& object : gameObjects) {
        if (obj != object.second) {
            CollisionResult r = obj->CollidesWith(object.second);
            if (r.isColliding) {
                r.collidedWith = object.second;
                obj->ResolveCollision(r);
            }
        }
    }
}

void Game::AddObject(Object* obj) {
    gameObjects[obj->GetId()] = obj;
}

void Game::DestroyObject(Object* obj) {
    gameObjects.erase(obj->GetId());
    delete obj;
}

ObjectID Game::RequestId(Object* obj) {
    return nextId++;
}

PlayerObject* Game::AddPlayer(PlayerSocketData* data) {
    std::scoped_lock<std::mutex> lock(playersSetMutex);
    players.insert(data);
    PlayerObject* playerObject = new PlayerObject(*this, Vector2(100, 100));
    AddObject(playerObject);
    return playerObject;
}

void Game::RemovePlayer(PlayerSocketData* data) {
    std::scoped_lock<std::mutex> lock(playersSetMutex);
    players.erase(data);
    DestroyObject(data->playerObject);
}