#pragma once

#include <string>
#include <vector>

#include "vector.h"

// Manages / Serializes / De-serializes the scene

struct Node {
    Vector3 position;
    Vector3 rotation;
    Vector3 scale;
    std::string name;
    std::vector<Node*> children;
};

struct StaticMesh : public Node {
    std::string mesh;
};

struct Light : public Node {

};

class Scene {
    std::vector<std::string> models;
    std::vector<std::string> sounds;

    // Scene Tree

public:
    Scene();
    ~Scene();

    void LoadFromFile(const std::string& filename);
    void WriteToFile(const std::string& filename);
};
