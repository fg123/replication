#include "render_settings_window.h"
#include "editor.h"

RenderSettingsWindow::RenderSettingsWindow() {
    parameters.enableLighting = true;
    parameters.enableShadows = true;
}

void RenderSettingsWindow::Draw(Editor& editor) {
    if (!isVisible) return;
    ImGui::Begin("Render Settings", &isVisible, ImGuiWindowFlags_NoCollapse);
    ImGui::Checkbox("Enable Lighting", &parameters.enableLighting);
    ImGui::Checkbox("Enable Shadows", &parameters.enableShadows);
    ImGui::Separator();
    ImGui::Checkbox("Enable Bloom", &parameters.enableBloom);
    ImGui::DragFloat("Bloom Threshold", &parameters.bloomThreshold, 0.01f, 0.0f, 2.0f);
    ImGui::Separator();
    ImGui::Checkbox("Enable Tone Mapping", &parameters.enableToneMapping);
    ImGui::DragFloat("Tone Mapping Exposure", &parameters.exposure, 0.01f, 0.01f, 10.0f);
    ImGui::Separator();
    ImGui::Checkbox("Enable FXAA", &parameters.enableAntialiasing);
    ImGui::DragFloat("LuminanceThreshold", &parameters.fxaaLumaThreshold, 0.01f, 0.0f, 1.0f);
    ImGui::DragFloat("Mul Reduce Reciprocal", &parameters.fxaaMulReduceReciprocal, 1.0f, 0.0f, 512.0f);
    ImGui::DragFloat("Min Reduce Reciprocal", &parameters.fxaaMinReduceReciprocal, 1.0f, 0.0f, 512.0f);
    ImGui::DragFloat("Max Span", &parameters.fxaaMaxSpan, 0.0f, 0.0f, 100.0f);
    ImGui::Separator();
    GBuffer& worldGBuffer = editor.renderer.GetGBuffer();
    GBuffer& transparencyGBuffer = editor.renderer.GetTransparencyGBuffer();
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
        RenderBuffer& bloomBuffer = editor.renderer.GetBloomShader()->bloomBuffer;
        ImGui::Image((ImTextureID)bloomBuffer.textureColor, size, uv_min, uv_max, tint_col, border_col);
        ImGui::TreePop();
    }
    if (ImGui::TreeNode("Lights")) {
        for (auto& light : editor.lights) {
            if (dynamic_cast<LightNode*>(light)->shadowMapSize) {
                if (ImGui::TreeNode(light->name.c_str())) {
                    ImGui::Image((ImTextureID)editor.lightNodeCache[light]->shadowColorMap, size, uv_min, uv_max, tint_col, border_col);
                    ImGui::TreePop();
                }
            }
        }
        ImGui::TreePop();

    }
    if (ImGui::TreeNode("Final")) {
        RenderBuffer& final = editor.renderer.GetOutputBuffer();
        ImGui::Image((ImTextureID)final.textureColor, size, uv_min, uv_max, tint_col, border_col);
        ImGui::TreePop();
    }
    ImGui::End();
}