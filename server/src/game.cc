#include "game.h"
#include "logging.h"

#include "objects/player.h"
#include "objects/rectangle.h"
#include "weapons/bow.h"
#include "weapons/assault-rifle.h"

#include "json/json.hpp"

#include <fstream>

static const double TILE_SIZE = 48;

Game::Game() : nextId(1) {    
   
}

Game::Game(std::string mapPath) : Game() {
    std::ifstream mapFile(mapPath);
    json obj;
    mapFile >> obj;

    // Create collision for tiles in the map
    json& tiles = obj["tiles"];
    for (json& tile : tiles) {
        if (tile.contains("collision") && tile["collision"]) {
            double startX = (double)tile["start"]["x"] * TILE_SIZE;
            double startY = (double)tile["start"]["y"] * TILE_SIZE;
            double endX = ((double)tile["end"]["x"] + 1) * TILE_SIZE;
            double endY = ((double)tile["end"]["y"] + 1) * TILE_SIZE;
            RectangleObject* floor = new RectangleObject(*this, Vector2{
                startX, startY
            }, Vector2{endX - startX, endY - startY});
            floor->SetIsStatic(true);
            floor->SetTag(Tag::GROUND);
            AddObject(floor);
        }
    }

    AddObject(new BowObject(*this, Vector2{400, 100}));
    AddObject(new AssaultRifleObject(*this, Vector2{600, 100}));
    // CircleObject* c = new CircleObject(*this, Vector2{400, 600}, 20.0);
    // c->SetIsStatic(true);
    // AddObject(c);
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
        call(*this);
    }
    queuedCalls.clear();
    queuedCallsMutex.unlock();

#ifdef BUILD_SERVER
    std::unordered_set<Object*> killPlaned;
#endif

    for (auto& object : gameObjects) {
        object.second->Tick(time);
    }

#ifdef BUILD_SERVER
    for (auto& object : gameObjects) {
        if (!object.second->IsStatic() &&
            !IsPointInRect(Vector2::Zero, killPlaneSize,
                object.second->GetPosition())) {
            // TODO: Deal damage instead of insta kill
            // You're out of the range 
           killPlaned.insert(object.second);
        }
    }
#endif

#ifdef BUILD_SERVER
    for (auto& object : killPlaned) {
        DestroyObject(object->GetId());
    }
#endif
}

#ifdef BUILD_SERVER
void Game::InitialReplication(PlayerSocketData* data) {
    json finalPacket;
    for (auto& object : gameObjects) {
        // All Objects
        json obj;
        object.second->Serialize(obj);
        finalPacket.push_back(obj);
    }
    std::string finalPacketContents = finalPacket.dump();
    if (!data->ws->send(finalPacketContents, uWS::OpCode::TEXT)) {
        LOG_ERROR("Could not send!");
    }
}

