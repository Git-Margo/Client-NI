export {}

declare const _g: any;
declare const _t: any;
declare const siblings: any;
declare const Engine: any;
declare const isset: any;

const Tpl = require('core/Templates');
const TutorialData = require('core/tutorial/TutorialData');
const Recipes = require('core/crafting/recipes/Recipes');
import Salvage from './salvage/Salvage';
import Enhancement from './enhancement/Enhancement';
import Extraction from './extraction/Extraction';

interface Card {
    name: string;
    initAction ? : () => void;
    disabled ? : boolean
    requireLvl ? : number
}

interface Cards {
    [name: string]: Card
}

module.exports = class Crafting {
    public opened: boolean = false;
    private currentTab!: string;
    private wnd: any;
    private wndEl!: HTMLElement;
    private content = '';
    private cards: Cards = {
        enhancement: {
            name: this.tLang('enhancement', 'enhancement'),
            requireLvl: 20
            // initAction: () => {
            // 	_g('enhancement&action=show')
            // }
        },
        salvage: {
            name: this.tLang('salvage', 'salvager'),
            requireLvl: 20
        },
        extraction: {
            name: this.tLang('extraction', 'extraction'),
            requireLvl: 20
            // disabled: true
        },
        recipes: {
            name: this.tLang('recipe'),
            initAction: () => {
                _g('craft&a=list')
            }
        },
    }

    constructor() {

    }

    init() {
        this.initWindow();
        this.centerWindow();
        this.createCards();
    };

    open(type: string, v ? : any) {
        if (type === 'default') type = 'enhancement';
        this.closeOthers(type);
        const eng = this.getEngine();
        if (!this.canCardOpen(type)) return;

        this.activateCard(type);
        this.currentTab = type;
        this.closeOtherWindows();

        let craftingModule = null;

        switch (type) {
            case 'recipes':
                if (!eng.crafting.recipes) {
                    eng.crafting.recipes = new Recipes();
                    eng.crafting.recipes.init();
                }
                eng.crafting.recipes.update(v);
                craftingModule = eng.crafting.recipes;
                break;
            case 'salvage':
                if (!eng.crafting.salvage) {
                    eng.crafting.salvage = new Salvage(this.wndEl);
                }
                craftingModule = eng.crafting.salvage;
                break;
            case 'enhancement':
                if (!eng.crafting.enhancement) {
                    eng.crafting.enhancement = new Enhancement(this.wndEl);
                }
                craftingModule = eng.crafting.enhancement;
                // eng.crafting.enhancement.update(v);
                break;
            case 'extraction':
                if (!eng.crafting.extraction) {
                    eng.crafting.extraction = new Extraction(this.wndEl);
                }
                craftingModule = eng.crafting.extraction;
                // eng.crafting.enhancement.update(v);
                break;
        }

        this.windowOpen();

        if (craftingModule.updateScroll) craftingModule.updateScroll();
    };

    closeAll() {
        if (this.getEngine().crafting.recipes) this.getEngine().crafting.recipes.close();
        if (this.getEngine().crafting.salvage) this.getEngine().crafting.salvage.close();
        if (this.getEngine().crafting.enhancement) this.getEngine().crafting.enhancement.close();
        if (this.getEngine().crafting.extraction) this.getEngine().crafting.extraction.close();
    }

    closeOthers(name: string) {
        if (this.getEngine().crafting.recipes && name !== 'recipes') this.getEngine().crafting.recipes.close();
        if (this.getEngine().crafting.salvage && name !== 'salvage') this.getEngine().crafting.salvage.close();
        if (this.getEngine().crafting.enhancement && name !== 'enhancement') this.getEngine().crafting.enhancement.close();
        if (this.getEngine().crafting.extraction && name !== 'extraction') this.getEngine().crafting.extraction.close();
    }

    createCards() {
        for (const key in this.cards) {
            this.createOneCard(key, this.cards[key]);
        }
    };

    createOneCard(slug: string, cardData: Card) {
        const
            $cardTab = Tpl.get('card')[0],
            $cardContents = this.wndEl.querySelector('.crafting__contents') as HTMLElement,
            $header = this.wndEl.querySelector('.crafting__tabs .cards-header') as HTMLElement,
            $label = $cardTab.querySelector('.label');

        $cardTab.classList.add(`${slug}-tab`);
        $label.innerHTML = cardData.name;

        if (isset(cardData.disabled) && cardData.disabled) {
            $cardTab.classList.add(`disabled`);
            $($cardTab).tip(this.tLang('coming_soon', 'default'));
        }

        $header.appendChild($cardTab);
        let $cardContent = document.createElement("div");
        $cardContent.classList.add(`${slug}-content`);
        $cardContents.appendChild($cardContent);

        $cardTab.addEventListener('click', () => {
            if ($cardTab.classList.contains('disabled')) return;
            //if (isset(cardData.disabled) && cardData.disabled) return;

            if (cardData.initAction) {
                cardData.initAction();
            } else {
                this.open(slug);
            }
        });
    };

    activateCard(slug: string) {
        const $cardTab = this.wndEl.querySelector(`.crafting__tabs .${slug}-tab`) as HTMLElement;
        const $cardContent = this.wndEl.querySelector(`.crafting__contents .${slug}-content`) as HTMLElement;

        $cardTab.classList.add('active');
        $cardContent.classList.add('active');

        const $siblingsTab = siblings($cardTab);
        const $siblingsContent = siblings($cardContent);

        $siblingsTab.forEach((el: HTMLElement) => el.classList.remove('active'));
        $siblingsContent.forEach((el: HTMLElement) => el.classList.remove('active'));
    }

    setCardRequires() {
        for (const card in this.cards) {
            const cardData = this.cards[card];
            if (isset(cardData.disabled) && cardData.disabled) continue;

            const $cardTab = this.wndEl.querySelector(`.crafting__tabs .${card}-tab`) as HTMLElement;
            if (this.checkOneCardRequires(card)) {
                $cardTab.classList.remove(`disabled`);
                $($cardTab).tip('');
            } else {
                $cardTab.classList.add(`disabled`);
                $($cardTab).tip(this.tLang('need__lvl', 'default', {
                    '%val%': cardData.requireLvl
                }));
            }
        }
    }

    checkOneCardRequires(cardName: string) {
        const cardData = this.cards[cardName];
        return !(isset(cardData.requireLvl) && cardData.requireLvl && this.getEngine().hero.d.lvl < cardData.requireLvl);
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
            } else {
                this.open(availableCard);
            }
            return false;
        }
        return true;
    }

    manageVisible() {
        if (!this.opened) {
            this.closeOtherWindows();
            this.windowOpen();
        } else {
            this.windowClose();
        }
    };

    windowOpen() {
        this.setCardRequires();
        this.wnd.show();
        this.opened = true;
        this.wnd.setWndOnPeak();
        Engine.lock.add('crafting');
    };

    windowClose() {
        this.wnd.hide();
        this.opened = false;
        Engine.lock.remove('crafting');
    };

    initWindow() {
        this.content = Tpl.get('crafting');

        this.getEngine().windowManager.add({
            content: this.content,
            title: this.tLang('crafting'),
            //nameWindow        : 'Recipes',
            nameWindow: this.getEngine().windowsData.name.CRAFTING,
            widget: this.getEngine().widgetsData.name.CRAFTING,
            objParent: this,
            nameRefInParent: 'wnd',
            startVH: 60,
            cssVH: 60,
            onclose: () => {
                this.triggerClose();
            }
        });

        this.wnd.addToAlertLayer();
        this.windowClose();
        this.wndEl = this.wnd.$[0];
    };

    centerWindow() {
        this.wnd.center();
    };

    getEngine() {
        return Engine;
    }

    tLang(name: string, category: string = 'recipes', val: {} | null = null, ) {
        return typeof RUNNING_UNIT_TEST === "undefined" ? _t(name, val, category) : '';
    };

    closeOtherWindows() {
        const e = this.getEngine();
        const v = e.windowsData.windowCloseConfig.CRAFTING;
        e.windowCloseManager.callWindowCloseConfig(v);
    }

    callCheckCanFinishExternalTutorialCloseBarter() {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_BREAK.CLOSE_CRAFTING,
            TutorialData.ON_FINISH_TYPE.BREAK,
            true
        );

        this.getEngine().tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger);
    };

    close() {
        //this.wnd.remove();
        this.closeAll();
        this.windowClose()
        this.callCheckCanFinishExternalTutorialCloseBarter();
        delete this.getEngine().crafting.recipes;
    };

    triggerOpen() {
        _g('artisanship&action=open');
    }

    triggerClose() {
        this.close();
    }

}