#pragma once

#include <GLES3/gl3.h>
#include <string>
#include <vector>

#include "vector.h"
#include "object.h"

class ClientGL;
class Mesh;
class Game;

class ShaderProgram {
    GLint program;
    std::vector<GLuint> shaders;

public:
    virtual ~ShaderProgram() {}

    std::string LoadURL(const std::string& url);
    void AddShader(const std::string& data, GLenum shaderType);
    void LinkProgram();
    void Use();

    GLint GetUniformLocation(const std::string& uniName);
    GLint GetAttributeLocation(const std::string& attrName);

    virtual void PreDraw(Game& game,
                         const Vector3& viewPos,
                         const Matrix4& view,
                         const Matrix4& proj) = 0;
    virtual void Draw(ClientGL& client, const Matrix4& model, Mesh* mesh) = 0;
};

class DefaultMaterialShaderProgram : public ShaderProgram {
    // Uniforms
    GLint uniformProj;
    GLint uniformView;
    GLint uniformModel;
    GLint uniformViewerPosition;
    GLint uniformNumLights;
    GLint uniformRandSeed;

    std::vector<GLint> uniformMaterial;
public:
    DefaultMaterialShaderProgram() {
        AddShader(LoadURL("shaders/Mesh.vs"), GL_VERTEX_SHADER);
        AddShader(LoadURL("shaders/Mesh.fs"), GL_FRAGMENT_SHADER);
        LinkProgram();
        Use();

        uniformProj = GetUniformLocation("u_Projection");
        uniformView = GetUniformLocation("u_View");
        uniformModel = GetUniformLocation("u_Model");
        uniformViewerPosition = GetUniformLocation("u_ViewerPos");
        uniformNumLights = GetUniformLocation("u_NumLights");
        uniformRandSeed = GetUniformLocation("u_RandSeed");

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

        // Setup Texture Unit Ids
        glUniform1i(GetUniformLocation("u_map_Ka"), 0);
        glUniform1i(GetUniformLocation("u_map_Kd"), 1);
        glUniform1i(GetUniformLocation("u_map_Ks"), 2);
        glUniform1i(GetUniformLocation("u_map_Ns"), 3);
        glUniform1i(GetUniformLocation("u_map_d"), 4);
        glUniform1i(GetUniformLocation("u_map_bump"), 5);
        glUniform1i(GetUniformLocation("u_map_refl"), 6);

        // Light Texture Maps
        for (int i = 0; i < 10; i++) {
            glUniform1i(GetUniformLocation("u_shadowMap[" + std::to_string(i) + "]"), 7 + i);
        }
    }

    void PreDraw(Game& game,
                 const Vector3& viewPos,
                 const Matrix4& view,
                 const Matrix4& proj) override;
    void Draw(ClientGL& client, const Matrix4& model, Mesh* mesh) override;
};


class DebugShaderProgram : public ShaderProgram {
    // Uniforms
    GLint uniformProj;
    GLint uniformView;
    GLint uniformModel;

    GLint uniformColor;
    GLenum drawType;
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

    void PreDraw(Game& game,
                 const Vector3& viewPos,
                 const Matrix4& view,
                 const Matrix4& proj) override;
    void Draw(ClientGL& client, const Matrix4& model, Mesh* mesh) override;

    void SetDrawType(GLenum inDrawType) {
        drawType = inDrawType;
    }
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

    void PreDraw(Game& game,
                 const Vector3& viewPos,
                 const Matrix4& view,
                 const Matrix4& proj) override;
    void Draw(ClientGL& client, const Matrix4& model, Mesh* mesh) override;
};

class QuadShaderProgram : public ShaderProgram {
    // Uniforms
    GLint uniformMVP;

    GLuint quadVAO;
    GLuint quadVBO;

public:
    QuadShaderProgram() {
        AddShader(LoadURL("shaders/Quad.vs"), GL_VERTEX_SHADER);
        AddShader(LoadURL("shaders/Quad.fs"), GL_FRAGMENT_SHADER);
        LinkProgram();
        Use();

        glUniform1i(GetUniformLocation("u_texture"), 0);

        uniformMVP = GetUniformLocation("u_MVP");

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
    }

    void PreDraw(Game& game,
                 const Vector3& viewPos,
                 const Matrix4& view,
                 const Matrix4& proj) {}
    void Draw(ClientGL& client, const Matrix4& model, Mesh* mesh) {}


    void DrawQuad(GLuint texture, Matrix4 mvp) {
        glUniformMatrix4fv(uniformMVP, 1, GL_FALSE, glm::value_ptr(mvp));

        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, texture);
        glBindVertexArray(quadVAO);
        glDrawArrays(GL_TRIANGLES, 0, 6);
    }
};