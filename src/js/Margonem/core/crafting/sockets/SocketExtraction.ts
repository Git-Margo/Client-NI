import {
    MODULES
} from "@core/crafting/ItemCraft";
import {
    attachItemToSlot,
    errorReport,
    isset,
    removeItemFromSlot
} from "@core/HelpersTS";
import {
    Item
} from "@core/items/Item";
import PaymentSelector, {
    IncomingPayments
} from "@core/components/PaymentSelector";

const Tpl = require('@core/Templates');

const moduleData = {
    fileName: "SocketExtraction.ts"
};

interface Response {
    extractPreview ? : {
        itemId: number;
        enhancerId: number;
        extractedItemId: number;
        prices: IncomingPayments
    };
    extract ? : {
        itemId: number;
    }
}

enum Action {
    ClearAll,
    RemoveEnhancer,
    PreviewEnchant,
    PreviewEnhancer,
    Ignore
}

export default class SocketExtraction {

    private readonly engine = Engine;
    private readonly moduleName = MODULES.SOCKET_EXTRACTION;

    private paymentSelector!: PaymentSelector;

    private contentEl!: HTMLElement;
    private enchantItemSlot!: HTMLElement;
    private enhancerItemSlot!: HTMLElement;
    private resultItemSlot!: HTMLElement;

    private resultItemsCounter: number = 0;

    private selectedEnchantItem: number | null = null;

    private requestBlock: boolean = false;

    constructor(private wndEl: HTMLElement) {
        this.createContent();
        this.droppableInit();
        this.createPayment();
        this.engine.items.fetch(this.engine.itemsFetchData.NEW_SOCKET_EXTRACT_ITEM, this.newResultItem.bind(this));
        this.engine.tpls.fetch(this.engine.itemsFetchData.NEW_SOCKET_EXTRACT_TPL, this.newResultItem.bind(this));
        this.dimStart()
        this.engine.interfaceItems.setDisableSlots(this.moduleName);
    }

    private createContent() {
        const template = Tpl.get(this.moduleName)[0];
        this.contentEl = this.wndEl.querySelector(`.${this.moduleName}-content`) as HTMLElement;
        this.contentEl.innerHTML = '';
        this.contentEl.appendChild(template);

        this.enchantItemSlot = this.contentEl.querySelector(`.${this.moduleName}__source-item-slot`) as HTMLElement;
        this.resultItemSlot = this.contentEl.querySelector(`.${this.moduleName}__result-items`) as HTMLElement;
    }

    private updateScroll() {
        this.engine.crafting.itemCraft.updateScroll();
    };

    private makeDroppable(slotEl: HTMLElement) {
        $(slotEl).droppable({
            accept: ".inventory-item",
            drop: (_e, ui) => {
                ui.draggable.css("opacity", "");
                this.onClickInventoryItem(ui.draggable.data("item"));
            }
        });
    }

    private droppableInit() {
        this.makeDroppable(this.enchantItemSlot);
        this.makeDroppable(this.enhancerItemSlot);
    }

    private newResultItem(item: any) {
        const kind = item.isItem() ? 'items' : 'tpls';
        const iconEl = this.engine[kind].createViewIcon(item.id, this.engine.itemsViewData.SOCKET_EXTRACTION_RESULT_VIEW, 'E')[0][0];
        this.setResultItemPosition(iconEl, this.resultItemsCounter);

        iconEl.addEventListener('contextmenu', (e: any) => {
            item.createOptionMenu(e, false, {
                itemId: true
            });
        });

        this.resultItemSlot.appendChild(iconEl);
        this.resultItemsCounter++;
    }

    private sendPreviewRequest(enchantItemId ? : number) {
        this.requestBlock = true;
        const enchantString = enchantItemId ? `&item=${enchantItemId}` : '';
        _g(`socket&action=extractPreview${enchantString}`, () => this.requestBlock = false);
    }

    private sendExtractRequest(selectedPayment: string) {
        if (!this.selectedEnchantItem) return;
        this.requestBlock = true;
        _g(`socket&action=extract&item=${this.selectedEnchantItem}&currency=${selectedPayment}`, () => this.requestBlock = false);
    }

    private removeEnchantItem() {
        const clearEnchantItem = () => {
            this.selectedEnchantItem = null;
        }

        removeItemFromSlot({
            itemId: this.selectedEnchantItem,
            viewName: this.engine.itemsViewData.SOCKET_EXTRACTION_SOURCE_VIEW,
            movedName: this.engine.itemsMovedData.SOCKET_EXTRACTION_SOURCE,
            onDelete: () => this.clearAll(),
            onSuccess: () => clearEnchantItem(),
            onMissing: () => clearEnchantItem()
        });
    }

    private removeResultItem() {
        this.engine.items.deleteAllViewsByViewName(this.engine.itemsViewData.SOCKET_EXTRACTION_RESULT_VIEW);
        this.engine.items.deleteMessItemsByLoc('E');
        this.engine.tpls.deleteMessItemsByLoc('E');
    }

