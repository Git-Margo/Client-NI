import {
    PreviewData,
    SocketRecipe
} from '@core/preview/preview';
import {
    BasePreviewStrategy
} from '@core/preview/strategies/BasePreviewStrategy';

const tpl = require('@core/Templates');

export class SocketRecipePreviewStrategy extends BasePreviewStrategy {
    readonly amountOfFetches = 1;
    private socketRecipes: SocketRecipe[] = [];

    setupData(data: PreviewData): void {
        this.socketRecipes = data.socketRecipes || [];
    }

    getTitle(): string {
        return _t('preview-title', null, 'socket_composition');
    }

    getDescription(data: PreviewData): string {
        return _t('preview-desc', null, 'socket_composition');
    }

    sortItems(offers: SocketRecipe[]): SocketRecipe[] {
        return offers.slice().sort((a, b) => a.product - b.product);
    }

    getSingleRecord(offer: SocketRecipe): HTMLElement {
        const recordEl = tpl.get('socket-recipe-preview-one-item')[0];
        offer.components.map((id) => {
            const componentItemView = this.getItemView(id);
            this.addContextMenu(this.getItem(id), componentItemView);
            recordEl.querySelector('.left-items').appendChild(componentItemView);
        });

        const productItemView = this.getItemView(offer.product);
        this.addContextMenu(this.getItem(offer.product), productItemView);
        recordEl.querySelector('.right-items').appendChild(productItemView);

        return recordEl;
    }

    private getDestinationSelector(): string {
        return '';
    }

    createAllRecords() {
        const containerEl = document.createElement('div');
        const itemsData = this.sortItems(this.getItemsData());

        itemsData.forEach((offer) => {
            const recordEl = this.createRecord({
                offer
            });
            containerEl.appendChild(recordEl);
        });

        return containerEl;
    }

    private createRecord({
        offer
    }: {
        offer: SocketRecipe
    }): HTMLElement {
        const recordEl = this.getSingleRecord(offer);
        return recordEl;
    }

    getItemsData() {
        return this.socketRecipes;
    }
}