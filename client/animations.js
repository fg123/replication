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

module.exports = {
    "Explode": ExplodeAnimation
};
