/**
 * Created by Michnik on 2015-11-24.
 */

var Other = require('core/characters/Other');
//var FollowGlow = require('core/glow/FollowGlow');
let FollowController = require('core/FollowController');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
let ItemState = require('core/items/ItemState');
//let ColliderData = require('core/collider/ColliderData');
module.exports = function() {
    var items = [];
    var self = this;
    var itemHighlightUrl = '/img/gui/item_frames/frames/item_frames.png';
    let itemOverlayUrl = null;
    let overlayImage = null;

    var itemHighlightImageOffset = 0;
    var itemOverlayOffset = 0;
    //var enhancedItemId = -1;

    this.init = function() {
        self.initFetch();
        self.initDrop();
    };

    this.initDrop = function() {
        Engine.map.$worldPane.droppable({
            accept: '.item:not(.shop-item)',
            drop: function(e, ui) {
                var item = ui.draggable.data('item');

                //block drop on the map when trade or depo
                if (Engine.trade || Engine.depo || Engine.shop || Engine.auctions || Engine.mails || Engine.bonusReselectWindow ||
                    (Engine.crafting && (Engine.crafting.salvage || Engine.crafting.enhancement || Engine.crafting.extraction))) {
                    return;
                }

                //if (item.cl && item.st == 10) { //use bless drop
                if (item.cl && ItemState.isBlessSt(item.st)) { //use bless drop
                    Engine.heroEquipment.dropBless(item.id);
                    return;
                }

                //drop bottom items
                if (ui.draggable.hasClass('bottomItem')) {
                    Engine.interfaceItems.deleteExistItem(item.id, item);
                    return;
                }

                if (ui.draggable.hasClass('shop-item')) return;

                //drop on other
                var s = Engine.items.parseItemStat(item.stat);
                var emo = item.name == 'ÅnieÅ¼ka' ? 'snowball' : s.emo;
                var o = Engine.getCollisionAtEvent(e)[0];
                if (o && o instanceof Other && typeof(emo) != 'undefined') {
                    var oId = o.d.id;
                    _g('emo&a=' + emo + '&id=' + oId + '&iid=' + item.id);
                    return true;
                }

                var text = _t('item_drop_question', null, 'static') + '<br>';
                var callbacks = [];

                if (isPl()) {
                    let asterisk = ''
                    if (Engine.map.d.is_drop_item_tax) {
                        text += '<br>' + _t('item_throw_*info', null, 'static');
                        asterisk = '*'
                    }
                    callbacks.push({
                        txt: _t('item_drop_throw', null, 'static') + asterisk,
                        hotkeyClass: 'alert-accept-hotkey',
                        callback: function() {
                            _g('moveitem&st=-1&id=' + item.id);
                            Engine.heroEquipment.checkQuestTrack();
                            return true;
                        }
                    });
                }
                callbacks.push({
                    txt: _t('item_drop_destroy', null, 'static'),
                    hotkeyClass: '',
                    callback: function() {
                        _g('moveitem&st=-2&id=' + item.id);
                        Engine.heroEquipment.checkQuestTrack();
                        return true;
                    }
                }, {
                    txt: _t('item_drop_nothing', null, 'static'),
                    hotkeyClass: 'alert-cancel-hotkey',
                    callback: function() {
                        return true;
                    }
                });

                mAlert(text, callbacks);
            }
        });
    };

    this.getDrawableItems = function() {
        var arr = [];
        for (var i = items.length - 1; i > -1; i--) {
            arr.push(items[i]);
            // if (items[i].highlight) arr.push(items[i].highlight);
            //if (items[i].followGlow) arr.push(items[i].followGlow);

            let followController = items[i].getFollowController();
            if (followController.checkFollowGlow()) arr.push(followController.getFollowGlow());
        }
        return arr;
    };

    this.setGroundItemsAnimationsState = function(state) {
        for (var i in items) {
            items[i].setStaticAnimation(state);
        }
    };

    this.getItemById = function(id) {
        for (var i in items)
            if (items[i].i.id == id) return items[i];
    };

    this.getItemsByStatAndVal = function(stat, val) {
        let itemsToSend = [];
        for (var i in items) {
            let s = items[i].i._cachedStats;
            if (s.hasOwnProperty(stat) && s[stat] == val) itemsToSend.push(items[i]);
        }
        return itemsToSend.length ? itemsToSend : null;
    };

    this.clear = function() {
        items = [];
        // Engine.items.deleteMessItemsByLoc('m');
        Engine.items.deleteMessItemsByLoc(Engine.itemsFetchData.NEW_GROUND_ITEM.loc);
    };

    var mItem = function(i) {
        var _self = this;
        this.i = i;
        this.$ = i.$;
        this.overMouse = false;
        // this.canvasObjectType = 'mItem';
        this.canvasObjectType = CanvasObjectTypeData.M_ITEM;
        this.frames = null;
        this.sprite = null;
        this.activeFrame = 0;
        this.$.data('item', i);
        this.warShadowOpacity = 0;
        this.imgLoaded = false;
        this.tutorialOrder = 0;
        this.waterTopModify = 0;

        this.d = {
            id: i.id
        };

        this.hlImg = null;
        this.drawHl = false;
        this.overlay = null;
        this.hlLoad = false;

        var trackLock = new Lock(['image'], function() {
            //if (Engine.questTrack)
            //	Engine.questTrack.checkTaskNpcOrItem(_self.i.id, 'item');
        });

        let followController = null;

        this.init = () => {
            initFollowController();
        };

        const initFollowController = () => {
            followController = new FollowController();
            followController.init(getEngine().hero, _self);
        };

        this.getFollowController = function() {
            return followController
        };

        this.createImage = function() {
            Engine.imgLoader.onload(itemHighlightUrl, false,
                (i) => {
                    this.beforeOnloadHL(i);
                },
                (i) => {
                    this.afterOnloadHL(i);
                }
            );

        };

        this.beforeOnloadHL = (i) => {
            _self.fw = 32;
            _self.fh = 32;
            _self.hlImg = i;
        };

        this.afterOnloadHL = (i) => {
            _self.hlLoad = true;
        };

        this.createHl = function() {
            if (!this.drawHl && this.hlLoad) {
                this.hlImg.src = itemHighlightUrl;
                var cns = document.createElement("canvas");
                var ctx = cns.getContext("2d");
                cns.width = 32;
                cns.height = 32;

                var bgX = this.i.hlPos * this.fw;
                var bgY = itemHighlightImageOffset * this.fh;
                ctx.drawImage(this.hlImg, bgX, bgY, this.fw, this.fh, 0, 0, this.fw, this.fh);

                this.drawHl = cns;
            }
            return this.drawHl;
        };

        this.updateHl = function() {
            // this.hlLoad = false;
            this.drawHl = false;
            // this.hlImg.src = itemHighlightUrl;
        };

        this.changeWarShadowOpacity = function(dt) {
            if (_self.warShadowOpacity != 1 && _self.imgLoaded) {
                //if (Engine.opt(8)) return _self.warShadowOpacity = 1;
                if (!isSettingsOptionsInterfaceAnimationOn()) {
                    return _self.warShadowOpacity = 1;
                }
                if (_self.warShadowOpacity > 1) return _self.warShadowOpacity = 1;
                _self.warShadowOpacity += dt * 2;
            }
        };

        this.increaseTutorialOrder = () => {
            this.tutorialOrder = 0; // exception!! All object on canvas has tutorialOrder=301. Ground item have 0, because not have collision with hero, and hero need cover ground item
        };

        this.clearTutorialOrder = () => {
            this.tutorialOrder = 0;
        };

        this.drawOverlayObject = (ctx, left, top, enhancementUpgradeLvl) => {

            if (itemOverlayUrl == null) {
                return;
            }

            if (!overlayImage) {
                return;
            }

            if (!this.overlay) {
                this.overlay = this.createOverlay(enhancementUpgradeLvl);
            }

            ctx.drawImage(this.overlay, left, top);
        }

        this.createOverlay = (enhancementUpgradeLvl) => {
            let cns = document.createElement("canvas");
            let ctx = cns.getContext("2d");

            let itemSize = 32;

            cns.width = itemSize;
            cns.height = itemSize;

            let bgX = this.i.hlPos * itemSize;
            let bgY = parseInt(enhancementUpgradeLvl) * itemSize + itemSize;

            ctx.drawImage(
                overlayImage,
                bgX, bgY,
                this.fw, this.fh,
                0, 0,
                this.fw, this.fh
            );

            return cns;
        };

        this.draw = function(ctx) {
            if (this.frames && this.sprite) {
                ctx.globalAlpha = _self.warShadowOpacity;

                let mapShift = Engine.mapShift.getShift();

                this.createHl();
                //if (this.drawHl && !(Engine.hero.d.opt & 4096)) {

                let left = Math.round(this.i.x * 32 - Engine.map.offset[0] - mapShift[0]);
                let top = Math.round(this.i.y * 32 - Engine.map.offset[1] - mapShift[1]);

                let showRank = isSettingsOptionsShowItemsRankOn();


                if (this.drawHl && showRank) {
                    ctx.drawImage(
                        this.drawHl,
                        0, 0,
                        32, 32,
                        left,
                        top,
                        32, 32);
                }

                ctx.drawImage(
                    this.sprite,
                    0,
                    this.staticAnimation ? 0 : (this.activeFrame * 32),
                    32, 32,
                    left,
                    top,
                    32, 32);
                ctx.globalAlpha = 1;

                if (showRank) {

                    let enhancementUpgradeLvl = this.i.getEnhancementUpgradeLvl()

                    if (enhancementUpgradeLvl) {
                        this.drawOverlayObject(ctx, left, top, enhancementUpgradeLvl);
                    }
                }
            }
        };

        this.onhover = function(e, show) {
            _self.overMouse = show;
            //_self.setCursor(show);
            //getEngine().interface.setCursor(show, ColliderData.CURSOR.PICK_UP);
            getEngine().interface.setPickUpCursor(show);
            _self.updateExpireItems(show);
        };

        this.updateExpireItems = function(show) {
            var $GC = Engine.interface.get$GAME_CANVAS();
            if (i.stat.match(/expires=([0-9]+)/)) {
                if (show) {
                    this.tip = i.getTipData();
                    i.interval = setInterval(function() {
                        i.setTip($GC);
                        $GC.trigger('tipupdate');
                    }, 1000);
                } else {
                    i.setTip($GC, null);
                    clearInterval(i.interval);
                }
            }
        };

        //this.setCursor = function (show) {
        //	const $GC 		= Engine.interface.get$GAME_CANVAS();
        //	const PICK_UP 	= ColliderData.CURSOR.PICK_UP;
        //
        //	if (show) 	$GC.addClass(PICK_UP);
        //	else 		$GC.removeClass(PICK_UP);
        //};

        this.setStaticAnimation = function(state) {
            if (IE) this.staticAnimation = true;
            else this.staticAnimation = state;
        };

        this.oncontextmenu = (e) => {
            var menu = [];

            menu.push([_t('take', null, 'menu'), function() {
                Engine.hero.addAfterFollowAction(_self, function() {
                    _g("takeitem&id=" + _self.d.id);
                });
            }]);

            Engine.interface.showPopupMenu(menu, e, true);
            return true;
        };

        this.getFar = () => {
            return Engine.hero.d.x != _self.i.x || Engine.hero.d.y != _self.i.y
        };

        //this.addFollow = function () {
        //	let refFollowObj = Engine.hero.getRefFollowObj();
        //	if (refFollowObj) {
        //		//if (refFollowObj.constructor.name == _self.constructor.name && refFollowObj.d.id == _self.d.id) return;
        //		if (refFollowObj.canvasObjectType == _self.canvasObjectType && refFollowObj.d.id == _self.d.id) return;
        //		Engine.hero.clearRefFollowObj();
        //	}
        //
        //	_self.followGlow = new FollowGlow();
        //	_self.followGlow.createObject(_self, 'red');
        //	Engine.hero.setRefFollowObj(_self);
        //};
        //
        //this.clearFollow = function () {
        //	delete _self.followGlow
        //};

        var timePassed = 0;

        this.update = function(dt) {
            this.changeWarShadowOpacity(dt);
            if (this.frames && this.frames.length > 1 && !IE) {
                timePassed += dt * 100;
                if (this.frames[this.activeFrame].delay < timePassed) {
                    timePassed = timePassed - this.frames[this.activeFrame].delay;
                    this.activeFrame = (this.frames.length == this.activeFrame + 1 ? 0 : this.activeFrame + 1);
                }
            }
        };

        this.getOrder = function() {
            return 0.1 + this.tutorialOrder;
        };

        this.afterOnloadItem = (f, image) => {

            _self.fw = 32;
            _self.fh = 32;
            _self.frames = f.frames;
            _self.activeFrame = 0;
            _self.sprite = image;

            _self.collider = {
                box: [
                    i.x * 32,
                    i.y * 32,
                    i.x * 32 + 32,
                    i.y * 32 + 32
                ]
            };

            _self.imgLoaded = true;
            trackLock.unlock('image');
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 20);
        };

        this.gifFetch = function() {
            let path = CFG.r_ipath + i.icon;

            Engine.imgLoader.onload(path, {
                    speed: false,
                    externalSource: cdnUrl
                }, false,
                (i, f) => {
                    _self.afterOnloadItem(f, i);
                }
            );
        };

        i.on('delete', function() {
            //if (Engine.questTrack)
            //	Engine.questTrack.checkTaskNpcOrItem(_self.i.id, 'item');
            items.splice(items.indexOf(_self), 1);
            //delete(_self);
        });

        this.createImage();
        this.gifFetch();
        this.tip = i.getTipData();
        //this.setStaticAnimation(Engine.opt(8));
        this.setStaticAnimation(!isSettingsOptionsInterfaceAnimationOn());
    };

    this.update = function(dt) {
        for (var i = 0; i < items.length; i++) {
            items[i].update(dt);
        }
    };

    /**
     * Returns list of items in current position. Empty list if there is no items
     * @param x
     * @param y
     * @returns {Array} item objects list
     */
    this.getGroundItemOnPosition = function(x, y) {
        var list = [];
        for (var i in items) {
            if (items[i].i.x == x && items[i].i.y == y) {
                list.push(items[i].i);
            }
        }
        return list;
    };

    this.initFetch = function() {
        //Engine.items.fetch('m', self.newGroundItem);
        Engine.items.fetch(Engine.itemsFetchData.NEW_GROUND_ITEM, self.newGroundItem);
    };

    this.newGroundItem = function(i) {
        if (i.own != Engine.map.d.id) return;
        var item = new mItem(i);
        item.init();
        item.d = {
            id: i.id,
            x: i.x,
            y: i.y
        };
        item.rx = i.x;
        item.ry = i.y;
        items.push(item);
        //if (Engine.questTrack) Engine.questTrack.checkTaskNpcOrItem(i.id, 'item');
    };

    this.changeFrames = function(imageUrl, offset) {
        itemHighlightUrl = imageUrl;
        itemHighlightImageOffset = offset;
        for (let item of items) {
            if (isset(item.hlImg)) {
                item.updateHl();
                // item.createImage();
            }
        }
    };

    this.changeOverlays = function(overlayUrl, bgPosY) {
        itemOverlayUrl = overlayUrl;

        setOverlayImage(null);

        for (let item of items) {
            if (isset(item.hlImg)) {
                item.overlay = null;
            }
        }

        if (itemOverlayUrl == null) {
            return;
        }

        loadOverlay();
    };

    const setOverlayImage = (_overlayImage) => {
        overlayImage = _overlayImage;
    };

    const loadOverlay = () => {
        Engine.imgLoader.onload(itemOverlayUrl, false,
            (i) => {

            },
            (i) => {
                setOverlayImage(i);
            }
        );
    }
};