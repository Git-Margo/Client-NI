const RajSound = require('@core/raj/rajSound/RajSound.js');
const RajSoundData = require('@core/raj/rajSound/RajSoundData.js');
const RajGetSpecificData = require('@core/raj/RajGetSpecificData');
const RajActionData = require('@core/raj/rajAction/RajActionData');
const RajActionManager = require('@core/raj/rajAction/RajActionManager');

module.exports = function() {

    const moduleData = {
        fileName: "RajSoundManager.js"
    };
    let rajSoundList;
    let rajActionManager;

    const init = () => {
        clearRajSoundList();
        initRajActionsManager();
    };

    const initRajActionsManager = () => {

        const TYPE = RajActionData.TYPE;

        rajActionManager = new RajActionManager();
        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createRajSound,
                removeFunc: removePlayingRajSound,
                updateFunc: updateRajSound,
                checkExistFunc: checkRajSound,
                createRequire: {
                    repeat: {
                        type: TYPE.INT_OR_BOOL,
                        optional: true
                    },
                    url: {},
                    source: {
                        type: TYPE.OBJECT,
                        optional: true,
                        elementInObject: {
                            x: {
                                type: TYPE.INT_OR_GET_CHARACTER_DATA
                            },
                            y: {
                                type: TYPE.INT_OR_GET_CHARACTER_DATA
                            },
                            range: {
                                type: TYPE.NUMBER
                            },
                        }
                    }
                }
            },
            RajActionData.GROUP_NAME.OBJECT_WITH_LIST_ACTION_ID

        );

    };

    const updateData = (srajData, additionalData) => {
        if (!rajActionManager.checkCorrectMainData(srajData, additionalData)) return;

        let list = srajData.list;

        for (let k in list) {
            let oneRajSoundData = list[k];

            //if (!checkCorrectOneRajSoundData(oneRajSoundData)) continue;

            updateOneRajSoundData(oneRajSoundData, additionalData);
        }

    };

    //const checkCorrectOneRajSoundData = (data) => {
    //
    //    const funcName = "checkCorrectOneRajSoundData";
    //
    //    if(!isset(data.id)) {
    //        errorReport(moduleData.fileName, funcName, "Attr id is obligatory!", data);
    //        return false
    //    }
    //
    //    if(!isset(data.action)) {
    //        errorReport(moduleData.fileName, funcName, "Attr action is obligatory!", data);
    //        return false
    //    }
    //
    //    //if (!(data.action == RajSoundData.action.CREATE || data.action == RajSoundData.action.REMOVE || data.action == RajSoundData.action.UPDATE || data.action == RajSoundData.action.CREATE_IF_NOT_EXIST)) {
    //    //    errorReport(moduleData.fileName, funcName, "Possible value of action attr is CREATE, CREATE_IF_NOT_EXIST, REMOVE, UPDATE!", data);
    //    //    return false
    //    //}
    //
    //    if (!rajActionManager.checkPossibleAction(data.action)) return false;
    //
    //    if (isset(data.repeat) && !(isInt(data.repeat) || isBoolean(data.repeat))) {
    //        errorReport(moduleData.fileName, funcName, "Possible value of repeat attr is int or bool type!", data);
    //        return false
    //    }
    //
    //    //if (!isset(data.url) &&  data.action != RajSoundData.action.UPDATE) {
    //    if (!isset(data.url) && data.action != RajActionData.REMOVE) {
    //        errorReport(moduleData.fileName, funcName, "Attr url is obligatory!", data);
    //        return false
    //    }
    //
    //    if (isset(data.source)) {
    //        if (!elementIsObject(data.source)) {
    //            errorReport(moduleData.fileName, funcName, "Attr source have to be is object!", data);
    //            return false
    //        }
    //        if (!isset(data.source.x)) {
    //            errorReport(moduleData.fileName, funcName, "Attr source.x is obligatory!", data);
    //            return false
    //        }
    //        if (!isset(data.source.y)) {
    //            errorReport(moduleData.fileName, funcName, "Attr source.y is obligatory!", data);
    //            return false
    //        }
    //        if (!isset(data.source.range)) {
    //            errorReport(moduleData.fileName, funcName, "Attr source.range is obligatory!", data);
    //            return false
    //        }
    //        if (!isInt(data.source.x)) {
    //            if (!data.source.x.getCharacterData) {
    //                errorReport(moduleData.fileName, funcName, "Possible value of source.x attr is int type!", data);
    //                return false;
    //            }
    //        }
    //        if (!isInt(data.source.y)) {
    //            if (!data.source.y.getCharacterData) {
    //                errorReport(moduleData.fileName, funcName, "Possible value of source.y attr is int type!", data);
    //                return false;
    //            }
    //        }
    //        if (!isInt(data.source.range)) {
    //            errorReport(moduleData.fileName, funcName, "Possible value of source.range attr is int type!", data);
    //            return false;
    //        }
    //
    //    }
    //
    //
    //    return true;
    //};

    const updateOneRajSoundData = (oneRajSoundData, additionalData) => {

        //if (!Engine.rajCase.checkFullFillCase(oneRajSoundData.case)) return;

        rajActionManager.updateData(oneRajSoundData, additionalData);
    };

    const createRajSound = (oneRajSoundData, additionalData) => {
        let rajSound = new RajSound();

        let id = oneRajSoundData.id;

        addToRajSoundList(id, rajSound);

        if (isset(oneRajSoundData.source)) {
            oneRajSoundData.source.x = RajGetSpecificData.getCharacterData(oneRajSoundData.source.x, additionalData);
            oneRajSoundData.source.y = RajGetSpecificData.getCharacterData(oneRajSoundData.source.y, additionalData);
        }

        rajSound.init();
        rajSound.updateData(oneRajSoundData);
    };

    const updateRajSound = (oneRajSoundData, additionalData) => {
        let id = oneRajSoundData.id;
        let raySound = getRajSound(id);

        raySound.updateData(oneRajSoundData);
    }

    const removePlayingRajSound = (oneRajSoundData, additionalData) => {
        let id = oneRajSoundData.id;

        if (!Engine.soundManager.checkSrajSoundIsPlaying(id)) return;

        Engine.soundManager.finishPlayingSrajSound(id);
        removeRajSound(id);
    }

    const removeRajSound = (id) => {
        removeFromRajSoundList(id);
    };

    const getRajSound = (id) => {
        return rajSoundList[id];
    };

    const checkRajSound = (id) => {
        return getRajSound(id) ? true : false;
    };

    const addToRajSoundList = (id, rajSound) => {
        rajSoundList[id] = rajSound;
    };

    const removeFromRajSoundList = (id) => {
        delete rajSoundList[id];
    };

    const clearPlayingSound = () => {
        for (let id in rajSoundList) {
            //let soundId = rajSoundList[id].getSoundId();
            let soundId = rajSoundList[id].getId();
            if (!Engine.soundManager.checkSrajSoundIsPlaying(soundId)) continue;

            Engine.soundManager.finishPlayingSrajSound(soundId);
        }
    };

    const clearRajSoundList = () => {
        rajSoundList = {};
    };

    const update = (dt) => {
        for (let k in rajSoundList) {
            rajSoundList[k].update(dt);
        }
    };

    const onClear = () => {
        clearPlayingSound();
        clearRajSoundList();
    };

    this.init = init;
    this.update = update;
    this.removeRajSound = removeRajSound;
    this.updateData = updateData;
    this.onClear = onClear;
};