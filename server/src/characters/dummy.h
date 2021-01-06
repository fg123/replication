#ifndef DUMMY_H
#define DUMMY_H

#include "player.h"

class Dummy : public PlayerObject {

public:
    CLASS_CREATE(Dummy)
    Dummy(Game& game) : Dummy(game, Vector2::Zero) {}
    Dummy(Game& game, Vector2 position) : PlayerObject(game, position) {
    }

    virtual void OnTakeDamage(int damage) override {
        health = 100;
    }
};

CLASS_REGISTER(Dummy);
#endif