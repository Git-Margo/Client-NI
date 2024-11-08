//var RajEventsData = require('core/raj/RajEventsData');
//var RajData                 = require('core/raj/RajData');
let RajActionData = require('core/raj/rajAction/RajActionData');
let RajActionManager = require('core/raj/rajAction/RajActionManager');
let RajWindowEventsData = require('core/raj/rajWindowEvents/RajWindowEventsData');

module.exports = function() {

    //let freeWindowEventId = 0;

    let moduleData = {
        fileName: "RajWindowEvents.js"
    };
    let events = {};
    let list = null;
    let rajActionManager = null;

    const init = () => {
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
                    windowName: true
                }
            },
            RajActionData.GROUP_NAME.OBJECT_WITH_LIST_ACTION_ID_NAME
        );

    };

    const clearList = () => {
        list = {};
    };

    //const getNewId = () => {
    //    let newId = freeWindowEventId;
    //    freeWindowEventId++;
    //
    //    return newId;
    //}

    const clearEvents = () => {
        //for (let k in RajData.event.WINDOW) {
        //    events[k] = [];
        //}

        events[RajWindowEventsData.ON_OPEN] = [];
        events[RajWindowEventsData.ON_UPDATE] = [];
        events[RajWindowEventsData.ON_FIRST_UPDATE] = [];
    };

    //const updateData = (windowEventsData) => {
    //    for (let eventName in windowEventsData) {
    //
    //        if (!events[eventName]) continue;
    //
    //        let oneData = windowEventsData[eventName];
    //
    //        if (!elementIsObject(oneData)) {
    //            errorReport("RajWindowEvents.js", "updateData", "Data is not object!", oneData);
    //            continue
    //        }
    //
    //        let windowName          = oneData.windowName;
    //        let external_properties = oneData.external_properties;
    //
    //        if (!windowName) {
    //            errorReport("RajWindowEvents.js", "updateData", "Attr windowName not exist!", oneData);
    //            continue
    //        }
    //
    //        if (!external_properties) {
    //            errorReport("RajWindowEvents.js", "updateData", "Attr external_properties not exist!", oneData);
    //            continue
    //        }
    //
    //        let id = getNewId()
    //
    //        addActionToEvent(eventName, windowName, external_properties, id);
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

        let eventName = data.name;
        let windowEventId = data.id;
        let windowName = data.windowName;
        let external_properties = data.external_properties;


        addActionToEvent(eventName, windowName, windowEventId, external_properties);
        addActionToList(windowEventId, data);
    };

    const removeAction = (data, additionalData) => {
        let eventName = data.name;
        let windowName = data.windowName;
        let windowEventId = data.id;

        removeActionFromEventsAndFromList(eventName, windowName, windowEventId);
    };

    const removeActionFromEventsAndFromList = (eventName, windowName, id) => {
        for (let windowEventId in list) {
            if (windowEventId == id) removeActionFromList(id);
        }

        removeActionFromEvent(eventName, windowName, id)
    };

    const callAllActionsBySpecificEventAndWindowName = (eventName, windowName) => {
        let allActionsSpecificEventOfWindow = events[eventName][windowName];

        if (!allActionsSpecificEventOfWindow) return;

        for (let id in allActionsSpecificEventOfWindow) {
            let oneRajAction = allActionsSpecificEventOfWindow[id];

            serveRayControllerData(oneRajAction);
            //removeActionFromEvent(eventName, windowName, id);
            removeActionFromEventsAndFromList(eventName, windowName, id);
        }
    };

    const removeActionFromEvent = (eventName, windowName, id) => {
        if (!isset(id)) {
            delete events[eventName][windowName];
            return
        }

        if (!events[eventName][windowName]) {
            errorReport("RajWindowEvents.js", "removeActionFromEvent", `windowName ${windowName} not exist`, events[eventName]);
            return;
        }

        if (!events[eventName][windowName][id]) {
            errorReport("RajWindowEvents.js", "removeActionFromEvent", `id ${id} not exist`, events[eventName][windowName]);
            return;
        }

        delete events[eventName][windowName][id];

        if (lengthObject(events[eventName][windowName]) == 0) delete events[eventName][windowName];
    }

    const checkObjectExist = (id) => {
        return list[id] ? true : false;
    };

    const addActionToList = (id, data) => {
        list[id] = data;
    };

    const removeActionFromList = (id) => {
        delete list[id];
    };

    const addActionToEvent = (eventName, windowName, windowEventId, rajData) => {
        if (!events[eventName][windowName]) events[eventName][windowName] = {};

        events[eventName][windowName][windowEventId] = rajData
    };

    const serveRayControllerData = (data) => {
        Engine.rajController.parseObject(data);
    };

    //const getEvents = () => {
    //    return events;
    //}

    const onClear = () => {
        clearList();
        clearEvents();
    };

    //const getList = () => list;


    //this.getEvents = getEvents;
    //this.getList = getList;
    this.init = init;
    this.updateData = updateData;
    this.onClear = onClear;
    //this.getEvents                                  = getEvents;
    this.callAllActionsBySpecificEventAndWindowName = callAllActionsBySpecificEventAndWindowName;

}