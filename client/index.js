const gameObjectLookup = require('./game-objects');
const ResourceManager = require('./resource-manager');
const Client = require('./game_client');

function ToHeapString(wasm, str) {
    const length = wasm.lengthBytesUTF8(str) + 1;
    const buffer = wasm._malloc(length);
    wasm.stringToUTF8(str, buffer, length);
    return buffer;
}

console.log('Loading Game WASM');
Client().then((instance) => {
    console.log(instance);
    console.log('Loading Web Socket');
    const webSocket = new WebSocket('ws://localhost:8080/connect');
    webSocket.onopen = function (event) {
        console.log('Loading Resource Manager');
        const resourceManager = new ResourceManager(() => {
            console.log('Starting Game');
            StartGame({
                webSocket,
                wasm: instance,
                resourceManager
            });
        });
    };
}).catch(error => console.error(error));


// INITIALIZATION
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

let width = 0;
let height = 0;

function resize() {
    width  = window.innerWidth;
    height = window.innerHeight;
    canvas.width  = width;
    canvas.height = height;
    canvas.style.width  = width + 'px';
    canvas.style.height = height + 'px';
}

window.addEventListener('resize', resize);
resize();

let localPlayerObjectId = undefined;

// Main Game Start (after everything has started)
function StartGame(modules) {
    const { wasm, webSocket, resourceManager } = modules;
    const gameObjects = {};

    webSocket.onmessage = function (ev) {
        const obj = JSON.parse(ev.data);
        if (obj["playerLocalObjectId"]) {
            localPlayerObjectId = obj["playerLocalObjectId"];
        }
        else {
            const heapString = ToHeapString(wasm, ev.data);
            wasm._HandleReplicate(heapString);
            wasm._free(heapString);
            gameObjects[obj.id] = obj;
        }
    };

    function sendInputPacket(input) {
        const inputStr = JSON.stringify(input);
        webSocket.send(inputStr);
        if (localPlayerObjectId !== undefined) {
            // Serve Inputs into Local
            const heapString = ToHeapString(wasm, inputStr);
            wasm._HandleLocalInput(localPlayerObjectId, heapString);
            wasm._free(heapString);
        }
    }

    let lastTime = Date.now();

    const backgroundGradient = context.createLinearGradient(0, 0, 0, height);
    backgroundGradient.addColorStop(0, "#cbc4d3");
    backgroundGradient.addColorStop(0.5, "#d8c39b");
    backgroundGradient.addColorStop(1, "#b49862");
    
    tick();

    function tick() {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        
        // Create Gradient
        context.fillStyle = backgroundGradient;
        context.fillRect(0, 0, width, height);

        Object.keys(gameObjects).forEach((k) => {
            const obj = gameObjects[k];
            if (!wasm._IsObjectAlive(obj.id)) {
                delete gameObjects[k];
                return;
            }
            if (gameObjectLookup[obj.t] !== undefined) {
                const serializedString = wasm._GetObjectSerialized(obj.id);
                const jsonString = wasm.UTF8ToString(serializedString);
                const serializedObject = JSON.parse(jsonString);
                wasm._free(serializedString);
                gameObjects[k] = serializedObject;
                gameObjectLookup[obj.t].draw(context, resourceManager, serializedObject, gameObjects);
            }
            else {
                console.error('Invalid object class', obj.t);
            }
            // Local Simulation
            if (obj.c) {
                for (let i = 0; i < obj.c.length; i++) {
                    const collider = obj.c[i];
                    context.strokeStyle = "black";
                    context.lineWidth = 2;
                    if (collider.t === 0) {
                        context.strokeRect(obj.p.x + collider.p.x, obj.p.y + collider.p.y, collider.size.x, collider.size.y);
                    }
                    else if (collider.t === 1) {
                        context.beginPath();
                        context.arc(obj.p.x + collider.p.x, obj.p.y + collider.p.y, collider.radius, 0, 2 * Math.PI);
                        context.stroke();
                    }
                }
            }
        });
        Object.keys(gameObjects).forEach((k) => {
            const obj = gameObjects[k];
            if (gameObjectLookup[obj.t] !== undefined) {
                if (gameObjectLookup[obj.t].postDraw) {
                    gameObjectLookup[obj.t].postDraw(context, resourceManager, obj, gameObjects);
                }
            }
            else {
                console.error('Invalid object class', obj.t);
            }
        });
        lastTime = currentTime;
        wasm._TickGame(currentTime);
        requestAnimationFrame(tick);
    }

    window.addEventListener('keydown', e => {
        if (e.repeat) { return; }
        sendInputPacket({
            event: "kd",
            key: e.key
        });
    });

    window.addEventListener('keyup', e => {
        sendInputPacket({
            event: "ku",
            key: e.key
        });
    });

    let lastMouseMoveSend = Date.now();
    window.addEventListener('mousemove', e => {
        // Rate limit this!!
        const current = Date.now();
        if (current - lastMouseMoveSend > 30) {
            lastMouseMoveSend = current;
            sendInputPacket({
                event: "mm",
                x: e.pageX,
                y: e.pageY
            });
        }
    });

    window.addEventListener('mousedown', e => {
        sendInputPacket({
            event: "md",
            button: e.which
        });
    });

    window.addEventListener('mouseup', e => {
        sendInputPacket({
            event: "mu",
            button: e.which
        });
    })
}
