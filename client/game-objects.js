// Contains draw instructions for different game objects 
function drawImage(context, img, x, y, width = -1, height = -1, angle = 0) {
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

module.exports = {
    "RectangleObject": {
        draw (context, resourceManager, obj, objects) {
            context.fillStyle = "red";
            context.fillRect(obj.p.x, obj.p.y, obj.size.x, obj.size.y);
        }
    },
    "CircleObject": {
        draw (context, resourceManager, obj, objects) {
            context.fillStyle = "blue";
            context.beginPath();
            context.arc(obj.p.x, obj.p.y, obj.radius, 0, 2 * Math.PI);
            context.fill();
        }
    },
    "BulletObject": {
        draw (context, resourceManager, obj, objects) {
            context.fillStyle = "black";
            context.beginPath();
            context.arc(obj.p.x, obj.p.y, 3, 0, 2 * Math.PI);
            context.fill();
        }
    },
    "WeaponObject": {
        draw (context, resourceManager, obj, objects) {
            let isFlip = false;
            let angle = 0;
            const playerAttach = objects[obj.attach];            
            if (playerAttach) {
                isFlip = Math.abs(playerAttach.aa) > (Math.PI / 2);
                if (isFlip) {
                    angle = Math.PI;
                }
                angle += playerAttach.aa;
            }
            const image = isFlip ? resourceManager.get('m4.png-FLIPPED') : resourceManager.get('m4.png');
            drawImage(context, image, obj.p.x, obj.p.y, (image.width / 3), (image.height / 3), angle);
        }
    },
    "PlayerObject": {
        draw (context, resourceManager, obj, objects) {
            const image = obj.v.x < 0 ? resourceManager.get('marine.png-FLIPPED') : resourceManager.get('marine.png');
            drawImage(context, image, obj.p.x, obj.p.y, (image.width / 2), (image.height / 2));
        },
        postDraw(context, resourceManager, obj, objects) {
            const arm = resourceManager.get('marineArm.png');
            drawImage(context, arm, obj.p.x, obj.p.y + 7, (arm.width / 2), (arm.height / 2), obj.aa);

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