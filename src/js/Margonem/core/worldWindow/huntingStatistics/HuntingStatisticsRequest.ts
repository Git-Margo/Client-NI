import HuntingStatistics from './HuntingStatistics';

export default class Request {

    huntingStatistics: HuntingStatistics;
    constructor(huntingStatistics: any) {
        this.huntingStatistics = huntingStatistics;
    }

    public mainRequest(page: number = 1): void {
        const request = this.getAllItemsRequest(page);
        _g(request);
    }

    public getNextPageRequest(nextPage: number, clb: () => void): void {
        const request = this.getAllItemsRequest(nextPage);

        _g(request, () => {
            clb();
        });
    }

    public getAllItemsRequest(page: number, _action ? : string): string {
        const filters = this.huntingStatistics.getFiltersQuery(page);
        const sort = this.huntingStatistics.sorting.getSortQuery();

        // return `hunting_statistics${filters}`;
        return `hunting_statistics${filters}${sort}`;
    }
}