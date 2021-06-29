#pragma once

// Handles Client Side WebGL rendering
#include "game.h"
#include "client_shader.h"

#include <string>
#include <algorithm>

#include <GLES3/gl3.h>
#include <emscripten/html5.h>
#include <emscripten/fetch.h>

const unsigned int MINIMAP_WIDTH = 512, MINIMAP_HEIGHT = 512;

struct DrawParams {
    ObjectID id;
    Mesh* mesh = nullptr;
    Matrix4 transform;
    bool castShadows;
    bool hasOutline;
};

struct DrawLayer {
    // std::map<float, std::vector<DrawParams>> opaque;
    std::map<Material*, std::vector<DrawParams>> opaque;
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
    DrawLayer behindPlayerLayer;

    GLuint minimapFBO = 0;
    GLuint minimapTexture = 0;
    Mesh minimapMarker;

    DebugShaderProgram* debugShaderProgram;
    ShadowMapShaderProgram* shadowMapShaderProgram;
    QuadShaderProgram* quadDrawShaderProgram;
    MinimapShaderProgram* minimapShaderProgram;

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

    void DrawShadowObjects(DrawLayer& layer);
    void DrawObjects(bool drawBehind);

    Vector2 WorldToScreenCoordinates(Vector3 worldCoord);
};