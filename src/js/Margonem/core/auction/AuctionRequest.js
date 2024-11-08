module.exports = function() {

    const init = () => {

    }

    const buyNowRequest = (auctionId) => {
        _g(`ah&action=buyout&auction=${auctionId}`);
    }

    const bidRequest = (auctionId, val) => {
        _g(`ah&action=bid&auction=${auctionId}&price=${val}`);
    }

    const setAuctionOffActionRequest = (itemId, data) => {
        const price = isset(data.price) ? "&price=" + data.price : '';
        const time = isset(data.time) ? "&time=" + data.time : '';
        const isFeatured = isset(data.is_featured) ? "&is_featured=" + data.is_featured : '';
        const buyOut = isset(data.buy_out) ? "&buy_out=" + data.buy_out : '';
        _g(`ah&action=sell&item=${itemId}${price}${time}${isFeatured}${buyOut}`);
    }

    const firstPageOfMainAuctionRequest = () => {
        mainAuctionRequest(1);
    }

    const mainAuctionRequest = (page) => {
        let request = getAllAuctionStrRequest(page);
        _g(request);
    }

    const getNextPageRequest = (nextPage, clb) => {
        let request = getAllAuctionStrRequest(nextPage);

        _g(request, () => {
            clb()
        });
    }

    const renewAuctionRequest = (auctionId, val) => {
        _g(`ah&action=change_time&auction=${auctionId}&time=${val}`);
    }

    const renewAllAuctionRequest = (val) => {
        //_g(`ah&action=change_time_all&time=${val}`);
        let action = `change_time_all&time=${val}`;
        let request = getAllAuctionStrRequest(1, action);

        _g(request);
    };

    const deleteAuctionRequest = (auctionId) => {
        _g('ah&action=end&auction=' + auctionId);
    }

    const getObservedStringRequest = (isObserved, auctionId, currentPage) => {
        if (isObserved) {
            let action = `observation_remove&auction=${auctionId}`;

            return getAllAuctionStrRequest(currentPage, action);

        } else return 'ah&action=observation_add&auction=' + auctionId;
    };

    const observedRequest = (isObserved, auctionId, currentPage) => {
        let str = getObservedStringRequest(isObserved, auctionId, currentPage)
        _g(str);
    }

    const getAllAuctionStrRequest = (page, _action) => {
        let filterString = Engine.auctions.getAuctionSearchItems().getFilterString(page);
        let sortString = Engine.auctions.getAuctionSort().getSortString();
        let action = '';

        let showCategory = Engine.auctions.getAuctionItemCategory().getShowCategory();

        if (_action) action = `&action=${_action}`;

        return `ah${action}&cat=${showCategory}&filter=${filterString}&sort=${sortString}`
    };

    this.init = init;
    this.firstPageOfMainAuctionRequest = firstPageOfMainAuctionRequest;
    this.setAuctionOffActionRequest = setAuctionOffActionRequest;
    this.getNextPageRequest = getNextPageRequest;
    this.mainAuctionRequest = mainAuctionRequest;
    this.buyNowRequest = buyNowRequest;
    this.renewAuctionRequest = renewAuctionRequest;
    this.renewAllAuctionRequest = renewAllAuctionRequest;
    this.deleteAuctionRequest = deleteAuctionRequest;
    this.observedRequest = observedRequest;
    this.bidRequest = bidRequest;

}