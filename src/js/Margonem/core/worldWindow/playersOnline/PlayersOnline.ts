import {
    showProfile,
    isDevOrExpe,
    isPl,
    setAttributes,
    triggerEvent,
    ut_fulltime,
    esc
} from '../../HelpersTS';
import {
    ranks
} from '../../characterRanks/CharacterRanks';
import Button from '../../components/Button';
const ProfData = require('core/characters/ProfData');

export {};

const Tpl = require('core/Templates');

declare const _t: (name: string, val ? : string | {} | null, category ? : string) => string;
declare const _g: (query: string) => void;
declare const createNiInput: (data: {}) => JQuery;
declare const strtotime: (date: string) => number;

type Player = {
    a: number; // account id
    c: number; // character id
    l: number; // level
    n: string; // nick
    p: string; // profession
    r: number; // rank (ADMIN/MG/SMG)
};

type Search = {
    nick: string;
    minLvl: '' | number;
    maxLvl: '' | number;
    profession: string;
};

type Options = {
    filters ? : Search;
}

export default class PlayersOnline {
    private contentEl!: HTMLElement;
    private infoEl!: HTMLElement;
    private tabContentEl!: HTMLElement;
    private itemContainerEl!: HTMLElement;
    private $profSelect!: JQuery;
    private worldName: string = '';
    private search: Search = {
        nick: '',
        minLvl: '',
        maxLvl: '',
        profession: '',
    };

    constructor(private wndEl: HTMLElement, private options: Options = {}) {
        // debugger;
        this.getEngine().playersOnline = true;
        this.setContent();
        this.initSearch();
        this.getData();
        this.setFilters();
    }

    setContent() {
        this.contentEl = Tpl.get('players-online')[0];
        this.itemContainerEl = this.contentEl.querySelector('.players-online__items-container') as HTMLElement;
        this.infoEl = this.contentEl.querySelector('.players-online__info') as HTMLElement;
        this.tabContentEl = this.wndEl.querySelector('.players-online-content') as HTMLElement;
        this.tabContentEl.innerHTML = '';
        this.tabContentEl.appendChild(this.contentEl);

        const rankLegend = this.getRanksLegend();
        $(this.contentEl.querySelector('.legend') as HTMLElement).tip(rankLegend, 't-left');

        this.addRefreshButton();
        this.initScrollbar();
    }

    addRefreshButton() {
        const opts = {
            text: _t('refresh', null, 'buttons'),
            classes: ['small', 'green'],
            action: () => {
                this.getData();
            }
        };
        const refreshButton = new Button(opts);

        this.infoEl.appendChild(refreshButton.getButton());
    }

    getRanksLegend() {
        let legend = '';
        for (const i in ranks) {
            legend += `<div style='color: ${ranks[i].color}'>${ranks[i].name}</div>`;
        }
        return legend;
    }

    createItems(players: Player[]) {
        for (const player of players) {
            this.itemContainerEl.appendChild(this.createItem(player));
        }
        this.updateScrollbar();
    }

    createItem(player: Player) {
        const {
            a: accountId,
            c: characterId,
            n: nick,
            l: lvl,
            p: prof,
            r: rank
        } = player;
        const itemEl = Tpl.get('players-online-item')[0] as HTMLElement,
            nickEl = itemEl.querySelector('.players-online__nick') as HTMLElement,
            lvlEl = itemEl.querySelector('.players-online__lvl') as HTMLElement,
            profEl = itemEl.querySelector('.players-online__prof') as HTMLElement,

            shortName = ranks[rank].shortName !== '' ? `(${ranks[rank].shortName})` : '';

        nickEl.innerHTML = nick + shortName;
        lvlEl.innerHTML = lvl.toString();
        profEl.innerHTML = prof;

        setAttributes(itemEl, {
            nick,
            lvl,
            prof
        });

        if (ranks[rank]) {
            itemEl.style.color = ranks[rank].color;
        }

        itemEl.addEventListener('contextmenu', (e: MouseEvent) => {
            this.createContextMenu(e, player);
        });

        itemEl.addEventListener('click', () => {
            Engine.chatController.getChatInputWrapper().setPrivateMessageProcedure(nick);
        });

        return itemEl;
    }

