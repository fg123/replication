struct Hookman : Player => {
    init => () {
        super();
    }

    OnServerCreate => () {
        let q = CreateNativeObject("HookThrower");
        this.SetQWeapon(q, WeaponAttachmentPoint.LEFT);

        let z = CreateNativeObject("PortalAbility");
        this.SetZWeapon(z, WeaponAttachmentPoint.RIGHT);
    }
};