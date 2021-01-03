const gameObjectLookup = require('../game-objects');
const Constants = require('../constants');
const characters = require('../characters');
const { drawImage } = require('../draw-util');

const FPS_FILTER_STRENGTH = 10;

module.exports = class UICanvas {
    constructor (clientState, canvas, context) {
        this.canvas = canvas;
        this.clientState = clientState;
        this.context = context;
        this.lastDrawTime = 0;
        this.currentHealth = 100;

        this.fps = {
            frameTime: 0,
            lastLoop: new Date(),
            thisLoop: 0
        };

        this.Draw();
    }

    DrawGraph(title, perfTracker, x, y) {
        this.context.font = "13px Prompt"

        const min = Math.min(...perfTracker.buffer);
        const max = Math.max(...perfTracker.buffer);
        const height = 50;

        this.context.strokeStyle = "black";
        this.context.lineWidth = 1;
        this.context.strokeRect(x + 20, y + 16, perfTracker.size, height);

        this.context.textBaseline = "top";
        this.context.fillStyle = "black";
        this.context.fillText(title, x, y);

        this.context.textAlign = "end";
        this.context.textBaseline = "top";
        this.context.fillStyle = "black";
        this.context.fillText(max, x + 16, y + 16);

        this.context.textBaseline = "bottom";
        this.context.fillText(min, x + 16, y + 16 + height);

        this.context.textAlign = "start";
        this.context.beginPath();
        this.context.lineWidth = 1;
        this.context.moveTo(x + 20, y + 16);
        let last = 0;
        for (let i = 0; i < perfTracker.size; i++) {
            const val = perfTracker.buffer[(perfTracker.next + i) % perfTracker.size];
            const yVal = (val - min) / (max - min);
            last = val;
            this.context.lineTo(x + 20 + i, (y + 16 + height) - (yVal * height));
        }
        this.context.stroke();

        this.context.textBaseline = "middle";
        this.context.fillText(last, x + perfTracker.size + 24, y + 16 + height / 2);
    }

    DrawWeapon(player, width, height) {
        // Bottom Right
        if (!player.w) return;
        const weapon = this.clientState.GetObject(player.w);
        if (weapon.blts === undefined) return;
        const bullets = weapon.blts;
        const magazines = weapon.mags;

        this.context.fillStyle = "black";
        this.context.fillRect(width - 250, height - 150, 200, 100);

        this.context.font = "30px Prompt";
        this.context.textBaseline = "middle";
        this.context.textAlign = "center";
        this.context.fillStyle = "white";
        this.context.fillText(`${bullets}/${magazines}`, width - 150, height - 100);

        this.context.fillStyle = "green";
        const percentageReload = weapon.tsr / weapon.rlt;
        this.context.fillRect(width - 250, height - 150, 200 * percentageReload, 20);
    }

    Draw() {
        requestAnimationFrame(() => { this.Draw() });

        const thisFrameTime = (this.fps.thisLoop = Date.now()) - this.fps.lastLoop;
        this.fps.frameTime += (thisFrameTime - this.fps.frameTime) / FPS_FILTER_STRENGTH;
        this.fps.lastLoop = this.fps.thisLoop;

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
        this.context.moveTo(100, height - 100);
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

        this.context.font = "13px Prompt";
        this.context.textBaseline = "hanging";
        this.context.fillStyle = "black";
        this.context.fillText(`${Math.round(1000.0 / this.fps.frameTime)}FPS`, 20, 20);
        const ping = this.clientState.ping;
        this.context.fillText(`${ping > 999 ? ">999" : ping}ms`, 20, 40);

        this.DrawGraph("HandleReplicate", this.clientState.performance.handleReplicateTime, 20, 60);

        this.DrawGraph("TickTime", this.clientState.performance.tickTime, 20, 140);


        this.DrawWeapon(player, width, height);

        this.lastDrawTime = currentTime;
    }
}