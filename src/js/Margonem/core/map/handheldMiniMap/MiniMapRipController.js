 //let MiniMapObject = require('@core/map/handheldMiniMap/MiniMapObjectNew');
 let MiniMapObject = require('@core/map/handheldMiniMap/MiniMapObject');
 let HandHeldMiniMapData = require('@core/map/handheldMiniMap/HandHeldMiniMapData');

 module.exports = function() {

     let rip = {};
     let allRipList = {};

     function init() {

     }

     function clearAllLists() {
         rip = {};
         allRipList = {};
     }

     function getListByKind(kind) {
         switch (kind) {
             case HandHeldMiniMapData.KIND.RIP:
                 return rip;
             default:
                 console.error('[MiniMapRipController.js, getListByKind] incorrect kind:', kind);
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

     function updateData(ripData) {
         for (let k in ripData) {

             let id = ripData[k].d.id;
             newRip(id);
         }
     }

     function newRip(id) {
         let obj = Engine.map.rip.getRipById(id);


         allRipList[id] = new MiniMapObject();
         allRipList[id].setRef(obj);
         allRipList[id].setKind(HandHeldMiniMapData.KIND.RIP);

         if (!nameIsCorrect(obj)) return;

         allRipList[id].addToBelongList(HandHeldMiniMapData.TYPE.RIP);
         allRipList[id].addMapObjectToCords();
         allRipList[id].setColor();
         allRipList[id].setShape();

         createTipToRip(allRipList[id]);
     }

     function deleteRip(id) {
         //console.log('remove rip', id);

         if (!allRipList[id]) {
             console.warn('[MiniMapRipController.js, deleteRip] Bug in Rips.js. Should be fix in future');
             return
         }

         allRipList[id].remove();
         delete allRipList[id];
     }


     function draw(ctx, dt) {
         let showObject = Engine.miniMapController.handHeldMiniMapController.getShowObject(HandHeldMiniMapData.KIND.RIP);

         for (let kind in showObject) {
             //let tag = showObject[tagIndex];
             let list = getListByKind(kind);

             for (let index in list) {
                 allRipList[index].draw(ctx, dt)
             }
         }

     }

     function createTipToRip(miniMapObject) {
         let refObj = miniMapObject.getRef();

         let icon = '<div class="rip-icon" style="background-image:url(/img/rip2.gif)"></div>';
         let tip = '<div>' + refObj.tip[0] + '</div>' + icon;

         miniMapObject.setTip(tip, 't_rip');
     }

     function nameIsCorrect(ripObj) {
         let handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;
         let handHeldMiniMapWindow = handHeldMiniMapController.getHandHeldMiniMapWindow();

         let nick = ripObj.nick;

         return handHeldMiniMapWindow.nameIsCorrect(nick);
     }

     function getObject(id) {
         return allRipList[id];
     }

     this.getObject = getObject;
     this.draw = draw;
     this.init = init;
     this.deleteFromList = deleteFromList;
     this.addToList = addToList;
     this.updateData = updateData;
     this.clearAllLists = clearAllLists;
     this.deleteRip = deleteRip;
 };