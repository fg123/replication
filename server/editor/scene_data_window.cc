#include "scene_data_window.h"
#include "editor.h"

void SceneDataWindow::Draw(Editor& editor) {
    if (!isVisible) return;
    ImGui::Begin("Scene Data", &isVisible, ImGuiWindowFlags_NoCollapse);
    ImGui::Text("FPS: %.2f", ImGui::GetIO().Framerate);
    ImGui::Text("Scene Path: %s", editor.path.c_str());

    ImGui::Separator();
    if (ImGui::BeginListBox("Collections")) {
        if (ImGui::Selectable("RootCollection##-1", selectedNode == &editor.scene.root)) {
            selectedNode = &editor.scene.root;
        }
        for (size_t i = 0; i < editor.scene.collections.size(); i++) {
            auto& collection = editor.scene.collections[i];
            if (ImGui::Selectable((collection->name + "##" + std::to_string(i)).c_str(),
                    selectedNode == editor.scene.collections[i])) {
                selectedNode = editor.scene.collections[i];
            }
        }
        ImGui::EndListBox();
    }

    if (ImGui::Button("Add Collection")) {
        CollectionNode* node = new CollectionNode(editor.scene);
        editor.scene.collections.emplace_back(node);
        node->name = "New Collection";
    }

    if (ImGui::Button("Save Scene")) {
        if (!editor.SaveToFile()) {
            ImGui::OpenPopup("Error");
        }
        else {
            ImGui::OpenPopup("Success");
        }
    }
    ImVec2 center = ImGui::GetMainViewport()->GetCenter();
    ImGui::SetNextWindowPos(center, ImGuiCond_Appearing, ImVec2(0.5f, 0.5f));

    if (ImGui::BeginPopupModal("Error", NULL, ImGuiWindowFlags_AlwaysAutoResize)) {
        ImGui::Text("Failed to save scene to file.");
        ImGui::Separator();
        if (ImGui::Button("OK")) {
            ImGui::CloseCurrentPopup();
        }
        ImGui::EndPopup();
    }
     if (ImGui::BeginPopupModal("Success", NULL, ImGuiWindowFlags_AlwaysAutoResize)) {
        ImGui::Text("Saved to File");
        ImGui::Separator();
        if (ImGui::Button("OK")) {
            ImGui::CloseCurrentPopup();
        }
        ImGui::EndPopup();
    }
    ImGui::End();
}