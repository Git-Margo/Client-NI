let o = {
    // items
    NEW_INVENTORY_ITEM: {
        loc: 'g'
    },
    NEW_BUILD_ITEM: {
        loc: 'g'
    },
    NEW_BOTTOM_ITEM: {
        loc: 'g'
    },
    ITEM_IN_REPLENISHMENT_ARROWS: {
        loc: 'g'
    },
    NEW_OUTFIT_ITEM: {
        loc: 'g'
    },
    NEW_EQUIP_ITEM: {
        loc: 'g'
    },
    NEW_BATTLE_SET_EQ_ITEM: {
        loc: 'g'
    },
    NEW_AUCTION_ITEM: {
        loc: 'a'
    },
    NEW_NORMAL_LOOT_ITEM: {
        loc: 'l'
    },
    NEW_PERSONAL_LOOT_ITEM: {
        loc: 'k'
    },
    NEW_GROUND_ITEM: {
        loc: 'm'
    },
    NEW_MINI_MAP_GROUND_ITEM: {
        loc: 'm'
    },
    NEW_PROMO_ITEM: {
        loc: '$'
    },
    NEW_PRIVATE_DEPO_ITEM: {
        loc: 'd'
    },
    NEW_CLAN_DEPO_ITEM: {
        loc: 'c'
    },
    NEW_QUEST_REWARD_ITEM: {
        loc: 'q'
    },
    NEW_RECOVERY_ITEM: {
        loc: 'r'
    },
    NEW_REGISTRATION_ITEM: {
        loc: 'e'
    },
    NEW_OTHER_EQ_ITEM: {
        loc: 'otherEqItem'
    },
    NEW_TRADE_ITEM_T: {
        loc: 't'
    },
    NEW_TRADE_ITEM_S: {
        loc: 's'
    },
    NEW_ENHANCEMENT_RECEIVED_ITEM: {
        loc: 'u'
    },
    NEW_EXTRACTION_RECEIVED_ITEM: {
        loc: 'j'
    },
    NEW_MAIL_ITEM: {
        loc: 'b'
    },
    NEW_CHAT_LINKED_ITEM: {
        loc: 'C'
    },
    // NEW_BASKET_ITEM_1               : {loc: 'g'},
    // NEW_BASKET_ITEM_2               : {loc: 'g'},


    // tpls
    NEW_CHAT_LINKED_TPL: {
        loc: 'C'
    },
    NEW_TPL_PREVIEW: {
        loc: 'p'
    },
    NEW_OPEN_TPL: {
        loc: 's'
    },
    NEW_SEASON_TPL: {
        loc: 'r'
    },
    NEW_SEASON_REWARD_TPL: {
        loc: 'i'
    },
    NEW_PROGRESS_TPL: {
        loc: 'd'
    },
    M_ALERT_TPL: {
        loc: false
    },
    NEW_PACK_TPL: {
        loc: 'o'
    },
    NEW_BLESS_TPL: {
        loc: 'b'
    },
    NEW_BARTER_TPL: {
        loc: 'f'
    },
    NEW_BATTLE_PASS_TPL: {
        loc: 'B'
    },
    NEW_BATTLE_SUMMARY_TPL: {
        loc: 'd'
    },
    NEW_REWARD_CALENDAR_TPL: {
        loc: 'v'
    },
    NEW_BRING_CLAN_QUEST_TPL: {
        loc: 'q'
    },
    NEW_UPGRADE_REQUIRE_TPL: {
        loc: 'u'
    },
    NEW_SALVAGE_RECEIVED_TPL: {
        loc: 'h'
    },
    NEW_EXTRACTION_RECEIVED_TPL: {
        loc: 'j'
    },
    NEW_BONUS_RESELECT_COST_TPL: {
        loc: 'w'
    },
    NEW_SHOP_TPL: {
        loc: 'n'
    },
    NEW_BASKET_TPL: {
        loc: 'n'
    },
    NEW_CRAZY_TPL_SHOP_CHEST: {
        loc: 'n'
    },
    NEW_CRAZY_TPL_SHOP_PROMO: {
        loc: 'n'
    },
    NEW_RECIPE_TPL: {
        loc: 'c'
    },
    NEW_RECIPE_INGREDIENT_TPL: {
        loc: 'c'
    },


    // addons items
    FETCH_NEW_LOOT: {
        loc: 'l'
    },
    FETCH_NEW_PERSONAL_LOOT_ITEM: {
        loc: 'k'
    },
    FETCH_NEW_LOOT_ITEM: {
        loc: 'l'
    },
    FETCH_WATCH_ITEM: {
        loc: 'm'
    },
    FETCH_NEW_ITEM: {
        loc: 'g'
    },
    FETCH_CHECK_IF_TP_ITEM: {
        loc: 'g'
    },

}

for (let k in o) {
    o[k].k = k;
}

module.exports = o;