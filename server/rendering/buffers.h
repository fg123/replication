#pragma once

#include "opengl.h"

class RenderBuffer {
    // Internally we use another FBO to blit over when we want a texture
    GLuint internalFBO = 0;
    GLuint internalTexture = 0;

public:

    GLuint internalDepth = 0;

    GLuint fbo = 0;
    GLuint textureColor = 0;
    GLuint textureDepth = 0;

    int width = 0;
    int height = 0;

    RenderBuffer() {}
    void SetSize(int width, int height);

    void Bind() {
        glBindFramebuffer(GL_FRAMEBUFFER, fbo);
        glViewport(0, 0, width, height);
    }

    // warning: will override current fbo
    GLuint BlitTexture();

    GLuint SwapBuffers();
};

struct GBuffer {
    GLuint fbo = 0;

    GLuint g_depth = 0;

    GLuint g_position = 0;
    GLuint g_normal = 0;
    GLuint g_diffuse = 0;
    GLuint g_specular = 0;

    int width = 0;
    int height = 0;

    void SetSize(int width, int height);

    void Bind() {
        glBindFramebuffer(GL_FRAMEBUFFER, fbo);
        glViewport(0, 0, width, height);
    }
};

struct DefaultFrameBuffer : public GBuffer {
    // Shadow both methods, basically an injected interface
    void SetSize(int newWidth, int newHeight) {
        width = newWidth;
        height = newHeight;
    }
};

struct GLLimits {
    GLint MAX_SAMPLES = 0;
};
