
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
   loadPackage({"files": [{"filename": "/maps/dust2.json", "start": 0, "end": 4025}, {"filename": "/maps/test-range.json.20211210-231432.bak", "start": 4025, "end": 6863}, {"filename": "/maps/dust2.json.20211211-171302.bak", "start": 6863, "end": 9633}, {"filename": "/maps/test.json", "start": 9633, "end": 10288}, {"filename": "/maps/test-range.json.20211128-185851.bak", "start": 10288, "end": 13079}, {"filename": "/maps/map1.json.20211211-134645.bak", "start": 13079, "end": 38071}, {"filename": "/maps/dust2.json.20211211-171053.bak", "start": 38071, "end": 40836}, {"filename": "/maps/test-range.json.20211203-235248.bak", "start": 40836, "end": 43687}, {"filename": "/maps/test-range.json", "start": 43687, "end": 46601}, {"filename": "/maps/dust2.json.20211211-165858.bak", "start": 46601, "end": 46702}, {"filename": "/maps/dust2.json.20211218-221225.bak", "start": 46702, "end": 50064}, {"filename": "/maps/map1.json", "start": 50064, "end": 82299}, {"filename": "/maps/dust2.json.20211211-171036.bak", "start": 82299, "end": 85040}, {"filename": "/maps/dust2.json.20211211-171205.bak", "start": 85040, "end": 87805}, {"filename": "/maps/dust2.json.20211219-141925.bak", "start": 87805, "end": 91167}, {"filename": "/maps/dust2.json.20211219-142224.bak", "start": 91167, "end": 95095}, {"filename": "/maps/test-range.json.20211127-155151.bak", "start": 95095, "end": 97959}, {"filename": "/maps/test-range.json.20211205-125109.bak", "start": 97959, "end": 100808}, {"filename": "/maps/map1.json.20211211-134715.bak", "start": 100808, "end": 133043}, {"filename": "/maps/dust2.json.20211212-193309.bak", "start": 133043, "end": 135814}, {"filename": "/maps/dust2.json.20211218-221137.bak", "start": 135814, "end": 139177}, {"filename": "/maps/dust2.json.20211212-193510.bak", "start": 139177, "end": 142554}, {"filename": "/textures/Mountains.png", "start": 142554, "end": 219372}, {"filename": "/textures/uvmap.jpg", "start": 219372, "end": 1200724}, {"filename": "/textures/SupplyBinCover.png", "start": 1200724, "end": 1206814}, {"filename": "/textures/SolomonFace.jpg", "start": 1206814, "end": 2214626}, {"filename": "/textures/BulletTracer.png", "start": 2214626, "end": 2248393}, {"filename": "/textures/sam_texture.jpg", "start": 2248393, "end": 3213167}, {"filename": "/textures/Skydome.png", "start": 3213167, "end": 4672950}, {"filename": "/textures/Artillery.png", "start": 4672950, "end": 5790177}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Metalness.jpg", "start": 5790177, "end": 5961371}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Displacement.jpg", "start": 5961371, "end": 6098563}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Color.jpg", "start": 6098563, "end": 6472722}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Roughness.jpg", "start": 6472722, "end": 6879615}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Normal.jpg", "start": 6879615, "end": 7587542}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_BaseColor.png", "start": 7587542, "end": 8371562}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Roughness.png", "start": 8371562, "end": 8639993}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_AO.png", "start": 8639993, "end": 8666485}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Normal.png", "start": 8666485, "end": 9337044}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_AlbedoTransparency.png", "start": 9337044, "end": 9421260}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_MetallicSmoothness.png", "start": 9421260, "end": 9429400}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_Normal.png", "start": 9429400, "end": 9460768}, {"filename": "/textures/Dust2/de_dust2_material_20.png", "start": 9460768, "end": 9465599}, {"filename": "/textures/Dust2/de_dust2_material_24.png", "start": 9465599, "end": 9469089}, {"filename": "/textures/Dust2/de_dust2_material_28.png", "start": 9469089, "end": 9494422}, {"filename": "/textures/Dust2/de_dust2_material_29.png", "start": 9494422, "end": 9519649}, {"filename": "/textures/Dust2/de_dust2_material_21.png", "start": 9519649, "end": 9524412}, {"filename": "/textures/Dust2/de_dust2_material_3.png", "start": 9524412, "end": 9524515}, {"filename": "/textures/Dust2/de_dust2_material_18.png", "start": 9524515, "end": 9524611}, {"filename": "/textures/Dust2/de_dust2_material_5.png", "start": 9524611, "end": 9588564}, {"filename": "/textures/Dust2/de_dust2_material_9.png", "start": 9588564, "end": 9593579}, {"filename": "/textures/Dust2/de_dust2_material_23.png", "start": 9593579, "end": 9621098}, {"filename": "/textures/Dust2/de_dust2_material_31.png", "start": 9621098, "end": 9625792}, {"filename": "/textures/Dust2/de_dust2_material_14.png", "start": 9625792, "end": 9644213}, {"filename": "/textures/Dust2/de_dust2_material_17.png", "start": 9644213, "end": 9661022}, {"filename": "/textures/Dust2/de_dust2_material_1.png", "start": 9661022, "end": 9691841}, {"filename": "/textures/Dust2/de_dust2_material_32.png", "start": 9691841, "end": 9694863}, {"filename": "/textures/Dust2/de_dust2_material_8.png", "start": 9694863, "end": 9748173}, {"filename": "/textures/Dust2/de_dust2_material_4.png", "start": 9748173, "end": 9778027}, {"filename": "/textures/Dust2/de_dust2_material_33.png", "start": 9778027, "end": 9778822}, {"filename": "/textures/Dust2/de_dust2_material_6.png", "start": 9778822, "end": 9795752}, {"filename": "/textures/Dust2/de_dust2_material_2.png", "start": 9795752, "end": 9800778}, {"filename": "/textures/Dust2/de_dust2_material_7.png", "start": 9800778, "end": 9829651}, {"filename": "/textures/Dust2/de_dust2_material_19.png", "start": 9829651, "end": 9836441}, {"filename": "/textures/Dust2/de_dust2_material_13.png", "start": 9836441, "end": 9855798}, {"filename": "/textures/Dust2/de_dust2_material_16.png", "start": 9855798, "end": 9885618}, {"filename": "/textures/Dust2/de_dust2_material_10.png", "start": 9885618, "end": 9933967}, {"filename": "/textures/Dust2/de_dust2_material_12.png", "start": 9933967, "end": 9951014}, {"filename": "/textures/Dust2/de_dust2_material_15.png", "start": 9951014, "end": 9992889}, {"filename": "/textures/Dust2/de_dust2_material_27.png", "start": 9992889, "end": 10022487}, {"filename": "/textures/Dust2/de_dust2_material_30.png", "start": 10022487, "end": 10049565}, {"filename": "/textures/Dust2/de_dust2_material_22.png", "start": 10049565, "end": 10066564}, {"filename": "/textures/Dust2/de_dust2_material_25.png", "start": 10066564, "end": 10125099}, {"filename": "/textures/Dust2/de_dust2_material_0.png", "start": 10125099, "end": 10129064}, {"filename": "/textures/Dust2/de_dust2_material_26.png", "start": 10129064, "end": 10154068}, {"filename": "/textures/Dust2/de_dust2_material_11.png", "start": 10154068, "end": 10183783}, {"filename": "/textures/MuzzleFlash/muzzle4.png", "start": 10183783, "end": 10207084}, {"filename": "/textures/MuzzleFlash/muzzle5.png", "start": 10207084, "end": 10231280}, {"filename": "/textures/MuzzleFlash/muzzle2.png", "start": 10231280, "end": 10252648}, {"filename": "/textures/MuzzleFlash/muzzle1.png", "start": 10252648, "end": 10278420}, {"filename": "/textures/MuzzleFlash/muzzle3.png", "start": 10278420, "end": 10298869}, {"filename": "/textures/BulletHole/BulletHole.png", "start": 10298869, "end": 10331073}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Roughness.jpg", "start": 10331073, "end": 10705095}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_AmbientOcclusion.jpg", "start": 10705095, "end": 11084816}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Displacement.jpg", "start": 11084816, "end": 11601711}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Normal.jpg", "start": 11601711, "end": 12626200}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Color.jpg", "start": 12626200, "end": 13426281}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Normal.jpg", "start": 13426281, "end": 14661549}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Color.jpg", "start": 14661549, "end": 15647184}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Opacity.jpg", "start": 15647184, "end": 15965662}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Color.jpg", "start": 15965662, "end": 16231920}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Roughness.jpg", "start": 16231920, "end": 16531341}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Normal.jpg", "start": 16531341, "end": 17126698}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Displacement.jpg", "start": 17126698, "end": 17387305}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Normal.jpg", "start": 17387305, "end": 19679689}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Color.jpg", "start": 19679689, "end": 21207150}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Displacement.jpg", "start": 21207150, "end": 21503947}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Roughness.jpg", "start": 21503947, "end": 22169003}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_AmbientOcclusion.jpg", "start": 22169003, "end": 22769132}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Roughness.jpg", "start": 22769132, "end": 23449225}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Color.jpg", "start": 23449225, "end": 24870915}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Normal.jpg", "start": 24870915, "end": 26537470}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Displacement.jpg", "start": 26537470, "end": 26921899}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_AmbientOcclusion.jpg", "start": 26921899, "end": 27522233}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Emission.jpg", "start": 27522233, "end": 28853216}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Roughness.jpg", "start": 28853216, "end": 29424078}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Displacement.jpg", "start": 29424078, "end": 29720914}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Normal.jpg", "start": 29720914, "end": 31417275}, {"filename": "/textures/Lava004_1K-JPG/Water.jpg", "start": 31417275, "end": 32853175}, {"filename": "/textures/Lava004_1K-JPG/LavaGrayscale.jpg", "start": 32853175, "end": 33436037}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Color.jpg", "start": 33436037, "end": 34769468}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Roughness.jpg", "start": 34769468, "end": 35402725}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Normal.jpg", "start": 35402725, "end": 36572265}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Color.jpg", "start": 36572265, "end": 37639738}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Displacement.jpg", "start": 37639738, "end": 38266159}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Color.jpg", "start": 38266159, "end": 39336590}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Roughness.jpg", "start": 39336590, "end": 40157349}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Displacement.jpg", "start": 40157349, "end": 40780093}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Normal.jpg", "start": 40780093, "end": 43129239}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Color.jpg", "start": 43129239, "end": 44222223}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Displacement.jpg", "start": 44222223, "end": 45012783}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Roughness.jpg", "start": 45012783, "end": 45592883}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Normal.jpg", "start": 45592883, "end": 45932732}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_basecolor.jpg", "start": 45932732, "end": 45972543}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_normal.jpg", "start": 45972543, "end": 46232800}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Displacement.jpg", "start": 46232800, "end": 46662014}, {"filename": "/textures/Metal038_1K-JPG/MetalGreen.jpg", "start": 46662014, "end": 47402919}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Color.jpg", "start": 47402919, "end": 48109788}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Normal.jpg", "start": 48109788, "end": 49175330}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Roughness.jpg", "start": 49175330, "end": 49547607}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Metalness.jpg", "start": 49547607, "end": 49677611}, {"filename": "/models/Artillery.obj", "start": 49677611, "end": 51333049}, {"filename": "/models/FlatWorld.obj", "start": 51333049, "end": 51334112}, {"filename": "/models/Heaven.mtl", "start": 51334112, "end": 51335268}, {"filename": "/models/Rifle.mtl", "start": 51335268, "end": 51335753}, {"filename": "/models/BulletTracer.mtl", "start": 51335753, "end": 51336034}, {"filename": "/models/Arrow.obj", "start": 51336034, "end": 51342723}, {"filename": "/models/Pistol.obj", "start": 51342723, "end": 51366609}, {"filename": "/models/Shotgun.mtl", "start": 51366609, "end": 51367282}, {"filename": "/models/SubmachineGun.obj", "start": 51367282, "end": 51403345}, {"filename": "/models/ShootingRange.obj", "start": 51403345, "end": 56527142}, {"filename": "/models/SupplyBin.obj", "start": 56527142, "end": 56538753}, {"filename": "/models/Plane.obj", "start": 56538753, "end": 56539093}, {"filename": "/models/Quad.obj", "start": 56539093, "end": 56539437}, {"filename": "/models/StreetLamp.obj", "start": 56539437, "end": 56578902}, {"filename": "/models/suzanne.obj", "start": 56578902, "end": 56657658}, {"filename": "/models/ShootingRange.mtl", "start": 56657658, "end": 56661383}, {"filename": "/models/Medkit.obj", "start": 56661383, "end": 56675715}, {"filename": "/models/StreetLamp.mtl", "start": 56675715, "end": 56676013}, {"filename": "/models/Cone.obj", "start": 56676013, "end": 56686047}, {"filename": "/models/Icosphere.obj", "start": 56686047, "end": 56801706}, {"filename": "/models/ArtilleryIndicator.mtl", "start": 56801706, "end": 56801958}, {"filename": "/models/ArtilleryIndicator.obj", "start": 56801958, "end": 56848384}, {"filename": "/models/de_dust2.obj", "start": 56848384, "end": 58315707}, {"filename": "/models/ShootingRange2.obj", "start": 58315707, "end": 58320946}, {"filename": "/models/Cylinder.obj", "start": 58320946, "end": 58326597}, {"filename": "/models/FlatWorld.mtl", "start": 58326597, "end": 58326837}, {"filename": "/models/SupplyBinLid.mtl", "start": 58326837, "end": 58327114}, {"filename": "/models/Bullet.mtl", "start": 58327114, "end": 58327355}, {"filename": "/models/SupplyBinLid.obj", "start": 58327355, "end": 58332236}, {"filename": "/models/Rifle.obj", "start": 58332236, "end": 58355964}, {"filename": "/models/Bow.mtl", "start": 58355964, "end": 58356626}, {"filename": "/models/HookThrower.mtl", "start": 58356626, "end": 58356991}, {"filename": "/models/Warehouse.mtl", "start": 58356991, "end": 58360247}, {"filename": "/models/Plane.mtl", "start": 58360247, "end": 58360371}, {"filename": "/models/cube.obj", "start": 58360371, "end": 58361398}, {"filename": "/models/BombCrate.mtl", "start": 58361398, "end": 58361763}, {"filename": "/models/de_dust2.mtl", "start": 58361763, "end": 58370551}, {"filename": "/models/Pistol.mtl", "start": 58370551, "end": 58371097}, {"filename": "/models/Portal.obj", "start": 58371097, "end": 58399395}, {"filename": "/models/Explosion.mtl", "start": 58399395, "end": 58399816}, {"filename": "/models/Lift.mtl", "start": 58399816, "end": 58400055}, {"filename": "/models/BombCrate.obj", "start": 58400055, "end": 58401146}, {"filename": "/models/Ammo.obj", "start": 58401146, "end": 58428686}, {"filename": "/models/HookThrower.obj", "start": 58428686, "end": 58431045}, {"filename": "/models/ShootingRange2.mtl", "start": 58431045, "end": 58431290}, {"filename": "/models/Heaven.obj", "start": 58431290, "end": 58712557}, {"filename": "/models/island.obj", "start": 58712557, "end": 60145131}, {"filename": "/models/Arrow.mtl", "start": 60145131, "end": 60145795}, {"filename": "/models/Warehouse.obj", "start": 60145795, "end": 60445177}, {"filename": "/models/Explosion.obj", "start": 60445177, "end": 61112815}, {"filename": "/models/NewPlayer.mtl", "start": 61112815, "end": 61113583}, {"filename": "/models/Player.mtl", "start": 61113583, "end": 61113823}, {"filename": "/models/Bow.obj", "start": 61113823, "end": 61127418}, {"filename": "/models/Cone.mtl", "start": 61127418, "end": 61127548}, {"filename": "/models/Shotgun.obj", "start": 61127548, "end": 61157495}, {"filename": "/models/Grenade.obj", "start": 61157495, "end": 61404454}, {"filename": "/models/SpectatorArea.mtl", "start": 61404454, "end": 61404698}, {"filename": "/models/Dust2.mtl", "start": 61404698, "end": 61413486}, {"filename": "/models/Grenade.mtl", "start": 61413486, "end": 61414085}, {"filename": "/models/Ammo.mtl", "start": 61414085, "end": 61414745}, {"filename": "/models/SmokeGrenade.mtl", "start": 61414745, "end": 61415166}, {"filename": "/models/Player.obj", "start": 61415166, "end": 62187289}, {"filename": "/models/Artillery.mtl", "start": 62187289, "end": 62187580}, {"filename": "/models/Lift.obj", "start": 62187580, "end": 62202730}, {"filename": "/models/Medkit.mtl", "start": 62202730, "end": 62203216}, {"filename": "/models/Icosphere.mtl", "start": 62203216, "end": 62203441}, {"filename": "/models/Dust2.obj", "start": 62203441, "end": 63112712}, {"filename": "/models/Cube.mtl", "start": 63112712, "end": 63112941}, {"filename": "/models/Portal.mtl", "start": 63112941, "end": 63113364}, {"filename": "/models/SubmachineGun.mtl", "start": 63113364, "end": 63114306}, {"filename": "/models/PlayerMarkerMinimap.obj", "start": 63114306, "end": 63114710}, {"filename": "/models/MachineGun.obj", "start": 63114710, "end": 63264247}, {"filename": "/models/PlayerMarkerMinimap.mtl", "start": 63264247, "end": 63264497}, {"filename": "/models/SpectatorArea.obj", "start": 63264497, "end": 63266903}, {"filename": "/models/Cube.obj", "start": 63266903, "end": 63267930}, {"filename": "/models/Bullet.obj", "start": 63267930, "end": 63296199}, {"filename": "/models/NewPlayer.obj", "start": 63296199, "end": 63348521}, {"filename": "/models/SmokeGrenade.obj", "start": 63348521, "end": 63497621}, {"filename": "/models/SupplyBin.mtl", "start": 63497621, "end": 63498044}, {"filename": "/models/BulletTracer.obj", "start": 63498044, "end": 63507473}, {"filename": "/models/MachineGun.mtl", "start": 63507473, "end": 63508760}, {"filename": "/shaders/MeshLightingRectangleLight.fs", "start": 63508760, "end": 63509666}, {"filename": "/shaders/Debug.fs", "start": 63509666, "end": 63509769}, {"filename": "/shaders/ShadowMap.fs", "start": 63509769, "end": 63509886}, {"filename": "/shaders/BloomHighPass.fs", "start": 63509886, "end": 63510407}, {"filename": "/shaders/ShadowMap.vs", "start": 63510407, "end": 63510621}, {"filename": "/shaders/Mesh.vs", "start": 63510621, "end": 63511861}, {"filename": "/shaders/ToneMapping.fs", "start": 63511861, "end": 63512396}, {"filename": "/shaders/MeshDeferred.fs", "start": 63512396, "end": 63514649}, {"filename": "/shaders/GaussianBlur.fs", "start": 63514649, "end": 63515682}, {"filename": "/shaders/MeshLightingDirectionalLight.fs", "start": 63515682, "end": 63516081}, {"filename": "/shaders/Minimap.fs", "start": 63516081, "end": 63516782}, {"filename": "/shaders/MeshLighting.vs", "start": 63516782, "end": 63517378}, {"filename": "/shaders/Skydome.fs", "start": 63517378, "end": 63518610}, {"filename": "/shaders/Quad.fs", "start": 63518610, "end": 63519224}, {"filename": "/shaders/MeshLighting.fs", "start": 63519224, "end": 63528096}, {"filename": "/shaders/FXAA.fs", "start": 63528096, "end": 63531744}, {"filename": "/shaders/Debug.vs", "start": 63531744, "end": 63531956}, {"filename": "/shaders/Antialias.fs", "start": 63531956, "end": 63532536}, {"filename": "/shaders/Quad.vs", "start": 63532536, "end": 63532759}, {"filename": "/shaders/Mesh.fs", "start": 63532759, "end": 63543141}, {"filename": "/shaders/MeshLightingPointLight.fs", "start": 63543141, "end": 63543658}, {"filename": "/sounds/HookThrow.wav", "start": 63543658, "end": 63571350, "audio": 1}, {"filename": "/sounds/HookReel.wav", "start": 63571350, "end": 63629762, "audio": 1}, {"filename": "/sounds/PortalStart.wav", "start": 63629762, "end": 63702510, "audio": 1}, {"filename": "/sounds/ueh.wav", "start": 63702510, "end": 63737370, "audio": 1}, {"filename": "/sounds/reload.wav", "start": 63737370, "end": 63851078, "audio": 1}, {"filename": "/sounds/bang.wav", "start": 63851078, "end": 63978664, "audio": 1}, {"filename": "/sounds/incoming.wav", "start": 63978664, "end": 64133386, "audio": 1}, {"filename": "/sounds/boom.wav", "start": 64133386, "end": 64205110, "audio": 1}, {"filename": "/sounds/PortalEnd.wav", "start": 64205110, "end": 64276834, "audio": 1}, {"filename": "/sounds/GrenadeOut.wav", "start": 64276834, "end": 64356750, "audio": 1}, {"filename": "/sounds/boom-old1.wav", "start": 64356750, "end": 64428474, "audio": 1}, {"filename": "/sounds/Archer/arrow-pullback.wav", "start": 64428474, "end": 64576046, "audio": 1}, {"filename": "/sounds/Archer/arrow-shoot.wav", "start": 64576046, "end": 64690846, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-shoot.wav", "start": 64690846, "end": 64842516, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-activate.wav", "start": 64842516, "end": 65166220, "audio": 1}, {"filename": "/sounds/Archer/arrow-jump.wav", "start": 65166220, "end": 65436668, "audio": 1}, {"filename": "/scripts/BouncingBall.w", "start": 65436668, "end": 65437314}, {"filename": "/scripts/LootZone.w", "start": 65437314, "end": 65438797}, {"filename": "/scripts/Marine.w", "start": 65438797, "end": 65439165}, {"filename": "/scripts/Dummy.w", "start": 65439165, "end": 65439309}, {"filename": "/scripts/Test.w", "start": 65439309, "end": 65439400}, {"filename": "/scripts/Archer.w", "start": 65439400, "end": 65439739}, {"filename": "/scripts/1-Types.w", "start": 65439739, "end": 65442131}, {"filename": "/scripts/6-Gun.w", "start": 65442131, "end": 65442233}, {"filename": "/scripts/5-Weapon.w", "start": 65442233, "end": 65442639}, {"filename": "/scripts/2-Object.w", "start": 65442639, "end": 65445012}, {"filename": "/scripts/Bombmaker.w", "start": 65445012, "end": 65445348}, {"filename": "/scripts/SmokeExplosion.w", "start": 65445348, "end": 65446149}, {"filename": "/scripts/Hookman.w", "start": 65446149, "end": 65446484}, {"filename": "/scripts/SmokeGrenade.w", "start": 65446484, "end": 65446975}, {"filename": "/scripts/4-Player.w", "start": 65446975, "end": 65447596}, {"filename": "/scripts/3-Math.w", "start": 65447596, "end": 65447682}, {"filename": "/scripts/Explosion.w", "start": 65447682, "end": 65448364}], "remote_package_size": 65448364, "package_uuid": "e901ce99-c058-468e-9b76-c75e7cb2dba3"});
  
  })();
  