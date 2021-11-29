#include "scene_graph_window.h"
#include "editor.h"
#include "scene.h"

std::string MakeID(const std::string& label, void* ptr) {
    return (label + "##" + std::to_string((unsigned long)ptr));
}

void SceneGraphWindow::DrawCurrentProperties(Editor& editor) {
    if (editor.GetSelectedRootNode()) {
        ImGui::InputText("Collection Name", &editor.GetSelectedRootNode()->name);
    }
    ImGui::Separator();
    if (selectedNode == nullptr) {
        ImGui::Text("No node selected");
        return;
    }
    ImGui::Separator();
    ImGui::Text("Node Properties");
    if (ImGui::Button("Deselect")) {
        selectedNode = nullptr;
        return;
    }
    ImGui::SameLine();
    if (ImGui::Button("Duplicate Node")) {
        if (selectedNode->parent) {
            rapidjson::StringBuffer buffer;
            JSONWriter writer(buffer);
            writer.StartObject();
            selectedNode->Serialize(writer);
            writer.EndObject();

            JSONDocument document;
            document.Parse(buffer.GetString());
            Node* newNode = Node::Create(editor.scene, document);
            newNode->parent = selectedNode->parent;
            selectedNode->parent->children.push_back(newNode);
        }
    }
    ImGui::SameLine();
    if (selectedNode->parent) {
        if (ImGui::Button("Delete Node")) {
            ImGui::OpenPopup("Delete node?");
        }
        ImVec2 center = ImGui::GetMainViewport()->GetCenter();
        ImGui::SetNextWindowPos(center, ImGuiCond_Appearing, ImVec2(0.5f, 0.5f));

        if (ImGui::BeginPopupModal("Delete node?", NULL, ImGuiWindowFlags_AlwaysAutoResize))
        {
            ImGui::Text("Are you sure you want to delete this node?\n");
            ImGui::Separator();

            if (ImGui::Button("Delete")) {
                auto& children = selectedNode->parent->children;
                children.erase(std::find(children.begin(), children.end(), selectedNode));
                delete selectedNode;
                selectedNode = nullptr;
                ImGui::CloseCurrentPopup();
            }
            ImGui::SetItemDefaultFocus();
            ImGui::SameLine();
            if (ImGui::Button("Cancel")) {
                ImGui::CloseCurrentPopup();
            }
            ImGui::EndPopup();
        }
    }

    if (!selectedNode) return;
    ImGui::Separator();
    ImGui::InputText("Name", &selectedNode->name);

    ImGui::DragFloat3("Position", glm::value_ptr(selectedNode->position), 0.01f);
    ImGui::DragFloat3("Rotation", glm::value_ptr(selectedNode->rotation), 0.01f);
    ImGui::DragFloat3("Scale", glm::value_ptr(selectedNode->scale), 0.01f);

    if (LightNode* lightNode = dynamic_cast<LightNode*>(selectedNode)) {
        ImGui::Separator();
        ImGui::Combo("Light Shape", (int*)&lightNode->shape, "Point\0Rectangular\0Directional\0");

        ImGui::Separator();
        ImGui::ColorEdit3("Color", glm::value_ptr(lightNode->color));
        ImGui::DragFloat("Strength", &lightNode->strength, 0.01f, 0.0f, FLT_MAX);
        if (lightNode->shape == LightShape::Point) {
            if (ImGui::Button("Auto scale volume by strength")) {
                lightNode->scale = glm::vec3(glm::sqrt(lightNode->strength / 0.01));
            }
        }
        if (lightNode->shape == LightShape::Rectangle) {
            ImGui::DragFloat3("Volume Size", glm::value_ptr(lightNode->volumeSize), 0.01f);
            ImGui::DragFloat3("Volume Offset", glm::value_ptr(lightNode->volumeOffset), 0.01f);
        }

        ImGui::Separator();

        const static int items[] = { 0, 64, 128, 256, 512, 1024, 2048, 4096 };

        if (ImGui::BeginCombo("Shadow Map Size", std::to_string(lightNode->shadowMapSize).c_str())) // The second parameter is the label previewed before opening the combo.
        {
            for (int n = 0; n < IM_ARRAYSIZE(items); n++)
            {
                bool is_selected = (lightNode->shadowMapSize == items[n]);
                if (ImGui::Selectable(std::to_string(items[n]).c_str(), is_selected))
                    lightNode->shadowMapSize = items[n];
                if (is_selected)
                    ImGui::SetItemDefaultFocus();   // Set the initial focus when opening the combo (scrolling + for keyboard navigation support in the upcoming navigation branch)
            }
            ImGui::EndCombo();
        }

        ImGui::DragFloat("NearBoundary", &lightNode->nearBoundary, 0.01f);
        ImGui::DragFloat("FarBoundary", &lightNode->farBoundary, 0.01f);

        // if (ImGui::TreeNode("Shadow Map")) {
        //     ImVec2 uv_min = ImVec2(0.0f, 1.0f);                 // Top-left
        //     ImVec2 uv_max = ImVec2(1.0f, 0.0f);                 // Lower-right
        //     ImVec4 tint_col = ImVec4(1.0f, 1.0f, 1.0f, 1.0f);   // No tint
        //     ImVec4 border_col = ImVec4(1.0f, 1.0f, 1.0f, 0.5f); // 50% opaque white
        //     ImVec2 size = ImVec2(lightNode->shadowMapSize, lightNode->shadowMapSize);

        //     ImGui::Image((ImTextureID)lightNode->shadowColorMap, size, uv_min, uv_max, tint_col, border_col);
        //     ImGui::TreePop();
        // }
    }
    else if (CollectionReferenceNode* collectionNode = dynamic_cast<CollectionReferenceNode*>(selectedNode)) {
        ImGui::Separator();
        std::string currentTitle = "None";
        if (collectionNode->index > 0 && collectionNode->index <= editor.scene.collections.size()) {
            currentTitle = editor.scene.collections[collectionNode->index - 1]->name;
        }
        if (ImGui::BeginCombo("Collections", currentTitle.c_str())) {
            if (ImGui::Selectable("None", collectionNode->index == 0)) {
                collectionNode->index = 0;
            }
            for (size_t i = 0; i < editor.scene.collections.size(); i++) {
                auto& collection = editor.scene.collections[i];
                if (ImGui::Selectable((collection->name + "##" + std::to_string(i)).c_str(),
                        collectionNode->index == i + 1)) {
                    collectionNode->index = i + 1;
                }
            }
            ImGui::EndCombo();
        }
    }
    else if (GameObjectNode* gameObjectNode = dynamic_cast<GameObjectNode*>(selectedNode)) {
        ImGui::Separator();
        ImGui::InputText("Game Object Class", &gameObjectNode->gameObjectClass);
    }
}

