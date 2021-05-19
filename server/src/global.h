#pragma once

#include <string>

struct _GlobalSettings {
    std::string MapPath = "maps/map1.json";
    bool IsProduction = false;
    bool RunTests = false;
};

extern _GlobalSettings GlobalSettings;