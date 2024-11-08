const ServerStorageData = require('../storage/ServerStorageData.js');

import {
    errorReport,
    findInArrayOfObjectsById,
    isset,
    mergeObjects
} from '../HelpersTS';
import LnData, {
    Animations,
    SettingKeys,
    Sounds
} from './LnData';

export interface Preset {
    id: number,
    [SettingKeys.OPACITY]: number;
    [SettingKeys.SIZE]: number;
    [SettingKeys.FRAME_MAP]: boolean;
    [SettingKeys.FRAME_MAP_COLOR]: string;
    [SettingKeys.FRAME_LOOT]: boolean;
    [SettingKeys.FRAME_LOOT_COLOR]: string;
    [SettingKeys.FRAME_ITEM]: boolean;
    [SettingKeys.FRAME_ITEM_COLOR]: string;
    [SettingKeys.MESSAGE]: boolean;
    // [SettingKeys.CLAN_MESSAGE]: boolean;
    [SettingKeys.SOUND]: number;
    [SettingKeys.ANIMATION]: number;
}

export type Presets = Preset[];
export type PresetSettingValue = boolean | string | number;
export type SettingList = Exclude < SettingKeys, SettingKeys.ACTIVE_PRESET | SettingKeys.SOUND_CUSTOM_LIST | SettingKeys.PRESET_CUSTOM_LIST > ;
export type PresetSettings = Exclude < SettingList, SettingKeys.PRESETS > ;

interface MenuItem {
    id: number;
    text: string;
}

interface SoundItem extends MenuItem {
    link: string;
}

type MenuList = MenuItem[];
type SoundList = SoundItem[];

type StorageData = {
    [SettingKeys.ACTIVE_PRESET]: number[SettingKeys.PRESETS]: Presets[SettingKeys.PRESET_CUSTOM_LIST]: MenuList[SettingKeys.SOUND_CUSTOM_LIST]: SoundList
}

const LnLang = (key: string, value = null) => _t(key, value, LnData.SLUG);

const defaultPresetList = [{
    id: 0,
    text: LnLang(LnData.DEFAULT) + ' 1'
}, ];

const defaultSoundUrl = '/sounds/loot_illumination/';

const defaultSoundList = [{
        id: 0,
        text: LnLang(Sounds.NONE),
        link: ''
    },
    {
        id: 1,
        text: LnLang(LnData.DEFAULT) + ' 1',
        link: defaultSoundUrl + '1.mp3'
    },
    {
        id: 2,
        text: LnLang(LnData.DEFAULT) + ' 2',
        link: defaultSoundUrl + '2.mp3'
    },
    {
        id: 3,
        text: LnLang(LnData.DEFAULT) + ' 3',
        link: defaultSoundUrl + '3.mp3'
    },
    {
        id: 4,
        text: LnLang(LnData.DEFAULT) + ' 4',
        link: defaultSoundUrl + '4.mp3'
    },
    {
        id: 5,
        text: LnLang(LnData.DEFAULT) + ' 5',
        link: defaultSoundUrl + '5.mp3'
    },
    {
        id: 6,
        text: LnLang(LnData.DEFAULT) + ' 6',
        link: defaultSoundUrl + '6.mp3'
    },
    {
        id: 7,
        text: LnLang(LnData.DEFAULT) + ' 7',
        link: defaultSoundUrl + '7.mp3'
    },
    {
        id: 8,
        text: LnLang(LnData.DEFAULT) + ' 8',
        link: defaultSoundUrl + '8.mp3'
    },
    {
        id: 9,
        text: LnLang(LnData.DEFAULT) + ' 9',
        link: defaultSoundUrl + '9.mp3'
    },
    {
        id: 10,
        text: LnLang(LnData.DEFAULT) + ' 10',
        link: defaultSoundUrl + '10.mp3'
    },
    {
        id: 11,
        text: LnLang(LnData.DEFAULT) + ' 11',
        link: defaultSoundUrl + '11.mp3'
    }
];

const defaultAnimationList = [{
        id: 0,
        val: Animations.NONE,
        text: LnLang(Animations.NONE)
    },
    {
        id: 1,
        val: Animations.CONFETTI,
        text: LnLang(Animations.CONFETTI)
    },
    {
        id: 2,
        val: Animations.CONFETTI_SIDE,
        text: LnLang(Animations.CONFETTI_SIDE)
    },
    {
        id: 3,
        val: Animations.FIREWORKS,
        text: LnLang(Animations.FIREWORKS)
    },
    {
        id: 4,
        val: Animations.STARS,
        text: LnLang(Animations.STARS)
    },
];

