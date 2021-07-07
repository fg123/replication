#pragma once

#include "glm.h"
#include "replicable.h"
#include "vector.h"

#include <string>
#include <vector>

#ifdef BUILD_CLIENT
    #include <GLES3/gl3.h>
    #include <GLES3/gl2ext.h>

const unsigned int SHADOW_WIDTH = 1024, SHADOW_HEIGHT = 1024;

#endif

// Handles Meshes and Vertex Data for Rendering
// These structs can be replicable but we want to keep them POD
//   so we specify specializations

struct Vertex {
    Vector3 position;
    Vector3 normal;
    Vector2 texCoords;
    Vector3 tangent;
    Vector3 smoothedNormal;

    Vertex() {}
    Vertex(float x, float y, float z) : position(x, y, z) {}
    Vertex(float x, float y, float z,
           float nx, float ny, float nz) : position(x, y, z),
            normal(nx, ny, nz) {}
};

#ifdef BUILD_CLIENT
struct Light {
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

template<>
inline void SerializeDispatch(Light& object, JSONWriter& obj) {
    obj.StartArray();
    obj.Double(object.position.x);
    obj.Double(object.position.y);
    obj.Double(object.position.z);
    obj.Double(object.color.r);
    obj.Double(object.color.g);
    obj.Double(object.color.b);
    obj.Double(object.direction.r);
    obj.Double(object.direction.g);
    obj.Double(object.direction.b);
    obj.EndArray();
}

template<>
inline void ProcessReplicationDispatch(Light& object, json& obj) {
    object.position.x = obj[0].GetDouble();
    object.position.y = obj[1].GetDouble();
    object.position.z = obj[2].GetDouble();
    object.color.r = obj[3].GetDouble();
    object.color.g = obj[4].GetDouble();
    object.color.b = obj[5].GetDouble();
    object.direction.x = obj[6].GetDouble();
    object.direction.y = obj[7].GetDouble();
    object.direction.z = obj[8].GetDouble();
}

struct Texture {
    unsigned char* data = nullptr;
    int width = 0;
    int height = 0;
    enum class Format {
        RGB,
        RGBA
    } format = Format::RGB;

    GLuint textureBuffer;

    void InitializeTexture();
};

struct Material {
    virtual int GetShaderProgram() = 0;
    virtual bool IsTransparent() = 0;
};

struct DefaultMaterial : public Material {
    // Material Name
    std::string name;
    // Ambient Color
    Vector3 Ka;
    // Diffuse Color
    Vector3 Kd;
    // Specular Color
    Vector3 Ks;
    // Specular Exponent
    float Ns;
    // Optical Density
    float Ni;
    // Dissolve
    float d = 1.0;
    // Illumination
    int illum = 0;
    // Ambient Texture Map
    Texture* map_Ka = nullptr;
    // Diffuse Texture Map
    Texture* map_Kd = nullptr;
    // Specular Texture Map
    Texture* map_Ks = nullptr;
    // Specular Hightlight Map
    Texture* map_Ns = nullptr;
    // Alpha Texture Map
    Texture* map_d = nullptr;
    // Bump Map
    Texture* map_bump = nullptr;
    // Reflective Map
    Texture* map_refl = nullptr;

    int GetShaderProgram() override { return 0; }
    bool IsTransparent() override {
        return illum == -1 || d < 1.0f || map_d != nullptr;
    }
};
#endif

#ifdef BUILD_CLIENT
struct MeshRenderInfo {
    GLuint vao;
    GLuint vbo;
    GLuint ibo;
    size_t iboCount;
};
#endif
class Mesh {
public:
	std::string name;
    std::vector<Vertex> vertices;
    std::vector<unsigned int> indices;

    Vector3 center;
#ifdef BUILD_CLIENT
    Material* material = nullptr;
    MeshRenderInfo renderInfo;
#endif

    void InitializeMesh();
};
