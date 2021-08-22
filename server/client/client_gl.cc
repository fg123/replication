#include "client_gl.h"
#include "logging.h"
#include "game.h"
#include "player.h"
#include "vector.h"
#include "shader.h"
#include "bvh.h"
#include "global.h"

#define IMGUI_IMPL_OPENGL_ES3
#include "imgui.h"
#include "imgui_impl_opengl3.h"
#include "imgui_impl_web.h"

#include <vector>
#include <fstream>
#include <map>
#include <emscripten.h>

ClientGL::ClientGL(Game& game, const char* selector) :
    canvasSelector(selector),
    game(game),
    renderer(game.scene.assetManager) {
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

    emscripten_webgl_enable_extension(glContext, "EXT_color_buffer_float");

    glGetIntegerv(GL_MAX_SAMPLES, &glLimits.MAX_SAMPLES);
    LOG_INFO("GL_MAX_SAMPLES = " << glLimits.MAX_SAMPLES);

    // Setup Available Shaders
    // shaderPrograms.push_back(new DefaultMaterialShaderProgram());
    // shaderPrograms.push_back(new DeferredShadingGeometryShaderProgram());
    debugShaderProgram = new DebugShaderProgram();
    quadDrawShaderProgram = new QuadShaderProgram("shaders/Quad.fs");
    minimapShaderProgram = new QuadShaderProgram("shaders/Minimap.fs");
    minimapShaderProgram->SetTextureSize(MINIMAP_WIDTH, MINIMAP_HEIGHT);

    antialiasShaderProgram = new QuadShaderProgram("shaders/Antialias.fs");

    renderer.Initialize();

    // Generate Texture for Minimap FBO
    minimapGBuffer.SetSize(MINIMAP_WIDTH, MINIMAP_HEIGHT);

    // Setup IMGUI
    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGuiIO& io = ImGui::GetIO();
    UNUSED(io);
    ImGui::StyleColorsDark();
    ImGuiStyle* style = &ImGui::GetStyle();
    style->WindowRounding = 5.0f;
    ImGui_ImplWeb_Init();
    ImGui_ImplOpenGL3_Init("#version 300 es");
}

// TODO: somewhere we probably want to destroy the context for the imgui
//   but at this point the game either closes and ends, there's no
//   shutdown procedure on the client side.

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
    // std::vector<float> cubeVerts = {
    //     0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1,
    //     1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1,
    // };
    // std::vector<unsigned int> cubeIndices = {
    //     0, 1, 1, 3, 3, 2, 2, 0,
    //     4, 5, 5, 7, 7, 6, 6, 4,
    //     0, 4, 1, 5, 2, 6, 3, 7
    // };
    // SetupMesh(debugCube, cubeVerts, cubeIndices);

    // // Setup Line
    // std::vector<float> lineVerts = {
    //     0, 0, 0, 0, 0, -1
    // };
    // std::vector<unsigned int> lineIndices = {
    //     0, 1
    // };
    // SetupMesh(debugLine, lineVerts, lineIndices);

    // debugCircle = game.GetAssetManager().GetModel("Icosphere.obj")->meshes[0];

    // // Copied over, reorder indices to work with GL_LINES
    // std::vector<unsigned int> newIndices;
    // for (size_t i = 0; i < debugCircle.indices.size(); i += 3) {
    //     newIndices.push_back(debugCircle.indices[i]);
    //     newIndices.push_back(debugCircle.indices[i + 1]);
    //     newIndices.push_back(debugCircle.indices[i + 2]);
    //     newIndices.push_back(debugCircle.indices[i]);
    // }
    // debugCircle.indices = std::move(newIndices);

    // debugCylinder = game.GetAssetManager().GetModel("Cylinder.obj")->meshes[0];
    // // Copied over, reorder indices to work with GL_LINES
    // newIndices.clear();
    // for (size_t i = 0; i < debugCylinder.indices.size(); i += 3) {
    //     newIndices.push_back(debugCylinder.indices[i]);
    //     newIndices.push_back(debugCylinder.indices[i + 1]);
    //     newIndices.push_back(debugCylinder.indices[i + 2]);
    //     newIndices.push_back(debugCylinder.indices[i]);
    // }
    // debugCylinder.indices = std::move(newIndices);

    minimapMarker = game.GetAssetManager().GetModel("PlayerMarkerMinimap.obj")->meshes[0];
    skydomeTexture = game.GetAssetManager().LoadTexture(RESOURCE_PATH("textures/Skydome.png"), Texture::Format::RGB);
}

