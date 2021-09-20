struct Marine : Object => [
    BaseType = "PlayerObject"]
{
    init => () {
        super();
    }

    OnServerCreate => () {
        "Server Create";
        /*let smoke = CreateNativeObject("SmokeGrenadeThrower");
        SetQWeapon(smoke, WeaponAttachmentPoint.LEFT);

        let art = CreateNativeObject("ArtilleryStrike");
        SetZWeapon(art, WeaponAttachmentPoint.RIGHT);*/
    }
};