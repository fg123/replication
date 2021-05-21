#include "client_gl.h"
#include "logging.h"
#include "game.h"
#include "player.h"
#include "vector.h"
#include "client_shader.h"
#include "bvh.h"
#include "global.h"

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

    debugShaderProgram = new DebugShaderProgram();

    // Setup Cube
    glGenVertexArrays(1, &debugCube.renderInfo.vao);
    glBindVertexArray(debugCube.renderInfo.vao);

    std::vector<float> verts = {
        0, 0, 0,
        0, 0, 1,
        0, 1, 0,
        0, 1, 1,
        1, 0, 0,
        1, 0, 1,
        1, 1, 0,
        1, 1, 1,
    };
    std::vector<unsigned int> indices = {
        0, 1,
        1, 3,
        3, 2,
        2, 0,
        4, 5,
        5, 7,
        7, 6,
        6, 4,
        0, 4,
        1, 5,
        2, 6,
        3, 7
    };

    glGenBuffers(1, &debugCube.renderInfo.vbo);
    glBindBuffer(GL_ARRAY_BUFFER, debugCube.renderInfo.vbo);
    glBufferData(GL_ARRAY_BUFFER,
        verts.size() * sizeof(float),
        verts.data(), GL_STATIC_DRAW
    );

    glVertexAttribPointer(0,
        3, GL_FLOAT, false, 3 * sizeof(float), (const void*)0);
    glEnableVertexAttribArray(0);

    glGenBuffers(1, &debugCube.renderInfo.ibo);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, debugCube.renderInfo.ibo);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER,
        indices.size() * sizeof(unsigned int),
        indices.data(), GL_STATIC_DRAW);
    debugCube.renderInfo.iboCount = indices.size();
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

        if (GlobalSettings.Client_DrawColliders) {
            debugShaderProgram->Use();
            lastProgram = -1;
            for (auto& cptr : obj->GetCollider().children) {
                if (AABBCollider* collider = dynamic_cast<AABBCollider*>(cptr)) {
                    // Transform locally first
                    Matrix4 model = collider->GetWorldTransform() * glm::scale(collider->size);
                    debugShaderProgram->SetColor(Vector3(0, 0, 1));
                    debugShaderProgram->Draw(*this, model, &debugCube);
                }
                else if (StaticMeshCollider* collider = dynamic_cast<StaticMeshCollider*>(cptr)) {
                    // Draw Broad
                    Matrix4 model = collider->broad.GetWorldTransform() * glm::scale(collider->broad.size);
                    debugShaderProgram->SetColor(Vector3(0, 0, 1));
                    debugShaderProgram->Draw(*this, model, &debugCube);

                    if (GlobalSettings.Client_DrawBVH) {
                        // Draw all the BVHs
                        std::queue<std::pair<BVHTree*, int>> nodes;
                        nodes.emplace(collider->bvhTree, 0);
                        while (!nodes.empty()) {
                            auto pair = nodes.front();
                            BVHTree* front = pair.first;
                            nodes.pop();
                            for (auto& child : front->children) {
                                nodes.emplace(child, pair.second + 1);
                            }
                            if (front->children.empty()) {
                                int level = pair.second;
                                debugShaderProgram->SetColor(Vector3(level % 3 == 0, level % 3 == 1, level % 3 == 2));
                                Matrix4 model = front->collider.GetWorldTransform() * glm::scale(front->collider.size);
                                debugShaderProgram->Draw(*this, model, &debugCube);
                            }
                        }
                    }
                }
            }
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
        cameraPosition = localPlayer->GetPosition();
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
        glm::radians(55.0f),
        (float) width / (float) height,
        0.2f, 500.f
    );

    for (auto& program : shaderPrograms) {
        program->Use();
        program->PreDraw(game, cameraPosition, viewMat, projMat);
    }
    debugShaderProgram->Use();
    debugShaderProgram->PreDraw(game, cameraPosition, viewMat, projMat);

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
    glClear(GL_DEPTH_BUFFER_BIT);
    for (auto& obj : foreground) {
        DrawObject(obj, lastProgram);
    }
}