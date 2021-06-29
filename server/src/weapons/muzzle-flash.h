#pragma once

#include "sprite.h"

class MuzzleFlash : public SpriteObject {
public:
    MuzzleFlash(Game& game) : SpriteObject(game, "textures/MuzzleFlash/muzzle1.png") {

    }

    virtual void Tick(Time time) override {
        Object::Tick(time);
        #ifdef BUILD_SERVER
            if (time - spawnTime > 100.f) {
                game.DestroyObject(GetId());
            }
        #endif
    }
};