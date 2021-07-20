#include "client_buffers.h"
#include "client_gl.h"

void RenderBuffer::SetSize(int newWidth, int newHeight) {
    if (newWidth == width && newHeight == height) {
        return;
    }

    width = newWidth;
    height = newHeight;

    if (fbo) {
        glDeleteFramebuffers(1, &fbo);
        fbo = 0;
    }

    if (renderBufferColor) {
        glDeleteRenderbuffers(1, &renderBufferColor);
        renderBufferColor = 0;
    }

    if (renderBufferDepth) {
        glDeleteRenderbuffers(1, &renderBufferDepth);
        renderBufferDepth = 0;
    }

    if (internalTexture) {
        glDeleteTextures(1, &internalTexture);
        internalTexture = 0;
    }

    if (internalDepth) {
        glDeleteTextures(1, &internalDepth);
        internalDepth = 0;
    }

    if (internalFBO) {
        glDeleteFramebuffers(1, &internalFBO);
        internalFBO = 0;
    }

    glGenRenderbuffers(1, &renderBufferColor);
    glBindRenderbuffer(GL_RENDERBUFFER, renderBufferColor);
    // glRenderbufferStorageMultisample(GL_RENDERBUFFER, ClientGL::glLimits.MAX_SAMPLES, GL_RGBA8,
    //     width, height);
    glRenderbufferStorage(GL_RENDERBUFFER, GL_RGBA8, width, height);

    glGenRenderbuffers(1, &renderBufferDepth);
    glBindRenderbuffer(GL_RENDERBUFFER, renderBufferDepth);
    // glRenderbufferStorageMultisample(GL_RENDERBUFFER, ClientGL::glLimits.MAX_SAMPLES, GL_DEPTH_COMPONENT24,
    //     width, height);
    glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT24, width, height);

    glGenFramebuffers(1, &fbo);
    glBindFramebuffer(GL_FRAMEBUFFER, fbo);
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_RENDERBUFFER, renderBufferColor);
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, renderBufferDepth);

    GLenum status = glCheckFramebufferStatus(GL_FRAMEBUFFER);

    if (status != GL_FRAMEBUFFER_COMPLETE) {
        LOG_ERROR("Could not setup render buffer! Status: " << status);
    }

    glGenTextures(1, &internalTexture);
    glBindTexture(GL_TEXTURE_2D, internalTexture);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA,
                width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, NULL);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    glGenTextures(1, &internalDepth);
    glBindTexture(GL_TEXTURE_2D, internalDepth);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_DEPTH_COMPONENT24,
            width, height, 0, GL_DEPTH_COMPONENT, GL_UNSIGNED_INT, NULL);

    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    glGenFramebuffers(1, &internalFBO);
    glBindFramebuffer(GL_FRAMEBUFFER, internalFBO);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, internalTexture, 0);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_TEXTURE_2D, internalDepth, 0);

    status = glCheckFramebufferStatus(GL_FRAMEBUFFER);
    if (status != GL_FRAMEBUFFER_COMPLETE) {
        LOG_ERROR("Could not setup internal frame buffer! Status: " << status);
    }

}

GLuint RenderBuffer::BlitTexture() {
    glBindFramebuffer(GL_READ_FRAMEBUFFER, fbo);
    glBindFramebuffer(GL_DRAW_FRAMEBUFFER, internalFBO);
    glBlitFramebuffer(0, 0, width, height, 0, 0, width, height, GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT, GL_NEAREST);
    return internalTexture;
}

void GBuffer::SetSize(int newWidth, int newHeight) {
    if (newWidth == width && newHeight == height) {
        return;
    }

    width = newWidth;
    height = newHeight;

    if (g_depth) {
        glDeleteTextures(1, &g_depth);
        g_depth = 0;
    }

    if (g_position) {
        glDeleteTextures(1, &g_position);
        g_position = 0;
    }

    if (g_normal) {
        glDeleteTextures(1, &g_normal);
        g_normal = 0;
    }

    if (g_diffuse) {
        glDeleteTextures(1, &g_diffuse);
        g_diffuse = 0;
    }

    if (g_specular) {
        glDeleteTextures(1, &g_specular);
        g_specular = 0;
    }

    if (fbo) {
        glDeleteFramebuffers(1, &fbo);
        fbo = 0;
    }

    glGenTextures(1, &g_position);
    glBindTexture(GL_TEXTURE_2D, g_position);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA16F,
                width, height, 0, GL_RGBA, GL_FLOAT, NULL);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    glGenTextures(1, &g_normal);
    glBindTexture(GL_TEXTURE_2D, g_normal);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA16F,
                width, height, 0, GL_RGBA, GL_FLOAT, NULL);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    glGenTextures(1, &g_diffuse);
    glBindTexture(GL_TEXTURE_2D, g_diffuse);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA,
                width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, NULL);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    glGenTextures(1, &g_specular);
    glBindTexture(GL_TEXTURE_2D, g_specular);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA,
                width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, NULL);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);


    glGenTextures(1, &g_depth);
    glBindTexture(GL_TEXTURE_2D, g_depth);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_DEPTH_COMPONENT24,
                width, height, 0, GL_DEPTH_COMPONENT, GL_UNSIGNED_INT, NULL);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    // glGenRenderbuffers(1, &g_depth);
    // glBindRenderbuffer(GL_RENDERBUFFER, g_depth);
    // glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT24, width, height);

    glGenFramebuffers(1, &fbo);
    glBindFramebuffer(GL_FRAMEBUFFER, fbo);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, g_position, 0);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT1, GL_TEXTURE_2D, g_normal, 0);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT2, GL_TEXTURE_2D, g_diffuse, 0);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT3, GL_TEXTURE_2D, g_specular, 0);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_TEXTURE_2D, g_depth, 0);
    // glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, g_depth);

    GLenum attachments[] = {
        GL_COLOR_ATTACHMENT0,
        GL_COLOR_ATTACHMENT1,
        GL_COLOR_ATTACHMENT2,
        GL_COLOR_ATTACHMENT3
    };
    glDrawBuffers(4, attachments);

    GLenum status = glCheckFramebufferStatus(GL_FRAMEBUFFER);
    if (status != GL_FRAMEBUFFER_COMPLETE) {
        LOG_ERROR("Could not setup gbuffer! Status: " << status);
    }
}