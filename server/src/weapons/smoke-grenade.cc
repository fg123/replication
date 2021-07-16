#include "smoke-grenade.h"
#include "game.h"
#include "smoke-explosion.h"

SmokeGrenadeObject::SmokeGrenadeObject(Game& game, ObjectID playerId) : ThrownProjectile(game, playerId) {
    // Don't Collide with Weapons
    collisionExclusion |= (uint64_t) Tag::WEAPON;
    SetModel(game.GetModel("Grenade.obj"));
    GenerateOBBCollidersFromModel(this);
    game.PlayAudio("GrenadeOut.wav", 1.f, this);
    airFriction = Vector3(0.97);
}

void SmokeGrenadeObject::OnCollide(CollisionResult& result) {
    if (result.collidedWith->IsTagged(Tag::WEAPON)) {
        // Ignore
        return;
    }
    if (result.collidedWith->IsStatic()) {
        // Prime Grenade, once it lands it sticks
        SetIsStatic(true);
        collisionExclusion |= (uint64_t) Tag::PLAYER;
        Explode();
    }
}

void SmokeGrenadeObject::Explode() {
#ifdef BUILD_SERVER
    SmokeObject* explode = new SmokeObject(game, 10.f);
    explode->SetPosition(GetPosition());
    game.AddObject(explode);

    // Vector3 dirOne = glm::cross(velocity, Vector::Up);
    // SmokeObject* nade1 = new SmokeObject(game, 10.f);
    // nade1->SetPosition(GetPosition() + 5.f * glm::normalize(dirOne));
    // game.AddObject(nade1);

    // Vector3 dirTwo = glm::cross(velocity, Vector::Up);
    // SmokeObject* nade2 = new SmokeObject(game, 10.f);
    // nade2->SetPosition(GetPosition() + 5.f * glm::normalize(dirTwo));
    // game.AddObject(nade2);

    game.DestroyObject(GetId());
#endif
}