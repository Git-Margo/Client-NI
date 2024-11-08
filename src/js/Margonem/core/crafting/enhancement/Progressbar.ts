declare const Engine: any;
declare const formNumberToNumbersGroup: (number: number) => string;

export default class Progressbar {

    private currentProgressEl!: HTMLElement;
    private previewProgressEl!: HTMLElement;
    private currentProgressTextEl!: HTMLElement;
    private previewProgressTextEl!: HTMLElement;

    private lastMax = 0;
    private lastCurrent = 0;
    private lastPreview = 0;
    private lastUpgradeLevel = 0;

    constructor(private el: HTMLElement) {
        this.currentProgressEl = el.querySelector('.enhance__progress--current') as HTMLElement;
        this.previewProgressEl = el.querySelector('.enhance__progress--preview') as HTMLElement;
        this.currentProgressTextEl = el.querySelector('.enhance__progress-text--current') as HTMLElement;
        this.previewProgressTextEl = el.querySelector('.enhance__progress-text--preview') as HTMLElement;
    }

    public update({
        current,
        gained,
        max,
        upgradeLevel
    }: {
        current: number
        gained ? : number
        max: number
        upgradeLevel: number
    }) {

        let currentWidth = !max ? 0 : current / max * 100;
        if (typeof gained !== 'undefined') {
            this.setPreview(gained, current, max, upgradeLevel);
        } else {
            this.lastCurrent = current <= max ? current : max;
            this.lastMax = max;
            this.lastUpgradeLevel = upgradeLevel;
            let progressText = current || max ? `${formNumberToNumbersGroup(current)} / ${formNumberToNumbersGroup(max)}` : ' ';
            this.setProgress(currentWidth, 0, progressText, 0);
        }
    }

    private setPreview(gained: number, preview: number, max: number, upgradeLevel: number) {
        let current = this.lastCurrent;
        let previewWidth;
        let currentWidth;
        let currentVal = current;
        if (upgradeLevel === this.lastUpgradeLevel) { // same lvl
            preview = preview - this.lastCurrent;
            currentWidth = !max ? 0 : current / max * 100;
        } else { // next lvl
            currentWidth = 0;
            currentVal = 0;
        }
        previewWidth = !max ? 0 : (currentVal + preview) / max * 100;
        this.lastPreview = preview = gained;
        let progressText = `${formNumberToNumbersGroup(this.lastCurrent)} / ${formNumberToNumbersGroup(max)}`;
        this.setProgress(currentWidth, previewWidth, progressText, preview);
        return;
    }

    private setProgress(currentWidth: number, previewWidth: number = 0, progressText: string, preview: number = 0) {
        this.currentProgressEl.style.width = currentWidth + '%';
        this.currentProgressTextEl.innerText = progressText;

        this.previewProgressEl.style.width = (previewWidth <= 100 ? previewWidth : 100) + '%'; // max 100%
        this.previewProgressTextEl.innerText = `+${formNumberToNumbersGroup(preview)}`;

        if (!preview) {
            this.previewTextHide();
        } else {
            this.previewTextShow();
        }
    }

    private previewTextShow() {
        this.previewProgressTextEl.style.display = 'block';
    }

    private previewTextHide() {
        this.previewProgressTextEl.style.display = 'none';
        this.previewProgressTextEl.innerHTML = '';
    }

    public isFull() {
        // return this.lastPreview >= this.lastMax || this.lastCurrent === this.lastMax;
        return this.lastCurrent === this.lastMax && this.lastCurrent !== 0;
    }

    public completed() {
        this.setProgress(100, 0, this.tLang('completed'), 0);
        return true;
    }

    public reset() {
        this.update({
            current: 0,
            max: 0,
            upgradeLevel: 0
        });
    }

    tLang(key: string) {
        return Engine.crafting.enhancement.tLang(key);
    }
}