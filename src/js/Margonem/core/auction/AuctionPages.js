module.exports = function() {

    let currentPage = null;
    let maxPage = null;

    const init = () => {

    }

    const checkCanGetNextPage = () => {
        if (currentPage == null) return false;
        if (maxPage == null) return false;

        if (currentPage == maxPage) return false;

        return true
    };

    const getNextPageAction = () => {
        if (!checkCanGetNextPage()) return;

        let nextPage = currentPage + 1;
        // let request     = Engine.auctions.getAllAuctionStrRequest(nextPage);
        //
        // _g(request, () => {
        //     let auctionWindow = Engine.auctions.getAuctionWindow();
        //     auctionWindow.stopDragBar();
        // });

        Engine.auctions.getAuctionRequest().getNextPageRequest(nextPage, () => {
            Engine.auctions.getAuctionWindow().stopDragBar();
        })
    };

    const updatePages = (v) => {
        currentPage = v.number;
        maxPage = v.total;
    };

    const getMaxPage = () => {
        return maxPage
    };

    const getCurrentPage = () => {
        return currentPage
    };

    this.init = init;
    this.updatePages = updatePages;
    this.getCurrentPage = getCurrentPage;
    this.getMaxPage = getMaxPage;
    this.getNextPageAction = getNextPageAction;

}