void ClientGL::DrawDebugLine(const Vector3& color, const Vector3& from, const Vector3& to) {
    // debugShaderProgram->Use();
    // float length = glm::distance(from, to);

    // Matrix4 model = glm::translate(from) *
    //     glm::transpose(glm::toMat4(DirectionToQuaternion(to - from))) *
    //     glm::scale(Vector3(length));
    // debugShaderProgram->SetColor(color);
    // debugShaderProgram->Draw(model, &debugLine);
}

void ClientGL::DrawDebug(Object* obj) {
    // debugShaderProgram->Use();
    // if (GlobalSettings.Client_DrawDebugLines) {
    //     for (auto& line : obj->debugLines) {
    //         DrawDebugLine(line.color, line.from, line.to);
    //     }
    // }

    if (GlobalSettings.Client_DrawColliders) {
        // for (auto& cptr : obj->GetCollider().children) {
        //     // Draw the Broad Phase
        //     debugShaderProgram->SetColor(Vector3(1, 0, 0));
        //     AABB broad = cptr->GetBroadAABB();
        //     Matrix4 model = glm::translate(broad.ptMin) * glm::scale(broad.ptMax - broad.ptMin);
        //     debugShaderProgram->Draw(model, &debugCube);

        //     if (OBBCollider* collider = dynamic_cast<OBBCollider*>(cptr)) {
        //         // Transform locally first
        //         Matrix4 model = collider->GetWorldTransform() * glm::scale(collider->size);
        //         debugShaderProgram->SetColor(Vector3(0, 0, 1));
        //         debugShaderProgram->Draw(model, &debugCube);
        //     }
        //     else if (StaticMeshCollider* collider = dynamic_cast<StaticMeshCollider*>(cptr)) {
        //         if (GlobalSettings.Client_DrawBVH) {
        //             // Draw all the BVHs
        //             std::queue<std::pair<BVHTree<BVHTriangle>*, int>> nodes;
        //             nodes.emplace(collider->bvhTree, 0);
        //             while (!nodes.empty()) {
        //                 auto pair = nodes.front();
        //                 BVHTree<BVHTriangle>* front = pair.first;
        //                 nodes.pop();
        //                 for (auto& child : front->children) {
        //                     nodes.emplace(child, pair.second + 1);
        //                 }
        //                 if (front->children.empty()) {
        //                     int level = pair.second;
        //                     debugShaderProgram->SetColor(Vector3(level % 3 == 0, level % 3 == 1, level % 3 == 2));
        //                     Matrix4 model = glm::translate(front->collider.ptMin) * glm::scale(front->collider.ptMax - front->collider.ptMin);
        //                     debugShaderProgram->Draw(model, &debugCube);
        //                 }
        //             }
        //         }
        //     }
        //     else if (SphereCollider* collider = dynamic_cast<SphereCollider*>(cptr)) {
        //         Matrix4 model = collider->GetWorldTransform() * glm::scale(Vector3(collider->radius));
        //         debugShaderProgram->SetColor(Vector3(0, 0, 1));
        //         debugShaderProgram->Draw(model, &debugCircle);
        //     }
        //     else if (CapsuleCollider* collider = dynamic_cast<CapsuleCollider*>(cptr)) {
        //         Matrix4 model = collider->GetWorldTransform() * glm::scale(Vector3(collider->radius));
        //         debugShaderProgram->SetColor(Vector3(0, 0, 1));
        //         debugShaderProgram->Draw(model, &debugCircle);

        //         model = collider->GetWorldTransformForLocalPoint(collider->position2) * glm::scale(Vector3(collider->radius));
        //         debugShaderProgram->SetColor(Vector3(0, 0, 1));
        //         debugShaderProgram->Draw(model, &debugCircle);

        //         Vector3 pt1 = Vector3(collider->GetWorldTransform() * Vector4(0, 0, 0, 1));
        //         Vector3 pt2 = Vector3(collider->GetWorldTransformForLocalPoint(collider->position2) * Vector4(0, 0, 0, 1));


        //         model = glm::translate(pt1) * glm::transpose(glm::toMat4(DirectionToQuaternion(pt2 - pt1))) * glm::scale(Vector3(collider->radius,
        //             collider->radius, glm::distance(collider->position, collider->position2)));

        //         debugShaderProgram->SetColor(Vector3(0, 0, 1));
        //         debugShaderProgram->Draw(model, &debugCylinder);
        //     }
        // }
    }
}

