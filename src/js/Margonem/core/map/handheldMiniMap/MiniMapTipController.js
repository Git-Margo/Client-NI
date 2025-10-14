let MiniMapCanvasTip = require('@core/map/handheldMiniMap/MiniMapCanvasTip');
let HandHeldMiniMapData = require('@core/map/handheldMiniMap/HandHeldMiniMapData');

module.exports = function() {

    let cords = {};
    let miniMapCanvasTip;

    function init() {
        initMiniMapCanvasTip();
    }

    function initMiniMapCanvasTip() {
        miniMapCanvasTip = new MiniMapCanvasTip();
        miniMapCanvasTip.init();
    }

    function show(e, object) {
        miniMapCanvasTip.show(e, object)
    }

    function hide(e) {
        miniMapCanvasTip.hide(e);
    }

    function addToCords(x, y, type, id) {
        if (!cords.hasOwnProperty(y)) cords[y] = {};
        if (!cords[y].hasOwnProperty(x)) {
            cords[y][x] = {
                [HandHeldMiniMapData.TYPE.NPC]: null,
                [HandHeldMiniMapData.TYPE.OTHER]: {},
                [HandHeldMiniMapData.TYPE.RIP]: {},
                [HandHeldMiniMapData.TYPE.GATEWAY]: null,
                [HandHeldMiniMapData.TYPE.ITEM]: {},
                [HandHeldMiniMapData.TYPE.HERO]: null,
                [HandHeldMiniMapData.TYPE.RESP]: {}
            };
        }

        switch (type) {
            case HandHeldMiniMapData.TYPE.NPC:
            case HandHeldMiniMapData.TYPE.GATEWAY:
            case HandHeldMiniMapData.TYPE.HERO:
                cords[y][x][type] = id;
                break;
            case HandHeldMiniMapData.TYPE.RESP:
            case HandHeldMiniMapData.TYPE.OTHER:
            case HandHeldMiniMapData.TYPE.RIP:
            case HandHeldMiniMapData.TYPE.ITEM:
                cords[y][x][type][id] = true;
                break;
            default:
                console.error('incorrect CORDS TYPE', type)
        }

    }

    function removeFromCords(x, y, type, id) {
        if (!cords.hasOwnProperty(y)) return;
        if (!cords[y].hasOwnProperty(x)) return;

        switch (type) {
            case HandHeldMiniMapData.TYPE.NPC:
            case HandHeldMiniMapData.TYPE.GATEWAY:
            case HandHeldMiniMapData.TYPE.HERO:
                cords[y][x][type] = null;
                break;
            case HandHeldMiniMapData.TYPE.RESP:
            case HandHeldMiniMapData.TYPE.OTHER:
            case HandHeldMiniMapData.TYPE.RIP:
            case HandHeldMiniMapData.TYPE.ITEM:
                delete cords[y][x][type][id];
                break;
            default:
                console.error('incorrect CORDS TYPE', type)
        }

    }

    function clearCords() {
        cords = {};
    }

    function getObjectFromCordsArray(cordsArray) {
        for (let k in cordsArray) {

            let c = cordsArray[k];
            let x = parseFloat(c.x);
            let y = parseFloat(c.y);
            let obj = getObjectByCords(x, y);

            if (obj) {
                return {
                    object: obj,
                    cords: {
                        x: x,
                        y: y
                    }
                };
            }

        }
        return null;
    }

    function getObjectByCords(x, y) {
        if (!cords.hasOwnProperty(y)) return null;
        if (!cords[y].hasOwnProperty(x)) return null;

        let xyCord = cords[y][x];

        return findSpecificObject(xyCord);
    }

    function findSpecificObject(xyCord) {
        if (xyCord.hero && checkObjectVisible(HandHeldMiniMapData.TYPE.HERO, xyCord.hero)) return [HandHeldMiniMapData.TYPE.HERO, xyCord.hero];
        if (xyCord.npc && checkObjectVisible(HandHeldMiniMapData.TYPE.NPC, xyCord.npc)) return [HandHeldMiniMapData.TYPE.NPC, xyCord.npc];

        if (!objectIsEmpty(xyCord.other)) {
            let id = getFirstVisibleObject(HandHeldMiniMapData.TYPE.OTHER, xyCord.other);
            if (id != null) return [HandHeldMiniMapData.TYPE.OTHER, id];
        }

        if (!objectIsEmpty(xyCord.rip)) {
            let id = getFirstVisibleObject(HandHeldMiniMapData.TYPE.RIP, xyCord.rip);
            if (id != null) return [HandHeldMiniMapData.TYPE.RIP, id];
        }

        if (!objectIsEmpty(xyCord.item)) {
            let id = getFirstVisibleObject(HandHeldMiniMapData.TYPE.ITEM, xyCord.item);
            if (id != null) return [HandHeldMiniMapData.TYPE.ITEM, id];
        }

        const RESP = HandHeldMiniMapData.TYPE.RESP;

        if (!objectIsEmpty(xyCord[RESP])) {
            let id = getFirstVisibleObject(RESP, xyCord[RESP]);
            if (id != null) return [RESP, id];
        }

        if (xyCord.gateway && checkObjectVisible(HandHeldMiniMapData.TYPE.GATEWAY, xyCord.gateway)) return [HandHeldMiniMapData.TYPE.GATEWAY, xyCord.gateway];

        return null;
    }

    function checkObjectVisible(belongType, id) {

        let handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;
        let objectController = handHeldMiniMapController.getObjectController(belongType);

        let object = objectController.getObject(id);
        let visible = object.checkVisible();

        return visible;
    }

    function getFirstVisibleObject(belongType, obj) {
        for (let id in obj) {
            if (checkObjectVisible(belongType, id)) return id;
        }
        return null;
    }

    function objectIsEmpty(obj) {
        return !Object.keys(obj).length;
    }

    function manageShowHideTip(e, obj) {
        //console.log(obj)
        if (obj) {
            let belongType = obj.object[0];
            let id = obj.object[1];

            let object = getObjectByBelongTypeAndId(belongType, id);

            if (object.getTip && object.checkCanShowTip()) show(e, object);

        } else hide(e);
    }

    function getObjectByBelongTypeAndId(belongType, objectId) {
        let objectController = Engine.miniMapController.handHeldMiniMapController.getObjectController(belongType);
        return objectController.getObject(objectId);
    }


    this.init = init;
    this.addToCords = addToCords;
    this.removeFromCords = removeFromCords;
    this.getObjectFromCordsArray = getObjectFromCordsArray;
    this.clearCords = clearCords;
    this.manageShowHideTip = manageShowHideTip;
    this.getObjectByBelongTypeAndId = getObjectByBelongTypeAndId;

    this.show = show;
    this.hide = hide;

};