import {
    npcRarity,
    npcRarityData
} from '../../characters/NpcRarityData';
import Pagination from './HuntingStatisticsPagination';
import Request from './HuntingStatisticsRequest';
import Sorting from './HuntingStatisticsSort';
import {
    debounce,
    esc,
    isset,
    triggerEvent
} from '../../HelpersTS';
import {
    DIFFICULTIES,
    SORT_ORDER,
    TABLE_HEADERS
} from './HuntingStatisticsData';

const Tpl = require('core/Templates');

declare const _t: (name: string, val ? : string | {} | null, category ? : string) => string;
declare const createNiInput: (data: {}) => JQuery;

type lootParams = {
    gain: number;
    seen: number;
}

type Loot = {
    Common ? : lootParams;
    Heroic ? : lootParams;
    Unique ? : lootParams;
    Legendary ? : lootParams;
};

type Npc = {
    name: string;
    level: number;
    rarity: keyof typeof npcRarity; //'Elite' | 'Elite2' | 'Elite3' | 'Hero' | 'Titan';
    prof: string;
    icon: string;
    warrior_type: number;
    difficulty: keyof typeof DIFFICULTIES;
};

type Statistic = {
    kills: number;
    loot: Loot;
    npc: Npc;
    ordinal_number: number;
};

enum NpcTypes {
    EVENT = "EVENT",
        ARCHAIC = "ARCHAIC"
}

type Search = {
    page: number;
    nick: string;
    minLvl: '' | number;
    maxLvl: '' | number;
    rarity: string;
    type: string;
};

type Response = {
    show: {
        page: {
            number: number;
            total: number;
        };
        totalCount: number;
        statistics: Statistic[];
    };
};

type Options = {
    filters ? : Search;
};

export default class HuntingStatistics {
    private contentEl!: HTMLElement;
    private tabContentEl!: HTMLElement;
    private tableEl!: HTMLElement;
    private tableHeadersEl!: HTMLElement;
    private $raritySelect!: JQuery;
    private $typeSelect!: JQuery;
    private pagination: Pagination;
    private request: Request;
    sorting: Sorting;
    private search: Search = {
        page: 1,
        nick: '',
        minLvl: '',
        maxLvl: '',
        rarity: '',
        type: ''
    };

    constructor(private wndEl: HTMLElement, private options: Options = {}) {
        // debugger;
        this.getEngine().huntingStatistics = true;

        this.request = new Request(this);
        this.pagination = new Pagination();
        this.sorting = new Sorting();

        this.setContent();
        this.initSearch();
        this.setFilters();
        this.getData();
    }

    setContent() {
        this.contentEl = Tpl.get('hunting-statistics')[0];
        this.tableEl = this.contentEl.querySelector('.hunting-statistics-table') as HTMLElement;
        this.tableHeadersEl = this.contentEl.querySelector('.hunting-statistics-table-header .hunting-statistics__head') as HTMLElement;
        this.tabContentEl = this.wndEl.querySelector('.hunting-statistics-content') as HTMLElement;
        this.tabContentEl.innerHTML = '';
        this.tabContentEl.appendChild(this.contentEl);

        this.initScrollbar();
    }

    createTableHeader() {
        const hoverClass = 'can-hover';
        const sortTipText = _t('sort', null, 'buttons');

        for (const header of TABLE_HEADERS) {
            const thEl = document.createElement("th");
            thEl.classList.add(`hunting-statistics__head-${header.key}`);
            if (isset(header.default)) thEl.classList.add(`hunting-statistics__head-${header.key}`);
            thEl.textContent = _t(header.key, null, 'hunting_statistics');
            if (header.sort) {
                thEl.classList.add(hoverClass);
                $(thEl).tip(sortTipText);
                thEl.addEventListener('click', () => this.sorting.callChangeSort(header.key));
            }
            thEl.className += this.getSortClass(header.key);
            this.tableHeadersEl.appendChild(thEl);
        }
    }

    getSortClass(name: string) {
        const sortType = this.sorting.getSortType();
        const sortOrder = this.sorting.getSortOrder();
        let sortClass;

        if (sortType !== name) sortClass = '';
        else sortClass = ' sort-arrow ' + (sortOrder === SORT_ORDER.DESC ? 'sort-arrow-down' : 'sort-arrow-up');

        return sortClass;
    };

    createItems(statistics: Statistic[]) {
        for (const statistic of statistics) {
            this.tableEl.appendChild(this.createItem(statistic));
        }
    }

