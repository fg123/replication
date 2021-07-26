#pragma once

#include "game.h"
#include "audio.h"
#include "object.h"

#include <unordered_set>

struct AudioPlayback {
    ALuint source;
    ALint state;
    Vector3 position;
    ObjectID boundObject;
};

class ClientAudio {
    Game& game;
    std::unordered_set<AudioPlayback*> sources;
public:
    ClientAudio(Game& game) : game(game) {}

    void SetupContext();
    void Tick();
};