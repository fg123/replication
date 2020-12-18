const axios = require('axios');

const TILE_SIZE = 48;

function createMap(mapPath, resourceManager, callback) {
    axios.get(mapPath).then((response) => {
        const tiles = response.data.tiles;
        let maxX = 0;
        let maxY = 0;
        for (let i = 0; i < tiles.length; i++) {
            maxX = Math.max(tiles[i].end.x, maxX);
            maxY = Math.max(tiles[i].end.y, maxY);
        }
        const canvas = document.createElement('canvas');
        canvas.width = (maxX + 1) * TILE_SIZE;
        canvas.height = (maxY + 1) * TILE_SIZE;
        const context = canvas.getContext('2d');

        const tilemap = resourceManager.get('map1Tiles.png');
        
        for (let i = 0; i < tiles.length; i++) {
            let sx = (tiles[i].tile * TILE_SIZE) % tilemap.width;
            let sy = Math.floor((tiles[i].tile * TILE_SIZE) / tilemap.width) * TILE_SIZE;
            console.log(sx, sy);
            for (let x = tiles[i].start.x; x <= tiles[i].end.x; x++) {
                for (let y = tiles[i].start.y; y <= tiles[i].end.y; y++) {
                    context.drawImage(tilemap, sx, sy, TILE_SIZE, TILE_SIZE,
                        x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
                }
            }
        }

        const mapImage = new Image();
        mapImage.onload = function() {
            callback(mapImage);
        };
        mapImage.src = canvas.toDataURL();
    }).catch(err => console.error(err));
}

module.exports = {
    createMap
}