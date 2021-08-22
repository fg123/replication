#include "explosion.h"
#include "player.h"

ExplosionObject::ExplosionObject(Game& game) : ExplosionObject(game, 0, 0.f, 0.f) { }

ExplosionObject::ExplosionObject(Game& game, ObjectID playerId, float radius, float damage) :
    Object(game), radius(radius), damage(damage), playerId(playerId) {

    SetModel(game.GetModel("Explosion.obj"));
    // SetIsStatic(true);
}

void ExplosionObject::OnClientCreate() {
    Object::OnClientCreate();
    game.PlayAudio("boom.wav", 1.0f, GetPosition());
}

void ExplosionObject::Tick(Time time) {
    Object::Tick(time);
    Time delta = time - spawnTime;
    float progress = delta / 100.f;
    #ifdef BUILD_SERVER
    if (progress > 4.f) {
        game.DestroyObject(GetId());
    }
    #endif
    float scale = glm::lerp(0.01f, radius, glm::min(progress, 1.0f));
    SetScale(Vector3(scale, scale, scale));

    std::vector<Game::RangeQueryResult> results;
    game.GetUnitsInRange(GetPosition(), scale, results);

    for (auto& result : results) {
        // Flat Damage for now
        if (result.first->IsTagged(Tag::PLAYER) && damaged.find(result.first) == damaged.end()) {
            static_cast<PlayerObject*>(result.first)->DealDamage(damage, playerId);
            damaged.insert(result.first);
        }
    }
}

