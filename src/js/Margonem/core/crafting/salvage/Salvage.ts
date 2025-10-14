import {
    enhancedItemConfirmIfNeeded
} from '../../HelpersTS';

const Tpl = require('@core/Templates');

declare const askAlert: any;
declare const removeFromArray: any;
declare const arrayEquals: any;
declare const createButton: any;
declare const isset: any;
declare const Engine: any;
declare const _t: any;
declare const _g: any;
declare const debounce: any;

interface Slots {
    [name: string]: number
}

interface ReceivedItem {
    id: number,
    amount: number,
    icon: HTMLElement | null,
    itemTypeSort: number | null
}

interface ReceivedItems {
    [name: string]: ReceivedItem
}

export default class Salvage {

    private contentEl!: HTMLElement;
    private reagentsGridEl!: HTMLElement;
    private receivesGridEl!: HTMLElement;

    private reagentsGridSize: {
        x: number,
        y: number
    } = {
        x: 5,
        y: 5
    };
    private maxReagentsLimit: number = this.reagentsGridSize.y * this.reagentsGridSize.x;

    private selectedInventoryItems: number[] = [];
    private reagentSlotsOld: Slots = {};
    private reagentSlots: Slots = {};
    private receivedItems: ReceivedItems = {};
    private requestBlock: boolean = false;

    constructor(private wndEl: HTMLElement) {
        this.createContent();
        this.droppableInit();
        //this.getEngine().tpls.fetch('h', this.newReceivedItem.bind(this));
        this.getEngine().tpls.fetch(Engine.itemsFetchData.NEW_SALVAGE_RECEIVED_TPL, this.newReceivedItem.bind(this));
        this.getEngine().disableItemsManager.startSpecificItemKindDisable(Engine.itemsDisableData.SALVAGE);
        this.getEngine().interfaceItems.setDisableSlots('salvage');
    }

    newReceivedItem(i: any, finish ? : boolean) {
        if (!isset(this.receivedItems[i.id])) return;

        const iconEl = this.getEngine().tpls.createViewIcon(i.id, this.getEngine().itemsViewData.SALVAGE_ITEM_VIEW, 'h')[0][0];
        this.updateAmount(i, iconEl);
        this.receivedItems[i.id]['icon'] = iconEl;
        this.receivedItems[i.id]['itemTypeSort'] = i.itemTypeSort;
        if (finish) {
            this.appendReceivedItems();
        }

        iconEl.addEventListener('contextmenu', (e: any) => {
            // let callback = {
            //   txt: _t('move', null, 'item'),
            //   f: () => {
            //     this.onClickInventoryItem(i);
            //   }
            // };

            i.createOptionMenu(e)
        });

    }

    appendReceivedItems() {
        const sortedTpls: any = this.sortTpls(this.receivedItems);
        for (let i = 0; i < sortedTpls.length; i++) {
            this.setReceivedItemSlot(sortedTpls[i].icon, i);
            this.receivesGridEl.appendChild(sortedTpls[i].icon);
        }
    }

    sortTpls(data: any) {
        return Object.values(data).sort((a: any, b: any) => a.itemTypeSort - b.itemTypeSort);
    }

    setReceivedItemSlot(iconEl: HTMLElement, index: number) {
        const
            newY = Math.floor(index / 8),
            newX = index - newY * 8;
        iconEl.style.left = newX * 32 + newX + 1 + 'px';
        iconEl.style.top = newY * 32 + newY + 1 + 'px';
    }

    updateAmount(item: any, iconEl: HTMLElement) {
        const amount = this.receivedItems[item.id].amount;
        this.getEngine().tpls.changeItemAmount(item, $(iconEl), amount);
    }

    createContent() {
        const template = Tpl.get('salvage')[0];
        this.contentEl = this.wndEl.querySelector('.salvage-content') as HTMLElement;
        this.contentEl.innerHTML = '';
        this.contentEl.appendChild(template);
        this.createConfirmButton();

        this.reagentsGridEl = this.contentEl.querySelector('.salvage__reagents') as HTMLElement;
        this.receivesGridEl = this.contentEl.querySelector('.salvage__receives') as HTMLElement;
    }

