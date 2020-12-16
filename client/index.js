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

    const heapString = ToHeapString(instance, "Hello");
    console.log(instance._HandleReplicate(heapString)); // direct calling works
    instance._free(heapString);

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

// Main Game Start (after everything has started)
function StartGame(modules) {
    const { wasm, webSocket, resourceManager } = modules;
    const gameObjects = {};

    webSocket.onmessage = function (ev) {
        const heapString = ToHeapString(wasm, ev.data);
        wasm._HandleReplicate(heapString);
        wasm._free(heapString);
    
        const obj = JSON.parse(ev.data);
        gameObjects[obj.id] = obj;
        // console.log(obj);
    };
    
    let lastTime = Date.now();
        
    tick();

    function tick() {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        context.clearRect(0, 0, width, height);

        Object.keys(gameObjects).forEach((k) => {
            const obj = gameObjects[k];
            if (!wasm._IsObjectAlive(obj.id)) {
                delete gameObjects[k];
                return;
            }
            if (gameObjectLookup[obj.t] !== undefined) {
                obj.p.x = wasm._GetObjectX(obj.id);
                obj.p.y = wasm._GetObjectY(obj.id);
                gameObjectLookup[obj.t].draw(context, resourceManager, obj, gameObjects);
            }
            else {
                console.error('Invalid object class', obj.t);
            }
            // Local Simulation
            // if (obj.c) {
            //     for (let i = 0; i < obj.c.length; i++) {
            //         const collider = obj.c[i];
            //         context.strokeStyle = "black";
            //         context.lineWidth = 2;
            //         if (collider.t === 0) {
            //             context.strokeRect(collider.p.x, collider.p.y, collider.size.x, collider.size.y);
            //         }
            //         else if (collider.t === 1) {
            //             context.beginPath();
            //             context.arc(collider.p.x, collider.p.y, collider.radius, 0, 2 * Math.PI);
            //             context.stroke();
            //         }
            //     }
            // }
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
        webSocket.send(JSON.stringify({
            event: "keydown",
            key: e.key
        }));
    });

    // window.addEventListener('mousedown', e => {
    //     webSocket.send(JSON.stringify({
    //         event: "mousedown",
    //         key: e
    //     }));
    // });
    window.addEventListener('keyup', e => {
        webSocket.send(JSON.stringify({
            event: "keyup",
            key: e.key
        }));
    });

    let lastMouseMoveSend = Date.now();
    window.addEventListener('mousemove', e => {
        // Rate limit this!!
        const current = Date.now();
        if (current - lastMouseMoveSend > 30) {
            lastMouseMoveSend = current;
            webSocket.send(JSON.stringify({
                event: "mousemove",
                x: e.pageX,
                y: e.pageY
            }));
        }
    })
}
