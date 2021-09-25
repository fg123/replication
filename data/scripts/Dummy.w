struct Dummy : Player => {
    init => () {
        super();
    }

    OnTakeDamage => (damage) {
        this.SetHealth(100);
    }
};