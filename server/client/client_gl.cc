#include "client_gl.h"
#include "logging.h"
#include "game.h"
#include "player.h"
#include "vector.h"
#include "shader.h"
#include "bvh.h"
#include "global.h"

#include <vector>
#include <fstream>
#include <map>
#include <emscripten.h>

ClientGL::ClientGL(Game& game, const char* selector) :
    canvasSelector(selector),
    game(game),
    worldRenderer(game.scene.assetManager),
    minimapRenderer(game.scene.assetManager) {
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
    quadDrawShaderProgram = new QuadShaderProgram("shaders/Quad.fs");
    minimapShaderProgram = new QuadShaderProgram("shaders/Minimap.fs");
    minimapShaderProgram->SetTextureSize(MINIMAP_WIDTH, MINIMAP_HEIGHT);

    antialiasShaderProgram = new QuadShaderProgram("shaders/Antialias.fs");

    worldRenderer.Initialize();
    minimapRenderer.Initialize();
}

void ClientGL::SetupGL() {
    minimapMarker = game.GetAssetManager().GetModel("PlayerMarkerMinimap.obj")->meshes[0];
    skydomeTexture = game.GetAssetManager().LoadTexture(RESOURCE_PATH(
        game.scene.properties.skydomeTexture
    ), Texture::Format::RGB);
}

