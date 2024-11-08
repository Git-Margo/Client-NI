/**
 * Created by lukasz on 2014-12-01.
 */
//var R = require('core/Renderer');
//var Interface = require('core/Interface');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
module.exports = function() {
    var list = [];
    var self = this;
    this.test = function() {
        return list;
    };

    this.topHoverObject = null;
    this.hoverCheck = function(e, o) {
        if (self.topHoverObject != o) {
            if (self.topHoverObject && self.topHoverObject.onhover) self.topHoverObject.onhover(e, false);
            //if (self.topHoverObject && self.topHoverObject.onhover && Engine.rajCharacterHide.checkShowTip(self.topHoverObject)) self.topHoverObject.onhover(e, false);
            self.topHoverObject = o;
            if (isset(o) && isset(o.onhover) && Engine.rajCharacterHide.checkShowTip(o) && Engine.rajMassObjectHide.checkShowTip(o)) o.onhover(e, true);
            if (o && o.tip && o.tip[0]) {

                if (self.checkObjectIsNpc(o)) o.refreshTip();

                if (Engine.rajCharacterHide.checkShowTip(o) && Engine.rajMassObjectHide.checkShowTip(o)) Engine.canvasTip.show(e, self.topHoverObject);

            } else {
                Engine.canvasTip.hide(e);
            }
        }
    };

    this.addToClickEventsMenu = function(menu, obj, e) {
        let nick;

        switch (obj.canvasObjectType) {
            case CanvasObjectTypeData.FAKE_NPC:
            case CanvasObjectTypeData.NPC:
            case CanvasObjectTypeData.OTHER:
            case CanvasObjectTypeData.HERO:
                nick = obj.d.nick;
                break;
            case CanvasObjectTypeData.PET:
                nick = obj.d.name;
                break;
            case CanvasObjectTypeData.M_ITEM:
                nick = obj.i.name;
                break;
            case CanvasObjectTypeData.GATEWAY:
                nick = _t('gw');
                break;
            default:
                errorReport('EventCollider', 'addToClickEventsMenu', `Incorrect CanvasObjectTypeData ${obj.canvasObjectType}`)
                nick = obj.canvasObjectType;
        }

        menu.push([nick, function() {
            obj.oncontextmenu(e);
        }]);
    };

    this.dispatch = function(e, x, y) {
        if (!Engine.allInit) return []; // for events when goes by door
        var list = Engine.renderer.getCollisionsAt(x, y);
        this.hoverCheck(e, list[0]); //trigger hover events on top stack item
        var f_name = 'on' + e.type;
        if (!Engine.interfaceStart) return;
        switch (e.type) {
            case 'mouseup':
            case 'mousedown':
            case 'mousemove':
                for (var i = 0; i < list.length; i++) {
                    if (list[i][f_name]) {
                        var ret = list[i][f_name](e);
                        if (!ret) break;
                    }
                }
                break;
            case 'click': {
                //Engine.lastClickOnCanvas = [e, x, y];
                getEngine().setLastClickOnCanvas([e, x, y]);
                //Engine.hero.startClickOnMapMove = true;
                getEngine().hero.setStartClickOnMapMove(true);

                let normalNpc = this.checkIsNormalNpcFromListAndGet(list);
                let npcAndGatewayOnSamePos = self.checkIsNpcAndGatewayOnList(list);
                let refFollowObj = Engine.hero.getRefFollowObj();

                if (!normalNpc && refFollowObj) Engine.hero.clearRefFollowObj();

                for (var i = 0; i < list.length; i++) {
                    if (!list[i][f_name]) continue;
                    if (!isset(list[i][f_name])) continue;

                    let isGateway = self.checkObjectIsGateway(list[i]);
                    if (npcAndGatewayOnSamePos && isGateway) continue;

                    let canvasFocusIsActive = Engine.canvasFocus.getActive();

                    if (canvasFocusIsActive) { // craaazy exception... I'm dying inside...
                        let isNpc = this.checkObjectIsNpc(list[i]);
                        if (isNpc) {
                            list[i].onclick(e);

                            break;
                        }
                    }

                    var ret = list[i][f_name](e);
                    if (!ret) break;
                }

                break;
            }
            case 'contextmenu': {
                //Engine.lastClickOnCanvas = [e, x, y];
                getEngine().setLastClickOnCanvas([e, x, y]);
                //Engine.hero.startClickOnMapMove = true;
                getEngine().hero.setStartClickOnMapMove(true);

                var toMenu = [];
                for (var i = 0; i < list.length; i++) {
                    var haveType = this.checkType(list[i]);
                    var name = haveType ? list[i].canvasObjectType : null;
                    if (!list[i][f_name]) continue;
                    if (!name) {
                        if (isset(list[i].gateways)) continue; //if have gateways is map
                        list[i][f_name](e);
                    } else {
                        self.addToClickEventsMenu(toMenu, list[i], e);
                    }
                }
                if (toMenu.length > 0) {
                    if (toMenu.length == 1) {
                        let normalNpc = this.checkIsNormalNpcFromListAndGet(list);
                        if (normalNpc) {
                            let type = normalNpc.d.type;
                            let isDialogueNpc = type == 0 || type == 5 || type == 6 || type == 7;

                            if (!isDialogueNpc) {

                                normalNpc.getFollowController().addFollowGlow();
                            }
                        }
                        toMenu[0][1](e);
                    } else Engine.interface.showPopupMenu(toMenu, e);
                }
                break;
            }
        }
        return list;
    };

    this.samePos = function(obj1, obj2) {
        return obj1.d.x == obj2.d.x && obj1.d.y == obj2.d.y;
    };

    this.checkObjectIsNpc = (obj) => {
        return obj.canvasObjectType == CanvasObjectTypeData.NPC;
    };

    this.checkObjectIsGateway = (obj) => {
        return obj.canvasObjectType == CanvasObjectTypeData.GATEWAY;
    };

    this.checkIsNormalNpcFromListAndGet = function(list) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].canvasObjectType == CanvasObjectTypeData.NPC) return list[i];
        }
        return false;
    };

    this.checkIsNpcAndGatewayOnList = function(list) {
        let isNpc = false;
        let isGateway = false;

        for (let i = 0; i < list.length; i++) {

            if (self.checkObjectIsGateway(list[i])) isGateway = true;
            if (self.checkObjectIsNpc(list[i])) isNpc = true;

        }

        return isNpc && isGateway;
    };

    this.getMapFromList = function(list) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].canvasObjectType == CanvasObjectTypeData.MAP) return list[i];
        }
    };


    this.checkType = (oneD) => {
        if (!isset(oneD.canvasObjectType)) return false;
        if (oneD.canvasObjectType == CanvasObjectTypeData.PET) {
            let e = this.getEngine();
            if (oneD.d.master.d.id != e.hero.d.id) return false;
        }
        return true;
    };

    this.getEngine = () => {
        return Engine;
    }
};