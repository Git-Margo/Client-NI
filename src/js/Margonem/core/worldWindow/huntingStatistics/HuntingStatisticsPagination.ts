export default class Pagination {
    private currentPage: number | null = null;
    private maxPage: number | null = null;

    private checkCanGetNextPage = (): boolean => {
        if (this.currentPage === null) return false;
        if (this.maxPage === null) return false;

        return this.currentPage !== this.maxPage;
    };

    public getNextPageAction = (): void => {
        if (!this.checkCanGetNextPage()) return;
        if (this.currentPage !== null) {
            const nextPage = this.currentPage + 1;
            this.getNextPageRequest(nextPage, () => {
                Engine.worldWindow.huntingStatistics.stopDragBar();
            });
        }
    };

    public updatePages = ({
        number,
        total
    }: {
        number: number,
        total: number
    }): void => {
        this.currentPage = number;
        this.maxPage = total;
    };

    public getMaxPage = (): number | null => {
        return this.maxPage;
    };

    public getCurrentPage = (): number | null => {
        return this.currentPage;
    };

    public isFirstPageUpdate = (): boolean => {
        return this.currentPage === 1 || this.maxPage === 0;
    };

    public getNextPageRequest = (nextPage: number, clb: () => void): void => {
        Engine.worldWindow.huntingStatistics.request.getNextPageRequest(nextPage, () => {
            clb();
        });
    };
}