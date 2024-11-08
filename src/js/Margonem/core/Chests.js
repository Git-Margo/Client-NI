// var wnd = require('core/Window');
var tpl = require('core/Templates');
var Premium = require('core/Premium');
var DraconiteShop = require('core/shop/DraconiteShop');
//var Items = require('core/items/ItemsManager');

module.exports = function(chestData) {
    var self = this;
    var content;
    var counter = 0;
    let items = {};
    let offers = [];

    this.init = function() {
        this.initWindow();
        this.initBottomPanel();
        this.getItems();
        this.setOffers(chestData);
        this.showChestBeforePremium();
        this.wnd.center();
        Engine.lock.add('shop');
    };

    this.showChestBeforePremium = function() {
        if (CFG.chest) self.wnd.$.find('.info-label').css('display', 'none');
        else self.wnd.$.find('.go-to-shop').css('display', 'none');
    };

    this.initBottomPanel = function() {
        self.wnd.$.find('.info-label').html(_t('buy_sl_label', null, 'shop'));
        var $btn1 = tpl.get('button').addClass('small purple');
        $btn1.find('.label').html(_t('buy_sl', null, 'shop'));
        self.wnd.$.find('.buy-sl').append($btn1);
        $btn1.click(function(e) {
            e.stopPropagation();
            if (Engine.draconiteShop) return;
            Engine.draconiteShop = new DraconiteShop();
            Engine.draconiteShop.open();
        });
        var $btn2 = tpl.get('button').addClass('small green go-to-shop');
        $btn2.find('.label').html(_t('go_to_show', null, 'shop'));
        self.wnd.$.find('.buy-sl').append($btn2);
        $btn2.click(function(e) {
            e.stopPropagation();
            if (!Engine.premium) {
                Engine.premium = new Premium();
                Engine.premium.init();
            }
            self.close();
        });
    };

    this.newCrazyItemShop = function(offer) {
        const item = items[offer.tplId];
        var $promoChest = tpl.get('promo-chest');
        var $btn1 = tpl.get('button').addClass('small purple');
        var $btn2 = tpl.get('button').addClass('small purple');
        $btn1.find('.label').html(_t('buying_items', null, 'shop'));
        $btn2.find('.label').html(_t('items_list'));
        var cl = self.getClass(item.name);

        $promoChest.find('.chest-img').addClass(cl);
        $promoChest.find('.price-txt').html(offer.price + ' ' + _t('sl'));
        $promoChest.find('.btn-wrapper').append($btn1);
        $promoChest.find('.btn-wrapper').append($btn2);
        $promoChest.find('.txt-html').html(_t('chest_' + counter));
        $promoChest.find('.header-txt').html((item.name).toUpperCase());
        self.wnd.$.find('.chests-choice-wrapper').append($promoChest);
        $btn1.click(function() {
            self.acceptBuy(offer.price, offer.id);
        });
        $btn2.click(function() {
            _g('moveitem&st=2&tpl=' + item.id);
            Engine.tpls.deleteMessItemsByLoc('p');
            Engine.tpls.deleteMessItemsByLoc('s');
        });
        self.wnd.center();
        counter++;
    };

    this.getClass = function(name) {

        var red = new RegExp('czerwonego', 'gi');
        var black = new RegExp('czarnego', 'gi');

        if (name.match(red)) return 'red-dragon-chest-g';
        if (name.match(black)) return 'black-dragon-chest-g';
    };

    this.acceptBuy = function(price, buyId) {
        if (Engine.hero.d.credits < price) mAlert(_t('low_sl'));
        else {
            var data = {
                ik: "oimg",
                ip: "/draconite_small.gif",
                //it: '<span class="red">' + price + '</span>',
                it: price,
                m: "yesno2",
                q: _t('accept_dragon_chest', null, 'shop'),
                re: 'shop&buy=' + buyId + ',1&sell='
            };
            askAlert(data);
        }
    };

    this.newItem = (item, finish) => {
        items[item.id] = item;
        if (finish && offers !== null) {
            offers.map(offer => this.newCrazyItemShop(offer))
        }
    }

    this.setOffers = (data) => {
        if (isset(data.items_offers)) offers = data.items_offers;
    }

    this.getItems = function() {
        Engine.tpls.fetch(Engine.itemsFetchData.NEW_CRAZY_TPL_SHOP_CHEST, self.newItem);
    };

    this.initWindow = function() {
        content = tpl.get('chests-window');

        Engine.windowManager.add({
            content: content,
            title: _t('sl-chests', null, 'shop'),
            //nameWindow        : 'chests-window',
            nameWindow: Engine.windowsData.name.CHESTS_WINDOW,
            objParent: self,
            nameRefInParent: 'wnd',
            onclose: () => {
                self.close();
            }
        });
        self.wnd.addToAlertLayer();
    };

    this.hide = function() {
        self.close();
    };

    this.close = function() {
        //Engine.items.removeCallback('n', self.newCrazyItemShop);
        items = {};
        offers = [];
        Engine.tpls.removeCallback(Engine.itemsFetchData.NEW_CRAZY_TPL_SHOP_CHEST);
        Engine.tpls.deleteMessItemsByLoc('n');
        Engine.lock.remove('shop');
        //self.wnd.$.remove();
        self.wnd.remove();
        //delete (this.wnd);
        Engine.chests = false;
    };
};