#ifndef REPLICABLE_H
#define REPLICABLE_H

#include "json/json_fwd.hpp"

using json = nlohmann::json;

class Replicable {
public:
    virtual ~Replicable() {}
    virtual void Serialize(json& obj) = 0;
    virtual void ProcessReplication(json& obj) = 0;
};

#endif