    createConfirmButton() {
        const confirmButton = createButton(_t('submit', null, 'salvager'), ['small', 'green', 'disable'], this.confirmOnClick.bind(this));
        const buttonEl = this.contentEl.querySelector('.salvage__submit') as HTMLElement;
        buttonEl.appendChild(confirmButton);
    }

    confirmOnClick() {
        const
            info = _t('confirm-prompt', null, 'salvager'),
            dataAlert = {
                q: info,
                clb: () => this.preSalvage(),
                m: 'yesno4'
            };
        askAlert(dataAlert);
    }

    preSalvage() {
        enhancedItemConfirmIfNeeded(this.selectedInventoryItems, () => this.doSalvage());
    }

    doSalvage() {
        if (this.selectedInventoryItems.length > 0) {
            const ids = this.selectedInventoryItems.join(",");
            _g(`salvager&action=salvage&selectedItems=${ids}`, () => {
                // this.clearAll();
            });
        }
    }

    setConfirmButton() {
        const confirmBtnEl = this.contentEl.querySelector('.salvage__submit .button') as HTMLElement;
        if (Object.keys(this.reagentSlots).length > 0) {
            confirmBtnEl.classList.remove('disable');
        } else {
            confirmBtnEl.classList.add('disable');
        }
    };

    sendRequest() {
        if (this.selectedInventoryItems.length > 0) {
            const ids = this.selectedInventoryItems.join(",");
            this.requestBlock = true;
            _g(`salvager&action=preview&selectedItems=${ids}`, this.afterRequest.bind(this));
        }
    }

    afterRequest(res: any) {
        if (!isset(res.item_tpl && isset(res.msg)) && this.selectedInventoryItems.length > 0) { // remove last selected el
            this.selectedInventoryItems.pop();
        }
        this.requestBlock = false;
    }

    droppableInit() {
        $(this.reagentsGridEl).droppable({
            accept: '.inventory-item',
            drop: (e, ui) => {
                ui.draggable.css('opacity', '');
                this.onClickInventoryItem(ui.draggable.data('item'));
            }
        });
    }

    onClickInventoryItem(i: any) { // click or drop on grid
        if (this.requestBlock) return;
        const itemId = i.id;
        if (!this.selectedInventoryItems.includes(itemId)) {
            if (!this.canSelectNextItem()) return;
            this.selectedInventoryItems.push(itemId);
            this.sendRequest();
        } else {
            this.reagentDelete(itemId);
        }
    }

    canSelectNextItem() {
        const selectedItemsAmount = this.selectedInventoryItems.length;
        return selectedItemsAmount < this.maxReagentsLimit;
    }

    addReagentItem(i: any) {
        let slot: number[] | null = null;
        for (var y = 0; y < this.reagentsGridSize.y; y++) {
            for (var x = 0; x < this.reagentsGridSize.x; x++) {
                if (!isset(this.reagentSlots[x + ',' + y])) {
                    slot = [x, y];
                    break;
                }
            }
            if (slot) break;
        }

        if (slot !== null) {
            this.reagentSlots[slot[0] + ',' + slot[1]] = i.id;
            //let itemEl = this.getEngine().items.createViewIcon(i.id, 'salvage')[0][0];
            let itemEl = this.getEngine().items.createViewIcon(i.id, this.getEngine().itemsViewData.SALVAGE_VIEW)[0][0];
            itemEl.dataset.item = i;
            itemEl.style.top = slot[1] * 32 + slot[1] + 1 + 'px';
            itemEl.style.left = slot[0] * 32 + slot[0] + 1 + 'px';

            this.reagentsGridEl.appendChild(itemEl);

            itemEl.addEventListener('click', () => {
                this.onClickInventoryItem(i);
            });

            itemEl.addEventListener('contextmenu', (e: any) => {
                let callback = {
                    txt: _t('move', null, 'item'),
                    f: () => {
                        this.onClickInventoryItem(i);
                    }
                };

                i.createOptionMenu(e, callback, {
                    move: true,
                    use: true,
                    split: true,
                    drop: true,
                    itemId: true,
                    destroy: true,
                    enhance: true,
                    attachToQuickItems: true,
                    moveToEnhancement: true
                });
            });

            this.getEngine().itemsMovedManager.addItem(i, this.getEngine().itemsMovedData.SALVAGE, () => {
                this.onClickInventoryItem(i);
            });
            i.on('delete', () => this.onReagentDelete(i.id));
        }
        this.setConfirmButton();
    }

