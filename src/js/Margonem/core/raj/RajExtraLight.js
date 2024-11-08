//let RajData                 = require('core/raj/RajData');
//let LightPoint              = require('core/night/LightPoint');
let FramesWithHoles = require('core/FramesWithHoles');
let RajGetSpecificData = require('core/raj/RajGetSpecificData');
let RajRandomElements = require('core/raj/RajRandomElements');
let RajActionData = require('core/raj/rajAction/RajActionData');
let RajActionManager = require('core/raj/rajAction/RajActionManager');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');

module.exports = function() {

    let moduleData = {
        fileName: "RajExtraLight.js"
    };

    let extraLight = {};
    let rajActionManager = null;
    let nightFrameLength = 4;
    let framesWithHoles;


    const ACTION_CREATE = RajActionData.ACTION.CREATE;
    //const ACTION_CREATE_IF_NOT_EXIST  = RajActionData.CREATE_IF_NOT_EXIST;
    const ACTION_CREATE_FORCE = RajActionData.ACTION.CREATE_FORCE;
    const ACTION_REMOVE = RajActionData.ACTION.REMOVE;
    //const ACTION_REMOVE_IF_EXIST      = RajActionData.REMOVE_IF_EXIST;


    let battleNight = null
    let battleNightCtx = null

    const init = () => {
        framesWithHoles = new FramesWithHoles();
        framesWithHoles.init();
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        const TYPE = RajActionData.TYPE;

        rajActionManager = new RajActionManager();

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: rajCreateAction,
                removeFunc: rajRemoveAction,
                checkExistFunc: checkExtraLightExist,
                createRequire: {
                    master: {
                        type: {
                            name: TYPE.TARGET,
                            option: [RajActionData.TARGET_KIND.THIS_NPC_INSTANCE, CanvasObjectTypeData.NPC]
                        },
                        optional: true
                    },
                    d: {
                        type: TYPE.OBJECT,
                        elementInObject: {
                            x: {
                                type: TYPE.INT_OR_GET_CHARACTER_DATA
                            },
                            y: {
                                type: TYPE.INT_OR_GET_CHARACTER_DATA
                            },
                            r: {
                                type: TYPE.NUMBER,
                                optional: true
                            },
                            gradientPercent1: {
                                type: TYPE.NUMBER,
                                optional: true
                            },
                            gradientPercent2: {
                                type: TYPE.NUMBER,
                                optional: true
                            },
                            offsetX: {
                                type: TYPE.NUMBER,
                                optional: true
                            },
                            offsetY: {
                                type: TYPE.NUMBER,
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
            RajActionData.GROUP_NAME.OBJECT_WITH_LIST_ACTION_ID
        );

    };

    const getFreeId = () => {
        let id = 0;
        while (extraLight[id]) {
            id++;
        }
        return id;
    };

    const checkKindMasterIsNpc = (data) => {
        return data.kind && (data.kind == RajActionData.TARGET_KIND.THIS_NPC_INSTANCE || data.kind == "NPC");
    };

    const getNpcTarget = (targetObject) => {
        return {
            kind: "NPC",
            id: targetObject.getId()
        }
    };

    const addExtraLight = (id, data, master) => {

        extraLight[id] = {
            id: id,
            rajData: data,
            onePointDataArrayHole: framesWithHoles.getOnePoint(data, nightFrameLength, true, false),
            light: null,
            onlyNight: true,
            master: master
        };

        if (!data.light) return;

        let oneLightPoint = Engine.nightController.createOneLightPoint(data);

        if (!oneLightPoint) return;

        extraLight[id].light = oneLightPoint;

        if (!isset(data.light.onlyNight)) return;

        extraLight[id].onlyNight = data.light.onlyNight;
    };

    const getGradient = () => {
        return [{
                r: 0,
                g: 0,
                b: 0,
                a: 1
            },
            {
                r: 0,
                g: 0,
                b: 0,
                a: 0.2
            },
            {
                r: 0,
                g: 0,
                b: 0,
                a: 0
            }
        ];
    }

    const createOnePointOnExistFramesOfNight = (id) => {
        let framesOfNight = getEngine().nightController.getFramesOfNight();
        let oneExtraLight = getExtraLight(id);

        for (let i = 0; i < framesOfNight.length; i++) {
            drawExtraLightOnFrameOfNight(oneExtraLight, framesOfNight[i], i);
        }
    };

    const drawExtraLightOnFrameOfNight = (oneExtraLight, frameOfNight, indexFrameOfNight) => {
        let ctx = frameOfNight.getContext("2d");
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        framesWithHoles.drawOneHole(oneExtraLight.onePointDataArrayHole[indexFrameOfNight], ctx, true);
        ctx.restore();
    };

    const removeOnePointOnExistFramesOfNight = (id) => {

        if (!checkExtraLightExist(id)) {
            return;
        }

        let framesOfNight = getEngine().nightController.getFramesOfNight();
        let oneExtraLight = getExtraLight(id);

        for (let i = 0; i < framesOfNight.length; i++) {
            drawCoverExtraLightOnFrameOfNight(oneExtraLight, framesOfNight[i], i);
        }
    };

    const drawCoverExtraLightOnFrameOfNight = (oneExtraLight, frameOfNight, indexFrameOfNight) => {
        let ctx = frameOfNight.getContext("2d");
        let data = oneExtraLight.onePointDataArrayHole[indexFrameOfNight];
        let nightController = Engine.nightController;
        let nightOpacity = getNightOpacity();

        data.stop0 = "rgba(0,0,0," + (nightOpacity) + ")";
        data.stop1 = "rgba(0,0,0," + (0.2 * nightOpacity) + ")";
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        framesWithHoles.drawOneHole(data, ctx, true);
        ctx.restore();
    };


    const getNightOpacity = () => {
        let nightController = Engine.nightController;
        let nightOpacity = nightController.getNightOpacity();
        let dayNightCycle = nightController.getDayNightCycle();
        let dayNightCycleOpacity = nightController.getDayNightCycleOpacity()

        let opacity = dayNightCycle && dayNightCycleOpacity != null ? dayNightCycleOpacity : nightOpacity;

        if (opacity == null) {
            errorReport(moduleData.fileName, "getNightOpacity", "opacity == null");
            opacity = 0.1
        }

        return opacity;
    }

    const removeExtraLight = (id) => {
        delete extraLight[id];
    };

    const updateData = (data, additionalData) => {

        const FUNC = "updateData";

        // if (data.action) {
        //     if (data.action == "CLEAR_DATA") {          // todo CLEAR_DATA keeee?
        //         resetExtraLight();
        //     } else {
        //         errorReport(moduleData.fileName, FUNC, "undefined action", data.action);
        //     }
        //
        //     return;
        // }

        if (rajActionManager.checkClearForObjectWithListActionId(data, additionalData)) {
            rajActionManager.clearDataForObjectWithListActionId(data, additionalData, this);
            return;
        }

        if (!rajActionManager.checkCorrectMainData(data, additionalData)) return;


        let list = data.list;

        for (let k in list) {

            let oneExtraLightData = list[k];

            if (!correctOneExtralightData(oneExtraLightData)) continue;

            let action = oneExtraLightData.action;
            if (action != ACTION_REMOVE) prepareOneData(oneExtraLightData, additionalData);

            rajActionManager.updateData(oneExtraLightData, additionalData);
        }
    };

    const correctOneExtralightData = (oneExtraLightData) => {
        const FUNC = "oneExtraLightData";

        if (!elementIsObject(oneExtraLightData)) {
            errorReport(moduleData.fileName, FUNC, "oneExtraLightData have to be object!", oneExtraLightData);
            return false;
        }

        if (oneExtraLightData.action == ACTION_REMOVE) return true;

        if (!oneExtraLightData.d) {
            errorReport(moduleData.fileName, FUNC, "oneExtraLightData.d is obligatory in extraLight module!", oneExtraLightData);
            return false;
        }

        if (!elementIsObject(oneExtraLightData)) {
            errorReport(moduleData.fileName, FUNC, "oneExtraLightData.d have to be object!", oneExtraLightData);
            return false;
        }

        return true;
    };

    const prepareOneData = (oneExtraLightData, additionalData) => {

        let manageRandomElementInObjectIfExist = RajRandomElements.manageRandomElementInObjectIfExist;
        manageRandomElementInObjectIfExist(oneExtraLightData.d);

        let d = oneExtraLightData.d;
        let light = d.light;

        if (light) {
            manageRandomElementInObjectIfExist(light);
            if (light.color) manageRandomElementInObjectIfExist(light.color);
        }

        let issetId = isset(oneExtraLightData.id);

        if (issetId) oneExtraLightData.id = RajGetSpecificData.getCharacterData(oneExtraLightData.id, additionalData);

        let master = oneExtraLightData.master;
        let masterExist = checkMasterExist(master);
        oneExtraLightData.id = masterExist && !issetId ? getFreeId() : oneExtraLightData.id;

        if (oneExtraLightData.action == ACTION_CREATE) { // TODO FIX in future !!!!!!!
            oneExtraLightData.action = ACTION_CREATE_FORCE;
        }

        if (!masterExist) return;

        let targetObject = RajGetSpecificData.getTargetObject(master, additionalData);

        if (targetObject) prepareOneDataFromTargetObject(targetObject, oneExtraLightData);
        else prepareOneDataWithoutTargetObject(oneExtraLightData);
    };

    const prepareOneDataFromTargetObject = (targetObject, oneExtraLightData) => {
        targetObject.addExtraLightId(oneExtraLightData.id);
        let master = getNpcTarget(targetObject);

        if (isset(master.id)) oneExtraLightData.master.id = master.id;
        if (isset(master.kind)) oneExtraLightData.master.kind = master.kind;

        oneExtraLightData.d.x = targetObject.d.x;
        oneExtraLightData.d.y = targetObject.d.y;
    };

    const prepareOneDataWithoutTargetObject = (oneExtraLightData) => {
        warningReport(moduleData.fileName, "prepareOneDataWithoutTargetObject", "?");

        oneExtraLightData.d.x = RajGetSpecificData.getCharacterData(oneExtraLightData.d.x, additionalData);
        oneExtraLightData.d.y = RajGetSpecificData.getCharacterData(oneExtraLightData.d.y, additionalData);
    };

    const checkMasterExist = (master) => {
        return master && checkKindMasterIsNpc(master);
    }

    const addExtraLightsToAlreadyCreateFrameOfNight = (frameOfNight, indexFrameOfNight) => {
        for (let id in extraLight) {
            let oneExtraLight = getExtraLight(id);
            drawExtraLightOnFrameOfNight(oneExtraLight, frameOfNight, indexFrameOfNight);
        }
    };

    const rajCreateAction = (oneExtraLightData, additionalData) => {

        //if (!Engine.rajCase.checkFullFillCase(oneExtraLightData.case, additionalData)) return;

        let id = oneExtraLightData.id;
        let master = oneExtraLightData.master ? oneExtraLightData.master : null;

        oneExtraLightData.d.x = RajGetSpecificData.getCharacterData(oneExtraLightData.d.x, additionalData);
        oneExtraLightData.d.y = RajGetSpecificData.getCharacterData(oneExtraLightData.d.y, additionalData);

        addExtraLightToFramesOfNight(id, oneExtraLightData, master);
    };

    const rajRemoveAction = (oneExtraLightData) => {
        let id = oneExtraLightData.id;

        //if (oneExtraLightData && !Engine.rajCase.checkFullFillCase(oneExtraLightData.case)) return;       /// bug?

        removeExtraLightFromFramesOfNight(id);
    };

    const rajRemoveActionBeyondManager = (id) => {
        rajRemoveAction({
            id: id,
            action: ACTION_REMOVE
        })
    };

    const addExtraLightToFramesOfNight = (id, oneExtraLightData, master) => {
        addExtraLight(id, oneExtraLightData.d, master);
        createOnePointOnExistFramesOfNight(id);
    };

    const removeExtraLightFromFramesOfNight = (id) => {
        removeOnePointOnExistFramesOfNight(id);
        removeExtraLight(id);
    };

    //const checkOneExtraLightData = (oneExtraLightData) => {
    //    const FUNC = "checkOneExtraLightData";
    //
    //    if (!isset(oneExtraLightData.action)) {
    //        errorReport(moduleData.fileName, FUNC, "Attr action not exist!", oneExtraLightData);
    //        return false;
    //    }
    //
    //    if (!RajData.action[oneExtraLightData.action]) {
    //        errorReport(moduleData.fileName, FUNC, "Undefined name of action!", oneExtraLightData);
    //        return false
    //    }
    //
    //    if (!isset(oneExtraLightData.id)) {
    //        errorReport(moduleData.fileName, FUNC, "Attr id not exist!", oneExtraLightData);
    //        return false;
    //    }
    //
    //    if (!isset(oneExtraLightData.d)) {
    //        errorReport(moduleData.fileName, FUNC, "Attr d not exist!", oneExtraLightData);
    //        return false;
    //    }
    //
    //    if (!elementIsObject(oneExtraLightData.d)) {
    //        errorReport(moduleData.fileName, FUNC, "Attr d have to object!", oneExtraLightData);
    //        return false;
    //    }
    //
    //    return true;
    //};

    const getExtraLight = (id) => {
        return extraLight[id];
    };

    const checkExtraLightExist = (id) => {
        return extraLight[id] ? true : false;
    };

    const getAllExtraLight = () => {
        return extraLight;
    };

    const onClear = () => {
        extraLight = {};
    };

    //const getOnlyNight = () => {
    //    return onlyNight;
    //};

    const getExtraLightByNpcIdArray = (wariorsObjData) => {
        let a = []
        for (let k in extraLight) {
            let oneExtraLight = extraLight[k];
            //if (oneExtraLight.master && oneExtraLight.master.kind == "NPC" && oneExtraLight.master.id == npcId) {
            if (oneExtraLight.master && oneExtraLight.master.kind == "NPC") {

                let oneWarriorData = wariorsObjData[oneExtraLight.master.id];

                if (!oneWarriorData) continue;

                a.push({
                    warriorId: oneWarriorData.warriorId,
                    originalId: oneWarriorData.originalId,
                    extraLight: oneExtraLight
                })
            }
        }

        return a;
    }



    const clearAndRemoveCallback = () => {
        debugger;
        for (let id in extraLight) {
            rajRemoveActionBeyondManager(id);
        }
        onClear();
    }

    this.init = init;
    this.getExtraLightByNpcIdArray = getExtraLightByNpcIdArray;
    //this.rajRemoveExtralightById                    = rajRemoveExtralightById;
    this.rajRemoveActionBeyondManager = rajRemoveActionBeyondManager;
    //this.getOnlyNight                               = getOnlyNight;
    this.getAllExtraLight = getAllExtraLight;
    this.onClear = onClear;
    this.clearAndRemoveCallback = clearAndRemoveCallback;
    this.addExtraLightsToAlreadyCreateFrameOfNight = addExtraLightsToAlreadyCreateFrameOfNight;
    this.updateData = updateData;
};