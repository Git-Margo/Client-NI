var SocietyData = require('@core/society/SocietyData');

module.exports = {
    TYPE: {
        NPC: 'npc',
        RESP: 'resp',
        OTHER: 'other',
        RIP: 'rip',
        GATEWAY: 'gateway',
        ITEM: 'item',
        HERO: 'hero',
    },
    KIND: {
        HERO: 'hero',

        GATEWAY: 'gateway',

        RIP: 'rip',
        HEROES_RESP: 'heroes-resp',
        HEROES_RESP_E: 'heroes-resp-e',
        TITAN_RESP: 'titan-resp',

        RECOVERY: 'recovery',

        NPCS: 'npcs',
        NORMAL_MONSTER: 'normal-monster',
        ELITE_1: 'elita1',
        ELITE_2: 'elita2',
        ELITE_3: 'elita3',
        HEROS: 'heros',
        COLOSSUS: 'colossus',
        TYTAN: 'tytan',

        MARK_OBJECT: 'mark-object',
        NORMAL_OTHER: 'normal-other',

        FRIEND: 'fr',
        ENEMY: 'en',
        CLAN: 'cl',
        CLAN_FRIEND: 'cl-fr',
        CLAN_ENEMY: 'cl-en',

        //FRIEND: SocietyData.RELATION.FRIEND,
        //ENEMY: SocietyData.RELATION.ENEMY,
        //CLAN: SocietyData.RELATION.CLAN,
        //CLAN_FRIEND: SocietyData.RELATION.CLAN_ALLY,
        //CLAN_ENEMY : SocietyData.RELATION.CLAN_ENEMY,


        GROUP: 'group',
        WANTED: 'wanted'


    },
    STATIC_ICONS: {
        CIRCLE: 1,
        SQUARE: 0,
        RHOMB: 2
    },
    MIN_SQUARE: 14,
    MIN_SIZE: 7,
    //DEFAULT_MIN_LEVEL: 0,
    //DEFAULT_DATA_DRAWER_WIDTH: 96,
    //DEFAULT_DATA_DRAWER_FONT_SIZE: 10,


    MIN_LEVEL_DATA: {
        KEY: "min-level",
        DEFAULT: 0,
        MIN: 0,
        MAX: 300
    },
    DATA_DRAWER_WIDTH_DATA: {
        KEY: "data-drawer-width",
        DEFAULT: mobileCheck() ? 128 : 96,
        MIN: 32,
        MAX: 128
    },
    DATA_DRAWER_FONT_SIZE_DATA: {
        KEY: "data-drawer-font-size",
        DEFAULT: mobileCheck() ? 13 : 10,
        MIN: 8,
        MAX: 16
    }

}