#pragma once

// Handles bloom filter
#include "buffers.h"
#include "shader.h"

class BloomShader {

    QuadShaderProgram blurShader;

    QuadShaderProgram highPassFilter;

    GLuint uniformDirection;

    GLuint uniformThreshold;
public:
    RenderBuffer bloomBuffer;

    BloomShader() : blurShader("shaders/GaussianBlur.fs"),
            highPassFilter("shaders/BloomHighPass.fs") {
        blurShader.Use();
        uniformDirection = blurShader.GetUniformLocation("u_direction");

        highPassFilter.Use();
        uniformThreshold = highPassFilter.GetUniformLocation("u_threshold");
    }

    GLuint BloomTexture(GLuint texture, float threshold, int width, int height);
};
