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
    Vector3 viewDir;

    float FOV = glm::radians(55.0f);
    float viewNear = 0.2f;
    float viewFar = 300.f;

    Matrix4 view;
    Matrix4 proj;

    int width;
    int height;

    float ambientFactor;

    bool enableLighting = false;

    bool enableShadows = false;

    bool enableBloom = false;
    float bloomThreshold = 1.0f;

    bool enableToneMapping = false;
    float exposure = 1.0f;

    bool enableAntialiasing = false;

    float fxaaLumaThreshold = 0.5f;
    float fxaaMulReduceReciprocal = 1.0f / 8.0f;
    float fxaaMinReduceReciprocal = 1.0f / 128.0f;
    float fxaaMaxSpan = 8.0f;

    std::vector<LightNode*> lights;
};

class DeferredRenderer {
public:
    AssetManager& assetManager;

    DeferredShadingGeometryShaderProgram geometryShader;
    QuadShaderProgram quadShader;

    GBuffer gBuffer;
    GBuffer transparencyGBuffer;

    RenderBuffer outputBuffer;

    RenderFrameParameters renderFrameParameters;

    // Different lighting shaders for each type of light
    DeferredShadingLightingShaderProgram pointLightShader;
    DeferredShadingLightingShaderProgram rectangleLightShader;
    DeferredShadingLightingShaderProgram directionalLightShader;

    ShadowMapShaderProgram shadowMapShader;

    BloomShader bloomShader;

    // Tone Mapping
    QuadShaderProgram toneMappingShader;
    GLint uniformToneMappingExposure;

    QuadShaderProgram fxaaShader;
    GLint uniformFXAALumaThreshold;
    GLint uniformFXAAMulReduceReciprocal;
    GLint uniformFXAAMinReduceReciprocal;
    GLint uniformFXAAMaxSpan;


    DeferredRenderer(AssetManager& assetManager);

    void DrawShadowObjects(DrawLayer& layer);
    void DrawObject(DrawParams& params);

    void NewFrame(const RenderFrameParameters& params);

    void Draw(DrawLayer& layer);
    void DrawShadowMaps(DrawLayer& layer);

    QuadShaderProgram& GetQuadShader() { return quadShader; }

    GLuint GetRenderedTexture() { return outputBuffer.BlitTexture(); }
};