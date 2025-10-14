const Tpl = require('@core/Templates');
import RadioList from "@core/components/RadioList";
import Button from "@core/components/Button";

export type BalanceValidator = (amount: number) => boolean;
export type IncomingPayments = {
    [currency: string]: number
} | PaymentOption[];

interface PaymentOption {
    code: string;
    label: string;
    amount: number;
    validate ? : BalanceValidator; // conditional validator for this payment option
}

type SelectorOptions = {
    submit ? : {
        btnText: string,
        btnOnClick: (selectedPayment: string, value: number) => void,
    };
    infobox ? : string;
    hidden ? : boolean;
    payments ? : PaymentOption[];
    selected ? : string | null;
};

export default class PaymentSelector {
    private readonly el: HTMLElement;
    private readonly paymentMethodsEl: HTMLElement;
    private readonly buttonsContainerEl: HTMLElement;
    private readonly infoboxEl: HTMLElement;
    private submitBtnEl!: Button;
    private disable: boolean = true;

    private options: SelectorOptions;
    private paymentOptions: PaymentOption[] = [];
    private selected: string | null = null;

    private defaultValidators: {
        [code: string]: BalanceValidator
    } = {
        gold: (amount: number) => this.engine.hero.d.gold >= amount,
        credits: (amount: number) => this.engine.hero.d.credits >= amount,
    };

    private readonly engine = Engine;

    constructor(options: SelectorOptions) {
        this.options = {
            ...options
        };
        this.el = Tpl.get('payment-selector')[0];
        this.paymentMethodsEl = this.el.querySelector('.payment-selector__methods') as HTMLElement;
        this.buttonsContainerEl = this.el.querySelector('.payment-selector__submit') as HTMLElement;
        this.infoboxEl = this.el.querySelector('.info-box') as HTMLElement;
        this.setHidden(!!this.options.hidden);

        if (this.options.infobox) {
            this.infoboxEl.textContent = this.options.infobox;
        } else {
            this.infoboxEl.remove();
        }
        if (this.options.submit) this.createSubmitButton();

        if (Array.isArray(this.options.payments)) {
            this.updatePayments(this.options.payments);
        }
    }

    private applyDefaultValidators(paymentOptions: PaymentOption[]): PaymentOption[] {
        return paymentOptions.map(option => {
            if (!option.validate && this.defaultValidators[option.code]) {
                return {
                    ...option,
                    validate: this.defaultValidators[option.code],
                };
            }
            return option;
        });
    }

    private sortPaymentOptions(paymentOptions: PaymentOption[]): PaymentOption[] {
        const orderMap: {
            [code: string]: number
        } = {
            gold: 0,
            credits: 1,
        };

        return paymentOptions.slice().sort((a, b) => {
            const indexA = orderMap[a.code] ?? 99;
            const indexB = orderMap[b.code] ?? 99;
            return indexA - indexB;
        });
    }

    public updatePayments(payments: IncomingPayments): void {
        let paymentOptions: PaymentOption[];
        if (Array.isArray(payments)) {
            paymentOptions = this.applyDefaultValidators(payments);
        } else {
            paymentOptions = this.convertPaymentsObjectToOptions(payments);
        }

        this.paymentOptions = this.sortPaymentOptions(paymentOptions);
        this.selected = null;
        this.clearPayment();
        this.createChoosePayment();
        this.setHidden(false);
    }

    private convertPaymentsObjectToOptions(paymentsObj: {
        [currency: string]: number
    }): PaymentOption[] {
        const labelsMap: {
            [code: string]: string
        } = {
            gold: 'Gold',
            credits: 'Credits',
        };

        return Object.entries(paymentsObj).map(([code, amount]) => ({
            code,
            label: labelsMap[code] ?? code,
            amount,
            validate: this.defaultValidators[code], // add default validator, if exist
        }));
    }

    private createChoosePayment(): void {
        if (!Array.isArray(this.paymentOptions) || !this.paymentOptions.length) {
            this.clearPayment();
            return;
        }
        this.clearPayment();

        const radioData = this.paymentOptions.map(option => ({
            value: option.code,
            name: option.code,
            label: this.createPaymentOption(option.code, option.label, option.amount),
        }));

        const radioList = new RadioList({
            radios: radioData,
            name: 'payment-selector',
            onSelected: this.onSelected.bind(this),
        }, {
            isInline: true
        }).getList();

        this.paymentMethodsEl.appendChild(radioList);
    }

    private createPaymentOption(currency: string, label: string, amount: number): HTMLLabelElement {
        const optionEl = Tpl.get('payment-selector-option')[0];
        optionEl.classList.add(`payment-selector__option--${currency}`);
        // optionEl.querySelector('.payment-selector__icon').textContent = label;
        optionEl.querySelector('.payment-selector__amount').innerHTML = round(amount, 2);
        return optionEl;
    }

    private onSelected(e: Event & {
        target: HTMLInputElement
    }): void {
        this.selected = e.target.value;
        if (this.options.submit) this.setStateConfirmButton();
    }

    private createSubmitButton(): void {
        const opts = {
            text: this.options.submit!.btnText ?? this.tLang('submit_btn'),
            classes: ['small', 'green'],
            action: this.confirmOnClick.bind(this),
            disabled: true,
        };
        this.submitBtnEl = new Button(opts);
        this.buttonsContainerEl.appendChild(this.submitBtnEl.getButton());
    }

    private checkRequires(): boolean {
        if (!this.selected) return false;
        const option = this.paymentOptions.find(opt => opt.code === this.selected);
        if (!option) return false;

        if (option.validate) return option.validate(option.amount);

        // no validator = true
        return true;
    }

    private setStateConfirmButton(): void {
        if (!this.selected) {
            this.disableSubmitButton();
            return;
        }
        if (this.checkRequires()) {
            this.enableSubmitButton();
        } else {
            this.disableSubmitButton();
        }
    }

    private enableSubmitButton(): void {
        this.submitBtnEl.setState(false);
    }

    private disableSubmitButton(): void {
        this.submitBtnEl.setState(true);
    }

    private confirmOnClick(): void {
        if (this.selected && this.options.submit) {
            this.options.submit.btnOnClick(this.selected, this.paymentOptions.find(opt => opt.code === this.selected)?.amount ?? 0);
        }
    }

    private setHidden(state: boolean): void {
        this.disable = state;
        if (this.disable) {
            this.el.classList.add('payment-selector--hidden');
        } else {
            this.el.classList.remove('payment-selector--hidden');
        }
    }

    private clearPayment(): void {
        this.paymentMethodsEl.innerHTML = '';
    }

    public getComponent(): HTMLElement {
        return this.el;
    }

    public reset(): void {
        this.selected = null;
        this.paymentOptions = [];
        this.disableSubmitButton();
        this.clearPayment();
        this.setHidden(true);
    }

    public destroy(): void {
        // cleanup
    }

    private tLang(name: string, category: string = 'extraction', params: null | {} = null): string {
        return typeof RUNNING_UNIT_TEST === "undefined" ? _t(name, params, category) : '';
    }
}