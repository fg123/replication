#include "asset-manager.h"
#include "logging.h"
#include "timer.h"

#include "external/OBJ_Loader.h"

#define STB_IMAGE_IMPLEMENTATION
#include "external/stb_image.h"

#define DR_WAV_IMPLEMENTATION
#include "external/dr_wav.h"

template<typename T>
Vector3 ToVec3(const T& vec) {
    return { vec.X, vec.Y, vec.Z };
}

template<typename T>
Vector2 ToVec2(const T& vec) {
    return { vec.X, vec.Y };
}

// Replaces \\ with /
std::string StandardizePath(const std::string& str) {
    if (str.size() < 1)
        return "";

    std::string out;
    out.reserve(str.size());
    size_t i = 0;
    if (str.substr(0, 4) == "..\\") {
        i = 4;
    }
    for (; i < str.size(); i++) {
        if (i < str.size() - 1 &&
            str[i] == '\\' &&
            str[i + 1] == '\\'
        ) {
            out += '/';
            i++;
        }
        else {
            out += str[i];
        }
    }
    return out;
}

Vector3 Average(const std::vector<Vector3>& vec) {
    if (vec.empty()) return Vector3();

    Vector3 result;
    for (auto& t : vec) {
        result += t;
    }
    return result / (float) vec.size();
}

ModelID AssetManager::LoadModel(const std::string& name, const std::string& path, std::istream& stream) {
    Time start = Timer::Now();

    objl::Loader loader;
    loader.LoadStream(path, stream);

    Model* model = new Model;
    ModelID id = models.size();
    model->id = id;
    models.push_back(model);

    modelMap[name] = model;

    for (auto& loadedMesh : loader.LoadedMeshes) {
        Mesh& mesh = model->meshes.emplace_back();
        mesh.name = loadedMesh.MeshName;
        mesh.indices = loadedMesh.Indices;
        std::vector<std::vector<Vector3>> tangents { loadedMesh.Vertices.size() };

        for (auto& loadedVertex : loadedMesh.Vertices) {
            Vertex& vertex = mesh.vertices.emplace_back();
            vertex.position = ToVec3(loadedVertex.Position);
            vertex.normal = ToVec3(loadedVertex.Normal);
            vertex.texCoords = ToVec2(loadedVertex.TextureCoordinate);
        }

        // Calculate Tangents for Each Triangle
        for (size_t i = 0; i < mesh.indices.size(); i += 3) {
            size_t ai = mesh.indices[i];
            size_t bi = mesh.indices[i + 1];
            size_t ci = mesh.indices[i + 2];

            Vertex& a = mesh.vertices[ai];
            Vertex& b = mesh.vertices[bi];
            Vertex& c = mesh.vertices[ci];

            Vector3 edge1 = b.position - a.position;
            Vector3 edge2 = c.position - a.position;
            Vector2 deltaUV1 = b.texCoords - a.texCoords;
            Vector2 deltaUV2 = c.texCoords - a.texCoords;
            float f = 1.0f / (deltaUV1.x * deltaUV2.y - deltaUV2.x * deltaUV1.y);
            Vector3 tangent = {
                -f * (deltaUV2.y * edge1.x - deltaUV1.y * edge2.x),
                -f * (deltaUV2.y * edge1.y - deltaUV1.y * edge2.y),
                -f * (deltaUV2.y * edge1.z - deltaUV1.y * edge2.z)
            };
            tangents[ai].push_back(tangent);
            tangents[bi].push_back(tangent);
            tangents[ci].push_back(tangent);
        }

        // Average Tangents for Each Vertex
        for (size_t i = 0; i < mesh.vertices.size(); i++) {
            mesh.vertices[i].tangent = Average(tangents[i]);
        }

        // Use Default Shader
    #ifdef BUILD_CLIENT
        DefaultMaterial* material = new DefaultMaterial;

        material->name = loadedMesh.MeshMaterial.name;
        material->Ka = ToVec3(loadedMesh.MeshMaterial.Ka);
        material->Kd = ToVec3(loadedMesh.MeshMaterial.Kd);
        material->Ks = ToVec3(loadedMesh.MeshMaterial.Ks);
        material->Ns = loadedMesh.MeshMaterial.Ns;
        material->Ni = loadedMesh.MeshMaterial.Ni;
        material->d = loadedMesh.MeshMaterial.d;
        material->illum = loadedMesh.MeshMaterial.illum;

        // Only Client Cares about Materials
        material->map_Ka = LoadTexture(StandardizePath(loadedMesh.MeshMaterial.map_Ka), Texture::Format::RGB);
        material->map_Kd = LoadTexture(StandardizePath(loadedMesh.MeshMaterial.map_Kd), Texture::Format::RGB);
        material->map_Ks = LoadTexture(StandardizePath(loadedMesh.MeshMaterial.map_Ks), Texture::Format::RGB);
        material->map_Ns = LoadTexture(StandardizePath(loadedMesh.MeshMaterial.map_Ns), Texture::Format::RGB);
        material->map_d = LoadTexture(StandardizePath(loadedMesh.MeshMaterial.map_d), Texture::Format::RGB);
        material->map_bump = LoadTexture(StandardizePath(loadedMesh.MeshMaterial.map_bump), Texture::Format::RGB);
        material->map_refl = LoadTexture(StandardizePath(loadedMesh.MeshMaterial.refl), Texture::Format::RGB);
        mesh.material = material;

        mesh.InitializeMesh();
    #endif
    }
    Time end = Timer::Now();
    LOG_INFO("Loaded " << name << " in " << TimeToString(end - start));
    return id;
}

