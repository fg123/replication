#include "game.h"
#include "logging.h"
#include "global.h"

#include "object.h"
#include "vector.h"
#include "objects/player.h"
#include "characters/dummy.h"
#include "characters/archer.h"
#include "collision.h"

#include "json/json.hpp"

#include "static-mesh.h"

#include <fstream>
#include <exception>

Vector3 liveBoxStart(-1000, -100, -1000);
Vector3 liveBoxSize(2000, 2000, 2000);

Game::Game() : nextId(1) {
    if (GlobalSettings.RunTests) return;
    #ifdef BUILD_SERVER
        if (GlobalSettings.IsProduction) {
            LOG_INFO("==== PRODUCTION MODE ====");
        }
        else {
            LOG_INFO("==== DEVELOPMENT MODE ====");
        }

        LoadMap(RESOURCE_PATH(GlobalSettings.MapPath));

        // Models[0] is always the base map
        StaticMeshObject* baseMap = new StaticMeshObject(*this, "ShootingRange.obj");
        AddObject(baseMap);
    #endif
}

void Game::LoadMap(std::string mapPath) {
    LOG_INFO("Loading Map " << mapPath);

    std::ifstream mapFile(mapPath);

    rapidjson::IStreamWrapper stream(mapFile);

    JSONDocument obj;
    obj.ParseStream(stream);

    // Process Models
    for (json& model : obj["models"].GetArray()) {
        std::string modelName = model.GetString();
        std::string modelPath = RESOURCE_PATH("models/" + modelName);
        LOG_INFO("Loading " << modelPath);
        std::ifstream modelStream (modelPath);
        if (!modelStream.is_open()) {
            LOG_ERROR("Could not load model " << modelPath);
            throw std::system_error(errno, std::system_category(), "failed to open " + modelPath);
        }
        assetManager.LoadModel(modelName, modelPath, modelStream);
    }
    for (json& lightJson : obj["lights"].GetArray()) {
        // Light is an array that is serializable to Light
        Light& light = assetManager.lights.emplace_back();
        ProcessReplicationDispatch(light, lightJson);
    }
    #ifdef BUILD_CLIENT
    for (json& audio : obj["sounds"].GetArray()) {
        std::string audioName = audio.GetString();
        std::string audioPath = RESOURCE_PATH("sounds/" + audioName);
        assetManager.LoadAudio(audioName, audioPath);
    }
    #endif
}

Game::~Game() {
    for (auto& t : gameObjects) {
        delete t.second;
    }
}

#ifdef BUILD_CLIENT

PlayerObject* Game::GetLocalPlayer() {
    return GetObject<PlayerObject>(localPlayerId);
}

#endif

void Game::AssignParent(Object* child, Object* parent) {
    if (child->parent) {
        LOG_INFO("Reassigning parent for " << child << " from " << child->parent << " to " << parent << "!");
        DetachParent(child);
    }
    child->parent = parent;
    parent->children.insert(child);
}

void Game::DetachParent(Object* child) {
    if (!child->parent) {
        return;
    }
    Object* parent = child->parent;
    // TODO: assert has child
    parent->children.erase(child);
    child->parent = nullptr;
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
    // New objects get queued in from HandleReplication and EnsureObjectExists
    //   on the client, not through this set.
    for (auto& newObject : newObjects) {
        gameObjects[newObject->GetId()] = newObject;
        RequestReplication(newObject->GetId());
    }
    newObjects.clear();
#endif

    for (auto& object : gameObjects) {
        // Only tick on root objects
        if (object.second->parent == nullptr) {
            object.second->Tick(time);
        }
    }

#ifdef BUILD_SERVER
    for (auto& object : gameObjects) {
        if (!object.second->IsStatic() &&
            !IsPointInAABB(liveBoxStart, liveBoxSize, object.second->GetPosition()) &&
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

            // Move an object into root before destroying
            DetachParent(object);
            object->OnDeath();
            gameObjects.erase(objectId);
        #ifdef BUILD_SERVER
            deadSinceLastReplicate.insert(objectId);
        #endif
            delete object;
        }
    }
#ifdef BUILD_SERVER
    Replicate(time);
    ReplicateAnimations(time);
#endif
}

#ifdef BUILD_SERVER
/* A Replication Packet:
    {
        event: "r",
        objs: [ list of replicated objects ],
        time: client timestamp of last input.
        ticks: ticks server has processed sicne that last input
    }
  A Animation packet:
    {
        event: "a",
        objs: [ list of animations ]
    }
*/
void Game::SendData(PlayerSocketData* player, std::string message) {
    player->eventLoop->defer([player, message] () {
        // LOG_DEBUG(message);
        if (!player->ws->send(message, uWS::OpCode::TEXT)) {
            LOG_ERROR("Could not send!");
        }
    });
}

