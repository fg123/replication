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

    glGenBuffers(1, &renderInfo.ibo);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, renderInfo.ibo);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER,
        indices.size() * sizeof(unsigned int),
        indices.data(), GL_STATIC_DRAW);
    renderInfo.iboCount = indices.size();
#endif
}

#ifdef BUILD_CLIENT
void Texture::InitializeTexture() {
    glGenTextures(1, &textureBuffer);
    glBindTexture(GL_TEXTURE_2D, textureBuffer);

    // Texture Settings
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

    GLenum internal_fmt = (format == Texture::Format::RGB) ? GL_RGB8 : GL_RGBA8;
    GLenum fmt = (format == Texture::Format::RGB) ? GL_RGB : GL_RGBA;
    glTexImage2D(GL_TEXTURE_2D, 0, internal_fmt, width, height, 0, fmt, GL_UNSIGNED_BYTE, data);
    glGenerateMipmap(GL_TEXTURE_2D);

    stbi_image_free(data);
    data = nullptr;
}
#endif