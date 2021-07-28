#pragma once

#include "vector.h"

#include "opengl.h"

enum class LightShape : uint32_t {
    Sun = 0,
    Directional = 1
};

struct Light {
    LightShape shape = LightShape::Directional;

    int shadowMapSize = 256;

    Vector3 position;
    Vector3 color;
    Vector3 direction;

#ifdef BUILD_CLIENT
    GLuint shadowFrameBuffer = 0;
    GLuint shadowDepthMap = 0;
    GLuint shadowColorMap = 0;

    Matrix4 depthBiasMVPNear;
    Matrix4 depthBiasMVPMid;
    Matrix4 depthBiasMVPFar;
#endif

    void InitializeLight();
};
