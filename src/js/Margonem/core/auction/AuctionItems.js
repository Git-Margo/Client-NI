let AuctionData = require('core/auction/AuctionData');

module.exports = function() {

    let allFetchItems = {};

    const init = () => {
        initFetch();
        initDisableItems()
    }

    const initFetch = () => {
        Engine.items.fetch(Engine.itemsFetchData.NEW_AUCTION_ITEM, newAuctionItem);
    };

    const initDisableItems = () => {
        Engine.disableItemsManager.startSpecificItemKindDisable(Engine.itemsDisableData.AUCTION);
    };

    const checkItemExistInAllFetchItems = (itemId) => {
        return allFetchItems[itemId] ? true : false;
    };

    const newAuctionItem = (i) => {
        let itemId = i.id;
        allFetchItems[itemId] = i;

        let itemExistInFetchItem = checkItemExistInAllFetchItems(itemId);
        if (itemExistInFetchItem) attachIconToSlotProcedure(itemId);
    };

    const attachIconToSlotProcedure = (itemId) => {
        let itemData = allFetchItems[itemId];
        let oneOffer = Engine.auctions.getOneOfferByItemId(itemId);

        if (oneOffer == null) return;

        let $offer = oneOffer.get$Offer();

        attachItemDataToSlotInOffer(itemData, itemId, $offer);
        oneOffer.setItemAttachToSlotState(true)
    };

    const attachItemDataToSlotInOffer = (itemData, itemId, $offer) => {

        let $icon = Engine.items.createViewIcon(itemId, Engine.itemsViewData.AUCTION_ITEM_VIEW)[0];

        attackRightClickToToCloneItem($icon, itemData);

        $offer.find('.' + AuctionData.AUCTION_CEIL.ITEM_NAME_TD.key).html(itemData.name);
        $offer.find('.' + AuctionData.AUCTION_CEIL.ITEM_LEVEL_TD.key).html(itemData.getLvl());
        $offer.find('.' + AuctionData.AUCTION_CEIL.ITEM_SLOT_TD.key).find('.item-slot').append($icon);
    };

    const attackRightClickToToCloneItem = ($item, itemData) => {
        $item.contextmenu(function(e, mE) {
            itemData.createOptionMenu(getE(e, mE), false);
            //itemData.createOptionMenu(getE(e, mE), callback, {move: true, use: true});
        });
    };

    const getItemName = (itemId) => {
        if (!allFetchItems[itemId]) {
            errorReport('AuctionManager', 'getItemName', 'Item not exist: ' + itemId, allFetchItems);
            return '';
        }
        return allFetchItems[itemId].name
    };


    this.init = init;
    this.checkItemExistInAllFetchItems = checkItemExistInAllFetchItems;
    this.getItemName = getItemName;
    this.attachIconToSlotProcedure = attachIconToSlotProcedure;

}