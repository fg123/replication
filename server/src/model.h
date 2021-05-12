#pragma once

#include "mesh.h"
#include "logging.h"
#include "replicable.h"

#include <string>


// Each Model corresponds to a specific file that's loaded from disk
using ModelID = uint32_t;

class Model {
public:
    ModelID id;
    std::vector<Mesh> meshes;

    ModelID GetId() { return id; }
};

