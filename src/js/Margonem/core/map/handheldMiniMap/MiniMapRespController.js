//let MiniMapObject = require('@core/map/handheldMiniMap/MiniMapObjectNew');
let MiniMapObject = require('@core/map/handheldMiniMap/MiniMapObject');
let HandHeldMiniMapData = require('@core/map/handheldMiniMap/HandHeldMiniMapData');

module.exports = function() {

    let moduleData = {
        fileName: "MiniMapRespController.js"
    };

    let heroesRest = {};
    let heroesEventRest = {};
    let titanRest = {};

    let resp = {};

    function init() {

    }

    function clearAllLists() {
        heroesRest = {};
        heroesEventRest = {};
        titanRest = {};

        resp = {};
    }

    function getListByKind(kind) {
        switch (kind) {
            case HandHeldMiniMapData.KIND.HEROES_RESP:
                return heroesRest;
            case HandHeldMiniMapData.KIND.HEROES_RESP_E:
                return heroesEventRest;
            case HandHeldMiniMapData.KIND.TITAN_RESP:
                return titanRest;
            default:
                errorReport(moduleData.fileName, "getListByKind", 'incorrect kind', kind)
        }
    }

    function deleteFromList(kind, id) {
        let list = getListByKind(kind);
        delete list[id];
    }

    function addToList(kind, id) {
        let list = getListByKind(kind);
        list[id] = true;
    }

    function updateData(heroesRespData) {
        for (let id in heroesRespData) {

            newResp(id);
        }
    }

    function newResp(id) {
        let obj = Engine.heroesRespManager.getById(id);
        let kind = findKind(obj);

        if (kind == null) return;

        resp[id] = new MiniMapObject();
        resp[id].setRef(obj);
        resp[id].setKind(kind);

        if (!levelIsCorrect(obj)) return;
        if (!nameIsCorrect(obj)) return;

        resp[id].addToBelongList(HandHeldMiniMapData.TYPE.RESP);
        resp[id].addMapObjectToCords();
        resp[id].setColor();
        resp[id].setShape();

        createTipToResp(resp[id], kind);
    }

    function createTipToResp(miniMapObject, kind) {

        let npc = miniMapObject.getRef();

        // const icon 	= getIcon(CFG.a_npath + npc.getIcon(), npc.getFrameAmount(), npc.fw, npc.fh, 190);
        const t = Engine.npcs.getTip(npc.getData());
        const respTime = `${_t('resp-time')}: <span class="nowrap">${npc.getPreparedResp()}</span><br>`;
        const lvlRanges = npc.getPreparedLvlRanges();
        const visibility = lvlRanges ? `${_t('visibility')}: <span class="nowrap">${lvlRanges}</span>` : '';
        // const tip = _t('possible-resp-place') + ':<br><br>' + t + icon + '<br>' + respTime + visibility;
        const tip = _t('possible-resp-place') + ':<br><br>' + t + '<br>' + respTime + visibility;

        miniMapObject.setTip(tip, "t_npc");
    }

    function getIcon(url, frameAMount, _fw, _fh, maxW, maxH) {

        let fw = _fw;
        let fh = _fh;
        let scale = 1;

        if (maxW && fw > maxW) scale = maxW / fw;
        if (maxH && fh > maxH) scale = maxH / fh;

        fw = fw * scale;
        fh = fh * scale;

        let backgroundSize = 100 * frameAMount;


        return `
		  <div class="mini-map-monster-icon-container">
			  <div class="mini-map-monster-icon"
          style="
            background : url(${url});
			      width      : ${fw}px;
			      height     : ${fh}px;
			      margin     : auto;
			      background-size: ${backgroundSize}%;
			    "
			  </div>
			</div>`;
    }

    function deleteNpc(id) {
        if (!resp[id]) {
            //console.warn('[MiniMapNpcController.js, deleteNpc] Double npc del bug in mini map');
            warningReport('MiniMapNpcController.js', 'deleteNpc', "Double npc del bug in mini map", id);
            return
        }
        resp[id].remove();
        delete resp[id];
    }

    function findKind(obj) {
        const kind = obj.getKind();
        const npcClass = obj.getClass();
        if (npcClass === 'TITAN') return HandHeldMiniMapData.KIND.TITAN_RESP; // TITAN & EVENT TITAN are in the same list

        switch (kind) {
            case 0:
            case 2: // it's exception for Mietek Å»ul :(
                return HandHeldMiniMapData.KIND[`${npcClass}_RESP`];
            case 1:
                return HandHeldMiniMapData.KIND[`${npcClass}_RESP_E`];
            default:
                errorReport(moduleData.fileName, "findKind", 'incorrect kind', kind)
        }
    }

    function draw(ctx, dt) {
        let showObject = Engine.miniMapController.handHeldMiniMapController.getShowObject(HandHeldMiniMapData.TYPE.RESP);

        for (let kind in showObject) {
            let list = getListByKind(kind);

            for (let index in list) {
                resp[index].draw(ctx, dt)
            }
        }
    }

    function levelIsCorrect(respObj) {

        let respLvl = respObj.getLvl();
        let respKind = respObj.getKind();
        let respClass = respObj.getClass();
        let heroLvl = getHeroLevel();
        let dropDestroyLvl = Engine.worldConfig.getDropDestroyLvl();

        return showResp(respLvl, respKind, respClass, heroLvl, dropDestroyLvl)
    }

    function showResp(respLvl, respKind, respClass, heroLvl, dropDestroyLvl) {
        if (respClass === 'TITAN') return true;

        switch (respKind) {
            case 0:
                if (respLvl >= 250) return heroLvl + 50 >= respLvl;
                if (respLvl >= 100) return respLvl + dropDestroyLvl >= heroLvl && heroLvl + 50 >= respLvl;
                return heroLvl >= Math.floor(respLvl / 2) && respLvl + dropDestroyLvl >= heroLvl
            case 1:
            case 2: // it's exception for Mietek Å»ul :(
                return heroLvl >= Math.floor(respLvl / 2);
            default:
                errorReport(moduleData.fileName, "findKind", 'incorrect kind', kind)
        }
        return false;
    }

    function nameIsCorrect(respObj) {

        let handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;
        let handHeldMiniMapWindow = handHeldMiniMapController.getHandHeldMiniMapWindow();

        let name = respObj.getNick();

        return handHeldMiniMapWindow.nameIsCorrect(name);
    }

    function getObject(id) {
        return resp[id];
    }

    this.draw = draw;
    this.init = init;
    this.deleteFromList = deleteFromList;
    this.addToList = addToList;
    this.updateData = updateData;
    this.clearAllLists = clearAllLists;
    this.getObject = getObject;

};