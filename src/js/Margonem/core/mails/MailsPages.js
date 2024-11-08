module.exports = function() {

    let currentPage = null;
    let maxPage = null;
    let isReceived = null;

    const checkCanGetNextPage = () => {
        if (currentPage === null) return false;
        if (maxPage === null) return false;

        return currentPage !== maxPage;
    };

    const getNextPageAction = () => {
        if (!checkCanGetNextPage()) return;

        let nextPage = currentPage + 1;
        getNextPageRequest(nextPage, () => {
            Engine.mails.stopDragBar();
        })
    };

    const updatePages = (v, _isReceived) => {
        currentPage = v.number;
        maxPage = v.total;
        isReceived = _isReceived;
    };

    const getMaxPage = () => {
        return maxPage;
    };

    const getCurrentPage = () => {
        return currentPage
    };

    const getNextPageRequest = (nextPage, clb) => {
        const showSent = isReceived ? '' : '&action=showSent';
        const request = `mail${showSent}&page=${nextPage}`;

        _g(request, () => {
            clb()
        });
    }

    this.updatePages = updatePages;
    this.getCurrentPage = getCurrentPage;
    this.getMaxPage = getMaxPage;
    this.getNextPageAction = getNextPageAction;

}