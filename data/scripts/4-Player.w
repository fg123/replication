let player_SetWeapon => (id, weaponType, weaponId, attachmentPoint) native player_SetWeapon;
let player_SetHealth => (id, health) native player_SetHealth;

struct Player : Object => [
    BaseType = "PlayerObject"
] {
    init => () {
        super();
    }

    SetQWeapon => (weapon, attachment) {
        player_SetWeapon(this.id, weapon, 0, attachment);
    }

    SetZWeapon => (weapon, attachment) {
        player_SetWeapon(this.id, weapon, 1, attachment);
    }

    SetHealth => (health) {
        player_SetHealth(this.id, health);
    }

    // Events:
    OnTakeDamage => (damage) {}
}