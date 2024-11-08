//var RajData                 = require('core/raj/RajData');
var RajMapEventsData = require('core/raj/rajMapEvents/RajMapEventsData');
let RajActionData = require('core/raj/rajAction/RajActionData');
let RajActionManager = require('core/raj/rajAction/RajActionManager');
let RajGetSpecificData = require('core/raj/RajGetSpecificData');


module.exports = function() {

    let moduleData = {
        fileName: "RajMapEvents.js"
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
        //const MAP   = RajData.event.MAP;

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
                        type: TYPE.INT_OR_GET_CHARACTER_DATA
                    },
                    name: {
                        specificVal: [RajMapEventsData.ON_DIE_NPC, RajMapEventsData.ON_RESPAWN_NPC]
                    }
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
        events[RajMapEventsData.ON_DIE_NPC] = {};
        events[RajMapEventsData.ON_RESPAWN_NPC] = {};

        //for (let k in RajData.event.MAP) {
        //    events[k] = {};
        //}
    };

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
        let npcId = data.npcId;
        let mapEventId = data.id;
        let external_properties = data.external_properties;

        //console.log('add npc', npcId);

        addActionToEvent(eventName, npcId, mapEventId, external_properties);
        addActionToList(mapEventId, data);
    };

    const removeAction = (data, additionalData) => {

        data.npcId = RajGetSpecificData.getCharacterData(data.npcId, additionalData);

        let eventName = data.name;
        let npcId = data.npcId;
        let battleEventId = data.id;

        removeActionFromEventsAndFromList(npcId, eventName, battleEventId);
    };

    const removeActionFromEventsAndFromList = (npcId, eventName, id) => {
        if (isset(id)) {

            if (checkObjectExist(id)) {
                removeActionFromList(id);
            }

        } else {

            for (let mapEventId in list) {
                let one = list[mapEventId];
                if (one.npcId == npcId) removeActionFromList(mapEventId);
            }

        }

        removeActionFromEvent(eventName, npcId, id)
    };

    const removeActionFromEvent = (eventName, npcId, id) => {
        if (!isset(id)) {
            delete events[eventName][npcId];
            return
        }

        delete events[eventName][npcId][id]
    };

    const checkObjectExist = (id) => {
        return list[id] ? true : false;
    };

    const callAllActionsBySpecificEventAndNpc = (eventName, additionalData) => {

        let npcId = additionalData.npcId;
        //{npcId:self.d.id}

        let allActionsSpecificEventOfNpc = events[eventName][npcId];

        if (!allActionsSpecificEventOfNpc) return;

        //console.log('call npc ',npcId)

        for (let actionIndex in allActionsSpecificEventOfNpc) {
            let oneRajAction = allActionsSpecificEventOfNpc[actionIndex];

            serveRayControllerData(oneRajAction, additionalData);
        }

        removeActionFromEventsAndFromList(npcId, eventName)
    };

    const addActionToList = (id, data) => {
        list[id] = data;
    };

    const removeActionFromList = (id) => {
        delete list[id];
    };

    const addActionToEvent = (eventName, warriorId, mapEventId, rajData) => {
        if (!events[eventName][warriorId]) events[eventName][warriorId] = {};

        events[eventName][warriorId][mapEventId] = rajData;
    };

    const serveRayControllerData = (data, additionalData) => {
        Engine.rajController.parseObject(data, [], additionalData);
    };

    const isPossibleCallMapEventsFromExternalProperties = (npcId) => {
        let externalProperties = Engine.npcs.getExternalProperties(npcId);

        if (externalProperties == null) return false;

        return true;
    };

    //const clearAllEventsByNpcId = (npcId) => {
    //    for (let eventName in events) {
    //        removeActionFromEvent(eventName, npcId);
    //    }
    //};

    const onClear = () => {
        clearList();
        clearEvents();
    };

    this.init = init;
    this.updateData = updateData;
    //this.isPossibleCallMapEventsFromExternalProperties      = isPossibleCallMapEventsFromExternalProperties;
    //this.clearAllEventsByNpcId                              = clearAllEventsByNpcId;
    this.callAllActionsBySpecificEventAndNpc = callAllActionsBySpecificEventAndNpc;
    this.onClear = onClear;


}