module.exports = class ClientState {
    constructor(webSocket, wasm, resourceManager, mapImage) {
        this.webSocket = webSocket;
        this.wasm = wasm;
        this.resourceManager = resourceManager;
        this.mapImage = mapImage;
        this.gameObjects = {};
        this.showColliders = false;
        this.localPlayerObjectId = undefined;

        this.StartGame();

        this.width = 0;
        this.height = 0;

        const resize = () => {
            this.width  = window.innerWidth;
            this.height = window.innerHeight;
        };

        this.cameraPos = { x: 0, y: 0 };

        window.addEventListener('resize', resize);
        resize();
    }

    ToHeapString(wasm, str) {
        const length = wasm.lengthBytesUTF8(str) + 1;
        const buffer = wasm._malloc(length);
        wasm.stringToUTF8(str, buffer, length);
        return buffer;
    }
    
    SendInputPacket(input) {
        const inputStr = JSON.stringify(input);
        if (this.webSocket.readyState === WebSocket.OPEN) {
            this.webSocket.send(inputStr);
        }
        if (this.localPlayerObjectId !== undefined) {
            // Serve Inputs into Local
            const heapString = this.ToHeapString(this.wasm, inputStr);
            this.wasm._HandleLocalInput(this.localPlayerObjectId, heapString);
            this.wasm._free(heapString);
        }
    }

    StartGame() {
        this.webSocket.send('{"event":"rdy"}');

        setInterval(() => {
            // Heartbeat Send
            this.webSocket.send('{"event":"hb"}');
        }, 10000);

        this.webSocket.onmessage = (ev) => {
            const events = JSON.parse(ev.data);
            if (events["playerLocalObjectId"]) {
                console.log("Player Local ID", events);
                if (events["playerLocalObjectId"] === 0) {
                    this.localPlayerObjectId = undefined;
                }
                else {
                    this.localPlayerObjectId = events["playerLocalObjectId"];
                }
            }
            else {
                const heapString = this.ToHeapString(this.wasm, ev.data);
                this.wasm._HandleReplicate(heapString);
                this.wasm._free(heapString);
                events.forEach(obj => {
                    if (this.gameObjects[obj.id] === undefined) {
                        // New Object
                        this.gameObjects[obj.id] = { id: obj.id };
                    }
                });
            }
        };

        this.Tick();

        window.addEventListener('keydown', e => {
            if (e.repeat) { return; }
            this.SendInputPacket({
                event: "kd",
                key: e.keyCode
            });
        });

        window.addEventListener('keyup', e => {
            this.SendInputPacket({
                event: "ku",
                key: e.keyCode
            });
            if (e.key === "1") {
                this.showColliders = !this.showColliders;
            }
        });

        let lastMouseMoveSend = Date.now();
        window.addEventListener('mousemove', e => {
            // Rate limit this!!
            const current = Date.now();
            if (current - lastMouseMoveSend > 30) {
                lastMouseMoveSend = current;
                this.SendInputPacket({
                    event: "mm",
                    x: e.pageX + this.cameraPos.x - (this.width / 2),
                    y: e.pageY + this.cameraPos.y - (this.height / 2)
                });
            }
        });

        window.addEventListener('mousedown', e => {
            this.SendInputPacket({
                event: "md",
                button: e.which
            });
        });

        window.addEventListener('mouseup', e => {
            this.SendInputPacket({
                event: "mu",
                button: e.which
            });
        })
    }
    
    GetPlayerObject() {
        if (this.localPlayerObjectId === undefined) return undefined;
        return this.gameObjects[this.localPlayerObjectId];
    }

    Tick() {
        const currentTime = Date.now();
        const wasm = this.wasm;
        Object.keys(this.gameObjects).forEach((k) => {
            if (!wasm._IsObjectAlive(k)) {
                delete this.gameObjects[k];
                return;
            }

            const serializedString = wasm._GetObjectSerialized(k);
            const jsonString = wasm.UTF8ToString(serializedString);
            const serializedObject = JSON.parse(jsonString);
            wasm._free(serializedString);
            this.gameObjects[k] = serializedObject;
        });

        // context.font = "20px monospace";
        // context.fillStyle = "black";
        // context.fillText(Math.ceil(1000 / deltaTime), 5, 20);
        // lastTime = currentTime;
        wasm._TickGame(currentTime);
        requestAnimationFrame(() => { this.Tick() });
    }
};