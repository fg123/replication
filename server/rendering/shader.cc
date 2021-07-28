#include "shader.h"
#include "logging.h"

// TODO: remove
#include "game.h"
#include "scene.h"

#include <fstream>

std::string ShaderProgram::LoadURL(const std::string& name) {
    std::string url = RESOURCE_PATH(name);
    LOG_DEBUG("Loading " << url);
    std::ifstream t(url);
    if (!t.good()) {
        LOG_ERROR("Could not open file " << url);
        throw "Could not open file!";
    }
    return std::string((std::istreambuf_iterator<char>(t)),
                 std::istreambuf_iterator<char>());
}

#ifdef BUILD_EDITOR

const char* SHADER_HEADER = "#version 330\n";

#elif BUILD_CLIENT

const char* SHADER_HEADER = "#version 300 es\n";

#endif


void ShaderProgram::AddShader(const std::string& data, GLenum shaderType) {

    std::string fullShader = std::string(SHADER_HEADER) + data;

    GLuint shader = glCreateShader(shaderType);

    const char* shaderData = fullShader.c_str();
    glShaderSource(shader, 1, (const GLchar**)&shaderData, NULL);
    glCompileShader(shader);

    GLint compileSuccess;

    glGetShaderiv(shader, GL_COMPILE_STATUS, &compileSuccess);
    if (compileSuccess == GL_FALSE) {
        GLint errorMessageLength;
        // Get the length in chars of the compilation error message.
        glGetShaderiv(shader, GL_INFO_LOG_LENGTH, &errorMessageLength);

        // Retrieve the compilation error message.
        GLchar errorMessage[errorMessageLength + 1]; // Add 1 for null terminator
        glGetShaderInfoLog(shader, errorMessageLength, NULL, errorMessage);

        std::string message = "Error Compiling Shader: ";
        message += errorMessage;
        LOG_ERROR(message);
        throw std::runtime_error(message);
    }
    shaders.push_back(shader);
}

void ShaderProgram::LinkProgram() {
    program = glCreateProgram();
    for (auto& shader : shaders) {
        glAttachShader(program, shader);
    }
    glLinkProgram(program);

    GLint linkSuccess;

    glGetProgramiv(program, GL_LINK_STATUS, &linkSuccess);
    if (linkSuccess == GL_FALSE) {
        GLint errorMessageLength;
        // Get the length in chars of the link error message.
        glGetProgramiv(program, GL_INFO_LOG_LENGTH, &errorMessageLength);

        // Retrieve the link error message.
        GLchar errorMessage[errorMessageLength];
        glGetProgramInfoLog(program, errorMessageLength, NULL, errorMessage);

        std::string message = "Error Linking Program: ";
        message += errorMessage;
        LOG_ERROR(message);
        throw std::runtime_error(message);
    }
}

void ShaderProgram::Use() {
    glUseProgram(program);
}

GLint ShaderProgram::GetAttributeLocation(const std::string& attrName) {
    GLint result = glGetAttribLocation(program, attrName.c_str());
    if (result < 0) {
        LOG_ERROR("Could not find attribute " << attrName);
    }
    return result;
}

GLint ShaderProgram::GetUniformLocation(const std::string& uniName) {
    GLint result = glGetUniformLocation(program, uniName.c_str());
    if (result < 0) {
        LOG_ERROR("Could not find uniform " << uniName);
    }
    return result;
}

