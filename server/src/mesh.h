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
};

template<>
inline void SerializeDispatch(Vertex& object, JSONWriter& obj) {
    obj.StartArray();
    obj.Double(object.position.x);
    obj.Double(object.position.y);
    obj.Double(object.position.z);
    obj.Double(object.normal.x);
    obj.Double(object.normal.y);
    obj.Double(object.normal.z);
    obj.Double(object.texCoords.x);
    obj.Double(object.texCoords.y);
    obj.EndArray();
}

template<>
inline void ProcessReplicationDispatch(Vertex& object, json& obj) {
    object.position.x = obj[0].GetDouble();
    object.position.y = obj[1].GetDouble();
    object.position.z = obj[2].GetDouble();
    object.normal.x = obj[3].GetDouble();
    object.normal.y = obj[4].GetDouble();
    object.normal.z = obj[5].GetDouble();
    object.texCoords.x = obj[6].GetDouble();
    object.texCoords.y = obj[7].GetDouble();
}

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

struct Material : public Replicable {
    // Material Name
    REPLICATED(std::string, name, "name");
    // Ambient Color
    REPLICATED(Vector3, Ka, "Ka");
    // Diffuse Color
    REPLICATED(Vector3, Kd, "Kd");
    // Specular Color
    REPLICATED(Vector3, Ks, "Ks");
    // Specular Exponent
    REPLICATED(float, Ns, "Ns");
    // Optical Density
    REPLICATED(float, Ni, "Ni");
    // Dissolve
    REPLICATED(float, d, "d");
    // Illumination
    REPLICATED(int, illum, "illum");
    // Ambient Texture Map
    REPLICATED(std::string, map_Ka, "map_Ka");
    // Diffuse Texture Map
    REPLICATED(std::string, map_Kd, "map_Kd");
    // Specular Texture Map
    REPLICATED(std::string, map_Ks, "map_Ks");
    // Specular Hightlight Map
    REPLICATED(std::string, map_Ns, "map_Ns");
    // Alpha Texture Map
    REPLICATED(std::string, map_d, "map_d");
    // Bump Map
    REPLICATED(std::string, map_bump, "map_bump");
};

class Mesh : public Replicable {
public:
	REPLICATED(std::string, name, "name");
    REPLICATED(std::vector<Vertex>, vertices, "vertices");
    REPLICATED(std::vector<unsigned int>, indices, "indices");
    REPLICATED(Material, material, "material");

    // std::vector<Texture> textures;
    // TODO: material
};
