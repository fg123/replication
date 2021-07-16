struct TestObject : Object => {
    init => () {
        super();
        ret this;
    }

    OnClientCreate => () {
        this.SetModel("Cube.obj");
    }

    OnTick => (gameTime) {
        let pos = this.GetPosition();
        pos.z += 1;
        this.SetPosition(pos);
        pos;
    }
}