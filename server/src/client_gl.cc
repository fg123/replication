#include "client_gl.h"
#include "logging.h"
#include "game.h"
#include "player.h"
#include "vector.h"
#include "client_shader.h"

#include <vector>
#include <fstream>
#include <map>

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
    attrs.depth = true;
    // attrs.stencil = true;
    glContext = emscripten_webgl_create_context(canvasSelector.c_str(), &attrs);
    emscripten_webgl_make_context_current(glContext);
}

void ClientGL::SetupGL() {
    // Setup Available Shaders
    shaderPrograms.push_back(new DefaultMaterialShaderProgram());
}

void ClientGL::DrawObject(Object* obj, int& lastProgram) {
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

void ClientGL::Draw(int width, int height) {
    // LOG_DEBUG("Draw " << width << " " << height);
    glViewport(0, 0, width, height);

    glClearColor(135.0 / 255.0, 206.0 / 255.0, 235.0 / 255.0, 1);
    // glClearColor(0, 0, 0, 1);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    for (auto& gameObjectPair : game.GetGameObjects()) {
        gameObjectPair.second->RemoveTag(Tag::DRAW_FOREGROUND);
    }

    if (PlayerObject* localPlayer = game.GetLocalPlayer()) {
        cameraPosition = localPlayer->GetClientPosition();
        cameraRotation = localPlayer->GetLookDirection();
        for (auto& child : localPlayer->children) {
            child->SetTag(Tag::DRAW_FOREGROUND);
        }
    }

    opaque.clear();
    transparent.clear();
    foreground.clear();

    for (auto& gameObjectPair : game.GetGameObjects()) {
        Object* obj = gameObjectPair.second;
        if (obj->IsTagged(Tag::DRAW_TRANSPARENCY)) {
            // glm::distance2(obj->GetPosition(), cameraPosition);
            transparent[glm::distance2(obj->GetPosition(), cameraPosition)] = obj;
        }
        else if (obj->IsTagged(Tag::DRAW_FOREGROUND)) {
            foreground.insert(obj);
        }
        else {
            opaque.insert(obj);
        }
    }

    Matrix4 viewMat = glm::lookAt(cameraPosition,
        cameraPosition + cameraRotation, Vector::Up);

    Matrix4 projMat = glm::perspective(
        glm::radians(45.0f),
        (float) width / (float) height,
        0.2f, 500.f
    );

    for (auto& program : shaderPrograms) {
        program->PreDraw(game, cameraPosition, viewMat, projMat);
    }

    DrawObjects();
}

void ClientGL::DrawObjects() {
    int lastProgram = -1;
    glEnable(GL_DEPTH_TEST);
    for (auto& obj : opaque) {
        DrawObject(obj, lastProgram);
    }
    for (auto it = transparent.rbegin(); it != transparent.rend(); ++it) {
        DrawObject(it->second, lastProgram);
    }
    glDisable(GL_DEPTH_TEST);
    for (auto& obj : foreground) {
        DrawObject(obj, lastProgram);
    }
    glEnable(GL_DEPTH_TEST);
}