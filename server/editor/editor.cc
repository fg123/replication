#include "editor.h"
#include "deferred_renderer.h"

#include <fstream>

Editor::Editor(GLFWwindow* window, const std::string& path) :
    window(window),
    path(path),
    renderer(scene.assetManager) {

    std::string title = "Editor: " + path;
    glfwSetWindowTitle(window, title.c_str());

    scene.assetManager.LoadDataFromDirectory();
    scene.LoadFromFile(path);

    renderer.Initialize();
}

void Editor::DrawGridMesh() {
    // Grid from -100 to 100
    const int size = 100;

    // Top to bottom
    for (int i = -size; i <= size; i++) {
        renderer.GetDebugRenderer().DrawLine(
            glm::vec3(i, 0, -size),
            glm::vec3(i, 0, size),
            glm::vec3(0.5f, 0.5f, 0.5f));
    }
    // Left to Right
    for (int i = -size; i <= size; i++) {
        renderer.GetDebugRenderer().DrawLine(
            glm::vec3(-size, 0, i),
            glm::vec3(size, 0, i),
            glm::vec3(0.5f, 0.5f, 0.5f));
    }
}

void Editor::DrawScene(int width, int height) {
    // Render Scene
    // ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding, ImVec2(0, 0));

    ImGui::Begin("Scene", NULL, ImGuiWindowFlags_NoCollapse);
    ImVec2 windowSize = ImGui::GetContentRegionAvail();

    // Setup Debug Lines
    DrawGridMesh();

    // Move viewPos towards targetViewPos
    viewPos += (targetViewPos - viewPos) * 0.5f;
    viewDir += (targetViewDir - viewDir) * 0.5f;

    RenderFrameParameters parameters = render_settings_window.parameters;
    parameters.width = windowSize.x;
    parameters.height = windowSize.y;
    parameters.FOV = 45.0f;
    parameters.viewNear = 0.2f;
    parameters.viewFar = 300.0f;
    parameters.viewPos = viewPos;
    parameters.viewDir = Vector::Forward * GetRotationQuat();
    parameters.ambientFactor = 0.5f;

    parameters.skydomeTexture = nullptr;
    try {
        parameters.skydomeTexture = scene.assetManager.LoadTexture(scene.properties.skydomeTexture, Texture::Format::RGB);
    }
    catch (std::exception& e) {
        // TODO: load error into a warning list
    }

    // Aggregate Meshes
    std::vector<TransformedNode> nodes;
    scene.FlattenHierarchy(nodes, GetSelectedRootNode());

    size_t lightNodeCount = 0;

    DrawLayer layer;
    for (auto& transformed : nodes) {
        Node* node = transformed.node;
        if (StaticModelNode* model_node = dynamic_cast<StaticModelNode*>(node)) {
            for (auto& mesh : model_node->model->meshes) {
                Vector3 centerPt = Vector3(transformed.transform * Vector4(mesh->center, 1));
                if (mesh->material->IsTransparent()) {
                    DrawParams& params = layer.PushTransparent(
                        glm::distance2(centerPt, viewPos));
                    params.mesh = mesh;
                    params.transform = transformed.transform;
                    params.castShadows = false;
                    params.hasOutline = model_node == GetSelectedNode();
                }
                else {
                    DrawParams& params = layer.PushOpaque(mesh->material);
                    params.mesh = mesh;
                    params.transform = transformed.transform;
                    params.castShadows = true;
                    params.hasOutline = model_node == GetSelectedNode();
                }
            }
        }
        else if (LightNode* light_node = dynamic_cast<LightNode*>(node)) {
            lightNodeCount += 1;

            while (lights.size() < lightNodeCount) {
                lights.push_back(new TransformedLight);
            }

            lights[lightNodeCount - 1]->Update(transformed);

            if (light_node == GetSelectedNode()) {
                if (light_node->shape == LightShape::Point) {
                    DrawParams& params = layer.PushTransparent(
                        glm::distance2(light_node->position, viewPos));
                    params.mesh = scene.assetManager.GetModel("Icosphere.obj")->meshes[0];
                    params.transform = transformed.transform;
                    params.castShadows = false;
                    params.isWireframe = true;
                    params.overrideMaterial = &light_node->defaultMaterial;
                }

                if (light_node->shape == LightShape::Rectangle) {
                    // Draw bounding box
                    DrawParams& params2 = layer.PushTransparent(
                        glm::distance2(light_node->position, viewPos));
                    params2.mesh = scene.assetManager.GetModel("Cube.obj")->meshes[0];
                    params2.transform = light_node->GetRectangleVolumeTransform(transformed.transform);
                    params2.castShadows = false;
                    params2.isWireframe = true;
                    params2.overrideMaterial = &light_node->defaultMaterial;
                }
            }
        }
        else if (GameObjectNode* game_object_node = dynamic_cast<GameObjectNode*>(node)) {
            Mesh* mesh = scene.assetManager.GetModel("Cube.obj")->meshes[0];
            DrawParams& params = layer.PushOpaque(mesh->material);
            params.mesh = mesh;
            params.transform = transformed.transform;
            params.castShadows = false;
            params.hasOutline = model_node == GetSelectedNode();
        }
    }

    for (size_t i = lightNodeCount; i < lights.size(); i++) {
        delete lights[i];
    }
    if (lightNodeCount != lights.size()) {
        lights.resize(lightNodeCount);
    }

    parameters.lights = lights;

    renderer.NewFrame(&parameters);
    renderer.Draw({ &layer });
    renderer.EndFrame();

    QuadShaderProgram& quadShader = renderer.GetQuadShader();
    GLuint texture = renderer.GetRenderedTexture();

    ImGui::Image((ImTextureID) texture, windowSize, ImVec2(0, 1), ImVec2(1, 0));

    ImGui::SetCursorPos(ImVec2(0, 0));
    ImGui::InvisibleButton("Scene", windowSize, ImGuiButtonFlags_MouseButtonLeft | ImGuiButtonFlags_MouseButtonRight | ImGuiButtonFlags_MouseButtonMiddle);
    if (ImGui::IsItemHovered()) {
        // LOG_DEBUG("Hovered");
        ImVec2 mousePositionAbsolute = ImGui::GetMousePos();
        ImVec2 screenPositionAbsolute = ImGui::GetItemRectMin();
        ImVec2 mousePositionRelative = ImVec2(mousePositionAbsolute.x - screenPositionAbsolute.x, mousePositionAbsolute.y - screenPositionAbsolute.y);

        sceneMouseState.mx = mousePositionRelative.x;
        sceneMouseState.my = mousePositionRelative.y;

        Vector3 forward = glm::normalize(Vector::Forward * GetRotationQuat());
        targetViewPos += forward * (float) ImGui::GetIO().MouseWheel;
    }

    if (ImGui::IsItemFocused()) {
        // LOG_DEBUG("Focused");
        sceneMouseState.lmb = ImGui::IsMouseDown(ImGuiMouseButton_Left);
        sceneMouseState.rmb = ImGui::IsMouseDown(ImGuiMouseButton_Right);
        sceneMouseState.mmb = ImGui::IsMouseDown(ImGuiMouseButton_Middle);
    }
    else {
        // LOG_DEBUG("Not Focused");
        sceneMouseState.lmb = false;
        sceneMouseState.rmb = false;
        sceneMouseState.mmb = false;
    }

    ImGui::End();
    // ImGui::PopStyleVar();
}

