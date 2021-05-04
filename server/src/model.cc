#include "model.h"
#include "logging.h"

#include "external/OBJ_Loader.h"

// void ProcessMesh(aiMesh* mesh, const aiScene* scene, Model* model) {
//     Mesh& newMesh = model->meshes.emplace_back();

//     for (size_t i = 0; i < mesh->mNumVertices; i++) {
//         Vertex vertex;
//         vertex.position = { mesh->mVertices[i].x, mesh->mVertices[i].y, mesh->mVertices[i].z };
//         vertex.normal = { mesh->mNormals[i].x, mesh->mNormals[i].y, mesh->mNormals[i].z };
//         // TODO: textures
//         newMesh.vertices.push_back(vertex);
//     }
//     for (size_t i = 0; i < mesh->mNumFaces; i++) {
//         aiFace face = mesh->mFaces[i];
//         for(size_t j = 0; j < face.mNumIndices; j++) {
//             newMesh.indices.push_back(face.mIndices[j]);
//         }
//     }

//     // TODO: materials
// }

// void ProcessNodeForModel(aiNode* node, const aiScene* scene, Model* model) {
//     // process all the node's meshes (if any)
//     for (size_t i = 0; i < node->mNumMeshes; i++) {
//         aiMesh *mesh = scene->mMeshes[node->mMeshes[i]];
//         ProcessMesh(mesh, scene, model);
//     }
//     // then do the same for each of its children
//     for (size_t i = 0; i < node->mNumChildren; i++) {
//         ProcessNodeForModel(node->mChildren[i], scene, model);
//     }
// }

template<typename T>
Vector3 ToVec3(const T& vec) {
    return { vec.X, vec.Y, vec.Z };
}

template<typename T>
Vector2 ToVec2(const T& vec) {
    return { vec.X, vec.Y };
}

ModelID ModelManager::LoadModel(const std::string& name, const std::string& path, std::istream& stream) {
    LOG_INFO("Loading Model " << name);

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
        for (auto& loadedVertex : loadedMesh.Vertices) {
            Vertex& vertex = mesh.vertices.emplace_back();
            vertex.position = ToVec3(loadedVertex.Position);
            vertex.normal = ToVec3(loadedVertex.Normal);
            vertex.texCoords = ToVec2(loadedVertex.TextureCoordinate);
        }

        mesh.material.name = loadedMesh.MeshMaterial.name;
        mesh.material.Ka = ToVec3(loadedMesh.MeshMaterial.Ka);
        mesh.material.Kd = ToVec3(loadedMesh.MeshMaterial.Kd);
        mesh.material.Ks = ToVec3(loadedMesh.MeshMaterial.Ks);
        mesh.material.Ns = loadedMesh.MeshMaterial.Ns;
        mesh.material.Ni = loadedMesh.MeshMaterial.Ni;
        mesh.material.d = loadedMesh.MeshMaterial.d;
        mesh.material.illum = loadedMesh.MeshMaterial.illum;
        mesh.material.map_Ka = loadedMesh.MeshMaterial.map_Ka;
        mesh.material.map_Kd = loadedMesh.MeshMaterial.map_Kd;
        mesh.material.map_Ks = loadedMesh.MeshMaterial.map_Ks;
        mesh.material.map_Ns = loadedMesh.MeshMaterial.map_Ns;
        mesh.material.map_d = loadedMesh.MeshMaterial.map_d;
        mesh.material.map_bump = loadedMesh.MeshMaterial.map_bump;
    }

    // Assimp::Importer importer;
    // const aiScene *scene = importer.ReadFileFromMemory(buffer, length,
    //     aiProcess_Triangulate |
    //     aiProcess_FlipUVs |
    //     aiProcess_GenNormals);

    // if (!scene || scene->mFlags & AI_SCENE_FLAGS_INCOMPLETE || !scene->mRootNode) {
    //     LOG_ERROR("Asset Import Error" << importer.GetErrorString());
    //     throw std::runtime_error("Asset Import Error");
    // }
    // Model* model = new Model;
    // ModelID id = models.size();
    // ProcessNodeForModel(scene->mRootNode, scene, model);
    return id;
}