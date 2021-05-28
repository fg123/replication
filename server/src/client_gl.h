#pragma once

// Handles Client Side WebGL rendering
#include "game.h"
#include "client_shader.h"

#include <string>
#include <algorithm>

#include <GLES3/gl3.h>
#include <emscripten/html5.h>
#include <emscripten/fetch.h>

class ClientGL {
    EMSCRIPTEN_WEBGL_CONTEXT_HANDLE glContext;

    std::string canvasSelector;

    Vector3 cameraPosition;
    Vector3 cameraRotation;

    int windowWidth;
    int windowHeight;

    Game& game;

    std::vector<ShaderProgram*> shaderPrograms;

    // Drawing Maps
    std::unordered_set<Object*> opaque;
    std::map<float, Object*> transparent;
    std::unordered_set<Object*> foreground;

    DebugShaderProgram* debugShaderProgram;
    Mesh debugCube;
    Mesh debugLine;
    Mesh debugCircle;
    Mesh debugCylinder;

    Matrix4 viewMat;
    Matrix4 projMat;
public:
    ClientGL(Game& game, const char* selector);

    // Client Communication

    // Called from Game.js
    void SetupContext();

    // Called from client_main::Main()
    void SetupGL();

    void Draw(int width, int height);
    void DrawObject(Object* obj, int& lastProgram);
    void DrawObjects();

    Vector2 WorldToScreenCoordinates(Vector3 worldCoord);
};