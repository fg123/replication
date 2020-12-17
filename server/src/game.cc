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
    gameTime = time;
    queuedCallsMutex.lock();
    for (auto& call : queuedCalls) {
        call();
    }
    queuedCalls.clear();
    queuedCallsMutex.unlock();
    std::unordered_set<Object*> killPlaned;
    for (auto& object : gameObjects) {
        object.second->Tick(time);
        if (object.second->GetPosition().y > killPlaneY) {
            killPlaned.insert(object.second);
        }
    }
    for (auto& object : killPlaned) {
        DestroyObject(object);
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

    for (auto& object : deadObjects) {
        json obj;
        obj["id"] = object->GetId();
        obj["dead"] = true;
        serialized.emplace(object, obj.dump());
        delete object;
    }

    deadObjects.clear();

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
    if (object.contains("dead")) {
        // Kill
        if (gameObjects.find(id) != gameObjects.end()) {
            DestroyObject(gameObjects[id]);
            return;
        }
        return;
    }
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
    Vector2 collisionResolution;
    for (auto& object : gameObjects) {
        if (obj == object.second) continue;
        
        CollisionResult r = obj->CollidesWith(object.second);
        if (r.isColliding) {
            r.collidedWith = object.second;
            // Check for Collision Exclusion
            if (!(obj->IsCollideExcluded(object.second->GetTags()) ||
                object.second->IsCollideExcluded(obj->GetTags()))) {
                collisionResolution += r.collisionDifference;
            }
            obj->OnCollide(r);
        }
    }
    obj->ResolveCollision(collisionResolution);
}

void Game::AddObject(Object* obj) {
    gameObjects[obj->GetId()] = obj;
}

void Game::DestroyObject(Object* obj) {
    gameObjects.erase(obj->GetId());
    obj->OnDeath();
#ifdef BUILD_SERVER
    deadObjects.insert(obj);
#endif
#ifdef BUILD_CLIENT
    // Client doesn't need to further replicate 
    delete obj;
#endif
}

ObjectID Game::RequestId(Object* obj) {
    return nextId++;
}

void Game::AddPlayer(PlayerSocketData* data) {
    std::scoped_lock<std::mutex> lock(playersSetMutex);
    players.insert(data);

    QueueNextTick([&]() {
        PlayerObject* playerObject = new PlayerObject(*this, Vector2(100, 100));
        AddObject(playerObject);
        data->playerObject = playerObject;
    });
}

void Game::RemovePlayer(PlayerSocketData* data) {
    std::scoped_lock<std::mutex> lock(playersSetMutex);
    players.erase(data);

    QueueNextTick([&]() {
        DestroyObject(data->playerObject);
    });
}