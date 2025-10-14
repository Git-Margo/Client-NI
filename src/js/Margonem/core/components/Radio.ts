import {
    isset,
    setAttributes
} from '../HelpersTS';

const Tpl = require('@core/Templates');

interface RadioData {
    id ? : string | number;
    name: string;
    value: string | number;
    label ? : string | HTMLLabelElement;
    selected ? : boolean;
    i ? : number;
}

export default class Radio {
    el: HTMLElement;

    constructor(radioData: RadioData, private onSelected: Function | null) {
        this.el = Tpl.get('radio-custom')[0] as HTMLElement;
        this.createRadio(radioData);
    }

    createRadio({
        id,
        name,
        value,
        label,
        selected,
        i
    }: RadioData) {
        const inputEl = this.el.querySelector('input') as HTMLInputElement,
            labelEl = this.el.querySelector('label') as HTMLLabelElement;

        inputEl.addEventListener('change', (e) => {
            if (this.onSelected) this.onSelected(e);
        });

        if (!isset(id) && isset(i)) {
            id = `${name}_${i}`;
        }

        setAttributes(inputEl, {
            id,
            name,
            value
        });

        if (isset(selected) && selected) {
            inputEl.checked = true;
        }

        if (label) {
            labelEl.setAttribute('for', id!.toString());
            if (typeof label === 'object') {
                // if html
                labelEl.appendChild(label);
            } else {
                // string
                labelEl.innerHTML = label;
            }
        }
    }

    getRadio() {
        return this.el;
    }
}