var FakeNpc = require('@core/characters/FakeNpc');
//var FakeNpc 				= require('@core/characters/FakeNpc');
var FakeNpcData = require('@core/characters/FakeNpcData');
var RajData = require('@core/raj/RajData');
let RajRandomElements = require('@core/raj/RajRandomElements');
let RajActionData = require('@core/raj/rajAction/RajActionData');
let RajActionManager = require('@core/raj/rajAction/RajActionManager');
let RajGetSpecificData = require('@core/raj/RajGetSpecificData');

module.exports = function() {

    let moduleData = {
        fileName: "FakeNpcManager.js"
    };
    let fakeNpcList = {};
    let rajActionManager = null;

    //const ACTION_CREATE               	= RajActionData.CREATE;
    //const ACTION_CREATE_IF_NOT_EXIST  	= RajActionData.CREATE_IF_NOT_EXIST;
    //const ACTION_REMOVE               	= RajActionData.REMOVE;
    //const ACTION_REMOVE_IF_EXIST      	= RajActionData.REMOVE_IF_EXIST;

    const init = () => {
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        rajActionManager = new RajActionManager();

        const BEHAVIOR = FakeNpcData.behavior;
        const TYPE = RajActionData.TYPE;

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createFakeNpcAction,
                removeFunc: removeFakeNpcAction,
                checkExistFunc: checkFakeNpcListExist,
                updateFunc: updateFakeNpcAction,
                createRequire: {
                    x: {
                        type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                    },
                    y: {
                        type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                    },
                    img: true,
                    behavior: {
                        type: TYPE.OBJECT,
                        elementInObject: {
                            list: {
                                type: TYPE.ARRAY,
                                elementInArray: {
                                    name: {
                                        conditionVal: {
                                            [BEHAVIOR.IDLE]: {
                                                duration: {
                                                    type: TYPE.FLOAT,
                                                    optional: true
                                                },
                                                dir: {
                                                    specificVal: ["E", "S", "W", "N"],
                                                    optional: true
                                                }
                                            },
                                            [BEHAVIOR.WALK_START]: {},
                                            [BEHAVIOR.WALK]: {
                                                x: {
                                                    type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                                                },
                                                y: {
                                                    type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                                                }
                                            },
                                            [BEHAVIOR.TP]: {
                                                x: {
                                                    type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                                                },
                                                y: {
                                                    type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                                                }
                                            },
                                            [BEHAVIOR.TP_START]: {},
                                            [BEHAVIOR.WALK_AND_TP_START]: {
                                                x: {
                                                    type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                                                },
                                                y: {
                                                    type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                                                }
                                            },
                                        }
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
        //if (!checkCorrectData(data)) return;

        if (!rajActionManager.checkCorrectMainData(data, additionalData)) return;

        for (let i in data.list) {
            let oneData = data.list[i];

            //RajRandomElements.manageRandomElementInObjectIfExist(oneData);
            RajRandomElements.manageRandomElementInBehaviorIfExist(oneData.behavior);

            //if (!checkCorrectOneData(oneData)) continue;

            updateOneDataByAction(oneData, additionalData);
        }
    };

    const updateOneDataByAction = (oneData, additionalData) => {

        //oneData.id = RajGetSpecificData.getCharacterData(oneData.id, additionalData);

        rajActionManager.updateData(oneData, additionalData);

        //const FUNC_NAME 			= "checkCorrectData";
        //let id 			 			= oneData.id;
        //let action 		 			= oneData.action;
        //let fakeNpcExist 			= checkFakeNpcListExist(id);
        //
        //
        //if (action == ACTION_CREATE && fakeNpcExist) {
        //	errorReport(moduleData.fileName, FUNC_NAME, `can not create fakeNpc! fakeNpc with id ${id} already exist!`);
        //	return;
        //}
        //
        //if (action == ACTION_REMOVE && !fakeNpcExist) {
        //	errorReport(moduleData.fileName, FUNC_NAME, `can not remove fakeNpc! fakeNpc with id ${id} not exist!`);
        //	return;
        //}
        //
        //switch (action) {
        //	case ACTION_CREATE:
        //	case ACTION_CREATE_IF_NOT_EXIST:
        //		if (fakeNpcExist) return;
        //		createIfFullFillCase(oneData);
        //		break;
        //	case ACTION_REMOVE:
        //	case ACTION_REMOVE_IF_EXIST:
        //		if (!fakeNpcExist) return;
        //		removeIfFullFillCase(oneData);
        //		break;
        //}

    };

    const createFakeNpcAction = (oneData, additionalData) => {
        //if (!Engine.rajCase.checkFullFillCase(oneData.case)) return;

        //return createFakeNpc(oneData, additionalData);
        createFakeNpc(oneData, additionalData);
    };

    const removeFakeNpcAction = (oneData, additionalData) => {
        //if (!Engine.rajCase.checkFullFillCase(oneData.case)) return;

        removeFakeNpc(oneData.id, additionalData);
    };

    const updateFakeNpcAction = (oneData, additionalData) => {
        //if (!Engine.rajCase.checkFullFillCase(oneData.case)) return;

        let fakeNpc = getById(oneData.id);

        if (oneData.callInstantBehavior) {
            fakeNpc.setBreakBehavior(true);
            fakeNpc.setNewBehaviourData(oneData.callInstantBehavior);
        }

    };

    //const checkCorrectData = (data) => {
    //	const FUNC_NAME = "checkCorrectData";
    //
    //	if (!elementIsObject(data)) {
    //		errorReport(moduleData.fileName, FUNC_NAME, "Data have to be object!", data);
    //		return false;
    //	}
    //
    //	if (!isset(data.list)) {
    //		errorReport(moduleData.fileName, FUNC_NAME, "Attr list not exist!", data);
    //		return false;
    //	}
    //
    //	return true;
    //};

    //const checkCorrectOneData = (data) => {
    //	const FUNC_NAME = "checkCorrectOneData";
    //
    //	if (!isset(data.id)) {
    //		errorReport(moduleData.fileName, FUNC_NAME, "Attr id not exist!", data);
    //		return false;
    //	}
    //
    //	if (!isset(data.action)) {
    //		errorReport(moduleData.fileName, FUNC_NAME, "Attr action not exist!", data);
    //		return false;
    //	}
    //
    //
    //	if (data.action == ACTION_CREATE || data.action == ACTION_CREATE_IF_NOT_EXIST) {
    //
    //		if (!isset(data.x)) {
    //			errorReport(moduleData.fileName, FUNC_NAME, "Attr x not exist!", data);
    //			return false;
    //		}
    //
    //		if (!isset(data.y)) {
    //			errorReport(moduleData.fileName, FUNC_NAME, "Attr y not exist!", data);
    //			return false;
    //		}
    //
    //		if (!isset(data.img)) {
    //			errorReport(moduleData.fileName, FUNC_NAME, "Attr img not exist!", data);
    //			return false;
    //		}
    //
    //		if (!isset(data.behavior)) {
    //			errorReport(moduleData.fileName, FUNC_NAME, "Attr behavior not exist!", data);
    //			return false;
    //		}
    //
    //		if (!isset(data.behavior.list)) {
    //			errorReport(moduleData.fileName, FUNC_NAME, "Attr behavior.list not exist!", data);
    //			return false;
    //		}
    //
    //		for (let k in data.behavior.list) {
    //			if (!checkCorrectBehavior(data.behavior.list[k], data)) return false;
    //		}
    //
    //	}
    //
    //	return true;
    //};

    //const checkCorrectBehavior = (oneBehavior, data) => {
    //	const FUNC_NAME = "checkCorrectBehavior";
    //
    //	if (!isset(oneBehavior.name)) {
    //		errorReport(moduleData.fileName, FUNC_NAME, "Attr oneBehavior.name not exist!", data);
    //		return false;
    //	}
    //
    //	switch (oneBehavior.name) {
    //		case FakeNpcData.behavior.WALK :
    //		case FakeNpcData.behavior.TP :
    //		case FakeNpcData.behavior.WALK_AND_TP_START :
    //			if (!isset(oneBehavior.x)) {
    //				errorReport(moduleData.fileName, FUNC_NAME, "Attr oneBehavior.x not exist!", data);
    //				return false;
    //			}
    //			if (!isset(oneBehavior.y)) {
    //				errorReport(moduleData.fileName, FUNC_NAME, "Attr oneBehavior.y not exist!", data);
    //				return false
    //			}
    //	}
    //
    //	return true;
    //};

    const updateBehavior = (data) => {
        let list = data.list;

        for (let k in list) {
            let fakeNpcBehaviorData = list[k];
            let fakeNpcId = fakeNpcBehaviorData.id;

            let fakeNpc = getById(fakeNpcId);

            fakeNpc.setBreakBehavior(true);
            fakeNpc.setNewBehaviourData(fakeNpcBehaviorData);
        }

    };

    const createFakeNpc = (data, additionalData) => {
        let fakeNpc = new FakeNpc();
        let id = data.id;

        addToFakeNpcList(id, fakeNpc);
        fakeNpc.init();
        fakeNpc.updateDATA(data, $.extend(data, {
            id: id
        }), additionalData);

        //return fakeNpc;
    };

    const removeFakeNpc = (id) => {
        if (!checkFakeNpcListExist(id)) return;

        let instantFadeOut = fakeNpcList[id].getInstantFadeOut();
        if (!instantFadeOut) Engine.wraithCharacterManager.addWraith(fakeNpcList[id], RajData.FAKE_NPC + id);

        removeFromFakeNpcList(id);
    };

    const addToFakeNpcList = (id, data) => {
        fakeNpcList[id] = data;
    };

    const removeFromFakeNpcList = (id, data) => {
        if (!checkFakeNpcListExist(id)) return

        delete fakeNpcList[id];
    };

    const checkFakeNpcListExist = (id) => {
        return fakeNpcList[id] ? true : false
    };

    const update = (dt) => {
        if (Engine.hero.checkStasis()) return;
        for (var i in fakeNpcList) {
            fakeNpcList[i].update(dt)
        }
    };

    const draw = (ctx) => {
        if (Engine.hero.checkStasis()) return;
        for (var i in fakeNpcList) {
            fakeNpcList[i].draw(ctx)
        }
    };

    const getDrawableList = () => {
        var arr = [];
        for (var i in fakeNpcList) {

            let fakeNpc = fakeNpcList[i];
            let f = fakeNpc.checkDrawRajObject;

            if (!f || f && f()) {
                arr.push(fakeNpcList[i]);
            }

        }
        return arr;
    };

    const onClear = () => {
        fakeNpcList = {};
    };

    const getById = (id) => {
        return fakeNpcList[id];
    };

    const serveRayControllerData = () => {

    };

    const setFakeNpcAnimationState = () => {

    };

    const refreshFilter = () => {
        for (let id in fakeNpcList) {
            fakeNpcList[id].updateFilterImage();
        }
    }

    this.init = init;
    this.update = update;
    this.draw = draw;
    this.getDrawableList = getDrawableList;
    this.serveRayControllerData = serveRayControllerData;
    this.removeFakeNpc = removeFakeNpc;
    this.setFakeNpcAnimationState = setFakeNpcAnimationState;
    this.onClear = onClear;
    this.getById = getById;
    this.updateData = updateData;
    this.updateBehavior = updateBehavior;
    this.checkFakeNpcListExist = checkFakeNpcListExist;
    this.refreshFilter = refreshFilter;

};