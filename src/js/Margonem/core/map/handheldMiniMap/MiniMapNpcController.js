 //let MiniMapObject = require('core/map/handheldMiniMap/MiniMapObjectNew');
 let MiniMapObject = require('core/map/handheldMiniMap/MiniMapObject');
 let HandHeldMiniMapData = require('core/map/handheldMiniMap/HandHeldMiniMapData');

 module.exports = function() {

     let normalNpc = {};
     let normalMonsters = {};
     let elite1 = {};
     let elite2 = {};
     let elite3 = {};
     let heros = {};
     let colossus = {};
     let titans = {};
     let recovery = {}; // only com...

     let npc = {};

     function init() {

     }

     function clearAllLists() {
         normalNpc = {};
         normalMonsters = {};
         elite1 = {};
         elite2 = {};
         elite3 = {};
         heros = {};
         colossus = {};
         titans = {};
         recovery = {};

         npc = {};
     }

     function getListByKind(kind) {
         switch (kind) {
             case HandHeldMiniMapData.KIND.NPCS:
                 return normalNpc;
             case HandHeldMiniMapData.KIND.NORMAL_MONSTER:
                 return normalMonsters;
             case HandHeldMiniMapData.KIND.ELITE_1:
                 return elite1;
             case HandHeldMiniMapData.KIND.ELITE_2:
                 return elite2;
             case HandHeldMiniMapData.KIND.ELITE_3:
                 return elite3;
             case HandHeldMiniMapData.KIND.HEROS:
                 return heros;
             case HandHeldMiniMapData.KIND.COLOSSUS:
                 return colossus;
             case HandHeldMiniMapData.KIND.TYTAN:
                 return titans;
             case HandHeldMiniMapData.KIND.RECOVERY:
                 return recovery;
             default:
                 console.error('incorrect kind', kind);
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

     function updateData(npcData) {
         //for (let id in npcData) {
         for (let i = 0; i < npcData.length; i++) {

             let id = npcData[i].id

             //if (npcData[i].del) {
             //	deleteNpc(id)
             //	continue;
             //}
             //if (npc[id])  updateNpc(id);
             newNpc(id);
         }
     }

     function isMonster(obj) {
         return obj.d.type == 2 || obj.d.type == 3
     }

     function updateData_npcs_del(v) {
         for (let k in v) {
             let id = v[k].id;
             deleteNpc(id);
         }
     }

     function newNpc(id) {
         let obj = Engine.npcs.getById(id);
         //let kind  = findKindMonster(obj);
         //let kind  = getEngine().npcs.findKindNpc(obj);
         let kind = obj.getKind();

         if (kind == null) return;

         npc[id] = new MiniMapObject();
         npc[id].setRef(obj);
         npc[id].setKind(kind);

         if (isMonster(obj))
             if (!levelIsCorrect(obj)) return;
         if (!nameIsCorrect(obj)) return;

         npc[id].addToBelongList(HandHeldMiniMapData.TYPE.NPC);
         npc[id].addMapObjectToCords();
         npc[id].setColor();
         npc[id].setShape();

         createTipToNpc(npc[id], kind);
     }

     function createTipToNpc(miniMapObject, kind) {

         let npc = miniMapObject.getRef();

         if (!npc.getOnloadProperImg()) {
             setTimeout(function() {
                 createTipToNpc(miniMapObject, kind);
             }, 1000);
             return
         }

         //let icon 	= getIcon(CFG.a_npath + npc.d.icon, npc.frameAmount, npc.fw, npc.fh, 190);

         let cl1 = 'mini-map-monster-icon-container';
         let cl2 = 'mini-map-monster-icon';

         let icon = createNpcIcon(cl1, cl2, CFG.a_npath + npc.d.icon, npc.frameAmount, npc.fw, npc.fh, 190);
         let t = Engine.npcs.getTip(npc);

         miniMapObject.setTip(t + icon, "t_npc");
     }

     //function getIcon (url, frameAMount, _fw, _fh, maxW, maxH) {
     //
     //	let fw 		= _fw;
     //	let fh 		= _fh;
     //	let scale 	= 1;
     //
     //	if (maxW && fw > maxW) scale = maxW / fw;
     //	if (maxH && fh > maxH) scale = maxH / fh;
     //
     //	fw = fw * scale;
     //	fh = fh * scale;
     //
     //	let backgroundSize = 100 * frameAMount;
     //
     //
     //	return `
     //	  <div class="mini-map-monster-icon-container">
     //		  <div class="mini-map-monster-icon"
     //     style="
     //       background : url(${url});
     //		      width      : ${fw}px;
     //		      height     : ${fh}px;
     //		      margin     : auto;
     //		      background-size: ${backgroundSize}%;
     //		    "
     //		  </div>
     //		</div>`;
     //}

     function changeTypeFontColor(obj, kind) {
         let txt = _t(kind, null, 'npcs_kind');
         if (kind == HandHeldMiniMapData.KIND.NPCS) return txt;

         return obj.d.wt > 9 ? '<i>' + txt + '</i>' : txt;
     }

     function formLevelPartyAndColor(monster) {

         const lvl = monster.d.hasOwnProperty('elasticLevelFactor') ? Engine.npcs.getById(monster.d.id).getElasticMobLevel() : monster.d.lvl;
         let color = '';

         if (isMonster(monster)) {

             var dl = monster.d.lvl - Engine.hero.d.lvl;
             if (dl < -(Engine.worldConfig.getDropDestroyLvl())) color = 'style="color:#888"';
             else if (dl > 10) color = 'style="color:#f50"';
             else if (dl > 5) color = 'style="color:#ff0"';
         }

         let coma = lvl == 0 ? '' : ', ';
         let lvlStr = lvl > 0 ? `${lvl} lvl` : '';
         // let grp     = monster.d.grp > 0 ? (_l() == 'pl' ? `${coma}grp` : `${coma}party`) : '';
         let grp = monster.d.grp > 0 ? (isPl() ? `${coma}grp` : `${coma}party`) : '';

         return '<div class="lvl-obj" ' + color + '>' + lvlStr + grp + '</div>'
     }

     function deleteNpc(id) {
         if (!npc[id]) {
             //console.warn('[MiniMapNpcController.js, deleteNpc] Double npc del bug in mini map');
             warningReport('MiniMapNpcController.js', 'deleteNpc', "Double npc del bug in mini map", id);
             return
         }
         npc[id].remove();
         delete npc[id];
     }

     //function findKindMonster (obj) {
     //	let kind  = null;
     //	let type  = obj.d.type;
     //	let wt    = obj.d.wt;
     //
     //	if (type == 2 || type == 3) {
     //		kind = HandHeldMiniMapData.KIND.NORMAL_MONSTER;
     //		let _kind = getDescriptionOfKindMonster(wt);
     //		if (_kind) kind = _kind;
     //	}
     //
     //	if (type == 0 || type == 6) {
     //		kind = HandHeldMiniMapData.KIND.NPCS;
     //		let _kind = getDescriptionOfKindMonster(wt);
     //		if (_kind) kind = _kind;
     //	}
     //
     //	if (type == 5) {
     //		kind = HandHeldMiniMapData.KIND.NPCS;
     //		let _kind = getDescriptionOfKindMonster(wt);
     //		if (_kind) kind = _kind;
     //	}
     //
     //	if (type == 7) kind = HandHeldMiniMapData.KIND.RECOVERY;
     //
     //	return kind;
     //}

     function draw(ctx, dt) {
         let showObject = Engine.miniMapController.handHeldMiniMapController.getShowObject(HandHeldMiniMapData.TYPE.NPC);

         for (let kind in showObject) {
             let list = getListByKind(kind);

             for (let index in list) {
                 npc[index].draw(ctx, dt)
             }
         }
     }

     function levelIsCorrect(npcObj) {
         const mobLevel = npcObj.d.hasOwnProperty('elasticLevelFactor') ? Engine.npcs.getById(npcObj.d.id).getElasticMobLevel() : npcObj.d.lvl;

         let minLevel = Engine.miniMapController.handHeldMiniMapController.getMinLevel();

         return mobLevel >= minLevel;
     }

     function nameIsCorrect(npcObj) {
         let handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;
         let handHeldMiniMapWindow = handHeldMiniMapController.getHandHeldMiniMapWindow();

         let nick = npcObj.d.nick;

         return handHeldMiniMapWindow.nameIsCorrect(nick);
     }

     function getObject(id) {
         return npc[id];
     }

     this.draw = draw;
     this.init = init;
     this.deleteFromList = deleteFromList;
     this.updateData_npcs_del = updateData_npcs_del;
     this.addToList = addToList;
     this.updateData = updateData;
     this.clearAllLists = clearAllLists;
     this.getObject = getObject;

 };