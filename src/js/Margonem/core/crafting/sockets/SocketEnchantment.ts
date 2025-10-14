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
import Button from "@core/components/Button";

const Tpl = require('@core/Templates');

const moduleData = {
    fileName: "SocketEnchantment.ts"
};

interface Response {
    injectPreview ? : {
        itemId: number,
        enhancerId: number,
        productId: number,
    };
    inject ? : {
        itemId: number,
    }
}

enum Action {
    ClearAll,
    RemoveEnhancer,
    PreviewEnchant,
    PreviewEnhancer,
    Ignore
}

export default class SocketEnchantment {

    private readonly engine = Engine;
    private readonly moduleName = MODULES.SOCKET_ENCHANTMENT;

    private contentEl!: HTMLElement;
    private enchantItemSlot!: HTMLElement;
    private enhancerItemSlot!: HTMLElement;
    private resultItemSlot!: HTMLElement;

    private submitButton!: Button;

    private selectedEnchantItem: number | null = null;
    private selectedEnhancerItem: number | null = null;

    private requestBlock: boolean = false;

    constructor(private wndEl: HTMLElement) {
        this.createContent();
        this.droppableInit();
        this.createSubmitButton();
        this.engine.items.fetch(this.engine.itemsFetchData.NEW_SOCKET_ENCHANT_ITEM, this.newResultItem.bind(this));
        this.dimItemSourceStart()
        this.engine.interfaceItems.setDisableSlots(this.moduleName);
    }

    private createContent() {
        const template = Tpl.get(this.moduleName)[0];
        this.contentEl = this.wndEl.querySelector(`.${this.moduleName}-content`) as HTMLElement;
        this.contentEl.innerHTML = '';
        this.contentEl.appendChild(template);

        this.enchantItemSlot = this.contentEl.querySelector(`.${this.moduleName}__source-item-slot`) as HTMLElement;
        this.enhancerItemSlot = this.contentEl.querySelector(`.${this.moduleName}__enhancer-item-slot`) as HTMLElement;
        this.resultItemSlot = this.contentEl.querySelector(`.${this.moduleName}__result-item`) as HTMLElement;
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
        const iconEl = this.engine[kind].createViewIcon(item.id, this.engine.itemsViewData.SOCKET_ENCHANTMENT_RESULT_VIEW, 'D')[0][0];

        iconEl.addEventListener('contextmenu', (e: any) => {
            item.createOptionMenu(e, false, {
                itemId: true
            });
        });

        this.resultItemSlot.appendChild(iconEl);
    }

    private sendPreviewRequest(enchantItemId ? : number, enhancerItemId ? : number) {
        this.requestBlock = true;
        const enchantString = enchantItemId ? `&item=${enchantItemId}` : '';
        const enhancerString = enhancerItemId ? `&enhancer=${enhancerItemId}` : '';
        _g(`socket&action=injectPreview${enchantString}${enhancerString}`, () => this.requestBlock = false);
    }

    private sendInjectRequest() {
        if (!this.selectedEnchantItem || !this.selectedEnhancerItem) return;
        this.requestBlock = true;
        _g(`socket&action=inject&item=${this.selectedEnchantItem}&enhancer=${this.selectedEnhancerItem}`, () => this.requestBlock = false);
    }

    private removeEnchantItem() {
        const clearEnchantItem = () => {
            this.selectedEnchantItem = null;
        }

        removeItemFromSlot({
            itemId: this.selectedEnchantItem,
            viewName: this.engine.itemsViewData.SOCKET_ENCHANTMENT_SOURCE_VIEW,
            movedName: this.engine.itemsMovedData.SOCKET_ENCHANTMENT_SOURCE,
            onDelete: () => this.clearAll(),
            onSuccess: () => clearEnchantItem(),
            onMissing: () => clearEnchantItem()
        });
    }

    private removeEnhancerItem() {
        const clearEnhancer = () => {
            this.selectedEnhancerItem = null;
            this.disableSubmitButton();
        };

        removeItemFromSlot({
            itemId: this.selectedEnhancerItem,
            viewName: this.engine.itemsViewData.SOCKET_ENCHANTMENT_ENHANCER_VIEW,
            movedName: this.engine.itemsMovedData.SOCKET_ENCHANTMENT_ENHANCER,
            onSuccess: () => clearEnhancer(),
            onMissing: () => clearEnhancer()
        });
    }

    private removeResultItem() {
        this.engine.items.deleteAllViewsByViewName(this.engine.itemsViewData.SOCKET_ENCHANTMENT_RESULT_VIEW);
        this.engine.items.deleteMessItemsByLoc('D');
    }

    private decideAction(item: Item): Action {
        const id = Number(item.id);

        if (this.selectedEnchantItem === id) return Action.ClearAll;
        if (this.selectedEnhancerItem === id) return Action.RemoveEnhancer;
        if (!this.selectedEnchantItem && this.checkCorrectEnchantItem(item)) return Action.PreviewEnchant;
        if (this.selectedEnchantItem && !this.selectedEnhancerItem && this.checkCorrectEnhancerItem(item)) return Action.PreviewEnhancer;

        return Action.Ignore;
    }

