
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
   loadPackage({"files": [{"filename": "/maps/map1.json", "start": 0, "end": 26407, "audio": 0}, {"filename": "/maps/map1.json.new", "start": 26407, "end": 52814, "audio": 0}, {"filename": "/maps/test-range.json", "start": 52814, "end": 55309, "audio": 0}, {"filename": "/maps/test-range.json.new", "start": 55309, "end": 57701, "audio": 0}, {"filename": "/maps/test.json", "start": 57701, "end": 58356, "audio": 0}, {"filename": "/textures/Artillery.png", "start": 58356, "end": 1175583, "audio": 0}, {"filename": "/textures/BulletTracer.png", "start": 1175583, "end": 1209350, "audio": 0}, {"filename": "/textures/Mountains.png", "start": 1209350, "end": 1286168, "audio": 0}, {"filename": "/textures/nightSkydome.png", "start": 1286168, "end": 11201233, "audio": 0}, {"filename": "/textures/sam_texture.jpg", "start": 11201233, "end": 12166007, "audio": 0}, {"filename": "/textures/Skydome.png", "start": 12166007, "end": 13625790, "audio": 0}, {"filename": "/textures/SolomonFace.jpg", "start": 13625790, "end": 14633602, "audio": 0}, {"filename": "/textures/SupplyBinCover.png", "start": 14633602, "end": 14639692, "audio": 0}, {"filename": "/textures/uvmap.jpg", "start": 14639692, "end": 15621044, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_AmbientOcclusion.jpg", "start": 15621044, "end": 16221378, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Color.jpg", "start": 16221378, "end": 17643068, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Displacement.jpg", "start": 17643068, "end": 18027497, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Normal.jpg", "start": 18027497, "end": 19694052, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Roughness.jpg", "start": 19694052, "end": 20374145, "audio": 0}, {"filename": "/textures/BulletHole/BulletHole.png", "start": 20374145, "end": 20406349, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_AlbedoTransparency.png", "start": 20406349, "end": 20490565, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_MetallicSmoothness.png", "start": 20490565, "end": 20498705, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_Normal.png", "start": 20498705, "end": 20530073, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Color.jpg", "start": 20530073, "end": 21597546, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Displacement.jpg", "start": 21597546, "end": 22223967, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Normal.jpg", "start": 22223967, "end": 23393507, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Roughness.jpg", "start": 23393507, "end": 24026764, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Color.jpg", "start": 24026764, "end": 25097195, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Displacement.jpg", "start": 25097195, "end": 25719939, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Normal.jpg", "start": 25719939, "end": 28069085, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Roughness.jpg", "start": 28069085, "end": 28889844, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Color.jpg", "start": 28889844, "end": 30223275, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Displacement.jpg", "start": 30223275, "end": 30520111, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Emission.jpg", "start": 30520111, "end": 31851094, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Normal.jpg", "start": 31851094, "end": 33547455, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Roughness.jpg", "start": 33547455, "end": 34118317, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/LavaGrayscale.jpg", "start": 34118317, "end": 34701179, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Water.jpg", "start": 34701179, "end": 36137079, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Color.jpg", "start": 36137079, "end": 36403337, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Displacement.jpg", "start": 36403337, "end": 36663944, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Normal.jpg", "start": 36663944, "end": 37259301, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Opacity.jpg", "start": 37259301, "end": 37577779, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Roughness.jpg", "start": 37577779, "end": 37877200, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Color.jpg", "start": 37877200, "end": 38970184, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Displacement.jpg", "start": 38970184, "end": 39760744, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Normal.jpg", "start": 39760744, "end": 40100593, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Roughness.jpg", "start": 40100593, "end": 40680693, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Color.jpg", "start": 40680693, "end": 41387562, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Displacement.jpg", "start": 41387562, "end": 41816776, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Metalness.jpg", "start": 41816776, "end": 41946780, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Normal.jpg", "start": 41946780, "end": 43012322, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Roughness.jpg", "start": 43012322, "end": 43384599, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/MetalGreen.jpg", "start": 43384599, "end": 44125504, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Color.jpg", "start": 44125504, "end": 44499663, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Displacement.jpg", "start": 44499663, "end": 44636855, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Metalness.jpg", "start": 44636855, "end": 44808049, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Normal.jpg", "start": 44808049, "end": 45515976, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Roughness.jpg", "start": 45515976, "end": 45922869, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle1.png", "start": 45922869, "end": 45948641, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle2.png", "start": 45948641, "end": 45970009, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle3.png", "start": 45970009, "end": 45990458, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle4.png", "start": 45990458, "end": 46013759, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle5.png", "start": 46013759, "end": 46037955, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_AmbientOcclusion.jpg", "start": 46037955, "end": 46638084, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Color.jpg", "start": 46638084, "end": 48165545, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Displacement.jpg", "start": 48165545, "end": 48462342, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Normal.jpg", "start": 48462342, "end": 50754726, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Roughness.jpg", "start": 50754726, "end": 51419782, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_AO.png", "start": 51419782, "end": 51446274, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_BaseColor.png", "start": 51446274, "end": 52230294, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Normal.png", "start": 52230294, "end": 52900853, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Roughness.png", "start": 52900853, "end": 53169284, "audio": 0}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Color.jpg", "start": 53169284, "end": 54154919, "audio": 0}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Normal.jpg", "start": 54154919, "end": 55390187, "audio": 0}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_basecolor.jpg", "start": 55390187, "end": 55429998, "audio": 0}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_normal.jpg", "start": 55429998, "end": 55690255, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_AmbientOcclusion.jpg", "start": 55690255, "end": 56069976, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Color.jpg", "start": 56069976, "end": 56870057, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Displacement.jpg", "start": 56870057, "end": 57386952, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Normal.jpg", "start": 57386952, "end": 58411441, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Roughness.jpg", "start": 58411441, "end": 58785463, "audio": 0}, {"filename": "/models/Ammo.mtl", "start": 58785463, "end": 58786123, "audio": 0}, {"filename": "/models/Ammo.obj", "start": 58786123, "end": 58813663, "audio": 0}, {"filename": "/models/Arrow.mtl", "start": 58813663, "end": 58814327, "audio": 0}, {"filename": "/models/Arrow.obj", "start": 58814327, "end": 58821016, "audio": 0}, {"filename": "/models/Artillery.mtl", "start": 58821016, "end": 58821307, "audio": 0}, {"filename": "/models/Artillery.obj", "start": 58821307, "end": 60476745, "audio": 0}, {"filename": "/models/ArtilleryIndicator.mtl", "start": 60476745, "end": 60476997, "audio": 0}, {"filename": "/models/ArtilleryIndicator.obj", "start": 60476997, "end": 60523423, "audio": 0}, {"filename": "/models/BombCrate.mtl", "start": 60523423, "end": 60523788, "audio": 0}, {"filename": "/models/BombCrate.obj", "start": 60523788, "end": 60524879, "audio": 0}, {"filename": "/models/Bow.mtl", "start": 60524879, "end": 60525541, "audio": 0}, {"filename": "/models/Bow.obj", "start": 60525541, "end": 60539136, "audio": 0}, {"filename": "/models/Bullet.mtl", "start": 60539136, "end": 60539377, "audio": 0}, {"filename": "/models/Bullet.obj", "start": 60539377, "end": 60567646, "audio": 0}, {"filename": "/models/BulletTracer.mtl", "start": 60567646, "end": 60567927, "audio": 0}, {"filename": "/models/BulletTracer.obj", "start": 60567927, "end": 60577356, "audio": 0}, {"filename": "/models/Cone.mtl", "start": 60577356, "end": 60577486, "audio": 0}, {"filename": "/models/Cone.obj", "start": 60577486, "end": 60587520, "audio": 0}, {"filename": "/models/Cube.mtl", "start": 60587520, "end": 60587749, "audio": 0}, {"filename": "/models/Cube.obj", "start": 60587749, "end": 60588776, "audio": 0}, {"filename": "/models/Cylinder.obj", "start": 60588776, "end": 60594427, "audio": 0}, {"filename": "/models/Explosion.mtl", "start": 60594427, "end": 60594848, "audio": 0}, {"filename": "/models/Explosion.obj", "start": 60594848, "end": 61262486, "audio": 0}, {"filename": "/models/FlatWorld.mtl", "start": 61262486, "end": 61262726, "audio": 0}, {"filename": "/models/FlatWorld.obj", "start": 61262726, "end": 61263789, "audio": 0}, {"filename": "/models/Grenade.mtl", "start": 61263789, "end": 61264388, "audio": 0}, {"filename": "/models/Grenade.obj", "start": 61264388, "end": 61511347, "audio": 0}, {"filename": "/models/Heaven.mtl", "start": 61511347, "end": 61512503, "audio": 0}, {"filename": "/models/Heaven.obj", "start": 61512503, "end": 61793770, "audio": 0}, {"filename": "/models/HookThrower.mtl", "start": 61793770, "end": 61794135, "audio": 0}, {"filename": "/models/HookThrower.obj", "start": 61794135, "end": 61796494, "audio": 0}, {"filename": "/models/Icosphere.mtl", "start": 61796494, "end": 61796719, "audio": 0}, {"filename": "/models/Icosphere.obj", "start": 61796719, "end": 61912378, "audio": 0}, {"filename": "/models/island.obj", "start": 61912378, "end": 63344952, "audio": 0}, {"filename": "/models/Lift.mtl", "start": 63344952, "end": 63345191, "audio": 0}, {"filename": "/models/Lift.obj", "start": 63345191, "end": 63360341, "audio": 0}, {"filename": "/models/MachineGun.mtl", "start": 63360341, "end": 63361628, "audio": 0}, {"filename": "/models/MachineGun.obj", "start": 63361628, "end": 63511165, "audio": 0}, {"filename": "/models/Medkit.mtl", "start": 63511165, "end": 63511651, "audio": 0}, {"filename": "/models/Medkit.obj", "start": 63511651, "end": 63525983, "audio": 0}, {"filename": "/models/NewPlayer.mtl", "start": 63525983, "end": 63526751, "audio": 0}, {"filename": "/models/NewPlayer.obj", "start": 63526751, "end": 63579073, "audio": 0}, {"filename": "/models/Pistol.mtl", "start": 63579073, "end": 63579619, "audio": 0}, {"filename": "/models/Pistol.obj", "start": 63579619, "end": 63603505, "audio": 0}, {"filename": "/models/Plane.mtl", "start": 63603505, "end": 63603629, "audio": 0}, {"filename": "/models/Plane.obj", "start": 63603629, "end": 63603969, "audio": 0}, {"filename": "/models/Player.mtl", "start": 63603969, "end": 63604209, "audio": 0}, {"filename": "/models/Player.obj", "start": 63604209, "end": 64376332, "audio": 0}, {"filename": "/models/PlayerMarkerMinimap.mtl", "start": 64376332, "end": 64376582, "audio": 0}, {"filename": "/models/PlayerMarkerMinimap.obj", "start": 64376582, "end": 64376986, "audio": 0}, {"filename": "/models/Portal.mtl", "start": 64376986, "end": 64377409, "audio": 0}, {"filename": "/models/Portal.obj", "start": 64377409, "end": 64405707, "audio": 0}, {"filename": "/models/Quad.obj", "start": 64405707, "end": 64406051, "audio": 0}, {"filename": "/models/Rifle.mtl", "start": 64406051, "end": 64406536, "audio": 0}, {"filename": "/models/Rifle.obj", "start": 64406536, "end": 64430264, "audio": 0}, {"filename": "/models/ShootingRange.mtl", "start": 64430264, "end": 64433989, "audio": 0}, {"filename": "/models/ShootingRange.obj", "start": 64433989, "end": 69557786, "audio": 0}, {"filename": "/models/Shotgun.mtl", "start": 69557786, "end": 69558459, "audio": 0}, {"filename": "/models/Shotgun.obj", "start": 69558459, "end": 69588406, "audio": 0}, {"filename": "/models/SmokeGrenade.mtl", "start": 69588406, "end": 69588827, "audio": 0}, {"filename": "/models/SmokeGrenade.obj", "start": 69588827, "end": 69737927, "audio": 0}, {"filename": "/models/SpectatorArea.mtl", "start": 69737927, "end": 69738171, "audio": 0}, {"filename": "/models/SpectatorArea.obj", "start": 69738171, "end": 69740577, "audio": 0}, {"filename": "/models/StreetLamp.mtl", "start": 69740577, "end": 69740875, "audio": 0}, {"filename": "/models/StreetLamp.obj", "start": 69740875, "end": 69780340, "audio": 0}, {"filename": "/models/SubmachineGun.mtl", "start": 69780340, "end": 69781282, "audio": 0}, {"filename": "/models/SubmachineGun.obj", "start": 69781282, "end": 69817345, "audio": 0}, {"filename": "/models/SupplyBin.mtl", "start": 69817345, "end": 69817768, "audio": 0}, {"filename": "/models/SupplyBin.obj", "start": 69817768, "end": 69829379, "audio": 0}, {"filename": "/models/SupplyBinLid.mtl", "start": 69829379, "end": 69829656, "audio": 0}, {"filename": "/models/SupplyBinLid.obj", "start": 69829656, "end": 69834537, "audio": 0}, {"filename": "/models/suzanne.obj", "start": 69834537, "end": 69913293, "audio": 0}, {"filename": "/models/Warehouse.mtl", "start": 69913293, "end": 69916549, "audio": 0}, {"filename": "/models/Warehouse.obj", "start": 69916549, "end": 70214248, "audio": 0}, {"filename": "/shaders/Antialias.fs", "start": 70214248, "end": 70214828, "audio": 0}, {"filename": "/shaders/BloomHighPass.fs", "start": 70214828, "end": 70215349, "audio": 0}, {"filename": "/shaders/Debug.fs", "start": 70215349, "end": 70215452, "audio": 0}, {"filename": "/shaders/Debug.vs", "start": 70215452, "end": 70215664, "audio": 0}, {"filename": "/shaders/FXAA.fs", "start": 70215664, "end": 70219312, "audio": 0}, {"filename": "/shaders/GaussianBlur.fs", "start": 70219312, "end": 70220345, "audio": 0}, {"filename": "/shaders/Mesh.fs", "start": 70220345, "end": 70230727, "audio": 0}, {"filename": "/shaders/Mesh.vs", "start": 70230727, "end": 70231967, "audio": 0}, {"filename": "/shaders/MeshDeferred.fs", "start": 70231967, "end": 70234160, "audio": 0}, {"filename": "/shaders/MeshLighting.fs", "start": 70234160, "end": 70242297, "audio": 0}, {"filename": "/shaders/MeshLighting.vs", "start": 70242297, "end": 70242893, "audio": 0}, {"filename": "/shaders/MeshLightingDirectionalLight.fs", "start": 70242893, "end": 70243292, "audio": 0}, {"filename": "/shaders/MeshLightingPointLight.fs", "start": 70243292, "end": 70243809, "audio": 0}, {"filename": "/shaders/MeshLightingRectangleLight.fs", "start": 70243809, "end": 70244715, "audio": 0}, {"filename": "/shaders/Minimap.fs", "start": 70244715, "end": 70245416, "audio": 0}, {"filename": "/shaders/Quad.fs", "start": 70245416, "end": 70246030, "audio": 0}, {"filename": "/shaders/Quad.vs", "start": 70246030, "end": 70246253, "audio": 0}, {"filename": "/shaders/ShadowMap.fs", "start": 70246253, "end": 70246370, "audio": 0}, {"filename": "/shaders/ShadowMap.vs", "start": 70246370, "end": 70246584, "audio": 0}, {"filename": "/shaders/Skydome.fs", "start": 70246584, "end": 70247816, "audio": 0}, {"filename": "/shaders/ToneMapping.fs", "start": 70247816, "end": 70248351, "audio": 0}, {"filename": "/sounds/bang.wav", "start": 70248351, "end": 70375937, "audio": 1}, {"filename": "/sounds/boom-old1.wav", "start": 70375937, "end": 70447661, "audio": 1}, {"filename": "/sounds/boom.wav", "start": 70447661, "end": 70519385, "audio": 1}, {"filename": "/sounds/GrenadeOut.wav", "start": 70519385, "end": 70599301, "audio": 1}, {"filename": "/sounds/HookReel.wav", "start": 70599301, "end": 70657713, "audio": 1}, {"filename": "/sounds/HookThrow.wav", "start": 70657713, "end": 70685405, "audio": 1}, {"filename": "/sounds/incoming.wav", "start": 70685405, "end": 70840127, "audio": 1}, {"filename": "/sounds/PortalEnd.wav", "start": 70840127, "end": 70911851, "audio": 1}, {"filename": "/sounds/PortalStart.wav", "start": 70911851, "end": 70984599, "audio": 1}, {"filename": "/sounds/reload.wav", "start": 70984599, "end": 71098307, "audio": 1}, {"filename": "/sounds/ueh.wav", "start": 71098307, "end": 71133167, "audio": 1}, {"filename": "/sounds/Archer/arrow-jump.wav", "start": 71133167, "end": 71403615, "audio": 1}, {"filename": "/sounds/Archer/arrow-pullback.wav", "start": 71403615, "end": 71551187, "audio": 1}, {"filename": "/sounds/Archer/arrow-shoot.wav", "start": 71551187, "end": 71665987, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-activate.wav", "start": 71665987, "end": 71989691, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-shoot.wav", "start": 71989691, "end": 72141361, "audio": 1}, {"filename": "/scripts/Explosion.w", "start": 72141361, "end": 72142037, "audio": 0}, {"filename": "/scripts/Math.w", "start": 72142037, "end": 72142123, "audio": 0}, {"filename": "/scripts/Object.w", "start": 72142123, "end": 72143743, "audio": 0}, {"filename": "/scripts/SmokeExplosion.w", "start": 72143743, "end": 72144552, "audio": 0}, {"filename": "/scripts/Test.w", "start": 72144552, "end": 72144864, "audio": 0}, {"filename": "/scripts/Types.w", "start": 72144864, "end": 72146259, "audio": 0}], "remote_package_size": 72146259, "package_uuid": "5caa03c4-1d90-425a-b6e0-41a29ed58617"});
  
  })();
  