    createContextMenu(e: MouseEvent, player: Player) {
        const contextMenu = [];

        contextMenu.push([
            _t('send_message', null, 'chat'),
            function() {
                //Engine.chat.replyTo(player.n);
                //Engine.interface.focusChat();
                Engine.chatController.getChatInputWrapper().setPrivateMessageProcedure(player.n);
            },
        ]);

        contextMenu.push([
            _t('show_eq'),
            () => {
                Engine.showEqManager.update({
                    id: player.c,
                    account: player.a,
                    lvl: player.l,
                    nick: player.n,
                    prof: player.p,
                    icon: '',
                    world: this.worldName,
                });
            },
        ]);

        contextMenu.push([
            _t('invite_to_friend'),
            () => _g('friends&a=finvite&nick=' + player.n.trim().split(' ').join('_'))
        ]);

        contextMenu.push([
            _t('add_to_enemies'),
            () => _g('friends&a=eadd&nick=' + player.n.trim().split(' ').join('_'))
        ]);

        contextMenu.push([
            _t('team_invite', null, 'menu'),
            () => _g(`party&a=inv&id=${player.c}`)
        ]);

        contextMenu.push([
            _t('show_profile', null, 'menu'),
            () => showProfile(player.a, player.c)
        ]);

        if (contextMenu.length) {
            Engine.interface.showPopupMenu(contextMenu, e);
            return true;
        }
        return false;
    }

    updateInfo(playersAmount: number, date: string) {
        // const playersAmountEl = this.infoEl.querySelector('.players-online__amount') as HTMLElement;
        const dateEl = this.infoEl.querySelector('.players-online__date') as HTMLElement;
        // playersAmountEl.innerHTML = playersAmount.toString();
        dateEl.innerHTML = date;
    }

    prepareUpdateDate(date: string | null) {
        return date ? ut_fulltime(strtotime(date), true) : ut_fulltime(Date.now() / 1000, true);
    }

    getData() {
        this.itemContainerEl.replaceChildren();

        let date: string = '';
        const apiDomain = this.getApiDomain();
        this.worldName = !isDevOrExpe() ? this.getWorldName() : (isPl() ? 'fobos' : 'husaria');
        fetch(`${apiDomain}/info/online/${this.worldName}.json`)
            .then((response) => {
                if (response.headers.has('last-modified')) {
                    date = this.prepareUpdateDate(response.headers.get('last-modified'));
                }
                return response.json();
            })
            .then((data) => {
                this.updateInfo(data.length, date);
                this.createItems(data);
                this.checkSearch();
            })
            .catch((err) => {
                console.error('[PlayersOnline.ts, callEvent] PlayersOnline ajax request error ' + err);
            });
    }