const defaultPresets: Presets = [{
    id: 0,
    [SettingKeys.OPACITY]: 50,
    [SettingKeys.SIZE]: 50,
    [SettingKeys.FRAME_MAP]: true,
    [SettingKeys.FRAME_MAP_COLOR]: '#ff0000',
    [SettingKeys.FRAME_LOOT]: true,
    [SettingKeys.FRAME_LOOT_COLOR]: '#ff0000',
    [SettingKeys.FRAME_ITEM]: true,
    [SettingKeys.FRAME_ITEM_COLOR]: '#ff0000',
    [SettingKeys.MESSAGE]: true,
    // [SettingKeys.CLAN_MESSAGE]: true,
    [SettingKeys.SOUND]: 0,
    [SettingKeys.ANIMATION]: 0,
}]

const defaultData: StorageData = {
    [SettingKeys.ACTIVE_PRESET]: 0,
    [SettingKeys.PRESETS]: defaultPresets,
    [SettingKeys.PRESET_CUSTOM_LIST]: [],
    [SettingKeys.SOUND_CUSTOM_LIST]: []
}

export default class LegendaryNotificatorStorage {
    private mergedData!: StorageData;
    private storageData!: StorageData;

    constructor() {
        this.loadStorageData();
    }

    private prepareMenuData(list: any) {
        const menu = [];
        for (let item of list) {
            menu.push({
                // val: isset(item.val) ? item.val : item.id,
                val: item.id,
                ...(item.link ? {
                    tip: item.link
                } : {}),
                id: item.id,
                text: item.text
            })
        }
        return menu;
    }

    getDefaultAnimationList() {
        return this.prepareMenuData(defaultAnimationList);
    }

    getDefaultSoundList() {
        return this.prepareMenuData(defaultSoundList);
    }

    getDefaultPresetList() {
        return this.prepareMenuData(defaultPresetList);
    }

    getCustomSoundList() {
        // const list = [
        //   { id: 100, link: 'https://google.com' },
        //   { id: 101, link: 'https://wp.pl' },
        // ];
        const list = this.mergedData[SettingKeys.SOUND_CUSTOM_LIST];
        return this.prepareMenuData(list);
    }

    getCustomPresetList() {
        // const list = [
        //   { id: 100, text: 'lala' },
        // ];
        const list = this.mergedData[SettingKeys.PRESET_CUSTOM_LIST];
        return this.prepareMenuData(list);
    }

    private loadStorageData() {
        const data = Engine.serverStorage.get(ServerStorageData.LN_SETTINGS);
        this.mergedData = data ? mergeObjects(data, defaultData, 'id') : {
            ...defaultData
        };
        // console.log(defaultData)
        // console.log(data)
        // console.log(this.mergedData)
    }

    getCurrentPresetData() {
        const presetData = findInArrayOfObjectsById(this.mergedData[SettingKeys.PRESETS], this.mergedData[SettingKeys.ACTIVE_PRESET]);
        if (presetData) return presetData;
        else errorReport('LnStorage.ts', "getCurrentPresetData", `preset ${this.mergedData[SettingKeys.ACTIVE_PRESET]} not exist!`);
        return false;
    }

    getAnimationName() {
        const animationId = this.getCurrentPresetData().animation;
        return findInArrayOfObjectsById(defaultAnimationList, animationId)?.val;
    }

    getSoundUrl() {
        const soundId = this.getCurrentPresetData().sound;
        return findInArrayOfObjectsById(defaultSoundList, soundId)?.link || findInArrayOfObjectsById(this.mergedData[SettingKeys.SOUND_CUSTOM_LIST], soundId)?.link;
    }

    getMessageState() {
        return this.getCurrentPresetData().message;
    }

    changePreset(id: number, callback ? : () => void) {
        this.saveStorageData({
            [SettingKeys.ACTIVE_PRESET]: id
        }, callback);
    }

    changeSetting(setting: PresetSettings, value: PresetSettingValue) {
        const presetData = this.getCurrentPresetData();

        presetData[setting] = value;
        // this.mergedData[SettingKeys.PRESETS][this.mergedData[SettingKeys.ACTIVE_PRESET]][setting] = value;
        this.saveStorageData(this.mergedData);
    }

    getPresetData(id: number) {
        return findInArrayOfObjectsById(this.mergedData[SettingKeys.PRESETS], id);
    }

