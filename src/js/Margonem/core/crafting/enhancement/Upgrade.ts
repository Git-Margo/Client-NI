// @ts-ignore
const Tpl = require('@core/Templates');
import BonusSelector from "./BonusSelector";

interface Data {
    bonuses: [],
    goldPrice: number,
    ingredientPrice: number,
    ingredientTplId: number
    upgradeLevel: number
}

declare const round: Function;
declare const isset: Function;
declare const createButton: Function;
declare const askAlert: Function;
declare const checkItemsAmount: Function;
declare const formNumberToNumbersGroup: Function;
declare const _g: Function;
declare const _t: Function;
declare const Engine: any;
declare const getE: Function;

export default class Upgrade {

    disable: boolean = true;
    // hidden: boolean = true;
    bonusSelector: BonusSelector;

    lastData: Data | null = null;
    upgradeLvl: number | null = null;
    selectedBonus: number | null = null;

    bonusChooseEl!: HTMLElement;
    confirmBtnEl!: HTMLElement;

    goldAmountEl!: HTMLElement;
    requireItemSlotEl!: HTMLElement;

    requireItemsFromEQ: number[] = [];

    private requireItem: {
        id ? : number
        amount ? : number;
    } = {};

    constructor(private el: HTMLElement) {
        this.createContent();
        this.bonusSelector = new BonusSelector(this.bonusChooseEl, {
            onSelectedClb: this.onBonusSelected.bind(this),
            ownSubmitBtn: true
        })
        this.setDisableState(true);
        // this.setHiddenState(true);
        this.resetGold();
        //this.getEngine().tpls.fetch('u', this.newRequireItem.bind(this));
        this.getEngine().tpls.fetch(Engine.itemsFetchData.NEW_UPGRADE_REQUIRE_TPL, this.newRequireItem.bind(this));
    }

    newRequireItem(i: any, finish ? : boolean) {
        // if (!isset(this.receivedItems[i.id])) return;

        const iconEl = this.getEngine().tpls.createViewIcon(i.id, this.getEngine().itemsViewData.ENHANCE_REQUIRE_ITEM_VIEW, 'u')[0][0];

        this.addContextMenu(i, iconEl);
        this.updateAmount(i, iconEl);
        this.requireItemSlotEl.appendChild(iconEl);
    }

    addContextMenu(item: any, iconEl: HTMLElement) {
        $(iconEl).contextmenu(function(e: any, mE: any) {
            item.createOptionMenu(getE(e, mE), false, {
                itemId: true
            });
        })
    }

    updateAmount(item: any, iconEl: HTMLElement) {
        if (!isset(this.requireItem)) return;
        const amount = this.requireItem.amount;
        this.getEngine().tpls.changeItemAmount(item, $(iconEl), amount);
    }

    setDisableState(state: boolean) {
        this.disable = state;
        if (this.disable) {
            this.el.classList.add('disabled', 'hidden');
        } else {
            this.el.classList.remove('disabled', 'hidden');
        }
    }

    // setHiddenState (state: boolean) {
    //   this.hidden = state;
    //   if (this.hidden) {
    //     this.el.classList.add('hidden');
    //   } else {
    //     this.el.classList.remove('hidden');
    //   }
    // }

    createContent() {
        this.createConfirmButton();
        this.bonusChooseEl = this.el.querySelector('.enhance__bonus') as HTMLElement;
        this.goldAmountEl = this.el.querySelector('.enhance__r-gold-amount') as HTMLElement;
        this.requireItemSlotEl = this.el.querySelector('.enhance__r-item') as HTMLElement;
    }

    onBonusSelected(selected: number) {
        this.selectedBonus = selected;
        if (this.lastData) {
            this.setStateConfirmButton(this.lastData);
        } else {
            this.enableConfirmButton();
        }
    }

    clearBonus() {
        this.bonusChooseEl.innerHTML = '';
    }

    createConfirmButton() {
        const opts = {
            selector: '.enhance__submit2',
            txt: this.tLang('submit_btn2'),
            classes: ['small', 'green', 'disable'],
            onClick: this.confirmOnClick.bind(this)
        };
        const buttonEl = this.el.querySelector(opts.selector) as HTMLElement;
        this.confirmBtnEl = createButton(opts.txt, opts.classes, opts.onClick);
        buttonEl.appendChild(this.confirmBtnEl);
    }

