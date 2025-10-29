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
    fileName: "SocketComposition.ts"
};

interface Response {
    composePreview ? : {
        components: number[];
        productId: number;
        prices: IncomingPayments
    };
    compose ? : {
        itemId: number;
    }
}

enum Action {
    ClearAll,
    AddIngredient,
    RemoveIngredient,
    PreviewCompose,
    Ignore
}

export default class SocketComposition {

    private readonly engine = Engine;
    private readonly moduleName = MODULES.SOCKET_COMPOSITION;
    private readonly maxIngredients = 3;

    private paymentSelector!: PaymentSelector;

    private contentEl!: HTMLElement;
    private ingredientItemGrid!: HTMLElement;
    private resultItemSlot!: HTMLElement;

    private selectedIngredientItems: number[] = [];

    private requestBlock: boolean = false;

    constructor(private wndEl: HTMLElement) {
        this.createContent();
        this.droppableInit();
        this.createPayment();
        this.engine.tpls.fetch(this.engine.itemsFetchData.NEW_SOCKET_COMPOSE_TPL, this.newResultItem.bind(this));
        this.dimStart()
        this.engine.interfaceItems.setDisableSlots(this.moduleName);
    }

    private createContent() {
        const template = Tpl.get(this.moduleName)[0];
        this.contentEl = this.wndEl.querySelector(`.${this.moduleName}-content`) as HTMLElement;
        this.contentEl.innerHTML = '';
        this.contentEl.appendChild(template);

        this.ingredientItemGrid = this.contentEl.querySelector(`.${this.moduleName}__source-items`) as HTMLElement;
        this.resultItemSlot = this.contentEl.querySelector(`.${this.moduleName}__result-item-slot`) as HTMLElement;

        const socketRecipesHandler = this.contentEl.querySelector(`.socket-recipes-handler`) as HTMLElement;
        socketRecipesHandler.addEventListener('click', () => {
            if (this.requestBlock) return;
            this.sendPreviewRecipesRequest();
        });
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
        this.makeDroppable(this.ingredientItemGrid);
    }

    private decideAction(item: Item): Action {
        const id = Number(item.id);

        if (this.selectedIngredientItems?.includes(id)) return Action.RemoveIngredient;
        if (this.selectedIngredientItems.length < this.maxIngredients && this.checkCorrectIngredientItem(item)) return Action.AddIngredient;

        return Action.Ignore;
    }

    private onClickInventoryItem(item: Item) {
        if (this.requestBlock) return;
        const itemId = Number(item.id);

        switch (this.decideAction(item)) {
            case Action.ClearAll:
                this.clearAll();
                break;
                // case Action.PreviewCompose:
                //   this.sendPreviewRequest(itemId);
                //   break;
            case Action.AddIngredient:
                this.sendPreviewRequest(itemId);
                break;
            case Action.RemoveIngredient:
                this.removeIngredientItem(itemId);
                this.removeResultItem();
                break;
            case Action.Ignore:
            default:
                // nic
                break;
        }
    }

    private sendPreviewRequest(ingredientItemId: number) {
        this.requestBlock = true;
        const selectedIngredients = [...this.selectedIngredientItems, ...[ingredientItemId]].join(',');
        const itemsString = ingredientItemId ? `&items=${selectedIngredients}` : '';
        _g(`socket&action=composePreview${itemsString}`, () => this.requestBlock = false);
    }

    private sendComposeRequest(selectedPayment: string) {
        if (!this.selectedIngredientItems) return;
        this.requestBlock = true;
        _g(`socket&action=compose&items=${this.selectedIngredientItems}&currency=${selectedPayment}`, () => this.requestBlock = false);
    }

    private sendPreviewRecipesRequest() {
        this.requestBlock = true;
        _g(`socket&action=composePreviewRecipes`, () => this.requestBlock = false);
    }

    private newResultItem(item: any) {
        const kind = item.isItem() ? 'items' : 'tpls';
        const iconEl = this.engine[kind].createViewIcon(item.id, this.engine.itemsViewData.SOCKET_COMPOSITION_RESULT_VIEW, this.engine.itemsFetchData.NEW_SOCKET_COMPOSE_TPL.loc)[0][0];

        iconEl.addEventListener('contextmenu', (e: any) => {
            item.createOptionMenu(e, false, {
                itemId: true
            });
        });

        this.resultItemSlot.appendChild(iconEl);
    }

    private removeResultItem() {
        this.engine.items.deleteAllViewsByViewName(this.engine.itemsViewData.SOCKET_COMPOSITION_RESULT_VIEW);
        this.engine.items.deleteMessItemsByLoc(this.engine.itemsFetchData.NEW_SOCKET_COMPOSE_TPL.loc);
        this.engine.tpls.deleteMessItemsByLoc(this.engine.itemsFetchData.NEW_SOCKET_COMPOSE_TPL.loc);
        this.paymentSelector.reset();
    }

