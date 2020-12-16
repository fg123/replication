// Contains draw instructions for different game objects 
const gameObjectLookup = {
    "RectangleObject": {
        draw (context, obj) {
            context.fillStyle = "red";
            context.fillRect(obj.p.x, obj.p.y, obj.size.x, obj.size.y);
        }
    },
    "CircleObject": {
        draw (context, obj) {
            context.fillStyle = "blue";
            context.beginPath();
            context.arc(obj.p.x, obj.p.y, obj.radius, 0, 2 * Math.PI);
            context.fill();
        }
    },
    "Marine": {
        draw (context, obj) {
            context.fillStyle = "blue";
            context.beginPath();
            context.arc(obj.p.x, obj.p.y, obj.radius, 0, 2 * Math.PI);
            context.fill();
        }
    }
};