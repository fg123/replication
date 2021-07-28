#include "scene_graph_window.h"
#include "editor.h"

void SceneGraphWindow::DrawCurrentProperties() {
    if (selectedNode == nullptr) {
        ImGui::Text("No node selected");
        return;
    }
    ImGui::InputText("Name", &selectedNode->name);

    ImGui::DragFloat3("Position", glm::value_ptr(selectedNode->position));
    ImGui::DragFloat3("Rotation", glm::value_ptr(selectedNode->rotation));
    ImGui::DragFloat3("Scale", glm::value_ptr(selectedNode->scale));

}

void SceneGraphWindow::DrawTreeNode(Node* node) {
    int baseFlags = ImGuiTreeNodeFlags_SpanFullWidth | ImGuiTreeNodeFlags_DefaultOpen;
    if (node == selectedNode) {
        baseFlags |= ImGuiTreeNodeFlags_Selected;
    }

    if (CollectionNode* collectionNode = dynamic_cast<CollectionNode*>(node)) {
        std::string title = collectionNode->name + " (" + std::to_string(collectionNode->children.size()) + " items)";
        if (ImGui::TreeNodeEx(title.c_str(), baseFlags)) {
            for (Node* child : collectionNode->children) {
                DrawTreeNode(child);
            }
            ImGui::TreePop();
        }
    }
    else {
        if (ImGui::TreeNodeEx(node->name.c_str(), baseFlags | ImGuiTreeNodeFlags_Bullet | ImGuiTreeNodeFlags_Leaf)) {
            selectedNode = node;
        }
        ImGui::TreePop();
    }
}

void SceneGraphWindow::Draw(Editor& editor) {
    if (!isVisible) return;
    ImGui::Begin("Scene Graph", &isVisible, ImGuiWindowFlags_NoCollapse);

    DrawTreeNode(&editor.scene.root);
    ImGui::Separator();
    DrawCurrentProperties();
    ImGui::End();
}