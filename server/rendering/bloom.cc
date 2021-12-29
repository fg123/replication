#include "bloom.h"

GLuint BloomShader::BloomTexture(GLuint texture, float threshold, int width, int height) {
    // width /= 2;
    // height /= 2;
    glDisable(GL_DEPTH_TEST);
    bloomBuffer.SetSize(width, height);

    blurShader.Use();
    blurShader.SetTextureSize(width, height);

    bloomBuffer.Bind();
    glClearColor(0.0f, 0.0f, 0.0f, 0.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    highPassFilter.Use();
    highPassFilter.SetTextureSize(width, height);
    glUniform1f(uniformThreshold, threshold);
    highPassFilter.DrawQuad(texture, highPassFilter.standardRemapMatrix);

    texture = bloomBuffer.SwapBuffers();

    blurShader.Use();
    glUniform2f(uniformDirection, 0.0f, 1.0f);
    for (size_t i = 0; i < 50; i++) {
        bloomBuffer.Bind();
        blurShader.DrawQuad(texture, blurShader.standardRemapMatrix);

        texture = bloomBuffer.SwapBuffers();
    }
    glUniform2f(uniformDirection, 1.0f, 0.0f);
    for (size_t i = 0; i < 50; i++) {
        bloomBuffer.Bind();
        blurShader.DrawQuad(texture, blurShader.standardRemapMatrix);

        texture = bloomBuffer.SwapBuffers();
    }
    glEnable(GL_DEPTH_TEST);
    return texture;
}