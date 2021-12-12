
  var Module = typeof Module !== 'undefined' ? Module : {};
  
  if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
  }
  Module.expectedDataFileDownloads++;
  (function() {
   var loadPackage = function(metadata) {
  
      var PACKAGE_PATH = '';
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
      } else if (typeof process === 'undefined' && typeof location !== 'undefined') {
        // web worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
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
        
        if (typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string') {
          require('fs').readFile(packageName, function(err, contents) {
            if (err) {
              errback(err);
            } else {
              callback(contents.buffer);
            }
          });
          return;
        }
      
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
  Module['FS_createPath']("/", "maps", true, true);
Module['FS_createPath']("/", "textures", true, true);
Module['FS_createPath']("/textures", "MetalPlates007_1K-JPG", true, true);
Module['FS_createPath']("/textures", "WetFloor", true, true);
Module['FS_createPath']("/textures", "CardboardBox", true, true);
Module['FS_createPath']("/textures", "Dust2", true, true);
Module['FS_createPath']("/textures", "MuzzleFlash", true, true);
Module['FS_createPath']("/textures", "BulletHole", true, true);
Module['FS_createPath']("/textures", "WoodFloor040_1K-JPG", true, true);
Module['FS_createPath']("/textures", "Wood026_1K-JPG", true, true);
Module['FS_createPath']("/textures", "Leaking003_1K-JPG", true, true);
Module['FS_createPath']("/textures", "Rock029_1K-JPG", true, true);
Module['FS_createPath']("/textures", "Bricks059_1K-JPG", true, true);
Module['FS_createPath']("/textures", "Lava004_1K-JPG", true, true);
Module['FS_createPath']("/textures", "Concrete036_1K-JPG", true, true);
Module['FS_createPath']("/textures", "Fabric032_1K-JPG", true, true);
Module['FS_createPath']("/textures", "Marble012_1K-JPG", true, true);
Module['FS_createPath']("/textures", "WoodenCrate", true, true);
Module['FS_createPath']("/textures", "Metal038_1K-JPG", true, true);
Module['FS_createPath']("/", "models", true, true);
Module['FS_createPath']("/", "shaders", true, true);
Module['FS_createPath']("/", "sounds", true, true);
Module['FS_createPath']("/sounds", "Archer", true, true);
Module['FS_createPath']("/", "scripts", true, true);

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
                new DataRequest(files[i]['start'], files[i]['end'], files[i]['audio'] || 0).open('GET', files[i]['filename']);
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
   loadPackage({"files": [{"filename": "/maps/dust2.json", "start": 0, "end": 2771}, {"filename": "/maps/test-range.json.20211210-231432.bak", "start": 2771, "end": 5609}, {"filename": "/maps/dust2.json.20211211-171302.bak", "start": 5609, "end": 8379}, {"filename": "/maps/test.json", "start": 8379, "end": 9034}, {"filename": "/maps/test-range.json.20211128-185851.bak", "start": 9034, "end": 11825}, {"filename": "/maps/map1.json.20211211-134645.bak", "start": 11825, "end": 36817}, {"filename": "/maps/dust2.json.20211211-171053.bak", "start": 36817, "end": 39582}, {"filename": "/maps/test-range.json.20211203-235248.bak", "start": 39582, "end": 42433}, {"filename": "/maps/test-range.json", "start": 42433, "end": 45347}, {"filename": "/maps/dust2.json.20211211-165858.bak", "start": 45347, "end": 45448}, {"filename": "/maps/map1.json", "start": 45448, "end": 77683}, {"filename": "/maps/dust2.json.20211211-171036.bak", "start": 77683, "end": 80424}, {"filename": "/maps/dust2.json.20211211-171205.bak", "start": 80424, "end": 83189}, {"filename": "/maps/test-range.json.20211127-155151.bak", "start": 83189, "end": 86053}, {"filename": "/maps/test-range.json.20211205-125109.bak", "start": 86053, "end": 88902}, {"filename": "/maps/map1.json.20211211-134715.bak", "start": 88902, "end": 121137}, {"filename": "/textures/Mountains.png", "start": 121137, "end": 197955}, {"filename": "/textures/uvmap.jpg", "start": 197955, "end": 1179307}, {"filename": "/textures/SupplyBinCover.png", "start": 1179307, "end": 1185397}, {"filename": "/textures/SolomonFace.jpg", "start": 1185397, "end": 2193209}, {"filename": "/textures/BulletTracer.png", "start": 2193209, "end": 2226976}, {"filename": "/textures/sam_texture.jpg", "start": 2226976, "end": 3191750}, {"filename": "/textures/Skydome.png", "start": 3191750, "end": 4651533}, {"filename": "/textures/Artillery.png", "start": 4651533, "end": 5768760}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Metalness.jpg", "start": 5768760, "end": 5939954}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Displacement.jpg", "start": 5939954, "end": 6077146}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Color.jpg", "start": 6077146, "end": 6451305}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Roughness.jpg", "start": 6451305, "end": 6858198}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Normal.jpg", "start": 6858198, "end": 7566125}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_BaseColor.png", "start": 7566125, "end": 8350145}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Roughness.png", "start": 8350145, "end": 8618576}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_AO.png", "start": 8618576, "end": 8645068}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Normal.png", "start": 8645068, "end": 9315627}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_AlbedoTransparency.png", "start": 9315627, "end": 9399843}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_MetallicSmoothness.png", "start": 9399843, "end": 9407983}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_Normal.png", "start": 9407983, "end": 9439351}, {"filename": "/textures/Dust2/de_dust2_material_20.png", "start": 9439351, "end": 9444182}, {"filename": "/textures/Dust2/de_dust2_material_24.png", "start": 9444182, "end": 9447672}, {"filename": "/textures/Dust2/de_dust2_material_28.png", "start": 9447672, "end": 9473005}, {"filename": "/textures/Dust2/de_dust2_material_29.png", "start": 9473005, "end": 9498232}, {"filename": "/textures/Dust2/de_dust2_material_21.png", "start": 9498232, "end": 9502995}, {"filename": "/textures/Dust2/de_dust2_material_3.png", "start": 9502995, "end": 9503098}, {"filename": "/textures/Dust2/de_dust2_material_18.png", "start": 9503098, "end": 9503194}, {"filename": "/textures/Dust2/de_dust2_material_5.png", "start": 9503194, "end": 9567147}, {"filename": "/textures/Dust2/de_dust2_material_9.png", "start": 9567147, "end": 9572162}, {"filename": "/textures/Dust2/de_dust2_material_23.png", "start": 9572162, "end": 9599681}, {"filename": "/textures/Dust2/de_dust2_material_31.png", "start": 9599681, "end": 9604375}, {"filename": "/textures/Dust2/de_dust2_material_14.png", "start": 9604375, "end": 9622796}, {"filename": "/textures/Dust2/de_dust2_material_17.png", "start": 9622796, "end": 9639605}, {"filename": "/textures/Dust2/de_dust2_material_1.png", "start": 9639605, "end": 9670424}, {"filename": "/textures/Dust2/de_dust2_material_32.png", "start": 9670424, "end": 9673446}, {"filename": "/textures/Dust2/de_dust2_material_8.png", "start": 9673446, "end": 9726756}, {"filename": "/textures/Dust2/de_dust2_material_4.png", "start": 9726756, "end": 9756610}, {"filename": "/textures/Dust2/de_dust2_material_33.png", "start": 9756610, "end": 9757405}, {"filename": "/textures/Dust2/de_dust2_material_6.png", "start": 9757405, "end": 9774335}, {"filename": "/textures/Dust2/de_dust2_material_2.png", "start": 9774335, "end": 9779361}, {"filename": "/textures/Dust2/de_dust2_material_7.png", "start": 9779361, "end": 9808234}, {"filename": "/textures/Dust2/de_dust2_material_19.png", "start": 9808234, "end": 9815024}, {"filename": "/textures/Dust2/de_dust2_material_13.png", "start": 9815024, "end": 9834381}, {"filename": "/textures/Dust2/de_dust2_material_16.png", "start": 9834381, "end": 9864201}, {"filename": "/textures/Dust2/de_dust2_material_10.png", "start": 9864201, "end": 9912550}, {"filename": "/textures/Dust2/de_dust2_material_12.png", "start": 9912550, "end": 9929597}, {"filename": "/textures/Dust2/de_dust2_material_15.png", "start": 9929597, "end": 9971472}, {"filename": "/textures/Dust2/de_dust2_material_27.png", "start": 9971472, "end": 10001070}, {"filename": "/textures/Dust2/de_dust2_material_30.png", "start": 10001070, "end": 10028148}, {"filename": "/textures/Dust2/de_dust2_material_22.png", "start": 10028148, "end": 10045147}, {"filename": "/textures/Dust2/de_dust2_material_25.png", "start": 10045147, "end": 10103682}, {"filename": "/textures/Dust2/de_dust2_material_0.png", "start": 10103682, "end": 10107647}, {"filename": "/textures/Dust2/de_dust2_material_26.png", "start": 10107647, "end": 10132651}, {"filename": "/textures/Dust2/de_dust2_material_11.png", "start": 10132651, "end": 10162366}, {"filename": "/textures/MuzzleFlash/muzzle4.png", "start": 10162366, "end": 10185667}, {"filename": "/textures/MuzzleFlash/muzzle5.png", "start": 10185667, "end": 10209863}, {"filename": "/textures/MuzzleFlash/muzzle2.png", "start": 10209863, "end": 10231231}, {"filename": "/textures/MuzzleFlash/muzzle1.png", "start": 10231231, "end": 10257003}, {"filename": "/textures/MuzzleFlash/muzzle3.png", "start": 10257003, "end": 10277452}, {"filename": "/textures/BulletHole/BulletHole.png", "start": 10277452, "end": 10309656}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Roughness.jpg", "start": 10309656, "end": 10683678}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_AmbientOcclusion.jpg", "start": 10683678, "end": 11063399}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Displacement.jpg", "start": 11063399, "end": 11580294}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Normal.jpg", "start": 11580294, "end": 12604783}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Color.jpg", "start": 12604783, "end": 13404864}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Normal.jpg", "start": 13404864, "end": 14640132}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Color.jpg", "start": 14640132, "end": 15625767}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Opacity.jpg", "start": 15625767, "end": 15944245}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Color.jpg", "start": 15944245, "end": 16210503}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Roughness.jpg", "start": 16210503, "end": 16509924}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Normal.jpg", "start": 16509924, "end": 17105281}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Displacement.jpg", "start": 17105281, "end": 17365888}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Normal.jpg", "start": 17365888, "end": 19658272}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Color.jpg", "start": 19658272, "end": 21185733}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Displacement.jpg", "start": 21185733, "end": 21482530}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Roughness.jpg", "start": 21482530, "end": 22147586}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_AmbientOcclusion.jpg", "start": 22147586, "end": 22747715}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Roughness.jpg", "start": 22747715, "end": 23427808}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Color.jpg", "start": 23427808, "end": 24849498}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Normal.jpg", "start": 24849498, "end": 26516053}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Displacement.jpg", "start": 26516053, "end": 26900482}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_AmbientOcclusion.jpg", "start": 26900482, "end": 27500816}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Emission.jpg", "start": 27500816, "end": 28831799}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Roughness.jpg", "start": 28831799, "end": 29402661}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Displacement.jpg", "start": 29402661, "end": 29699497}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Normal.jpg", "start": 29699497, "end": 31395858}, {"filename": "/textures/Lava004_1K-JPG/Water.jpg", "start": 31395858, "end": 32831758}, {"filename": "/textures/Lava004_1K-JPG/LavaGrayscale.jpg", "start": 32831758, "end": 33414620}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Color.jpg", "start": 33414620, "end": 34748051}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Roughness.jpg", "start": 34748051, "end": 35381308}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Normal.jpg", "start": 35381308, "end": 36550848}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Color.jpg", "start": 36550848, "end": 37618321}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Displacement.jpg", "start": 37618321, "end": 38244742}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Color.jpg", "start": 38244742, "end": 39315173}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Roughness.jpg", "start": 39315173, "end": 40135932}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Displacement.jpg", "start": 40135932, "end": 40758676}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Normal.jpg", "start": 40758676, "end": 43107822}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Color.jpg", "start": 43107822, "end": 44200806}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Displacement.jpg", "start": 44200806, "end": 44991366}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Roughness.jpg", "start": 44991366, "end": 45571466}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Normal.jpg", "start": 45571466, "end": 45911315}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_basecolor.jpg", "start": 45911315, "end": 45951126}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_normal.jpg", "start": 45951126, "end": 46211383}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Displacement.jpg", "start": 46211383, "end": 46640597}, {"filename": "/textures/Metal038_1K-JPG/MetalGreen.jpg", "start": 46640597, "end": 47381502}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Color.jpg", "start": 47381502, "end": 48088371}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Normal.jpg", "start": 48088371, "end": 49153913}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Roughness.jpg", "start": 49153913, "end": 49526190}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Metalness.jpg", "start": 49526190, "end": 49656194}, {"filename": "/models/Artillery.obj", "start": 49656194, "end": 51311632}, {"filename": "/models/FlatWorld.obj", "start": 51311632, "end": 51312695}, {"filename": "/models/Heaven.mtl", "start": 51312695, "end": 51313851}, {"filename": "/models/Rifle.mtl", "start": 51313851, "end": 51314336}, {"filename": "/models/BulletTracer.mtl", "start": 51314336, "end": 51314617}, {"filename": "/models/Arrow.obj", "start": 51314617, "end": 51321306}, {"filename": "/models/Pistol.obj", "start": 51321306, "end": 51345192}, {"filename": "/models/Shotgun.mtl", "start": 51345192, "end": 51345865}, {"filename": "/models/SubmachineGun.obj", "start": 51345865, "end": 51381928}, {"filename": "/models/ShootingRange.obj", "start": 51381928, "end": 56505725}, {"filename": "/models/SupplyBin.obj", "start": 56505725, "end": 56517336}, {"filename": "/models/Plane.obj", "start": 56517336, "end": 56517676}, {"filename": "/models/Quad.obj", "start": 56517676, "end": 56518020}, {"filename": "/models/StreetLamp.obj", "start": 56518020, "end": 56557485}, {"filename": "/models/suzanne.obj", "start": 56557485, "end": 56636241}, {"filename": "/models/ShootingRange.mtl", "start": 56636241, "end": 56639966}, {"filename": "/models/Medkit.obj", "start": 56639966, "end": 56654298}, {"filename": "/models/StreetLamp.mtl", "start": 56654298, "end": 56654596}, {"filename": "/models/Cone.obj", "start": 56654596, "end": 56664630}, {"filename": "/models/Icosphere.obj", "start": 56664630, "end": 56780289}, {"filename": "/models/ArtilleryIndicator.mtl", "start": 56780289, "end": 56780541}, {"filename": "/models/ArtilleryIndicator.obj", "start": 56780541, "end": 56826967}, {"filename": "/models/de_dust2.obj", "start": 56826967, "end": 58294290}, {"filename": "/models/ShootingRange2.obj", "start": 58294290, "end": 58299529}, {"filename": "/models/Cylinder.obj", "start": 58299529, "end": 58305180}, {"filename": "/models/FlatWorld.mtl", "start": 58305180, "end": 58305420}, {"filename": "/models/SupplyBinLid.mtl", "start": 58305420, "end": 58305697}, {"filename": "/models/Bullet.mtl", "start": 58305697, "end": 58305938}, {"filename": "/models/SupplyBinLid.obj", "start": 58305938, "end": 58310819}, {"filename": "/models/Rifle.obj", "start": 58310819, "end": 58334547}, {"filename": "/models/Bow.mtl", "start": 58334547, "end": 58335209}, {"filename": "/models/HookThrower.mtl", "start": 58335209, "end": 58335574}, {"filename": "/models/Warehouse.mtl", "start": 58335574, "end": 58338830}, {"filename": "/models/Plane.mtl", "start": 58338830, "end": 58338954}, {"filename": "/models/cube.obj", "start": 58338954, "end": 58339981}, {"filename": "/models/BombCrate.mtl", "start": 58339981, "end": 58340346}, {"filename": "/models/de_dust2.mtl", "start": 58340346, "end": 58349134}, {"filename": "/models/Pistol.mtl", "start": 58349134, "end": 58349680}, {"filename": "/models/Portal.obj", "start": 58349680, "end": 58377978}, {"filename": "/models/Explosion.mtl", "start": 58377978, "end": 58378399}, {"filename": "/models/Lift.mtl", "start": 58378399, "end": 58378638}, {"filename": "/models/BombCrate.obj", "start": 58378638, "end": 58379729}, {"filename": "/models/Ammo.obj", "start": 58379729, "end": 58407269}, {"filename": "/models/HookThrower.obj", "start": 58407269, "end": 58409628}, {"filename": "/models/ShootingRange2.mtl", "start": 58409628, "end": 58409873}, {"filename": "/models/Heaven.obj", "start": 58409873, "end": 58691140}, {"filename": "/models/island.obj", "start": 58691140, "end": 60123714}, {"filename": "/models/Arrow.mtl", "start": 60123714, "end": 60124378}, {"filename": "/models/Warehouse.obj", "start": 60124378, "end": 60423760}, {"filename": "/models/Explosion.obj", "start": 60423760, "end": 61091398}, {"filename": "/models/NewPlayer.mtl", "start": 61091398, "end": 61092166}, {"filename": "/models/Player.mtl", "start": 61092166, "end": 61092406}, {"filename": "/models/Bow.obj", "start": 61092406, "end": 61106001}, {"filename": "/models/Cone.mtl", "start": 61106001, "end": 61106131}, {"filename": "/models/Shotgun.obj", "start": 61106131, "end": 61136078}, {"filename": "/models/Grenade.obj", "start": 61136078, "end": 61383037}, {"filename": "/models/SpectatorArea.mtl", "start": 61383037, "end": 61383281}, {"filename": "/models/Grenade.mtl", "start": 61383281, "end": 61383880}, {"filename": "/models/Ammo.mtl", "start": 61383880, "end": 61384540}, {"filename": "/models/SmokeGrenade.mtl", "start": 61384540, "end": 61384961}, {"filename": "/models/Player.obj", "start": 61384961, "end": 62157084}, {"filename": "/models/Artillery.mtl", "start": 62157084, "end": 62157375}, {"filename": "/models/Lift.obj", "start": 62157375, "end": 62172525}, {"filename": "/models/Medkit.mtl", "start": 62172525, "end": 62173011}, {"filename": "/models/Icosphere.mtl", "start": 62173011, "end": 62173236}, {"filename": "/models/Cube.mtl", "start": 62173236, "end": 62173465}, {"filename": "/models/Portal.mtl", "start": 62173465, "end": 62173888}, {"filename": "/models/SubmachineGun.mtl", "start": 62173888, "end": 62174830}, {"filename": "/models/PlayerMarkerMinimap.obj", "start": 62174830, "end": 62175234}, {"filename": "/models/MachineGun.obj", "start": 62175234, "end": 62324771}, {"filename": "/models/PlayerMarkerMinimap.mtl", "start": 62324771, "end": 62325021}, {"filename": "/models/SpectatorArea.obj", "start": 62325021, "end": 62327427}, {"filename": "/models/Cube.obj", "start": 62327427, "end": 62328454}, {"filename": "/models/Bullet.obj", "start": 62328454, "end": 62356723}, {"filename": "/models/NewPlayer.obj", "start": 62356723, "end": 62409045}, {"filename": "/models/SmokeGrenade.obj", "start": 62409045, "end": 62558145}, {"filename": "/models/SupplyBin.mtl", "start": 62558145, "end": 62558568}, {"filename": "/models/BulletTracer.obj", "start": 62558568, "end": 62567997}, {"filename": "/models/MachineGun.mtl", "start": 62567997, "end": 62569284}, {"filename": "/shaders/MeshLightingRectangleLight.fs", "start": 62569284, "end": 62570190}, {"filename": "/shaders/Debug.fs", "start": 62570190, "end": 62570293}, {"filename": "/shaders/ShadowMap.fs", "start": 62570293, "end": 62570410}, {"filename": "/shaders/BloomHighPass.fs", "start": 62570410, "end": 62570931}, {"filename": "/shaders/ShadowMap.vs", "start": 62570931, "end": 62571145}, {"filename": "/shaders/Mesh.vs", "start": 62571145, "end": 62572385}, {"filename": "/shaders/ToneMapping.fs", "start": 62572385, "end": 62572920}, {"filename": "/shaders/MeshDeferred.fs", "start": 62572920, "end": 62575173}, {"filename": "/shaders/GaussianBlur.fs", "start": 62575173, "end": 62576206}, {"filename": "/shaders/MeshLightingDirectionalLight.fs", "start": 62576206, "end": 62576605}, {"filename": "/shaders/Minimap.fs", "start": 62576605, "end": 62577306}, {"filename": "/shaders/MeshLighting.vs", "start": 62577306, "end": 62577902}, {"filename": "/shaders/Skydome.fs", "start": 62577902, "end": 62579134}, {"filename": "/shaders/Quad.fs", "start": 62579134, "end": 62579748}, {"filename": "/shaders/MeshLighting.fs", "start": 62579748, "end": 62588620}, {"filename": "/shaders/FXAA.fs", "start": 62588620, "end": 62592268}, {"filename": "/shaders/Debug.vs", "start": 62592268, "end": 62592480}, {"filename": "/shaders/Antialias.fs", "start": 62592480, "end": 62593060}, {"filename": "/shaders/Quad.vs", "start": 62593060, "end": 62593283}, {"filename": "/shaders/Mesh.fs", "start": 62593283, "end": 62603665}, {"filename": "/shaders/MeshLightingPointLight.fs", "start": 62603665, "end": 62604182}, {"filename": "/sounds/HookThrow.wav", "start": 62604182, "end": 62631874, "audio": 1}, {"filename": "/sounds/HookReel.wav", "start": 62631874, "end": 62690286, "audio": 1}, {"filename": "/sounds/PortalStart.wav", "start": 62690286, "end": 62763034, "audio": 1}, {"filename": "/sounds/ueh.wav", "start": 62763034, "end": 62797894, "audio": 1}, {"filename": "/sounds/reload.wav", "start": 62797894, "end": 62911602, "audio": 1}, {"filename": "/sounds/bang.wav", "start": 62911602, "end": 63039188, "audio": 1}, {"filename": "/sounds/incoming.wav", "start": 63039188, "end": 63193910, "audio": 1}, {"filename": "/sounds/boom.wav", "start": 63193910, "end": 63265634, "audio": 1}, {"filename": "/sounds/PortalEnd.wav", "start": 63265634, "end": 63337358, "audio": 1}, {"filename": "/sounds/GrenadeOut.wav", "start": 63337358, "end": 63417274, "audio": 1}, {"filename": "/sounds/boom-old1.wav", "start": 63417274, "end": 63488998, "audio": 1}, {"filename": "/sounds/Archer/arrow-pullback.wav", "start": 63488998, "end": 63636570, "audio": 1}, {"filename": "/sounds/Archer/arrow-shoot.wav", "start": 63636570, "end": 63751370, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-shoot.wav", "start": 63751370, "end": 63903040, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-activate.wav", "start": 63903040, "end": 64226744, "audio": 1}, {"filename": "/sounds/Archer/arrow-jump.wav", "start": 64226744, "end": 64497192, "audio": 1}, {"filename": "/scripts/BouncingBall.w", "start": 64497192, "end": 64497838}, {"filename": "/scripts/Marine.w", "start": 64497838, "end": 64498194}, {"filename": "/scripts/Dummy.w", "start": 64498194, "end": 64498338}, {"filename": "/scripts/Test.w", "start": 64498338, "end": 64498429}, {"filename": "/scripts/Archer.w", "start": 64498429, "end": 64498768}, {"filename": "/scripts/1-Types.w", "start": 64498768, "end": 64500841}, {"filename": "/scripts/6-Gun.w", "start": 64500841, "end": 64500943}, {"filename": "/scripts/5-Weapon.w", "start": 64500943, "end": 64501349}, {"filename": "/scripts/2-Object.w", "start": 64501349, "end": 64503722}, {"filename": "/scripts/Bombmaker.w", "start": 64503722, "end": 64504058}, {"filename": "/scripts/SmokeExplosion.w", "start": 64504058, "end": 64504859}, {"filename": "/scripts/Hookman.w", "start": 64504859, "end": 64505194}, {"filename": "/scripts/SmokeGrenade.w", "start": 64505194, "end": 64505685}, {"filename": "/scripts/4-Player.w", "start": 64505685, "end": 64506306}, {"filename": "/scripts/3-Math.w", "start": 64506306, "end": 64506392}, {"filename": "/scripts/Explosion.w", "start": 64506392, "end": 64507074}], "remote_package_size": 64507074, "package_uuid": "0da00e72-45ef-4940-ac22-eff7f6a2e33e"});
  
  })();
  