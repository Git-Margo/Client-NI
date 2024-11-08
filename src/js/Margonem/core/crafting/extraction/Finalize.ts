const Tpl = require('core/Templates');

import RadioList from "../../components/RadioList";

declare const _g: Function;
declare const _t: Function;
declare const isset: Function;
declare const askAlert: Function;
declare const createButton: Function;
declare const formNumberToNumbersGroup: Function;
declare const round: Function;

interface PaymentMethods {
    gold: number,
    credits: number
}

export default class Finalize {

    radioList: any = {
        radios: [{ // gold
                value: 'z',
                label: '',
            },
            { // credits
                value: 's',
                label: '',
            },
        ],
        name: 'extraction-payment',
        onSelected: this.onSelected.bind(this)
    }

    CURRENCY = {
        GOLD: 'gold',
        CREDITS: 'credits'
    }

    disable: boolean = true;

    payments: PaymentMethods | null = null;
    selected: string | null = null;
    paymentEl: HTMLElement;
    submitBtnEl!: HTMLElement;
    buttonsContainerEl!: HTMLElement;

    constructor(private el: HTMLElement) {
        this.paymentEl = this.el.querySelector('.extraction__payment') as HTMLElement;
        this.buttonsContainerEl = this.el.querySelector('.extraction__submit') as HTMLElement;
        this.setDisableState(true);
        this.createConfirmButton();
    }

    createChoosePayment() {
        if (!this.payments) return;

        const {
            gold,
            credits
        }: PaymentMethods = this.payments;
        this.clearPayment();

        this.radioList.radios[0].label = this.createPaymentOption(this.CURRENCY.GOLD, gold.toString());
        this.radioList.radios[1].label = this.createPaymentOption(this.CURRENCY.CREDITS, credits.toString());

        const radioList = new RadioList(this.radioList, {
            isInline: true
        }).getList();
        this.paymentEl.appendChild(radioList);
    }

    createPaymentOption(currency: string, val: string) {
        const optionEl = Tpl.get('extractionPaymentOption')[0];
        optionEl.classList.add(`extraction__currency--${currency}`);
        optionEl.querySelector('.amount').innerHTML = round(val, 2);
        return optionEl;
    }

    onSelected(e: Event & {
        target: HTMLInputElement
    }) {
        this.selected = e.target.value; // value radio input from Radio.ts
        this.setStateConfirmButton();
    }

    setStateConfirmButton() {
        if (this.selected === null) {
            this.disableConfirmButton(); // need choose bonus first
            return;
        }
        if (this.checkRequires()) {
            this.enableConfirmButton();
        } else {
            this.disableConfirmButton();
        }
    }

    enableConfirmButton() {
        this.submitBtnEl.classList.remove('disable');
    }

    disableConfirmButton() {
        this.submitBtnEl.classList.add('disable');
    }

    checkRequires() {
        if (!this.payments) return false;

        const {
            gold,
            credits
        } = this.payments;
        return (gold <= this.getEngine().hero.d.gold && this.selected === 'z') ||
            (credits <= this.getEngine().hero.d.credits && this.selected === 's');
    }

    createConfirmButton() {
        const opts = {
            txt: this.tLang('submit_btn'),
            classes: ['small', 'green', 'disable'],
            onClick: this.confirmOnClick.bind(this)
        };
        this.submitBtnEl = createButton(opts.txt, opts.classes, opts.onClick);
        this.buttonsContainerEl.appendChild(this.submitBtnEl);
    }

    confirmOnClick() {
        const
            val = this.selected === 'z' ? {
                '%val%': formNumberToNumbersGroup(this.payments?.gold),
                '%val2%': _t('cost_gold')
            } : {
                '%val%': formNumberToNumbersGroup(this.payments?.credits),
                '%val2%': _t('cost_credits')
            },
            costInfo = this.tLang('extract_cost %val%', 'extraction', val),
            confirmInfo = this.tLang('confirm-prompt'),
            text = costInfo + confirmInfo,
            dataAlert = {
                q: text,
                clb: () => this.sendExtractRequest(),
                m: 'yesno4'
            };
        askAlert(dataAlert);
    }

    sendExtractRequest() {
        const extractItem = this.getExtraction().selectedExtractItem;
        _g(`extractor&action=extract&currency=${this.selected}&item=${extractItem}`)
    }

    update(payments: PaymentMethods) {
        this.payments = payments;
        this.createChoosePayment();
        this.setDisableState(false);
    }

    setDisableState(state: boolean) {
        this.disable = state;
        if (this.disable) {
            this.el.classList.add('disabled');
        } else {
            this.el.classList.remove('disabled');
        }
    }

    clearPayment() {
        this.paymentEl.innerHTML = '';
    }

    reset() {
        this.selected = null;
        this.payments = null;
        this.disableConfirmButton();
        this.clearPayment();
        this.setDisableState(true);
    }

    destroy() {

    }

    tLang(name: string, category: string = 'extraction', params: null | {} = null) {
        return typeof RUNNING_UNIT_TEST === "undefined" ? _t(name, params, category) : '';
    };

    getExtraction() {
        return this.getEngine().crafting.extraction;
    }

    getEngine() {
        return Engine;
    }

}