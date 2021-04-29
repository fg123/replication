const gameObjectLookup = require('../game-objects');
const Constants = require('../constants');

const axios = require('axios');
const glm = require('glm-js');

module.exports = class GameCanvas {
    constructor (clientState, canvas, context) {
        this.canvas = canvas;
        this.clientState = clientState;
        this.gl = context;

        window.addEventListener("click", () => {
            console.log("Click");
            this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
                this.canvas.mozRequestPointerLock;
            this.canvas.requestPointerLock();
        });

        // GL Attributes and Programs
        this.glProgram = undefined;
        this.positionAttributeLocation = undefined;
        this.normalAttributeLocation = undefined;
        this.uniformProj = undefined;
        this.uniformView = undefined;
        this.uniformModel = undefined;
        this.uniformResolution = undefined;

        this.glModelsSetup = false;

        // Setup OpenGL
        axios.get("/data/shaders/VertexShader.vert").then(response => {
            const vertexShader = this.CreateShader(this.gl.VERTEX_SHADER, response.data);
            console.log("Created Vertex Shader");
            axios.get("/data/shaders/FragmentShader.frag").then(response => {
                const fragmentShader = this.CreateShader(this.gl.FRAGMENT_SHADER, response.data);
                console.log("Created Fragment Shader");
                this.glProgram = this.CreateProgram(vertexShader, fragmentShader);
                this.positionAttributeLocation = this.gl.getAttribLocation(this.glProgram, "v_position");
                this.normalAttributeLocation = this.gl.getAttribLocation(this.glProgram, "v_normal");

                this.uniformProj = this.gl.getUniformLocation(this.glProgram, "Projection");
                this.uniformView = this.gl.getUniformLocation(this.glProgram, "View");
                this.uniformModel = this.gl.getUniformLocation(this.glProgram, "Model");
                this.uniformResolution = this.gl.getUniformLocation(this.glProgram, "Resolution");

                this.gl.useProgram(this.glProgram);

                this.gl.enable(this.gl.CULL_FACE);
                this.gl.cullFace(this.gl.BACK);
                this.gl.enable(this.gl.DEPTH_TEST);
                this.Draw();
            });
        });

    }

    CreateProgram(vertexShader, fragmentShader) {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        const success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
        if (success) {
            return program;
        }

        console.log(this.context.getProgramInfoLog(program));
        this.context.deleteProgram(program);
        throw "Compile Error";
    }

    CreateShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(this.gl.getShaderInfoLog(shader));
        this.gl.deleteShader(shader);
        throw "Compile Error";
    }

    Draw() {
        if (!this.glModelsSetup) {
            console.log(this.clientState.models.length);
            if (this.clientState.models.length > 0) {
                // Models have been loaded in / i.e. initial replication done
                console.log("Loading Models into WebGL");
                this.clientState.models.forEach(m => {
                    m.meshes.forEach(mesh => {
                        // Setup VAO for each mesh
                        mesh.vao = this.gl.createVertexArray();
                        this.gl.bindVertexArray(mesh.vao);

                        // Vertex Positions
                        const positionBuffer = this.gl.createBuffer();
                        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
                        const vertices = [];
                        mesh.vertices.forEach(v => {
                            vertices.push(v.p.x, v.p.y, v.p.z);
                            vertices.push(v.n.x, v.n.y, v.n.z);
                        });
                        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

                        if (this.positionAttributeLocation > -1) {
                            this.gl.vertexAttribPointer(
                                this.positionAttributeLocation, 3, this.gl.FLOAT,
                                /* normalize = */ false,
                                /* stride */ 24,
                                /* offset */ 0);
                            this.gl.enableVertexAttribArray(this.positionAttributeLocation);
                        }
                        else {
                            console.error("PositionAttributeLocation was not found");
                        }

                        if (this.normalAttributeLocation > -1) {
                            this.gl.vertexAttribPointer(
                                this.normalAttributeLocation, 3, this.gl.FLOAT,
                                /* normalize = */ false,
                                /* stride */ 24,
                                /* offset */ 12);
                            this.gl.enableVertexAttribArray(this.normalAttributeLocation);
                        }
                        else {
                            console.error("NormalAttributeLocation was not found");
                        }

                        // Indices
                        mesh.ibo = this.gl.createBuffer();
                        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
                        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(mesh.indices), this.gl.STATIC_DRAW);
                        mesh.iboCount = mesh.indices.length;
                    });
                });
                this.glModelsSetup = true;
            }
        }
        // Serialize all data back out.
        Object.keys(this.clientState.gameObjects).forEach((k) => {
            if (!this.clientState.wasm._IsObjectAlive(k)) {
                delete this.clientState.gameObjects[k];
                return;
            }

            if (this.clientState.wasm._IsObjectDirty(k)) {
                const serializedString = this.clientState.wasm._GetObjectSerialized(k);
                const jsonString = this.clientState.wasm.UTF8ToString(serializedString);
                const serializedObject = JSON.parse(jsonString);
                this.clientState.wasm._free(serializedString);
                const oldClientP = this.clientState.gameObjects[k].client_p;
                this.clientState.gameObjects[k] = serializedObject;
                this.clientState.gameObjects[k].client_p = serializedObject.p;
            }
            // if (oldClientP === undefined) {
            //     this.clientState.gameObjects[k].client_p = this.clientState.gameObjects[k].p;
            // }
            // else {
            //     // Interpolate towards
            //     const final = this.clientState.gameObjects[k].p;
            //     this.clientState.gameObjects[k].client_p = {
            //         x: oldClientP.x + (final.x - oldClientP.x) / 2,
            //         y: oldClientP.y + (final.y - oldClientP.y) / 2
            //     };
            // }
        });

        this.canvas.width  = this.clientState.width;
        this.canvas.height = this.clientState.height;
        this.canvas.style.width  = this.clientState.width + 'px';
        this.canvas.style.height = this.clientState.height + 'px';
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.uniform2f(this.uniformResolution, this.gl.canvas.width, this.gl.canvas.height);

        // this.context.fillStyle = this.backgroundGradient;
        // this.context.fillRect(0, 0, this.clientState.width, this.clientState.height);

        this.gl.clearColor(135 / 255, 206 / 255, 235 / 255, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        if (this.clientState.localPlayerObjectId) {
            if (this.clientState.gameObjects[this.clientState.localPlayerObjectId]) {
                this.clientState.cameraPos.x = this.clientState.gameObjects[this.clientState.localPlayerObjectId].p.x;
                this.clientState.cameraPos.y = this.clientState.gameObjects[this.clientState.localPlayerObjectId].p.y;
                this.clientState.cameraPos.z = this.clientState.gameObjects[this.clientState.localPlayerObjectId].p.z;

                this.clientState.cameraRot.x = this.clientState.gameObjects[this.clientState.localPlayerObjectId].ld.x;
                this.clientState.cameraRot.y = this.clientState.gameObjects[this.clientState.localPlayerObjectId].ld.y;
                this.clientState.cameraRot.z = this.clientState.gameObjects[this.clientState.localPlayerObjectId].ld.z;
            }
        }

        // console.log("Here");
        if (this.rotate === undefined) {
            this.rotate = 0;
        }
        Object.keys(this.clientState.gameObjects).forEach((k) => {
            const gameObj = this.clientState.gameObjects[k];
            const modelId = this.clientState.gameObjects[k].m;
            // console.log(k, modelId);
            if (modelId !== undefined) {
                // Find Model
                const model = this.clientState.models[modelId];
                if (model) {
                    // Loop Through Mesh
                    model.meshes.forEach(mesh => {
                        /* Set Uniforms */
                        this.gl.uniformMatrix4fv(this.uniformProj, false,
                            glm.perspective(
                                glm.radians(45.0), this.gl.canvas.width / this.gl.canvas.height,
                                0.1, 1000.0
                            ).elements);
                        this.gl.uniformMatrix4fv(this.uniformView, false, glm.lookAt(
                            glm.vec3(this.clientState.cameraPos.x,
                                    this.clientState.cameraPos.y,
                                    this.clientState.cameraPos.z),
                            glm.vec3(this.clientState.cameraPos.x +  this.clientState.cameraRot.x,
                                        this.clientState.cameraPos.y +  this.clientState.cameraRot.y,
                                        this.clientState.cameraPos.z +  this.clientState.cameraRot.z),
                            glm.vec3(0, 1, 0)
                        ).elements);
                        // Model Matrix
                        this.gl.uniformMatrix4fv(this.uniformModel, false, gameObj.transform);
                        this.rotate += 0.01;
                        this.gl.bindVertexArray(mesh.vao);
                        this.gl.drawArrays(this.gl.TRIANGLES, 0, mesh.iboCount);
                    });
                }
            }
        });

        // Object.keys(this.clientState.animations).forEach(k => {
        //     if (!this.clientState.animations[k].draw(this.context)) {
        //         delete this.clientState.animations[k];
        //     }
        // });
        // this.context.translate(cameraTranslation.x, cameraTranslation.y);

        this.clientState.SendMouseMoveEvent();
        requestAnimationFrame(() => { this.Draw() });
    }
}