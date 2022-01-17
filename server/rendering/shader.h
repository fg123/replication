#pragma once

#include <string>
#include <vector>

#include "opengl.h"
#include "vector.h"
#include "object.h"
#include "scene.h"

class ClientGL;
class Mesh;
class Game;

class ShaderProgram {
    GLint program;
    std::vector<GLuint> shaders;

public:
    virtual ~ShaderProgram() {}

    std::string LoadURL(const std::string& url);
    std::string LoadURL(const std::string& url, std::unordered_map<std::string, std::string>& substitutions);
    std::string PreprocessShader(const std::string& raw_shader, std::unordered_map<std::string, std::string>& substitutions);
    void AddShader(const std::string& data, GLenum shaderType);
    void LinkProgram();
    void Use();

    GLint GetUniformLocation(const std::string& uniName);
    GLint GetAttributeLocation(const std::string& attrName);

    virtual void PreDraw(const Vector3& viewPos,
                         const Matrix4& view,
                         const Matrix4& proj) = 0;
    virtual void Draw(const Matrix4& model, Mesh* mesh) = 0;
    virtual void SetRenderShadows(bool render) {}
};

class DeferredShadingGeometryShaderProgram : public ShaderProgram {
    // Uniforms
    GLint uniformProj;
    GLint uniformView;
    GLint uniformModel;
    GLint uniformViewerPosition;
    GLint uniformRenderShadows;

    GLint uniformOutlineSize;
    GLint uniformOutlineColor;

    std::vector<GLint> uniformMaterial;

    Material* overrideMaterial = nullptr;

    Material* lastMaterial = nullptr;
    Mesh* lastMesh = nullptr;
    float lastDrawOutline = 0.0f;

public:
    DeferredShadingGeometryShaderProgram() {
        AddShader(LoadURL("shaders/Mesh.vs"), GL_VERTEX_SHADER);
        AddShader(LoadURL("shaders/MeshDeferred.fs"), GL_FRAGMENT_SHADER);
        LinkProgram();
        Use();

        uniformProj = GetUniformLocation("u_Projection");
        uniformView = GetUniformLocation("u_View");
        uniformModel = GetUniformLocation("u_Model");
        uniformViewerPosition = GetUniformLocation("u_ViewerPos");
        uniformRenderShadows = GetUniformLocation("u_RenderShadows");

        uniformMaterial.push_back(GetUniformLocation("u_Material.Ka"));
        uniformMaterial.push_back(GetUniformLocation("u_Material.Kd"));
        uniformMaterial.push_back(GetUniformLocation("u_Material.Ks"));
        uniformMaterial.push_back(GetUniformLocation("u_Material.Ns"));
        uniformMaterial.push_back(GetUniformLocation("u_Material.Ni"));
        uniformMaterial.push_back(GetUniformLocation("u_Material.d"));
        uniformMaterial.push_back(GetUniformLocation("u_Material.illum"));

        uniformMaterial.push_back(GetUniformLocation("u_Material.hasKaMap"));
        uniformMaterial.push_back(GetUniformLocation("u_Material.hasKdMap"));
        uniformMaterial.push_back(GetUniformLocation("u_Material.hasKsMap"));
        uniformMaterial.push_back(GetUniformLocation("u_Material.hasNsMap"));
        uniformMaterial.push_back(GetUniformLocation("u_Material.hasdMap"));
        uniformMaterial.push_back(GetUniformLocation("u_Material.hasBumpMap"));
        uniformMaterial.push_back(GetUniformLocation("u_Material.hasReflMap"));

        uniformOutlineSize = GetUniformLocation("u_Outline");
        uniformOutlineColor = GetUniformLocation("u_OutlineColor");

        // Setup Texture Unit Ids
        glUniform1i(GetUniformLocation("u_map_Ka"), 0);
        glUniform1i(GetUniformLocation("u_map_Kd"), 1);
        glUniform1i(GetUniformLocation("u_map_Ks"), 2);
        glUniform1i(GetUniformLocation("u_map_Ns"), 3);
        glUniform1i(GetUniformLocation("u_map_d"), 4);
        glUniform1i(GetUniformLocation("u_map_bump"), 5);
        glUniform1i(GetUniformLocation("u_map_refl"), 6);
    }

    void SetRenderShadows(bool render) override {
        glUniform1i(uniformRenderShadows, render);
    }

    void SetOverrideMaterial(Material* material) {
        overrideMaterial = material;
    }

    void SetDrawOutline(float size, Vector3 color) {
        if (lastDrawOutline != size) {
            lastDrawOutline = size;
            glUniform1f(uniformOutlineSize, size);
            glUniform3fv(uniformOutlineColor, 1, glm::value_ptr(color));
        }
    }

    void PreDraw(const Vector3& viewPos,
                 const Matrix4& view,
                 const Matrix4& proj) override;
    void Draw(const Matrix4& model, Mesh* mesh) override;

};

