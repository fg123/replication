
  var Module = typeof Module !== 'undefined' ? Module : {};
  
  if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
  }
  Module.expectedDataFileDownloads++;
  (function() {
   var loadPackage = function(metadata) {
  
      var PACKAGE_PATH;
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
      } else if (typeof location !== 'undefined') {
        // worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
      } else {
        throw 'using preloaded data can only be done on a web page or in a web worker';
      }
      var PACKAGE_NAME = '../client/dist/game_client.data';
      var REMOTE_PACKAGE_BASE = 'game_client.data';
      if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
        Module['locateFile'] = Module['locateFilePackage'];
        err('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
      }
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
    
      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];
      var PACKAGE_UUID = metadata['package_uuid'];
    
      function fetchRemotePackage(packageName, packageSize, callback, errback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', packageName, true);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = function(event) {
          var url = packageName;
          var size = packageSize;
          if (event.total) size = event.total;
          if (event.loaded) {
            if (!xhr.addedTotal) {
              xhr.addedTotal = true;
              if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
              Module.dataFileDownloads[url] = {
                loaded: event.loaded,
                total: size
              };
            } else {
              Module.dataFileDownloads[url].loaded = event.loaded;
            }
            var total = 0;
            var loaded = 0;
            var num = 0;
            for (var download in Module.dataFileDownloads) {
            var data = Module.dataFileDownloads[download];
              total += data.total;
              loaded += data.loaded;
              num++;
            }
            total = Math.ceil(total * Module.expectedDataFileDownloads/num);
            if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
          } else if (!Module.dataFileDownloads) {
            if (Module['setStatus']) Module['setStatus']('Downloading data...');
          }
        };
        xhr.onerror = function(event) {
          throw new Error("NetworkError for: " + packageName);
        }
        xhr.onload = function(event) {
          if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            var packageData = xhr.response;
            callback(packageData);
          } else {
            throw new Error(xhr.statusText + " : " + xhr.responseURL);
          }
        };
        xhr.send(null);
      };

      function handleError(error) {
        console.error('package error:', error);
      };
    
        var fetchedCallback = null;
        var fetched = Module['getPreloadedPackage'] ? Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;

        if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
          if (fetchedCallback) {
            fetchedCallback(data);
            fetchedCallback = null;
          } else {
            fetched = data;
          }
        }, handleError);
      
    function runWithFS() {
  
      function assert(check, msg) {
        if (!check) throw msg + new Error().stack;
      }
  Module['FS_createPath']('/', 'maps', true, true);
Module['FS_createPath']('/', 'textures', true, true);
Module['FS_createPath']('/textures', 'Bricks059_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'BulletHole', true, true);
Module['FS_createPath']('/textures', 'CardboardBox', true, true);
Module['FS_createPath']('/textures', 'Concrete036_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'Fabric032_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'Lava004_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'Leaking003_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'Marble012_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'Metal038_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'MetalPlates007_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'MuzzleFlash', true, true);
Module['FS_createPath']('/textures', 'Rock029_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'WetFloor', true, true);
Module['FS_createPath']('/textures', 'Wood026_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'WoodenCrate', true, true);
Module['FS_createPath']('/textures', 'WoodFloor040_1K-JPG', true, true);
Module['FS_createPath']('/', 'models', true, true);
Module['FS_createPath']('/', 'shaders', true, true);
Module['FS_createPath']('/', 'sounds', true, true);
Module['FS_createPath']('/sounds', 'Archer', true, true);
Module['FS_createPath']('/', 'scripts', true, true);

      /** @constructor */
      function DataRequest(start, end, audio) {
        this.start = start;
        this.end = end;
        this.audio = audio;
      }
      DataRequest.prototype = {
        requests: {},
        open: function(mode, name) {
          this.name = name;
          this.requests[name] = this;
          Module['addRunDependency']('fp ' + this.name);
        },
        send: function() {},
        onload: function() {
          var byteArray = this.byteArray.subarray(this.start, this.end);
          this.finish(byteArray);
        },
        finish: function(byteArray) {
          var that = this;
  
          Module['FS_createDataFile'](this.name, null, byteArray, true, true, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
          Module['removeRunDependency']('fp ' + that.name);
  
          this.requests[this.name] = null;
        }
      };
  
          var files = metadata['files'];
          for (var i = 0; i < files.length; ++i) {
            new DataRequest(files[i]['start'], files[i]['end'], files[i]['audio']).open('GET', files[i]['filename']);
          }
  
    
      function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        
          // Reuse the bytearray from the XHR as the source for file reads.
          DataRequest.prototype.byteArray = byteArray;
    
            var files = metadata['files'];
            for (var i = 0; i < files.length; ++i) {
              DataRequest.prototype.requests[files[i].filename].onload();
            }
                Module['removeRunDependency']('datafile_../client/dist/game_client.data');

      };
      Module['addRunDependency']('datafile_../client/dist/game_client.data');
    
      if (!Module.preloadResults) Module.preloadResults = {};
    
        Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
        if (fetched) {
          processPackageData(fetched);
          fetched = null;
        } else {
          fetchedCallback = processPackageData;
        }
      
    }
    if (Module['calledRun']) {
      runWithFS();
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
    }
  
   }
   loadPackage({"files": [{"filename": "/maps/map1.json", "start": 0, "end": 24916, "audio": 0}, {"filename": "/maps/map1.json.new", "start": 24916, "end": 51323, "audio": 0}, {"filename": "/maps/test-range.json", "start": 51323, "end": 53818, "audio": 0}, {"filename": "/maps/test-range.json.new", "start": 53818, "end": 56210, "audio": 0}, {"filename": "/maps/test.json", "start": 56210, "end": 56865, "audio": 0}, {"filename": "/textures/Artillery.png", "start": 56865, "end": 1174092, "audio": 0}, {"filename": "/textures/BulletTracer.png", "start": 1174092, "end": 1207859, "audio": 0}, {"filename": "/textures/Mountains.png", "start": 1207859, "end": 1284677, "audio": 0}, {"filename": "/textures/nightSkydome.png", "start": 1284677, "end": 11199742, "audio": 0}, {"filename": "/textures/sam_texture.jpg", "start": 11199742, "end": 12164516, "audio": 0}, {"filename": "/textures/Skydome.png", "start": 12164516, "end": 13624299, "audio": 0}, {"filename": "/textures/SolomonFace.jpg", "start": 13624299, "end": 14632111, "audio": 0}, {"filename": "/textures/SupplyBinCover.png", "start": 14632111, "end": 14638201, "audio": 0}, {"filename": "/textures/uvmap.jpg", "start": 14638201, "end": 15619553, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_AmbientOcclusion.jpg", "start": 15619553, "end": 16219887, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Color.jpg", "start": 16219887, "end": 17641577, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Displacement.jpg", "start": 17641577, "end": 18026006, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Normal.jpg", "start": 18026006, "end": 19692561, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Roughness.jpg", "start": 19692561, "end": 20372654, "audio": 0}, {"filename": "/textures/BulletHole/BulletHole.png", "start": 20372654, "end": 20404858, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_AlbedoTransparency.png", "start": 20404858, "end": 20489074, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_MetallicSmoothness.png", "start": 20489074, "end": 20497214, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_Normal.png", "start": 20497214, "end": 20528582, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Color.jpg", "start": 20528582, "end": 21596055, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Displacement.jpg", "start": 21596055, "end": 22222476, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Normal.jpg", "start": 22222476, "end": 23392016, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Roughness.jpg", "start": 23392016, "end": 24025273, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Color.jpg", "start": 24025273, "end": 25095704, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Displacement.jpg", "start": 25095704, "end": 25718448, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Normal.jpg", "start": 25718448, "end": 28067594, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Roughness.jpg", "start": 28067594, "end": 28888353, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Color.jpg", "start": 28888353, "end": 30221784, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Displacement.jpg", "start": 30221784, "end": 30518620, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Emission.jpg", "start": 30518620, "end": 31849603, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Normal.jpg", "start": 31849603, "end": 33545964, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Roughness.jpg", "start": 33545964, "end": 34116826, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/LavaGrayscale.jpg", "start": 34116826, "end": 34699688, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Water.jpg", "start": 34699688, "end": 36135588, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Color.jpg", "start": 36135588, "end": 36401846, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Displacement.jpg", "start": 36401846, "end": 36662453, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Normal.jpg", "start": 36662453, "end": 37257810, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Opacity.jpg", "start": 37257810, "end": 37576288, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Roughness.jpg", "start": 37576288, "end": 37875709, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Color.jpg", "start": 37875709, "end": 38968693, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Displacement.jpg", "start": 38968693, "end": 39759253, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Normal.jpg", "start": 39759253, "end": 40099102, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Roughness.jpg", "start": 40099102, "end": 40679202, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Color.jpg", "start": 40679202, "end": 41386071, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Displacement.jpg", "start": 41386071, "end": 41815285, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Metalness.jpg", "start": 41815285, "end": 41945289, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Normal.jpg", "start": 41945289, "end": 43010831, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Roughness.jpg", "start": 43010831, "end": 43383108, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/MetalGreen.jpg", "start": 43383108, "end": 44124013, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Color.jpg", "start": 44124013, "end": 44498172, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Displacement.jpg", "start": 44498172, "end": 44635364, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Metalness.jpg", "start": 44635364, "end": 44806558, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Normal.jpg", "start": 44806558, "end": 45514485, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Roughness.jpg", "start": 45514485, "end": 45921378, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle1.png", "start": 45921378, "end": 45947150, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle2.png", "start": 45947150, "end": 45968518, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle3.png", "start": 45968518, "end": 45988967, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle4.png", "start": 45988967, "end": 46012268, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle5.png", "start": 46012268, "end": 46036464, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_AmbientOcclusion.jpg", "start": 46036464, "end": 46636593, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Color.jpg", "start": 46636593, "end": 48164054, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Displacement.jpg", "start": 48164054, "end": 48460851, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Normal.jpg", "start": 48460851, "end": 50753235, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Roughness.jpg", "start": 50753235, "end": 51418291, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_AO.png", "start": 51418291, "end": 51444783, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_BaseColor.png", "start": 51444783, "end": 52228803, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Normal.png", "start": 52228803, "end": 52899362, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Roughness.png", "start": 52899362, "end": 53167793, "audio": 0}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Color.jpg", "start": 53167793, "end": 54153428, "audio": 0}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Normal.jpg", "start": 54153428, "end": 55388696, "audio": 0}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_basecolor.jpg", "start": 55388696, "end": 55428507, "audio": 0}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_normal.jpg", "start": 55428507, "end": 55688764, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_AmbientOcclusion.jpg", "start": 55688764, "end": 56068485, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Color.jpg", "start": 56068485, "end": 56868566, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Displacement.jpg", "start": 56868566, "end": 57385461, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Normal.jpg", "start": 57385461, "end": 58409950, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Roughness.jpg", "start": 58409950, "end": 58783972, "audio": 0}, {"filename": "/models/Ammo.mtl", "start": 58783972, "end": 58784632, "audio": 0}, {"filename": "/models/Ammo.obj", "start": 58784632, "end": 58812172, "audio": 0}, {"filename": "/models/Arrow.mtl", "start": 58812172, "end": 58812836, "audio": 0}, {"filename": "/models/Arrow.obj", "start": 58812836, "end": 58819525, "audio": 0}, {"filename": "/models/Artillery.mtl", "start": 58819525, "end": 58819816, "audio": 0}, {"filename": "/models/Artillery.obj", "start": 58819816, "end": 60475254, "audio": 0}, {"filename": "/models/ArtilleryIndicator.mtl", "start": 60475254, "end": 60475506, "audio": 0}, {"filename": "/models/ArtilleryIndicator.obj", "start": 60475506, "end": 60521932, "audio": 0}, {"filename": "/models/BombCrate.mtl", "start": 60521932, "end": 60522297, "audio": 0}, {"filename": "/models/BombCrate.obj", "start": 60522297, "end": 60523388, "audio": 0}, {"filename": "/models/Bow.mtl", "start": 60523388, "end": 60524050, "audio": 0}, {"filename": "/models/Bow.obj", "start": 60524050, "end": 60537645, "audio": 0}, {"filename": "/models/Bullet.mtl", "start": 60537645, "end": 60537886, "audio": 0}, {"filename": "/models/Bullet.obj", "start": 60537886, "end": 60566155, "audio": 0}, {"filename": "/models/BulletTracer.mtl", "start": 60566155, "end": 60566436, "audio": 0}, {"filename": "/models/BulletTracer.obj", "start": 60566436, "end": 60575865, "audio": 0}, {"filename": "/models/Cone.mtl", "start": 60575865, "end": 60575995, "audio": 0}, {"filename": "/models/Cone.obj", "start": 60575995, "end": 60586029, "audio": 0}, {"filename": "/models/Cube.mtl", "start": 60586029, "end": 60586258, "audio": 0}, {"filename": "/models/Cube.obj", "start": 60586258, "end": 60587285, "audio": 0}, {"filename": "/models/Cylinder.obj", "start": 60587285, "end": 60592936, "audio": 0}, {"filename": "/models/Explosion.mtl", "start": 60592936, "end": 60593357, "audio": 0}, {"filename": "/models/Explosion.obj", "start": 60593357, "end": 61260995, "audio": 0}, {"filename": "/models/FlatWorld.mtl", "start": 61260995, "end": 61261235, "audio": 0}, {"filename": "/models/FlatWorld.obj", "start": 61261235, "end": 61262298, "audio": 0}, {"filename": "/models/Grenade.mtl", "start": 61262298, "end": 61262897, "audio": 0}, {"filename": "/models/Grenade.obj", "start": 61262897, "end": 61509856, "audio": 0}, {"filename": "/models/Heaven.mtl", "start": 61509856, "end": 61511012, "audio": 0}, {"filename": "/models/Heaven.obj", "start": 61511012, "end": 61792279, "audio": 0}, {"filename": "/models/HookThrower.mtl", "start": 61792279, "end": 61792644, "audio": 0}, {"filename": "/models/HookThrower.obj", "start": 61792644, "end": 61795003, "audio": 0}, {"filename": "/models/Icosphere.mtl", "start": 61795003, "end": 61795228, "audio": 0}, {"filename": "/models/Icosphere.obj", "start": 61795228, "end": 61910887, "audio": 0}, {"filename": "/models/island.obj", "start": 61910887, "end": 63343461, "audio": 0}, {"filename": "/models/Lift.mtl", "start": 63343461, "end": 63343700, "audio": 0}, {"filename": "/models/Lift.obj", "start": 63343700, "end": 63358850, "audio": 0}, {"filename": "/models/MachineGun.mtl", "start": 63358850, "end": 63360137, "audio": 0}, {"filename": "/models/MachineGun.obj", "start": 63360137, "end": 63509674, "audio": 0}, {"filename": "/models/Medkit.mtl", "start": 63509674, "end": 63510160, "audio": 0}, {"filename": "/models/Medkit.obj", "start": 63510160, "end": 63524492, "audio": 0}, {"filename": "/models/NewPlayer.mtl", "start": 63524492, "end": 63525260, "audio": 0}, {"filename": "/models/NewPlayer.obj", "start": 63525260, "end": 63577582, "audio": 0}, {"filename": "/models/Pistol.mtl", "start": 63577582, "end": 63578128, "audio": 0}, {"filename": "/models/Pistol.obj", "start": 63578128, "end": 63602014, "audio": 0}, {"filename": "/models/Plane.mtl", "start": 63602014, "end": 63602138, "audio": 0}, {"filename": "/models/Plane.obj", "start": 63602138, "end": 63602478, "audio": 0}, {"filename": "/models/Player.mtl", "start": 63602478, "end": 63602718, "audio": 0}, {"filename": "/models/Player.obj", "start": 63602718, "end": 64374841, "audio": 0}, {"filename": "/models/PlayerMarkerMinimap.mtl", "start": 64374841, "end": 64375091, "audio": 0}, {"filename": "/models/PlayerMarkerMinimap.obj", "start": 64375091, "end": 64375495, "audio": 0}, {"filename": "/models/Portal.mtl", "start": 64375495, "end": 64375918, "audio": 0}, {"filename": "/models/Portal.obj", "start": 64375918, "end": 64404216, "audio": 0}, {"filename": "/models/Quad.obj", "start": 64404216, "end": 64404560, "audio": 0}, {"filename": "/models/Rifle.mtl", "start": 64404560, "end": 64405045, "audio": 0}, {"filename": "/models/Rifle.obj", "start": 64405045, "end": 64428773, "audio": 0}, {"filename": "/models/ShootingRange.mtl", "start": 64428773, "end": 64432498, "audio": 0}, {"filename": "/models/ShootingRange.obj", "start": 64432498, "end": 69556295, "audio": 0}, {"filename": "/models/Shotgun.mtl", "start": 69556295, "end": 69556968, "audio": 0}, {"filename": "/models/Shotgun.obj", "start": 69556968, "end": 69586915, "audio": 0}, {"filename": "/models/SmokeGrenade.mtl", "start": 69586915, "end": 69587336, "audio": 0}, {"filename": "/models/SmokeGrenade.obj", "start": 69587336, "end": 69736436, "audio": 0}, {"filename": "/models/SpectatorArea.mtl", "start": 69736436, "end": 69736680, "audio": 0}, {"filename": "/models/SpectatorArea.obj", "start": 69736680, "end": 69739086, "audio": 0}, {"filename": "/models/StreetLamp.mtl", "start": 69739086, "end": 69739384, "audio": 0}, {"filename": "/models/StreetLamp.obj", "start": 69739384, "end": 69778849, "audio": 0}, {"filename": "/models/SubmachineGun.mtl", "start": 69778849, "end": 69779791, "audio": 0}, {"filename": "/models/SubmachineGun.obj", "start": 69779791, "end": 69815854, "audio": 0}, {"filename": "/models/SupplyBin.mtl", "start": 69815854, "end": 69816277, "audio": 0}, {"filename": "/models/SupplyBin.obj", "start": 69816277, "end": 69827888, "audio": 0}, {"filename": "/models/SupplyBinLid.mtl", "start": 69827888, "end": 69828165, "audio": 0}, {"filename": "/models/SupplyBinLid.obj", "start": 69828165, "end": 69833046, "audio": 0}, {"filename": "/models/suzanne.obj", "start": 69833046, "end": 69911802, "audio": 0}, {"filename": "/models/Warehouse.mtl", "start": 69911802, "end": 69915058, "audio": 0}, {"filename": "/models/Warehouse.obj", "start": 69915058, "end": 70212757, "audio": 0}, {"filename": "/shaders/Antialias.fs", "start": 70212757, "end": 70213337, "audio": 0}, {"filename": "/shaders/BloomHighPass.fs", "start": 70213337, "end": 70213858, "audio": 0}, {"filename": "/shaders/Debug.fs", "start": 70213858, "end": 70213961, "audio": 0}, {"filename": "/shaders/Debug.vs", "start": 70213961, "end": 70214173, "audio": 0}, {"filename": "/shaders/FXAA.fs", "start": 70214173, "end": 70217821, "audio": 0}, {"filename": "/shaders/GaussianBlur.fs", "start": 70217821, "end": 70218854, "audio": 0}, {"filename": "/shaders/Mesh.fs", "start": 70218854, "end": 70229236, "audio": 0}, {"filename": "/shaders/Mesh.vs", "start": 70229236, "end": 70230476, "audio": 0}, {"filename": "/shaders/MeshDeferred.fs", "start": 70230476, "end": 70232669, "audio": 0}, {"filename": "/shaders/MeshLighting.fs", "start": 70232669, "end": 70240806, "audio": 0}, {"filename": "/shaders/MeshLighting.vs", "start": 70240806, "end": 70241402, "audio": 0}, {"filename": "/shaders/MeshLightingDirectionalLight.fs", "start": 70241402, "end": 70241801, "audio": 0}, {"filename": "/shaders/MeshLightingPointLight.fs", "start": 70241801, "end": 70242318, "audio": 0}, {"filename": "/shaders/MeshLightingRectangleLight.fs", "start": 70242318, "end": 70243224, "audio": 0}, {"filename": "/shaders/Minimap.fs", "start": 70243224, "end": 70243925, "audio": 0}, {"filename": "/shaders/Quad.fs", "start": 70243925, "end": 70244539, "audio": 0}, {"filename": "/shaders/Quad.vs", "start": 70244539, "end": 70244762, "audio": 0}, {"filename": "/shaders/ShadowMap.fs", "start": 70244762, "end": 70244879, "audio": 0}, {"filename": "/shaders/ShadowMap.vs", "start": 70244879, "end": 70245093, "audio": 0}, {"filename": "/shaders/Skydome.fs", "start": 70245093, "end": 70246325, "audio": 0}, {"filename": "/shaders/ToneMapping.fs", "start": 70246325, "end": 70246860, "audio": 0}, {"filename": "/sounds/bang.wav", "start": 70246860, "end": 70374446, "audio": 1}, {"filename": "/sounds/boom-old1.wav", "start": 70374446, "end": 70446170, "audio": 1}, {"filename": "/sounds/boom.wav", "start": 70446170, "end": 70517894, "audio": 1}, {"filename": "/sounds/GrenadeOut.wav", "start": 70517894, "end": 70597810, "audio": 1}, {"filename": "/sounds/HookReel.wav", "start": 70597810, "end": 70656222, "audio": 1}, {"filename": "/sounds/HookThrow.wav", "start": 70656222, "end": 70683914, "audio": 1}, {"filename": "/sounds/incoming.wav", "start": 70683914, "end": 70838636, "audio": 1}, {"filename": "/sounds/PortalEnd.wav", "start": 70838636, "end": 70910360, "audio": 1}, {"filename": "/sounds/PortalStart.wav", "start": 70910360, "end": 70983108, "audio": 1}, {"filename": "/sounds/reload.wav", "start": 70983108, "end": 71096816, "audio": 1}, {"filename": "/sounds/ueh.wav", "start": 71096816, "end": 71131676, "audio": 1}, {"filename": "/sounds/Archer/arrow-jump.wav", "start": 71131676, "end": 71402124, "audio": 1}, {"filename": "/sounds/Archer/arrow-pullback.wav", "start": 71402124, "end": 71549696, "audio": 1}, {"filename": "/sounds/Archer/arrow-shoot.wav", "start": 71549696, "end": 71664496, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-activate.wav", "start": 71664496, "end": 71988200, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-shoot.wav", "start": 71988200, "end": 72139870, "audio": 1}, {"filename": "/scripts/1-Types.w", "start": 72139870, "end": 72141963, "audio": 0}, {"filename": "/scripts/2-Object.w", "start": 72141963, "end": 72144256, "audio": 0}, {"filename": "/scripts/3-Math.w", "start": 72144256, "end": 72144342, "audio": 0}, {"filename": "/scripts/BouncingBall.w", "start": 72144342, "end": 72144982, "audio": 0}, {"filename": "/scripts/Explosion.w", "start": 72144982, "end": 72145658, "audio": 0}, {"filename": "/scripts/SmokeExplosion.w", "start": 72145658, "end": 72146453, "audio": 0}, {"filename": "/scripts/SmokeGrenade.w", "start": 72146453, "end": 72146903, "audio": 0}, {"filename": "/scripts/Test.w", "start": 72146903, "end": 72146994, "audio": 0}], "remote_package_size": 72146994, "package_uuid": "d47f0320-30b8-47eb-b980-70329f8c4b0a"});
  
  })();
  