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
struct CollectionNode;

struct Node : public Replicable {
    CollectionNode* parent = nullptr;

    REPLICATED(Vector3, position, "position");
    REPLICATED(Vector3, rotation, "rotation");
    REPLICATED(Vector3, scale, "scale");
    REPLICATED(std::string, name, "name");

    Node() {
        scale = Vector3(1, 1, 1);
    }

    virtual const char* GetNodeType() = 0;

    virtual void Serialize(JSONWriter& obj) override {
        Replicable::Serialize(obj);
        obj.Key("type");
        obj.String(GetNodeType());
    }

    Matrix4 GetRotationQuat() {
        return glm::yawPitchRoll(glm::radians(rotation.x), glm::radians(rotation.y),
            glm::radians(rotation.z));
    }
    Vector3 GetDirection() {
        // Euler Angles to Facing Vector
        return GetRotationQuat() * Vector4(Vector::Forward, 0.0f);
    }

    static Node* Create(Scene& scene, json& obj);
};

struct CollectionNode : public Node {
    std::vector<Node*> children;
    Scene& scene;

    CollectionNode(Scene& scene) : Node(), scene(scene) {}

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
    AssetManager& assetManager;

    StaticModelNode(AssetManager& assetManager) : Node(), assetManager(assetManager) {}

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
        DefaultMaterial defaultMaterial;
    #endif

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

    Matrix4 GetRectangleVolumeTransform(const Matrix4& transform) {
        return transform * glm::scale(volumeSize) * glm::translate(volumeOffset);
    }

};

struct CollectionReferenceNode : public Node {
    // This is 1 indexed!!!
    REPLICATED_D(uint64_t, index, "index", 0);

    virtual const char* GetNodeType() override { return "CollectionReferenceNode"; }
};

struct TransformedNode : public Replicable {
    Node* node;
    Matrix4 transform;
    Vector3 transformedPosition;
    Vector3 transformedDirection;
};

struct TransformedLight : public TransformedNode {
    #ifdef BUILD_CLIENT
        GLuint shadowFrameBuffer = 0;
        GLuint shadowDepthMap = 0;
        GLuint shadowColorMap = 0;

        Matrix4 depthBiasMVPNear;
        Matrix4 depthBiasMVPMid;
        Matrix4 depthBiasMVPFar;
        void InitializeLight();
    #endif
    TransformedLight() {}
    TransformedLight(const TransformedNode& node) : TransformedNode(node) {}
    ~TransformedLight() {
        #ifdef BUILD_CLIENT
            if (shadowFrameBuffer) {
                glDeleteFramebuffers(1, &shadowFrameBuffer);
                shadowFrameBuffer = 0;
            }
            if (shadowDepthMap) {
                glDeleteTextures(1, &shadowDepthMap);
                shadowDepthMap = 0;
            }
            if (shadowColorMap) {
                glDeleteTextures(1, &shadowColorMap);
                shadowColorMap = 0;
            }
        #endif
    }
    void Update(const TransformedNode& node) {
        (*(TransformedNode*)this) = node;
    }
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

    void FlattenHierarchy(std::vector<TransformedNode>& output, Node* root);
};
