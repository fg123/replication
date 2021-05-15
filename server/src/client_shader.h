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

public:
    DebugShaderProgram() {
        AddShader(LoadURL("shaders/Debug.vs"), GL_VERTEX_SHADER);
        AddShader(LoadURL("shaders/Debug.fs"), GL_FRAGMENT_SHADER);
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