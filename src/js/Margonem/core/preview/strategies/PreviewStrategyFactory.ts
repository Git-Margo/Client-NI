import {
    RecipePreviewStrategy
} from '@core/preview/strategies/RecipePreviewStrategy';
import {
    LootboxPreviewStrategy
} from '@core/preview/strategies/LootboxPreviewStrategy';
import {
    SocketRecipePreviewStrategy
} from '@core/preview/strategies/SocketRecipePreviewStrategy';
import {
    PreviewStrategy
} from '@core/preview/preview';
import {
    previewType
} from '@core/preview/PrevievData';

const strategies = {
    [previewType.RECIPE]: RecipePreviewStrategy,
    [previewType.LOOTBOX]: LootboxPreviewStrategy,
    [previewType.SOCKET_RECIPE]: SocketRecipePreviewStrategy,
};

export class PreviewStrategyFactory {
    static create(type: string): PreviewStrategy {
        const StrategyClass = strategies[type as previewType] || LootboxPreviewStrategy;
        return new StrategyClass();
    }
}