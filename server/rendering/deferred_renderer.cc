#include "deferred_renderer.h"

DeferredRenderer::DeferredRenderer(AssetManager& assetManager) :
    assetManager(assetManager) {
}

void DeferredRenderer::Initialize() {
    geometryShader = new DeferredShadingGeometryShaderProgram;
    quadShader = new QuadShaderProgram("shaders/Quad.fs");
    pointLightShader = new DeferredShadingLightingShaderProgram("shaders/MeshLightingPointLight.fs");
    rectangleLightShader = new DeferredShadingLightingShaderProgram("shaders/MeshLightingRectangleLight.fs");
    directionalLightShader = new DeferredShadingLightingShaderProgram("shaders/MeshLightingDirectionalLight.fs");

    shadowMapShader = new ShadowMapShaderProgram;
    bloomShader = new BloomShader;
    toneMappingShader = new QuadShaderProgram("shaders/ToneMapping.fs");
    fxaaShader = new QuadShaderProgram("shaders/FXAA.fs");
    skydomeShader = new QuadShaderProgram("shaders/Skydome.fs");

    toneMappingShader->Use();
    uniformToneMappingExposure = toneMappingShader->GetUniformLocation("u_exposure");

    fxaaShader->Use();
    uniformFXAALumaThreshold = fxaaShader->GetUniformLocation("u_lumaThreshold");
    uniformFXAAMulReduceReciprocal = fxaaShader->GetUniformLocation("u_mulReduce");
    uniformFXAAMinReduceReciprocal = fxaaShader->GetUniformLocation("u_minReduce");
    uniformFXAAMaxSpan = fxaaShader->GetUniformLocation("u_maxSpan");

    skydomeShader->Use();
    uniformSkydomeDirection = skydomeShader->GetUniformLocation("u_cameraDirection");
    uniformSkydomeFOV = skydomeShader->GetUniformLocation("u_fov");
    uniformSkydomeWidth = skydomeShader->GetUniformLocation("u_width");
    uniformSkydomeHeight = skydomeShader->GetUniformLocation("u_height");

    isInitialized = true;
}

void DeferredRenderer::NewFrame(RenderFrameParameters* params) {
    Matrix4 view = glm::lookAt(params->viewPos,
        params->viewPos + params->viewDir, Vector::Up);
    float aspectRatio = (float) params->width / (float) params->height;
    Matrix4 proj = glm::perspective(params->FOV, aspectRatio, params->viewNear, params->viewFar);
    geometryShader->Use();
    geometryShader->PreDraw(params->viewPos, view, proj);

    pointLightShader->Use();
    pointLightShader->PreDraw(params->viewPos, view, proj);
    pointLightShader->SetViewportSize(params->width, params->height);

    rectangleLightShader->Use();
    rectangleLightShader->PreDraw(params->viewPos, view, proj);
    rectangleLightShader->SetViewportSize(params->width, params->height);

    directionalLightShader->Use();
    directionalLightShader->PreDraw(params->viewPos, view, proj);
    directionalLightShader->SetViewportSize(params->width, params->height);

    gBuffer.SetSize(params->width, params->height);
    transparencyGBuffer.SetSize(params->width, params->height);
    outputBuffer.SetSize(params->width, params->height);

    renderFrameParameters = params;
    renderFrameParameters->view = view;
    renderFrameParameters->proj = proj;
}

