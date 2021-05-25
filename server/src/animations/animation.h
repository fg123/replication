#pragma once

#include "replicable.h"

// Packet sent to client
struct Animation {
    ObjectID player;
    Animation(ObjectID player) : player(player) {}
    virtual ~Animation() {}

    virtual const char* GetKey() = 0;
    void Serialize(JSONWriter& obj) {
        obj.StartObject();
        obj.Key("k");
        obj.String(GetKey());
        obj.Key("player");
        obj.Uint(player);
        SerializeData(obj);
        obj.EndObject();
    }
    virtual void SerializeData(JSONWriter& obj) = 0;
};
