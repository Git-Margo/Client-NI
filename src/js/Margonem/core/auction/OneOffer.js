let Templates = require('../Templates');
let AuctionData = require('core/auction/AuctionData');

module.exports = function() {

    let $offer;
    let id = null;
    let localDuration = null;
    let itemAttachToSlot = false;

    const init = (d) => {
        // setD(_d);
        setLocalDuration(d.time);
        setId(d.id);
        init$Offer(d);
        setItemAttachToSlotState(false)
    };

    const setItemAttachToSlotState = (state) => {
        itemAttachToSlot = state;
    };

    const setId = (_id) => {
        id = _id;
    };

    const init$Offer = (d) => {
        $offer = getPrepareOfferToTable(d);
    };

    const updateOffer = (d) => {
        setLocalDuration(d.time)

        let $newOffer = getPrepareOfferToTable(d)
        $offer.replaceWith($newOffer);
        $offer = $newOffer;
        setItemAttachToSlotState(false);
    };

    const setLocalDuration = (duration) => {
        localDuration = duration;
    };

    const decreaseLocalDuration = () => {
        localDuration--;
    };

    const checkAuctionIsEnd = () => {
        return localDuration < 0;
    };

    const updateTime = () => {
        decreaseLocalDuration();

        if (checkAuctionIsEnd()) {
            removeOffer();
            Engine.auctions.removeFromOfferList(id);
            return
        }

        updateTimeInOffer();
    };

    const updateTimeInOffer = () => {
        let $itemTimeTd = $offer.find('.item-time-td').find('.time-wrapper');
        let oldDuration = $itemTimeTd.html();
        let newDuration = getSecondLeft(localDuration, {
            short: true
        });

        if (oldDuration == newDuration) return;

        $itemTimeTd.html(newDuration);
    };

    const getItemInSlot = (id) => {
        let $itemSlot = $('<div>').addClass('item-slot');

        return $itemSlot
    };

    const removeOffer = () => {
        $offer.remove();
    };


    const createTimeCeil = (d) => {
        let $timeWrapper = $('<div>').addClass('time-wrapper');

        let t = '<br>' + ut_fulltime(ts() / 1000 + d.time);
        let str = _t("end_time %val%", {
            "%val%": t
        }, "end_time_auction");

        $timeWrapper.tip(str);
        $timeWrapper.html(getSecondLeft(d.time, {
            short: true
        }));

        return $timeWrapper;
    };

    const getPrepareOfferToTable = (d) => {
        let id = d.id;
        let classStr = 'auction-td center ';
        let isFeatured = d.is_featured;

        if (isFeatured) classStr += "is-featured ";

        let auctionBidAndBuyNowActions = Engine.auctions.getAuctionBidAndBuyNowActions()

        let $resultOffer = createRecords(
            [
                getItemInSlot(id),
                '', //,itemData.name,
                '', //,itemData.lvl,
                createTimeCeil(d),
                auctionBidAndBuyNowActions.getBidCeil(d),
                auctionBidAndBuyNowActions.getBuyNowCeil(d),
                getAllAction(d)
            ],
            [
                classStr + AuctionData.AUCTION_CEIL.ITEM_SLOT_TD.key,
                classStr + AuctionData.AUCTION_CEIL.ITEM_NAME_TD.key,
                classStr + AuctionData.AUCTION_CEIL.ITEM_LEVEL_TD.key,
                classStr + AuctionData.AUCTION_CEIL.ITEM_TIME_TD.key,
                classStr + AuctionData.AUCTION_CEIL.ITEM_BID_TD.key,
                classStr + AuctionData.AUCTION_CEIL.ITEM_BUY_NOW_TD.key,
                classStr + AuctionData.AUCTION_CEIL.AUCTION_ACTION_TD.key
            ]);

        if (isFeatured) $resultOffer.addClass('is-featured-tr');

        return $resultOffer
    };

    const getAllAction = (d) => {
        let ordinalNumber = d.ordinal_number;
        let $auctionWrapper = $('<div>').addClass('auction-wrapper');
        let actualKindOfAuction = Engine.auctions.getActualKindOfAuction();

        if (d.is_cancelable) {
            let isFeatured = d.is_featured;

            if (!isFeatured) $auctionWrapper.append(getRefreshAuction(d));
            $auctionWrapper.append(getDeleteAuction(d));
            return $auctionWrapper;
        }

        let a = [AuctionData.KIND_MY_AUCTION.MY_WATCH, AuctionData.KIND_MY_AUCTION.MY_BID, AuctionData.KIND_OTHERS_AUCTION.ALL_AUCTION]
        if (a.includes(actualKindOfAuction) && !d.own_auction) {
            $auctionWrapper.append(getObserveAction(d))
            return $auctionWrapper;
        }

        $auctionWrapper.text('-----');
        return $auctionWrapper;
    };

    const getRefreshAuction = (d) => {

        let canNotRenew = Engine.auctions.tLang('canNotRenew')
        let renewAuction = Engine.auctions.tLang('renewAuction')

        //let tip     = d.bidder ? 'Nie mozna odnowiï¿½ aukcji. Przedmiot jest juz licytowany.' : 'Odnow aukcje.';
        let tip = d.bidder ? canNotRenew : renewAuction;
        let addCl = d.bidder ? 'inactive' : '';

        let b = createSmallButtonWithBackground(['reset'], ['green'], () => {
            if ($(b).hasClass('inactive')) return;

            let str = Engine.auctions.tLang('renewAuctionConfirmation');
            let auctionId = d.id;

            confirmWitchNumberTextInput(str, (val) => {

                if (checkInputValIsEmptyProcedure(val)) return false;

                Engine.auctions.getAuctionRequest().renewAuctionRequest(auctionId, val);
            }, {
                placeholder: '2-168',
                value: 168
            })

        });

        let $b = $(b);

        $b.tip(tip);
        $b.addClass(addCl);

        return $b;
    };

    const getDeleteAuction = (d) => {

        let canNotRemoveAuction = Engine.auctions.tLang('canNotRemoveAuction')
        let removeAuction = Engine.auctions.tLang('removeAuction')

        //let tip     = d.bidder ? 'Nie mozna zakonczyc auckji. Przedmiot jest juz licytowany.' : 'Zakoncz aukcje.';
        let tip = d.bidder ? canNotRemoveAuction : removeAuction;
        let addCl = d.bidder ? 'inactive' : '';

        let b = createSmallButtonWithBackground(['remove'], ['green'], function() {
            if ($(b).hasClass('inactive')) return;

            let str = Engine.auctions.tLang('removeAuctionConfirm');
            let auctionId = d.id;

            confirmWithCallback({
                msg: str,
                clb: () => {
                    //_g('ah&action=end&item=' + d.id);
                    Engine.auctions.getAuctionRequest().deleteAuctionRequest(auctionId);
                }
            });
        });

        let $b = $(b);

        $b.tip(tip);
        $b.addClass(addCl);

        return $b;
    };

    const get$Offer = () => {
        return $offer;
    }

    //const getObserveAction = (d) => {
    //    if (d.own_auction) return '';
    //
    //    let $auctionObserveAction = Templates.get('auction-observe-action');
    //    let isObserved            = d.is_observed;
    //
    //    if (isObserved) $auctionObserveAction.addClass('is-observed');
    //
    //    $auctionObserveAction.on('click', () => {
    //        _g(getObservedStringRequest(isObserved, d.id));
    //    });
    //
    //    return $auctionObserveAction;
    //};

    const getObserveAction = (d) => {
        if (d.own_auction) return '';

        let canNotObserve = Engine.auctions.tLang('canNotObserve')
        let observe = Engine.auctions.tLang('observe')

        let tip = d.is_observed ? canNotObserve : observe;
        //let addCl   = d.is_observed ? 'not-observed-auction' : 'observed-auction';
        let addCl = d.is_observed ? 'observed-auction' : 'not-observed-auction';





        let b = createSmallButtonWithBackground([addCl], ['green'], () => {

            let auctionId = d.id;

            if (!d.is_observed) {
                let currentPage = Engine.auctions.getAuctionPages().getCurrentPage();
                Engine.auctions.getAuctionRequest().observedRequest(d.is_observed, auctionId, currentPage);
                return
            }

            let str = Engine.auctions.tLang('notObserveConfirmation');
            confirmWithCallback({
                msg: str,
                clb: () => {
                    let currentPage = Engine.auctions.getAuctionPages().getCurrentPage();
                    Engine.auctions.getAuctionRequest().observedRequest(d.is_observed, auctionId, currentPage);
                }
            });
        });

        let $b = $(b);

        $b.tip(tip);
        $b.addClass(addCl);

        return $b;
    };

    // const getObservedStringRequest = (isObserved, id) => {
    //     if (isObserved) {
    //
    //         let action      = `observation_remove&item=${id}`;
    //         let currentPage = Engine.auctions.getAuctionPages().getCurrentPage();
    //
    //         return Engine.auctions.getAllAuctionStrRequest(currentPage, action);
    //
    //     } else return 'ah&action=observation_add&item=' + id;
    // };

    this.init = init;
    this.updateTime = updateTime;
    this.get$Offer = get$Offer;
    this.removeOffer = removeOffer;
    this.updateOffer = updateOffer;
    this.setItemAttachToSlotState = setItemAttachToSlotState;

}