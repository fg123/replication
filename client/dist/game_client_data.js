
  var Module = typeof Module !== 'undefined' ? Module : {};

  if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
  }

  Module.expectedDataFileDownloads++;
  (function() {
    // When running as a pthread, FS operations are proxied to the main thread, so we don't need to
    // fetch the .data bundle on the worker
    if (Module['ENVIRONMENT_IS_PTHREAD']) return;
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
Module['FS_createPath']("/", "animations", true, true);
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
          // canOwn this data in the filesystem, it is a slide into the heap that will never change
          Module['FS_createDataFile'](this.name, null, byteArray, true, true, true);
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
          }          Module['removeRunDependency']('datafile_../client/dist/game_client.data');

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
    loadPackage({"files": [{"filename": "/maps/dust2.json", "start": 0, "end": 4019}, {"filename": "/maps/test.json", "start": 4019, "end": 4674}, {"filename": "/maps/test-range.json", "start": 4674, "end": 7588}, {"filename": "/maps/map1.json", "start": 7588, "end": 39823}, {"filename": "/textures/Mountains.png", "start": 39823, "end": 116641}, {"filename": "/textures/uvmap.jpg", "start": 116641, "end": 1097993}, {"filename": "/textures/SupplyBinCover.png", "start": 1097993, "end": 1104083}, {"filename": "/textures/SolomonFace.jpg", "start": 1104083, "end": 2111895}, {"filename": "/textures/BulletTracer.png", "start": 2111895, "end": 2145662}, {"filename": "/textures/sam_texture.jpg", "start": 2145662, "end": 3110436}, {"filename": "/textures/Skydome.png", "start": 3110436, "end": 4570219}, {"filename": "/textures/Artillery.png", "start": 4570219, "end": 5687446}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Metalness.jpg", "start": 5687446, "end": 5858640}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Displacement.jpg", "start": 5858640, "end": 5995832}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Color.jpg", "start": 5995832, "end": 6369991}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Roughness.jpg", "start": 6369991, "end": 6776884}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Normal.jpg", "start": 6776884, "end": 7484811}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_BaseColor.png", "start": 7484811, "end": 8268831}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Roughness.png", "start": 8268831, "end": 8537262}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_AO.png", "start": 8537262, "end": 8563754}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Normal.png", "start": 8563754, "end": 9234313}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_AlbedoTransparency.png", "start": 9234313, "end": 9318529}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_MetallicSmoothness.png", "start": 9318529, "end": 9326669}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_Normal.png", "start": 9326669, "end": 9358037}, {"filename": "/textures/Dust2/de_dust2_material_20.png", "start": 9358037, "end": 9362868}, {"filename": "/textures/Dust2/de_dust2_material_24.png", "start": 9362868, "end": 9366358}, {"filename": "/textures/Dust2/de_dust2_material_28.png", "start": 9366358, "end": 9391691}, {"filename": "/textures/Dust2/de_dust2_material_29.png", "start": 9391691, "end": 9416918}, {"filename": "/textures/Dust2/de_dust2_material_21.png", "start": 9416918, "end": 9421681}, {"filename": "/textures/Dust2/de_dust2_material_3.png", "start": 9421681, "end": 9421784}, {"filename": "/textures/Dust2/de_dust2_material_18.png", "start": 9421784, "end": 9421880}, {"filename": "/textures/Dust2/de_dust2_material_5.png", "start": 9421880, "end": 9485833}, {"filename": "/textures/Dust2/de_dust2_material_9.png", "start": 9485833, "end": 9490848}, {"filename": "/textures/Dust2/de_dust2_material_23.png", "start": 9490848, "end": 9518367}, {"filename": "/textures/Dust2/de_dust2_material_31.png", "start": 9518367, "end": 9523061}, {"filename": "/textures/Dust2/de_dust2_material_14.png", "start": 9523061, "end": 9541482}, {"filename": "/textures/Dust2/de_dust2_material_17.png", "start": 9541482, "end": 9558291}, {"filename": "/textures/Dust2/de_dust2_material_1.png", "start": 9558291, "end": 9589110}, {"filename": "/textures/Dust2/de_dust2_material_32.png", "start": 9589110, "end": 9592132}, {"filename": "/textures/Dust2/de_dust2_material_8.png", "start": 9592132, "end": 9645442}, {"filename": "/textures/Dust2/de_dust2_material_4.png", "start": 9645442, "end": 9675296}, {"filename": "/textures/Dust2/de_dust2_material_33.png", "start": 9675296, "end": 9676091}, {"filename": "/textures/Dust2/de_dust2_material_6.png", "start": 9676091, "end": 9693021}, {"filename": "/textures/Dust2/de_dust2_material_2.png", "start": 9693021, "end": 9698047}, {"filename": "/textures/Dust2/de_dust2_material_7.png", "start": 9698047, "end": 9726920}, {"filename": "/textures/Dust2/de_dust2_material_19.png", "start": 9726920, "end": 9733710}, {"filename": "/textures/Dust2/de_dust2_material_13.png", "start": 9733710, "end": 9753067}, {"filename": "/textures/Dust2/de_dust2_material_16.png", "start": 9753067, "end": 9782887}, {"filename": "/textures/Dust2/de_dust2_material_10.png", "start": 9782887, "end": 9831236}, {"filename": "/textures/Dust2/de_dust2_material_12.png", "start": 9831236, "end": 9848283}, {"filename": "/textures/Dust2/de_dust2_material_15.png", "start": 9848283, "end": 9890158}, {"filename": "/textures/Dust2/de_dust2_material_27.png", "start": 9890158, "end": 9919756}, {"filename": "/textures/Dust2/de_dust2_material_30.png", "start": 9919756, "end": 9946834}, {"filename": "/textures/Dust2/de_dust2_material_22.png", "start": 9946834, "end": 9963833}, {"filename": "/textures/Dust2/de_dust2_material_25.png", "start": 9963833, "end": 10022368}, {"filename": "/textures/Dust2/de_dust2_material_0.png", "start": 10022368, "end": 10026333}, {"filename": "/textures/Dust2/de_dust2_material_26.png", "start": 10026333, "end": 10051337}, {"filename": "/textures/Dust2/de_dust2_material_11.png", "start": 10051337, "end": 10081052}, {"filename": "/textures/MuzzleFlash/muzzle4.png", "start": 10081052, "end": 10104353}, {"filename": "/textures/MuzzleFlash/muzzle5.png", "start": 10104353, "end": 10128549}, {"filename": "/textures/MuzzleFlash/muzzle2.png", "start": 10128549, "end": 10149917}, {"filename": "/textures/MuzzleFlash/muzzle1.png", "start": 10149917, "end": 10175689}, {"filename": "/textures/MuzzleFlash/muzzle3.png", "start": 10175689, "end": 10196138}, {"filename": "/textures/BulletHole/BulletHole.png", "start": 10196138, "end": 10228342}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Roughness.jpg", "start": 10228342, "end": 10602364}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_AmbientOcclusion.jpg", "start": 10602364, "end": 10982085}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Displacement.jpg", "start": 10982085, "end": 11498980}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Normal.jpg", "start": 11498980, "end": 12523469}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Color.jpg", "start": 12523469, "end": 13323550}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Normal.jpg", "start": 13323550, "end": 14558818}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Color.jpg", "start": 14558818, "end": 15544453}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Opacity.jpg", "start": 15544453, "end": 15862931}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Color.jpg", "start": 15862931, "end": 16129189}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Roughness.jpg", "start": 16129189, "end": 16428610}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Normal.jpg", "start": 16428610, "end": 17023967}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Displacement.jpg", "start": 17023967, "end": 17284574}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Normal.jpg", "start": 17284574, "end": 19576958}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Color.jpg", "start": 19576958, "end": 21104419}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Displacement.jpg", "start": 21104419, "end": 21401216}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Roughness.jpg", "start": 21401216, "end": 22066272}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_AmbientOcclusion.jpg", "start": 22066272, "end": 22666401}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Roughness.jpg", "start": 22666401, "end": 23346494}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Color.jpg", "start": 23346494, "end": 24768184}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Normal.jpg", "start": 24768184, "end": 26434739}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Displacement.jpg", "start": 26434739, "end": 26819168}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_AmbientOcclusion.jpg", "start": 26819168, "end": 27419502}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Emission.jpg", "start": 27419502, "end": 28750485}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Roughness.jpg", "start": 28750485, "end": 29321347}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Displacement.jpg", "start": 29321347, "end": 29618183}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Normal.jpg", "start": 29618183, "end": 31314544}, {"filename": "/textures/Lava004_1K-JPG/Water.jpg", "start": 31314544, "end": 32750444}, {"filename": "/textures/Lava004_1K-JPG/LavaGrayscale.jpg", "start": 32750444, "end": 33333306}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Color.jpg", "start": 33333306, "end": 34666737}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Roughness.jpg", "start": 34666737, "end": 35299994}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Normal.jpg", "start": 35299994, "end": 36469534}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Color.jpg", "start": 36469534, "end": 37537007}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Displacement.jpg", "start": 37537007, "end": 38163428}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Color.jpg", "start": 38163428, "end": 39233859}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Roughness.jpg", "start": 39233859, "end": 40054618}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Displacement.jpg", "start": 40054618, "end": 40677362}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Normal.jpg", "start": 40677362, "end": 43026508}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Color.jpg", "start": 43026508, "end": 44119492}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Displacement.jpg", "start": 44119492, "end": 44910052}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Roughness.jpg", "start": 44910052, "end": 45490152}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Normal.jpg", "start": 45490152, "end": 45830001}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_basecolor.jpg", "start": 45830001, "end": 45869812}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_normal.jpg", "start": 45869812, "end": 46130069}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Displacement.jpg", "start": 46130069, "end": 46559283}, {"filename": "/textures/Metal038_1K-JPG/MetalGreen.jpg", "start": 46559283, "end": 47300188}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Color.jpg", "start": 47300188, "end": 48007057}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Normal.jpg", "start": 48007057, "end": 49072599}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Roughness.jpg", "start": 49072599, "end": 49444876}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Metalness.jpg", "start": 49444876, "end": 49574880}, {"filename": "/models/Artillery.obj", "start": 49574880, "end": 51230318}, {"filename": "/models/FlatWorld.obj", "start": 51230318, "end": 51231381}, {"filename": "/models/Heaven.mtl", "start": 51231381, "end": 51232537}, {"filename": "/models/Rifle.mtl", "start": 51232537, "end": 51233022}, {"filename": "/models/BulletTracer.mtl", "start": 51233022, "end": 51233303}, {"filename": "/models/Arrow.obj", "start": 51233303, "end": 51239992}, {"filename": "/models/Pistol.obj", "start": 51239992, "end": 51263878}, {"filename": "/models/Shotgun.mtl", "start": 51263878, "end": 51264551}, {"filename": "/models/SubmachineGun.obj", "start": 51264551, "end": 51300614}, {"filename": "/models/ShootingRange.obj", "start": 51300614, "end": 56424411}, {"filename": "/models/SupplyBin.obj", "start": 56424411, "end": 56436022}, {"filename": "/models/Plane.obj", "start": 56436022, "end": 56436362}, {"filename": "/models/Quad.obj", "start": 56436362, "end": 56436706}, {"filename": "/models/StreetLamp.obj", "start": 56436706, "end": 56476171}, {"filename": "/models/suzanne.obj", "start": 56476171, "end": 56554927}, {"filename": "/models/ShootingRange.mtl", "start": 56554927, "end": 56558652}, {"filename": "/models/Medkit.obj", "start": 56558652, "end": 56572984}, {"filename": "/models/StreetLamp.mtl", "start": 56572984, "end": 56573282}, {"filename": "/models/Cone.obj", "start": 56573282, "end": 56583316}, {"filename": "/models/Icosphere.obj", "start": 56583316, "end": 56698975}, {"filename": "/models/ArtilleryIndicator.mtl", "start": 56698975, "end": 56699227}, {"filename": "/models/ArtilleryIndicator.obj", "start": 56699227, "end": 56745653}, {"filename": "/models/de_dust2.obj", "start": 56745653, "end": 58212976}, {"filename": "/models/ShootingRange2.obj", "start": 58212976, "end": 58218215}, {"filename": "/models/Cylinder.obj", "start": 58218215, "end": 58223866}, {"filename": "/models/FlatWorld.mtl", "start": 58223866, "end": 58224106}, {"filename": "/models/SupplyBinLid.mtl", "start": 58224106, "end": 58224383}, {"filename": "/models/Bullet.mtl", "start": 58224383, "end": 58224624}, {"filename": "/models/SupplyBinLid.obj", "start": 58224624, "end": 58229505}, {"filename": "/models/Rifle.obj", "start": 58229505, "end": 58253233}, {"filename": "/models/Bow.mtl", "start": 58253233, "end": 58253895}, {"filename": "/models/HookThrower.mtl", "start": 58253895, "end": 58254260}, {"filename": "/models/Warehouse.mtl", "start": 58254260, "end": 58257516}, {"filename": "/models/Plane.mtl", "start": 58257516, "end": 58257640}, {"filename": "/models/cube.obj", "start": 58257640, "end": 58258667}, {"filename": "/models/BombCrate.mtl", "start": 58258667, "end": 58259032}, {"filename": "/models/de_dust2.mtl", "start": 58259032, "end": 58267820}, {"filename": "/models/Pistol.mtl", "start": 58267820, "end": 58268366}, {"filename": "/models/Portal.obj", "start": 58268366, "end": 58296664}, {"filename": "/models/Explosion.mtl", "start": 58296664, "end": 58297085}, {"filename": "/models/Lift.mtl", "start": 58297085, "end": 58297324}, {"filename": "/models/BombCrate.obj", "start": 58297324, "end": 58298415}, {"filename": "/models/Ammo.obj", "start": 58298415, "end": 58325955}, {"filename": "/models/HookThrower.obj", "start": 58325955, "end": 58328314}, {"filename": "/models/ShootingRange2.mtl", "start": 58328314, "end": 58328559}, {"filename": "/models/Heaven.obj", "start": 58328559, "end": 58609826}, {"filename": "/models/island.obj", "start": 58609826, "end": 60042400}, {"filename": "/models/NewPlayer2.obj", "start": 60042400, "end": 60095166}, {"filename": "/models/Arrow.mtl", "start": 60095166, "end": 60095830}, {"filename": "/models/Warehouse.obj", "start": 60095830, "end": 60395212}, {"filename": "/models/Explosion.obj", "start": 60395212, "end": 61062850}, {"filename": "/models/NewPlayer.mtl", "start": 61062850, "end": 61063618}, {"filename": "/models/Player.mtl", "start": 61063618, "end": 61063858}, {"filename": "/models/Bow.obj", "start": 61063858, "end": 61077453}, {"filename": "/models/Cone.mtl", "start": 61077453, "end": 61077583}, {"filename": "/models/Shotgun.obj", "start": 61077583, "end": 61107530}, {"filename": "/models/Grenade.obj", "start": 61107530, "end": 61354489}, {"filename": "/models/SpectatorArea.mtl", "start": 61354489, "end": 61354733}, {"filename": "/models/Dust2.mtl", "start": 61354733, "end": 61363741}, {"filename": "/models/Grenade.mtl", "start": 61363741, "end": 61364340}, {"filename": "/models/Ammo.mtl", "start": 61364340, "end": 61365000}, {"filename": "/models/SmokeGrenade.mtl", "start": 61365000, "end": 61365421}, {"filename": "/models/Player.obj", "start": 61365421, "end": 62137544}, {"filename": "/models/Artillery.mtl", "start": 62137544, "end": 62137835}, {"filename": "/models/Lift.obj", "start": 62137835, "end": 62152985}, {"filename": "/models/Medkit.mtl", "start": 62152985, "end": 62153471}, {"filename": "/models/Icosphere.mtl", "start": 62153471, "end": 62153696}, {"filename": "/models/Dust2.obj", "start": 62153696, "end": 68807051}, {"filename": "/models/Cube.mtl", "start": 68807051, "end": 68807280}, {"filename": "/models/Portal.mtl", "start": 68807280, "end": 68807703}, {"filename": "/models/SubmachineGun.mtl", "start": 68807703, "end": 68808645}, {"filename": "/models/PlayerMarkerMinimap.obj", "start": 68808645, "end": 68809049}, {"filename": "/models/NewPlayer2.mtl", "start": 68809049, "end": 68809817}, {"filename": "/models/MachineGun.obj", "start": 68809817, "end": 68959354}, {"filename": "/models/PlayerMarkerMinimap.mtl", "start": 68959354, "end": 68959604}, {"filename": "/models/SpectatorArea.obj", "start": 68959604, "end": 68962010}, {"filename": "/models/Cube.obj", "start": 68962010, "end": 68963037}, {"filename": "/models/Bullet.obj", "start": 68963037, "end": 68991306}, {"filename": "/models/NewPlayer.obj", "start": 68991306, "end": 69043628}, {"filename": "/models/SmokeGrenade.obj", "start": 69043628, "end": 69192728}, {"filename": "/models/SupplyBin.mtl", "start": 69192728, "end": 69193151}, {"filename": "/models/BulletTracer.obj", "start": 69193151, "end": 69202580}, {"filename": "/models/MachineGun.mtl", "start": 69202580, "end": 69203867}, {"filename": "/shaders/MeshLightingRectangleLight.fs", "start": 69203867, "end": 69204773}, {"filename": "/shaders/Debug.fs", "start": 69204773, "end": 69204876}, {"filename": "/shaders/ShadowMap.fs", "start": 69204876, "end": 69204993}, {"filename": "/shaders/BloomHighPass.fs", "start": 69204993, "end": 69205514}, {"filename": "/shaders/ShadowMap.vs", "start": 69205514, "end": 69205728}, {"filename": "/shaders/Mesh.vs", "start": 69205728, "end": 69206968}, {"filename": "/shaders/ToneMapping.fs", "start": 69206968, "end": 69207503}, {"filename": "/shaders/MeshDeferred.fs", "start": 69207503, "end": 69209756}, {"filename": "/shaders/GaussianBlur.fs", "start": 69209756, "end": 69210789}, {"filename": "/shaders/MeshLightingDirectionalLight.fs", "start": 69210789, "end": 69211188}, {"filename": "/shaders/Minimap.fs", "start": 69211188, "end": 69211889}, {"filename": "/shaders/MeshLighting.vs", "start": 69211889, "end": 69212485}, {"filename": "/shaders/Skydome.fs", "start": 69212485, "end": 69213717}, {"filename": "/shaders/Quad.fs", "start": 69213717, "end": 69214331}, {"filename": "/shaders/MeshLighting.fs", "start": 69214331, "end": 69223203}, {"filename": "/shaders/FXAA.fs", "start": 69223203, "end": 69226851}, {"filename": "/shaders/Debug.vs", "start": 69226851, "end": 69227063}, {"filename": "/shaders/Antialias.fs", "start": 69227063, "end": 69227643}, {"filename": "/shaders/Quad.vs", "start": 69227643, "end": 69227866}, {"filename": "/shaders/Mesh.fs", "start": 69227866, "end": 69238248}, {"filename": "/shaders/MeshLightingPointLight.fs", "start": 69238248, "end": 69238765}, {"filename": "/sounds/HookThrow.wav", "start": 69238765, "end": 69266457, "audio": 1}, {"filename": "/sounds/HookReel.wav", "start": 69266457, "end": 69324869, "audio": 1}, {"filename": "/sounds/PortalStart.wav", "start": 69324869, "end": 69397617, "audio": 1}, {"filename": "/sounds/ueh.wav", "start": 69397617, "end": 69432477, "audio": 1}, {"filename": "/sounds/reload.wav", "start": 69432477, "end": 69546185, "audio": 1}, {"filename": "/sounds/bang.wav", "start": 69546185, "end": 69673771, "audio": 1}, {"filename": "/sounds/incoming.wav", "start": 69673771, "end": 69828493, "audio": 1}, {"filename": "/sounds/boom.wav", "start": 69828493, "end": 69900217, "audio": 1}, {"filename": "/sounds/PortalEnd.wav", "start": 69900217, "end": 69971941, "audio": 1}, {"filename": "/sounds/GrenadeOut.wav", "start": 69971941, "end": 70051857, "audio": 1}, {"filename": "/sounds/boom-old1.wav", "start": 70051857, "end": 70123581, "audio": 1}, {"filename": "/sounds/Archer/arrow-pullback.wav", "start": 70123581, "end": 70271153, "audio": 1}, {"filename": "/sounds/Archer/arrow-shoot.wav", "start": 70271153, "end": 70385953, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-shoot.wav", "start": 70385953, "end": 70537623, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-activate.wav", "start": 70537623, "end": 70861327, "audio": 1}, {"filename": "/sounds/Archer/arrow-jump.wav", "start": 70861327, "end": 71131775, "audio": 1}, {"filename": "/animations/Player.bvh", "start": 71131775, "end": 71164534}, {"filename": "/animations/Player.mtl", "start": 71164534, "end": 71165302}, {"filename": "/animations/Player.obj", "start": 71165302, "end": 71217530}, {"filename": "/scripts/BouncingBall.w", "start": 71217530, "end": 71218176}, {"filename": "/scripts/LootZone.w", "start": 71218176, "end": 71219659}, {"filename": "/scripts/Marine.w", "start": 71219659, "end": 71220015}, {"filename": "/scripts/Dummy.w", "start": 71220015, "end": 71220159}, {"filename": "/scripts/Test.w", "start": 71220159, "end": 71220250}, {"filename": "/scripts/Archer.w", "start": 71220250, "end": 71220589}, {"filename": "/scripts/1-Types.w", "start": 71220589, "end": 71222981}, {"filename": "/scripts/6-Gun.w", "start": 71222981, "end": 71223083}, {"filename": "/scripts/5-Weapon.w", "start": 71223083, "end": 71223489}, {"filename": "/scripts/2-Object.w", "start": 71223489, "end": 71225862}, {"filename": "/scripts/Bombmaker.w", "start": 71225862, "end": 71226198}, {"filename": "/scripts/SmokeExplosion.w", "start": 71226198, "end": 71226999}, {"filename": "/scripts/Hookman.w", "start": 71226999, "end": 71227334}, {"filename": "/scripts/SmokeGrenade.w", "start": 71227334, "end": 71227825}, {"filename": "/scripts/4-Player.w", "start": 71227825, "end": 71228446}, {"filename": "/scripts/3-Math.w", "start": 71228446, "end": 71228532}, {"filename": "/scripts/Explosion.w", "start": 71228532, "end": 71229214}], "remote_package_size": 71229214, "package_uuid": "43ce95c0-17c9-434e-8414-7543de990e47"});

  })();
