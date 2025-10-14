let ItemState = require('@core/items/ItemState');
let ItemData = require('@core/items/data/ItemData');

module.exports = function() {

    // this.allKinds = ['mail', 'shop', 'barter', 'depo', 'depoClan', 'auction', 'salvage', 'enhance', 'enhance-ingr', 'extraction', 'bonus-reselect'];

    this.allKinds = [];

    this.allDisableItemStats = null;
    this.allDisableItemClass = null;
    this.allAllowItemClass = null;
    this.allEnableTpl = null;
    this.disableExpiresStat = null;
    this.disableEq = null;
    this.disabledItems = {};

    this.activeDisableKinds = {};

    this.init = () => {
        this.prepareAllKinds();
        this.initAllDisableKinds()
    };

    this.prepareAllKinds = () => {
        let itemsDisableData = Engine.itemsDisableData;
        for (let k in itemsDisableData) {
            this.allKinds.push(itemsDisableData[k]);
        }
    }

    this.testExpires = () => {
        for (let k in this.allDisableItemStats) {
            let oneDisableKind = this.allDisableItemStats[k];

            if (oneDisableKind.includes('expires')) {
                console.error('[DisableItemsManager.js, testExpires] Stat expires is forbidden');
                return;
            }

        }
    };

    this.testKinds = (obj) => {
        for (let i = 0; i < this.allKinds.length; i++) {
            let kind = this.allKinds[i];
            if (!obj.hasOwnProperty(kind)) {
                console.error("[DisableItemsManager.js, testKinds] Has not property:", kind, obj);
                console.trace();
                return;
            }
        }
    };

    this.initAllDisableKinds = () => {

        let itemsDisableData = Engine.itemsDisableData;

        this.allDisableItemStats = { // for disable items with below stats
            [itemsDisableData.MAIL]: ['permbound', 'soulbound'],
            [itemsDisableData.SHOP]: [],
            [itemsDisableData.BARTER]: [],
            [itemsDisableData.DEPO]: ['nodepo'],
            [itemsDisableData.DEPO_CLAN]: ['nodepoclan', 'permbound', 'soulbound'],
            [itemsDisableData.AUCTION]: ['noauction', 'permbound'],
            [itemsDisableData.SALVAGE]: ['cursed', 'artisan_worthless', {
                'lvl': ['<', 20]
            }],
            [itemsDisableData.ENHANCE]: ['cursed', {
                'lvl': ['<', 20]
            }],
            [itemsDisableData.ENHANCE_INGR]: ['cursed', 'artisan_worthless', {
                'lvl': ['<', 20]
            }],
            [itemsDisableData.EXTRACTION]: [],
            [itemsDisableData.SOCKET_ENCHANTMENT_SOURCE]: [{
                'socket_content': ['>', 0]
            }],
            [itemsDisableData.SOCKET_ENCHANTMENT_ENHANCER]: [],
            [itemsDisableData.SOCKET_EXTRACTION]: [{
                'socket_content': ['==', 0]
            }],
            [itemsDisableData.SOCKET_COMPOSITION]: [],
            [itemsDisableData.BONUS_RESELECT]: []
        };

        this.allAllowItemStats = { // for disable all items exclude with below stats
            [itemsDisableData.MAIL]: [],
            [itemsDisableData.SHOP]: [],
            [itemsDisableData.BARTER]: [],
            [itemsDisableData.DEPO]: [],
            [itemsDisableData.DEPO_CLAN]: [],
            [itemsDisableData.AUCTION]: [],
            [itemsDisableData.SALVAGE]: [],
            [itemsDisableData.ENHANCE]: [],
            [itemsDisableData.ENHANCE_INGR]: [],
            [itemsDisableData.EXTRACTION]: ['enhancement_upgrade_lvl'],
            [itemsDisableData.SOCKET_ENCHANTMENT_SOURCE]: [],
            [itemsDisableData.SOCKET_ENCHANTMENT_ENHANCER]: ['socket_enhancer'],
            [itemsDisableData.SOCKET_EXTRACTION]: [],
            [itemsDisableData.SOCKET_COMPOSITION]: ['socket_component'],
            [itemsDisableData.BONUS_RESELECT]: ['bonus']
        };

        this.allDisableItemClass = { // for disable items with below classes
            [itemsDisableData.MAIL]: [],
            // [itemsDisableData.SHOP]    			: [17, 19, 25, 26, 27],
            [itemsDisableData.SHOP]: [ItemData.CL.GOLD, ItemData.CL.QUEST, ItemData.CL.BLESS, ItemData.CL.UPGRADE, ItemData.CL.RECIPE, ItemData.CL.COINAGE],
            [itemsDisableData.BARTER]: [],
            [itemsDisableData.DEPO]: [],
            [itemsDisableData.DEPO_CLAN]: [],
            // [itemsDisableData.AUCTION]			: [17, 18, 19, 25, 26],
            [itemsDisableData.AUCTION]: [ItemData.CL.GOLD, ItemData.CL.QUEST, ItemData.CL.BLESS, ItemData.CL.UPGRADE, ItemData.CL.RECIPE, ItemData.CL.KEYS],
            [itemsDisableData.SALVAGE]: [],
            [itemsDisableData.ENHANCE]: [],
            [itemsDisableData.ENHANCE_INGR]: [],
            [itemsDisableData.EXTRACTION]: [],
            [itemsDisableData.SOCKET_ENCHANTMENT_SOURCE]: [],
            [itemsDisableData.SOCKET_ENCHANTMENT_ENHANCER]: [],
            [itemsDisableData.SOCKET_EXTRACTION]: [],
            [itemsDisableData.SOCKET_COMPOSITION]: [],
            [itemsDisableData.BONUS_RESELECT]: []
        };

        this.allAllowItemClass = { // for disable all items exclude with below classes
            [itemsDisableData.MAIL]: [],
            [itemsDisableData.SHOP]: [],
            [itemsDisableData.BARTER]: [],
            [itemsDisableData.DEPO]: [],
            [itemsDisableData.DEPO_CLAN]: [],
            [itemsDisableData.AUCTION]: [],
            [itemsDisableData.SALVAGE]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 29],
            [itemsDisableData.ENHANCE]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 29],
            [itemsDisableData.ENHANCE_INGR]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 29],
            [itemsDisableData.EXTRACTION]: [],
            [itemsDisableData.SOCKET_ENCHANTMENT_SOURCE]: [],
            [itemsDisableData.SOCKET_ENCHANTMENT_ENHANCER]: [],
            [itemsDisableData.SOCKET_EXTRACTION]: [],
            [itemsDisableData.SOCKET_COMPOSITION]: [],
            [itemsDisableData.BONUS_RESELECT]: []
        };

        this.allEnableTpl = {
            [itemsDisableData.MAIL]: null, // if null --> all item names are enable
            [itemsDisableData.SHOP]: null, // If [4234, 4234] --> only enable tpl: 4234, 4234
            [itemsDisableData.BARTER]: null, // This array is add dynamically --> this.startSpecificItemKindDisable as option
            [itemsDisableData.DEPO]: null,
            [itemsDisableData.DEPO_CLAN]: null,
            [itemsDisableData.AUCTION]: null,
            [itemsDisableData.SALVAGE]: null,
            [itemsDisableData.ENHANCE]: null,
            [itemsDisableData.ENHANCE_INGR]: null,
            [itemsDisableData.EXTRACTION]: null,
            [itemsDisableData.SOCKET_ENCHANTMENT_SOURCE]: null,
            [itemsDisableData.SOCKET_ENCHANTMENT_ENHANCER]: null,
            [itemsDisableData.SOCKET_EXTRACTION]: null,
            [itemsDisableData.SOCKET_COMPOSITION]: null,
            [itemsDisableData.BONUS_RESELECT]: null
        };

        this.enableLinkedConditions = {
            [itemsDisableData.MAIL]: null,
            [itemsDisableData.SHOP]: null,
            [itemsDisableData.BARTER]: null,
            [itemsDisableData.DEPO]: null,
            [itemsDisableData.DEPO_CLAN]: null,
            [itemsDisableData.AUCTION]: null,
            [itemsDisableData.SALVAGE]: null,
            [itemsDisableData.ENHANCE]: null,
            [itemsDisableData.ENHANCE_INGR]: null, // This array is add dynamically --> this.startSpecificItemKindDisable as option
            [itemsDisableData.EXTRACTION]: null,
            [itemsDisableData.SOCKET_ENCHANTMENT_SOURCE]: null,
            [itemsDisableData.SOCKET_ENCHANTMENT_ENHANCER]: null,
            [itemsDisableData.SOCKET_EXTRACTION]: null,
            [itemsDisableData.SOCKET_COMPOSITION]: null,
            [itemsDisableData.BONUS_RESELECT]: null
        };

        // if stat expires EXIST in item

        // option:

        // expires true  => disabled expires items,
        // expires false => disabled not expires items,
        // expires null  => ignore expires, and not expires items

        this.disableExpiresStat = {
            [itemsDisableData.MAIL]: null,
            [itemsDisableData.SHOP]: null,
            [itemsDisableData.BARTER]: true,
            [itemsDisableData.DEPO]: null,
            [itemsDisableData.DEPO_CLAN]: null,
            [itemsDisableData.AUCTION]: null,
            [itemsDisableData.SALVAGE]: 'all',
            [itemsDisableData.ENHANCE]: 'all',
            [itemsDisableData.ENHANCE_INGR]: 'all',
            [itemsDisableData.EXTRACTION]: null,
            [itemsDisableData.SOCKET_ENCHANTMENT_SOURCE]: null,
            [itemsDisableData.SOCKET_ENCHANTMENT_ENHANCER]: null,
            [itemsDisableData.SOCKET_EXTRACTION]: null,
            [itemsDisableData.SOCKET_COMPOSITION]: null,
            [itemsDisableData.BONUS_RESELECT]: null
        };

        this.disableEq = {
            [itemsDisableData.MAIL]: false,
            [itemsDisableData.SHOP]: false,
            [itemsDisableData.BARTER]: false,
            [itemsDisableData.DEPO]: false,
            [itemsDisableData.DEPO_CLAN]: false,
            [itemsDisableData.AUCTION]: false,
            [itemsDisableData.SALVAGE]: true,
            [itemsDisableData.ENHANCE]: false,
            [itemsDisableData.ENHANCE_INGR]: true,
            [itemsDisableData.EXTRACTION]: true,
            [itemsDisableData.SOCKET_ENCHANTMENT_SOURCE]: false,
            [itemsDisableData.SOCKET_ENCHANTMENT_ENHANCER]: true,
            [itemsDisableData.SOCKET_EXTRACTION]: false,
            [itemsDisableData.SOCKET_COMPOSITION]: false,
            [itemsDisableData.BONUS_RESELECT]: true
        };

        // this.testKinds(this.allDisableItemStats);
        this.testKinds(this.allAllowItemStats);
        // this.testKinds(this.allDisableItemClass);
        this.testKinds(this.allAllowItemClass);
        this.testKinds(this.allEnableTpl);
        this.testKinds(this.disableExpiresStat);
        this.testKinds(this.disableEq);
        this.testExpires();
    };

    this.addToActiveDisableKinds = (disableKind) => {
        this.activeDisableKinds[disableKind] = true;
    };

    this.removeFromActiveDisableKinds = (disableKind) => {
        delete this.activeDisableKinds[disableKind];
    };

    this.removeFromDisableItems = (disableKind) => {
        delete this.disabledItems[disableKind]
    };

    this.addDisableClassToItem = ($item, kind) => {
        const itemId = parseInt($item.data().item.id);

        if (!this.disabledItems[kind]) this.disabledItems[kind] = [];

        if (!this.disabledItems[kind].includes(itemId)) this.disabledItems[kind].push(itemId);

        $item.addClass(kind + '-disable disable-item-mark');
        this.addDisableIcon($item);
    };

    this.getAllDisabledItemsArray = () => {
        let a = []
        for (let kind in this.disabledItems) {
            let oneKindArray = this.disabledItems[kind];
            for (let i in oneKindArray) {
                a.push(oneKindArray[i]);
            }
        }

        return a;
    };

    this.addDisableIcon = ($item) => {
        if ($item.find('.choose-icon').length) return; // don't disable item if is checked now

        let cl = 'disable-icon';
        let $disableIcon = $item.find(`.${cl}`);

        if (!$disableIcon.length) {
            let $icon = $('<div>').addClass(cl);
            $item.append($icon);
        }
    };

    this.removeDisableIcon = ($item) => {
        $item.find('.disable-icon').remove();
    };

    this.prepareClassToDisable = (purchase) => {
        let canBuy = purchase.split(',');
        let classToDisable = Array.from(new Array(32), (x, index) => index + 1);

        while (canBuy.length) {
            let val = parseInt(canBuy[0]);
            let index = classToDisable.indexOf(val);

            if (index > -1) classToDisable.splice(index, 1);

            canBuy.splice(0, 1);

        }

        return classToDisable;
    };

    this.isPremiumShop = () => {
        return Engine.shop && Engine.shop.getPremiumShop();
    };

    this.isOnlyBuyShop = () => {
        return Engine.shop && Engine.shop.isOnlyBuyShop();
    };

    this.checkShopItemShouldBeDisable = (item) => {
        let purchase = Engine.shop.getPurchase();

        if (purchase == '*') return false;
        else {

            if (purchase == '') return true;
            else {

                let classToDisable = this.prepareClassToDisable(purchase);
                if (classToDisable.indexOf(item.cl) > -1) return true;

            }
        }

        return false;
    };

    this.manageItemDisableInHeroEQ = (item, $itemView) => {
        this.manageItemDisable(item, $itemView, this.activeDisableKinds);
    }

    this.manageItemDisable = (item, $itemView, activeDisableKinds) => {
        let linkedConditionsFulfilled = this.checkLinkedConditionsFulfilled(activeDisableKinds, item);
        if (linkedConditionsFulfilled) return;

        let arrayResult = this.createArrayResult(activeDisableKinds, item)

        for (let k in arrayResult) {
            let result = arrayResult[k];
            if (result) this.addDisableClassToItem($itemView[0], result);
        }
    };

    this.checkRequires = (item, activeDisableKinds) => {

        let linkedConditionsFulfilled = this.checkLinkedConditionsFulfilled(activeDisableKinds, item);
        if (linkedConditionsFulfilled) return true;

        let arrayResult = this.createArrayResult(activeDisableKinds, item)

        for (let k in arrayResult) {
            if (arrayResult[k]) return true
        }

        return false;
    };

    this.createArrayResult = (activeDisableKinds, item) => {
        let arrayResult = [];

        arrayResult.push(this.checkShops(activeDisableKinds, item));
        arrayResult.push(this.checkStats(activeDisableKinds, item));
        arrayResult.push(this.checkStats(activeDisableKinds, item, false));
        arrayResult.push(this.checkExpires(activeDisableKinds, item));
        arrayResult.push(this.checkClass(activeDisableKinds, item));
        arrayResult.push(this.checkClass(activeDisableKinds, item, false));
        arrayResult.push(this.checkEq(activeDisableKinds, item));
        arrayResult.push(this.checkTpl(activeDisableKinds, item));

        return arrayResult;
    }

    this.checkShops = (activeDisableKinds, item) => {
        if (activeDisableKinds[Engine.itemsDisableData.SHOP]) { //shop have difference disable class of items...
            let shouldBeDisable = this.checkShopItemShouldBeDisable(item);
            if (shouldBeDisable) {
                return Engine.itemsDisableData.SHOP;
            }
        }
        return false
    };

    this.checkStats = (activeDisableKinds, item, disableClass = true) => {
        for (let k in activeDisableKinds) {

            if (!this.checkDisableKindExist(k)) return false;
            //if (k == 'shop' && this.isOnlyBuyShop()) continue;
            if (k == Engine.itemsDisableData.SHOP && this.isOnlyBuyShop()) continue;

            let statsToItemDisable = disableClass ? this.allDisableItemStats[k] : this.allAllowItemStats[k];

            for (let j = 0; j < statsToItemDisable.length; j++) {
                let oneStat = statsToItemDisable[j]; // one stat or object of stats e.g "{ 'lvl': { '<', 20 } }"

                if (
                    !this.statCheckCanDisabled(item, oneStat) && disableClass ||
                    this.statCheckCanDisabled(item, oneStat) && !disableClass
                ) {
                    continue;
                }
                //this.addDisableClassToItem($itemView[0], k);
                return k;
                // return;
            }

        }
        return false;
    };

    this.statCheckCanDisabled = (item, oneStat) => {
        if (typeof oneStat === 'object') {
            for (const stat in oneStat) {
                if (item.issetItemStat(stat)) {
                    const [operator, value] = oneStat[stat],
                        // itemStatValue = item._cachedStats[stat];
                        itemStatValue = item.getItemStat(stat);
                    if (count(operator, itemStatValue, value)) return true; // e.g (itemLvl < lvl)
                } else {
                    return true;
                }
            }
        } else {
            if (item.issetItemStat(oneStat)) return true;
        }
        return false;
    };

    this.checkClass = (activeDisableKinds, item, disableClass = true) => {
        for (let k in activeDisableKinds) {

            if (!this.checkDisableItemClassNameExist(k)) return false;

            let disableItemClassData = disableClass ? this.allDisableItemClass[k] : this.allAllowItemClass[k];

            //if (k == 'shop' && this.isOnlyBuyShop()) continue;
            if (k == Engine.itemsDisableData.SHOP && this.isOnlyBuyShop()) continue;
            if (!disableItemClassData.length) continue;

            if (
                (disableItemClassData.indexOf(item.cl) > -1 && disableClass) ||
                (disableItemClassData.indexOf(item.cl) === -1 && !disableClass)
            ) {
                // this.addDisableClassToItem($itemView[0], k);
                return k;
            }
        }
        return false
    };

    this.checkExpires = (activeDisableKinds, item) => {
        for (let k in activeDisableKinds) {

            if (!this.checkDisableItemClassNameExist(k)) return false;

            let expiresData = this.disableExpiresStat[k];

            //if (k == 'shop' && this.isOnlyBuyShop()) continue;
            if (k == Engine.itemsDisableData.SHOP && this.isOnlyBuyShop()) continue;
            if (expiresData == null) continue;
            //if (!item.haveStat('expires'))           					continue;
            if (!item.issetExpiresStat()) continue;

            let isExpired = item.checkExpires();

            switch (expiresData) {
                case null:
                    break;
                case true:
                    if (isExpired) {
                        // this.addDisableClassToItem($itemView[0], k);
                        return k;
                    }
                    break;
                case false:
                    if (!isExpired) {
                        // this.addDisableClassToItem($itemView[0], k);
                        return k;
                    }
                    break;
                case 'all': // all expire items should be disabled (with expires stat)
                    // this.addDisableClassToItem($itemView[0], k);
                    return k;
                default:
                    console.error('[DisableItemsManager.js, checkExpires] BAD TYPE EXPIRES OPTION', expiresData);
                    return false
            }

        }
        return false;
    };

    this.checkEq = (activeDisableKinds, item) => {
        for (let k in activeDisableKinds) {
            if (!this.checkDisableKindExist(k)) return false;
            if (this.disableEq[k] === null) continue;
            //if (item.st !== 0 && this.disableEq[k]) return k;
            if (!ItemState.isInBagSt(item.st) && this.disableEq[k]) return k;
        }
        return false;
    }

    this.createResultItemData = ($itemView, disableKind) => {
        return {
            itemView: $itemView[0],
            disableKind: disableKind
        }
    }

    this.checkTpl = (activeDisableKinds, item) => {
        for (let k in activeDisableKinds) {
            if (this.allEnableTpl[k] != null) {

                if (!this.allEnableTpl[k].includes(item.tpl)) {
                    //this.addDisableClassToItem($itemView[0], k);
                    return k;
                }

            }
        }
        return false
    };

    this.checkLinkedConditionsFulfilled = (activeDisableKinds, item) => {
        for (let k in activeDisableKinds) {
            if (this.enableLinkedConditions[k] != null) {

                for (let kk in this.enableLinkedConditions[k]) {

                    let record = this.enableLinkedConditions[k][kk]
                    let result = this.checkOneLinkedRecord(record, item);

                    if (result) return true;
                }

            }
        }
        return false
    };

    this.checkOneLinkedRecord = (record, item) => {
        let arrayResult = [];

        if (record.stats) {
            let a = [];

            for (let i = 0; i < record.stats.length; i++) {
                let oneStat = record.stats[i];
                a.push(this.statCheckCanDisabled(item, oneStat));
            }

            let statResult = this.checkIsArrayWithAllTheSameVal(a, true);
            arrayResult.push(statResult);
        }

        if (record.classes) {
            arrayResult.push(record.classes.includes(item.cl));
        }

        return this.checkIsArrayWithAllTheSameVal(arrayResult, true);
    }

    this.checkIsArrayWithAllTheSameVal = (a, val) => {
        return a.every((x) => {
            return x == val
        });
    }

    this.getEnabledItems = () => {
        const hItems = Engine.heroEquipment.getHItems();
        const allDisabledItems = this.getAllDisabledItemsArray();

        return Object.keys(hItems)
            .map(Number)
            .filter((value) => !allDisabledItems.includes(value))
    };

    this.startSpecificItemKindDisable = (disableKind, options = {}) => {
        if (!this.checkDisableKindExist(disableKind)) return;

        this.addToActiveDisableKinds(disableKind);

        let hItems = Engine.heroEquipment.getHItems();

        if (options.enableTplArray) this.addToEnableTplByKind(disableKind, options.enableTplArray);
        if (options.linkedConditions) this.addToLinkedConditions(disableKind, options.linkedConditions);

        for (let k in hItems) {
            let $view = Engine.items.getAllViewsByIdAndViewName(k, Engine.itemsViewData.BAG_VIEW);
            if (!$view.length) return console.warn('[DisableItemsManager.js, startSpecificItemKindDisable] $view not find', k);
            this.manageItemDisable(hItems[k], $view, this.activeDisableKinds);
        }
    };

    this.endSpecificItemKindDisable = (disableKind) => {
        if (!this.checkDisableKindExist(disableKind)) return;

        this.removeFromActiveDisableKinds(disableKind);

        this.removeFromEnableTpl(disableKind);
        this.removeFromLinkedConditions(disableKind);

        this.removeFromDisableItems(disableKind);

        this.manageOfDeleteDisableItemMarkClass(disableKind);
    };

    this.manageOfDeleteDisableItemMarkClass = (disableKind) => {
        let cl = disableKind + '-disable';

        let $disableItemsTab = $('.' + cl);
        let self = this;

        $disableItemsTab.removeClass(cl);
        $disableItemsTab.each(function() {

            for (let i = 0; i < self.allKinds.length; i++) {
                let kind = self.allKinds[i];
                if ($(this).hasClass(kind + '-disable')) return
            }
            $(this).removeClass('disable-item-mark');
            self.removeDisableIcon($(this))

        });
    };


    this.addToEnableTplByKind = (kind, tplArray) => {
        this.allEnableTpl[kind] = tplArray;
    };

    this.removeFromEnableTpl = (kind) => {
        this.allEnableTpl[kind] = null;
    };

    this.addToLinkedConditions = (kind, conditionsArray) => {
        this.enableLinkedConditions[kind] = conditionsArray;
    };

    this.removeFromLinkedConditions = (kind) => {
        this.enableLinkedConditions[kind] = null;
    };

    this.checkDisableKindExist = (disableKind) => {
        let statsToItemDisable = this.allDisableItemStats[disableKind];
        if (statsToItemDisable) return true;
        else {
            console.error('[DisableItemsManager.js, checkDisableKindExist] Bad disable kind!!! ', disableKind);
            return false;
        }
    };

    this.checkDisableItemClassNameExist = (disableItemClassName) => {
        let disableItemClassData = this.allDisableItemClass[disableItemClassName];
        if (disableItemClassData) return true;
        else {
            console.error('[DisableItemsManager.js, checkDisableItemClassNameExist] Bad disable ItemClass!!! ', disableItemClassName);
            return false;
        }
    };

};