void Game::Replicate(Time time) {
    //std::unordered_map<Object*, std::string> serialized;
    json finalPacket;

    for (auto& object : deadObjects) {
        json obj;
        obj["id"] = object->GetId();
        obj["dead"] = true;
        finalPacket.push_back(obj);
        //serialized.emplace(object, obj.dump());
        delete object;
    }

    deadObjects.clear();

    for (auto& object : gameObjects) {
        if (object.second->IsDirty()) {
            object.second->SetDirty(false);
            json obj;
            object.second->Serialize(obj);
            //serialized.emplace(object.second, obj.dump());
            finalPacket.push_back(obj);
        }
    }

    std::string finalPacketContents = finalPacket.dump();

    std::scoped_lock<std::mutex> lock(playersSetMutex);
    for (auto& player : players) {
        /*for (auto& object : serialized) {
            player->ws->send(object.second, uWS::OpCode::TEXT);
        }*/
        if (!player->isReady) continue;
        if (!player->hasInitialReplication) {
            LOG_DEBUG("Initial Replication");
            player->hasInitialReplication = true;
            InitialReplication(player);
            json objectNotify;
            objectNotify["playerLocalObjectId"] = player->playerObject->GetId();
            player->ws->send(objectNotify.dump(), uWS::OpCode::TEXT);
        }
        else {
            if (!player->ws->send(finalPacketContents, uWS::OpCode::TEXT)) {
                LOG_ERROR("Send Error");
            }
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
            DestroyObject(id);
            return;
        }
        return;
    }
    if (gameObjects.find(id) == gameObjects.end()) {
        LOG_DEBUG("Got new object (" << id << ") " << object["t"]);
        auto& ClassLookup = GetClassLookup();
        if (ClassLookup.find(object["t"]) == ClassLookup.end()) {
            LOG_ERROR("Class " << object["t"] << " is not registered!");
            throw std::runtime_error("Class " + std::string(object["t"]) + " is not registered!");
        }
        Object* obj = GetClassLookup()[object["t"]](*this);
        obj->SetId(id);
        gameObjects[id] = obj;
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

void Game::ChangeId(ObjectID oldId, ObjectID newId) {
    if (oldId == newId) return;
    if (gameObjects.find(oldId) == gameObjects.end()) {
        throw std::runtime_error("Invalid old ID " + std::to_string(oldId));
    }
    else if (gameObjects.find(newId) != gameObjects.end()) {
        throw std::runtime_error("New ID already exists " + std::to_string(newId));
    }
    LOG_DEBUG("Changing ID " << oldId << " -> " << newId << " " << gameObjects[oldId]);
    gameObjects[newId] = gameObjects[oldId];
    gameObjects[newId]->SetId(newId);
    gameObjects.erase(oldId);
}

void Game::AddObject(Object* obj) {
    // Client should never add object and wait for server to tell me
#ifdef BUILD_CLIENT
    LOG_ERROR("Don't call AddObject on the client!!");
    throw std::runtime_error("Don't call AddObject on the client!!");
#endif
    ObjectID newId = RequestId();
    LOG_DEBUG("Add Object " << newId);
    obj->SetId(newId);
    gameObjects[newId] = obj;
}

void Game::DestroyObject(ObjectID objectId) {
    if (objectId == 0) {
        // Something has gone wrong
        LOG_ERROR("Tried to destroy object ID 0!");
        throw std::runtime_error("Invalid destroy of ID 0, probably a memory leak!");
    }
    if (gameObjects.find(objectId) == gameObjects.end()) {
        return;
    }
    Object* object = gameObjects[objectId];
    LOG_DEBUG("Destroy Object " << objectId);
    gameObjects.erase(objectId);
    object->OnDeath();
    deadObjects.insert(object);
}

ObjectID Game::RequestId() {
    return nextId++;
}

#ifdef BUILD_SERVER
void Game::AddPlayer(PlayerSocketData* data, PlayerObject* playerObject, ObjectID reservedId) {
    std::scoped_lock<std::mutex> lock(playersSetMutex);
    players.insert(data);

    QueueNextTick([data, playerObject, reservedId, this](Game& game) {
        // Already reserved one to tell the client, so we override it.
        AddObject(playerObject);
        ChangeId(playerObject->GetId(), reservedId);
    });
}

void Game::RemovePlayer(PlayerSocketData* data) {
    std::scoped_lock<std::mutex> lock(playersSetMutex);
    players.erase(data);

    PlayerObject* playerObject = data->playerObject;
    LOG_INFO("Removing player " << playerObject);
    QueueNextTick([playerObject, this](Game& game) {
        DestroyObject(playerObject->GetId());
    });
}
#endif

void Game::GetUnitsInRange(Vector2 position, double range,
    bool includeBoundingBox, std::vector<RangeQueryResult>& results) {

    CircleCollider collider { position, range };

    for (auto& pair : gameObjects) {
        Object* obj = pair.second;
        double actualRange = position.Distance(obj->GetPosition());
        if (includeBoundingBox) {
            CollisionResult result = obj->CollidesWith(&collider);
            if (result.isColliding) {
                results.emplace_back(obj, actualRange);
            }
        }
        else if (actualRange < range) {
            results.emplace_back(obj, actualRange);
        }
    }
}