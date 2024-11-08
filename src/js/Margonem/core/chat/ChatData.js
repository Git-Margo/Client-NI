let moduleData = {
    fileName: "ChatData.js"
};

let o = {
    CHANNEL: null,
    CHANNEL_CARDS: null,
    SERVER_CHANNEL: null,
    INPUT_CHANNEL_HEADER: null,
    INPUT_REGEXP: null,
    CHANNEL_INPUT_DATA: null,
    MESSAGE_SECTIONS_VISIBLE: null,
    MESSAGE_SECTIONS: null,
    MESSAGE_SUB_SECTIONS: null,
    MESSAGE_LINK_REGEXP: null,
    MESSAGE_MARK_REGEXP_KINDS: null,
    MESSAGE_MARK_REGEXP: null,
    SYSTEM_MESSAGE_MARK_REGEXP: null,
    NOTIFICATION: null,
    AVAILABLE: null,
    MESSAGES_ADD_TO_GENERAL: null,
    STATIC_KEYS: null,
    SERVER_STORAGE: null
};

let TS = "TS";
let CHANNEL_TAG = "CHANNEL_TAG";
let EMO_ICON = "EMO_ICON";

let DISPLAY = "DISPLAY";
let ALL_TAG = "ALL_TAG";
let TWELVE_HOUR = "TWELVE_HOUR";
let ALL_UNIT = "ALL_UNIT";

let ADD = "ADD";
let EDIT_COLOR = "EDIT_COLOR"

o.SERVER_STORAGE = {
    VISIBLE: "VISIBLE",
    CHANNEL: "CHANNEL",
    DATA: "DATA"
}

o.SERVER_STYLE = {
    ME: 2,
    TOWN: 7
}

o.STYLE = {
    SPECIAL: 'special',
    NAR: 'nar',
    ME: 'me'
};

o.STATIC_KEYS = {
    MESSAGES_ADD_TO_GENERAL: "MESSAGES_ADD_TO_GENERAL",
    MESSAGES_COLORS: "MESSAGES_COLORS"
};

o.NOTIFICATION = {
    WATCH: "WATCH",
    WARNING: "WARNING",
    MUTE: "MUTE"

}

o.LINK_TYPES = {
    PLAYER_PROFILE: 'player-profile',
    CLAN_PROFILE: 'clan-profile',
}

o.CHANNEL = {
    GENERAL: "GENERAL",
    GLOBAL: "GLOBAL",
    LOCAL: "LOCAL",
    TRADE: "TRADE",
    GROUP: "GROUP",
    CLAN: "CLAN",
    SYSTEM: "SYSTEM",
    PRIVATE: "PRIVATE",
    COMMERCIAL: "COMMERCIAL"
}


o.CHANNEL_CARDS = {
    GENERAL: "GENERAL",
    GLOBAL: "GLOBAL",
    LOCAL: "LOCAL",
    TRADE: "TRADE",
    GROUP: "GROUP",
    CLAN: "CLAN",
    SYSTEM: "SYSTEM",
    PRIVATE: "PRIVATE",
}


o.MESSAGES_ADD_TO_GENERAL_OPT = {
    [ADD]: ADD
};

o.MESSAGES_COLORS_OPT = {
    [EDIT_COLOR]: EDIT_COLOR
};

o.SERVER_CHANNEL = {
    [o.CHANNEL.LOCAL]: 'local',
    [o.CHANNEL.GLOBAL]: 'global',
    [o.CHANNEL.TRADE]: 'trade',
    [o.CHANNEL.GROUP]: 'party',
    [o.CHANNEL.CLAN]: 'clan',
    [o.CHANNEL.SYSTEM]: 'system',
    [o.CHANNEL.PRIVATE]: 'personal',
    [o.CHANNEL.COMMERCIAL]: 'commercial',
};

o.KIND_MESSAGE_COLOR = {
    HERO_MSG_COLOR: "HERO_MSG_COLOR",
    OTHER_MSG_COLOR: "OTHER_MSG_COLOR",
}

