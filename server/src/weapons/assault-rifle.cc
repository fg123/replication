#include "assault-rifle.h"

AssaultRifleObject::AssaultRifleObject(Game& game, Vector2 position) : GunBase(game, position) {
    AddCollider(new RectangleCollider(this, Vector2(-26, -10), Vector2(74, 24)));

    fireRate = 14;
    magazineSize = 25;
    magazines = 3;
    bullets = magazineSize;
    damage = 14;
    reloadTime = 1000;
}
