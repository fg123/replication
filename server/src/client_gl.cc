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

void ClientGL::SetGLCullFace(GLenum setting) {
    static GLenum cachedSetting = -1;
    if (cachedSetting != setting) {
        cachedSetting = setting;
        glCullFace(setting);
    }
}

GLLimits ClientGL::glLimits;

void ClientGL::SetupContext() {
    LOG_DEBUG("Setting up context for selector: " << canvasSelector);
    EmscriptenWebGLContextAttributes attrs;
    emscripten_webgl_init_context_attributes(&attrs);
    attrs.majorVersion = 2;
    attrs.antialias = false;
    attrs.alpha = true;
    attrs.depth = true;

    // attrs.stencil = true;
    glContext = emscripten_webgl_create_context(canvasSelector.c_str(), &attrs);
    emscripten_webgl_make_context_current(glContext);

    glGetIntegerv(GL_MAX_SAMPLES, &glLimits.MAX_SAMPLES);
    LOG_INFO("GL_MAX_SAMPLES = " << glLimits.MAX_SAMPLES);

    // Setup Available Shaders
    shaderPrograms.push_back(new DefaultMaterialShaderProgram());
    debugShaderProgram = new DebugShaderProgram();
    shadowMapShaderProgram = new ShadowMapShaderProgram();
    quadDrawShaderProgram = new QuadShaderProgram("shaders/Quad.fs");
    minimapShaderProgram = new QuadShaderProgram("shaders/Minimap.fs");
    minimapShaderProgram->SetTextureSize(MINIMAP_WIDTH, MINIMAP_HEIGHT);

    antialiasShaderProgram = new QuadShaderProgram("shaders/Antialias.fs");

    // Generate Texture for Minimap FBO
    minimapRenderBuffer.SetSize(MINIMAP_WIDTH, MINIMAP_HEIGHT);
    shadowMapRenderBuffer.SetSize(SHADOW_WIDTH * 2, SHADOW_HEIGHT * 2);
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
        SetGLCullFace(GL_FRONT);
        defaultProgram->SetDrawOutline(0.02, Vector3(1));
        shaderPrograms[program]->Draw(*this, params.transform, params.mesh);
    }
    if (defaultProgram) {
        defaultProgram->SetDrawOutline(0, Vector3());
    }
    SetGLCullFace(GL_BACK);
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

void ClientGL::SetupDrawingLayers() {
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
}

void ClientGL::RenderMinimap() {
    minimapRenderBuffer.Bind();
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

    // Draw Minimap onto base
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    GLuint minimapTexture = minimapRenderBuffer.BlitTexture();
    worldRenderBuffer.Bind();
    minimapShaderProgram->Use();
    Matrix4 minimapQuadTransform = glm::translate(
        Vector3((1 - (0.75 * (windowHeight / (float) windowWidth))), 0.25, 0)) *
        glm::scale(Vector3(0.75f * (windowHeight / (float)windowWidth), 0.75f, 1));
    minimapShaderProgram->DrawQuad(minimapTexture, minimapQuadTransform);
}

void ClientGL::RenderWorld() {
    // World Render
    for (auto& program : shaderPrograms) {
        program->Use();
        program->PreDraw(game, cameraPosition, viewMat, projMat);
        program->SetRenderShadows(!GlobalSettings.Client_NoShadows);
    }
    debugShaderProgram->Use();
    debugShaderProgram->PreDraw(game, cameraPosition, viewMat, projMat);

    worldRenderBuffer.Bind();
    glClearColor(135.0 / 255.0, 206.0 / 255.0, 235.0 / 255.0, 1);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    DrawObjects(false);
}

