const Tpl = require('core/Templates');

import Radio from './Radio';

type Options = {
    isInline: boolean;
    label ? : string | null;
    elementBeforeLabel ? : HTMLElement | null;
    elementAfterLabel ? : HTMLElement | null;
};
type RadioListData = {
    radios: RadioData[];
    name: string;
    onSelected ? : Function | null;
};
type RadioData = {
    id: string | number;
    name: string;
    value: string | number;
    label ? : string | HTMLLabelElement;
    selected ? : boolean;
    i ? : number;
};

export default class RadioList {
    radioListEl: HTMLElement;

    defaultOptions: Options = {
        isInline: false,
        elementBeforeLabel: null,
        label: null,
        elementAfterLabel: null
    };
    options: Options;

    constructor(private radiosData: RadioListData, _options: {}) {
        this.options = {
            ...this.defaultOptions,
            ..._options
        };
        this.radioListEl = Tpl.get('radio-list')[0] as HTMLElement;
        this.createContent();
    }

    createContent() {
        this.createRadioInfo();
        this.createRadios()
    }

    createRadios() {
        let i = 0;
        for (const radio of this.radiosData.radios) {
            radio.name = this.radiosData.name;
            radio.i = i++;
            const clb = this.radiosData.onSelected ? this.radiosData.onSelected : null;
            const radioEl = new Radio(radio, clb).getRadio();
            this.radioListEl.appendChild(radioEl);
            if (this.options.isInline) {
                this.radioListEl.classList.add('radio-list--inline');
            }
        }
    }

    createRadioInfo() {
        let radioInfo = null;

        if (this.options.elementBeforeLabel != null || this.options.label != null || this.options.elementAfterLabel != null) {
            radioInfo = Tpl.get("radio-info")[0];
            this.radioListEl.appendChild(radioInfo)
        }

        if (this.options.label != null) {
            let label = radioInfo.querySelector(".radio-label");
            label.innerText = this.options.label;
            label.style.display = 'inline-block';
        }

        if (this.options.elementBeforeLabel != null) {
            let elementBeforeLabel = radioInfo.querySelector(".radio-before-label");
            elementBeforeLabel.append(this.options.elementBeforeLabel);
            elementBeforeLabel.style.display = 'inline-block';
        }

        if (this.options.elementAfterLabel != null) {
            let elementAfterLabel = radioInfo.querySelector(".radio-after-label");
            elementAfterLabel.append(this.options.elementAfterLabel);
            elementAfterLabel.style.display = 'inline-block';
        }
    }

    getList() {
        return this.radioListEl;
    }
}