void ClientGL::DrawDebug(Object* obj) {
    auto& debugRenderer = worldRenderer.GetDebugRenderer();
    if (GlobalSettings.Client_DrawColliders) {
        debugRenderer.DrawLine(obj->GetClientPosition(),
            obj->GetClientPosition() + obj->GetClientLookDirection(),
            Vector3(0, 0, 1));
        debugRenderer.DrawLine(obj->GetClientPosition(),
            obj->GetClientPosition() + glm::normalize(Vector::Forward * obj->GetClientRotation()),
            Vector3(0, 1, 0));
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

void ClientGL::AddMeshToLayer(Object* obj, Mesh* mesh, DrawLayer* layer, const Vector3& centerPt) {
    if (mesh->material->IsTransparent()) {
        DrawParams& params = layer->PushTransparent(
            glm::distance2(centerPt, cameraPosition));
        params.id = obj->GetId();
        params.mesh = mesh;
        params.transform = obj->GetTransform();
        params.castShadows = !obj->IsTagged(Tag::NO_CAST_SHADOWS);
        params.hasOutline = obj->IsTagged(Tag::DRAW_OUTLINE);
    }
    else {
        DrawParams& params = layer->PushOpaque(mesh->material);
        params.id = obj->GetId();
        params.mesh = mesh;
        params.transform = obj->GetTransform();
        params.castShadows = !obj->IsTagged(Tag::NO_CAST_SHADOWS);
        params.hasOutline = obj->IsTagged(Tag::DRAW_OUTLINE);
    }
}

void ClientGL::SetupDrawingLayers() {
    Time now = Timer::Now();
    game.GetRelationshipManager().PreDraw(now);
    for (auto& gameObjectPair : game.GetGameObjects()) {
        gameObjectPair.second->RemoveTag(Tag::DRAW_FOREGROUND);
    }

    if (PlayerObject* localPlayer = game.GetLocalPlayer()) {
        cameraPosition = localPlayer->GetClientPosition();
        cameraRotation = localPlayer->GetClientLookDirection();

        for (auto& child : game.GetRelationshipManager().GetChildren(game.localPlayerId)) {
            child->SetTag(Tag::DRAW_FOREGROUND);
        }
    }

    foregroundLayer.Clear();
    backgroundLayer.Clear();
    behindPlayerLayer.Clear();
    minimapLayer.Clear();

    for (auto& gameObjectPair : game.GetGameObjects()) {
        Object* obj = gameObjectPair.second;
        if (PlayerObject* localPlayer = game.GetLocalPlayer()) {
            // Don't draw the local player
            if (obj == localPlayer) continue;
        }
        Matrix4 transform = obj->GetTransform();
        bool isForeground = obj->IsTagged(Tag::DRAW_FOREGROUND);
        DrawLayer& layerToDraw = !obj->IsVisibleInFrustrum(cameraPosition, cameraRotation) ?
            behindPlayerLayer : (isForeground ? foregroundLayer : backgroundLayer);

        AABB broad = obj->GetCollider().GetBroadAABB();
        Vector3 delta = ClosestPointOnAABB(broad, cameraPosition) - cameraPosition;
        float distanceXZ = glm::sqrt(delta.x * delta.x + delta.z * delta.z);
        bool isWithinMinimapRange = distanceXZ < 30.f;
        if (Model* model = obj->GetModel()) {
            for (auto& mesh : model->meshes) {
                Vector3 centerPt = Vector3(transform * Vector4(mesh->center, 1));
                AddMeshToLayer(obj, mesh, &layerToDraw, centerPt);

                if (isWithinMinimapRange) {
                    AddMeshToLayer(obj, mesh, &minimapLayer, centerPt);
                }
            }
        }
    }
}

void ClientGL::RenderMinimap() {
    RenderFrameParameters params;
    params.width = MINIMAP_WIDTH;
    params.height = MINIMAP_HEIGHT;
    params.viewNear = 1.0f;
    params.viewFar = 500.f;
    params.viewPos = Vector3(cameraPosition.x, 100, cameraPosition.z);
    params.viewDir = -Vector::Up;
    params.viewUp = Vector3(cameraRotation.x, 0, cameraRotation.z);
    params.ambientFactor = 1.0f;
    params.enableLighting = false;
    params.enableShadows = false;
    params.enableToneMapping = true;
    params.enableAntialiasing = true;
    params.lights = game.lightNodes;
    params.skydomeTexture = skydomeTexture;
    params.projection = RenderFrameParameters::Projection::ORTHOGRAPHIC;
    params.orthoSize = 30.f;

    minimapRenderer.NewFrame(&params);
    // We need to "inject" the player into the background set
    if (PlayerObject* localPlayer = game.GetLocalPlayer()) {
        DrawParams& params = backgroundLayer.PushTransparent(-INFINITY);
        params.id = localPlayer->GetId();
        params.mesh = minimapMarker;
        params.transform = glm::translate(Vector3(cameraPosition.x, 95, cameraPosition.z)) *
            glm::transpose(glm::toMat4(localPlayer->clientRotation)) * glm::scale(Vector3(2, 2, 2));
        params.castShadows = false;
    }

    minimapRenderer.Draw({ &minimapLayer });
    minimapRenderer.EndFrame();

    // Draw Minimap onto base
    GLuint texture = minimapRenderer.GetRenderedTexture();
    defaultFrameBuffer.Bind();
    glEnable(GL_BLEND);
    glDisable(GL_DEPTH_TEST);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    minimapShaderProgram->Use();
    Matrix4 minimapQuadTransform = glm::translate(
        Vector3((1 - (0.75 * (windowHeight / (float) windowWidth))), 0.25f, 0)
    ) * glm::scale(Vector3(0.75f * (windowHeight / (float)windowWidth), 0.75f, 1));
    minimapShaderProgram->DrawQuad(texture, minimapQuadTransform);
    glEnable(GL_DEPTH_TEST);
    glDisable(GL_BLEND);
}

void ClientGL::Draw(int width, int height) {
    if (!worldRenderer.IsInitialized()) return;
    if (!minimapRenderer.IsInitialized()) return;
    // LOG_DEBUG("Draw " << width << " " << height);
    windowWidth = width;
    windowHeight = height;

    defaultFrameBuffer.SetSize(width, height);

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
    // params.bloomThreshold = 2.5f;
    params.enableAntialiasing = true;
    params.lights = game.lightNodes;
    params.skydomeTexture = skydomeTexture;

    defaultFrameBuffer.Bind();
    glClearColor(0, 0, 0, 1);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    worldRenderer.NewFrame(&params);
    for (auto& objPair : game.GetGameObjects()) {
        DrawDebug(objPair.second);
    }
    worldRenderer.Draw({ &backgroundLayer, &foregroundLayer });
    worldRenderer.EndFrame();

    // Finally render everything to the main buffer
    GLuint texture = worldRenderer.GetRenderedTexture();
    defaultFrameBuffer.Bind();
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    quadDrawShaderProgram->Use();
    quadDrawShaderProgram->DrawQuad(texture, quadDrawShaderProgram->standardRemapMatrix);
    glDisable(GL_BLEND);

    defaultFrameBuffer.Bind();
    RenderMinimap();
}

Vector2 ClientGL::WorldToScreenCoordinates(Vector3 worldCoord) {
    Vector4 clipCoords = projMat * viewMat * Vector4(worldCoord, 1.0);
    Vector3 NDC = Vector3(clipCoords) / clipCoords.w;
    // LOG_DEBUG(NDC);
    return Vector2((NDC.x + 1) * (windowWidth / 2), windowHeight - (NDC.y + 1) * (windowHeight / 2));
}