o.MESSAGES_ADD_TO_GENERAL = {
    [o.CHANNEL.GLOBAL]: {
        [o.MESSAGES_ADD_TO_GENERAL_OPT.ADD]: true
    },
    [o.CHANNEL.LOCAL]: {
        [o.MESSAGES_ADD_TO_GENERAL_OPT.ADD]: true
    },
    [o.CHANNEL.TRADE]: {
        [o.MESSAGES_ADD_TO_GENERAL_OPT.ADD]: true
    },
    [o.CHANNEL.GROUP]: {
        [o.MESSAGES_ADD_TO_GENERAL_OPT.ADD]: true
    },
    [o.CHANNEL.CLAN]: {
        [o.MESSAGES_ADD_TO_GENERAL_OPT.ADD]: true
    },
    [o.CHANNEL.SYSTEM]: {
        [o.MESSAGES_ADD_TO_GENERAL_OPT.ADD]: true
    },
    [o.CHANNEL.PRIVATE]: {
        [o.MESSAGES_ADD_TO_GENERAL_OPT.ADD]: true
    },
    [o.CHANNEL.COMMERCIAL]: {
        [o.MESSAGES_ADD_TO_GENERAL_OPT.ADD]: true
    }
}

o.MESSAGES_COLORS = {
    [o.CHANNEL.GLOBAL]: {
        [o.MESSAGES_COLORS_OPT.EDIT_COLOR]: {
            edit: true
        }
    },
    [o.CHANNEL.LOCAL]: {
        [o.MESSAGES_COLORS_OPT.EDIT_COLOR]: {
            edit: true
        }
    },
    [o.CHANNEL.TRADE]: {
        [o.MESSAGES_COLORS_OPT.EDIT_COLOR]: {
            edit: true
        }
    },
    [o.CHANNEL.GROUP]: {
        [o.MESSAGES_COLORS_OPT.EDIT_COLOR]: {
            edit: true
        }
    },
    [o.CHANNEL.CLAN]: {
        [o.MESSAGES_COLORS_OPT.EDIT_COLOR]: {
            edit: true
        }
    },
    [o.CHANNEL.SYSTEM]: {
        [o.MESSAGES_COLORS_OPT.EDIT_COLOR]: {
            edit: true
        }
    },
    [o.CHANNEL.PRIVATE]: {
        [o.MESSAGES_COLORS_OPT.EDIT_COLOR]: {
            edit: true,
            saveApart: true
        }
    },
    [o.CHANNEL.COMMERCIAL]: {
        [o.MESSAGES_COLORS_OPT.EDIT_COLOR]: {
            edit: false
        }
    }
}

o.MESSAGE_SECTIONS = {
    [TS]: TS,
    [CHANNEL_TAG]: CHANNEL_TAG,
    [EMO_ICON]: EMO_ICON
};
o.MESSAGE_SUB_SECTIONS = {
    [DISPLAY]: DISPLAY,
    [TWELVE_HOUR]: TWELVE_HOUR,
    [ALL_UNIT]: ALL_UNIT,
    [ALL_TAG]: ALL_TAG
};
o.MESSAGE_SECTIONS_VISIBLE = {
    [TS]: {
        [o.MESSAGE_SUB_SECTIONS.DISPLAY]: true,
        [o.MESSAGE_SUB_SECTIONS.TWELVE_HOUR]: false,
        [o.MESSAGE_SUB_SECTIONS.ALL_UNIT]: false
    },
    [CHANNEL_TAG]: {
        [o.MESSAGE_SUB_SECTIONS.DISPLAY]: true,
        [o.MESSAGE_SUB_SECTIONS.ALL_TAG]: true
    },
    [EMO_ICON]: {
        [o.MESSAGE_SUB_SECTIONS.DISPLAY]: false
    }
}

o.MESSAGE_LINK_REGEXP = {
    PROFILE: {
        linkType: o.LINK_TYPES.PLAYER_PROFILE,
        getText: function() {
            return '[' + _t('player_profile') + ']'
        },
        style: '{"color":"#008000","font-weight": "bold"}',
        htmlClass: 'chat-message-profile-link',
        getTip: function() {
            return _t('player_profile')
        },
        getPattern: function() {
            //let link = isPl() ? 'www.margonem.pl' : 'margonem.com';

            //if (isPl()) return new RegExp('^https:\/\/www.margonem.pl\/profile\/view\,([0-9]+)\#char\_([0-9]+)\,([a-zA-Z]+)', "g")
            if (isPl()) return new RegExp('^https:\/\/www.margonem.pl\/profile\/view\,([0-9]+)($|\\s|\&nbsp;|\#char\_([0-9]+)\,([a-zA-Z]+))', "g")
            else return new RegExp('^https:\/\/margonem.com\/profile\/view,([0-9]+)($|\\s|\#char\_([0-9]+)($|\\s|,([a-zA-Z]+)($|\\s)))', "g")

            //return new RegExp('https:\/\/' + link + '\/profile\/view\,([0-9]+)\#char\_([0-9]+)\,([a-zA-Z]+)', "g")
        }
    },
    CLAN_PROFILE: {
        linkType: o.LINK_TYPES.CLAN_PROFILE,
        getText: function() {
            return '[' + getEngine().chatController.chatLang('clanProfile') + ']'
        },
        style: '{"color":"#ee82ee","font-weight": "bold"}',
        htmlClass: 'chat-message-clan-link',
        getTip: function() {
            return _t('clan_page', null, 'clan');
        },
        getPattern: function() {
            let link = isPl() ? 'www.margonem.pl' : 'margonem.com';
            return new RegExp('^https:\/\/' + link + '\/guilds\/view\,([a-zA-Z]+)\,([0-9]+)', "g")

            //https://www.margonem.pl/guilds/view,Katahha,11231
        }
    }
}

