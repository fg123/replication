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

using json = rapidjson::Value;
using JSONWriter = rapidjson::Writer<rapidjson::StringBuffer>;
using JSONDocument = rapidjson::Document;

struct ReplicationEntry {
    std::function<void(JSONWriter& obj)> Serialize;
    std::function<void(json& obj)> ProcessReplication;
};

class Replicable {
public:
    std::unordered_map<const char*, ReplicationEntry> entries;

    virtual ~Replicable() {}
    virtual void Serialize(JSONWriter& obj) {
        for (auto& a : entries) {
            a.second.Serialize(obj);
        }
    }

    virtual void ProcessReplication(json& obj) {
        for (auto& a : entries) {
            a.second.ProcessReplication(obj);
        }
    }
};

template<class T>
class ReplicatedRegister {
public:
    ReplicatedRegister(
        std::unordered_map<const char*, ReplicationEntry>& entries,
        const char* repAlias,
        const std::function<void(JSONWriter& obj)>& serialize,
        const std::function<void(json& obj)> processReplication
    ) {
        if (entries.find(repAlias) != entries.end()) {
            LOG_ERROR("Replicated register \"" << repAlias << "\" is already assigned to a different field!");
            return;
        }
        entries[repAlias].Serialize = serialize;
        entries[repAlias].ProcessReplication = processReplication;
    }
};

#define REPLICATED(type, name, repAlias)                    \
    type name;                                              \
    ReplicatedRegister<type> name##__ {                     \
        entries,                                            \
        repAlias,                                           \
        [this](JSONWriter& obj) { SerializeDispatch(name, repAlias, obj); },   \
        [this](json& obj) { ProcessReplicationDispatch(name, repAlias, obj); } \
    };

inline std::string DumpJSON(json& value) {
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


#endif