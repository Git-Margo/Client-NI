import {
    isset,
    siblings
} from './HelpersTS';
import Button from './components/Button';

const Tpl = require('core/Templates');
const Storage = require('core/Storage');

declare const Engine: any;
declare const _t: any;
declare const _g: any;
declare const CFG: any;
declare const setCookie: any;
declare const getCookie: any;
declare const getMainDomain: any;
declare const createImgStyle: any;

type TCharacterData = {
    clan: number;
    clan_rank: number;
    gender: string;
    icon: string;
    id: number;
    last: number;
    lvl: number;
    nick: string;
    prof: string;
    world: string;
};

type TList = {
    [name: string]: TCharacterData;
};

export default class ChangePlayer {
    private list: TList = {};
    private id: null | number = null;

    private wnd: any;
    private wndEl!: HTMLElement;
    private worldsContainerEl: HTMLElement;
    private characterGroupContainerEl: HTMLElement;
    private bottomContainerEl: HTMLElement;
    private errorContainerEl: HTMLElement;
    private successContainerEl: HTMLElement;

    constructor() {
        this.initWindow();
        this.initScroll();

        this.errorContainerEl = this.wndEl.querySelector('.relogger__error') as HTMLElement;
        this.successContainerEl = this.wndEl.querySelector('.relogger__success') as HTMLElement;
        this.worldsContainerEl = this.wndEl.querySelector('.relogger__worlds') as HTMLElement;
        this.characterGroupContainerEl = this.wndEl.querySelector('.relogger__top .relogger__characters') as HTMLElement;
        this.bottomContainerEl = this.wndEl.querySelector('.relogger__bottom') as HTMLElement;

        this.call();
        this.createLogoutBtn();
    }

    initScroll() {
        this.wnd.$.find('.scroll-wrapper').addScrollBar({
            track: true
        });
    }

    updateScroll() {
        $('.scroll-wrapper', this.wnd.$).trigger('update');
    }

    getList() {
        return this.list;
    }

    createLogoutBtn() {
        const logoutBtnEl = new Button({
            text: _t('logout', null, 'change_player'),
            classes: ['small', 'red'],
            action: () => this.logout(),
        }).getButton() as HTMLElement;
        this.bottomContainerEl.appendChild(logoutBtnEl);
    }

    logout() {
        if (Engine.logOff) return;
        _g('logoff&a=start');
    }

    getDestinationCharacter() {
        if (this.id !== null) {
            return this.list[this.id];
        }
        return null;
    }

    initWindow() {
        Engine.windowManager.add({
            content: Tpl.get('relogger'),
            title: _t('title', null, 'change_player'),
            nameWindow: Engine.windowsData.name.CHANGE_SERVER,
            widget: Engine.widgetsData.name.EXIT,
            objParent: this,
            nameRefInParent: 'wnd',
            type: Engine.windowsData.type.TRANSPARENT,
            addClass: 'relogger-window',
            manageCollapse: {
                defaultVal: 0,
                callbackFn: (state: boolean) => this.collapse(state) /* , leftPos: '100px'*/
            },
            manageShow: false,
            manageOpacity: 3,
            managePosition: {
                x: '0',
                y: '58'
            },
            onclose: () => {
                this.managePanelVisible();
            },
        });
        this.wndEl = this.wnd.$[0];
        this.wnd.addToAlertLayer();
    }

    collapse(state: boolean) {
        this.updateScroll();
    }

    call() {
        const hs3 = getCookie('hs3');
        const url = Engine.worldConfig.getApiDomain() + '/account/charlist?hs3=' + hs3;
        this.clearError();

        $.ajax({
            url: url,
            xhrFields: {
                withCredentials: true,
            },
            crossDomain: true,
            success: (data) => {
                if ((typeof data === 'object' && data.error) || data === 'no cookies' || data.length === 0) {
                    this.onError();
                    return;
                }
                this.onSuccess(data);
            },
            error: () => {
                this.onError();
            },
        });
    }

    onSuccess(data: any) {
        const accountId = Engine.hero.d.account;
        Storage.set(`charlist/${accountId}`, data);
        this.prepareList(data);
        // console.log(this.list);
        this.createWorldList();
        this.createCharacters();
        this.selectCurrentWorld();
        this.updateScroll();
    }

    changePlayerRequest = (id: number) => {
        const oldId = this.id;
        this.id = id;
        _g('logoff&a=start', (v: any) => {
            if (!isset(v.logoff_time_left)) this.id = oldId;
        });
    };

    createCharacters() {
        const sortedCharacters = Object.values(this.list).sort(
            (a, b) =>
            a.lvl - b.lvl || // sort by lvl
            a.nick.localeCompare(b.nick), // sort alphabetically
        );

        sortedCharacters.map((char) => {
            const worldName = char.world;
            const characterEl = this.createOneCharacter(char) as HTMLElement;
            this.characterGroupContainerEl.querySelector(`[data-world=${worldName}]`) !.appendChild(characterEl);
        });
    }

