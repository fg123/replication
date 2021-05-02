#include "client_gl.h"
#include "logging.h"
#include "game.h"
#include "player.h"
#include "vector.h"

#include <vector>
#include <fstream>

ClientGL::ClientGL(Game& game, const char* selector) :
    canvasSelector(selector),
    game(game) {
}

void ClientGL::SetupContext() {
    LOG_DEBUG("Setting up context for selector: " << canvasSelector);
    EmscriptenWebGLContextAttributes attrs;
    emscripten_webgl_init_context_attributes(&attrs);
    attrs.majorVersion = 2;
    attrs.antialias = true;
    attrs.alpha = false;
    glContext = emscripten_webgl_create_context(canvasSelector.c_str(), &attrs);
    emscripten_webgl_make_context_current(glContext);
}

GLuint CreateShader(const std::string& data, GLenum shaderType) {
    GLuint shader = glCreateShader(shaderType);

    const char* shaderData = data.c_str();
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

    return shader;
}

GLuint CreateProgram(std::vector<GLuint> shaders) {
    GLuint program = glCreateProgram();
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
    return program;
}

GLint GetAttributeLocation(GLuint program, const std::string& attrName) {
    GLint result = glGetAttribLocation(program, attrName.c_str());
    if (result < 0) {
        LOG_ERROR("Could not find attribute " << attrName);
    }
    return result;
}

GLint GetUniformLocation(GLuint program, const std::string& uniName) {
    GLint result = glGetUniformLocation(program, uniName.c_str());
    if (result < 0) {
        LOG_ERROR("Could not find uniform " << uniName);
    }
    return result;
}

void ClientGL::SetupGL() {
    // Download Shaders
    std::string vertexShaderData = LoadURL("shaders/VertexShader.vert");
    std::string fragmentShaderData = LoadURL("shaders/FragmentShader.frag");
    GLuint vertexShader = CreateShader(vertexShaderData, GL_VERTEX_SHADER);
    GLuint fragmentShader = CreateShader(fragmentShaderData, GL_FRAGMENT_SHADER);
    program = CreateProgram({ vertexShader, fragmentShader });
    glUseProgram(program);

    positionAttributeLocation = GetAttributeLocation(program, "v_position");
    normalAttributeLocation = GetAttributeLocation(program, "v_normal");
    textureCoordsAttributeLocation = GetAttributeLocation(program, "v_texCoords");

    uniformProj = GetUniformLocation(program, "u_Projection");
    uniformView = GetUniformLocation(program, "u_View");
    uniformModel = GetUniformLocation(program, "u_Model");
    uniformViewerPosition = GetUniformLocation(program, "u_ViewerPos");
    uniformNumLights = GetUniformLocation(program, "u_NumLights");

    uniformMaterial.push_back(GetUniformLocation(program, "u_Material.Ka"));
    uniformMaterial.push_back(GetUniformLocation(program, "u_Material.Kd"));
    uniformMaterial.push_back(GetUniformLocation(program, "u_Material.Ks"));
    uniformMaterial.push_back(GetUniformLocation(program, "u_Material.Ns"));
    uniformMaterial.push_back(GetUniformLocation(program, "u_Material.Ni"));
    uniformMaterial.push_back(GetUniformLocation(program, "u_Material.d"));
    uniformMaterial.push_back(GetUniformLocation(program, "u_Material.illum"));

    glEnable(GL_CULL_FACE);
    glCullFace(GL_BACK);
    glEnable(GL_DEPTH_TEST);
}

std::string ClientGL::LoadURL(const std::string& url) {
    LOG_DEBUG("Loading " << url);
    std::ifstream t(url);
    if (!t.good()) {
        LOG_ERROR("Could not open file " << url);
        throw "Could not open file!";
    }
    return std::string((std::istreambuf_iterator<char>(t)),
                 std::istreambuf_iterator<char>());
}