void ClientGL::DrawObject(DrawParams& params, int& lastProgram) {
    // int program = params.mesh->material->GetShaderProgram();
    // if (program != lastProgram) {
    //     lastProgram = program;
    //     shaderPrograms[program]->Use();
    // }
    // DeferredShadingGeometryShaderProgram* defaultProgram = dynamic_cast<
    //     DeferredShadingGeometryShaderProgram*>(
    //         shaderPrograms[program]);
    // if (params.hasOutline && defaultProgram) {
    //     // Render Front only
    //     SetGLCullFace(GL_FRONT);
    //     defaultProgram->SetDrawOutline(0.02, Vector3(1));
    //     shaderPrograms[program]->Draw(params.transform, params.mesh);
    // }
    // if (defaultProgram) {
    //     defaultProgram->SetDrawOutline(0, Vector3());
    // }
    // SetGLCullFace(GL_BACK);
    // shaderPrograms[program]->Draw(params.transform, params.mesh);
}

template<typename T>
T CalculateCenter(T* arr, size_t size) {
    T res;
    for (size_t i = 0; i < size; i++) {
        res += arr[i];
    }
    return res / size;
}

template<typename A, typename B>
void MultiplyAll(A* dest, const A* src, size_t count, const B& multiplyBy) {
    for (size_t i = 0; i < count; i++) {
        dest[i] = multiplyBy * src[i];
    }
}

void ClientGL::DrawShadowObjects(DrawLayer& layer) {
    // for (auto& pair : layer.opaque) {
    //     for (auto& param : pair.second) {
    //         if (!param.castShadows) continue;
    //         shadowMapShaderProgram->Draw( param.transform, param.mesh);
    //     }
    // }
}

void ClientGL::SetupDrawingLayers() {
    Time now = Timer::Now();
    for (auto& gameObjectPair : game.GetGameObjects()) {
        gameObjectPair.second->PreDraw(now);
        gameObjectPair.second->RemoveTag(Tag::DRAW_FOREGROUND);
    }

    if (PlayerObject* localPlayer = game.GetLocalPlayer()) {
        cameraPosition = localPlayer->GetClientPosition();
        cameraRotation = localPlayer->GetClientLookDirection();

        for (auto& child : localPlayer->children) {
            child->SetTag(Tag::DRAW_FOREGROUND);
        }
    }

    foregroundLayer.Clear();
    backgroundLayer.Clear();
    behindPlayerLayer.Clear();

    for (auto& gameObjectPair : game.GetGameObjects()) {
        Object* obj = gameObjectPair.second;
        if (PlayerObject* localPlayer = game.GetLocalPlayer()) {
            // Don't draw the local player
            if (obj == localPlayer) continue;
        }
        Matrix4 transform = obj->GetTransform();
        bool isForeground = obj->IsTagged(Tag::DRAW_FOREGROUND);
        DrawLayer& layerToDraw = !obj->visibleInFrustrum ? behindPlayerLayer : (isForeground ? foregroundLayer : backgroundLayer);
        // DrawLayer& layerToDraw = backgroundLayer;

        if (Model* model = obj->GetModel()) {
            for (auto& mesh : model->meshes) {
                Vector3 centerPt = Vector3(obj->GetTransform() * Vector4(mesh->center, 1));
                if (mesh->material->IsTransparent()) {
                    DrawParams& params = layerToDraw.PushTransparent(
                        glm::distance2(centerPt, cameraPosition));
                    params.id = obj->GetId();
                    params.mesh = mesh;
                    params.transform = transform;
                    params.castShadows = !obj->IsTagged(Tag::NO_CAST_SHADOWS);
                    params.hasOutline = obj->IsTagged(Tag::DRAW_OUTLINE);
                }
                else {
                    // auto& list = layerToDraw.opaque[glm::distance2(centerPt, cameraPosition)];
                    DrawParams& params = layerToDraw.PushOpaque(mesh->material);
                    params.id = obj->GetId();
                    params.mesh = mesh;
                    params.transform = transform;
                    params.castShadows = !obj->IsTagged(Tag::NO_CAST_SHADOWS);
                    params.hasOutline = obj->IsTagged(Tag::DRAW_OUTLINE);
                }
            }
        }
    }
}

