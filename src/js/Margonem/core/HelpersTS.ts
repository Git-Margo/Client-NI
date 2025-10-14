import {
    Item
} from './items/Item';

declare const window: any;
declare const __build: any;
declare const _t: any;
declare const CFG: any;
declare const askAlert: any;

declare global {
    interface HTMLElement {
        setContent(content: string | HTMLElement): void;
    }
}

type AnyObject = Record < string, unknown > ;

HTMLElement.prototype.setContent = function(content: string | HTMLElement): void {
    this.innerHTML = '';

    if (typeof content === 'string') {
        this.innerHTML = content;
    } else {
        this.appendChild(content);
    }
};

export const getEngine = () => Engine;

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
        el.setAttribute(key, String(attrs[key]));
    }
};

export const setOnlyPositiveNumberInInput = function($input: JQuery) {
    $input.mask('0#');
}

export const decodeHtmlEntities = function(text: string) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
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

export const count = (operator: string, a: number | string, b: number | string | Array < number | string > ) => {
    if (operator === 'includes') {
        return Array.isArray(b) && b.includes(a);
    } else {
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
            default:
                return false;
        }
    }
}

export const errorReport = (file: string, method: string, message: string, optionalData ? : any) => {
    optionalData = optionalData ? optionalData : '';
    console.error(`[${file}, ${method}] ${message}`, optionalData);
};

export const throwError = (file: string, method: string, message: string) => {
    throw new Error(`[${file}, ${method}] ${message}`);
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
            // if (isset(i) && isset(i._cachedStats["lowreq"])) return true;
            if (isset(i) && i.issetLowreqStat()) return true;
        }
    } else {
        // if (isset(items._cachedStats["lowreq"])) return true;
        if (items.issetLowreqStat()) return true;
    }

    return false;
}

export const checkEnhancedItems = (item: number[] | Item) => {
    if (Array.isArray(item)) {
        for (const itemId of item) {
            const i = < Item > Engine.items.getItemById(itemId);
            // if (isset(i) && isset(i._cachedStats["enhancement_upgrade_lvl"])) return true;
            if (isset(i) && i.issetEnhancement_upgrade_lvlStat()) return true;
        }
    } else {
        if (item.issetEnhancement_upgrade_lvlStat()) return true;
    }

    return false;
}

export const checkPersonalItems = (item: number[] | Item) => {
    if (Array.isArray(item)) {
        for (const itemId of item) {
            const i = < Item > Engine.items.getItemById(itemId);
            // if (isset(i) && isset(i._cachedStats["personal"])) return true;
            if (isset(i) && i.issetPersonalStat()) return true;
        }
    } else {
        // if (isset(item._cachedStats["personal"])) return true;
        if (item.issetPersonalStat()) return true;
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
//export const isMobileApp = () => true

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

export const getHeroId = () => Engine.hero.d.id;
export const isOwnItem = (item: Item) => item.own === getHeroId();
export const isHero = (characterId: number) => characterId === getHeroId();

export const hex2rgb = (hex: string) => {
    const [r, g, b] = hex.match(/\w\w/g) !.map((x: string) => parseInt(x, 16));
    return {
        r,
        g,
        b
    }
}

export const getParsedPetData = (petData: string) => {
    const petClasses = ['elite', 'quest', 'legendary', 'heroic'] as
    const;

    type PetClass = typeof petClasses[number]; // Type from table elements

    type PetObj = {
        name: string;
        outfit: string;
        action: number;
        actions ? : string;
    } & Partial < Record < PetClass, boolean >> ; // dynamic keys for pet classes

    const tmplist = petData.split(',');

    const petObj: PetObj = {
        name: tmplist[0],
        outfit: tmplist[1],
        action: 0
    };

    for (let j = 2; j < tmplist.length; j++) {
        if (petClasses.includes(tmplist[j] as PetClass)) {
            petObj[tmplist[j] as PetClass] = true;
            continue;
        }
        petObj.actions = tmplist[j];
    }

    return petObj;
};

export const setContent = (container: HTMLElement, content: string | HTMLElement): void => {
    container.innerHTML = '';

    if (typeof content === 'string') {
        container.innerHTML = content;
    } else {
        container.appendChild(content);
    }
}

export const stringToHtml = < T extends HTMLElement > (htmlString: string): T | null => {
    const template = document.createElement("template");
    template.innerHTML = htmlString.trim();
    return template.content.firstElementChild as T | null;
}

export const convertStringNumbers = < T extends AnyObject > (obj: T): T =>
    Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, typeof value === "string" && !isNaN(Number(value)) ? Number(value) : value])
    ) as T;

