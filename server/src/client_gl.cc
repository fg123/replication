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

    // Setup Available Shaders
    shaderPrograms.push_back(new DefaultMaterialShaderProgram());
    debugShaderProgram = new DebugShaderProgram();
}

void SetupMesh(Mesh& mesh, const std::vector<float>& verts, const std::vector<unsigned int>& indices) {
    glGenVertexArrays(1, &mesh.renderInfo.vao);
    glBindVertexArray(mesh.renderInfo.vao);

    glGenBuffers(1, &mesh.renderInfo.vbo);
    glBindBuffer(GL_ARRAY_BUFFER, mesh.renderInfo.vbo);
    glBufferData(GL_ARRAY_BUFFER,
        verts.size() * sizeof(float),
        verts.data(), GL_STATIC_DRAW
    );

    glVertexAttribPointer(0,
        3, GL_FLOAT, false, 3 * sizeof(float), (const void*)0);
    glEnableVertexAttribArray(0);

    glGenBuffers(1, &mesh.renderInfo.ibo);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.renderInfo.ibo);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER,
        indices.size() * sizeof(unsigned int),
        indices.data(), GL_STATIC_DRAW);
    mesh.renderInfo.iboCount = indices.size();
}

void ClientGL::SetupGL() {
    // Setup Cube
    std::vector<float> cubeVerts = {
        0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1,
        1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1,
    };
    std::vector<unsigned int> cubeIndices = {
        0, 1, 1, 3, 3, 2, 2, 0,
        4, 5, 5, 7, 7, 6, 6, 4,
        0, 4, 1, 5, 2, 6, 3, 7
    };
    SetupMesh(debugCube, cubeVerts, cubeIndices);

    // Setup Line
    std::vector<float> lineVerts = {
        0, 0, 0, 0, 0, 1
    };
    std::vector<unsigned int> lineIndices = {
        0, 1
    };
    SetupMesh(debugLine, lineVerts, lineIndices);

    debugCircle = game.GetAssetManager().GetModel("Icosphere.obj")->meshes[0];
    // Copied over, reorder indices to work with GL_LINES
    std::vector<unsigned int> newIndices;
    for (size_t i = 0; i < debugCircle.indices.size(); i += 3) {
        newIndices.push_back(debugCircle.indices[i]);
        newIndices.push_back(debugCircle.indices[i + 1]);
        newIndices.push_back(debugCircle.indices[i + 2]);
        newIndices.push_back(debugCircle.indices[i]);
    }
    debugCircle.indices = std::move(newIndices);

    debugCylinder = game.GetAssetManager().GetModel("Cylinder.obj")->meshes[0];
    // Copied over, reorder indices to work with GL_LINES
    newIndices.clear();
    for (size_t i = 0; i < debugCylinder.indices.size(); i += 3) {
        newIndices.push_back(debugCylinder.indices[i]);
        newIndices.push_back(debugCylinder.indices[i + 1]);
        newIndices.push_back(debugCylinder.indices[i + 2]);
        newIndices.push_back(debugCylinder.indices[i]);
    }
    debugCylinder.indices = std::move(newIndices);
}

void ClientGL::DrawObject(Object* obj, int& lastProgram) {
    if (obj->GetId() == game.localPlayerId) return;
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

        if (GlobalSettings.Client_DrawDebugLines) {
            debugShaderProgram->Use();
            lastProgram = -1;
            for (auto& line : obj->debugLines) {
                // LOG_DEBUG(line.from << " " << line.to);
                float length = glm::distance(line.from, line.to);

                Matrix4 model = glm::translate(line.from) *
                    glm::transpose(glm::toMat4(DirectionToQuaternion(line.to - line.from))) *
                    glm::scale(Vector3(length));
                debugShaderProgram->SetColor(line.color);
                debugShaderProgram->Draw(*this, model, &debugLine);
            }
        }

        if (GlobalSettings.Client_DrawColliders) {
            debugShaderProgram->Use();
            lastProgram = -1;
            for (auto& cptr : obj->GetCollider().children) {
                // Draw the Broad Phase
                debugShaderProgram->SetColor(Vector3(1, 0, 0));
                AABB broad = cptr->GetBroadAABB();
                Matrix4 model = glm::translate(broad.ptMin) * glm::scale(broad.ptMax - broad.ptMin);
                debugShaderProgram->Draw(*this, model, &debugCube);

                if (OBBCollider* collider = dynamic_cast<OBBCollider*>(cptr)) {
                    // Transform locally first
                    Matrix4 model = collider->GetWorldTransform() * glm::scale(collider->size);
                    debugShaderProgram->SetColor(Vector3(0, 0, 1));
                    debugShaderProgram->Draw(*this, model, &debugCube);
                }
                else if (StaticMeshCollider* collider = dynamic_cast<StaticMeshCollider*>(cptr)) {
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
                                Matrix4 model = glm::translate(front->collider.ptMin) * glm::scale(front->collider.ptMax - front->collider.ptMin);
                                debugShaderProgram->Draw(*this, model, &debugCube);
                            }
                        }
                    }
                }
                else if (SphereCollider* collider = dynamic_cast<SphereCollider*>(cptr)) {
                    Matrix4 model = collider->GetWorldTransform() * glm::scale(Vector3(collider->radius));
                    debugShaderProgram->SetColor(Vector3(0, 0, 1));
                    debugShaderProgram->Draw(*this, model, &debugCircle);
                }
                else if (CapsuleCollider* collider = dynamic_cast<CapsuleCollider*>(cptr)) {
                    Matrix4 model = collider->GetWorldTransform() * glm::scale(Vector3(collider->radius));
                    debugShaderProgram->SetColor(Vector3(0, 0, 1));
                    debugShaderProgram->Draw(*this, model, &debugCircle);

                    model = collider->GetWorldTransformForLocalPoint(collider->position2) * glm::scale(Vector3(collider->radius));
                    debugShaderProgram->SetColor(Vector3(0, 0, 1));
                    debugShaderProgram->Draw(*this, model, &debugCircle);

                    Vector3 pt1 = Vector3(collider->GetWorldTransform() * Vector4(0, 0, 0, 1));
                    Vector3 pt2 = Vector3(collider->GetWorldTransformForLocalPoint(collider->position2) * Vector4(0, 0, 0, 1));


                    model = glm::translate(pt1) * glm::transpose(glm::toMat4(DirectionToQuaternion(pt2 - pt1))) * glm::scale(Vector3(collider->radius,
                        collider->radius, glm::distance(collider->position, collider->position2)));

                    debugShaderProgram->SetColor(Vector3(0, 0, 1));
                    debugShaderProgram->Draw(*this, model, &debugCylinder);
                }
            }
        }
    }
}

void ClientGL::Draw(int width, int height) {
    // LOG_DEBUG("Draw " << width << " " << height);
    windowWidth = width;
    windowHeight = height;
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

    viewMat = glm::lookAt(cameraPosition,
        cameraPosition + cameraRotation, Vector::Up);

    projMat = glm::perspective(
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

Vector2 ClientGL::WorldToScreenCoordinates(Vector3 worldCoord) {
    Vector4 clipCoords = projMat * viewMat * Vector4(worldCoord, 1.0);
    Vector3 NDC = Vector3(clipCoords) / clipCoords.w;
    // LOG_DEBUG(NDC);
    return Vector2((NDC.x + 1) * (windowWidth / 2), windowHeight - (NDC.y + 1) * (windowHeight / 2));
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