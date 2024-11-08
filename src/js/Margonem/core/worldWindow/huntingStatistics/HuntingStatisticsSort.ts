import {
    TABLE_HEADERS,
    SORT_ORDER
} from './HuntingStatisticsData';
import {
    isset
} from '../../HelpersTS';

export default class HuntingStatisticsSort {
    private defaultSortType = TABLE_HEADERS.find(item => isset(item.default)) !.key;
    private sortType: string = this.defaultSortType;
    private sortOrder: string = SORT_ORDER.DESC;

    public init(): void {}

    public getSortQuery(): string {
        // const sortType: string | '' = this.sortType == null ? this.defaultSortType : this.sortType;
        // const sortOrder: string = this.sortOrder == null ? SORT_ORDER.DESC : this.sortOrder;

        return `&sort=${this.sortType}|${this.sortOrder}`;
    }

    public callChangeSort(sortType: string): void {
        this.changeSortProcedure(sortType);
        Engine.worldWindow.huntingStatistics.request.mainRequest()
    }

    private changeSortProcedure(sortType: string): void {
        if (this.sortType === sortType) {
            const newSortOrder: string = this.isASCOrder() ? SORT_ORDER.DESC : SORT_ORDER.ASC;
            this.setSortOrder(newSortOrder);
        } else {
            this.setSortType(sortType);
            this.setSortOrder(SORT_ORDER.ASC);
        }
    }

    private isASCOrder(): boolean {
        return this.sortOrder == SORT_ORDER.ASC;
    }

    private setSortType(sortType: string): void {
        this.sortType = sortType;
    }

    private setSortOrder(sortOrder: string): void {
        this.sortOrder = sortOrder;
    }

    public getSortType(): string {
        return this.sortType;
    }

    public getSortOrder(): string {
        return this.sortOrder;
    }
}