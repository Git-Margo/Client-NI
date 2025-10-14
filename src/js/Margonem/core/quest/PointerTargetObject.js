let QuestData = require('@core/quest/QuestData');


module.exports = function() {

    let table;
    let kind;
    let arrowId;
    let pointerTargetObjectData;

    let pos = {
        x: null,
        y: null
    };

    let drawTable;

    const init = () => {
        setDrawTable(false);
    };

    const setPos = (x, y) => {
        pos.x = x;
        pos.y = y;
    };

    const updateData = (data) => {
        const TYPE = QuestData.TYPE
        pointerTargetObjectData = data;

        kind = pointerTargetObjectData.kind;

        if (kind == TYPE.COLLECT) {
            let _pos = pointerTargetObjectData.pos;
            setPos(_pos.x, _pos.y)
        }

        if (kind == TYPE.TALK) {
            let _pos = pointerTargetObjectData.pos;
            setPos(_pos.x, _pos.y)
        }
        if (kind == TYPE.KILL) {
            let _pos = pointerTargetObjectData.pos;
            setPos(_pos.x, _pos.y)
        }

        setArrowId(pointerTargetObjectData.name2 + pos.x + "," + pos.y + QuestData.TRACKING_ARROW);
    };

    const setArrowId = (_arrowId) => {
        arrowId = _arrowId;
    }

    const isNpcExist = (x, y) => {
        return getEngine().npcs.checkNpcPos(x, y);
    };

    const isGtwExist = (x, y) => {
        return getEngine().map.gateways.getGtwAtPosition(x, y);
    };

    const isItemExist = (x, y, name) => {
        let list = getEngine().map.groundItems.getGroundItemOnPosition(x, y);

        if (!list.length) {
            return false;
        }

        for (let k in list) {
            if (list[k].getName() == name) {
                return true
            }
        }

        return false
    };

    const update = (dt) => {
        const TYPE = QuestData.TYPE

        switch (kind) {
            case TYPE.TALK:
                updateTalk(dt);
                break;
            case TYPE.COLLECT:
                updateCollect(dt);
                break;
            case TYPE.KILL:
                updateKill(dt);
                break; //1227
        }
    };

    const updateTalk = (dt) => {

        let npcExist = isNpcExist(pos.x, pos.y);
        let gtwExist = isGtwExist(pos.x, pos.y);
        let shouldDrawTable = !npcExist && !gtwExist;

        setDrawTable(shouldDrawTable);
        updateArrow(pos.x, pos.y);
    }

    const updateCollect = (dt) => {
        let toCollect = pointerTargetObjectData.toCollect;
        let name = pointerTargetObjectData.name1;
        let current = getEngine().heroEquipment.getAmountItemAmount(name);
        let itemNotExist = current == null;
        let stillCollect = itemNotExist || current < toCollect;


        //let a = getEngine().heroEquipment.getAmountItem$highlight(name);
        //if (a) {
        //for (let i = 0; i < a.length; i++) {
        //    let $highlight = a[i];
        //    if (!$highlight.hasClass('track')) $highlight.addClass("track");
        //}
        //setTrackClassInItems(a);
        //}

        let shop = getEngine().shop;
        if (shop) {
            let shopHighlights = shop.getShopItemsNameHighlight(name);
            //setTrackClassInItems(shopHighlights);
            getEngine().heroEquipment.setClassInItemsHighlight(shopHighlights, QuestData.HIGHLIGHT_CLASS.TRACK);
        }


        if (!stillCollect) {

            if (checkArrowExist()) {
                deleteArrow();
            }

            return;
        }

        lookForNpcsFromName();
    }

    const updateKill = (dt) => {

        let killCounter = pointerTargetObjectData.killCounter;
        let result = killCounter.current < killCounter.toKill;

        //setEnable(result);
        if (!result) {
            return;
        }

        lookForNpcsFromName();
    }

    const lookForNpcsFromName = () => {
        let name2 = pointerTargetObjectData.name2;
        let npcExist = getEngine().questTracking.checkTrackingNpcExist(name2);
        let arrowPos = getArrowPos(npcExist, name2);
        let gtwExist = isGtwExist(arrowPos.x, arrowPos.y);
        let itemExist = isItemExist(arrowPos.x, arrowPos.y, name2);

        if (!npcExist) {
            npcExist = isNpcExist(arrowPos.x, arrowPos.y); //CRAZY CASE!!!  Searing npc (to KILL or to COLLECT) not exist on map, but this is can be track on npc with item in shop oO
        }

        setDrawTable(!npcExist && !gtwExist && !itemExist);


        updateArrow(arrowPos.x, arrowPos.y);
    }

    const getArrowPos = (npcExist, name) => {
        let x;
        let y;

        if (npcExist) {
            let hero = getEngine().hero;
            let nearTrackingNpc = getEngine().questTracking.getNearTrackingNpc(name, hero.rx, hero.ry);

            x = nearTrackingNpc.getX();
            y = nearTrackingNpc.getY();
        } else {
            x = pos.x;
            y = pos.y;
        }

        return {
            x: x,
            y: y
        };
    }

    const updateArrow = (x, y) => {
        if (checkArrowExist()) {
            let arrowHaveSamePos = checkArrowInSpecificPos(x, y);
            let defaultSrc = checkTargetIsDefaultSrc();
            let targetHaveCorrectSrc = !drawTable && defaultSrc || drawTable && !defaultSrc;

            if (arrowHaveSamePos && targetHaveCorrectSrc) {
                return
            }

            deleteArrow();
        }

        addArrow(x, y);
    };

    const checkArrowInSpecificPos = (x, y) => {
        return getEngine().targets.checkExistInSpecificPosById(arrowId, x, y);
    };

    const checkTargetIsDefaultSrc = () => {
        return getEngine().targets.checkTargetIsDefaultSrc(arrowId);
    };

    const checkArrowExist = () => {
        return getEngine().targets.checkExistById(arrowId);
    };

    const deleteArrowIfExist = () => {
        if (!checkArrowExist()) return;

        deleteArrow();
    };

    const deleteArrow = () => {
        getEngine().targets.deleteArrow(arrowId);
    };

    const addArrow = (x, y) => {
        let name2 = pointerTargetObjectData.name2;
        let targetObj = {
            x: x,
            y: y,
            name: name2
        };

        let target = {};

        if (drawTable) target.src = '/img/placeholder_npc_item.png';

        let text;
        //let name2       = pointerTargetObjectData.name2;
        let killCounter = pointerTargetObjectData.killCounter;

        if (killCounter) {
            text = name2 + " (" + killCounter.current + "/" + killCounter.toKill + ")";
        } else {
            text = name2
        }

        getEngine().targets.addArrow(arrowId, text, targetObj, QuestData.TRACKING_ARROW, false, target);
    };

    const setDrawTable = (state) => {
        drawTable = state
    };

    const getTable = () => {
        return table;
    };

    this.init = init;
    this.updateData = updateData;
    this.update = update;
    this.deleteArrowIfExist = deleteArrowIfExist;

}