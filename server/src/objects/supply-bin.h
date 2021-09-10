#pragma once

#include "object.h"
#include "game.h"

#include "static-mesh.h"

class SupplyBinObject : public Object {
    #ifdef BUILD_SERVER
        StaticMeshObject* lidObject;
    #endif

public:
    CLASS_CREATE(SupplyBinObject);

    SupplyBinObject(Game& game) : Object(game) {
        #ifdef BUILD_SERVER
            SetModel(game.GetModel("SupplyBin.obj"));
            GenerateStaticMeshCollidersFromModel(this);
            SetIsStatic(true);

            lidObject = new StaticMeshObject(game, "SupplyBinLid.obj");
            game.AssignParent(lidObject, this);
            game.AddObject(lidObject);
        #endif
    }

    virtual void Tick(Time time) override {
        Object::Tick(time);
        #ifdef BUILD_SERVER
            lidObject->SetPosition(GetPosition());
            lidObject->SetRotation(GetRotation());
        #endif
    }
};

CLASS_REGISTER(SupplyBinObject);