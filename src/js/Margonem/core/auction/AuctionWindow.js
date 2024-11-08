let Templates = require('../Templates');
let AuctionData = require('core/auction/AuctionData');

module.exports = function() {

    let content;
    let wnd;
    let $offersTable = null;

    const init = () => {
        initWindow();
        setSelectorVars();
        initDroppable();
        initCards();
        createButtonAuctionOff();
        createButtonAuctionRenew();
        initScrollBar();
        addPlugToScrollbar();
    };

    const addPlugToScrollbar = () => {
        let $scrollAuctionPlug = $('<div>').addClass('scroll-auction-plug');
        $('.scroll-wrapper', content).find('.scrollbar-wrapper').append($scrollAuctionPlug);
    };

    const scrollTop = () => {
        $('.scroll-wrapper', content).trigger('scrollTop');
    };

    const initWindow = () => {
        content = Templates.get('auction-window');

        wnd = Engine.windowManager.add({
            content: content,
            nameWindow: Engine.windowsData.name.AUCTION_WND2,
            title: Engine.auctions.tLang('auction_title'),
            managePosition: {
                position: Engine.windowsData.position.CENTER_OR_STICK_TO_EQ
            },
            onclose: () => {
                //Engine.auctions.getAuctionOffItemPanel().close();
                Engine.auctions.close();
                //close();
            }
        });
        wnd.addToAlertLayer();
        wnd.center();
    };

    const close = () => {
        wnd.remove();
    };

    const createButtonAuctionOff = () => {
        let str = Engine.auctions.tLang('auction_off_item');
        let $button = createButton(str, ['small', 'green'], () => {

            let actualKindOfAuction = Engine.auctions.getActualKindOfAuction()

            if (actualKindOfAuction != AuctionData.KIND_MY_AUCTION.MY_AUCTION_OFF) setMyAuctionOffTabAction();

            Engine.auctions.getAuctionOffItemPanel().manageOfShow();
            Engine.auctions.getAuctionOffItemPanel().manageVisibleElements();
        });
        content.find('.auction-off-btn-wrapper').append($button)
    };

    const setMyAuctionOffTabAction = () => {
        Engine.auctions.getAuctionCards().clickCard(1, null);
        setCardAction(AuctionData.KIND_MY_AUCTION.MY_AUCTION_OFF);
    }

    const manageVisibleElements = () => {
        let actualKindOfAuction = Engine.auctions.getActualKindOfAuction();
        let $renewBtn = content.find('.auction-renew-btn-wrapper');
        let display = actualKindOfAuction == AuctionData.KIND_MY_AUCTION.MY_AUCTION_OFF ? 'block' : 'none';
        let displayInfoWrapper = actualKindOfAuction == AuctionData.KIND_OTHERS_AUCTION.ALL_AUCTION;

        setVisibleAllAuctionsInfoWrapper(displayInfoWrapper);
        setVisibleAmountOfAuction(!displayInfoWrapper);
        $renewBtn.css('display', display);
    }

    const setVisibleAllAuctionsInfoWrapper = (state) => {
        let $infoWrapper = content.find('.all-auction-info-wrapper');

        $infoWrapper.css('display', state ? 'block' : 'none');
    }

    const setVisibleAmountOfAuction = (state) => {
        let $amountOfAuction = content.find('.amount-of-auction');

        $amountOfAuction.css('display', state ? 'block' : 'none');
    }

    const createButtonAuctionRenew = () => {
        let strB = Engine.auctions.tLang('renev_all_auction');
        let $button = createButton(strB, ['small', 'green'], () => {

            let strC = Engine.auctions.tLang('renev_all_auction_confirmation');

            confirmWitchNumberTextInput(strC, (val) => {
                if (checkInputValIsEmptyProcedure(val)) return false;

                renewAllAuction(val);
            }, {
                placeholder: '2-168',
                value: 168
            })
        });
        content.find('.auction-renew-btn-wrapper').append($button)
    };

    const clearOfferListAndOffersTableAndAttachHeaderOfTable = () => {
        clearAuctionsInTableWithOffers();
        setFirstHeaderOfTable();
    };

    const clearAuctionsInTableWithOffers = () => {
        Engine.auctions.clearOfferList();
        Engine.auctions.clearPairItemIdOfferIdObject();
        clearOffersTable();
    };

    const renewAllAuction = (val) => {
        Engine.auctions.getAuctionRequest().renewAllAuctionRequest(val);
    };

    const initScrollBar = () => {
        content.find('.main-all-auction-scroll').addScrollBar({
            track: true,
            addScrollableClassToAnotherEl: $('.all-auction-section', content),
            callback: scrollMove
        });
    };

    const scrollMove = (e) => {
        let auctionPages = Engine.auctions.getAuctionPages();
        auctionPages.getNextPageAction();
    };

    const getContent = () => {
        return content
    };

    const setSelectorVars = () => {
        $offersTable = content.find('.auction-table')
    };

    const clearOffersTable = () => {
        $offersTable.empty();
        wnd.$.find('.auction-table-header').empty();
    };

    const addToOffersTable = ($offer, prepend) => {
        if (prepend) $offersTable.prepend($offer);
        else $offersTable.append($offer);
    };

    const getSortVal = (_sorType) => {

        let auctionSort = Engine.auctions.getAuctionSort();
        let sortType = auctionSort.getSortType();

        if (sortType != _sorType) return null;

        let sortOrder = auctionSort.getSortOrder();
        switch (sortOrder) {
            case AuctionData.SORT_ORDER.ASC:
                return false;
            case AuctionData.SORT_ORDER.DESC:
                return true;
            default:
                errorReport('AuctionManager', "getSortVal", 'Bad val of sortOrder:' + sortOrder);
        }

        return null;
    };

    const getSortedData = () => {
        return {
            [AuctionData.AUCTION_CEIL.ITEM_SLOT_TD.key]: null,
            [AuctionData.AUCTION_CEIL.ITEM_NAME_TD.key]: getSortVal(AuctionData.AUCTION_CEIL.ITEM_NAME_TD.sort),
            [AuctionData.AUCTION_CEIL.ITEM_LEVEL_TD.key]: getSortVal(AuctionData.AUCTION_CEIL.ITEM_LEVEL_TD.sort),
            [AuctionData.AUCTION_CEIL.ITEM_TIME_TD.key]: getSortVal(AuctionData.AUCTION_CEIL.ITEM_TIME_TD.sort),
            [AuctionData.AUCTION_CEIL.ITEM_BID_TD.key]: getSortVal(AuctionData.AUCTION_CEIL.ITEM_BID_TD.sort),
            [AuctionData.AUCTION_CEIL.ITEM_BUY_NOW_TD.key]: getSortVal(AuctionData.AUCTION_CEIL.ITEM_BUY_NOW_TD.sort),
            [AuctionData.AUCTION_CEIL.AUCTION_ACTION_TD.key]: null,
        }
    };

    const setFirstHeaderOfTable = () => {
        let $tableHeader = wnd.$.find('.auction-table-header');
        let $header = createHeaderToTab(getSortedData());

        $tableHeader.append($header);

        scrollTop();
    };

    const getClassToElAndSortedDirection = (sortedData, name) => {
        let sortedVal;

        if (sortedData[name] == null) sortedVal = '';
        else sortedVal = 'sort-arrow ' + (sortedData[name] ? 'sort-arrow-up' : 'sort-arrow-down');

        return name + ' ' + sortedVal;
    };

    const createHeaderToTab = (sortedData) => {

        let classStr1 = 'header-auction-td center ';
        let classStr2 = 'header-auction-td center hover-td ';
        let auctionSort = Engine.auctions.getAuctionSort();
        let sortTipText = _t('sort', null, 'buttons');

        let $offer = createRecords(
            [
                'Item',
                $('<span>').tip(sortTipText).html(_t('name_th', null, 'auction')),
                $('<span>').tip(sortTipText).html(_t('level', null, 'auction')),
                $('<span>').tip(sortTipText).html(_t('au_time', null, 'auction')),
                $('<span>').tip(sortTipText).html(_t('price_bid', null, 'auction')),
                $('<span>').tip(sortTipText).html(_t('filter_buyout', null, 'auction')),
                $('<span>').html(_t('clan_action', null, 'clan')),
            ],
            [
                classStr1 + getClassToElAndSortedDirection(sortedData, AuctionData.AUCTION_CEIL.ITEM_SLOT_TD.key),
                classStr2 + getClassToElAndSortedDirection(sortedData, AuctionData.AUCTION_CEIL.ITEM_NAME_TD.key),
                classStr2 + getClassToElAndSortedDirection(sortedData, AuctionData.AUCTION_CEIL.ITEM_LEVEL_TD.key),
                classStr2 + getClassToElAndSortedDirection(sortedData, AuctionData.AUCTION_CEIL.ITEM_TIME_TD.key),
                classStr2 + getClassToElAndSortedDirection(sortedData, AuctionData.AUCTION_CEIL.ITEM_BID_TD.key),
                classStr2 + getClassToElAndSortedDirection(sortedData, AuctionData.AUCTION_CEIL.ITEM_BUY_NOW_TD.key),
                classStr1 + getClassToElAndSortedDirection(sortedData, AuctionData.AUCTION_CEIL.AUCTION_ACTION_TD.key)
            ], [
                false,
                () => {
                    auctionSort.callChangeSort(AuctionData.AUCTION_CEIL.ITEM_NAME_TD.sort)
                },
                () => {
                    auctionSort.callChangeSort(AuctionData.AUCTION_CEIL.ITEM_LEVEL_TD.sort)
                },
                () => {
                    auctionSort.callChangeSort(AuctionData.AUCTION_CEIL.ITEM_TIME_TD.sort)
                },
                () => {
                    auctionSort.callChangeSort(AuctionData.AUCTION_CEIL.ITEM_BID_TD.sort)
                },
                () => {
                    auctionSort.callChangeSort(AuctionData.AUCTION_CEIL.ITEM_BUY_NOW_TD.sort)
                },
                false
            ]
        );


        return $offer
    };

    const initDroppable = () => {
        wnd.$.find('.add-item-section').find('.item-slot').droppable({
            accept: '.inventory-item',
            drop: function(e, ui) {
                ui.draggable.css('opacity', '');
                setAuctionOffItem(ui.draggable.data('item'), false);
            }
        });
    };

    const initCards = () => {
        let con = content.find('.cards-header');
        let str1 = _t('tab_others_auctions', null, 'auction'); //"Aukcje Graczy";
        let str2 = _t('tab_my', null, 'auction'); //"Twoje Aukcje";
        let str3 = _t('tab_observed', null, 'auction'); //"Obserwowane";
        let str4 = _t('tab_au_catmybids', null, 'auction'); //"Licytowane";

        let auctionCards = Engine.auctions.getAuctionCards();

        auctionCards.newCard(con, str1, function() {
            setCardAction(AuctionData.KIND_OTHERS_AUCTION.ALL_AUCTION)
        });
        auctionCards.newCard(con, str2, function() {
            setCardAction(AuctionData.KIND_MY_AUCTION.MY_AUCTION_OFF)
        });

        auctionCards.newCard(con, str3, function() {
            setCardAction(AuctionData.KIND_MY_AUCTION.MY_WATCH)
        });

        auctionCards.newCard(con, str4, function() {
            setCardAction(AuctionData.KIND_MY_AUCTION.MY_BID)
        });

        setFirstCard();
    };

    const setCardAction = (_actualKindOfAuction) => {
        setCard(_actualKindOfAuction);
        manageVisibleElements();
        //Engine.auctions.getAuctionRequest().firstPageOfMainAuctionRequest();

        if (_actualKindOfAuction == AuctionData.KIND_OTHERS_AUCTION.ALL_AUCTION) Engine.auctions.clearAllStates();
        else Engine.auctions.getAuctionRequest().firstPageOfMainAuctionRequest();
    };

    const setFirstCard = () => {
        Engine.auctions.getAuctionCards().clickCard(0, null);
        setCard(AuctionData.KIND_OTHERS_AUCTION.ALL_AUCTION);
        manageVisibleElements();
    };

    const setCard = (_actualKindOfAuction) => {
        Engine.auctions.getAuctionItemCategory().clearItemCategory();
        Engine.auctions.setActualKindOfAuction(_actualKindOfAuction);
    };

    const updateAmountOfAuction = () => {
        let str = _t('quantity_of_auction', null, 'auction');
        let allStr = '';
        let itemsTotal = Engine.auctions.getTotalOffers();
        let actualKindOfAuction = Engine.auctions.getActualKindOfAuction();

        let isMyWatch = actualKindOfAuction == AuctionData.KIND_MY_AUCTION.MY_WATCH;

        if (isMyWatch) allStr = `${str}: ${itemsTotal}/${AuctionData.MAX_OBSERVED}`;
        else allStr = `${str}: ${itemsTotal}`;

        content.find('.amount-of-auction').html(allStr);
    };

    const updateScroll = () => {
        $('.scroll-wrapper', content).trigger('update');
    };

    const updateBarPos = () => {
        $('.scroll-wrapper', content).trigger('updateBarPos');
    };

    const stopDragBar = () => {
        $('.scroll-wrapper', content).trigger('stopDragBar');
    };

    this.init = init;
    this.close = close;
    this.initCards = initCards;
    this.stopDragBar = stopDragBar;
    this.updateScroll = updateScroll;
    this.updateBarPos = updateBarPos;
    this.updateAmountOfAuction = updateAmountOfAuction;
    this.setFirstHeaderOfTable = setFirstHeaderOfTable;
    this.setCard = setCard;
    this.getContent = getContent;
    this.addToOffersTable = addToOffersTable;
    //this.clearOffersTable = clearOffersTable;
    this.scrollTop = scrollTop;
    this.setSelectorVars = setSelectorVars;
    this.setMyAuctionOffTabAction = setMyAuctionOffTabAction;
    this.initScrollBar = initScrollBar;
    this.clearAuctionsInTableWithOffers = clearAuctionsInTableWithOffers;
    this.clearOfferListAndOffersTableAndAttachHeaderOfTable = clearOfferListAndOffersTableAndAttachHeaderOfTable;
    this.setVisibleAllAuctionsInfoWrapper = setVisibleAllAuctionsInfoWrapper;
    this.setVisibleAmountOfAuction = setVisibleAmountOfAuction;

};