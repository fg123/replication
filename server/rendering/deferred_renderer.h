#pragma once

#include "mesh.h"
#include "shader.h"
#include "buffers.h"
#include "asset-manager.h"
#include "scene.h"
#include "bloom.h"

// Everything must be loaded in, don't depend on game instance

struct DrawParams {
    ObjectID id;
    Mesh* mesh = nullptr;
    Matrix4 transform;
    bool castShadows;
    bool hasOutline = false;
    bool isWireframe = false;
    Material* overrideMaterial = nullptr;
};

struct DrawLayer {
    // std::map<float, std::vector<DrawParams>> opaque;
    std::map<Material*, std::vector<DrawParams>> opaque;
    std::map<float, std::vector<DrawParams>> transparent;

    void Clear() {
        opaque.clear();
        transparent.clear();
    }

    DrawParams& PushOpaque(Material* material) {
        auto& list = opaque[material];
        list.reserve(500);
        return list.emplace_back();
    }

    DrawParams& PushTransparent(float depth) {
        auto& list = transparent[depth];
        list.reserve(500);
        return list.emplace_back();
    }
};

struct RenderFrameParameters {
    Vector3 viewPos;
    Matrix4 view;
    Matrix4 proj;

    int width;
    int height;

    float ambientFactor;
    float bloomThreshold;
    std::vector<LightNode*> lights;
};

class DeferredRenderer {
    AssetManager& assetManager;

    DeferredShadingGeometryShaderProgram geometryShader;
    QuadShaderProgram quadShader;

    GBuffer gBuffer;

    RenderBuffer outputBuffer;

    RenderFrameParameters renderFrameParameters;

    // Different lighting shaders for each type of light
    DeferredShadingLightingShaderProgram pointLightShader;
    DeferredShadingLightingShaderProgram rectangleLightShader;

    BloomShader bloomShader;

    void DrawObject(DrawParams& params);
public:
    DeferredRenderer(AssetManager& assetManager);

    void NewFrame(const RenderFrameParameters& params);

    void Draw(DrawLayer& layer);

    QuadShaderProgram& GetQuadShader() { return quadShader; }

    GLuint GetRenderedTexture() { return outputBuffer.BlitTexture(); }
};