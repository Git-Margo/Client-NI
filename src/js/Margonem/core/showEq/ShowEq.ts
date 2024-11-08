import {
    showProfile
} from '../HelpersTS';

const Tpl = require('core/Templates');
const ItemData = require('core/items/data/ItemData');
const OthersContextMenuData = require('core/characters/OthersContextMenuData');

declare const CFG: any;
declare const _t: any;
declare const getE: (e: any, mE: any) => void;
declare const getTimeStampEv: () => void;
declare const createImgStyle: (e: JQuery, url: string) => void;

type Props = {
    id: number;
    account: number;
    nick: string;
    prof: string;
    lvl: number;
    icon: string;
    world: string;
};

export default class ShowEq {
    private contentEl!: HTMLElement;
    private allItemsId: number[] = [];

    private wnd: any;

    constructor(private playerData: Props) {
        this.initWindow();
    }

    setItems(i: any) {
        if (i.own != this.playerData.id) return;
        // const iconEl = this.getEngine().items.createViewIcon(i.id, 'show-eq-item')[0][0];
        const iconEl = this.getEngine().items.createViewIcon(i.id, this.getEngine().itemsViewData.SHOW_EQ_ITEM_VIEW)[0][0];
        const itemSlotEl = this.contentEl.querySelector(`.other-eq-slot.st-${i._st}`) as HTMLElement;

        itemSlotEl.appendChild(iconEl);
        iconEl.addEventListener('contextmenu', (e: any, mE: any) => {
            i.createOptionMenu(getE(e, mE));
        });
    }

    setInfo() {
        const {
            id,
            nick,
            lvl,
            prof,
            account
        } = this.playerData;
        const playerInfoEl = this.contentEl.querySelector('.player-info') as HTMLElement;
        playerInfoEl.appendChild(this.getLinkedPlayerName(nick, id, account));
        if (lvl != 0) playerInfoEl.append(` (${lvl}${prof})`);
    }

    getLinkedPlayerName(name: string, id: number, accountId: number) {
        const playerNameEl = document.createElement("span");
        playerNameEl.classList.add('character-name');
        playerNameEl.textContent = name;
        playerNameEl.addEventListener('click', (e) => {
            e.stopPropagation(); // for not peak current window
            Engine.chatController.getChatInputWrapper().setPrivateMessageProcedure(name);
        })
        playerNameEl.addEventListener('contextmenu', (e) => {
            this.getEngine().others.createOtherContextMenu(
                e, {
                    charId: this.playerData.id,
                    accountId: this.playerData.account,
                    ...this.playerData
                },
                [OthersContextMenuData.SHOW_EQ]
            )
        });
        return playerNameEl;
    }

    setAvatar(icon: string) {
        if (!icon) return;

        const url = CFG.a_opath + icon;
        const avatar = document.createElement('div');
        avatar.classList.add('avatar-icon')
        createImgStyle($(avatar), url);
        const avatarEl = this.contentEl.querySelector('.prof-image') as HTMLElement;
        avatarEl.appendChild(avatar);
    }

    initWindow() {
        this.contentEl = Tpl.get('show-eq')[0];

        this.getEngine().windowManager.add({
            content: this.contentEl,
            //nameWindow      : 'showEq',
            nameWindow: this.getEngine().windowsData.name.SHOW_EQ,
            title: _t('other_eq'),
            objParent: this,
            nameRefInParent: 'wnd',
            type: Engine.windowsData.type.TRANSPARENT,
            addClass: 'showeq-window showeq-' + this.playerData.id,
            managePosition: {
                position: Engine.windowsData.position.CENTER_OR_SAVE_IN_STORAGE
            },
            onclose: () => this.close(),
        });

        this.wnd.addToAlertLayer();
        //this.wnd.setSavePosWnd(this.wnd.getCenterPos());
        this.wnd.updatePos();
        this.wnd.setWndOnPeak(true);
    }

    parseItemsData(items: any, playerId: number) {
        for (let k in items) {
            items[k].loc = 'otherEqItem';
            items[k].own = playerId;
            items[k]._st = items[k].st; // it's a fix for tips compare
            items[k].st = ItemData.ST.IN_BAG;
            this.allItemsId.push(parseInt(k));
        }
    }

    update(items: any) {
        const changedIdsItems: {
            [index: string]: any
        } = {}
        Object.keys(items).map((itemId) => { // #24946 - dirty fix - change items id to prevent disappear items in eq
            changedIdsItems[itemId + '-showeq'] = items[itemId];
        });

        const {
            id,
            nick,
            prof,
            icon,
            lvl
        }: Props = this.playerData;
        this.parseItemsData(changedIdsItems, id);
        if (Object.keys(changedIdsItems).length) this.getEngine().items.updateDATA(changedIdsItems); // It is the worst send items from engine ever!! HEAVEN HELP US!!  ... to fix in future!!!
        this.setInfo();
        this.setAvatar(icon);
        this.updateEqInfo();
    }

    updateEqInfo() {
        const eqInfoEl = this.contentEl.querySelector('.info-icon') as HTMLElement;
        $(eqInfoEl).tip(_t('show_eq_info %date%', {
            '%date%': getTimeStampEv()
        }));
    }

    close() {
        this.wnd.remove();
        this.getEngine().items.deleteMessItemsByLocAndOwnId('otherEqItem', this.playerData.id);
        this.getEngine().showEqManager.removeWindow(this.playerData.id);
    }

    getEngine() {
        return Engine;
    }
}