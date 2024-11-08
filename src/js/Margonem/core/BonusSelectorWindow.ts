import BonusSelector from './crafting/enhancement/BonusSelector';

const Tpl = require('core/Templates');

declare const _t: any;
declare const _g: any;

interface Bonuses {
    data: Array < Bonus > ;
}

interface Bonus {
    category: string;
    percentage: number;
}

type Props = {
    bonuses: Bonuses;
    itemId: number;
    fromReselect: boolean;
};

module.exports = class BonusSelectorWindow {
    private contentEl!: HTMLElement;
    private wnd: any;
    private bonusSelector: BonusSelector;
    private bonusSelectorEl: HTMLElement;
    private fromReselect: boolean;
    private itemId: number;

    constructor({
        bonuses,
        itemId,
        fromReselect = false
    }: Props) {
        this.closeOtherWindows();
        this.getEngine().lock.add('bonus-selector');
        this.initWindow();
        this.itemId = itemId;
        this.fromReselect = fromReselect; // open this window by reselect or context menu
        this.bonusSelectorEl = this.contentEl.querySelector('.enhance__bonus') as HTMLElement;
        this.bonusSelector = new BonusSelector(this.bonusSelectorEl, {
            itemId: itemId,
            onSubmitClb: this.onSubmit.bind(this),
            isReselectWindow: true, // reselect window OR enhancement
        });
        this.bonusSelector.createBonusChoose(bonuses);
        this.wnd.center();
    }

    initWindow() {
        this.contentEl = Tpl.get('bonus-selector-wnd', {
            jQueryObject: false
        });

        Engine.windowManager.add({
            content: this.contentEl,
            title: this.tLang('select_bonus', 'item'),
            //nameWindow        : 'enhancement',
            nameWindow: this.getEngine().windowsData.name.BONUS_SELECTOR,
            objParent: this,
            nameRefInParent: 'wnd',
            onclose: () => {
                this.close();
            },
        });

        this.wnd.addToAlertLayer();
    }

    onSubmit(result: boolean, selectedBonus ? : number) {
        if (result) {
            const request = this.fromReselect ?
                `bonus_reselect&action=select&item=${this.itemId}&bonusIdx=${selectedBonus}` :
                `moveitem&st=2&id=${this.itemId}&bonusIdx=${selectedBonus}`;
            _g(request);
        }
        this.close();
    }

    close() {
        if (this.wnd) this.wnd.remove();
        this.getEngine().bonusSelectorWindow = false;
        this.getEngine().lock.remove('bonus-selector');
    }

    closeOtherWindows() {
        const e = this.getEngine();
        const v = e.windowsData.windowCloseConfig.BONUS_SELECTOR;
        e.windowCloseManager.callWindowCloseConfig(v);
    }

    tLang(name: string, category: string = 'enhancement') {
        return _t(name, null, category);
    }

    getEngine() {
        return Engine;
    }
};