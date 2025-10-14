let PRIVATE_CHAT_MESSAGE = "PRIVATE_CHAT_MESSAGE"

const BOOL = "BOOL";
const LIST = "LIST";
const OBJECT = "OBJECT";
const BITS = "BITS";
const INT = "INT";

const TABS = {
    GENERAL: "GENERAL",
    CONTROLS: "CONTROLS",
    MUSIC: "MUSIC"
};

let KEY = {
    RECEIVE_PRIVATE_CHAT_MESSAGE: 1,
    INVITATION_TO_CLAN_AND_DIPLOMACY: 2,
    TRADE_WITH_OTHERS: 3,
    TURN_BASED_COMBAT_AFTER_MONSTER_ATTACK: 4,
    INVITATION_TO_FRIENDS: 5,
    MAIL_FROM_UNKNOWN: 6,
    MOUSE_HERO_WALK: 7,
    INTERFACE_ANIMATION: 8,
    CLAN_MEMBER_ENTRY_CHAT_MESSAGE: 9,

    CYCLE_DAY_AND_NIGHT: 11,
    AUTO_GO_THROUGH_GATEWAY: 12,
    SHOW_ITEMS_RANK: 13,
    INVITATION_TO_PARTY_BEYOND_FRIENDS_AND_CLANS_AND_CLANS_ALLY: 14,
    FRIEND_ENTRY_CHAT_MESSAGE: 15,
    WEATHER_AND_EVENT_EFFECTS: 16,
    BANNERS: 17,
    ADD_OR_REMOVE_PARTY_MEMBER_CHAT_MESSAGE: 18,
    MAP_ANIMATION: 19,

    INFORM_ABOUT_FREE_PLACE_IN_BAG: 21,

    LOADER_SPLASH: 23,
    WAR_SHADOW: 24,
    AUTO_COMPARE_ITEMS: 25,
    BATTLE_EFFECTS: 26,
    AUTO_CLOSE_BATTLE: 27,
    RECEIVE_FROM_ENEMY_CHAT_MESSAGE: 28,
    ANNOUNCE_CLAN_ABOUT_LEGEND_DROP_CHAT_MESSAGE: 29,
    EXCHANGE_SAFE_MODE: 30,
    LOOT_FILTER: 32,
    KIND_OF_SHOW_LEVEL_AND_OPERATION_LEVEL: 33,
    BERSERK: 34,
    BERSERK_GROUP: 35,
};

let OPERATION_LEVEL_VARS = {
    MODE: "mode"
}

let LOOT_FILTER_VARS = {
    V: "v",
    SOLO_EQ: "soloEq",
    SOLO_LOOTBOX: "soloLootbox",
    SOLO_BAG: "soloBag",
    SOLO_GOLD: "soloGold",
    SOLO_TP: "soloTeleport",
    SOLO_TALISMAN: "soloTalisman",
    SOLO_NEUTRAL: "soloNeutral",
    SOLO_DRAGON_RUNE: "soloDragonrune",
    SOLO_CONSUMABLE: "soloConsumable",
    SOLO_IMPROVEMENT: "soloImprovement",
    SOLO_OTHER: "soloOther",
    SOLO_BY_PRICE: "soloByPrice",
    SOLO_ONLY_HIGHEST_RARITY: "soloOnlyHighestRarity",
    SOLO_AUTO_ACCEPT: "soloAutoAccept",
    SOLO_FROM_RARITY: "soloFromRarity",
    SOLO_TO_RARITY: "soloToRarity",

    GROUP_EQ: "groupEq",
    GROUP_LOOTBOX: "groupLootbox",
    GROUP_BAG: "groupBag",
    GROUP_GOLD: "groupGold",
    GROUP_TP: "groupTeleport",
    GROUP_TALISMAN: "groupTalisman",
    GROUP_NEUTRAL: "groupNeutral",
    GROUP_DRAGON_RUNE: "groupDragonrune",
    GROUP_CONSUMABLE: "groupConsumable",
    GROUP_IMPROVEMENT: "groupImprovement",
    GROUP_OTHER: "groupOther",
    GROUP_BY_PRICE: "groupByPrice",
    GROUP_ONLY_HIGHEST_RARITY: "groupOnlyHighestRarity",
    GROUP_AUTO_ACCEPT: "groupAutoAccept",
    GROUP_FROM_RARITY: "groupFromRarity",
    GROUP_TO_RARITY: "groupToRarity",
}

let BERSERK_VARS = {
    V: "v",
    LVL_MAX: "lvlmax",
    LVL_MIN: "lvlmin",
    COMMON: "common",
    ELITE: "elite",
    ELITE2: "elite2",
}

