/**
 * all globals should be registered here or even in main.js
 */
window.cdnUrl = 'https://micc.garmory-cdn.cloud';
window.cdncrUrl = 'https://mwcr.garmory-cdn.cloud';
window.CFG = {
    oimg: '/img', //annother img
    a_imgpath: cdnUrl + '/obrazki/',
    a_opath: cdnUrl + '/obrazki/postacie/', //players image path
    a_npath: cdnUrl + '/obrazki/npc/', //npc image path
    a_mpath: cdnUrl + '/obrazki/miasta/', //city image path
    a_ipath: cdnUrl + '/obrazki/itemy/', //items path
    a_ppath: cdnUrl + '/obrazki/pets/', //pets path
    a_vpath: cdnUrl + '/obrazki/interface/', //interface path
    a_epath: cdnUrl + '/obrazki/interface/emo/', //emo path
    a_fpath: cdnUrl + '/obrazki/interface/environmentalEffects/', //environmental effects path
    a_bpath: cdnUrl + '/obrazki/battle/',
    a_rajGraphics: cdnUrl + '/obrazki/grafikiRaj/',

    r_opath: '/obrazki/postacie/', //players image path
    r_npath: '/obrazki/npc/', //npc image path
    r_mpath: '/obrazki/miasta/', //city image path
    r_ipath: '/obrazki/itemy/', //items path
    r_ppath: '/obrazki/pets', //pets path
    r_vpath: '/obrazki/interface/', //interface path
    r_epath: '/obrazki/interface/emo/', //emo path
    r_fpath: '/obrazki/interface/environmentalEffects/', //environmental effects path
    r_bpath: '/obrazki/battle/',

    //r_characterEffects	: '/obrazki/characterEffects/',
    r_rajGraphics: '/obrazki/grafikiRaj/',
    r_battleEffectsGif: '/battleEffects/gif/',
    r_battleEffectsSound: '/battleEffects/sound/',
    //r_srajSound: '/sraj/sound/',
    r_srajSound: '/obrazki/grafikiRaj/sounds/',

    sl_multipler: {
        'en': 75,
        'pl': 75
    },
    LANG: {
        PL: 'pl',
        EN: 'en'
    },
    DOMAIN: {
        PL: 'pl',
        COM: 'com'
    },
    tileSize: 32,
    halfTileSize: 16,
    quarterTileSize: 8,
    chest: false,
    storage: {
        version: 2.0,
        keysToRemove: ['questLog', 'padController', 'whoIsHere', 'HANDHELD_WINDOW', 'PAD_CONTROLLER', 'PARTY', 'QUESTS_PANEL', 'QUEST_OBSERVE', 'WANTED_LIST', 'WHO_IS_HERE', 'charlist']
    },
    serverStorage: {
        version: 1.4,
        //keysToRemove: ['hotKeys', 'hotWidget_pc', 'hotWidget_mobile']
        keysToRemove: ['hotKeys']
    },
    enhancedItemId: -1,
    debug: false,
    debugRender: false,
    webSocketVersion: (typeof __build.websocket !== 'undefined') ? __build.websocket : true
};


//detect MSIE
window.IE = navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0;

// libs
require('checkOldBrowser');
require('soundmanager2');
window.$ = window.jQuery = require('jquery');
// window.$ = window.jQuery = require('js/libs/jquery-3.3.1.min.js');
require('js/libs/jquery-ui.min.js');
//require("jquery-ui/ui/widgets/draggable");
//require("jquery-ui/ui/widgets/droppable");
//require("jquery-ui/ui/widgets/sortable");
//require("jquery-ui/ui/disable-selection");
window.linkify = require('linkifyjs');
require('jquery-mask-plugin');
require('js/libs/jquery.ui.touch-punch.min.js');
require('js/libs/omggif.js');
window.Vue = require('vue');

require('core/Helpers');
require('core/Translations');

require('js/jQExtend/Tips');
require('core/Templates');

require('js/jQExtend/MobileMenu');
require('js/jQExtend/CreateMenuScroll');
require('js/jQExtend/CreateDivideButton');
require('js/jQExtend/AddScrollBar');
require('js/jQExtend/DraggableFix');

window.API = require('api/Api'); //used for addons etc.

// load Game
require('Game');