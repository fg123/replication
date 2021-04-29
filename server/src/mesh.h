#pragma once

#include "glm.h"
#include "replicable.h"
#include "vector.h"

#include <string>
#include <vector>

// Handles Meshes and Vertex Data for Rendering

struct Vertex : public Replicable {
    REPLICATED(Vector3, position, "p");
    REPLICATED(Vector3, normal, "n");
    REPLICATED(Vector2, texCoords, "t");
};

class Mesh : public Replicable {
public:
	REPLICATED(std::string, name, "name");
    REPLICATED(std::vector<Vertex>, vertices, "vertices");
    REPLICATED(std::vector<unsigned int>, indices, "indices");
    // std::vector<Texture> textures;
    // TODO: material
};
