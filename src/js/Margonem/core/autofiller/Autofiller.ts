import Button from '../components/Button';
import ItemGrabber from '../items/itemGrabber';
import AutofillerConfig from './AutofillerConfig';
import {
    configIcon,
    errorReport,
    isset
} from '../HelpersTS';

const Tpl = require('core/Templates');

declare const Engine: any;
declare const _t: any;

const defaultOptions = {
    btnTip: (i: number) => {
        return _t('great_merchamp_info %val%', {
            '%val%': i
        }, 'shop');
    },
};

type FiltersItem = {
    key: number;
    checked: boolean;
    groupId: number;
}

type Filters = {
    [key: string]: Array < FiltersItem > ;
}

export default class Autofiller {
    el: HTMLElement;
    private autofillerConfig;
    private itemGrabber;
    private options: any;
    private bagsAmount: number = 3;

    constructor(options: any) {
        this.el = Tpl.get('autofiller')[0] as HTMLElement;
        this.options = {
            ...defaultOptions,
            ...options
        };
        this.autofillerConfig = new AutofillerConfig(this.options.configWindow, this.getData(), (data) =>
            this.saveData(data),
        );
        this.itemGrabber = new ItemGrabber(this.options.itemGrabberOptions);
        this.afterDataSave(this.getData());
        this.setContent();
    }

    setContent() {
        this.setButtons();
    }

    setButtons() {
        const buttonOptions = this.prepareButtonOptions();

        for (const options of buttonOptions) {
            const button = new Button(options).getButton();
            this.el.appendChild(button);
        }
    }

    prepareButtonOptions() {
        const buttons = [];
        const configButton = {
            text: configIcon(),
            classes: ['small', 'green', 'autofiller-config-btn', 'not-peak'],
            action: () => this.autofillerConfig.windowToggle(),
            tip: _t('config_tip', null, 'buttons'),
            disabled: false,
        };
        for (let i = 1; i <= this.bagsAmount; i++) {
            buttons.push({
                text: i.toString(),
                classes: ['small', 'green'],
                action: () => this.autofillFrom(i),
                tip: this.options.btnTip(i),
                disabled: false,
            });
        }
        buttons.push(configButton);

        return buttons;
    }

    autofillFrom(bagNumber: number) {
        const items = this.itemGrabber.grab(bagNumber);
        this.options.btnFn(items);
    }

    afterDataSave(data: any) {
        const parsedData = this.parseData(data);
        this.applyDataToItemGrabber(parsedData);
    }

    parseData(data: any) {
        //returns only checked values
        const obj: any = {};
        Object.keys(data).forEach(function(filterName, index) {
            obj[filterName] = data[filterName].filter((x: any) => x.checked).map((x: any) => x.key);
        });

        return obj;
    }

    applyDataToItemGrabber(data: any) {
        for (const filterName in data) {
            switch (filterName) {
                case 'cl':
                    this.options.itemGrabberOptions.allow.cls = data.cl;
                    break;
                case 'rarity':
                    const stat = this.options.itemGrabberOptions.allow.stats.find((stat: any) => stat.name === 'rarity');
                    if (stat) {
                        stat.params = ['includes', data.rarity];
                    }
                    break;
                default:
                    errorReport('Autofiller.js', 'applyDataToItemGrabber', `No filter type ${filterName}`);
            }
        }
        this.itemGrabber.setFilters(this.options.itemGrabberOptions);
    }

    mergeFilters(a: Filters, b: Filters) {
        const result: Filters = JSON.parse(JSON.stringify(b));

        for (const key of Object.keys(a)) {
            if (result.hasOwnProperty(key)) {
                for (const objA of a[key]) {
                    const keyA = objA.key;
                    const foundB = result[key].find((objB: any) => objB.key === keyA);

                    if (!foundB) {
                        result[key].push(objA);
                    }
                }
            } else {
                result[key] = a[key];
            }
        }

        return result;
    }

    getData(): Filters {
        const storageData = Engine.serverStorage.get(this.options.storageName) as Filters;
        return storageData ? this.mergeFilters(this.options.filters, storageData) : {
            ...this.options.filters
        };
    }

    saveData(data: any) {
        Engine.serverStorage.sendData({
            [this.options.storageName]: data
        }, () => {
            // const dataClone = JSON.parse(JSON.stringify(data));
            this.autofillerConfig.filtersUpdate(data);
            this.afterDataSave(data);
        });
    }

    enabled() {
        this.el.classList.remove('disabled');
    }

    disabled() {
        this.el.classList.add('disabled');
    }

    reset() {
        this.autofillerConfig.windowRemove();
    }

    getContent() {
        return this.el;
    }

    getEngine() {
        return Engine;
    }
}