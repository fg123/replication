#pragma once

#include <string>

#include "opengl.h"

#define IMGUI_IMPL_OPENGL_LOADER_GLEW
#include "imgui.h"
#include "imgui_stdlib.h"

#include "scene.h"
#include "deferred_renderer.h"
#include "scene_data_window.h"
#include "scene_graph_window.h"
#include "render_settings_window.h"

// Primary Editor Class
struct Editor {
    struct MouseState {
        double mx, my;
        bool lmb, rmb, mmb;
    } prevMouseState;

    GLFWwindow* window;
    std::string path;

    Scene scene;
    DeferredRenderer renderer;

    Vector3 viewPos, targetViewPos;
    // Yaw, Pitch
    Vector2 viewDir, targetViewDir;

    Quaternion GetRotationQuat() {
        Matrix4 matrix;
        matrix = glm::rotate(matrix, viewDir.x, Vector::Up);
        matrix = glm::rotate(matrix, viewDir.y, Vector3(matrix[0][0], matrix[1][0], matrix[2][0]));
        return glm::quat_cast(matrix);
    }

    void DrawScene(int width, int height);
    void DrawUI(int width, int height);

    // Viewing Windows
    SceneDataWindow scene_data_window;
    SceneGraphWindow scene_graph_window;
    RenderSettingsWindow render_settings_window;

    Editor(GLFWwindow* window, const std::string& path);

    void Draw(int width, int height);

    void HandleMouseInputs();
    void HandleKeyboardInputs();

    void OnScrollCallback(GLFWwindow* window, double xoffset, double yoffset);
    Node* GetSelectedNode();
    Node* GetSelectedRootNode();

    bool SaveToFile();
};