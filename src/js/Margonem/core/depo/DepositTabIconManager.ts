const storageName = "depositTabIcons";

export default class DepositTabIconManager {
    private iconsAmount = 36;
    //private storageData: { [key: number]: number } = {};
    private storageData: {
        [key: string]: {
            [key: number]: number
        }
    } = {};
    constructor() {
        this.getStorageData();
    }
    showMenu(e: JQuery.ClickEvent): void {
        const targetEl = e.target as HTMLElement;
        const tabEl = targetEl.closest('.card') as HTMLElement;
        const tabNumberStr = tabEl.getAttribute('data-tab-number') as string;
        const contextMenu = [];
        for (let i = 1; i < this.iconsAmount; i++) {
            const iconEl = this.getIcon(i, true);
            contextMenu.push([iconEl, () => this.setIcon(tabEl, i, true)]);
        }
        contextMenu.push([`${tabNumberStr}`, () => this.setDefault(tabEl, tabNumberStr)]);
        Engine.interface.showPopupMenu(contextMenu, e, {
            cssClass: 'depo-icons'
        });
    }

    getStorageData() {
        const wordName = Engine.worldConfig.getWorldName();
        let data = Engine.serverStorage.get(storageName) || {
            [wordName]: {}
        };

        let isObject = !Array.isArray(data) && typeof data === "object";

        if (!isObject) {
            data = {
                [wordName]: {}
            }
        }

        if (!data[wordName]) {
            data[wordName] = {};
        }

        this.storageData = data;
    }
    setStorageData() {
        Engine.serverStorage.sendData({
            [storageName]: this.storageData
        });
    }

    setIconIfExist($tab: JQuery, tabNumber: number): void {
        const wordName = Engine.worldConfig.getWorldName();

        if (!this.storageData[wordName]) {
            return
        }

        const icon = this.storageData[wordName][tabNumber];

        if (icon) {
            this.setIcon($tab[0], icon)
        }

    }

    isDisabled(tabEl: HTMLElement): boolean {
        return tabEl.classList.contains('disabled');
    }

    setIcon(tabEl: HTMLElement, iconNumber: number, saveToStorage: boolean = false): void {
        if (this.isDisabled(tabEl)) return;
        const labelEl = tabEl.querySelector('.label') as HTMLElement;
        const numberEl = labelEl.querySelector('.number') as HTMLElement;
        const iconsEl = labelEl.querySelector('.icons') as HTMLElement;
        numberEl!.style.display = 'none';
        iconsEl.innerHTML = "";
        iconsEl.appendChild(this.getIcon(iconNumber) as HTMLElement);
        iconsEl.style.display = 'block';

        const tabNumberStr = tabEl.getAttribute('data-tab-number') as string;
        if (saveToStorage) {
            const wordName = Engine.worldConfig.getWorldName();
            this.storageData[wordName][Number(tabNumberStr)] = iconNumber;
            this.setStorageData();
        }
    }

    setDefault(tabEl: HTMLElement, tabNumber: string): void {
        const labelEl = tabEl.querySelector('.label') as HTMLElement;
        const numberEl = labelEl.querySelector('.number') as HTMLElement;
        const iconsEl = labelEl.querySelector('.icons') as HTMLElement;
        numberEl.textContent = tabNumber;
        numberEl!.style.display = 'block';
        iconsEl.style.display = 'none';
        const wordName = Engine.worldConfig.getWorldName();
        delete this.storageData[wordName][Number(tabNumber)];
        this.setStorageData();
    }

    getIcon(iconNumber: number, asString: boolean = false) {
        const el = document.createElement('div');
        el.classList.add(`ico`, `i-${iconNumber}`);
        return asString ? el.outerHTML : el;
    }
}