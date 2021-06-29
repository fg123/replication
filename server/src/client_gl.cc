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
#include <emscripten.h>

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
    shadowMapShaderProgram = new ShadowMapShaderProgram();
    quadDrawShaderProgram = new QuadShaderProgram();
    minimapShaderProgram = new MinimapShaderProgram();
    minimapShaderProgram->SetMinimapSize(MINIMAP_WIDTH, MINIMAP_HEIGHT);

    // Generate Texture for Minimap FBO
    glGenTextures(1, &minimapTexture);
    glBindTexture(GL_TEXTURE_2D, minimapTexture);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB,
                MINIMAP_WIDTH, MINIMAP_HEIGHT, 0, GL_RGB, GL_UNSIGNED_BYTE, NULL);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    GLuint minimapDepthMap;
    glGenTextures(1, &minimapDepthMap);
    glBindTexture(GL_TEXTURE_2D, minimapDepthMap);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_DEPTH_COMPONENT24,
            MINIMAP_WIDTH, MINIMAP_HEIGHT, 0, GL_DEPTH_COMPONENT, GL_UNSIGNED_INT, NULL);

    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    glGenFramebuffers(1, &minimapFBO);
    glBindFramebuffer(GL_FRAMEBUFFER, minimapFBO);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, minimapTexture, 0);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_TEXTURE_2D, minimapDepthMap, 0);

    GLenum status = glCheckFramebufferStatus(GL_FRAMEBUFFER);

    if (status != GL_FRAMEBUFFER_COMPLETE) {
        LOG_ERROR("FB error, status: " << status);
    }
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
        0, 0, 0, 0, 0, -1
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

    minimapMarker = game.GetAssetManager().GetModel("PlayerMarkerMinimap.obj")->meshes[0];
}

void ClientGL::DrawDebugLine(const Vector3& color, const Vector3& from, const Vector3& to) {
    debugShaderProgram->Use();
    float length = glm::distance(from, to);

    Matrix4 model = glm::translate(from) *
        glm::transpose(glm::toMat4(DirectionToQuaternion(to - from))) *
        glm::scale(Vector3(length));
    debugShaderProgram->SetColor(color);
    debugShaderProgram->Draw(*this, model, &debugLine);
}

