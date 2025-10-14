let RajDataCase = require('@core/raj/RajCaseData');
let RajGetSpecificData = require('@core/raj/RajGetSpecificData');


module.exports = function() {

    let moduleData = {
        fileName: "RajCase.js"
    };

    const init = () => {

    };

    const checkKeyQuest = (data) => {
        const ATTR = RajDataCase.QUEST.ATTR;
        const params = data.params;

        switch (data.name) {
            case ATTR.NEVER_OCCUR:
                return neverOccurQueststFullFill(params);
            case ATTR.ACTIVE:
                return activeQueststFullFill(params);
            case ATTR.NO_ACTIVE:
                return noActiveQueststFullFill(params);
            case ATTR.FINISH:
                return finishQueststFullFill(params);
            case ATTR.NOT_FINISH:
                return notFinishQueststFullFill(params);
            default:
                errorReport(moduleData.fileName, "checkKeyQuest", "unregistered data.name", data);
        }

        return null;
    }

    const checkKeyOutfit = (data) => {
        const ATTR = RajDataCase.OUTFIT.ATTR;
        const params = data.params;

        switch (data.name) {
            case ATTR.ONE_OF:
                return oneOfOutfitFullFill(params);
            default:
                errorReport(moduleData.fileName, "checkKeyOutfit", "unregistered data.name", data)
        }

        return null;
    }


    const checkKeyPet = (data) => {
        const ATTR = RajDataCase.PET.ATTR;
        const params = data.params;

        switch (data.name) {
            case ATTR.ONE_OF:
                return oneOfPetFullFill(params);
            default:
                errorReport(moduleData.fileName, "checkKeyPet", "unregistered data.name", data)
        }

        return null;
    }

    const checkKeyExistObj = (data) => {
        const ATTR = RajDataCase.EXIST_OBJ.ATTR;
        const params = data.params;

        switch (data.name) {
            case ATTR.FLOAT_OBJECT:
                return checkFloatObjExist(params);
            case ATTR.FAKE_NPC:
                return checkFakeNpcExist(params);
            case ATTR.NPC:
                return checkNpcExist(params);
            default:
                errorReport(moduleData.fileName, "checkKeyExistObj", "unregistered data.name", data)
        }

        return null;
    }

    const checkKeyExistObjHaveOutfit = (data, additionalData) => {
        const ATTR = RajDataCase.EXIST_OBJ_HAVE_OUTFIT.ATTR;
        const params = data.params;

        let _params = []



        for (let k in params) {
            params[k].id = RajGetSpecificData.getCharacterData(params[k].id, additionalData);
        }

        for (let k in params) {
            _params.push(params[k].id)
        }

        switch (data.name) {
            case ATTR.FAKE_NPC:
                return checkFakeNpcExist(_params) && checkFakeNpcHaveOutfit(params);
            case ATTR.NPC:
                return checkNpcExist(_params) && checkNpcHaveOutfit(params);
            default:
                errorReport(moduleData.fileName, "checkKeyExistObj", "unregistered data.name", data)
        }

        return null;
    }

    const checkCharacterDir = (data, additionalData) => {
        const ATTR = RajDataCase.CHARACTER_DIR.ATTR;
        const params = data.params;

        switch (data.name) {
            case ATTR.ONE_OF:
                return oneOfCharacterDirFullFill(params, additionalData);
            default:
                errorReport(moduleData.fileName, "checkCharacterDir", "unregistered data.name", data)
        }

        return null;
    }

    const checkHeroEquipmentItemTpl = (data, additionalData) => {
        const ATTR = RajDataCase.HERO_EQUIPMENT_ITEM_TPL.ATTR;
        const params = data.params;

        switch (data.name) {
            case ATTR.HAVE_ITEM_TPL:
                return haveItemTplFullFill(params, additionalData);
            case ATTR.ONE_OF:
                return oneOfItemTplFullFill(params, additionalData);
            default:
                errorReport(moduleData.fileName, "checkHeroEquipmentItemTpl", "unregistered data.name", data)
        }

        return null;
    };

    const oneOfItemTplFullFill = (oneOfItemTpl) => {

        for (let k in oneOfItemTpl) {
            let tpl = oneOfItemTpl[k];
            if (Engine.heroEquipment.getHeroItemTpl(tpl)) return true
        }

        return false;
    }

    const haveItemTplFullFill = (haveItemTpl) => {

        let existOccur = 0;

        for (let k in haveItemTpl) {
            let tpl = haveItemTpl[k];
            if (Engine.heroEquipment.getHeroItemTpl(tpl)) existOccur++;
        }

        return existOccur == haveItemTpl.length;
    };

    const oneOfCharacterDirFullFill = (params, additionalData) => {
        for (let k in params) {
            let oneDirData = params[k];
            let dir = oneDirData.dir;
            let targetObject = RajGetSpecificData.getTargetObject(oneDirData, additionalData);

            if (!targetObject) return false;

            if (targetObject.getDir() == dir) return true;
        }

        return false;
    }

    const checkFakeNpcHaveOutfit = (params) => {
        let counter = 0;

        for (let k in params) {
            let img = getEngine().fakeNpcs.getById(params[k].id).getImg();
            if (params[k].img == img) counter++;
        }

        return params.length == counter
    }

    const checkNpcHaveOutfit = (params) => {
        let counter = 0;

        for (let k in params) {
            let img = getEngine().npcs.getById(params[k].id).getImg();
            if (params[k].img == img) counter++;
        }

        return params.length == counter
    }

    const checkFloatObjExist = (params) => {
        let counter = 0;
        for (let i = 0; i < params.length; i++) {
            if (getEngine().floatObjectManager.checkObjectExist(params[i])) counter++;
        }


        return params.length == counter;
    };

    const checkFakeNpcExist = (params) => {
        let counter = 0;
        for (let i = 0; i < params.length; i++) {
            if (getEngine().fakeNpcs.checkFakeNpcListExist(params[i])) counter++;
        }

        return params.length == counter;
    }

    const checkNpcExist = (params) => {
        let counter = 0;
        for (let i = 0; i < params.length; i++) {
            if (getEngine().npcs.checkNpc(params[i])) counter++;
        }

        return params.length == counter;
    }

    const checkKeyTown = (data) => {
        const ATTR = RajDataCase.TOWN.ATTR;
        const params = data.params;

        switch (data.name) {
            case ATTR.ONE_OF:
                return oneOfTownFullFill(params);
            default:
                errorReport(moduleData.fileName, "checkKeyTown", "unregistered data.name", data)
        }

        return null;
    }

    const checkFullFillCase = (rayData, additionalData) => {

        if (!isset(rayData)) return true;


        if (!isset(rayData.list)) {

            return checkFullFillCaseOld(rayData);
            //errorReport(moduleData.fileName, "checkFullFillCase", "Attr ist is obligatory!",  rayData);
            //return true;
        }

        return getResultFromContainer(rayData.list, false, additionalData);

    };

    const checkFullFillCaseOld = (rayCase) => {

        if (!isset(rayCase)) return true;

        warningReport(moduleData.fileName, "checkFullFillCaseOld", "this case is deprecated! use new format with list: []", rayCase);

        const QUEST = RajDataCase.QUEST.KEY_NAME;
        const TOWN = RajDataCase.TOWN.KEY_NAME;
        const OUTFIT = RajDataCase.OUTFIT.KEY_NAME;
        const PET = RajDataCase.PET.KEY_NAME;

        if (rayCase[QUEST]) {

            const NEVER_OCCUR = RajDataCase.QUEST.ATTR.NEVER_OCCUR;
            const ACTIVE = RajDataCase.QUEST.ATTR.ACTIVE;
            const NO_ACTIVE = RajDataCase.QUEST.ATTR.NO_ACTIVE;
            const FINISH = RajDataCase.QUEST.ATTR.FINISH;
            const NOT_FINISH = RajDataCase.QUEST.ATTR.NOT_FINISH;

            let quest = rayCase[QUEST];

            if (quest[NEVER_OCCUR] && !neverOccurQueststFullFill(quest[NEVER_OCCUR])) return false;
            if (quest[ACTIVE] && !activeQueststFullFill(quest[ACTIVE])) return false;
            if (quest[NO_ACTIVE] && !noActiveQueststFullFill(quest[NO_ACTIVE])) return false;
            if (quest[FINISH] && !finishQueststFullFill(quest[FINISH])) return false;
            if (quest[NOT_FINISH] && !notFinishQueststFullFill(quest[NOT_FINISH])) return false;
        }

        if (rayCase[OUTFIT]) {

            const ONE_OF = RajDataCase.OUTFIT.ATTR.ONE_OF;

            let outfit = rayCase[OUTFIT];

            if (outfit[ONE_OF] && !oneOfOutfitFullFill(outfit[ONE_OF])) return false;
        }

        if (rayCase[PET]) {

            const ONE_OF = RajDataCase.PET.ATTR.ONE_OF;

            let pet = rayCase[PET];

            if (pet[ONE_OF] && !oneOfPetFullFill(pet[ONE_OF])) return false;
        }

        if (rayCase[TOWN]) {

            const ONE_OF = RajDataCase.TOWN.ATTR.ONE_OF;

            let town = rayCase[TOWN];

            if (town[ONE_OF] && !oneOfTownFullFill(town[ONE_OF])) return false;
        }


        return true;

    };

    const getResultFromContainer = (list, not, additionalData) => {
        let operationArray = [];

        for (let i = 0; i < list.length; i++) {
            let element = list[i];

            operationArray.push(getMathResult(element, additionalData));
        }


        let operationArrayResult = getResultFromOperationArray(operationArray, list);

        return not ? !operationArrayResult : operationArrayResult;
    };

    const getResultFromOperationArray = (operationArray, list) => {
        let operationStr = operationArray.join("");
        //devConsoleLog(["rajCase", operationStr, list]);
        let result = eval(operationStr);

        if (result === true || result === false) return result;

        return null;
    };

    const getMathResult = (data, additionalData) => {
        const KIND = RajDataCase.kind;

        switch (data.kind) {
            case KIND.ARGUMENT:
                return data.not ? !getResultOfArgument(data, additionalData) : getResultOfArgument(data, additionalData);
            case KIND.CONNECTOR:
                return getConnector(data);
            case KIND.CONTAINER:
                return getResultFromContainer(data.list, data.not ? data.not : false, additionalData);
            default:
                errorReport(moduleData.fileName, "getMathResult", "unregistered data.kind", data)
        }

        return null;
    }

    const getConnector = (data) => {
        const CONNECTOR = RajDataCase.connector;

        switch (data.name) {
            case CONNECTOR.AND:
                return "&&";
            case CONNECTOR.OR:
                return "||";
            default:
                errorReport(moduleData.fileName, "getConnector", "unregistered data.name", data)
        }

        return null
    };

    const getResultOfArgument = (data, additionalData) => {

        const QUEST = RajDataCase.QUEST.KEY_NAME2;
        const TOWN = RajDataCase.TOWN.KEY_NAME2;
        const OUTFIT = RajDataCase.OUTFIT.KEY_NAME2;
        const PET = RajDataCase.PET.KEY_NAME2;
        const EXIST_OBJ = RajDataCase.EXIST_OBJ.KEY_NAME2;
        const EXIST_OBJ_HAVE_OUTFIT = RajDataCase.EXIST_OBJ_HAVE_OUTFIT.KEY_NAME2;
        const HERO_EQUIPMENT_ITEM_TPL = RajDataCase.HERO_EQUIPMENT_ITEM_TPL.KEY_NAME;
        const CHARACTER_DIR = RajDataCase.CHARACTER_DIR.KEY_NAME;

        switch (data.key) {
            case QUEST:
                return checkKeyQuest(data);
            case TOWN:
                return checkKeyTown(data);
            case OUTFIT:
                return checkKeyOutfit(data);
            case PET:
                return checkKeyPet(data);
            case EXIST_OBJ:
                return checkKeyExistObj(data);
            case EXIST_OBJ_HAVE_OUTFIT:
                return checkKeyExistObjHaveOutfit(data, additionalData);
            case CHARACTER_DIR:
                return checkCharacterDir(data, additionalData);
            case HERO_EQUIPMENT_ITEM_TPL:
                return checkHeroEquipmentItemTpl(data, additionalData);
            default:
                errorReport(moduleData.fileName, "getResultOfArgument", "unregistered data.key", data)
        }

        return null;
    }

    const notFinishQueststFullFill = (notFinishQuestArray) => {
        for (let k in notFinishQuestArray) {
            let id = notFinishQuestArray[k];

            if (Engine.quests.checkFinishQuest(id)) return false;
        }

        return true;
    };

    const finishQueststFullFill = (finishQuestArray) => {
        for (let k in finishQuestArray) {
            let id = finishQuestArray[k];

            if (!Engine.quests.checkFinishQuest(id)) return false;
        }

        return true;
    };

    const neverOccurQueststFullFill = (neverOccurQuestArray) => {
        for (let k in neverOccurQuestArray) {
            let id = neverOccurQuestArray[k];

            if (Engine.quests.getQuestData(id)) return false;
            if (Engine.quests.checkFinishQuest(id)) return false;
        }

        return true;
    };

    //const noActiveQueststFullFill = (noActiveQuestArray) => {
    //
    //    for (let k in noActiveQuestArray) {
    //        let id = noActiveQuestArray[k];
    //        if (Engine.quests.getQuestData(id))         return false;
    //        if (!Engine.quests.checkFinishQuest(id))    return false;
    //    }
    //
    //    return true;
    //};

    const noActiveQueststFullFill = (noActiveQuestArray) => {

        let existOccur = 0;

        for (let k in noActiveQuestArray) {
            let id = noActiveQuestArray[k];
            //if (Engine.quests.getQuestData(id)) existOccur++;
            if (!Engine.quests.getQuestData(id)) {
                existOccur++;
                continue;
            }
            if (Engine.quests.checkFinishQuest(id)) {
                existOccur++;
                continue;
            }
        }

        return existOccur == noActiveQuestArray.length;
    };

    const activeQueststFullFill = (activeQuestArray) => {

        let existOccur = 0;

        for (let k in activeQuestArray) {
            let id = activeQuestArray[k];
            if (Engine.quests.getQuestData(id)) existOccur++;
        }

        return existOccur == activeQuestArray.length;
    }

    const oneOfTownFullFill = (oneOfTownArray) => {

        for (let k in oneOfTownArray) {
            let id = oneOfTownArray[k];
            if (Engine.map.d.id == id) return true
        }

        return false;
    }

    const oneOfOutfitFullFill = (oneOfOutfitSrcArray) => {

        for (let k in oneOfOutfitSrcArray) {
            let outfitSrc = oneOfOutfitSrcArray[k];
            if (Engine.hero.d.img == outfitSrc) return true
        }

        return false;
    };

    const oneOfPetFullFill = (oneOfPetSrcArray) => {

        for (let k in oneOfPetSrcArray) {
            let petSrc = oneOfPetSrcArray[k];
            let heroPet = Engine.hero.getPet();

            if (heroPet && heroPet.outfitSrc == petSrc) return true;
        }

        return false;
    };


    this.init = init;
    this.checkFullFillCase = checkFullFillCase;

}