#pragma once

#include <vector>
#include <string>

#include "wendy-headers.h"

class Script;
class Game;

// Handles loading files / hot reload and running the actual VM
class ScriptManager {
    std::vector<Script*> scripts;
public:
    static struct vm* vm;
    static Game* game;

    ScriptManager(Game* game);
    ~ScriptManager();

    void AddScript(const std::string& path);
    void InitializeVM();

    std::string GetBaseTypeFromScriptingType(const std::string& type);
};
