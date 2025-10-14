import {
    getEngine,
    isTestWorld
} from '@core/HelpersTS';
import Tabs, {
    Cards
} from "@core/components/Tabs";
import Salvage from "@core/crafting/salvage/Salvage";
import Enhancement from "@core/crafting/enhancement/Enhancement";
import Extraction from "@core/crafting/extraction/Extraction";
import SocketEnchantment from "@core/crafting/sockets/SocketEnchantment";
import SocketExtraction from '@core/crafting/sockets/SocketExtraction';
import SocketComposition from "@core/crafting/sockets/SocketComposition";

const Tpl = require('@core/Templates');

export const MODULES = {
    ENHANCEMENT: 'enhancement',
    SALVAGE: 'salvage',
    EXTRACTION: 'extraction',
    SOCKET_ENCHANTMENT: 'socket_enchantment',
    SOCKET_EXTRACTION: 'socket_extraction',
    SOCKET_COMPOSITION: 'socket_composition',
}

const groups = [{
        id: 1,
        slug: 'item-power',
        name: _t('cat_item-power', null, 'crafting'),
        tabs: [{
                slug: MODULES.ENHANCEMENT,
                name: _t(MODULES.ENHANCEMENT, null, 'enhancement')
            },
            {
                slug: MODULES.SALVAGE,
                name: _t(MODULES.SALVAGE, null, 'salvager')
            },
            {
                slug: MODULES.EXTRACTION,
                name: _t(MODULES.EXTRACTION, null, 'extraction')
            },
        ]
    },
    // { id: 2, slug: 'item-level', name: _t('cat_item-level', null, 'crafting')},
    {
        id: 3,
        slug: 'item-sockets',
        name: _t('cat_item-socket', null, 'crafting'),
        tabs: [{
                slug: MODULES.SOCKET_COMPOSITION,
                name: _t(MODULES.SOCKET_COMPOSITION, null, 'crafting')
            },
            {
                slug: MODULES.SOCKET_ENCHANTMENT,
                name: _t(MODULES.SOCKET_ENCHANTMENT, null, 'crafting')
            },
            {
                slug: MODULES.SOCKET_EXTRACTION,
                name: _t(MODULES.SOCKET_EXTRACTION, null, 'crafting')
            },
        ]
    },
    // { id: 4, slug: 'teleportation', name: _t('cat_teleportation', null, 'crafting') },
    // { id: 5, slug: 'others', name: _t('cat_others', null, 'crafting') },
];


export default class ItemCraft {
    private readonly engine = Engine;
    public opened: boolean = false;
    private Tabs: null | Tabs = null;
    private contentEl!: HTMLElement;
    private cards: Cards = {}

    constructor(title: string, private wndEl: HTMLElement) {

    }

    open(type = MODULES.ENHANCEMENT) {
        if (!this.opened) {
            this.createContent();
            this.createNavigation();
            this.createTabs();
            this.initSearch();
            this.initScrollsBar();
        }
        this.opened = true;

        if (type === 'default') type = MODULES.ENHANCEMENT;
        if (!this.Tabs!.canCardOpen(type)) return;
        this.closeOthers(type);

        if (this.Tabs) {
            this.Tabs.activateCard(type);
        }

        const eng = this.engine;
        let craftingModule = null;
        switch (type) {
            case MODULES.SALVAGE:
                if (!eng.crafting[MODULES.SALVAGE]) {
                    eng.crafting[MODULES.SALVAGE] = new Salvage(this.wndEl);
                }
                craftingModule = eng.crafting[MODULES.SALVAGE];
                break;
            case MODULES.ENHANCEMENT:
                if (!eng.crafting[MODULES.ENHANCEMENT]) {
                    eng.crafting[MODULES.ENHANCEMENT] = new Enhancement(this.wndEl);
                }
                craftingModule = eng.crafting[MODULES.ENHANCEMENT];
                break;
            case MODULES.EXTRACTION:
                if (!eng.crafting[MODULES.EXTRACTION]) {
                    eng.crafting[MODULES.EXTRACTION] = new Extraction(this.wndEl);
                }
                craftingModule = eng.crafting[MODULES.EXTRACTION];
                break;
            case MODULES.SOCKET_ENCHANTMENT:
                if (!eng.crafting[MODULES.SOCKET_ENCHANTMENT]) {
                    eng.crafting[MODULES.SOCKET_ENCHANTMENT] = new SocketEnchantment(this.wndEl);
                }
                craftingModule = eng.crafting[MODULES.SOCKET_ENCHANTMENT];
                break;
            case MODULES.SOCKET_EXTRACTION:
                if (!eng.crafting[MODULES.SOCKET_EXTRACTION]) {
                    eng.crafting[MODULES.SOCKET_EXTRACTION] = new SocketExtraction(this.wndEl);
                }
                craftingModule = eng.crafting[MODULES.SOCKET_EXTRACTION];
                break;
            case MODULES.SOCKET_COMPOSITION:
                if (!eng.crafting[MODULES.SOCKET_COMPOSITION]) {
                    eng.crafting[MODULES.SOCKET_COMPOSITION] = new SocketComposition(this.wndEl);
                }
                craftingModule = eng.crafting[MODULES.SOCKET_COMPOSITION];
                break;
        }

        this.Tabs?.checkRequires();
        if (craftingModule!.updateScroll) craftingModule!.updateScroll();
    }

