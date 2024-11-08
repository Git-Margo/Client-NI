import {
    Item
} from './items/Item';

declare const window: any;
declare const __build: any;
declare const _t: any;
declare const CFG: any;
declare const askAlert: any;

export const clGroups: Record < string, number[] > = {
    weapons: [1, 2, 3, 4, 5, 6, 7, 29],
    armors: [8, 9, 10, 11, 14],
    jewelry: [12, 13]
}

export const isset = function(x: any) {
    return typeof x != 'undefined';
};

export const triggerEvent = (el: HTMLElement, eventName: string) => {
    const event = new Event(eventName);
    el.dispatchEvent(event);
};

export const _l = function() {
    return __build.lang;
};

export const isPl = function() {
    return _l() == CFG.LANG.PL;
};

export const isEn = function() {
    return _l() == CFG.LANG.EN;
};

export const ut_date = function(ts: number) {
    // date from unix timestamp
    var d = new Date(ts * 1000),
        y = d.getFullYear();

    return `${zero(d.getDate())}.${zero(d.getMonth() + 1)}.${y}`;
};

export const ut_time = function(ts: number, withSec: boolean) {
    // date&time from unix timestamp
    var d = new Date(ts * 1000);
    var str = zero(d.getHours()) + ':' + zero(d.getMinutes());
    if (withSec) str += ':' + zero(d.getSeconds());
    return str;
};

export const ut_fulltime = function(ts: number, full = false) {
    // date&time from unix timestamp
    return ut_date(ts) + ' ' + ut_time(ts, full);
};

export const zero = function(x: number, z: number = 2) {
    let string = x.toString();
    while (string.length < z) string = '0' + string;
    return string;
};

