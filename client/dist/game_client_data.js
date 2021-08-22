
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
   loadPackage({"files": [{"filename": "/maps/map1.json", "start": 0, "end": 25728, "audio": 0}, {"filename": "/maps/map1.json.new", "start": 25728, "end": 51415, "audio": 0}, {"filename": "/maps/test-range.json", "start": 51415, "end": 53910, "audio": 0}, {"filename": "/maps/test-range.json.new", "start": 53910, "end": 56302, "audio": 0}, {"filename": "/maps/test.json", "start": 56302, "end": 56957, "audio": 0}, {"filename": "/textures/Artillery.png", "start": 56957, "end": 1174184, "audio": 0}, {"filename": "/textures/BulletTracer.png", "start": 1174184, "end": 1207951, "audio": 0}, {"filename": "/textures/Mountains.png", "start": 1207951, "end": 1284769, "audio": 0}, {"filename": "/textures/nightSkydome.png", "start": 1284769, "end": 11199834, "audio": 0}, {"filename": "/textures/sam_texture.jpg", "start": 11199834, "end": 12164608, "audio": 0}, {"filename": "/textures/Skydome.png", "start": 12164608, "end": 13624391, "audio": 0}, {"filename": "/textures/SolomonFace.jpg", "start": 13624391, "end": 14632203, "audio": 0}, {"filename": "/textures/uvmap.jpg", "start": 14632203, "end": 15613555, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_AmbientOcclusion.jpg", "start": 15613555, "end": 16213889, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Color.jpg", "start": 16213889, "end": 17635579, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Displacement.jpg", "start": 17635579, "end": 18020008, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Normal.jpg", "start": 18020008, "end": 19686563, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Roughness.jpg", "start": 19686563, "end": 20366656, "audio": 0}, {"filename": "/textures/BulletHole/BulletHole.png", "start": 20366656, "end": 20398860, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_AlbedoTransparency.png", "start": 20398860, "end": 20483076, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_MetallicSmoothness.png", "start": 20483076, "end": 20491216, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_Normal.png", "start": 20491216, "end": 20522584, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Color.jpg", "start": 20522584, "end": 21590057, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Displacement.jpg", "start": 21590057, "end": 22216478, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Normal.jpg", "start": 22216478, "end": 23386018, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Roughness.jpg", "start": 23386018, "end": 24019275, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Color.jpg", "start": 24019275, "end": 25089706, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Displacement.jpg", "start": 25089706, "end": 25712450, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Normal.jpg", "start": 25712450, "end": 28061596, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Roughness.jpg", "start": 28061596, "end": 28882355, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Color.jpg", "start": 28882355, "end": 30215786, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Displacement.jpg", "start": 30215786, "end": 30512622, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Emission.jpg", "start": 30512622, "end": 31843605, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Normal.jpg", "start": 31843605, "end": 33539966, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Roughness.jpg", "start": 33539966, "end": 34110828, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/LavaGrayscale.jpg", "start": 34110828, "end": 34693690, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Water.jpg", "start": 34693690, "end": 36129590, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Color.jpg", "start": 36129590, "end": 36395848, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Displacement.jpg", "start": 36395848, "end": 36656455, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Normal.jpg", "start": 36656455, "end": 37251812, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Opacity.jpg", "start": 37251812, "end": 37570290, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Roughness.jpg", "start": 37570290, "end": 37869711, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Color.jpg", "start": 37869711, "end": 38962695, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Displacement.jpg", "start": 38962695, "end": 39753255, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Normal.jpg", "start": 39753255, "end": 40093104, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Roughness.jpg", "start": 40093104, "end": 40673204, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Color.jpg", "start": 40673204, "end": 41380073, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Displacement.jpg", "start": 41380073, "end": 41809287, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Metalness.jpg", "start": 41809287, "end": 41939291, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Normal.jpg", "start": 41939291, "end": 43004833, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Roughness.jpg", "start": 43004833, "end": 43377110, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/MetalGreen.jpg", "start": 43377110, "end": 44118015, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Color.jpg", "start": 44118015, "end": 44492174, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Displacement.jpg", "start": 44492174, "end": 44629366, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Metalness.jpg", "start": 44629366, "end": 44800560, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Normal.jpg", "start": 44800560, "end": 45508487, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Roughness.jpg", "start": 45508487, "end": 45915380, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle1.png", "start": 45915380, "end": 45941152, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle2.png", "start": 45941152, "end": 45962520, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle3.png", "start": 45962520, "end": 45982969, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle4.png", "start": 45982969, "end": 46006270, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle5.png", "start": 46006270, "end": 46030466, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_AmbientOcclusion.jpg", "start": 46030466, "end": 46630595, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Color.jpg", "start": 46630595, "end": 48158056, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Displacement.jpg", "start": 48158056, "end": 48454853, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Normal.jpg", "start": 48454853, "end": 50747237, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Roughness.jpg", "start": 50747237, "end": 51412293, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_AO.png", "start": 51412293, "end": 51438785, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_BaseColor.png", "start": 51438785, "end": 52222805, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Normal.png", "start": 52222805, "end": 52893364, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Roughness.png", "start": 52893364, "end": 53161795, "audio": 0}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Color.jpg", "start": 53161795, "end": 54147430, "audio": 0}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Normal.jpg", "start": 54147430, "end": 55382698, "audio": 0}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_basecolor.jpg", "start": 55382698, "end": 55422509, "audio": 0}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_normal.jpg", "start": 55422509, "end": 55682766, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_AmbientOcclusion.jpg", "start": 55682766, "end": 56062487, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Color.jpg", "start": 56062487, "end": 56862568, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Displacement.jpg", "start": 56862568, "end": 57379463, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Normal.jpg", "start": 57379463, "end": 58403952, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Roughness.jpg", "start": 58403952, "end": 58777974, "audio": 0}, {"filename": "/models/Ammo.mtl", "start": 58777974, "end": 58778634, "audio": 0}, {"filename": "/models/Ammo.obj", "start": 58778634, "end": 58806174, "audio": 0}, {"filename": "/models/Arrow.mtl", "start": 58806174, "end": 58806838, "audio": 0}, {"filename": "/models/Arrow.obj", "start": 58806838, "end": 58813527, "audio": 0}, {"filename": "/models/Artillery.mtl", "start": 58813527, "end": 58813818, "audio": 0}, {"filename": "/models/Artillery.obj", "start": 58813818, "end": 60469256, "audio": 0}, {"filename": "/models/ArtilleryIndicator.mtl", "start": 60469256, "end": 60469508, "audio": 0}, {"filename": "/models/ArtilleryIndicator.obj", "start": 60469508, "end": 60515934, "audio": 0}, {"filename": "/models/BombCrate.mtl", "start": 60515934, "end": 60516299, "audio": 0}, {"filename": "/models/BombCrate.obj", "start": 60516299, "end": 60517390, "audio": 0}, {"filename": "/models/Bow.mtl", "start": 60517390, "end": 60518052, "audio": 0}, {"filename": "/models/Bow.obj", "start": 60518052, "end": 60531647, "audio": 0}, {"filename": "/models/Bullet.mtl", "start": 60531647, "end": 60531888, "audio": 0}, {"filename": "/models/Bullet.obj", "start": 60531888, "end": 60560157, "audio": 0}, {"filename": "/models/BulletTracer.mtl", "start": 60560157, "end": 60560438, "audio": 0}, {"filename": "/models/BulletTracer.obj", "start": 60560438, "end": 60569867, "audio": 0}, {"filename": "/models/Cone.mtl", "start": 60569867, "end": 60569997, "audio": 0}, {"filename": "/models/Cone.obj", "start": 60569997, "end": 60580031, "audio": 0}, {"filename": "/models/Cube.mtl", "start": 60580031, "end": 60580260, "audio": 0}, {"filename": "/models/Cube.obj", "start": 60580260, "end": 60581287, "audio": 0}, {"filename": "/models/Cylinder.obj", "start": 60581287, "end": 60586938, "audio": 0}, {"filename": "/models/Explosion.mtl", "start": 60586938, "end": 60587359, "audio": 0}, {"filename": "/models/Explosion.obj", "start": 60587359, "end": 61254997, "audio": 0}, {"filename": "/models/FlatWorld.mtl", "start": 61254997, "end": 61255237, "audio": 0}, {"filename": "/models/FlatWorld.obj", "start": 61255237, "end": 61256300, "audio": 0}, {"filename": "/models/Grenade.mtl", "start": 61256300, "end": 61256899, "audio": 0}, {"filename": "/models/Grenade.obj", "start": 61256899, "end": 61503858, "audio": 0}, {"filename": "/models/Heaven.mtl", "start": 61503858, "end": 61505014, "audio": 0}, {"filename": "/models/Heaven.obj", "start": 61505014, "end": 61786281, "audio": 0}, {"filename": "/models/HookThrower.mtl", "start": 61786281, "end": 61786646, "audio": 0}, {"filename": "/models/HookThrower.obj", "start": 61786646, "end": 61789005, "audio": 0}, {"filename": "/models/Icosphere.mtl", "start": 61789005, "end": 61789230, "audio": 0}, {"filename": "/models/Icosphere.obj", "start": 61789230, "end": 61904889, "audio": 0}, {"filename": "/models/island.obj", "start": 61904889, "end": 63337463, "audio": 0}, {"filename": "/models/Lift.mtl", "start": 63337463, "end": 63337702, "audio": 0}, {"filename": "/models/Lift.obj", "start": 63337702, "end": 63352852, "audio": 0}, {"filename": "/models/MachineGun.mtl", "start": 63352852, "end": 63354139, "audio": 0}, {"filename": "/models/MachineGun.obj", "start": 63354139, "end": 63503676, "audio": 0}, {"filename": "/models/Medkit.mtl", "start": 63503676, "end": 63504162, "audio": 0}, {"filename": "/models/Medkit.obj", "start": 63504162, "end": 63518494, "audio": 0}, {"filename": "/models/NewPlayer.mtl", "start": 63518494, "end": 63519262, "audio": 0}, {"filename": "/models/NewPlayer.obj", "start": 63519262, "end": 63571584, "audio": 0}, {"filename": "/models/Pistol.mtl", "start": 63571584, "end": 63572130, "audio": 0}, {"filename": "/models/Pistol.obj", "start": 63572130, "end": 63596016, "audio": 0}, {"filename": "/models/Plane.mtl", "start": 63596016, "end": 63596140, "audio": 0}, {"filename": "/models/Plane.obj", "start": 63596140, "end": 63596480, "audio": 0}, {"filename": "/models/Player.mtl", "start": 63596480, "end": 63596720, "audio": 0}, {"filename": "/models/Player.obj", "start": 63596720, "end": 64368843, "audio": 0}, {"filename": "/models/PlayerMarkerMinimap.mtl", "start": 64368843, "end": 64369093, "audio": 0}, {"filename": "/models/PlayerMarkerMinimap.obj", "start": 64369093, "end": 64369497, "audio": 0}, {"filename": "/models/Portal.mtl", "start": 64369497, "end": 64369920, "audio": 0}, {"filename": "/models/Portal.obj", "start": 64369920, "end": 64398218, "audio": 0}, {"filename": "/models/Quad.obj", "start": 64398218, "end": 64398562, "audio": 0}, {"filename": "/models/Rifle.mtl", "start": 64398562, "end": 64399047, "audio": 0}, {"filename": "/models/Rifle.obj", "start": 64399047, "end": 64422775, "audio": 0}, {"filename": "/models/ShootingRange.mtl", "start": 64422775, "end": 64426500, "audio": 0}, {"filename": "/models/ShootingRange.obj", "start": 64426500, "end": 69550297, "audio": 0}, {"filename": "/models/Shotgun.mtl", "start": 69550297, "end": 69550970, "audio": 0}, {"filename": "/models/Shotgun.obj", "start": 69550970, "end": 69580917, "audio": 0}, {"filename": "/models/SmokeGrenade.mtl", "start": 69580917, "end": 69581338, "audio": 0}, {"filename": "/models/SmokeGrenade.obj", "start": 69581338, "end": 69730438, "audio": 0}, {"filename": "/models/SpectatorArea.mtl", "start": 69730438, "end": 69730682, "audio": 0}, {"filename": "/models/SpectatorArea.obj", "start": 69730682, "end": 69733088, "audio": 0}, {"filename": "/models/StreetLamp.mtl", "start": 69733088, "end": 69733386, "audio": 0}, {"filename": "/models/StreetLamp.obj", "start": 69733386, "end": 69772851, "audio": 0}, {"filename": "/models/SubmachineGun.mtl", "start": 69772851, "end": 69773793, "audio": 0}, {"filename": "/models/SubmachineGun.obj", "start": 69773793, "end": 69809856, "audio": 0}, {"filename": "/models/suzanne.obj", "start": 69809856, "end": 69888612, "audio": 0}, {"filename": "/models/Warehouse.mtl", "start": 69888612, "end": 69891868, "audio": 0}, {"filename": "/models/Warehouse.obj", "start": 69891868, "end": 70189567, "audio": 0}, {"filename": "/shaders/Antialias.fs", "start": 70189567, "end": 70190147, "audio": 0}, {"filename": "/shaders/BloomHighPass.fs", "start": 70190147, "end": 70190668, "audio": 0}, {"filename": "/shaders/Debug.fs", "start": 70190668, "end": 70190771, "audio": 0}, {"filename": "/shaders/Debug.vs", "start": 70190771, "end": 70190983, "audio": 0}, {"filename": "/shaders/FXAA.fs", "start": 70190983, "end": 70194631, "audio": 0}, {"filename": "/shaders/GaussianBlur.fs", "start": 70194631, "end": 70195664, "audio": 0}, {"filename": "/shaders/Mesh.fs", "start": 70195664, "end": 70206046, "audio": 0}, {"filename": "/shaders/Mesh.vs", "start": 70206046, "end": 70207286, "audio": 0}, {"filename": "/shaders/MeshDeferred.fs", "start": 70207286, "end": 70209479, "audio": 0}, {"filename": "/shaders/MeshLighting.fs", "start": 70209479, "end": 70217616, "audio": 0}, {"filename": "/shaders/MeshLighting.vs", "start": 70217616, "end": 70218212, "audio": 0}, {"filename": "/shaders/MeshLightingDirectionalLight.fs", "start": 70218212, "end": 70218611, "audio": 0}, {"filename": "/shaders/MeshLightingPointLight.fs", "start": 70218611, "end": 70219128, "audio": 0}, {"filename": "/shaders/MeshLightingRectangleLight.fs", "start": 70219128, "end": 70220034, "audio": 0}, {"filename": "/shaders/Minimap.fs", "start": 70220034, "end": 70220735, "audio": 0}, {"filename": "/shaders/Quad.fs", "start": 70220735, "end": 70221349, "audio": 0}, {"filename": "/shaders/Quad.vs", "start": 70221349, "end": 70221572, "audio": 0}, {"filename": "/shaders/ShadowMap.fs", "start": 70221572, "end": 70221689, "audio": 0}, {"filename": "/shaders/ShadowMap.vs", "start": 70221689, "end": 70221903, "audio": 0}, {"filename": "/shaders/Skydome.fs", "start": 70221903, "end": 70223135, "audio": 0}, {"filename": "/shaders/ToneMapping.fs", "start": 70223135, "end": 70223670, "audio": 0}, {"filename": "/sounds/bang.wav", "start": 70223670, "end": 70351256, "audio": 1}, {"filename": "/sounds/boom-old1.wav", "start": 70351256, "end": 70422980, "audio": 1}, {"filename": "/sounds/boom.wav", "start": 70422980, "end": 70494704, "audio": 1}, {"filename": "/sounds/GrenadeOut.wav", "start": 70494704, "end": 70574620, "audio": 1}, {"filename": "/sounds/HookReel.wav", "start": 70574620, "end": 70633032, "audio": 1}, {"filename": "/sounds/HookThrow.wav", "start": 70633032, "end": 70660724, "audio": 1}, {"filename": "/sounds/incoming.wav", "start": 70660724, "end": 70815446, "audio": 1}, {"filename": "/sounds/PortalEnd.wav", "start": 70815446, "end": 70887170, "audio": 1}, {"filename": "/sounds/PortalStart.wav", "start": 70887170, "end": 70959918, "audio": 1}, {"filename": "/sounds/reload.wav", "start": 70959918, "end": 71073626, "audio": 1}, {"filename": "/sounds/ueh.wav", "start": 71073626, "end": 71108486, "audio": 1}, {"filename": "/sounds/Archer/arrow-jump.wav", "start": 71108486, "end": 71378934, "audio": 1}, {"filename": "/sounds/Archer/arrow-pullback.wav", "start": 71378934, "end": 71526506, "audio": 1}, {"filename": "/sounds/Archer/arrow-shoot.wav", "start": 71526506, "end": 71641306, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-activate.wav", "start": 71641306, "end": 71965010, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-shoot.wav", "start": 71965010, "end": 72116680, "audio": 1}, {"filename": "/scripts/Explosion.w", "start": 72116680, "end": 72117356, "audio": 0}, {"filename": "/scripts/Math.w", "start": 72117356, "end": 72117444, "audio": 0}, {"filename": "/scripts/Object.w", "start": 72117444, "end": 72118938, "audio": 0}, {"filename": "/scripts/Test.w", "start": 72118938, "end": 72119250, "audio": 0}, {"filename": "/scripts/Types.w", "start": 72119250, "end": 72119546, "audio": 0}], "remote_package_size": 72119546, "package_uuid": "fbb12b00-004b-483c-b2c2-a705e7d72126"});
  
  })();
  