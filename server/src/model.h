#pragma once

#include "mesh.h"
#include "logging.h"
#include "replicable.h"

#include <string>


// Each Model corresponds to a specific file that's loaded from disk
using ModelID = uint32_t;

class Model {
public:
    std::string name;
    ModelID id;

    // Meshes to be rendered
    std::vector<Mesh*> meshes;

    // Meshes marked otherwise
    std::vector<Mesh*> otherMeshes;

    ~Model() {
        for (Mesh* mesh : meshes) {
            delete mesh;
        }
        for (Mesh* mesh : otherMeshes) {
            delete mesh;
        }
    }
    ModelID GetId() { return id; }
};