void DefaultMaterialShaderProgram::Draw(const Matrix4& model, Mesh* mesh) {
    // Set Model Transform
    glUniformMatrix4fv(uniformModel, 1, GL_FALSE, glm::value_ptr(model));

    // Set Mesh Material
    if (mesh->material != lastMaterial) {
        lastMaterial = mesh->material;
        DefaultMaterial* material = static_cast<DefaultMaterial*>(mesh->material);
        glUniform3fv(uniformMaterial[0], 1, glm::value_ptr(material->Ka));
        glUniform3fv(uniformMaterial[1], 1, glm::value_ptr(material->Kd));
        glUniform3fv(uniformMaterial[2], 1, glm::value_ptr(material->Ks));
        glUniform1f (uniformMaterial[3], material->Ns);
        glUniform1f (uniformMaterial[4], material->Ni);
        glUniform1f (uniformMaterial[5], material->d);
        glUniform1i (uniformMaterial[6], material->illum);

        // Texture Booleans
        glUniform1i (uniformMaterial[7],  material->map_Ka != nullptr);
        glUniform1i (uniformMaterial[8],  material->map_Kd != nullptr);
        glUniform1i (uniformMaterial[9],  material->map_Ks != nullptr);
        glUniform1i (uniformMaterial[10], material->map_Ns != nullptr);
        glUniform1i (uniformMaterial[11], material->map_d != nullptr);
        glUniform1i (uniformMaterial[12], material->map_bump != nullptr);
        glUniform1i (uniformMaterial[13], material->map_refl != nullptr);

        // Actual Textures, the units are previously mapped
        if (material->map_Ka) {
            glActiveTexture(GL_TEXTURE0);
            glBindTexture(GL_TEXTURE_2D, material->map_Ka->textureBuffer);
        }
        if (material->map_Kd) {
            glActiveTexture(GL_TEXTURE1);
            glBindTexture(GL_TEXTURE_2D, material->map_Kd->textureBuffer);
        }
        if (material->map_Ks) {
            glActiveTexture(GL_TEXTURE2);
            glBindTexture(GL_TEXTURE_2D, material->map_Ks->textureBuffer);
        }
        if (material->map_Ns) {
            glActiveTexture(GL_TEXTURE3);
            glBindTexture(GL_TEXTURE_2D, material->map_Ns->textureBuffer);
        }
        if (material->map_d) {
            glActiveTexture(GL_TEXTURE4);
            glBindTexture(GL_TEXTURE_2D, material->map_d->textureBuffer);
        }
        if (material->map_bump) {
            glActiveTexture(GL_TEXTURE5);
            glBindTexture(GL_TEXTURE_2D, material->map_bump->textureBuffer);
        }
        if (material->map_refl) {
            glActiveTexture(GL_TEXTURE6);
            glBindTexture(GL_TEXTURE_2D, material->map_refl->textureBuffer);
        }
    }
    if (mesh != lastMesh) {
        lastMesh = mesh;
        glBindVertexArray(mesh->renderInfo.vao);
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh->renderInfo.ibo);
    }
    glDrawElements(GL_TRIANGLES, mesh->renderInfo.iboCount, GL_UNSIGNED_INT, nullptr);
}

void DefaultMaterialShaderProgram::PreDraw(const Vector3& viewPos,
                const Matrix4& view,
                const Matrix4& proj) {

    glEnable(GL_CULL_FACE);
    glCullFace(GL_BACK);

    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    glUniform3fv(uniformViewerPosition, 1, glm::value_ptr(viewPos));
    glUniformMatrix4fv(uniformView, 1, GL_FALSE, glm::value_ptr(view));
    glUniformMatrix4fv(uniformProj, 1, GL_FALSE, glm::value_ptr(proj));

    // Load Lights Into Shader
    // auto& lights = game.GetAssetManager().lights;
    // int numLights = lights.size();
    // // LOG_DEBUG("Loading " << numLights << " into uniform");
    // glUniform1i(uniformNumLights, numLights);
    // for (int i = 0; i < numLights; i++) {
    //     GLint lightPosition = GetUniformLocation("u_Lights[" + std::to_string(i) + "].position");
    //     GLint lightColor = GetUniformLocation("u_Lights[" + std::to_string(i) + "].color");
    //     GLint depthBiasMVPNear = GetUniformLocation("u_Lights[" + std::to_string(i) + "].depthBiasMVPNear");
    //     GLint depthBiasMVPMid = GetUniformLocation("u_Lights[" + std::to_string(i) + "].depthBiasMVPMid");
    //     GLint depthBiasMVPFar = GetUniformLocation("u_Lights[" + std::to_string(i) + "].depthBiasMVPFar");

    //     GLint shadowMapSize = GetUniformLocation("u_Lights[" + std::to_string(i) + "].shadowMapSize");
    //     glUniform3fv(lightPosition, 1, glm::value_ptr(lights[i].position));
    //     glUniform3fv(lightColor, 1, glm::value_ptr(lights[i].color));
    //     glUniformMatrix4fv(depthBiasMVPNear, 1, GL_FALSE, glm::value_ptr(lights[i].depthBiasMVPNear));
    //     glUniformMatrix4fv(depthBiasMVPMid, 1, GL_FALSE, glm::value_ptr(lights[i].depthBiasMVPMid));
    //     glUniformMatrix4fv(depthBiasMVPFar, 1, GL_FALSE, glm::value_ptr(lights[i].depthBiasMVPFar));
    //     glUniform1i(shadowMapSize, lights[i].shadowMapSize);

    //     // See client_shader.h:83
    //     glActiveTexture(GL_TEXTURE7 + i);
    //     glBindTexture(GL_TEXTURE_2D, lights[i].shadowDepthMap);
    // }
}


