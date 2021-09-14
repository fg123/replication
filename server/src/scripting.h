#pragma once

#include "replicable.h"
#include "timer.h"
#include "collision.h"
#include <vector>

extern "C"
{
#include "wendy/vm.h"
}

// Provides integration between WendyScript and the rest of the game
class Game;
class Object;
using ObjectID = uint32_t;

void CallMemberFunction(struct data structInstance,
    const std::string& member, const std::vector<struct data> arguments);

// Each object holds an instance
class ScriptInstance : public Replicable {
    struct data classInstance;
public:
    std::string className;

    virtual void Serialize(JSONWriter& obj) override;

    virtual void ProcessReplication(json& obj) override;

    void InitializeInstance(const std::string& className, ObjectID id);

    // Events
    void OnTick(Time time) {
        CallMemberFunction(classInstance, "OnTick", {
            make_data(D_NUMBER, data_value_num(time))
        });
    }
    void OnCollide(CollisionResult& collision);
    void OnClientCreate() {
        CallMemberFunction(classInstance, "OnClientCreate", {});
    }

    void OnServerCreate() {
        CallMemberFunction(classInstance, "OnServerCreate", {});
    }

};

// Each class has a script
struct Script {
    uint8_t* bytecode = nullptr;
    size_t size = 0;
    ~Script();

    void LoadAndCompile(const std::string& path);
};

// Handles loading files / hot reload and running the actual VM
class ScriptManager {
    std::vector<Script*> scripts;
public:
    static struct vm* vm;
    static Game* game;

    ScriptManager(Game* game);
    ~ScriptManager();

    void AddScript(const std::string& path);
    void InitializeVM();

    std::string GetBaseTypeFromScriptingType(const std::string& type);
};
