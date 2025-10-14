import Slider from "@core/components/Slider";
import Checkbox, {
    CheckboxData,
    OptionalCheckboxData
} from "@core/components/Checkbox";
import NativeColorPicker from "@core/components/NativeColorPicker";
import CheckboxList, {
    CheckboxListOptions
} from "@core/components/CheckboxList";
import {
    isset,
    stringToHtml,
    throwError
} from "@core/HelpersTS";
import {
    FieldTypes,
    FormElementClass,
    InputOptions
} from "./FormBuilderData";
import Button, {
    ButtonData
} from "@core/components/Button";

type Control = Slider | Checkbox | CheckboxList | Button | NativeColorPicker | JQuery | null;
type fieldValue = boolean | string | number | (string | number)[] | null;

interface CommonOptions {
    wrapperElement ? : HTMLElement;
    cssClass ? : string;
}

interface BaseFieldData {
    name: string,
    type: FieldTypes,
}

interface OptionalFieldData extends CommonOptions {
    control ? : Control
    createFullComponent ? : boolean;
    label ? : string | false;
    labelTip ? : string | false;
    value ? : fieldValue,
        afterSetCallback ? : (value: fieldValue) => void;
}

interface FieldData extends BaseFieldData, OptionalFieldData {}

interface MenuFieldData extends FieldData {
    menuOptions ? : any,
        menuData ? : any,
}

interface InputFieldData extends FieldData {
    inputOptions ? : InputOptions,
}

interface CheckboxFieldData extends FieldData {
    checkboxOptions ? : OptionalCheckboxData,
}

interface CheckboxListFieldData extends FieldData {
    checkboxes: CheckboxData[];
    checkboxListOptions ? : CheckboxListOptions
}

interface ButtonFieldData extends FieldData {
    buttonOptions ? : ButtonData;
}

interface LabelData extends CommonOptions {}

export interface AllFieldData extends FieldData, MenuFieldData, InputFieldData, CheckboxFieldData, ButtonFieldData, LabelData {}

export interface AllOptionalFieldData extends Omit < AllFieldData, keyof BaseFieldData > {

}



interface Options {
    onChangeCallback ? : (fieldName: string, value: fieldValue) => void,
        prefix ? : string,
}

const defaultOptions: Options = {
    prefix: ''
}

export default class FormBuilder {
    private options: Options;
    private fieldsData: FieldData[] = [];
    private fieldTemplate = `
    <div class="${FormElementClass.FIELD}">
      <div class="${FormElementClass.LABEL}"></div>
      <div class="${FormElementClass.CONTROL}"></div>
    </div>
  `;
    private headerTemplate = `
    <div class="fb-header"></div>
  `;

    constructor(fieldsData: FieldData[] = [], customOptions: Options) {
        this.options = {
            ...defaultOptions,
            ...customOptions
        };
        this.setFields(fieldsData);
    }
    setFields(fields: FieldData[]) {
        this.fieldsData = fields;
    }
    createFields() {
        const fieldsContainer = document.createElement("div");

        for (const field of this.fieldsData) {
            const el = this.createField(field);
            fieldsContainer.appendChild(el);
        }
        // const container = document.createElement("div");
        // container.innerHTML = this.fieldTemplate;
        return fieldsContainer;
    }

    createField(fieldNameOrData: string | FieldData, options: AllFieldData | AllOptionalFieldData = {}) {
        let field: FieldData;
        const defaultData = {
            createFullComponent: true,
        }

        if (typeof fieldNameOrData === "string") {
            const foundField = this.findFieldByName(fieldNameOrData);
            if (!foundField) {
                throw new Error(`Field "${fieldNameOrData}" is not defined in fieldsData.`);
            }
            field = foundField;
            Object.assign(field, Object.assign({}, defaultData, field, options));
        } else {
            field = {
                ...defaultData,
                ...fieldNameOrData,
                ...options
            };
            this.fieldsData.push(field);
        }

        let el!: HTMLElement;
        switch (field.type) {
            case FieldTypes.INPUT:
                el = this.createInput(field);
                break;
            case FieldTypes.MENU:
                el = this.createMenu(field);
                break;
            case FieldTypes.CHECKBOX:
                el = this.createCheckbox(field);
                break;
            case FieldTypes.CHECKBOXLIST:
                el = this.createCheckboxList(field as CheckboxListFieldData);
                break;
            case FieldTypes.COLORPICKER:
                el = this.createColorPicker(field);
                break;
            case FieldTypes.SLIDER:
                el = this.createSlider(field);
                break;
            case FieldTypes.BUTTON:
                el = this.createButton(field as ButtonFieldData);
                break;
            default:
                throwError('FormBuilder.ts', 'createField', `Field type "${field.type}" is not exist.`);
        }

        if (field.createFullComponent) el = this.createFieldTemplate(el, field);
        field.cssClass?.length && el.classList.add(field.cssClass);
        field.wrapperElement?.appendChild(el);
        return el;
    }

    createFieldTemplate(el: HTMLElement, field: FieldData) {
        const tpl = stringToHtml(this.fieldTemplate) as HTMLElement;
        const labelEl = tpl.querySelector('.' + FormElementClass.LABEL) as HTMLLabelElement;

        if (field.label && field.type !== FieldTypes.CHECKBOX) {
            labelEl.textContent = field.label;
            if (field.labelTip) $(labelEl).tip(field.labelTip);
        } else tpl.removeChild(labelEl);

        tpl.querySelector('.' + FormElementClass.CONTROL) !.appendChild(el);
        return tpl;
    }

