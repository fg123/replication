const gameObjectLookup = require('../game-objects');
const Constants = require('../constants');
const characters = require('../characters');
const { drawImage, drawRoundedRectangle } = require('../draw-util');

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

        this.context.strokeStyle = "white";
        this.context.lineWidth = 1;
        this.context.strokeRect(x + 20, y + 16, perfTracker.size, height);

        this.context.textBaseline = "top";
        this.context.fillStyle = "white";
        this.context.fillText(title, x, y);

        this.context.textAlign = "end";
        this.context.textBaseline = "top";
        this.context.fillStyle = "white";
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

    DrawCrosshairInternal(x, y, cwidth, clength, spread) {
        // Top
        this.context.fillRect(x - cwidth / 2, y - clength - spread, cwidth, clength);
        // Bottom
        this.context.fillRect(x - cwidth / 2, y + spread, cwidth, clength);
        // Left
        this.context.fillRect(x - clength - spread, y - cwidth / 2, clength, cwidth);
        // Right
        this.context.fillRect(x + spread, y - cwidth / 2, clength, cwidth);
    }

    DrawWeapon(player, width, height) {
        // Bottom Right
        this.context.fillStyle = "black";
        drawRoundedRectangle(this.context, width - 250, height - 150, 200, 100, 10, true, false);
        drawRoundedRectangle(this.context, width - 250, height - 253, 97, 97, 10, true, false);
        drawRoundedRectangle(this.context, width - 147, height - 253, 97, 97, 10, true, false);

        this.context.strokeStyle = "dodgerblue";
        this.context.lineWidth = 5;
        let shouldStroke;
        shouldStroke = (player.w && player.im && player.im.s && player.w === player.im.s) ? true : false;
        drawRoundedRectangle(this.context, width - 250, height - 359, 200, 100, 10, true, shouldStroke);

        shouldStroke = (player.w && player.im && player.im.p && player.w === player.im.p) ? true : false;
        drawRoundedRectangle(this.context, width - 250, height - 465, 200, 100, 10, true, shouldStroke);
        this.context.font = "30px Prompt";
        this.context.textBaseline = "middle";
        this.context.textAlign = "center";
        this.context.fillStyle = "white";
        if (player.w) {
            const weapon = this.clientState.GetObject(player.w);
            if (weapon !== undefined) {
                if (weapon.blts !== undefined) {
                    const bullets = weapon.blts;
                    const inventoryAmmo = weapon.inventoryAmmo;

                    this.context.fillText(`${bullets}/${inventoryAmmo}`, width - 150, height - 100);

                    const percentageReload = weapon.tsr / weapon.rlt;
                    if (percentageReload > 0) {
                        this.context.fillStyle = "green";
                        drawRoundedRectangle(this.context, width - 250, height - 150, 200 * percentageReload, 20, 10, true, false);
                    }
                }
            }
        }

        this.context.fillStyle = "white";

        if (player.im) {
            const primary = this.clientState.GetObject(player.im.p);
            const secondary = this.clientState.GetObject(player.im.s);
            const slot0 = this.clientState.GetObject(player.im.o[0]);
            const slot1 = this.clientState.GetObject(player.im.o[1]);
            const slot2 = this.clientState.GetObject(player.im.o[2]);
            const slot3 = this.clientState.GetObject(player.im.o[3]);
            const slot4 = this.clientState.GetObject(player.im.o[4]);
            const slot5 = this.clientState.GetObject(player.im.o[5]);
            if (primary) {
                this.context.fillText(`(1) ${primary.name}`, width - 150, height - 415);
            }
            if (secondary) {
                this.context.fillText(`(2) ${secondary.name}`, width - 150, height - 309);
            }
        }
    }

    DrawBasicCrosshair(player, width, height) {
        this.context.fillStyle = "rgba(0, 0, 0, 0.9)";
        this.context.beginPath();
        this.context.arc(width / 2, height / 2, 4, 0, 2 * Math.PI);
        this.context.fill();
        this.context.fillStyle = "rgba(255, 255, 255, 0.9)";
        this.context.beginPath();
        this.context.arc(width / 2, height / 2, 2, 0, 2 * Math.PI);
        this.context.fill();
    }

    DrawCrosshair(player, width, height) {
        if (!player.w) {
            this.DrawBasicCrosshair(player, width, height);
            return;
        }
        const weapon = this.clientState.GetObject(player.w);
        if (!weapon) {
            this.DrawBasicCrosshair(player, width, height);
            return;
        }
        if (weapon.spread === undefined) return;
        if (weapon.ads) return;
        // Draw Crosshair
        const cwidth = 2;
        const clength = 15;
        const x = Math.round(width / 2);
        const y = Math.round(height / 2);
        const spread = weapon.spread + 5;
        this.context.fillStyle = "rgba(0, 0, 0, 0.9)";
        this.DrawCrosshairInternal(x, y, cwidth + 4, clength + 4, spread);
        this.context.fillStyle = "rgba(255, 255, 255, 0.9)";
        this.DrawCrosshairInternal(x, y, cwidth, clength, spread + 2);

        if (weapon.pow) {
            this.context.fillStyle = "rgba(0, 0, 0, 0.9)";
            this.context.fillRect(width / 2 - 32, height / 2 + 28, 64, 14);
            this.context.fillStyle = "rgba(30, 144, 255, 0.9)";
            this.context.fillRect(width / 2 - 30, height / 2 + 30, 60 * weapon.pow, 10);
        }
    }

    DrawQ(player, width, height) {
        if (!player.wq) {
            return;
        }
        const qAbility = this.clientState.GetObject(player.wq);

        this.context.fillStyle = "black";
        drawRoundedRectangle(this.context, width - 350, height - 130, 80, 80, 10, true, false);

        this.context.fillStyle = "white";
        this.context.textBaseline = "middle";
        this.context.textAlign = "center";
        if (qAbility.cd !== undefined && qAbility.cd !== 0) {
            this.context.font = "30px Prompt";
            this.context.fillText(Math.ceil(qAbility.cd / 1000), width - 310, height - 100);
        }
        this.context.font = "16px Prompt";
        this.context.fillText(`Q`, width - 310, height - 70);
    }

    DrawZ(player, width, height) {
        if (!player.wz) {
            return;
        }
        const zAbility = this.clientState.GetObject(player.wz);

        this.context.fillStyle = "black";
        drawRoundedRectangle(this.context, width / 2, height - 130, 80, 80, 10, true, false);

        this.context.fillStyle = "white";
        this.context.textBaseline = "middle";
        this.context.textAlign = "center";
        if (zAbility.cd !== undefined && zAbility.cd !== 0) {
            this.context.font = "30px Prompt";
            this.context.fillText(Math.ceil(zAbility.cd / 1000), width / 2 + 40, height - 100);
        }
        this.context.font = "16px Prompt";
        this.context.fillText(`Z`, width / 2 + 40, height - 70);
    }

    vec3ToString(vec) {
        return `(${vec.x.toFixed(2)}, ${vec.y.toFixed(2)}, ${vec.z.toFixed(2)})`;
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
        const w = this.context.measureText(player.cn).width;
        this.context.fillRect(100, height - 100 - 20, w + 65, 40);
        this.context.textBaseline = "middle";
        this.context.fillStyle = "white";
        this.context.fillText(player.cn, 160, height - 97);

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
            characters[player.cn].resources.base);
        drawImage(this.context, characterImage, 100, (height - 100),
            characterImage.width / 2, characterImage.height / 2);

        this.context.font = "13px Prompt";
        this.context.textBaseline = "hanging";
        this.context.textAlign = "left";
        this.context.fillStyle = "white";
        this.context.fillText(`${Math.round(1000.0 / this.fps.frameTime)}FPS`, 20, 20);

        const ping = this.clientState.ping;
        this.context.fillText(`${ping > 999 ? ">999" : ping}ms`, 20, 40);

        this.context.fillText(`Camera Position ${this.vec3ToString(this.clientState.cameraPos)}`, 20, 60);
        this.context.fillText(`Camera Rotation ${this.vec3ToString(this.clientState.cameraRot)}`, 20, 80);

        this.context.textAlign = "right";
        this.context.fillText(`${this.clientState.webSocket.url}`, width - 20, 20);

        this.context.textAlign = "left";

        const graphWidth = 150;
        let i = 0;

        this.DrawGraph("Handle Replicate", this.clientState.performance.handleReplicateTime, 300 + (graphWidth * i++), 20);
        this.DrawGraph("Tick Time", this.clientState.performance.tickTime, 300 + (graphWidth * i++), 20);
        this.DrawGraph("Tick Interval", this.clientState.performance.tickInterval, 300 + (graphWidth * i++), 20);
        this.DrawGraph("Replication Count", this.clientState.performance.replicateObjectCount, 300 + (graphWidth * i++), 20);
        this.DrawGraph("Draw Time", this.clientState.performance.drawTime, 300 + (graphWidth * i++), 20);


        Object.keys(this.clientState.animations).forEach(k => {
            if (!this.clientState.animations[k].draw(this.context, this.clientState)) {
                delete this.clientState.animations[k];
            }
        });

        // console.log(player);
        // debugger;
        this.DrawWeapon(player, width, height);
        this.DrawCrosshair(player, width, height);

        this.DrawQ(player, width, height);
        this.DrawZ(player, width, height);

        this.lastDrawTime = currentTime;
    }
}