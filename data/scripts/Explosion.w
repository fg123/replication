struct Explosion : Object => (
    radius,
    damage
) {

    init => () {
        super();
        this.radius = 5;
        this.damage = 25;
        ret this;
    }

    OnCreate => () {
        this.SetModel("Explosion.obj");
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