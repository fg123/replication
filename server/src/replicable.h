#ifndef REPLICABLE_H
#define REPLICABLE_H

#include "json/rapidjson/document.h"
#include "json/rapidjson/ostreamwrapper.h"
#include "json/rapidjson/istreamwrapper.h"
#include "json/rapidjson/writer.h"

#include <sstream>

using json = rapidjson::Value;
using JSONWriter = rapidjson::Writer<rapidjson::StringBuffer>;
using JSONDocument = rapidjson::Document;

class Replicable {
public:
    virtual ~Replicable() {}
    virtual void Serialize(JSONWriter& obj) = 0;
    virtual void ProcessReplication(json& obj) = 0;
};

inline std::string DumpJSON(json& value) {
    std::ostringstream stream;
    rapidjson::OStreamWrapper rapidStream(stream);
    rapidjson::Writer<rapidjson::OStreamWrapper> writer(rapidStream);
    value.Accept(writer);
    return stream.str();
}

#endif