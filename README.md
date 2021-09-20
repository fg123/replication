# Replication
Replication is a 3D game engine written from scratch in C++.

<p align="center" >
<img src="https://raw.githubusercontent.com/fg123/replication/master/screenshot.png">
</p>


# Features
- Game Client Runs on the browser via WebAssembly and WebGL
- Network Replication of Game Objects with client-side prediction and interpolation
- Fast(ish) Deferred Renderer with support for
    - Global Shadow Mapping (CSM)
    - Skysphere
    - Dynamic Realtime Lighting
    - Post-processing (Bloom, SSAA, Tone Mapping)
    - Transparent and semi-transparent textures
- Physics Engine for multi-phase collision between different primitive types
    - Static Mesh
    - AABB and OBB
    - Sphere
- Game object scripting built on [WendyScript](https://wendy.felixguo.me/)

# Prerequisites
You will need:
```
- NodeJS / NPM to serve the client side pages and Webpack the client side code
- build-essentials to build the server (C++ 17)
- emscripten toolchain to build the client side engine in WebAssembly
```

# Running
With all those installed, open one terminal instance to serve the client service:
```
npm install
npm run dev
```

And open one terminal to build and run the server:
```
cd server
make
bin/game_server
```

