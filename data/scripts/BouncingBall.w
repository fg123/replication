struct BouncingBall : Object => {
    init => () {
        super();
    }

    OnCreate => () {
        this.SetModel("Icosphere.obj");
        this.AddSphereCollider(Vector3(0, 0, 0), 0.5);
    }

    /* OnCollide => (otherId, difference) {
        let velMag = this.GetVelocity().Size();
        let newVel = difference.Normalize() * velMag;
        this.SetVelocity(newVel);
    } */

    OnTick => (time) {
        let pos = this.GetPosition();
        pos.x += 20;
        pos.y += 20;
        pos.z += 20;
        pos.x -= 20;
        pos.y -= 20;
        pos.z -= 20;
        this.SetPosition(pos);
    }
};