let CanvasObjectTypeData = require('@core/CanvasObjectTypeData');
let CharacterTimer = require('@core/interfaceTimer/CharacterTimer.js');
let TownTimer = require('@core/interfaceTimer/TownTimer.js');


module.exports = function() {

    const TOWN = "TOWN";
    const moduleData = {
        fileName: "CharacterTimer.js"
    };
    let list = null;


    const init = () => {
        clearList();
    };

    const updateData = (data) => {
        if (!checkCorrectData(data)) {
            return
        }

        let show = data.show;

        for (let k in show) {
            let oneTimer = show[k];
            updateOneData(oneTimer);
        }
    };

    const updateOneData = (oneTimer) => {
        let timerId = oneTimer.id;
        let time = oneTimer.time;
        let targetId = oneTimer.target.id;
        let targetKind = oneTimer.target.kind;

        let create = oneTimer.time != 0;

        if (isTown(targetKind)) {

            if (create) createTownTimer(targetId, time);
            else removeTownTimer(targetId);

            return
        }

        if (create) createCharacterTimer(timerId, targetId, targetKind, time);
        else removeCharacterTimer(timerId, targetKind);

    };

    const checkCorrectData = (data) => {
        const FUNC = "checkCorrectData"

        if (!elementIsObject(data)) {
            errorReport(moduleData.fileName, FUNC, "should be object!", data)
            return false
        }

        let issetShow = isset(data.show);

        if (!issetShow) {
            errorReport(moduleData.fileName, FUNC, "show and hide not exist!", data);
            return false
        }

        let show = data.show;
        for (let i in show) {
            let oneCharacterTimer = show[i];

            if (!isset(oneCharacterTimer.id)) {
                errorReport(moduleData.fileName, FUNC, "id not exist!", data);
                return false
            }

            if (!isset(oneCharacterTimer.time)) {
                errorReport(moduleData.fileName, FUNC, "time not exist!", data);
                return false
            }

            if (!isset(oneCharacterTimer.target)) {
                errorReport(moduleData.fileName, FUNC, "target not exist!", data);
                return false
            }

            if (!elementIsObject(oneCharacterTimer.target)) {
                errorReport(moduleData.fileName, FUNC, "target should be object!", data);
                return false
            }

            if (!isset(oneCharacterTimer.target.kind)) {
                errorReport(moduleData.fileName, FUNC, "target.kind not exist!", data);
                return false
            }

            switch (oneCharacterTimer.target.kind) {
                case CanvasObjectTypeData.NPC:
                    if (!isset(oneCharacterTimer.target.id)) {
                        errorReport(moduleData.fileName, FUNC, "target.id not exist!", data);
                        return false
                    }
                    break;
                case CanvasObjectTypeData.HERO:
                    break;
                case TOWN:
                    break;
                default:
                    errorReport(moduleData.fileName, FUNC, "target.kind not exist!", data);
                    return false
            }


        }



        return true;


    };

    const check = (targetKind, targetId) => {

        switch (targetKind) {
            case CanvasObjectTypeData.NPC:
            case CanvasObjectTypeData.HERO:
                break;
            default:
                errorReport(moduleData.fileName, "getCharacterTimer", "targetKind not exist!", targetKind)
                return
        }

        if (isHero(targetKind)) {
            return list[targetKind] ? true : false;
        }

        return list[targetKind][targetId] ? true : false;
    };


    const addToList = (targetId, targetKind, timer) => {
        if (isHero(targetKind) || isTown(targetKind)) {
            list[targetKind] = timer;
            return
        }

        list[targetKind][targetId] = timer
    };

    const isHero = (targetKind) => {
        return targetKind == CanvasObjectTypeData.HERO
    };

    const isTown = (targetKind) => {
        return targetKind == TOWN
    };

    //const removeFromList = (timerId, targetId, targetKind, time) => {
    //
    //};

    const removeCharacterTimerByTarget = (targetId, targetKind) => {

        const FUNC = "removeCharacterTimerByTarget";

        if (!list[targetKind]) {
            errorReport(moduleData.fileName, FUNC, "incorrect targetKind", targetKind);
            return;
        }

        if (isHero(targetKind)) {
            list[targetKind] = null;
            return;
        }

        if (!check(targetKind, targetId)) {
            errorReport(moduleData.fileName, FUNC, "character not exist", [targetKind, targetId]);
            return;
        }

        delete list[targetKind][targetId];
    };

    const createTownTimer = (timerId, time) => {
        let townTimer = new TownTimer();

        townTimer.init();
        townTimer.updateData(timerId, time);


        //getEngine().interface.show$mapTimer(true);

        addToList(null, TOWN, townTimer);
    }

    const removeTownTimer = (timerId) => {
        list[TOWN] = null;
        //getEngine().interface.show$mapTimer(false);
    }

    const createCharacterTimer = (timerId, targetId, targetKind, time) => {


        let characterTimer = new CharacterTimer();

        characterTimer.init();
        characterTimer.updateData(timerId, targetId, targetKind, time);

        //let npcByTarget

        addToList(targetId, targetKind, characterTimer);
    };

    const removeCharacterTimer = (timerId, targetKind) => {

        if (targetKind == CanvasObjectTypeData.HERO) {
            list[targetKind] = null;
        }

        if (targetKind == CanvasObjectTypeData.NPC) {
            let oneKind = list[targetKind];

            for (let targetId in oneKind) {
                let obj = oneKind[targetId];

                if (obj.getId() != timerId) {
                    continue
                }

                removeCharacterTimerByTarget(targetId, targetKind);

            }
        }

    };

    const clearList = () => {
        list = {
            [CanvasObjectTypeData.NPC]: {},
            [CanvasObjectTypeData.HERO]: null,
            [TOWN]: null
        }
    };

    const onClear = () => {
        let townTimer = list[TOWN];

        if (townTimer) {
            getEngine().interface.show$mapTimer(false);
        }

        clearList();
    };

    const getCharacterTimer = (targetKind, targetId) => {

        if (isHero(targetKind)) {
            return list[targetKind];
        }

        return list[targetKind][targetId];
    };

    const update = (dt) => {
        let npcTimerList = list[CanvasObjectTypeData.NPC];
        let heroTimer = list[CanvasObjectTypeData.HERO];
        let townTimer = list[TOWN];

        for (let npcId in npcTimerList) {
            npcTimerList[npcId].update(dt);
        }

        if (heroTimer) {
            heroTimer.update(dt);
        }

        if (townTimer) {
            townTimer.update(dt);
        }
    };

    this.init = init;
    this.onClear = onClear;
    this.updateData = updateData;
    this.check = check;
    this.getCharacterTimer = getCharacterTimer;
    this.update = update;
    this.isHero = isHero;
    this.removeCharacterTimer = removeCharacterTimer;
    this.removeTownTimer = removeTownTimer;
    //this.removeCharacterTimerById = removeCharacterTimerById;
    //this.removeCharacterTimerByTarget = removeCharacterTimerByTarget;

}