class DeferredShadingLightingShaderProgram : public ShaderProgram {
    // Uniforms
    GLint uniformProj;
    GLint uniformModel;

    GLint uniformView;
    GLint uniformViewerPosition;
    GLint uniformNumLights;
    GLint uniformRenderShadows;
    GLint uniformUseProjectionAndView;

    GLint uniformViewportSize;

    GLuint quadVAO;
    GLuint quadVBO;

    GLint uniformLightPosition;
    GLint uniformLightDirection;
    GLint uniformLightTransform;
    GLint uniformLightInverseTransform;
    GLint uniformShadowMapSize;
    GLint uniformNearBoundary;
    GLint uniformFarBoundary;

    GLint uniformNearBiasRange;
    GLint uniformMidBiasRange;
    GLint uniformFarBiasRange;
    GLint uniformShadowTransitionZone;

    GLint uniformLightStrength;
    GLint uniformLightColor;
    GLint uniformLightVolumeSize;
    GLint uniformLightVolumeOffset;
    GLint uniformInverseVolumeTransform;
    GLint uniformDepthBiasMVPNear;
    GLint uniformDepthBiasMVPMid;
    GLint uniformDepthBiasMVPFar;

public:
    Matrix4 standardRemapMatrix;
    DeferredShadingLightingShaderProgram(std::string fragmentShader) {
        standardRemapMatrix = glm::translate(Vector3(-1, -1, -1)) * glm::scale(Vector3(2, 2, 2));

        AddShader(LoadURL("shaders/MeshLighting.vs"), GL_VERTEX_SHADER);
        AddShader(LoadURL(fragmentShader), GL_FRAGMENT_SHADER);
        LinkProgram();
        Use();

        // Create Struct for Coords
        float texCoords[] = {
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0
        };
        glGenVertexArrays(1, &quadVAO);
        glBindVertexArray(quadVAO);

        glGenBuffers(1, &quadVBO);
        glBindBuffer(GL_ARRAY_BUFFER, quadVBO);
        glBufferData(GL_ARRAY_BUFFER, 12 * sizeof(float), texCoords, GL_STATIC_DRAW);
        glEnableVertexAttribArray(0);
        glVertexAttribPointer(0, 2, GL_FLOAT, false, 0, 0);

        standardRemapMatrix = glm::translate(Vector3(-1, -1, -1)) * glm::scale(Vector3(2, 2, 2));

        uniformViewerPosition = GetUniformLocation("u_ViewerPos");
        uniformNumLights = GetUniformLocation("u_NumLights");
        uniformRenderShadows = GetUniformLocation("u_RenderShadows");
        uniformView = GetUniformLocation("u_View");
        uniformModel = GetUniformLocation("u_Model");
        uniformProj = GetUniformLocation("u_Projection");
        uniformViewportSize = GetUniformLocation("u_ViewportSize");
        uniformUseProjectionAndView = GetUniformLocation("u_UseProjectionAndView");

        uniformLightPosition = GetUniformLocation("u_Light.position");
        uniformLightDirection = GetUniformLocation("u_Light.direction");
        uniformLightTransform = GetUniformLocation("u_Light.transform");
        uniformLightInverseTransform = GetUniformLocation("u_Light.inverseTransform");
        uniformShadowMapSize = GetUniformLocation("u_Light.shadowMapSize");
        uniformNearBoundary = GetUniformLocation("u_Light.nearBoundary");
        uniformFarBoundary = GetUniformLocation("u_Light.farBoundary");
        uniformNearBiasRange = GetUniformLocation("u_Light.nearBiasRange");
        uniformMidBiasRange = GetUniformLocation("u_Light.midBiasRange");
        uniformFarBiasRange = GetUniformLocation("u_Light.farBiasRange");
        uniformShadowTransitionZone = GetUniformLocation("u_Light.shadowTransitionZone");
        uniformLightStrength = GetUniformLocation("u_Light.strength");
        uniformLightColor = GetUniformLocation("u_Light.color");
        uniformLightVolumeSize = GetUniformLocation("u_Light.volumeSize");
        uniformLightVolumeOffset = GetUniformLocation("u_Light.volumeOffset");
        uniformInverseVolumeTransform = GetUniformLocation("u_Light.inverseVolumeTransform");
        uniformDepthBiasMVPNear = GetUniformLocation("u_Light.depthBiasMVPNear");
        uniformDepthBiasMVPMid = GetUniformLocation("u_Light.depthBiasMVPMid");
        uniformDepthBiasMVPFar = GetUniformLocation("u_Light.depthBiasMVPFar");

        // Setup Texture Unit Ids
        glUniform1i(GetUniformLocation("gbuf_position"), 0);
        glUniform1i(GetUniformLocation("gbuf_normal"), 1);
        glUniform1i(GetUniformLocation("gbuf_diffuse"), 2);
        glUniform1i(GetUniformLocation("gbuf_specular"), 3);

        // Light Texture Maps
        glUniform1i(GetUniformLocation("u_shadowMap"), 4);
    }

