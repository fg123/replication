// Base Object Interface

struct Vector2 => (x, y);
struct Vector3 => (x, y, z);

// Interface for Object
struct Object => {
    init => () {}

    GetPosition  => () native object_GetPosition;
    GetScale     => () native object_GetScale;
    GetRotation  => () native object_GetRotation;
    GetVelocity  => () native object_GetVelocity;
    GetSpawnTime => () native object_GetSpawnTime;
    GetId        => () native object_GetId;

    SetScale     => (s) native object_SetScale;

    OnTick => (delta) {}
    OnClientCreate => () {}
};

// Interface for Game
let PlayAudio => (audio, volume, position) native game_PlayAudio;
let DestroyObject => (id) native game_DestroyObject;
let GetUnitsInRange => (pos, scale) native game_GetUnitsInRange;