    createTabs() {
        this.cards = {
            [MODULES.ENHANCEMENT]: {
                name: _t(MODULES.ENHANCEMENT, null, 'enhancement'),
                requireLvl: 20,
                tabEl: this.contentEl.querySelector(`[data-tab-id='${MODULES.ENHANCEMENT}']`) as HTMLElement,
                initAction: () => {
                    this.open(MODULES.ENHANCEMENT);
                }
            },
            [MODULES.SALVAGE]: {
                name: _t(MODULES.SALVAGE, null, 'salvager'),
                requireLvl: 20,
                tabEl: this.contentEl.querySelector(`[data-tab-id='${MODULES.SALVAGE}']`) as HTMLElement,
                initAction: () => {
                    this.open(MODULES.SALVAGE);
                }
            },
            [MODULES.EXTRACTION]: {
                name: _t(MODULES.EXTRACTION, null, 'extraction'),
                requireLvl: 20,
                tabEl: this.contentEl.querySelector(`[data-tab-id='${MODULES.EXTRACTION}']`) as HTMLElement,
                initAction: () => {
                    this.open(MODULES.EXTRACTION);
                }
            },
            [MODULES.SOCKET_ENCHANTMENT]: {
                name: _t(MODULES.SOCKET_ENCHANTMENT, null, 'crafting'),
                requireLvl: 20,
                disabled: !isTestWorld(),
                tabEl: this.contentEl.querySelector(`[data-tab-id='${MODULES.SOCKET_ENCHANTMENT}']`) as HTMLElement,
                initAction: () => {
                    this.open(MODULES.SOCKET_ENCHANTMENT);
                }
            },
            [MODULES.SOCKET_EXTRACTION]: {
                name: _t(MODULES.SOCKET_EXTRACTION, null, 'crafting'),
                requireLvl: 20,
                disabled: !isTestWorld(),
                tabEl: this.contentEl.querySelector(`[data-tab-id='${MODULES.SOCKET_EXTRACTION}']`) as HTMLElement,
                initAction: () => {
                    this.open(MODULES.SOCKET_EXTRACTION);
                }
            },
            [MODULES.SOCKET_COMPOSITION]: {
                name: _t(MODULES.SOCKET_COMPOSITION, null, 'crafting'),
                requireLvl: 20,
                disabled: !isTestWorld(),
                tabEl: this.contentEl.querySelector(`[data-tab-id='${MODULES.SOCKET_COMPOSITION}']`) as HTMLElement,
                initAction: () => {
                    this.open(MODULES.SOCKET_COMPOSITION);
                }
            },
        }

        const tabsOptions = {
            tabsEl: {
                contentsEl: this.contentEl.querySelector('.item-craft__tab-contents') as HTMLElement,
            },
        };
        this.Tabs = new Tabs(this.cards, tabsOptions);
    }

    createNavigation() {
        for (const group of groups) {
            this.createGroupElement(group);
        }
    }

    createGroupElement(group: any) {
        const category = group.slug;
        const offerGroupEl = Tpl.get('divide-list-group')[0] as HTMLElement;
        const offerGroupHeaderEl = offerGroupEl.querySelector('.group-header') as HTMLElement;

        offerGroupEl.classList.add(`group-${category}`, 'active');
        offerGroupEl.querySelector('.label') !.innerHTML = group.name;
        this.wndEl.querySelector('.items-list') !.appendChild(offerGroupEl);
        offerGroupHeaderEl.addEventListener('click', () => {
            offerGroupEl?.classList.toggle('active');
        });

        if (!group.tabs) return;
        for (const tab of group.tabs) {
            const tabEl = this.createGroupItem(tab);
            offerGroupEl.querySelector('.group-list') !.appendChild(tabEl);
        }
    }

    createGroupItem(data: any) {
        let one = Tpl.get('one-item-on-divide-list')[0];
        one.classList.add('crafting-recipe-in-list');

        one.dataset.tabId = data.slug
        one.querySelector('.name').innerHTML = data.name;

        return one;
    }

