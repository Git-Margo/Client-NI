import Tabs from '../components/Tabs';

declare const _t: any;
declare const Engine: any;

const Tpl = require('core/Templates');
import PlayersOnline from './playersOnline/PlayersOnline';
import ServerParameters from './serverParameters/ServerParameters';
import HuntingStatistics from "./huntingStatistics/HuntingStatistics";
import LocationParameters from './locationParameters/LocationParameters';
import {
    isEn,
    isPl
} from '../HelpersTS';

interface Card {
    name: string;
    initAction ? : () => void;
    disabled ? : boolean;
    disabledTip ? : string;
    requireLvl ? : number;
}

interface Cards {
    [name: string]: Card;
}

export const WW = {
    MODULES: {
        PLAYERS_ONLINE: 'players-online',
        HUNTING_STATISTICS: 'hunting-statistics',
        SERVER_PARAMETERS: 'server-parameters',
        LOCATION_PARAMETERS: 'location-parameters'
    }
}

export default class World {
    public opened: boolean = false;
    private currentTab!: string;
    private wnd: any;
    private wndEl!: HTMLElement;
    private content = '';
    private TabsInstance: null | Tabs = null;
    private cards: Cards = {
        [WW.MODULES.PLAYERS_ONLINE]: {
            name: this.tLang(WW.MODULES.PLAYERS_ONLINE),
            initAction: () => {
                this.open(WW.MODULES.PLAYERS_ONLINE);
            },
        },
        [WW.MODULES.HUNTING_STATISTICS]: {
            initAction: () => {
                this.open(WW.MODULES.HUNTING_STATISTICS);
            },
            name: this.tLang(WW.MODULES.HUNTING_STATISTICS),
        },
        [WW.MODULES.SERVER_PARAMETERS]: {
            initAction: () => {
                this.open(WW.MODULES.SERVER_PARAMETERS);
            },
            name: this.tLang(WW.MODULES.SERVER_PARAMETERS),
            // disabled: true,
            // disabledTip: _t('coming_soon')
        },
        [WW.MODULES.LOCATION_PARAMETERS]: {
            initAction: () => {
                this.open(WW.MODULES.LOCATION_PARAMETERS);
            },
            name: this.tLang(WW.MODULES.LOCATION_PARAMETERS),
        },
    };

    constructor() {}

    init() {
        this.initWindow();
        this.centerWindow();
        this.createTabs();
        // this.createCards();
    }

    createTabs() {
        const tabsOptions = {
            tabsEl: {
                navEl: this.wndEl.querySelector('.world-window__tabs') as HTMLElement,
                contentsEl: this.wndEl.querySelector('.world-window__contents') as HTMLElement,
            },
        };
        this.TabsInstance = new Tabs(this.cards, tabsOptions);
        // createCards
    }

    open(type: string, options ? : any) {
        this.closeOthers(type);
        const eng = this.getEngine();
        if (this.TabsInstance) {
            this.TabsInstance.activateCard(type);
        }
        this.currentTab = type;
        this.closeOtherWindows();
        this.windowOpen();

        switch (type) {
            case WW.MODULES.PLAYERS_ONLINE:
                if (!eng.worldWindow.playersOnline) {
                    eng.worldWindow.playersOnline = new PlayersOnline(this.wndEl, options);
                }
                break;
            case WW.MODULES.SERVER_PARAMETERS:
                if (!eng.worldWindow.serverParameters) {
                    eng.worldWindow.serverParameters = new ServerParameters(this.wndEl);
                }
                break;
            case WW.MODULES.LOCATION_PARAMETERS:
                if (!eng.worldWindow.locationParameters) {
                    eng.worldWindow.locationParameters = new LocationParameters(this.wndEl);
                }
                break;
            case WW.MODULES.HUNTING_STATISTICS:
                if (!eng.worldWindow.huntingStatistics) {
                    eng.worldWindow.huntingStatistics = new HuntingStatistics(this.wndEl);
                }
                break;
        }
    }

    closeAll() {
        if (this.getEngine().worldWindow.playersOnline) this.getEngine().worldWindow.playersOnline.close();
        if (this.getEngine().worldWindow.serverParameters) this.getEngine().worldWindow.serverParameters.close();
        if (this.getEngine().worldWindow.locationParameters) this.getEngine().worldWindow.locationParameters.close();
        if (this.getEngine().worldWindow.huntingStatistics) this.getEngine().worldWindow.huntingStatistics.close();
    }

    closeOthers(name: string) {
        if (this.getEngine().worldWindow.playersOnline && name !== WW.MODULES.PLAYERS_ONLINE)
            this.getEngine().worldWindow.playersOnline.close();
        if (this.getEngine().worldWindow.serverParameters && name !== WW.MODULES.SERVER_PARAMETERS)
            this.getEngine().worldWindow.serverParameters.close();
        if (this.getEngine().worldWindow.locationParameters && name !== WW.MODULES.LOCATION_PARAMETERS)
            this.getEngine().worldWindow.locationParameters.close();
        if (this.getEngine().worldWindow.huntingStatistics && name !== WW.MODULES.HUNTING_STATISTICS)
            this.getEngine().worldWindow.huntingStatistics.close();
    }

    manageVisible() {
        if (!this.opened) {
            this.closeOtherWindows();
            this.windowOpen();
        } else {
            this.windowClose();
        }
    }

    windowOpen() {
        // this.checkRequires();
        this.wnd.show();
        this.opened = true;
        this.wnd.setWndOnPeak();
    }

    windowClose() {
        this.wnd.hide();
        this.opened = false;
    }

    initWindow() {
        this.content = Tpl.get('world-window');

        this.getEngine().windowManager.add({
            content: this.content,
            title: this.tLang('title'),
            nameWindow: this.getEngine().windowsData.name.WORLD,
            widget: this.getEngine().widgetsData.name.WORLD,
            objParent: this,
            nameRefInParent: 'wnd',
            startVH: 60,
            cssVH: 60,
            onclose: () => {
                this.close();
            },
        });

        this.wnd.addToAlertLayer();
        this.windowClose();
        this.wndEl = this.wnd.$[0];
    }

    centerWindow() {
        this.wnd.center();
    }

    getEngine() {
        return Engine;
    }

    tLang(name: string, category: string = 'world_window', val: {} | null = null) {
        return typeof RUNNING_UNIT_TEST === 'undefined' ? _t(name, val, category) : '';
    }

    closeOtherWindows() {
        const e = this.getEngine();
        const v = e.windowsData.windowCloseConfig.WORLD_WINDOW;
        e.windowCloseManager.callWindowCloseConfig(v);
    }

    close() {
        this.closeAll();
        this.windowClose();
    }
};