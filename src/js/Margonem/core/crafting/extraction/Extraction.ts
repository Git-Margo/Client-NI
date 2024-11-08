const Tpl = require('core/Templates');
import Finalize from './Finalize';

declare const isset: any;
declare const Engine: any;
declare const _t: any;
declare const _g: any;

interface ReceivedTpls {
    [name: string]: number
}

export default class Extraction {

    private contentEl!: HTMLElement;
    private extractItemSlot!: HTMLElement;
    private extractItemSlotReceive!: HTMLElement;

    private receivedCounter = 0;
    private receivedTpls: ReceivedTpls = {};

    private selectedExtractItem: number | null = null;

    private requestBlock: boolean = false;

    private finalize!: Finalize;

    constructor(private wndEl: HTMLElement) {
        this.createContent();
        this.initScroll();
        this.droppableInit();
        this.getEngine().items.fetch(this.getEngine().itemsFetchData.NEW_EXTRACTION_RECEIVED_ITEM, this.newReceivedItem.bind(this));
        this.getEngine().tpls.fetch(this.getEngine().itemsFetchData.NEW_EXTRACTION_RECEIVED_TPL, this.newReceivedItem.bind(this));
        this.getEngine().disableItemsManager.startSpecificItemKindDisable(Engine.itemsDisableData.EXTRACTION);
        this.getEngine().interfaceItems.setDisableSlots('extraction');
    }

    createContent() {
        const template = Tpl.get('extraction')[0];
        this.contentEl = this.wndEl.querySelector('.extraction-content') as HTMLElement;
        this.contentEl.innerHTML = '';
        this.contentEl.appendChild(template);

        this.extractItemSlot = this.contentEl.querySelector('.extraction__item') as HTMLElement;
        this.extractItemSlotReceive = this.contentEl.querySelector('.extraction__receives') as HTMLElement;

        const finalizeEl = this.contentEl.querySelector('.extraction__finalize') as HTMLElement;
        this.finalize = new Finalize(finalizeEl);
    }

    initScroll() {
        $(this.contentEl).find('.scroll-wrapper').addScrollBar({
            track: true
        });
    };

    updateScroll() {
        $('.scroll-wrapper', $(this.contentEl)).trigger('update');
    };

    droppableInit() {
        $(this.extractItemSlot).droppable({
            accept: '.inventory-item',
            drop: (e, ui) => {
                ui.draggable.css('opacity', '');
                this.onClickInventoryItem(ui.draggable.data('item'));
            }
        });
    }

    newReceivedItem(item: any) {
        const kind = item.isItem() ? 'items' : 'tpls';
        // const iconEl = this.getEngine()[kind].createViewIcon(item.id, 'extraction-received-item', 'j')[0][0];
        const iconEl = this.getEngine()[kind].createViewIcon(item.id, this.getEngine().itemsViewData.EXTRACTION_RECEIVED_ITEM_VIEW, 'j')[0][0];
        this.setReceivedItemSlot(iconEl, this.receivedCounter);
        if (!item.isItem()) {
            this.updateAmount(item, iconEl);
        }

        iconEl.addEventListener('contextmenu', (e: any) => {
            item.createOptionMenu(e, false, {
                itemId: true
            });
        });

        this.extractItemSlotReceive.appendChild(iconEl);
        this.receivedCounter++;
    }

    updateAmount(item: any, iconEl: HTMLElement) {
        const amount = this.receivedTpls[item.id];
        if (amount > 0) this.getEngine().tpls.changeItemAmount(item, $(iconEl), amount);
    }

    setReceivedItemSlot(iconEl: HTMLElement, index: number) {
        const
            newY = Math.floor(index / 8),
            newX = index - newY * 8;
        iconEl.style.left = newX * 32 + newX + 1 + 'px';
        iconEl.style.top = newY * 32 + newY + 1 + 'px';
    }

    sendPreviewRequest() {
        if (!this.selectedExtractItem) return;
        this.requestBlock = true;
        _g(`extractor&action=preview&item=${this.selectedExtractItem}`, this.afterPreviewRequest.bind(this));
    }

    afterPreviewRequest({
        extractor
    }: any) {
        this.requestBlock = false;
        if (isset(extractor) && isset(extractor.preview)) {
            this.addItemToExtract();
        } else {
            this.selectedExtractItem = null;
        }
    }

