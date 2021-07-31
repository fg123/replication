#include "render_settings_window.h"
#include "editor.h"

void RenderSettingsWindow::Draw(Editor& editor) {
    if (!isVisible) return;
    ImGui::Begin("Render Settings", &isVisible, ImGuiWindowFlags_NoCollapse);
    ImGui::DragFloat("Bloom Threshold", &bloomThreshold, 0.01f, 0.0f, 1.0f);
    ImGui::End();
}