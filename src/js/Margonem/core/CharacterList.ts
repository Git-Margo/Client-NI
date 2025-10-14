import {
    siblings
} from "@core/HelpersTS";

const Storage = require('@core/Storage');

declare const Engine: any;
declare const CFG: any;
declare const getCookie: any;
declare const createImgStyle: any;

export type TCharacterData = {
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

type TList = TCharacterData[];

type CharacterAvatarOptions = {
    currentDisabled ? : boolean;
    cssClass ? : string;
    onClickCallback ? : (characterId: number) => void;
    customTip ? : string;
    selectable ? : boolean
}

export default class CharacterList {
    private list: TList = [];
    private worldList: string[] = []

    constructor() {
        this.loadCharacterList();
    }

    getList() {
        return this.list;
    }

    loadCharacterList() {
        const hs3 = getCookie('hs3');
        const url = Engine.worldConfig.getApiDomain() + '/account/charlist?hs3=' + hs3;

        $.ajax({
            url,
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
            complete: () => this.onComplete()
        });
    }

    onComplete() {
        Engine.interface.lock.unlock('charlist');
    }

    onSuccess(data: any) {
        const accountId = Engine.hero.d.account;
        Storage.set(`charlist/${accountId}`, data);
        this.setList(data);
        this.setWorldList();
    }

    getSortedCharacters() {
        return this.list.sort(
            (a, b) =>
            a.lvl - b.lvl || // sort by lvl
            a.nick.localeCompare(b.nick), // sort alphabetically
        );
    }

    createCharacterAvatar(charData: TCharacterData, options: CharacterAvatarOptions = {}) {
        const characterEl = document.createElement('div') as HTMLElement;
        const tipText = options.customTip ? options.customTip : this.getCharacterTip(charData);
        characterEl.classList.add('character-avatar');
        if (options.cssClass) characterEl.className += ' ' + options.cssClass;
        if (options.currentDisabled && Engine.hero.d.id == charData.id) {
            characterEl.classList.add('disabled');
        }
        createImgStyle($(characterEl), CFG.a_opath + charData.icon, {
            height: '28px',
            width: '32px',
        }, {
            'background-size': '400% 400%'
        }, 32);
        $(characterEl).tip(tipText);
        characterEl.addEventListener('click', () => {
            if (options.selectable) {
                characterEl.classList.add('active');
                characterEl.classList.remove('inactive');
                siblings(characterEl).forEach(otherCharacter => {
                    otherCharacter.classList.add('inactive');
                    otherCharacter.classList.remove('active');
                })
            }
            if (options.onClickCallback) options.onClickCallback!(charData.id)
        });
        return characterEl;
    }

    getCharacterTip({
        id,
        lvl,
        prof,
        nick
    }: TCharacterData) {
        const data = {
            nick,
            //getLevel: function () {return lvl},
            d: {
                id,
                lvl,
                prof,
            },
        };
        return Engine.hero.setTipHeader(data);
    }

    onError() {
        const accountId = Engine.hero.d.account;
        const oldData = Storage.get(`charlist/${accountId}`);
        if (oldData) {
            this.onSuccess(oldData);
        }
    }

    setList(_list: TList) {
        this.list = _list.map(entry => ({
            ...entry,
            id: Number(entry.id),
            lvl: Number(entry.lvl),
            last: Number(entry.last),
            clan: Number(entry.clan),
            clan_rank: Number(entry.clan_rank),
        }));
    }

    setWorldList() {
        this.list.map((character: TCharacterData) => {
            const worldName = character.world;
            if (!this.worldList.includes(worldName)) {
                this.worldList.push(worldName);
            }
        });
        this.worldList = this.worldList.sort();
    }

    getWorldList() {
        return this.worldList;
    }

    getCharacter(characterId: number) {
        return this.list.find(char => Number(char.id) === Number(characterId));
    }

    getCharactersByWorld(world: string) {
        return this.list.filter(char => char.world === world)
        //   .sort(
        //   (a, b) =>
        //     a.lvl - b.lvl || // sort by lvl
        //     a.nick.localeCompare(b.nick), // sort alphabetically
        // );
    }
}