let RajActionData = require('@core/raj/rajAction/RajActionData');
let RajGetSpecificData = require('@core/raj/RajGetSpecificData');
let RajRandomElements = require('@core/raj/RajRandomElements');
let CanvasObjectTypeData = require('@core/CanvasObjectTypeData');

module.exports = function() {
    const moduleData = {
        fileName: "RajActionManager.js"
    };

    let parentModule = null;
    let kindOfSrajClass = null;
    let actions = {};

    const ACTION = RajActionData.ACTION;
    const ACTION_CREATE_FORCE = ACTION.CREATE_FORCE;
    const ACTION_CREATE = ACTION.CREATE;
    const ACTION_CREATE_IF_NOT_EXIST = ACTION.CREATE_IF_NOT_EXIST;
    const ACTION_REMOVE = ACTION.REMOVE;
    const ACTION_UPDATE = ACTION.UPDATE;
    const ACTION_REMOVE_IF_EXIST = ACTION.REMOVE_IF_EXIST;

    let createFunc = null;
    let removeFunc = null;
    let updateFunc = null;
    let checkExistFunc = null;
    let clearFunc = null;

    let createRequire = null;
    let createRequireFunc = null;
    let removeRequire = null;
    let mainDataRequire = null;


    let configurationType = null;

    const init = (_parentModule, dataActions, _kindOfSrajClass) => {
        setParentModule(_parentModule);
        if (_kindOfSrajClass) {
            setKindOfSrajClass(_kindOfSrajClass);
            getEngine().rajController.addSrajClass(_kindOfSrajClass, _parentModule);
        }

        setDataActions(dataActions);
    };

    //const checkCorrectConfigurationType = (_configurationType) => {
    //    const CONFIGURATION_TYPE = RajActionData.CONFIGURATION_TYPE;
    //
    //    switch (_configurationType) {
    //        case CONFIGURATION_TYPE.NORMAL_SRAJ:
    //        case CONFIGURATION_TYPE.NIGHT:
    //        case CONFIGURATION_TYPE.WEATHER:
    //        case CONFIGURATION_TYPE.SOUND:
    //            return true
    //        default : errorReport(moduleData.fileName, "checkCorrectConfigurationType", "_configurationType not exist!", _configurationType);
    //            return false
    //    }
    //}

    const setDataActions = (dataActions) => {
        const FUNC = "setDataActions";

        if (!dataActions) {
            return
        }

        if (dataActions.createFunc && dataActions.clearFunc) {
            let correct = !dataActions.removeFunc && !checkExistFunc;



            if (!correct) {
                errorReport(moduleData.fileName, FUNC, "With clearFunc i available only createFunc", dataActions);
                return
            }
        }

        if (dataActions.createFunc) {
            createFunc = dataActions.createFunc;
            actions[ACTION_CREATE] = true;
        }

        if (dataActions.createRequire) createRequire = dataActions.createRequire;

        if (dataActions.createRequireFunc) createRequireFunc = dataActions.createRequireFunc;

        if (dataActions.removeRequire) removeRequire = dataActions.removeRequire;

        if (dataActions.mainDataRequire) mainDataRequire = dataActions.mainDataRequire;

        if (dataActions.clearFunc) {
            clearFunc = dataActions.clearFunc;
            actions[ACTION_CREATE] = true;
        }

        if (dataActions.removeFunc) {
            removeFunc = dataActions.removeFunc;
            actions[ACTION_REMOVE] = true;
        }

        if (dataActions.updateFunc) {
            updateFunc = dataActions.updateFunc;
            actions[ACTION_UPDATE] = true;
        }

        if (dataActions.checkExistFunc) {
            checkExistFunc = dataActions.checkExistFunc;
            actions[ACTION_CREATE_FORCE] = true;
            actions[ACTION_CREATE_IF_NOT_EXIST] = true;
            actions[ACTION_REMOVE_IF_EXIST] = true;
        }

    };

    const setParentModule = (_parentModule) => {
        parentModule = _parentModule;
    };

    const setKindOfSrajClass = (_kindOfSrajClass) => {
        kindOfSrajClass = _kindOfSrajClass;
    };

    const getArrayOfAllAvailableActionNames = () => {
        let a = [];

        for (let name in actions) {
            a.push(name)
        }

        return a;
    };

    const checkUpdateDataCorrect = (data) => {
        const FUNC = "checkUpdateDataCorrect";

        if (!elementIsObject(data)) {
            errorReport(moduleData.fileName, FUNC, `first argument in updateData must be object {"action": ... } !!! in module ${parentModule}`, data);
            return false;
        }

        let actionName = data.action;

        if (!actionName) {
            errorReport(moduleData.fileName, FUNC, `attr action not exist in module ${parentModule}`, data);
            return false;
        }

        if (!checkActionExist(actionName)) {
            errorReport(moduleData.fileName, FUNC, `action ${actionName} not exist in module ${parentModule}. Available: `, getArrayOfAllAvailableActionNames());
            return false;
        }

        return true;
    };

    const checkCorrectMainData = (data, additionalData) => {
        const FUNC = "checkCorrectMainData";
        const GROUP_NAME = RajActionData.GROUP_NAME;
        const TYPE = RajActionData.TYPE;

        let result;

        switch (kindOfSrajClass) {
            case GROUP_NAME.OVERRIDE_OBJECT:
                result = elementIsObject(data);
                break;
            case GROUP_NAME.OVERRIDE_OBJECT_WITH_LIST:
            case GROUP_NAME.OBJECT_WITH_LIST_ACTION_NAME:
            case GROUP_NAME.OBJECT_WITH_LIST_ACTION_TARGET:
            case GROUP_NAME.OBJECT_WITH_LIST_ACTION_TARGET_ID:
            case GROUP_NAME.OBJECT_WITH_LIST_ACTION_ID:
            case GROUP_NAME.OBJECT_WITH_LIST_ACTION_ID_NAME:
                result = checkAttr(data, additionalData, {
                    list: {
                        type: TYPE.ARRAY
                    }
                }, data);
                break;
            case GROUP_NAME.OBJECT_WITH_OPTIONAL_LIST_ACTION_ID:
                result = checkAttr(data, additionalData, {
                    list: {
                        type: TYPE.ARRAY,
                        optional: true
                    }
                }, data);
                break;
            case GROUP_NAME.DEFINITIONS_OBJECT:
            case GROUP_NAME.DEFINITIONS_OBJECT_STORE:
                result = elementIsObject(data);
                break;
            case GROUP_NAME.INSTANT_CALL_OBJECT:
                result = true;
                break;
            default:
                errorReport(moduleData.fileName, FUNC, "incorrect kindOfSrajClass!", kindOfSrajClass, data);
                return false;
        }

        if (!result) {
            errorReport(moduleData.fileName, FUNC, `action in ${parentModule} failed!`, data, additionalData);
            return false;
        }

        if (!mainDataRequire) return true;

        return checkAttr(data, additionalData, mainDataRequire, data);
    };

    const checkCorrectOneData = (data, additionalData) => {
        const FUNC = "checkCorrectOneData";
        const TYPE = RajActionData.TYPE;
        const GROUP_NAME = RajActionData.GROUP_NAME;
        const VAL_OR_GET_RANDOM_ELEMENTS = TYPE.VAL_OR_GET_RANDOM_ELEMENTS


        switch (kindOfSrajClass) {
            case GROUP_NAME.OVERRIDE_OBJECT:
                return true;
            case GROUP_NAME.OVERRIDE_OBJECT_WITH_LIST:
                return true;
            case GROUP_NAME.OBJECT_WITH_LIST_ACTION_NAME:
                return checkAttr(data, additionalData, {
                    action: true,
                    name: {
                        type: VAL_OR_GET_RANDOM_ELEMENTS
                    }
                }, data);
            case GROUP_NAME.OBJECT_WITH_LIST_ACTION_TARGET:
                return checkAttr(data, additionalData, {
                    action: true,
                    target: {
                        type: TYPE.OBJECT
                    }
                }, data);
            case GROUP_NAME.OBJECT_WITH_LIST_ACTION_TARGET_ID:
                return checkAttr(data, additionalData, {
                    action: true,
                    target: {
                        type: TYPE.OBJECT,
                        id: true
                    }
                }, data);
            case GROUP_NAME.OBJECT_WITH_OPTIONAL_LIST_ACTION_ID:
            case GROUP_NAME.OBJECT_WITH_LIST_ACTION_ID:
                return checkAttr(data, additionalData, {
                    action: true,
                    id: true
                }, data);
            case GROUP_NAME.OBJECT_WITH_LIST_ACTION_ID_NAME:
                return checkAttr(data, additionalData, {
                    action: true,
                    id: true,
                    name: {
                        type: VAL_OR_GET_RANDOM_ELEMENTS
                    }
                }, data);
            case GROUP_NAME.DEFINITIONS_OBJECT:
            case GROUP_NAME.DEFINITIONS_OBJECT_STORE:
                return elementIsObject(data);
                //case GROUP_NAME.INSTANT_CALL_OBJECT:                return true;
            default:
                errorReport(moduleData.fileName, FUNC, "incorrect kindOfSrajClass!", kindOfSrajClass, data);
                return false;
        }
    };

    const checkClearForObjectWithListActionId = (data, additionalData) => {
        const GROUP_NAME = RajActionData.GROUP_NAME;

        if (!elementIsObject(data)) {
            return false;
        }

        if (kindOfSrajClass != GROUP_NAME.OBJECT_WITH_LIST_ACTION_ID) {
            return false;
        }

        return data.clear || data.clearAndRemoveCallback;
    }

    const clearDataForObjectWithListActionId = (data, additionalData, parentObject) => {
        if (data.clear && parentObject.onClear) {
            parentObject.onClear();
        }

        if (data.clearAndRemoveCallback && parentObject.clearAndRemoveCallback) {
            parentObject.clearAndRemoveCallback();
        }
    }

    const updateData = function() {
        const FUNC = "updateData";
        const GROUP_NAME = RajActionData.GROUP_NAME;

        let data = arguments[0];
        let additionalData = arguments[1];

        if (kindOfSrajClass) { // todo in future to remove!
            if (!checkCorrectOneData(data, additionalData)) {
                return
            }
        } else {
            debugger;
            errorReport(moduleData.fileName, FUNC, `!!!!!!!!!! SRAJ CLASS NOT ADD TO MODULE ${parentModule} !!!!`, data);
        }


        if (createFunc && clearFunc) {

            if (data.action) {
                warningReport(moduleData.fileName, FUNC, `action in module ${parentModule} is deprecated!`, data)
            }

            if (data.clear) {
                clearProcedure(arguments);
                return;
            }

            createProcedure(arguments);

            return
        }

        if (!checkUpdateDataCorrect(data)) {
            return;
        }

        let actionName = data.action;


        //if (kindOfSrajClass) {
        //    switch (kindOfSrajClass) {
        //        case GROUP_NAME.OBJECT_WITH_LIST_ACTION_TARGET : {
        //            data.target.id  = RajGetSpecificData.getCharacterData(data.target.id, additionalData);
        //            break;
        //        }
        //    }
        //}

        if (!checkExistFunc) {
            switch (actionName) {
                case ACTION_CREATE:
                    createProcedure(arguments);
                    break;
                case ACTION_REMOVE:
                    removeProcedure(arguments);
                    break;
                default:
                    errorReport(moduleData.fileName, FUNC, "unregistered action!", actionName);
                    break;
            }

            return
        }

        if (actionName == ACTION_CREATE_IF_NOT_EXIST || actionName == ACTION_REMOVE_IF_EXIST) { // todo in future to remove!
            warningReport(moduleData.fileName, FUNC, `action ${actionName} is deprecated! Use REMOVE or CREATE or CREATE_FORCE. Occurred in module ${parentModule}`, data);
        }

        if (!isset(data.id)) {
            errorReport(moduleData.fileName, FUNC, `attr id not exist in module ${parentModule}`, data);
            return;
        }

        data.id = RajGetSpecificData.getCharacterData(data.id, additionalData);

        let exist = checkExistFunc(data.id);

        switch (actionName) {
            case ACTION_CREATE:
                if (exist) {
                    if (getDebug(CFG.DEBUG_KEYS.SRAJ)) warningReport(moduleData.fileName, FUNC, `can not call CREATE action in module: ${parentModule} for id: ${data.id}, because already exist!`, data);
                    return;
                }
                createProcedure(arguments);
                break;
            case ACTION_REMOVE:
                if (!exist) {
                    if (getDebug(CFG.DEBUG_KEYS.SRAJ)) warningReport(moduleData.fileName, FUNC, `can not call REMOVE action in module: ${parentModule} for id: ${data.id}, because not exist!`, data);
                    return;
                }
                removeProcedure(arguments);
                break;
            case ACTION_CREATE_FORCE:
                if (exist) removeProcedure(arguments);
                createProcedure(arguments);
                break;
            case ACTION_CREATE_IF_NOT_EXIST:
                if (exist) return;
                createProcedure(arguments);
                break;
            case ACTION_REMOVE_IF_EXIST:
                if (!exist) return;
                removeProcedure(arguments);
                break;
            case ACTION_UPDATE:
                if (!exist) {
                    if (getDebug(CFG.DEBUG_KEYS.SRAJ)) errorReport(moduleData.fileName, FUNC, `can not call UPDATE action in module: ${parentModule} for id: ${data.id}, because not exist!`, data);
                    return;
                }
                updateProcedure(arguments);
                break;
        }

    };

    const createProcedure = (args) => {
        const FUNC = "createProcedure";

        let data = args[0];
        let additionalData = args[1];


        RajRandomElements.manageRandomElementInObjectIfExist(data);

        if (createRequire && !checkAttr(data, additionalData, createRequire, data)) {
            errorReport(moduleData.fileName, FUNC, `Create procedure in module ${parentModule} have incorrect data. Create procedure failed`, data);
            return;
        }

        if (createRequireFunc && !createRequireFunc(data, additionalData)) {
            errorReport(moduleData.fileName, FUNC, `Create procedure in module ${parentModule} have incorrect data. Create procedure failed`, data);
            return;

        }

        // if (!getEngine().rajCase.checkFullFillCase(data.case, additionalData)) {
        //     return;
        // }
        //
        // if (data.target) {
        //     if (data.target.kind == RajActionData.TARGET_KIND.THIS_NPC_INSTANCE) {
        //         data.target.kind = CanvasObjectTypeData.NPC;
        //         data.target.id = additionalData.npcId;
        //     }
        // }
        //
        //
        // createFunc.apply(null, args);


        createFuncCallback(args, data, additionalData);

        //if (srajObject && data.configurationType) {
        //if (srajObject) {

        //attachRajObject(srajObject);

        //if (data.configurationType && checkCorrectRajConfigurationType(data.configurationType)) {
        //    srajObject.setConfigurationType(data.configurationType);
        //}

        //if (isset(data.alwaysDraw)) {
        //    srajObject.setAlwaysDraw(data.alwaysDraw);
        //}

        //}
    };

    const createFuncCallback = (args, data, additionalData) => {
        if (!checkFullFillCase(data.case, additionalData)) {

            let raj = Engine.rajController;

            if (raj.getAddSrajToCaseQueue()) {
                raj.addToCaseSrajQueue({
                    callback: () => {
                        createFuncCallback(args, data, additionalData)
                    }
                });
            }
            return;
        }

        if (data.target) {
            fillNpcInstanceTarget(data, additionalData);
        }

        createFunc.apply(null, args);
    }

    const removeFuncCallback = (args, data, additionalData) => {
        if (!checkFullFillCase(data.case, additionalData)) {

            let raj = Engine.rajController;

            if (raj.getAddSrajToCaseQueue()) {
                raj.addToCaseSrajQueue({
                    callback: () => {
                        removeFuncCallback(args, data, additionalData)
                    }
                });
            }

            return;
        }

        if (data.target) {
            fillNpcInstanceTarget(data, additionalData);
        }

        removeFunc.apply(null, args);
    }

    const clearFuncCallback = (args, data, additionalData) => {
        if (!getEngine().rajCase.checkFullFillCase(data.case, additionalData)) {

            let raj = Engine.rajController;

            if (raj.getAddSrajToCaseQueue()) {
                raj.addToCaseSrajQueue({
                    callback: () => {
                        clearFuncCallback(args, data, additionalData)
                    }
                });
            }

            return;
        }

        clearFunc.apply(null, args);
    }

    const updateFuncCallback = (args, data, additionalData) => {
        if (!getEngine().rajCase.checkFullFillCase(data.case, additionalData)) {

            let raj = Engine.rajController;

            if (raj.getAddSrajToCaseQueue()) {
                raj.addToCaseSrajQueue({
                    callback: () => {
                        updateFuncCallback(args, data, additionalData)
                    }
                });
            }

            return;
        }

        updateFunc.apply(null, args);
    }

    const checkCorrectRajConfigurationType = (configurationType) => {
        const CONFIGURATION_TYPE = RajActionData.CONFIGURATION_TYPE;
        switch (configurationType) {
            case CONFIGURATION_TYPE.SOUND:
            case CONFIGURATION_TYPE.NIGHT:
            case CONFIGURATION_TYPE.WEATHER:
            case CONFIGURATION_TYPE.NORMAL_SRAJ:
                return true;
            default:
                errorReport(moduleData.fileName, "checkCorrectRajConfigurationType", "configurationType not exist", configurationType);
                return false
        }

    }

    const removeProcedure = (args) => {
        const FUNC = "removeProcedure";

        let data = args[0];
        let additionalData = args[1];

        if (removeRequire && !checkAttr(data, additionalData, createRequire, data)) {
            errorReport(moduleData.fileName, FUNC, `Remove procedure in module ${parentModule} have incorrect data. Remove procedure failed`, data);
            return;
        }

        // if (!getEngine().rajCase.checkFullFillCase(data.case, additionalData)) {
        //     return;
        // }
        //
        // if (data.target) {
        //     if (data.target.kind == RajActionData.TARGET_KIND.THIS_NPC_INSTANCE) {
        //         data.target.kind = CanvasObjectTypeData.NPC;
        //         data.target.id = additionalData.npcId;
        //     }
        // }
        //
        // removeFunc.apply(null, args);

        removeFuncCallback(args, data, additionalData);

    };

    const fillNpcInstanceTarget = (data, additionalData) => {
        if (data.target.kind == RajActionData.TARGET_KIND.THIS_NPC_INSTANCE) {
            data.target.kind = CanvasObjectTypeData.NPC;
            data.target.id = additionalData.npcId;
        }
    }

    const updateProcedure = (args) => {
        let data = args[0];
        let additionalData = args[1];

        if (!getEngine().rajCase.checkFullFillCase(data.case, additionalData)) {
            return;
        }

        updateFunc.apply(null, args);
    };

    const clearProcedure = (args) => {
        let data = args[0];
        let additionalData = args[1];

        // if (!getEngine().rajCase.checkFullFillCase(data.case, additionalData)) {
        //     return;
        // }
        //
        // clearFunc.apply(null, args);

        clearFuncCallback(args, data, additionalData);
    };

    const checkFullFillCase = (caseData, additionalData) => {
        return getEngine().rajCase.checkFullFillCase(caseData, additionalData)
    }

    const checkActionExist = (name) => {
        return actions[name] ? true : false
    };

    const checkPossibleAction = (action) => {

        let a = [ACTION_CREATE];

        if (removeFunc) a.push(ACTION_REMOVE);

        if (checkActionExist) {
            a.push(ACTION_CREATE_FORCE);
            a.push(ACTION_CREATE_IF_NOT_EXIST);
            a.push(ACTION_REMOVE_IF_EXIST);
        }

        if (updateFunc) a.push(ACTION_UPDATE);

        let possible = a.includes(action);
        if (!possible) errorReport(moduleData.fileName, "checkPossibleAction", `Action ${action} is not possible! Possible action:`, a);

        return possible;
    };

    const checkAttr = (data, additionalData, requireAttrData, context) => {
        const FUNC = "checkAttr";
        const TYPE = RajActionData.TYPE;

        if (!elementIsObject(data)) {
            errorReport(moduleData.fileName, FUNC, `data in module ${parentModule} have to be object!`, data, additionalData);
            return false
        }


        for (let reqKey in requireAttrData) {

            let oneRequire = requireAttrData[reqKey];

            if (oneRequire === true) {
                if (isset(data[reqKey])) continue;

                errorReport(moduleData.fileName, FUNC, `attr ${reqKey} in module ${parentModule} not exist!`, data, additionalData);
                return false
            }

            let oneAttrData = data[reqKey];

            if (oneRequire.optional && !isset(data[reqKey])) continue;

            let typeExist = oneRequire.type;

            if (!isset(data[reqKey])) {

                if (typeExist && oneRequire.type == TYPE.VAL_OR_GET_RANDOM_ELEMENTS && RajRandomElements.checkRandomElementsExist(data)) {
                    continue
                }

                if (typeExist && oneRequire.type == TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS_OR_MASTER && masterExist(context)) {
                    continue
                }

                errorReport(moduleData.fileName, FUNC, `attr ${reqKey} is obligatory!`, data, additionalData);
                return false;
            }

            if (typeExist) {
                let result = checkTypeRequire(data, additionalData, reqKey, oneRequire, oneAttrData, context);
                if (!result) return false;
            }

            if (oneRequire.specificVal) {
                let specifVal;
                if (!elementIsArray(oneRequire.specificVal)) specifVal = [oneRequire.specificVal];
                else specifVal = oneRequire.specificVal;

                if (!specifVal.includes(oneAttrData)) {
                    errorReport(moduleData.fileName, FUNC, `val: ${oneAttrData} of attr: ${reqKey} is incorect!`, {
                        "PossibleVals": specifVal,
                        "actualData": data
                    }, additionalData);
                    return false;
                }
            }

            if (oneRequire.specificFunc) {
                //let specifVal;
                //if (!elementIsArray(oneRequire.specificVal))    specifVal = [oneRequire.specificVal];
                //else                                            specifVal = oneRequire.specificVal;

                if (!oneRequire.specificFunc(oneAttrData)) {
                    errorReport(moduleData.fileName, FUNC, `val: ${oneAttrData} of attr: ${reqKey} is incorect!`, data, additionalData);
                    return false;
                }
            }


            if (oneRequire.conditionVal) {
                if (!oneRequire.conditionVal[oneAttrData]) {
                    errorReport(moduleData.fileName, FUNC, `val: ${oneAttrData} of attr: ${reqKey} is incorect!`, data, additionalData);
                    return false;
                }

                let result = checkAttr(data, additionalData, oneRequire.conditionVal[oneAttrData], context);
                if (!result) return false;
            }

            if (oneRequire.elementInObject) {
                let result = checkAttr(data[reqKey], additionalData, oneRequire.elementInObject, context);
                if (!result) return false;
            }

            if (oneRequire.elementInArray) {
                for (let oneArrayElement of data[reqKey]) {
                    let result = checkAttr(oneArrayElement, additionalData, oneRequire.elementInArray, context);
                    if (!result) return false;
                }
            }

        }

        return true;
    };

    const checkTypeRequire = (data, additionalData, reqKey, oneRequire, oneAttrData, context) => {
        let shouldCorrect = false;

        const FUNC = "checkTypeRequire";
        const TYPE = RajActionData.TYPE;
        const cGCD = RajGetSpecificData.checkGetCharacterData;
        const cREE = RajRandomElements.checkRandomElementsExist;

        if (elementIsObject(oneRequire.type)) {
            let name = oneRequire.type.name;
            let option = oneRequire.type.option;

            if (!name) {
                errorReport(moduleData.fileName, FUNC, "Programmer forgive declare name in createRequire type", oneRequire);
                return false
            }

            if (!option) {
                errorReport(moduleData.fileName, FUNC, "Programmer forgive declare option in createRequire type", oneRequire);
                return false
            }

            if (!elementIsArray(option)) {
                errorReport(moduleData.fileName, FUNC, "Programmer forgive declare option like array!", oneRequire);
                return false
            }

            switch (name) {
                case TYPE.TARGET:
                    if (!elementIsObject(oneAttrData)) {
                        errorReport(moduleData.fileName, FUNC, "target have to be object!", data);
                        return false;
                    }

                    if (!isset(oneAttrData.kind)) {
                        errorReport(moduleData.fileName, FUNC, "target have to be target.kind!", data);
                        return false;
                    }

                    let kind = oneAttrData.kind;

                    if (!option.includes(kind)) {
                        errorReport(moduleData.fileName, FUNC, "not allowed kind in target.kind", data);
                        return false;
                    }

                    let isMap = kind == CanvasObjectTypeData.MAP;

                    if (isMap) {
                        if (!isset(oneAttrData.x || oneAttrData.y)) {
                            errorReport(moduleData.fileName, FUNC, "target.kind:MAP have to target.x and target.y", data);
                            return false;
                        }

                        if (!isIntVal(oneAttrData.x) || !isIntVal(oneAttrData.y)) {
                            errorReport(moduleData.fileName, FUNC, "target.kind:MAP target.x and target.y have to integer!", data);
                            return false;
                        }

                        return true;
                    }


                    return RajGetSpecificData.getTargetObject(oneAttrData, additionalData);

                default:
                    errorReport(moduleData.fileName, FUNC, "UNDEFINED TYPE", oneRequire.type, data);
                    return false;
            }

        }

        switch (oneRequire.type) {
            case TYPE.VAL_OR_GET_RANDOM_ELEMENTS:
                break;
            case TYPE.ARRAY:
                if (!elementIsArray(oneAttrData)) shouldCorrect = TYPE.ARRAY;
                break;
            case TYPE.OBJECT:
                if (!elementIsObject(oneAttrData)) shouldCorrect = TYPE.OBJECT;
                break;
            case TYPE.NUMBER:
                if (!(isInt(oneAttrData) || isFloatVal(oneAttrData))) shouldCorrect = TYPE.NUMBER;
                break;
            case TYPE.INT:
                if (!isInt(oneAttrData)) shouldCorrect = TYPE.INT;
                break;
            case TYPE.BOOL:
                if (!isBoolean(oneAttrData)) shouldCorrect = TYPE.BOOL;
                break;
            case TYPE.INT_OR_BOOL:
                if (!(isInt(oneAttrData) || isBoolean(oneAttrData))) shouldCorrect = TYPE.INT_OR_BOOL;
                break;
            case TYPE.INT_OR_GET_CHARACTER_DATA:
                if (!(isInt(oneAttrData) || cGCD(oneAttrData) || cREE(data))) shouldCorrect = TYPE.INT_OR_GET_CHARACTER_DATA;
                break;
            case TYPE.INT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS:
                if (!(isInt(oneAttrData) || cGCD(oneAttrData) || cREE(data))) shouldCorrect = TYPE.INT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS;
                break;
            case TYPE.FLOAT:
                if (!isFloatVal(oneAttrData)) shouldCorrect = TYPE.FLOAT;
                break;
            case TYPE.FLOAT_OR_GET_RANDOM_ELEMENTS:
                if (!(isFloatVal(oneAttrData) || cGCD(oneAttrData) || cREE(data))) shouldCorrect = TYPE.FLOAT_OR_GET_RANDOM_ELEMENTS;
                break;
            case TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS:
                if (!(isFloatVal(oneAttrData) || cGCD(oneAttrData) || cREE(data))) shouldCorrect = TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS;
                break;
            case TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS_OR_MASTER:
                if (!(isFloatVal(oneAttrData) || cGCD(oneAttrData) || cREE(data))) shouldCorrect = TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS_OR_MASTER;
                break;
            case TYPE.RGB_COLOR:
                if (!checkRGBObject(parentModule, FUNC, oneAttrData, data)) shouldCorrect = TYPE.RGB_COLOR;
                break;
            case TYPE.RGBA_COLOR:
                if (!checkRGBAObject(parentModule, FUNC, oneAttrData, data)) shouldCorrect = TYPE.RGBA_COLOR;
                break;
            case TYPE.RGB_OR_RGBA_COLOR:
                if (!checkRGBOrRGBAObject(parentModule, FUNC, oneAttrData, data, true)) shouldCorrect = TYPE.RGB_OR_RGBA_COLOR;
                break;
            case TYPE.RGB_OR_RGBA_COLOR_OR_A:
                if (!checkRGBOrRGBAObject(parentModule, FUNC, oneAttrData, data, true)) shouldCorrect = TYPE.RGB_OR_RGBA_COLOR_OR_A;
                break;
            case TYPE.RGB_OR_RGBA_COLOR_GET_RANDOM_ELEMENTS:
                if (!checkRGBOrRGBAObject(parentModule, FUNC, oneAttrData, data) || cGCD(oneAttrData)) shouldCorrect = TYPE.RGB_OR_RGBA_COLOR_GET_RANDOM_ELEMENTS;
                break;
            default:
                errorReport(moduleData.fileName, FUNC, "UNDEFINED TYPE", oneRequire.type, data);
                return false;
        }

        if (shouldCorrect) {
            errorReport(moduleData.fileName, FUNC, `attr ${reqKey} in module ${parentModule} have to be ${shouldCorrect}!`, data);
            return false;
        }

        if (oneRequire.range) {
            let min = oneRequire.range[0];
            let max = oneRequire.range[1];

            if (oneAttrData < min) {
                errorReport(moduleData.fileName, FUNC, `attr ${reqKey} in module ${parentModule} have too small val! Min val have to be ${min}!`, data);
                return false
            }

            if (oneAttrData > max) {
                errorReport(moduleData.fileName, FUNC, `attr ${reqKey} in module ${parentModule} have too big val! Max val have to be ${max}!`, data);
                return false
            }
        }

        return true;
    }

    const registerObject = (object, objectKind) => {

    }

    const masterExist = (data) => {
        return isset(data.master);
    }

    this.init = init;
    this.checkPossibleAction = checkPossibleAction;
    this.checkCorrectMainData = checkCorrectMainData;
    this.updateData = updateData;
    this.getArrayOfAllAvailableActionNames = getArrayOfAllAvailableActionNames;
    this.checkClearForObjectWithListActionId = checkClearForObjectWithListActionId;
    this.clearDataForObjectWithListActionId = clearDataForObjectWithListActionId;
    //this.attachRajObject                    = attachRajObject;

};