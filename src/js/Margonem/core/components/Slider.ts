import {
    isset
} from '../HelpersTS';

interface SliderOptions {
    value ? : number,
        min ? : number,
        max ? : number,
        range ? : number[],
        cssClass ? : string[],
        tip ? : string | null,
        disabled ? : boolean,
        showValue ? : boolean,
        blockValueBelowCurrent ? : boolean,
        updateEvent ? : 'input' | 'pointerup';
    onUpdate ? : ((value: number) => void) | null,
}

export default class Slider {

    el!: HTMLElement;
    input!: HTMLInputElement;
    stateEl!: HTMLElement;
    private disabled: boolean = false;
    private defaultOptions: SliderOptions = {
        value: 0,
        min: 0,
        max: 10,
        range: [0, 10],
        cssClass: [],
        tip: null,
        disabled: false,
        showValue: false,
        blockValueBelowCurrent: false,
        updateEvent: 'input',
        onUpdate: null
    }
    private options: SliderOptions = {}
    private lastValue: number | null = null;

    constructor(customOptions: SliderOptions) {
        if (isset(customOptions.min) && isset(customOptions.max) && !isset(customOptions.range)) {
            customOptions.range = [customOptions.min!, customOptions.max!]
        }
        this.options = {
            ...this.defaultOptions,
            ...customOptions
        };
        this.createElement();
        this.setParameters();
    }

    createElement() {
        this.el = document.createElement('div');
        this.el.className = 'c-slider';

        this.input = document.createElement('input');
        this.input.type = "range";
        this.input.classList.add('c-slider__input');

        this.stateEl = document.createElement('div');
        this.stateEl.classList.add('c-slider__state');
    }

    setParameters() {
        const {
            value,
            min,
            max,
            range,
            cssClass,
            tip,
            disabled,
            showValue,
            blockValueBelowCurrent,
            updateEvent,
            onUpdate
        } = this.options;
        const [rangeMin, rangeMax] = range!;

        this.el.classList.add(...cssClass!);
        this.setValue(value!);
        this.setMin(min!);
        this.setMax(max!);
        this.setState(disabled!);
        if (showValue) this.setShowValue(value!)
        this.setTip(tip!);
        this.setProgressBackground();
        this.lastValue = value!;

        this.input.addEventListener('input', (event) => {
            const definedValue = Number(value);
            let sliderValue = Number((event.target as HTMLInputElement).value);
            if (blockValueBelowCurrent && sliderValue < definedValue) {
                this.setValue(definedValue)
                sliderValue = definedValue;
            } else {
                if (sliderValue < rangeMin) {
                    this.setValue(rangeMin)
                    sliderValue = rangeMin;
                }
                if (sliderValue > rangeMax) {
                    this.setValue(rangeMax)
                    sliderValue = rangeMax;
                }
            }
            if (updateEvent === 'input' && onUpdate && sliderValue !== this.lastValue) {
                this.lastValue = sliderValue;
                if (showValue) this.setShowValue(sliderValue);
                onUpdate(sliderValue);
            }
            this.setProgressBackground();
        });

        this.input.addEventListener('pointerup', (event) => {
            if (updateEvent === 'pointerup' && onUpdate) {
                let sliderValue = Number((event.target as HTMLInputElement).value);
                onUpdate(sliderValue);
            }
        });

        this.el.appendChild(this.input);
        this.el.appendChild(this.stateEl);
    }

    setShowValue(value: number) {
        this.stateEl.textContent = `${value}/${this.getMax()}`
    }

    setState(isDisable: boolean) {
        this.disabled = isDisable;
        if (this.disabled) {
            this.input.setAttribute('disabled', '');
        } else {
            this.input.removeAttribute('disabled');
        }
    }

    setProgressBackground() {
        const progress = (this.getValue() - this.getMin()) / (this.getMax() - this.getMin()) * 100;
        this.input.style.background = `linear-gradient(to right, #396b29 ${progress}%, #0c0d0d ${progress}%)`;
    }

    setValue(value: number) {
        this.input.value = String(value);
        this.setProgressBackground()
    }

    getValue() {
        return Number(this.input.value);
    }

    setMin(min: number) {
        this.input.min = String(min);
    }

    getMin() {
        return Number(this.input.min);
    }

    setMax(max: number) {
        this.input.max = String(max);
    }

    getMax() {
        return Number(this.input.max);
    }

    getState() {
        return this.disabled;
    }

    setTip(value: string) {
        return $(this.el).tip(value);
    }

    getElement() {
        return this.el;
    }
}