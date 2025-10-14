import {
    ContentItem,
    PreviewData,
    PreviewItem,
    PreviewStrategy,
    ReagentItem
} from '@core/preview/preview';
import {
    BasePreviewStrategy
} from '@core/preview/strategies/BasePreviewStrategy';

const tpl = require('@core/Templates');

export class RecipePreviewStrategy extends BasePreviewStrategy {
    readonly amountOfFetches = 2;
    private tplId!: number;
    private content: ContentItem[] = [];
    private reagents: ReagentItem[] = [];

    setupData(data: PreviewData): void {
        this.tplId = data.tpl_id;
        this.content = data.content;
        this.reagents = data.reagents || [];
    }

    getTitle(): string {
        const tpl = this.getItem(this.tplId);
        return tpl.name;
    }

    getDescription(data: PreviewData): string {
        return _t('desc', null, 'recipe_preview');
    }

    sortItems(items: PreviewItem[]): PreviewItem[] {
        return items.sort((a, b) => b.itemTypeSort - a.itemTypeSort || b.pr - a.pr || a.name.localeCompare(b.name));
    }

    getSingleRecord(item: PreviewItem): HTMLElement {
        const recordEl = tpl.get('loot-preview-one-item')[0];
        const itemView = this.getItemView(item.id)

        recordEl.querySelector('.item-wrapper').appendChild(itemView);
        recordEl.querySelector('.name-wrapper').append(item.name);
        recordEl.querySelector('.amount-wrapper').append(`x${item.amount}`);

        return recordEl;
    }

    private getDestinationSelector(itemId: number): string {
        const type = this.content.find(x => x.id === itemId) ? 'content' : 'reagents';
        return `.${type}-list`;
    }

    createAllRecords() {
        const containerEl = this.getTemplate();
        const itemsData = this.getItemsData();
        const processedItems = this.sortItems(itemsData);

        processedItems.forEach(item => {
            const recordEl = this.createRecord(item);
            containerEl.querySelector(this.getDestinationSelector(item.id)).appendChild(recordEl);
        });

        return containerEl;
    }

    private getTemplate() {
        const template = tpl.get('recipe-preview-content')[0];
        template.querySelector('.content-txt') !.textContent = _t('result', null, 'recipe_preview');
        template.querySelector('.reagents-txt') !.textContent = _t('reagents', null, 'recipe_preview');

        return template;
    }

    private createRecord(item: PreviewItem): HTMLElement {
        const recordEl = this.getSingleRecord(item);
        this.addContextMenu(item, recordEl);
        return recordEl;
    }

    getItemsData() {
        const items = [...this.content, ...this.reagents];
        return items.map(({
            id,
            amount
        }) => {
            const tpl = this.getItem(id);
            return {
                ...tpl,
                ...{
                    amount
                }
            }
        });
    }
}