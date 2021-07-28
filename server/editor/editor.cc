#include "editor.h"
#include "deferred_renderer.h"

Editor::Editor(GLFWwindow* window, const std::string& path) :
    window(window),
    path(path) {

    std::string title = "Editor: " + path;
    glfwSetWindowTitle(window, title.c_str());

    scene.LoadFromFile(path);

    glfwSetScrollCallback(window, [](GLFWwindow* window, double xoffset, double yoffset) {
        Editor* editor = (Editor*)glfwGetWindowUserPointer(window);
        Vector3 forward = glm::normalize(Vector::Forward * editor->GetRotationQuat());
        editor->targetViewPos += forward * (float) yoffset;
    });
}

void Editor::DrawScene(int width, int height) {
    // Render Scene

    // Move viewPos towards targetViewPos
    viewPos += (targetViewPos - viewPos) * 0.5f;
    viewDir += (targetViewDir - viewDir) * 0.5f;

    RenderFrameParameters parameters;
    parameters.width = width;
    parameters.height = height;
    parameters.proj = glm::perspective(glm::radians(45.0f), (float)width / (float)height, 0.1f, 1000.0f);
    parameters.viewPos = viewPos;

    Vector3 rot = Vector::Forward * GetRotationQuat();

    parameters.view = glm::lookAt(viewPos, viewPos + rot, Vector::Up);
    renderer.NewFrame(parameters);

    // Aggregate Meshes
    std::vector<Node*> nodes;
    scene.FlattenHierarchy(nodes);

    DrawLayer layer;
    for (auto& node : nodes) {
        if (StaticModelNode* model_node = dynamic_cast<StaticModelNode*>(node)) {
            for (auto& mesh : model_node->model->meshes) {
                Vector3 centerPt = Vector3(model_node->transform * Vector4(mesh.center, 1));
                if (mesh.material->IsTransparent()) {
                    DrawParams& params = layer.transparent[
                        glm::distance2(centerPt, viewPos)];
                    params.mesh = &mesh;
                    params.transform = model_node->transform;
                    params.castShadows = false;
                    params.hasOutline = false;
                }
                else {
                    auto& list = layer.opaque[mesh.material];
                    list.reserve(500);
                    DrawParams& params = list.emplace_back();
                    params.mesh = &mesh;
                    params.transform = model_node->transform;
                    params.castShadows = false;
                    params.hasOutline = false;
                }
            }
        }
    }

    renderer.Draw(layer);

    QuadShaderProgram& quadShader = renderer.GetQuadShader();
    GLuint texture = renderer.GetRenderedTexture();

    glBindFramebuffer(GL_FRAMEBUFFER, 0);
    quadShader.Use();
    quadShader.DrawQuad(texture, quadShader.standardRemapMatrix);
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

            ImGui::EndMenu();
        }

        ImGui::EndMainMenuBar();
    }

    scene_data_window.Draw(*this);
    scene_graph_window.Draw(*this);
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