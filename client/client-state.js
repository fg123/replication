const Constants = require('./constants');

const SIMULATED_LAG = Constants.isProduction ? 0 : 0;

module.exports = class ClientState {
    constructor(webSocket, wasm, resourceManager, mapImage) {
        this.webSocket = webSocket;
        this.wasm = wasm;
        this.resourceManager = resourceManager;
        this.mapImage = mapImage;
        this.gameObjects = {};
        this.showColliders = false;
        this.localPlayerObjectId = undefined;
        this.isPaused = false;
        this.events = {};

        this.StartGame();

        this.ping = 0;
        this.width = 0;
        this.height = 0;

        this.lastMouseMoveSend = 0;
        this.rawMousePos = {
            x: 0,
            y: 0
        };

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

    SendCharacterSelection(selection) {
        console.log("Changing selection", selection);
        this.webSocket.send(JSON.stringify(
            {
                "event":"setchar",
                "char": selection
            }));
    }

    SendInputPacket(input) {
        if (this.localPlayerObjectId !== undefined) {
            input.time = this.wasm._GetLastTickTime();
            const inputStr = JSON.stringify(input);
            if (this.webSocket.readyState === WebSocket.OPEN) {
                this.SendData(inputStr);
            }

            // Serve Inputs into Local
            const heapString = this.ToHeapString(this.wasm, inputStr);
            this.wasm._HandleLocalInput(this.localPlayerObjectId, heapString);
            this.wasm._free(heapString);
        }
    }

    RegisterEvent(event, fn) {
        this.events[event] = fn;
    }

    SendData(data) {
        if (SIMULATED_LAG !== 0) {
            setTimeout(() => {
                this.webSocket.send(data);
            }, SIMULATED_LAG / 2);
        }
        else {
            this.webSocket.send(data);
        }
    }

    StartGame() {
        const rdyTick = this.wasm._GetLastTickTime();
        console.log("Sending RDY_SYNC", rdyTick);
        this.SendData(JSON.stringify({
            "event": "rdy",
            "time": rdyTick
        }));

        setInterval(() => {
            // Heartbeat Send (for ping)
            const hb = {
                event: "hb",
                time: Date.now()
            };
            this.SendData(JSON.stringify(hb));
        }, 1000);

        const tickInterval = this.wasm._GetTickInterval();
        setInterval(() => {
            // To ensure fixed time step
            this.wasm._TickGame();
        }, tickInterval);

        const handler = (ev) => {
            const event = JSON.parse(ev.data);
            if (event["playerLocalObjectId"] !== undefined) {
                console.log("Player Local ID", event);
                const id = event["playerLocalObjectId"];

                this.wasm._SetLocalPlayerClient(id);
                if (id === 0) {
                    this.localPlayerObjectId = undefined;
                }
                else {
                    this.localPlayerObjectId = id;
                }
                return;
            }
            else if (event["event"] == "hb") {
                this.ping = (Date.now() - event.time);
                this.wasm._SetPing(this.ping);
                return;
            }
            else if (event["event"] == "r") {
                const heapString = this.ToHeapString(this.wasm, ev.data);
                this.wasm._HandleReplicate(heapString);
                this.wasm._free(heapString);
                if (event["objs"]) {
                    event["objs"].forEach(obj => {
                        if (this.gameObjects[obj.id] === undefined) {
                            // New Object
                            this.gameObjects[obj.id] = { id: obj.id };
                        }
                    });
                }
            }
            const allRegistered = Object.keys(this.events);
            for (let i = 0; i < allRegistered.length; i++) {
                if (event[allRegistered[i]]) {
                    this.events[allRegistered[i]](event);
                }
            }
        };
        this.webSocket.onmessage = (ev) => {
            if (SIMULATED_LAG !== 0) {
                setTimeout(() => { handler(ev); }, SIMULATED_LAG / 2);
            }
            else {
                handler(ev);
            }
        };

        this.Tick();

        window.addEventListener('keydown', e => {
            if (e.key === "Escape") {
                this.isPaused = !this.isPaused;
            }
            if (!e.repeat) {
                this.SendInputPacket({
                    event: "kd",
                    key: e.keyCode
                });
            }
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

        window.addEventListener('mousemove', e => {
            this.rawMousePos.x = e.pageX;
            this.rawMousePos.y = e.pageY;
        });

        window.addEventListener('mousedown', e => {
            if (!this.isPaused) {
                this.SendInputPacket({
                    event: "md",
                    button: e.which
                });
            }
        });

        window.addEventListener('mouseup', e => {
            if (!this.isPaused) {
                this.SendInputPacket({
                    event: "mu",
                    button: e.which
                });
            }
        });
    }

    SendMouseMoveEvent() {
        const current = this.wasm._GetLastTickTime();
        if (current - this.lastMouseMoveSend > 30 || current < this.lastMouseMoveSend) {
            this.lastMouseMoveSend = current;
            this.SendInputPacket({
                event: "mm",
                x: this.rawMousePos.x + this.cameraPos.x - (this.width / 2),
                y: this.rawMousePos.y + this.cameraPos.y - (this.height / 2)
            });
        }
    }

    GetPlayerObject() {
        if (this.localPlayerObjectId === undefined) return undefined;
        return this.gameObjects[this.localPlayerObjectId];
    }

    Tick() {
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
        requestAnimationFrame(() => { this.Tick() });
    }
};