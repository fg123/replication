#pragma once

#include "object.h"
#include "game.h"

class StaticMeshObject : public Object {
    REPLICATED(std::string, model, "model");

    bool collidersSetup = false;

public:

    CLASS_CREATE(StaticMeshObject);

    StaticMeshObject(Game& game) : StaticMeshObject(game, "") {}

    StaticMeshObject(Game& game, const std::string& model) :
        Object(game), model(model) {
        SetTag(Tag::NO_GRAVITY);
        SetIsStatic(true);
        SetTag(Tag::GROUND);
        if (!model.empty()) {
            SetModel(game.GetModel(model));
            #ifdef BUILD_SERVER
                GenerateStaticMeshCollidersFromModel(this);
            #endif
        }
    }

    virtual void ProcessReplication(json& obj) override {
        Object::ProcessReplication(obj);
    #ifdef BUILD_CLIENT
        if (!collidersSetup) {
            collidersSetup = true;
            GenerateStaticMeshCollidersFromModel(this);
        }
    #endif
    }

    virtual void OnClientCreate() override {
        Object::OnClientCreate();
        GenerateStaticMeshCollidersFromModel(this);
    }
};

CLASS_REGISTER(StaticMeshObject);