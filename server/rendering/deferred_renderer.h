#pragma once

#include "mesh.h"
#include "shader.h"
#include "buffers.h"

// Everything must be loaded in, don't depend on game instance

struct DrawParams {
    ObjectID id;
    Mesh* mesh = nullptr;
    Matrix4 transform;
    bool castShadows;
    bool hasOutline;
};

struct DrawLayer {
    // std::map<float, std::vector<DrawParams>> opaque;
    std::map<Material*, std::vector<DrawParams>> opaque;
    std::map<float, DrawParams> transparent;

    void Clear() {
        opaque.clear();
        transparent.clear();
    }
};

struct RenderFrameParameters {
    Vector3 viewPos;
    Matrix4 view;
    Matrix4 proj;

    int width;
    int height;

    std::vector<Light*> lights;
};

class DeferredRenderer {
    DeferredShadingGeometryShaderProgram geometryShader;
    DeferredShadingLightingShaderProgram lightingShader;
    QuadShaderProgram quadShader;

    GBuffer gBuffer;

    RenderBuffer outputBuffer;

    void DrawObject(DrawParams& params);
public:
    DeferredRenderer();

    void NewFrame(const RenderFrameParameters& params);

    void Draw(DrawLayer& layer);

    QuadShaderProgram& GetQuadShader() { return quadShader; }

    GLuint GetRenderedTexture() { return outputBuffer.BlitTexture(); }
};