void ClientGL::DrawDebug(Object* obj) {
    debugShaderProgram->Use();
    if (GlobalSettings.Client_DrawDebugLines) {
        for (auto& line : obj->debugLines) {
            DrawDebugLine(line.color, line.from, line.to);
        }
    }

    if (GlobalSettings.Client_DrawColliders) {
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
                    std::queue<std::pair<BVHTree<BVHTriangle>*, int>> nodes;
                    nodes.emplace(collider->bvhTree, 0);
                    while (!nodes.empty()) {
                        auto pair = nodes.front();
                        BVHTree<BVHTriangle>* front = pair.first;
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

void ClientGL::DrawObject(DrawParams& params, int& lastProgram) {
    int program = params.mesh->material->GetShaderProgram();
    if (program != lastProgram) {
        lastProgram = program;
        shaderPrograms[program]->Use();
    }
    DefaultMaterialShaderProgram* defaultProgram = dynamic_cast<DefaultMaterialShaderProgram*>(shaderPrograms[program]);
    if (params.hasOutline && defaultProgram) {
        // Render Front only
        glCullFace(GL_FRONT);
        defaultProgram->SetDrawOutline(0.05, Vector3(1));
        shaderPrograms[program]->Draw(*this, params.transform, params.mesh);
    }
    if (defaultProgram) {
        defaultProgram->SetDrawOutline(0, Vector3());
    }
    glCullFace(GL_BACK);
    shaderPrograms[program]->Draw(*this, params.transform, params.mesh);
}

template<typename T>
T CalculateCenter(T* arr, size_t size) {
    T res;
    for (size_t i = 0; i < size; i++) {
        res += arr[i];
    }
    return res / size;
}

Vector4 viewFrustrumPoints[] = {
    Vector4(-1, -1, 0, 1),
    Vector4(-1,  1, 0, 1),
    Vector4( 1,  1, 0, 1),
    Vector4( 1, -1, 0, 1),
    Vector4(-1, -1, 1, 1),
    Vector4(-1,  1, 1, 1),
    Vector4( 1,  1, 1, 1),
    Vector4( 1, -1, 1, 1)
};

template<typename A, typename B>
void MultiplyAll(A* dest, const A* src, size_t count, const B& multiplyBy) {
    for (size_t i = 0; i < count; i++) {
        dest[i] = multiplyBy * src[i];
    }
}

void ClientGL::DrawShadowObjects(DrawLayer& layer) {
    for (auto& pair : layer.opaque) {
        for (auto& param : pair.second) {
            if (!param.castShadows) continue;
            shadowMapShaderProgram->Draw(*this, param.transform, param.mesh);
        }
    }
}

void ClientGL::Draw(int width, int height) {
    // LOG_DEBUG("Draw " << width << " " << height);
    windowWidth = width;
    windowHeight = height;

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

    foregroundLayer.Clear();
    backgroundLayer.Clear();
    behindPlayerLayer.Clear();

    viewMat = glm::lookAt(cameraPosition,
        cameraPosition + cameraRotation, Vector::Up);

    float FOV = glm::radians(55.0f);
    float viewNear = 0.2f;
    float viewFar = 300.f;
    float aspectRatio = (float) width / (float) height;
    projMat = glm::perspective(FOV, aspectRatio, viewNear, viewFar);

    for (auto& gameObjectPair : game.GetGameObjects()) {
        Object* obj = gameObjectPair.second;
        Matrix4 transform = obj->GetTransform();
        bool isForeground = obj->IsTagged(Tag::DRAW_FOREGROUND);
        DrawLayer& layerToDraw = !obj->visibleInFrustrum ? behindPlayerLayer : (isForeground ? foregroundLayer : backgroundLayer);

        if (Model* model = obj->GetModel()) {
            for (auto& mesh : model->meshes) {
                Vector3 centerPt = Vector3(obj->GetTransform() * Vector4(mesh.center, 1));
                if (mesh.material->IsTransparent()) {
                    DrawParams& params = layerToDraw.transparent[
                        glm::distance2(centerPt, cameraPosition)];
                    params.id = obj->GetId();
                    params.mesh = &mesh;
                    params.transform = transform;
                    params.castShadows = !obj->IsTagged(Tag::NO_CAST_SHADOWS);
                    params.hasOutline = obj->IsTagged(Tag::DRAW_OUTLINE);
                }
                else {
                    // auto& list = layerToDraw.opaque[glm::distance2(centerPt, cameraPosition)];
                    auto& list = layerToDraw.opaque[mesh.material];
                    list.reserve(500);
                    DrawParams& params = list.emplace_back();
                    params.id = obj->GetId();
                    params.mesh = &mesh;
                    params.transform = transform;
                    params.castShadows = !obj->IsTagged(Tag::NO_CAST_SHADOWS);
                    params.hasOutline = obj->IsTagged(Tag::DRAW_OUTLINE);
                }
            }
        }
    }

    Matrix4 nearProj = glm::perspective(FOV, aspectRatio, viewNear, 10.f);
    Matrix4 midProj = glm::perspective(FOV, aspectRatio, viewNear, 50.f);
    Matrix4 farProj = glm::perspective(FOV, aspectRatio, viewNear, viewFar);

    Matrix4 inverseNear = glm::inverse(nearProj * viewMat);
    Matrix4 inverseMid = glm::inverse(midProj * viewMat);
    Matrix4 inverseFar = glm::inverse(farProj * viewMat);

    Vector4 viewFrustrumPointsNear[8],
            viewFrustrumPointsMid[8],
            viewFrustrumPointsFar[8];
    MultiplyAll(viewFrustrumPointsNear, viewFrustrumPoints, 8, inverseNear);
    MultiplyAll(viewFrustrumPointsMid, viewFrustrumPoints, 8, inverseMid);
    MultiplyAll(viewFrustrumPointsFar, viewFrustrumPoints, 8, inverseFar);

    for (size_t i = 0; i < 8; i++) {
        viewFrustrumPointsNear[i] /= viewFrustrumPointsNear[i].w;
        viewFrustrumPointsMid[i] /= viewFrustrumPointsMid[i].w;
        viewFrustrumPointsFar[i] /= viewFrustrumPointsFar[i].w;
    }

    // Setup Shadow Maps
    if (!GlobalSettings.Client_NoShadows) {
        for (auto& light : game.GetAssetManager().lights) {
            Matrix4 lightView = glm::lookAt(light.position, light.position + light.direction,
                Vector::Up);

            shadowMapShaderProgram->Use();

            Matrix4 biasMatrix(
                0.5, 0.0, 0.0, 0.0,
                0.0, 0.5, 0.0, 0.0,
                0.0, 0.0, 0.5, 0.0,
                0.5, 0.5, 0.5, 1.0
            );

            Vector3 boxToLight[8];

            // GL Setup
            glBindFramebuffer(GL_FRAMEBUFFER, light.shadowFrameBuffer);
            // glBindFramebuffer(GL_FRAMEBUFFER, 0);
            glClearColor(1, 1, 1, 1);
            glClear(GL_DEPTH_BUFFER_BIT | GL_COLOR_BUFFER_BIT);
            glEnable(GL_CULL_FACE);
            glCullFace(GL_FRONT);
            glEnable(GL_DEPTH_TEST);

            // shaderPrograms[0]->Use();
            // shaderPrograms[0]->PreDraw(game, light.position, lightView, lightProjection);

            // Draw Near Field
            glViewport(0, 0, SHADOW_WIDTH, SHADOW_HEIGHT);
            for (size_t i = 0; i < 8; i++) {
                boxToLight[i] = Vector3(lightView * viewFrustrumPointsNear[i]);
            }

            AABB boxExtents { boxToLight, 8 };
            Matrix4 lightProjection = glm::ortho(boxExtents.ptMin.x, boxExtents.ptMax.x,
                boxExtents.ptMin.y, boxExtents.ptMax.y, 1.0f, 400.f);
            light.depthBiasMVPNear = biasMatrix * lightProjection * lightView;
            shadowMapShaderProgram->PreDraw(game, Vector3(), lightView, lightProjection);

            DrawShadowObjects(backgroundLayer);
            DrawShadowObjects(behindPlayerLayer);
            DrawShadowObjects(foregroundLayer);

            // Update stuff to middle side
            for (size_t i = 0; i < 8; i++) {
                boxToLight[i] = Vector3(lightView * viewFrustrumPointsMid[i]);
            }

            boxExtents = AABB(boxToLight, 8);
            lightProjection = glm::ortho(boxExtents.ptMin.x, boxExtents.ptMax.x,
                boxExtents.ptMin.y, boxExtents.ptMax.y, 1.0f, 400.f);

            light.depthBiasMVPMid = biasMatrix * lightProjection * lightView;
            shadowMapShaderProgram->PreDraw(game, Vector3(), lightView, lightProjection);

            glViewport(SHADOW_WIDTH, 0, SHADOW_WIDTH, SHADOW_HEIGHT);

            DrawShadowObjects(backgroundLayer);
            DrawShadowObjects(behindPlayerLayer);
            DrawShadowObjects(foregroundLayer);

            // Update stuff to far side
            for (size_t i = 0; i < 8; i++) {
                boxToLight[i] = Vector3(lightView * viewFrustrumPointsFar[i]);
            }

            boxExtents = AABB(boxToLight, 8);
            lightProjection = glm::ortho(boxExtents.ptMin.x, boxExtents.ptMax.x,
                boxExtents.ptMin.y, boxExtents.ptMax.y, 1.0f, 400.f);

            light.depthBiasMVPFar = biasMatrix * lightProjection * lightView;
            shadowMapShaderProgram->PreDraw(game, Vector3(), lightView, lightProjection);

            glViewport(0, SHADOW_HEIGHT, SHADOW_WIDTH, SHADOW_HEIGHT);

            DrawShadowObjects(backgroundLayer);
            DrawShadowObjects(behindPlayerLayer);
            DrawShadowObjects(foregroundLayer);

            // debugShaderProgram->Use();
            // debugShaderProgram->PreDraw(game, Vector3(), lightView, lightProjection);

            // DrawDebugLine(Vector3(1, 0, 0), Vector3(viewFrustrumPointsNear[0]), Vector3(viewFrustrumPointsNear[1]));
            // DrawDebugLine(Vector3(1, 0, 0), Vector3(viewFrustrumPointsNear[1]), Vector3(viewFrustrumPointsNear[2]));
            // DrawDebugLine(Vector3(1, 0, 0), Vector3(viewFrustrumPointsNear[2]), Vector3(viewFrustrumPointsNear[3]));
            // DrawDebugLine(Vector3(1, 0, 0), Vector3(viewFrustrumPointsNear[3]), Vector3(viewFrustrumPointsNear[0]));
            // DrawDebugLine(Vector3(0, 1, 0), Vector3(viewFrustrumPointsNear[4]), Vector3(viewFrustrumPointsNear[5]));
            // DrawDebugLine(Vector3(0, 1, 0), Vector3(viewFrustrumPointsNear[5]), Vector3(viewFrustrumPointsNear[6]));
            // DrawDebugLine(Vector3(0, 1, 0), Vector3(viewFrustrumPointsNear[6]), Vector3(viewFrustrumPointsNear[7]));
            // DrawDebugLine(Vector3(0, 1, 0), Vector3(viewFrustrumPointsNear[7]), Vector3(viewFrustrumPointsNear[4]));
        }
    }

    // Render Minimap
    glBindFramebuffer(GL_FRAMEBUFFER, minimapFBO);
    glViewport(0, 0, MINIMAP_WIDTH, MINIMAP_HEIGHT);
    glClearColor(135.0 / 255.0, 206.0 / 255.0, 235.0 / 255.0, 1);
    glClear(GL_COLOR_BUFFER_BIT);

    Vector3 minimapCamPosition = Vector3(cameraPosition.x, 100, cameraPosition.z);
    // Matrix4 minimapView = glm::lookAt(minimapCamPosition,
    //     cameraPosition, cameraRotation);

    Matrix4 minimapView = glm::lookAt(minimapCamPosition,
        minimapCamPosition - Vector::Up, Vector3(cameraRotation.x, 0, cameraRotation.z));

    Matrix4 minimapProj = glm::ortho(-50.0, 50.0, -50.0, 50.0, 1.0, 500.0);

    for (auto& program : shaderPrograms) {
        program->Use();
        program->PreDraw(game, minimapCamPosition, minimapView, minimapProj);
        program->SetRenderShadows(false);
    }

    debugShaderProgram->Use();
    debugShaderProgram->PreDraw(game, minimapCamPosition, minimapView, minimapProj);
    DrawObjects(true);

    if (PlayerObject* localPlayer = game.GetLocalPlayer()) {
        shaderPrograms[0]->Use();
        glDisable(GL_DEPTH_TEST);

        shaderPrograms[0]->Draw(*this,  glm::translate(Vector3(cameraPosition.x, 95, cameraPosition.z)) *
                glm::transpose(glm::toMat4(localPlayer->clientRotation)) * glm::scale(Vector3(2, 2, 2)), &minimapMarker);
    }

    // World Render
    for (auto& program : shaderPrograms) {
        program->Use();
        program->PreDraw(game, cameraPosition, viewMat, projMat);
        program->SetRenderShadows(!GlobalSettings.Client_NoShadows);
    }
    debugShaderProgram->Use();
    debugShaderProgram->PreDraw(game, cameraPosition, viewMat, projMat);

    glBindFramebuffer(GL_FRAMEBUFFER, 0);
    glViewport(0, 0, width, height);
    glClearColor(135.0 / 255.0, 206.0 / 255.0, 235.0 / 255.0, 1);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    DrawObjects(false);

    if (GlobalSettings.Client_DrawShadowMaps) {
        Matrix4 transform = glm::translate(Vector3(-0.5f, -0.5f, 0.0f));
        for (auto& light : game.GetAssetManager().lights) {
            quadDrawShaderProgram->Use();
            quadDrawShaderProgram->DrawQuad(light.shadowColorMap, transform);
        }
    }

    Matrix4 minimapQuadTransform = glm::translate(Vector3((1 - (0.75 * (height / (float) width))), 0.25, 0)) * glm::scale(Vector3(0.75f * (height / (float)width), 0.75f, 1));
    minimapShaderProgram->Use();
    glDisable(GL_DEPTH_TEST);
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    minimapShaderProgram->DrawQuad(minimapTexture, minimapQuadTransform);
}

Vector2 ClientGL::WorldToScreenCoordinates(Vector3 worldCoord) {
    Vector4 clipCoords = projMat * viewMat * Vector4(worldCoord, 1.0);
    Vector3 NDC = Vector3(clipCoords) / clipCoords.w;
    // LOG_DEBUG(NDC);
    return Vector2((NDC.x + 1) * (windowWidth / 2), windowHeight - (NDC.y + 1) * (windowHeight / 2));
}

void ClientGL::DrawObjects(bool drawBehind) {
    int lastProgram = -1;
    glEnable(GL_CULL_FACE);
    glCullFace(GL_BACK);
    glEnable(GL_DEPTH_TEST);
    // Draw Background
    for (auto& pair : backgroundLayer.opaque) {
        for (auto& param : pair.second) {
            if (param.id == game.localPlayerId) continue;
            DrawObject(param, lastProgram);
        }
    }
    for (auto it = backgroundLayer.transparent.rbegin(); it != backgroundLayer.transparent.rend(); ++it) {
        // LOG_DEBUG(it->second.mesh->name);
        DrawObject(it->second, lastProgram);
    }

    if (drawBehind) {
        for (auto& pair : behindPlayerLayer.opaque) {
            for (auto& param : pair.second) {
                DrawObject(param, lastProgram);
            }
        }
        for (auto it = behindPlayerLayer.transparent.rbegin(); it != behindPlayerLayer.transparent.rend(); ++it) {
            // LOG_DEBUG(it->second.mesh->name);
            DrawObject(it->second, lastProgram);
        }
    }
    // Draw Foreground
    glClear(GL_DEPTH_BUFFER_BIT);

    glDisable(GL_CULL_FACE);
    for (auto& pair : foregroundLayer.opaque) {
        for (auto& param : pair.second) {
            DrawObject(param, lastProgram);
        }
    }
    for (auto it = foregroundLayer.transparent.rbegin(); it != foregroundLayer.transparent.rend(); ++it) {
        DrawObject(it->second, lastProgram);
    }

    // Debug Drawing
    for (auto& gameObjectPair : game.GetGameObjects()) {
        DrawDebug(gameObjectPair.second);
    }
}