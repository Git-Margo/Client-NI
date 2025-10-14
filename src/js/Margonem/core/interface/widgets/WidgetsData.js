let NEWS = "NEWS";
let REWARDS_CALENDAR = "REWARDS_CALENDAR"
let o = {
    name: {
        EXIT: 'exit',
        //HELP: 'keyboard',
        SETTINGS: 'config',
        FULL_SCREEN: 'windows',
        REFRESH_PAGE: 'refreshPage',
        ADDONS: 'puzzle',
        CLAN: 'clans',
        MAP: 'globe',
        PARTY: 'party',
        CHAT: 'chat',
        CRAFTING: 'photo',
        MINI_MAP: 'portable-map-icon',
        WHO_IS_HERE: 'compass',
        PREMIUM: 'star',
        SKILLS: 'skills',
        COMMUNITY: 'friends',
        QUEST_LOG: 'scroll',
        PICK_UP_ITEM: 'drag-item-icon',
        ATTACK_MOB: 'attack-near-mob',
        ATTACK_PLAYER: 'attack-near-player',
        TALK: 'npc-talk-icon',
        BATTLE_LOG: 'fight-log',
        EQ_TOGGLE: 'eq-show-icon',
        ATTACK_MOB_AUTO: 'auto-fight-near-mob',
        USE_DOOR: 'go-gateway',
        QUICK_PARTY: 'quick-party',
        CONSOLE: 'console',
        CLAN_MSG: 'send-clan-msg',
        [NEWS]: 'news-icon',
        BATTLE_PASS: 'battle-pass-widget-icon',

        MATCHMAKING: 'matchmaking-icon',
        [REWARDS_CALENDAR]: 'rewards-calendar',
        ZOOM: 'zoom-in-out-panel',
        PAD: 'padController',
        WORLD: 'world-icon',
        LOOT_FILTER: "loot-filter-icon",


        addon_1: 'addon_1',
        addon_5: 'addon_5',
        addon_12: 'addon_12',
        addon_17: 'addon_17',
        addon_19: 'addon_19',
        addon_20: 'addon_20',
        addon_21: 'addon_21',
        addon_24: 'addon_24',
        addon_25: 'addon_25',
        addon_27: 'addon_27',
        LEGENDARY_NOTIFICATOR_SETTINGS: "LEGENDARY_NOTIFICATOR_SETTINGS",

    },
    notice: {
        //[NEWS]: 				      {nameWidget:[NEWS], nameNotice: 1},
        //[REWARDS_CALENDAR]: 	{nameWidget:[REWARDS_CALENDAR], nameNotice: 2, alwaysAvailable: false}
    },
    IN_WINDOW: 'in-window',
    pos: {
        TOP_LEFT: 'top-left',
        TOP_RIGHT: 'top-right',
        BOTTOM_LEFT: 'bottom-left',
        BOTTOM_RIGHT: 'bottom-right',
        BOTTOM_RIGHT_ADDITIONAL: 'bottom-right-additional',
        BOTTOM_LEFT_ADDITIONAL: 'bottom-left-additional',
        TOP_RIGHT_ADDITIONAL: 'top-right-additional',
        TOP_LEFT_ADDITIONAL: 'top-left-additional'

    },
    type: {
        RED: 'red',
        GREEN: 'green',
        VIOLET: 'violet',
        BLINK_VIOLET: 'blink-violet',
        BLUE: 'blue',
        DISABLED: 'disabled'
    },
    attr: {
        WIDGET_INDEX: 'widget-index',
        WIDGET_NAME: 'widget-name',
        WIDGET_POS: 'widget-pos'
    },
    data: {
        WIDGET_KEY: 'widgetKey'
    }
}

o.notice[NEWS] = {
        nameWidget: o.name[NEWS],
        nameNotice: 1
    },
    o.notice[REWARDS_CALENDAR] = {
        nameWidget: o.name[REWARDS_CALENDAR],
        nameNotice: 2,
        alwaysAvailable: false
    },

    module.exports = o;