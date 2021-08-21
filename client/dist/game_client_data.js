
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
   loadPackage({"files": [{"filename": "/maps/map1.json", "start": 0, "end": 25687, "audio": 0}, {"filename": "/maps/map1.json.new", "start": 25687, "end": 51374, "audio": 0}, {"filename": "/maps/test.json", "start": 51374, "end": 52029, "audio": 0}, {"filename": "/textures/Artillery.png", "start": 52029, "end": 1169256, "audio": 0}, {"filename": "/textures/BulletTracer.png", "start": 1169256, "end": 1203023, "audio": 0}, {"filename": "/textures/Mountains.png", "start": 1203023, "end": 1279841, "audio": 0}, {"filename": "/textures/nightSkydome.png", "start": 1279841, "end": 11194906, "audio": 0}, {"filename": "/textures/sam_texture.jpg", "start": 11194906, "end": 12159680, "audio": 0}, {"filename": "/textures/Skydome.png", "start": 12159680, "end": 13619463, "audio": 0}, {"filename": "/textures/SolomonFace.jpg", "start": 13619463, "end": 14627275, "audio": 0}, {"filename": "/textures/uvmap.jpg", "start": 14627275, "end": 15608627, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_AmbientOcclusion.jpg", "start": 15608627, "end": 16208961, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Color.jpg", "start": 16208961, "end": 17630651, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Displacement.jpg", "start": 17630651, "end": 18015080, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Normal.jpg", "start": 18015080, "end": 19681635, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Roughness.jpg", "start": 19681635, "end": 20361728, "audio": 0}, {"filename": "/textures/BulletHole/BulletHole.png", "start": 20361728, "end": 20393932, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_AlbedoTransparency.png", "start": 20393932, "end": 20478148, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_MetallicSmoothness.png", "start": 20478148, "end": 20486288, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_Normal.png", "start": 20486288, "end": 20517656, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Color.jpg", "start": 20517656, "end": 21585129, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Displacement.jpg", "start": 21585129, "end": 22211550, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Normal.jpg", "start": 22211550, "end": 23381090, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Roughness.jpg", "start": 23381090, "end": 24014347, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Color.jpg", "start": 24014347, "end": 25084778, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Displacement.jpg", "start": 25084778, "end": 25707522, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Normal.jpg", "start": 25707522, "end": 28056668, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Roughness.jpg", "start": 28056668, "end": 28877427, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Color.jpg", "start": 28877427, "end": 30210858, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Displacement.jpg", "start": 30210858, "end": 30507694, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Emission.jpg", "start": 30507694, "end": 31838677, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Normal.jpg", "start": 31838677, "end": 33535038, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Roughness.jpg", "start": 33535038, "end": 34105900, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/LavaGrayscale.jpg", "start": 34105900, "end": 34688762, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Water.jpg", "start": 34688762, "end": 36124662, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Color.jpg", "start": 36124662, "end": 36390920, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Displacement.jpg", "start": 36390920, "end": 36651527, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Normal.jpg", "start": 36651527, "end": 37246884, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Opacity.jpg", "start": 37246884, "end": 37565362, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Roughness.jpg", "start": 37565362, "end": 37864783, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Color.jpg", "start": 37864783, "end": 38957767, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Displacement.jpg", "start": 38957767, "end": 39748327, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Normal.jpg", "start": 39748327, "end": 40088176, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Roughness.jpg", "start": 40088176, "end": 40668276, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Color.jpg", "start": 40668276, "end": 41375145, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Displacement.jpg", "start": 41375145, "end": 41804359, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Metalness.jpg", "start": 41804359, "end": 41934363, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Normal.jpg", "start": 41934363, "end": 42999905, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Roughness.jpg", "start": 42999905, "end": 43372182, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/MetalGreen.jpg", "start": 43372182, "end": 44113087, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Color.jpg", "start": 44113087, "end": 44487246, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Displacement.jpg", "start": 44487246, "end": 44624438, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Metalness.jpg", "start": 44624438, "end": 44795632, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Normal.jpg", "start": 44795632, "end": 45503559, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Roughness.jpg", "start": 45503559, "end": 45910452, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle1.png", "start": 45910452, "end": 45936224, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle2.png", "start": 45936224, "end": 45957592, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle3.png", "start": 45957592, "end": 45978041, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle4.png", "start": 45978041, "end": 46001342, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle5.png", "start": 46001342, "end": 46025538, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_AmbientOcclusion.jpg", "start": 46025538, "end": 46625667, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Color.jpg", "start": 46625667, "end": 48153128, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Displacement.jpg", "start": 48153128, "end": 48449925, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Normal.jpg", "start": 48449925, "end": 50742309, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Roughness.jpg", "start": 50742309, "end": 51407365, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_AO.png", "start": 51407365, "end": 51433857, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_BaseColor.png", "start": 51433857, "end": 52217877, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Normal.png", "start": 52217877, "end": 52888436, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Roughness.png", "start": 52888436, "end": 53156867, "audio": 0}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Color.jpg", "start": 53156867, "end": 54142502, "audio": 0}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Normal.jpg", "start": 54142502, "end": 55377770, "audio": 0}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_basecolor.jpg", "start": 55377770, "end": 55417581, "audio": 0}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_normal.jpg", "start": 55417581, "end": 55677838, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_AmbientOcclusion.jpg", "start": 55677838, "end": 56057559, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Color.jpg", "start": 56057559, "end": 56857640, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Displacement.jpg", "start": 56857640, "end": 57374535, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Normal.jpg", "start": 57374535, "end": 58399024, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Roughness.jpg", "start": 58399024, "end": 58773046, "audio": 0}, {"filename": "/models/Ammo.mtl", "start": 58773046, "end": 58773706, "audio": 0}, {"filename": "/models/Ammo.obj", "start": 58773706, "end": 58801246, "audio": 0}, {"filename": "/models/Arrow.mtl", "start": 58801246, "end": 58801910, "audio": 0}, {"filename": "/models/Arrow.obj", "start": 58801910, "end": 58808599, "audio": 0}, {"filename": "/models/Artillery.mtl", "start": 58808599, "end": 58808890, "audio": 0}, {"filename": "/models/Artillery.obj", "start": 58808890, "end": 60464328, "audio": 0}, {"filename": "/models/ArtilleryIndicator.mtl", "start": 60464328, "end": 60464580, "audio": 0}, {"filename": "/models/ArtilleryIndicator.obj", "start": 60464580, "end": 60511006, "audio": 0}, {"filename": "/models/BombCrate.mtl", "start": 60511006, "end": 60511371, "audio": 0}, {"filename": "/models/BombCrate.obj", "start": 60511371, "end": 60512462, "audio": 0}, {"filename": "/models/Bow.mtl", "start": 60512462, "end": 60513124, "audio": 0}, {"filename": "/models/Bow.obj", "start": 60513124, "end": 60526719, "audio": 0}, {"filename": "/models/Bullet.mtl", "start": 60526719, "end": 60526960, "audio": 0}, {"filename": "/models/Bullet.obj", "start": 60526960, "end": 60555229, "audio": 0}, {"filename": "/models/BulletTracer.mtl", "start": 60555229, "end": 60555510, "audio": 0}, {"filename": "/models/BulletTracer.obj", "start": 60555510, "end": 60564939, "audio": 0}, {"filename": "/models/Cone.mtl", "start": 60564939, "end": 60565069, "audio": 0}, {"filename": "/models/Cone.obj", "start": 60565069, "end": 60575103, "audio": 0}, {"filename": "/models/Cube.mtl", "start": 60575103, "end": 60575332, "audio": 0}, {"filename": "/models/Cube.obj", "start": 60575332, "end": 60576359, "audio": 0}, {"filename": "/models/Cylinder.obj", "start": 60576359, "end": 60582010, "audio": 0}, {"filename": "/models/Explosion.mtl", "start": 60582010, "end": 60582431, "audio": 0}, {"filename": "/models/Explosion.obj", "start": 60582431, "end": 61250069, "audio": 0}, {"filename": "/models/FlatWorld.mtl", "start": 61250069, "end": 61250309, "audio": 0}, {"filename": "/models/FlatWorld.obj", "start": 61250309, "end": 61251372, "audio": 0}, {"filename": "/models/Grenade.mtl", "start": 61251372, "end": 61251971, "audio": 0}, {"filename": "/models/Grenade.obj", "start": 61251971, "end": 61498930, "audio": 0}, {"filename": "/models/Heaven.mtl", "start": 61498930, "end": 61500086, "audio": 0}, {"filename": "/models/Heaven.obj", "start": 61500086, "end": 61781353, "audio": 0}, {"filename": "/models/HookThrower.mtl", "start": 61781353, "end": 61781718, "audio": 0}, {"filename": "/models/HookThrower.obj", "start": 61781718, "end": 61784077, "audio": 0}, {"filename": "/models/Icosphere.mtl", "start": 61784077, "end": 61784302, "audio": 0}, {"filename": "/models/Icosphere.obj", "start": 61784302, "end": 61899961, "audio": 0}, {"filename": "/models/island.obj", "start": 61899961, "end": 63332535, "audio": 0}, {"filename": "/models/Lift.mtl", "start": 63332535, "end": 63332774, "audio": 0}, {"filename": "/models/Lift.obj", "start": 63332774, "end": 63347924, "audio": 0}, {"filename": "/models/MachineGun.mtl", "start": 63347924, "end": 63349211, "audio": 0}, {"filename": "/models/MachineGun.obj", "start": 63349211, "end": 63498748, "audio": 0}, {"filename": "/models/Medkit.mtl", "start": 63498748, "end": 63499234, "audio": 0}, {"filename": "/models/Medkit.obj", "start": 63499234, "end": 63513566, "audio": 0}, {"filename": "/models/NewPlayer.mtl", "start": 63513566, "end": 63514334, "audio": 0}, {"filename": "/models/NewPlayer.obj", "start": 63514334, "end": 63566656, "audio": 0}, {"filename": "/models/Pistol.mtl", "start": 63566656, "end": 63567202, "audio": 0}, {"filename": "/models/Pistol.obj", "start": 63567202, "end": 63591088, "audio": 0}, {"filename": "/models/Plane.mtl", "start": 63591088, "end": 63591212, "audio": 0}, {"filename": "/models/Plane.obj", "start": 63591212, "end": 63591552, "audio": 0}, {"filename": "/models/Player.mtl", "start": 63591552, "end": 63591792, "audio": 0}, {"filename": "/models/Player.obj", "start": 63591792, "end": 64363915, "audio": 0}, {"filename": "/models/PlayerMarkerMinimap.mtl", "start": 64363915, "end": 64364165, "audio": 0}, {"filename": "/models/PlayerMarkerMinimap.obj", "start": 64364165, "end": 64364569, "audio": 0}, {"filename": "/models/Portal.mtl", "start": 64364569, "end": 64364992, "audio": 0}, {"filename": "/models/Portal.obj", "start": 64364992, "end": 64393290, "audio": 0}, {"filename": "/models/Quad.obj", "start": 64393290, "end": 64393634, "audio": 0}, {"filename": "/models/Rifle.mtl", "start": 64393634, "end": 64394119, "audio": 0}, {"filename": "/models/Rifle.obj", "start": 64394119, "end": 64417847, "audio": 0}, {"filename": "/models/ShootingRange.mtl", "start": 64417847, "end": 64421572, "audio": 0}, {"filename": "/models/ShootingRange.obj", "start": 64421572, "end": 69545369, "audio": 0}, {"filename": "/models/Shotgun.mtl", "start": 69545369, "end": 69546042, "audio": 0}, {"filename": "/models/Shotgun.obj", "start": 69546042, "end": 69575989, "audio": 0}, {"filename": "/models/SmokeGrenade.mtl", "start": 69575989, "end": 69576410, "audio": 0}, {"filename": "/models/SmokeGrenade.obj", "start": 69576410, "end": 69725510, "audio": 0}, {"filename": "/models/SpectatorArea.mtl", "start": 69725510, "end": 69725754, "audio": 0}, {"filename": "/models/SpectatorArea.obj", "start": 69725754, "end": 69728160, "audio": 0}, {"filename": "/models/StreetLamp.mtl", "start": 69728160, "end": 69728458, "audio": 0}, {"filename": "/models/StreetLamp.obj", "start": 69728458, "end": 69767923, "audio": 0}, {"filename": "/models/SubmachineGun.mtl", "start": 69767923, "end": 69768865, "audio": 0}, {"filename": "/models/SubmachineGun.obj", "start": 69768865, "end": 69804928, "audio": 0}, {"filename": "/models/suzanne.obj", "start": 69804928, "end": 69883684, "audio": 0}, {"filename": "/models/Warehouse.mtl", "start": 69883684, "end": 69886940, "audio": 0}, {"filename": "/models/Warehouse.obj", "start": 69886940, "end": 70184639, "audio": 0}, {"filename": "/shaders/Antialias.fs", "start": 70184639, "end": 70185219, "audio": 0}, {"filename": "/shaders/BloomHighPass.fs", "start": 70185219, "end": 70185740, "audio": 0}, {"filename": "/shaders/Debug.fs", "start": 70185740, "end": 70185843, "audio": 0}, {"filename": "/shaders/Debug.vs", "start": 70185843, "end": 70186055, "audio": 0}, {"filename": "/shaders/FXAA.fs", "start": 70186055, "end": 70189703, "audio": 0}, {"filename": "/shaders/GaussianBlur.fs", "start": 70189703, "end": 70190736, "audio": 0}, {"filename": "/shaders/Mesh.fs", "start": 70190736, "end": 70201118, "audio": 0}, {"filename": "/shaders/Mesh.vs", "start": 70201118, "end": 70202358, "audio": 0}, {"filename": "/shaders/MeshDeferred.fs", "start": 70202358, "end": 70204551, "audio": 0}, {"filename": "/shaders/MeshLighting.fs", "start": 70204551, "end": 70212688, "audio": 0}, {"filename": "/shaders/MeshLighting.vs", "start": 70212688, "end": 70213284, "audio": 0}, {"filename": "/shaders/MeshLightingDirectionalLight.fs", "start": 70213284, "end": 70213683, "audio": 0}, {"filename": "/shaders/MeshLightingPointLight.fs", "start": 70213683, "end": 70214200, "audio": 0}, {"filename": "/shaders/MeshLightingRectangleLight.fs", "start": 70214200, "end": 70215106, "audio": 0}, {"filename": "/shaders/Minimap.fs", "start": 70215106, "end": 70215807, "audio": 0}, {"filename": "/shaders/Quad.fs", "start": 70215807, "end": 70216421, "audio": 0}, {"filename": "/shaders/Quad.vs", "start": 70216421, "end": 70216644, "audio": 0}, {"filename": "/shaders/ShadowMap.fs", "start": 70216644, "end": 70216761, "audio": 0}, {"filename": "/shaders/ShadowMap.vs", "start": 70216761, "end": 70216975, "audio": 0}, {"filename": "/shaders/Skydome.fs", "start": 70216975, "end": 70218207, "audio": 0}, {"filename": "/shaders/ToneMapping.fs", "start": 70218207, "end": 70218742, "audio": 0}, {"filename": "/sounds/bang.wav", "start": 70218742, "end": 70346328, "audio": 1}, {"filename": "/sounds/boom-old1.wav", "start": 70346328, "end": 70418052, "audio": 1}, {"filename": "/sounds/boom.wav", "start": 70418052, "end": 70489776, "audio": 1}, {"filename": "/sounds/GrenadeOut.wav", "start": 70489776, "end": 70569692, "audio": 1}, {"filename": "/sounds/HookReel.wav", "start": 70569692, "end": 70628104, "audio": 1}, {"filename": "/sounds/HookThrow.wav", "start": 70628104, "end": 70655796, "audio": 1}, {"filename": "/sounds/incoming.wav", "start": 70655796, "end": 70810518, "audio": 1}, {"filename": "/sounds/PortalEnd.wav", "start": 70810518, "end": 70882242, "audio": 1}, {"filename": "/sounds/PortalStart.wav", "start": 70882242, "end": 70954990, "audio": 1}, {"filename": "/sounds/reload.wav", "start": 70954990, "end": 71068698, "audio": 1}, {"filename": "/sounds/ueh.wav", "start": 71068698, "end": 71103558, "audio": 1}, {"filename": "/sounds/Archer/arrow-jump.wav", "start": 71103558, "end": 71374006, "audio": 1}, {"filename": "/sounds/Archer/arrow-pullback.wav", "start": 71374006, "end": 71521578, "audio": 1}, {"filename": "/sounds/Archer/arrow-shoot.wav", "start": 71521578, "end": 71636378, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-activate.wav", "start": 71636378, "end": 71960082, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-shoot.wav", "start": 71960082, "end": 72111752, "audio": 1}, {"filename": "/scripts/Explosion.w", "start": 72111752, "end": 72112450, "audio": 0}, {"filename": "/scripts/Object.w", "start": 72112450, "end": 72113948, "audio": 0}, {"filename": "/scripts/Test.w", "start": 72113948, "end": 72114260, "audio": 0}, {"filename": "/scripts/Types.w", "start": 72114260, "end": 72114556, "audio": 0}], "remote_package_size": 72114556, "package_uuid": "540297ea-2b8d-45b1-a232-c87ab4b10ec9"});
  
  })();
  