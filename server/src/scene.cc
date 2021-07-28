#include "scene.h"
#include <fstream>
#include <queue>

Scene::Scene() : root(*this) {

}

Scene::~Scene() { }

void Scene::LoadFromFile(const std::string& filename) {
    std::ifstream mapFile(filename);

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
    root.Serialize(writer);
    writer.EndObject();
}

void StaticModelNode::ProcessReplication(json& obj) {
    Node::ProcessReplication(obj);
    model = scene.assetManager.GetModel(obj["model"].GetString());
}

void CollectionNode::ProcessReplication(json& obj) {
    Node::ProcessReplication(obj);
    for (auto& child : children) {
        delete child;
    }
    children.clear();
    for (auto& child : obj["children"].GetArray()) {
        std::string str = child["type"].GetString();
        if (str == "CollectionNode") {
            children.emplace_back(new CollectionNode(scene));
        }
        else if (str == "StaticModelNode") {
            children.emplace_back(new StaticModelNode(scene));
        }
        else if (str == "LightNode") {
            children.emplace_back(new LightNode(scene));
        }
        else {
            throw std::runtime_error("Unknown node type: " + str);
        }
        children.back()->ProcessReplication(child);
    }
}

struct NodeIterationEntry {
    Node* node;
    Matrix4 parentTransform;

    NodeIterationEntry(Node* node, Matrix4 parentTransform) :
        node(node), parentTransform(parentTransform) { }
};

void Scene::FlattenHierarchy(std::vector<Node*>& output) {
    std::queue<NodeIterationEntry> hierarchyQueue;
    hierarchyQueue.emplace(&root, Matrix4{});
    while (!hierarchyQueue.empty()) {
        NodeIterationEntry entry = hierarchyQueue.front();
        hierarchyQueue.pop();

        Node* node = entry.node;
        Matrix4 localTransform =
            glm::translate(node->position) *
            glm::yawPitchRoll(node->rotation.x, node->rotation.y, node->rotation.z) *
            glm::scale(node->scale);

        node->transform = entry.parentTransform * localTransform;

        if (CollectionNode* collection = dynamic_cast<CollectionNode*>(node)) {
            for (Node* child : collection->children) {
                hierarchyQueue.emplace(child, collection->transform);
            }
        }
        output.push_back(node);
    }
}