void Game::ReplicateAnimations(Time time) {
    if (animationPackets.empty()) return;

    rapidjson::StringBuffer output;
    rapidjson::Writer<rapidjson::StringBuffer> writer(output);
    writer.StartObject();

    writer.Key("event");
    writer.String("a");
    writer.Key("objs");
    writer.StartArray();
    for (auto& animation : animationPackets) {
        animation->Serialize(writer);
        delete animation;
    }
    animationPackets.clear();
    writer.EndArray();
    writer.EndObject();

    std::string outputData { output.GetString() };
    for (auto& player : players) {
        /*for (auto& object : serialized) {
            player->ws->send(object.second, uWS::OpCode::TEXT);
        }*/
        if (!player->isReady) continue;
        if (!player->hasInitialReplication) continue;
        SendData(player, outputData);
    }
}

void Game::InitialReplication(PlayerSocketData* data) {
    rapidjson::StringBuffer buffer;
    rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);

    writer.StartObject();
    writer.Key("event");
    writer.String("r");
    writer.Key("time");
    writer.Int(0);
    writer.Key("ticks");
    writer.Int(0);

    writer.Key("objs");
    writer.StartArray();
    for (auto& object : gameObjects) {
        // All Objects
        writer.StartObject();
        object.second->Serialize(writer);
        writer.EndObject();
    }
    writer.EndArray();

    // Initial Replication of all Models
    // This one will be slow
    // writer.Key("models");
    // writer.StartArray();
    // for (auto& model : modelManager.models) {
    //     writer.StartObject();
    //     model->Serialize(writer);
    //     writer.EndObject();
    // }
    // writer.EndArray();

    // writer.Key("lights");
    // SerializeDispatch(modelManager.lights, writer);

    writer.EndObject();
    SendData(data, buffer.GetString());
}

void Game::RequestReplication(ObjectID objectId) {
    // Should replicate all parents too
    Object* obj = gameObjects[objectId];
    while (obj != nullptr) {
        replicateNextTick.insert(obj->GetId());
        obj = obj->parent;
    }
}

void Game::QueueAllDirtyForReplication(Time time) {
    for (auto& object : gameObjects) {
        if (object.second->IsDirty()) {
            RequestReplication(object.first);
        }
    }
}

void Game::Replicate(Time time) {
    if (replicateNextTick.empty()) return;

    // LOG_DEBUG("Replicate (" << time << ") " << replicateNextTick.size() << " objects");

    rapidjson::StringBuffer buffer;
    rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
    writer.StartArray();

    for (auto& objectId : deadSinceLastReplicate) {
        writer.StartObject();
        writer.Key("id");
        writer.Uint(objectId);
        writer.Key("dead");
        writer.Bool(true);
        writer.EndObject();
    }

    deadSinceLastReplicate.clear();

    for (auto& objectId : replicateNextTick) {
        if (gameObjects.find(objectId) != gameObjects.end()) {
            gameObjects[objectId]->SetDirty(false);

            writer.StartObject();
            gameObjects[objectId]->Serialize(writer);
            writer.EndObject();
        }
    }
    replicateNextTick.clear();

    writer.EndArray();

    // std::scoped_lock<std::mutex> lock(playersSetMutex);
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
            rapidjson::StringBuffer output;
            rapidjson::Writer<rapidjson::StringBuffer> writer2(output);
            writer2.StartObject();

            writer2.Key("event");
            writer2.String("r");
            writer2.Key("time");
            writer2.Uint64(player->playerObject->lastClientInputTime);
            writer2.Key("ticks");
            writer2.Uint64(player->playerObject->ticksSinceLastProcessed);
            writer2.Key("objs");
            writer2.RawValue(buffer.GetString(), buffer.GetSize(), rapidjson::kArrayType);
            writer2.EndObject();

            SendData(player, output.GetString());
        }
        if (player->playerObjectDirty) {
            if (player->playerObject->GetId() != 0) {
                player->playerObjectDirty = false;
            }
            rapidjson::StringBuffer output;
            rapidjson::Writer<rapidjson::StringBuffer> writer2(output);
            writer2.StartObject();
            writer2.Key("playerLocalObjectId");
            writer2.Uint(player->playerObject->GetId());
            writer2.EndObject();
            SendData(player, output.GetString());
        }
    }
}
#endif

#ifdef BUILD_CLIENT
void Game::RollbackTime(Time time) {
    gameTime = time;
    for (auto& object : gameObjects) {
        object.second->SetLastTickTime(time);
    }
}

