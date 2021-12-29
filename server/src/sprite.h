#pragma once

#include "object.h"
#include "model.h"
#include "game.h"

class SpriteObject : public Object {
    REPLICATED(std::string, texture, "tex");
    Model customQuad;

    #ifdef BUILD_CLIENT
        bool materialSetup = false;
        DefaultMaterial* material = nullptr;
    #endif
public:
    CLASS_CREATE(SpriteObject);

    SpriteObject(Game& game) : SpriteObject(game, "") { }
    SpriteObject(Game& game, const std::string& texture) : Object(game), texture(texture) {
        // Make a Copy
        if (auto model = game.GetAssetManager().GetModel("Quad.obj")) {
            customQuad = Model(*model);
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
        model = &customQuad;
        if (!materialSetup) {
            materialSetup = true;
            material = new DefaultMaterial;
            customQuad.meshes[0]->material = material;

            // Custom Model
            material->illum = -1;
            material->map_Kd = game.GetAssetManager().LoadTexture(texture, Texture::Format::RGBA);
        }
    #endif
    }
};

CLASS_REGISTER(SpriteObject);