    addPreset(name: string, id: number) {
        const presetData = structuredClone(this.getCurrentPresetData());
        presetData.id = id;

        this.mergedData[SettingKeys.PRESET_CUSTOM_LIST].push({
            id,
            text: name
        });
        this.mergedData[SettingKeys.PRESETS].push(presetData);
        this.saveStorageData(this.mergedData);
    }

    removePreset(id: number) {
        // this.mergedData[SettingKeys.ACTIVE_PRESET] = 0; // set predefined preset
        // it's unnecessary because removing the menuScroll option automatically sets the first option and triggers the callback

        const presetsList = this.mergedData[SettingKeys.PRESETS];
        this.mergedData[SettingKeys.PRESETS] = presetsList.filter((obj) => {
            return obj.id !== id;
        });

        const presetsMenu = this.mergedData[SettingKeys.PRESET_CUSTOM_LIST];
        this.mergedData[SettingKeys.PRESET_CUSTOM_LIST] = presetsMenu.filter((obj) => {
            return obj.id !== id;
        });
        this.saveStorageData(this.mergedData);
    }

    addSound(name: string, id: number, link: string) {
        const presetData = structuredClone(this.getCurrentPresetData());
        presetData.id = id;

        this.mergedData[SettingKeys.SOUND_CUSTOM_LIST].push({
            id,
            text: name,
            link
        });
        this.saveStorageData(this.mergedData);
    }

    removeSound(id: number) {
        // const presetsList = this.mergedData[SettingKeys.PRESETS];
        // presetsList.forEach((element, index) => {
        //   if (element.id === id) {
        //     element[SettingKeys.SOUND] = 1;
        //   }
        // });
        //
        // it's unnecessary because removing the menuScroll option automatically sets the first option and triggers the callback

        const presetsMenu = this.mergedData[SettingKeys.SOUND_CUSTOM_LIST];
        this.mergedData[SettingKeys.SOUND_CUSTOM_LIST] = presetsMenu.filter((obj) => {
            return obj.id !== id;
        });
        this.saveStorageData(this.mergedData);
    }

    private saveStorageData(obj: any, callback ? : () => void) {
        Engine.serverStorage.sendData({
            [ServerStorageData.LN_SETTINGS]: obj
        }, () => {
            this.loadStorageData();
            if (callback) callback();
        });
    }

    private clearStorageData() {
        Engine.serverStorage.clearDataBySpecificKey(ServerStorageData.LN_SETTINGS);
    }

    private checkCorrectData(data: any) {
        for (let k in data) {
            let d = data[k];
            let notExistKey = null;

            // if (!isset(d[SettingKeys.PRESETS])) notExistKey = SettingKeys.PRESETS;
            if (!isset(d[SettingKeys.OPACITY])) notExistKey = SettingKeys.OPACITY;
            if (!isset(d[SettingKeys.SIZE])) notExistKey = SettingKeys.SIZE;
            if (!isset(d[SettingKeys.FRAME_MAP])) notExistKey = SettingKeys.FRAME_MAP;
            if (!isset(d[SettingKeys.FRAME_MAP_COLOR])) notExistKey = SettingKeys.FRAME_MAP_COLOR;
            if (!isset(d[SettingKeys.FRAME_LOOT])) notExistKey = SettingKeys.FRAME_LOOT;
            if (!isset(d[SettingKeys.FRAME_LOOT_COLOR])) notExistKey = SettingKeys.FRAME_LOOT_COLOR;
            if (!isset(d[SettingKeys.FRAME_ITEM])) notExistKey = SettingKeys.FRAME_ITEM;
            if (!isset(d[SettingKeys.FRAME_ITEM_COLOR])) notExistKey = SettingKeys.FRAME_ITEM_COLOR;
            if (!isset(d[SettingKeys.SOUND])) notExistKey = SettingKeys.SOUND;
            if (!isset(d[SettingKeys.ANIMATION])) notExistKey = SettingKeys.ANIMATION;
            if (!isset(d[SettingKeys.MESSAGE])) notExistKey = SettingKeys.MESSAGE;

            if (notExistKey != null) {
                errorReport('LnSettings.js', 'checkCorrectData', `Key: ${notExistKey} not exist!`, d);
                return [];
            }
        }
        return data;
    }

    private addToStorageFilters() {
        // if (index == null) this.mergedData.push(o);
        // else this.mergedData.splice(index, 0, o);
    }

    private removeFromStorage(index: number) {
        // if (!this.mergedData[index]) {
        //   errorReport('LnSettings.ts', 'removeFromStorage', `ID not exist : ${index}`, this.mergedData);
        //   return;
        // }
        //
        // this.mergedData.splice(index, 1);
    }

    remove() {
        this.clearStorageData();
    }
}