    confirmOnClick() {
        const
            val = this.lastData ? {
                '%val%': formNumberToNumbersGroup(this.lastData.goldPrice)
            } : null,
            costInfo = this.tLang('upgrade_cost %val%', 'enhancement', val),
            confirmInfo = this.tLang('confirm-prompt'),
            text = val ? costInfo + confirmInfo : confirmInfo,
            dataAlert = {
                q: text,
                clb: () => this.doUpgrade(),
                m: 'yesno4'
            };
        askAlert(dataAlert);
    }

    doUpgrade() {
        const bonusParam = this.upgradeLvl === 4 ? `&bonusIdx=${this.selectedBonus}` : '';
        _g(`enhancement&action=upgrade&item=${this.getEnhancement().selectedEnhanceItem}${bonusParam}`, (v: any) => {
            if (isset(v.progressing)) {
                this.reset();
            }
        });
    }

    enableConfirmButton() {
        this.confirmBtnEl.classList.remove('disable');
    }

    disableConfirmButton() {
        this.confirmBtnEl.classList.add('disable');
    }

    // update ({ data, disable, hidden } : { data?: Data, disable?: boolean, hidden?: boolean }) {
    update({
        data,
        disable
    }: {
        data ? : Data,
        disable ? : boolean
    }) {
        if (typeof data !== 'undefined') {
            this.lastData = data;
            const {
                bonuses,
                goldPrice,
                ingredientPrice,
                ingredientTplId,
                upgradeLevel
            } = data;
            this.upgradeLvl = upgradeLevel;
            this.setGoldAmount({
                goldPrice
            });
            this.setRequireItem({
                ingredientPrice,
                ingredientTplId
            });
            if (bonuses.length > 0) {
                this.bonusSelector.createBonusChoose(bonuses);
            }
            this.setStateConfirmButton(data);
        }
        if (typeof disable !== 'undefined') {
            this.setDisableState(disable);
        }
        // if (typeof hidden !== 'undefined') {
        //   this.setHiddenState(hidden);
        // }
    }

    setStateConfirmButton(data: Data) {
        const {
            bonuses
        } = data;
        if (bonuses.length > 0 && this.selectedBonus === null) {
            this.disableConfirmButton(); // need choose bonus first
            return;
        }
        if (this.checkRequires(data)) {
            this.enableConfirmButton();
        } else {
            this.disableConfirmButton();
        }
    }

    checkRequires(data: Data) {
        const {
            goldPrice,
            ingredientPrice,
            ingredientTplId
        } = data;
        return goldPrice <= this.getEngine().hero.d.gold && this.checkRequiresItemsAmount(ingredientTplId, ingredientPrice);
    }

    checkRequiresItemsAmount(tplId: number, neededAmount: number) {
        const itemsAmount = checkItemsAmount(tplId);
        return itemsAmount >= neededAmount;
        // let hItems = this.getEngine().heroEquipment.getHItems();
        // let amount = 0;
        //
        // for (let k in hItems) {
        //   let item = hItems[k];
        //
        //   if (item.st > 0) continue;
        //   if (item.tpl != tplId) continue;
        //
        //   amount += parseInt(item._cachedStats['amount']);
        // }
        //
        // return amount >= neededAmount;
    }

    setRequireItem({
        ingredientPrice,
        ingredientTplId
    }: Pick < Data, 'ingredientPrice' | 'ingredientTplId' > ) {
        this.requireItem = {
            id: ingredientTplId,
            amount: ingredientPrice
        }
    }

    setGoldAmount({
        goldPrice
    }: Partial < Data > ) {
        const parsedPrice = round(goldPrice, 2);
        this.goldAmountEl.innerHTML = parsedPrice;
    }

    resetGold() {
        this.setGoldAmount({
            goldPrice: 0
        });
    }

    removeRequireItem() {
        this.requireItem = {};
        this.getEngine().tpls.deleteMessItemsByLoc('u');
    }

    reset() {
        this.requireItemsFromEQ = [];
        this.upgradeLvl = null;
        this.lastData = null;
        this.selectedBonus = null;
        this.removeRequireItem();
        this.setDisableState(true);
        // this.setHiddenState(true);
        this.disableConfirmButton();
        this.resetGold();
        this.clearBonus();
    }

    destroy() {
        this.removeRequireItem();
        //this.getEngine().tpls.removeCallback('u', this.newRequireItem.bind(this));
        this.getEngine().tpls.removeCallback(Engine.itemsFetchData.NEW_UPGRADE_REQUIRE_TPL);
    }

    tLang(name: string, category: string = 'enhancement', params: null | {} = null) {
        return typeof RUNNING_UNIT_TEST === "undefined" ? _t(name, params, category) : '';
    };

    getEnhancement() {
        return this.getEngine().crafting.enhancement;
    }

    getEngine() {
        return Engine;
    }
}