void ClientGL::RenderMinimap() {
    minimapGBuffer.Bind();
    glClearColor(0, 0, 0, 1);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    Vector3 minimapCamPosition = Vector3(cameraPosition.x, 100, cameraPosition.z);
    // Matrix4 minimapView = glm::lookAt(minimapCamPosition,
    //     cameraPosition, cameraRotation);

    Matrix4 minimapView = glm::lookAt(minimapCamPosition,
        minimapCamPosition - Vector::Up, Vector3(cameraRotation.x, 0, cameraRotation.z));

    Matrix4 minimapProj = glm::ortho(-50.0, 50.0, -50.0, 50.0, 1.0, 500.0);

    // for (auto& program : shaderPrograms) {
    //     program->Use();
    //     program->PreDraw(game, minimapCamPosition, minimapView, minimapProj);
    //     program->SetRenderShadows(false);
    // }

    debugShaderProgram->Use();
    debugShaderProgram->PreDraw(minimapCamPosition, minimapView, minimapProj);
    DrawLayerOptions options;
    DrawObjects(options);

    // if (PlayerObject* localPlayer = game.GetLocalPlayer()) {
    //     shaderPrograms[0]->Use();
    //     glDisable(GL_DEPTH_TEST);

    //     shaderPrograms[0]->Draw(glm::translate(Vector3(cameraPosition.x, 95, cameraPosition.z)) *
    //             glm::transpose(glm::toMat4(localPlayer->clientRotation)) * glm::scale(Vector3(2, 2, 2)), &minimapMarker);
    // }

    // Draw Minimap onto base
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    // // glDisable(GL_DEPTH_TEST);

    GLuint minimapTexture = minimapGBuffer.g_diffuse;
    worldRenderBuffer.Bind();
    minimapShaderProgram->Use();
    Matrix4 minimapQuadTransform = glm::translate(
        Vector3((1 - (0.75 * (windowHeight / (float) windowWidth))), 0.25, 0)) *
        glm::scale(Vector3(0.75f * (windowHeight / (float)windowWidth), 0.75f, 1));
    minimapShaderProgram->DrawQuad(minimapTexture, minimapQuadTransform);

    glDisable(GL_BLEND);
}

void ClientGL::RenderWorld() {
    // World Render
    // for (auto& program : shaderPrograms) {
    //     program->Use();
    //     program->PreDraw(game, cameraPosition, viewMat, projMat);
    //     program->SetRenderShadows(!GlobalSettings.Client_NoShadows);
    // }
    // debugShaderProgram->Use();
    // debugShaderProgram->PreDraw(game, cameraPosition, viewMat, projMat);

    // worldGBuffer.Bind();
    // glClearColor(0, 0, 0, 1);
    // glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    // DrawLayerOptions options;
    // options.drawTransparent = false;
    // options.drawBehind = false;
    // DrawObjects(options);
}


