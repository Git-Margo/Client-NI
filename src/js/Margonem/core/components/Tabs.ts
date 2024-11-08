export {};

declare const _g: any;
declare const _t: any;
declare const siblings: any;
declare const Engine: any;
declare const isset: any;

const Tpl = require('core/Templates');

interface Card {
    name: string;
    initAction ? : () => void;
    disabled ? : boolean;
    disabledTip ? : string;
    requireLvl ? : number;
    afterShowFn ? : () => void;
}

interface Cards {
    [name: string]: Card;
}

type TabElements = {
    navEl: HTMLElement;
    contentsEl: HTMLElement;
};

type TabOptions = {
    tabsEl: TabElements | HTMLElement;
};

function isTabElements(obj: any): obj is TabElements {
    return obj.navEl !== undefined;
}

const defaultOptions = {};

export default class Tabs {
    // public el: HTMLElement;
    public navEl!: HTMLElement;
    public contentsEl!: HTMLElement;
    public opened: boolean = false;
    private options: TabOptions;

    constructor(private cards: Cards, options: TabOptions) {
        this.options = {
            ...defaultOptions,
            ...options
        };
        this.createContent();
        this.createCards();
    }

    createContent() {
        if (isTabElements(this.options.tabsEl)) {
            this.navEl = this.options.tabsEl.navEl;
            this.contentsEl = this.options.tabsEl.contentsEl;
        } else {
            this.navEl = document.createElement('div');
            this.contentsEl = document.createElement('div');
            this.options.tabsEl.appendChild(this.navEl);
            this.options.tabsEl.appendChild(this.contentsEl);
        }

        this.navEl.classList.add('tabs-nav');
        this.contentsEl.classList.add('tabs-contents');
    }

    createCards() {
        for (const key in this.cards) {
            this.createOneCard(key, this.cards[key]);
        }
    }

    createOneCard(slug: string, cardData: Card) {
        const $cardTab = Tpl.get('card')[0],
            $label = $cardTab.querySelector('.label');

        $cardTab.classList.add(`${slug}-tab`);
        $label.innerHTML = cardData.name;

        if (isset(cardData.disabled) && cardData.disabled) {
            $cardTab.classList.add(`disabled`);
            if (cardData.disabledTip) {
                $($cardTab).tip(cardData.disabledTip);
            }
        }

        this.navEl.appendChild($cardTab);
        let $cardContent = document.createElement('div');
        $cardContent.classList.add(`${slug}-content`);
        this.contentsEl.appendChild($cardContent);

        $cardTab.addEventListener('click', () => {
            if ($cardTab.classList.contains('disabled')) return;

            if (cardData.initAction) {
                cardData.initAction();
            } else {
                this.activateCard(slug);
                if (cardData.afterShowFn) cardData.afterShowFn();
            }
        });
    }

    activateCard(slug: string) {
        const $cardTab = this.navEl.querySelector(`.${slug}-tab`) as HTMLElement;
        const $cardContent = this.contentsEl.querySelector(`.${slug}-content`) as HTMLElement;

        $cardTab.classList.add('active');
        $cardContent.classList.add('active');

        const $siblingsTab = siblings($cardTab);
        const $siblingsContent = siblings($cardContent);

        $siblingsTab.forEach((el: HTMLElement) => el.classList.remove('active'));
        $siblingsContent.forEach((el: HTMLElement) => el.classList.remove('active'));
    }

    checkRequires() {
        for (const card in this.cards) {
            const cardData = this.cards[card];
            if (isset(cardData.disabled) && cardData.disabled) continue;

            const $cardTab = this.navEl.querySelector(`.${card}-tab`) as HTMLElement;
            if (isset(cardData.requireLvl) && cardData.requireLvl && this.getEngine().hero.d.lvl < cardData.requireLvl) {
                $cardTab.classList.add(`disabled`);
                $($cardTab).tip(this.tLang('need__lvl', 'default', {
                    '%val%': cardData.requireLvl
                }));
            } else {
                $cardTab.classList.remove(`disabled`);
                $($cardTab).tip('');
            }
        }
    }

    getEngine() {
        return Engine;
    }

    tLang(name: string, category: string = 'default', val: {} | null = null) {
        return typeof RUNNING_UNIT_TEST === 'undefined' ? _t(name, val, category) : '';
    }
};