    createContent() {
        const template = Tpl.get('left-grouped-list-and-right-description-window')[0];
        this.contentEl = this.wndEl.querySelector('.item-craft-content') as HTMLElement;
        this.contentEl.innerHTML = '';
        this.contentEl.appendChild(template);

        this.setBackground();
        this.createTabContent();
    }

    setBackground() {
        const backgroundEl = this.contentEl.querySelector('.right-column .interface-element-middle-2-background-stretch') as HTMLElement;
        backgroundEl.classList.remove('interface-element-middle-2-background-stretch');
        backgroundEl.classList.add('interface-element-middle-1-background-stretch');
    }

    createTabContent() {
        const itemCraftTabContentsEl = document.createElement('div');
        itemCraftTabContentsEl.classList.add('item-craft__tab-contents')
        const scrollPaneEl = this.contentEl.querySelector('.right-column .scroll-pane') as HTMLElement;
        scrollPaneEl.innerHTML = '';
        scrollPaneEl.appendChild(itemCraftTabContentsEl);
    }

    initSearch() {
        const searchInput = this.wndEl.querySelector('.search') as HTMLInputElement;
        const searchX = this.wndEl.querySelector('.search-x') as HTMLElement;

        searchInput.addEventListener('keyup', () => {
            this.startFilter();
        });

        searchInput.setAttribute('placeholder', _t('search'));

        searchX.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.blur();
            this.startFilter();
        });
    }

    startFilter() {
        const searchInput = this.wndEl.querySelector < HTMLInputElement > ('.search');
        const searchValue = searchInput?.value?.trim().toLowerCase() || '';
        const allItems = this.wndEl.querySelectorAll < HTMLElement > ('.one-item-on-divide-list');

        allItems.forEach(item => {
            const nameElement = item.querySelector('.name');
            const itemText = nameElement?.textContent?.toLowerCase() || '';

            const shouldShow = !searchValue || itemText.includes(searchValue);
            item.classList.toggle('hide', !shouldShow);
        });
    }

    closeAll() {
        if (this.engine.crafting[MODULES.SALVAGE]) this.engine.crafting[MODULES.SALVAGE].close();
        if (this.engine.crafting[MODULES.ENHANCEMENT]) this.engine.crafting[MODULES.ENHANCEMENT].close();
        if (this.engine.crafting[MODULES.EXTRACTION]) this.engine.crafting[MODULES.EXTRACTION].close();
        if (this.engine.crafting[MODULES.SOCKET_ENCHANTMENT]) this.engine.crafting[MODULES.SOCKET_ENCHANTMENT].close();
        if (this.engine.crafting[MODULES.SOCKET_EXTRACTION]) this.engine.crafting[MODULES.SOCKET_EXTRACTION].close();
        if (this.engine.crafting[MODULES.SOCKET_COMPOSITION]) this.engine.crafting[MODULES.SOCKET_COMPOSITION].close();

    }

    closeOthers(name: string) {
        if (this.engine.crafting[MODULES.SALVAGE] && name !== MODULES.SALVAGE) this.engine.crafting[MODULES.SALVAGE].close();
        if (this.engine.crafting[MODULES.ENHANCEMENT] && name !== MODULES.ENHANCEMENT) this.engine.crafting[MODULES.ENHANCEMENT].close();
        if (this.engine.crafting[MODULES.EXTRACTION] && name !== MODULES.EXTRACTION) this.engine.crafting[MODULES.EXTRACTION].close();
        if (this.engine.crafting[MODULES.SOCKET_ENCHANTMENT] && name !== MODULES.SOCKET_ENCHANTMENT) this.engine.crafting[MODULES.SOCKET_ENCHANTMENT].close();
        if (this.engine.crafting[MODULES.SOCKET_EXTRACTION] && name !== MODULES.SOCKET_EXTRACTION) this.engine.crafting[MODULES.SOCKET_EXTRACTION].close();
        if (this.engine.crafting[MODULES.SOCKET_COMPOSITION] && name !== MODULES.SOCKET_COMPOSITION) this.engine.crafting[MODULES.SOCKET_COMPOSITION].close();
    }

    closeOtherWindows() {
        const e = this.engine;
        const v = e.windowsData.windowCloseConfig.CRAFTING;
        e.windowCloseManager.callWindowCloseConfig(v);
    }

    close() {
        this.closeAll();
        this.opened = false;
    };

    initScrollsBar() {
        $('.left-scroll', this.contentEl).addScrollBar({
            track: true
        });
        $('.right-scroll', this.contentEl).addScrollBar({
            track: true
        });
    };

    updateScroll() {
        $('.left-scroll', this.contentEl).trigger('update');
        $('.right-scroll', this.contentEl).trigger('update');
    };

}