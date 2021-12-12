#pragma once

// Handles Client Side WebGL rendering
#include "game.h"
#include "shader.h"
#include "buffers.h"
#include "deferred_renderer.h"
#include "map.h"

#include <string>
#include <algorithm>

#include "opengl.h"

#include <emscripten/html5.h>
#include <emscripten/fetch.h>

const unsigned int MINIMAP_WIDTH = 512, MINIMAP_HEIGHT = 512;

struct DrawLayerOptions {
    bool drawBehind = true;
    bool drawBackground = true;
    bool drawForeground = true;

    bool drawTransparent = true;
    bool drawOpaque = true;
};

class ClientGL {
    EMSCRIPTEN_WEBGL_CONTEXT_HANDLE glContext;

    std::string canvasSelector;

    Vector3 cameraPosition;
    Vector3 cameraRotation;

    int windowWidth;
    int windowHeight;

    // Drawing Maps
    DrawLayer foregroundLayer;
    DrawLayer backgroundLayer;
    DrawLayer behindPlayerLayer;
    DrawLayer minimapLayer;

    GLuint minimapFBO = 0;
    GLuint minimapTexture = 0;
    Mesh* minimapMarker;
    Texture* skydomeTexture;

    DebugShaderProgram* debugShaderProgram;

    // Simple Quad
    QuadShaderProgram* quadDrawShaderProgram;

    // Handles the circle algorithm
    QuadShaderProgram* minimapShaderProgram;

    // Simple antialiasing
    QuadShaderProgram* antialiasShaderProgram;

    Mesh* debugCube;
    Mesh* debugLine;
    Mesh* debugCircle;
    Mesh* debugCylinder;

    Matrix4 viewMat;
    Matrix4 projMat;

    // Draw Steps
    void SetupDrawingLayers();
    void RenderMinimap();
    void AddMeshToLayer(Object* obj, Mesh* mesh, DrawLayer* layer,
        const Vector3& centerPt);

public:

    static GLLimits glLimits;

    Game& game;

    // We create an instance for each, because switching internal buffer
    //   sizes are expensive, as it requires a reallocation.
    DeferredRenderer worldRenderer;
    DeferredRenderer minimapRenderer;
    DefaultFrameBuffer defaultFrameBuffer;

    ClientGL(Game& game, const char* selector);

    // Client Communication

    // Called from Game.js
    void SetupContext();

    // Called from client_main::Main()
    void SetupGL();

    void Draw(int width, int height);
    void DrawDebugLine(const Vector3& color, const Vector3& from, const Vector3& to);
    void DrawDebug(Object* obj);

    void SetGLCullFace(GLenum setting);
    Vector2 WorldToScreenCoordinates(Vector3 worldCoord);

};