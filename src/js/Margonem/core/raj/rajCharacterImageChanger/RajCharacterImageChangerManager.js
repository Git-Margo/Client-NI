const CanvasObjectTypeData = require('core/CanvasObjectTypeData');
const RajCharacterImageGraphic = require('core/raj/rajCharacterImageChanger/RajCharacterImageGraphic');
const RajCharacterImageChangerData = require('core/raj/rajCharacterImageChanger/RajCharacterImageChangerData');
const RajActionData = require('core/raj/rajAction/RajActionData');
//const FloatObjectData               = require('core/floatObject/FloatObjectData');
const RajMapEventsData = require('core/raj/rajMapEvents/RajMapEventsData');
const RajActionManager = require('core/raj/rajAction/RajActionManager');
//const RajGetSpecificData            = require('core/raj/RajGetSpecificData');

module.exports = function() {

    let moduleData = {
        fileName: "RajCharacterImageChangerManager.js"
    };
    let list = null;
    let rajActionManager = null;
    let characterHide = null;
    let events = null;
    let characterImageGraphicsList = null;



    const init = () => {
        onClear();
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        rajActionManager = new RajActionManager();

        const TYPE = RajActionData.TYPE;
        const ORDER_DATA_KIND = RajCharacterImageChangerData.ORDER_DATA_KIND;
        const KIND = RajCharacterImageChangerData.KIND;

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                removeFunc: removeAction,
                checkExistFunc: checkDataExist,
                createRequire: {
                    kind: {
                        specificVal: [KIND.ON_RESPAWN, KIND.ON_DIE, KIND.AFTER_DIE],
                        optional: true
                    },
                    target: {
                        type: {
                            name: TYPE.TARGET,
                            option: [CanvasObjectTypeData.NPC, RajActionData.TARGET_KIND.THIS_NPC_INSTANCE]
                        }
                    },
                    behind: {
                        type: TYPE.BOOL,
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
                    repeat: {
                        type: TYPE.INT_OR_BOOL,
                        optional: true
                    },
                    characterShow: {
                        type: TYPE.BOOL,
                        optional: true
                    },
                    order: {
                        optional: true,
                        elementInObject: {
                            kind: {
                                specificVal: [ORDER_DATA_KIND.MAP_OBJECT, ORDER_DATA_KIND.FLOAT_OBJECT],
                                optional: true
                            },
                            v: {
                                type: TYPE.FLOAT,
                                optional: true
                            }
                        }
                    }
                }
            },
            RajActionData.GROUP_NAME.OBJECT_WITH_LIST_ACTION_TARGET_ID
        );
    };

    const updateData = (data, additionalData) => {

        if (!rajActionManager.checkCorrectMainData(data, additionalData)) {
            return;
        }

        let _list = data.list;

        for (let k in _list) {

            let oneData = _list[k];
            rajActionManager.updateData(oneData, additionalData);
        }

    };

    const clearCharacterHide = () => {
        characterHide = {
            NPC: {}
        };
    };

    const clearEvents = () => {
        const KIND = RajCharacterImageChangerData.KIND;

        events = {};
        events[KIND.ON_RESPAWN] = {};
        events[KIND.ON_DIE] = {};
        events[KIND.AFTER_DIE] = {};
    };

    const setCharacterHide = (id, kind, state) => {
        characterHide[kind][id] = state;
    };

    const getCharacterHide = (kind, id) => {

        if (!characterHide[kind]) {
            errorReport(moduleData.fileName, "getCharacterHide", "kind not exist!")
            return false;
        }

        return characterHide[kind][id];
    }

    const createAction = (data, additionalData) => {

        let id = data.id;

        addDataToList(id, data, additionalData);
        addToEvents(data);
    };

    const addToEvents = (data) => {
        let _list = data.list;
        let id = data.id;
        let npcId = data.target.id;

        const KIND = RajCharacterImageChangerData.KIND;

        for (let index in _list) {
            let kind = _list[index].kind;
            //let eventId     = createId(id, index);

            if (![KIND.ON_RESPAWN, KIND.ON_DIE, KIND.AFTER_DIE].includes(kind)) {
                errorReport(moduleData, 'addToEvents', 'incorrect kind', data);
                continue
            }

            //addEvent(kind, npcId, eventId);
            addEvent(kind, npcId, id);
        }

    };

    const removeFromEvents = (data) => {
        let _list = data.list;
        let id = data.id;
        let npcId = data.target.id;

        const KIND = RajCharacterImageChangerData.KIND;

        for (let index in _list) {
            let kind = _list[index].kind;
            //let eventId     = createId(id, index);

            if (![KIND.ON_RESPAWN, KIND.ON_DIE, KIND.AFTER_DIE].includes(kind)) {
                errorReport(moduleData, 'addToEvents', 'incorrect kind', data);
                continue
            }

            //removeFromEvent(kind, npcId, eventId);
            removeFromEvent(kind, npcId, id);
        }
    }

    const addEvent = (kind, npcId, id) => {
        if (!events[kind][npcId]) {
            events[kind][npcId] = {};
        }

        events[kind][npcId][id] = true;
    };

    const removeFromEvent = (kind, npcId, id) => {
        const FUNC = "removeFromEvent";

        if (!events[kind]) {
            errorReport(moduleData.fileName, FUNC, `kind ${kind} event not exist`, kind);
            return
        }

        if (!events[kind][npcId]) {
            errorReport(moduleData.fileName, FUNC, `npcId ${npcId} not exist`, events[kind]);
            return
        }

        if (!events[kind][npcId][id]) {
            errorReport(moduleData.fileName, FUNC, `id ${id} rajCharacterImage not exist`, events[kind][npcId]);
            return
        }

        delete events[kind][npcId][id]
    };

    const removeAction = (data, additionalData) => {
        let id = data.id;
        let characterImageChanger = getById(id);
        let npcId = characterImageChanger.data.target.id;

        removeCharacterImageGraphicByCharacterImageChangerId(id);
        removeFromEvents(characterImageChanger.data);
        setCharacterHide(npcId, CanvasObjectTypeData.NPC, false);

        remove(id);
    };

    const removeCharacterImageGraphicByCharacterImageChangerId = (id) => {
        let characterImageChanger = getById(id);

        let _list = characterImageChanger.data.list;

        for (let k in _list) {

            let idToRemove = createId(id, k);

            if (!checkCharacterImageGraphic(idToRemove)) {
                continue;
            }

            removeFromCharacterImageGraphicList(idToRemove);
        }
    };

    const onClear = () => {
        clearCharacterImageGraphicsList();
        clearList();
        clearCharacterHide();
        clearEvents();
    };

    const checkDataExist = (id) => {
        return list[id] ? true : false;
    };

    const addDataToList = (id, data, additionalData) => {
        list[id] = {
            id: id,
            data: data,
            additionalData: additionalData
        }
    };

    const removeDataFromList = (id) => {
        delete list[id];
    };

    const getById = (id) => {
        if (!checkDataExist(id)) {
            warningReport(moduleData, "getById", `characterImageChanger ${id} not exist!`, list);
            return null;
        }

        return list[id];
    };

    const clearCharacterImageGraphicsList = () => {
        characterImageGraphicsList = {};
    }

    const clearList = () => {
        list = {};
    };

    const remove = (id) => {
        let data = getById(id);

        if (!data) {
            warningReport(moduleData.fileName, "remove", `rajCharacterImageChanger id: ${id} not exist!`)
            return
        }

        removeDataFromList(id)
    };

    const callAllActionsBySpecificEventAndNpc = (eventName, additionalData) => {

        let npcId = additionalData.npcId;
        let allActionsSpecificEventOfNpc = events[eventName][npcId];

        if (!allActionsSpecificEventOfNpc) return;

        let npc = getEngine().npcs.getById(npcId);
        //let pos               = {
        //    x: npc.getX(),
        //    y: npc.getY()
        //};


        for (let characterImageChangerId in allActionsSpecificEventOfNpc) {
            createAllRajCharacterImageGraphics(characterImageChangerId, npc, eventName, additionalData);

            //serveRayControllerData(oneRajAction, additionalData);
        }
    };

    const createId = (characterImageChangerId, indexInList) => {
        return characterImageChangerId + "_" + indexInList;
    }

    const createAllRajCharacterImageGraphics = (characterImageChangerId, npc, eventName, additionalData) => {

        let data = getById(characterImageChangerId);
        let _list = data.data.list;

        for (let k in _list) {

            let oneData = _list[k];

            if (eventName != oneData.kind) {
                continue;
            }

            let id = createId(characterImageChangerId, k);

            removeOldCharacterImageGraphicsByEventName(eventName, characterImageChangerId, npc);

            let rajCharacterImageGraphic = createRajCharacterImageGraphic(eventName);

            rajCharacterImageGraphic.updateData(id, characterImageChangerId, oneData, npc, additionalData);

            addToCharacterImageGraphicsList(id, rajCharacterImageGraphic);

        }
    };

    const removeOldCharacterImageGraphicsByEventName = (eventName, characterImageChangerId, parent) => {

        switch (eventName) {
            //case "ON_RESPAWN":
            case RajCharacterImageChangerData.KIND.ON_RESPAWN:
                removeExistAfterDieImageGraphic(characterImageChangerId, parent);

        }

    }

    const removeExistAfterDieImageGraphic = (characterImageChangerId, parent) => {
        let index = getIndexEventFromListByIdCharacterImage(characterImageChangerId, RajCharacterImageChangerData.KIND.AFTER_DIE)

        if (index == null) {
            return
        }

        let idAfterDie = createId(characterImageChangerId, index);

        let characterImageGraphicsAfterDie = getCharacterImageGraphic(idAfterDie);

        if (!characterImageGraphicsAfterDie) {
            return;
        }

        removeFromCharacterImageGraphicList(idAfterDie);


        let hide = checkHideObject(parent);

        if (!hide) {
            return
        }

        let idParent = parent.getId();
        let canvasObjectType = parent.getCanvasObjectType();

        if (!idParent) {
            return;
        }

        setCharacterHide(idParent, canvasObjectType, false);

    }

    const getIndexEventFromListByIdCharacterImage = (characterImageChangerId, eventName) => {
        let oneCharacterImageData = getById(characterImageChangerId);
        if (!oneCharacterImageData) {
            return null;
        }

        let eventList = oneCharacterImageData.data.list;

        let index = null;

        for (let i = 0; i < eventList.length; i++) {
            if (eventList[i].kind == eventName) {
                return i;
            }
        }

        return null;
    }

    const createRajCharacterImageGraphic = (eventName) => {
        const rajCharacterImageGraphic = new RajCharacterImageGraphic();

        const KIND = RajCharacterImageChangerData.KIND;
        const drawTargetKinds = [KIND.ON_RESPAWN, KIND.ON_DIE, KIND.AFTER_DIE];
        const drawTarget = drawTargetKinds.includes(eventName);

        rajCharacterImageGraphic.init(drawTarget);


        return rajCharacterImageGraphic;
    }

    const addToCharacterImageGraphicsList = (id, rajCharacterImageGraphic) => {
        characterImageGraphicsList[id] = rajCharacterImageGraphic;
    }

    const removeCharacterImageGraphic = (id) => {

        if (!checkCharacterImageGraphic(id)) {
            return
        }

        let characterImageGraphic = getCharacterImageGraphic(id);
        let parentId = characterImageGraphic.getParentId();
        let kind = characterImageGraphic.getKind();
        let target = characterImageGraphic.getTarget();

        removeFromCharacterImageGraphicList(id);

        const ON_DIE = RajCharacterImageChangerData.KIND.ON_DIE;

        if (kind == ON_DIE) {
            let data = getById(parentId);
            callOnAfterDieBySpecificEventAndNpc(target, data.additionalData);
        }

    }

    const callOnAfterDieBySpecificEventAndNpc = (target, additionalData) => {

        const AFTER_DIE = RajCharacterImageChangerData.KIND.AFTER_DIE;
        const npcId = target.getId();
        const allActionsOfAfterDieOfNpc = events[AFTER_DIE][npcId];

        if (!allActionsOfAfterDieOfNpc) {
            return;
        }

        for (let characterImageChangerId in allActionsOfAfterDieOfNpc) {
            createAllRajCharacterImageGraphics(characterImageChangerId, target, AFTER_DIE, additionalData);
        }
    };

    const checkCharacterImageGraphic = (id) => {
        return characterImageGraphicsList[id] ? true : false;
    };

    const getCharacterImageGraphic = (id) => {
        return characterImageGraphicsList[id];
    };

    const removeFromCharacterImageGraphicList = (id) => {
        delete characterImageGraphicsList[id];
    };

    const serveRayControllerData = (data, additionalData) => {
        Engine.rajController.parseObject(data, [], additionalData);
    };


    const getDrawableList = () => {
        let a = [];

        for (let k in characterImageGraphicsList) {
            a.push(characterImageGraphicsList[k]);
        }

        return a;
    };

    const update = (dt) => {
        for (let k in characterImageGraphicsList) {
            characterImageGraphicsList[k].update(dt)
        }
    }

    const checkHideObject = (obj) => {
        let canvasObjectType = characterHide[obj.canvasObjectType];

        if (!canvasObjectType) {
            return
        }

        return canvasObjectType[obj.getId()] ? true : false;
    }

    this.init = init;
    this.updateData = updateData;
    this.setCharacterHide = setCharacterHide;
    this.callAllActionsBySpecificEventAndNpc = callAllActionsBySpecificEventAndNpc;
    this.getDrawableList = getDrawableList;
    this.removeCharacterImageGraphic = removeCharacterImageGraphic;
    this.checkHideObject = checkHideObject;
    this.update = update;
    this.onClear = onClear;
};