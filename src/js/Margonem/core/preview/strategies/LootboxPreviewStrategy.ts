import {
    ContentItem,
    PreviewData,
    PreviewItem,
    PreviewStrategy
} from '@core/preview/preview';
import {
    BasePreviewStrategy
} from '@core/preview/strategies/BasePreviewStrategy';

const tpl = require('@core/Templates');

export class LootboxPreviewStrategy extends BasePreviewStrategy {
    readonly amountOfFetches = 2;
    private tplId!: number;
    private content: ContentItem[] = [];

    setupData(data: PreviewData): void {
        this.tplId = data.tpl_id;
        this.content = data.content;
    }

    getTitle(): string {
        const tpl = this.getItem(this.tplId);
        return tpl.name;
    }

    getDescription(data: PreviewData): string {
        return data.type === 'lootbox' ? _t('will_get') : _t('shuffle');
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

    private getDestinationSelector(): string {
        return '';
    }

    createAllRecords() {
        const containerEl = document.createElement('div');
        const itemsData = this.getItemsData();
        const processedItems = this.sortItems(itemsData);

        processedItems.forEach(item => {
            const recordEl = this.createRecord(item);
            containerEl.appendChild(recordEl);
        });

        return containerEl;
    }

    private createRecord(item: PreviewItem): HTMLElement {
        const recordEl = this.getSingleRecord(item);
        this.addContextMenu(item, recordEl);
        return recordEl;
    }

    getItemsData() {
        const items = this.content;
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