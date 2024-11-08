 //let MiniMapObject = require('core/map/handheldMiniMap/MiniMapObjectNew');
 let MiniMapObject = require('core/map/handheldMiniMap/MiniMapObject');
 let HandHeldMiniMapData = require('core/map/handheldMiniMap/HandHeldMiniMapData');

 module.exports = function() {

     let hero;

     function init() {

     }

     function updateData() {

         if (hero) updateHero();
         else newHero();

     }

     function newHero() {
         hero = new MiniMapObject();
         hero.setRef(Engine.hero);
         hero.setKind(HandHeldMiniMapData.KIND.HERO);
         hero.setColor();
         hero.setShape();
         hero.setBelongType(HandHeldMiniMapData.TYPE.HERO);
         hero.addMapObjectToCords();
         hero.setPos();

         createTipToHero(hero);
     }

     function updateHero() {
         hero.updateMapObjectInCords();
         hero.setPos();
     }

     function draw(ctx, dt) {

         let handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;

         if (handHeldMiniMapController.canUpdate(HandHeldMiniMapData.TYPE.HERO, HandHeldMiniMapData.KIND.HERO)) {

             if (!hero) return;

             hero.draw(ctx);

             //if (!Engine.warShadow.canDraw || !Engine.settings || Engine.opt(24)) return;
             if (!Engine.warShadow.canDraw || !Engine.settings || !isSettingsOptionsWarShadowOn()) {
                 return;
             }

             hero.drawWarShadow(ctx, dt);
         }

     }

     function clearAllLists() {
         hero = null;
     }

     function getObject() {
         return hero;
     }

     function createTipToHero(miniMapObject) {
         const $wrapper = $('<div />')
         const avatar = $('<div class="avatar-icon" />');
         createImgStyle(avatar, CFG.a_opath + Engine.hero.d.img);
         $wrapper.append(Engine.hero.createStrTip()).append(avatar);
         miniMapObject.setTip($wrapper, 't_other');
     }

     this.init = init;
     this.updateData = updateData;
     this.clearAllLists = clearAllLists;
     this.getObject = getObject;
     this.draw = draw;

 };