void SceneGraphWindow::DrawTreeNode(Node* node) {
    int baseFlags = ImGuiTreeNodeFlags_SpanFullWidth | ImGuiTreeNodeFlags_DefaultOpen;
    if (node == selectedNode) {
        baseFlags |= ImGuiTreeNodeFlags_Selected;
    }

    if (CollectionNode* collectionNode = dynamic_cast<CollectionNode*>(node)) {
        std::string title = collectionNode->name + " (" + std::to_string(collectionNode->children.size()) + " items)";
        if (ImGui::TreeNodeEx(MakeID(title, node).c_str(), baseFlags)) {
            for (Node* child : collectionNode->children) {
                DrawTreeNode(child);
            }
            ImGui::TreePop();
        }
    }
    else {
        if (ImGui::TreeNodeEx(MakeID(node->name, node).c_str(), baseFlags | ImGuiTreeNodeFlags_Leaf)) {
            ImGui::TreePop();
        }
        if (ImGui::IsItemClicked()) {
            selectedNode = node;
        }
    }
}

void SceneGraphWindow::Draw(Editor& editor) {
    ImGui::Begin("Scene Graph", NULL, ImGuiWindowFlags_NoCollapse | ImGuiWindowFlags_MenuBar);
    bool showSelectModelMenu = false;

    if (ImGui::BeginMenuBar()) {
        if (ImGui::BeginMenu("Add")) {
            if (CollectionNode* parent = dynamic_cast<CollectionNode*>(editor.GetSelectedRootNode())) {
                if (ImGui::MenuItem("Static Model")) {
                    showSelectModelMenu = true;
                }

                if (ImGui::MenuItem("Light")) {
                    LightNode* node = new LightNode();
                    node->name = "New Light";
                    node->parent = parent;
                    parent->children.push_back(node);
                }

                if (ImGui::MenuItem("Collection Reference")) {
                    CollectionReferenceNode* node = new CollectionReferenceNode();
                    node->name = "CollectionReference";
                    node->parent = parent;
                    parent->children.push_back(node);
                }

                if (ImGui::MenuItem("Game Object Node")) {
                    GameObjectNode* node = new GameObjectNode();
                    node->name = "GameObject";
                    node->parent = parent;
                    parent->children.push_back(node);
                }
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

    if (CollectionNode* parent = dynamic_cast<CollectionNode*>(editor.GetSelectedRootNode())) {
        if (ImGui::BeginPopupModal("Select Model", NULL, ImGuiWindowFlags_AlwaysAutoResize)) {
            static size_t selectedModelIdx = 0;
            static ImGuiTextFilter modelFilter;
            modelFilter.Draw("Filter Models");
            ImGui::SetItemDefaultFocus();
            auto& models = editor.scene.assetManager.models;
            if (ImGui::BeginListBox("Models")) {
                for (size_t i = 0; i < models.size(); i++) {
                    auto& model = models[i]->name;
                    if (modelFilter.PassFilter(model.c_str())) {
                        const bool is_selected = (selectedModelIdx == i);
                        if (ImGui::Selectable(model.c_str(), is_selected)) {
                            selectedModelIdx = i;
                        }
                    }
                }
                ImGui::EndListBox();
            }
            selectedModelIdx = std::clamp(selectedModelIdx, (size_t)0, models.size() - 1);

            std::string addString = "Add Model (" + models[selectedModelIdx]->name + ")";
            if (ImGui::Button(addString.c_str(), ImVec2(120, 0))) {
                StaticModelNode* node = new StaticModelNode(editor.scene.assetManager);
                node->model = models[selectedModelIdx];
                node->name = models[selectedModelIdx]->name;
                node->parent = parent;
                parent->children.push_back(node);
                ImGui::CloseCurrentPopup();
            }
            ImGui::SameLine();
            if (ImGui::Button("Cancel", ImVec2(120, 0))) {
                ImGui::CloseCurrentPopup();
            }
            ImGui::EndPopup();
        }
    }

    DrawTreeNode(editor.GetSelectedRootNode());
    ImGui::Separator();
    DrawCurrentProperties(editor);
    ImGui::End();
}