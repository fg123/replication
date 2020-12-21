const Constants = require('./constants');
const gameObjectLookup = require('./game-objects');
const ResourceManager = require('./resource-manager');
const Client = require(Constants.isProduction ? './game_client_prod' : './game_client');
const { createMap } = require('./map');

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
    const protocol = Constants.isProduction ? 'wss' : 'ws';
    const webSocket = new WebSocket(protocol + '://' + location.hostname + ':8080/connect');
    webSocket.onopen = function (event) {
        console.log('Loading Resource Manager');
        const resourceManager = new ResourceManager(() => {
            createMap("data/maps/map1.json", resourceManager, (mapImage) => {
                console.log('Starting Game');
                StartGame({
                    webSocket,
                    wasm: instance,
                    resourceManager,
                    mapImage
                });
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
    const { wasm, webSocket, resourceManager, mapImage } = modules;
    const gameObjects = {};

    let showColliders = false;

    webSocket.send('{"event":"rdy"}');

    setInterval(() => {
        webSocket.send('{"event":"hb"}');
    }, 10000);

    webSocket.onmessage = function (ev) {
        const events = JSON.parse(ev.data);
        if (events["playerLocalObjectId"]) {
            console.log("player Local id", events);
            localPlayerObjectId = events["playerLocalObjectId"];
        }
        else {
            const heapString = ToHeapString(wasm, ev.data);
            wasm._HandleReplicate(heapString);
            wasm._free(heapString);
            events.forEach(obj => {
                if (gameObjects[obj.id] === undefined) {
                    // New Object
                    gameObjects[obj.id] = { id: obj.id };
                }
            });
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

    const cameraPos = { x: 0, y: 0 };

    const backgroundGradient = context.createLinearGradient(0, 0, 0, height);
    backgroundGradient.addColorStop(0, "#cbc4d3");
    backgroundGradient.addColorStop(0.5, "#d8c39b");
    backgroundGradient.addColorStop(1, "#b49862");
    
    tick();

    function tick() {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        
        context.fillStyle = backgroundGradient;
        context.fillRect(0, 0, width, height);
        if (localPlayerObjectId && gameObjects[localPlayerObjectId].p) {
            cameraPos.x = gameObjects[localPlayerObjectId].p.x;
            cameraPos.y = gameObjects[localPlayerObjectId].p.y;
        }

        const cameraTranslation = { 
            x: cameraPos.x - width / 2,
            y: cameraPos.y - height / 2
        };
       
        context.translate(-cameraTranslation.x, -cameraTranslation.y);
        context.drawImage(mapImage, 0, 0);
        const sorter = [];
        Object.keys(gameObjects).forEach((k) => {
            if (!wasm._IsObjectAlive(k)) {
                delete gameObjects[k];
                return;
            }

            const serializedString = wasm._GetObjectSerialized(k);
            const jsonString = wasm.UTF8ToString(serializedString);
            const serializedObject = JSON.parse(jsonString);
            wasm._free(serializedString);
            gameObjects[k] = serializedObject;
            sorter.push({ id: k, z: serializedObject.z });
        });

        sorter.sort((a, b) => a.z - b.z);
        sorter.forEach(pair => {
            const obj = gameObjects[pair.id];
            
            if (gameObjectLookup[obj.t] !== undefined) {
                if (gameObjectLookup[obj.t].draw) {
                    gameObjectLookup[obj.t].draw(context, resourceManager,
                        obj, gameObjects);
                }
            }
            else {
                console.error('Invalid object class', obj.t);
            }
            if (obj.c && !Constants.isProduction && showColliders) {
                for (let i = 0; i < obj.c.length; i++) {
                    const collider = obj.c[i];
                    context.strokeStyle = "purple";
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
        context.translate(cameraTranslation.x, cameraTranslation.y);

        context.font = "20px monospace";
        context.fillStyle = "black";
        context.fillText(Math.ceil(1000 / deltaTime), 5, 20);
        lastTime = currentTime;
        wasm._TickGame(currentTime);
        requestAnimationFrame(tick);
    }

    window.addEventListener('keydown', e => {
        if (e.repeat) { return; }
        sendInputPacket({
            event: "kd",
            key: e.keyCode
        });
    });

    window.addEventListener('keyup', e => {
        sendInputPacket({
            event: "ku",
            key: e.keyCode
        });
        if (e.key === "1") {
            showColliders = !showColliders;
        }
    });

    let lastMouseMoveSend = Date.now();
    window.addEventListener('mousemove', e => {
        // Rate limit this!!
        const current = Date.now();
        if (current - lastMouseMoveSend > 30) {
            lastMouseMoveSend = current;
            sendInputPacket({
                event: "mm",
                x: e.pageX + cameraPos.x - (width / 2),
                y: e.pageY + cameraPos.y - (height / 2)
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
