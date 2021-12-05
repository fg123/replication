#include "debug_renderer.h"


void SetupMesh(Mesh& mesh, const std::vector<float>& verts, const std::vector<unsigned int>& indices) {
    glGenVertexArrays(1, &mesh.renderInfo.vao);
    glBindVertexArray(mesh.renderInfo.vao);

    glGenBuffers(1, &mesh.renderInfo.vbo);
    glBindBuffer(GL_ARRAY_BUFFER, mesh.renderInfo.vbo);
    glBufferData(GL_ARRAY_BUFFER,
        verts.size() * sizeof(float),
        verts.data(), GL_STATIC_DRAW
    );

    glVertexAttribPointer(0,
        3, GL_FLOAT, false, 3 * sizeof(float), (const void*)0);
    glEnableVertexAttribArray(0);

    glGenBuffers(1, &mesh.renderInfo.ibo);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.renderInfo.ibo);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER,
        indices.size() * sizeof(unsigned int),
        indices.data(), GL_STATIC_DRAW);
    mesh.renderInfo.iboCount = indices.size();
}


DebugRenderer::DebugRenderer() {
    debugShaderProgram = new DebugShaderProgram;

    // Setup Cube
    std::vector<float> cubeVerts = {
        -0.5f, -0.5f, -0.5f,
        -0.5f, -0.5f,  0.5f,
        -0.5f,  0.5f, -0.5f,
        -0.5f,  0.5f,  0.5f,
         0.5f, -0.5f, -0.5f,
         0.5f, -0.5f,  0.5f,
         0.5f,  0.5f, -0.5f,
         0.5f,  0.5f,  0.5f,
    };
    std::vector<unsigned int> cubeIndices = {
        0, 1, 1, 3, 3, 2, 2, 0,
        4, 5, 5, 7, 7, 6, 6, 4,
        0, 4, 1, 5, 2, 6, 3, 7
    };
    SetupMesh(debugCube, cubeVerts, cubeIndices);

    // Setup Line
    std::vector<float> lineVerts = {
        0, 0, 0, 0, 0, -1
    };
    std::vector<unsigned int> lineIndices = {
        0, 1
    };
    SetupMesh(debugLine, lineVerts, lineIndices);

    std::vector<float> circleVerts;
    std::vector<unsigned int> circleIndices;
    const int numCircleVerts = 256;
    for (size_t i = 0; i < numCircleVerts; i++) {
        float angle = (float)i / (float)numCircleVerts * 2.0f * glm::pi<float>();
        circleVerts.push_back(cos(angle));
        circleVerts.push_back(sin(angle));
        circleVerts.push_back(0);
        if (i > 0) {
            circleIndices.push_back(i - 1);
            circleIndices.push_back(i);
        }
    }
    SetupMesh(debugSphere, circleVerts, circleIndices);
}

void DebugRenderer::DrawLine(const Vector3& start, const Vector3& end, const Vector3& color, bool depthTest) {
    LineParams& params = lines.emplace_back();
    params.start = start;
    params.end = end;
    params.color = color;
    params.depthTest = depthTest;
}

void DebugRenderer::DrawCube(const Matrix4& transform, const Vector3& color, bool depthTest) {
    CubeParams& params = cubes.emplace_back();
    params.transform = transform;
    params.color = color;
    params.depthTest = depthTest;
}

void DebugRenderer::DrawSphere(const Vector3& center, float radius, const Vector3& color, bool depthTest) {
    SphereParams& params = spheres.emplace_back();
    params.center = center;
    params.radius = radius;
    params.color = color;
    params.depthTest = depthTest;
}

void DebugRenderer::NewFrame(const Matrix4& view, const Matrix4& proj) {
    debugShaderProgram->Use();
    debugShaderProgram->PreDraw(Vector3{}, view, proj);
}

void DebugRenderer::Render(Vector3 cameraPos) {
    debugShaderProgram->Use();
    for (const LineParams& line : lines) {
        if (line.depthTest) {
            glEnable(GL_DEPTH_TEST);
        } else {
            glDisable(GL_DEPTH_TEST);
        }
        debugShaderProgram->SetColor(line.color);
        float length = glm::distance(line.start, line.end);

        Matrix4 model = glm::translate(line.start) *
            glm::transpose(glm::toMat4(DirectionToQuaternion(line.end - line.start))) *
            glm::scale(Vector3(length));
        debugShaderProgram->Draw(model, &debugLine);
    }
    for (const CubeParams& cube : cubes) {
        if (cube.depthTest) {
            glEnable(GL_DEPTH_TEST);
        } else {
            glDisable(GL_DEPTH_TEST);
        }
        debugShaderProgram->SetColor(cube.color);
        debugShaderProgram->Draw(cube.transform, &debugCube);
    }
    for (const SphereParams& sphere : spheres) {
        if (sphere.depthTest) {
            glEnable(GL_DEPTH_TEST);
        } else {
            glDisable(GL_DEPTH_TEST);
        }
        debugShaderProgram->SetColor(sphere.color);
        // Setup the transform to always point towards the camera
        Matrix4 model = glm::translate(sphere.center) *
            glm::transpose(glm::toMat4(DirectionToQuaternion(cameraPos - sphere.center))) *
            glm::scale(Vector3(sphere.radius));
        debugShaderProgram->Draw(model, &debugSphere);
    }
    lines.clear();
    cubes.clear();
}