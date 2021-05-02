#pragma once

// Handles Client Side WebGL rendering
#include "game.h"

#include <string>
#include <algorithm>

#include <GLES3/gl3.h>
#include <emscripten/html5.h>
#include <emscripten/fetch.h>

struct MeshRenderInfo {
    GLuint vao;
    GLuint vbo;
    GLuint ibo;
    size_t iboCount;
};

class ClientGL {
    EMSCRIPTEN_WEBGL_CONTEXT_HANDLE glContext;

    std::string canvasSelector;

    // Attribute Locations
    GLint positionAttributeLocation;
    GLint normalAttributeLocation;
    GLint textureCoordsAttributeLocation;

    GLint uniformProj;
    GLint uniformView;
    GLint uniformModel;
    GLint uniformResolution;

    Vector3 cameraPosition;
    Vector3 cameraRotation;

    Game& game;

    std::unordered_map<Mesh*, MeshRenderInfo> meshRenderInfo;
    bool hasModelsBeenReplicated = false;


    std::string LoadURL(const std::string& url);
public:
    ClientGL(Game& game, const char* selector);

    // Client Communication

    // Called from Game.js
    void SetupContext();

    // Called from client_main::Main()
    void SetupGL();

    void Draw(int width, int height);
    void OnModelsReplicated();
};