    onReagentDelete(itemId: number) {
        removeFromArray(this.selectedInventoryItems, itemId);
        this.deboucedReagentDelete(itemId);
    }

    deboucedReagentDelete = debounce((itemId: number) => { // ugly but it's the only solution
        this.reagentDelete(itemId);
    }, 10);

    reagentDelete(itemId: number) { // unselect item or external - e.g. change battle set
        removeFromArray(this.selectedInventoryItems, itemId);
        if (this.selectedInventoryItems.length > 0) {
            this.sendRequest();
        } else {
            this.clearAll();
        }
    }

    removeReagentItem(itemId: number) {
        const i = this.getEngine().items.getItemById(itemId);
        i.unregisterCallback('delete', () => this.onReagentDelete(i.id));

        removeFromArray(this.selectedInventoryItems, itemId);
        // this.getEngine().items.deleteViewIconIfExist(itemId, 'salvage');
        this.getEngine().items.deleteViewIconIfExist(itemId, this.getEngine().itemsViewData.SALVAGE_VIEW);
        this.getEngine().itemsMovedManager.removeItem(itemId);
        this.setConfirmButton();
    }

    update(v: any) {
        this.removeAllReceivedItems();
        this.reagentSlotsOld = this.reagentSlots;
        this.reagentSlots = {};

        const sortedReagentsIds = arrayEquals(v.item, this.selectedInventoryItems) ? this.selectedInventoryItems : v.item;
        for (const itemId of sortedReagentsIds) {
            // this.getEngine().items.deleteViewIconIfExist(itemId, 'salvage');
            this.getEngine().items.deleteViewIconIfExist(itemId, this.getEngine().itemsViewData.SALVAGE_VIEW);
            const item = this.getEngine().items.getItemById(itemId);
            this.addReagentItem(item);
        }
        for (const received of v.recived) {
            const [itemId, amount] = received;
            this.receivedItems[itemId] = {
                id: itemId,
                amount: amount,
                icon: null,
                itemTypeSort: null
            }
        }

        this.removeOldReagentItems();
    }

    removeOldReagentItems() {
        const oldIds = Object.values(this.reagentSlotsOld)
        const newIds = Object.values(this.reagentSlots)
        if (oldIds.length > newIds.length) {
            let difference = oldIds.filter(x => !newIds.includes(x));
            for (const itemId of difference) {
                this.removeReagentItem(itemId);
            }
        }
    }

    removeAllReceivedItems() {
        this.receivedItems = {};
        this.getEngine().tpls.deleteMessItemsByLoc('h');
    }

    updateScroll() {
        this.getEngine().crafting.itemCraft.updateScroll();
    };

    clearAll() {
        this.reagentSlots = {};
        this.selectedInventoryItems = [];
        //this.getEngine().items.deleteAllViewsByViewName('salvage');
        this.getEngine().items.deleteAllViewsByViewName(this.getEngine().itemsViewData.SALVAGE_VIEW);
        //this.getEngine().itemsMovedManager.removeItemsByTarget('salvage');
        this.getEngine().itemsMovedManager.removeItemsByTarget(this.getEngine().itemsMovedData.SALVAGE);
        this.removeAllReceivedItems();
        this.setConfirmButton();
        this.updateScroll();
    }

    close() {
        this.clearAll();
        // this.getEngine().tpls.removeCallback('h', this.newReceivedItem);
        this.getEngine().tpls.removeCallback(Engine.itemsFetchData.NEW_SALVAGE_RECEIVED_TPL);
        this.getEngine().disableItemsManager.endSpecificItemKindDisable(Engine.itemsDisableData.SALVAGE);
        this.getEngine().interfaceItems.setEnableSlots('salvage');
        this.getEngine().crafting.salvage = false;
    }

    getEngine() {
        return Engine;
    }
}