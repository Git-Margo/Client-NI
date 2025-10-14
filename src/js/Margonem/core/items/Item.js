/**
 * Created by lukasz on 2014-10-21.
 */
var Templates = require('@core/Templates');
var ChooseOutfit = require('@core/ChooseOutfit');
var ShowItemDetails = require('@core/ShowItemDetails');
let ShowMiniature = require('@core/ShowMiniature');
let CharacterData = require('@core/characters/CharactersData')
let ItemNotice = require('@core/items/ItemNotice');
var ItemState = require('@core/items/ItemState');
var ItemClass = require('@core/items/ItemClass');
var ItemLocation = require('@core/items/ItemLocation');
//var ItemStatsData = require('@core/items/data/ItemStatsData');
var ItemStats = require('@core/items/ItemStats');
const ItemData = require('@core/items/data/ItemData');

module.exports = function(i, d, kind) {

    const moduleData = {
        fileName: "Item.js"
    };

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

    let itemStats = new ItemStats();

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
            !(isset(Engine.hero.oldLvl) && Engine.hero.oldLvl > getHeroLevel() && getHeroLevel() === 1) // dirty fix for lvl-down to 1 (items update - for Berufs)
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

        itemStats.setAllItemStats(this.parseStats());

        if (firstInit) {

            this.createHighlight();
            // this.checkMenuExist();
            this.$.attr('data-name', parseItemBB(this.name));
            this.$.addClass('item-id-' + this.id);
        }

        //setEnhancementUpgradeLvl(this._cachedStats['enhancement_upgrade_lvl'] ? this._cachedStats['enhancement_upgrade_lvl'] : null)
        //setEnhancementUpgradeLvl(itemStats.getStat(Engine.itemStatsData.enhancement_upgrade_lvl));
        setEnhancementUpgradeLvl(getEnhancement_upgrade_lvlStat());

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

    // this.updateDynamicTips = ($view, regex, timeout) => {
    this.updateDynamicTips = ($view, timeout) => {
        // if(this.stat.match(regex)){

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
        // }
    };

    this.updateTtl = () => {
        if (ItemState.isBlessSt(this.st) && isOwnItem(this) && ItemLocation.isEquipItemLoc(this.loc)) {
            //if (parseInt(this._cachedStats.ttl) === 1) {
            //if (parseInt(itemStats.getStat(Engine.itemStatsData.ttl)) === 1) {
            if (parseInt(getTtlStat()) === 1) {
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
        //var isCursed = isset(this._cachedStats.cursed);
        var isCursed = issetCursedStat();
        //var am = isset(this._cachedStats.amount) ? this._cachedStats.amount : 0;

        let am = issetAmountStat() ? getAmountStat() : 0;

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
        //if (isset(self._cachedStats['amount'])) $viewIcon.find('.amount').html(roundShorten(self._cachedStats['amount']));
        if (issetAmountStat()) $viewIcon.find('.amount').html(roundShorten(getAmountStat()));

        //const enhancementUpgradeLvl = this._cachedStats['enhancement_upgrade_lvl'] ? this._cachedStats['enhancement_upgrade_lvl'] : null;
        const enhancementUpgradeLvl = getEnhancement_upgrade_lvlStat();
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
        //if (!isset(this._cachedStats['outfit'])) return;

        if (!issetOutfitStat()) {
            return;
        }

        menu.push(
            [_t('show', null, 'item'), function() {
                if (Engine.showMiniature) Engine.showMiniature.close();

                Engine.showMiniature = new ShowMiniature();
                Engine.showMiniature.init();
                Engine.showMiniature.onUpdate(self, CharacterData.drawSystem.PLAYER_OUTFIT);
            }]);
    };

    this.canShowOutfitSelector = function(menu) {
        //if (!this.haveStat('outfit_selector')) return;

        if (!issetOutfit_selectorStat()) {
            return
        }

        menu.push(
            [_t('show', null, 'item'), function() {
                if (Engine.showMiniature) Engine.showMiniature.close();
                //Engine.showMiniature = new (require('@core/ShowMiniature'))();
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
        //let statName    = 'outfit_selector';
        let outfitData = {};
        //let a           = self._cachedStats[statName].split('|');
        let a = getOutfit_selectorStat().split('|');

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
        //if (!isset(this._cachedStats['pet'])) return;

        if (!issetPetStat()) {
            return;
        }

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
        //if (!ItemLocation.isEquipItemLoc(this.loc) || !ItemState.isInBagSt(this.st) || this._cachedStats['cansplit'] != 1 ||
        //		(isset(this._cachedStats['amount']) && this._cachedStats['amount'] <= 1)) return;

        if (!ItemLocation.isEquipItemLoc(this.loc) || !ItemState.isInBagSt(this.st) || getCansplitStat() != 1 || (issetAmountStat() && getAmountStat() <= 1)) {
            return;
        }

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
                // if (!this.checkExpires()) {

                let callDestroyConfirm = !issetExpiresStat() || issetExpiresStat() && !this.checkExpires();

                // if (!this.checkExpires()) {
                if (callDestroyConfirm) {
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
        //if (!ItemLocation.isEquipItemLoc(this.loc) || !ItemState.isInBagSt(this.st) || ItemClass.isQuestCl(this.cl) || isset(this._cachedStats['permbound']) || isset(this._cachedStats['soulbound']) || !isPl()) return;

        if (!ItemLocation.isEquipItemLoc(this.loc) || !ItemState.isInBagSt(this.st) || ItemClass.isQuestCl(this.cl) || issetPermboundStat() || issetSoulboundStat() || !isPl()) {
            return;
        }

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
        menu.push(['icreate mass', function() {
            icreateMass()
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

    const icreateMass = () => {

        confirmWitchNumberTextInput("ICREATE MASS", function(val) {

            _g('console&custom=.icreate' + esc(" ") + (self.isItem() ? self.tpl : self.id) + ":" + val);

        }, {
            value: 10
        });
    }

    this.canEnhance = (menu) => {
        // const canEnhance = this.loc === 'g' && Engine.hero.d.lvl >= 20  && !Engine.disableItemsManager.checkRequires(self, { [Engine.itemsDisableData.ENHANCE]: true });
        //const canEnhance = this.loc === Engine.itemsFetchData.NEW_EQUIP_ITEM.loc && Engine.hero.d.lvl >= 20  && !Engine.disableItemsManager.checkRequires(self, { [Engine.itemsDisableData.ENHANCE]: true });
        const canEnhance = ItemLocation.isEquipItemLoc(this.loc) && getHeroLevel() >= 20 && !Engine.disableItemsManager.checkRequires(self, {
            [Engine.itemsDisableData.ENHANCE]: true
        });
        if (!canEnhance) return;

        menu.push(
            [_t('upgrade', null, 'menu'), () => {
                if (!Engine.crafting.itemCraft.opened) {
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
        //if (!isset(this._cachedStats['play'])) {
        //	return;
        //}

        if (!issetPlayStat()) {
            return;
        }

        let soundManager = getEngine().soundManager;
        //let play 			= this._cachedStats['play'].split(',');
        let play = getPlayStat().split(',');
        let itemId = self.id;

        if (soundManager.checkItemSoundIsPlaying(itemId)) {

            let menuText = _t('turn_off', null, 'item');
            menu.push([menuText, function() {
                soundManager.finishPlayingItemSound(itemId);
            }]);

        } else {

            let soundUrl = play[0];
            let menuText = isset(play[1]) ? play[1] : _t('use_it', null, 'item');

            menu.push([menuText, function() {
                soundManager.prepareItemSound(soundUrl);
                soundManager.createItemSound(soundUrl, itemId);
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

    this.createOptionMenu = function(e, callbackData, block, options) {
        var menu = [];
        if (!block) block = {};
        if (!block['use']) this.canShowUse(menu);
        if (!block['move']) this.canMove(menu);
        if (!block['attachToQuickItems']) this.canAttachToQuickItems(menu, e);
        if (!block['moveToEnhancement']) this.canMoveToEnhancement(menu); // exception for move eq items for enhancement
        if (!block['shop']) this.shopMenus(menu, options);
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

        if (getDebug()) debugItemMenu(menu)

        var emptyMenu = menu.length == 0;
        var emptyOrNotExistCallbackData = !callbackData || callbackData && lengthObject(callbackData) == 0;
        if (emptyMenu && emptyOrNotExistCallbackData) return;

        if (callbackData) {
            if (!Array.isArray(callbackData)) callbackData = [callbackData];
            for (var i = 0; i < callbackData.length; i++) {
                this.createUseItem(menu, e, callbackData[i]);
            }
        }

        Engine.interface.showPopupMenu(menu, e, {
            header: parseItemBB(this.getName())
        });
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
        var can = self.isItem() &&
            ItemLocation.isEquipItemLoc(this.loc) &&
            !ItemClass.isNeutralCl(this.cl) &&
            !ItemClass.isQuestCl(this.cl) &&
            !ItemClass.isUpgradeCl(this.cl) &&
            !ItemClass.isCurrencyCl(this.cl);

        var soundStat = issetPlayStat()
        if (!can || soundStat) return;

        menu.push([
            this.getUseTranslation(),
            function() {
                //require('@core/items/HeroEquipment').afterDoubleClick(self);
                const $view = Engine.items.getAllViewsByIdAndViewName(self.id, Engine.itemsViewData.BAG_VIEW)[0];
                Engine.heroEquipment.afterDoubleClick(self, $view);
            }
        ]);
    };

    this.getUseTranslation = () => {
        if (ItemClass.isEquipCl(this.cl)) {
            return _t('equip_it', null, 'item');
        }

        const translationMap = {
            [ItemData.CL.TALISMAN]: 'activate',
            [ItemData.CL.BOOK]: 'read',
            [ItemData.CL.BAG]: 'carry',
            [ItemData.CL.RECIPE]: 'learn',
            [ItemData.CL.OUTFITS]: 'put_on',
            [ItemData.CL.PETS]: 'summon'
        };

        const translationKey = translationMap[this.cl] || 'use_it';
        return _t(translationKey, null, 'item');
    };

    this.shopMenus = function(menu, options) {
        if (this.loc != 'n') return;

        const item = options.data; // this item is overwritten in shop :/

        menu.push([_t('buy 5'), function() {
            Engine.shop.buySeriallyItem(5, item);
        }, {
            button: {
                cls: 'not-close'
            }
        }]);
        menu.push([_t('buy 1'), function() {
            Engine.shop.buySeriallyItem(1, item);
        }, {
            button: {
                cls: 'not-close'
            }
        }]);
        menu.push([_t('buy more'), function() {
            Engine.shop.alertWindow(item);
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
        //require('@core/Interface').showPopupMenu(menu, e);
    };

    this.canPreviewStatMenu = function(menu) {
        //if (!isset(this._cachedStats['canpreview'])) return;

        if (!issetCanpreviewStat()) {
            return;
        }

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
        //if (!isset(this._cachedStats['bonus_not_selected']) || !isOwnItem(this)) return;

        if (!issetBonus_not_selectedStat() || !isOwnItem(this)) {
            return;
        }

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
        const inBagSt = ItemState.isInBagSt(this.st);
        const isEquippedAndNotMine = !ItemState.isInBagSt(this.st) && this.own !== Engine.hero.d.id;
        const commonCondition = inBagSt || !isset(this.st) || isEquippedAndNotMine;

        const bless = ItemClass.isBlessCl(this.cl) && commonCondition;
        const arrows = ItemClass.isArrowsCl(this.cl) && commonCondition;
        const isEquipped = ItemClass.isEquipCl(this.cl) && commonCondition;

        if (bless || arrows || isEquipped) {
            const name = Engine.heroEquipment.getEqItemsName(this.cl) || this.cl;
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
        //this.checkQuestTracking();
        //if (isset(this._cachedStats['rarity'])) {
        if (issetRarityStat()) {
            //const rarity = this._cachedStats['rarity'];
            const rarity = getRarityStat();
            const type = itemTypes[rarity];
            this.itemType = type[0];
            this.itemTypeName = rarity;
            this.hlPos = type[1];
            this.itemTypeSort = type[2];
            $hl.addClass(type[0]);
            //if (!(isset(this._cachedStats['bag']) && this.st !== 0)) { // no highlight on bags
            //if (!(isset(this._cachedStats['bag']) && !ItemState.isInBagSt(this.st))) {
            if (!(issetBagStat() && !ItemState.isInBagSt(this.st))) {
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
                //if (!(isset(this._cachedStats['bag']) && !ItemState.isInBagSt(this.st))) {
                if (!(issetBagStat() && !ItemState.isInBagSt(this.st))) {
                    $hl.addClass('h-exist');
                }
                return $hl;
            }
        }
    };

    //this.checkQuestTracking = function () {
    //	return;
    //	var questT = Engine.questTrack && Engine.questTrack.activeTrack;
    //	if (!questT) return;
    //	var tasks = Engine.questTrack.tasks;
    //	for (var c in tasks) {
    //		var bool = this.name === tasks[c].name && tasks[c].type === 'item';
    //		if (bool) this.$.find('.highlight').addClass('track').removeClass('h-exist');
    //	}
    //};

    this.addScore = function() {
        //this.score = parseInt(this.getItemMultiplier(self.itemType) * self._cachedStats.lvl)
        this.score = parseInt(this.getItemMultiplier(self.itemType) * getLvlStat())
    };

    //this.getLvl = () => {
    //	//return self._cachedStats.lvl;
    //	return getLvlStat();
    //}

    this.getItemType = () => {
        return this.itemType;
    }

    const issetStat = (stat) => {
        //return self._cachedStats.hasOwnProperty(stat);

        return itemStats.issetStat(stat);
    };

    const getStat = (stat) => {
        //return self._cachedStats.hasOwnProperty(stat);

        return itemStats.getStat(stat);
    };

    this.getAmount = () => {
        //return parseInt(self._cachedStats.amount);
        return parseInt(getAmountStat());
    };

    //this.checkSoulbound = () => {
    //	//return isset(this._cachedStats["soulbound"]);
    //	return issetSoulboundStat();
    //}

    //this.checkPermbound = () => {
    //	//return isset(this._cachedStats["permbound"]);
    //	return issetPermboundStat();
    //}

    //this.getCustomTeleport = () => {
    //	//return self._cachedStats.custom_teleport;
    //	return getCustom_teleportStat();
    //};

    this.checkExpires = () => {
        let _ts = ts() / 1000;
        //let expires = self._cachedStats.expires;
        //let expires = issetExpiresStat();
        let expires = getExpiresStat();

        if (expires === null) {
            return false;
        }

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

    const getTipDebugContent = () => getDebug() ? `<span class="debug-content">
			id: ${this.id},
			${this.isItem() ? `tpl id: ${this.tpl}, ` : ''}
			loc: ${this.loc}, 
			cl: ${this.cl}, 
			stats: <br>${itemStats.getStatsDebugStr()}<br><br>
		</span>` : '';

    // stats: ${this.stat.replace(/opis=[^;]*/, 'opis=X')}<br><br>

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

    const getY = () => {
        return this.y;
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

    //const getItemStats = () => {
    //	return itemStats
    //};

    const issetOutfitStat = () => {
        return issetStat(Engine.itemStatsData.outfit);
    };

    const getOutfitStat = () => {
        return getStat(Engine.itemStatsData.outfit);
    };

    const issetOutfit_selectorStat = () => {
        return issetStat(Engine.itemStatsData.outfit_selector);
    }

    const getOutfit_selectorStat = () => {
        return getStat(Engine.itemStatsData.outfit_selector);
    }

    const issetLvlStat = () => {
        return issetStat(Engine.itemStatsData.lvl);
    };

    const getLvlStat = () => {
        return getStat(Engine.itemStatsData.lvl);
    };

    const issetTimelimitStat = () => {
        return issetStat(Engine.itemStatsData.timelimit);
    };

    const issetLowreqStat = () => {
        return issetStat(Engine.itemStatsData.lowreq);
    }

    const getLowreqStat = () => {
        return getStat(Engine.itemStatsData.lowreq);
    }

    const issetPersonalStat = () => {
        return issetStat(Engine.itemStatsData.personal);
    }

    const getPersonalStat = () => {
        return getStat(Engine.itemStatsData.personal);
    }

    const getTimelimitStat = () => {
        return getStat(Engine.itemStatsData.timelimit);
    };

    const issetAmountStat = () => {
        return issetStat(Engine.itemStatsData.amount);
    };

    const getAmountStat = () => {
        return getStat(Engine.itemStatsData.amount);
    };

    const issetReqpStat = () => {
        return issetStat(Engine.itemStatsData.reqp);
    };

    const getReqpStat = () => {
        return getStat(Engine.itemStatsData.reqp);
    };

    const issetPetStat = () => {
        return issetStat(Engine.itemStatsData.pet);
    };

    const getPetStat = () => {
        return getStat(Engine.itemStatsData.pet);
    };

    const issetSoulboundStat = () => {
        return issetStat(Engine.itemStatsData.soulbound);
    }

    const getSoulboundStat = () => {
        return getStat(Engine.itemStatsData.soulbound);
    }

    const issetPermboundStat = () => {
        return issetStat(Engine.itemStatsData.permbound);
    }

    const getPermboundStat = () => {
        return getStat(Engine.itemStatsData.permbound);
    }

    const issetCansplitStat = () => {
        return issetStat(Engine.itemStatsData.cansplit);
    }

    const issetCursedStat = () => {
        return issetStat(Engine.itemStatsData.cursed);
    }

    const getCursedStat = () => {
        return getStat(Engine.itemStatsData.cursed);
    }

    const issetEnhancement_upgrade_lvlStat = () => {
        return issetStat(Engine.itemStatsData.enhancement_upgrade_lvl);
    }

    const getActionStat = () => {
        return getStat(Engine.itemStatsData.action);
    };

    const issetActionStat = () => {
        return issetStat(Engine.itemStatsData.action);
    };

    const getSummonpartyStat = () => {
        return getStat(Engine.itemStatsData.summonparty);
    };

    const issetSummonpartyStat = () => {
        return issetStat(Engine.itemStatsData.summonparty);
    };

    const getEnhancement_upgrade_lvlStat = () => {
        return getStat(Engine.itemStatsData.enhancement_upgrade_lvl);
    };

    const getEnhancement_addStat = () => {
        return getStat(Engine.itemStatsData.enhancement_add);
    }

    const getCansplitStat = () => {
        return getStat(Engine.itemStatsData.cansplit);
    };

    // const issetPlayStat = () => {
    // 	return issetStat(Engine.itemStatsData.play);
    // }

    // const getPlayStat = () => {
    // 	return getStat(Engine.itemStatsData.play);
    // };

    const issetCanpreviewStat = () => {
        return issetStat(Engine.itemStatsData.canpreview);
    }

    const issetBonusStat = () => {
        return issetStat(Engine.itemStatsData.bonus);
    }

    const getBonusStat = () => {
        return getStat(Engine.itemStatsData.bonus);
    }

    const getCanpreviewStat = () => {
        return getStat(Engine.itemStatsData.canpreview);
    };

    const issetBonus_not_selectedStat = () => {
        return issetStat(Engine.itemStatsData.bonus_not_selected);
    }

    const issetBonus_reselectStat = () => {
        return issetStat(Engine.itemStatsData.bonus_reselect);
    }

    const getBonus_not_selectedStat = () => {
        return getStat(Engine.itemStatsData.bonus_not_selected);
    };

    const getBonus_reselectStat = () => {
        return getStat(Engine.itemStatsData.bonus_reselect);
    }

    const issetRarityStat = () => {
        return issetStat(Engine.itemStatsData.rarity);
    };

    const issetTarget_rarityStat = () => {
        return issetStat(Engine.itemStatsData.target_rarity);
    }

    const getRarityStat = () => {
        return getStat(Engine.itemStatsData.rarity);
    };

    const getTarget_rarityStat = () => {
        return getStat(Engine.itemStatsData.target_rarity);
    }

    const issetBagStat = () => {
        return issetStat(Engine.itemStatsData.bag);
    };

    const issetReviveStat = () => {
        return issetStat(Engine.itemStatsData.revive);
    };

    const getReviveStat = () => {
        return getStat(Engine.itemStatsData.revive);
    }

    const issetAnimationStat = () => {
        return issetStat(Engine.itemStatsData.animation);
    }

    const getAnimationStat = () => {
        return getStat(Engine.itemStatsData.animation);
    }

    // const issetEmoStat = () => {
    //     return issetStat(Engine.itemStatsData.emo);
    // }

    // const getEmoStat = () => {
    //     return getStat(Engine.itemStatsData.emo);
    // }

    const issetLeczyStat = () => {
        return issetStat(Engine.itemStatsData.leczy);
    }

    const getLeczyStat = () => {
        return getStat(Engine.itemStatsData.leczy);
    }

    const issetFullhealStat = () => {
        return issetStat(Engine.itemStatsData.fullheal);
    }

    const getFullhealStat = () => {
        return getStat(Engine.itemStatsData.fullheal);
    }

    const issetPerhealStat = () => {
        return issetStat(Engine.itemStatsData.perheal);
    }

    const getPerhealStat = () => {
        return getStat(Engine.itemStatsData.perheal);
    }

    // const issetLootboxStat = () => {
    //     return issetStat(Engine.itemStatsData.lootbox);
    // }

    // const getLootboxStat = () => {
    //     return getStat(Engine.itemStatsData.lootbox);
    // }

    // const issetLootbox2Stat = () => {
    //     return issetStat(Engine.itemStatsData.lootbox2);
    // }

    // const getLootbox2Stat = () => {
    //     return getStat(Engine.itemStatsData.lootbox2);
    // }

    const issetRecipeStat = () => {
        return issetStat(Engine.itemStatsData.recipe);
    }

    const issetNodepoStat = () => {
        return issetStat(Engine.itemStatsData.nodepo);
    }

    const getNodepoStat = () => {
        return getStat(Engine.itemStatsData.nodepo);
    }

    const getRecipeStat = () => {
        return getStat(Engine.itemStatsData.recipe);
    }

    const issetTtlStat = () => {
        return issetStat(Engine.itemStatsData.ttl);
    };

    const getTtlStat = () => {
        return getStat(Engine.itemStatsData.ttl);
    };

    const issetEnhancement_addStat = () => {
        return issetStat(Engine.itemStatsData.enhancement_add);
    }

    const issetEnhancement_add_pointStat = () => {
        return issetStat(Engine.itemStatsData.enhancement_add_point);
    }

    const getEnhancement_add_pointStat = () => {
        return getStat(Engine.itemStatsData.enhancement_add_point);
    }

    const getBagStat = () => {
        return getStat(Engine.itemStatsData.bag);
    };

    const getCustom_teleportStat = () => {
        return getStat(Engine.itemStatsData.custom_teleport);
    };

    const issetCustom_teleportStat = () => {
        return issetStat(Engine.itemStatsData.custom_teleport);
    };

    const issetExpiresStat = () => {
        return issetStat(Engine.itemStatsData.expires);
    };

    const getExpiresStat = () => {
        return getStat(Engine.itemStatsData.expires);
    };

    const issetAcStat = () => {
        return issetStat(Engine.itemStatsData.ac)
    }
    const getAcStat = () => {
        return getStat(Engine.itemStatsData.ac)
    }

    const issetDmgStat = () => {
        return issetStat(Engine.itemStatsData.dmg)
    }
    const getDmgStat = () => {
        return getStat(Engine.itemStatsData.dmg)
    }

    const issetActStat = () => {
        return issetStat(Engine.itemStatsData.act)
    }
    const getActStat = () => {
        return getStat(Engine.itemStatsData.act)
    }

    const issetExpire_durationStat = () => {
        return issetStat(Engine.itemStatsData.expire_duration)
    }
    const getExpire_durationStat = () => {
        return getStat(Engine.itemStatsData.expire_duration)
    }

    const issetIntStat = () => {
        return issetStat(Engine.itemStatsData.int)
    }
    const getIntStat = () => {
        return getStat(Engine.itemStatsData.int)
    }

    const issetNpc_expbonStat = () => {
        return issetStat(Engine.itemStatsData.npc_expbon)
    }
    const getNpc_expbonStat = () => {
        return getStat(Engine.itemStatsData.npc_expbon)
    }

    const issetPdmgStat = () => {
        return issetStat(Engine.itemStatsData.pdmg)
    }
    const getPdmgStat = () => {
        return getStat(Engine.itemStatsData.pdmg)
    }

    const issetPerdmgStat = () => {
        return issetStat(Engine.itemStatsData.perdmg)
    }
    const getPerdmgStat = () => {
        return getStat(Engine.itemStatsData.perdmg)
    }

    const issetResfireStat = () => {
        return issetStat(Engine.itemStatsData.resfire)
    }
    const getResfireStat = () => {
        return getStat(Engine.itemStatsData.resfire)
    }

    const issetResfrostStat = () => {
        return issetStat(Engine.itemStatsData.resfrost)
    }
    const getResfrostStat = () => {
        return getStat(Engine.itemStatsData.resfrost)
    }

    const issetReslightStat = () => {
        return issetStat(Engine.itemStatsData.reslight)
    }
    const getReslightStat = () => {
        return getStat(Engine.itemStatsData.reslight)
    }

    const issetSilaStat = () => {
        return issetStat(Engine.itemStatsData.sila)
    }
    const getSilaStat = () => {
        return getStat(Engine.itemStatsData.sila)
    }

    const issetZrStat = () => {
        return issetStat(Engine.itemStatsData.zr)
    }
    const getZrStat = () => {
        return getStat(Engine.itemStatsData.zr)
    }

    const issetActdmgStat = () => {
        return issetStat(Engine.itemStatsData.actdmg)
    }
    const getActdmgStat = () => {
        return getStat(Engine.itemStatsData.actdmg)
    }

    const issetAgiStat = () => {
        return issetStat(Engine.itemStatsData.agi)
    }
    const getAgiStat = () => {
        return getStat(Engine.itemStatsData.agi)
    }

    const issetFireStat = () => {
        return issetStat(Engine.itemStatsData.fire)
    }
    const getFireStat = () => {
        return getStat(Engine.itemStatsData.fire)
    }

    const issetFirebonStat = () => {
        return issetStat(Engine.itemStatsData.firebon)
    }
    const getFirebonStat = () => {
        return getStat(Engine.itemStatsData.firebon)
    }

    const issetFrostStat = () => {
        return issetStat(Engine.itemStatsData.frost)
    }
    const getFrostStat = () => {
        return getStat(Engine.itemStatsData.frost)
    }

    const issetFrostbonStat = () => {
        return issetStat(Engine.itemStatsData.frostbon)
    }
    const getFrostbonStat = () => {
        return getStat(Engine.itemStatsData.frostbon)
    }

    const issetFrostpunchStat = () => {
        return issetStat(Engine.itemStatsData.frostpunch)
    }
    const getFrostpunchStat = () => {
        return getStat(Engine.itemStatsData.frostpunch)
    }

    const issetHpsaStat = () => {
        return issetStat(Engine.itemStatsData.hpsa)
    }
    const getHpsaStat = () => {
        return getStat(Engine.itemStatsData.hpsa)
    }

    const issetLightStat = () => {
        return issetStat(Engine.itemStatsData.light)
    }
    const getLightStat = () => {
        return getStat(Engine.itemStatsData.light)
    }

    const issetLightbonStat = () => {
        return issetStat(Engine.itemStatsData.lightbon)
    }
    const getLightbonStat = () => {
        return getStat(Engine.itemStatsData.lightbon)
    }

    const issetLightmindmgStat = () => {
        return issetStat(Engine.itemStatsData.lightmindmg)
    }
    const getLightmindmgStat = () => {
        return getStat(Engine.itemStatsData.lightmindmg)
    }

    const issetMresdmgStat = () => {
        return issetStat(Engine.itemStatsData.mresdmg)
    }
    const getMresdmgStat = () => {
        return getStat(Engine.itemStatsData.mresdmg)
    }

    const issetPet2Stat = () => {
        return issetStat(Engine.itemStatsData.pet2)
    }
    const getPet2Stat = () => {
        return getStat(Engine.itemStatsData.pet2)
    }

    const issetPoisonStat = () => {
        return issetStat(Engine.itemStatsData.poison)
    }
    const getPoisonStat = () => {
        return getStat(Engine.itemStatsData.poison)
    }

    const issetStrStat = () => {
        return issetStat(Engine.itemStatsData.str)
    }
    const getStrStat = () => {
        return getStat(Engine.itemStatsData.str)
    }

    const issetAbdestStat = () => {
        return issetStat(Engine.itemStatsData.abdest)
    }
    const getAbdestStat = () => {
        return getStat(Engine.itemStatsData.abdest)
    }

    const issetAbsorbStat = () => {
        return issetStat(Engine.itemStatsData.absorb)
    }
    const getAbsorbStat = () => {
        return getStat(Engine.itemStatsData.absorb)
    }

    const issetAbsorbmStat = () => {
        return issetStat(Engine.itemStatsData.absorbm)
    }
    const getAbsorbmStat = () => {
        return getStat(Engine.itemStatsData.absorbm)
    }

    const issetAcdmgStat = () => {
        return issetStat(Engine.itemStatsData.acdmg)
    }
    const getAcdmgStat = () => {
        return getStat(Engine.itemStatsData.acdmg)
    }

    const issetAdestStat = () => {
        return issetStat(Engine.itemStatsData.adest)
    }
    const getAdestStat = () => {
        return getStat(Engine.itemStatsData.adest)
    }

    const issetAfterhealStat = () => {
        return issetStat(Engine.itemStatsData.afterheal)
    }
    const getAfterhealStat = () => {
        return getStat(Engine.itemStatsData.afterheal)
    }

    const issetAfterheal2Stat = () => {
        return issetStat(Engine.itemStatsData.afterheal2)
    }
    const getAfterheal2Stat = () => {
        return getStat(Engine.itemStatsData.afterheal2)
    }

    const issetBattlestatsStat = () => {
        return issetStat(Engine.itemStatsData.battlestats)
    }
    const getBattlestatsStat = () => {
        return getStat(Engine.itemStatsData.battlestats)
    }

    const issetBlokStat = () => {
        return issetStat(Engine.itemStatsData.blok)
    }
    const getBlokStat = () => {
        return getStat(Engine.itemStatsData.blok)
    }

    const issetContraStat = () => {
        return issetStat(Engine.itemStatsData.contra)
    }
    const getContraStat = () => {
        return getStat(Engine.itemStatsData.contra)
    }

    const issetCreditsbonStat = () => {
        return issetStat(Engine.itemStatsData.creditsbon)
    }
    const getCreditsbonStat = () => {
        return getStat(Engine.itemStatsData.creditsbon)
    }

    const issetCritStat = () => {
        return issetStat(Engine.itemStatsData.crit)
    }
    const getCritStat = () => {
        return getStat(Engine.itemStatsData.crit)
    }

    const issetCritmvalStat = () => {
        return issetStat(Engine.itemStatsData.critmval)
    }
    const getCritmvalStat = () => {
        return getStat(Engine.itemStatsData.critmval)
    }

    const issetCritvalStat = () => {
        return issetStat(Engine.itemStatsData.critval)
    }
    const getCritvalStat = () => {
        return getStat(Engine.itemStatsData.critval)
    }

    const issetDaStat = () => {
        return issetStat(Engine.itemStatsData.da)
    }
    const getDaStat = () => {
        return getStat(Engine.itemStatsData.da)
    }

    const issetDiStat = () => {
        return issetStat(Engine.itemStatsData.di)
    }
    const getDiStat = () => {
        return getStat(Engine.itemStatsData.di)
    }

    const issetDisturbStat = () => {
        return issetStat(Engine.itemStatsData.disturb)
    }
    const getDisturbStat = () => {
        return getStat(Engine.itemStatsData.disturb)
    }

    const issetDsStat = () => {
        return issetStat(Engine.itemStatsData.ds)
    }
    const getDsStat = () => {
        return getStat(Engine.itemStatsData.ds)
    }

    const issetDzStat = () => {
        return issetStat(Engine.itemStatsData.dz)
    }
    const getDzStat = () => {
        return getStat(Engine.itemStatsData.dz)
    }

    const issetEnergybonStat = () => {
        return issetStat(Engine.itemStatsData.energybon)
    }
    const getEnergybonStat = () => {
        return getStat(Engine.itemStatsData.energybon)
    }

    const issetEndestStat = () => {
        return issetStat(Engine.itemStatsData.endest)
    }
    const getEndestStat = () => {
        return getStat(Engine.itemStatsData.endest)
    }

    const issetEnfatigStat = () => {
        return issetStat(Engine.itemStatsData.enfatig)
    }
    const getEnfatigStat = () => {
        return getStat(Engine.itemStatsData.enfatig)
    }

    const issetEvadeStat = () => {
        return issetStat(Engine.itemStatsData.evade)
    }
    const getEvadeStat = () => {
        return getStat(Engine.itemStatsData.evade)
    }

    const issetExpire_dateStat = () => {
        return issetStat(Engine.itemStatsData.expire_date)
    }
    const getExpire_dateStat = () => {
        return getStat(Engine.itemStatsData.expire_date)
    }

    const issetForce_bindingStat = () => {
        return issetStat(Engine.itemStatsData.force_binding)
    }
    const getForce_bindingStat = () => {
        return getStat(Engine.itemStatsData.force_binding)
    }

    const issetFreeskillsStat = () => {
        return issetStat(Engine.itemStatsData.freeskills)
    }
    const getFreeskillsStat = () => {
        return getStat(Engine.itemStatsData.freeskills)
    }

    const issetGoldStat = () => {
        return issetStat(Engine.itemStatsData.gold)
    }
    const getGoldStat = () => {
        return getStat(Engine.itemStatsData.gold)
    }

    const issetGoldpackStat = () => {
        return issetStat(Engine.itemStatsData.goldpack)
    }
    const getGoldpackStat = () => {
        return getStat(Engine.itemStatsData.goldpack)
    }

    const issetHealStat = () => {
        return issetStat(Engine.itemStatsData.heal)
    }
    const getHealStat = () => {
        return getStat(Engine.itemStatsData.heal)
    }

    const issetHonorbonStat = () => {
        return issetStat(Engine.itemStatsData.honorbon)
    }
    const getHonorbonStat = () => {
        return getStat(Engine.itemStatsData.honorbon)
    }

    const issetHpStat = () => {
        return issetStat(Engine.itemStatsData.hp)
    }
    const getHpStat = () => {
        return getStat(Engine.itemStatsData.hp)
    }

    const issetHpbonStat = () => {
        return issetStat(Engine.itemStatsData.hpbon)
    }
    const getHpbonStat = () => {
        return getStat(Engine.itemStatsData.hpbon)
    }

    const issetImproveStat = () => {
        return issetStat(Engine.itemStatsData.improve)
    }
    const getImproveStat = () => {
        return getStat(Engine.itemStatsData.improve)
    }

    const issetLowcritStat = () => {
        return issetStat(Engine.itemStatsData.lowcrit)
    }
    const getLowcritStat = () => {
        return getStat(Engine.itemStatsData.lowcrit)
    }

    const issetLowcritallvalStat = () => {
        return issetStat(Engine.itemStatsData.lowcritallval)
    }
    const getLowcritallvalStat = () => {
        return getStat(Engine.itemStatsData.lowcritallval)
    }

    const issetLowevadeStat = () => {
        return issetStat(Engine.itemStatsData.lowevade)
    }
    const getLowevadeStat = () => {
        return getStat(Engine.itemStatsData.lowevade)
    }

    const issetLowheal2turnsStat = () => {
        return issetStat(Engine.itemStatsData.lowheal2turns)
    }
    const getLowheal2turnsStat = () => {
        return getStat(Engine.itemStatsData.lowheal2turns)
    }

    const issetManaStat = () => {
        return issetStat(Engine.itemStatsData.mana)
    }
    const getManaStat = () => {
        return getStat(Engine.itemStatsData.mana)
    }

    const issetManabonStat = () => {
        return issetStat(Engine.itemStatsData.manabon)
    }
    const getManabonStat = () => {
        return getStat(Engine.itemStatsData.manabon)
    }

    const issetManadestStat = () => {
        return issetStat(Engine.itemStatsData.manadest)
    }
    const getManadestStat = () => {
        return getStat(Engine.itemStatsData.manadest)
    }

    const issetManafatigStat = () => {
        return issetStat(Engine.itemStatsData.manafatig)
    }
    const getManafatigStat = () => {
        return getStat(Engine.itemStatsData.manafatig)
    }

    const issetNpc_lootbonStat = () => {
        return issetStat(Engine.itemStatsData.npc_lootbon)
    }
    const getNpc_lootbonStat = () => {
        return getStat(Engine.itemStatsData.npc_lootbon)
    }

    const issetPierceStat = () => {
        return issetStat(Engine.itemStatsData.pierce)
    }
    const getPierceStat = () => {
        return getStat(Engine.itemStatsData.pierce)
    }

    const issetPiercebStat = () => {
        return issetStat(Engine.itemStatsData.pierceb)
    }
    const getPiercebStat = () => {
        return getStat(Engine.itemStatsData.pierceb)
    }

    const issetQuest_expbonStat = () => {
        return issetStat(Engine.itemStatsData.quest_expbon)
    }
    const getQuest_expbonStat = () => {
        return getStat(Engine.itemStatsData.quest_expbon)
    }

    const issetRageStat = () => {
        return issetStat(Engine.itemStatsData.rage)
    }
    const getRageStat = () => {
        return getStat(Engine.itemStatsData.rage)
    }

    const issetRedstunStat = () => {
        return issetStat(Engine.itemStatsData.redstun)
    }
    const getRedstunStat = () => {
        return getStat(Engine.itemStatsData.redstun)
    }

    const issetResacdmgStat = () => {
        return issetStat(Engine.itemStatsData.resacdmg)
    }
    const getResacdmgStat = () => {
        return getStat(Engine.itemStatsData.resacdmg)
    }

    const issetResdmgStat = () => {
        return issetStat(Engine.itemStatsData.resdmg)
    }
    const getResdmgStat = () => {
        return getStat(Engine.itemStatsData.resdmg)
    }

    const issetResmanaendestStat = () => {
        return issetStat(Engine.itemStatsData.resmanaendest)
    }
    const getResmanaendestStat = () => {
        return getStat(Engine.itemStatsData.resmanaendest)
    }

    const issetRespredStat = () => {
        return issetStat(Engine.itemStatsData.respred)
    }
    const getRespredStat = () => {
        return getStat(Engine.itemStatsData.respred)
    }

    const issetRkeydescStat = () => {
        return issetStat(Engine.itemStatsData.rkeydesc)
    }
    const getRkeydescStat = () => {
        return getStat(Engine.itemStatsData.rkeydesc)
    }

    const issetRunesStat = () => {
        return issetStat(Engine.itemStatsData.runes)
    }
    const getRunesStat = () => {
        return getStat(Engine.itemStatsData.runes)
    }

    const issetSaStat = () => {
        return issetStat(Engine.itemStatsData.sa)
    }
    const getSaStat = () => {
        return getStat(Engine.itemStatsData.sa)
    }

    const issetSa1Stat = () => {
        return issetStat(Engine.itemStatsData.sa1)
    }
    const getSa1Stat = () => {
        return getStat(Engine.itemStatsData.sa1)
    }

    const issetShoutStat = () => {
        return issetStat(Engine.itemStatsData.shout)
    }
    const getShoutStat = () => {
        return getStat(Engine.itemStatsData.shout)
    }

    const issetSlowStat = () => {
        return issetStat(Engine.itemStatsData.slow)
    }
    const getSlowStat = () => {
        return getStat(Engine.itemStatsData.slow)
    }

    const issetSocket_componentStat = () => {
        return issetStat(Engine.itemStatsData.socket_component)
    }
    const getSocket_componentStat = () => {
        return getStat(Engine.itemStatsData.socket_component)
    }

    const issetStaminaStat = () => {
        return issetStat(Engine.itemStatsData.stamina)
    }
    const getStaminaStat = () => {
        return getStat(Engine.itemStatsData.stamina)
    }

    const issetTimelimit_upgmaxStat = () => {
        return issetStat(Engine.itemStatsData.timelimit_upgmax)
    }
    const getTimelimit_upgmaxStat = () => {
        return getStat(Engine.itemStatsData.timelimit_upgmax)
    }

    const issetTimelimit_upgsStat = () => {
        return issetStat(Engine.itemStatsData.timelimit_upgs)
    }
    const getTimelimit_upgsStat = () => {
        return getStat(Engine.itemStatsData.timelimit_upgs)
    }

    const issetWoundStat = () => {
        return issetStat(Engine.itemStatsData.wound)
    }
    const getWoundStat = () => {
        return getStat(Engine.itemStatsData.wound)
    }

    const issetAdd_battlesetStat = () => {
        return issetStat(Engine.itemStatsData.add_battleset)
    }
    const getAdd_battlesetStat = () => {
        return getStat(Engine.itemStatsData.add_battleset)
    }

    const issetAdd_enhancement_refundStat = () => {
        return issetStat(Engine.itemStatsData.add_enhancement_refund)
    }
    const getAdd_enhancement_refundStat = () => {
        return getStat(Engine.itemStatsData.add_enhancement_refund)
    }

    const issetAdd_tab_depositStat = () => {
        return issetStat(Engine.itemStatsData.add_tab_deposit)
    }
    const getAdd_tab_depositStat = () => {
        return getStat(Engine.itemStatsData.add_tab_deposit)
    }

    const issetBtypeStat = () => {
        return issetStat(Engine.itemStatsData.btype)
    }
    const getBtypeStat = () => {
        return getStat(Engine.itemStatsData.btype)
    }

    const issetCapacityStat = () => {
        return issetStat(Engine.itemStatsData.capacity)
    }
    const getCapacityStat = () => {
        return getStat(Engine.itemStatsData.capacity)
    }

    const issetEnhancement_refundStat = () => {
        return issetStat(Engine.itemStatsData.enhancement_refund)
    }
    const getEnhancement_refundStat = () => {
        return getStat(Engine.itemStatsData.enhancement_refund)
    }

    const issetExpaddStat = () => {
        return issetStat(Engine.itemStatsData.expadd)
    }
    const getExpaddStat = () => {
        return getStat(Engine.itemStatsData.expadd)
    }

    const issetExpaddlvlStat = () => {
        return issetStat(Engine.itemStatsData.expaddlvl)
    }
    const getExpaddlvlStat = () => {
        return getStat(Engine.itemStatsData.expaddlvl)
    }

    const issetLvlupgcostStat = () => {
        return issetStat(Engine.itemStatsData.lvlupgcost)
    }
    const getLvlupgcostStat = () => {
        return getStat(Engine.itemStatsData.lvlupgcost)
    }

    const issetLvlupgsStat = () => {
        return issetStat(Engine.itemStatsData.lvlupgs)
    }
    const getLvlupgsStat = () => {
        return getStat(Engine.itemStatsData.lvlupgs)
    }

    const issetNosplitStat = () => {
        return issetStat(Engine.itemStatsData.nosplit)
    }
    const getNosplitStat = () => {
        return getStat(Engine.itemStatsData.nosplit)
    }

    const issetReset_custom_teleportStat = () => {
        return issetStat(Engine.itemStatsData.reset_custom_teleport)
    }
    const getReset_custom_teleportStat = () => {
        return getStat(Engine.itemStatsData.reset_custom_teleport)
    }

    const issetUpglvlStat = () => {
        return issetStat(Engine.itemStatsData.upglvl)
    }
    const getUpglvlStat = () => {
        return getStat(Engine.itemStatsData.upglvl)
    }

    const issetUpgtimelimitStat = () => {
        return issetStat(Engine.itemStatsData.upgtimelimit)
    }
    const getUpgtimelimitStat = () => {
        return getStat(Engine.itemStatsData.upgtimelimit)
    }

    const issetWanted_changeStat = () => {
        return issetStat(Engine.itemStatsData.wanted_change)
    }
    const getWanted_changeStat = () => {
        return getStat(Engine.itemStatsData.wanted_change)
    }

    const issetLegbonStat = () => {
        return issetStat(Engine.itemStatsData.legbon)
    }
    const getLegbonStat = () => {
        return getStat(Engine.itemStatsData.legbon)
    }

    const issetLegbon_testStat = () => {
        return issetStat(Engine.itemStatsData.legbon_test)
    }
    const getLegbon_testStat = () => {
        return getStat(Engine.itemStatsData.legbon_test)
    }

    const issetTownlimitStat = () => {
        return issetStat(Engine.itemStatsData.townlimit)
    }
    const getTownlimitStat = () => {
        return getStat(Engine.itemStatsData.townlimit)
    }

    const issetFurnitureStat = () => {
        return issetStat(Engine.itemStatsData.furniture)
    }
    const getFurnitureStat = () => {
        return getStat(Engine.itemStatsData.furniture)
    }

    const issetNodescStat = () => {
        return issetStat(Engine.itemStatsData.nodesc)
    }
    const getNodescStat = () => {
        return getStat(Engine.itemStatsData.nodesc)
    }

    const issetLootStat = () => {
        return issetStat(Engine.itemStatsData.loot)
    }
    const getLootStat = () => {
        return getStat(Engine.itemStatsData.loot)
    }

    const issetTeleportStat = () => {
        return issetStat(Engine.itemStatsData.teleport)
    }
    const getTeleportStat = () => {
        return getStat(Engine.itemStatsData.teleport)
    }

    const issetOpisStat = () => {
        return issetStat(Engine.itemStatsData.opis)
    }
    const getOpisStat = () => {
        return getStat(Engine.itemStatsData.opis)
    }

    const issetPumpkin_weightStat = () => {
        return issetStat(Engine.itemStatsData.pumpkin_weight)
    }
    const getPumpkin_weightStat = () => {
        return getStat(Engine.itemStatsData.pumpkin_weight)
    }

    const issetUpgStat = () => {
        return issetStat(Engine.itemStatsData.upg)
    }
    const getUpgStat = () => {
        return getStat(Engine.itemStatsData.upg)
    }

    const issetArtisanbonStat = () => {
        return issetStat(Engine.itemStatsData.artisanbon)
    }
    const getArtisanbonStat = () => {
        return getStat(Engine.itemStatsData.artisanbon)
    }

    const issetBindsStat = () => {
        return issetStat(Engine.itemStatsData.binds)
    }
    const getBindsStat = () => {
        return getStat(Engine.itemStatsData.binds)
    }

    const issetArtisan_worthlessStat = () => {
        return issetStat(Engine.itemStatsData.artisan_worthless)
    }
    const getArtisan_worthlessStat = () => {
        return getStat(Engine.itemStatsData.artisan_worthless)
    }

    const issetNoauctionStat = () => {
        return issetStat(Engine.itemStatsData.noauction)
    }
    const getNoauctionStat = () => {
        return getStat(Engine.itemStatsData.noauction)
    }

    const issetNodepoclanStat = () => {
        return issetStat(Engine.itemStatsData.nodepoclan)
    }
    const getNodepoclanStat = () => {
        return getStat(Engine.itemStatsData.nodepoclan)
    }

    const issetNotakeoffStat = () => {
        return issetStat(Engine.itemStatsData.notakeoff)
    }
    const getNotakeoffStat = () => {
        return getStat(Engine.itemStatsData.notakeoff)
    }

    const issetOutexchangeStat = () => {
        return issetStat(Engine.itemStatsData.outexchange)
    }
    const getOutexchangeStat = () => {
        return getStat(Engine.itemStatsData.outexchange)
    }

    const issetRecoveredStat = () => {
        return issetStat(Engine.itemStatsData.recovered)
    }
    const getRecoveredStat = () => {
        return getStat(Engine.itemStatsData.recovered)
    }

    const issetUnbindStat = () => {
        return issetStat(Engine.itemStatsData.unbind)
    }
    const getUnbindStat = () => {
        return getStat(Engine.itemStatsData.unbind)
    }

    const issetUnbind_creditsStat = () => {
        return issetStat(Engine.itemStatsData.unbind_credits)
    }
    const getUnbind_creditsStat = () => {
        return getStat(Engine.itemStatsData.unbind_credits)
    }

    const issetUndoupgStat = () => {
        return issetStat(Engine.itemStatsData.undoupg)
    }
    const getUndoupgStat = () => {
        return getStat(Engine.itemStatsData.undoupg)
    }

    const issetMaxuselvlStat = () => {
        return issetStat(Engine.itemStatsData.maxuselvl)
    }
    const getMaxuselvlStat = () => {
        return getStat(Engine.itemStatsData.maxuselvl)
    }

    const issetMaxstatslvlStat = () => {
        return issetStat(Engine.itemStatsData.maxstatslvl)
    }
    const getMaxstatslvlStat = () => {
        return getStat(Engine.itemStatsData.maxstatslvl)
    }

    const issetTarget_min_lvlStat = () => {
        return issetStat(Engine.itemStatsData.target_min_lvl)
    }
    const getTarget_min_lvlStat = () => {
        return getStat(Engine.itemStatsData.target_min_lvl)
    }

    const issetTarget_max_lvlStat = () => {
        return issetStat(Engine.itemStatsData.target_max_lvl)
    }
    const getTarget_max_lvlStat = () => {
        return getStat(Engine.itemStatsData.target_max_lvl)
    }

    const issetLvlnextStat = () => {
        return issetStat(Engine.itemStatsData.lvlnext)
    }
    const getLvlnextStat = () => {
        return getStat(Engine.itemStatsData.lvlnext)
    }

    const issetReqgoldStat = () => {
        return issetStat(Engine.itemStatsData.reqgold)
    }
    const getReqgoldStat = () => {
        return getStat(Engine.itemStatsData.reqgold)
    }

    const issetReqsStat = () => {
        return issetStat(Engine.itemStatsData.reqs)
    }
    const getReqsStat = () => {
        return getStat(Engine.itemStatsData.reqs)
    }

    const issetReqzStat = () => {
        return issetStat(Engine.itemStatsData.reqz)
    }
    const getReqzStat = () => {
        return getStat(Engine.itemStatsData.reqz)
    }

    const issetReqiStat = () => {
        return issetStat(Engine.itemStatsData.reqi)
    }
    const getReqiStat = () => {
        return getStat(Engine.itemStatsData.reqi)
    }

    const issetRsklStat = () => {
        return issetStat(Engine.itemStatsData.rskl)
    }
    const getRsklStat = () => {
        return getStat(Engine.itemStatsData.rskl)
    }

    const issetSocket_contentStat = () => {
        return issetStat(Engine.itemStatsData.socket_content)
    }
    const getSocket_contentStat = () => {
        return getStat(Engine.itemStatsData.socket_content)
    }

    const issetSocket_enhancerStat = () => {
        return issetStat(Engine.itemStatsData.socket_enhancer)
    }
    const getSocket_enhancerStat = () => {
        return getStat(Engine.itemStatsData.socket_enhancer)
    }




    const issetBookStat = () => {
        return issetStat(Engine.itemStatsData.book)
    }
    const getBookStat = () => {
        return getStat(Engine.itemStatsData.book)
    }

    const issetPriceStat = () => {
        return issetStat(Engine.itemStatsData.price)
    }
    const getPriceStat = () => {
        return getStat(Engine.itemStatsData.price)
    }

    const issetRespStat = () => {
        return issetStat(Engine.itemStatsData.resp)
    }
    const getRespStat = () => {
        return getStat(Engine.itemStatsData.resp)
    }

    const issetKeyStat = () => {
        return issetStat(Engine.itemStatsData.key)
    }
    const getKeyStat = () => {
        return getStat(Engine.itemStatsData.key)
    }

    const issetMkeyStat = () => {
        return issetStat(Engine.itemStatsData.mkey)
    }
    const getMkeyStat = () => {
        return getStat(Engine.itemStatsData.mkey)
    }

    const issetRkeyStat = () => {
        return issetStat(Engine.itemStatsData.rkey)
    }
    const getRkeyStat = () => {
        return getStat(Engine.itemStatsData.rkey)
    }

    const issetRlvlStat = () => {
        return issetStat(Engine.itemStatsData.rlvl)
    }
    const getRlvlStat = () => {
        return getStat(Engine.itemStatsData.rlvl)
    }

    const issetMotelStat = () => {
        return issetStat(Engine.itemStatsData.motel)
    }
    const getMotelStat = () => {
        return getStat(Engine.itemStatsData.motel)
    }

    const issetEmoStat = () => {
        return issetStat(Engine.itemStatsData.emo)
    }
    const getEmoStat = () => {
        return getStat(Engine.itemStatsData.emo)
    }

    const issetQuestStat = () => {
        return issetStat(Engine.itemStatsData.quest)
    }
    const getQuestStat = () => {
        return getStat(Engine.itemStatsData.quest)
    }

    const issetPlayStat = () => {
        return issetStat(Engine.itemStatsData.play)
    }
    const getPlayStat = () => {
        return getStat(Engine.itemStatsData.play)
    }

    const issetSzablonStat = () => {
        return issetStat(Engine.itemStatsData.szablon)
    }
    const getSzablonStat = () => {
        return getStat(Engine.itemStatsData.szablon)
    }

    const issetNullStat = () => {
        return issetStat(Engine.itemStatsData.null)
    }
    const getNullStat = () => {
        return getStat(Engine.itemStatsData.null)
    }

    const issetProgressStat = () => {
        return issetStat(Engine.itemStatsData.progress)
    }
    const getProgressStat = () => {
        return getStat(Engine.itemStatsData.progress)
    }

    const issetLootboxStat = () => {
        return issetStat(Engine.itemStatsData.lootbox)
    }
    const getLootboxStat = () => {
        return getStat(Engine.itemStatsData.lootbox)
    }

    const issetLootbox2Stat = () => {
        return issetStat(Engine.itemStatsData.lootbox2)
    }
    const getLootbox2Stat = () => {
        return getStat(Engine.itemStatsData.lootbox2)
    }


    const issetof_strStat = () => {
        return issetStat(Engine.itemStatsData["of-str"])
    }
    const getof_strStat = () => {
        return getStat(Engine.itemStatsData["of-str"])
    }

    const issetItemStat = (statName) => {
        const ITEMS_STATS_DATA = Engine.itemStatsData;
        switch (statName) {
            case ITEMS_STATS_DATA.action:
                return issetActionStat();
            case ITEMS_STATS_DATA.bonus:
                return issetBonusStat();
            case ITEMS_STATS_DATA.summonparty:
                return issetSummonpartyStat();
            case ITEMS_STATS_DATA.enhancement_upgrade_lvl:
                return issetEnhancement_upgrade_lvlStat();
            case ITEMS_STATS_DATA.enhancement_add:
                return issetEnhancement_addStat()
            case ITEMS_STATS_DATA.enhancement_add_point:
                return issetEnhancement_add_pointStat();
            case ITEMS_STATS_DATA.ttl:
                return issetTtlStat();
            case ITEMS_STATS_DATA.cursed:
                return issetCursedStat();
            case ITEMS_STATS_DATA.amount:
                return issetAmountStat();
            case ITEMS_STATS_DATA.outfit:
                return issetOutfitStat();
            case ITEMS_STATS_DATA.outfit_selector:
                return issetOutfit_selectorStat();
            case ITEMS_STATS_DATA.pet:
                return issetPetStat();
            case ITEMS_STATS_DATA.cansplit:
                return issetCansplitStat();
            case ITEMS_STATS_DATA.permbound:
                return issetPermboundStat();
            case ITEMS_STATS_DATA.soulbound:
                return issetSoulboundStat();
                // case ITEMS_STATS_DATA.play:                       return issetPlayStat();
            case ITEMS_STATS_DATA.canpreview:
                return issetCanpreviewStat();
            case ITEMS_STATS_DATA.bonus_not_selected:
                return issetBonus_not_selectedStat();
            case ITEMS_STATS_DATA.bonus_reselect:
                return issetBonus_reselectStat();
            case ITEMS_STATS_DATA.rarity:
                return issetRarityStat();
            case ITEMS_STATS_DATA.target_rarity:
                return issetTarget_rarityStat();
            case ITEMS_STATS_DATA.bag:
                return issetBagStat();
            case ITEMS_STATS_DATA.lvl:
                return issetLvlStat();
            case ITEMS_STATS_DATA.custom_teleport:
                return issetCustom_teleportStat();
            case ITEMS_STATS_DATA.expires:
                return issetExpiresStat();
            case ITEMS_STATS_DATA.timelimit:
                return issetTimelimitStat();
            case ITEMS_STATS_DATA.lowreq:
                return issetLowreqStat();
            case ITEMS_STATS_DATA.personal:
                return issetPersonalStat();
            case ITEMS_STATS_DATA.reqp:
                return issetReqpStat();
            case ITEMS_STATS_DATA.revive:
                return issetReviveStat();
            case ITEMS_STATS_DATA.animation:
                return issetAnimationStat();
                // case ITEMS_STATS_DATA.emo:                        return issetEmoStat();
            case ITEMS_STATS_DATA.leczy:
                return issetLeczyStat();
            case ITEMS_STATS_DATA.fullheal:
                return issetFullhealStat();
            case ITEMS_STATS_DATA.perheal:
                return issetPerhealStat();
                // case ITEMS_STATS_DATA.lootbox:                    return issetLootboxStat();
                // case ITEMS_STATS_DATA.lootbox2:                   return issetLootbox2Stat();
            case ITEMS_STATS_DATA.recipe:
                return issetRecipeStat();
            case ITEMS_STATS_DATA.nodepo:
                return issetNodepoStat();



            case ITEMS_STATS_DATA.book:
                return issetBookStat()
            case ITEMS_STATS_DATA.price:
                return issetPriceStat()
            case ITEMS_STATS_DATA.resp:
                return issetRespStat()
            case ITEMS_STATS_DATA.key:
                return issetKeyStat()
            case ITEMS_STATS_DATA.mkey:
                return issetMkeyStat()
            case ITEMS_STATS_DATA.rkey:
                return issetRkeyStat()
            case ITEMS_STATS_DATA.rlvl:
                return issetRlvlStat()
            case ITEMS_STATS_DATA.motel:
                return issetMotelStat()
            case ITEMS_STATS_DATA.emo:
                return issetEmoStat()
            case ITEMS_STATS_DATA.quest:
                return issetQuestStat()
            case ITEMS_STATS_DATA.play:
                return issetPlayStat()
            case ITEMS_STATS_DATA.szablon:
                return issetSzablonStat()
            case ITEMS_STATS_DATA.null:
                return issetNullStat()
            case ITEMS_STATS_DATA.progress:
                return issetProgressStat()
            case ITEMS_STATS_DATA.lootbox:
                return issetLootboxStat()
            case ITEMS_STATS_DATA.lootbox2:
                return issetLootbox2Stat()



            case ITEMS_STATS_DATA["of-str"]:
                return issetof_strStat();

            case ITEMS_STATS_DATA.ac:
                return issetAcStat()
            case ITEMS_STATS_DATA.dmg:
                return issetDmgStat()
            case ITEMS_STATS_DATA.act:
                return issetActStat()
            case ITEMS_STATS_DATA.expire_duration:
                return issetExpire_durationStat()
            case ITEMS_STATS_DATA.int:
                return issetIntStat()
            case ITEMS_STATS_DATA.npc_expbon:
                return issetNpc_expbonStat()
            case ITEMS_STATS_DATA.pdmg:
                return issetPdmgStat()
            case ITEMS_STATS_DATA.perdmg:
                return issetPerdmgStat()
            case ITEMS_STATS_DATA.resfire:
                return issetResfireStat()
            case ITEMS_STATS_DATA.resfrost:
                return issetResfrostStat()
            case ITEMS_STATS_DATA.reslight:
                return issetReslightStat()
            case ITEMS_STATS_DATA.sila:
                return issetSilaStat()
            case ITEMS_STATS_DATA.zr:
                return issetZrStat()
            case ITEMS_STATS_DATA.actdmg:
                return issetActdmgStat()
            case ITEMS_STATS_DATA.agi:
                return issetAgiStat()
            case ITEMS_STATS_DATA.fire:
                return issetFireStat()
            case ITEMS_STATS_DATA.firebon:
                return issetFirebonStat()
            case ITEMS_STATS_DATA.frost:
                return issetFrostStat()
            case ITEMS_STATS_DATA.frostbon:
                return issetFrostbonStat()
            case ITEMS_STATS_DATA.frostpunch:
                return issetFrostpunchStat()
            case ITEMS_STATS_DATA.hpsa:
                return issetHpsaStat()
            case ITEMS_STATS_DATA.light:
                return issetLightStat()
            case ITEMS_STATS_DATA.lightbon:
                return issetLightbonStat()
            case ITEMS_STATS_DATA.lightmindmg:
                return issetLightmindmgStat()
            case ITEMS_STATS_DATA.mresdmg:
                return issetMresdmgStat()
            case ITEMS_STATS_DATA.pet2:
                return issetPet2Stat()
            case ITEMS_STATS_DATA.poison:
                return issetPoisonStat()
            case ITEMS_STATS_DATA.str:
                return issetStrStat()
            case ITEMS_STATS_DATA.abdest:
                return issetAbdestStat()
            case ITEMS_STATS_DATA.absorb:
                return issetAbsorbStat()
            case ITEMS_STATS_DATA.absorbm:
                return issetAbsorbmStat()
            case ITEMS_STATS_DATA.acdmg:
                return issetAcdmgStat()
            case ITEMS_STATS_DATA.adest:
                return issetAdestStat()
            case ITEMS_STATS_DATA.afterheal:
                return issetAfterhealStat()
            case ITEMS_STATS_DATA.afterheal2:
                return issetAfterheal2Stat()
            case ITEMS_STATS_DATA.battlestats:
                return issetBattlestatsStat()
            case ITEMS_STATS_DATA.blok:
                return issetBlokStat()
            case ITEMS_STATS_DATA.contra:
                return issetContraStat()
            case ITEMS_STATS_DATA.creditsbon:
                return issetCreditsbonStat()
            case ITEMS_STATS_DATA.crit:
                return issetCritStat()
            case ITEMS_STATS_DATA.critmval:
                return issetCritmvalStat()
            case ITEMS_STATS_DATA.critval:
                return issetCritvalStat()
            case ITEMS_STATS_DATA.da:
                return issetDaStat()
            case ITEMS_STATS_DATA.di:
                return issetDiStat()
            case ITEMS_STATS_DATA.disturb:
                return issetDisturbStat()
            case ITEMS_STATS_DATA.ds:
                return issetDsStat()
            case ITEMS_STATS_DATA.dz:
                return issetDzStat()
            case ITEMS_STATS_DATA.energybon:
                return issetEnergybonStat()
            case ITEMS_STATS_DATA.endest:
                return issetEndestStat()
            case ITEMS_STATS_DATA.enfatig:
                return issetEnfatigStat()
            case ITEMS_STATS_DATA.evade:
                return issetEvadeStat()
            case ITEMS_STATS_DATA.expire_date:
                return issetExpire_dateStat()
            case ITEMS_STATS_DATA.force_binding:
                return issetForce_bindingStat()
            case ITEMS_STATS_DATA.freeskills:
                return issetFreeskillsStat()
            case ITEMS_STATS_DATA.gold:
                return issetGoldStat()
            case ITEMS_STATS_DATA.goldpack:
                return issetGoldpackStat()
            case ITEMS_STATS_DATA.heal:
                return issetHealStat()
            case ITEMS_STATS_DATA.honorbon:
                return issetHonorbonStat()
            case ITEMS_STATS_DATA.hp:
                return issetHpStat()
            case ITEMS_STATS_DATA.hpbon:
                return issetHpbonStat()
            case ITEMS_STATS_DATA.improve:
                return issetImproveStat()
            case ITEMS_STATS_DATA.lowcrit:
                return issetLowcritStat()
            case ITEMS_STATS_DATA.lowcritallval:
                return issetLowcritallvalStat()
            case ITEMS_STATS_DATA.lowevade:
                return issetLowevadeStat()
            case ITEMS_STATS_DATA.lowheal2turns:
                return issetLowheal2turnsStat()
            case ITEMS_STATS_DATA.mana:
                return issetManaStat()
            case ITEMS_STATS_DATA.manabon:
                return issetManabonStat()
            case ITEMS_STATS_DATA.manadest:
                return issetManadestStat()
            case ITEMS_STATS_DATA.manafatig:
                return issetManafatigStat()
            case ITEMS_STATS_DATA.npc_lootbon:
                return issetNpc_lootbonStat()
            case ITEMS_STATS_DATA.pierce:
                return issetPierceStat()
            case ITEMS_STATS_DATA.pierceb:
                return issetPiercebStat()
            case ITEMS_STATS_DATA.quest_expbon:
                return issetQuest_expbonStat()
            case ITEMS_STATS_DATA.rage:
                return issetRageStat()
            case ITEMS_STATS_DATA.redstun:
                return issetRedstunStat()
            case ITEMS_STATS_DATA.resacdmg:
                return issetResacdmgStat()
            case ITEMS_STATS_DATA.resdmg:
                return issetResdmgStat()
            case ITEMS_STATS_DATA.resmanaendest:
                return issetResmanaendestStat()
            case ITEMS_STATS_DATA.respred:
                return issetRespredStat()
            case ITEMS_STATS_DATA.rkeydesc:
                return issetRkeydescStat()
            case ITEMS_STATS_DATA.runes:
                return issetRunesStat()
            case ITEMS_STATS_DATA.sa:
                return issetSaStat()
            case ITEMS_STATS_DATA.sa1:
                return issetSa1Stat()
            case ITEMS_STATS_DATA.shout:
                return issetShoutStat()
            case ITEMS_STATS_DATA.slow:
                return issetSlowStat()
            case ITEMS_STATS_DATA.socket_component:
                return issetSocket_componentStat()
            case ITEMS_STATS_DATA.stamina:
                return issetStaminaStat()
            case ITEMS_STATS_DATA.timelimit_upgmax:
                return issetTimelimit_upgmaxStat()
            case ITEMS_STATS_DATA.timelimit_upgs:
                return issetTimelimit_upgsStat()
            case ITEMS_STATS_DATA.wound:
                return issetWoundStat()
            case ITEMS_STATS_DATA.add_battleset:
                return issetAdd_battlesetStat()
            case ITEMS_STATS_DATA.add_enhancement_refund:
                return issetAdd_enhancement_refundStat()
            case ITEMS_STATS_DATA.add_tab_deposit:
                return issetAdd_tab_depositStat()
            case ITEMS_STATS_DATA.btype:
                return issetBtypeStat()
            case ITEMS_STATS_DATA.capacity:
                return issetCapacityStat()
            case ITEMS_STATS_DATA.enhancement_refund:
                return issetEnhancement_refundStat()
            case ITEMS_STATS_DATA.expadd:
                return issetExpaddStat()
            case ITEMS_STATS_DATA.expaddlvl:
                return issetExpaddlvlStat()
            case ITEMS_STATS_DATA.lvlupgcost:
                return issetLvlupgcostStat()
            case ITEMS_STATS_DATA.lvlupgs:
                return issetLvlupgsStat()
            case ITEMS_STATS_DATA.nosplit:
                return issetNosplitStat()
            case ITEMS_STATS_DATA.reset_custom_teleport:
                return issetReset_custom_teleportStat()
            case ITEMS_STATS_DATA.upglvl:
                return issetUpglvlStat()
            case ITEMS_STATS_DATA.upgtimelimit:
                return issetUpgtimelimitStat()
            case ITEMS_STATS_DATA.wanted_change:
                return issetWanted_changeStat()
            case ITEMS_STATS_DATA.legbon:
                return issetLegbonStat()
            case ITEMS_STATS_DATA.legbon_test:
                return issetLegbon_testStat()
            case ITEMS_STATS_DATA.townlimit:
                return issetTownlimitStat()
            case ITEMS_STATS_DATA.furniture:
                return issetFurnitureStat()
            case ITEMS_STATS_DATA.nodesc:
                return issetNodescStat()
            case ITEMS_STATS_DATA.loot:
                return issetLootStat()
            case ITEMS_STATS_DATA.teleport:
                return issetTeleportStat()
            case ITEMS_STATS_DATA.opis:
                return issetOpisStat()
            case ITEMS_STATS_DATA.pumpkin_weight:
                return issetPumpkin_weightStat()
            case ITEMS_STATS_DATA.upg:
                return issetUpgStat()
            case ITEMS_STATS_DATA.artisanbon:
                return issetArtisanbonStat()
            case ITEMS_STATS_DATA.binds:
                return issetBindsStat()
            case ITEMS_STATS_DATA.artisan_worthless:
                return issetArtisan_worthlessStat()
            case ITEMS_STATS_DATA.noauction:
                return issetNoauctionStat()
            case ITEMS_STATS_DATA.nodepoclan:
                return issetNodepoclanStat()
            case ITEMS_STATS_DATA.notakeoff:
                return issetNotakeoffStat()
            case ITEMS_STATS_DATA.outexchange:
                return issetOutexchangeStat()
            case ITEMS_STATS_DATA.recovered:
                return issetRecoveredStat()
            case ITEMS_STATS_DATA.unbind:
                return issetUnbindStat()
            case ITEMS_STATS_DATA.unbind_credits:
                return issetUnbind_creditsStat()
            case ITEMS_STATS_DATA.undoupg:
                return issetUndoupgStat()
            case ITEMS_STATS_DATA.maxuselvl:
                return issetMaxuselvlStat()
            case ITEMS_STATS_DATA.maxstatslvl:
                return issetMaxstatslvlStat()
            case ITEMS_STATS_DATA.target_min_lvl:
                return issetTarget_min_lvlStat()
            case ITEMS_STATS_DATA.target_max_lvl:
                return issetTarget_max_lvlStat()
            case ITEMS_STATS_DATA.lvlnext:
                return issetLvlnextStat()
            case ITEMS_STATS_DATA.reqgold:
                return issetReqgoldStat()
            case ITEMS_STATS_DATA.reqs:
                return issetReqsStat()
            case ITEMS_STATS_DATA.reqz:
                return issetReqzStat()
            case ITEMS_STATS_DATA.reqi:
                return issetReqiStat()
            case ITEMS_STATS_DATA.rskl:
                return issetRsklStat()
            case ITEMS_STATS_DATA.socket_content:
                return issetSocket_contentStat()
            case ITEMS_STATS_DATA.socket_enhancer:
                return issetSocket_enhancerStat()
            default: {
                debugger;
                errorReport(moduleData.fileName, "issetItemStat", "Unknown stat name: " + statName);
                return null
            }
        }
    }

    const getItemStat = (statName) => {
        const ITEMS_STATS_DATA = Engine.itemStatsData;
        switch (statName) {
            case ITEMS_STATS_DATA.action:
                return getActionStat();
            case ITEMS_STATS_DATA.bonus:
                return getBonusStat();
            case ITEMS_STATS_DATA.summonparty:
                return getSummonpartyStat();
            case ITEMS_STATS_DATA.enhancement_upgrade_lvl:
                return getEnhancement_upgrade_lvlStat();
            case ITEMS_STATS_DATA.enhancement_add:
                return getEnhancement_addStat()
            case ITEMS_STATS_DATA.enhancement_add_point:
                return getEnhancement_add_pointStat();
            case ITEMS_STATS_DATA.ttl:
                return getTtlStat();
            case ITEMS_STATS_DATA.cursed:
                return getCursedStat();
            case ITEMS_STATS_DATA.amount:
                return getAmountStat();
            case ITEMS_STATS_DATA.outfit:
                return getOutfitStat();
            case ITEMS_STATS_DATA.outfit_selector:
                return getOutfit_selectorStat();
            case ITEMS_STATS_DATA.pet:
                return getPetStat();
            case ITEMS_STATS_DATA.cansplit:
                return getCansplitStat();
            case ITEMS_STATS_DATA.permbound:
                return getPermboundStat();
            case ITEMS_STATS_DATA.soulbound:
                return getSoulboundStat();
                // case ITEMS_STATS_DATA.play:                         return getPlayStat();
            case ITEMS_STATS_DATA.canpreview:
                return getCanpreviewStat();
            case ITEMS_STATS_DATA.bonus_not_selected:
                return getBonus_not_selectedStat();
            case ITEMS_STATS_DATA.bonus_reselect:
                return getBonus_reselectStat();
            case ITEMS_STATS_DATA.rarity:
                return getRarityStat();
            case ITEMS_STATS_DATA.target_rarity:
                return getTarget_rarityStat();
            case ITEMS_STATS_DATA.bag:
                return getBagStat();
            case ITEMS_STATS_DATA.lvl:
                return getLvlStat();
            case ITEMS_STATS_DATA.custom_teleport:
                return getCustom_teleportStat();
            case ITEMS_STATS_DATA.expires:
                return getExpiresStat();
            case ITEMS_STATS_DATA.timelimit:
                return getTimelimitStat();
            case ITEMS_STATS_DATA.lowreq:
                return getLowreqStat();
            case ITEMS_STATS_DATA.personal:
                return getPersonalStat();
            case ITEMS_STATS_DATA.reqp:
                return getReqpStat();
            case ITEMS_STATS_DATA.revive:
                return getReviveStat();
            case ITEMS_STATS_DATA.animation:
                return getAnimationStat();
                // case ITEMS_STATS_DATA.emo:                          return getEmoStat();
            case ITEMS_STATS_DATA.leczy:
                return getLeczyStat();
            case ITEMS_STATS_DATA.fullheal:
                return getFullhealStat();
            case ITEMS_STATS_DATA.perheal:
                return getPerhealStat();
                // case ITEMS_STATS_DATA.lootbox:                      return getLootboxStat();
                // case ITEMS_STATS_DATA.lootbox2:                     return getLootbox2Stat();
            case ITEMS_STATS_DATA.recipe:
                return getRecipeStat();
            case ITEMS_STATS_DATA.nodepo:
                return getNodepoStat();



            case ITEMS_STATS_DATA.book:
                return getBookStat()
            case ITEMS_STATS_DATA.price:
                return getPriceStat()
            case ITEMS_STATS_DATA.resp:
                return getRespStat()
            case ITEMS_STATS_DATA.key:
                return getKeyStat()
            case ITEMS_STATS_DATA.mkey:
                return getMkeyStat()
            case ITEMS_STATS_DATA.rkey:
                return getRkeyStat()
            case ITEMS_STATS_DATA.rlvl:
                return getRlvlStat()
            case ITEMS_STATS_DATA.motel:
                return getMotelStat()
            case ITEMS_STATS_DATA.emo:
                return getEmoStat()
            case ITEMS_STATS_DATA.quest:
                return getQuestStat()
            case ITEMS_STATS_DATA.play:
                return getPlayStat()
            case ITEMS_STATS_DATA.szablon:
                return getSzablonStat()
            case ITEMS_STATS_DATA.null:
                return getNullStat()
            case ITEMS_STATS_DATA.progress:
                return getProgressStat()
            case ITEMS_STATS_DATA.lootbox:
                return getLootboxStat()
            case ITEMS_STATS_DATA.lootbox2:
                return getLootbox2Stat()


            case ITEMS_STATS_DATA["of-str"]:
                return getof_strStat();


            case ITEMS_STATS_DATA.ac:
                return getAcStat()
            case ITEMS_STATS_DATA.dmg:
                return getDmgStat()
            case ITEMS_STATS_DATA.act:
                return getActStat()
            case ITEMS_STATS_DATA.expire_duration:
                return getExpire_durationStat()
            case ITEMS_STATS_DATA.int:
                return getIntStat()
            case ITEMS_STATS_DATA.npc_expbon:
                return getNpc_expbonStat()
            case ITEMS_STATS_DATA.pdmg:
                return getPdmgStat()
            case ITEMS_STATS_DATA.perdmg:
                return getPerdmgStat()
            case ITEMS_STATS_DATA.resfire:
                return getResfireStat()
            case ITEMS_STATS_DATA.resfrost:
                return getResfrostStat()
            case ITEMS_STATS_DATA.reslight:
                return getReslightStat()
            case ITEMS_STATS_DATA.sila:
                return getSilaStat()
            case ITEMS_STATS_DATA.zr:
                return getZrStat()
            case ITEMS_STATS_DATA.actdmg:
                return getActdmgStat()
            case ITEMS_STATS_DATA.agi:
                return getAgiStat()
            case ITEMS_STATS_DATA.fire:
                return getFireStat()
            case ITEMS_STATS_DATA.firebon:
                return getFirebonStat()
            case ITEMS_STATS_DATA.frost:
                return getFrostStat()
            case ITEMS_STATS_DATA.frostbon:
                return getFrostbonStat()
            case ITEMS_STATS_DATA.frostpunch:
                return getFrostpunchStat()
            case ITEMS_STATS_DATA.hpsa:
                return getHpsaStat()
            case ITEMS_STATS_DATA.light:
                return getLightStat()
            case ITEMS_STATS_DATA.lightbon:
                return getLightbonStat()
            case ITEMS_STATS_DATA.lightmindmg:
                return getLightmindmgStat()
            case ITEMS_STATS_DATA.mresdmg:
                return getMresdmgStat()
            case ITEMS_STATS_DATA.pet2:
                return getPet2Stat()
            case ITEMS_STATS_DATA.poison:
                return getPoisonStat()
            case ITEMS_STATS_DATA.str:
                return getStrStat()
            case ITEMS_STATS_DATA.abdest:
                return getAbdestStat()
            case ITEMS_STATS_DATA.absorb:
                return getAbsorbStat()
            case ITEMS_STATS_DATA.absorbm:
                return getAbsorbmStat()
            case ITEMS_STATS_DATA.acdmg:
                return getAcdmgStat()
            case ITEMS_STATS_DATA.adest:
                return getAdestStat()
            case ITEMS_STATS_DATA.afterheal:
                return getAfterhealStat()
            case ITEMS_STATS_DATA.afterheal2:
                return getAfterheal2Stat()
            case ITEMS_STATS_DATA.battlestats:
                return getBattlestatsStat()
            case ITEMS_STATS_DATA.blok:
                return getBlokStat()
            case ITEMS_STATS_DATA.contra:
                return getContraStat()
            case ITEMS_STATS_DATA.creditsbon:
                return getCreditsbonStat()
            case ITEMS_STATS_DATA.crit:
                return getCritStat()
            case ITEMS_STATS_DATA.critmval:
                return getCritmvalStat()
            case ITEMS_STATS_DATA.critval:
                return getCritvalStat()
            case ITEMS_STATS_DATA.da:
                return getDaStat()
            case ITEMS_STATS_DATA.di:
                return getDiStat()
            case ITEMS_STATS_DATA.disturb:
                return getDisturbStat()
            case ITEMS_STATS_DATA.ds:
                return getDsStat()
            case ITEMS_STATS_DATA.dz:
                return getDzStat()
            case ITEMS_STATS_DATA.energybon:
                return getEnergybonStat()
            case ITEMS_STATS_DATA.endest:
                return getEndestStat()
            case ITEMS_STATS_DATA.enfatig:
                return getEnfatigStat()
            case ITEMS_STATS_DATA.evade:
                return getEvadeStat()
            case ITEMS_STATS_DATA.expire_date:
                return getExpire_dateStat()
            case ITEMS_STATS_DATA.force_binding:
                return getForce_bindingStat()
            case ITEMS_STATS_DATA.freeskills:
                return getFreeskillsStat()
            case ITEMS_STATS_DATA.gold:
                return getGoldStat()
            case ITEMS_STATS_DATA.goldpack:
                return getGoldpackStat()
            case ITEMS_STATS_DATA.heal:
                return getHealStat()
            case ITEMS_STATS_DATA.honorbon:
                return getHonorbonStat()
            case ITEMS_STATS_DATA.hp:
                return getHpStat()
            case ITEMS_STATS_DATA.hpbon:
                return getHpbonStat()
            case ITEMS_STATS_DATA.improve:
                return getImproveStat()
            case ITEMS_STATS_DATA.lowcrit:
                return getLowcritStat()
            case ITEMS_STATS_DATA.lowcritallval:
                return getLowcritallvalStat()
            case ITEMS_STATS_DATA.lowevade:
                return getLowevadeStat()
            case ITEMS_STATS_DATA.lowheal2turns:
                return getLowheal2turnsStat()
            case ITEMS_STATS_DATA.mana:
                return getManaStat()
            case ITEMS_STATS_DATA.manabon:
                return getManabonStat()
            case ITEMS_STATS_DATA.manadest:
                return getManadestStat()
            case ITEMS_STATS_DATA.manafatig:
                return getManafatigStat()
            case ITEMS_STATS_DATA.npc_lootbon:
                return getNpc_lootbonStat()
            case ITEMS_STATS_DATA.pierce:
                return getPierceStat()
            case ITEMS_STATS_DATA.pierceb:
                return getPiercebStat()
            case ITEMS_STATS_DATA.quest_expbon:
                return getQuest_expbonStat()
            case ITEMS_STATS_DATA.rage:
                return getRageStat()
            case ITEMS_STATS_DATA.redstun:
                return getRedstunStat()
            case ITEMS_STATS_DATA.resacdmg:
                return getResacdmgStat()
            case ITEMS_STATS_DATA.resdmg:
                return getResdmgStat()
            case ITEMS_STATS_DATA.resmanaendest:
                return getResmanaendestStat()
            case ITEMS_STATS_DATA.respred:
                return getRespredStat()
            case ITEMS_STATS_DATA.rkeydesc:
                return getRkeydescStat()
            case ITEMS_STATS_DATA.runes:
                return getRunesStat()
            case ITEMS_STATS_DATA.sa:
                return getSaStat()
            case ITEMS_STATS_DATA.sa1:
                return getSa1Stat()
            case ITEMS_STATS_DATA.shout:
                return getShoutStat()
            case ITEMS_STATS_DATA.slow:
                return getSlowStat()
            case ITEMS_STATS_DATA.socket_component:
                return getSocket_componentStat()
            case ITEMS_STATS_DATA.stamina:
                return getStaminaStat()
            case ITEMS_STATS_DATA.timelimit_upgmax:
                return getTimelimit_upgmaxStat()
            case ITEMS_STATS_DATA.timelimit_upgs:
                return getTimelimit_upgsStat()
            case ITEMS_STATS_DATA.wound:
                return getWoundStat()
            case ITEMS_STATS_DATA.add_battleset:
                return getAdd_battlesetStat()
            case ITEMS_STATS_DATA.add_enhancement_refund:
                return getAdd_enhancement_refundStat()
            case ITEMS_STATS_DATA.add_tab_deposit:
                return getAdd_tab_depositStat()
            case ITEMS_STATS_DATA.btype:
                return getBtypeStat()
            case ITEMS_STATS_DATA.capacity:
                return getCapacityStat()
            case ITEMS_STATS_DATA.enhancement_refund:
                return getEnhancement_refundStat()
            case ITEMS_STATS_DATA.expadd:
                return getExpaddStat()
            case ITEMS_STATS_DATA.expaddlvl:
                return getExpaddlvlStat()
            case ITEMS_STATS_DATA.lvlupgcost:
                return getLvlupgcostStat()
            case ITEMS_STATS_DATA.lvlupgs:
                return getLvlupgsStat()
            case ITEMS_STATS_DATA.nosplit:
                return getNosplitStat()
            case ITEMS_STATS_DATA.reset_custom_teleport:
                return getReset_custom_teleportStat()
            case ITEMS_STATS_DATA.upglvl:
                return getUpglvlStat()
            case ITEMS_STATS_DATA.upgtimelimit:
                return getUpgtimelimitStat()
            case ITEMS_STATS_DATA.wanted_change:
                return getWanted_changeStat()
            case ITEMS_STATS_DATA.legbon:
                return getLegbonStat()
            case ITEMS_STATS_DATA.legbon_test:
                return getLegbon_testStat()
            case ITEMS_STATS_DATA.townlimit:
                return getTownlimitStat()
            case ITEMS_STATS_DATA.furniture:
                return getFurnitureStat()
            case ITEMS_STATS_DATA.nodesc:
                return getNodescStat()
            case ITEMS_STATS_DATA.loot:
                return getLootStat()
            case ITEMS_STATS_DATA.teleport:
                return getTeleportStat()
            case ITEMS_STATS_DATA.opis:
                return getOpisStat()
            case ITEMS_STATS_DATA.pumpkin_weight:
                return getPumpkin_weightStat()
            case ITEMS_STATS_DATA.upg:
                return getUpgStat()
            case ITEMS_STATS_DATA.artisanbon:
                return getArtisanbonStat()
            case ITEMS_STATS_DATA.binds:
                return getBindsStat()
            case ITEMS_STATS_DATA.artisan_worthless:
                return getArtisan_worthlessStat()
            case ITEMS_STATS_DATA.noauction:
                return getNoauctionStat()
            case ITEMS_STATS_DATA.nodepoclan:
                return getNodepoclanStat()
            case ITEMS_STATS_DATA.notakeoff:
                return getNotakeoffStat()
            case ITEMS_STATS_DATA.outexchange:
                return getOutexchangeStat()
            case ITEMS_STATS_DATA.recovered:
                return getRecoveredStat()
            case ITEMS_STATS_DATA.unbind:
                return getUnbindStat()
            case ITEMS_STATS_DATA.unbind_credits:
                return getUnbind_creditsStat()
            case ITEMS_STATS_DATA.undoupg:
                return getUndoupgStat()
            case ITEMS_STATS_DATA.maxuselvl:
                return getMaxuselvlStat()
            case ITEMS_STATS_DATA.maxstatslvl:
                return getMaxstatslvlStat()
            case ITEMS_STATS_DATA.target_min_lvl:
                return getTarget_min_lvlStat()
            case ITEMS_STATS_DATA.target_max_lvl:
                return getTarget_max_lvlStat()
            case ITEMS_STATS_DATA.lvlnext:
                return getLvlnextStat()
            case ITEMS_STATS_DATA.reqgold:
                return getReqgoldStat()
            case ITEMS_STATS_DATA.reqs:
                return getReqsStat()
            case ITEMS_STATS_DATA.reqz:
                return getReqzStat()
            case ITEMS_STATS_DATA.reqi:
                return getReqiStat()
            case ITEMS_STATS_DATA.rskl:
                return getRsklStat()
            case ITEMS_STATS_DATA.socket_content:
                return getSocket_contentStat()
            case ITEMS_STATS_DATA.socket_enhancer:
                return getSocket_enhancerStat()



            default: {
                errorReport(moduleData.fileName, "getItemStat", "Unknown stat name: " + statName);
                return null
            }
        }
    }

    this.getView = getView;
    this.getName = getName;
    this.getId = getId;
    this.getLoc = getLoc;
    this.getX = getX;
    this.getY = getY;
    this.setShouldDrawIcon = setShouldDrawIcon;
    this.getSt = getSt;
    this.getBuildsWithThisItem = getBuildsWithThisItem;
    this.getEnhancementUpgradeLvl = getEnhancementUpgradeLvl;
    //this.getItemStats 				= getItemStats;

    // this.issetStat 					= issetStat;
    // this.getStat 					= getStat;

    this.issetItemStat = issetItemStat;
    this.getItemStat = getItemStat;

    this.issetOutfitStat = issetOutfitStat;
    this.getOutfitStat = getOutfitStat;
    this.issetLvlStat = issetLvlStat;
    this.getLvlStat = getLvlStat;
    this.issetTimelimitStat = issetTimelimitStat;
    this.getTimelimitStat = getTimelimitStat;
    this.issetAmountStat = issetAmountStat;
    this.getAmountStat = getAmountStat;
    this.issetReqpStat = issetReqpStat;
    this.getReqpStat = getReqpStat;
    this.issetPetStat = issetPetStat;
    this.getPetStat = getPetStat;
    this.issetExpiresStat = issetExpiresStat;
    this.getExpiresStat = getExpiresStat;
    this.getCustom_teleportStat = getCustom_teleportStat;
    this.issetCustom_teleportStat = issetCustom_teleportStat;

    this.issetSoulboundStat = issetSoulboundStat;
    this.issetPermboundStat = issetPermboundStat;

    // this.issetPlayStat 				= issetPlayStat;
    // this.getPlayStat 				= getPlayStat;
    this.issetReviveStat = issetReviveStat;
    this.issetTtlStat = issetTtlStat;
    this.getTtlStat = getTtlStat;
    this.issetRarityStat = issetRarityStat;
    this.getRarityStat = getRarityStat;

    this.getActionStat = getActionStat
    this.issetActionStat = issetActionStat

    this.getSummonpartyStat = getSummonpartyStat
    this.issetSummonpartyStat = issetSummonpartyStat
    this.issetBagStat = issetBagStat
    this.issetBonus_reselectStat = issetBonus_reselectStat
    this.issetBonusStat = issetBonusStat
    this.getBonusStat = getBonusStat
    this.issetEnhancement_addStat = issetEnhancement_addStat
    this.issetEnhancement_add_pointStat = issetEnhancement_add_pointStat
    // this.issetEmoStat                       = issetEmoStat
    // this.getEmoStat                       = getEmoStat
    this.getAnimationStat = getAnimationStat
    this.issetLeczyStat = issetLeczyStat
    this.getLeczyStat = getLeczyStat
    this.issetFullhealStat = issetFullhealStat
    this.getFullhealStat = getFullhealStat
    this.issetPerhealStat = issetPerhealStat
    this.getPerhealStat = getPerhealStat
    // this.issetLootboxStat                       = issetLootboxStat
    // this.getLootboxStat                       = getLootboxStat
    // this.issetLootbox2Stat                       = issetLootbox2Stat
    // this.getLootbox2Stat                       = getLootbox2Stat
    this.issetBonus_not_selectedStat = issetBonus_not_selectedStat
    this.issetCansplitStat = issetCansplitStat
    this.issetCansplitStat = issetCansplitStat
    this.getCansplitStat = getCansplitStat
    this.issetOutfit_selectorStat = issetOutfit_selectorStat
    this.getOutfit_selectorStat = getOutfit_selectorStat
    this.issetEnhancement_upgrade_lvlStat = issetEnhancement_upgrade_lvlStat
    this.issetPersonalStat = issetPersonalStat
    this.issetLowreqStat = issetLowreqStat
    this.getLowreqStat = getLowreqStat
    this.issetCursedStat = issetCursedStat

    this.issetAcStat = issetAcStat
    this.getAcStat = getAcStat
    this.issetDmgStat = issetDmgStat
    this.getDmgStat = getDmgStat
    this.issetActStat = issetActStat
    this.getActStat = getActStat
    this.issetExpire_durationStat = issetExpire_durationStat
    this.getExpire_durationStat = getExpire_durationStat
    this.issetIntStat = issetIntStat
    this.getIntStat = getIntStat
    this.issetNpc_expbonStat = issetNpc_expbonStat
    this.getNpc_expbonStat = getNpc_expbonStat
    this.issetPdmgStat = issetPdmgStat
    this.getPdmgStat = getPdmgStat
    this.issetPerdmgStat = issetPerdmgStat
    this.getPerdmgStat = getPerdmgStat
    this.issetResfireStat = issetResfireStat
    this.getResfireStat = getResfireStat
    this.issetResfrostStat = issetResfrostStat
    this.getResfrostStat = getResfrostStat
    this.issetReslightStat = issetReslightStat
    this.getReslightStat = getReslightStat
    this.issetSilaStat = issetSilaStat
    this.getSilaStat = getSilaStat
    this.issetZrStat = issetZrStat
    this.getZrStat = getZrStat
    this.issetActdmgStat = issetActdmgStat
    this.getActdmgStat = getActdmgStat
    this.issetAgiStat = issetAgiStat
    this.getAgiStat = getAgiStat
    this.issetFireStat = issetFireStat
    this.getFireStat = getFireStat
    this.issetFirebonStat = issetFirebonStat
    this.getFirebonStat = getFirebonStat
    this.issetFrostStat = issetFrostStat
    this.getFrostStat = getFrostStat
    this.issetFrostbonStat = issetFrostbonStat
    this.getFrostbonStat = getFrostbonStat
    this.issetFrostpunchStat = issetFrostpunchStat
    this.getFrostpunchStat = getFrostpunchStat
    this.issetHpsaStat = issetHpsaStat
    this.getHpsaStat = getHpsaStat
    this.issetLightStat = issetLightStat
    this.getLightStat = getLightStat
    this.issetLightbonStat = issetLightbonStat
    this.getLightbonStat = getLightbonStat
    this.issetLightmindmgStat = issetLightmindmgStat
    this.getLightmindmgStat = getLightmindmgStat
    this.issetMresdmgStat = issetMresdmgStat
    this.getMresdmgStat = getMresdmgStat
    this.issetPet2Stat = issetPet2Stat
    this.getPet2Stat = getPet2Stat
    this.issetPoisonStat = issetPoisonStat
    this.getPoisonStat = getPoisonStat
    this.issetStrStat = issetStrStat
    this.getStrStat = getStrStat
    this.issetAbdestStat = issetAbdestStat
    this.getAbdestStat = getAbdestStat
    this.issetAbsorbStat = issetAbsorbStat
    this.getAbsorbStat = getAbsorbStat
    this.issetAbsorbmStat = issetAbsorbmStat
    this.getAbsorbmStat = getAbsorbmStat
    this.issetAcdmgStat = issetAcdmgStat
    this.getAcdmgStat = getAcdmgStat
    this.issetAdestStat = issetAdestStat
    this.getAdestStat = getAdestStat
    this.issetAfterhealStat = issetAfterhealStat
    this.getAfterhealStat = getAfterhealStat
    this.issetAfterheal2Stat = issetAfterheal2Stat
    this.getAfterheal2Stat = getAfterheal2Stat
    this.issetBattlestatsStat = issetBattlestatsStat
    this.getBattlestatsStat = getBattlestatsStat
    this.issetBlokStat = issetBlokStat
    this.getBlokStat = getBlokStat
    this.issetContraStat = issetContraStat
    this.getContraStat = getContraStat
    this.issetCreditsbonStat = issetCreditsbonStat
    this.getCreditsbonStat = getCreditsbonStat
    this.issetCritStat = issetCritStat
    this.getCritStat = getCritStat
    this.issetCritmvalStat = issetCritmvalStat
    this.getCritmvalStat = getCritmvalStat
    this.issetCritvalStat = issetCritvalStat
    this.getCritvalStat = getCritvalStat
    this.issetDaStat = issetDaStat
    this.getDaStat = getDaStat
    this.issetDiStat = issetDiStat
    this.getDiStat = getDiStat
    this.issetDisturbStat = issetDisturbStat
    this.getDisturbStat = getDisturbStat
    this.issetDsStat = issetDsStat
    this.getDsStat = getDsStat
    this.issetDzStat = issetDzStat
    this.getDzStat = getDzStat
    this.issetEnergybonStat = issetEnergybonStat
    this.getEnergybonStat = getEnergybonStat
    this.issetEndestStat = issetEndestStat
    this.getEndestStat = getEndestStat
    this.issetEnfatigStat = issetEnfatigStat
    this.getEnfatigStat = getEnfatigStat
    this.issetEvadeStat = issetEvadeStat
    this.getEvadeStat = getEvadeStat
    this.issetExpire_dateStat = issetExpire_dateStat
    this.getExpire_dateStat = getExpire_dateStat
    this.issetForce_bindingStat = issetForce_bindingStat
    this.getForce_bindingStat = getForce_bindingStat
    this.issetFreeskillsStat = issetFreeskillsStat
    this.getFreeskillsStat = getFreeskillsStat
    this.issetGoldStat = issetGoldStat
    this.getGoldStat = getGoldStat
    this.issetGoldpackStat = issetGoldpackStat
    this.getGoldpackStat = getGoldpackStat
    this.issetHealStat = issetHealStat
    this.getHealStat = getHealStat
    this.issetHonorbonStat = issetHonorbonStat
    this.getHonorbonStat = getHonorbonStat
    this.issetHpStat = issetHpStat
    this.getHpStat = getHpStat
    this.issetHpbonStat = issetHpbonStat
    this.getHpbonStat = getHpbonStat
    this.issetImproveStat = issetImproveStat
    this.getImproveStat = getImproveStat
    this.issetLowcritStat = issetLowcritStat
    this.getLowcritStat = getLowcritStat
    this.issetLowcritallvalStat = issetLowcritallvalStat
    this.getLowcritallvalStat = getLowcritallvalStat
    this.issetLowevadeStat = issetLowevadeStat
    this.getLowevadeStat = getLowevadeStat
    this.issetLowheal2turnsStat = issetLowheal2turnsStat
    this.getLowheal2turnsStat = getLowheal2turnsStat
    this.issetManaStat = issetManaStat
    this.getManaStat = getManaStat
    this.issetManabonStat = issetManabonStat
    this.getManabonStat = getManabonStat
    this.issetManadestStat = issetManadestStat
    this.getManadestStat = getManadestStat
    this.issetManafatigStat = issetManafatigStat
    this.getManafatigStat = getManafatigStat
    this.issetNpc_lootbonStat = issetNpc_lootbonStat
    this.getNpc_lootbonStat = getNpc_lootbonStat
    this.issetPierceStat = issetPierceStat
    this.getPierceStat = getPierceStat
    this.issetPiercebStat = issetPiercebStat
    this.getPiercebStat = getPiercebStat
    this.issetQuest_expbonStat = issetQuest_expbonStat
    this.getQuest_expbonStat = getQuest_expbonStat
    this.issetRageStat = issetRageStat
    this.getRageStat = getRageStat
    this.issetRedstunStat = issetRedstunStat
    this.getRedstunStat = getRedstunStat
    this.issetResacdmgStat = issetResacdmgStat
    this.getResacdmgStat = getResacdmgStat
    this.issetResdmgStat = issetResdmgStat
    this.getResdmgStat = getResdmgStat
    this.issetResmanaendestStat = issetResmanaendestStat
    this.getResmanaendestStat = getResmanaendestStat
    this.issetRespredStat = issetRespredStat
    this.getRespredStat = getRespredStat
    this.issetRkeydescStat = issetRkeydescStat
    this.getRkeydescStat = getRkeydescStat
    this.issetRunesStat = issetRunesStat
    this.getRunesStat = getRunesStat
    this.issetSaStat = issetSaStat
    this.getSaStat = getSaStat
    this.issetSa1Stat = issetSa1Stat
    this.getSa1Stat = getSa1Stat
    this.issetShoutStat = issetShoutStat
    this.getShoutStat = getShoutStat
    this.issetSlowStat = issetSlowStat
    this.getSlowStat = getSlowStat
    this.issetSocket_componentStat = issetSocket_componentStat
    this.getSocket_componentStat = getSocket_componentStat
    this.issetStaminaStat = issetStaminaStat
    this.getStaminaStat = getStaminaStat
    this.issetTimelimit_upgmaxStat = issetTimelimit_upgmaxStat
    this.getTimelimit_upgmaxStat = getTimelimit_upgmaxStat
    this.issetTimelimit_upgsStat = issetTimelimit_upgsStat
    this.getTimelimit_upgsStat = getTimelimit_upgsStat
    this.issetWoundStat = issetWoundStat
    this.getWoundStat = getWoundStat
    this.issetAdd_battlesetStat = issetAdd_battlesetStat
    this.getAdd_battlesetStat = getAdd_battlesetStat
    this.issetAdd_enhancement_refundStat = issetAdd_enhancement_refundStat
    this.getAdd_enhancement_refundStat = getAdd_enhancement_refundStat
    this.issetAdd_tab_depositStat = issetAdd_tab_depositStat
    this.getAdd_tab_depositStat = getAdd_tab_depositStat
    this.issetBtypeStat = issetBtypeStat
    this.getBtypeStat = getBtypeStat
    this.issetCapacityStat = issetCapacityStat
    this.getCapacityStat = getCapacityStat
    this.issetEnhancement_refundStat = issetEnhancement_refundStat
    this.getEnhancement_refundStat = getEnhancement_refundStat
    this.issetExpaddStat = issetExpaddStat
    this.getExpaddStat = getExpaddStat
    this.issetExpaddlvlStat = issetExpaddlvlStat
    this.getExpaddlvlStat = getExpaddlvlStat
    this.issetLvlupgcostStat = issetLvlupgcostStat
    this.getLvlupgcostStat = getLvlupgcostStat
    this.issetLvlupgsStat = issetLvlupgsStat
    this.getLvlupgsStat = getLvlupgsStat
    this.issetNosplitStat = issetNosplitStat
    this.getNosplitStat = getNosplitStat
    this.issetReset_custom_teleportStat = issetReset_custom_teleportStat
    this.getReset_custom_teleportStat = getReset_custom_teleportStat
    this.issetUpglvlStat = issetUpglvlStat
    this.getUpglvlStat = getUpglvlStat
    this.issetUpgtimelimitStat = issetUpgtimelimitStat
    this.getUpgtimelimitStat = getUpgtimelimitStat
    this.issetWanted_changeStat = issetWanted_changeStat
    this.getWanted_changeStat = getWanted_changeStat
    this.issetLegbonStat = issetLegbonStat
    this.getLegbonStat = getLegbonStat
    this.issetLegbon_testStat = issetLegbon_testStat
    this.getLegbon_testStat = getLegbon_testStat
    this.issetTownlimitStat = issetTownlimitStat
    this.getTownlimitStat = getTownlimitStat
    this.issetFurnitureStat = issetFurnitureStat
    this.getFurnitureStat = getFurnitureStat
    this.issetNodescStat = issetNodescStat
    this.getNodescStat = getNodescStat
    this.issetLootStat = issetLootStat
    this.getLootStat = getLootStat
    this.issetTeleportStat = issetTeleportStat
    this.getTeleportStat = getTeleportStat
    this.issetOpisStat = issetOpisStat
    this.getOpisStat = getOpisStat
    this.issetPumpkin_weightStat = issetPumpkin_weightStat
    this.getPumpkin_weightStat = getPumpkin_weightStat
    this.issetUpgStat = issetUpgStat
    this.getUpgStat = getUpgStat
    this.issetArtisanbonStat = issetArtisanbonStat
    this.getArtisanbonStat = getArtisanbonStat
    this.issetBindsStat = issetBindsStat
    this.getBindsStat = getBindsStat
    this.issetArtisan_worthlessStat = issetArtisan_worthlessStat
    this.getArtisan_worthlessStat = getArtisan_worthlessStat
    this.issetNoauctionStat = issetNoauctionStat
    this.getNoauctionStat = getNoauctionStat
    this.issetNodepoclanStat = issetNodepoclanStat
    this.getNodepoclanStat = getNodepoclanStat
    this.issetNotakeoffStat = issetNotakeoffStat
    this.getNotakeoffStat = getNotakeoffStat
    this.issetOutexchangeStat = issetOutexchangeStat
    this.getOutexchangeStat = getOutexchangeStat
    this.issetRecoveredStat = issetRecoveredStat
    this.getRecoveredStat = getRecoveredStat
    this.issetUnbindStat = issetUnbindStat
    this.getUnbindStat = getUnbindStat
    this.issetUnbind_creditsStat = issetUnbind_creditsStat
    this.getUnbind_creditsStat = getUnbind_creditsStat
    this.issetUndoupgStat = issetUndoupgStat
    this.getUndoupgStat = getUndoupgStat
    this.issetMaxuselvlStat = issetMaxuselvlStat
    this.getMaxuselvlStat = getMaxuselvlStat
    this.issetMaxstatslvlStat = issetMaxstatslvlStat
    this.getMaxstatslvlStat = getMaxstatslvlStat
    this.issetTarget_min_lvlStat = issetTarget_min_lvlStat
    this.getTarget_min_lvlStat = getTarget_min_lvlStat
    this.issetTarget_max_lvlStat = issetTarget_max_lvlStat
    this.getTarget_max_lvlStat = getTarget_max_lvlStat
    this.issetLvlnextStat = issetLvlnextStat
    this.getLvlnextStat = getLvlnextStat
    this.issetReqgoldStat = issetReqgoldStat
    this.getReqgoldStat = getReqgoldStat
    this.issetReqsStat = issetReqsStat
    this.getReqsStat = getReqsStat
    this.issetReqzStat = issetReqzStat
    this.getReqzStat = getReqzStat
    this.issetReqiStat = issetReqiStat
    this.getReqiStat = getReqiStat
    this.issetRsklStat = issetRsklStat
    this.getRsklStat = getRsklStat
    this.issetSocket_contentStat = issetSocket_contentStat
    this.getSocket_contentStat = getSocket_contentStat
    this.issetSocket_enhancerStat = issetSocket_enhancerStat
    this.getSocket_enhancerStat = getSocket_enhancerStat






    this.issetBookStat = issetBookStat
    this.getBookStat = getBookStat
    this.issetPriceStat = issetPriceStat
    this.getPriceStat = getPriceStat
    this.issetRespStat = issetRespStat
    this.getRespStat = getRespStat
    this.issetKeyStat = issetKeyStat
    this.getKeyStat = getKeyStat
    this.issetMkeyStat = issetMkeyStat
    this.getMkeyStat = getMkeyStat
    this.issetRkeyStat = issetRkeyStat
    this.getRkeyStat = getRkeyStat
    this.issetRlvlStat = issetRlvlStat
    this.getRlvlStat = getRlvlStat
    this.issetMotelStat = issetMotelStat
    this.getMotelStat = getMotelStat
    this.issetEmoStat = issetEmoStat
    this.getEmoStat = getEmoStat
    this.issetQuestStat = issetQuestStat
    this.getQuestStat = getQuestStat
    this.issetPlayStat = issetPlayStat
    this.getPlayStat = getPlayStat
    this.issetSzablonStat = issetSzablonStat
    this.getSzablonStat = getSzablonStat
    this.issetNullStat = issetNullStat
    this.getNullStat = getNullStat
    this.issetProgressStat = issetProgressStat
    this.getProgressStat = getProgressStat
    this.issetLootboxStat = issetLootboxStat
    this.getLootboxStat = getLootboxStat
    this.issetLootbox2Stat = issetLootbox2Stat
    this.getLootbox2Stat = getLootbox2Stat






    this.issetof_strStat = issetof_strStat
    this.getof_strStat = getof_strStat

};