void ClientGL::RenderTransparentObjects() {
    // World Render
    // for (auto& program : shaderPrograms) {
    //     program->Use();
    //     program->PreDraw(game, cameraPosition, viewMat, projMat);
    //     program->SetRenderShadows(!GlobalSettings.Client_NoShadows);
    // }
    // debugShaderProgram->Use();
    // debugShaderProgram->PreDraw(game, cameraPosition, viewMat, projMat);

    // // Clear just the color, keep depth, draw transparent objects
    // worldGBuffer.Bind();
    // glClearColor(0, 0, 0, 0);
    // glClear(GL_COLOR_BUFFER_BIT);

    // DrawLayerOptions options;
    // options.drawOpaque = false;
    // options.drawBehind = false;
    // DrawObjects(options);

    // worldRenderBuffer.Bind();
    // glEnable(GL_BLEND);
    // glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    // GLuint diffuseTexture = worldGBuffer.g_diffuse;

    // quadDrawShaderProgram->Use();
    // quadDrawShaderProgram->DrawQuad(diffuseTexture, quadDrawShaderProgram->standardRemapMatrix);
}

void ClientGL::RenderLighting() {
    // Render lighting pass from gbuffers into world render buffer
    // worldRenderBuffer.Bind();
    // // glClearColor(135.0 / 255.0, 206.0 / 255.0, 235.0 / 255.0, 1);
    // glClearColor(0, 0, 0, 1);
    // glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    // // Copy Depth from GBuffer Over
    // glBindFramebuffer(GL_READ_FRAMEBUFFER, worldGBuffer.fbo);
    // glBlitFramebuffer(0, 0, windowWidth, windowHeight,
    //     0, 0, windowWidth, windowHeight,
    //     GL_DEPTH_BUFFER_BIT, GL_NEAREST);
    // worldRenderBuffer.Bind();

    // deferredLightingShaderProgram->Use();
    // deferredLightingShaderProgram->PreDraw(game, cameraPosition, viewMat, projMat);

    // glActiveTexture(GL_TEXTURE0);
    // glBindTexture(GL_TEXTURE_2D, worldGBuffer.g_position);
    // glActiveTexture(GL_TEXTURE1);
    // glBindTexture(GL_TEXTURE_2D, worldGBuffer.g_normal);
    // glActiveTexture(GL_TEXTURE2);
    // glBindTexture(GL_TEXTURE_2D, worldGBuffer.g_diffuse);
    // glActiveTexture(GL_TEXTURE3);
    // glBindTexture(GL_TEXTURE_2D, worldGBuffer.g_specular);

    // deferredLightingShaderProgram->SetRenderShadows(!GlobalSettings.Client_NoShadows);

    // // glDisable(GL_CULL_FACE);
    // glEnable(GL_CULL_FACE);
    // // glDisable(GL_BLEND);

    // glEnable(GL_BLEND);
    // glBlendFunc(GL_ONE, GL_ONE);

    // // deferredLightingShaderProgram->RenderLighting(game);

    // glDisable(GL_BLEND);

    // glActiveTexture(GL_TEXTURE0);
    // glBindTexture(GL_TEXTURE_2D, 0);
    // glActiveTexture(GL_TEXTURE1);
    // glBindTexture(GL_TEXTURE_2D, 0);
    // glActiveTexture(GL_TEXTURE2);
    // glBindTexture(GL_TEXTURE_2D, 0);
    // glActiveTexture(GL_TEXTURE3);
    // glBindTexture(GL_TEXTURE_2D, 0);
}

