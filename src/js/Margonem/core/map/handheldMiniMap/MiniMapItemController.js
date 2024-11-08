 //let MiniMapObject = require('core/map/handheldMiniMap/MiniMapObjectNew');
 let MiniMapObject = require('core/map/handheldMiniMap/MiniMapObject');
 let HandHeldMiniMapData = require('core/map/handheldMiniMap/HandHeldMiniMapData');


 module.exports = function() {

     let recovery = {};

     let item = {};


     function init() {
         setFetch();
     }

     function setFetch() {
         //Engine.items.fetch('m', newMiniMapGroundItemMiniMap);
         Engine.items.fetch(Engine.itemsFetchData.NEW_MINI_MAP_GROUND_ITEM, newMiniMapGroundItemMiniMap);
     }

     function clearFetch() {
         Engine.items.removeCallback(Engine.itemsFetchData.NEW_MINI_MAP_GROUND_ITEM);
     }

     function newMiniMapGroundItemMiniMap(itemData) {


         let id = itemData.d.id;
         item[itemData.d.id] = new MiniMapObject();

         item[id].setRef(itemData);
         item[id].setKind(HandHeldMiniMapData.KIND.RECOVERY);

         if (!nameIsCorrect(itemData)) return;

         item[id].addToBelongList(HandHeldMiniMapData.TYPE.ITEM);
         item[id].addMapObjectToCords();
         item[id].setColor();
         item[id].setShape();
         item[id].addMapObjectToCords();

         createTipToItem(item[id]);

         itemData.on('delete', function() {
             if (!item[id]) return;
             item[id].remove();
             delete item[id];
         });
     }

     function nameIsCorrect(itemData) {
         let handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;
         let handHeldMiniMapWindow = handHeldMiniMapController.getHandHeldMiniMapWindow();

         let name = itemData.name

         return handHeldMiniMapWindow.nameIsCorrect(name);
     }

     function getListByKind(kind) {
         switch (kind) {
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


     function draw(ctx, dt) {
         let showObject = Engine.miniMapController.handHeldMiniMapController.getShowObject(HandHeldMiniMapData.TYPE.ITEM);

         for (let kind in showObject) {
             let list = getListByKind(kind);

             for (let index in list) {
                 item[index].draw(ctx, dt)
             }
         }

     }

     function clearAllLists() {
         recovery = {};
         item = {};
     }

     function createTipToItem(miniMapObject) {
         let refObj = miniMapObject.getRef();

         let tip = parseItemBB(refObj.name) + '<div class="item-mini-map-icon" style="background-image:url(' + CFG.a_ipath + refObj.icon + '")></div>';

         miniMapObject.setTip(tip);
     }

     function getObject(id) {
         return item[id];
     }

     this.getObject = getObject;
     this.draw = draw;
     this.init = init;
     this.deleteFromList = deleteFromList;
     this.addToList = addToList;
     this.setFetch = setFetch;
     this.clearFetch = clearFetch;
     this.clearAllLists = clearAllLists;

 }