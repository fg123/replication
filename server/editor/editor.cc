#include "editor.h"
#include "deferred_renderer.h"

#include <fstream>

Editor::Editor(GLFWwindow* window, const std::string& path) :
    window(window),
    path(path),
    renderer(scene.assetManager) {

    std::string title = "Editor: " + path;
    glfwSetWindowTitle(window, title.c_str());

    scene.LoadFromFile(path);

    glfwSetScrollCallback(window, [](GLFWwindow* window, double xoffset, double yoffset) {
        if (ImGui::GetIO().WantCaptureMouse) return;
        Editor* editor = (Editor*)glfwGetWindowUserPointer(window);
        Vector3 forward = glm::normalize(Vector::Forward * editor->GetRotationQuat());
        editor->targetViewPos += forward * (float) yoffset;
    });

    renderer.Initialize();
}

void Editor::DrawScene(int width, int height) {
    // Render Scene

    // Move viewPos towards targetViewPos
    viewPos += (targetViewPos - viewPos) * 0.5f;
    viewDir += (targetViewDir - viewDir) * 0.5f;

    RenderFrameParameters parameters = render_settings_window.parameters;
    parameters.width = width;
    parameters.height = height;
    parameters.FOV = 45.0f;
    parameters.viewNear = 0.2f;
    parameters.viewFar = 300.0f;
    parameters.viewPos = viewPos;
    parameters.viewDir = Vector::Forward * GetRotationQuat();
    parameters.ambientFactor = 0.5f;

    // Aggregate Meshes
    std::vector<TransformedNode> nodes;
    scene.FlattenHierarchy(nodes, GetSelectedRootNode());
    lights.clear();

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
            lights.push_back(light_node);
            if (lightNodeCache.find(light_node) == lightNodeCache.end()) {
                lightNodeCache[light_node] = new TransformedLight;
            }
            lightNodeCache[light_node]->Update(transformed);
            parameters.lights.push_back(lightNodeCache[light_node]);

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
    }

    renderer.NewFrame(&parameters);
    renderer.Draw(layer);
    QuadShaderProgram& quadShader = renderer.GetQuadShader();
    GLuint texture = renderer.GetRenderedTexture();

    glBindFramebuffer(GL_FRAMEBUFFER, 0);
    quadShader.Use();
    quadShader.DrawQuad(texture, quadShader.standardRemapMatrix);
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
                "Scene Data", NULL,
                &scene_data_window.isVisible, true);

            ImGui::MenuItem(
                "Scene Graph", NULL,
                &scene_graph_window.isVisible, true);

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
    MouseState currMouseState;
    glfwGetCursorPos(window, &currMouseState.mx, &currMouseState.my);
    currMouseState.lmb = glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_LEFT);
    currMouseState.rmb = glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_RIGHT);
    currMouseState.mmb = glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_MIDDLE);

    if (currMouseState.mmb) {
        double movementX = (currMouseState.mx - prevMouseState.mx);
        double movementY = (currMouseState.my - prevMouseState.my);

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
    prevMouseState = currMouseState;
}

void Editor::HandleKeyboardInputs() {
}

bool Editor::SaveToFile() {
    std::ofstream oss(path + ".new");
    if (!oss.is_open()) {
        return false;
    }
    scene.WriteToFile(oss);
    return true;
}