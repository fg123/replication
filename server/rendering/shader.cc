#include "shader.h"
#include "logging.h"

// TODO: remove
#include "game.h"
#include "scene.h"
#include "util.h"

#include <fstream>

std::string ShaderProgram::LoadURL(const std::string& name) {
    std::unordered_map<std::string, std::string> substitutions;
    return LoadURL(name, substitutions);
}

std::string ShaderProgram::LoadURL(const std::string& name, std::unordered_map<std::string, std::string>& substitutions) {
    std::string url = RESOURCE_PATH(name);
    LOG_DEBUG("Loading " << url);
    std::ifstream t(url);
    if (!t.good()) {
        LOG_ERROR("Could not open file " << url);
        throw "Could not open file!";
    }
    return PreprocessShader(std::string((std::istreambuf_iterator<char>(t)),
                 std::istreambuf_iterator<char>()), substitutions);
}

#ifdef BUILD_EDITOR

const char* SHADER_HEADER = "#version 330\nprecision highp float;\n";

#elif BUILD_CLIENT

const char* SHADER_HEADER = "#version 300 es\nprecision highp float;\n";

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

struct PreprocessorDirective {
    std::string type;
    std::vector<std::string> arguments;
};

bool ParsePreprocessorDirective(const std::string& line, PreprocessorDirective& directive) {
    std::string trimmedLine = trim_copy(line);
    if (line.empty()) return false;
    if (line[0] != '#') return false;

    std::istringstream iss {trimmedLine};
    if (!(iss >> directive.type)) return false;
    std::string part;
    while (iss >> part) {
        directive.arguments.emplace_back(part);
    }
    return true;
}

std::string ShaderProgram::PreprocessShader(const std::string& raw_shader, std::unordered_map<std::string, std::string>& substitutions) {
    std::ostringstream outputShader;

    std::istringstream iss(raw_shader);
    std::string line;

    std::string currentSubstitution = "";

    while (std::getline(iss, line)) {
        PreprocessorDirective directive;
        if (ParsePreprocessorDirective(line, directive)) {
            if (directive.type == "#define") {
                if (directive.arguments.size() != 1) {
                    LOG_ERROR("#define directive must have exactly one argument");
                    throw std::runtime_error("#define directive must have exactly one argument");
                }
                currentSubstitution = directive.arguments.at(0);
            }
            else if (directive.type == "#end") {
                currentSubstitution = "";
            }
            else if (directive.type == "#include") {
                if (directive.arguments.size() != 1) {
                    LOG_ERROR("#include directive must have exactly one argument");
                    throw std::runtime_error("#include directive must have exactly one argument");
                }
                outputShader << LoadURL(directive.arguments[0], substitutions) << "\n";
            }
            else if (directive.type == "#require") {
                if (directive.arguments.size() != 1) {
                    LOG_ERROR("#require directive must have exactly one argument");
                    throw std::runtime_error("#require directive requires exactly one argument");
                }
                if (substitutions.find(directive.arguments[0]) == substitutions.end()) {
                    LOG_ERROR("Could not find substitution " << directive.arguments[0]);
                    throw std::runtime_error("Could not find substitution " + directive.arguments[0]);
                }
                outputShader << substitutions.at(directive.arguments[0]) << "\n";
            }
        }
        else if (!currentSubstitution.empty()) {
            substitutions[currentSubstitution] += line + "\n";
        }
        else {
            outputShader << line << "\n";
        }
    }

    return outputShader.str();
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

    Material* meshMat = overrideMaterial ? overrideMaterial : mesh->material;
    // Set Mesh Material
    if (meshMat != lastMaterial) {
        lastMaterial = meshMat;
        DefaultMaterial* material = static_cast<DefaultMaterial*>(meshMat);
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

void DeferredShadingLightingShaderProgram::RenderLighting(LightNode& light, AssetManager& assetManager) {
    // Set all the uniforms
    glUniform3fv(uniformLightPosition, 1, glm::value_ptr(light.position));
    glUniform3fv(uniformLightDirection, 1, glm::value_ptr(light.GetDirection()));
    glUniformMatrix4fv(uniformLightTransform, 1, GL_FALSE, glm::value_ptr(light.transform));
    glUniformMatrix4fv(uniformLightInverseTransform, 1, GL_FALSE, glm::value_ptr(glm::inverse(light.transform)));
    glUniformMatrix4fv(uniformInverseVolumeTransform, 1, GL_FALSE, glm::value_ptr(glm::inverse(light.GetRectangleVolumeTransform())));
    glUniform1i(uniformShadowMapSize, light.shadowMapSize);
    glUniform1f(uniformLightStrength, light.strength);
    glUniform3fv(uniformLightColor, 1, glm::value_ptr(light.color));
    glUniform2fv(uniformLightVolumeSize, 1, glm::value_ptr(light.volumeSize));
    glUniform2fv(uniformLightVolumeOffset, 1, glm::value_ptr(light.volumeOffset));
    glUniformMatrix4fv(uniformDepthBiasMVPNear, 1, GL_FALSE, glm::value_ptr(light.depthBiasMVPNear));
    glUniformMatrix4fv(uniformDepthBiasMVPMid, 1, GL_FALSE, glm::value_ptr(light.depthBiasMVPMid));
    glUniformMatrix4fv(uniformDepthBiasMVPFar, 1, GL_FALSE, glm::value_ptr(light.depthBiasMVPFar));

    glActiveTexture(GL_TEXTURE4);
    glBindTexture(GL_TEXTURE_2D, light.shadowDepthMap);

    glDisable(GL_DEPTH_TEST);
    glDepthMask(GL_FALSE);
    glCullFace(GL_FRONT);
    glUniform1i(uniformUseProjectionAndView, GL_TRUE);

    // Draw Light Volume
    Mesh* mesh = nullptr;
    if (light.shape == LightShape::Point) {
        // Sphere
        mesh = &assetManager.GetModel("Icosphere.obj")->meshes[0];
        glUniformMatrix4fv(uniformModel, 1, GL_FALSE, glm::value_ptr(light.transform));
    }
    else if (light.shape == LightShape::Rectangle) {
        mesh = &assetManager.GetModel("Cube.obj")->meshes[0];
        glUniformMatrix4fv(uniformModel, 1, GL_FALSE, glm::value_ptr(light.GetRectangleVolumeTransform()));
    }

    if (mesh) {
        glBindVertexArray(mesh->renderInfo.vao);
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh->renderInfo.ibo);
        glDrawElements(GL_TRIANGLES, mesh->renderInfo.iboCount, GL_UNSIGNED_INT, 0);
    }

    // glCullFace(GL_BACK);

    // glUniform1i(uniformUseProjectionAndView, GL_FALSE);
    // glUniformMatrix4fv(uniformModel, 1, GL_FALSE, glm::value_ptr(standardRemapMatrix));
    // glBindVertexArray(quadVAO);
    // glDrawArrays(GL_TRIANGLES, 0, 6);

    glEnable(GL_DEPTH_TEST);
}