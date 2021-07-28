#include "deferred_renderer.h"

DeferredRenderer::DeferredRenderer() : quadShader("shaders/Quad.fs") {

}

void DeferredRenderer::NewFrame(const RenderFrameParameters& params) {
    geometryShader.Use();
    geometryShader.PreDraw(params.viewPos, params.view, params.proj);
    lightingShader.Use();
    lightingShader.PreDraw(params.viewPos, params.view, params.proj);

    gBuffer.SetSize(params.width, params.height);
    outputBuffer.SetSize(params.width, params.height);

    lightingShader.SetViewportSize(params.width, params.height);
}

void DeferredRenderer::DrawObject(DrawParams& params) {
    if (params.hasOutline) {
        // Render Front only
        glCullFace(GL_FRONT);
        geometryShader.SetDrawOutline(0.02, Vector3(1));
        geometryShader.Draw(params.transform, params.mesh);
    }
    else {
        geometryShader.SetDrawOutline(0, Vector3());
    }
    glCullFace(GL_BACK);
    geometryShader.Draw(params.transform, params.mesh);
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

    lightingShader.Use();

    glActiveTexture(GL_TEXTURE0);
    glBindTexture(GL_TEXTURE_2D, gBuffer.g_position);
    glActiveTexture(GL_TEXTURE1);
    glBindTexture(GL_TEXTURE_2D, gBuffer.g_normal);
    glActiveTexture(GL_TEXTURE2);
    glBindTexture(GL_TEXTURE_2D, gBuffer.g_diffuse);
    glActiveTexture(GL_TEXTURE3);
    glBindTexture(GL_TEXTURE_2D, gBuffer.g_specular);

    // glDisable(GL_CULL_FACE);
    glEnable(GL_CULL_FACE);
    // glDisable(GL_BLEND);

    glEnable(GL_BLEND);
    glBlendFunc(GL_ONE, GL_ONE);

    // lightingShader.RenderLighting(game);
    quadShader.Use();
    quadShader.DrawQuad(gBuffer.g_diffuse, quadShader.standardRemapMatrix);

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
        DrawObject(it->second);
    }

    outputBuffer.Bind();
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    GLuint diffuseTexture = gBuffer.g_diffuse;

    quadShader.Use();
    quadShader.DrawQuad(diffuseTexture, quadShader.standardRemapMatrix);

    glDisable(GL_BLEND);
}