void DeferredShadingGeometryShaderProgram::Draw(const Matrix4& model, Mesh* mesh) {
    // Set Model Transform
    glUniformMatrix4fv(uniformModel, 1, GL_FALSE, glm::value_ptr(model));

    // Set Mesh Material
    if (mesh->material != lastMaterial) {
        lastMaterial = mesh->material;
        DefaultMaterial* material = static_cast<DefaultMaterial*>(mesh->material);
        glUniform3fv(uniformMaterial[0], 1, glm::value_ptr(material->Ka));
        glUniform3fv(uniformMaterial[1], 1, glm::value_ptr(material->Kd));
        glUniform3fv(uniformMaterial[2], 1, glm::value_ptr(material->Ks));
        glUniform1f (uniformMaterial[3], material->Ns);
        glUniform1f (uniformMaterial[4], material->Ni);
        glUniform1f (uniformMaterial[5], material->d);
        glUniform1i (uniformMaterial[6], material->illum);

        // Texture Booleans
        glUniform1i (uniformMaterial[7],  material->map_Ka != nullptr);
        glUniform1i (uniformMaterial[8],  material->map_Kd != nullptr);
        glUniform1i (uniformMaterial[9],  material->map_Ks != nullptr);
        glUniform1i (uniformMaterial[10], material->map_Ns != nullptr);
        glUniform1i (uniformMaterial[11], material->map_d != nullptr);
        glUniform1i (uniformMaterial[12], material->map_bump != nullptr);
        glUniform1i (uniformMaterial[13], material->map_refl != nullptr);

        // Actual Textures, the units are previously mapped
        if (material->map_Ka) {
            glActiveTexture(GL_TEXTURE0);
            glBindTexture(GL_TEXTURE_2D, material->map_Ka->textureBuffer);
        }
        if (material->map_Kd) {
            glActiveTexture(GL_TEXTURE1);
            glBindTexture(GL_TEXTURE_2D, material->map_Kd->textureBuffer);
        }
        if (material->map_Ks) {
            glActiveTexture(GL_TEXTURE2);
            glBindTexture(GL_TEXTURE_2D, material->map_Ks->textureBuffer);
        }
        if (material->map_Ns) {
            glActiveTexture(GL_TEXTURE3);
            glBindTexture(GL_TEXTURE_2D, material->map_Ns->textureBuffer);
        }
        if (material->map_d) {
            glActiveTexture(GL_TEXTURE4);
            glBindTexture(GL_TEXTURE_2D, material->map_d->textureBuffer);
        }
        if (material->map_bump) {
            glActiveTexture(GL_TEXTURE5);
            glBindTexture(GL_TEXTURE_2D, material->map_bump->textureBuffer);
        }
        if (material->map_refl) {
            glActiveTexture(GL_TEXTURE6);
            glBindTexture(GL_TEXTURE_2D, material->map_refl->textureBuffer);
        }
    }
    if (mesh != lastMesh) {
        lastMesh = mesh;
        glBindVertexArray(mesh->renderInfo.vao);
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh->renderInfo.ibo);
    }
    glDrawElements(GL_TRIANGLES, mesh->renderInfo.iboCount, GL_UNSIGNED_INT, nullptr);
}