Node* Editor::GetSelectedNode() {
    return scene_graph_window.selectedNode;
}

Node* Editor::GetSelectedRootNode() {
    if (!scene_data_window.selectedNode) {
        scene_data_window.selectedNode = &scene.root;
    }
    return scene_data_window.selectedNode;
}

void Editor::DrawUI(int width, int height) {
    if(ImGui::BeginMainMenuBar()) {
        if (ImGui::BeginMenu("Windows")) {
            ImGui::MenuItem(
                "Render Settings", NULL,
                &render_settings_window.isVisible, true);

            ImGui::EndMenu();
        }

        ImGui::EndMainMenuBar();
    }

    scene_data_window.Draw(*this);
    scene_graph_window.Draw(*this);
    render_settings_window.Draw(*this);
}

void Editor::Draw(int width, int height) {
    DrawScene(width, height);
    DrawUI(width, height);
}

void Editor::HandleMouseInputs() {
    // Mouse Inputs
    if (sceneMouseState.mmb) {
        double movementX = (sceneMouseState.mx - prevSceneMouseState.mx);
        double movementY = (sceneMouseState.my - prevSceneMouseState.my);

        if (glfwGetKey(window, GLFW_KEY_LEFT_SHIFT) == GLFW_PRESS) {
            // Move along the plane
            Vector3 left = glm::normalize(Vector::Left * GetRotationQuat());
            Vector3 top = glm::normalize(Vector::Up * GetRotationQuat());
            targetViewPos += left * (float) movementX / 10.f + top * (float) movementY / 10.f;
        }
        else {
            targetViewDir.x += (float) movementX / 100.f;
            targetViewDir.y -= (float) movementY / 100.f;
        }
    }
    prevSceneMouseState = sceneMouseState;
}

void Editor::HandleKeyboardInputs() {
}

// Get current date/time, format is YYYY-MM-DD.HH:mm:ss
const std::string GetCurrentDateTime() {
    time_t now = time(0);
    struct tm tstruct;
    char buf[80];
    tstruct = *localtime(&now);
    // Visit http://en.cppreference.com/w/cpp/chrono/c/strftime
    // for more information about date/time format
    strftime(buf, sizeof(buf), "%Y%m%d-%H%M%S", &tstruct);

    return buf;
}


bool Editor::SaveToFile() {
    // Backup Current File
    {
        std::ifstream src(path, std::ios::binary);
        std::ofstream dst(path + "." + GetCurrentDateTime() + ".bak", std::ios::binary);
        dst << src.rdbuf();
    }

    std::ofstream oss(path);
    if (!oss.is_open()) {
        return false;
    }
    scene.WriteToFile(oss);
    return true;
}