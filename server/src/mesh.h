#pragma once

#include "glm.h"
#include "replicable.h"
#include "vector.h"

#include <string>
#include <vector>

// Handles Meshes and Vertex Data for Rendering
// These structs can be replicable but we want to keep them POD
//   so we specify specializations

struct Vertex {
    Vector3 position;
    Vector3 normal;
    Vector2 texCoords;
    Vector3 tangent;
};

struct Light {
    Vector3 position;
    Vector3 color;
};
template<>
inline void SerializeDispatch(Light& object, JSONWriter& obj) {
    obj.StartArray();
    obj.Double(object.position.x);
    obj.Double(object.position.y);
    obj.Double(object.position.z);
    obj.Double(object.color.x);
    obj.Double(object.color.y);
    obj.Double(object.color.z);
    obj.EndArray();
}

template<>
inline void ProcessReplicationDispatch(Light& object, json& obj) {
    object.position.x = obj[0].GetDouble();
    object.position.y = obj[1].GetDouble();
    object.position.z = obj[2].GetDouble();
    object.color.x = obj[3].GetDouble();
    object.color.y = obj[4].GetDouble();
    object.color.z = obj[5].GetDouble();
}

struct Texture {
    unsigned char* data = nullptr;
    int width = 0;
    int height = 0;
};

struct Material {
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
    float d;
    // Illumination
    int illum;
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
};

class Mesh {
public:
	std::string name;
    std::vector<Vertex> vertices;
    std::vector<unsigned int> indices;
    Material material;
};
