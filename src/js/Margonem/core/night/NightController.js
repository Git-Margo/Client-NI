//let RajData      			= require('core/raj/RajData');
let LightPoint = require('core/night/LightPoint');
let FramesWithHoles = require('core/FramesWithHoles');
let RajActionManager = require('core/raj/rajAction/RajActionManager');
let RajActionData = require('core/raj/rajAction/RajActionData');

module.exports = function() {

    let moduleData = {
        fileName: "NightController.js"
    };
    let rajActionManager = null;
    let actualFrame = 0;
    let framesOfNight = [];
    let frameTime = 0.2;
    let timePassed = 0;
    let nightFrameLength = 4;
    let defaultDayDuration = 24;
    let defaultWorldTime = false;
    let ready = false;
    let framesWithHoles = null;
    let dayNightCycle = false;
    let dayNightCycleInterval = null;
    let nightOpacity = null;
    let dayNightCycleOpacity = null;
    let lightPointsListData = null;
    let objColor = null;
    let rayData = null;
    let dayDuration = null;
    let minAlpha = null;
    let lightPointsList = [];
    let worldTime = null;

    let dynamicLight = true;
    let mainNightCanvas = null;
    let mainNightCtx = null;

    //this.alwaysDraw       		= true;
    let alwaysDraw

    const defaultNightColor = {
        'r': 0,
        'g': 0,
        'b': 0,
        'a': 0.5
    };
    const defaultFrameTime = 0.1;

    const getNightOpacityFactor = (h) => {
        let alpha = getOpacityByHour(h);

        return Math.max(minAlpha, alpha);
    };

    const initMainNightCanvas = () => {
        let canvasData = framesWithHoles.createCanvasData();
        mainNightCanvas = canvasData.canvas;
        mainNightCtx = canvasData.ctx;
    };

    const setMainNightCanvasSize = () => {
        let $gameLayer = Engine.interface.get$gameLayer();
        let width = $gameLayer.width();
        let height = $gameLayer.height();

        if (width == 0 && height == 0) return;

        mainNightCanvas.width = width;
        mainNightCanvas.height = height;
    };

    const resizeMainCanvas = () => {
        setMainNightCanvasSize();
    };

    const getOpacityByHour = (h) => {
        if (h >= 8 && h < 18.5) return 0;
        if (h < 3.5 || h >= 23) return 1;

        if (h <= 4) return 0.9;
        if (h <= 4.5) return 0.8;
        if (h <= 5) return 0.7;
        if (h <= 5.5) return 0.6;
        if (h <= 6) return 0.5;
        if (h <= 6.5) return 0.4;
        if (h <= 7) return 0.3;
        if (h <= 7.5) return 0.2;
        if (h <= 8) return 0.1;

        if (h < 19) return 0.1;
        if (h < 19.5) return 0.2;
        if (h < 20) return 0.3;
        if (h < 20.5) return 0.4;
        if (h < 21) return 0.5;
        if (h < 21.5) return 0.6;
        if (h < 22) return 0.7;
        if (h < 22.5) return 0.8;
        if (h < 23) return 0.9;

        errorReport(moduleData.fileName, "getNightOpacityFactor", 'WOW');
        return 0;
    };

    const getTime = () => {

        let date = null;

        if (!worldTime) date = new Date();
        else {
            let ev = Engine.getEv();
            let worldTime = Engine.getWorldTime();
            let v = (ev ? ev : worldTime) * 1000;

            date = new Date(v);
        }

        let dayHour = dayDuration;
        let h = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 60 / 60;
        let dayPercent = Math.floor(h / dayHour);
        let allMinutesInOneDay = 60 * 24;

        dayPercent = h / dayHour - dayPercent;

        return (dayPercent * allMinutesInOneDay) / 60;
    };

    const createFramesOfNight = () => {
        for (let i = 0; i < nightFrameLength; i++) {
            let canvas = document.createElement('canvas');
            framesOfNight.push(canvas);
        }
    };

    const init = () => {
        setAlwaysDraw(true);
        framesWithHoles = new FramesWithHoles();
        framesWithHoles.init();
        initMainNightCanvas();
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        rajActionManager = new RajActionManager();

        const TYPE = RajActionData.TYPE;

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                clearFunc: clearAction,
                createRequire: {
                    color: {
                        type: TYPE.RGBA_COLOR
                    },
                    dayNightCycle: {
                        type: TYPE.OBJECT,
                        optional: true,
                        elementInObject: {
                            dayDuration: {
                                type: TYPE.INT,
                                optional: true
                            },
                            worldTime: {
                                type: TYPE.BOOL,
                                optional: true
                            }
                        }
                    },
                    list: {
                        type: TYPE.ARRAY,
                        elementInArray: {
                            x: {
                                type: TYPE.INT_OR_GET_CHARACTER_DATA
                            },
                            y: {
                                type: TYPE.INT_OR_GET_CHARACTER_DATA
                            },
                            r: {
                                type: TYPE.INT,
                                optional: true
                            },
                            gradientPercent1: {
                                type: TYPE.INT,
                                range: [0, 100],
                                optional: true
                            },
                            gradientPercent2: {
                                type: TYPE.INT,
                                range: [0, 100],
                                optional: true
                            },
                            offsetX: {
                                type: TYPE.INT,
                                optional: true
                            },
                            offsetY: {
                                type: TYPE.INT,
                                optional: true
                            },
                            light: {
                                type: TYPE.OBJECT,
                                optional: true,
                                elementInObject: {
                                    r: {
                                        type: TYPE.INT,
                                        optional: true
                                    },
                                    color: {
                                        type: TYPE.RGBA_COLOR,
                                        optional: true
                                    },
                                    onlyNight: {
                                        type: TYPE.BOOL,
                                        optional: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            RajActionData.GROUP_NAME.OVERRIDE_OBJECT
        );
    };

    const updateData = (v, additionalData) => {
        if (!rajActionManager.checkCorrectMainData(v, additionalData)) return;

        rajActionManager.updateData(v);
    };

    const createAction = (v, additionalData) => {
        onClear();

        //if (!Engine.rajCase.checkFullFillCase(v.case)) return;

        setRayData(v);

        //if (Engine.opt(11)) return;
        //if (!getEngine().settingsOptions.isCycleDayAndNightOn()) {
        if (!isSettingsOptionsCycleDayAndNightOn()) {
            return
        }

        setData();
        createNight(false);
    };

    const clearAction = () => {
        //setRayData(null);
        onClear();
    };

    const setRayData = (_rayData) => {
        rayData = _rayData
    };

    const rebuiltAfterSettingsSave = () => {
        if (rayData == null) return

        //updateData(rayData)

        createAction(rayData);
    };

    const createNight = (lazyLoading, newNightOpacityVal) => {
        let stringNightColor = getCalculateStringNightColor();
        let nightOpacity = getCalculateNightOpacity();

        let fastFrames = lazyLoading ? [] : [0];
        let firstFrame = true;

        if (dayNightCycle && (newNightOpacityVal == 0 || nightOpacity == 0)) {
            clearNight();
            dayNightCycleOpacity = newNightOpacityVal;
            callActionsAfterCreateFirstFrame();
            return
        }

        framesWithHoles.createFrames(lightPointsListData, stringNightColor, nightFrameLength, fastFrames, function(oneFrame) {
            if (lazyLoading && firstFrame) {
                clearNight();

                firstFrame = false;
                dayNightCycleOpacity = newNightOpacityVal;

                callActionsAfterCreateFirstFrame();
            }

            addFrameToFramesOfNight(oneFrame);
        });

        if (!lazyLoading) callActionsAfterCreateFirstFrame()
    }

    const addFrameToFramesOfNight = (frame) => {
        framesOfNight.push(frame);
        Engine.rajExtraLight.addExtraLightsToAlreadyCreateFrameOfNight(frame, framesOfNight.length - 1);
    };

    const callActionsAfterCreateFirstFrame = () => {
        if (shouldCreateLightPoint()) createLightPoints();

        setNightBackground();
        setDayNightCycleInterval();

        ready = true;
    }

    const shouldCreateLightPoint = () => {
        let calculateNightOpacity = getCalculateNightOpacity();

        if (!dayNightCycle) return true;

        return calculateNightOpacity >= 0.1;
    }

    const setData = () => {
        dayNightCycle = isset(rayData.dayNightCycle) ? true : false;
        worldTime = dayNightCycle && isset(rayData.dayNightCycle.worldTime) ? rayData.dayNightCycle.worldTime : defaultWorldTime;
        dayDuration = dayNightCycle && isset(rayData.dayNightCycle.dayDuration) ? rayData.dayNightCycle.dayDuration : defaultDayDuration;
        minAlpha = dayNightCycle && isset(rayData.dayNightCycle.minAlpha) ? rayData.dayNightCycle.minAlpha : 0;
        lightPointsListData = framesWithHoles.getHolesList(rayData, nightFrameLength, "NightController.js");

        setObjectColor(rayData.color ? rayData.color : defaultNightColor);

        nightOpacity = getCalculateNightOpacity();
        frameTime = rayData.frameTime ? rayData.frameTime : defaultFrameTime;
    };

    const setObjectColor = (_objColor) => {
        objColor = _objColor;
    };

    const getCalculateStringNightColor = () => {
        let nightColor = null;

        if (dayNightCycle) {

            let overrideDayNightCycle = getEngine().overrideDayNightCycle;

            if (overrideDayNightCycle.isOverrideDayNightCycleExist()) {
                let newAlpha = overrideDayNightCycle.geNormalizeOverrideDayNightCycleAlpha(minAlpha, objColor.a);
                nightColor = getStringNightColorByNewAlpha(newAlpha);
            } else {
                nightColor = getStringNightColorByAlphaColor(getNightOpacityFactor(getTime()));
            }

            //nightColor = getStringNightColor(getNightOpacityFactor(getTime()));
        } else {
            nightColor = getStringNightColor();
        }

        return nightColor;
    };

    const getCalculateNightOpacity = () => {
        let stringNightColor = getCalculateStringNightColor();

        return parseFloat(stringNightColor.split(',')[3]);
    };

    const createLightPoints = () => {

        let rayList = rayData.list;

        for (let k in rayList) {
            let oneData = rayList[k];
            if (!oneData.light) continue;

            let oneLightPoint = createOneLightPoint(oneData);
            if (!oneLightPoint) continue;

            lightPointsList.push(oneLightPoint)

        }
    };

    const createOneLightPoint = (oneData, realXYPos) => {
        let preparedData = framesWithHoles.getOnePoint(oneData, 1);
        if (!isset(preparedData[0])) {
            errorReport(moduleData.fileName, "createLightPoints", "One point not exist!", preparedData);
            return null;
        }

        if (!Engine.rajCase.checkFullFillCase(oneData.case)) return null;

        let oneLightPoint = new LightPoint();
        oneLightPoint.init(preparedData[0], realXYPos);

        return oneLightPoint;
    };

    const clearNightBackground = () => {
        let nightBackground = Engine.interface.get$interfaceLayer().find(".filter-map-night");

        if (nightBackground.css('display') == "none") return;

        nightBackground.css('display', "none");
    };

    const setNightBackground = () => {


        if (getEngine().map.config.getIsQuestFogEnabled()) {
            return;
        }

        let stringNightColor = getCalculateStringNightColor();
        let strColor = `rgba(${stringNightColor})`;

        Engine.interface.get$interfaceLayer().find(".filter-map-night").css({
            'display': "block",
            'background': strColor
        });
    };

    const getStringNightColor = () => {
        if (!objColor) return null;

        //if (isset(alphaFactor)) 	return objColor.r + ',' + objColor.g + ',' + objColor.b + ',' + parseFloat(objColor.a) * alphaFactor;
        //else 						return objColor.r + ',' + objColor.g + ',' + objColor.b + ',' + objColor.a;

        return objColor.r + ',' + objColor.g + ',' + objColor.b + ',' + objColor.a;
    };

    const getStringNightColorByAlphaColor = (alphaFactor) => {
        if (!objColor) return null;

        return objColor.r + ',' + objColor.g + ',' + objColor.b + ',' + parseFloat(objColor.a) * alphaFactor;
    };

    const getStringNightColorByNewAlpha = (newAlpha) => {
        if (!objColor) return null;

        return objColor.r + ',' + objColor.g + ',' + objColor.b + ',' + newAlpha;
    };

    this.getFramesOfNight = () => {
        return framesOfNight;
    };

    const checkNight = () => {
        return framesOfNight.length > 0;
    };

    const update = (dt) => {
        if (framesOfNight.length > 1) {
            timePassed += dt;

            if (timePassed > frameTime) {
                timePassed = 0;
                actualFrame++;
                if (actualFrame + 1 > framesOfNight.length) actualFrame = 0;
            }
        }
    };

    const drawAllCharactersWitchDynamicHoles = () => {

        mainNightCtx.save();
        mainNightCtx.globalCompositeOperation = 'destination-out';

        let dynamicLightList = Engine.dynamicLightsManager.getDynamicLightList();

        for (let k in dynamicLightList) {
            dynamicLightList[k].draw(mainNightCtx, actualFrame, "MAP");
        }

        let dynamicDirCharacterLightList = Engine.dynamicDirCharacterLightsManager.getDirDynamicLightList();

        for (let k in dynamicDirCharacterLightList) {
            dynamicDirCharacterLightList[k].draw(mainNightCtx, actualFrame, "MAP");
        }

        let behaviorDynamicLightList = Engine.behaviorDynamicLightsManager.getBehaviorDynamicLightList();

        for (let k in behaviorDynamicLightList) {
            behaviorDynamicLightList[k].draw(mainNightCtx, actualFrame);
        }

        mainNightCtx.restore();
    };

    const checkDynamicLightsExist = () => {
        return true;
    };

    const draw = (ctx) => {
        if (!ready) return;

        if (!framesOfNight[actualFrame]) return;

        let x = 0;
        let y = 0;

        let clip = Engine.map.getClip();
        let mapShift = Engine.mapShift.getShift();
        let tileSize = CFG.tileSize;


        let clip0 = clip[0];
        let clip1 = clip[1];
        let clip2 = clip[2];
        let clip3 = clip[3];

        var left = x * tileSize - Engine.map.offset[0] + clip0 - mapShift[0];
        var top = y * tileSize - Engine.map.offset[1] + clip1 - mapShift[1];;

        if (dynamicLight) {

            mainNightCtx.clearRect(0, 0, mainNightCanvas.width, mainNightCanvas.height);
            mainNightCtx.drawImage(
                framesOfNight[actualFrame],
                clip0, clip1,
                clip2, clip3,
                left, top,
                clip2, clip3
            );



            if (checkDynamicLightsExist()) drawAllCharactersWitchDynamicHoles();

            ctx.drawImage(
                mainNightCanvas,
                0, 0
            );

        } else {

            ctx.drawImage(
                framesOfNight[actualFrame],
                clip0, clip1,
                clip2, clip3,
                left, top,
                clip2, clip3
            );

        }

    };

    const clearDayNightCycleInterval = () => {
        if (dayNightCycleInterval) clearInterval(dayNightCycleInterval);

        dayNightCycleInterval = null;
    };

    const setDayNightCycleInterval = () => {

        clearDayNightCycleInterval();

        if (!dayNightCycle) return;

        createDayNightCycleInterval();
    };

    const createDayNightCycleInterval = () => {
        dayNightCycleInterval = setInterval(function() {

            manageDayAndNightCycle();

        }, 1000 * 60)
    }

    const rebulitInterval = () => {
        manageDayAndNightCycle();

        setDayNightCycleInterval();
    }

    const manageDayAndNightCycle = () => {
        let hour = getTime();
        let overrideDayNightCycle = getEngine().overrideDayNightCycle;

        let newNightOpacityVal;
        if (overrideDayNightCycle.isOverrideDayNightCycleExist()) newNightOpacityVal = overrideDayNightCycle.geNormalizeOverrideDayNightCycleAlpha(minAlpha, objColor.a);
        else newNightOpacityVal = getNightOpacityFactor(hour) * parseFloat(objColor.a);

        //let newNightOpacityVal 	= getNightOpacityFactor(hour) * parseFloat(objColor.a);

        //devConsoleLog(
        //	[
        //		"night",
        //		'hour', hour,
        //		"newOpacity", newNightOpacityVal,
        //		'oldOpacity', dayNightCycleOpacity,
        //		'minAlpha', minAlpha,
        //		'objColor.a', objColor.a,
        //		'normalizeOverrideDayNightCycleAlpha', Engine.overrideDayNightCycle.getAlphaFactor()
        //	]);

        if (dayNightCycleOpacity == null) {
            dayNightCycleOpacity = nightOpacity;
            //return;
        }

        devConsoleLog(
            [
                "night",
                'hour', hour,
                "newOpacity", newNightOpacityVal,
                'oldOpacity', dayNightCycleOpacity,
                'minAlpha', minAlpha,
                'objColor.a', objColor.a,
                'normalizeOverrideDayNightCycleAlpha', Engine.overrideDayNightCycle.getAlphaFactor()
            ]);

        if (dayNightCycleOpacity != newNightOpacityVal) {
            devConsoleLog(['CHANGE', newNightOpacityVal, hour]);
            createNight(true, newNightOpacityVal)
        }
    };


    const clearNight = () => {
        clearDayNightCycleInterval();
        framesWithHoles.onClear();
        resetFramesOfNight();
        resetLightPointsList();
        clearNightBackground();
        ready = false;
        actualFrame = 0;
        dayNightCycleOpacity = null;
    }

    const onClear = () => {
        setRayData(null);
        clearNight();
    };

    const resetFramesOfNight = () => {
        framesOfNight = [];
    };

    const resetLightPointsList = () => {
        lightPointsList = [];
    };

    const getOrder = function() {
        //return 399;
        return getEngine().renderer.getNightOrderWithoutSort();
    };

    const getNight = () => {
        //if (!ready) return [];

        //let a = [this];
        let a = [];


        if (!isSettingsOptionsCycleDayAndNightOn()) {
            return a;
        }

        for (let k in lightPointsList) {
            a.push(lightPointsList[k]);
        }

        let extraLight = Engine.rajExtraLight.getAllExtraLight();
        let dynamicLight = Engine.dynamicLightsManager.getDynamicLightList();
        let dynamicDirCharacterLight = Engine.dynamicDirCharacterLightsManager.getDirDynamicLightList();
        let behaviorDynamicLightList = Engine.behaviorDynamicLightsManager.getBehaviorDynamicLightList();
        let isNight = checkNight();

        for (let k in extraLight) {
            let add = false;
            let onlyNight = extraLight[k].onlyNight;
            let oneExtraLight = extraLight[k].light;

            if (!oneExtraLight) continue;

            if (onlyNight) {

                if (isNight) add = true;

            } else add = true;


            if (add) a.push(extraLight[k].light);
        }

        for (let k in dynamicLight) {
            let add = false;
            let onlyNight = dynamicLight[k].getOnlyNight();
            let oneDynamicLight = dynamicLight[k].getLight();

            if (!oneDynamicLight) continue;

            if (onlyNight) {

                if (isNight) add = true;

            } else add = true;


            if (add) a.push(oneDynamicLight);
        }

        for (let k in dynamicDirCharacterLight) {
            let add = false;
            let onlyNight = dynamicDirCharacterLight[k].getOnlyNight();
            let oneDynamicLight = dynamicDirCharacterLight[k].getLight();

            if (!oneDynamicLight) continue;

            if (onlyNight) {

                if (isNight) add = true;

            } else add = true;


            if (add) a.push(oneDynamicLight);
        }

        for (let k in behaviorDynamicLightList) {
            let add = false;
            let onlyNight = behaviorDynamicLightList[k].getOnlyNight();
            let oneBehaviorDynamicLight = behaviorDynamicLightList[k].getLight();

            if (!oneBehaviorDynamicLight) continue;

            if (onlyNight) {

                if (isNight) add = true;

            } else add = true;


            if (add) a.push(oneBehaviorDynamicLight);
        }

        if (ready) a.push(this);

        return a;
    };


    const getDayNightCycleOpacity = () => {
        return dayNightCycleOpacity;
    };

    const getNightOpacity = () => {
        return nightOpacity;
    };

    const setDynamicLight = (_dynamicLight) => {
        dynamicLight = _dynamicLight
    };

    const getFramesWithHoles = () => {
        return framesWithHoles;
    };

    const getNightFrameLength = () => {
        return nightFrameLength;
    };

    const getDayNightCycle = () => {
        return dayNightCycle;
    }

    const getReady = () => ready;

    const getActualFrame = () => actualFrame;

    const getRayData = () => rayData

    const getAlwaysDraw = () => {
        return alwaysDraw
    };

    const setAlwaysDraw = (_alwaysDraw) => {
        alwaysDraw = _alwaysDraw
    };

    this.getAlwaysDraw = getAlwaysDraw;
    this.setAlwaysDraw = setAlwaysDraw;

    this.init = init;
    this.getReady = getReady;
    this.getFramesWithHoles = getFramesWithHoles;
    this.update = update;
    this.draw = draw;
    this.updateData = updateData;
    this.onClear = onClear;
    this.getNightOpacity = getNightOpacity;
    this.getOrder = getOrder;
    this.getNight = getNight;
    this.rebuiltAfterSettingsSave = rebuiltAfterSettingsSave;
    this.createOneLightPoint = createOneLightPoint;
    this.getTime = getTime;
    this.resizeMainCanvas = resizeMainCanvas;
    this.setDynamicLight = setDynamicLight;
    this.checkNight = checkNight;
    this.getActualFrame = getActualFrame;
    this.getNightFrameLength = getNightFrameLength;
    this.getCalculateStringNightColor = getCalculateStringNightColor;
    this.getDayNightCycle = getDayNightCycle;
    this.getDayNightCycleOpacity = getDayNightCycleOpacity;
    this.rebulitInterval = rebulitInterval;
    this.getRayData = getRayData;
};