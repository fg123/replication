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

    struct SphereParams {
        Vector3 center;
        float radius;
        Vector3 color;
        bool depthTest;
    };


    DebugShaderProgram* debugShaderProgram;

    Mesh debugCube;
    Mesh debugLine;
    Mesh debugSphere;

    std::vector<LineParams> lines;
    std::vector<CubeParams> cubes;
    std::vector<SphereParams> spheres;

public:
    DebugRenderer();

    void Initialize();

    void DrawCube(const AABB& cube, const Vector3& color, bool depthTest = true);
    void DrawCube(const Vector4* points, const Vector3& color, bool depthTest = true);

    void DrawSphere(const Vector3& center, float radius, const Vector3& color, bool depthTest = true);
    void DrawLine(const Vector3& start, const Vector3& end, const Vector3& color, bool depthTest = true);
    void DrawCube(const Matrix4& model, const Vector3& color, bool depthTest = true);

    void NewFrame(const Matrix4& view, const Matrix4& proj);
    void Render(Vector3 cameraPos);
};