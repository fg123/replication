#pragma once

#include "sprite.h"

class BulletHoleDecal : public SpriteObject {
public:
    BulletHoleDecal(Game& game) : SpriteObject(game, "textures/BulletHole/BulletHole.png") {

    }

    virtual void Tick(Time time) override {
        Object::Tick(time);
        #ifdef BUILD_SERVER
            if (time - spawnTime > 5000.f) {
                game.DestroyObject(GetId());
            }
        #endif
    }
};