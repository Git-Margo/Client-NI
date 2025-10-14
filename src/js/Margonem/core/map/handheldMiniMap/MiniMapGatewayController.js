 //let MiniMapObject = require('@core/map/handheldMiniMap/MiniMapObjectNew');
 let MiniMapObject = require('@core/map/handheldMiniMap/MiniMapObject');
 let HandHeldMiniMapData = require('@core/map/handheldMiniMap/HandHeldMiniMapData');

 module.exports = function() {

     let gateway = {};
     let allGatewayList = {};

     function init() {

     }

     function clearAllLists() {
         gateway = {};
         allGatewayList = {};
     }

     function getListByKind(kind) {
         switch (kind) {
             case HandHeldMiniMapData.KIND.GATEWAY:
                 return gateway;
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

     function updateData(gatewayData) {
         //debugger;
         for (let k in gatewayData) {

             let id = gatewayData[k].d.id;
             newGateway(id);
         }
     }

     function newGateway(id) {
         let obj = Engine.map.gateways.getGtwById(id);

         if (!obj) {
             //debugger;
             console.error('noooo!');
         }

         for (let k in obj) {

             let newId = id + 'x' + obj[k].d.x + 'y' + obj[k].d.y;

             allGatewayList[newId] = new MiniMapObject();
             allGatewayList[newId].setRef(obj[k]);
             allGatewayList[newId].setKind(HandHeldMiniMapData.KIND.GATEWAY);

             if (!nameIsCorrect(obj[k])) continue;

             allGatewayList[newId].addToBelongList(HandHeldMiniMapData.TYPE.GATEWAY);
             allGatewayList[newId].addMapObjectToCords();
             allGatewayList[newId].setColor();
             allGatewayList[newId].setShape();

             createTipToGateway(allGatewayList[newId]);

         }
     }

     function nameIsCorrect(gatewatObj) {
         let handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;
         let handHeldMiniMapWindow = handHeldMiniMapController.getHandHeldMiniMapWindow();

         let tipContent = isset(gatewatObj.tip) ? gatewatObj.tip[0] : gatewatObj.master.tip[0];

         return handHeldMiniMapWindow.nameIsCorrect(tipContent);
     }

     // function deleteGateway (id) {
     // 	//console.log('delete Gateway', id);
     //
     // 	let obj   = Engine.map.gateways.getGtwById(id);
     // 	let newId = id + 'x' + obj[k].d.x + 'y' + obj[k].d.y;
     //
     // 	if (!allGatewayList[id]) {
     // 		console.warn('[MiniMapGatewayController.js, deleteGateway]gateway not exist', id);
     // 		return
     // 	}
     //
     // 	allGatewayList[id].remove();
     // 	delete allGatewayList[id];
     // }


     function draw(ctx, dt) {
         let showObject = Engine.miniMapController.handHeldMiniMapController.getShowObject(HandHeldMiniMapData.TYPE.GATEWAY);

         for (let kind in showObject) {
             //let tag = showObject[tagIndex];
             let list = getListByKind(kind);

             for (let index in list) {
                 allGatewayList[index].draw(ctx, dt)
             }
         }


     }

     function createTipToGateway(miniMapObject) {

         let refObj = miniMapObject.getRef();

         let tipContent = isset(refObj.tip) ? refObj.tip[0] : refObj.master.tip[0]; // for follow-glow
         let icon = '<div class="exit-icon" style="background-image:url(/img/exit.png)"></div>';
         let tip = '<div>' + tipContent + '</div>' + icon;

         miniMapObject.setTip(tip);
     }

     function getObject(id) {
         return allGatewayList[id];
     }

     this.draw = draw;
     this.init = init;
     this.deleteFromList = deleteFromList;
     this.addToList = addToList;
     this.updateData = updateData;
     this.clearAllLists = clearAllLists;
     this.getObject = getObject;
     // this.deleteGateway      = deleteGateway;
 };