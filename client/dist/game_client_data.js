
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
   loadPackage({"files": [{"filename": "/maps/dust2.json", "start": 0, "end": 3363}, {"filename": "/maps/test-range.json.20211210-231432.bak", "start": 3363, "end": 6201}, {"filename": "/maps/dust2.json.20211211-171302.bak", "start": 6201, "end": 8971}, {"filename": "/maps/test.json", "start": 8971, "end": 9626}, {"filename": "/maps/test-range.json.20211128-185851.bak", "start": 9626, "end": 12417}, {"filename": "/maps/map1.json.20211211-134645.bak", "start": 12417, "end": 37409}, {"filename": "/maps/dust2.json.20211211-171053.bak", "start": 37409, "end": 40174}, {"filename": "/maps/test-range.json.20211203-235248.bak", "start": 40174, "end": 43025}, {"filename": "/maps/test-range.json", "start": 43025, "end": 45939}, {"filename": "/maps/dust2.json.20211211-165858.bak", "start": 45939, "end": 46040}, {"filename": "/maps/map1.json", "start": 46040, "end": 78275}, {"filename": "/maps/dust2.json.20211211-171036.bak", "start": 78275, "end": 81016}, {"filename": "/maps/dust2.json.20211211-171205.bak", "start": 81016, "end": 83781}, {"filename": "/maps/test-range.json.20211127-155151.bak", "start": 83781, "end": 86645}, {"filename": "/maps/test-range.json.20211205-125109.bak", "start": 86645, "end": 89494}, {"filename": "/maps/map1.json.20211211-134715.bak", "start": 89494, "end": 121729}, {"filename": "/maps/dust2.json.20211212-193309.bak", "start": 121729, "end": 124500}, {"filename": "/maps/dust2.json.20211212-193510.bak", "start": 124500, "end": 127877}, {"filename": "/textures/Mountains.png", "start": 127877, "end": 204695}, {"filename": "/textures/uvmap.jpg", "start": 204695, "end": 1186047}, {"filename": "/textures/SupplyBinCover.png", "start": 1186047, "end": 1192137}, {"filename": "/textures/SolomonFace.jpg", "start": 1192137, "end": 2199949}, {"filename": "/textures/BulletTracer.png", "start": 2199949, "end": 2233716}, {"filename": "/textures/sam_texture.jpg", "start": 2233716, "end": 3198490}, {"filename": "/textures/Skydome.png", "start": 3198490, "end": 4658273}, {"filename": "/textures/Artillery.png", "start": 4658273, "end": 5775500}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Metalness.jpg", "start": 5775500, "end": 5946694}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Displacement.jpg", "start": 5946694, "end": 6083886}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Color.jpg", "start": 6083886, "end": 6458045}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Roughness.jpg", "start": 6458045, "end": 6864938}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Normal.jpg", "start": 6864938, "end": 7572865}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_BaseColor.png", "start": 7572865, "end": 8356885}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Roughness.png", "start": 8356885, "end": 8625316}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_AO.png", "start": 8625316, "end": 8651808}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Normal.png", "start": 8651808, "end": 9322367}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_AlbedoTransparency.png", "start": 9322367, "end": 9406583}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_MetallicSmoothness.png", "start": 9406583, "end": 9414723}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_Normal.png", "start": 9414723, "end": 9446091}, {"filename": "/textures/Dust2/de_dust2_material_20.png", "start": 9446091, "end": 9450922}, {"filename": "/textures/Dust2/de_dust2_material_24.png", "start": 9450922, "end": 9454412}, {"filename": "/textures/Dust2/de_dust2_material_28.png", "start": 9454412, "end": 9479745}, {"filename": "/textures/Dust2/de_dust2_material_29.png", "start": 9479745, "end": 9504972}, {"filename": "/textures/Dust2/de_dust2_material_21.png", "start": 9504972, "end": 9509735}, {"filename": "/textures/Dust2/de_dust2_material_3.png", "start": 9509735, "end": 9509838}, {"filename": "/textures/Dust2/de_dust2_material_18.png", "start": 9509838, "end": 9509934}, {"filename": "/textures/Dust2/de_dust2_material_5.png", "start": 9509934, "end": 9573887}, {"filename": "/textures/Dust2/de_dust2_material_9.png", "start": 9573887, "end": 9578902}, {"filename": "/textures/Dust2/de_dust2_material_23.png", "start": 9578902, "end": 9606421}, {"filename": "/textures/Dust2/de_dust2_material_31.png", "start": 9606421, "end": 9611115}, {"filename": "/textures/Dust2/de_dust2_material_14.png", "start": 9611115, "end": 9629536}, {"filename": "/textures/Dust2/de_dust2_material_17.png", "start": 9629536, "end": 9646345}, {"filename": "/textures/Dust2/de_dust2_material_1.png", "start": 9646345, "end": 9677164}, {"filename": "/textures/Dust2/de_dust2_material_32.png", "start": 9677164, "end": 9680186}, {"filename": "/textures/Dust2/de_dust2_material_8.png", "start": 9680186, "end": 9733496}, {"filename": "/textures/Dust2/de_dust2_material_4.png", "start": 9733496, "end": 9763350}, {"filename": "/textures/Dust2/de_dust2_material_33.png", "start": 9763350, "end": 9764145}, {"filename": "/textures/Dust2/de_dust2_material_6.png", "start": 9764145, "end": 9781075}, {"filename": "/textures/Dust2/de_dust2_material_2.png", "start": 9781075, "end": 9786101}, {"filename": "/textures/Dust2/de_dust2_material_7.png", "start": 9786101, "end": 9814974}, {"filename": "/textures/Dust2/de_dust2_material_19.png", "start": 9814974, "end": 9821764}, {"filename": "/textures/Dust2/de_dust2_material_13.png", "start": 9821764, "end": 9841121}, {"filename": "/textures/Dust2/de_dust2_material_16.png", "start": 9841121, "end": 9870941}, {"filename": "/textures/Dust2/de_dust2_material_10.png", "start": 9870941, "end": 9919290}, {"filename": "/textures/Dust2/de_dust2_material_12.png", "start": 9919290, "end": 9936337}, {"filename": "/textures/Dust2/de_dust2_material_15.png", "start": 9936337, "end": 9978212}, {"filename": "/textures/Dust2/de_dust2_material_27.png", "start": 9978212, "end": 10007810}, {"filename": "/textures/Dust2/de_dust2_material_30.png", "start": 10007810, "end": 10034888}, {"filename": "/textures/Dust2/de_dust2_material_22.png", "start": 10034888, "end": 10051887}, {"filename": "/textures/Dust2/de_dust2_material_25.png", "start": 10051887, "end": 10110422}, {"filename": "/textures/Dust2/de_dust2_material_0.png", "start": 10110422, "end": 10114387}, {"filename": "/textures/Dust2/de_dust2_material_26.png", "start": 10114387, "end": 10139391}, {"filename": "/textures/Dust2/de_dust2_material_11.png", "start": 10139391, "end": 10169106}, {"filename": "/textures/MuzzleFlash/muzzle4.png", "start": 10169106, "end": 10192407}, {"filename": "/textures/MuzzleFlash/muzzle5.png", "start": 10192407, "end": 10216603}, {"filename": "/textures/MuzzleFlash/muzzle2.png", "start": 10216603, "end": 10237971}, {"filename": "/textures/MuzzleFlash/muzzle1.png", "start": 10237971, "end": 10263743}, {"filename": "/textures/MuzzleFlash/muzzle3.png", "start": 10263743, "end": 10284192}, {"filename": "/textures/BulletHole/BulletHole.png", "start": 10284192, "end": 10316396}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Roughness.jpg", "start": 10316396, "end": 10690418}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_AmbientOcclusion.jpg", "start": 10690418, "end": 11070139}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Displacement.jpg", "start": 11070139, "end": 11587034}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Normal.jpg", "start": 11587034, "end": 12611523}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Color.jpg", "start": 12611523, "end": 13411604}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Normal.jpg", "start": 13411604, "end": 14646872}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Color.jpg", "start": 14646872, "end": 15632507}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Opacity.jpg", "start": 15632507, "end": 15950985}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Color.jpg", "start": 15950985, "end": 16217243}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Roughness.jpg", "start": 16217243, "end": 16516664}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Normal.jpg", "start": 16516664, "end": 17112021}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Displacement.jpg", "start": 17112021, "end": 17372628}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Normal.jpg", "start": 17372628, "end": 19665012}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Color.jpg", "start": 19665012, "end": 21192473}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Displacement.jpg", "start": 21192473, "end": 21489270}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Roughness.jpg", "start": 21489270, "end": 22154326}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_AmbientOcclusion.jpg", "start": 22154326, "end": 22754455}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Roughness.jpg", "start": 22754455, "end": 23434548}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Color.jpg", "start": 23434548, "end": 24856238}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Normal.jpg", "start": 24856238, "end": 26522793}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Displacement.jpg", "start": 26522793, "end": 26907222}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_AmbientOcclusion.jpg", "start": 26907222, "end": 27507556}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Emission.jpg", "start": 27507556, "end": 28838539}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Roughness.jpg", "start": 28838539, "end": 29409401}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Displacement.jpg", "start": 29409401, "end": 29706237}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Normal.jpg", "start": 29706237, "end": 31402598}, {"filename": "/textures/Lava004_1K-JPG/Water.jpg", "start": 31402598, "end": 32838498}, {"filename": "/textures/Lava004_1K-JPG/LavaGrayscale.jpg", "start": 32838498, "end": 33421360}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Color.jpg", "start": 33421360, "end": 34754791}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Roughness.jpg", "start": 34754791, "end": 35388048}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Normal.jpg", "start": 35388048, "end": 36557588}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Color.jpg", "start": 36557588, "end": 37625061}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Displacement.jpg", "start": 37625061, "end": 38251482}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Color.jpg", "start": 38251482, "end": 39321913}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Roughness.jpg", "start": 39321913, "end": 40142672}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Displacement.jpg", "start": 40142672, "end": 40765416}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Normal.jpg", "start": 40765416, "end": 43114562}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Color.jpg", "start": 43114562, "end": 44207546}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Displacement.jpg", "start": 44207546, "end": 44998106}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Roughness.jpg", "start": 44998106, "end": 45578206}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Normal.jpg", "start": 45578206, "end": 45918055}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_basecolor.jpg", "start": 45918055, "end": 45957866}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_normal.jpg", "start": 45957866, "end": 46218123}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Displacement.jpg", "start": 46218123, "end": 46647337}, {"filename": "/textures/Metal038_1K-JPG/MetalGreen.jpg", "start": 46647337, "end": 47388242}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Color.jpg", "start": 47388242, "end": 48095111}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Normal.jpg", "start": 48095111, "end": 49160653}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Roughness.jpg", "start": 49160653, "end": 49532930}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Metalness.jpg", "start": 49532930, "end": 49662934}, {"filename": "/models/Artillery.obj", "start": 49662934, "end": 51318372}, {"filename": "/models/FlatWorld.obj", "start": 51318372, "end": 51319435}, {"filename": "/models/Heaven.mtl", "start": 51319435, "end": 51320591}, {"filename": "/models/Rifle.mtl", "start": 51320591, "end": 51321076}, {"filename": "/models/BulletTracer.mtl", "start": 51321076, "end": 51321357}, {"filename": "/models/Arrow.obj", "start": 51321357, "end": 51328046}, {"filename": "/models/Pistol.obj", "start": 51328046, "end": 51351932}, {"filename": "/models/Shotgun.mtl", "start": 51351932, "end": 51352605}, {"filename": "/models/SubmachineGun.obj", "start": 51352605, "end": 51388668}, {"filename": "/models/ShootingRange.obj", "start": 51388668, "end": 56512465}, {"filename": "/models/SupplyBin.obj", "start": 56512465, "end": 56524076}, {"filename": "/models/Plane.obj", "start": 56524076, "end": 56524416}, {"filename": "/models/Quad.obj", "start": 56524416, "end": 56524760}, {"filename": "/models/StreetLamp.obj", "start": 56524760, "end": 56564225}, {"filename": "/models/suzanne.obj", "start": 56564225, "end": 56642981}, {"filename": "/models/ShootingRange.mtl", "start": 56642981, "end": 56646706}, {"filename": "/models/Medkit.obj", "start": 56646706, "end": 56661038}, {"filename": "/models/StreetLamp.mtl", "start": 56661038, "end": 56661336}, {"filename": "/models/Cone.obj", "start": 56661336, "end": 56671370}, {"filename": "/models/Icosphere.obj", "start": 56671370, "end": 56787029}, {"filename": "/models/ArtilleryIndicator.mtl", "start": 56787029, "end": 56787281}, {"filename": "/models/ArtilleryIndicator.obj", "start": 56787281, "end": 56833707}, {"filename": "/models/de_dust2.obj", "start": 56833707, "end": 58301030}, {"filename": "/models/ShootingRange2.obj", "start": 58301030, "end": 58306269}, {"filename": "/models/Cylinder.obj", "start": 58306269, "end": 58311920}, {"filename": "/models/FlatWorld.mtl", "start": 58311920, "end": 58312160}, {"filename": "/models/SupplyBinLid.mtl", "start": 58312160, "end": 58312437}, {"filename": "/models/Bullet.mtl", "start": 58312437, "end": 58312678}, {"filename": "/models/SupplyBinLid.obj", "start": 58312678, "end": 58317559}, {"filename": "/models/Rifle.obj", "start": 58317559, "end": 58341287}, {"filename": "/models/Bow.mtl", "start": 58341287, "end": 58341949}, {"filename": "/models/HookThrower.mtl", "start": 58341949, "end": 58342314}, {"filename": "/models/Warehouse.mtl", "start": 58342314, "end": 58345570}, {"filename": "/models/Plane.mtl", "start": 58345570, "end": 58345694}, {"filename": "/models/cube.obj", "start": 58345694, "end": 58346721}, {"filename": "/models/BombCrate.mtl", "start": 58346721, "end": 58347086}, {"filename": "/models/de_dust2.mtl", "start": 58347086, "end": 58355874}, {"filename": "/models/Pistol.mtl", "start": 58355874, "end": 58356420}, {"filename": "/models/Portal.obj", "start": 58356420, "end": 58384718}, {"filename": "/models/Explosion.mtl", "start": 58384718, "end": 58385139}, {"filename": "/models/Lift.mtl", "start": 58385139, "end": 58385378}, {"filename": "/models/BombCrate.obj", "start": 58385378, "end": 58386469}, {"filename": "/models/Ammo.obj", "start": 58386469, "end": 58414009}, {"filename": "/models/HookThrower.obj", "start": 58414009, "end": 58416368}, {"filename": "/models/ShootingRange2.mtl", "start": 58416368, "end": 58416613}, {"filename": "/models/Heaven.obj", "start": 58416613, "end": 58697880}, {"filename": "/models/island.obj", "start": 58697880, "end": 60130454}, {"filename": "/models/Arrow.mtl", "start": 60130454, "end": 60131118}, {"filename": "/models/Warehouse.obj", "start": 60131118, "end": 60430500}, {"filename": "/models/Explosion.obj", "start": 60430500, "end": 61098138}, {"filename": "/models/NewPlayer.mtl", "start": 61098138, "end": 61098906}, {"filename": "/models/Player.mtl", "start": 61098906, "end": 61099146}, {"filename": "/models/Bow.obj", "start": 61099146, "end": 61112741}, {"filename": "/models/Cone.mtl", "start": 61112741, "end": 61112871}, {"filename": "/models/Shotgun.obj", "start": 61112871, "end": 61142818}, {"filename": "/models/Grenade.obj", "start": 61142818, "end": 61389777}, {"filename": "/models/SpectatorArea.mtl", "start": 61389777, "end": 61390021}, {"filename": "/models/Grenade.mtl", "start": 61390021, "end": 61390620}, {"filename": "/models/Ammo.mtl", "start": 61390620, "end": 61391280}, {"filename": "/models/SmokeGrenade.mtl", "start": 61391280, "end": 61391701}, {"filename": "/models/Player.obj", "start": 61391701, "end": 62163824}, {"filename": "/models/Artillery.mtl", "start": 62163824, "end": 62164115}, {"filename": "/models/Lift.obj", "start": 62164115, "end": 62179265}, {"filename": "/models/Medkit.mtl", "start": 62179265, "end": 62179751}, {"filename": "/models/Icosphere.mtl", "start": 62179751, "end": 62179976}, {"filename": "/models/Cube.mtl", "start": 62179976, "end": 62180205}, {"filename": "/models/Portal.mtl", "start": 62180205, "end": 62180628}, {"filename": "/models/SubmachineGun.mtl", "start": 62180628, "end": 62181570}, {"filename": "/models/PlayerMarkerMinimap.obj", "start": 62181570, "end": 62181974}, {"filename": "/models/MachineGun.obj", "start": 62181974, "end": 62331511}, {"filename": "/models/PlayerMarkerMinimap.mtl", "start": 62331511, "end": 62331761}, {"filename": "/models/SpectatorArea.obj", "start": 62331761, "end": 62334167}, {"filename": "/models/Cube.obj", "start": 62334167, "end": 62335194}, {"filename": "/models/Bullet.obj", "start": 62335194, "end": 62363463}, {"filename": "/models/NewPlayer.obj", "start": 62363463, "end": 62415785}, {"filename": "/models/SmokeGrenade.obj", "start": 62415785, "end": 62564885}, {"filename": "/models/SupplyBin.mtl", "start": 62564885, "end": 62565308}, {"filename": "/models/BulletTracer.obj", "start": 62565308, "end": 62574737}, {"filename": "/models/MachineGun.mtl", "start": 62574737, "end": 62576024}, {"filename": "/shaders/MeshLightingRectangleLight.fs", "start": 62576024, "end": 62576930}, {"filename": "/shaders/Debug.fs", "start": 62576930, "end": 62577033}, {"filename": "/shaders/ShadowMap.fs", "start": 62577033, "end": 62577150}, {"filename": "/shaders/BloomHighPass.fs", "start": 62577150, "end": 62577671}, {"filename": "/shaders/ShadowMap.vs", "start": 62577671, "end": 62577885}, {"filename": "/shaders/Mesh.vs", "start": 62577885, "end": 62579125}, {"filename": "/shaders/ToneMapping.fs", "start": 62579125, "end": 62579660}, {"filename": "/shaders/MeshDeferred.fs", "start": 62579660, "end": 62581913}, {"filename": "/shaders/GaussianBlur.fs", "start": 62581913, "end": 62582946}, {"filename": "/shaders/MeshLightingDirectionalLight.fs", "start": 62582946, "end": 62583345}, {"filename": "/shaders/Minimap.fs", "start": 62583345, "end": 62584046}, {"filename": "/shaders/MeshLighting.vs", "start": 62584046, "end": 62584642}, {"filename": "/shaders/Skydome.fs", "start": 62584642, "end": 62585874}, {"filename": "/shaders/Quad.fs", "start": 62585874, "end": 62586488}, {"filename": "/shaders/MeshLighting.fs", "start": 62586488, "end": 62595360}, {"filename": "/shaders/FXAA.fs", "start": 62595360, "end": 62599008}, {"filename": "/shaders/Debug.vs", "start": 62599008, "end": 62599220}, {"filename": "/shaders/Antialias.fs", "start": 62599220, "end": 62599800}, {"filename": "/shaders/Quad.vs", "start": 62599800, "end": 62600023}, {"filename": "/shaders/Mesh.fs", "start": 62600023, "end": 62610405}, {"filename": "/shaders/MeshLightingPointLight.fs", "start": 62610405, "end": 62610922}, {"filename": "/sounds/HookThrow.wav", "start": 62610922, "end": 62638614, "audio": 1}, {"filename": "/sounds/HookReel.wav", "start": 62638614, "end": 62697026, "audio": 1}, {"filename": "/sounds/PortalStart.wav", "start": 62697026, "end": 62769774, "audio": 1}, {"filename": "/sounds/ueh.wav", "start": 62769774, "end": 62804634, "audio": 1}, {"filename": "/sounds/reload.wav", "start": 62804634, "end": 62918342, "audio": 1}, {"filename": "/sounds/bang.wav", "start": 62918342, "end": 63045928, "audio": 1}, {"filename": "/sounds/incoming.wav", "start": 63045928, "end": 63200650, "audio": 1}, {"filename": "/sounds/boom.wav", "start": 63200650, "end": 63272374, "audio": 1}, {"filename": "/sounds/PortalEnd.wav", "start": 63272374, "end": 63344098, "audio": 1}, {"filename": "/sounds/GrenadeOut.wav", "start": 63344098, "end": 63424014, "audio": 1}, {"filename": "/sounds/boom-old1.wav", "start": 63424014, "end": 63495738, "audio": 1}, {"filename": "/sounds/Archer/arrow-pullback.wav", "start": 63495738, "end": 63643310, "audio": 1}, {"filename": "/sounds/Archer/arrow-shoot.wav", "start": 63643310, "end": 63758110, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-shoot.wav", "start": 63758110, "end": 63909780, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-activate.wav", "start": 63909780, "end": 64233484, "audio": 1}, {"filename": "/sounds/Archer/arrow-jump.wav", "start": 64233484, "end": 64503932, "audio": 1}, {"filename": "/scripts/BouncingBall.w", "start": 64503932, "end": 64504578}, {"filename": "/scripts/LootZone.w", "start": 64504578, "end": 64504902}, {"filename": "/scripts/Marine.w", "start": 64504902, "end": 64505258}, {"filename": "/scripts/Dummy.w", "start": 64505258, "end": 64505402}, {"filename": "/scripts/Test.w", "start": 64505402, "end": 64505493}, {"filename": "/scripts/Archer.w", "start": 64505493, "end": 64505832}, {"filename": "/scripts/1-Types.w", "start": 64505832, "end": 64507905}, {"filename": "/scripts/6-Gun.w", "start": 64507905, "end": 64508007}, {"filename": "/scripts/5-Weapon.w", "start": 64508007, "end": 64508413}, {"filename": "/scripts/2-Object.w", "start": 64508413, "end": 64510786}, {"filename": "/scripts/Bombmaker.w", "start": 64510786, "end": 64511122}, {"filename": "/scripts/SmokeExplosion.w", "start": 64511122, "end": 64511923}, {"filename": "/scripts/Hookman.w", "start": 64511923, "end": 64512258}, {"filename": "/scripts/SmokeGrenade.w", "start": 64512258, "end": 64512749}, {"filename": "/scripts/4-Player.w", "start": 64512749, "end": 64513370}, {"filename": "/scripts/3-Math.w", "start": 64513370, "end": 64513456}, {"filename": "/scripts/Explosion.w", "start": 64513456, "end": 64514138}], "remote_package_size": 64514138, "package_uuid": "40e3daf6-4efc-4048-9bd4-c24a9122ecca"});
  
  })();
  