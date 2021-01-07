const axios = require('axios');

const TILE_SIZE = 48;

function createMap(mapPath, resourceManager, callback) {
    axios.get(mapPath).then((response) => {
        const tiles = response.data.tiles;
        let maxX = tiles[0].length;
        let maxY = tiles.length;
        const canvas = document.createElement('canvas');
        canvas.width = (maxX + 1) * TILE_SIZE;
        canvas.height = (maxY + 1) * TILE_SIZE;
        const context = canvas.getContext('2d');

        const tilemap = resourceManager.get('map1Tiles.png');
        for (let y = 0; y < tiles.length; y++) {
            for (let x = 0; x < tiles[y].length; x++) {
                let sx = (tiles[y][x] * TILE_SIZE) % tilemap.width;
                let sy = Math.floor((tiles[y][x] * TILE_SIZE) / tilemap.width) * TILE_SIZE;
                console.log(sx, sy);
                context.drawImage(tilemap, sx, sy, TILE_SIZE, TILE_SIZE,
                    x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
            }
        }
        const mapImage = new Image();
        mapImage.onload = function() {
            callback(mapImage);
        };
        mapImage.src = canvas.toDataURL();
    });
}

module.exports = {
    createMap
}