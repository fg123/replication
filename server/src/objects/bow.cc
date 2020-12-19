#include "bow.h"
#include "arrow.h"
#include "player.h"

void BowObject::Fire(Time time) {
    if (time < nextFireTime) {
        return;
    }
    nextFireTime = time + (1000.0 / fireRate);
#ifdef BUILD_SERVER
    ArrowObject* arrow = new ArrowObject(game);
    arrow->SetPosition(GetPosition() + attachedTo->GetAimDirection() * 50);
    arrow->SetVelocity(attachedTo->GetAimDirection() * 1000.0);
    game.AddObject(arrow);
#endif
}