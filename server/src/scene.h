#pragma once

#include <string>
#include <vector>

#include "replicable.h"
#include "vector.h"
#include "mesh.h"
#include "asset-manager.h"
#include "light.h"

// Manages / Serializes / De-serializes a Scene / SceneGraph

#if defined(BUILD_SERVER) || defined(BUILD_EDITOR)
    #define RESOURCE_PATH(path) (std::string("data/") + path)
#else
    #define RESOURCE_PATH(path) (path)
#endif

class Scene;

struct Node : public Replicable {
    REPLICATED(Vector3, position, "position");
    REPLICATED(Vector3, rotation, "rotation");
    REPLICATED(Vector3, scale, "scale");
    REPLICATED(std::string, name, "name");

    Matrix4 transform;

    Scene& scene;
    Node(Scene& scene) : scene(scene) {}

    virtual const char* GetNodeType() = 0;

    virtual void Serialize(JSONWriter& obj) override {
        Replicable::Serialize(obj);
        obj.Key("type");
        obj.String(GetNodeType());
    }
};

struct CollectionNode : public Node {
    std::vector<Node*> children;

    CollectionNode(Scene& scene) : Node(scene) {}

    ~CollectionNode() {
        for (auto& child : children) {
            delete child;
        }
    }
    virtual const char* GetNodeType() override { return "CollectionNode"; }

    virtual void Serialize(JSONWriter& obj) override {
        Node::Serialize(obj);
        obj.Key("children");
        obj.StartArray();
        for (auto child : children) {
            child->Serialize(obj);
        }
        obj.EndArray();
    }

    virtual void ProcessReplication(json& obj) override;
};

struct StaticModelNode : public Node {
    Model* model;

    StaticModelNode(Scene& scene) : Node(scene) {}

    virtual const char* GetNodeType() override { return "StaticModelNode"; }

    virtual void Serialize(JSONWriter& obj) override {
        Node::Serialize(obj);
        obj.Key("model");
        obj.String(model->name.c_str());
    }
    virtual void ProcessReplication(json& obj) override;
};

struct LightNode : public Node {
    Light* light;

    LightNode(Scene& scene) : Node(scene) {}

    virtual const char* GetNodeType() override { return "LightNode"; }

    virtual void Serialize(JSONWriter& obj) override {
        Node::Serialize(obj);
    }
};

class Scene {
    std::vector<std::string> models;
    std::vector<std::string> sounds;
    std::vector<std::string> scripts;

public:
    // Scene Tree
    CollectionNode root;

    AssetManager assetManager;

    Scene();
    ~Scene();

    void LoadFromFile(const std::string& filename);
    void WriteToFile(std::ostream& output);

    void FlattenHierarchy(std::vector<Node*>& output);
};
