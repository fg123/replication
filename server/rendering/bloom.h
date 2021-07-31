#pragma once

// Handles bloom filter
#include "buffers.h"
#include "shader.h"

class BloomShader {
    RenderBuffer bloomBuffer;

    QuadShaderProgram quadDrawShader;

    QuadShaderProgram highPassFilter;

    GLuint uniformDirection;

    GLuint uniformThreshold;
public:

    BloomShader() : quadDrawShader("shaders/GaussianBlur.fs"),
            highPassFilter("shaders/BloomHighPass.fs") {
        quadDrawShader.Use();
        uniformDirection = quadDrawShader.GetUniformLocation("u_direction");

        highPassFilter.Use();
        uniformThreshold = highPassFilter.GetUniformLocation("u_threshold");
    }

    GLuint BloomTexture(GLuint texture, float threshold, int width, int height);
};
