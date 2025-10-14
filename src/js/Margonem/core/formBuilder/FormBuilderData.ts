import KeyUpEvent = JQuery.KeyUpEvent;
import FocusOutEvent = JQuery.FocusOutEvent;

// @ts-ignore
import InputMaskData from '@core/InputMaskData.js';

export enum FieldTypes {
    CHECKBOX = 'CHECKBOX',
        CHECKBOXLIST = 'CHECKBOXLIST',
        COLORPICKER = 'COLORPICKER',
        MENU = 'MENU',
        SLIDER = 'SLIDER',
        INPUT = 'INPUT',
        BUTTON = 'BUTTON',
}

export enum FormElements {
    HEADER = 'header',
        LABEL = 'label',
        SEPARATOR_LINE = 'separator-line',
        FIELD = 'field'
}

export enum FormElementClass {
    HEADER = 'fb-header',
        LABEL = 'fb-label',
        FIELD = 'fb-field',
        CONTROL = 'fb-control',
        SEPARATOR_LINE = 'fb-separator-line',
}

export type InputOptions = {
    val ? : number | string,
    cl ? : string,
    type ? : InputMaskData.TYPE.TEXT | InputMaskData.TYPE.NUMBER | InputMaskData.TYPE.NUMBER_FLOAT | InputMaskData.TYPE.NUMBER_WITH_KMG,
    placeholder ? : string,
    changeClb ? : (value: string) => void,
    focusoutClb ? : (value: string, e: FocusOutEvent) => void,
    clearClb ? : (value: string) => void,
    tipClearClb ? : string,
    keyUpClb ? : (value: string, e: KeyUpEvent) => void,
    tip ? : string,
    readonly ? : boolean,
    clear ? : boolean,
    useDebounce ? : boolean
}