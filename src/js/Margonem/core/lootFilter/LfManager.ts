import LfData from './LfData';
import LootFilterWindow from './LfWindow';
import LootFilterSettings from "./LfSettings";
import LootFilterStorage from "./LfStorage";

export default class LootFilter {
    #window: LootFilterWindow;
    #settings: LootFilterSettings;
    #storage: LootFilterStorage;

    constructor() {
        this.#window = new LootFilterWindow();
        this.#storage = new LootFilterStorage();
        this.#settings = new LootFilterSettings(this.#window.wnd.el, this.#storage);
        this.resetDataOldLootFilter();
    }

    windowToggle() {
        this.#window.windowToggle();
    }

    remove() {
        this.#window.remove();
    }

    getSettings() {
        return this.#settings;
    }

    resetDataOldLootFilter() {
        setTimeout(() => {
            if (!Engine.allInit) {
                this.resetDataOldLootFilter();
                return;
            }
            if (API.Storage.get('addon_20') !== null) API.Storage.remove('addon_20');
            if (Engine.serverStorage.get('addon_20') !== null) Engine.serverStorage.clearDataBySpecificKey('addon_20');
        }, 1000)
    }
}

export const LfLang = (key: string, value = null) => _t(key, value, LfData.SLUG);