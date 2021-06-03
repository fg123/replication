#pragma once

// Handles Client Side WebGL rendering
#include "game.h"
#include "client_shader.h"

#include <string>
#include <algorithm>

#include <GLES3/gl3.h>
#include <emscripten/html5.h>
#include <emscripten/fetch.h>

struct DrawParams {
    ObjectID id;
    Mesh* mesh = nullptr;
    Matrix4 transform;
};

struct DrawLayer {
    std::vector<DrawParams> opaque;
    std::map<float, DrawParams> transparent;

    void Clear() {
        opaque.clear();
        transparent.clear();
    }
};

class ClientGL {
    EMSCRIPTEN_WEBGL_CONTEXT_HANDLE glContext;

    std::string canvasSelector;

    Vector3 cameraPosition;
    Vector3 cameraRotation;

    int windowWidth;
    int windowHeight;

    std::vector<ShaderProgram*> shaderPrograms;

    // Drawing Maps
    DrawLayer foregroundLayer;
    DrawLayer backgroundLayer;

    DebugShaderProgram* debugShaderProgram;
    ShadowMapShaderProgram* shadowMapShaderProgram;
    QuadShaderProgram* quadDrawShaderProgram;

    Mesh debugCube;
    Mesh debugLine;
    Mesh debugCircle;
    Mesh debugCylinder;

    Matrix4 viewMat;
    Matrix4 projMat;
public:
    Game& game;

    ClientGL(Game& game, const char* selector);

    // Client Communication

    // Called from Game.js
    void SetupContext();

    // Called from client_main::Main()
    void SetupGL();

    void Draw(int width, int height);
    void DrawDebugLine(const Vector3& color, const Vector3& from, const Vector3& to);
    void DrawObject(DrawParams& param, int& lastProgram);
    void DrawDebug(Object* obj);
    void DrawObjects();

    Vector2 WorldToScreenCoordinates(Vector3 worldCoord);
};