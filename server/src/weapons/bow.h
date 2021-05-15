#pragma once

#include "game.h"
#include "input-hold-thrower.h"
#include "arrow.h"

class BowObject : public InputHoldThrower<ArrowObject> {
public:
    CLASS_CREATE(BowObject)

    BowObject(Game& game) : BowObject(game, Vector3()) {}
    BowObject(Game& game, Vector3 position) : InputHoldThrower<ArrowObject>(game, position) {
        cooldown = 300;
        powerMin = 30;
        powerMax = 100;

        SetModel(game.GetModel("Bow.obj"));
    }

    void SetInstantFire(bool fire) { instantFire = fire; }
    void StartFire(Time time) override {
        InputHoldThrower<ArrowObject>::StartFire(time);
        game.PlayAudio("Archer/arrow-pullback.wav", 1.f, this);
    }

    void FireProjectile(Time time) override {
        InputHoldThrower<ArrowObject>::FireProjectile(time);
        if (instantFire) {
            game.PlayAudio("Archer/arrow-ulti-shoot.wav", 1.f, this);
        }
        else {
            game.PlayAudio("Archer/arrow-shoot.wav", 1.f, this);
        }
    }

    // void Tick(Time time) override {
    //     InputHoldThrower<ArrowObject>::Tick(time);
    //     // LOG_DEBUG(GetPosition());
    // }
};

CLASS_REGISTER(BowObject);
