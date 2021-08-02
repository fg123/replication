#include "bloom.h"

GLuint BloomShader::BloomTexture(GLuint texture, float threshold, int width, int height) {
    width /= 4;
    height /= 4;
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

    texture = bloomBuffer.BlitTexture();

    blurShader.Use();
    glUniform2f(uniformDirection, 0.0f, 1.0f);
    for (size_t i = 0; i < 4; i++) {
        bloomBuffer.Bind();
        blurShader.DrawQuad(texture, blurShader.standardRemapMatrix);

        texture = bloomBuffer.BlitTexture();
    }
    glUniform2f(uniformDirection, 1.0f, 0.0f);
    for (size_t i = 0; i < 4; i++) {
        bloomBuffer.Bind();
        blurShader.DrawQuad(texture, blurShader.standardRemapMatrix);

        texture = bloomBuffer.BlitTexture();
    }
    glEnable(GL_DEPTH_TEST);
    return bloomBuffer.BlitTexture();
}