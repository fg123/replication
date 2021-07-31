#pragma once

#include "object.h"
#include "model.h"
#include "game.h"

class SpriteObject : public Object {
    REPLICATED(std::string, texture, "tex");
    Model customQuad;

    #ifdef BUILD_CLIENT
        bool materialSetup = false;
    #endif
public:
    CLASS_CREATE(SpriteObject);

    SpriteObject(Game& game) : SpriteObject(game, "") { }
    SpriteObject(Game& game, const std::string& texture) : Object(game), texture(texture) {
        // Make a Copy
        customQuad = *game.GetModel("Quad.obj");

        isStatic = true;
    }

    virtual void ProcessReplication(json& obj) override {
        Object::ProcessReplication(obj);
    #ifdef BUILD_CLIENT
        // Override Model
        model = &customQuad;
        if (!materialSetup) {
            materialSetup = true;
            DefaultMaterial* material = new DefaultMaterial;
            customQuad.meshes[0]->material = material;

            // Custom Model
            material->illum = -1;
            material->map_Kd = game.GetAssetManager().LoadTexture(texture, Texture::Format::RGBA);
        }
    #endif
    }
};

CLASS_REGISTER(SpriteObject);