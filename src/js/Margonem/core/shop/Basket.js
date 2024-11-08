var OutfitSelectorStore = require('core/shop/OutfitSelectorStore');
var Tpl = require('core/Templates');
let ItemClass = require('core/items/ItemClass');
let CharacterData = require('core/characters/CharactersData');
var TutorialData = require('core/tutorial/TutorialData');
const {
    checkPersonalItems,
    checkEnhancedItems
} = require('../HelpersTS');
const ConfirmationQueue = require('../utils/ConfirmationQueue');

module.exports = function(data) {
    var self = this;
    var balance = 0;
    var buy_items = {};
    var bi_slots = {
        0: null,
        1: null,
        2: null,
        3: null,
        4: null
    };

    var sell_items = {};
    var si_slots = {};

    const canvasCharacterSlots = {
        0: null,
        2: null,
        4: null
    };

    var buy = Engine.shop.wnd.$.find('.buy-items');
    var sell = Engine.shop.wnd.$.find('.sell-items');

    var getFreeSlot = function() {
        for (var i in bi_slots) {
            if (Engine.shop.shopType && i % 2 == 1) continue;
            if (bi_slots[i] === null) return i;
        }
        return null;
    };

    this.addToCanvasCharacterSlots = (index, id) => {
        canvasCharacterSlots[index] = id;
    };

    this.removeFromCanvasCharacterSlots = (index) => {
        canvasCharacterSlots[index] = null;
    };

    this.getFromCanvasCharacterSlots = (index) => {
        return canvasCharacterSlots[index];
    };

    this.clearCanvasCharacterSlots = () => {
        for (let k in canvasCharacterSlots) {
            let id = this.getFromCanvasCharacterSlots(k);
            if (id != null) {
                Engine.canvasCharacterWrapperManager.removeCharacter(id);
                this.removeFromCanvasCharacterSlots(k);
            }
        }
    };

    var calcPrices = function() {
        var buy_price = 0,
            sell_price = 0;
        for (var i in buy_items) {
            buy_price += buy_items[i].amount * buy_items[i].price;
        }

        for (var i in sell_items) {
            const shopTax = data.buyp * 0.01;
            const oneItemPrice = Math.floor(sell_items[i].price / sell_items[i].amount);
            const oneItemShopPrice = Math.min(oneItemPrice * shopTax, data.maxbuyp)
            sell_price += Math.round(oneItemShopPrice * sell_items[i].amount)
            // sell_price += Math.min(Math.floor(data.maxbuyp * sell_items[i].amount), Math.round(sell_items[i].price * data.buyp * 0.01));
        }

        balance = sell_price - buy_price;

        $('.shop-balance .buy', Engine.shop.wnd.$).text((balance != 0 ? '-' : '') + formNumberToNumbersGroup(buy_price));
        $('.shop-balance .sell', Engine.shop.wnd.$).text((balance != 0 ? '+' : '') + formNumberToNumbersGroup(sell_price));

        var txt = '';
        switch (data.cur) {
            case 'zl':
                txt = (balance != 0 ? (balance > 0 ? '+' : '-') : '') + round(balance, 2) + ((-balance > Engine.hero.d.gold) ? ' (!)' : '');
                break;
            case 'sl':
                txt = (balance != 0 ? (balance > 0 ? '+' : '-') : '') + round(balance, 2) + ((-balance > Engine.hero.d.credits) ? ' (!)' : '');
                break;
            case 'ph':
                txt = (balance != 0 ? (balance > 0 ? '+' : '-') : '') + round(balance, 2) + ((-balance > Engine.hero.d.honor) ? ' (!)' : '');
                break;
            default:
                var amount = 0;
                var temp = data.cur.split('|');
                let items = Engine.heroEquipment.getHItems();
                for (var a in items) {
                    var item = items[a];
                    if (item.name == temp[0]) {
                        var match = /amount=([0-9]+)/.exec(item.stat);
                        if (match !== null && isset(match[1])) amount += parseInt(match[1]);
                        else amount++;
                    }
                }
                txt = (balance != 0 ? (balance > 0 ? '+' : '-') : '') + round(balance, 2) + ((-balance > amount) ? ' (!)' : '');
                break;
        }
        $('.shop-balance .balance', Engine.shop.wnd.$).text(txt);

        if (balance < 0) $('.shop-balance .balance', Engine.shop.wnd.$).addClass('minus');
        else $('.shop-balance .balance', Engine.shop.wnd.$).removeClass('minus');
    };

    this.refuseBuyItem = function(e, item, $item, slot) {
        var menu = [];
        menu.push([_t('unbuy 5'), function() {
            Engine.shop.unBuySeriallyItem(5, item, $item, slot);
        }, {
            button: {
                cls: 'not-close'
            }
        }]);
        menu.push([_t('unbuy 1'), function() {
            Engine.shop.unBuySeriallyItem(1, item, $item, slot);
        }, {
            button: {
                cls: 'not-close'
            }
        }]);
        menu.push([_t('unbuy all'), function() {
            while ($item.parent().length > 0) {
                self.unbuyItem(item, $item, slot);
            }
        }]);
        e.clientX -= 80;
        Engine.interface.showPopupMenu(menu, e);
    };

    this.buyItem = function(i) {
        if (!isset(buy_items[i.id])) {
            var slot = parseInt(getFreeSlot());
            if (isNaN(slot)) return;

            var $i = Engine.tpls.createViewIcon(i.id, Engine.itemsViewData.BUY_ITEM_IN_BASKET_VIEW, Engine.itemsFetchData.NEW_BASKET_TPL.loc)[0];
            $i.data('item', i);
            if (isset(i._cachedStats.amount)) {
                Engine.tpls.changeItemAmount(i, $i, i.quantity);
            }
            buy_items[i.id] = {
                offerId: i.offerId,
                amount: 1,
                price: i.pr,
                $: $i
            };


            $i.appendTo(buy);

            $i.click(function(e) {
                self.unbuyItem(i, $(this), slot);
            });

            $i.contextmenu(function(e, mE) {
                self.refuseBuyItem(getE(e, mE), i, $(this), slot);
                //e.preventDefault();
            });

            $i.css({
                left: (slot * 32) + slot,
                top: 0
            });

            bi_slots[slot + ''] = i.id;

            if (Engine.shop.shopType == 1) {

                var st = Engine.items.parseItemStat(i.stat);
                var showType = null;

                if (isset(st.outfit) || isset(st.outfit_selector)) {

                    if (isset(st.outfit)) showType = 'outfit';
                    if (isset(st.outfit_selector)) showType = 'outfit_selector';

                } else if (isset(st.pet)) showType = 'pet';

                if (showType == 'pet') {

                    let tempList = st.pet.split(',');

                    let canvasCharacterWrapper = Engine.canvasCharacterWrapperManager.addCharacter({
                        drawSystem: CharacterData.drawSystem.PET,
                        path: tempList[1],
                        actions: tempList[3]
                    });

                    let id = canvasCharacterWrapper.getId();
                    let $canvas = $(canvasCharacterWrapper.getCanvas());

                    self.addToCanvasCharacterSlots(slot, id);
                    $canvas.addClass('canvasCharacterWrapper slot-id-' + slot);
                    Engine.shop.wnd.$.find('.sell-items').append($canvas);
                }

                if (showType == 'outfit') {

                    let canvasCharacterWrapper = Engine.canvasCharacterWrapperManager.addCharacter({
                        drawSystem: CharacterData.drawSystem.PLAYER_OUTFIT,
                        path: st.outfit.split(',')[1]
                    });

                    let id = canvasCharacterWrapper.getId();
                    let $canvas = $(canvasCharacterWrapper.getCanvas());

                    self.addToCanvasCharacterSlots(slot, id);
                    $canvas.addClass('canvasCharacterWrapper slot-id-' + slot);
                    Engine.shop.wnd.$.find('.sell-items').append($canvas);
                }

                if (showType == 'outfit_selector') {
                    let o = {
                        slot: slot,
                        name: i.name,
                        list: i.getOutfits()
                    };
                    let outfit = new OutfitSelectorStore();
                    outfit.init(o)
                }

            }
        } else {
            buy_items[i.id].amount++;
        }

        if (buy_items[i.id].amount > 1) {
            if (!buy_items[i.id].$.find('.amount').length) {
                buy_items[i.id].$.append('<div class="amount"></div>');
            }
            buy_items[i.id].$.find('.amount').html(buy_items[i.id].amount);
        } else {
            $i.find('.amount').remove();
        }

        calcPrices();
        Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 17);
        //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 17);
        Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 31);
        Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 18);
        //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 18);
        Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 32);

        self.callCheckCanFinishExternalTutorialItemsInBasket()
    };

    this.callCheckCanFinishExternalTutorialItemsInBasket = () => {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_REQUIRE.ITEMS_IN_BASKET,
            TutorialData.ON_FINISH_TYPE.REQUIRE,
            true
        );

        Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger);
    };

    this.unbuyItem = function(i, $i, slot) {
        var c_slots = Engine.shop.getC_slots();
        buy_items[i.id].amount--;

        if (buy_items[i.id].amount > 1) {
            $i.find('.amount').html(buy_items[i.id].amount);
        } else {
            $i.find('.amount').remove();
        }

        if (buy_items[i.id].amount <= 0) {
            delete(buy_items[i.id]);
            $i.remove();
            bi_slots[slot] = null;

            let id = self.getFromCanvasCharacterSlots(slot);
            if (id != null) {
                Engine.canvasCharacterWrapperManager.removeCharacter(id);
                self.removeFromCanvasCharacterSlots(slot);
            }


            Engine.shop.wnd.$.find('.outfit-selector-slot-' + slot).remove();
            Engine.shop.wnd.$.find('.outfit-selector-arrow-' + slot).remove();

            if (c_slots[slot]) { // remove from canvas
                c_slots[slot].remove();
            }
            Engine.tpls.deleteViewIcon(i.id, Engine.itemsViewData.BUY_ITEM_IN_BASKET_VIEW);
        }

        calcPrices();
    };

    this.sellItem = function(i, greatMerchamp) {
        var continue_sell = function() {
            var slot = null;
            for (var y = 0; y < 4; y++) {
                for (var x = 0; x < 5; x++) {
                    if (!isset(si_slots[x + ',' + y])) {
                        slot = [x, y];
                        break;
                    }
                }
                if (slot) break;
            }

            if (slot !== null) {
                si_slots[slot[0] + ',' + slot[1]] = i.id;
                let $i = Engine.items.createViewIcon(i.id, Engine.itemsViewData.SELL_ITEM_IN_BASKET_VIEW)[0];
                $i.data('item', i);
                Engine.shop.hoverToItemInEq($i, i);
                $i.css({
                    top: slot[1] * 32 + slot[1],
                    left: slot[0] * 32 + slot[0]
                });
                $i.appendTo(sell).click(function() {
                    self.unsellItem(i, $(this), slot);
                });
                i.on('afterUpdate', self.afterItemUpdate);
                i.on('delete', self.afterItemDelete);
                $i.contextmenu(function(e, mE) {
                    var callback = {
                        txt: _t('unbuy all'),
                        f: function() {
                            self.unsellItem(i, $i, slot);
                        }
                    };
                    i.createOptionMenu(getE(e, mE), callback, {
                        move: true,
                        use: true
                    });
                    //e.preventDefault();
                });
                let amount = i.haveStat('amount') ? i.getAmount() : 1;
                sell_items[i.id] = {
                    price: i.pr,
                    amount
                };

                Engine.itemsMovedManager.addItem(i, Engine.itemsMovedData.ITEM_TO_SELL, function() {
                    self.unsellItem(i, $i, slot);
                });
            }
            calcPrices();

        };

        if (ItemClass.isGoldCl(i.cl) || ItemClass.isQuestCl(i.cl) || ItemClass.isBlessCl(i.cl) || ItemClass.isUpgradeCl(i.cl) || ItemClass.isRecipeCl(i.cl)) {
            let $div = Tpl.get('alert-item');
            const itemId = i.id;
            const parent = i.isItem() ? Engine.items : Engine.tpls;
            const icon = parent.createViewIcon(itemId, Engine.itemsViewData.NO_SELL_ITEM_VIEW, 'g')[0];
            $div.find('.alert-item-name').text(i.name);
            //$div.find('.alert-item-icon').append(icon);
            mAlert(
                $div.html() + _t('sell_cannot', null),
                [{
                    txt: 'Ok',
                    callback: function() {
                        parent.deleteViewIcon(itemId, Engine.itemsViewData.NO_SELL_ITEM_VIEW);
                        return true;
                    }
                }],
                function(wnd) {
                    wnd.$.find('.alert-item-icon').append(icon);
                });
            return;
        }

        if (data.purchase == '') {
            if (!greatMerchamp) mAlert(_t('seller_wont_buy_anything')); //'Ten sprzedawca nic od ciebie nie kupi.'
            return;
        }

        if (data.purchase !== '*') {
            var p = data.purchase.split(','),
                cansell = false;
            for (var k in p)
                if (i.cl == p[k]) cansell = true;
            if (!cansell) {
                if (!greatMerchamp) mAlert(_t('seller_wont_buy_this')); //'Ten sprzedawca nie skupuje takich rzeczy.'
                return;
            }
        }

        if (isset(sell_items[i.id])) return;

        if (i.stat.search('quest=') >= 0 || i.stat.search('nodesc') >= 0) {
            _g('shop&can_sell=' + i.id, function(d) {
                if (d.can_sell == 1) continue_sell();
            })
        } else continue_sell();

    };

    this.unsellItem = function(i, $i, slot) {
        delete(sell_items[i.id]);
        delete(si_slots[slot[0] + ',' + slot[1]]);
        Engine.items.deleteViewIcon(i.id, Engine.itemsViewData.SELL_ITEM_IN_BASKET_VIEW);
        Engine.itemsMovedManager.removeItem(i.id);
        $i.remove();
        i.unregisterCallback('afterUpdate', self.afterItemUpdate);
        i.$.removeClass('addHoverFromBottomItem');


        calcPrices();
    };

    this.afterItemUpdate = function() { // no arrow function because I must pass data by this. Item.on and Item.unregisterCallback need to FIX
        const i = this;
        const $i = Engine.items.getAllViewsByIdAndViewName(i.id, Engine.itemsViewData.SELL_ITEM_IN_BASKET_VIEW)[0];
        i.updadeViewAfterUpdateItem($i);
        sell_items[i.id] = {
            price: i.pr
        };
        calcPrices();
    }

    this.afterItemDelete = function() {
        const i = this;
        Engine.items.deleteViewIconIfExist(i.id, Engine.itemsViewData.SELL_ITEM_IN_BASKET_VIEW);
        delete sell_items[i.id];

        for (const key in si_slots) {
            if (si_slots[key] === i.id) delete si_slots[key];
        }
        self.debouncedCalcPrices(); // calc prices after delete items (fix for battleset items - confirm)
    }

    this.debouncedCalcPrices = debounce(() => {
        calcPrices();
    }, 10);

    this.preFinalize = () => {
        const sellItems = Object.keys(sell_items);
        const confirmationQueue = new ConfirmationQueue.default();

        confirmationQueue
            .addCondition(() => checkEnhancedItems(sellItems), _t('enhanced-item-confirm')) // enchanted item
            .addCondition(() => checkPersonalItems(sellItems), _t('personal-item-confirm2')) // personal item
            .processConditions(() => {
                this.finalize()
            });
    };

    this.finalize = function() {
        if (Object.keys(buy_items).length === 0 && Object.keys(sell_items).length === 0) return;

        switch (data.cur) {
            case 'ph':
                if (-balance > Engine.hero.d.honor) {
                    mAlert(_t('shop_to_low_ph')); //'Masz zbyt maï¿½o Punktï¿½w Honoru by dokonaï¿½ wybranego zakupu.'
                    return;
                }
                break;
            case 'zl':
                if (-balance > Engine.hero.d.gold) {
                    mAlert(_t('shop_to_low_gold')); //'Masz zbyt maï¿½o zï¿½ota by dokonaï¿½ wybranego zakupu.'
                    return;
                }
                break;
            case 'sl':
                if (-balance > Engine.hero.d.credits) {
                    mAlert(_t('shop_to_low_credits')); //'Masz zbyt maï¿½o Smoczych ï¿½ez by dokonaï¿½ wybranego zakupu.'
                    return;
                }
                break;
            default:
                var amount = 0;
                var temp = data.cur.split('|');
                let items = Engine.heroEquipment.getHItems();
                for (var a in items) {
                    var item = items[a];
                    if (item.name == temp[0]) {
                        var match = /amount=([0-9]+)/.exec(item.stat);
                        if (match !== null && isset(match[1])) amount += parseInt(match[1]);
                        else amount++;
                    }
                }
                if (-balance > amount) {
                    mAlert(_t('shop_to_low_items %type%', {
                        '%type%': temp[0]
                    })); //'Masz zbyt maï¿½o sztuk wymaganego ï¿½rodka pï¿½atnoï¿½ci ('+temp[0]+') by dokonaï¿½ wybranego zakupu.'
                    return;
                }
                break;
        }
        var bl = [];
        var sl = [];
        for (var k in buy_items) {
            bl.push(buy_items[k].offerId + ',' + buy_items[k].amount);
        }
        for (var k in sell_items) sl.push(k);

        _g('shop&buy=' + bl.join(';') + '&sell=' + sl.join(','), function(d) {
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 18);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 18);
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 30);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 30);
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 32);

            self.callCheckCanFinishExternalTutorialAcceptBasket();

            if (isset(d.item)) self.clearBasket();

            getEngine().shop.removeClassInHighlighst('track');
        });
    };

    this.callCheckCanFinishExternalTutorialAcceptBasket = () => {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_REQUIRE.ACCEPT_BASKET,
            TutorialData.ON_FINISH_TYPE.REQUIRE,
            true
        );

        Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger)
    };

    this.clearBasket = function(withClose) {
        var c_slots = Engine.shop.getC_slots();
        //buy_items = {};
        self.clearBuyItems();
        bi_slots = {
            0: null,
            1: null,
            2: null,
            3: null,
            4: null
        };

        for (var i in c_slots) { // clear canvas
            if (c_slots[i]) c_slots[i].remove();
            Engine.shop.wnd.$.find('.outfit-selector-slot-' + i).remove();
            Engine.shop.wnd.$.find('.outfit-selector-arrow-' + i).remove();
        }

        self.clearCanvasCharacterSlots();

        self.clearSellItems();
        if (Engine.shop.getData().id == 479) return;

        if (!withClose) calcPrices();
    };

    this.clearSellItems = function() {
        for (let id in sell_items) {
            const item = Engine.items.getItemById(id);
            Engine.items.deleteViewIconIfExist(id, Engine.itemsViewData.SELL_ITEM_IN_BASKET_VIEW);
            item.unregisterCallback('afterUpdate', self.afterItemUpdate);
            delete sell_items[id];
        }
        $('.sell-items .item', Engine.shop.wnd.$).remove();
        sell_items = {};
    };

    this.clearBuyItems = function() {
        for (let id in buy_items) {
            const item = Engine.tpls.getTplByIdAndLoc(id, 'n');
            Engine.tpls.deleteViewIcon(id, Engine.itemsViewData.BUY_ITEM_IN_BASKET_VIEW);
            item.unregisterCallback('afterUpdate', self.afterItemUpdate);
            delete buy_items[id];
        }
        $('.buy-items .item', Engine.shop.wnd.$).remove();
        buy_items = {};
    }
};