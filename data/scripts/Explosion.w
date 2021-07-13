import object

struct Explosion : Object => () {
    radius = 0;
    damage = 0;
    playerId = 0;

    init => (playerId, radius, damage) {
        super();
        this.playerId = playerId;
        this.radius = radius;
        this.damage = damage;
        ret this;
    }

    OnClientCreate => () {
        PlayAudio("boom.wav", 1.0, this.GetPosition());
    }

    OnTick => (gameTime) {
        let delta = gameTime - this.GetSpawnTime();
        let progress = delta / 100;
        if (progress > 4) {
            DestroyObject(this.GetId());
        }
        let scale = Lerp(0.01, this.radius, Min(progress, 1.0));
        this.SetScale(Vector3(scale, scale, scale));
    }
};