void ClientGL::Draw(int width, int height) {
    // LOG_DEBUG("Draw " << width << " " << height);
    windowWidth = width;
    windowHeight = height;

    worldRenderBuffer.SetSize(width, height);
    bloomRenderBuffer.SetSize(width, height);

    SetupDrawingLayers();

    viewMat = glm::lookAt(cameraPosition,
        cameraPosition + cameraRotation, Vector::Up);

    float FOV = glm::radians(55.0f);
    float viewNear = 0.2f;
    float viewFar = 300.f;
    float aspectRatio = (float) width / (float) height;
    projMat = glm::perspective(FOV, aspectRatio, viewNear, viewFar);

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
    glEnable(GL_CULL_FACE);
    SetGLCullFace(GL_BACK);
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

            // Draw to our temporary buffer
            shadowMapRenderBuffer.Bind();
            // glBindFramebuffer(GL_FRAMEBUFFER, 0);
            glClearColor(1, 1, 1, 1);
            glClear(GL_DEPTH_BUFFER_BIT | GL_COLOR_BUFFER_BIT);
            glEnable(GL_CULL_FACE);
            SetGLCullFace(GL_FRONT);
            glEnable(GL_DEPTH_TEST);

            // shaderPrograms[0]->Use();
            // shaderPrograms[0]->PreDraw(game, light.position, lightView, lightProjection);

            // Draw Near Field
            glViewport(0, 0, SHADOW_WIDTH, SHADOW_HEIGHT);
            for (size_t i = 0; i < 8; i++) {
                boxToLight[i] = Vector3(lightView * viewFrustrumPointsNear[i]);
            }

            AABB boxExtents { boxToLight, 8 };
            Matrix4 lightProjection = glm::ortho(
                glm::floor(boxExtents.ptMin.x),
                glm::ceil(boxExtents.ptMax.x),
                glm::floor(boxExtents.ptMin.y),
                glm::ceil(boxExtents.ptMax.y), 1.0f, 400.f);
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
            lightProjection = glm::ortho(
                glm::floor(boxExtents.ptMin.x),
                glm::ceil(boxExtents.ptMax.x),
                glm::floor(boxExtents.ptMin.y),
                glm::ceil(boxExtents.ptMax.y), 1.0f, 400.f);

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
            lightProjection = glm::ortho(
                glm::floor(boxExtents.ptMin.x),
                glm::ceil(boxExtents.ptMax.x),
                glm::floor(boxExtents.ptMin.y),
                glm::ceil(boxExtents.ptMax.y), 1.0f, 400.f);

            light.depthBiasMVPFar = biasMatrix * lightProjection * lightView;
            shadowMapShaderProgram->PreDraw(game, Vector3(), lightView, lightProjection);

            glViewport(0, SHADOW_HEIGHT, SHADOW_WIDTH, SHADOW_HEIGHT);

            DrawShadowObjects(backgroundLayer);
            DrawShadowObjects(behindPlayerLayer);
            DrawShadowObjects(foregroundLayer);

            // Copy it over by blitzing
            glBindFramebuffer(GL_DRAW_FRAMEBUFFER, light.shadowFrameBuffer);
            glBindFramebuffer(GL_READ_FRAMEBUFFER, shadowMapRenderBuffer.fbo);
            glBlitFramebuffer(
                0, 0, SHADOW_WIDTH * 2, SHADOW_HEIGHT * 2,
                0, 0, SHADOW_WIDTH * 2, SHADOW_HEIGHT * 2,
                GL_DEPTH_BUFFER_BIT, GL_NEAREST);

        }
    }

    RenderWorld();
    RenderMinimap();

    // Finally render everything to the main buffer
    glBindFramebuffer(GL_FRAMEBUFFER, 0);
    if (GlobalSettings.Client_DrawShadowMaps) {
        Matrix4 transform = glm::translate(Vector3(-0.5f, -0.5f, 0.0f));
        for (auto& light : game.GetAssetManager().lights) {
            quadDrawShaderProgram->Use();
            quadDrawShaderProgram->DrawQuad(light.shadowColorMap, transform);
        }
    }

    // Blit World Buffer onto Screen
    glBindFramebuffer(GL_READ_FRAMEBUFFER, worldRenderBuffer.fbo);

    glBlitFramebuffer(
        0, 0, worldRenderBuffer.width, worldRenderBuffer.height,
        0, 0, worldRenderBuffer.width, worldRenderBuffer.height,
        GL_COLOR_BUFFER_BIT, GL_NEAREST
    );
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
    SetGLCullFace(GL_BACK);
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

void RenderBuffer::SetSize(int newWidth, int newHeight) {
    if (newWidth == width && newHeight == height) {
        return;
    }

    width = newWidth;
    height = newHeight;

    if (fbo) {
        glDeleteFramebuffers(1, &fbo);
        fbo = 0;
    }

    if (renderBufferColor) {
        glDeleteRenderbuffers(1, &renderBufferColor);
        renderBufferColor = 0;
    }

    if (renderBufferDepth) {
        glDeleteRenderbuffers(1, &renderBufferDepth);
        renderBufferDepth = 0;
    }

    if (internalFBO) {
        glDeleteFramebuffers(1, &internalFBO);
        internalFBO = 0;
    }

    if (internalTexture) {
        glDeleteTextures(1, &internalTexture);
        internalTexture = 0;
    }

    if (internalDepth) {
        glDeleteTextures(1, &internalDepth);
        internalDepth = 0;
    }

    glGenRenderbuffers(1, &renderBufferColor);
    glBindRenderbuffer(GL_RENDERBUFFER, renderBufferColor);
    glRenderbufferStorageMultisample(GL_RENDERBUFFER, ClientGL::glLimits.MAX_SAMPLES, GL_RGBA8,
        width, height);

    glGenRenderbuffers(1, &renderBufferDepth);
    glBindRenderbuffer(GL_RENDERBUFFER, renderBufferDepth);
    glRenderbufferStorageMultisample(GL_RENDERBUFFER, ClientGL::glLimits.MAX_SAMPLES, GL_DEPTH_COMPONENT24,
        width, height);

    glGenFramebuffers(1, &fbo);
    glBindFramebuffer(GL_FRAMEBUFFER, fbo);
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_RENDERBUFFER, renderBufferColor);
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, renderBufferDepth);

    GLenum status = glCheckFramebufferStatus(GL_FRAMEBUFFER);

    if (status != GL_FRAMEBUFFER_COMPLETE) {
        LOG_ERROR("Could not setup render buffer! Status: " << status);
    }

    glGenTextures(1, &internalTexture);
    glBindTexture(GL_TEXTURE_2D, internalTexture);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA,
                width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, NULL);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    glGenTextures(1, &internalDepth);
    glBindTexture(GL_TEXTURE_2D, internalDepth);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_DEPTH_COMPONENT24,
            width, height, 0, GL_DEPTH_COMPONENT, GL_UNSIGNED_INT, NULL);

    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    glGenFramebuffers(1, &internalFBO);
    glBindFramebuffer(GL_FRAMEBUFFER, internalFBO);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, internalTexture, 0);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_TEXTURE_2D, internalDepth, 0);

    status = glCheckFramebufferStatus(GL_FRAMEBUFFER);
    if (status != GL_FRAMEBUFFER_COMPLETE) {
        LOG_ERROR("Could not setup internal frame buffer! Status: " << status);
    }

}

GLuint RenderBuffer::BlitTexture() {
    glBindFramebuffer(GL_READ_FRAMEBUFFER, fbo);
    glBindFramebuffer(GL_DRAW_FRAMEBUFFER, internalFBO);
    glBlitFramebuffer(0, 0, width, height, 0, 0, width, height, GL_COLOR_BUFFER_BIT, GL_NEAREST);
    return internalTexture;
}