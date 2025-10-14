//let BehaviorDynamicLight      = require('@core/night/BehaviorDynamicLight');
let BehaviorDynamicLight = require('@core/night/BehaviorDynamicLight');
let RajActionData = require('@core/raj/rajAction/RajActionData');
let BehaviorDynamicLightData = require('@core/night/BehaviorDynamicLightData');
let RajActionManager = require('@core/raj/rajAction/RajActionManager');
let CanvasObjectTypeData = require('@core/CanvasObjectTypeData');


module.exports = function() {

    let moduleData = {
        fileName: "BehaviorDynamicLightsManager.js"
    };
    let behaviorDynamicLightList = {};
    let rajActionManager;

    const init = () => {
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        rajActionManager = new RajActionManager();

        const TYPE = RajActionData.TYPE;
        const BEHAVIOR = BehaviorDynamicLightData.behavior;

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                removeFunc: removeAction,
                checkExistFunc: checkBehaviorDynamicLight,
                createRequire: {
                    master: {
                        type: {
                            name: TYPE.TARGET,
                            option: [CanvasObjectTypeData.NPC, RajActionData.TARGET_KIND.THIS_NPC_INSTANCE, CanvasObjectTypeData.FAKE_NPC, CanvasObjectTypeData.HERO, CanvasObjectTypeData.PET]
                        },
                        optional: true
                    },
                    d: {
                        type: TYPE.OBJECT,
                        elementInObject: {
                            x: {
                                type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS_OR_MASTER
                            },
                            y: {
                                type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS_OR_MASTER
                            },
                            r: {
                                type: TYPE.FLOAT,
                                optional: true
                            },
                            gradientPercent1: {
                                type: TYPE.INT,
                                optional: true
                            },
                            gradientPercent2: {
                                type: TYPE.INT,
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
                            light: {
                                type: TYPE.OBJECT,
                                optional: true,
                                elementInObject: {
                                    r: {
                                        type: TYPE.INT,
                                        optional: true
                                    },
                                    color: {
                                        type: TYPE.RGBA_COLOR,
                                        optional: true
                                    },
                                    onlyNight: {
                                        type: TYPE.BOOL,
                                        optional: true
                                    }
                                }
                            },
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
                                            name: {
                                                conditionVal: {
                                                    [BEHAVIOR.IDLE]: {
                                                        duration: {
                                                            type: TYPE.FLOAT,
                                                            optional: true
                                                        }
                                                    },
                                                    //[BEHAVIOR.MOVE_FROM_VECTORS]: {
                                                    //
                                                    //},
                                                    [BEHAVIOR.MOVE_TO_CORDS]: {
                                                        x: {
                                                            type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                                                        },
                                                        y: {
                                                            type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                                                        }
                                                    },
                                                    [BEHAVIOR.FOLLOW]: {
                                                        x: {
                                                            type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                                                        },
                                                        y: {
                                                            type: TYPE.FLOAT_OR_GET_CHARACTER_DATA_OR_GET_RANDOM_ELEMENTS
                                                        }
                                                    },
                                                    [BEHAVIOR.TRANSITION]: {
                                                        duration: {
                                                            type: TYPE.FLOAT,
                                                            optional: true
                                                        },
                                                        light: {
                                                            type: TYPE.OBJECT,
                                                            optional: true
                                                        },
                                                        r: {
                                                            type: TYPE.INT,
                                                            optional: true
                                                        }
                                                    },
                                                    [BEHAVIOR.TRANSITION_AND_MOVE_TO_CORDS]: {
                                                        duration: {
                                                            type: TYPE.FLOAT,
                                                            optional: true
                                                        }
                                                    }
                                                }
                                            }
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

    const checkBehaviorDynamicLight = (id) => {
        return behaviorDynamicLightList[id] ? true : false
    };

    const addBehaviorDynamicLight = (id, behaviorDynamicLight) => {
        behaviorDynamicLightList[id] = behaviorDynamicLight;
    };

    const removeBehaviorDynamicLight = (id) => {
        delete behaviorDynamicLightList[id];
    };

    const update = (dt) => {
        for (let k in behaviorDynamicLightList) {
            behaviorDynamicLightList[k].update(dt);
        }
    };

    const updateData = (data, additionalData) => {

        if (rajActionManager.checkClearForObjectWithListActionId(data, additionalData)) {
            rajActionManager.clearDataForObjectWithListActionId(data, additionalData, this);
            return;
        }

        if (!rajActionManager.checkCorrectMainData(data, additionalData)) return;

        let list = data.list;

        for (let oneBehaviorDynamicLightData of list) {

            rajActionManager.updateData(oneBehaviorDynamicLightData, additionalData);

        }

    };

    const createAction = (oneBehaviorDynamicLightData, additionalData) => {

        let id = oneBehaviorDynamicLightData.id;
        let behaviorDynamicLight = new BehaviorDynamicLight();

        addBehaviorDynamicLight(id, behaviorDynamicLight);

        behaviorDynamicLight.init();
        behaviorDynamicLight.updateData(id, oneBehaviorDynamicLightData, additionalData);

    };

    const removeAction = (oneBehaviorDynamicLightData) => {
        const id = oneBehaviorDynamicLightData.id;

        let behaviorDynamicLight = getBehaviorDynamicLight(id);
        let master = behaviorDynamicLight.getMaster();

        if (master) master.getObjectDynamicLightManager().removeDynamicBehaviorLightId(id);

        removeBehaviorDynamicLight(id);
    };

    const getBehaviorDynamicLightList = () => {
        return behaviorDynamicLightList;
    };

    const getBehaviorDynamicLight = (id) => {
        return behaviorDynamicLightList[id]
    }

    const clearAndRemoveCallback = () => {
        for (let id in behaviorDynamicLightList) {
            this.rajRemoveActionBeyondManager(id);
        }
        onClear();
    };

    const onClear = () => {
        behaviorDynamicLightList = {};
    };

    const rajRemoveActionBeyondManager = (id) => {
        removeAction({
            action: RajActionData.ACTION.REMOVE,
            id: id
        });
    }

    const getBehaviorDynamicLightByNpcIdArray = (warriorsObjData) => {
        let a = []
        for (let k in behaviorDynamicLightList) {
            let oneBehaviorDynamicLight = behaviorDynamicLightList[k];
            //if (oneExtraLight.master && oneExtraLight.master.kind == "NPC" && oneExtraLight.master.id == npcId) {

            let master = oneBehaviorDynamicLight.getMaster();

            if (master && master.getCanvasObjectType() == "NPC") {

                let oneWarriorData = warriorsObjData[master.getId()];

                if (!oneWarriorData) continue;

                a.push({
                    warriorId: oneWarriorData.warriorId,
                    originalId: oneWarriorData.originalId,
                    behaviorDynamicLight: oneBehaviorDynamicLight
                })
            }
        }

        return a;
    }

    const refreshFilter = () => {
        for (let id in behaviorDynamicLightList) {
            let light = behaviorDynamicLightList[id].getLight();
            if (light) {
                light.updateFilterImage();
            }
        }
    }

    this.init = init;
    this.update = update;
    this.updateData = updateData;
    this.getBehaviorDynamicLightList = getBehaviorDynamicLightList;
    this.rajRemoveActionBeyondManager = rajRemoveActionBeyondManager;
    this.getBehaviorDynamicLightByNpcIdArray = getBehaviorDynamicLightByNpcIdArray;
    this.onClear = onClear;
    this.clearAndRemoveCallback = clearAndRemoveCallback;
    this.refreshFilter = refreshFilter;

};