    addItemToExtract() {
        let item = this.getEngine().items.getItemById(this.selectedExtractItem);

        // let itemEl = this.getEngine().items.createViewIcon(item.id, 'extraction-item')[0][0];
        let itemEl = this.getEngine().items.createViewIcon(item.id, this.getEngine().itemsViewData.EXTRACTION_ITEM_VIEW)[0][0];
        itemEl.addEventListener('click', () => {
            this.onClickInventoryItem(item);
        });

        itemEl.addEventListener('contextmenu', (e: any) => {
            let callback = {
                txt: _t('move', null, 'item'),
                f: () => {
                    this.onClickInventoryItem(item);
                }
            };

            item.createOptionMenu(e, callback, {
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


        // this.getEngine().itemsMovedManager.addItem(item, 'extraction', () => {
        this.getEngine().itemsMovedManager.addItem(item, this.getEngine().itemsMovedData.EXTRACTION, () => {
            this.onClickInventoryItem(item);
        });
        item.on('delete', () => this.clearAll());
        this.extractItemSlot.innerHTML = '';
        this.extractItemSlot.appendChild(itemEl);

        item.on('afterUpdate', () => this.extractItemAfterUpdate(item.id, itemEl));
        this.extractItemAfterUpdate(item.id, itemEl);
    }

    extractItemAfterUpdate(itemId: number, iconEl: any) {
        const item = this.getEngine().items.getItemById(itemId);
        item.updadeViewAfterUpdateItem($(iconEl));
    }

    removeItemFromEnchant() {
        if (this.selectedExtractItem != null) {
            const item = this.getEngine().items.getItemById(this.selectedExtractItem);
            const iconEl = this.getEngine().items.getViewByIdAndLoc(item.id, this.getEngine().itemsViewData.EXTRACTION_RECEIVED_ITEM_VIEW);
            item.unregisterCallback('afterUpdate', () => this.extractItemAfterUpdate(item.id, iconEl));
            item.unregisterCallback('delete', () => this.clearAll());
            this.selectedExtractItem = null;
        }
    }

    onClickInventoryItem(i: any) { // click or drop on grid
        if (this.requestBlock) return;
        const itemId = parseInt(i.id);
        if (!this.selectedExtractItem) {
            this.selectedExtractItem = itemId;
            this.sendPreviewRequest();
            return;
        }

        if (this.selectedExtractItem === itemId) {
            this.clearAll();
            return;
        }

        if (i.st !== 0) return;
    }

    update(v: any) {
        this.requestBlock = false;
        if (isset(v.completed)) {
            this.clearAll();
        }
        if (isset(v.preview)) {
            const {
                ingredientItemTplId,
                ingredientItemAmount,
                progressItemTplId,
                progressItemAmount,
                prices
            } = v.preview;

            if (ingredientItemTplId) this.receivedTpls[ingredientItemTplId] = ingredientItemAmount;
            this.receivedTpls[progressItemTplId] = progressItemAmount;

            this.finalize.update(prices);
        }

        this.updateScroll();
    }

    dimRestart() {
        this.getEngine().disableItemsManager.endSpecificItemKindDisable(Engine.itemsDisableData.EXTRACTION);
        this.getEngine().disableItemsManager.startSpecificItemKindDisable(Engine.itemsDisableData.EXTRACTION);
    }

    clearAll() {
        this.removeItemFromEnchant();
        this.finalize.reset();
        this.getEngine().tpls.deleteMessItemsByLoc('j');
        this.getEngine().items.deleteMessItemsByLoc('j');
        // this.getEngine().items.deleteAllViewsByViewName('extraction-item');
        this.getEngine().items.deleteAllViewsByViewName(this.getEngine().itemsViewData.EXTRACTION_ITEM_VIEW);
        //this.getEngine().itemsMovedManager.removeItemsByTarget('extraction');
        this.getEngine().itemsMovedManager.removeItemsByTarget(this.getEngine().itemsMovedData.EXTRACTION);
        this.dimRestart();
        this.receivedCounter = 0;
        this.updateScroll();
    }

    close() {
        this.clearAll();
        this.finalize.destroy();
        this.getEngine().items.removeCallback(this.getEngine().itemsFetchData.NEW_EXTRACTION_RECEIVED_ITEM);
        this.getEngine().tpls.removeCallback(this.getEngine().itemsFetchData.NEW_EXTRACTION_RECEIVED_TPL);
        this.getEngine().disableItemsManager.endSpecificItemKindDisable(Engine.itemsDisableData.EXTRACTION);
        this.getEngine().interfaceItems.setEnableSlots('extraction');
        this.getEngine().crafting.extraction = false;
    }

    tLang(name: string, category: string = 'extraction') {
        return typeof RUNNING_UNIT_TEST === "undefined" ? _t(name, null, category) : '';
    };

    getEngine() {
        return Engine;
    }
}