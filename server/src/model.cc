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

ModelID ModelManager::LoadModel(const std::string& name, const std::string& path, std::istream& stream) {
    LOG_INFO("Loading Model " << name);

    objl::Loader loader;
    loader.LoadStream(path, stream);


    Model* model = new Model;
    ModelID id = models.size();
    model->id = id;
    models.push_back(model);

    for (auto& loadedMesh : loader.LoadedMeshes) {
        Mesh& mesh = model->meshes.emplace_back();
        mesh.name = loadedMesh.MeshName;
        mesh.indices = loadedMesh.Indices;
        for (auto& loadedVertex : loadedMesh.Vertices) {
            Vertex& vertex = mesh.vertices.emplace_back();
            vertex.position = { loadedVertex.Position.X, loadedVertex.Position.Y, loadedVertex.Position.Z };
            vertex.normal = { loadedVertex.Normal.X, loadedVertex.Normal.Y, loadedVertex.Normal.Z };
            vertex.texCoords = { loadedVertex.TextureCoordinate.X, loadedVertex.TextureCoordinate.Y };
        }
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