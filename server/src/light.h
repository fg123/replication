#pragma once

#include "vector.h"
#include "light.h"
#include "opengl.h"

// Lights have shape types, which indicate falloff by the closest point
//   Shapes also determine the corresponding light volume.

enum class LightShape : uint32_t {
    Point = 0, // A point light
    Rectangle = 1, // A rectangle / plane
    Sun = 2, // Infinite area light
};


struct Light : public Replicable {
    LightShape shape = LightShape::Sun;

    REPLICATED_D(int, shadowMapSize, "shadowMapSize", 0);

    // For Point and Sun light

    // TODO: remove
    REPLICATED(Vector3, position, "position");

    REPLICATED(Vector3, color, "color");

    // For sun light and rectangular
    // TODO: remove once integrated into scene
    REPLICATED(Vector3, direction, "direction");

    // For rectangular emit area
    REPLICATED(Vector2, size, "size");

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
