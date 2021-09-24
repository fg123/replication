struct Marine : Player => [
    BaseType = "PlayerObject"]
{
    init => () {
        super();
    }

    OnServerCreate => () {
        let smoke = CreateNativeObject("SmokeGrenadeThrower");
        this.SetQWeapon(smoke, WeaponAttachmentPoint.LEFT);

        let art = CreateNativeObject("ArtilleryStrike");
        this.SetZWeapon(art, WeaponAttachmentPoint.RIGHT);
    }
};