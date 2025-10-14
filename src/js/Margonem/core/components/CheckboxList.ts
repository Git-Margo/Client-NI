import Checkbox, {
    CheckboxData
} from './Checkbox';

export interface CheckboxListOptions {
    container ? : HTMLElement;
    returnType ? : 'array' | 'bitmask';
    onChange ? : (selected: Array < string | number > | number) => void;
}

export default class CheckboxList {
    private checkboxes: Checkbox[] = [];
    private container: HTMLElement;
    private returnType: 'array' | 'bitmask';
    private onChange ? : (selected: Array < string | number > | number) => void;

    constructor(data: CheckboxData[], options: CheckboxListOptions) {
        this.container = options.container ? options.container : document.createElement("div");
        this.returnType = options.returnType ?? 'array';
        this.onChange = options.onChange;
        this.createList(data);
    }

    private createList(data: CheckboxData[]) {
        this.container.classList.add('checkbox-list');
        data.forEach((checkboxData, index) => {
            checkboxData.i = index;
            const checkbox = new Checkbox(checkboxData, () => this.handleChange());
            this.checkboxes.push(checkbox);
            this.container.appendChild(checkbox.getCheckbox());
        });
    }

    private handleChange() {
        if (this.onChange) {
            this.onChange(this.getSelected());
        }
    }

    getComponent() {
        return this.container;
    }

    getSelected(): Array < string | number > | number {
        if (this.returnType === 'array') {
            const result: Array < string | number > = [];
            this.checkboxes.forEach(checkbox => {
                if (checkbox.getChecked()) {
                    result.push(checkbox.getValue());
                }
            });
            return result;
        } else if (this.returnType === 'bitmask') {
            let bitmask = 0;
            this.checkboxes.forEach((checkbox, index) => {
                if (checkbox.getChecked()) {
                    bitmask |= (1 << index);
                }
            });
            return bitmask;
        }
        return [];
    }

    setSelected(selected: Array < string | number > | number) {
        if (this.returnType === 'array' && Array.isArray(selected)) {
            this.checkboxes.forEach(checkbox => {
                const value = checkbox.getValue();
                checkbox.setChecked(selected.includes(value));
            });
        } else if (this.returnType === 'bitmask' && typeof selected === 'number') {
            this.checkboxes.forEach((checkbox, index) => {
                const isChecked = Boolean(selected & (1 << index));
                checkbox.setChecked(isChecked);
            });
        }
    }
}