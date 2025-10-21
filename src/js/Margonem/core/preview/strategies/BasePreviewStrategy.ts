import {
    PreviewStrategy,
    PreviewData,
    PreviewItem,
    SocketRecipe,
} from '@core/preview/preview';

export abstract class BasePreviewStrategy implements PreviewStrategy {
    readonly amountOfFetches: number = 2;
    protected readonly engine = Engine;
    // protected tplId!: number;
    // protected content: ContentItem[] = [];
    // protected reagents: ReagentItem[] = [];

    abstract setupData(data: PreviewData): void;
    abstract getTitle(): string;
    abstract getDescription(data: PreviewData): string;
    abstract getItemsData(): PreviewItem[] | SocketRecipe[];
    abstract sortItems(items: PreviewItem[] | SocketRecipe[]): PreviewItem[] | SocketRecipe[];
    abstract getSingleRecord(item: PreviewItem | SocketRecipe): HTMLElement;
    abstract createAllRecords(): HTMLElement;

    protected getItem(tplId: number): PreviewItem {
        return this.engine.tpls.getTplByIdAndLoc(tplId, this.engine.itemsFetchData.NEW_TPL_PREVIEW.loc) ??
            this.engine.tpls.getTplByIdAndLoc(tplId, this.engine.itemsFetchData.NEW_OPEN_TPL.loc);
    }

    protected getItemView(tplId: number): HTMLElement {
        return (
            this.engine.tpls.createViewIcon(tplId, this.engine.itemsViewData.PREVIEW_ITEM_VIEW, this.engine.itemsFetchData.NEW_TPL_PREVIEW.loc) ??
            this.engine.tpls.createViewIcon(tplId, this.engine.itemsViewData.PREVIEW_ITEM_VIEW, this.engine.itemsFetchData.NEW_OPEN_TPL.loc)
        )[0][0];
    }

    protected addContextMenu(i: PreviewItem, recordEl: HTMLElement): void {
        $(recordEl).on('contextmenu longpress', (e: any, mE: any) => {
            i.createOptionMenu(getE(e, mE));
        });
    }
}