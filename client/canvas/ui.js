const gameObjectLookup = require('../game-objects');
const Constants = require('../constants');
const characters = require('../characters');
const { drawImage } = require('../draw-util');

module.exports = class UICanvas {
    constructor (clientState, canvas, context) {
        this.canvas = canvas;
        this.clientState = clientState;
        this.context = context;
        this.lastDrawTime = 0;
        this.currentHealth = 100;

        this.Draw();
    }

    Draw() {    
        requestAnimationFrame(() => { this.Draw() });

        const player = this.clientState.GetPlayerObject();
        if (player === undefined) return;
        const width = this.clientState.width;
        const height = this.clientState.height;

        this.canvas.width  = width;
        this.canvas.height = height;
        this.canvas.style.width  = width + 'px';
        this.canvas.style.height = height + 'px';

        const currentTime = Date.now();
        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(100, height - 100, 60, 0, 2 * Math.PI);
        this.context.fill();

        this.context.font = "25px Prompt";
        const w = this.context.measureText(player.t).width;
        this.context.fillRect(100, height - 100 - 20, w + 65, 40);
        this.context.textBaseline = "middle";
        this.context.fillStyle = "white";
        this.context.fillText(player.t, 160, height - 97);

        this.context.fillStyle = "green";
        this.currentHealth += (player.h - this.currentHealth) / 10;
        this.context.beginPath();
        this.context.arc(100, height - 100, 55, -Math.PI / 2, -(Math.PI / 2) + (2 * Math.PI) * (this.currentHealth / 100));
        this.context.fill();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(100, height - 100, 45, 0, 2 * Math.PI);
        this.context.fill();

        const characterImage = this.clientState.resourceManager.get(
            characters[player.t].resources.base);
        drawImage(this.context, characterImage, 100, (height - 100),
            characterImage.width / 2, characterImage.height / 2);

        this.lastDrawTime = currentTime;
    }
}