void Game::EnsureObjectExists(json& object) {
    if (!object.HasMember("id")) {
        LOG_ERROR("EnsureObjectExists: no ID on replication packet!");
        throw std::runtime_error("EnsureObjectExists: no ID on replication packet!");
    }
    ObjectID id = object["id"].GetUint();
    if (object.HasMember("dead")) {
        // Kill
        if (gameObjects.find(id) != gameObjects.end()) {
            delete gameObjects[id];
            gameObjects.erase(id);
            return;
        }
        return;
    }
    if (!object["t"].IsString()) {
        LOG_ERROR("Tag t is not a string in packet!");
        throw std::runtime_error("Tag t is not a string in packet!");
    }
    std::string objectType (object["t"].GetString(), object["t"].GetStringLength());
    if (gameObjects.find(id) == gameObjects.end()) {
        LOG_DEBUG("Got new object (" << id << ") " << objectType);
        auto& ClassLookup = GetClassLookup();
        if (ClassLookup.find(objectType) == ClassLookup.end()) {
            LOG_ERROR("Class " << objectType << " is not registered!");
            throw std::runtime_error("Class " + objectType + " is not registered!");
        }
        Object* obj = GetClassLookup()[objectType](*this);
        obj->SetId(id);
        obj->createdThisFrameOnClient = true;
        gameObjects[id] = obj;
    }
}

void Game::ProcessReplication(json& object) {
    ObjectID id = object["id"].GetUint();
    if (object.HasMember("dead")) {
        return;
    }
    Object* obj = GetObject(id);
    if (obj == nullptr) {
        LOG_ERROR("Replicating on non-existant object!" << id);
        return;
    }
    obj->ProcessReplication(object);
    if (obj->createdThisFrameOnClient) {
        obj->OnClientCreate();
        obj->createdThisFrameOnClient = false;
    }
}
#endif

RayCastResult Game::RayCastInWorld(RayCastRequest request) {
    RayCastResult result;
    for (auto& object : gameObjects) {
        if (object.second->IsCollisionExcluded(request.exclusionTags)) {
            continue;
        }
        if (request.excludeObjects.find(object.first) != request.excludeObjects.end()) {
            continue;
        }
        object.second->CollidesWith(request, result);
    }
    return result;
}

void Game::HandleCollisions(Object* obj) {
    Vector3 collisionResolution;
    for (auto& object : gameObjects) {
        if (obj == object.second) continue;

        bool shouldExclude = obj->IsCollisionExcluded(object.second->GetTags()) ||
            object.second->IsCollisionExcluded(obj->GetTags());

        bool shouldReport = obj->ShouldReportCollision(object.second->GetTags());
        // Check for Collision Exclusion
        CollisionResult r = obj->CollidesWith(object.second);
        if (r.isColliding) {
            r.collidedWith = object.second;
            if (!shouldExclude) {
                collisionResolution += r.collisionDifference;
            }
            if (shouldReport) {
                obj->OnCollide(r);
            }
        }
    }
    // LOG_DEBUG(collisionResolution);
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
    // Client does not do anything
    #ifdef BUILD_SERVER
        std::scoped_lock<std::mutex> lock(newObjectsMutex);
        ObjectID newId = RequestId();
        obj->SetId(newId);
        LOG_DEBUG("Add Object " << obj);
        newObjects.insert(obj);
    #endif
}

void Game::DestroyObject(ObjectID objectId) {
    // Let the client destroy an object (hopefully server responds back with correct)
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
            obj->SetPosition(Vector3(0, 30, 0));

            static_cast<PlayerObject*>(obj)->lastClientInputTime = playerObject->lastClientInputTime;
            static_cast<PlayerObject*>(obj)->ticksSinceLastProcessed = playerObject->ticksSinceLastProcessed;

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

void Game::GetUnitsInRange(const Vector3& position, float range,
    bool includeBoundingBox, std::vector<RangeQueryResult>& results) {

    SphereCollider collider { nullptr, position, range };

    for (auto& pair : gameObjects) {
        Object* obj = pair.second;
        double actualRange = glm::distance(position, obj->GetPosition());
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

bool Game::CheckLineSegmentCollide(const Vector3& start,
    const Vector3& end, uint64_t includeTags) {
    CollisionResult result;
    for (auto& object : gameObjects) {
        if (((uint64_t)object.second->GetTags() & includeTags) != 0) {
            bool r = object.second->CollidesWith(start, end);
            if (r) {
                return true;
            }
        }
    }
    return false;
}

void Game::PlayAudio(const std::string& audio, float volume, const Vector3& position) {
    #ifdef BUILD_CLIENT
        LOG_DEBUG("Playing audio " << audio);
        audioRequests.emplace_back(assetManager.GetAudio(audio), volume, position);
    #endif
}

void Game::PlayAudio(const std::string& audio, float volume, Object* boundObject) {
    #ifdef BUILD_CLIENT
        LOG_DEBUG("Playing audio " << audio);
        audioRequests.emplace_back(assetManager.GetAudio(audio), volume, boundObject->GetId());
    #endif
}