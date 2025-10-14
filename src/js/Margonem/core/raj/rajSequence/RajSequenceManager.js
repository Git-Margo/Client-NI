var RajSequence = require('@core/raj/rajSequence/RajSequence.js');
let RajActionData = require('@core/raj/rajAction/RajActionData');
let RajActionManager = require('@core/raj/rajAction/RajActionManager');
let RajGetSpecificData = require('@core/raj/RajGetSpecificData');

module.exports = function() {

    let sequenceList;
    let rajActionManager;
    let moduleData = {
        fileName: "SequenceManager.js"
    };

    //const ACTION_CREATE               = RajActionData.CREATE;
    //const ACTION_CREATE_IF_NOT_EXIST  = RajActionData.CREATE_IF_NOT_EXIST;

    const init = () => {
        sequenceList = {};
        initRajActionsManager();
    };

    this.getSequenceList = () => {
        return sequenceList;
    }

    const initRajActionsManager = () => {
        const TYPE = RajActionData.TYPE;

        rajActionManager = new RajActionManager();
        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                removeFunc: removeAction,
                checkExistFunc: checkSequenceExist,
                createRequire: {
                    behavior: {
                        type: TYPE.OBJECT,
                        elementInObject: {
                            repeat: {
                                type: TYPE.INT_OR_BOOL,
                                optional: true
                            },
                            list: {
                                type: TYPE.ARRAY,
                                elementInArray: {
                                    delayBefore: {
                                        type: TYPE.NUMBER,
                                        optional: true
                                    },
                                    duration: {
                                        type: TYPE.NUMBER,
                                        optional: true
                                    },
                                    external_properties: {
                                        type: TYPE.OBJECT
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

        if (!rajActionManager.checkCorrectMainData(data, additionalData)) return;

        let list = data.list;

        //if(!isset(list)) {
        //    errorReport(moduleData.fileName, "updateData", "Attr list is obligatory!", data);
        //    return false
        //}

        for (let k in list) {
            let oneSequenceData = list[k];
            //if (!checkOneSequenceDataCorrect(oneSequenceData)) continue;

            parseOneSequenceData(oneSequenceData, additionalData)
        }

    };

    //const checkOneSequenceDataCorrect = (data) => {
    //    const FUNC = "checkOneSequenceDataCorrect";
    //
    //    if (!isset(data.id)) {
    //        errorReport(moduleData.fileName, FUNC, "Attr id not exist!", data);
    //        return false
    //    }
    //
    //    if (!isset(data.action)) {
    //        errorReport(moduleData.fileName, FUNC, "action action not exist!", data);
    //        return false;
    //    }
    //
    //    if (data.action == ACTION_CREATE || data.action == ACTION_CREATE_IF_NOT_EXIST) {
    //
    //        if (!isset(data.behavior)) {
    //            errorReport(moduleData.fileName, FUNC, "attr behavior not exist!", data);
    //            return false;
    //        }
    //
    //        if (!isset(data.behavior.list)) {
    //            errorReport(moduleData.fileName, FUNC, "attr behavior.list not exist!", data);
    //            return false;
    //        }
    //
    //        if (isset(data.behavior.repeat) && !(isInt(data.behavior.repeat) || isBoolean(data.behavior.repeat))) {
    //            errorReport(moduleData.fileName, FUNC, "Possible value of repeat attr is int or bool type!", data);
    //            return false
    //        }
    //
    //        for (let i = 0; i < data.behavior.list.length; i++) {
    //            let oneBehavior = data.behavior.list[i];
    //
    //            if (isset(oneBehavior.delayBefore) && !isIntOrFloatVal(oneBehavior.delayBefore)) {
    //                errorReport(moduleData.fileName, FUNC, "Possible value of behavior[i].delayBefore attr is int or float type!", data);
    //                return false
    //            }
    //
    //            if (isset(oneBehavior.duration) && !isIntOrFloatVal(oneBehavior.duration)) {
    //                errorReport(moduleData.fileName, FUNC, "Possible value of behavior[i].duration attr is int or float type!", data);
    //                return false
    //            }
    //
    //            //if (isset(oneBehavior.repeat) && !(isInt(oneBehavior.repeat) || isBoolean(oneBehavior.repeat))) {
    //            if (isset(oneBehavior.repeat) && !isIntOrBool(oneBehavior.repeat)) {
    //                errorReport(moduleData.fileName, FUNC, "Possible value of behavior[i].repeat attr is int or bool type!", data);
    //                return false
    //            }
    //
    //            if(!isset(oneBehavior.external_properties)) {
    //                errorReport(moduleData.fileName, FUNC, "Attr behavior[i].external_properties is obligatory!", data);
    //                return false
    //            }
    //
    //        }
    //
    //    }
    //
    //    return true;
    //}

    const parseOneSequenceData = (oneSequenceData, additionalData) => {

        //if (!Engine.rajCase.checkFullFillCase(oneSequenceData.case)) return;

        //oneSequenceData.id  = RajGetSpecificData.getCharacterData(oneSequenceData.id, additionalData);

        rajActionManager.updateData(oneSequenceData, additionalData);
    };

    const createAction = (oneSequenceData, additionalData) => {

        createOneSequnce(oneSequenceData, additionalData);
    }

    const createOneSequnce = (oneSequenceData, additionalData) => {

        //if (!Engine.rajCase.checkFullFillCase(oneSequenceData.case)) return;

        //oneSequenceData.id  = RajGetSpecificData.getCharacterData(oneSequenceData.id, additionalData);
        let sequence = new RajSequence();
        let id = oneSequenceData.id;

        sequence.init();
        sequence.updateData(oneSequenceData, additionalData);

        addToSequenceList(sequence, id);
    };

    const addToSequenceList = (rajSequence, id) => {
        sequenceList[id] = rajSequence;
    };

    const checkSequenceExist = (id) => {
        if (sequenceList[id]) return true;

        return false;
    };

    const removeAction = (oneSequenceData, additionalData) => {

        //oneSequenceData.id  = RajGetSpecificData.getCharacterData(oneSequenceData.id, additionalData);

        //if (!Engine.rajCase.checkFullFillCase(oneSequenceData.case)) return;

        removeFromSequenceList(oneSequenceData.id);
    };

    const rajRemoveActionBeyondManager = (id, additionalData) => {
        removeAction({
            action: RajActionData.ACTION.REMOVE,
            id: id
        }, additionalData);
    }

    const clearSequenceList = () => {
        for (let k in sequenceList) {
            delete sequenceList[k];
        }
    };

    const removeFromSequenceList = (id) => {
        delete sequenceList[id];
    };

    const update = (dt) => {
        for (let k in sequenceList) {
            sequenceList[k].update(dt);
        }
    };

    const onClear = () => {
        clearSequenceList();
    };

    this.init = init;
    this.updateData = updateData;
    this.update = update;
    this.onClear = onClear;
    this.rajRemoveActionBeyondManager = rajRemoveActionBeyondManager;

}