let data = {
    TABS,
    KEY,
    VARS: {
        LOOT_FILTER: LOOT_FILTER_VARS,
        OPERATION_LEVEL: OPERATION_LEVEL_VARS,
        BERSERK_VARS: BERSERK_VARS
    },
    LIST: {
        [KEY.RECEIVE_PRIVATE_CHAT_MESSAGE]: {
            type: BOOL,
            name: "RECEIVE_PRIVATE_CHAT_MESSAGE"
        },
        [KEY.INVITATION_TO_CLAN_AND_DIPLOMACY]: {
            type: BOOL,
            name: "INVITATION_TO_CLAN_AND_DIPLOMACY"
        },
        [KEY.TRADE_WITH_OTHERS]: {
            type: BOOL,
            name: "TRADE_WITH_OTHERS"
        },
        [KEY.TURN_BASED_COMBAT_AFTER_MONSTER_ATTACK]: {
            type: BOOL,
            name: "TURN_BASED_COMBAT_AFTER_MONSTER_ATTACK"
        },
        [KEY.INVITATION_TO_FRIENDS]: {
            type: BOOL,
            name: "INVITATION_TO_FRIENDS"
        },
        [KEY.MAIL_FROM_UNKNOWN]: {
            type: BOOL,
            name: "MAIL_FROM_UNKNOWN"
        },
        [KEY.MOUSE_HERO_WALK]: {
            type: BOOL,
            name: "MOUSE_HERO_WALK"
        },
        [KEY.INTERFACE_ANIMATION]: {
            type: BOOL,
            name: "INTERFACE_ANIMATION"
        },
        [KEY.CLAN_MEMBER_ENTRY_CHAT_MESSAGE]: {
            type: BOOL,
            name: "CLAN_MEMBER_ENTRY_CHAT_MESSAGE"
        },
        [KEY.CYCLE_DAY_AND_NIGHT]: {
            type: BOOL,
            name: "CYCLE_DAY_AND_NIGHT"
        },
        [KEY.AUTO_GO_THROUGH_GATEWAY]: {
            type: BOOL,
            name: "AUTO_GO_THROUGH_GATEWAY"
        },
        [KEY.SHOW_ITEMS_RANK]: {
            type: BOOL,
            name: "SHOW_ITEMS_RANK"
        },
        [KEY.INVITATION_TO_PARTY_BEYOND_FRIENDS_AND_CLANS_AND_CLANS_ALLY]: {
            type: BOOL,
            name: "INVITATION_TO_PARTY_BEYOND_FRIENDS_AND_CLANS_AND_CLANS_ALLY"
        },
        [KEY.FRIEND_ENTRY_CHAT_MESSAGE]: {
            type: BOOL,
            name: "FRIEND_ENTRY_CHAT_MESSAGE"
        },
        [KEY.WEATHER_AND_EVENT_EFFECTS]: {
            type: BOOL,
            name: "WEATHER_AND_EVENT_EFFECTS"
        },
        [KEY.BANNERS]: {
            type: BOOL,
            name: "BANNERS"
        },
        [KEY.ADD_OR_REMOVE_PARTY_MEMBER_CHAT_MESSAGE]: {
            type: BOOL,
            name: "ADD_OR_REMOVE_PARTY_MEMBER_CHAT_MESSAGE"
        },
        [KEY.MAP_ANIMATION]: {
            type: BOOL,
            name: "MAP_ANIMATION"
        },
        [KEY.INFORM_ABOUT_FREE_PLACE_IN_BAG]: {
            type: BOOL,
            name: "INFORM_ABOUT_FREE_PLACE_IN_BAG"
        },
        [KEY.LOADER_SPLASH]: {
            type: BOOL,
            name: "LOADER_SPLASH"
        },
        [KEY.WAR_SHADOW]: {
            type: BOOL,
            name: "WAR_SHADOW"
        },
        [KEY.AUTO_COMPARE_ITEMS]: {
            type: BOOL,
            name: "AUTO_COMPARE_ITEMS"
        },
        [KEY.BATTLE_EFFECTS]: {
            type: BOOL,
            name: "BATTLE_EFFECTS"
        },
        [KEY.AUTO_CLOSE_BATTLE]: {
            type: BOOL,
            name: "AUTO_CLOSE_BATTLE"
        },
        [KEY.RECEIVE_FROM_ENEMY_CHAT_MESSAGE]: {
            type: BOOL,
            name: "RECEIVE_FROM_ENEMY_CHAT_MESSAGE"
        },
        [KEY.ANNOUNCE_CLAN_ABOUT_LEGEND_DROP_CHAT_MESSAGE]: {
            type: BOOL,
            name: "ANNOUNCE_CLAN_ABOUT_LEGEND_DROP_CHAT_MESSAGE"
        },
        [KEY.EXCHANGE_SAFE_MODE]: {
            type: BOOL,
            name: "EXCHANGE_SAFE_MODE"
        },
        [KEY.KIND_OF_SHOW_LEVEL_AND_OPERATION_LEVEL]: {
            type: OBJECT,
            name: "KIND_OF_SHOW_LEVEL_AND_OPERATION_LEVEL",
            object: {
                [OPERATION_LEVEL_VARS.MODE]: {
                    type: LIST,
                    list: [{
                        val: "level|operation_level"
                    }, {
                        val: "operation_level|level"
                    }, {
                        val: "only_operation_level"
                    }, {
                        val: "only_level"
                    }]
                }
            }
        },
        [KEY.BERSERK]: {
            type: OBJECT,
            name: "BERSERK",
            object: {
                [BERSERK_VARS.V]: {
                    type: BOOL,
                    labelTip: true
                },
                [BERSERK_VARS.COMMON]: {
                    type: BOOL,
                    labelTip: true
                },
                [BERSERK_VARS.ELITE]: {
                    type: BOOL,
                    labelTip: true
                },
                [BERSERK_VARS.ELITE2]: {
                    type: BOOL,
                    labelTip: true
                },
                [BERSERK_VARS.LVL_MIN]: {
                    type: INT,
                    min: -50,
                    max: 13,
                    labelTip: true
                },
                [BERSERK_VARS.LVL_MAX]: {
                    type: INT,
                    min: -50,
                    max: 13
                },
            }
        },
        [KEY.BERSERK_GROUP]: {
            type: OBJECT,
            name: "BERSERK_GROUP",
            object: {
                [BERSERK_VARS.V]: {
                    type: BOOL,
                    labelTip: true
                },
                [BERSERK_VARS.COMMON]: {
                    type: BOOL,
                    labelTip: true
                },
                [BERSERK_VARS.ELITE]: {
                    type: BOOL,
                    labelTip: true
                },
                [BERSERK_VARS.ELITE2]: {
                    type: BOOL,
                    labelTip: true
                },
                [BERSERK_VARS.LVL_MIN]: {
                    type: INT,
                    min: -50,
                    max: 13,
                    labelTip: true
                },
                [BERSERK_VARS.LVL_MAX]: {
                    type: INT,
                    min: -50,
                    max: 13
                },
            }
        },
        [KEY.LOOT_FILTER]: {
            type: OBJECT,
            name: "LOOT_FILTER",
            object: {
                [LOOT_FILTER_VARS.V]: {
                    type: BOOL
                },
                [LOOT_FILTER_VARS.SOLO_EQ]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.SOLO_LOOTBOX]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.SOLO_BAG]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.SOLO_GOLD]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, null, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.SOLO_TP]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.SOLO_TALISMAN]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.SOLO_NEUTRAL]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.SOLO_DRAGON_RUNE]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.SOLO_CONSUMABLE]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.SOLO_IMPROVEMENT]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.SOLO_OTHER]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }],
                    labelTip: true
                },
                [LOOT_FILTER_VARS.SOLO_BY_PRICE]: {
                    type: INT,
                    min: 0,
                    max: 100000000
                },
                [LOOT_FILTER_VARS.SOLO_ONLY_HIGHEST_RARITY]: {
                    type: BOOL
                },
                [LOOT_FILTER_VARS.SOLO_AUTO_ACCEPT]: {
                    type: BITS,
                    bits: ["battle", "npc", "lootbox"]
                },
                [LOOT_FILTER_VARS.SOLO_FROM_RARITY]: {
                    type: LIST,
                    list: [{
                        val: "unique"
                    }, {
                        val: "heroic"
                    }, {
                        val: "upgraded"
                    }, {
                        val: "legendary"
                    }],
                    labelTip: true
                },
                [LOOT_FILTER_VARS.SOLO_TO_RARITY]: {
                    type: LIST,
                    list: [{
                        val: "common"
                    }, {
                        val: "unique"
                    }, {
                        val: "heroic"
                    }, {
                        val: "upgraded"
                    }, {
                        val: "legendary"
                    }],
                    labelTip: true
                },


                [LOOT_FILTER_VARS.GROUP_EQ]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.GROUP_LOOTBOX]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.GROUP_BAG]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.GROUP_GOLD]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, null, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.GROUP_TP]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.GROUP_TALISMAN]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.GROUP_NEUTRAL]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.GROUP_DRAGON_RUNE]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.GROUP_CONSUMABLE]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.GROUP_IMPROVEMENT]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }]
                },
                [LOOT_FILTER_VARS.GROUP_OTHER]: {
                    type: LIST,
                    list: [{
                        val: "catch_all"
                    }, {
                        val: "catch_to_val"
                    }, {
                        val: "refuse_all",
                        isRed: true
                    }],
                    labelTip: true
                },
                [LOOT_FILTER_VARS.GROUP_BY_PRICE]: {
                    type: INT,
                    min: 0,
                    max: 100000000
                },
                [LOOT_FILTER_VARS.GROUP_ONLY_HIGHEST_RARITY]: {
                    type: BOOL
                },
                [LOOT_FILTER_VARS.GROUP_AUTO_ACCEPT]: {
                    type: BITS,
                    bits: ["battle", null, null]
                },
                [LOOT_FILTER_VARS.GROUP_FROM_RARITY]: {
                    type: LIST,
                    list: [{
                        val: "unique"
                    }, {
                        val: "heroic"
                    }, {
                        val: "upgraded"
                    }, {
                        val: "legendary"
                    }],
                    labelTip: true
                },
                [LOOT_FILTER_VARS.GROUP_TO_RARITY]: {
                    type: LIST,
                    list: [{
                        val: "common"
                    }, {
                        val: "unique"
                    }, {
                        val: "heroic"
                    }, {
                        val: "upgraded"
                    }, {
                        val: "legendary"
                    }],
                    labelTip: true
                },
            }
        }
    }
};


module.exports = data