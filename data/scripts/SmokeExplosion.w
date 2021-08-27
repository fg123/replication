struct SmokeExplosion : Object => (
    radius,
    rotation
) {

    init => () {
        super();
        this.radius = 5;
        this.rotation = 0;
        ret this;
    }

    OnCreate => () {
        this.SetModel("SmokeGrenade.obj");
    }

    OnClientCreate => () {
        PlayAudio("boom.wav", 1.0, this.GetPosition());
    }

    OnTick => (gameTime) {
        let delta = gameTime - this.GetSpawnTime();
        if (delta > 6000) {
            DestroyObject(this.GetId());
        }
        let progress = delta / 100;
        let scale = Lerp(0.01, this.radius, Min(progress, 1.0));
        this.SetScale(Vector3(scale, scale, scale));
        this.SetRotation(Quaternion.FromRotation(this.rotation, Vector.Up).Normalize());
        this.rotation += 0.02;
    }
};