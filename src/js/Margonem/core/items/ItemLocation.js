let ItemData = require('@core/items/data/FetchData');

module.exports = new(function() {

    this.isEquipItemLoc = (loc) => {
        return loc == Engine.itemsFetchData.NEW_EQUIP_ITEM.loc;
    }

    this.isAuctionItemLoc = (loc) => {
        return loc == Engine.itemsFetchData.NEW_AUCTION_ITEM.loc
    }

    this.isGroundItemLoc = (loc) => {
        return loc == Engine.itemsFetchData.NEW_GROUND_ITEM.loc
    }

    this.isPrivateDepoItemLoc = (loc) => {
        return loc == Engine.itemsFetchData.NEW_PRIVATE_DEPO_ITEM.loc
    }

    this.isClanDepoItemLoc = (loc) => {
        return loc == Engine.itemsFetchData.NEW_CLAN_DEPO_ITEM.loc
    }

    this.isRecoveryItemLoc = (loc) => {
        return loc == Engine.itemsFetchData.NEW_RECOVERY_ITEM.loc
    }

    this.isMailItemLoc = (loc) => {
        return loc == Engine.itemsFetchData.NEW_MAIL_ITEM.loc;
    }

    this.isOtherEqItemLoc = (loc) => {
        return loc == Engine.itemsFetchData.NEW_OTHER_EQ_ITEM.loc
    }

    this.isPromoItemLoc = (loc) => {
        return loc == Engine.itemsFetchData.NEW_PROMO_ITEM.loc
    }

})