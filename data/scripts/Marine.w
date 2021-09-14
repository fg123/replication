struct Marine : Player => {
    init => () {
        super();
    }

    OnServerCreate => () {
        CreateObject("BouncingBall");
    }
};