let IconEffect = require('core/characterEffects/IconEffect');
let TintEffect = require('core/characterEffects/TintEffect');
let TextEffect = require('core/characterEffects/TextEffect');
let CharacterEffectsData = require('core/characterEffects/CharacterEffectsData');
let RajRandomElements = require('core/raj/RajRandomElements');
let RajActionData = require('core/raj/rajAction/RajActionData');
let RajActionManager = require('core/raj/rajAction/RajActionManager');
//let RajData                 = require('core/raj/RajData');
let RajGetSpecificData = require('core/raj/RajGetSpecificData');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
let BFD = require('core/battle/battleEffects/BattleEffectsData');

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

        //const CHARACTER_TARGET = CharacterEffectsData.characterTarget;

        //oneData.id = RajGetSpecificData.getCharacterData(oneData.id, additionalData);

        //if (oneData.id == null) return;

        //if (!Engine.rajCase.checkFullFillCase(oneData.case)) return;

        //let createAction = [ACTION_CREATE, ACTION_CREATE_IF_NOT_EXIST];

        if (!oneData.target) {
            errorReport(moduleData.fileName, FUNC, 'Attr target is obligatory!', oneData);
            return
        }

        //if (createAction.includes(oneData.action) && oneData.target.kind == CHARACTER_TARGET.THIS_NPC_INSTANCE) {
        //    oneData.target.kind = CHARACTER_TARGET.NPC;
        //    oneData.target.id = additionalData.npcId;
        //}

        rajActionManager.updateData(oneData, additionalData);
    };

    //const createCharacterEffectFromData = (oneData, createIfNotExist) => {
    const createCharacterEffectFromData = (oneData, additionalData) => {
        //if (!checkCorrectData(oneData)) return;

        //if (!oneData.effect) {
        //  errorReport(moduleData.fileName, "createCharacterEffectFromData", 'Attr effect not exist!', oneData);
        //  return;
        //}

        //let id = oneData.id;

        //if (checkCharacterEffectExist(id)) {
        //  if (!createIfNotExist) errorReport(moduleData.fileName, "createCharacterEffectFromData", `id ${id} already exist!`, oneData);
        //
        //  return;
        //}

        let typeClass = getTypeClass(oneData);

        if (!typeClass) {
            return
        }

        //return newCharacterEffect(oneData, typeClass, additionalData);

        newCharacterEffect(oneData, typeClass, additionalData);

        //switch (oneData.effect) {
        //  case CharacterEffectsData.effect.ANIMATION  : newCharacterEffect(oneData, IconEffect); break;
        //  case CharacterEffectsData.effect.TINT       : newCharacterEffect(oneData, TintEffect); break;
        //  case CharacterEffectsData.effect.TEXT       : newCharacterEffect(oneData, TextEffect); break;
        //  default :
        //    errorReport(moduleData.fileName, 'createCharacterEffectFromData', 'incorrect attr effect!', oneData);
        //    break
        //}
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

    //const checkMasterExist = () => {
    //
    //}

    //const removeCharacterEffectFromData = (oneData, removeIfExist) => {
    const removeCharacterEffectFromData = (oneData) => {
        let id = oneData.id;

        //if (!checkCharacterEffectExist(id)) {
        //  if (!removeIfExist) errorReport(moduleData.fileName, "removeCharacterEffectFromData", `id ${id} not exist!`, oneData);
        //
        //  return;
        //}

        //removeMapObject(id, removeIfExist);
        removeMapObject(id);
    };

    const checkCharacterEffectExist = (id) => {
        return list[id] ? true : false;
    }

    const removeCharacterEffectFromDeleteCharacter = (kind, characterId) => {
        let objectsToDelete = getEffectsByKind(kind, characterId, list);

        for (let k in objectsToDelete) {

            let id = objectsToDelete[k].getId();
            //let name  = list[id].getName();

            removeMapObject(id);
        }

        //Engine.characterEffectsChainManager.removeChainEffectFromDeleteCharacter(kind, characterId)
        //Engine.characterEffectsChainManager.removeWaitingEffectFromDeleteCharacter(kind, characterId)

    };

    const getEffectCharacterEffect = (id) => {
        return list[id].data.effect;
    };

    //const getEffectsToRemove = (oneData) => {
    //  return getEffectsByName(oneData.name, oneData.target.kind, oneData.target.id)
    //};

    const afterStopAction = (id) => {
        let obj = list[id];
        let repeat = obj.getRepeat();
        let actualRepeat = obj.getActualRepeat();
        //let name          = obj.getName();

        //let chainExist = Engine.characterEffectsChainManager.checkChainExist(name);

        if (repeat == null) {
            removeMapObject(id);

            //if (chainExist) {
            //  let chainIndex = obj.getChainIndex();
            //  Engine.characterEffectsChainManager.manageChainObject(name);
            //}

            return;
        }

        if (repeat === true) {
            obj.start();
            return
        }

        if (actualRepeat > repeat) {
            removeMapObject(id);

            //if (chainExist) {
            //
            //  Engine.characterEffectsChainManager.manageChainObject(name);
            //}
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

    //const checkCorrectData = (oneData) => {
    //  const EFFECT = CharacterEffectsData.effect;
    //
    //  switch (oneData.effect) {
    //    case EFFECT.ANIMATION  : return true;
    //    case EFFECT.TINT       : return checkCorrectTintData(oneData);
    //    case EFFECT.TEXT       : return true;
    //  }
    //
    //  return false
    //
    //};

    //const checkCorrectTintData = (oneData) => {
    //  let FUNC = "checkCorrectTintData";
    //
    //  if (!oneData.params.color) {
    //    errorReport(moduleData.fileName, FUNC, 'attr oneData.params.color not exist', oneData);
    //    return false
    //  }
    //
    //  if (!checkRGBObject(moduleData.fileName, FUNC, oneData.params.color, oneData)) return false
    //
    //  return true;
    //};

    const newCharacterEffect = (data, cl, additionalData) => {
        let characterEffect = new cl();
        //let id              = getNewId();
        let id = data.id;

        characterEffect.init(id, data);

        let master = characterEffect.getMaster();

        //if (!master) return characterEffect;
        if (!master) return

        //let name = characterEffect.getName();

        //if (checkCharacterEffectExistByName(name)) {
        //
        //  if (!createIfNotExist) {
        //    let txt = `Name ${name} already exist!`;
        //    errorReport(moduleData.fileName, "newCharacterEffect", txt, data)
        //    message(txt);
        //  }
        //  return;
        //}

        addToList(id, characterEffect);

        //return characterEffect;
    };

    //const checkCharacterEffectExistByName = (newCharacterEffectName) => {
    //  for (let id in list) {
    //    if (list[id].getName() == newCharacterEffectName) return true;
    //  }
    //  return false;
    //}

    //const removeMapObject = (id, removeOrExistAction) => {
    const removeMapObject = (id) => {
        //if (!removeOrExistAction) {
        //  if (!list[id]) {
        //    errorReport(moduleData.fileName, 'removeMapObject', `id ${id} not exist!`, list);
        //    return
        //  }
        //}
        // let name = lis
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

    //const getEffectsByName = (name, kind, id) => {
    //  let objects = [];
    //
    //  for (let k in list) {
    //    let oneMapElement     = list[k];
    //    let masterKindObject  = oneMapElement.getMasterKindObject();
    //    let nameMapEffect     = oneMapElement.getName();
    //
    //    if (nameMapEffect     != name)     continue;
    //    if (masterKindObject  != kind)     continue;
    //
    //    let correct = false;
    //
    //    switch (masterKindObject) {
    //      case CharacterEffectsData.characterTarget.HERO:
    //        correct = true;
    //        break;
    //      case CharacterEffectsData.characterTarget.NPC:
    //        if (oneMapElement.getMasterId() == id) correct = true;
    //        break;
    //      case CharacterEffectsData.characterTarget.FAKE_NPC:
    //        if (oneMapElement.getMasterId() == id) correct = true;
    //        break;
    //    }
    //
    //    if (correct) objects.push(oneMapElement);
    //  }
    //
    //  return objects;
    //};

    const addToList = (id, mapObject) => {
        list[id] = (mapObject);
    };

    const removeFromList = (id) => {
        delete list[id];
    };

    const update = (dt) => {
        //Engine.characterEffectsChainManager.update(dt);

        for (let k in list) {
            list[k].update(dt);
        }
    };

    const onClear = () => {
        list = {};
        //Engine.characterEffectsChainManager.onClear();
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

    this.init = init;
    this.updateData = updateData;
    this.update = update;
    this.getDrawableList = getDrawableList;
    this.getEffectsByEffectNameAndMaster = getEffectsByEffectNameAndMaster;
    this.afterStopAction = afterStopAction;
    //this.removeCharacterEffectFromData              = removeCharacterEffectFromData;
    this.getEffectsByKind = getEffectsByKind;
    this.removeCharacterEffectFromDeleteCharacter = removeCharacterEffectFromDeleteCharacter;
    this.getRajActionManager = getRajActionManager;
    this.onClear = onClear;

}