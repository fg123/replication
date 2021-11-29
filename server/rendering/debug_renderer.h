#pragma once

#include "buffers.h"
#include "vector.h"
#include "shader.h"

#include <vector>

class DebugRenderer {
    struct LineParams {
        Vector3 start;
        Vector3 end;
        Vector3 color;
        bool depthTest;
    };

    struct CubeParams {
        Matrix4 transform;
        Vector3 color;
        bool depthTest;
    };

    DebugShaderProgram* debugShaderProgram;

    Mesh debugCube;
    Mesh debugLine;

    std::vector<LineParams> lines;
    std::vector<CubeParams> cubes;

public:
    DebugRenderer();

    void DrawLine(const Vector3& start, const Vector3& end, const Vector3& color, bool depthTest = true);
    void DrawCube(const Matrix4& model, const Vector3& color, bool depthTest = true);

    void NewFrame(const Matrix4& view, const Matrix4& proj);
    void Render();
};