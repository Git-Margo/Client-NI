let IconEffect = require('@core/characterEffects/IconEffect');
let TintEffect = require('@core/characterEffects/TintEffect');
let TextEffect = require('@core/characterEffects/TextEffect');
let CharacterEffectsData = require('@core/characterEffects/CharacterEffectsData');
let RajRandomElements = require('@core/raj/RajRandomElements');
let RajActionData = require('@core/raj/rajAction/RajActionData');
let RajActionManager = require('@core/raj/rajAction/RajActionManager');
let RajGetSpecificData = require('@core/raj/RajGetSpecificData');
let CanvasObjectTypeData = require('@core/CanvasObjectTypeData');
let BFD = require('@core/battle/battleEffects/BattleEffectsData');

module.exports = function() {

    let rajActionManager = null;
    let list = {};
    let moduleData = {
        fileName: "CharacterEffectsMapManager.js"
    };

    const ACTION_CREATE = RajActionData.ACTION.CREATE;
    const ACTION_CREATE_IF_NOT_EXIST = RajActionData.ACTION.CREATE_IF_NOT_EXIST;

    const init = () => {
        initRajActionsManager()
    };

    const initRajActionsManager = () => {
        const TYPE = RajActionData.TYPE;
        const EFFECT = CharacterEffectsData.effect;
        const POSITION = BFD.params.position;

        const KIND = CharacterEffectsData.TINT_KIND;

        rajActionManager = new RajActionManager();

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createCharacterEffectFromData,
                removeFunc: removeCharacterEffectFromData,
                checkExistFunc: checkCharacterEffectExist,
                createRequire: {
                    target: {
                        type: {
                            name: TYPE.TARGET,
                            option: [RajActionData.TARGET_KIND.THIS_NPC_INSTANCE, CanvasObjectTypeData.NPC, CanvasObjectTypeData.FAKE_NPC, CanvasObjectTypeData.HERO]
                        }
                    },
                    effect: {
                        conditionVal: {
                            [EFFECT.ANIMATION]: {
                                params: {
                                    type: TYPE.OBJECT,
                                    elementInObject: {
                                        duration: {
                                            type: TYPE.NUMBER,
                                            optional: true
                                        },
                                        repeat: {
                                            type: TYPE.INT_OR_BOOL,
                                            optional: true
                                        },
                                        delayBefore: {
                                            type: TYPE.NUMBER,
                                            optional: true
                                        },
                                        delayAfter: {
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
                                        opacity: {
                                            type: TYPE.FLOAT,
                                            optional: true
                                        },
                                        gifUrl: {},
                                        behind: {
                                            type: TYPE.BOOL,
                                            optional: true
                                        },
                                        speechBubble: {
                                            type: TYPE.BOOL,
                                            optional: true
                                        },
                                        position: {
                                            specificVal: [POSITION.TOP, POSITION.RIGHT, POSITION.BOTTOM, POSITION.LEFT, POSITION.CENTER]
                                        }
                                    }
                                }
                            },
                            [EFFECT.TINT]: {
                                params: {
                                    type: TYPE.OBJECT,
                                    elementInObject: {
                                        duration: {
                                            type: TYPE.NUMBER
                                        },
                                        repeat: {
                                            type: TYPE.INT_OR_BOOL,
                                            optional: true
                                        },
                                        delayBefore: {
                                            type: TYPE.NUMBER,
                                            optional: true
                                        },
                                        delayAfter: {
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
                                        opacity: {
                                            type: TYPE.FLOAT,
                                            optional: true
                                        },
                                        color: {
                                            type: TYPE.RGBA_COLOR
                                        },
                                        tintPercent: {
                                            type: TYPE.NUMBER,
                                            optional: true
                                        },
                                        kind: {
                                            specificVal: [KIND.SHOW_AND_HIDE, KIND.SHOW_AND_STICK, KIND.HIDE],
                                            optional: true
                                        }
                                    }
                                }
                            },
                            [EFFECT.TEXT]: {
                                params: {
                                    type: TYPE.OBJECT,
                                    elementInObject: {
                                        duration: {
                                            type: TYPE.NUMBER,
                                            optional: true
                                        },
                                        repeat: {
                                            type: TYPE.INT_OR_BOOL,
                                            optional: true
                                        },
                                        delayBefore: {
                                            type: TYPE.NUMBER,
                                            optional: true
                                        },
                                        delayAfter: {
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
                                        text: {
                                            type: TYPE.ARRAY
                                        },
                                        color: {
                                            type: TYPE.RGB_COLOR,
                                            optional: true
                                        },
                                        height: {
                                            type: TYPE.NUMBER,
                                            optional: true
                                        },
                                        between: {
                                            type: TYPE.NUMBER,
                                            optional: true
                                        },
                                        stickMap: {
                                            type: TYPE.BOOL,
                                            optional: true
                                        },
                                        random: {
                                            optional: true
                                        }
                                    }
                                }
                            },
                        }
                    }
                }
            },
            RajActionData.GROUP_NAME.OBJECT_WITH_LIST_ACTION_ID
        );

    };

    const updateData = (oneData, additionalData) => {

        const FUNC = 'updateData';

        if (oneData.params) RajRandomElements.manageRandomElementInObjectIfExist(oneData.params);

        if (oneData.name) {
            errorReport(moduleData.fileName, FUNC, 'Attr name is deprecated! Use id!', oneData);
            return
        }

        if (!oneData.target) {
            errorReport(moduleData.fileName, FUNC, 'Attr target is obligatory!', oneData);
            return
        }


        rajActionManager.updateData(oneData, additionalData);
    };


    const createCharacterEffectFromData = (oneData, additionalData) => {

        let typeClass = getTypeClass(oneData);

        if (!typeClass) {
            return
        }


        newCharacterEffect(oneData, typeClass, additionalData);

    };

    const getTypeClass = (oneData) => {
        switch (oneData.effect) {
            case CharacterEffectsData.effect.ANIMATION:
                return IconEffect;
            case CharacterEffectsData.effect.TINT:
                return TintEffect;
            case CharacterEffectsData.effect.TEXT:
                return TextEffect;
            default:
                errorReport(moduleData.fileName, 'getTypeClass', 'incorrect attr effect!', oneData);
                return null;
                break
        }
    }

    const removeCharacterEffectFromData = (oneData) => {
        let id = oneData.id;

        removeMapObject(id);
    };

    const checkCharacterEffectExist = (id) => {
        return list[id] ? true : false;
    }

    const removeCharacterEffectFromDeleteCharacter = (kind, characterId) => {
        let objectsToDelete = getEffectsByKind(kind, characterId, list);

        for (let k in objectsToDelete) {

            let id = objectsToDelete[k].getId();

            removeMapObject(id);
        }

    };

    const getEffectCharacterEffect = (id) => {
        return list[id].data.effect;
    };

    const afterStopAction = (id) => {
        let obj = list[id];
        let repeat = obj.getRepeat();
        let actualRepeat = obj.getActualRepeat();

        if (repeat == null) {
            removeMapObject(id);

            return;
        }

        if (repeat === true) {
            obj.start();
            return
        }

        if (actualRepeat > repeat) {
            removeMapObject(id);
        } else obj.start();
    };

    const getNewId = () => {
        if (lengthObject(list) == 0) return 0;
        for (let k in list) {
            let newId = parseInt(k) + 1;
            if (!list[newId]) return newId
        }

        errorReport(moduleData.fileName, 'getNewId', 'newId empty! list :', list)

        return Math.random();
    };

    const newCharacterEffect = (data, cl, additionalData) => {
        let characterEffect = new cl();
        let id = data.id;

        characterEffect.init(id, data);

        let master = characterEffect.getMaster();

        if (!master) return

        addToList(id, characterEffect);
    };

    const removeMapObject = (id) => {

        removeFromList(id);
    };

    const getEffectsByEffectNameAndMaster = (effect, targetKind, targetId) => {
        let objects = [];

        for (let k in list) {
            let oneMapElement = list[k];
            let data = oneMapElement.getData();

            if (data.effect == effect && data.target.kind == targetKind) {

                let idExist = isset(data.target.id);

                if (!idExist || idExist && data.target.id == targetId) objects.push(oneMapElement);

            }

        }
        return objects
    };

    const getEffectsByKind = (kind, id, list) => {
        let objects = [];

        for (let k in list) {
            let oneMapElement = list[k];
            let masterKindObject = oneMapElement.getMasterKindObject();

            if (masterKindObject != kind) continue;

            let correct = false;

            switch (masterKindObject) {
                case CanvasObjectTypeData.HERO:
                    correct = true;
                    break;
                case CanvasObjectTypeData.NPC:
                    if (oneMapElement.getMasterId() == id) correct = true;
                    break;
            }

            if (correct) objects.push(oneMapElement);
        }

        return objects;
    };

    const addToList = (id, mapObject) => {
        list[id] = (mapObject);
    };

    const removeFromList = (id) => {
        delete list[id];
    };

    const update = (dt) => {

        for (let k in list) {
            list[k].update(dt);
        }
    };

    const onClear = () => {
        list = {};
    };

    const getDrawableList = () => {
        let a = [];

        if (Engine.hero.d.stasis) return a;

        for (let k in list) {

            let screenEffect = list[k];
            let f = screenEffect.checkDrawRajObject;

            if (!f || f && f()) {
                a.push(screenEffect);
            }
        }

        return a;
    };

    const getRajActionManager = () => {
        return rajActionManager;
    }

    const clearAndRemoveCallback = () => {
        for (let id in list) {
            removeMapObject(id);
        }
        onClear();
    }

    this.init = init;
    this.updateData = updateData;
    this.update = update;
    this.getDrawableList = getDrawableList;
    this.getEffectsByEffectNameAndMaster = getEffectsByEffectNameAndMaster;
    this.afterStopAction = afterStopAction;
    this.getEffectsByKind = getEffectsByKind;
    this.removeCharacterEffectFromDeleteCharacter = removeCharacterEffectFromDeleteCharacter;
    this.getRajActionManager = getRajActionManager;
    this.onClear = onClear;
    this.clearAndRemoveCallback = clearAndRemoveCallback;

}