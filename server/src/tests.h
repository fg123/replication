#pragma once

#include "game.h"
class Tests {
    void RunRotatedAABBCollisionTest();
    void RunStaticMeshCollisionTest();
    Game& game;
public:
    Tests(Game& game) : game(game) {}
    int Run();
};