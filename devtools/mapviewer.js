const TILE_SIZE = 48;

let map_image_loaded = false;
let map_json_loaded = false;
let map_image;
let map_json;

function loadMapImage(input){
    var reader = new FileReader();
    reader.readAsDataURL(input.files[0]);
    reader.onload = function() {
        // console.log(reader.result)
        map_image_loaded = true;
        map_image = new Image();
        map_image.onload = function(){
            if (map_json_loaded){
                callMap();
            }
        }
        map_image.src = reader.result;
    }
    
}

function loadMapJSON(input){
    var reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = function() {
        // console.log(reader.result)
        map_json_loaded = true;
        map_json = reader.result;
        map_json = JSON.parse(map_json)
        if (map_image_loaded){
            callMap();
        }
    }
}

function callMap(){
    createMap((mapImage) => {
        console.log('Starting Game');
        console.log(mapImage);
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        context.drawImage(mapImage, 100 ,100);
    });
}

function createMap(callback) {
    const tiles = map_json.tiles;
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

    const tilemap = map_image;
    
    for (let i = 0; i < tiles.length; i++) {
        let sx = (tiles[i].tile * TILE_SIZE) % tilemap.width;
        let sy = Math.floor((tiles[i].tile * TILE_SIZE) / tilemap.width) * TILE_SIZE;
        // console.log(sx, sy);
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
}