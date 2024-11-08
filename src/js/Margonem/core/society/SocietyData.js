module.exports = {
    KIND: {
        FRIEND: "f",
        ENEMY: "e",
        WANTED: "w"
    },
    STATE: {
        ONLINE: "online"
    },
    RELATION: {
        NONE: 1,
        FRIEND: 2,
        ENEMY: 3,
        CLAN: 4,
        CLAN_ALLY: 5,
        CLAN_ENEMY: 6,
        FRACTION_ALLY: 7,
        FRACTION_ENEMY: 8
    }
}

/*
case '':
kind = WhoIsHereData.NAME.NORMAL_PLAYERS;
break;
case 'fr':
kind = WhoIsHereData.NAME.FRIENDS;
break;
case 'en':
kind = WhoIsHereData.NAME.ENEMIES;
break;
case 'cl':
kind = WhoIsHereData.NAME.CLAN_MEMBERS;
break;
case 'cl-en':
kind = WhoIsHereData.NAME.CLAN_ENEMIES;
break;
case 'cl-fr':
kind = WhoIsHereData.NAME.CLAN_FRIENDS;
break;
default:
kind = WhoIsHereData.NAME.NORMAL_PLAYERS;
*/