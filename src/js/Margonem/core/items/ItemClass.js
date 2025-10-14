let ItemData = require('@core/items/data/ItemData');

module.exports = new(function() {

    this.isWeaponCl = (cl) => {
        return cl > 0 && cl < ItemData.CL.DISTANCE_WEAPON;
    }

    this.isMagicWeaponCl = (cl) => {
        // return cl > ItemData.CL.HELP_WEAPON && cl < ItemData.CL.ARMOR;
        return cl == ItemData.CL.WAND_WEAPON;
    }

    this.isNeutralCl = (cl) => {
        return cl == ItemData.CL.NEUTRAL;
    }

    this.isBagCl = (cl) => {
        return cl == ItemData.CL.BAG;
    }

    this.isConsumeCl = (cl) => {
        return cl == ItemData.CL.CONSUME;
    }

    this.isEquipCl = (cl) => {
        return (ItemData.CL.ONE_HAND_WEAPON <= cl && cl <= ItemData.CL.SHIELD) || cl === ItemData.CL.QUIVER;
    }

    this.isNotEquipClWithoutBlessCl = (cl) => {
        return cl > ItemData.CL.SHIELD && !this.isArrowsCl(cl);
    }

    this.isNotEquipCl = (cl) => {
        return cl > ItemData.CL.SHIELD && cl != ItemData.CL.BLESS && !this.isArrowsCl(cl);
    }

    this.isArrowsCl = (cl) => {
        return cl == ItemData.CL.QUIVER;
    }

    this.isGoldCl = (cl) => {
        return cl == ItemData.CL.GOLD;
    }

    this.isQuestCl = (cl) => {
        return cl == ItemData.CL.QUEST;
    }

    this.isBlessCl = (cl) => {
        return cl == ItemData.CL.BLESS;
    }

    this.isUpgradeCl = (cl) => {
        return cl == ItemData.CL.UPGRADE;
    }

    this.isRecipeCl = (cl) => {
        return cl == ItemData.CL.RECIPE;
    }

    this.isOutfitCl = (cl) => {
        return cl == ItemData.CL.OUTFITS;
    }

    this.isPetCl = (cl) => {
        return cl == ItemData.CL.PETS;
    }

    this.isCurrencyCl = (cl) => {
        return cl == ItemData.CL.COINAGE;
    }

    this.isShowPreviewItemInShop = (cl) => {
        return this.isOutfitCl(cl) || this.isPetCl(cl);
    }

    this.canAddToBottomPanel = (cl) =>
        cl === ItemData.CL.CONSUME ||
        cl === ItemData.CL.OUTFITS ||
        cl === ItemData.CL.PETS ||
        cl === ItemData.CL.TELEPORTS;
});