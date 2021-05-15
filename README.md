# Replication
This is a 3D game engine written in C++. The client is deployed on the browser
running a local copy of the engine in WebAssembly. A game is defined as a set
of objects that are replicated from the server engine to the client engine.

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

