// Contains draw instructions for different game objects 
module.exports = {
    "RectangleObject": {
        draw (context, resourceManager, obj) {
            context.fillStyle = "red";
            context.fillRect(obj.p.x, obj.p.y, obj.size.x, obj.size.y);
        }
    },
    "CircleObject": {
        draw (context, resourceManager, obj) {
            context.fillStyle = "blue";
            context.beginPath();
            context.arc(obj.p.x, obj.p.y, obj.radius, 0, 2 * Math.PI);
            context.fill();
        }
    },
    "Marine": {
        draw (context, resourceManager, obj) {
            const image = obj.v.x < 0 ? resourceManager.get('marine.png-FLIPPED') :  resourceManager.get('marine.png');
            const width = (image.width / 2);
            const height = (image.height / 2);
            context.drawImage(image, obj.p.x - (width / 2),
                obj.p.y - (height / 2), width, height);

            // Draw Health Bar
            context.fillStyle = "black";
            context.fillRect(
                obj.p.x - 25,
                obj.p.y - 50,
                50, 5
            )
            context.fillStyle = "green";
            context.fillRect(
                obj.p.x - 25,
                obj.p.y - 50,
                0.5 * obj.h, 5
            )
        }
    }
};