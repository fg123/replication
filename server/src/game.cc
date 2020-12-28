#include "game.h"
#include "logging.h"

#include "objects/player.h"
#include "objects/rectangle.h"
#include "characters/archer.h"

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
    bool hasNewObjects = !newObjects.empty();
#endif

    for (auto& newObject : newObjects) {
        gameObjects[newObject->GetId()] = newObject;
    }

    newObjects.clear();

    for (auto& object : gameObjects) {
        object.second->Tick(time);
    }

#ifdef BUILD_SERVER
    if (hasNewObjects) {
        LOG_DEBUG("Has new objects!");
        Replicate(time);
    }
    for (auto& object : gameObjects) {
        if (!object.second->IsStatic() &&
            !IsPointInRect(killPlaneStart, killPlaneEnd - killPlaneStart,
                object.second->GetPosition()) &&
            !object.second->IsTagged(Tag::NO_KILLPLANE)) {
            // TODO: Deal damage instead of insta kill
            // You're out of the range
            LOG_INFO("Kill Planed: " << object.second << " " << object.second->GetPosition());

            DestroyObject(object.second->GetId());
        }
    }
#endif

    // OnDeath could potentially add more stuff to DeadObjects
    std::vector<ObjectID> deadObjectsThisTick;
    deadObjectsThisTick.insert(deadObjectsThisTick.begin(),
        deadObjects.begin(), deadObjects.end());
    deadObjects.clear();
    for (auto& objectId : deadObjectsThisTick) {
        if (gameObjects.find(objectId) != gameObjects.end()) {
            Object* object = gameObjects[objectId];
            LOG_DEBUG("Destroy Object (" << objectId << ") " << object->GetClass());
            object->OnDeath();
            gameObjects.erase(objectId);
            deadSinceLastReplicate.insert(objectId);
            delete object;
        }
    }

    // Don't clear dead objects until replicate has sent it out
}

#ifdef BUILD_SERVER
/* A Replication Packet:
    {
        event: "r",
        objs: [ list of replicated objects ],
        time: client timestamp of last input.
        ticks: ticks server has processed sicne that last input
    }
*/

void Game::InitialReplication(PlayerSocketData* data) {
    json finalPacket;
    finalPacket["event"] = "r";
    finalPacket["time"] = 0;
    finalPacket["ticks"] = 0;
    for (auto& object : gameObjects) {
        // All Objects
        json obj;
        object.second->Serialize(obj);
        finalPacket["objs"].push_back(obj);
    }
    if (!data->ws->send(finalPacket.dump(), uWS::OpCode::TEXT)) {
        LOG_ERROR("Could not send!");
    }
}

void Game::Replicate(Time time) {
    json finalPacket;
    finalPacket["event"] = "r";
    for (auto& objectId : deadSinceLastReplicate) {
        json obj;
        obj["id"] = objectId;
        obj["dead"] = true;
        finalPacket["objs"].push_back(obj);
    }

    deadSinceLastReplicate.clear();

    for (auto& object : gameObjects) {
        if (object.second->IsDirty()) {
            object.second->SetDirty(false);
            json obj;
            object.second->Serialize(obj);
            //serialized.emplace(object.second, obj.dump());
            finalPacket["objs"].push_back(obj);
        }
    }

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
        }
        else {
            finalPacket["time"] = player->playerObject->lastClientInputTime;
            finalPacket["ticks"] = player->playerObject->ticksSinceLastProcessed;
            if (!player->ws->send(finalPacket.dump(), uWS::OpCode::TEXT)) {
                LOG_ERROR("Send Error");
            }
        }
        if (player->playerObjectDirty) {
            if (player->playerObject->GetId() != 0) {
                player->playerObjectDirty = false;
            }
            json objectNotify;
            objectNotify["playerLocalObjectId"] = player->playerObject->GetId();
            player->ws->send(objectNotify.dump(), uWS::OpCode::TEXT);
        }
    }
}
#endif

#ifdef BUILD_CLIENT
void Game::RollbackTime(Time time) {
    for (auto& object : gameObjects) {
        object.second->SetLastTickTime(time);
    }
}