function getStyleIcon(url, width) {
    width = width ? width : '15px';

    return '{"width": "' + width + '", "height": "15px", "display": "inline-block", "vertical-align": "middle", "background": "url(' + url + ')"}';
}

function getEmoIconStyle(name, width) {
    return getStyleIcon(CFG.a_imgpath + "emots/" + name + ".gif", width);
}

o.MESSAGE_MARK_REGEXP_KINDS = {
    NORMAL: "NORMAL",
    TEST: "TEST",
    EMO_ICON: "EMO_ICON"
};

o.MESSAGE_MARK_REGEXP = {
    "8p": {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("8p"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:p', "ig")
        }
    },
    aww: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("aww"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:ahh', "ig")
        }
    },
    biggrin_0: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("biggrin"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\;d', "ig")
        }
    },
    biggrin_1: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("biggrin"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:d', "ig")
        }
    },
    blush_0: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("blush"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\;wstydnis', "ig")
        }
    },
    blush_1: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("blush"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:wstydnis', "ig")
        }
    },
    boogie: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("blush"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:tanczy', "ig")
        }
    },
    crying: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        //style       : getEmoIconStyle("crying"),
        style: getEmoIconStyle("crying", '25px'),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\;\\(', "ig")
        }
    },
    doh: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("doh"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('x\\|', "ig")
        }
    },
    eek: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("eek"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:\\|', "ig")
        }
    },
    evileye_0: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("evileye"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\;\>', "ig")
        }
    },
    evileye_1: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("evileye"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:\>', "ig")
        }
    },
    evillaugh_0: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        //style       : getEmoIconStyle("evillaugh"),
        style: getEmoIconStyle("crying", '19px'),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\]\:\-\>', "ig")
        }
    },
    evillaugh_1: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        //style       : getEmoIconStyle("evillaugh"),
        style: getEmoIconStyle("crying", '19px'),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\]\;\-\>', "ig")
        }
    },
    //hmm: {
    //    kind        : o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
    //    text        : "",
    //    style       : getEmoIconStyle("hmm"),
    //    dynamicMark : false,
    //    getPattern  : function () {return new RegExp('\:\\', "ig")}
    //},
    kiss_0: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("kiss"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:\\*', "ig")
        }
    },
    kiss_1: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("kiss"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\;\\*', "ig")
        }
    },
    lol_0: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("lol"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\;\\)\\)\\)', "ig")
        }
    },
    lol_1: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("lol"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:\\)\\)\\)', "ig")
        }
    },
    mad_0: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("mad"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:x', "ig")
        }
    },
    mad_1: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("mad"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\;x', "ig")
        }
    },
    o_o_0: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("o_o"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\;o', "ig")
        }
    },
    o_o_1: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("o_o"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:o', "ig")
        }
    },
    oops: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("oops"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:oops', "ig")
        }
    },
    razz: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("razz"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\;p', "ig")
        }
    },
    rotfl: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        //style       : getEmoIconStyle("rotfl"),
        style: getEmoIconStyle("rotfl", '71px'),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:rotfl', "ig")
        }
    },
    sad: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("sad"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:\\(', "ig")
        }
    },
    smile: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("smile"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:\\)', "ig")
        }
    },
    smirk_0: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("smirk"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:\\]', "ig")
        }
    },
    smirk_1: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("smirk"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\;\\]', "ig")
        }
    },
    thanks: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("thanks"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:thx', "ig")
        }
    },
    upset: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("upset"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:\\/', "ig")
        }
    },
    wink: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("wink"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\;\\)', "ig")
        }
    },
    xd: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("xd"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('xd', "ig")
        }
    },
    zombie: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON,
        text: "",
        style: getEmoIconStyle("zombie"),
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('\:zombie', "ig")
        }
    },
    ASD: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.TEST,
        text: "[ASD]",
        style: '{"color":"yellow"}',
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('ASD([0-9]{3})', "g")
        }
    },
    QWE: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.TEST,
        text: "[QWE]",
        style: '{"color":"orange"}',
        dynamicMark: false,
        getPattern: function() {
            return new RegExp('QWE([0-9]{3})', "g")
        }
    },
    ZXC: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.TEST,
        text: "[ZXC]",
        style: '{"color":"red"}',
        dynamicMark: false,
        getTip: function() {
            return 'ZXC_TEST'
        },
        getPattern: function() {
            return new RegExp('ZXC([0-9]{3})', "g")
        }
    },
    NICK: {
        kind: o.MESSAGE_MARK_REGEXP_KINDS.NORMAL,
        style: '{"color":"#48D1CC","font-weight": "bold"}',
        dynamicMark: function(regexpArray) {
            return regexpArray[0]
        },
        //getDynamicTip   : function (regexpArray) {return 'Priv message to: ' + regexpArray[0];},
        getPattern: function() {
            return new RegExp('(' + getEngine().hero.d.nick + ')', "g")
        }
    }
}

