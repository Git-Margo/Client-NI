let AuctionData = require('@core/auction/AuctionData');

module.exports = function() {

    let sortType = AuctionData.AUCTION_CEIL.ITEM_TIME_TD.sort;
    let sortOrder = AuctionData.SORT_ORDER.DESC;

    const init = () => {

    }

    const getSortString = () => {
        let _sortType = sortType == null ? '' : sortType;
        let _sortOrder = sortOrder == null ? 0 : sortOrder;

        return `${_sortType}|${_sortOrder}`
    };

    const callChangeSort = (_sortType) => {
        // console.log(_sortType)
        changeSortProcedure(_sortType);

        // Engine.auctions.getAuctionWindow().clearRecordListAndOffersTableAndAttachHeaderOfTable();
        Engine.auctions.getAuctionRequest().firstPageOfMainAuctionRequest();
    };

    const changeSortProcedure = (_sortType) => {
        if (sortType == _sortType) {
            let newSortOrder = isASCOrder() ? AuctionData.SORT_ORDER.DESC : AuctionData.SORT_ORDER.ASC;
            setSortOrder(newSortOrder);
        } else {
            setSortType(_sortType);
            setSortOrder(AuctionData.SORT_ORDER.ASC);
        }
    };

    // const setStandardSort = () => {
    //     setSortType(AuctionData.AUCTION_CEIL.ITEM_TIME_TD.sort);
    //     setSortOrder(AuctionData.SORT_ORDER.DESC);
    // };

    const getSortType = () => {
        return sortType;
    };

    const setSortType = (_sortType) => {
        sortType = _sortType
    };

    const isASCOrder = () => {
        return sortOrder == AuctionData.SORT_ORDER.ASC;
    };

    const setSortOrder = (_sortOrder) => {
        sortOrder = _sortOrder
    };

    const getSortOrder = () => {
        return sortOrder;
    }

    // this.setStandardSort = setStandardSort;
    this.callChangeSort = callChangeSort;
    this.getSortType = getSortType;
    this.getSortOrder = getSortOrder;
    this.getSortString = getSortString;
    this.init = init;


}