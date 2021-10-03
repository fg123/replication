#pragma once

#include "replicable.h"
#include "timer.h"
#include "scripting-interface.h"
#include <vector>

// Provides integration between WendyScript and the rest of the game
class Game;
class Object;
using ObjectID = uint32_t;

void WendyCallMemberFunction(struct data structInstance,
    const std::string& member, const std::vector<struct data> arguments);

// Each object holds an instance
class ScriptInstance : public Replicable {
    struct data classInstance;
public:
    std::string className;
    ScriptInstance();
    ~ScriptInstance();

    virtual void Serialize(JSONWriter& obj) override;

    virtual void ProcessReplication(json& obj) override;

    void InitializeInstance(const std::string& className, ObjectID id);

    // Dispatch Events
    template<typename... Ts>
    void CallMemberFunction(const std::string& member,
        const Ts&... args) {
        WendyCallMemberFunction(classInstance, member, {
            ConvertToWendy(args)...
        });
    }

    void CallMemberFunction(const std::string& member,
        const std::vector<struct data>& arguments) {
        WendyCallMemberFunction(classInstance, member, arguments);
    }
};

// Each class has a script
class Script {
public:
    uint8_t* bytecode = nullptr;
    size_t size = 0;
    ~Script();

    void LoadAndCompile(const std::string& path);
};
