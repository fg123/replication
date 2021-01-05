#ifndef ANIMATION_H
#define ANIMATION_H

#include "replicable.h"

// Packet sent to client
struct Animation {
    virtual ~Animation() {}
    virtual const char* GetKey() = 0;
    void Serialize(JSONWriter& obj) {
        obj.StartObject();
        obj.Key("k");
        obj.String(GetKey());
        SerializeData(obj);
        obj.EndObject();
    }
    virtual void SerializeData(JSONWriter& obj) = 0;
};

#endif