    private setIngredientItem(itemId: number) {
        attachItemToSlot({
            itemId,
            slotEl: this.ingredientItemGrid,
            viewName: this.engine.itemsViewData.SOCKET_COMPOSITION_SOURCE_VIEW,
            movedName: this.engine.itemsMovedData.SOCKET_COMPOSITION_SOURCE,
            clearSlotBeforeAppend: false,
            correctItemCheck: (item: Item) => this.checkCorrectIngredientItem(item),
            onClick: (item: Item) => this.onClickInventoryItem(item),
            // onDelete: () => this.clearAll(),
            onSuccess: () => {
                this.selectedIngredientItems.push(itemId);
            }
        });
    }

    private checkCorrectIngredientItem(itemOrId: Item | number) {
        if (typeof itemOrId === "object") {
            return itemOrId.issetSocket_componentStat();
        } else {
            const item = this.engine.items.getItemById(itemOrId);
            return item?.issetSocket_componentStat();
        }
    }

    private removeIngredientItem(itemId: number) {
        const removeItemFromIngredientList = (id: number) => {
            const index = this.selectedIngredientItems.indexOf(id);
            if (index > -1) {
                this.selectedIngredientItems.splice(index, 1);
            }
        }

        removeItemFromSlot({
            itemId,
            viewName: this.engine.itemsViewData.SOCKET_COMPOSITION_SOURCE_VIEW,
            movedName: this.engine.itemsMovedData.SOCKET_COMPOSITION_SOURCE,
            // onDelete: () => this.clearAll(),
            onSuccess: () => removeItemFromIngredientList(itemId),
            onMissing: () => removeItemFromIngredientList(itemId)
        });
    }

    private removeAllIngredientItems() {
        this.engine.items.deleteAllViewsByViewName(this.engine.itemsViewData.SOCKET_COMPOSITION_SOURCE_VIEW);
        this.engine.itemsMovedManager.removeItemsByTarget(this.engine.itemsMovedData.SOCKET_COMPOSITION_SOURCE);
        this.selectedIngredientItems = [];
    }

    createPayment() {
        const paymentContainer = this.contentEl.querySelector(`.${this.moduleName}__payment`) as HTMLElement;
        this.paymentSelector = new PaymentSelector({
            infobox: this.tLang('info2'),
            submit: {
                btnText: this.tLang('submit_btn'),
                btnOnClick: (selectedPayment: string) => this.sendComposeRequest(selectedPayment)
            },
            hidden: true
        });
        paymentContainer.appendChild(this.paymentSelector.getComponent())
    }

    private updateSlot(
        currentId: number | number[] | null,
        apiId: number | number[] | undefined,
        setter: (id: number) => void,
        remover: (id: number) => void
    ) {
        const toArray = (val: number | number[] | null | undefined): number[] =>
            val == null ? [] : Array.isArray(val) ? val : [val];

        const currentArray = toArray(currentId);
        const apiArray = toArray(apiId);

        apiArray.filter(id => !currentArray.includes(id)).forEach(setter);
        currentArray.filter(id => !apiArray.includes(id)).forEach(remover);
    }

    public update(v: Response) {
        this.requestBlock = false;

        if (v.composePreview) {
            this.updateSlot(this.selectedIngredientItems, v.composePreview.components, this.setIngredientItem.bind(this), this.removeIngredientItem.bind(this));
            if (v.composePreview?.components.length === this.maxIngredients && v.composePreview?.prices) {
                this.paymentSelector.updatePayments(v.composePreview.prices);
            }
        }
        if (isset(v.compose)) {
            this.clearAll();
        }

        this.updateScroll();
    }

    private dimStart() {
        this.engine.disableItemsManager.startSpecificItemKindDisable(this.engine.itemsDisableData.SOCKET_COMPOSITION);
    }

    private dimRestart() {
        this.dimEnd();
        this.engine.disableItemsManager.startSpecificItemKindDisable(this.engine.itemsDisableData.SOCKET_COMPOSITION);
    }

    private dimEnd() {
        this.engine.disableItemsManager.endSpecificItemKindDisable(this.engine.itemsDisableData.SOCKET_COMPOSITION);
    }

    private clearAll() {
        this.removeAllIngredientItems();
        this.removeResultItem();
        this.paymentSelector.reset();
        this.dimRestart();
        this.updateScroll();
    }

    public close() {
        this.clearAll();
        this.engine.tpls.removeCallback(this.engine.itemsFetchData.NEW_SOCKET_COMPOSE_TPL);
        this.dimEnd();
        this.engine.interfaceItems.setEnableSlots(this.moduleName);
        this.engine.crafting[this.moduleName] = false;
    }

    private tLang(name: string, category: string = this.moduleName) {
        return typeof RUNNING_UNIT_TEST === "undefined" ? _t(name, null, category) : '';
    };
}