o.SYSTEM_MESSAGE_MARK_REGEXP = {
    RELATED_NICK: {
        style: '{"font-weight": "bold"}',
        dynamicMark: function(regexpArray) {
            return regexpArray[0]
        },
        getDynamicPattern: function(data) {
            if (!isset(data.relatedNick)) {
                errorReport(moduleData.fileName, "getDynamicPattern", "data.relatedNick not exist", data);
                return null;
            }

            return new RegExp('(' + data.relatedNick + ')', "g")
        },
        editMark: function(chatMessage, $mark, additionalData) {
            chatMessage.attachContextMenuToRelatedNick($mark, additionalData);
        }
    }
}

o.AVAILABLE = {
    [o.CHANNEL.GENERAL]: true,
    [o.CHANNEL.GLOBAL]: true,
    [o.CHANNEL.LOCAL]: true,
    [o.CHANNEL.TRADE]: true,
    [o.CHANNEL.GROUP]: false,
    [o.CHANNEL.CLAN]: false,
    [o.CHANNEL.SYSTEM]: true,
    [o.CHANNEL.PRIVATE]: true
};

const HERO_MSG_COLOR = o.KIND_MESSAGE_COLOR.HERO_MSG_COLOR;
const OTHER_MSG_COLOR = o.KIND_MESSAGE_COLOR.OTHER_MSG_COLOR;