    createItem(statistic: Statistic) {
        const {
            kills,
            loot,
            npc
        } = statistic;
        const itemEl = Tpl.get('hunting-statistics-item')[0] as HTMLElement,
            nameEl = itemEl.querySelector('.hunting-statistics-item__name') as HTMLElement,
            lvlEl = itemEl.querySelector('.hunting-statistics-item__level') as HTMLElement,
            killsEl = itemEl.querySelector('.hunting-statistics-item__kills') as HTMLElement,
            uniqueEl = itemEl.querySelector('.hunting-statistics-item__unique') as HTMLElement,
            heroicEl = itemEl.querySelector('.hunting-statistics-item__heroic') as HTMLElement,
            legendaryEl = itemEl.querySelector('.hunting-statistics-item__legendary') as HTMLElement;

        nameEl.innerHTML = npc.name;
        lvlEl.innerHTML = String(npc.level) + npc.prof;
        killsEl.innerHTML = String(kills);
        uniqueEl.innerHTML = loot.Unique ? `${loot.Unique.gain} (${loot.Unique.seen})` : '-';
        heroicEl.innerHTML = loot.Heroic ? `${loot.Heroic.gain} (${loot.Heroic.seen})` : '-';
        legendaryEl.innerHTML = loot.Legendary ? `${loot.Legendary.gain} (${loot.Legendary.seen})` : '-';

        const tipContent = Engine.npcs.getTip({
            ...npc,
            d: {
                nick: npc.name,
                lvl: npc.level,
                wt: npc.warrior_type,
                ...npc
            }
        });
        const difficulty = this.getNpcDifficulty(npc);
        const icon = `<div class="mt-2 text-center"><img src="${CFG.a_npath + npc.icon}" style="display: inline-block; max-width: 100%;"></div>`;
        $(nameEl).tip(tipContent + '<br>' + difficulty + icon);

        return itemEl;
    }

    getNpcDifficulty(npc: Npc): string {
        return npc.difficulty ? this.tLang('difficulty_' + DIFFICULTIES[npc.difficulty]) : '';
    }

    update(data: Response) {
        if (data.show.page) {
            this.pagination.updatePages(data.show.page);
        }

        if (this.pagination.isFirstPageUpdate()) {
            this.tableEl.replaceChildren();
            this.tableHeadersEl.replaceChildren();
            this.createTableHeader();
        }

        this.createItems(data.show.statistics);

        if (this.pagination.isFirstPageUpdate()) {
            this.updateScrollbar();
            this.scrollTop();
        }
        this.updateBarPos();
    }

    initSearch() {
        const searchInputEl = this.contentEl.querySelector('.search') as HTMLInputElement,
            searchXEl = this.contentEl.querySelector('.search-x') as HTMLElement,
            minLvlWrapperEl = this.contentEl.querySelector('.start-lvl-wrapper') as HTMLInputElement,
            maxLvlWrapperEl = this.contentEl.querySelector('.stop-lvl-wrapper') as HTMLInputElement,
            raritySelectEl = this.contentEl.querySelector('.choose-prof') as HTMLInputElement,
            typeSelectEl = this.contentEl.querySelector('.choose-type') as HTMLInputElement,
            // loadButtonEL = this.contentEl.querySelector('.load') as HTMLInputElement,
            minLvlEl = createNiInput({
                cl: 'start-lvl',
                placeholder: _t('start'),
                changeClb: debounce((val: string) => this.minLvlOnChange(val), 300),
                clearClb: () => this.minLvlOnChange(''),
                type: 'number',
            })[0],
            maxLvlEl = createNiInput({
                cl: 'stop-lvl',
                placeholder: _t('stop'),
                changeClb: debounce((val: string) => this.maxLvlOnChange(val), 300),
                clearClb: () => this.maxLvlOnChange(''),
                type: 'number',
            })[0];

        // const loadButton = new Button({
        //   text: _t('refresh', null, 'buttons'),
        //   classes: ['small', 'green'],
        //   action: () => {
        //     this.getData();
        //   },
        // });

        minLvlWrapperEl.appendChild(minLvlEl);
        maxLvlWrapperEl.appendChild(maxLvlEl);
        // loadButtonEL.appendChild(loadButton.getButton());

        searchInputEl.addEventListener(
            'input',
            debounce(({
                target
            }: Event) => {
                this.nickOnChange((target as HTMLInputElement).value);
            }, 300),
        );

        searchXEl.addEventListener('click', function() {
            searchInputEl.value = '';
            triggerEvent(searchInputEl, 'input');
        });

        const npcRarities = [{
                val: 'all',
                text: _t('prof_all', null, 'auction')
            },
            {
                val: npcRarity.ELITE,
                text: npcRarityData[npcRarity.ELITE].name
            },
            {
                val: npcRarity.ELITE2,
                text: npcRarityData[npcRarity.ELITE2].name
            },
            {
                val: npcRarity.ELITE3,
                text: npcRarityData[npcRarity.ELITE3].name
            },
            {
                val: npcRarity.HERO,
                text: npcRarityData[npcRarity.HERO].name
            },
            {
                val: npcRarity.COLOSSUS,
                text: npcRarityData[npcRarity.COLOSSUS].name
            },
            {
                val: npcRarity.TITAN,
                text: npcRarityData[npcRarity.TITAN].name
            },
        ];

        this.$raritySelect = $(raritySelectEl);
        this.$raritySelect.createMenu(npcRarities, true, (value) => {
            this.rarityOnChange(value);
        });

        const npcTypes = [{
                val: 'all',
                text: _t('prof_all', null, 'auction')
            },
            {
                val: NpcTypes.EVENT,
                text: this.tLang(NpcTypes.EVENT)
            },
            {
                val: NpcTypes.ARCHAIC,
                text: this.tLang(NpcTypes.ARCHAIC)
            },
        ];

        this.$typeSelect = $(typeSelectEl);
        this.$typeSelect.createMenu(npcTypes, true, (value) => {
            this.typeOnChange(value);
        });
    }

