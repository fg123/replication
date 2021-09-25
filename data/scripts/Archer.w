struct Archer : Player => {
    init => () {
        super();
    }

    OnServerCreate => () {
        let q = CreateNativeObject("DashAbility");
        this.SetQWeapon(q, WeaponAttachmentPoint.LEFT);

        // let z = CreateNativeObject("BombExploder");
        // this.SetZWeapon(z, WeaponAttachmentPoint.RIGHT);
    }
};