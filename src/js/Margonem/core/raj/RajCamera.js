let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
let RajActionManager = require('core/raj/rajAction/RajActionManager');
let RajActionData = require('core/raj/rajAction/RajActionData');

module.exports = function() {

    const moduleData = {
        fileName: "RajCameraTarget.js"
    };

    let cameraData = {
        data: null,
        targetObject: null,
        cords: null
    };

    let rajActionManager = null;
    let cameraTargetDuration = 0;

    const init = () => {
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        rajActionManager = new RajActionManager();


        const TYPE = RajActionData.TYPE;

        const NPC = CanvasObjectTypeData.NPC;
        const FAKE_NPC = CanvasObjectTypeData.FAKE_NPC;
        const PET = CanvasObjectTypeData.PET;
        const MAP = CanvasObjectTypeData.MAP;
        const FLOAT_OBJECT = CanvasObjectTypeData.FLOAT_OBJECT;
        const THIS_NPC_INSTANCE = RajActionData.TARGET_KIND.THIS_NPC_INSTANCE

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                clearFunc: clearAction,
                createRequire: {
                    target: {
                        type: {
                            name: TYPE.TARGET,
                            option: [THIS_NPC_INSTANCE, FAKE_NPC, PET, MAP, FLOAT_OBJECT, NPC]
                        }
                    },
                    duration: {
                        type: TYPE.NUMBER,
                        optional: true
                    }
                }
            },
            RajActionData.GROUP_NAME.OVERRIDE_OBJECT
        );
    };

    const checkUpdate = () => {
        return cameraData.data != null;
    };

    const resetCameraData = () => {
        setCameraData(null, null, null);
    };

    const updateData = (data, additionalData) => {
        //if (!checkCorrectData(data)) return;
        if (!rajActionManager.checkCorrectMainData(data, additionalData)) return;

        //if (!Engine.rajCase.checkFullFillCase(data.case)) return;

        //clear();
        //
        //if (isset(data.clear)) return;
        //
        //prepareData(data);

        rajActionManager.updateData(data, additionalData)
    };

    const createAction = (data) => {
        clear();
        prepareData(data);
    };

    const clearAction = () => {
        clear();
    };

    const clear = () => {
        resetCameraData();
        reserCameraTargetDuration();
        if (Engine.dialogue) {
            let pos = Engine.dialogue.getDialogueCenterPos();
            Engine.map.centerOn(pos.x, pos.y);
        }
    };

    const reserCameraTargetDuration = () => {
        cameraTargetDuration = 0;
    }

    const prepareData = (data) => {
        switch (data.target.kind) {
            case CanvasObjectTypeData.FAKE_NPC:
                setCameraData(data, Engine.fakeNpcs.getById(data.target.id), null);
                break;
            case CanvasObjectTypeData.PET:
                setCameraData(data, Engine.hero.getPet(), null);
                break;
            case CanvasObjectTypeData.NPC:
                setCameraData(data, Engine.npcs.getById(data.target.id), null);
                break;
            case CanvasObjectTypeData.MAP:
                setCameraData(data, null, {
                    x: data.target.x,
                    y: data.target.y
                });
                break;
            case CanvasObjectTypeData.FLOAT_OBJECT:
                setCameraData(data, Engine.floatObjectManager.getById(data.target.id));
                break;
        }
    };

    const setCameraData = (data, targetObject, cords) => {
        cameraData.data = data;
        cameraData.targetObject = targetObject;
        cameraData.cords = cords;
    };

    const update = (dt) => {
        if (!checkUpdate()) return;

        let duration = cameraData.data.duration;
        if (duration) {

            cameraTargetDuration += dt * 1000;

            if (cameraTargetDuration > duration * 1000) {
                clear();
                return;
            }
        }

        cameraTargetUpdate();
    };

    const cameraTargetUpdate = () => {
        if (cameraData.targetObject != null) Engine.map.centerOn(cameraData.targetObject.rx, cameraData.targetObject.ry);
        if (cameraData.cords != null) Engine.map.centerOn(cameraData.cords.x, cameraData.cords.y);
    };

    //const checkCorrectData = (data) => {
    //    const FUNC = "checkCorrectData";
    //
    //    if (!elementIsObject(data)) {
    //        errorReport(moduleData.fileName, FUNC, "object camera have to object!", data);
    //        return false;
    //    }
    //
    //    if (isset(data.clear)) return true;
    //
    //    if (!isset(data.target)) {
    //        errorReport(moduleData.fileName, FUNC, "attr camera.target is obligatory!", data);
    //        return false;
    //    }
    //
    //    if (!elementIsObject(data.target)) {
    //        errorReport(moduleData.fileName, FUNC, "attr camera.target have to object!", data);
    //        return false;
    //    }
    //
    //    if (!checkTarget(data)) return false;
    //
    //    if (isset(data.duration)) {
    //        if (!isInt(data.duration)) {
    //            errorReport(moduleData.fileName, FUNC, "attr camera.duration have to int val!", data);
    //            return false;
    //        }
    //    }
    //
    //    return true;
    //
    //};

    //const checkTarget = (data) => {
    //    let target  = data.target;
    //    let kind    = target.kind;
    //    const FUNC  = "checkTarget";
    //
    //    switch (kind) {
    //        case CanvasObjectTypeData.FAKE_NPC:
    //            if (!isset(target.id)) {
    //                errorReport(moduleData.fileName, FUNC, "target.kind:FAKE_NPC have to target.id attr!", data);
    //                return false;
    //            }
    //            if (!Engine.fakeNpcs.getById(target.id)) {
    //                errorReport(moduleData.fileName, FUNC, "target.kind:FAKE_NPC fakeNpc not exist!", data);
    //                return false;
    //            }
    //            break;
    //        case CanvasObjectTypeData.PET:
    //            if (!Engine.hero.getPet()) {
    //                errorReport(moduleData.fileName, FUNC, "target.kind:PET Hero not use pet now!", data);
    //                return false;
    //            }
    //            break;
    //        case CanvasObjectTypeData.FLOAT_OBJECT:
    //            if (!Engine.floatObjectManager.getById(data.target.id)) {
    //                errorReport(moduleData.fileName, FUNC, "target.kind:FLOAT_OBJECT floatObject not exist!", data);
    //                return false;
    //            }
    //            break;
    //        case CanvasObjectTypeData.MAP:
    //            if (!isset(target.x || target.y)){
    //                errorReport(moduleData.fileName, FUNC, "target.kind:MAP have to target.x and target.y", data);
    //                return false;
    //            }
    //
    //            if (!isIntVal(target.x) || !isIntVal(target.y)) {
    //                errorReport(moduleData.fileName, FUNC, "target.kind:MAP target.x and target.y have to integer!", data);
    //                return false;
    //            }
    //            break;
    //            default :
    //                errorReport(moduleData.fileName, FUNC, "undefined target.kind!", data);
    //                return false;
    //    }
    //
    //
    //    return true;
    //};

    const onClear = () => {
        clear();
    };

    this.init = init;
    this.update = update;
    this.updateData = updateData;
    //this.updateData     = updateData;
    this.onClear = onClear;

}