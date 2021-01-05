const gameObjectLookup = require('../game-objects');
const Constants = require('../constants');

module.exports = class GameCanvas {
    constructor (clientState, canvas, context) {
        this.canvas = canvas;
        this.clientState = clientState;
        this.context = context;

        this.backgroundGradient = context.createLinearGradient(0, 0, 0, clientState.height);
        this.backgroundGradient.addColorStop(0, "#cbc4d3");
        this.backgroundGradient.addColorStop(0.5, "#d8c39b");
        this.backgroundGradient.addColorStop(1, "#b49862");

        this.Draw();
    }

    Draw() {
        // Serialize all data back out.
        Object.keys(this.clientState.gameObjects).forEach((k) => {
            if (!this.clientState.wasm._IsObjectAlive(k)) {
                delete this.clientState.gameObjects[k];
                return;
            }

            const serializedString = this.clientState.wasm._GetObjectSerialized(k);
            const jsonString = this.clientState.wasm.UTF8ToString(serializedString);
            const serializedObject = JSON.parse(jsonString);
            this.clientState.wasm._free(serializedString);
            const oldClientP = this.clientState.gameObjects[k].client_p;
            this.clientState.gameObjects[k] = serializedObject;
            this.clientState.gameObjects[k].client_p = serializedObject.p;
            // if (oldClientP === undefined) {
            //     this.clientState.gameObjects[k].client_p = this.clientState.gameObjects[k].p;
            // }
            // else {
            //     // Interpolate towards
            //     const final = this.clientState.gameObjects[k].p;
            //     this.clientState.gameObjects[k].client_p = {
            //         x: oldClientP.x + (final.x - oldClientP.x) / 2,
            //         y: oldClientP.y + (final.y - oldClientP.y) / 2
            //     };
            // }
        });

        this.canvas.width  = this.clientState.width;
        this.canvas.height = this.clientState.height;
        this.canvas.style.width  = this.clientState.width + 'px';
        this.canvas.style.height = this.clientState.height + 'px';

        this.context.fillStyle = this.backgroundGradient;
        this.context.fillRect(0, 0, this.clientState.width, this.clientState.height);

        if (this.clientState.localPlayerObjectId) {
            if (this.clientState.gameObjects[this.clientState.localPlayerObjectId]) {
                this.clientState.cameraPos.x = this.clientState.gameObjects[this.clientState.localPlayerObjectId].p.x;
                this.clientState.cameraPos.y = this.clientState.gameObjects[this.clientState.localPlayerObjectId].p.y;
            }
        }

        const cameraTranslation = {
            x: this.clientState.cameraPos.x - this.clientState.width / 2,
            y: this.clientState.cameraPos.y - this.clientState.height / 2
        };

        this.context.translate(-cameraTranslation.x, -cameraTranslation.y);
        this.context.drawImage(this.clientState.mapImage, 0, 0);
        const sorter = [];
        Object.keys(this.clientState.gameObjects).forEach((k) => {
            sorter.push({ id: k, z: this.clientState.gameObjects[k].z });
        });

        sorter.sort((a, b) => a.z - b.z);
        sorter.forEach(pair => {
            const obj = this.clientState.gameObjects[pair.id];
            if (gameObjectLookup[obj.t] !== undefined) {
                if (gameObjectLookup[obj.t].draw) {
                    gameObjectLookup[obj.t].draw(this.context,
                        this.clientState.resourceManager, obj,
                        this.clientState);
                }
            }
            else {
                console.error('Invalid object class', obj.t);
            }
            if (obj.c && !Constants.isProduction && this.clientState.showColliders) {
                for (let i = 0; i < obj.c.length; i++) {
                    const collider = obj.c[i];
                    this.context.strokeStyle = "purple";
                    this.context.lineWidth = 2;
                    if (collider.t === 0) {
                        this.context.strokeRect(obj.p.x + collider.p.x, obj.p.y + collider.p.y, collider.s.x, collider.s.y);
                    }
                    else if (collider.t === 1) {
                        this.context.beginPath();
                        this.context.arc(obj.p.x + collider.p.x, obj.p.y + collider.p.y, collider.r, 0, 2 * Math.PI);
                        this.context.stroke();
                    }
                }
            }
        });

        Object.keys(this.clientState.animations).forEach(k => {
            if (!this.clientState.animations[k].draw(this.context)) {
                delete this.clientState.animations[k];
            }
        });
        this.context.translate(cameraTranslation.x, cameraTranslation.y);

        this.clientState.SendMouseMoveEvent();
        requestAnimationFrame(() => { this.Draw() });
    }
}