void DeferredShadingGeometryShaderProgram::PreDraw(const Vector3& viewPos,
                const Matrix4& view,
                const Matrix4& proj) {
    glEnable(GL_CULL_FACE);
    glCullFace(GL_BACK);

    glUniform3fv(uniformViewerPosition, 1, glm::value_ptr(viewPos));
    glUniformMatrix4fv(uniformView, 1, GL_FALSE, glm::value_ptr(view));
    glUniformMatrix4fv(uniformProj, 1, GL_FALSE, glm::value_ptr(proj));
}

void ShadowMapShaderProgram::PreDraw(const Vector3& viewPos,
                const Matrix4& view,
                const Matrix4& proj) {
    glEnable(GL_CULL_FACE);
    glCullFace(GL_BACK);

    glUniformMatrix4fv(uniformView, 1, GL_FALSE, glm::value_ptr(view));
    glUniformMatrix4fv(uniformProj, 1, GL_FALSE, glm::value_ptr(proj));
}

void ShadowMapShaderProgram::Draw(const Matrix4& model, Mesh* mesh) {
    glUniformMatrix4fv(uniformModel, 1, GL_FALSE, glm::value_ptr(model));
    glBindVertexArray(mesh->renderInfo.vao);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh->renderInfo.ibo);
    glDrawElements(GL_TRIANGLES, mesh->renderInfo.iboCount, GL_UNSIGNED_INT, nullptr);
}

void DebugShaderProgram::Draw(const Matrix4& model, Mesh* mesh) {
    glUniformMatrix4fv(uniformModel, 1, GL_FALSE, glm::value_ptr(model));
    glBindVertexArray(mesh->renderInfo.vao);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh->renderInfo.ibo);
    glDrawElements(GL_LINES, mesh->renderInfo.iboCount, GL_UNSIGNED_INT, nullptr);
}

void DebugShaderProgram::PreDraw(const Vector3& viewPos,
                const Matrix4& view,
                const Matrix4& proj) {
    glUniformMatrix4fv(uniformView, 1, GL_FALSE, glm::value_ptr(view));
    glUniformMatrix4fv(uniformProj, 1, GL_FALSE, glm::value_ptr(proj));
}

void DeferredShadingLightingShaderProgram::PreDraw(const Vector3& viewPos,
                const Matrix4& view,
                const Matrix4& proj) {

    glUniform3fv(uniformViewerPosition, 1, glm::value_ptr(viewPos));
    glUniformMatrix4fv(uniformView, 1, GL_FALSE, glm::value_ptr(view));
    glUniformMatrix4fv(uniformProj, 1, GL_FALSE, glm::value_ptr(proj));

    // // Load Lights Into Shader
    // auto& lights = game.GetAssetManager().lights;
    // int numLights = lights.size();
    // // LOG_DEBUG("Loading " << numLights << " into uniform");
    // glUniform1i(uniformNumLights, numLights);
    // for (int i = 0; i < numLights; i++) {
    //     GLint lightPosition = GetUniformLocation("u_Lights[" + std::to_string(i) + "].position");
    //     GLint lightColor = GetUniformLocation("u_Lights[" + std::to_string(i) + "].color");
    //     GLint depthBiasMVPNear = GetUniformLocation("u_Lights[" + std::to_string(i) + "].depthBiasMVPNear");
    //     GLint depthBiasMVPMid = GetUniformLocation("u_Lights[" + std::to_string(i) + "].depthBiasMVPMid");
    //     GLint depthBiasMVPFar = GetUniformLocation("u_Lights[" + std::to_string(i) + "].depthBiasMVPFar");

    //     GLint shadowMapSize = GetUniformLocation("u_Lights[" + std::to_string(i) + "].shadowMapSize");
    //     glUniform3fv(lightPosition, 1, glm::value_ptr(lights[i].position));
    //     glUniform3fv(lightColor, 1, glm::value_ptr(lights[i].color));
    //     glUniformMatrix4fv(depthBiasMVPNear, 1, GL_FALSE, glm::value_ptr(lights[i].depthBiasMVPNear));
    //     glUniformMatrix4fv(depthBiasMVPMid, 1, GL_FALSE, glm::value_ptr(lights[i].depthBiasMVPMid));
    //     glUniformMatrix4fv(depthBiasMVPFar, 1, GL_FALSE, glm::value_ptr(lights[i].depthBiasMVPFar));
    //     glUniform1i(shadowMapSize, lights[i].shadowMapSize);

    //     // See client_shader.h:83
    //     glActiveTexture(GL_TEXTURE4 + i);
    //     glBindTexture(GL_TEXTURE_2D, lights[i].shadowDepthMap);
    // }
}

