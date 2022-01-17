
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
   loadPackage({"files": [{"filename": "/maps/dust2.json", "start": 0, "end": 4019}, {"filename": "/maps/test-range.json.20211210-231432.bak", "start": 4019, "end": 6857}, {"filename": "/maps/dust2.json.20211211-171302.bak", "start": 6857, "end": 9627}, {"filename": "/maps/test.json", "start": 9627, "end": 10282}, {"filename": "/maps/test-range.json.20211128-185851.bak", "start": 10282, "end": 13073}, {"filename": "/maps/map1.json.20211211-134645.bak", "start": 13073, "end": 38065}, {"filename": "/maps/dust2.json.20211211-171053.bak", "start": 38065, "end": 40830}, {"filename": "/maps/test-range.json.20211203-235248.bak", "start": 40830, "end": 43681}, {"filename": "/maps/test-range.json", "start": 43681, "end": 46595}, {"filename": "/maps/dust2.json.20211211-165858.bak", "start": 46595, "end": 46696}, {"filename": "/maps/dust2.json.20211218-221225.bak", "start": 46696, "end": 50058}, {"filename": "/maps/map1.json", "start": 50058, "end": 82293}, {"filename": "/maps/dust2.json.20211211-171036.bak", "start": 82293, "end": 85034}, {"filename": "/maps/dust2.json.20211211-171205.bak", "start": 85034, "end": 87799}, {"filename": "/maps/dust2.json.20211219-141925.bak", "start": 87799, "end": 91161}, {"filename": "/maps/dust2.json.20211219-142224.bak", "start": 91161, "end": 95089}, {"filename": "/maps/test-range.json.20211127-155151.bak", "start": 95089, "end": 97953}, {"filename": "/maps/test-range.json.20211205-125109.bak", "start": 97953, "end": 100802}, {"filename": "/maps/map1.json.20211211-134715.bak", "start": 100802, "end": 133037}, {"filename": "/maps/dust2.json.20211212-193309.bak", "start": 133037, "end": 135808}, {"filename": "/maps/dust2.json.20211218-221137.bak", "start": 135808, "end": 139171}, {"filename": "/maps/dust2.json.20211212-193510.bak", "start": 139171, "end": 142548}, {"filename": "/textures/Mountains.png", "start": 142548, "end": 219366}, {"filename": "/textures/uvmap.jpg", "start": 219366, "end": 1200718}, {"filename": "/textures/SupplyBinCover.png", "start": 1200718, "end": 1206808}, {"filename": "/textures/SolomonFace.jpg", "start": 1206808, "end": 2214620}, {"filename": "/textures/BulletTracer.png", "start": 2214620, "end": 2248387}, {"filename": "/textures/sam_texture.jpg", "start": 2248387, "end": 3213161}, {"filename": "/textures/Skydome.png", "start": 3213161, "end": 4672944}, {"filename": "/textures/Artillery.png", "start": 4672944, "end": 5790171}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Metalness.jpg", "start": 5790171, "end": 5961365}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Displacement.jpg", "start": 5961365, "end": 6098557}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Color.jpg", "start": 6098557, "end": 6472716}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Roughness.jpg", "start": 6472716, "end": 6879609}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Normal.jpg", "start": 6879609, "end": 7587536}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_BaseColor.png", "start": 7587536, "end": 8371556}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Roughness.png", "start": 8371556, "end": 8639987}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_AO.png", "start": 8639987, "end": 8666479}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Normal.png", "start": 8666479, "end": 9337038}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_AlbedoTransparency.png", "start": 9337038, "end": 9421254}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_MetallicSmoothness.png", "start": 9421254, "end": 9429394}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_Normal.png", "start": 9429394, "end": 9460762}, {"filename": "/textures/Dust2/de_dust2_material_20.png", "start": 9460762, "end": 9465593}, {"filename": "/textures/Dust2/de_dust2_material_24.png", "start": 9465593, "end": 9469083}, {"filename": "/textures/Dust2/de_dust2_material_28.png", "start": 9469083, "end": 9494416}, {"filename": "/textures/Dust2/de_dust2_material_29.png", "start": 9494416, "end": 9519643}, {"filename": "/textures/Dust2/de_dust2_material_21.png", "start": 9519643, "end": 9524406}, {"filename": "/textures/Dust2/de_dust2_material_3.png", "start": 9524406, "end": 9524509}, {"filename": "/textures/Dust2/de_dust2_material_18.png", "start": 9524509, "end": 9524605}, {"filename": "/textures/Dust2/de_dust2_material_5.png", "start": 9524605, "end": 9588558}, {"filename": "/textures/Dust2/de_dust2_material_9.png", "start": 9588558, "end": 9593573}, {"filename": "/textures/Dust2/de_dust2_material_23.png", "start": 9593573, "end": 9621092}, {"filename": "/textures/Dust2/de_dust2_material_31.png", "start": 9621092, "end": 9625786}, {"filename": "/textures/Dust2/de_dust2_material_14.png", "start": 9625786, "end": 9644207}, {"filename": "/textures/Dust2/de_dust2_material_17.png", "start": 9644207, "end": 9661016}, {"filename": "/textures/Dust2/de_dust2_material_1.png", "start": 9661016, "end": 9691835}, {"filename": "/textures/Dust2/de_dust2_material_32.png", "start": 9691835, "end": 9694857}, {"filename": "/textures/Dust2/de_dust2_material_8.png", "start": 9694857, "end": 9748167}, {"filename": "/textures/Dust2/de_dust2_material_4.png", "start": 9748167, "end": 9778021}, {"filename": "/textures/Dust2/de_dust2_material_33.png", "start": 9778021, "end": 9778816}, {"filename": "/textures/Dust2/de_dust2_material_6.png", "start": 9778816, "end": 9795746}, {"filename": "/textures/Dust2/de_dust2_material_2.png", "start": 9795746, "end": 9800772}, {"filename": "/textures/Dust2/de_dust2_material_7.png", "start": 9800772, "end": 9829645}, {"filename": "/textures/Dust2/de_dust2_material_19.png", "start": 9829645, "end": 9836435}, {"filename": "/textures/Dust2/de_dust2_material_13.png", "start": 9836435, "end": 9855792}, {"filename": "/textures/Dust2/de_dust2_material_16.png", "start": 9855792, "end": 9885612}, {"filename": "/textures/Dust2/de_dust2_material_10.png", "start": 9885612, "end": 9933961}, {"filename": "/textures/Dust2/de_dust2_material_12.png", "start": 9933961, "end": 9951008}, {"filename": "/textures/Dust2/de_dust2_material_15.png", "start": 9951008, "end": 9992883}, {"filename": "/textures/Dust2/de_dust2_material_27.png", "start": 9992883, "end": 10022481}, {"filename": "/textures/Dust2/de_dust2_material_30.png", "start": 10022481, "end": 10049559}, {"filename": "/textures/Dust2/de_dust2_material_22.png", "start": 10049559, "end": 10066558}, {"filename": "/textures/Dust2/de_dust2_material_25.png", "start": 10066558, "end": 10125093}, {"filename": "/textures/Dust2/de_dust2_material_0.png", "start": 10125093, "end": 10129058}, {"filename": "/textures/Dust2/de_dust2_material_26.png", "start": 10129058, "end": 10154062}, {"filename": "/textures/Dust2/de_dust2_material_11.png", "start": 10154062, "end": 10183777}, {"filename": "/textures/MuzzleFlash/muzzle4.png", "start": 10183777, "end": 10207078}, {"filename": "/textures/MuzzleFlash/muzzle5.png", "start": 10207078, "end": 10231274}, {"filename": "/textures/MuzzleFlash/muzzle2.png", "start": 10231274, "end": 10252642}, {"filename": "/textures/MuzzleFlash/muzzle1.png", "start": 10252642, "end": 10278414}, {"filename": "/textures/MuzzleFlash/muzzle3.png", "start": 10278414, "end": 10298863}, {"filename": "/textures/BulletHole/BulletHole.png", "start": 10298863, "end": 10331067}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Roughness.jpg", "start": 10331067, "end": 10705089}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_AmbientOcclusion.jpg", "start": 10705089, "end": 11084810}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Displacement.jpg", "start": 11084810, "end": 11601705}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Normal.jpg", "start": 11601705, "end": 12626194}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Color.jpg", "start": 12626194, "end": 13426275}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Normal.jpg", "start": 13426275, "end": 14661543}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Color.jpg", "start": 14661543, "end": 15647178}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Opacity.jpg", "start": 15647178, "end": 15965656}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Color.jpg", "start": 15965656, "end": 16231914}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Roughness.jpg", "start": 16231914, "end": 16531335}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Normal.jpg", "start": 16531335, "end": 17126692}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Displacement.jpg", "start": 17126692, "end": 17387299}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Normal.jpg", "start": 17387299, "end": 19679683}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Color.jpg", "start": 19679683, "end": 21207144}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Displacement.jpg", "start": 21207144, "end": 21503941}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Roughness.jpg", "start": 21503941, "end": 22168997}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_AmbientOcclusion.jpg", "start": 22168997, "end": 22769126}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Roughness.jpg", "start": 22769126, "end": 23449219}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Color.jpg", "start": 23449219, "end": 24870909}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Normal.jpg", "start": 24870909, "end": 26537464}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Displacement.jpg", "start": 26537464, "end": 26921893}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_AmbientOcclusion.jpg", "start": 26921893, "end": 27522227}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Emission.jpg", "start": 27522227, "end": 28853210}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Roughness.jpg", "start": 28853210, "end": 29424072}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Displacement.jpg", "start": 29424072, "end": 29720908}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Normal.jpg", "start": 29720908, "end": 31417269}, {"filename": "/textures/Lava004_1K-JPG/Water.jpg", "start": 31417269, "end": 32853169}, {"filename": "/textures/Lava004_1K-JPG/LavaGrayscale.jpg", "start": 32853169, "end": 33436031}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Color.jpg", "start": 33436031, "end": 34769462}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Roughness.jpg", "start": 34769462, "end": 35402719}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Normal.jpg", "start": 35402719, "end": 36572259}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Color.jpg", "start": 36572259, "end": 37639732}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Displacement.jpg", "start": 37639732, "end": 38266153}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Color.jpg", "start": 38266153, "end": 39336584}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Roughness.jpg", "start": 39336584, "end": 40157343}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Displacement.jpg", "start": 40157343, "end": 40780087}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Normal.jpg", "start": 40780087, "end": 43129233}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Color.jpg", "start": 43129233, "end": 44222217}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Displacement.jpg", "start": 44222217, "end": 45012777}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Roughness.jpg", "start": 45012777, "end": 45592877}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Normal.jpg", "start": 45592877, "end": 45932726}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_basecolor.jpg", "start": 45932726, "end": 45972537}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_normal.jpg", "start": 45972537, "end": 46232794}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Displacement.jpg", "start": 46232794, "end": 46662008}, {"filename": "/textures/Metal038_1K-JPG/MetalGreen.jpg", "start": 46662008, "end": 47402913}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Color.jpg", "start": 47402913, "end": 48109782}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Normal.jpg", "start": 48109782, "end": 49175324}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Roughness.jpg", "start": 49175324, "end": 49547601}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Metalness.jpg", "start": 49547601, "end": 49677605}, {"filename": "/models/Artillery.obj", "start": 49677605, "end": 51333043}, {"filename": "/models/FlatWorld.obj", "start": 51333043, "end": 51334106}, {"filename": "/models/Heaven.mtl", "start": 51334106, "end": 51335262}, {"filename": "/models/Rifle.mtl", "start": 51335262, "end": 51335747}, {"filename": "/models/BulletTracer.mtl", "start": 51335747, "end": 51336028}, {"filename": "/models/Arrow.obj", "start": 51336028, "end": 51342717}, {"filename": "/models/Pistol.obj", "start": 51342717, "end": 51366603}, {"filename": "/models/Shotgun.mtl", "start": 51366603, "end": 51367276}, {"filename": "/models/SubmachineGun.obj", "start": 51367276, "end": 51403339}, {"filename": "/models/ShootingRange.obj", "start": 51403339, "end": 56527136}, {"filename": "/models/SupplyBin.obj", "start": 56527136, "end": 56538747}, {"filename": "/models/Plane.obj", "start": 56538747, "end": 56539087}, {"filename": "/models/Quad.obj", "start": 56539087, "end": 56539431}, {"filename": "/models/StreetLamp.obj", "start": 56539431, "end": 56578896}, {"filename": "/models/suzanne.obj", "start": 56578896, "end": 56657652}, {"filename": "/models/ShootingRange.mtl", "start": 56657652, "end": 56661377}, {"filename": "/models/Medkit.obj", "start": 56661377, "end": 56675709}, {"filename": "/models/StreetLamp.mtl", "start": 56675709, "end": 56676007}, {"filename": "/models/Cone.obj", "start": 56676007, "end": 56686041}, {"filename": "/models/Icosphere.obj", "start": 56686041, "end": 56801700}, {"filename": "/models/ArtilleryIndicator.mtl", "start": 56801700, "end": 56801952}, {"filename": "/models/ArtilleryIndicator.obj", "start": 56801952, "end": 56848378}, {"filename": "/models/de_dust2.obj", "start": 56848378, "end": 58315701}, {"filename": "/models/ShootingRange2.obj", "start": 58315701, "end": 58320940}, {"filename": "/models/Cylinder.obj", "start": 58320940, "end": 58326591}, {"filename": "/models/FlatWorld.mtl", "start": 58326591, "end": 58326831}, {"filename": "/models/SupplyBinLid.mtl", "start": 58326831, "end": 58327108}, {"filename": "/models/Bullet.mtl", "start": 58327108, "end": 58327349}, {"filename": "/models/SupplyBinLid.obj", "start": 58327349, "end": 58332230}, {"filename": "/models/Rifle.obj", "start": 58332230, "end": 58355958}, {"filename": "/models/Bow.mtl", "start": 58355958, "end": 58356620}, {"filename": "/models/HookThrower.mtl", "start": 58356620, "end": 58356985}, {"filename": "/models/Warehouse.mtl", "start": 58356985, "end": 58360241}, {"filename": "/models/Plane.mtl", "start": 58360241, "end": 58360365}, {"filename": "/models/cube.obj", "start": 58360365, "end": 58361392}, {"filename": "/models/BombCrate.mtl", "start": 58361392, "end": 58361757}, {"filename": "/models/de_dust2.mtl", "start": 58361757, "end": 58370545}, {"filename": "/models/Pistol.mtl", "start": 58370545, "end": 58371091}, {"filename": "/models/Portal.obj", "start": 58371091, "end": 58399389}, {"filename": "/models/Explosion.mtl", "start": 58399389, "end": 58399810}, {"filename": "/models/Lift.mtl", "start": 58399810, "end": 58400049}, {"filename": "/models/BombCrate.obj", "start": 58400049, "end": 58401140}, {"filename": "/models/Ammo.obj", "start": 58401140, "end": 58428680}, {"filename": "/models/HookThrower.obj", "start": 58428680, "end": 58431039}, {"filename": "/models/ShootingRange2.mtl", "start": 58431039, "end": 58431284}, {"filename": "/models/Heaven.obj", "start": 58431284, "end": 58712551}, {"filename": "/models/island.obj", "start": 58712551, "end": 60145125}, {"filename": "/models/NewPlayer2.obj", "start": 60145125, "end": 60197891}, {"filename": "/models/Arrow.mtl", "start": 60197891, "end": 60198555}, {"filename": "/models/Warehouse.obj", "start": 60198555, "end": 60497937}, {"filename": "/models/Explosion.obj", "start": 60497937, "end": 61165575}, {"filename": "/models/NewPlayer.mtl", "start": 61165575, "end": 61166343}, {"filename": "/models/Player.mtl", "start": 61166343, "end": 61166583}, {"filename": "/models/Bow.obj", "start": 61166583, "end": 61180178}, {"filename": "/models/Cone.mtl", "start": 61180178, "end": 61180308}, {"filename": "/models/Shotgun.obj", "start": 61180308, "end": 61210255}, {"filename": "/models/Grenade.obj", "start": 61210255, "end": 61457214}, {"filename": "/models/SpectatorArea.mtl", "start": 61457214, "end": 61457458}, {"filename": "/models/Dust2.mtl", "start": 61457458, "end": 61466466}, {"filename": "/models/Grenade.mtl", "start": 61466466, "end": 61467065}, {"filename": "/models/Ammo.mtl", "start": 61467065, "end": 61467725}, {"filename": "/models/SmokeGrenade.mtl", "start": 61467725, "end": 61468146}, {"filename": "/models/Player.obj", "start": 61468146, "end": 62240269}, {"filename": "/models/Artillery.mtl", "start": 62240269, "end": 62240560}, {"filename": "/models/Lift.obj", "start": 62240560, "end": 62255710}, {"filename": "/models/Medkit.mtl", "start": 62255710, "end": 62256196}, {"filename": "/models/Icosphere.mtl", "start": 62256196, "end": 62256421}, {"filename": "/models/Dust2.obj", "start": 62256421, "end": 68909776}, {"filename": "/models/Cube.mtl", "start": 68909776, "end": 68910005}, {"filename": "/models/Portal.mtl", "start": 68910005, "end": 68910428}, {"filename": "/models/SubmachineGun.mtl", "start": 68910428, "end": 68911370}, {"filename": "/models/PlayerMarkerMinimap.obj", "start": 68911370, "end": 68911774}, {"filename": "/models/NewPlayer2.mtl", "start": 68911774, "end": 68912542}, {"filename": "/models/MachineGun.obj", "start": 68912542, "end": 69062079}, {"filename": "/models/PlayerMarkerMinimap.mtl", "start": 69062079, "end": 69062329}, {"filename": "/models/SpectatorArea.obj", "start": 69062329, "end": 69064735}, {"filename": "/models/Cube.obj", "start": 69064735, "end": 69065762}, {"filename": "/models/Bullet.obj", "start": 69065762, "end": 69094031}, {"filename": "/models/NewPlayer.obj", "start": 69094031, "end": 69146353}, {"filename": "/models/SmokeGrenade.obj", "start": 69146353, "end": 69295453}, {"filename": "/models/SupplyBin.mtl", "start": 69295453, "end": 69295876}, {"filename": "/models/BulletTracer.obj", "start": 69295876, "end": 69305305}, {"filename": "/models/MachineGun.mtl", "start": 69305305, "end": 69306592}, {"filename": "/shaders/MeshLightingRectangleLight.fs", "start": 69306592, "end": 69307498}, {"filename": "/shaders/Debug.fs", "start": 69307498, "end": 69307601}, {"filename": "/shaders/ShadowMap.fs", "start": 69307601, "end": 69307718}, {"filename": "/shaders/BloomHighPass.fs", "start": 69307718, "end": 69308239}, {"filename": "/shaders/ShadowMap.vs", "start": 69308239, "end": 69308453}, {"filename": "/shaders/Mesh.vs", "start": 69308453, "end": 69309693}, {"filename": "/shaders/ToneMapping.fs", "start": 69309693, "end": 69310228}, {"filename": "/shaders/MeshDeferred.fs", "start": 69310228, "end": 69312481}, {"filename": "/shaders/GaussianBlur.fs", "start": 69312481, "end": 69313514}, {"filename": "/shaders/MeshLightingDirectionalLight.fs", "start": 69313514, "end": 69313913}, {"filename": "/shaders/Minimap.fs", "start": 69313913, "end": 69314614}, {"filename": "/shaders/MeshLighting.vs", "start": 69314614, "end": 69315210}, {"filename": "/shaders/Skydome.fs", "start": 69315210, "end": 69316442}, {"filename": "/shaders/Quad.fs", "start": 69316442, "end": 69317056}, {"filename": "/shaders/MeshLighting.fs", "start": 69317056, "end": 69325928}, {"filename": "/shaders/FXAA.fs", "start": 69325928, "end": 69329576}, {"filename": "/shaders/Debug.vs", "start": 69329576, "end": 69329788}, {"filename": "/shaders/Antialias.fs", "start": 69329788, "end": 69330368}, {"filename": "/shaders/Quad.vs", "start": 69330368, "end": 69330591}, {"filename": "/shaders/Mesh.fs", "start": 69330591, "end": 69340973}, {"filename": "/shaders/MeshLightingPointLight.fs", "start": 69340973, "end": 69341490}, {"filename": "/sounds/HookThrow.wav", "start": 69341490, "end": 69369182, "audio": 1}, {"filename": "/sounds/HookReel.wav", "start": 69369182, "end": 69427594, "audio": 1}, {"filename": "/sounds/PortalStart.wav", "start": 69427594, "end": 69500342, "audio": 1}, {"filename": "/sounds/ueh.wav", "start": 69500342, "end": 69535202, "audio": 1}, {"filename": "/sounds/reload.wav", "start": 69535202, "end": 69648910, "audio": 1}, {"filename": "/sounds/bang.wav", "start": 69648910, "end": 69776496, "audio": 1}, {"filename": "/sounds/incoming.wav", "start": 69776496, "end": 69931218, "audio": 1}, {"filename": "/sounds/boom.wav", "start": 69931218, "end": 70002942, "audio": 1}, {"filename": "/sounds/PortalEnd.wav", "start": 70002942, "end": 70074666, "audio": 1}, {"filename": "/sounds/GrenadeOut.wav", "start": 70074666, "end": 70154582, "audio": 1}, {"filename": "/sounds/boom-old1.wav", "start": 70154582, "end": 70226306, "audio": 1}, {"filename": "/sounds/Archer/arrow-pullback.wav", "start": 70226306, "end": 70373878, "audio": 1}, {"filename": "/sounds/Archer/arrow-shoot.wav", "start": 70373878, "end": 70488678, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-shoot.wav", "start": 70488678, "end": 70640348, "audio": 1}, {"filename": "/sounds/Archer/arrow-ulti-activate.wav", "start": 70640348, "end": 70964052, "audio": 1}, {"filename": "/sounds/Archer/arrow-jump.wav", "start": 70964052, "end": 71234500, "audio": 1}, {"filename": "/scripts/BouncingBall.w", "start": 71234500, "end": 71235146}, {"filename": "/scripts/LootZone.w", "start": 71235146, "end": 71236629}, {"filename": "/scripts/Marine.w", "start": 71236629, "end": 71236997}, {"filename": "/scripts/Dummy.w", "start": 71236997, "end": 71237141}, {"filename": "/scripts/Test.w", "start": 71237141, "end": 71237232}, {"filename": "/scripts/Archer.w", "start": 71237232, "end": 71237571}, {"filename": "/scripts/1-Types.w", "start": 71237571, "end": 71239963}, {"filename": "/scripts/6-Gun.w", "start": 71239963, "end": 71240065}, {"filename": "/scripts/5-Weapon.w", "start": 71240065, "end": 71240471}, {"filename": "/scripts/2-Object.w", "start": 71240471, "end": 71242844}, {"filename": "/scripts/Bombmaker.w", "start": 71242844, "end": 71243180}, {"filename": "/scripts/SmokeExplosion.w", "start": 71243180, "end": 71243981}, {"filename": "/scripts/Hookman.w", "start": 71243981, "end": 71244316}, {"filename": "/scripts/SmokeGrenade.w", "start": 71244316, "end": 71244807}, {"filename": "/scripts/4-Player.w", "start": 71244807, "end": 71245428}, {"filename": "/scripts/3-Math.w", "start": 71245428, "end": 71245514}, {"filename": "/scripts/Explosion.w", "start": 71245514, "end": 71246196}], "remote_package_size": 71246196, "package_uuid": "4970157e-7db1-4395-af1a-9cdffed243d7"});
  
  })();
  