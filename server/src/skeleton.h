#pragma once

#include "vector.h"
#include "replicable.h"

#include <vector>

struct Bone : public Replicable {
    REPLICATED_F(std::string, name);
    REPLICATED_F(Vector3, offset);
    REPLICATED_F(Vector3, offsetEnd);

    REPLICATED_F(Vector3, position);
    REPLICATED_F(Vector3, rotation);

    std::vector<size_t> children;

    void Serialize(JSONWriter& obj) {
        Replicable::Serialize(obj);
        obj.Key("children");
        obj.StartArray();
        for (const auto &c : children) {
            obj.Uint64(c);
        }
        obj.EndArray();
    }

    void ProcessReplication(json& obj) {
        Replicable::ProcessReplication(obj);
        children.clear();
        for (auto& a : obj["children"].GetArray()) {
            children.push_back(a.GetUint64());
        }
    }
};

struct Skeleton : public Replicable {
    // 0 is the Root
    std::vector<Bone*> bones;
    std::vector<float*> channels;

    void Serialize(JSONWriter& obj) {
        Replicable::Serialize(obj);
        obj.Key("bones");
        obj.StartArray();
        for (auto &bone : bones) {
            bone->Serialize(obj);
        }
        obj.EndArray();
    }

    void ProcessReplication(json& obj) {
        Replicable::ProcessReplication(obj);
        for (const auto b : bones) {
            delete b;
        }
        bones.clear();
        for (auto& a : obj["bones"].GetArray()) {
            Bone* b = new Bone;
            b->ProcessReplication(a);
            bones.emplace_back(b);
        }
    }

    ~Skeleton() {
        for (const auto b : bones) {
            delete b;
        }
        bones.clear();
    }
};