void Game::EnsureObjectExists(json& object) {
    if (!object.contains("id")) {
        LOG_ERROR("EnsureObjectExists: no ID on replication packet!");
        throw std::runtime_error("EnsureObjectExists: no ID on replication packet!");
    }
    ObjectID id = object["id"];
    if (object.contains("dead")) {
        // Kill
        if (gameObjects.find(id) != gameObjects.end()) {
            delete gameObjects[id];
            gameObjects.erase(id);
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
}

void Game::ProcessReplication(json& object) {
    ObjectID id = object["id"];
    if (object.contains("dead")) {
        return;
    }
    Object* obj = GetObject(id);
    if (obj == nullptr) {
        LOG_ERROR("Replicating on non-existant object!" << id);
        return;
    }
    obj->ProcessReplication(object);
}
#endif

void Game::HandleCollisions(Object* obj) {
    Vector2 collisionResolution;
    for (auto& object : gameObjects) {
        if (obj == object.second) continue;

        // Check for Collision Exclusion
        if (!(obj->IsCollideExcluded(object.second->GetTags()) ||
            object.second->IsCollideExcluded(obj->GetTags()))) {
            CollisionResult r = obj->CollidesWith(object.second);
            if (r.isColliding) {
                r.collidedWith = object.second;
                collisionResolution += r.collisionDifference;
                obj->OnCollide(r);
            }
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
    std::scoped_lock<std::mutex> lock(newObjectsMutex);
    ObjectID newId = RequestId();
    obj->SetId(newId);
    LOG_DEBUG("Add Object " << obj);
    newObjects.insert(obj);
}

void Game::DestroyObject(ObjectID objectId) {
#ifdef BUILD_CLIENT
    LOG_ERROR("Don't call DestroyObject on the client!!");
    throw std::runtime_error("Don't call DestroyObject on the client!!");
#endif
    if (objectId == 0) {
        // Something has gone wrong
        LOG_ERROR("Tried to destroy object ID 0!");
        throw std::runtime_error("Invalid destroy of ID 0, probably a memory leak!");
    }
    if (gameObjects.find(objectId) == gameObjects.end()) {
        LOG_ERROR("Tried to queue destruction for object not exist " << objectId);
        return;
    }
    LOG_DEBUG("Queued for Destruction " << objectId);
    deadObjects.insert(objectId);
}

#ifdef BUILD_SERVER
void Game::OnPlayerDead(PlayerObject* playerObject) {
    std::scoped_lock<std::mutex> lock(playersSetMutex);
    for (auto& p : players) {
        if (p->playerObject == playerObject) {
            LOG_INFO("Found player! Respawning by setting to dirty!");
            // Found the player. Handle respawn mechanics here.
            p->playerObjectDirty = true;

            // Implement letting user select things
            auto& ClassLookup = GetClassLookup();
            if (ClassLookup.find(p->nextRespawnCharacter) == ClassLookup.end()) {
                p->nextRespawnCharacter = "Archer";
            }
            Object* obj = GetClassLookup()[p->nextRespawnCharacter](*this);
            obj->SetPosition(Vector2(200, 0));

            p->playerObject = static_cast<PlayerObject*>(obj);

            QueueNextTick([obj](Game& game) {
                game.AddObject(obj);
                LOG_INFO("Respawn Player! New ID " << obj->GetId());
            });
            return;
        }
    }
}
#endif

ObjectID Game::RequestId() {
    return nextId++;
}

#ifdef BUILD_SERVER
void Game::AddPlayer(PlayerSocketData* data, PlayerObject* playerObject) {
    std::scoped_lock<std::mutex> lock(playersSetMutex);
    players.insert(data);

    QueueNextTick([playerObject](Game& game) {
        game.AddObject(playerObject);
    });
}

void Game::RemovePlayer(PlayerSocketData* data) {
    std::scoped_lock<std::mutex> lock(playersSetMutex);
    players.erase(data);

    PlayerObject* playerObject = data->playerObject;
    LOG_INFO("Removing player " << playerObject);
    QueueNextTick([playerObject](Game& game) {
        game.DestroyObject(playerObject->GetId());
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