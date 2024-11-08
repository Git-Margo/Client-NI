 //let MiniMapObject = require('core/map/handheldMiniMap/MiniMapObjectNew');
 let MiniMapObject = require('core/map/handheldMiniMap/MiniMapObject');
 let HandHeldMiniMapData = require('core/map/handheldMiniMap/HandHeldMiniMapData');
 var SocietyData = require('core/society/SocietyData');

 module.exports = function() {

     let friend = {};
     let enemy = {};
     let clan = {};
     let allyClan = {};
     let enemyClan = {};
     let group = {};
     let wanted = {};
     let markObject = {};
     let normalOther = {};

     let others = {};

     function init() {

     }

     function clearAllLists() {
         friend = {};
         enemy = {};
         clan = {};
         allyClan = {};
         enemyClan = {};
         group = {};
         wanted = {};
         markObject = {};
         normalOther = {};

         others = {};
     }

     function getListByKind(kind) {
         switch (kind) {
             case HandHeldMiniMapData.KIND.MARK_OBJECT:
                 return markObject;
             case HandHeldMiniMapData.KIND.NORMAL_OTHER:
                 return normalOther;
             case HandHeldMiniMapData.KIND.FRIEND:
                 return friend;
             case HandHeldMiniMapData.KIND.ENEMY:
                 return enemy;
             case HandHeldMiniMapData.KIND.CLAN:
                 return clan;
             case HandHeldMiniMapData.KIND.CLAN_FRIEND:
                 return allyClan;
             case HandHeldMiniMapData.KIND.CLAN_ENEMY:
                 return enemyClan;
             case HandHeldMiniMapData.KIND.GROUP:
                 return group;
             case HandHeldMiniMapData.KIND.WANTED:
                 return wanted;
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

     function updateData(otherData) {
         for (let id in otherData) {

             if (otherData[id].del) {
                 deleteOther(id)
                 continue;
             }

             let obj = Engine.others.getById(id);

             if (!obj) {
                 console.warn('[MiniMapOtherController.js, updateData] Other not exist', id);
                 continue;
             }

             if (others[id]) updateOther(id);
             if (!others[id]) newOther(id, obj);

         }
     }

     function deleteOther(id) {
         others[id].remove();
         delete others[id];
     }

     function updateOther(id) {
         let obj = others[id].getRef();
         //let kind    = findKindOther(obj);
         let kind = obj.getKind();
         let oldKind = others[id].getKind();

         if (!nameIsCorrect(obj)) return;

         if (oldKind != kind) {
             others[id].deleteFromBelongList();
             others[id].setKind(kind);
             others[id].addToBelongList(HandHeldMiniMapData.TYPE.OTHER);
             others[id].clearImageObject();
             others[id].setColor();
             others[id].setShape();


             let alpha = kind == HandHeldMiniMapData.KIND.MARK_OBJECT ? 1 : null;
             others[id].setAlpha(alpha);
         }
         others[id].updateMapObjectInCords();
         others[id].setPos();
     }

     function newOther(id, obj) {
         let other = getEngine().others.getById(id);
         let kind = findKindOther(other);
         others[id] = new MiniMapObject();

         others[id].setRef(obj);
         others[id].setPos();
         others[id].setKind(kind);

         if (!nameIsCorrect(obj)) return;

         others[id].addToBelongList(HandHeldMiniMapData.TYPE.OTHER);
         others[id].addMapObjectToCords();
         others[id].setColor();
         others[id].setShape();

         let alpha = kind == HandHeldMiniMapData.KIND.MARK_OBJECT ? 1 : null;
         others[id].setAlpha(alpha);

         createTipToOther(others[id]);
     }

     function nameIsCorrect(otherObj) {
         let handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;
         let handHeldMiniMapWindow = handHeldMiniMapController.getHandHeldMiniMapWindow();

         let nick = otherObj.d.nick;

         return handHeldMiniMapWindow.nameIsCorrect(nick);
     }

     function findKindOther(oneOther) {

         //let handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;

         //if (isWhoIsMark(oneOther)) return HandHeldMiniMapData.KIND.MARK_OBJECT;
         //
         //return oneOther.getKind();

         return getEngine().others.findKindOther(oneOther);

         //if (handHeldMiniMapController.canUpdate(HandHeldMiniMapData.TYPE.OTHER, HandHeldMiniMapData.KIND.GROUP)        && isGroup(oneOther))         return HandHeldMiniMapData.KIND.GROUP;
         //if (handHeldMiniMapController.canUpdate(HandHeldMiniMapData.TYPE.OTHER, HandHeldMiniMapData.KIND.WANTED)       && isWanted(oneOther))        return HandHeldMiniMapData.KIND.WANTED;
         //if (handHeldMiniMapController.canUpdate(HandHeldMiniMapData.TYPE.OTHER, HandHeldMiniMapData.KIND.CLAN)           && isClanMember(oneOther))    return HandHeldMiniMapData.KIND.CLAN;
         //if (handHeldMiniMapController.canUpdate(HandHeldMiniMapData.TYPE.OTHER, HandHeldMiniMapData.KIND.ENEMY)           && isEnemy(oneOther))         return HandHeldMiniMapData.KIND.ENEMY;
         //if (handHeldMiniMapController.canUpdate(HandHeldMiniMapData.TYPE.OTHER, HandHeldMiniMapData.KIND.FRIEND)           && isFriend(oneOther))        return HandHeldMiniMapData.KIND.FRIEND;
         //if (handHeldMiniMapController.canUpdate(HandHeldMiniMapData.TYPE.OTHER, HandHeldMiniMapData.KIND.CLAN_ENEMY)        && isClanEnemy(oneOther))     return HandHeldMiniMapData.KIND.CLAN_ENEMY;
         //if (handHeldMiniMapController.canUpdate(HandHeldMiniMapData.TYPE.OTHER, HandHeldMiniMapData.KIND.CLAN_FRIEND)        && isClanFriend(oneOther))    return HandHeldMiniMapData.KIND.CLAN_FRIEND;
         ////if (handHeldMiniMapController.canUpdate('other', 'normal-other') && isNormal(oneOther))        return 'normal-other'
         ////if (handHeldMiniMapController.canUpdate('other', 'normal-other') && isNormal(oneOther))        return 'normal-other'
         //return HandHeldMiniMapData.KIND.NORMAL_OTHER;

     }

     function createTipToOther(miniMapObject) {
         const other = miniMapObject.getRef();
         const $wrapper = $('<div />')
         const avatar = $('<div class="avatar-icon" />');
         createImgStyle(avatar, CFG.a_opath + other.d.icon);
         $wrapper.append(other.createStrTip()).append(avatar);
         miniMapObject.setTip($wrapper, 't_other');
     }

     function isWhoIsMark(oneOther) {
         let mark = Engine.hero.markOtherObj;

         return mark && mark.d.id == oneOther.d.id;
     }

     function isGroup(oneOther) {
         let p = Engine.party;
         if (!p) return false;

         let id = oneOther.d.id;
         return p.getMembers()[id];
     }

     function isWanted(oneOther) {
         return oneOther.wanted;
     }

     function isClanMember(oneOther) {
         //return oneOther.d.relation == HandHeldMiniMapData.KIND.CLAN
         return oneOther.d.relation == SocietyData.RELATION.CLAN
     }

     function isFriend(oneOther) {
         //return oneOther.d.relation == HandHeldMiniMapData.KIND.FRIEND
         return oneOther.d.relation == SocietyData.RELATION.FRIEND
     }

     function isEnemy(oneOther) {
         //return oneOther.d.relation == HandHeldMiniMapData.KIND.ENEMY
         return oneOther.d.relation == SocietyData.RELATION.ENEMY
     }

     function isClanFriend(oneOther) {
         //return oneOther.d.relation == HandHeldMiniMapData.KIND.CLAN_FRIEND
         return oneOther.d.relation == SocietyData.RELATION.CLAN_ALLY
     }

     function isClanEnemy(oneOther) {
         //return oneOther.d.relation == HandHeldMiniMapData.KIND.CLAN_ENEMY
         return oneOther.d.relation == SocietyData.RELATION.CLAN_ENEMY
     }

     function draw(ctx, dt) {
         let showObject = Engine.miniMapController.handHeldMiniMapController.getShowObject(HandHeldMiniMapData.TYPE.OTHER);

         for (let kind in showObject) {
             //let tag = showObject[tagIndex];
             let list = getListByKind(kind);

             for (let index in list) {
                 others[index].draw(ctx, dt);
             }
         }
     }

     function getObject(id) {
         return others[id];
     }


     this.draw = draw;

     this.getObject = getObject;
     this.updateData = updateData;
     this.init = init;
     this.deleteFromList = deleteFromList;
     this.addToList = addToList;
     this.clearAllLists = clearAllLists;
 };