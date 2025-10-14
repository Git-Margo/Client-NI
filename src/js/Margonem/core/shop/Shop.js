/**
 * Created by lukasz on 2015-02-25.
 */
var Tpl = require('@core/Templates');
var DraconiteShop = require('@core/shop/DraconiteShop');
var ServerStorageData = require('@core/storage/ServerStorageData.js');
var Basket = require('@core/shop/Basket');
let ItemClass = require('@core/items/ItemClass');
let ItemState = require('@core/items/ItemState');
var TutorialData = require('@core/tutorial/TutorialData');

var GreatMerchamp = require('@core/GreatMerchamp');
const {
    shopActions
} = require('./ShopData');

module.exports = function() {
    var self = this;
    var data = null;
    this.ctx = null;
    this.purchase = null;
    this.shopType = 0; // 0 - normal shop, 1 - outfit shop with preview / pet shop
    this.premiumShop = false;
    this.goods;
    var superMarketItems = {};
    let shopItemsName = null;
    var shopItems = {};
    var counter = 0;
    var lastCl = null;

    let typeIsSet = false;

    var allDragDistance = 0;
    var oldX = 0;
    var oldY = 0;

    var c_slots = {
        0: null,
        2: null,
        4: null
    };

    const tpls = [];

    var eqDragOpts = {
        appendTo: 'body',
        helper: 'clone',
        //delay: 100,
        distance: 10,
        cursorAt: {
            top: 16,
            left: 16
        },
        //containment: $('body'),
        scroll: false,
        zIndex: 20,
        start: function(e, ui) {
            allDragDistance = 0;
            startTs = self.getTs();
            changeViewOfHelper(ui.helper, $(this).data().item.id, 'n');
            self.saveOldXAndY(e.offsetX, e.offsetY);
            $(this).fadeTo(200, 0.5);
            var $e = ui.helper;
            $e.css('background', 'none');
            $e.find('.highlight').css('background', 'none');
        },
        stop: function(e, ui) {
            $(this).fadeTo(200, 1);
            startTs = null;
        },
        drag: function(e) {
            allDragDistance += Math.abs(oldX - e.offsetX) + Math.abs(oldY - e.offsetY);
            self.saveOldXAndY(e.offsetX, e.offsetY);
        }
    };

    const addToShopItemsName = (i, highlight) => {
        shopItemsName[i.name] = {
            item: i,
            highlight: highlight
        }
    };

    const getShopItemsNameHighlight = (name) => {
        let a = [];

        for (let _name in shopItemsName) {
            if (_name != name) continue;
            let oneShopItemName = shopItemsName[_name];
            a.push(oneShopItemName.highlight)
        }
        return a;
    };

    const clearShopItemsName = () => {
        shopItemsName = {};
    };

    const removeClassInHighlighst = (classToRemove) => {
        for (let name in shopItemsName) {
            let $highlight = shopItemsName[name].highlight;

            if ($highlight.hasClass(classToRemove)) {
                $highlight.removeClass(classToRemove)
            }
        }
    };

    this.getTs = function() {
        return (new Date()).getTime();
    };

    this.getData = function() {
        return data;
    };

    this.slotPos = {
        0: [8, 77],
        2: [67, 77],
        4: [119, 77]
    };

    this.saveOldXAndY = function(x, y) {
        oldX = x;
        oldY = y;
    };

    this.initGoods = () => {
        this.goods = {
            'usual': {
                state: true,
                gr: 1
            },
            'unique': {
                state: false,
                gr: 1
            },
            'heroic': {
                state: false,
                gr: 1
            },
            'upgraded': {
                state: false,
                gr: 1
            },
            'legendary': {
                state: false,
                gr: 1
            },

            'nosoulbound': {
                state: true,
                gr: 2
            },
            'soulbound': {
                state: true,
                gr: 2
            },
            'permbound': {
                state: true,
                gr: 2
            },

            'neutral': {
                state: true,
                gr: 3
            },
            'usable': {
                state: false,
                gr: 3
            },
            'rkey': {
                state: false,
                gr: 3
            },
            'talisman': {
                state: false,
                gr: 3
            },
            'books': {
                state: false,
                gr: 3
            },
            'bag': {
                state: false,
                gr: 3
            },
            'quest': {
                state: true,
                gr: 3
            },
            'teleports': {
                state: false,
                gr: 3
            }
        };
    };

    this.init = function(d, fastShow) {
        this.closeOtherWindows();
        data = d;
        var type = data.cur == 'sl' ? 'sl' : 'zl';
        if (type == 'sl') self.premiumShop = true;
        self.initWindow();
        clearShopItemsName();
        self.initGoods();
        self.createCloseAndAcceptBtns();
        self.createShowItemsFilterCheckboxs();
        this.basket = new Basket(data);
        Engine.tpls.fetch(Engine.itemsFetchData.NEW_SHOP_TPL, self.newShopItems);
        self.prepareDescription(d);
        self.initGreatMerchamp();
        //self.wnd.$.find('.shop-content').removeClass('normal-shop-zl normal-shop-sl pet-shop-zl pet-shop-sl');
        //self.wnd.$.find('.shop-background').removeClass('normal-shop-zl normal-shop-sl pet-shop-zl pet-shop-sl');
        //self.wnd.$.find('.shop-content').addClass('normal-shop-' + type);
        //self.wnd.$.find('.shop-background').addClass('normal-shop-' + type);


        removeClassFromShopWrapper();
        addClassToShopWrappers('normal-shop-' + type);

        self.createBottomPanel();
        Engine.lock.add('shop');
        self.wnd.$.find('.SHOP_CANVAS').attr('width', '165px');
        self.wnd.$.find('.SHOP_CANVAS').attr('height', '115px');
        self.initClickCanvas();
        self.initDroppable();
        initScroll();
        Engine.disableItemsManager.startSpecificItemKindDisable(Engine.itemsDisableData.SHOP);
        Engine.interfaceItems.setDisableSlots('shop');
    };

    this.getC_slots = function() {
        return c_slots;
    };

    const addClassToShopWrappers = (classToAdd) => {
        self.wnd.$.find('.shop-content').addClass(classToAdd);
        self.wnd.$.find('.shop-background').addClass(classToAdd);
    };

    const removeClassFromShopWrapper = () => {
        self.wnd.$.find('.shop-content').removeClass('normal-shop-zl normal-shop-sl pet-shop-zl pet-shop-sl for-you-shop');
        self.wnd.$.find('.shop-background').removeClass('normal-shop-zl normal-shop-sl pet-shop-zl pet-shop-sl for-you-shop');
    };

    this.createBottomPanel = function() {
        var $buyBut = Tpl.get('button').addClass('small purple');
        var type = data.cur == 'sl' ? 'sl' : 'zl';
        $buyBut.find('.label').text(_t('buy_' + type + '_btn', null, 'shop'));
        $buyBut.click(function(e) {
            e.stopPropagation();
            if (data.cur == "sl") {
                if (Engine.draconiteShop) return;
                Engine.draconiteShop = new DraconiteShop();
                Engine.draconiteShop.open();
            } else if (!Engine.goldShop) _g('creditshop&credits_gold=-1');
        });

        var $recoverBut = Tpl.get('button').addClass('small purple');
        $recoverBut.find('.label').text(_t('recover_items', null, 'shop'));
        $recoverBut.click(function() {
            if (!Engine.recoveryItems) _g('recovery');
        });

        self.wnd.$.find('.buy-currency').append($buyBut);
        self.wnd.$.find('.recover-items').append($recoverBut);

        var str = _t('buy_' + type + '_label', null, 'shop');
        self.wnd.$.find('.currency-label').html(str);

        let slClass = "interface-element-chest-sl";
        let goldClass = "interface-element-chest-gold"
        let $chest = self.wnd.$.find('.chest');

        $chest.removeClass([goldClass, slClass]);
        $chest.addClass(type == 'sl' ? slClass : goldClass);
    };

    this.createShowItemsFilterCheckboxs = function() {
        if (!data.canFilter) {
            self.wnd.$.find('.filters-heading').css('display', 'none');
            self.wnd.$.find('.show-items-filter').css('display', 'none');
            return;
        }

        var str;
        if (Engine.shopFilters) {
            str = Engine.shopFilters;
            Engine.shopFilters = null;
        }
        if (str) {
            self.setStateCheckboxFormStr(str, 0, '.can-afford');
            self.setStateCheckboxFormStr(str, 1, '.own-level');
            self.setStateCheckboxFormStr(str, 2, '.own-profession');
        }
        self.wnd.$.find('.checkbox').click(function() {
            var active = $(this).hasClass('active');
            if (active) $(this).removeClass('active');
            else $(this).addClass('active');
            self.sendOptions();
        });
    };

    this.setStateCheckboxFormStr = function(str, bitPos, selector) {
        if (str[bitPos] == '1') self.wnd.$.find(selector).addClass('active')
    };

    this.getStateCheckbox = function(name) {
        return self.wnd.$.find(name).hasClass('active') ? '1' : '0';
    };

    this.sendOptions = function() {
        var str = '';
        str += self.getStateCheckbox('.can-afford');
        str += self.getStateCheckbox('.own-level');
        str += self.getStateCheckbox('.own-profession');
        Engine.shopFilters = str;
        _g((data.canAccess > 0 ? 'creditshop' : 'shop') + '&npc=' + data.id + '&filters=' + parseInt(str, 2));
    };

    this.getPurchase = () => {
        return self.purchase;
    };

    this.getPremiumShop = () => {
        return self.premiumShop;
    };

    this.isOnlyBuyShop = () => {
        return self.purchase == '';
    };

    this.prepareDescription = function(data) {
        self.purchase = data.purchase;
        var desc = '';
        let $iconsHolder = null;
        if (data.cur == 'ph') desc = _t('sell_for_ph') + '<br>'; //'SprzedaÅ¼ za: <b>Punkty Honoru</b>.<br />'
        else if (data.cur == 'sl') {
            desc = _t('sell_for_sl') + '<br>'; //'SprzedaÅ¼ za: <b>Smocze Åzy</b>.<br />'
            $('#sl_shop_banner').css('display', 'block');
        } else if (data.cur == 'zl') {
            self.wnd.$.find('.great-merchamp').css('display', 'block');
            self.wnd.$.find('.quick-sell-heading, .bag-heading').css('display', 'block');
            $('#gold_shop_banner').css('display', 'block');
            desc = '<b>' + _t('sell_prices') + '</b>: '; //Ceny sprzedaÅ¼y
            if (data.sellp < 150) desc += _t('sell_price_cheap'); //'tanio'
            else if (data.sellp > 299) desc += _t('sell_price_vExpensive'); //'bardzo drogo'
            else if (data.sellp > 199) desc += _t('sell_price_expensive'); //'drogo'
            else desc += _t('sell_price_normal') //'normalnie'
            if (data.purchase != '') desc += ' | <b>' + _t('rebuy_price') + '</b> ' + data.buyp + '%<br><b>' + _t('max_per_item') + '</b> ' + formNumberToNumbersGroup(data.maxbuyp) + '<br />';
            else desc += '<br>'
            //'Cena skupu:
            //Maks. za przedmiot:
        } else {
            var temp = data.cur.split('|');
            var $currencyRow = Tpl.get('si-currency');
            $currencyRow.find('.si-currency__label b').text(_t('selling_for_info'));
            $currencyRow.find('.si-currency__icon').css('background-image', `url(${CFG.a_ipath + temp[1]})`);
            $currencyRow.find('.si-currency__desc').text(temp[0]);
            desc = $currencyRow.prop('outerHTML'); //SprzedaÅ¼ za:
            // desc = '<div style="height:32px"><div style="float:left;padding-top:9px;"><b>' + _t('selling_for_info') + '</b></div><div style="margin:0px 5px;background-image:url(' + CFG.ipath + temp[1] + ');height:32px;width:32px;float:left" /><div style="padding-top:9px;float:left;">' + temp[0] + '.</div></div>'; //SprzedaÅ¼ za:
        }
        desc += '<b>' + _t('shopper_buys') + '</b> ' //Skupuje:
        if (data.purchase == '*') desc += _t('buys_all'); //'wszystko'
        else if (data.purchase == '') desc += _t('buys_nothing'); //'nic'
        else {
            var p = data.purchase.split(',');
            for (var k in p) {
                p[k] = MargoTipsParser.getEq().classes[parseInt(p[k])];
            }
            desc += p.join(', ');
        }
        $('.shop-info-wrapper', self.wnd.$).html(desc);
    };

    this.initClickCanvas = function() {
        self.wnd.$.find('.SHOP_CANVAS').on('click', function(e) {
            var o = self.getCollisionAtEvent(e);
            if (o && o.onClick) {
                o.onClick(e);
            }
        });
    };


    this.initWindow = function() {

        Engine.windowManager.add({
            content: Tpl.get('shop-wrapper'),
            nameWindow: Engine.windowsData.name.SHOP_WRAPPER,
            nameRefInParent: 'wnd',
            objParent: this,
            title: _t('shop_head', null, 'shop'),
            onclose: () => {
                self.hide();
            }
        });
        this.wnd.addToAlertLayer();
        this.wnd.center();
    };

    this.createCloseAndAcceptBtns = function() {
        var fin_button = Tpl.get('button').addClass('green small');
        fin_button.find('.label').text(_t('shop_accept', null, 'shop'));
        fin_button.click(function() {
            self.basket.preFinalize();
        });
        $('.finalize-button', self.wnd.$).append(fin_button);

    };

    this.setLabel = function() {
        var str = _t(self.shopType == 0 ? 'selling_items' : 'preview', null, 'shop');
        self.wnd.$.find('.sell-items>.label').html(str);
    };

    this.initGreatMerchamp = function() {
        var $wrapper = self.wnd.$.find('.great-merchamp');
        var $m = Tpl.get('button').addClass('green small btn-num');
        var icon = $('<div class="add-bck config" />');
        $m.append(icon);
        $m.tip(_t('config_tip', null, 'buttons'));
        $m.click(function(e) {
            e.stopPropagation()
            if (!Engine.greatMerchamp) {
                Engine.greatMerchamp = new GreatMerchamp();
                Engine.greatMerchamp.init();
            } else Engine.greatMerchamp.close();
        });
        for (var i = 0; i < 3; i++) {
            var $btn = Tpl.get('button').addClass('green small btn-num');
            $btn.find('.label').html(i + 1);
            $wrapper.append($btn);
            $btn.tip(_t('great_merchamp_info %val%', {
                '%val%': i + 1
            }, 'shop'));
            $btn.click(function() {
                var nr = $(this).index();
                Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 29);
                //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 29);
                Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 30);
                //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 30);
                self.greatMerchant(nr); // - 1 because first is filter
            });
        }
        $wrapper.append($m);
    };

    this.greatMerchant = function(bagIndex) {
        var noSell = self.prepareNoSell();
        var min = bagIndex * 6;
        var max = min + 6;
        var hItems = Engine.heroEquipment.getHItems();
        for (var k in hItems) {
            var i = hItems[k];
            if (ItemClass.isGoldCl(i.cl) || ItemClass.isQuestCl(i.cl) || ItemClass.isBlessCl(i.cl) || ItemClass.isUpgradeCl(i.cl) || ItemClass.isRecipeCl(i.cl)) continue;
            if (self.checkGoodBag(i, min, max)) continue;
            let stats = i.parseStats();

            if (self.checkUsual(i, noSell)) continue;
            if (self.checkUsable(i, noSell)) continue;
            if (self.checkCoinage(i, noSell)) continue;
            if (self.checkTalisman(i, noSell)) continue;
            if (self.checkBooks(i, noSell)) continue;
            if (self.checkNeutral(i, noSell)) continue;
            if (self.checkTeleports(i, noSell)) continue;

            if (self.checkNosoulbound(i, noSell, stats)) continue;
            if (self.checkSoulbound(i, noSell)) continue;
            if (self.checkPermbound(i, noSell)) continue;

            this.findVal(i, noSell, stats);
        }
    };

    this.prepareNoSell = function() {
        var noSell = [];
        let data = Engine.serverStorage.get(ServerStorageData.GREAT_MERCHAMP);
        if (!data) {

            for (let k in this.goods) {
                if (!this.goods[k].state) noSell.push(k);
            }

        } else {

            for (let k in this.goods) {
                if (isset(data[k])) {
                    if (!data[k]) noSell.push(k);
                } else noSell.push(k);
            }
        }

        return noSell;
    };

    this.checkGoodBag = function(i, min, max) {
        if (!ItemState.isInBagSt(i.st)) return true;
        if (!(i.y >= min && i.y < max)) return true;
        return false;
    };

    this.checkMixture = function(i, noSell) {
        var bool1 = noSell.indexOf('mixture') > -1;
        var n = i.name.toLowerCase();
        // if (_l() == 'pl') {
        if (isPl()) {
            var bool2 = n.indexOf('mikstura') > -1;
            var bool3 = n.indexOf('preparat') > -1;
            var bool4 = n.indexOf('eliksir') > -1;
            var bool5 = n.indexOf('panaceum') > -1;
            var bool6 = n.indexOf('remedium') > -1;
            var bool7 = n.indexOf('preparat') > -1;
            var bool8 = n.indexOf('bukÅak') > -1;
            var bool9 = n.indexOf('butelka') > -1;
            return bool1 && (bool2 || bool3 || bool4 || bool5 || bool6 || bool7 || bool8 || bool9);
        } else {
            var bool2 = n.indexOf('potion') > -1;
            var bool3 = n.indexOf('mixture') > -1;
            var bool4 = n.indexOf('elixir') > -1;
            var bool5 = n.indexOf('syrup') > -1;
            var bool6 = n.indexOf('panacea') > -1;
            var bool7 = n.indexOf('remedy') > -1;
            var bool8 = n.indexOf('cure-all') > -1;
            var bool9 = n.indexOf('drink') > -1;
            var bool10 = n.indexOf('bottle') > -1;
            return bool1 && (bool2 || bool3 || bool4 || bool5 || bool6 || bool7 || bool8 || bool9 || bool10);
        }
    };

    this.checkUsual = function(i, noSell) {
        let bool0 = noSell.indexOf('usual') > -1;
        let bool1 = i.itemTypeName === 'unique'; //isset(stats['unique']);
        let bool2 = i.itemTypeName === 'heroic'; //isset(stats['heroic']);
        let bool3 = i.itemTypeName === 'upgraded'; //isset(stats['upgraded']);
        let bool4 = i.itemTypeName === 'legendary'; //isset(stats['legendary']);
        let bool5 = i.itemTypeName === 'artefact'; //isset(stats['artefact']);
        return bool0 && !bool1 && !bool2 && !bool3 && !bool4 && !bool5;
    };


    this.checkUsable = function(i, noSell) { //konsup
        var bool1 = i.cl == 16;
        var bool2 = noSell.indexOf('usable') > -1;
        return bool1 && bool2;
    };

    this.checkCoinage = function(i, noSell) { // block currency
        return i.cl == 28;
    };

    this.checkTalisman = function(i, noSell) {
        var bool1 = i.cl == 22;
        var bool2 = noSell.indexOf('talisman') > -1;
        return bool1 && bool2;
    };

    this.checkBooks = function(i, noSell) {
        var bool1 = i.cl == 23;
        var bool2 = noSell.indexOf('books') > -1;
        return bool1 && bool2;
    };

    this.checkTeleports = function(i, noSell) {
        var bool1 = i.cl == 32;
        var bool2 = noSell.indexOf('teleports') > -1;
        return bool1 && bool2;
    };

    this.checkNeutral = function(i, noSell) {
        var bool1 = i.cl == 15;
        var bool2 = noSell.indexOf('neutral') > -1;
        return bool1 && bool2;
    };

    this.checkNosoulbound = function(i, noSell, stats) {
        var bool1 = isset(stats['soulbound']) || isset(stats['permbound']);
        var bool2 = noSell.indexOf('nosoulbound') > -1;
        return !bool1 && bool2;
    };

    this.checkSoulbound = function(i, noSell) {
        //var bool1 = isset(stats['soulbound']);
        var bool1 = i.issetSoulboundStat();
        var bool2 = noSell.indexOf(Engine.itemStatsData.soulbound) > -1;
        return bool1 && bool2;
    };

    this.checkPermbound = function(i, noSell) {
        //var bool1 = isset(stats['permbound']);
        var bool1 = i.issetPermboundStat();
        var bool2 = noSell.indexOf(Engine.itemStatsData.permbound) > -1;
        return bool1 && bool2;
    };

    this.findVal = function(i, noSell, stats) {
        for (let j = 0; j < noSell.length; j++) {
            let k = noSell[j];
            if (k == 'soulbound' || k == 'nosoulbound' || k == 'permbound') continue;
            //var forbid = noSell[k];
            if (isset(stats[k]) || (i.isItemType(k) && i.itemTypeName === k)) return;
        }
        self.basket.sellItem(i, true);
    };

    this.hoverToItemInEq = function($i, data) {
        $i.hover(
            function() {
                data.$.addClass("addHoverFromBottomItem");
            },
            function() {
                data.$.removeClass("addHoverFromBottomItem");
            }
        );
    };

    this.setShopType = function() {
        if (self.shopType == 0) {
            //self.wnd.$.find('.shop-content').addClass('pet-shop-' + (data.cur == 'sl' ? 'sl': 'zl'));

            addClassToShopWrappers('pet-shop-' + (data.cur == 'sl' ? 'sl' : 'zl'));

            //self.wnd.$.css({background: 'url(../img/gui/shop/shop2.png?v=1)'});
            self.ctx = self.wnd.$.find('.SHOP_CANVAS')[0].getContext('2d');
            self.shopType = 1;
        }
    };

    this.getCollisionAtEvent = function(e) {
        var b,
            x = e.offsetX,
            y = e.offsetY - 32;
        for (var i in c_slots) {
            if (!c_slots[i] || !c_slots[i].collider) continue;
            b = c_slots[i].collider.box;
            if (x > b[0] && y > b[1] && x < b[2] && y < b[3]) return c_slots[i];
        }
        return null;
    };

    this.newSuperMargetItems = function(wrapper, i, newSuperMargetItems) {
        var newY = Math.floor(newSuperMargetItems / 3);
        var newX = newSuperMargetItems - newY * 3;
        // var $clone = Engine.items.createViewIcon(i.id, 'for-you-item')[0];
        var $clone = Engine.tpls.createViewIcon(i.id, Engine.itemsViewData.FOR_YOU_ITEM_VIEW, Engine.itemsFetchData.NEW_CRAZY_TPL_SHOP_CHEST.loc)[0];
        $clone.css({
            left: 15 + newX * 50 + newX,
            top: 20 + newY * 37 + newY
        }).appendTo(wrapper);
        $clone.click(function(e) {
            self.basket.buyItem(i);
        });
    };

    this.setSuperMarketHeader = function() {

        addClassToShopWrappers('for-you-shop');

        //self.wnd.$.find('.for-you-plug').css('display', 'block');
        self.wnd.$.find('.for-you-txt').css('display', 'block');
        self.wnd.$.find('.filters-heading').css('display', 'none');
        self.wnd.$.find('.show-items-filter').css('display', 'none');
        self.wnd.$.find('.great-merchamp').css('display', 'none');
        self.wnd.$.find('.quick-sell-heading, .bag-heading').css('display', 'none');
    };

    this.setSuperMarketWarrning = function() {
        self.wnd.$.find('.for-you-plug-disabled').css('display', 'block');
    };

    this.callSuperMarket = function() {
        self.setSuperMarketHeader();
        $.ajax({
            url: 'https://www.margonem.pl/ajax/shopapi.php?tids=&prof=' + Engine.hero.d.prof + '&lvl=' + getHeroLevel(),
            type: 'POST',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(response) {
                if (response['alsoBuyList']) {}
                if (response['hotList']) {}
                if (response['suggestedList']) {
                    var sMarketCounter = 0;
                    var $wrapper = self.wnd.$.find('.sell-items');
                    var list = response['suggestedList'];
                    for (var i = 0; i < list.length; i++) {
                        var tpl = list[i];
                        if (isset(superMarketItems[tpl])) {
                            if (sMarketCounter > 8) return;
                            var item = superMarketItems[tpl];
                            self.newSuperMargetItems($wrapper, item, sMarketCounter);
                            sMarketCounter++;
                        }
                    }
                }
            },
            error: function() {
                self.setSuperMarketWarrning();
            }
        });
    };

    this.newShopItems = (i, finish) => {
        tpls[i.id] = i;
        if (finish) {
            this.createOffers(data.items_offers);
            this.addItemsToCompare();
            updateScroll();
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 17);
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 17);
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 29);
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 29);
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 31);
        }
    }

    this.createOffers = (offers) => {
        offers.map(item => this.createSingleOffer(item))
    }

    const initScroll = () => {
        this.wnd.$.find('.scroll-wrapper').addScrollBar({
            track: true
        });
    };

    const updateScroll = () => {
        $('.scroll-wrapper', this.wnd.$).trigger('update');
    };

    const addItemSlotCss = () => {
        let $itemSlotCss = $('<div>').addClass('item-slot-css');

        return $itemSlotCss
    }

    this.createSingleOffer = function(offer) {
        //const box = self.wnd.$.find('.shop-items');
        const box = self.wnd.$.find('.scroll-pane');
        let i = tpls[offer.tplId];
        i.offerId = offer.id;
        i.quantity = offer.quantity;
        i.pr = offer.price;
        i.x = offer.x;
        i.y = offer.y;
        i.prc = data.cur;
        const $icon = Engine.tpls.createViewIcon(i.id, Engine.itemsViewData.ITEM_TO_BUY_VIEW, Engine.itemsFetchData.NEW_SHOP_TPL.loc)[0];
        i.setTip($icon);

        if (i.getAmountStat()) {
            Engine.tpls.changeItemAmount(i, $icon, offer.quantity);
        }
        i = {
            ...i
        };
        shopItems[i.offerId] = i;
        addToShopItemsName(i, $icon.find('.highlight'))

        if (data.id == 479) { // premium shop - "offer for you"
            superMarketItems[i.id] = i;
            if (!self.isSuperMarketItem(i.cl)) return;
            self.modifyCounterIfChangeItemCl(i);
            var newY = Math.floor(counter / 8);
            var newX = counter - newY * 8;
            $icon.css({
                left: newX * 32 + newX,
                top: newY * 32 + newY
            }).appendTo(box);
            counter++;
        } else {
            $icon.css({
                left: i.x * 32 + i.x,
                top: i.y * 32 + i.y
            }).appendTo(box);
        }

        $icon.attr('data-item-type', i.itemType);

        $icon.click(function(e) {
            e.stopPropagation();
            self.basket.buyItem(i);
        });

        $icon.contextmenu(function(e, mE) {
            i.createOptionMenu(getE(e, mE), null, null, {
                data: i
            });
            //e.preventDefault();
        });

        $icon.data('item', i);
        $icon.draggable(eqDragOpts);
        $icon.addClass('shop-item');

        if (ItemClass.isShowPreviewItemInShop(i.cl)) {
            if (!typeIsSet) {
                self.setShopType();
                let $infoIcon = $('<div>').addClass('info-icon shop-info-icon');
                typeIsSet = true;

                if (ItemClass.isOutfitCl(i.cl)) $infoIcon.tip(_t('action_info_outfit'));
                if (ItemClass.isPetCl(i.cl)) $infoIcon.tip(_t('action_info', null, 'pet'));

                self.wnd.$.find('.shop-content').append($infoIcon);
            }
        }

        self.setLabel();
    };

    this.buySeriallyItem = function(how, item) {
        for (var i = 0; i < how; i++) {
            self.basket.buyItem(item);
        }
    };

    this.unBuySeriallyItem = function(how, item, $item, slot) {
        for (var i = 0; i < how; i++) {
            self.basket.unbuyItem(item, $item, slot);
            if ($item.parent().length < 1) {
                $('.popup-menu').remove();
                return;
            }
        }
    };

    this.alertWindow = function(item) {
        var t = [
            _t('how_want_to_buy', null, 'item'),
            _t('cancel', null, 'buttons'),
            '<div class="input-wrapper"><input class="default amount-input" placeholder="..." /></div>'
        ];
        var $i;
        mAlert(t[0] + t[2], [{
            txt: 'Ok',
            callback: function() {
                let v = $i.val();

                if (checkInputValIsEmptyProcedure(v)) return;

                v = self.chechValue(v);

                Engine.shop.buySeriallyItem(v, item);
                return true;
            }
        }, {
            txt: t[1],
            callback: function() {
                return true;
            }
        }], function(w) {
            const $input = w.$.find('.amount-input');
            $i = w.$.find('.default');
            w.$.addClass('askAlert');
            setOnlyPositiveNumberInInput($input);
            if (!mobileCheck()) {
                $input.focus();
            }
        });
    };

    this.chechValue = function(val) {
        var v = val < 0 ? 0 : val;
        v = v > 100 ? 100 : v;
        return v
    };

    this.modifyCounterIfChangeItemCl = function(item) {
        if (lastCl == null) lastCl = item.cl;
        if (lastCl == item.cl) return;
        lastCl = item.cl;
        counter = (Math.floor(counter / 8) + 1) * 8;
    };

    this.isSuperMarketItem = function(cl) {
        return cl < 15 || cl == 22 || cl == 24;
    };

    this.sellOrBuyAction = (v) => {
        if (isset(v.sellAction) && v.sellAction === shopActions.FINALIZED) {
            self.basket.clearSellItems();
        }
        if (isset(v.buyAction) && v.buyAction === shopActions.FINALIZED) {
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 18);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 18);
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 30);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 30);
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 32);

            self.basket.callCheckCanFinishExternalTutorialAcceptBasket();

            self.basket.clearBuyItems();

            self.removeClassInHighlighst('track');
        }
        self.basket.doCalcPrices();
    };

    this.initDroppable = function() {
        self.wnd.$.find('.buy-items').droppable({
            accept: '.shop-item',
            drop: function(e, ui) {
                self.basket.buyItem(ui.draggable.data('item'));
            }
        });
        self.wnd.$.find('.sell-items').droppable({
            accept: '.inventory-item',
            drop: function(e, ui) {
                ui.draggable.css('opacity', '');
                self.basket.sellItem(ui.draggable.data('item'), false);
            }
        });
    };

    this.hide = function(clb) {
        for (var i in c_slots) {
            if (c_slots[i]) c_slots[i].remove();
        }

        self.close();

    };

    this.close = function() {
        self.basket.clearBasket(true);
        Engine.tpls.removeCallback(Engine.itemsFetchData.NEW_SHOP_TPL);
        Engine.tpls.deleteMessItemsByLoc('n');
        Engine.itemsMovedManager.removeItemsByTarget(Engine.itemsMovedData.ITEM_TO_SELL);
        superMarketItems = {};
        shopItems = {};
        clearShopItemsName();
        self.purchase = null;

        this.wnd.remove();

        Engine.shop = false;
        Engine.lock.remove('shop');
        Engine.itemsMarkManager.compareAllItems();
        Engine.disableItemsManager.endSpecificItemKindDisable(Engine.itemsDisableData.SHOP);
        Engine.interfaceItems.setEnableSlots('shop');
        Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 18);

        self.callCheckCanFinishExternalTutorialCloseShop()

    };

    this.callCheckCanFinishExternalTutorialCloseShop = () => {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_BREAK.CLOSE_SHOP,
            TutorialData.ON_FINISH_TYPE.BREAK,
            true
        );

        //Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger);
        Engine.rajController.parseObject(tutorialDataTrigger);
    };

    this.addItemsToCompare = function() {
        Engine.shop.items = shopItems;
        Engine.itemsMarkManager.compareAllItems(shopItems);
    };

    this.getItems = function() {
        return shopItems;
    };

    this.closeOtherWindows = () => {
        const v = Engine.windowsData.windowCloseConfig.SHOP;
        Engine.windowCloseManager.callWindowCloseConfig(v)
    }


    this.buyAllItems = () => {
        let a = [];

        for (let k in shopItems) {
            a.push(shopItems[k]);
        }

        const intervalBuy = (i, id) => {
            setTimeout(function() {
                _g('console&custom=.icreate' + esc(" ") + id);
            }, i * 500)
        }

        for (let i = 0; i < a.length; i++) {
            intervalBuy(i, a[i].id);
        }
    }

    this.getShopItemsNameHighlight = getShopItemsNameHighlight;
    this.removeClassInHighlighst = removeClassInHighlighst;
};