
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
   loadPackage({"files": [{"filename": "/maps/map1.json", "start": 0, "end": 25756, "audio": 0}, {"filename": "/maps/map1.json.new", "start": 25756, "end": 51443, "audio": 0}, {"filename": "/maps/test-range.json", "start": 51443, "end": 53938, "audio": 0}, {"filename": "/maps/test-range.json.new", "start": 53938, "end": 56330, "audio": 0}, {"filename": "/maps/test.json", "start": 56330, "end": 56985, "audio": 0}, {"filename": "/textures/Artillery.png", "start": 56985, "end": 1174212, "audio": 0}, {"filename": "/textures/BulletTracer.png", "start": 1174212, "end": 1207979, "audio": 0}, {"filename": "/textures/Mountains.png", "start": 1207979, "end": 1284797, "audio": 0}, {"filename": "/textures/nightSkydome.png", "start": 1284797, "end": 11199862, "audio": 0}, {"filename": "/textures/sam_texture.jpg", "start": 11199862, "end": 12164636, "audio": 0}, {"filename": "/textures/Skydome.png", "start": 12164636, "end": 13624419, "audio": 0}, {"filename": "/textures/SolomonFace.jpg", "start": 13624419, "end": 14632231, "audio": 0}, {"filename": "/textures/uvmap.jpg", "start": 14632231, "end": 15613583, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_AmbientOcclusion.jpg", "start": 15613583, "end": 16213917, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Color.jpg", "start": 16213917, "end": 17635607, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Displacement.jpg", "start": 17635607, "end": 18020036, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Normal.jpg", "start": 18020036, "end": 19686591, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Roughness.jpg", "start": 19686591, "end": 20366684, "audio": 0}, {"filename": "/textures/BulletHole/BulletHole.png", "start": 20366684, "end": 20398888, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_AlbedoTransparency.png", "start": 20398888, "end": 20483104, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_MetallicSmoothness.png", "start": 20483104, "end": 20491244, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_Normal.png", "start": 20491244, "end": 20522612, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Color.jpg", "start": 20522612, "end": 21590085, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Displacement.jpg", "start": 21590085, "end": 22216506, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Normal.jpg", "start": 22216506, "end": 23386046, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Roughness.jpg", "start": 23386046, "end": 24019303, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Color.jpg", "start": 24019303, "end": 25089734, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Displacement.jpg", "start": 25089734, "end": 25712478, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Normal.jpg", "start": 25712478, "end": 28061624, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Roughness.jpg", "start": 28061624, "end": 28882383, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Color.jpg", "start": 28882383, "end": 30215814, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Displacement.jpg", "start": 30215814, "end": 30512650, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Emission.jpg", "start": 30512650, "end": 31843633, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Normal.jpg", "start": 31843633, "end": 33539994, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Roughness.jpg", "start": 33539994, "end": 34110856, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/LavaGrayscale.jpg", "start": 34110856, "end": 34693718, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Water.jpg", "start": 34693718, "end": 36129618, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Color.jpg", "start": 36129618, "end": 36395876, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Displacement.jpg", "start": 36395876, "end": 36656483, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Normal.jpg", "start": 36656483, "end": 37251840, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Opacity.jpg", "start": 37251840, "end": 37570318, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Roughness.jpg", "start": 37570318, "end": 37869739, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Color.jpg", "start": 37869739, "end": 38962723, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Displacement.jpg", "start": 38962723, "end": 39753283, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Normal.jpg", "start": 39753283, "end": 40093132, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Roughness.jpg", "start": 40093132, "end": 40673232, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Color.jpg", "start": 40673232, "end": 41380101, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Displacement.jpg", "start": 41380101, "end": 41809315, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Metalness.jpg", "start": 41809315, "end": 41939319, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Normal.jpg", "start": 41939319, "end": 43004861, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Roughness.jpg", "start": 43004861, "end": 43377138, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/MetalGreen.jpg", "start": 43377138, "end": 44118043, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Color.jpg", "start": 44118043, "end": 44492202, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Displacement.jpg", "start": 44492202, "end": 44629394, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Metalness.jpg", "start": 44629394, "end": 44800588, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Normal.jpg", "start": 44800588, "end": 45508515, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Roughness.jpg", "start": 45508515, "end": 45915408, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle1.png", "start": 45915408, "end": 45941180, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle2.png", "start": 45941180, "end": 45962548, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle3.png", "start": 45962548, "end": 45982997, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle4.png", "start": 45982997, "end": 46006298, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle5.png", "start": 46006298, "end": 46030494, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_AmbientOcclusion.jpg", "start": 46030494, "end": 46630623, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Color.jpg", "start": 46630623, "end": 48158084, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Displacement.jpg", "start": 48158084, "end": 48454881, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Normal.jpg", "start": 48454881, "end": 50747265, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Roughness.jpg", "start": 50747265, "end": 51412321, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_AO.png", "start": 51412321, "end": 51438813, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_BaseColor.png", "start": 51438813, "end": 52222833, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Normal.png", "start": 52222833, "end": 52893392, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Roughness.png", "start": 52893392, "end": 53161823, "audio": 0}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Color.jpg", "start": 53161823, "end": 54147458, "audio": 0}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Normal.jpg", "start": 54147458, "end": 55382726, "audio": 0}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_basecolor.jpg", "start": 55382726, "end": 55422537, "audio": 0}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_normal.jpg", "start": 55422537, "end": 55682794, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_AmbientOcclusion.jpg", "start": 55682794, "end": 56062515, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Color.jpg", "start": 56062515, "end": 56862596, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Displacement.jpg", "start": 56862596, "end": 57379491, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Normal.jpg", "start": 57379491, "end": 58403980, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Roughness.jpg", "start": 58403980, "end": 58778002, "audio": 0}, {"filename": "/models/Ammo.mtl", "start": 58778002, "end": 58778662, "audio": 0}, {"filename": "/models/Ammo.obj", "start": 58778662, "end": 58806202, "audio": 0}, {"filename": "/models/Arrow.mtl", "start": 58806202, "end": 58806866, "audio": 0}, {"filename": "/models/Arrow.obj", "start": 58806866, "end": 58813555, "audio": 0}, {"filename": "/models/Artillery.mtl", "start": 58813555, "end": 58813846, "audio": 0}, {"filename": "/models/Artillery.obj", "start": 58813846, "end": 60469284, "audio": 0}, {"filename": "/models/ArtilleryIndicator.mtl", "start": 60469284, "end": 60469536, "audio": 0}, {"filename": "/models/ArtilleryIndicator.obj", "start": 60469536, "end": 60515962, "audio": 0}, {"filename": "/models/BombCrate.mtl", "start": 60515962, "end": 60516327, "audio": 0}, {"filename": "/models/BombCrate.obj", "start": 60516327, "end": 60517418, "audio": 0}, {"filename": "/models/Bow.mtl", "start": 60517418, "end": 60518080, "audio": 0}, {"filename": "/models/Bow.obj", "start": 60518080, "end": 60531675, "audio": 0}, {"filename": "/models/Bullet.mtl", "start": 60531675, "end": 60531916, "audio": 0}, {"filename": "/models/Bullet.obj", "start": 60531916, "end": 60560185, "audio": 0}, {"filename": "/models/BulletTracer.mtl", "start": 60560185, "end": 60560466, "audio": 0}, {"filename": "/models/BulletTracer.obj", "start": 60560466, "end": 60569895, "audio": 0}, {"filename": "/models/Cone.mtl", "start": 60569895, "end": 60570025, "audio": 0}, {"filename": "/models/Cone.obj", "start": 60570025, "end": 60580059, "audio": 0}, {"filename": "/models/Cube.mtl", "start": 60580059, "end": 60580288, "audio": 0}, {"filename": "/models/Cube.obj", "start": 60580288, "end": 60581315, "audio": 0}, {"filename": "/models/Cylinder.obj", "start": 60581315, "end": 60586966, "audio": 0}, {"filename": "/models/Explosion.mtl", "start": 60586966, "end": 60587387, "audio": 0}, {"filename": "/models/Explosion.obj", "start": 60587387, "end": 61255025, "audio": 0}, {"filename": "/models/FlatWorld.mtl", "start": 61255025, "end": 61255265, "audio": 0}, {"filename": "/models/FlatWorld.obj", "start": 61255265, "end": 61256328, "audio": 0}, {"filename": "/models/Grenade.mtl", "start": 61256328, "end": 61256927, "audio": 0}, {"filename": "/models/Grenade.obj", "start": 61256927, "end": 61503886, "audio": 0}, {"filename": "/models/Heaven.mtl", "start": 61503886, "end": 61505042, "audio": 0}, {"filename": "/models/Heaven.obj", "start": 61505042, "end": 61786309, "audio": 0}, {"filename": "/models/HookThrower.mtl", "start": 61786309, "end": 61786674, "audio": 0}, {"filename": "/models/HookThrower.obj", "start": 61786674, "end": 61789033, "audio": 0}, {"filename": "/models/Icosphere.mtl", "start": 61789033, "end": 61789258, "audio": 0}, {"filename": "/models/Icosphere.obj", "start": 61789258, "end": 61904917, "audio": 0}, {"filename": "/models/island.obj", "start": 61904917, "end": 63337491, "audio": 0}, {"filename": "/models/Lift.mtl", "start": 63337491, "end": 63337730, "audio": 0}, {"filename": "/models/Lift.obj", "start": 63337730, "end": 63352880, "audio": 0}, {"filename": "/models/MachineGun.mtl", "start": 63352880, "end": 63354167, "audio": 0}, {"filename": "/models/MachineGun.obj", "start": 63354167, "end": 63503704, "audio": 0}, {"filename": "/models/Medkit.mtl", "start": 63503704, "end": 63504190, "audio": 0}, {"filename": "/models/Medkit.obj", "start": 63504190, "end": 63518522, "audio": 0}, {"filename": "/models/NewPlayer.mtl", "start": 63518522, "end": 63519290, "audio": 0}, {"filename": "/models/NewPlayer.obj", "start": 63519290, "end": 63571612, "audio": 0}, {"filename": "/models/Pistol.mtl", "start": 63571612, "end": 63572158, "audio": 0}, {"filename": "/models/Pistol.obj", "start": 63572158, "end": 63596044, "audio": 0}, {"filename": "/models/Plane.mtl", "start": 63596044, "end": 63596168, "audio": 0}, {"filename": "/models/Plane.obj", "start": 63596168, "end": 63596508, "audio": 0}, {"filename": "/models/Player.mtl", "start": 63596508, "end": 63596748, "audio": 0}, {"filename": "/models/Player.obj", "start": 63596748, "end": 64368871, "audio": 0}, {"filename": "/models/PlayerMarkerMinimap.mtl", "start": 64368871, "end": 64369121, "audio": 0}, {"filename": "/models/PlayerMarkerMinimap.obj", "start": 64369121, "end": 64369525, "audio": 0}, {"filename": "/models/Portal.mtl", "start": 64369525, "end": 64369948, "audio": 0}, {"filename": "/models/Portal.obj", "start": 64369948, "end": 64398246, "audio": 0}, {"filename": "/models/Quad.obj", "start": 64398246, "end": 64398590, "audio": 0}, {"filename": "/models/Rifle.mtl", "start": 64398590, "end": 64399075, "audio": 0}, {"filename": "/models/Rifle.obj", "start": 64399075, "end": 64422803, "audio": 0}, {"filename": "/models/ShootingRange.mtl", "start": 64422803, "end": 64426528, "audio": 0}, {"filename": "/models/ShootingRange.obj", "start": 64426528, "end": 69550325, "audio": 0}, {"filename": "/models/Shotgun.mtl", "start": 69550325, "end": 69550998, "audio": 0}, {"filename": "/models/Shotgun.obj", "start": 69550998, "end": 69580945, "audio": 0}, {"filename": "/models/SmokeGrenade.mtl", "start": 69580945, "end": 69581366, "audio": 0}, {"filename": "/models/SmokeGrenade.obj", "start": 69581366, "end": 69730466, "audio": 0}, {"filename": "/models/SpectatorArea.mtl", "start": 69730466, "end": 69730710, "audio": 0}, {"filename": "/models/SpectatorArea.obj", "start": 69730710, "end": 69733116, "audio": 0}, {"filename": "/models/StreetLamp.mtl", "start": 69733116, "end": 69733414, "audio": 0}, {"filename": "/models/StreetLamp.obj", "start": 69733414, "end": 69772879, "audio": 0}, {"filename": "/models/SubmachineGun.mtl", "start": 69772879, "end": 69773821, "audio": 0}, {"filename": "/models/SubmachineGun.obj", "start": 69773821, "end": 69809884, "audio": 0}, {"filename": "/models/suzanne.obj", "start": 69809884, "end": 69888640, "audio": 0}, {"filename": "/models/Warehouse.mtl", "start": 69888640, "end": 69891896, "audio": 0}, {"filename": "/models/Warehouse.obj", "start": 69891896, "end": 70189595, "audio": 0}, {"filename": "/shaders/Antialias.fs", "start": 70189595, "end": 70190175, "audio": 0}, {"filename": "/shaders/BloomHighPass.fs", "start": 70190175, "end": 70190696, "audio": 0}, {"filename": "/shaders/Debug.fs", "start": 70190696, "end": 70190799, "audio": 0}, {"filename": "/shaders/Debug.vs", "start": 70190799, "end": 70191011, "audio": 0}, {"filename": "/shaders/FXAA.fs", "start": 70191011, "end": 70194659, "audio": 0}, {"filename": "/shaders/GaussianBlur.fs", "start": 70194659, "end": 70195692, "audio": 0}, {"filename": "/shaders/Mesh.fs", "start": 70195692, "end": 70206074, "audio": 0}, {"filename": "/shaders/Mesh.vs", "start": 70206074, "end": 70207314, "audio": 0}, {"filename": "/shaders/MeshDeferred.fs", "start": 70207314, "end": 70209507, "audio": 0}, {"filename": "/shaders/MeshLighting.fs", "start": 70209507, "end": 70217644, "audio": 0}, {"filename": "/shaders/MeshLighting.vs", "start": 70217644, "end": 70218240, "audio": 0}, {"filename": "/shaders/MeshLightingDirectionalLight.fs", "start": 70218240, "end": 70218639, "audio": 0}, {"filename": "/shaders/MeshLightingPointLight.fs", "start": 70218639, "end": 70219156, "audio": 0}, {"filename": "/shaders/MeshLightingRectangleLight.fs", "start": 70219156, "end": 70220062, "audio": 0}, {"filename": "/shaders/Minimap.fs", "start": 70220062, "end": 70220763, "audio": 0}, {"filename": "/shaders/Quad.fs", "start": 70220763, "end": 70221377, "audio": 0}, {"filename": "/shaders/Quad.vs", "start": 70221377, "end": 70221600, "audio": 0}, {"filename": "/shaders/ShadowMap.fs", "start": 70221600, "end": 70221717, "audio": 0}, {"filename": "/shaders/ShadowMap.vs", "start": 70221717, "end": 70221931, "audio": 0}, {"filename": "/shaders/Skydome.fs", "start": 70221931, "end": 70223163, "audio": 0}, {"filename": "/shaders/ToneMapping.fs", "start": 70223163, "end": 70223698, "audio": 0}, {"filename": "/sounds/bang.wav", "start": 70223698, "end": 70351284, "audio": 1}, {"filename": "/sounds/boom-old1.wav", "start": 70351284, "end": 70423008, "audio": 1}, {"filename": "/sounds/boom.wav", "start": 70423008, "end": 70494732, "audio": 1}, {"filename": "/sounds/GrenadeOut.wav", "start": 70494732, "end": 70574648, "audio": 1}, {"filename": "/sounds/HookReel.wav", "start": 70574648, "end": 70633060, "audio": 1}, {"filename": "/sounds/HookThrow.wav", "start": 70633060, "end": 70660752, "audio": 1}, {"filename": "/sounds/incoming.wav", "start": 70660752, "end": 70815474, "audio": 1}, {"filename": "/sounds/PortalEnd.wav", "start": 70815474, "end": 70887198, "audio": 1}, {"filename": "/sounds/PortalStart.wav", "start": 70887198, "end": 70959946, "audio": 1}, {"filename": "/sounds/reload.wav", "start": 70959946, "end": 71073654, "audio": 1}, {"filename": "/sounds/ueh.wav", "start": 71073654, "end": 71108514, "audio": 1}, {"filename": "/sounds/Archer/arrow-jump.wav", "start": 71108514, "end": 71378962, "audio": 1}, {"filename": "/sounds/Archer/arrow-pullback.wav", "start": 71378962, "end": 71526534, "audio": 1}, {"filename": "/sounds/Archer/arrow-shoot.wav", "start": 71526534, "end": 71641334, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-activate.wav", "start": 71641334, "end": 71965038, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-shoot.wav", "start": 71965038, "end": 72116708, "audio": 1}, {"filename": "/scripts/Explosion.w", "start": 72116708, "end": 72117384, "audio": 0}, {"filename": "/scripts/Math.w", "start": 72117384, "end": 72117470, "audio": 0}, {"filename": "/scripts/Object.w", "start": 72117470, "end": 72119090, "audio": 0}, {"filename": "/scripts/SmokeExplosion.w", "start": 72119090, "end": 72119899, "audio": 0}, {"filename": "/scripts/Test.w", "start": 72119899, "end": 72120211, "audio": 0}, {"filename": "/scripts/Types.w", "start": 72120211, "end": 72121606, "audio": 0}], "remote_package_size": 72121606, "package_uuid": "8200e9ac-f680-4504-8026-c7f74553701f"});
  
  })();
  