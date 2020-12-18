/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/game-objects.js":
/*!********************************!*\
  !*** ./client/game-objects.js ***!
  \********************************/
/***/ ((module) => {

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

/***/ }),

/***/ "./client/game_client.js":
/*!*******************************!*\
  !*** ./client/game_client.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var __filename = "/index.js";
var __dirname = "/";

var Module = (function() {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (true) _scriptDir = _scriptDir || __filename;
  return (
function(Module) {
  Module = Module || {};

var Module = typeof Module !== "undefined" ? Module : {};

var readyPromiseResolve, readyPromiseReject;

Module["ready"] = new Promise(function(resolve, reject) {
 readyPromiseResolve = resolve;
 readyPromiseReject = reject;
});

if (!Object.getOwnPropertyDescriptor(Module["ready"], "_main")) {
 Object.defineProperty(Module["ready"], "_main", {
  configurable: true,
  get: function() {
   abort("You are getting _main on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
 Object.defineProperty(Module["ready"], "_main", {
  configurable: true,
  set: function() {
   abort("You are setting _main on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
}

if (!Object.getOwnPropertyDescriptor(Module["ready"], "_sbrk")) {
 Object.defineProperty(Module["ready"], "_sbrk", {
  configurable: true,
  get: function() {
   abort("You are getting _sbrk on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
 Object.defineProperty(Module["ready"], "_sbrk", {
  configurable: true,
  set: function() {
   abort("You are setting _sbrk on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
}

if (!Object.getOwnPropertyDescriptor(Module["ready"], "_emscripten_stack_get_end")) {
 Object.defineProperty(Module["ready"], "_emscripten_stack_get_end", {
  configurable: true,
  get: function() {
   abort("You are getting _emscripten_stack_get_end on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
 Object.defineProperty(Module["ready"], "_emscripten_stack_get_end", {
  configurable: true,
  set: function() {
   abort("You are setting _emscripten_stack_get_end on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
}

if (!Object.getOwnPropertyDescriptor(Module["ready"], "_emscripten_stack_get_free")) {
 Object.defineProperty(Module["ready"], "_emscripten_stack_get_free", {
  configurable: true,
  get: function() {
   abort("You are getting _emscripten_stack_get_free on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
 Object.defineProperty(Module["ready"], "_emscripten_stack_get_free", {
  configurable: true,
  set: function() {
   abort("You are setting _emscripten_stack_get_free on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
}

if (!Object.getOwnPropertyDescriptor(Module["ready"], "_emscripten_stack_init")) {
 Object.defineProperty(Module["ready"], "_emscripten_stack_init", {
  configurable: true,
  get: function() {
   abort("You are getting _emscripten_stack_init on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
 Object.defineProperty(Module["ready"], "_emscripten_stack_init", {
  configurable: true,
  set: function() {
   abort("You are setting _emscripten_stack_init on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
}

if (!Object.getOwnPropertyDescriptor(Module["ready"], "_stackSave")) {
 Object.defineProperty(Module["ready"], "_stackSave", {
  configurable: true,
  get: function() {
   abort("You are getting _stackSave on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
 Object.defineProperty(Module["ready"], "_stackSave", {
  configurable: true,
  set: function() {
   abort("You are setting _stackSave on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
}

if (!Object.getOwnPropertyDescriptor(Module["ready"], "_stackRestore")) {
 Object.defineProperty(Module["ready"], "_stackRestore", {
  configurable: true,
  get: function() {
   abort("You are getting _stackRestore on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
 Object.defineProperty(Module["ready"], "_stackRestore", {
  configurable: true,
  set: function() {
   abort("You are setting _stackRestore on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
}

if (!Object.getOwnPropertyDescriptor(Module["ready"], "_stackAlloc")) {
 Object.defineProperty(Module["ready"], "_stackAlloc", {
  configurable: true,
  get: function() {
   abort("You are getting _stackAlloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
 Object.defineProperty(Module["ready"], "_stackAlloc", {
  configurable: true,
  set: function() {
   abort("You are setting _stackAlloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
}

if (!Object.getOwnPropertyDescriptor(Module["ready"], "___wasm_call_ctors")) {
 Object.defineProperty(Module["ready"], "___wasm_call_ctors", {
  configurable: true,
  get: function() {
   abort("You are getting ___wasm_call_ctors on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
 Object.defineProperty(Module["ready"], "___wasm_call_ctors", {
  configurable: true,
  set: function() {
   abort("You are setting ___wasm_call_ctors on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
}

if (!Object.getOwnPropertyDescriptor(Module["ready"], "_fflush")) {
 Object.defineProperty(Module["ready"], "_fflush", {
  configurable: true,
  get: function() {
   abort("You are getting _fflush on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
 Object.defineProperty(Module["ready"], "_fflush", {
  configurable: true,
  set: function() {
   abort("You are setting _fflush on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
}

if (!Object.getOwnPropertyDescriptor(Module["ready"], "___errno_location")) {
 Object.defineProperty(Module["ready"], "___errno_location", {
  configurable: true,
  get: function() {
   abort("You are getting ___errno_location on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
 Object.defineProperty(Module["ready"], "___errno_location", {
  configurable: true,
  set: function() {
   abort("You are setting ___errno_location on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
}

if (!Object.getOwnPropertyDescriptor(Module["ready"], "_emscripten_get_sbrk_ptr")) {
 Object.defineProperty(Module["ready"], "_emscripten_get_sbrk_ptr", {
  configurable: true,
  get: function() {
   abort("You are getting _emscripten_get_sbrk_ptr on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
 Object.defineProperty(Module["ready"], "_emscripten_get_sbrk_ptr", {
  configurable: true,
  set: function() {
   abort("You are setting _emscripten_get_sbrk_ptr on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
}

if (!Object.getOwnPropertyDescriptor(Module["ready"], "_emscripten_stack_get_base")) {
 Object.defineProperty(Module["ready"], "_emscripten_stack_get_base", {
  configurable: true,
  get: function() {
   abort("You are getting _emscripten_stack_get_base on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
 Object.defineProperty(Module["ready"], "_emscripten_stack_get_base", {
  configurable: true,
  set: function() {
   abort("You are setting _emscripten_stack_get_base on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
}

if (!Object.getOwnPropertyDescriptor(Module["ready"], "_malloc")) {
 Object.defineProperty(Module["ready"], "_malloc", {
  configurable: true,
  get: function() {
   abort("You are getting _malloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
 Object.defineProperty(Module["ready"], "_malloc", {
  configurable: true,
  set: function() {
   abort("You are setting _malloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
}

if (!Object.getOwnPropertyDescriptor(Module["ready"], "_free")) {
 Object.defineProperty(Module["ready"], "_free", {
  configurable: true,
  get: function() {
   abort("You are getting _free on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
 Object.defineProperty(Module["ready"], "_free", {
  configurable: true,
  set: function() {
   abort("You are setting _free on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
}

if (!Object.getOwnPropertyDescriptor(Module["ready"], "_setThrew")) {
 Object.defineProperty(Module["ready"], "_setThrew", {
  configurable: true,
  get: function() {
   abort("You are getting _setThrew on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
 Object.defineProperty(Module["ready"], "_setThrew", {
  configurable: true,
  set: function() {
   abort("You are setting _setThrew on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
}

if (!Object.getOwnPropertyDescriptor(Module["ready"], "onRuntimeInitialized")) {
 Object.defineProperty(Module["ready"], "onRuntimeInitialized", {
  configurable: true,
  get: function() {
   abort("You are getting onRuntimeInitialized on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
 Object.defineProperty(Module["ready"], "onRuntimeInitialized", {
  configurable: true,
  set: function() {
   abort("You are setting onRuntimeInitialized on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
  }
 });
}

var moduleOverrides = {};

var key;

for (key in Module) {
 if (Module.hasOwnProperty(key)) {
  moduleOverrides[key] = Module[key];
 }
}

var arguments_ = [];

var thisProgram = "./this.program";

var quit_ = function(status, toThrow) {
 throw toThrow;
};

var ENVIRONMENT_IS_WEB = false;

var ENVIRONMENT_IS_WORKER = false;

var ENVIRONMENT_IS_NODE = false;

var ENVIRONMENT_IS_SHELL = false;

ENVIRONMENT_IS_WEB = typeof window === "object";

ENVIRONMENT_IS_WORKER = typeof importScripts === "function";

ENVIRONMENT_IS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";

ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (Module["ENVIRONMENT"]) {
 throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)");
}

var scriptDirectory = "";

function locateFile(path) {
 if (Module["locateFile"]) {
  return Module["locateFile"](path, scriptDirectory);
 }
 return scriptDirectory + path;
}

var read_, readAsync, readBinary, setWindowTitle;

var nodeFS;

var nodePath;

if (ENVIRONMENT_IS_NODE) {
 if (ENVIRONMENT_IS_WORKER) {
  scriptDirectory = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js").dirname(scriptDirectory) + "/";
 } else {
  scriptDirectory = __dirname + "/";
 }
 read_ = function shell_read(filename, binary) {
  if (!nodeFS) nodeFS = __webpack_require__(/*! fs */ "?65c5");
  if (!nodePath) nodePath = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
  filename = nodePath["normalize"](filename);
  return nodeFS["readFileSync"](filename, binary ? null : "utf8");
 };
 readBinary = function readBinary(filename) {
  var ret = read_(filename, true);
  if (!ret.buffer) {
   ret = new Uint8Array(ret);
  }
  assert(ret.buffer);
  return ret;
 };
 if (process["argv"].length > 1) {
  thisProgram = process["argv"][1].replace(/\\/g, "/");
 }
 arguments_ = process["argv"].slice(2);
 process["on"]("uncaughtException", function(ex) {
  if (!(ex instanceof ExitStatus)) {
   throw ex;
  }
 });
 process["on"]("unhandledRejection", abort);
 quit_ = function(status) {
  process["exit"](status);
 };
 Module["inspect"] = function() {
  return "[Emscripten Module object]";
 };
} else if (ENVIRONMENT_IS_SHELL) {
 if (typeof read != "undefined") {
  read_ = function shell_read(f) {
   return read(f);
  };
 }
 readBinary = function readBinary(f) {
  var data;
  if (typeof readbuffer === "function") {
   return new Uint8Array(readbuffer(f));
  }
  data = read(f, "binary");
  assert(typeof data === "object");
  return data;
 };
 if (typeof scriptArgs != "undefined") {
  arguments_ = scriptArgs;
 } else if (typeof arguments != "undefined") {
  arguments_ = arguments;
 }
 if (typeof quit === "function") {
  quit_ = function(status) {
   quit(status);
  };
 }
 if (typeof print !== "undefined") {
  if (typeof console === "undefined") console = {};
  console.log = print;
  console.warn = console.error = typeof printErr !== "undefined" ? printErr : print;
 }
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
 if (ENVIRONMENT_IS_WORKER) {
  scriptDirectory = self.location.href;
 } else if (typeof document !== "undefined" && document.currentScript) {
  scriptDirectory = document.currentScript.src;
 }
 if (_scriptDir) {
  scriptDirectory = _scriptDir;
 }
 if (scriptDirectory.indexOf("blob:") !== 0) {
  scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1);
 } else {
  scriptDirectory = "";
 }
 {
  read_ = function shell_read(url) {
   var xhr = new XMLHttpRequest();
   xhr.open("GET", url, false);
   xhr.send(null);
   return xhr.responseText;
  };
  if (ENVIRONMENT_IS_WORKER) {
   readBinary = function readBinary(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.responseType = "arraybuffer";
    xhr.send(null);
    return new Uint8Array(xhr.response);
   };
  }
  readAsync = function readAsync(url, onload, onerror) {
   var xhr = new XMLHttpRequest();
   xhr.open("GET", url, true);
   xhr.responseType = "arraybuffer";
   xhr.onload = function xhr_onload() {
    if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
     onload(xhr.response);
     return;
    }
    onerror();
   };
   xhr.onerror = onerror;
   xhr.send(null);
  };
 }
 setWindowTitle = function(title) {
  document.title = title;
 };
} else {
 throw new Error("environment detection error");
}

var out = Module["print"] || console.log.bind(console);

var err = Module["printErr"] || console.warn.bind(console);

for (key in moduleOverrides) {
 if (moduleOverrides.hasOwnProperty(key)) {
  Module[key] = moduleOverrides[key];
 }
}

moduleOverrides = null;

if (Module["arguments"]) arguments_ = Module["arguments"];

if (!Object.getOwnPropertyDescriptor(Module, "arguments")) Object.defineProperty(Module, "arguments", {
 configurable: true,
 get: function() {
  abort("Module.arguments has been replaced with plain arguments_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

if (Module["thisProgram"]) thisProgram = Module["thisProgram"];

if (!Object.getOwnPropertyDescriptor(Module, "thisProgram")) Object.defineProperty(Module, "thisProgram", {
 configurable: true,
 get: function() {
  abort("Module.thisProgram has been replaced with plain thisProgram (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

if (Module["quit"]) quit_ = Module["quit"];

if (!Object.getOwnPropertyDescriptor(Module, "quit")) Object.defineProperty(Module, "quit", {
 configurable: true,
 get: function() {
  abort("Module.quit has been replaced with plain quit_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

assert(typeof Module["memoryInitializerPrefixURL"] === "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");

assert(typeof Module["pthreadMainPrefixURL"] === "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");

assert(typeof Module["cdInitializerPrefixURL"] === "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");

assert(typeof Module["filePackagePrefixURL"] === "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");

assert(typeof Module["read"] === "undefined", "Module.read option was removed (modify read_ in JS)");

assert(typeof Module["readAsync"] === "undefined", "Module.readAsync option was removed (modify readAsync in JS)");

assert(typeof Module["readBinary"] === "undefined", "Module.readBinary option was removed (modify readBinary in JS)");

assert(typeof Module["setWindowTitle"] === "undefined", "Module.setWindowTitle option was removed (modify setWindowTitle in JS)");

assert(typeof Module["TOTAL_MEMORY"] === "undefined", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");

if (!Object.getOwnPropertyDescriptor(Module, "read")) Object.defineProperty(Module, "read", {
 configurable: true,
 get: function() {
  abort("Module.read has been replaced with plain read_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

if (!Object.getOwnPropertyDescriptor(Module, "readAsync")) Object.defineProperty(Module, "readAsync", {
 configurable: true,
 get: function() {
  abort("Module.readAsync has been replaced with plain readAsync (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

if (!Object.getOwnPropertyDescriptor(Module, "readBinary")) Object.defineProperty(Module, "readBinary", {
 configurable: true,
 get: function() {
  abort("Module.readBinary has been replaced with plain readBinary (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

if (!Object.getOwnPropertyDescriptor(Module, "setWindowTitle")) Object.defineProperty(Module, "setWindowTitle", {
 configurable: true,
 get: function() {
  abort("Module.setWindowTitle has been replaced with plain setWindowTitle (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

var IDBFS = "IDBFS is no longer included by default; build with -lidbfs.js";

var PROXYFS = "PROXYFS is no longer included by default; build with -lproxyfs.js";

var WORKERFS = "WORKERFS is no longer included by default; build with -lworkerfs.js";

var NODEFS = "NODEFS is no longer included by default; build with -lnodefs.js";

var STACK_ALIGN = 16;

function alignMemory(size, factor) {
 if (!factor) factor = STACK_ALIGN;
 return Math.ceil(size / factor) * factor;
}

function getNativeTypeSize(type) {
 switch (type) {
 case "i1":
 case "i8":
  return 1;

 case "i16":
  return 2;

 case "i32":
  return 4;

 case "i64":
  return 8;

 case "float":
  return 4;

 case "double":
  return 8;

 default:
  {
   if (type[type.length - 1] === "*") {
    return 4;
   } else if (type[0] === "i") {
    var bits = Number(type.substr(1));
    assert(bits % 8 === 0, "getNativeTypeSize invalid bits " + bits + ", type " + type);
    return bits / 8;
   } else {
    return 0;
   }
  }
 }
}

function warnOnce(text) {
 if (!warnOnce.shown) warnOnce.shown = {};
 if (!warnOnce.shown[text]) {
  warnOnce.shown[text] = 1;
  err(text);
 }
}

function convertJsFunctionToWasm(func, sig) {
 if (typeof WebAssembly.Function === "function") {
  var typeNames = {
   "i": "i32",
   "j": "i64",
   "f": "f32",
   "d": "f64"
  };
  var type = {
   parameters: [],
   results: sig[0] == "v" ? [] : [ typeNames[sig[0]] ]
  };
  for (var i = 1; i < sig.length; ++i) {
   type.parameters.push(typeNames[sig[i]]);
  }
  return new WebAssembly.Function(type, func);
 }
 var typeSection = [ 1, 0, 1, 96 ];
 var sigRet = sig.slice(0, 1);
 var sigParam = sig.slice(1);
 var typeCodes = {
  "i": 127,
  "j": 126,
  "f": 125,
  "d": 124
 };
 typeSection.push(sigParam.length);
 for (var i = 0; i < sigParam.length; ++i) {
  typeSection.push(typeCodes[sigParam[i]]);
 }
 if (sigRet == "v") {
  typeSection.push(0);
 } else {
  typeSection = typeSection.concat([ 1, typeCodes[sigRet] ]);
 }
 typeSection[1] = typeSection.length - 2;
 var bytes = new Uint8Array([ 0, 97, 115, 109, 1, 0, 0, 0 ].concat(typeSection, [ 2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0 ]));
 var module = new WebAssembly.Module(bytes);
 var instance = new WebAssembly.Instance(module, {
  "e": {
   "f": func
  }
 });
 var wrappedFunc = instance.exports["f"];
 return wrappedFunc;
}

var freeTableIndexes = [];

var functionsInTableMap;

function getEmptyTableSlot() {
 if (freeTableIndexes.length) {
  return freeTableIndexes.pop();
 }
 try {
  wasmTable.grow(1);
 } catch (err) {
  if (!(err instanceof RangeError)) {
   throw err;
  }
  throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
 }
 return wasmTable.length - 1;
}

function addFunctionWasm(func, sig) {
 if (!functionsInTableMap) {
  functionsInTableMap = new WeakMap();
  for (var i = 0; i < wasmTable.length; i++) {
   var item = wasmTable.get(i);
   if (item) {
    functionsInTableMap.set(item, i);
   }
  }
 }
 if (functionsInTableMap.has(func)) {
  return functionsInTableMap.get(func);
 }
 for (var i = 0; i < wasmTable.length; i++) {
  assert(wasmTable.get(i) != func, "function in Table but not functionsInTableMap");
 }
 var ret = getEmptyTableSlot();
 try {
  wasmTable.set(ret, func);
 } catch (err) {
  if (!(err instanceof TypeError)) {
   throw err;
  }
  assert(typeof sig !== "undefined", "Missing signature argument to addFunction: " + func);
  var wrapped = convertJsFunctionToWasm(func, sig);
  wasmTable.set(ret, wrapped);
 }
 functionsInTableMap.set(func, ret);
 return ret;
}

function removeFunction(index) {
 functionsInTableMap.delete(wasmTable.get(index));
 freeTableIndexes.push(index);
}

function addFunction(func, sig) {
 assert(typeof func !== "undefined");
 if (typeof sig === "undefined") {
  err("warning: addFunction(): You should provide a wasm function signature string as a second argument. This is not necessary for asm.js and asm2wasm, but can be required for the LLVM wasm backend, so it is recommended for full portability.");
 }
 return addFunctionWasm(func, sig);
}

function makeBigInt(low, high, unsigned) {
 return unsigned ? +(low >>> 0) + +(high >>> 0) * 4294967296 : +(low >>> 0) + +(high | 0) * 4294967296;
}

var tempRet0 = 0;

var setTempRet0 = function(value) {
 tempRet0 = value;
};

var getTempRet0 = function() {
 return tempRet0;
};

function getCompilerSetting(name) {
 throw "You must build with -s RETAIN_COMPILER_SETTINGS=1 for getCompilerSetting or emscripten_get_compiler_setting to work";
}

var wasmBinary;

if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];

if (!Object.getOwnPropertyDescriptor(Module, "wasmBinary")) Object.defineProperty(Module, "wasmBinary", {
 configurable: true,
 get: function() {
  abort("Module.wasmBinary has been replaced with plain wasmBinary (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

var noExitRuntime;

if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];

if (!Object.getOwnPropertyDescriptor(Module, "noExitRuntime")) Object.defineProperty(Module, "noExitRuntime", {
 configurable: true,
 get: function() {
  abort("Module.noExitRuntime has been replaced with plain noExitRuntime (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

if (typeof WebAssembly !== "object") {
 abort("no native wasm support detected");
}

function setValue(ptr, value, type, noSafe) {
 type = type || "i8";
 if (type.charAt(type.length - 1) === "*") type = "i32";
 if (noSafe) {
  switch (type) {
  case "i1":
   HEAP8[ptr >> 0] = value;
   break;

  case "i8":
   HEAP8[ptr >> 0] = value;
   break;

  case "i16":
   HEAP16[ptr >> 1] = value;
   break;

  case "i32":
   HEAP32[ptr >> 2] = value;
   break;

  case "i64":
   tempI64 = [ value >>> 0, (tempDouble = value, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
   HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
   break;

  case "float":
   HEAPF32[ptr >> 2] = value;
   break;

  case "double":
   HEAPF64[ptr >> 3] = value;
   break;

  default:
   abort("invalid type for setValue: " + type);
  }
 } else {
  switch (type) {
  case "i1":
   SAFE_HEAP_STORE(ptr | 0, value | 0, 1);
   break;

  case "i8":
   SAFE_HEAP_STORE(ptr | 0, value | 0, 1);
   break;

  case "i16":
   SAFE_HEAP_STORE(ptr | 0, value | 0, 2);
   break;

  case "i32":
   SAFE_HEAP_STORE(ptr | 0, value | 0, 4);
   break;

  case "i64":
   tempI64 = [ value >>> 0, (tempDouble = value, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
   SAFE_HEAP_STORE(ptr | 0, tempI64[0] | 0, 4), SAFE_HEAP_STORE(ptr + 4 | 0, tempI64[1] | 0, 4);
   break;

  case "float":
   SAFE_HEAP_STORE_D(ptr | 0, Math.fround(value), 4);
   break;

  case "double":
   SAFE_HEAP_STORE_D(ptr | 0, +value, 8);
   break;

  default:
   abort("invalid type for setValue: " + type);
  }
 }
}

function getValue(ptr, type, noSafe) {
 type = type || "i8";
 if (type.charAt(type.length - 1) === "*") type = "i32";
 if (noSafe) {
  switch (type) {
  case "i1":
   return HEAP8[ptr >> 0];

  case "i8":
   return HEAP8[ptr >> 0];

  case "i16":
   return HEAP16[ptr >> 1];

  case "i32":
   return HEAP32[ptr >> 2];

  case "i64":
   return HEAP32[ptr >> 2];

  case "float":
   return HEAPF32[ptr >> 2];

  case "double":
   return HEAPF64[ptr >> 3];

  default:
   abort("invalid type for getValue: " + type);
  }
 } else {
  switch (type) {
  case "i1":
   return SAFE_HEAP_LOAD(ptr | 0, 1, 0) | 0;

  case "i8":
   return SAFE_HEAP_LOAD(ptr | 0, 1, 0) | 0;

  case "i16":
   return SAFE_HEAP_LOAD(ptr | 0, 2, 0) | 0;

  case "i32":
   return SAFE_HEAP_LOAD(ptr | 0, 4, 0) | 0;

  case "i64":
   return SAFE_HEAP_LOAD(ptr | 0, 8, 0) | 0;

  case "float":
   return Math.fround(SAFE_HEAP_LOAD_D(ptr | 0, 4, 0));

  case "double":
   return +SAFE_HEAP_LOAD_D(ptr | 0, 8, 0);

  default:
   abort("invalid type for getValue: " + type);
  }
 }
 return null;
}

function getSafeHeapType(bytes, isFloat) {
 switch (bytes) {
 case 1:
  return "i8";

 case 2:
  return "i16";

 case 4:
  return isFloat ? "float" : "i32";

 case 8:
  return "double";

 default:
  assert(0);
 }
}

function SAFE_HEAP_STORE(dest, value, bytes, isFloat) {
 if (dest <= 0) abort("segmentation fault storing " + bytes + " bytes to address " + dest);
 if (dest % bytes !== 0) abort("alignment error storing to address " + dest + ", which was expected to be aligned to a multiple of " + bytes);
 if (runtimeInitialized) {
  var brk = _sbrk() >>> 0;
  if (dest + bytes > brk) abort("segmentation fault, exceeded the top of the available dynamic heap when storing " + bytes + " bytes to address " + dest + ". DYNAMICTOP=" + brk);
  assert(brk >= _emscripten_stack_get_base());
  assert(brk <= HEAP8.length);
 }
 setValue(dest, value, getSafeHeapType(bytes, isFloat), 1);
 return value;
}

function SAFE_HEAP_STORE_D(dest, value, bytes) {
 return SAFE_HEAP_STORE(dest, value, bytes, true);
}

function SAFE_HEAP_LOAD(dest, bytes, unsigned, isFloat) {
 if (dest <= 0) abort("segmentation fault loading " + bytes + " bytes from address " + dest);
 if (dest % bytes !== 0) abort("alignment error loading from address " + dest + ", which was expected to be aligned to a multiple of " + bytes);
 if (runtimeInitialized) {
  var brk = _sbrk() >>> 0;
  if (dest + bytes > brk) abort("segmentation fault, exceeded the top of the available dynamic heap when loading " + bytes + " bytes from address " + dest + ". DYNAMICTOP=" + brk);
  assert(brk >= _emscripten_stack_get_base());
  assert(brk <= HEAP8.length);
 }
 var type = getSafeHeapType(bytes, isFloat);
 var ret = getValue(dest, type, 1);
 if (unsigned) ret = unSign(ret, parseInt(type.substr(1), 10));
 return ret;
}

function SAFE_HEAP_LOAD_D(dest, bytes, unsigned) {
 return SAFE_HEAP_LOAD(dest, bytes, unsigned, true);
}

function SAFE_FT_MASK(value, mask) {
 var ret = value & mask;
 if (ret !== value) {
  abort("Function table mask error: function pointer is " + value + " which is masked by " + mask + ", the likely cause of this is that the function pointer is being called by the wrong type.");
 }
 return ret;
}

function segfault() {
 abort("segmentation fault");
}

function alignfault() {
 abort("alignment fault");
}

function ftfault() {
 abort("Function table mask error");
}

var wasmMemory;

var ABORT = false;

var EXITSTATUS;

function assert(condition, text) {
 if (!condition) {
  abort("Assertion failed: " + text);
 }
}

function getCFunc(ident) {
 var func = Module["_" + ident];
 assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
 return func;
}

function ccall(ident, returnType, argTypes, args, opts) {
 var toC = {
  "string": function(str) {
   var ret = 0;
   if (str !== null && str !== undefined && str !== 0) {
    var len = (str.length << 2) + 1;
    ret = stackAlloc(len);
    stringToUTF8(str, ret, len);
   }
   return ret;
  },
  "array": function(arr) {
   var ret = stackAlloc(arr.length);
   writeArrayToMemory(arr, ret);
   return ret;
  }
 };
 function convertReturnValue(ret) {
  if (returnType === "string") return UTF8ToString(ret);
  if (returnType === "boolean") return Boolean(ret);
  return ret;
 }
 var func = getCFunc(ident);
 var cArgs = [];
 var stack = 0;
 assert(returnType !== "array", 'Return type should not be "array".');
 if (args) {
  for (var i = 0; i < args.length; i++) {
   var converter = toC[argTypes[i]];
   if (converter) {
    if (stack === 0) stack = stackSave();
    cArgs[i] = converter(args[i]);
   } else {
    cArgs[i] = args[i];
   }
  }
 }
 var ret = func.apply(null, cArgs);
 ret = convertReturnValue(ret);
 if (stack !== 0) stackRestore(stack);
 return ret;
}

function cwrap(ident, returnType, argTypes, opts) {
 return function() {
  return ccall(ident, returnType, argTypes, arguments, opts);
 };
}

var ALLOC_NORMAL = 0;

var ALLOC_STACK = 1;

function allocate(slab, allocator) {
 var ret;
 assert(typeof allocator === "number", "allocate no longer takes a type argument");
 assert(typeof slab !== "number", "allocate no longer takes a number as arg0");
 if (allocator == ALLOC_STACK) {
  ret = stackAlloc(slab.length);
 } else {
  ret = _malloc(slab.length);
 }
 if (slab.subarray || slab.slice) {
  HEAPU8.set(slab, ret);
 } else {
  HEAPU8.set(new Uint8Array(slab), ret);
 }
 return ret;
}

var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

function UTF8ArrayToString(heap, idx, maxBytesToRead) {
 var endIdx = idx + maxBytesToRead;
 var endPtr = idx;
 while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
 if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
  return UTF8Decoder.decode(heap.subarray(idx, endPtr));
 } else {
  var str = "";
  while (idx < endPtr) {
   var u0 = heap[idx++];
   if (!(u0 & 128)) {
    str += String.fromCharCode(u0);
    continue;
   }
   var u1 = heap[idx++] & 63;
   if ((u0 & 224) == 192) {
    str += String.fromCharCode((u0 & 31) << 6 | u1);
    continue;
   }
   var u2 = heap[idx++] & 63;
   if ((u0 & 240) == 224) {
    u0 = (u0 & 15) << 12 | u1 << 6 | u2;
   } else {
    if ((u0 & 248) != 240) warnOnce("Invalid UTF-8 leading byte 0x" + u0.toString(16) + " encountered when deserializing a UTF-8 string on the asm.js/wasm heap to a JS string!");
    u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63;
   }
   if (u0 < 65536) {
    str += String.fromCharCode(u0);
   } else {
    var ch = u0 - 65536;
    str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
   }
  }
 }
 return str;
}

function UTF8ToString(ptr, maxBytesToRead) {
 return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
}

function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
 if (!(maxBytesToWrite > 0)) return 0;
 var startIdx = outIdx;
 var endIdx = outIdx + maxBytesToWrite - 1;
 for (var i = 0; i < str.length; ++i) {
  var u = str.charCodeAt(i);
  if (u >= 55296 && u <= 57343) {
   var u1 = str.charCodeAt(++i);
   u = 65536 + ((u & 1023) << 10) | u1 & 1023;
  }
  if (u <= 127) {
   if (outIdx >= endIdx) break;
   heap[outIdx++] = u;
  } else if (u <= 2047) {
   if (outIdx + 1 >= endIdx) break;
   heap[outIdx++] = 192 | u >> 6;
   heap[outIdx++] = 128 | u & 63;
  } else if (u <= 65535) {
   if (outIdx + 2 >= endIdx) break;
   heap[outIdx++] = 224 | u >> 12;
   heap[outIdx++] = 128 | u >> 6 & 63;
   heap[outIdx++] = 128 | u & 63;
  } else {
   if (outIdx + 3 >= endIdx) break;
   if (u >= 2097152) warnOnce("Invalid Unicode code point 0x" + u.toString(16) + " encountered when serializing a JS string to an UTF-8 string on the asm.js/wasm heap! (Valid unicode code points should be in range 0-0x1FFFFF).");
   heap[outIdx++] = 240 | u >> 18;
   heap[outIdx++] = 128 | u >> 12 & 63;
   heap[outIdx++] = 128 | u >> 6 & 63;
   heap[outIdx++] = 128 | u & 63;
  }
 }
 heap[outIdx] = 0;
 return outIdx - startIdx;
}

function stringToUTF8(str, outPtr, maxBytesToWrite) {
 assert(typeof maxBytesToWrite == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
 return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
}

function lengthBytesUTF8(str) {
 var len = 0;
 for (var i = 0; i < str.length; ++i) {
  var u = str.charCodeAt(i);
  if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
  if (u <= 127) ++len; else if (u <= 2047) len += 2; else if (u <= 65535) len += 3; else len += 4;
 }
 return len;
}

function AsciiToString(ptr) {
 var str = "";
 while (1) {
  var ch = SAFE_HEAP_LOAD(ptr++ | 0, 1, 1) >>> 0;
  if (!ch) return str;
  str += String.fromCharCode(ch);
 }
}

function stringToAscii(str, outPtr) {
 return writeAsciiToMemory(str, outPtr, false);
}

var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;

function UTF16ToString(ptr, maxBytesToRead) {
 assert(ptr % 2 == 0, "Pointer passed to UTF16ToString must be aligned to two bytes!");
 var endPtr = ptr;
 var idx = endPtr >> 1;
 var maxIdx = idx + maxBytesToRead / 2;
 while (!(idx >= maxIdx) && SAFE_HEAP_LOAD(idx * 2, 2, 1)) ++idx;
 endPtr = idx << 1;
 if (endPtr - ptr > 32 && UTF16Decoder) {
  return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
 } else {
  var str = "";
  for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
   var codeUnit = SAFE_HEAP_LOAD(ptr + i * 2 | 0, 2, 0) | 0;
   if (codeUnit == 0) break;
   str += String.fromCharCode(codeUnit);
  }
  return str;
 }
}

function stringToUTF16(str, outPtr, maxBytesToWrite) {
 assert(outPtr % 2 == 0, "Pointer passed to stringToUTF16 must be aligned to two bytes!");
 assert(typeof maxBytesToWrite == "number", "stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
 if (maxBytesToWrite === undefined) {
  maxBytesToWrite = 2147483647;
 }
 if (maxBytesToWrite < 2) return 0;
 maxBytesToWrite -= 2;
 var startPtr = outPtr;
 var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
 for (var i = 0; i < numCharsToWrite; ++i) {
  var codeUnit = str.charCodeAt(i);
  SAFE_HEAP_STORE(outPtr | 0, codeUnit | 0, 2);
  outPtr += 2;
 }
 SAFE_HEAP_STORE(outPtr | 0, 0 | 0, 2);
 return outPtr - startPtr;
}

function lengthBytesUTF16(str) {
 return str.length * 2;
}

function UTF32ToString(ptr, maxBytesToRead) {
 assert(ptr % 4 == 0, "Pointer passed to UTF32ToString must be aligned to four bytes!");
 var i = 0;
 var str = "";
 while (!(i >= maxBytesToRead / 4)) {
  var utf32 = SAFE_HEAP_LOAD(ptr + i * 4 | 0, 4, 0) | 0;
  if (utf32 == 0) break;
  ++i;
  if (utf32 >= 65536) {
   var ch = utf32 - 65536;
   str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
  } else {
   str += String.fromCharCode(utf32);
  }
 }
 return str;
}

function stringToUTF32(str, outPtr, maxBytesToWrite) {
 assert(outPtr % 4 == 0, "Pointer passed to stringToUTF32 must be aligned to four bytes!");
 assert(typeof maxBytesToWrite == "number", "stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
 if (maxBytesToWrite === undefined) {
  maxBytesToWrite = 2147483647;
 }
 if (maxBytesToWrite < 4) return 0;
 var startPtr = outPtr;
 var endPtr = startPtr + maxBytesToWrite - 4;
 for (var i = 0; i < str.length; ++i) {
  var codeUnit = str.charCodeAt(i);
  if (codeUnit >= 55296 && codeUnit <= 57343) {
   var trailSurrogate = str.charCodeAt(++i);
   codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
  }
  SAFE_HEAP_STORE(outPtr | 0, codeUnit | 0, 4);
  outPtr += 4;
  if (outPtr + 4 > endPtr) break;
 }
 SAFE_HEAP_STORE(outPtr | 0, 0 | 0, 4);
 return outPtr - startPtr;
}

function lengthBytesUTF32(str) {
 var len = 0;
 for (var i = 0; i < str.length; ++i) {
  var codeUnit = str.charCodeAt(i);
  if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
  len += 4;
 }
 return len;
}

function allocateUTF8(str) {
 var size = lengthBytesUTF8(str) + 1;
 var ret = _malloc(size);
 if (ret) stringToUTF8Array(str, HEAP8, ret, size);
 return ret;
}

function allocateUTF8OnStack(str) {
 var size = lengthBytesUTF8(str) + 1;
 var ret = stackAlloc(size);
 stringToUTF8Array(str, HEAP8, ret, size);
 return ret;
}

function writeStringToMemory(string, buffer, dontAddNull) {
 warnOnce("writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!");
 var lastChar, end;
 if (dontAddNull) {
  end = buffer + lengthBytesUTF8(string);
  lastChar = SAFE_HEAP_LOAD(end, 1, 0);
 }
 stringToUTF8(string, buffer, Infinity);
 if (dontAddNull) SAFE_HEAP_STORE(end, lastChar, 1);
}

function writeArrayToMemory(array, buffer) {
 assert(array.length >= 0, "writeArrayToMemory array must have a length (should be an array or typed array)");
 HEAP8.set(array, buffer);
}

function writeAsciiToMemory(str, buffer, dontAddNull) {
 for (var i = 0; i < str.length; ++i) {
  assert(str.charCodeAt(i) === str.charCodeAt(i) & 255);
  SAFE_HEAP_STORE(buffer++ | 0, str.charCodeAt(i) | 0, 1);
 }
 if (!dontAddNull) SAFE_HEAP_STORE(buffer | 0, 0 | 0, 1);
}

function alignUp(x, multiple) {
 if (x % multiple > 0) {
  x += multiple - x % multiple;
 }
 return x;
}

var HEAP, buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

function updateGlobalBufferAndViews(buf) {
 buffer = buf;
 Module["HEAP8"] = HEAP8 = new Int8Array(buf);
 Module["HEAP16"] = HEAP16 = new Int16Array(buf);
 Module["HEAP32"] = HEAP32 = new Int32Array(buf);
 Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
 Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
 Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
 Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
 Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
}

var TOTAL_STACK = 5242880;

if (Module["TOTAL_STACK"]) assert(TOTAL_STACK === Module["TOTAL_STACK"], "the stack size can no longer be determined at runtime");

var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;

if (!Object.getOwnPropertyDescriptor(Module, "INITIAL_MEMORY")) Object.defineProperty(Module, "INITIAL_MEMORY", {
 configurable: true,
 get: function() {
  abort("Module.INITIAL_MEMORY has been replaced with plain INITIAL_MEMORY (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

assert(INITIAL_MEMORY >= TOTAL_STACK, "INITIAL_MEMORY should be larger than TOTAL_STACK, was " + INITIAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")");

assert(typeof Int32Array !== "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray !== undefined && Int32Array.prototype.set !== undefined, "JS engine does not provide full typed array support");

assert(!Module["wasmMemory"], "Use of `wasmMemory` detected.  Use -s IMPORTED_MEMORY to define wasmMemory externally");

assert(INITIAL_MEMORY == 16777216, "Detected runtime INITIAL_MEMORY setting.  Use -s IMPORTED_MEMORY to define wasmMemory dynamically");

var wasmTable;

function writeStackCookie() {
 var max = _emscripten_stack_get_end();
 assert((max & 3) == 0);
 SAFE_HEAP_STORE(((max >> 2) + 1) * 4, 34821223, 4);
 SAFE_HEAP_STORE(((max >> 2) + 2) * 4, 2310721022, 4);
}

function checkStackCookie() {
 if (ABORT) return;
 var max = _emscripten_stack_get_end();
 var cookie1 = SAFE_HEAP_LOAD(((max >> 2) + 1) * 4, 4, 1);
 var cookie2 = SAFE_HEAP_LOAD(((max >> 2) + 2) * 4, 4, 1);
 if (cookie1 != 34821223 || cookie2 != 2310721022) {
  abort("Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x2135467, but received 0x" + cookie2.toString(16) + " " + cookie1.toString(16));
 }
}

(function() {
 var h16 = new Int16Array(1);
 var h8 = new Int8Array(h16.buffer);
 h16[0] = 25459;
 if (h8[0] !== 115 || h8[1] !== 99) throw "Runtime error: expected the system to be little-endian!";
})();

function abortFnPtrError(ptr, sig) {
 var possibleSig = "";
 for (var x in debug_tables) {
  var tbl = debug_tables[x];
  if (tbl[ptr]) {
   possibleSig += 'as sig "' + x + '" pointing to function ' + tbl[ptr] + ", ";
  }
 }
 abort("Invalid function pointer " + ptr + " called with signature '" + sig + "'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this). This pointer might make sense in another type signature: " + possibleSig);
}

var __ATPRERUN__ = [];

var __ATINIT__ = [];

var __ATMAIN__ = [];

var __ATEXIT__ = [];

var __ATPOSTRUN__ = [];

var runtimeInitialized = false;

var runtimeExited = false;

function preRun() {
 if (Module["preRun"]) {
  if (typeof Module["preRun"] == "function") Module["preRun"] = [ Module["preRun"] ];
  while (Module["preRun"].length) {
   addOnPreRun(Module["preRun"].shift());
  }
 }
 callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
 checkStackCookie();
 assert(!runtimeInitialized);
 runtimeInitialized = true;
 if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
 TTY.init();
 callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
 checkStackCookie();
 FS.ignorePermissions = false;
 callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
 checkStackCookie();
 runtimeExited = true;
}

function postRun() {
 checkStackCookie();
 if (Module["postRun"]) {
  if (typeof Module["postRun"] == "function") Module["postRun"] = [ Module["postRun"] ];
  while (Module["postRun"].length) {
   addOnPostRun(Module["postRun"].shift());
  }
 }
 callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
 __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
 __ATINIT__.unshift(cb);
}

function addOnPreMain(cb) {
 __ATMAIN__.unshift(cb);
}

function addOnExit(cb) {}

function addOnPostRun(cb) {
 __ATPOSTRUN__.unshift(cb);
}

assert(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");

assert(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");

assert(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");

assert(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");

var runDependencies = 0;

var runDependencyWatcher = null;

var dependenciesFulfilled = null;

var runDependencyTracking = {};

function getUniqueRunDependency(id) {
 var orig = id;
 while (1) {
  if (!runDependencyTracking[id]) return id;
  id = orig + Math.random();
 }
}

function addRunDependency(id) {
 runDependencies++;
 if (Module["monitorRunDependencies"]) {
  Module["monitorRunDependencies"](runDependencies);
 }
 if (id) {
  assert(!runDependencyTracking[id]);
  runDependencyTracking[id] = 1;
  if (runDependencyWatcher === null && typeof setInterval !== "undefined") {
   runDependencyWatcher = setInterval(function() {
    if (ABORT) {
     clearInterval(runDependencyWatcher);
     runDependencyWatcher = null;
     return;
    }
    var shown = false;
    for (var dep in runDependencyTracking) {
     if (!shown) {
      shown = true;
      err("still waiting on run dependencies:");
     }
     err("dependency: " + dep);
    }
    if (shown) {
     err("(end of list)");
    }
   }, 1e4);
  }
 } else {
  err("warning: run dependency added without ID");
 }
}

function removeRunDependency(id) {
 runDependencies--;
 if (Module["monitorRunDependencies"]) {
  Module["monitorRunDependencies"](runDependencies);
 }
 if (id) {
  assert(runDependencyTracking[id]);
  delete runDependencyTracking[id];
 } else {
  err("warning: run dependency removed without ID");
 }
 if (runDependencies == 0) {
  if (runDependencyWatcher !== null) {
   clearInterval(runDependencyWatcher);
   runDependencyWatcher = null;
  }
  if (dependenciesFulfilled) {
   var callback = dependenciesFulfilled;
   dependenciesFulfilled = null;
   callback();
  }
 }
}

Module["preloadedImages"] = {};

Module["preloadedAudios"] = {};

function abort(what) {
 if (Module["onAbort"]) {
  Module["onAbort"](what);
 }
 what += "";
 err(what);
 ABORT = true;
 EXITSTATUS = 1;
 var output = "abort(" + what + ") at " + stackTrace();
 what = output;
 var e = new WebAssembly.RuntimeError(what);
 readyPromiseReject(e);
 throw e;
}

function hasPrefix(str, prefix) {
 return String.prototype.startsWith ? str.startsWith(prefix) : str.indexOf(prefix) === 0;
}

var dataURIPrefix = "data:application/octet-stream;base64,";

function isDataURI(filename) {
 return hasPrefix(filename, dataURIPrefix);
}

var fileURIPrefix = "file://";

function isFileURI(filename) {
 return hasPrefix(filename, fileURIPrefix);
}

function createExportWrapper(name, fixedasm) {
 return function() {
  var displayName = name;
  var asm = fixedasm;
  if (!fixedasm) {
   asm = Module["asm"];
  }
  assert(runtimeInitialized, "native function `" + displayName + "` called before runtime initialization");
  assert(!runtimeExited, "native function `" + displayName + "` called after runtime exit (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
  if (!asm[name]) {
   assert(asm[name], "exported native function `" + displayName + "` not found");
  }
  return asm[name].apply(null, arguments);
 };
}

var wasmBinaryFile = "game_client.wasm";

if (!isDataURI(wasmBinaryFile)) {
 wasmBinaryFile = locateFile(wasmBinaryFile);
}

function getBinary() {
 try {
  if (wasmBinary) {
   return new Uint8Array(wasmBinary);
  }
  if (readBinary) {
   return readBinary(wasmBinaryFile);
  } else {
   throw "both async and sync fetching of the wasm failed";
  }
 } catch (err) {
  abort(err);
 }
}

function getBinaryPromise() {
 if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function" && !isFileURI(wasmBinaryFile)) {
  return fetch(wasmBinaryFile, {
   credentials: "same-origin"
  }).then(function(response) {
   if (!response["ok"]) {
    throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
   }
   return response["arrayBuffer"]();
  }).catch(function() {
   return getBinary();
  });
 }
 return Promise.resolve().then(getBinary);
}

function createWasm() {
 var info = {
  "env": asmLibraryArg,
  "wasi_snapshot_preview1": asmLibraryArg
 };
 function receiveInstance(instance, module) {
  var exports = instance.exports;
  Module["asm"] = exports;
  wasmMemory = Module["asm"]["memory"];
  assert(wasmMemory, "memory not found in wasm exports");
  updateGlobalBufferAndViews(wasmMemory.buffer);
  wasmTable = Module["asm"]["__indirect_function_table"];
  assert(wasmTable, "table not found in wasm exports");
  removeRunDependency("wasm-instantiate");
 }
 addRunDependency("wasm-instantiate");
 var trueModule = Module;
 function receiveInstantiatedSource(output) {
  assert(Module === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
  trueModule = null;
  receiveInstance(output["instance"]);
 }
 function instantiateArrayBuffer(receiver) {
  return getBinaryPromise().then(function(binary) {
   return WebAssembly.instantiate(binary, info);
  }).then(receiver, function(reason) {
   err("failed to asynchronously prepare wasm: " + reason);
   abort(reason);
  });
 }
 function instantiateAsync() {
  if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch === "function") {
   return fetch(wasmBinaryFile, {
    credentials: "same-origin"
   }).then(function(response) {
    var result = WebAssembly.instantiateStreaming(response, info);
    return result.then(receiveInstantiatedSource, function(reason) {
     err("wasm streaming compile failed: " + reason);
     err("falling back to ArrayBuffer instantiation");
     return instantiateArrayBuffer(receiveInstantiatedSource);
    });
   });
  } else {
   return instantiateArrayBuffer(receiveInstantiatedSource);
  }
 }
 if (Module["instantiateWasm"]) {
  try {
   var exports = Module["instantiateWasm"](info, receiveInstance);
   return exports;
  } catch (e) {
   err("Module.instantiateWasm callback failed with error: " + e);
   return false;
  }
 }
 instantiateAsync().catch(readyPromiseReject);
 return {};
}

var tempDouble;

var tempI64;

var ASM_CONSTS = {};

function abortStackOverflow(allocSize) {
 abort("Stack overflow! Attempted to allocate " + allocSize + " bytes on the stack, but stack has only " + (_emscripten_stack_get_free() + allocSize) + " bytes available!");
}

function callRuntimeCallbacks(callbacks) {
 while (callbacks.length > 0) {
  var callback = callbacks.shift();
  if (typeof callback == "function") {
   callback(Module);
   continue;
  }
  var func = callback.func;
  if (typeof func === "number") {
   if (callback.arg === undefined) {
    wasmTable.get(func)();
   } else {
    wasmTable.get(func)(callback.arg);
   }
  } else {
   func(callback.arg === undefined ? null : callback.arg);
  }
 }
}

function demangle(func) {
 warnOnce("warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling");
 return func;
}

function demangleAll(text) {
 var regex = /\b_Z[\w\d_]+/g;
 return text.replace(regex, function(x) {
  var y = demangle(x);
  return x === y ? x : y + " [" + x + "]";
 });
}

function jsStackTrace() {
 var error = new Error();
 if (!error.stack) {
  try {
   throw new Error();
  } catch (e) {
   error = e;
  }
  if (!error.stack) {
   return "(no stack trace available)";
  }
 }
 return error.stack.toString();
}

function stackTrace() {
 var js = jsStackTrace();
 if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
 return demangleAll(js);
}

function unSign(value, bits) {
 if (value >= 0) {
  return value;
 }
 return bits <= 32 ? 2 * Math.abs(1 << bits - 1) + value : Math.pow(2, bits) + value;
}

function ___assert_fail(condition, filename, line, func) {
 abort("Assertion failed: " + UTF8ToString(condition) + ", at: " + [ filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function" ]);
}

var ExceptionInfoAttrs = {
 DESTRUCTOR_OFFSET: 0,
 REFCOUNT_OFFSET: 4,
 TYPE_OFFSET: 8,
 CAUGHT_OFFSET: 12,
 RETHROWN_OFFSET: 13,
 SIZE: 16
};

function ___cxa_allocate_exception(size) {
 return _malloc(size + ExceptionInfoAttrs.SIZE) + ExceptionInfoAttrs.SIZE;
}

function _atexit(func, arg) {}

function ___cxa_atexit(a0, a1) {
 return _atexit(a0, a1);
}

function ExceptionInfo(excPtr) {
 this.excPtr = excPtr;
 this.ptr = excPtr - ExceptionInfoAttrs.SIZE;
 this.set_type = function(type) {
  SAFE_HEAP_STORE(this.ptr + ExceptionInfoAttrs.TYPE_OFFSET | 0, type | 0, 4);
 };
 this.get_type = function() {
  return SAFE_HEAP_LOAD(this.ptr + ExceptionInfoAttrs.TYPE_OFFSET | 0, 4, 0) | 0;
 };
 this.set_destructor = function(destructor) {
  SAFE_HEAP_STORE(this.ptr + ExceptionInfoAttrs.DESTRUCTOR_OFFSET | 0, destructor | 0, 4);
 };
 this.get_destructor = function() {
  return SAFE_HEAP_LOAD(this.ptr + ExceptionInfoAttrs.DESTRUCTOR_OFFSET | 0, 4, 0) | 0;
 };
 this.set_refcount = function(refcount) {
  SAFE_HEAP_STORE(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET | 0, refcount | 0, 4);
 };
 this.set_caught = function(caught) {
  caught = caught ? 1 : 0;
  SAFE_HEAP_STORE(this.ptr + ExceptionInfoAttrs.CAUGHT_OFFSET | 0, caught | 0, 1);
 };
 this.get_caught = function() {
  return (SAFE_HEAP_LOAD(this.ptr + ExceptionInfoAttrs.CAUGHT_OFFSET | 0, 1, 0) | 0) != 0;
 };
 this.set_rethrown = function(rethrown) {
  rethrown = rethrown ? 1 : 0;
  SAFE_HEAP_STORE(this.ptr + ExceptionInfoAttrs.RETHROWN_OFFSET | 0, rethrown | 0, 1);
 };
 this.get_rethrown = function() {
  return (SAFE_HEAP_LOAD(this.ptr + ExceptionInfoAttrs.RETHROWN_OFFSET | 0, 1, 0) | 0) != 0;
 };
 this.init = function(type, destructor) {
  this.set_type(type);
  this.set_destructor(destructor);
  this.set_refcount(0);
  this.set_caught(false);
  this.set_rethrown(false);
 };
 this.add_ref = function() {
  var value = SAFE_HEAP_LOAD(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET | 0, 4, 0) | 0;
  SAFE_HEAP_STORE(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET | 0, value + 1 | 0, 4);
 };
 this.release_ref = function() {
  var prev = SAFE_HEAP_LOAD(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET | 0, 4, 0) | 0;
  SAFE_HEAP_STORE(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET | 0, prev - 1 | 0, 4);
  assert(prev > 0);
  return prev === 1;
 };
}

var exceptionLast = 0;

var uncaughtExceptionCount = 0;

function ___cxa_throw(ptr, type, destructor) {
 var info = new ExceptionInfo(ptr);
 info.init(type, destructor);
 exceptionLast = ptr;
 uncaughtExceptionCount++;
 throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
}

function _abort() {
 abort();
}

function _emscripten_memcpy_big(dest, src, num) {
 HEAPU8.copyWithin(dest, src, src + num);
}

function _emscripten_get_heap_size() {
 return HEAPU8.length;
}

var _emscripten_get_now;

if (ENVIRONMENT_IS_NODE) {
 _emscripten_get_now = function() {
  var t = process["hrtime"]();
  return t[0] * 1e3 + t[1] / 1e6;
 };
} else if (typeof dateNow !== "undefined") {
 _emscripten_get_now = dateNow;
} else _emscripten_get_now = function() {
 return performance.now();
};

function emscripten_realloc_buffer(size) {
 try {
  wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
  updateGlobalBufferAndViews(wasmMemory.buffer);
  return 1;
 } catch (e) {
  console.error("emscripten_realloc_buffer: Attempted to grow heap from " + buffer.byteLength + " bytes to " + size + " bytes, but got error: " + e);
 }
}

function _emscripten_resize_heap(requestedSize) {
 requestedSize = requestedSize >>> 0;
 var oldSize = _emscripten_get_heap_size();
 assert(requestedSize > oldSize);
 var maxHeapSize = 2147483648;
 if (requestedSize > maxHeapSize) {
  err("Cannot enlarge memory, asked to go up to " + requestedSize + " bytes, but the limit is " + maxHeapSize + " bytes!");
  return false;
 }
 var minHeapSize = 16777216;
 for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
  var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
  overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
  var newSize = Math.min(maxHeapSize, alignUp(Math.max(minHeapSize, requestedSize, overGrownHeapSize), 65536));
  var t0 = _emscripten_get_now();
  var replacement = emscripten_realloc_buffer(newSize);
  var t1 = _emscripten_get_now();
  console.log("Heap resize call from " + oldSize + " to " + newSize + " took " + (t1 - t0) + " msecs. Success: " + !!replacement);
  if (replacement) {
   return true;
  }
 }
 err("Failed to grow the heap from " + oldSize + " bytes to " + newSize + " bytes, not enough memory!");
 return false;
}

var ENV = {};

function getExecutableName() {
 return thisProgram || "./this.program";
}

function getEnvStrings() {
 if (!getEnvStrings.strings) {
  var lang = (typeof navigator === "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
  var env = {
   "USER": "web_user",
   "LOGNAME": "web_user",
   "PATH": "/",
   "PWD": "/",
   "HOME": "/home/web_user",
   "LANG": lang,
   "_": getExecutableName()
  };
  for (var x in ENV) {
   env[x] = ENV[x];
  }
  var strings = [];
  for (var x in env) {
   strings.push(x + "=" + env[x]);
  }
  getEnvStrings.strings = strings;
 }
 return getEnvStrings.strings;
}

var PATH = {
 splitPath: function(filename) {
  var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
  return splitPathRe.exec(filename).slice(1);
 },
 normalizeArray: function(parts, allowAboveRoot) {
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
   var last = parts[i];
   if (last === ".") {
    parts.splice(i, 1);
   } else if (last === "..") {
    parts.splice(i, 1);
    up++;
   } else if (up) {
    parts.splice(i, 1);
    up--;
   }
  }
  if (allowAboveRoot) {
   for (;up; up--) {
    parts.unshift("..");
   }
  }
  return parts;
 },
 normalize: function(path) {
  var isAbsolute = path.charAt(0) === "/", trailingSlash = path.substr(-1) === "/";
  path = PATH.normalizeArray(path.split("/").filter(function(p) {
   return !!p;
  }), !isAbsolute).join("/");
  if (!path && !isAbsolute) {
   path = ".";
  }
  if (path && trailingSlash) {
   path += "/";
  }
  return (isAbsolute ? "/" : "") + path;
 },
 dirname: function(path) {
  var result = PATH.splitPath(path), root = result[0], dir = result[1];
  if (!root && !dir) {
   return ".";
  }
  if (dir) {
   dir = dir.substr(0, dir.length - 1);
  }
  return root + dir;
 },
 basename: function(path) {
  if (path === "/") return "/";
  path = PATH.normalize(path);
  path = path.replace(/\/$/, "");
  var lastSlash = path.lastIndexOf("/");
  if (lastSlash === -1) return path;
  return path.substr(lastSlash + 1);
 },
 extname: function(path) {
  return PATH.splitPath(path)[3];
 },
 join: function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return PATH.normalize(paths.join("/"));
 },
 join2: function(l, r) {
  return PATH.normalize(l + "/" + r);
 }
};

function getRandomDevice() {
 if (typeof crypto === "object" && typeof crypto["getRandomValues"] === "function") {
  var randomBuffer = new Uint8Array(1);
  return function() {
   crypto.getRandomValues(randomBuffer);
   return randomBuffer[0];
  };
 } else if (ENVIRONMENT_IS_NODE) {
  try {
   var crypto_module = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'crypto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
   return function() {
    return crypto_module["randomBytes"](1)[0];
   };
  } catch (e) {}
 }
 return function() {
  abort("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: function(array) { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };");
 };
}

var PATH_FS = {
 resolve: function() {
  var resolvedPath = "", resolvedAbsolute = false;
  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
   var path = i >= 0 ? arguments[i] : FS.cwd();
   if (typeof path !== "string") {
    throw new TypeError("Arguments to path.resolve must be strings");
   } else if (!path) {
    return "";
   }
   resolvedPath = path + "/" + resolvedPath;
   resolvedAbsolute = path.charAt(0) === "/";
  }
  resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(function(p) {
   return !!p;
  }), !resolvedAbsolute).join("/");
  return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
 },
 relative: function(from, to) {
  from = PATH_FS.resolve(from).substr(1);
  to = PATH_FS.resolve(to).substr(1);
  function trim(arr) {
   var start = 0;
   for (;start < arr.length; start++) {
    if (arr[start] !== "") break;
   }
   var end = arr.length - 1;
   for (;end >= 0; end--) {
    if (arr[end] !== "") break;
   }
   if (start > end) return [];
   return arr.slice(start, end - start + 1);
  }
  var fromParts = trim(from.split("/"));
  var toParts = trim(to.split("/"));
  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
   if (fromParts[i] !== toParts[i]) {
    samePartsLength = i;
    break;
   }
  }
  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
   outputParts.push("..");
  }
  outputParts = outputParts.concat(toParts.slice(samePartsLength));
  return outputParts.join("/");
 }
};

var TTY = {
 ttys: [],
 init: function() {},
 shutdown: function() {},
 register: function(dev, ops) {
  TTY.ttys[dev] = {
   input: [],
   output: [],
   ops: ops
  };
  FS.registerDevice(dev, TTY.stream_ops);
 },
 stream_ops: {
  open: function(stream) {
   var tty = TTY.ttys[stream.node.rdev];
   if (!tty) {
    throw new FS.ErrnoError(43);
   }
   stream.tty = tty;
   stream.seekable = false;
  },
  close: function(stream) {
   stream.tty.ops.flush(stream.tty);
  },
  flush: function(stream) {
   stream.tty.ops.flush(stream.tty);
  },
  read: function(stream, buffer, offset, length, pos) {
   if (!stream.tty || !stream.tty.ops.get_char) {
    throw new FS.ErrnoError(60);
   }
   var bytesRead = 0;
   for (var i = 0; i < length; i++) {
    var result;
    try {
     result = stream.tty.ops.get_char(stream.tty);
    } catch (e) {
     throw new FS.ErrnoError(29);
    }
    if (result === undefined && bytesRead === 0) {
     throw new FS.ErrnoError(6);
    }
    if (result === null || result === undefined) break;
    bytesRead++;
    buffer[offset + i] = result;
   }
   if (bytesRead) {
    stream.node.timestamp = Date.now();
   }
   return bytesRead;
  },
  write: function(stream, buffer, offset, length, pos) {
   if (!stream.tty || !stream.tty.ops.put_char) {
    throw new FS.ErrnoError(60);
   }
   try {
    for (var i = 0; i < length; i++) {
     stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
    }
   } catch (e) {
    throw new FS.ErrnoError(29);
   }
   if (length) {
    stream.node.timestamp = Date.now();
   }
   return i;
  }
 },
 default_tty_ops: {
  get_char: function(tty) {
   if (!tty.input.length) {
    var result = null;
    if (ENVIRONMENT_IS_NODE) {
     var BUFSIZE = 256;
     var buf = Buffer.alloc ? Buffer.alloc(BUFSIZE) : new Buffer(BUFSIZE);
     var bytesRead = 0;
     try {
      bytesRead = nodeFS.readSync(process.stdin.fd, buf, 0, BUFSIZE, null);
     } catch (e) {
      if (e.toString().indexOf("EOF") != -1) bytesRead = 0; else throw e;
     }
     if (bytesRead > 0) {
      result = buf.slice(0, bytesRead).toString("utf-8");
     } else {
      result = null;
     }
    } else if (typeof window != "undefined" && typeof window.prompt == "function") {
     result = window.prompt("Input: ");
     if (result !== null) {
      result += "\n";
     }
    } else if (typeof readline == "function") {
     result = readline();
     if (result !== null) {
      result += "\n";
     }
    }
    if (!result) {
     return null;
    }
    tty.input = intArrayFromString(result, true);
   }
   return tty.input.shift();
  },
  put_char: function(tty, val) {
   if (val === null || val === 10) {
    out(UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   } else {
    if (val != 0) tty.output.push(val);
   }
  },
  flush: function(tty) {
   if (tty.output && tty.output.length > 0) {
    out(UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   }
  }
 },
 default_tty1_ops: {
  put_char: function(tty, val) {
   if (val === null || val === 10) {
    err(UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   } else {
    if (val != 0) tty.output.push(val);
   }
  },
  flush: function(tty) {
   if (tty.output && tty.output.length > 0) {
    err(UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   }
  }
 }
};

function mmapAlloc(size) {
 var alignedSize = alignMemory(size, 16384);
 var ptr = _malloc(alignedSize);
 while (size < alignedSize) SAFE_HEAP_STORE(ptr + size++, 0, 1);
 return ptr;
}

var MEMFS = {
 ops_table: null,
 mount: function(mount) {
  return MEMFS.createNode(null, "/", 16384 | 511, 0);
 },
 createNode: function(parent, name, mode, dev) {
  if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
   throw new FS.ErrnoError(63);
  }
  if (!MEMFS.ops_table) {
   MEMFS.ops_table = {
    dir: {
     node: {
      getattr: MEMFS.node_ops.getattr,
      setattr: MEMFS.node_ops.setattr,
      lookup: MEMFS.node_ops.lookup,
      mknod: MEMFS.node_ops.mknod,
      rename: MEMFS.node_ops.rename,
      unlink: MEMFS.node_ops.unlink,
      rmdir: MEMFS.node_ops.rmdir,
      readdir: MEMFS.node_ops.readdir,
      symlink: MEMFS.node_ops.symlink
     },
     stream: {
      llseek: MEMFS.stream_ops.llseek
     }
    },
    file: {
     node: {
      getattr: MEMFS.node_ops.getattr,
      setattr: MEMFS.node_ops.setattr
     },
     stream: {
      llseek: MEMFS.stream_ops.llseek,
      read: MEMFS.stream_ops.read,
      write: MEMFS.stream_ops.write,
      allocate: MEMFS.stream_ops.allocate,
      mmap: MEMFS.stream_ops.mmap,
      msync: MEMFS.stream_ops.msync
     }
    },
    link: {
     node: {
      getattr: MEMFS.node_ops.getattr,
      setattr: MEMFS.node_ops.setattr,
      readlink: MEMFS.node_ops.readlink
     },
     stream: {}
    },
    chrdev: {
     node: {
      getattr: MEMFS.node_ops.getattr,
      setattr: MEMFS.node_ops.setattr
     },
     stream: FS.chrdev_stream_ops
    }
   };
  }
  var node = FS.createNode(parent, name, mode, dev);
  if (FS.isDir(node.mode)) {
   node.node_ops = MEMFS.ops_table.dir.node;
   node.stream_ops = MEMFS.ops_table.dir.stream;
   node.contents = {};
  } else if (FS.isFile(node.mode)) {
   node.node_ops = MEMFS.ops_table.file.node;
   node.stream_ops = MEMFS.ops_table.file.stream;
   node.usedBytes = 0;
   node.contents = null;
  } else if (FS.isLink(node.mode)) {
   node.node_ops = MEMFS.ops_table.link.node;
   node.stream_ops = MEMFS.ops_table.link.stream;
  } else if (FS.isChrdev(node.mode)) {
   node.node_ops = MEMFS.ops_table.chrdev.node;
   node.stream_ops = MEMFS.ops_table.chrdev.stream;
  }
  node.timestamp = Date.now();
  if (parent) {
   parent.contents[name] = node;
  }
  return node;
 },
 getFileDataAsRegularArray: function(node) {
  if (node.contents && node.contents.subarray) {
   var arr = [];
   for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
   return arr;
  }
  return node.contents;
 },
 getFileDataAsTypedArray: function(node) {
  if (!node.contents) return new Uint8Array(0);
  if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
  return new Uint8Array(node.contents);
 },
 expandFileStorage: function(node, newCapacity) {
  var prevCapacity = node.contents ? node.contents.length : 0;
  if (prevCapacity >= newCapacity) return;
  var CAPACITY_DOUBLING_MAX = 1024 * 1024;
  newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
  if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
  var oldContents = node.contents;
  node.contents = new Uint8Array(newCapacity);
  if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
  return;
 },
 resizeFileStorage: function(node, newSize) {
  if (node.usedBytes == newSize) return;
  if (newSize == 0) {
   node.contents = null;
   node.usedBytes = 0;
   return;
  }
  if (!node.contents || node.contents.subarray) {
   var oldContents = node.contents;
   node.contents = new Uint8Array(newSize);
   if (oldContents) {
    node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
   }
   node.usedBytes = newSize;
   return;
  }
  if (!node.contents) node.contents = [];
  if (node.contents.length > newSize) node.contents.length = newSize; else while (node.contents.length < newSize) node.contents.push(0);
  node.usedBytes = newSize;
 },
 node_ops: {
  getattr: function(node) {
   var attr = {};
   attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
   attr.ino = node.id;
   attr.mode = node.mode;
   attr.nlink = 1;
   attr.uid = 0;
   attr.gid = 0;
   attr.rdev = node.rdev;
   if (FS.isDir(node.mode)) {
    attr.size = 4096;
   } else if (FS.isFile(node.mode)) {
    attr.size = node.usedBytes;
   } else if (FS.isLink(node.mode)) {
    attr.size = node.link.length;
   } else {
    attr.size = 0;
   }
   attr.atime = new Date(node.timestamp);
   attr.mtime = new Date(node.timestamp);
   attr.ctime = new Date(node.timestamp);
   attr.blksize = 4096;
   attr.blocks = Math.ceil(attr.size / attr.blksize);
   return attr;
  },
  setattr: function(node, attr) {
   if (attr.mode !== undefined) {
    node.mode = attr.mode;
   }
   if (attr.timestamp !== undefined) {
    node.timestamp = attr.timestamp;
   }
   if (attr.size !== undefined) {
    MEMFS.resizeFileStorage(node, attr.size);
   }
  },
  lookup: function(parent, name) {
   throw FS.genericErrors[44];
  },
  mknod: function(parent, name, mode, dev) {
   return MEMFS.createNode(parent, name, mode, dev);
  },
  rename: function(old_node, new_dir, new_name) {
   if (FS.isDir(old_node.mode)) {
    var new_node;
    try {
     new_node = FS.lookupNode(new_dir, new_name);
    } catch (e) {}
    if (new_node) {
     for (var i in new_node.contents) {
      throw new FS.ErrnoError(55);
     }
    }
   }
   delete old_node.parent.contents[old_node.name];
   old_node.name = new_name;
   new_dir.contents[new_name] = old_node;
   old_node.parent = new_dir;
  },
  unlink: function(parent, name) {
   delete parent.contents[name];
  },
  rmdir: function(parent, name) {
   var node = FS.lookupNode(parent, name);
   for (var i in node.contents) {
    throw new FS.ErrnoError(55);
   }
   delete parent.contents[name];
  },
  readdir: function(node) {
   var entries = [ ".", ".." ];
   for (var key in node.contents) {
    if (!node.contents.hasOwnProperty(key)) {
     continue;
    }
    entries.push(key);
   }
   return entries;
  },
  symlink: function(parent, newname, oldpath) {
   var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
   node.link = oldpath;
   return node;
  },
  readlink: function(node) {
   if (!FS.isLink(node.mode)) {
    throw new FS.ErrnoError(28);
   }
   return node.link;
  }
 },
 stream_ops: {
  read: function(stream, buffer, offset, length, position) {
   var contents = stream.node.contents;
   if (position >= stream.node.usedBytes) return 0;
   var size = Math.min(stream.node.usedBytes - position, length);
   assert(size >= 0);
   if (size > 8 && contents.subarray) {
    buffer.set(contents.subarray(position, position + size), offset);
   } else {
    for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
   }
   return size;
  },
  write: function(stream, buffer, offset, length, position, canOwn) {
   assert(!(buffer instanceof ArrayBuffer));
   if (buffer.buffer === HEAP8.buffer) {
    canOwn = false;
   }
   if (!length) return 0;
   var node = stream.node;
   node.timestamp = Date.now();
   if (buffer.subarray && (!node.contents || node.contents.subarray)) {
    if (canOwn) {
     assert(position === 0, "canOwn must imply no weird position inside the file");
     node.contents = buffer.subarray(offset, offset + length);
     node.usedBytes = length;
     return length;
    } else if (node.usedBytes === 0 && position === 0) {
     node.contents = buffer.slice(offset, offset + length);
     node.usedBytes = length;
     return length;
    } else if (position + length <= node.usedBytes) {
     node.contents.set(buffer.subarray(offset, offset + length), position);
     return length;
    }
   }
   MEMFS.expandFileStorage(node, position + length);
   if (node.contents.subarray && buffer.subarray) {
    node.contents.set(buffer.subarray(offset, offset + length), position);
   } else {
    for (var i = 0; i < length; i++) {
     node.contents[position + i] = buffer[offset + i];
    }
   }
   node.usedBytes = Math.max(node.usedBytes, position + length);
   return length;
  },
  llseek: function(stream, offset, whence) {
   var position = offset;
   if (whence === 1) {
    position += stream.position;
   } else if (whence === 2) {
    if (FS.isFile(stream.node.mode)) {
     position += stream.node.usedBytes;
    }
   }
   if (position < 0) {
    throw new FS.ErrnoError(28);
   }
   return position;
  },
  allocate: function(stream, offset, length) {
   MEMFS.expandFileStorage(stream.node, offset + length);
   stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
  },
  mmap: function(stream, address, length, position, prot, flags) {
   assert(address === 0);
   if (!FS.isFile(stream.node.mode)) {
    throw new FS.ErrnoError(43);
   }
   var ptr;
   var allocated;
   var contents = stream.node.contents;
   if (!(flags & 2) && contents.buffer === buffer) {
    allocated = false;
    ptr = contents.byteOffset;
   } else {
    if (position > 0 || position + length < contents.length) {
     if (contents.subarray) {
      contents = contents.subarray(position, position + length);
     } else {
      contents = Array.prototype.slice.call(contents, position, position + length);
     }
    }
    allocated = true;
    ptr = mmapAlloc(length);
    if (!ptr) {
     throw new FS.ErrnoError(48);
    }
    HEAP8.set(contents, ptr);
   }
   return {
    ptr: ptr,
    allocated: allocated
   };
  },
  msync: function(stream, buffer, offset, length, mmapFlags) {
   if (!FS.isFile(stream.node.mode)) {
    throw new FS.ErrnoError(43);
   }
   if (mmapFlags & 2) {
    return 0;
   }
   var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
   return 0;
  }
 }
};

var ERRNO_MESSAGES = {
 0: "Success",
 1: "Arg list too long",
 2: "Permission denied",
 3: "Address already in use",
 4: "Address not available",
 5: "Address family not supported by protocol family",
 6: "No more processes",
 7: "Socket already connected",
 8: "Bad file number",
 9: "Trying to read unreadable message",
 10: "Mount device busy",
 11: "Operation canceled",
 12: "No children",
 13: "Connection aborted",
 14: "Connection refused",
 15: "Connection reset by peer",
 16: "File locking deadlock error",
 17: "Destination address required",
 18: "Math arg out of domain of func",
 19: "Quota exceeded",
 20: "File exists",
 21: "Bad address",
 22: "File too large",
 23: "Host is unreachable",
 24: "Identifier removed",
 25: "Illegal byte sequence",
 26: "Connection already in progress",
 27: "Interrupted system call",
 28: "Invalid argument",
 29: "I/O error",
 30: "Socket is already connected",
 31: "Is a directory",
 32: "Too many symbolic links",
 33: "Too many open files",
 34: "Too many links",
 35: "Message too long",
 36: "Multihop attempted",
 37: "File or path name too long",
 38: "Network interface is not configured",
 39: "Connection reset by network",
 40: "Network is unreachable",
 41: "Too many open files in system",
 42: "No buffer space available",
 43: "No such device",
 44: "No such file or directory",
 45: "Exec format error",
 46: "No record locks available",
 47: "The link has been severed",
 48: "Not enough core",
 49: "No message of desired type",
 50: "Protocol not available",
 51: "No space left on device",
 52: "Function not implemented",
 53: "Socket is not connected",
 54: "Not a directory",
 55: "Directory not empty",
 56: "State not recoverable",
 57: "Socket operation on non-socket",
 59: "Not a typewriter",
 60: "No such device or address",
 61: "Value too large for defined data type",
 62: "Previous owner died",
 63: "Not super-user",
 64: "Broken pipe",
 65: "Protocol error",
 66: "Unknown protocol",
 67: "Protocol wrong type for socket",
 68: "Math result not representable",
 69: "Read only file system",
 70: "Illegal seek",
 71: "No such process",
 72: "Stale file handle",
 73: "Connection timed out",
 74: "Text file busy",
 75: "Cross-device link",
 100: "Device not a stream",
 101: "Bad font file fmt",
 102: "Invalid slot",
 103: "Invalid request code",
 104: "No anode",
 105: "Block device required",
 106: "Channel number out of range",
 107: "Level 3 halted",
 108: "Level 3 reset",
 109: "Link number out of range",
 110: "Protocol driver not attached",
 111: "No CSI structure available",
 112: "Level 2 halted",
 113: "Invalid exchange",
 114: "Invalid request descriptor",
 115: "Exchange full",
 116: "No data (for no delay io)",
 117: "Timer expired",
 118: "Out of streams resources",
 119: "Machine is not on the network",
 120: "Package not installed",
 121: "The object is remote",
 122: "Advertise error",
 123: "Srmount error",
 124: "Communication error on send",
 125: "Cross mount point (not really error)",
 126: "Given log. name not unique",
 127: "f.d. invalid for this operation",
 128: "Remote address changed",
 129: "Can   access a needed shared lib",
 130: "Accessing a corrupted shared lib",
 131: ".lib section in a.out corrupted",
 132: "Attempting to link in too many libs",
 133: "Attempting to exec a shared library",
 135: "Streams pipe error",
 136: "Too many users",
 137: "Socket type not supported",
 138: "Not supported",
 139: "Protocol family not supported",
 140: "Can't send after socket shutdown",
 141: "Too many references",
 142: "Host is down",
 148: "No medium (in tape drive)",
 156: "Level 2 not synchronized"
};

var ERRNO_CODES = {
 EPERM: 63,
 ENOENT: 44,
 ESRCH: 71,
 EINTR: 27,
 EIO: 29,
 ENXIO: 60,
 E2BIG: 1,
 ENOEXEC: 45,
 EBADF: 8,
 ECHILD: 12,
 EAGAIN: 6,
 EWOULDBLOCK: 6,
 ENOMEM: 48,
 EACCES: 2,
 EFAULT: 21,
 ENOTBLK: 105,
 EBUSY: 10,
 EEXIST: 20,
 EXDEV: 75,
 ENODEV: 43,
 ENOTDIR: 54,
 EISDIR: 31,
 EINVAL: 28,
 ENFILE: 41,
 EMFILE: 33,
 ENOTTY: 59,
 ETXTBSY: 74,
 EFBIG: 22,
 ENOSPC: 51,
 ESPIPE: 70,
 EROFS: 69,
 EMLINK: 34,
 EPIPE: 64,
 EDOM: 18,
 ERANGE: 68,
 ENOMSG: 49,
 EIDRM: 24,
 ECHRNG: 106,
 EL2NSYNC: 156,
 EL3HLT: 107,
 EL3RST: 108,
 ELNRNG: 109,
 EUNATCH: 110,
 ENOCSI: 111,
 EL2HLT: 112,
 EDEADLK: 16,
 ENOLCK: 46,
 EBADE: 113,
 EBADR: 114,
 EXFULL: 115,
 ENOANO: 104,
 EBADRQC: 103,
 EBADSLT: 102,
 EDEADLOCK: 16,
 EBFONT: 101,
 ENOSTR: 100,
 ENODATA: 116,
 ETIME: 117,
 ENOSR: 118,
 ENONET: 119,
 ENOPKG: 120,
 EREMOTE: 121,
 ENOLINK: 47,
 EADV: 122,
 ESRMNT: 123,
 ECOMM: 124,
 EPROTO: 65,
 EMULTIHOP: 36,
 EDOTDOT: 125,
 EBADMSG: 9,
 ENOTUNIQ: 126,
 EBADFD: 127,
 EREMCHG: 128,
 ELIBACC: 129,
 ELIBBAD: 130,
 ELIBSCN: 131,
 ELIBMAX: 132,
 ELIBEXEC: 133,
 ENOSYS: 52,
 ENOTEMPTY: 55,
 ENAMETOOLONG: 37,
 ELOOP: 32,
 EOPNOTSUPP: 138,
 EPFNOSUPPORT: 139,
 ECONNRESET: 15,
 ENOBUFS: 42,
 EAFNOSUPPORT: 5,
 EPROTOTYPE: 67,
 ENOTSOCK: 57,
 ENOPROTOOPT: 50,
 ESHUTDOWN: 140,
 ECONNREFUSED: 14,
 EADDRINUSE: 3,
 ECONNABORTED: 13,
 ENETUNREACH: 40,
 ENETDOWN: 38,
 ETIMEDOUT: 73,
 EHOSTDOWN: 142,
 EHOSTUNREACH: 23,
 EINPROGRESS: 26,
 EALREADY: 7,
 EDESTADDRREQ: 17,
 EMSGSIZE: 35,
 EPROTONOSUPPORT: 66,
 ESOCKTNOSUPPORT: 137,
 EADDRNOTAVAIL: 4,
 ENETRESET: 39,
 EISCONN: 30,
 ENOTCONN: 53,
 ETOOMANYREFS: 141,
 EUSERS: 136,
 EDQUOT: 19,
 ESTALE: 72,
 ENOTSUP: 138,
 ENOMEDIUM: 148,
 EILSEQ: 25,
 EOVERFLOW: 61,
 ECANCELED: 11,
 ENOTRECOVERABLE: 56,
 EOWNERDEAD: 62,
 ESTRPIPE: 135
};

var FS = {
 root: null,
 mounts: [],
 devices: {},
 streams: [],
 nextInode: 1,
 nameTable: null,
 currentPath: "/",
 initialized: false,
 ignorePermissions: true,
 trackingDelegate: {},
 tracking: {
  openFlags: {
   READ: 1,
   WRITE: 2
  }
 },
 ErrnoError: null,
 genericErrors: {},
 filesystems: null,
 syncFSRequests: 0,
 lookupPath: function(path, opts) {
  path = PATH_FS.resolve(FS.cwd(), path);
  opts = opts || {};
  if (!path) return {
   path: "",
   node: null
  };
  var defaults = {
   follow_mount: true,
   recurse_count: 0
  };
  for (var key in defaults) {
   if (opts[key] === undefined) {
    opts[key] = defaults[key];
   }
  }
  if (opts.recurse_count > 8) {
   throw new FS.ErrnoError(32);
  }
  var parts = PATH.normalizeArray(path.split("/").filter(function(p) {
   return !!p;
  }), false);
  var current = FS.root;
  var current_path = "/";
  for (var i = 0; i < parts.length; i++) {
   var islast = i === parts.length - 1;
   if (islast && opts.parent) {
    break;
   }
   current = FS.lookupNode(current, parts[i]);
   current_path = PATH.join2(current_path, parts[i]);
   if (FS.isMountpoint(current)) {
    if (!islast || islast && opts.follow_mount) {
     current = current.mounted.root;
    }
   }
   if (!islast || opts.follow) {
    var count = 0;
    while (FS.isLink(current.mode)) {
     var link = FS.readlink(current_path);
     current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
     var lookup = FS.lookupPath(current_path, {
      recurse_count: opts.recurse_count
     });
     current = lookup.node;
     if (count++ > 40) {
      throw new FS.ErrnoError(32);
     }
    }
   }
  }
  return {
   path: current_path,
   node: current
  };
 },
 getPath: function(node) {
  var path;
  while (true) {
   if (FS.isRoot(node)) {
    var mount = node.mount.mountpoint;
    if (!path) return mount;
    return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path;
   }
   path = path ? node.name + "/" + path : node.name;
   node = node.parent;
  }
 },
 hashName: function(parentid, name) {
  var hash = 0;
  for (var i = 0; i < name.length; i++) {
   hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
  }
  return (parentid + hash >>> 0) % FS.nameTable.length;
 },
 hashAddNode: function(node) {
  var hash = FS.hashName(node.parent.id, node.name);
  node.name_next = FS.nameTable[hash];
  FS.nameTable[hash] = node;
 },
 hashRemoveNode: function(node) {
  var hash = FS.hashName(node.parent.id, node.name);
  if (FS.nameTable[hash] === node) {
   FS.nameTable[hash] = node.name_next;
  } else {
   var current = FS.nameTable[hash];
   while (current) {
    if (current.name_next === node) {
     current.name_next = node.name_next;
     break;
    }
    current = current.name_next;
   }
  }
 },
 lookupNode: function(parent, name) {
  var errCode = FS.mayLookup(parent);
  if (errCode) {
   throw new FS.ErrnoError(errCode, parent);
  }
  var hash = FS.hashName(parent.id, name);
  for (var node = FS.nameTable[hash]; node; node = node.name_next) {
   var nodeName = node.name;
   if (node.parent.id === parent.id && nodeName === name) {
    return node;
   }
  }
  return FS.lookup(parent, name);
 },
 createNode: function(parent, name, mode, rdev) {
  var node = new FS.FSNode(parent, name, mode, rdev);
  FS.hashAddNode(node);
  return node;
 },
 destroyNode: function(node) {
  FS.hashRemoveNode(node);
 },
 isRoot: function(node) {
  return node === node.parent;
 },
 isMountpoint: function(node) {
  return !!node.mounted;
 },
 isFile: function(mode) {
  return (mode & 61440) === 32768;
 },
 isDir: function(mode) {
  return (mode & 61440) === 16384;
 },
 isLink: function(mode) {
  return (mode & 61440) === 40960;
 },
 isChrdev: function(mode) {
  return (mode & 61440) === 8192;
 },
 isBlkdev: function(mode) {
  return (mode & 61440) === 24576;
 },
 isFIFO: function(mode) {
  return (mode & 61440) === 4096;
 },
 isSocket: function(mode) {
  return (mode & 49152) === 49152;
 },
 flagModes: {
  "r": 0,
  "r+": 2,
  "w": 577,
  "w+": 578,
  "a": 1089,
  "a+": 1090
 },
 modeStringToFlags: function(str) {
  var flags = FS.flagModes[str];
  if (typeof flags === "undefined") {
   throw new Error("Unknown file open mode: " + str);
  }
  return flags;
 },
 flagsToPermissionString: function(flag) {
  var perms = [ "r", "w", "rw" ][flag & 3];
  if (flag & 512) {
   perms += "w";
  }
  return perms;
 },
 nodePermissions: function(node, perms) {
  if (FS.ignorePermissions) {
   return 0;
  }
  if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
   return 2;
  } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
   return 2;
  } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
   return 2;
  }
  return 0;
 },
 mayLookup: function(dir) {
  var errCode = FS.nodePermissions(dir, "x");
  if (errCode) return errCode;
  if (!dir.node_ops.lookup) return 2;
  return 0;
 },
 mayCreate: function(dir, name) {
  try {
   var node = FS.lookupNode(dir, name);
   return 20;
  } catch (e) {}
  return FS.nodePermissions(dir, "wx");
 },
 mayDelete: function(dir, name, isdir) {
  var node;
  try {
   node = FS.lookupNode(dir, name);
  } catch (e) {
   return e.errno;
  }
  var errCode = FS.nodePermissions(dir, "wx");
  if (errCode) {
   return errCode;
  }
  if (isdir) {
   if (!FS.isDir(node.mode)) {
    return 54;
   }
   if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
    return 10;
   }
  } else {
   if (FS.isDir(node.mode)) {
    return 31;
   }
  }
  return 0;
 },
 mayOpen: function(node, flags) {
  if (!node) {
   return 44;
  }
  if (FS.isLink(node.mode)) {
   return 32;
  } else if (FS.isDir(node.mode)) {
   if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
    return 31;
   }
  }
  return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
 },
 MAX_OPEN_FDS: 4096,
 nextfd: function(fd_start, fd_end) {
  fd_start = fd_start || 0;
  fd_end = fd_end || FS.MAX_OPEN_FDS;
  for (var fd = fd_start; fd <= fd_end; fd++) {
   if (!FS.streams[fd]) {
    return fd;
   }
  }
  throw new FS.ErrnoError(33);
 },
 getStream: function(fd) {
  return FS.streams[fd];
 },
 createStream: function(stream, fd_start, fd_end) {
  if (!FS.FSStream) {
   FS.FSStream = function() {};
   FS.FSStream.prototype = {
    object: {
     get: function() {
      return this.node;
     },
     set: function(val) {
      this.node = val;
     }
    },
    isRead: {
     get: function() {
      return (this.flags & 2097155) !== 1;
     }
    },
    isWrite: {
     get: function() {
      return (this.flags & 2097155) !== 0;
     }
    },
    isAppend: {
     get: function() {
      return this.flags & 1024;
     }
    }
   };
  }
  var newStream = new FS.FSStream();
  for (var p in stream) {
   newStream[p] = stream[p];
  }
  stream = newStream;
  var fd = FS.nextfd(fd_start, fd_end);
  stream.fd = fd;
  FS.streams[fd] = stream;
  return stream;
 },
 closeStream: function(fd) {
  FS.streams[fd] = null;
 },
 chrdev_stream_ops: {
  open: function(stream) {
   var device = FS.getDevice(stream.node.rdev);
   stream.stream_ops = device.stream_ops;
   if (stream.stream_ops.open) {
    stream.stream_ops.open(stream);
   }
  },
  llseek: function() {
   throw new FS.ErrnoError(70);
  }
 },
 major: function(dev) {
  return dev >> 8;
 },
 minor: function(dev) {
  return dev & 255;
 },
 makedev: function(ma, mi) {
  return ma << 8 | mi;
 },
 registerDevice: function(dev, ops) {
  FS.devices[dev] = {
   stream_ops: ops
  };
 },
 getDevice: function(dev) {
  return FS.devices[dev];
 },
 getMounts: function(mount) {
  var mounts = [];
  var check = [ mount ];
  while (check.length) {
   var m = check.pop();
   mounts.push(m);
   check.push.apply(check, m.mounts);
  }
  return mounts;
 },
 syncfs: function(populate, callback) {
  if (typeof populate === "function") {
   callback = populate;
   populate = false;
  }
  FS.syncFSRequests++;
  if (FS.syncFSRequests > 1) {
   err("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work");
  }
  var mounts = FS.getMounts(FS.root.mount);
  var completed = 0;
  function doCallback(errCode) {
   assert(FS.syncFSRequests > 0);
   FS.syncFSRequests--;
   return callback(errCode);
  }
  function done(errCode) {
   if (errCode) {
    if (!done.errored) {
     done.errored = true;
     return doCallback(errCode);
    }
    return;
   }
   if (++completed >= mounts.length) {
    doCallback(null);
   }
  }
  mounts.forEach(function(mount) {
   if (!mount.type.syncfs) {
    return done(null);
   }
   mount.type.syncfs(mount, populate, done);
  });
 },
 mount: function(type, opts, mountpoint) {
  if (typeof type === "string") {
   throw type;
  }
  var root = mountpoint === "/";
  var pseudo = !mountpoint;
  var node;
  if (root && FS.root) {
   throw new FS.ErrnoError(10);
  } else if (!root && !pseudo) {
   var lookup = FS.lookupPath(mountpoint, {
    follow_mount: false
   });
   mountpoint = lookup.path;
   node = lookup.node;
   if (FS.isMountpoint(node)) {
    throw new FS.ErrnoError(10);
   }
   if (!FS.isDir(node.mode)) {
    throw new FS.ErrnoError(54);
   }
  }
  var mount = {
   type: type,
   opts: opts,
   mountpoint: mountpoint,
   mounts: []
  };
  var mountRoot = type.mount(mount);
  mountRoot.mount = mount;
  mount.root = mountRoot;
  if (root) {
   FS.root = mountRoot;
  } else if (node) {
   node.mounted = mount;
   if (node.mount) {
    node.mount.mounts.push(mount);
   }
  }
  return mountRoot;
 },
 unmount: function(mountpoint) {
  var lookup = FS.lookupPath(mountpoint, {
   follow_mount: false
  });
  if (!FS.isMountpoint(lookup.node)) {
   throw new FS.ErrnoError(28);
  }
  var node = lookup.node;
  var mount = node.mounted;
  var mounts = FS.getMounts(mount);
  Object.keys(FS.nameTable).forEach(function(hash) {
   var current = FS.nameTable[hash];
   while (current) {
    var next = current.name_next;
    if (mounts.indexOf(current.mount) !== -1) {
     FS.destroyNode(current);
    }
    current = next;
   }
  });
  node.mounted = null;
  var idx = node.mount.mounts.indexOf(mount);
  assert(idx !== -1);
  node.mount.mounts.splice(idx, 1);
 },
 lookup: function(parent, name) {
  return parent.node_ops.lookup(parent, name);
 },
 mknod: function(path, mode, dev) {
  var lookup = FS.lookupPath(path, {
   parent: true
  });
  var parent = lookup.node;
  var name = PATH.basename(path);
  if (!name || name === "." || name === "..") {
   throw new FS.ErrnoError(28);
  }
  var errCode = FS.mayCreate(parent, name);
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  if (!parent.node_ops.mknod) {
   throw new FS.ErrnoError(63);
  }
  return parent.node_ops.mknod(parent, name, mode, dev);
 },
 create: function(path, mode) {
  mode = mode !== undefined ? mode : 438;
  mode &= 4095;
  mode |= 32768;
  return FS.mknod(path, mode, 0);
 },
 mkdir: function(path, mode) {
  mode = mode !== undefined ? mode : 511;
  mode &= 511 | 512;
  mode |= 16384;
  return FS.mknod(path, mode, 0);
 },
 mkdirTree: function(path, mode) {
  var dirs = path.split("/");
  var d = "";
  for (var i = 0; i < dirs.length; ++i) {
   if (!dirs[i]) continue;
   d += "/" + dirs[i];
   try {
    FS.mkdir(d, mode);
   } catch (e) {
    if (e.errno != 20) throw e;
   }
  }
 },
 mkdev: function(path, mode, dev) {
  if (typeof dev === "undefined") {
   dev = mode;
   mode = 438;
  }
  mode |= 8192;
  return FS.mknod(path, mode, dev);
 },
 symlink: function(oldpath, newpath) {
  if (!PATH_FS.resolve(oldpath)) {
   throw new FS.ErrnoError(44);
  }
  var lookup = FS.lookupPath(newpath, {
   parent: true
  });
  var parent = lookup.node;
  if (!parent) {
   throw new FS.ErrnoError(44);
  }
  var newname = PATH.basename(newpath);
  var errCode = FS.mayCreate(parent, newname);
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  if (!parent.node_ops.symlink) {
   throw new FS.ErrnoError(63);
  }
  return parent.node_ops.symlink(parent, newname, oldpath);
 },
 rename: function(old_path, new_path) {
  var old_dirname = PATH.dirname(old_path);
  var new_dirname = PATH.dirname(new_path);
  var old_name = PATH.basename(old_path);
  var new_name = PATH.basename(new_path);
  var lookup, old_dir, new_dir;
  lookup = FS.lookupPath(old_path, {
   parent: true
  });
  old_dir = lookup.node;
  lookup = FS.lookupPath(new_path, {
   parent: true
  });
  new_dir = lookup.node;
  if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
  if (old_dir.mount !== new_dir.mount) {
   throw new FS.ErrnoError(75);
  }
  var old_node = FS.lookupNode(old_dir, old_name);
  var relative = PATH_FS.relative(old_path, new_dirname);
  if (relative.charAt(0) !== ".") {
   throw new FS.ErrnoError(28);
  }
  relative = PATH_FS.relative(new_path, old_dirname);
  if (relative.charAt(0) !== ".") {
   throw new FS.ErrnoError(55);
  }
  var new_node;
  try {
   new_node = FS.lookupNode(new_dir, new_name);
  } catch (e) {}
  if (old_node === new_node) {
   return;
  }
  var isdir = FS.isDir(old_node.mode);
  var errCode = FS.mayDelete(old_dir, old_name, isdir);
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  if (!old_dir.node_ops.rename) {
   throw new FS.ErrnoError(63);
  }
  if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
   throw new FS.ErrnoError(10);
  }
  if (new_dir !== old_dir) {
   errCode = FS.nodePermissions(old_dir, "w");
   if (errCode) {
    throw new FS.ErrnoError(errCode);
   }
  }
  try {
   if (FS.trackingDelegate["willMovePath"]) {
    FS.trackingDelegate["willMovePath"](old_path, new_path);
   }
  } catch (e) {
   err("FS.trackingDelegate['willMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message);
  }
  FS.hashRemoveNode(old_node);
  try {
   old_dir.node_ops.rename(old_node, new_dir, new_name);
  } catch (e) {
   throw e;
  } finally {
   FS.hashAddNode(old_node);
  }
  try {
   if (FS.trackingDelegate["onMovePath"]) FS.trackingDelegate["onMovePath"](old_path, new_path);
  } catch (e) {
   err("FS.trackingDelegate['onMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message);
  }
 },
 rmdir: function(path) {
  var lookup = FS.lookupPath(path, {
   parent: true
  });
  var parent = lookup.node;
  var name = PATH.basename(path);
  var node = FS.lookupNode(parent, name);
  var errCode = FS.mayDelete(parent, name, true);
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  if (!parent.node_ops.rmdir) {
   throw new FS.ErrnoError(63);
  }
  if (FS.isMountpoint(node)) {
   throw new FS.ErrnoError(10);
  }
  try {
   if (FS.trackingDelegate["willDeletePath"]) {
    FS.trackingDelegate["willDeletePath"](path);
   }
  } catch (e) {
   err("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message);
  }
  parent.node_ops.rmdir(parent, name);
  FS.destroyNode(node);
  try {
   if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path);
  } catch (e) {
   err("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message);
  }
 },
 readdir: function(path) {
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  var node = lookup.node;
  if (!node.node_ops.readdir) {
   throw new FS.ErrnoError(54);
  }
  return node.node_ops.readdir(node);
 },
 unlink: function(path) {
  var lookup = FS.lookupPath(path, {
   parent: true
  });
  var parent = lookup.node;
  var name = PATH.basename(path);
  var node = FS.lookupNode(parent, name);
  var errCode = FS.mayDelete(parent, name, false);
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  if (!parent.node_ops.unlink) {
   throw new FS.ErrnoError(63);
  }
  if (FS.isMountpoint(node)) {
   throw new FS.ErrnoError(10);
  }
  try {
   if (FS.trackingDelegate["willDeletePath"]) {
    FS.trackingDelegate["willDeletePath"](path);
   }
  } catch (e) {
   err("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message);
  }
  parent.node_ops.unlink(parent, name);
  FS.destroyNode(node);
  try {
   if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path);
  } catch (e) {
   err("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message);
  }
 },
 readlink: function(path) {
  var lookup = FS.lookupPath(path);
  var link = lookup.node;
  if (!link) {
   throw new FS.ErrnoError(44);
  }
  if (!link.node_ops.readlink) {
   throw new FS.ErrnoError(28);
  }
  return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
 },
 stat: function(path, dontFollow) {
  var lookup = FS.lookupPath(path, {
   follow: !dontFollow
  });
  var node = lookup.node;
  if (!node) {
   throw new FS.ErrnoError(44);
  }
  if (!node.node_ops.getattr) {
   throw new FS.ErrnoError(63);
  }
  return node.node_ops.getattr(node);
 },
 lstat: function(path) {
  return FS.stat(path, true);
 },
 chmod: function(path, mode, dontFollow) {
  var node;
  if (typeof path === "string") {
   var lookup = FS.lookupPath(path, {
    follow: !dontFollow
   });
   node = lookup.node;
  } else {
   node = path;
  }
  if (!node.node_ops.setattr) {
   throw new FS.ErrnoError(63);
  }
  node.node_ops.setattr(node, {
   mode: mode & 4095 | node.mode & ~4095,
   timestamp: Date.now()
  });
 },
 lchmod: function(path, mode) {
  FS.chmod(path, mode, true);
 },
 fchmod: function(fd, mode) {
  var stream = FS.getStream(fd);
  if (!stream) {
   throw new FS.ErrnoError(8);
  }
  FS.chmod(stream.node, mode);
 },
 chown: function(path, uid, gid, dontFollow) {
  var node;
  if (typeof path === "string") {
   var lookup = FS.lookupPath(path, {
    follow: !dontFollow
   });
   node = lookup.node;
  } else {
   node = path;
  }
  if (!node.node_ops.setattr) {
   throw new FS.ErrnoError(63);
  }
  node.node_ops.setattr(node, {
   timestamp: Date.now()
  });
 },
 lchown: function(path, uid, gid) {
  FS.chown(path, uid, gid, true);
 },
 fchown: function(fd, uid, gid) {
  var stream = FS.getStream(fd);
  if (!stream) {
   throw new FS.ErrnoError(8);
  }
  FS.chown(stream.node, uid, gid);
 },
 truncate: function(path, len) {
  if (len < 0) {
   throw new FS.ErrnoError(28);
  }
  var node;
  if (typeof path === "string") {
   var lookup = FS.lookupPath(path, {
    follow: true
   });
   node = lookup.node;
  } else {
   node = path;
  }
  if (!node.node_ops.setattr) {
   throw new FS.ErrnoError(63);
  }
  if (FS.isDir(node.mode)) {
   throw new FS.ErrnoError(31);
  }
  if (!FS.isFile(node.mode)) {
   throw new FS.ErrnoError(28);
  }
  var errCode = FS.nodePermissions(node, "w");
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  node.node_ops.setattr(node, {
   size: len,
   timestamp: Date.now()
  });
 },
 ftruncate: function(fd, len) {
  var stream = FS.getStream(fd);
  if (!stream) {
   throw new FS.ErrnoError(8);
  }
  if ((stream.flags & 2097155) === 0) {
   throw new FS.ErrnoError(28);
  }
  FS.truncate(stream.node, len);
 },
 utime: function(path, atime, mtime) {
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  var node = lookup.node;
  node.node_ops.setattr(node, {
   timestamp: Math.max(atime, mtime)
  });
 },
 open: function(path, flags, mode, fd_start, fd_end) {
  if (path === "") {
   throw new FS.ErrnoError(44);
  }
  flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
  mode = typeof mode === "undefined" ? 438 : mode;
  if (flags & 64) {
   mode = mode & 4095 | 32768;
  } else {
   mode = 0;
  }
  var node;
  if (typeof path === "object") {
   node = path;
  } else {
   path = PATH.normalize(path);
   try {
    var lookup = FS.lookupPath(path, {
     follow: !(flags & 131072)
    });
    node = lookup.node;
   } catch (e) {}
  }
  var created = false;
  if (flags & 64) {
   if (node) {
    if (flags & 128) {
     throw new FS.ErrnoError(20);
    }
   } else {
    node = FS.mknod(path, mode, 0);
    created = true;
   }
  }
  if (!node) {
   throw new FS.ErrnoError(44);
  }
  if (FS.isChrdev(node.mode)) {
   flags &= ~512;
  }
  if (flags & 65536 && !FS.isDir(node.mode)) {
   throw new FS.ErrnoError(54);
  }
  if (!created) {
   var errCode = FS.mayOpen(node, flags);
   if (errCode) {
    throw new FS.ErrnoError(errCode);
   }
  }
  if (flags & 512) {
   FS.truncate(node, 0);
  }
  flags &= ~(128 | 512 | 131072);
  var stream = FS.createStream({
   node: node,
   path: FS.getPath(node),
   flags: flags,
   seekable: true,
   position: 0,
   stream_ops: node.stream_ops,
   ungotten: [],
   error: false
  }, fd_start, fd_end);
  if (stream.stream_ops.open) {
   stream.stream_ops.open(stream);
  }
  if (Module["logReadFiles"] && !(flags & 1)) {
   if (!FS.readFiles) FS.readFiles = {};
   if (!(path in FS.readFiles)) {
    FS.readFiles[path] = 1;
    err("FS.trackingDelegate error on read file: " + path);
   }
  }
  try {
   if (FS.trackingDelegate["onOpenFile"]) {
    var trackingFlags = 0;
    if ((flags & 2097155) !== 1) {
     trackingFlags |= FS.tracking.openFlags.READ;
    }
    if ((flags & 2097155) !== 0) {
     trackingFlags |= FS.tracking.openFlags.WRITE;
    }
    FS.trackingDelegate["onOpenFile"](path, trackingFlags);
   }
  } catch (e) {
   err("FS.trackingDelegate['onOpenFile']('" + path + "', flags) threw an exception: " + e.message);
  }
  return stream;
 },
 close: function(stream) {
  if (FS.isClosed(stream)) {
   throw new FS.ErrnoError(8);
  }
  if (stream.getdents) stream.getdents = null;
  try {
   if (stream.stream_ops.close) {
    stream.stream_ops.close(stream);
   }
  } catch (e) {
   throw e;
  } finally {
   FS.closeStream(stream.fd);
  }
  stream.fd = null;
 },
 isClosed: function(stream) {
  return stream.fd === null;
 },
 llseek: function(stream, offset, whence) {
  if (FS.isClosed(stream)) {
   throw new FS.ErrnoError(8);
  }
  if (!stream.seekable || !stream.stream_ops.llseek) {
   throw new FS.ErrnoError(70);
  }
  if (whence != 0 && whence != 1 && whence != 2) {
   throw new FS.ErrnoError(28);
  }
  stream.position = stream.stream_ops.llseek(stream, offset, whence);
  stream.ungotten = [];
  return stream.position;
 },
 read: function(stream, buffer, offset, length, position) {
  if (length < 0 || position < 0) {
   throw new FS.ErrnoError(28);
  }
  if (FS.isClosed(stream)) {
   throw new FS.ErrnoError(8);
  }
  if ((stream.flags & 2097155) === 1) {
   throw new FS.ErrnoError(8);
  }
  if (FS.isDir(stream.node.mode)) {
   throw new FS.ErrnoError(31);
  }
  if (!stream.stream_ops.read) {
   throw new FS.ErrnoError(28);
  }
  var seeking = typeof position !== "undefined";
  if (!seeking) {
   position = stream.position;
  } else if (!stream.seekable) {
   throw new FS.ErrnoError(70);
  }
  var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
  if (!seeking) stream.position += bytesRead;
  return bytesRead;
 },
 write: function(stream, buffer, offset, length, position, canOwn) {
  if (length < 0 || position < 0) {
   throw new FS.ErrnoError(28);
  }
  if (FS.isClosed(stream)) {
   throw new FS.ErrnoError(8);
  }
  if ((stream.flags & 2097155) === 0) {
   throw new FS.ErrnoError(8);
  }
  if (FS.isDir(stream.node.mode)) {
   throw new FS.ErrnoError(31);
  }
  if (!stream.stream_ops.write) {
   throw new FS.ErrnoError(28);
  }
  if (stream.seekable && stream.flags & 1024) {
   FS.llseek(stream, 0, 2);
  }
  var seeking = typeof position !== "undefined";
  if (!seeking) {
   position = stream.position;
  } else if (!stream.seekable) {
   throw new FS.ErrnoError(70);
  }
  var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
  if (!seeking) stream.position += bytesWritten;
  try {
   if (stream.path && FS.trackingDelegate["onWriteToFile"]) FS.trackingDelegate["onWriteToFile"](stream.path);
  } catch (e) {
   err("FS.trackingDelegate['onWriteToFile']('" + stream.path + "') threw an exception: " + e.message);
  }
  return bytesWritten;
 },
 allocate: function(stream, offset, length) {
  if (FS.isClosed(stream)) {
   throw new FS.ErrnoError(8);
  }
  if (offset < 0 || length <= 0) {
   throw new FS.ErrnoError(28);
  }
  if ((stream.flags & 2097155) === 0) {
   throw new FS.ErrnoError(8);
  }
  if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
   throw new FS.ErrnoError(43);
  }
  if (!stream.stream_ops.allocate) {
   throw new FS.ErrnoError(138);
  }
  stream.stream_ops.allocate(stream, offset, length);
 },
 mmap: function(stream, address, length, position, prot, flags) {
  if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
   throw new FS.ErrnoError(2);
  }
  if ((stream.flags & 2097155) === 1) {
   throw new FS.ErrnoError(2);
  }
  if (!stream.stream_ops.mmap) {
   throw new FS.ErrnoError(43);
  }
  return stream.stream_ops.mmap(stream, address, length, position, prot, flags);
 },
 msync: function(stream, buffer, offset, length, mmapFlags) {
  if (!stream || !stream.stream_ops.msync) {
   return 0;
  }
  return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
 },
 munmap: function(stream) {
  return 0;
 },
 ioctl: function(stream, cmd, arg) {
  if (!stream.stream_ops.ioctl) {
   throw new FS.ErrnoError(59);
  }
  return stream.stream_ops.ioctl(stream, cmd, arg);
 },
 readFile: function(path, opts) {
  opts = opts || {};
  opts.flags = opts.flags || 0;
  opts.encoding = opts.encoding || "binary";
  if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
   throw new Error('Invalid encoding type "' + opts.encoding + '"');
  }
  var ret;
  var stream = FS.open(path, opts.flags);
  var stat = FS.stat(path);
  var length = stat.size;
  var buf = new Uint8Array(length);
  FS.read(stream, buf, 0, length, 0);
  if (opts.encoding === "utf8") {
   ret = UTF8ArrayToString(buf, 0);
  } else if (opts.encoding === "binary") {
   ret = buf;
  }
  FS.close(stream);
  return ret;
 },
 writeFile: function(path, data, opts) {
  opts = opts || {};
  opts.flags = opts.flags || 577;
  var stream = FS.open(path, opts.flags, opts.mode);
  if (typeof data === "string") {
   var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
   var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
   FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
  } else if (ArrayBuffer.isView(data)) {
   FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
  } else {
   throw new Error("Unsupported data type");
  }
  FS.close(stream);
 },
 cwd: function() {
  return FS.currentPath;
 },
 chdir: function(path) {
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  if (lookup.node === null) {
   throw new FS.ErrnoError(44);
  }
  if (!FS.isDir(lookup.node.mode)) {
   throw new FS.ErrnoError(54);
  }
  var errCode = FS.nodePermissions(lookup.node, "x");
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  FS.currentPath = lookup.path;
 },
 createDefaultDirectories: function() {
  FS.mkdir("/tmp");
  FS.mkdir("/home");
  FS.mkdir("/home/web_user");
 },
 createDefaultDevices: function() {
  FS.mkdir("/dev");
  FS.registerDevice(FS.makedev(1, 3), {
   read: function() {
    return 0;
   },
   write: function(stream, buffer, offset, length, pos) {
    return length;
   }
  });
  FS.mkdev("/dev/null", FS.makedev(1, 3));
  TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
  TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
  FS.mkdev("/dev/tty", FS.makedev(5, 0));
  FS.mkdev("/dev/tty1", FS.makedev(6, 0));
  var random_device = getRandomDevice();
  FS.createDevice("/dev", "random", random_device);
  FS.createDevice("/dev", "urandom", random_device);
  FS.mkdir("/dev/shm");
  FS.mkdir("/dev/shm/tmp");
 },
 createSpecialDirectories: function() {
  FS.mkdir("/proc");
  FS.mkdir("/proc/self");
  FS.mkdir("/proc/self/fd");
  FS.mount({
   mount: function() {
    var node = FS.createNode("/proc/self", "fd", 16384 | 511, 73);
    node.node_ops = {
     lookup: function(parent, name) {
      var fd = +name;
      var stream = FS.getStream(fd);
      if (!stream) throw new FS.ErrnoError(8);
      var ret = {
       parent: null,
       mount: {
        mountpoint: "fake"
       },
       node_ops: {
        readlink: function() {
         return stream.path;
        }
       }
      };
      ret.parent = ret;
      return ret;
     }
    };
    return node;
   }
  }, {}, "/proc/self/fd");
 },
 createStandardStreams: function() {
  if (Module["stdin"]) {
   FS.createDevice("/dev", "stdin", Module["stdin"]);
  } else {
   FS.symlink("/dev/tty", "/dev/stdin");
  }
  if (Module["stdout"]) {
   FS.createDevice("/dev", "stdout", null, Module["stdout"]);
  } else {
   FS.symlink("/dev/tty", "/dev/stdout");
  }
  if (Module["stderr"]) {
   FS.createDevice("/dev", "stderr", null, Module["stderr"]);
  } else {
   FS.symlink("/dev/tty1", "/dev/stderr");
  }
  var stdin = FS.open("/dev/stdin", 0);
  var stdout = FS.open("/dev/stdout", 1);
  var stderr = FS.open("/dev/stderr", 1);
  assert(stdin.fd === 0, "invalid handle for stdin (" + stdin.fd + ")");
  assert(stdout.fd === 1, "invalid handle for stdout (" + stdout.fd + ")");
  assert(stderr.fd === 2, "invalid handle for stderr (" + stderr.fd + ")");
 },
 ensureErrnoError: function() {
  if (FS.ErrnoError) return;
  FS.ErrnoError = function ErrnoError(errno, node) {
   this.node = node;
   this.setErrno = function(errno) {
    this.errno = errno;
    for (var key in ERRNO_CODES) {
     if (ERRNO_CODES[key] === errno) {
      this.code = key;
      break;
     }
    }
   };
   this.setErrno(errno);
   this.message = ERRNO_MESSAGES[errno];
   if (this.stack) {
    Object.defineProperty(this, "stack", {
     value: new Error().stack,
     writable: true
    });
    this.stack = demangleAll(this.stack);
   }
  };
  FS.ErrnoError.prototype = new Error();
  FS.ErrnoError.prototype.constructor = FS.ErrnoError;
  [ 44 ].forEach(function(code) {
   FS.genericErrors[code] = new FS.ErrnoError(code);
   FS.genericErrors[code].stack = "<generic error, no stack>";
  });
 },
 staticInit: function() {
  FS.ensureErrnoError();
  FS.nameTable = new Array(4096);
  FS.mount(MEMFS, {}, "/");
  FS.createDefaultDirectories();
  FS.createDefaultDevices();
  FS.createSpecialDirectories();
  FS.filesystems = {
   "MEMFS": MEMFS
  };
 },
 init: function(input, output, error) {
  assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
  FS.init.initialized = true;
  FS.ensureErrnoError();
  Module["stdin"] = input || Module["stdin"];
  Module["stdout"] = output || Module["stdout"];
  Module["stderr"] = error || Module["stderr"];
  FS.createStandardStreams();
 },
 quit: function() {
  FS.init.initialized = false;
  var fflush = Module["_fflush"];
  if (fflush) fflush(0);
  for (var i = 0; i < FS.streams.length; i++) {
   var stream = FS.streams[i];
   if (!stream) {
    continue;
   }
   FS.close(stream);
  }
 },
 getMode: function(canRead, canWrite) {
  var mode = 0;
  if (canRead) mode |= 292 | 73;
  if (canWrite) mode |= 146;
  return mode;
 },
 findObject: function(path, dontResolveLastLink) {
  var ret = FS.analyzePath(path, dontResolveLastLink);
  if (ret.exists) {
   return ret.object;
  } else {
   return null;
  }
 },
 analyzePath: function(path, dontResolveLastLink) {
  try {
   var lookup = FS.lookupPath(path, {
    follow: !dontResolveLastLink
   });
   path = lookup.path;
  } catch (e) {}
  var ret = {
   isRoot: false,
   exists: false,
   error: 0,
   name: null,
   path: null,
   object: null,
   parentExists: false,
   parentPath: null,
   parentObject: null
  };
  try {
   var lookup = FS.lookupPath(path, {
    parent: true
   });
   ret.parentExists = true;
   ret.parentPath = lookup.path;
   ret.parentObject = lookup.node;
   ret.name = PATH.basename(path);
   lookup = FS.lookupPath(path, {
    follow: !dontResolveLastLink
   });
   ret.exists = true;
   ret.path = lookup.path;
   ret.object = lookup.node;
   ret.name = lookup.node.name;
   ret.isRoot = lookup.path === "/";
  } catch (e) {
   ret.error = e.errno;
  }
  return ret;
 },
 createPath: function(parent, path, canRead, canWrite) {
  parent = typeof parent === "string" ? parent : FS.getPath(parent);
  var parts = path.split("/").reverse();
  while (parts.length) {
   var part = parts.pop();
   if (!part) continue;
   var current = PATH.join2(parent, part);
   try {
    FS.mkdir(current);
   } catch (e) {}
   parent = current;
  }
  return current;
 },
 createFile: function(parent, name, properties, canRead, canWrite) {
  var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
  var mode = FS.getMode(canRead, canWrite);
  return FS.create(path, mode);
 },
 createDataFile: function(parent, name, data, canRead, canWrite, canOwn) {
  var path = name ? PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name) : parent;
  var mode = FS.getMode(canRead, canWrite);
  var node = FS.create(path, mode);
  if (data) {
   if (typeof data === "string") {
    var arr = new Array(data.length);
    for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
    data = arr;
   }
   FS.chmod(node, mode | 146);
   var stream = FS.open(node, 577);
   FS.write(stream, data, 0, data.length, 0, canOwn);
   FS.close(stream);
   FS.chmod(node, mode);
  }
  return node;
 },
 createDevice: function(parent, name, input, output) {
  var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
  var mode = FS.getMode(!!input, !!output);
  if (!FS.createDevice.major) FS.createDevice.major = 64;
  var dev = FS.makedev(FS.createDevice.major++, 0);
  FS.registerDevice(dev, {
   open: function(stream) {
    stream.seekable = false;
   },
   close: function(stream) {
    if (output && output.buffer && output.buffer.length) {
     output(10);
    }
   },
   read: function(stream, buffer, offset, length, pos) {
    var bytesRead = 0;
    for (var i = 0; i < length; i++) {
     var result;
     try {
      result = input();
     } catch (e) {
      throw new FS.ErrnoError(29);
     }
     if (result === undefined && bytesRead === 0) {
      throw new FS.ErrnoError(6);
     }
     if (result === null || result === undefined) break;
     bytesRead++;
     buffer[offset + i] = result;
    }
    if (bytesRead) {
     stream.node.timestamp = Date.now();
    }
    return bytesRead;
   },
   write: function(stream, buffer, offset, length, pos) {
    for (var i = 0; i < length; i++) {
     try {
      output(buffer[offset + i]);
     } catch (e) {
      throw new FS.ErrnoError(29);
     }
    }
    if (length) {
     stream.node.timestamp = Date.now();
    }
    return i;
   }
  });
  return FS.mkdev(path, mode, dev);
 },
 forceLoadFile: function(obj) {
  if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
  if (typeof XMLHttpRequest !== "undefined") {
   throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
  } else if (read_) {
   try {
    obj.contents = intArrayFromString(read_(obj.url), true);
    obj.usedBytes = obj.contents.length;
   } catch (e) {
    throw new FS.ErrnoError(29);
   }
  } else {
   throw new Error("Cannot load without read() or XMLHttpRequest.");
  }
 },
 createLazyFile: function(parent, name, url, canRead, canWrite) {
  function LazyUint8Array() {
   this.lengthKnown = false;
   this.chunks = [];
  }
  LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
   if (idx > this.length - 1 || idx < 0) {
    return undefined;
   }
   var chunkOffset = idx % this.chunkSize;
   var chunkNum = idx / this.chunkSize | 0;
   return this.getter(chunkNum)[chunkOffset];
  };
  LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
   this.getter = getter;
  };
  LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
   var xhr = new XMLHttpRequest();
   xhr.open("HEAD", url, false);
   xhr.send(null);
   if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
   var datalength = Number(xhr.getResponseHeader("Content-length"));
   var header;
   var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
   var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
   var chunkSize = 1024 * 1024;
   if (!hasByteServing) chunkSize = datalength;
   var doXHR = function(from, to) {
    if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
    if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
    if (typeof Uint8Array != "undefined") xhr.responseType = "arraybuffer";
    if (xhr.overrideMimeType) {
     xhr.overrideMimeType("text/plain; charset=x-user-defined");
    }
    xhr.send(null);
    if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
    if (xhr.response !== undefined) {
     return new Uint8Array(xhr.response || []);
    } else {
     return intArrayFromString(xhr.responseText || "", true);
    }
   };
   var lazyArray = this;
   lazyArray.setDataGetter(function(chunkNum) {
    var start = chunkNum * chunkSize;
    var end = (chunkNum + 1) * chunkSize - 1;
    end = Math.min(end, datalength - 1);
    if (typeof lazyArray.chunks[chunkNum] === "undefined") {
     lazyArray.chunks[chunkNum] = doXHR(start, end);
    }
    if (typeof lazyArray.chunks[chunkNum] === "undefined") throw new Error("doXHR failed!");
    return lazyArray.chunks[chunkNum];
   });
   if (usesGzip || !datalength) {
    chunkSize = datalength = 1;
    datalength = this.getter(0).length;
    chunkSize = datalength;
    out("LazyFiles on gzip forces download of the whole file when length is accessed");
   }
   this._length = datalength;
   this._chunkSize = chunkSize;
   this.lengthKnown = true;
  };
  if (typeof XMLHttpRequest !== "undefined") {
   if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
   var lazyArray = new LazyUint8Array();
   Object.defineProperties(lazyArray, {
    length: {
     get: function() {
      if (!this.lengthKnown) {
       this.cacheLength();
      }
      return this._length;
     }
    },
    chunkSize: {
     get: function() {
      if (!this.lengthKnown) {
       this.cacheLength();
      }
      return this._chunkSize;
     }
    }
   });
   var properties = {
    isDevice: false,
    contents: lazyArray
   };
  } else {
   var properties = {
    isDevice: false,
    url: url
   };
  }
  var node = FS.createFile(parent, name, properties, canRead, canWrite);
  if (properties.contents) {
   node.contents = properties.contents;
  } else if (properties.url) {
   node.contents = null;
   node.url = properties.url;
  }
  Object.defineProperties(node, {
   usedBytes: {
    get: function() {
     return this.contents.length;
    }
   }
  });
  var stream_ops = {};
  var keys = Object.keys(node.stream_ops);
  keys.forEach(function(key) {
   var fn = node.stream_ops[key];
   stream_ops[key] = function forceLoadLazyFile() {
    FS.forceLoadFile(node);
    return fn.apply(null, arguments);
   };
  });
  stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
   FS.forceLoadFile(node);
   var contents = stream.node.contents;
   if (position >= contents.length) return 0;
   var size = Math.min(contents.length - position, length);
   assert(size >= 0);
   if (contents.slice) {
    for (var i = 0; i < size; i++) {
     buffer[offset + i] = contents[position + i];
    }
   } else {
    for (var i = 0; i < size; i++) {
     buffer[offset + i] = contents.get(position + i);
    }
   }
   return size;
  };
  node.stream_ops = stream_ops;
  return node;
 },
 createPreloadedFile: function(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
  Browser.init();
  var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
  var dep = getUniqueRunDependency("cp " + fullname);
  function processData(byteArray) {
   function finish(byteArray) {
    if (preFinish) preFinish();
    if (!dontCreateFile) {
     FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
    }
    if (onload) onload();
    removeRunDependency(dep);
   }
   var handled = false;
   Module["preloadPlugins"].forEach(function(plugin) {
    if (handled) return;
    if (plugin["canHandle"](fullname)) {
     plugin["handle"](byteArray, fullname, finish, function() {
      if (onerror) onerror();
      removeRunDependency(dep);
     });
     handled = true;
    }
   });
   if (!handled) finish(byteArray);
  }
  addRunDependency(dep);
  if (typeof url == "string") {
   Browser.asyncLoad(url, function(byteArray) {
    processData(byteArray);
   }, onerror);
  } else {
   processData(url);
  }
 },
 indexedDB: function() {
  return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
 },
 DB_NAME: function() {
  return "EM_FS_" + window.location.pathname;
 },
 DB_VERSION: 20,
 DB_STORE_NAME: "FILE_DATA",
 saveFilesToDB: function(paths, onload, onerror) {
  onload = onload || function() {};
  onerror = onerror || function() {};
  var indexedDB = FS.indexedDB();
  try {
   var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
  } catch (e) {
   return onerror(e);
  }
  openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
   out("creating db");
   var db = openRequest.result;
   db.createObjectStore(FS.DB_STORE_NAME);
  };
  openRequest.onsuccess = function openRequest_onsuccess() {
   var db = openRequest.result;
   var transaction = db.transaction([ FS.DB_STORE_NAME ], "readwrite");
   var files = transaction.objectStore(FS.DB_STORE_NAME);
   var ok = 0, fail = 0, total = paths.length;
   function finish() {
    if (fail == 0) onload(); else onerror();
   }
   paths.forEach(function(path) {
    var putRequest = files.put(FS.analyzePath(path).object.contents, path);
    putRequest.onsuccess = function putRequest_onsuccess() {
     ok++;
     if (ok + fail == total) finish();
    };
    putRequest.onerror = function putRequest_onerror() {
     fail++;
     if (ok + fail == total) finish();
    };
   });
   transaction.onerror = onerror;
  };
  openRequest.onerror = onerror;
 },
 loadFilesFromDB: function(paths, onload, onerror) {
  onload = onload || function() {};
  onerror = onerror || function() {};
  var indexedDB = FS.indexedDB();
  try {
   var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
  } catch (e) {
   return onerror(e);
  }
  openRequest.onupgradeneeded = onerror;
  openRequest.onsuccess = function openRequest_onsuccess() {
   var db = openRequest.result;
   try {
    var transaction = db.transaction([ FS.DB_STORE_NAME ], "readonly");
   } catch (e) {
    onerror(e);
    return;
   }
   var files = transaction.objectStore(FS.DB_STORE_NAME);
   var ok = 0, fail = 0, total = paths.length;
   function finish() {
    if (fail == 0) onload(); else onerror();
   }
   paths.forEach(function(path) {
    var getRequest = files.get(path);
    getRequest.onsuccess = function getRequest_onsuccess() {
     if (FS.analyzePath(path).exists) {
      FS.unlink(path);
     }
     FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
     ok++;
     if (ok + fail == total) finish();
    };
    getRequest.onerror = function getRequest_onerror() {
     fail++;
     if (ok + fail == total) finish();
    };
   });
   transaction.onerror = onerror;
  };
  openRequest.onerror = onerror;
 },
 absolutePath: function() {
  abort("FS.absolutePath has been removed; use PATH_FS.resolve instead");
 },
 createFolder: function() {
  abort("FS.createFolder has been removed; use FS.mkdir instead");
 },
 createLink: function() {
  abort("FS.createLink has been removed; use FS.symlink instead");
 },
 joinPath: function() {
  abort("FS.joinPath has been removed; use PATH.join instead");
 },
 mmapAlloc: function() {
  abort("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
 },
 standardizePath: function() {
  abort("FS.standardizePath has been removed; use PATH.normalize instead");
 }
};

var SYSCALLS = {
 mappings: {},
 DEFAULT_POLLMASK: 5,
 umask: 511,
 calculateAt: function(dirfd, path) {
  if (path[0] !== "/") {
   var dir;
   if (dirfd === -100) {
    dir = FS.cwd();
   } else {
    var dirstream = FS.getStream(dirfd);
    if (!dirstream) throw new FS.ErrnoError(8);
    dir = dirstream.path;
   }
   path = PATH.join2(dir, path);
  }
  return path;
 },
 doStat: function(func, path, buf) {
  try {
   var stat = func(path);
  } catch (e) {
   if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
    return -54;
   }
   throw e;
  }
  SAFE_HEAP_STORE(buf | 0, stat.dev | 0, 4);
  SAFE_HEAP_STORE(buf + 4 | 0, 0 | 0, 4);
  SAFE_HEAP_STORE(buf + 8 | 0, stat.ino | 0, 4);
  SAFE_HEAP_STORE(buf + 12 | 0, stat.mode | 0, 4);
  SAFE_HEAP_STORE(buf + 16 | 0, stat.nlink | 0, 4);
  SAFE_HEAP_STORE(buf + 20 | 0, stat.uid | 0, 4);
  SAFE_HEAP_STORE(buf + 24 | 0, stat.gid | 0, 4);
  SAFE_HEAP_STORE(buf + 28 | 0, stat.rdev | 0, 4);
  SAFE_HEAP_STORE(buf + 32 | 0, 0 | 0, 4);
  tempI64 = [ stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
  SAFE_HEAP_STORE(buf + 40 | 0, tempI64[0] | 0, 4), SAFE_HEAP_STORE(buf + 44 | 0, tempI64[1] | 0, 4);
  SAFE_HEAP_STORE(buf + 48 | 0, 4096 | 0, 4);
  SAFE_HEAP_STORE(buf + 52 | 0, stat.blocks | 0, 4);
  SAFE_HEAP_STORE(buf + 56 | 0, stat.atime.getTime() / 1e3 | 0 | 0, 4);
  SAFE_HEAP_STORE(buf + 60 | 0, 0 | 0, 4);
  SAFE_HEAP_STORE(buf + 64 | 0, stat.mtime.getTime() / 1e3 | 0 | 0, 4);
  SAFE_HEAP_STORE(buf + 68 | 0, 0 | 0, 4);
  SAFE_HEAP_STORE(buf + 72 | 0, stat.ctime.getTime() / 1e3 | 0 | 0, 4);
  SAFE_HEAP_STORE(buf + 76 | 0, 0 | 0, 4);
  tempI64 = [ stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
  SAFE_HEAP_STORE(buf + 80 | 0, tempI64[0] | 0, 4), SAFE_HEAP_STORE(buf + 84 | 0, tempI64[1] | 0, 4);
  return 0;
 },
 doMsync: function(addr, stream, len, flags, offset) {
  var buffer = HEAPU8.slice(addr, addr + len);
  FS.msync(stream, buffer, offset, len, flags);
 },
 doMkdir: function(path, mode) {
  path = PATH.normalize(path);
  if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
  FS.mkdir(path, mode, 0);
  return 0;
 },
 doMknod: function(path, mode, dev) {
  switch (mode & 61440) {
  case 32768:
  case 8192:
  case 24576:
  case 4096:
  case 49152:
   break;

  default:
   return -28;
  }
  FS.mknod(path, mode, dev);
  return 0;
 },
 doReadlink: function(path, buf, bufsize) {
  if (bufsize <= 0) return -28;
  var ret = FS.readlink(path);
  var len = Math.min(bufsize, lengthBytesUTF8(ret));
  var endChar = SAFE_HEAP_LOAD(buf + len, 1, 0);
  stringToUTF8(ret, buf, bufsize + 1);
  SAFE_HEAP_STORE(buf + len, endChar, 1);
  return len;
 },
 doAccess: function(path, amode) {
  if (amode & ~7) {
   return -28;
  }
  var node;
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  node = lookup.node;
  if (!node) {
   return -44;
  }
  var perms = "";
  if (amode & 4) perms += "r";
  if (amode & 2) perms += "w";
  if (amode & 1) perms += "x";
  if (perms && FS.nodePermissions(node, perms)) {
   return -2;
  }
  return 0;
 },
 doDup: function(path, flags, suggestFD) {
  var suggest = FS.getStream(suggestFD);
  if (suggest) FS.close(suggest);
  return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
 },
 doReadv: function(stream, iov, iovcnt, offset) {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
   var ptr = SAFE_HEAP_LOAD(iov + i * 8 | 0, 4, 0) | 0;
   var len = SAFE_HEAP_LOAD(iov + (i * 8 + 4) | 0, 4, 0) | 0;
   var curr = FS.read(stream, HEAP8, ptr, len, offset);
   if (curr < 0) return -1;
   ret += curr;
   if (curr < len) break;
  }
  return ret;
 },
 doWritev: function(stream, iov, iovcnt, offset) {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
   var ptr = SAFE_HEAP_LOAD(iov + i * 8 | 0, 4, 0) | 0;
   var len = SAFE_HEAP_LOAD(iov + (i * 8 + 4) | 0, 4, 0) | 0;
   var curr = FS.write(stream, HEAP8, ptr, len, offset);
   if (curr < 0) return -1;
   ret += curr;
  }
  return ret;
 },
 varargs: undefined,
 get: function() {
  assert(SYSCALLS.varargs != undefined);
  SYSCALLS.varargs += 4;
  var ret = SAFE_HEAP_LOAD(SYSCALLS.varargs - 4 | 0, 4, 0) | 0;
  return ret;
 },
 getStr: function(ptr) {
  var ret = UTF8ToString(ptr);
  return ret;
 },
 getStreamFromFD: function(fd) {
  var stream = FS.getStream(fd);
  if (!stream) throw new FS.ErrnoError(8);
  return stream;
 },
 get64: function(low, high) {
  if (low >= 0) assert(high === 0); else assert(high === -1);
  return low;
 }
};

function _environ_get(__environ, environ_buf) {
 try {
  var bufSize = 0;
  getEnvStrings().forEach(function(string, i) {
   var ptr = environ_buf + bufSize;
   SAFE_HEAP_STORE(__environ + i * 4 | 0, ptr | 0, 4);
   writeAsciiToMemory(string, ptr);
   bufSize += string.length + 1;
  });
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return e.errno;
 }
}

function _environ_sizes_get(penviron_count, penviron_buf_size) {
 try {
  var strings = getEnvStrings();
  SAFE_HEAP_STORE(penviron_count | 0, strings.length | 0, 4);
  var bufSize = 0;
  strings.forEach(function(string) {
   bufSize += string.length + 1;
  });
  SAFE_HEAP_STORE(penviron_buf_size | 0, bufSize | 0, 4);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return e.errno;
 }
}

function _fd_close(fd) {
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  FS.close(stream);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return e.errno;
 }
}

function _fd_read(fd, iov, iovcnt, pnum) {
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  var num = SYSCALLS.doReadv(stream, iov, iovcnt);
  SAFE_HEAP_STORE(pnum | 0, num | 0, 4);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return e.errno;
 }
}

function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  var HIGH_OFFSET = 4294967296;
  var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
  var DOUBLE_LIMIT = 9007199254740992;
  if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
   return -61;
  }
  FS.llseek(stream, offset, whence);
  tempI64 = [ stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
  SAFE_HEAP_STORE(newOffset | 0, tempI64[0] | 0, 4), SAFE_HEAP_STORE(newOffset + 4 | 0, tempI64[1] | 0, 4);
  if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return e.errno;
 }
}

function _fd_write(fd, iov, iovcnt, pnum) {
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  var num = SYSCALLS.doWritev(stream, iov, iovcnt);
  SAFE_HEAP_STORE(pnum | 0, num | 0, 4);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return e.errno;
 }
}

function _setTempRet0($i) {
 setTempRet0($i | 0);
}

function __isLeapYear(year) {
 return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function __arraySum(array, index) {
 var sum = 0;
 for (var i = 0; i <= index; sum += array[i++]) {}
 return sum;
}

var __MONTH_DAYS_LEAP = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

var __MONTH_DAYS_REGULAR = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

function __addDays(date, days) {
 var newDate = new Date(date.getTime());
 while (days > 0) {
  var leap = __isLeapYear(newDate.getFullYear());
  var currentMonth = newDate.getMonth();
  var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
  if (days > daysInCurrentMonth - newDate.getDate()) {
   days -= daysInCurrentMonth - newDate.getDate() + 1;
   newDate.setDate(1);
   if (currentMonth < 11) {
    newDate.setMonth(currentMonth + 1);
   } else {
    newDate.setMonth(0);
    newDate.setFullYear(newDate.getFullYear() + 1);
   }
  } else {
   newDate.setDate(newDate.getDate() + days);
   return newDate;
  }
 }
 return newDate;
}

function _strftime(s, maxsize, format, tm) {
 var tm_zone = SAFE_HEAP_LOAD(tm + 40 | 0, 4, 0) | 0;
 var date = {
  tm_sec: SAFE_HEAP_LOAD(tm | 0, 4, 0) | 0,
  tm_min: SAFE_HEAP_LOAD(tm + 4 | 0, 4, 0) | 0,
  tm_hour: SAFE_HEAP_LOAD(tm + 8 | 0, 4, 0) | 0,
  tm_mday: SAFE_HEAP_LOAD(tm + 12 | 0, 4, 0) | 0,
  tm_mon: SAFE_HEAP_LOAD(tm + 16 | 0, 4, 0) | 0,
  tm_year: SAFE_HEAP_LOAD(tm + 20 | 0, 4, 0) | 0,
  tm_wday: SAFE_HEAP_LOAD(tm + 24 | 0, 4, 0) | 0,
  tm_yday: SAFE_HEAP_LOAD(tm + 28 | 0, 4, 0) | 0,
  tm_isdst: SAFE_HEAP_LOAD(tm + 32 | 0, 4, 0) | 0,
  tm_gmtoff: SAFE_HEAP_LOAD(tm + 36 | 0, 4, 0) | 0,
  tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
 };
 var pattern = UTF8ToString(format);
 var EXPANSION_RULES_1 = {
  "%c": "%a %b %d %H:%M:%S %Y",
  "%D": "%m/%d/%y",
  "%F": "%Y-%m-%d",
  "%h": "%b",
  "%r": "%I:%M:%S %p",
  "%R": "%H:%M",
  "%T": "%H:%M:%S",
  "%x": "%m/%d/%y",
  "%X": "%H:%M:%S",
  "%Ec": "%c",
  "%EC": "%C",
  "%Ex": "%m/%d/%y",
  "%EX": "%H:%M:%S",
  "%Ey": "%y",
  "%EY": "%Y",
  "%Od": "%d",
  "%Oe": "%e",
  "%OH": "%H",
  "%OI": "%I",
  "%Om": "%m",
  "%OM": "%M",
  "%OS": "%S",
  "%Ou": "%u",
  "%OU": "%U",
  "%OV": "%V",
  "%Ow": "%w",
  "%OW": "%W",
  "%Oy": "%y"
 };
 for (var rule in EXPANSION_RULES_1) {
  pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
 }
 var WEEKDAYS = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
 var MONTHS = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
 function leadingSomething(value, digits, character) {
  var str = typeof value === "number" ? value.toString() : value || "";
  while (str.length < digits) {
   str = character[0] + str;
  }
  return str;
 }
 function leadingNulls(value, digits) {
  return leadingSomething(value, digits, "0");
 }
 function compareByDay(date1, date2) {
  function sgn(value) {
   return value < 0 ? -1 : value > 0 ? 1 : 0;
  }
  var compare;
  if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
   if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
    compare = sgn(date1.getDate() - date2.getDate());
   }
  }
  return compare;
 }
 function getFirstWeekStartDate(janFourth) {
  switch (janFourth.getDay()) {
  case 0:
   return new Date(janFourth.getFullYear() - 1, 11, 29);

  case 1:
   return janFourth;

  case 2:
   return new Date(janFourth.getFullYear(), 0, 3);

  case 3:
   return new Date(janFourth.getFullYear(), 0, 2);

  case 4:
   return new Date(janFourth.getFullYear(), 0, 1);

  case 5:
   return new Date(janFourth.getFullYear() - 1, 11, 31);

  case 6:
   return new Date(janFourth.getFullYear() - 1, 11, 30);
  }
 }
 function getWeekBasedYear(date) {
  var thisDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
  var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
  var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
  var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
  var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
  if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
   if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
    return thisDate.getFullYear() + 1;
   } else {
    return thisDate.getFullYear();
   }
  } else {
   return thisDate.getFullYear() - 1;
  }
 }
 var EXPANSION_RULES_2 = {
  "%a": function(date) {
   return WEEKDAYS[date.tm_wday].substring(0, 3);
  },
  "%A": function(date) {
   return WEEKDAYS[date.tm_wday];
  },
  "%b": function(date) {
   return MONTHS[date.tm_mon].substring(0, 3);
  },
  "%B": function(date) {
   return MONTHS[date.tm_mon];
  },
  "%C": function(date) {
   var year = date.tm_year + 1900;
   return leadingNulls(year / 100 | 0, 2);
  },
  "%d": function(date) {
   return leadingNulls(date.tm_mday, 2);
  },
  "%e": function(date) {
   return leadingSomething(date.tm_mday, 2, " ");
  },
  "%g": function(date) {
   return getWeekBasedYear(date).toString().substring(2);
  },
  "%G": function(date) {
   return getWeekBasedYear(date);
  },
  "%H": function(date) {
   return leadingNulls(date.tm_hour, 2);
  },
  "%I": function(date) {
   var twelveHour = date.tm_hour;
   if (twelveHour == 0) twelveHour = 12; else if (twelveHour > 12) twelveHour -= 12;
   return leadingNulls(twelveHour, 2);
  },
  "%j": function(date) {
   return leadingNulls(date.tm_mday + __arraySum(__isLeapYear(date.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon - 1), 3);
  },
  "%m": function(date) {
   return leadingNulls(date.tm_mon + 1, 2);
  },
  "%M": function(date) {
   return leadingNulls(date.tm_min, 2);
  },
  "%n": function() {
   return "\n";
  },
  "%p": function(date) {
   if (date.tm_hour >= 0 && date.tm_hour < 12) {
    return "AM";
   } else {
    return "PM";
   }
  },
  "%S": function(date) {
   return leadingNulls(date.tm_sec, 2);
  },
  "%t": function() {
   return "\t";
  },
  "%u": function(date) {
   return date.tm_wday || 7;
  },
  "%U": function(date) {
   var janFirst = new Date(date.tm_year + 1900, 0, 1);
   var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7 - janFirst.getDay());
   var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
   if (compareByDay(firstSunday, endDate) < 0) {
    var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
    var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
    var days = firstSundayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
    return leadingNulls(Math.ceil(days / 7), 2);
   }
   return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00";
  },
  "%V": function(date) {
   var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4);
   var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4);
   var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
   var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
   var endDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
   if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
    return "53";
   }
   if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
    return "01";
   }
   var daysDifference;
   if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
    daysDifference = date.tm_yday + 32 - firstWeekStartThisYear.getDate();
   } else {
    daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate();
   }
   return leadingNulls(Math.ceil(daysDifference / 7), 2);
  },
  "%w": function(date) {
   return date.tm_wday;
  },
  "%W": function(date) {
   var janFirst = new Date(date.tm_year, 0, 1);
   var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1);
   var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
   if (compareByDay(firstMonday, endDate) < 0) {
    var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
    var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
    var days = firstMondayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
    return leadingNulls(Math.ceil(days / 7), 2);
   }
   return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00";
  },
  "%y": function(date) {
   return (date.tm_year + 1900).toString().substring(2);
  },
  "%Y": function(date) {
   return date.tm_year + 1900;
  },
  "%z": function(date) {
   var off = date.tm_gmtoff;
   var ahead = off >= 0;
   off = Math.abs(off) / 60;
   off = off / 60 * 100 + off % 60;
   return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
  },
  "%Z": function(date) {
   return date.tm_zone;
  },
  "%%": function() {
   return "%";
  }
 };
 for (var rule in EXPANSION_RULES_2) {
  if (pattern.indexOf(rule) >= 0) {
   pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
  }
 }
 var bytes = intArrayFromString(pattern, false);
 if (bytes.length > maxsize) {
  return 0;
 }
 writeArrayToMemory(bytes, s);
 return bytes.length - 1;
}

function _strftime_l(s, maxsize, format, tm) {
 return _strftime(s, maxsize, format, tm);
}

var FSNode = function(parent, name, mode, rdev) {
 if (!parent) {
  parent = this;
 }
 this.parent = parent;
 this.mount = parent.mount;
 this.mounted = null;
 this.id = FS.nextInode++;
 this.name = name;
 this.mode = mode;
 this.node_ops = {};
 this.stream_ops = {};
 this.rdev = rdev;
};

var readMode = 292 | 73;

var writeMode = 146;

Object.defineProperties(FSNode.prototype, {
 read: {
  get: function() {
   return (this.mode & readMode) === readMode;
  },
  set: function(val) {
   val ? this.mode |= readMode : this.mode &= ~readMode;
  }
 },
 write: {
  get: function() {
   return (this.mode & writeMode) === writeMode;
  },
  set: function(val) {
   val ? this.mode |= writeMode : this.mode &= ~writeMode;
  }
 },
 isFolder: {
  get: function() {
   return FS.isDir(this.mode);
  }
 },
 isDevice: {
  get: function() {
   return FS.isChrdev(this.mode);
  }
 }
});

FS.FSNode = FSNode;

FS.staticInit();

var ASSERTIONS = true;

function intArrayFromString(stringy, dontAddNull, length) {
 var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
 var u8array = new Array(len);
 var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
 if (dontAddNull) u8array.length = numBytesWritten;
 return u8array;
}

function intArrayToString(array) {
 var ret = [];
 for (var i = 0; i < array.length; i++) {
  var chr = array[i];
  if (chr > 255) {
   if (ASSERTIONS) {
    assert(false, "Character code " + chr + " (" + String.fromCharCode(chr) + ")  at offset " + i + " not in 0x00-0xFF.");
   }
   chr &= 255;
  }
  ret.push(String.fromCharCode(chr));
 }
 return ret.join("");
}

__ATINIT__.push({
 func: function() {
  ___wasm_call_ctors();
 }
});

var asmLibraryArg = {
 "__assert_fail": ___assert_fail,
 "__cxa_allocate_exception": ___cxa_allocate_exception,
 "__cxa_atexit": ___cxa_atexit,
 "__cxa_throw": ___cxa_throw,
 "abort": _abort,
 "alignfault": alignfault,
 "emscripten_memcpy_big": _emscripten_memcpy_big,
 "emscripten_resize_heap": _emscripten_resize_heap,
 "environ_get": _environ_get,
 "environ_sizes_get": _environ_sizes_get,
 "fd_close": _fd_close,
 "fd_read": _fd_read,
 "fd_seek": _fd_seek,
 "fd_write": _fd_write,
 "segfault": segfault,
 "setTempRet0": _setTempRet0,
 "strftime_l": _strftime_l
};

var asm = createWasm();

var ___wasm_call_ctors = Module["___wasm_call_ctors"] = createExportWrapper("__wasm_call_ctors");

var _TickGame = Module["_TickGame"] = createExportWrapper("TickGame");

var _IsObjectAlive = Module["_IsObjectAlive"] = createExportWrapper("IsObjectAlive");

var _GetObjectSerialized = Module["_GetObjectSerialized"] = createExportWrapper("GetObjectSerialized");

var _GetObjectX = Module["_GetObjectX"] = createExportWrapper("GetObjectX");

var _GetObjectY = Module["_GetObjectY"] = createExportWrapper("GetObjectY");

var _HandleReplicate = Module["_HandleReplicate"] = createExportWrapper("HandleReplicate");

var _HandleLocalInput = Module["_HandleLocalInput"] = createExportWrapper("HandleLocalInput");

var ___errno_location = Module["___errno_location"] = createExportWrapper("__errno_location");

var _fflush = Module["_fflush"] = createExportWrapper("fflush");

var stackSave = Module["stackSave"] = createExportWrapper("stackSave");

var stackRestore = Module["stackRestore"] = createExportWrapper("stackRestore");

var stackAlloc = Module["stackAlloc"] = createExportWrapper("stackAlloc");

var _emscripten_stack_init = Module["_emscripten_stack_init"] = function() {
 return (_emscripten_stack_init = Module["_emscripten_stack_init"] = Module["asm"]["emscripten_stack_init"]).apply(null, arguments);
};

var _emscripten_stack_get_free = Module["_emscripten_stack_get_free"] = function() {
 return (_emscripten_stack_get_free = Module["_emscripten_stack_get_free"] = Module["asm"]["emscripten_stack_get_free"]).apply(null, arguments);
};

var _emscripten_stack_get_base = Module["_emscripten_stack_get_base"] = function() {
 return (_emscripten_stack_get_base = Module["_emscripten_stack_get_base"] = Module["asm"]["emscripten_stack_get_base"]).apply(null, arguments);
};

var _emscripten_stack_get_end = Module["_emscripten_stack_get_end"] = function() {
 return (_emscripten_stack_get_end = Module["_emscripten_stack_get_end"] = Module["asm"]["emscripten_stack_get_end"]).apply(null, arguments);
};

var _setThrew = Module["_setThrew"] = createExportWrapper("setThrew");

var _free = Module["_free"] = createExportWrapper("free");

var _malloc = Module["_malloc"] = createExportWrapper("malloc");

var _sbrk = Module["_sbrk"] = createExportWrapper("sbrk");

var _emscripten_get_sbrk_ptr = Module["_emscripten_get_sbrk_ptr"] = createExportWrapper("emscripten_get_sbrk_ptr");

var dynCall_vij = Module["dynCall_vij"] = createExportWrapper("dynCall_vij");

var dynCall_viijii = Module["dynCall_viijii"] = createExportWrapper("dynCall_viijii");

var dynCall_jiji = Module["dynCall_jiji"] = createExportWrapper("dynCall_jiji");

var dynCall_iiiiij = Module["dynCall_iiiiij"] = createExportWrapper("dynCall_iiiiij");

var dynCall_iiiiijj = Module["dynCall_iiiiijj"] = createExportWrapper("dynCall_iiiiijj");

var dynCall_iiiiiijj = Module["dynCall_iiiiiijj"] = createExportWrapper("dynCall_iiiiiijj");

var _game = Module["_game"] = 30584;

if (!Object.getOwnPropertyDescriptor(Module, "intArrayFromString")) Module["intArrayFromString"] = function() {
 abort("'intArrayFromString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "intArrayToString")) Module["intArrayToString"] = function() {
 abort("'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

Module["ccall"] = ccall;

if (!Object.getOwnPropertyDescriptor(Module, "cwrap")) Module["cwrap"] = function() {
 abort("'cwrap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "setValue")) Module["setValue"] = function() {
 abort("'setValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getValue")) Module["getValue"] = function() {
 abort("'getValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "allocate")) Module["allocate"] = function() {
 abort("'allocate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "UTF8ArrayToString")) Module["UTF8ArrayToString"] = function() {
 abort("'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

Module["UTF8ToString"] = UTF8ToString;

if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF8Array")) Module["stringToUTF8Array"] = function() {
 abort("'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

Module["stringToUTF8"] = stringToUTF8;

Module["lengthBytesUTF8"] = lengthBytesUTF8;

if (!Object.getOwnPropertyDescriptor(Module, "stackTrace")) Module["stackTrace"] = function() {
 abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "addOnPreRun")) Module["addOnPreRun"] = function() {
 abort("'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "addOnInit")) Module["addOnInit"] = function() {
 abort("'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "addOnPreMain")) Module["addOnPreMain"] = function() {
 abort("'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "addOnExit")) Module["addOnExit"] = function() {
 abort("'addOnExit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "addOnPostRun")) Module["addOnPostRun"] = function() {
 abort("'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "writeStringToMemory")) Module["writeStringToMemory"] = function() {
 abort("'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "writeArrayToMemory")) Module["writeArrayToMemory"] = function() {
 abort("'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "writeAsciiToMemory")) Module["writeAsciiToMemory"] = function() {
 abort("'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "addRunDependency")) Module["addRunDependency"] = function() {
 abort("'addRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
};

if (!Object.getOwnPropertyDescriptor(Module, "removeRunDependency")) Module["removeRunDependency"] = function() {
 abort("'removeRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
};

if (!Object.getOwnPropertyDescriptor(Module, "FS_createFolder")) Module["FS_createFolder"] = function() {
 abort("'FS_createFolder' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "FS_createPath")) Module["FS_createPath"] = function() {
 abort("'FS_createPath' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
};

if (!Object.getOwnPropertyDescriptor(Module, "FS_createDataFile")) Module["FS_createDataFile"] = function() {
 abort("'FS_createDataFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
};

if (!Object.getOwnPropertyDescriptor(Module, "FS_createPreloadedFile")) Module["FS_createPreloadedFile"] = function() {
 abort("'FS_createPreloadedFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
};

if (!Object.getOwnPropertyDescriptor(Module, "FS_createLazyFile")) Module["FS_createLazyFile"] = function() {
 abort("'FS_createLazyFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
};

if (!Object.getOwnPropertyDescriptor(Module, "FS_createLink")) Module["FS_createLink"] = function() {
 abort("'FS_createLink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "FS_createDevice")) Module["FS_createDevice"] = function() {
 abort("'FS_createDevice' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
};

if (!Object.getOwnPropertyDescriptor(Module, "FS_unlink")) Module["FS_unlink"] = function() {
 abort("'FS_unlink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
};

if (!Object.getOwnPropertyDescriptor(Module, "getLEB")) Module["getLEB"] = function() {
 abort("'getLEB' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getFunctionTables")) Module["getFunctionTables"] = function() {
 abort("'getFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "alignFunctionTables")) Module["alignFunctionTables"] = function() {
 abort("'alignFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "registerFunctions")) Module["registerFunctions"] = function() {
 abort("'registerFunctions' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "addFunction")) Module["addFunction"] = function() {
 abort("'addFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "removeFunction")) Module["removeFunction"] = function() {
 abort("'removeFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getFuncWrapper")) Module["getFuncWrapper"] = function() {
 abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "prettyPrint")) Module["prettyPrint"] = function() {
 abort("'prettyPrint' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "makeBigInt")) Module["makeBigInt"] = function() {
 abort("'makeBigInt' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "dynCall")) Module["dynCall"] = function() {
 abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getCompilerSetting")) Module["getCompilerSetting"] = function() {
 abort("'getCompilerSetting' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "print")) Module["print"] = function() {
 abort("'print' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "printErr")) Module["printErr"] = function() {
 abort("'printErr' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getTempRet0")) Module["getTempRet0"] = function() {
 abort("'getTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "setTempRet0")) Module["setTempRet0"] = function() {
 abort("'setTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "callMain")) Module["callMain"] = function() {
 abort("'callMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "abort")) Module["abort"] = function() {
 abort("'abort' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stringToNewUTF8")) Module["stringToNewUTF8"] = function() {
 abort("'stringToNewUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "setFileTime")) Module["setFileTime"] = function() {
 abort("'setFileTime' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "emscripten_realloc_buffer")) Module["emscripten_realloc_buffer"] = function() {
 abort("'emscripten_realloc_buffer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "ENV")) Module["ENV"] = function() {
 abort("'ENV' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "ERRNO_CODES")) Module["ERRNO_CODES"] = function() {
 abort("'ERRNO_CODES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "ERRNO_MESSAGES")) Module["ERRNO_MESSAGES"] = function() {
 abort("'ERRNO_MESSAGES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "setErrNo")) Module["setErrNo"] = function() {
 abort("'setErrNo' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "DNS")) Module["DNS"] = function() {
 abort("'DNS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getHostByName")) Module["getHostByName"] = function() {
 abort("'getHostByName' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "GAI_ERRNO_MESSAGES")) Module["GAI_ERRNO_MESSAGES"] = function() {
 abort("'GAI_ERRNO_MESSAGES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "Protocols")) Module["Protocols"] = function() {
 abort("'Protocols' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "Sockets")) Module["Sockets"] = function() {
 abort("'Sockets' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getRandomDevice")) Module["getRandomDevice"] = function() {
 abort("'getRandomDevice' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "traverseStack")) Module["traverseStack"] = function() {
 abort("'traverseStack' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "UNWIND_CACHE")) Module["UNWIND_CACHE"] = function() {
 abort("'UNWIND_CACHE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "withBuiltinMalloc")) Module["withBuiltinMalloc"] = function() {
 abort("'withBuiltinMalloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "readAsmConstArgsArray")) Module["readAsmConstArgsArray"] = function() {
 abort("'readAsmConstArgsArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "readAsmConstArgs")) Module["readAsmConstArgs"] = function() {
 abort("'readAsmConstArgs' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "mainThreadEM_ASM")) Module["mainThreadEM_ASM"] = function() {
 abort("'mainThreadEM_ASM' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "jstoi_q")) Module["jstoi_q"] = function() {
 abort("'jstoi_q' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "jstoi_s")) Module["jstoi_s"] = function() {
 abort("'jstoi_s' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getExecutableName")) Module["getExecutableName"] = function() {
 abort("'getExecutableName' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "listenOnce")) Module["listenOnce"] = function() {
 abort("'listenOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "autoResumeAudioContext")) Module["autoResumeAudioContext"] = function() {
 abort("'autoResumeAudioContext' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "dynCallLegacy")) Module["dynCallLegacy"] = function() {
 abort("'dynCallLegacy' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getDynCaller")) Module["getDynCaller"] = function() {
 abort("'getDynCaller' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "dynCall")) Module["dynCall"] = function() {
 abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "callRuntimeCallbacks")) Module["callRuntimeCallbacks"] = function() {
 abort("'callRuntimeCallbacks' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "abortStackOverflow")) Module["abortStackOverflow"] = function() {
 abort("'abortStackOverflow' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "reallyNegative")) Module["reallyNegative"] = function() {
 abort("'reallyNegative' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "unSign")) Module["unSign"] = function() {
 abort("'unSign' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "reSign")) Module["reSign"] = function() {
 abort("'reSign' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "formatString")) Module["formatString"] = function() {
 abort("'formatString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "PATH")) Module["PATH"] = function() {
 abort("'PATH' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "PATH_FS")) Module["PATH_FS"] = function() {
 abort("'PATH_FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "SYSCALLS")) Module["SYSCALLS"] = function() {
 abort("'SYSCALLS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "syscallMmap2")) Module["syscallMmap2"] = function() {
 abort("'syscallMmap2' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "syscallMunmap")) Module["syscallMunmap"] = function() {
 abort("'syscallMunmap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "JSEvents")) Module["JSEvents"] = function() {
 abort("'JSEvents' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "specialHTMLTargets")) Module["specialHTMLTargets"] = function() {
 abort("'specialHTMLTargets' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "maybeCStringToJsString")) Module["maybeCStringToJsString"] = function() {
 abort("'maybeCStringToJsString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "findEventTarget")) Module["findEventTarget"] = function() {
 abort("'findEventTarget' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "findCanvasEventTarget")) Module["findCanvasEventTarget"] = function() {
 abort("'findCanvasEventTarget' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "polyfillSetImmediate")) Module["polyfillSetImmediate"] = function() {
 abort("'polyfillSetImmediate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "demangle")) Module["demangle"] = function() {
 abort("'demangle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "demangleAll")) Module["demangleAll"] = function() {
 abort("'demangleAll' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "jsStackTrace")) Module["jsStackTrace"] = function() {
 abort("'jsStackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stackTrace")) Module["stackTrace"] = function() {
 abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getEnvStrings")) Module["getEnvStrings"] = function() {
 abort("'getEnvStrings' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "checkWasiClock")) Module["checkWasiClock"] = function() {
 abort("'checkWasiClock' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64")) Module["writeI53ToI64"] = function() {
 abort("'writeI53ToI64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64Clamped")) Module["writeI53ToI64Clamped"] = function() {
 abort("'writeI53ToI64Clamped' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64Signaling")) Module["writeI53ToI64Signaling"] = function() {
 abort("'writeI53ToI64Signaling' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToU64Clamped")) Module["writeI53ToU64Clamped"] = function() {
 abort("'writeI53ToU64Clamped' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToU64Signaling")) Module["writeI53ToU64Signaling"] = function() {
 abort("'writeI53ToU64Signaling' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "readI53FromI64")) Module["readI53FromI64"] = function() {
 abort("'readI53FromI64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "readI53FromU64")) Module["readI53FromU64"] = function() {
 abort("'readI53FromU64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "convertI32PairToI53")) Module["convertI32PairToI53"] = function() {
 abort("'convertI32PairToI53' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "convertU32PairToI53")) Module["convertU32PairToI53"] = function() {
 abort("'convertU32PairToI53' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "uncaughtExceptionCount")) Module["uncaughtExceptionCount"] = function() {
 abort("'uncaughtExceptionCount' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "exceptionLast")) Module["exceptionLast"] = function() {
 abort("'exceptionLast' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "exceptionCaught")) Module["exceptionCaught"] = function() {
 abort("'exceptionCaught' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "ExceptionInfoAttrs")) Module["ExceptionInfoAttrs"] = function() {
 abort("'ExceptionInfoAttrs' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "ExceptionInfo")) Module["ExceptionInfo"] = function() {
 abort("'ExceptionInfo' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "CatchInfo")) Module["CatchInfo"] = function() {
 abort("'CatchInfo' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "exception_addRef")) Module["exception_addRef"] = function() {
 abort("'exception_addRef' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "exception_decRef")) Module["exception_decRef"] = function() {
 abort("'exception_decRef' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "Browser")) Module["Browser"] = function() {
 abort("'Browser' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "funcWrappers")) Module["funcWrappers"] = function() {
 abort("'funcWrappers' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getFuncWrapper")) Module["getFuncWrapper"] = function() {
 abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "setMainLoop")) Module["setMainLoop"] = function() {
 abort("'setMainLoop' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "FS")) Module["FS"] = function() {
 abort("'FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "mmapAlloc")) Module["mmapAlloc"] = function() {
 abort("'mmapAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "MEMFS")) Module["MEMFS"] = function() {
 abort("'MEMFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "TTY")) Module["TTY"] = function() {
 abort("'TTY' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "PIPEFS")) Module["PIPEFS"] = function() {
 abort("'PIPEFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "SOCKFS")) Module["SOCKFS"] = function() {
 abort("'SOCKFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "tempFixedLengthArray")) Module["tempFixedLengthArray"] = function() {
 abort("'tempFixedLengthArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "miniTempWebGLFloatBuffers")) Module["miniTempWebGLFloatBuffers"] = function() {
 abort("'miniTempWebGLFloatBuffers' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "heapObjectForWebGLType")) Module["heapObjectForWebGLType"] = function() {
 abort("'heapObjectForWebGLType' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "heapAccessShiftForWebGLHeap")) Module["heapAccessShiftForWebGLHeap"] = function() {
 abort("'heapAccessShiftForWebGLHeap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "GL")) Module["GL"] = function() {
 abort("'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGet")) Module["emscriptenWebGLGet"] = function() {
 abort("'emscriptenWebGLGet' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "computeUnpackAlignedImageSize")) Module["computeUnpackAlignedImageSize"] = function() {
 abort("'computeUnpackAlignedImageSize' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetTexPixelData")) Module["emscriptenWebGLGetTexPixelData"] = function() {
 abort("'emscriptenWebGLGetTexPixelData' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetUniform")) Module["emscriptenWebGLGetUniform"] = function() {
 abort("'emscriptenWebGLGetUniform' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetVertexAttrib")) Module["emscriptenWebGLGetVertexAttrib"] = function() {
 abort("'emscriptenWebGLGetVertexAttrib' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "writeGLArray")) Module["writeGLArray"] = function() {
 abort("'writeGLArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "AL")) Module["AL"] = function() {
 abort("'AL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "SDL_unicode")) Module["SDL_unicode"] = function() {
 abort("'SDL_unicode' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "SDL_ttfContext")) Module["SDL_ttfContext"] = function() {
 abort("'SDL_ttfContext' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "SDL_audio")) Module["SDL_audio"] = function() {
 abort("'SDL_audio' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "SDL")) Module["SDL"] = function() {
 abort("'SDL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "SDL_gfx")) Module["SDL_gfx"] = function() {
 abort("'SDL_gfx' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "GLUT")) Module["GLUT"] = function() {
 abort("'GLUT' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "EGL")) Module["EGL"] = function() {
 abort("'EGL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "GLFW_Window")) Module["GLFW_Window"] = function() {
 abort("'GLFW_Window' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "GLFW")) Module["GLFW"] = function() {
 abort("'GLFW' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "GLEW")) Module["GLEW"] = function() {
 abort("'GLEW' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "IDBStore")) Module["IDBStore"] = function() {
 abort("'IDBStore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "runAndAbortIfError")) Module["runAndAbortIfError"] = function() {
 abort("'runAndAbortIfError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "warnOnce")) Module["warnOnce"] = function() {
 abort("'warnOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stackSave")) Module["stackSave"] = function() {
 abort("'stackSave' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stackRestore")) Module["stackRestore"] = function() {
 abort("'stackRestore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stackAlloc")) Module["stackAlloc"] = function() {
 abort("'stackAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "AsciiToString")) Module["AsciiToString"] = function() {
 abort("'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stringToAscii")) Module["stringToAscii"] = function() {
 abort("'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "UTF16ToString")) Module["UTF16ToString"] = function() {
 abort("'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF16")) Module["stringToUTF16"] = function() {
 abort("'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF16")) Module["lengthBytesUTF16"] = function() {
 abort("'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "UTF32ToString")) Module["UTF32ToString"] = function() {
 abort("'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF32")) Module["stringToUTF32"] = function() {
 abort("'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF32")) Module["lengthBytesUTF32"] = function() {
 abort("'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "allocateUTF8")) Module["allocateUTF8"] = function() {
 abort("'allocateUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "allocateUTF8OnStack")) Module["allocateUTF8OnStack"] = function() {
 abort("'allocateUTF8OnStack' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

Module["writeStackCookie"] = writeStackCookie;

Module["checkStackCookie"] = checkStackCookie;

if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_NORMAL")) Object.defineProperty(Module, "ALLOC_NORMAL", {
 configurable: true,
 get: function() {
  abort("'ALLOC_NORMAL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
 }
});

if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_STACK")) Object.defineProperty(Module, "ALLOC_STACK", {
 configurable: true,
 get: function() {
  abort("'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
 }
});

var calledRun;

function ExitStatus(status) {
 this.name = "ExitStatus";
 this.message = "Program terminated with exit(" + status + ")";
 this.status = status;
}

var calledMain = false;

dependenciesFulfilled = function runCaller() {
 if (!calledRun) run();
 if (!calledRun) dependenciesFulfilled = runCaller;
};

function run(args) {
 args = args || arguments_;
 if (runDependencies > 0) {
  return;
 }
 _emscripten_stack_init();
 writeStackCookie();
 preRun();
 if (runDependencies > 0) return;
 function doRun() {
  if (calledRun) return;
  calledRun = true;
  Module["calledRun"] = true;
  if (ABORT) return;
  initRuntime();
  preMain();
  readyPromiseResolve(Module);
  if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
  assert(!Module["_main"], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');
  postRun();
 }
 if (Module["setStatus"]) {
  Module["setStatus"]("Running...");
  setTimeout(function() {
   setTimeout(function() {
    Module["setStatus"]("");
   }, 1);
   doRun();
  }, 1);
 } else {
  doRun();
 }
 checkStackCookie();
}

Module["run"] = run;

function checkUnflushedContent() {
 var oldOut = out;
 var oldErr = err;
 var has = false;
 out = err = function(x) {
  has = true;
 };
 try {
  var flush = Module["_fflush"];
  if (flush) flush(0);
  [ "stdout", "stderr" ].forEach(function(name) {
   var info = FS.analyzePath("/dev/" + name);
   if (!info) return;
   var stream = info.object;
   var rdev = stream.rdev;
   var tty = TTY.ttys[rdev];
   if (tty && tty.output && tty.output.length) {
    has = true;
   }
  });
 } catch (e) {}
 out = oldOut;
 err = oldErr;
 if (has) {
  warnOnce("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.");
 }
}

function exit(status, implicit) {
 checkUnflushedContent();
 if (implicit && noExitRuntime && status === 0) {
  return;
 }
 if (noExitRuntime) {
  if (!implicit) {
   var msg = "program exited (with status: " + status + "), but EXIT_RUNTIME is not set, so halting execution but not exiting the runtime or preventing further async execution (build with EXIT_RUNTIME=1, if you want a true shutdown)";
   readyPromiseReject(msg);
   err(msg);
  }
 } else {
  EXITSTATUS = status;
  exitRuntime();
  if (Module["onExit"]) Module["onExit"](status);
  ABORT = true;
 }
 quit_(status, new ExitStatus(status));
}

if (Module["preInit"]) {
 if (typeof Module["preInit"] == "function") Module["preInit"] = [ Module["preInit"] ];
 while (Module["preInit"].length > 0) {
  Module["preInit"].pop()();
 }
}

noExitRuntime = true;

run();


  return Module.ready
}
);
})();
if (true)
  module.exports = Module;
else {}


/***/ }),

/***/ "./client/resource-manager.js":
/*!************************************!*\
  !*** ./client/resource-manager.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const resourcesToLoad = __webpack_require__(/*! ./resources/resources.js */ "./client/resources/resources.js")

module.exports = class ResourceManager {
    constructor(callback) {
        this.resources = {};
        this.deferArr = [];
        this.loadResources(resourcesToLoad, this.deferArr);
        Promise.all(this.deferArr).then(() => {
            callback();
        });
    }

    get(key) {
        const resource = this.resources[key];
        if (!resource) {
            console.error('Resource ' + key + ' not found!');
        }
        return resource;
    }

    loadResource(location, key, url, deferArr, options) {
        deferArr.push(new Promise((resolve, reject) => {
            location[key] = new Image();
            location[key].onload = () => {
                console.log('Resource loaded: ' + url);
                if (options.flipDirection) {
                    const image = location[key];
                    const c = document.createElement('canvas');
                    c.width = image.width;
                    c.height = image.height;
                    const ctx = c.getContext('2d');
                    ctx.scale(-1,1);
                    ctx.drawImage(image,-image.width,0);
                    location[key + '-FLIPPED'] = new Image();
                    location[key + '-FLIPPED'].onload = () => {
                        console.log('Flipped: ' + url);
                        resolve();
                    };
                    location[key + '-FLIPPED'].src = c.toDataURL();
                }
                else {
                    resolve();
                }
            };
            location[key].onerror = () => {
                console.error('Couldn\'t load resource: ' + url);
                reject();
            };
            
            location[key].src = url;
        }));
    }

    loadResources(resourcesToLoad, deferArr) {
        const resourceUrls = Object.keys(resourcesToLoad);
        for (let i = 0; i < resourceUrls.length; i++) {
            this.loadResource(this.resources, resourceUrls[i], '/resources/' + resourceUrls[i], deferArr,
                resourcesToLoad[resourceUrls[i]]);
        }
    }
};

/***/ }),

/***/ "./client/resources/resources.js":
/*!***************************************!*\
  !*** ./client/resources/resources.js ***!
  \***************************************/
/***/ ((module) => {

module.exports = {
    'marine.png': {
        flipDirection: true
    },
    'marineArm.png': {},
    'm4.png': {
        flipDirection: true
    }
};

/***/ }),

/***/ "./node_modules/path-browserify/index.js":
/*!***********************************************!*\
  !*** ./node_modules/path-browserify/index.js ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;


/***/ }),

/***/ "?65c5":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
(() => {
/*!*************************!*\
  !*** ./client/index.js ***!
  \*************************/
const gameObjectLookup = __webpack_require__(/*! ./game-objects */ "./client/game-objects.js");
const ResourceManager = __webpack_require__(/*! ./resource-manager */ "./client/resource-manager.js");
const Client = __webpack_require__(/*! ./game_client */ "./client/game_client.js");

function ToHeapString(wasm, str) {
    const length = wasm.lengthBytesUTF8(str) + 1;
    const buffer = wasm._malloc(length);
    wasm.stringToUTF8(str, buffer, length);
    return buffer;
}

console.log('Loading Game WASM');
Client().then((instance) => {
    console.log(instance);
    console.log('Loading Web Socket');
    const webSocket = new WebSocket('ws://localhost:8080/connect');
    webSocket.onopen = function (event) {
        console.log('Loading Resource Manager');
        const resourceManager = new ResourceManager(() => {
            console.log('Starting Game');
            StartGame({
                webSocket,
                wasm: instance,
                resourceManager
            });
        });
    };
}).catch(error => console.error(error));


// INITIALIZATION
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

let width = 0;
let height = 0;

function resize() {
    width  = window.innerWidth;
    height = window.innerHeight;
    canvas.width  = width;
    canvas.height = height;
    canvas.style.width  = width + 'px';
    canvas.style.height = height + 'px';
}

window.addEventListener('resize', resize);
resize();

let localPlayerObjectId = undefined;

// Main Game Start (after everything has started)
function StartGame(modules) {
    const { wasm, webSocket, resourceManager } = modules;
    const gameObjects = {};

    webSocket.onmessage = function (ev) {
        const obj = JSON.parse(ev.data);
        if (obj["playerLocalObjectId"]) {
            localPlayerObjectId = obj["playerLocalObjectId"];
        }
        else {
            const heapString = ToHeapString(wasm, ev.data);
            wasm._HandleReplicate(heapString);
            wasm._free(heapString);
            gameObjects[obj.id] = obj;
        }
    };

    function sendInputPacket(input) {
        const inputStr = JSON.stringify(input);
        webSocket.send(inputStr);
        if (localPlayerObjectId !== undefined) {
            // Serve Inputs into Local
            const heapString = ToHeapString(wasm, inputStr);
            wasm._HandleLocalInput(localPlayerObjectId, heapString);
            wasm._free(heapString);
        }
    }

    let lastTime = Date.now();

    const backgroundGradient = context.createLinearGradient(0, 0, 0, height);
    backgroundGradient.addColorStop(0, "#cbc4d3");
    backgroundGradient.addColorStop(0.5, "#d8c39b");
    backgroundGradient.addColorStop(1, "#b49862");
    
    tick();

    function tick() {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        
        // Create Gradient
        context.fillStyle = backgroundGradient;
        context.fillRect(0, 0, width, height);

        Object.keys(gameObjects).forEach((k) => {
            const obj = gameObjects[k];
            if (!wasm._IsObjectAlive(obj.id)) {
                delete gameObjects[k];
                return;
            }
            if (gameObjectLookup[obj.t] !== undefined) {
                const serializedString = wasm._GetObjectSerialized(obj.id);
                const jsonString = wasm.UTF8ToString(serializedString);
                const serializedObject = JSON.parse(jsonString);
                wasm._free(serializedString);
                gameObjects[k] = serializedObject;
                gameObjectLookup[obj.t].draw(context, resourceManager, serializedObject, gameObjects);
            }
            else {
                console.error('Invalid object class', obj.t);
            }
            // Local Simulation
            if (obj.c) {
                for (let i = 0; i < obj.c.length; i++) {
                    const collider = obj.c[i];
                    context.strokeStyle = "black";
                    context.lineWidth = 2;
                    if (collider.t === 0) {
                        context.strokeRect(obj.p.x + collider.p.x, obj.p.y + collider.p.y, collider.size.x, collider.size.y);
                    }
                    else if (collider.t === 1) {
                        context.beginPath();
                        context.arc(obj.p.x + collider.p.x, obj.p.y + collider.p.y, collider.radius, 0, 2 * Math.PI);
                        context.stroke();
                    }
                }
            }
        });
        Object.keys(gameObjects).forEach((k) => {
            const obj = gameObjects[k];
            if (gameObjectLookup[obj.t] !== undefined) {
                if (gameObjectLookup[obj.t].postDraw) {
                    gameObjectLookup[obj.t].postDraw(context, resourceManager, obj, gameObjects);
                }
            }
            else {
                console.error('Invalid object class', obj.t);
            }
        });
        lastTime = currentTime;
        wasm._TickGame(currentTime);
        requestAnimationFrame(tick);
    }

    window.addEventListener('keydown', e => {
        if (e.repeat) { return; }
        sendInputPacket({
            event: "kd",
            key: e.key
        });
    });

    window.addEventListener('keyup', e => {
        sendInputPacket({
            event: "ku",
            key: e.key
        });
    });

    let lastMouseMoveSend = Date.now();
    window.addEventListener('mousemove', e => {
        // Rate limit this!!
        const current = Date.now();
        if (current - lastMouseMoveSend > 30) {
            lastMouseMoveSend = current;
            sendInputPacket({
                event: "mm",
                x: e.pageX,
                y: e.pageY
            });
        }
    });

    window.addEventListener('mousedown', e => {
        sendInputPacket({
            event: "md",
            button: e.which
        });
    });

    window.addEventListener('mouseup', e => {
        sendInputPacket({
            event: "mu",
            button: e.which
        });
    })
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZXBsaWNhdGlvbi8uL2NsaWVudC9nYW1lLW9iamVjdHMuanMiLCJ3ZWJwYWNrOi8vcmVwbGljYXRpb24vLi9jbGllbnQvZ2FtZV9jbGllbnQuanMiLCJ3ZWJwYWNrOi8vcmVwbGljYXRpb24vLi9jbGllbnQvcmVzb3VyY2UtbWFuYWdlci5qcyIsIndlYnBhY2s6Ly9yZXBsaWNhdGlvbi8uL2NsaWVudC9yZXNvdXJjZXMvcmVzb3VyY2VzLmpzIiwid2VicGFjazovL3JlcGxpY2F0aW9uLy4vbm9kZV9tb2R1bGVzL3BhdGgtYnJvd3NlcmlmeS9pbmRleC5qcyIsIndlYnBhY2s6Ly9yZXBsaWNhdGlvbi9pZ25vcmVkfGZzIiwid2VicGFjazovL3JlcGxpY2F0aW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JlcGxpY2F0aW9uLy4vY2xpZW50L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFOzs7Ozs7Ozs7Ozs7O0FDOUVBO0FBQ0E7QUFDQSxNQUFNLElBQWlDLDZCQUE2QixVQUFVO0FBQzlFO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixrRkFBdUI7QUFDM0MsRUFBRTtBQUNGLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQSx3QkFBd0IsbUJBQU8sQ0FBQyxpQkFBSTtBQUNwQyw0QkFBNEIsbUJBQU8sQ0FBQyxxREFBTTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVELG9EQUFvRDs7QUFFcEQsd0RBQXdEOztBQUV4RCwwREFBMEQ7O0FBRTFELHNEQUFzRDs7QUFFdEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGdCQUFnQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLHFCQUFxQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixzQkFBc0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGlCQUFpQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixnQkFBZ0I7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLGdCQUFnQjtBQUNoQztBQUNBO0FBQ0Esc0JBQXNCLDhCQUE4QiwrQkFBK0I7QUFDbkY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLGlCQUFpQiw0QkFBNEI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IscUJBQXFCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGdCQUFnQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixnQkFBZ0I7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0IsZ0JBQWdCO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbURBQW1EOztBQUVuRDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLElBQUk7QUFDSixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLENBQUM7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLGNBQWM7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkNBQTZDLElBQUk7QUFDakQ7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLGdDQUFnQyxRQUFRO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLEdBQUc7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSx1QkFBdUIsbUJBQU8sQ0FBQyxxSUFBUTtBQUN2QztBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLHVMQUF1TCxtQ0FBbUMsZ0JBQWdCLGtCQUFrQix3Q0FBd0MsR0FBRztBQUN2UztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyw4QkFBOEI7QUFDbEU7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLG1CQUFtQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQSxTQUFTLFNBQVM7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFlBQVk7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLHNCQUFzQjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQix3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFlBQVk7QUFDL0I7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTiwyREFBMkQ7QUFDM0Q7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLG9CQUFvQjtBQUN0QztBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFFQUFxRTtBQUNyRTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osbUJBQW1CLFVBQVU7QUFDN0I7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixtQkFBbUIsWUFBWTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsaUJBQWlCLGtCQUFrQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxpQkFBaUIsaUJBQWlCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLE1BQU07QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixjQUFjO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsaUJBQWlCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHLElBQUk7QUFDUCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHVCQUF1QjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsU0FBUztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsbUJBQW1CLFlBQVk7QUFDL0I7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsbUJBQW1CLFlBQVk7QUFDL0I7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsVUFBVTtBQUM3QjtBQUNBO0FBQ0EsSUFBSTtBQUNKLG1CQUFtQixVQUFVO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osR0FBRztBQUNIO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsMENBQTBDO0FBQzFDLEVBQUU7QUFDRjtBQUNBLDBDQUEwQztBQUMxQyxFQUFFO0FBQ0Y7QUFDQSx3Q0FBd0M7QUFDeEMsRUFBRTtBQUNGO0FBQ0Esc0NBQXNDO0FBQ3RDLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7O0FBRUE7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLGlCQUFpQixZQUFZO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLGlCQUFpQixZQUFZO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsWUFBWTtBQUM1QjtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLGtCQUFrQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsSUFBSSxJQUF5RDtBQUM3RDtBQUNBLEtBQUssRUFHd0I7Ozs7Ozs7Ozs7O0FDdnlMN0Isd0JBQXdCLG1CQUFPLENBQUMsaUVBQTBCOztBQUUxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLHlCQUF5QjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEU7Ozs7Ozs7Ozs7QUM1REE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxFOzs7Ozs7Ozs7OztBQ1JBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGtCQUFrQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0NBQXNDLDhCQUE4QjtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsc0JBQXNCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFVBQVUseUJBQXlCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVUscUJBQXFCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLGFBQWE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQSxXQUFXO0FBQ1g7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0EsV0FBVztBQUNYO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsY0FBYztBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsUUFBUTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsUUFBUTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnREFBZ0Q7QUFDaEQ7QUFDQSxLQUFLO0FBQ0wsK0JBQStCLFFBQVE7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLFFBQVE7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFVLFlBQVk7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9GQUFvRjtBQUNwRjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4REFBOEQ7O0FBRTlEO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7Ozs7OztBQ2hoQkEsZTs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7QUNyQkEseUJBQXlCLG1CQUFPLENBQUMsZ0RBQWdCO0FBQ2pELHdCQUF3QixtQkFBTyxDQUFDLHdEQUFvQjtBQUNwRCxlQUFlLG1CQUFPLENBQUMsOENBQWU7O0FBRXRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQSxDQUFDOzs7QUFHRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFdBQVcsbUNBQW1DO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLGtCQUFrQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUF1QixRQUFRO0FBQy9CO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb250YWlucyBkcmF3IGluc3RydWN0aW9ucyBmb3IgZGlmZmVyZW50IGdhbWUgb2JqZWN0cyBcclxuZnVuY3Rpb24gZHJhd0ltYWdlKGNvbnRleHQsIGltZywgeCwgeSwgd2lkdGggPSAtMSwgaGVpZ2h0ID0gLTEsIGFuZ2xlID0gMCkge1xyXG4gICAgaWYgKHdpZHRoID09PSAtMSkgd2lkdGggPSBpbWcud2lkdGg7XHJcbiAgICBpZiAoaGVpZ2h0ID09PSAtMSkgaGVpZ2h0ID0gaW1nLmhlaWdodDtcclxuICAgIGlmIChhbmdsZSA9PT0gMCkge1xyXG4gICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGltZywgeCAtIHdpZHRoIC8gMiwgeSAtIGhlaWdodCAvIDIsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoeCwgeSk7XHJcbiAgICAgICAgY29udGV4dC5yb3RhdGUoYW5nbGUpO1xyXG4gICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGltZywgLXdpZHRoIC8gMiwgLWhlaWdodCAvIDIsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQucm90YXRlKC1hbmdsZSk7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoLXgsIC15KTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBcIlJlY3RhbmdsZU9iamVjdFwiOiB7XHJcbiAgICAgICAgZHJhdyAoY29udGV4dCwgcmVzb3VyY2VNYW5hZ2VyLCBvYmosIG9iamVjdHMpIHtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcInJlZFwiO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxSZWN0KG9iai5wLngsIG9iai5wLnksIG9iai5zaXplLngsIG9iai5zaXplLnkpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcIkNpcmNsZU9iamVjdFwiOiB7XHJcbiAgICAgICAgZHJhdyAoY29udGV4dCwgcmVzb3VyY2VNYW5hZ2VyLCBvYmosIG9iamVjdHMpIHtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcImJsdWVcIjtcclxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5hcmMob2JqLnAueCwgb2JqLnAueSwgb2JqLnJhZGl1cywgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJCdWxsZXRPYmplY3RcIjoge1xyXG4gICAgICAgIGRyYXcgKGNvbnRleHQsIHJlc291cmNlTWFuYWdlciwgb2JqLCBvYmplY3RzKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmFyYyhvYmoucC54LCBvYmoucC55LCAzLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcIldlYXBvbk9iamVjdFwiOiB7XHJcbiAgICAgICAgZHJhdyAoY29udGV4dCwgcmVzb3VyY2VNYW5hZ2VyLCBvYmosIG9iamVjdHMpIHtcclxuICAgICAgICAgICAgbGV0IGlzRmxpcCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBsZXQgYW5nbGUgPSAwO1xyXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJBdHRhY2ggPSBvYmplY3RzW29iai5hdHRhY2hdOyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAocGxheWVyQXR0YWNoKSB7XHJcbiAgICAgICAgICAgICAgICBpc0ZsaXAgPSBNYXRoLmFicyhwbGF5ZXJBdHRhY2guYWEpID4gKE1hdGguUEkgLyAyKTtcclxuICAgICAgICAgICAgICAgIGlmIChpc0ZsaXApIHtcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZSA9IE1hdGguUEk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhbmdsZSArPSBwbGF5ZXJBdHRhY2guYWE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgaW1hZ2UgPSBpc0ZsaXAgPyByZXNvdXJjZU1hbmFnZXIuZ2V0KCdtNC5wbmctRkxJUFBFRCcpIDogcmVzb3VyY2VNYW5hZ2VyLmdldCgnbTQucG5nJyk7XHJcbiAgICAgICAgICAgIGRyYXdJbWFnZShjb250ZXh0LCBpbWFnZSwgb2JqLnAueCwgb2JqLnAueSwgKGltYWdlLndpZHRoIC8gMyksIChpbWFnZS5oZWlnaHQgLyAzKSwgYW5nbGUpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcIlBsYXllck9iamVjdFwiOiB7XHJcbiAgICAgICAgZHJhdyAoY29udGV4dCwgcmVzb3VyY2VNYW5hZ2VyLCBvYmosIG9iamVjdHMpIHtcclxuICAgICAgICAgICAgY29uc3QgaW1hZ2UgPSBvYmoudi54IDwgMCA/IHJlc291cmNlTWFuYWdlci5nZXQoJ21hcmluZS5wbmctRkxJUFBFRCcpIDogcmVzb3VyY2VNYW5hZ2VyLmdldCgnbWFyaW5lLnBuZycpO1xyXG4gICAgICAgICAgICBkcmF3SW1hZ2UoY29udGV4dCwgaW1hZ2UsIG9iai5wLngsIG9iai5wLnksIChpbWFnZS53aWR0aCAvIDIpLCAoaW1hZ2UuaGVpZ2h0IC8gMikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9zdERyYXcoY29udGV4dCwgcmVzb3VyY2VNYW5hZ2VyLCBvYmosIG9iamVjdHMpIHtcclxuICAgICAgICAgICAgY29uc3QgYXJtID0gcmVzb3VyY2VNYW5hZ2VyLmdldCgnbWFyaW5lQXJtLnBuZycpO1xyXG4gICAgICAgICAgICBkcmF3SW1hZ2UoY29udGV4dCwgYXJtLCBvYmoucC54LCBvYmoucC55ICsgNywgKGFybS53aWR0aCAvIDIpLCAoYXJtLmhlaWdodCAvIDIpLCBvYmouYWEpO1xyXG5cclxuICAgICAgICAgICAgLy8gRHJhdyBIZWFsdGggQmFyXHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxSZWN0KFxyXG4gICAgICAgICAgICAgICAgb2JqLnAueCAtIDI1LFxyXG4gICAgICAgICAgICAgICAgb2JqLnAueSAtIDUwLFxyXG4gICAgICAgICAgICAgICAgNTAsIDVcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiZ3JlZW5cIjtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsUmVjdChcclxuICAgICAgICAgICAgICAgIG9iai5wLnggLSAyNSxcclxuICAgICAgICAgICAgICAgIG9iai5wLnkgLSA1MCxcclxuICAgICAgICAgICAgICAgIDAuNSAqIG9iai5oLCA1XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07IiwiXG52YXIgTW9kdWxlID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgX3NjcmlwdERpciA9IHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQuY3VycmVudFNjcmlwdCA/IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjIDogdW5kZWZpbmVkO1xuICBpZiAodHlwZW9mIF9fZmlsZW5hbWUgIT09ICd1bmRlZmluZWQnKSBfc2NyaXB0RGlyID0gX3NjcmlwdERpciB8fCBfX2ZpbGVuYW1lO1xuICByZXR1cm4gKFxuZnVuY3Rpb24oTW9kdWxlKSB7XG4gIE1vZHVsZSA9IE1vZHVsZSB8fCB7fTtcblxudmFyIE1vZHVsZSA9IHR5cGVvZiBNb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgPyBNb2R1bGUgOiB7fTtcblxudmFyIHJlYWR5UHJvbWlzZVJlc29sdmUsIHJlYWR5UHJvbWlzZVJlamVjdDtcblxuTW9kdWxlW1wicmVhZHlcIl0gPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiByZWFkeVByb21pc2VSZXNvbHZlID0gcmVzb2x2ZTtcbiByZWFkeVByb21pc2VSZWplY3QgPSByZWplY3Q7XG59KTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZVtcInJlYWR5XCJdLCBcIl9tYWluXCIpKSB7XG4gT2JqZWN0LmRlZmluZVByb3BlcnR5KE1vZHVsZVtcInJlYWR5XCJdLCBcIl9tYWluXCIsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgYWJvcnQoXCJZb3UgYXJlIGdldHRpbmcgX21haW4gb24gdGhlIFByb21pc2Ugb2JqZWN0LCBpbnN0ZWFkIG9mIHRoZSBpbnN0YW5jZS4gVXNlIC50aGVuKCkgdG8gZ2V0IGNhbGxlZCBiYWNrIHdpdGggdGhlIGluc3RhbmNlLCBzZWUgdGhlIE1PRFVMQVJJWkUgZG9jcyBpbiBzcmMvc2V0dGluZ3MuanNcIik7XG4gIH1cbiB9KTtcbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlW1wicmVhZHlcIl0sIFwiX21haW5cIiwge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIHNldDogZnVuY3Rpb24oKSB7XG4gICBhYm9ydChcIllvdSBhcmUgc2V0dGluZyBfbWFpbiBvbiB0aGUgUHJvbWlzZSBvYmplY3QsIGluc3RlYWQgb2YgdGhlIGluc3RhbmNlLiBVc2UgLnRoZW4oKSB0byBnZXQgY2FsbGVkIGJhY2sgd2l0aCB0aGUgaW5zdGFuY2UsIHNlZSB0aGUgTU9EVUxBUklaRSBkb2NzIGluIHNyYy9zZXR0aW5ncy5qc1wiKTtcbiAgfVxuIH0pO1xufVxuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlW1wicmVhZHlcIl0sIFwiX3NicmtcIikpIHtcbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlW1wicmVhZHlcIl0sIFwiX3NicmtcIiwge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICBhYm9ydChcIllvdSBhcmUgZ2V0dGluZyBfc2JyayBvbiB0aGUgUHJvbWlzZSBvYmplY3QsIGluc3RlYWQgb2YgdGhlIGluc3RhbmNlLiBVc2UgLnRoZW4oKSB0byBnZXQgY2FsbGVkIGJhY2sgd2l0aCB0aGUgaW5zdGFuY2UsIHNlZSB0aGUgTU9EVUxBUklaRSBkb2NzIGluIHNyYy9zZXR0aW5ncy5qc1wiKTtcbiAgfVxuIH0pO1xuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNb2R1bGVbXCJyZWFkeVwiXSwgXCJfc2Jya1wiLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgc2V0OiBmdW5jdGlvbigpIHtcbiAgIGFib3J0KFwiWW91IGFyZSBzZXR0aW5nIF9zYnJrIG9uIHRoZSBQcm9taXNlIG9iamVjdCwgaW5zdGVhZCBvZiB0aGUgaW5zdGFuY2UuIFVzZSAudGhlbigpIHRvIGdldCBjYWxsZWQgYmFjayB3aXRoIHRoZSBpbnN0YW5jZSwgc2VlIHRoZSBNT0RVTEFSSVpFIGRvY3MgaW4gc3JjL3NldHRpbmdzLmpzXCIpO1xuICB9XG4gfSk7XG59XG5cbmlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihNb2R1bGVbXCJyZWFkeVwiXSwgXCJfZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kXCIpKSB7XG4gT2JqZWN0LmRlZmluZVByb3BlcnR5KE1vZHVsZVtcInJlYWR5XCJdLCBcIl9lbXNjcmlwdGVuX3N0YWNrX2dldF9lbmRcIiwge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICBhYm9ydChcIllvdSBhcmUgZ2V0dGluZyBfZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kIG9uIHRoZSBQcm9taXNlIG9iamVjdCwgaW5zdGVhZCBvZiB0aGUgaW5zdGFuY2UuIFVzZSAudGhlbigpIHRvIGdldCBjYWxsZWQgYmFjayB3aXRoIHRoZSBpbnN0YW5jZSwgc2VlIHRoZSBNT0RVTEFSSVpFIGRvY3MgaW4gc3JjL3NldHRpbmdzLmpzXCIpO1xuICB9XG4gfSk7XG4gT2JqZWN0LmRlZmluZVByb3BlcnR5KE1vZHVsZVtcInJlYWR5XCJdLCBcIl9lbXNjcmlwdGVuX3N0YWNrX2dldF9lbmRcIiwge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIHNldDogZnVuY3Rpb24oKSB7XG4gICBhYm9ydChcIllvdSBhcmUgc2V0dGluZyBfZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kIG9uIHRoZSBQcm9taXNlIG9iamVjdCwgaW5zdGVhZCBvZiB0aGUgaW5zdGFuY2UuIFVzZSAudGhlbigpIHRvIGdldCBjYWxsZWQgYmFjayB3aXRoIHRoZSBpbnN0YW5jZSwgc2VlIHRoZSBNT0RVTEFSSVpFIGRvY3MgaW4gc3JjL3NldHRpbmdzLmpzXCIpO1xuICB9XG4gfSk7XG59XG5cbmlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihNb2R1bGVbXCJyZWFkeVwiXSwgXCJfZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZVwiKSkge1xuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNb2R1bGVbXCJyZWFkeVwiXSwgXCJfZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZVwiLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgIGFib3J0KFwiWW91IGFyZSBnZXR0aW5nIF9lbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlIG9uIHRoZSBQcm9taXNlIG9iamVjdCwgaW5zdGVhZCBvZiB0aGUgaW5zdGFuY2UuIFVzZSAudGhlbigpIHRvIGdldCBjYWxsZWQgYmFjayB3aXRoIHRoZSBpbnN0YW5jZSwgc2VlIHRoZSBNT0RVTEFSSVpFIGRvY3MgaW4gc3JjL3NldHRpbmdzLmpzXCIpO1xuICB9XG4gfSk7XG4gT2JqZWN0LmRlZmluZVByb3BlcnR5KE1vZHVsZVtcInJlYWR5XCJdLCBcIl9lbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlXCIsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBzZXQ6IGZ1bmN0aW9uKCkge1xuICAgYWJvcnQoXCJZb3UgYXJlIHNldHRpbmcgX2Vtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUgb24gdGhlIFByb21pc2Ugb2JqZWN0LCBpbnN0ZWFkIG9mIHRoZSBpbnN0YW5jZS4gVXNlIC50aGVuKCkgdG8gZ2V0IGNhbGxlZCBiYWNrIHdpdGggdGhlIGluc3RhbmNlLCBzZWUgdGhlIE1PRFVMQVJJWkUgZG9jcyBpbiBzcmMvc2V0dGluZ3MuanNcIik7XG4gIH1cbiB9KTtcbn1cblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZVtcInJlYWR5XCJdLCBcIl9lbXNjcmlwdGVuX3N0YWNrX2luaXRcIikpIHtcbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlW1wicmVhZHlcIl0sIFwiX2Vtc2NyaXB0ZW5fc3RhY2tfaW5pdFwiLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgIGFib3J0KFwiWW91IGFyZSBnZXR0aW5nIF9lbXNjcmlwdGVuX3N0YWNrX2luaXQgb24gdGhlIFByb21pc2Ugb2JqZWN0LCBpbnN0ZWFkIG9mIHRoZSBpbnN0YW5jZS4gVXNlIC50aGVuKCkgdG8gZ2V0IGNhbGxlZCBiYWNrIHdpdGggdGhlIGluc3RhbmNlLCBzZWUgdGhlIE1PRFVMQVJJWkUgZG9jcyBpbiBzcmMvc2V0dGluZ3MuanNcIik7XG4gIH1cbiB9KTtcbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlW1wicmVhZHlcIl0sIFwiX2Vtc2NyaXB0ZW5fc3RhY2tfaW5pdFwiLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgc2V0OiBmdW5jdGlvbigpIHtcbiAgIGFib3J0KFwiWW91IGFyZSBzZXR0aW5nIF9lbXNjcmlwdGVuX3N0YWNrX2luaXQgb24gdGhlIFByb21pc2Ugb2JqZWN0LCBpbnN0ZWFkIG9mIHRoZSBpbnN0YW5jZS4gVXNlIC50aGVuKCkgdG8gZ2V0IGNhbGxlZCBiYWNrIHdpdGggdGhlIGluc3RhbmNlLCBzZWUgdGhlIE1PRFVMQVJJWkUgZG9jcyBpbiBzcmMvc2V0dGluZ3MuanNcIik7XG4gIH1cbiB9KTtcbn1cblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZVtcInJlYWR5XCJdLCBcIl9zdGFja1NhdmVcIikpIHtcbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlW1wicmVhZHlcIl0sIFwiX3N0YWNrU2F2ZVwiLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgIGFib3J0KFwiWW91IGFyZSBnZXR0aW5nIF9zdGFja1NhdmUgb24gdGhlIFByb21pc2Ugb2JqZWN0LCBpbnN0ZWFkIG9mIHRoZSBpbnN0YW5jZS4gVXNlIC50aGVuKCkgdG8gZ2V0IGNhbGxlZCBiYWNrIHdpdGggdGhlIGluc3RhbmNlLCBzZWUgdGhlIE1PRFVMQVJJWkUgZG9jcyBpbiBzcmMvc2V0dGluZ3MuanNcIik7XG4gIH1cbiB9KTtcbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlW1wicmVhZHlcIl0sIFwiX3N0YWNrU2F2ZVwiLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgc2V0OiBmdW5jdGlvbigpIHtcbiAgIGFib3J0KFwiWW91IGFyZSBzZXR0aW5nIF9zdGFja1NhdmUgb24gdGhlIFByb21pc2Ugb2JqZWN0LCBpbnN0ZWFkIG9mIHRoZSBpbnN0YW5jZS4gVXNlIC50aGVuKCkgdG8gZ2V0IGNhbGxlZCBiYWNrIHdpdGggdGhlIGluc3RhbmNlLCBzZWUgdGhlIE1PRFVMQVJJWkUgZG9jcyBpbiBzcmMvc2V0dGluZ3MuanNcIik7XG4gIH1cbiB9KTtcbn1cblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZVtcInJlYWR5XCJdLCBcIl9zdGFja1Jlc3RvcmVcIikpIHtcbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlW1wicmVhZHlcIl0sIFwiX3N0YWNrUmVzdG9yZVwiLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgIGFib3J0KFwiWW91IGFyZSBnZXR0aW5nIF9zdGFja1Jlc3RvcmUgb24gdGhlIFByb21pc2Ugb2JqZWN0LCBpbnN0ZWFkIG9mIHRoZSBpbnN0YW5jZS4gVXNlIC50aGVuKCkgdG8gZ2V0IGNhbGxlZCBiYWNrIHdpdGggdGhlIGluc3RhbmNlLCBzZWUgdGhlIE1PRFVMQVJJWkUgZG9jcyBpbiBzcmMvc2V0dGluZ3MuanNcIik7XG4gIH1cbiB9KTtcbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlW1wicmVhZHlcIl0sIFwiX3N0YWNrUmVzdG9yZVwiLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgc2V0OiBmdW5jdGlvbigpIHtcbiAgIGFib3J0KFwiWW91IGFyZSBzZXR0aW5nIF9zdGFja1Jlc3RvcmUgb24gdGhlIFByb21pc2Ugb2JqZWN0LCBpbnN0ZWFkIG9mIHRoZSBpbnN0YW5jZS4gVXNlIC50aGVuKCkgdG8gZ2V0IGNhbGxlZCBiYWNrIHdpdGggdGhlIGluc3RhbmNlLCBzZWUgdGhlIE1PRFVMQVJJWkUgZG9jcyBpbiBzcmMvc2V0dGluZ3MuanNcIik7XG4gIH1cbiB9KTtcbn1cblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZVtcInJlYWR5XCJdLCBcIl9zdGFja0FsbG9jXCIpKSB7XG4gT2JqZWN0LmRlZmluZVByb3BlcnR5KE1vZHVsZVtcInJlYWR5XCJdLCBcIl9zdGFja0FsbG9jXCIsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgYWJvcnQoXCJZb3UgYXJlIGdldHRpbmcgX3N0YWNrQWxsb2Mgb24gdGhlIFByb21pc2Ugb2JqZWN0LCBpbnN0ZWFkIG9mIHRoZSBpbnN0YW5jZS4gVXNlIC50aGVuKCkgdG8gZ2V0IGNhbGxlZCBiYWNrIHdpdGggdGhlIGluc3RhbmNlLCBzZWUgdGhlIE1PRFVMQVJJWkUgZG9jcyBpbiBzcmMvc2V0dGluZ3MuanNcIik7XG4gIH1cbiB9KTtcbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlW1wicmVhZHlcIl0sIFwiX3N0YWNrQWxsb2NcIiwge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIHNldDogZnVuY3Rpb24oKSB7XG4gICBhYm9ydChcIllvdSBhcmUgc2V0dGluZyBfc3RhY2tBbGxvYyBvbiB0aGUgUHJvbWlzZSBvYmplY3QsIGluc3RlYWQgb2YgdGhlIGluc3RhbmNlLiBVc2UgLnRoZW4oKSB0byBnZXQgY2FsbGVkIGJhY2sgd2l0aCB0aGUgaW5zdGFuY2UsIHNlZSB0aGUgTU9EVUxBUklaRSBkb2NzIGluIHNyYy9zZXR0aW5ncy5qc1wiKTtcbiAgfVxuIH0pO1xufVxuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlW1wicmVhZHlcIl0sIFwiX19fd2FzbV9jYWxsX2N0b3JzXCIpKSB7XG4gT2JqZWN0LmRlZmluZVByb3BlcnR5KE1vZHVsZVtcInJlYWR5XCJdLCBcIl9fX3dhc21fY2FsbF9jdG9yc1wiLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgIGFib3J0KFwiWW91IGFyZSBnZXR0aW5nIF9fX3dhc21fY2FsbF9jdG9ycyBvbiB0aGUgUHJvbWlzZSBvYmplY3QsIGluc3RlYWQgb2YgdGhlIGluc3RhbmNlLiBVc2UgLnRoZW4oKSB0byBnZXQgY2FsbGVkIGJhY2sgd2l0aCB0aGUgaW5zdGFuY2UsIHNlZSB0aGUgTU9EVUxBUklaRSBkb2NzIGluIHNyYy9zZXR0aW5ncy5qc1wiKTtcbiAgfVxuIH0pO1xuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNb2R1bGVbXCJyZWFkeVwiXSwgXCJfX193YXNtX2NhbGxfY3RvcnNcIiwge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIHNldDogZnVuY3Rpb24oKSB7XG4gICBhYm9ydChcIllvdSBhcmUgc2V0dGluZyBfX193YXNtX2NhbGxfY3RvcnMgb24gdGhlIFByb21pc2Ugb2JqZWN0LCBpbnN0ZWFkIG9mIHRoZSBpbnN0YW5jZS4gVXNlIC50aGVuKCkgdG8gZ2V0IGNhbGxlZCBiYWNrIHdpdGggdGhlIGluc3RhbmNlLCBzZWUgdGhlIE1PRFVMQVJJWkUgZG9jcyBpbiBzcmMvc2V0dGluZ3MuanNcIik7XG4gIH1cbiB9KTtcbn1cblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZVtcInJlYWR5XCJdLCBcIl9mZmx1c2hcIikpIHtcbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlW1wicmVhZHlcIl0sIFwiX2ZmbHVzaFwiLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgIGFib3J0KFwiWW91IGFyZSBnZXR0aW5nIF9mZmx1c2ggb24gdGhlIFByb21pc2Ugb2JqZWN0LCBpbnN0ZWFkIG9mIHRoZSBpbnN0YW5jZS4gVXNlIC50aGVuKCkgdG8gZ2V0IGNhbGxlZCBiYWNrIHdpdGggdGhlIGluc3RhbmNlLCBzZWUgdGhlIE1PRFVMQVJJWkUgZG9jcyBpbiBzcmMvc2V0dGluZ3MuanNcIik7XG4gIH1cbiB9KTtcbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlW1wicmVhZHlcIl0sIFwiX2ZmbHVzaFwiLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgc2V0OiBmdW5jdGlvbigpIHtcbiAgIGFib3J0KFwiWW91IGFyZSBzZXR0aW5nIF9mZmx1c2ggb24gdGhlIFByb21pc2Ugb2JqZWN0LCBpbnN0ZWFkIG9mIHRoZSBpbnN0YW5jZS4gVXNlIC50aGVuKCkgdG8gZ2V0IGNhbGxlZCBiYWNrIHdpdGggdGhlIGluc3RhbmNlLCBzZWUgdGhlIE1PRFVMQVJJWkUgZG9jcyBpbiBzcmMvc2V0dGluZ3MuanNcIik7XG4gIH1cbiB9KTtcbn1cblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZVtcInJlYWR5XCJdLCBcIl9fX2Vycm5vX2xvY2F0aW9uXCIpKSB7XG4gT2JqZWN0LmRlZmluZVByb3BlcnR5KE1vZHVsZVtcInJlYWR5XCJdLCBcIl9fX2Vycm5vX2xvY2F0aW9uXCIsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgYWJvcnQoXCJZb3UgYXJlIGdldHRpbmcgX19fZXJybm9fbG9jYXRpb24gb24gdGhlIFByb21pc2Ugb2JqZWN0LCBpbnN0ZWFkIG9mIHRoZSBpbnN0YW5jZS4gVXNlIC50aGVuKCkgdG8gZ2V0IGNhbGxlZCBiYWNrIHdpdGggdGhlIGluc3RhbmNlLCBzZWUgdGhlIE1PRFVMQVJJWkUgZG9jcyBpbiBzcmMvc2V0dGluZ3MuanNcIik7XG4gIH1cbiB9KTtcbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlW1wicmVhZHlcIl0sIFwiX19fZXJybm9fbG9jYXRpb25cIiwge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIHNldDogZnVuY3Rpb24oKSB7XG4gICBhYm9ydChcIllvdSBhcmUgc2V0dGluZyBfX19lcnJub19sb2NhdGlvbiBvbiB0aGUgUHJvbWlzZSBvYmplY3QsIGluc3RlYWQgb2YgdGhlIGluc3RhbmNlLiBVc2UgLnRoZW4oKSB0byBnZXQgY2FsbGVkIGJhY2sgd2l0aCB0aGUgaW5zdGFuY2UsIHNlZSB0aGUgTU9EVUxBUklaRSBkb2NzIGluIHNyYy9zZXR0aW5ncy5qc1wiKTtcbiAgfVxuIH0pO1xufVxuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlW1wicmVhZHlcIl0sIFwiX2Vtc2NyaXB0ZW5fZ2V0X3NicmtfcHRyXCIpKSB7XG4gT2JqZWN0LmRlZmluZVByb3BlcnR5KE1vZHVsZVtcInJlYWR5XCJdLCBcIl9lbXNjcmlwdGVuX2dldF9zYnJrX3B0clwiLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgIGFib3J0KFwiWW91IGFyZSBnZXR0aW5nIF9lbXNjcmlwdGVuX2dldF9zYnJrX3B0ciBvbiB0aGUgUHJvbWlzZSBvYmplY3QsIGluc3RlYWQgb2YgdGhlIGluc3RhbmNlLiBVc2UgLnRoZW4oKSB0byBnZXQgY2FsbGVkIGJhY2sgd2l0aCB0aGUgaW5zdGFuY2UsIHNlZSB0aGUgTU9EVUxBUklaRSBkb2NzIGluIHNyYy9zZXR0aW5ncy5qc1wiKTtcbiAgfVxuIH0pO1xuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNb2R1bGVbXCJyZWFkeVwiXSwgXCJfZW1zY3JpcHRlbl9nZXRfc2Jya19wdHJcIiwge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIHNldDogZnVuY3Rpb24oKSB7XG4gICBhYm9ydChcIllvdSBhcmUgc2V0dGluZyBfZW1zY3JpcHRlbl9nZXRfc2Jya19wdHIgb24gdGhlIFByb21pc2Ugb2JqZWN0LCBpbnN0ZWFkIG9mIHRoZSBpbnN0YW5jZS4gVXNlIC50aGVuKCkgdG8gZ2V0IGNhbGxlZCBiYWNrIHdpdGggdGhlIGluc3RhbmNlLCBzZWUgdGhlIE1PRFVMQVJJWkUgZG9jcyBpbiBzcmMvc2V0dGluZ3MuanNcIik7XG4gIH1cbiB9KTtcbn1cblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZVtcInJlYWR5XCJdLCBcIl9lbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNlXCIpKSB7XG4gT2JqZWN0LmRlZmluZVByb3BlcnR5KE1vZHVsZVtcInJlYWR5XCJdLCBcIl9lbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNlXCIsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgYWJvcnQoXCJZb3UgYXJlIGdldHRpbmcgX2Vtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2Ugb24gdGhlIFByb21pc2Ugb2JqZWN0LCBpbnN0ZWFkIG9mIHRoZSBpbnN0YW5jZS4gVXNlIC50aGVuKCkgdG8gZ2V0IGNhbGxlZCBiYWNrIHdpdGggdGhlIGluc3RhbmNlLCBzZWUgdGhlIE1PRFVMQVJJWkUgZG9jcyBpbiBzcmMvc2V0dGluZ3MuanNcIik7XG4gIH1cbiB9KTtcbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlW1wicmVhZHlcIl0sIFwiX2Vtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2VcIiwge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIHNldDogZnVuY3Rpb24oKSB7XG4gICBhYm9ydChcIllvdSBhcmUgc2V0dGluZyBfZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZSBvbiB0aGUgUHJvbWlzZSBvYmplY3QsIGluc3RlYWQgb2YgdGhlIGluc3RhbmNlLiBVc2UgLnRoZW4oKSB0byBnZXQgY2FsbGVkIGJhY2sgd2l0aCB0aGUgaW5zdGFuY2UsIHNlZSB0aGUgTU9EVUxBUklaRSBkb2NzIGluIHNyYy9zZXR0aW5ncy5qc1wiKTtcbiAgfVxuIH0pO1xufVxuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlW1wicmVhZHlcIl0sIFwiX21hbGxvY1wiKSkge1xuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNb2R1bGVbXCJyZWFkeVwiXSwgXCJfbWFsbG9jXCIsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgYWJvcnQoXCJZb3UgYXJlIGdldHRpbmcgX21hbGxvYyBvbiB0aGUgUHJvbWlzZSBvYmplY3QsIGluc3RlYWQgb2YgdGhlIGluc3RhbmNlLiBVc2UgLnRoZW4oKSB0byBnZXQgY2FsbGVkIGJhY2sgd2l0aCB0aGUgaW5zdGFuY2UsIHNlZSB0aGUgTU9EVUxBUklaRSBkb2NzIGluIHNyYy9zZXR0aW5ncy5qc1wiKTtcbiAgfVxuIH0pO1xuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNb2R1bGVbXCJyZWFkeVwiXSwgXCJfbWFsbG9jXCIsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBzZXQ6IGZ1bmN0aW9uKCkge1xuICAgYWJvcnQoXCJZb3UgYXJlIHNldHRpbmcgX21hbGxvYyBvbiB0aGUgUHJvbWlzZSBvYmplY3QsIGluc3RlYWQgb2YgdGhlIGluc3RhbmNlLiBVc2UgLnRoZW4oKSB0byBnZXQgY2FsbGVkIGJhY2sgd2l0aCB0aGUgaW5zdGFuY2UsIHNlZSB0aGUgTU9EVUxBUklaRSBkb2NzIGluIHNyYy9zZXR0aW5ncy5qc1wiKTtcbiAgfVxuIH0pO1xufVxuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlW1wicmVhZHlcIl0sIFwiX2ZyZWVcIikpIHtcbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlW1wicmVhZHlcIl0sIFwiX2ZyZWVcIiwge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICBhYm9ydChcIllvdSBhcmUgZ2V0dGluZyBfZnJlZSBvbiB0aGUgUHJvbWlzZSBvYmplY3QsIGluc3RlYWQgb2YgdGhlIGluc3RhbmNlLiBVc2UgLnRoZW4oKSB0byBnZXQgY2FsbGVkIGJhY2sgd2l0aCB0aGUgaW5zdGFuY2UsIHNlZSB0aGUgTU9EVUxBUklaRSBkb2NzIGluIHNyYy9zZXR0aW5ncy5qc1wiKTtcbiAgfVxuIH0pO1xuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNb2R1bGVbXCJyZWFkeVwiXSwgXCJfZnJlZVwiLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgc2V0OiBmdW5jdGlvbigpIHtcbiAgIGFib3J0KFwiWW91IGFyZSBzZXR0aW5nIF9mcmVlIG9uIHRoZSBQcm9taXNlIG9iamVjdCwgaW5zdGVhZCBvZiB0aGUgaW5zdGFuY2UuIFVzZSAudGhlbigpIHRvIGdldCBjYWxsZWQgYmFjayB3aXRoIHRoZSBpbnN0YW5jZSwgc2VlIHRoZSBNT0RVTEFSSVpFIGRvY3MgaW4gc3JjL3NldHRpbmdzLmpzXCIpO1xuICB9XG4gfSk7XG59XG5cbmlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihNb2R1bGVbXCJyZWFkeVwiXSwgXCJfc2V0VGhyZXdcIikpIHtcbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlW1wicmVhZHlcIl0sIFwiX3NldFRocmV3XCIsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgYWJvcnQoXCJZb3UgYXJlIGdldHRpbmcgX3NldFRocmV3IG9uIHRoZSBQcm9taXNlIG9iamVjdCwgaW5zdGVhZCBvZiB0aGUgaW5zdGFuY2UuIFVzZSAudGhlbigpIHRvIGdldCBjYWxsZWQgYmFjayB3aXRoIHRoZSBpbnN0YW5jZSwgc2VlIHRoZSBNT0RVTEFSSVpFIGRvY3MgaW4gc3JjL3NldHRpbmdzLmpzXCIpO1xuICB9XG4gfSk7XG4gT2JqZWN0LmRlZmluZVByb3BlcnR5KE1vZHVsZVtcInJlYWR5XCJdLCBcIl9zZXRUaHJld1wiLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgc2V0OiBmdW5jdGlvbigpIHtcbiAgIGFib3J0KFwiWW91IGFyZSBzZXR0aW5nIF9zZXRUaHJldyBvbiB0aGUgUHJvbWlzZSBvYmplY3QsIGluc3RlYWQgb2YgdGhlIGluc3RhbmNlLiBVc2UgLnRoZW4oKSB0byBnZXQgY2FsbGVkIGJhY2sgd2l0aCB0aGUgaW5zdGFuY2UsIHNlZSB0aGUgTU9EVUxBUklaRSBkb2NzIGluIHNyYy9zZXR0aW5ncy5qc1wiKTtcbiAgfVxuIH0pO1xufVxuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlW1wicmVhZHlcIl0sIFwib25SdW50aW1lSW5pdGlhbGl6ZWRcIikpIHtcbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlW1wicmVhZHlcIl0sIFwib25SdW50aW1lSW5pdGlhbGl6ZWRcIiwge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICBhYm9ydChcIllvdSBhcmUgZ2V0dGluZyBvblJ1bnRpbWVJbml0aWFsaXplZCBvbiB0aGUgUHJvbWlzZSBvYmplY3QsIGluc3RlYWQgb2YgdGhlIGluc3RhbmNlLiBVc2UgLnRoZW4oKSB0byBnZXQgY2FsbGVkIGJhY2sgd2l0aCB0aGUgaW5zdGFuY2UsIHNlZSB0aGUgTU9EVUxBUklaRSBkb2NzIGluIHNyYy9zZXR0aW5ncy5qc1wiKTtcbiAgfVxuIH0pO1xuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNb2R1bGVbXCJyZWFkeVwiXSwgXCJvblJ1bnRpbWVJbml0aWFsaXplZFwiLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgc2V0OiBmdW5jdGlvbigpIHtcbiAgIGFib3J0KFwiWW91IGFyZSBzZXR0aW5nIG9uUnVudGltZUluaXRpYWxpemVkIG9uIHRoZSBQcm9taXNlIG9iamVjdCwgaW5zdGVhZCBvZiB0aGUgaW5zdGFuY2UuIFVzZSAudGhlbigpIHRvIGdldCBjYWxsZWQgYmFjayB3aXRoIHRoZSBpbnN0YW5jZSwgc2VlIHRoZSBNT0RVTEFSSVpFIGRvY3MgaW4gc3JjL3NldHRpbmdzLmpzXCIpO1xuICB9XG4gfSk7XG59XG5cbnZhciBtb2R1bGVPdmVycmlkZXMgPSB7fTtcblxudmFyIGtleTtcblxuZm9yIChrZXkgaW4gTW9kdWxlKSB7XG4gaWYgKE1vZHVsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gIG1vZHVsZU92ZXJyaWRlc1trZXldID0gTW9kdWxlW2tleV07XG4gfVxufVxuXG52YXIgYXJndW1lbnRzXyA9IFtdO1xuXG52YXIgdGhpc1Byb2dyYW0gPSBcIi4vdGhpcy5wcm9ncmFtXCI7XG5cbnZhciBxdWl0XyA9IGZ1bmN0aW9uKHN0YXR1cywgdG9UaHJvdykge1xuIHRocm93IHRvVGhyb3c7XG59O1xuXG52YXIgRU5WSVJPTk1FTlRfSVNfV0VCID0gZmFsc2U7XG5cbnZhciBFTlZJUk9OTUVOVF9JU19XT1JLRVIgPSBmYWxzZTtcblxudmFyIEVOVklST05NRU5UX0lTX05PREUgPSBmYWxzZTtcblxudmFyIEVOVklST05NRU5UX0lTX1NIRUxMID0gZmFsc2U7XG5cbkVOVklST05NRU5UX0lTX1dFQiA9IHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCI7XG5cbkVOVklST05NRU5UX0lTX1dPUktFUiA9IHR5cGVvZiBpbXBvcnRTY3JpcHRzID09PSBcImZ1bmN0aW9uXCI7XG5cbkVOVklST05NRU5UX0lTX05PREUgPSB0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgcHJvY2Vzcy52ZXJzaW9ucyA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgcHJvY2Vzcy52ZXJzaW9ucy5ub2RlID09PSBcInN0cmluZ1wiO1xuXG5FTlZJUk9OTUVOVF9JU19TSEVMTCA9ICFFTlZJUk9OTUVOVF9JU19XRUIgJiYgIUVOVklST05NRU5UX0lTX05PREUgJiYgIUVOVklST05NRU5UX0lTX1dPUktFUjtcblxuaWYgKE1vZHVsZVtcIkVOVklST05NRU5UXCJdKSB7XG4gdGhyb3cgbmV3IEVycm9yKFwiTW9kdWxlLkVOVklST05NRU5UIGhhcyBiZWVuIGRlcHJlY2F0ZWQuIFRvIGZvcmNlIHRoZSBlbnZpcm9ubWVudCwgdXNlIHRoZSBFTlZJUk9OTUVOVCBjb21waWxlLXRpbWUgb3B0aW9uIChmb3IgZXhhbXBsZSwgLXMgRU5WSVJPTk1FTlQ9d2ViIG9yIC1zIEVOVklST05NRU5UPW5vZGUpXCIpO1xufVxuXG52YXIgc2NyaXB0RGlyZWN0b3J5ID0gXCJcIjtcblxuZnVuY3Rpb24gbG9jYXRlRmlsZShwYXRoKSB7XG4gaWYgKE1vZHVsZVtcImxvY2F0ZUZpbGVcIl0pIHtcbiAgcmV0dXJuIE1vZHVsZVtcImxvY2F0ZUZpbGVcIl0ocGF0aCwgc2NyaXB0RGlyZWN0b3J5KTtcbiB9XG4gcmV0dXJuIHNjcmlwdERpcmVjdG9yeSArIHBhdGg7XG59XG5cbnZhciByZWFkXywgcmVhZEFzeW5jLCByZWFkQmluYXJ5LCBzZXRXaW5kb3dUaXRsZTtcblxudmFyIG5vZGVGUztcblxudmFyIG5vZGVQYXRoO1xuXG5pZiAoRU5WSVJPTk1FTlRfSVNfTk9ERSkge1xuIGlmIChFTlZJUk9OTUVOVF9JU19XT1JLRVIpIHtcbiAgc2NyaXB0RGlyZWN0b3J5ID0gcmVxdWlyZShcInBhdGhcIikuZGlybmFtZShzY3JpcHREaXJlY3RvcnkpICsgXCIvXCI7XG4gfSBlbHNlIHtcbiAgc2NyaXB0RGlyZWN0b3J5ID0gX19kaXJuYW1lICsgXCIvXCI7XG4gfVxuIHJlYWRfID0gZnVuY3Rpb24gc2hlbGxfcmVhZChmaWxlbmFtZSwgYmluYXJ5KSB7XG4gIGlmICghbm9kZUZTKSBub2RlRlMgPSByZXF1aXJlKFwiZnNcIik7XG4gIGlmICghbm9kZVBhdGgpIG5vZGVQYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG4gIGZpbGVuYW1lID0gbm9kZVBhdGhbXCJub3JtYWxpemVcIl0oZmlsZW5hbWUpO1xuICByZXR1cm4gbm9kZUZTW1wicmVhZEZpbGVTeW5jXCJdKGZpbGVuYW1lLCBiaW5hcnkgPyBudWxsIDogXCJ1dGY4XCIpO1xuIH07XG4gcmVhZEJpbmFyeSA9IGZ1bmN0aW9uIHJlYWRCaW5hcnkoZmlsZW5hbWUpIHtcbiAgdmFyIHJldCA9IHJlYWRfKGZpbGVuYW1lLCB0cnVlKTtcbiAgaWYgKCFyZXQuYnVmZmVyKSB7XG4gICByZXQgPSBuZXcgVWludDhBcnJheShyZXQpO1xuICB9XG4gIGFzc2VydChyZXQuYnVmZmVyKTtcbiAgcmV0dXJuIHJldDtcbiB9O1xuIGlmIChwcm9jZXNzW1wiYXJndlwiXS5sZW5ndGggPiAxKSB7XG4gIHRoaXNQcm9ncmFtID0gcHJvY2Vzc1tcImFyZ3ZcIl1bMV0ucmVwbGFjZSgvXFxcXC9nLCBcIi9cIik7XG4gfVxuIGFyZ3VtZW50c18gPSBwcm9jZXNzW1wiYXJndlwiXS5zbGljZSgyKTtcbiBwcm9jZXNzW1wib25cIl0oXCJ1bmNhdWdodEV4Y2VwdGlvblwiLCBmdW5jdGlvbihleCkge1xuICBpZiAoIShleCBpbnN0YW5jZW9mIEV4aXRTdGF0dXMpKSB7XG4gICB0aHJvdyBleDtcbiAgfVxuIH0pO1xuIHByb2Nlc3NbXCJvblwiXShcInVuaGFuZGxlZFJlamVjdGlvblwiLCBhYm9ydCk7XG4gcXVpdF8gPSBmdW5jdGlvbihzdGF0dXMpIHtcbiAgcHJvY2Vzc1tcImV4aXRcIl0oc3RhdHVzKTtcbiB9O1xuIE1vZHVsZVtcImluc3BlY3RcIl0gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFwiW0Vtc2NyaXB0ZW4gTW9kdWxlIG9iamVjdF1cIjtcbiB9O1xufSBlbHNlIGlmIChFTlZJUk9OTUVOVF9JU19TSEVMTCkge1xuIGlmICh0eXBlb2YgcmVhZCAhPSBcInVuZGVmaW5lZFwiKSB7XG4gIHJlYWRfID0gZnVuY3Rpb24gc2hlbGxfcmVhZChmKSB7XG4gICByZXR1cm4gcmVhZChmKTtcbiAgfTtcbiB9XG4gcmVhZEJpbmFyeSA9IGZ1bmN0aW9uIHJlYWRCaW5hcnkoZikge1xuICB2YXIgZGF0YTtcbiAgaWYgKHR5cGVvZiByZWFkYnVmZmVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgIHJldHVybiBuZXcgVWludDhBcnJheShyZWFkYnVmZmVyKGYpKTtcbiAgfVxuICBkYXRhID0gcmVhZChmLCBcImJpbmFyeVwiKTtcbiAgYXNzZXJ0KHR5cGVvZiBkYXRhID09PSBcIm9iamVjdFwiKTtcbiAgcmV0dXJuIGRhdGE7XG4gfTtcbiBpZiAodHlwZW9mIHNjcmlwdEFyZ3MgIT0gXCJ1bmRlZmluZWRcIikge1xuICBhcmd1bWVudHNfID0gc2NyaXB0QXJncztcbiB9IGVsc2UgaWYgKHR5cGVvZiBhcmd1bWVudHMgIT0gXCJ1bmRlZmluZWRcIikge1xuICBhcmd1bWVudHNfID0gYXJndW1lbnRzO1xuIH1cbiBpZiAodHlwZW9mIHF1aXQgPT09IFwiZnVuY3Rpb25cIikge1xuICBxdWl0XyA9IGZ1bmN0aW9uKHN0YXR1cykge1xuICAgcXVpdChzdGF0dXMpO1xuICB9O1xuIH1cbiBpZiAodHlwZW9mIHByaW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIGlmICh0eXBlb2YgY29uc29sZSA9PT0gXCJ1bmRlZmluZWRcIikgY29uc29sZSA9IHt9O1xuICBjb25zb2xlLmxvZyA9IHByaW50O1xuICBjb25zb2xlLndhcm4gPSBjb25zb2xlLmVycm9yID0gdHlwZW9mIHByaW50RXJyICE9PSBcInVuZGVmaW5lZFwiID8gcHJpbnRFcnIgOiBwcmludDtcbiB9XG59IGVsc2UgaWYgKEVOVklST05NRU5UX0lTX1dFQiB8fCBFTlZJUk9OTUVOVF9JU19XT1JLRVIpIHtcbiBpZiAoRU5WSVJPTk1FTlRfSVNfV09SS0VSKSB7XG4gIHNjcmlwdERpcmVjdG9yeSA9IHNlbGYubG9jYXRpb24uaHJlZjtcbiB9IGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudC5jdXJyZW50U2NyaXB0KSB7XG4gIHNjcmlwdERpcmVjdG9yeSA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuIH1cbiBpZiAoX3NjcmlwdERpcikge1xuICBzY3JpcHREaXJlY3RvcnkgPSBfc2NyaXB0RGlyO1xuIH1cbiBpZiAoc2NyaXB0RGlyZWN0b3J5LmluZGV4T2YoXCJibG9iOlwiKSAhPT0gMCkge1xuICBzY3JpcHREaXJlY3RvcnkgPSBzY3JpcHREaXJlY3Rvcnkuc3Vic3RyKDAsIHNjcmlwdERpcmVjdG9yeS5sYXN0SW5kZXhPZihcIi9cIikgKyAxKTtcbiB9IGVsc2Uge1xuICBzY3JpcHREaXJlY3RvcnkgPSBcIlwiO1xuIH1cbiB7XG4gIHJlYWRfID0gZnVuY3Rpb24gc2hlbGxfcmVhZCh1cmwpIHtcbiAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgIHhoci5vcGVuKFwiR0VUXCIsIHVybCwgZmFsc2UpO1xuICAgeGhyLnNlbmQobnVsbCk7XG4gICByZXR1cm4geGhyLnJlc3BvbnNlVGV4dDtcbiAgfTtcbiAgaWYgKEVOVklST05NRU5UX0lTX1dPUktFUikge1xuICAgcmVhZEJpbmFyeSA9IGZ1bmN0aW9uIHJlYWRCaW5hcnkodXJsKSB7XG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKFwiR0VUXCIsIHVybCwgZmFsc2UpO1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSBcImFycmF5YnVmZmVyXCI7XG4gICAgeGhyLnNlbmQobnVsbCk7XG4gICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KHhoci5yZXNwb25zZSk7XG4gICB9O1xuICB9XG4gIHJlYWRBc3luYyA9IGZ1bmN0aW9uIHJlYWRBc3luYyh1cmwsIG9ubG9hZCwgb25lcnJvcikge1xuICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgeGhyLm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKTtcbiAgIHhoci5yZXNwb25zZVR5cGUgPSBcImFycmF5YnVmZmVyXCI7XG4gICB4aHIub25sb2FkID0gZnVuY3Rpb24geGhyX29ubG9hZCgpIHtcbiAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDAgfHwgeGhyLnN0YXR1cyA9PSAwICYmIHhoci5yZXNwb25zZSkge1xuICAgICBvbmxvYWQoeGhyLnJlc3BvbnNlKTtcbiAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvbmVycm9yKCk7XG4gICB9O1xuICAgeGhyLm9uZXJyb3IgPSBvbmVycm9yO1xuICAgeGhyLnNlbmQobnVsbCk7XG4gIH07XG4gfVxuIHNldFdpbmRvd1RpdGxlID0gZnVuY3Rpb24odGl0bGUpIHtcbiAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcbiB9O1xufSBlbHNlIHtcbiB0aHJvdyBuZXcgRXJyb3IoXCJlbnZpcm9ubWVudCBkZXRlY3Rpb24gZXJyb3JcIik7XG59XG5cbnZhciBvdXQgPSBNb2R1bGVbXCJwcmludFwiXSB8fCBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xuXG52YXIgZXJyID0gTW9kdWxlW1wicHJpbnRFcnJcIl0gfHwgY29uc29sZS53YXJuLmJpbmQoY29uc29sZSk7XG5cbmZvciAoa2V5IGluIG1vZHVsZU92ZXJyaWRlcykge1xuIGlmIChtb2R1bGVPdmVycmlkZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICBNb2R1bGVba2V5XSA9IG1vZHVsZU92ZXJyaWRlc1trZXldO1xuIH1cbn1cblxubW9kdWxlT3ZlcnJpZGVzID0gbnVsbDtcblxuaWYgKE1vZHVsZVtcImFyZ3VtZW50c1wiXSkgYXJndW1lbnRzXyA9IE1vZHVsZVtcImFyZ3VtZW50c1wiXTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJhcmd1bWVudHNcIikpIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNb2R1bGUsIFwiYXJndW1lbnRzXCIsIHtcbiBjb25maWd1cmFibGU6IHRydWUsXG4gZ2V0OiBmdW5jdGlvbigpIHtcbiAgYWJvcnQoXCJNb2R1bGUuYXJndW1lbnRzIGhhcyBiZWVuIHJlcGxhY2VkIHdpdGggcGxhaW4gYXJndW1lbnRzXyAodGhlIGluaXRpYWwgdmFsdWUgY2FuIGJlIHByb3ZpZGVkIG9uIE1vZHVsZSwgYnV0IGFmdGVyIHN0YXJ0dXAgdGhlIHZhbHVlIGlzIG9ubHkgbG9va2VkIGZvciBvbiBhIGxvY2FsIHZhcmlhYmxlIG9mIHRoYXQgbmFtZSlcIik7XG4gfVxufSk7XG5cbmlmIChNb2R1bGVbXCJ0aGlzUHJvZ3JhbVwiXSkgdGhpc1Byb2dyYW0gPSBNb2R1bGVbXCJ0aGlzUHJvZ3JhbVwiXTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJ0aGlzUHJvZ3JhbVwiKSkgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1vZHVsZSwgXCJ0aGlzUHJvZ3JhbVwiLCB7XG4gY29uZmlndXJhYmxlOiB0cnVlLFxuIGdldDogZnVuY3Rpb24oKSB7XG4gIGFib3J0KFwiTW9kdWxlLnRoaXNQcm9ncmFtIGhhcyBiZWVuIHJlcGxhY2VkIHdpdGggcGxhaW4gdGhpc1Byb2dyYW0gKHRoZSBpbml0aWFsIHZhbHVlIGNhbiBiZSBwcm92aWRlZCBvbiBNb2R1bGUsIGJ1dCBhZnRlciBzdGFydHVwIHRoZSB2YWx1ZSBpcyBvbmx5IGxvb2tlZCBmb3Igb24gYSBsb2NhbCB2YXJpYWJsZSBvZiB0aGF0IG5hbWUpXCIpO1xuIH1cbn0pO1xuXG5pZiAoTW9kdWxlW1wicXVpdFwiXSkgcXVpdF8gPSBNb2R1bGVbXCJxdWl0XCJdO1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInF1aXRcIikpIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNb2R1bGUsIFwicXVpdFwiLCB7XG4gY29uZmlndXJhYmxlOiB0cnVlLFxuIGdldDogZnVuY3Rpb24oKSB7XG4gIGFib3J0KFwiTW9kdWxlLnF1aXQgaGFzIGJlZW4gcmVwbGFjZWQgd2l0aCBwbGFpbiBxdWl0XyAodGhlIGluaXRpYWwgdmFsdWUgY2FuIGJlIHByb3ZpZGVkIG9uIE1vZHVsZSwgYnV0IGFmdGVyIHN0YXJ0dXAgdGhlIHZhbHVlIGlzIG9ubHkgbG9va2VkIGZvciBvbiBhIGxvY2FsIHZhcmlhYmxlIG9mIHRoYXQgbmFtZSlcIik7XG4gfVxufSk7XG5cbmFzc2VydCh0eXBlb2YgTW9kdWxlW1wibWVtb3J5SW5pdGlhbGl6ZXJQcmVmaXhVUkxcIl0gPT09IFwidW5kZWZpbmVkXCIsIFwiTW9kdWxlLm1lbW9yeUluaXRpYWxpemVyUHJlZml4VVJMIG9wdGlvbiB3YXMgcmVtb3ZlZCwgdXNlIE1vZHVsZS5sb2NhdGVGaWxlIGluc3RlYWRcIik7XG5cbmFzc2VydCh0eXBlb2YgTW9kdWxlW1wicHRocmVhZE1haW5QcmVmaXhVUkxcIl0gPT09IFwidW5kZWZpbmVkXCIsIFwiTW9kdWxlLnB0aHJlYWRNYWluUHJlZml4VVJMIG9wdGlvbiB3YXMgcmVtb3ZlZCwgdXNlIE1vZHVsZS5sb2NhdGVGaWxlIGluc3RlYWRcIik7XG5cbmFzc2VydCh0eXBlb2YgTW9kdWxlW1wiY2RJbml0aWFsaXplclByZWZpeFVSTFwiXSA9PT0gXCJ1bmRlZmluZWRcIiwgXCJNb2R1bGUuY2RJbml0aWFsaXplclByZWZpeFVSTCBvcHRpb24gd2FzIHJlbW92ZWQsIHVzZSBNb2R1bGUubG9jYXRlRmlsZSBpbnN0ZWFkXCIpO1xuXG5hc3NlcnQodHlwZW9mIE1vZHVsZVtcImZpbGVQYWNrYWdlUHJlZml4VVJMXCJdID09PSBcInVuZGVmaW5lZFwiLCBcIk1vZHVsZS5maWxlUGFja2FnZVByZWZpeFVSTCBvcHRpb24gd2FzIHJlbW92ZWQsIHVzZSBNb2R1bGUubG9jYXRlRmlsZSBpbnN0ZWFkXCIpO1xuXG5hc3NlcnQodHlwZW9mIE1vZHVsZVtcInJlYWRcIl0gPT09IFwidW5kZWZpbmVkXCIsIFwiTW9kdWxlLnJlYWQgb3B0aW9uIHdhcyByZW1vdmVkIChtb2RpZnkgcmVhZF8gaW4gSlMpXCIpO1xuXG5hc3NlcnQodHlwZW9mIE1vZHVsZVtcInJlYWRBc3luY1wiXSA9PT0gXCJ1bmRlZmluZWRcIiwgXCJNb2R1bGUucmVhZEFzeW5jIG9wdGlvbiB3YXMgcmVtb3ZlZCAobW9kaWZ5IHJlYWRBc3luYyBpbiBKUylcIik7XG5cbmFzc2VydCh0eXBlb2YgTW9kdWxlW1wicmVhZEJpbmFyeVwiXSA9PT0gXCJ1bmRlZmluZWRcIiwgXCJNb2R1bGUucmVhZEJpbmFyeSBvcHRpb24gd2FzIHJlbW92ZWQgKG1vZGlmeSByZWFkQmluYXJ5IGluIEpTKVwiKTtcblxuYXNzZXJ0KHR5cGVvZiBNb2R1bGVbXCJzZXRXaW5kb3dUaXRsZVwiXSA9PT0gXCJ1bmRlZmluZWRcIiwgXCJNb2R1bGUuc2V0V2luZG93VGl0bGUgb3B0aW9uIHdhcyByZW1vdmVkIChtb2RpZnkgc2V0V2luZG93VGl0bGUgaW4gSlMpXCIpO1xuXG5hc3NlcnQodHlwZW9mIE1vZHVsZVtcIlRPVEFMX01FTU9SWVwiXSA9PT0gXCJ1bmRlZmluZWRcIiwgXCJNb2R1bGUuVE9UQUxfTUVNT1JZIGhhcyBiZWVuIHJlbmFtZWQgTW9kdWxlLklOSVRJQUxfTUVNT1JZXCIpO1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInJlYWRcIikpIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNb2R1bGUsIFwicmVhZFwiLCB7XG4gY29uZmlndXJhYmxlOiB0cnVlLFxuIGdldDogZnVuY3Rpb24oKSB7XG4gIGFib3J0KFwiTW9kdWxlLnJlYWQgaGFzIGJlZW4gcmVwbGFjZWQgd2l0aCBwbGFpbiByZWFkXyAodGhlIGluaXRpYWwgdmFsdWUgY2FuIGJlIHByb3ZpZGVkIG9uIE1vZHVsZSwgYnV0IGFmdGVyIHN0YXJ0dXAgdGhlIHZhbHVlIGlzIG9ubHkgbG9va2VkIGZvciBvbiBhIGxvY2FsIHZhcmlhYmxlIG9mIHRoYXQgbmFtZSlcIik7XG4gfVxufSk7XG5cbmlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihNb2R1bGUsIFwicmVhZEFzeW5jXCIpKSBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlLCBcInJlYWRBc3luY1wiLCB7XG4gY29uZmlndXJhYmxlOiB0cnVlLFxuIGdldDogZnVuY3Rpb24oKSB7XG4gIGFib3J0KFwiTW9kdWxlLnJlYWRBc3luYyBoYXMgYmVlbiByZXBsYWNlZCB3aXRoIHBsYWluIHJlYWRBc3luYyAodGhlIGluaXRpYWwgdmFsdWUgY2FuIGJlIHByb3ZpZGVkIG9uIE1vZHVsZSwgYnV0IGFmdGVyIHN0YXJ0dXAgdGhlIHZhbHVlIGlzIG9ubHkgbG9va2VkIGZvciBvbiBhIGxvY2FsIHZhcmlhYmxlIG9mIHRoYXQgbmFtZSlcIik7XG4gfVxufSk7XG5cbmlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihNb2R1bGUsIFwicmVhZEJpbmFyeVwiKSkgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1vZHVsZSwgXCJyZWFkQmluYXJ5XCIsIHtcbiBjb25maWd1cmFibGU6IHRydWUsXG4gZ2V0OiBmdW5jdGlvbigpIHtcbiAgYWJvcnQoXCJNb2R1bGUucmVhZEJpbmFyeSBoYXMgYmVlbiByZXBsYWNlZCB3aXRoIHBsYWluIHJlYWRCaW5hcnkgKHRoZSBpbml0aWFsIHZhbHVlIGNhbiBiZSBwcm92aWRlZCBvbiBNb2R1bGUsIGJ1dCBhZnRlciBzdGFydHVwIHRoZSB2YWx1ZSBpcyBvbmx5IGxvb2tlZCBmb3Igb24gYSBsb2NhbCB2YXJpYWJsZSBvZiB0aGF0IG5hbWUpXCIpO1xuIH1cbn0pO1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInNldFdpbmRvd1RpdGxlXCIpKSBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlLCBcInNldFdpbmRvd1RpdGxlXCIsIHtcbiBjb25maWd1cmFibGU6IHRydWUsXG4gZ2V0OiBmdW5jdGlvbigpIHtcbiAgYWJvcnQoXCJNb2R1bGUuc2V0V2luZG93VGl0bGUgaGFzIGJlZW4gcmVwbGFjZWQgd2l0aCBwbGFpbiBzZXRXaW5kb3dUaXRsZSAodGhlIGluaXRpYWwgdmFsdWUgY2FuIGJlIHByb3ZpZGVkIG9uIE1vZHVsZSwgYnV0IGFmdGVyIHN0YXJ0dXAgdGhlIHZhbHVlIGlzIG9ubHkgbG9va2VkIGZvciBvbiBhIGxvY2FsIHZhcmlhYmxlIG9mIHRoYXQgbmFtZSlcIik7XG4gfVxufSk7XG5cbnZhciBJREJGUyA9IFwiSURCRlMgaXMgbm8gbG9uZ2VyIGluY2x1ZGVkIGJ5IGRlZmF1bHQ7IGJ1aWxkIHdpdGggLWxpZGJmcy5qc1wiO1xuXG52YXIgUFJPWFlGUyA9IFwiUFJPWFlGUyBpcyBubyBsb25nZXIgaW5jbHVkZWQgYnkgZGVmYXVsdDsgYnVpbGQgd2l0aCAtbHByb3h5ZnMuanNcIjtcblxudmFyIFdPUktFUkZTID0gXCJXT1JLRVJGUyBpcyBubyBsb25nZXIgaW5jbHVkZWQgYnkgZGVmYXVsdDsgYnVpbGQgd2l0aCAtbHdvcmtlcmZzLmpzXCI7XG5cbnZhciBOT0RFRlMgPSBcIk5PREVGUyBpcyBubyBsb25nZXIgaW5jbHVkZWQgYnkgZGVmYXVsdDsgYnVpbGQgd2l0aCAtbG5vZGVmcy5qc1wiO1xuXG52YXIgU1RBQ0tfQUxJR04gPSAxNjtcblxuZnVuY3Rpb24gYWxpZ25NZW1vcnkoc2l6ZSwgZmFjdG9yKSB7XG4gaWYgKCFmYWN0b3IpIGZhY3RvciA9IFNUQUNLX0FMSUdOO1xuIHJldHVybiBNYXRoLmNlaWwoc2l6ZSAvIGZhY3RvcikgKiBmYWN0b3I7XG59XG5cbmZ1bmN0aW9uIGdldE5hdGl2ZVR5cGVTaXplKHR5cGUpIHtcbiBzd2l0Y2ggKHR5cGUpIHtcbiBjYXNlIFwiaTFcIjpcbiBjYXNlIFwiaThcIjpcbiAgcmV0dXJuIDE7XG5cbiBjYXNlIFwiaTE2XCI6XG4gIHJldHVybiAyO1xuXG4gY2FzZSBcImkzMlwiOlxuICByZXR1cm4gNDtcblxuIGNhc2UgXCJpNjRcIjpcbiAgcmV0dXJuIDg7XG5cbiBjYXNlIFwiZmxvYXRcIjpcbiAgcmV0dXJuIDQ7XG5cbiBjYXNlIFwiZG91YmxlXCI6XG4gIHJldHVybiA4O1xuXG4gZGVmYXVsdDpcbiAge1xuICAgaWYgKHR5cGVbdHlwZS5sZW5ndGggLSAxXSA9PT0gXCIqXCIpIHtcbiAgICByZXR1cm4gNDtcbiAgIH0gZWxzZSBpZiAodHlwZVswXSA9PT0gXCJpXCIpIHtcbiAgICB2YXIgYml0cyA9IE51bWJlcih0eXBlLnN1YnN0cigxKSk7XG4gICAgYXNzZXJ0KGJpdHMgJSA4ID09PSAwLCBcImdldE5hdGl2ZVR5cGVTaXplIGludmFsaWQgYml0cyBcIiArIGJpdHMgKyBcIiwgdHlwZSBcIiArIHR5cGUpO1xuICAgIHJldHVybiBiaXRzIC8gODtcbiAgIH0gZWxzZSB7XG4gICAgcmV0dXJuIDA7XG4gICB9XG4gIH1cbiB9XG59XG5cbmZ1bmN0aW9uIHdhcm5PbmNlKHRleHQpIHtcbiBpZiAoIXdhcm5PbmNlLnNob3duKSB3YXJuT25jZS5zaG93biA9IHt9O1xuIGlmICghd2Fybk9uY2Uuc2hvd25bdGV4dF0pIHtcbiAgd2Fybk9uY2Uuc2hvd25bdGV4dF0gPSAxO1xuICBlcnIodGV4dCk7XG4gfVxufVxuXG5mdW5jdGlvbiBjb252ZXJ0SnNGdW5jdGlvblRvV2FzbShmdW5jLCBzaWcpIHtcbiBpZiAodHlwZW9mIFdlYkFzc2VtYmx5LkZ1bmN0aW9uID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgdmFyIHR5cGVOYW1lcyA9IHtcbiAgIFwiaVwiOiBcImkzMlwiLFxuICAgXCJqXCI6IFwiaTY0XCIsXG4gICBcImZcIjogXCJmMzJcIixcbiAgIFwiZFwiOiBcImY2NFwiXG4gIH07XG4gIHZhciB0eXBlID0ge1xuICAgcGFyYW1ldGVyczogW10sXG4gICByZXN1bHRzOiBzaWdbMF0gPT0gXCJ2XCIgPyBbXSA6IFsgdHlwZU5hbWVzW3NpZ1swXV0gXVxuICB9O1xuICBmb3IgKHZhciBpID0gMTsgaSA8IHNpZy5sZW5ndGg7ICsraSkge1xuICAgdHlwZS5wYXJhbWV0ZXJzLnB1c2godHlwZU5hbWVzW3NpZ1tpXV0pO1xuICB9XG4gIHJldHVybiBuZXcgV2ViQXNzZW1ibHkuRnVuY3Rpb24odHlwZSwgZnVuYyk7XG4gfVxuIHZhciB0eXBlU2VjdGlvbiA9IFsgMSwgMCwgMSwgOTYgXTtcbiB2YXIgc2lnUmV0ID0gc2lnLnNsaWNlKDAsIDEpO1xuIHZhciBzaWdQYXJhbSA9IHNpZy5zbGljZSgxKTtcbiB2YXIgdHlwZUNvZGVzID0ge1xuICBcImlcIjogMTI3LFxuICBcImpcIjogMTI2LFxuICBcImZcIjogMTI1LFxuICBcImRcIjogMTI0XG4gfTtcbiB0eXBlU2VjdGlvbi5wdXNoKHNpZ1BhcmFtLmxlbmd0aCk7XG4gZm9yICh2YXIgaSA9IDA7IGkgPCBzaWdQYXJhbS5sZW5ndGg7ICsraSkge1xuICB0eXBlU2VjdGlvbi5wdXNoKHR5cGVDb2Rlc1tzaWdQYXJhbVtpXV0pO1xuIH1cbiBpZiAoc2lnUmV0ID09IFwidlwiKSB7XG4gIHR5cGVTZWN0aW9uLnB1c2goMCk7XG4gfSBlbHNlIHtcbiAgdHlwZVNlY3Rpb24gPSB0eXBlU2VjdGlvbi5jb25jYXQoWyAxLCB0eXBlQ29kZXNbc2lnUmV0XSBdKTtcbiB9XG4gdHlwZVNlY3Rpb25bMV0gPSB0eXBlU2VjdGlvbi5sZW5ndGggLSAyO1xuIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KFsgMCwgOTcsIDExNSwgMTA5LCAxLCAwLCAwLCAwIF0uY29uY2F0KHR5cGVTZWN0aW9uLCBbIDIsIDcsIDEsIDEsIDEwMSwgMSwgMTAyLCAwLCAwLCA3LCA1LCAxLCAxLCAxMDIsIDAsIDAgXSkpO1xuIHZhciBtb2R1bGUgPSBuZXcgV2ViQXNzZW1ibHkuTW9kdWxlKGJ5dGVzKTtcbiB2YXIgaW5zdGFuY2UgPSBuZXcgV2ViQXNzZW1ibHkuSW5zdGFuY2UobW9kdWxlLCB7XG4gIFwiZVwiOiB7XG4gICBcImZcIjogZnVuY1xuICB9XG4gfSk7XG4gdmFyIHdyYXBwZWRGdW5jID0gaW5zdGFuY2UuZXhwb3J0c1tcImZcIl07XG4gcmV0dXJuIHdyYXBwZWRGdW5jO1xufVxuXG52YXIgZnJlZVRhYmxlSW5kZXhlcyA9IFtdO1xuXG52YXIgZnVuY3Rpb25zSW5UYWJsZU1hcDtcblxuZnVuY3Rpb24gZ2V0RW1wdHlUYWJsZVNsb3QoKSB7XG4gaWYgKGZyZWVUYWJsZUluZGV4ZXMubGVuZ3RoKSB7XG4gIHJldHVybiBmcmVlVGFibGVJbmRleGVzLnBvcCgpO1xuIH1cbiB0cnkge1xuICB3YXNtVGFibGUuZ3JvdygxKTtcbiB9IGNhdGNoIChlcnIpIHtcbiAgaWYgKCEoZXJyIGluc3RhbmNlb2YgUmFuZ2VFcnJvcikpIHtcbiAgIHRocm93IGVycjtcbiAgfVxuICB0aHJvdyBcIlVuYWJsZSB0byBncm93IHdhc20gdGFibGUuIFNldCBBTExPV19UQUJMRV9HUk9XVEguXCI7XG4gfVxuIHJldHVybiB3YXNtVGFibGUubGVuZ3RoIC0gMTtcbn1cblxuZnVuY3Rpb24gYWRkRnVuY3Rpb25XYXNtKGZ1bmMsIHNpZykge1xuIGlmICghZnVuY3Rpb25zSW5UYWJsZU1hcCkge1xuICBmdW5jdGlvbnNJblRhYmxlTWFwID0gbmV3IFdlYWtNYXAoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB3YXNtVGFibGUubGVuZ3RoOyBpKyspIHtcbiAgIHZhciBpdGVtID0gd2FzbVRhYmxlLmdldChpKTtcbiAgIGlmIChpdGVtKSB7XG4gICAgZnVuY3Rpb25zSW5UYWJsZU1hcC5zZXQoaXRlbSwgaSk7XG4gICB9XG4gIH1cbiB9XG4gaWYgKGZ1bmN0aW9uc0luVGFibGVNYXAuaGFzKGZ1bmMpKSB7XG4gIHJldHVybiBmdW5jdGlvbnNJblRhYmxlTWFwLmdldChmdW5jKTtcbiB9XG4gZm9yICh2YXIgaSA9IDA7IGkgPCB3YXNtVGFibGUubGVuZ3RoOyBpKyspIHtcbiAgYXNzZXJ0KHdhc21UYWJsZS5nZXQoaSkgIT0gZnVuYywgXCJmdW5jdGlvbiBpbiBUYWJsZSBidXQgbm90IGZ1bmN0aW9uc0luVGFibGVNYXBcIik7XG4gfVxuIHZhciByZXQgPSBnZXRFbXB0eVRhYmxlU2xvdCgpO1xuIHRyeSB7XG4gIHdhc21UYWJsZS5zZXQocmV0LCBmdW5jKTtcbiB9IGNhdGNoIChlcnIpIHtcbiAgaWYgKCEoZXJyIGluc3RhbmNlb2YgVHlwZUVycm9yKSkge1xuICAgdGhyb3cgZXJyO1xuICB9XG4gIGFzc2VydCh0eXBlb2Ygc2lnICE9PSBcInVuZGVmaW5lZFwiLCBcIk1pc3Npbmcgc2lnbmF0dXJlIGFyZ3VtZW50IHRvIGFkZEZ1bmN0aW9uOiBcIiArIGZ1bmMpO1xuICB2YXIgd3JhcHBlZCA9IGNvbnZlcnRKc0Z1bmN0aW9uVG9XYXNtKGZ1bmMsIHNpZyk7XG4gIHdhc21UYWJsZS5zZXQocmV0LCB3cmFwcGVkKTtcbiB9XG4gZnVuY3Rpb25zSW5UYWJsZU1hcC5zZXQoZnVuYywgcmV0KTtcbiByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiByZW1vdmVGdW5jdGlvbihpbmRleCkge1xuIGZ1bmN0aW9uc0luVGFibGVNYXAuZGVsZXRlKHdhc21UYWJsZS5nZXQoaW5kZXgpKTtcbiBmcmVlVGFibGVJbmRleGVzLnB1c2goaW5kZXgpO1xufVxuXG5mdW5jdGlvbiBhZGRGdW5jdGlvbihmdW5jLCBzaWcpIHtcbiBhc3NlcnQodHlwZW9mIGZ1bmMgIT09IFwidW5kZWZpbmVkXCIpO1xuIGlmICh0eXBlb2Ygc2lnID09PSBcInVuZGVmaW5lZFwiKSB7XG4gIGVycihcIndhcm5pbmc6IGFkZEZ1bmN0aW9uKCk6IFlvdSBzaG91bGQgcHJvdmlkZSBhIHdhc20gZnVuY3Rpb24gc2lnbmF0dXJlIHN0cmluZyBhcyBhIHNlY29uZCBhcmd1bWVudC4gVGhpcyBpcyBub3QgbmVjZXNzYXJ5IGZvciBhc20uanMgYW5kIGFzbTJ3YXNtLCBidXQgY2FuIGJlIHJlcXVpcmVkIGZvciB0aGUgTExWTSB3YXNtIGJhY2tlbmQsIHNvIGl0IGlzIHJlY29tbWVuZGVkIGZvciBmdWxsIHBvcnRhYmlsaXR5LlwiKTtcbiB9XG4gcmV0dXJuIGFkZEZ1bmN0aW9uV2FzbShmdW5jLCBzaWcpO1xufVxuXG5mdW5jdGlvbiBtYWtlQmlnSW50KGxvdywgaGlnaCwgdW5zaWduZWQpIHtcbiByZXR1cm4gdW5zaWduZWQgPyArKGxvdyA+Pj4gMCkgKyArKGhpZ2ggPj4+IDApICogNDI5NDk2NzI5NiA6ICsobG93ID4+PiAwKSArICsoaGlnaCB8IDApICogNDI5NDk2NzI5Njtcbn1cblxudmFyIHRlbXBSZXQwID0gMDtcblxudmFyIHNldFRlbXBSZXQwID0gZnVuY3Rpb24odmFsdWUpIHtcbiB0ZW1wUmV0MCA9IHZhbHVlO1xufTtcblxudmFyIGdldFRlbXBSZXQwID0gZnVuY3Rpb24oKSB7XG4gcmV0dXJuIHRlbXBSZXQwO1xufTtcblxuZnVuY3Rpb24gZ2V0Q29tcGlsZXJTZXR0aW5nKG5hbWUpIHtcbiB0aHJvdyBcIllvdSBtdXN0IGJ1aWxkIHdpdGggLXMgUkVUQUlOX0NPTVBJTEVSX1NFVFRJTkdTPTEgZm9yIGdldENvbXBpbGVyU2V0dGluZyBvciBlbXNjcmlwdGVuX2dldF9jb21waWxlcl9zZXR0aW5nIHRvIHdvcmtcIjtcbn1cblxudmFyIHdhc21CaW5hcnk7XG5cbmlmIChNb2R1bGVbXCJ3YXNtQmluYXJ5XCJdKSB3YXNtQmluYXJ5ID0gTW9kdWxlW1wid2FzbUJpbmFyeVwiXTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJ3YXNtQmluYXJ5XCIpKSBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlLCBcIndhc21CaW5hcnlcIiwge1xuIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiBnZXQ6IGZ1bmN0aW9uKCkge1xuICBhYm9ydChcIk1vZHVsZS53YXNtQmluYXJ5IGhhcyBiZWVuIHJlcGxhY2VkIHdpdGggcGxhaW4gd2FzbUJpbmFyeSAodGhlIGluaXRpYWwgdmFsdWUgY2FuIGJlIHByb3ZpZGVkIG9uIE1vZHVsZSwgYnV0IGFmdGVyIHN0YXJ0dXAgdGhlIHZhbHVlIGlzIG9ubHkgbG9va2VkIGZvciBvbiBhIGxvY2FsIHZhcmlhYmxlIG9mIHRoYXQgbmFtZSlcIik7XG4gfVxufSk7XG5cbnZhciBub0V4aXRSdW50aW1lO1xuXG5pZiAoTW9kdWxlW1wibm9FeGl0UnVudGltZVwiXSkgbm9FeGl0UnVudGltZSA9IE1vZHVsZVtcIm5vRXhpdFJ1bnRpbWVcIl07XG5cbmlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihNb2R1bGUsIFwibm9FeGl0UnVudGltZVwiKSkgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1vZHVsZSwgXCJub0V4aXRSdW50aW1lXCIsIHtcbiBjb25maWd1cmFibGU6IHRydWUsXG4gZ2V0OiBmdW5jdGlvbigpIHtcbiAgYWJvcnQoXCJNb2R1bGUubm9FeGl0UnVudGltZSBoYXMgYmVlbiByZXBsYWNlZCB3aXRoIHBsYWluIG5vRXhpdFJ1bnRpbWUgKHRoZSBpbml0aWFsIHZhbHVlIGNhbiBiZSBwcm92aWRlZCBvbiBNb2R1bGUsIGJ1dCBhZnRlciBzdGFydHVwIHRoZSB2YWx1ZSBpcyBvbmx5IGxvb2tlZCBmb3Igb24gYSBsb2NhbCB2YXJpYWJsZSBvZiB0aGF0IG5hbWUpXCIpO1xuIH1cbn0pO1xuXG5pZiAodHlwZW9mIFdlYkFzc2VtYmx5ICE9PSBcIm9iamVjdFwiKSB7XG4gYWJvcnQoXCJubyBuYXRpdmUgd2FzbSBzdXBwb3J0IGRldGVjdGVkXCIpO1xufVxuXG5mdW5jdGlvbiBzZXRWYWx1ZShwdHIsIHZhbHVlLCB0eXBlLCBub1NhZmUpIHtcbiB0eXBlID0gdHlwZSB8fCBcImk4XCI7XG4gaWYgKHR5cGUuY2hhckF0KHR5cGUubGVuZ3RoIC0gMSkgPT09IFwiKlwiKSB0eXBlID0gXCJpMzJcIjtcbiBpZiAobm9TYWZlKSB7XG4gIHN3aXRjaCAodHlwZSkge1xuICBjYXNlIFwiaTFcIjpcbiAgIEhFQVA4W3B0ciA+PiAwXSA9IHZhbHVlO1xuICAgYnJlYWs7XG5cbiAgY2FzZSBcImk4XCI6XG4gICBIRUFQOFtwdHIgPj4gMF0gPSB2YWx1ZTtcbiAgIGJyZWFrO1xuXG4gIGNhc2UgXCJpMTZcIjpcbiAgIEhFQVAxNltwdHIgPj4gMV0gPSB2YWx1ZTtcbiAgIGJyZWFrO1xuXG4gIGNhc2UgXCJpMzJcIjpcbiAgIEhFQVAzMltwdHIgPj4gMl0gPSB2YWx1ZTtcbiAgIGJyZWFrO1xuXG4gIGNhc2UgXCJpNjRcIjpcbiAgIHRlbXBJNjQgPSBbIHZhbHVlID4+PiAwLCAodGVtcERvdWJsZSA9IHZhbHVlLCArTWF0aC5hYnModGVtcERvdWJsZSkgPj0gMSA/IHRlbXBEb3VibGUgPiAwID8gKE1hdGgubWluKCtNYXRoLmZsb29yKHRlbXBEb3VibGUgLyA0Mjk0OTY3Mjk2KSwgNDI5NDk2NzI5NSkgfCAwKSA+Pj4gMCA6IH5+K01hdGguY2VpbCgodGVtcERvdWJsZSAtICsofn50ZW1wRG91YmxlID4+PiAwKSkgLyA0Mjk0OTY3Mjk2KSA+Pj4gMCA6IDApIF0sIFxuICAgSEVBUDMyW3B0ciA+PiAyXSA9IHRlbXBJNjRbMF0sIEhFQVAzMltwdHIgKyA0ID4+IDJdID0gdGVtcEk2NFsxXTtcbiAgIGJyZWFrO1xuXG4gIGNhc2UgXCJmbG9hdFwiOlxuICAgSEVBUEYzMltwdHIgPj4gMl0gPSB2YWx1ZTtcbiAgIGJyZWFrO1xuXG4gIGNhc2UgXCJkb3VibGVcIjpcbiAgIEhFQVBGNjRbcHRyID4+IDNdID0gdmFsdWU7XG4gICBicmVhaztcblxuICBkZWZhdWx0OlxuICAgYWJvcnQoXCJpbnZhbGlkIHR5cGUgZm9yIHNldFZhbHVlOiBcIiArIHR5cGUpO1xuICB9XG4gfSBlbHNlIHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gIGNhc2UgXCJpMVwiOlxuICAgU0FGRV9IRUFQX1NUT1JFKHB0ciB8IDAsIHZhbHVlIHwgMCwgMSk7XG4gICBicmVhaztcblxuICBjYXNlIFwiaThcIjpcbiAgIFNBRkVfSEVBUF9TVE9SRShwdHIgfCAwLCB2YWx1ZSB8IDAsIDEpO1xuICAgYnJlYWs7XG5cbiAgY2FzZSBcImkxNlwiOlxuICAgU0FGRV9IRUFQX1NUT1JFKHB0ciB8IDAsIHZhbHVlIHwgMCwgMik7XG4gICBicmVhaztcblxuICBjYXNlIFwiaTMyXCI6XG4gICBTQUZFX0hFQVBfU1RPUkUocHRyIHwgMCwgdmFsdWUgfCAwLCA0KTtcbiAgIGJyZWFrO1xuXG4gIGNhc2UgXCJpNjRcIjpcbiAgIHRlbXBJNjQgPSBbIHZhbHVlID4+PiAwLCAodGVtcERvdWJsZSA9IHZhbHVlLCArTWF0aC5hYnModGVtcERvdWJsZSkgPj0gMSA/IHRlbXBEb3VibGUgPiAwID8gKE1hdGgubWluKCtNYXRoLmZsb29yKHRlbXBEb3VibGUgLyA0Mjk0OTY3Mjk2KSwgNDI5NDk2NzI5NSkgfCAwKSA+Pj4gMCA6IH5+K01hdGguY2VpbCgodGVtcERvdWJsZSAtICsofn50ZW1wRG91YmxlID4+PiAwKSkgLyA0Mjk0OTY3Mjk2KSA+Pj4gMCA6IDApIF0sIFxuICAgU0FGRV9IRUFQX1NUT1JFKHB0ciB8IDAsIHRlbXBJNjRbMF0gfCAwLCA0KSwgU0FGRV9IRUFQX1NUT1JFKHB0ciArIDQgfCAwLCB0ZW1wSTY0WzFdIHwgMCwgNCk7XG4gICBicmVhaztcblxuICBjYXNlIFwiZmxvYXRcIjpcbiAgIFNBRkVfSEVBUF9TVE9SRV9EKHB0ciB8IDAsIE1hdGguZnJvdW5kKHZhbHVlKSwgNCk7XG4gICBicmVhaztcblxuICBjYXNlIFwiZG91YmxlXCI6XG4gICBTQUZFX0hFQVBfU1RPUkVfRChwdHIgfCAwLCArdmFsdWUsIDgpO1xuICAgYnJlYWs7XG5cbiAgZGVmYXVsdDpcbiAgIGFib3J0KFwiaW52YWxpZCB0eXBlIGZvciBzZXRWYWx1ZTogXCIgKyB0eXBlKTtcbiAgfVxuIH1cbn1cblxuZnVuY3Rpb24gZ2V0VmFsdWUocHRyLCB0eXBlLCBub1NhZmUpIHtcbiB0eXBlID0gdHlwZSB8fCBcImk4XCI7XG4gaWYgKHR5cGUuY2hhckF0KHR5cGUubGVuZ3RoIC0gMSkgPT09IFwiKlwiKSB0eXBlID0gXCJpMzJcIjtcbiBpZiAobm9TYWZlKSB7XG4gIHN3aXRjaCAodHlwZSkge1xuICBjYXNlIFwiaTFcIjpcbiAgIHJldHVybiBIRUFQOFtwdHIgPj4gMF07XG5cbiAgY2FzZSBcImk4XCI6XG4gICByZXR1cm4gSEVBUDhbcHRyID4+IDBdO1xuXG4gIGNhc2UgXCJpMTZcIjpcbiAgIHJldHVybiBIRUFQMTZbcHRyID4+IDFdO1xuXG4gIGNhc2UgXCJpMzJcIjpcbiAgIHJldHVybiBIRUFQMzJbcHRyID4+IDJdO1xuXG4gIGNhc2UgXCJpNjRcIjpcbiAgIHJldHVybiBIRUFQMzJbcHRyID4+IDJdO1xuXG4gIGNhc2UgXCJmbG9hdFwiOlxuICAgcmV0dXJuIEhFQVBGMzJbcHRyID4+IDJdO1xuXG4gIGNhc2UgXCJkb3VibGVcIjpcbiAgIHJldHVybiBIRUFQRjY0W3B0ciA+PiAzXTtcblxuICBkZWZhdWx0OlxuICAgYWJvcnQoXCJpbnZhbGlkIHR5cGUgZm9yIGdldFZhbHVlOiBcIiArIHR5cGUpO1xuICB9XG4gfSBlbHNlIHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gIGNhc2UgXCJpMVwiOlxuICAgcmV0dXJuIFNBRkVfSEVBUF9MT0FEKHB0ciB8IDAsIDEsIDApIHwgMDtcblxuICBjYXNlIFwiaThcIjpcbiAgIHJldHVybiBTQUZFX0hFQVBfTE9BRChwdHIgfCAwLCAxLCAwKSB8IDA7XG5cbiAgY2FzZSBcImkxNlwiOlxuICAgcmV0dXJuIFNBRkVfSEVBUF9MT0FEKHB0ciB8IDAsIDIsIDApIHwgMDtcblxuICBjYXNlIFwiaTMyXCI6XG4gICByZXR1cm4gU0FGRV9IRUFQX0xPQUQocHRyIHwgMCwgNCwgMCkgfCAwO1xuXG4gIGNhc2UgXCJpNjRcIjpcbiAgIHJldHVybiBTQUZFX0hFQVBfTE9BRChwdHIgfCAwLCA4LCAwKSB8IDA7XG5cbiAgY2FzZSBcImZsb2F0XCI6XG4gICByZXR1cm4gTWF0aC5mcm91bmQoU0FGRV9IRUFQX0xPQURfRChwdHIgfCAwLCA0LCAwKSk7XG5cbiAgY2FzZSBcImRvdWJsZVwiOlxuICAgcmV0dXJuICtTQUZFX0hFQVBfTE9BRF9EKHB0ciB8IDAsIDgsIDApO1xuXG4gIGRlZmF1bHQ6XG4gICBhYm9ydChcImludmFsaWQgdHlwZSBmb3IgZ2V0VmFsdWU6IFwiICsgdHlwZSk7XG4gIH1cbiB9XG4gcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGdldFNhZmVIZWFwVHlwZShieXRlcywgaXNGbG9hdCkge1xuIHN3aXRjaCAoYnl0ZXMpIHtcbiBjYXNlIDE6XG4gIHJldHVybiBcImk4XCI7XG5cbiBjYXNlIDI6XG4gIHJldHVybiBcImkxNlwiO1xuXG4gY2FzZSA0OlxuICByZXR1cm4gaXNGbG9hdCA/IFwiZmxvYXRcIiA6IFwiaTMyXCI7XG5cbiBjYXNlIDg6XG4gIHJldHVybiBcImRvdWJsZVwiO1xuXG4gZGVmYXVsdDpcbiAgYXNzZXJ0KDApO1xuIH1cbn1cblxuZnVuY3Rpb24gU0FGRV9IRUFQX1NUT1JFKGRlc3QsIHZhbHVlLCBieXRlcywgaXNGbG9hdCkge1xuIGlmIChkZXN0IDw9IDApIGFib3J0KFwic2VnbWVudGF0aW9uIGZhdWx0IHN0b3JpbmcgXCIgKyBieXRlcyArIFwiIGJ5dGVzIHRvIGFkZHJlc3MgXCIgKyBkZXN0KTtcbiBpZiAoZGVzdCAlIGJ5dGVzICE9PSAwKSBhYm9ydChcImFsaWdubWVudCBlcnJvciBzdG9yaW5nIHRvIGFkZHJlc3MgXCIgKyBkZXN0ICsgXCIsIHdoaWNoIHdhcyBleHBlY3RlZCB0byBiZSBhbGlnbmVkIHRvIGEgbXVsdGlwbGUgb2YgXCIgKyBieXRlcyk7XG4gaWYgKHJ1bnRpbWVJbml0aWFsaXplZCkge1xuICB2YXIgYnJrID0gX3NicmsoKSA+Pj4gMDtcbiAgaWYgKGRlc3QgKyBieXRlcyA+IGJyaykgYWJvcnQoXCJzZWdtZW50YXRpb24gZmF1bHQsIGV4Y2VlZGVkIHRoZSB0b3Agb2YgdGhlIGF2YWlsYWJsZSBkeW5hbWljIGhlYXAgd2hlbiBzdG9yaW5nIFwiICsgYnl0ZXMgKyBcIiBieXRlcyB0byBhZGRyZXNzIFwiICsgZGVzdCArIFwiLiBEWU5BTUlDVE9QPVwiICsgYnJrKTtcbiAgYXNzZXJ0KGJyayA+PSBfZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZSgpKTtcbiAgYXNzZXJ0KGJyayA8PSBIRUFQOC5sZW5ndGgpO1xuIH1cbiBzZXRWYWx1ZShkZXN0LCB2YWx1ZSwgZ2V0U2FmZUhlYXBUeXBlKGJ5dGVzLCBpc0Zsb2F0KSwgMSk7XG4gcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBTQUZFX0hFQVBfU1RPUkVfRChkZXN0LCB2YWx1ZSwgYnl0ZXMpIHtcbiByZXR1cm4gU0FGRV9IRUFQX1NUT1JFKGRlc3QsIHZhbHVlLCBieXRlcywgdHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIFNBRkVfSEVBUF9MT0FEKGRlc3QsIGJ5dGVzLCB1bnNpZ25lZCwgaXNGbG9hdCkge1xuIGlmIChkZXN0IDw9IDApIGFib3J0KFwic2VnbWVudGF0aW9uIGZhdWx0IGxvYWRpbmcgXCIgKyBieXRlcyArIFwiIGJ5dGVzIGZyb20gYWRkcmVzcyBcIiArIGRlc3QpO1xuIGlmIChkZXN0ICUgYnl0ZXMgIT09IDApIGFib3J0KFwiYWxpZ25tZW50IGVycm9yIGxvYWRpbmcgZnJvbSBhZGRyZXNzIFwiICsgZGVzdCArIFwiLCB3aGljaCB3YXMgZXhwZWN0ZWQgdG8gYmUgYWxpZ25lZCB0byBhIG11bHRpcGxlIG9mIFwiICsgYnl0ZXMpO1xuIGlmIChydW50aW1lSW5pdGlhbGl6ZWQpIHtcbiAgdmFyIGJyayA9IF9zYnJrKCkgPj4+IDA7XG4gIGlmIChkZXN0ICsgYnl0ZXMgPiBicmspIGFib3J0KFwic2VnbWVudGF0aW9uIGZhdWx0LCBleGNlZWRlZCB0aGUgdG9wIG9mIHRoZSBhdmFpbGFibGUgZHluYW1pYyBoZWFwIHdoZW4gbG9hZGluZyBcIiArIGJ5dGVzICsgXCIgYnl0ZXMgZnJvbSBhZGRyZXNzIFwiICsgZGVzdCArIFwiLiBEWU5BTUlDVE9QPVwiICsgYnJrKTtcbiAgYXNzZXJ0KGJyayA+PSBfZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZSgpKTtcbiAgYXNzZXJ0KGJyayA8PSBIRUFQOC5sZW5ndGgpO1xuIH1cbiB2YXIgdHlwZSA9IGdldFNhZmVIZWFwVHlwZShieXRlcywgaXNGbG9hdCk7XG4gdmFyIHJldCA9IGdldFZhbHVlKGRlc3QsIHR5cGUsIDEpO1xuIGlmICh1bnNpZ25lZCkgcmV0ID0gdW5TaWduKHJldCwgcGFyc2VJbnQodHlwZS5zdWJzdHIoMSksIDEwKSk7XG4gcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gU0FGRV9IRUFQX0xPQURfRChkZXN0LCBieXRlcywgdW5zaWduZWQpIHtcbiByZXR1cm4gU0FGRV9IRUFQX0xPQUQoZGVzdCwgYnl0ZXMsIHVuc2lnbmVkLCB0cnVlKTtcbn1cblxuZnVuY3Rpb24gU0FGRV9GVF9NQVNLKHZhbHVlLCBtYXNrKSB7XG4gdmFyIHJldCA9IHZhbHVlICYgbWFzaztcbiBpZiAocmV0ICE9PSB2YWx1ZSkge1xuICBhYm9ydChcIkZ1bmN0aW9uIHRhYmxlIG1hc2sgZXJyb3I6IGZ1bmN0aW9uIHBvaW50ZXIgaXMgXCIgKyB2YWx1ZSArIFwiIHdoaWNoIGlzIG1hc2tlZCBieSBcIiArIG1hc2sgKyBcIiwgdGhlIGxpa2VseSBjYXVzZSBvZiB0aGlzIGlzIHRoYXQgdGhlIGZ1bmN0aW9uIHBvaW50ZXIgaXMgYmVpbmcgY2FsbGVkIGJ5IHRoZSB3cm9uZyB0eXBlLlwiKTtcbiB9XG4gcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gc2VnZmF1bHQoKSB7XG4gYWJvcnQoXCJzZWdtZW50YXRpb24gZmF1bHRcIik7XG59XG5cbmZ1bmN0aW9uIGFsaWduZmF1bHQoKSB7XG4gYWJvcnQoXCJhbGlnbm1lbnQgZmF1bHRcIik7XG59XG5cbmZ1bmN0aW9uIGZ0ZmF1bHQoKSB7XG4gYWJvcnQoXCJGdW5jdGlvbiB0YWJsZSBtYXNrIGVycm9yXCIpO1xufVxuXG52YXIgd2FzbU1lbW9yeTtcblxudmFyIEFCT1JUID0gZmFsc2U7XG5cbnZhciBFWElUU1RBVFVTO1xuXG5mdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uLCB0ZXh0KSB7XG4gaWYgKCFjb25kaXRpb24pIHtcbiAgYWJvcnQoXCJBc3NlcnRpb24gZmFpbGVkOiBcIiArIHRleHQpO1xuIH1cbn1cblxuZnVuY3Rpb24gZ2V0Q0Z1bmMoaWRlbnQpIHtcbiB2YXIgZnVuYyA9IE1vZHVsZVtcIl9cIiArIGlkZW50XTtcbiBhc3NlcnQoZnVuYywgXCJDYW5ub3QgY2FsbCB1bmtub3duIGZ1bmN0aW9uIFwiICsgaWRlbnQgKyBcIiwgbWFrZSBzdXJlIGl0IGlzIGV4cG9ydGVkXCIpO1xuIHJldHVybiBmdW5jO1xufVxuXG5mdW5jdGlvbiBjY2FsbChpZGVudCwgcmV0dXJuVHlwZSwgYXJnVHlwZXMsIGFyZ3MsIG9wdHMpIHtcbiB2YXIgdG9DID0ge1xuICBcInN0cmluZ1wiOiBmdW5jdGlvbihzdHIpIHtcbiAgIHZhciByZXQgPSAwO1xuICAgaWYgKHN0ciAhPT0gbnVsbCAmJiBzdHIgIT09IHVuZGVmaW5lZCAmJiBzdHIgIT09IDApIHtcbiAgICB2YXIgbGVuID0gKHN0ci5sZW5ndGggPDwgMikgKyAxO1xuICAgIHJldCA9IHN0YWNrQWxsb2MobGVuKTtcbiAgICBzdHJpbmdUb1VURjgoc3RyLCByZXQsIGxlbik7XG4gICB9XG4gICByZXR1cm4gcmV0O1xuICB9LFxuICBcImFycmF5XCI6IGZ1bmN0aW9uKGFycikge1xuICAgdmFyIHJldCA9IHN0YWNrQWxsb2MoYXJyLmxlbmd0aCk7XG4gICB3cml0ZUFycmF5VG9NZW1vcnkoYXJyLCByZXQpO1xuICAgcmV0dXJuIHJldDtcbiAgfVxuIH07XG4gZnVuY3Rpb24gY29udmVydFJldHVyblZhbHVlKHJldCkge1xuICBpZiAocmV0dXJuVHlwZSA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIFVURjhUb1N0cmluZyhyZXQpO1xuICBpZiAocmV0dXJuVHlwZSA9PT0gXCJib29sZWFuXCIpIHJldHVybiBCb29sZWFuKHJldCk7XG4gIHJldHVybiByZXQ7XG4gfVxuIHZhciBmdW5jID0gZ2V0Q0Z1bmMoaWRlbnQpO1xuIHZhciBjQXJncyA9IFtdO1xuIHZhciBzdGFjayA9IDA7XG4gYXNzZXJ0KHJldHVyblR5cGUgIT09IFwiYXJyYXlcIiwgJ1JldHVybiB0eXBlIHNob3VsZCBub3QgYmUgXCJhcnJheVwiLicpO1xuIGlmIChhcmdzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgdmFyIGNvbnZlcnRlciA9IHRvQ1thcmdUeXBlc1tpXV07XG4gICBpZiAoY29udmVydGVyKSB7XG4gICAgaWYgKHN0YWNrID09PSAwKSBzdGFjayA9IHN0YWNrU2F2ZSgpO1xuICAgIGNBcmdzW2ldID0gY29udmVydGVyKGFyZ3NbaV0pO1xuICAgfSBlbHNlIHtcbiAgICBjQXJnc1tpXSA9IGFyZ3NbaV07XG4gICB9XG4gIH1cbiB9XG4gdmFyIHJldCA9IGZ1bmMuYXBwbHkobnVsbCwgY0FyZ3MpO1xuIHJldCA9IGNvbnZlcnRSZXR1cm5WYWx1ZShyZXQpO1xuIGlmIChzdGFjayAhPT0gMCkgc3RhY2tSZXN0b3JlKHN0YWNrKTtcbiByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBjd3JhcChpZGVudCwgcmV0dXJuVHlwZSwgYXJnVHlwZXMsIG9wdHMpIHtcbiByZXR1cm4gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBjY2FsbChpZGVudCwgcmV0dXJuVHlwZSwgYXJnVHlwZXMsIGFyZ3VtZW50cywgb3B0cyk7XG4gfTtcbn1cblxudmFyIEFMTE9DX05PUk1BTCA9IDA7XG5cbnZhciBBTExPQ19TVEFDSyA9IDE7XG5cbmZ1bmN0aW9uIGFsbG9jYXRlKHNsYWIsIGFsbG9jYXRvcikge1xuIHZhciByZXQ7XG4gYXNzZXJ0KHR5cGVvZiBhbGxvY2F0b3IgPT09IFwibnVtYmVyXCIsIFwiYWxsb2NhdGUgbm8gbG9uZ2VyIHRha2VzIGEgdHlwZSBhcmd1bWVudFwiKTtcbiBhc3NlcnQodHlwZW9mIHNsYWIgIT09IFwibnVtYmVyXCIsIFwiYWxsb2NhdGUgbm8gbG9uZ2VyIHRha2VzIGEgbnVtYmVyIGFzIGFyZzBcIik7XG4gaWYgKGFsbG9jYXRvciA9PSBBTExPQ19TVEFDSykge1xuICByZXQgPSBzdGFja0FsbG9jKHNsYWIubGVuZ3RoKTtcbiB9IGVsc2Uge1xuICByZXQgPSBfbWFsbG9jKHNsYWIubGVuZ3RoKTtcbiB9XG4gaWYgKHNsYWIuc3ViYXJyYXkgfHwgc2xhYi5zbGljZSkge1xuICBIRUFQVTguc2V0KHNsYWIsIHJldCk7XG4gfSBlbHNlIHtcbiAgSEVBUFU4LnNldChuZXcgVWludDhBcnJheShzbGFiKSwgcmV0KTtcbiB9XG4gcmV0dXJuIHJldDtcbn1cblxudmFyIFVURjhEZWNvZGVyID0gdHlwZW9mIFRleHREZWNvZGVyICE9PSBcInVuZGVmaW5lZFwiID8gbmV3IFRleHREZWNvZGVyKFwidXRmOFwiKSA6IHVuZGVmaW5lZDtcblxuZnVuY3Rpb24gVVRGOEFycmF5VG9TdHJpbmcoaGVhcCwgaWR4LCBtYXhCeXRlc1RvUmVhZCkge1xuIHZhciBlbmRJZHggPSBpZHggKyBtYXhCeXRlc1RvUmVhZDtcbiB2YXIgZW5kUHRyID0gaWR4O1xuIHdoaWxlIChoZWFwW2VuZFB0cl0gJiYgIShlbmRQdHIgPj0gZW5kSWR4KSkgKytlbmRQdHI7XG4gaWYgKGVuZFB0ciAtIGlkeCA+IDE2ICYmIGhlYXAuc3ViYXJyYXkgJiYgVVRGOERlY29kZXIpIHtcbiAgcmV0dXJuIFVURjhEZWNvZGVyLmRlY29kZShoZWFwLnN1YmFycmF5KGlkeCwgZW5kUHRyKSk7XG4gfSBlbHNlIHtcbiAgdmFyIHN0ciA9IFwiXCI7XG4gIHdoaWxlIChpZHggPCBlbmRQdHIpIHtcbiAgIHZhciB1MCA9IGhlYXBbaWR4KytdO1xuICAgaWYgKCEodTAgJiAxMjgpKSB7XG4gICAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUodTApO1xuICAgIGNvbnRpbnVlO1xuICAgfVxuICAgdmFyIHUxID0gaGVhcFtpZHgrK10gJiA2MztcbiAgIGlmICgodTAgJiAyMjQpID09IDE5Mikge1xuICAgIHN0ciArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCh1MCAmIDMxKSA8PCA2IHwgdTEpO1xuICAgIGNvbnRpbnVlO1xuICAgfVxuICAgdmFyIHUyID0gaGVhcFtpZHgrK10gJiA2MztcbiAgIGlmICgodTAgJiAyNDApID09IDIyNCkge1xuICAgIHUwID0gKHUwICYgMTUpIDw8IDEyIHwgdTEgPDwgNiB8IHUyO1xuICAgfSBlbHNlIHtcbiAgICBpZiAoKHUwICYgMjQ4KSAhPSAyNDApIHdhcm5PbmNlKFwiSW52YWxpZCBVVEYtOCBsZWFkaW5nIGJ5dGUgMHhcIiArIHUwLnRvU3RyaW5nKDE2KSArIFwiIGVuY291bnRlcmVkIHdoZW4gZGVzZXJpYWxpemluZyBhIFVURi04IHN0cmluZyBvbiB0aGUgYXNtLmpzL3dhc20gaGVhcCB0byBhIEpTIHN0cmluZyFcIik7XG4gICAgdTAgPSAodTAgJiA3KSA8PCAxOCB8IHUxIDw8IDEyIHwgdTIgPDwgNiB8IGhlYXBbaWR4KytdICYgNjM7XG4gICB9XG4gICBpZiAodTAgPCA2NTUzNikge1xuICAgIHN0ciArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHUwKTtcbiAgIH0gZWxzZSB7XG4gICAgdmFyIGNoID0gdTAgLSA2NTUzNjtcbiAgICBzdHIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSg1NTI5NiB8IGNoID4+IDEwLCA1NjMyMCB8IGNoICYgMTAyMyk7XG4gICB9XG4gIH1cbiB9XG4gcmV0dXJuIHN0cjtcbn1cblxuZnVuY3Rpb24gVVRGOFRvU3RyaW5nKHB0ciwgbWF4Qnl0ZXNUb1JlYWQpIHtcbiByZXR1cm4gcHRyID8gVVRGOEFycmF5VG9TdHJpbmcoSEVBUFU4LCBwdHIsIG1heEJ5dGVzVG9SZWFkKSA6IFwiXCI7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ1RvVVRGOEFycmF5KHN0ciwgaGVhcCwgb3V0SWR4LCBtYXhCeXRlc1RvV3JpdGUpIHtcbiBpZiAoIShtYXhCeXRlc1RvV3JpdGUgPiAwKSkgcmV0dXJuIDA7XG4gdmFyIHN0YXJ0SWR4ID0gb3V0SWR4O1xuIHZhciBlbmRJZHggPSBvdXRJZHggKyBtYXhCeXRlc1RvV3JpdGUgLSAxO1xuIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gIHZhciB1ID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gIGlmICh1ID49IDU1Mjk2ICYmIHUgPD0gNTczNDMpIHtcbiAgIHZhciB1MSA9IHN0ci5jaGFyQ29kZUF0KCsraSk7XG4gICB1ID0gNjU1MzYgKyAoKHUgJiAxMDIzKSA8PCAxMCkgfCB1MSAmIDEwMjM7XG4gIH1cbiAgaWYgKHUgPD0gMTI3KSB7XG4gICBpZiAob3V0SWR4ID49IGVuZElkeCkgYnJlYWs7XG4gICBoZWFwW291dElkeCsrXSA9IHU7XG4gIH0gZWxzZSBpZiAodSA8PSAyMDQ3KSB7XG4gICBpZiAob3V0SWR4ICsgMSA+PSBlbmRJZHgpIGJyZWFrO1xuICAgaGVhcFtvdXRJZHgrK10gPSAxOTIgfCB1ID4+IDY7XG4gICBoZWFwW291dElkeCsrXSA9IDEyOCB8IHUgJiA2MztcbiAgfSBlbHNlIGlmICh1IDw9IDY1NTM1KSB7XG4gICBpZiAob3V0SWR4ICsgMiA+PSBlbmRJZHgpIGJyZWFrO1xuICAgaGVhcFtvdXRJZHgrK10gPSAyMjQgfCB1ID4+IDEyO1xuICAgaGVhcFtvdXRJZHgrK10gPSAxMjggfCB1ID4+IDYgJiA2MztcbiAgIGhlYXBbb3V0SWR4KytdID0gMTI4IHwgdSAmIDYzO1xuICB9IGVsc2Uge1xuICAgaWYgKG91dElkeCArIDMgPj0gZW5kSWR4KSBicmVhaztcbiAgIGlmICh1ID49IDIwOTcxNTIpIHdhcm5PbmNlKFwiSW52YWxpZCBVbmljb2RlIGNvZGUgcG9pbnQgMHhcIiArIHUudG9TdHJpbmcoMTYpICsgXCIgZW5jb3VudGVyZWQgd2hlbiBzZXJpYWxpemluZyBhIEpTIHN0cmluZyB0byBhbiBVVEYtOCBzdHJpbmcgb24gdGhlIGFzbS5qcy93YXNtIGhlYXAhIChWYWxpZCB1bmljb2RlIGNvZGUgcG9pbnRzIHNob3VsZCBiZSBpbiByYW5nZSAwLTB4MUZGRkZGKS5cIik7XG4gICBoZWFwW291dElkeCsrXSA9IDI0MCB8IHUgPj4gMTg7XG4gICBoZWFwW291dElkeCsrXSA9IDEyOCB8IHUgPj4gMTIgJiA2MztcbiAgIGhlYXBbb3V0SWR4KytdID0gMTI4IHwgdSA+PiA2ICYgNjM7XG4gICBoZWFwW291dElkeCsrXSA9IDEyOCB8IHUgJiA2MztcbiAgfVxuIH1cbiBoZWFwW291dElkeF0gPSAwO1xuIHJldHVybiBvdXRJZHggLSBzdGFydElkeDtcbn1cblxuZnVuY3Rpb24gc3RyaW5nVG9VVEY4KHN0ciwgb3V0UHRyLCBtYXhCeXRlc1RvV3JpdGUpIHtcbiBhc3NlcnQodHlwZW9mIG1heEJ5dGVzVG9Xcml0ZSA9PSBcIm51bWJlclwiLCBcInN0cmluZ1RvVVRGOChzdHIsIG91dFB0ciwgbWF4Qnl0ZXNUb1dyaXRlKSBpcyBtaXNzaW5nIHRoZSB0aGlyZCBwYXJhbWV0ZXIgdGhhdCBzcGVjaWZpZXMgdGhlIGxlbmd0aCBvZiB0aGUgb3V0cHV0IGJ1ZmZlciFcIik7XG4gcmV0dXJuIHN0cmluZ1RvVVRGOEFycmF5KHN0ciwgSEVBUFU4LCBvdXRQdHIsIG1heEJ5dGVzVG9Xcml0ZSk7XG59XG5cbmZ1bmN0aW9uIGxlbmd0aEJ5dGVzVVRGOChzdHIpIHtcbiB2YXIgbGVuID0gMDtcbiBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICB2YXIgdSA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICBpZiAodSA+PSA1NTI5NiAmJiB1IDw9IDU3MzQzKSB1ID0gNjU1MzYgKyAoKHUgJiAxMDIzKSA8PCAxMCkgfCBzdHIuY2hhckNvZGVBdCgrK2kpICYgMTAyMztcbiAgaWYgKHUgPD0gMTI3KSArK2xlbjsgZWxzZSBpZiAodSA8PSAyMDQ3KSBsZW4gKz0gMjsgZWxzZSBpZiAodSA8PSA2NTUzNSkgbGVuICs9IDM7IGVsc2UgbGVuICs9IDQ7XG4gfVxuIHJldHVybiBsZW47XG59XG5cbmZ1bmN0aW9uIEFzY2lpVG9TdHJpbmcocHRyKSB7XG4gdmFyIHN0ciA9IFwiXCI7XG4gd2hpbGUgKDEpIHtcbiAgdmFyIGNoID0gU0FGRV9IRUFQX0xPQUQocHRyKysgfCAwLCAxLCAxKSA+Pj4gMDtcbiAgaWYgKCFjaCkgcmV0dXJuIHN0cjtcbiAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2gpO1xuIH1cbn1cblxuZnVuY3Rpb24gc3RyaW5nVG9Bc2NpaShzdHIsIG91dFB0cikge1xuIHJldHVybiB3cml0ZUFzY2lpVG9NZW1vcnkoc3RyLCBvdXRQdHIsIGZhbHNlKTtcbn1cblxudmFyIFVURjE2RGVjb2RlciA9IHR5cGVvZiBUZXh0RGVjb2RlciAhPT0gXCJ1bmRlZmluZWRcIiA/IG5ldyBUZXh0RGVjb2RlcihcInV0Zi0xNmxlXCIpIDogdW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBVVEYxNlRvU3RyaW5nKHB0ciwgbWF4Qnl0ZXNUb1JlYWQpIHtcbiBhc3NlcnQocHRyICUgMiA9PSAwLCBcIlBvaW50ZXIgcGFzc2VkIHRvIFVURjE2VG9TdHJpbmcgbXVzdCBiZSBhbGlnbmVkIHRvIHR3byBieXRlcyFcIik7XG4gdmFyIGVuZFB0ciA9IHB0cjtcbiB2YXIgaWR4ID0gZW5kUHRyID4+IDE7XG4gdmFyIG1heElkeCA9IGlkeCArIG1heEJ5dGVzVG9SZWFkIC8gMjtcbiB3aGlsZSAoIShpZHggPj0gbWF4SWR4KSAmJiBTQUZFX0hFQVBfTE9BRChpZHggKiAyLCAyLCAxKSkgKytpZHg7XG4gZW5kUHRyID0gaWR4IDw8IDE7XG4gaWYgKGVuZFB0ciAtIHB0ciA+IDMyICYmIFVURjE2RGVjb2Rlcikge1xuICByZXR1cm4gVVRGMTZEZWNvZGVyLmRlY29kZShIRUFQVTguc3ViYXJyYXkocHRyLCBlbmRQdHIpKTtcbiB9IGVsc2Uge1xuICB2YXIgc3RyID0gXCJcIjtcbiAgZm9yICh2YXIgaSA9IDA7ICEoaSA+PSBtYXhCeXRlc1RvUmVhZCAvIDIpOyArK2kpIHtcbiAgIHZhciBjb2RlVW5pdCA9IFNBRkVfSEVBUF9MT0FEKHB0ciArIGkgKiAyIHwgMCwgMiwgMCkgfCAwO1xuICAgaWYgKGNvZGVVbml0ID09IDApIGJyZWFrO1xuICAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZVVuaXQpO1xuICB9XG4gIHJldHVybiBzdHI7XG4gfVxufVxuXG5mdW5jdGlvbiBzdHJpbmdUb1VURjE2KHN0ciwgb3V0UHRyLCBtYXhCeXRlc1RvV3JpdGUpIHtcbiBhc3NlcnQob3V0UHRyICUgMiA9PSAwLCBcIlBvaW50ZXIgcGFzc2VkIHRvIHN0cmluZ1RvVVRGMTYgbXVzdCBiZSBhbGlnbmVkIHRvIHR3byBieXRlcyFcIik7XG4gYXNzZXJ0KHR5cGVvZiBtYXhCeXRlc1RvV3JpdGUgPT0gXCJudW1iZXJcIiwgXCJzdHJpbmdUb1VURjE2KHN0ciwgb3V0UHRyLCBtYXhCeXRlc1RvV3JpdGUpIGlzIG1pc3NpbmcgdGhlIHRoaXJkIHBhcmFtZXRlciB0aGF0IHNwZWNpZmllcyB0aGUgbGVuZ3RoIG9mIHRoZSBvdXRwdXQgYnVmZmVyIVwiKTtcbiBpZiAobWF4Qnl0ZXNUb1dyaXRlID09PSB1bmRlZmluZWQpIHtcbiAgbWF4Qnl0ZXNUb1dyaXRlID0gMjE0NzQ4MzY0NztcbiB9XG4gaWYgKG1heEJ5dGVzVG9Xcml0ZSA8IDIpIHJldHVybiAwO1xuIG1heEJ5dGVzVG9Xcml0ZSAtPSAyO1xuIHZhciBzdGFydFB0ciA9IG91dFB0cjtcbiB2YXIgbnVtQ2hhcnNUb1dyaXRlID0gbWF4Qnl0ZXNUb1dyaXRlIDwgc3RyLmxlbmd0aCAqIDIgPyBtYXhCeXRlc1RvV3JpdGUgLyAyIDogc3RyLmxlbmd0aDtcbiBmb3IgKHZhciBpID0gMDsgaSA8IG51bUNoYXJzVG9Xcml0ZTsgKytpKSB7XG4gIHZhciBjb2RlVW5pdCA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICBTQUZFX0hFQVBfU1RPUkUob3V0UHRyIHwgMCwgY29kZVVuaXQgfCAwLCAyKTtcbiAgb3V0UHRyICs9IDI7XG4gfVxuIFNBRkVfSEVBUF9TVE9SRShvdXRQdHIgfCAwLCAwIHwgMCwgMik7XG4gcmV0dXJuIG91dFB0ciAtIHN0YXJ0UHRyO1xufVxuXG5mdW5jdGlvbiBsZW5ndGhCeXRlc1VURjE2KHN0cikge1xuIHJldHVybiBzdHIubGVuZ3RoICogMjtcbn1cblxuZnVuY3Rpb24gVVRGMzJUb1N0cmluZyhwdHIsIG1heEJ5dGVzVG9SZWFkKSB7XG4gYXNzZXJ0KHB0ciAlIDQgPT0gMCwgXCJQb2ludGVyIHBhc3NlZCB0byBVVEYzMlRvU3RyaW5nIG11c3QgYmUgYWxpZ25lZCB0byBmb3VyIGJ5dGVzIVwiKTtcbiB2YXIgaSA9IDA7XG4gdmFyIHN0ciA9IFwiXCI7XG4gd2hpbGUgKCEoaSA+PSBtYXhCeXRlc1RvUmVhZCAvIDQpKSB7XG4gIHZhciB1dGYzMiA9IFNBRkVfSEVBUF9MT0FEKHB0ciArIGkgKiA0IHwgMCwgNCwgMCkgfCAwO1xuICBpZiAodXRmMzIgPT0gMCkgYnJlYWs7XG4gICsraTtcbiAgaWYgKHV0ZjMyID49IDY1NTM2KSB7XG4gICB2YXIgY2ggPSB1dGYzMiAtIDY1NTM2O1xuICAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoNTUyOTYgfCBjaCA+PiAxMCwgNTYzMjAgfCBjaCAmIDEwMjMpO1xuICB9IGVsc2Uge1xuICAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUodXRmMzIpO1xuICB9XG4gfVxuIHJldHVybiBzdHI7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ1RvVVRGMzIoc3RyLCBvdXRQdHIsIG1heEJ5dGVzVG9Xcml0ZSkge1xuIGFzc2VydChvdXRQdHIgJSA0ID09IDAsIFwiUG9pbnRlciBwYXNzZWQgdG8gc3RyaW5nVG9VVEYzMiBtdXN0IGJlIGFsaWduZWQgdG8gZm91ciBieXRlcyFcIik7XG4gYXNzZXJ0KHR5cGVvZiBtYXhCeXRlc1RvV3JpdGUgPT0gXCJudW1iZXJcIiwgXCJzdHJpbmdUb1VURjMyKHN0ciwgb3V0UHRyLCBtYXhCeXRlc1RvV3JpdGUpIGlzIG1pc3NpbmcgdGhlIHRoaXJkIHBhcmFtZXRlciB0aGF0IHNwZWNpZmllcyB0aGUgbGVuZ3RoIG9mIHRoZSBvdXRwdXQgYnVmZmVyIVwiKTtcbiBpZiAobWF4Qnl0ZXNUb1dyaXRlID09PSB1bmRlZmluZWQpIHtcbiAgbWF4Qnl0ZXNUb1dyaXRlID0gMjE0NzQ4MzY0NztcbiB9XG4gaWYgKG1heEJ5dGVzVG9Xcml0ZSA8IDQpIHJldHVybiAwO1xuIHZhciBzdGFydFB0ciA9IG91dFB0cjtcbiB2YXIgZW5kUHRyID0gc3RhcnRQdHIgKyBtYXhCeXRlc1RvV3JpdGUgLSA0O1xuIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gIHZhciBjb2RlVW5pdCA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICBpZiAoY29kZVVuaXQgPj0gNTUyOTYgJiYgY29kZVVuaXQgPD0gNTczNDMpIHtcbiAgIHZhciB0cmFpbFN1cnJvZ2F0ZSA9IHN0ci5jaGFyQ29kZUF0KCsraSk7XG4gICBjb2RlVW5pdCA9IDY1NTM2ICsgKChjb2RlVW5pdCAmIDEwMjMpIDw8IDEwKSB8IHRyYWlsU3Vycm9nYXRlICYgMTAyMztcbiAgfVxuICBTQUZFX0hFQVBfU1RPUkUob3V0UHRyIHwgMCwgY29kZVVuaXQgfCAwLCA0KTtcbiAgb3V0UHRyICs9IDQ7XG4gIGlmIChvdXRQdHIgKyA0ID4gZW5kUHRyKSBicmVhaztcbiB9XG4gU0FGRV9IRUFQX1NUT1JFKG91dFB0ciB8IDAsIDAgfCAwLCA0KTtcbiByZXR1cm4gb3V0UHRyIC0gc3RhcnRQdHI7XG59XG5cbmZ1bmN0aW9uIGxlbmd0aEJ5dGVzVVRGMzIoc3RyKSB7XG4gdmFyIGxlbiA9IDA7XG4gZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgdmFyIGNvZGVVbml0ID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gIGlmIChjb2RlVW5pdCA+PSA1NTI5NiAmJiBjb2RlVW5pdCA8PSA1NzM0MykgKytpO1xuICBsZW4gKz0gNDtcbiB9XG4gcmV0dXJuIGxlbjtcbn1cblxuZnVuY3Rpb24gYWxsb2NhdGVVVEY4KHN0cikge1xuIHZhciBzaXplID0gbGVuZ3RoQnl0ZXNVVEY4KHN0cikgKyAxO1xuIHZhciByZXQgPSBfbWFsbG9jKHNpemUpO1xuIGlmIChyZXQpIHN0cmluZ1RvVVRGOEFycmF5KHN0ciwgSEVBUDgsIHJldCwgc2l6ZSk7XG4gcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gYWxsb2NhdGVVVEY4T25TdGFjayhzdHIpIHtcbiB2YXIgc2l6ZSA9IGxlbmd0aEJ5dGVzVVRGOChzdHIpICsgMTtcbiB2YXIgcmV0ID0gc3RhY2tBbGxvYyhzaXplKTtcbiBzdHJpbmdUb1VURjhBcnJheShzdHIsIEhFQVA4LCByZXQsIHNpemUpO1xuIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIHdyaXRlU3RyaW5nVG9NZW1vcnkoc3RyaW5nLCBidWZmZXIsIGRvbnRBZGROdWxsKSB7XG4gd2Fybk9uY2UoXCJ3cml0ZVN0cmluZ1RvTWVtb3J5IGlzIGRlcHJlY2F0ZWQgYW5kIHNob3VsZCBub3QgYmUgY2FsbGVkISBVc2Ugc3RyaW5nVG9VVEY4KCkgaW5zdGVhZCFcIik7XG4gdmFyIGxhc3RDaGFyLCBlbmQ7XG4gaWYgKGRvbnRBZGROdWxsKSB7XG4gIGVuZCA9IGJ1ZmZlciArIGxlbmd0aEJ5dGVzVVRGOChzdHJpbmcpO1xuICBsYXN0Q2hhciA9IFNBRkVfSEVBUF9MT0FEKGVuZCwgMSwgMCk7XG4gfVxuIHN0cmluZ1RvVVRGOChzdHJpbmcsIGJ1ZmZlciwgSW5maW5pdHkpO1xuIGlmIChkb250QWRkTnVsbCkgU0FGRV9IRUFQX1NUT1JFKGVuZCwgbGFzdENoYXIsIDEpO1xufVxuXG5mdW5jdGlvbiB3cml0ZUFycmF5VG9NZW1vcnkoYXJyYXksIGJ1ZmZlcikge1xuIGFzc2VydChhcnJheS5sZW5ndGggPj0gMCwgXCJ3cml0ZUFycmF5VG9NZW1vcnkgYXJyYXkgbXVzdCBoYXZlIGEgbGVuZ3RoIChzaG91bGQgYmUgYW4gYXJyYXkgb3IgdHlwZWQgYXJyYXkpXCIpO1xuIEhFQVA4LnNldChhcnJheSwgYnVmZmVyKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVBc2NpaVRvTWVtb3J5KHN0ciwgYnVmZmVyLCBkb250QWRkTnVsbCkge1xuIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gIGFzc2VydChzdHIuY2hhckNvZGVBdChpKSA9PT0gc3RyLmNoYXJDb2RlQXQoaSkgJiAyNTUpO1xuICBTQUZFX0hFQVBfU1RPUkUoYnVmZmVyKysgfCAwLCBzdHIuY2hhckNvZGVBdChpKSB8IDAsIDEpO1xuIH1cbiBpZiAoIWRvbnRBZGROdWxsKSBTQUZFX0hFQVBfU1RPUkUoYnVmZmVyIHwgMCwgMCB8IDAsIDEpO1xufVxuXG5mdW5jdGlvbiBhbGlnblVwKHgsIG11bHRpcGxlKSB7XG4gaWYgKHggJSBtdWx0aXBsZSA+IDApIHtcbiAgeCArPSBtdWx0aXBsZSAtIHggJSBtdWx0aXBsZTtcbiB9XG4gcmV0dXJuIHg7XG59XG5cbnZhciBIRUFQLCBidWZmZXIsIEhFQVA4LCBIRUFQVTgsIEhFQVAxNiwgSEVBUFUxNiwgSEVBUDMyLCBIRUFQVTMyLCBIRUFQRjMyLCBIRUFQRjY0O1xuXG5mdW5jdGlvbiB1cGRhdGVHbG9iYWxCdWZmZXJBbmRWaWV3cyhidWYpIHtcbiBidWZmZXIgPSBidWY7XG4gTW9kdWxlW1wiSEVBUDhcIl0gPSBIRUFQOCA9IG5ldyBJbnQ4QXJyYXkoYnVmKTtcbiBNb2R1bGVbXCJIRUFQMTZcIl0gPSBIRUFQMTYgPSBuZXcgSW50MTZBcnJheShidWYpO1xuIE1vZHVsZVtcIkhFQVAzMlwiXSA9IEhFQVAzMiA9IG5ldyBJbnQzMkFycmF5KGJ1Zik7XG4gTW9kdWxlW1wiSEVBUFU4XCJdID0gSEVBUFU4ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKTtcbiBNb2R1bGVbXCJIRUFQVTE2XCJdID0gSEVBUFUxNiA9IG5ldyBVaW50MTZBcnJheShidWYpO1xuIE1vZHVsZVtcIkhFQVBVMzJcIl0gPSBIRUFQVTMyID0gbmV3IFVpbnQzMkFycmF5KGJ1Zik7XG4gTW9kdWxlW1wiSEVBUEYzMlwiXSA9IEhFQVBGMzIgPSBuZXcgRmxvYXQzMkFycmF5KGJ1Zik7XG4gTW9kdWxlW1wiSEVBUEY2NFwiXSA9IEhFQVBGNjQgPSBuZXcgRmxvYXQ2NEFycmF5KGJ1Zik7XG59XG5cbnZhciBUT1RBTF9TVEFDSyA9IDUyNDI4ODA7XG5cbmlmIChNb2R1bGVbXCJUT1RBTF9TVEFDS1wiXSkgYXNzZXJ0KFRPVEFMX1NUQUNLID09PSBNb2R1bGVbXCJUT1RBTF9TVEFDS1wiXSwgXCJ0aGUgc3RhY2sgc2l6ZSBjYW4gbm8gbG9uZ2VyIGJlIGRldGVybWluZWQgYXQgcnVudGltZVwiKTtcblxudmFyIElOSVRJQUxfTUVNT1JZID0gTW9kdWxlW1wiSU5JVElBTF9NRU1PUllcIl0gfHwgMTY3NzcyMTY7XG5cbmlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihNb2R1bGUsIFwiSU5JVElBTF9NRU1PUllcIikpIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNb2R1bGUsIFwiSU5JVElBTF9NRU1PUllcIiwge1xuIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiBnZXQ6IGZ1bmN0aW9uKCkge1xuICBhYm9ydChcIk1vZHVsZS5JTklUSUFMX01FTU9SWSBoYXMgYmVlbiByZXBsYWNlZCB3aXRoIHBsYWluIElOSVRJQUxfTUVNT1JZICh0aGUgaW5pdGlhbCB2YWx1ZSBjYW4gYmUgcHJvdmlkZWQgb24gTW9kdWxlLCBidXQgYWZ0ZXIgc3RhcnR1cCB0aGUgdmFsdWUgaXMgb25seSBsb29rZWQgZm9yIG9uIGEgbG9jYWwgdmFyaWFibGUgb2YgdGhhdCBuYW1lKVwiKTtcbiB9XG59KTtcblxuYXNzZXJ0KElOSVRJQUxfTUVNT1JZID49IFRPVEFMX1NUQUNLLCBcIklOSVRJQUxfTUVNT1JZIHNob3VsZCBiZSBsYXJnZXIgdGhhbiBUT1RBTF9TVEFDSywgd2FzIFwiICsgSU5JVElBTF9NRU1PUlkgKyBcIiEgKFRPVEFMX1NUQUNLPVwiICsgVE9UQUxfU1RBQ0sgKyBcIilcIik7XG5cbmFzc2VydCh0eXBlb2YgSW50MzJBcnJheSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgRmxvYXQ2NEFycmF5ICE9PSBcInVuZGVmaW5lZFwiICYmIEludDMyQXJyYXkucHJvdG90eXBlLnN1YmFycmF5ICE9PSB1bmRlZmluZWQgJiYgSW50MzJBcnJheS5wcm90b3R5cGUuc2V0ICE9PSB1bmRlZmluZWQsIFwiSlMgZW5naW5lIGRvZXMgbm90IHByb3ZpZGUgZnVsbCB0eXBlZCBhcnJheSBzdXBwb3J0XCIpO1xuXG5hc3NlcnQoIU1vZHVsZVtcIndhc21NZW1vcnlcIl0sIFwiVXNlIG9mIGB3YXNtTWVtb3J5YCBkZXRlY3RlZC4gIFVzZSAtcyBJTVBPUlRFRF9NRU1PUlkgdG8gZGVmaW5lIHdhc21NZW1vcnkgZXh0ZXJuYWxseVwiKTtcblxuYXNzZXJ0KElOSVRJQUxfTUVNT1JZID09IDE2Nzc3MjE2LCBcIkRldGVjdGVkIHJ1bnRpbWUgSU5JVElBTF9NRU1PUlkgc2V0dGluZy4gIFVzZSAtcyBJTVBPUlRFRF9NRU1PUlkgdG8gZGVmaW5lIHdhc21NZW1vcnkgZHluYW1pY2FsbHlcIik7XG5cbnZhciB3YXNtVGFibGU7XG5cbmZ1bmN0aW9uIHdyaXRlU3RhY2tDb29raWUoKSB7XG4gdmFyIG1heCA9IF9lbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQoKTtcbiBhc3NlcnQoKG1heCAmIDMpID09IDApO1xuIFNBRkVfSEVBUF9TVE9SRSgoKG1heCA+PiAyKSArIDEpICogNCwgMzQ4MjEyMjMsIDQpO1xuIFNBRkVfSEVBUF9TVE9SRSgoKG1heCA+PiAyKSArIDIpICogNCwgMjMxMDcyMTAyMiwgNCk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrU3RhY2tDb29raWUoKSB7XG4gaWYgKEFCT1JUKSByZXR1cm47XG4gdmFyIG1heCA9IF9lbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQoKTtcbiB2YXIgY29va2llMSA9IFNBRkVfSEVBUF9MT0FEKCgobWF4ID4+IDIpICsgMSkgKiA0LCA0LCAxKTtcbiB2YXIgY29va2llMiA9IFNBRkVfSEVBUF9MT0FEKCgobWF4ID4+IDIpICsgMikgKiA0LCA0LCAxKTtcbiBpZiAoY29va2llMSAhPSAzNDgyMTIyMyB8fCBjb29raWUyICE9IDIzMTA3MjEwMjIpIHtcbiAgYWJvcnQoXCJTdGFjayBvdmVyZmxvdyEgU3RhY2sgY29va2llIGhhcyBiZWVuIG92ZXJ3cml0dGVuLCBleHBlY3RlZCBoZXggZHdvcmRzIDB4ODlCQUNERkUgYW5kIDB4MjEzNTQ2NywgYnV0IHJlY2VpdmVkIDB4XCIgKyBjb29raWUyLnRvU3RyaW5nKDE2KSArIFwiIFwiICsgY29va2llMS50b1N0cmluZygxNikpO1xuIH1cbn1cblxuKGZ1bmN0aW9uKCkge1xuIHZhciBoMTYgPSBuZXcgSW50MTZBcnJheSgxKTtcbiB2YXIgaDggPSBuZXcgSW50OEFycmF5KGgxNi5idWZmZXIpO1xuIGgxNlswXSA9IDI1NDU5O1xuIGlmIChoOFswXSAhPT0gMTE1IHx8IGg4WzFdICE9PSA5OSkgdGhyb3cgXCJSdW50aW1lIGVycm9yOiBleHBlY3RlZCB0aGUgc3lzdGVtIHRvIGJlIGxpdHRsZS1lbmRpYW4hXCI7XG59KSgpO1xuXG5mdW5jdGlvbiBhYm9ydEZuUHRyRXJyb3IocHRyLCBzaWcpIHtcbiB2YXIgcG9zc2libGVTaWcgPSBcIlwiO1xuIGZvciAodmFyIHggaW4gZGVidWdfdGFibGVzKSB7XG4gIHZhciB0YmwgPSBkZWJ1Z190YWJsZXNbeF07XG4gIGlmICh0YmxbcHRyXSkge1xuICAgcG9zc2libGVTaWcgKz0gJ2FzIHNpZyBcIicgKyB4ICsgJ1wiIHBvaW50aW5nIHRvIGZ1bmN0aW9uICcgKyB0YmxbcHRyXSArIFwiLCBcIjtcbiAgfVxuIH1cbiBhYm9ydChcIkludmFsaWQgZnVuY3Rpb24gcG9pbnRlciBcIiArIHB0ciArIFwiIGNhbGxlZCB3aXRoIHNpZ25hdHVyZSAnXCIgKyBzaWcgKyBcIicuIFBlcmhhcHMgdGhpcyBpcyBhbiBpbnZhbGlkIHZhbHVlIChlLmcuIGNhdXNlZCBieSBjYWxsaW5nIGEgdmlydHVhbCBtZXRob2Qgb24gYSBOVUxMIHBvaW50ZXIpPyBPciBjYWxsaW5nIGEgZnVuY3Rpb24gd2l0aCBhbiBpbmNvcnJlY3QgdHlwZSwgd2hpY2ggd2lsbCBmYWlsPyAoaXQgaXMgd29ydGggYnVpbGRpbmcgeW91ciBzb3VyY2UgZmlsZXMgd2l0aCAtV2Vycm9yICh3YXJuaW5ncyBhcmUgZXJyb3JzKSwgYXMgd2FybmluZ3MgY2FuIGluZGljYXRlIHVuZGVmaW5lZCBiZWhhdmlvciB3aGljaCBjYW4gY2F1c2UgdGhpcykuIFRoaXMgcG9pbnRlciBtaWdodCBtYWtlIHNlbnNlIGluIGFub3RoZXIgdHlwZSBzaWduYXR1cmU6IFwiICsgcG9zc2libGVTaWcpO1xufVxuXG52YXIgX19BVFBSRVJVTl9fID0gW107XG5cbnZhciBfX0FUSU5JVF9fID0gW107XG5cbnZhciBfX0FUTUFJTl9fID0gW107XG5cbnZhciBfX0FURVhJVF9fID0gW107XG5cbnZhciBfX0FUUE9TVFJVTl9fID0gW107XG5cbnZhciBydW50aW1lSW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxudmFyIHJ1bnRpbWVFeGl0ZWQgPSBmYWxzZTtcblxuZnVuY3Rpb24gcHJlUnVuKCkge1xuIGlmIChNb2R1bGVbXCJwcmVSdW5cIl0pIHtcbiAgaWYgKHR5cGVvZiBNb2R1bGVbXCJwcmVSdW5cIl0gPT0gXCJmdW5jdGlvblwiKSBNb2R1bGVbXCJwcmVSdW5cIl0gPSBbIE1vZHVsZVtcInByZVJ1blwiXSBdO1xuICB3aGlsZSAoTW9kdWxlW1wicHJlUnVuXCJdLmxlbmd0aCkge1xuICAgYWRkT25QcmVSdW4oTW9kdWxlW1wicHJlUnVuXCJdLnNoaWZ0KCkpO1xuICB9XG4gfVxuIGNhbGxSdW50aW1lQ2FsbGJhY2tzKF9fQVRQUkVSVU5fXyk7XG59XG5cbmZ1bmN0aW9uIGluaXRSdW50aW1lKCkge1xuIGNoZWNrU3RhY2tDb29raWUoKTtcbiBhc3NlcnQoIXJ1bnRpbWVJbml0aWFsaXplZCk7XG4gcnVudGltZUluaXRpYWxpemVkID0gdHJ1ZTtcbiBpZiAoIU1vZHVsZVtcIm5vRlNJbml0XCJdICYmICFGUy5pbml0LmluaXRpYWxpemVkKSBGUy5pbml0KCk7XG4gVFRZLmluaXQoKTtcbiBjYWxsUnVudGltZUNhbGxiYWNrcyhfX0FUSU5JVF9fKTtcbn1cblxuZnVuY3Rpb24gcHJlTWFpbigpIHtcbiBjaGVja1N0YWNrQ29va2llKCk7XG4gRlMuaWdub3JlUGVybWlzc2lvbnMgPSBmYWxzZTtcbiBjYWxsUnVudGltZUNhbGxiYWNrcyhfX0FUTUFJTl9fKTtcbn1cblxuZnVuY3Rpb24gZXhpdFJ1bnRpbWUoKSB7XG4gY2hlY2tTdGFja0Nvb2tpZSgpO1xuIHJ1bnRpbWVFeGl0ZWQgPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBwb3N0UnVuKCkge1xuIGNoZWNrU3RhY2tDb29raWUoKTtcbiBpZiAoTW9kdWxlW1wicG9zdFJ1blwiXSkge1xuICBpZiAodHlwZW9mIE1vZHVsZVtcInBvc3RSdW5cIl0gPT0gXCJmdW5jdGlvblwiKSBNb2R1bGVbXCJwb3N0UnVuXCJdID0gWyBNb2R1bGVbXCJwb3N0UnVuXCJdIF07XG4gIHdoaWxlIChNb2R1bGVbXCJwb3N0UnVuXCJdLmxlbmd0aCkge1xuICAgYWRkT25Qb3N0UnVuKE1vZHVsZVtcInBvc3RSdW5cIl0uc2hpZnQoKSk7XG4gIH1cbiB9XG4gY2FsbFJ1bnRpbWVDYWxsYmFja3MoX19BVFBPU1RSVU5fXyk7XG59XG5cbmZ1bmN0aW9uIGFkZE9uUHJlUnVuKGNiKSB7XG4gX19BVFBSRVJVTl9fLnVuc2hpZnQoY2IpO1xufVxuXG5mdW5jdGlvbiBhZGRPbkluaXQoY2IpIHtcbiBfX0FUSU5JVF9fLnVuc2hpZnQoY2IpO1xufVxuXG5mdW5jdGlvbiBhZGRPblByZU1haW4oY2IpIHtcbiBfX0FUTUFJTl9fLnVuc2hpZnQoY2IpO1xufVxuXG5mdW5jdGlvbiBhZGRPbkV4aXQoY2IpIHt9XG5cbmZ1bmN0aW9uIGFkZE9uUG9zdFJ1bihjYikge1xuIF9fQVRQT1NUUlVOX18udW5zaGlmdChjYik7XG59XG5cbmFzc2VydChNYXRoLmltdWwsIFwiVGhpcyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgTWF0aC5pbXVsKCksIGJ1aWxkIHdpdGggTEVHQUNZX1ZNX1NVUFBPUlQgb3IgUE9MWUZJTExfT0xEX01BVEhfRlVOQ1RJT05TIHRvIGFkZCBpbiBhIHBvbHlmaWxsXCIpO1xuXG5hc3NlcnQoTWF0aC5mcm91bmQsIFwiVGhpcyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgTWF0aC5mcm91bmQoKSwgYnVpbGQgd2l0aCBMRUdBQ1lfVk1fU1VQUE9SVCBvciBQT0xZRklMTF9PTERfTUFUSF9GVU5DVElPTlMgdG8gYWRkIGluIGEgcG9seWZpbGxcIik7XG5cbmFzc2VydChNYXRoLmNsejMyLCBcIlRoaXMgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IE1hdGguY2x6MzIoKSwgYnVpbGQgd2l0aCBMRUdBQ1lfVk1fU1VQUE9SVCBvciBQT0xZRklMTF9PTERfTUFUSF9GVU5DVElPTlMgdG8gYWRkIGluIGEgcG9seWZpbGxcIik7XG5cbmFzc2VydChNYXRoLnRydW5jLCBcIlRoaXMgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IE1hdGgudHJ1bmMoKSwgYnVpbGQgd2l0aCBMRUdBQ1lfVk1fU1VQUE9SVCBvciBQT0xZRklMTF9PTERfTUFUSF9GVU5DVElPTlMgdG8gYWRkIGluIGEgcG9seWZpbGxcIik7XG5cbnZhciBydW5EZXBlbmRlbmNpZXMgPSAwO1xuXG52YXIgcnVuRGVwZW5kZW5jeVdhdGNoZXIgPSBudWxsO1xuXG52YXIgZGVwZW5kZW5jaWVzRnVsZmlsbGVkID0gbnVsbDtcblxudmFyIHJ1bkRlcGVuZGVuY3lUcmFja2luZyA9IHt9O1xuXG5mdW5jdGlvbiBnZXRVbmlxdWVSdW5EZXBlbmRlbmN5KGlkKSB7XG4gdmFyIG9yaWcgPSBpZDtcbiB3aGlsZSAoMSkge1xuICBpZiAoIXJ1bkRlcGVuZGVuY3lUcmFja2luZ1tpZF0pIHJldHVybiBpZDtcbiAgaWQgPSBvcmlnICsgTWF0aC5yYW5kb20oKTtcbiB9XG59XG5cbmZ1bmN0aW9uIGFkZFJ1bkRlcGVuZGVuY3koaWQpIHtcbiBydW5EZXBlbmRlbmNpZXMrKztcbiBpZiAoTW9kdWxlW1wibW9uaXRvclJ1bkRlcGVuZGVuY2llc1wiXSkge1xuICBNb2R1bGVbXCJtb25pdG9yUnVuRGVwZW5kZW5jaWVzXCJdKHJ1bkRlcGVuZGVuY2llcyk7XG4gfVxuIGlmIChpZCkge1xuICBhc3NlcnQoIXJ1bkRlcGVuZGVuY3lUcmFja2luZ1tpZF0pO1xuICBydW5EZXBlbmRlbmN5VHJhY2tpbmdbaWRdID0gMTtcbiAgaWYgKHJ1bkRlcGVuZGVuY3lXYXRjaGVyID09PSBudWxsICYmIHR5cGVvZiBzZXRJbnRlcnZhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgcnVuRGVwZW5kZW5jeVdhdGNoZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICBpZiAoQUJPUlQpIHtcbiAgICAgY2xlYXJJbnRlcnZhbChydW5EZXBlbmRlbmN5V2F0Y2hlcik7XG4gICAgIHJ1bkRlcGVuZGVuY3lXYXRjaGVyID0gbnVsbDtcbiAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgc2hvd24gPSBmYWxzZTtcbiAgICBmb3IgKHZhciBkZXAgaW4gcnVuRGVwZW5kZW5jeVRyYWNraW5nKSB7XG4gICAgIGlmICghc2hvd24pIHtcbiAgICAgIHNob3duID0gdHJ1ZTtcbiAgICAgIGVycihcInN0aWxsIHdhaXRpbmcgb24gcnVuIGRlcGVuZGVuY2llczpcIik7XG4gICAgIH1cbiAgICAgZXJyKFwiZGVwZW5kZW5jeTogXCIgKyBkZXApO1xuICAgIH1cbiAgICBpZiAoc2hvd24pIHtcbiAgICAgZXJyKFwiKGVuZCBvZiBsaXN0KVwiKTtcbiAgICB9XG4gICB9LCAxZTQpO1xuICB9XG4gfSBlbHNlIHtcbiAgZXJyKFwid2FybmluZzogcnVuIGRlcGVuZGVuY3kgYWRkZWQgd2l0aG91dCBJRFwiKTtcbiB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVJ1bkRlcGVuZGVuY3koaWQpIHtcbiBydW5EZXBlbmRlbmNpZXMtLTtcbiBpZiAoTW9kdWxlW1wibW9uaXRvclJ1bkRlcGVuZGVuY2llc1wiXSkge1xuICBNb2R1bGVbXCJtb25pdG9yUnVuRGVwZW5kZW5jaWVzXCJdKHJ1bkRlcGVuZGVuY2llcyk7XG4gfVxuIGlmIChpZCkge1xuICBhc3NlcnQocnVuRGVwZW5kZW5jeVRyYWNraW5nW2lkXSk7XG4gIGRlbGV0ZSBydW5EZXBlbmRlbmN5VHJhY2tpbmdbaWRdO1xuIH0gZWxzZSB7XG4gIGVycihcIndhcm5pbmc6IHJ1biBkZXBlbmRlbmN5IHJlbW92ZWQgd2l0aG91dCBJRFwiKTtcbiB9XG4gaWYgKHJ1bkRlcGVuZGVuY2llcyA9PSAwKSB7XG4gIGlmIChydW5EZXBlbmRlbmN5V2F0Y2hlciAhPT0gbnVsbCkge1xuICAgY2xlYXJJbnRlcnZhbChydW5EZXBlbmRlbmN5V2F0Y2hlcik7XG4gICBydW5EZXBlbmRlbmN5V2F0Y2hlciA9IG51bGw7XG4gIH1cbiAgaWYgKGRlcGVuZGVuY2llc0Z1bGZpbGxlZCkge1xuICAgdmFyIGNhbGxiYWNrID0gZGVwZW5kZW5jaWVzRnVsZmlsbGVkO1xuICAgZGVwZW5kZW5jaWVzRnVsZmlsbGVkID0gbnVsbDtcbiAgIGNhbGxiYWNrKCk7XG4gIH1cbiB9XG59XG5cbk1vZHVsZVtcInByZWxvYWRlZEltYWdlc1wiXSA9IHt9O1xuXG5Nb2R1bGVbXCJwcmVsb2FkZWRBdWRpb3NcIl0gPSB7fTtcblxuZnVuY3Rpb24gYWJvcnQod2hhdCkge1xuIGlmIChNb2R1bGVbXCJvbkFib3J0XCJdKSB7XG4gIE1vZHVsZVtcIm9uQWJvcnRcIl0od2hhdCk7XG4gfVxuIHdoYXQgKz0gXCJcIjtcbiBlcnIod2hhdCk7XG4gQUJPUlQgPSB0cnVlO1xuIEVYSVRTVEFUVVMgPSAxO1xuIHZhciBvdXRwdXQgPSBcImFib3J0KFwiICsgd2hhdCArIFwiKSBhdCBcIiArIHN0YWNrVHJhY2UoKTtcbiB3aGF0ID0gb3V0cHV0O1xuIHZhciBlID0gbmV3IFdlYkFzc2VtYmx5LlJ1bnRpbWVFcnJvcih3aGF0KTtcbiByZWFkeVByb21pc2VSZWplY3QoZSk7XG4gdGhyb3cgZTtcbn1cblxuZnVuY3Rpb24gaGFzUHJlZml4KHN0ciwgcHJlZml4KSB7XG4gcmV0dXJuIFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCA/IHN0ci5zdGFydHNXaXRoKHByZWZpeCkgOiBzdHIuaW5kZXhPZihwcmVmaXgpID09PSAwO1xufVxuXG52YXIgZGF0YVVSSVByZWZpeCA9IFwiZGF0YTphcHBsaWNhdGlvbi9vY3RldC1zdHJlYW07YmFzZTY0LFwiO1xuXG5mdW5jdGlvbiBpc0RhdGFVUkkoZmlsZW5hbWUpIHtcbiByZXR1cm4gaGFzUHJlZml4KGZpbGVuYW1lLCBkYXRhVVJJUHJlZml4KTtcbn1cblxudmFyIGZpbGVVUklQcmVmaXggPSBcImZpbGU6Ly9cIjtcblxuZnVuY3Rpb24gaXNGaWxlVVJJKGZpbGVuYW1lKSB7XG4gcmV0dXJuIGhhc1ByZWZpeChmaWxlbmFtZSwgZmlsZVVSSVByZWZpeCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUV4cG9ydFdyYXBwZXIobmFtZSwgZml4ZWRhc20pIHtcbiByZXR1cm4gZnVuY3Rpb24oKSB7XG4gIHZhciBkaXNwbGF5TmFtZSA9IG5hbWU7XG4gIHZhciBhc20gPSBmaXhlZGFzbTtcbiAgaWYgKCFmaXhlZGFzbSkge1xuICAgYXNtID0gTW9kdWxlW1wiYXNtXCJdO1xuICB9XG4gIGFzc2VydChydW50aW1lSW5pdGlhbGl6ZWQsIFwibmF0aXZlIGZ1bmN0aW9uIGBcIiArIGRpc3BsYXlOYW1lICsgXCJgIGNhbGxlZCBiZWZvcmUgcnVudGltZSBpbml0aWFsaXphdGlvblwiKTtcbiAgYXNzZXJ0KCFydW50aW1lRXhpdGVkLCBcIm5hdGl2ZSBmdW5jdGlvbiBgXCIgKyBkaXNwbGF5TmFtZSArIFwiYCBjYWxsZWQgYWZ0ZXIgcnVudGltZSBleGl0ICh1c2UgTk9fRVhJVF9SVU5USU1FIHRvIGtlZXAgaXQgYWxpdmUgYWZ0ZXIgbWFpbigpIGV4aXRzKVwiKTtcbiAgaWYgKCFhc21bbmFtZV0pIHtcbiAgIGFzc2VydChhc21bbmFtZV0sIFwiZXhwb3J0ZWQgbmF0aXZlIGZ1bmN0aW9uIGBcIiArIGRpc3BsYXlOYW1lICsgXCJgIG5vdCBmb3VuZFwiKTtcbiAgfVxuICByZXR1cm4gYXNtW25hbWVdLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gfTtcbn1cblxudmFyIHdhc21CaW5hcnlGaWxlID0gXCJnYW1lX2NsaWVudC53YXNtXCI7XG5cbmlmICghaXNEYXRhVVJJKHdhc21CaW5hcnlGaWxlKSkge1xuIHdhc21CaW5hcnlGaWxlID0gbG9jYXRlRmlsZSh3YXNtQmluYXJ5RmlsZSk7XG59XG5cbmZ1bmN0aW9uIGdldEJpbmFyeSgpIHtcbiB0cnkge1xuICBpZiAod2FzbUJpbmFyeSkge1xuICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KHdhc21CaW5hcnkpO1xuICB9XG4gIGlmIChyZWFkQmluYXJ5KSB7XG4gICByZXR1cm4gcmVhZEJpbmFyeSh3YXNtQmluYXJ5RmlsZSk7XG4gIH0gZWxzZSB7XG4gICB0aHJvdyBcImJvdGggYXN5bmMgYW5kIHN5bmMgZmV0Y2hpbmcgb2YgdGhlIHdhc20gZmFpbGVkXCI7XG4gIH1cbiB9IGNhdGNoIChlcnIpIHtcbiAgYWJvcnQoZXJyKTtcbiB9XG59XG5cbmZ1bmN0aW9uIGdldEJpbmFyeVByb21pc2UoKSB7XG4gaWYgKCF3YXNtQmluYXJ5ICYmIChFTlZJUk9OTUVOVF9JU19XRUIgfHwgRU5WSVJPTk1FTlRfSVNfV09SS0VSKSAmJiB0eXBlb2YgZmV0Y2ggPT09IFwiZnVuY3Rpb25cIiAmJiAhaXNGaWxlVVJJKHdhc21CaW5hcnlGaWxlKSkge1xuICByZXR1cm4gZmV0Y2god2FzbUJpbmFyeUZpbGUsIHtcbiAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCJcbiAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgaWYgKCFyZXNwb25zZVtcIm9rXCJdKSB7XG4gICAgdGhyb3cgXCJmYWlsZWQgdG8gbG9hZCB3YXNtIGJpbmFyeSBmaWxlIGF0ICdcIiArIHdhc21CaW5hcnlGaWxlICsgXCInXCI7XG4gICB9XG4gICByZXR1cm4gcmVzcG9uc2VbXCJhcnJheUJ1ZmZlclwiXSgpO1xuICB9KS5jYXRjaChmdW5jdGlvbigpIHtcbiAgIHJldHVybiBnZXRCaW5hcnkoKTtcbiAgfSk7XG4gfVxuIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGdldEJpbmFyeSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVdhc20oKSB7XG4gdmFyIGluZm8gPSB7XG4gIFwiZW52XCI6IGFzbUxpYnJhcnlBcmcsXG4gIFwid2FzaV9zbmFwc2hvdF9wcmV2aWV3MVwiOiBhc21MaWJyYXJ5QXJnXG4gfTtcbiBmdW5jdGlvbiByZWNlaXZlSW5zdGFuY2UoaW5zdGFuY2UsIG1vZHVsZSkge1xuICB2YXIgZXhwb3J0cyA9IGluc3RhbmNlLmV4cG9ydHM7XG4gIE1vZHVsZVtcImFzbVwiXSA9IGV4cG9ydHM7XG4gIHdhc21NZW1vcnkgPSBNb2R1bGVbXCJhc21cIl1bXCJtZW1vcnlcIl07XG4gIGFzc2VydCh3YXNtTWVtb3J5LCBcIm1lbW9yeSBub3QgZm91bmQgaW4gd2FzbSBleHBvcnRzXCIpO1xuICB1cGRhdGVHbG9iYWxCdWZmZXJBbmRWaWV3cyh3YXNtTWVtb3J5LmJ1ZmZlcik7XG4gIHdhc21UYWJsZSA9IE1vZHVsZVtcImFzbVwiXVtcIl9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGVcIl07XG4gIGFzc2VydCh3YXNtVGFibGUsIFwidGFibGUgbm90IGZvdW5kIGluIHdhc20gZXhwb3J0c1wiKTtcbiAgcmVtb3ZlUnVuRGVwZW5kZW5jeShcIndhc20taW5zdGFudGlhdGVcIik7XG4gfVxuIGFkZFJ1bkRlcGVuZGVuY3koXCJ3YXNtLWluc3RhbnRpYXRlXCIpO1xuIHZhciB0cnVlTW9kdWxlID0gTW9kdWxlO1xuIGZ1bmN0aW9uIHJlY2VpdmVJbnN0YW50aWF0ZWRTb3VyY2Uob3V0cHV0KSB7XG4gIGFzc2VydChNb2R1bGUgPT09IHRydWVNb2R1bGUsIFwidGhlIE1vZHVsZSBvYmplY3Qgc2hvdWxkIG5vdCBiZSByZXBsYWNlZCBkdXJpbmcgYXN5bmMgY29tcGlsYXRpb24gLSBwZXJoYXBzIHRoZSBvcmRlciBvZiBIVE1MIGVsZW1lbnRzIGlzIHdyb25nP1wiKTtcbiAgdHJ1ZU1vZHVsZSA9IG51bGw7XG4gIHJlY2VpdmVJbnN0YW5jZShvdXRwdXRbXCJpbnN0YW5jZVwiXSk7XG4gfVxuIGZ1bmN0aW9uIGluc3RhbnRpYXRlQXJyYXlCdWZmZXIocmVjZWl2ZXIpIHtcbiAgcmV0dXJuIGdldEJpbmFyeVByb21pc2UoKS50aGVuKGZ1bmN0aW9uKGJpbmFyeSkge1xuICAgcmV0dXJuIFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlKGJpbmFyeSwgaW5mbyk7XG4gIH0pLnRoZW4ocmVjZWl2ZXIsIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgZXJyKFwiZmFpbGVkIHRvIGFzeW5jaHJvbm91c2x5IHByZXBhcmUgd2FzbTogXCIgKyByZWFzb24pO1xuICAgYWJvcnQocmVhc29uKTtcbiAgfSk7XG4gfVxuIGZ1bmN0aW9uIGluc3RhbnRpYXRlQXN5bmMoKSB7XG4gIGlmICghd2FzbUJpbmFyeSAmJiB0eXBlb2YgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGVTdHJlYW1pbmcgPT09IFwiZnVuY3Rpb25cIiAmJiAhaXNEYXRhVVJJKHdhc21CaW5hcnlGaWxlKSAmJiAhaXNGaWxlVVJJKHdhc21CaW5hcnlGaWxlKSAmJiB0eXBlb2YgZmV0Y2ggPT09IFwiZnVuY3Rpb25cIikge1xuICAgcmV0dXJuIGZldGNoKHdhc21CaW5hcnlGaWxlLCB7XG4gICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIlxuICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIHZhciByZXN1bHQgPSBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZVN0cmVhbWluZyhyZXNwb25zZSwgaW5mbyk7XG4gICAgcmV0dXJuIHJlc3VsdC50aGVuKHJlY2VpdmVJbnN0YW50aWF0ZWRTb3VyY2UsIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICBlcnIoXCJ3YXNtIHN0cmVhbWluZyBjb21waWxlIGZhaWxlZDogXCIgKyByZWFzb24pO1xuICAgICBlcnIoXCJmYWxsaW5nIGJhY2sgdG8gQXJyYXlCdWZmZXIgaW5zdGFudGlhdGlvblwiKTtcbiAgICAgcmV0dXJuIGluc3RhbnRpYXRlQXJyYXlCdWZmZXIocmVjZWl2ZUluc3RhbnRpYXRlZFNvdXJjZSk7XG4gICAgfSk7XG4gICB9KTtcbiAgfSBlbHNlIHtcbiAgIHJldHVybiBpbnN0YW50aWF0ZUFycmF5QnVmZmVyKHJlY2VpdmVJbnN0YW50aWF0ZWRTb3VyY2UpO1xuICB9XG4gfVxuIGlmIChNb2R1bGVbXCJpbnN0YW50aWF0ZVdhc21cIl0pIHtcbiAgdHJ5IHtcbiAgIHZhciBleHBvcnRzID0gTW9kdWxlW1wiaW5zdGFudGlhdGVXYXNtXCJdKGluZm8sIHJlY2VpdmVJbnN0YW5jZSk7XG4gICByZXR1cm4gZXhwb3J0cztcbiAgfSBjYXRjaCAoZSkge1xuICAgZXJyKFwiTW9kdWxlLmluc3RhbnRpYXRlV2FzbSBjYWxsYmFjayBmYWlsZWQgd2l0aCBlcnJvcjogXCIgKyBlKTtcbiAgIHJldHVybiBmYWxzZTtcbiAgfVxuIH1cbiBpbnN0YW50aWF0ZUFzeW5jKCkuY2F0Y2gocmVhZHlQcm9taXNlUmVqZWN0KTtcbiByZXR1cm4ge307XG59XG5cbnZhciB0ZW1wRG91YmxlO1xuXG52YXIgdGVtcEk2NDtcblxudmFyIEFTTV9DT05TVFMgPSB7fTtcblxuZnVuY3Rpb24gYWJvcnRTdGFja092ZXJmbG93KGFsbG9jU2l6ZSkge1xuIGFib3J0KFwiU3RhY2sgb3ZlcmZsb3chIEF0dGVtcHRlZCB0byBhbGxvY2F0ZSBcIiArIGFsbG9jU2l6ZSArIFwiIGJ5dGVzIG9uIHRoZSBzdGFjaywgYnV0IHN0YWNrIGhhcyBvbmx5IFwiICsgKF9lbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlKCkgKyBhbGxvY1NpemUpICsgXCIgYnl0ZXMgYXZhaWxhYmxlIVwiKTtcbn1cblxuZnVuY3Rpb24gY2FsbFJ1bnRpbWVDYWxsYmFja3MoY2FsbGJhY2tzKSB7XG4gd2hpbGUgKGNhbGxiYWNrcy5sZW5ndGggPiAwKSB7XG4gIHZhciBjYWxsYmFjayA9IGNhbGxiYWNrcy5zaGlmdCgpO1xuICBpZiAodHlwZW9mIGNhbGxiYWNrID09IFwiZnVuY3Rpb25cIikge1xuICAgY2FsbGJhY2soTW9kdWxlKTtcbiAgIGNvbnRpbnVlO1xuICB9XG4gIHZhciBmdW5jID0gY2FsbGJhY2suZnVuYztcbiAgaWYgKHR5cGVvZiBmdW5jID09PSBcIm51bWJlclwiKSB7XG4gICBpZiAoY2FsbGJhY2suYXJnID09PSB1bmRlZmluZWQpIHtcbiAgICB3YXNtVGFibGUuZ2V0KGZ1bmMpKCk7XG4gICB9IGVsc2Uge1xuICAgIHdhc21UYWJsZS5nZXQoZnVuYykoY2FsbGJhY2suYXJnKTtcbiAgIH1cbiAgfSBlbHNlIHtcbiAgIGZ1bmMoY2FsbGJhY2suYXJnID09PSB1bmRlZmluZWQgPyBudWxsIDogY2FsbGJhY2suYXJnKTtcbiAgfVxuIH1cbn1cblxuZnVuY3Rpb24gZGVtYW5nbGUoZnVuYykge1xuIHdhcm5PbmNlKFwid2FybmluZzogYnVpbGQgd2l0aCAgLXMgREVNQU5HTEVfU1VQUE9SVD0xICB0byBsaW5rIGluIGxpYmN4eGFiaSBkZW1hbmdsaW5nXCIpO1xuIHJldHVybiBmdW5jO1xufVxuXG5mdW5jdGlvbiBkZW1hbmdsZUFsbCh0ZXh0KSB7XG4gdmFyIHJlZ2V4ID0gL1xcYl9aW1xcd1xcZF9dKy9nO1xuIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnZXgsIGZ1bmN0aW9uKHgpIHtcbiAgdmFyIHkgPSBkZW1hbmdsZSh4KTtcbiAgcmV0dXJuIHggPT09IHkgPyB4IDogeSArIFwiIFtcIiArIHggKyBcIl1cIjtcbiB9KTtcbn1cblxuZnVuY3Rpb24ganNTdGFja1RyYWNlKCkge1xuIHZhciBlcnJvciA9IG5ldyBFcnJvcigpO1xuIGlmICghZXJyb3Iuc3RhY2spIHtcbiAgdHJ5IHtcbiAgIHRocm93IG5ldyBFcnJvcigpO1xuICB9IGNhdGNoIChlKSB7XG4gICBlcnJvciA9IGU7XG4gIH1cbiAgaWYgKCFlcnJvci5zdGFjaykge1xuICAgcmV0dXJuIFwiKG5vIHN0YWNrIHRyYWNlIGF2YWlsYWJsZSlcIjtcbiAgfVxuIH1cbiByZXR1cm4gZXJyb3Iuc3RhY2sudG9TdHJpbmcoKTtcbn1cblxuZnVuY3Rpb24gc3RhY2tUcmFjZSgpIHtcbiB2YXIganMgPSBqc1N0YWNrVHJhY2UoKTtcbiBpZiAoTW9kdWxlW1wiZXh0cmFTdGFja1RyYWNlXCJdKSBqcyArPSBcIlxcblwiICsgTW9kdWxlW1wiZXh0cmFTdGFja1RyYWNlXCJdKCk7XG4gcmV0dXJuIGRlbWFuZ2xlQWxsKGpzKTtcbn1cblxuZnVuY3Rpb24gdW5TaWduKHZhbHVlLCBiaXRzKSB7XG4gaWYgKHZhbHVlID49IDApIHtcbiAgcmV0dXJuIHZhbHVlO1xuIH1cbiByZXR1cm4gYml0cyA8PSAzMiA/IDIgKiBNYXRoLmFicygxIDw8IGJpdHMgLSAxKSArIHZhbHVlIDogTWF0aC5wb3coMiwgYml0cykgKyB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gX19fYXNzZXJ0X2ZhaWwoY29uZGl0aW9uLCBmaWxlbmFtZSwgbGluZSwgZnVuYykge1xuIGFib3J0KFwiQXNzZXJ0aW9uIGZhaWxlZDogXCIgKyBVVEY4VG9TdHJpbmcoY29uZGl0aW9uKSArIFwiLCBhdDogXCIgKyBbIGZpbGVuYW1lID8gVVRGOFRvU3RyaW5nKGZpbGVuYW1lKSA6IFwidW5rbm93biBmaWxlbmFtZVwiLCBsaW5lLCBmdW5jID8gVVRGOFRvU3RyaW5nKGZ1bmMpIDogXCJ1bmtub3duIGZ1bmN0aW9uXCIgXSk7XG59XG5cbnZhciBFeGNlcHRpb25JbmZvQXR0cnMgPSB7XG4gREVTVFJVQ1RPUl9PRkZTRVQ6IDAsXG4gUkVGQ09VTlRfT0ZGU0VUOiA0LFxuIFRZUEVfT0ZGU0VUOiA4LFxuIENBVUdIVF9PRkZTRVQ6IDEyLFxuIFJFVEhST1dOX09GRlNFVDogMTMsXG4gU0laRTogMTZcbn07XG5cbmZ1bmN0aW9uIF9fX2N4YV9hbGxvY2F0ZV9leGNlcHRpb24oc2l6ZSkge1xuIHJldHVybiBfbWFsbG9jKHNpemUgKyBFeGNlcHRpb25JbmZvQXR0cnMuU0laRSkgKyBFeGNlcHRpb25JbmZvQXR0cnMuU0laRTtcbn1cblxuZnVuY3Rpb24gX2F0ZXhpdChmdW5jLCBhcmcpIHt9XG5cbmZ1bmN0aW9uIF9fX2N4YV9hdGV4aXQoYTAsIGExKSB7XG4gcmV0dXJuIF9hdGV4aXQoYTAsIGExKTtcbn1cblxuZnVuY3Rpb24gRXhjZXB0aW9uSW5mbyhleGNQdHIpIHtcbiB0aGlzLmV4Y1B0ciA9IGV4Y1B0cjtcbiB0aGlzLnB0ciA9IGV4Y1B0ciAtIEV4Y2VwdGlvbkluZm9BdHRycy5TSVpFO1xuIHRoaXMuc2V0X3R5cGUgPSBmdW5jdGlvbih0eXBlKSB7XG4gIFNBRkVfSEVBUF9TVE9SRSh0aGlzLnB0ciArIEV4Y2VwdGlvbkluZm9BdHRycy5UWVBFX09GRlNFVCB8IDAsIHR5cGUgfCAwLCA0KTtcbiB9O1xuIHRoaXMuZ2V0X3R5cGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFNBRkVfSEVBUF9MT0FEKHRoaXMucHRyICsgRXhjZXB0aW9uSW5mb0F0dHJzLlRZUEVfT0ZGU0VUIHwgMCwgNCwgMCkgfCAwO1xuIH07XG4gdGhpcy5zZXRfZGVzdHJ1Y3RvciA9IGZ1bmN0aW9uKGRlc3RydWN0b3IpIHtcbiAgU0FGRV9IRUFQX1NUT1JFKHRoaXMucHRyICsgRXhjZXB0aW9uSW5mb0F0dHJzLkRFU1RSVUNUT1JfT0ZGU0VUIHwgMCwgZGVzdHJ1Y3RvciB8IDAsIDQpO1xuIH07XG4gdGhpcy5nZXRfZGVzdHJ1Y3RvciA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gU0FGRV9IRUFQX0xPQUQodGhpcy5wdHIgKyBFeGNlcHRpb25JbmZvQXR0cnMuREVTVFJVQ1RPUl9PRkZTRVQgfCAwLCA0LCAwKSB8IDA7XG4gfTtcbiB0aGlzLnNldF9yZWZjb3VudCA9IGZ1bmN0aW9uKHJlZmNvdW50KSB7XG4gIFNBRkVfSEVBUF9TVE9SRSh0aGlzLnB0ciArIEV4Y2VwdGlvbkluZm9BdHRycy5SRUZDT1VOVF9PRkZTRVQgfCAwLCByZWZjb3VudCB8IDAsIDQpO1xuIH07XG4gdGhpcy5zZXRfY2F1Z2h0ID0gZnVuY3Rpb24oY2F1Z2h0KSB7XG4gIGNhdWdodCA9IGNhdWdodCA/IDEgOiAwO1xuICBTQUZFX0hFQVBfU1RPUkUodGhpcy5wdHIgKyBFeGNlcHRpb25JbmZvQXR0cnMuQ0FVR0hUX09GRlNFVCB8IDAsIGNhdWdodCB8IDAsIDEpO1xuIH07XG4gdGhpcy5nZXRfY2F1Z2h0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAoU0FGRV9IRUFQX0xPQUQodGhpcy5wdHIgKyBFeGNlcHRpb25JbmZvQXR0cnMuQ0FVR0hUX09GRlNFVCB8IDAsIDEsIDApIHwgMCkgIT0gMDtcbiB9O1xuIHRoaXMuc2V0X3JldGhyb3duID0gZnVuY3Rpb24ocmV0aHJvd24pIHtcbiAgcmV0aHJvd24gPSByZXRocm93biA/IDEgOiAwO1xuICBTQUZFX0hFQVBfU1RPUkUodGhpcy5wdHIgKyBFeGNlcHRpb25JbmZvQXR0cnMuUkVUSFJPV05fT0ZGU0VUIHwgMCwgcmV0aHJvd24gfCAwLCAxKTtcbiB9O1xuIHRoaXMuZ2V0X3JldGhyb3duID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAoU0FGRV9IRUFQX0xPQUQodGhpcy5wdHIgKyBFeGNlcHRpb25JbmZvQXR0cnMuUkVUSFJPV05fT0ZGU0VUIHwgMCwgMSwgMCkgfCAwKSAhPSAwO1xuIH07XG4gdGhpcy5pbml0ID0gZnVuY3Rpb24odHlwZSwgZGVzdHJ1Y3Rvcikge1xuICB0aGlzLnNldF90eXBlKHR5cGUpO1xuICB0aGlzLnNldF9kZXN0cnVjdG9yKGRlc3RydWN0b3IpO1xuICB0aGlzLnNldF9yZWZjb3VudCgwKTtcbiAgdGhpcy5zZXRfY2F1Z2h0KGZhbHNlKTtcbiAgdGhpcy5zZXRfcmV0aHJvd24oZmFsc2UpO1xuIH07XG4gdGhpcy5hZGRfcmVmID0gZnVuY3Rpb24oKSB7XG4gIHZhciB2YWx1ZSA9IFNBRkVfSEVBUF9MT0FEKHRoaXMucHRyICsgRXhjZXB0aW9uSW5mb0F0dHJzLlJFRkNPVU5UX09GRlNFVCB8IDAsIDQsIDApIHwgMDtcbiAgU0FGRV9IRUFQX1NUT1JFKHRoaXMucHRyICsgRXhjZXB0aW9uSW5mb0F0dHJzLlJFRkNPVU5UX09GRlNFVCB8IDAsIHZhbHVlICsgMSB8IDAsIDQpO1xuIH07XG4gdGhpcy5yZWxlYXNlX3JlZiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcHJldiA9IFNBRkVfSEVBUF9MT0FEKHRoaXMucHRyICsgRXhjZXB0aW9uSW5mb0F0dHJzLlJFRkNPVU5UX09GRlNFVCB8IDAsIDQsIDApIHwgMDtcbiAgU0FGRV9IRUFQX1NUT1JFKHRoaXMucHRyICsgRXhjZXB0aW9uSW5mb0F0dHJzLlJFRkNPVU5UX09GRlNFVCB8IDAsIHByZXYgLSAxIHwgMCwgNCk7XG4gIGFzc2VydChwcmV2ID4gMCk7XG4gIHJldHVybiBwcmV2ID09PSAxO1xuIH07XG59XG5cbnZhciBleGNlcHRpb25MYXN0ID0gMDtcblxudmFyIHVuY2F1Z2h0RXhjZXB0aW9uQ291bnQgPSAwO1xuXG5mdW5jdGlvbiBfX19jeGFfdGhyb3cocHRyLCB0eXBlLCBkZXN0cnVjdG9yKSB7XG4gdmFyIGluZm8gPSBuZXcgRXhjZXB0aW9uSW5mbyhwdHIpO1xuIGluZm8uaW5pdCh0eXBlLCBkZXN0cnVjdG9yKTtcbiBleGNlcHRpb25MYXN0ID0gcHRyO1xuIHVuY2F1Z2h0RXhjZXB0aW9uQ291bnQrKztcbiB0aHJvdyBwdHIgKyBcIiAtIEV4Y2VwdGlvbiBjYXRjaGluZyBpcyBkaXNhYmxlZCwgdGhpcyBleGNlcHRpb24gY2Fubm90IGJlIGNhdWdodC4gQ29tcGlsZSB3aXRoIC1zIERJU0FCTEVfRVhDRVBUSU9OX0NBVENISU5HPTAgb3IgRElTQUJMRV9FWENFUFRJT05fQ0FUQ0hJTkc9MiB0byBjYXRjaC5cIjtcbn1cblxuZnVuY3Rpb24gX2Fib3J0KCkge1xuIGFib3J0KCk7XG59XG5cbmZ1bmN0aW9uIF9lbXNjcmlwdGVuX21lbWNweV9iaWcoZGVzdCwgc3JjLCBudW0pIHtcbiBIRUFQVTguY29weVdpdGhpbihkZXN0LCBzcmMsIHNyYyArIG51bSk7XG59XG5cbmZ1bmN0aW9uIF9lbXNjcmlwdGVuX2dldF9oZWFwX3NpemUoKSB7XG4gcmV0dXJuIEhFQVBVOC5sZW5ndGg7XG59XG5cbnZhciBfZW1zY3JpcHRlbl9nZXRfbm93O1xuXG5pZiAoRU5WSVJPTk1FTlRfSVNfTk9ERSkge1xuIF9lbXNjcmlwdGVuX2dldF9ub3cgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHQgPSBwcm9jZXNzW1wiaHJ0aW1lXCJdKCk7XG4gIHJldHVybiB0WzBdICogMWUzICsgdFsxXSAvIDFlNjtcbiB9O1xufSBlbHNlIGlmICh0eXBlb2YgZGF0ZU5vdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuIF9lbXNjcmlwdGVuX2dldF9ub3cgPSBkYXRlTm93O1xufSBlbHNlIF9lbXNjcmlwdGVuX2dldF9ub3cgPSBmdW5jdGlvbigpIHtcbiByZXR1cm4gcGVyZm9ybWFuY2Uubm93KCk7XG59O1xuXG5mdW5jdGlvbiBlbXNjcmlwdGVuX3JlYWxsb2NfYnVmZmVyKHNpemUpIHtcbiB0cnkge1xuICB3YXNtTWVtb3J5Lmdyb3coc2l6ZSAtIGJ1ZmZlci5ieXRlTGVuZ3RoICsgNjU1MzUgPj4+IDE2KTtcbiAgdXBkYXRlR2xvYmFsQnVmZmVyQW5kVmlld3Mod2FzbU1lbW9yeS5idWZmZXIpO1xuICByZXR1cm4gMTtcbiB9IGNhdGNoIChlKSB7XG4gIGNvbnNvbGUuZXJyb3IoXCJlbXNjcmlwdGVuX3JlYWxsb2NfYnVmZmVyOiBBdHRlbXB0ZWQgdG8gZ3JvdyBoZWFwIGZyb20gXCIgKyBidWZmZXIuYnl0ZUxlbmd0aCArIFwiIGJ5dGVzIHRvIFwiICsgc2l6ZSArIFwiIGJ5dGVzLCBidXQgZ290IGVycm9yOiBcIiArIGUpO1xuIH1cbn1cblxuZnVuY3Rpb24gX2Vtc2NyaXB0ZW5fcmVzaXplX2hlYXAocmVxdWVzdGVkU2l6ZSkge1xuIHJlcXVlc3RlZFNpemUgPSByZXF1ZXN0ZWRTaXplID4+PiAwO1xuIHZhciBvbGRTaXplID0gX2Vtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZSgpO1xuIGFzc2VydChyZXF1ZXN0ZWRTaXplID4gb2xkU2l6ZSk7XG4gdmFyIG1heEhlYXBTaXplID0gMjE0NzQ4MzY0ODtcbiBpZiAocmVxdWVzdGVkU2l6ZSA+IG1heEhlYXBTaXplKSB7XG4gIGVycihcIkNhbm5vdCBlbmxhcmdlIG1lbW9yeSwgYXNrZWQgdG8gZ28gdXAgdG8gXCIgKyByZXF1ZXN0ZWRTaXplICsgXCIgYnl0ZXMsIGJ1dCB0aGUgbGltaXQgaXMgXCIgKyBtYXhIZWFwU2l6ZSArIFwiIGJ5dGVzIVwiKTtcbiAgcmV0dXJuIGZhbHNlO1xuIH1cbiB2YXIgbWluSGVhcFNpemUgPSAxNjc3NzIxNjtcbiBmb3IgKHZhciBjdXREb3duID0gMTsgY3V0RG93biA8PSA0OyBjdXREb3duICo9IDIpIHtcbiAgdmFyIG92ZXJHcm93bkhlYXBTaXplID0gb2xkU2l6ZSAqICgxICsgLjIgLyBjdXREb3duKTtcbiAgb3Zlckdyb3duSGVhcFNpemUgPSBNYXRoLm1pbihvdmVyR3Jvd25IZWFwU2l6ZSwgcmVxdWVzdGVkU2l6ZSArIDEwMDY2MzI5Nik7XG4gIHZhciBuZXdTaXplID0gTWF0aC5taW4obWF4SGVhcFNpemUsIGFsaWduVXAoTWF0aC5tYXgobWluSGVhcFNpemUsIHJlcXVlc3RlZFNpemUsIG92ZXJHcm93bkhlYXBTaXplKSwgNjU1MzYpKTtcbiAgdmFyIHQwID0gX2Vtc2NyaXB0ZW5fZ2V0X25vdygpO1xuICB2YXIgcmVwbGFjZW1lbnQgPSBlbXNjcmlwdGVuX3JlYWxsb2NfYnVmZmVyKG5ld1NpemUpO1xuICB2YXIgdDEgPSBfZW1zY3JpcHRlbl9nZXRfbm93KCk7XG4gIGNvbnNvbGUubG9nKFwiSGVhcCByZXNpemUgY2FsbCBmcm9tIFwiICsgb2xkU2l6ZSArIFwiIHRvIFwiICsgbmV3U2l6ZSArIFwiIHRvb2sgXCIgKyAodDEgLSB0MCkgKyBcIiBtc2Vjcy4gU3VjY2VzczogXCIgKyAhIXJlcGxhY2VtZW50KTtcbiAgaWYgKHJlcGxhY2VtZW50KSB7XG4gICByZXR1cm4gdHJ1ZTtcbiAgfVxuIH1cbiBlcnIoXCJGYWlsZWQgdG8gZ3JvdyB0aGUgaGVhcCBmcm9tIFwiICsgb2xkU2l6ZSArIFwiIGJ5dGVzIHRvIFwiICsgbmV3U2l6ZSArIFwiIGJ5dGVzLCBub3QgZW5vdWdoIG1lbW9yeSFcIik7XG4gcmV0dXJuIGZhbHNlO1xufVxuXG52YXIgRU5WID0ge307XG5cbmZ1bmN0aW9uIGdldEV4ZWN1dGFibGVOYW1lKCkge1xuIHJldHVybiB0aGlzUHJvZ3JhbSB8fCBcIi4vdGhpcy5wcm9ncmFtXCI7XG59XG5cbmZ1bmN0aW9uIGdldEVudlN0cmluZ3MoKSB7XG4gaWYgKCFnZXRFbnZTdHJpbmdzLnN0cmluZ3MpIHtcbiAgdmFyIGxhbmcgPSAodHlwZW9mIG5hdmlnYXRvciA9PT0gXCJvYmplY3RcIiAmJiBuYXZpZ2F0b3IubGFuZ3VhZ2VzICYmIG5hdmlnYXRvci5sYW5ndWFnZXNbMF0gfHwgXCJDXCIpLnJlcGxhY2UoXCItXCIsIFwiX1wiKSArIFwiLlVURi04XCI7XG4gIHZhciBlbnYgPSB7XG4gICBcIlVTRVJcIjogXCJ3ZWJfdXNlclwiLFxuICAgXCJMT0dOQU1FXCI6IFwid2ViX3VzZXJcIixcbiAgIFwiUEFUSFwiOiBcIi9cIixcbiAgIFwiUFdEXCI6IFwiL1wiLFxuICAgXCJIT01FXCI6IFwiL2hvbWUvd2ViX3VzZXJcIixcbiAgIFwiTEFOR1wiOiBsYW5nLFxuICAgXCJfXCI6IGdldEV4ZWN1dGFibGVOYW1lKClcbiAgfTtcbiAgZm9yICh2YXIgeCBpbiBFTlYpIHtcbiAgIGVudlt4XSA9IEVOVlt4XTtcbiAgfVxuICB2YXIgc3RyaW5ncyA9IFtdO1xuICBmb3IgKHZhciB4IGluIGVudikge1xuICAgc3RyaW5ncy5wdXNoKHggKyBcIj1cIiArIGVudlt4XSk7XG4gIH1cbiAgZ2V0RW52U3RyaW5ncy5zdHJpbmdzID0gc3RyaW5ncztcbiB9XG4gcmV0dXJuIGdldEVudlN0cmluZ3Muc3RyaW5ncztcbn1cblxudmFyIFBBVEggPSB7XG4gc3BsaXRQYXRoOiBmdW5jdGlvbihmaWxlbmFtZSkge1xuICB2YXIgc3BsaXRQYXRoUmUgPSAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcbiAgcmV0dXJuIHNwbGl0UGF0aFJlLmV4ZWMoZmlsZW5hbWUpLnNsaWNlKDEpO1xuIH0sXG4gbm9ybWFsaXplQXJyYXk6IGZ1bmN0aW9uKHBhcnRzLCBhbGxvd0Fib3ZlUm9vdCkge1xuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICBpZiAobGFzdCA9PT0gXCIuXCIpIHtcbiAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICB9IGVsc2UgaWYgKGxhc3QgPT09IFwiLi5cIikge1xuICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB1cCsrO1xuICAgfSBlbHNlIGlmICh1cCkge1xuICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB1cC0tO1xuICAgfVxuICB9XG4gIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgZm9yICg7dXA7IHVwLS0pIHtcbiAgICBwYXJ0cy51bnNoaWZ0KFwiLi5cIik7XG4gICB9XG4gIH1cbiAgcmV0dXJuIHBhcnRzO1xuIH0sXG4gbm9ybWFsaXplOiBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBpc0Fic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09IFwiL1wiLCB0cmFpbGluZ1NsYXNoID0gcGF0aC5zdWJzdHIoLTEpID09PSBcIi9cIjtcbiAgcGF0aCA9IFBBVEgubm9ybWFsaXplQXJyYXkocGF0aC5zcGxpdChcIi9cIikuZmlsdGVyKGZ1bmN0aW9uKHApIHtcbiAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNBYnNvbHV0ZSkuam9pbihcIi9cIik7XG4gIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgcGF0aCA9IFwiLlwiO1xuICB9XG4gIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgIHBhdGggKz0gXCIvXCI7XG4gIH1cbiAgcmV0dXJuIChpc0Fic29sdXRlID8gXCIvXCIgOiBcIlwiKSArIHBhdGg7XG4gfSxcbiBkaXJuYW1lOiBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciByZXN1bHQgPSBQQVRILnNwbGl0UGF0aChwYXRoKSwgcm9vdCA9IHJlc3VsdFswXSwgZGlyID0gcmVzdWx0WzFdO1xuICBpZiAoIXJvb3QgJiYgIWRpcikge1xuICAgcmV0dXJuIFwiLlwiO1xuICB9XG4gIGlmIChkaXIpIHtcbiAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICB9XG4gIHJldHVybiByb290ICsgZGlyO1xuIH0sXG4gYmFzZW5hbWU6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgaWYgKHBhdGggPT09IFwiL1wiKSByZXR1cm4gXCIvXCI7XG4gIHBhdGggPSBQQVRILm5vcm1hbGl6ZShwYXRoKTtcbiAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXFwvJC8sIFwiXCIpO1xuICB2YXIgbGFzdFNsYXNoID0gcGF0aC5sYXN0SW5kZXhPZihcIi9cIik7XG4gIGlmIChsYXN0U2xhc2ggPT09IC0xKSByZXR1cm4gcGF0aDtcbiAgcmV0dXJuIHBhdGguc3Vic3RyKGxhc3RTbGFzaCArIDEpO1xuIH0sXG4gZXh0bmFtZTogZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gUEFUSC5zcGxpdFBhdGgocGF0aClbM107XG4gfSxcbiBqb2luOiBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIFBBVEgubm9ybWFsaXplKHBhdGhzLmpvaW4oXCIvXCIpKTtcbiB9LFxuIGpvaW4yOiBmdW5jdGlvbihsLCByKSB7XG4gIHJldHVybiBQQVRILm5vcm1hbGl6ZShsICsgXCIvXCIgKyByKTtcbiB9XG59O1xuXG5mdW5jdGlvbiBnZXRSYW5kb21EZXZpY2UoKSB7XG4gaWYgKHR5cGVvZiBjcnlwdG8gPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGNyeXB0b1tcImdldFJhbmRvbVZhbHVlc1wiXSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gIHZhciByYW5kb21CdWZmZXIgPSBuZXcgVWludDhBcnJheSgxKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhyYW5kb21CdWZmZXIpO1xuICAgcmV0dXJuIHJhbmRvbUJ1ZmZlclswXTtcbiAgfTtcbiB9IGVsc2UgaWYgKEVOVklST05NRU5UX0lTX05PREUpIHtcbiAgdHJ5IHtcbiAgIHZhciBjcnlwdG9fbW9kdWxlID0gcmVxdWlyZShcImNyeXB0b1wiKTtcbiAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY3J5cHRvX21vZHVsZVtcInJhbmRvbUJ5dGVzXCJdKDEpWzBdO1xuICAgfTtcbiAgfSBjYXRjaCAoZSkge31cbiB9XG4gcmV0dXJuIGZ1bmN0aW9uKCkge1xuICBhYm9ydChcIm5vIGNyeXB0b2dyYXBoaWMgc3VwcG9ydCBmb3VuZCBmb3IgcmFuZG9tRGV2aWNlLiBjb25zaWRlciBwb2x5ZmlsbGluZyBpdCBpZiB5b3Ugd2FudCB0byB1c2Ugc29tZXRoaW5nIGluc2VjdXJlIGxpa2UgTWF0aC5yYW5kb20oKSwgZS5nLiBwdXQgdGhpcyBpbiBhIC0tcHJlLWpzOiB2YXIgY3J5cHRvID0geyBnZXRSYW5kb21WYWx1ZXM6IGZ1bmN0aW9uKGFycmF5KSB7IGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIGFycmF5W2ldID0gKE1hdGgucmFuZG9tKCkqMjU2KXwwIH0gfTtcIik7XG4gfTtcbn1cblxudmFyIFBBVEhfRlMgPSB7XG4gcmVzb2x2ZTogZnVuY3Rpb24oKSB7XG4gIHZhciByZXNvbHZlZFBhdGggPSBcIlwiLCByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG4gIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICB2YXIgcGF0aCA9IGkgPj0gMCA/IGFyZ3VtZW50c1tpXSA6IEZTLmN3ZCgpO1xuICAgaWYgKHR5cGVvZiBwYXRoICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkFyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzXCIpO1xuICAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgIHJldHVybiBcIlwiO1xuICAgfVxuICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArIFwiL1wiICsgcmVzb2x2ZWRQYXRoO1xuICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSBcIi9cIjtcbiAgfVxuICByZXNvbHZlZFBhdGggPSBQQVRILm5vcm1hbGl6ZUFycmF5KHJlc29sdmVkUGF0aC5zcGxpdChcIi9cIikuZmlsdGVyKGZ1bmN0aW9uKHApIHtcbiAgIHJldHVybiAhIXA7XG4gIH0pLCAhcmVzb2x2ZWRBYnNvbHV0ZSkuam9pbihcIi9cIik7XG4gIHJldHVybiAocmVzb2x2ZWRBYnNvbHV0ZSA/IFwiL1wiIDogXCJcIikgKyByZXNvbHZlZFBhdGggfHwgXCIuXCI7XG4gfSxcbiByZWxhdGl2ZTogZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgZnJvbSA9IFBBVEhfRlMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gUEFUSF9GUy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG4gIGZ1bmN0aW9uIHRyaW0oYXJyKSB7XG4gICB2YXIgc3RhcnQgPSAwO1xuICAgZm9yICg7c3RhcnQgPCBhcnIubGVuZ3RoOyBzdGFydCsrKSB7XG4gICAgaWYgKGFycltzdGFydF0gIT09IFwiXCIpIGJyZWFrO1xuICAgfVxuICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgZm9yICg7ZW5kID49IDA7IGVuZC0tKSB7XG4gICAgaWYgKGFycltlbmRdICE9PSBcIlwiKSBicmVhaztcbiAgIH1cbiAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgcmV0dXJuIGFyci5zbGljZShzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgfVxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KFwiL1wiKSk7XG4gIHZhciB0b1BhcnRzID0gdHJpbSh0by5zcGxpdChcIi9cIikpO1xuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oZnJvbVBhcnRzLmxlbmd0aCwgdG9QYXJ0cy5sZW5ndGgpO1xuICB2YXIgc2FtZVBhcnRzTGVuZ3RoID0gbGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICBpZiAoZnJvbVBhcnRzW2ldICE9PSB0b1BhcnRzW2ldKSB7XG4gICAgc2FtZVBhcnRzTGVuZ3RoID0gaTtcbiAgICBicmVhaztcbiAgIH1cbiAgfVxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgb3V0cHV0UGFydHMucHVzaChcIi4uXCIpO1xuICB9XG4gIG91dHB1dFBhcnRzID0gb3V0cHV0UGFydHMuY29uY2F0KHRvUGFydHMuc2xpY2Uoc2FtZVBhcnRzTGVuZ3RoKSk7XG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKFwiL1wiKTtcbiB9XG59O1xuXG52YXIgVFRZID0ge1xuIHR0eXM6IFtdLFxuIGluaXQ6IGZ1bmN0aW9uKCkge30sXG4gc2h1dGRvd246IGZ1bmN0aW9uKCkge30sXG4gcmVnaXN0ZXI6IGZ1bmN0aW9uKGRldiwgb3BzKSB7XG4gIFRUWS50dHlzW2Rldl0gPSB7XG4gICBpbnB1dDogW10sXG4gICBvdXRwdXQ6IFtdLFxuICAgb3BzOiBvcHNcbiAgfTtcbiAgRlMucmVnaXN0ZXJEZXZpY2UoZGV2LCBUVFkuc3RyZWFtX29wcyk7XG4gfSxcbiBzdHJlYW1fb3BzOiB7XG4gIG9wZW46IGZ1bmN0aW9uKHN0cmVhbSkge1xuICAgdmFyIHR0eSA9IFRUWS50dHlzW3N0cmVhbS5ub2RlLnJkZXZdO1xuICAgaWYgKCF0dHkpIHtcbiAgICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig0Myk7XG4gICB9XG4gICBzdHJlYW0udHR5ID0gdHR5O1xuICAgc3RyZWFtLnNlZWthYmxlID0gZmFsc2U7XG4gIH0sXG4gIGNsb3NlOiBmdW5jdGlvbihzdHJlYW0pIHtcbiAgIHN0cmVhbS50dHkub3BzLmZsdXNoKHN0cmVhbS50dHkpO1xuICB9LFxuICBmbHVzaDogZnVuY3Rpb24oc3RyZWFtKSB7XG4gICBzdHJlYW0udHR5Lm9wcy5mbHVzaChzdHJlYW0udHR5KTtcbiAgfSxcbiAgcmVhZDogZnVuY3Rpb24oc3RyZWFtLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoLCBwb3MpIHtcbiAgIGlmICghc3RyZWFtLnR0eSB8fCAhc3RyZWFtLnR0eS5vcHMuZ2V0X2NoYXIpIHtcbiAgICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig2MCk7XG4gICB9XG4gICB2YXIgYnl0ZXNSZWFkID0gMDtcbiAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIHRyeSB7XG4gICAgIHJlc3VsdCA9IHN0cmVhbS50dHkub3BzLmdldF9jaGFyKHN0cmVhbS50dHkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMjkpO1xuICAgIH1cbiAgICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQgJiYgYnl0ZXNSZWFkID09PSAwKSB7XG4gICAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDYpO1xuICAgIH1cbiAgICBpZiAocmVzdWx0ID09PSBudWxsIHx8IHJlc3VsdCA9PT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICBieXRlc1JlYWQrKztcbiAgICBidWZmZXJbb2Zmc2V0ICsgaV0gPSByZXN1bHQ7XG4gICB9XG4gICBpZiAoYnl0ZXNSZWFkKSB7XG4gICAgc3RyZWFtLm5vZGUudGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgIH1cbiAgIHJldHVybiBieXRlc1JlYWQ7XG4gIH0sXG4gIHdyaXRlOiBmdW5jdGlvbihzdHJlYW0sIGJ1ZmZlciwgb2Zmc2V0LCBsZW5ndGgsIHBvcykge1xuICAgaWYgKCFzdHJlYW0udHR5IHx8ICFzdHJlYW0udHR5Lm9wcy5wdXRfY2hhcikge1xuICAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDYwKTtcbiAgIH1cbiAgIHRyeSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICBzdHJlYW0udHR5Lm9wcy5wdXRfY2hhcihzdHJlYW0udHR5LCBidWZmZXJbb2Zmc2V0ICsgaV0pO1xuICAgIH1cbiAgIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigyOSk7XG4gICB9XG4gICBpZiAobGVuZ3RoKSB7XG4gICAgc3RyZWFtLm5vZGUudGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgIH1cbiAgIHJldHVybiBpO1xuICB9XG4gfSxcbiBkZWZhdWx0X3R0eV9vcHM6IHtcbiAgZ2V0X2NoYXI6IGZ1bmN0aW9uKHR0eSkge1xuICAgaWYgKCF0dHkuaW5wdXQubGVuZ3RoKSB7XG4gICAgdmFyIHJlc3VsdCA9IG51bGw7XG4gICAgaWYgKEVOVklST05NRU5UX0lTX05PREUpIHtcbiAgICAgdmFyIEJVRlNJWkUgPSAyNTY7XG4gICAgIHZhciBidWYgPSBCdWZmZXIuYWxsb2MgPyBCdWZmZXIuYWxsb2MoQlVGU0laRSkgOiBuZXcgQnVmZmVyKEJVRlNJWkUpO1xuICAgICB2YXIgYnl0ZXNSZWFkID0gMDtcbiAgICAgdHJ5IHtcbiAgICAgIGJ5dGVzUmVhZCA9IG5vZGVGUy5yZWFkU3luYyhwcm9jZXNzLnN0ZGluLmZkLCBidWYsIDAsIEJVRlNJWkUsIG51bGwpO1xuICAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS50b1N0cmluZygpLmluZGV4T2YoXCJFT0ZcIikgIT0gLTEpIGJ5dGVzUmVhZCA9IDA7IGVsc2UgdGhyb3cgZTtcbiAgICAgfVxuICAgICBpZiAoYnl0ZXNSZWFkID4gMCkge1xuICAgICAgcmVzdWx0ID0gYnVmLnNsaWNlKDAsIGJ5dGVzUmVhZCkudG9TdHJpbmcoXCJ1dGYtOFwiKTtcbiAgICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IG51bGw7XG4gICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2Ygd2luZG93LnByb21wdCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgcmVzdWx0ID0gd2luZG93LnByb21wdChcIklucHV0OiBcIik7XG4gICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgIHJlc3VsdCArPSBcIlxcblwiO1xuICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmVhZGxpbmUgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgIHJlc3VsdCA9IHJlYWRsaW5lKCk7XG4gICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgIHJlc3VsdCArPSBcIlxcblwiO1xuICAgICB9XG4gICAgfVxuICAgIGlmICghcmVzdWx0KSB7XG4gICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB0dHkuaW5wdXQgPSBpbnRBcnJheUZyb21TdHJpbmcocmVzdWx0LCB0cnVlKTtcbiAgIH1cbiAgIHJldHVybiB0dHkuaW5wdXQuc2hpZnQoKTtcbiAgfSxcbiAgcHV0X2NoYXI6IGZ1bmN0aW9uKHR0eSwgdmFsKSB7XG4gICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gMTApIHtcbiAgICBvdXQoVVRGOEFycmF5VG9TdHJpbmcodHR5Lm91dHB1dCwgMCkpO1xuICAgIHR0eS5vdXRwdXQgPSBbXTtcbiAgIH0gZWxzZSB7XG4gICAgaWYgKHZhbCAhPSAwKSB0dHkub3V0cHV0LnB1c2godmFsKTtcbiAgIH1cbiAgfSxcbiAgZmx1c2g6IGZ1bmN0aW9uKHR0eSkge1xuICAgaWYgKHR0eS5vdXRwdXQgJiYgdHR5Lm91dHB1dC5sZW5ndGggPiAwKSB7XG4gICAgb3V0KFVURjhBcnJheVRvU3RyaW5nKHR0eS5vdXRwdXQsIDApKTtcbiAgICB0dHkub3V0cHV0ID0gW107XG4gICB9XG4gIH1cbiB9LFxuIGRlZmF1bHRfdHR5MV9vcHM6IHtcbiAgcHV0X2NoYXI6IGZ1bmN0aW9uKHR0eSwgdmFsKSB7XG4gICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gMTApIHtcbiAgICBlcnIoVVRGOEFycmF5VG9TdHJpbmcodHR5Lm91dHB1dCwgMCkpO1xuICAgIHR0eS5vdXRwdXQgPSBbXTtcbiAgIH0gZWxzZSB7XG4gICAgaWYgKHZhbCAhPSAwKSB0dHkub3V0cHV0LnB1c2godmFsKTtcbiAgIH1cbiAgfSxcbiAgZmx1c2g6IGZ1bmN0aW9uKHR0eSkge1xuICAgaWYgKHR0eS5vdXRwdXQgJiYgdHR5Lm91dHB1dC5sZW5ndGggPiAwKSB7XG4gICAgZXJyKFVURjhBcnJheVRvU3RyaW5nKHR0eS5vdXRwdXQsIDApKTtcbiAgICB0dHkub3V0cHV0ID0gW107XG4gICB9XG4gIH1cbiB9XG59O1xuXG5mdW5jdGlvbiBtbWFwQWxsb2Moc2l6ZSkge1xuIHZhciBhbGlnbmVkU2l6ZSA9IGFsaWduTWVtb3J5KHNpemUsIDE2Mzg0KTtcbiB2YXIgcHRyID0gX21hbGxvYyhhbGlnbmVkU2l6ZSk7XG4gd2hpbGUgKHNpemUgPCBhbGlnbmVkU2l6ZSkgU0FGRV9IRUFQX1NUT1JFKHB0ciArIHNpemUrKywgMCwgMSk7XG4gcmV0dXJuIHB0cjtcbn1cblxudmFyIE1FTUZTID0ge1xuIG9wc190YWJsZTogbnVsbCxcbiBtb3VudDogZnVuY3Rpb24obW91bnQpIHtcbiAgcmV0dXJuIE1FTUZTLmNyZWF0ZU5vZGUobnVsbCwgXCIvXCIsIDE2Mzg0IHwgNTExLCAwKTtcbiB9LFxuIGNyZWF0ZU5vZGU6IGZ1bmN0aW9uKHBhcmVudCwgbmFtZSwgbW9kZSwgZGV2KSB7XG4gIGlmIChGUy5pc0Jsa2Rldihtb2RlKSB8fCBGUy5pc0ZJRk8obW9kZSkpIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDYzKTtcbiAgfVxuICBpZiAoIU1FTUZTLm9wc190YWJsZSkge1xuICAgTUVNRlMub3BzX3RhYmxlID0ge1xuICAgIGRpcjoge1xuICAgICBub2RlOiB7XG4gICAgICBnZXRhdHRyOiBNRU1GUy5ub2RlX29wcy5nZXRhdHRyLFxuICAgICAgc2V0YXR0cjogTUVNRlMubm9kZV9vcHMuc2V0YXR0cixcbiAgICAgIGxvb2t1cDogTUVNRlMubm9kZV9vcHMubG9va3VwLFxuICAgICAgbWtub2Q6IE1FTUZTLm5vZGVfb3BzLm1rbm9kLFxuICAgICAgcmVuYW1lOiBNRU1GUy5ub2RlX29wcy5yZW5hbWUsXG4gICAgICB1bmxpbms6IE1FTUZTLm5vZGVfb3BzLnVubGluayxcbiAgICAgIHJtZGlyOiBNRU1GUy5ub2RlX29wcy5ybWRpcixcbiAgICAgIHJlYWRkaXI6IE1FTUZTLm5vZGVfb3BzLnJlYWRkaXIsXG4gICAgICBzeW1saW5rOiBNRU1GUy5ub2RlX29wcy5zeW1saW5rXG4gICAgIH0sXG4gICAgIHN0cmVhbToge1xuICAgICAgbGxzZWVrOiBNRU1GUy5zdHJlYW1fb3BzLmxsc2Vla1xuICAgICB9XG4gICAgfSxcbiAgICBmaWxlOiB7XG4gICAgIG5vZGU6IHtcbiAgICAgIGdldGF0dHI6IE1FTUZTLm5vZGVfb3BzLmdldGF0dHIsXG4gICAgICBzZXRhdHRyOiBNRU1GUy5ub2RlX29wcy5zZXRhdHRyXG4gICAgIH0sXG4gICAgIHN0cmVhbToge1xuICAgICAgbGxzZWVrOiBNRU1GUy5zdHJlYW1fb3BzLmxsc2VlayxcbiAgICAgIHJlYWQ6IE1FTUZTLnN0cmVhbV9vcHMucmVhZCxcbiAgICAgIHdyaXRlOiBNRU1GUy5zdHJlYW1fb3BzLndyaXRlLFxuICAgICAgYWxsb2NhdGU6IE1FTUZTLnN0cmVhbV9vcHMuYWxsb2NhdGUsXG4gICAgICBtbWFwOiBNRU1GUy5zdHJlYW1fb3BzLm1tYXAsXG4gICAgICBtc3luYzogTUVNRlMuc3RyZWFtX29wcy5tc3luY1xuICAgICB9XG4gICAgfSxcbiAgICBsaW5rOiB7XG4gICAgIG5vZGU6IHtcbiAgICAgIGdldGF0dHI6IE1FTUZTLm5vZGVfb3BzLmdldGF0dHIsXG4gICAgICBzZXRhdHRyOiBNRU1GUy5ub2RlX29wcy5zZXRhdHRyLFxuICAgICAgcmVhZGxpbms6IE1FTUZTLm5vZGVfb3BzLnJlYWRsaW5rXG4gICAgIH0sXG4gICAgIHN0cmVhbToge31cbiAgICB9LFxuICAgIGNocmRldjoge1xuICAgICBub2RlOiB7XG4gICAgICBnZXRhdHRyOiBNRU1GUy5ub2RlX29wcy5nZXRhdHRyLFxuICAgICAgc2V0YXR0cjogTUVNRlMubm9kZV9vcHMuc2V0YXR0clxuICAgICB9LFxuICAgICBzdHJlYW06IEZTLmNocmRldl9zdHJlYW1fb3BzXG4gICAgfVxuICAgfTtcbiAgfVxuICB2YXIgbm9kZSA9IEZTLmNyZWF0ZU5vZGUocGFyZW50LCBuYW1lLCBtb2RlLCBkZXYpO1xuICBpZiAoRlMuaXNEaXIobm9kZS5tb2RlKSkge1xuICAgbm9kZS5ub2RlX29wcyA9IE1FTUZTLm9wc190YWJsZS5kaXIubm9kZTtcbiAgIG5vZGUuc3RyZWFtX29wcyA9IE1FTUZTLm9wc190YWJsZS5kaXIuc3RyZWFtO1xuICAgbm9kZS5jb250ZW50cyA9IHt9O1xuICB9IGVsc2UgaWYgKEZTLmlzRmlsZShub2RlLm1vZGUpKSB7XG4gICBub2RlLm5vZGVfb3BzID0gTUVNRlMub3BzX3RhYmxlLmZpbGUubm9kZTtcbiAgIG5vZGUuc3RyZWFtX29wcyA9IE1FTUZTLm9wc190YWJsZS5maWxlLnN0cmVhbTtcbiAgIG5vZGUudXNlZEJ5dGVzID0gMDtcbiAgIG5vZGUuY29udGVudHMgPSBudWxsO1xuICB9IGVsc2UgaWYgKEZTLmlzTGluayhub2RlLm1vZGUpKSB7XG4gICBub2RlLm5vZGVfb3BzID0gTUVNRlMub3BzX3RhYmxlLmxpbmsubm9kZTtcbiAgIG5vZGUuc3RyZWFtX29wcyA9IE1FTUZTLm9wc190YWJsZS5saW5rLnN0cmVhbTtcbiAgfSBlbHNlIGlmIChGUy5pc0NocmRldihub2RlLm1vZGUpKSB7XG4gICBub2RlLm5vZGVfb3BzID0gTUVNRlMub3BzX3RhYmxlLmNocmRldi5ub2RlO1xuICAgbm9kZS5zdHJlYW1fb3BzID0gTUVNRlMub3BzX3RhYmxlLmNocmRldi5zdHJlYW07XG4gIH1cbiAgbm9kZS50aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICBpZiAocGFyZW50KSB7XG4gICBwYXJlbnQuY29udGVudHNbbmFtZV0gPSBub2RlO1xuICB9XG4gIHJldHVybiBub2RlO1xuIH0sXG4gZ2V0RmlsZURhdGFBc1JlZ3VsYXJBcnJheTogZnVuY3Rpb24obm9kZSkge1xuICBpZiAobm9kZS5jb250ZW50cyAmJiBub2RlLmNvbnRlbnRzLnN1YmFycmF5KSB7XG4gICB2YXIgYXJyID0gW107XG4gICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUudXNlZEJ5dGVzOyArK2kpIGFyci5wdXNoKG5vZGUuY29udGVudHNbaV0pO1xuICAgcmV0dXJuIGFycjtcbiAgfVxuICByZXR1cm4gbm9kZS5jb250ZW50cztcbiB9LFxuIGdldEZpbGVEYXRhQXNUeXBlZEFycmF5OiBmdW5jdGlvbihub2RlKSB7XG4gIGlmICghbm9kZS5jb250ZW50cykgcmV0dXJuIG5ldyBVaW50OEFycmF5KDApO1xuICBpZiAobm9kZS5jb250ZW50cy5zdWJhcnJheSkgcmV0dXJuIG5vZGUuY29udGVudHMuc3ViYXJyYXkoMCwgbm9kZS51c2VkQnl0ZXMpO1xuICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkobm9kZS5jb250ZW50cyk7XG4gfSxcbiBleHBhbmRGaWxlU3RvcmFnZTogZnVuY3Rpb24obm9kZSwgbmV3Q2FwYWNpdHkpIHtcbiAgdmFyIHByZXZDYXBhY2l0eSA9IG5vZGUuY29udGVudHMgPyBub2RlLmNvbnRlbnRzLmxlbmd0aCA6IDA7XG4gIGlmIChwcmV2Q2FwYWNpdHkgPj0gbmV3Q2FwYWNpdHkpIHJldHVybjtcbiAgdmFyIENBUEFDSVRZX0RPVUJMSU5HX01BWCA9IDEwMjQgKiAxMDI0O1xuICBuZXdDYXBhY2l0eSA9IE1hdGgubWF4KG5ld0NhcGFjaXR5LCBwcmV2Q2FwYWNpdHkgKiAocHJldkNhcGFjaXR5IDwgQ0FQQUNJVFlfRE9VQkxJTkdfTUFYID8gMiA6IDEuMTI1KSA+Pj4gMCk7XG4gIGlmIChwcmV2Q2FwYWNpdHkgIT0gMCkgbmV3Q2FwYWNpdHkgPSBNYXRoLm1heChuZXdDYXBhY2l0eSwgMjU2KTtcbiAgdmFyIG9sZENvbnRlbnRzID0gbm9kZS5jb250ZW50cztcbiAgbm9kZS5jb250ZW50cyA9IG5ldyBVaW50OEFycmF5KG5ld0NhcGFjaXR5KTtcbiAgaWYgKG5vZGUudXNlZEJ5dGVzID4gMCkgbm9kZS5jb250ZW50cy5zZXQob2xkQ29udGVudHMuc3ViYXJyYXkoMCwgbm9kZS51c2VkQnl0ZXMpLCAwKTtcbiAgcmV0dXJuO1xuIH0sXG4gcmVzaXplRmlsZVN0b3JhZ2U6IGZ1bmN0aW9uKG5vZGUsIG5ld1NpemUpIHtcbiAgaWYgKG5vZGUudXNlZEJ5dGVzID09IG5ld1NpemUpIHJldHVybjtcbiAgaWYgKG5ld1NpemUgPT0gMCkge1xuICAgbm9kZS5jb250ZW50cyA9IG51bGw7XG4gICBub2RlLnVzZWRCeXRlcyA9IDA7XG4gICByZXR1cm47XG4gIH1cbiAgaWYgKCFub2RlLmNvbnRlbnRzIHx8IG5vZGUuY29udGVudHMuc3ViYXJyYXkpIHtcbiAgIHZhciBvbGRDb250ZW50cyA9IG5vZGUuY29udGVudHM7XG4gICBub2RlLmNvbnRlbnRzID0gbmV3IFVpbnQ4QXJyYXkobmV3U2l6ZSk7XG4gICBpZiAob2xkQ29udGVudHMpIHtcbiAgICBub2RlLmNvbnRlbnRzLnNldChvbGRDb250ZW50cy5zdWJhcnJheSgwLCBNYXRoLm1pbihuZXdTaXplLCBub2RlLnVzZWRCeXRlcykpKTtcbiAgIH1cbiAgIG5vZGUudXNlZEJ5dGVzID0gbmV3U2l6ZTtcbiAgIHJldHVybjtcbiAgfVxuICBpZiAoIW5vZGUuY29udGVudHMpIG5vZGUuY29udGVudHMgPSBbXTtcbiAgaWYgKG5vZGUuY29udGVudHMubGVuZ3RoID4gbmV3U2l6ZSkgbm9kZS5jb250ZW50cy5sZW5ndGggPSBuZXdTaXplOyBlbHNlIHdoaWxlIChub2RlLmNvbnRlbnRzLmxlbmd0aCA8IG5ld1NpemUpIG5vZGUuY29udGVudHMucHVzaCgwKTtcbiAgbm9kZS51c2VkQnl0ZXMgPSBuZXdTaXplO1xuIH0sXG4gbm9kZV9vcHM6IHtcbiAgZ2V0YXR0cjogZnVuY3Rpb24obm9kZSkge1xuICAgdmFyIGF0dHIgPSB7fTtcbiAgIGF0dHIuZGV2ID0gRlMuaXNDaHJkZXYobm9kZS5tb2RlKSA/IG5vZGUuaWQgOiAxO1xuICAgYXR0ci5pbm8gPSBub2RlLmlkO1xuICAgYXR0ci5tb2RlID0gbm9kZS5tb2RlO1xuICAgYXR0ci5ubGluayA9IDE7XG4gICBhdHRyLnVpZCA9IDA7XG4gICBhdHRyLmdpZCA9IDA7XG4gICBhdHRyLnJkZXYgPSBub2RlLnJkZXY7XG4gICBpZiAoRlMuaXNEaXIobm9kZS5tb2RlKSkge1xuICAgIGF0dHIuc2l6ZSA9IDQwOTY7XG4gICB9IGVsc2UgaWYgKEZTLmlzRmlsZShub2RlLm1vZGUpKSB7XG4gICAgYXR0ci5zaXplID0gbm9kZS51c2VkQnl0ZXM7XG4gICB9IGVsc2UgaWYgKEZTLmlzTGluayhub2RlLm1vZGUpKSB7XG4gICAgYXR0ci5zaXplID0gbm9kZS5saW5rLmxlbmd0aDtcbiAgIH0gZWxzZSB7XG4gICAgYXR0ci5zaXplID0gMDtcbiAgIH1cbiAgIGF0dHIuYXRpbWUgPSBuZXcgRGF0ZShub2RlLnRpbWVzdGFtcCk7XG4gICBhdHRyLm10aW1lID0gbmV3IERhdGUobm9kZS50aW1lc3RhbXApO1xuICAgYXR0ci5jdGltZSA9IG5ldyBEYXRlKG5vZGUudGltZXN0YW1wKTtcbiAgIGF0dHIuYmxrc2l6ZSA9IDQwOTY7XG4gICBhdHRyLmJsb2NrcyA9IE1hdGguY2VpbChhdHRyLnNpemUgLyBhdHRyLmJsa3NpemUpO1xuICAgcmV0dXJuIGF0dHI7XG4gIH0sXG4gIHNldGF0dHI6IGZ1bmN0aW9uKG5vZGUsIGF0dHIpIHtcbiAgIGlmIChhdHRyLm1vZGUgIT09IHVuZGVmaW5lZCkge1xuICAgIG5vZGUubW9kZSA9IGF0dHIubW9kZTtcbiAgIH1cbiAgIGlmIChhdHRyLnRpbWVzdGFtcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbm9kZS50aW1lc3RhbXAgPSBhdHRyLnRpbWVzdGFtcDtcbiAgIH1cbiAgIGlmIChhdHRyLnNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgIE1FTUZTLnJlc2l6ZUZpbGVTdG9yYWdlKG5vZGUsIGF0dHIuc2l6ZSk7XG4gICB9XG4gIH0sXG4gIGxvb2t1cDogZnVuY3Rpb24ocGFyZW50LCBuYW1lKSB7XG4gICB0aHJvdyBGUy5nZW5lcmljRXJyb3JzWzQ0XTtcbiAgfSxcbiAgbWtub2Q6IGZ1bmN0aW9uKHBhcmVudCwgbmFtZSwgbW9kZSwgZGV2KSB7XG4gICByZXR1cm4gTUVNRlMuY3JlYXRlTm9kZShwYXJlbnQsIG5hbWUsIG1vZGUsIGRldik7XG4gIH0sXG4gIHJlbmFtZTogZnVuY3Rpb24ob2xkX25vZGUsIG5ld19kaXIsIG5ld19uYW1lKSB7XG4gICBpZiAoRlMuaXNEaXIob2xkX25vZGUubW9kZSkpIHtcbiAgICB2YXIgbmV3X25vZGU7XG4gICAgdHJ5IHtcbiAgICAgbmV3X25vZGUgPSBGUy5sb29rdXBOb2RlKG5ld19kaXIsIG5ld19uYW1lKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIGlmIChuZXdfbm9kZSkge1xuICAgICBmb3IgKHZhciBpIGluIG5ld19ub2RlLmNvbnRlbnRzKSB7XG4gICAgICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig1NSk7XG4gICAgIH1cbiAgICB9XG4gICB9XG4gICBkZWxldGUgb2xkX25vZGUucGFyZW50LmNvbnRlbnRzW29sZF9ub2RlLm5hbWVdO1xuICAgb2xkX25vZGUubmFtZSA9IG5ld19uYW1lO1xuICAgbmV3X2Rpci5jb250ZW50c1tuZXdfbmFtZV0gPSBvbGRfbm9kZTtcbiAgIG9sZF9ub2RlLnBhcmVudCA9IG5ld19kaXI7XG4gIH0sXG4gIHVubGluazogZnVuY3Rpb24ocGFyZW50LCBuYW1lKSB7XG4gICBkZWxldGUgcGFyZW50LmNvbnRlbnRzW25hbWVdO1xuICB9LFxuICBybWRpcjogZnVuY3Rpb24ocGFyZW50LCBuYW1lKSB7XG4gICB2YXIgbm9kZSA9IEZTLmxvb2t1cE5vZGUocGFyZW50LCBuYW1lKTtcbiAgIGZvciAodmFyIGkgaW4gbm9kZS5jb250ZW50cykge1xuICAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDU1KTtcbiAgIH1cbiAgIGRlbGV0ZSBwYXJlbnQuY29udGVudHNbbmFtZV07XG4gIH0sXG4gIHJlYWRkaXI6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgIHZhciBlbnRyaWVzID0gWyBcIi5cIiwgXCIuLlwiIF07XG4gICBmb3IgKHZhciBrZXkgaW4gbm9kZS5jb250ZW50cykge1xuICAgIGlmICghbm9kZS5jb250ZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBlbnRyaWVzLnB1c2goa2V5KTtcbiAgIH1cbiAgIHJldHVybiBlbnRyaWVzO1xuICB9LFxuICBzeW1saW5rOiBmdW5jdGlvbihwYXJlbnQsIG5ld25hbWUsIG9sZHBhdGgpIHtcbiAgIHZhciBub2RlID0gTUVNRlMuY3JlYXRlTm9kZShwYXJlbnQsIG5ld25hbWUsIDUxMSB8IDQwOTYwLCAwKTtcbiAgIG5vZGUubGluayA9IG9sZHBhdGg7XG4gICByZXR1cm4gbm9kZTtcbiAgfSxcbiAgcmVhZGxpbms6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgIGlmICghRlMuaXNMaW5rKG5vZGUubW9kZSkpIHtcbiAgICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigyOCk7XG4gICB9XG4gICByZXR1cm4gbm9kZS5saW5rO1xuICB9XG4gfSxcbiBzdHJlYW1fb3BzOiB7XG4gIHJlYWQ6IGZ1bmN0aW9uKHN0cmVhbSwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24pIHtcbiAgIHZhciBjb250ZW50cyA9IHN0cmVhbS5ub2RlLmNvbnRlbnRzO1xuICAgaWYgKHBvc2l0aW9uID49IHN0cmVhbS5ub2RlLnVzZWRCeXRlcykgcmV0dXJuIDA7XG4gICB2YXIgc2l6ZSA9IE1hdGgubWluKHN0cmVhbS5ub2RlLnVzZWRCeXRlcyAtIHBvc2l0aW9uLCBsZW5ndGgpO1xuICAgYXNzZXJ0KHNpemUgPj0gMCk7XG4gICBpZiAoc2l6ZSA+IDggJiYgY29udGVudHMuc3ViYXJyYXkpIHtcbiAgICBidWZmZXIuc2V0KGNvbnRlbnRzLnN1YmFycmF5KHBvc2l0aW9uLCBwb3NpdGlvbiArIHNpemUpLCBvZmZzZXQpO1xuICAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykgYnVmZmVyW29mZnNldCArIGldID0gY29udGVudHNbcG9zaXRpb24gKyBpXTtcbiAgIH1cbiAgIHJldHVybiBzaXplO1xuICB9LFxuICB3cml0ZTogZnVuY3Rpb24oc3RyZWFtLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoLCBwb3NpdGlvbiwgY2FuT3duKSB7XG4gICBhc3NlcnQoIShidWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikpO1xuICAgaWYgKGJ1ZmZlci5idWZmZXIgPT09IEhFQVA4LmJ1ZmZlcikge1xuICAgIGNhbk93biA9IGZhbHNlO1xuICAgfVxuICAgaWYgKCFsZW5ndGgpIHJldHVybiAwO1xuICAgdmFyIG5vZGUgPSBzdHJlYW0ubm9kZTtcbiAgIG5vZGUudGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgIGlmIChidWZmZXIuc3ViYXJyYXkgJiYgKCFub2RlLmNvbnRlbnRzIHx8IG5vZGUuY29udGVudHMuc3ViYXJyYXkpKSB7XG4gICAgaWYgKGNhbk93bikge1xuICAgICBhc3NlcnQocG9zaXRpb24gPT09IDAsIFwiY2FuT3duIG11c3QgaW1wbHkgbm8gd2VpcmQgcG9zaXRpb24gaW5zaWRlIHRoZSBmaWxlXCIpO1xuICAgICBub2RlLmNvbnRlbnRzID0gYnVmZmVyLnN1YmFycmF5KG9mZnNldCwgb2Zmc2V0ICsgbGVuZ3RoKTtcbiAgICAgbm9kZS51c2VkQnl0ZXMgPSBsZW5ndGg7XG4gICAgIHJldHVybiBsZW5ndGg7XG4gICAgfSBlbHNlIGlmIChub2RlLnVzZWRCeXRlcyA9PT0gMCAmJiBwb3NpdGlvbiA9PT0gMCkge1xuICAgICBub2RlLmNvbnRlbnRzID0gYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgbGVuZ3RoKTtcbiAgICAgbm9kZS51c2VkQnl0ZXMgPSBsZW5ndGg7XG4gICAgIHJldHVybiBsZW5ndGg7XG4gICAgfSBlbHNlIGlmIChwb3NpdGlvbiArIGxlbmd0aCA8PSBub2RlLnVzZWRCeXRlcykge1xuICAgICBub2RlLmNvbnRlbnRzLnNldChidWZmZXIuc3ViYXJyYXkob2Zmc2V0LCBvZmZzZXQgKyBsZW5ndGgpLCBwb3NpdGlvbik7XG4gICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICAgfVxuICAgTUVNRlMuZXhwYW5kRmlsZVN0b3JhZ2Uobm9kZSwgcG9zaXRpb24gKyBsZW5ndGgpO1xuICAgaWYgKG5vZGUuY29udGVudHMuc3ViYXJyYXkgJiYgYnVmZmVyLnN1YmFycmF5KSB7XG4gICAgbm9kZS5jb250ZW50cy5zZXQoYnVmZmVyLnN1YmFycmF5KG9mZnNldCwgb2Zmc2V0ICsgbGVuZ3RoKSwgcG9zaXRpb24pO1xuICAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgIG5vZGUuY29udGVudHNbcG9zaXRpb24gKyBpXSA9IGJ1ZmZlcltvZmZzZXQgKyBpXTtcbiAgICB9XG4gICB9XG4gICBub2RlLnVzZWRCeXRlcyA9IE1hdGgubWF4KG5vZGUudXNlZEJ5dGVzLCBwb3NpdGlvbiArIGxlbmd0aCk7XG4gICByZXR1cm4gbGVuZ3RoO1xuICB9LFxuICBsbHNlZWs6IGZ1bmN0aW9uKHN0cmVhbSwgb2Zmc2V0LCB3aGVuY2UpIHtcbiAgIHZhciBwb3NpdGlvbiA9IG9mZnNldDtcbiAgIGlmICh3aGVuY2UgPT09IDEpIHtcbiAgICBwb3NpdGlvbiArPSBzdHJlYW0ucG9zaXRpb247XG4gICB9IGVsc2UgaWYgKHdoZW5jZSA9PT0gMikge1xuICAgIGlmIChGUy5pc0ZpbGUoc3RyZWFtLm5vZGUubW9kZSkpIHtcbiAgICAgcG9zaXRpb24gKz0gc3RyZWFtLm5vZGUudXNlZEJ5dGVzO1xuICAgIH1cbiAgIH1cbiAgIGlmIChwb3NpdGlvbiA8IDApIHtcbiAgICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigyOCk7XG4gICB9XG4gICByZXR1cm4gcG9zaXRpb247XG4gIH0sXG4gIGFsbG9jYXRlOiBmdW5jdGlvbihzdHJlYW0sIG9mZnNldCwgbGVuZ3RoKSB7XG4gICBNRU1GUy5leHBhbmRGaWxlU3RvcmFnZShzdHJlYW0ubm9kZSwgb2Zmc2V0ICsgbGVuZ3RoKTtcbiAgIHN0cmVhbS5ub2RlLnVzZWRCeXRlcyA9IE1hdGgubWF4KHN0cmVhbS5ub2RlLnVzZWRCeXRlcywgb2Zmc2V0ICsgbGVuZ3RoKTtcbiAgfSxcbiAgbW1hcDogZnVuY3Rpb24oc3RyZWFtLCBhZGRyZXNzLCBsZW5ndGgsIHBvc2l0aW9uLCBwcm90LCBmbGFncykge1xuICAgYXNzZXJ0KGFkZHJlc3MgPT09IDApO1xuICAgaWYgKCFGUy5pc0ZpbGUoc3RyZWFtLm5vZGUubW9kZSkpIHtcbiAgICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig0Myk7XG4gICB9XG4gICB2YXIgcHRyO1xuICAgdmFyIGFsbG9jYXRlZDtcbiAgIHZhciBjb250ZW50cyA9IHN0cmVhbS5ub2RlLmNvbnRlbnRzO1xuICAgaWYgKCEoZmxhZ3MgJiAyKSAmJiBjb250ZW50cy5idWZmZXIgPT09IGJ1ZmZlcikge1xuICAgIGFsbG9jYXRlZCA9IGZhbHNlO1xuICAgIHB0ciA9IGNvbnRlbnRzLmJ5dGVPZmZzZXQ7XG4gICB9IGVsc2Uge1xuICAgIGlmIChwb3NpdGlvbiA+IDAgfHwgcG9zaXRpb24gKyBsZW5ndGggPCBjb250ZW50cy5sZW5ndGgpIHtcbiAgICAgaWYgKGNvbnRlbnRzLnN1YmFycmF5KSB7XG4gICAgICBjb250ZW50cyA9IGNvbnRlbnRzLnN1YmFycmF5KHBvc2l0aW9uLCBwb3NpdGlvbiArIGxlbmd0aCk7XG4gICAgIH0gZWxzZSB7XG4gICAgICBjb250ZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGNvbnRlbnRzLCBwb3NpdGlvbiwgcG9zaXRpb24gKyBsZW5ndGgpO1xuICAgICB9XG4gICAgfVxuICAgIGFsbG9jYXRlZCA9IHRydWU7XG4gICAgcHRyID0gbW1hcEFsbG9jKGxlbmd0aCk7XG4gICAgaWYgKCFwdHIpIHtcbiAgICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNDgpO1xuICAgIH1cbiAgICBIRUFQOC5zZXQoY29udGVudHMsIHB0cik7XG4gICB9XG4gICByZXR1cm4ge1xuICAgIHB0cjogcHRyLFxuICAgIGFsbG9jYXRlZDogYWxsb2NhdGVkXG4gICB9O1xuICB9LFxuICBtc3luYzogZnVuY3Rpb24oc3RyZWFtLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoLCBtbWFwRmxhZ3MpIHtcbiAgIGlmICghRlMuaXNGaWxlKHN0cmVhbS5ub2RlLm1vZGUpKSB7XG4gICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNDMpO1xuICAgfVxuICAgaWYgKG1tYXBGbGFncyAmIDIpIHtcbiAgICByZXR1cm4gMDtcbiAgIH1cbiAgIHZhciBieXRlc1dyaXR0ZW4gPSBNRU1GUy5zdHJlYW1fb3BzLndyaXRlKHN0cmVhbSwgYnVmZmVyLCAwLCBsZW5ndGgsIG9mZnNldCwgZmFsc2UpO1xuICAgcmV0dXJuIDA7XG4gIH1cbiB9XG59O1xuXG52YXIgRVJSTk9fTUVTU0FHRVMgPSB7XG4gMDogXCJTdWNjZXNzXCIsXG4gMTogXCJBcmcgbGlzdCB0b28gbG9uZ1wiLFxuIDI6IFwiUGVybWlzc2lvbiBkZW5pZWRcIixcbiAzOiBcIkFkZHJlc3MgYWxyZWFkeSBpbiB1c2VcIixcbiA0OiBcIkFkZHJlc3Mgbm90IGF2YWlsYWJsZVwiLFxuIDU6IFwiQWRkcmVzcyBmYW1pbHkgbm90IHN1cHBvcnRlZCBieSBwcm90b2NvbCBmYW1pbHlcIixcbiA2OiBcIk5vIG1vcmUgcHJvY2Vzc2VzXCIsXG4gNzogXCJTb2NrZXQgYWxyZWFkeSBjb25uZWN0ZWRcIixcbiA4OiBcIkJhZCBmaWxlIG51bWJlclwiLFxuIDk6IFwiVHJ5aW5nIHRvIHJlYWQgdW5yZWFkYWJsZSBtZXNzYWdlXCIsXG4gMTA6IFwiTW91bnQgZGV2aWNlIGJ1c3lcIixcbiAxMTogXCJPcGVyYXRpb24gY2FuY2VsZWRcIixcbiAxMjogXCJObyBjaGlsZHJlblwiLFxuIDEzOiBcIkNvbm5lY3Rpb24gYWJvcnRlZFwiLFxuIDE0OiBcIkNvbm5lY3Rpb24gcmVmdXNlZFwiLFxuIDE1OiBcIkNvbm5lY3Rpb24gcmVzZXQgYnkgcGVlclwiLFxuIDE2OiBcIkZpbGUgbG9ja2luZyBkZWFkbG9jayBlcnJvclwiLFxuIDE3OiBcIkRlc3RpbmF0aW9uIGFkZHJlc3MgcmVxdWlyZWRcIixcbiAxODogXCJNYXRoIGFyZyBvdXQgb2YgZG9tYWluIG9mIGZ1bmNcIixcbiAxOTogXCJRdW90YSBleGNlZWRlZFwiLFxuIDIwOiBcIkZpbGUgZXhpc3RzXCIsXG4gMjE6IFwiQmFkIGFkZHJlc3NcIixcbiAyMjogXCJGaWxlIHRvbyBsYXJnZVwiLFxuIDIzOiBcIkhvc3QgaXMgdW5yZWFjaGFibGVcIixcbiAyNDogXCJJZGVudGlmaWVyIHJlbW92ZWRcIixcbiAyNTogXCJJbGxlZ2FsIGJ5dGUgc2VxdWVuY2VcIixcbiAyNjogXCJDb25uZWN0aW9uIGFscmVhZHkgaW4gcHJvZ3Jlc3NcIixcbiAyNzogXCJJbnRlcnJ1cHRlZCBzeXN0ZW0gY2FsbFwiLFxuIDI4OiBcIkludmFsaWQgYXJndW1lbnRcIixcbiAyOTogXCJJL08gZXJyb3JcIixcbiAzMDogXCJTb2NrZXQgaXMgYWxyZWFkeSBjb25uZWN0ZWRcIixcbiAzMTogXCJJcyBhIGRpcmVjdG9yeVwiLFxuIDMyOiBcIlRvbyBtYW55IHN5bWJvbGljIGxpbmtzXCIsXG4gMzM6IFwiVG9vIG1hbnkgb3BlbiBmaWxlc1wiLFxuIDM0OiBcIlRvbyBtYW55IGxpbmtzXCIsXG4gMzU6IFwiTWVzc2FnZSB0b28gbG9uZ1wiLFxuIDM2OiBcIk11bHRpaG9wIGF0dGVtcHRlZFwiLFxuIDM3OiBcIkZpbGUgb3IgcGF0aCBuYW1lIHRvbyBsb25nXCIsXG4gMzg6IFwiTmV0d29yayBpbnRlcmZhY2UgaXMgbm90IGNvbmZpZ3VyZWRcIixcbiAzOTogXCJDb25uZWN0aW9uIHJlc2V0IGJ5IG5ldHdvcmtcIixcbiA0MDogXCJOZXR3b3JrIGlzIHVucmVhY2hhYmxlXCIsXG4gNDE6IFwiVG9vIG1hbnkgb3BlbiBmaWxlcyBpbiBzeXN0ZW1cIixcbiA0MjogXCJObyBidWZmZXIgc3BhY2UgYXZhaWxhYmxlXCIsXG4gNDM6IFwiTm8gc3VjaCBkZXZpY2VcIixcbiA0NDogXCJObyBzdWNoIGZpbGUgb3IgZGlyZWN0b3J5XCIsXG4gNDU6IFwiRXhlYyBmb3JtYXQgZXJyb3JcIixcbiA0NjogXCJObyByZWNvcmQgbG9ja3MgYXZhaWxhYmxlXCIsXG4gNDc6IFwiVGhlIGxpbmsgaGFzIGJlZW4gc2V2ZXJlZFwiLFxuIDQ4OiBcIk5vdCBlbm91Z2ggY29yZVwiLFxuIDQ5OiBcIk5vIG1lc3NhZ2Ugb2YgZGVzaXJlZCB0eXBlXCIsXG4gNTA6IFwiUHJvdG9jb2wgbm90IGF2YWlsYWJsZVwiLFxuIDUxOiBcIk5vIHNwYWNlIGxlZnQgb24gZGV2aWNlXCIsXG4gNTI6IFwiRnVuY3Rpb24gbm90IGltcGxlbWVudGVkXCIsXG4gNTM6IFwiU29ja2V0IGlzIG5vdCBjb25uZWN0ZWRcIixcbiA1NDogXCJOb3QgYSBkaXJlY3RvcnlcIixcbiA1NTogXCJEaXJlY3Rvcnkgbm90IGVtcHR5XCIsXG4gNTY6IFwiU3RhdGUgbm90IHJlY292ZXJhYmxlXCIsXG4gNTc6IFwiU29ja2V0IG9wZXJhdGlvbiBvbiBub24tc29ja2V0XCIsXG4gNTk6IFwiTm90IGEgdHlwZXdyaXRlclwiLFxuIDYwOiBcIk5vIHN1Y2ggZGV2aWNlIG9yIGFkZHJlc3NcIixcbiA2MTogXCJWYWx1ZSB0b28gbGFyZ2UgZm9yIGRlZmluZWQgZGF0YSB0eXBlXCIsXG4gNjI6IFwiUHJldmlvdXMgb3duZXIgZGllZFwiLFxuIDYzOiBcIk5vdCBzdXBlci11c2VyXCIsXG4gNjQ6IFwiQnJva2VuIHBpcGVcIixcbiA2NTogXCJQcm90b2NvbCBlcnJvclwiLFxuIDY2OiBcIlVua25vd24gcHJvdG9jb2xcIixcbiA2NzogXCJQcm90b2NvbCB3cm9uZyB0eXBlIGZvciBzb2NrZXRcIixcbiA2ODogXCJNYXRoIHJlc3VsdCBub3QgcmVwcmVzZW50YWJsZVwiLFxuIDY5OiBcIlJlYWQgb25seSBmaWxlIHN5c3RlbVwiLFxuIDcwOiBcIklsbGVnYWwgc2Vla1wiLFxuIDcxOiBcIk5vIHN1Y2ggcHJvY2Vzc1wiLFxuIDcyOiBcIlN0YWxlIGZpbGUgaGFuZGxlXCIsXG4gNzM6IFwiQ29ubmVjdGlvbiB0aW1lZCBvdXRcIixcbiA3NDogXCJUZXh0IGZpbGUgYnVzeVwiLFxuIDc1OiBcIkNyb3NzLWRldmljZSBsaW5rXCIsXG4gMTAwOiBcIkRldmljZSBub3QgYSBzdHJlYW1cIixcbiAxMDE6IFwiQmFkIGZvbnQgZmlsZSBmbXRcIixcbiAxMDI6IFwiSW52YWxpZCBzbG90XCIsXG4gMTAzOiBcIkludmFsaWQgcmVxdWVzdCBjb2RlXCIsXG4gMTA0OiBcIk5vIGFub2RlXCIsXG4gMTA1OiBcIkJsb2NrIGRldmljZSByZXF1aXJlZFwiLFxuIDEwNjogXCJDaGFubmVsIG51bWJlciBvdXQgb2YgcmFuZ2VcIixcbiAxMDc6IFwiTGV2ZWwgMyBoYWx0ZWRcIixcbiAxMDg6IFwiTGV2ZWwgMyByZXNldFwiLFxuIDEwOTogXCJMaW5rIG51bWJlciBvdXQgb2YgcmFuZ2VcIixcbiAxMTA6IFwiUHJvdG9jb2wgZHJpdmVyIG5vdCBhdHRhY2hlZFwiLFxuIDExMTogXCJObyBDU0kgc3RydWN0dXJlIGF2YWlsYWJsZVwiLFxuIDExMjogXCJMZXZlbCAyIGhhbHRlZFwiLFxuIDExMzogXCJJbnZhbGlkIGV4Y2hhbmdlXCIsXG4gMTE0OiBcIkludmFsaWQgcmVxdWVzdCBkZXNjcmlwdG9yXCIsXG4gMTE1OiBcIkV4Y2hhbmdlIGZ1bGxcIixcbiAxMTY6IFwiTm8gZGF0YSAoZm9yIG5vIGRlbGF5IGlvKVwiLFxuIDExNzogXCJUaW1lciBleHBpcmVkXCIsXG4gMTE4OiBcIk91dCBvZiBzdHJlYW1zIHJlc291cmNlc1wiLFxuIDExOTogXCJNYWNoaW5lIGlzIG5vdCBvbiB0aGUgbmV0d29ya1wiLFxuIDEyMDogXCJQYWNrYWdlIG5vdCBpbnN0YWxsZWRcIixcbiAxMjE6IFwiVGhlIG9iamVjdCBpcyByZW1vdGVcIixcbiAxMjI6IFwiQWR2ZXJ0aXNlIGVycm9yXCIsXG4gMTIzOiBcIlNybW91bnQgZXJyb3JcIixcbiAxMjQ6IFwiQ29tbXVuaWNhdGlvbiBlcnJvciBvbiBzZW5kXCIsXG4gMTI1OiBcIkNyb3NzIG1vdW50IHBvaW50IChub3QgcmVhbGx5IGVycm9yKVwiLFxuIDEyNjogXCJHaXZlbiBsb2cuIG5hbWUgbm90IHVuaXF1ZVwiLFxuIDEyNzogXCJmLmQuIGludmFsaWQgZm9yIHRoaXMgb3BlcmF0aW9uXCIsXG4gMTI4OiBcIlJlbW90ZSBhZGRyZXNzIGNoYW5nZWRcIixcbiAxMjk6IFwiQ2FuICAgYWNjZXNzIGEgbmVlZGVkIHNoYXJlZCBsaWJcIixcbiAxMzA6IFwiQWNjZXNzaW5nIGEgY29ycnVwdGVkIHNoYXJlZCBsaWJcIixcbiAxMzE6IFwiLmxpYiBzZWN0aW9uIGluIGEub3V0IGNvcnJ1cHRlZFwiLFxuIDEzMjogXCJBdHRlbXB0aW5nIHRvIGxpbmsgaW4gdG9vIG1hbnkgbGlic1wiLFxuIDEzMzogXCJBdHRlbXB0aW5nIHRvIGV4ZWMgYSBzaGFyZWQgbGlicmFyeVwiLFxuIDEzNTogXCJTdHJlYW1zIHBpcGUgZXJyb3JcIixcbiAxMzY6IFwiVG9vIG1hbnkgdXNlcnNcIixcbiAxMzc6IFwiU29ja2V0IHR5cGUgbm90IHN1cHBvcnRlZFwiLFxuIDEzODogXCJOb3Qgc3VwcG9ydGVkXCIsXG4gMTM5OiBcIlByb3RvY29sIGZhbWlseSBub3Qgc3VwcG9ydGVkXCIsXG4gMTQwOiBcIkNhbid0IHNlbmQgYWZ0ZXIgc29ja2V0IHNodXRkb3duXCIsXG4gMTQxOiBcIlRvbyBtYW55IHJlZmVyZW5jZXNcIixcbiAxNDI6IFwiSG9zdCBpcyBkb3duXCIsXG4gMTQ4OiBcIk5vIG1lZGl1bSAoaW4gdGFwZSBkcml2ZSlcIixcbiAxNTY6IFwiTGV2ZWwgMiBub3Qgc3luY2hyb25pemVkXCJcbn07XG5cbnZhciBFUlJOT19DT0RFUyA9IHtcbiBFUEVSTTogNjMsXG4gRU5PRU5UOiA0NCxcbiBFU1JDSDogNzEsXG4gRUlOVFI6IDI3LFxuIEVJTzogMjksXG4gRU5YSU86IDYwLFxuIEUyQklHOiAxLFxuIEVOT0VYRUM6IDQ1LFxuIEVCQURGOiA4LFxuIEVDSElMRDogMTIsXG4gRUFHQUlOOiA2LFxuIEVXT1VMREJMT0NLOiA2LFxuIEVOT01FTTogNDgsXG4gRUFDQ0VTOiAyLFxuIEVGQVVMVDogMjEsXG4gRU5PVEJMSzogMTA1LFxuIEVCVVNZOiAxMCxcbiBFRVhJU1Q6IDIwLFxuIEVYREVWOiA3NSxcbiBFTk9ERVY6IDQzLFxuIEVOT1RESVI6IDU0LFxuIEVJU0RJUjogMzEsXG4gRUlOVkFMOiAyOCxcbiBFTkZJTEU6IDQxLFxuIEVNRklMRTogMzMsXG4gRU5PVFRZOiA1OSxcbiBFVFhUQlNZOiA3NCxcbiBFRkJJRzogMjIsXG4gRU5PU1BDOiA1MSxcbiBFU1BJUEU6IDcwLFxuIEVST0ZTOiA2OSxcbiBFTUxJTks6IDM0LFxuIEVQSVBFOiA2NCxcbiBFRE9NOiAxOCxcbiBFUkFOR0U6IDY4LFxuIEVOT01TRzogNDksXG4gRUlEUk06IDI0LFxuIEVDSFJORzogMTA2LFxuIEVMMk5TWU5DOiAxNTYsXG4gRUwzSExUOiAxMDcsXG4gRUwzUlNUOiAxMDgsXG4gRUxOUk5HOiAxMDksXG4gRVVOQVRDSDogMTEwLFxuIEVOT0NTSTogMTExLFxuIEVMMkhMVDogMTEyLFxuIEVERUFETEs6IDE2LFxuIEVOT0xDSzogNDYsXG4gRUJBREU6IDExMyxcbiBFQkFEUjogMTE0LFxuIEVYRlVMTDogMTE1LFxuIEVOT0FOTzogMTA0LFxuIEVCQURSUUM6IDEwMyxcbiBFQkFEU0xUOiAxMDIsXG4gRURFQURMT0NLOiAxNixcbiBFQkZPTlQ6IDEwMSxcbiBFTk9TVFI6IDEwMCxcbiBFTk9EQVRBOiAxMTYsXG4gRVRJTUU6IDExNyxcbiBFTk9TUjogMTE4LFxuIEVOT05FVDogMTE5LFxuIEVOT1BLRzogMTIwLFxuIEVSRU1PVEU6IDEyMSxcbiBFTk9MSU5LOiA0NyxcbiBFQURWOiAxMjIsXG4gRVNSTU5UOiAxMjMsXG4gRUNPTU06IDEyNCxcbiBFUFJPVE86IDY1LFxuIEVNVUxUSUhPUDogMzYsXG4gRURPVERPVDogMTI1LFxuIEVCQURNU0c6IDksXG4gRU5PVFVOSVE6IDEyNixcbiBFQkFERkQ6IDEyNyxcbiBFUkVNQ0hHOiAxMjgsXG4gRUxJQkFDQzogMTI5LFxuIEVMSUJCQUQ6IDEzMCxcbiBFTElCU0NOOiAxMzEsXG4gRUxJQk1BWDogMTMyLFxuIEVMSUJFWEVDOiAxMzMsXG4gRU5PU1lTOiA1MixcbiBFTk9URU1QVFk6IDU1LFxuIEVOQU1FVE9PTE9ORzogMzcsXG4gRUxPT1A6IDMyLFxuIEVPUE5PVFNVUFA6IDEzOCxcbiBFUEZOT1NVUFBPUlQ6IDEzOSxcbiBFQ09OTlJFU0VUOiAxNSxcbiBFTk9CVUZTOiA0MixcbiBFQUZOT1NVUFBPUlQ6IDUsXG4gRVBST1RPVFlQRTogNjcsXG4gRU5PVFNPQ0s6IDU3LFxuIEVOT1BST1RPT1BUOiA1MCxcbiBFU0hVVERPV046IDE0MCxcbiBFQ09OTlJFRlVTRUQ6IDE0LFxuIEVBRERSSU5VU0U6IDMsXG4gRUNPTk5BQk9SVEVEOiAxMyxcbiBFTkVUVU5SRUFDSDogNDAsXG4gRU5FVERPV046IDM4LFxuIEVUSU1FRE9VVDogNzMsXG4gRUhPU1RET1dOOiAxNDIsXG4gRUhPU1RVTlJFQUNIOiAyMyxcbiBFSU5QUk9HUkVTUzogMjYsXG4gRUFMUkVBRFk6IDcsXG4gRURFU1RBRERSUkVROiAxNyxcbiBFTVNHU0laRTogMzUsXG4gRVBST1RPTk9TVVBQT1JUOiA2NixcbiBFU09DS1ROT1NVUFBPUlQ6IDEzNyxcbiBFQUREUk5PVEFWQUlMOiA0LFxuIEVORVRSRVNFVDogMzksXG4gRUlTQ09OTjogMzAsXG4gRU5PVENPTk46IDUzLFxuIEVUT09NQU5ZUkVGUzogMTQxLFxuIEVVU0VSUzogMTM2LFxuIEVEUVVPVDogMTksXG4gRVNUQUxFOiA3MixcbiBFTk9UU1VQOiAxMzgsXG4gRU5PTUVESVVNOiAxNDgsXG4gRUlMU0VROiAyNSxcbiBFT1ZFUkZMT1c6IDYxLFxuIEVDQU5DRUxFRDogMTEsXG4gRU5PVFJFQ09WRVJBQkxFOiA1NixcbiBFT1dORVJERUFEOiA2MixcbiBFU1RSUElQRTogMTM1XG59O1xuXG52YXIgRlMgPSB7XG4gcm9vdDogbnVsbCxcbiBtb3VudHM6IFtdLFxuIGRldmljZXM6IHt9LFxuIHN0cmVhbXM6IFtdLFxuIG5leHRJbm9kZTogMSxcbiBuYW1lVGFibGU6IG51bGwsXG4gY3VycmVudFBhdGg6IFwiL1wiLFxuIGluaXRpYWxpemVkOiBmYWxzZSxcbiBpZ25vcmVQZXJtaXNzaW9uczogdHJ1ZSxcbiB0cmFja2luZ0RlbGVnYXRlOiB7fSxcbiB0cmFja2luZzoge1xuICBvcGVuRmxhZ3M6IHtcbiAgIFJFQUQ6IDEsXG4gICBXUklURTogMlxuICB9XG4gfSxcbiBFcnJub0Vycm9yOiBudWxsLFxuIGdlbmVyaWNFcnJvcnM6IHt9LFxuIGZpbGVzeXN0ZW1zOiBudWxsLFxuIHN5bmNGU1JlcXVlc3RzOiAwLFxuIGxvb2t1cFBhdGg6IGZ1bmN0aW9uKHBhdGgsIG9wdHMpIHtcbiAgcGF0aCA9IFBBVEhfRlMucmVzb2x2ZShGUy5jd2QoKSwgcGF0aCk7XG4gIG9wdHMgPSBvcHRzIHx8IHt9O1xuICBpZiAoIXBhdGgpIHJldHVybiB7XG4gICBwYXRoOiBcIlwiLFxuICAgbm9kZTogbnVsbFxuICB9O1xuICB2YXIgZGVmYXVsdHMgPSB7XG4gICBmb2xsb3dfbW91bnQ6IHRydWUsXG4gICByZWN1cnNlX2NvdW50OiAwXG4gIH07XG4gIGZvciAodmFyIGtleSBpbiBkZWZhdWx0cykge1xuICAgaWYgKG9wdHNba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0c1trZXldID0gZGVmYXVsdHNba2V5XTtcbiAgIH1cbiAgfVxuICBpZiAob3B0cy5yZWN1cnNlX2NvdW50ID4gOCkge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMzIpO1xuICB9XG4gIHZhciBwYXJ0cyA9IFBBVEgubm9ybWFsaXplQXJyYXkocGF0aC5zcGxpdChcIi9cIikuZmlsdGVyKGZ1bmN0aW9uKHApIHtcbiAgIHJldHVybiAhIXA7XG4gIH0pLCBmYWxzZSk7XG4gIHZhciBjdXJyZW50ID0gRlMucm9vdDtcbiAgdmFyIGN1cnJlbnRfcGF0aCA9IFwiL1wiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICB2YXIgaXNsYXN0ID0gaSA9PT0gcGFydHMubGVuZ3RoIC0gMTtcbiAgIGlmIChpc2xhc3QgJiYgb3B0cy5wYXJlbnQpIHtcbiAgICBicmVhaztcbiAgIH1cbiAgIGN1cnJlbnQgPSBGUy5sb29rdXBOb2RlKGN1cnJlbnQsIHBhcnRzW2ldKTtcbiAgIGN1cnJlbnRfcGF0aCA9IFBBVEguam9pbjIoY3VycmVudF9wYXRoLCBwYXJ0c1tpXSk7XG4gICBpZiAoRlMuaXNNb3VudHBvaW50KGN1cnJlbnQpKSB7XG4gICAgaWYgKCFpc2xhc3QgfHwgaXNsYXN0ICYmIG9wdHMuZm9sbG93X21vdW50KSB7XG4gICAgIGN1cnJlbnQgPSBjdXJyZW50Lm1vdW50ZWQucm9vdDtcbiAgICB9XG4gICB9XG4gICBpZiAoIWlzbGFzdCB8fCBvcHRzLmZvbGxvdykge1xuICAgIHZhciBjb3VudCA9IDA7XG4gICAgd2hpbGUgKEZTLmlzTGluayhjdXJyZW50Lm1vZGUpKSB7XG4gICAgIHZhciBsaW5rID0gRlMucmVhZGxpbmsoY3VycmVudF9wYXRoKTtcbiAgICAgY3VycmVudF9wYXRoID0gUEFUSF9GUy5yZXNvbHZlKFBBVEguZGlybmFtZShjdXJyZW50X3BhdGgpLCBsaW5rKTtcbiAgICAgdmFyIGxvb2t1cCA9IEZTLmxvb2t1cFBhdGgoY3VycmVudF9wYXRoLCB7XG4gICAgICByZWN1cnNlX2NvdW50OiBvcHRzLnJlY3Vyc2VfY291bnRcbiAgICAgfSk7XG4gICAgIGN1cnJlbnQgPSBsb29rdXAubm9kZTtcbiAgICAgaWYgKGNvdW50KysgPiA0MCkge1xuICAgICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMzIpO1xuICAgICB9XG4gICAgfVxuICAgfVxuICB9XG4gIHJldHVybiB7XG4gICBwYXRoOiBjdXJyZW50X3BhdGgsXG4gICBub2RlOiBjdXJyZW50XG4gIH07XG4gfSxcbiBnZXRQYXRoOiBmdW5jdGlvbihub2RlKSB7XG4gIHZhciBwYXRoO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgaWYgKEZTLmlzUm9vdChub2RlKSkge1xuICAgIHZhciBtb3VudCA9IG5vZGUubW91bnQubW91bnRwb2ludDtcbiAgICBpZiAoIXBhdGgpIHJldHVybiBtb3VudDtcbiAgICByZXR1cm4gbW91bnRbbW91bnQubGVuZ3RoIC0gMV0gIT09IFwiL1wiID8gbW91bnQgKyBcIi9cIiArIHBhdGggOiBtb3VudCArIHBhdGg7XG4gICB9XG4gICBwYXRoID0gcGF0aCA/IG5vZGUubmFtZSArIFwiL1wiICsgcGF0aCA6IG5vZGUubmFtZTtcbiAgIG5vZGUgPSBub2RlLnBhcmVudDtcbiAgfVxuIH0sXG4gaGFzaE5hbWU6IGZ1bmN0aW9uKHBhcmVudGlkLCBuYW1lKSB7XG4gIHZhciBoYXNoID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lLmxlbmd0aDsgaSsrKSB7XG4gICBoYXNoID0gKGhhc2ggPDwgNSkgLSBoYXNoICsgbmFtZS5jaGFyQ29kZUF0KGkpIHwgMDtcbiAgfVxuICByZXR1cm4gKHBhcmVudGlkICsgaGFzaCA+Pj4gMCkgJSBGUy5uYW1lVGFibGUubGVuZ3RoO1xuIH0sXG4gaGFzaEFkZE5vZGU6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgdmFyIGhhc2ggPSBGUy5oYXNoTmFtZShub2RlLnBhcmVudC5pZCwgbm9kZS5uYW1lKTtcbiAgbm9kZS5uYW1lX25leHQgPSBGUy5uYW1lVGFibGVbaGFzaF07XG4gIEZTLm5hbWVUYWJsZVtoYXNoXSA9IG5vZGU7XG4gfSxcbiBoYXNoUmVtb3ZlTm9kZTogZnVuY3Rpb24obm9kZSkge1xuICB2YXIgaGFzaCA9IEZTLmhhc2hOYW1lKG5vZGUucGFyZW50LmlkLCBub2RlLm5hbWUpO1xuICBpZiAoRlMubmFtZVRhYmxlW2hhc2hdID09PSBub2RlKSB7XG4gICBGUy5uYW1lVGFibGVbaGFzaF0gPSBub2RlLm5hbWVfbmV4dDtcbiAgfSBlbHNlIHtcbiAgIHZhciBjdXJyZW50ID0gRlMubmFtZVRhYmxlW2hhc2hdO1xuICAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICBpZiAoY3VycmVudC5uYW1lX25leHQgPT09IG5vZGUpIHtcbiAgICAgY3VycmVudC5uYW1lX25leHQgPSBub2RlLm5hbWVfbmV4dDtcbiAgICAgYnJlYWs7XG4gICAgfVxuICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5hbWVfbmV4dDtcbiAgIH1cbiAgfVxuIH0sXG4gbG9va3VwTm9kZTogZnVuY3Rpb24ocGFyZW50LCBuYW1lKSB7XG4gIHZhciBlcnJDb2RlID0gRlMubWF5TG9va3VwKHBhcmVudCk7XG4gIGlmIChlcnJDb2RlKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcihlcnJDb2RlLCBwYXJlbnQpO1xuICB9XG4gIHZhciBoYXNoID0gRlMuaGFzaE5hbWUocGFyZW50LmlkLCBuYW1lKTtcbiAgZm9yICh2YXIgbm9kZSA9IEZTLm5hbWVUYWJsZVtoYXNoXTsgbm9kZTsgbm9kZSA9IG5vZGUubmFtZV9uZXh0KSB7XG4gICB2YXIgbm9kZU5hbWUgPSBub2RlLm5hbWU7XG4gICBpZiAobm9kZS5wYXJlbnQuaWQgPT09IHBhcmVudC5pZCAmJiBub2RlTmFtZSA9PT0gbmFtZSkge1xuICAgIHJldHVybiBub2RlO1xuICAgfVxuICB9XG4gIHJldHVybiBGUy5sb29rdXAocGFyZW50LCBuYW1lKTtcbiB9LFxuIGNyZWF0ZU5vZGU6IGZ1bmN0aW9uKHBhcmVudCwgbmFtZSwgbW9kZSwgcmRldikge1xuICB2YXIgbm9kZSA9IG5ldyBGUy5GU05vZGUocGFyZW50LCBuYW1lLCBtb2RlLCByZGV2KTtcbiAgRlMuaGFzaEFkZE5vZGUobm9kZSk7XG4gIHJldHVybiBub2RlO1xuIH0sXG4gZGVzdHJveU5vZGU6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgRlMuaGFzaFJlbW92ZU5vZGUobm9kZSk7XG4gfSxcbiBpc1Jvb3Q6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgPT09IG5vZGUucGFyZW50O1xuIH0sXG4gaXNNb3VudHBvaW50OiBmdW5jdGlvbihub2RlKSB7XG4gIHJldHVybiAhIW5vZGUubW91bnRlZDtcbiB9LFxuIGlzRmlsZTogZnVuY3Rpb24obW9kZSkge1xuICByZXR1cm4gKG1vZGUgJiA2MTQ0MCkgPT09IDMyNzY4O1xuIH0sXG4gaXNEaXI6IGZ1bmN0aW9uKG1vZGUpIHtcbiAgcmV0dXJuIChtb2RlICYgNjE0NDApID09PSAxNjM4NDtcbiB9LFxuIGlzTGluazogZnVuY3Rpb24obW9kZSkge1xuICByZXR1cm4gKG1vZGUgJiA2MTQ0MCkgPT09IDQwOTYwO1xuIH0sXG4gaXNDaHJkZXY6IGZ1bmN0aW9uKG1vZGUpIHtcbiAgcmV0dXJuIChtb2RlICYgNjE0NDApID09PSA4MTkyO1xuIH0sXG4gaXNCbGtkZXY6IGZ1bmN0aW9uKG1vZGUpIHtcbiAgcmV0dXJuIChtb2RlICYgNjE0NDApID09PSAyNDU3NjtcbiB9LFxuIGlzRklGTzogZnVuY3Rpb24obW9kZSkge1xuICByZXR1cm4gKG1vZGUgJiA2MTQ0MCkgPT09IDQwOTY7XG4gfSxcbiBpc1NvY2tldDogZnVuY3Rpb24obW9kZSkge1xuICByZXR1cm4gKG1vZGUgJiA0OTE1MikgPT09IDQ5MTUyO1xuIH0sXG4gZmxhZ01vZGVzOiB7XG4gIFwiclwiOiAwLFxuICBcInIrXCI6IDIsXG4gIFwid1wiOiA1NzcsXG4gIFwidytcIjogNTc4LFxuICBcImFcIjogMTA4OSxcbiAgXCJhK1wiOiAxMDkwXG4gfSxcbiBtb2RlU3RyaW5nVG9GbGFnczogZnVuY3Rpb24oc3RyKSB7XG4gIHZhciBmbGFncyA9IEZTLmZsYWdNb2Rlc1tzdHJdO1xuICBpZiAodHlwZW9mIGZsYWdzID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGZpbGUgb3BlbiBtb2RlOiBcIiArIHN0cik7XG4gIH1cbiAgcmV0dXJuIGZsYWdzO1xuIH0sXG4gZmxhZ3NUb1Blcm1pc3Npb25TdHJpbmc6IGZ1bmN0aW9uKGZsYWcpIHtcbiAgdmFyIHBlcm1zID0gWyBcInJcIiwgXCJ3XCIsIFwicndcIiBdW2ZsYWcgJiAzXTtcbiAgaWYgKGZsYWcgJiA1MTIpIHtcbiAgIHBlcm1zICs9IFwid1wiO1xuICB9XG4gIHJldHVybiBwZXJtcztcbiB9LFxuIG5vZGVQZXJtaXNzaW9uczogZnVuY3Rpb24obm9kZSwgcGVybXMpIHtcbiAgaWYgKEZTLmlnbm9yZVBlcm1pc3Npb25zKSB7XG4gICByZXR1cm4gMDtcbiAgfVxuICBpZiAocGVybXMuaW5kZXhPZihcInJcIikgIT09IC0xICYmICEobm9kZS5tb2RlICYgMjkyKSkge1xuICAgcmV0dXJuIDI7XG4gIH0gZWxzZSBpZiAocGVybXMuaW5kZXhPZihcIndcIikgIT09IC0xICYmICEobm9kZS5tb2RlICYgMTQ2KSkge1xuICAgcmV0dXJuIDI7XG4gIH0gZWxzZSBpZiAocGVybXMuaW5kZXhPZihcInhcIikgIT09IC0xICYmICEobm9kZS5tb2RlICYgNzMpKSB7XG4gICByZXR1cm4gMjtcbiAgfVxuICByZXR1cm4gMDtcbiB9LFxuIG1heUxvb2t1cDogZnVuY3Rpb24oZGlyKSB7XG4gIHZhciBlcnJDb2RlID0gRlMubm9kZVBlcm1pc3Npb25zKGRpciwgXCJ4XCIpO1xuICBpZiAoZXJyQ29kZSkgcmV0dXJuIGVyckNvZGU7XG4gIGlmICghZGlyLm5vZGVfb3BzLmxvb2t1cCkgcmV0dXJuIDI7XG4gIHJldHVybiAwO1xuIH0sXG4gbWF5Q3JlYXRlOiBmdW5jdGlvbihkaXIsIG5hbWUpIHtcbiAgdHJ5IHtcbiAgIHZhciBub2RlID0gRlMubG9va3VwTm9kZShkaXIsIG5hbWUpO1xuICAgcmV0dXJuIDIwO1xuICB9IGNhdGNoIChlKSB7fVxuICByZXR1cm4gRlMubm9kZVBlcm1pc3Npb25zKGRpciwgXCJ3eFwiKTtcbiB9LFxuIG1heURlbGV0ZTogZnVuY3Rpb24oZGlyLCBuYW1lLCBpc2Rpcikge1xuICB2YXIgbm9kZTtcbiAgdHJ5IHtcbiAgIG5vZGUgPSBGUy5sb29rdXBOb2RlKGRpciwgbmFtZSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgIHJldHVybiBlLmVycm5vO1xuICB9XG4gIHZhciBlcnJDb2RlID0gRlMubm9kZVBlcm1pc3Npb25zKGRpciwgXCJ3eFwiKTtcbiAgaWYgKGVyckNvZGUpIHtcbiAgIHJldHVybiBlcnJDb2RlO1xuICB9XG4gIGlmIChpc2Rpcikge1xuICAgaWYgKCFGUy5pc0Rpcihub2RlLm1vZGUpKSB7XG4gICAgcmV0dXJuIDU0O1xuICAgfVxuICAgaWYgKEZTLmlzUm9vdChub2RlKSB8fCBGUy5nZXRQYXRoKG5vZGUpID09PSBGUy5jd2QoKSkge1xuICAgIHJldHVybiAxMDtcbiAgIH1cbiAgfSBlbHNlIHtcbiAgIGlmIChGUy5pc0Rpcihub2RlLm1vZGUpKSB7XG4gICAgcmV0dXJuIDMxO1xuICAgfVxuICB9XG4gIHJldHVybiAwO1xuIH0sXG4gbWF5T3BlbjogZnVuY3Rpb24obm9kZSwgZmxhZ3MpIHtcbiAgaWYgKCFub2RlKSB7XG4gICByZXR1cm4gNDQ7XG4gIH1cbiAgaWYgKEZTLmlzTGluayhub2RlLm1vZGUpKSB7XG4gICByZXR1cm4gMzI7XG4gIH0gZWxzZSBpZiAoRlMuaXNEaXIobm9kZS5tb2RlKSkge1xuICAgaWYgKEZTLmZsYWdzVG9QZXJtaXNzaW9uU3RyaW5nKGZsYWdzKSAhPT0gXCJyXCIgfHwgZmxhZ3MgJiA1MTIpIHtcbiAgICByZXR1cm4gMzE7XG4gICB9XG4gIH1cbiAgcmV0dXJuIEZTLm5vZGVQZXJtaXNzaW9ucyhub2RlLCBGUy5mbGFnc1RvUGVybWlzc2lvblN0cmluZyhmbGFncykpO1xuIH0sXG4gTUFYX09QRU5fRkRTOiA0MDk2LFxuIG5leHRmZDogZnVuY3Rpb24oZmRfc3RhcnQsIGZkX2VuZCkge1xuICBmZF9zdGFydCA9IGZkX3N0YXJ0IHx8IDA7XG4gIGZkX2VuZCA9IGZkX2VuZCB8fCBGUy5NQVhfT1BFTl9GRFM7XG4gIGZvciAodmFyIGZkID0gZmRfc3RhcnQ7IGZkIDw9IGZkX2VuZDsgZmQrKykge1xuICAgaWYgKCFGUy5zdHJlYW1zW2ZkXSkge1xuICAgIHJldHVybiBmZDtcbiAgIH1cbiAgfVxuICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigzMyk7XG4gfSxcbiBnZXRTdHJlYW06IGZ1bmN0aW9uKGZkKSB7XG4gIHJldHVybiBGUy5zdHJlYW1zW2ZkXTtcbiB9LFxuIGNyZWF0ZVN0cmVhbTogZnVuY3Rpb24oc3RyZWFtLCBmZF9zdGFydCwgZmRfZW5kKSB7XG4gIGlmICghRlMuRlNTdHJlYW0pIHtcbiAgIEZTLkZTU3RyZWFtID0gZnVuY3Rpb24oKSB7fTtcbiAgIEZTLkZTU3RyZWFtLnByb3RvdHlwZSA9IHtcbiAgICBvYmplY3Q6IHtcbiAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLm5vZGU7XG4gICAgIH0sXG4gICAgIHNldDogZnVuY3Rpb24odmFsKSB7XG4gICAgICB0aGlzLm5vZGUgPSB2YWw7XG4gICAgIH1cbiAgICB9LFxuICAgIGlzUmVhZDoge1xuICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICh0aGlzLmZsYWdzICYgMjA5NzE1NSkgIT09IDE7XG4gICAgIH1cbiAgICB9LFxuICAgIGlzV3JpdGU6IHtcbiAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAodGhpcy5mbGFncyAmIDIwOTcxNTUpICE9PSAwO1xuICAgICB9XG4gICAgfSxcbiAgICBpc0FwcGVuZDoge1xuICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmxhZ3MgJiAxMDI0O1xuICAgICB9XG4gICAgfVxuICAgfTtcbiAgfVxuICB2YXIgbmV3U3RyZWFtID0gbmV3IEZTLkZTU3RyZWFtKCk7XG4gIGZvciAodmFyIHAgaW4gc3RyZWFtKSB7XG4gICBuZXdTdHJlYW1bcF0gPSBzdHJlYW1bcF07XG4gIH1cbiAgc3RyZWFtID0gbmV3U3RyZWFtO1xuICB2YXIgZmQgPSBGUy5uZXh0ZmQoZmRfc3RhcnQsIGZkX2VuZCk7XG4gIHN0cmVhbS5mZCA9IGZkO1xuICBGUy5zdHJlYW1zW2ZkXSA9IHN0cmVhbTtcbiAgcmV0dXJuIHN0cmVhbTtcbiB9LFxuIGNsb3NlU3RyZWFtOiBmdW5jdGlvbihmZCkge1xuICBGUy5zdHJlYW1zW2ZkXSA9IG51bGw7XG4gfSxcbiBjaHJkZXZfc3RyZWFtX29wczoge1xuICBvcGVuOiBmdW5jdGlvbihzdHJlYW0pIHtcbiAgIHZhciBkZXZpY2UgPSBGUy5nZXREZXZpY2Uoc3RyZWFtLm5vZGUucmRldik7XG4gICBzdHJlYW0uc3RyZWFtX29wcyA9IGRldmljZS5zdHJlYW1fb3BzO1xuICAgaWYgKHN0cmVhbS5zdHJlYW1fb3BzLm9wZW4pIHtcbiAgICBzdHJlYW0uc3RyZWFtX29wcy5vcGVuKHN0cmVhbSk7XG4gICB9XG4gIH0sXG4gIGxsc2VlazogZnVuY3Rpb24oKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig3MCk7XG4gIH1cbiB9LFxuIG1ham9yOiBmdW5jdGlvbihkZXYpIHtcbiAgcmV0dXJuIGRldiA+PiA4O1xuIH0sXG4gbWlub3I6IGZ1bmN0aW9uKGRldikge1xuICByZXR1cm4gZGV2ICYgMjU1O1xuIH0sXG4gbWFrZWRldjogZnVuY3Rpb24obWEsIG1pKSB7XG4gIHJldHVybiBtYSA8PCA4IHwgbWk7XG4gfSxcbiByZWdpc3RlckRldmljZTogZnVuY3Rpb24oZGV2LCBvcHMpIHtcbiAgRlMuZGV2aWNlc1tkZXZdID0ge1xuICAgc3RyZWFtX29wczogb3BzXG4gIH07XG4gfSxcbiBnZXREZXZpY2U6IGZ1bmN0aW9uKGRldikge1xuICByZXR1cm4gRlMuZGV2aWNlc1tkZXZdO1xuIH0sXG4gZ2V0TW91bnRzOiBmdW5jdGlvbihtb3VudCkge1xuICB2YXIgbW91bnRzID0gW107XG4gIHZhciBjaGVjayA9IFsgbW91bnQgXTtcbiAgd2hpbGUgKGNoZWNrLmxlbmd0aCkge1xuICAgdmFyIG0gPSBjaGVjay5wb3AoKTtcbiAgIG1vdW50cy5wdXNoKG0pO1xuICAgY2hlY2sucHVzaC5hcHBseShjaGVjaywgbS5tb3VudHMpO1xuICB9XG4gIHJldHVybiBtb3VudHM7XG4gfSxcbiBzeW5jZnM6IGZ1bmN0aW9uKHBvcHVsYXRlLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIHBvcHVsYXRlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgIGNhbGxiYWNrID0gcG9wdWxhdGU7XG4gICBwb3B1bGF0ZSA9IGZhbHNlO1xuICB9XG4gIEZTLnN5bmNGU1JlcXVlc3RzKys7XG4gIGlmIChGUy5zeW5jRlNSZXF1ZXN0cyA+IDEpIHtcbiAgIGVycihcIndhcm5pbmc6IFwiICsgRlMuc3luY0ZTUmVxdWVzdHMgKyBcIiBGUy5zeW5jZnMgb3BlcmF0aW9ucyBpbiBmbGlnaHQgYXQgb25jZSwgcHJvYmFibHkganVzdCBkb2luZyBleHRyYSB3b3JrXCIpO1xuICB9XG4gIHZhciBtb3VudHMgPSBGUy5nZXRNb3VudHMoRlMucm9vdC5tb3VudCk7XG4gIHZhciBjb21wbGV0ZWQgPSAwO1xuICBmdW5jdGlvbiBkb0NhbGxiYWNrKGVyckNvZGUpIHtcbiAgIGFzc2VydChGUy5zeW5jRlNSZXF1ZXN0cyA+IDApO1xuICAgRlMuc3luY0ZTUmVxdWVzdHMtLTtcbiAgIHJldHVybiBjYWxsYmFjayhlcnJDb2RlKTtcbiAgfVxuICBmdW5jdGlvbiBkb25lKGVyckNvZGUpIHtcbiAgIGlmIChlcnJDb2RlKSB7XG4gICAgaWYgKCFkb25lLmVycm9yZWQpIHtcbiAgICAgZG9uZS5lcnJvcmVkID0gdHJ1ZTtcbiAgICAgcmV0dXJuIGRvQ2FsbGJhY2soZXJyQ29kZSk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgIH1cbiAgIGlmICgrK2NvbXBsZXRlZCA+PSBtb3VudHMubGVuZ3RoKSB7XG4gICAgZG9DYWxsYmFjayhudWxsKTtcbiAgIH1cbiAgfVxuICBtb3VudHMuZm9yRWFjaChmdW5jdGlvbihtb3VudCkge1xuICAgaWYgKCFtb3VudC50eXBlLnN5bmNmcykge1xuICAgIHJldHVybiBkb25lKG51bGwpO1xuICAgfVxuICAgbW91bnQudHlwZS5zeW5jZnMobW91bnQsIHBvcHVsYXRlLCBkb25lKTtcbiAgfSk7XG4gfSxcbiBtb3VudDogZnVuY3Rpb24odHlwZSwgb3B0cywgbW91bnRwb2ludCkge1xuICBpZiAodHlwZW9mIHR5cGUgPT09IFwic3RyaW5nXCIpIHtcbiAgIHRocm93IHR5cGU7XG4gIH1cbiAgdmFyIHJvb3QgPSBtb3VudHBvaW50ID09PSBcIi9cIjtcbiAgdmFyIHBzZXVkbyA9ICFtb3VudHBvaW50O1xuICB2YXIgbm9kZTtcbiAgaWYgKHJvb3QgJiYgRlMucm9vdCkge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMTApO1xuICB9IGVsc2UgaWYgKCFyb290ICYmICFwc2V1ZG8pIHtcbiAgIHZhciBsb29rdXAgPSBGUy5sb29rdXBQYXRoKG1vdW50cG9pbnQsIHtcbiAgICBmb2xsb3dfbW91bnQ6IGZhbHNlXG4gICB9KTtcbiAgIG1vdW50cG9pbnQgPSBsb29rdXAucGF0aDtcbiAgIG5vZGUgPSBsb29rdXAubm9kZTtcbiAgIGlmIChGUy5pc01vdW50cG9pbnQobm9kZSkpIHtcbiAgICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigxMCk7XG4gICB9XG4gICBpZiAoIUZTLmlzRGlyKG5vZGUubW9kZSkpIHtcbiAgICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig1NCk7XG4gICB9XG4gIH1cbiAgdmFyIG1vdW50ID0ge1xuICAgdHlwZTogdHlwZSxcbiAgIG9wdHM6IG9wdHMsXG4gICBtb3VudHBvaW50OiBtb3VudHBvaW50LFxuICAgbW91bnRzOiBbXVxuICB9O1xuICB2YXIgbW91bnRSb290ID0gdHlwZS5tb3VudChtb3VudCk7XG4gIG1vdW50Um9vdC5tb3VudCA9IG1vdW50O1xuICBtb3VudC5yb290ID0gbW91bnRSb290O1xuICBpZiAocm9vdCkge1xuICAgRlMucm9vdCA9IG1vdW50Um9vdDtcbiAgfSBlbHNlIGlmIChub2RlKSB7XG4gICBub2RlLm1vdW50ZWQgPSBtb3VudDtcbiAgIGlmIChub2RlLm1vdW50KSB7XG4gICAgbm9kZS5tb3VudC5tb3VudHMucHVzaChtb3VudCk7XG4gICB9XG4gIH1cbiAgcmV0dXJuIG1vdW50Um9vdDtcbiB9LFxuIHVubW91bnQ6IGZ1bmN0aW9uKG1vdW50cG9pbnQpIHtcbiAgdmFyIGxvb2t1cCA9IEZTLmxvb2t1cFBhdGgobW91bnRwb2ludCwge1xuICAgZm9sbG93X21vdW50OiBmYWxzZVxuICB9KTtcbiAgaWYgKCFGUy5pc01vdW50cG9pbnQobG9va3VwLm5vZGUpKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigyOCk7XG4gIH1cbiAgdmFyIG5vZGUgPSBsb29rdXAubm9kZTtcbiAgdmFyIG1vdW50ID0gbm9kZS5tb3VudGVkO1xuICB2YXIgbW91bnRzID0gRlMuZ2V0TW91bnRzKG1vdW50KTtcbiAgT2JqZWN0LmtleXMoRlMubmFtZVRhYmxlKS5mb3JFYWNoKGZ1bmN0aW9uKGhhc2gpIHtcbiAgIHZhciBjdXJyZW50ID0gRlMubmFtZVRhYmxlW2hhc2hdO1xuICAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICB2YXIgbmV4dCA9IGN1cnJlbnQubmFtZV9uZXh0O1xuICAgIGlmIChtb3VudHMuaW5kZXhPZihjdXJyZW50Lm1vdW50KSAhPT0gLTEpIHtcbiAgICAgRlMuZGVzdHJveU5vZGUoY3VycmVudCk7XG4gICAgfVxuICAgIGN1cnJlbnQgPSBuZXh0O1xuICAgfVxuICB9KTtcbiAgbm9kZS5tb3VudGVkID0gbnVsbDtcbiAgdmFyIGlkeCA9IG5vZGUubW91bnQubW91bnRzLmluZGV4T2YobW91bnQpO1xuICBhc3NlcnQoaWR4ICE9PSAtMSk7XG4gIG5vZGUubW91bnQubW91bnRzLnNwbGljZShpZHgsIDEpO1xuIH0sXG4gbG9va3VwOiBmdW5jdGlvbihwYXJlbnQsIG5hbWUpIHtcbiAgcmV0dXJuIHBhcmVudC5ub2RlX29wcy5sb29rdXAocGFyZW50LCBuYW1lKTtcbiB9LFxuIG1rbm9kOiBmdW5jdGlvbihwYXRoLCBtb2RlLCBkZXYpIHtcbiAgdmFyIGxvb2t1cCA9IEZTLmxvb2t1cFBhdGgocGF0aCwge1xuICAgcGFyZW50OiB0cnVlXG4gIH0pO1xuICB2YXIgcGFyZW50ID0gbG9va3VwLm5vZGU7XG4gIHZhciBuYW1lID0gUEFUSC5iYXNlbmFtZShwYXRoKTtcbiAgaWYgKCFuYW1lIHx8IG5hbWUgPT09IFwiLlwiIHx8IG5hbWUgPT09IFwiLi5cIikge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMjgpO1xuICB9XG4gIHZhciBlcnJDb2RlID0gRlMubWF5Q3JlYXRlKHBhcmVudCwgbmFtZSk7XG4gIGlmIChlcnJDb2RlKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcihlcnJDb2RlKTtcbiAgfVxuICBpZiAoIXBhcmVudC5ub2RlX29wcy5ta25vZCkge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNjMpO1xuICB9XG4gIHJldHVybiBwYXJlbnQubm9kZV9vcHMubWtub2QocGFyZW50LCBuYW1lLCBtb2RlLCBkZXYpO1xuIH0sXG4gY3JlYXRlOiBmdW5jdGlvbihwYXRoLCBtb2RlKSB7XG4gIG1vZGUgPSBtb2RlICE9PSB1bmRlZmluZWQgPyBtb2RlIDogNDM4O1xuICBtb2RlICY9IDQwOTU7XG4gIG1vZGUgfD0gMzI3Njg7XG4gIHJldHVybiBGUy5ta25vZChwYXRoLCBtb2RlLCAwKTtcbiB9LFxuIG1rZGlyOiBmdW5jdGlvbihwYXRoLCBtb2RlKSB7XG4gIG1vZGUgPSBtb2RlICE9PSB1bmRlZmluZWQgPyBtb2RlIDogNTExO1xuICBtb2RlICY9IDUxMSB8IDUxMjtcbiAgbW9kZSB8PSAxNjM4NDtcbiAgcmV0dXJuIEZTLm1rbm9kKHBhdGgsIG1vZGUsIDApO1xuIH0sXG4gbWtkaXJUcmVlOiBmdW5jdGlvbihwYXRoLCBtb2RlKSB7XG4gIHZhciBkaXJzID0gcGF0aC5zcGxpdChcIi9cIik7XG4gIHZhciBkID0gXCJcIjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXJzLmxlbmd0aDsgKytpKSB7XG4gICBpZiAoIWRpcnNbaV0pIGNvbnRpbnVlO1xuICAgZCArPSBcIi9cIiArIGRpcnNbaV07XG4gICB0cnkge1xuICAgIEZTLm1rZGlyKGQsIG1vZGUpO1xuICAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChlLmVycm5vICE9IDIwKSB0aHJvdyBlO1xuICAgfVxuICB9XG4gfSxcbiBta2RldjogZnVuY3Rpb24ocGF0aCwgbW9kZSwgZGV2KSB7XG4gIGlmICh0eXBlb2YgZGV2ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICBkZXYgPSBtb2RlO1xuICAgbW9kZSA9IDQzODtcbiAgfVxuICBtb2RlIHw9IDgxOTI7XG4gIHJldHVybiBGUy5ta25vZChwYXRoLCBtb2RlLCBkZXYpO1xuIH0sXG4gc3ltbGluazogZnVuY3Rpb24ob2xkcGF0aCwgbmV3cGF0aCkge1xuICBpZiAoIVBBVEhfRlMucmVzb2x2ZShvbGRwYXRoKSkge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNDQpO1xuICB9XG4gIHZhciBsb29rdXAgPSBGUy5sb29rdXBQYXRoKG5ld3BhdGgsIHtcbiAgIHBhcmVudDogdHJ1ZVxuICB9KTtcbiAgdmFyIHBhcmVudCA9IGxvb2t1cC5ub2RlO1xuICBpZiAoIXBhcmVudCkge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNDQpO1xuICB9XG4gIHZhciBuZXduYW1lID0gUEFUSC5iYXNlbmFtZShuZXdwYXRoKTtcbiAgdmFyIGVyckNvZGUgPSBGUy5tYXlDcmVhdGUocGFyZW50LCBuZXduYW1lKTtcbiAgaWYgKGVyckNvZGUpIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKGVyckNvZGUpO1xuICB9XG4gIGlmICghcGFyZW50Lm5vZGVfb3BzLnN5bWxpbmspIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDYzKTtcbiAgfVxuICByZXR1cm4gcGFyZW50Lm5vZGVfb3BzLnN5bWxpbmsocGFyZW50LCBuZXduYW1lLCBvbGRwYXRoKTtcbiB9LFxuIHJlbmFtZTogZnVuY3Rpb24ob2xkX3BhdGgsIG5ld19wYXRoKSB7XG4gIHZhciBvbGRfZGlybmFtZSA9IFBBVEguZGlybmFtZShvbGRfcGF0aCk7XG4gIHZhciBuZXdfZGlybmFtZSA9IFBBVEguZGlybmFtZShuZXdfcGF0aCk7XG4gIHZhciBvbGRfbmFtZSA9IFBBVEguYmFzZW5hbWUob2xkX3BhdGgpO1xuICB2YXIgbmV3X25hbWUgPSBQQVRILmJhc2VuYW1lKG5ld19wYXRoKTtcbiAgdmFyIGxvb2t1cCwgb2xkX2RpciwgbmV3X2RpcjtcbiAgbG9va3VwID0gRlMubG9va3VwUGF0aChvbGRfcGF0aCwge1xuICAgcGFyZW50OiB0cnVlXG4gIH0pO1xuICBvbGRfZGlyID0gbG9va3VwLm5vZGU7XG4gIGxvb2t1cCA9IEZTLmxvb2t1cFBhdGgobmV3X3BhdGgsIHtcbiAgIHBhcmVudDogdHJ1ZVxuICB9KTtcbiAgbmV3X2RpciA9IGxvb2t1cC5ub2RlO1xuICBpZiAoIW9sZF9kaXIgfHwgIW5ld19kaXIpIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDQ0KTtcbiAgaWYgKG9sZF9kaXIubW91bnQgIT09IG5ld19kaXIubW91bnQpIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDc1KTtcbiAgfVxuICB2YXIgb2xkX25vZGUgPSBGUy5sb29rdXBOb2RlKG9sZF9kaXIsIG9sZF9uYW1lKTtcbiAgdmFyIHJlbGF0aXZlID0gUEFUSF9GUy5yZWxhdGl2ZShvbGRfcGF0aCwgbmV3X2Rpcm5hbWUpO1xuICBpZiAocmVsYXRpdmUuY2hhckF0KDApICE9PSBcIi5cIikge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMjgpO1xuICB9XG4gIHJlbGF0aXZlID0gUEFUSF9GUy5yZWxhdGl2ZShuZXdfcGF0aCwgb2xkX2Rpcm5hbWUpO1xuICBpZiAocmVsYXRpdmUuY2hhckF0KDApICE9PSBcIi5cIikge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNTUpO1xuICB9XG4gIHZhciBuZXdfbm9kZTtcbiAgdHJ5IHtcbiAgIG5ld19ub2RlID0gRlMubG9va3VwTm9kZShuZXdfZGlyLCBuZXdfbmFtZSk7XG4gIH0gY2F0Y2ggKGUpIHt9XG4gIGlmIChvbGRfbm9kZSA9PT0gbmV3X25vZGUpIHtcbiAgIHJldHVybjtcbiAgfVxuICB2YXIgaXNkaXIgPSBGUy5pc0RpcihvbGRfbm9kZS5tb2RlKTtcbiAgdmFyIGVyckNvZGUgPSBGUy5tYXlEZWxldGUob2xkX2Rpciwgb2xkX25hbWUsIGlzZGlyKTtcbiAgaWYgKGVyckNvZGUpIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKGVyckNvZGUpO1xuICB9XG4gIGVyckNvZGUgPSBuZXdfbm9kZSA/IEZTLm1heURlbGV0ZShuZXdfZGlyLCBuZXdfbmFtZSwgaXNkaXIpIDogRlMubWF5Q3JlYXRlKG5ld19kaXIsIG5ld19uYW1lKTtcbiAgaWYgKGVyckNvZGUpIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKGVyckNvZGUpO1xuICB9XG4gIGlmICghb2xkX2Rpci5ub2RlX29wcy5yZW5hbWUpIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDYzKTtcbiAgfVxuICBpZiAoRlMuaXNNb3VudHBvaW50KG9sZF9ub2RlKSB8fCBuZXdfbm9kZSAmJiBGUy5pc01vdW50cG9pbnQobmV3X25vZGUpKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigxMCk7XG4gIH1cbiAgaWYgKG5ld19kaXIgIT09IG9sZF9kaXIpIHtcbiAgIGVyckNvZGUgPSBGUy5ub2RlUGVybWlzc2lvbnMob2xkX2RpciwgXCJ3XCIpO1xuICAgaWYgKGVyckNvZGUpIHtcbiAgICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcihlcnJDb2RlKTtcbiAgIH1cbiAgfVxuICB0cnkge1xuICAgaWYgKEZTLnRyYWNraW5nRGVsZWdhdGVbXCJ3aWxsTW92ZVBhdGhcIl0pIHtcbiAgICBGUy50cmFja2luZ0RlbGVnYXRlW1wid2lsbE1vdmVQYXRoXCJdKG9sZF9wYXRoLCBuZXdfcGF0aCk7XG4gICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgIGVycihcIkZTLnRyYWNraW5nRGVsZWdhdGVbJ3dpbGxNb3ZlUGF0aCddKCdcIiArIG9sZF9wYXRoICsgXCInLCAnXCIgKyBuZXdfcGF0aCArIFwiJykgdGhyZXcgYW4gZXhjZXB0aW9uOiBcIiArIGUubWVzc2FnZSk7XG4gIH1cbiAgRlMuaGFzaFJlbW92ZU5vZGUob2xkX25vZGUpO1xuICB0cnkge1xuICAgb2xkX2Rpci5ub2RlX29wcy5yZW5hbWUob2xkX25vZGUsIG5ld19kaXIsIG5ld19uYW1lKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgdGhyb3cgZTtcbiAgfSBmaW5hbGx5IHtcbiAgIEZTLmhhc2hBZGROb2RlKG9sZF9ub2RlKTtcbiAgfVxuICB0cnkge1xuICAgaWYgKEZTLnRyYWNraW5nRGVsZWdhdGVbXCJvbk1vdmVQYXRoXCJdKSBGUy50cmFja2luZ0RlbGVnYXRlW1wib25Nb3ZlUGF0aFwiXShvbGRfcGF0aCwgbmV3X3BhdGgpO1xuICB9IGNhdGNoIChlKSB7XG4gICBlcnIoXCJGUy50cmFja2luZ0RlbGVnYXRlWydvbk1vdmVQYXRoJ10oJ1wiICsgb2xkX3BhdGggKyBcIicsICdcIiArIG5ld19wYXRoICsgXCInKSB0aHJldyBhbiBleGNlcHRpb246IFwiICsgZS5tZXNzYWdlKTtcbiAgfVxuIH0sXG4gcm1kaXI6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGxvb2t1cCA9IEZTLmxvb2t1cFBhdGgocGF0aCwge1xuICAgcGFyZW50OiB0cnVlXG4gIH0pO1xuICB2YXIgcGFyZW50ID0gbG9va3VwLm5vZGU7XG4gIHZhciBuYW1lID0gUEFUSC5iYXNlbmFtZShwYXRoKTtcbiAgdmFyIG5vZGUgPSBGUy5sb29rdXBOb2RlKHBhcmVudCwgbmFtZSk7XG4gIHZhciBlcnJDb2RlID0gRlMubWF5RGVsZXRlKHBhcmVudCwgbmFtZSwgdHJ1ZSk7XG4gIGlmIChlcnJDb2RlKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcihlcnJDb2RlKTtcbiAgfVxuICBpZiAoIXBhcmVudC5ub2RlX29wcy5ybWRpcikge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNjMpO1xuICB9XG4gIGlmIChGUy5pc01vdW50cG9pbnQobm9kZSkpIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDEwKTtcbiAgfVxuICB0cnkge1xuICAgaWYgKEZTLnRyYWNraW5nRGVsZWdhdGVbXCJ3aWxsRGVsZXRlUGF0aFwiXSkge1xuICAgIEZTLnRyYWNraW5nRGVsZWdhdGVbXCJ3aWxsRGVsZXRlUGF0aFwiXShwYXRoKTtcbiAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgZXJyKFwiRlMudHJhY2tpbmdEZWxlZ2F0ZVsnd2lsbERlbGV0ZVBhdGgnXSgnXCIgKyBwYXRoICsgXCInKSB0aHJldyBhbiBleGNlcHRpb246IFwiICsgZS5tZXNzYWdlKTtcbiAgfVxuICBwYXJlbnQubm9kZV9vcHMucm1kaXIocGFyZW50LCBuYW1lKTtcbiAgRlMuZGVzdHJveU5vZGUobm9kZSk7XG4gIHRyeSB7XG4gICBpZiAoRlMudHJhY2tpbmdEZWxlZ2F0ZVtcIm9uRGVsZXRlUGF0aFwiXSkgRlMudHJhY2tpbmdEZWxlZ2F0ZVtcIm9uRGVsZXRlUGF0aFwiXShwYXRoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgZXJyKFwiRlMudHJhY2tpbmdEZWxlZ2F0ZVsnb25EZWxldGVQYXRoJ10oJ1wiICsgcGF0aCArIFwiJykgdGhyZXcgYW4gZXhjZXB0aW9uOiBcIiArIGUubWVzc2FnZSk7XG4gIH1cbiB9LFxuIHJlYWRkaXI6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGxvb2t1cCA9IEZTLmxvb2t1cFBhdGgocGF0aCwge1xuICAgZm9sbG93OiB0cnVlXG4gIH0pO1xuICB2YXIgbm9kZSA9IGxvb2t1cC5ub2RlO1xuICBpZiAoIW5vZGUubm9kZV9vcHMucmVhZGRpcikge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNTQpO1xuICB9XG4gIHJldHVybiBub2RlLm5vZGVfb3BzLnJlYWRkaXIobm9kZSk7XG4gfSxcbiB1bmxpbms6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGxvb2t1cCA9IEZTLmxvb2t1cFBhdGgocGF0aCwge1xuICAgcGFyZW50OiB0cnVlXG4gIH0pO1xuICB2YXIgcGFyZW50ID0gbG9va3VwLm5vZGU7XG4gIHZhciBuYW1lID0gUEFUSC5iYXNlbmFtZShwYXRoKTtcbiAgdmFyIG5vZGUgPSBGUy5sb29rdXBOb2RlKHBhcmVudCwgbmFtZSk7XG4gIHZhciBlcnJDb2RlID0gRlMubWF5RGVsZXRlKHBhcmVudCwgbmFtZSwgZmFsc2UpO1xuICBpZiAoZXJyQ29kZSkge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoZXJyQ29kZSk7XG4gIH1cbiAgaWYgKCFwYXJlbnQubm9kZV9vcHMudW5saW5rKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig2Myk7XG4gIH1cbiAgaWYgKEZTLmlzTW91bnRwb2ludChub2RlKSkge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMTApO1xuICB9XG4gIHRyeSB7XG4gICBpZiAoRlMudHJhY2tpbmdEZWxlZ2F0ZVtcIndpbGxEZWxldGVQYXRoXCJdKSB7XG4gICAgRlMudHJhY2tpbmdEZWxlZ2F0ZVtcIndpbGxEZWxldGVQYXRoXCJdKHBhdGgpO1xuICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICBlcnIoXCJGUy50cmFja2luZ0RlbGVnYXRlWyd3aWxsRGVsZXRlUGF0aCddKCdcIiArIHBhdGggKyBcIicpIHRocmV3IGFuIGV4Y2VwdGlvbjogXCIgKyBlLm1lc3NhZ2UpO1xuICB9XG4gIHBhcmVudC5ub2RlX29wcy51bmxpbmsocGFyZW50LCBuYW1lKTtcbiAgRlMuZGVzdHJveU5vZGUobm9kZSk7XG4gIHRyeSB7XG4gICBpZiAoRlMudHJhY2tpbmdEZWxlZ2F0ZVtcIm9uRGVsZXRlUGF0aFwiXSkgRlMudHJhY2tpbmdEZWxlZ2F0ZVtcIm9uRGVsZXRlUGF0aFwiXShwYXRoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgZXJyKFwiRlMudHJhY2tpbmdEZWxlZ2F0ZVsnb25EZWxldGVQYXRoJ10oJ1wiICsgcGF0aCArIFwiJykgdGhyZXcgYW4gZXhjZXB0aW9uOiBcIiArIGUubWVzc2FnZSk7XG4gIH1cbiB9LFxuIHJlYWRsaW5rOiBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBsb29rdXAgPSBGUy5sb29rdXBQYXRoKHBhdGgpO1xuICB2YXIgbGluayA9IGxvb2t1cC5ub2RlO1xuICBpZiAoIWxpbmspIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDQ0KTtcbiAgfVxuICBpZiAoIWxpbmsubm9kZV9vcHMucmVhZGxpbmspIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDI4KTtcbiAgfVxuICByZXR1cm4gUEFUSF9GUy5yZXNvbHZlKEZTLmdldFBhdGgobGluay5wYXJlbnQpLCBsaW5rLm5vZGVfb3BzLnJlYWRsaW5rKGxpbmspKTtcbiB9LFxuIHN0YXQ6IGZ1bmN0aW9uKHBhdGgsIGRvbnRGb2xsb3cpIHtcbiAgdmFyIGxvb2t1cCA9IEZTLmxvb2t1cFBhdGgocGF0aCwge1xuICAgZm9sbG93OiAhZG9udEZvbGxvd1xuICB9KTtcbiAgdmFyIG5vZGUgPSBsb29rdXAubm9kZTtcbiAgaWYgKCFub2RlKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig0NCk7XG4gIH1cbiAgaWYgKCFub2RlLm5vZGVfb3BzLmdldGF0dHIpIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDYzKTtcbiAgfVxuICByZXR1cm4gbm9kZS5ub2RlX29wcy5nZXRhdHRyKG5vZGUpO1xuIH0sXG4gbHN0YXQ6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIEZTLnN0YXQocGF0aCwgdHJ1ZSk7XG4gfSxcbiBjaG1vZDogZnVuY3Rpb24ocGF0aCwgbW9kZSwgZG9udEZvbGxvdykge1xuICB2YXIgbm9kZTtcbiAgaWYgKHR5cGVvZiBwYXRoID09PSBcInN0cmluZ1wiKSB7XG4gICB2YXIgbG9va3VwID0gRlMubG9va3VwUGF0aChwYXRoLCB7XG4gICAgZm9sbG93OiAhZG9udEZvbGxvd1xuICAgfSk7XG4gICBub2RlID0gbG9va3VwLm5vZGU7XG4gIH0gZWxzZSB7XG4gICBub2RlID0gcGF0aDtcbiAgfVxuICBpZiAoIW5vZGUubm9kZV9vcHMuc2V0YXR0cikge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNjMpO1xuICB9XG4gIG5vZGUubm9kZV9vcHMuc2V0YXR0cihub2RlLCB7XG4gICBtb2RlOiBtb2RlICYgNDA5NSB8IG5vZGUubW9kZSAmIH40MDk1LFxuICAgdGltZXN0YW1wOiBEYXRlLm5vdygpXG4gIH0pO1xuIH0sXG4gbGNobW9kOiBmdW5jdGlvbihwYXRoLCBtb2RlKSB7XG4gIEZTLmNobW9kKHBhdGgsIG1vZGUsIHRydWUpO1xuIH0sXG4gZmNobW9kOiBmdW5jdGlvbihmZCwgbW9kZSkge1xuICB2YXIgc3RyZWFtID0gRlMuZ2V0U3RyZWFtKGZkKTtcbiAgaWYgKCFzdHJlYW0pIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDgpO1xuICB9XG4gIEZTLmNobW9kKHN0cmVhbS5ub2RlLCBtb2RlKTtcbiB9LFxuIGNob3duOiBmdW5jdGlvbihwYXRoLCB1aWQsIGdpZCwgZG9udEZvbGxvdykge1xuICB2YXIgbm9kZTtcbiAgaWYgKHR5cGVvZiBwYXRoID09PSBcInN0cmluZ1wiKSB7XG4gICB2YXIgbG9va3VwID0gRlMubG9va3VwUGF0aChwYXRoLCB7XG4gICAgZm9sbG93OiAhZG9udEZvbGxvd1xuICAgfSk7XG4gICBub2RlID0gbG9va3VwLm5vZGU7XG4gIH0gZWxzZSB7XG4gICBub2RlID0gcGF0aDtcbiAgfVxuICBpZiAoIW5vZGUubm9kZV9vcHMuc2V0YXR0cikge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNjMpO1xuICB9XG4gIG5vZGUubm9kZV9vcHMuc2V0YXR0cihub2RlLCB7XG4gICB0aW1lc3RhbXA6IERhdGUubm93KClcbiAgfSk7XG4gfSxcbiBsY2hvd246IGZ1bmN0aW9uKHBhdGgsIHVpZCwgZ2lkKSB7XG4gIEZTLmNob3duKHBhdGgsIHVpZCwgZ2lkLCB0cnVlKTtcbiB9LFxuIGZjaG93bjogZnVuY3Rpb24oZmQsIHVpZCwgZ2lkKSB7XG4gIHZhciBzdHJlYW0gPSBGUy5nZXRTdHJlYW0oZmQpO1xuICBpZiAoIXN0cmVhbSkge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoOCk7XG4gIH1cbiAgRlMuY2hvd24oc3RyZWFtLm5vZGUsIHVpZCwgZ2lkKTtcbiB9LFxuIHRydW5jYXRlOiBmdW5jdGlvbihwYXRoLCBsZW4pIHtcbiAgaWYgKGxlbiA8IDApIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDI4KTtcbiAgfVxuICB2YXIgbm9kZTtcbiAgaWYgKHR5cGVvZiBwYXRoID09PSBcInN0cmluZ1wiKSB7XG4gICB2YXIgbG9va3VwID0gRlMubG9va3VwUGF0aChwYXRoLCB7XG4gICAgZm9sbG93OiB0cnVlXG4gICB9KTtcbiAgIG5vZGUgPSBsb29rdXAubm9kZTtcbiAgfSBlbHNlIHtcbiAgIG5vZGUgPSBwYXRoO1xuICB9XG4gIGlmICghbm9kZS5ub2RlX29wcy5zZXRhdHRyKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig2Myk7XG4gIH1cbiAgaWYgKEZTLmlzRGlyKG5vZGUubW9kZSkpIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDMxKTtcbiAgfVxuICBpZiAoIUZTLmlzRmlsZShub2RlLm1vZGUpKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigyOCk7XG4gIH1cbiAgdmFyIGVyckNvZGUgPSBGUy5ub2RlUGVybWlzc2lvbnMobm9kZSwgXCJ3XCIpO1xuICBpZiAoZXJyQ29kZSkge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoZXJyQ29kZSk7XG4gIH1cbiAgbm9kZS5ub2RlX29wcy5zZXRhdHRyKG5vZGUsIHtcbiAgIHNpemU6IGxlbixcbiAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuICB9KTtcbiB9LFxuIGZ0cnVuY2F0ZTogZnVuY3Rpb24oZmQsIGxlbikge1xuICB2YXIgc3RyZWFtID0gRlMuZ2V0U3RyZWFtKGZkKTtcbiAgaWYgKCFzdHJlYW0pIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDgpO1xuICB9XG4gIGlmICgoc3RyZWFtLmZsYWdzICYgMjA5NzE1NSkgPT09IDApIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDI4KTtcbiAgfVxuICBGUy50cnVuY2F0ZShzdHJlYW0ubm9kZSwgbGVuKTtcbiB9LFxuIHV0aW1lOiBmdW5jdGlvbihwYXRoLCBhdGltZSwgbXRpbWUpIHtcbiAgdmFyIGxvb2t1cCA9IEZTLmxvb2t1cFBhdGgocGF0aCwge1xuICAgZm9sbG93OiB0cnVlXG4gIH0pO1xuICB2YXIgbm9kZSA9IGxvb2t1cC5ub2RlO1xuICBub2RlLm5vZGVfb3BzLnNldGF0dHIobm9kZSwge1xuICAgdGltZXN0YW1wOiBNYXRoLm1heChhdGltZSwgbXRpbWUpXG4gIH0pO1xuIH0sXG4gb3BlbjogZnVuY3Rpb24ocGF0aCwgZmxhZ3MsIG1vZGUsIGZkX3N0YXJ0LCBmZF9lbmQpIHtcbiAgaWYgKHBhdGggPT09IFwiXCIpIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDQ0KTtcbiAgfVxuICBmbGFncyA9IHR5cGVvZiBmbGFncyA9PT0gXCJzdHJpbmdcIiA/IEZTLm1vZGVTdHJpbmdUb0ZsYWdzKGZsYWdzKSA6IGZsYWdzO1xuICBtb2RlID0gdHlwZW9mIG1vZGUgPT09IFwidW5kZWZpbmVkXCIgPyA0MzggOiBtb2RlO1xuICBpZiAoZmxhZ3MgJiA2NCkge1xuICAgbW9kZSA9IG1vZGUgJiA0MDk1IHwgMzI3Njg7XG4gIH0gZWxzZSB7XG4gICBtb2RlID0gMDtcbiAgfVxuICB2YXIgbm9kZTtcbiAgaWYgKHR5cGVvZiBwYXRoID09PSBcIm9iamVjdFwiKSB7XG4gICBub2RlID0gcGF0aDtcbiAgfSBlbHNlIHtcbiAgIHBhdGggPSBQQVRILm5vcm1hbGl6ZShwYXRoKTtcbiAgIHRyeSB7XG4gICAgdmFyIGxvb2t1cCA9IEZTLmxvb2t1cFBhdGgocGF0aCwge1xuICAgICBmb2xsb3c6ICEoZmxhZ3MgJiAxMzEwNzIpXG4gICAgfSk7XG4gICAgbm9kZSA9IGxvb2t1cC5ub2RlO1xuICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICB2YXIgY3JlYXRlZCA9IGZhbHNlO1xuICBpZiAoZmxhZ3MgJiA2NCkge1xuICAgaWYgKG5vZGUpIHtcbiAgICBpZiAoZmxhZ3MgJiAxMjgpIHtcbiAgICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMjApO1xuICAgIH1cbiAgIH0gZWxzZSB7XG4gICAgbm9kZSA9IEZTLm1rbm9kKHBhdGgsIG1vZGUsIDApO1xuICAgIGNyZWF0ZWQgPSB0cnVlO1xuICAgfVxuICB9XG4gIGlmICghbm9kZSkge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNDQpO1xuICB9XG4gIGlmIChGUy5pc0NocmRldihub2RlLm1vZGUpKSB7XG4gICBmbGFncyAmPSB+NTEyO1xuICB9XG4gIGlmIChmbGFncyAmIDY1NTM2ICYmICFGUy5pc0Rpcihub2RlLm1vZGUpKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig1NCk7XG4gIH1cbiAgaWYgKCFjcmVhdGVkKSB7XG4gICB2YXIgZXJyQ29kZSA9IEZTLm1heU9wZW4obm9kZSwgZmxhZ3MpO1xuICAgaWYgKGVyckNvZGUpIHtcbiAgICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcihlcnJDb2RlKTtcbiAgIH1cbiAgfVxuICBpZiAoZmxhZ3MgJiA1MTIpIHtcbiAgIEZTLnRydW5jYXRlKG5vZGUsIDApO1xuICB9XG4gIGZsYWdzICY9IH4oMTI4IHwgNTEyIHwgMTMxMDcyKTtcbiAgdmFyIHN0cmVhbSA9IEZTLmNyZWF0ZVN0cmVhbSh7XG4gICBub2RlOiBub2RlLFxuICAgcGF0aDogRlMuZ2V0UGF0aChub2RlKSxcbiAgIGZsYWdzOiBmbGFncyxcbiAgIHNlZWthYmxlOiB0cnVlLFxuICAgcG9zaXRpb246IDAsXG4gICBzdHJlYW1fb3BzOiBub2RlLnN0cmVhbV9vcHMsXG4gICB1bmdvdHRlbjogW10sXG4gICBlcnJvcjogZmFsc2VcbiAgfSwgZmRfc3RhcnQsIGZkX2VuZCk7XG4gIGlmIChzdHJlYW0uc3RyZWFtX29wcy5vcGVuKSB7XG4gICBzdHJlYW0uc3RyZWFtX29wcy5vcGVuKHN0cmVhbSk7XG4gIH1cbiAgaWYgKE1vZHVsZVtcImxvZ1JlYWRGaWxlc1wiXSAmJiAhKGZsYWdzICYgMSkpIHtcbiAgIGlmICghRlMucmVhZEZpbGVzKSBGUy5yZWFkRmlsZXMgPSB7fTtcbiAgIGlmICghKHBhdGggaW4gRlMucmVhZEZpbGVzKSkge1xuICAgIEZTLnJlYWRGaWxlc1twYXRoXSA9IDE7XG4gICAgZXJyKFwiRlMudHJhY2tpbmdEZWxlZ2F0ZSBlcnJvciBvbiByZWFkIGZpbGU6IFwiICsgcGF0aCk7XG4gICB9XG4gIH1cbiAgdHJ5IHtcbiAgIGlmIChGUy50cmFja2luZ0RlbGVnYXRlW1wib25PcGVuRmlsZVwiXSkge1xuICAgIHZhciB0cmFja2luZ0ZsYWdzID0gMDtcbiAgICBpZiAoKGZsYWdzICYgMjA5NzE1NSkgIT09IDEpIHtcbiAgICAgdHJhY2tpbmdGbGFncyB8PSBGUy50cmFja2luZy5vcGVuRmxhZ3MuUkVBRDtcbiAgICB9XG4gICAgaWYgKChmbGFncyAmIDIwOTcxNTUpICE9PSAwKSB7XG4gICAgIHRyYWNraW5nRmxhZ3MgfD0gRlMudHJhY2tpbmcub3BlbkZsYWdzLldSSVRFO1xuICAgIH1cbiAgICBGUy50cmFja2luZ0RlbGVnYXRlW1wib25PcGVuRmlsZVwiXShwYXRoLCB0cmFja2luZ0ZsYWdzKTtcbiAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgZXJyKFwiRlMudHJhY2tpbmdEZWxlZ2F0ZVsnb25PcGVuRmlsZSddKCdcIiArIHBhdGggKyBcIicsIGZsYWdzKSB0aHJldyBhbiBleGNlcHRpb246IFwiICsgZS5tZXNzYWdlKTtcbiAgfVxuICByZXR1cm4gc3RyZWFtO1xuIH0sXG4gY2xvc2U6IGZ1bmN0aW9uKHN0cmVhbSkge1xuICBpZiAoRlMuaXNDbG9zZWQoc3RyZWFtKSkge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoOCk7XG4gIH1cbiAgaWYgKHN0cmVhbS5nZXRkZW50cykgc3RyZWFtLmdldGRlbnRzID0gbnVsbDtcbiAgdHJ5IHtcbiAgIGlmIChzdHJlYW0uc3RyZWFtX29wcy5jbG9zZSkge1xuICAgIHN0cmVhbS5zdHJlYW1fb3BzLmNsb3NlKHN0cmVhbSk7XG4gICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgIHRocm93IGU7XG4gIH0gZmluYWxseSB7XG4gICBGUy5jbG9zZVN0cmVhbShzdHJlYW0uZmQpO1xuICB9XG4gIHN0cmVhbS5mZCA9IG51bGw7XG4gfSxcbiBpc0Nsb3NlZDogZnVuY3Rpb24oc3RyZWFtKSB7XG4gIHJldHVybiBzdHJlYW0uZmQgPT09IG51bGw7XG4gfSxcbiBsbHNlZWs6IGZ1bmN0aW9uKHN0cmVhbSwgb2Zmc2V0LCB3aGVuY2UpIHtcbiAgaWYgKEZTLmlzQ2xvc2VkKHN0cmVhbSkpIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDgpO1xuICB9XG4gIGlmICghc3RyZWFtLnNlZWthYmxlIHx8ICFzdHJlYW0uc3RyZWFtX29wcy5sbHNlZWspIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDcwKTtcbiAgfVxuICBpZiAod2hlbmNlICE9IDAgJiYgd2hlbmNlICE9IDEgJiYgd2hlbmNlICE9IDIpIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDI4KTtcbiAgfVxuICBzdHJlYW0ucG9zaXRpb24gPSBzdHJlYW0uc3RyZWFtX29wcy5sbHNlZWsoc3RyZWFtLCBvZmZzZXQsIHdoZW5jZSk7XG4gIHN0cmVhbS51bmdvdHRlbiA9IFtdO1xuICByZXR1cm4gc3RyZWFtLnBvc2l0aW9uO1xuIH0sXG4gcmVhZDogZnVuY3Rpb24oc3RyZWFtLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoLCBwb3NpdGlvbikge1xuICBpZiAobGVuZ3RoIDwgMCB8fCBwb3NpdGlvbiA8IDApIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDI4KTtcbiAgfVxuICBpZiAoRlMuaXNDbG9zZWQoc3RyZWFtKSkge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoOCk7XG4gIH1cbiAgaWYgKChzdHJlYW0uZmxhZ3MgJiAyMDk3MTU1KSA9PT0gMSkge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoOCk7XG4gIH1cbiAgaWYgKEZTLmlzRGlyKHN0cmVhbS5ub2RlLm1vZGUpKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigzMSk7XG4gIH1cbiAgaWYgKCFzdHJlYW0uc3RyZWFtX29wcy5yZWFkKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigyOCk7XG4gIH1cbiAgdmFyIHNlZWtpbmcgPSB0eXBlb2YgcG9zaXRpb24gIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmICghc2Vla2luZykge1xuICAgcG9zaXRpb24gPSBzdHJlYW0ucG9zaXRpb247XG4gIH0gZWxzZSBpZiAoIXN0cmVhbS5zZWVrYWJsZSkge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNzApO1xuICB9XG4gIHZhciBieXRlc1JlYWQgPSBzdHJlYW0uc3RyZWFtX29wcy5yZWFkKHN0cmVhbSwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24pO1xuICBpZiAoIXNlZWtpbmcpIHN0cmVhbS5wb3NpdGlvbiArPSBieXRlc1JlYWQ7XG4gIHJldHVybiBieXRlc1JlYWQ7XG4gfSxcbiB3cml0ZTogZnVuY3Rpb24oc3RyZWFtLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoLCBwb3NpdGlvbiwgY2FuT3duKSB7XG4gIGlmIChsZW5ndGggPCAwIHx8IHBvc2l0aW9uIDwgMCkge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMjgpO1xuICB9XG4gIGlmIChGUy5pc0Nsb3NlZChzdHJlYW0pKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig4KTtcbiAgfVxuICBpZiAoKHN0cmVhbS5mbGFncyAmIDIwOTcxNTUpID09PSAwKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig4KTtcbiAgfVxuICBpZiAoRlMuaXNEaXIoc3RyZWFtLm5vZGUubW9kZSkpIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDMxKTtcbiAgfVxuICBpZiAoIXN0cmVhbS5zdHJlYW1fb3BzLndyaXRlKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigyOCk7XG4gIH1cbiAgaWYgKHN0cmVhbS5zZWVrYWJsZSAmJiBzdHJlYW0uZmxhZ3MgJiAxMDI0KSB7XG4gICBGUy5sbHNlZWsoc3RyZWFtLCAwLCAyKTtcbiAgfVxuICB2YXIgc2Vla2luZyA9IHR5cGVvZiBwb3NpdGlvbiAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKCFzZWVraW5nKSB7XG4gICBwb3NpdGlvbiA9IHN0cmVhbS5wb3NpdGlvbjtcbiAgfSBlbHNlIGlmICghc3RyZWFtLnNlZWthYmxlKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig3MCk7XG4gIH1cbiAgdmFyIGJ5dGVzV3JpdHRlbiA9IHN0cmVhbS5zdHJlYW1fb3BzLndyaXRlKHN0cmVhbSwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24sIGNhbk93bik7XG4gIGlmICghc2Vla2luZykgc3RyZWFtLnBvc2l0aW9uICs9IGJ5dGVzV3JpdHRlbjtcbiAgdHJ5IHtcbiAgIGlmIChzdHJlYW0ucGF0aCAmJiBGUy50cmFja2luZ0RlbGVnYXRlW1wib25Xcml0ZVRvRmlsZVwiXSkgRlMudHJhY2tpbmdEZWxlZ2F0ZVtcIm9uV3JpdGVUb0ZpbGVcIl0oc3RyZWFtLnBhdGgpO1xuICB9IGNhdGNoIChlKSB7XG4gICBlcnIoXCJGUy50cmFja2luZ0RlbGVnYXRlWydvbldyaXRlVG9GaWxlJ10oJ1wiICsgc3RyZWFtLnBhdGggKyBcIicpIHRocmV3IGFuIGV4Y2VwdGlvbjogXCIgKyBlLm1lc3NhZ2UpO1xuICB9XG4gIHJldHVybiBieXRlc1dyaXR0ZW47XG4gfSxcbiBhbGxvY2F0ZTogZnVuY3Rpb24oc3RyZWFtLCBvZmZzZXQsIGxlbmd0aCkge1xuICBpZiAoRlMuaXNDbG9zZWQoc3RyZWFtKSkge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoOCk7XG4gIH1cbiAgaWYgKG9mZnNldCA8IDAgfHwgbGVuZ3RoIDw9IDApIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDI4KTtcbiAgfVxuICBpZiAoKHN0cmVhbS5mbGFncyAmIDIwOTcxNTUpID09PSAwKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig4KTtcbiAgfVxuICBpZiAoIUZTLmlzRmlsZShzdHJlYW0ubm9kZS5tb2RlKSAmJiAhRlMuaXNEaXIoc3RyZWFtLm5vZGUubW9kZSkpIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDQzKTtcbiAgfVxuICBpZiAoIXN0cmVhbS5zdHJlYW1fb3BzLmFsbG9jYXRlKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigxMzgpO1xuICB9XG4gIHN0cmVhbS5zdHJlYW1fb3BzLmFsbG9jYXRlKHN0cmVhbSwgb2Zmc2V0LCBsZW5ndGgpO1xuIH0sXG4gbW1hcDogZnVuY3Rpb24oc3RyZWFtLCBhZGRyZXNzLCBsZW5ndGgsIHBvc2l0aW9uLCBwcm90LCBmbGFncykge1xuICBpZiAoKHByb3QgJiAyKSAhPT0gMCAmJiAoZmxhZ3MgJiAyKSA9PT0gMCAmJiAoc3RyZWFtLmZsYWdzICYgMjA5NzE1NSkgIT09IDIpIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDIpO1xuICB9XG4gIGlmICgoc3RyZWFtLmZsYWdzICYgMjA5NzE1NSkgPT09IDEpIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDIpO1xuICB9XG4gIGlmICghc3RyZWFtLnN0cmVhbV9vcHMubW1hcCkge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNDMpO1xuICB9XG4gIHJldHVybiBzdHJlYW0uc3RyZWFtX29wcy5tbWFwKHN0cmVhbSwgYWRkcmVzcywgbGVuZ3RoLCBwb3NpdGlvbiwgcHJvdCwgZmxhZ3MpO1xuIH0sXG4gbXN5bmM6IGZ1bmN0aW9uKHN0cmVhbSwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgbW1hcEZsYWdzKSB7XG4gIGlmICghc3RyZWFtIHx8ICFzdHJlYW0uc3RyZWFtX29wcy5tc3luYykge1xuICAgcmV0dXJuIDA7XG4gIH1cbiAgcmV0dXJuIHN0cmVhbS5zdHJlYW1fb3BzLm1zeW5jKHN0cmVhbSwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgbW1hcEZsYWdzKTtcbiB9LFxuIG11bm1hcDogZnVuY3Rpb24oc3RyZWFtKSB7XG4gIHJldHVybiAwO1xuIH0sXG4gaW9jdGw6IGZ1bmN0aW9uKHN0cmVhbSwgY21kLCBhcmcpIHtcbiAgaWYgKCFzdHJlYW0uc3RyZWFtX29wcy5pb2N0bCkge1xuICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNTkpO1xuICB9XG4gIHJldHVybiBzdHJlYW0uc3RyZWFtX29wcy5pb2N0bChzdHJlYW0sIGNtZCwgYXJnKTtcbiB9LFxuIHJlYWRGaWxlOiBmdW5jdGlvbihwYXRoLCBvcHRzKSB7XG4gIG9wdHMgPSBvcHRzIHx8IHt9O1xuICBvcHRzLmZsYWdzID0gb3B0cy5mbGFncyB8fCAwO1xuICBvcHRzLmVuY29kaW5nID0gb3B0cy5lbmNvZGluZyB8fCBcImJpbmFyeVwiO1xuICBpZiAob3B0cy5lbmNvZGluZyAhPT0gXCJ1dGY4XCIgJiYgb3B0cy5lbmNvZGluZyAhPT0gXCJiaW5hcnlcIikge1xuICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGVuY29kaW5nIHR5cGUgXCInICsgb3B0cy5lbmNvZGluZyArICdcIicpO1xuICB9XG4gIHZhciByZXQ7XG4gIHZhciBzdHJlYW0gPSBGUy5vcGVuKHBhdGgsIG9wdHMuZmxhZ3MpO1xuICB2YXIgc3RhdCA9IEZTLnN0YXQocGF0aCk7XG4gIHZhciBsZW5ndGggPSBzdGF0LnNpemU7XG4gIHZhciBidWYgPSBuZXcgVWludDhBcnJheShsZW5ndGgpO1xuICBGUy5yZWFkKHN0cmVhbSwgYnVmLCAwLCBsZW5ndGgsIDApO1xuICBpZiAob3B0cy5lbmNvZGluZyA9PT0gXCJ1dGY4XCIpIHtcbiAgIHJldCA9IFVURjhBcnJheVRvU3RyaW5nKGJ1ZiwgMCk7XG4gIH0gZWxzZSBpZiAob3B0cy5lbmNvZGluZyA9PT0gXCJiaW5hcnlcIikge1xuICAgcmV0ID0gYnVmO1xuICB9XG4gIEZTLmNsb3NlKHN0cmVhbSk7XG4gIHJldHVybiByZXQ7XG4gfSxcbiB3cml0ZUZpbGU6IGZ1bmN0aW9uKHBhdGgsIGRhdGEsIG9wdHMpIHtcbiAgb3B0cyA9IG9wdHMgfHwge307XG4gIG9wdHMuZmxhZ3MgPSBvcHRzLmZsYWdzIHx8IDU3NztcbiAgdmFyIHN0cmVhbSA9IEZTLm9wZW4ocGF0aCwgb3B0cy5mbGFncywgb3B0cy5tb2RlKTtcbiAgaWYgKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiKSB7XG4gICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkobGVuZ3RoQnl0ZXNVVEY4KGRhdGEpICsgMSk7XG4gICB2YXIgYWN0dWFsTnVtQnl0ZXMgPSBzdHJpbmdUb1VURjhBcnJheShkYXRhLCBidWYsIDAsIGJ1Zi5sZW5ndGgpO1xuICAgRlMud3JpdGUoc3RyZWFtLCBidWYsIDAsIGFjdHVhbE51bUJ5dGVzLCB1bmRlZmluZWQsIG9wdHMuY2FuT3duKTtcbiAgfSBlbHNlIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoZGF0YSkpIHtcbiAgIEZTLndyaXRlKHN0cmVhbSwgZGF0YSwgMCwgZGF0YS5ieXRlTGVuZ3RoLCB1bmRlZmluZWQsIG9wdHMuY2FuT3duKTtcbiAgfSBlbHNlIHtcbiAgIHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIGRhdGEgdHlwZVwiKTtcbiAgfVxuICBGUy5jbG9zZShzdHJlYW0pO1xuIH0sXG4gY3dkOiBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEZTLmN1cnJlbnRQYXRoO1xuIH0sXG4gY2hkaXI6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGxvb2t1cCA9IEZTLmxvb2t1cFBhdGgocGF0aCwge1xuICAgZm9sbG93OiB0cnVlXG4gIH0pO1xuICBpZiAobG9va3VwLm5vZGUgPT09IG51bGwpIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDQ0KTtcbiAgfVxuICBpZiAoIUZTLmlzRGlyKGxvb2t1cC5ub2RlLm1vZGUpKSB7XG4gICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig1NCk7XG4gIH1cbiAgdmFyIGVyckNvZGUgPSBGUy5ub2RlUGVybWlzc2lvbnMobG9va3VwLm5vZGUsIFwieFwiKTtcbiAgaWYgKGVyckNvZGUpIHtcbiAgIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKGVyckNvZGUpO1xuICB9XG4gIEZTLmN1cnJlbnRQYXRoID0gbG9va3VwLnBhdGg7XG4gfSxcbiBjcmVhdGVEZWZhdWx0RGlyZWN0b3JpZXM6IGZ1bmN0aW9uKCkge1xuICBGUy5ta2RpcihcIi90bXBcIik7XG4gIEZTLm1rZGlyKFwiL2hvbWVcIik7XG4gIEZTLm1rZGlyKFwiL2hvbWUvd2ViX3VzZXJcIik7XG4gfSxcbiBjcmVhdGVEZWZhdWx0RGV2aWNlczogZnVuY3Rpb24oKSB7XG4gIEZTLm1rZGlyKFwiL2RldlwiKTtcbiAgRlMucmVnaXN0ZXJEZXZpY2UoRlMubWFrZWRldigxLCAzKSwge1xuICAgcmVhZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIDA7XG4gICB9LFxuICAgd3JpdGU6IGZ1bmN0aW9uKHN0cmVhbSwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zKSB7XG4gICAgcmV0dXJuIGxlbmd0aDtcbiAgIH1cbiAgfSk7XG4gIEZTLm1rZGV2KFwiL2Rldi9udWxsXCIsIEZTLm1ha2VkZXYoMSwgMykpO1xuICBUVFkucmVnaXN0ZXIoRlMubWFrZWRldig1LCAwKSwgVFRZLmRlZmF1bHRfdHR5X29wcyk7XG4gIFRUWS5yZWdpc3RlcihGUy5tYWtlZGV2KDYsIDApLCBUVFkuZGVmYXVsdF90dHkxX29wcyk7XG4gIEZTLm1rZGV2KFwiL2Rldi90dHlcIiwgRlMubWFrZWRldig1LCAwKSk7XG4gIEZTLm1rZGV2KFwiL2Rldi90dHkxXCIsIEZTLm1ha2VkZXYoNiwgMCkpO1xuICB2YXIgcmFuZG9tX2RldmljZSA9IGdldFJhbmRvbURldmljZSgpO1xuICBGUy5jcmVhdGVEZXZpY2UoXCIvZGV2XCIsIFwicmFuZG9tXCIsIHJhbmRvbV9kZXZpY2UpO1xuICBGUy5jcmVhdGVEZXZpY2UoXCIvZGV2XCIsIFwidXJhbmRvbVwiLCByYW5kb21fZGV2aWNlKTtcbiAgRlMubWtkaXIoXCIvZGV2L3NobVwiKTtcbiAgRlMubWtkaXIoXCIvZGV2L3NobS90bXBcIik7XG4gfSxcbiBjcmVhdGVTcGVjaWFsRGlyZWN0b3JpZXM6IGZ1bmN0aW9uKCkge1xuICBGUy5ta2RpcihcIi9wcm9jXCIpO1xuICBGUy5ta2RpcihcIi9wcm9jL3NlbGZcIik7XG4gIEZTLm1rZGlyKFwiL3Byb2Mvc2VsZi9mZFwiKTtcbiAgRlMubW91bnQoe1xuICAgbW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBub2RlID0gRlMuY3JlYXRlTm9kZShcIi9wcm9jL3NlbGZcIiwgXCJmZFwiLCAxNjM4NCB8IDUxMSwgNzMpO1xuICAgIG5vZGUubm9kZV9vcHMgPSB7XG4gICAgIGxvb2t1cDogZnVuY3Rpb24ocGFyZW50LCBuYW1lKSB7XG4gICAgICB2YXIgZmQgPSArbmFtZTtcbiAgICAgIHZhciBzdHJlYW0gPSBGUy5nZXRTdHJlYW0oZmQpO1xuICAgICAgaWYgKCFzdHJlYW0pIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDgpO1xuICAgICAgdmFyIHJldCA9IHtcbiAgICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICAgbW91bnQ6IHtcbiAgICAgICAgbW91bnRwb2ludDogXCJmYWtlXCJcbiAgICAgICB9LFxuICAgICAgIG5vZGVfb3BzOiB7XG4gICAgICAgIHJlYWRsaW5rOiBmdW5jdGlvbigpIHtcbiAgICAgICAgIHJldHVybiBzdHJlYW0ucGF0aDtcbiAgICAgICAgfVxuICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXQucGFyZW50ID0gcmV0O1xuICAgICAgcmV0dXJuIHJldDtcbiAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIG5vZGU7XG4gICB9XG4gIH0sIHt9LCBcIi9wcm9jL3NlbGYvZmRcIik7XG4gfSxcbiBjcmVhdGVTdGFuZGFyZFN0cmVhbXM6IGZ1bmN0aW9uKCkge1xuICBpZiAoTW9kdWxlW1wic3RkaW5cIl0pIHtcbiAgIEZTLmNyZWF0ZURldmljZShcIi9kZXZcIiwgXCJzdGRpblwiLCBNb2R1bGVbXCJzdGRpblwiXSk7XG4gIH0gZWxzZSB7XG4gICBGUy5zeW1saW5rKFwiL2Rldi90dHlcIiwgXCIvZGV2L3N0ZGluXCIpO1xuICB9XG4gIGlmIChNb2R1bGVbXCJzdGRvdXRcIl0pIHtcbiAgIEZTLmNyZWF0ZURldmljZShcIi9kZXZcIiwgXCJzdGRvdXRcIiwgbnVsbCwgTW9kdWxlW1wic3Rkb3V0XCJdKTtcbiAgfSBlbHNlIHtcbiAgIEZTLnN5bWxpbmsoXCIvZGV2L3R0eVwiLCBcIi9kZXYvc3Rkb3V0XCIpO1xuICB9XG4gIGlmIChNb2R1bGVbXCJzdGRlcnJcIl0pIHtcbiAgIEZTLmNyZWF0ZURldmljZShcIi9kZXZcIiwgXCJzdGRlcnJcIiwgbnVsbCwgTW9kdWxlW1wic3RkZXJyXCJdKTtcbiAgfSBlbHNlIHtcbiAgIEZTLnN5bWxpbmsoXCIvZGV2L3R0eTFcIiwgXCIvZGV2L3N0ZGVyclwiKTtcbiAgfVxuICB2YXIgc3RkaW4gPSBGUy5vcGVuKFwiL2Rldi9zdGRpblwiLCAwKTtcbiAgdmFyIHN0ZG91dCA9IEZTLm9wZW4oXCIvZGV2L3N0ZG91dFwiLCAxKTtcbiAgdmFyIHN0ZGVyciA9IEZTLm9wZW4oXCIvZGV2L3N0ZGVyclwiLCAxKTtcbiAgYXNzZXJ0KHN0ZGluLmZkID09PSAwLCBcImludmFsaWQgaGFuZGxlIGZvciBzdGRpbiAoXCIgKyBzdGRpbi5mZCArIFwiKVwiKTtcbiAgYXNzZXJ0KHN0ZG91dC5mZCA9PT0gMSwgXCJpbnZhbGlkIGhhbmRsZSBmb3Igc3Rkb3V0IChcIiArIHN0ZG91dC5mZCArIFwiKVwiKTtcbiAgYXNzZXJ0KHN0ZGVyci5mZCA9PT0gMiwgXCJpbnZhbGlkIGhhbmRsZSBmb3Igc3RkZXJyIChcIiArIHN0ZGVyci5mZCArIFwiKVwiKTtcbiB9LFxuIGVuc3VyZUVycm5vRXJyb3I6IGZ1bmN0aW9uKCkge1xuICBpZiAoRlMuRXJybm9FcnJvcikgcmV0dXJuO1xuICBGUy5FcnJub0Vycm9yID0gZnVuY3Rpb24gRXJybm9FcnJvcihlcnJubywgbm9kZSkge1xuICAgdGhpcy5ub2RlID0gbm9kZTtcbiAgIHRoaXMuc2V0RXJybm8gPSBmdW5jdGlvbihlcnJubykge1xuICAgIHRoaXMuZXJybm8gPSBlcnJubztcbiAgICBmb3IgKHZhciBrZXkgaW4gRVJSTk9fQ09ERVMpIHtcbiAgICAgaWYgKEVSUk5PX0NPREVTW2tleV0gPT09IGVycm5vKSB7XG4gICAgICB0aGlzLmNvZGUgPSBrZXk7XG4gICAgICBicmVhaztcbiAgICAgfVxuICAgIH1cbiAgIH07XG4gICB0aGlzLnNldEVycm5vKGVycm5vKTtcbiAgIHRoaXMubWVzc2FnZSA9IEVSUk5PX01FU1NBR0VTW2Vycm5vXTtcbiAgIGlmICh0aGlzLnN0YWNrKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwic3RhY2tcIiwge1xuICAgICB2YWx1ZTogbmV3IEVycm9yKCkuc3RhY2ssXG4gICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgdGhpcy5zdGFjayA9IGRlbWFuZ2xlQWxsKHRoaXMuc3RhY2spO1xuICAgfVxuICB9O1xuICBGUy5FcnJub0Vycm9yLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuICBGUy5FcnJub0Vycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEZTLkVycm5vRXJyb3I7XG4gIFsgNDQgXS5mb3JFYWNoKGZ1bmN0aW9uKGNvZGUpIHtcbiAgIEZTLmdlbmVyaWNFcnJvcnNbY29kZV0gPSBuZXcgRlMuRXJybm9FcnJvcihjb2RlKTtcbiAgIEZTLmdlbmVyaWNFcnJvcnNbY29kZV0uc3RhY2sgPSBcIjxnZW5lcmljIGVycm9yLCBubyBzdGFjaz5cIjtcbiAgfSk7XG4gfSxcbiBzdGF0aWNJbml0OiBmdW5jdGlvbigpIHtcbiAgRlMuZW5zdXJlRXJybm9FcnJvcigpO1xuICBGUy5uYW1lVGFibGUgPSBuZXcgQXJyYXkoNDA5Nik7XG4gIEZTLm1vdW50KE1FTUZTLCB7fSwgXCIvXCIpO1xuICBGUy5jcmVhdGVEZWZhdWx0RGlyZWN0b3JpZXMoKTtcbiAgRlMuY3JlYXRlRGVmYXVsdERldmljZXMoKTtcbiAgRlMuY3JlYXRlU3BlY2lhbERpcmVjdG9yaWVzKCk7XG4gIEZTLmZpbGVzeXN0ZW1zID0ge1xuICAgXCJNRU1GU1wiOiBNRU1GU1xuICB9O1xuIH0sXG4gaW5pdDogZnVuY3Rpb24oaW5wdXQsIG91dHB1dCwgZXJyb3IpIHtcbiAgYXNzZXJ0KCFGUy5pbml0LmluaXRpYWxpemVkLCBcIkZTLmluaXQgd2FzIHByZXZpb3VzbHkgY2FsbGVkLiBJZiB5b3Ugd2FudCB0byBpbml0aWFsaXplIGxhdGVyIHdpdGggY3VzdG9tIHBhcmFtZXRlcnMsIHJlbW92ZSBhbnkgZWFybGllciBjYWxscyAobm90ZSB0aGF0IG9uZSBpcyBhdXRvbWF0aWNhbGx5IGFkZGVkIHRvIHRoZSBnZW5lcmF0ZWQgY29kZSlcIik7XG4gIEZTLmluaXQuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICBGUy5lbnN1cmVFcnJub0Vycm9yKCk7XG4gIE1vZHVsZVtcInN0ZGluXCJdID0gaW5wdXQgfHwgTW9kdWxlW1wic3RkaW5cIl07XG4gIE1vZHVsZVtcInN0ZG91dFwiXSA9IG91dHB1dCB8fCBNb2R1bGVbXCJzdGRvdXRcIl07XG4gIE1vZHVsZVtcInN0ZGVyclwiXSA9IGVycm9yIHx8IE1vZHVsZVtcInN0ZGVyclwiXTtcbiAgRlMuY3JlYXRlU3RhbmRhcmRTdHJlYW1zKCk7XG4gfSxcbiBxdWl0OiBmdW5jdGlvbigpIHtcbiAgRlMuaW5pdC5pbml0aWFsaXplZCA9IGZhbHNlO1xuICB2YXIgZmZsdXNoID0gTW9kdWxlW1wiX2ZmbHVzaFwiXTtcbiAgaWYgKGZmbHVzaCkgZmZsdXNoKDApO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IEZTLnN0cmVhbXMubGVuZ3RoOyBpKyspIHtcbiAgIHZhciBzdHJlYW0gPSBGUy5zdHJlYW1zW2ldO1xuICAgaWYgKCFzdHJlYW0pIHtcbiAgICBjb250aW51ZTtcbiAgIH1cbiAgIEZTLmNsb3NlKHN0cmVhbSk7XG4gIH1cbiB9LFxuIGdldE1vZGU6IGZ1bmN0aW9uKGNhblJlYWQsIGNhbldyaXRlKSB7XG4gIHZhciBtb2RlID0gMDtcbiAgaWYgKGNhblJlYWQpIG1vZGUgfD0gMjkyIHwgNzM7XG4gIGlmIChjYW5Xcml0ZSkgbW9kZSB8PSAxNDY7XG4gIHJldHVybiBtb2RlO1xuIH0sXG4gZmluZE9iamVjdDogZnVuY3Rpb24ocGF0aCwgZG9udFJlc29sdmVMYXN0TGluaykge1xuICB2YXIgcmV0ID0gRlMuYW5hbHl6ZVBhdGgocGF0aCwgZG9udFJlc29sdmVMYXN0TGluayk7XG4gIGlmIChyZXQuZXhpc3RzKSB7XG4gICByZXR1cm4gcmV0Lm9iamVjdDtcbiAgfSBlbHNlIHtcbiAgIHJldHVybiBudWxsO1xuICB9XG4gfSxcbiBhbmFseXplUGF0aDogZnVuY3Rpb24ocGF0aCwgZG9udFJlc29sdmVMYXN0TGluaykge1xuICB0cnkge1xuICAgdmFyIGxvb2t1cCA9IEZTLmxvb2t1cFBhdGgocGF0aCwge1xuICAgIGZvbGxvdzogIWRvbnRSZXNvbHZlTGFzdExpbmtcbiAgIH0pO1xuICAgcGF0aCA9IGxvb2t1cC5wYXRoO1xuICB9IGNhdGNoIChlKSB7fVxuICB2YXIgcmV0ID0ge1xuICAgaXNSb290OiBmYWxzZSxcbiAgIGV4aXN0czogZmFsc2UsXG4gICBlcnJvcjogMCxcbiAgIG5hbWU6IG51bGwsXG4gICBwYXRoOiBudWxsLFxuICAgb2JqZWN0OiBudWxsLFxuICAgcGFyZW50RXhpc3RzOiBmYWxzZSxcbiAgIHBhcmVudFBhdGg6IG51bGwsXG4gICBwYXJlbnRPYmplY3Q6IG51bGxcbiAgfTtcbiAgdHJ5IHtcbiAgIHZhciBsb29rdXAgPSBGUy5sb29rdXBQYXRoKHBhdGgsIHtcbiAgICBwYXJlbnQ6IHRydWVcbiAgIH0pO1xuICAgcmV0LnBhcmVudEV4aXN0cyA9IHRydWU7XG4gICByZXQucGFyZW50UGF0aCA9IGxvb2t1cC5wYXRoO1xuICAgcmV0LnBhcmVudE9iamVjdCA9IGxvb2t1cC5ub2RlO1xuICAgcmV0Lm5hbWUgPSBQQVRILmJhc2VuYW1lKHBhdGgpO1xuICAgbG9va3VwID0gRlMubG9va3VwUGF0aChwYXRoLCB7XG4gICAgZm9sbG93OiAhZG9udFJlc29sdmVMYXN0TGlua1xuICAgfSk7XG4gICByZXQuZXhpc3RzID0gdHJ1ZTtcbiAgIHJldC5wYXRoID0gbG9va3VwLnBhdGg7XG4gICByZXQub2JqZWN0ID0gbG9va3VwLm5vZGU7XG4gICByZXQubmFtZSA9IGxvb2t1cC5ub2RlLm5hbWU7XG4gICByZXQuaXNSb290ID0gbG9va3VwLnBhdGggPT09IFwiL1wiO1xuICB9IGNhdGNoIChlKSB7XG4gICByZXQuZXJyb3IgPSBlLmVycm5vO1xuICB9XG4gIHJldHVybiByZXQ7XG4gfSxcbiBjcmVhdGVQYXRoOiBmdW5jdGlvbihwYXJlbnQsIHBhdGgsIGNhblJlYWQsIGNhbldyaXRlKSB7XG4gIHBhcmVudCA9IHR5cGVvZiBwYXJlbnQgPT09IFwic3RyaW5nXCIgPyBwYXJlbnQgOiBGUy5nZXRQYXRoKHBhcmVudCk7XG4gIHZhciBwYXJ0cyA9IHBhdGguc3BsaXQoXCIvXCIpLnJldmVyc2UoKTtcbiAgd2hpbGUgKHBhcnRzLmxlbmd0aCkge1xuICAgdmFyIHBhcnQgPSBwYXJ0cy5wb3AoKTtcbiAgIGlmICghcGFydCkgY29udGludWU7XG4gICB2YXIgY3VycmVudCA9IFBBVEguam9pbjIocGFyZW50LCBwYXJ0KTtcbiAgIHRyeSB7XG4gICAgRlMubWtkaXIoY3VycmVudCk7XG4gICB9IGNhdGNoIChlKSB7fVxuICAgcGFyZW50ID0gY3VycmVudDtcbiAgfVxuICByZXR1cm4gY3VycmVudDtcbiB9LFxuIGNyZWF0ZUZpbGU6IGZ1bmN0aW9uKHBhcmVudCwgbmFtZSwgcHJvcGVydGllcywgY2FuUmVhZCwgY2FuV3JpdGUpIHtcbiAgdmFyIHBhdGggPSBQQVRILmpvaW4yKHR5cGVvZiBwYXJlbnQgPT09IFwic3RyaW5nXCIgPyBwYXJlbnQgOiBGUy5nZXRQYXRoKHBhcmVudCksIG5hbWUpO1xuICB2YXIgbW9kZSA9IEZTLmdldE1vZGUoY2FuUmVhZCwgY2FuV3JpdGUpO1xuICByZXR1cm4gRlMuY3JlYXRlKHBhdGgsIG1vZGUpO1xuIH0sXG4gY3JlYXRlRGF0YUZpbGU6IGZ1bmN0aW9uKHBhcmVudCwgbmFtZSwgZGF0YSwgY2FuUmVhZCwgY2FuV3JpdGUsIGNhbk93bikge1xuICB2YXIgcGF0aCA9IG5hbWUgPyBQQVRILmpvaW4yKHR5cGVvZiBwYXJlbnQgPT09IFwic3RyaW5nXCIgPyBwYXJlbnQgOiBGUy5nZXRQYXRoKHBhcmVudCksIG5hbWUpIDogcGFyZW50O1xuICB2YXIgbW9kZSA9IEZTLmdldE1vZGUoY2FuUmVhZCwgY2FuV3JpdGUpO1xuICB2YXIgbm9kZSA9IEZTLmNyZWF0ZShwYXRoLCBtb2RlKTtcbiAgaWYgKGRhdGEpIHtcbiAgIGlmICh0eXBlb2YgZGF0YSA9PT0gXCJzdHJpbmdcIikge1xuICAgIHZhciBhcnIgPSBuZXcgQXJyYXkoZGF0YS5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgKytpKSBhcnJbaV0gPSBkYXRhLmNoYXJDb2RlQXQoaSk7XG4gICAgZGF0YSA9IGFycjtcbiAgIH1cbiAgIEZTLmNobW9kKG5vZGUsIG1vZGUgfCAxNDYpO1xuICAgdmFyIHN0cmVhbSA9IEZTLm9wZW4obm9kZSwgNTc3KTtcbiAgIEZTLndyaXRlKHN0cmVhbSwgZGF0YSwgMCwgZGF0YS5sZW5ndGgsIDAsIGNhbk93bik7XG4gICBGUy5jbG9zZShzdHJlYW0pO1xuICAgRlMuY2htb2Qobm9kZSwgbW9kZSk7XG4gIH1cbiAgcmV0dXJuIG5vZGU7XG4gfSxcbiBjcmVhdGVEZXZpY2U6IGZ1bmN0aW9uKHBhcmVudCwgbmFtZSwgaW5wdXQsIG91dHB1dCkge1xuICB2YXIgcGF0aCA9IFBBVEguam9pbjIodHlwZW9mIHBhcmVudCA9PT0gXCJzdHJpbmdcIiA/IHBhcmVudCA6IEZTLmdldFBhdGgocGFyZW50KSwgbmFtZSk7XG4gIHZhciBtb2RlID0gRlMuZ2V0TW9kZSghIWlucHV0LCAhIW91dHB1dCk7XG4gIGlmICghRlMuY3JlYXRlRGV2aWNlLm1ham9yKSBGUy5jcmVhdGVEZXZpY2UubWFqb3IgPSA2NDtcbiAgdmFyIGRldiA9IEZTLm1ha2VkZXYoRlMuY3JlYXRlRGV2aWNlLm1ham9yKyssIDApO1xuICBGUy5yZWdpc3RlckRldmljZShkZXYsIHtcbiAgIG9wZW46IGZ1bmN0aW9uKHN0cmVhbSkge1xuICAgIHN0cmVhbS5zZWVrYWJsZSA9IGZhbHNlO1xuICAgfSxcbiAgIGNsb3NlOiBmdW5jdGlvbihzdHJlYW0pIHtcbiAgICBpZiAob3V0cHV0ICYmIG91dHB1dC5idWZmZXIgJiYgb3V0cHV0LmJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgb3V0cHV0KDEwKTtcbiAgICB9XG4gICB9LFxuICAgcmVhZDogZnVuY3Rpb24oc3RyZWFtLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoLCBwb3MpIHtcbiAgICB2YXIgYnl0ZXNSZWFkID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgIHZhciByZXN1bHQ7XG4gICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSBpbnB1dCgpO1xuICAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigyOSk7XG4gICAgIH1cbiAgICAgaWYgKHJlc3VsdCA9PT0gdW5kZWZpbmVkICYmIGJ5dGVzUmVhZCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNik7XG4gICAgIH1cbiAgICAgaWYgKHJlc3VsdCA9PT0gbnVsbCB8fCByZXN1bHQgPT09IHVuZGVmaW5lZCkgYnJlYWs7XG4gICAgIGJ5dGVzUmVhZCsrO1xuICAgICBidWZmZXJbb2Zmc2V0ICsgaV0gPSByZXN1bHQ7XG4gICAgfVxuICAgIGlmIChieXRlc1JlYWQpIHtcbiAgICAgc3RyZWFtLm5vZGUudGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ5dGVzUmVhZDtcbiAgIH0sXG4gICB3cml0ZTogZnVuY3Rpb24oc3RyZWFtLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoLCBwb3MpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgIHRyeSB7XG4gICAgICBvdXRwdXQoYnVmZmVyW29mZnNldCArIGldKTtcbiAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMjkpO1xuICAgICB9XG4gICAgfVxuICAgIGlmIChsZW5ndGgpIHtcbiAgICAgc3RyZWFtLm5vZGUudGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICB9XG4gICAgcmV0dXJuIGk7XG4gICB9XG4gIH0pO1xuICByZXR1cm4gRlMubWtkZXYocGF0aCwgbW9kZSwgZGV2KTtcbiB9LFxuIGZvcmNlTG9hZEZpbGU6IGZ1bmN0aW9uKG9iaikge1xuICBpZiAob2JqLmlzRGV2aWNlIHx8IG9iai5pc0ZvbGRlciB8fCBvYmoubGluayB8fCBvYmouY29udGVudHMpIHJldHVybiB0cnVlO1xuICBpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICB0aHJvdyBuZXcgRXJyb3IoXCJMYXp5IGxvYWRpbmcgc2hvdWxkIGhhdmUgYmVlbiBwZXJmb3JtZWQgKGNvbnRlbnRzIHNldCkgaW4gY3JlYXRlTGF6eUZpbGUsIGJ1dCBpdCB3YXMgbm90LiBMYXp5IGxvYWRpbmcgb25seSB3b3JrcyBpbiB3ZWIgd29ya2Vycy4gVXNlIC0tZW1iZWQtZmlsZSBvciAtLXByZWxvYWQtZmlsZSBpbiBlbWNjIG9uIHRoZSBtYWluIHRocmVhZC5cIik7XG4gIH0gZWxzZSBpZiAocmVhZF8pIHtcbiAgIHRyeSB7XG4gICAgb2JqLmNvbnRlbnRzID0gaW50QXJyYXlGcm9tU3RyaW5nKHJlYWRfKG9iai51cmwpLCB0cnVlKTtcbiAgICBvYmoudXNlZEJ5dGVzID0gb2JqLmNvbnRlbnRzLmxlbmd0aDtcbiAgIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigyOSk7XG4gICB9XG4gIH0gZWxzZSB7XG4gICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgbG9hZCB3aXRob3V0IHJlYWQoKSBvciBYTUxIdHRwUmVxdWVzdC5cIik7XG4gIH1cbiB9LFxuIGNyZWF0ZUxhenlGaWxlOiBmdW5jdGlvbihwYXJlbnQsIG5hbWUsIHVybCwgY2FuUmVhZCwgY2FuV3JpdGUpIHtcbiAgZnVuY3Rpb24gTGF6eVVpbnQ4QXJyYXkoKSB7XG4gICB0aGlzLmxlbmd0aEtub3duID0gZmFsc2U7XG4gICB0aGlzLmNodW5rcyA9IFtdO1xuICB9XG4gIExhenlVaW50OEFycmF5LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBMYXp5VWludDhBcnJheV9nZXQoaWR4KSB7XG4gICBpZiAoaWR4ID4gdGhpcy5sZW5ndGggLSAxIHx8IGlkeCA8IDApIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgfVxuICAgdmFyIGNodW5rT2Zmc2V0ID0gaWR4ICUgdGhpcy5jaHVua1NpemU7XG4gICB2YXIgY2h1bmtOdW0gPSBpZHggLyB0aGlzLmNodW5rU2l6ZSB8IDA7XG4gICByZXR1cm4gdGhpcy5nZXR0ZXIoY2h1bmtOdW0pW2NodW5rT2Zmc2V0XTtcbiAgfTtcbiAgTGF6eVVpbnQ4QXJyYXkucHJvdG90eXBlLnNldERhdGFHZXR0ZXIgPSBmdW5jdGlvbiBMYXp5VWludDhBcnJheV9zZXREYXRhR2V0dGVyKGdldHRlcikge1xuICAgdGhpcy5nZXR0ZXIgPSBnZXR0ZXI7XG4gIH07XG4gIExhenlVaW50OEFycmF5LnByb3RvdHlwZS5jYWNoZUxlbmd0aCA9IGZ1bmN0aW9uIExhenlVaW50OEFycmF5X2NhY2hlTGVuZ3RoKCkge1xuICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgeGhyLm9wZW4oXCJIRUFEXCIsIHVybCwgZmFsc2UpO1xuICAgeGhyLnNlbmQobnVsbCk7XG4gICBpZiAoISh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwIHx8IHhoci5zdGF0dXMgPT09IDMwNCkpIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGxvYWQgXCIgKyB1cmwgKyBcIi4gU3RhdHVzOiBcIiArIHhoci5zdGF0dXMpO1xuICAgdmFyIGRhdGFsZW5ndGggPSBOdW1iZXIoeGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1sZW5ndGhcIikpO1xuICAgdmFyIGhlYWRlcjtcbiAgIHZhciBoYXNCeXRlU2VydmluZyA9IChoZWFkZXIgPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJBY2NlcHQtUmFuZ2VzXCIpKSAmJiBoZWFkZXIgPT09IFwiYnl0ZXNcIjtcbiAgIHZhciB1c2VzR3ppcCA9IChoZWFkZXIgPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LUVuY29kaW5nXCIpKSAmJiBoZWFkZXIgPT09IFwiZ3ppcFwiO1xuICAgdmFyIGNodW5rU2l6ZSA9IDEwMjQgKiAxMDI0O1xuICAgaWYgKCFoYXNCeXRlU2VydmluZykgY2h1bmtTaXplID0gZGF0YWxlbmd0aDtcbiAgIHZhciBkb1hIUiA9IGZ1bmN0aW9uKGZyb20sIHRvKSB7XG4gICAgaWYgKGZyb20gPiB0bykgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCByYW5nZSAoXCIgKyBmcm9tICsgXCIsIFwiICsgdG8gKyBcIikgb3Igbm8gYnl0ZXMgcmVxdWVzdGVkIVwiKTtcbiAgICBpZiAodG8gPiBkYXRhbGVuZ3RoIC0gMSkgdGhyb3cgbmV3IEVycm9yKFwib25seSBcIiArIGRhdGFsZW5ndGggKyBcIiBieXRlcyBhdmFpbGFibGUhIHByb2dyYW1tZXIgZXJyb3IhXCIpO1xuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB4aHIub3BlbihcIkdFVFwiLCB1cmwsIGZhbHNlKTtcbiAgICBpZiAoZGF0YWxlbmd0aCAhPT0gY2h1bmtTaXplKSB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlJhbmdlXCIsIFwiYnl0ZXM9XCIgKyBmcm9tICsgXCItXCIgKyB0byk7XG4gICAgaWYgKHR5cGVvZiBVaW50OEFycmF5ICE9IFwidW5kZWZpbmVkXCIpIHhoci5yZXNwb25zZVR5cGUgPSBcImFycmF5YnVmZmVyXCI7XG4gICAgaWYgKHhoci5vdmVycmlkZU1pbWVUeXBlKSB7XG4gICAgIHhoci5vdmVycmlkZU1pbWVUeXBlKFwidGV4dC9wbGFpbjsgY2hhcnNldD14LXVzZXItZGVmaW5lZFwiKTtcbiAgICB9XG4gICAgeGhyLnNlbmQobnVsbCk7XG4gICAgaWYgKCEoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCB8fCB4aHIuc3RhdHVzID09PSAzMDQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBsb2FkIFwiICsgdXJsICsgXCIuIFN0YXR1czogXCIgKyB4aHIuc3RhdHVzKTtcbiAgICBpZiAoeGhyLnJlc3BvbnNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KHhoci5yZXNwb25zZSB8fCBbXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgcmV0dXJuIGludEFycmF5RnJvbVN0cmluZyh4aHIucmVzcG9uc2VUZXh0IHx8IFwiXCIsIHRydWUpO1xuICAgIH1cbiAgIH07XG4gICB2YXIgbGF6eUFycmF5ID0gdGhpcztcbiAgIGxhenlBcnJheS5zZXREYXRhR2V0dGVyKGZ1bmN0aW9uKGNodW5rTnVtKSB7XG4gICAgdmFyIHN0YXJ0ID0gY2h1bmtOdW0gKiBjaHVua1NpemU7XG4gICAgdmFyIGVuZCA9IChjaHVua051bSArIDEpICogY2h1bmtTaXplIC0gMTtcbiAgICBlbmQgPSBNYXRoLm1pbihlbmQsIGRhdGFsZW5ndGggLSAxKTtcbiAgICBpZiAodHlwZW9mIGxhenlBcnJheS5jaHVua3NbY2h1bmtOdW1dID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgIGxhenlBcnJheS5jaHVua3NbY2h1bmtOdW1dID0gZG9YSFIoc3RhcnQsIGVuZCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbGF6eUFycmF5LmNodW5rc1tjaHVua051bV0gPT09IFwidW5kZWZpbmVkXCIpIHRocm93IG5ldyBFcnJvcihcImRvWEhSIGZhaWxlZCFcIik7XG4gICAgcmV0dXJuIGxhenlBcnJheS5jaHVua3NbY2h1bmtOdW1dO1xuICAgfSk7XG4gICBpZiAodXNlc0d6aXAgfHwgIWRhdGFsZW5ndGgpIHtcbiAgICBjaHVua1NpemUgPSBkYXRhbGVuZ3RoID0gMTtcbiAgICBkYXRhbGVuZ3RoID0gdGhpcy5nZXR0ZXIoMCkubGVuZ3RoO1xuICAgIGNodW5rU2l6ZSA9IGRhdGFsZW5ndGg7XG4gICAgb3V0KFwiTGF6eUZpbGVzIG9uIGd6aXAgZm9yY2VzIGRvd25sb2FkIG9mIHRoZSB3aG9sZSBmaWxlIHdoZW4gbGVuZ3RoIGlzIGFjY2Vzc2VkXCIpO1xuICAgfVxuICAgdGhpcy5fbGVuZ3RoID0gZGF0YWxlbmd0aDtcbiAgIHRoaXMuX2NodW5rU2l6ZSA9IGNodW5rU2l6ZTtcbiAgIHRoaXMubGVuZ3RoS25vd24gPSB0cnVlO1xuICB9O1xuICBpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICBpZiAoIUVOVklST05NRU5UX0lTX1dPUktFUikgdGhyb3cgXCJDYW5ub3QgZG8gc3luY2hyb25vdXMgYmluYXJ5IFhIUnMgb3V0c2lkZSB3ZWJ3b3JrZXJzIGluIG1vZGVybiBicm93c2Vycy4gVXNlIC0tZW1iZWQtZmlsZSBvciAtLXByZWxvYWQtZmlsZSBpbiBlbWNjXCI7XG4gICB2YXIgbGF6eUFycmF5ID0gbmV3IExhenlVaW50OEFycmF5KCk7XG4gICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhsYXp5QXJyYXksIHtcbiAgICBsZW5ndGg6IHtcbiAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghdGhpcy5sZW5ndGhLbm93bikge1xuICAgICAgIHRoaXMuY2FjaGVMZW5ndGgoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9sZW5ndGg7XG4gICAgIH1cbiAgICB9LFxuICAgIGNodW5rU2l6ZToge1xuICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCF0aGlzLmxlbmd0aEtub3duKSB7XG4gICAgICAgdGhpcy5jYWNoZUxlbmd0aCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX2NodW5rU2l6ZTtcbiAgICAgfVxuICAgIH1cbiAgIH0pO1xuICAgdmFyIHByb3BlcnRpZXMgPSB7XG4gICAgaXNEZXZpY2U6IGZhbHNlLFxuICAgIGNvbnRlbnRzOiBsYXp5QXJyYXlcbiAgIH07XG4gIH0gZWxzZSB7XG4gICB2YXIgcHJvcGVydGllcyA9IHtcbiAgICBpc0RldmljZTogZmFsc2UsXG4gICAgdXJsOiB1cmxcbiAgIH07XG4gIH1cbiAgdmFyIG5vZGUgPSBGUy5jcmVhdGVGaWxlKHBhcmVudCwgbmFtZSwgcHJvcGVydGllcywgY2FuUmVhZCwgY2FuV3JpdGUpO1xuICBpZiAocHJvcGVydGllcy5jb250ZW50cykge1xuICAgbm9kZS5jb250ZW50cyA9IHByb3BlcnRpZXMuY29udGVudHM7XG4gIH0gZWxzZSBpZiAocHJvcGVydGllcy51cmwpIHtcbiAgIG5vZGUuY29udGVudHMgPSBudWxsO1xuICAgbm9kZS51cmwgPSBwcm9wZXJ0aWVzLnVybDtcbiAgfVxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhub2RlLCB7XG4gICB1c2VkQnl0ZXM6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICByZXR1cm4gdGhpcy5jb250ZW50cy5sZW5ndGg7XG4gICAgfVxuICAgfVxuICB9KTtcbiAgdmFyIHN0cmVhbV9vcHMgPSB7fTtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhub2RlLnN0cmVhbV9vcHMpO1xuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICB2YXIgZm4gPSBub2RlLnN0cmVhbV9vcHNba2V5XTtcbiAgIHN0cmVhbV9vcHNba2V5XSA9IGZ1bmN0aW9uIGZvcmNlTG9hZExhenlGaWxlKCkge1xuICAgIEZTLmZvcmNlTG9hZEZpbGUobm9kZSk7XG4gICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICB9O1xuICB9KTtcbiAgc3RyZWFtX29wcy5yZWFkID0gZnVuY3Rpb24gc3RyZWFtX29wc19yZWFkKHN0cmVhbSwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24pIHtcbiAgIEZTLmZvcmNlTG9hZEZpbGUobm9kZSk7XG4gICB2YXIgY29udGVudHMgPSBzdHJlYW0ubm9kZS5jb250ZW50cztcbiAgIGlmIChwb3NpdGlvbiA+PSBjb250ZW50cy5sZW5ndGgpIHJldHVybiAwO1xuICAgdmFyIHNpemUgPSBNYXRoLm1pbihjb250ZW50cy5sZW5ndGggLSBwb3NpdGlvbiwgbGVuZ3RoKTtcbiAgIGFzc2VydChzaXplID49IDApO1xuICAgaWYgKGNvbnRlbnRzLnNsaWNlKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgYnVmZmVyW29mZnNldCArIGldID0gY29udGVudHNbcG9zaXRpb24gKyBpXTtcbiAgICB9XG4gICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgIGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGNvbnRlbnRzLmdldChwb3NpdGlvbiArIGkpO1xuICAgIH1cbiAgIH1cbiAgIHJldHVybiBzaXplO1xuICB9O1xuICBub2RlLnN0cmVhbV9vcHMgPSBzdHJlYW1fb3BzO1xuICByZXR1cm4gbm9kZTtcbiB9LFxuIGNyZWF0ZVByZWxvYWRlZEZpbGU6IGZ1bmN0aW9uKHBhcmVudCwgbmFtZSwgdXJsLCBjYW5SZWFkLCBjYW5Xcml0ZSwgb25sb2FkLCBvbmVycm9yLCBkb250Q3JlYXRlRmlsZSwgY2FuT3duLCBwcmVGaW5pc2gpIHtcbiAgQnJvd3Nlci5pbml0KCk7XG4gIHZhciBmdWxsbmFtZSA9IG5hbWUgPyBQQVRIX0ZTLnJlc29sdmUoUEFUSC5qb2luMihwYXJlbnQsIG5hbWUpKSA6IHBhcmVudDtcbiAgdmFyIGRlcCA9IGdldFVuaXF1ZVJ1bkRlcGVuZGVuY3koXCJjcCBcIiArIGZ1bGxuYW1lKTtcbiAgZnVuY3Rpb24gcHJvY2Vzc0RhdGEoYnl0ZUFycmF5KSB7XG4gICBmdW5jdGlvbiBmaW5pc2goYnl0ZUFycmF5KSB7XG4gICAgaWYgKHByZUZpbmlzaCkgcHJlRmluaXNoKCk7XG4gICAgaWYgKCFkb250Q3JlYXRlRmlsZSkge1xuICAgICBGUy5jcmVhdGVEYXRhRmlsZShwYXJlbnQsIG5hbWUsIGJ5dGVBcnJheSwgY2FuUmVhZCwgY2FuV3JpdGUsIGNhbk93bik7XG4gICAgfVxuICAgIGlmIChvbmxvYWQpIG9ubG9hZCgpO1xuICAgIHJlbW92ZVJ1bkRlcGVuZGVuY3koZGVwKTtcbiAgIH1cbiAgIHZhciBoYW5kbGVkID0gZmFsc2U7XG4gICBNb2R1bGVbXCJwcmVsb2FkUGx1Z2luc1wiXS5mb3JFYWNoKGZ1bmN0aW9uKHBsdWdpbikge1xuICAgIGlmIChoYW5kbGVkKSByZXR1cm47XG4gICAgaWYgKHBsdWdpbltcImNhbkhhbmRsZVwiXShmdWxsbmFtZSkpIHtcbiAgICAgcGx1Z2luW1wiaGFuZGxlXCJdKGJ5dGVBcnJheSwgZnVsbG5hbWUsIGZpbmlzaCwgZnVuY3Rpb24oKSB7XG4gICAgICBpZiAob25lcnJvcikgb25lcnJvcigpO1xuICAgICAgcmVtb3ZlUnVuRGVwZW5kZW5jeShkZXApO1xuICAgICB9KTtcbiAgICAgaGFuZGxlZCA9IHRydWU7XG4gICAgfVxuICAgfSk7XG4gICBpZiAoIWhhbmRsZWQpIGZpbmlzaChieXRlQXJyYXkpO1xuICB9XG4gIGFkZFJ1bkRlcGVuZGVuY3koZGVwKTtcbiAgaWYgKHR5cGVvZiB1cmwgPT0gXCJzdHJpbmdcIikge1xuICAgQnJvd3Nlci5hc3luY0xvYWQodXJsLCBmdW5jdGlvbihieXRlQXJyYXkpIHtcbiAgICBwcm9jZXNzRGF0YShieXRlQXJyYXkpO1xuICAgfSwgb25lcnJvcik7XG4gIH0gZWxzZSB7XG4gICBwcm9jZXNzRGF0YSh1cmwpO1xuICB9XG4gfSxcbiBpbmRleGVkREI6IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gd2luZG93LmluZGV4ZWREQiB8fCB3aW5kb3cubW96SW5kZXhlZERCIHx8IHdpbmRvdy53ZWJraXRJbmRleGVkREIgfHwgd2luZG93Lm1zSW5kZXhlZERCO1xuIH0sXG4gREJfTkFNRTogZnVuY3Rpb24oKSB7XG4gIHJldHVybiBcIkVNX0ZTX1wiICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuIH0sXG4gREJfVkVSU0lPTjogMjAsXG4gREJfU1RPUkVfTkFNRTogXCJGSUxFX0RBVEFcIixcbiBzYXZlRmlsZXNUb0RCOiBmdW5jdGlvbihwYXRocywgb25sb2FkLCBvbmVycm9yKSB7XG4gIG9ubG9hZCA9IG9ubG9hZCB8fCBmdW5jdGlvbigpIHt9O1xuICBvbmVycm9yID0gb25lcnJvciB8fCBmdW5jdGlvbigpIHt9O1xuICB2YXIgaW5kZXhlZERCID0gRlMuaW5kZXhlZERCKCk7XG4gIHRyeSB7XG4gICB2YXIgb3BlblJlcXVlc3QgPSBpbmRleGVkREIub3BlbihGUy5EQl9OQU1FKCksIEZTLkRCX1ZFUlNJT04pO1xuICB9IGNhdGNoIChlKSB7XG4gICByZXR1cm4gb25lcnJvcihlKTtcbiAgfVxuICBvcGVuUmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSBmdW5jdGlvbiBvcGVuUmVxdWVzdF9vbnVwZ3JhZGVuZWVkZWQoKSB7XG4gICBvdXQoXCJjcmVhdGluZyBkYlwiKTtcbiAgIHZhciBkYiA9IG9wZW5SZXF1ZXN0LnJlc3VsdDtcbiAgIGRiLmNyZWF0ZU9iamVjdFN0b3JlKEZTLkRCX1NUT1JFX05BTUUpO1xuICB9O1xuICBvcGVuUmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbiBvcGVuUmVxdWVzdF9vbnN1Y2Nlc3MoKSB7XG4gICB2YXIgZGIgPSBvcGVuUmVxdWVzdC5yZXN1bHQ7XG4gICB2YXIgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbihbIEZTLkRCX1NUT1JFX05BTUUgXSwgXCJyZWFkd3JpdGVcIik7XG4gICB2YXIgZmlsZXMgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShGUy5EQl9TVE9SRV9OQU1FKTtcbiAgIHZhciBvayA9IDAsIGZhaWwgPSAwLCB0b3RhbCA9IHBhdGhzLmxlbmd0aDtcbiAgIGZ1bmN0aW9uIGZpbmlzaCgpIHtcbiAgICBpZiAoZmFpbCA9PSAwKSBvbmxvYWQoKTsgZWxzZSBvbmVycm9yKCk7XG4gICB9XG4gICBwYXRocy5mb3JFYWNoKGZ1bmN0aW9uKHBhdGgpIHtcbiAgICB2YXIgcHV0UmVxdWVzdCA9IGZpbGVzLnB1dChGUy5hbmFseXplUGF0aChwYXRoKS5vYmplY3QuY29udGVudHMsIHBhdGgpO1xuICAgIHB1dFJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24gcHV0UmVxdWVzdF9vbnN1Y2Nlc3MoKSB7XG4gICAgIG9rKys7XG4gICAgIGlmIChvayArIGZhaWwgPT0gdG90YWwpIGZpbmlzaCgpO1xuICAgIH07XG4gICAgcHV0UmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gcHV0UmVxdWVzdF9vbmVycm9yKCkge1xuICAgICBmYWlsKys7XG4gICAgIGlmIChvayArIGZhaWwgPT0gdG90YWwpIGZpbmlzaCgpO1xuICAgIH07XG4gICB9KTtcbiAgIHRyYW5zYWN0aW9uLm9uZXJyb3IgPSBvbmVycm9yO1xuICB9O1xuICBvcGVuUmVxdWVzdC5vbmVycm9yID0gb25lcnJvcjtcbiB9LFxuIGxvYWRGaWxlc0Zyb21EQjogZnVuY3Rpb24ocGF0aHMsIG9ubG9hZCwgb25lcnJvcikge1xuICBvbmxvYWQgPSBvbmxvYWQgfHwgZnVuY3Rpb24oKSB7fTtcbiAgb25lcnJvciA9IG9uZXJyb3IgfHwgZnVuY3Rpb24oKSB7fTtcbiAgdmFyIGluZGV4ZWREQiA9IEZTLmluZGV4ZWREQigpO1xuICB0cnkge1xuICAgdmFyIG9wZW5SZXF1ZXN0ID0gaW5kZXhlZERCLm9wZW4oRlMuREJfTkFNRSgpLCBGUy5EQl9WRVJTSU9OKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgcmV0dXJuIG9uZXJyb3IoZSk7XG4gIH1cbiAgb3BlblJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gb25lcnJvcjtcbiAgb3BlblJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24gb3BlblJlcXVlc3Rfb25zdWNjZXNzKCkge1xuICAgdmFyIGRiID0gb3BlblJlcXVlc3QucmVzdWx0O1xuICAgdHJ5IHtcbiAgICB2YXIgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbihbIEZTLkRCX1NUT1JFX05BTUUgXSwgXCJyZWFkb25seVwiKTtcbiAgIH0gY2F0Y2ggKGUpIHtcbiAgICBvbmVycm9yKGUpO1xuICAgIHJldHVybjtcbiAgIH1cbiAgIHZhciBmaWxlcyA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKEZTLkRCX1NUT1JFX05BTUUpO1xuICAgdmFyIG9rID0gMCwgZmFpbCA9IDAsIHRvdGFsID0gcGF0aHMubGVuZ3RoO1xuICAgZnVuY3Rpb24gZmluaXNoKCkge1xuICAgIGlmIChmYWlsID09IDApIG9ubG9hZCgpOyBlbHNlIG9uZXJyb3IoKTtcbiAgIH1cbiAgIHBhdGhzLmZvckVhY2goZnVuY3Rpb24ocGF0aCkge1xuICAgIHZhciBnZXRSZXF1ZXN0ID0gZmlsZXMuZ2V0KHBhdGgpO1xuICAgIGdldFJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24gZ2V0UmVxdWVzdF9vbnN1Y2Nlc3MoKSB7XG4gICAgIGlmIChGUy5hbmFseXplUGF0aChwYXRoKS5leGlzdHMpIHtcbiAgICAgIEZTLnVubGluayhwYXRoKTtcbiAgICAgfVxuICAgICBGUy5jcmVhdGVEYXRhRmlsZShQQVRILmRpcm5hbWUocGF0aCksIFBBVEguYmFzZW5hbWUocGF0aCksIGdldFJlcXVlc3QucmVzdWx0LCB0cnVlLCB0cnVlLCB0cnVlKTtcbiAgICAgb2srKztcbiAgICAgaWYgKG9rICsgZmFpbCA9PSB0b3RhbCkgZmluaXNoKCk7XG4gICAgfTtcbiAgICBnZXRSZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBnZXRSZXF1ZXN0X29uZXJyb3IoKSB7XG4gICAgIGZhaWwrKztcbiAgICAgaWYgKG9rICsgZmFpbCA9PSB0b3RhbCkgZmluaXNoKCk7XG4gICAgfTtcbiAgIH0pO1xuICAgdHJhbnNhY3Rpb24ub25lcnJvciA9IG9uZXJyb3I7XG4gIH07XG4gIG9wZW5SZXF1ZXN0Lm9uZXJyb3IgPSBvbmVycm9yO1xuIH0sXG4gYWJzb2x1dGVQYXRoOiBmdW5jdGlvbigpIHtcbiAgYWJvcnQoXCJGUy5hYnNvbHV0ZVBhdGggaGFzIGJlZW4gcmVtb3ZlZDsgdXNlIFBBVEhfRlMucmVzb2x2ZSBpbnN0ZWFkXCIpO1xuIH0sXG4gY3JlYXRlRm9sZGVyOiBmdW5jdGlvbigpIHtcbiAgYWJvcnQoXCJGUy5jcmVhdGVGb2xkZXIgaGFzIGJlZW4gcmVtb3ZlZDsgdXNlIEZTLm1rZGlyIGluc3RlYWRcIik7XG4gfSxcbiBjcmVhdGVMaW5rOiBmdW5jdGlvbigpIHtcbiAgYWJvcnQoXCJGUy5jcmVhdGVMaW5rIGhhcyBiZWVuIHJlbW92ZWQ7IHVzZSBGUy5zeW1saW5rIGluc3RlYWRcIik7XG4gfSxcbiBqb2luUGF0aDogZnVuY3Rpb24oKSB7XG4gIGFib3J0KFwiRlMuam9pblBhdGggaGFzIGJlZW4gcmVtb3ZlZDsgdXNlIFBBVEguam9pbiBpbnN0ZWFkXCIpO1xuIH0sXG4gbW1hcEFsbG9jOiBmdW5jdGlvbigpIHtcbiAgYWJvcnQoXCJGUy5tbWFwQWxsb2MgaGFzIGJlZW4gcmVwbGFjZWQgYnkgdGhlIHRvcCBsZXZlbCBmdW5jdGlvbiBtbWFwQWxsb2NcIik7XG4gfSxcbiBzdGFuZGFyZGl6ZVBhdGg6IGZ1bmN0aW9uKCkge1xuICBhYm9ydChcIkZTLnN0YW5kYXJkaXplUGF0aCBoYXMgYmVlbiByZW1vdmVkOyB1c2UgUEFUSC5ub3JtYWxpemUgaW5zdGVhZFwiKTtcbiB9XG59O1xuXG52YXIgU1lTQ0FMTFMgPSB7XG4gbWFwcGluZ3M6IHt9LFxuIERFRkFVTFRfUE9MTE1BU0s6IDUsXG4gdW1hc2s6IDUxMSxcbiBjYWxjdWxhdGVBdDogZnVuY3Rpb24oZGlyZmQsIHBhdGgpIHtcbiAgaWYgKHBhdGhbMF0gIT09IFwiL1wiKSB7XG4gICB2YXIgZGlyO1xuICAgaWYgKGRpcmZkID09PSAtMTAwKSB7XG4gICAgZGlyID0gRlMuY3dkKCk7XG4gICB9IGVsc2Uge1xuICAgIHZhciBkaXJzdHJlYW0gPSBGUy5nZXRTdHJlYW0oZGlyZmQpO1xuICAgIGlmICghZGlyc3RyZWFtKSB0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig4KTtcbiAgICBkaXIgPSBkaXJzdHJlYW0ucGF0aDtcbiAgIH1cbiAgIHBhdGggPSBQQVRILmpvaW4yKGRpciwgcGF0aCk7XG4gIH1cbiAgcmV0dXJuIHBhdGg7XG4gfSxcbiBkb1N0YXQ6IGZ1bmN0aW9uKGZ1bmMsIHBhdGgsIGJ1Zikge1xuICB0cnkge1xuICAgdmFyIHN0YXQgPSBmdW5jKHBhdGgpO1xuICB9IGNhdGNoIChlKSB7XG4gICBpZiAoZSAmJiBlLm5vZGUgJiYgUEFUSC5ub3JtYWxpemUocGF0aCkgIT09IFBBVEgubm9ybWFsaXplKEZTLmdldFBhdGgoZS5ub2RlKSkpIHtcbiAgICByZXR1cm4gLTU0O1xuICAgfVxuICAgdGhyb3cgZTtcbiAgfVxuICBTQUZFX0hFQVBfU1RPUkUoYnVmIHwgMCwgc3RhdC5kZXYgfCAwLCA0KTtcbiAgU0FGRV9IRUFQX1NUT1JFKGJ1ZiArIDQgfCAwLCAwIHwgMCwgNCk7XG4gIFNBRkVfSEVBUF9TVE9SRShidWYgKyA4IHwgMCwgc3RhdC5pbm8gfCAwLCA0KTtcbiAgU0FGRV9IRUFQX1NUT1JFKGJ1ZiArIDEyIHwgMCwgc3RhdC5tb2RlIHwgMCwgNCk7XG4gIFNBRkVfSEVBUF9TVE9SRShidWYgKyAxNiB8IDAsIHN0YXQubmxpbmsgfCAwLCA0KTtcbiAgU0FGRV9IRUFQX1NUT1JFKGJ1ZiArIDIwIHwgMCwgc3RhdC51aWQgfCAwLCA0KTtcbiAgU0FGRV9IRUFQX1NUT1JFKGJ1ZiArIDI0IHwgMCwgc3RhdC5naWQgfCAwLCA0KTtcbiAgU0FGRV9IRUFQX1NUT1JFKGJ1ZiArIDI4IHwgMCwgc3RhdC5yZGV2IHwgMCwgNCk7XG4gIFNBRkVfSEVBUF9TVE9SRShidWYgKyAzMiB8IDAsIDAgfCAwLCA0KTtcbiAgdGVtcEk2NCA9IFsgc3RhdC5zaXplID4+PiAwLCAodGVtcERvdWJsZSA9IHN0YXQuc2l6ZSwgK01hdGguYWJzKHRlbXBEb3VibGUpID49IDEgPyB0ZW1wRG91YmxlID4gMCA/IChNYXRoLm1pbigrTWF0aC5mbG9vcih0ZW1wRG91YmxlIC8gNDI5NDk2NzI5NiksIDQyOTQ5NjcyOTUpIHwgMCkgPj4+IDAgOiB+fitNYXRoLmNlaWwoKHRlbXBEb3VibGUgLSArKH5+dGVtcERvdWJsZSA+Pj4gMCkpIC8gNDI5NDk2NzI5NikgPj4+IDAgOiAwKSBdLCBcbiAgU0FGRV9IRUFQX1NUT1JFKGJ1ZiArIDQwIHwgMCwgdGVtcEk2NFswXSB8IDAsIDQpLCBTQUZFX0hFQVBfU1RPUkUoYnVmICsgNDQgfCAwLCB0ZW1wSTY0WzFdIHwgMCwgNCk7XG4gIFNBRkVfSEVBUF9TVE9SRShidWYgKyA0OCB8IDAsIDQwOTYgfCAwLCA0KTtcbiAgU0FGRV9IRUFQX1NUT1JFKGJ1ZiArIDUyIHwgMCwgc3RhdC5ibG9ja3MgfCAwLCA0KTtcbiAgU0FGRV9IRUFQX1NUT1JFKGJ1ZiArIDU2IHwgMCwgc3RhdC5hdGltZS5nZXRUaW1lKCkgLyAxZTMgfCAwIHwgMCwgNCk7XG4gIFNBRkVfSEVBUF9TVE9SRShidWYgKyA2MCB8IDAsIDAgfCAwLCA0KTtcbiAgU0FGRV9IRUFQX1NUT1JFKGJ1ZiArIDY0IHwgMCwgc3RhdC5tdGltZS5nZXRUaW1lKCkgLyAxZTMgfCAwIHwgMCwgNCk7XG4gIFNBRkVfSEVBUF9TVE9SRShidWYgKyA2OCB8IDAsIDAgfCAwLCA0KTtcbiAgU0FGRV9IRUFQX1NUT1JFKGJ1ZiArIDcyIHwgMCwgc3RhdC5jdGltZS5nZXRUaW1lKCkgLyAxZTMgfCAwIHwgMCwgNCk7XG4gIFNBRkVfSEVBUF9TVE9SRShidWYgKyA3NiB8IDAsIDAgfCAwLCA0KTtcbiAgdGVtcEk2NCA9IFsgc3RhdC5pbm8gPj4+IDAsICh0ZW1wRG91YmxlID0gc3RhdC5pbm8sICtNYXRoLmFicyh0ZW1wRG91YmxlKSA+PSAxID8gdGVtcERvdWJsZSA+IDAgPyAoTWF0aC5taW4oK01hdGguZmxvb3IodGVtcERvdWJsZSAvIDQyOTQ5NjcyOTYpLCA0Mjk0OTY3Mjk1KSB8IDApID4+PiAwIDogfn4rTWF0aC5jZWlsKCh0ZW1wRG91YmxlIC0gKyh+fnRlbXBEb3VibGUgPj4+IDApKSAvIDQyOTQ5NjcyOTYpID4+PiAwIDogMCkgXSwgXG4gIFNBRkVfSEVBUF9TVE9SRShidWYgKyA4MCB8IDAsIHRlbXBJNjRbMF0gfCAwLCA0KSwgU0FGRV9IRUFQX1NUT1JFKGJ1ZiArIDg0IHwgMCwgdGVtcEk2NFsxXSB8IDAsIDQpO1xuICByZXR1cm4gMDtcbiB9LFxuIGRvTXN5bmM6IGZ1bmN0aW9uKGFkZHIsIHN0cmVhbSwgbGVuLCBmbGFncywgb2Zmc2V0KSB7XG4gIHZhciBidWZmZXIgPSBIRUFQVTguc2xpY2UoYWRkciwgYWRkciArIGxlbik7XG4gIEZTLm1zeW5jKHN0cmVhbSwgYnVmZmVyLCBvZmZzZXQsIGxlbiwgZmxhZ3MpO1xuIH0sXG4gZG9Na2RpcjogZnVuY3Rpb24ocGF0aCwgbW9kZSkge1xuICBwYXRoID0gUEFUSC5ub3JtYWxpemUocGF0aCk7XG4gIGlmIChwYXRoW3BhdGgubGVuZ3RoIC0gMV0gPT09IFwiL1wiKSBwYXRoID0gcGF0aC5zdWJzdHIoMCwgcGF0aC5sZW5ndGggLSAxKTtcbiAgRlMubWtkaXIocGF0aCwgbW9kZSwgMCk7XG4gIHJldHVybiAwO1xuIH0sXG4gZG9Na25vZDogZnVuY3Rpb24ocGF0aCwgbW9kZSwgZGV2KSB7XG4gIHN3aXRjaCAobW9kZSAmIDYxNDQwKSB7XG4gIGNhc2UgMzI3Njg6XG4gIGNhc2UgODE5MjpcbiAgY2FzZSAyNDU3NjpcbiAgY2FzZSA0MDk2OlxuICBjYXNlIDQ5MTUyOlxuICAgYnJlYWs7XG5cbiAgZGVmYXVsdDpcbiAgIHJldHVybiAtMjg7XG4gIH1cbiAgRlMubWtub2QocGF0aCwgbW9kZSwgZGV2KTtcbiAgcmV0dXJuIDA7XG4gfSxcbiBkb1JlYWRsaW5rOiBmdW5jdGlvbihwYXRoLCBidWYsIGJ1ZnNpemUpIHtcbiAgaWYgKGJ1ZnNpemUgPD0gMCkgcmV0dXJuIC0yODtcbiAgdmFyIHJldCA9IEZTLnJlYWRsaW5rKHBhdGgpO1xuICB2YXIgbGVuID0gTWF0aC5taW4oYnVmc2l6ZSwgbGVuZ3RoQnl0ZXNVVEY4KHJldCkpO1xuICB2YXIgZW5kQ2hhciA9IFNBRkVfSEVBUF9MT0FEKGJ1ZiArIGxlbiwgMSwgMCk7XG4gIHN0cmluZ1RvVVRGOChyZXQsIGJ1ZiwgYnVmc2l6ZSArIDEpO1xuICBTQUZFX0hFQVBfU1RPUkUoYnVmICsgbGVuLCBlbmRDaGFyLCAxKTtcbiAgcmV0dXJuIGxlbjtcbiB9LFxuIGRvQWNjZXNzOiBmdW5jdGlvbihwYXRoLCBhbW9kZSkge1xuICBpZiAoYW1vZGUgJiB+Nykge1xuICAgcmV0dXJuIC0yODtcbiAgfVxuICB2YXIgbm9kZTtcbiAgdmFyIGxvb2t1cCA9IEZTLmxvb2t1cFBhdGgocGF0aCwge1xuICAgZm9sbG93OiB0cnVlXG4gIH0pO1xuICBub2RlID0gbG9va3VwLm5vZGU7XG4gIGlmICghbm9kZSkge1xuICAgcmV0dXJuIC00NDtcbiAgfVxuICB2YXIgcGVybXMgPSBcIlwiO1xuICBpZiAoYW1vZGUgJiA0KSBwZXJtcyArPSBcInJcIjtcbiAgaWYgKGFtb2RlICYgMikgcGVybXMgKz0gXCJ3XCI7XG4gIGlmIChhbW9kZSAmIDEpIHBlcm1zICs9IFwieFwiO1xuICBpZiAocGVybXMgJiYgRlMubm9kZVBlcm1pc3Npb25zKG5vZGUsIHBlcm1zKSkge1xuICAgcmV0dXJuIC0yO1xuICB9XG4gIHJldHVybiAwO1xuIH0sXG4gZG9EdXA6IGZ1bmN0aW9uKHBhdGgsIGZsYWdzLCBzdWdnZXN0RkQpIHtcbiAgdmFyIHN1Z2dlc3QgPSBGUy5nZXRTdHJlYW0oc3VnZ2VzdEZEKTtcbiAgaWYgKHN1Z2dlc3QpIEZTLmNsb3NlKHN1Z2dlc3QpO1xuICByZXR1cm4gRlMub3BlbihwYXRoLCBmbGFncywgMCwgc3VnZ2VzdEZELCBzdWdnZXN0RkQpLmZkO1xuIH0sXG4gZG9SZWFkdjogZnVuY3Rpb24oc3RyZWFtLCBpb3YsIGlvdmNudCwgb2Zmc2V0KSB7XG4gIHZhciByZXQgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGlvdmNudDsgaSsrKSB7XG4gICB2YXIgcHRyID0gU0FGRV9IRUFQX0xPQUQoaW92ICsgaSAqIDggfCAwLCA0LCAwKSB8IDA7XG4gICB2YXIgbGVuID0gU0FGRV9IRUFQX0xPQUQoaW92ICsgKGkgKiA4ICsgNCkgfCAwLCA0LCAwKSB8IDA7XG4gICB2YXIgY3VyciA9IEZTLnJlYWQoc3RyZWFtLCBIRUFQOCwgcHRyLCBsZW4sIG9mZnNldCk7XG4gICBpZiAoY3VyciA8IDApIHJldHVybiAtMTtcbiAgIHJldCArPSBjdXJyO1xuICAgaWYgKGN1cnIgPCBsZW4pIGJyZWFrO1xuICB9XG4gIHJldHVybiByZXQ7XG4gfSxcbiBkb1dyaXRldjogZnVuY3Rpb24oc3RyZWFtLCBpb3YsIGlvdmNudCwgb2Zmc2V0KSB7XG4gIHZhciByZXQgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGlvdmNudDsgaSsrKSB7XG4gICB2YXIgcHRyID0gU0FGRV9IRUFQX0xPQUQoaW92ICsgaSAqIDggfCAwLCA0LCAwKSB8IDA7XG4gICB2YXIgbGVuID0gU0FGRV9IRUFQX0xPQUQoaW92ICsgKGkgKiA4ICsgNCkgfCAwLCA0LCAwKSB8IDA7XG4gICB2YXIgY3VyciA9IEZTLndyaXRlKHN0cmVhbSwgSEVBUDgsIHB0ciwgbGVuLCBvZmZzZXQpO1xuICAgaWYgKGN1cnIgPCAwKSByZXR1cm4gLTE7XG4gICByZXQgKz0gY3VycjtcbiAgfVxuICByZXR1cm4gcmV0O1xuIH0sXG4gdmFyYXJnczogdW5kZWZpbmVkLFxuIGdldDogZnVuY3Rpb24oKSB7XG4gIGFzc2VydChTWVNDQUxMUy52YXJhcmdzICE9IHVuZGVmaW5lZCk7XG4gIFNZU0NBTExTLnZhcmFyZ3MgKz0gNDtcbiAgdmFyIHJldCA9IFNBRkVfSEVBUF9MT0FEKFNZU0NBTExTLnZhcmFyZ3MgLSA0IHwgMCwgNCwgMCkgfCAwO1xuICByZXR1cm4gcmV0O1xuIH0sXG4gZ2V0U3RyOiBmdW5jdGlvbihwdHIpIHtcbiAgdmFyIHJldCA9IFVURjhUb1N0cmluZyhwdHIpO1xuICByZXR1cm4gcmV0O1xuIH0sXG4gZ2V0U3RyZWFtRnJvbUZEOiBmdW5jdGlvbihmZCkge1xuICB2YXIgc3RyZWFtID0gRlMuZ2V0U3RyZWFtKGZkKTtcbiAgaWYgKCFzdHJlYW0pIHRocm93IG5ldyBGUy5FcnJub0Vycm9yKDgpO1xuICByZXR1cm4gc3RyZWFtO1xuIH0sXG4gZ2V0NjQ6IGZ1bmN0aW9uKGxvdywgaGlnaCkge1xuICBpZiAobG93ID49IDApIGFzc2VydChoaWdoID09PSAwKTsgZWxzZSBhc3NlcnQoaGlnaCA9PT0gLTEpO1xuICByZXR1cm4gbG93O1xuIH1cbn07XG5cbmZ1bmN0aW9uIF9lbnZpcm9uX2dldChfX2Vudmlyb24sIGVudmlyb25fYnVmKSB7XG4gdHJ5IHtcbiAgdmFyIGJ1ZlNpemUgPSAwO1xuICBnZXRFbnZTdHJpbmdzKCkuZm9yRWFjaChmdW5jdGlvbihzdHJpbmcsIGkpIHtcbiAgIHZhciBwdHIgPSBlbnZpcm9uX2J1ZiArIGJ1ZlNpemU7XG4gICBTQUZFX0hFQVBfU1RPUkUoX19lbnZpcm9uICsgaSAqIDQgfCAwLCBwdHIgfCAwLCA0KTtcbiAgIHdyaXRlQXNjaWlUb01lbW9yeShzdHJpbmcsIHB0cik7XG4gICBidWZTaXplICs9IHN0cmluZy5sZW5ndGggKyAxO1xuICB9KTtcbiAgcmV0dXJuIDA7XG4gfSBjYXRjaCAoZSkge1xuICBpZiAodHlwZW9mIEZTID09PSBcInVuZGVmaW5lZFwiIHx8ICEoZSBpbnN0YW5jZW9mIEZTLkVycm5vRXJyb3IpKSBhYm9ydChlKTtcbiAgcmV0dXJuIGUuZXJybm87XG4gfVxufVxuXG5mdW5jdGlvbiBfZW52aXJvbl9zaXplc19nZXQocGVudmlyb25fY291bnQsIHBlbnZpcm9uX2J1Zl9zaXplKSB7XG4gdHJ5IHtcbiAgdmFyIHN0cmluZ3MgPSBnZXRFbnZTdHJpbmdzKCk7XG4gIFNBRkVfSEVBUF9TVE9SRShwZW52aXJvbl9jb3VudCB8IDAsIHN0cmluZ3MubGVuZ3RoIHwgMCwgNCk7XG4gIHZhciBidWZTaXplID0gMDtcbiAgc3RyaW5ncy5mb3JFYWNoKGZ1bmN0aW9uKHN0cmluZykge1xuICAgYnVmU2l6ZSArPSBzdHJpbmcubGVuZ3RoICsgMTtcbiAgfSk7XG4gIFNBRkVfSEVBUF9TVE9SRShwZW52aXJvbl9idWZfc2l6ZSB8IDAsIGJ1ZlNpemUgfCAwLCA0KTtcbiAgcmV0dXJuIDA7XG4gfSBjYXRjaCAoZSkge1xuICBpZiAodHlwZW9mIEZTID09PSBcInVuZGVmaW5lZFwiIHx8ICEoZSBpbnN0YW5jZW9mIEZTLkVycm5vRXJyb3IpKSBhYm9ydChlKTtcbiAgcmV0dXJuIGUuZXJybm87XG4gfVxufVxuXG5mdW5jdGlvbiBfZmRfY2xvc2UoZmQpIHtcbiB0cnkge1xuICB2YXIgc3RyZWFtID0gU1lTQ0FMTFMuZ2V0U3RyZWFtRnJvbUZEKGZkKTtcbiAgRlMuY2xvc2Uoc3RyZWFtKTtcbiAgcmV0dXJuIDA7XG4gfSBjYXRjaCAoZSkge1xuICBpZiAodHlwZW9mIEZTID09PSBcInVuZGVmaW5lZFwiIHx8ICEoZSBpbnN0YW5jZW9mIEZTLkVycm5vRXJyb3IpKSBhYm9ydChlKTtcbiAgcmV0dXJuIGUuZXJybm87XG4gfVxufVxuXG5mdW5jdGlvbiBfZmRfcmVhZChmZCwgaW92LCBpb3ZjbnQsIHBudW0pIHtcbiB0cnkge1xuICB2YXIgc3RyZWFtID0gU1lTQ0FMTFMuZ2V0U3RyZWFtRnJvbUZEKGZkKTtcbiAgdmFyIG51bSA9IFNZU0NBTExTLmRvUmVhZHYoc3RyZWFtLCBpb3YsIGlvdmNudCk7XG4gIFNBRkVfSEVBUF9TVE9SRShwbnVtIHwgMCwgbnVtIHwgMCwgNCk7XG4gIHJldHVybiAwO1xuIH0gY2F0Y2ggKGUpIHtcbiAgaWYgKHR5cGVvZiBGUyA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhKGUgaW5zdGFuY2VvZiBGUy5FcnJub0Vycm9yKSkgYWJvcnQoZSk7XG4gIHJldHVybiBlLmVycm5vO1xuIH1cbn1cblxuZnVuY3Rpb24gX2ZkX3NlZWsoZmQsIG9mZnNldF9sb3csIG9mZnNldF9oaWdoLCB3aGVuY2UsIG5ld09mZnNldCkge1xuIHRyeSB7XG4gIHZhciBzdHJlYW0gPSBTWVNDQUxMUy5nZXRTdHJlYW1Gcm9tRkQoZmQpO1xuICB2YXIgSElHSF9PRkZTRVQgPSA0Mjk0OTY3Mjk2O1xuICB2YXIgb2Zmc2V0ID0gb2Zmc2V0X2hpZ2ggKiBISUdIX09GRlNFVCArIChvZmZzZXRfbG93ID4+PiAwKTtcbiAgdmFyIERPVUJMRV9MSU1JVCA9IDkwMDcxOTkyNTQ3NDA5OTI7XG4gIGlmIChvZmZzZXQgPD0gLURPVUJMRV9MSU1JVCB8fCBvZmZzZXQgPj0gRE9VQkxFX0xJTUlUKSB7XG4gICByZXR1cm4gLTYxO1xuICB9XG4gIEZTLmxsc2VlayhzdHJlYW0sIG9mZnNldCwgd2hlbmNlKTtcbiAgdGVtcEk2NCA9IFsgc3RyZWFtLnBvc2l0aW9uID4+PiAwLCAodGVtcERvdWJsZSA9IHN0cmVhbS5wb3NpdGlvbiwgK01hdGguYWJzKHRlbXBEb3VibGUpID49IDEgPyB0ZW1wRG91YmxlID4gMCA/IChNYXRoLm1pbigrTWF0aC5mbG9vcih0ZW1wRG91YmxlIC8gNDI5NDk2NzI5NiksIDQyOTQ5NjcyOTUpIHwgMCkgPj4+IDAgOiB+fitNYXRoLmNlaWwoKHRlbXBEb3VibGUgLSArKH5+dGVtcERvdWJsZSA+Pj4gMCkpIC8gNDI5NDk2NzI5NikgPj4+IDAgOiAwKSBdLCBcbiAgU0FGRV9IRUFQX1NUT1JFKG5ld09mZnNldCB8IDAsIHRlbXBJNjRbMF0gfCAwLCA0KSwgU0FGRV9IRUFQX1NUT1JFKG5ld09mZnNldCArIDQgfCAwLCB0ZW1wSTY0WzFdIHwgMCwgNCk7XG4gIGlmIChzdHJlYW0uZ2V0ZGVudHMgJiYgb2Zmc2V0ID09PSAwICYmIHdoZW5jZSA9PT0gMCkgc3RyZWFtLmdldGRlbnRzID0gbnVsbDtcbiAgcmV0dXJuIDA7XG4gfSBjYXRjaCAoZSkge1xuICBpZiAodHlwZW9mIEZTID09PSBcInVuZGVmaW5lZFwiIHx8ICEoZSBpbnN0YW5jZW9mIEZTLkVycm5vRXJyb3IpKSBhYm9ydChlKTtcbiAgcmV0dXJuIGUuZXJybm87XG4gfVxufVxuXG5mdW5jdGlvbiBfZmRfd3JpdGUoZmQsIGlvdiwgaW92Y250LCBwbnVtKSB7XG4gdHJ5IHtcbiAgdmFyIHN0cmVhbSA9IFNZU0NBTExTLmdldFN0cmVhbUZyb21GRChmZCk7XG4gIHZhciBudW0gPSBTWVNDQUxMUy5kb1dyaXRldihzdHJlYW0sIGlvdiwgaW92Y250KTtcbiAgU0FGRV9IRUFQX1NUT1JFKHBudW0gfCAwLCBudW0gfCAwLCA0KTtcbiAgcmV0dXJuIDA7XG4gfSBjYXRjaCAoZSkge1xuICBpZiAodHlwZW9mIEZTID09PSBcInVuZGVmaW5lZFwiIHx8ICEoZSBpbnN0YW5jZW9mIEZTLkVycm5vRXJyb3IpKSBhYm9ydChlKTtcbiAgcmV0dXJuIGUuZXJybm87XG4gfVxufVxuXG5mdW5jdGlvbiBfc2V0VGVtcFJldDAoJGkpIHtcbiBzZXRUZW1wUmV0MCgkaSB8IDApO1xufVxuXG5mdW5jdGlvbiBfX2lzTGVhcFllYXIoeWVhcikge1xuIHJldHVybiB5ZWFyICUgNCA9PT0gMCAmJiAoeWVhciAlIDEwMCAhPT0gMCB8fCB5ZWFyICUgNDAwID09PSAwKTtcbn1cblxuZnVuY3Rpb24gX19hcnJheVN1bShhcnJheSwgaW5kZXgpIHtcbiB2YXIgc3VtID0gMDtcbiBmb3IgKHZhciBpID0gMDsgaSA8PSBpbmRleDsgc3VtICs9IGFycmF5W2krK10pIHt9XG4gcmV0dXJuIHN1bTtcbn1cblxudmFyIF9fTU9OVEhfREFZU19MRUFQID0gWyAzMSwgMjksIDMxLCAzMCwgMzEsIDMwLCAzMSwgMzEsIDMwLCAzMSwgMzAsIDMxIF07XG5cbnZhciBfX01PTlRIX0RBWVNfUkVHVUxBUiA9IFsgMzEsIDI4LCAzMSwgMzAsIDMxLCAzMCwgMzEsIDMxLCAzMCwgMzEsIDMwLCAzMSBdO1xuXG5mdW5jdGlvbiBfX2FkZERheXMoZGF0ZSwgZGF5cykge1xuIHZhciBuZXdEYXRlID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xuIHdoaWxlIChkYXlzID4gMCkge1xuICB2YXIgbGVhcCA9IF9faXNMZWFwWWVhcihuZXdEYXRlLmdldEZ1bGxZZWFyKCkpO1xuICB2YXIgY3VycmVudE1vbnRoID0gbmV3RGF0ZS5nZXRNb250aCgpO1xuICB2YXIgZGF5c0luQ3VycmVudE1vbnRoID0gKGxlYXAgPyBfX01PTlRIX0RBWVNfTEVBUCA6IF9fTU9OVEhfREFZU19SRUdVTEFSKVtjdXJyZW50TW9udGhdO1xuICBpZiAoZGF5cyA+IGRheXNJbkN1cnJlbnRNb250aCAtIG5ld0RhdGUuZ2V0RGF0ZSgpKSB7XG4gICBkYXlzIC09IGRheXNJbkN1cnJlbnRNb250aCAtIG5ld0RhdGUuZ2V0RGF0ZSgpICsgMTtcbiAgIG5ld0RhdGUuc2V0RGF0ZSgxKTtcbiAgIGlmIChjdXJyZW50TW9udGggPCAxMSkge1xuICAgIG5ld0RhdGUuc2V0TW9udGgoY3VycmVudE1vbnRoICsgMSk7XG4gICB9IGVsc2Uge1xuICAgIG5ld0RhdGUuc2V0TW9udGgoMCk7XG4gICAgbmV3RGF0ZS5zZXRGdWxsWWVhcihuZXdEYXRlLmdldEZ1bGxZZWFyKCkgKyAxKTtcbiAgIH1cbiAgfSBlbHNlIHtcbiAgIG5ld0RhdGUuc2V0RGF0ZShuZXdEYXRlLmdldERhdGUoKSArIGRheXMpO1xuICAgcmV0dXJuIG5ld0RhdGU7XG4gIH1cbiB9XG4gcmV0dXJuIG5ld0RhdGU7XG59XG5cbmZ1bmN0aW9uIF9zdHJmdGltZShzLCBtYXhzaXplLCBmb3JtYXQsIHRtKSB7XG4gdmFyIHRtX3pvbmUgPSBTQUZFX0hFQVBfTE9BRCh0bSArIDQwIHwgMCwgNCwgMCkgfCAwO1xuIHZhciBkYXRlID0ge1xuICB0bV9zZWM6IFNBRkVfSEVBUF9MT0FEKHRtIHwgMCwgNCwgMCkgfCAwLFxuICB0bV9taW46IFNBRkVfSEVBUF9MT0FEKHRtICsgNCB8IDAsIDQsIDApIHwgMCxcbiAgdG1faG91cjogU0FGRV9IRUFQX0xPQUQodG0gKyA4IHwgMCwgNCwgMCkgfCAwLFxuICB0bV9tZGF5OiBTQUZFX0hFQVBfTE9BRCh0bSArIDEyIHwgMCwgNCwgMCkgfCAwLFxuICB0bV9tb246IFNBRkVfSEVBUF9MT0FEKHRtICsgMTYgfCAwLCA0LCAwKSB8IDAsXG4gIHRtX3llYXI6IFNBRkVfSEVBUF9MT0FEKHRtICsgMjAgfCAwLCA0LCAwKSB8IDAsXG4gIHRtX3dkYXk6IFNBRkVfSEVBUF9MT0FEKHRtICsgMjQgfCAwLCA0LCAwKSB8IDAsXG4gIHRtX3lkYXk6IFNBRkVfSEVBUF9MT0FEKHRtICsgMjggfCAwLCA0LCAwKSB8IDAsXG4gIHRtX2lzZHN0OiBTQUZFX0hFQVBfTE9BRCh0bSArIDMyIHwgMCwgNCwgMCkgfCAwLFxuICB0bV9nbXRvZmY6IFNBRkVfSEVBUF9MT0FEKHRtICsgMzYgfCAwLCA0LCAwKSB8IDAsXG4gIHRtX3pvbmU6IHRtX3pvbmUgPyBVVEY4VG9TdHJpbmcodG1fem9uZSkgOiBcIlwiXG4gfTtcbiB2YXIgcGF0dGVybiA9IFVURjhUb1N0cmluZyhmb3JtYXQpO1xuIHZhciBFWFBBTlNJT05fUlVMRVNfMSA9IHtcbiAgXCIlY1wiOiBcIiVhICViICVkICVIOiVNOiVTICVZXCIsXG4gIFwiJURcIjogXCIlbS8lZC8leVwiLFxuICBcIiVGXCI6IFwiJVktJW0tJWRcIixcbiAgXCIlaFwiOiBcIiViXCIsXG4gIFwiJXJcIjogXCIlSTolTTolUyAlcFwiLFxuICBcIiVSXCI6IFwiJUg6JU1cIixcbiAgXCIlVFwiOiBcIiVIOiVNOiVTXCIsXG4gIFwiJXhcIjogXCIlbS8lZC8leVwiLFxuICBcIiVYXCI6IFwiJUg6JU06JVNcIixcbiAgXCIlRWNcIjogXCIlY1wiLFxuICBcIiVFQ1wiOiBcIiVDXCIsXG4gIFwiJUV4XCI6IFwiJW0vJWQvJXlcIixcbiAgXCIlRVhcIjogXCIlSDolTTolU1wiLFxuICBcIiVFeVwiOiBcIiV5XCIsXG4gIFwiJUVZXCI6IFwiJVlcIixcbiAgXCIlT2RcIjogXCIlZFwiLFxuICBcIiVPZVwiOiBcIiVlXCIsXG4gIFwiJU9IXCI6IFwiJUhcIixcbiAgXCIlT0lcIjogXCIlSVwiLFxuICBcIiVPbVwiOiBcIiVtXCIsXG4gIFwiJU9NXCI6IFwiJU1cIixcbiAgXCIlT1NcIjogXCIlU1wiLFxuICBcIiVPdVwiOiBcIiV1XCIsXG4gIFwiJU9VXCI6IFwiJVVcIixcbiAgXCIlT1ZcIjogXCIlVlwiLFxuICBcIiVPd1wiOiBcIiV3XCIsXG4gIFwiJU9XXCI6IFwiJVdcIixcbiAgXCIlT3lcIjogXCIleVwiXG4gfTtcbiBmb3IgKHZhciBydWxlIGluIEVYUEFOU0lPTl9SVUxFU18xKSB7XG4gIHBhdHRlcm4gPSBwYXR0ZXJuLnJlcGxhY2UobmV3IFJlZ0V4cChydWxlLCBcImdcIiksIEVYUEFOU0lPTl9SVUxFU18xW3J1bGVdKTtcbiB9XG4gdmFyIFdFRUtEQVlTID0gWyBcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCIgXTtcbiB2YXIgTU9OVEhTID0gWyBcIkphbnVhcnlcIiwgXCJGZWJydWFyeVwiLCBcIk1hcmNoXCIsIFwiQXByaWxcIiwgXCJNYXlcIiwgXCJKdW5lXCIsIFwiSnVseVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9jdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCIgXTtcbiBmdW5jdGlvbiBsZWFkaW5nU29tZXRoaW5nKHZhbHVlLCBkaWdpdHMsIGNoYXJhY3Rlcikge1xuICB2YXIgc3RyID0gdHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiID8gdmFsdWUudG9TdHJpbmcoKSA6IHZhbHVlIHx8IFwiXCI7XG4gIHdoaWxlIChzdHIubGVuZ3RoIDwgZGlnaXRzKSB7XG4gICBzdHIgPSBjaGFyYWN0ZXJbMF0gKyBzdHI7XG4gIH1cbiAgcmV0dXJuIHN0cjtcbiB9XG4gZnVuY3Rpb24gbGVhZGluZ051bGxzKHZhbHVlLCBkaWdpdHMpIHtcbiAgcmV0dXJuIGxlYWRpbmdTb21ldGhpbmcodmFsdWUsIGRpZ2l0cywgXCIwXCIpO1xuIH1cbiBmdW5jdGlvbiBjb21wYXJlQnlEYXkoZGF0ZTEsIGRhdGUyKSB7XG4gIGZ1bmN0aW9uIHNnbih2YWx1ZSkge1xuICAgcmV0dXJuIHZhbHVlIDwgMCA/IC0xIDogdmFsdWUgPiAwID8gMSA6IDA7XG4gIH1cbiAgdmFyIGNvbXBhcmU7XG4gIGlmICgoY29tcGFyZSA9IHNnbihkYXRlMS5nZXRGdWxsWWVhcigpIC0gZGF0ZTIuZ2V0RnVsbFllYXIoKSkpID09PSAwKSB7XG4gICBpZiAoKGNvbXBhcmUgPSBzZ24oZGF0ZTEuZ2V0TW9udGgoKSAtIGRhdGUyLmdldE1vbnRoKCkpKSA9PT0gMCkge1xuICAgIGNvbXBhcmUgPSBzZ24oZGF0ZTEuZ2V0RGF0ZSgpIC0gZGF0ZTIuZ2V0RGF0ZSgpKTtcbiAgIH1cbiAgfVxuICByZXR1cm4gY29tcGFyZTtcbiB9XG4gZnVuY3Rpb24gZ2V0Rmlyc3RXZWVrU3RhcnREYXRlKGphbkZvdXJ0aCkge1xuICBzd2l0Y2ggKGphbkZvdXJ0aC5nZXREYXkoKSkge1xuICBjYXNlIDA6XG4gICByZXR1cm4gbmV3IERhdGUoamFuRm91cnRoLmdldEZ1bGxZZWFyKCkgLSAxLCAxMSwgMjkpO1xuXG4gIGNhc2UgMTpcbiAgIHJldHVybiBqYW5Gb3VydGg7XG5cbiAgY2FzZSAyOlxuICAgcmV0dXJuIG5ldyBEYXRlKGphbkZvdXJ0aC5nZXRGdWxsWWVhcigpLCAwLCAzKTtcblxuICBjYXNlIDM6XG4gICByZXR1cm4gbmV3IERhdGUoamFuRm91cnRoLmdldEZ1bGxZZWFyKCksIDAsIDIpO1xuXG4gIGNhc2UgNDpcbiAgIHJldHVybiBuZXcgRGF0ZShqYW5Gb3VydGguZ2V0RnVsbFllYXIoKSwgMCwgMSk7XG5cbiAgY2FzZSA1OlxuICAgcmV0dXJuIG5ldyBEYXRlKGphbkZvdXJ0aC5nZXRGdWxsWWVhcigpIC0gMSwgMTEsIDMxKTtcblxuICBjYXNlIDY6XG4gICByZXR1cm4gbmV3IERhdGUoamFuRm91cnRoLmdldEZ1bGxZZWFyKCkgLSAxLCAxMSwgMzApO1xuICB9XG4gfVxuIGZ1bmN0aW9uIGdldFdlZWtCYXNlZFllYXIoZGF0ZSkge1xuICB2YXIgdGhpc0RhdGUgPSBfX2FkZERheXMobmV3IERhdGUoZGF0ZS50bV95ZWFyICsgMTkwMCwgMCwgMSksIGRhdGUudG1feWRheSk7XG4gIHZhciBqYW5Gb3VydGhUaGlzWWVhciA9IG5ldyBEYXRlKHRoaXNEYXRlLmdldEZ1bGxZZWFyKCksIDAsIDQpO1xuICB2YXIgamFuRm91cnRoTmV4dFllYXIgPSBuZXcgRGF0ZSh0aGlzRGF0ZS5nZXRGdWxsWWVhcigpICsgMSwgMCwgNCk7XG4gIHZhciBmaXJzdFdlZWtTdGFydFRoaXNZZWFyID0gZ2V0Rmlyc3RXZWVrU3RhcnREYXRlKGphbkZvdXJ0aFRoaXNZZWFyKTtcbiAgdmFyIGZpcnN0V2Vla1N0YXJ0TmV4dFllYXIgPSBnZXRGaXJzdFdlZWtTdGFydERhdGUoamFuRm91cnRoTmV4dFllYXIpO1xuICBpZiAoY29tcGFyZUJ5RGF5KGZpcnN0V2Vla1N0YXJ0VGhpc1llYXIsIHRoaXNEYXRlKSA8PSAwKSB7XG4gICBpZiAoY29tcGFyZUJ5RGF5KGZpcnN0V2Vla1N0YXJ0TmV4dFllYXIsIHRoaXNEYXRlKSA8PSAwKSB7XG4gICAgcmV0dXJuIHRoaXNEYXRlLmdldEZ1bGxZZWFyKCkgKyAxO1xuICAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpc0RhdGUuZ2V0RnVsbFllYXIoKTtcbiAgIH1cbiAgfSBlbHNlIHtcbiAgIHJldHVybiB0aGlzRGF0ZS5nZXRGdWxsWWVhcigpIC0gMTtcbiAgfVxuIH1cbiB2YXIgRVhQQU5TSU9OX1JVTEVTXzIgPSB7XG4gIFwiJWFcIjogZnVuY3Rpb24oZGF0ZSkge1xuICAgcmV0dXJuIFdFRUtEQVlTW2RhdGUudG1fd2RheV0uc3Vic3RyaW5nKDAsIDMpO1xuICB9LFxuICBcIiVBXCI6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgIHJldHVybiBXRUVLREFZU1tkYXRlLnRtX3dkYXldO1xuICB9LFxuICBcIiViXCI6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgIHJldHVybiBNT05USFNbZGF0ZS50bV9tb25dLnN1YnN0cmluZygwLCAzKTtcbiAgfSxcbiAgXCIlQlwiOiBmdW5jdGlvbihkYXRlKSB7XG4gICByZXR1cm4gTU9OVEhTW2RhdGUudG1fbW9uXTtcbiAgfSxcbiAgXCIlQ1wiOiBmdW5jdGlvbihkYXRlKSB7XG4gICB2YXIgeWVhciA9IGRhdGUudG1feWVhciArIDE5MDA7XG4gICByZXR1cm4gbGVhZGluZ051bGxzKHllYXIgLyAxMDAgfCAwLCAyKTtcbiAgfSxcbiAgXCIlZFwiOiBmdW5jdGlvbihkYXRlKSB7XG4gICByZXR1cm4gbGVhZGluZ051bGxzKGRhdGUudG1fbWRheSwgMik7XG4gIH0sXG4gIFwiJWVcIjogZnVuY3Rpb24oZGF0ZSkge1xuICAgcmV0dXJuIGxlYWRpbmdTb21ldGhpbmcoZGF0ZS50bV9tZGF5LCAyLCBcIiBcIik7XG4gIH0sXG4gIFwiJWdcIjogZnVuY3Rpb24oZGF0ZSkge1xuICAgcmV0dXJuIGdldFdlZWtCYXNlZFllYXIoZGF0ZSkudG9TdHJpbmcoKS5zdWJzdHJpbmcoMik7XG4gIH0sXG4gIFwiJUdcIjogZnVuY3Rpb24oZGF0ZSkge1xuICAgcmV0dXJuIGdldFdlZWtCYXNlZFllYXIoZGF0ZSk7XG4gIH0sXG4gIFwiJUhcIjogZnVuY3Rpb24oZGF0ZSkge1xuICAgcmV0dXJuIGxlYWRpbmdOdWxscyhkYXRlLnRtX2hvdXIsIDIpO1xuICB9LFxuICBcIiVJXCI6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgIHZhciB0d2VsdmVIb3VyID0gZGF0ZS50bV9ob3VyO1xuICAgaWYgKHR3ZWx2ZUhvdXIgPT0gMCkgdHdlbHZlSG91ciA9IDEyOyBlbHNlIGlmICh0d2VsdmVIb3VyID4gMTIpIHR3ZWx2ZUhvdXIgLT0gMTI7XG4gICByZXR1cm4gbGVhZGluZ051bGxzKHR3ZWx2ZUhvdXIsIDIpO1xuICB9LFxuICBcIiVqXCI6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgIHJldHVybiBsZWFkaW5nTnVsbHMoZGF0ZS50bV9tZGF5ICsgX19hcnJheVN1bShfX2lzTGVhcFllYXIoZGF0ZS50bV95ZWFyICsgMTkwMCkgPyBfX01PTlRIX0RBWVNfTEVBUCA6IF9fTU9OVEhfREFZU19SRUdVTEFSLCBkYXRlLnRtX21vbiAtIDEpLCAzKTtcbiAgfSxcbiAgXCIlbVwiOiBmdW5jdGlvbihkYXRlKSB7XG4gICByZXR1cm4gbGVhZGluZ051bGxzKGRhdGUudG1fbW9uICsgMSwgMik7XG4gIH0sXG4gIFwiJU1cIjogZnVuY3Rpb24oZGF0ZSkge1xuICAgcmV0dXJuIGxlYWRpbmdOdWxscyhkYXRlLnRtX21pbiwgMik7XG4gIH0sXG4gIFwiJW5cIjogZnVuY3Rpb24oKSB7XG4gICByZXR1cm4gXCJcXG5cIjtcbiAgfSxcbiAgXCIlcFwiOiBmdW5jdGlvbihkYXRlKSB7XG4gICBpZiAoZGF0ZS50bV9ob3VyID49IDAgJiYgZGF0ZS50bV9ob3VyIDwgMTIpIHtcbiAgICByZXR1cm4gXCJBTVwiO1xuICAgfSBlbHNlIHtcbiAgICByZXR1cm4gXCJQTVwiO1xuICAgfVxuICB9LFxuICBcIiVTXCI6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgIHJldHVybiBsZWFkaW5nTnVsbHMoZGF0ZS50bV9zZWMsIDIpO1xuICB9LFxuICBcIiV0XCI6IGZ1bmN0aW9uKCkge1xuICAgcmV0dXJuIFwiXFx0XCI7XG4gIH0sXG4gIFwiJXVcIjogZnVuY3Rpb24oZGF0ZSkge1xuICAgcmV0dXJuIGRhdGUudG1fd2RheSB8fCA3O1xuICB9LFxuICBcIiVVXCI6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgIHZhciBqYW5GaXJzdCA9IG5ldyBEYXRlKGRhdGUudG1feWVhciArIDE5MDAsIDAsIDEpO1xuICAgdmFyIGZpcnN0U3VuZGF5ID0gamFuRmlyc3QuZ2V0RGF5KCkgPT09IDAgPyBqYW5GaXJzdCA6IF9fYWRkRGF5cyhqYW5GaXJzdCwgNyAtIGphbkZpcnN0LmdldERheSgpKTtcbiAgIHZhciBlbmREYXRlID0gbmV3IERhdGUoZGF0ZS50bV95ZWFyICsgMTkwMCwgZGF0ZS50bV9tb24sIGRhdGUudG1fbWRheSk7XG4gICBpZiAoY29tcGFyZUJ5RGF5KGZpcnN0U3VuZGF5LCBlbmREYXRlKSA8IDApIHtcbiAgICB2YXIgZmVicnVhcnlGaXJzdFVudGlsRW5kTW9udGggPSBfX2FycmF5U3VtKF9faXNMZWFwWWVhcihlbmREYXRlLmdldEZ1bGxZZWFyKCkpID8gX19NT05USF9EQVlTX0xFQVAgOiBfX01PTlRIX0RBWVNfUkVHVUxBUiwgZW5kRGF0ZS5nZXRNb250aCgpIC0gMSkgLSAzMTtcbiAgICB2YXIgZmlyc3RTdW5kYXlVbnRpbEVuZEphbnVhcnkgPSAzMSAtIGZpcnN0U3VuZGF5LmdldERhdGUoKTtcbiAgICB2YXIgZGF5cyA9IGZpcnN0U3VuZGF5VW50aWxFbmRKYW51YXJ5ICsgZmVicnVhcnlGaXJzdFVudGlsRW5kTW9udGggKyBlbmREYXRlLmdldERhdGUoKTtcbiAgICByZXR1cm4gbGVhZGluZ051bGxzKE1hdGguY2VpbChkYXlzIC8gNyksIDIpO1xuICAgfVxuICAgcmV0dXJuIGNvbXBhcmVCeURheShmaXJzdFN1bmRheSwgamFuRmlyc3QpID09PSAwID8gXCIwMVwiIDogXCIwMFwiO1xuICB9LFxuICBcIiVWXCI6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgIHZhciBqYW5Gb3VydGhUaGlzWWVhciA9IG5ldyBEYXRlKGRhdGUudG1feWVhciArIDE5MDAsIDAsIDQpO1xuICAgdmFyIGphbkZvdXJ0aE5leHRZZWFyID0gbmV3IERhdGUoZGF0ZS50bV95ZWFyICsgMTkwMSwgMCwgNCk7XG4gICB2YXIgZmlyc3RXZWVrU3RhcnRUaGlzWWVhciA9IGdldEZpcnN0V2Vla1N0YXJ0RGF0ZShqYW5Gb3VydGhUaGlzWWVhcik7XG4gICB2YXIgZmlyc3RXZWVrU3RhcnROZXh0WWVhciA9IGdldEZpcnN0V2Vla1N0YXJ0RGF0ZShqYW5Gb3VydGhOZXh0WWVhcik7XG4gICB2YXIgZW5kRGF0ZSA9IF9fYWRkRGF5cyhuZXcgRGF0ZShkYXRlLnRtX3llYXIgKyAxOTAwLCAwLCAxKSwgZGF0ZS50bV95ZGF5KTtcbiAgIGlmIChjb21wYXJlQnlEYXkoZW5kRGF0ZSwgZmlyc3RXZWVrU3RhcnRUaGlzWWVhcikgPCAwKSB7XG4gICAgcmV0dXJuIFwiNTNcIjtcbiAgIH1cbiAgIGlmIChjb21wYXJlQnlEYXkoZmlyc3RXZWVrU3RhcnROZXh0WWVhciwgZW5kRGF0ZSkgPD0gMCkge1xuICAgIHJldHVybiBcIjAxXCI7XG4gICB9XG4gICB2YXIgZGF5c0RpZmZlcmVuY2U7XG4gICBpZiAoZmlyc3RXZWVrU3RhcnRUaGlzWWVhci5nZXRGdWxsWWVhcigpIDwgZGF0ZS50bV95ZWFyICsgMTkwMCkge1xuICAgIGRheXNEaWZmZXJlbmNlID0gZGF0ZS50bV95ZGF5ICsgMzIgLSBmaXJzdFdlZWtTdGFydFRoaXNZZWFyLmdldERhdGUoKTtcbiAgIH0gZWxzZSB7XG4gICAgZGF5c0RpZmZlcmVuY2UgPSBkYXRlLnRtX3lkYXkgKyAxIC0gZmlyc3RXZWVrU3RhcnRUaGlzWWVhci5nZXREYXRlKCk7XG4gICB9XG4gICByZXR1cm4gbGVhZGluZ051bGxzKE1hdGguY2VpbChkYXlzRGlmZmVyZW5jZSAvIDcpLCAyKTtcbiAgfSxcbiAgXCIld1wiOiBmdW5jdGlvbihkYXRlKSB7XG4gICByZXR1cm4gZGF0ZS50bV93ZGF5O1xuICB9LFxuICBcIiVXXCI6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgIHZhciBqYW5GaXJzdCA9IG5ldyBEYXRlKGRhdGUudG1feWVhciwgMCwgMSk7XG4gICB2YXIgZmlyc3RNb25kYXkgPSBqYW5GaXJzdC5nZXREYXkoKSA9PT0gMSA/IGphbkZpcnN0IDogX19hZGREYXlzKGphbkZpcnN0LCBqYW5GaXJzdC5nZXREYXkoKSA9PT0gMCA/IDEgOiA3IC0gamFuRmlyc3QuZ2V0RGF5KCkgKyAxKTtcbiAgIHZhciBlbmREYXRlID0gbmV3IERhdGUoZGF0ZS50bV95ZWFyICsgMTkwMCwgZGF0ZS50bV9tb24sIGRhdGUudG1fbWRheSk7XG4gICBpZiAoY29tcGFyZUJ5RGF5KGZpcnN0TW9uZGF5LCBlbmREYXRlKSA8IDApIHtcbiAgICB2YXIgZmVicnVhcnlGaXJzdFVudGlsRW5kTW9udGggPSBfX2FycmF5U3VtKF9faXNMZWFwWWVhcihlbmREYXRlLmdldEZ1bGxZZWFyKCkpID8gX19NT05USF9EQVlTX0xFQVAgOiBfX01PTlRIX0RBWVNfUkVHVUxBUiwgZW5kRGF0ZS5nZXRNb250aCgpIC0gMSkgLSAzMTtcbiAgICB2YXIgZmlyc3RNb25kYXlVbnRpbEVuZEphbnVhcnkgPSAzMSAtIGZpcnN0TW9uZGF5LmdldERhdGUoKTtcbiAgICB2YXIgZGF5cyA9IGZpcnN0TW9uZGF5VW50aWxFbmRKYW51YXJ5ICsgZmVicnVhcnlGaXJzdFVudGlsRW5kTW9udGggKyBlbmREYXRlLmdldERhdGUoKTtcbiAgICByZXR1cm4gbGVhZGluZ051bGxzKE1hdGguY2VpbChkYXlzIC8gNyksIDIpO1xuICAgfVxuICAgcmV0dXJuIGNvbXBhcmVCeURheShmaXJzdE1vbmRheSwgamFuRmlyc3QpID09PSAwID8gXCIwMVwiIDogXCIwMFwiO1xuICB9LFxuICBcIiV5XCI6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgIHJldHVybiAoZGF0ZS50bV95ZWFyICsgMTkwMCkudG9TdHJpbmcoKS5zdWJzdHJpbmcoMik7XG4gIH0sXG4gIFwiJVlcIjogZnVuY3Rpb24oZGF0ZSkge1xuICAgcmV0dXJuIGRhdGUudG1feWVhciArIDE5MDA7XG4gIH0sXG4gIFwiJXpcIjogZnVuY3Rpb24oZGF0ZSkge1xuICAgdmFyIG9mZiA9IGRhdGUudG1fZ210b2ZmO1xuICAgdmFyIGFoZWFkID0gb2ZmID49IDA7XG4gICBvZmYgPSBNYXRoLmFicyhvZmYpIC8gNjA7XG4gICBvZmYgPSBvZmYgLyA2MCAqIDEwMCArIG9mZiAlIDYwO1xuICAgcmV0dXJuIChhaGVhZCA/IFwiK1wiIDogXCItXCIpICsgU3RyaW5nKFwiMDAwMFwiICsgb2ZmKS5zbGljZSgtNCk7XG4gIH0sXG4gIFwiJVpcIjogZnVuY3Rpb24oZGF0ZSkge1xuICAgcmV0dXJuIGRhdGUudG1fem9uZTtcbiAgfSxcbiAgXCIlJVwiOiBmdW5jdGlvbigpIHtcbiAgIHJldHVybiBcIiVcIjtcbiAgfVxuIH07XG4gZm9yICh2YXIgcnVsZSBpbiBFWFBBTlNJT05fUlVMRVNfMikge1xuICBpZiAocGF0dGVybi5pbmRleE9mKHJ1bGUpID49IDApIHtcbiAgIHBhdHRlcm4gPSBwYXR0ZXJuLnJlcGxhY2UobmV3IFJlZ0V4cChydWxlLCBcImdcIiksIEVYUEFOU0lPTl9SVUxFU18yW3J1bGVdKGRhdGUpKTtcbiAgfVxuIH1cbiB2YXIgYnl0ZXMgPSBpbnRBcnJheUZyb21TdHJpbmcocGF0dGVybiwgZmFsc2UpO1xuIGlmIChieXRlcy5sZW5ndGggPiBtYXhzaXplKSB7XG4gIHJldHVybiAwO1xuIH1cbiB3cml0ZUFycmF5VG9NZW1vcnkoYnl0ZXMsIHMpO1xuIHJldHVybiBieXRlcy5sZW5ndGggLSAxO1xufVxuXG5mdW5jdGlvbiBfc3RyZnRpbWVfbChzLCBtYXhzaXplLCBmb3JtYXQsIHRtKSB7XG4gcmV0dXJuIF9zdHJmdGltZShzLCBtYXhzaXplLCBmb3JtYXQsIHRtKTtcbn1cblxudmFyIEZTTm9kZSA9IGZ1bmN0aW9uKHBhcmVudCwgbmFtZSwgbW9kZSwgcmRldikge1xuIGlmICghcGFyZW50KSB7XG4gIHBhcmVudCA9IHRoaXM7XG4gfVxuIHRoaXMucGFyZW50ID0gcGFyZW50O1xuIHRoaXMubW91bnQgPSBwYXJlbnQubW91bnQ7XG4gdGhpcy5tb3VudGVkID0gbnVsbDtcbiB0aGlzLmlkID0gRlMubmV4dElub2RlKys7XG4gdGhpcy5uYW1lID0gbmFtZTtcbiB0aGlzLm1vZGUgPSBtb2RlO1xuIHRoaXMubm9kZV9vcHMgPSB7fTtcbiB0aGlzLnN0cmVhbV9vcHMgPSB7fTtcbiB0aGlzLnJkZXYgPSByZGV2O1xufTtcblxudmFyIHJlYWRNb2RlID0gMjkyIHwgNzM7XG5cbnZhciB3cml0ZU1vZGUgPSAxNDY7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEZTTm9kZS5wcm90b3R5cGUsIHtcbiByZWFkOiB7XG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICByZXR1cm4gKHRoaXMubW9kZSAmIHJlYWRNb2RlKSA9PT0gcmVhZE1vZGU7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24odmFsKSB7XG4gICB2YWwgPyB0aGlzLm1vZGUgfD0gcmVhZE1vZGUgOiB0aGlzLm1vZGUgJj0gfnJlYWRNb2RlO1xuICB9XG4gfSxcbiB3cml0ZToge1xuICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgcmV0dXJuICh0aGlzLm1vZGUgJiB3cml0ZU1vZGUpID09PSB3cml0ZU1vZGU7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24odmFsKSB7XG4gICB2YWwgPyB0aGlzLm1vZGUgfD0gd3JpdGVNb2RlIDogdGhpcy5tb2RlICY9IH53cml0ZU1vZGU7XG4gIH1cbiB9LFxuIGlzRm9sZGVyOiB7XG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICByZXR1cm4gRlMuaXNEaXIodGhpcy5tb2RlKTtcbiAgfVxuIH0sXG4gaXNEZXZpY2U6IHtcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgIHJldHVybiBGUy5pc0NocmRldih0aGlzLm1vZGUpO1xuICB9XG4gfVxufSk7XG5cbkZTLkZTTm9kZSA9IEZTTm9kZTtcblxuRlMuc3RhdGljSW5pdCgpO1xuXG52YXIgQVNTRVJUSU9OUyA9IHRydWU7XG5cbmZ1bmN0aW9uIGludEFycmF5RnJvbVN0cmluZyhzdHJpbmd5LCBkb250QWRkTnVsbCwgbGVuZ3RoKSB7XG4gdmFyIGxlbiA9IGxlbmd0aCA+IDAgPyBsZW5ndGggOiBsZW5ndGhCeXRlc1VURjgoc3RyaW5neSkgKyAxO1xuIHZhciB1OGFycmF5ID0gbmV3IEFycmF5KGxlbik7XG4gdmFyIG51bUJ5dGVzV3JpdHRlbiA9IHN0cmluZ1RvVVRGOEFycmF5KHN0cmluZ3ksIHU4YXJyYXksIDAsIHU4YXJyYXkubGVuZ3RoKTtcbiBpZiAoZG9udEFkZE51bGwpIHU4YXJyYXkubGVuZ3RoID0gbnVtQnl0ZXNXcml0dGVuO1xuIHJldHVybiB1OGFycmF5O1xufVxuXG5mdW5jdGlvbiBpbnRBcnJheVRvU3RyaW5nKGFycmF5KSB7XG4gdmFyIHJldCA9IFtdO1xuIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgdmFyIGNociA9IGFycmF5W2ldO1xuICBpZiAoY2hyID4gMjU1KSB7XG4gICBpZiAoQVNTRVJUSU9OUykge1xuICAgIGFzc2VydChmYWxzZSwgXCJDaGFyYWN0ZXIgY29kZSBcIiArIGNociArIFwiIChcIiArIFN0cmluZy5mcm9tQ2hhckNvZGUoY2hyKSArIFwiKSAgYXQgb2Zmc2V0IFwiICsgaSArIFwiIG5vdCBpbiAweDAwLTB4RkYuXCIpO1xuICAgfVxuICAgY2hyICY9IDI1NTtcbiAgfVxuICByZXQucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKGNocikpO1xuIH1cbiByZXR1cm4gcmV0LmpvaW4oXCJcIik7XG59XG5cbl9fQVRJTklUX18ucHVzaCh7XG4gZnVuYzogZnVuY3Rpb24oKSB7XG4gIF9fX3dhc21fY2FsbF9jdG9ycygpO1xuIH1cbn0pO1xuXG52YXIgYXNtTGlicmFyeUFyZyA9IHtcbiBcIl9fYXNzZXJ0X2ZhaWxcIjogX19fYXNzZXJ0X2ZhaWwsXG4gXCJfX2N4YV9hbGxvY2F0ZV9leGNlcHRpb25cIjogX19fY3hhX2FsbG9jYXRlX2V4Y2VwdGlvbixcbiBcIl9fY3hhX2F0ZXhpdFwiOiBfX19jeGFfYXRleGl0LFxuIFwiX19jeGFfdGhyb3dcIjogX19fY3hhX3Rocm93LFxuIFwiYWJvcnRcIjogX2Fib3J0LFxuIFwiYWxpZ25mYXVsdFwiOiBhbGlnbmZhdWx0LFxuIFwiZW1zY3JpcHRlbl9tZW1jcHlfYmlnXCI6IF9lbXNjcmlwdGVuX21lbWNweV9iaWcsXG4gXCJlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwXCI6IF9lbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwLFxuIFwiZW52aXJvbl9nZXRcIjogX2Vudmlyb25fZ2V0LFxuIFwiZW52aXJvbl9zaXplc19nZXRcIjogX2Vudmlyb25fc2l6ZXNfZ2V0LFxuIFwiZmRfY2xvc2VcIjogX2ZkX2Nsb3NlLFxuIFwiZmRfcmVhZFwiOiBfZmRfcmVhZCxcbiBcImZkX3NlZWtcIjogX2ZkX3NlZWssXG4gXCJmZF93cml0ZVwiOiBfZmRfd3JpdGUsXG4gXCJzZWdmYXVsdFwiOiBzZWdmYXVsdCxcbiBcInNldFRlbXBSZXQwXCI6IF9zZXRUZW1wUmV0MCxcbiBcInN0cmZ0aW1lX2xcIjogX3N0cmZ0aW1lX2xcbn07XG5cbnZhciBhc20gPSBjcmVhdGVXYXNtKCk7XG5cbnZhciBfX193YXNtX2NhbGxfY3RvcnMgPSBNb2R1bGVbXCJfX193YXNtX2NhbGxfY3RvcnNcIl0gPSBjcmVhdGVFeHBvcnRXcmFwcGVyKFwiX193YXNtX2NhbGxfY3RvcnNcIik7XG5cbnZhciBfVGlja0dhbWUgPSBNb2R1bGVbXCJfVGlja0dhbWVcIl0gPSBjcmVhdGVFeHBvcnRXcmFwcGVyKFwiVGlja0dhbWVcIik7XG5cbnZhciBfSXNPYmplY3RBbGl2ZSA9IE1vZHVsZVtcIl9Jc09iamVjdEFsaXZlXCJdID0gY3JlYXRlRXhwb3J0V3JhcHBlcihcIklzT2JqZWN0QWxpdmVcIik7XG5cbnZhciBfR2V0T2JqZWN0U2VyaWFsaXplZCA9IE1vZHVsZVtcIl9HZXRPYmplY3RTZXJpYWxpemVkXCJdID0gY3JlYXRlRXhwb3J0V3JhcHBlcihcIkdldE9iamVjdFNlcmlhbGl6ZWRcIik7XG5cbnZhciBfR2V0T2JqZWN0WCA9IE1vZHVsZVtcIl9HZXRPYmplY3RYXCJdID0gY3JlYXRlRXhwb3J0V3JhcHBlcihcIkdldE9iamVjdFhcIik7XG5cbnZhciBfR2V0T2JqZWN0WSA9IE1vZHVsZVtcIl9HZXRPYmplY3RZXCJdID0gY3JlYXRlRXhwb3J0V3JhcHBlcihcIkdldE9iamVjdFlcIik7XG5cbnZhciBfSGFuZGxlUmVwbGljYXRlID0gTW9kdWxlW1wiX0hhbmRsZVJlcGxpY2F0ZVwiXSA9IGNyZWF0ZUV4cG9ydFdyYXBwZXIoXCJIYW5kbGVSZXBsaWNhdGVcIik7XG5cbnZhciBfSGFuZGxlTG9jYWxJbnB1dCA9IE1vZHVsZVtcIl9IYW5kbGVMb2NhbElucHV0XCJdID0gY3JlYXRlRXhwb3J0V3JhcHBlcihcIkhhbmRsZUxvY2FsSW5wdXRcIik7XG5cbnZhciBfX19lcnJub19sb2NhdGlvbiA9IE1vZHVsZVtcIl9fX2Vycm5vX2xvY2F0aW9uXCJdID0gY3JlYXRlRXhwb3J0V3JhcHBlcihcIl9fZXJybm9fbG9jYXRpb25cIik7XG5cbnZhciBfZmZsdXNoID0gTW9kdWxlW1wiX2ZmbHVzaFwiXSA9IGNyZWF0ZUV4cG9ydFdyYXBwZXIoXCJmZmx1c2hcIik7XG5cbnZhciBzdGFja1NhdmUgPSBNb2R1bGVbXCJzdGFja1NhdmVcIl0gPSBjcmVhdGVFeHBvcnRXcmFwcGVyKFwic3RhY2tTYXZlXCIpO1xuXG52YXIgc3RhY2tSZXN0b3JlID0gTW9kdWxlW1wic3RhY2tSZXN0b3JlXCJdID0gY3JlYXRlRXhwb3J0V3JhcHBlcihcInN0YWNrUmVzdG9yZVwiKTtcblxudmFyIHN0YWNrQWxsb2MgPSBNb2R1bGVbXCJzdGFja0FsbG9jXCJdID0gY3JlYXRlRXhwb3J0V3JhcHBlcihcInN0YWNrQWxsb2NcIik7XG5cbnZhciBfZW1zY3JpcHRlbl9zdGFja19pbml0ID0gTW9kdWxlW1wiX2Vtc2NyaXB0ZW5fc3RhY2tfaW5pdFwiXSA9IGZ1bmN0aW9uKCkge1xuIHJldHVybiAoX2Vtc2NyaXB0ZW5fc3RhY2tfaW5pdCA9IE1vZHVsZVtcIl9lbXNjcmlwdGVuX3N0YWNrX2luaXRcIl0gPSBNb2R1bGVbXCJhc21cIl1bXCJlbXNjcmlwdGVuX3N0YWNrX2luaXRcIl0pLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG59O1xuXG52YXIgX2Vtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUgPSBNb2R1bGVbXCJfZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZVwiXSA9IGZ1bmN0aW9uKCkge1xuIHJldHVybiAoX2Vtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUgPSBNb2R1bGVbXCJfZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZVwiXSA9IE1vZHVsZVtcImFzbVwiXVtcImVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWVcIl0pLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG59O1xuXG52YXIgX2Vtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UgPSBNb2R1bGVbXCJfZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZVwiXSA9IGZ1bmN0aW9uKCkge1xuIHJldHVybiAoX2Vtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UgPSBNb2R1bGVbXCJfZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZVwiXSA9IE1vZHVsZVtcImFzbVwiXVtcImVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2VcIl0pLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG59O1xuXG52YXIgX2Vtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZCA9IE1vZHVsZVtcIl9lbXNjcmlwdGVuX3N0YWNrX2dldF9lbmRcIl0gPSBmdW5jdGlvbigpIHtcbiByZXR1cm4gKF9lbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQgPSBNb2R1bGVbXCJfZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kXCJdID0gTW9kdWxlW1wiYXNtXCJdW1wiZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kXCJdKS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xufTtcblxudmFyIF9zZXRUaHJldyA9IE1vZHVsZVtcIl9zZXRUaHJld1wiXSA9IGNyZWF0ZUV4cG9ydFdyYXBwZXIoXCJzZXRUaHJld1wiKTtcblxudmFyIF9mcmVlID0gTW9kdWxlW1wiX2ZyZWVcIl0gPSBjcmVhdGVFeHBvcnRXcmFwcGVyKFwiZnJlZVwiKTtcblxudmFyIF9tYWxsb2MgPSBNb2R1bGVbXCJfbWFsbG9jXCJdID0gY3JlYXRlRXhwb3J0V3JhcHBlcihcIm1hbGxvY1wiKTtcblxudmFyIF9zYnJrID0gTW9kdWxlW1wiX3NicmtcIl0gPSBjcmVhdGVFeHBvcnRXcmFwcGVyKFwic2Jya1wiKTtcblxudmFyIF9lbXNjcmlwdGVuX2dldF9zYnJrX3B0ciA9IE1vZHVsZVtcIl9lbXNjcmlwdGVuX2dldF9zYnJrX3B0clwiXSA9IGNyZWF0ZUV4cG9ydFdyYXBwZXIoXCJlbXNjcmlwdGVuX2dldF9zYnJrX3B0clwiKTtcblxudmFyIGR5bkNhbGxfdmlqID0gTW9kdWxlW1wiZHluQ2FsbF92aWpcIl0gPSBjcmVhdGVFeHBvcnRXcmFwcGVyKFwiZHluQ2FsbF92aWpcIik7XG5cbnZhciBkeW5DYWxsX3ZpaWppaSA9IE1vZHVsZVtcImR5bkNhbGxfdmlpamlpXCJdID0gY3JlYXRlRXhwb3J0V3JhcHBlcihcImR5bkNhbGxfdmlpamlpXCIpO1xuXG52YXIgZHluQ2FsbF9qaWppID0gTW9kdWxlW1wiZHluQ2FsbF9qaWppXCJdID0gY3JlYXRlRXhwb3J0V3JhcHBlcihcImR5bkNhbGxfamlqaVwiKTtcblxudmFyIGR5bkNhbGxfaWlpaWlqID0gTW9kdWxlW1wiZHluQ2FsbF9paWlpaWpcIl0gPSBjcmVhdGVFeHBvcnRXcmFwcGVyKFwiZHluQ2FsbF9paWlpaWpcIik7XG5cbnZhciBkeW5DYWxsX2lpaWlpamogPSBNb2R1bGVbXCJkeW5DYWxsX2lpaWlpampcIl0gPSBjcmVhdGVFeHBvcnRXcmFwcGVyKFwiZHluQ2FsbF9paWlpaWpqXCIpO1xuXG52YXIgZHluQ2FsbF9paWlpaWlqaiA9IE1vZHVsZVtcImR5bkNhbGxfaWlpaWlpampcIl0gPSBjcmVhdGVFeHBvcnRXcmFwcGVyKFwiZHluQ2FsbF9paWlpaWlqalwiKTtcblxudmFyIF9nYW1lID0gTW9kdWxlW1wiX2dhbWVcIl0gPSAzMDU4NDtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJpbnRBcnJheUZyb21TdHJpbmdcIikpIE1vZHVsZVtcImludEFycmF5RnJvbVN0cmluZ1wiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ2ludEFycmF5RnJvbVN0cmluZycgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpXCIpO1xufTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJpbnRBcnJheVRvU3RyaW5nXCIpKSBNb2R1bGVbXCJpbnRBcnJheVRvU3RyaW5nXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInaW50QXJyYXlUb1N0cmluZycgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpXCIpO1xufTtcblxuTW9kdWxlW1wiY2NhbGxcIl0gPSBjY2FsbDtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJjd3JhcFwiKSkgTW9kdWxlW1wiY3dyYXBcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidjd3JhcCcgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpXCIpO1xufTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJzZXRWYWx1ZVwiKSkgTW9kdWxlW1wic2V0VmFsdWVcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidzZXRWYWx1ZScgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpXCIpO1xufTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJnZXRWYWx1ZVwiKSkgTW9kdWxlW1wiZ2V0VmFsdWVcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidnZXRWYWx1ZScgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpXCIpO1xufTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJhbGxvY2F0ZVwiKSkgTW9kdWxlW1wiYWxsb2NhdGVcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidhbGxvY2F0ZScgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpXCIpO1xufTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJVVEY4QXJyYXlUb1N0cmluZ1wiKSkgTW9kdWxlW1wiVVRGOEFycmF5VG9TdHJpbmdcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidVVEY4QXJyYXlUb1N0cmluZycgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpXCIpO1xufTtcblxuTW9kdWxlW1wiVVRGOFRvU3RyaW5nXCJdID0gVVRGOFRvU3RyaW5nO1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInN0cmluZ1RvVVRGOEFycmF5XCIpKSBNb2R1bGVbXCJzdHJpbmdUb1VURjhBcnJheVwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3N0cmluZ1RvVVRGOEFycmF5JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5Nb2R1bGVbXCJzdHJpbmdUb1VURjhcIl0gPSBzdHJpbmdUb1VURjg7XG5cbk1vZHVsZVtcImxlbmd0aEJ5dGVzVVRGOFwiXSA9IGxlbmd0aEJ5dGVzVVRGODtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJzdGFja1RyYWNlXCIpKSBNb2R1bGVbXCJzdGFja1RyYWNlXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInc3RhY2tUcmFjZScgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpXCIpO1xufTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJhZGRPblByZVJ1blwiKSkgTW9kdWxlW1wiYWRkT25QcmVSdW5cIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidhZGRPblByZVJ1bicgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpXCIpO1xufTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJhZGRPbkluaXRcIikpIE1vZHVsZVtcImFkZE9uSW5pdFwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ2FkZE9uSW5pdCcgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpXCIpO1xufTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJhZGRPblByZU1haW5cIikpIE1vZHVsZVtcImFkZE9uUHJlTWFpblwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ2FkZE9uUHJlTWFpbicgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpXCIpO1xufTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJhZGRPbkV4aXRcIikpIE1vZHVsZVtcImFkZE9uRXhpdFwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ2FkZE9uRXhpdCcgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpXCIpO1xufTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJhZGRPblBvc3RSdW5cIikpIE1vZHVsZVtcImFkZE9uUG9zdFJ1blwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ2FkZE9uUG9zdFJ1bicgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpXCIpO1xufTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJ3cml0ZVN0cmluZ1RvTWVtb3J5XCIpKSBNb2R1bGVbXCJ3cml0ZVN0cmluZ1RvTWVtb3J5XCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInd3JpdGVTdHJpbmdUb01lbW9yeScgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpXCIpO1xufTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJ3cml0ZUFycmF5VG9NZW1vcnlcIikpIE1vZHVsZVtcIndyaXRlQXJyYXlUb01lbW9yeVwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3dyaXRlQXJyYXlUb01lbW9yeScgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpXCIpO1xufTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJ3cml0ZUFzY2lpVG9NZW1vcnlcIikpIE1vZHVsZVtcIndyaXRlQXNjaWlUb01lbW9yeVwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3dyaXRlQXNjaWlUb01lbW9yeScgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpXCIpO1xufTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJhZGRSdW5EZXBlbmRlbmN5XCIpKSBNb2R1bGVbXCJhZGRSdW5EZXBlbmRlbmN5XCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInYWRkUnVuRGVwZW5kZW5jeScgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpLiBBbHRlcm5hdGl2ZWx5LCBmb3JjaW5nIGZpbGVzeXN0ZW0gc3VwcG9ydCAoLXMgRk9SQ0VfRklMRVNZU1RFTT0xKSBjYW4gZXhwb3J0IHRoaXMgZm9yIHlvdVwiKTtcbn07XG5cbmlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihNb2R1bGUsIFwicmVtb3ZlUnVuRGVwZW5kZW5jeVwiKSkgTW9kdWxlW1wicmVtb3ZlUnVuRGVwZW5kZW5jeVwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3JlbW92ZVJ1bkRlcGVuZGVuY3knIHdhcyBub3QgZXhwb3J0ZWQuIGFkZCBpdCB0byBFWFRSQV9FWFBPUlRFRF9SVU5USU1FX01FVEhPRFMgKHNlZSB0aGUgRkFRKS4gQWx0ZXJuYXRpdmVseSwgZm9yY2luZyBmaWxlc3lzdGVtIHN1cHBvcnQgKC1zIEZPUkNFX0ZJTEVTWVNURU09MSkgY2FuIGV4cG9ydCB0aGlzIGZvciB5b3VcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkZTX2NyZWF0ZUZvbGRlclwiKSkgTW9kdWxlW1wiRlNfY3JlYXRlRm9sZGVyXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInRlNfY3JlYXRlRm9sZGVyJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkZTX2NyZWF0ZVBhdGhcIikpIE1vZHVsZVtcIkZTX2NyZWF0ZVBhdGhcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidGU19jcmVhdGVQYXRoJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSkuIEFsdGVybmF0aXZlbHksIGZvcmNpbmcgZmlsZXN5c3RlbSBzdXBwb3J0ICgtcyBGT1JDRV9GSUxFU1lTVEVNPTEpIGNhbiBleHBvcnQgdGhpcyBmb3IgeW91XCIpO1xufTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJGU19jcmVhdGVEYXRhRmlsZVwiKSkgTW9kdWxlW1wiRlNfY3JlYXRlRGF0YUZpbGVcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidGU19jcmVhdGVEYXRhRmlsZScgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpLiBBbHRlcm5hdGl2ZWx5LCBmb3JjaW5nIGZpbGVzeXN0ZW0gc3VwcG9ydCAoLXMgRk9SQ0VfRklMRVNZU1RFTT0xKSBjYW4gZXhwb3J0IHRoaXMgZm9yIHlvdVwiKTtcbn07XG5cbmlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihNb2R1bGUsIFwiRlNfY3JlYXRlUHJlbG9hZGVkRmlsZVwiKSkgTW9kdWxlW1wiRlNfY3JlYXRlUHJlbG9hZGVkRmlsZVwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ0ZTX2NyZWF0ZVByZWxvYWRlZEZpbGUnIHdhcyBub3QgZXhwb3J0ZWQuIGFkZCBpdCB0byBFWFRSQV9FWFBPUlRFRF9SVU5USU1FX01FVEhPRFMgKHNlZSB0aGUgRkFRKS4gQWx0ZXJuYXRpdmVseSwgZm9yY2luZyBmaWxlc3lzdGVtIHN1cHBvcnQgKC1zIEZPUkNFX0ZJTEVTWVNURU09MSkgY2FuIGV4cG9ydCB0aGlzIGZvciB5b3VcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkZTX2NyZWF0ZUxhenlGaWxlXCIpKSBNb2R1bGVbXCJGU19jcmVhdGVMYXp5RmlsZVwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ0ZTX2NyZWF0ZUxhenlGaWxlJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSkuIEFsdGVybmF0aXZlbHksIGZvcmNpbmcgZmlsZXN5c3RlbSBzdXBwb3J0ICgtcyBGT1JDRV9GSUxFU1lTVEVNPTEpIGNhbiBleHBvcnQgdGhpcyBmb3IgeW91XCIpO1xufTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJGU19jcmVhdGVMaW5rXCIpKSBNb2R1bGVbXCJGU19jcmVhdGVMaW5rXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInRlNfY3JlYXRlTGluaycgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpXCIpO1xufTtcblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgXCJGU19jcmVhdGVEZXZpY2VcIikpIE1vZHVsZVtcIkZTX2NyZWF0ZURldmljZVwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ0ZTX2NyZWF0ZURldmljZScgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpLiBBbHRlcm5hdGl2ZWx5LCBmb3JjaW5nIGZpbGVzeXN0ZW0gc3VwcG9ydCAoLXMgRk9SQ0VfRklMRVNZU1RFTT0xKSBjYW4gZXhwb3J0IHRoaXMgZm9yIHlvdVwiKTtcbn07XG5cbmlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihNb2R1bGUsIFwiRlNfdW5saW5rXCIpKSBNb2R1bGVbXCJGU191bmxpbmtcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidGU191bmxpbmsnIHdhcyBub3QgZXhwb3J0ZWQuIGFkZCBpdCB0byBFWFRSQV9FWFBPUlRFRF9SVU5USU1FX01FVEhPRFMgKHNlZSB0aGUgRkFRKS4gQWx0ZXJuYXRpdmVseSwgZm9yY2luZyBmaWxlc3lzdGVtIHN1cHBvcnQgKC1zIEZPUkNFX0ZJTEVTWVNURU09MSkgY2FuIGV4cG9ydCB0aGlzIGZvciB5b3VcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImdldExFQlwiKSkgTW9kdWxlW1wiZ2V0TEVCXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInZ2V0TEVCJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImdldEZ1bmN0aW9uVGFibGVzXCIpKSBNb2R1bGVbXCJnZXRGdW5jdGlvblRhYmxlc1wiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ2dldEZ1bmN0aW9uVGFibGVzJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImFsaWduRnVuY3Rpb25UYWJsZXNcIikpIE1vZHVsZVtcImFsaWduRnVuY3Rpb25UYWJsZXNcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidhbGlnbkZ1bmN0aW9uVGFibGVzJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInJlZ2lzdGVyRnVuY3Rpb25zXCIpKSBNb2R1bGVbXCJyZWdpc3RlckZ1bmN0aW9uc1wiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3JlZ2lzdGVyRnVuY3Rpb25zJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImFkZEZ1bmN0aW9uXCIpKSBNb2R1bGVbXCJhZGRGdW5jdGlvblwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ2FkZEZ1bmN0aW9uJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInJlbW92ZUZ1bmN0aW9uXCIpKSBNb2R1bGVbXCJyZW1vdmVGdW5jdGlvblwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3JlbW92ZUZ1bmN0aW9uJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImdldEZ1bmNXcmFwcGVyXCIpKSBNb2R1bGVbXCJnZXRGdW5jV3JhcHBlclwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ2dldEZ1bmNXcmFwcGVyJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInByZXR0eVByaW50XCIpKSBNb2R1bGVbXCJwcmV0dHlQcmludFwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3ByZXR0eVByaW50JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIm1ha2VCaWdJbnRcIikpIE1vZHVsZVtcIm1ha2VCaWdJbnRcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidtYWtlQmlnSW50JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImR5bkNhbGxcIikpIE1vZHVsZVtcImR5bkNhbGxcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidkeW5DYWxsJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImdldENvbXBpbGVyU2V0dGluZ1wiKSkgTW9kdWxlW1wiZ2V0Q29tcGlsZXJTZXR0aW5nXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInZ2V0Q29tcGlsZXJTZXR0aW5nJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInByaW50XCIpKSBNb2R1bGVbXCJwcmludFwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3ByaW50JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInByaW50RXJyXCIpKSBNb2R1bGVbXCJwcmludEVyclwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3ByaW50RXJyJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImdldFRlbXBSZXQwXCIpKSBNb2R1bGVbXCJnZXRUZW1wUmV0MFwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ2dldFRlbXBSZXQwJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInNldFRlbXBSZXQwXCIpKSBNb2R1bGVbXCJzZXRUZW1wUmV0MFwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3NldFRlbXBSZXQwJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImNhbGxNYWluXCIpKSBNb2R1bGVbXCJjYWxsTWFpblwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ2NhbGxNYWluJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImFib3J0XCIpKSBNb2R1bGVbXCJhYm9ydFwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ2Fib3J0JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInN0cmluZ1RvTmV3VVRGOFwiKSkgTW9kdWxlW1wic3RyaW5nVG9OZXdVVEY4XCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInc3RyaW5nVG9OZXdVVEY4JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInNldEZpbGVUaW1lXCIpKSBNb2R1bGVbXCJzZXRGaWxlVGltZVwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3NldEZpbGVUaW1lJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImVtc2NyaXB0ZW5fcmVhbGxvY19idWZmZXJcIikpIE1vZHVsZVtcImVtc2NyaXB0ZW5fcmVhbGxvY19idWZmZXJcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidlbXNjcmlwdGVuX3JlYWxsb2NfYnVmZmVyJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkVOVlwiKSkgTW9kdWxlW1wiRU5WXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInRU5WJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkVSUk5PX0NPREVTXCIpKSBNb2R1bGVbXCJFUlJOT19DT0RFU1wiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ0VSUk5PX0NPREVTJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkVSUk5PX01FU1NBR0VTXCIpKSBNb2R1bGVbXCJFUlJOT19NRVNTQUdFU1wiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ0VSUk5PX01FU1NBR0VTJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInNldEVyck5vXCIpKSBNb2R1bGVbXCJzZXRFcnJOb1wiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3NldEVyck5vJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkROU1wiKSkgTW9kdWxlW1wiRE5TXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInRE5TJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImdldEhvc3RCeU5hbWVcIikpIE1vZHVsZVtcImdldEhvc3RCeU5hbWVcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidnZXRIb3N0QnlOYW1lJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkdBSV9FUlJOT19NRVNTQUdFU1wiKSkgTW9kdWxlW1wiR0FJX0VSUk5PX01FU1NBR0VTXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInR0FJX0VSUk5PX01FU1NBR0VTJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIlByb3RvY29sc1wiKSkgTW9kdWxlW1wiUHJvdG9jb2xzXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInUHJvdG9jb2xzJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIlNvY2tldHNcIikpIE1vZHVsZVtcIlNvY2tldHNcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidTb2NrZXRzJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImdldFJhbmRvbURldmljZVwiKSkgTW9kdWxlW1wiZ2V0UmFuZG9tRGV2aWNlXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInZ2V0UmFuZG9tRGV2aWNlJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInRyYXZlcnNlU3RhY2tcIikpIE1vZHVsZVtcInRyYXZlcnNlU3RhY2tcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIid0cmF2ZXJzZVN0YWNrJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIlVOV0lORF9DQUNIRVwiKSkgTW9kdWxlW1wiVU5XSU5EX0NBQ0hFXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInVU5XSU5EX0NBQ0hFJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIndpdGhCdWlsdGluTWFsbG9jXCIpKSBNb2R1bGVbXCJ3aXRoQnVpbHRpbk1hbGxvY1wiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3dpdGhCdWlsdGluTWFsbG9jJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInJlYWRBc21Db25zdEFyZ3NBcnJheVwiKSkgTW9kdWxlW1wicmVhZEFzbUNvbnN0QXJnc0FycmF5XCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCIncmVhZEFzbUNvbnN0QXJnc0FycmF5JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInJlYWRBc21Db25zdEFyZ3NcIikpIE1vZHVsZVtcInJlYWRBc21Db25zdEFyZ3NcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidyZWFkQXNtQ29uc3RBcmdzJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIm1haW5UaHJlYWRFTV9BU01cIikpIE1vZHVsZVtcIm1haW5UaHJlYWRFTV9BU01cIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidtYWluVGhyZWFkRU1fQVNNJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImpzdG9pX3FcIikpIE1vZHVsZVtcImpzdG9pX3FcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidqc3RvaV9xJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImpzdG9pX3NcIikpIE1vZHVsZVtcImpzdG9pX3NcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidqc3RvaV9zJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImdldEV4ZWN1dGFibGVOYW1lXCIpKSBNb2R1bGVbXCJnZXRFeGVjdXRhYmxlTmFtZVwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ2dldEV4ZWN1dGFibGVOYW1lJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImxpc3Rlbk9uY2VcIikpIE1vZHVsZVtcImxpc3Rlbk9uY2VcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidsaXN0ZW5PbmNlJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImF1dG9SZXN1bWVBdWRpb0NvbnRleHRcIikpIE1vZHVsZVtcImF1dG9SZXN1bWVBdWRpb0NvbnRleHRcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidhdXRvUmVzdW1lQXVkaW9Db250ZXh0JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImR5bkNhbGxMZWdhY3lcIikpIE1vZHVsZVtcImR5bkNhbGxMZWdhY3lcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidkeW5DYWxsTGVnYWN5JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImdldER5bkNhbGxlclwiKSkgTW9kdWxlW1wiZ2V0RHluQ2FsbGVyXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInZ2V0RHluQ2FsbGVyJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImR5bkNhbGxcIikpIE1vZHVsZVtcImR5bkNhbGxcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidkeW5DYWxsJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImNhbGxSdW50aW1lQ2FsbGJhY2tzXCIpKSBNb2R1bGVbXCJjYWxsUnVudGltZUNhbGxiYWNrc1wiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ2NhbGxSdW50aW1lQ2FsbGJhY2tzJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImFib3J0U3RhY2tPdmVyZmxvd1wiKSkgTW9kdWxlW1wiYWJvcnRTdGFja092ZXJmbG93XCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInYWJvcnRTdGFja092ZXJmbG93JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInJlYWxseU5lZ2F0aXZlXCIpKSBNb2R1bGVbXCJyZWFsbHlOZWdhdGl2ZVwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3JlYWxseU5lZ2F0aXZlJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInVuU2lnblwiKSkgTW9kdWxlW1widW5TaWduXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCIndW5TaWduJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInJlU2lnblwiKSkgTW9kdWxlW1wicmVTaWduXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCIncmVTaWduJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImZvcm1hdFN0cmluZ1wiKSkgTW9kdWxlW1wiZm9ybWF0U3RyaW5nXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInZm9ybWF0U3RyaW5nJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIlBBVEhcIikpIE1vZHVsZVtcIlBBVEhcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidQQVRIJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIlBBVEhfRlNcIikpIE1vZHVsZVtcIlBBVEhfRlNcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidQQVRIX0ZTJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIlNZU0NBTExTXCIpKSBNb2R1bGVbXCJTWVNDQUxMU1wiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ1NZU0NBTExTJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInN5c2NhbGxNbWFwMlwiKSkgTW9kdWxlW1wic3lzY2FsbE1tYXAyXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInc3lzY2FsbE1tYXAyJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInN5c2NhbGxNdW5tYXBcIikpIE1vZHVsZVtcInN5c2NhbGxNdW5tYXBcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidzeXNjYWxsTXVubWFwJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkpTRXZlbnRzXCIpKSBNb2R1bGVbXCJKU0V2ZW50c1wiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ0pTRXZlbnRzJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInNwZWNpYWxIVE1MVGFyZ2V0c1wiKSkgTW9kdWxlW1wic3BlY2lhbEhUTUxUYXJnZXRzXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInc3BlY2lhbEhUTUxUYXJnZXRzJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIm1heWJlQ1N0cmluZ1RvSnNTdHJpbmdcIikpIE1vZHVsZVtcIm1heWJlQ1N0cmluZ1RvSnNTdHJpbmdcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidtYXliZUNTdHJpbmdUb0pzU3RyaW5nJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImZpbmRFdmVudFRhcmdldFwiKSkgTW9kdWxlW1wiZmluZEV2ZW50VGFyZ2V0XCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInZmluZEV2ZW50VGFyZ2V0JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImZpbmRDYW52YXNFdmVudFRhcmdldFwiKSkgTW9kdWxlW1wiZmluZENhbnZhc0V2ZW50VGFyZ2V0XCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInZmluZENhbnZhc0V2ZW50VGFyZ2V0JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInBvbHlmaWxsU2V0SW1tZWRpYXRlXCIpKSBNb2R1bGVbXCJwb2x5ZmlsbFNldEltbWVkaWF0ZVwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3BvbHlmaWxsU2V0SW1tZWRpYXRlJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImRlbWFuZ2xlXCIpKSBNb2R1bGVbXCJkZW1hbmdsZVwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ2RlbWFuZ2xlJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImRlbWFuZ2xlQWxsXCIpKSBNb2R1bGVbXCJkZW1hbmdsZUFsbFwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ2RlbWFuZ2xlQWxsJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImpzU3RhY2tUcmFjZVwiKSkgTW9kdWxlW1wianNTdGFja1RyYWNlXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInanNTdGFja1RyYWNlJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInN0YWNrVHJhY2VcIikpIE1vZHVsZVtcInN0YWNrVHJhY2VcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidzdGFja1RyYWNlJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImdldEVudlN0cmluZ3NcIikpIE1vZHVsZVtcImdldEVudlN0cmluZ3NcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidnZXRFbnZTdHJpbmdzJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImNoZWNrV2FzaUNsb2NrXCIpKSBNb2R1bGVbXCJjaGVja1dhc2lDbG9ja1wiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ2NoZWNrV2FzaUNsb2NrJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIndyaXRlSTUzVG9JNjRcIikpIE1vZHVsZVtcIndyaXRlSTUzVG9JNjRcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIid3cml0ZUk1M1RvSTY0JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIndyaXRlSTUzVG9JNjRDbGFtcGVkXCIpKSBNb2R1bGVbXCJ3cml0ZUk1M1RvSTY0Q2xhbXBlZFwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3dyaXRlSTUzVG9JNjRDbGFtcGVkJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIndyaXRlSTUzVG9JNjRTaWduYWxpbmdcIikpIE1vZHVsZVtcIndyaXRlSTUzVG9JNjRTaWduYWxpbmdcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIid3cml0ZUk1M1RvSTY0U2lnbmFsaW5nJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIndyaXRlSTUzVG9VNjRDbGFtcGVkXCIpKSBNb2R1bGVbXCJ3cml0ZUk1M1RvVTY0Q2xhbXBlZFwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3dyaXRlSTUzVG9VNjRDbGFtcGVkJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIndyaXRlSTUzVG9VNjRTaWduYWxpbmdcIikpIE1vZHVsZVtcIndyaXRlSTUzVG9VNjRTaWduYWxpbmdcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIid3cml0ZUk1M1RvVTY0U2lnbmFsaW5nJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInJlYWRJNTNGcm9tSTY0XCIpKSBNb2R1bGVbXCJyZWFkSTUzRnJvbUk2NFwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3JlYWRJNTNGcm9tSTY0JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInJlYWRJNTNGcm9tVTY0XCIpKSBNb2R1bGVbXCJyZWFkSTUzRnJvbVU2NFwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3JlYWRJNTNGcm9tVTY0JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImNvbnZlcnRJMzJQYWlyVG9JNTNcIikpIE1vZHVsZVtcImNvbnZlcnRJMzJQYWlyVG9JNTNcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidjb252ZXJ0STMyUGFpclRvSTUzJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImNvbnZlcnRVMzJQYWlyVG9JNTNcIikpIE1vZHVsZVtcImNvbnZlcnRVMzJQYWlyVG9JNTNcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidjb252ZXJ0VTMyUGFpclRvSTUzJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInVuY2F1Z2h0RXhjZXB0aW9uQ291bnRcIikpIE1vZHVsZVtcInVuY2F1Z2h0RXhjZXB0aW9uQ291bnRcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIid1bmNhdWdodEV4Y2VwdGlvbkNvdW50JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImV4Y2VwdGlvbkxhc3RcIikpIE1vZHVsZVtcImV4Y2VwdGlvbkxhc3RcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidleGNlcHRpb25MYXN0JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImV4Y2VwdGlvbkNhdWdodFwiKSkgTW9kdWxlW1wiZXhjZXB0aW9uQ2F1Z2h0XCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInZXhjZXB0aW9uQ2F1Z2h0JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkV4Y2VwdGlvbkluZm9BdHRyc1wiKSkgTW9kdWxlW1wiRXhjZXB0aW9uSW5mb0F0dHJzXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInRXhjZXB0aW9uSW5mb0F0dHJzJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkV4Y2VwdGlvbkluZm9cIikpIE1vZHVsZVtcIkV4Y2VwdGlvbkluZm9cIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidFeGNlcHRpb25JbmZvJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkNhdGNoSW5mb1wiKSkgTW9kdWxlW1wiQ2F0Y2hJbmZvXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInQ2F0Y2hJbmZvJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImV4Y2VwdGlvbl9hZGRSZWZcIikpIE1vZHVsZVtcImV4Y2VwdGlvbl9hZGRSZWZcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidleGNlcHRpb25fYWRkUmVmJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImV4Y2VwdGlvbl9kZWNSZWZcIikpIE1vZHVsZVtcImV4Y2VwdGlvbl9kZWNSZWZcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidleGNlcHRpb25fZGVjUmVmJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkJyb3dzZXJcIikpIE1vZHVsZVtcIkJyb3dzZXJcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidCcm93c2VyJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImZ1bmNXcmFwcGVyc1wiKSkgTW9kdWxlW1wiZnVuY1dyYXBwZXJzXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInZnVuY1dyYXBwZXJzJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImdldEZ1bmNXcmFwcGVyXCIpKSBNb2R1bGVbXCJnZXRGdW5jV3JhcHBlclwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ2dldEZ1bmNXcmFwcGVyJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInNldE1haW5Mb29wXCIpKSBNb2R1bGVbXCJzZXRNYWluTG9vcFwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3NldE1haW5Mb29wJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkZTXCIpKSBNb2R1bGVbXCJGU1wiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ0ZTJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIm1tYXBBbGxvY1wiKSkgTW9kdWxlW1wibW1hcEFsbG9jXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInbW1hcEFsbG9jJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIk1FTUZTXCIpKSBNb2R1bGVbXCJNRU1GU1wiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ01FTUZTJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIlRUWVwiKSkgTW9kdWxlW1wiVFRZXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInVFRZJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIlBJUEVGU1wiKSkgTW9kdWxlW1wiUElQRUZTXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInUElQRUZTJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIlNPQ0tGU1wiKSkgTW9kdWxlW1wiU09DS0ZTXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInU09DS0ZTJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInRlbXBGaXhlZExlbmd0aEFycmF5XCIpKSBNb2R1bGVbXCJ0ZW1wRml4ZWRMZW5ndGhBcnJheVwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3RlbXBGaXhlZExlbmd0aEFycmF5JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIm1pbmlUZW1wV2ViR0xGbG9hdEJ1ZmZlcnNcIikpIE1vZHVsZVtcIm1pbmlUZW1wV2ViR0xGbG9hdEJ1ZmZlcnNcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidtaW5pVGVtcFdlYkdMRmxvYXRCdWZmZXJzJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImhlYXBPYmplY3RGb3JXZWJHTFR5cGVcIikpIE1vZHVsZVtcImhlYXBPYmplY3RGb3JXZWJHTFR5cGVcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidoZWFwT2JqZWN0Rm9yV2ViR0xUeXBlJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImhlYXBBY2Nlc3NTaGlmdEZvcldlYkdMSGVhcFwiKSkgTW9kdWxlW1wiaGVhcEFjY2Vzc1NoaWZ0Rm9yV2ViR0xIZWFwXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInaGVhcEFjY2Vzc1NoaWZ0Rm9yV2ViR0xIZWFwJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkdMXCIpKSBNb2R1bGVbXCJHTFwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ0dMJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImVtc2NyaXB0ZW5XZWJHTEdldFwiKSkgTW9kdWxlW1wiZW1zY3JpcHRlbldlYkdMR2V0XCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInZW1zY3JpcHRlbldlYkdMR2V0JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImNvbXB1dGVVbnBhY2tBbGlnbmVkSW1hZ2VTaXplXCIpKSBNb2R1bGVbXCJjb21wdXRlVW5wYWNrQWxpZ25lZEltYWdlU2l6ZVwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ2NvbXB1dGVVbnBhY2tBbGlnbmVkSW1hZ2VTaXplJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImVtc2NyaXB0ZW5XZWJHTEdldFRleFBpeGVsRGF0YVwiKSkgTW9kdWxlW1wiZW1zY3JpcHRlbldlYkdMR2V0VGV4UGl4ZWxEYXRhXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInZW1zY3JpcHRlbldlYkdMR2V0VGV4UGl4ZWxEYXRhJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImVtc2NyaXB0ZW5XZWJHTEdldFVuaWZvcm1cIikpIE1vZHVsZVtcImVtc2NyaXB0ZW5XZWJHTEdldFVuaWZvcm1cIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidlbXNjcmlwdGVuV2ViR0xHZXRVbmlmb3JtJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImVtc2NyaXB0ZW5XZWJHTEdldFZlcnRleEF0dHJpYlwiKSkgTW9kdWxlW1wiZW1zY3JpcHRlbldlYkdMR2V0VmVydGV4QXR0cmliXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInZW1zY3JpcHRlbldlYkdMR2V0VmVydGV4QXR0cmliJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIndyaXRlR0xBcnJheVwiKSkgTW9kdWxlW1wid3JpdGVHTEFycmF5XCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInd3JpdGVHTEFycmF5JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkFMXCIpKSBNb2R1bGVbXCJBTFwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ0FMJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIlNETF91bmljb2RlXCIpKSBNb2R1bGVbXCJTRExfdW5pY29kZVwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ1NETF91bmljb2RlJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIlNETF90dGZDb250ZXh0XCIpKSBNb2R1bGVbXCJTRExfdHRmQ29udGV4dFwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ1NETF90dGZDb250ZXh0JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIlNETF9hdWRpb1wiKSkgTW9kdWxlW1wiU0RMX2F1ZGlvXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInU0RMX2F1ZGlvJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIlNETFwiKSkgTW9kdWxlW1wiU0RMXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInU0RMJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIlNETF9nZnhcIikpIE1vZHVsZVtcIlNETF9nZnhcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidTRExfZ2Z4JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkdMVVRcIikpIE1vZHVsZVtcIkdMVVRcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidHTFVUJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkVHTFwiKSkgTW9kdWxlW1wiRUdMXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInRUdMJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkdMRldfV2luZG93XCIpKSBNb2R1bGVbXCJHTEZXX1dpbmRvd1wiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ0dMRldfV2luZG93JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkdMRldcIikpIE1vZHVsZVtcIkdMRldcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidHTEZXJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkdMRVdcIikpIE1vZHVsZVtcIkdMRVdcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidHTEVXJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIklEQlN0b3JlXCIpKSBNb2R1bGVbXCJJREJTdG9yZVwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ0lEQlN0b3JlJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInJ1bkFuZEFib3J0SWZFcnJvclwiKSkgTW9kdWxlW1wicnVuQW5kQWJvcnRJZkVycm9yXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCIncnVuQW5kQWJvcnRJZkVycm9yJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIndhcm5PbmNlXCIpKSBNb2R1bGVbXCJ3YXJuT25jZVwiXSA9IGZ1bmN0aW9uKCkge1xuIGFib3J0KFwiJ3dhcm5PbmNlJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInN0YWNrU2F2ZVwiKSkgTW9kdWxlW1wic3RhY2tTYXZlXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInc3RhY2tTYXZlJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInN0YWNrUmVzdG9yZVwiKSkgTW9kdWxlW1wic3RhY2tSZXN0b3JlXCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInc3RhY2tSZXN0b3JlJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInN0YWNrQWxsb2NcIikpIE1vZHVsZVtcInN0YWNrQWxsb2NcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidzdGFja0FsbG9jJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkFzY2lpVG9TdHJpbmdcIikpIE1vZHVsZVtcIkFzY2lpVG9TdHJpbmdcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidBc2NpaVRvU3RyaW5nJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInN0cmluZ1RvQXNjaWlcIikpIE1vZHVsZVtcInN0cmluZ1RvQXNjaWlcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidzdHJpbmdUb0FzY2lpJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIlVURjE2VG9TdHJpbmdcIikpIE1vZHVsZVtcIlVURjE2VG9TdHJpbmdcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidVVEYxNlRvU3RyaW5nJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInN0cmluZ1RvVVRGMTZcIikpIE1vZHVsZVtcInN0cmluZ1RvVVRGMTZcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidzdHJpbmdUb1VURjE2JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImxlbmd0aEJ5dGVzVVRGMTZcIikpIE1vZHVsZVtcImxlbmd0aEJ5dGVzVVRGMTZcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidsZW5ndGhCeXRlc1VURjE2JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIlVURjMyVG9TdHJpbmdcIikpIE1vZHVsZVtcIlVURjMyVG9TdHJpbmdcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidVVEYzMlRvU3RyaW5nJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcInN0cmluZ1RvVVRGMzJcIikpIE1vZHVsZVtcInN0cmluZ1RvVVRGMzJcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidzdHJpbmdUb1VURjMyJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImxlbmd0aEJ5dGVzVVRGMzJcIikpIE1vZHVsZVtcImxlbmd0aEJ5dGVzVVRGMzJcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidsZW5ndGhCeXRlc1VURjMyJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImFsbG9jYXRlVVRGOFwiKSkgTW9kdWxlW1wiYWxsb2NhdGVVVEY4XCJdID0gZnVuY3Rpb24oKSB7XG4gYWJvcnQoXCInYWxsb2NhdGVVVEY4JyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcImFsbG9jYXRlVVRGOE9uU3RhY2tcIikpIE1vZHVsZVtcImFsbG9jYXRlVVRGOE9uU3RhY2tcIl0gPSBmdW5jdGlvbigpIHtcbiBhYm9ydChcIidhbGxvY2F0ZVVURjhPblN0YWNrJyB3YXMgbm90IGV4cG9ydGVkLiBhZGQgaXQgdG8gRVhUUkFfRVhQT1JURURfUlVOVElNRV9NRVRIT0RTIChzZWUgdGhlIEZBUSlcIik7XG59O1xuXG5Nb2R1bGVbXCJ3cml0ZVN0YWNrQ29va2llXCJdID0gd3JpdGVTdGFja0Nvb2tpZTtcblxuTW9kdWxlW1wiY2hlY2tTdGFja0Nvb2tpZVwiXSA9IGNoZWNrU3RhY2tDb29raWU7XG5cbmlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihNb2R1bGUsIFwiQUxMT0NfTk9STUFMXCIpKSBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlLCBcIkFMTE9DX05PUk1BTFwiLCB7XG4gY29uZmlndXJhYmxlOiB0cnVlLFxuIGdldDogZnVuY3Rpb24oKSB7XG4gIGFib3J0KFwiJ0FMTE9DX05PUk1BTCcgd2FzIG5vdCBleHBvcnRlZC4gYWRkIGl0IHRvIEVYVFJBX0VYUE9SVEVEX1JVTlRJTUVfTUVUSE9EUyAoc2VlIHRoZSBGQVEpXCIpO1xuIH1cbn0pO1xuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBcIkFMTE9DX1NUQUNLXCIpKSBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlLCBcIkFMTE9DX1NUQUNLXCIsIHtcbiBjb25maWd1cmFibGU6IHRydWUsXG4gZ2V0OiBmdW5jdGlvbigpIHtcbiAgYWJvcnQoXCInQUxMT0NfU1RBQ0snIHdhcyBub3QgZXhwb3J0ZWQuIGFkZCBpdCB0byBFWFRSQV9FWFBPUlRFRF9SVU5USU1FX01FVEhPRFMgKHNlZSB0aGUgRkFRKVwiKTtcbiB9XG59KTtcblxudmFyIGNhbGxlZFJ1bjtcblxuZnVuY3Rpb24gRXhpdFN0YXR1cyhzdGF0dXMpIHtcbiB0aGlzLm5hbWUgPSBcIkV4aXRTdGF0dXNcIjtcbiB0aGlzLm1lc3NhZ2UgPSBcIlByb2dyYW0gdGVybWluYXRlZCB3aXRoIGV4aXQoXCIgKyBzdGF0dXMgKyBcIilcIjtcbiB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbn1cblxudmFyIGNhbGxlZE1haW4gPSBmYWxzZTtcblxuZGVwZW5kZW5jaWVzRnVsZmlsbGVkID0gZnVuY3Rpb24gcnVuQ2FsbGVyKCkge1xuIGlmICghY2FsbGVkUnVuKSBydW4oKTtcbiBpZiAoIWNhbGxlZFJ1bikgZGVwZW5kZW5jaWVzRnVsZmlsbGVkID0gcnVuQ2FsbGVyO1xufTtcblxuZnVuY3Rpb24gcnVuKGFyZ3MpIHtcbiBhcmdzID0gYXJncyB8fCBhcmd1bWVudHNfO1xuIGlmIChydW5EZXBlbmRlbmNpZXMgPiAwKSB7XG4gIHJldHVybjtcbiB9XG4gX2Vtc2NyaXB0ZW5fc3RhY2tfaW5pdCgpO1xuIHdyaXRlU3RhY2tDb29raWUoKTtcbiBwcmVSdW4oKTtcbiBpZiAocnVuRGVwZW5kZW5jaWVzID4gMCkgcmV0dXJuO1xuIGZ1bmN0aW9uIGRvUnVuKCkge1xuICBpZiAoY2FsbGVkUnVuKSByZXR1cm47XG4gIGNhbGxlZFJ1biA9IHRydWU7XG4gIE1vZHVsZVtcImNhbGxlZFJ1blwiXSA9IHRydWU7XG4gIGlmIChBQk9SVCkgcmV0dXJuO1xuICBpbml0UnVudGltZSgpO1xuICBwcmVNYWluKCk7XG4gIHJlYWR5UHJvbWlzZVJlc29sdmUoTW9kdWxlKTtcbiAgaWYgKE1vZHVsZVtcIm9uUnVudGltZUluaXRpYWxpemVkXCJdKSBNb2R1bGVbXCJvblJ1bnRpbWVJbml0aWFsaXplZFwiXSgpO1xuICBhc3NlcnQoIU1vZHVsZVtcIl9tYWluXCJdLCAnY29tcGlsZWQgd2l0aG91dCBhIG1haW4sIGJ1dCBvbmUgaXMgcHJlc2VudC4gaWYgeW91IGFkZGVkIGl0IGZyb20gSlMsIHVzZSBNb2R1bGVbXCJvblJ1bnRpbWVJbml0aWFsaXplZFwiXScpO1xuICBwb3N0UnVuKCk7XG4gfVxuIGlmIChNb2R1bGVbXCJzZXRTdGF0dXNcIl0pIHtcbiAgTW9kdWxlW1wic2V0U3RhdHVzXCJdKFwiUnVubmluZy4uLlwiKTtcbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgTW9kdWxlW1wic2V0U3RhdHVzXCJdKFwiXCIpO1xuICAgfSwgMSk7XG4gICBkb1J1bigpO1xuICB9LCAxKTtcbiB9IGVsc2Uge1xuICBkb1J1bigpO1xuIH1cbiBjaGVja1N0YWNrQ29va2llKCk7XG59XG5cbk1vZHVsZVtcInJ1blwiXSA9IHJ1bjtcblxuZnVuY3Rpb24gY2hlY2tVbmZsdXNoZWRDb250ZW50KCkge1xuIHZhciBvbGRPdXQgPSBvdXQ7XG4gdmFyIG9sZEVyciA9IGVycjtcbiB2YXIgaGFzID0gZmFsc2U7XG4gb3V0ID0gZXJyID0gZnVuY3Rpb24oeCkge1xuICBoYXMgPSB0cnVlO1xuIH07XG4gdHJ5IHtcbiAgdmFyIGZsdXNoID0gTW9kdWxlW1wiX2ZmbHVzaFwiXTtcbiAgaWYgKGZsdXNoKSBmbHVzaCgwKTtcbiAgWyBcInN0ZG91dFwiLCBcInN0ZGVyclwiIF0uZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICB2YXIgaW5mbyA9IEZTLmFuYWx5emVQYXRoKFwiL2Rldi9cIiArIG5hbWUpO1xuICAgaWYgKCFpbmZvKSByZXR1cm47XG4gICB2YXIgc3RyZWFtID0gaW5mby5vYmplY3Q7XG4gICB2YXIgcmRldiA9IHN0cmVhbS5yZGV2O1xuICAgdmFyIHR0eSA9IFRUWS50dHlzW3JkZXZdO1xuICAgaWYgKHR0eSAmJiB0dHkub3V0cHV0ICYmIHR0eS5vdXRwdXQubGVuZ3RoKSB7XG4gICAgaGFzID0gdHJ1ZTtcbiAgIH1cbiAgfSk7XG4gfSBjYXRjaCAoZSkge31cbiBvdXQgPSBvbGRPdXQ7XG4gZXJyID0gb2xkRXJyO1xuIGlmIChoYXMpIHtcbiAgd2Fybk9uY2UoXCJzdGRpbyBzdHJlYW1zIGhhZCBjb250ZW50IGluIHRoZW0gdGhhdCB3YXMgbm90IGZsdXNoZWQuIHlvdSBzaG91bGQgc2V0IEVYSVRfUlVOVElNRSB0byAxIChzZWUgdGhlIEZBUSksIG9yIG1ha2Ugc3VyZSB0byBlbWl0IGEgbmV3bGluZSB3aGVuIHlvdSBwcmludGYgZXRjLlwiKTtcbiB9XG59XG5cbmZ1bmN0aW9uIGV4aXQoc3RhdHVzLCBpbXBsaWNpdCkge1xuIGNoZWNrVW5mbHVzaGVkQ29udGVudCgpO1xuIGlmIChpbXBsaWNpdCAmJiBub0V4aXRSdW50aW1lICYmIHN0YXR1cyA9PT0gMCkge1xuICByZXR1cm47XG4gfVxuIGlmIChub0V4aXRSdW50aW1lKSB7XG4gIGlmICghaW1wbGljaXQpIHtcbiAgIHZhciBtc2cgPSBcInByb2dyYW0gZXhpdGVkICh3aXRoIHN0YXR1czogXCIgKyBzdGF0dXMgKyBcIiksIGJ1dCBFWElUX1JVTlRJTUUgaXMgbm90IHNldCwgc28gaGFsdGluZyBleGVjdXRpb24gYnV0IG5vdCBleGl0aW5nIHRoZSBydW50aW1lIG9yIHByZXZlbnRpbmcgZnVydGhlciBhc3luYyBleGVjdXRpb24gKGJ1aWxkIHdpdGggRVhJVF9SVU5USU1FPTEsIGlmIHlvdSB3YW50IGEgdHJ1ZSBzaHV0ZG93bilcIjtcbiAgIHJlYWR5UHJvbWlzZVJlamVjdChtc2cpO1xuICAgZXJyKG1zZyk7XG4gIH1cbiB9IGVsc2Uge1xuICBFWElUU1RBVFVTID0gc3RhdHVzO1xuICBleGl0UnVudGltZSgpO1xuICBpZiAoTW9kdWxlW1wib25FeGl0XCJdKSBNb2R1bGVbXCJvbkV4aXRcIl0oc3RhdHVzKTtcbiAgQUJPUlQgPSB0cnVlO1xuIH1cbiBxdWl0XyhzdGF0dXMsIG5ldyBFeGl0U3RhdHVzKHN0YXR1cykpO1xufVxuXG5pZiAoTW9kdWxlW1wicHJlSW5pdFwiXSkge1xuIGlmICh0eXBlb2YgTW9kdWxlW1wicHJlSW5pdFwiXSA9PSBcImZ1bmN0aW9uXCIpIE1vZHVsZVtcInByZUluaXRcIl0gPSBbIE1vZHVsZVtcInByZUluaXRcIl0gXTtcbiB3aGlsZSAoTW9kdWxlW1wicHJlSW5pdFwiXS5sZW5ndGggPiAwKSB7XG4gIE1vZHVsZVtcInByZUluaXRcIl0ucG9wKCkoKTtcbiB9XG59XG5cbm5vRXhpdFJ1bnRpbWUgPSB0cnVlO1xuXG5ydW4oKTtcblxuXG4gIHJldHVybiBNb2R1bGUucmVhZHlcbn1cbik7XG59KSgpO1xuaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JylcbiAgbW9kdWxlLmV4cG9ydHMgPSBNb2R1bGU7XG5lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZVsnYW1kJ10pXG4gIGRlZmluZShbXSwgZnVuY3Rpb24oKSB7IHJldHVybiBNb2R1bGU7IH0pO1xuZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuICBleHBvcnRzW1wiTW9kdWxlXCJdID0gTW9kdWxlO1xuIiwiY29uc3QgcmVzb3VyY2VzVG9Mb2FkID0gcmVxdWlyZSgnLi9yZXNvdXJjZXMvcmVzb3VyY2VzLmpzJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUmVzb3VyY2VNYW5hZ2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZXMgPSB7fTtcclxuICAgICAgICB0aGlzLmRlZmVyQXJyID0gW107XHJcbiAgICAgICAgdGhpcy5sb2FkUmVzb3VyY2VzKHJlc291cmNlc1RvTG9hZCwgdGhpcy5kZWZlckFycik7XHJcbiAgICAgICAgUHJvbWlzZS5hbGwodGhpcy5kZWZlckFycikudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KGtleSkge1xyXG4gICAgICAgIGNvbnN0IHJlc291cmNlID0gdGhpcy5yZXNvdXJjZXNba2V5XTtcclxuICAgICAgICBpZiAoIXJlc291cmNlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Jlc291cmNlICcgKyBrZXkgKyAnIG5vdCBmb3VuZCEnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRSZXNvdXJjZShsb2NhdGlvbiwga2V5LCB1cmwsIGRlZmVyQXJyLCBvcHRpb25zKSB7XHJcbiAgICAgICAgZGVmZXJBcnIucHVzaChuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxvY2F0aW9uW2tleV0gPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgbG9jYXRpb25ba2V5XS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUmVzb3VyY2UgbG9hZGVkOiAnICsgdXJsKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmZsaXBEaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbWFnZSA9IGxvY2F0aW9uW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGMud2lkdGggPSBpbWFnZS53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICBjLmhlaWdodCA9IGltYWdlLmhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdHggPSBjLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LnNjYWxlKC0xLDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1hZ2UsLWltYWdlLndpZHRoLDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uW2tleSArICctRkxJUFBFRCddID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb25ba2V5ICsgJy1GTElQUEVEJ10ub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRmxpcHBlZDogJyArIHVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uW2tleSArICctRkxJUFBFRCddLnNyYyA9IGMudG9EYXRhVVJMKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxvY2F0aW9uW2tleV0ub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvdWxkblxcJ3QgbG9hZCByZXNvdXJjZTogJyArIHVybCk7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxvY2F0aW9uW2tleV0uc3JjID0gdXJsO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkUmVzb3VyY2VzKHJlc291cmNlc1RvTG9hZCwgZGVmZXJBcnIpIHtcclxuICAgICAgICBjb25zdCByZXNvdXJjZVVybHMgPSBPYmplY3Qua2V5cyhyZXNvdXJjZXNUb0xvYWQpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzb3VyY2VVcmxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFJlc291cmNlKHRoaXMucmVzb3VyY2VzLCByZXNvdXJjZVVybHNbaV0sICcvcmVzb3VyY2VzLycgKyByZXNvdXJjZVVybHNbaV0sIGRlZmVyQXJyLFxyXG4gICAgICAgICAgICAgICAgcmVzb3VyY2VzVG9Mb2FkW3Jlc291cmNlVXJsc1tpXV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgICdtYXJpbmUucG5nJzoge1xyXG4gICAgICAgIGZsaXBEaXJlY3Rpb246IHRydWVcclxuICAgIH0sXHJcbiAgICAnbWFyaW5lQXJtLnBuZyc6IHt9LFxyXG4gICAgJ200LnBuZyc6IHtcclxuICAgICAgICBmbGlwRGlyZWN0aW9uOiB0cnVlXHJcbiAgICB9XHJcbn07IiwiLy8gJ3BhdGgnIG1vZHVsZSBleHRyYWN0ZWQgZnJvbSBOb2RlLmpzIHY4LjExLjEgKG9ubHkgdGhlIHBvc2l4IHBhcnQpXG4vLyB0cmFuc3BsaXRlZCB3aXRoIEJhYmVsXG5cbi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGFzc2VydFBhdGgocGF0aCkge1xuICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUGF0aCBtdXN0IGJlIGEgc3RyaW5nLiBSZWNlaXZlZCAnICsgSlNPTi5zdHJpbmdpZnkocGF0aCkpO1xuICB9XG59XG5cbi8vIFJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCB3aXRoIGRpcmVjdG9yeSBuYW1lc1xuZnVuY3Rpb24gbm9ybWFsaXplU3RyaW5nUG9zaXgocGF0aCwgYWxsb3dBYm92ZVJvb3QpIHtcbiAgdmFyIHJlcyA9ICcnO1xuICB2YXIgbGFzdFNlZ21lbnRMZW5ndGggPSAwO1xuICB2YXIgbGFzdFNsYXNoID0gLTE7XG4gIHZhciBkb3RzID0gMDtcbiAgdmFyIGNvZGU7XG4gIGZvciAodmFyIGkgPSAwOyBpIDw9IHBhdGgubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoaSA8IHBhdGgubGVuZ3RoKVxuICAgICAgY29kZSA9IHBhdGguY2hhckNvZGVBdChpKTtcbiAgICBlbHNlIGlmIChjb2RlID09PSA0NyAvKi8qLylcbiAgICAgIGJyZWFrO1xuICAgIGVsc2VcbiAgICAgIGNvZGUgPSA0NyAvKi8qLztcbiAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgIGlmIChsYXN0U2xhc2ggPT09IGkgLSAxIHx8IGRvdHMgPT09IDEpIHtcbiAgICAgICAgLy8gTk9PUFxuICAgICAgfSBlbHNlIGlmIChsYXN0U2xhc2ggIT09IGkgLSAxICYmIGRvdHMgPT09IDIpIHtcbiAgICAgICAgaWYgKHJlcy5sZW5ndGggPCAyIHx8IGxhc3RTZWdtZW50TGVuZ3RoICE9PSAyIHx8IHJlcy5jaGFyQ29kZUF0KHJlcy5sZW5ndGggLSAxKSAhPT0gNDYgLyouKi8gfHwgcmVzLmNoYXJDb2RlQXQocmVzLmxlbmd0aCAtIDIpICE9PSA0NiAvKi4qLykge1xuICAgICAgICAgIGlmIChyZXMubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgdmFyIGxhc3RTbGFzaEluZGV4ID0gcmVzLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgICAgICAgICBpZiAobGFzdFNsYXNoSW5kZXggIT09IHJlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgIGlmIChsYXN0U2xhc2hJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXMgPSAnJztcbiAgICAgICAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IDA7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzID0gcmVzLnNsaWNlKDAsIGxhc3RTbGFzaEluZGV4KTtcbiAgICAgICAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IHJlcy5sZW5ndGggLSAxIC0gcmVzLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbGFzdFNsYXNoID0gaTtcbiAgICAgICAgICAgICAgZG90cyA9IDA7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA9PT0gMiB8fCByZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXMgPSAnJztcbiAgICAgICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gMDtcbiAgICAgICAgICAgIGxhc3RTbGFzaCA9IGk7XG4gICAgICAgICAgICBkb3RzID0gMDtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICByZXMgKz0gJy8uLic7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVzID0gJy4uJztcbiAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IDI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChyZXMubGVuZ3RoID4gMClcbiAgICAgICAgICByZXMgKz0gJy8nICsgcGF0aC5zbGljZShsYXN0U2xhc2ggKyAxLCBpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJlcyA9IHBhdGguc2xpY2UobGFzdFNsYXNoICsgMSwgaSk7XG4gICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gaSAtIGxhc3RTbGFzaCAtIDE7XG4gICAgICB9XG4gICAgICBsYXN0U2xhc2ggPSBpO1xuICAgICAgZG90cyA9IDA7XG4gICAgfSBlbHNlIGlmIChjb2RlID09PSA0NiAvKi4qLyAmJiBkb3RzICE9PSAtMSkge1xuICAgICAgKytkb3RzO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb3RzID0gLTE7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIF9mb3JtYXQoc2VwLCBwYXRoT2JqZWN0KSB7XG4gIHZhciBkaXIgPSBwYXRoT2JqZWN0LmRpciB8fCBwYXRoT2JqZWN0LnJvb3Q7XG4gIHZhciBiYXNlID0gcGF0aE9iamVjdC5iYXNlIHx8IChwYXRoT2JqZWN0Lm5hbWUgfHwgJycpICsgKHBhdGhPYmplY3QuZXh0IHx8ICcnKTtcbiAgaWYgKCFkaXIpIHtcbiAgICByZXR1cm4gYmFzZTtcbiAgfVxuICBpZiAoZGlyID09PSBwYXRoT2JqZWN0LnJvb3QpIHtcbiAgICByZXR1cm4gZGlyICsgYmFzZTtcbiAgfVxuICByZXR1cm4gZGlyICsgc2VwICsgYmFzZTtcbn1cblxudmFyIHBvc2l4ID0ge1xuICAvLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4gIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoKSB7XG4gICAgdmFyIHJlc29sdmVkUGF0aCA9ICcnO1xuICAgIHZhciByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG4gICAgdmFyIGN3ZDtcblxuICAgIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgICB2YXIgcGF0aDtcbiAgICAgIGlmIChpID49IDApXG4gICAgICAgIHBhdGggPSBhcmd1bWVudHNbaV07XG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKGN3ZCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgIGN3ZCA9IHByb2Nlc3MuY3dkKCk7XG4gICAgICAgIHBhdGggPSBjd2Q7XG4gICAgICB9XG5cbiAgICAgIGFzc2VydFBhdGgocGF0aCk7XG5cbiAgICAgIC8vIFNraXAgZW1wdHkgZW50cmllc1xuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICByZXNvbHZlZFBhdGggPSBwYXRoICsgJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckNvZGVBdCgwKSA9PT0gNDcgLyovKi87XG4gICAgfVxuXG4gICAgLy8gQXQgdGhpcyBwb2ludCB0aGUgcGF0aCBzaG91bGQgYmUgcmVzb2x2ZWQgdG8gYSBmdWxsIGFic29sdXRlIHBhdGgsIGJ1dFxuICAgIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gICAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gICAgcmVzb2x2ZWRQYXRoID0gbm9ybWFsaXplU3RyaW5nUG9zaXgocmVzb2x2ZWRQYXRoLCAhcmVzb2x2ZWRBYnNvbHV0ZSk7XG5cbiAgICBpZiAocmVzb2x2ZWRBYnNvbHV0ZSkge1xuICAgICAgaWYgKHJlc29sdmVkUGF0aC5sZW5ndGggPiAwKVxuICAgICAgICByZXR1cm4gJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gJy8nO1xuICAgIH0gZWxzZSBpZiAocmVzb2x2ZWRQYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiByZXNvbHZlZFBhdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnLic7XG4gICAgfVxuICB9LFxuXG4gIG5vcm1hbGl6ZTogZnVuY3Rpb24gbm9ybWFsaXplKHBhdGgpIHtcbiAgICBhc3NlcnRQYXRoKHBhdGgpO1xuXG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSByZXR1cm4gJy4nO1xuXG4gICAgdmFyIGlzQWJzb2x1dGUgPSBwYXRoLmNoYXJDb2RlQXQoMCkgPT09IDQ3IC8qLyovO1xuICAgIHZhciB0cmFpbGluZ1NlcGFyYXRvciA9IHBhdGguY2hhckNvZGVBdChwYXRoLmxlbmd0aCAtIDEpID09PSA0NyAvKi8qLztcblxuICAgIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICAgIHBhdGggPSBub3JtYWxpemVTdHJpbmdQb3NpeChwYXRoLCAhaXNBYnNvbHV0ZSk7XG5cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDAgJiYgIWlzQWJzb2x1dGUpIHBhdGggPSAnLic7XG4gICAgaWYgKHBhdGgubGVuZ3RoID4gMCAmJiB0cmFpbGluZ1NlcGFyYXRvcikgcGF0aCArPSAnLyc7XG5cbiAgICBpZiAoaXNBYnNvbHV0ZSkgcmV0dXJuICcvJyArIHBhdGg7XG4gICAgcmV0dXJuIHBhdGg7XG4gIH0sXG5cbiAgaXNBYnNvbHV0ZTogZnVuY3Rpb24gaXNBYnNvbHV0ZShwYXRoKSB7XG4gICAgYXNzZXJ0UGF0aChwYXRoKTtcbiAgICByZXR1cm4gcGF0aC5sZW5ndGggPiAwICYmIHBhdGguY2hhckNvZGVBdCgwKSA9PT0gNDcgLyovKi87XG4gIH0sXG5cbiAgam9pbjogZnVuY3Rpb24gam9pbigpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiAnLic7XG4gICAgdmFyIGpvaW5lZDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIGFzc2VydFBhdGgoYXJnKTtcbiAgICAgIGlmIChhcmcubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoam9pbmVkID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgam9pbmVkID0gYXJnO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgam9pbmVkICs9ICcvJyArIGFyZztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGpvaW5lZCA9PT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuICcuJztcbiAgICByZXR1cm4gcG9zaXgubm9ybWFsaXplKGpvaW5lZCk7XG4gIH0sXG5cbiAgcmVsYXRpdmU6IGZ1bmN0aW9uIHJlbGF0aXZlKGZyb20sIHRvKSB7XG4gICAgYXNzZXJ0UGF0aChmcm9tKTtcbiAgICBhc3NlcnRQYXRoKHRvKTtcblxuICAgIGlmIChmcm9tID09PSB0bykgcmV0dXJuICcnO1xuXG4gICAgZnJvbSA9IHBvc2l4LnJlc29sdmUoZnJvbSk7XG4gICAgdG8gPSBwb3NpeC5yZXNvbHZlKHRvKTtcblxuICAgIGlmIChmcm9tID09PSB0bykgcmV0dXJuICcnO1xuXG4gICAgLy8gVHJpbSBhbnkgbGVhZGluZyBiYWNrc2xhc2hlc1xuICAgIHZhciBmcm9tU3RhcnQgPSAxO1xuICAgIGZvciAoOyBmcm9tU3RhcnQgPCBmcm9tLmxlbmd0aDsgKytmcm9tU3RhcnQpIHtcbiAgICAgIGlmIChmcm9tLmNoYXJDb2RlQXQoZnJvbVN0YXJ0KSAhPT0gNDcgLyovKi8pXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB2YXIgZnJvbUVuZCA9IGZyb20ubGVuZ3RoO1xuICAgIHZhciBmcm9tTGVuID0gZnJvbUVuZCAtIGZyb21TdGFydDtcblxuICAgIC8vIFRyaW0gYW55IGxlYWRpbmcgYmFja3NsYXNoZXNcbiAgICB2YXIgdG9TdGFydCA9IDE7XG4gICAgZm9yICg7IHRvU3RhcnQgPCB0by5sZW5ndGg7ICsrdG9TdGFydCkge1xuICAgICAgaWYgKHRvLmNoYXJDb2RlQXQodG9TdGFydCkgIT09IDQ3IC8qLyovKVxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgdmFyIHRvRW5kID0gdG8ubGVuZ3RoO1xuICAgIHZhciB0b0xlbiA9IHRvRW5kIC0gdG9TdGFydDtcblxuICAgIC8vIENvbXBhcmUgcGF0aHMgdG8gZmluZCB0aGUgbG9uZ2VzdCBjb21tb24gcGF0aCBmcm9tIHJvb3RcbiAgICB2YXIgbGVuZ3RoID0gZnJvbUxlbiA8IHRvTGVuID8gZnJvbUxlbiA6IHRvTGVuO1xuICAgIHZhciBsYXN0Q29tbW9uU2VwID0gLTE7XG4gICAgdmFyIGkgPSAwO1xuICAgIGZvciAoOyBpIDw9IGxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoaSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgIGlmICh0b0xlbiA+IGxlbmd0aCkge1xuICAgICAgICAgIGlmICh0by5jaGFyQ29kZUF0KHRvU3RhcnQgKyBpKSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAgIC8vIFdlIGdldCBoZXJlIGlmIGBmcm9tYCBpcyB0aGUgZXhhY3QgYmFzZSBwYXRoIGZvciBgdG9gLlxuICAgICAgICAgICAgLy8gRm9yIGV4YW1wbGU6IGZyb209Jy9mb28vYmFyJzsgdG89Jy9mb28vYmFyL2JheidcbiAgICAgICAgICAgIHJldHVybiB0by5zbGljZSh0b1N0YXJ0ICsgaSArIDEpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgLy8gV2UgZ2V0IGhlcmUgaWYgYGZyb21gIGlzIHRoZSByb290XG4gICAgICAgICAgICAvLyBGb3IgZXhhbXBsZTogZnJvbT0nLyc7IHRvPScvZm9vJ1xuICAgICAgICAgICAgcmV0dXJuIHRvLnNsaWNlKHRvU3RhcnQgKyBpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZnJvbUxlbiA+IGxlbmd0aCkge1xuICAgICAgICAgIGlmIChmcm9tLmNoYXJDb2RlQXQoZnJvbVN0YXJ0ICsgaSkgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgICAgICAvLyBXZSBnZXQgaGVyZSBpZiBgdG9gIGlzIHRoZSBleGFjdCBiYXNlIHBhdGggZm9yIGBmcm9tYC5cbiAgICAgICAgICAgIC8vIEZvciBleGFtcGxlOiBmcm9tPScvZm9vL2Jhci9iYXonOyB0bz0nL2Zvby9iYXInXG4gICAgICAgICAgICBsYXN0Q29tbW9uU2VwID0gaTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgIC8vIFdlIGdldCBoZXJlIGlmIGB0b2AgaXMgdGhlIHJvb3QuXG4gICAgICAgICAgICAvLyBGb3IgZXhhbXBsZTogZnJvbT0nL2Zvbyc7IHRvPScvJ1xuICAgICAgICAgICAgbGFzdENvbW1vblNlcCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgdmFyIGZyb21Db2RlID0gZnJvbS5jaGFyQ29kZUF0KGZyb21TdGFydCArIGkpO1xuICAgICAgdmFyIHRvQ29kZSA9IHRvLmNoYXJDb2RlQXQodG9TdGFydCArIGkpO1xuICAgICAgaWYgKGZyb21Db2RlICE9PSB0b0NvZGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgZWxzZSBpZiAoZnJvbUNvZGUgPT09IDQ3IC8qLyovKVxuICAgICAgICBsYXN0Q29tbW9uU2VwID0gaTtcbiAgICB9XG5cbiAgICB2YXIgb3V0ID0gJyc7XG4gICAgLy8gR2VuZXJhdGUgdGhlIHJlbGF0aXZlIHBhdGggYmFzZWQgb24gdGhlIHBhdGggZGlmZmVyZW5jZSBiZXR3ZWVuIGB0b2BcbiAgICAvLyBhbmQgYGZyb21gXG4gICAgZm9yIChpID0gZnJvbVN0YXJ0ICsgbGFzdENvbW1vblNlcCArIDE7IGkgPD0gZnJvbUVuZDsgKytpKSB7XG4gICAgICBpZiAoaSA9PT0gZnJvbUVuZCB8fCBmcm9tLmNoYXJDb2RlQXQoaSkgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgIGlmIChvdXQubGVuZ3RoID09PSAwKVxuICAgICAgICAgIG91dCArPSAnLi4nO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgb3V0ICs9ICcvLi4nO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIExhc3RseSwgYXBwZW5kIHRoZSByZXN0IG9mIHRoZSBkZXN0aW5hdGlvbiAoYHRvYCkgcGF0aCB0aGF0IGNvbWVzIGFmdGVyXG4gICAgLy8gdGhlIGNvbW1vbiBwYXRoIHBhcnRzXG4gICAgaWYgKG91dC5sZW5ndGggPiAwKVxuICAgICAgcmV0dXJuIG91dCArIHRvLnNsaWNlKHRvU3RhcnQgKyBsYXN0Q29tbW9uU2VwKTtcbiAgICBlbHNlIHtcbiAgICAgIHRvU3RhcnQgKz0gbGFzdENvbW1vblNlcDtcbiAgICAgIGlmICh0by5jaGFyQ29kZUF0KHRvU3RhcnQpID09PSA0NyAvKi8qLylcbiAgICAgICAgKyt0b1N0YXJ0O1xuICAgICAgcmV0dXJuIHRvLnNsaWNlKHRvU3RhcnQpO1xuICAgIH1cbiAgfSxcblxuICBfbWFrZUxvbmc6IGZ1bmN0aW9uIF9tYWtlTG9uZyhwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGg7XG4gIH0sXG5cbiAgZGlybmFtZTogZnVuY3Rpb24gZGlybmFtZShwYXRoKSB7XG4gICAgYXNzZXJ0UGF0aChwYXRoKTtcbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDApIHJldHVybiAnLic7XG4gICAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoMCk7XG4gICAgdmFyIGhhc1Jvb3QgPSBjb2RlID09PSA0NyAvKi8qLztcbiAgICB2YXIgZW5kID0gLTE7XG4gICAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gICAgZm9yICh2YXIgaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAxOyAtLWkpIHtcbiAgICAgIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgICAgZW5kID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3JcbiAgICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGVuZCA9PT0gLTEpIHJldHVybiBoYXNSb290ID8gJy8nIDogJy4nO1xuICAgIGlmIChoYXNSb290ICYmIGVuZCA9PT0gMSkgcmV0dXJuICcvLyc7XG4gICAgcmV0dXJuIHBhdGguc2xpY2UoMCwgZW5kKTtcbiAgfSxcblxuICBiYXNlbmFtZTogZnVuY3Rpb24gYmFzZW5hbWUocGF0aCwgZXh0KSB7XG4gICAgaWYgKGV4dCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBleHQgIT09ICdzdHJpbmcnKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImV4dFwiIGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnKTtcbiAgICBhc3NlcnRQYXRoKHBhdGgpO1xuXG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICB2YXIgZW5kID0gLTE7XG4gICAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gICAgdmFyIGk7XG5cbiAgICBpZiAoZXh0ICE9PSB1bmRlZmluZWQgJiYgZXh0Lmxlbmd0aCA+IDAgJiYgZXh0Lmxlbmd0aCA8PSBwYXRoLmxlbmd0aCkge1xuICAgICAgaWYgKGV4dC5sZW5ndGggPT09IHBhdGgubGVuZ3RoICYmIGV4dCA9PT0gcGF0aCkgcmV0dXJuICcnO1xuICAgICAgdmFyIGV4dElkeCA9IGV4dC5sZW5ndGggLSAxO1xuICAgICAgdmFyIGZpcnN0Tm9uU2xhc2hFbmQgPSAtMTtcbiAgICAgIGZvciAoaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjb2RlID09PSA0NyAvKi8qLykge1xuICAgICAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIHBhdGggc2VwYXJhdG9yIHRoYXQgd2FzIG5vdCBwYXJ0IG9mIGEgc2V0IG9mIHBhdGhcbiAgICAgICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICAgICAgaWYgKCFtYXRjaGVkU2xhc2gpIHtcbiAgICAgICAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZmlyc3ROb25TbGFzaEVuZCA9PT0gLTEpIHtcbiAgICAgICAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yLCByZW1lbWJlciB0aGlzIGluZGV4IGluIGNhc2VcbiAgICAgICAgICAgIC8vIHdlIG5lZWQgaXQgaWYgdGhlIGV4dGVuc2lvbiBlbmRzIHVwIG5vdCBtYXRjaGluZ1xuICAgICAgICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICAgICAgICBmaXJzdE5vblNsYXNoRW5kID0gaSArIDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChleHRJZHggPj0gMCkge1xuICAgICAgICAgICAgLy8gVHJ5IHRvIG1hdGNoIHRoZSBleHBsaWNpdCBleHRlbnNpb25cbiAgICAgICAgICAgIGlmIChjb2RlID09PSBleHQuY2hhckNvZGVBdChleHRJZHgpKSB7XG4gICAgICAgICAgICAgIGlmICgtLWV4dElkeCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBtYXRjaGVkIHRoZSBleHRlbnNpb24sIHNvIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91ciBwYXRoXG4gICAgICAgICAgICAgICAgLy8gY29tcG9uZW50XG4gICAgICAgICAgICAgICAgZW5kID0gaTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gRXh0ZW5zaW9uIGRvZXMgbm90IG1hdGNoLCBzbyBvdXIgcmVzdWx0IGlzIHRoZSBlbnRpcmUgcGF0aFxuICAgICAgICAgICAgICAvLyBjb21wb25lbnRcbiAgICAgICAgICAgICAgZXh0SWR4ID0gLTE7XG4gICAgICAgICAgICAgIGVuZCA9IGZpcnN0Tm9uU2xhc2hFbmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGFydCA9PT0gZW5kKSBlbmQgPSBmaXJzdE5vblNsYXNoRW5kO2Vsc2UgaWYgKGVuZCA9PT0gLTEpIGVuZCA9IHBhdGgubGVuZ3RoO1xuICAgICAgcmV0dXJuIHBhdGguc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgaWYgKHBhdGguY2hhckNvZGVBdChpKSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAgIC8vIElmIHdlIHJlYWNoZWQgYSBwYXRoIHNlcGFyYXRvciB0aGF0IHdhcyBub3QgcGFydCBvZiBhIHNldCBvZiBwYXRoXG4gICAgICAgICAgICAvLyBzZXBhcmF0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZywgc3RvcCBub3dcbiAgICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgICAgIHN0YXJ0ID0gaSArIDE7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoZW5kID09PSAtMSkge1xuICAgICAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yLCBtYXJrIHRoaXMgYXMgdGhlIGVuZCBvZiBvdXJcbiAgICAgICAgICAvLyBwYXRoIGNvbXBvbmVudFxuICAgICAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgICAgICAgIGVuZCA9IGkgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChlbmQgPT09IC0xKSByZXR1cm4gJyc7XG4gICAgICByZXR1cm4gcGF0aC5zbGljZShzdGFydCwgZW5kKTtcbiAgICB9XG4gIH0sXG5cbiAgZXh0bmFtZTogZnVuY3Rpb24gZXh0bmFtZShwYXRoKSB7XG4gICAgYXNzZXJ0UGF0aChwYXRoKTtcbiAgICB2YXIgc3RhcnREb3QgPSAtMTtcbiAgICB2YXIgc3RhcnRQYXJ0ID0gMDtcbiAgICB2YXIgZW5kID0gLTE7XG4gICAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gICAgLy8gVHJhY2sgdGhlIHN0YXRlIG9mIGNoYXJhY3RlcnMgKGlmIGFueSkgd2Ugc2VlIGJlZm9yZSBvdXIgZmlyc3QgZG90IGFuZFxuICAgIC8vIGFmdGVyIGFueSBwYXRoIHNlcGFyYXRvciB3ZSBmaW5kXG4gICAgdmFyIHByZURvdFN0YXRlID0gMDtcbiAgICBmb3IgKHZhciBpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIGEgcGF0aCBzZXBhcmF0b3IgdGhhdCB3YXMgbm90IHBhcnQgb2YgYSBzZXQgb2YgcGF0aFxuICAgICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgICBzdGFydFBhcnQgPSBpICsgMTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgaWYgKGVuZCA9PT0gLTEpIHtcbiAgICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3IsIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91clxuICAgICAgICAvLyBleHRlbnNpb25cbiAgICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICAgIGVuZCA9IGkgKyAxO1xuICAgICAgfVxuICAgICAgaWYgKGNvZGUgPT09IDQ2IC8qLiovKSB7XG4gICAgICAgICAgLy8gSWYgdGhpcyBpcyBvdXIgZmlyc3QgZG90LCBtYXJrIGl0IGFzIHRoZSBzdGFydCBvZiBvdXIgZXh0ZW5zaW9uXG4gICAgICAgICAgaWYgKHN0YXJ0RG90ID09PSAtMSlcbiAgICAgICAgICAgIHN0YXJ0RG90ID0gaTtcbiAgICAgICAgICBlbHNlIGlmIChwcmVEb3RTdGF0ZSAhPT0gMSlcbiAgICAgICAgICAgIHByZURvdFN0YXRlID0gMTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhcnREb3QgIT09IC0xKSB7XG4gICAgICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgYW5kIG5vbi1wYXRoIHNlcGFyYXRvciBiZWZvcmUgb3VyIGRvdCwgc28gd2Ugc2hvdWxkXG4gICAgICAgIC8vIGhhdmUgYSBnb29kIGNoYW5jZSBhdCBoYXZpbmcgYSBub24tZW1wdHkgZXh0ZW5zaW9uXG4gICAgICAgIHByZURvdFN0YXRlID0gLTE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0RG90ID09PSAtMSB8fCBlbmQgPT09IC0xIHx8XG4gICAgICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgY2hhcmFjdGVyIGltbWVkaWF0ZWx5IGJlZm9yZSB0aGUgZG90XG4gICAgICAgIHByZURvdFN0YXRlID09PSAwIHx8XG4gICAgICAgIC8vIFRoZSAocmlnaHQtbW9zdCkgdHJpbW1lZCBwYXRoIGNvbXBvbmVudCBpcyBleGFjdGx5ICcuLidcbiAgICAgICAgcHJlRG90U3RhdGUgPT09IDEgJiYgc3RhcnREb3QgPT09IGVuZCAtIDEgJiYgc3RhcnREb3QgPT09IHN0YXJ0UGFydCArIDEpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIHBhdGguc2xpY2Uoc3RhcnREb3QsIGVuZCk7XG4gIH0sXG5cbiAgZm9ybWF0OiBmdW5jdGlvbiBmb3JtYXQocGF0aE9iamVjdCkge1xuICAgIGlmIChwYXRoT2JqZWN0ID09PSBudWxsIHx8IHR5cGVvZiBwYXRoT2JqZWN0ICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwicGF0aE9iamVjdFwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBPYmplY3QuIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBwYXRoT2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIF9mb3JtYXQoJy8nLCBwYXRoT2JqZWN0KTtcbiAgfSxcblxuICBwYXJzZTogZnVuY3Rpb24gcGFyc2UocGF0aCkge1xuICAgIGFzc2VydFBhdGgocGF0aCk7XG5cbiAgICB2YXIgcmV0ID0geyByb290OiAnJywgZGlyOiAnJywgYmFzZTogJycsIGV4dDogJycsIG5hbWU6ICcnIH07XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSByZXR1cm4gcmV0O1xuICAgIHZhciBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KDApO1xuICAgIHZhciBpc0Fic29sdXRlID0gY29kZSA9PT0gNDcgLyovKi87XG4gICAgdmFyIHN0YXJ0O1xuICAgIGlmIChpc0Fic29sdXRlKSB7XG4gICAgICByZXQucm9vdCA9ICcvJztcbiAgICAgIHN0YXJ0ID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICB2YXIgc3RhcnREb3QgPSAtMTtcbiAgICB2YXIgc3RhcnRQYXJ0ID0gMDtcbiAgICB2YXIgZW5kID0gLTE7XG4gICAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gICAgdmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7XG5cbiAgICAvLyBUcmFjayB0aGUgc3RhdGUgb2YgY2hhcmFjdGVycyAoaWYgYW55KSB3ZSBzZWUgYmVmb3JlIG91ciBmaXJzdCBkb3QgYW5kXG4gICAgLy8gYWZ0ZXIgYW55IHBhdGggc2VwYXJhdG9yIHdlIGZpbmRcbiAgICB2YXIgcHJlRG90U3RhdGUgPSAwO1xuXG4gICAgLy8gR2V0IG5vbi1kaXIgaW5mb1xuICAgIGZvciAoOyBpID49IHN0YXJ0OyAtLWkpIHtcbiAgICAgIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIGEgcGF0aCBzZXBhcmF0b3IgdGhhdCB3YXMgbm90IHBhcnQgb2YgYSBzZXQgb2YgcGF0aFxuICAgICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgICBzdGFydFBhcnQgPSBpICsgMTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgaWYgKGVuZCA9PT0gLTEpIHtcbiAgICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3IsIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91clxuICAgICAgICAvLyBleHRlbnNpb25cbiAgICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICAgIGVuZCA9IGkgKyAxO1xuICAgICAgfVxuICAgICAgaWYgKGNvZGUgPT09IDQ2IC8qLiovKSB7XG4gICAgICAgICAgLy8gSWYgdGhpcyBpcyBvdXIgZmlyc3QgZG90LCBtYXJrIGl0IGFzIHRoZSBzdGFydCBvZiBvdXIgZXh0ZW5zaW9uXG4gICAgICAgICAgaWYgKHN0YXJ0RG90ID09PSAtMSkgc3RhcnREb3QgPSBpO2Vsc2UgaWYgKHByZURvdFN0YXRlICE9PSAxKSBwcmVEb3RTdGF0ZSA9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RhcnREb3QgIT09IC0xKSB7XG4gICAgICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgYW5kIG5vbi1wYXRoIHNlcGFyYXRvciBiZWZvcmUgb3VyIGRvdCwgc28gd2Ugc2hvdWxkXG4gICAgICAgIC8vIGhhdmUgYSBnb29kIGNoYW5jZSBhdCBoYXZpbmcgYSBub24tZW1wdHkgZXh0ZW5zaW9uXG4gICAgICAgIHByZURvdFN0YXRlID0gLTE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0RG90ID09PSAtMSB8fCBlbmQgPT09IC0xIHx8XG4gICAgLy8gV2Ugc2F3IGEgbm9uLWRvdCBjaGFyYWN0ZXIgaW1tZWRpYXRlbHkgYmVmb3JlIHRoZSBkb3RcbiAgICBwcmVEb3RTdGF0ZSA9PT0gMCB8fFxuICAgIC8vIFRoZSAocmlnaHQtbW9zdCkgdHJpbW1lZCBwYXRoIGNvbXBvbmVudCBpcyBleGFjdGx5ICcuLidcbiAgICBwcmVEb3RTdGF0ZSA9PT0gMSAmJiBzdGFydERvdCA9PT0gZW5kIC0gMSAmJiBzdGFydERvdCA9PT0gc3RhcnRQYXJ0ICsgMSkge1xuICAgICAgaWYgKGVuZCAhPT0gLTEpIHtcbiAgICAgICAgaWYgKHN0YXJ0UGFydCA9PT0gMCAmJiBpc0Fic29sdXRlKSByZXQuYmFzZSA9IHJldC5uYW1lID0gcGF0aC5zbGljZSgxLCBlbmQpO2Vsc2UgcmV0LmJhc2UgPSByZXQubmFtZSA9IHBhdGguc2xpY2Uoc3RhcnRQYXJ0LCBlbmQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3RhcnRQYXJ0ID09PSAwICYmIGlzQWJzb2x1dGUpIHtcbiAgICAgICAgcmV0Lm5hbWUgPSBwYXRoLnNsaWNlKDEsIHN0YXJ0RG90KTtcbiAgICAgICAgcmV0LmJhc2UgPSBwYXRoLnNsaWNlKDEsIGVuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXQubmFtZSA9IHBhdGguc2xpY2Uoc3RhcnRQYXJ0LCBzdGFydERvdCk7XG4gICAgICAgIHJldC5iYXNlID0gcGF0aC5zbGljZShzdGFydFBhcnQsIGVuZCk7XG4gICAgICB9XG4gICAgICByZXQuZXh0ID0gcGF0aC5zbGljZShzdGFydERvdCwgZW5kKTtcbiAgICB9XG5cbiAgICBpZiAoc3RhcnRQYXJ0ID4gMCkgcmV0LmRpciA9IHBhdGguc2xpY2UoMCwgc3RhcnRQYXJ0IC0gMSk7ZWxzZSBpZiAoaXNBYnNvbHV0ZSkgcmV0LmRpciA9ICcvJztcblxuICAgIHJldHVybiByZXQ7XG4gIH0sXG5cbiAgc2VwOiAnLycsXG4gIGRlbGltaXRlcjogJzonLFxuICB3aW4zMjogbnVsbCxcbiAgcG9zaXg6IG51bGxcbn07XG5cbnBvc2l4LnBvc2l4ID0gcG9zaXg7XG5cbm1vZHVsZS5leHBvcnRzID0gcG9zaXg7XG4iLCIvKiAoaWdub3JlZCkgKi8iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImNvbnN0IGdhbWVPYmplY3RMb29rdXAgPSByZXF1aXJlKCcuL2dhbWUtb2JqZWN0cycpO1xyXG5jb25zdCBSZXNvdXJjZU1hbmFnZXIgPSByZXF1aXJlKCcuL3Jlc291cmNlLW1hbmFnZXInKTtcclxuY29uc3QgQ2xpZW50ID0gcmVxdWlyZSgnLi9nYW1lX2NsaWVudCcpO1xyXG5cclxuZnVuY3Rpb24gVG9IZWFwU3RyaW5nKHdhc20sIHN0cikge1xyXG4gICAgY29uc3QgbGVuZ3RoID0gd2FzbS5sZW5ndGhCeXRlc1VURjgoc3RyKSArIDE7XHJcbiAgICBjb25zdCBidWZmZXIgPSB3YXNtLl9tYWxsb2MobGVuZ3RoKTtcclxuICAgIHdhc20uc3RyaW5nVG9VVEY4KHN0ciwgYnVmZmVyLCBsZW5ndGgpO1xyXG4gICAgcmV0dXJuIGJ1ZmZlcjtcclxufVxyXG5cclxuY29uc29sZS5sb2coJ0xvYWRpbmcgR2FtZSBXQVNNJyk7XHJcbkNsaWVudCgpLnRoZW4oKGluc3RhbmNlKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhpbnN0YW5jZSk7XHJcbiAgICBjb25zb2xlLmxvZygnTG9hZGluZyBXZWIgU29ja2V0Jyk7XHJcbiAgICBjb25zdCB3ZWJTb2NrZXQgPSBuZXcgV2ViU29ja2V0KCd3czovL2xvY2FsaG9zdDo4MDgwL2Nvbm5lY3QnKTtcclxuICAgIHdlYlNvY2tldC5vbm9wZW4gPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnTG9hZGluZyBSZXNvdXJjZSBNYW5hZ2VyJyk7XHJcbiAgICAgICAgY29uc3QgcmVzb3VyY2VNYW5hZ2VyID0gbmV3IFJlc291cmNlTWFuYWdlcigoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTdGFydGluZyBHYW1lJyk7XHJcbiAgICAgICAgICAgIFN0YXJ0R2FtZSh7XHJcbiAgICAgICAgICAgICAgICB3ZWJTb2NrZXQsXHJcbiAgICAgICAgICAgICAgICB3YXNtOiBpbnN0YW5jZSxcclxuICAgICAgICAgICAgICAgIHJlc291cmNlTWFuYWdlclxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn0pLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuXHJcblxyXG4vLyBJTklUSUFMSVpBVElPTlxyXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpO1xyXG5jb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG5sZXQgd2lkdGggPSAwO1xyXG5sZXQgaGVpZ2h0ID0gMDtcclxuXHJcbmZ1bmN0aW9uIHJlc2l6ZSgpIHtcclxuICAgIHdpZHRoICA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgY2FudmFzLndpZHRoICA9IHdpZHRoO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIGNhbnZhcy5zdHlsZS53aWR0aCAgPSB3aWR0aCArICdweCc7XHJcbiAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZSk7XHJcbnJlc2l6ZSgpO1xyXG5cclxubGV0IGxvY2FsUGxheWVyT2JqZWN0SWQgPSB1bmRlZmluZWQ7XHJcblxyXG4vLyBNYWluIEdhbWUgU3RhcnQgKGFmdGVyIGV2ZXJ5dGhpbmcgaGFzIHN0YXJ0ZWQpXHJcbmZ1bmN0aW9uIFN0YXJ0R2FtZShtb2R1bGVzKSB7XHJcbiAgICBjb25zdCB7IHdhc20sIHdlYlNvY2tldCwgcmVzb3VyY2VNYW5hZ2VyIH0gPSBtb2R1bGVzO1xyXG4gICAgY29uc3QgZ2FtZU9iamVjdHMgPSB7fTtcclxuXHJcbiAgICB3ZWJTb2NrZXQub25tZXNzYWdlID0gZnVuY3Rpb24gKGV2KSB7XHJcbiAgICAgICAgY29uc3Qgb2JqID0gSlNPTi5wYXJzZShldi5kYXRhKTtcclxuICAgICAgICBpZiAob2JqW1wicGxheWVyTG9jYWxPYmplY3RJZFwiXSkge1xyXG4gICAgICAgICAgICBsb2NhbFBsYXllck9iamVjdElkID0gb2JqW1wicGxheWVyTG9jYWxPYmplY3RJZFwiXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhlYXBTdHJpbmcgPSBUb0hlYXBTdHJpbmcod2FzbSwgZXYuZGF0YSk7XHJcbiAgICAgICAgICAgIHdhc20uX0hhbmRsZVJlcGxpY2F0ZShoZWFwU3RyaW5nKTtcclxuICAgICAgICAgICAgd2FzbS5fZnJlZShoZWFwU3RyaW5nKTtcclxuICAgICAgICAgICAgZ2FtZU9iamVjdHNbb2JqLmlkXSA9IG9iajtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHNlbmRJbnB1dFBhY2tldChpbnB1dCkge1xyXG4gICAgICAgIGNvbnN0IGlucHV0U3RyID0gSlNPTi5zdHJpbmdpZnkoaW5wdXQpO1xyXG4gICAgICAgIHdlYlNvY2tldC5zZW5kKGlucHV0U3RyKTtcclxuICAgICAgICBpZiAobG9jYWxQbGF5ZXJPYmplY3RJZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vIFNlcnZlIElucHV0cyBpbnRvIExvY2FsXHJcbiAgICAgICAgICAgIGNvbnN0IGhlYXBTdHJpbmcgPSBUb0hlYXBTdHJpbmcod2FzbSwgaW5wdXRTdHIpO1xyXG4gICAgICAgICAgICB3YXNtLl9IYW5kbGVMb2NhbElucHV0KGxvY2FsUGxheWVyT2JqZWN0SWQsIGhlYXBTdHJpbmcpO1xyXG4gICAgICAgICAgICB3YXNtLl9mcmVlKGhlYXBTdHJpbmcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgbGFzdFRpbWUgPSBEYXRlLm5vdygpO1xyXG5cclxuICAgIGNvbnN0IGJhY2tncm91bmRHcmFkaWVudCA9IGNvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMCwgaGVpZ2h0KTtcclxuICAgIGJhY2tncm91bmRHcmFkaWVudC5hZGRDb2xvclN0b3AoMCwgXCIjY2JjNGQzXCIpO1xyXG4gICAgYmFja2dyb3VuZEdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUsIFwiI2Q4YzM5YlwiKTtcclxuICAgIGJhY2tncm91bmRHcmFkaWVudC5hZGRDb2xvclN0b3AoMSwgXCIjYjQ5ODYyXCIpO1xyXG4gICAgXHJcbiAgICB0aWNrKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gdGljaygpIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50VGltZSA9IERhdGUubm93KCk7XHJcbiAgICAgICAgY29uc3QgZGVsdGFUaW1lID0gY3VycmVudFRpbWUgLSBsYXN0VGltZTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBDcmVhdGUgR3JhZGllbnRcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGJhY2tncm91bmRHcmFkaWVudDtcclxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBPYmplY3Qua2V5cyhnYW1lT2JqZWN0cykuZm9yRWFjaCgoaykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBvYmogPSBnYW1lT2JqZWN0c1trXTtcclxuICAgICAgICAgICAgaWYgKCF3YXNtLl9Jc09iamVjdEFsaXZlKG9iai5pZCkpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBnYW1lT2JqZWN0c1trXTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZ2FtZU9iamVjdExvb2t1cFtvYmoudF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VyaWFsaXplZFN0cmluZyA9IHdhc20uX0dldE9iamVjdFNlcmlhbGl6ZWQob2JqLmlkKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGpzb25TdHJpbmcgPSB3YXNtLlVURjhUb1N0cmluZyhzZXJpYWxpemVkU3RyaW5nKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlcmlhbGl6ZWRPYmplY3QgPSBKU09OLnBhcnNlKGpzb25TdHJpbmcpO1xyXG4gICAgICAgICAgICAgICAgd2FzbS5fZnJlZShzZXJpYWxpemVkU3RyaW5nKTtcclxuICAgICAgICAgICAgICAgIGdhbWVPYmplY3RzW2tdID0gc2VyaWFsaXplZE9iamVjdDtcclxuICAgICAgICAgICAgICAgIGdhbWVPYmplY3RMb29rdXBbb2JqLnRdLmRyYXcoY29udGV4dCwgcmVzb3VyY2VNYW5hZ2VyLCBzZXJpYWxpemVkT2JqZWN0LCBnYW1lT2JqZWN0cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkIG9iamVjdCBjbGFzcycsIG9iai50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBMb2NhbCBTaW11bGF0aW9uXHJcbiAgICAgICAgICAgIGlmIChvYmouYykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmouYy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbGxpZGVyID0gb2JqLmNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbGxpZGVyLnQgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2VSZWN0KG9iai5wLnggKyBjb2xsaWRlci5wLngsIG9iai5wLnkgKyBjb2xsaWRlci5wLnksIGNvbGxpZGVyLnNpemUueCwgY29sbGlkZXIuc2l6ZS55KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoY29sbGlkZXIudCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmFyYyhvYmoucC54ICsgY29sbGlkZXIucC54LCBvYmoucC55ICsgY29sbGlkZXIucC55LCBjb2xsaWRlci5yYWRpdXMsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3Qua2V5cyhnYW1lT2JqZWN0cykuZm9yRWFjaCgoaykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBvYmogPSBnYW1lT2JqZWN0c1trXTtcclxuICAgICAgICAgICAgaWYgKGdhbWVPYmplY3RMb29rdXBbb2JqLnRdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChnYW1lT2JqZWN0TG9va3VwW29iai50XS5wb3N0RHJhdykge1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWVPYmplY3RMb29rdXBbb2JqLnRdLnBvc3REcmF3KGNvbnRleHQsIHJlc291cmNlTWFuYWdlciwgb2JqLCBnYW1lT2JqZWN0cyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkIG9iamVjdCBjbGFzcycsIG9iai50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxhc3RUaW1lID0gY3VycmVudFRpbWU7XHJcbiAgICAgICAgd2FzbS5fVGlja0dhbWUoY3VycmVudFRpbWUpO1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xyXG4gICAgICAgIGlmIChlLnJlcGVhdCkgeyByZXR1cm47IH1cclxuICAgICAgICBzZW5kSW5wdXRQYWNrZXQoe1xyXG4gICAgICAgICAgICBldmVudDogXCJrZFwiLFxyXG4gICAgICAgICAgICBrZXk6IGUua2V5XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBlID0+IHtcclxuICAgICAgICBzZW5kSW5wdXRQYWNrZXQoe1xyXG4gICAgICAgICAgICBldmVudDogXCJrdVwiLFxyXG4gICAgICAgICAgICBrZXk6IGUua2V5XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgbGFzdE1vdXNlTW92ZVNlbmQgPSBEYXRlLm5vdygpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGUgPT4ge1xyXG4gICAgICAgIC8vIFJhdGUgbGltaXQgdGhpcyEhXHJcbiAgICAgICAgY29uc3QgY3VycmVudCA9IERhdGUubm93KCk7XHJcbiAgICAgICAgaWYgKGN1cnJlbnQgLSBsYXN0TW91c2VNb3ZlU2VuZCA+IDMwKSB7XHJcbiAgICAgICAgICAgIGxhc3RNb3VzZU1vdmVTZW5kID0gY3VycmVudDtcclxuICAgICAgICAgICAgc2VuZElucHV0UGFja2V0KHtcclxuICAgICAgICAgICAgICAgIGV2ZW50OiBcIm1tXCIsXHJcbiAgICAgICAgICAgICAgICB4OiBlLnBhZ2VYLFxyXG4gICAgICAgICAgICAgICAgeTogZS5wYWdlWVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XHJcbiAgICAgICAgc2VuZElucHV0UGFja2V0KHtcclxuICAgICAgICAgICAgZXZlbnQ6IFwibWRcIixcclxuICAgICAgICAgICAgYnV0dG9uOiBlLndoaWNoXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGUgPT4ge1xyXG4gICAgICAgIHNlbmRJbnB1dFBhY2tldCh7XHJcbiAgICAgICAgICAgIGV2ZW50OiBcIm11XCIsXHJcbiAgICAgICAgICAgIGJ1dHRvbjogZS53aGljaFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9