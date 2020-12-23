module.exports = {
    drawImage(context, img, x, y, width = -1, height = -1, angle = 0) {
        if (width === -1) width = img.width;
        if (height === -1) height = img.height;
        if (angle === 0) {
            context.drawImage(img, x - width / 2, y - height / 2, width, height);
        }
        else {
            context.translate(x, y);
            context.rotate(angle);
            context.drawImage(img, -width / 2, -height / 2, width, height);
            context.rotate(-angle);
            context.translate(-x, -y);
        }
    }
};