const Constants = require('./constants');
const ResourceManager = require('./resource-manager');
const ClientState = require('./client-state');
const GameCanvas = require('./canvas/game');
const UICanvas = require('./canvas/ui');
const EscapeMenu = require('./canvas/escape-menu');

const gameCanvas = document.getElementById('game');

const uiCanvas = document.getElementById('ui');
const uiContext = uiCanvas.getContext('2d');

const localAddress = 'ws://' + location.hostname + ':8080/connect';
const remoteAddress = "wss://replication-server.felixguo.me/connect";
const connectAddress = Constants.isProduction ? remoteAddress : localAddress;

console.log('Loading Game WASM');

window.Module = {
    print (text) {
        console.log(text);
    },
    printErr(text) {
        console.error(text);
    },
    canvas: document.getElementById('game')
};

window.Module['onRuntimeInitialized'] = function() {
    const instance = window.Module;
    console.log(instance);
    console.log('Loading Web Socket');
    const webSocket = new WebSocket(connectAddress);
    webSocket.onopen = function (event) {
        console.log('Loading Resource Manager');
        const resourceManager = new ResourceManager(() => {
            console.log('Starting Game');
            const clientState = new ClientState(webSocket, instance, resourceManager);
            const game = new GameCanvas(clientState, gameCanvas);
            clientState.game = game;
            new UICanvas(clientState, uiCanvas, uiContext);
            new EscapeMenu(clientState, document.getElementById('escapeMenu'), game);
        });
    };
    webSocket.onclose = function(e) {
        alert("Server disconnected! Press OK to reload and reconnect.");
        window.location.reload();
    };
};