void ClientGL::Draw(int width, int height) {
    if (!hasModelsBeenReplicated) return;
    // LOG_DEBUG("Draw " << width << " " << height);
    glViewport(0, 0, width, height);

    glClearColor(135.0 / 255.0, 206.0 / 255.0, 235.0 / 255.0, 1);
    glClear(GL_COLOR_BUFFER_BIT);

    if (PlayerObject* localPlayer = game.GetLocalPlayer()) {
        cameraPosition = localPlayer->GetClientPosition();
        cameraRotation = localPlayer->GetLookDirection();
        // LOG_DEBUG(cameraPosition);
    }

    glUniform3fv(uniformViewerPosition, 1, glm::value_ptr(cameraPosition));

    Matrix4 viewMat = glm::lookAt(cameraPosition,
        cameraPosition + cameraRotation, Vector::Up);
    Matrix4 projMat = glm::perspective(
        glm::radians(45.0f),
        (float) width / (float) height,
        0.1f, 1000.f
    );

    glUniformMatrix4fv(uniformView, 1, GL_FALSE, glm::value_ptr(viewMat));
    glUniformMatrix4fv(uniformProj, 1, GL_FALSE, glm::value_ptr(projMat));

    for (auto& gameObjectPair : game.GetGameObjects()) {
        Object* obj = gameObjectPair.second;
        if (Model* model = obj->GetModel()) {
            // Set Model Transform
            Matrix4 transform = obj->GetTransform();
            glUniformMatrix4fv(uniformModel, 1, GL_FALSE, glm::value_ptr(transform));

            for (auto& mesh : model->meshes) {
                // Set Mesh Material
                glUniform3fv(uniformMaterial[0], 1, glm::value_ptr(mesh.material.Ka));
                glUniform3fv(uniformMaterial[1], 1, glm::value_ptr(mesh.material.Kd));
                glUniform3fv(uniformMaterial[2], 1, glm::value_ptr(mesh.material.Ks));
                glUniform1f (uniformMaterial[3], mesh.material.Ns);
                glUniform1f (uniformMaterial[4], mesh.material.Ni);
                glUniform1f (uniformMaterial[5], mesh.material.d);
                glUniform1i (uniformMaterial[6], mesh.material.illum);

                // LOG_DEBUG(meshRenderInfo[&mesh].vao << " " << meshRenderInfo[&mesh].iboCount);
                glBindVertexArray(meshRenderInfo[&mesh].vao);
                glBindBuffer(GL_ARRAY_BUFFER, 0);
                glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
                glDrawArrays(GL_TRIANGLES, 0, meshRenderInfo[&mesh].iboCount);
            }
        }
    }
}

void ClientGL::OnModelsReplicated() {
    // Setup VAOs
    ModelManager& modelManager = game.GetModelManager();
    for (auto& model : modelManager.models) {
        for (auto& mesh : model->meshes) {
            Mesh* meshp = &mesh;
            glGenVertexArrays(1, &meshRenderInfo[meshp].vao);
            glBindVertexArray(meshRenderInfo[meshp].vao);

            glGenBuffers(1, &meshRenderInfo[meshp].vbo);
            glBindBuffer(GL_ARRAY_BUFFER, meshRenderInfo[meshp].vbo);
            glBufferData(GL_ARRAY_BUFFER,
                mesh.vertices.size() * sizeof(Vertex),
                mesh.vertices.data(), GL_STATIC_DRAW
            );

            glVertexAttribPointer(positionAttributeLocation,
                3, GL_FLOAT, false, sizeof(Vertex), (const void*)offsetof(Vertex, position));
            glEnableVertexAttribArray(positionAttributeLocation);

            glVertexAttribPointer(normalAttributeLocation,
                3, GL_FLOAT, false, sizeof(Vertex), (const void*)offsetof(Vertex, normal));
            glEnableVertexAttribArray(normalAttributeLocation);

            glVertexAttribPointer(textureCoordsAttributeLocation,
                2, GL_FLOAT, false, sizeof(Vertex), (const void*)offsetof(Vertex, texCoords));
            glEnableVertexAttribArray(textureCoordsAttributeLocation);

            glGenBuffers(1, &meshRenderInfo[meshp].ibo);
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, meshRenderInfo[meshp].ibo);
            glBufferData(GL_ELEMENT_ARRAY_BUFFER,
                mesh.indices.size() * sizeof(unsigned int),
                mesh.indices.data(), GL_STATIC_DRAW);
            meshRenderInfo[meshp].iboCount = mesh.indices.size();
        }
    }

    // Load Lights Into Shader
    auto& lights = game.GetModelManager().lights;
    int numLights = lights.size();
    LOG_DEBUG("Loading " << numLights << " into uniform");
    glUniform1i(uniformNumLights, numLights);
    for (int i = 0; i < numLights; i++) {
        GLint lightPosition = GetUniformLocation(program, "u_Lights[" + std::to_string(i) + "].position");
        GLint lightColor = GetUniformLocation(program, "u_Lights[" + std::to_string(i) + "].color");
        glUniform3fv(lightPosition, 1, glm::value_ptr(lights[i].position));
        glUniform3fv(lightColor, 1, glm::value_ptr(lights[i].color));
    }
    hasModelsBeenReplicated = true;
}