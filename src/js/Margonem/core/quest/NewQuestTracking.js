let QuestTrackingStorage = require('core/quest/QuestTrackingStorage');
let QuestTrackingParser = require('core/quest/QuestTrackingParser');
let PointerTargetObject = require('core/quest/PointerTargetObject');
let QuestData = require('core/quest/QuestData');



module.exports = function() {

    let questTrackingData;

    let questTrackingParser;
    let questTrackingStorage;

    let trackingNpcs;
    let trackingNpcsCandidate;

    let activeTrackingQuest;

    let activeTrackingData;
    let allPointerTargetObjects;

    const init = () => {
        questTrackingParser = new QuestTrackingParser();
        questTrackingStorage = new QuestTrackingStorage();

        questTrackingStorage.init();

        setActiveTrackingQuest(null);
    };

    const getQuestTrackingDataWithoutSpecifTrack = (questIdObject) => {
        let a = [];

        if (!questTrackingData) {
            return a;
        }

        for (let index in questTrackingData) {
            let oneQuest = questTrackingData[index];

            if (questIdObject[oneQuest.questId]) {
                continue
            }

            a.push(oneQuest)
        }

        return a;
    };

    const updateData = (data) => {
        //debugger;
        //setQuestTrackingData(questTrackingParser.getParseData(data));
        //return

        if (checkShouldClearQuestTrackingData(data)) {
            setQuestTrackingData(null);
            //console.log('CLEAR QUEST_TRACKING_DATA');
            return;
        }

        let newData = questTrackingParser.getParseData(data);

        if (!newData.length) {
            setQuestTrackingData(null);
            //console.log('CLEAR QUEST_TRACKING_DATA');
            return;
        }

        let idObjectToRemove = getIdObjectToRemove(newData);
        let a = getQuestTrackingDataWithoutSpecifTrack(idObjectToRemove);
        let mergeArray = [...newData, ...a];

        setQuestTrackingData(mergeArray);
    };

    const checkShouldClearQuestTrackingData = (data) => {
        return elementIsArray(data) && data.length == 1 && data[0] == "*";
    }

    const getIdObjectToRemove = (newData) => {
        let objectToRemove = {};

        for (let k in newData) {
            let oneTrack = newData[k];
            objectToRemove[oneTrack.questId] = true;
        }

        return objectToRemove;
    };

    const setQuestTrackingData = (_questTrackingData) => {
        questTrackingData = _questTrackingData;
    };

    const setActiveTrackingQuest = (_activeTrackingQuest) => {
        activeTrackingQuest = _activeTrackingQuest
    };

    const startTrackingIfActiveTrackingQuestExist = () => {
        //if (!checkActiveTrackingQuestExist()) return;
        let questId = getActiveQuestTrackingInStorage();

        startTracking(questId);
    };

    const startTracking = (questId) => {
        //let oldQuestId          = activeTrackingQuest;
        //let trackQuestChange    = oldQuestId != questId;
        let trackingExist = checkTrackingExistFromTrackingData(questId);

        clearTracking();

        //if (trackQuestChange && !trackingExist) {
        //
        //}

        if (!trackingExist) return;

        setActiveTrackingQuest(questId);

        setActiveTrackingData(prepareActiveTrackingData());
        createTrackingNpcsCandidates();
        createTrackingNpcs();
        createAllPointerTargetObject();
        getEngine().quests.addHighlightsInQuestItems();

    };

    const createTrackingNpcsCandidates = () => {
        const TYPE = QuestData.TYPE

        let a = [TYPE.COLLECT, TYPE.KILL];

        for (let oneActiveTrack of activeTrackingData) {

            if (a.includes(oneActiveTrack.kind)) {
                trackingNpcsCandidate[oneActiveTrack.name2] = true
            }
        }

        //console.log(trackingNpcsCandidate)
    };

    const createTrackingNpcs = () => {

        if (!lengthObject(trackingNpcsCandidate)) return;

        let npcs = getEngine().npcs.check();

        for (let k in npcs) {
            let oneNpc = npcs[k];
            addNpcToTrackingNpcIfNpcCandidate(oneNpc);
        }

        //console.log(trackingNpcs)
    };

    const checkAddNpcAndAdd = (oneNpc) => {
        if (!checkActiveTrackingQuestExist()) return;

        addNpcToTrackingNpcIfNpcCandidate(oneNpc);
    }

    const checkRemoveNpcAndRemove = (oneNpc) => {
        if (!checkActiveTrackingQuestExist()) return;

        removeNpcFromTrackingNpcIfNpcCandidate(oneNpc);
    }

    const addNpcToTrackingNpcIfNpcCandidate = (oneNpc) => {
        if (!oneNpc.getNick) debugger;
        let nick = oneNpc.getNick();

        let id = oneNpc.getId();

        if (!trackingNpcsCandidate[nick]) return;

        if (!trackingNpcs[nick]) trackingNpcs[nick] = {};

        trackingNpcs[nick][id] = oneNpc;
    };

    const removeNpcFromTrackingNpcIfNpcCandidate = (oneNpc) => {
        let nick = oneNpc.getNick();
        let id = oneNpc.getId();

        if (!trackingNpcsCandidate[nick]) return;

        if (!trackingNpcs[nick]) {
            errorReport('asd', "!!!!!!!!!!", "!!!!!!");
            return;
        }

        if (trackingNpcs[nick][id]) {
            delete trackingNpcs[nick][id]
            if (!lengthObject(trackingNpcs[nick])) delete trackingNpcs[nick];
        }
    };

    const checkTrackingNpcExist = (nick) => {
        return trackingNpcs[nick] ? true : false;
    }

    const getNearTrackingNpc = (nick, x, y) => {
        let npcs = trackingNpcs[nick];

        let diff = 200;
        let nearNpc = null;

        for (let npcId in npcs) {
            let oneNpc = npcs[npcId];
            let npcX = oneNpc.getX();
            let npcY = oneNpc.getY();

            let _diff = Math.abs(npcX - x) + Math.abs(npcY - y);
            if (_diff < diff) {
                diff = _diff;
                nearNpc = oneNpc;
            }
        }

        return nearNpc;
    }

    const createAllPointerTargetObject = () => {
        for (let oneActiveTrack of activeTrackingData) {
            let pointerTargetObject = new PointerTargetObject();

            pointerTargetObject.init();
            pointerTargetObject.updateData(oneActiveTrack);

            allPointerTargetObjects.push(pointerTargetObject);
        }
    };

    const checkTrackingExistFromTrackingData = (questId) => {
        if (!questTrackingData) return false;

        //for (let oneTrackingData of questTrackingData) {
        for (let index in questTrackingData) {
            let oneTrackingData = questTrackingData[index];
            if (oneTrackingData.questId == questId) return true
        }

        return false;
    };

    const prepareActiveTrackingData = () => {
        let a = [];

        if (!questTrackingData) return a;

        for (let oneTrackingData of questTrackingData) {
            if (oneTrackingData.questId == activeTrackingQuest) a.push(oneTrackingData);
        }

        return a;
    };

    const checkActiveTrackingQuestExist = () => {
        return activeTrackingQuest != null;
    }

    const setActiveTrackingData = (_activeTrackingData) => {
        activeTrackingData = _activeTrackingData
    };

    const clearTrackingNpcs = () => {
        trackingNpcs = {};
    };

    const clearTrackingNpcsCandidate = () => {
        trackingNpcsCandidate = [];
    };

    const clearAllPointerTargetObjects = () => {
        if (!allPointerTargetObjects) {
            allPointerTargetObjects = [];
            return
        }

        for (let pointerTargetObject of allPointerTargetObjects) {
            pointerTargetObject.deleteArrowIfExist();
        }

        allPointerTargetObjects = [];
    }

    const stopTracking = () => {
        clearTracking()
    };

    const clearTracking = () => {
        clearAllPointerTargetObjects();
        clearTrackingNpcsCandidate();
        clearTrackingNpcs();
        clearHighlightTrackInItems();
        setActiveTrackingData(null);
        setActiveTrackingQuest(null);
    }

    const onClear = () => {

        clearTrackingNpcsCandidate();
        clearTrackingNpcs();

        //clearHighlightTrackInItems();
    };

    //const getDrawableList = () => {
    //    let a = [];
    //
    //    if (!allPointerTargetObjects) return a;
    //    for (let i = 0; i < allPointerTargetObjects.length; i++) {
    //        let e = allPointerTargetObjects[i];
    //        if (e.getEnable() && !e.getFulFilled()) {
    //            //a.push(e.getArrow());
    //            if (e.getDrawTable())   a.push(e.getTable());
    //            //else                    a.push(e.getTarget())
    //        }
    //    }
    //
    //    return a;
    //};

    const afterInterfaceStart = () => {
        if (questTrackingStorage.checkQuestTrackingId() === null) return;

        let questId = questTrackingStorage.getQuestTrackingId();
        let trackingExistInTrackingData = checkTrackingExistFromTrackingData(questId);

        if (!trackingExistInTrackingData) {
            getEngine().quests.refreshTrackQuestButtons();
            return;
        }

        startTracking(questId);

        getEngine().quests.refreshTrackQuestButtons();
    };

    const update = (dt) => {
        if (!allPointerTargetObjects) return;

        for (let i = 0; i < allPointerTargetObjects.length; i++) {
            allPointerTargetObjects[i].update(dt);
        }
    }

    const clearHighlightTrackInItems = () => {
        //let all$highlights = getEngine().heroEquipment.getAmountItemAll$highlights();
        //for (let k in all$highlights) {
        //    if (all$highlights[k].hasClass("track")) all$highlights[k].removeClass('track');
        //}
        if (getEngine().quests) getEngine().quests.clearHighlightQuestInItems();
        getEngine().heroEquipment.clearHighlightInItems(QuestData.HIGHLIGHT_CLASS.TRACK);
    };

    const saveActiveQuestTrackingInStorage = (questId) => {
        questTrackingStorage.setQuestTrackingId(questId);
    };

    const getActiveQuestTrackingInStorage = () => {
        return questTrackingStorage.getQuestTrackingId();
    };

    const setActiveQuestTrackingProcedure = (questId) => {

        saveActiveQuestTrackingInStorage(questId);

        if (questId == null) {
            stopTracking();
            return;
        }

        if (!checkTrackingExistFromTrackingData(questId)) {
            stopTracking();
            return;
        }

        startTracking(questId);
    };

    const deleteFromQuestTrackingDataIfExist = (questId) => {
        if (!questTrackingData) {
            return
        }

        for (let i = 0; i < questTrackingData.length; i++) {
            if (questTrackingData[i].questId != questId) {
                continue
            }

            deleteElementFromArray(i, questTrackingData);
            i--;
            //return
        }

    };

    const clearQuestTrackingDataAfterDie = () => {
        setQuestTrackingData(null);
    }

    this.init = init;
    this.checkTrackingNpcExist = checkTrackingNpcExist;
    this.getNearTrackingNpc = getNearTrackingNpc;
    //this.startTracking                              = startTracking;
    this.stopTracking = stopTracking;
    this.updateData = updateData;
    this.update = update;
    this.checkAddNpcAndAdd = checkAddNpcAndAdd;
    this.checkRemoveNpcAndRemove = checkRemoveNpcAndRemove;
    this.startTrackingIfActiveTrackingQuestExist = startTrackingIfActiveTrackingQuestExist;
    this.afterInterfaceStart = afterInterfaceStart;
    this.setActiveQuestTrackingProcedure = setActiveQuestTrackingProcedure;
    this.getActiveQuestTrackingInStorage = getActiveQuestTrackingInStorage;
    this.saveActiveQuestTrackingInStorage = saveActiveQuestTrackingInStorage;
    this.deleteFromQuestTrackingDataIfExist = deleteFromQuestTrackingDataIfExist;
    this.onClear = onClear
    this.clearQuestTrackingDataAfterDie = clearQuestTrackingDataAfterDie
};