void DeferredRenderer::DrawObject(DrawParams& params) {
    if (params.isWireframe) {
        #ifdef BUILD_EDITOR
            glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
        #endif
        glDisable(GL_CULL_FACE);
    }
    else {
        glEnable(GL_CULL_FACE);
        #ifdef BUILD_EDITOR
            glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
        #endif
        if (params.hasOutline) {
            // Render Front only
            glCullFace(GL_FRONT);
            geometryShader->SetDrawOutline(0.05, Vector3(1));
            geometryShader->Draw(params.transform, params.mesh);
        }
        glCullFace(GL_BACK);
    }
    geometryShader->SetOverrideMaterial(params.overrideMaterial);
    geometryShader->SetDrawOutline(0, Vector3());
    geometryShader->Draw(params.transform, params.mesh);
    #ifdef BUILD_EDITOR
        glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
    #endif
    glEnable(GL_CULL_FACE);
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

void DeferredRenderer::DrawShadowObjects(DrawLayer& layer) {
    for (auto& pair : layer.opaque) {
        for (auto& param : pair.second) {
            if (!param.castShadows) continue;
            shadowMapShader->Draw(param.transform, param.mesh);
        }
    }
}

void DeferredRenderer::DrawShadowMaps(DrawLayer& layer) {
    float aspectRatio = (float) renderFrameParameters->width / (float) renderFrameParameters->height;
    Matrix4 nearProj = glm::perspective(renderFrameParameters->FOV, aspectRatio,
        renderFrameParameters->viewNear, 10.f);
    Matrix4 midProj = glm::perspective(renderFrameParameters->FOV, aspectRatio,
        renderFrameParameters->viewNear, 50.f);
    Matrix4 farProj = glm::perspective(renderFrameParameters->FOV, aspectRatio,
        renderFrameParameters->viewNear, renderFrameParameters->viewFar);

    Matrix4 inverseNear = glm::inverse(nearProj * renderFrameParameters->view);
    Matrix4 inverseMid = glm::inverse(midProj * renderFrameParameters->view);
    Matrix4 inverseFar = glm::inverse(farProj * renderFrameParameters->view);

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

    for (auto& transformed : renderFrameParameters->lights) {
        LightNode* light = dynamic_cast<LightNode*>(transformed->node);
        if (light->shadowMapSize == 0) continue;
        transformed->InitializeLight();
        Matrix4 lightView = glm::lookAt(light->position, light->position - light->GetDirection(),
            Vector::Up);

        shadowMapShader->Use();

        Matrix4 biasMatrix(
            0.5, 0.0, 0.0, 0.0,
            0.0, 0.5, 0.0, 0.0,
            0.0, 0.0, 0.5, 0.0,
            0.5, 0.5, 0.5, 1.0
        );

        Vector3 boxToLight[8];

        // Draw to our temporary buffer
        glBindFramebuffer(GL_FRAMEBUFFER, transformed->shadowFrameBuffer);
        // glBindFramebuffer(GL_FRAMEBUFFER, 0);
        glClearColor(1, 1, 1, 1);
        glClear(GL_DEPTH_BUFFER_BIT | GL_COLOR_BUFFER_BIT);
        glEnable(GL_CULL_FACE);
        glCullFace(GL_FRONT);
        glEnable(GL_DEPTH_TEST);

        // shaderPrograms[0]->Use();
        // shaderPrograms[0]->PreDraw(game, light.position, lightView, lightProjection);

        // Draw Near Field
        glViewport(0, 0, light->shadowMapSize, light->shadowMapSize);
        for (size_t i = 0; i < 8; i++) {
            boxToLight[i] = Vector3(lightView * viewFrustrumPointsNear[i]);
        }

        AABB boxExtents { boxToLight, 8 };
        Matrix4 lightProjection = glm::ortho(
            glm::floor(boxExtents.ptMin.x),
            glm::ceil(boxExtents.ptMax.x),
            glm::floor(boxExtents.ptMin.y),
            glm::ceil(boxExtents.ptMax.y), 1.0f, 400.f);
        transformed->depthBiasMVPNear = biasMatrix * lightProjection * lightView;
        shadowMapShader->PreDraw(Vector3(), lightView, lightProjection);

        DrawShadowObjects(layer);

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

        transformed->depthBiasMVPMid = biasMatrix * lightProjection * lightView;
        shadowMapShader->PreDraw(Vector3(), lightView, lightProjection);

        glViewport(light->shadowMapSize, 0, light->shadowMapSize, light->shadowMapSize);

        DrawShadowObjects(layer);

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

        transformed->depthBiasMVPFar = biasMatrix * lightProjection * lightView;
        shadowMapShader->PreDraw(Vector3(), lightView, lightProjection);

        glViewport(0, light->shadowMapSize, light->shadowMapSize, light->shadowMapSize);

        DrawShadowObjects(layer);
    }
}

void DeferredRenderer::Draw(DrawLayer& layer) {
    for (auto& transformed : renderFrameParameters->lights) {
        LightNode* light = dynamic_cast<LightNode*>(transformed->node);
        light->defaultMaterial.Kd = light->color;
        if (light->shape == LightShape::Rectangle ||
            light->shape == LightShape::Directional) {
            // Setup a mesh, queue it up as a transparent so it draws after
            //   lighting is calculated
            DrawParams& params = layer.PushTransparent(
                glm::distance2(light->position, renderFrameParameters->viewPos));
            params.mesh = assetManager.GetModel("Quad.obj")->meshes[0];
            params.transform = transformed->transform;
            params.castShadows = false;
            params.isWireframe = false;
            params.overrideMaterial = &light->defaultMaterial;
        }
    }

    // Create Shadow Maps
    DrawShadowMaps(layer);

    gBuffer.Bind();
    glViewport(0, 0, gBuffer.width, gBuffer.height);
    glClearColor(0, 0, 0, 0);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glEnable(GL_DEPTH_TEST);
    glEnable(GL_CULL_FACE);
    glCullFace(GL_BACK);

    // Opaque Geometry Pass
    geometryShader->Use();
    for (auto& pair : layer.opaque) {
        for (auto& param : pair.second) {
            LOG_DEBUG("Drawing " << param.mesh->name);
            DrawObject(param);
        }
    }

    // Lighting Pass
    outputBuffer.Bind();
    glClearColor(0, 0, 0, 0);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    // Copy Depth from GBuffer Over
    glBindFramebuffer(GL_READ_FRAMEBUFFER, gBuffer.fbo);
    glBlitFramebuffer(0, 0, gBuffer.width, gBuffer.height,
        0, 0, outputBuffer.width, outputBuffer.height,
        GL_DEPTH_BUFFER_BIT, GL_NEAREST);
    outputBuffer.Bind();

    glEnable(GL_CULL_FACE);
    glEnable(GL_BLEND);

    // Render ambient without writing anything to depth
    glDisable(GL_DEPTH_TEST);
    glDepthMask(GL_FALSE);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    // Draw Skydome
    if (renderFrameParameters->skydomeTexture) {
        skydomeShader->Use();
        glUniform3fv(uniformSkydomeDirection, 1, glm::value_ptr(renderFrameParameters->viewDir));
        glUniform1f(uniformSkydomeFOV, renderFrameParameters->FOV);
        glUniform1f(uniformSkydomeWidth, renderFrameParameters->width);
        glUniform1f(uniformSkydomeHeight, renderFrameParameters->height);
        skydomeShader->DrawQuad(renderFrameParameters->skydomeTexture->textureBuffer, skydomeShader->standardRemapMatrix);
    }

    quadShader->Use();
    quadShader->DrawQuad(gBuffer.g_diffuse, quadShader->standardRemapMatrix,
        renderFrameParameters->enableLighting ? renderFrameParameters->ambientFactor : 1.0);
    // quadShader.DrawQuad(gBuffer.g_position, quadShader.standardRemapMatrix, 1 / 200.f);

    glBlendFunc(GL_ONE, GL_ONE);
    if (renderFrameParameters->enableLighting) {
        pointLightShader->Use();
        pointLightShader->SetRenderShadows(renderFrameParameters->enableShadows);
        rectangleLightShader->Use();
        rectangleLightShader->SetRenderShadows(renderFrameParameters->enableShadows);
        directionalLightShader->Use();
        directionalLightShader->SetRenderShadows(renderFrameParameters->enableShadows);

        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, gBuffer.g_position);
        glActiveTexture(GL_TEXTURE1);
        glBindTexture(GL_TEXTURE_2D, gBuffer.g_normal);
        glActiveTexture(GL_TEXTURE2);
        glBindTexture(GL_TEXTURE_2D, gBuffer.g_diffuse);
        glActiveTexture(GL_TEXTURE3);
        glBindTexture(GL_TEXTURE_2D, gBuffer.g_specular);

        for (auto& transformed : renderFrameParameters->lights) {
            LightNode* light = dynamic_cast<LightNode*>(transformed->node);
            if (light->shape == LightShape::Point) {
                pointLightShader->Use();
                pointLightShader->RenderLighting(*transformed, assetManager);
            }
            else if (light->shape == LightShape::Rectangle) {
                rectangleLightShader->Use();
                rectangleLightShader->RenderLighting(*transformed, assetManager);
            }
            else if (light->shape == LightShape::Directional) {
                directionalLightShader->Use();
                directionalLightShader->RenderLighting(*transformed, assetManager);
            }
        }

        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, 0);
        glActiveTexture(GL_TEXTURE1);
        glBindTexture(GL_TEXTURE_2D, 0);
        glActiveTexture(GL_TEXTURE2);
        glBindTexture(GL_TEXTURE_2D, 0);
        glActiveTexture(GL_TEXTURE3);
        glBindTexture(GL_TEXTURE_2D, 0);
    }

    glDepthMask(GL_TRUE);
    glEnable(GL_DEPTH_TEST);

    // Draw Transparent Objects, Clear Color, keep depth
    {
        transparencyGBuffer.Bind();
        glClearColor(0, 0, 0, 0);
        glClear(GL_COLOR_BUFFER_BIT);
        glBindFramebuffer(GL_READ_FRAMEBUFFER, gBuffer.fbo);
        glBlitFramebuffer(0, 0, gBuffer.width, gBuffer.height,
            0, 0, transparencyGBuffer.width, transparencyGBuffer.height,
            GL_DEPTH_BUFFER_BIT, GL_NEAREST);
        transparencyGBuffer.Bind();


        geometryShader->Use();
        for (auto it = layer.transparent.rbegin(); it != layer.transparent.rend(); ++it) {
            // LOG_DEBUG(it->second.mesh->name);
            for (auto& param : it->second) {
                DrawObject(param);
            }
        }

        outputBuffer.Bind();
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

        GLuint diffuseTexture = transparencyGBuffer.g_diffuse;
        quadShader->Use();
        quadShader->DrawQuad(diffuseTexture, quadShader->standardRemapMatrix);

    }

    glBlendFunc(GL_ONE, GL_ZERO);

    GLuint texture = outputBuffer.BlitTexture();
    if (renderFrameParameters->enableBloom) {
        texture = bloomShader->BloomTexture(
            texture,
            renderFrameParameters->bloomThreshold,
            renderFrameParameters->width,
            renderFrameParameters->height);

        outputBuffer.Bind();

        // Additive Bloom on top
        glBlendFunc(GL_ONE, GL_ONE);
        glDisable(GL_DEPTH_TEST);
        quadShader->Use();
        quadShader->DrawQuad(texture, quadShader->standardRemapMatrix);
        texture = outputBuffer.BlitTexture();
    }

    if (renderFrameParameters->enableToneMapping) {
        outputBuffer.Bind();
        glBlendFunc(GL_ONE, GL_ZERO);
        glDisable(GL_DEPTH_TEST);
        toneMappingShader->Use();
        glUniform1f(uniformToneMappingExposure, renderFrameParameters->exposure);
        toneMappingShader->DrawQuad(texture, toneMappingShader->standardRemapMatrix);
        texture = outputBuffer.BlitTexture();
    }

    if (renderFrameParameters->enableAntialiasing) {
        outputBuffer.Bind();
        glBlendFunc(GL_ONE, GL_ZERO);
        glDisable(GL_DEPTH_TEST);
        fxaaShader->Use();
        fxaaShader->SetTextureSize(outputBuffer.width, outputBuffer.height);
        glUniform1f(uniformFXAALumaThreshold, renderFrameParameters->fxaaLumaThreshold);
        glUniform1f(uniformFXAAMulReduceReciprocal, renderFrameParameters->fxaaMulReduceReciprocal);
        glUniform1f(uniformFXAAMinReduceReciprocal, renderFrameParameters->fxaaMinReduceReciprocal);
        glUniform1f(uniformFXAAMaxSpan, renderFrameParameters->fxaaMaxSpan);
        fxaaShader->DrawQuad(texture, toneMappingShader->standardRemapMatrix);
    }


    // texture = outputBuffer.BlitTexture();


    glEnable(GL_DEPTH_TEST);
    glDisable(GL_BLEND);
    // renderFrameParameters = nullptr;
}