    private decideAction(item: Item): Action {
        const id = Number(item.id);

        if (this.selectedEnchantItem === id) return Action.ClearAll;
        if (!this.selectedEnchantItem && this.checkCorrectEnchantItem(item)) return Action.PreviewEnchant;

        return Action.Ignore;
    }

    private onClickInventoryItem(item: Item) {
        if (this.requestBlock) return;
        const itemId = Number(item.id);

        switch (this.decideAction(item)) {
            case Action.ClearAll:
                this.clearAll();
                break;
            case Action.PreviewEnchant:
                this.sendPreviewRequest(itemId);
                break;
            case Action.Ignore:
            default:
                // nic
                break;
        }
    }

    private setEnchantItem(itemId: number) {
        attachItemToSlot({
            itemId,
            slotEl: this.enchantItemSlot,
            viewName: this.engine.itemsViewData.SOCKET_EXTRACTION_SOURCE_VIEW,
            movedName: this.engine.itemsMovedData.SOCKET_EXTRACTION_SOURCE,
            correctItemCheck: (item: Item) => this.checkCorrectEnchantItem(item),
            onClick: (item: Item) => this.onClickInventoryItem(item),
            onDelete: () => this.clearAll(),
            onSuccess: () => {
                this.selectedEnchantItem = itemId;
            }
        });
    }

    setResultItemPosition(iconEl: HTMLElement, index: number) {
        const
            newY = Math.floor(index / 8),
            newX = index - newY * 8;
        iconEl.style.left = newX * 32 + newX + 1 + 'px';
        iconEl.style.top = newY * 32 + newY + 1 + 'px';
    }

    private checkCorrectEnchantItem(itemOrId: Item | number) {
        if (typeof itemOrId === "object") {
            return itemOrId.issetSocket_contentStat() && Number(itemOrId.getSocket_contentStat()) === 1;
        } else {
            const item = this.engine.items.getItemById(itemOrId);
            return item?.issetSocket_contentStat() && Number(item.getSocket_contentStat()) === 1;
        }
    }

    createPayment() {
        const paymentContainer = this.contentEl.querySelector(`.${this.moduleName}__payment`) as HTMLElement;
        this.paymentSelector = new PaymentSelector({
            infobox: this.tLang('info2'),
            submit: {
                btnText: this.tLang('submit_btn'),
                btnOnClick: (selectedPayment: string) => this.sendExtractRequest(selectedPayment)
            },
            hidden: true
        });
        paymentContainer.appendChild(this.paymentSelector.getComponent())
    }

    private updateSlot(
        currentId: number | null,
        apiId: number | undefined,
        setter: (id: number) => void,
        remover: () => void) {
        if (apiId) {
            if (currentId !== apiId) setter(apiId);
        } else {
            if (currentId !== null) remover();
        }
    }

    public update(v: Response) {
        this.requestBlock = false;

        if (v.extractPreview) {
            this.updateSlot(this.selectedEnchantItem, v.extractPreview.itemId, this.setEnchantItem.bind(this), this.removeEnchantItem.bind(this));
            if (!v.extractPreview?.extractedItemId) this.removeResultItem();
            if (v.extractPreview?.prices) this.paymentSelector.updatePayments(v.extractPreview.prices);
        }
        if (isset(v.extract)) {
            this.clearAll();
        }

        this.updateScroll();
    }

    private dimStart() {
        this.engine.disableItemsManager.startSpecificItemKindDisable(Engine.itemsDisableData.SOCKET_EXTRACTION);
    }

    private dimRestart() {
        this.dimEnd();
        this.engine.disableItemsManager.startSpecificItemKindDisable(Engine.itemsDisableData.SOCKET_EXTRACTION);
    }

    private dimEnd() {
        this.engine.disableItemsManager.endSpecificItemKindDisable(Engine.itemsDisableData.SOCKET_EXTRACTION);
    }

    private resetCounter() {
        this.resultItemsCounter = 0;
    }

    private clearAll() {
        this.removeEnchantItem();
        this.removeResultItem();
        this.paymentSelector.reset();
        this.resetCounter();
        this.dimRestart();
        this.updateScroll();
    }

    public close() {
        this.clearAll();
        this.engine.items.removeCallback(this.engine.itemsFetchData.NEW_SOCKET_EXTRACT_ITEM);
        this.engine.tpls.removeCallback(this.engine.itemsFetchData.NEW_SOCKET_EXTRACT_TPL);
        this.dimEnd();
        this.engine.interfaceItems.setEnableSlots(this.moduleName);
        this.engine.crafting[this.moduleName] = false;
    }

    private tLang(name: string, category: string = this.moduleName) {
        return typeof RUNNING_UNIT_TEST === "undefined" ? _t(name, null, category) : '';
    };
}