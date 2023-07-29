System.register([], function (_export, _context) {
    // cocos creator 3.5.x

    "use strict";

    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    function createApplication(_ref) {
        var loadJsListFile = _ref.loadJsListFile,
            fetchWasm = _ref.fetchWasm;
        // NOTE: before here we shall not import any module!
        var promise = Promise.resolve();
                promise = promise.then(function () {
            return topLevelImport('wait-for-ammo-instantiation');
        }).then(function (_ref2) {
            var waitForAmmoInstantiation = _ref2["default"];
            return waitForAmmoInstantiation(fetchWasm(''));
        });
        return promise.then(function () {
            return _defineProperty({
                start: start
            }, 'import', topLevelImport);
        });

        function start(_ref4) {
            var findCanvas = _ref4.findCanvas;
            var settings;
            var cc;
            return Promise.resolve().then(function () {
                return topLevelImport('cc');
            }).then(function (engine) {
                cc = engine;
                return loadSettingsJson(cc);
            }).then(function () {
                settings = window._CCSettings;
                return initializeGame(cc, settings, findCanvas).then(function () {
                    if (settings.scriptPackages) {
                        return loadModulePacks(settings.scriptPackages);
                    }
                }).then(function () {
                    const list = [
        "./src/Ffa467b52/86ad3b81-f6be-4b5d-9ba6-e48b3cdd7221.js",
                    "./src/Ffa467b52/06aed14b-5944-4043-9a61-bc7ba70635e0.js",
                    "./src/Ffa467b52/3132de5b-31ce-46c2-bd37-33d1c55c74f4.js",
                    "./src/Ffa467b52/e1d6fcd8-4591-4edb-b13c-c9abd25f374f.js",
                    "./src/Ffa467b52/2794654c-976f-4ae1-9af3-bd19ae07c249.js",
                    "./src/Ffa467b52/fab867c2-6432-41d9-bd1b-4044adea213d.js",
                    "./src/Ffa467b52/af621915-e8eb-4952-b1b6-05463287d107.js"
];

let p = Promise.resolve();

for (let i = 0; i < list.length; i++) {
    p = p.then(function () {
        return System.import(list[i]);
    });
}

p.then(function () {
    cc.game.emit('@MINIGAME_SDK_INIT_SUCCESS');
}).catch(function (error) {
    console.log('minigame sdk init fail!', JSON.stringify(error, null, 4));
});
                }).then(function () {
                    return loadJsList(settings.jsList);
                }).then(function () {
                    return loadAssetBundle(settings.hasResourcesBundle, settings.hasStartSceneBundle);
                }).then(function () {
                    return cc.game.run(function () {
                        return onGameStarted(cc, settings);
                    });
                });
            });
        }

        function topLevelImport(url) {
            return _context["import"]("".concat(url));
        }

        function loadAssetBundle(hasResourcesBundle, hasStartSceneBundle) {
            var promise = Promise.resolve();
            var _cc$AssetManager$Buil = cc.AssetManager.BuiltinBundleName,
                MAIN = _cc$AssetManager$Buil.MAIN,
                RESOURCES = _cc$AssetManager$Buil.RESOURCES,
                START_SCENE = _cc$AssetManager$Buil.START_SCENE;
            var bundleRoot = hasResourcesBundle ? [RESOURCES, MAIN] : [MAIN];

            if (hasStartSceneBundle) {
                bundleRoot.push(START_SCENE);
            }

            return bundleRoot.reduce(function (pre, name) {
                return pre.then(function () {
                    return loadBundle(name);
                });
            }, Promise.resolve());
        }

        function loadBundle(name) {
            return new Promise(function (resolve, reject) {
                cc.assetManager.loadBundle(name, function (err, bundle) {
                    if (err) {
                        return reject(err);
                    }

                    resolve(bundle);
                });
            });
        }

        function loadModulePacks(packs) {
            return Promise.all(packs.map(function (pack) {
                return topLevelImport(pack);
            }));
        }

        function loadJsList(jsList) {
            var promise = Promise.resolve();
            jsList.forEach(function (jsListFile) {
                promise = promise.then(function () {
                    return loadJsListFile("src/".concat(jsListFile));
                });
            });
            return promise;
        }

        function loadSettingsJson(cc) {
            var settings = 'src/settings.json';
            return new Promise(function (resolve, reject) {
                if (typeof fsUtils !== 'undefined' && !settings.startsWith('http')) {
                    var result = fsUtils.readJsonSync(settings);

                    if (result instanceof Error) {
                        reject(result);
                    } else {
                        window._CCSettings = result;
                        resolve();
                    }
                } else {
                    var requestSettings = function requestSettings() {
                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', settings);
                        xhr.responseType = 'text';

                        xhr.onload = function () {
                            window._CCSettings = JSON.parse(xhr.response);
                            resolve();
                        };

                        xhr.onerror = function () {
                            if (retryCount-- > 0) {
                                setTimeout(requestSettings, retryInterval);
                            } else {
                                reject(new Error('request settings failed!'));
                            }
                        };

                        xhr.send(null);
                    };

                    var retryCount = 3;
                    var retryInterval = 2000;
                    requestSettings();
                }
            });
        }
    }

    function initializeGame(cc, settings, findCanvas) {
        if (settings.macros) {
            for (var key in settings.macros) {
                cc.macro[key] = settings.macros[key];
            }
        }

        var gameOptions = getGameOptions(cc, settings, findCanvas);
        var success = cc.game.init(gameOptions);

        try {
            if (settings.customLayers) {
                settings.customLayers.forEach(function (layer) {
                    cc.Layers.addLayer(layer.name, layer.bit);
                });
            }
        } catch (error) {
            console.warn(error);
        }

        return success ? Promise.resolve(success) : Promise.reject();
    }

    function onGameStarted(cc, settings) {
        window._CCSettings = undefined;
        cc.view.resizeWithBrowserSize(true);
        var launchScene = settings.launchScene; // load scene

        cc.director.loadScene(launchScene, null, function () {
            cc.view.setDesignResolutionSize(720, 1280, 4);
            console.log("Success to load scene: ".concat(launchScene));
        });
    }

    function getGameOptions(cc, settings, findCanvas) {
        // asset library options
        var assetOptions = {
            bundleVers: settings.bundleVers,
            remoteBundles: settings.remoteBundles,
            server: settings.server,
            subpackages: settings.subpackages
        };
        var options = {
            debugMode: settings.debug ? cc.DebugMode.INFO : cc.DebugMode.ERROR,
            showFPS: !false && settings.debug,
            frameRate: 60,
            groupList: settings.groupList,
            collisionMatrix: settings.collisionMatrix,
            renderPipeline: settings.renderPipeline,
            adapter: findCanvas('GameCanvas'),
            assetOptions: assetOptions,
            customJointTextureLayouts: settings.customJointTextureLayouts || [],
            physics: settings.physics,
            orientation: settings.orientation,
            exactFitScreen: settings.exactFitScreen
        };
        return options;
    }

    _export("createApplication", createApplication);

    return {
        setters: [],
        execute: function () { }
    };
});