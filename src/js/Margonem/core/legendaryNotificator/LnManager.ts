import LnData from './LnData';
import LegendaryNotificatorWindow from './LnWindow';
import LegendaryNotificatorNotifier from './LnNotifier';
import LegendaryNotificatorSettings from './LnSettings';
import LegendaryNotificatorStorage from './LnStorage';

export default class LegendaryNotificator {
    #window: LegendaryNotificatorWindow;
    #storage: LegendaryNotificatorStorage;
    #notifier: LegendaryNotificatorNotifier;
    #settings: LegendaryNotificatorSettings;

    constructor() {
        this.bodyAddClass();
        this.#window = new LegendaryNotificatorWindow();
        this.#storage = new LegendaryNotificatorStorage();
        this.#notifier = new LegendaryNotificatorNotifier(this.#storage);
        this.#settings = new LegendaryNotificatorSettings(this.#window.wnd.el, this.#storage, this.#notifier);
    }

    bodyAddClass() {
        document.body.classList.add(LnData.LN_ACTIVE_CLASS);
    }

    bodyRemoveClass() {
        document.body.classList.remove(LnData.LN_ACTIVE_CLASS);
    }

    windowToggle() {
        this.#window.windowToggle();
    }

    remove() {
        this.#notifier.remove();
        this.#window.remove();
        this.#storage.remove();
        this.bodyRemoveClass();
    }

    getSettings() {
        return this.#settings;
    }
}

export const LnLang = (key: string, value = null) => _t(key, value, LnData.SLUG);