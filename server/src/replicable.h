#ifndef REPLICABLE_H
#define REPLICABLE_H

#include "json/rapidjson/document.h"
#include "json/rapidjson/ostreamwrapper.h"
#include "json/rapidjson/istreamwrapper.h"
#include "json/rapidjson/writer.h"

#include "vector.h"
#include "logging.h"

#include <sstream>
#include <functional>
#include <unordered_map>
#include <type_traits>

using json = rapidjson::Value;
using JSONWriter = rapidjson::Writer<rapidjson::StringBuffer>;
using JSONDocument = rapidjson::Document;

struct ReplicationEntry {
    std::function<void(void*, JSONWriter& obj)> Serialize;
    std::function<void(void*, json& obj)> ProcessReplication;

    ReplicationEntry() = delete;
    ReplicationEntry(
        std::function<void(void*, JSONWriter& obj)> serialize,
        std::function<void(void*, json& obj)> processReplication
    ) : Serialize(serialize), ProcessReplication(processReplication) {}
};

class Replicable {
public:
    std::unordered_map<std::string, ReplicationEntry> entries;

    virtual ~Replicable() {}
    virtual void Serialize(JSONWriter& obj) {
        for (auto& a : entries) {
            a.second.Serialize(this, obj);
        }
    }

    virtual void ProcessReplication(json& obj) {
        for (auto& a : entries) {
            // LOG_DEBUG("Call Start " << a.first);
            a.second.ProcessReplication(this, obj);
            // LOG_DEBUG("Call End " << a.first);
        }
    }
};

template<typename T>
class ReplicatedRegister {
public:
    ReplicatedRegister(
        std::unordered_map<std::string, ReplicationEntry>& entries,
        const char* repAlias,
        std::function<void(void*, JSONWriter& obj)> serialize,
        std::function<void(void*, json& obj)> processReplication
    ) {
        std::string alias {repAlias};
        if (entries.find(alias) != entries.end()) {
            LOG_ERROR("Replicated register \"" << repAlias << "\" is already assigned to a different field!");
            return;
        }
        entries.emplace(alias, ReplicationEntry { serialize, processReplication });
    }
};

#define REPLICATED(type, name, repAlias)  \
    type name;                            \
    REPLICATED_IMPL(type, name, repAlias)

#define REPLICATED_D(type, name, repAlias, defaultValue)    \
    type name = defaultValue;                               \
    REPLICATED_IMPL(type, name, repAlias)

#define REPLICATED_IMPL(repType, name, repAlias)               \
    ReplicatedRegister<repType> name##__ {              \
        entries,                                            \
        repAlias,                                           \
        [](void* _this, JSONWriter& obj) {                  \
            obj.Key(repAlias);              \
            SerializeDispatch(static_cast<decltype(this)>(_this)->name, obj); \
        },                                                    \
        [](void* _this, json& obj) { \
            CheckMemberExists(obj, repAlias); \
            ProcessReplicationDispatch(static_cast<decltype(this)>(_this)->name, obj[repAlias]);  \
        } \
    };

inline std::string DumpJSON(const json& value) {
    std::ostringstream stream;
    rapidjson::OStreamWrapper rapidStream(stream);
    rapidjson::Writer<rapidjson::OStreamWrapper> writer(rapidStream);
    value.Accept(writer);
    return stream.str();
}

inline void CheckMemberExists(const json& obj, const char* key) {
    if (!obj.HasMember(key)) {
        LOG_ERROR("Missing " << key << " in: " << DumpJSON(obj));
        throw std::runtime_error("Missing key in JSON object!");
    }
}

template<class T>
void SerializeDispatch(T& object, JSONWriter& obj) {
    obj.StartObject();
    object.Serialize(obj);
    obj.EndObject();
}

template<class T>
void ProcessReplicationDispatch(T& object, json& obj) {
    object.ProcessReplication(obj);
}

template<class T>
void SerializeDispatch(std::vector<T>& object, JSONWriter& obj) {
    obj.StartArray();
    for (auto& t : object) {
        // NULL key
        SerializeDispatch<T>(t, obj);
    }
    obj.EndArray();
}

template<class T>
void ProcessReplicationDispatch(std::vector<T>& object, json& obj) {
    auto arr = obj.GetArray();
    object.clear();
    object.resize(arr.Size());
    size_t i = 0;
    for (auto& a : arr) {
        ProcessReplicationDispatch<T>(object[i++], a);
    }
}

template<>
inline void SerializeDispatch(int& object, JSONWriter& obj) {
    obj.Int(object);
}

template<>
inline void ProcessReplicationDispatch(int& object, json& obj) {
    object = obj.GetInt();
}

template<>
inline void SerializeDispatch(bool& object, JSONWriter& obj) {
    obj.Bool(object);
}

template<>
inline void ProcessReplicationDispatch(bool& object, json& obj) {
    object = obj.GetBool();
}

template<>
inline void SerializeDispatch(uint32_t& object, JSONWriter& obj) {
    obj.Uint(object);
}

template<>
inline void ProcessReplicationDispatch(uint32_t& object, json& obj) {
    object = obj.GetUint();
}

template<>
inline void SerializeDispatch(uint64_t& object, JSONWriter& obj) {
    obj.Uint64(object);
}

template<>
inline void ProcessReplicationDispatch(uint64_t& object, json& obj) {
    object = obj.GetUint64();
}

template<>
inline void SerializeDispatch(double& object, JSONWriter& obj) {
    obj.Double(object);
}

template<>
inline void ProcessReplicationDispatch(double& object, json& obj) {
    object = obj.GetDouble();
}

// Specialize Vector2 because replicable is an expensive base class due to
//   registration of members. Vector2s often get created and destroyed quick
//   so we shouldn't have that overhead.
template<>
inline void SerializeDispatch(Vector2& object, JSONWriter& obj) {
    obj.StartObject();
    obj.Key("x");
    obj.Double(object.x);
    obj.Key("y");
    obj.Double(object.y);
    obj.EndObject();
}

template<>
inline void ProcessReplicationDispatch(Vector2& object, json& obj) {
    object.x = obj["x"].GetDouble();
    object.y = obj["y"].GetDouble();
}

template<>
inline void SerializeDispatch(Vector3& object, JSONWriter& obj) {
    obj.StartObject();
    obj.Key("x");
    obj.Double(object.x);
    obj.Key("y");
    obj.Double(object.y);
    obj.Key("z");
    obj.Double(object.z);
    obj.EndObject();
}

template<>
inline void ProcessReplicationDispatch(Vector3& object, json& obj) {
    object.x = obj["x"].GetDouble();
    object.y = obj["y"].GetDouble();
    object.z = obj["z"].GetDouble();
}

template<>
inline void SerializeDispatch(Quaternion& object, JSONWriter& obj) {
    obj.StartObject();
    obj.Key("x");
    obj.Double(object.x);
    obj.Key("y");
    obj.Double(object.y);
    obj.Key("z");
    obj.Double(object.z);
    obj.Key("w");
    obj.Double(object.w);
    obj.EndObject();
}

template<>
inline void ProcessReplicationDispatch(Quaternion& object, json& obj) {
    object.x = obj["x"].GetDouble();
    object.y = obj["y"].GetDouble();
    object.z = obj["z"].GetDouble();
    object.w = obj["w"].GetDouble();
}

template<>
inline void SerializeDispatch(std::string& object, JSONWriter& obj) {
    obj.String(object.c_str());
}

template<>
inline void ProcessReplicationDispatch(std::string& object, json& obj) {
    object = obj.GetString();
}
#endif