let CanvasObjectTypeData = require('@core/CanvasObjectTypeData');
let RajActionManager = require('@core/raj/rajAction/RajActionManager');
const RajActionData = require('@core/raj/rajAction/RajActionData');

module.exports = function() {

    let moduleData = {
        fileName: "RajCharacterHide.js"
    };
    let heroHide = false;
    let petHide = false;
    let rajActionManager = null;
    let fakeNpcHideList = {};
    let npcHideList = {};
    let floatObjectHideList = {};

    const init = () => {
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        rajActionManager = new RajActionManager();

        const TYPE = RajActionData.TYPE;
        const HERO = CanvasObjectTypeData.HERO;
        const PET = CanvasObjectTypeData.PET;
        const FAKE_NPC = CanvasObjectTypeData.FAKE_NPC;
        const NPC = CanvasObjectTypeData.NPC;
        const FLOAT_OBJECT = CanvasObjectTypeData.FLOAT_OBJECT;
        const THIS_NPC_INSTANCE = RajActionData.TARGET_KIND.THIS_NPC_INSTANCE;

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                removeFunc: removeAction,
                createRequire: {
                    target: {
                        type: {
                            name: TYPE.TARGET,
                            option: [HERO, PET, FAKE_NPC, FLOAT_OBJECT, NPC, THIS_NPC_INSTANCE]
                        }
                    },
                    showTip: {
                        type: TYPE.BOOL,
                        optional: true
                    },
                    displayOnMiniMap: {
                        type: TYPE.BOOL,
                        optional: true
                    },
                    displayEmo: {
                        type: TYPE.BOOL,
                        optional: true
                    }
                },
                //removeRequire   : {                                                                                   //todo: on this moment not work because this is not back compatible
                //    target: {type: {name:TYPE.TARGET, option: [HERO, PET, FAKE_NPC, NPC, THIS_NPC_INSTANCE]}}
                //}
            },
            RajActionData.GROUP_NAME.OBJECT_WITH_LIST_ACTION_TARGET
        );
    };

    const setHeroHide = (data) => {

        if (data == false) {
            heroHide = null;
            return
        }

        heroHide = {
            showTip: isset(data.showTip) ? data.showTip : true,
            displayOnMiniMap: isset(data.displayOnMiniMap) ? data.displayOnMiniMap : false,
        }
    };

    const setPetHide = (data) => {

        if (data == false) {
            petHide = null;
            return
        }

        petHide = {
            showTip: isset(data.showTip) ? data.showTip : true
        }
    };

    const checkHeroHide = () => {
        return heroHide ? true : false;
    };

    const checkPetHide = () => {
        return petHide ? true : false;
    };

    const addFakeNpc = (id) => {
        fakeNpcHideList[id] = true;
    };

    const removeFakeNpc = (id) => {
        delete fakeNpcHideList[id];
    };

    const checkFakeNpcHide = (id) => {
        return fakeNpcHideList[id];
    };


    const addFloatObject = (id) => {
        floatObjectHideList[id] = true;
    };

    const removeFloatObject = (id) => {
        delete floatObjectHideList[id];
    };

    const checkFloatObjectHide = (id) => {
        return floatObjectHideList[id] ? true : false;
    };

    const addNpc = (data) => {
        npcHideList[data.target.id] = {
            showTip: isset(data.showTip) ? data.showTip : true,
            displayOnMiniMap: isset(data.displayOnMiniMap) ? data.displayOnMiniMap : false,
            displayEmo: isset(data.displayEmo) ? data.displayEmo : false
        }
    };

    const removeNpc = (id) => {
        delete npcHideList[id];
    };

    const checkNpcHide = (id) => {
        return npcHideList[id];
    };


    const updateData = (data, additionalData) => {
        //if (!checkCorrectData(data)) return;

        if (!rajActionManager.checkCorrectMainData(data, additionalData)) return;

        for (let k in data.list) {
            updateOneDataRecord(data.list[k], additionalData);
        }
    };

    const updateOneDataRecord = (data, additionalData) => {

        //if (!Engine.rajCase.checkFullFillCase(data.case)) return;

        //if (data.action == "CREATE") createAction(data, additionalData);
        //if (data.action == "REMOVE") removeAction(data, additionalData);


        if (data.kind) {
            errorReport(moduleData.fileName, "checkCorrectData", `{kind: "..."} is deprecated! Use {target: {kind: "..."}}`, data);
        }

        //if (!checkCorrectData(data)) return;

        rajActionManager.updateData(data, additionalData);
    };

    //const checkCorrectData = (data) => {
    //    const FUNC = "checkCorrectData";
    //    if (data.kind) {
    //        errorReport(moduleData.fileName, FUNC, `{kind: "..."} is deprecated! Use {target: {kind: "..."}}`, data);
    //    }
    //
    //    return true;
    //
    //}

    const createAction = (data, additionalData) => {
        if (data.kind) {
            data.target = {
                kind: {}
            };
            data.target.kind = data.kind;

            delete data.kind;

            if (isset(data.id)) {
                data.target.id = data.id;
                delete data.id;
            }
        }

        switch (data.target.kind) {
            case CanvasObjectTypeData.HERO:
                setHeroHide(data);
                break;
            case CanvasObjectTypeData.PET:
                setPetHide(data);
                break;
            case CanvasObjectTypeData.FAKE_NPC:
                addFakeNpc(data.target.id);
                break;
            case CanvasObjectTypeData.FLOAT_OBJECT:
                addFloatObject(data.target.id);
                break;
            case CanvasObjectTypeData.NPC:
                addNpc(data);
                break;
                //case "THIS_NPC_INSTANCE":                   manageAddNpcFromThisNpcInstance(data, additionalData); break;
            default:
                errorReport(moduleData.fileName, "createAction", "undefined kind", data.target.kind)
        }
    };

    const removeAction = (data, additionalData) => {
        if (data.kind) {
            data.target = {
                kind: {}
            };
            data.target.kind = data.kind;

            delete data.kind;

            if (isset(data.id)) {
                data.target.id = data.id;
                delete data.id;
            }
        }

        switch (data.target.kind) {
            case CanvasObjectTypeData.HERO:
                setHeroHide(false);
                break;
            case CanvasObjectTypeData.PET:
                setPetHide(false);
                break;
            case CanvasObjectTypeData.FAKE_NPC:
                removeFakeNpc(data.target.id);
                break;
            case CanvasObjectTypeData.FLOAT_OBJECT:
                removeFloatObject(data.target.id);
                break;
            case CanvasObjectTypeData.NPC:
                removeNpc(data.target.id);
                break;
                //case "THIS_NPC_INSTANCE":                   manageRemoveNpcFromThisNpcInstance(data, additionalData); break;
            default:
                errorReport(moduleData.fileName, "removeAction", "undefined kind", data.target.kind)
        }
    };

    const manageRemoveNpcFromThisNpcInstance = (data, additionalData) => {
        let FUNC = "manageRemoveNpcFromThisNpcInstance";

        if (isset(data.target.id)) {
            errorReport(moduleData.fileName, FUNC, "attr id is not available when kind is THIS_NPC_INSTANCE", data);
            return;
        }

        if (!isset(additionalData.npcId)) {
            errorReport(moduleData.fileName, FUNC, "not find npcId in additionalData!", additionalData);
            return;
        }

        removeNpc(additionalData.npcId)
    };

    //const manageAddNpcFromThisNpcInstance = (data, additionalData) => {
    //    let FUNC = "manageAddNpcFromThisNpcInstance";
    //
    //    if (isset(data.target.id)) {
    //        errorReport(moduleData.fileName, FUNC, "attr id is not available when kind is THIS_NPC_INSTANCE", data)
    //        return;
    //    }
    //
    //    if (!isset(additionalData.npcId)) {
    //        errorReport(moduleData.fileName, FUNC, "not find npcId in additionalData!", additionalData);
    //        return;
    //    }
    //
    //    let newData = copyStructure(data);
    //
    //    newData.target.id      = additionalData.npcId;
    //    newData.target.kind    = CanvasObjectTypeData.NPC;
    //
    //    addNpc(newData);
    //};

    const checkHideObject = (canvasObject) => {
        let kind = canvasObject.canvasObjectType;

        if (!kind) return false;

        switch (kind) {
            case CanvasObjectTypeData.HERO:
                return checkHeroHide();
            case CanvasObjectTypeData.PET:
                return checkPetHide();
            case CanvasObjectTypeData.FAKE_NPC:
                return checkFakeNpcHide(canvasObject.id);
            case CanvasObjectTypeData.NPC:
                return checkNpcHide(canvasObject.d.id);
            case CanvasObjectTypeData.FLOAT_OBJECT:
                return checkFloatObjectHide(canvasObject.getId());
            case CanvasObjectTypeData.OTHER:
                return false;
            case CanvasObjectTypeData.M_ITEM:
                return false;
            case CanvasObjectTypeData.GATEWAY:
                return false;
            case CanvasObjectTypeData.MAP:
                return false;
            case CanvasObjectTypeData.HEROES_RESP:
                return false;
            default:
                errorReport(moduleData.fileName, "checkHideObject", "undefined kind!", kind);
        }
    };

    const checkShowTip = (character) => {
        let kind = character.canvasObjectType;

        if (!kind) return true;

        switch (kind) {
            case CanvasObjectTypeData.HERO:
                return checkHeroShowTip();
            case CanvasObjectTypeData.PET:
                return checkPetShowTip();
            case CanvasObjectTypeData.FAKE_NPC:
                return true;
            case CanvasObjectTypeData.NPC:
                return checkNpcShowTip(character.d.id);
            case CanvasObjectTypeData.OTHER:
                return true;
            case CanvasObjectTypeData.M_ITEM:
                return true;
            case CanvasObjectTypeData.GATEWAY:
                return true;
            case CanvasObjectTypeData.MAP:
                return true;
            case CanvasObjectTypeData.HEROES_RESP:
                return true;
            default:
                errorReport(moduleData.fileName, "checkShowTip", "undefined kind!", kind);
        }
    };

    const checkNpcShowTip = (id) => {
        if (!checkNpcHide(id)) return true;

        return npcHideList[id].showTip;
    };

    const checkHeroShowTip = () => {
        if (!checkHeroHide()) return true;

        return heroHide.showTip;
    };

    const checkPetShowTip = () => {
        if (!checkPetHide()) return true;

        return petHide.showTip;
    };

    const checkNpcDisplayOnMiniMap = (id) => {
        if (!checkNpcHide(id)) return true;

        return npcHideList[id].displayOnMiniMap;
    };

    const checkNpcDisplayEmo = (id) => {
        if (!checkNpcHide(id)) return true;

        return npcHideList[id].displayEmo;
    };

    const checkHeroDisplayOnMiniMap = () => {
        if (!checkHeroHide()) return true;

        return heroHide.displayOnMiniMap;
    };

    const onClear = () => {
        setHeroHide(false);
        setPetHide(false);
        for (let id in fakeNpcHideList) {
            removeFakeNpc(id);
        }

        for (let id in npcHideList) {
            removeNpc(id);
        }
    }

    const checkDisplayOnMiniMap = (character) => {
        let kind = character.canvasObjectType;

        if (!kind) return true;

        switch (kind) {
            case CanvasObjectTypeData.HERO:
                return checkHeroDisplayOnMiniMap();
            case CanvasObjectTypeData.PET:
                return false;
            case CanvasObjectTypeData.FAKE_NPC:
                return false;
            case CanvasObjectTypeData.NPC:
                return checkNpcDisplayOnMiniMap(character.d.id);
            case CanvasObjectTypeData.OTHER:
                return true;
            case CanvasObjectTypeData.M_ITEM:
                return true;
            case CanvasObjectTypeData.GATEWAY:
                return true;
            case CanvasObjectTypeData.MAP:
                return true;
            case CanvasObjectTypeData.HEROES_RESP:
                return true;
            default:
                errorReport(moduleData.fileName, "checkShowTip", "undefined kind!", kind);
        }
    };

    const checkDisplayEmo = (character) => {
        let kind = character.canvasObjectType;

        if (!kind) return true;

        switch (kind) {
            case CanvasObjectTypeData.HERO:
                return false;
            case CanvasObjectTypeData.PET:
                return false;
            case CanvasObjectTypeData.FAKE_NPC:
                return false;
            case CanvasObjectTypeData.NPC:
                return checkNpcDisplayEmo(character.d.id);
            case CanvasObjectTypeData.OTHER:
                return false;
            case CanvasObjectTypeData.M_ITEM:
                return false;
            case CanvasObjectTypeData.GATEWAY:
                return false;
            case CanvasObjectTypeData.MAP:
                return false;
            case CanvasObjectTypeData.HEROES_RESP:
                return false;
            default:
                errorReport(moduleData.fileName, "checkDisplayEmo", "undefined kind!", kind);
        }
    }

    this.init = init;
    this.updateData = updateData;
    this.checkHideObject = checkHideObject;
    this.checkDisplayOnMiniMap = checkDisplayOnMiniMap;
    this.checkDisplayEmo = checkDisplayEmo;
    this.checkShowTip = checkShowTip;
    this.onClear = onClear;
}