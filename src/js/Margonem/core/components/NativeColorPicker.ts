import {
    setAttributes
} from '../HelpersTS';

const Tpl = require('@core/Templates');

interface ColorPickerData {
    id ? : string | number;
    name ? : string;
    value: string | number;
    label ? : string | HTMLLabelElement;
    attrs ? : object;
}

type Callback = (value: string) => void;

export default class NativeColorPicker {
    el: HTMLElement;
    inputEl: HTMLInputElement;
    labelEl: HTMLLabelElement;

    constructor(checkboxData: ColorPickerData, private onSelected ? : Callback) {
        this.el = Tpl.get('c-color-picker')[0] as HTMLElement;
        this.inputEl = this.el.querySelector('input') as HTMLInputElement
        this.labelEl = this.el.querySelector('label') as HTMLLabelElement
        this.createCheckbox(checkboxData);
    }

    createCheckbox({
        id,
        name,
        value,
        label,
        attrs
    }: ColorPickerData) {
        this.inputEl.addEventListener('change', (e) => {
            if (this.onSelected) {
                const value = this.getValue();
                this.onSelected(value);
            }
        });

        setAttributes(this.inputEl, {
            id,
            name,
            value
        });

        if (label) {
            if (typeof label === 'object') { // if html
                this.labelEl.appendChild(label);
            } else { // string
                this.labelEl.innerHTML = label;
            }
            if (id) this.labelEl.setAttribute('for', id.toString());
        }

        if (attrs && typeof attrs === 'object') {
            setAttributes(this.el, attrs);
        }
    }

    getElement() {
        return this.el;
    }

    getValue() {
        return this.inputEl.value;
    }

    setValue(value: string) {
        this.inputEl.value = value;
    }
}