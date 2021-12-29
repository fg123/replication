struct LootEntry => (item, weight);

let LootTable = [
    LootEntry("AssaultRifleObject", 10),
    LootEntry("PistolObject", 10),
    LootEntry("AmmoObject", 50),
    LootEntry("GrenadeThrower", 50),
    LootEntry("BowObject", 10),
    LootEntry("ShotgunObject", 10),
    LootEntry("MedkitObject", 30),
    LootEntry("MachineGunObject", 10),
    LootEntry("SubmachineGunObject", 10)
];

let totalWeight = 0;
for entry in LootTable {
    totalWeight += entry.weight;
}

struct LootZone : Object => {
    init => () {
        super();
    }

    GetElement => (weight) {
        let soFar = 0;
        for entry in LootTable {
            soFar += entry.weight;
            if (soFar >= weight) {
                ret entry.item;
            }
        }
        ret none;
    }

    OnServerCreate => () {
        let pos = this.GetPosition();
        let scale = this.GetScale();
        let min = pos - scale * 0.5;
        let max = pos + scale * 0.5;

        for i in 0->10 {
            // Pick a LootTable
            let element = this.GetElement(Random.int(0, totalWeight));
            let spawnPos = Vector3(
                Random.float_between(min.x, max.x),
                Random.float_between(min.y, max.y),
                Random.float_between(min.z, max.z)
            );

            @"LootZone: Spawning " + element + " at ";
            spawnPos;

            let obj = CreateNativeObject(element);
            object_SetPosition(obj, spawnPos);
        }
    }
};