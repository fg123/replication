const Constants = require('./constants');
const PerfTracker = require('./perf-tracker');

const animations = require('./animations');

const SIMULATED_LAG = Constants.isProduction ? 0 : 30;

module.exports = class ClientState {
    constructor(webSocket, wasm, resourceManager) {
        this.webSocket = webSocket;
        this.wasm = wasm;
        this.resourceManager = resourceManager;
        this.animations = {};
        this.nextAnimationKey = 1;

        this.cachedObjects = {};

        this.localPlayerObjectId = undefined;
        this.localPlayerObject = undefined;
        this.game = undefined;

        this.wasmVector3Location = this.wasm._malloc(3 * 4);

        this.isPaused = true;
        this.showInventory = false;

        this.events = {};

        this.ping = 0;
        this.width = 0;
        this.height = 0;

        this.models = [];

        this.rawMousePos = {
            x: 0,
            y: 0
        };

        this.mouseMovement = {
            x: 0,
            y: 0
        };

        const resize = () => {
            this.width  = window.innerWidth;
            this.height = window.innerHeight;
        };

        this.cameraPos = { x: 0, y: 0, z: 0 };
        this.cameraRot = { x: 0, y: 0, z: 1 };

        window.addEventListener('resize', resize);
        resize();

        this.performance = {
            handleReplicateTime: new PerfTracker(100),
            tickTime: new PerfTracker(100),
            tickInterval: new PerfTracker(100),
            replicateObjectCount: new PerfTracker(100),
            drawTime: new PerfTracker(100)
        };

        this.SetupSocketHandler();

        this.SendData(JSON.stringify({
            event: "globalSettings"
        }));
    }

    SetupSocketHandler() {
        // This is 0 if it gets acknowledged
        let lastHeartbeatAcked = 0;
        setInterval(() => {
            // Heartbeat Send (for ping)
            if (lastHeartbeatAcked !== 0) {
                // Last one didn't get acked! >1000 ping = close
                this.ping = Date.now() - lastHeartbeatAcked;
                // console.log("Last heartbeat didn't get acked! Closing socket.");
                // console.log(this.webSocket);
                // this.webSocket.terminate();
                // console.log(this.webSocket);
                return;
            }
            const currTime = Date.now();
            const hb = {
                event: "hb",
                time: currTime
            };
            this.SendData(JSON.stringify(hb));
            lastHeartbeatAcked = currTime;
        }, 1000);

        const handler = (ev) => {
            // console.log(ev.data);
            const event = JSON.parse(ev.data);
            console.log(event);
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
            else if (event["globalSettings"] !== undefined) {
                // We can actually start now
                const heapString = this.ToHeapString(this.wasm, ev.data);
                this.wasm._LoadGlobalSettings(heapString);
                this.wasm._free(heapString);

                // Map has been loaded, setup opengl
                this.wasm._SetupClientGL();
                this.StartGame();
            }
            else if (event["event"] === "hb") {
                lastHeartbeatAcked = 0;
                this.ping = (Date.now() - event.time);
                this.wasm._SetPing(this.ping);
                return;
            }
            else if (event["event"] === "r") {
                this.performance.replicateObjectCount.pushValue(event["objs"].length);
                const startTime = Date.now();
                const heapString = this.ToHeapString(this.wasm, ev.data);
                this.wasm._HandleReplicate(heapString);
                this.wasm._free(heapString);
                const endTime = Date.now();
                this.performance.handleReplicateTime.pushValue(endTime - startTime);
            }
            else if (event["event"] === "a") {
                if (event["objs"]) {
                    event["objs"].forEach(obj => {
                        if (animations[obj.k]) {
                            if (obj.player === this.localPlayerObjectId || obj.player === 0) {
                                const constructor = animations[obj.k];
                                this.animations[this.nextAnimationKey++] = new constructor(obj, this.resourceManager);
                            }
                        }
                        else {
                            console.error(obj.k, "is not a valid animation key!");
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
    }
    ToHeapString(wasm, str) {
        const length = wasm.lengthBytesUTF8(str) + 1;
        const buffer = wasm._malloc(length);
        wasm.stringToUTF8(str, buffer, length);
        return buffer;
    }

    SendCharacterSelection(selection) {
        console.log("Changing selection", selection);
        this.SendData(JSON.stringify(
            {
                "event":"setchar",
                "char": selection
            }));
    }

    WorldToScreenCoordinates(location) {
        // console.log("INPUT", location);
        const offset = this.wasmVector3Location / 4;
        this.wasm.HEAPF32[offset] = location.x;
        this.wasm.HEAPF32[offset + 1] = location.y;
        this.wasm.HEAPF32[offset + 2] = location.z;
        this.wasm._WorldToScreenCoordinates(this.wasmVector3Location);

        const output = {
            x: this.wasm.HEAPF32[offset],
            y: this.wasm.HEAPF32[offset + 1]
        };
        // console.log("OUTPUT", output);
        return output;
    }

    SendInputPacket(input) {
        // All events go into game
        // input.time = this.wasm._GetLastTickTime() + this.wasm._GetTickInterval();
        // // console.log(input);
        // const inputStr = JSON.stringify(input);
        // if (this.webSocket.readyState === WebSocket.OPEN) {
        //     this.SendData(inputStr);
        // }

        // // Serve Inputs into Local
        // const heapString = this.ToHeapString(this.wasm, inputStr);
        // this.wasm._HandleLocalInput(heapString);
        // this.wasm._free(heapString);

        if (this.localPlayerObjectId !== undefined) {
            input.time = this.wasm._GetLastTickTime() + this.wasm._GetTickInterval();
            // console.log(input);
            const inputStr = JSON.stringify(input);

            // Serve Inputs into Local
            const heapString = this.ToHeapString(this.wasm, inputStr);
            if (this.wasm._HandleLocalInput(this.localPlayerObjectId, heapString)) {
                if (this.webSocket.readyState === WebSocket.OPEN) {
                    this.SendData(inputStr);
                }
            }
            this.wasm._free(heapString);
        }
    }

    RegisterEvent(event, fn) {
        this.events[event] = fn;
    }

    SendData(data) {
        if (SIMULATED_LAG !== 0) {
            setTimeout(() => {
                if (this.webSocket.readyState === WebSocket.OPEN) {
                    this.webSocket.send(data);
                }
            }, SIMULATED_LAG / 2);
        }
        else {
            if (this.webSocket.readyState === WebSocket.OPEN) {
                this.webSocket.send(data);
            }
        }
    }

    StartGame() {
        const rdyTick = this.wasm._GetLastTickTime();
        console.log("Sending RDY_SYNC", rdyTick);
        this.SendData(JSON.stringify({
            "event": "rdy",
            "time": rdyTick
        }));

        const tickInterval = this.wasm._GetTickInterval();

        let lastTick = Date.now();

        setInterval(() => {
            const preTick = Date.now();
            this.wasm._SetIsPaused(this.isPaused);
            this.wasm._SetIsInventoryOpen(this.showInventory);
            this.wasm._TickGame();
            const now = Date.now();
            this.performance.tickTime.pushValue(now - preTick);
            const diff = now - lastTick;
            this.performance.tickInterval.pushValue(diff);
            lastTick = now;
        }, tickInterval);

        window.addEventListener('keydown', e => {
            if (!this.isPaused) {
                e.preventDefault();
            }
            if (!e.repeat) {
                this.SendInputPacket({
                    event: "kd",
                    key: e.keyCode,
                    ctrl: e.ctrlKey,
                    shift: e.shiftKey,
                    alt: e.altKey,
                });
            }
            if (e.keyCode === 9) {
                e.preventDefault();
                if (!this.isPaused) {
                    this.showInventory = true;
                    document.exitPointerLock();
                }
                else {
                    this.showInventory = false;
                    this.game.canvas.requestPointerLock();
                }
            }
        });

        window.addEventListener('keyup', e => {
            if (!this.isPaused) {
                e.preventDefault();
            }
            this.SendInputPacket({
                event: "ku",
                key: e.keyCode,
				ctrl: e.ctrlKey,
				shift: e.shiftKey,
				alt: e.altKey,
            });
        });

        window.addEventListener('mousemove', e => {
            this.rawMousePos.x = e.pageX;
            this.rawMousePos.y = e.pageY;
            this.mouseMovement.x += e.movementX;
            this.mouseMovement.y += e.movementY;
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
        });

        window.addEventListener('wheel', e => {
            this.SendInputPacket({
                event: "mw",
                x: e.deltaX,
                y: e.deltaY
            });
        });
    }

    SendMouseMoveEvent() {
        if (this.mouseMovement.x === 0 &&
            this.mouseMovement.y === 0) {
            return;
        }
        this.SendInputPacket({
            event: "mm",
            x: this.mouseMovement.x,
            y: this.mouseMovement.y,
            rx: this.rawMousePos.x,
            ry: this.rawMousePos.y
        });
        this.mouseMovement.x = 0;
        this.mouseMovement.y = 0;
    }

    GetPlayerObject() {
        return this.localPlayerObject;
    }

    GetDefaultPlayerSettings() {
        const serializedString = this.wasm._GetDefaultPlayerSettings();
        const jsonString = this.wasm.UTF8ToString(serializedString);
        const serializedObject = JSON.parse(jsonString);
        this.wasm._free(serializedString);
        return serializedObject;
    }

    ApplyPlayerSettings(settings) {
        const input = {
            "event": "playerSettings",
            "settings": settings
        };
        const inputStr = JSON.stringify(input);
        if (this.webSocket.readyState === WebSocket.OPEN) {
            this.SendData(inputStr);
        }

        // Serve Inputs into Local
        const heapString = this.ToHeapString(this.wasm, JSON.stringify(settings));
        this.wasm._ApplyPlayerSettings(this.localPlayerObjectId, heapString);
        this.wasm._free(heapString);
    }

    GetObject(id) {
        if (id === undefined) return undefined;
        if (!this.wasm._IsObjectAlive(id)) {
            delete this.cachedObjects[id];
            return undefined;
        }
        if (this.cachedObjects[id] === undefined ||
            this.wasm._IsObjectDirty(id)) {
            const serializedString = this.wasm._GetObjectSerialized(id);
            const jsonString = this.wasm.UTF8ToString(serializedString);
            const serializedObject = JSON.parse(jsonString);
            this.wasm._free(serializedString);
            this.cachedObjects[id] = serializedObject;
        }
        return this.cachedObjects[id];
    }

    InventoryDrop(id) {
        this.SendInputPacket({
            event: "inventoryDrop",
            id: id
        });
        // this.SendData(JSON.stringify(
        //     {
        //         "time": this.wasm._GetLastTickTime() + this.wasm._GetTickInterval(),
        //         "event": "inventoryDrop",
        //         "id": id
        //     }));
    }

    SwapPrimaryAndSecondary() {
        this.SendInputPacket({
            event: "inventorySwap",
            id: id
        });
        // this.SendData(JSON.stringify(
        //     {
        //         "time": this.wasm._GetLastTickTime() + this.wasm._GetTickInterval(),
        //         "event": "inventorySwap"
        //     }));
    }
};