let FramesWithHoles = require('@core/FramesWithHoles');
let DirDynamicLight = require('@core/night/DirDynamicLight.js');
//let RajData                 = require('@core/raj/RajData');
let RajActionData = require('@core/raj/rajAction/RajActionData');
let RajActionManager = require('@core/raj/rajAction/RajActionManager');
let CanvasObjectTypeData = require('@core/CanvasObjectTypeData');

module.exports = function() {

    let moduleData = {
        fileName: "DynamicDirCharacterLightsManager.js"
    };

    let framesWithHoles;
    let dynamicDirLightList = {};
    let rajActionManager;

    const ACTION_REMOVE = RajActionData.ACTION.REMOVE;

    const init = () => {
        framesWithHoles = new FramesWithHoles();
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        const TYPE = RajActionData.TYPE;


        let baseDir = {
            r: {
                type: TYPE.NUMBER,
                optional: true
            },
            gradientPercent1: {
                type: TYPE.NUMBER,
                optional: true
            },
            gradientPercent2: {
                type: TYPE.NUMBER,
                optional: true
            },
            offsetX: {
                type: TYPE.NUMBER,
                optional: true
            },
            offsetY: {
                type: TYPE.NUMBER,
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
            }
        };

        let otherDirections = GET_HARD_COPY_STRUCTURE(baseDir);

        otherDirections.cover = {
            type: TYPE.BOOL,
            optional: true
        };

        rajActionManager = new RajActionManager();
        rajActionManager.init(
            moduleData.fileName, {
                createFunc: rajCreateAction,
                removeFunc: rajRemoveAction,
                checkExistFunc: checkDirDynamicLight,
                createRequire: {
                    master: {
                        type: {
                            name: TYPE.TARGET,
                            option: [CanvasObjectTypeData.FAKE_NPC, CanvasObjectTypeData.HERO, CanvasObjectTypeData.PET]
                        }
                    },
                    d: {
                        type: TYPE.OBJECT,
                        elementInObject: {
                            base: {
                                type: TYPE.OBJECT,
                                elementInObject: baseDir
                            },
                            N: {
                                type: TYPE.OBJECT,
                                optional: true,
                                elementInObject: otherDirections
                            },
                            S: {
                                type: TYPE.OBJECT,
                                optional: true,
                                elementInObject: otherDirections
                            },
                            E: {
                                type: TYPE.OBJECT,
                                optional: true,
                                elementInObject: otherDirections
                            },
                            W: {
                                type: TYPE.OBJECT,
                                optional: true,
                                elementInObject: otherDirections
                            }
                        }
                    }
                }
            },
            RajActionData.GROUP_NAME.OBJECT_WITH_LIST_ACTION_ID
        );
    };

    const update = (dt) => {
        for (let k in dynamicDirLightList) {
            dynamicDirLightList[k].update(dt);
        }
    };

    const updateData = (rayData, additionalData) => {

        if (!rajActionManager.checkCorrectMainData(rayData, additionalData)) return;

        let list = rayData.list;

        for (let k in list) {

            let oneDirDynamicLightData = list[k];

            //if (!Engine.rajCase.checkFullFillCase(oneDirDynamicLightData.case)) continue;

            rajActionManager.updateData(oneDirDynamicLightData, additionalData);
        }
    };

    const rajCreateAction = (oneDirDynamicLightData, additionalData) => {
        const dirDynamicLight = new DirDynamicLight();
        const id = oneDirDynamicLightData.id;

        addDirDynamicLight(id, dirDynamicLight);
        dirDynamicLight.init();
        dirDynamicLight.updateData(id, oneDirDynamicLightData, additionalData);
    };

    const rajRemoveAction = (oneDirDynamicLightData) => {
        let id = oneDirDynamicLightData.id;

        let dirDynamicLight = getDirDynamicLight(id);
        let master = dirDynamicLight.getMaster();

        if (master) master.getObjectDynamicLightManager().removeDynamicDirCharacterLightId(id);

        removeDirDynamicLight(id)
    };

    const getFreeId = () => {
        let id = 0;
        while (dynamicDirLightList[id]) {
            id++;
        }
        return id;
    };

    const addDirDynamicLight = (id, dirDynamicLight) => {
        dynamicDirLightList[id] = dirDynamicLight;
    };

    const removeDirDynamicLight = (id) => {
        delete dynamicDirLightList[id];
    };

    const checkDirDynamicLight = (id) => {
        return dynamicDirLightList[id] ? true : false;
    };

    const getDirDynamicLight = (id) => {
        return dynamicDirLightList[id]
    }

    const getDirDynamicLightList = () => {
        return dynamicDirLightList;
    };

    const getFramesWithHoles = () => {
        return framesWithHoles;
    };

    const onClear = () => {
        dynamicDirLightList = {};
    };

    const rajRemoveActionBeyondManager = (id) => {
        rajRemoveAction({
            id: id,
            action: ACTION_REMOVE
        })
    };

    const refreshFilter = () => {
        for (let id in dynamicDirLightList) {
            //debugger;
            let lights = dynamicDirLightList[id].getAllLights();

            for (let k in lights) {
                let lightPoint = lights[k];
                if (lightPoint && lightPoint.light) {
                    lightPoint.light.updateFilterImage();
                }
            }

        }
    };

    const getDynamicDirLightByNpcIdArray = (warriorsObjData) => {
        let a = [];

        for (let k in dynamicDirLightList) {
            let oneDynamicDirLight = dynamicDirLightList[k];
            //if (oneExtraLight.master && oneExtraLight.master.kind == "NPC" && oneExtraLight.master.id == npcId) {

            let master = oneDynamicDirLight.getMaster();

            if (master && master.getCanvasObjectType() == "HERO") {

                let oneWarriorData = warriorsObjData[master.getId()];

                if (!oneWarriorData) continue;

                a.push({
                    warriorId: oneWarriorData.warriorId,
                    originalId: oneWarriorData.originalId,
                    dynamicDirLight: oneDynamicDirLight
                })
            }
        }

        return a;
    }

    this.init = init;
    this.update = update;
    this.updateData = updateData;
    this.getDirDynamicLightList = getDirDynamicLightList;
    this.onClear = onClear;
    this.getframesWithHoles = getFramesWithHoles;
    this.rajRemoveActionBeyondManager = rajRemoveActionBeyondManager;
    this.refreshFilter = refreshFilter;
    this.getDynamicDirLightByNpcIdArray = getDynamicDirLightByNpcIdArray;
}