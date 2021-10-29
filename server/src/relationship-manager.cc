#include "relationship-manager.h"
#include "game.h"

#include <queue>

RelationshipManager::RelationshipManager(Game& game) : game(game) {}

void RelationshipManager::RemoveParent(ObjectID child) {
    parentChildren[childParent[child]].erase(child);
    childParent.erase(child);
    isDirty = true;
}

void RelationshipManager::SetParent(ObjectID child, ObjectID parent) {
    if (parent == child) {
        return;
    }
    if (childParent.find(child) != childParent.end()) {
        // Already have a parent
        RemoveParent(child);
    }
    childParent[child] = parent;
    parentChildren[parent].insert(child);
    isDirty = true;
}

Object* RelationshipManager::GetParent(ObjectID child) {
    if (childParent.find(child) == childParent.end()) {
        return nullptr;
    }
    Object* parent = game.GetObject(childParent[child]);
    if (!parent) {
        RemoveParent(child);
        return nullptr;
    }
    return parent;
}

std::unordered_set<Object*> RelationshipManager::GetChildren(ObjectID parent) {
    if (parentChildren.find(parent) == parentChildren.end()) {
        return {};
    }
    std::unordered_set<Object*> children;
    for (ObjectID child : parentChildren[parent]) {
        Object* childObj = game.GetObject(child);
        if (!childObj) {
            RemoveParent(child);
        }
        else {
            children.insert(childObj);
        }
    }
    return children;
}

void RelationshipManager::Tick(Time time) {
    std::queue<ObjectID> tickQueue;

    for (auto& object : game.GetGameObjects()) {
        if (GetParent(object.first)) continue;
        tickQueue.push(object.first);
    }

    while (!tickQueue.empty()) {
        ObjectID object = tickQueue.front();
        tickQueue.pop();

        Time start = Timer::NowMicro();
        game.GetObject(object)->Tick(time);
        Time end = Timer::NowMicro();
        game.averageObjectTickTime.InsertValue(end - start);

        for (auto& child : parentChildren[object]) {
            if (!game.GetObject(child)) {
                RemoveParent(child);
                continue;
            }
            tickQueue.push(child);
        }
    }
    auto it = parentChildren.begin();
    while (it != parentChildren.end()) {
        if (it->second.empty()) {
            it = parentChildren.erase(it);
            isDirty = true;
        }
        else {
            it++;
        }
    }
}


void RelationshipManager::Serialize(JSONWriter& obj) {
    Replicable::Serialize(obj);
    obj.Key("r");
    obj.StartArray();
    for (auto& pair : childParent) {
        obj.Uint64(pair.first);
        obj.Uint64(pair.second);
    }
    obj.EndArray();
}

void RelationshipManager::ProcessReplication(json& obj) {
    Replicable::ProcessReplication(obj);
    childParent.clear();
    parentChildren.clear();

    ObjectID parent = 0;
    for (auto& entry : obj["r"].GetArray()) {
        if (parent == 0) {
            parent = entry.GetUint64();
        }
        else {
            SetParent(entry.GetUint64(), parent);
            parent = 0;
        }
    }
}

bool RelationshipManager::IsDirty() const {
    return isDirty;
}

void RelationshipManager::ResetDirty() {
    isDirty = false;
}