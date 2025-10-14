module.exports = {
    TYPE_OBJECT: {
        HERO: "HERO",
        NPC: "NPC",
        GROUND_ITEM_COLLECTIONS: "GROUND_ITEM_COLLECTIONS"
    },
    STAT_OPERATION: {
        NUMBER_EQUAL: 'n==',
        STRING_EQUAL: 's=='
    },
    ON_FINISH_TYPE_CONNECTOR: {
        "AND": "AND",
        "OR": "OR"
    },
    ON_FINISH_TYPE: {
        REQUIRE: "require",
        ABSOLUTE_FINISH: "absoluteFinish",
        BREAK: "break"
    },
    ON_FINISH_REQUIRE: {
        HERO_LEAVE_BATTLE_BUTTON_OR_HOTKEY: "leaveBattleButtonOrHotkey",
        USE_ITEM_TPL: "useItemTpl",
        USE_BATTLE_SKILL: "useBattleSkill",
        ITEMS_IN_BASKET: "itemsInBasket",
        TALK_NPC_ID: "talkNpcId",
        ATTACK_NPC_ID: "attackNpcId",
        MOVE_REQUIRE: "moveRequire",
        ACCEPT_BASKET: "acceptBasket",
        CLICK_RECIPE_ON_LIST: "clickRecipeOnList",
        CLICK_BARTER_OFFER_ON_LIST: "clickBarterOfferOnList",
        USE_RECIPE: "useRecipe",
        USE_BARTER_OFFER: "useBarterOffer",
        CLICK_WIDGET: "clickWidget",
        OPEN_WINDOW: "openWindow",
    },
    // ON_FINISH_ABSOLUTE_FINISH: {
    //   HERO_END_BATTLE     : "heroEndBattle",
    //   CLOSE_BATTLE_WINDOW : "closeBattleWindow",
    //   START_BATTLE        : "startBattle"
    // },
    // ON_FINISH_BREAK: {
    //   CLOSE_SHOP    : "closeShop",
    //   CLOSE_BARTER    : "closeBarter",
    //   CLOSE_CRAFTING    : "closeCrafting",
    // }
    ON_FINISH_ABSOLUTE_FINISH: {
        HERO_END_BATTLE: "HERO_END_BATTLE",
        CLOSE_BATTLE_WINDOW: "CLOSE_BATTLE_WINDOW",
        START_BATTLE: "START_BATTLE"
    },
    ON_FINISH_BREAK: {
        CLOSE_SHOP: "CLOSE_SHOP",
        CLOSE_BARTER: "CLOSE_BARTER",
        CLOSE_CRAFTING: "CLOSE_CRAFTING",
    }
};