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
public:
    std::vector<Model*> models;

    Model* GetModel(ModelID id) {
        if (id >= models.size()) {
            LOG_ERROR("GetModel for non-existant ID " << id);
            return nullptr;
        }
        return models[id];
    }

    ModelID LoadModel(const std::string& name, const std::string& path, std::istream& stream);
};