

module.exports = class GameCanvas {
    constructor (clientState, canvas) {
        this.canvas = canvas;
        this.clientState = clientState;

        document.addEventListener('pointerlockchange', () => {
            this.clientState.isPaused = document.pointerLockElement !== this.canvas;
        }, false);

        // window.addEventListener("click", () => {
        //     console.log("Click");
        //     this.canvas.requestPointerLock();
        // });

        this.clientState.wasm._SetupClientContext();
        this.Draw();
    }

    Draw() {
        requestAnimationFrame(() => { this.Draw() });

        const preDraw = Date.now();

        // Serialize all data back out.
        if (this.clientState.localPlayerObjectId !== undefined) {
            if (this.clientState.wasm._IsObjectAlive(this.clientState.localPlayerObjectId)) {
                const serializedString = this.clientState.wasm._GetObjectSerialized(
                    this.clientState.localPlayerObjectId
                );
                const jsonString = this.clientState.wasm.UTF8ToString(serializedString);
                const serializedObject = JSON.parse(jsonString);
                this.clientState.wasm._free(serializedString);
                this.clientState.localPlayerObject = serializedObject;
            }
            else {
                this.clientState.localPlayerObject = undefined;
            }
        }

        this.canvas.width  = this.clientState.width;
        this.canvas.height = this.clientState.height;
        this.canvas.style.width  = this.clientState.width + 'px';
        this.canvas.style.height = this.clientState.height + 'px';
        this.clientState.wasm._Draw(this.clientState.width, this.clientState.height);

        this.clientState.wasm._TickAudio();

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

        if (!this.clientState.isPaused) {
            this.clientState.SendMouseMoveEvent();
        }

        const postDraw = Date.now();
        this.clientState.performance.drawTime.pushValue(postDraw - preDraw);
    }
}