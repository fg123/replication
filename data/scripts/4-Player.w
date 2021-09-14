struct WeaponAttachmentPoint => [
    LEFT = 0,
    CENTER = 1,
    RIGHT = 2
];

let player_SetWeapon => (id, weaponType, weaponId, attachmentPoint) native player_SetWeapon;
struct Player : Object => [
    BaseType = "PlayerObject"
] {
    init => () {
        super();
    }

    SetQWeapon => (weapon, attachment) {
        player_SetWeapon(this.id, 0, weapon, attachment);
    }

    SetZWeapon => (weapon, attachment) {
        player_SetWeapon(this.id, 1, weapon, attachment);
    }
}