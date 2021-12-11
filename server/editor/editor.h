#pragma once

#include <string>
#include <mutex>
#include <atomic>

#include "opengl.h"

#define IMGUI_IMPL_OPENGL_LOADER_GLEW
#include "imgui/imgui.h"
#include "imgui/imgui_stdlib.h"

#include "scene.h"
#include "deferred_renderer.h"
#include "scene_data_window.h"
#include "scene_graph_window.h"
#include "render_settings_window.h"
#include "game.h"

// Primary Editor Class
struct Editor {
    struct MouseState {
        double mx, my;
        bool lmb, rmb, mmb;
    };
    MouseState sceneMouseState, prevSceneMouseState;

    GLFWwindow* window;
    std::string path;

    bool showSceneWindow = true;

    DeferredRenderer renderer;

    Game game;

    Vector3 viewPos, targetViewPos;
    // Yaw, Pitch
    Vector2 viewDir, targetViewDir;

    Vector3 shadowMapViewPos;
    Vector2 shadowMapViewDir;

    std::vector<TransformedLight*> lights;

    void DrawGridMesh();

    Quaternion GetRotationQuat(Vector2 dir) {
        Matrix4 matrix;
        matrix = glm::rotate(matrix, dir.x, Vector::Up);
        matrix = glm::rotate(matrix, dir.y, Vector3(matrix[0][0], matrix[1][0], matrix[2][0]));
        return glm::quat_cast(matrix);
    }

    Scene& GetScene() { return game.scene; }

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

    std::mutex gameMutex;
    std::atomic<bool> isSimulatingGame = false;
    void Tick(Time time);
};