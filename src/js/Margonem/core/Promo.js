var tpl = require('core/Templates');
var Premium = require('core/Premium');
var DraconiteShop = require('core/shop/DraconiteShop');

module.exports = function(promoData) {
    var self = this;
    var content;
    var promoPrice = 0;
    var sellp = 0;
    var request = '';
    let items = {};
    let offers = [];

    this.init = function() {
        sellp = promoData.sellp;
        this.initWindow();
        this.initBottomPanel();
        this.getItems();
        this.setOffers(promoData);
        this.setPromotionTxt();
        this.initScrollbar();
        this.wnd.center();
        Engine.lock.add('shop');
    };

    this.initBottomPanel = function() {
        //self.wnd.$.find('.info-label').html(_t('buy_sl_label', null, 'shop'));
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

    this.initBuyPanel = function() {
        var $btn1 = tpl.get('button').addClass('green');
        $btn1.find('.label').html(_t('buy_promo'));
        self.wnd.$.find('.buy-btn').append($btn1);
        $btn1.click(function() {
            self.acceptBuy(promoPrice);
        });
    };

    this.newCrazyItemShop = function(offer) {
        const item = items[offer.tplId];
        var $promoChest = tpl.get('shop-promo-item');
        //$promoChest.find('.item-wrapper').append(data.$);
        // let $clone = Engine.items.createViewIcon(data.id, 'shop-promo-item')[0];
        let $clone = Engine.tpls.createViewIcon(item.id, Engine.itemsViewData.SHOP_PROMO_ITEM_VIEW, Engine.itemsFetchData.NEW_CRAZY_TPL_SHOP_CHEST.loc)[0];
        $promoChest.find('.item-slot-container').append($clone);
        $clone.on('contextmenu', (e) => {
            item.createPromoOptionMenu(e);
        });
        $promoChest.find('.item-price').append(item.pr + ' ' + _t('sl', null, 'clan'));
        $promoChest.find('.item-price-new').append(offer.price + ' ' + _t('sl', null, 'clan'));
        var $button = tpl.get('button').addClass('small green buy-item-btn');
        $button.find('.label').html('Buy');
        $button.click(function() {
            self.acceptBuy(offer.price, offer.id);
        });
        $promoChest.find('.btn-wrapper').append($button);
        self.wnd.$.find('.items-wrapper').append($promoChest);
        self.wnd.center();
    };

    this.acceptBuy = function(price, id) {
        if (Engine.hero.d.credits < price) mAlert(_t('low_sl'));
        else {
            var data = {
                ik: "oimg",
                ip: "/draconite_small.gif",
                //it: '<span class="red">' + price + '</span>',
                it: price,
                m: "yesno2",
                q: _t('accept_buy_promo', null, 'shop'),
                //re: 'shop&buy=' + request.slice(0, -1) + '&sell='
                re: 'shop&buy=' + id + ',1&sell='
            };
            askAlert(data);
        }
    };

    this.setPromotionTxt = function() {
        self.wnd.$.find('.promo-percent').html((100 - sellp) + '% ' + _t('cheaper'));
    };

    this.newItem = (item, finish) => {
        items[item.id] = item;
        if (finish && offers !== null) {
            offers.map(offer => this.newCrazyItemShop(offer));
            self.updateScrollbar();
        }
    }

    this.getItems = function() {
        Engine.tpls.fetch(Engine.itemsFetchData.NEW_CRAZY_TPL_SHOP_PROMO, self.newItem);
    };

    this.setOffers = (data) => {
        if (isset(data.items_offers)) offers = data.items_offers;
    }

    this.initScrollbar = () => {
        self.wnd.$.find('.scroll-wrapper').addScrollBar({
            track: true
        });
    }

    this.updateScrollbar = () => {
        self.wnd.$.find('.scroll-wrapper').trigger('update');
    }

    this.initWindow = function() {

        content = tpl.get('promo-window');

        Engine.windowManager.add({
            content: content,
            //nameWindow        : 'promo',
            nameWindow: Engine.windowsData.name.PROMO,
            nameRefInParent: 'wnd',
            objParent: this,
            addClass: 'promo-window-wnd',
            title: _t('new_premium_item_20', null, 'premium_panel'),
            onclose: () => {
                self.close();
            }
        });

        this.wnd.addToAlertLayer();
    };

    this.hide = function() {
        self.close();
        if (Engine.premium) Engine.premium.finishHideShop();
    };

    this.sendRequest = function() {
        _g(request.slice(0, -1) + '&sell=');
    };

    this.close = function() {
        Engine.tpls.removeCallback(Engine.itemsFetchData.NEW_CRAZY_TPL_SHOP_PROMO);
        Engine.tpls.deleteMessItemsByLoc(Engine.itemsFetchData.NEW_CRAZY_TPL_SHOP_CHEST.loc);
        Engine.lock.remove('shop');
        //self.wnd.$.remove();
        self.wnd.remove();
        //delete (this.wnd);
        Engine.promo = false;
    };

    this.init();
};