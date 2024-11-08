let FramesWithHoles = require('core/FramesWithHoles');
let DynamicLight = require('core/night/DynamicLight');
//let RajData                 = require('core/raj/RajData');
let RajActionData = require('core/raj/rajAction/RajActionData');
let RajActionManager = require('core/raj/rajAction/RajActionManager');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');

module.exports = function() {

    let moduleData = {
        fileName: "DynamicLightsManager.js"
    };

    let framesWithHoles;
    let rajActionManager;
    let dynamicLightList = {};

    const ACTION_REMOVE = RajActionData.ACTION.REMOVE;

    const init = () => {
        framesWithHoles = new FramesWithHoles();
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        rajActionManager = new RajActionManager();

        const TYPE = RajActionData.TYPE;

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: rajCreateAction,
                removeFunc: rajRemoveAction,
                checkExistFunc: checkDynamicLight,
                createRequire: {
                    master: {
                        type: {
                            name: TYPE.TARGET,
                            option: [CanvasObjectTypeData.FAKE_NPC, CanvasObjectTypeData.HERO, CanvasObjectTypeData.PET, CanvasObjectTypeData.FLOAT_OBJECT]
                        }
                    },
                    d: {
                        type: TYPE.OBJECT,
                        elementInObject: {
                            r: {
                                type: TYPE.FLOAT,
                                optional: true
                            },
                            gradientPercent1: {
                                type: TYPE.INT,
                                optional: true
                            },
                            gradientPercent2: {
                                type: TYPE.INT,
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
            RajActionData.GROUP_NAME.OBJECT_WITH_LIST_ACTION_ID
        );
    };

    const update = (dt) => {
        for (let k in dynamicLightList) {
            dynamicLightList[k].update(dt);
        }
    };

    const updateData = (rayData, additionalData) => {
        let list = rayData.list;

        for (let k in list) {

            let oneDynamicLightData = list[k];
            //let id                      = getId(oneDynamicLightData);
            //oneDynamicLightData.id = getId(oneDynamicLightData);

            //if (!Engine.rajCase.checkFullFillCase(oneDynamicLightData.case)) continue;

            //switch (oneDynamicLightData.action) {
            //    case RajData.action.CREATE:         rajCreateAction(oneDynamicLightData, additionalData); break;
            //    case RajData.action.REMOVE:         rajRemoveAction(oneDynamicLightData); break;
            //    default :                           errorReport(moduleData.fileName, "updateData", "Undefined action" + oneDynamicLightData.action);
            //}

            rajActionManager.updateData(oneDynamicLightData, additionalData);

        }
    };

    //const getId = (oneDynamicLightData) => {
    //    if (isset(oneDynamicLightData.master)) {
    //
    //        if (isset(oneDynamicLightData.id)) return oneDynamicLightData.id;
    //
    //        //return getFreeId()
    //        return getFreeIdOfObject(dynamicLightList)
    //    }
    //
    //    return oneDynamicLightData.id;
    //};

    //const checkKindMasterIsNpc = (data) => {
    //    return data.kind && (data.kind == "THIS_NPC_INSTANCE" || data.kind == "NPC");
    //};

    const rajCreateAction = (oneDynamicLightData, additionalData) => {

        let dynamicLight = new DynamicLight();


        addDynamicLight(oneDynamicLightData.id, dynamicLight);
        dynamicLight.init();
        dynamicLight.updateData(oneDynamicLightData, additionalData);
    };

    const rajRemoveAction = (oneDynamicLightData) => {

        let id = oneDynamicLightData.id;

        //if (!checkDynamicLight(id)) {
        //    errorReport(moduleData.fileName, "rajRemoveAction", `DynamicLight id ${id} not exist!`, dynamicLightList);
        //    return
        //}

        let dynamicLight = getDynamicLight(id);
        let master = dynamicLight.getMaster();

        if (master) master.getObjectDynamicLightManager().removeDynamicLightId(id);

        removeDynamicLight(id)
    };

    const rajRemoveActionBeyondManager = (id) => {
        rajRemoveAction({
            id: id,
            action: ACTION_REMOVE
        })
    };

    //const getFreeId = () => {
    //    let id = 0;
    //    while (dynamicLightList[id]) {
    //        id++;
    //    }
    //    return id;
    //};

    const addDynamicLight = (id, dynamicLight) => {
        dynamicLightList[id] = dynamicLight;
    };

    const removeDynamicLight = (id) => {
        delete dynamicLightList[id];
    };

    const checkDynamicLight = (id) => {
        return dynamicLightList[id] ? true : false;
    };

    const getDynamicLight = (id) => {
        return dynamicLightList[id]
    }

    const getDynamicLightList = () => {
        return dynamicLightList;
    };

    const getFramesWithHoles = () => {
        return framesWithHoles;
    };

    const onClear = () => {
        dynamicLightList = {};
    };


    this.init = init;
    this.update = update;
    this.updateData = updateData;
    this.getDynamicLightList = getDynamicLightList;
    this.onClear = onClear;
    this.getframesWithHoles = getFramesWithHoles;
    this.rajRemoveActionBeyondManager = rajRemoveActionBeyondManager;

}