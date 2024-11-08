import {
    isPl,
    setAttributes
} from '../../HelpersTS';

export {};

const Tpl = require('core/Templates');

declare const _t: (name: string, val ? : string | {} | null, category ? : string) => string;

type PvPMode = 'green' | 'yellow' | 'red' | 'orange';

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

export default class LocationParameters {
    private contentEl!: HTMLElement;
    private tabContentEl!: HTMLElement;
    private itemContainerEl!: HTMLElement;

    constructor(private wndEl: HTMLElement) {
        this.getEngine().locationParameters = true;
        this.setContent();
        const parameters = this.getParameters();
        this.createGroups(parameters);
    }

    updateParameters() {
        this.clearTable();
        const parameters = this.getParameters();
        this.createGroups(parameters);
    }

    getParameters() {
        const maxLvl = Engine.map.config.getLvlMax() === 0 ? 500 : Engine.map.config.getLvlMax();
        const pvpModes: {
            [key: number]: PvPMode
        } = {
            0: 'green',
            1: 'yellow',
            2: 'red',
            4: 'orange'
        };

        return [{
                title: this.tLang('basic-parameters'),
                attrs: [{
                        name: 'respawn',
                        value: Engine.map.config.getRespawn(),
                    },
                    {
                        name: 'isTeleportBlocked',
                        value: this.setOnOff(!Engine.map.config.getIsTeleportBlocked()),
                    },
                    {
                        name: 'isTpOutAfterOffline',
                        value: this.setOnOff(Engine.map.config.getIsTpOutAfterOffline()),
                    },
                    {
                        name: 'isTeleportAt5AM',
                        value: this.setOnOff(Engine.map.config.getIsTeleportAt5AM()),
                    },
                    ...Engine.worldConfig.getHardcore() ? [{
                        name: 'isMakeNoobImmune',
                        value: this.setOnOff(!Engine.map.config.getIsMakeNoobImmune()),
                    }] : [],
                    {
                        name: 'isPrivRoom',
                        value: this.setOnOff(Engine.map.config.getIsPrivRoom()),
                    },
                    {
                        name: 'isRespawnShortened',
                        value: this.setOnOff(Engine.map.config.getIsRespawnShortened()),
                    },
                    {
                        name: 'isTimeticketsUsageDisabled',
                        value: this.setOnOff(!Engine.map.config.getIsTimeticketsUsageDisabled()),
                    },
                    {
                        name: 'isClearEnabled',
                        value: this.setOnOff(Engine.map.config.getIsClearEnabled()),
                    },
                    {
                        name: 'isQuestFogEnabled',
                        value: this.setOnOff(Engine.map.config.getIsQuestFogEnabled()),
                    },
                    {
                        name: 'locationLvlAccess',
                        value: `${Engine.map.config.getLvlMin()} - ${maxLvl}`,
                    },
                ],
            },
            {
                title: this.tLang('pvp-parameters'),
                attrs: [{
                        name: 'pvpMode',
                        value: _t('pvp_' + pvpModes[Engine.map.d.pvp]),
                    },
                    // {
                    //   name: this.tLang('isBattlePvPQuickModeEnabled'),
                    //   value: this.setOnOff(Engine.map.config.getIsBattlePvPQuickModeEnabled()),
                    // },
                    {
                        name: 'isPartiesDisabled',
                        value: this.setOnOff(!Engine.map.config.getIsPartiesDisabled()),
                    },
                    {
                        name: 'isPvpLvlAdvantageDisabled',
                        value: this.setOnOff(!Engine.map.config.getIsPvpLvlAdvantageDisabled()),
                    },
                    ...Engine.map.config.getPvnBattleTurnTimes() ? [{
                        name: 'pvnBattleTurnTimes',
                        value: Engine.map.config.getPvnBattleTurnTimes().map((el: number) => --el).join(' / '),
                    }] : [],
                    ...Engine.map.config.getPvpBattleTurnTimes() ? [{
                        name: 'pvpBattleTurnTimes',
                        value: Engine.map.config.getPvpBattleTurnTimes().map((el: number) => --el).join(' / '),
                    }] : [],
                ],
            },
        ];
    }

    setOnOff(state: boolean) {
        return state ? this.tLang('on') : this.tLang('off');
    }

    setContent() {
        this.contentEl = Tpl.get('location-parameters')[0];
        this.itemContainerEl = this.contentEl.querySelector('.location-parameters__items-container') as HTMLElement;
        this.tabContentEl = this.wndEl.querySelector('.location-parameters-content') as HTMLElement;
        this.tabContentEl.innerHTML = '';
        this.tabContentEl.appendChild(this.contentEl);

        this.initScrollbar();
    }

    clearTable() {
        this.itemContainerEl.innerHTML = '';
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
        groupEl.classList.add('location-parameters__group');

        const titleEl = document.createElement('div');
        titleEl.classList.add('world-window__info', 'location-parameters__info');
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
        const itemEl = Tpl.get('location-parameters-item')[0] as HTMLElement,
            name = itemEl.querySelector('.location-parameters__item-name') as HTMLElement,
            value = itemEl.querySelector('.location-parameters__item-value') as HTMLElement;

        name.innerHTML = this.tLang(parameter.name);
        $(name).tip(this.tLang(`${parameter.name}_tip`));
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

    tLang(name: string, category: string = 'location_parameters', val: {} | null = null) {
        return typeof RUNNING_UNIT_TEST === 'undefined' ? _t(name, val, category) : '';
    }

    close() {
        this.getEngine().worldWindow.locationParameters = false;
    }
}