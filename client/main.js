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

const gameObjects = {};
const webSocket = new WebSocket('ws://localhost:8080/connect');
webSocket.onopen = function (event) {
    console.log('Connected');
};

webSocket.onmessage = function (ev) {
    const obj = JSON.parse(ev.data);
    gameObjects[obj.id] = obj;
    console.log(obj);
};

let lastTime = Date.now();

function tick() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    context.clearRect(0, 0, width, height);

    Object.keys(gameObjects).forEach((k) => {
        const obj = gameObjects[k];

        if (obj.t === 'RectangleObject') {
            context.fillStyle = "red";
            context.fillRect(obj.p.x, obj.p.y, obj.size.x, obj.size.y);
        }
        else if (obj.t === 'CircleObject') {
            context.fillStyle = "blue";
            context.beginPath();
            context.arc(obj.p.x, obj.p.y, obj.radius, 0, 2 * Math.PI);
            context.fill();
        }
        context.fillStyle = "black";
        context.fillText(JSON.stringify(obj.v) + " " + obj.tags, obj.p.x, obj.p.y);
        if (obj.c) {
            for (let i = 0; i < obj.c.length; i++) {
                const collider = obj.c[i];
                context.strokeStyle = "black";
                context.lineWidth = 2;
                if (collider.t === 0) {
                    context.strokeRect(collider.p.x, collider.p.y, collider.size.x, collider.size.y);
                }
                else if (collider.t === 1) {
                    context.beginPath();
                    context.arc(collider.p.x, collider.p.y, collider.radius, 0, 2 * Math.PI);
                    context.stroke();
                }
            }
        }
        
        // Local Simulation
        // obj.p.x += obj.v.x * (deltaTime / 1000.0);
        // obj.p.y += obj.v.y * (deltaTime / 1000.0);
    });
    lastTime = currentTime;
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

tick();

