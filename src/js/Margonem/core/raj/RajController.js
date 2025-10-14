var ThemeData = require('@core/themeController/ThemeData');
var RajData = require('@core/raj/RajData');
var RajTemplate = require('@core/raj/RajTemplate');
var RajGetSpecificData = require('@core/raj/RajGetSpecificData');
var RajFullJSONReplacer = require('@core/raj/RajFullJSONReplacer');
//const SpecificEventsData = require('@core/oneResponseSpecificEvents/SpecificEventsData');
module.exports = function() {

    let dispatcher;
    //let characterEffectTemplate;

    let rajClass = {};

    let addSrajToQueue = false;
    let addSrajToCaseQueue = false;

    let rajQueue;
    let rajCaseQueue;
    //let callbackQueue;

    let moduleData = {
        fileName: "RajController.js"
    };

    let rajFullJSONReplacer = null;

    const BEFORE_ = "before_";
    const ON_ = "on_";
    const AFTER_ = "after_";

    const init = function() {
        setAddSrajToQueue(false);
        clearRajQueue();
        clearRajCaseQueue();
        initRajFullJSONReplacer();

        initDispatcher();
        //initTemplate();
    };

    //this.getRajQueue = () => {
    //    return rajQueue
    //}

    const addSrajClass = (kindOfSrajClass, moduleName) => {
        if (!rajClass[kindOfSrajClass]) rajClass[kindOfSrajClass] = {};

        rajClass[kindOfSrajClass][moduleName] = true;
    }

    const getAllSrajClass = () => {
        return rajClass
    }

    const initRajFullJSONReplacer = () => {
        rajFullJSONReplacer = new RajFullJSONReplacer;
        rajFullJSONReplacer.init();
    };

    //const initTemplate = () => {
    //    characterEffectTemplate = {};
    //};

    //const getDataGetTplFullParseJson = (data) => {
    //    let rajTemplate = new RajTemplate();
    //    rajTemplate.init();
    //
    //    let replaceData = rajTemplate.getReplaceData(data);
    //
    //    devConsoleLog(["mergeRajTemplate", "inputDataWithTemplate", data, "outputDataWithTemplate", replaceData]);
    //
    //    return replaceData
    //}


    const callSrajFromEngine = (data, kind) => {
        let srajStore = Engine.srajStore;
        for (let i = 0; i < data.length; i++) {

            let id = data[i].id;
            let additionalData = {
                srajId: id
            };
            //let exceptionData       = data[i].exception ? data[i].exception : [];
            let exceptionData = [];

            if (srajStore.checkSrajTemplate(id)) {
                let srajToCall = srajStore.getSrajTemplate(id, kind);

                //if (getDebug(CFG.DEBUG_KEYS.SRAJ)) {
                //    devConsoleLog(['callFromTemplate id', id]);
                //}

                parseJSON(srajToCall, exceptionData, additionalData)
            }

        }
    };

    const parseJSON = function(d, exception = [], additionalData) {
        let data;
        try {
            data = JSON.parse(d);
        } catch (e) {
            errorReport(moduleData.fileName, 'parseJSON', 'Incorrect JSON format!', d);
            return
        }

        if (addSrajToQueue) {
            addToSrajQueue(data, exception, additionalData);
            return;
        }

        updateRajObject(data, exception, additionalData);
    }

    const parseObject = function(data, exception, additionalData, callback) {

        if (addSrajToQueue) {
            addToSrajQueue(data, exception, additionalData, callback);
            return;
        }

        updateRajObject(data, exception, additionalData, callback);

    };

    const setAddSrajToQueue = (_addSrajToQueue) => {
        addSrajToQueue = _addSrajToQueue;
    }

    const setAddSrajToCaseQueue = (_addSrajToCaseQueue) => {
        addSrajToCaseQueue = _addSrajToCaseQueue;
    }

    const addToSrajQueue = (data, exception, additionalData, callback) => {
        rajQueue.push({
            data: data,
            exception: exception ? exception : null,
            additionalData: additionalData ? additionalData : null,
            callback: callback ? callback : null
        });
    }

    const addToCaseSrajQueue = (callback) => {
        rajCaseQueue.push(callback);
    }

    //const addToCallbackQueue = (callback) => {
    //    callbackQueue.push(callback);
    //}

    const clearRajCaseQueue = () => {
        rajCaseQueue = [];
    }

    //const clearCallbackQueue = () => {
    //    callbackQueue = []
    //}

    const callSrajQueue = () => {

        if (!rajQueue.length) {
            return
        }
        setAddSrajToCaseQueue(true);
        clearRajCaseQueue();

        if (getDebug(CFG.DEBUG_KEYS.SRAJ)) {
            //devConsoleLog('CALL_SRAJ_QUEUE', rajQueue);
        }

        for (let index in rajQueue) {
            let data = rajQueue[index];

            updateRajObject(data.data, data.exception, data.additionalData, data.callback);
        }

        let counter = 0

        callSrajCaseQueue(counter);
        setAddSrajToCaseQueue(false);
        //callCallbackQueue();
        //clearCallbackQueue();
        clearRajCaseQueue();
    }

    //const callCallbackQueue = () => {
    //    if (!callbackQueue.length) {
    //        return
    //    }
    //
    //    for (let index in callbackQueue) {
    //        callbackQueue[index]();
    //    }
    //
    //}

    const callSrajCaseQueue = (counter) => {
        if (!rajCaseQueue.length) {
            return
        }

        //console.log('callSrajCaseQueue', counter)

        let a = [];

        for (let i = 0; i < rajCaseQueue.length; i++) {
            a.push(rajCaseQueue[i]);
        }

        clearRajCaseQueue();

        for (let i = 0; i < a.length; i++) {
            a[i].callback();
        }

        if (a.length == rajCaseQueue.length) {
            return;
        } else {
            counter++;
            callSrajCaseQueue(counter);
        }
    }

    const clearRajQueue = () => {
        rajQueue = [];
    }

    const updateRajObject = (data, exception, additionalData, callback) => {
        //devConsoleLog(['SRAJ_CALL_BEFORE_REPLACE', data]);
        let onlyTutotrialCloseInternalFunction = false;
        if (data[RajData.TUTORIAL_CLOSE_INTERNAL_FUNCTION] && lengthObject(data)) {
            onlyTutotrialCloseInternalFunction = true
        }

        if (!onlyTutotrialCloseInternalFunction) {

            if (getDebug(CFG.DEBUG_KEYS.SRAJ)) {
                //devConsoleLog('SRAJ_CALL_BEFORE_REPLACE', GET_HARD_COPY_STRUCTURE(data), additionalData);
            }
            data = rajFullJSONReplacer.getRajDataAfterAllReplace(data);
            if (getDebug(CFG.DEBUG_KEYS.SRAJ)) {
                devConsoleLog('SRAJ_CALL_AFTER_REPLACE', data, additionalData);
            }

        }

        for (let beforeDataAddress in data) {

            if (exception && exception.indexOf(beforeDataAddress) > -1) continue;
            let key = BEFORE_ + beforeDataAddress;
            if (dispatcher[key]) {
                dispatcher[key](data[beforeDataAddress], additionalData, callback);
            }
        }

        for (let onDataAddress in data) {

            if (exception && exception.indexOf(onDataAddress) > -1) continue;
            let key = ON_ + onDataAddress;
            if (dispatcher[key]) {
                dispatcher[key](data[onDataAddress], additionalData, callback);
            }
        }

        for (let onDataAddress in data) {

            if (exception && exception.indexOf(onDataAddress) > -1) continue;
            let key = AFTER_ + onDataAddress;
            if (dispatcher[key]) {
                dispatcher[key](data[onDataAddress], additionalData, callback);
            }
        }
    };

    const manageSrajBeforeSuccessRespond = () => {
        setAddSrajToQueue(true);
        clearRajQueue();
    };

    const manageSrajAfterSuccessRespond = () => {
        setAddSrajToQueue(false);
        callSrajQueue()
        clearRajQueue();
    }

    const initDispatcher = function() {


        dispatcher = {
            [ON_ + RajData.INTERFACE_SKIN]: function(v) {
                Engine.themeController.updateData(v, ThemeData.THEME_KIND.EVENT);
            },
            [ON_ + RajData.WEATHER]: function(v, additionalData) {
                Engine.weather.updateDataWeatherFromRayController(v, additionalData);
            },
            [ON_ + RajData.NIGHT]: function(v, additionalData) {
                Engine.nightController.updateData(v, additionalData);
            },
            [BEFORE_ + RajData.PRELOAD_IMAGE]: function(v, additionalData) {
                Engine.rajPreloadImage.updateData(v, additionalData);
            },
            [ON_ + RajData.OVERRIDE_DAY_NIGHT_CYCLE]: function(v, additionalData) {
                Engine.overrideDayNightCycle.updateData(v, additionalData);
            },
            [ON_ + RajData.MAP_FILTER]: function(v, additionalData) {
                Engine.mapFilter.updateData(v, additionalData);
            },
            [ON_ + RajData.SCREEN_EFFECTS]: function(v, additionalData) {
                Engine.screenEffectsManager.updateData(v, additionalData);
            },
            [ON_ + RajData.FLOAT_FOREGROUND]: function(v, additionalData) {
                Engine.floatForegroundManager.updateDataFloatForegroundFromRayController(v, additionalData);
            },
            [ON_ + RajData.FLOAT_OBJECT]: function(v, additionalData) {
                Engine.floatObjectManager.updateDataFloatObjectFromRayController(v, additionalData);
            },
            [ON_ + RajData.TRACKING]: function(v, additionalData) {
                Engine.rajTracking.updateData(v, additionalData);
            },
            [ON_ + RajData.EARTHQUAKE]: function(v, additionalData) {
                Engine.earthQuakeManager.updateData(v, additionalData);
            },
            [ON_ + RajData.CHARACTER_EFFECT]: function(v, additionalData) {
                Engine.characterEffectsManager.updateData(v, additionalData);
            },
            [BEFORE_ + RajData.FAKE_NPC]: function(v, additionalData) {
                Engine.fakeNpcs.updateData(v, additionalData);
            },
            [ON_ + RajData.TUTORIAL]: function(v) {
                Engine.tutorialManager.startTutorialFromRayController(v)
            },
            [ON_ + RajData.TUTORIAL_CLOSE_INTERNAL_FUNCTION]: function(v) {
                Engine.tutorialManager.checkCanFinishExternalAndFinish(v)
            },
            [ON_ + RajData.CALLBACK_INTERNAL_FUNCTION]: function(v, additionalData, callback) {
                //Engine.tutorialManager.checkCanFinishExternalAndFinish(v)
                callback();
            },
            [ON_ + RajData.BATTLE_EVENTS]: function(v, additionalData) {
                //debugger;
                Engine.rajBattleEvents.updateData(v, additionalData);
            },
            [ON_ + RajData.MAP_EVENTS]: function(v, additionalData) {
                Engine.rajMapEvents.updateData(v, additionalData);
            },
            [ON_ + RajData.CHARACTER_IMAGE_CHANGER]: function(v, additionalData) {
                //debugger;
                Engine.rajCharacterImageChangerManager.updateData(v, additionalData);
            },
            [ON_ + RajData.WINDOW_EVENTS]: function(v, additionalData) {
                Engine.rajWindowEvents.updateData(v, additionalData);
            },
            [ON_ + RajData.MAP_EXTERNAL_PROPERTIES_REFRESH]: function(v, additionalData) {
                Engine.map.refreshRayControllerData(v);
            },
            [ON_ + RajData.PROGRAMMER]: function(v, additionalData) {
                Engine.rajProgrammer.updateData(v);
            },
            [ON_ + RajData.CAMERA]: function(v, additionalData) {
                Engine.rajCamera.updateData(v, additionalData);
            },
            [ON_ + RajData.JS_SCRIPT]: function(v, additionalData) {
                eval(v);
            },
            [ON_ + RajData.DIALOGUE]: function(v, additionalData) {
                Engine.rajDialogue.updateData(v, additionalData);
            },
            [ON_ + RajData.CHARACTER_HIDE]: function(v, additionalData) {
                Engine.rajCharacterHide.updateData(v, additionalData);
            },
            [ON_ + RajData.MASS_OBJECT_HIDE]: function(v, additionalData) {
                Engine.rajMassObjectHide.updateData(v, additionalData);
            },
            [BEFORE_ + RajData.EXTRA_LIGHT]: function(v, additionalData) {
                Engine.rajExtraLight.updateData(v, additionalData);
            },
            [AFTER_ + RajData.DYNAMIC_LIGHT]: function(v, additionalData) {
                Engine.dynamicLightsManager.updateData(v, additionalData);
            },
            [AFTER_ + RajData.DYNAMIC_DIR_CHARACTER_LIGHT]: function(v, additionalData) {
                Engine.dynamicDirCharacterLightsManager.updateData(v, additionalData);
            },
            [AFTER_ + RajData.BEHAVIOR_DYNAMIC_LIGHT]: function(v, additionalData) {
                Engine.behaviorDynamicLightsManager.updateData(v, additionalData);
            },
            [BEFORE_ + RajData.EMO_DEFINITIONS]: function(v, additionalData) {
                Engine.rajEmoDefinitions.updateData(v);
            },
            [ON_ + RajData.EMO_ACTIONS]: function(v, additionalData) {
                Engine.rajEmoActions.updateData(v, additionalData);
            },
            [ON_ + RajData.YELLOW_MESSAGE]: function(v, additionalData) {
                Engine.rajYellowMessage.updateData(v);
            },
            [ON_ + RajData.SEQUENCE]: function(v, additionalData) {
                Engine.rajSequenceManager.updateData(v, additionalData);
            },
            [ON_ + RajData.RANDOM_CALLER]: function(v, additionalData) {
                Engine.rajRandomCallerManager.updateData(v, additionalData);
            },
            [ON_ + RajData.SOUND]: function(v, additionalData) {
                Engine.rajSoundManager.updateData(v, additionalData);
            },
            [ON_ + RajData.AREA_TRIGGER]: function(v, additionalData) {
                Engine.rajAreaTriggerManager.updateData(v, additionalData);
            },
            [ON_ + RajData.MAP_MUSIC]: function(v, additionalData) {
                Engine.rajMapMusicManager.updateData(v, additionalData);
            },
            [ON_ + RajData.SRAJ_WINDOW]: function(v, additionalData) {
                Engine.rajWindowManager.updateData(v, additionalData);
            },
            [AFTER_ + RajData.ZOOM]: function(v, additionalData) {
                Engine.rajZoomManager.updateData(v, additionalData);
            },
            [AFTER_ + RajData.CANVAS_FILTER]: function(v, additionalData) {
                Engine.rajCanvasFilter.updateData(v, additionalData);
            },
            [AFTER_ + RajData.CONNECT_SRAJ]: function(v, additionalData) {
                for (let i = 0; i < v.length; i++) {
                    if (lengthObject(v[i]) == 0) continue;
                    parseObject(v[i], [], additionalData);
                }
            }
        }
    };

    const checkRajKeyExist = (rajKey) => {
        for (let k in RajData) {
            if (RajData[k] == rajKey) return true;
        }
        return false;
    }

    this.testNight = () => {
        //let o = '{"night":{"action":"CREATE","color":{"r":0,"g":0,"b":0,"a":0.7},"list":[{"light":{"r":30,"color":{"r":255,"g":0,"b":0,"a":0.3}},"x":6,"y":8,"r":80},{"light":{"r":30,"color":{"r":0,"g":255,"b":0,"a":0.3}},"x":8,"y":8,"r":80},{"x":14,"y":8,"r":80}]}}';
        //let o = '{"night":{"action":"CREATE","color":{"r":0,"g":0,"b":0,"a":0.7},"list":[{"light":{"r":30,"color":{"r":255,"g":157,"b":0,"a":0.6}},"x":15,"y":18,"r":80}]}}';
        let o = '{"night":{"action":"CREATE","color":{"r":0,"g":0,"b":0,"a":0.7},"list":[{"light":{"r":20,"color":{"r":255,"g":157,"b":0,"a":0.6}},"x":26,"y":15,"r":80},{"x":20,"y":15,"r":80}]}}';
        parseJSON(o);
    };
    //
    //this.testFog = () => {
    //    debugger;
    //    let o = '{"fog":{"action":"CREATE","color":{"r":57,"g":37,"b":83,"a":1.0},"list":[{"x":7,"y":7,"r":480,"gradientPercent1":100,"gradientPercent2":100}]}}';
    //    parseJSON(o);
    //};

    this.testNightWithEmptyList = () => {
        let o = '{"night":{"action":"CREATE","color":{"r":0,"g":0,"b":0,"a":0.7},"list":[]}}';
        parseJSON(o);
    };

    this.testRemoveNight = () => {
        let o = '{"night":{"action":"REMOVE"}}';
        parseJSON(o);
    };

    this.testRemoveFog = () => {
        let o = '{"fog":{"action":"REMOVE"}}';
        parseJSON(o);
    };

    this.testPreloadImage = () => {
        let o = '{"preloadImage":{"list":[{"url":"chmury/obj2.png"}]}}';
        parseJSON(o);
    };

    this.testPreloadImage2 = () => {
        let o = '{"preloadImage":{"list":[{"url":"chmury/obj2.png"},{"url":"chmury/kuf_gho-shiitm.gif","type":"RAJ_PATH","gif":true},{"url":"hum/dzikus1.gif","type":"NPC_PATH","gif":true},{"url":"paid/cda2017m.gif","type":"OTHERS_PATH","gif":true,"fast":true}]}}';
        parseJSON(o);
    };


    this.createTextFakeNpc = () => {
        let o = '{"fakeNpc":{"list":[{"action":"CREATE","id":1,"x":2,"y":8,"img":"/noob/hm.gif","click":{"characterEffect":{"list":[{"action":"CREATE","windowTarget":"MAP","name":"anim1","target":{"kind":"FAKE_NPC","id":1},"effect":"TEXT","params":{"position":"TOP","text":["one","two","three","four","five","six","seven","eight"]}}]}},"behavior":{"repeat":true,"list":[{"name":"IDLE"}]}}]}}'

        parseJSON(o);
    }

    this.createHeroDirFakeNpc = () => {
        let o = '{"fakeNpc":{"list":[{"action":"CREATE","id":1,"x":2,"y":8,"img":"/noob/hm.gif","click":{"characterEffect":{"list":[{"action":"CREATE","windowTarget":"MAP","name":"anim1","target":{"kind":"FAKE_NPC","id":1},"effect":"TEXT","params":{"position":"TOP","text":["one","two","three","four","five","six","seven","eight"]}}]}},"behavior":{"repeat":true,"list":[{"name":"IDLE","dir":{"getCharacterData":{"kind":"HERO","toGet":"dir"}}}]}}]}}'

        parseJSON(o);
    }

    this.createHeroDirFakeBug = () => {
        let o = '{"fakeNpc":{"list":[{"action":"CREATE","id":1,"x":2,"y":8,"img":"/noob/hm.gif","click":{"characterEffect":{"list":[{"action":"CREATE","windowTarget":"MAP","name":"anim1","target":{"kind":"FAKE_NPC","id":1},"effect":"TEXT","params":{"position":"TOP","text":["one","two","three","four","five","six","seven","eight"]}}]}},"behavior":{"repeat":true,"list":[{"name":"IDLE","dir":{"getCharacterData":{"kind":"HERO","toGeta":"dir"}}}]}}]}}'

        parseJSON(o);
    }


    this.testTextBlario = () => {
        let o = '{"characterEffect":{"list":[{"action":"CREATE","windowTarget":"MAP","name":"anim1","target":{"kind":"NPC","id":"10008"},"effect":"TEXT","params":{"position":"TOP","text":["one","two","three","four","five","six","seven","eight"]}}]}}'

        parseJSON(o);
    }

    this.testTextBlarioBeforeAfter = () => {
        let o = '{"characterEffect":{"list":[{"action":"CREATE","windowTarget":"MAP","name":"anim1","target":{"kind":"NPC","id":"10008"},"effect":"TEXT","params":{"position":"TOP","duration":1,"between":0,"repeat":2,"delayBefore":5,"delayAfter":5,"text":["one","two","three"]}}]}}'

        parseJSON(o);
    }

    this.testCharacterEffetsTintBlarioBeforeAfter = () => {
        let o = '{"characterEffect":{"list":[{"action":"CREATE","windowTarget":"MAP","name":"anim1","target":{"kind":"NPC","id":"10008"},"effect":"TINT","params":{"duration":5,"repeat":true,"delayAfter":5,"color":"255,0,255"}}]}}'
        parseJSON(o);
    }

    this.testCharacterEffetsIconBlarioBeforeAfter = () => {
        let o = '{"characterEffect":{"list":[{"action":"CREATE","windowTarget":"MAP","name":"anim1","target":{"kind":"NPC","id":"10008"},"effect":"ANIMATION","params":{"position":"CENTER","gifUrl":"204_blyskawiczny-atak.gif","repeat":true,"delayAfter":5}}]}}'
        parseJSON(o);
    }

    this.testTextBlarioRandomTrue = () => {
        let o = '{"characterEffect":{"list":[{"action":"CREATE","windowTarget":"MAP","name":"anim1","target":{"kind":"NPC","id":"10008"},"effect":"TEXT","params":{"position":"TOP","random":true,"text":["one","two","three","four","five","six","seven","eight"]}}]}}'

        parseJSON(o);
    }

    this.testIconEffectBehind = () => {
        let o = `{"characterEffect":{"list":[{"action":"CREATE","name":"tytxd","windowTarget":"MAP","effect":"ANIMATION","target":{"kind":"HERO","id":1},"params":{"behind":true,"gifUrl":"titanharpy.gif","repeat":true,"position":"CENTER"}}]}}`;

        parseJSON(o);
    }

    this.testIconEffect = () => {
        let o = `{"characterEffect":{"list":[{"action":"CREATE","name":"nanana","windowTarget":"MAP","effect":"ANIMATION","target":{"kind":"HERO"},"params":{"position":"LEFT","gifUrl":"204_blyskawiczny-atak.gif","repeat":true}}]}}`;

        parseJSON(o);
    }

    //this.testChain = () => {
    //    let o = `{"characterEffect":{"list":[{"action":"CREATE","name":"albion-czaruje","windowTarget":"MAP","effect":"TINT","target":{"kind":"NPC","id":1},"chainEffects":{"chainTab":[0,1],"timeBetween":1.5,"chainRepeat":true,"chainIndex":0},"params":{"duration":0.3,"color":"210,250,250","repeat":1,"position":"CENTER"}},{"action":"CREATE","windowTarget":"MAP","name":"albion-czaruje","effect":"ANIMATION","target":{"kind":"NPC","id":1},"chainEffects":{"chainIndex":1},"params":{"gifUrl":"123_szadz.gif","position":"CENTER","repeat":1}}]}}`;
    //
    //    parseJSON(o);
    //};

    this.testStickMapTextEffect = () => {
        let o = `{"characterEffect":{"list":[{"action":"CREATE","id":"Sralala-0","windowTarget":"MAP","effect":"TEXT","target":{"kind":"HERO"},"params":{"stickMap":true,
        "text":[
        "Yeaaaahh","KE?","Nanana","Naaaah","Meeeeh","BOOM"
        ]}}]}}`;

        parseJSON(o);
    };

    this.testStickMapBlackTextEffect = () => {
        let o = `{"characterEffect":{"list":[{"action":"CREATE","id":"Sralala-1","windowTarget":"MAP","effect":"TEXT","target":{"kind":"HERO"},"params":{"color":{"r":0,"g":0,"b":0},"stickMap":true,"text":["Yeaaaahh","KE?","Nanana","Naaaah","Meeeeh","BOOM"]}}]}}`;

        parseJSON(o);
    };

    this.testRandomTextEffect = () => {
        //let o = `{"characterEffect":{"list":[{"action":"CREATE","id":"Sralala","windowTarget":"MAP","effect":"TEXT","target":{"kind":"HERO"},"params":{"random":true,"between":1, "duration":1,"position":"TOP","repeat":true,
        let o = `{"characterEffect":{"list":[{"action":"CREATE","id":"Sralala","windowTarget":"MAP","effect":"TEXT","params":{"random":true,"between":1, "duration":1,"position":"TOP","repeat":true,
        "text":[
        "Yeaaaahh","KE?","Nanana","Naaaah","Meeeeh","BOOM"
        ]}}]}}`;

        parseJSON(o);
    };

    this.testTextEffect = () => {
        let o = `{"characterEffect":{"list":[{"action":"CREATE","name":"Sralala","windowTarget":"MAP","effect":"TEXT","target":{"kind":"HERO"},"params":{"between":1, "duration":1,"position":"TOP","repeat":true,
        "text":[
        "Yeaaaahh","KE?","Nanana","Naaaah","Meeeeh","BOOM"
        ]}}]}}`;

        parseJSON(o);
    };

    this.testRemoveFakeNpc = () => {

        let o = '{"fakeNpc":{"list":[{"action":"REMOVE","id":0}]}}';
        parseJSON(o);
    };

    this.testTutorialItem = () => {
        let o = '{"tutorial":{"textPc":"testowy textPc","textMobile":"testowy HeaderMobile","headerPc":"testowy HeaderPc","graphic":"/img/gui/newTutorial/1.gif","htmlFocus":".interface-layer>.right-column.main-column","htmlPosition":".interface-layer>.right-column.main-column","itemsNeed":{"htmlMultiGlow":true,"items":{"w":{"16":{"loc":"g","tpl":177}},"p":{"16":{"loc":"g","tpl":177}},"m":{"16":{"loc":"g","tpl":177}},"t":{"16":{"loc":"g","tpl":177}},"h":{"16":{"loc":"g","tpl":177}},"b":{"16":{"loc":"g","tpl":177}}}},"blink":true,"onFinish":{"require":[{"useItemTpl":[177]}]}}}'; // mienso
        parseJSON(o)
    }

    this.testMove = () => {
        let o = '{"tutorial":{"textPc":"testowy [color=red]textPc[/color]","textMobile":"[color=blue]testowy HeaderMobile[/color]","headerPc":"[color=orange]testowy HeaderPc[/color]","headerMobile":"[color=red]testowy HeaderPc[/color]","graphic":"/img/gui/newTutorial/6.gif","htmlFocus":".echh-layer","canvasMultiGlow":{"objects":[{"typeObject":"hero"}]},"blink":true,"canvasPosition":{"typeObject":"hero"},"onFinish":{"require":[{"moveRequire":true}]}}}';
        parseJSON(o)
    }

    this.testMoveCase = () => {
        debugger;
        let o = '{"tutorial":{"case":{"quest":{"ACTIVE":[1022,1356],"NEVER_OCCUR":[1],"NOT_FINISH":[1022],"FINISH":[1425]}},"textPc":"testowy [color=red]textPc[/color]","textMobile":"[color=blue]testowy HeaderMobile[/color]","headerPc":"[color=orange]testowy HeaderPc[/color]","headerMobile":"[color=red]testowy HeaderPc[/color]","graphic":"/img/gui/newTutorial/6.gif","htmlFocus":".echh-layer","canvasMultiGlow":{"objects":[{"typeObject":"hero"}]},"blink":true,"canvasPosition":{"typeObject":"hero"},"onFinish":{"require":[{"moveRequire":true}]}}}';
        parseJSON(o)
    }

    this.testTalkTutorial = () => {
        let o = '{"tutorial":{"textPc":"Podejdz do zioma tekst","textMobile":"Podejdz do zioma tekst","headerPc":"Podejdz do zioma header","headerMobile":"Podejdz do zioma header","htmlPositionOffset":{"left": 10, "top": 0}, "htmlPosition":".tutorial-banner-anchor","graphic":"/img/gui/newTutorial/8.gif","htmlMultiGlow":[".widget-in-interface-bar.widget-npc-talk-icon"],"canvasMultiGlow":{"objects":[{"typeObject":"npc","id":1}]},"canvasPosition":{"typeObject":"npc","id":10008},"blink":true,"onFinish":{"require":[{"talkNpcId":10008}]}}}';
        parseJSON(o)
    }

    this.testAttackNpcTutorial = () => {
        let o = '{"tutorial":{"textPc":"Podejdz do zioma tekst","textMobile":"Podejdz do zioma tekst","headerPc":"Podejdz do zioma header","headerMobile":"Podejdz do zioma header","htmlPositionOffset":{"left": 10, "top": 0}, "htmlPosition":".tutorial-banner-anchor","graphic":"/img/gui/newTutorial/8.gif","htmlMultiGlow":[".widget-in-interface-bar.widget-npc-talk-icon"],"canvasMultiGlow":{"objects":[{"typeObject":"npc","id":1}]},"canvasPosition":{"typeObject":"npc","id":76972},"blink":true,"onFinish":{"require":[{"attackNpcId":76972}]}}}';
        parseJSON(o)
    }

    this.testPreventRepeatAttackNpcTutorial = () => {
        let o = '{"tutorial":{"id":-1132134,"textPc":"Podejdz do zioma tekst","textMobile":"Podejdz do zioma tekst","headerPc":"Podejdz do zioma header","headerMobile":"Podejdz do zioma header","htmlPositionOffset":{"left":10,"top":0},"htmlPosition":".tutorial-banner-anchor","graphic":"/img/gui/newTutorial/8.gif","htmlMultiGlow":[".widget-in-interface-bar.widget-npc-talk-icon"],"canvasMultiGlow":{"list":[{"kind":"NPC","id":104271}]},"canvasPosition":{"kind":"NPC","id":104271},"blink":true,"preventRepeat":{"name":"asd"},"onFinish":{"require":[{"attackNpcId":104271}]}}}';
        parseJSON(o)
    }

    this.testTutorialExternalProperties = () => {
        let o = '{"tutorial":{"textPc":"Podejdz do zioma tekst","textMobile":"Podejdz do zioma tekst","headerPc":"Podejdz do zioma header","headerMobile":"Podejdz do zioma header","graphic":"/img/gui/newTutorial/8.gif","external_properties":{"night":{"action":"CREATE","color":{"r":0,"g":0,"b":0,"a":0.7},"list":[{"light":{"r":20,"color":{"r":255,"g":157,"b":0,"a":0.6}},"x":26,"y":15,"r":80},{"x":20,"y":15,"r":80}]}},"blink":true,"onFinish":{"external_properties":{"night":{"action":"REMOVE"}},"require":[{"moveRequire":true}]}}}';
        parseJSON(o)
    }

    this.testTutorialBattleSkill = () => {
        let o = '{"tutorial":{"textPc":"use skill","textMobile":"use skill","headerPc":"use skill","headerMobile":"use skill","graphic":"/img/gui/newTutorial/8.gif","blink":true,"onFinish":{"require":[{"useBattleSkill":-1}]}}}';
        parseJSON(o);
    }

    this.testTutorialBattleSkillAbsoluteFinishEndBattle = () => {
        let o = '{"tutorial":{"textPc":"use skill","textMobile":"use skill","headerPc":"use skill","headerMobile":"use skill","graphic":"/img/gui/newTutorial/8.gif","blink":true,"onFinish":{"require":[{"useBattleSkill":-1}],"absoluteFinish":["endBattle"]}}}';
        parseJSON(o);
    }

    this.testTutorialItemsInBasket = () => {
        let o = '{"tutorial":{"textPc":"t_17_ni_pl","textMobile":"t_17_ni_mobile_pl","headerPc":"t_header_17_ni_pl","headerMobile":"t_header_17_ni_pl","graphic":"/img/gui/newTutorial/1.gif","itemsNeed":{"htmlMultiGlow":true,"tpls":{"w":{"9":{"loc":"n","tpl":63}},"p":{"9":{"loc":"n","tpl":63}},"m":{"9":{"loc":"n","tpl":63}},"t":{"9":{"loc":"n","tpl":63}},"h":{"9":{"loc":"n","tpl":63}},"b":{"9":{"loc":"n","tpl":63}}}},"htmlMultiGlow":[".inner-content>.shop-wrapper>.shop-content>.buy-items"],"htmlPosition":".border-window:has(.content:has(.inner-content:has(.shop-wrapper)))","blink":true,"onFinish":{"require":[{"itemsInBasket":true}]}}}';
        parseJSON(o);
    }

    this.testTutorialItemsInBasketCloseShop = () => {
        let o = '{"tutorial":{"textPc":"t_17_ni_pl","textMobile":"t_17_ni_mobile_pl","headerPc":"t_header_17_ni_pl","headerMobile":"t_header_17_ni_pl","graphic":"/img/gui/newTutorial/1.gif","itemsNeed":{"htmlMultiGlow":true,"tpls":{"w":{"9":{"loc":"n","tpl":63}},"p":{"9":{"loc":"n","tpl":63}},"m":{"9":{"loc":"n","tpl":63}},"t":{"9":{"loc":"n","tpl":63}},"h":{"9":{"loc":"n","tpl":63}},"b":{"9":{"loc":"n","tpl":63}}}},"htmlMultiGlow":[".inner-content>.shop-wrapper>.shop-content>.buy-items"],"htmlPosition":".border-window:has(.content:has(.inner-content:has(.shop-wrapper)))","blink":true,"onFinish":{"require":[{"itemsInBasket":true}],"break":["closeShop"]}}}';
        parseJSON(o);
    }

    this.testTutorialStepByStep = () => {
        let o = '{"tutorial":{"textPc":"pierwszy tutorial","textMobile":"pierwszy tutorial","headerPc":"pierwszy tutorial","headerMobile":"pierwszy tutorial","graphic":"/img/gui/newTutorial/8.gif","blink":true,"onFinish":{"external_properties":{"tutorial":{"textPc":"drugi tutorial","textMobile":"drugi tutorial","headerPc":"drugi tutorial","headerMobile":"drugi tutorial","graphic":"/img/gui/newTutorial/8.gif","blink":true,"onFinish":{"external_properties":{"night":{"action":"REMOVE"}},"require":[{"useItemTpl":[177]}]}}},"require":[{"moveRequire":true}]}}}';
        parseJSON(o);
    }

    this.testTutorialStepByStepCloseShop = () => {
        let o = '{"tutorial":{"textPc":"do koszyka itemy now!","textMobile":"do koszyka itemy now!","headerPc":"do koszyka itemy now!","headerMobile":"do koszyka itemy now!","graphic":"/img/gui/newTutorial/1.gif","itemsNeed":{"htmlMultiGlow":true,"tpls":{"w":{"15":{"loc":"n","tpl":3232}},"p":{"15":{"loc":"n","tpl":3232}},"m":{"15":{"loc":"n","tpl":3232}},"t":{"15":{"loc":"n","tpl":3232}},"h":{"15":{"loc":"n","tpl":3232}},"b":{"15":{"loc":"n","tpl":3232}}}},"htmlMultiGlow":[".inner-content>.shop-wrapper>.shop-content>.buy-items"],"htmlPosition":".border-window:has(.content:has(.inner-content:has(.shop-wrapper)))","blink":true,"onFinish":{"require":[{"itemsInBasket":true}],"break":["closeShop"],"external_properties":{"tutorial":{"textPc":"akceptuj itemy now!","textMobile":"akceptuj itemy now!","headerPc":"akceptuj itemy now!","headerMobile":"akceptuj itemy now!","graphic":"/img/gui/newTutorial/1.gif","htmlFocus":".shop-wrapper>.shop-content>.finalize-button","htmlPosition":".shop-wrapper>.shop-content>.finalize-button","blink":true,"onFinish":{"require":[{"acceptBasket":true}],"break":["closeShop"]}}}}}}';
        parseJSON(o);
    }

    this.testTutorialRecipeWidget = () => {
        let o = '{"tutorial":{"textPc":"click widget CRAFTING!!","textMobile":"[color=blue]testowy HeaderMobile[/color]","headerPc":"[color=orange]testowy HeaderPc[/color]","headerMobile":"[color=red]testowy HeaderPc[/color]","graphic":"/img/gui/newTutorial/6.gif","htmlFocus":".widget-button:has(.icon.photo)","blink":true,"htmlPosition":".widget-button:has(.icon.photo)","onFinish":{"require":[{"clickWidget":"photo"}]}}}';
        parseJSON(o);
    }

    this.testTutorialOpenWindow = () => {
        let o = '{"tutorial":{"id": -10,"textPc":"CRAFTING!!","textMobile":"[color=blue]testowy HeaderMobile[/color]","headerPc":"[color=orange]testowy HeaderPc[/color]","headerMobile":"[color=red]testowy HeaderPc[/color]","graphic":"/img/gui/newTutorial/6.gif","htmlFocus":".widget-button:has(.icon.photo)","blink":true,"htmlPosition":".widget-button:has(.icon.photo)","onFinish":{"require":[{"openWindow":"CRAFTING"}]}}}';
        parseJSON(o);
    }

    this.testTutorialClickRecipeOnList = () => {
        let o = '{"tutorial":{"textPc":"click widget CRAFTING!!","textMobile":"[color=blue]testowy HeaderMobile[/color]","headerPc":"[color=orange]testowy HeaderPc[/color]","headerMobile":"[color=red]testowy HeaderPc[/color]","graphic":"/img/gui/newTutorial/6.gif","htmlFocus":".crafting-recipe-in-list.recipe-id-804","blink":true,"htmlPosition":".crafting-recipe-in-list.recipe-id-804","onFinish":{"require":[{"clickRecipeOnList":804}]}}}';
        parseJSON(o);
    }

    this.testTutorialClickUseRecipe = () => {
        let o = '{"tutorial":{"textPc":"click widget CRAFTING!!","textMobile":"[color=blue]testowy HeaderMobile[/color]","headerPc":"[color=orange]testowy HeaderPc[/color]","headerMobile":"[color=red]testowy HeaderPc[/color]","graphic":"/img/gui/newTutorial/6.gif","htmlFocus":".do-recipe .crafting-description-button .button","blink":true,"htmlPosition":".do-recipe .crafting-description-button .button","onFinish":{"require":[{"useRecipe":804}]}}}';
        parseJSON(o);
    }

    this.testTutorialBattleEventsOnStartFight = () => {
        let o = '{"battleEvents":{"ON_START_FIGHT_WITH_NPC":{"tutorial":{"blink":true,"draggableWnd":false,"graphic":"/img/gui/newTutorial/9_eng.gif","headerMobile":"Close battle window","headerPc":"Close battle window","htmlFocus":".close-battle-ground","htmlPosition":".tutorial-banner-anchor","onFinish":{"absoluteFinish":["heroEndBattle"],"require":[{"useBattleSkill":-1}]},"textMobile":"","textPc":""}}}}';
        parseJSON(o);
    }

    this.testTutorialWindowEventsOnOpen = () => {
        let o = '{"windowEvents":{"ON_OPEN":{"windowName":"CRAFTING","external_properties":{"tutorial":{"blink":true,"graphic":"/img/gui/newTutorial/9_eng.gif","headerMobile":"RECIPES WND","headerPc":"Nana","onFinish":{"require":[{"moveRequire":true}]},"textMobile":"asd asd","textPc":"asd asd"}}}}}';
        parseJSON(o);
    }

    this.testTutorialWindowEventsOnOpen = () => {
        let o = '{"windowEvents":{"list":[{"action":"CREATE","id":0,"name":"ON_UPDATE","windowName":"CRAFTING","external_properties":{"tutorial":{"textPc":"","textMobile":"","headerPc":"Click known recipe","headerMobile":"Click known recipe","graphic":"/img/gui/newTutorial/1.gif","id":-15,"htmlMultiGlow":[".recipe-id-821"],"draggableWnd":false,"htmlPositionOffset":{"left":10,"top":-30},"htmlPosition":".tutorial-banner-anchor","blink":true,"onFinish":{"require":[{"clickRecipeOnList":821}],"break":["closeCrafting"],"external_properties":{"tutorial":{"textPc":"","textMobile":"","headerPc":"Accept offer","headerMobile":"Accept offer","graphic":"/img/gui/newTutorial/1.gif","id":-16,"htmlMultiGlow":[".recipes-content .bottom-row-panel .do-recipe .button.green"],"draggableWnd":false,"htmlPositionOffset":{"left":10,"top":-30},"htmlPosition":".tutorial-banner-anchor","blink":true,"onFinish":{"require":[{"useRecipe":821}],"break":["closeCrafting"]}}}}}}}]}}';
        parseJSON(o);
    }

    this.testTutorialWindowEventsOnUpdate = () => {
        let o = '{"windowEvents":{"ON_UPDATE":{"windowName":"CRAFTING","external_properties":{"tutorial":{"id":-15,"blink":true,"graphic":"/img/gui/newTutorial/9_eng.gif","headerMobile":"RECIPES WND","headerPc":"Nana","htmlFocus":".crafting-recipe-in-list.recipe-id-244","htmlPosition":".crafting-recipe-in-list.recipe-id-244","onFinish":{"require":[{"clickRecipeOnList":244}]},"textMobile":"asd asd","textPc":"asd asd"}}}}}';
        parseJSON(o);
    }

    this.testTutorialWindowEventsOnUpdate2 = () => {
        let o = '{"windowEvents":{"ON_UPDATE":{"windowName":"CRAFTING","external_properties":{"tutorial":{"id":-15,"blink":true,"graphic":"/img/gui/newTutorial/9_eng.gif","headerMobile":"RECIPES WND","headerPc":"Nana","htmlMultiGlow":[".crafting-recipe-in-list.recipe-id-244"],"htmlPosition":".crafting-recipe-in-list.recipe-id-244","onFinish":{"require":[{"clickRecipeOnList":244}],"break":["closeCrafting"]},"textMobile":"asd asd","textPc":"asd asd"}}}}}';
        parseJSON(o);
    }

    this.testNightCase = () => {
        debugger;
        let o = '{"night":{"action":"CREATE","color":{"r":0,"g":0,"b":0,"a":0.9},"list":[{"light":{"r":20,"color":{"r":255,"g":157,"b":0,"a":0.6}},"case":{"QUEST":{"ACTIVE":[1718]}},"x":26,"y":15,"r":80},{"x":20,"y":15,"r":80}]}}';
        parseJSON(o);
    };

    this.testNightCaseMapExternalPropertiesRefresh = () => {
        debugger;
        let o = '{"mapExternalPropertiesRefresh":["night"]}';
        parseJSON(o);
    };

    this.testNightMinAlpha = () => {
        debugger;
        let o = '{"night":{"action":"CREATE","color":{"r":0,"g":0,"b":0,"a":0.6},"dayNightCycle":{"dayDuration":1,"minAlpha":0.6},"list":[{"x":28,"y":21},{"x":26,"y":21}]}}';
        parseJSON(o);
    };

    this.testCreateProgrammer10 = () => {
        let o = '{"template":{"CREATE_BUBBLE":{"weather":{"list":[{"action":"CREATE","name":"Bubble"}]}},"REMOVE_BUBBLE":{"weather":{"list":[{"action":"REMOVE","name":"Bubble"}]}}},"programmer":{"list":[{"id":10,"action":"CREATE","name":"LOOPPER","duration":"00:01:00","delay":"00:02:00","start":{"time":"00:00:01","external_properties":{"getTpl":"CREATE_BUBBLE"}},"end":{"time":"23:59:59","external_properties":{"getTpl":"REMOVE_BUBBLE"}}}]}}';
        parseJSON(o);
    };

    this.testBubble = () => {
        let o = '{"weather":{"list":[{"action":"CREATE","name":"Bubble"}]}}';
        parseJSON(o);
    };

    this.testRemoveProgrammer10 = () => {
        let o = '{"programmer":{"list":[{"id":10,"action":"REMOVE","name":"LOOPPER"}]}}';
        parseJSON(o);
    };

    this.testCreateProgrammer11 = () => {
        let o = '{"template":{"CREATE_RAIN":{"weather":{"list":[{"action":"CREATE","name":"Rain"}]}},"REMOVE_RAIN":{"weather":{"list":[{"action":"REMOVE","name":"Rain"}]}}},"programmer":{"list":[{"id":11,"action":"CREATE","name":"NORMAL_DAY","start":{"time":"00:00:01","external_properties":{"getTpl":"CREATE_RAIN"}},"end":{"time":"23:59:59","external_properties":{"getTpl":"REMOVE_RAIN"}}}]}}';
        parseJSON(o);
    };

    this.testRemoveProgrammer11 = () => {
        let o = '{"programmer":{"list":[{"id":11,"action":"REMOVE","name":"NORMAL_DAY"}]}}';
        parseJSON(o);
    };

    this.testCreateForceProgrammer11 = () => {
        let o = '{"programmer":{"list":[{"id":11,"action":"CREATE_FORCE","name":"NORMAL_DAY","start":{"time":"00:00:01","external_properties":{"yellowMessage":{"list":[{"action":"CREATE","text":"Nan na na"}]}}},"end":{"time":"23:59:59"}}]}}';
        parseJSON(o);
    };

    this.testGetTemplate = () => {
        let o = '{"template":{"0":{"action":"CREATE","windowTarget":"MAP","effect":"ANIMATION","target":{"kind":"FAKE_NPC"},"params":{"position":"RIGHT","gifUrl":"204_blyskawiczny-atak.gif","repeat":1}},"1":{"action":"CREATE","windowTarget":"MAP","effect":"TEXT","target":{"kind":"FAKE_NPC"},"params":{"position":"TOP","text":["one","two","three","four","five","six","seven","eight"]}}},"fakeNpc":{"list":[{"action":"CREATE","id":0,"x":1,"y":5,"img":"/noob/hm.gif","behavior":{"repeat":true,"list":[{"name":"WALK_AND_TP_START","x":13,"y":7,"speed":2,"external_properties":{"characterEffect":{"list":[{"getTpl":0,"name":"Sralala1","target":{"id":0}}]}}}]}},{"action":"CREATE","id":1,"x":2,"y":8,"img":"/noob/hm.gif","click":{"characterEffect":{"list":[{"getTpl":1,"name":"textText2","target":{"id":1},"params":{"repeat":1,"random":"ONE","height":20,"color":"0,255,0"}},{"getTpl":0,"name":"anim1","target":{"id":1},"params":{"position":"CENTER"}}]}},"behavior":{"repeat":true,"list":[{"name":"IDLE"}]}}]}}';
        parseJSON(o);
    }

    this.testSrajWindow0 = () => {
        let o = '{"srajWindow":{"list":[{"action":"CREATE","id":"0","header":"Nazwa okienka","overlay":true,"list":[{"name":"TEXT","text":"[center]Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore eo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. r adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem odit aut fugit. Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.[/center][br]"},{"name":"BUTTON_CONTAINER","list":[{"name":"BUTTON","label":"OK","click":{"external_properties":{},"function":"CLOSE","jsScript":"console.log()"}},{"name":"BUTTON","label":"CANCEL","click":{"external_properties":{},"function":"CLOSE","jsScript":"console.log()"}}]}]}]}}'
        parseJSON(o);
    }

    this.testSrajWindow1 = () => {
        let o = '{"srajWindow":{"list":[{"action":"CREATE","id":"1","header":"Nazwa okienka","list":[{"name":"TEXT","text":"[center]Lorem ipsptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur e dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.[/center][br]"},{"name":"BUTTON","label":"OK","click":{"external_properties":{},"function":"CLOSE","jsScript":"console.log()"}}]}]}}'
        parseJSON(o);
    }

    this.testSrajWindow2 = () => {
        let o = '{"srajWindow":{"list":[{"action":"CREATE","id":"2","header":"Nazwa okienka","list":[{"name":"TEXT","text":"[center]Lorem ips nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis au, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.[/center][br]"},{"name":"BUTTON_CONTAINER","list":[{"name":"BUTTON","label":"OK","click":{"external_properties":{},"function":"CLOSE","jsScript":"console.log()"}},{"name":"BUTTON","label":"MAYBE","click":{"external_properties":{},"function":"CLOSE","jsScript":"console.log()"}},{"name":"BUTTON","label":"CANCEL","click":{"external_properties":{},"function":"CLOSE","jsScript":"console.log()"}}]}]}]}}'
        parseJSON(o);
    }

    this.testSrajWindow3 = () => {
        let o = '{"srajWindow":{"list":[{"action":"CREATE","id":"2","header":"Nazwa okienka","list":[{"name":"TEXT","text":"[center]Lorem ips nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis au, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.[/center][br]"},{"name":"BUTTON_CONTAINER","list":[{"name":"BUTTON","label":"OK","click":{"external_properties":{},"function":"CLOSE","jsScript":"console.log()"}},{"name":"BUTTON","label":"MAYBE","click":{"external_properties":{},"function":"CLOSE","jsScript":"console.log()"}},{"name":"BUTTON","label":"CANCEL","click":{"external_properties":{},"function":"CLOSE","jsScript":"console.log()"}}]}]}]}}'
        parseJSON(o);
    }

    this.testSrajWindow4 = () => {
        let o = '{"srajWindow":{"list":[{"action":"CREATE","id":3,"header":"Nazwa okienka","position":{"canvasPosition":{}},"list":[{"name":"TEXT","text":"[center]Lorem ipsptate quia dolor sit amet.[/center][br]"},{"name":"IMAGE","url":"chmury/obj2.png"},{"name":"TEXT","text":"[center]Lorem ipsptati dolorem ipsum quia dolor sit amet.[/center][br]"},{"name":"BUTTON","label":"OK","click":{"external_properties":{},"function":"CLOSE","jsScript":"console.log()"}}]}]}}'
        parseJSON(o);
    }

    this.testSrajWindow5 = () => {
        let o = '{"srajWindow":{"list":[{"action":"CREATE","id":3,"header":"Nazwa okienka","position":{"canvasPosition":{}},"list":[{"name":"TEXT","text":"[center]Lorem ipsptate quia dolor sit amet.[/center][br]"},{"name":"IMAGE","url":"chmury/obj1.png"},{"name":"TEXT","text":"[center]Lorem ipsptati dolorem ipsum quia dolor sit amet.[/center][br]"},{"name":"BUTTON","label":"OK","click":{"external_properties":{},"function":"CLOSE","jsScript":"console.log()"}}]}]}}'
        parseJSON(o);
    }

    this.testSrajWindow6 = () => {
        let o = '{"srajWindow":{"list":[{"action":"CREATE","id":3,"header":"Nazwa okienka","position":{"canvasPosition":{}},"list":[{"name":"TEXT","text":"[center]Lorem ipsptate quia dolor sit amet.[/center][br]"},{"name":"IMAGE","url":"chmury/obj1.png"},{"name":"TEXT","text":"[center]Lorem ipsptati dolorem ipsum quia dolor sit amet.[/center][br]"},{"name":"IMAGE","url":"chmury/obj1.png"},{"name":"TEXT","text":"[center]Lorem ipsptati dolorem ipsum quia dolor sit amet.[/center][br]"},{"name":"BUTTON","label":"OK","click":{"external_properties":{},"function":"CLOSE","jsScript":"console.log()"}}]}]}}'
        parseJSON(o);
    }

    this.testSrajWindow7 = () => {
        let o = '{"srajWindow":{"list":[{"action":"CREATE","id":3,"header":"Nazwa okienka","position":{"target":{"kind":"HERO"}},"list":[{"name":"TEXT","text":"[center]Lorem ipsptate quia dolor sit amet.[/center][br]"},{"name":"IMAGE","url":"chmury/obj1.png"},{"name":"TEXT","text":"[center]Lorem ipsptati dolorem ipsum quia dolor sit amet.[/center][br]"},{"name":"IMAGE","url":"chmury/obj1.png"},{"name":"TEXT","text":"[center]Lorem ipsptati dolorem ipsum quia dolor sit amet.[/center][br]"},{"name":"BUTTON","label":"OK","click":{"external_properties":{},"function":"CLOSE","jsScript":"console.log()"}}]}]}}'
        parseJSON(o);
    }

    this.testSrajWindow8 = () => {
        let o = '{"srajWindow":{"list":[{"action":"CREATE","id":3,"header":"Nazwa okienka","position":{"htmlTarget":".interface-layer>.right-column.main-column"},"list":[{"name":"TEXT","text":"[center]Lorem ipsptate quia dolor sit amet.[/center][br]"},{"name":"IMAGE","url":"chmury/obj1.png"},{"name":"TEXT","text":"[center]Lorem ipsptati dolorem ipsum quia dolor sit amet.[/center][br]"},{"name":"IMAGE","url":"chmury/obj1.png"},{"name":"TEXT","text":"[center]Lorem ipsptati dolorem ipsum quia dolor sit amet.[/center][br]"},{"name":"BUTTON","label":"OK","click":{"external_properties":{},"function":"CLOSE","jsScript":"console.log()"}}]}]}}'
        parseJSON(o);
    }

    this.removeSrajWindow = () => {
        let o = '{"srajWindow":{"list":[{"action":"REMOVE","id":"2"}]}}';
        parseJSON(o);
    }

    this.testExtraLight = () => {
        let o = '{"extraLight":{"list":[{"action":"CREATE","id":0,"d":{"x":42,"y":16,"r":400}}]}}';
        parseJSON(o);
    }

    this.testExtraLightRemove = () => {
        let o = '{"extraLight":{"list":[{"action":"REMOVE","id":0}]}}';
        parseJSON(o);
    }

    this.testExtraLightClearAndRemoveCallback = () => {
        let o = '{"extraLight":{"clearAndRemoveCallback":true}}';
        parseJSON(o);
    }

    this.testBehaviorDynamicLightClearAndRemoveCallback = () => {
        let o = '{"behaviorDynamicLight":{"clearAndRemoveCallback":true}}';
        parseJSON(o);
    }

    this.testFloatObjectClearAndRemoveCallback = () => {
        let o = '{"floatObject":{"clearAndRemoveCallback":true}}';
        parseJSON(o);
    }


    this.testExtraLight2 = () => {
        //let o = '{"extraLight":{"list":[{"action":"CREATE","id":0,"d":{"x":25,"y":22,"r":400,"light":{"r":390,"color":{"r":255,"g":23,"b":23,"a":0.75}}}},{"action":"CREATE","id":1,"d":{"x":10,"y":22,"r":400,"light":{"r":390,"color":{"r":0,"g":255,"b":0,"a":0.75}}}},{"action":"CREATE","id":2,"d":{"x":40,"y":22,"r":400,"light":{"r":390,"color":{"r":0,"g":0,"b":255,"a":0.75}}}}]}}';
        let o = '{"extraLight":{"list":[{"action":"CREATE_FORCE","id":0,"d":{"x":20,"y":10,"r":400,"light":{"r":390,"onlyNight":false,"color":{"r":255,"g":23,"b":23,"a":0.75}}}},{"action":"CREATE_FORCE","id":1,"d":{"x":22,"y":10,"r":400,"light":{"onlyNight":false,"r":390,"color":{"r":0,"g":255,"b":0,"a":0.75}}}},{"action":"CREATE_FORCE","id":2,"d":{"x":24,"y":10,"r":400,"light":{"onlyNight":false,"r":390,"color":{"r":0,"g":0,"b":255,"a":0.75}}}}]}}';
        parseJSON(o);
    }

    this.testExtraLightRemove2 = () => {
        let o = '{"extraLight":{"list":[{"action":"REMOVE","id":0},{"action":"REMOVE","id":1},{"action":"REMOVE","id":2}]}}'
        parseJSON(o);
    }

    this.testDynamicLight0 = () => {
        debugger;
        let o = '{"dynamicLight":{"list":[{"action":"CREATE","id":0,"master":{"kind":"HERO"},"d":{"r":80}}]}}';
        parseJSON(o);
    }

    this.testDynamicLight1 = () => {
        debugger;
        let o = '{"dynamicLight":{"list":[{"action":"CREATE","id":0,"master":{"kind":"HERO"},"d":{"offsetX":20,"r":80}}]}}';
        parseJSON(o);
    }

    this.testDynamicLight2 = () => {
        let o = '{"dynamicLight":{"list":[{"action":"CREATE","id":0,"master":{"kind":"HERO"},"d":{"light":{"r":40,"color":{"r":0,"g":255,"b":0,"a":0.5}},"r":80}},{"action":"CREATE","id":0,"master":{"kind":"FAKE_NPC","id":"0-fake-npc-army-0"},"d":{"light":{"r":40,"color":{"r":0,"g":255,"b":0,"a":0.5}},"r":80}}]}}';
        parseJSON(o);
    }

    this.testDynamicLight3 = () => {
        let o = '{"dynamicLight":{"list":[{"action":"CREATE","id":1,"master":{"kind":"HERO"},"d":{"offsetX":-32,"offsetY":-12,"r":60,"light":{"r":50,"color":{"r":219,"g":186,"b":56,"a":0.4}}}},{"action":"CREATE","id":2,"master":{"kind":"HERO"},"d":{"offsetX":32,"offsetY":-32,"r":70,"light":{"r":60,"color":{"r":219,"g":186,"b":56,"a":0.4}}}},{"action":"CREATE","id":3,"master":{"kind":"HERO"},"d":{"offsetY":0,"r":40,"light":{"r":30,"color":{"r":219,"g":186,"b":56,"a":0.4}}}}]}}';
        parseJSON(o);
    }

    this.testExtraLightClear = () => {
        let o = '{"extraLight":{"action":"CLEAR_DATA"}}';
        parseJSON(o);
    }

    this.testExtraLightClearDataAndMapExternalPropertiesRefresh = () => {
        let o = '{"mapExternalPropertiesRefresh":["night"],"extraLight":{"action":"CLEAR_DATA"}}';
        parseJSON(o);
    }

    this.testFloatForeground = () => {
        let o = '{"floatForeground":{"list":[{"id":0,"action":"CREATE","xVector":-0.5,"color":{"r":1,"g":255,"b":0}},{"id":1,"action":"CREATE","xVector":1,"yVector":1,"color":{"r":0,"g":0,"b":255}}]}}';
        parseJSON(o);
    }

    this.testFloatForegroundRemove = () => {
        let o = '{"floatForeground":{"list":[{"id":0,"action":"REMOVE"}, {"id":1,"action":"REMOVE"}]}}';
        parseJSON(o);
    }

    this.testyXD0 = () => {
        debugger;
        let o = '{"fakeNpc":{"list":[{"action":"CREATE","id":2,"img":{"getCharacterData":{"kind":"HERO","toGet":"img"}},"x":{"getCharacterData":{"kind":"HERO","toGet":"x"}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y"}},"dir":{"getCharacterData":{"kind":"HERO","toGet":"dir"}},"behavior":{"repeat":1,"list":[{"name":"WALK","x":5,"y":15},{"name":"WALK","x":12,"y":15},{"name":"WALK","x":12,"y":19},{"name":"WALK","x":15,"y":19}]}}]}}';
        parseJSON(o);
    }

    this.testyXD1 = () => {
        debugger;
        let o = '{"fakeNpc":{"list":[{"action":"REMOVE","id":2}]}}';
        parseJSON(o);
    }

    this.testyXD2 = () => {
        debugger;
        let o = '{"fakeNpc":{"list":[{"action":"CREATE_IF_NOT_EXIST","id":2,"img":{"getCharacterData":{"kind":"HERO","toGet":"img"}},"x":{"getCharacterData":{"kind":"HERO","toGet":"x"}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y"}},"dir":{"getCharacterData":{"kind":"HERO","toGet":"dir"}},"behavior":{"repeat":1,"list":[{"name":"WALK","x":5,"y":15},{"name":"WALK","x":12,"y":15},{"name":"WALK","x":12,"y":19},{"name":"WALK","x":15,"y":19}]}}]}}';
        parseJSON(o);
    }

    this.testyXD3 = () => {
        debugger;
        let o = '{"fakeNpc":{"list":[{"action":"REMOVE_IF_EXIST","id":2}]}}';
        parseJSON(o);
    }

    this.testyRandomFirstIndex = () => {
        let o = '{"fakeNpc":{"list":[{"action":"CREATE","id":2,"img":{"getCharacterData":{"kind":"HERO","toGet":"img"}},"x":{"getCharacterData":{"kind":"HERO","toGet":"x"}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y"}},"dir":{"getCharacterData":{"kind":"HERO","toGet":"dir"}},"behavior":{"repeat":1,"randomFirstIndex":{"forActions":["WALK"]},"list":[{"name":"WALK","x":5,"y":15},{"name":"IDLE","duration":1,"dir":"S"},{"name":"WALK","x":12,"y":15},{"name":"IDLE","duration":1,"dir":"S"},{"name":"WALK","x":12,"y":19},{"name":"IDLE","duration":1,"dir":"S"},{"name":"WALK","x":15,"y":19}]}}]}}';
        parseJSON(o);
    }

    this.testyRandomFirstIndex2 = () => {
        let o = '{"fakeNpc":{"list":[{"action":"CREATE","id":2,"img":{"getCharacterData":{"kind":"HERO","toGet":"img"}},"x":{"getCharacterData":{"kind":"HERO","toGet":"x"}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y"}},"dir":{"getCharacterData":{"kind":"HERO","toGet":"dir"}},"behavior":{"repeat":1,"randomFirstIndex":{},"list":[{"name":"WALK","x":5,"y":15},{"name":"IDLE","duration":1,"dir":"S"},{"name":"WALK","x":12,"y":15},{"name":"IDLE","duration":1,"dir":"S"},{"name":"WALK","x":12,"y":19},{"name":"IDLE","duration":1,"dir":"S"},{"name":"WALK","x":15,"y":19}]}}]}}';
        parseJSON(o);
    }

    this.testyRandomFirstIndex3 = () => {
        let o = '{"fakeNpc":{"list":[{"action":"CREATE","id":2,"img":{"getCharacterData":{"kind":"HERO","toGet":"img"}},"x":{"getCharacterData":{"kind":"HERO","toGet":"x"}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y"}},"dir":{"getCharacterData":{"kind":"HERO","toGet":"dir"}},"behavior":{"repeat":1,"randomFirstIndex":{"forActions":["WALK","IDLE"]},"list":[{"name":"WALK","x":5,"y":15},{"name":"IDLE","duration":1,"dir":"S"},{"name":"WALK","x":12,"y":15},{"name":"IDLE","duration":1,"dir":"S"},{"name":"WALK","x":12,"y":19},{"name":"IDLE","duration":1,"dir":"S"},{"name":"WALK","x":15,"y":19}]}}]}}';
        parseJSON(o);
    }

    this.testyRandomFirstIndex4 = () => {
        let o = '{"fakeNpc":{"list":[{"action":"CREATE","id":2,"img":{"getCharacterData":{"kind":"HERO","toGet":"img"}},"x":{"getCharacterData":{"kind":"HERO","toGet":"x"}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y"}},"dir":{"getCharacterData":{"kind":"HERO","toGet":"dir"}},"behavior":{"repeat":1,"randomFirstIndex":{"forActions":["IDLE"]},"list":[{"name":"WALK","x":5,"y":15},{"name":"IDLE","duration":1,"dir":"S"},{"name":"WALK","x":12,"y":15},{"name":"IDLE","duration":1,"dir":"S"},{"name":"WALK","x":12,"y":19},{"name":"IDLE","duration":1,"dir":"S"},{"name":"WALK","x":15,"y":19}]}}]}}';
        parseJSON(o);
    }

    this.testCameraTargetSetFakeNpc = () => {
        let o = '{"camera":{"target":{"kind":"FAKE_NPC","id":"loop-fake-npc-0"}}}';
        parseJSON(o);
    }

    this.testCameraTargetSetPet = () => {
        let o = '{"camera":{"target":{"kind":"PET"}}}';
        parseJSON(o);
    }

    this.testCameraTargetSetMap = () => {
        let o = '{"camera":{"target":{"kind":"MAP","x":12,"y":6}}}';
        parseJSON(o);
    }

    this.testCameraTargetClear = () => {
        let o = '{"camera":{"clear":true}}';
        parseJSON(o);
    }

    this.testHideHero = () => {
        let o = '{"characterHide":{"list":[{"action":"CREATE","target":{"kind":"HERO"}}]}}';
        parseJSON(o);
    }

    this.testHidePet = () => {
        let o = '{"characterHide":{"list":[{"action":"CREATE","target":{"kind":"PET"}}]}}';
        parseJSON(o);
    }

    this.testHideNpc = () => {
        let o = '{"characterHide":{"list":[{"action":"CREATE","target":{"kind":"NPC","id":249647}}]}}';
        parseJSON(o);
    }


    this.testHideNpcWithShowOnMiniMap = () => {
        let o = '{"characterHide":{"list":[{"action":"CREATE","target":{"kind":"NPC","id":249647},"displayOnMiniMap":true}]}}';
        parseJSON(o);
    }

    this.testUnhideNpc = () => {
        let o = '{"characterHide":{"list":[{"action":"REMOVE","target":{"kind":"NPC","id":249647}}]}}';
        parseJSON(o);
    }

    this.testDialogueHeaderText = () => {
        let o = '{"dialogue":{"header":{"text":"TEEESTTT"}}}';
        parseJSON(o);
    }

    this.testDialogueHeaderTextGetCharacterData = () => {
        let o = '{"dialogue":{"header":{"text":{"getCharacterData":{"kind":"HERO","toGet":"nick"}}}}}';
        parseJSON(o);
    }

    this.testDialogueHeaderTextGetCharacterDataNpc = () => {
        let o = '{"dialogue":{"header":{"text":{"getCharacterData":{"kind":"NPC","id":255396,"toGet":"nick"}}}}}';
        parseJSON(o);
    }

    this.testDialogueHeaderClear = () => {
        let o = '{"dialogue":{"clear":true}}';
        parseJSON(o);
    }

    this.testMapFilter1 = () => {
        let o = '{"mapFilter":{"color":{"r":100,"g":0,"b":0,"a":0.3}}}';
        parseJSON(o);
    }

    this.testMapFilter2 = () => {
        let o = '{"mapFilter":{"clear":true}}';
        parseJSON(o);
    }

    this.testCrazyEval = () => {
        let o = '[{"names":["x","yVectormodify"]},{"x":1,"yVectormodify":0.2},{"x":2,"yVectormodify":1},{"x":5,"yVectormodify":2},{"x":7,"yVectormodify":2.5},{"x":5,"yVectormodify":0.1},{"x":2,"yVectormodify":0.5},{"x":8,"yVectormodify":1},{"x":9,"yVectormodify":2.5},{"x":1,"yVectormodify":0.5},{"x":2,"yVectormodify":0.1},{"x":1,"yVectormodify":2}]';

    }

    this.testRajEmoCreate = () => {
        let o = '{"emoDefinitions":{"list":[{"name":"NPC_SL_SHOP","priority":65,"params":{"action":"OnSelf","filename":"battle.gif","offsetX": 20,"offsetY": 20}}]},"emoActions":{"list":[{"action":"CREATE","name":"NPC_SL_SHOP","target":{"kind":"NPC","id":150951}}]}}';
        parseJSON(o);
    };

    this.testRajEmoCreate2 = () => {
        let o = '{"emoDefinitions":{"list":[{"name":"NPC_SL_SHOP","priority":65,"params":{"action":"StickToMap","filename":"battle.gif"}}]},"emoActions":{"list":[{"action":"CREATE","name":"NPC_SL_SHOP","target":{"kind":"MAP","id":1,"x":10,"y":20}}]}}';
        parseJSON(o);
    };

    this.testRajEmoCreate3 = () => {
        let o = '{"emoActions":{"list":[{"action":"REMOVE","name":"NPC_SL_SHOP","target":{"kind":"MAP","id":1}}]}}';
        parseJSON(o);
    };

    this.testRajEmoCreate4 = () => {
        let o = '{"emoDefinitions":{"list":[{"name":"NPC_SL_SHOP","priority":65,"params":{"action":"StickToMap","filename":"shop_mark.gif"}}]},"emoActions":{"list":[{"action":"CREATE","name":"NPC_SL_SHOP","target":{"kind":"MAP","id":1,"x":10,"y":20}}]}}';
        parseJSON(o);
    };

    this.testRajEmoRemoveWithRebuild = () => {
        let o = '{"emoActions":{"list":[{"action":"REMOVE","name":"NPC_SL_SHOP","target":{"kind":"NPC","id":48175}}]}}';
        parseJSON(o);
    };

    this.testRajShopEmoRemove = () => {
        let o = '{"emoActions":{"list":[{"action":"REMOVE","name":"SHOP","target":{"kind":"NPC","id":267672}}]}}';
        parseJSON(o);
    };

    this.testRajShopEmoCreate = () => {
        let o = '{"emoActions":{"list":[{"action":"CREATE","name":"SHOP","target":{"kind":"NPC","id":267672}}]}}';
        parseJSON(o);
    };

    this.testRajShopEmoCreateWithCase = () => {
        let o = '{"emoActions":{"list":[{"case":{"list":[{"kind":"ARGUMENT","key":"QUEST","name":"ACTIVE","params":[182]}]},"action":"CREATE","name":"SHOP","target":{"kind":"NPC","id":267672}}]}}';
        parseJSON(o);
    };

    this.testRajEmoRemoveWithoutRebuild = () => {
        let o = '{"emoActions":{"list":[{"action":"REMOVE","name":"NPC_SL_SHOP","target":{"kind":"NPC","id":210404}}]}}';
        parseJSON(o);
    };

    this.test1216Group = () => {
        let o = '{"fakeNpc":{"list":[{"action":"CREATE","id":0,"img":"/noob/hm.gif","x":{"getCharacterData":{"kind":"HERO","toGet":"x"}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y"}},"dir":{"getCharacterData":{"kind":"HERO","toGet":"dir"}},"behavior":{"repeat":true,"list":[{"name":"WALK","x":{"getCharacterData":{"kind":"HERO","toGet":"x","rotation":[1,0]}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y","rotation":[1,0]}}}]}},{"action":"CREATE","id":1,"img":"/noob/hm.gif","x":{"getCharacterData":{"kind":"HERO","toGet":"x"}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y"}},"dir":{"getCharacterData":{"kind":"HERO","toGet":"dir"}},"behavior":{"repeat":true,"list":[{"name":"WALK","x":{"getCharacterData":{"kind":"HERO","toGet":"x","rotation":[-1,0]}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y","rotation":[-1,0]}}}]}},{"action":"CREATE","id":2,"img":"/noob/hm.gif","x":{"getCharacterData":{"kind":"HERO","toGet":"x"}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y"}},"dir":{"getCharacterData":{"kind":"HERO","toGet":"dir"}},"behavior":{"repeat":true,"list":[{"name":"WALK","x":{"getCharacterData":{"kind":"HERO","toGet":"x","rotation":[1,-1]}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y","rotation":[1,-1]}}}]}},{"action":"CREATE","id":3,"img":"/noob/hm.gif","x":{"getCharacterData":{"kind":"HERO","toGet":"x"}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y"}},"dir":{"getCharacterData":{"kind":"HERO","toGet":"dir"}},"behavior":{"repeat":true,"list":[{"name":"WALK","x":{"getCharacterData":{"kind":"HERO","toGet":"x","rotation":[0,-1]}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y","rotation":[0,-1]}}}]}},{"action":"CREATE","id":4,"img":"/noob/hm.gif","x":{"getCharacterData":{"kind":"HERO","toGet":"x"}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y"}},"dir":{"getCharacterData":{"kind":"HERO","toGet":"dir"}},"behavior":{"repeat":true,"list":[{"name":"WALK","x":{"getCharacterData":{"kind":"HERO","toGet":"x","rotation":[-1,-1]}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y","rotation":[-1,-1]}}}]}},{"action":"CREATE","id":5,"img":"/noob/hm.gif","x":{"getCharacterData":{"kind":"HERO","toGet":"x"}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y"}},"dir":{"getCharacterData":{"kind":"HERO","toGet":"dir"}},"behavior":{"repeat":true,"list":[{"name":"WALK","x":{"getCharacterData":{"kind":"HERO","toGet":"x","rotation":[1,-2]}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y","rotation":[1,-2]}}}]}},{"action":"CREATE","id":6,"img":"/noob/hm.gif","x":{"getCharacterData":{"kind":"HERO","toGet":"x"}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y"}},"dir":{"getCharacterData":{"kind":"HERO","toGet":"dir"}},"behavior":{"repeat":true,"list":[{"name":"WALK","x":{"getCharacterData":{"kind":"HERO","toGet":"x","rotation":[0,-2]}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y","rotation":[0,-2]}}}]}},{"action":"CREATE","id":7,"img":"/noob/hm.gif","x":{"getCharacterData":{"kind":"HERO","toGet":"x"}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y"}},"dir":{"getCharacterData":{"kind":"HERO","toGet":"dir"}},"behavior":{"repeat":true,"list":[{"name":"WALK","x":{"getCharacterData":{"kind":"HERO","toGet":"x","rotation":[-1,-2]}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y","rotation":[-1,-2]}}}]}}]}}';
        parseJSON(o);
    }

    this.testTutUpdateWnd = () => {
        let o = '{"windowEvents":{"ON_UPDATE":{"windowName":"CRAFTING","external_properties":{"tutorial":{"id":-12, "blink":true,"graphic":"/img/gui/newTutorial/9_eng.gif","headerMobile":"RECIPES WND","headerPc":"Nana","htmlFocus":".crafting-recipe-in-list.recipe-id-244","htmlPosition":".crafting-recipe-in-list.recipe-id-244","onFinish":{"require":[{"clickRecipeOnList":244}]},"textMobile":"asd asd","textPc":"asd asd"}}}}}';
        parseJSON(o);
    }


    this.test1216Backup = () => {
        let o = `
        {
  "template": {
    "$CLOUD_GROUP" : {
      "list": [
        {
          "getTpl" : "$NORMAL_CLOUD",
          "tplVars": {
            "@id": {"getTplVar": "@firstCloudId"},
            "@x" : {"getTplVar": "@xGroup", "modify": {"kind": "MATH_ADD", "v": -5}},
            "@y" : {"getTplVar": "@yGroup"},
            "@maxRGroup" : {"getTplVar": "@rGroup"},
            "@maxGGroup" : {"getTplVar": "@gGroup"},
            "@maxBGroup" : {"getTplVar": "@bGroup"}
          }
        },
        {
          "getTpl" : "$NORMAL_CLOUD",
          "tplVars": {
            "@id"        : {"getTplVar": "@seccondCloudId"},
            "@x"         : {"getTplVar": "@xGroup", "modify": {"kind": "MATH_ADD", "v": 5}},
            "@y"         : {"getTplVar": "@yGroup"},
            "@maxRGroup" : {"getTplVar": "@rGroup"},
            "@maxGGroup" : {"getTplVar": "@gGroup"},
            "@maxBGroup" : {"getTplVar": "@bGroup"}
          }
        }
      ]
    },
    "$NORMAL_CLOUD": {
      "id"      : {"getTplVar": "@id"},
      "x"       : {"getTplVar": "@x"},
      "y"       : {"getTplVar": "@y"},
      "action"  : "CREATE",
      "url"     : "chmury/obj2.png",
      "getTpl"  : "$COLOR_TO_CLOUD",
      "tplVars" : {
        "@maxR": {"getTplVar": "@maxRGroup"},
        "@maxG": {"getTplVar": "@maxGGroup"},
        "@maxB": {"getTplVar": "@maxBGroup"}
      },
      "behavior": {
        "repeat": true,
        "list": [
          {"name": "MOVE_FROM_VECTORS", "xVector": 1.0, "yVector": 1.0},
          {"name": "TP_ON_OTHER_SIDE"}
        ]
      }
    },
    "$COLOR_RANDOM" : {
      "getRandom": {
        "start"      : 0,
        "end"        : {"getTplVar": "@max"},
        "resultType" : "int"
      }
    },
    "$COLOR_TO_CLOUD": {
      "color": {
        "r": {"getTpl": "$COLOR_RANDOM", "tplVars": {"@max":{"getTplVar": "@maxR"}}},
        "g": {"getTpl": "$COLOR_RANDOM", "tplVars": {"@max":{"getTplVar": "@maxG"}}},
        "b": {"getTpl": "$COLOR_RANDOM", "tplVars": {"@max":{"getTplVar": "@maxB"}}},
        "a": 1
      }
    }
  },
  "floatObject": {
    "getTpl": "$CLOUD_GROUP",
    "tplVars": {
      "@firstCloudId"   : "firstCloud-0",
      "@seccondCloudId" : "seccondCloud-0",
      "@xGroup"         : 10,
      "@yGroup"         : 10,
      "@rGroup"         : 255,
      "@gGroup"         : 255,
      "@bGroup"         : 255
    }
  }
}
        `;
        parseJSON(o);
    }

    this.floatObjectRandomFirstIndex = () => {
        let o = '{"template":{"$CLOUD_GROUP":{"list":[{"getTpl":"$NORMAL_CLOUD","tplVars":{"@id":{"getTplVar":"@firstCloudId"},"@x":{"getTplVar":"@xGroup","modify":{"kind":"MATH_ADD","v":-5}},"@y":{"getTplVar":"@yGroup"},"@maxRGroup":{"getTplVar":"@rGroup"},"@maxGGroup":{"getTplVar":"@gGroup"},"@maxBGroup":{"getTplVar":"@bGroup"}}},{"getTpl":"$NORMAL_CLOUD","tplVars":{"@id":{"getTplVar":"@seccondCloudId"},"@x":{"getTplVar":"@xGroup","modify":{"kind":"MATH_ADD","v":5}},"@y":{"getTplVar":"@yGroup"},"@maxRGroup":{"getTplVar":"@rGroup"},"@maxGGroup":{"getTplVar":"@gGroup"},"@maxBGroup":{"getTplVar":"@bGroup"}}}]},"$NORMAL_CLOUD":{"id":{"getTplVar":"@id"},"x":{"getTplVar":"@x"},"y":{"getTplVar":"@y"},"action":"CREATE","url":"chmury/obj2.png","getTpl":"$COLOR_TO_CLOUD","tplVars":{"@maxR":{"getTplVar":"@maxRGroup"},"@maxG":{"getTplVar":"@maxGGroup"},"@maxB":{"getTplVar":"@maxBGroup"}},"behavior":{"repeat":true,"randomFirstIndex":{"forActions":["MOVE_FROM_VECTORS"]},"list":[{"name":"MOVE_FROM_VECTORS","xVector":-1.0,"yVector":1.0},{"name":"TP_ON_OTHER_SIDE"},{"name":"MOVE_FROM_VECTORS","xVector":1.0,"yVector":-1.0},{"name":"TP_ON_OTHER_SIDE"},{"name":"MOVE_FROM_VECTORS","xVector":1.0,"yVector":1.0},{"name":"TP_ON_OTHER_SIDE"}]}},"$COLOR_RANDOM":{"getRandom":{"start":0,"end":{"getTplVar":"@max"},"resultType":"int"}},"$COLOR_TO_CLOUD":{"color":{"r":{"getTpl":"$COLOR_RANDOM","tplVars":{"@max":{"getTplVar":"@maxR"}}},"g":{"getTpl":"$COLOR_RANDOM","tplVars":{"@max":{"getTplVar":"@maxG"}}},"b":{"getTpl":"$COLOR_RANDOM","tplVars":{"@max":{"getTplVar":"@maxB"}}},"a":1}}},"floatObject":{"getTpl":"$CLOUD_GROUP","tplVars":{"@firstCloudId":"firstCloud-0","@seccondCloudId":"seccondCloud-0","@xGroup":10,"@yGroup":10,"@rGroup":255,"@gGroup":255,"@bGroup":255}}}'
        parseJSON(o);
    }

    this.test1216AllBackup = () => {
        let o = '{"template":{"pink-cloud":{"action":"CREATE","offsetX":-6,"offsetY":-24,"url":"chmury/obj2.png","color":{"r":{"getRandom":{"start":0,"end":233,"resultType":"int"}},"g":{"getRandom":{"start":0,"end":233,"resultType":"int"}},"b":{"getRandom":{"start":0,"end":233,"resultType":"int"}},"a":0.6}},"my-text":{"action":"CREATE","windowTarget":"MAP","name":"text1","target":{"kind":"FAKE_NPC","id":"army-leader-0"},"effect":"TEXT","params":{"duration":1,"position":"TOP"}}},"programmer":{"loopper":[{"loopStart":"10:00:00","loopEnd":"21:00:00","cycle":{"delay":"00:02:00","duration":"00:01:00","startData":{"weather":{"list":[{"action":"CREATE","name":"Rain","speedY":-1,"speedX":2}]}},"endData":{"weather":{"list":[{"action":"REMOVE","name":"Rain","speedY":-1,"speedX":2}]}}}}]},"night":{"action":"CREATE","color":{"r":0,"g":0,"b":0,"a":0.3},"list":[{"x":20,"y":15,"r":80}]},"floatForeground":{"list":[{"id":0,"action":"CREATE","yVector":-0.6,"color":{"r":0,"g":255,"b":0,"a":0.5}},{"id":1,"action":"CREATE","yVector":-0.4,"xVector":-0.3,"color":{"r":0,"g":0,"b":255,"a":0.3}}]},"floatObject":{"list":[{"getFor":{"idPrefix":"dupa-","forVars":[{"x":1,"yVectormodify":0.2},{"x":2,"yVectormodify":1},{"x":5,"yVectormodify":2},{"x":7,"yVectormodify":2.5},{"x":5,"yVectormodify":0.1},{"x":2,"yVectormodify":0.5},{"x":8,"yVectormodify":1},{"x":9,"yVectormodify":2.5},{"x":1,"yVectormodify":0.5},{"x":2,"yVectormodify":0.1},{"x":1,"yVectormodify":2}],"data":{"getTpl":"pink-cloud","x":{"getForVar":"x"},"y":{"getRandom":{"start":5,"end":10,"resultType":"int"}},"behavior":{"repeat":true,"list":[{"name":"MOVE_FROM_VECTORS","xVector":{"getForVar":"yVectormodify"}}]}}}},{"id":0,"action":"CREATE","x":{"getRandom":{"start":5,"end":30,"resultType":"int"}},"y":5,"url":"chmury/obj1.png","color":{"r":0,"g":255,"b":0},"behavior":{"repeat":true,"list":[{"name":"MOVE_FROM_VECTORS","xVector":-0.5}]}},{"id":1,"action":"CREATE","x":5,"y":8,"url":"chmury/obj1.png","color":{"a":0.5},"behavior":{"repeat":true,"list":[{"name":"MOVE_FROM_VECTORS","xVector":1,"yVector":1},{"name":"TP_TO_CORDS","x":5,"yVector":8}]}},{"id":2,"action":"CREATE","x":5,"y":10,"gif":true,"url":"chmury/99_gorace-uderzenie.gif","color":{"a":0.5},"behavior":{"repeat":true,"list":[{"name":"MOVE_FROM_VECTORS"}]}},{"id":3,"action":"CREATE","x":8,"y":10,"gif":true,"url":"chmury/99_gorace-uderzenie.gif","color":{"r":0,"g":255,"b":255},"behavior":{"repeat":true,"list":[{"name":"MOVE_FROM_VECTORS"}]}}]},"fakeNpc":{"list":[{"action":"CREATE","img":"noob/bm.gif","id":"army-leader-0","speed":1,"x":6,"dir":"N","y":16,"behavior":{"list":[{"name":"IDLE","duration":13,"dir":"N","external_properties":{"characterEffect":{"list":[{"getTpl":"my-text","params":{"text":["W prawo"]}}]}}},{"name":"IDLE","duration":13,"dir":"N","external_properties":{"characterEffect":{"list":[{"getTpl":"my-text","params":{"text":["W lewo"]}}]}}}]}},{"getFor":{"idPrefix":"","forVars":[{"x":1},{"x":2},{"x":3},{"x":4},{"x":5},{"x":6},{"x":7}],"data":{"getFor":{"idPrefix":"-fake-npc-army-","forVars":[{"x":{"getForVar":"x","parent":0},"y":9,"xMove":{"getMath":{"resultType":"int","list":[{"v":{"getForVar":"x","parent":0}},{"a":"+"},{"v":3}]}}},{"x":{"getForVar":"x","parent":0},"y":10,"xMove":{"getMath":{"resultType":"int","list":[{"v":{"getForVar":"x","parent":0}},{"a":"+"},{"v":3}]}}},{"x":{"getForVar":"x","parent":0},"y":11,"xMove":{"getMath":{"resultType":"int","list":[{"v":{"getForVar":"x","parent":0}},{"a":"+"},{"v":3}]}}},{"x":{"getForVar":"x","parent":0},"y":12,"xMove":{"getMath":{"resultType":"int","list":[{"v":{"getForVar":"x","parent":0}},{"a":"+"},{"v":3}]}}},{"x":{"getForVar":"x","parent":0},"y":13,"xMove":{"getMath":{"resultType":"int","list":[{"v":{"getForVar":"x","parent":0}},{"a":"+"},{"v":3}]}}},{"x":{"getForVar":"x","parent":0},"y":14,"xMove":{"getMath":{"resultType":"int","list":[{"v":{"getForVar":"x","parent":0}},{"a":"+"},{"v":3}]}}}],"data":{"action":"CREATE","img":"noob/bm.gif","speed":1,"x":{"getForVar":"x"},"y":{"getForVar":"y"},"behavior":{"list":[{"name":"WALK","x":{"getForVar":"xMove"},"y":{"getForVar":"y"}},{"name":"IDLE","duration":10,"dir":"S"},{"name":"WALK","x":{"getForVar":"x"},"y":{"getForVar":"y"}},{"name":"IDLE","duration":10,"dir":"S"}]}}}}}},{"getFor":{"idPrefix":"group-","forVars":[{"xMove":1,"yMove":0},{"xMove":-1,"yMove":0},{"xMove":1,"yMove":-1},{"xMove":0,"yMove":-1},{"xMove":-1,"yMove":-1},{"xMove":1,"yMove":-2},{"xMove":0,"yMove":-2},{"xMove":-1,"yMove":-2}],"data":{"action":"CREATE","img":"/noob/hm.gif","x":{"getCharacterData":{"kind":"HERO","toGet":"x"}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y"}},"dir":{"getCharacterData":{"kind":"HERO","toGet":"dir"}},"behavior":{"repeat":true,"list":[{"name":"WALK","x":{"getCharacterData":{"kind":"HERO","toGet":"x","rotation":{"x":{"getForVar":"xMove"},"y":{"getForVar":"yMove"}}}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y","rotation":{"x":{"getForVar":"xMove"},"y":{"getForVar":"yMove"}}}}}]}}}}]}}';
        parseJSON(o);
    }

    this.test1237Backup = () => {
        let o = '{"characterEffect":{"list":[{"action":"CREATE","windowTarget":"MAP","effect":"TINT","name":"MAP-TEST","target":{"kind":"ALL_MONSTER"},"params":{"position":"CENTER","repeat":true,"color":"0,255,0","duration":2}}]},"fakeNpc":{"list":[{"getFor":{"idPrefix":"loop-fake-npc-","forVars":[{"x":1,"y":0},{"x":1,"y":1},{"x":1,"y":2},{"x":2,"y":0}],"data":{"action":"CREATE","img":"noob/bm.gif","speed":4,"x":{"getForVar":"x"},"y":{"getForVar":"y"},"behavior":{"repeat":true,"list":[{"getFor":{"idPrefix":"loop-deep-behaviour-","forVars":[{"xMove":{"getMath":{"list":[{"v":{"getForVar":"x","parent":0}},{"a":"+"},{"v":{"getForVar":"index","parent":0}}],"resultType":"int"}},"yMove":{"getForVar":"y","parent":0}},{"xMove":{"getForVar":"x","parent":0},"yMove":{"getForVar":"y","parent":0}}],"data":{"name":"WALK","x":{"getForVar":"xMove"},"y":{"getForVar":"yMove"}}}},{"name":"IDLE","duration":{"getRandom":{"start":1,"end":4,"resultType":"int"}},"dir":"S"}]}}}}]}}';
        parseJSON(o);
    }

    this.test2318Backup = () => {
        let o = '{"template":{"oneRoundBehaviour":{"getFor":{"idPrefix":"one-round","forVars":[{"x":0,"y":2},{"x":0,"y":5},{"x":2,"y":5},{"x":2,"y":0}],"data":{"name":"WALK","x":{"getForVar":"x"},"y":{"getForVar":"y"}}}}},"fakeNpc":{"list":[{"action":"CREATE","id":66,"img":"noob/bm.gif","speed":4,"x":3,"y":5,"behavior":{"repeat":true,"list":[{"getTpl":"oneRoundBehaviour"},{"getTpl":"oneRoundBehaviour"},{"getTpl":"oneRoundBehaviour"},{"getTpl":"oneRoundBehaviour"},{"getTpl":"oneRoundBehaviour"},{"getTpl":"oneRoundBehaviour"},{"getTpl":"oneRoundBehaviour"},{"getTpl":"oneRoundBehaviour"},{"name":"IDLE","duration":5,"dir":"S"}]}}]}}';
        parseJSON(o);
    }

    this.testScreenEffects1 = () => {
        debugger;
        let o = '{"screenEffects":{"list":[{"id":0,"action":"CREATE","behavior":{"list":[{"repeat":1,"duration":2,"mode":"transition","data":{"color0":{"r":0,"g":0,"b":0,"a":0.1},"color1":{"r":0,"g":0,"b":0,"a":0.9}}},{"repeat":1,"duration":2,"mode":"transition","data":{"color0":{"r":0,"g":0,"b":0,"a":0.9},"color1":{"r":0,"g":0,"b":0,"a":0.9},"holes":[{"hole0":{"r":200,"x":5,"y":3,"gradientPercent1":0,"gradientPercent2":0},"hole1":{"r":100,"x":22,"y":16,"gradientPercent1":0,"gradientPercent2":0}},{"hole0":{"r":100,"x":22,"y":16,"gradientPercent1":0,"gradientPercent2":0},"hole1":{"r":200,"x":5,"y":3,"gradientPercent1":0,"gradientPercent2":0}}]}},{"repeat":1,"duration":2,"mode":"transition","data":{"color0":{"r":0,"g":0,"b":0,"a":0.9},"color1":{"r":0,"g":0,"b":0,"a":0.9},"holes":[{"hole0":{"r":200,"x":22,"y":16,"gradientPercent1":0,"gradientPercent2":0},"hole1":{"r":200,"x":6,"y":10,"gradientPercent1":0,"gradientPercent2":0}}]}},{"repeat":1,"duration":1.5,"mode":"transition","data":{"color0":{"r":0,"g":0,"b":0,"a":0.9},"color1":{"r":0,"g":0,"b":0,"a":0.9},"holes":[{"hole0":{"r":200,"x":6,"y":10,"gradientPercent1":0,"gradientPercent2":0},"hole1":{"r":200,"x":13,"y":8,"gradientPercent1":0,"gradientPercent2":0}}]}},{"repeat":1,"duration":5,"mode":"static","data":{"color":{"r":0,"g":0,"b":0,"a":0.9},"holes":[{"r":200,"x":13,"y":8,"gradientPercent1":0,"gradientPercent2":0}]}}]}}]}}';

        parseJSON(o);
    }

    this.testScreenEffectsRemoveIfExist = () => {
        let o = '{"screenEffects":{"list":[{"id":0,"action":"REMOVE_IF_EXIST"}]}}';
        parseJSON(o);
    }

    this.testScreenEffectsHolesDynamicCreateIfNotExist = () => {
        let o = '{"screenEffects":{"list":[{"id":0,"action":"CREATE_IF_NOT_EXIST","behaviour":[{"repeat":1,"duration":2,"mode":"static","data":{"color":{"r":0,"g":0,"b":0,"a":0.9},"holes":[{"r":50,"x":10,"y":10},{"r":50,"x":20,"y":10}]}}]},{"id":1,"action":"CREATE","behaviour":[{"repeat":1,"duration":2,"mode":"static","data":{"color":{"r":0,"g":0,"b":0,"a":0.5},"holes":[{"r":100,"x":10,"y":10}]}}]}]}}';
        parseJSON(o);
    }

    this.testSequence = () => {
        let o = '{"template":{"tpl-create-snow":{"weather":{"list":[{"action":"CREATE","name":"Snow"}]}},"tpl-remove-snow":{"weather":{"list":[{"action":"REMOVE","name":"Snow"}]}},"tpl-create-rain":{"weather":{"list":[{"action":"CREATE","name":"Rain"}]}},"tpl-remove-rain":{"weather":{"list":[{"action":"REMOVE","name":"Rain"}]}}},"sequence":{"list":[{"id":0,"action":"CREATE","repeat":2,"behavior":[{"delayBefore":2,"repeat":2,"external_properties":{"getTpl":"tpl-create-snow"}},{"duration":0,"external_properties":{"getTpl":"tpl-remove-snow"}},{"duration":1,"repeat":10,"external_properties":{"getTpl":"tpl-create-rain"}},{"duration":0.2,"repeat":20,"external_properties":{"getTpl":"tpl-create-snow"}},{"duration":0,"external_properties":{"getTpl":"tpl-remove-rain"}},{"duration":0,"external_properties":{"getTpl":"tpl-remove-snow"}}]}]}}';
        parseJSON(o);
    };

    this.testSnow = () => {
        let o = '{"weather":{"list":[{"action":"CREATE","name":"Snow"}]}}';
        parseJSON(o);
    };

    this.testRemoveSequence = () => {
        let o = '{"sequence":{"list":[{"id":0,"action":"REMOVE"}]}}';
        parseJSON(o);
    }

    this.testSound = () => {
        let o = '{"sound":{"list":[{"id":0,"action":"CREATE","url":"kogut01.mp3"}]}}';
        parseJSON(o);
    }

    this.testSoundRemove = () => {
        let o = '{"sound":{"list":[{"id":0,"action":"REMOVE"}]}}';
        parseJSON(o);
    }

    this.testSoundRepeat = () => {
        let o = '{"sound":{"list":[{"id":0,"action":"CREATE","repeat":2,"url":"kogut01.mp3"}]}}';
        parseJSON(o);
    }

    this.testSoundSource = () => {
        let o = '{"sound":{"list":[{"id":1,"action":"CREATE","repeat":true,"url":"kogut01.mp3","source":{"x":10,"y":10,"range":5}}]}}';
        parseJSON(o);
    };

    this.testSoundInfinitiveRepeat = () => {
        let o = '{"sound":{"list":[{"id":0,"action":"CREATE","repeat":true,"url":"kogut01.mp3"}]}}';
        parseJSON(o);
    };

    this.testRemoveSound = () => {
        let o = '{"sound":{"list":[{"id":0,"action":"REMOVE"}]}}';
        parseJSON(o);
    }

    this.testAven = () => {
        debugger;
        let o = '{"template":{"oneRoundBehaviour":{"getFor":{"idPrefix":"one-round","forVars":[{"x":12,"y":13},{"x":11,"y":16},{"x":14,"y":17},{"x":13,"y":13}],"data":{"name":"WALK","x":{"getForVar":"x"},"y":{"getForVar":"y"}}}}},"callInstantBehaviorFakeNpc":{"list":[{"getFor":{"idPrefix":"fakeNPClist","forVars":[{"id":41},{"id":42},{"id":43},{"id":44},{"id":45},{"id":46},{"id":47},{"id":48}],"data":{"id":{"getForVar":"id"},"repeat":1,"list":[{"getTpl":"oneRoundBehavior"},{"getTpl":"oneRoundBehavior"}]}}}]},"characterHide":{"list":[{"action":"CREATE","kind":"NPC","id":264318},{"action":"CREATE","kind":"NPC","id":264319},{"action":"CREATE","kind":"NPC","id":264320},{"action":"CREATE","kind":"NPC","id":264321},{"action":"CREATE","kind":"NPC","id":264322},{"action":"CREATE","kind":"NPC","id":264323},{"action":"CREATE","kind":"NPC","id":264324},{"action":"CREATE","kind":"NPC","id":264325}]}}';
        parseJSON(o);
    }

    this.testAven2 = () => {
        debugger;
        let o = '{"template":{"oneRoundBehavior":{"getFor":{"idPrefix":"one-round","forVars":[{"x":12,"y":13},{"x":11,"y":16},{"x":14,"y":17},{"x":13,"y":13}],"data":{"name":"WALK","x":{"getForVar":"x"},"y":{"getForVar":"y"}}}}},"callInstantBehaviorFakeNpc":{"list":[{"getFor":{"idPrefix":"fakeNPClist","iterations":8,"data":{"repeat":1,"list":[{"getTpl":"oneRoundBehavior"},{"getTpl":"oneRoundBehavior"}]}}}]},"characterHide":{"list":[{"action":"CREATE","kind":"NPC","id":264318},{"action":"CREATE","kind":"NPC","id":264319},{"action":"CREATE","kind":"NPC","id":264320},{"action":"CREATE","kind":"NPC","id":264321},{"action":"CREATE","kind":"NPC","id":264322},{"action":"CREATE","kind":"NPC","id":264323},{"action":"CREATE","kind":"NPC","id":264324},{"action":"CREATE","kind":"NPC","id":264325}]}}';
        parseJSON(o);
    }

    this.tesAreaTriggerTest = () => {
        debugger;
        let o = '{"areaTrigger":{"list":[{"id":1,"action":"CREATE","x":5,"y":5,"cols":1,"rows":1,"exceptionCords":[],"additionalCords":[],"repeat":true,"callOnEachMapAreaCord":true,"external_properties":{"sound":{"list":[{"id":0,"action":"CREATE","repeat":1,"url":"kogut01.mp3"}]}}}]}}';
        parseJSON(o);
    }

    this.removeAreaTriggerTest = () => {
        let o = '{"areaTrigger":{"list":[{"id":1,"action":"REMOVE"}]}}';
        parseJSON(o);
    }

    this.testAlbion = () => {
        let o = '{"template":{"dream-0":{"screenEffects":{"list":[{"id":0,"action":"CREATE","behavior":[{"repeat":1,"duration":1,"mode":"transition","data":{"color0":{"r":0,"g":0,"b":0,"a":0},"color1":{"r":0,"g":0,"b":0,"a":1.0}}},{"duration":1,"mode":"static","data":{"color":{"r":0,"g":0,"b":0,"a":1.0}}},{"repeat":1,"duration":0.2,"mode":"transition","data":{"color0":{"r":0,"g":0,"b":0,"a":1.0},"color1":{"r":0,"g":0,"b":0,"a":0}}}]}]}},"earthQuake-effect-0":{"characterEffect":{"list":[{"action":"CREATE","windowTarget":"MAP","effect":"TEXT","name":"kajuta-nad-hero","params":{"color":"255,0,0","height":20,"position":"TOP","text":["What this time?!"]},"target":{"kind":"NPC","id":140821}},{"action":"CREATE","windowTarget":"MAP","effect":"TEXT","name":"kajuta-nad-albion","params":{"duration":60,"height":15,"position":"TOP","text":["Looks like we`re not going to rest yet! Quick, lets go to on main deck!"]},"target":{"kind":"NPC","id":140792}}]},"earthQuake":{"duration":1,"frequency":0.4,"quantity":2}}},"sequence":{"list":[{"id":0,"action":"CREATE","behavior":{"list":[{"duration":2,"external_properties":{"getTpl":"dream-0"}},{"duration":1,"external_properties":{"getTpl":"earthQuake-effect-0"}}]}}]}}';
        parseJSON(o);
    }

    this.testDeclareMapMusic = () => {
        let o = '{"mapMusic":{"list":[{"action":"CREATE","id":0,"file":"0.mp3"},{"action":"CREATE","id":1,"file":"1.mp3"}]}}';
        parseJSON(o);
    }

    this.testChangeMapMusic = () => {
        let o = '{"mapMusic":{"play":{"id":1}}}';
        parseJSON(o);
    }

    this.testBehaviorDynamicLight = () => {
        let o = '{"behaviorDynamicLight":{"list":[{"id":321213,"configurationType":"ANIMATION","action":"CREATE","d":{"x":10,"y":10,"r":200,"light":{"r":20,"color":{"r":255,"g":0,"b":0,"a":1}},"behavior":{"list":[{"name":"IDLE"},{"name":"MOVE_TO_CORDS","x":5,"y":15},{"name":"TRANSITION_AND_MOVE_TO_CORDS","x":5,"y":15,"light":{"color":{"r":0,"g":0,"b":0,"a":1}}},{"name":"TRANSITION","light":{"color":{"r":200,"g":200,"b":200,"a":1}}},{"name":"TRANSITION","r":400},{"name":"TRANSITION","light":{"r":40,"color":{"r":100,"g":100,"b":100,"a":1}}}]}}}]}}';
        parseJSON(o);
    }

    this.testRemoveBehaviorDynamicLight = () => {
        let o = '{"behaviorDynamicLight":{"list":[{"id":0,"action":"REMOVE"}]}}';
        parseJSON(o);
    }

    this.testZoom = () => {
        let o = '{"zoom":{"zoom":1.5}}';
        parseJSON(o);
    }

    this.testMassObjectHide = () => {
        let o = `{"massObjectHide":{"list":[{"action":"CREATE","name":"OTHER"},{"action":"CREATE","name":"NPC"}]}}`;
        parseJSON(o);
    }

    this.testMassObjectHideOthers = () => {
        let o = `{"massObjectHide":{"list":[{"action":"REMOVE","name":"OTHER"}]}}`;
        parseJSON(o);
    }

    this.testMassObjectHideNPC = () => {
        let o = `{"massObjectHide":{"list":[{"action":"REMOVE","name":"NPC"}]}}`;
        parseJSON(o);
    }

    this.testZoom2 = () => {
        let o = '{"zoom":{"zoom":0.8}}';
        parseJSON(o);
    }

    this.testEarthQuake1 = () => {
        let o = '{"earthQuake":{"duration":10,"frequency":0.4,"quantity":2}}';
        parseJSON(o);
    }

    this.testEarthQuake2 = () => {
        let o = '{"earthQuake":{"duration":1,"frequency":0.4,"quantity":2, "power":100}}';
        parseJSON(o);
    }

    this.testEarthQuake3 = () => {
        let o = '{"earthQuake":{"clear":true}}';
        parseJSON(o);
    }

    this.testInterfaceSkin1 = () => {
        let o = '{"interfaceSkin":{"name":"redscale"}}';
        parseJSON(o);
    }


    this.testInterfaceSkin2 = () => {
        let o = '{"interfaceSkin":{"clear":true}}';
        parseJSON(o);
    }

    this.testZoomDuration = () => {
        let o = '{"zoom":{"zoom":2,"speed":3,"duration":5}}';
        parseJSON(o);
    }

    //this.testZoomRemove = () => {
    //    let o = '{"zoom":{"action":"REMOVE"}}';
    //    parseJSON(o);
    //}

    this.testZoomClear = () => {
        let o = '{"zoom":{"clear":true}}';
        parseJSON(o);
    }

    this.tutorialBarterTest = () => {
        let o = '{"connectSraj":[{"tutorial":{"textPc":"t_17_ni_pl","textMobile":"t_17_ni_mobile_pl","headerPc":"t_header_17_ni_pl","headerMobile":"t_header_17_ni_pl","graphic":"/img/gui/newTutorial/1.gif","id":-10,"htmlMultiGlow":[".offer-id-4645"],"htmlPosition":".barter-window","blink":true,"onFinish":{"require":[{"clickBarterOfferOnList":4645}],"break":["closeBarter"],"external_properties":{"tutorial":{"textPc":"asd","textMobile":"asd","headerPc":"asd","headerMobile":"asd","graphic":"/img/gui/newTutorial/1.gif","id":-11,"htmlMultiGlow":[".barter-content>.bottom-row-panel>.do-recipe>.button.green"],"htmlPosition":".barter-window","blink":true,"onFinish":{"require":[{"clickBarterOfferOnList":4645}],"break":["closeBarter"]}}}}}}]}';
        parseJSON(o);
    }

    this.tutorialBarterTest2 = () => {
        let o = '{"connectSraj":[{"tutorial":{"textPc":"t_17_ni_pl","textMobile":"t_17_ni_mobile_pl","headerPc":"t_header_17_ni_pl","headerMobile":"t_header_17_ni_pl","graphic":"/img/gui/newTutorial/1.gif","id":-10,"htmlMultiGlow":[".offer-id-4645"],"htmlPosition":".barter-window","blink":true,"onFinish":{"require":[{"clickBarterOfferOnList":4645}],"break":["closeBarter"]}}}]}';
        parseJSON(o);
    }

    this.tutorialBarterTest3 = () => {
        let o = '{"connectSraj":[{"tutorial":{"textPc":"asd","textMobile":"asd","headerPc":"asd","headerMobile":"asd","graphic":"/img/gui/newTutorial/1.gif","id":-11,"htmlMultiGlow":[".barter-content>.bottom-row-panel>.do-recipe>.button.green"],"htmlPosition":".barter-window","blink":true,"onFinish":{"require":[{"useBarterOffer":4645}],"break":["closeBarter"]}}}]}';
        parseJSON(o);
    }

    this.testTut = () => {
        let o = `{"tutorial":{"textPc":"t_17_ni_pl","textMobile":"t_17_ni_mobile_pl","headerPc":"t_header_17_ni_pl","headerMobile":"t_header_17_ni_pl","graphic":"/img/gui/newTutorial/1.gif","id":-10,"itemsNeed":{"htmlMultiGlow":true,"items":{"w":{"16":{"loc":"g","tpl":48455}},"p":{"16":{"loc":"g","tpl":48455}},"m":{"16":{"loc":"g","tpl":48455}},"t":{"16":{"loc":"g","tpl":48455}},"h":{"16":{"loc":"g","tpl":48455}},"b":{"16":{"loc":"g","tpl":48455}}}},"htmlPosition":".credits-tip","blink":true,"onFinish":{"require":[{"clickBarterOfferOnList":4645}],"break":["closeBarter"],"external_properties":{}}}}`;
        parseJSON(o);
    }

    this.testBattleEffect = () => {
        Engine.rajController.parseJSON(`{"characterEffect":{"list":[{"action":"CREATE","windowTarget":"BATTLE","name":"FIGHT-MAP","effect":"ANIMATION","target":{"kind":"NPC","id":133569},"params":{"gifUrl":"22_ogluszajacy-cios.gif","position":"CENTER","repeat":10}},{"action":"CREATE","windowTarget":"BATTLE","name":"FIGHT-MAP","effect":"ANIMATION","target":{"kind":"NPC","id":133569},"params":{"gifUrl":"22_ogluszajacy-cios.gif","position":"LEFT","repeat":10}},{"action":"CREATE","windowTarget":"BATTLE","name":"FIGHT-MAP","effect":"ANIMATION","target":{"kind":"NPC","id":133569},"params":{"gifUrl":"22_ogluszajacy-cios.gif","position":"RIGHT","repeat":10}},{"action":"CREATE","windowTarget":"BATTLE","name":"FIGHT-MAP","effect":"ANIMATION","target":{"kind":"NPC","id":133569},"params":{"gifUrl":"22_ogluszajacy-cios.gif","position":"TOP","repeat":10}},{"action":"CREATE","windowTarget":"BATTLE","name":"FIGHT-MAP","effect":"ANIMATION","target":{"kind":"NPC","id":133569},"params":{"gifUrl":"22_ogluszajacy-cios.gif","position":"BOTTOM","repeat":10}}]}}`)
    }

    this.testCreateDynamicDirCharacterLight = () => {
        Engine.rajController.parseJSON(`{"dynamicDirCharacterLight":{"list":[{"action":"CREATE","id":20,"master":{"kind":"HERO"},"d":{"base":{"r":80,"light":{"r":15,"color":{"r":255,"g":0,"b":0,"a":0.8}}},"S":{"offsetX":-10},"N":{"offsetX":10},"W":{"cover":true}}}]}}`)
    }
    this.testRemoveDynamicDirCharacterLight = () => {
        Engine.rajController.parseJSON(`{"dynamicDirCharacterLight":{"list":[{"action":"REMOVE","id":20}]}}`)
    }
    this.testCreateTrackingParent = () => {
        Engine.rajController.parseJSON(`{"tracking":{"parent":{"kind":"FLOAT_OBJECT","id":"followTest0"}}}`)
    }

    this.testCreateTrackingTarget = () => {
        Engine.rajController.parseJSON(`{"tracking":{"target":{"list":[{"id":0,"name":"asdasd","x":50,"y":50}]}}}`)
    }

    this.testRemoveTracking = () => {
        Engine.rajController.parseJSON(`{"tracking":{"clear":true}}`)
    }

    this.testFollow = () => {
        Engine.rajController.parseJSON(`{"floatObject":{"list":[{"id":"followTest0","x":{"getCharacterData":{"kind":"HERO","toGet":"x"}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y"}},"action":"CREATE","url":"chmury/obj2.png","color":{"r":0,"g":255,"b":0,"a":1},"behavior":{"repeat":true,"list":[{"name":"FOLLOW","speed":0.5,"duration":2,"x":{"getCharacterData":{"kind":"HERO","toGet":"x"}},"y":{"getCharacterData":{"kind":"HERO","toGet":"y"}}}]}}]}}`)
    }

    this.testCallInstantBehaviorFloatObject = () => {
        Engine.rajController.parseJSON(`{"callInstantBehaviorFloatObject":{"list":[{"id":"moveNoiseTest1","repeat":1,"list":[{"name":"MOVE_TO_CORDS","x":22,"y":12}]}]}}`)
    }

    this.testMoveNoise0 = () => {
        Engine.rajController.parseJSON(`
{"floatObject":{"list":[{"id":"moveNoiseTest0","action":"CREATE_IF_NOT_EXIST","url":"chmury/obj2.png","x":12,"y":12,"behavior":{"list":[{"name":"IDLE","repeat":true,"attachMoveNoise":{"vals":[{"x":-1.5,"y":-0.5,"speed":0.5},{"x":0.0,"y":1.0,"speed":0.5},{"x":-0.5,"y":0.1,"speed":0.5},{"x":-0.2,"y":-0.1,"speed":0.5},{"x":-1.5,"y":-0.5,"speed":0.5},{"x":0.0,"y":1.0,"speed":0.5},{"x":-0.5,"y":0.1,"speed":0.5},{"x":-0.2,"y":-0.1,"speed":0.5}]}}]}}]}}`)
    }

    this.testMoveNoise1 = () => {
        Engine.rajController.parseJSON(`
{"floatObject":{"list":[{"id":"moveNoiseTest1","action":"CREATE_IF_NOT_EXIST","url":"chmury/obj2.png","x":8,"y":12,"behavior":{"list":[{"name":"IDLE","repeat":true,"attachMoveNoise":{"vals":[{"x":-1.5,"y":-0.5,"speed":35},{"x":0.0,"y":1.0,"speed":35},{"x":-0.5,"y":0.1,"speed":35},{"x":-0.2,"y":-0.1,"speed":35},{"x":-1.5,"y":-0.5,"speed":35},{"x":0.0,"y":0.1,"speed":35},{"x":-0.5,"y":0.1,"speed":35},{"x":-0.2,"y":-0.1,"speed":35}]}}]}}]}}`)
    }

    this.testMoveNoise2 = () => {
        Engine.rajController.parseJSON(`
{"floatObject":{"list":[{"id":"moveNoiseTest2","action":"CREATE_IF_NOT_EXIST","url":"chmury/obj2.png","x":4,"y":12,"behavior":{"list":[{"name":"IDLE","repeat":true,"attachMoveNoise":{"vals":[{"x":-0.02,"y":-0.1,"speed":35},{"x":0.01,"y":0.1,"speed":35},{"x":-0.1,"y":0.1,"speed":35},{"x":-0.05,"y":-0.1,"speed":35},{"x":-0.05,"y":-0.1,"speed":35},{"x":0.0,"y":0.01,"speed":35},{"x":-0.1,"y":0.1,"speed":35},{"x":0.2,"y":-0.1,"speed":35}]}}]}}]}}`)
    }

    this.testMoveNoise3 = () => {
        Engine.rajController.parseJSON(`
{"floatObject":{"list":[{"id":"moveNoiseTest3","action":"CREATE_IF_NOT_EXIST","url":"chmury/obj2.png","x":4,"y":15,"behavior":{"list":[{"name":"IDLE","repeat":true,"attachMoveNoise":{"vals":[{"x":-0.02,"y":-0.01,"speed":10},{"x":0.01,"y":0.01,"speed":10},{"x":-0.03,"y":-0.02,"speed":10},{"x":-0.01,"y":-0.03,"speed":10},{"x":0.02,"y":0.03,"speed":10},{"x":-0.02,"y":0.01,"speed":10},{"x":-0.10,"y":0.04,"speed":10},{"x":0.02,"y":-0.1,"speed":10}]}}]}}]}}`)
    }

    this.testMoveNoise4 = () => {
        Engine.rajController.parseJSON(`
{"floatObject":{"list":[{"id":"moveNoiseTest4","action":"CREATE_IF_NOT_EXIST","url":"chmury/obj2.png","x":4,"y":15,"behavior":{"list":[{"name":"IDLE","repeat":true,"attachMoveNoise":{"vals":[{"x":-0.02,"y":-0.01,"speed":0.03},{"x":0.01,"y":0.01,"speed":0.03},{"x":-0.03,"y":-0.02,"speed":0.03},{"x":-0.01,"y":-0.03,"speed":0.03},{"x":0.02,"y":0.03,"speed":0.03},{"x":-0.02,"y":0.01,"speed":0.03},{"x":-0.10,"y":0.04,"speed":0.03},{"x":0.02,"y":-0.1,"speed":0.03}]}}]}}]}}`)
    }

    this.testBehaviorDynamicLight2 = () => {
        let o = `
            {"behaviorDynamicLight":{"list":[{"id":0,"action":"CREATE","d":{"x":10,"y":10,"r":200,"light":{"r":20,"color":{"r":255,"g":0,"b":0,"a":1}},"behavior":{"repeat":true,"list":[{"name":"IDLE"},{"name":"MOVE_TO_CORDS","x":10,"y":20},{"name":"IDLE","duration":1},{"name":"MOVE_TO_CORDS","x":20,"y":20}]}}}]}}
        `
        parseJSON(o);
    }

    this.testBehaviorDynamicLight3 = () => {
        let o = `
            {"behaviorDynamicLight":{"list":[{"id":0,"action":"CREATE","d":{"x":10,"y":10,"r":200,"light":{"onlyNight":true,"r":20,"color":{"r":255,"g":0,"b":0,"a":1}},"behavior":{"repeat":true,"list":[{"name":"IDLE"},{"name":"MOVE_TO_CORDS","x":10,"y":20},{"name":"IDLE","duration":1},{"name":"MOVE_TO_CORDS","x":20,"y":20}]}}}]}}
        `
        parseJSON(o);
    }

    this.testCreateFakeNpc = () => {
        let o = `{"fakeNpc":{"list":[{"action":"CREATE","x":10,"y":15,"id":"fakeNpcTest0","img":"/noob/hm.gif","behavior":{"list":[{"name":"IDLE"}]}}]}}`
        parseJSON(o);
    }

    this.testCreateForceFakeNpc = () => {
        let o = `{"fakeNpc":{"list":[{"action":"CREATE_FORCE","x":10,"y":15,"id":"fakeNpcTest0","img":"/paid/slowianka1.gif","behavior":{"list":[{"name":"WALK_AND_TP_START","x":1,"y":1}]}}]}}`
        parseJSON(o);
    }

    this.testRemoveFakeNpc = () => {
        let o = `{"fakeNpc":{"list":[{"action":"REMOVE","x":10,"y":15,"id":"fakeNpcTest0"}]}}`
        parseJSON(o);
    }





    this.testCreateFloatObject = () => {
        let o = `{"floatObject":{"list":[{"id":"testBehavior0","action":"CREATE","url":"chmury/obj1.png","withCreateInstantFadeIn":true,"x":27,"y":20,"behavior":{"list":[{"name":"MOVE_TO_CORDS","x":10,"y":10,"speed":1}]}}]}}`
        parseJSON(o);
    }

    this.testCreateForceFloatObject = () => {
        let o = `{"floatObject":{"list":[{"id":"testBehavior0","action":"CREATE_FORCE","url":"chmury/obj1.png","withCreateInstantFadeIn":true,"x":1,"y":20,"behavior":{"list":[{"name":"MOVE_TO_CORDS","x":20,"y":1,"speed":1}]}}]}}`
        parseJSON(o);
    }

    this.testRemoveFloatObject = () => {
        let o = `{"floatObject":{"list":[{"action":"REMOVE","x":10,"y":15,"id":"testBehavior0"}]}}`
        parseJSON(o);
    }

    this.testRemoveProgrammer1 = () => {
        let o = `{"programmer":{"list":[{"action":"REMOVE","id":1,"name":"WEEK_DAY"}]}}`;
        parseJSON(o);
    }

    this.testRemoveProgrammer2 = () => {
        let o = `{"programmer":{"list":[{"action":"REMOVE","id":2,"name":"NORMAL_DAY"}]}}`;
        parseJSON(o);
    }

    this.testRemoveProgrammer3 = () => {
        let o = `{"programmer":{"list":[{"action":"REMOVE","id":3,"name":"NORMAL_DAY"}]}}`;
        parseJSON(o);
    }

    this.testRemoveProgrammer4 = () => {
        let o = `{"programmer":{"list":[{"action":"REMOVE","id":4,"name":"LOOPPER"}]}}`;
        parseJSON(o);
    }

    this.testOnRespawnNpc = () => {
        let o = `{"mapEvents":{"list":[{"action":"CREATE","name":"ON_RESPAWN_NPC","id":123,"npcId":48189,"external_properties":{"yellowMessage":{"list":[{"action":"CREATE","text":"ZAJEC HARE"}]}}}]}}`;
        parseJSON(o);
    }

    this.testOnOverwriteDayNightCycle = () => {
        let o = `{"overrideDayNightCycle":{"alphaFactor":0.8}}`;
        parseJSON(o);
    };

    this.testRemoveOverwriteDayNightCycle = () => {
        let o = `{"overrideDayNightCycle":{"clear":true}}`;
        parseJSON(o);
    };

    this.testDzik = () => {
        let o = `{"emoActions":{"list":[{"action":"CREATE","name":"e3","target":{"id":150951,"kind":"NPC"}}]},"emoDefinitions":{"list":[{"name":"e3","params":{"action":"OnSelf","filename":"ico-boss.gif"},"priority":90}]}}`
        parseJSON(o);
    }

    this.testCharacterEffectGetCharacterData = () => {
        let o = `{"characterEffect":{"list":[{"action":"CREATE","id":1212121,"windowTarget":"MAP","effect":"ANIMATION","target":{"kind":"HERO"},"params":{"gifUrl":{"getCharacterData":{"kind":"FLOAT_OBJECT","id":"moveNoiseTest1","toGet":"img"}},"repeat":true,"position":"CENTER"}}]}}`
        parseJSON(o);
    }

    this.textBehaviorLightAttachNoise4 = () => {
        Engine.rajController.parseJSON(`{
  "behaviorDynamicLight": {
    "list": [
      {
        "id"     : 1002,
        "action" : "CREATE",
        "d": {
          "x"      : 10,
          "y"      : 10,
          "r"      : 100,
          "light"  : {
            "r"     : 80,
            "color" : {"r": 0, "g": 0, "b": 0, "a": 1}
          },
          "behavior": {
            "repeat": true,
            "list": [
              {
                "name" : "IDLE",
                "duration" :2,
                "attachMoveNoise": {
                  "vals": [
                    {"x": 0, "y": -4, "speed": 4},
                    {"x": 0,  "y": 0,  "speed": 4},
                    {"x": 0,  "y": 4,  "speed": 4},
                    {"x": 0,  "y": 0,  "speed": 4}
                  ]
                }
              },
              {"name" : "TRANSITION",                   "duration" :1, "r": 200,                     "light": {"r":20, "color" : {"r": 255, "g": 0,   "b": 0,   "a": 1}}},
              {"name" : "TRANSITION",                   "duration" :2,                               "light": {"r":200,"color" : {"r": 0,   "g": 255, "b": 0,   "a": 1}}},
              {"name" : "TRANSITION_AND_MOVE_TO_CORDS", "duration" :1, "r": 100, "x" : 10, "y" : 20, "light": {"r":50, "color" : {"r": 0,   "g": 255, "b": 0,   "a": 0.5}}},
              {"name" : "TRANSITION",                   "duration" :1, "r": 700,                     "light": {"r":50, "color" : {"r": 0,   "g": 0,   "b": 255, "a": 1}}},
              {"name" : "MOVE_TO_CORDS",                                         "x" : 20,"y" : 20},
              {"name" : "TRANSITION",                   "duration" :3,                               "light": {"r": 200, "color" : {"r": 50, "g": 50, "b": 50, "a": 1}}}
            ]
          }
        }
      }
    ]
  }
}

`)
    }

    this.textBehaviorLight = () => {
        Engine.rajController.parseJSON(`{
  "behaviorDynamicLight": {
    "list": [
      {
        "id"     : 1003,
        "action" : "CREATE",
        "d": {
          "x"      : 10,
          "y"      : 10,
          "r"      : 100,
          "light"  : {
            "r"     : 80,
            "color" : {"r": 255, "g": 0, "b": 0, "a": 1}
          },
          "behavior": {
            "repeat": true,
            "list": [
              {
                "name" : "IDLE",
                "duration" :5
              },
              {"name" : "TRANSITION",                   "duration" :1, "r": 200,                     "light": {"r":20, "color" : {"r": 255, "g": 0,   "b": 0,   "a": 1}}},
              {"name" : "TRANSITION",                   "duration" :2,                               "light": {"r":200,"color" : {"r": 0,   "g": 255, "b": 0,   "a": 1}}},
              {"name" : "TRANSITION_AND_MOVE_TO_CORDS", "duration" :1, "r": 100, "x" : 10, "y" : 20, "light": {"r":50, "color" : {"r": 0,   "g": 255, "b": 0,   "a": 0.5}}},
              {"name" : "TRANSITION",                   "duration" :1, "r": 700,                     "light": {"r":50, "color" : {"r": 0,   "g": 0,   "b": 255, "a": 1}}},
              {"name" : "MOVE_TO_CORDS",                                         "x" : 20,"y" : 20},
              {"name" : "TRANSITION",                   "duration" :3,                               "light": {"r": 200, "color" : {"r": 50, "g": 50, "b": 50, "a": 1}}}
            ]
          }
        }
      }
    ]
  }
}

`)



    }

    this.textBehaviorLightMaster = () => {
        Engine.rajController.parseJSON(`{
  "behaviorDynamicLight": {
    "list": [
      {
        "id"     : 1004,
        "action" : "CREATE",
        "master" : {
          "kind" : "HERO"
        },
        "d": {
          "x"      : 10,
          "y"      : 10,
          "r"      : 100,
          "light"  : {
            "r"     : 80,
            "color" : {"r": 255, "g": 0, "b": 0, "a": 1}
          },
          "behavior": {
            "repeat": true,
            "list": [
              {
                "name" : "IDLE",
                "duration" :5
              },
              {"name" : "TRANSITION",                   "duration" :1, "r": 200,                     "light": {"r":20, "color" : {"r": 255, "g": 0,   "b": 0,   "a": 1}}},
              {"name" : "TRANSITION",                   "duration" :2,                               "light": {"r":200,"color" : {"r": 0,   "g": 255, "b": 0,   "a": 1}}},
              {"name" : "TRANSITION",                   "duration" :1, "r": 100,                     "light": {"r":50, "color" : {"r": 0,   "g": 255, "b": 0,   "a": 0.5}}},
              {"name" : "TRANSITION",                   "duration" :3,                               "light": {"r": 200, "color" : {"r": 50, "g": 50, "b": 50, "a": 1}}}
            ]
          }
        }
      }
    ]
  }
}


`)
    }

    this.textBehaviorLightMasterCrazy = () => {
        Engine.rajController.parseJSON(`{
  "behaviorDynamicLight": {
    "list": [
      {
        "id"     : 1005,
        "action" : "CREATE",
        "master" : {
          "kind" : "HERO"
        },
        "d": {
          "x"      : 10,
          "y"      : 10,
          "r"      : 100,
          "light"  : {
            "r"     : 80,
            "color" : {"r": 255, "g": 0, "b": 0, "a": 1}
          },
          "behavior": {
            "repeat": true,
            "list": [
              {
                "name" : "IDLE",
                "duration" :5
              },
              {"name" : "TRANSITION",                   "duration" :1, "r": 200,                     "light": {"r":20, "color" : {"r": 255, "g": 0,   "b": 0,   "a": 1}}},
              {"name" : "TRANSITION",                   "duration" :2,                               "light": {"r":200,"color" : {"r": 0,   "g": 255, "b": 0,   "a": 1}}},
              {"name" : "TRANSITION_AND_MOVE_TO_CORDS", "duration" :1, "r": 100, "x" : 10, "y" : 20, "light": {"r":50, "color" : {"r": 0,   "g": 255, "b": 0,   "a": 0.5}}},
              {"name" : "TRANSITION",                   "duration" :1, "r": 100,                     "light": {"r":50, "color" : {"r": 0,   "g": 255, "b": 0,   "a": 0.5}}},
              {"name" : "MOVE_TO_CORDS",                                         "x" : 20,"y" : 20},
              {"name" : "TRANSITION",                   "duration" :3,                               "light": {"r": 200, "color" : {"r": 50, "g": 50, "b": 50, "a": 1}}}
            ]
          }
        }
      }
    ]
  }
}


`)
    }


    this.getForIndexInForVarsTest = () => {
        Engine.rajController.parseObject({
            "floatObject": {
                "list": [{
                    "getFor": {
                        "idPrefix": "BOOM2-",
                        "iterations": 20,

                        "forVars": [{
                                "x": 5
                            },
                            {
                                "x": {
                                    "getMath": {
                                        "resultType": "int",
                                        "list": [{
                                            "v": {
                                                "getForVar": "index"
                                            }
                                        }, {
                                            "a": "+"
                                        }, {
                                            "v": 1
                                        }]
                                    }
                                }
                            },
                            {
                                "x": 15
                            },
                            {
                                "x": 20
                            }


                        ],
                        "data": {
                            "action": "CREATE",
                            "url": "chmury/obj2.png",
                            "x": {
                                "getForVar": "x"
                            },
                            "y": 10,
                            "color": {
                                "r": 255,
                                "g": 163,
                                "b": 242,
                                "a": 0.6
                            },
                            "behavior": {
                                "repeat": true,
                                "list": [{
                                    "name": "IDLE"
                                }]
                            }
                        }
                    }
                }]
            }
        })
    }

    this.getForForVarsEachIterationTest = () => {
        let o = {
            "floatObject": {
                "list": [{
                    "getFor": {
                        "idPrefix": "BOOM2-",
                        "forVarsEachIteration": {
                            "y": {
                                "getMath": {
                                    "resultType": "int",
                                    "list": [{
                                            "v": 2
                                        },
                                        {
                                            "a": "*"
                                        },
                                        {
                                            "v": {
                                                "getForVar": "index"
                                            }
                                        },
                                        {
                                            "a": "+"
                                        },
                                        {
                                            "v": 10
                                        }
                                    ]
                                }
                            }
                        },
                        "forVars": [{
                                "x": 5
                            },
                            {
                                "x": 10
                            },
                            {
                                "x": 15
                            },
                            {
                                "x": 20
                            },
                            {
                                "x": {
                                    "getMath": {
                                        "resultType": "int",
                                        "list": [{
                                            "v": {
                                                "getForVar": "index"
                                            }
                                        }, {
                                            "a": "+"
                                        }, {
                                            "v": 1
                                        }]
                                    }
                                }
                            }
                        ],
                        "data": {
                            "action": "CREATE",
                            "url": "chmury/obj2.png",
                            "x": {
                                "getForVar": "x"
                            },
                            "y": {
                                "getForVar": "y"
                            },
                            "color": {
                                "r": 255,
                                "g": 163,
                                "b": 242,
                                "a": 0.6
                            },
                            "behavior": {
                                "repeat": true,
                                "list": [{
                                    "name": "IDLE"
                                }]
                            }
                        }
                    }
                }]
            }
        }
        Engine.rajController.parseObject(o);
    }

    this.getForForVarsEachIterationIterationsTest = () => {
        let o = {
            "floatObject": {
                "list": [{
                    "getFor": {
                        "idPrefix": "BOOM2-",
                        "iterations": 20,
                        "forVarsEachIteration": {
                            "x": {
                                "getMath": {
                                    "resultType": "int",
                                    "list": [{
                                            "v": 2
                                        },
                                        {
                                            "a": "*"
                                        },
                                        {
                                            "v": {
                                                "getForVar": "index"
                                            }
                                        },
                                        {
                                            "a": "+"
                                        },
                                        {
                                            "v": 10
                                        }
                                    ]
                                }
                            },
                            "y": {
                                "getMath": {
                                    "resultType": "float",
                                    "list": [{
                                            "v": 0.5
                                        },
                                        {
                                            "a": "*"
                                        },
                                        {
                                            "v": {
                                                "getForVar": "index"
                                            }
                                        },
                                        {
                                            "a": "+"
                                        },
                                        {
                                            "v": 10
                                        }
                                    ]
                                }
                            }
                        },
                        "data": {
                            "action": "CREATE",
                            "url": "chmury/obj2.png",
                            "x": {
                                "getForVar": "x"
                            },
                            "y": {
                                "getForVar": "y"
                            },
                            "color": {
                                "r": 255,
                                "g": 163,
                                "b": 242,
                                "a": 0.6
                            },
                            "behavior": {
                                "repeat": true,
                                "list": [{
                                    "name": "IDLE"
                                }]
                            }
                        }
                    }
                }]
            }
        }
        Engine.rajController.parseObject(o);
    }

    this.ignoreStartAndEndCollision = () => {
        let o = {
            "fakeNpc": {
                "list": [{
                    "action": "CREATE_FORCE",
                    "id": "perhana-dziecko-1",
                    "x": 39,
                    "y": 51,
                    "img": "npc/tor-perhana-0.gif",
                    "instantCreateFadeIn": true,
                    "instantRemoveFadeOut": true,
                    "behavior": {
                        "repeat": true,
                        "list": [{
                            "name": "WALK_AND_TP_START",
                            "x": 54,
                            "y": 55,
                            "speed": 4,
                            "ignoreStartCollision": true,
                            "ignoreEndCollision": true
                        }]
                    }
                }]
            }
        }
        Engine.rajController.parseObject(o)
    }

    this.getForForVarsEachIterationIterationsTest2 = () => {
        let o = {
            "floatObject": {
                "list": [{
                    "getFor": {
                        "idPrefix": "BOOM2-",
                        "iterations": 20,
                        "forVarsEachIteration": {
                            "x": {
                                "getMath": {
                                    "resultType": "int",
                                    "list": [{
                                            "v": 2
                                        },
                                        {
                                            "a": "*"
                                        },
                                        {
                                            "v": {
                                                "getForVar": "index"
                                            }
                                        },
                                        {
                                            "a": "+"
                                        },
                                        {
                                            "v": 10
                                        }
                                    ]
                                }
                            },
                            //"y" : {"getMath":{"resultType":"float","list":[
                            //    {"v":2},
                            //    {"a":"*"},
                            //    {"a":"SIN"},
                            //    {"v":{"getForVar":"index"}},
                            //    {"a":"+"},
                            //    {"v":20}
                            //]}},
                            "y": {
                                "getMath": {
                                    "resultType": "float",
                                    "list": [{
                                            "v": 2
                                        },
                                        {
                                            "a": "*"
                                        },
                                        {
                                            "a": "SIN"
                                        },
                                        {
                                            "a": "("
                                        },
                                        {
                                            "v": {
                                                "getForVar": "index"
                                            }
                                        },
                                        {
                                            "a": ")"
                                        },
                                        {
                                            "a": "+"
                                        },
                                        {
                                            "v": 20
                                        }
                                    ]
                                }
                            }
                        },
                        "data": {
                            "action": "CREATE",
                            "url": "chmury/obj2.png",
                            "x": {
                                "getForVar": "x"
                            },
                            "y": {
                                "getForVar": "y"
                            },
                            "color": {
                                "r": 255,
                                "g": 0,
                                "b": 0,
                                "a": 1
                            },
                            "behavior": {
                                "repeat": true,
                                "list": [{
                                    "name": "IDLE"
                                }]
                            }
                        }
                    }
                }]
            }
        }
        Engine.rajController.parseObject(o);
    }

    this.attachScaleAttachRotation = () => {
        let o = `{"floatObject":{"list":[{"action":"CREATE","behavior":{"repeat":true,"list":[{"attachRotation":{"addAngle":180},"attachScale":{"vals":[{"duration":5,"scale":0.5},{"duration":5,"scale":5}]},"duration":5,"name":"IDLE"},{"name":"MOVE_TO_CORDS","x":20,"y":10},{"name":"MOVE_TO_CORDS","x":10,"y":10}]},"color":{"a":1,"b":0,"g":165,"r":255},"configurationType":"WEATHER","id":"attachScaleAttachRotationTest","url":"chmury/obj1.png","x":15,"y":10}]}}`;
        parseJSON(o)
    }

    this.attachScaleAttachRotation2 = () => {
        let o = `{"floatObject":{"list":[{"action":"CREATE","behavior":{"repeat":true,"list":[{"name":"MOVE_TO_CORDS","x":10,"y":20,"speed":3,"attachScale":{"vals":[{"scale":0.5,"duration":5}]},"attachRotation":{"addAngle":45,"duration":2}},{"name":"MOVE_TO_CORDS","x":11,"y":17,"speed":3,"attachRotation":{"addAngle":45,"duration":2}},{"name":"MOVE_TO_CORDS","x":14,"y":16,"speed":3,"attachRotation":{"addAngle":45,"duration":2}},{"name":"MOVE_TO_CORDS","x":17,"y":17,"speed":3,"attachRotation":{"addAngle":45,"duration":2}},{"name":"MOVE_TO_CORDS","x":18,"y":20,"speed":3,"attachScale":{"vals":[{"scale":2,"duration":5}]},"attachRotation":{"addAngle":45,"duration":2}},{"name":"MOVE_TO_CORDS","x":17,"y":23,"speed":3,"attachRotation":{"addAngle":45,"duration":2}},{"name":"MOVE_TO_CORDS","x":14,"y":24,"speed":3,"attachRotation":{"addAngle":45,"duration":2}},{"name":"MOVE_TO_CORDS","x":11,"y":23,"speed":3,"attachRotation":{"addAngle":45,"duration":2}}]},"color":{"a":1,"b":0,"g":0,"r":0},"configurationType":"WEATHER","id":"attachScaleAttachRotationTest_2","url":"chmury/obj1.png","x":11,"y":23}]}}`;
        parseJSON(o)
    }

    this.attachAttachRotationGif = () => {
        let o = `{"floatObject":{"list":[{"action":"CREATE","behavior":{"repeat":true,"list":[{"name":"MOVE_TO_CORDS","x":11,"y":23,"speed":3,"attachRotation":{"addAngle":45,"duration":2}},{"name":"MOVE_TO_CORDS","x":14,"y":16,"speed":3,"attachRotation":{"addAngle":45,"duration":2}}]},"kind":"GIF","id":"gifRotationTest","url":"chmury/kuf_gho-shiitm.gif","x":11,"y":23}]}}`;
        parseJSON(o)
    }

    this.attachAttachRotationAttachScaleGif = () => {
        let o = `{"floatObject":{"list":[{"action":"CREATE","behavior":{"repeat":true,"list":[{"name":"MOVE_TO_CORDS","x":11,"y":23,"speed":1,"attachScale":{"vals":[{"scale":5}]},"attachRotation":{"addAngle":45,"duration":2}},{"name":"MOVE_TO_CORDS","x":14,"y":16,"speed":3,"attachRotation":{"addAngle":45,"duration":2}}]},"kind":"GIF","id":"gifRotationTest","url":"chmury/kuf_gho-shiitm.gif","x":11,"y":23}]}}`;
        parseJSON(o)
    }

    this.attachRotation2 = () => {
        let o = `{"floatObject":{"list":[{"action":"CREATE","behavior":{"list":[{"attachRotation":{"addAngle":180},"duration":20,"name":"IDLE","repeat":true}]},"color":{"a":1,"b":0,"g":165,"r":255},"configurationType":"WEATHER","id":"attachScaleAttachRotationTest","url":"chmury/obj1.png","x":15,"y":5}]}}`
        parseJSON(o)
    }

    this.attachRotation2AttachScaleIdleFakeNpcFrame = () => {
        let o = `{"floatObject":{"list":[{"action":"CREATE","behavior":{"list":[{"duration":5,"name":"IDLE","attachScale":{"vals":[{"scale":5}]}},{"duration":5,"name":"IDLE","attachScale":{"vals":[{"scale":1}]}},{"duration":5,"name":"IDLE","attachRotation":{"setAngle":180,"duration":2}},{"duration":5,"name":"IDLE"},{"duration":5,"name":"IDLE","attachRotation":{"setAngle":1,"duration":2}}]},"dir":"W","id":"rotate_char_test","kind":"IDLE_FAKE_NPC_FRAME","url":{"getCharacterData":{"kind":"HERO","toGet":"img"}},"withCreateInstantFadeIn":true,"x":15,"y":15}]}}`;
        parseJSON(o)
    }

    this.ignoreUpdateCollisionAndStartEndPosIthan = () => {
        let o = `{"fakeNpc":{"list":[{"action":"CREATE","x":51,"y":53,"id":"ignore-collision-0","img":"/noob/hm.gif","speed":5,"ignoreUpdateCollisionAndStartEndPos":true,"behavior":{"list":[{"name":"IDLE","duration":0.1},{"name":"WALK","x":54,"y":55},{"name":"WALK","x":49,"y":57},{"name":"WALK_START"}]}}]}}`;
        parseJSON(o);
    }

    this.tutorialOrRequire = () => {
        Engine.rajController.parseObject({
            "tutorial": {
                "id": -2,
                "textPc": "",
                "textMobile": "",
                "headerPc": "Interaction with NPCs",
                "headerMobile": "Interaction with NPCs",
                "graphic": "/img/gui/newTutorial/8_eng.gif",
                "draggableWnd": false,
                "htmlPositionOffset": {
                    "left": 10,
                    "top": -30
                },
                "htmlPosition": ".tutorial-banner-anchor",
                "onFinish": {
                    "requireConnector": "OR",
                    "require": [{
                            "talkNpcId": 330192
                        },
                        {
                            "talkNpcId": 330194
                        }
                    ]
                }
            }
        })
    }


    const getAddSrajToQueue = () => {
        return addSrajToQueue;
    }

    const getAddSrajToCaseQueue = () => {
        return addSrajToCaseQueue;
    }

    this.init = init;
    this.parseJSON = parseJSON;
    this.checkRajKeyExist = checkRajKeyExist;
    this.getAddSrajToQueue = getAddSrajToQueue;
    this.parseObject = parseObject;
    this.addSrajClass = addSrajClass;
    this.callSrajQueue = callSrajQueue;
    this.getAllSrajClass = getAllSrajClass;
    this.addToCaseSrajQueue = addToCaseSrajQueue;
    this.getAddSrajToCaseQueue = getAddSrajToCaseQueue;
    this.manageSrajBeforeSuccessRespond = manageSrajBeforeSuccessRespond;
    this.manageSrajAfterSuccessRespond = manageSrajAfterSuccessRespond;
    this.callSrajFromEngine = callSrajFromEngine;

}