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
class CollectionNode;

struct Node : public Replicable {
    CollectionNode* parent = nullptr;

    REPLICATED(Vector3, position, "position");
    REPLICATED(Vector3, rotation, "rotation");
    REPLICATED(Vector3, scale, "scale");
    REPLICATED(std::string, name, "name");

    Matrix4 transform;

    Matrix4 transformWithoutScale;

    Scene& scene;
    Node(Scene& scene) : scene(scene) {
        scale = Vector3(1, 1, 1);
    }

    virtual const char* GetNodeType() = 0;

    virtual void Serialize(JSONWriter& obj) override {
        Replicable::Serialize(obj);
        obj.Key("type");
        obj.String(GetNodeType());
    }

    Vector3 GetDirection() {
        // Euler Angles to Facing Vector
        return glm::yawPitchRoll(glm::radians(rotation.x), glm::radians(rotation.y),
            glm::radians(rotation.z)) * Vector4(Vector::Forward, 0.0f);
    }

    static Node* Create(Scene& scene, json& obj);
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
            obj.StartObject();
            child->Serialize(obj);
            obj.EndObject();
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
    LightShape shape = LightShape::Point;

    REPLICATED_D(int, shadowMapSize, "shadowMapSize", 0);

    // For all lights
    REPLICATED_D(float, strength, "strength", 10.0f);
    REPLICATED_D(Vector3, color, "color", Vector3(1));

    // For rectangular
    REPLICATED_D(Vector3, volumeOffset, "volumeOffset", Vector3(0, 0, -0.5));
    REPLICATED_D(Vector3, volumeSize, "volumeSize", Vector3(2, 2, 2));

    #ifdef BUILD_CLIENT
        GLuint shadowFrameBuffer = 0;
        GLuint shadowDepthMap = 0;
        GLuint shadowColorMap = 0;

        Matrix4 depthBiasMVPNear;
        Matrix4 depthBiasMVPMid;
        Matrix4 depthBiasMVPFar;
    #endif

    DefaultMaterial defaultMaterial;

    LightNode(Scene& scene) : Node(scene) {}

    virtual const char* GetNodeType() override { return "LightNode"; }

    virtual void Serialize(JSONWriter& obj) override {
        Node::Serialize(obj);
        obj.Key("shape");
        obj.Int((int) shape);
    }

    virtual void ProcessReplication(json& obj) override {
        Node::ProcessReplication(obj);
        shape = (LightShape)(obj["shape"].GetInt());
    }

    Matrix4 GetRectangleVolumeTransform() {
        return transform * glm::scale(volumeSize) * glm::translate(volumeOffset);
    }
};

struct CollectionReferenceNode : public Node {
    // This is 1 indexed!!!
    REPLICATED_D(size_t, index, "index", 0);

    CollectionReferenceNode(Scene& scene) : Node(scene) {}

    virtual const char* GetNodeType() override { return "CollectionReferenceNode"; }
};

class Scene {
public:
    std::vector<std::string> models;
    std::vector<std::string> sounds;
    std::vector<std::string> scripts;

    // Scene Tree
    CollectionNode root;
    std::vector<CollectionNode*> collections;

    AssetManager assetManager;

    Scene();
    ~Scene();

    void LoadFromFile(const std::string& filename);
    void WriteToFile(std::ostream& output);

    void FlattenHierarchy(std::vector<Node*>& output, Node* root);
};