    initSearch() {
        const searchInputEl = this.contentEl.querySelector('.search') as HTMLInputElement,
            searchXEl = this.contentEl.querySelector('.search-x') as HTMLElement,
            minLvlWrapperEl = this.contentEl.querySelector('.start-lvl-wrapper') as HTMLInputElement,
            maxLvlWrapperEl = this.contentEl.querySelector('.stop-lvl-wrapper') as HTMLInputElement,
            profSelectEl = this.contentEl.querySelector('.choose-prof') as HTMLInputElement,
            minLvlEl = createNiInput({
                cl: 'start-lvl',
                placeholder: _t('start'),
                changeClb: (val: string) => this.minLvlOnChange(val),
                clearClb: () => this.minLvlOnChange(''),
                type: 'number',
            })[0],
            maxLvlEl = createNiInput({
                cl: 'stop-lvl',
                placeholder: _t('stop'),
                changeClb: (val: string) => this.maxLvlOnChange(val),
                clearClb: () => this.maxLvlOnChange(''),
                type: 'number',
            })[0];

        minLvlWrapperEl.appendChild(minLvlEl);
        maxLvlWrapperEl.appendChild(maxLvlEl);

        searchInputEl.addEventListener('input', ({
            target
        }: Event) => {
            this.nickOnChange((target as HTMLInputElement).value)
        });

        searchXEl.addEventListener('click', function() {
            searchInputEl.value = '';
            triggerEvent(searchInputEl, 'input');
        });

        const professions = [{
                val: 'all',
                'text': _t('prof_all', null, 'auction')
            },
            {
                val: ProfData.MAGE,
                'text': _t('prof_mage', null, 'auction')
            },
            {
                val: ProfData.WARRIOR,
                'text': _t('prof_warrior', null, 'auction')
            },
            {
                val: ProfData.PALADIN,
                'text': _t('prof_paladin', null, 'auction')
            },
            {
                val: ProfData.TRACKER,
                'text': _t('prof_tracker', null, 'auction')
            },
            {
                val: ProfData.HUNTER,
                'text': _t('prof_hunter', null, 'auction')
            },
            {
                val: ProfData.BLADE_DANCER,
                'text': _t('prof_bdancer', null, 'auction')
            }
        ];

        this.$profSelect = $(profSelectEl);
        this.$profSelect.createMenu(professions, true, (value) => {
            this.professionOnChange(value);
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

        if (this.options.filters.profession) {
            this.setProfession(this.options.filters.profession);
            this.$profSelect.setOptionWithoutCallbackByValue(this.options.filters.profession);
        }

        this.checkSearch();
    }

    setNick(value: string) {
        this.search.nick = value !== '' ? value.toLowerCase() : '';
    }

    setProfession(value: string) {
        this.search.profession = value !== '' ? value : '';
    }

    setMinLvl(value: string) {
        this.search.minLvl = value !== '' ? parseInt(value) : '';
    }

    setMaxLvl(value: string) {
        this.search.maxLvl = value !== '' ? parseInt(value) : '';
    }

    nickOnChange(value: string) {
        this.setNick(value);
        this.checkSearch();
    }

    professionOnChange(value: string) {
        this.setProfession(value)
        this.checkSearch();
    }

    minLvlOnChange(value: string) {
        this.setMinLvl(value)
        this.checkSearch();
    }

    maxLvlOnChange(value: string) {
        this.setMaxLvl(value)
        this.checkSearch();
    }

    checkSearch() {
        const items = this.itemContainerEl.querySelectorAll('.players-online__item');

        items.forEach((el) => {
            const
                nick = (el.getAttribute('nick') as string).toLowerCase(),
                lvl = parseInt(el.getAttribute('lvl') as string),
                prof = el.getAttribute('prof') as string;

            const nickOk = this.search.nick === '' || nick.includes(this.search.nick);
            const lvlOk =
                (this.search.minLvl === '' || lvl >= this.search.minLvl) &&
                (this.search.maxLvl === '' || lvl <= this.search.maxLvl);
            const selectedProf = document.querySelector('.choose-prof .menu-option') !.getAttribute('value');
            const profOk = selectedProf === 'all' || selectedProf === prof;

            if (nickOk && lvlOk && profOk) {
                el.classList.remove('d-none');
            } else {
                el.classList.add('d-none');
            }

            this.updateScrollbar();
        });
    }

    getWorldName() {
        return this.getEngine().worldConfig.getWorldName();
    }

    getApiDomain() {
        const apiDomain = this.getEngine().worldConfig.getApiDomain();
        return !isDevOrExpe ? apiDomain : apiDomain.replace('stag-', ''); // :(
    }

    initScrollbar() {
        $(this.contentEl).find('.scroll-wrapper').addScrollBar({
            track: true
        });
    }

    updateScrollbar() {
        $(this.contentEl).find('.scroll-wrapper').trigger('update');
    }

    getEngine() {
        return Engine;
    }

    tLang(name: string, category: string = 'world_window', val: {} | null = null) {
        return typeof RUNNING_UNIT_TEST === 'undefined' ? _t(name, val, category) : '';
    }

    close() {
        this.getEngine().worldWindow.playersOnline = false;
    }
}