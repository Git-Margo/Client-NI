import Button from './components/Button';
import {
    isset
} from './HelpersTS';
const ItemState = require('core/items/ItemState');

const Tpl = require('core/Templates');

type IAskAlert = {
    q: string;
    clb: () => void;
    m: string;
};

declare const askAlert: ({
    q,
    clb,
    m
}: IAskAlert) => void;
declare const _t: any;
declare const _g: any;
declare const checkItemsAmount: (tplId: number) => number;

type StatusResponse = {
    ingredientItemQuantity: number;
    ingredientItemTplId: number;
};

interface ReceivedTpls {
    [name: string]: number;
}

module.exports = class BonusReselectWindow {
    private wnd: any;

    private contentEl!: HTMLElement;
    private selectedItem: number | null = null;
    private selectedItemSlotEl!: HTMLElement;
    private requireItemSlotEl!: HTMLElement;
    private submitBtn!: Button;
    private buttonsContainerEl!: HTMLElement;
    private requestBlock = false;

    private receivedTpls: ReceivedTpls = {};

    constructor() {
        this.getEngine().lock.add('bonus-reselect');
        this.initWindow();
        this.createContent();
        this.createConfirmButton();
        this.droppableInit();
        this.getEngine().tpls.fetch(
            this.getEngine().itemsFetchData.NEW_BONUS_RESELECT_COST_TPL,
            this.newReceivedItem.bind(this),
        );
        Engine.disableItemsManager.startSpecificItemKindDisable(Engine.itemsDisableData.BONUS_RESELECT);
    }

    initWindow() {
        this.contentEl = Tpl.get('bonus-reselect-wnd', {
            jQueryObject: false
        });

        Engine.windowManager.add({
            content: this.contentEl,
            title: this.tLang('bonus-reselect-title'),
            nameWindow: this.getEngine().windowsData.name.BONUS_RESELECT,
            objParent: this,
            nameRefInParent: 'wnd',
            onclose: () => {
                this.close();
            },
        });

        this.wnd.addToAlertLayer();
        this.wnd.center();
        this.wnd.setWndOnPeak();
    }

    createContent() {
        this.selectedItemSlotEl = this.contentEl.querySelector('.bonus-reselect-wnd__item') as HTMLElement;
        this.requireItemSlotEl = this.contentEl.querySelector('.bonus-reselect-wnd__require') as HTMLElement;
        this.buttonsContainerEl = this.contentEl.querySelector('.bonus-reselect-wnd__buttons') as HTMLElement;
    }

    droppableInit() {
        $(this.selectedItemSlotEl).droppable({
            accept: '.inventory-item',
            drop: (e, ui) => {
                ui.draggable.css('opacity', '');
                this.onClickInventoryItem(ui.draggable.data('item'));
            },
        });
    }

    newReceivedItem(item: any) {
        // const iconEl = this.getEngine().tpls.createViewIcon(item.id, 'bonus-reselect-cost-item', 'w')[0][0];
        const iconEl = this.getEngine().tpls.createViewIcon(item.id, this.getEngine().itemsViewData.BONUS_RESELECT_COST_ITEM_VIEW, 'w')[0][0];
        if (!item.isItem()) {
            this.updateAmount(item, iconEl);
        }
        this.requireItemSlotEl.appendChild(iconEl);
    }

    updateAmount(item: any, iconEl: HTMLElement) {
        const amount = this.receivedTpls[item.id];
        if (amount > 0) this.getEngine().tpls.changeItemAmount(item, $(iconEl), amount);
    }

    onClickInventoryItem(i: any) {
        // click or drop on grid
        if (this.requestBlock) return;

        const itemId = parseInt(i.id);
        if (this.selectedItem === itemId) {
            this.clearAll();
            return;
        }
        if (!this.selectedItem) {
            this.sendPreviewRequest(itemId);
            return;
        }

        // if (i.st !== 0) return;
        if (!ItemState.isInBagSt(i.st)) return;
    }

    sendPreviewRequest(itemId: number) {
        this.requestBlock = true;
        _g(`bonus_reselect&action=status&item=${itemId}`);
    }

    sendReselectRequest() {

        if (this.selectedItem == null) {
            console.trace();
            debugger;
        }

        _g(`bonus_reselect&action=apply&item=${this.selectedItem}`, (v: any) => {
            if (!isset(v.message)) {
                this.close();
            }
        });
    }

    addItemToExtract() {
        let item = this.getEngine().items.getItemById(this.selectedItem);

        //let itemEl = this.getEngine().items.createViewIcon(item.id, 'bonus-reselect-item')[0][0];
        let itemEl = this.getEngine().items.createViewIcon(item.id, this.getEngine().itemsViewData.BONUS_RESELECT_ITEM_VIEW)[0][0];
        itemEl.addEventListener('click', () => {
            this.onClickInventoryItem(item);
        });

        //this.getEngine().itemsMovedManager.addItem(item, 'bonus-reselect', () => {
        this.getEngine().itemsMovedManager.addItem(item, this.getEngine().itemsMovedData.BONUS_RESELECT, () => {
            this.onClickInventoryItem(item);
        });

        this.dimRestart();

        item.on('delete', () => this.clearAll());
        this.selectedItemSlotEl.innerHTML = '';
        this.selectedItemSlotEl.appendChild(itemEl);
    }

    removeSelectedItem() {
        if (this.selectedItem != null) {
            const item = this.getEngine().items.getItemById(this.selectedItem);
            // item.unregisterCallback('afterUpdate', () => this.selectedItemAfterUpdate(item.id));
            item.unregisterCallback('delete', () => this.clearAll());
            this.selectedItem = null;
        }
    }

    createConfirmButton() {
        const opts = {
            text: this.tLang('bonus-reselect-submit'),
            classes: ['small', 'green'],
            action: this.confirmOnClick.bind(this),
            disabled: true,
        };
        this.submitBtn = new Button(opts);
        this.buttonsContainerEl.appendChild(this.submitBtn.getButton());
    }

    confirmOnClick() {
        const confirmInfo = this.tLang('confirm-prompt'),
            dataAlert = {
                q: confirmInfo,
                clb: () => this.sendReselectRequest(),
                m: 'yesno4',
            };
        askAlert(dataAlert);
    }

    setStateConfirmButton(statusResponse: StatusResponse) {
        if (this.checkRequiresItemsAmount(statusResponse)) {
            this.submitBtn.setState(false);
        } else {
            this.submitBtn.setState(true);
        }
    }

    checkRequiresItemsAmount({
        ingredientItemQuantity,
        ingredientItemTplId
    }: StatusResponse) {
        const itemsAmount = checkItemsAmount(ingredientItemTplId);
        return itemsAmount >= ingredientItemQuantity;
    }

    update(v: any) {
        if (isset(v.status)) {
            this.requestBlock = false;
            const {
                ingredientItemQuantity,
                ingredientItemTplId,
                itemId
            } = v.status;
            this.selectedItem = itemId;
            this.addItemToExtract();
            this.receivedTpls[ingredientItemTplId] = ingredientItemQuantity;
            this.setStateConfirmButton(v.status);
        }
    }

    dimRestart() {
        this.getEngine().disableItemsManager.endSpecificItemKindDisable(Engine.itemsDisableData.BONUS_RESELECT);
        this.getEngine().disableItemsManager.startSpecificItemKindDisable(Engine.itemsDisableData.BONUS_RESELECT);
    }

    close() {
        if (this.wnd) this.wnd.remove();
        this.clearAll();
        this.getEngine().disableItemsManager.endSpecificItemKindDisable(Engine.itemsDisableData.BONUS_RESELECT);
        this.getEngine().tpls.removeCallback(this.getEngine().itemsFetchData.NEW_BONUS_RESELECT_COST_TPL);
        this.getEngine().bonusReselectWindow = false;
        this.getEngine().lock.remove('bonus-reselect');
    }

    tLang(name: string, category: string = 'enhancement') {
        return _t(name, null, category);
    }

    clearAll() {
        this.removeSelectedItem();
        this.getEngine().tpls.deleteMessItemsByLoc('w');
        // this.getEngine().items.deleteAllViewsByViewName('bonus-reselect-item');
        this.getEngine().items.deleteAllViewsByViewName(this.getEngine().itemsViewData.BONUS_RESELECT_ITEM_VIEW);
        //this.getEngine().itemsMovedManager.removeItemsByTarget('bonus-reselect');
        this.getEngine().itemsMovedManager.removeItemsByTarget(this.getEngine().itemsMovedData.BONUS_RESELECT);
        this.submitBtn.setState(true);
    }

    getEngine() {
        return Engine;
    }
};