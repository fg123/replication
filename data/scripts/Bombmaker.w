struct BombMaker : Player => {
    init => () {
        super();
    }

    OnServerCreate => () {
        let q = CreateNativeObject("BombCreator");
        this.SetQWeapon(q, WeaponAttachmentPoint.LEFT);

        let z = CreateNativeObject("BombExploder");
        this.SetZWeapon(z, WeaponAttachmentPoint.RIGHT);
    }
};