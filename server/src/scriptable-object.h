#pragma once

#include "object.h"

class ScriptableObject : public Object {
public:
    CLASS_CREATE(ScriptableObject);
    REPLICATED(std::string, className, "cn");
    REPLICATED(ScriptInstance, script, "script");

    ScriptableObject(Game& game) : Object(game) {}
    ScriptableObject(Game& game, const std::string& className) : Object(game), className(className) {
    }

    virtual void ProcessReplication(json& data) override {
        Object::ProcessReplication(data);
    }

    virtual void OnClientCreate() override {
        Object::OnClientCreate();
        script.InitializeInstance(className, GetId());
        script.OnClientCreate();
    }

    virtual void OnCreate() override {
        Object::OnCreate();
        #ifdef BUILD_SERVER
            script.InitializeInstance(className, GetId());
            script.OnCreate();
        #endif
    }

    virtual void Tick(Time time) override {
        Object::Tick(time);
        script.OnTick(time);
    }
};

CLASS_REGISTER(ScriptableObject);