import {
    setAttributes
} from "@core/HelpersTS";

const Tpl = require('@core/Templates');

export interface ButtonData {
    text: string | HTMLElement,
    classes ? : string[],
    action ? : (e: MouseEvent, el: HTMLElement) => void,
    tip ? : string,
    disabled ? : boolean
    attrs ? : object,
}

export default class Button {

    el: HTMLElement;
    private disabled: boolean = false;

    constructor(buttonData: ButtonData) {
        this.el = Tpl.get('button')[0] as HTMLElement;
        this.createButton(buttonData);
    }

    createButton({
        text,
        classes,
        action,
        tip,
        disabled,
        attrs
    }: ButtonData) {
        if (classes) this.el.classList.add(...classes);

        this.el.addEventListener('click', (e) => {
            if (action) action(e, this.el);
        });

        if (disabled) {
            this.setState(true);
        }

        if (tip) {
            this.setTip(tip);
        }

        if (attrs) setAttributes(this.el, attrs);

        this.setLabel(text);
    }

    setState(isDisable: boolean) {
        this.disabled = isDisable;
        if (this.disabled) {
            this.el.classList.add('disable');
        } else {
            this.el.classList.remove('disable');
        }
    }

    getState() {
        return this.disabled;
    }

    setLabel(label: string | HTMLElement) {
        if (typeof label === 'string' || typeof label === 'undefined') {
            this.el.querySelector < HTMLElement > ('.label') !.innerText = label;
        } else {
            this.el.querySelector < HTMLElement > ('.label') !.appendChild(label);
        }
    }

    setTip(value: string) {
        return $(this.el).tip(value);
    }

    getButton() {
        return this.el;
    }
}