    createOneCharacter(charData: TCharacterData) {
        const characterEl = document.createElement('div') as HTMLElement;
        characterEl.classList.add('relogger__one-character');
        // characterEl.classList.add(`d-${id}`);
        if (Engine.hero.d.id == charData.id) {
            characterEl.classList.add('disabled');
        }
        // createImgStyle($(characterEl), CFG.a_opath + icon, { height: '28px', width: '32px', }, { 'background-size': '400% 400%' }, 32);
        createImgStyle($(characterEl), CFG.a_opath + charData.icon, {
            height: '28px',
            width: '32px',
        }, {
            'background-size': '400% 400%'
        }, 32);
        $(characterEl).tip(this.getCharacterTip(charData));
        characterEl.addEventListener('click', () => {
            if (Engine.hero.d.id == charData.id) return;
            if (Engine.logOff) {
                _g('logoff&a=stop');
                setTimeout(this.changePlayerRequest.bind(null, charData.id), 300);
            } else {
                this.changePlayerRequest(charData.id);
            }
        });
        return characterEl;
    }

    getCharacterTip({
        id,
        lvl,
        prof,
        nick
    }: TCharacterData) {
        if (Engine.hero.d.id == id) return _t('current_character', null, 'change_player');

        const data = {
            nick,
            d: {
                id,
                lvl,
                prof,
            },
        };
        return Engine.hero.setTipHeader(data);
    }

    createWorldCharacterGroup(world: string) {
        const charGroupEl = document.createElement('div') as HTMLElement;
        charGroupEl.classList.add('relogger__char-group');
        charGroupEl.setAttribute('data-world', world);
        this.characterGroupContainerEl.appendChild(charGroupEl);
    }

    createWorldList() {
        const worlds = this.getWorldList();
        worlds.map((world) => {
            const worldEl = document.createElement('div');
            worldEl.classList.add('relogger__one-world');
            worldEl.textContent = world;
            worldEl.setAttribute('data-world', world);
            worldEl.addEventListener('click', () => this.selectWorld(world));
            this.worldsContainerEl.appendChild(worldEl);
            this.createWorldCharacterGroup(world);
        });
    }

    getWorldList() {
        const worlds: string[] = [];
        Object.keys(this.list).map((e: string) => {
            const worldName = this.list[e].world;
            if (!worlds.includes(worldName)) {
                worlds.push(worldName);
            }
        });
        return worlds.sort();
    }

    selectWorld(world: string) {
        const selectedWorldEl = this.worldsContainerEl.querySelector(`[data-world=${world}]`) as HTMLElement;
        const otherWorldsEl = siblings(selectedWorldEl);
        const characterGroupEl = this.characterGroupContainerEl.querySelector(`[data-world=${world}]`) as HTMLElement;
        const otherCharactersGroupEl = siblings(characterGroupEl);

        selectedWorldEl.classList.add('active');
        characterGroupEl.classList.add('active');
        otherWorldsEl.forEach((worldEl: Element) => worldEl.classList.remove('active'));
        otherCharactersGroupEl.forEach((worldEl: Element) => worldEl.classList.remove('active'));
    }

    selectCurrentWorld() {
        const currentWorld = Engine.worldConfig.getWorldName();
        this.selectWorld(currentWorld);
    }

    onError() {
        const accountId = Engine.hero.d.account;
        const oldData = Storage.get(`charlist/${accountId}`);
        if (oldData) {
            this.onSuccess(oldData);
        } else {
            this.setErrorLabel();
        }
    }

    prepareList(_list: any) {
        for (let i = 0; i < _list.length; i++) {
            let id = parseInt(_list[i].id);
            this.list[id] = _list[i];
        }
    }

    setErrorLabel() {
        this.errorContainerEl.textContent = _t('change_player_error %l%', {
            '%l%': getMainDomain()
        }, 'change_player');
        this.errorContainerEl.style.display = 'block';
        this.successContainerEl.style.display = 'none';
    }

    clearError() {
        this.errorContainerEl.style.display = 'none';
        this.successContainerEl.style.display = 'block';
    }

    reloadPlayer(idHero: number) {
        const player = this.list[idHero];
        const d = new Date();
        d.setTime(d.getTime() + 3600000 * 24 * 30);
        const l = getMainDomain();
        setCookie('mchar_id', idHero, d, '/', 'margonem.' + l, true);
        window.location.replace('https://' + player.world + '.margonem.' + l);
    }

    openPanel() {
        this.wnd.show();
        this.wnd.setWndOnPeak();
        this.wnd.updatePos();
        this.updateScroll();
    }

    closePanel() {
        this.wnd.hide();
    }

    onResize() {
        this.wnd.updatePos();
    }

    managePanelVisible() {
        const visible = this.wnd.isShow();
        visible ? this.closePanel() : this.openPanel();
    }
}