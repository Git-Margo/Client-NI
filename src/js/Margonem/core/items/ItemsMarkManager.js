let ItemState = require('@core/items/ItemState');
let ItemLocation = require('@core/items/ItemLocation');

module.exports = function() {

    var self = this;

    this.healItems = [];
    this.lootboxes = [];
    this.expiresItems = [];
    this.enhanceReagentItems = [];
    this.noBonusItems = [];

    this.init = function(item) {

    };

    this.newItem = function(item) {
        // if (Engine.hero.d.lvl < 25 && item.loc === "g" && !notOwnItem(item.id, item) && item.st === 0) { //for low lvl, items with "g" loc, own
        //if (Engine.hero.d.lvl < 25 && item.st === 0) {
        if (getHeroLevel() < 25 && ItemState.isInBagSt(item.st)) {

            if (this.checkHealItem(item) && this.checkLvlRequired(item)) {
                this.healItems.push(item.id);
                this.markHealItems();
            }

            if (this.checkLootBox(item)) {
                this.lootboxes.push(item.id);
                //this.markLootBoxes();
                this.markOneLootBox(item.id, getHeroLevel());
            }

        }



        if (
            this.checkEnhanceReagentItem(item) &&
            Engine.crafting.enhancement &&
            Engine.crafting.enhancement.selectedEnhanceItem &&
            Engine.crafting.enhancement.selectedEnhanceItem !== parseInt(item.id)) //no mark selectedEnhanceItem
        {
            this.enhanceReagentItems.push(parseInt(item.id));
            this.markEnhanceReagentItems();

        }

        if (this.checkNoBonusItem(item)) {
            this.noBonusItems.push(item.id);
            this.markNoBonusItems(item);
            item.on('afterUpdate', () => {
                this.markNoBonusItems(item);
            });
        }

        if (this.checkExpiresItem(item)) { //for all
            this.expiresItems.push(item.id);
            this.markExpireItem(item);
            //item.on('afterUpdate', () => {
            //    this.markExpireItem(item);
            //});
        }

    };

    this.removeItem = function(item) {
        // if (item.loc != "g" || Engine.hero.d.lvl >= 25) return;
        //if (item.loc != Engine.itemsFetchData.NEW_EQUIP_ITEM.loc || Engine.hero.d.lvl >= 25) return;
        if (!ItemLocation.isEquipItemLoc(item.loc) || getHeroLevel() >= 25) return;
        this.healItems = this.healItems.filter(function(it) {
            return it != item.id; // remove id from heal items array
        });
        this.lootboxes = this.lootboxes.filter(function(it) {
            return it != item.id; // remove id from lootboxes array
        });
    };

    this.checkLvlRequired = (item) => !isset(item.getLvlStat()) || item.getLvlStat() <= getHeroLevel();

    this.checkHealItem = function(item) {
        // return (isset(item._cachedStats.leczy) || isset(item._cachedStats.fullheal) || isset(item._cachedStats.perheal))
        return item.issetLeczyStat() || item.issetFullhealStat() || item.issetPerhealStat()
    };

    this.checkLootBox = function(item) {
        // return (isset(item._cachedStats['lootbox']) || isset(item._cachedStats['lootbox2']));
        return item.issetLootboxStat() || item.issetLootbox2Stat();
    };

    this.checkExpiresItem = function(item) {
        // return (isset(item._cachedStats['expires']));
        return item.issetExpiresStat();
    };

    this.checkEnhanceReagentItem = (item) => {
        // return item.loc === "g";
        // return item.loc === Engine.itemsFetchData.NEW_EQUIP_ITEM.loc;
        return ItemLocation.isEquipItemLoc(item.loc);
    }

    this.checkNoBonusItem = function(item) {
        // return isset(item._cachedStats['bonus_not_selected']);
        return item.issetBonus_not_selectedStat();
    };

    this.isLowHealth = function(hpp = false) {
        let percent = hpp ? hpp : Math.ceil((Engine.hero.d.warrior_stats.hp / Engine.hero.d.warrior_stats.maxhp) * 100);
        return percent <= 50;
    };

    this.getHealItems = function() {
        return this.healItems;
    };

    this.getLootBox = function() {
        return this.lootboxes;
    };

    this.markEnhanceReagentItems = (reagentItems = []) => {
        this.enhanceReagentItems = reagentItems.length > 0 ? reagentItems : this.enhanceReagentItems;
        for (let id of this.enhanceReagentItems) {

            let item = Engine.items.getItemById(id);
            //let views    = Engine.items.getAllViewsById(id);
            let cl = null;

            const bonus = Engine.crafting.enhancement.getReagentBonus(item);
            if (bonus) {
                //cl += `mark mark--enhanceBonus bon-${bonus}`;
                cl = `enhanceBonus${bonus}`;
            }

            if (isset(item) && cl != null) this.addClassToElements(item.$, cl, item);
            //if (views.length > 0) this.addClassToElements(views, cl, item);
        }
    };

    this.unmarkEnhanceReagentItems = () => {
        for (let id of this.enhanceReagentItems) {

            let item = Engine.items.getItemById(id);
            //let views    = Engine.items.getAllViewsById(id);
            //let clToRemove = 'mark--enhanceBonus bon-1 bon-2 bon-3 bon-4';
            let clToRemove = ['enhanceBonus1', 'enhanceBonus2', 'enhanceBonus3', 'enhanceBonus4'];

            if (isset(item)) this.removeClassFromElements(item.$, clToRemove, item);
            //if (views.length > 0) this.removeClassFromElements(views, clToRemove, item);
        }
    }

    this.markNoBonusItems = (item) => {

        //let views    = Engine.items.getAllViewsById(item.id);
        //let cl       = 'mark mark--lootbox';
        //let clToRemove = 'mark--lootbox';
        let cl = 'noBonus';

        // if (isset(item._cachedStats['bonus_not_selected']) && isOwnItem(item)) {
        if (item.issetBonus_not_selectedStat() && isOwnItem(item)) {
            this.addClassToElements(item.$, cl, item);
            //if (views.length > 0) this.addClassToElements(views, cl, item);
        } else {
            //this.removeClassFromElements(item.$, clToRemove, item);
            this.removeClassFromElements(item.$, cl, item);
            //if (views.length > 0) this.removeClassFromElements(views, clToRemove, item);
        }
    };

    this.markHealItems = function(hpp = false) {
        if (!this.healItems.length) return;

        for (let id of this.healItems) {

            let item = Engine.items.getItemById(id);
            //let views    = Engine.items.getAllViewsById(id);
            // let cl       = 'mark mark--health';
            // let clToRemove = 'mark--health';
            let cl = 'heal';

            if (!item) continue

            if (this.isLowHealth(hpp)) {
                this.addClassToElements(item.$, cl, item);
                //this.addClassToElements(views, cl, item);
            } else {
                // this.removeClassFromElements(item.$, clToRemove);
                // this.removeClassFromElements(views, clToRemove);
                this.removeClassFromElements(item.$, cl, item);
                //this.removeClassFromElements(views, cl, item);
            }
        }
    };

    this.markLootBoxes = function(lvl = false) {
        if (!this.lootboxes.length) return;

        lvl = !lvl ? getHeroLevel() : lvl;

        for (let id of this.lootboxes) {
            this.markOneLootBox(id, lvl);
        }
    };

    this.markOneLootBox = (id, lvl) => {
        let item = Engine.items.getItemById(id);
        let cl = 'lootBox';

        if (!item) return

        // let showNotif = !item._cachedStats['lvl'] || item._cachedStats['lvl'] <= lvl;

        let lvlStat = item.getLvlStat();
        let showNotif = !lvlStat || lvlStat <= lvl;


        if (showNotif) this.addClassToElements(item.$, cl, item);
        else this.removeClassFromElements(item.$, cl, item);
    }

    this.markExpireItem = function(item) {
        let cl = 'expired';

        const update = () => {
            // if (item._cachedStats['expires'] - unix_time() < 0) {
            let expiresStat = item.getExpiresStat()
            if (expiresStat - unix_time() < 0) {
                this.addClassToElements(item.$, cl, item);
                //this.addClassToElements(views, cl, item);
                if (isset(item.expireInterval)) clearInterval(item.expireInterval);
                // } else if (item._cachedStats['expires'] - unix_time() < 3 * 86400) {
            } else if (expiresStat - unix_time() < 3 * 86400) {
                // if (item.cl === 18 && item.loc === 'g') { //for keys with expires < 3 days in bag
                //     this.addClassToElements(item.$, veryLowValueCl, item);
                //     //this.addClassToElements(views, veryLowCl, item);
                // }
            } else {
                this.removeClassFromElements(item.$, cl, item);
                //this.removeClassFromElements(views, cl, item);
                //this.removeClassFromElements(item.$, veryLowValueCl, item);
                //this.removeClassFromElements(views, veryLowCl, item);
            }
        };

        update();

        if (item.expireInterval) return;
        item.expireInterval = setInterval(() => {
            update();
        }, 1000);
    };

    this.addClassToElements = function(elements, cl, item) {
        let a = Array.isArray(elements) ? elements : [elements];
        for (let i of a) {
            // i.addClass(cl);
            item.createNotice(cl);
        }
    };

    this.removeClassFromElements = function(elements, cl, item) {
        let a = Array.isArray(elements) ? elements : [elements];
        let b = Array.isArray(cl) ? cl : [cl];

        for (let i of a) {
            for (let j of b) {
                i.removeClass(j);
                item.removeNotice(j);
                item.clearCanvasNotice();
            }
        }
    };

    this.heroHpChanged = function(hp) {
        if (getHeroLevel() >= 25) return;
        let hpp = Math.ceil(hp * 100);
        this.markHealItems(hpp);
    };

    this.heroLvlChanged = function(lvl) {
        if (getHeroLevel() >= 25) return;
        this.markLootBoxes(lvl);
    };

    this.compareAllItems = function(otherItems = {}) {
        if (getHeroLevel() > 25) return;
        if (Engine.shop) {
            let shopItems = Engine.shop.items;
            Object.assign(otherItems, shopItems);
        }

        let hE = Engine.heroEquipment;
        let eq = Object.values(hE.getEqItems());
        let mergedItems = Object.assign({}, hE.getHItems(), otherItems);

        let invEq = Object.values(mergedItems)

            .map(self.mapItems)
            .filter(self.itemInBagAndCanEquipFilter)
            .filter((obj) => {
                return self.sameItemsFilter(obj, eq);
            });

        let filtered = self.removeDuplicatesLowerScore(invEq);
        filtered.map(self.addMarkHigherScore);
    };

    this.removeDuplicatesLowerScore = function(invEq) {
        return Array.from(invEq
            .reduce((m, o) => !m.has(o.itemClType) || m.get(o.itemClType).score <= o.score ?
                m.set(o.itemClType, o) :
                m, new Map)
            .values());
    };

    this.mapItems = function(x) {
        x = self.setItemType(x);
        return self.clearMarkHigherScore(x);
    };

    this.setItemType = function(x) {
        switch (x.cl) {
            case 1:
            case 2:
            case 3:
                x['itemClType'] = 123;
                break;
            default:
                x['itemClType'] = x.cl;
        }
        return x;
    };

    this.clearMarkHigherScore = function(x) {
        //let cl      = 'mark--higher-score';
        let cl = 'higherScore';
        //let views   = Engine.items.getAllViewsById(x.id);
        self.removeClassFromElements(x.$, cl, x);
        //self.removeClassFromElements(views, cl, x);
        return x;
    };

    this.addMarkHigherScore = function(x) {
        //let cl      = 'mark mark--higher-score';
        let cl = 'higherScore';
        //let views   = Engine.items.getAllViewsById(x.id);
        self.addClassToElements(x.$, cl, x);
        //self.addClassToElements(views, cl, x);
    };

    this.itemInBagAndCanEquipFilter = function(x) {
        //return x.st === 0 && Engine.heroEquipment.checkItemCanEquip(x)
        return ItemState.isInBagSt(x.st) && Engine.heroEquipment.checkItemCanEquip(x)
    };

    this.sameItemsFilter = function(obj, eq) {
        return !eq.some(obj2 => obj.itemClType === obj2.itemClType && obj.score <= obj2.score)
    };

};