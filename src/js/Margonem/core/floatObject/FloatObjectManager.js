let FloatObject = require('core/floatObject/FloatObject.js');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
let RajRandomElements = require('core/raj/RajRandomElements');
let RajActionData = require('core/raj/rajAction/RajActionData');
let RajActionManager = require('core/raj/rajAction/RajActionManager');
let RajGetSpecificData = require('core/raj/RajGetSpecificData');
let RajMoveNoise = require('core/raj/RajMoveNoise');
let FloatObjectData = require('core/floatObject/FloatObjectData');

module.exports = function() {

    let moduleData = {
        fileName: "FloatObjectManager.js"
    };

    let list = null;
    let rajActionManager = null;

    const init = () => {
        clearList();
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        rajActionManager = new RajActionManager();

        const TYPE = RajActionData.TYPE;
        const BEHAVIOR = FloatObjectData.behavior;
        //const ORDER_KIND    = FloatObjectData.orderData.kind;
        const KIND = FloatObjectData.kind;


        //const orderRequire = {
        //    optional: true,
        //    elementInObject: {
        //        kind : {specificVal:[ORDER_KIND.MAP_OBJECT, ORDER_KIND.FLOAT_OBJECT], optional:true},
        //        v    : {type: TYPE.FLOAT, optional:true}
        //    }
        //}


        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                removeFunc: removeAction,
                checkExistFunc: checkObjectExist,
                updateFunc: updateAction,
                createRequire: {
                    url: true,
                    x: {
                        type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                    },
                    y: {
                        type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                    },
                    color: {
                        type: TYPE.RGB_OR_RGBA_COLOR,
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
                    alwaysDraw: {
                        type: TYPE.BOOL,
                        optional: true
                    },
                    kind: {
                        specificVal: [KIND.SPRITE, KIND.GIF, KIND.FAKE_NPC, KIND.IDLE_FAKE_NPC_FRAME],
                        optional: true
                    },
                    //order   : orderRequire,
                    behavior: {
                        type: TYPE.OBJECT,
                        elementInObject: {
                            list: {
                                type: TYPE.ARRAY,
                                elementInArray: {
                                    name: {
                                        conditionVal: {
                                            [BEHAVIOR.IDLE]: {
                                                duration: {
                                                    type: TYPE.FLOAT,
                                                    optional: true
                                                }
                                            },
                                            [BEHAVIOR.IDLE_GIF_ANIMATION]: {

                                            },
                                            [BEHAVIOR.MOVE_FROM_VECTORS]: {
                                                xVector: {
                                                    type: TYPE.FLOAT,
                                                    optional: true
                                                },
                                                yVector: {
                                                    type: TYPE.FLOAT,
                                                    optional: true
                                                }
                                            },
                                            [BEHAVIOR.CHANGE_IMG]: {
                                                url: true,
                                                color: {
                                                    type: TYPE.RGB_OR_RGBA_COLOR,
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
                                                kind: {
                                                    specificVal: [KIND.SPRITE, KIND.GIF, KIND.FAKE_NPC, KIND.IDLE_FAKE_NPC_FRAME]
                                                },
                                                //order   : orderRequire,

                                            },
                                            [BEHAVIOR.MOVE_TO_CORDS]: {
                                                x: {
                                                    type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                                                },
                                                y: {
                                                    type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                                                }
                                            },
                                            [BEHAVIOR.FOLLOW]: {
                                                x: {
                                                    type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                                                },
                                                y: {
                                                    type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                                                }
                                            },
                                            [BEHAVIOR.TP_TO_CORDS]: {
                                                x: {
                                                    type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                                                },
                                                y: {
                                                    type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                                                }
                                            },
                                            [BEHAVIOR.TP_ON_OTHER_SIDE]: {},
                                            [BEHAVIOR.FADE_IN]: {},
                                            [BEHAVIOR.FADE_OUT]: {},
                                            [BEHAVIOR.ROTATION]: {
                                                speed: {
                                                    type: TYPE.FLOAT
                                                }
                                            },
                                        }
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

    const updateData = (data, additionalData) => {

        //let action      = data.action;
        //let safe        = action == ACTION_CREATE ||  action == ACTION_REMOVE;

        //rajActionManager.updateData(data, additionalData, safe);
        rajActionManager.updateData(data, additionalData);
    };

    //const createAction = (data, additionalData, safe) => {
    const createAction = (data, additionalData) => {

        //RajRandomElements.manageRandomElementInObjectIfExist(data);
        RajRandomElements.manageRandomElementInBehaviorIfExist(data.behavior);
        if (data.color) RajRandomElements.manageRandomElementInObjectIfExist(data.color);

        let id = data.id;

        let floatObject = new FloatObject();

        floatObject.init(data, additionalData);

        addFloatObject(id, floatObject);
    };

    //const removeAction = (data, additionalData, safe) => {
    const removeAction = (data, additionalData) => {
        let id = data.id;

        //if (!checkObjectExist(id)) {
        //    if (safe) errorReport(moduleData.fileName, "removeAction", "Object with id: " + id + " not exist!");
        //    return
        //}

        let floatObject = getById(id);

        floatObject.remove();

        //remove(id, safe);
        remove(id);
    };

    const updateAction = (oneData, additionalData) => {
        //if (!Engine.rajCase.checkFullFillCase(oneData.case)) return;

        let floatObject = getById(oneData.id);

        if (oneData.callInstantBehavior) {
            floatObject.setBreakBehavior(true);
            floatObject.setNewBehaviourData(oneData.callInstantBehavior);
        }

    };

    const remove = (id) => {
        let floatObject = getById(id);

        if (!floatObject) {
            warningReport(moduleData.fileName, "remove", `floatObject id: ${id} not exist!`) // TODO: change dir of floatObject
            return
        }


        if (floatObject.checkFadeOutWithOnRemove()) {

            let wraithData = {
                originalObject: floatObject,
                id: CanvasObjectTypeData.FLOAT_OBJECT + id,
                startAlpha: floatObject.getAlpha(),
                speed: 2,
                updateOriginalObject: true,
                checkUpdateOriginalObject: () => {
                    return !floatObject.getAllBehaviorFinished()
                }
            };
            Engine.wraithObjectManager.createWraithObject(wraithData);
        }

        removeFloatObject(id)
    }

    const updateBehavior = (data) => {
        let list = data.list;

        for (let k in list) {
            let floatObjectBehaviorData = list[k];
            let floatObjectId = floatObjectBehaviorData.id;
            let floatObject = getById(floatObjectId);

            if (!floatObject) continue;

            floatObject.setBreakBehavior(true);
            floatObject.setNewBehaviourData(floatObjectBehaviorData);
        }

    };

    const updateDataFloatObjectFromRayController = (v, additionalData) => {
        //const FUNC = "updateDataFloatObjectFromRayController";

        //if (!v instanceof Object) {
        //    errorReport(moduleData.fileName, FUNC, 'data have to be object!', v);
        //    return;
        //}
        //
        //if (!isset(v.list)) {
        //    errorReport(moduleData.fileName, FUNC, 'list attr  not exist!', v);
        //    return;
        //}

        if (rajActionManager.checkClearForObjectWithListActionId(v, additionalData)) {
            rajActionManager.clearDataForObjectWithListActionId(v, additionalData, this);
            return;
        }

        if (!rajActionManager.checkCorrectMainData(v, additionalData)) return;

        for (let k in v.list) {

            let data = v.list[k];
            if (!checkFloatObjectDataCorrect(data)) continue;

            updateData(data, additionalData);
        }

    };

    const checkFloatObjectDataCorrect = (data) => {

        const FUNC = "checkFloatObjectDataCorrect";

        //if (!isset(data.id)) {
        //    errorReport(moduleData.fileName, FUNC, 'id attr is obligatory!', data);
        //    return false
        //}
        //
        //if (!isset(data.action)) {
        //    errorReport(moduleData.fileName, FUNC, 'action attr is obligatory!', data);
        //    return false
        //}

        if (isset(data.gif)) {
            errorReport(moduleData.fileName, FUNC, 'gif attr is deprecated! Use kind attr with values "SPRITE" || "GIF" || "FAKE_NPC"', data);
        }

        //switch (data.action) {
        //    case ACTION_CREATE              : return checkActionCreate(data);
        //    case ACTION_CREATE_FORCE        : return checkActionCreate(data);
        //    case ACTION_CREATE_IF_NOT_EXIST : return checkActionCreate(data);
        //    case ACTION_REMOVE              : return true;
        //    case ACTION_REMOVE_IF_EXIST     : return true;
        //    case ACTION_UPDATE              : return true;
        //    default :
        //        errorReport(moduleData.fileName, FUNC, 'unregistered action!', data);
        //        return false;
        //}

        return true;
    };

    //const checkActionCreate = (data) => {
    //
    //    const FUNC = "checkActionCreate";
    //
    //if (!isset(data.url)) {
    //    errorReport(moduleData.fileName, FUNC, 'url attr is obligatory!', data);
    //    return false
    //}
    //
    //if (isset(data.offsetX) && !isIntVal(data.offsetX)) {
    //    errorReport(moduleData.fileName, FUNC, 'offsetX attr have to int val!', data);
    //    return false
    //}
    //
    //if (isset(data.offsetY) && !isIntVal(data.offsetY)) {
    //    errorReport(moduleData.fileName, FUNC, 'offsetX attr have to int val!', data);
    //    return false
    //}
    //
    //if (data.color) {
    //
    //    if (!elementIsObject(data.color)) {
    //        errorReport(moduleData.fileName, FUNC, 'color attr have to object!', data);
    //        return false;
    //    }
    //
    //    let c = data.color;
    //    if (isset(c.r) && isset(c.g) && isset(c.b)) {
    //        if (!checkRGBObject(moduleData.fileName, FUNC, c, data)) return false
    //    }
    //
    //    if (isset(c.a)) {
    //        if (!isFloatVal(data.color.a)) {
    //            errorReport(moduleData.fileName, FUNC, 'attr color.a have to double val!', data);
    //            return false;
    //        }
    //    }
    //
    //}
    //
    //if (!isset(data.behavior)) {
    //    errorReport(moduleData.fileName, FUNC, 'behavior attr is obligatory!', data);
    //    return false
    //}
    //
    //if (!elementIsObject(data.behavior)) {
    //    errorReport(moduleData.fileName, FUNC, 'behavior has to be object!', data);
    //    return false
    //}
    //
    //if (!isset(data.behavior.list)) {
    //    errorReport(moduleData.fileName, FUNC, 'behavior.list attr is obligatory!', data);
    //    return false
    //}
    //
    //if (!elementIsArray(data.behavior.list)) {
    //    errorReport(moduleData.fileName, FUNC, 'behavior.list attr has to be array!', data);
    //    return false
    //}
    //
    //    return true;
    //};

    const addFloatObject = (id, floatObject) => {
        list[id] = floatObject;
    };

    const removeFloatObject = (id) => {
        delete list[id];
    };

    const checkObjectExist = (id) => {
        return list[id] ? true : false;
    };

    const onClear = () => {
        clearList();
    };

    const getById = (id) => {
        if (!checkObjectExist(id)) {
            warningReport(moduleData, "getFloatObjectById", `floatObject ${id} not exist!`, list);
            return null;
        }

        return list[id];
    };

    const clearList = () => {
        list = {};
    };

    const update = (dt) => {
        for (let k in list) {
            list[k].update(dt);
        }
    };

    const getDrawableList = () => {
        let a = [];

        for (let k in list) {

            let floatObject = list[k];
            let f = floatObject.checkDrawRajObject;

            if (!f || f && f()) {
                a.push(floatObject);
            }

        }

        return a;
    };

    const clearAndRemoveCallback = () => {
        for (let id in list) {
            list[id].remove(id);
        }
        onClear();
    }

    this.init = init;
    this.update = update;
    this.onClear = onClear;
    this.clearAndRemoveCallback = clearAndRemoveCallback;
    //this.updateData                                 = updateData;
    this.updateDataFloatObjectFromRayController = updateDataFloatObjectFromRayController;
    this.getDrawableList = getDrawableList;
    this.remove = remove;
    this.getById = getById;
    this.checkObjectExist = checkObjectExist;
    this.updateBehavior = updateBehavior;

};