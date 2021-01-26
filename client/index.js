const Constants = require('./constants');
const ResourceManager = require('./resource-manager');
const Client = require(Constants.isProduction ? './game_client_prod' : './game_client');
const { createMap } = require('./map');
const ClientState = require('./client-state');
const GameCanvas = require('./canvas/game');
const UICanvas = require('./canvas/ui');
const EscapeMenu = require('./canvas/escape-menu');

const gameCanvas = document.getElementById('game');
const gameContext = gameCanvas.getContext('2d');

const uiCanvas = document.getElementById('ui');
const uiContext = uiCanvas.getContext('2d');

const localAddress = 'ws://' + location.hostname + ':8080/connect';
const remoteAddress = "wss://replication-server.felixguo.me:8080/connect";
const connectAddress = Constants.isProduction ? remoteAddress : localAddress;

console.log('Loading Game WASM');
Client().then((instance) => {
    console.log(instance);
    console.log('Loading Web Socket');
    const webSocket = new WebSocket(connectAddress);
    webSocket.onopen = function (event) {
        console.log('Loading Resource Manager');
        const resourceManager = new ResourceManager(() => {
            createMap("data/maps/map1.json", resourceManager, (mapImage) => {
                console.log('Starting Game');
                const clientState = new ClientState(webSocket, instance, resourceManager, mapImage);
                new GameCanvas(clientState, gameCanvas, gameContext);
                new UICanvas(clientState, uiCanvas, uiContext);
                new EscapeMenu(clientState, document.getElementById('escapeMenu'));
            });
        });
    };
    webSocket.onclose = function(e) {
        alert("Server disconnected! Press OK to reload and reconnect.");
        window.location.reload();
    };
}).catch(error => console.error(error));