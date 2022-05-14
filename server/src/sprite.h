#pragma once

#include "object.h"
#include "model.h"
#include "game.h"

class SpriteObject : public Object {
    REPLICATED(std::string, texture, "tex");

    #ifdef BUILD_CLIENT
        bool materialSetup = false;
        DefaultMaterial* material = nullptr;
    #endif
public:
    CLASS_CREATE(SpriteObject);

    SpriteObject(Game& game) : SpriteObject(game, "") { }
    SpriteObject(Game& game, const std::string& texture) : Object(game), texture(texture) {
        // Make a Copy
        if (const auto& _model = game.GetAssetManager().GetModel("Quad.obj")) {
            SetModel(_model);
        }
        else {
            LOG_ERROR("Could not find quad model!");
            throw std::runtime_error("Could not find quad model!");
        }

        isStatic = true;
    }

    ~SpriteObject() {
        #ifdef BUILD_CLIENT
            delete material;
        #endif
    }

    virtual void ProcessReplication(json& obj) override {
        Object::ProcessReplication(obj);
    #ifdef BUILD_CLIENT
        // Override Model
        if (!materialSetup) {
            materialSetup = true;
            if (!model || model->meshes.empty()) return;
            material = new DefaultMaterial;

            // Custom Model
            material->illum = -1;
            material->map_Kd = game.GetAssetManager().LoadTexture(texture, Texture::Format::RGBA);

            materialOverrides[model->meshes[0]] = material;
        }
    #endif
    }
};

CLASS_REGISTER(SpriteObject);