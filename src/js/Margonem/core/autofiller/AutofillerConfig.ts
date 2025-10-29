import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import {
    errorReport,
    isset
} from '../HelpersTS';

const Tpl = require('@core/Templates');

declare const Engine: any;
declare const _t: any;

const defaultOptions = {};

export default class AutofillerConfig {
    el: HTMLElement;
    private isOpen: boolean = false;
    private wnd: any;
    private wndEl!: HTMLElement;
    private options: any;
    private tempData!: object;

    constructor(options: any, private data: any, private saveCallback: (data: object) => void) {
        this.el = Tpl.get('autofiller')[0] as HTMLElement;
        this.options = {
            ...defaultOptions,
            ...options
        };
        this.setInitialData();
        this.windowInit();
        this.setContent();
    }

    setContent() {
        this.setHeading();
        this.createGroups();
        // this.setCheckboxes();
        this.setButtons();
    }

    setHeading() {
        const headingEl = this.wndEl.querySelector('.autofiller-config__heading') as HTMLElement;
        headingEl.textContent = this.options.heading;
    }

    setButtons() {
        const buttonsContainerEl = this.wndEl.querySelector('.autofiller-config__buttons') as HTMLElement;
        const buttonOptions = [{
                text: _t('save', null, 'buttons'),
                classes: ['small', 'green'],
                action: () => this.onClickSave()
            },
            {
                text: _t('cancel', null, 'buttons'),
                classes: ['small', 'green'],
                action: () => this.windowClose()
            },
        ];

        for (const options of buttonOptions) {
            const button = new Button(options).getButton();
            buttonsContainerEl.appendChild(button);
        }
    }

    onClickSave() {
        this.saveCallback(this.tempData);
        this.windowClose();
    }

    filtersUpdate(data: any) {
        this.data = JSON.parse(JSON.stringify(data));
        this.setInitialData();
    }

    createGroups() {
        if (!isset(this.options.groups)) {
            errorReport('Autofiller.js', 'createGroups', 'No groups defined');
            return;
        }

        const groupsEl = this.wndEl.querySelector('.autofiller-config__groups') as HTMLElement;
        for (const {
                id,
                title
            }
            of this.options.groups) {
            const groupEl = Tpl.get('autofiller-config-group')[0] as HTMLElement;
            const groupTitleEl = groupEl.querySelector('.autofiller-config__title') as HTMLElement;
            groupTitleEl.textContent = title;
            groupEl.classList.add(`group-${id}`);
            groupsEl.appendChild(groupEl);
        }
    }

    setCheckboxes() {
        for (const filter in this.tempData) {
            // @ts-ignore
            const filterData = this.tempData[filter];
            for (const {
                    key,
                    checked,
                    groupId,
                    label
                }
                of filterData) {
                const groupEl = this.wndEl.querySelector(`.group-${groupId} .autofiller-config__checkboxes`) as HTMLElement;
                const checkbox = new Checkbox({
                        name: `${filter}_${key}`,
                        label: label ? label : this.getLabel(filter, key),
                        value: key,
                        i: key,
                        checked,
                        attrs: {
                            'data-type': 'cl'
                        },
                    },
                    (state: boolean) => this.onSelected(state, filter, key),
                ).getCheckbox();
                groupEl.appendChild(checkbox);
            }
        }
    }

    clearCheckboxes() {
        this.wndEl.querySelectorAll < HTMLElement > (`.autofiller-config__checkboxes`).forEach((el) => (el.innerHTML = ''));
    }

    onSelected(state: boolean, filter: string, key: string | number) {
        // @ts-ignore
        let obj = this.tempData[filter].find((x) => x.key === key);
        obj.checked = state;
    }

    getLabel(filterType: string, key: string | number) {
        let label;
        switch (filterType) {
            case 'cl':
                label = _t(`au_cat${key}`, null, 'auction');
                break;
            case 'rarity':
                label = _t(`rarity_${key}`, null, 'item');
                break;
            default:
                errorReport('Autofiller.js', 'getLabel', `No filter type ${filterType}`);
        }

        return label;
    }

    windowInit() {
        const content = Tpl.get('autofiller-config');

        this.getEngine().windowManager.add({
            content: content,
            title: this.options.title,
            nameWindow: this.getEngine().windowsData.name.AUTOFILLER_CONFIG,
            objParent: this,
            type: this.getEngine().windowsData.type.TRANSPARENT,
            nameRefInParent: 'wnd',
            managePosition: {
                x: '251',
                y: '65'
            },
            addClass: this.options.cssClass + ' autofiller-window',
            twPadding: 'md',
            onclose: () => {
                this.close();
            },
        });
        this.wnd.addToAlertLayer();
        this.wnd.hide();
        this.wnd.removeWndOnPeak();
        this.wndEl = this.wnd.$[0];
    }

    getContent() {
        return this.el;
    }

    windowToggle() {
        if (this.isOpen) this.windowClose();
        else this.windowOpen();
    }

    setInitialData() {
        this.tempData = JSON.parse(JSON.stringify(this.data));
    }

    windowOpen() {
        this.setInitialData();
        this.setCheckboxes();
        this.wnd.show();
        this.isOpen = true;
        this.wnd.center();
        this.wnd.setWndOnPeak();
    }

    windowClose() {
        this.wnd.hide();
        this.isOpen = false;
        this.clearCheckboxes();
        this.tempData = {};
    }

    windowRemove() {
        this.windowClose();
        this.wnd.remove();
    }

    close() {
        this.windowClose();
    }

    getEngine() {
        return Engine;
    }
}