o.INPUT_CHANNEL_HEADER = {
    [o.CHANNEL.GENERAL]: {
        name: o.CHANNEL.GENERAL,
        short: {
            pl: 'a',
            en: 'a'
        },
        [HERO_MSG_COLOR]: "#FFFFFF",
        [OTHER_MSG_COLOR]: "#FFFFFF",
        inputWrapper: o.CHANNEL.LOCAL,
        remove: false,
        menu: false
    },
    [o.CHANNEL.GLOBAL]: {
        name: o.CHANNEL.GLOBAL,
        short: {
            pl: 'o',
            en: 'o'
        },
        [HERO_MSG_COLOR]: "#FFFFFF",
        [OTHER_MSG_COLOR]: "#FFFFFF",
        inputWrapper: o.CHANNEL.GLOBAL,
        remove: false,
        menu: true
    },
    [o.CHANNEL.LOCAL]: {
        name: o.CHANNEL.LOCAL,
        short: {
            pl: 'l',
            en: 'l'
        },
        [HERO_MSG_COLOR]: "#D49999",
        [OTHER_MSG_COLOR]: "#D49999",
        inputWrapper: o.CHANNEL.LOCAL,
        remove: true,
        menu: true
    },
    [o.CHANNEL.TRADE]: {
        name: o.CHANNEL.TRADE,
        short: {
            pl: 'h',
            en: 't'
        },
        [HERO_MSG_COLOR]: "#87fdff",
        [OTHER_MSG_COLOR]: "#87fdff",
        inputWrapper: o.CHANNEL.TRADE,
        remove: true,
        menu: true
    },
    [o.CHANNEL.GROUP]: {
        name: o.CHANNEL.GROUP,
        short: {
            pl: 'g',
            en: 'p'
        },
        [HERO_MSG_COLOR]: "#b554ff",
        [OTHER_MSG_COLOR]: "#b554ff",
        inputWrapper: o.CHANNEL.GROUP,
        remove: true,
        menu: true
    },
    [o.CHANNEL.CLAN]: {
        name: o.CHANNEL.CLAN,
        short: {
            pl: 'k',
            en: 'g'
        },
        [HERO_MSG_COLOR]: "#4cfa4f",
        [OTHER_MSG_COLOR]: "#4cfa4f",
        inputWrapper: o.CHANNEL.CLAN,
        remove: true,
        menu: true
    },
    [o.CHANNEL.SYSTEM]: {
        name: o.CHANNEL.SYSTEM,
        short: {
            pl: 's',
            en: 's'
        },
        [HERO_MSG_COLOR]: "#B1B7BD",
        [OTHER_MSG_COLOR]: "#B1B7BD",
        inputWrapper: o.CHANNEL.SYSTEM,
        remove: true,
        menu: false
    },
    [o.CHANNEL.COMMERCIAL]: {
        name: o.CHANNEL.COMMERCIAL,
        short: {
            pl: 'i',
            en: 'i'
        },
        [HERO_MSG_COLOR]: "#ec0c0c",
        [OTHER_MSG_COLOR]: "#ec0c0c",
        inputWrapper: o.CHANNEL.COMMERCIAL,
        remove: true,
        menu: false
    },
    [o.CHANNEL.PRIVATE]: {
        name: o.CHANNEL.PRIVATE,
        short: {
            pl: 'p',
            en: 'w'
        },
        [HERO_MSG_COLOR]: "#CC32D0",
        [OTHER_MSG_COLOR]: "#D38BD5",
        inputWrapper: o.CHANNEL.PRIVATE,
        remove: true,
        menu: false
    }
};

o.INPUT_CHANNEL_MODE = {
    [o.STYLE.SPECIAL]: {
        name: o.STYLE.SPECIAL,
        short: 's',
        request: "special"
    },
    [o.STYLE.NAR]: {
        name: o.STYLE.NAR,
        short: 'n',
        request: "nar"
    },
    [o.STYLE.ME]: {
        name: o.STYLE.ME,
        short: 'm',
        request: "me"
    }
};

