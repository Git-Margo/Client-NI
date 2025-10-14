import {
    PreviewWindow
} from '@core/preview/PreviewWindow';
import {
    PreviewData,
    PreviewItem,
    PreviewStrategy
} from '@core/preview/preview';
import {
    PreviewStrategyFactory
} from '@core/preview/strategies/PreviewStrategyFactory';

export class Preview {
    #window: PreviewWindow;

    private readonly engine = Engine;

    private strategy!: PreviewStrategy;
    private fetchCounter = 0;
    private readonly amountOfFetches: number;

    private itemsLoaded = false;
    private updated = false;

    constructor(previewType: string) {
        this.#window = new PreviewWindow(() => this.onClose());

        this.resetFlags();
        this.strategy = PreviewStrategyFactory.create(previewType);
        this.amountOfFetches = this.strategy.amountOfFetches;
        this.initFetch();
    }

    private initFetch() {
        this.engine.tpls.fetch(this.engine.itemsFetchData.NEW_TPL_PREVIEW, this.newTplPreview.bind(this));
        this.engine.tpls.fetch(this.engine.itemsFetchData.NEW_OPEN_TPL, this.newOpenItem.bind(this));
    }

    private newOpenItem(i: PreviewItem, finish: boolean): void {
        const itemView = this.engine.tpls.createViewIcon(i.id, this.engine.itemsViewData.OPEN_PREVIEW_ITEM_VIEW, this.engine.itemsFetchData.NEW_OPEN_TPL.loc)[0][0];
        const itemContainer = this.#window.wndEl.querySelector('.item-container') as HTMLElement;
        itemContainer.appendChild(itemView);
        itemContainer.classList.remove('d-none');
        $(itemView).contextmenu(function(e: any, mE: any) {
            i.createOptionMenu(getE(e, mE));
        });

        if (finish) {
            this.fetchCounter++;
            if (this.fetchCounter === this.amountOfFetches) this.afterFetchItems();
        }
    }

    private newTplPreview(i: PreviewItem, finish: boolean): void {
        if (finish) {
            this.fetchCounter++;
            if (this.fetchCounter === this.amountOfFetches) this.afterFetchItems();
        }
    }

    update(data: PreviewData): void {
        this.#window.clear();
        this.strategy.setupData(data);
        this.setDescription(data);

        this.updated = true;
        this.tryComplete();
    }

    private setDescription(data: PreviewData): void {
        this.#window.setDescription(this.strategy.getDescription(data));
    }

    private afterFetchItems(): void {
        this.fetchCounter = 0;
        this.itemsLoaded = true;
        this.tryComplete();
    }

    private tryComplete() {
        if (this.itemsLoaded && this.updated) this.complete();
    }

    private complete() {
        const allRecords = this.strategy.createAllRecords();

        this.#window.addContent(allRecords);
        this.afterAppendContent();
    }

    private afterAppendContent() {
        this.#window.setWindowTitle(this.strategy.getTitle());
        this.#window.show();
    }

    private resetFlags(): void {
        this.itemsLoaded = false;
        this.updated = false;
    }

    private onClose(): void {
        this.resetFlags();
        this.engine.tpls.removeCallback(this.engine.itemsFetchData.NEW_TPL_PREVIEW);
        this.engine.tpls.deleteMessItemsByLoc(this.engine.itemsFetchData.NEW_TPL_PREVIEW.loc);
        this.engine.tpls.removeCallback(this.engine.itemsFetchData.NEW_OPEN_TPL);
        this.engine.tpls.deleteMessItemsByLoc(this.engine.itemsFetchData.NEW_OPEN_TPL.loc);
        Engine.preview = false;
    }

    close(): void {
        this.#window.close();
    }
}