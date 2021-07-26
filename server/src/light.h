#pragma once

#include "vector.h"

#ifdef BUILD_CLIENT
    #include <GLES3/gl3.h>
    #include <GLES3/gl2ext.h>
#endif

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

    GLuint shadowFrameBuffer = 0;
    GLuint shadowDepthMap = 0;
    GLuint shadowColorMap = 0;

    Matrix4 depthBiasMVPNear;
    Matrix4 depthBiasMVPMid;
    Matrix4 depthBiasMVPFar;

    void InitializeLight();
};
