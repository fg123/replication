#pragma once

#include <string>
#include "replicable.h"

struct _GlobalSettings : Replicable {
    ALWAYS_REPLICATED_D(std::string, MapPath, "MapPath", "maps/map1.json");
    ALWAYS_REPLICATED_D(bool, IsProduction, "IsProduction", false);
    ALWAYS_REPLICATED_D(bool, RunTests, "RunTests", false);

    // Client Settings
    ALWAYS_REPLICATED_D(bool, Client_DrawColliders, "Client_DrawColliders", false);
    ALWAYS_REPLICATED_D(bool, Client_DrawBVH, "Client_DrawBVH", false);
    ALWAYS_REPLICATED_D(bool, Client_IgnoreServer, "Client_IgnoreServer", false);
    ALWAYS_REPLICATED_D(bool, Client_DrawShadowMaps, "Client_DrawShadowMaps", false);
    ALWAYS_REPLICATED_D(bool, Client_DrawGBuffer, "Client_DrawGBuffer", false);
    ALWAYS_REPLICATED_D(bool, Client_NoShadows, "Client_NoShadows", false);
};

extern _GlobalSettings GlobalSettings;