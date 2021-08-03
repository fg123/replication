#include "render_settings_window.h"
#include "editor.h"

void RenderSettingsWindow::Draw(Editor& editor) {
    if (!isVisible) return;
    ImGui::Begin("Render Settings", &isVisible, ImGuiWindowFlags_NoCollapse);
    ImGui::Separator();
    ImGui::Checkbox("Enable Bloom", &enableBloom);
    ImGui::DragFloat("Bloom Threshold", &bloomThreshold, 0.01f, 0.0f, 2.0f);
    ImGui::Separator();
    ImGui::Checkbox("Enable Tone Mapping", &enableToneMapping);
    ImGui::DragFloat("Tone Mapping Exposure", &exposure, 0.01f, 0.01f, 10.0f);
    ImGui::Separator();
    ImGui::Checkbox("Enable FXAA", &enableAntialiasing);
    ImGui::Separator();
    GBuffer& worldGBuffer = editor.renderer.gBuffer;
    GBuffer& transparencyGBuffer = editor.renderer.transparencyGBuffer;
    ImVec2 uv_min = ImVec2(0.0f, 1.0f);                 // Top-left
    ImVec2 uv_max = ImVec2(1.0f, 0.0f);                 // Lower-right
    ImVec4 tint_col = ImVec4(1.0f, 1.0f, 1.0f, 1.0f);   // No tint
    ImVec4 border_col = ImVec4(1.0f, 1.0f, 1.0f, 0.5f); // 50% opaque white
    ImVec2 size = ImVec2(worldGBuffer.width / 4.0, worldGBuffer.height / 4.0);

    if (ImGui::TreeNode("WorldGBuffer")) {
        if (ImGui::TreeNode("Diffuse")) {
            ImGui::Image((ImTextureID)worldGBuffer.g_diffuse, size, uv_min, uv_max, tint_col, border_col);
            ImGui::TreePop();
        }
        if (ImGui::TreeNode("Position")) {
            ImGui::Image((ImTextureID)worldGBuffer.g_position, size, uv_min, uv_max, tint_col, border_col);
            ImGui::TreePop();
        }
        if (ImGui::TreeNode("Normal")) {
            ImGui::Image((ImTextureID)worldGBuffer.g_normal, size, uv_min, uv_max, tint_col, border_col);
            ImGui::TreePop();
        }
        if (ImGui::TreeNode("Specular")) {
            ImGui::Image((ImTextureID)worldGBuffer.g_specular, size, uv_min, uv_max, tint_col, border_col);
            ImGui::TreePop();
        }
        ImGui::TreePop();
    }
    if (ImGui::TreeNode("TransparencyGBuffer")) {
        if (ImGui::TreeNode("Diffuse")) {
            ImGui::Image((ImTextureID)transparencyGBuffer.g_diffuse, size, uv_min, uv_max, tint_col, border_col);
            ImGui::TreePop();
        }
        if (ImGui::TreeNode("Position")) {
            ImGui::Image((ImTextureID)transparencyGBuffer.g_position, size, uv_min, uv_max, tint_col, border_col);
            ImGui::TreePop();
        }
        if (ImGui::TreeNode("Normal")) {
            ImGui::Image((ImTextureID)transparencyGBuffer.g_normal, size, uv_min, uv_max, tint_col, border_col);
            ImGui::TreePop();
        }
        if (ImGui::TreeNode("Specular")) {
            ImGui::Image((ImTextureID)transparencyGBuffer.g_specular, size, uv_min, uv_max, tint_col, border_col);
            ImGui::TreePop();
        }
        ImGui::TreePop();
    }
    if (ImGui::TreeNode("Bloom")) {
        RenderBuffer& bloomBuffer = editor.renderer.bloomShader.bloomBuffer;
        ImGui::Image((ImTextureID)bloomBuffer.textureColor, size, uv_min, uv_max, tint_col, border_col);
        ImGui::TreePop();
    }
    ImGui::End();
}