o.INPUT_REGEXP = {
    $_LINKED_ITEMS: {
        tag: "$_LINKED_ITEMS",
        //src       : (createTextGraphic('[PRZEDMIOT]', 13, 'yellow', '')).url,
        getSrc: function() {
            return (createTextGraphic('[' + getEngine().chatController.chatLang('Item') + ']', 13, 'yellow', '')).url
        },
        getPattern: function() {
            return new RegExp('ITEM#([0-9a-z]{64}|[0-9]{7,11})(\\.[a-z]+|)(\\s|\&nbsp;)', "g")
        }
    },
    $_TEST_ASD_ITEMS: {
        tag: "$_TEST_ASD_ITEMS",
        getSrc: function() {
            return (createTextGraphic('[ASD_TEST]', 13, 'pink', '')).url
        },
        getPattern: function() {
            return new RegExp('ASD([0-9]{3})', "g")
        }
    },
    $_TEST_QWE_ITEMS: {
        tag: "$_TEST_QWE_ITEMS",
        getSrc: function() {
            return (createTextGraphic('[QWE_TEST]', 13, 'orange', '')).url
        },
        getPattern: function() {
            return new RegExp('QWE([0-9]{3})', "g")
        }
    },
    $_TEST_ZXC_ITEMS: {
        tag: "$_TEST_ZXC_ITEMS",
        getSrc: function() {
            return (createTextGraphic('[ZXC_TEST]', 13, 'red', '')).url
        },
        getPattern: function() {
            return new RegExp('ZXC([0-9]{3})', "g")
        }
    },
    $_PROFILE_ITEMS: {
        tag: "$_PROFILE_ITEMS",
        getSrc: function() {
            return (createTextGraphic('[' + getEngine().chatController.chatLang('playerProfile') + ']', 13, 'green', '')).url
        },
        getPattern: function() {


            //if (isPl()) return new RegExp('(^|\&nbsp;|\\s)https:\/\/www.margonem.pl\/profile\/view\,([0-9]+)\#char\_([0-9]+)\,([a-zA-Z]+)(\\s|\&nbsp;)', "g");
            if (isPl()) return new RegExp('(^|\&nbsp;|\\s)https:\/\/www.margonem.pl\/profile\/view\,([0-9]+)(\\s|\&nbsp;|\#char\_([0-9]+)\,([a-zA-Z]+)(\\s|\&nbsp;))', "g");
            else {
                return new RegExp('(^|\&nbsp;|\\s)https:\/\/margonem.com\/profile\/view\,([0-9]+)(\\s|\&nbsp;|(\#char\_([0-9]+(\\s|\&nbsp;|\,[a-zA-Z]+(\\s|\&nbsp;)))))', "g")
                //                    https://margonem.com/profile/view,4102548#char_63022,Beluga
                //                    https://margonem.com/profile/view,4102548#char_63022
                //                    https://margonem.com/profile/view,4102548
            }
        }
    },
    $_CLAN_ITEMS: {
        tag: "$_CLAN_ITEMS",
        getSrc: function() {
            return (createTextGraphic('[' + getEngine().chatController.chatLang('clanProfile') + ']', 13, 'violet', '')).url
        },
        getPattern: function() {
            //return new RegExp('(^https|\&nbsp;https|\\shttps):\/\/www.margonem.pl\/guilds\/view\,([a-z]+)\,([0-9]+)(\\s|\&nbsp;)', "g")
            return new RegExp('(^|\&nbsp;|\\s)https:\/\/www.margonem.pl\/guilds\/view\,([a-zA-Z]+)\,([0-9]+)(\\s|\&nbsp;)', "g")
        }
    },
    /*
    $_FORUM_ITEMS : {
        tag       : "$_FORUM_ITEMS",
        src       : (createTextGraphic('[FORUM_TITLE]', 13, 'yellow', '')).url,
        getPattern: function () {
            //if (isPl()) return new RegExp('https:\/\/forum.margonem.pl\/\\?task=forum\&amp;show=posts\&amp;id=([0-9]+)(\\s|\&nbsp;)', "g");
            if (isPl()) return new RegExp('https:\/\/forum.margonem.pl\/([a-zA-Z0-9\/\,\?\=\&\;]+)(\\s|\&nbsp;)', "g");
            else        return new RegExp('https:\/\/forum.margonem.com\/([a-zA-Z0-9\/\,]+)(\\s|\&nbsp;)', "g");
        }
    }
    */
};

