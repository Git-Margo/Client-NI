const RajAreaTriggerData = require('@core/raj/rajAreaTrigger/RajAreaTriggerData.js');
const RajGetSpecificData = require('@core/raj/RajGetSpecificData');
//const RajRandomElements     = require('@core/raj/RajRandomElements');
const RajActionManager = require('@core/raj/rajAction/RajActionManager');
const RajActionData = require('@core/raj/rajAction/RajActionData');
const MapAreaCordTriggerData = require('@core/map/mapAreaCordTrigger/MapAreaCordTriggerData.js');

module.exports = function() {

    const moduleData = {
        fileName: "RajAreaTriggerManager.js"
    };
    let rajActionManager;


    const init = () => {
        initRajActionsManager();
    };


    const initRajActionsManager = () => {
        const TYPE = RajActionData.TYPE;
        const KIND = MapAreaCordTriggerData.kind;

        rajActionManager = new RajActionManager();
        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createRajAreaTrigger,
                removeFunc: removeRajAreaTrigger,
                checkExistFunc: getEngine().mapAreaCordTriggerManager.checkMapAreaTriggerById,
                createRequire: {
                    x: {
                        type: TYPE.INT_OR_GET_CHARACTER_DATA
                    },
                    y: {
                        type: TYPE.INT_OR_GET_CHARACTER_DATA
                    },
                    kind: {
                        specificVal: [KIND.ON_IN, KIND.ON_OUT],
                        optional: true
                    },
                    cols: {
                        type: TYPE.INT,
                        optional: true
                    },
                    rows: {
                        type: TYPE.INT,
                        optional: true
                    },
                    exceptionCords: {
                        type: TYPE.ARRAY,
                        optional: true
                    },
                    repeat: {
                        type: TYPE.INT_OR_BOOL,
                        optional: true
                    },
                    actionOnEachCord: {
                        type: TYPE.BOOL,
                        optional: true
                    },
                    external_properties: {
                        type: TYPE.OBJECT,
                        optional: true
                    },
                }
            },
            RajActionData.GROUP_NAME.OBJECT_WITH_LIST_ACTION_ID
        );

    };

    const updateData = (srajData, additionalData) => {

        if (!rajActionManager.checkCorrectMainData(srajData, additionalData)) return;

        let list = srajData.list;

        for (let k in list) {
            let oneRajAreaTriggerData = list[k];

            //RajRandomElements.manageRandomElementInObjectIfExist(oneRajAreaTriggerData);

            //if (!checkCorrectOneRajAreaTriggerData(oneRajAreaTriggerData)) continue;

            updateOneRajAreaTriggerData(oneRajAreaTriggerData, additionalData);
        }
    };

    //const checkCorrectOneRajAreaTriggerData = (data) => {
    //
    //    const FUNC = "checkCorrectOneRajAreaTriggerData";
    //
    //    //if(!isset(data.id)) {
    //    //    errorReport(moduleData.fileName, "checkCorrectOneRajAreaTriggerData", "Attr id is obligatory!", data);
    //    //    return false
    //    //}
    //    //
    //    //if(!isset(data.action)) {
    //    //    errorReport(moduleData.fileName, "checkCorrectOneRajAreaTriggerData", "Attr action is obligatory!", data);
    //    //    return false
    //    //}
    //
    //    //if (!(data.action == RajAreaTriggerData.action.CREATE || data.action == RajAreaTriggerData.action.REMOVE)) {
    //    //    errorReport(moduleData.fileName, "checkCorrectOneRajAreaTriggerData", "Possible value of action attr is CREATE, REMOVE!", data);
    //    //    return false
    //    //}
    //
    //    if (!rajActionManager.checkPossibleAction(data.action)) return false;
    //
    //    if (data.action == RajAreaTriggerData.action.REMOVE) return true;
    //
    //    if (isset(data.cols) && !isInt(data.cols)) {
    //        errorReport(moduleData.fileName, FUNC, "Possible value of cols attr is int type!", data);
    //        return false
    //    }
    //
    //    if (isset(data.rows) && !isInt(data.rows)) {
    //        errorReport(moduleData.fileName, FUNC, "Possible value of rows attr is int type!", data);
    //        return false
    //    }
    //
    //    if (isset(data.exceptionCords) && !elementIsArray(data.exceptionCords)) {
    //        errorReport(moduleData.fileName, FUNC, "Possible value of exceptionCords attr is array!", data);
    //        return false
    //    }
    //
    //    if (isset(data.repeat) && !(isInt(data.repeat) || isBoolean(data.repeat))) {
    //        errorReport(moduleData.fileName, FUNC, "Possible value of repeat attr is int or bool type!", data);
    //        return false
    //    }
    //
    //    if (isset(data.actionOnEachCord) && !isBoolean(data.actionOnEachCord)) {
    //        errorReport(moduleData.fileName, FUNC, "Possible value of repeat attr is boolean type!", data);
    //        return false
    //    }
    //
    //    if (!isset(data.external_properties)) {
    //        errorReport(moduleData.fileName, FUNC, "Attr external_properties is obligatory!", data);
    //        return false
    //    }
    //
    //
    //    return true;
    //};

    const updateOneRajAreaTriggerData = (oneRajAreaTriggerData, additionalData) => {
        //let id              = oneRajAreaTriggerData.id;
        //let action          = oneRajAreaTriggerData.action;

        //if (oneRajAreaTriggerData.case && !Engine.rajCase.checkFullFillCase(oneRajAreaTriggerData.case)) return;
        //if (!Engine.rajCase.checkFullFillCase(oneRajAreaTriggerData.case)) return;


        rajActionManager.updateData(oneRajAreaTriggerData, additionalData)

        //switch (action) {
        //    case RajAreaTriggerData.action.CREATE:
        //        createRajAreaTrigger(oneRajAreaTriggerData, additionalData);
        //        break;
        //    case RajAreaTriggerData.action.REMOVE:
        //        removeRajAreaTrigger(oneRajAreaTriggerData, additionalData);
        //        break;
        //    default :
        //        errorReport(moduleData, "updateOneRajAreaTriggerData", "unregistered action", action);
        //}
    };

    const checkCorrectOneRajAreaTrigger = () => {
        return true;
    };

    const createRajAreaTrigger = (oneRajAreaTriggerData, additionalData) => {

        oneRajAreaTriggerData.x = RajGetSpecificData.getCharacterData(oneRajAreaTriggerData.x, additionalData);
        oneRajAreaTriggerData.y = RajGetSpecificData.getCharacterData(oneRajAreaTriggerData.y, additionalData);

        oneRajAreaTriggerData.mapAreaTriggerCallback = function() {
            Engine.rajController.parseObject(oneRajAreaTriggerData.external_properties, false, additionalData);
        };

        Engine.mapAreaCordTriggerManager.updateData(oneRajAreaTriggerData)
    };

    const removeRajAreaTrigger = (oneRajAreaTriggerData) => {
        let id = oneRajAreaTriggerData.id;

        Engine.mapAreaCordTriggerManager.removeMapAreaTriggerById(id);
    };

    const onClear = () => {

    };

    this.init = init;
    this.updateData = updateData;
    this.onClear = onClear;

};