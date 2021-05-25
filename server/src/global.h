#pragma once

#include <string>
#include "replicable.h"

struct _GlobalSettings : Replicable {
    REPLICATED_D(std::string, MapPath, "MapPath", "maps/map1.json");
    REPLICATED_D(bool, IsProduction, "IsProduction", false);
    REPLICATED_D(bool, RunTests, "RunTests", false);

    // Client Settings
    REPLICATED_D(bool, Client_DrawDebugLines, "Client_DrawDebugLines", false);
    REPLICATED_D(bool, Client_DrawColliders, "Client_DrawColliders", false);
    REPLICATED_D(bool, Client_DrawBVH, "Client_DrawBVH", false);
};

extern _GlobalSettings GlobalSettings;