o.CHANNEL_INPUT_DATA = [

    {
        callback: function() {
            let name = getEngine().chatController.getChatChannelCardWrapper().getActiveChannelName();
            let inputWrapperName = o.INPUT_CHANNEL_HEADER[name].inputWrapper;
            let data = o.INPUT_CHANNEL_HEADER[inputWrapperName];

            getEngine().chatController.getChatInputWrapper().setChannel(data);
        },
        getPattern: function() {
            return new RegExp('^\/b(\\s|\&nbsp;)', "g")
        }
    },
    {
        callback: function() {
            let lastUserWhoSendToHeroPrivateMessage = getEngine().chatController.getChatPrivateMessageData().getLastUserWhoSendToHeroPrivateMessage();

            if (!lastUserWhoSendToHeroPrivateMessage) {
                //message("nobody send to you any private message!");
                message(getEngine().chatController.chatLang('nobodySendToYouAnyPrivateMessage'));
                return
            }

            getEngine().chatController.getChatInputWrapper().setChannel(o.INPUT_CHANNEL_HEADER.PRIVATE, lastUserWhoSendToHeroPrivateMessage);
        },
        getPattern: function() {
            return new RegExp('^\/r(\\s|\&nbsp;)', "g")
        }
    },
    {
        callback: function() {
            let lastUserWhoGetFromHeroPrivateMessage = getEngine().chatController.getChatPrivateMessageData().getLastUserWhoGetFromHeroPrivateMessage();

            if (!lastUserWhoGetFromHeroPrivateMessage) {
                //message("you do not send any private message to users!");
                message(getEngine().chatController.chatLang('youDoNotSendAnyPrivateMessageToUsers'));
                return
            }

            getEngine().chatController.getChatInputWrapper().setChannel(o.INPUT_CHANNEL_HEADER.PRIVATE, lastUserWhoGetFromHeroPrivateMessage);
        },
        getPattern: function() {
            return new RegExp('^\/rr(\\s|\&nbsp;)', "g")
        }
    },

    {
        callback: function() {
            if (!getEngine().chatController.getChatChannelsAvailable().checkAvailableProcedure(o.CHANNEL.GROUP)) return;
            getEngine().chatController.getChatInputWrapper().setChannel(o.INPUT_CHANNEL_HEADER.GROUP);
        },
        getPattern: function() {
            //return new RegExp('^\/g(\\s|\&nbsp;)', "g")


            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(o.INPUT_CHANNEL_HEADER.GROUP)

            return new RegExp('^\/' + short + '(\\s|\&nbsp;)', "g")
        }
    },
    {
        callback: function() {
            if (!getEngine().chatController.getChatChannelsAvailable().checkAvailableProcedure(o.CHANNEL.GROUP)) return;
            getEngine().chatController.getChatWindow().setChannel(o.CHANNEL.GROUP);
        },
        getPattern: function() {

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(o.INPUT_CHANNEL_HEADER.GROUP)
            return new RegExp('^\/' + short + short + '(\\s|\&nbsp;)', "g")
        }
    },
    {
        callback: function() {
            getEngine().chatController.getChatInputWrapper().setChannel(o.INPUT_CHANNEL_HEADER.TRADE);
        },
        getPattern: function() {
            //return new RegExp('^\/h(\\s|\&nbsp;)', "g")

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(o.INPUT_CHANNEL_HEADER.TRADE)

            return new RegExp('^\/' + short + '(\\s|\&nbsp;)', "g")
        }
    },
    {
        callback: function() {
            getEngine().chatController.getChatWindow().setChannel(o.CHANNEL.TRADE);
        },
        getPattern: function() {
            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(o.INPUT_CHANNEL_HEADER.TRADE)
            return new RegExp('^\/' + short + short + '(\\s|\&nbsp;)', "g")
        }
    },
    {
        callback: function() {
            getEngine().chatController.getChatInputWrapper().setChannel(o.INPUT_CHANNEL_HEADER.LOCAL);
        },
        getPattern: function() {
            //return new RegExp('^\/l(\\s|\&nbsp;)', "g")

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(o.INPUT_CHANNEL_HEADER.LOCAL)

            return new RegExp('^\/' + short + '(\\s|\&nbsp;)', "g")
        }
    },
    {
        callback: function() {
            getEngine().chatController.getChatWindow().setChannel(o.CHANNEL.SYSTEM);
        },
        getPattern: function() {

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(o.INPUT_CHANNEL_HEADER.SYSTEM)

            return new RegExp('^\/' + short + short + '(\\s|\&nbsp;)', "g");
        }
    },
    {
        callback: function() {
            getEngine().chatController.getChatWindow().setChannel(o.CHANNEL.LOCAL);
        },
        getPattern: function() {

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(o.INPUT_CHANNEL_HEADER.LOCAL)

            return new RegExp('^\/' + short + short + '(\\s|\&nbsp;)', "g");
        }
    },
    {
        callback: function() {
            getEngine().chatController.getChatWindow().setChannel(o.CHANNEL.PRIVATE);
        },
        getPattern: function() {

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(o.INPUT_CHANNEL_HEADER.PRIVATE)

            return new RegExp('^\/' + short + short + '(\\s|\&nbsp;)', "g");
        }
    },
    {
        callback: function() {
            if (!getEngine().chatController.getChatChannelsAvailable().checkAvailableProcedure(o.CHANNEL.CLAN)) return;
            getEngine().chatController.getChatInputWrapper().setChannel(o.INPUT_CHANNEL_HEADER.CLAN);
        },
        getPattern: function() {
            //return new RegExp('^\/k(\\s|\&nbsp;)', "g")

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(o.INPUT_CHANNEL_HEADER.CLAN)

            return new RegExp('^\/' + short + '(\\s|\&nbsp;)', "g")
        }
    },
    {
        callback: function() {
            if (!getEngine().chatController.getChatChannelsAvailable().checkAvailableProcedure(o.CHANNEL.CLAN)) return;
            getEngine().chatController.getChatWindow().setChannel(o.CHANNEL.CLAN);
        },
        getPattern: function() {

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(o.INPUT_CHANNEL_HEADER.CLAN)

            return new RegExp('^\/' + short + short + '(\\s|\&nbsp;)', "g")
        }
    },
    {
        callback: function() {
            getEngine().chatController.getChatInputWrapper().setChannel(o.INPUT_CHANNEL_HEADER.GLOBAL);
        },
        getPattern: function() {
            //return new RegExp('^\/o(\\s|\&nbsp;)', "g")

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(o.INPUT_CHANNEL_HEADER.GLOBAL)

            return new RegExp('^\/' + short + '(\\s|\&nbsp;)', "g")
        }
    },
    {
        callback: function() {
            getEngine().chatController.getChatWindow().setChannel(o.CHANNEL.GLOBAL);
        },
        getPattern: function() {

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(o.INPUT_CHANNEL_HEADER.GLOBAL)

            return new RegExp('^\/' + short + short + '(\\s|\&nbsp;)', "g")
        }
    },
    {
        callback: function() {
            getEngine().chatController.getChatWindow().setChannel(o.CHANNEL.GENERAL);
        },
        getPattern: function() {

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(o.INPUT_CHANNEL_HEADER.GENERAL)

            return new RegExp('^\/' + short + short + '(\\s|\&nbsp;)', "g")
        }
    },
    {
        callback: function() {
            getEngine().chatController.getChatWindow().setChannel(o.CHANNEL.GLOBAL, o.INPUT_CHANNEL_MODE[o.STYLE.SPECIAL].request);
        },
        getPattern: function() {

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(o.INPUT_CHANNEL_HEADER.GLOBAL);
            let style = o.INPUT_CHANNEL_MODE[o.STYLE.SPECIAL].short;

            return new RegExp('^\/' + short + style + '(\\s|\&nbsp;)', "g")
        }
    },
    {
        callback: function() {

            getEngine().chatController.getChatWindow().setChannel(o.CHANNEL.LOCAL, o.INPUT_CHANNEL_MODE[o.STYLE.SPECIAL].request);
        },
        getPattern: function() {

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(o.INPUT_CHANNEL_HEADER.LOCAL);
            let style = o.INPUT_CHANNEL_MODE[o.STYLE.SPECIAL].short;

            return new RegExp('^\/' + short + style + '(\\s|\&nbsp;)', "g")
        }
    },
    {
        callback: function() {

            getEngine().chatController.getChatWindow().setChannel(o.CHANNEL.LOCAL, o.INPUT_CHANNEL_MODE[o.STYLE.ME].request);
        },
        getPattern: function() {

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(o.INPUT_CHANNEL_HEADER.LOCAL);
            let style = o.INPUT_CHANNEL_MODE[o.STYLE.ME].short;

            return new RegExp('^\/' + short + style + '(\\s|\&nbsp;)', "g")
        }
    },
    {
        callback: function() {

            getEngine().chatController.getChatWindow().setChannel(o.CHANNEL.LOCAL, o.INPUT_CHANNEL_MODE[o.STYLE.NAR].request);
        },
        getPattern: function() {

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(o.INPUT_CHANNEL_HEADER.LOCAL);
            let style = o.INPUT_CHANNEL_MODE[o.STYLE.NAR].short;

            return new RegExp('^\/' + short + style + '(\\s|\&nbsp;)', "g")
        }
    },
    {
        callback: function() {

            getEngine().chatController.getChatWindow().setChannel(o.CHANNEL.TRADE, o.INPUT_CHANNEL_MODE[o.STYLE.SPECIAL].request);
        },
        getPattern: function() {

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(o.INPUT_CHANNEL_HEADER.TRADE);
            let style = o.INPUT_CHANNEL_MODE[o.STYLE.SPECIAL].short;

            return new RegExp('^\/' + short + style + '(\\s|\&nbsp;)', "g")
        }
    },
    {
        callback: function(nick) {
            getEngine().chatController.getChatInputWrapper().setChannel(o.INPUT_CHANNEL_HEADER.PRIVATE, nick);
        },
        getValFromPatter: true,
        getPattern: function() {
            //return new RegExp('^@([_a-zA-Z]+)(\\s|\&nbsp;)', "g")
            return new RegExp('^@([\-\'\`\~ÄÄÄÄÄÄÅÅÅÅÃÃ³ÅÅÅ¹ÅºÅ»Å¼_a-zA-Z]+)(\\s|\&nbsp;)', "g")

            //let short = null;
            //if (isPl()) short = o.INPUT_CHANNEL_HEADER.PRIVATE.short.pl;
            //if (isEn()) short = o.INPUT_CHANNEL_HEADER.PRIVATE.short.en;
            //
            //return new RegExp('^\/' + short + '(\\s|\&nbsp;)', "g")
        }
    }
]

module.exports = o;