void ClientGL::Draw(int width, int height) {
    if (!renderer.IsInitialized()) return;
    // LOG_DEBUG("Draw " << width << " " << height);
    windowWidth = width;
    windowHeight = height;

    worldRenderBuffer.SetSize(width, height);

    SetupDrawingLayers();

    viewMat = glm::lookAt(cameraPosition,
        cameraPosition + cameraRotation, Vector::Up);

    float FOV = glm::radians(55.0f);
    float viewNear = 0.2f;
    float viewFar = 300.f;
    float aspectRatio = (float) width / (float) height;
    projMat = glm::perspective(FOV, aspectRatio, viewNear, viewFar);

    RenderFrameParameters params;
    params.width = width;
    params.height = height;
    params.viewNear = 0.2f;
    params.viewFar = 300.f;
    params.viewPos = cameraPosition;
    params.viewDir = cameraRotation;
    params.ambientFactor = 0.5f;
    params.enableLighting = true;
    params.enableShadows = true;
    params.enableToneMapping = true;
    // params.enableBloom = true;
    // params.bloomThreshold = 1.7f;
    params.enableAntialiasing = true;
    params.lights = game.lightNodes;
    params.skydomeTexture = skydomeTexture;

    glBindFramebuffer(GL_FRAMEBUFFER, 0);
    glClearColor(135.0 / 255.0, 206.0 / 255.0, 235.0 / 255.0, 1);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    renderer.NewFrame(&params);
    renderer.Draw(backgroundLayer);

    RenderMinimap();

    // Finally render everything to the main buffer
    GLuint texture = renderer.outputBuffer.BlitTexture();
    glBindFramebuffer(GL_FRAMEBUFFER, 0);
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    quadDrawShaderProgram->Use();
    quadDrawShaderProgram->DrawQuad(texture, quadDrawShaderProgram->standardRemapMatrix);
    glDisable(GL_BLEND);
    // Handle any UI drawing
    glBindFramebuffer(GL_FRAMEBUFFER, 0);
    RenderUI(width, height);

    if (GlobalSettings.Client_DrawShadowMaps) {
        Matrix4 transform = glm::translate(Vector3(-0.5f, -0.5f, 0.0f));
        for (auto& light : game.lightNodes) {
            quadDrawShaderProgram->Use();
            quadDrawShaderProgram->DrawQuad(light->shadowColorMap, transform);
        }
    }
    if (GlobalSettings.Client_DrawGBuffer) {
        // Matrix4 transform = glm::translate(Vector3(-0.5f, -0.5f, 0.0f));
        // // worldRenderBuffer.BlitTexture();

        // quadDrawShaderProgram->Use();
        // quadDrawShaderProgram->SetIsDepth(true);
        // quadDrawShaderProgram->DrawQuad(worldGBuffer.g_depth, transform);
        // quadDrawShaderProgram->SetIsDepth(false);
        // quadDrawShaderProgram->DrawQuad(worldGBuffer.internalDepth, transform);
    }
}

Vector2 ClientGL::WorldToScreenCoordinates(Vector3 worldCoord) {
    Vector4 clipCoords = projMat * viewMat * Vector4(worldCoord, 1.0);
    Vector3 NDC = Vector3(clipCoords) / clipCoords.w;
    // LOG_DEBUG(NDC);
    return Vector2((NDC.x + 1) * (windowWidth / 2), windowHeight - (NDC.y + 1) * (windowHeight / 2));
}