    private onClickInventoryItem(item: Item) {
        if (this.requestBlock) return;
        const itemId = Number(item.id);

        switch (this.decideAction(item)) {
            case Action.ClearAll:
                this.clearAll();
                break;
            case Action.RemoveEnhancer:
                this.removeEnhancerItem();
                this.removeResultItem();
                break;
            case Action.PreviewEnchant:
                this.sendPreviewRequest(itemId);
                break;
            case Action.PreviewEnhancer:
                this.sendPreviewRequest(this.selectedEnchantItem!, itemId);
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
            viewName: this.engine.itemsViewData.SOCKET_ENCHANTMENT_SOURCE_VIEW,
            movedName: this.engine.itemsMovedData.SOCKET_ENCHANTMENT_SOURCE,
            correctItemCheck: (item: Item) => this.checkCorrectEnchantItem(item),
            onClick: (item: Item) => this.onClickInventoryItem(item),
            onDelete: () => this.clearAll(),
            onSuccess: () => {
                this.selectedEnchantItem = itemId;
                this.dimItemEnhancerStart();
            }
        });
    }

    private checkCorrectEnchantItem(itemOrId: Item | number) {
        if (typeof itemOrId === "object") {
            return itemOrId.issetSocket_contentStat() && Number(itemOrId.getSocket_contentStat()) === 0;
        } else {
            const item = this.engine.items.getItemById(itemOrId);
            return item?.issetSocket_contentStat() && Number(item.getSocket_contentStat()) === 0;
        }
    }

    private setEnhancerItem(itemId: number) {
        attachItemToSlot({
            itemId,
            slotEl: this.enhancerItemSlot,
            viewName: this.engine.itemsViewData.SOCKET_ENCHANTMENT_ENHANCER_VIEW,
            movedName: this.engine.itemsMovedData.SOCKET_ENCHANTMENT_ENHANCER,
            correctItemCheck: (item: Item) => this.checkCorrectEnhancerItem(item),
            onClick: (item: Item) => this.onClickInventoryItem(item),
            onSuccess: () => {
                this.selectedEnhancerItem = itemId;
            }
        });
    }

    private checkCorrectEnhancerItem(itemOrId: Item | number) {
        if (typeof itemOrId === "object") {
            return itemOrId.issetSocket_enhancerStat();
        } else {
            const item = this.engine.items.getItemById(itemOrId);
            return item?.issetSocket_enhancerStat();
        }
    }

    createSubmitButton() {
        const buttonsContainerEl = this.wndEl.querySelector(`.${this.moduleName}__submit`) as HTMLElement;
        const opts = {
            text: this.tLang('submit'),
            classes: ['small', 'green'],
            action: this.onClickConfirmBtn.bind(this),
            disabled: true,
        };
        this.submitButton = new Button(opts);
        buttonsContainerEl.appendChild(this.submitButton.getButton());
    }

    private onClickConfirmBtn() {
        if (this.requestBlock) return;

        this.sendInjectRequest();
    }

    private setSubmitEnabled(enabled: boolean) {
        this.submitButton.setState(!enabled);
    }

    private enableSubmitButton() {
        this.setSubmitEnabled(true);
    }

    private disableSubmitButton() {
        this.setSubmitEnabled(false);
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

        if (v.injectPreview) {
            this.updateSlot(this.selectedEnchantItem, v.injectPreview.itemId, this.setEnchantItem.bind(this), this.removeEnchantItem.bind(this));
            this.updateSlot(this.selectedEnhancerItem, v.injectPreview.enhancerId, this.setEnhancerItem.bind(this), this.removeEnhancerItem.bind(this));
            if (!v.injectPreview?.productId) this.removeResultItem();
            this.setSubmitEnabled(Boolean(v.injectPreview?.itemId && v.injectPreview?.enhancerId));
        }
        if (isset(v.inject)) {
            this.clearAll();
        }

        this.updateScroll();
    }

    private dimItemSourceStart() {
        this.engine.disableItemsManager.endSpecificItemKindDisable(Engine.itemsDisableData.SOCKET_ENCHANTMENT_ENHANCER);
        this.engine.disableItemsManager.startSpecificItemKindDisable(Engine.itemsDisableData.SOCKET_ENCHANTMENT_SOURCE);
    }

    private dimItemEnhancerStart() {
        this.engine.disableItemsManager.endSpecificItemKindDisable(Engine.itemsDisableData.SOCKET_ENCHANTMENT_SOURCE);
        this.engine.disableItemsManager.startSpecificItemKindDisable(Engine.itemsDisableData.SOCKET_ENCHANTMENT_ENHANCER);
    }

    private dimRestart() {
        this.dimEnd();
        this.engine.disableItemsManager.startSpecificItemKindDisable(Engine.itemsDisableData.SOCKET_ENCHANTMENT_SOURCE);
    }

    private dimEnd() {
        this.engine.disableItemsManager.endSpecificItemKindDisable(Engine.itemsDisableData.SOCKET_ENCHANTMENT_SOURCE);
        this.engine.disableItemsManager.endSpecificItemKindDisable(Engine.itemsDisableData.SOCKET_ENCHANTMENT_ENHANCER);
    }

    private clearAll() {
        this.removeEnchantItem();
        this.removeEnhancerItem();
        this.removeResultItem();
        this.dimRestart();
        this.disableSubmitButton();
        this.updateScroll();
    }

    public close() {
        this.clearAll();
        this.engine.items.removeCallback(this.engine.itemsFetchData.NEW_SOCKET_ENCHANT_ITEM);
        this.dimEnd();
        this.engine.interfaceItems.setEnableSlots(this.moduleName);
        this.engine.crafting[this.moduleName] = false;
    }

    private tLang(name: string, category: string = this.moduleName) {
        return typeof RUNNING_UNIT_TEST === "undefined" ? _t(name, null, category) : '';
    };
}