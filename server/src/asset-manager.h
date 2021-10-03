#pragma once

#include <unordered_map>
#include <vector>
#include <string>

#include "model.h"
#include "mesh.h"
#include "logging.h"
#include "audio.h"
#include "script-manager.h"

class AssetManager {
    std::unordered_map<std::string, Model*> modelMap;

public:
    #ifdef BUILD_CLIENT
        std::unordered_map<std::string, Texture*> textures;
        std::unordered_map<std::string, Audio*> sounds;
    #endif

    std::vector<Model*> models;

    ~AssetManager();
    Model* GetModel(ModelID id) {
        if (id >= models.size()) {
            LOG_ERROR("GetModel for non-existant ID " << id);
            return nullptr;
        }
        return models[id];
    }

    Model* GetModel(const std::string& name) {
        if (modelMap.find(name) == modelMap.end()) {
            LOG_ERROR("GetModel for non-existant name " << name);
            return nullptr;
        }
        return modelMap[name];
    }

    ModelID LoadModel(const std::string& name, const std::string& path, std::istream& stream);

#ifdef BUILD_CLIENT
    Texture* LoadTexture(const std::string& path, Texture::Format format);
    Audio* LoadAudio(const std::string& name, const std::string& path);

    Audio* GetAudio(const std::string& name) {
        if (sounds.find(name) == sounds.end()) {
            LOG_ERROR("Audio " << name << " not found!");
            throw std::runtime_error("Audio " + name + " not found!");
        }
        return sounds[name];
    }
#endif

    void LoadDataFromDirectory(ScriptManager& scriptManager);
};