import {
    createTransVal
} from '../../HelpersTS';

const Tpl = require('@core/Templates');

declare const setAttributes: Function;
declare const createButton: Function;
declare const askAlert: Function;
declare const _t: Function;

type OnSelectedClbOrFalse = ((m: any) => void) | false;
type OnSubmitClbOrFalse = ((result: boolean, selected ? : number) => void) | false;

interface Options {
    onSelectedClb: OnSelectedClbOrFalse;
    ownSubmitBtn: boolean;
    itemId: number | boolean;
    onSubmitClb: OnSubmitClbOrFalse;
    isReselectWindow: boolean;
}

export default class BonusSelector {
    selected: number | null = null;
    el!: HTMLElement;
    bonusesEl!: HTMLElement;
    buttonsContainerEl!: HTMLElement;
    submitBtnEl!: HTMLElement;
    cancelBtnEl!: HTMLElement;

    defaultOptions: Options = {
        onSelectedClb: false,
        ownSubmitBtn: false,
        itemId: false,
        onSubmitClb: false,
        isReselectWindow: false,
    };
    options: Options;

    constructor(private wrapperEl: HTMLElement, _options: {}) {
        this.options = {
            ...this.defaultOptions,
            ..._options
        };
        this.createContent();
    }

    createContent() {
        this.el = Tpl.get('bonus-selector')[0];
        this.bonusesEl = this.el.querySelector('.bonus-selector__bonuses') as HTMLElement;
        this.buttonsContainerEl = this.el.querySelector('.bonus-selector__submit') as HTMLElement;
    }

    createBonusChoose(bonuses: any) {
        let i = 0;
        this.bonusesEl.innerHTML = '';
        for (const bonus of bonuses) {
            const radio = Tpl.get('radio-custom')[0];
            let [name, values] = bonus;

            const input = radio.querySelector('input');
            const label = radio.querySelector('label');
            let firstBonusPrefix = '';
            setAttributes(input, {
                id: name,
                name: 'enhance-bonus',
                value: i
            });
            label.setAttribute('for', name);
            if (this.options.isReselectWindow && i === 0) {
                firstBonusPrefix = `<b>${this.tLang('current_bonus')}</b> `;
            }
            label.innerHTML = firstBonusPrefix + this.bonusStatsParser(name, values.split(',')); //`${bonusName} - +${bonusValue}`;

            this.bonusesEl.appendChild(radio);

            input.addEventListener('change', this.onSelected.bind(this));
            i++;
        }

        if (!this.options.ownSubmitBtn) this.createButtons();
        this.wrapperEl.appendChild(this.el);
    }

    onSelected(e: Event & {
        target: HTMLInputElement
    }) {
        this.selected = parseInt(e.target.value);
        if (!this.options.ownSubmitBtn) this.setStateSubmitButton();
        if (this.options.onSelectedClb && typeof this.options.onSelectedClb === 'function')
            this.options.onSelectedClb(this.selected);
    }

    createButtons() {
        this.buttonsContainerEl.innerHTML = '';
        this.createConfirmButton();
        this.createCancelButton();
    }

    createConfirmButton() {
        const opts = {
            txt: this.tLang('accept', 'buttons'),
            classes: ['small', 'green', 'disable'],
            onClick: this.confirmOnClick.bind(this),
        };
        this.submitBtnEl = createButton(opts.txt, opts.classes, opts.onClick);
        this.buttonsContainerEl.appendChild(this.submitBtnEl);
    }

    createCancelButton() {
        const opts = {
            txt: this.tLang('cancel', 'buttons'),
            classes: ['small', 'red'],
            onClick: this.cancelOnClick.bind(this),
        };
        this.cancelBtnEl = createButton(opts.txt, opts.classes, opts.onClick);
        this.buttonsContainerEl.appendChild(this.cancelBtnEl);
    }

    confirmOnClick() {
        const text = this.tLang('confirm-prompt'),
            dataAlert = {
                q: text,
                clb: () => this.submit(),
                m: 'yesno4',
            };
        askAlert(dataAlert);
    }

    cancelOnClick() {
        if (this.options.onSubmitClb && typeof this.options.onSubmitClb === 'function') this.options.onSubmitClb(false);
    }

    setStateSubmitButton() {
        if (this.selected !== null) {
            this.enableSubmitButton();
        } else {
            this.disableSubmitButton();
        }
    }

    enableSubmitButton() {
        this.submitBtnEl.classList.remove('disable');
    }

    disableSubmitButton() {
        this.submitBtnEl.classList.add('disable');
    }

    submit() {
        if (typeof this.options.onSubmitClb === 'function' && this.selected != null)
            this.options.onSubmitClb(true, this.selected);
    }

    bonusStatsParser(statName: string, statValues: number[]) {
        const prefix = '(+',
            suffix = ')';
        let unit = '';
        let trans;
        switch (statName) {
            case 'critmval':
                unit = '%';
                trans = _t(`bonus_of-${statName} %val%`, createTransVal(statValues[0], unit, prefix, suffix), 'newOrder');
                break;
            case 'sa':
                trans = _t('no_percent_bonus_sa %val%', createTransVal(statValues[0] / 100, unit, prefix, suffix));
                break;
            case 'ac':
                trans = _t(`item_${statName} %val%`, createTransVal(statValues[0], unit, prefix, suffix));
                break;
            case 'act':
            case 'resfire':
            case 'reslight':
            case 'resfrost':
                unit = '%';
                trans = _t(`item_${statName} %val%`, createTransVal(statValues[0], unit, prefix, suffix), 'newOrder');
                break;
            case 'crit':
            case 'critval':
            case 'resdmg':
                unit = '%';
                trans = _t(`bonus_${statName} %val%`, createTransVal(statValues[0], unit, prefix, suffix), 'newOrder');
                break;
            case 'slow':
                trans = _t(`bonus_${statName} %val%`, createTransVal(statValues[0] / 100, unit, prefix, suffix));
                break;
            case 'enfatig':
            case 'manafatig':
                trans = _t(`bonus_${statName}`, {
                    ...createTransVal(statValues[0], '%', prefix, suffix, '%val1%'),
                    ...createTransVal(statValues[1], unit, prefix, suffix, '%val2%')
                });
                break;
            default:
                trans = _t(`bonus_${statName} %val%`, createTransVal(statValues[0], unit, prefix, suffix));
        }

        return trans;
    }

    tLang(name: string, category: string = 'enhancement', params: null | {} = null) {
        return typeof RUNNING_UNIT_TEST === 'undefined' ? _t(name, params, category) : '';
    }
}