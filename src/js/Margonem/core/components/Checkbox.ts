import {
    isset,
    setAttributes
} from '../HelpersTS';
const Tpl = require('@core/Templates');

export interface BaseCheckboxData {
    name: string;
}

export interface OptionalCheckboxData {
    value ? : string | number;
    id ? : string | number;
    label ? : string | HTMLLabelElement;
    checked ? : boolean;
    attrs ? : object;
    i ? : number;
    highlight ? : boolean;
    tip ? : string;
}

export interface CheckboxData extends BaseCheckboxData, OptionalCheckboxData {}

export default class Checkbox {
    el: HTMLElement;
    private inputEl: HTMLInputElement;
    private labelEl: HTMLLabelElement;

    constructor(checkboxData: CheckboxData, private onSelected: (state: boolean) => void) {
        this.el = Tpl.get('checkbox-custom')[0] as HTMLElement;
        this.inputEl = this.el.querySelector('input') as HTMLInputElement;
        this.labelEl = this.el.querySelector('label') as HTMLLabelElement;
        this.createCheckbox(checkboxData);
    }

    private createCheckbox({
        id,
        name,
        value,
        label,
        checked,
        attrs,
        i,
        highlight = true,
        tip
    }: CheckboxData) {
        this.el.classList.add('c-checkbox');
        this.labelEl.classList.add('c-checkbox__label');
        if (highlight) this.labelEl.classList.add('c-checkbox__label--highlight');

        this.inputEl.addEventListener('change', () => {
            this.onSelected?.(this.getChecked());
        });

        if (!isset(id) && isset(i)) {
            id = `${name}_${i}`;
        }

        setAttributes(this.inputEl, {
            id,
            name,
            ...(value && {
                value
            })
        });

        if (checked) {
            this.inputEl.checked = true;
        }

        if (label) {
            this.setLabel(label);
        } else {
            this.el.classList.add('checkbox-custom--alone');
        }

        if (tip) this.setTip(tip);
        if (id) this.labelEl.setAttribute('for', id.toString());
        if (attrs) setAttributes(this.el, attrs);
    }

    setTip(value: string) {
        return $(this.el).tip(value);
    }

    setLabel(label: string | HTMLElement) {
        if (typeof label === 'object') {
            this.labelEl.appendChild(label);
        } else {
            this.labelEl.innerHTML = label;
        }
    }

    getCheckbox() {
        return this.el;
    }

    getChecked() {
        return this.inputEl.checked;
    }

    setChecked(state: boolean) {
        this.inputEl.checked = state;
    }

    toggleChecked(state ? : boolean) {
        this.inputEl.checked = state !== undefined ? state : !this.inputEl.checked;
    }

    getValue(): string | number {
        return this.inputEl.value;
    }
}