//var Items = require('core/items/ItemsManager');
var Storage = require('core/Storage');
var Tpl = require('core/Templates');
var ItemClass = require('core/items/ItemClass');
module.exports = function() {

    var self = this;
    var block = false;
    var disableSlotsList = {};
    var optDrag = {
        appendTo: 'body',
        helper: 'clone',
        distance: 6,
        delay: 100,
        cursorAt: {
            top: 16,
            left: 16
        },
        //containment: $('body'),
        scroll: false,
        zIndex: 20,
        start: function(e, ui) {
            $(this).fadeTo(200, 0.5);
            changeViewOfHelper(ui.helper, $(this).data().item.id);
        },
        stop: function(e) {
            $(this).fadeTo(200, 1);
        }
    };

    this.getDisableSlotsList = () => {
        return disableSlotsList;
    }

    this.getFreeSlots = () => {
        let slots = {};

        Engine.interface.get$gameWindowPositioner().find('.usable-slot').each(function() {
            if ($(this).children().length) return;

            let $slot = $(this);
            let index = $slot.index();
            let isRight = $slot.parent().hasClass('right');

            if (isRight) index = 3 + Math.abs(index - 4);

            slots[index + 1] = $slot;
        });

        return slots;
    }

    this.init = function() {
        //Engine.items.fetch('g', self.newBottomItemFromFetch);
        Engine.items.fetch(Engine.itemsFetchData.NEW_BOTTOM_ITEM, self.newBottomItemFromFetch);
        //$bottomPanel.find('.usable-slot').droppable({
        Engine.interface.get$gameWindowPositioner().find('.usable-slot').droppable({
            accept: '.item:not(.shop-item)',
            drop: function(e, ui) {

                var $usableSlot = $(this);
                var data = ui.draggable.data('item');
                var $dropItemParent = ui.draggable.parent();

                var isBottomItem = ui.draggable.hasClass('bottomItem');
                var slotIsFull = $usableSlot.children().length > 0;
                if (!isBottomItem && slotIsFull) return message(_t('place_is_not_empty'));

                self.newBottomItem(data, $usableSlot, slotIsFull, $dropItemParent);
            }
        });
    };

    this.setDisableSlots = (kind) => {
        if (disableSlotsList[kind]) return;

        $('.bottom-panel').find('.slots, .helpers-numbers').addClass('disable-slots');
        disableSlotsList[kind] = true;
    };

    this.setEnableSlots = (kind) => {
        delete disableSlotsList[kind];
        if (Object.keys(disableSlotsList).length) return;
        $('.bottom-panel').find('.slots, .helpers-numbers').removeClass('disable-slots');
    };

    this.newBottomItem = function(data, $slot, slotIsFull, $dropItemParent) {
        var id = data.id;
        var sData = Storage.get('bottomPanel/' + Engine.hero.d.id + '/' + id);

        if (!$slot && !sData) return;

        if (sData) {
            if (self.isntRightItem(data, false)) {
                self.deleteExistItem(id, data);
                return;
            }
        } else {
            if (self.isntRightItem(data, true)) return;
        }

        if ($slot && sData) {

            if (slotIsFull) this.changePlaceTwoItems(id, $slot, $dropItemParent);
            else this.deleteExistItem(id, data);

        }
        self.bItemCallbacks(data);

        if ($slot) self.afterDrop($slot, data);
        else self.fromStorage(sData, data);
    };

    this.newBottomItemFromFetch = function(data) {
        var id = data.id;
        var sData = Storage.get('bottomPanel/' + Engine.hero.d.id + '/' + id);

        if (!sData) return;

        if (self.isntRightItem(data, false)) {
            self.deleteExistItem(id, data);
            return;
        }

        self.bItemCallbacks(data);
        self.fromStorage(sData, data);
    };

    this.changePlaceTwoItems = function(idDropItem, $newSlot, $dropItemParent) {
        var oldItemData = $($newSlot.children().get(0)).data('item');
        this.deleteExistItem(idDropItem, oldItemData);
        this.newBottomItem(oldItemData, $dropItemParent);
    };

    this.afterDrop = function($slot, data) {
        var float = $slot.css('float');
        var index = $slot.index();
        var storId = float[0] + index;
        var $clone = self.initBottomItem(data, float, index);
        Storage.set('bottomPanel/' + Engine.hero.d.id + '/' + data.id, storId);
        $slot.empty();
        $slot.append($clone);
    };

    this.fromStorage = function(sData, data) {
        var float = sData[0] == 'l' ? 'left' : 'right';
        var index = sData[1];
        //var $slot = $('.slots.' + float).children().eq(index);
        var $slot = Engine.interface.get$gameWindowPositioner().find('.slots.' + float).children().eq(index);
        var $clone = self.initBottomItem(data, float, index);
        $slot.empty();
        $slot.append($clone);
    };

    this.initBottomItem = function(data, float, index) {
        //var $clone = $(data.$[0]).clone(false);
        //let $clone = Engine.items.createViewIcon(data.id, 'bottom-item')[0];
        let $clone = Engine.items.createViewIcon(data.id, Engine.itemsViewData.BOTTOM_ITEM_VIEW)[0];
        const $viewsItems = Engine.items.getAllViewsItemsById(data.id);
        $clone.draggable(optDrag);
        $clone.css({
            opacity: 1
        });
        $clone.data('item', data);
        $clone.attr('id', 'bottomItem' + data.id);
        $clone.addClass('bottomItem');
        $viewsItems.hover(
            function() {
                $viewsItems.addClass("addHoverFromBottomItem");
            },
            function() {
                $viewsItems.removeClass("addHoverFromBottomItem");
            }
        );
        $clone.click(function() {
            self.afterUse(data);
        });
        //if (!mobileCheck()) {
        $clone.contextmenu(function(e, mE) {
            var callback = {
                txt: _t('detach'),
                f: function() {
                    self.deleteExistItem(data.id, data);
                }
            };
            e.clientY -= 50;
            data.createOptionMenu(getE(e, mE), callback, {
                move: true,
                attachToQuickItems: true
            });
            //e.preventDefault();
        });
        //}
        self.setPosItem($clone, float, index);
        //data.updateTimelimitItemTips($clone);
        return $clone;
    };

    this.isntRightItem = function(data, alert) {
        if (isset(data._cachedStats.emo)) {
            if (alert) mAlert(_t('emo_alert'));
            return true;
        }
        if (!ItemClass.canAddToBottomPanel(data.cl)) {
            if (alert) mAlert(_t('only_to_eat'));
            return true;
        }
        if (isset(data._cachedStats.expires) && data.checkExpires()) {
            if (alert) message(_t('item_expired_info'));
            return true;
        }
        return false;
    };

    this.setPosItem = function($item, float, index) {
        var dx = index * 41 + 2;
        var pos = float == 'left' ? ['', dx] : [dx, ''];
        $item.css({
            top: 3,
            //right: pos[0],
            left: 2
        })
    };

    this.prepareMenuToPutItemInSlot = (item, e) => {
        let freeSlots = this.getFreeSlots();
        if (!Object.keys(freeSlots).length) {
            mAlert(_t('not_have_free_slots'));
            return
        }

        let menu = [];

        for (let k in freeSlots) {
            this.createMenuElementToPutItemInSpecificSlot(item, k, freeSlots[k], menu);
        }

        Engine.interface.showPopupMenu(menu, e);
    }

    this.createMenuElementToPutItemInSpecificSlot = (item, index, $slot, menu) => {
        //let slotIndex = parseInt(index ) + 1;

        menu.push([
            index, () => {
                self.newBottomItem(item, $slot);
            }
        ]);
    }

    this.bItemCallbacks = function(data) {
        data.on('afterUpdate', self.afterUpdateCallback);
        data.on('delete', self.deleteCallback);
    };

    this.afterUpdateCallback = function(oldState) {
        var $bItem = $("#bottomItem" + this.id);
        if ($bItem) this.updadeViewAfterUpdateItem($bItem);
        let actualTs = ts() / 1000;

        if (oldState.x != this.x || oldState.y != this.y) return; //only change pos in eq

        if (
            this._cachedStats.timelimit &&
            this._cachedStats.timelimit.split(',')[1] &&
            this._cachedStats.timelimit.split(',')[1] > actualTs) {
            console.log('change timelimit item');
            self.changeOnNewItem(this);

        }
    };

    this.deleteCallback = function() {
        self.changeOnNewItem(this);
    };

    this.deleteAllCallback = (item) => {
        item.unregisterCallback('afterUpdate', self.afterUpdateCallback);
        item.unregisterCallback('delete', self.deleteCallback);
    };

    this.changeOnNewItem = (data) => {

        let lookForName = data.name;
        let lookForCl = data.cl;
        let $emptySlot = $("#bottomItem" + data.id).parent();
        let existTimeLimit = data._cachedStats.timelimit;
        let itemTimeLimit = []; // [ts, itemData]
        //let actualTs = ts() / 1000;

        if (existTimeLimit && existTimeLimit.split(',')[1]) {
            itemTimeLimit[0] = parseInt(existTimeLimit.split(',')[1])
            itemTimeLimit[1] = data;
        }

        self.deleteExistItem(data.id, data);
        let items = Engine.heroEquipment.getHItems();

        for (let id in items) {
            let i = items[id];
            if (lookForName != i.name) continue;
            if (lookForCl != i.cl) continue;
            if ($("#bottomItem" + i.id).length > 0) continue;

            if (data.id == i.id) continue; //after update case

            if (i.haveStat('custom_teleport')) {
                let customTeleport = i.getCustomTeleport();

                if (customTeleport != data.getCustomTeleport()) continue

            }


            if (existTimeLimit && i._cachedStats.timelimit) {

                let timeLimit = i._cachedStats.timelimit.split(',')[1];

                if (timeLimit) {
                    timeLimit = parseInt(timeLimit);
                    if (itemTimeLimit[0] > timeLimit) {
                        itemTimeLimit[0] = timeLimit;
                        itemTimeLimit[1] = i;
                    }
                } else {
                    self.newBottomItem(i, $emptySlot);
                    return;
                }
                continue;
            }

            self.newBottomItem(i, $emptySlot);
            return;
        }

        if (itemTimeLimit[1]) {
            console.log(itemTimeLimit[1].id);
            self.newBottomItem(itemTimeLimit[1], $emptySlot);
        }
    };

    this.deleteExistItem = function(id, data) {
        if (!Storage.get('bottomPanel/' + Engine.hero.d.id + '/' + id))
            return;
        Storage.remove('bottomPanel/' + Engine.hero.d.id + '/' + id);
        $("#bottomItem" + id).remove();
        // Engine.items.deleteViewIcon(id, 'bottom-item');
        Engine.items.deleteViewIconIfExist(id, Engine.itemsViewData.BOTTOM_ITEM_VIEW);
        self.deleteAllCallback(data);
    };

    this.isActiveDroppableWindow = () => Engine.mails || Engine.trade || Engine.depo || Engine.auctions || Engine.shop;

    this.doInterfaceItemAcion = function(key) {
        var item;
        var index = parseInt(key) - 1;
        var float = 'left';
        if (index > 3) {
            float = 'right';
            index = 7 - index;
        }
        //item = $('.slots.' + float).children().eq(index).children().data('item');
        item = Engine.interface.get$gameWindowPositioner().find('.slots.' + float).children().eq(index).children().data('item');

        if (item) this.afterUse(item);
    };

    this.afterUse = function(data) {
        // if (block || (this.isActiveDroppableWindow() && data.cl === 16)) return;
        if (block || (this.isActiveDroppableWindow() && ItemClass.isConsumeCl(data.cl))) return;
        var $div = Tpl.get('afterUseBottonItem');

        var $slot = $("#bottomItem" + data.id).parent();
        block = true;
        $div.addClass('afterUseBottonItem');
        $slot.append($div);

        if (Engine.heroEquipment.afterOneClick(data)) {
            self.afterUseCallback($div);
        } else {
            Engine.heroEquipment.sendUseRequest(data, function() {
                self.afterUseCallback($div);
            });
        }
    };

    this.afterUseCallback = function($div) {
        block = false;
        //if (Engine.opt(8)) $div.remove();
        if (!isSettingsOptionsInterfaceAnimationOn()) {
            $div.remove();
        } else {
            $div.fadeOut('slow', function() {
                $(this).remove();
            });
        }
    };

    function getTimelimitItems(name) {
        let items = Engine.heroEquipment.getHItems();
        let a = []
        for (let k in items) {
            if (items[k]._cachedStats.hasOwnProperty('timelimit') && items[k].name == name) a.push($('.item-id-' + items[k].id))
        }
        return a;
    }

};