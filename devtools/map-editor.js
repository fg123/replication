const TILE_SIZE = 48;
let cameraX = 0;
let cameraY = 0;
let cameraVx = 0;
let cameraVy = 0;
let keys = new Set();
let loadedMapName = undefined;
let mapJson = undefined;
let tilemap = undefined;
let mouseoverX = 0;
let mouseoverY = 0;
let mouseDown = false;

let tileCanvasSelected = 0;

axios.get("/data/maps").then(response => {
    $(".mapSelect").html();
    response.data.forEach(map => {
        $(".mapSelector").append(`<option value="${map}">${map}</option>`);
    });
    loadMap(response.data[0]);
}).catch(error => {
    console.error(error);
});

$(".mapSelector").change((e) => {
    loadMap($(".mapSelector").val());
});

function resize() {
    const canvas = $('.mapCanvas')[0];
    canvas.style.width ='100%';
    canvas.style.height='100%';
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

window.addEventListener('resize', resize);

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

$(document).mousemove((e) => {
    mouseoverX = e.pageX - $('.mapCanvas').offset().left + cameraX;
    mouseoverY = e.pageY - $('.mapCanvas').offset().top + cameraY;
});

function loadMap(map) {
    axios.get("/data/maps/" + map).then(response => {
        tilemap = new Image();
        tilemap.src = "/resources/" + response.data.tilemap;
        tilemap.onload = () => {
            loadedMapName = map;
            mapJson = response.data;
        };
    }).catch(error => {
        console.error(error);
    });
}

$(".tilesCanvas").click(e => {
    const x = e.pageX - $('.tilesCanvas').offset().left;
    const y = e.pageY - $('.tilesCanvas').offset().top;
    const row = Math.floor(y / TILE_SIZE);
    const col = Math.floor(x / TILE_SIZE);
    tileCanvasSelected = row * (tilemap.width / TILE_SIZE) + col;
});

$(".mapCanvas").mousedown(e => {
    mouseDown = true;
    addNew();
});

$(".mapCanvas").mouseup(e => {
    mouseDown = false;
});

$(".mapCanvas").mousemove(e => {
    if (!mouseDown) return;
    addNew();
});

$("#noBrush").click(e => {
    tileCanvasSelected = -1;
});

$("#save").click(e => {
    axios.post("/data/maps/save", {
        file: loadedMapName,
        data: mapJson
    }).then(response => {
        alert("Saved!");
    }).catch(error => {
        console.error(error);
    });
});

function addNew() {
    const x = Math.round(Math.floor((mouseoverX) / TILE_SIZE));
    const y = Math.round(Math.floor((mouseoverY) / TILE_SIZE));
    if (mapJson.tiles[y] === undefined) {
        mapJson.tiles[y] = [];
    }
    mapJson.tiles[y][x] = tileCanvasSelected;
}

function redrawTileCanvas() {
    if (!tilemap) return;
    const canvas = $(".tilesCanvas")[0];
    canvas.style.width  = tilemap.width;
    canvas.style.height = tilemap.height;
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const context = canvas.getContext('2d');
    context.drawImage(tilemap, 0, 0);

    context.lineWidth = 3;
    context.strokeStyle = "red";

    let sx = (tileCanvasSelected * TILE_SIZE) % tilemap.width;
    let sy = Math.floor((tileCanvasSelected * TILE_SIZE) / tilemap.width) * TILE_SIZE;
    context.strokeRect(sx, sy, TILE_SIZE, TILE_SIZE);
}

function draw() {
    window.requestAnimationFrame(draw);
    resize();
    if (!mapJson) return;

    if (keys["w"]) {
        cameraVy = -10;
    }
    if (keys["a"]) {
        cameraVx = -10;
    }
    if (keys["s"]) {
        cameraVy = 10;
    }
    if (keys["d"]) {
        cameraVx = 10;
    }

    cameraX += cameraVx;
    cameraY += cameraVy;

    cameraVx *= 0.9;
    cameraVy *= 0.9;

    const canvas = $('.mapCanvas')[0];
    const context = canvas.getContext('2d');

    context.fillStyle = "#DDD";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const tiles = mapJson.tiles;
    for (let y = 0; y < tiles.length; y++) {
        for (let x = 0; x < tiles[y].length; x++) {
            let sx = (tiles[y][x] * TILE_SIZE) % tilemap.width;
            let sy = Math.floor((tiles[y][x] * TILE_SIZE) / tilemap.width) * TILE_SIZE;
            context.drawImage(tilemap, sx, sy, TILE_SIZE, TILE_SIZE,
                Math.round(-cameraX + x * TILE_SIZE),
                Math.round(-cameraY + y * TILE_SIZE),
                TILE_SIZE, TILE_SIZE)
        }
    }
    context.lineWidth = 3;
    context.strokeStyle = "red";
    context.strokeRect(
        Math.round(-cameraX + (Math.floor((mouseoverX) / TILE_SIZE) * TILE_SIZE)),
        Math.round(-cameraY + (Math.floor((mouseoverY) / TILE_SIZE) * TILE_SIZE)),
        TILE_SIZE, TILE_SIZE);

    redrawTileCanvas();
}

draw();