    void SetRenderShadows(bool render) override {
        glUniform1i(uniformRenderShadows, render);
    }

    void SetViewportSize(int width, int height) {
        glUniform2f(uniformViewportSize, (float)width, (float)height);
    }

    void PreDraw(const Vector3& viewPos,
                 const Matrix4& view,
                 const Matrix4& proj) override;
    void Draw(const Matrix4& model, Mesh* mesh) override {}

    void RenderLighting(TransformedLight& light, AssetManager& assetManager);
};

class DebugShaderProgram : public ShaderProgram {
    // Uniforms
    GLint uniformProj;
    GLint uniformView;
    GLint uniformModel;

    GLint uniformColor;
public:
    DebugShaderProgram() {
        AddShader(LoadURL("shaders/Debug.vs"), GL_VERTEX_SHADER);
        AddShader(LoadURL("shaders/Debug.fs"), GL_FRAGMENT_SHADER);
        LinkProgram();
        Use();

        uniformProj = GetUniformLocation("u_Projection");
        uniformView = GetUniformLocation("u_View");
        uniformModel = GetUniformLocation("u_Model");
        uniformColor = GetUniformLocation("u_Color");
    }

    void PreDraw(const Vector3& viewPos,
                 const Matrix4& view,
                 const Matrix4& proj) override;
    void Draw(const Matrix4& model, Mesh* mesh) override;

    void SetColor(Vector3 color) {
        glUniform3f(uniformColor, color.r, color.g, color.b);
    }
};


class ShadowMapShaderProgram : public ShaderProgram {
    // Uniforms
    GLint uniformProj;
    GLint uniformView;
    GLint uniformModel;
public:
    ShadowMapShaderProgram() {
        AddShader(LoadURL("shaders/ShadowMap.vs"), GL_VERTEX_SHADER);
        AddShader(LoadURL("shaders/ShadowMap.fs"), GL_FRAGMENT_SHADER);
        LinkProgram();
        Use();

        uniformProj = GetUniformLocation("u_Projection");
        uniformView = GetUniformLocation("u_View");
        uniformModel = GetUniformLocation("u_Model");
    }

    void PreDraw(const Vector3& viewPos,
                 const Matrix4& view,
                 const Matrix4& proj) override;
    void Draw(const Matrix4& model, Mesh* mesh) override;
};

class QuadShaderProgram : public ShaderProgram {
    // Uniforms
    GLint uniformMVP;
    GLint uniformIsDepth;

    GLint uniformColorMultiplier;
    GLint uniformTextureSize;

    GLuint quadVAO;
    GLuint quadVBO;

public:

    Matrix4 standardRemapMatrix;

    QuadShaderProgram(const std::string& fragmentShader) {
        AddShader(LoadURL("shaders/Quad.vs"), GL_VERTEX_SHADER);
        AddShader(LoadURL(fragmentShader), GL_FRAGMENT_SHADER);
        LinkProgram();
        Use();

        glUniform1i(GetUniformLocation("u_texture"), 0);

        uniformMVP = GetUniformLocation("u_MVP");
        uniformIsDepth = GetUniformLocation("u_isDepth");
        uniformColorMultiplier = GetUniformLocation("u_colorMultiplier");
        uniformTextureSize = GetUniformLocation("u_textureSize");

        // Create Struct for Coords
        float texCoords[] = {
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0
        };
        glGenVertexArrays(1, &quadVAO);
        glBindVertexArray(quadVAO);

        glGenBuffers(1, &quadVBO);
        glBindBuffer(GL_ARRAY_BUFFER, quadVBO);
        glBufferData(GL_ARRAY_BUFFER, 12 * sizeof(float), texCoords, GL_STATIC_DRAW);
        glEnableVertexAttribArray(0);
        glVertexAttribPointer(0, 2, GL_FLOAT, false, 0, 0);

        standardRemapMatrix = glm::translate(Vector3(-1, -1, -1)) * glm::scale(Vector3(2, 2, 2));
        SetIsDepth(false);
    }


    void PreDraw(const Vector3& viewPos,
                 const Matrix4& view,
                 const Matrix4& proj) {}
    void Draw(const Matrix4& model, Mesh* mesh) {}

    void SetIsDepth(bool isDepth) {
        glUniform1i(uniformIsDepth, isDepth);
    }

    void SetTextureSize(float width, float height) {
        glUniform2f(uniformTextureSize, width, height);
    }

    void DrawQuad(GLuint texture, Matrix4 mvp, float colorMultiplier = 1.0f) {
        glUniformMatrix4fv(uniformMVP, 1, GL_FALSE, glm::value_ptr(mvp));
        glUniform1f(uniformColorMultiplier, colorMultiplier);

        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, texture);
        glBindVertexArray(quadVAO);
        glDrawArrays(GL_TRIANGLES, 0, 6);
    }
};
