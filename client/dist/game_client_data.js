
  var Module = typeof Module != 'undefined' ? Module : {};

  if (!Module['expectedDataFileDownloads']) Module['expectedDataFileDownloads'] = 0;
  Module['expectedDataFileDownloads']++;
  (() => {
    // Do not attempt to redownload the virtual filesystem data when in a pthread or a Wasm Worker context.
    var isPthread = typeof ENVIRONMENT_IS_PTHREAD != 'undefined' && ENVIRONMENT_IS_PTHREAD;
    var isWasmWorker = typeof ENVIRONMENT_IS_WASM_WORKER != 'undefined' && ENVIRONMENT_IS_WASM_WORKER;
    if (isPthread || isWasmWorker) return;
    var isNode = globalThis.process && globalThis.process.versions && globalThis.process.versions.node && globalThis.process.type != 'renderer';
    async function loadPackage(metadata) {

      var PACKAGE_PATH = '';
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + '/');
      } else if (typeof process === 'undefined' && typeof location !== 'undefined') {
        // web worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.substring(0, location.pathname.lastIndexOf('/')) + '/');
      }
      var PACKAGE_NAME = '../client/dist/game_client.data';
      var REMOTE_PACKAGE_BASE = 'game_client.data';
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];

      async function fetchRemotePackage(packageName, packageSize) {
        if (isNode) {
          var contents = require('fs').readFileSync(packageName);
          return new Uint8Array(contents).buffer;
        }
        if (!Module['dataFileDownloads']) Module['dataFileDownloads'] = {};
        try {
          var response = await fetch(packageName);
        } catch (e) {
          throw new Error(`Network Error: ${packageName}`, {e});
        }
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.url}`);
        }

        const chunks = [];
        const headers = response.headers;
        const total = Number(headers.get('Content-Length') || packageSize);
        let loaded = 0;

        Module['setStatus'] && Module['setStatus']('Downloading data...');
        const reader = response.body.getReader();

        while (1) {
          var {done, value} = await reader.read();
          if (done) break;
          chunks.push(value);
          loaded += value.length;
          Module['dataFileDownloads'][packageName] = {loaded, total};

          let totalLoaded = 0;
          let totalSize = 0;

          for (const download of Object.values(Module['dataFileDownloads'])) {
            totalLoaded += download.loaded;
            totalSize += download.total;
          }

          Module['setStatus'] && Module['setStatus'](`Downloading data... (${totalLoaded}/${totalSize})`);
        }

        const packageData = new Uint8Array(chunks.map((c) => c.length).reduce((a, b) => a + b, 0));
        let offset = 0;
        for (const chunk of chunks) {
          packageData.set(chunk, offset);
          offset += chunk.length;
        }
        return packageData.buffer;
      }

      var fetchPromise;
      var fetched = Module['getPreloadedPackage'] && Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);

      if (!fetched) {
        // Note that we don't use await here because we want to execute the
        // the rest of this function immediately.
        fetchPromise = fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);
      }

    async function runWithFS(Module) {

      function assert(check, msg) {
        if (!check) throw new Error(msg);
      }
Module['FS_createPath']("/", "animations", true, true);
Module['FS_createPath']("/", "maps", true, true);
Module['FS_createPath']("/", "models", true, true);
Module['FS_createPath']("/", "scripts", true, true);
Module['FS_createPath']("/", "shaders", true, true);
Module['FS_createPath']("/", "sounds", true, true);
Module['FS_createPath']("/sounds", "Archer", true, true);
Module['FS_createPath']("/", "textures", true, true);
Module['FS_createPath']("/textures", "Bricks059_1K-JPG", true, true);
Module['FS_createPath']("/textures", "BulletHole", true, true);
Module['FS_createPath']("/textures", "CardboardBox", true, true);
Module['FS_createPath']("/textures", "Concrete036_1K-JPG", true, true);
Module['FS_createPath']("/textures", "Dust2", true, true);
Module['FS_createPath']("/textures", "Fabric032_1K-JPG", true, true);
Module['FS_createPath']("/textures", "Lava004_1K-JPG", true, true);
Module['FS_createPath']("/textures", "Leaking003_1K-JPG", true, true);
Module['FS_createPath']("/textures", "Marble012_1K-JPG", true, true);
Module['FS_createPath']("/textures", "Metal038_1K-JPG", true, true);
Module['FS_createPath']("/textures", "MetalPlates007_1K-JPG", true, true);
Module['FS_createPath']("/textures", "MuzzleFlash", true, true);
Module['FS_createPath']("/textures", "Rock029_1K-JPG", true, true);
Module['FS_createPath']("/textures", "WetFloor", true, true);
Module['FS_createPath']("/textures", "Wood026_1K-JPG", true, true);
Module['FS_createPath']("/textures", "WoodFloor040_1K-JPG", true, true);
Module['FS_createPath']("/textures", "WoodenCrate", true, true);

    for (var file of metadata['files']) {
      var name = file['filename']
      Module['addRunDependency'](`fp ${name}`);
    }

      async function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer.constructor.name === ArrayBuffer.name, 'bad input to processPackageData ' + arrayBuffer.constructor.name);
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        // Reuse the bytearray from the XHR as the source for file reads.
          for (var file of metadata['files']) {
            var name = file['filename'];
            var data = byteArray.subarray(file['start'], file['end']);
            // canOwn this data in the filesystem, it is a slice into the heap that will never change
        Module['FS_createDataFile'](name, null, data, true, true, true);
        Module['removeRunDependency'](`fp ${name}`);
          }
          Module['removeRunDependency']('datafile_../client/dist/game_client.data');
      }
      Module['addRunDependency']('datafile_../client/dist/game_client.data');

      if (!Module['preloadResults']) Module['preloadResults'] = {};

      Module['preloadResults'][PACKAGE_NAME] = {fromCache: false};
      if (!fetched) {
        fetched = await fetchPromise;
      }
      processPackageData(fetched);

    }
    if (Module['calledRun']) {
      runWithFS(Module);
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module['preRun'].push(runWithFS); // FS is not initialized yet, wait for it
    }

    }
    loadPackage({"files": [{"filename": "/animations/Player.bvh", "start": 0, "end": 32759}, {"filename": "/animations/Player.mtl", "start": 32759, "end": 33527}, {"filename": "/animations/Player.obj", "start": 33527, "end": 85755}, {"filename": "/maps/dust2.json", "start": 85755, "end": 89774}, {"filename": "/maps/map1.json", "start": 89774, "end": 122009}, {"filename": "/maps/test-range.json", "start": 122009, "end": 124923}, {"filename": "/maps/test.json", "start": 124923, "end": 125578}, {"filename": "/models/Ammo.mtl", "start": 125578, "end": 126238}, {"filename": "/models/Ammo.obj", "start": 126238, "end": 153778}, {"filename": "/models/Arrow.mtl", "start": 153778, "end": 154442}, {"filename": "/models/Arrow.obj", "start": 154442, "end": 161131}, {"filename": "/models/Artillery.mtl", "start": 161131, "end": 161422}, {"filename": "/models/Artillery.obj", "start": 161422, "end": 1816860}, {"filename": "/models/ArtilleryIndicator.mtl", "start": 1816860, "end": 1817112}, {"filename": "/models/ArtilleryIndicator.obj", "start": 1817112, "end": 1863538}, {"filename": "/models/BombCrate.mtl", "start": 1863538, "end": 1863903}, {"filename": "/models/BombCrate.obj", "start": 1863903, "end": 1864994}, {"filename": "/models/Bow.mtl", "start": 1864994, "end": 1865656}, {"filename": "/models/Bow.obj", "start": 1865656, "end": 1879251}, {"filename": "/models/Bullet.mtl", "start": 1879251, "end": 1879492}, {"filename": "/models/Bullet.obj", "start": 1879492, "end": 1907761}, {"filename": "/models/BulletTracer.mtl", "start": 1907761, "end": 1908042}, {"filename": "/models/BulletTracer.obj", "start": 1908042, "end": 1917471}, {"filename": "/models/Cone.mtl", "start": 1917471, "end": 1917601}, {"filename": "/models/Cone.obj", "start": 1917601, "end": 1927635}, {"filename": "/models/Cube.mtl", "start": 1927635, "end": 1927864}, {"filename": "/models/Cube.obj", "start": 1927864, "end": 1928891}, {"filename": "/models/Cylinder.obj", "start": 1928891, "end": 1934542}, {"filename": "/models/Dust2.mtl", "start": 1934542, "end": 1943550}, {"filename": "/models/Dust2.obj", "start": 1943550, "end": 8596905}, {"filename": "/models/Explosion.mtl", "start": 8596905, "end": 8597326}, {"filename": "/models/Explosion.obj", "start": 8597326, "end": 9264964}, {"filename": "/models/FlatWorld.mtl", "start": 9264964, "end": 9265204}, {"filename": "/models/FlatWorld.obj", "start": 9265204, "end": 9266267}, {"filename": "/models/Grenade.mtl", "start": 9266267, "end": 9266866}, {"filename": "/models/Grenade.obj", "start": 9266866, "end": 9513825}, {"filename": "/models/Heaven.mtl", "start": 9513825, "end": 9514981}, {"filename": "/models/Heaven.obj", "start": 9514981, "end": 9796248}, {"filename": "/models/HookThrower.mtl", "start": 9796248, "end": 9796613}, {"filename": "/models/HookThrower.obj", "start": 9796613, "end": 9798972}, {"filename": "/models/Icosphere.mtl", "start": 9798972, "end": 9799197}, {"filename": "/models/Icosphere.obj", "start": 9799197, "end": 9914856}, {"filename": "/models/Lift.mtl", "start": 9914856, "end": 9915095}, {"filename": "/models/Lift.obj", "start": 9915095, "end": 9930245}, {"filename": "/models/MachineGun.mtl", "start": 9930245, "end": 9931532}, {"filename": "/models/MachineGun.obj", "start": 9931532, "end": 10081069}, {"filename": "/models/Medkit.mtl", "start": 10081069, "end": 10081555}, {"filename": "/models/Medkit.obj", "start": 10081555, "end": 10095887}, {"filename": "/models/NewPlayer.mtl", "start": 10095887, "end": 10096655}, {"filename": "/models/NewPlayer.obj", "start": 10096655, "end": 10148977}, {"filename": "/models/NewPlayer2.mtl", "start": 10148977, "end": 10149745}, {"filename": "/models/NewPlayer2.obj", "start": 10149745, "end": 10202511}, {"filename": "/models/Pistol.mtl", "start": 10202511, "end": 10203057}, {"filename": "/models/Pistol.obj", "start": 10203057, "end": 10226943}, {"filename": "/models/Plane.mtl", "start": 10226943, "end": 10227067}, {"filename": "/models/Plane.obj", "start": 10227067, "end": 10227407}, {"filename": "/models/Player.mtl", "start": 10227407, "end": 10227647}, {"filename": "/models/Player.obj", "start": 10227647, "end": 10999770}, {"filename": "/models/PlayerMarkerMinimap.mtl", "start": 10999770, "end": 11000020}, {"filename": "/models/PlayerMarkerMinimap.obj", "start": 11000020, "end": 11000424}, {"filename": "/models/Portal.mtl", "start": 11000424, "end": 11000847}, {"filename": "/models/Portal.obj", "start": 11000847, "end": 11029145}, {"filename": "/models/Quad.obj", "start": 11029145, "end": 11029489}, {"filename": "/models/Rifle.mtl", "start": 11029489, "end": 11029974}, {"filename": "/models/Rifle.obj", "start": 11029974, "end": 11053702}, {"filename": "/models/ShootingRange.mtl", "start": 11053702, "end": 11057427}, {"filename": "/models/ShootingRange.obj", "start": 11057427, "end": 16181224}, {"filename": "/models/ShootingRange2.mtl", "start": 16181224, "end": 16181469}, {"filename": "/models/ShootingRange2.obj", "start": 16181469, "end": 16186708}, {"filename": "/models/Shotgun.mtl", "start": 16186708, "end": 16187381}, {"filename": "/models/Shotgun.obj", "start": 16187381, "end": 16217328}, {"filename": "/models/SmokeGrenade.mtl", "start": 16217328, "end": 16217749}, {"filename": "/models/SmokeGrenade.obj", "start": 16217749, "end": 16366849}, {"filename": "/models/SpectatorArea.mtl", "start": 16366849, "end": 16367093}, {"filename": "/models/SpectatorArea.obj", "start": 16367093, "end": 16369499}, {"filename": "/models/StreetLamp.mtl", "start": 16369499, "end": 16369797}, {"filename": "/models/StreetLamp.obj", "start": 16369797, "end": 16409262}, {"filename": "/models/SubmachineGun.mtl", "start": 16409262, "end": 16410204}, {"filename": "/models/SubmachineGun.obj", "start": 16410204, "end": 16446267}, {"filename": "/models/SupplyBin.mtl", "start": 16446267, "end": 16446690}, {"filename": "/models/SupplyBin.obj", "start": 16446690, "end": 16458301}, {"filename": "/models/SupplyBinLid.mtl", "start": 16458301, "end": 16458578}, {"filename": "/models/SupplyBinLid.obj", "start": 16458578, "end": 16463459}, {"filename": "/models/Warehouse.mtl", "start": 16463459, "end": 16466715}, {"filename": "/models/Warehouse.obj", "start": 16466715, "end": 16766097}, {"filename": "/models/cube.obj", "start": 16766097, "end": 16767124}, {"filename": "/models/de_dust2.mtl", "start": 16767124, "end": 16775912}, {"filename": "/models/de_dust2.obj", "start": 16775912, "end": 18243235}, {"filename": "/models/island.obj", "start": 18243235, "end": 19675809}, {"filename": "/models/suzanne.obj", "start": 19675809, "end": 19754565}, {"filename": "/scripts/1-Types.w", "start": 19754565, "end": 19756957}, {"filename": "/scripts/2-Object.w", "start": 19756957, "end": 19759330}, {"filename": "/scripts/3-Math.w", "start": 19759330, "end": 19759416}, {"filename": "/scripts/4-Player.w", "start": 19759416, "end": 19760037}, {"filename": "/scripts/5-Weapon.w", "start": 19760037, "end": 19760443}, {"filename": "/scripts/6-Gun.w", "start": 19760443, "end": 19760545}, {"filename": "/scripts/Archer.w", "start": 19760545, "end": 19760884}, {"filename": "/scripts/Bombmaker.w", "start": 19760884, "end": 19761220}, {"filename": "/scripts/BouncingBall.w", "start": 19761220, "end": 19761866}, {"filename": "/scripts/Dummy.w", "start": 19761866, "end": 19762010}, {"filename": "/scripts/Explosion.w", "start": 19762010, "end": 19762692}, {"filename": "/scripts/Hookman.w", "start": 19762692, "end": 19763027}, {"filename": "/scripts/LootZone.w", "start": 19763027, "end": 19764510}, {"filename": "/scripts/Marine.w", "start": 19764510, "end": 19764866}, {"filename": "/scripts/SmokeExplosion.w", "start": 19764866, "end": 19765667}, {"filename": "/scripts/SmokeGrenade.w", "start": 19765667, "end": 19766158}, {"filename": "/scripts/Test.w", "start": 19766158, "end": 19766249}, {"filename": "/shaders/Antialias.fs", "start": 19766249, "end": 19766829}, {"filename": "/shaders/BloomHighPass.fs", "start": 19766829, "end": 19767350}, {"filename": "/shaders/Debug.fs", "start": 19767350, "end": 19767453}, {"filename": "/shaders/Debug.vs", "start": 19767453, "end": 19767665}, {"filename": "/shaders/FXAA.fs", "start": 19767665, "end": 19771313}, {"filename": "/shaders/GaussianBlur.fs", "start": 19771313, "end": 19772346}, {"filename": "/shaders/Mesh.fs", "start": 19772346, "end": 19782728}, {"filename": "/shaders/Mesh.vs", "start": 19782728, "end": 19783968}, {"filename": "/shaders/MeshDeferred.fs", "start": 19783968, "end": 19786221}, {"filename": "/shaders/MeshLighting.fs", "start": 19786221, "end": 19795093}, {"filename": "/shaders/MeshLighting.vs", "start": 19795093, "end": 19795689}, {"filename": "/shaders/MeshLightingDirectionalLight.fs", "start": 19795689, "end": 19796088}, {"filename": "/shaders/MeshLightingPointLight.fs", "start": 19796088, "end": 19796605}, {"filename": "/shaders/MeshLightingRectangleLight.fs", "start": 19796605, "end": 19797511}, {"filename": "/shaders/Minimap.fs", "start": 19797511, "end": 19798212}, {"filename": "/shaders/Quad.fs", "start": 19798212, "end": 19798826}, {"filename": "/shaders/Quad.vs", "start": 19798826, "end": 19799049}, {"filename": "/shaders/ShadowMap.fs", "start": 19799049, "end": 19799166}, {"filename": "/shaders/ShadowMap.vs", "start": 19799166, "end": 19799380}, {"filename": "/shaders/Skydome.fs", "start": 19799380, "end": 19800612}, {"filename": "/shaders/ToneMapping.fs", "start": 19800612, "end": 19801147}, {"filename": "/sounds/Archer/arrow-jump.wav", "start": 19801147, "end": 20071595}, {"filename": "/sounds/Archer/arrow-pullback.wav", "start": 20071595, "end": 20219167}, {"filename": "/sounds/Archer/arrow-shoot.wav", "start": 20219167, "end": 20333967}, {"filename": "/sounds/Archer/arrow-ulti-activate.wav", "start": 20333967, "end": 20657671}, {"filename": "/sounds/Archer/arrow-ulti-shoot.wav", "start": 20657671, "end": 20809341}, {"filename": "/sounds/GrenadeOut.wav", "start": 20809341, "end": 20889257}, {"filename": "/sounds/HookReel.wav", "start": 20889257, "end": 20947669}, {"filename": "/sounds/HookThrow.wav", "start": 20947669, "end": 20975361}, {"filename": "/sounds/PortalEnd.wav", "start": 20975361, "end": 21047085}, {"filename": "/sounds/PortalStart.wav", "start": 21047085, "end": 21119833}, {"filename": "/sounds/bang.wav", "start": 21119833, "end": 21247419}, {"filename": "/sounds/boom-old1.wav", "start": 21247419, "end": 21319143}, {"filename": "/sounds/boom.wav", "start": 21319143, "end": 21390867}, {"filename": "/sounds/incoming.wav", "start": 21390867, "end": 21545589}, {"filename": "/sounds/reload.wav", "start": 21545589, "end": 21659297}, {"filename": "/sounds/ueh.wav", "start": 21659297, "end": 21694157}, {"filename": "/textures/Artillery.png", "start": 21694157, "end": 22811384}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_AmbientOcclusion.jpg", "start": 22811384, "end": 23411718}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Color.jpg", "start": 23411718, "end": 24833408}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Displacement.jpg", "start": 24833408, "end": 25217837}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Normal.jpg", "start": 25217837, "end": 26884392}, {"filename": "/textures/Bricks059_1K-JPG/Bricks059_1K_Roughness.jpg", "start": 26884392, "end": 27564485}, {"filename": "/textures/BulletHole/BulletHole.png", "start": 27564485, "end": 27596689}, {"filename": "/textures/BulletTracer.png", "start": 27596689, "end": 27630456}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_AlbedoTransparency.png", "start": 27630456, "end": 27714672}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_MetallicSmoothness.png", "start": 27714672, "end": 27722812}, {"filename": "/textures/CardboardBox/CardboardBox_LP_lambert1_Normal.png", "start": 27722812, "end": 27754180}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Color.jpg", "start": 27754180, "end": 28821653}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Displacement.jpg", "start": 28821653, "end": 29448074}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Normal.jpg", "start": 29448074, "end": 30617614}, {"filename": "/textures/Concrete036_1K-JPG/Concrete036_1K_Roughness.jpg", "start": 30617614, "end": 31250871}, {"filename": "/textures/Dust2/de_dust2_material_0.png", "start": 31250871, "end": 31254836}, {"filename": "/textures/Dust2/de_dust2_material_1.png", "start": 31254836, "end": 31285655}, {"filename": "/textures/Dust2/de_dust2_material_10.png", "start": 31285655, "end": 31334004}, {"filename": "/textures/Dust2/de_dust2_material_11.png", "start": 31334004, "end": 31363719}, {"filename": "/textures/Dust2/de_dust2_material_12.png", "start": 31363719, "end": 31380766}, {"filename": "/textures/Dust2/de_dust2_material_13.png", "start": 31380766, "end": 31400123}, {"filename": "/textures/Dust2/de_dust2_material_14.png", "start": 31400123, "end": 31418544}, {"filename": "/textures/Dust2/de_dust2_material_15.png", "start": 31418544, "end": 31460419}, {"filename": "/textures/Dust2/de_dust2_material_16.png", "start": 31460419, "end": 31490239}, {"filename": "/textures/Dust2/de_dust2_material_17.png", "start": 31490239, "end": 31507048}, {"filename": "/textures/Dust2/de_dust2_material_18.png", "start": 31507048, "end": 31507144}, {"filename": "/textures/Dust2/de_dust2_material_19.png", "start": 31507144, "end": 31513934}, {"filename": "/textures/Dust2/de_dust2_material_2.png", "start": 31513934, "end": 31518960}, {"filename": "/textures/Dust2/de_dust2_material_20.png", "start": 31518960, "end": 31523791}, {"filename": "/textures/Dust2/de_dust2_material_21.png", "start": 31523791, "end": 31528554}, {"filename": "/textures/Dust2/de_dust2_material_22.png", "start": 31528554, "end": 31545553}, {"filename": "/textures/Dust2/de_dust2_material_23.png", "start": 31545553, "end": 31573072}, {"filename": "/textures/Dust2/de_dust2_material_24.png", "start": 31573072, "end": 31576562}, {"filename": "/textures/Dust2/de_dust2_material_25.png", "start": 31576562, "end": 31635097}, {"filename": "/textures/Dust2/de_dust2_material_26.png", "start": 31635097, "end": 31660101}, {"filename": "/textures/Dust2/de_dust2_material_27.png", "start": 31660101, "end": 31689699}, {"filename": "/textures/Dust2/de_dust2_material_28.png", "start": 31689699, "end": 31715032}, {"filename": "/textures/Dust2/de_dust2_material_29.png", "start": 31715032, "end": 31740259}, {"filename": "/textures/Dust2/de_dust2_material_3.png", "start": 31740259, "end": 31740362}, {"filename": "/textures/Dust2/de_dust2_material_30.png", "start": 31740362, "end": 31767440}, {"filename": "/textures/Dust2/de_dust2_material_31.png", "start": 31767440, "end": 31772134}, {"filename": "/textures/Dust2/de_dust2_material_32.png", "start": 31772134, "end": 31775156}, {"filename": "/textures/Dust2/de_dust2_material_33.png", "start": 31775156, "end": 31775951}, {"filename": "/textures/Dust2/de_dust2_material_4.png", "start": 31775951, "end": 31805805}, {"filename": "/textures/Dust2/de_dust2_material_5.png", "start": 31805805, "end": 31869758}, {"filename": "/textures/Dust2/de_dust2_material_6.png", "start": 31869758, "end": 31886688}, {"filename": "/textures/Dust2/de_dust2_material_7.png", "start": 31886688, "end": 31915561}, {"filename": "/textures/Dust2/de_dust2_material_8.png", "start": 31915561, "end": 31968871}, {"filename": "/textures/Dust2/de_dust2_material_9.png", "start": 31968871, "end": 31973886}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Color.jpg", "start": 31973886, "end": 33044317}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Displacement.jpg", "start": 33044317, "end": 33667061}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Normal.jpg", "start": 33667061, "end": 36016207}, {"filename": "/textures/Fabric032_1K-JPG/Fabric032_1K_Roughness.jpg", "start": 36016207, "end": 36836966}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Color.jpg", "start": 36836966, "end": 38170397}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Displacement.jpg", "start": 38170397, "end": 38467233}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Emission.jpg", "start": 38467233, "end": 39798216}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Normal.jpg", "start": 39798216, "end": 41494577}, {"filename": "/textures/Lava004_1K-JPG/Lava004_1K_Roughness.jpg", "start": 41494577, "end": 42065439}, {"filename": "/textures/Lava004_1K-JPG/LavaGrayscale.jpg", "start": 42065439, "end": 42648301}, {"filename": "/textures/Lava004_1K-JPG/Water.jpg", "start": 42648301, "end": 44084201}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Color.jpg", "start": 44084201, "end": 44350459}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Displacement.jpg", "start": 44350459, "end": 44611066}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Normal.jpg", "start": 44611066, "end": 45206423}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Opacity.jpg", "start": 45206423, "end": 45524901}, {"filename": "/textures/Leaking003_1K-JPG/Leaking003_1K_Roughness.jpg", "start": 45524901, "end": 45824322}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Color.jpg", "start": 45824322, "end": 46917306}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Displacement.jpg", "start": 46917306, "end": 47707866}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Normal.jpg", "start": 47707866, "end": 48047715}, {"filename": "/textures/Marble012_1K-JPG/Marble012_1K_Roughness.jpg", "start": 48047715, "end": 48627815}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Color.jpg", "start": 48627815, "end": 49334684}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Displacement.jpg", "start": 49334684, "end": 49763898}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Metalness.jpg", "start": 49763898, "end": 49893902}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Normal.jpg", "start": 49893902, "end": 50959444}, {"filename": "/textures/Metal038_1K-JPG/Metal038_1K_Roughness.jpg", "start": 50959444, "end": 51331721}, {"filename": "/textures/Metal038_1K-JPG/MetalGreen.jpg", "start": 51331721, "end": 52072626}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Color.jpg", "start": 52072626, "end": 52446785}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Displacement.jpg", "start": 52446785, "end": 52583977}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Metalness.jpg", "start": 52583977, "end": 52755171}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Normal.jpg", "start": 52755171, "end": 53463098}, {"filename": "/textures/MetalPlates007_1K-JPG/MetalPlates007_1K_Roughness.jpg", "start": 53463098, "end": 53869991}, {"filename": "/textures/Mountains.png", "start": 53869991, "end": 53946809}, {"filename": "/textures/MuzzleFlash/muzzle1.png", "start": 53946809, "end": 53972581}, {"filename": "/textures/MuzzleFlash/muzzle2.png", "start": 53972581, "end": 53993949}, {"filename": "/textures/MuzzleFlash/muzzle3.png", "start": 53993949, "end": 54014398}, {"filename": "/textures/MuzzleFlash/muzzle4.png", "start": 54014398, "end": 54037699}, {"filename": "/textures/MuzzleFlash/muzzle5.png", "start": 54037699, "end": 54061895}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_AmbientOcclusion.jpg", "start": 54061895, "end": 54662024}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Color.jpg", "start": 54662024, "end": 56189485}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Displacement.jpg", "start": 56189485, "end": 56486282}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Normal.jpg", "start": 56486282, "end": 58778666}, {"filename": "/textures/Rock029_1K-JPG/Rock029_1K_Roughness.jpg", "start": 58778666, "end": 59443722}, {"filename": "/textures/Skydome.png", "start": 59443722, "end": 60903505}, {"filename": "/textures/SolomonFace.jpg", "start": 60903505, "end": 61911317}, {"filename": "/textures/SupplyBinCover.png", "start": 61911317, "end": 61917407}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_AO.png", "start": 61917407, "end": 61943899}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_BaseColor.png", "start": 61943899, "end": 62727919}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Normal.png", "start": 62727919, "end": 63398478}, {"filename": "/textures/WetFloor/wet_floor_sign_1001_Roughness.png", "start": 63398478, "end": 63666909}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Color.jpg", "start": 63666909, "end": 64652544}, {"filename": "/textures/Wood026_1K-JPG/Wood026_1K_Normal.jpg", "start": 64652544, "end": 65887812}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_AmbientOcclusion.jpg", "start": 65887812, "end": 66267533}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Color.jpg", "start": 66267533, "end": 67067614}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Displacement.jpg", "start": 67067614, "end": 67584509}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Normal.jpg", "start": 67584509, "end": 68608998}, {"filename": "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K_Roughness.jpg", "start": 68608998, "end": 68983020}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_basecolor.jpg", "start": 68983020, "end": 69022831}, {"filename": "/textures/WoodenCrate/Wood_Crate_001_normal.jpg", "start": 69022831, "end": 69283088}, {"filename": "/textures/sam_texture.jpg", "start": 69283088, "end": 70247862}, {"filename": "/textures/uvmap.jpg", "start": 70247862, "end": 71229214}], "remote_package_size": 71229214});

  })();
