import {
    count,
    isset
} from '../HelpersTS';

let ItemState = require('@core/items/ItemState');

type Tcls = number[];
type Tstats = (string | (string | (string | number)[])[])[];

type Toptions = {
    allow: {
        cls ? : Tcls;
        stats ? : Tstats;
    };
    deny: {
        cls ? : Tcls;
        stats ? : Tstats;
    };
};

export default class ItemGrabber {
    private options!: Toptions;

    constructor(options: Toptions) {
        this.setFilters(options);
    }

    setFilters(options: Toptions) {
        this.options = options;
    }

    grab(bagNumber: number) {
        --bagNumber; // index
        const items = [];
        const hItems = Engine.heroEquipment.getHItems();
        const min = bagNumber * 6;
        const max = min + 6;

        for (let k in hItems) {
            const item = hItems[k];
            if (!this.checkBag(item, min, max)) continue;
            if (!this.checkCl(item)) continue;
            if (!this.checkStats(item)) continue;
            items.push(item);
        }

        return items;
    }

    checkBag(item: any, min: number, max: number) {
        return ItemState.isInBagSt(item.st) && item.y >= min && item.y < max;
    }

    checkCl(item: any) {
        let clOk = true; // default true
        if (isset(this.options.allow.cls)) {
            if (this.options.allow.cls!.length > 0) {
                if (!this.options.allow.cls?.includes(item.cl)) clOk = false;
            } else {
                // if cls key is exist but array is empty = false
                clOk = false;
            }
        }
        if (isset(this.options.deny.cls)) {
            if (this.options.deny.cls?.includes(item.cl)) clOk = false;
        }

        return clOk;
    }

    checkStats(item: any) {
        let statsOk = true; // default true
        const itemStats = item._cachedStats;
        const allowStats = this.options.allow.stats!;
        const denyStats = this.options.deny.stats!;
        if (isset(allowStats)) {
            for (const stat of allowStats) {
                if (!this.checkOneStat(item, stat)) statsOk = false;
            }
            // if (!this.options.allow.stats?.includes(item.cl)) clOk = false;
        }
        if (isset(denyStats)) {
            for (const stat of denyStats) {
                if (this.checkOneStat(item, stat)) statsOk = false;
            }
            // if (this.options.deny.stats?.includes(item.cl)) clOk = false;
        }

        return statsOk;
    }

    checkOneStat(item: any, oneStat: any) {
        if (typeof oneStat === 'object') {
            const {
                name: statName,
                params: statParams
            } = oneStat;
            if (item.issetItemStat(statName)) {
                const [operator, value] = statParams,
                itemStatValue = item._cachedStats[statName];
                if (count(operator, itemStatValue, value)) return true; // e.g (itemLvl < lvl)
            } else {
                return false;
            }
        } else {
            if (item.issetItemStat(oneStat)) return true;
        }
        return false;
    }
}