    setFilters() {
        if (this.options.filters === undefined) return;

        const searchInputEl = this.contentEl.querySelector('.search') as HTMLInputElement,
            minLvlInputEl = this.contentEl.querySelector('.start-lvl-wrapper input') as HTMLInputElement,
            maxLvlInputEl = this.contentEl.querySelector('.stop-lvl-wrapper input') as HTMLInputElement,
            profSelectEl = this.contentEl.querySelector('.choose-prof') as HTMLInputElement;

        if (this.options.filters.nick) {
            this.setNick(this.options.filters.nick);
            searchInputEl.value = this.options.filters.nick;
            triggerEvent(searchInputEl, 'change');
        }

        if (this.options.filters.minLvl) {
            this.setMinLvl(String(this.options.filters.minLvl));
            minLvlInputEl.value = String(this.options.filters.minLvl);
            triggerEvent(minLvlInputEl, 'change');
        }

        if (this.options.filters.maxLvl) {
            this.setMaxLvl(String(this.options.filters.maxLvl));
            maxLvlInputEl.value = String(this.options.filters.maxLvl);
            triggerEvent(maxLvlInputEl, 'change');
        }

        if (this.options.filters.rarity) {
            this.setRarity(this.options.filters.rarity);
            this.$raritySelect.setOptionWithoutCallbackByValue(this.options.filters.rarity);
        }

        this.getData();
    }

    setNick(value: string) {
        this.search.nick = value !== '' ? value.toLowerCase() : '';
    }

    setRarity(value: string) {
        this.search.rarity = value !== '' ? value : '';
    }

    setType(value: string) {
        this.search.type = value !== '' ? value : '';
    }

    setMinLvl(value: string) {
        this.search.minLvl = value !== '' ? parseInt(value) : '';
    }

    setMaxLvl(value: string) {
        this.search.maxLvl = value !== '' ? parseInt(value) : '';
    }

    nickOnChange(value: string) {
        this.setNick(value);
        this.getData();
    }

    rarityOnChange(value: string) {
        this.setRarity(value);
        this.getData();
    }

    typeOnChange(value: string) {
        this.setType(value);
        this.getData();
    }

    minLvlOnChange(value: string) {
        this.setMinLvl(value);
        this.getData();
    }

    maxLvlOnChange(value: string) {
        this.setMaxLvl(value);
        this.getData();
    }

    getData() {
        this.request.mainRequest();
    }

    getFiltersQuery(page = this.search.page) {
        return `&filter=${page}|${this.search.minLvl}|${this.search.maxLvl}|${this.search.rarity}|${esc(this.search.nick)}|${this.search.type}`;
    }

    initScrollbar() {
        let $scrollAuctionPlug = $('<div>').addClass('scroll-auction-plug');
        $(this.contentEl)
            .find('.scroll-wrapper')
            .addScrollBar({
                track: true,
                addScrollableClassToAnotherEl: $(this.contentEl).find('.hunting-statistics-table-header-wrapper'),
                callback: this.scrollMove.bind(this),
            });
        $(this.contentEl).find('.scrollbar-wrapper').append($scrollAuctionPlug);
    }

    updateScrollbar() {
        $(this.contentEl).find('.scroll-wrapper').trigger('update');
    }

    scrollTop() {
        $(this.contentEl).find('.scroll-wrapper').trigger('scrollTop');
    }

    updateBarPos() {
        $(this.contentEl).find('.scroll-wrapper').trigger('updateBarPos');
    }

    stopDragBar() {
        $(this.contentEl).find('.scroll-wrapper').trigger('stopDragBar');
    }

    scrollMove() {
        this.pagination.getNextPageAction();
    }

    getEngine() {
        return Engine;
    }

    tLang(name: string, category: string = 'hunting_statistics', val: {} | null = null) {
        return typeof RUNNING_UNIT_TEST === 'undefined' ? _t(name, val, category) : '';
    }

    close() {
        this.getEngine().worldWindow.huntingStatistics = false;
    }
}