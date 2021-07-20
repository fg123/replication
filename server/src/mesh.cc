#include "mesh.h"
#include "external/stb_image.h"

void Mesh::InitializeMesh() {
#ifdef BUILD_CLIENT
    glGenVertexArrays(1, &renderInfo.vao);
    glBindVertexArray(renderInfo.vao);

    glGenBuffers(1, &renderInfo.vbo);
    glBindBuffer(GL_ARRAY_BUFFER, renderInfo.vbo);
    glBufferData(GL_ARRAY_BUFFER,
        vertices.size() * sizeof(Vertex),
        vertices.data(), GL_STATIC_DRAW
    );

    glVertexAttribPointer(0,
        3, GL_FLOAT, false, sizeof(Vertex), (const void*)offsetof(Vertex, position));
    glEnableVertexAttribArray(0);

    glVertexAttribPointer(1,
        3, GL_FLOAT, false, sizeof(Vertex), (const void*)offsetof(Vertex, normal));
    glEnableVertexAttribArray(1);

    glVertexAttribPointer(2,
        2, GL_FLOAT, false, sizeof(Vertex), (const void*)offsetof(Vertex, texCoords));
    glEnableVertexAttribArray(2);

    glVertexAttribPointer(3,
        3, GL_FLOAT, false, sizeof(Vertex), (const void*)offsetof(Vertex, tangent));
    glEnableVertexAttribArray(3);

    glVertexAttribPointer(4,
        3, GL_FLOAT, false, sizeof(Vertex), (const void*)offsetof(Vertex, smoothedNormal));
    glEnableVertexAttribArray(4);

    glGenBuffers(1, &renderInfo.ibo);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, renderInfo.ibo);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER,
        indices.size() * sizeof(unsigned int),
        indices.data(), GL_STATIC_DRAW);
    renderInfo.iboCount = indices.size();
#endif
    for (size_t i = 0; i < vertices.size(); i++) {
        center += vertices[i].position;
    }
    center /= vertices.size();
}

#ifdef BUILD_CLIENT
void Texture::InitializeTexture() {
    glGenTextures(1, &textureBuffer);
    glBindTexture(GL_TEXTURE_2D, textureBuffer);

    // Texture Settings
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

    GLenum internal_fmt = (format == Texture::Format::RGB) ? GL_RGB : GL_RGBA;
    GLenum fmt = (format == Texture::Format::RGB) ? GL_RGB : GL_RGBA;
    glTexImage2D(GL_TEXTURE_2D, 0, internal_fmt, width, height, 0, fmt, GL_UNSIGNED_BYTE, data);
    glGenerateMipmap(GL_TEXTURE_2D);
}

void Light::InitializeLight() {
    if (shadowMapSize == 0) return;
    // We use SHADOW_WIDTH * 2 due to cascading shadow map and SHADOW_HEIGHT * 2

    glGenTextures(1, &shadowColorMap);
    glBindTexture(GL_TEXTURE_2D, shadowColorMap);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA,
                shadowMapSize * 2, shadowMapSize * 2, 0, GL_RGBA, GL_UNSIGNED_BYTE, NULL);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    glGenTextures(1, &shadowDepthMap);
    glBindTexture(GL_TEXTURE_2D, shadowDepthMap);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_DEPTH_COMPONENT24,
                shadowMapSize * 2, shadowMapSize * 2, 0, GL_DEPTH_COMPONENT, GL_UNSIGNED_INT, NULL);

    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    glGenFramebuffers(1, &shadowFrameBuffer);
    glBindFramebuffer(GL_FRAMEBUFFER, shadowFrameBuffer);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, shadowColorMap, 0);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_TEXTURE_2D, shadowDepthMap, 0);

    GLenum status = glCheckFramebufferStatus(GL_FRAMEBUFFER);

    if (status != GL_FRAMEBUFFER_COMPLETE) {
        LOG_ERROR("FB error, status: " << status);
    }
}

#endif