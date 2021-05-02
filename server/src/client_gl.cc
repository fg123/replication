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


void ClientGL::SetupGL() {
    // Download Shaders
    std::string vertexShaderData = LoadURL("shaders/VertexShader.vert");
    std::string fragmentShaderData = LoadURL("shaders/FragmentShader.frag");
    GLuint vertexShader = CreateShader(vertexShaderData, GL_VERTEX_SHADER);
    GLuint fragmentShader = CreateShader(fragmentShaderData, GL_FRAGMENT_SHADER);
    GLuint program = CreateProgram({ vertexShader, fragmentShader });
    glUseProgram(program);

    positionAttributeLocation = glGetAttribLocation(program, "v_position");
    if (positionAttributeLocation < 0) {
        LOG_ERROR("Could not find positionAttributeLocation " << positionAttributeLocation);
    }
    normalAttributeLocation = glGetAttribLocation(program, "v_normal");
    if (normalAttributeLocation < 0) {
        LOG_ERROR("Could not find normalAttributeLocation " << normalAttributeLocation);
    }

    textureCoordsAttributeLocation = glGetAttribLocation(program, "v_texCoords");
    if (textureCoordsAttributeLocation < 0) {
        LOG_ERROR("Could not find textureCoordsAttributeLocation " << textureCoordsAttributeLocation);
    }

    uniformProj = glGetUniformLocation(program, "Projection");
    uniformView = glGetUniformLocation(program, "View");
    uniformModel = glGetUniformLocation(program, "Model");
    // uniformResolution = glGetUniformLocation(program, "Resolution");

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
    // glUniform2f(uniformResolution, (float) width, (float) height);

    glClearColor(135.0 / 255.0, 206.0 / 255.0, 235.0 / 255.0, 1);
    glClear(GL_COLOR_BUFFER_BIT);

    if (PlayerObject* localPlayer = game.GetLocalPlayer()) {
        cameraPosition = localPlayer->GetClientPosition();
        cameraRotation = localPlayer->GetLookDirection();
        // LOG_DEBUG(cameraPosition);
    }
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
        Matrix4 transform = obj->GetTransform();
        // LOG_DEBUG(transform);
        glUniformMatrix4fv(uniformModel, 1, GL_FALSE, glm::value_ptr(transform));
        if (Model* model = obj->GetModel()) {
            for (auto& mesh : model->meshes) {
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

            // GLfloat* buffer = new GLfloat[6 * mesh.vertices.size()];
            // size_t i = 0;
            // for (auto& vert : mesh.vertices) {
            //     buffer[i++] = vert.position.x;
            //     buffer[i++] = vert.position.y;
            //     buffer[i++] = vert.position.z;
            //     buffer[i++] = vert.normal.x;
            //     buffer[i++] = vert.normal.y;
            //     buffer[i++] = vert.normal.z;
            // }
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
    hasModelsBeenReplicated = true;
}