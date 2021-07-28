#include "scene_data_window.h"
#include "editor.h"

void SceneDataWindow::Draw(Editor& editor) {
    if (!isVisible) return;
    ImGui::Begin("Scene Data", &isVisible, ImGuiWindowFlags_NoCollapse);
    ImGui::Text("FPS: %.2f", ImGui::GetIO().Framerate);
    ImGui::Text("Scene Path: %s", editor.path.c_str());
    ImGui::End();
}