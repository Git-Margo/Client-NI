//var RajEventsData = require('core/raj/RajEventsData');
//let RajData                 = require('core/raj/RajData');
let RajActionData = require('core/raj/rajAction/RajActionData');
let RajActionManager = require('core/raj/rajAction/RajActionManager');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
let RajGetSpecificData = require('core/raj/RajGetSpecificData');
let RajBattleEventsData = require('core/raj/rajBattleEvents/RajBattleEventsData');

module.exports = function() {

    let moduleData = {
        fileName: "RajBattleEvents.js"
    };
    let events = null;
    let list = null;
    let rajActionManager = null;

    const init = () => {
        //clear();
        clearList();
        clearEvents();
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        const TYPE = RajActionData.TYPE;
        //const NPC  = CanvasObjectTypeData.NPC

        rajActionManager = new RajActionManager();
        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                removeFunc: removeAction,
                checkExistFunc: checkObjectExist,
                createRequire: {
                    external_properties: {
                        type: TYPE.OBJECT
                    },
                    npcId: {
                        optional: true
                    },
                    //target : {
                    //    type: {name:TYPE.TARGET, option: ["THIS_NPC_INSTANCE"], optional: true}
                    //}
                }
            },
            RajActionData.GROUP_NAME.OBJECT_WITH_LIST_ACTION_ID_NAME
        );

    };

    const clearList = () => {
        list = {};
    };

    const clearEvents = () => {
        events = {};
        //for (let k in RajData.event.BATTLE) {
        //    events[k] = {};
        //}

        events[RajBattleEventsData.ON_START_FIGHT_WITH_NPC] = {};
        events[RajBattleEventsData.ON_DIE_NPC] = {};
    };

    //const updateData = (battleEventsData, additionalData) => {
    //    for (let eventName in battleEventsData) {
    //
    //        if (!events[eventName]) continue;
    //
    //        addActionToEvent(eventName, additionalData.npcId, battleEventsData[eventName]);
    //    }
    //};

    const updateData = (data, additionalData) => {

        if (!rajActionManager.checkCorrectMainData(data, additionalData)) return;

        for (let i in data.list) {
            let oneData = data.list[i];

            rajActionManager.updateData(oneData, additionalData);

        }
    };

    const createAction = (data, additionalData) => {

        data.npcId = RajGetSpecificData.getCharacterData(data.npcId, additionalData);

        let eventName = data.name;
        let warriorId = data.npcId;
        let battleEventId = data.id;
        let external_properties = data.external_properties;


        addActionToEvent(eventName, warriorId, battleEventId, external_properties);
        addActionToList(battleEventId, data);
    };

    const removeAction = (data, additionalData) => {

        data.npcId = RajGetSpecificData.getCharacterData(data.npcId, additionalData);

        let eventName = data.name;
        let warriorId = data.npcId;
        let battleEventId = data.id;

        removeActionFromEventsAndFromList(eventName, warriorId, battleEventId);
    };

    const removeActionFromEventsAndFromList = (warriorId, eventName, id) => {
        if (isset(id)) {

            if (checkObjectExist(id)) {
                removeActionFromList(id);
            }

        } else {

            for (let battleEventId in list) {
                let one = list[battleEventId];
                if (one.npcId == warriorId) removeActionFromList(battleEventId);
            }

        }

        removeActionFromEvent(eventName, warriorId, id)
    };

    const removeActionFromEvent = (eventName, warriorId, id) => {
        if (!isset(id)) {
            delete events[eventName][warriorId];
            return
        }

        delete events[eventName][warriorId][id]
    };

    const checkObjectExist = (id) => {
        return list[id] ? true : false;
    };

    //const callAllActionsBySpecificEvent = (eventName) => {
    //
    //    let allWarriorsWithSpecificEvent = events[eventName];
    //
    //    if (!lengthObject(allWarriorsWithSpecificEvent)) return;
    //
    //    for (let warriorId in allWarriorsWithSpecificEvent) {
    //        callAllActionsBySpecificEventAndWarrior(eventName, warriorId);
    //    }
    //};

    const callAllActionsBySpecificEventAndWarrior = (eventName, warriorId) => {

        let allActionsSpecificEventOfWarrior = events[eventName][warriorId];

        if (!allActionsSpecificEventOfWarrior) return;

        for (let actionIndex in allActionsSpecificEventOfWarrior) {
            let oneRajAction = allActionsSpecificEventOfWarrior[actionIndex];

            serveRayControllerData(oneRajAction);
        }

        removeActionFromEventsAndFromList(warriorId, eventName);
    };

    const addActionToList = (id, data) => {
        list[id] = data;
    };

    const removeActionFromList = (id) => {
        delete list[id];
    };

    const addActionToEvent = (eventName, warriorId, battleEventId, rajData) => {
        if (!events[eventName][warriorId]) events[eventName][warriorId] = {};

        events[eventName][warriorId][battleEventId] = rajData;
    };

    const serveRayControllerData = (data) => {
        Engine.rajController.parseObject(data);
    };

    const testData = () => {

        return {
            "ON_START_FIGHT_WITH_NPC": {
                "tutorial": {
                    "textPc": "use skill",
                    "textMobile": "use skill",
                    "headerPc": "use skill",
                    "headerMobile": "use skill",
                    "graphic": "/img/gui/newTutorial/8.gif",
                    "blink": true,
                    "onFinish": {
                        "require": [{
                            "useBattleSkill": -1
                        }]
                    }
                }
            }
        }
    };

    //const getEvents = () => {
    //    return events;
    //}

    const isPossibleCallBattleEventsFromExternalProperties = (warrior) => {
        if (!warrior.npc) return false;

        let _originalId = warrior.getOriginalId();
        let externalProperties = Engine.npcs.getExternalProperties(_originalId);

        if (externalProperties == null) return false;

        return true;
    }

    const onClear = () => {
        clearList();
        clearEvents();
    };

    this.init = init;
    this.updateData = updateData;
    this.callAllActionsBySpecificEventAndWarrior = callAllActionsBySpecificEventAndWarrior;
    this.onClear = onClear;
    this.isPossibleCallBattleEventsFromExternalProperties = isPossibleCallBattleEventsFromExternalProperties;
    //this.clear      = clear;
    //this.getEvents      = getEvents;
    //this.testData      = testData;
    //this.callAllActionsBySpecificEvent      = callAllActionsBySpecificEvent;

}