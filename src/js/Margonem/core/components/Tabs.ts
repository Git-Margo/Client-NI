import {
    isset
} from "@core/HelpersTS";

const Tpl = require('@core/Templates');

export interface Card {
    name: string;
    initAction ? : () => void;
    disabled ? : boolean;
    disabledTip ? : string;
    requireLvl ? : number;
    tabEl ? : HTMLElement;
    contentTargetEl ? : HTMLElement,
    afterShowFn ? : () => void;
}

export interface Cards {
    [name: string]: Card;
}

type TabOptions = {
    tabsEl: {
        navEl ? : HTMLElement;
        contentsEl: HTMLElement;
    }
};

type TabElements = {
    tab: HTMLElement;
    content ? : HTMLElement;
}

type TabElementList = {
    [key: string]: TabElements
};

const defaultOptions = {};

export default class Tabs {
    // public el: HTMLElement;
    public navEl!: HTMLElement;
    public contentsEl!: HTMLElement;
    public currentTab: string | null;
    private options: TabOptions;
    private tabElementList: TabElementList;

    constructor(private cards: Cards, options: TabOptions) {
        this.currentTab = null;
        this.tabElementList = {};
        this.options = {
            ...defaultOptions,
            ...options
        };
        this.createContent();
        this.createCards();
    }

    createContent() {
        // if (isTabElements(this.options.tabsEl)) {
        if (this.options.tabsEl.navEl) {
            this.navEl = this.options.tabsEl.navEl;
            this.navEl.classList.add('tabs-nav');
        }
        if (this.options.tabsEl.contentsEl) {
            this.contentsEl = this.options.tabsEl.contentsEl;
            this.contentsEl.classList.add('tabs-contents');
        }
    }

    createCards() {
        for (const key in this.cards) {
            this.createOneCard(key, this.cards[key]);
        }
    }

    createOneCard(slug: string, cardData: Card) {
        let $cardTab, $cardContent, $label;
        if (this.options.tabsEl.navEl) {
            $cardTab = Tpl.get('card')[0],
                $label = $cardTab.querySelector('.label');
            $cardTab.classList.add(`${slug}-tab`);
            $label.innerHTML = cardData.name;
        } else {
            $cardTab = cardData.tabEl;
        }

        if (isset(cardData.disabled) && cardData.disabled) {
            $cardTab.classList.add(`disabled`);
            if (cardData.disabledTip) {
                $($cardTab).tip(cardData.disabledTip);
            }
        }

        if (this.options.tabsEl.navEl) this.navEl.appendChild($cardTab);

        if (cardData.contentTargetEl) {
            $cardContent = cardData.contentTargetEl as HTMLElement;
        } else {
            if (this.contentsEl) {
                $cardContent = document.createElement('div') as HTMLElement;
                this.contentsEl.appendChild($cardContent);
            }
        }

        if ($cardContent) {
            this.addToTabElementList(slug, $cardTab, $cardContent);
            $cardContent.classList.add(`${slug}-content`);
            $cardContent.classList.add(`tabs-content-option`);
        } else {
            this.addToTabElementList(slug, $cardTab);
        }

        $cardTab.addEventListener('click', () => {
            if ($cardTab.classList.contains('disabled')) return;

            if (cardData.initAction) {
                cardData.initAction();
            } else {
                this.activateCard(slug);
            }
        });
    }

    setCurrentTab(slug: string) {
        this.currentTab = slug
    }

    getCurrentTab() {
        return this.currentTab
    }

    callAfterShowFn(slug: string) {
        let cardData = this.cards[slug];
        if (cardData.afterShowFn) cardData.afterShowFn();
    }

    activateCard(slug: string) {
        if (this.currentTab === slug) return;

        this.setCurrentTab(slug)
        this.addActiveForCurrentTab(slug);
        this.removeActiveForOtherTabs(slug);
        this.callAfterShowFn(slug);
    }

    addActiveForCurrentTab(slug: string) {
        const $cardTab = this.getCard(slug);
        const $cardContent = this.getCardContent(slug);
        $cardTab.classList.add('active');
        $cardContent?.classList.add('active');
    }

    removeActiveForOtherTabs(currentSlug: string) {
        const otherSlugs = Object.keys(this.tabElementList).filter(slug => slug !== currentSlug);

        otherSlugs.forEach(slug => {
            const tabElement = this.tabElementList[slug];
            tabElement.tab.classList.remove('active');
            tabElement.content?.classList.remove('active');
        });
    }

    addToTabElementList(slug: string, tab: HTMLElement, content ? : HTMLElement) {
        if (content !== undefined) {
            this.tabElementList[slug] = {
                tab,
                content
            };
        } else {
            this.tabElementList[slug] = {
                tab
            };
        }
    }

    private getCard(slug: string) {
        return this.tabElementList[slug].tab;
    }

    private getCardContent(slug: string) {
        return this.tabElementList[slug].content;
    }

    checkRequires() {
        for (const card in this.cards) {
            const cardData = this.cards[card];
            if (isset(cardData.disabled) && cardData.disabled) continue;

            const $cardTab = this.getCard(card);
            if (isset(cardData.requireLvl) && cardData.requireLvl && this.getEngine().hero.getLevel() < cardData.requireLvl) {
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

    getFirstAvailableCard() {
        for (const card in this.cards) {
            const cardData = this.cards[card];
            if (isset(cardData.disabled) && cardData.disabled) continue;
            if (this.checkOneCardRequires(card)) return card;
        }
    }

    canCardOpen(type: string) {
        const availableCard = this.getFirstAvailableCard();
        if (!this.checkOneCardRequires(type) && availableCard) {
            const cardData = this.cards[availableCard];
            if (cardData.initAction) {
                cardData.initAction();
            }
            return false;
        }
        return true;
    }

    checkOneCardRequires(cardName: string) {
        const cardData = this.cards[cardName];
        return !(isset(cardData.requireLvl) && cardData.requireLvl && this.getEngine().hero.getLevel() < cardData.requireLvl);
    }

    getEngine() {
        return Engine;
    }

    tLang(name: string, category: string = 'default', val: {} | null = null) {
        return typeof RUNNING_UNIT_TEST === 'undefined' ? _t(name, val, category) : '';
    }
};