void ClientGL::RenderUI(int width, int height) {
    // ImGuiIO& io = ImGui::GetIO();
    // io.DisplaySize = ImVec2(width, height);

    // ImGui_ImplOpenGL3_NewFrame();
    // ImGui_ImplWeb_NewFrame();
    // ImGui::NewFrame();

    // // bool demoWindowOpen;
    // // ImGui::ShowDemoWindow(&isOpen);

    // bool renderSettingWindowActive = true;
    // ImGui::Begin("Render Settings", &renderSettingWindowActive, ImGuiWindowFlags_None);
    // ImGui::Separator();

    // if (ImGui::CollapsingHeader("GBuffer")) {
    //     ImVec2 uv_min = ImVec2(0.0f, 1.0f);                 // Top-left
    //     ImVec2 uv_max = ImVec2(1.0f, 0.0f);                 // Lower-right
    //     ImVec4 tint_col = ImVec4(1.0f, 1.0f, 1.0f, 1.0f);   // No tint
    //     ImVec4 border_col = ImVec4(1.0f, 1.0f, 1.0f, 0.5f); // 50% opaque white
    //     ImVec2 size = ImVec2(worldGBuffer.width / 4.0, worldGBuffer.height / 4.0);
    //     if (ImGui::TreeNode("Diffuse")) {
    //         ImGui::Image((ImTextureID)worldGBuffer.g_diffuse, size, uv_min, uv_max, tint_col, border_col);
    //         ImGui::TreePop();
    //     }
    //     if (ImGui::TreeNode("Position")) {
    //         ImGui::Image((ImTextureID)worldGBuffer.g_position, size, uv_min, uv_max, tint_col, border_col);
    //         ImGui::TreePop();
    //     }
    //     if (ImGui::TreeNode("Normal")) {
    //         ImGui::Image((ImTextureID)worldGBuffer.g_normal, size, uv_min, uv_max, tint_col, border_col);
    //         ImGui::TreePop();
    //     }
    //     if (ImGui::TreeNode("Specular")) {
    //         ImGui::Image((ImTextureID)worldGBuffer.g_specular, size, uv_min, uv_max, tint_col, border_col);
    //         ImGui::TreePop();
    //     }
    // }
    // if (ImGui::CollapsingHeader("Minimap GBuffer")) {
    //     ImVec2 uv_min = ImVec2(0.0f, 1.0f);                 // Top-left
    //     ImVec2 uv_max = ImVec2(1.0f, 0.0f);                 // Lower-right
    //     ImVec4 tint_col = ImVec4(1.0f, 1.0f, 1.0f, 1.0f);   // No tint
    //     ImVec4 border_col = ImVec4(1.0f, 1.0f, 1.0f, 0.5f); // 50% opaque white
    //     ImVec2 size = ImVec2(minimapGBuffer.width, minimapGBuffer.height);
    //     if (ImGui::TreeNode("Diffuse")) {
    //         ImGui::Image((ImTextureID)minimapGBuffer.g_diffuse, size, uv_min, uv_max, tint_col, border_col);
    //         ImGui::TreePop();
    //     }
    // }
    // ImGui::End();

    // ImGui::Render();
    // ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
}

void ClientGL::DrawObjects(DrawLayerOptions options) {
    int lastProgram = -1;
    glEnable(GL_CULL_FACE);
    SetGLCullFace(GL_BACK);
    // Draw Background
    if (options.drawBackground && options.drawOpaque) {
        for (auto& pair : backgroundLayer.opaque) {
            for (auto& param : pair.second) {
                if (param.id == game.localPlayerId) continue;
                DrawObject(param, lastProgram);
            }
        }
    }
    if (options.drawBackground && options.drawTransparent) {
        for (auto it = backgroundLayer.transparent.rbegin(); it != backgroundLayer.transparent.rend(); ++it) {
            // LOG_DEBUG(it->second.mesh->name);
            for (auto& param : it->second) {
                DrawObject(param, lastProgram);
            }
        }
    }
    if (options.drawBehind && options.drawOpaque) {
        for (auto& pair : behindPlayerLayer.opaque) {
            for (auto& param : pair.second) {
                DrawObject(param, lastProgram);
            }
        }
    }
    if (options.drawBehind && options.drawTransparent) {
        for (auto it = behindPlayerLayer.transparent.rbegin(); it != behindPlayerLayer.transparent.rend(); ++it) {
            // LOG_DEBUG(it->second.mesh->name);
             for (auto& param : it->second) {
                DrawObject(param, lastProgram);
            }
        }
    }
    // Draw Foreground
    // glClear(GL_DEPTH_BUFFER_BIT);

    glDisable(GL_CULL_FACE);
    if (options.drawForeground && options.drawOpaque) {
        for (auto& pair : foregroundLayer.opaque) {
            for (auto& param : pair.second) {
                DrawObject(param, lastProgram);
            }
        }
    }
    if (options.drawForeground && options.drawTransparent) {
        for (auto it = foregroundLayer.transparent.rbegin(); it != foregroundLayer.transparent.rend(); ++it) {
             for (auto& param : it->second) {
                DrawObject(param, lastProgram);
            }
        }
    }

    // Debug Drawing
    for (auto& gameObjectPair : game.GetGameObjects()) {
        DrawDebug(gameObjectPair.second);
    }
}

bool ClientGL::HandleInput(JSONDocument& input) {
    ImGui_ImplWeb_ProcessEvent(input);
    if (ImGui::GetIO().WantCaptureMouse) return true;
    if (ImGui::GetIO().WantCaptureKeyboard) return true;
    return false;
}