export const setAttributes = (el: HTMLElement, attrs: any) => {
    for (const key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
};

export const setOnlyPositiveNumberInInput = function($input: JQuery) {
    $input.mask('0#');
}

export const decodeHtmlEntities = function(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export const isDevOrExpe = function() {
    const worldName = Engine.worldConfig.getWorldName();
    return worldName === 'dev' || worldName === 'experimental';
}

export const showProfile = function(accountId: number, characterId: number) {
    if (isPl()) {
        Engine.iframeWindowManager.newPlayerProfile({
            accountId,
            characterId
        })
    } else {
        window.open(`https://margonem.com/profile/view,${accountId}#char_${characterId}`, '_blank');
    }
}

export const isMan = function(gender: string) {
    return gender === 'm';
}

export const roundToNextStep = function(x: number, step: number) {
    return Math.ceil(x / step) * step;
}

export const roundToPrevStep = function(x: number, step: number) {
    return Math.floor(x / step) * step;
}

export const count = (operator: string, a: number, b: number | []) => {
    switch (operator) {
        case '<':
            return a < b;
        case '<=':
            return a <= b;
        case '>':
            return a > b;
        case '>=':
            return a >= b;
        case '==':
            return a == b;
        case '===':
            return a === b;
        case '!==':
            return a !== b;
        case 'includes':
            return (b as Array < number | string > ).includes(a);
    }
}

export const errorReport = (file: string, method: string, message: string, optionalData ? : any) => {
    optionalData = optionalData ? optionalData : '';
    console.error(`[${file}, ${method}] ${message}`, optionalData);
};

export const configIcon = () => {
    const configIconEl = document.createElement('div');
    configIconEl.classList.add('add-bck', 'config');
    return configIconEl;
}

export const siblings = (el: HTMLElement) => [...el.parentElement!.children].filter(children => children !== el);

export const getAllProfName = (p: string) => {
    const prof: {
        [name: string]: string
    } = {
        m: _t('prof_mag', null, 'eq_prof'),
        w: _t('prof_warrior', null, 'eq_prof'),
        p: _t('prof_paladyn', null, 'eq_prof'),
        t: _t('prof_tracker', null, 'eq_prof'),
        h: _t('prof_hunter', null, 'eq_prof'),
        b: _t('prof_bladedancer', null, 'eq_prof')
    };
    return prof[p];
};

export const removeFromArray = < T > (arr: T[], el: T): boolean => {
    const index = arr.indexOf(el);
    if (index !== -1) {
        arr.splice(index, 1);
        return true;
    }
    return false;
}

export const copyToClipboard = (txt: string) => {
    const copyEl = document.createElement('textarea');
    copyEl.value = txt;
    document.body.appendChild(copyEl);
    copyEl.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.log("Your browser doesn't support copy to clipboard");
    }
    document.body.removeChild(copyEl);
}

export const esc = (str: string) => {
    if (!str) return '';
    return encodeURIComponent(str);
};

export const areAllElementsSame = < T > (array: T[]) => {
    if (array.length === 0) return false;
    const firstElement = array[0];
    return array.every((element) => element === firstElement);
};

export const getClGroup = (cl: number) => {
    let foundClGroup: string | null = null;

    for (const clGroup of Object.keys(clGroups)) {
        if (clGroups[clGroup].includes(cl)) {
            foundClGroup = clGroup;
            break;
        }
    }

    return foundClGroup;
}

export const sameClGroup = (cls: number[]) => {
    const categories = [];
    for (const cl of cls) {
        const category = getClGroup(cl);
        if (category === null) return false;
        categories.push(category);
    }
    return areAllElementsSame(categories);
}

export const checkBetterItemClass = (items: number[] | Item, targetItem: Item) => {
    if (Array.isArray(items)) {
        for (const itemId of items) {
            const i = < Item > Engine.items.getItemById(itemId);
            if (isset(i) && i.itemTypeSort > targetItem.itemTypeSort) return true;
        }
    } else {
        if (items.itemTypeSort > targetItem.itemTypeSort) return true;
    }

    return false;
}

export const checkReducedRequirementItems = (items: number[] | Item) => {
    if (Array.isArray(items)) {
        for (const itemId of items) {
            const i = < Item > Engine.items.getItemById(itemId);
            if (isset(i) && isset(i._cachedStats["lowreq"])) return true;
        }
    } else {
        if (isset(items._cachedStats["lowreq"])) return true;
    }

    return false;
}

export const checkEnhancedItems = (item: number[] | Item) => {
    if (Array.isArray(item)) {
        for (const itemId of item) {
            const i = < Item > Engine.items.getItemById(itemId);
            if (isset(i) && isset(i._cachedStats["enhancement_upgrade_lvl"])) return true;
        }
    } else {
        if (isset(item._cachedStats["enhancement_upgrade_lvl"])) return true;
    }

    return false;
}

export const checkPersonalItems = (item: number[] | Item) => {
    if (Array.isArray(item)) {
        for (const itemId of item) {
            const i = < Item > Engine.items.getItemById(itemId);
            if (isset(i) && isset(i._cachedStats["personal"])) return true;
        }
    } else {
        if (isset(item._cachedStats["personal"])) return true;
    }

    return false;
}

export const enhancedItemConfirm = (clb: () => void) => {
    const
        info = _t('enhanced-item-confirm'),
        dataAlert = {
            q: info,
            clb,
            m: 'yesno4'
        };
    askAlert(dataAlert);
}

export const enhancedItemConfirmIfNeeded = (item: number[] | Item, callback: () => void) => {
    if (checkEnhancedItems(item)) {
        enhancedItemConfirm(callback);
        return;
    }
    callback();
}

export const replaceNumber = function(str: string, newNumber: number) {
    // Regular expression to match the number at the end of the string
    const regex = /\d+$/;
    const number = str.match(regex);

    if (number !== null) {
        return str.replace(regex, String(newNumber));
    } else {
        return str;
    }
}

type CallbackFunction = (...args: any[]) => void;
export const debounce = function(callback: CallbackFunction, wait: number, immediate = false) {
    let timeout: ReturnType < typeof setTimeout > | null = null;

    return function(this: any, ...args: any[]) {
        const callNow = immediate && !timeout;
        const next = () => callback.apply(this, args);

        clearTimeout(timeout!);
        timeout = setTimeout(next, wait);

        if (callNow) {
            next();
        }
    };
};

export const isMobileApp = () => window.navigator.userAgent.includes('MargonemMobile');

export const createTransVal = (val: string | number, unit = '', prefix = '', suffix = '', key = '%val%') => ({
    [key]: `${prefix}${val}${unit}${suffix}`
});

export const findInArrayOfObjects = (array: any[], key: string, value: any) => {
    return array.find(o => o[key] === value);
}

export const findInArrayOfObjectsById = (array: any[], value: any) => {
    return findInArrayOfObjects(array, 'id', value);
}

export const mergeObjects = (a: any, b: any, keyForMergeArrays: string) => {
    const result: any = JSON.parse(JSON.stringify(b));
    for (const key of Object.keys(a)) {

        if (result.hasOwnProperty(key) && Array.isArray(result[key])) {
            for (const objA of a[key]) {
                const keyA = objA[keyForMergeArrays];
                const foundBIndex = result[key].findIndex((objB: any) => objB[keyForMergeArrays] === keyA);

                if (foundBIndex === -1) {
                    result[key].push(objA);
                } else {
                    result[key][foundBIndex] = {
                        ...result[key][foundBIndex],
                        ...objA
                    };
                }
            }
        } else {
            result[key] = a[key];
        }
    }

    return result;
}

export const isOwnItem = (item: Item) => item.own === Engine.hero.d.id;

export const hex2rgb = (hex: string) => {
    const [r, g, b] = hex.match(/\w\w/g) !.map((x: string) => parseInt(x, 16));
    return {
        r,
        g,
        b
    }
}

// if (window) {
//   window.zero = zero;
//   window.ut_fulltime = ut_fulltime;
//   window.ut_date = ut_date;
//   window.ut_time = ut_time;
//   window.isPl = isPl;
//   window.isEn = isEn;
//   window._l = _l;
// }