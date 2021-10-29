#pragma once

#include "object.h"
#include "scripting.h"

class ScriptableObject : public Object {
public:
    CLASS_CREATE(ScriptableObject);
    REPLICATED(std::string, className, "cn");
    REPLICATED(ScriptInstance, script, "script");

    ScriptableObject(Game& game) : ScriptableObject(game, "") {}
    ScriptableObject(Game& game, const std::string& className) :
        Object(game), className(className) { }

    virtual void ProcessReplication(json& data) override;

    virtual void OnClientCreate() override;

    virtual void OnCreate() override;

    virtual void Tick(Time time) override;

    virtual void OnCollide(CollisionResult& result) override;
};

CLASS_REGISTER(ScriptableObject);