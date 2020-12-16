#ifndef PLAYER_OBJECT_H
#define PLAYER_OBJECT_H

#include "object.h"
#include "vector.h"

#include <mutex>
#include <unordered_set>

class Game;
class PlayerObject : public Object {
    int health = 100;

public:
    std::mutex socketDataMutex;
    std::unordered_set<std::string> keyboardState;

    PlayerObject(Game& game, Vector2 position);

    virtual void Tick(Time time) override;
    virtual const char* GetClass() override { return "Marine"; }
    virtual void Serialize(json& obj) override;
};

#endif