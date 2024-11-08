let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
var EmotionsData = require('core/emotions/EmotionsData');
let NpcData = require('core/characters/NpcData');
let RajActionData = require('core/raj/rajAction/RajActionData');
let RajActionManager = require('core/raj/rajAction/RajActionManager');

module.exports = function() {

    let moduleData = {
        fileName: "RajEmoActions.js"
    };
    let rajActionManager = null;

    const ACTION_CREATE = RajActionData.ACTION.CREATE;
    const ACTION_REMOVE = RajActionData.ACTION.REMOVE;

    let npcActionsList;

    const init = () => {
        clearNpcActionsList();
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        rajActionManager = new RajActionManager();

        const TYPE = RajActionData.TYPE;

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                removeFunc: removeAction,
                createRequire: {
                    //target: {type: {name:TYPE.TARGET, option: [CanvasObjectTypeData.NPC]}}
                    //target: {
                    //    elementInObject: {
                    //        kind : {specificVal:[CanvasObjectTypeData.NPC, "THIS_NPC_INSTANCE"]},
                    //        id   : true
                    //    }
                    //},
                    target: {
                        type: {
                            name: TYPE.TARGET,
                            option: [RajActionData.TARGET_KIND.THIS_NPC_INSTANCE, CanvasObjectTypeData.NPC]
                        }
                    }
                }
            },
            RajActionData.GROUP_NAME.OBJECT_WITH_LIST_ACTION_NAME
        );
    };

    const clearNpcActionsList = () => {
        npcActionsList = {};
    };

    const updateData = (emoActionsData, additionalData) => {

        if (!rajActionManager.checkCorrectMainData(emoActionsData, additionalData)) return;

        let list = emoActionsData.list;
        for (let k in list) {
            let oneData = list[k];
            //callRajEmo(oneData, additionalData);
            rajActionManager.updateData(oneData, additionalData);
        }
    };

    //const callRajEmo = (data, additionalData) => {
    //    switch (data.target.kind) {
    //        case    CanvasObjectTypeData.NPC: callRajEmoNpc(data, additionalData); break;
    //        default :errorReport(moduleData.fileName, "getTarget", "unregistered target.kind")
    //    }
    //};
    //
    //const callRajEmoNpc = (data, additionalData) => {
    //
    //    //rajActionManager.updateData(data, npcId, emoName, npcSource);
    //    rajActionManager.updateData(data, additionalData);
    //};

    //const createAction = (data, npcId, emoName, npcSource) => {
    const createAction = (data, additionalData) => {

        //if (!Engine.rajCase.checkFullFillCase(data.case)) return;

        let emoName = data.name;
        let npcId = data.target.id;
        let npcSource = EmotionsData.OBJECT_TYPE.NPC;

        if (!checkOneNpcActionsList(npcId)) createOneNpcActionsList(npcId);

        if (!checkEmoNameExistOnOneNpcActionsList(npcId, emoName, ACTION_CREATE)) {
            addEmoNameToOneNpcActionsList(npcId, emoName, ACTION_CREATE);
        }

        if (checkEmoNameExistOnOneNpcActionsList(npcId, emoName, ACTION_REMOVE)) {
            removeEmoNameFromOneNpcActionsList(npcId, emoName, ACTION_REMOVE);
        }


        Engine.emotions.updateData([{
            name: emoName,
            source_id: npcId,
            source_type: npcSource
        }]);

        manageRefreshTip(npcId, emoName);
    }

    //const removeAction = (data, npcId, emoName) => {
    const removeAction = (data, additionaData) => {


        let emoName = data.name;
        let npcId = data.target.id;
        let npcSource = EmotionsData.OBJECT_TYPE.NPC;

        //if (!Engine.rajCase.checkFullFillCase(data.case)) return;
        if (!checkOneNpcActionsList(npcId)) createOneNpcActionsList(npcId);

        if (checkEmoNameExistOnOneNpcActionsList(npcId, emoName, ACTION_CREATE)) {
            removeEmoNameFromOneNpcActionsList(npcId, emoName, ACTION_CREATE);
        }

        if (!checkEmoNameExistOnOneNpcActionsList(npcId, emoName, ACTION_REMOVE)) {
            addEmoNameToOneNpcActionsList(npcId, emoName, ACTION_REMOVE);
        }

        Engine.emotions.deleteAllSourceEmo(npcId, emoName);

        manageRefreshTip(npcId, emoName);
    };

    const manageRefreshTip = (npcId) => {

        let npc = getEngine().npcs.getById(npcId);
        if (!npc) return;

        npc.createTipFromNpcData();
    };

    const deleteOneNpcActionsList = (npcId) => {
        if (!checkOneNpcActionsList(npcId)) return
        delete npcActionsList[npcId];
    };

    const createOneNpcActionsList = (npcId) => {
        npcActionsList[npcId] = {
            [ACTION_CREATE]: {},
            [ACTION_REMOVE]: {}
        };
    };

    const getRajEmoDefinitionsActionsFileNamesArrayToAddToTip = (npcId) => {
        let create = npcActionsList[npcId][ACTION_CREATE];
        let a = [];

        for (let emoName in create) {
            if (NpcData.BITS[emoName]) continue;
            if (EmotionsData.NAME.NORMAL_QUEST == emoName) continue;
            if (EmotionsData.NAME.DAILY_QUEST == emoName) continue;

            let fileName = getEngine().rajEmoDefinitions.getFilename(emoName);
            a.push(fileName);
            if (fileName == null) debugger;
        }

        return a;
    };

    const getClToAddToTip = (npcId) => {
        let create = npcActionsList[npcId][ACTION_CREATE];
        let a = [];

        for (let emoName in create) {
            if (!NpcData.BITS[emoName]) continue;
            if (EmotionsData.NAME.NORMAL_QUEST != emoName) continue;
            if (EmotionsData.NAME.DAILY_QUEST != emoName) continue;
            a.push(emoName);
        }

        return a;
    };

    const checkOneNpcActionsList = (npcId) => {
        return npcActionsList[npcId] ? true : false;
    };

    const checkOneNpcActionsListCreateAndRemoveEmpty = (npcId) => {
        return lengthObject(npcActionsList[npcId][ACTION_CREATE]) == 0 && lengthObject(npcActionsList[npcId][ACTION_REMOVE] == 0);
    };

    const checkEmoNameExistOnOneNpcActionsList = (npcId, emoName, action) => {
        return npcActionsList[npcId][action][emoName]
    };

    const addEmoNameToOneNpcActionsList = (npcId, emoName, action) => {
        npcActionsList[npcId][action][emoName] = true;
    };

    const removeEmoNameFromOneNpcActionsList = (npcId, emoName, action) => {
        return delete npcActionsList[npcId][action][emoName];
    };

    const getShowNotify = (npcId, emoName) => {
        if (checkOneNpcActionsListCreateAndRemoveEmpty(npcId)) return true;

        if (checkEmoNameExistOnOneNpcActionsList(npcId, emoName, ACTION_CREATE)) return true;
        if (checkEmoNameExistOnOneNpcActionsList(npcId, emoName, ACTION_REMOVE)) return false;

        return true;
    };

    const onClear = () => {
        clearNpcActionsList();
    };

    this.init = init;
    this.updateData = updateData;
    this.checkOneNpcActionsList = checkOneNpcActionsList;
    this.getShowNotify = getShowNotify;
    this.deleteOneNpcActionsList = deleteOneNpcActionsList;
    this.onClear = onClear;
    this.getRajEmoDefinitionsActionsFileNamesArrayToAddToTip = getRajEmoDefinitionsActionsFileNamesArrayToAddToTip;
    this.getClToAddToTip = getClToAddToTip;

};