const { drawImage } = require('./draw-util');

function drawHealthbar(context, obj, color = "green") {
     // Draw Health Bar
     context.fillStyle = "black";
     context.fillRect(
         obj.client_p.x - 25,
         obj.client_p.y - 50,
         50, 5
     );
     context.fillStyle = color;
     context.fillRect(
         obj.client_p.x - 25,
         obj.client_p.y - 50,
         0.5 * obj.h, 5
     );
}
function drawPlayer(body, arm, context, resourceManager, obj) {
    const image = obj.v.x < 0 ? resourceManager.get(body + '-FLIPPED') : resourceManager.get(body);
    drawImage(context, image, obj.client_p.x, obj.client_p.y, (image.width / 2), (image.height / 2));

    if (arm) {
        const armImage = resourceManager.get(arm);
        drawImage(context, armImage, obj.client_p.x, obj.client_p.y + 7,
            (armImage.width / 2), (armImage.height / 2), obj.aa);
    }

    drawHealthbar(context, obj);
}

const characters = require('./characters');

module.exports = {
    "RectangleObject": {
        draw (context, resourceManager, obj, clientState) {
            // context.fillStyle = "red";
            // context.fillRect(obj.client_p.x, obj.client_p.y, obj.size.x, obj.size.y);
        }
    },
    "CircleObject": {
        draw (context, resourceManager, obj, clientState) {
            context.fillStyle = "blue";
            context.beginPath();
            context.arc(obj.client_p.x, obj.client_p.y, obj.radius, 0, 2 * Math.PI);
            context.fill();
        }
    },
    "GrenadeObject": {
        draw (context, resourceManager, obj, clientState) {
            context.fillStyle = "black";
            context.beginPath();
            context.arc(obj.client_p.x, obj.client_p.y, 5, 0, 2 * Math.PI);
            context.fill();
        }
    },
    "HookObject": {
        draw (context, resourceManager, obj, clientState) {
            context.fillStyle = "black";
            context.beginPath();
            context.arc(obj.client_p.x, obj.client_p.y, 5, 0, 2 * Math.PI);
            context.fill();

            const owner = clientState.gameObjects[obj.owner];
            if (owner) {
                context.strokeStyle = "black";
                context.lineWidth = 3;
                context.beginPath();
                context.moveTo(obj.client_p.x, obj.client_p.y);
                context.lineTo(owner.client_p.x, owner.client_p.y);
                context.stroke();
            }
        }
    },
    "ArtilleryObject": {
        draw (context, resourceManager, obj, clientState) {
            const image = resourceManager.get('artillery.png');
            drawImage(context, image, obj.client_p.x, obj.client_p.y);
        }
    },
    "PortalObject": {
        draw (context, resourceManager, obj, clientState) {
            const image = resourceManager.get('portal.png');
            drawImage(context, image, obj.client_p.x, obj.client_p.y);
            drawHealthbar(context, obj, "dodgerblue");
        }
    },
    "BulletObject": {
        draw (context, resourceManager, obj, clientState) {
            context.fillStyle = "black";
            context.beginPath();
            context.arc(obj.client_p.x, obj.client_p.y, 3, 0, 2 * Math.PI);
            context.fill();
        }
    },
    "ArrowObject": {
        draw (context, resourceManager, obj, clientState) {
            context.strokeStyle = "black";
            context.lineWidth = 3;
            context.beginPath();
            context.moveTo(obj.client_p.x, obj.client_p.y);
            const mag = Math.sqrt(Math.pow(obj.v.x, 2) + Math.pow(obj.v.y, 2))
            context.lineTo(obj.client_p.x - (obj.v.x / mag) * 45, obj.client_p.y - (obj.v.y / mag) * 45)
            context.stroke();
        }
    },
    "AssaultRifleObject": {
        draw (context, resourceManager, obj, clientState) {
            let isFlip = false;
            let angle = 0;
            const playerAttach = clientState.gameObjects[obj.attach];
            if (playerAttach) {
                isFlip = Math.abs(playerAttach.aa) > (Math.PI / 2);
                if (isFlip) {
                    angle = Math.PI;
                }
                angle += playerAttach.aa;
            }
            const image = isFlip ? resourceManager.get('m4.png-FLIPPED') : resourceManager.get('m4.png');
            drawImage(context, image, obj.client_p.x, obj.client_p.y, (image.width / 3), (image.height / 3), angle);
        }
    },
    "PistolObject": {
        draw (context, resourceManager, obj, clientState) {
            let isFlip = false;
            let angle = 0;
            const playerAttach = clientState.gameObjects[obj.attach];
            if (playerAttach) {
                isFlip = Math.abs(playerAttach.aa) > (Math.PI / 2);
                if (isFlip) {
                    angle = Math.PI;
                }
                angle += playerAttach.aa;
            }
            const image = isFlip ? resourceManager.get('de.png-FLIPPED') : resourceManager.get('de.png');
            drawImage(context, image, obj.client_p.x, obj.client_p.y, (image.width / 2), (image.height / 2), angle);
        }
    },
    "BowObject": {
        draw (context, resourceManager, obj, clientState) {
            let isFlip = false;
            let angle = 0;
            const playerAttach = clientState.gameObjects[obj.attach];
            if (playerAttach) {
                isFlip = Math.abs(playerAttach.aa) > (Math.PI / 2);
                if (isFlip) {
                    angle = Math.PI;
                }
                angle += playerAttach.aa;

                // Charge up time (charging)
                if (clientState.localPlayerObjectId === obj.attach) {
                    const afv = obj.afv;
                    if (afv.x !== 0 || afv.y !== 0) {
                        context.lineWidth = 3;
                        context.strokeStyle = 'black';
                        context.beginPath();
                        context.moveTo(obj.client_p.x, obj.client_p.y);
                        const x = afv.x / 10;
                        const y = afv.y / 10;
                        context.lineTo(obj.client_p.x + x, obj.client_p.y + y);
                        context.stroke();
                    }
                }
            }
            const image = isFlip ? resourceManager.get('bow.png-FLIPPED') : resourceManager.get('bow.png');
            drawImage(context, image, obj.client_p.x, obj.client_p.y, (image.width), (image.height), angle);
        }
    },
    "ArtilleryStrike": {

    },
    "DashAbility": {

    },
    "ArrowChargeUpAbility": {

    },
    "HookThrower": {

    },
    "BombCreator": {
        draw (context, resourceManager, obj, clientState) {
            const playerAttach = clientState.gameObjects[obj.attach];
            if (playerAttach) {
                context.globalAlpha = 0.2;
                context.strokeStyle = "red";
                context.lineWidth = 3;
                context.beginPath();
                context.arc(playerAttach.client_p.x, playerAttach.client_p.y, obj.dr, 0, 2 * Math.PI);
                context.stroke();
                context.globalAlpha = 1;
            }
        }
    },
    "PortalAbility": {

    },
    "BombExploder": {

    },
    "GrenadeThrower": {
        draw (context, resourceManager, obj, clientState) {
            let isFlip = false;
            let angle = 0;
            const playerAttach = clientState.gameObjects[obj.attach];
            if (playerAttach) {
                isFlip = Math.abs(playerAttach.aa) > (Math.PI / 2);
                if (isFlip) {
                    angle = Math.PI;
                }
                angle += playerAttach.aa;

                if (clientState.localPlayerObjectId === obj.attach) {
                    // Charge up time (charging)
                    const afv = obj.afv;
                    if (afv.x !== 0 || afv.y !== 0) {
                        context.lineWidth = 3;
                        context.strokeStyle = 'black';
                        context.beginPath();
                        context.moveTo(obj.client_p.x, obj.client_p.y);
                        const x = afv.x / 10;
                        const y = afv.y / 10;
                        context.lineTo(obj.client_p.x + x, obj.client_p.y + y);
                        context.stroke();
                    }
                }
            }
        }
    },
    "Marine": {
        draw (context, resourceManager, obj, clientState) {
            const r = characters["Marine"].resources;
            // console.log("DrawMarine!", obj.p);
            drawPlayer(r.base, r.arm, context, resourceManager, obj);
        }
    },
    "Archer": {
        draw (context, resourceManager, obj, clientState) {
            const r = characters["Archer"].resources;
            drawPlayer(r.base, r.arm, context, resourceManager, obj);
        }
    },
    "Dummy": {
        draw (context, resourceManager, obj, clientState) {
            const r = characters["Archer"].resources;
            drawPlayer(r.base, undefined, context, resourceManager, obj);
        }
    },
    "Hookman": {
        draw (context, resourceManager, obj, clientState) {
            const r = characters["Hookman"].resources;
            drawPlayer(r.base, r.arm, context, resourceManager, obj);
        }
    },
    "Bombmaker": {
        draw (context, resourceManager, obj, clientState) {
            const r = characters["Bombmaker"].resources;
            drawPlayer(r.base, r.arm, context, resourceManager, obj);
        }
    },
    "Bomb": {
        draw (context, resourceManager, obj, clientState) {
            const image = resourceManager.get('bomb.png');
            drawImage(context, image, obj.client_p.x, obj.client_p.y);
        }
    }
};