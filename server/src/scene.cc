#include "scene.h"
#include <fstream>
#include <queue>

Scene::Scene() : root(*this) {

}

Scene::~Scene() {
    for (auto& collection : collections) {
        delete collection;
    }
}

void Scene::LoadFromFile(const std::string& filename) {
    std::ifstream mapFile(filename);

    if (!mapFile.is_open()) {
        throw "Could not open " + filename;
    }
    rapidjson::IStreamWrapper stream(mapFile);

    JSONDocument obj;
    obj.ParseStream(stream);

    // Process Models
    for (json& model : obj["models"].GetArray()) {
        std::string modelName = model.GetString();
        std::string modelPath = RESOURCE_PATH("models/" + modelName);
        LOG_INFO("Loading " << modelPath);
        std::ifstream modelStream (modelPath);
        if (!modelStream.is_open()) {
            LOG_ERROR("Could not load model " << modelPath);
            throw std::system_error(errno, std::system_category(), "failed to open " + modelPath);
        }
        assetManager.LoadModel(modelName, modelPath, modelStream);
        models.push_back(modelName);
    }

    // Process Scripts
    for (json& script : obj["scripts"].GetArray()) {
        scripts.push_back(script.GetString());
    }

    for (json& audio : obj["sounds"].GetArray()) {
        sounds.push_back(audio.GetString());
    }

    // Process Root
    root.ProcessReplication(obj["root"]);

    for (json& collectionObj : obj["collections"].GetArray()) {
        CollectionNode* node = new CollectionNode(*this);
        collections.push_back(node);
        node->ProcessReplication(collectionObj);
    }
}

void Scene::WriteToFile(std::ostream& output) {
    rapidjson::StringBuffer buffer;
    JSONWriter writer(buffer);
    writer.StartObject();
    writer.Key("models");
    writer.StartArray();
    for (const std::string& model : models) {
        writer.String(model.c_str());
    }
    writer.EndArray();
    writer.Key("scripts");
    writer.StartArray();
    for (const std::string& script : scripts) {
        writer.String(script.c_str());
    }
    writer.EndArray();
    writer.Key("sounds");
    writer.StartArray();
    for (const std::string& sound : sounds) {
        writer.String(sound.c_str());
    }
    writer.EndArray();

    writer.Key("root");
    writer.StartObject();
    root.Serialize(writer);
    writer.EndObject();

    writer.Key("collections");
    writer.StartArray();
    for (auto& collection : collections) {
        writer.StartObject();
        collection->Serialize(writer);
        writer.EndObject();
    }
    writer.EndArray();
    writer.EndObject();
    output << buffer.GetString();
}

Node* Node::Create(Scene& scene, json& obj) {
    Node* node;
    std::string str = obj["type"].GetString();
    if (str == "CollectionNode") {
        node = new CollectionNode(scene);
    }
    else if (str == "StaticModelNode") {
        node = new StaticModelNode(scene.assetManager);
    }
    else if (str == "LightNode") {
        node = new LightNode;
    }
    else if (str == "CollectionReferenceNode") {
        node = new CollectionReferenceNode;
    }
    else {
        throw std::runtime_error("Unknown node type: " + str);
    }
    node->ProcessReplication(obj);
    return node;
}

void StaticModelNode::ProcessReplication(json& obj) {
    Node::ProcessReplication(obj);
    model = assetManager.GetModel(obj["model"].GetString());
}

void CollectionNode::ProcessReplication(json& obj) {
    Node::ProcessReplication(obj);
    for (auto& child : children) {
        delete child;
    }
    children.clear();
    for (auto& child : obj["children"].GetArray()) {
        children.emplace_back(Node::Create(scene, child));
    }
    for (size_t i = 0; i < children.size(); i++) {
        children[i]->parent = this;
    }
}

struct NodeIterationEntry {
    Node* node;
    Matrix4 parentTransform;

    NodeIterationEntry(Node* node, Matrix4 parentTransform) :
        node(node), parentTransform(parentTransform) { }
};

void Scene::FlattenHierarchy(std::vector<TransformedNode>& output, Node* root) {
    std::queue<NodeIterationEntry> hierarchyQueue;
    hierarchyQueue.emplace(root, Matrix4{});
    while (!hierarchyQueue.empty()) {
        NodeIterationEntry entry = hierarchyQueue.front();
        hierarchyQueue.pop();

        Node* node = entry.node;
        Matrix4 localTransform =
            glm::translate(node->position) *
            glm::yawPitchRoll(glm::radians(node->rotation.x), glm::radians(node->rotation.y), glm::radians(node->rotation.z)) *
            glm::scale(node->scale);

        TransformedNode& transformed = output.emplace_back();
        transformed.node = node;
        transformed.transform = entry.parentTransform * localTransform;
        Quaternion worldRotation;
        Vector3 scale;
        Vector3 skew;
        Vector4 perspective;
        glm::decompose(transformed.transform, scale, worldRotation, transformed.transformedPosition, skew, perspective);
        transformed.transformedDirection = worldRotation * Vector::Forward;

        if (CollectionNode* collection = dynamic_cast<CollectionNode*>(node)) {
            for (Node* child : collection->children) {
                hierarchyQueue.emplace(child, transformed.transform);
            }
        }
        else if (CollectionReferenceNode* collection = dynamic_cast<CollectionReferenceNode*>(node)) {
            // 1 indexed
            if (collection->index > 0 && collection->index <= collections.size()) {
                hierarchyQueue.emplace(collections[collection->index - 1], transformed.transform);
            }
        }

    }
}

#ifdef BUILD_CLIENT
void TransformedLight::InitializeLight() {
    static int setShadowMapSize = 0;
    LightNode* lightNode = dynamic_cast<LightNode*>(node);
    if (setShadowMapSize == lightNode->shadowMapSize) {
        return;
    }
    setShadowMapSize = lightNode->shadowMapSize;
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

    // We use SHADOW_WIDTH * 2 due to cascading shadow map and SHADOW_HEIGHT * 2
    glGenTextures(1, &shadowColorMap);
    glBindTexture(GL_TEXTURE_2D, shadowColorMap);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA,
                lightNode->shadowMapSize * 2, lightNode->shadowMapSize * 2, 0, GL_RGBA, GL_UNSIGNED_BYTE, NULL);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    glGenTextures(1, &shadowDepthMap);
    glBindTexture(GL_TEXTURE_2D, shadowDepthMap);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_DEPTH_COMPONENT24,
                lightNode->shadowMapSize * 2, lightNode->shadowMapSize * 2, 0, GL_DEPTH_COMPONENT, GL_UNSIGNED_INT, NULL);

    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    glGenFramebuffers(1, &shadowFrameBuffer);
    glBindFramebuffer(GL_FRAMEBUFFER, shadowFrameBuffer);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, shadowColorMap, 0);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_TEXTURE_2D, shadowDepthMap, 0);

    GLenum status = glCheckFramebufferStatus(GL_FRAMEBUFFER);

    if (status != GL_FRAMEBUFFER_COMPLETE) {
        LOG_ERROR("FB error, status: " << status);
    }
}
#endif