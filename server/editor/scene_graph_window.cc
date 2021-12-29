#include "scene_graph_window.h"
#include "editor.h"
#include "scene.h"
#include "object.h"

SceneGraphWindow::SceneGraphWindow(Editor& editor) {
    for (auto& lookup : GetClassLookup()) {
        gameObjectNames.push_back(lookup.first);
    }
}

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
            Node* newNode = Node::Create(editor.GetScene(), document);
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
        ImGui::DragFloat("MaxBoundary", &lightNode->maxBoundary, 0.01f);

        ImGui::DragFloat2("Near Bias", glm::value_ptr(lightNode->nearBiasRange), 0.01f, 0.0001f, 1.f, "%.04f");
        ImGui::DragFloat2("Mid Bias", glm::value_ptr(lightNode->midBiasRange), 0.01f, 0.0001f, 1.f, "%.04f");
        ImGui::DragFloat2("Far Bias", glm::value_ptr(lightNode->farBiasRange), 0.01f, 0.0001f, 1.f, "%.04f");

        ImGui::DragFloat("CSM Transition", &lightNode->shadowTransitionZone, 0.1f);

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
        if (collectionNode->index > 0 && collectionNode->index <= editor.GetScene().collections.size()) {
            currentTitle = editor.GetScene().collections[collectionNode->index - 1]->name;
        }
        if (ImGui::BeginCombo("Collections", currentTitle.c_str())) {
            if (ImGui::Selectable("None", collectionNode->index == 0)) {
                collectionNode->index = 0;
            }
            for (size_t i = 0; i < editor.GetScene().collections.size(); i++) {
                auto& collection = editor.GetScene().collections[i];
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
        if (editor.isSimulatingGame) {
            if (Object* obj = gameObjectNode->object) {
                ImGui::Text("Position: %s", glm::to_string(obj->GetPosition()).c_str());
                ImGui::Text("Rotation: %s", glm::to_string(obj->GetRotation()).c_str());
                ImGui::Text("Scale: %s", glm::to_string(obj->GetScale()).c_str());
                ImGui::Text("Transform: %s", glm::to_string(obj->GetTransform()).c_str());
            }
        }
    }
    else if (ScriptableObjectNode* scriptObjectNode = dynamic_cast<ScriptableObjectNode*>(selectedNode)) {
        ImGui::Separator();
        ImGui::InputText("Script Class", &scriptObjectNode->scriptClass);
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

template<typename T>
std::string ToDisplayName(T node);

template<>
std::string ToDisplayName(Model* node) {
    return node->name;
}

template<>
std::string ToDisplayName(std::string node) { return node; }

template<const char* id, typename T>
void ShowSelectionPopup(
    const std::string& objectType,
    const std::vector<T>& objects,
    std::function<void(T)> onSelected
) {
    if (ImGui::BeginPopupModal(id, NULL, ImGuiWindowFlags_AlwaysAutoResize)) {
        static size_t selectIdx = 0;
        static ImGuiTextFilter textFilter;
        textFilter.Draw(("Filter " + objectType).c_str());
        ImGui::SetItemDefaultFocus();
        if (ImGui::BeginListBox(objectType.c_str())) {
            for (size_t i = 0; i < objects.size(); i++) {
                std::string objString = ToDisplayName(objects[i]);
                if (textFilter.PassFilter(objString.c_str())) {
                    const bool is_selected = (selectIdx == i);
                    if (ImGui::Selectable(objString.c_str(), is_selected)) {
                        selectIdx = i;
                    }
                }
            }
            ImGui::EndListBox();
        }
        selectIdx = std::clamp(selectIdx, (size_t)0, objects.size() - 1);

        std::string addString = "Add " + objectType + " (" + ToDisplayName(objects[selectIdx]) + ")";
        if (ImGui::Button(addString.c_str(), ImVec2(120, 0))) {
            onSelected(objects[selectIdx]);
            selectIdx = 0;
            textFilter.Clear();
            ImGui::CloseCurrentPopup();
        }
        ImGui::SameLine();
        if (ImGui::Button("Cancel", ImVec2(120, 0))) {
            ImGui::CloseCurrentPopup();
        }
        ImGui::EndPopup();
    }
}

static const char selectModelTitle[] = "Select Model";
static const char selectGameObjectTitle[] = "Select Game Object";

void SceneGraphWindow::Draw(Editor& editor) {
    ImGui::Begin("Scene Graph", NULL, ImGuiWindowFlags_NoCollapse | ImGuiWindowFlags_MenuBar);
    bool showSelectModelMenu = false;
    bool showSelectGameObjectMenu = false;

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
                    showSelectGameObjectMenu = true;
                }

                if (ImGui::MenuItem("Scriptable Object Node")) {
                    ScriptableObjectNode* node = new ScriptableObjectNode();
                    node->name = "ScriptableObject";
                    node->parent = parent;
                    parent->children.push_back(node);
                }
            }
            ImGui::EndMenu();
        }
        ImGui::EndMenuBar();
    }


    if (showSelectModelMenu) {
        ImGui::OpenPopup(selectModelTitle);
    }

    if (showSelectGameObjectMenu) {
        ImGui::OpenPopup(selectGameObjectTitle);
    }

    ImVec2 center = ImGui::GetMainViewport()->GetCenter();
    ImGui::SetNextWindowPos(center, ImGuiCond_Appearing, ImVec2(0.5f, 0.5f));

    if (CollectionNode* parent = dynamic_cast<CollectionNode*>(editor.GetSelectedRootNode())) {
        ShowSelectionPopup<selectModelTitle, Model*>("Models", editor.GetScene().assetManager.models,
            [&parent, &editor](Model* model) {
                StaticModelNode* node = new StaticModelNode(editor.GetScene().assetManager);
                node->model = model;
                node->name = model->name;
                node->parent = parent;
                parent->children.push_back(node);
            }
        );
        ShowSelectionPopup<selectGameObjectTitle, std::string>("Game Objects", gameObjectNames,
            [&parent, &editor](std::string obj) {
                GameObjectNode* node = new GameObjectNode(GetClassLookup()[obj](editor.game));
                node->name = "GameObject - " + obj;
                node->parent = parent;
                parent->children.push_back(node);
            }
        );
    }

    DrawTreeNode(editor.GetSelectedRootNode());
    ImGui::Separator();
    DrawCurrentProperties(editor);
    ImGui::End();
}