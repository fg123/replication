// Base Object Interface

let object_GetPosition => (id) native object_GetPosition;
let object_GetScale => (id) native object_GetScale;
let object_GetRotation => (id) native object_GetRotation;
let object_GetVelocity => (id) native object_GetVelocity;
let object_GetSpawnTime => (id) native object_GetSpawnTime;

let object_SetModel => (id, m) native object_SetModel;
let object_SetPosition => (id, s) native object_SetPosition;
let object_SetScale => (id, s) native object_SetScale;

// Interface for Object
struct Object => (id) {
    init => () {}

    GetPosition  => () ret Vector3FromList(object_GetPosition(this.id));
    GetScale     => () ret Vector3FromList(object_GetScale(this.id));
    GetRotation  => () ret Vector3FromList(object_GetRotation(this.id));
    GetVelocity  => () ret Vector3FromList(object_GetVelocity(this.id));
    GetSpawnTime => () ret object_GetSpawnTime(this.id);
    GetId        => () ret this.id;

    SetModel     => (m) ret object_SetModel(this.id, m);
    SetPosition  => (s) ret object_SetPosition(this.id, s);
    SetScale     => (s) ret object_SetScale(this.id, s);

    // Init Function
    OnCreate => () {}

    // Per Tick
    OnTick => (time) {}

    // ClientOnly
    OnClientCreate => () {}

};

// Interface for Game
let PlayAudio => (audio, volume, position) native game_PlayAudio;
let DestroyObject => (id) native game_DestroyObject;
let GetUnitsInRange => (pos, scale) native game_GetUnitsInRange;
