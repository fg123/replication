#include "smoke-grenade.h"
#include "game.h"

SmokeGrenadeObject::SmokeGrenadeObject(Game& game, ObjectID playerId) : ThrownProjectile(game, playerId) {
    // Don't Collide with Anything
    collisionExclusion |= (uint64_t) Tag::OBJECT;
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
    if (exploded) return;
    exploded = true;

    Object* explode = game.CreateAndAddScriptedObject("SmokeExplosion");
    explode->SetPosition(GetPosition());

    Vector3 dirOne = glm::normalize(glm::cross(glm::normalize(velocity), Vector::Up));
    Object* nade1 = game.CreateAndAddScriptedObject("SmokeExplosion");
    nade1->SetPosition(GetPosition() + 2.5f * dirOne);

    Object* nade2 = game.CreateAndAddScriptedObject("SmokeExplosion");
    nade2->SetPosition(GetPosition() - 2.5f * dirOne);

    game.DestroyObject(GetId());
#endif
}