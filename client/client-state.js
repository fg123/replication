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

        this.showColliders = false;
        this.localPlayerObjectId = undefined;
        this.localPlayerObject = undefined;
        this.isPaused = true;
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
            tickTime: new PerfTracker(100)
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

        let lastReplicate = Date.now();
        const handler = (ev) => {
            // console.log(ev.data);
            const event = JSON.parse(ev.data);
            // console.log(event);
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

                this.StartGame();
            }
            else if (event["event"] === "hb") {
                lastHeartbeatAcked = 0;
                this.ping = (Date.now() - event.time);
                this.wasm._SetPing(this.ping);
                return;
            }
            else if (event["event"] === "r") {
                const curr = Date.now();
                this.performance.handleReplicateTime.pushValue(curr - lastReplicate);
                lastReplicate = curr;
                const heapString = this.ToHeapString(this.wasm, ev.data);
                this.wasm._HandleReplicate(heapString);
                this.wasm._free(heapString);
            }
            else if (event["event"] === "a") {
                if (event["objs"]) {
                    event["objs"].forEach(obj => {
                        if (animations[obj.k]) {
                            const constructor = animations[obj.k];
                            this.animations[this.nextAnimationKey++] = new constructor(obj, this.resourceManager);
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

    SendInputPacket(input) {
        if (this.localPlayerObjectId !== undefined) {
            input.time = this.wasm._GetLastTickTime() + this.wasm._GetTickInterval();
            // console.log(input);
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
            const curr = Date.now();
            this.performance.tickTime.pushValue(curr - lastTick);
            lastTick = curr;
            this.wasm._TickGame();
        }, tickInterval);

        window.addEventListener('keydown', e => {
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
            this.mouseMovement.x += e.movementX;
            this.mouseMovement.y += e.movementY;
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
        if (this.mouseMovement.x === 0 &&
            this.mouseMovement.y === 0) {
            return;
        }
        this.SendInputPacket({
            event: "mm",
            x: this.mouseMovement.x,
            y: this.mouseMovement.y
        });
        this.mouseMovement.x = 0;
        this.mouseMovement.y = 0;
    }

    GetPlayerObject() {
        return this.localPlayerObject;
    }

    GetObject(id) {
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
};