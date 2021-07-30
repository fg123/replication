#include "scene_graph_window.h"
#include "editor.h"
#include "scene.h"

void SceneGraphWindow::DrawCurrentProperties() {
    if (selectedNode == nullptr) {
        ImGui::Text("No node selected");
        return;
    }
    ImGui::InputText("Name", &selectedNode->name);

    ImGui::DragFloat3("Position", glm::value_ptr(selectedNode->position), 0.05f);
    ImGui::DragFloat3("Rotation", glm::value_ptr(selectedNode->rotation), 0.05f);
    ImGui::DragFloat3("Scale", glm::value_ptr(selectedNode->scale), 0.05f);

    if (LightNode* lightNode = dynamic_cast<LightNode*>(selectedNode)) {
        ImGui::Separator();
        ImGui::Combo("Light Shape", (int*)&lightNode->shape, "Point\0Rectangular\0Sun\0");

        ImGui::Separator();
        ImGui::ColorEdit3("Color", glm::value_ptr(lightNode->color));
        ImGui::DragFloat("Strength", &lightNode->strength, 0.01f, 0.0f, FLT_MAX);
        if (lightNode->shape == LightShape::Point) {
            if (ImGui::Button("Auto scale volume by strength")) {
                lightNode->scale = glm::vec3(glm::sqrt(lightNode->strength / 0.01));
            }
        }
        if (lightNode->shape == LightShape::Rectangle) {
            ImGui::DragFloat3("Volume Size", glm::value_ptr(lightNode->volumeSize), 0.05f);
            ImGui::DragFloat3("Volume Offset", glm::value_ptr(lightNode->volumeOffset), 0.05f);
        }
    }
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
        if (ImGui::TreeNodeEx(node->name.c_str(), baseFlags | ImGuiTreeNodeFlags_Leaf)) {
            ImGui::TreePop();
        }
        if (ImGui::IsItemClicked()) {
            selectedNode = node;
        }
    }
}

void SceneGraphWindow::Draw(Editor& editor) {
    if (!isVisible) return;
    ImGui::Begin("Scene Graph", &isVisible, ImGuiWindowFlags_NoCollapse | ImGuiWindowFlags_MenuBar);
    bool showSelectModelMenu = false;

    if (ImGui::BeginMenuBar()) {
        if (ImGui::BeginMenu("Add")) {
            if (ImGui::MenuItem("Static Model")) {
                showSelectModelMenu = true;
            }

            if (ImGui::MenuItem("Light")) {
                LightNode* node = new LightNode(editor.scene);
                node->name = "New Light";
                editor.scene.root.children.push_back(node);
            }

            if (ImGui::MenuItem("Collection")) {
                CollectionNode* node = new CollectionNode(editor.scene);
                editor.scene.collections.emplace_back(node);
                node->name = "New Collection";
            }

            ImGui::EndMenu();
        }
        ImGui::EndMenuBar();
    }

    if (showSelectModelMenu) {
        ImGui::OpenPopup("Select Model");
    }
    ImVec2 center = ImGui::GetMainViewport()->GetCenter();
    ImGui::SetNextWindowPos(center, ImGuiCond_Appearing, ImVec2(0.5f, 0.5f));

    if (ImGui::BeginPopupModal("Select Model", NULL, ImGuiWindowFlags_AlwaysAutoResize)) {
        static size_t selectedModelIdx = 0;
        static ImGuiTextFilter modelFilter;
        modelFilter.Draw("Filter Models");
        ImGui::SetItemDefaultFocus();
        if (ImGui::BeginListBox("Models")) {
            for (size_t i = 0; i < editor.scene.models.size(); i++) {
                auto& model = editor.scene.models[i];
                if (modelFilter.PassFilter(model.c_str())) {
                    const bool is_selected = (selectedModelIdx == i);
                    if (ImGui::Selectable(model.c_str(), is_selected)) {
                        selectedModelIdx = i;
                    }
                }
            }
            ImGui::EndListBox();
        }
        selectedModelIdx = std::clamp(selectedModelIdx, (size_t)0, editor.scene.models.size() - 1);

        std::string addString = "Add Model (" + editor.scene.models[selectedModelIdx] + ")";
        if (ImGui::Button(addString.c_str(), ImVec2(120, 0))) {
            StaticModelNode* node = new StaticModelNode(editor.scene);
            node->model = editor.scene.assetManager.GetModel(editor.scene.models[selectedModelIdx]);
            node->name = editor.scene.models[selectedModelIdx];
            editor.scene.root.children.push_back(node);
            ImGui::CloseCurrentPopup();
        }
        ImGui::SameLine();
        if (ImGui::Button("Cancel", ImVec2(120, 0))) {
            ImGui::CloseCurrentPopup();
        }
        ImGui::EndPopup();
    }

    DrawTreeNode(&editor.scene.root);
    for (auto& collection : editor.scene.collections){
        DrawTreeNode(collection);
    }
    ImGui::Separator();
    DrawCurrentProperties();
    ImGui::End();
}