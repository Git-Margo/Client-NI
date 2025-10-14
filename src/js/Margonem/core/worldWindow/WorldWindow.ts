import Tabs from '../components/Tabs';

const Tpl = require('@core/Templates');
import PlayersOnline from './playersOnline/PlayersOnline';
import ServerParameters from './serverParameters/ServerParameters';
import HuntingStatistics from "./huntingStatistics/HuntingStatistics";
import LocationParameters from './locationParameters/LocationParameters';
import ActivityPanel from "./activityPanel/ActivityPanel";
import {
    getEngine
} from "@core/HelpersTS";

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
        LOCATION_PARAMETERS: 'location-parameters',
        ACTIVITIES: 'activities',
    }
}

export default class World {
    public opened: boolean = false;
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
            name: this.tLang(WW.MODULES.HUNTING_STATISTICS),
            initAction: () => {
                this.open(WW.MODULES.HUNTING_STATISTICS);
            },
        },
        [WW.MODULES.SERVER_PARAMETERS]: {
            name: this.tLang(WW.MODULES.SERVER_PARAMETERS),
            initAction: () => {
                this.open(WW.MODULES.SERVER_PARAMETERS);
            },
            // disabled: true,
            // disabledTip: _t('coming_soon')
        },
        [WW.MODULES.LOCATION_PARAMETERS]: {
            name: this.tLang(WW.MODULES.LOCATION_PARAMETERS),
            initAction: () => {
                this.open(WW.MODULES.LOCATION_PARAMETERS);
            },
        },
        [WW.MODULES.ACTIVITIES]: {
            name: this.tLang(WW.MODULES.ACTIVITIES),
            initAction: () => {
                _g('activities&action=show');
                // this.open(WW.MODULES.ACTIVITIES);
            },
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
        if (this.TabsInstance) {
            this.TabsInstance.activateCard(type);
        }
        this.closeOtherWindows();
        this.windowOpen();

        switch (type) {
            case WW.MODULES.PLAYERS_ONLINE:
                if (!getEngine().worldWindow.playersOnline) {
                    getEngine().worldWindow.playersOnline = new PlayersOnline(this.wndEl, options);
                }
                break;
            case WW.MODULES.SERVER_PARAMETERS:
                if (!getEngine().worldWindow.serverParameters) {
                    getEngine().worldWindow.serverParameters = new ServerParameters(this.wndEl);
                }
                break;
            case WW.MODULES.LOCATION_PARAMETERS:
                if (!getEngine().worldWindow.locationParameters) {
                    getEngine().worldWindow.locationParameters = new LocationParameters(this.wndEl);
                }
                break;
            case WW.MODULES.HUNTING_STATISTICS:
                if (!getEngine().worldWindow.huntingStatistics) {
                    getEngine().worldWindow.huntingStatistics = new HuntingStatistics(this.wndEl);
                }
                break;
            case WW.MODULES.ACTIVITIES:
                if (!getEngine().worldWindow.activityPanel) {
                    getEngine().worldWindow.activityPanel = new ActivityPanel(this.wndEl, options);
                } else {
                    getEngine().worldWindow.activityPanel.update(options);
                }
                break;
        }
    }

    closeAll() {
        if (getEngine().worldWindow.playersOnline) getEngine().worldWindow.playersOnline.close();
        if (getEngine().worldWindow.serverParameters) getEngine().worldWindow.serverParameters.close();
        if (getEngine().worldWindow.locationParameters) getEngine().worldWindow.locationParameters.close();
        if (getEngine().worldWindow.huntingStatistics) getEngine().worldWindow.huntingStatistics.close();
        if (getEngine().worldWindow.activityPanel) getEngine().worldWindow.activityPanel.close();
    }

    closeOthers(name: string) {
        if (getEngine().worldWindow.playersOnline && name !== WW.MODULES.PLAYERS_ONLINE)
            getEngine().worldWindow.playersOnline.close();
        if (getEngine().worldWindow.serverParameters && name !== WW.MODULES.SERVER_PARAMETERS)
            getEngine().worldWindow.serverParameters.close();
        if (getEngine().worldWindow.locationParameters && name !== WW.MODULES.LOCATION_PARAMETERS)
            getEngine().worldWindow.locationParameters.close();
        if (getEngine().worldWindow.huntingStatistics && name !== WW.MODULES.HUNTING_STATISTICS)
            getEngine().worldWindow.huntingStatistics.close();
        if (getEngine().worldWindow.activityPanel && name !== WW.MODULES.ACTIVITIES)
            getEngine().worldWindow.activityPanel.close();
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

        getEngine().windowManager.add({
            content: this.content,
            title: this.tLang('title'),
            nameWindow: getEngine().windowsData.name.WORLD,
            widget: getEngine().widgetsData.name.WORLD,
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

    tLang(name: string, category: string = 'world_window', val: {} | null = null) {
        return typeof RUNNING_UNIT_TEST === 'undefined' ? _t(name, val, category) : '';
    }

    closeOtherWindows() {
        const e = getEngine();
        const v = e.windowsData.windowCloseConfig.WORLD_WINDOW;
        e.windowCloseManager.callWindowCloseConfig(v);
    }

    close() {
        this.closeAll();
        this.windowClose();
    }
};