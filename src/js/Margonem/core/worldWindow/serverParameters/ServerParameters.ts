import {
    isPl,
    setAttributes
} from '../../HelpersTS';

export {};

const Tpl = require('@core/Templates');

declare const _t: (name: string, val ? : string | {} | null, category ? : string) => string;

type SingleParameter = {
    name: string;
    value: string | HTMLElement;
    hidden ? : boolean;
};

type ParameterGroup = {
    title: string;
    hidden ? : boolean;
    attrs: SingleParameter[];
};

type Parameters = ParameterGroup[];

export default class ServerParameters {
    private contentEl!: HTMLElement;
    private tabContentEl!: HTMLElement;
    private itemContainerEl!: HTMLElement;

    constructor(private wndEl: HTMLElement) {
        this.getEngine().serverParameters = true;

        const parameters: Parameters = [{
                title: this.tLang('basic-parameters'),
                attrs: [{
                        name: this.tLang('npc-resp'),
                        value: Engine.worldConfig.getNpcResp(),
                    },
                    {
                        name: this.tLang('weak-titans'),
                        value: Engine.worldConfig.getWeakTitans() + '%',
                    },
                    {
                        name: this.tLang('weak-collossus'),
                        value: Engine.worldConfig.getPWeakCollossus() + '%',
                    },
                    {
                        name: this.tLang('npc-exp'),
                        value: Engine.worldConfig.getNpcExp(),
                    },
                    {
                        name: this.tLang('quest-exp'),
                        value: Engine.worldConfig.getQuestExp(),
                    },
                ],
            },
            {
                title: this.tLang('loot-parameters'),
                attrs: [{
                        name: this.tLang('drop-destroy-lvl'),
                        value: Engine.worldConfig.getDropDestroyLvl() + ' ' + this.tLang('lvls'),
                    },
                    {
                        name: this.tLang('loot'),
                        value: Engine.worldConfig.getLoot(),
                    },
                    {
                        name: this.tLang('ttl-loot-del'),
                        value: this.setOnOff(Engine.worldConfig.getTtlLootDel()),
                    },
                ],
            },
            {
                title: this.tLang('pvp-parameters'),
                attrs: [{
                        name: this.tLang('pvp-lvl-off'),
                        value: this.setOnOff(!Engine.worldConfig.getPvpLvlOff()),
                    },
                    {
                        name: this.tLang('ph'),
                        value: Engine.worldConfig.getPh(),
                    },
                    {
                        name: this.tLang('pvp-time'),
                        value: Engine.worldConfig.getPvpStart() + ' - ' + Engine.worldConfig.getPvpEnd(),
                        hidden: Engine.worldConfig.getPvpStart() === null && Engine.worldConfig.getPvpEnd() === null,
                    },
                    {
                        name: this.tLang('non-pvp-time'),
                        value: Engine.worldConfig.getNonPvpStart() + ' - ' + Engine.worldConfig.getNonPvpEnd(),
                        hidden: Engine.worldConfig.getNonPvpStart() === null && Engine.worldConfig.getNonPvpEnd() === null,
                    },
                ],
            },
            {
                title: this.tLang('chat-parameters'),
                attrs: [{
                        name: this.tLang('skip-mute'),
                        value: this.setOnOff(!Engine.worldConfig.getSkipMute()),
                    },
                    {
                        name: this.tLang('enable-me'),
                        value: this.setOnOff(Engine.worldConfig.getEnableMe()),
                    },
                    {
                        name: this.tLang('enable-nar'),
                        value: this.setOnOff(Engine.worldConfig.getEnableNar()),
                    },
                ],
            },
            {
                title: this.tLang('admin-parameters'),
                hidden: !Engine.worldConfig.getPrivWorld(),
                attrs: [{
                        name: this.tLang('supervisors'),
                        value: this.setSupervisorsList(Engine.worldConfig.getSupervisorIds()),
                    },
                    // {
                    //   name: this.tLang('addons-ni'),
                    //   value: Engine.worldConfig.getEnableMe()
                    // },
                    // {
                    //   name: this.tLang('addons-si'),
                    //   value: Engine.worldConfig.getEnableNar()
                    // }
                ],
            },
        ];

        this.setContent();
        this.createGroups(parameters);
    }

    setOnOff(state: boolean) {
        return state ? this.tLang('on') : this.tLang('off');
    }

    setSupervisorsList(supervisors: number[]) {
        let supervisorsList = document.createElement('div');
        for (const [index, value] of supervisors.entries()) {
            const separator = index === 0 ? '' : ', ';
            let supervisorEl;
            if (isPl()) {
                supervisorEl = document.createElement('span');
                supervisorEl.addEventListener('click', () => Engine.iframeWindowManager.newPlayerProfile({
                    accountId: value
                }));
            } else {
                const url = `https://margonem.com/profile/view,${value}`;
                supervisorEl = document.createElement('a');
                setAttributes(supervisorEl, {
                    href: url,
                    target: '_blank'
                });
            }
            supervisorEl.classList.add('server-parameters__sv', 'not-peak');
            supervisorEl.textContent = `[${value}]`;
            supervisorsList.appendChild(document.createTextNode(separator));
            supervisorsList.appendChild(supervisorEl);
        }
        return supervisorsList;
    }

    setContent() {
        this.contentEl = Tpl.get('server-parameters')[0];
        this.itemContainerEl = this.contentEl.querySelector('.server-parameters__items-container') as HTMLElement;
        this.tabContentEl = this.wndEl.querySelector('.server-parameters-content') as HTMLElement;
        this.tabContentEl.innerHTML = '';
        this.tabContentEl.appendChild(this.contentEl);

        this.initScrollbar();
    }

    createGroups(parameters: Parameters) {
        for (const parameterGroup of parameters) {
            if (parameterGroup.hidden) continue;
            const groupsEl = this.createGroup(parameterGroup);
            this.itemContainerEl.appendChild(groupsEl);
        }

        this.updateScrollbar();
    }

    createGroup(parameterGroup: ParameterGroup) {
        const groupEl = document.createElement('div');
        groupEl.classList.add('server-parameters__group');

        const titleEl = document.createElement('div');
        titleEl.classList.add('world-window__info', 'server-parameters__info');
        titleEl.textContent = parameterGroup.title;

        groupEl.appendChild(titleEl);

        for (const parameter of parameterGroup.attrs) {
            if (!parameter.hidden) {
                groupEl.appendChild(this.createItem(parameter));
            }
        }
        return groupEl;
    }

    createItem(parameter: SingleParameter) {
        const itemEl = Tpl.get('server-parameters-item')[0] as HTMLElement,
            name = itemEl.querySelector('.server-parameters__item-name') as HTMLElement,
            value = itemEl.querySelector('.server-parameters__item-value') as HTMLElement;

        name.innerHTML = parameter.name;
        if (typeof parameter.value !== 'object') {
            value.innerHTML = parameter.value;
        } else {
            value.appendChild(parameter.value);
        }

        return itemEl;
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

    tLang(name: string, category: string = 'server_parameters', val: {} | null = null) {
        return typeof RUNNING_UNIT_TEST === 'undefined' ? _t(name, val, category) : '';
    }

    close() {
        this.getEngine().worldWindow.serverParameters = false;
    }
}