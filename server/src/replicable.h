#ifndef REPLICABLE_H
#define REPLICABLE_H

#include "json/rapidjson/document.h"
#include "json/rapidjson/ostreamwrapper.h"
#include "json/rapidjson/istreamwrapper.h"
#include "json/rapidjson/writer.h"

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
            SerializeDispatch(static_cast<decltype(this)>(_this)->name, repAlias, obj); \
        },                                                    \
        [](void* _this, json& obj) { \
            ProcessReplicationDispatch(static_cast<decltype(this)>(_this)->name, repAlias, obj);  \
        } \
    };

inline std::string DumpJSON(const json& value) {
    std::ostringstream stream;
    rapidjson::OStreamWrapper rapidStream(stream);
    rapidjson::Writer<rapidjson::OStreamWrapper> writer(rapidStream);
    value.Accept(writer);
    return stream.str();
}

template<class T>
void SerializeDispatch(T& object, const char* key, JSONWriter& obj) {
    obj.Key(key);
    obj.StartObject();
    object.Serialize(obj);
    obj.EndObject();
}

template<class T>
void ProcessReplicationDispatch(T& object, const char* key, json& obj) {
    if (!obj.HasMember(key)) {
        LOG_ERROR("Missing " << key << " in: " << DumpJSON(obj));
        throw std::runtime_error("Missing key in JSON object!");
    }
    object.ProcessReplication(obj[key]);
}

template<>
inline void SerializeDispatch(int& object, const char* key, JSONWriter& obj) {
    obj.Key(key);
    obj.Int(object);
}

template<>
inline void ProcessReplicationDispatch(int& object, const char* key, json& obj) {
    object = obj[key].GetInt();
}

template<>
inline void SerializeDispatch(bool& object, const char* key, JSONWriter& obj) {
    obj.Key(key);
    obj.Bool(object);
}

template<>
inline void ProcessReplicationDispatch(bool& object, const char* key, json& obj) {
    object = obj[key].GetBool();
}

template<>
inline void SerializeDispatch(uint32_t& object, const char* key, JSONWriter& obj) {
    obj.Key(key);
    obj.Uint(object);
}

template<>
inline void ProcessReplicationDispatch(uint32_t& object, const char* key, json& obj) {
    object = obj[key].GetUint();
}

template<>
inline void SerializeDispatch(uint64_t& object, const char* key, JSONWriter& obj) {
    obj.Key(key);
    obj.Uint64(object);
}

template<>
inline void ProcessReplicationDispatch(uint64_t& object, const char* key, json& obj) {
    object = obj[key].GetUint64();
}

template<>
inline void SerializeDispatch(double& object, const char* key, JSONWriter& obj) {
    obj.Key(key);
    obj.Double(object);
}

template<>
inline void ProcessReplicationDispatch(double& object, const char* key, json& obj) {
    object = obj[key].GetDouble();
}

// Specialize Vector2 because replicable is an expensive base class due to
//   registration of members. Vector2s often get created and destroyed quick
//   so we shouldn't have that overhead.
template<>
inline void SerializeDispatch(Vector2& object, const char* key, JSONWriter& obj) {
    obj.Key(key);
    obj.StartObject();
    obj.Key("x");
    obj.Double(object.x);
    obj.Key("y");
    obj.Double(object.y);
    obj.EndObject();
}

template<>
inline void ProcessReplicationDispatch(Vector2& object, const char* key, json& obj) {
    object.x = obj[key]["x"].GetDouble();
    object.y = obj[key]["y"].GetDouble();
}

template<>
inline void SerializeDispatch(Vector3& object, const char* key, JSONWriter& obj) {
    obj.Key(key);
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
inline void ProcessReplicationDispatch(Vector3& object, const char* key, json& obj) {
    object.x = obj[key]["x"].GetDouble();
    object.y = obj[key]["y"].GetDouble();
    object.z = obj[key]["z"].GetDouble();
}

template<>
inline void SerializeDispatch(std::string& object, const char* key, JSONWriter& obj) {
    obj.Key(key);
    obj.String(object.c_str());
}

template<>
inline void ProcessReplicationDispatch(std::string& object, const char* key, json& obj) {
    object = obj[key].GetString();
}
#endif