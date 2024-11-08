var ItemData = require('core/items/data/ItemData');

module.exports = new(function() {


    this.isBlessSt = function(st) {
        return (st === ItemData.ST.BLESS);
    };

    this.isWeaponShieldOrArrowSt = function(st) {
        return (st === ItemData.ST.WEAPON_SHIELD_OR_ARROW);
    };

    this.isPurseSt = (st) => {
        return st == ItemData.ST.PURSE;
    };

    this.isBagSlotSt = (st) => {
        return st >= ItemData.ST.BAG_0_SLOT && st <= ItemData.ST.BAG_KEYS_SLOT;
    };

    this.isBag_0_SlotSt = (st) => {
        return st == ItemData.ST.BAG_0_SLOT
    };

    this.isBag_Keys_SlotSt = (st) => {
        return st == ItemData.ST.BAG_KEYS_SLOT
    };

    this.isInBagSt = (st) => {
        return st == ItemData.ST.IN_BAG;
    };

    this.isInBagOrInEquipNotBagsSlotsSt = (st) => {
        return st >= ItemData.ST.IN_BAG && st <= ItemData.ST.BLESS;
    }

    this.isEquippedButNotPurseNotBlessNotBagsSlotsSt = (st) => {
        return st && st > 0 && st <= 8;
    };

    this.isEquippedSt = (st) => {
        return st > ItemData.ST.IN_BAG;
    }


})