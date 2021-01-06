const { drawImage } = require('./draw-util');

class SpriteSheetAnimation {
    constructor(location, scale, sheet, frameWidth) {
        this.sheet = sheet;
        this.scale = scale;
        this.frameWidth = frameWidth;
        this.frameHeight = sheet.height;
        this.location = location;

        this.totalFrames = sheet.width / frameWidth;
        this.frame = 0;
    }

    draw(context) {
        const w = this.frameWidth * this.scale;
        const h = this.frameHeight * this.scale;
        const x = this.location.x - w / 2;
        const y = this.location.y - h / 2;

        context.drawImage(this.sheet,
            this.frameWidth * this.frame, 0,
            this.frameWidth, this.frameHeight,
            x, y, w, h);

        this.frame += 1;
        return this.frame < this.totalFrames;
    }
};

class ExplodeAnimation extends SpriteSheetAnimation {
    constructor(data, resourceManager) {
        super(data.p, data.s / 48, resourceManager.get("exploding.png"), 96);
        this.data = data;
    }

    draw(context) {
        context.strokeStyle = "red";
        context.lineWidth = 2;
        context.beginPath();
        context.arc(this.data.p.x, this.data.p.y,
            this.data.s, 0, 2 * Math.PI);
        context.stroke();

        return super.draw(context);
    }
};

class FloatingTextAnimation {
    constructor(data, resourceManager) {
        this.location = data.p;
        this.text = data.t;
        this.color = data.c;

        this.popupDuration = 600;
        this.start = Date.now();
        this.lastTick = Date.now();

        this.xDelta = (Math.random() - 0.5) * 5;
        this.yDelta = -2;
    }

    draw(context) {
        const currTick = Date.now();
        if (currTick - this.start > this.popupDuration) {
            return false;
        }

        const duration = (this.lastTick - this.start);
        // const yDelta = (duration / this.popupDuration) * 50;

        const oldOpacity = context.globalAlpha;
        context.globalAlpha = (1 - Math.max(0, (duration - 300) / (this.popupDuration - 300)));
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        context.font = 'bold 20px Prompt';
        context.fillStyle = "#000";
        context.fillText(this.text, this.location.x + 2, this.location.y + 2);
        context.fillStyle = this.color;
        context.fillText(this.text, this.location.x, this.location.y);

        context.globalAlpha = oldOpacity;

        this.location.x += this.xDelta;
        this.location.y += this.yDelta;

        this.yDelta += 0.1;
        this.xDelta *= 0.99;

        this.lastTick = currTick;

        return true;
    }
};

module.exports = {
    "Explode": ExplodeAnimation,
    "FloatingText": FloatingTextAnimation
};
