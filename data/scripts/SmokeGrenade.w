struct SmokeGrenade : Object => (
    exploded // bool
) [BaseType = "ThrownProjectile"] {
    init => () {
        super();
        this.exploded = false;
        this.SetAirFriction(Vector3(0.97));
        ret this;
    }

    OnCreate => () {
        this.SetModel("Grenade.obj");
        this.GenerateOBBCollidersFromModel();
        PlayAudio("boom.wav", 1.0, this.id);
    }

    OnCollide => (otherId, difference) {

    }
}