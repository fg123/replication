#include "smoke-explosion.h"
#include "player.h"

SmokeObject::SmokeObject(Game& game) : SmokeObject(game, 0.f) { }

SmokeObject::SmokeObject(Game& game, float radius) :
    Object(game), radius(radius) {

    SetModel(game.GetModel("SmokeGrenade.obj"));
}

void SmokeObject::OnClientCreate() {
    game.PlayAudio("boom.wav", 1.0f, GetPosition());
}

void SmokeObject::Tick(Time time) {
    Object::Tick(time);

    Time delta = time - spawnTime;
    #ifdef BUILD_SERVER
    if (delta > 6000) {
        game.DestroyObject(GetId());
    }
    #endif

    float progress = delta / 100.f;
    float scale = glm::lerp(0.01f, radius, glm::min(progress, 1.0f));
    SetScale(Vector3(scale, scale, scale));

    Matrix4 matrix;
    matrix = glm::rotate(matrix, rot, Vector::Up);
    SetRotation(glm::quat_cast(matrix));
    rot += 0.02f;
}

