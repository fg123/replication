#pragma once

#include "replicable.h"

extern "C"
{
#include "wendy/vm.h"
}

// Provides integration between WendyScript and the rest of the game

class Game;

// Each object holds a context
class ScriptContext : public Replicable {

public:
    virtual void Serialize(JSONWriter& obj) override {
        Replicable::Serialize(obj);

    }

    virtual void ProcessReplication(json& obj) override {
        Replicable::ProcessReplication(obj);
    }
};

// Handles loading files / hot reload and running the actual VM
class ScriptManager {

    struct vm* vm = nullptr;

public:
    ScriptManager() {
        vm = vm_init();
    }

    ~ScriptManager() {
        vm_destroy(vm);
        vm = nullptr;
    }
};