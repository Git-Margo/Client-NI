import Tabs from '../components/Tabs';
import MailsData from './MailsData';

const Tpl = require('@core/Templates');

declare const _t: any;
declare const _g: any;
declare const Engine: any;

interface Card {
    name: string;
    initAction ? : () => void;
    disabled ? : boolean;
    disabledTip ? : string;
    requireLvl ? : number;
    afterShowFn ? : () => void;
}

type tabType = MailsData.RECEIVED | MailsData.SENT | MailsData.NEW_MAIL;

type Cards = {
    [name in tabType]: Card;
};

export default class MailsWindow {
    private currentTab!: string;
    private wnd: any;
    private wndEl!: HTMLElement;
    private content = '';
    private TabsInstance: null | Tabs = null;
    private cards: Cards = {
        [MailsData.RECEIVED]: {
            name: this.tLang('receive_box'),
            initAction: () => {
                _g('mail&page=1');
            },
        },
        [MailsData.SENT]: {
            name: this.tLang('send_box'),
            initAction: () => {
                _g('mail&action=showSent&page=1');
            },
        },
        [MailsData.NEW_MAIL]: {
            name: this.tLang('new_message'),
            afterShowFn: () => this.afterTabShow(MailsData.NEW_MAIL)
        },
    };

    constructor() {
        this.getEngine().lock.add('mails');
        this.closeOtherWindows();
        this.initWindow();
        this.createTabs();
    }

    getWindow() {
        return this.wnd.$;
    }

    createTabs() {
        const tabsOptions = {
            tabsEl: {
                navEl: this.wndEl.querySelector('.mails-window__tabs') as HTMLElement,
                contentsEl: this.wndEl.querySelector('.mails-window__contents') as HTMLElement,
            },
        };
        this.TabsInstance = new Tabs(this.cards, tabsOptions);
        // createCards
    }

    manualSelectTab(type: string) {
        if (this.TabsInstance) {
            this.TabsInstance.activateCard(type);
        }
        this.afterTabShow(type);
    }

    afterTabShow(type: string) {
        this.currentTab = type;

        switch (type) {
            case MailsData.RECEIVED:
                this.getEngine().mails.changedTab(MailsData.RECEIVED)
                break;
            case MailsData.SENT:
                this.getEngine().mails.changedTab(MailsData.SENT)
                break;
            case MailsData.NEW_MAIL:
                this.getEngine().mails.changedTab(MailsData.NEW_MAIL)
                break;
        }
    }

    closeAll() {}

    initWindow() {
        this.content = Tpl.get('mails-window');
        this.getEngine().windowManager.add({
            content: this.content,
            title: this.tLang('title '),
            nameWindow: this.getEngine().windowsData.name.MAIL_BOX,
            objParent: this,
            nameRefInParent: 'wnd',
            startVH: 60,
            cssVH: 60,
            onclose: () => {
                this.close();
            },
        });

        this.wnd.addToAlertLayer();
        this.wnd.setWndOnPeak();
        this.wnd.center();
        this.wndEl = this.wnd.$[0];
    }

    getEngine() {
        return Engine;
    }

    tLang(name: string, category: string = 'mails', val: {} | null = null) {
        return typeof RUNNING_UNIT_TEST === 'undefined' ? _t(name, val, category) : '';
    }

    closeOtherWindows() {
        const e = this.getEngine();
        const v = e.windowsData.windowCloseConfig.MAIL;
        e.windowCloseManager.callWindowCloseConfig(v);
    }

    close() {
        this.closeAll();
        this.wnd.hide();
        this.wnd.remove();
        this.getEngine().lock.remove('mails');
        this.getEngine().mails.close();
    }
};