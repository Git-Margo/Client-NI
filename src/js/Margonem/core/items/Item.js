/**
 * Created by lukasz on 2014-10-21.
 */
var Templates = require('core/Templates');
var ChooseOutfit = require('core/ChooseOutfit');
var ShowItemDetails = require('core/ShowItemDetails');
let ShowMiniature = require('core/ShowMiniature');
let CharacterData = require('core/characters/CharactersData')
let ItemNotice = require('core/items/ItemNotice');
var ItemState = require('core/items/ItemState');
var ItemClass = require('core/items/ItemClass');
var ItemLocation = require('core/items/ItemLocation');

module.exports = function(i, d, kind) {
    var self = this;
    var itemTypes = { //[className, posSprite * 32 (only canvas), sort number]
        'heroic': ['t-her', 2, 2],
        'upgraded': ['t-upgraded', 3, 3],
        'elite': ['t-uniupg', 1, 1],
        'unique': ['t-uniupg', 1, 1],
        'legendary': ['t-leg', 4, 4],
        'artefact': ['t-art', 5, 5],
        'common': ['t-norm', 0, 0] // must be last
    };

    //let notice = {
    //	healthItem         : false,
    //	enhanceReagentItem : false,
    //	noBonusItem        : false,
    //	expiresItem        : false,
    //	lootBoxItem		   : false
    //};

    let enhancementUpgradeLvl = null;

    let showNotice = {};

    var timePassed = 0;
    var shouldDrawIcon = null;
    let shouldDrawNotice = false;
    var initFetch = true;
    var firstInit = true;

    this.$ = Templates.get('item');
    this.$.data('item', this);
    this.id = i;
    this.events = {};
    this._cachedStats = null;
    this.onload = false;
    //this.hasMenu = false;
    this.itemType = null;
    this.hlPos = null;
    this.score = null;
    this.ctx;
    this.$canvasIcon;

    let $canvasNotice = null;
    let ctxNotice = null;
    let clearCanvasNoticeAfterRemoveNotice = false;

    if (kind == 'tpl') this.st = 0;

    this.createNotice = (kindNotice) => {

        if (showNotice[kindNotice]) return
        let oneNotice = new ItemNotice(kindNotice);
        oneNotice.init(kindNotice, this);
        showNotice[kindNotice] = oneNotice;

    };

    this.removeNotice = (kindNotice) => {
        if (!showNotice[kindNotice]) return
        clearCanvasNoticeAfterRemoveNotice = true;
        delete showNotice[kindNotice];
    }

    this.clearCanvasNotice = () => {
        let view = this.getView();

        for (let k in view) {
            let noticeCtx = view[k][4];

            if (this.isItem()) noticeCtx = view[k][4];
            else noticeCtx = view[k][5];

            let canvas = noticeCtx.canvas;

            noticeCtx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    this.update = (d, idFetchPackage) => {
        //this.trigger('beforeUpdate', d);
        // if (Engine.reload && isset(d.loc) && d.loc == 'g' &&
        // if (Engine.reload && isset(d.loc) && d.loc == Engine.itemsFetchData.NEW_EQUIP_ITEM.loc &&
        if (Engine.reload && isset(d.loc) && ItemLocation.isEquipItemLoc(d.loc) &&
            !(isset(Engine.hero.oldLvl) && Engine.hero.oldLvl > Engine.hero.d.lvl && Engine.hero.d.lvl === 1) // dirty fix for lvl-down to 1 (items update - for Berufs)
        ) return;
        var old = {};
        for (var i in d) {
            old[i] = this[i];
            this[i] = d[i];
        }

        // if (this.loc == 'm') {
        if (ItemLocation.isGroundItemLoc(this.loc)) {
            this.d = {
                id: d.hid,
                x: this.x,
                y: this.y
            };

            this.rx = this.x;
            this.ry = this.y;
        }


        this._cachedStats = this.parseStats();

        if (firstInit) {

            this.createHighlight();
            // this.checkMenuExist();
            this.$.attr('data-name', parseItemBB(this.name));
            this.$.addClass('item-id-' + this.id);
        }

        setEnhancementUpgradeLvl(this._cachedStats['enhancement_upgrade_lvl'] ? this._cachedStats['enhancement_upgrade_lvl'] : null)

        this.updateAmount();
        this.updateCl();
        this.updateTtl();

        this.addScore();

        if (this.isItem()) this.checkGetNow(d);

        self.updateIcon();

        if (!initFetch) this.setTip();

        if (this.isItem()) this.trigger('afterUpdate', old, idFetchPackage);

        Engine.itemsMarkManager.newItem(self);

        if (firstInit) {
            firstInit = false;
            self.continueFetch();
        }
    };

    this.updateIcon = () => {
        if (!initFetch) return;
        initFetch = false;
        var path = CFG.r_ipath + this.icon;

        self.setPlaceHolderIcon();

        Engine.imgLoader.onload(path, {
                speed: false,
                externalSource: cdnUrl
            },
            false,
            (i, f) => {
                self.afterOnloadItem(f, i);
            },
            () => {
                log('Fetch error! Path: ' + path + ' (' + self.name + ')');
            });
    };

    this.setIdFetchPackage = function(idFetchPackage) {
        self.idFetchPackage = idFetchPackage;
    };

    this.updateDraw = function(dt) {
        self.animate(dt);
        // self.updateNotice()
    };

    this.drawItem = function(ctx, canvas, kind, shouldDrawNotice, noticeCanvas, noticeCtx) {

        //if (kind == Engine.itemsViewData.BAG_VIEW && self.st == 0) {
        if (kind == Engine.itemsViewData.BAG_VIEW && ItemState.isInBagSt(self.st)) {
            let activeBag = Engine.heroEquipment.getActiveBag() - 20;
            if (activeBag != Math.floor(self.y / 6)) return
        }

        if (shouldDrawIcon) this.drawIcon(ctx, canvas);
        if (shouldDrawNotice) this.drawNotice(noticeCtx, noticeCanvas);
    };

    this.drawIcon = (ctx, canvas) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            self.sprite,
            0,
            self.staticAnimation ? 0 : (self.activeFrame * 32),
            32, 32,
            0,
            0,
            32, 32);
    }

    this.drawNotice = (ctx, canvas) => {
        if (clearCanvasNoticeAfterRemoveNotice) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        if (!Object.keys(showNotice).length) return

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        clearCanvasNoticeAfterRemoveNotice = false;

        for (let k in showNotice) {
            showNotice[k].draw(ctx, canvas);
        }
    };

    //this.checkNoticeExist = () => {
    //	for (let k in notice) {
    //		if (notice[k]) return true
    //	}
    //	return false;
    //};

    this.animate = function(dt) {
        if (shouldDrawIcon === null) {
            setShouldDrawIcon(true);
            return
        }

        if (this.frames && this.frames.length > 1 && dt) {
            timePassed += dt * 100;

            if (this.frames[this.activeFrame].delay < timePassed) {
                timePassed = timePassed - this.frames[this.activeFrame].delay;
                this.activeFrame = (this.frames.length == this.activeFrame + 1 ? 0 : this.activeFrame + 1);
                //shouldDrawIcon = true;
                setShouldDrawIcon(true);
            } else {
                //shouldDrawIcon = false;
                setShouldDrawIcon(false);
            }

        } else {
            //shouldDrawIcon = false;
            setShouldDrawIcon(false);
        }
    };

    this.setPlaceHolderIcon = () => {
        let i = Engine.items.getPlaceholderItem();
        self.fw = 32;
        self.fh = 32;
        self.halffw = 16;
        self.halffh = 16;
        self.activeFrame = 0;
        self.sprite = i;
        self.$canvasIcon = self.$.find('.canvas-icon');
        self.ctx = self.$canvasIcon[0].getContext("2d");
        self.ctx.drawImage(i, 0, 0);
    };

    this.afterOnloadItem = (f, i) => {
        this.fw = f.hdr.width / 4;
        this.fh = f.hdr.height / 4;
        this.halffw = this.fw / 2;
        this.halffh = this.fh / 2;
        this.frames = f.frames;
        this.activeFrame = 0;
        this.sprite = i;
        this.imgLoaded = true;
        this.onload = true;
        this.ctx = this.$canvasIcon[0].getContext("2d");

        this.ctx.clearRect(0, 0, this.$canvasIcon[0].width, this.$canvasIcon[0].height);
        this.ctx.drawImage(i, 0, 0);
        this.setTip()

        if (this.isItem()) Engine.items.changePlaceHolderIconIntoNormalIcon(this.id);
        else Engine.tpls.changePlaceHolderIconIntoNormalIcon(this.id, this.loc);
    }

    this.continueFetch = function() {
        if (self.isItem()) {
            Engine.items.newItemInLocation(self.loc, self, self.idFetchPackage);
        } else {
            Engine.tpls.newTplInLocation(self.loc, self, self.idFetchPackage);
        }
    };

    this.fetchError = function() {
        console.log('fetch error');
    };

    this.getTpl = () => {
        return this.isItem() ? this.tpl : this.id;
    }

    this.isItem = function() {
        return kind == 'item';
    };

    this.updateDynamicTips = ($view, regex, timeout) => {
        if (this.stat.match(regex)) {
            let interval;
            $view.on('mouseover', () => {
                this.setTip($view)
                interval = setInterval(() => {
                    if (!$view.is(":visible")) clearInterval(interval); // fix for dragging clone item
                    this.setTip($view)
                }, timeout);
            });
            $view.on('mouseleave', () => {
                clearInterval(interval);
            });
        }
    };

    this.updateTtl = () => {
        if (ItemState.isBlessSt(this.st)) {
            if (parseInt(this._cachedStats.ttl) === 1) {
                this.$.addClass('very-low-value');
                message(_t('bless_soon_end'))
            } else {
                this.$.removeClass('very-low-value');
            }
        }
    }

    this.updateAmount = function() {
        var amount = null;

        var isBag = ItemClass.isBagCl(this.cl) && ItemLocation.isEquipItemLoc(this.loc) && ItemState.isBagSlotSt(this.st);
        var isCursed = isset(this._cachedStats.cursed);
        var am = isset(this._cachedStats.amount) ? this._cachedStats.amount : 0;

        if (!ItemState.isBlessSt(this.st) && am > 0) {
            amount = am;
        }

        //create .amount object and update numbers
        if (amount || isBag || isCursed) {
            var $am = $('.amount', this.$);
            var str;
            if (isBag) {
                this.$.addClass('bag');
                str = '';
            } else str = amount;
            if (!$am.length) {
                $am = $('<div></div>');
                this.$.append($am);
            }
            str = roundShorten(Math.max(0, str));
            $am.attr('class', 'amount').html(str);
        } else {
            $('.amount', this.$).remove();
        }

        if (isCursed) {
            if (amount === null) {
                this.$.find('.amount').addClass('low-value');
            } else {
                this.$.find('.amount').removeClass('low-value');
            }
        }
        //count bags
        if (isBag) {
            var v = this.st - 20;
            var stat = this.parseStats();
            Engine.bags[v][0] = parseInt(stat['bag']);
            Engine.bags[v][2] = parseInt(this.id);
        }
    };

    this.updadeViewAfterUpdateItem = ($viewIcon) => {
        self.$.find('.amount').hasClass('low-value') ? $viewIcon.find('.amount').addClass('low-value') : $viewIcon.find('.amount').removeClass('low-value')
        self.$.hasClass('very-low-value') ? $viewIcon.addClass('very-low-value') : $viewIcon.removeClass('very-low-value')

        this.setTip($viewIcon)

        let $cooldown = self.$.find('.cooldown');

        if ($cooldown.length) $viewIcon.append($('<div>').addClass('cooldown').html($cooldown.html()));
        if (isset(self._cachedStats['amount'])) $viewIcon.find('.amount').html(roundShorten(self._cachedStats['amount']));

        const enhancementUpgradeLvl = this._cachedStats['enhancement_upgrade_lvl'] ? this._cachedStats['enhancement_upgrade_lvl'] : null;
        setEnhancementUpgradeDataAttr(enhancementUpgradeLvl, $viewIcon)
    };

    this.getUnbindCost = () => {
        return isset(this.unbindCost) ? this.unbindCost : null;
    }

    this.checkGetNow = function(d) {
        if (!this.getNow)
            this.getNow = isset(d.nn) && d.nn === 1;
    };

    this.firstGetNow = function() {
        if (Engine.allInit) {
            this.getNow = true;
        }
    };

    this.canShowOutfit = function(menu) {
        if (!isset(this._cachedStats['outfit'])) return;
        menu.push(
            [_t('show', null, 'item'), function() {
                if (Engine.showMiniature) Engine.showMiniature.close();

                Engine.showMiniature = new ShowMiniature();
                Engine.showMiniature.init();
                Engine.showMiniature.onUpdate(self, CharacterData.drawSystem.PLAYER_OUTFIT);
            }]);
    };

    this.canShowOutfitSelector = function(menu) {
        if (!this.haveStat('outfit_selector')) return;
        menu.push(
            [_t('show', null, 'item'), function() {
                if (Engine.showMiniature) Engine.showMiniature.close();
                //Engine.showMiniature = new (require('core/ShowMiniature'))();
                //Engine.showMiniature.init();
                //Engine.showMiniature.onUpdate(self, 'outfit_selector');
                let outfitsData = self.getOutfits();

                if (Engine.chooseOutfit) Engine.chooseOutfit.close();
                Engine.chooseOutfit = new ChooseOutfit();
                Engine.chooseOutfit.init(true);
                Engine.chooseOutfit.update({
                    item_id: self.id,
                    outfitsTTL: 0,
                    outfits: outfitsData
                });
            }]);
    };

    this.getOutfits = () => {
        let statName = 'outfit_selector';
        let outfitData = {};
        let a = self._cachedStats[statName].split('|');

        a.shift();

        for (let i = 0; i < a.length; i++) {
            let d = a[i].split(',');
            outfitData[i] = {
                img: d[0],
                name: d[1],
                gender: d[2]
            }
        }
        return outfitData;
    };

    this.canShowPet = function(menu) {
        if (!isset(this._cachedStats['pet'])) return;
        menu.push(
            [_t('show', null, 'item'), function() {
                if (Engine.showMiniature) Engine.showMiniature.close();

                Engine.showMiniature = new ShowMiniature();
                Engine.showMiniature.init();
                Engine.showMiniature.onUpdate(self, CharacterData.drawSystem.PET);
            }]);
    };

    this.showIdStatMenu = function(menu) {
        if (this.loc == 'n') return;
        menu.push(
            [_t('show_id'), () => {
                new ShowItemDetails(this);
            }]);
    };

    this.stickTip = function(menu) {
        if (this.loc == 'n' || this.loc == 'l') return; // || (kind == 'tpl' && this.loc != "p")) return;
        menu.push(
            [_t('stick_tip'), function() {
                Engine.stickyTips.add(self);
            }]);
    };

    this.canSplit = function(menu) {
        //if (this.loc !== Engine.itemsFetchData.NEW_EQUIP_ITEM.loc || this.st !== 0 || this._cachedStats['cansplit'] != 1 ||
        // if (this.loc !== Engine.itemsFetchData.NEW_EQUIP_ITEM.loc || !ItemState.isInBagSt(this.st) || this._cachedStats['cansplit'] != 1 ||
        if (!ItemLocation.isEquipItemLoc(this.loc) || !ItemState.isInBagSt(this.st) || this._cachedStats['cansplit'] != 1 ||
            (isset(this._cachedStats['amount']) && this._cachedStats['amount'] <= 1)) return;
        menu.push(
            [_t('split', null, 'menu'), function() {
                Engine.heroEquipment.splitItem(self, self.x, self.y, true);
            }]);
    };

    this.destroy = function(menu) {
        //if (this.loc !== Engine.itemsFetchData.NEW_EQUIP_ITEM.loc || this.st !== 0 || this.cl === 19) return;
        // if (this.loc !== Engine.itemsFetchData.NEW_EQUIP_ITEM.loc || !ItemState.isInBagSt(this.st) || this.cl === 19) return;
        // if (this.loc !== Engine.itemsFetchData.NEW_EQUIP_ITEM.loc || !ItemState.isInBagSt(this.st) || ItemClass.isQuestCl(this.cl)) return;
        if (!ItemLocation.isEquipItemLoc(this.loc) || !ItemState.isInBagSt(this.st) || ItemClass.isQuestCl(this.cl)) return;
        menu.push(
            [_t('destroy', null, 'menu'), () => {
                if (!this.checkExpires()) {
                    const confirmParams = {
                        msg: _t('destroy_confirm'),
                        clb: () => _g(`moveitem&st=-2&id=${this.id}`)
                    }
                    confirmWithCallback(confirmParams);
                } else {
                    _g(`moveitem&st=-2&id=${this.id}`)
                }
            }, {
                button: {
                    cls: 'menu-item--red'
                }
            }]);
    };

    this.drop = function(menu) {
        //if (this.loc !== Engine.itemsFetchData.NEW_EQUIP_ITEM.loc || this.st !== 0 || this.cl === 19 || isset(this._cachedStats['permbound']) || isset(this._cachedStats['soulbound']) || _l() !== 'pl') return;
        // if (this.loc !== Engine.itemsFetchData.NEW_EQUIP_ITEM.loc || !ItemState.isInBagSt(this.st) || this.cl === 19 || isset(this._cachedStats['permbound']) || isset(this._cachedStats['soulbound']) || _l() !== 'pl') return;
        // if (this.loc !== Engine.itemsFetchData.NEW_EQUIP_ITEM.loc || !ItemState.isInBagSt(this.st) || ItemClass.isQuestCl(this.cl) || isset(this._cachedStats['permbound']) || isset(this._cachedStats['soulbound']) || _l() !== 'pl') return;
        // if (!ItemLocation.isEquipItemLoc(this.loc) || !ItemState.isInBagSt(this.st) || ItemClass.isQuestCl(this.cl) || isset(this._cachedStats['permbound']) || isset(this._cachedStats['soulbound']) || _l() !== 'pl') return;
        if (!ItemLocation.isEquipItemLoc(this.loc) || !ItemState.isInBagSt(this.st) || ItemClass.isQuestCl(this.cl) || isset(this._cachedStats['permbound']) || isset(this._cachedStats['soulbound']) || !isPl()) return;
        menu.push(
            [_t('drop', null, 'menu'), function() {
                const confirmParams = {
                    msg: _t('drop_confirm'),
                    clb: () => _g(`moveitem&st=-1&id=${self.id}`)
                }
                confirmWithCallback(confirmParams);
            }]);
    };

    const debugItemMenu = (menu) => {
        let debugColor = {
            button: {
                cls: 'menu-item--debug'
            }
        }

        let iconUrl = self.icon;
        let relativeUrl = CFG.r_ipath + iconUrl;
        let absoluteUrl = cdnUrl + relativeUrl;

        menu.push(['Copy id', function() {
            copyClipboard(self.id);
        }, debugColor]);
        menu.push(['Copy hid', function() {
            copyClipboard(self.hid);
        }, debugColor]);
        menu.push(['Copy details hid', function() {
            copyClipboard('ITEM#' + self.hid + '.' + getEngine().worldConfig.getWorldName());
        }, debugColor]);
        menu.push(['Copy tpl', function() {
            copyClipboard(self.tpl);
        }, debugColor]);
        menu.push(['icreate', function() {
            _g('console&custom=.icreate' + esc(" ") + (self.isItem() ? self.tpl : self.id));
        }, debugColor]);
        menu.push(['Copy short url', function() {
            copyClipboard(iconUrl);
        }, debugColor]);
        menu.push(['Copy relative url', function() {
            copyClipboard(relativeUrl);
        }, debugColor]);
        menu.push(['Copy absolute url', function() {
            copyClipboard(absoluteUrl);
        }, debugColor]);
        menu.push(['getData', function() {
            console.log(self)
        }, debugColor]);
    }

    this.canEnhance = (menu) => {
        // const canEnhance = this.loc === 'g' && Engine.hero.d.lvl >= 20  && !Engine.disableItemsManager.checkRequires(self, { [Engine.itemsDisableData.ENHANCE]: true });
        //const canEnhance = this.loc === Engine.itemsFetchData.NEW_EQUIP_ITEM.loc && Engine.hero.d.lvl >= 20  && !Engine.disableItemsManager.checkRequires(self, { [Engine.itemsDisableData.ENHANCE]: true });
        const canEnhance = ItemLocation.isEquipItemLoc(this.loc) && Engine.hero.d.lvl >= 20 && !Engine.disableItemsManager.checkRequires(self, {
            [Engine.itemsDisableData.ENHANCE]: true
        });
        if (!canEnhance) return;

        menu.push(
            [_t('upgrade', null, 'menu'), () => {
                if (!Engine.crafting.opened) {
                    Engine.crafting.tempEnhanceItemId = parseInt(self.id);
                    _g(`enhancement&action=open&item=${self.id}`);
                } else {
                    if (Engine.crafting.enhancement) {
                        Engine.crafting.enhancement.close();
                    }
                    Engine.crafting.open('enhancement');
                    Engine.crafting.enhancement.onClickInventoryItem(self);
                }
            }]
        );
    }

    this.playStatMenu = function(menu) {
        if (!isset(this._cachedStats['play'])) return;
        var play = this._cachedStats['play'].split(',');

        if (typeof soundManager.getSoundById('itemSound' + self.id) == 'object') {
            menu.push([_t('turn_off', null, 'item'), function() {
                soundManager.destroySound('itemSound' + self.id);
            }]);
        } else {
            menu.push([isset(play[1]) ? play[1] : _t('use_it', null, 'item'), function() {
                soundManager.destroySound('itemSound' + self.id);
                var tmpSound = soundManager.createSound({
                    id: 'itemSound' + self.id,
                    url: play[0],
                    autoPlay: true,
                    onfinish: function() {
                        tmpSound.destruct();
                    }
                });
            }]);
        }
    };

    this.createPromoOptionMenu = function(e, callbackData) {
        var menu = [];
        this.canShowOutfit(menu);
        this.canShowOutfitSelector(menu);
        this.canShowPet(menu);
        this.playStatMenu(menu);
        this.playStatMenu(menu);
        this.canPreviewStatMenu(menu);

        var emptyMenu = menu.length == 0;
        var emptyOrNotExistCallbackData = !callbackData || callbackData && lengthObject(callbackData) == 0;
        if (emptyMenu && emptyOrNotExistCallbackData) return;

        if (callbackData) {
            if (!Array.isArray(callbackData)) callbackData = [callbackData];
            for (var i = 0; i < callbackData.length; i++) {
                this.createUseItem(menu, e, callbackData[i]);
            }
        }

        Engine.interface.showPopupMenu(menu, e);
        //this.createUseItem(menu, e, callbackData);
    };

    this.createOptionMenu = function(e, callbackData, block) {
        var menu = [];
        if (!block) block = {};
        if (!block['use']) this.canShowUse(menu);
        if (!block['move']) this.canMove(menu);
        if (!block['attachToQuickItems']) this.canAttachToQuickItems(menu, e);
        if (!block['moveToEnhancement']) this.canMoveToEnhancement(menu); // exception for move eq items for enhancement
        if (!block['shop']) this.shopMenus(menu);
        if (!block['outfit']) this.canShowOutfit(menu);
        if (!block['outfit_selector']) this.canShowOutfitSelector(menu);
        if (!block['enhance']) this.canEnhance(menu);
        if (!block['pet']) this.canShowPet(menu);
        if (!block['play']) this.playStatMenu(menu);
        if (!block['canPreview']) this.canPreviewStatMenu(menu);
        if (!block['chatLinkedItem']) this.canChatLinkedItem(menu);
        if (!block['bonus_not_selected']) this.canBonusSelect(menu);
        if (!block['itemId']) this.showIdStatMenu(menu);
        if (!block['stickTip']) this.stickTip(menu);
        if (!block['split']) this.canSplit(menu);
        if (!block['drop']) this.drop(menu);
        if (!block['destroy']) this.destroy(menu);

        if (CFG.debug) debugItemMenu(menu)

        var emptyMenu = menu.length == 0;
        var emptyOrNotExistCallbackData = !callbackData || callbackData && lengthObject(callbackData) == 0;
        if (emptyMenu && emptyOrNotExistCallbackData) return;

        if (callbackData) {
            if (!Array.isArray(callbackData)) callbackData = [callbackData];
            for (var i = 0; i < callbackData.length; i++) {
                this.createUseItem(menu, e, callbackData[i]);
            }
        }

        Engine.interface.showPopupMenu(menu, e);
        //this.createUseItem(menu, e, callbackData);
    };

    this.canMove = function(menu) { //move item from eq to mail trade depo auction
        // var can = this.loc == 'g' && specificElementsExist();
        // var can = this.loc == Engine.itemsFetchData.NEW_EQUIP_ITEM.loc && specificElementsExist();
        var can = ItemLocation.isEquipItemLoc(this.loc) && specificElementsExist();
        if (!can) return;
        this.addMoveItemToMenu(menu);
        // if (Engine.trade && this.loc == 'g') {
        // if (Engine.trade && this.loc == Engine.itemsFetchData.NEW_EQUIP_ITEM.loc) {
        if (Engine.trade && ItemLocation.isEquipItemLoc(this.loc)) {
            menu.push([
                _t('show_blesses', null, 'clan'),
                function() {
                    Engine.trade.setShowItem(self);
                }
            ]);
        }
    };

    this.canAttachToQuickItems = (menu, e) => {
        // let can = this.loc == 'g' && !specificElementsExist() && !Engine.interfaceItems.isntRightItem(this);
        // let can = this.loc == Engine.itemsFetchData.NEW_EQUIP_ITEM.loc && !specificElementsExist() && !Engine.interfaceItems.isntRightItem(this);
        let can = ItemLocation.isEquipItemLoc(this.loc) && !specificElementsExist() && !Engine.interfaceItems.isntRightItem(this);
        if (!can) return;
        this.addAttachToQuickItemsToMenu(menu, e);
    }

    this.canMoveToEnhancement = function(menu) { // move item from eq to enhancement only
        //var can = this.loc === Engine.itemsFetchData.NEW_EQUIP_ITEM.loc && this.st !== 0 && Engine.crafting.enhancement;
        // var can = this.loc === Engine.itemsFetchData.NEW_EQUIP_ITEM.loc && !ItemState.isInBagSt(this.st) && Engine.crafting.enhancement;
        var can = ItemLocation.isEquipItemLoc(this.loc) && !ItemState.isInBagSt(this.st) && Engine.crafting.enhancement;
        if (!can) return;
        this.addMoveItemToMenu(menu);
    };

    this.addAttachToQuickItemsToMenu = (menu, e) => {
        menu.push([
            _t('attach_to_quick_items'), () => {
                Engine.interfaceItems.prepareMenuToPutItemInSlot(this, e);
            }
        ]);
    };

    this.addMoveItemToMenu = (menu) => {
        menu.push([
            _t('move', null, 'item'),
            function() {
                const $view = Engine.items.getAllViewsByIdAndViewName(self.id, Engine.itemsViewData.BAG_VIEW)[0];
                Engine.heroEquipment.afterOneClick(self, $view);
            }
        ]);
    }

    this.canShowUse = function(menu) {
        //var can = !mobileCheck() && kind == 'item' && this.loc == 'g' && this.cl != 15 && this.cl != 19 && this.cl != 26; //15:neutral, 19:quests, 26:upgraded
        // var can = kind == 'item' && this.loc == 'g' && this.cl != 15 && this.cl != 19 && this.cl != 26; //15:neutral, 19:quests, 26:upgraded
        // var can = kind == 'item' && this.loc == Engine.itemsFetchData.NEW_EQUIP_ITEM.loc && this.cl != 15 && this.cl != 19 && this.cl != 26; //15:neutral, 19:quests, 26:upgraded
        // var can = self.isItem() && this.loc == Engine.itemsFetchData.NEW_EQUIP_ITEM.loc && !ItemClass.isNeutralCl(this.cl) && !ItemClass.isQuestCl(this.cl) && !ItemClass.isUpgradeCl(this.cl);
        var can = self.isItem() && ItemLocation.isEquipItemLoc(this.loc) && !ItemClass.isNeutralCl(this.cl) && !ItemClass.isQuestCl(this.cl) && !ItemClass.isUpgradeCl(this.cl);
        var soundStat = isset(this._cachedStats['play']);
        if (!can || soundStat) return;
        menu.push([
            _t('use_it', null, 'item'),
            function() {
                //require('core/items/HeroEquipment').afterDoubleClick(self);
                const $view = Engine.items.getAllViewsByIdAndViewName(self.id, Engine.itemsViewData.BAG_VIEW)[0];
                Engine.heroEquipment.afterDoubleClick(self, $view);
            }
        ]);
    };

    this.shopMenus = function(menu) {
        if (this.loc != 'n') return;
        menu.push([_t('buy 5'), function() {
            Engine.shop.buySeriallyItem(5, self);
        }, {
            button: {
                cls: 'not-close'
            }
        }]);
        menu.push([_t('buy 1'), function() {
            Engine.shop.buySeriallyItem(1, self);
        }, {
            button: {
                cls: 'not-close'
            }
        }]);
        menu.push([_t('buy more'), function() {
            Engine.shop.alertWindow(self);
        }]);
    };

    this.createUseItem = function(menu, e, callbackData) {
        if (lengthObject(callbackData) > 0) {
            menu.unshift([
                callbackData.txt,
                function() {
                    callbackData.f();
                }
            ]);
        }
        //require('core/Interface').showPopupMenu(menu, e);
    };

    this.canPreviewStatMenu = function(menu) {
        if (!isset(this._cachedStats['canpreview'])) return;
        menu.push([_t('show', null, 'item'), function() {
            const id = isset(self.tpl) ? self.tpl : self.id;
            _g(`moveitem&st=2&tpl=${id}`);
            Engine.tpls.deleteMessItemsByLoc('p');
            Engine.tpls.deleteMessItemsByLoc('s');
        }]);
    };

    this.canChatLinkedItem = (menu) => {
        if (!this.isItem()) return;
        // if (
        // 	this.loc === Engine.itemsFetchData.NEW_EQUIP_ITEM.loc ||
        // 	this.loc === Engine.itemsFetchData.NEW_AUCTION_ITEM.loc ||
        // 	this.loc === Engine.itemsFetchData.NEW_PRIVATE_DEPO_ITEM.loc ||
        // 	this.loc === Engine.itemsFetchData.NEW_CLAN_DEPO_ITEM.loc ||
        // 	this.loc === Engine.itemsFetchData.NEW_RECOVERY_ITEM.loc ||
        // 	this.loc === Engine.itemsFetchData.NEW_MAIL_ITEM.loc ||
        // 	this.loc === Engine.itemsFetchData.NEW_OTHER_EQ_ITEM.loc
        // ) {
        if (
            ItemLocation.isEquipItemLoc(this.loc) ||
            ItemLocation.isAuctionItemLoc(this.loc) ||
            ItemLocation.isPrivateDepoItemLoc(this.loc) ||
            ItemLocation.isClanDepoItemLoc(this.loc) ||
            ItemLocation.isRecoveryItemLoc(this.loc) ||
            ItemLocation.isMailItemLoc(this.loc) ||
            ItemLocation.isOtherEqItemLoc(this.loc)
        ) {
            menu.push([_t('link-item'), function() {
                //Engine.chat.setLinkedItem(self.hid);
                Engine.chatController.getChatInputWrapper().setLinkedItem(self.hid);
            }]);
        }
    };

    this.canBonusSelect = (menu) => {
        if (!isset(this._cachedStats['bonus_not_selected']) || !isOwnItem(this)) return;
        menu.push([_t('select_bonus', null, 'item'), () => {
            _g(`moveitem&st=2&id=${self.id}`);
        }]);
    }


    //register callback
    this.on = function(event, callback) {
        if (typeof this.events[event] == 'undefined') this.events[event] = [];
        this.events[event].push(callback);
    };

    this.unregisterCallback = function(event, callback) {
        if (typeof this.events[event] == 'undefined') return;
        const stringifyCallback = callback.toString();
        const stringifyEventsArray = this.events[event].map(String);

        // var idx = this.events[event].indexOf(callback);
        const idx = stringifyEventsArray.indexOf(stringifyCallback);
        if (idx >= 0) this.events[event].splice(idx, 1);
    };

    this.trigger = function(event) {
        var args = [],
            i = 1;
        while (i < arguments.length) {
            args.push(arguments[i++]);
        }

        if (!isset(this.events[event])) return;
        // for (i = 0; i < this.events[event].length; i++) {
        // 	this.events[event][i].apply(this, args);
        // }

        let funcToCall = [];

        for (i = 0; i < this.events[event].length; i++) {
            funcToCall.push(this.events[event][i]);
        }

        for (i = 0; i < funcToCall.length; i++) {
            funcToCall[i].apply(this, args);
        }
    };

    this.beforeDelete = function() {
        this.$.remove();
        this.trigger('delete');
        //if (Engine.questTrack)
        //	Engine.questTrack.checkTaskNpcOrItem(self.id, 'item');
        //TODO: run onDelete callbacks
    };

    // this.copy$ = function (ev) {
    // 	ev = typeof(ev) == 'undefined' ? true : ev;
    // 	var cl = $(this.$[0]).clone(ev);
    // 	this.$ = this.$.add(cl);
    // 	return cl;
    // };

    this.updateCl = function() {
        //var name;
        //var blogo = this.cl == 25 && this.st == 0 || !isset(this.st);
        //var arrows = this.cl == 21 && this.st == 0 || !isset(this.st);
        //if (blogo || arrows || this.cl < 15 && (this.st == 0 || !isset(this.st))) {
        // var name;
        // let inBagSt   = ItemState.isInBagSt(this.st);
        // var blogo     = this.cl == 25 && inBagSt || !isset(this.st);
        // var arrows    = this.cl == 21 && inBagSt || !isset(this.st);
        var name;
        let inBagSt = ItemState.isInBagSt(this.st);
        var blogo = ItemClass.isBlessCl(this.cl) && inBagSt || !isset(this.st);
        var arrows = ItemClass.isArrowsCl(this.cl) && inBagSt || !isset(this.st);


        // if (blogo || arrows || this.cl < 15 && (inBagSt || !isset(this.st))) {
        if (blogo || arrows || ItemClass.isEquipCl(this.cl) && (inBagSt || !isset(this.st))) {

            let name = Engine.heroEquipment.getEqItemsName(this.cl);
            // if (this.cl > 0 && this.cl < 4) name = 'weapon';
            // if (this.cl > 5 && this.cl < 8) name = 'magic';
            if (name == null) name = this.cl;
            this.$.attr('data-cl', name);
        }
    };

    this.parseStats = function(stats) {

        let stat = stats ? stats : this.stat;
        var s = stat.split(';');
        var obj = {};
        for (var i = 0; i < s.length; i++) {
            var pair = s[i].split('=');
            obj[pair[0]] = isset(pair[1]) ? pair[1] : null;
        }
        return obj;
    };

    this.createHighlight = function() {
        this.addHighlightType();
        //this.addNoDisp();
    };

    this.addHighlightType = function() {
        const $hl = this.$.find('.highlight');
        this.checkQuestTracking();
        if (isset(this._cachedStats['rarity'])) {
            const rarity = this._cachedStats['rarity'];
            const type = itemTypes[rarity];
            this.itemType = type[0];
            this.itemTypeName = rarity;
            this.hlPos = type[1];
            this.itemTypeSort = type[2];
            $hl.addClass(type[0]);
            //if (!(isset(this._cachedStats['bag']) && this.st !== 0)) { // no highlight on bags
            if (!(isset(this._cachedStats['bag']) && !ItemState.isInBagSt(this.st))) {
                $hl.addClass('h-exist');
            }
            return $hl;
        } else {
            for (let k in itemTypes) {
                if (!isset(this._cachedStats[k]) && k !== 'common') continue;
                const type = itemTypes[k];
                this.itemType = type[0];
                this.itemTypeName = k;
                this.hlPos = type[1];
                this.itemTypeSort = type[2];
                $hl.addClass(type[0]);
                //if (!(isset(this._cachedStats['bag']) && this.st !== 0)) { // no highlight on bags
                if (!(isset(this._cachedStats['bag']) && !ItemState.isInBagSt(this.st))) {
                    $hl.addClass('h-exist');
                }
                return $hl;
            }
        }
    };

    this.checkQuestTracking = function() {
        return;
        var questT = Engine.questTrack && Engine.questTrack.activeTrack;
        if (!questT) return;
        var tasks = Engine.questTrack.tasks;
        for (var c in tasks) {
            var bool = this.name === tasks[c].name && tasks[c].type === 'item';
            if (bool) this.$.find('.highlight').addClass('track').removeClass('h-exist');
        }
    };

    this.addScore = function() {
        this.score = parseInt(this.getItemMultiplier(self.itemType) * self._cachedStats.lvl)
    };

    this.getLvl = () => {
        return self._cachedStats.lvl;
    }

    this.getItemType = () => {
        return this.itemType;
    }

    this.haveStat = (stat) => {
        return self._cachedStats.hasOwnProperty(stat);
    };

    this.getAmount = () => {
        return parseInt(self._cachedStats.amount);
    };

    this.checkSoulbound = () => {
        return isset(this._cachedStats["soulbound"]);
    }

    this.checkPermbound = () => {
        return isset(this._cachedStats["permbound"]);
    }

    this.getCustomTeleport = () => {
        return self._cachedStats.custom_teleport;
    };

    this.checkExpires = () => {
        let _ts = ts() / 1000;
        let expires = self._cachedStats.expires;
        return _ts > expires;
    };

    this.getItemMultiplier = function(itemType) {
        let itemTypes = {
            't-norm': 1,
            't-uniupg': 1.5,
            't-her': 2,
            't-upgraded': 2,
            't-leg': 3
        };
        return itemTypes[itemType];
    };

    this.isItemType = (value) => isset(itemTypes[value]);

    this.getTipContent = (cmpStats = null) => {
        const debug = getTipDebugContent();
        return MargoTipsParser.getTip(this, cmpStats) + debug;
    }

    this.getTipData = () => [this.getTipContent(), 't_item', this.itemType]

    this.setTip = (viewIcon = this.$, content = this.getTipContent(), options) => {
        viewIcon.tip(content, 't_item', this.itemType, options);
    }

    this.debugRefreshTip = () => {
        this.setTip();
    }

    const getTipDebugContent = () => CFG.debug ? `<span class="debug-content">
			id: ${this.id},
			${this.isItem() ? `tpl id: ${this.tpl}, ` : ''}
			loc: ${this.loc}, 
			cl: ${this.cl}, 
			stats: ${this.stat.replace(/opis=[^;]*/, 'opis=X')}<br><br>
		</span>` : '';

    const getName = () => {
        return this.name;
    }

    const getId = () => {
        return this.id;
    }

    const getView = () => {
        let view = [];
        let views;

        if (this.isItem()) views = getEngine().items.getViewById(this.id);
        else views = getEngine().tpls.getViewById(this.tpl);

        for (let kind in views) {

            let oneKind = views[kind];

            for (let i = 0; i < oneKind.length; i++) {
                view.push(oneKind[i])
            }
        }

        return view;
    };


    const getLoc = () => {
        return this.loc;
    }

    const getSt = () => {
        return this.st;
    }

    const getX = () => {
        return this.x;
    }

    const setShouldDrawIcon = (_shouldDrawIcon) => {
        shouldDrawIcon = _shouldDrawIcon
    }

    const setEnhancementUpgradeLvl = (_enhancementUpgradeLvl) => {
        enhancementUpgradeLvl = _enhancementUpgradeLvl;
        setEnhancementUpgradeDataAttr(_enhancementUpgradeLvl, this.$);
    };

    const setEnhancementUpgradeDataAttr = (_enhancementUpgradeLvl, $element) => {
        if (enhancementUpgradeLvl !== null) $element.attr('data-upgrade', enhancementUpgradeLvl);
        else $element.removeAttr('data-upgrade');
    }

    const getEnhancementUpgradeLvl = () => {
        return enhancementUpgradeLvl;
    };

    const getBuildsWithThisItem = () => {
        if (!ItemClass.isEquipCl(this.cl)) return null;
        const builds = Engine.buildsManager.getBuildsCommons().getItemByIdInBuilds(this.id);
        return builds !== null ? Object.keys(builds) : null;
    }

    this.getView = getView;
    this.getName = getName;
    this.getId = getId;
    this.getLoc = getLoc;
    this.getX = getX;
    this.setShouldDrawIcon = setShouldDrawIcon;
    this.getSt = getSt;
    this.getBuildsWithThisItem = getBuildsWithThisItem;
    this.getEnhancementUpgradeLvl = getEnhancementUpgradeLvl;

};