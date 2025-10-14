import {
    getEngine
} from "@core/HelpersTS";

const Recipes = require('@core/crafting/recipes/Recipes');
import ItemCraft, {
    MODULES as ITEM_CRAFT_MODULES
} from "@core/crafting/ItemCraft";
import CraftingWindow from "@core/crafting/CraftingWindow";
import Tabs, {
    Cards
} from "@core/components/Tabs";

export const MODULES = {
    ITEM_CRAFT: 'item-craft',
    RECIPES: 'recipes'
}

export default class Crafting {
    private Tabs!: Tabs;
    private wndEl!: HTMLElement;
    private itemCraft: ItemCraft;
    private window!: CraftingWindow;
    private cards: Cards = {
        [MODULES.ITEM_CRAFT]: {
            name: this.tLang(MODULES.ITEM_CRAFT, 'crafting'),
            requireLvl: 20,
            initAction: () => {
                this.open(ITEM_CRAFT_MODULES.ENHANCEMENT);
            }
        },
        [MODULES.RECIPES]: {
            name: this.tLang('recipe'),
            initAction: () => {
                if (getEngine().hero.getLevel() >= 20) _g('craft&a=list')
            }
        },
    }

    constructor() {
        this.window = new CraftingWindow(this.tLang('crafting'));
        this.wndEl = this.window.getWindow();
        this.itemCraft = new ItemCraft(this.tLang('crafting'), this.wndEl);
        this.createTabs();
    }

    private createTabs() {
        const tabsOptions = {
            tabsEl: {
                navEl: this.wndEl.querySelector('.crafting__tabs') as HTMLElement,
                contentsEl: this.wndEl.querySelector('.crafting__contents') as HTMLElement,
            },
        };
        this.Tabs = new Tabs(this.cards, tabsOptions);
    };

    open(type: string, v ? : any) {
        const eng = getEngine();
        let subType = null;
        if (this.isItemCraftModule(type)) {
            subType = type;
            type = MODULES.ITEM_CRAFT;
        }
        if (!this.Tabs!.canCardOpen(type)) return;
        this.closeOthers(type);
        this.Tabs.activateCard(type);
        this.window.closeOtherWindows();

        let craftingModule = null;

        switch (type) {
            case MODULES.RECIPES:
                if (!eng.crafting.recipes) {
                    eng.crafting.recipes = new Recipes();
                    eng.crafting.recipes.init(this.wndEl);
                }
                eng.crafting.recipes.update(v);
                craftingModule = eng.crafting.recipes;
                break;
            case MODULES.ITEM_CRAFT:
                this.itemCraft.open(subType ?? 'default')
                craftingModule = eng.crafting.itemCraft;
                break;
        }

        this.Tabs?.checkRequires();
        this.window.windowOpen();

        if (craftingModule.updateScroll) craftingModule.updateScroll();
    };

    private isItemCraftModule(name: string) {
        return name === 'default' || Object.values(ITEM_CRAFT_MODULES).includes(name);
    }

    isOpen() {
        return this.window.opened;
    }

    private closeOthers(name: string) {
        if (getEngine().crafting.recipes && name !== MODULES.RECIPES) getEngine().crafting.recipes.close();
        if (getEngine().crafting.itemCraft && name !== MODULES.ITEM_CRAFT) getEngine().crafting.itemCraft.close();
    }

    private tLang(name: string, category: string = 'recipes', val: {} | null = null, ) {
        return typeof RUNNING_UNIT_TEST === "undefined" ? _t(name, val, category) : '';
    };

    triggerOpen() {
        _g('artisanship&action=open');
    }

    triggerClose() {
        this.window.close();
    }

}