#include "client_gl.h"
#include "logging.h"
#include "game.h"
#include "player.h"
#include "vector.h"
#include "client_shader.h"

#include <vector>
#include <fstream>

ClientGL::ClientGL(Game& game, const char* selector) :
    canvasSelector(selector),
    game(game) {
}

void ClientGL::SetupContext() {
    LOG_DEBUG("Setting up context for selector: " << canvasSelector);
    EmscriptenWebGLContextAttributes attrs;
    emscripten_webgl_init_context_attributes(&attrs);
    attrs.majorVersion = 2;
    attrs.antialias = true;
    attrs.alpha = true;
    glContext = emscripten_webgl_create_context(canvasSelector.c_str(), &attrs);
    emscripten_webgl_make_context_current(glContext);
}

void ClientGL::SetupGL() {
    // Setup Available Shaders
    shaderPrograms.push_back(new DefaultMaterialShaderProgram());
}

void ClientGL::Draw(int width, int height) {
    // LOG_DEBUG("Draw " << width << " " << height);
    glViewport(0, 0, width, height);

    glClearColor(135.0 / 255.0, 206.0 / 255.0, 235.0 / 255.0, 1);
    glClear(GL_COLOR_BUFFER_BIT);

    if (PlayerObject* localPlayer = game.GetLocalPlayer()) {
        cameraPosition = localPlayer->GetClientPosition();
        cameraRotation = localPlayer->GetLookDirection();
    }

    Matrix4 viewMat = glm::lookAt(cameraPosition,
        cameraPosition + cameraRotation, Vector::Up);
    Matrix4 projMat = glm::perspective(
        glm::radians(45.0f),
        (float) width / (float) height,
        0.1f, 1000.f
    );

    for (auto& program : shaderPrograms) {
        program->PreDraw(game, cameraPosition, viewMat, projMat);
    }

    int lastProgram = -1;
    for (auto& gameObjectPair : game.GetGameObjects()) {
        Object* obj = gameObjectPair.second;
        if (Model* model = obj->GetModel()) {
            // Set Model Transform
            Matrix4 transform = obj->GetTransform();
            for (auto& mesh : model->meshes) {
                int program = mesh.material->GetShaderProgram();
                if (program != lastProgram) {
                    lastProgram = program;
                    shaderPrograms[program]->Use();
                }
                shaderPrograms[program]->Draw(*this, transform, &mesh);
            }
        }
    }
}