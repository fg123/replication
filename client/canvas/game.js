

module.exports = class GameCanvas {
    constructor (clientState, canvas) {
        this.canvas = canvas;
        this.clientState = clientState;
        this.pointerLocked = false;

        document.addEventListener('pointerlockchange', () => {
            this.pointerLocked = document.pointerLockElement === this.canvas;
        }, false);
        window.addEventListener("click", () => {
            console.log("Click");
            this.canvas.requestPointerLock = this.canvas.requestPointerLock;
            this.canvas.requestPointerLock();
        });

        this.clientState.wasm._SetupClientContext();

        this.Draw();
    }

    Draw() {
        // Serialize all data back out.
        if (this.clientState.localPlayerObjectId !== undefined) {
            const serializedString = this.clientState.wasm._GetObjectSerialized(
                this.clientState.localPlayerObjectId
            );
            const jsonString = this.clientState.wasm.UTF8ToString(serializedString);
            const serializedObject = JSON.parse(jsonString);
            this.clientState.wasm._free(serializedString);
            this.clientState.localPlayerObject = serializedObject;
        }

        this.canvas.width  = this.clientState.width;
        this.canvas.height = this.clientState.height;
        this.canvas.style.width  = this.clientState.width + 'px';
        this.canvas.style.height = this.clientState.height + 'px';
        this.clientState.wasm._Draw(this.clientState.width, this.clientState.height);

        if (this.clientState.localPlayerObjectId) {
            if (this.clientState.localPlayerObject) {
                this.clientState.cameraPos.x = this.clientState.localPlayerObject.client_p.x;
                this.clientState.cameraPos.y = this.clientState.localPlayerObject.client_p.y;
                this.clientState.cameraPos.z = this.clientState.localPlayerObject.client_p.z;

                this.clientState.cameraRot.x = this.clientState.localPlayerObject.ld.x;
                this.clientState.cameraRot.y = this.clientState.localPlayerObject.ld.y;
                this.clientState.cameraRot.z = this.clientState.localPlayerObject.ld.z;
            }
        }

        if (this.pointerLocked) {
            this.clientState.SendMouseMoveEvent();
        }
        requestAnimationFrame(() => { this.Draw() });
    }
}