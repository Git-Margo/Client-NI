import {
    isset,
    setAttributes
} from '../HelpersTS';

const Tpl = require('core/Templates');

interface CheckboxData {
    id ? : string | number;
    name: string;
    value: string | number;
    label ? : string | HTMLLabelElement;
    checked ? : boolean;
    attrs ? : object;
    i ? : number;
    highlight ? : boolean;
    tip ? : string;
}

export default class Checkbox {
    el: HTMLElement;

    constructor(checkboxData: CheckboxData, private onSelected: Function | null) {
        this.el = Tpl.get('checkbox-custom')[0] as HTMLElement;
        this.createCheckbox(checkboxData);
    }

    createCheckbox({
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
        const inputEl = this.el.querySelector('input') as HTMLInputElement,
            labelEl = this.el.querySelector('label') as HTMLLabelElement;

        this.el.classList.add('c-checkbox');

        labelEl.classList.add('c-checkbox__label');
        if (highlight) labelEl.classList.add('c-checkbox__label--highlight');

        inputEl.addEventListener('change', (e) => {
            if (this.onSelected) {
                const state = this.getChecked();
                this.onSelected(state);
            }
        });

        if (!isset(id) && isset(i)) {
            id = `${name}_${i}`;
        }

        setAttributes(inputEl, {
            id,
            name,
            value
        });

        if (isset(checked) && checked) {
            inputEl.checked = true;
        }

        if (label) {
            this.setLabel(label);
        } else {
            this.el.classList.add('checkbox-custom--alone');
        }
        if (tip) this.setTip(tip);

        if (id) labelEl.setAttribute('for', id.toString());

        if (attrs && typeof attrs === 'object') {
            setAttributes(this.el, attrs);
        }
    }

    setTip(value: string) {
        return $(this.el).tip(value);
    }

    setLabel(label: string | HTMLElement) {
        const labelEl = this.el.querySelector < HTMLLabelElement > ('label') !;
        if (typeof label === 'object') { // if html
            labelEl.appendChild(label);
        } else { // string
            labelEl.innerHTML = label;
        }

    }

    getCheckbox() {
        return this.el;
    }

    getChecked() {
        const inputEl = this.el.querySelector('input') as HTMLInputElement;
        return inputEl.checked;
    }

    setChecked(state: boolean) {
        const inputEl = this.el.querySelector('input') as HTMLInputElement;
        inputEl.checked = state;
    }
}