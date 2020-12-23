const Constants = require('./constants');
const ResourceManager = require('./resource-manager');
const Client = require(Constants.isProduction ? './game_client_prod' : './game_client');
const { createMap } = require('./map');
const ClientState = require('./client-state');
const GameCanvas = require('./canvas/game');


const gameCanvas = document.getElementById('game');
const gameContext = gameCanvas.getContext('2d');

const uiCanvas = document.getElementById('ui');
const uiContext = uiCanvas.getContext('2d');

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
                const clientState = new ClientState(webSocket, instance, resourceManager, mapImage);
                new GameCanvas(clientState, gameCanvas, gameContext);

                console.log('Starting Game');
                // StartGame({
                //     webSocket,
                //     wasm: instance,
                //     resourceManager,
                //     mapImage
                // });
            });
        });
    };
}).catch(error => console.error(error));


// INITIALIZATION

// let width = 0;
// let height = 0;

// function resize() {
//     width  = window.innerWidth;
//     height = window.innerHeight;
//     gameCanvas.width  = width;
//     gameCanvas.height = height;
//     gameCanvas.style.width  = width + 'px';
//     gameCanvas.style.height = height + 'px';
//     uiCanvas.width  = width;
//     uiCanvas.height = height;
//     uiCanvas.style.width  = width + 'px';
//     uiCanvas.style.height = height + 'px';
// }

// window.addEventListener('resize', resize);
// resize();