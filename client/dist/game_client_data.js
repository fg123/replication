
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
Module['FS_createPath']('/textures', 'MetalPlates007_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'WetFloor', true, true);
Module['FS_createPath']('/textures', 'CardboardBox', true, true);
Module['FS_createPath']('/textures', 'MuzzleFlash', true, true);
Module['FS_createPath']('/textures', 'BulletHole', true, true);
Module['FS_createPath']('/textures', 'WoodFloor040_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'Wood026_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'Leaking003_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'Rock029_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'Bricks059_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'Lava004_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'Concrete036_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'Fabric032_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'Marble012_1K-JPG', true, true);
Module['FS_createPath']('/textures', 'WoodenCrate', true, true);
Module['FS_createPath']('/textures', 'Metal038_1K-JPG', true, true);
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
   loadPackage({"files": [{"filename": "/maps/test.json", "start": 0, "end": 655, "audio": 0}, {"filename": "/maps/test-range.json", "start": 655, "end": 3150, "audio": 0}, {"filename": "/maps/map1.json", "start": 3150, "end": 28066, "audio": 0}, {"filename": "/maps/test-range.json.new", "start": 28066, "end": 30458, "audio": 0}, {"filename": "/maps/map1.json.new", "start": 30458, "end": 56865, "audio": 0}, {"filename": "/textures/Mountains.png", "start": 56865, "end": 133683, "audio": 0}, {"filename": "/textures/uvmap.jpg", "start": 133683, "end": 1115035, "audio": 0}, {"filename": "/textures/SupplyBinCover.png", "start": 1115035, "end": 1121125, "audio": 0}, {"filename": "/textures/SolomonFace.jpg", "start": 1121125, "end": 2128937, "audio": 0}, {"filename": "/textures/BulletTracer.png", "start": 2128937, "end": 2162704, "audio": 0}, {"filename": "/textures/sam_texture.jpg", "start": 2162704, "end": 3127478, "audio": 0}, {"filename": "/textures/Skydome.png", "start": 3127478, "end": 4587261, "audio": 0}, {"filename": "/textures/Artillery.png", "start": 4587261, "end": 5704488, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Metalness.jpg", "start": 5704488, "end": 5875682, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Displacement.jpg", "start": 5875682, "end": 6012874, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Color.jpg", "start": 6012874, "end": 6387033, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Roughness.jpg", "start": 6387033, "end": 6793926, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Normal.jpg", "start": 6793926, "end": 7501853, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_BaseColor.png", "start": 7501853, "end": 8285873, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Roughness.png", "start": 8285873, "end": 8554304, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_AO.png", "start": 8554304, "end": 8580796, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Normal.png", "start": 8580796, "end": 9251355, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_AlbedoTransparency.png", "start": 9251355, "end": 9335571, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_MetallicSmoothness.png", "start": 9335571, "end": 9343711, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_Normal.png", "start": 9343711, "end": 9375079, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle4.png", "start": 9375079, "end": 9398380, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle5.png", "start": 9398380, "end": 9422576, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle2.png", "start": 9422576, "end": 9443944, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle1.png", "start": 9443944, "end": 9469716, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle3.png", "start": 9469716, "end": 9490165, "audio": 0}, {"filename": "/textures/BulletHole/BulletHole.png", "start": 9490165, "end": 9522369, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Roughness.jpg", "start": 9522369, "end": 9896391, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_AmbientOcclusion.jpg", "start": 9896391, "end": 10276112, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Displacement.jpg", "start": 10276112, "end": 10793007, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Normal.jpg", "start": 10793007, "end": 11817496, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Color.jpg", "start": 11817496, "end": 12617577, "audio": 0}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Normal.jpg", "start": 12617577, "end": 13852845, "audio": 0}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Color.jpg", "start": 13852845, "end": 14838480, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Opacity.jpg", "start": 14838480, "end": 15156958, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Color.jpg", "start": 15156958, "end": 15423216, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Roughness.jpg", "start": 15423216, "end": 15722637, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Normal.jpg", "start": 15722637, "end": 16317994, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Displacement.jpg", "start": 16317994, "end": 16578601, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Normal.jpg", "start": 16578601, "end": 18870985, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Color.jpg", "start": 18870985, "end": 20398446, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Displacement.jpg", "start": 20398446, "end": 20695243, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Roughness.jpg", "start": 20695243, "end": 21360299, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_AmbientOcclusion.jpg", "start": 21360299, "end": 21960428, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Roughness.jpg", "start": 21960428, "end": 22640521, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Color.jpg", "start": 22640521, "end": 24062211, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Normal.jpg", "start": 24062211, "end": 25728766, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Displacement.jpg", "start": 25728766, "end": 26113195, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_AmbientOcclusion.jpg", "start": 26113195, "end": 26713529, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Emission.jpg", "start": 26713529, "end": 28044512, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Roughness.jpg", "start": 28044512, "end": 28615374, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Displacement.jpg", "start": 28615374, "end": 28912210, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Normal.jpg", "start": 28912210, "end": 30608571, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Water.jpg", "start": 30608571, "end": 32044471, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/LavaGrayscale.jpg", "start": 32044471, "end": 32627333, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Color.jpg", "start": 32627333, "end": 33960764, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Roughness.jpg", "start": 33960764, "end": 34594021, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Normal.jpg", "start": 34594021, "end": 35763561, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Color.jpg", "start": 35763561, "end": 36831034, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Displacement.jpg", "start": 36831034, "end": 37457455, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Color.jpg", "start": 37457455, "end": 38527886, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Roughness.jpg", "start": 38527886, "end": 39348645, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Displacement.jpg", "start": 39348645, "end": 39971389, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Normal.jpg", "start": 39971389, "end": 42320535, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Color.jpg", "start": 42320535, "end": 43413519, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Displacement.jpg", "start": 43413519, "end": 44204079, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Roughness.jpg", "start": 44204079, "end": 44784179, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Normal.jpg", "start": 44784179, "end": 45124028, "audio": 0}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_basecolor.jpg", "start": 45124028, "end": 45163839, "audio": 0}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_normal.jpg", "start": 45163839, "end": 45424096, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Displacement.jpg", "start": 45424096, "end": 45853310, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/MetalGreen.jpg", "start": 45853310, "end": 46594215, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Color.jpg", "start": 46594215, "end": 47301084, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Normal.jpg", "start": 47301084, "end": 48366626, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Roughness.jpg", "start": 48366626, "end": 48738903, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Metalness.jpg", "start": 48738903, "end": 48868907, "audio": 0}, {"filename": "/models/Artillery.obj", "start": 48868907, "end": 50524345, "audio": 0}, {"filename": "/models/FlatWorld.obj", "start": 50524345, "end": 50525408, "audio": 0}, {"filename": "/models/Heaven.mtl", "start": 50525408, "end": 50526564, "audio": 0}, {"filename": "/models/Rifle.mtl", "start": 50526564, "end": 50527049, "audio": 0}, {"filename": "/models/BulletTracer.mtl", "start": 50527049, "end": 50527330, "audio": 0}, {"filename": "/models/Arrow.obj", "start": 50527330, "end": 50534019, "audio": 0}, {"filename": "/models/Pistol.obj", "start": 50534019, "end": 50557905, "audio": 0}, {"filename": "/models/Shotgun.mtl", "start": 50557905, "end": 50558578, "audio": 0}, {"filename": "/models/SubmachineGun.obj", "start": 50558578, "end": 50594641, "audio": 0}, {"filename": "/models/ShootingRange.obj", "start": 50594641, "end": 55718438, "audio": 0}, {"filename": "/models/SupplyBin.obj", "start": 55718438, "end": 55730049, "audio": 0}, {"filename": "/models/Plane.obj", "start": 55730049, "end": 55730389, "audio": 0}, {"filename": "/models/Quad.obj", "start": 55730389, "end": 55730733, "audio": 0}, {"filename": "/models/StreetLamp.obj", "start": 55730733, "end": 55770198, "audio": 0}, {"filename": "/models/suzanne.obj", "start": 55770198, "end": 55848954, "audio": 0}, {"filename": "/models/ShootingRange.mtl", "start": 55848954, "end": 55852679, "audio": 0}, {"filename": "/models/Medkit.obj", "start": 55852679, "end": 55867011, "audio": 0}, {"filename": "/models/StreetLamp.mtl", "start": 55867011, "end": 55867309, "audio": 0}, {"filename": "/models/Cone.obj", "start": 55867309, "end": 55877343, "audio": 0}, {"filename": "/models/Icosphere.obj", "start": 55877343, "end": 55993002, "audio": 0}, {"filename": "/models/ArtilleryIndicator.mtl", "start": 55993002, "end": 55993254, "audio": 0}, {"filename": "/models/ArtilleryIndicator.obj", "start": 55993254, "end": 56039680, "audio": 0}, {"filename": "/models/Cylinder.obj", "start": 56039680, "end": 56045331, "audio": 0}, {"filename": "/models/FlatWorld.mtl", "start": 56045331, "end": 56045571, "audio": 0}, {"filename": "/models/SupplyBinLid.mtl", "start": 56045571, "end": 56045848, "audio": 0}, {"filename": "/models/Bullet.mtl", "start": 56045848, "end": 56046089, "audio": 0}, {"filename": "/models/SupplyBinLid.obj", "start": 56046089, "end": 56050970, "audio": 0}, {"filename": "/models/Rifle.obj", "start": 56050970, "end": 56074698, "audio": 0}, {"filename": "/models/Bow.mtl", "start": 56074698, "end": 56075360, "audio": 0}, {"filename": "/models/HookThrower.mtl", "start": 56075360, "end": 56075725, "audio": 0}, {"filename": "/models/Warehouse.mtl", "start": 56075725, "end": 56078981, "audio": 0}, {"filename": "/models/Plane.mtl", "start": 56078981, "end": 56079105, "audio": 0}, {"filename": "/models/cube.obj", "start": 56079105, "end": 56080132, "audio": 0}, {"filename": "/models/BombCrate.mtl", "start": 56080132, "end": 56080497, "audio": 0}, {"filename": "/models/Pistol.mtl", "start": 56080497, "end": 56081043, "audio": 0}, {"filename": "/models/Portal.obj", "start": 56081043, "end": 56109341, "audio": 0}, {"filename": "/models/Explosion.mtl", "start": 56109341, "end": 56109762, "audio": 0}, {"filename": "/models/Lift.mtl", "start": 56109762, "end": 56110001, "audio": 0}, {"filename": "/models/BombCrate.obj", "start": 56110001, "end": 56111092, "audio": 0}, {"filename": "/models/Ammo.obj", "start": 56111092, "end": 56138632, "audio": 0}, {"filename": "/models/HookThrower.obj", "start": 56138632, "end": 56140991, "audio": 0}, {"filename": "/models/Heaven.obj", "start": 56140991, "end": 56422258, "audio": 0}, {"filename": "/models/island.obj", "start": 56422258, "end": 57854832, "audio": 0}, {"filename": "/models/Arrow.mtl", "start": 57854832, "end": 57855496, "audio": 0}, {"filename": "/models/Warehouse.obj", "start": 57855496, "end": 58153195, "audio": 0}, {"filename": "/models/Explosion.obj", "start": 58153195, "end": 58820833, "audio": 0}, {"filename": "/models/NewPlayer.mtl", "start": 58820833, "end": 58821601, "audio": 0}, {"filename": "/models/Player.mtl", "start": 58821601, "end": 58821841, "audio": 0}, {"filename": "/models/Bow.obj", "start": 58821841, "end": 58835436, "audio": 0}, {"filename": "/models/Cone.mtl", "start": 58835436, "end": 58835566, "audio": 0}, {"filename": "/models/Shotgun.obj", "start": 58835566, "end": 58865513, "audio": 0}, {"filename": "/models/Grenade.obj", "start": 58865513, "end": 59112472, "audio": 0}, {"filename": "/models/SpectatorArea.mtl", "start": 59112472, "end": 59112716, "audio": 0}, {"filename": "/models/Grenade.mtl", "start": 59112716, "end": 59113315, "audio": 0}, {"filename": "/models/Ammo.mtl", "start": 59113315, "end": 59113975, "audio": 0}, {"filename": "/models/SmokeGrenade.mtl", "start": 59113975, "end": 59114396, "audio": 0}, {"filename": "/models/Player.obj", "start": 59114396, "end": 59886519, "audio": 0}, {"filename": "/models/Artillery.mtl", "start": 59886519, "end": 59886810, "audio": 0}, {"filename": "/models/Lift.obj", "start": 59886810, "end": 59901960, "audio": 0}, {"filename": "/models/Medkit.mtl", "start": 59901960, "end": 59902446, "audio": 0}, {"filename": "/models/Icosphere.mtl", "start": 59902446, "end": 59902671, "audio": 0}, {"filename": "/models/Cube.mtl", "start": 59902671, "end": 59902900, "audio": 0}, {"filename": "/models/Portal.mtl", "start": 59902900, "end": 59903323, "audio": 0}, {"filename": "/models/SubmachineGun.mtl", "start": 59903323, "end": 59904265, "audio": 0}, {"filename": "/models/PlayerMarkerMinimap.obj", "start": 59904265, "end": 59904669, "audio": 0}, {"filename": "/models/MachineGun.obj", "start": 59904669, "end": 60054206, "audio": 0}, {"filename": "/models/PlayerMarkerMinimap.mtl", "start": 60054206, "end": 60054456, "audio": 0}, {"filename": "/models/SpectatorArea.obj", "start": 60054456, "end": 60056862, "audio": 0}, {"filename": "/models/Cube.obj", "start": 60056862, "end": 60057889, "audio": 0}, {"filename": "/models/Bullet.obj", "start": 60057889, "end": 60086158, "audio": 0}, {"filename": "/models/NewPlayer.obj", "start": 60086158, "end": 60138480, "audio": 0}, {"filename": "/models/SmokeGrenade.obj", "start": 60138480, "end": 60287580, "audio": 0}, {"filename": "/models/SupplyBin.mtl", "start": 60287580, "end": 60288003, "audio": 0}, {"filename": "/models/BulletTracer.obj", "start": 60288003, "end": 60297432, "audio": 0}, {"filename": "/models/MachineGun.mtl", "start": 60297432, "end": 60298719, "audio": 0}, {"filename": "/shaders/MeshLightingRectangleLight.fs", "start": 60298719, "end": 60299625, "audio": 0}, {"filename": "/shaders/Debug.fs", "start": 60299625, "end": 60299728, "audio": 0}, {"filename": "/shaders/ShadowMap.fs", "start": 60299728, "end": 60299845, "audio": 0}, {"filename": "/shaders/BloomHighPass.fs", "start": 60299845, "end": 60300366, "audio": 0}, {"filename": "/shaders/ShadowMap.vs", "start": 60300366, "end": 60300580, "audio": 0}, {"filename": "/shaders/Mesh.vs", "start": 60300580, "end": 60301820, "audio": 0}, {"filename": "/shaders/ToneMapping.fs", "start": 60301820, "end": 60302355, "audio": 0}, {"filename": "/shaders/MeshDeferred.fs", "start": 60302355, "end": 60304548, "audio": 0}, {"filename": "/shaders/GaussianBlur.fs", "start": 60304548, "end": 60305581, "audio": 0}, {"filename": "/shaders/MeshLightingDirectionalLight.fs", "start": 60305581, "end": 60305980, "audio": 0}, {"filename": "/shaders/Minimap.fs", "start": 60305980, "end": 60306681, "audio": 0}, {"filename": "/shaders/MeshLighting.vs", "start": 60306681, "end": 60307277, "audio": 0}, {"filename": "/shaders/Skydome.fs", "start": 60307277, "end": 60308509, "audio": 0}, {"filename": "/shaders/Quad.fs", "start": 60308509, "end": 60309123, "audio": 0}, {"filename": "/shaders/MeshLighting.fs", "start": 60309123, "end": 60317260, "audio": 0}, {"filename": "/shaders/FXAA.fs", "start": 60317260, "end": 60320908, "audio": 0}, {"filename": "/shaders/Debug.vs", "start": 60320908, "end": 60321120, "audio": 0}, {"filename": "/shaders/Antialias.fs", "start": 60321120, "end": 60321700, "audio": 0}, {"filename": "/shaders/Quad.vs", "start": 60321700, "end": 60321923, "audio": 0}, {"filename": "/shaders/Mesh.fs", "start": 60321923, "end": 60332305, "audio": 0}, {"filename": "/shaders/MeshLightingPointLight.fs", "start": 60332305, "end": 60332822, "audio": 0}, {"filename": "/sounds/HookThrow.wav", "start": 60332822, "end": 60360514, "audio": 1}, {"filename": "/sounds/HookReel.wav", "start": 60360514, "end": 60418926, "audio": 1}, {"filename": "/sounds/PortalStart.wav", "start": 60418926, "end": 60491674, "audio": 1}, {"filename": "/sounds/ueh.wav", "start": 60491674, "end": 60526534, "audio": 1}, {"filename": "/sounds/reload.wav", "start": 60526534, "end": 60640242, "audio": 1}, {"filename": "/sounds/bang.wav", "start": 60640242, "end": 60767828, "audio": 1}, {"filename": "/sounds/incoming.wav", "start": 60767828, "end": 60922550, "audio": 1}, {"filename": "/sounds/boom.wav", "start": 60922550, "end": 60994274, "audio": 1}, {"filename": "/sounds/PortalEnd.wav", "start": 60994274, "end": 61065998, "audio": 1}, {"filename": "/sounds/GrenadeOut.wav", "start": 61065998, "end": 61145914, "audio": 1}, {"filename": "/sounds/boom-old1.wav", "start": 61145914, "end": 61217638, "audio": 1}, {"filename": "/sounds/Archer/arrow-pullback.wav", "start": 61217638, "end": 61365210, "audio": 1}, {"filename": "/sounds/Archer/arrow-shoot.wav", "start": 61365210, "end": 61480010, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-shoot.wav", "start": 61480010, "end": 61631680, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-activate.wav", "start": 61631680, "end": 61955384, "audio": 1}, {"filename": "/sounds/Archer/arrow-jump.wav", "start": 61955384, "end": 62225832, "audio": 1}, {"filename": "/scripts/BouncingBall.w", "start": 62225832, "end": 62226478, "audio": 0}, {"filename": "/scripts/Marine.w", "start": 62226478, "end": 62226834, "audio": 0}, {"filename": "/scripts/Dummy.w", "start": 62226834, "end": 62226978, "audio": 0}, {"filename": "/scripts/Test.w", "start": 62226978, "end": 62227069, "audio": 0}, {"filename": "/scripts/Archer.w", "start": 62227069, "end": 62227408, "audio": 0}, {"filename": "/scripts/1-Types.w", "start": 62227408, "end": 62229481, "audio": 0}, {"filename": "/scripts/6-Gun.w", "start": 62229481, "end": 62229583, "audio": 0}, {"filename": "/scripts/5-Weapon.w", "start": 62229583, "end": 62229989, "audio": 0}, {"filename": "/scripts/2-Object.w", "start": 62229989, "end": 62232362, "audio": 0}, {"filename": "/scripts/Bombmaker.w", "start": 62232362, "end": 62232698, "audio": 0}, {"filename": "/scripts/SmokeExplosion.w", "start": 62232698, "end": 62233499, "audio": 0}, {"filename": "/scripts/Hookman.w", "start": 62233499, "end": 62233834, "audio": 0}, {"filename": "/scripts/SmokeGrenade.w", "start": 62233834, "end": 62234325, "audio": 0}, {"filename": "/scripts/4-Player.w", "start": 62234325, "end": 62234946, "audio": 0}, {"filename": "/scripts/3-Math.w", "start": 62234946, "end": 62235032, "audio": 0}, {"filename": "/scripts/Explosion.w", "start": 62235032, "end": 62235714, "audio": 0}], "remote_package_size": 62235714, "package_uuid": "77d21624-2d2c-4257-a33b-dc9cd0ecfbae"});
  
  })();
  