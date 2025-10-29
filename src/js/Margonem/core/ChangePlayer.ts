import {
    isset,
    siblings
} from './HelpersTS';
import Button from './components/Button';
import CharacterList, {
    TCharacterData
} from "./CharacterList";

const Tpl = require('@core/Templates');
var Storage = require('@core/Storage');

declare const Engine: any;
declare const _t: any;
declare const _g: any;
declare const setCookie: any;
declare const getMainDomain: any;

export default class ChangePlayer {
    private id: null | number = null;

    private wnd: any;
    private wndEl!: HTMLElement;
    private worldsContainerEl: HTMLElement;
    private characterGroupContainerEl: HTMLElement;
    private bottomContainerEl: HTMLElement;
    private errorContainerEl: HTMLElement;
    private successContainerEl: HTMLElement;
    private charlist: CharacterList;
    private sizeArray: {
        w ? : number,
        h ? : number
    } [] = [{
            w: 242
        },
        {
            w: 330
        }
    ];

    constructor() {
        this.charlist = Engine.characterList;
        this.initWindow();
        this.initScroll();

        this.errorContainerEl = this.wndEl.querySelector('.relogger__error') as HTMLElement;
        this.successContainerEl = this.wndEl.querySelector('.relogger__success') as HTMLElement;
        this.worldsContainerEl = this.wndEl.querySelector('.relogger__worlds') as HTMLElement;
        this.characterGroupContainerEl = this.wndEl.querySelector('.relogger__top .relogger__characters') as HTMLElement;
        this.bottomContainerEl = this.wndEl.querySelector('.relogger__bottom') as HTMLElement;

        if (this.charlist.getList().length > 0) {
            this.createList();
        } else {
            this.setErrorLabel()
        }
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
            return this.charlist.getCharacter(this.id);
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
            manageSize: {
                sizeArray: this.sizeArray,
                callback: () => this.windowResizeCallback()
            },
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
            twPadding: 'md',
            onclose: () => {
                this.managePanelVisible();
            },
        });
        this.wndEl = this.wnd.$[0];
        this.wnd.updatePos();
        this.wnd.addToAlertLayer();
        this.wnd.updateSizeWindow();
    }

    windowResizeCallback() {
        const targetWidth = this.sizeArray[0].w;
        const isAtTargetWidth = this.wndEl.offsetWidth === targetWidth;

        this.wndEl.classList.toggle('relogger--bigger', !isAtTargetWidth);
        this.updateScroll();
    }

    collapse(state: boolean) {
        this.updateScroll();
    }

    createList() {
        this.clearError()
        this.createWorldList();
        this.createCharacters();
        this.selectCurrentWorld();
        this.updateScroll();
    }

    changePlayer(characterId: number) {
        if (Engine.hero.d.id == characterId) return;
        if (Engine.logOff) {
            _g('logoff&a=stop');
            setTimeout(this.changePlayerRequest.bind(null, characterId), 300);
        } else {
            this.changePlayerRequest(characterId);
        }
    }

    changePlayerRequest = (id: number) => {
        const oldId = this.id;
        this.id = id;
        _g('logoff&a=start', (v: any) => {
            if (!isset(v.logoff_time_left)) this.id = oldId;
        });
    };

    createCharacters() {
        this.charlist.getSortedCharacters().map((character) => {
            const worldName = character.world;
            const characterEl = this.createOneCharacter(character) as HTMLElement;
            this.characterGroupContainerEl.querySelector(`[data-world=${worldName}]`) !.appendChild(characterEl);
        });
    }

    createOneCharacter(charData: TCharacterData) {
        return this.charlist.createCharacterAvatar(charData, {
            onClickCallback: () => this.changePlayer(charData.id),
            cssClass: 'relogger__one-character',
            currentDisabled: true,
            ...(Engine.hero.d.id === charData.id && {
                customTip: _t('current_character', null, 'change_player')
            })
        });
    }

    createWorldCharacterGroup(world: string) {
        const charGroupEl = document.createElement('div') as HTMLElement;
        charGroupEl.classList.add('relogger__char-group');
        charGroupEl.setAttribute('data-world', world);
        this.characterGroupContainerEl.appendChild(charGroupEl);
    }

    createWorldList() {
        const worlds = this.charlist.getWorldList();
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

    reloadPlayer(characterId: number) {
        const player = this.charlist.getCharacter(characterId);
        if (!player) return;

        const d = new Date();
        d.setTime(d.getTime() + 3600000 * 24 * 30);
        const l = getMainDomain();
        setCookie('mchar_id', characterId, d, '/', 'margonem.' + l, true);

        //let sub       = location.hostname.split('.')[0];
        //
        //if (sub == 'tabaluga') {
        //  Storage.easySet(player.world, "CURRENT_SEVER");
        //  location.reload();
        //  return;
        //}

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