export enum Icons {
    CLOSE = 'close',
        MENU = 'menu'
}
export const getIcon = (iconName: Icons, hasHover: boolean = true) => {
    const iconEl = document.createElement('div');
    iconEl.classList.add('ie-icon', `ie-icon-${iconName}`);
    if (!hasHover) iconEl.classList.add('ie-icon--no-hover');
    return $(iconEl);
}

export const getIconClose = (hasHover: boolean) => getIcon(Icons.CLOSE, hasHover);

export const highlightElement = (selector: string, duration = 300) => {
    document.querySelectorAll(selector).forEach(el => {
        el.classList.add('ie-highlight-animation');
        setTimeout(() => {
            el.classList.remove('ie-highlight-animation');
        }, 2000);
    });
}
export const attachItemToSlot = (opts: {
    itemId: number;
    slotEl: HTMLElement;
    viewName: string;
    movedName: string;
    clearSlotBeforeAppend ? : boolean;
    correctItemCheck ? : (item: Item) => boolean;
    onClick ? : (item: Item) => void;
    onDelete ? : () => void;
    onSuccess ? : () => void;
}) => {
    const {
        itemId,
        slotEl,
        viewName,
        movedName,
        clearSlotBeforeAppend = true,
        correctItemCheck,
        onClick,
        onDelete,
        onSuccess
    } = opts;

    const item = Engine.items.getItemById(itemId);
    if (!isset(item)) return;
    if (correctItemCheck && !correctItemCheck(item)) {
        errorReport("Helpers.ts", "attachItemToSlot", "Incorrect item:", item);
        return;
    }

    const itemEl = Engine.items.createViewIcon(item.id, viewName)[0][0];

    if (onClick) {
        itemEl.addEventListener("click", () => onClick(item));
        Engine.itemsMovedManager.addItem(item, movedName, () => onClick(item));
    }

    if (onDelete) item.on("delete", () => onDelete());

    if (clearSlotBeforeAppend) slotEl.innerHTML = "";
    slotEl.appendChild(itemEl);

    if (onSuccess) onSuccess();
}

export const removeItemFromSlot = (opts: {
    itemId: number | null;
    viewName: string;
    movedName: string;
    onDelete ? : () => void;
    onSuccess ? : () => void;
    onMissing ? : () => void;
}) => {
    const {
        itemId,
        viewName,
        movedName,
        onDelete,
        onSuccess,
        onMissing
    } = opts;

    if (itemId == null) {
        if (onMissing) onMissing();
        return;
    }

    const item = Engine.items.getItemById(itemId);
    if (!isset(item)) {
        if (onMissing) onMissing();
        return;
    }

    // Engine.items.deleteAllViewsByViewName(viewName);
    Engine.items.deleteViewIconIfExist(itemId, viewName)
    // Engine.itemsMovedManager.removeItemsByTarget(movedName);
    Engine.itemsMovedManager.removeItem(itemId);

    if (onDelete) item.unregisterCallback("delete", () => onDelete());

    if (onSuccess) onSuccess();
}

export type SecToParsedTimeOptions = {
    showSec ? : boolean;
    color ? : boolean;
    showDays ? : boolean;
};

export const secToParsedTime = (
    sec: number,
    options: SecToParsedTimeOptions = {}
): string => {
    const {
        showSec = true,
            color = true,
            showDays = true
    } = options;

    let hours: number, minutes: number, seconds: number, days: number;

    if (!showDays) {
        hours = Math.floor(sec / 3600);
        minutes = Math.floor((sec % 3600) / 60);
        seconds = Math.floor(sec % 60);
        days = 0;
    } else {
        days = Math.floor(sec / 86400);
        hours = Math.floor((sec % 86400) / 3600);
        minutes = Math.floor((sec % 3600) / 60);
        seconds = Math.floor(sec % 60);
    }

    const dayHidden = !showDays || days < 1;
    const hourHidden = dayHidden && hours < 1;
    const secHidden = (showDays && days > 0) || !showSec;

    let classes = '';
    if (color) {
        classes = 'green';
        if (hourHidden && minutes > 4) classes = 'orange';
        if (hourHidden && minutes <= 4) classes = 'red';
    }

    return `
    <span class="${classes}">
      ${!dayHidden ? _t('time_days_short %val%', { '%val%': days }, 'time_diff') : ''}
      ${!hourHidden ? _t('time_h_short %val%', { '%val%': hours }, 'time_diff') : ''}
      ${_t('time_min_short %val%', { '%val%': minutes }, 'time_diff')}
      ${!secHidden ? _t('time_sec_short %val%', { '%val%': seconds }, 'time_diff') : ''}
    </span>
  `;
}

export const isTestWorld = () => {
    const testWorlds = ['dev', 'tabaluga', 'experimental'];
    return testWorlds.includes(Engine.worldConfig.getWorldName());
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