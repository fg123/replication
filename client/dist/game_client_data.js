
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
   loadPackage({"files": [{"filename": "/maps/map1.json", "start": 0, "end": 24916, "audio": 0}, {"filename": "/maps/map1.json.new", "start": 24916, "end": 51323, "audio": 0}, {"filename": "/maps/test-range.json", "start": 51323, "end": 53818, "audio": 0}, {"filename": "/maps/test-range.json.new", "start": 53818, "end": 56210, "audio": 0}, {"filename": "/maps/test.json", "start": 56210, "end": 56865, "audio": 0}, {"filename": "/textures/Artillery.png", "start": 56865, "end": 1174092, "audio": 0}, {"filename": "/textures/BulletTracer.png", "start": 1174092, "end": 1207859, "audio": 0}, {"filename": "/textures/Mountains.png", "start": 1207859, "end": 1284677, "audio": 0}, {"filename": "/textures/sam_texture.jpg", "start": 1284677, "end": 2249451, "audio": 0}, {"filename": "/textures/Skydome.png", "start": 2249451, "end": 3709234, "audio": 0}, {"filename": "/textures/SolomonFace.jpg", "start": 3709234, "end": 4717046, "audio": 0}, {"filename": "/textures/SupplyBinCover.png", "start": 4717046, "end": 4723136, "audio": 0}, {"filename": "/textures/uvmap.jpg", "start": 4723136, "end": 5704488, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_AmbientOcclusion.jpg", "start": 5704488, "end": 6304822, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Color.jpg", "start": 6304822, "end": 7726512, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Displacement.jpg", "start": 7726512, "end": 8110941, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Normal.jpg", "start": 8110941, "end": 9777496, "audio": 0}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Roughness.jpg", "start": 9777496, "end": 10457589, "audio": 0}, {"filename": "/textures/BulletHole/BulletHole.png", "start": 10457589, "end": 10489793, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_AlbedoTransparency.png", "start": 10489793, "end": 10574009, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_MetallicSmoothness.png", "start": 10574009, "end": 10582149, "audio": 0}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_Normal.png", "start": 10582149, "end": 10613517, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Color.jpg", "start": 10613517, "end": 11680990, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Displacement.jpg", "start": 11680990, "end": 12307411, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Normal.jpg", "start": 12307411, "end": 13476951, "audio": 0}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Roughness.jpg", "start": 13476951, "end": 14110208, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Color.jpg", "start": 14110208, "end": 15180639, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Displacement.jpg", "start": 15180639, "end": 15803383, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Normal.jpg", "start": 15803383, "end": 18152529, "audio": 0}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Roughness.jpg", "start": 18152529, "end": 18973288, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Color.jpg", "start": 18973288, "end": 20306719, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Displacement.jpg", "start": 20306719, "end": 20603555, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Emission.jpg", "start": 20603555, "end": 21934538, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Normal.jpg", "start": 21934538, "end": 23630899, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Roughness.jpg", "start": 23630899, "end": 24201761, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/LavaGrayscale.jpg", "start": 24201761, "end": 24784623, "audio": 0}, {"filename": "/textures/Lava004_1K-JPG/Water.jpg", "start": 24784623, "end": 26220523, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Color.jpg", "start": 26220523, "end": 26486781, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Displacement.jpg", "start": 26486781, "end": 26747388, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Normal.jpg", "start": 26747388, "end": 27342745, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Opacity.jpg", "start": 27342745, "end": 27661223, "audio": 0}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Roughness.jpg", "start": 27661223, "end": 27960644, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Color.jpg", "start": 27960644, "end": 29053628, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Displacement.jpg", "start": 29053628, "end": 29844188, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Normal.jpg", "start": 29844188, "end": 30184037, "audio": 0}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Roughness.jpg", "start": 30184037, "end": 30764137, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Color.jpg", "start": 30764137, "end": 31471006, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Displacement.jpg", "start": 31471006, "end": 31900220, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Metalness.jpg", "start": 31900220, "end": 32030224, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Normal.jpg", "start": 32030224, "end": 33095766, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Roughness.jpg", "start": 33095766, "end": 33468043, "audio": 0}, {"filename": "/textures/Metal038_1K-JPG/MetalGreen.jpg", "start": 33468043, "end": 34208948, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Color.jpg", "start": 34208948, "end": 34583107, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Displacement.jpg", "start": 34583107, "end": 34720299, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Metalness.jpg", "start": 34720299, "end": 34891493, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Normal.jpg", "start": 34891493, "end": 35599420, "audio": 0}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Roughness.jpg", "start": 35599420, "end": 36006313, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle1.png", "start": 36006313, "end": 36032085, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle2.png", "start": 36032085, "end": 36053453, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle3.png", "start": 36053453, "end": 36073902, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle4.png", "start": 36073902, "end": 36097203, "audio": 0}, {"filename": "/textures/MuzzleFlash/muzzle5.png", "start": 36097203, "end": 36121399, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_AmbientOcclusion.jpg", "start": 36121399, "end": 36721528, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Color.jpg", "start": 36721528, "end": 38248989, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Displacement.jpg", "start": 38248989, "end": 38545786, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Normal.jpg", "start": 38545786, "end": 40838170, "audio": 0}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Roughness.jpg", "start": 40838170, "end": 41503226, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_AO.png", "start": 41503226, "end": 41529718, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_BaseColor.png", "start": 41529718, "end": 42313738, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Normal.png", "start": 42313738, "end": 42984297, "audio": 0}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Roughness.png", "start": 42984297, "end": 43252728, "audio": 0}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Color.jpg", "start": 43252728, "end": 44238363, "audio": 0}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Normal.jpg", "start": 44238363, "end": 45473631, "audio": 0}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_basecolor.jpg", "start": 45473631, "end": 45513442, "audio": 0}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_normal.jpg", "start": 45513442, "end": 45773699, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_AmbientOcclusion.jpg", "start": 45773699, "end": 46153420, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Color.jpg", "start": 46153420, "end": 46953501, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Displacement.jpg", "start": 46953501, "end": 47470396, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Normal.jpg", "start": 47470396, "end": 48494885, "audio": 0}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Roughness.jpg", "start": 48494885, "end": 48868907, "audio": 0}, {"filename": "/models/Ammo.mtl", "start": 48868907, "end": 48869567, "audio": 0}, {"filename": "/models/Ammo.obj", "start": 48869567, "end": 48897107, "audio": 0}, {"filename": "/models/Arrow.mtl", "start": 48897107, "end": 48897771, "audio": 0}, {"filename": "/models/Arrow.obj", "start": 48897771, "end": 48904460, "audio": 0}, {"filename": "/models/Artillery.mtl", "start": 48904460, "end": 48904751, "audio": 0}, {"filename": "/models/Artillery.obj", "start": 48904751, "end": 50560189, "audio": 0}, {"filename": "/models/ArtilleryIndicator.mtl", "start": 50560189, "end": 50560441, "audio": 0}, {"filename": "/models/ArtilleryIndicator.obj", "start": 50560441, "end": 50606867, "audio": 0}, {"filename": "/models/BombCrate.mtl", "start": 50606867, "end": 50607232, "audio": 0}, {"filename": "/models/BombCrate.obj", "start": 50607232, "end": 50608323, "audio": 0}, {"filename": "/models/Bow.mtl", "start": 50608323, "end": 50608985, "audio": 0}, {"filename": "/models/Bow.obj", "start": 50608985, "end": 50622580, "audio": 0}, {"filename": "/models/Bullet.mtl", "start": 50622580, "end": 50622821, "audio": 0}, {"filename": "/models/Bullet.obj", "start": 50622821, "end": 50651090, "audio": 0}, {"filename": "/models/BulletTracer.mtl", "start": 50651090, "end": 50651371, "audio": 0}, {"filename": "/models/BulletTracer.obj", "start": 50651371, "end": 50660800, "audio": 0}, {"filename": "/models/Cone.mtl", "start": 50660800, "end": 50660930, "audio": 0}, {"filename": "/models/Cone.obj", "start": 50660930, "end": 50670964, "audio": 0}, {"filename": "/models/Cube.mtl", "start": 50670964, "end": 50671193, "audio": 0}, {"filename": "/models/Cube.obj", "start": 50671193, "end": 50672220, "audio": 0}, {"filename": "/models/Cylinder.obj", "start": 50672220, "end": 50677871, "audio": 0}, {"filename": "/models/Explosion.mtl", "start": 50677871, "end": 50678292, "audio": 0}, {"filename": "/models/Explosion.obj", "start": 50678292, "end": 51345930, "audio": 0}, {"filename": "/models/FlatWorld.mtl", "start": 51345930, "end": 51346170, "audio": 0}, {"filename": "/models/FlatWorld.obj", "start": 51346170, "end": 51347233, "audio": 0}, {"filename": "/models/Grenade.mtl", "start": 51347233, "end": 51347832, "audio": 0}, {"filename": "/models/Grenade.obj", "start": 51347832, "end": 51594791, "audio": 0}, {"filename": "/models/Heaven.mtl", "start": 51594791, "end": 51595947, "audio": 0}, {"filename": "/models/Heaven.obj", "start": 51595947, "end": 51877214, "audio": 0}, {"filename": "/models/HookThrower.mtl", "start": 51877214, "end": 51877579, "audio": 0}, {"filename": "/models/HookThrower.obj", "start": 51877579, "end": 51879938, "audio": 0}, {"filename": "/models/Icosphere.mtl", "start": 51879938, "end": 51880163, "audio": 0}, {"filename": "/models/Icosphere.obj", "start": 51880163, "end": 51995822, "audio": 0}, {"filename": "/models/island.obj", "start": 51995822, "end": 53428396, "audio": 0}, {"filename": "/models/Lift.mtl", "start": 53428396, "end": 53428635, "audio": 0}, {"filename": "/models/Lift.obj", "start": 53428635, "end": 53443785, "audio": 0}, {"filename": "/models/MachineGun.mtl", "start": 53443785, "end": 53445072, "audio": 0}, {"filename": "/models/MachineGun.obj", "start": 53445072, "end": 53594609, "audio": 0}, {"filename": "/models/Medkit.mtl", "start": 53594609, "end": 53595095, "audio": 0}, {"filename": "/models/Medkit.obj", "start": 53595095, "end": 53609427, "audio": 0}, {"filename": "/models/NewPlayer.mtl", "start": 53609427, "end": 53610195, "audio": 0}, {"filename": "/models/NewPlayer.obj", "start": 53610195, "end": 53662517, "audio": 0}, {"filename": "/models/Pistol.mtl", "start": 53662517, "end": 53663063, "audio": 0}, {"filename": "/models/Pistol.obj", "start": 53663063, "end": 53686949, "audio": 0}, {"filename": "/models/Plane.mtl", "start": 53686949, "end": 53687073, "audio": 0}, {"filename": "/models/Plane.obj", "start": 53687073, "end": 53687413, "audio": 0}, {"filename": "/models/Player.mtl", "start": 53687413, "end": 53687653, "audio": 0}, {"filename": "/models/Player.obj", "start": 53687653, "end": 54459776, "audio": 0}, {"filename": "/models/PlayerMarkerMinimap.mtl", "start": 54459776, "end": 54460026, "audio": 0}, {"filename": "/models/PlayerMarkerMinimap.obj", "start": 54460026, "end": 54460430, "audio": 0}, {"filename": "/models/Portal.mtl", "start": 54460430, "end": 54460853, "audio": 0}, {"filename": "/models/Portal.obj", "start": 54460853, "end": 54489151, "audio": 0}, {"filename": "/models/Quad.obj", "start": 54489151, "end": 54489495, "audio": 0}, {"filename": "/models/Rifle.mtl", "start": 54489495, "end": 54489980, "audio": 0}, {"filename": "/models/Rifle.obj", "start": 54489980, "end": 54513708, "audio": 0}, {"filename": "/models/ShootingRange.mtl", "start": 54513708, "end": 54517433, "audio": 0}, {"filename": "/models/ShootingRange.obj", "start": 54517433, "end": 59641230, "audio": 0}, {"filename": "/models/Shotgun.mtl", "start": 59641230, "end": 59641903, "audio": 0}, {"filename": "/models/Shotgun.obj", "start": 59641903, "end": 59671850, "audio": 0}, {"filename": "/models/SmokeGrenade.mtl", "start": 59671850, "end": 59672271, "audio": 0}, {"filename": "/models/SmokeGrenade.obj", "start": 59672271, "end": 59821371, "audio": 0}, {"filename": "/models/SpectatorArea.mtl", "start": 59821371, "end": 59821615, "audio": 0}, {"filename": "/models/SpectatorArea.obj", "start": 59821615, "end": 59824021, "audio": 0}, {"filename": "/models/StreetLamp.mtl", "start": 59824021, "end": 59824319, "audio": 0}, {"filename": "/models/StreetLamp.obj", "start": 59824319, "end": 59863784, "audio": 0}, {"filename": "/models/SubmachineGun.mtl", "start": 59863784, "end": 59864726, "audio": 0}, {"filename": "/models/SubmachineGun.obj", "start": 59864726, "end": 59900789, "audio": 0}, {"filename": "/models/SupplyBin.mtl", "start": 59900789, "end": 59901212, "audio": 0}, {"filename": "/models/SupplyBin.obj", "start": 59901212, "end": 59912823, "audio": 0}, {"filename": "/models/SupplyBinLid.mtl", "start": 59912823, "end": 59913100, "audio": 0}, {"filename": "/models/SupplyBinLid.obj", "start": 59913100, "end": 59917981, "audio": 0}, {"filename": "/models/suzanne.obj", "start": 59917981, "end": 59996737, "audio": 0}, {"filename": "/models/Warehouse.mtl", "start": 59996737, "end": 59999993, "audio": 0}, {"filename": "/models/Warehouse.obj", "start": 59999993, "end": 60297692, "audio": 0}, {"filename": "/shaders/Antialias.fs", "start": 60297692, "end": 60298272, "audio": 0}, {"filename": "/shaders/BloomHighPass.fs", "start": 60298272, "end": 60298793, "audio": 0}, {"filename": "/shaders/Debug.fs", "start": 60298793, "end": 60298896, "audio": 0}, {"filename": "/shaders/Debug.vs", "start": 60298896, "end": 60299108, "audio": 0}, {"filename": "/shaders/FXAA.fs", "start": 60299108, "end": 60302756, "audio": 0}, {"filename": "/shaders/GaussianBlur.fs", "start": 60302756, "end": 60303789, "audio": 0}, {"filename": "/shaders/Mesh.fs", "start": 60303789, "end": 60314171, "audio": 0}, {"filename": "/shaders/Mesh.vs", "start": 60314171, "end": 60315411, "audio": 0}, {"filename": "/shaders/MeshDeferred.fs", "start": 60315411, "end": 60317604, "audio": 0}, {"filename": "/shaders/MeshLighting.fs", "start": 60317604, "end": 60325741, "audio": 0}, {"filename": "/shaders/MeshLighting.vs", "start": 60325741, "end": 60326337, "audio": 0}, {"filename": "/shaders/MeshLightingDirectionalLight.fs", "start": 60326337, "end": 60326736, "audio": 0}, {"filename": "/shaders/MeshLightingPointLight.fs", "start": 60326736, "end": 60327253, "audio": 0}, {"filename": "/shaders/MeshLightingRectangleLight.fs", "start": 60327253, "end": 60328159, "audio": 0}, {"filename": "/shaders/Minimap.fs", "start": 60328159, "end": 60328860, "audio": 0}, {"filename": "/shaders/Quad.fs", "start": 60328860, "end": 60329474, "audio": 0}, {"filename": "/shaders/Quad.vs", "start": 60329474, "end": 60329697, "audio": 0}, {"filename": "/shaders/ShadowMap.fs", "start": 60329697, "end": 60329814, "audio": 0}, {"filename": "/shaders/ShadowMap.vs", "start": 60329814, "end": 60330028, "audio": 0}, {"filename": "/shaders/Skydome.fs", "start": 60330028, "end": 60331260, "audio": 0}, {"filename": "/shaders/ToneMapping.fs", "start": 60331260, "end": 60331795, "audio": 0}, {"filename": "/sounds/bang.wav", "start": 60331795, "end": 60459381, "audio": 1}, {"filename": "/sounds/boom-old1.wav", "start": 60459381, "end": 60531105, "audio": 1}, {"filename": "/sounds/boom.wav", "start": 60531105, "end": 60602829, "audio": 1}, {"filename": "/sounds/GrenadeOut.wav", "start": 60602829, "end": 60682745, "audio": 1}, {"filename": "/sounds/HookReel.wav", "start": 60682745, "end": 60741157, "audio": 1}, {"filename": "/sounds/HookThrow.wav", "start": 60741157, "end": 60768849, "audio": 1}, {"filename": "/sounds/incoming.wav", "start": 60768849, "end": 60923571, "audio": 1}, {"filename": "/sounds/PortalEnd.wav", "start": 60923571, "end": 60995295, "audio": 1}, {"filename": "/sounds/PortalStart.wav", "start": 60995295, "end": 61068043, "audio": 1}, {"filename": "/sounds/reload.wav", "start": 61068043, "end": 61181751, "audio": 1}, {"filename": "/sounds/ueh.wav", "start": 61181751, "end": 61216611, "audio": 1}, {"filename": "/sounds/Archer/arrow-jump.wav", "start": 61216611, "end": 61487059, "audio": 1}, {"filename": "/sounds/Archer/arrow-pullback.wav", "start": 61487059, "end": 61634631, "audio": 1}, {"filename": "/sounds/Archer/arrow-shoot.wav", "start": 61634631, "end": 61749431, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-activate.wav", "start": 61749431, "end": 62073135, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-shoot.wav", "start": 62073135, "end": 62224805, "audio": 1}, {"filename": "/scripts/1-Types.w", "start": 62224805, "end": 62226878, "audio": 0}, {"filename": "/scripts/2-Object.w", "start": 62226878, "end": 62229241, "audio": 0}, {"filename": "/scripts/3-Math.w", "start": 62229241, "end": 62229327, "audio": 0}, {"filename": "/scripts/4-Player.w", "start": 62229327, "end": 62229838, "audio": 0}, {"filename": "/scripts/BouncingBall.w", "start": 62229838, "end": 62230484, "audio": 0}, {"filename": "/scripts/Explosion.w", "start": 62230484, "end": 62231166, "audio": 0}, {"filename": "/scripts/Marine.w", "start": 62231166, "end": 62231557, "audio": 0}, {"filename": "/scripts/SmokeExplosion.w", "start": 62231557, "end": 62232358, "audio": 0}, {"filename": "/scripts/SmokeGrenade.w", "start": 62232358, "end": 62232849, "audio": 0}, {"filename": "/scripts/Test.w", "start": 62232849, "end": 62232940, "audio": 0}], "remote_package_size": 62232940, "package_uuid": "b5b46618-65b8-4024-b473-cc484e629b52"});
  
  })();
  