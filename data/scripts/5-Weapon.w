struct WeaponAttachmentPoint => [
    LEFT = 0,
    CENTER = 1,
    RIGHT = 2
];

struct Weapon : Object => [
    BaseType = "WeaponObject"
] {
    init => () {
        super();
    }

    // Events
    StartFire => (time) {}
    Fire => (time) {}
    ReleaseFire => (time) {}

    StartAlternateFire => (time) {}
    ReleaseAlternateFire => (time) {}

    StartReload => (time) {}
};