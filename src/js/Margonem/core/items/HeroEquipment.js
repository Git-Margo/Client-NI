var Tpl = require('@core/Templates');
var ChestAnimation = require('@core/ChestAnimation');
var ItemData = require('@core/items/data/ItemData');
var ItemState = require('@core/items/ItemState');
var ItemClass = require('@core/items/ItemClass');
var ItemLocation = require('@core/items/ItemLocation');
var Input = require('@core/InputParser');
var TutorialData = require('@core/tutorial/TutorialData');
const InputMaskData = require('@core/InputMaskData');
module.exports = function() {
    let moduleData = {
        filName: "HeroEquipment.js"
    };
    var self = this;
    var activeBag = 20;
    var hItems = {}; // hero's items (eq + interveniory)
    var eqItems = {}; // hero's eq
    var slots = [];
    var countAbbyssCurrency = 0;
    var countChempionsCurrency = 0;
    var newItemsAmount = 0;

    var allDragDistance = 0;
    var startTs = null;
    var oldX = 0;
    var oldY = 0;

    let amountItems = {};
    let heroItemTpl = {};

    let itemOverBagTimeout = null

    let itemsInHeroEquipmentWasChange = false;

    var $inventory = null;
    var $character = null;
    var $bags = null;
    let freeSlots = 0;

    /**
     *  states (i.st):
     *  0=in bag,
     *  1=head,
     *  2=finger,
     *  3=necklace,
     *  4=gloves,
     *  5=main weapon,
     *  6=armour,
     *  7=helping weapon/shield/arrows,
     *  8=shoes
     *  10=blesses/curses
     */

    var eqDragOpts = {
        appendTo: 'body',
        helper: 'clone',
        cancel: '.disable-item-mark', // cancel: '.disable-item-mark' INSTEAD itemIsDisabled($view)
        //delay: 100,
        distance: 24,
        cursorAt: {
            top: 16,
            left: 16
        },
        //containment: $('body'),
        scroll: false,
        zIndex: 20,
        start: function(e, ui) {
            var $e = ui.helper;

            allDragDistance = 0;
            startTs = self.getTs();
            changeViewOfHelper(ui.helper, $(this).data().item.id);
            self.saveOldXAndY(e.offsetX, e.offsetY);

            $(this).addClass('when-item-is-clone-in-draggable')
            var $e = ui.helper;
            $e.css('background', 'none');
            $e.find('.highlight').css('background', 'none');
        },
        stop: function(e, ui) {
            $(this).removeClass('when-item-is-clone-in-draggable')
            startTs = null;
            self.clearItemOverBagTimeout();
        },
        drag: function(e) {
            let niInterface = getEngine().interface;
            let $popUpMenu = niInterface.getPopupMenu();

            if ($popUpMenu) {
                niInterface.removePopupMenu();
            }

            allDragDistance += Math.abs(oldX - e.offsetX) + Math.abs(oldY - e.offsetY);
            self.saveOldXAndY(e.offsetX, e.offsetY);
        }
    };

    const addToHeroItemTpl = (item) => {
        let tpl = item.tpl;

        if (!isset(heroItemTpl[tpl])) {
            heroItemTpl[tpl] = 0;
        }

        heroItemTpl[tpl]++;
    }

    const removeFromHeroItemTpl = (item) => {
        let tpl = item.tpl;

        heroItemTpl[tpl]--;

        if (heroItemTpl[tpl] == 0) {
            delete heroItemTpl[tpl];
        }
    }

    const addItemToAmountItems = (item, $icon) => {
        let name = item.getName();
        let id = item.getId();

        if (!checkExistAmountItem(name)) {
            amountItems[name] = {
                data: {},
                amount: 0
            };
        }

        let toAdd = 1;
        let amount = item.getAmount();

        if (amount) {
            toAdd = parseInt(amount);
        }

        let $highlight = $icon.find('.highlight');

        amountItems[name].amount += toAdd;

        if (amountItems[name].data[id]) return; // only change amount one item

        amountItems[name].data[id] = {
            item: item,
            $icon: $icon,
            $highlight: $highlight
        };
    };

    const updateItemToAmountItems = (item, oldStatsString) => {

        let oldStats = item.parseStats(oldStatsString);
        let oldAmount = oldStats.amount;
        let amount = item.getAmount();
        let name = item.getName();

        if (!isset(amount)) return;

        let diffAmount = amount - parseInt(oldAmount);
        if (diffAmount == 0) return;

        if (!isset(amountItems[name])) {
            errorReport(moduleData.filName, `itemName ${name} not exist!`, amountItems);
            return
        }

        amountItems[name].amount += diffAmount;
    };

    const removeItemFromAmountItems = (item) => {
        let name = item.getName();
        let id = item.getId();

        if (!checkExistAmountItem(name)) {
            errorReport(moduleData.fillName, "removeItemFromAmountItems", "item not exist!", amountItems);
            return
        }

        let toRemove = 1;
        let amount = item.getAmount();

        if (amount) {
            toRemove = parseInt(amount);
        }

        amountItems[name].amount -= toRemove;
        delete amountItems[name].data[id];

        if (amountItems[name].amount <= 0) {
            delete amountItems[name]
        }
    };

    const getAmountItemAmount = (name) => {
        if (!checkExistAmountItem(name)) return null;

        return amountItems[name].amount;
    };

    const getAmountItemData = (name) => {
        if (!checkExistAmountItem(name)) return null;

        return amountItems[name].data;
    };

    const getAmountItem$highlight = (name) => {
        if (!checkExistAmountItem(name)) return null;

        let a = [];
        let data = amountItems[name].data;

        for (let id in data) {
            let oneItem = data[id];
            a.push(oneItem.$highlight);
        }

        return a;
    };

    const getAmountItem$highlightById = (name, id) => {
        if (!checkExistAmountItem(name)) return null;

        let data = amountItems[name].data;

        if (!data[id]) return null;

        return data[id].$highlight;
    };

    const getHeroItemTpl = (tpl) => {
        return heroItemTpl[tpl] ? true : false;
    }

    const getAmountItemAll$highlights = () => {
        //if (!checkExistAmountItem(name)) return null;

        let a = [];
        for (let name in amountItems) {

            let data = amountItems[name].data;
            for (let id in data) {
                let oneItem = data[id];
                a.push(oneItem.$highlight);
            }
        }



        return a;
    };

    const checkExistAmountItem = (name) => {
        return isset(amountItems[name]);
    };

    this.canDraggableFix = function() {
        return mobileCheck() && allDragDistance < 10;
    };

    this.getTs = function() {
        return (new Date()).getTime();
    };

    this.saveOldXAndY = function(x, y) {
        oldX = x;
        oldY = y;
    };

    this.getCountAbbyssCurrency = function() {
        return countAbbyssCurrency;
    };

    this.getCountChempionsCurrency = function() {
        return countChempionsCurrency;
    };

    this.setItemsInHeroEquipmentWasChange = (state) => {
        itemsInHeroEquipmentWasChange = state;
    };

    this.newInventoryItems = function(i, finish) {
        if (notOwnItem(i.id, i)) return;

        self.setItemsInHeroEquipmentWasChange(true);

        let iconData = Engine.items.createViewIcon(i.id, Engine.itemsViewData.BAG_VIEW);
        let $icon = iconData[0];
        self.addHighlightNewItem(i, $icon);
        self.eqItemsTable(i);
        hItems[i.id] = i;
        $icon.addClass('inventory-item');
        $icon.draggable(eqDragOpts);

        self.changeLocation(i, $icon);
        self.addToBag(i);
        self.updateBagAmount();
        self.increaseAbbyssItemAmount(i);
        self.increaseChampionsItemAmount(i);
        addToHeroItemTpl(i);
        addItemToAmountItems(i, $icon);
        getEngine().quests.checkItemIsQuestItemAndAddHigllight(i.getName(), i.id);

        Engine.disableItemsManager.manageItemDisableInHeroEQ(i, iconData);
        Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 3);
        //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 3);
        Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 33);
        Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 3);
        //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 3);
        Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 33);
        Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 13);
        //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 13);


        Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 17, i);
        Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 19);
        //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 19);
        Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 20);
        //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 20);

        Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 4);
        //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 5);
        Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 10);
        Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 11);
        //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 11);
        Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 13);
        //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 13);
        Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 14);
        //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 14);
        //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 16);
        Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 16);
        Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 19);
        //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 19);
        Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 21);
        //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 21);
        Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 26);
        //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 26);
        //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 20);

        if (getAlreadyInitialised() && finish) Engine.itemsMarkManager.compareAllItems();

        i.on('afterUpdate', function(old, finish) {
            if (old.st != i.st || old.x != i.x || old.y != i.y) {
                self.setItemsInHeroEquipmentWasChange(true);
                self.changeLocation(this, $icon);
                self.bagManage(old, i);
            } else {
                if (finish) Engine.itemsMarkManager.compareAllItems();
                if (i.getNow) self.addHighlightNewItem(i, $icon, old);
            }

            i.updadeViewAfterUpdateItem($icon);
            self.updateBagAmount();

            updateItemToAmountItems(i, old.stat);

            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 3);
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 3);
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 33);
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 3);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 3);
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 33);
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 20);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 20);
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 4);
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 5);

        });

        i.on('delete', function() {
            // var name;
            // if (i.cl > 0 && i.cl < 4) name = 'weapon';
            // if (i.cl > 5 && i.cl < 8) name = 'magic';

            removeItemFromAmountItems(i);
            removeFromHeroItemTpl(i);

            let name = self.getEqItemsName(i.cl);

            if (name == null) name = i.cl;
            var eqI = eqItems[name];
            if (eqI && eqI == i) delete eqItems[name];

            delete hItems[i.id];

            if (getAlreadyInitialised()) Engine.itemsMarkManager.compareAllItems();

            self.setItemsInHeroEquipmentWasChange(true);
            self.checkQuestTrack();
            self.removeFromBag(i);
            self.updateBagAmount();
            self.rebuiltBagsState(i);
            self.removeBless(i);
            self.decreaseAbbyssItemAmount(i);
            self.decreaseChampionsItemAmount(i);
            self.manageDoubledClass();
        });
        self.checkQuestTrack();
    };

    this.initBeforeUpdateItems = () => {
        Engine.items.addToBeforeUpdateItemsCallback(Engine.itemsFetchData.NEW_INVENTORY_ITEM, () => {

            self.setItemsInHeroEquipmentWasChange(false);

        })
    };

    this.initAfterUpdateItems = () => {
        Engine.items.addToAfterUpdateItemsCallback(Engine.itemsFetchData.NEW_INVENTORY_ITEM, () => {

            if (!itemsInHeroEquipmentWasChange) return;
            this.manageDoubledClass();

        })
    };

    // this.checkBlessItem = function (i) {
    // 	return (i.cl === 25);
    // };

    //this.checkEqBlessItem = function (i) {
    //	return (i.st === 10);
    //};

    this.checkBlessEquipped = (i) => {
        // if (Engine.hero.d.is_blessed && this.checkBlessItem(i) && !ItemState.isBlessSt(i.st)) {
        if (Engine.hero.d.is_blessed && ItemClass.isBlessCl(i.cl) && !ItemState.isBlessSt(i.st)) {


            if (i.id == 'undefined') {
                console.trace();
                debugger;
            }

            mAlert(_t('change_exist_bless_question', null, 'item'), [{
                    txt: _t('yes'),
                    callback: function() {
                        _g('moveitem&st=1&id=' + i.id);
                        return true;
                    }
                },
                {
                    txt: _t('no'),
                    callback: function() {
                        return true;
                    }
                }
            ]);
            return true;
        }
        return false;
    };

    this.dropBless = (itemId) => {
        mAlert(_t('drop_bless_question', null, 'item'), [{
                txt: _t('yes'),
                callback: function() {
                    _g(`moveitem&id=${itemId}&st=-2`);
                    return true;
                }
            },
            {
                txt: _t('no'),
                callback: function() {
                    return true;
                }
            }
        ]);
    };

    this.removeBless = function(i) {
        if (!ItemClass.isBlessCl(i.cl) || !ItemState.isBlessSt(i.st)) return;

        message(_t('bless_end'));
        Engine.hero.removeBless();
    };

    this.checkAbbyssItem = function(i) {
        return /eterium/.test((i.name).toLowerCase());
    };

    this.decreaseAbbyssItemAmount = function(i) {
        if (!self.checkAbbyssItem(i)) return;
        var add = isset(i.parseStats().amount) ? parseInt(i.parseStats().amount) : 1;
        countAbbyssCurrency -= add;
    };

    this.increaseAbbyssItemAmount = function(i) {
        if (!self.checkAbbyssItem(i)) return;
        var add = isset(i.parseStats().amount) ? parseInt(i.parseStats().amount) : 1;
        countAbbyssCurrency += add;
    };

    this.checkChampionsItem = function(i) {
        return /y czempion/.test((i.name).toLowerCase());
    };

    this.decreaseChampionsItemAmount = function(i) {
        if (!self.checkChampionsItem(i)) return;
        var add = isset(i.parseStats().amount) ? parseInt(i.parseStats().amount) : 1;
        countChempionsCurrency -= add;
    };

    this.increaseChampionsItemAmount = function(i) {
        if (!self.checkChampionsItem(i)) return;
        var add = isset(i.parseStats().amount) ? parseInt(i.parseStats().amount) : 1;
        countChempionsCurrency += add;
    };

    this.rebuiltBagsState = function(i) {
        const isBag = ItemClass.isBagCl(i.cl) && ItemLocation.isEquipItemLoc(i.loc) && ItemState.isBagSlotSt(i.st);
        if (!isBag) return;

        // for issue when first create new bag and next old bag is deleted (change position)
        const currentBagSlot = i.st - 20;
        if (Engine.bags[currentBagSlot][2] === parseInt(i.id)) {
            const amountItems = Engine.items.getItemById(i.id) ? Engine.bags[currentBagSlot][1] : 0;
            Engine.bags[currentBagSlot] = [0, amountItems, 0];
        }
    };

    this.bagManage = function(oldI, newI) {
        var pos = this.itemChangeBag(oldI, newI);
        if (!pos) return;
        this.removeFromBag(oldI);
        this.addToBag(newI);
    };

    this.addToBag = function(i) {
        //if (i.st == 0) {
        if (ItemState.isInBagSt(i.st)) {
            var v = Math.floor(i.y / 6);
            Engine.bags[v][1]++;
        }
    };

    this.removeFromBag = function(i) {
        //if (i.st == 0 && !isset(i.returned)) {
        if (ItemState.isInBagSt(i.st) && !isset(i.returned)) {
            var v = Math.floor(i.y / 6);
            Engine.bags[v][1]--;
        }
    };

    this.itemChangeBag = function(oldI, newI) {
        var oldV = Math.floor(oldI.y / 6);
        var newV = Math.floor(newI.y / 6);
        return oldV != newV;
    };

    this.updateBagAmount = function() {
        let bags = Engine.bags,
            totalFreeSlots = 0;
        for (let i = 0; i < bags.length; i++) {
            let b = bags[i];
            if (!b) continue;
            let sub = b[0] - b[1],
                val = sub < 0 ? 0 : sub;
            if (i !== (bags.length - 1)) { // exclude bag for keys
                totalFreeSlots += val;
            }
            $bags.find("[data-bag=" + (i + 20) + "]").find('.amount').html(val);
        }
        freeSlots = totalFreeSlots;
        if (Engine.loots) {
            Engine.loots.updateFreeBagSlots();
        }

        if (getEngine().interface.getInterfaceLightMode()) {
            Engine.widgetManager.updateAmountOfEqColumnVisibleButton(totalFreeSlots);
        }

    };

    this.getFreeSlots = () => freeSlots;

    this.addHighlightNewItem = function(i, $icon, old) {
        const isInBag = ItemState.isInBagSt(i.st);
        const isGetNow = i.getNow;
        const alreadyHas = $icon.find('.highlight').find('.new-item').length > 0;
        //const increaseAmount = old && i.haveStat('amount') && Number(i.getAmount()) > Number(Engine.items.parseItemStat(old.stat)['amount'])
        const increaseAmount = old && i.issetAmountStat() && Number(i.getAmount()) > Number(Engine.items.parseItemStat(old.stat)[Engine.itemStatsData.amount])

        let condition = isInBag && isGetNow && !alreadyHas;
        if (old) condition = condition && increaseAmount;

        if (condition) {
            var $div = Tpl.get('new-item');
            $icon.find('.highlight').append($div);
            newItemsAmount++;
            self.updateAmountOnWidget();
            $icon.on("mouseenter", function() {
                $(this).unbind("mouseenter");
                $div.remove();
                newItemsAmount--;
                self.updateAmountOnWidget();
            });
        }
    };

    this.updateAmountOnWidget = () => {
        let amount = newItemsAmount ? newItemsAmount : '';
        Engine.widgetManager.widgets.updateAmount(Engine.widgetsData.name.EQ_TOGGLE, amount);
    };

    this.eqItemsTable = function(i) {
        //if (i.st == 0 || i.st == 9 || i.cl > 14 && i.cl != 25 && i.cl != 21) return; //i.cl != 25 blogo i.cl != 21 arrows
        // if (ItemState.isInBagSt(i.st) || ItemState.isPurseSt(i.st) || i.cl > 14 && i.cl != 25 && i.cl != 21) return;
        if (ItemState.isInBagSt(i.st) || ItemState.isPurseSt(i.st) || ItemClass.isNotEquipCl(i.cl)) return;

        // var name;
        // if (i.cl > 0 && i.cl < 4) name = 'weapon';
        // if (i.cl > 5 && i.cl < 8) name = 'magic';

        let name = self.getEqItemsName(i.cl);

        if (name == null) name = i.cl;
        eqItems[name] = i;
    };

    this.getEqItemsName = (cl) => {
        let name = null;

        if (ItemClass.isWeaponCl(cl)) name = 'weapon';
        if (ItemClass.isMagicWeaponCl(cl)) name = 'magic';

        return name;
    }

    this.checkItemCanEquip = function(i) {
        //let regp = i._cachedStats['reqp'];
        //let lvl = i._cachedStats['lvl'];
        let regp = i.getReqpStat();
        let lvl = i.getLvlStat();
        //return  i.st !== 0 || i.cl > 14
        // return  !ItemState.isInBagSt(i.st) || i.cl > 14
        // && i.cl != 21 //&& i.cl != 25

        return !ItemState.isInBagSt(i.st) ||
            ItemClass.isNotEquipClWithoutBlessCl(i.cl) ||
            lvl !== null && lvl > getHeroLevel() ||
            (regp !== null && regp.indexOf(Engine.hero.d.prof) < 0) ? false : true;
    };

    //this.getClassOfItemToComparation = function (i) {
    //	var classItem;
    //	if (i.cl > 0 && i.cl < 4) classItem = 'weapon';
    //	if (i.cl > 5 && i.cl < 8) classItem = 'magic';
    //	if (name == null) classItem = i.cl;
    //	return classItem;
    //};

    this.getEqItems = function() {
        return eqItems;
    };

    this.countItemsByName = function(name) {
        var temp = 0;
        for (var i in hItems)
            if (hItems[i].name == name) temp++;
        return temp;
    };

    this.changeLocation = function(i, $icon) {
        $icon.detach();
        $icon.unbind('click dblclick');
        $icon.css({
            top: '',
            left: ''
        });
        $icon.removeAttr('data-bag');

        //if (i.st && i.st < 11) { //equipped
        if (i.st && ItemState.isInBagOrInEquipNotBagsSlotsSt(i.st)) {
            $character.find('[data-st="' + i.st + '"]').append($icon);

            $icon.click(() => {
                this.afterOnClickEq(i, $icon);
            });

            $icon.bind('dblclick', function() {
                switch (i.st) {
                    //case 10: //bless
                    case ItemData.ST.BLESS: //bless
                        self.dropBless(i.id);
                        break;
                        //case 9: //sakwa
                    case ItemData.ST.PURSE:
                        console.log('sakwa dbclick');
                        self.afterDoubleClick(i, $icon);
                        break;
                    default:
                        _g('moveitem&findslot=1&st=0&id=' + i.id);
                }
            });

            //if (i.st != 9) {
            if (!ItemState.isPurseSt(i.st)) {
                if (itemIsDraggableNow($icon)) {
                    return;
                }

                $icon.bind('contextmenu', (function(e, mE) {
                    var callback;
                    //if (i.st != 10) {
                    if (!ItemState.isBlessSt(i.st)) {
                        callback = {
                            txt: _t('take off'),
                            f: function() {
                                _g('moveitem&findslot=1&st=0&id=' + i.id);
                            }
                        };
                    } else {
                        callback = {
                            txt: _t('take off'),
                            f: function() {
                                self.dropBless(i.id);
                            }
                        };
                    }
                    if (itemIsDisabled($icon)) return;
                    i.createOptionMenu(getE(e, mE), callback, {
                        move: true,
                        use: true
                    });
                }));
            } else { // sakwa

                $icon.bind('contextmenu', (function(e, mE) {
                    if (itemIsDraggableNow($icon)) {
                        return;
                    }

                    if (itemIsDisabled($icon)) return;
                    i.createOptionMenu(getE(e, mE));
                }));
            }
        } else if (ItemState.isBagSlotSt(i.st)) {
            var pos = i.st - 20 > 3 ? 3 : i.st - 20;
            $icon.attr('data-bag', i.st);
            $icon.css({
                left: (pos * 34 + pos) + 4,
                top: 4
            });
            $icon.appendTo($inventory.find('.bags-navigation'));

            $icon.bind('click', function(e) {
                e.stopPropagation();
                self.showBag(i.st);
            });

            $icon.bind('contextmenu', (function(e, mE) {

                if (itemIsDraggableNow($icon)) {
                    return;
                }

                var callback = {
                    txt: _t('change_state'),
                    f: function() {
                        self.showBag(i.st);
                    }
                };
                i.createOptionMenu(getE(e, mE), callback, {
                    move: true,
                    use: true
                });
            }));

            self.manageShowBagByItemOver(i, $icon);

            //if (i.st == 20) $icon.draggable('destroy');
            if (ItemState.isBag_0_SlotSt(i.st)) $icon.draggable('destroy');
            //var rememberedBag = Storage.get('player/bag', 0);
            var rememberedBag = 20 + Engine.hero.d.bag;
            if (rememberedBag == i.st) this.showBag(i.st, false);
        } else { //inventory
            $icon.css({
                top: i.y * 32 + i.y,
                left: i.x * 32 + i.x
            }).appendTo($inventory.find('.scroll-pane'));


            $icon.click(function(e) {
                self.afterOneClick(i, $icon);
            });

            $icon.bind('dblclick', function() {
                if (specificElementsExist()) return;
                self.afterDoubleClick(i, $icon);
            });

            $icon.off('contextmenu'); // #17388 prevent to fire context menu X times after each move item
            $icon.on('contextmenu', function(e, mE) {

                if (itemIsDraggableNow($icon)) {
                    return;
                }

                self.afterRightClick(i, e, mE, $icon);
            });

        }
    };

    const itemIsDraggableNow = ($icon) => {
        return $icon.hasClass('when-item-is-clone-in-draggable')
    }

    this.manageShowBagByItemOver = (i, $icon) => {
        //let stToOver  = [20, 21, 22, 26];
        let st = i.st;
        //if (!stToOver.includes(st)) return;

        if (!ItemState.isBagSlotSt(st)) return

        $icon.droppable({
            accept: '.item:not(.shop-item)',
            over: function() {
                self.manageClearOfItemOverBagTimeout(st);
                self.createItemOverBagTimeout(st);
            },
            out: function() {
                self.manageClearOfItemOverBagTimeout(st);
            }
        });

    };

    this.manageClearOfItemOverBagTimeout = (st) => {
        if (!itemOverBagTimeout) return;
        if (itemOverBagTimeout[1] != st) return;

        this.clearItemOverBagTimeout();
    };

    this.createItemOverBagTimeout = (st) => {
        let timeOut = setTimeout(function() {
            self.showBag(st);
            itemOverBagTimeout = null;
        }, 500);

        itemOverBagTimeout = [timeOut, st];
    };

    this.clearItemOverBagTimeout = () => {
        if (!itemOverBagTimeout) return;

        clearTimeout(itemOverBagTimeout[0]);
        itemOverBagTimeout = null;
    };

    this.manageDoubledClass = () => {

        let itemsOnFirstSlots = [];

        for (let k in hItems) {
            let item = hItems[k];
            let $icon = Engine.items.getViewByIdAndLoc(item.id, Engine.itemsViewData.BAG_VIEW);

            //if (item.st > 0) {
            if (ItemState.isEquippedSt(item.st)) continue;

            if (item.x == 0 && item.y == 0) itemsOnFirstSlots.push($icon);
            else {
                if ($icon.hasClass('doubled')) $icon.removeClass('doubled');
            }

        }

        if (itemsOnFirstSlots.length <= 1) {

            for (let kk in itemsOnFirstSlots) {
                let $icon = itemsOnFirstSlots[kk];
                if ($icon.hasClass('doubled')) $icon.removeClass('doubled');
            }

        } else {

            for (let kk in itemsOnFirstSlots) {
                let $icon = itemsOnFirstSlots[kk];
                if (!$icon.hasClass('doubled')) {
                    $icon.addClass('doubled');
                    if (parseInt(kk) === 0) mAlert(_t('doubled_items'));
                }
            }

        }

    };

    this.afterOnClickEq = function(i, $view) {
        if (!$view || itemIsDisabled($view)) return;
        if (Engine.crafting) {
            if (Engine.crafting.enhancement) {
                Engine.crafting.enhancement.onClickInventoryItem(i);
                return true;
            }
            if (Engine.crafting.socket_enchantment) {
                Engine.crafting.socket_enchantment.onClickInventoryItem(i);
                return true;
            }
            if (Engine.crafting.socket_extraction) {
                Engine.crafting.socket_extraction.onClickInventoryItem(i);
                return true;
            }
            if (Engine.crafting.socket_composition) {
                Engine.crafting.socket_composition.onClickInventoryItem(i);
                return true;
            }
        }

        return false;
    };

    this.afterOneClick = function(i, $view) {
        if (!$view || itemIsDisabled($view)) return;
        if (Engine.mails) {
            Engine.mails.setSendItem(i);
            return true;
        }
        if (Engine.trade) {
            Engine.trade.setSellItem(i);
            return true;
        }
        if (Engine.depo) {
            Engine.depo.setDepoItem(i);
            return true;
        }

        if (Engine.auctions) {
            Engine.auctions.putAuctionOffItem(i);
            return true;
        }
        if (Engine.shop) {
            Engine.shop.basket.sellItem(i);
            return true;
        }
        if (Engine.crafting) {
            if (Engine.crafting.salvage) {
                Engine.crafting.salvage.onClickInventoryItem(i);
                return true;
            }
            if (Engine.crafting.enhancement) {
                Engine.crafting.enhancement.onClickInventoryItem(i);
                return true;
            }
            if (Engine.crafting.extraction) {
                Engine.crafting.extraction.onClickInventoryItem(i);
                return true;
            }
            if (Engine.crafting.socket_enchantment) {
                Engine.crafting.socket_enchantment.onClickInventoryItem(i);
                return true;
            }
            if (Engine.crafting.socket_extraction) {
                Engine.crafting.socket_extraction.onClickInventoryItem(i);
                return true;
            }
            if (Engine.crafting.socket_composition) {
                Engine.crafting.socket_composition.onClickInventoryItem(i);
                return true;
            }
        }

        if (Engine.bonusReselectWindow) {
            Engine.bonusReselectWindow.onClickInventoryItem(i);
            return true;
        }

        return false;
    };

    this.afterRightClick = function(i, e, mE, $view) {
        if (itemIsDisabled($view)) return;
        i.createOptionMenu(getE(e, mE));
    };

    this.afterDoubleClick = function(i, $view) {
        if (itemIsDisabled($view)) return;
        if (self.soulboundAlert(i)) return;
        if (self.blockBadTutorialItem(i)) return;
        if (self.checkBlessEquipped(i)) return;
        self.sendUseRequest(i);
        self.checkQuestTrack();
    };

    this.canPreviewStatMenu = function(stats, i, e) {
        var m = [
            [_t('canpreview'), function() {
                _g('moveitem&st=2&id=' + i.id);
                Engine.tpls.deleteMessItemsByLoc('p');
                Engine.tpls.deleteMessItemsByLoc('s');
            }],
            [_t('take_reward', null, 'matchmaking'), function() {
                self.sendUseRequest(i);
            }]
        ];
        Engine.interface.showPopupMenu(m, e);
    };

    this.sendUseRequest = function(i, callback) {
        if (i.id == 'undefined') {
            console.trace();
            debugger;
        }
        console.log('this.sendUseRequest', i.id, i.tpl);
        _g('moveitem&st=1&id=' + i.id, function(data) {
            if (callback) callback();
            if (isset(data['alert'])) return;
            if (isset(data['t'])) Engine.interface.checkTeleport(data);


            // var stats = i._cachedStats;
            API.callEvent(Engine.apiData.ITEM_USED, i);
            // if (stats.animation) {
            if (i.getAnimationStat()) {
                if (!Engine.chestAnimation) {
                    Engine.chestAnimation = new ChestAnimation();
                    Engine.chestAnimation.init();
                }
            }
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 11, i);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 11, i);
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 14, i);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 14, i);
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 16, i);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 16, i);
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 21, i);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 21, i);
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 22, i);
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 22, i);

            //Engine.tutorialManager.checkCanFinishExternalAndFinish({name: TutorialData.ON_FINISH_REQUIRE.USE_ITEM_TPL, [TutorialData.ON_FINISH_REQUIRE.USE_ITEM_TPL]: i.tpl})
            self.callCheckCanFinishExternalTutorial(i.tpl);

        });
    };

    this.callCheckCanFinishExternalTutorial = (tplId) => {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_REQUIRE.USE_ITEM_TPL,
            TutorialData.ON_FINISH_TYPE.REQUIRE,
            tplId
        );

        //Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger)
        Engine.rajController.parseObject(tutorialDataTrigger);
    };

    this.createChest = function() {
        Engine.chestAnimation = new ChestAnimation()
    };

    this.showBag = function(idx, animation) {
        animation = !isset(animation) ? true : animation;
        var $inventory = Engine.interface.get$interfaceLayer().find('.inventory_wrapper');
        var $bag = $inventory.find('[data-bag="' + idx + '"]');

        if (!$bag.length) return
        if (activeBag != idx) _p("bag=" + (idx - 20));
        activeBag = idx;

        $inventory.find('.bags-navigation .item').removeClass('active');
        $bag.addClass('active');
        $inventory.find('.scroll-pane').css({
            top: -(idx - 20) * 198
        }, animation ? 300 : 0);

    };

    this.getActiveBag = () => {
        return activeBag;
    }

    this.init = function() {
        //let $gWP = Engine.interface.get$gameWindowPositioner();
        let $rightMainColumnWrapper = Engine.interface.getRightMainColumnWrapper();

        $character = $rightMainColumnWrapper.find('.character_wrapper');
        $inventory = $rightMainColumnWrapper.find('.inventory_wrapper');
        $bags = $rightMainColumnWrapper.find('.bags-navigation');

        this.initBeforeUpdateItems();
        this.initAfterUpdateItems();

        Engine.items.fetch(Engine.itemsFetchData.NEW_INVENTORY_ITEM, self.newInventoryItems);
        $character.find('.equipment-wrapper').droppable({
            accept: '.item:not(.shop-item)',
            drop: function(e, ui) {
                var item = ui.draggable.data('item');
                // if (Engine.dead && !isset(item._cachedStats.revive)) return;
                if (Engine.dead && !item.issetReviveStat()) {
                    return;
                }

                var left = ui.offset.left - $(this).offset().left;
                var top = ui.offset.top - $(this).offset().top;

                var xPass = -11 < left && left < 18;
                var yPass = 88 < top && top < 116;

                if (xPass && yPass) { //sakwa st=9
                    if (getHeroLevel() < 25) {
                        message(_t('need__lvl', {
                            '%val%': 25
                        }));
                    } else {
                        const defaultRequest = 'moveitem&st=9&id=' + item.id;
                        const itemInPurse = Engine.heroEquipment.getItemBySt(ItemData.ST.PURSE);
                        if ((ItemState.isEquippedSt(item.st) && !ItemState.isPurseSt(item.st)) && itemInPurse) {
                            if (self.soulboundAlert(itemInPurse, defaultRequest)) return;
                        }
                        _g(defaultRequest);
                    }
                } else {
                    if (self.soulboundAlert(item)) return;
                    if (self.blockBadTutorialItem(item)) return;
                    if (self.checkBlessEquipped(item)) return;
                    //self.itemAnimationOpen(item);
                    self.sendUseRequest(item);
                }
            }
        });

        $inventory.find('.inventory-grid').droppable({
            accept: '.item:not(.shop-item)',
            drop: function(e, ui) {
                const maxX = 6;
                const minY = 0;
                const item = ui.draggable.data('item');

                if (ui.draggable.hasClass('bottomItem')) {
                    Engine.interfaceItems.deleteExistItem(item.id, item);
                    return;
                }

                var gridOffset = $(this).offset();
                var dy = Math.floor((ui.offset.top - gridOffset.top + ui.draggable.height() * Engine.zoomFactor / 2) / 33 / Engine.zoomFactor) + (activeBag - 20) * maxX;
                var dx = Math.floor((ui.offset.left - gridOffset.left + ui.draggable.width() * Engine.zoomFactor / 2) / 33 / Engine.zoomFactor);
                const itemInSlot = self.getItemBySlotCords(dx, dy);

                if (dx > maxX) {
                    dx = maxX;
                }
                if (dy < minY) {
                    dy = minY;
                }

                const defaultRequest = 'moveitem&st=0&id=' + item.id + '&x=' + dx + '&y=' + dy;

                // if (item.stat.match(/amount/) && e.shiftKey) {
                if (item.issetAmountStat() && e.shiftKey) {
                    let findSlot = !!itemInSlot;
                    self.splitItem(item, dx, dy, findSlot);
                    return;
                }

                if (itemInSlot) {
                    let $view = Engine.items.getAllViewsByIdAndViewName(itemInSlot.id, Engine.itemsViewData.BAG_VIEW)[0];
                    if (itemIsDisabled($view)) return;
                    if (ItemLocation.isEquipItemLoc(item.loc) && ItemLocation.isEquipItemLoc(itemInSlot.loc) && item.id !== itemInSlot.id) {
                        if (self.checkBonusReselect(item, itemInSlot, dx, dy)) return;
                        if (self.checkEnhancementAdd(item, itemInSlot, dx, dy)) return;
                    }
                    if ((ItemState.isEquippedSt(item.st) && !ItemState.isPurseSt(item.st)) && ItemLocation.isEquipItemLoc(itemInSlot.loc)) {
                        if (self.soulboundAlert(itemInSlot, defaultRequest)) return;
                    }
                }

                if (ItemLocation.isPrivateDepoItemLoc(item.loc)) {
                    _g('depo&get=' + item.id + '&x=' + dx + '&y=' + dy);
                    return;
                }

                if (ItemLocation.isClanDepoItemLoc(item.loc)) {
                    _g('clan&a=depo&op=item_get&id=' + item.id + '&x=' + dx + '&y=' + dy);
                    return;
                }

                _g(defaultRequest);
            }
        });

        $inventory.find('.bags-navigation').droppable({
            accept: '.item:not(.shop-item)',
            drop: function(e, ui) {

                var item = ui.draggable.data('item');
                var gridOffset = $(this).offset();
                var dx = Math.floor((ui.offset.left + ui.draggable.height() * Engine.zoomFactor / 2 - gridOffset.left) / 33 / Engine.zoomFactor);

                if (dx >= 0 && dx < 4) {
                    dx = dx == 3 ? 6 : dx; // exception for key bags
                    // if (isset(item._cachedStats['bag']) && (item.st < 20 || item.st > 26) &&
                    // 	!(isset(item._cachedStats['soulbound']) || isset(item._cachedStats['permbound']))) {
                    // 	mAlert(_t('bag_drop_infotxt', null, 'item'), [
                    // 		{
                    // 			txt: _t('yes'),
                    // 			callback: function () {
                    // 				_g('moveitem&id=' + item.id + '&st=' + (20 + dx) + '&put=1');
                    // 				return true;
                    // 			}
                    // 		},
                    // 		{
                    // 			txt: _t('no'),
                    // 			callback: function () {
                    // 				_g('moveitem&id=' + item.id + '&st=' + (20 + dx) + '&put=2');
                    // 				return true;
                    // 			}
                    // 		}
                    // 	]);
                    // } else _g('moveitem&id=' + item.id + '&st=' + (20 + dx));


                    let bagIsset = item.issetBagStat();
                    let soulboundIsset = item.issetSoulboundStat();
                    let permboundIsset = item.issetPermboundStat();
                    let setBagInSlotAlert = bagIsset && (item.st < 20 || item.st > 26) && !(soulboundIsset || permboundIsset);

                    if (setBagInSlotAlert) {
                        mAlert(_t('bag_drop_infotxt', null, 'item'), [{
                                txt: _t('yes'),
                                callback: function() {
                                    _g('moveitem&id=' + item.id + '&st=' + (20 + dx) + '&put=1');
                                    return true;
                                }
                            },
                            {
                                txt: _t('no'),
                                callback: function() {
                                    _g('moveitem&id=' + item.id + '&st=' + (20 + dx) + '&put=2');
                                    return true;
                                }
                            }
                        ]);
                    } else {
                        _g('moveitem&id=' + item.id + '&st=' + (20 + dx));
                    }


                }
            }
        });
    };

    this.checkBonusReselect = (item, itemInSlot, dx, dy) => {
        // if (
        // 		isset(item._cachedStats.bonus_reselect) &&
        // 		isset(itemInSlot._cachedStats.bonus)
        // ) {
        if (item.issetBonus_reselectStat() && itemInSlot.issetBonusStat()) {
            this.movedOnItemConfirm(_t('bonus_reselect_confirm', {
                '%val%': itemInSlot.name
            }), item.id, dx, dy)
            return true;
        }
        return false;
    }

    this.checkEnhancementAdd = (item, itemInSlot, dx, dy) => {
        // if (
        // 		(isset(item._cachedStats.enhancement_add) || isset(item._cachedStats.enhancement_add_point)) &&
        // 		itemInSlot.cl >= 1 && itemInSlot.cl <= 14
        // ) {
        // if ((isset(item._cachedStats.enhancement_add) || isset(item._cachedStats.enhancement_add_point)) && ItemClass.isEquipCl(itemInSlot.cl)) {
        // 	this.movedOnItemConfirm(_t('enhancement_add_confirm'), item.id, dx, dy)
        // 	return true;
        // }

        let result = (item.issetEnhancement_addStat() || item.issetEnhancement_add_pointStat()) && ItemClass.isEquipCl(itemInSlot.cl);

        if (result) {
            this.movedOnItemConfirm(_t('enhancement_add_confirm'), item.id, dx, dy)
            return true;
        }
        return false;
    }

    this.movedOnItemConfirm = (msg, itemId, dx, dy) => {
        mAlert(msg, [{
                txt: _t('yes'),
                callback: function() {
                    _g('moveitem&st=0&id=' + itemId + '&x=' + dx + '&y=' + dy);
                    return true;
                }
            },
            {
                txt: _t('no'),
                callback: function() {
                    return true;
                }
            }
        ]);
    }

    this.getItemBySlotCords = (x, y) => {
        for (let k in hItems) {
            let item = hItems[k];
            //if (item.st > 0) continue;
            if (ItemState.isEquippedSt(item.st)) continue;
            if (item.x == x && item.y == y) return item;
        }
        return false;
    };

    this.getItemBySt = (st) => {
        for (let k in hItems) {
            let item = hItems[k];
            if (!ItemState.isEquippedSt(item.st)) continue;
            if (item.st === st) return item;
        }
        return false;
    }

    this.blockBadTutorialItem = (itemData) => {
        if (!Engine.tutorials) return false;

        let needItems = Engine.tutorialManager.getTutorialNeedItems();

        if (!needItems) return false;

        let isRightItem = Engine.tutorialManager.checkUseItemIsRightWithTutorialItemsNeed(itemData);

        if (isRightItem) return false;
        else {
            message(_t('use_tutorial_item'));
            return true;
        }
    };

    this.soulboundAlert = function(item, request = null) {
        var stats = item.parseStats();
        if (isset(stats['binds'])) {
            if (isset(stats['reqp']) && stats['reqp'].indexOf(Engine.hero.d.prof) < 0) {
                mAlert(_t('bad_prof_to_use_item'));
                return true;
            }
            if (isset(stats['lvl']) && stats['lvl'] > getHeroLevel()) {
                mAlert(_t('low_level_to_use_item'));
                return true;
            }
            var str = _t('sure_soulbound', null, 'item');
            mAlert(str, [{
                txt: _t('yes'),
                callback: function() {

                    if (item.id == 'undefined') {
                        console.trace();
                        debugger;
                    }

                    request = request ? request : 'moveitem&st=1&id=' + item.id;
                    _g(request);
                    return true;
                }
            }, {
                txt: _t('no'),
                callback: function() {
                    return true;
                }
            }]);
            return true;
        }
        return false;
    };

    this.splitItem = function(item, dx, dy, findSlot = false) {
        var t = [
            _t('quest_item_cant_split', null, 'item'),
            _t('this_item_cant_split', null, 'item'),
            _t('this_item_cant_split', null, 'item'),
            _t('split_bad_value', null, 'item')
        ];

        // var stats = Engine.items.parseItemStat(item.stat);
        // var am = stats.amount;
        let parseAmountStat = parseInt(item.getAmountStat());
        let req;
        // if (am > 1) {
        if (item.issetAmountStat() && parseAmountStat > 1) {
            // if (stats.cansplit == 0) return mAlert(t[1]);
            if (parseInt(item.getCansplitStat()) == 0) {
                return mAlert(t[1]);
            }
            // if (stats.quest) return mAlert(t[0]);
            // if (stats.upgraded) return mAlert(t[1]);
            // if (!(stats.capacity || item.cl == 21)) return mAlert(t[1]);
            // if (!(stats.capacity || ItemClass.isArrowsCl(item.cl))) return mAlert(t[1]);
            if (!(item.getCapacityStat() || ItemClass.isArrowsCl(item.cl))) {
                return mAlert(t[1]);
            }

            if (!findSlot) {
                req = 'moveitem&st=0&id=' + item.id + '&x=' + dx + '&y=' + dy + '&split=';
            } else {
                req = 'moveitem&findslot=1&st=0&id=' + item.id + '&x=' + dx + '&y=' + dy + '&split=';
            }
            this.alertWindow(parseAmountStat, req);
        }
    };

    this.alertWindow = function(max, re) {
        var t = [
            _t('item_split %max%', {
                '%max%': (max - 1)
            }, 'item'),
            _t('cancel', null, 'buttons'),
            '<div class="input-wrapper"><input id="divide-items" class="default" placeholder="..." /></div>'
        ];
        var $i;
        mAlert(t[0] + t[2], [{
            txt: 'Ok',
            callback: function() {
                let v = parsePrice(removeSpaces($i.val()));
                if (checkInputValIsEmptyProcedure(v)) return false;

                self.checkValue(v, max, re);

                return true;
            }
        }, {
            txt: t[1],
            callback: function() {
                return true;
            }
        }], function(w) {
            $i = w.$.find('.default');
            w.$.addClass('askAlert');
            // setOnlyPositiveNumberInInput(w.$.find('input'));
            setInputMask(w.$.find('input'), InputMaskData.TYPE.NUMBER_WITH_KMG)
        });
        if (!mobileCheck()) $('#divide-items').focus();
    };

    this.checkValue = function(v, max, re) {
        var str = _t('split_bad_value', null, 'item');
        if (isNaN(v) || parseInt(v) >= parseInt(max)) mAlert(str);
        else _g(re + v);
    };

    this.checkQuestTrack = function() {
        //if (Engine.questTrack)
        //	Engine.questTrack.isCollect();
    };

    this.getHItems = function() {
        return hItems;
    };

    const setClassInItemsHighlightIfExist = (itemName, cl) => {
        let a = getAmountItem$highlight(itemName);
        if (!a) {
            return;
        }

        setClassInItemsHighlight(a, cl);
    };

    const unsetClassInItemsHighlightIfExist = (itemName, cl) => {
        let a = getAmountItem$highlight(itemName);
        if (!a) {
            return;
        }

        unsetClassInItemsHighlight(a, cl);
    };

    const setClassInItemsHighlight = ($highlightsArray, cl) => {
        if (!$highlightsArray) return

        for (let i = 0; i < $highlightsArray.length; i++) {
            let $highlight = $highlightsArray[i];
            if (!$highlight.hasClass(cl)) $highlight.addClass(cl);
        }
    }

    const unsetClassInItemsHighlight = ($highlightsArray, cl) => {
        if (!$highlightsArray) return

        for (let i = 0; i < $highlightsArray.length; i++) {
            let $highlight = $highlightsArray[i];
            if ($highlight.hasClass(cl)) $highlight.removeClass(cl);
        }
    }

    const clearHighlightInItems = (cl) => {
        let $allHighlights = getAmountItemAll$highlights();
        //for (let k in all$highlights) {
        //	if (all$highlights[k].hasClass(cl)) all$highlights[k].removeClass(cl);
        //}

        unsetClassInItemsHighlight($allHighlights, cl)
    };

    //this.getInvItems = () => {
    //	const result = {};
    //	for (let key in hItems) {
    //		if (parseInt(hItems[key].st) === 0) {
    //			result[key] = hItems[key];
    //		}
    //	}
    //	return result;
    //}

    this.moveToDepoItems = () => {
        let a = [];

        for (let k in hItems) {
            a.push(hItems[k]);
        }

        const intervalMoveToDepo = (i, item) => {
            setTimeout(function() {
                Engine.depo.setDepoItem(item)
            }, i * 500)
        }

        for (let i = 0; i < a.length; i++) {
            intervalMoveToDepo(i, a[i]);
        }
    }

    this.setClassInItemsHighlightIfExist = setClassInItemsHighlightIfExist;
    this.unsetClassInItemsHighlightIfExist = unsetClassInItemsHighlightIfExist;
    this.setClassInItemsHighlight = setClassInItemsHighlight;
    this.clearHighlightInItems = clearHighlightInItems;
    this.getAmountItemAmount = getAmountItemAmount;
    this.getAmountItemData = getAmountItemData;
    this.getAmountItem$highlight = getAmountItem$highlight;
    this.getAmountItem$highlightById = getAmountItem$highlightById;
    this.getHeroItemTpl = getHeroItemTpl;
    this.getAmountItemAll$highlights = getAmountItemAll$highlights;

};