#ifdef BUILD_CLIENT
Texture* AssetManager::LoadTexture(const std::string& path, Texture::Format format) {
    if (path.empty()) return nullptr;
    if (textures.find(path) == textures.end()) {
        Time start = Timer::Now();
        int width, height, nrChannels;
        stbi_set_flip_vertically_on_load(true);
        int channels = (format == Texture::Format::RGB) ? 3 : 4;
        unsigned char *data = stbi_load((path).c_str(), &width, &height, &nrChannels, channels);
        if (!data) {
            LOG_ERROR("Could not load texture " << path);
            throw std::runtime_error("Could not load texture");
        }
        Texture* tex = new Texture;
        tex->data = data;
        tex->width = width;
        tex->height = height;
        tex->format = format;
        // LOG_DEBUG("Loaded texture " << path);
        // LOG_DEBUG("Sample: " << (int) data[0] << " " << (int) data[1] << " " << (int) data[2] << " "
        //                      << (int) data[3] << " " << (int) data[4] << " " << (int) data[5]);
        tex->InitializeTexture();

        stbi_image_free(tex->data);
        tex->data = nullptr;

        textures[path] = tex;
        Time end = Timer::Now();
        LOG_INFO("Loaded " << path << " in " << TimeToString(end - start));
        return tex;
    }
    return textures[path];
}

Audio* AssetManager::LoadAudio(const std::string& name, const std::string& path) {
    if (path.empty()) return nullptr;
    if (sounds.find(name) == sounds.end()) {
        Time start = Timer::Now();
        unsigned int channels;
        unsigned int sampleRate;
        drwav_uint64 totalPCMFrameCount;
        drwav_int16* pSampleData = drwav_open_file_and_read_pcm_frames_s16(path.c_str(),
            &channels, &sampleRate, &totalPCMFrameCount, NULL);
        if (!pSampleData) {
            LOG_ERROR("Could not load audio " << path);
            throw std::runtime_error("Could not load audio");
        }

        Audio* sound = new Audio;
        sound->data = pSampleData;
        sound->channels = channels;
        sound->sampleRate = sampleRate;
        sound->frames = totalPCMFrameCount;

        sound->InitializeAudio();
        drwav_free(pSampleData, NULL);
        sound->data = nullptr;

        sounds[name] = sound;
        Time end = Timer::Now();
        LOG_INFO("Loaded " << path << " in " << TimeToString(end - start));
        return sound;
    }
    return sounds[name];
}

#endif