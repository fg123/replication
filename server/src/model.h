#pragma once

#include "mesh.h"
#include "logging.h"
#include "replicable.h"

#include <string>

// Each Model corresponds to a specific file that's loaded from disk
using ModelID = uint32_t;

// Models are serialized once to client-side on connect / load but once loaded
//   they are referenced by ID
class Model : public Replicable {
public:
    REPLICATED(ModelID, id, "id");
    REPLICATED(std::vector<Mesh>, meshes, "meshes");

    ModelID GetId() { return id; }
};

class ModelManager {
    std::unordered_map<std::string, Model*> modelMap;

public:
    std::vector<Model*> models;
    std::vector<Light> lights;

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

};