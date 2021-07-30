#include "deferred_renderer.h"

DeferredRenderer::DeferredRenderer(AssetManager& assetManager) :
    assetManager(assetManager),
    quadShader("shaders/Quad.fs"),
    pointLightShader("shaders/MeshLightingPointLight.fs"),
    rectangleLightShader("shaders/MeshLightingRectangleLight.fs") {

}

void DeferredRenderer::NewFrame(const RenderFrameParameters& params) {
    geometryShader.Use();
    geometryShader.PreDraw(params.viewPos, params.view, params.proj);

    pointLightShader.Use();
    pointLightShader.PreDraw(params.viewPos, params.view, params.proj);
    pointLightShader.SetViewportSize(params.width, params.height);

    rectangleLightShader.Use();
    rectangleLightShader.PreDraw(params.viewPos, params.view, params.proj);
    rectangleLightShader.SetViewportSize(params.width, params.height);

    gBuffer.SetSize(params.width, params.height);
    outputBuffer.SetSize(params.width, params.height);

    renderFrameParameters = params;
}

void DeferredRenderer::DrawObject(DrawParams& params) {
    if (params.isWireframe) {
        glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
        glDisable(GL_CULL_FACE);
    }
    else {
        glEnable(GL_CULL_FACE);
        glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
        if (params.hasOutline) {
            // Render Front only
            glCullFace(GL_FRONT);
            geometryShader.SetDrawOutline(0.05, Vector3(1));
            geometryShader.Draw(params.transform, params.mesh);
        }
        glCullFace(GL_BACK);
    }
    geometryShader.SetOverrideMaterial(params.overrideMaterial);
    geometryShader.SetDrawOutline(0, Vector3());
    geometryShader.Draw(params.transform, params.mesh);
    glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
}

void DeferredRenderer::Draw(DrawLayer& layer) {
    gBuffer.Bind();
    glClearColor(0, 0, 0, 1);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glEnable(GL_DEPTH_TEST);
    glEnable(GL_CULL_FACE);
    glCullFace(GL_BACK);

    // Opaque Geometry Pass
    geometryShader.Use();
    for (auto& pair : layer.opaque) {
        for (auto& param : pair.second) {
            DrawObject(param);
        }
    }

    // Lighting Pass
    outputBuffer.Bind();
    glClearColor(0, 0, 0, 1);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    // Copy Depth from GBuffer Over
    glBindFramebuffer(GL_READ_FRAMEBUFFER, gBuffer.fbo);
    glBlitFramebuffer(0, 0, gBuffer.width, gBuffer.height,
        0, 0, outputBuffer.width, outputBuffer.height,
        GL_DEPTH_BUFFER_BIT, GL_NEAREST);
    outputBuffer.Bind();

    glEnable(GL_CULL_FACE);
    glEnable(GL_BLEND);
    glBlendFunc(GL_ONE, GL_ONE);

    // Render ambient without writing anything to depth
    glDisable(GL_DEPTH_TEST);
    glDepthMask(GL_FALSE);
    quadShader.Use();
    quadShader.DrawQuad(gBuffer.g_diffuse, quadShader.standardRemapMatrix, renderFrameParameters.ambientFactor);
    // quadShader.DrawQuad(gBuffer.g_position, quadShader.standardRemapMatrix, 1 / 200.f);

    glActiveTexture(GL_TEXTURE0);
    glBindTexture(GL_TEXTURE_2D, gBuffer.g_position);
    glActiveTexture(GL_TEXTURE1);
    glBindTexture(GL_TEXTURE_2D, gBuffer.g_normal);
    glActiveTexture(GL_TEXTURE2);
    glBindTexture(GL_TEXTURE_2D, gBuffer.g_diffuse);
    glActiveTexture(GL_TEXTURE3);
    glBindTexture(GL_TEXTURE_2D, gBuffer.g_specular);

    for (auto& light : renderFrameParameters.lights) {
        if (light->shape == LightShape::Point) {
            pointLightShader.Use();
            pointLightShader.RenderLighting(*light, assetManager);
        }
        else if (light->shape == LightShape::Rectangle) {
            rectangleLightShader.Use();
            rectangleLightShader.RenderLighting(*light, assetManager);
        }
    }
    glDepthMask(GL_TRUE);
    glEnable(GL_DEPTH_TEST);

    glActiveTexture(GL_TEXTURE0);
    glBindTexture(GL_TEXTURE_2D, 0);
    glActiveTexture(GL_TEXTURE1);
    glBindTexture(GL_TEXTURE_2D, 0);
    glActiveTexture(GL_TEXTURE2);
    glBindTexture(GL_TEXTURE_2D, 0);
    glActiveTexture(GL_TEXTURE3);
    glBindTexture(GL_TEXTURE_2D, 0);

    // Draw Transparent Objects, Clear Color, keep depth
    gBuffer.Bind();
    glClearColor(0, 0, 0, 0);
    glClear(GL_COLOR_BUFFER_BIT);

    geometryShader.Use();
    for (auto it = layer.transparent.rbegin(); it != layer.transparent.rend(); ++it) {
        // LOG_DEBUG(it->second.mesh->name);
        for (auto& param : it->second) {
            DrawObject(param);
        }
    }

    outputBuffer.Bind();
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    GLuint diffuseTexture = gBuffer.g_diffuse;

    quadShader.Use();
    quadShader.DrawQuad(diffuseTexture, quadShader.standardRemapMatrix);

    glDisable(GL_BLEND);
}