    createInput(field: InputFieldData) {
        const value = String(isset(field.value) ? field.value : '');
        const inputOptions = field.inputOptions ? field.inputOptions : < InputOptions > {};
        inputOptions.val = value;
        const control = createNiInput({
            ...inputOptions,
            ...{
                changeClb: (value: string) => this.onChange(field.name, value)
            }
        });
        field.control = control.find('input');
        return control[0];
    }

    createMenu(field: MenuFieldData) {
        const presetData = field.value;
        const control = $('<div class="menu"></div>');
        const options = isset(field.menuOptions) ? field.menuOptions : {};
        control.createMenu(field.menuData, true, (value) => this.onChange(field.name, Number(value)), options);
        control.setOptionWithoutCallbackByValue(String(presetData));
        field.control = control;
        return control[0];
    }

    createCheckbox(field: CheckboxFieldData) {
        const value = field.value;
        const control = new Checkbox({
                id: this.options.prefix + field.name,
                name: field.name,
                ...(field.label && {
                    label: field.label
                }), //label: LfLang(field.name),
                value: < string > value,
                checked: < boolean > value,
                ...(field.checkboxOptions && field.checkboxOptions),
            },
            (state: boolean) => this.onChange(field.name, state),
        );

        field.control = control;
        return control.getCheckbox();
    }

    createCheckboxList(field: CheckboxListFieldData) {
        if (!field.checkboxes || !Array.isArray(field.checkboxes)) {
            throw new Error(`Field ${field.name} needs property "checkboxes" type of array.`);
        }

        const checkboxList = new CheckboxList(field.checkboxes, {
            ...(field.checkboxListOptions?.returnType && {
                returnType: field.checkboxListOptions.returnType
            }),
            onChange: (selected: Array < string | number > | number) => {
                this.onChange(field.name, selected);
            }
        });

        if (isset(field.value)) {
            checkboxList.setSelected( < Array < string | number > | number > field.value);
        }
        field.control = checkboxList;
        return checkboxList.getComponent();
    }

    createColorPicker(field: FieldData) {
        const control = new NativeColorPicker({
                id: this.options.prefix + field.name,
                name: field.name,
                value: < string > field.value,
            },
            (value: string) => this.onChange(field.name, value),
        );
        field.control = control;
        return control.getElement();
    }

    createSlider(field: FieldData) {
        const control = new Slider({
            min: 0,
            max: 100,
            value: Number(field.value),
            updateEvent: 'pointerup',
            onUpdate: (value: number) => this.onChange(field.name, value),
        });
        field.control = control;
        return control.getElement();
    }

    createButton(field: ButtonFieldData) {
        const control = new Button({
            text: < string > field.label,
            action: () => this.onChange(field.name, null),
            ...field.buttonOptions,
        });
        field.control = control;
        return control.getButton();
    }

    createLabel(string: string, options: LabelData = {}) {
        const tpl = stringToHtml(this.fieldTemplate) as HTMLElement;
        const controlEl = tpl.querySelector('.' + FormElementClass.CONTROL) as HTMLElement;
        const labelEl = tpl.querySelector('.' + FormElementClass.LABEL) as HTMLLabelElement;
        labelEl.textContent = string;
        tpl.removeChild(controlEl);
        options.cssClass?.length && tpl.classList.add(options.cssClass);
        options.wrapperElement?.appendChild(tpl);

        return tpl;
    }

    createSeparator(options: CommonOptions = {}) {
        const el = document.createElement('div');
        el.classList.add(FormElementClass.SEPARATOR_LINE);
        options.cssClass?.length && el.classList.add(options.cssClass);
        options.wrapperElement?.appendChild(el);

        return el;
    }

    onChange(fieldName: string, value: fieldValue) {
        this.options.onChangeCallback?.(fieldName, value);
    }

    changeValues(newValues: Record < string, fieldValue > ) {
        for (const field of this.fieldsData) {
            const newValue = newValues[field.name];
            this.changeSingleValue(field.name, newValue);
        }
    }

    changeSingleValue(fieldName: string, value: fieldValue) {
        const field = this.findFieldByName(fieldName);
        const formControl = field.control;
        switch (field.type) {
            case FieldTypes.INPUT:
                (formControl as JQuery).val(String(value));
                break;
            case FieldTypes.MENU:
                (formControl as JQuery).setOptionWithoutCallbackByValue(String(value));
                break;
            case FieldTypes.CHECKBOX:
                (formControl as Checkbox).setChecked( < boolean > value);
                break;
            case FieldTypes.CHECKBOXLIST:
                (formControl as CheckboxList).setSelected( < number | (string | number)[] > value);
                break;
            case FieldTypes.COLORPICKER:
                (formControl as NativeColorPicker).setValue(String(value));
                break;
            case FieldTypes.SLIDER:
                (formControl as Slider).setValue(Number(value));
                break;
        }
    }

    private findFieldByName(fieldName: string): FieldData {
        const field = this.fieldsData.find(f => f.name === fieldName);
        if (!field) throwError('FormBuilder.ts', 'findFieldByName', `Field named ${fieldName} not found`);
        return field!;
    }
}