void DeferredShadingLightingShaderProgram::RenderLighting(Game& game) {
    if (!game.GetModel("Cone.obj")) return;
    glEnable(GL_DEPTH_TEST);

    Mesh& coneMesh = game.GetModel("Cone.obj")->meshes[0];

    // Render Each Light Volume
    for (auto& light : game.GetAssetManager().lights) {
        glUniform1i(uniformLightType, (int)light.shape);
        glUniform3fv(uniformLightPosition, 1, glm::value_ptr(light.position));
        glUniform3fv(uniformLightColor, 1, glm::value_ptr(light.color));
        glUniformMatrix4fv(uniformDepthBiasMVPNear, 1, GL_FALSE, glm::value_ptr(light.depthBiasMVPNear));
        glUniformMatrix4fv(uniformDepthBiasMVPMid, 1, GL_FALSE, glm::value_ptr(light.depthBiasMVPMid));
        glUniformMatrix4fv(uniformDepthBiasMVPFar, 1, GL_FALSE, glm::value_ptr(light.depthBiasMVPFar));
        glUniform1i(uniformShadowMapSize, light.shadowMapSize);

        // See client_shader.h:83
        glActiveTexture(GL_TEXTURE4);
        glBindTexture(GL_TEXTURE_2D, light.shadowDepthMap);

        if (light.shape == LightShape::Directional) {
            glUniform3f(GetUniformLocation("u_Light.coneDirection"), 0.0f, -1.0f, 0.0f);
            glUniform1f(GetUniformLocation("u_Light.height"), 4.0f);
            glUniform1f(GetUniformLocation("u_Light.baseRadius"), 2.0f);

            // glCullFace(GL_BACK);
            // glDisable(GL_DEPTH_TEST);
            // glDepthMask(GL_FALSE);
            // glUniform1i(uniformUseProjectionAndView, GL_FALSE);
            // glUniformMatrix4fv(uniformModel, 1, GL_FALSE, glm::value_ptr(standardRemapMatrix));
            // glBindVertexArray(quadVAO);
            // glDrawArrays(GL_TRIANGLES, 0, 6);
            // glDepthMask(GL_TRUE);
            // glEnable(GL_DEPTH_TEST);

            glDisable(GL_DEPTH_TEST);
            glDepthMask(GL_FALSE);
            glCullFace(GL_FRONT);
            glUniform1i(uniformUseProjectionAndView, GL_TRUE);
            // Get the Light's View Matrix
            Matrix4 model = glm::translate(light.position) *
                glm::transpose(glm::toMat4(DirectionToQuaternion(light.direction))) *
                glm::scale(Vector3(4, 4, 10));
            glUniformMatrix4fv(uniformModel, 1, GL_FALSE, glm::value_ptr(model));

            glBindVertexArray(coneMesh.renderInfo.vao);
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, coneMesh.renderInfo.ibo);
            glDrawElements(GL_TRIANGLES, coneMesh.renderInfo.iboCount, GL_UNSIGNED_INT, 0);

            glDepthMask(GL_TRUE);
            glEnable(GL_DEPTH_TEST);
        }
        else if (light.shape == LightShape::Sun) {
            glCullFace(GL_BACK);
            glDisable(GL_DEPTH_TEST);
            glDepthMask(GL_FALSE);
            glUniform1i(uniformUseProjectionAndView, GL_FALSE);
            glUniformMatrix4fv(uniformModel, 1, GL_FALSE, glm::value_ptr(standardRemapMatrix));
            glBindVertexArray(quadVAO);
            glDrawArrays(GL_TRIANGLES, 0, 6);
            glDepthMask(GL_TRUE);
            glEnable(GL_DEPTH_TEST);
        }
    }
}