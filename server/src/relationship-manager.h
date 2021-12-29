#pragma once

#include "object.h"
#include "replicable.h"
#include <unordered_set>

class Game;

// Handles how objects are scheduled to tick relative to one another
class RelationshipManager : public Replicable {
    Game& game;

    // Each object can only have one parent
    std::unordered_map<ObjectID, ObjectID> childParent;

    // For speed sake, we also store children
    std::unordered_map<ObjectID, std::unordered_set<ObjectID>> parentChildren;

    bool isDirty = false;

    void PrintDebug();
public:
    RelationshipManager(Game& game);

    // Tries to obtain parent, parent doesn't exist anymore, we prune
    Object* GetParent(ObjectID child);

    std::unordered_set<Object*> GetChildren(ObjectID parent);

    void SetParent(ObjectID child, ObjectID parent);

    void RemoveParent(ObjectID child);

    // Actually delegates the tick to all the objects
    void Tick(Time time);

    // Serialization Methods
    bool IsDirty() const;
    void ResetDirty();
    void Serialize(JSONWriter& obj) override;
    void ProcessReplication(json& obj) override;
};
