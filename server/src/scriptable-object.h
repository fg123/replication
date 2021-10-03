#pragma once

#include "object.h"
#include "scripting.h"

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
        script.CallMemberFunction("OnClientCreate");
    }

    virtual void OnCreate() override {
        Object::OnCreate();
        #ifdef BUILD_SERVER
            script.InitializeInstance(className, GetId());
            script.CallMemberFunction("OnServerCreate");
        #endif
    }

    virtual void Tick(Time time) override {
        Object::Tick(time);
        script.CallMemberFunction("Tick", time);
    }

    virtual void OnCollide(CollisionResult& result) override {
        Object::OnCollide(result);
        script.CallMemberFunction("OnCollide", {
            make_data(D_NUMBER, data_value_num(result.collidedWith->GetId())),
            ConvertToWendy(result.collisionDifference)
        });
    }
};

CLASS_REGISTER(ScriptableObject);