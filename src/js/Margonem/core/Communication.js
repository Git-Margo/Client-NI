var Dialogue = require('@core/dialogue/Dialogue');
var Loot = require('@core/Loot');
var Shop = require('@core/shop/Shop');
// var Loader = require('@minigames/Loader');
var MailsManager = require('@core/mails/MailsManager');
var RecoveryItems = require('@core/RecoveryItems');
let SocietyData = require('@core/society/SocietyData');
var Society = require('@core/society/Society');
var Party = require('@core/Party');
var Trade = require('@core/Trade');
var WantedController = require('@core/wanted/WantedController');
var Registration = require('@core/Registration');
var Depo = require('@core/depo/Depo');
var Clan = require('@core/clan/Clan');
var EventCalendar = require('@core/EventCalendar');
var Book = require('@core/Book');
var Motel = require('@core/Motel');
var GoldShop = require('@core/shop/GoldShop');
var Skills = require('@core/skills/Skills');
var QuestsManager = require('@core/quest/QuestsManager');
var LogOff = require('@core/LogOff');
var Chests = require('@core/Chests');
var Promo = require('@core/Promo');
var AuctionManager = require('@core/auction/AuctionManager');
var LootPreview = require('@core/LootPreview');
var News = require('@core/news/News');
var TpScroll = require('@core/TpScroll');
var RewardsCalendar = require('@core/RewardsCalendar');
var Barter = require('@core/barter/Barter');
var ConquerStats = require('@core/ConquerStats');
var ChooseOutfit = require('@core/ChooseOutfit');
const BonusSelectorWindow = require('@core/BonusSelectorWindow');
const BonusReselectWindow = require('@core/BonusReselectWindow');
const BattlePass = require('@core/battlePass/BattlePass.js');
let ThemeData = require('@core/themeController/ThemeData');
let CodeMessageData = require('@core/codeMessage/CodeMessageData');
let SettingsStorage = require('@core/settings/SettingsStorage');
let CharacterReset = require('@core/characterReset/CharacterReset');
var RajData = require('@core/raj/RajData');
const MCAddon = require('./MCAddon');
var Storage = require('@core/Storage');
const CharacterList = require("@core/CharacterList");
const {
    Preview
} = require('@core/preview/PreviewManager');
const {
    previewType
} = require('@core/preview/PrevievData');

module.exports = function() {
    var self = this;
    //var lastEv = 0;
    var callbacks = [];
    this.tmpParams = [];
    this.taskCallbacks = {};
    this.taskPayload = {};
    this.taskQueue = [];
    this.idleRequestCounter = 0;
    this.heroIdle = true;

    let fullDataPackage;

    let webSocket;
    let webSocketBefore;
    let webSocketAfter;
    let webSocketT0;
    let webSocketInMove;
    let webSocketTask;
    let globalAddonsInitWasReceived = false;

    window._g = function(task, callback, payload) {

        if (!Engine.requestCorrect.checkTaskIsCorrect(task)) {
            errorReport('Communication.js', '_g', "Task is not correct", task);
            return;
        }

        if (self.checkCanAddTaskToTaskQueue(task)) {
            self.addToTaskQueue(task, callback, payload);
            return;
        }

        //Engine.ats = ts();
        //Engine.setAts(ts())
        Engine.interface.heroElements.startLag();

        if (CFG.webSocketVersion) Engine.communication.send2(task, callback, payload);
        else Engine.communication.send(task, callback, payload);

    };

    /**
     * Adds temporary param and callback to the next request.
     * Params and callbacks are removed after next request
     * @param param
     * @param callback
     */
    window._p = function(param, callback) {
        self.addParams(param, callback);
    };

    this.manageHeroIdle = (inMove) => {
        if (inMove) {
            this.heroIdle = false;
            this.idleRequestCounter = 0;
        } else {
            this.idleRequestCounter++;
            if (this.idleRequestCounter > 1) {
                this.heroIdle = true;
            }
        }
    };

    this.checkCanAddTaskToTaskQueue = function(task) {
        if (!globalAddonsInitWasReceived) return false;

        let time = (new Date()).getTime();
        return task != '_' && (!Engine.tickSuccess || time - Engine.idleJSON.lastRequest < Engine.idleJSON.diff);
    };

    this.checkCanSendTaskFromTaskQueue = function() {
        return self.taskQueue.length;
    };

    this.sendTaskFromQueue = function() {
        var id = self.taskQueue[0];
        var callback = self.taskCallbacks[id];
        var payload = self.taskPayload[id];

        if (callback && payload) return _g(id, callback, payload);
        if (payload) return _g(id, false, payload);
        if (callback) return _g(id, callback);

        _g(id);
    };

    this.addToTaskQueue = function(task, callback, payload) {
        if (self.taskQueue.indexOf(task) > -1) return;
        self.taskQueue.push(task);
        self.taskCallbacks[task] = undefined == callback ? null : callback;
        self.taskPayload[task] = undefined == payload ? null : payload;
    };

    this.removeFromTaskQueue = function(task) {
        var index = self.taskQueue.indexOf(task);
        if (index < 0) return;
        self.taskQueue.splice(index, 1);
        delete self.taskCallbacks[task];
        delete self.taskPayload[task];
    };

    this.send = function(task, callback, payload) {
        var postData = null;
        var type = Object.prototype.toString.call(callback);

        if (payload) postData = payload;

        var before = function() {};
        var after = callback ? callback : function() {};

        if (type == '[object Array]') {
            before = typeof(callback[0]) == 'function' ? callback[0] : before;
            after = typeof(callback[1]) == 'function' ? callback[1] : before;
        } else {
            after = typeof(callback) == 'function' ? callback : after;
        }

        var date = new Date();
        var t0 = date.getTime();
        let oldTime = Engine.oldTime ? Engine.oldTime : Date.now();
        Engine.oldTime = t0;
        let time123 = zero(date.getHours()) + ':' + zero(date.getMinutes()) + ':' + zero(date.getSeconds())
        let tBeetwen = t0 - oldTime;
        if (tBeetwen > 15000) console.error('TIME BEETWEN SEND', t0, time123, t0 - oldTime);
        //else                  console.log('TIME BEETWEN SEND', t0, time123 , t0 - oldTime);

        let inMove = Engine.stepsToSend.isStepsToSend();

        $.ajax({
            url: '/engine?t=' + task + this.prepareUrl(),
            type: 'post',
            contentType: "application/json; charset=UTF-8",
            //contentType: "application/json",
            data: postData ? JSON.stringify(postData) : null,
            success: function(data, statusText, e) {

                Engine.tickSuccess = true;
                self.manageHeroIdle(inMove);

                if (task != '_') self.removeFromTaskQueue(task);

                data.lag = Date.now() - t0;
                before(data);
                self.parseJSON(data);
                for (var i = 0; i < callbacks.length; i++) {
                    callbacks[i](data);
                }
                callbacks = [];
                after(data);
                Engine.GA.onRequest(task, data);
            },
            error: function(e) {
                if (e.status == 504) {
                    //Console.warn(_t('Request rejected'));
                    Engine.console.warn(_t('Request rejected'));
                    Engine.tickSuccess = true;
                    if (task != '_') self.removeFromTaskQueue(task);
                    return
                }
                Engine.reconnect.disconnect(e);
                console.error('[Communication.js, send] Ajax ERROR');
            }
        });

        Engine.idleJSON.reset();
        Engine.tickSuccess = false;
    };

    this.send2 = function(task, callback, payload) {
        let postData = null;
        let type = Object.prototype.toString.call(callback);
        webSocketTask = task;

        if (payload) postData = payload;

        webSocketBefore = function() {};
        webSocketAfter = callback ? callback : function() {};

        if (type == '[object Array]') {
            webSocketBefore = typeof(callback[0]) == 'function' ? callback[0] : webSocketBefore;
            webSocketAfter = typeof(callback[1]) == 'function' ? callback[1] : webSocketBefore;
        } else webSocketAfter = typeof(callback) == 'function' ? callback : webSocketAfter;


        webSocketInMove = Engine.stepsToSend.isStepsToSend();
        webSocketT0 = Date.now();
        let getDataUrl = 't=' + webSocketTask + this.prepareUrl();

        self.webSocketSendData(getDataUrl, postData);

        Engine.idleJSON.reset();
        Engine.tickSuccess = false;
    };

    this.errorData = (e) => {
        let _webSocketTask = webSocketTask;
        console.log(e);
        this.webSocketVarsClear();

        if (e.status == 504) {
            Engine.console.warn(_t('Request rejected'));
            Engine.tickSuccess = true;
            if (_webSocketTask != '_') self.removeFromTaskQueue(_webSocketTask);
            return
        }

        Engine.reconnect.disconnect(e);
        console.error('[Communication.js, errorData] Communication websocket ERROR');
    };

    this.webSocketVarsClear = () => {
        webSocketTask = null;
        webSocketBefore = null;
        webSocketAfter = null;
        webSocketT0 = null;
        webSocketInMove = null;
    };

    this.setGlobalAddonsWasReceived = (state) => {
        globalAddonsInitWasReceived = state;
    };

    this.getGlobalAddonsWasReceived = () => {
        return globalAddonsInitWasReceived;
    };

    this.successData = (d) => {

        let _webSocketTask = webSocketTask;
        let _webSocketBefore = webSocketBefore;
        let _webSocketAfter = webSocketAfter;
        let _webSocketT0 = webSocketT0;
        let _webSocketInMove = webSocketInMove;

        this.webSocketVarsClear();

        let data = JSON.parse(d);
        self.resetFullDataPackage();
        self.setFullDataPackage(data);
        Engine.tickSuccess = true;
        self.manageHeroIdle(_webSocketInMove);
        data.lag = Date.now() - _webSocketT0;


        if (_webSocketTask != '_') self.removeFromTaskQueue(_webSocketTask);

        _webSocketBefore(data);
        self.parseJSON(data);

        for (var i = 0; i < callbacks.length; i++) {
            callbacks[i](data);
        }
        callbacks = [];

        _webSocketAfter(data);

        let firstNotInit = Engine.getFirstNotInit();
        if (Engine.allInit && firstNotInit == true) Engine.setFirstNotInit(false);
        if (Engine.allInit && firstNotInit === null) Engine.setFirstNotInit(true);

        Engine.GA.onRequest(_webSocketTask, data);
    };

    this.onOpenWebSocket = () => {
        Engine.setWebSocketConnect(true);

        let addonsTurnOn = Engine.globalAddons.checkAddonsTurnOn();

        if (addonsTurnOn) {
            //_g(`getvar_addon&callback=GLOBAL_ADDON`);
            _g(`addon`);
        } else {
            self.setGlobalAddonsWasReceived(true);
            this.startCallInitAfterRecivedAddons();
        }
    };

    this.startCallInitAfterRecivedAddons = () => {
        Engine.tickSuccess = true;
        Engine.globalAddons.setMsgInConsoleAndCreateButtonInConsole();
        Engine.reCallInitQueue();
    };

    this.onMessageWebSocket = (evt) => {
        let data = evt.data;
        let globalAddonsWasReceived = this.getGlobalAddonsWasReceived();

        if (!globalAddonsWasReceived) {
            let parseData = JSON.parse(data);
            let globalAddonRequestAnswer = Engine.globalAddons.checkIsGlobalAddonRequestAnswer(parseData);

            if (globalAddonRequestAnswer) {
                self.setGlobalAddonsWasReceived(true);
                Engine.globalAddons.initGlobalAddonLink(parseData.addon);

                return
            }
        }

        //if (Engine.globalAddons.checkIsGlobalAddonRequestAnswer(data)) {
        //
        //	self.setGlobalAddonsWasReceived(true);
        //	Engine.globalAddons.initGlobalAddonLink(data);
        //
        //	return
        //}

        if (data == '') {
            //console.log('webSocket onmessage empty');
            //self.successData("{}");
            debugger;
            pageReload();
            return
        }
        self.successData(data);
    };

    this.initWebSocket = () => {
        let unload = false;
        let sub = location.hostname.split('.')[0];
        let r = new RegExp('local$|local([0-9]+)$', "g");
        let isLocal = sub.match(r);
        let protocol = location.protocol == "https:" || isLocal ? 'wss' : 'ws';
        // let tld         = getMainDomain()
        let tld = location.origin.split('.').pop();
        sub = isLocal ? 'dev' : sub;

        //if (sub == 'tabaluga' && mobileCheck()) {
        //	let serverName = Storage.easyGet("CURRENT_SEVER");
        //
        //	if (serverName) {
        //		sub = serverName
        //	}
        //}


        // sub           = 'tabaluga';
        //tld 		  = 'com';

        let url = protocol + '://' + sub + '.margonem.' + tld + '/ws-engine';
        //let url = protocol + '://beluga.margonem.com/ws-engine';
        //console.log('testBeluga');

        addEventListener("unload", () => unload = true);

        webSocket = new WebSocket(url);
        webSocket.onopen = function(evt) {
            self.onOpenWebSocket();
        };

        webSocket.onclose = function(evt) {
            debugger;
            console.log(unload)
            setTimeout(() => { // for FF
                //location.reload();
                pageReload();
            }, 500);
        };

        webSocket.onmessage = function(evt) {
            self.onMessageWebSocket(evt)
        };

        webSocket.onerror = function(evt) {
            debugger;
            self.errorData(evt)
        };
    };

    this.getFullDataPackage = () => {
        return fullDataPackage;
    }

    this.setFullDataPackage = (data) => {
        fullDataPackage = data;
    };

    this.resetFullDataPackage = () => {
        fullDataPackage = null;
    };

    this.webSocketSendData = (getData, postData) => {
        let objectToSend = {
            'g': getData,
            'p': postData ? JSON.stringify(postData) : '',
        };

        let jsonParse = JSON.stringify(objectToSend);

        webSocket.send(jsonParse);
    };

    this.addParams = function(param, callback) {
        if (typeof(callback) == "function") callbacks.push(callback);
        this.tmpParams.push(param)
    };

    this.prepareUrl = function() {
        var ret = '';
        let ev = Engine.getEv();
        //if (ev) ret += '&ev=' + ev;
        this.sendEv();
        ret += Engine.fetchURISteps();
        //ret += '&aid=' + getCookie('user_id');
        //ret += isset(Engine.ev) ? '&ev=' + Engine.ev : '';
        ret += ev != "" ? '&ev=' + ev : '';
        ret += isset(Engine.browserToken) ? '&browser_token=' + Engine.browserToken : '';
        ret += this.tmpParams != '' ? '&' + this.tmpParams.join('&') : '';
        //ret += Engine.mPos.queue ? '&myszka=' + Engine.mPos.getQueue() : '';
        this.tmpParams = [];
        return ret;
    };

    this.sendEv = function() {
        let ev = Engine.getEv();

        if (ev == "" || Engine.reconnect.stateInterval()) return;
        if (Engine.getLastEv() === ev) pageReload();

        Engine.setLastEv(ev);
    };

    //Engine.communication.setStateTestJSONData('CLAN_SYSTEM_MESSAGE')
    /*
    Engine.communication.setStateTestJSONData('BUILDS_INIT')
    Engine.communication.setStateTestJSONData('BUILDS_CHANGE_ID')
    Engine.communication.setStateTestJSONData('BUILDS_CHANGE_ITEM')
    Engine.communication.setStateTestJSONData('BUILDS_CHANGE_NAME')
    Engine.communication.setStateTestJSONData('BUILDS_CHANGE_ICON')
    Engine.communication.setStateTestJSONData('BUILDS_BUY_BUILD')
    Engine.communication.setStateTestJSONData('BUILDS_LEVEL_UP_OR_SKILL_SPEND')
    Engine.communication.setStateTestJSONData('SETTINGS_INIT')
    Engine.communication.setStateTestJSONData('FIGHT_BEHAVIOR_DYNAMIC_LIGHT')
    Engine.communication.setStateTestJSONData('FIGHT5')
    Engine.communication.setStateTestJSONData('TO_FIGHT_5')
    */


    const communicationStopAlert = (data) => {
        log('Engine stopped.', 3);

        if (Engine.codeMessageManager.checkIpCodeExistInData(data)) {
            goToMainPageAlert();
        } else {
            reloadClient();
        }
    };

    let testJSONData = {
        CLAN_SYSTEM_MESSAGE: {
            state: false,
            getJSON: function() {
                return {
                    "businessCards": [{
                        "acc": 1406394,
                        "clan": 1325,
                        "icon": "/kuf/uni_xxvii_milosnik_u3.gif",
                        "id": 123123123123123,
                        "lvl": 120,
                        "nick": "asdasdasdasd",
                        "prof": "p",
                        "sex": true
                    }],
                    "chat": {
                        "channels": {
                            "clan": {
                                "archivedIds": [],
                                "msg": [{
                                    //"code": '{\"message\":[{\"id\":4003001,\"params\":[\"asdasdasdasd\",\"ITEM#b6c9c9b329ba06cb00e0cdd48a85e1ca1e7fcbf3ee1caa7b224df36f7556295b:\"BÅÄkitna trucizna\"\"]}]}',
                                    //"code": "{\"message\":[{\"id\":4003001,\"params\":[\"asdasdasdasd\",\"ITEM#4ad16ac3ab30da56959f5e2d074b5ef3f99e972fd87bf9860a6b32634262de09:\\\"Palce wymuszonej symbiozy\\\"\"]}]}",
                                    "code": "{\"message\":[{\"id\":4003001,\"params\":[\"asdasdasdasd\",\"ITEM#f7eae61f2259dd385fab56056895d2a21ccbe216b0a40ad35bbcbde08bb4011f:\\\"Palce wymuszonej symbiozy\\\"\"]}]}",
                                    "id": 378,
                                    "related": [123123123123123],
                                    "style": 4,
                                    "ts": 1713268543
                                }]
                            }
                        }
                    }
                }
            },
        },
        //FIGHT0: {
        //	state: false,
        //	getJSON : function () {
        //		return {}
        //	},
        //	queue: {
        //		list: [
        //			{
        //				requestDelay: 1,
        //				key: 'ASD0'
        //			},
        //			{
        //				requestDelay: 2,
        //				key: 'ASD1'
        //			}
        //		]
        //	}
        //},
        FIGHT1: {
            state: false,
            getJSON: function() {
                return {
                    "f": {
                        "init": "1",
                        "auto": "0",
                        "battleground": "dd4.jpg",
                        "skills_disabled": [],
                        "skills_combo_max": [],
                        "skills": ["-1", "", "", "", "", "", "", "", "", "", "-2", "", "", "", "", "", "", "", "", ""],
                        "w": {
                            [Engine.hero.getId()]: {
                                "originalId": Engine.hero.getId(),
                                "name": "Jaon",
                                "lvl": 333,
                                "prof": "p",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 2,
                                "y": 3,
                                "icon": "/pal/30/m_pal15.gif",
                                "buffs": 0
                            },
                            "17943": {
                                "originalId": 17943,
                                "name": "wenrzagh",
                                "lvl": 80,
                                "prof": "p",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 62,
                                "team": 2,
                                "y": 3,
                                "icon": "/noob/pm.gif",
                                "buffs": 0
                            },
                            "17998": {
                                "originalId": 17998,
                                "name": "Wyrewolwerowany Reys",
                                "lvl": 300,
                                "prof": "p",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 67,
                                "team": 2,
                                "y": 3,
                                "icon": "/noob/pm.gif",
                                "buffs": 0
                            },
                            "18156": {
                                "originalId": 18156,
                                "name": "sasfss",
                                "lvl": 33,
                                "prof": "w",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 2,
                                "y": 3,
                                "icon": "/woj/30/m_woj07.gif",
                                "buffs": 0
                            },
                            "18254": {
                                "originalId": 18254,
                                "name": "Kabuvonxa",
                                "lvl": 150,
                                "prof": "w",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 2,
                                "y": 3,
                                "icon": "/noob/wm.gif",
                                "buffs": 0
                            },
                            "123551": {
                                "originalId": 123551,
                                "name": "majcin",
                                "lvl": 300,
                                "prof": "b",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/crimson/bm.gif",
                                "mana": 0,
                                "energy": 50,
                                "mana0": 0,
                                "energy0": 50,
                                "fast": 0,
                                "ac": {
                                    "cur": 0,
                                    "bonus": 0,
                                    "destroyed": 1
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0,
                                "cooldowns": [],
                                "doublecastcost": [],
                                "combo": 0
                            },
                            "153620": {
                                "originalId": 153620,
                                "name": "Trololololo tester",
                                "lvl": 300,
                                "prof": "h",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/noob/hm.gif",
                                "mana": 0,
                                "energy": 50,
                                "mana0": 0,
                                "energy0": 50,
                                "fast": 0,
                                "ac": {
                                    "cur": 0,
                                    "bonus": 0,
                                    "destroyed": 1
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "154016": {
                                "originalId": 154016,
                                "name": "kidos tester",
                                "lvl": 300,
                                "prof": "p",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/noob/pm.gif",
                                "mana": 0,
                                "energy": 50,
                                "mana0": 0,
                                "energy0": 50,
                                "fast": 0,
                                "ac": {
                                    "cur": 0,
                                    "bonus": 0,
                                    "destroyed": 1
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "154017": {
                                "originalId": 154017,
                                "name": "kaisrokok",
                                "lvl": 300,
                                "prof": "p",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/noob/pm.gif",
                                "mana": 0,
                                "energy": 50,
                                "mana0": 0,
                                "energy0": 50,
                                "fast": 0,
                                "ac": {
                                    "cur": 0,
                                    "bonus": 0,
                                    "destroyed": 1
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "154019": {
                                "originalId": 154019,
                                "name": "To nie koniec",
                                "lvl": 300,
                                "prof": "w",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/noob/wm.gif",
                                "mana": 0,
                                "energy": 50,
                                "mana0": 0,
                                "energy0": 50,
                                "fast": 0,
                                "ac": {
                                    "cur": 0,
                                    "bonus": 0,
                                    "destroyed": 1
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "154020": {
                                "originalId": 154020,
                                "name": "Trolek super ziomek",
                                "lvl": 300,
                                "prof": "b",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/noob/bm.gif",
                                "mana": 0,
                                "energy": 50,
                                "mana0": 0,
                                "energy0": 50,
                                "fast": 0,
                                "ac": {
                                    "cur": 0,
                                    "bonus": 0,
                                    "destroyed": 1
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "154022": {
                                "originalId": 154022,
                                "name": "hejka siemka",
                                "lvl": 300,
                                "prof": "p",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/noob/pm.gif",
                                "mana": 0,
                                "energy": 50,
                                "mana0": 0,
                                "energy0": 50,
                                "fast": 0,
                                "ac": {
                                    "cur": 0,
                                    "bonus": 0,
                                    "destroyed": 1
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "154023": {
                                "originalId": 154023,
                                "name": "Kareiusz Septyzar",
                                "lvl": 1,
                                "prof": "w",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/noob/wm.gif",
                                "mana": 0,
                                "energy": 50,
                                "mana0": 0,
                                "energy0": 50,
                                "fast": 0,
                                "ac": {
                                    "cur": 0,
                                    "bonus": 0,
                                    "destroyed": 1
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "154025": {
                                "originalId": 154025,
                                "name": "Dorran Bun",
                                "lvl": 300,
                                "prof": "m",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/noob/mm.gif",
                                "mana": 0,
                                "energy": 50,
                                "mana0": 0,
                                "energy0": 50,
                                "fast": 0,
                                "ac": {
                                    "cur": 0,
                                    "bonus": 0,
                                    "destroyed": 1
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "154028": {
                                "originalId": 154028,
                                "name": "Uniwersum Arbuza",
                                "lvl": 181,
                                "prof": "w",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 98,
                                "team": 2,
                                "y": 3,
                                "icon": "/noob/wm.gif",
                                "buffs": 0
                            }
                        },
                        "myteam": 1,
                        "move": 0,
                        "current": Engine.hero.getId(),
                        "turns_warriors": {
                            "1": Engine.hero.getId(),
                            "2": 17998,
                            "3": Engine.hero.getId(),
                            "4": 153620,
                            "5": Engine.hero.getId(),
                            "6": 123551,
                            "7": 154020,
                            "8": 17998,
                            "9": 154028,
                            "10": Engine.hero.getId()
                        }
                    }
                }
            }
        },
        FIGHT2: {
            state: false,
            getJSON: function() {
                return {
                    "f": {
                        "init": "1",
                        "auto": "0",
                        "battleground": "034.jpg",
                        "skills_disabled": [58],
                        "skills_combo_max": [],
                        "skills": ["-1", "", "", "", "", "", "", "", "", "", "-2", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "58", "Lodowy pocisk", "5", "9", "2", "Wzmocnienie krysztaï¿½u energii zimna w broni sprawia, ï¿½e spowolnienie celu zostaje zwiï¿½kszone, a lodowy pocisk ma szansï¿½ zamroziï¿½ przeciwnika.", "reqp=m;reqw=frost;lvl=25", "1/10", "slowfreeze_per=30@2;freeze=10;mana=24;combo-skill=1;frostbon=0.1 ", ""],
                        "w": {
                            [Engine.hero.getId()]: {
                                "originalId": Engine.hero.getId(),
                                "name": "Abbyss tester t",
                                "lvl": 300,
                                "prof": "m",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 4,
                                "icon": "/kuf/kuf_krolo-snieg.gif",
                                "mana": 0,
                                "energy": 2000,
                                "mana0": 0,
                                "energy0": 2000,
                                "fast": 0,
                                "ac": {
                                    "cur": 0,
                                    "bonus": 0,
                                    "destroyed": 1
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0,
                                "cooldowns": [],
                                "doublecastcost": [],
                                "combo": 0
                            },
                            "-148450": {
                                "originalId": 148450,
                                "name": "Klon Klon Krï¿½lik doï¿½wiadczalny P1",
                                "lvl": 1,
                                "prof": "w",
                                "gender": "x",
                                "npc": 1,
                                "wt": 0,
                                "hpp": 100,
                                "team": 2,
                                "y": 3,
                                "icon": "dom/krolik01.gif",
                                "ac": {
                                    "cur": 1,
                                    "bonus": 0,
                                    "destroyed": 1
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 10,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "-198229": {
                                "originalId": 198229,
                                "name": "Klon Klon Hydrokora Chimeryczna",
                                "lvl": 25,
                                "prof": "h",
                                "gender": "x",
                                "npc": 1,
                                "wt": 12,
                                "hpp": 100,
                                "team": 2,
                                "y": 5,
                                "icon": "kol/hydrokora.gif",
                                "ac": {
                                    "cur": 147,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 42,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 42,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 42,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 280,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "-198556": {
                                "originalId": 198556,
                                "name": "Klon Lusgrathera Krï¿½lowa Pramatka",
                                "lvl": 17,
                                "prof": "m",
                                "gender": "x",
                                "npc": 1,
                                "wt": 1,
                                "hpp": 100,
                                "team": 2,
                                "y": 4,
                                "icon": "e2/prakrolowa.gif",
                                "ac": {
                                    "cur": 46,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 6,
                                    "bonus": 0
                                },
                                "buffs": 0
                            }
                        },
                        "myteam": 1,
                        "move": 10,
                        "start_move": 15,
                        "current": Engine.hero.getId(),
                        "turns_warriors": {
                            "3": Engine.hero.getId(),
                            "4": Engine.hero.getId(),
                            "5": Engine.hero.getId(),
                            "6": Engine.hero.getId(),
                            "7": Engine.hero.getId(),
                            "8": Engine.hero.getId(),
                            "9": Engine.hero.getId(),
                            "10": Engine.hero.getId(),
                            "11": -198229,
                            "12": Engine.hero.getId()
                        },
                        "m": ["-198229=100;0;surpass_bonus_total=40", Engine.hero.getId() + "=100;0;step", Engine.hero.getId() + "=100;0;step"],
                        "mi": [0, 1, 2]
                    }
                }
            }
        },
        FIGHT3: {
            state: false,
            getJSON: function() {
                return {
                    "f": {
                        "init": "1",
                        "auto": "0",
                        "battleground": "034.jpg",
                        "skills_disabled": [58],
                        "skills_combo_max": [],
                        "skills": ["-1", "", "", "", "", "", "", "", "", "", "-2", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "58", "Lodowy pocisk", "5", "9", "2", "Wzmocnienie krysztaï¿½u energii zimna w broni sprawia, ï¿½e spowolnienie celu zostaje zwiï¿½kszone, a lodowy pocisk ma szansï¿½ zamroziï¿½ przeciwnika.", "reqp=m;reqw=frost;lvl=25", "1/10", "slowfreeze_per=30@2;freeze=10;mana=24;combo-skill=1;frostbon=0.1 ", ""],
                        "w": {
                            [Engine.hero.getId()]: {
                                "originalId": Engine.hero.getId(),
                                "name": "Abbyss tester t",
                                "lvl": 300,
                                "prof": "m",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/kuf/kuf_krolo-snieg.gif",
                                "mana": 0,
                                "energy": 2000,
                                "mana0": 0,
                                "energy0": 2000,
                                "fast": 0,
                                "ac": {
                                    "cur": 0,
                                    "bonus": 0,
                                    "destroyed": 1
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0,
                                "cooldowns": [],
                                "doublecastcost": [],
                                "combo": 0
                            },
                            "-279166": {
                                "originalId": 279166,
                                "name": "Pradawny mag zniszczenia",
                                "lvl": 166,
                                "prof": "m",
                                "gender": "x",
                                "npc": 1,
                                "wt": 11,
                                "hpp": 100,
                                "team": 2,
                                "y": 4,
                                "icon": "hum/praork_mag2a.gif",
                                "ac": {
                                    "cur": 1769,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 51,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 26,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "-279157": {
                                "originalId": 279157,
                                "name": "Cytrusowa galareta",
                                "lvl": 65,
                                "prof": "w",
                                "gender": "x",
                                "npc": 1,
                                "wt": 0,
                                "hpp": 100,
                                "team": 2,
                                "y": 3,
                                "icon": "pot/bestia35.gif",
                                "ac": {
                                    "cur": 507,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 16,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "-279158": {
                                "originalId": 279158,
                                "name": "Cytrusowa galareta",
                                "lvl": 65,
                                "prof": "w",
                                "gender": "x",
                                "npc": 1,
                                "wt": 0,
                                "hpp": 100,
                                "team": 2,
                                "y": 3,
                                "icon": "pot/bestia35.gif",
                                "ac": {
                                    "cur": 507,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 16,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "-279159": {
                                "originalId": 279159,
                                "name": "Cytrusowa galareta",
                                "lvl": 65,
                                "prof": "w",
                                "gender": "x",
                                "npc": 1,
                                "wt": 0,
                                "hpp": 100,
                                "team": 2,
                                "y": 3,
                                "icon": "pot/bestia35.gif",
                                "ac": {
                                    "cur": 507,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 16,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "-279160": {
                                "originalId": 279160,
                                "name": "Cytrusowa galareta",
                                "lvl": 65,
                                "prof": "w",
                                "gender": "x",
                                "npc": 1,
                                "wt": 0,
                                "hpp": 100,
                                "team": 2,
                                "y": 3,
                                "icon": "pot/bestia35.gif",
                                "ac": {
                                    "cur": 507,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 16,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "-279161": {
                                "originalId": 279161,
                                "name": "Cytrusowa galareta",
                                "lvl": 65,
                                "prof": "w",
                                "gender": "x",
                                "npc": 1,
                                "wt": 0,
                                "hpp": 100,
                                "team": 2,
                                "y": 3,
                                "icon": "pot/bestia35.gif",
                                "ac": {
                                    "cur": 507,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 16,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "-279162": {
                                "originalId": 279162,
                                "name": "Pradawny mag zniszczenia",
                                "lvl": 166,
                                "prof": "m",
                                "gender": "x",
                                "npc": 1,
                                "wt": 11,
                                "hpp": 100,
                                "team": 2,
                                "y": 4,
                                "icon": "hum/praork_mag2a.gif",
                                "ac": {
                                    "cur": 1769,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 51,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 26,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "-279163": {
                                "originalId": 279163,
                                "name": "Pradawny mag zniszczenia",
                                "lvl": 166,
                                "prof": "m",
                                "gender": "x",
                                "npc": 1,
                                "wt": 11,
                                "hpp": 100,
                                "team": 2,
                                "y": 4,
                                "icon": "hum/praork_mag2a.gif",
                                "ac": {
                                    "cur": 1769,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 51,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 26,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "-279164": {
                                "originalId": 279164,
                                "name": "Pradawny mag zniszczenia",
                                "lvl": 166,
                                "prof": "m",
                                "gender": "x",
                                "npc": 1,
                                "wt": 11,
                                "hpp": 100,
                                "team": 2,
                                "y": 4,
                                "icon": "hum/praork_mag2a.gif",
                                "ac": {
                                    "cur": 1769,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 51,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 26,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "-279165": {
                                "originalId": 279165,
                                "name": "Pradawny mag zniszczenia",
                                "lvl": 166,
                                "prof": "m",
                                "gender": "x",
                                "npc": 1,
                                "wt": 11,
                                "hpp": 100,
                                "team": 2,
                                "y": 4,
                                "icon": "hum/praork_mag2a.gif",
                                "ac": {
                                    "cur": 1769,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 51,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 26,
                                    "bonus": 0
                                },
                                "buffs": 0
                            }
                        },
                        "myteam": 1,
                        "move": 15,
                        "start_move": 15,
                        "current": Engine.hero.getId(),
                        "turns_warriors": {
                            "1": Engine.hero.getId(),
                            "2": Engine.hero.getId(),
                            "3": Engine.hero.getId(),
                            "4": Engine.hero.getId(),
                            "5": Engine.hero.getId(),
                            "6": Engine.hero.getId(),
                            "7": Engine.hero.getId(),
                            "8": Engine.hero.getId(),
                            "9": Engine.hero.getId(),
                            "10": -279166
                        }
                    }
                }
            }
        },
        FIGHT4: {
            state: false,
            getJSON: function() {
                return {
                    "f": {
                        "init": "1",
                        "auto": "0",
                        "battleground": "004.jpg",
                        "skills_disabled": [],
                        "skills_combo_max": [],
                        "skills": ["-1", "", "", "", "", "", "", "", "", "", "-2", "", "", "", "", "", "", "", "", ""],
                        "w": {
                            "1021": {
                                "originalId": 1021,
                                "name": "Ayaohchi",
                                "lvl": 71,
                                "prof": "w",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/kuf/kuf_out-zil-artm.gif",
                                "mana": 0,
                                "energy": 5000,
                                "mana0": 0,
                                "energy0": 5000,
                                "fast": 0,
                                "ac": {
                                    "cur": 0,
                                    "bonus": 0,
                                    "destroyed": 1
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "1402": {
                                "originalId": 1402,
                                "name": "coffeeholic",
                                "lvl": 300,
                                "prof": "p",
                                "gender": "k",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/noob/pk.gif",
                                "mana": 1200,
                                "energy": 1500,
                                "mana0": 1200,
                                "energy0": 1500,
                                "fast": 0,
                                "ac": {
                                    "cur": 11160,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 12,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 6,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "1603": {
                                "originalId": 1603,
                                "name": "Profensja dla dzieci",
                                "lvl": 210,
                                "prof": "p",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/spec/duch-out.gif",
                                "mana": 10050,
                                "energy": 5280,
                                "mana0": 10050,
                                "energy0": 5280,
                                "fast": 0,
                                "ac": {
                                    "cur": 163320,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 6,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 7,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 9,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "1640": {
                                "originalId": 1640,
                                "name": "Testowa postaï¿½ ï¿½eï¿½ska",
                                "lvl": 222,
                                "prof": "b",
                                "gender": "k",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/bd/30/f_bd12.gif",
                                "mana": 0,
                                "energy": 5100,
                                "mana0": 0,
                                "energy0": 5100,
                                "fast": 0,
                                "ac": {
                                    "cur": 44370,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 11,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 5,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 28,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "1656": {
                                "originalId": 1656,
                                "name": "Grabarz",
                                "lvl": 300,
                                "prof": "w",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/eve/h22_lega1_m.gif",
                                "mana": 0,
                                "energy": 1500,
                                "mana0": 0,
                                "energy0": 1500,
                                "fast": 0,
                                "ac": {
                                    "cur": 4110,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "1668": {
                                "originalId": 1668,
                                "name": "Garus Tyrak",
                                "lvl": 232,
                                "prof": "p",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/paid/male_7.gif",
                                "mana": 6630,
                                "energy": 5940,
                                "mana0": 6630,
                                "energy0": 5940,
                                "fast": 0,
                                "ac": {
                                    "cur": 129390,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 16,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 12,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 5,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "1674": {
                                "originalId": 1674,
                                "name": "Lancu jeden",
                                "lvl": 300,
                                "prof": "w",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/noob/wm.gif",
                                "mana": 240,
                                "energy": 3660,
                                "mana0": 240,
                                "energy0": 3660,
                                "fast": 0,
                                "ac": {
                                    "cur": 2370,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 3,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            [Engine.hero.getId()]: {
                                "originalId": Engine.hero.getId(),
                                "name": "majcin najman",
                                "lvl": 300,
                                "prof": "w",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/paid/her_kocha_m.gif",
                                "mana": 0,
                                "energy": 2550,
                                "mana0": 0,
                                "energy0": 2550,
                                "fast": 0,
                                "ac": {
                                    "cur": 5280,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 5,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 8,
                                    "bonus": 0
                                },
                                "buffs": 0,
                                "cooldowns": [],
                                "doublecastcost": [],
                                "combo": 0
                            },
                            "1897": {
                                "originalId": 1897,
                                "name": "Menda z Rabarbaru",
                                "lvl": 500,
                                "prof": "b",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/spec/dragon.gif",
                                "mana": 0,
                                "energy": 8550,
                                "mana0": 0,
                                "energy0": 8550,
                                "fast": 0,
                                "ac": {
                                    "cur": 146550,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 15,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 6,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 36,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "1944": {
                                "originalId": 1944,
                                "name": "Girgur Moryn",
                                "lvl": 300,
                                "prof": "p",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/noob/pm.gif",
                                "mana": 0,
                                "energy": 1500,
                                "mana0": 0,
                                "energy0": 1500,
                                "fast": 0,
                                "ac": {
                                    "cur": 0,
                                    "bonus": 0,
                                    "destroyed": 1
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0
                            },
                            "-257037": {
                                "originalId": 257037,
                                "name": "Barbatos Smoczy Straï¿½nik",
                                "lvl": 285,
                                "prof": "w",
                                "gender": "x",
                                "npc": 1,
                                "wt": 100,
                                "hpp": 100,
                                "team": 2,
                                "y": 3,
                                "icon": "tyt/hebrehoth_smokoludzie.gif",
                                "ac": {
                                    "cur": 10219,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 180,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 60,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 180,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 40,
                                    "bonus": 0
                                },
                                "buffs": 0
                            }
                        },
                        "myteam": 1,
                        "move": 0,
                        "current": 1897,
                        "turns_warriors": {
                            "1": 1897,
                            "2": 1603,
                            "3": 1668,
                            "4": 1897,
                            "5": 1640,
                            "6": 1897,
                            "7": 1603,
                            "8": 1668,
                            "9": 1897,
                            "10": 1021
                        }
                    }
                }
            }
        },
        FIGHT5: {
            state: false,
            getJSON: function() {
                return {
                    "f": {
                        "init": "1",
                        "auto": "0",
                        "battleground": "034.jpg",
                        "skills_disabled": [58],
                        "skills_combo_max": [],
                        "skills": ["-1", "", "", "", "", "", "", "", "", "", "-2", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "58", "Lodowy pocisk", "5", "9", "2", "Wzmocnienie krysztaï¿½u energii zimna w broni sprawia, ï¿½e spowolnienie celu zostaje zwiï¿½kszone, a lodowy pocisk ma szansï¿½ zamroziï¿½ przeciwnika.", "reqp=m;reqw=frost;lvl=25", "1/10", "slowfreeze_per=30@2;freeze=10;mana=24;combo-skill=1;frostbon=0.1 ", ""],
                        "w": {
                            [Engine.hero.getId()]: {
                                "originalId": Engine.hero.getId(),
                                "name": "Yakuz",
                                "lvl": 300,
                                "operationLevel": 300,
                                "prof": "m",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 4,
                                "icon": "/kuf/kuf_krolo-snieg.gif",
                                "mana": 0,
                                "energy": 2000,
                                "mana0": 0,
                                "energy0": 2000,
                                "fast": 0,
                                "ac": {
                                    "cur": 0,
                                    "bonus": 0,
                                    "destroyed": 1
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0,
                                "cooldowns": [],
                                "doublecastcost": [],
                                "combo": 0
                            },
                            "-198229": {
                                "originalId": 198229,
                                "name": "Klon Hydrokora Chimeryczna",
                                "lvl": 25,
                                "operationLevel": 25,
                                "prof": "h",
                                "gender": "x",
                                "npc": 1,
                                "wt": 12,
                                "hpp": 100,
                                "team": 2,
                                "y": 5,
                                "icon": "kol/hydrokora.gif",
                                "ac": {
                                    "cur": 147,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 42,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 42,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 42,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 280,
                                    "bonus": 0
                                },
                                "buffs": 0
                            }
                        },
                        "myteam": 1,
                        "move": 10,
                        "start_move": 15,
                        "current": Engine.hero.getId(),
                        "turns_warriors": {
                            "3": Engine.hero.getId(),
                            "4": Engine.hero.getId(),
                            "5": Engine.hero.getId(),
                            "6": Engine.hero.getId(),
                            "7": Engine.hero.getId(),
                            "8": Engine.hero.getId(),
                            "9": Engine.hero.getId(),
                            "10": Engine.hero.getId(),
                            "11": -198229,
                            "12": Engine.hero.getId()
                        },
                        "m": ["-198229=100;0;surpass_bonus_total=40", Engine.hero.getId() + "=25;0;poison_lowdmg_per-enemies=8", Engine.hero.getId() + "=1;0;hp_per-allies=10"],
                        "mi": [0, 1, 2]
                    }
                }
            }
        },
        FIGHT6: {
            state: false,
            getJSON: function() {
                return {
                    "f": {
                        "init": "1",
                        "auto": "0",
                        "battleground": "034.jpg",
                        "skills_disabled": [58],
                        "skills_combo_max": [],
                        "skills": ["-1", "", "", "", "", "", "", "", "", "", "-2", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "0", "", "", "", "", "", "", "", "", "", "58", "Lodowy pocisk", "5", "9", "2", "Wzmocnienie krysztaï¿½u energii zimna w broni sprawia, ï¿½e spowolnienie celu zostaje zwiï¿½kszone, a lodowy pocisk ma szansï¿½ zamroziï¿½ przeciwnika.", "reqp=m;reqw=frost;lvl=25", "1/10", "slowfreeze_per=30@2;freeze=10;mana=24;combo-skill=1;frostbon=0.1 ", ""],
                        "w": {
                            [Engine.hero.getId()]: {
                                "originalId": Engine.hero.getId(),
                                "name": "Yakuz",
                                "lvl": 300,
                                "operationLevel": 300,
                                "prof": "m",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 4,
                                "icon": "/kuf/kuf_krolo-snieg.gif",
                                "mana": 0,
                                "energy": 2000,
                                "mana0": 0,
                                "energy0": 2000,
                                "fast": 0,
                                "ac": {
                                    "cur": 0,
                                    "bonus": 0,
                                    "destroyed": 1
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0,
                                "cooldowns": [],
                                "doublecastcost": [],
                                "combo": 0
                            },
                            "-198229": {
                                "originalId": 198229,
                                "name": "Klon Hydrokora Chimeryczna",
                                "lvl": 25,
                                "operationLevel": 25,
                                "prof": "h",
                                "gender": "x",
                                "npc": 1,
                                "wt": 12,
                                "hpp": 100,
                                "team": 2,
                                "y": 5,
                                "icon": "kol/hydrokora.gif",
                                "ac": {
                                    "cur": 147,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 42,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 42,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 42,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 280,
                                    "bonus": 0
                                },
                                "buffs": 0
                            }
                        },
                        "myteam": 1,
                        "move": 10,
                        "start_move": 15,
                        "current": Engine.hero.getId(),
                        "turns_warriors": {
                            "3": Engine.hero.getId(),
                            "4": Engine.hero.getId(),
                            "5": Engine.hero.getId(),
                            "6": Engine.hero.getId(),
                            "7": Engine.hero.getId(),
                            "8": Engine.hero.getId(),
                            "9": Engine.hero.getId(),
                            "10": Engine.hero.getId(),
                            "11": -198229,
                            "12": Engine.hero.getId()
                        },
                        "m": ["-198229=100;0;surpass_bonus_total=40", Engine.hero.getId() + "=57;0;legbon_holytouch_heal=2833", Engine.hero.getId() + "=1;0;hp_per-allies=10", Engine.hero.getId() + "=91;0;heal_per-enemies=-15", Engine.hero.getId() + "=86;0;heal_per-allies=15", Engine.hero.getId() + "=1;0;hp_per-allies=10", Engine.hero.getId() + "=25;0;poison_lowdmg_per-enemies=8", Engine.hero.getId() + "=83;" + Engine.hero.getId() + "=42;+dmg=7828;+acdmg=53;legbon_lastheal=17611,MÄÅ¼czyzna Gra(42%);-dmg=7240"],
                        "mi": [0, 1, 2]
                    }
                }
            }
        },
        FIGHT_BEHAVIOR_DYNAMIC_LIGHT: {
            state: false,
            getJSON: function() {
                return {
                    "ev": 1728374235.574001,
                    "f": {
                        "init": "1",
                        "auto": "0",
                        "battleground": "m8.jpg",
                        "skills_disabled": [],
                        "skills_combo_max": [],
                        "skills": ["-1", "", "", "", "", "", "", "", "", "", "-2", "", "", "", "", "", "", "", "", ""],
                        "w": {
                            "812": {
                                "originalId": 812,
                                "name": "Abbyss tester t",
                                "lvl": 80,
                                "prof": "p",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/noob/pm.gif",
                                "mana": 0,
                                "energy": 5000,
                                "mana0": 0,
                                "energy0": 5000,
                                "fast": 0,
                                "ac": {
                                    "cur": 0,
                                    "bonus": 0,
                                    "destroyed": 1
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0,
                                "cooldowns": [],
                                "doublecastcost": [],
                                "combo": 0
                            },
                            "-313103": {
                                "originalId": 313103,
                                "name": "Furruk Kozug",
                                "lvl": 66,
                                "prof": "m",
                                "gender": "x",
                                "npc": 1,
                                "wt": 21,
                                "hpp": 100,
                                "team": 2,
                                "y": 4,
                                "icon": "e2/gnoll12.gif",
                                "ac": {
                                    "cur": 543,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 51,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 51,
                                    "bonus": 0
                                },
                                "buffs": 0
                            }
                        },
                        "myteam": 1,
                        "move": 15,
                        "start_move": 15,
                        "current": 812,
                        "turns_warriors": {
                            "1": 812,
                            "2": 812,
                            "3": 812,
                            "4": 812,
                            "5": 812,
                            "6": 812,
                            "7": 812,
                            "8": 812,
                            "9": 812,
                            "10": 812
                        }
                    },
                    "npcs": [{
                        "icon": {
                            "id": 814
                        },
                        "id": 313103,
                        "tpl": 257636,
                        "walkover": true,
                        "x": 34,
                        "y": 2
                    }],
                    "e": "ok"
                }
            }
        },
        FIGHT_BEHAVIOR_DYNAMIC_LIGHT2: {
            state: false,
            getJSON: function() {
                return {
                    "ev": 1728890272.414115,
                    "f": {
                        "init": "1",
                        "auto": "0",
                        "battleground": "m8.jpg",
                        "skills_disabled": [],
                        "skills_combo_max": [],
                        "skills": ["-1", "", "", "", "", "", "", "", "", "", "-2", "", "", "", "", "", "", "", "", ""],
                        "w": {
                            "812": {
                                "originalId": 812,
                                "name": "Abbyss tester t",
                                "lvl": 80,
                                "prof": "p",
                                "gender": "m",
                                "npc": 0,
                                "hpp": 100,
                                "team": 1,
                                "y": 2,
                                "icon": "/noob/pm.gif",
                                "mana": 0,
                                "energy": 5000,
                                "mana0": 0,
                                "energy0": 5000,
                                "fast": 0,
                                "ac": {
                                    "cur": 0,
                                    "bonus": 0,
                                    "destroyed": 1
                                },
                                "resfire": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 0,
                                    "bonus": 0
                                },
                                "buffs": 0,
                                "cooldowns": [],
                                "doublecastcost": [],
                                "combo": 0
                            },
                            "-313052": {
                                "originalId": 313052,
                                "name": "Vonaros",
                                "lvl": 64,
                                "prof": "m",
                                "gender": "x",
                                "npc": 1,
                                "wt": 31,
                                "hpp": 100,
                                "team": 2,
                                "y": 4,
                                "icon": "e3/vonaros.gif",
                                "ac": {
                                    "cur": 546,
                                    "bonus": 0
                                },
                                "resfire": {
                                    "cur": 51,
                                    "bonus": 0
                                },
                                "resfrost": {
                                    "cur": 51,
                                    "bonus": 0
                                },
                                "reslight": {
                                    "cur": 51,
                                    "bonus": 0
                                },
                                "act": {
                                    "cur": 26,
                                    "bonus": 0
                                },
                                "buffs": 0
                            }
                        },
                        "myteam": 1,
                        "move": 15,
                        "start_move": 15,
                        "current": 812,
                        "turns_warriors": {
                            "1": 812,
                            "2": 812,
                            "3": 812,
                            "4": 812,
                            "5": 812,
                            "6": 812,
                            "7": 812,
                            "8": 812,
                            "9": 812,
                            "10": 812
                        }
                    },
                    "npcs": [{
                        "icon": {
                            "id": 19885
                        },
                        "id": 313052,
                        "tpl": 300351,
                        "walkover": true,
                        "x": 54,
                        "y": 6
                    }],
                    "e": "ok"
                }
            }
        },
        HERO_STATS: {
            state: false,
            getJSON: function() {
                return {
                    "h": {
                        "legbon_holytouch": [
                            100,
                            2833
                        ],
                        "passive_stats": {
                            "after_heal": {
                                "chance": 60,
                                "power": 8000
                            }
                        },
                        "heal": 12345
                    }
                }
            }
        },
        ASD0: {
            state: false,
            getJSON: function() {
                return {}
            }
        },
        BOOK: {
            state: false,
            getJSON: function() {
                return {
                    "book": {
                        content: 'asdasdas',
                        author: "dsadsa",
                        title: "zxczxc"
                    }
                }
            }
        },
        CALENDAR: {
            state: false,
            getJSON: function() {
                return {
                    "rewards_calendar": {
                        "start_ts": 0,
                        //"end_ts": 1540025899,
                        "end_ts": 1541116800,
                        "name_event": 'advent',
                        "background_img": "advent-background.png",
                        "day_img": "advent-windows.png",
                        "max_closed": 1,
                        "extra_opening": {
                            "price": 13,
                            "max": 2,
                            "cur": 0
                        },
                        "days": [
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [1, 1]
                        ]
                    }
                }
            }
        },
        BUILDS_ABBYSS: {
            state: false,
            getJSON: function() {
                return {
                    "matchmaking_state": 3,
                    "matchmaking_preparation": {
                        "time_left": 15,
                        "rating": 0,
                        "opponent_prof": "p",
                        "battle_sets": {
                            "0": {
                                "skill_set": 1,
                                "items": [
                                    1060344355,
                                    0,
                                    1060260819,
                                    1060321132,
                                    500387292,
                                    0,
                                    0,
                                    0
                                ]
                            },
                            "1": {
                                "skill_set": 2,
                                "items": [
                                    1060390772,
                                    1060390773,
                                    1060390774,
                                    1060390775,
                                    0,
                                    0,
                                    0,
                                    1060390777
                                ]
                            },
                            "2": {
                                "skill_set": 3,
                                "items": [
                                    0,
                                    0,
                                    0,
                                    0,
                                    1060414579,
                                    500354590,
                                    0,
                                    0
                                ]
                            },
                            "3": {
                                "skill_set": 4,
                                "items": [
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0
                                ]
                            }
                        }
                    }
                }
            }
        },
        MM_PREPARATION: {
            state: false,
            getJSON: () => {
                return {
                    "matchmaking_preparation": {
                        "selected_battle_set": 1,
                        "time_left": 15,
                        "rating": 0,
                        "opponent_prof": "p",
                        "battle_sets": {
                            "0": {
                                "skill_set": 3,
                                "items": [
                                    1060201168,
                                    500051534,
                                    1060247398,
                                    1060247397,
                                    1060309428,
                                    1060002113,
                                    0,
                                    0
                                ]
                            },
                            "1": {
                                "skill_set": 2,
                                "items": [
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0
                                ]
                            },
                            "2": {
                                "skill_set": 3,
                                "items": [
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0
                                ]
                            }
                        }
                    },
                }
            }
        },
        MM_SUMMARY: {
            state: false,
            getJSON: () => {
                return {
                    "match_summary": {
                        "shop_id": 127912,
                        "small_reward_tpl": 47331,
                        "big_reward_tpl": 47337,
                        "huge_reward_tpl": 51583,
                        "opponent_prof": "p",
                        "status": 0,
                        "placement_cur": 1,
                        "placement_max": 10,
                        "rating": 0,
                        "result": 1,
                        "rating_delta": 0,
                        "points_gained": 1,
                        "difficulty_rank": 5,
                        "daily_stage": {
                            "id": 0,
                            "points_cur": 1,
                            "points_max": 6,
                            "points_step": 3,
                            "rewards_last": 0,
                            "rewards_cur": 0,
                            "rewards_max": 2
                        }
                    }
                }
            }
        },
        SETTINGS_INIT: {
            state: false,
            getJSON: () => {
                return {
                    "settings": {
                        "action": "INIT",
                        "list": [{
                                "id": 1,
                                "d": {
                                    "v": true
                                }
                            },
                            {
                                "id": 6,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 3,
                                "d": {
                                    "v": true
                                }
                            },
                            {
                                "id": 5,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 21,
                                "d": {
                                    "v": true
                                }
                            },
                            {
                                "id": 2,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 14,
                                "d": {
                                    "v": true
                                }
                            },
                            {
                                "id": 9,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 15,
                                "d": {
                                    "v": true
                                }
                            },
                            {
                                "id": 18,
                                "d": {
                                    "v": false
                                }
                            },

                            {
                                "id": 8,
                                "d": {
                                    "v": true
                                }
                            },
                            {
                                "id": 7,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 16,
                                "d": {
                                    "v": true
                                }
                            },
                            {
                                "id": 11,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 23,
                                "d": {
                                    "v": true
                                }
                            },
                            {
                                "id": 24,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 17,
                                "d": {
                                    "v": true
                                }
                            },
                            {
                                "id": 26,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 19,
                                "d": {
                                    "v": true
                                }
                            },
                            {
                                "id": 13,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 12,
                                "d": {
                                    "v": true
                                }
                            },
                            {
                                "id": 4,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 25,
                                "d": {
                                    "v": true
                                }
                            },
                            {
                                "id": 27,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 28,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 29,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 30,
                                "d": {
                                    "v": {
                                        "autoAccept": {
                                            "v": true
                                        },
                                        "minLootV": {
                                            "v": 50,
                                            "min": 0,
                                            "max": 100
                                        },
                                        "minlifeFluidV": {
                                            "v": 50,
                                            "min": 0,
                                            "max": 100
                                        },
                                        "unique": {
                                            "v": true
                                        },
                                        "key": {
                                            "v": true
                                        },
                                        "bag": {
                                            "v": true
                                        },
                                        "gold": {
                                            "v": true
                                        },
                                        "bless": {
                                            "v": true
                                        },
                                        "tp": {
                                            "v": true
                                        },
                                        "necless": {
                                            "v": true
                                        },
                                        "quests": {
                                            "v": true
                                        },
                                        "neutral": {
                                            "v": true
                                        }
                                    }
                                }
                            }

                        ]
                    }
                }
            }
        },
        SETTINGS_UPDATE_DATA: {
            state: false,
            getJSON: () => {
                return {
                    "settings": {
                        "action": "UPDATE_DATA",
                        "list": [{
                                "id": 1,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 6,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 3,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 5,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 21,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 2,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 14,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 9,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 15,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 18,
                                "d": {
                                    "v": false
                                }
                            },
                            {
                                "id": 30,
                                "d": {
                                    "v": {
                                        "autoAccept": {
                                            "v": false
                                        }
                                    }
                                }
                            }

                        ]
                    }
                }
            }
        },
        SETTINGS_UPDATE_DATA_2: {
            state: false,
            getJSON: () => {
                return {
                    "settings": {
                        "action": "UPDATE_DATA",
                        "list": [{
                                35: {
                                    solo_auto_accept_loot: {
                                        v: 0
                                    },
                                    v: true
                                }
                            }

                        ]
                    }
                }
            }
        },
        BUILDS_INIT: {
            state: false,
            getJSON: () => {
                return { // init
                    builds: {
                        action: "INIT",
                        currentId: 0,
                        list: [{
                                id: 0,
                                name: "build",
                                iconId: 0,
                                items: [0, 0, 0, 0, 500387292, 0, 0, 500354569, 0],
                                skillsLeft: 209
                            },
                            {
                                id: 1,
                                name: "build",
                                iconId: 0,
                                items: [0, 0, 0, 0, 1060414492, 0, 0, 0, 0],
                                skillsLeft: 254
                            },
                            {
                                id: 2,
                                name: "build",
                                iconId: 0,
                                items: [0, 0, 0, 0, 1060414579, 500354590, 0, 0, 0],
                                skillsLeft: 222
                            }
                        ],
                        listToBuy: [{
                                id: 3,
                                cost: {
                                    gold: 250000,
                                    credits: 25
                                }
                            },
                            {
                                id: 4,
                                cost: {
                                    gold: 500000,
                                    credits: 50
                                }
                            },
                            {
                                id: 5,
                                cost: {
                                    gold: 1000000,
                                    credits: 75
                                }
                            }
                        ]
                    }
                }
            }
        },
        BUILDS_INIT_MORE_BUILDS: {
            state: false,
            getJSON: () => {
                return { // init
                    builds: {
                        action: "INIT",
                        currentId: 0,
                        list: [{
                                id: 0,
                                name: "build",
                                iconId: 0,
                                items: [0, 0, 0, 0, 500387292, 0, 0, 500354569, 0],
                                skillsLeft: 209
                            },
                            {
                                id: 1,
                                name: "build",
                                iconId: 0,
                                items: [0, 0, 0, 0, 0, 1060414492, 0, 0, 0],
                                skillsLeft: 254
                            },
                            {
                                id: 2,
                                name: "build",
                                iconId: 0,
                                items: [0, 0, 0, 0, 1060414579, 500354590, 0, 0, 0],
                                skillsLeft: 222
                            }
                        ],
                        listToBuy: [{
                                id: 3,
                                cost: {
                                    gold: 250000,
                                    credits: 25
                                }
                            },
                            {
                                id: 4,
                                cost: {
                                    gold: 500000,
                                    credits: 50
                                }
                            },
                            {
                                id: 5,
                                cost: {
                                    gold: 1000000,
                                    credits: 75
                                }
                            },
                            {
                                id: 6,
                                cost: {
                                    gold: 250000,
                                    credits: 25
                                }
                            },
                            {
                                id: 7,
                                cost: {
                                    gold: 500000,
                                    credits: 50
                                }
                            },
                            {
                                id: 8,
                                cost: {
                                    gold: 1000000,
                                    credits: 75
                                }
                            }
                        ]
                    }
                }
            }
        },
        BUILDS_CHANGE_ID: {
            state: false,
            getJSON: (additionalData) => {
                return {
                    builds: {
                        action: "UPDATE_CURRENT_ID",
                        currentId: isset(additionalData.currentId) ? additionalData.currentId : 1
                    }
                }
            }
        },
        BUILDS_CHANGE_ITEM: {
            state: false,
            getJSON: () => {
                return {
                    builds: {
                        action: "UPDATE_DATA",
                        list: [{
                                id: 0,
                                items: [0, 0, 0, 0, 0, 0, 0, 500354569, 0]
                            },
                            {
                                id: 1,
                                items: [0, 0, 0, 0, 500387292, 1060414492, 0, 500354569, 0]
                            }
                        ]
                    }
                }
            }
        },
        BUILDS_CHANGE_NAME: {
            state: false,
            getJSON: (additionalData) => {
                return {
                    builds: {
                        action: "UPDATE_DATA",
                        list: [{
                            id: isset(additionalData.id) ? additionalData.id : 1,
                            name: isset(additionalData.name) ? additionalData.name : "asdasd"
                        }]
                    }
                }
            }
        },
        BUILDS_CHANGE_ICON: {
            state: false,
            getJSON: () => {
                return {
                    builds: {
                        action: "UPDATE_DATA",
                        list: [{
                            id: 2,
                            iconId: 5
                        }]
                    }
                }
            }
        },
        BUILDS_BUY_BUILD: {
            state: false,
            getJSON: (additionalData) => {
                return {
                    builds: {
                        action: "BUY_BUILD",
                        list: [{
                            id: isset(additionalData.id) ? additionalData.id : 3,
                            name: "build",
                            iconId: 0,
                            items: [0, 0, 0, 0, 1060414579, 500354590, 0, 0, 0],
                            skillsLeft: 276
                        }]
                    }
                }
            }
        },
        BUILDS_LEVEL_UP_OR_SKILL_SPEND: {
            state: false,
            getJSON: () => {
                return {
                    builds: {
                        action: "UPDATE_DATA",
                        list: [{
                                id: 0,
                                skillsLeft: 300
                            },
                            {
                                id: 1,
                                skillsLeft: 300
                            },
                            {
                                id: 2,
                                skillsLeft: 300
                            }
                        ]
                    }
                }
            }
        }
    };

    let testJSONDataQueue = [];

    this.setStateTestJSONData = (key, additionalData) => {
        for (let k in testJSONData) {
            if (k == key) {
                testJSONData[k].state = true;
                testJSONData[k].additionalData = isset(additionalData) ? additionalData : {};
                return
            }
        }

        errorReport("Communication.js", "setStateTestJSONData", `notExist ${key}`, testJSONData);
    }

    const manageTestJSONAData = (data) => {
        for (let k in testJSONData) {
            if (testJSONData[k].state) {
                testJSONData[k].state = false;

                let json = testJSONData[k].getJSON(testJSONData[k].additionalData);

                for (let kk in json) {
                    data[kk] = json[kk];
                }


                if (testJSONData[k].queue) {
                    let list = testJSONData[k].queue.list;
                }
            }
        }
    };

    //this.manageSrajAfterSuccessRespond = () => {
    //	Engine.rajController.setAddSrajToQueue(false);
    //	Engine.rajController.callSrajQueue()
    //	Engine.rajController.clearRajQueue();
    //}

    //var lag = null;
    this.parseJSON = function(data) {

        let reload = false;

        manageTestJSONAData(data);

        self.setFirstCallEv(data);
        /*														// next time  #54862
        		if (checkFistTReload(data)) {
        			reload = true;
        			callReloadProcedure();

        			const action = Engine.windowsData.windowCloseConfig.RELOAD;
        			Engine.windowCloseManager.callWindowCloseConfig(action);

        			if (data.e) {
        				callEProcedure(data.e);
        			}
        		}
        */
        Engine.rajController.manageSrajBeforeSuccessRespond();

        //for (var i in data) {
        //	var fun = 'before_on_' + i;
        //	if (data.hasOwnProperty(i) && typeof(this.dispatcher[fun]) == 'function') {
        //		self.dispatcher[fun](data[i], data);
        //	}
        //}
        //
        //for (var i in data) {
        //
        //	if (i == "ev") continue;
        //	var fun = 'on_' + i;
        //	if (data.hasOwnProperty(i) && typeof(this.dispatcher[fun]) == 'function') {
        //		self.dispatcher[fun](data[i], data);
        //	}
        //}
        //
        //for (var i in data) {
        //	var fun = 'after_on_' + i;
        //	if (data.hasOwnProperty(i) && typeof(this.dispatcher[fun]) == 'function') {
        //		self.dispatcher[fun](data[i], data);
        //	}
        //}

        if (!reload) {
            callDispacher(data);
        }

        if (Engine.getInitLvl() != 4) {
            //self.manageSrajAfterSuccessRespond();
            Engine.rajController.manageSrajAfterSuccessRespond();
        }

        //let lag = ts() - Engine.ats;
        //Engine.interface.heroElements.updateLag(lag);
        Engine.interface.heroElements.endLag();
    };

    const callDispacher = (data) => {
        for (var i in data) {
            var fun = 'before_on_' + i;
            if (data.hasOwnProperty(i) && typeof(this.dispatcher[fun]) == 'function') {
                self.dispatcher[fun](data[i], data);
            }
        }

        for (var i in data) {

            if (i == "ev") continue;
            var fun = 'on_' + i;
            if (data.hasOwnProperty(i) && typeof(this.dispatcher[fun]) == 'function') {
                self.dispatcher[fun](data[i], data);
            }
        }

        for (var i in data) {
            var fun = 'after_on_' + i;
            if (data.hasOwnProperty(i) && typeof(this.dispatcher[fun]) == 'function') {
                self.dispatcher[fun](data[i], data);
            }
        }
    }

    this.setFirstCallEv = (data) => {
        //if (!Engine.ev && data.ev) {
        if (data.ev) {
            this.dispatcher.on_ev(data.ev);
        }
    };

    const checkFistTReload = (data) => {
        return data.t && data.t == "reload"
    }

    const callReloadProcedure = () => {
        Engine.reload = true;
        Engine.onClear();
        Engine.map.setDrawable(false);
        Engine.map.setOffsetIsSet(false);
        Engine.map.setUnlock(false);
        if (Engine.logOff) {
            Engine.stop();
            Engine.logOff.out();
            return;
        }
        Engine.reCallInitQueue();
    };

    const callEProcedure = (v) => {
        if (v != 'ok') {
            error(v);
        }
    };

    this.dispatcher = {
        on_town: function(v) {
            Engine.map.updateDATA(v)
        },
        before_on_businessCards: function(v) {
            Engine.businessCardManager.updateData(v)
        },
        //after_on_commercials: function (v) {
        //	Engine.commercials.updateData(v)
        //},
        before_on_sraj_tpl: function(data) {
            getEngine().srajStore.updateData(data);
        },
        after_on_sraj: function(data) {
            if (Engine.getInitLvl() == 2) {
                //let srajData = Engine.srajStore.getSrajTemplate(data[0].id, "APPEAR");
                //Engine.map.setSraj(JSON.parse(srajData));
                //Engine.map.callMapSraj(true);
                return
            }
            getEngine().rajController.callSrajFromEngine(data, "APPEAR");
        },
        after_on_sraj_cancel: function(data) {
            if (Engine.getInitLvl() == 2) {
                return
            }
            getEngine().rajController.callSrajFromEngine(data, "CANCEL");
        },
        after_on_raj: function(data) {
            if (elementIsArray(data)) {
                for (let k in data) {
                    Engine.rajController.parseJSON(data[k]);
                }
            } else Engine.rajController.parseJSON(data);
        },
        on_theme: function(v) {
            // Engine.themeController.updateData(v, 1)
            Engine.themeController.updateData(v, ThemeData.THEME_KIND.EVENT)
        },
        on_h: function(v, allData) {
            Engine.hero.updateDATA(v, allData);
            Engine.hero.setHeroAlreadyInitialised();
            //API.callEvent('heroUpdate', Engine.hero);
            API.callEvent(Engine.apiData.HERO_UPDATE, Engine.hero);
        },
        on_cl: function(v) {
            Engine.map.setCollisions(v)
        },
        on_js_script: function(v) {
            eval(v);
        },
        //on_time: function (v) {
        //	Engine.setServerTime(v)
        //},
        on_ev: function(v) {
            Engine.setEv(v);
            //Engine.ev = v;
            Engine.reconnect.stop();
        },
        on_browser_token: function(v) {
            Engine.browserToken = v;
        },
        before_on_icons: function(v) {
            Engine.npcIconManager.updateData(v);
        },
        before_on_npc_tpls: function(v) {
            Engine.npcTplManager.updateData(v);
        },
        before_on_npcs_del: function(v) {
            Engine.npcs.updateData_npcs_del(v);
            Engine.miniMapController.handHeldMiniMapController.getMiniMapNpcController().updateData_npcs_del(v);
        },
        after_on_timer: function(v) {
            Engine.interfaceTimerManager.updateData(v)
        },
        on_npcs: function(v) {
            Engine.npcs.updateData(v)
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 2);
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 2);
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 4);
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 5);
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 5);
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 20);
        },
        on_other: function(v) {
            Engine.others.updateData(v)
        },
        on_emo: function(v) {
            Engine.emotions.updateData(v)
        },
        on_pet: function(v, data) {
            Engine.hero.updatePet(v, data);
        },
        on_f: function(v, data) {
            if (Engine.skills) Engine.skills.close(v);
            //var bS = Engine.battleSummary;
            //if (v.init == 1 && Engine.battle) {
            //	if (bS && bS.visible && !bS.youDie) Engine.battle.close(true);
            //}
            //if (v.init == 1 && Engine.battle) {
            //	if (!bS.youDie) Engine.battle.close(true);
            //}
            //if (v.init == 1 &&  Engine.battle && Engine.battle.show) Engine.battle.close(true);
            if (v.init == 1 && Engine.battle.getShow()) {
                Engine.battle.close(v, true);
            }

            //if (!Engine.battle) {
            //	Engine.battle = new Battle();
            //	Engine.battle.init();
            //}
            Engine.battle.updateData(v, data);
        },
        on_d: function(v, data) {
            if (v == -1) return;
            // if (Engine.dialogue) Engine.dialogue.talk(v);
            // else {
            // 	Engine.dialogue = new Dialogue();
            // 	Engine.dialogue.init();
            // 	Engine.dialogue.talk(v);
            // }
            if (!Engine.dialogue) {
                Engine.dialogue = new Dialogue();
                Engine.dialogue.init();
            }
            Engine.dialogue.talk(v, data);
            // (Engine.tutorials) Engine.tutorials.talk();
        },
        on_gw2: function(v, data) {
            Engine.map.gateways.updateData(v, data['townname']);
            Engine.miniMapController.updateWindowMiniMapGatewaysPos(data)
        },
        on_msg: function(v, d) {
            for (var k in v) {
                if (d['msg'][k].substr(0, 3) == 'ach') {
                    achMessage(d['msg'][k]);
                } else {
                    message(d['msg'][k]);
                }
            }
        },
        on_message: function(v) {
            for (let i = 0; i < v.length; i++) {
                Engine.codeMessageManager.updateData(v[i], CodeMessageData.SOURCE.MESSAGE);
            }
        },
        on_item: function(v) {
            Engine.items.updateDATA(v)
        },
        on_item_tpl: function(v) {
            // console.log('start tpl items');
            var now = new Date().getTime();
            Engine.tpls.updateDATA(v);
            // console.log('stop  tpl items', ((new Date().getTime()) - now) / 1000);
        },
        on_lag: function(v) {
            $('#lagometer').html('Ping: ' + Math.min(v, 9999) + 'ms');
        },
        on_alert: function(v, d) {
            var callback = false;
            if (d.redirect) { // for logout message
                callback = [{
                    txt: 'OK',
                    callback: function() {
                        window.location.href = 'https://' + d.redirect;
                        return true;
                    }
                }];
            }

            mAlert(parsePopupBB(v), callback);
        },
        on_ask: function(v, d) {
            if (isset(v.q))
                v.q = parsePopupBB(v.q);
            var $ask = askAlert(v);
            //API.callEvent('newAsk', [v, $ask]);
            API.callEvent(Engine.apiData.NEW_ASK, [v, $ask]);
        },
        on_alert2: function(v, d) {
            mAlert2(parsePopupBB(v));
        },
        on_logoff_time_left: function(v) {
            if (!Engine.logOff) {
                Engine.logOff = new LogOff();
                Engine.logOff.init();
            }
            Engine.logOff.update(v);
        },
        on_t: function(v, d) {
            switch (v) {
                case 'stop':
                    if (isset(d['wait_for'])) {
                        //Engine.stop();
                        let waitForSec = isset(d['wait_for_sec']) ? (d['wait_for_sec'] * 1000) : 1000;
                        message(d['wait_for'], true);
                        setTimeout(function() {
                            Engine.start();
                            Engine.reCallInitQueue();
                        }, waitForSec);
                        return false;
                    } else {
                        communicationStopAlert(d);
                    }
                    Engine.stop();
                    break;
                case 'reload':

                    //if (d['town_changed']) Engine.reloadStats = false;
                    //else                   Engine.reloadStats = true;


                    //Engine.reloadStats = true;

                    //if (d.n == "Done.<br>" || d.hasOwnProperty('dead')) Engine.reloadStats = false;

                    //Engine.reload = true;
                    //Engine.onClear();
                    //Engine.map.setDrawable(false);
                    //Engine.map.setOffsetIsSet(false);
                    //Engine.map.setUnlock(false);
                    //if (Engine.logOff) {
                    //	Engine.stop();
                    //	Engine.logOff.out();
                    //	return;
                    //}
                    //Engine.reCallInitQueue();
                    callReloadProcedure();
                    break;
                case 'force_reload':
                    pageReload();
                    break;
            }

            const action = Engine.windowsData.windowCloseConfig.RELOAD;
            Engine.windowCloseManager.callWindowCloseConfig(action);
        },
        on_w: function(v) {
            warn(v);
        },
        on_walking: function(v) {
            getEngine().startFightBlockade.updateData(v);
        },
        on_e: function(v) {
            //if (v != 'ok') error(v);
            callEProcedure(v);
        },
        //on_clientver: function (v) {
        //	Engine.clientVer = v;
        //},
        //on_c: function (v) {
        //	Engine.chat.newMessages(v);
        //},
        on_chat: function(v) {
            Engine.chatController.getChatDataUpdater().updateData(v);
        },
        //on_cls: function (v) {
        //	Engine.chat.clear(v);
        //},
        on_battle_pass: function(v) {
            if (!Engine.battlePass) {
                Engine.battlePass = new BattlePass();
                Engine.battlePass.init();
            }
            Engine.battlePass.updateData(v);
        },
        on_loot: function(v, allData) {
            if (Engine.loots && Engine.loots.wnd.isShow() && v.init && Engine.allInit) Engine.loots.deleteItemsAndCloseLootWindow();

            Loot.update(v, allData); //allData for get ev on init4 for loot counter
            Engine.loots = Loot;
            var timer = v.endTs;
            //API.callEvent('loot_update', v);
            API.callEvent(Engine.apiData.LOOT_UPDATE, v);
            if (timer === 0) delete(Engine.loots);
        },
        on_shop: function(v) {
            if (isset(v.sellAction) || isset(v.buyAction)) {
                if (Engine.shop) Engine.shop.sellOrBuyAction(v);
                return;
            }
            var superMarket = 479;
            var chestId = isPl() ? 436 : '';
            var promoId = 190;
            var id = v.id;

            var showChest = id == chestId;
            var showPromo = id == promoId;
            if (Engine.chests) Engine.chests.close();
            if (showChest || showPromo) {
                if (showChest && !Engine.chests) {
                    Engine.chests = new Chests(v);
                    Engine.chests.init();
                }
                if (showPromo && !Engine.promo) Engine.promo = new Promo(v);
            } else {
                if (!Engine.shop) {
                    Engine.shop = new Shop();
                    Engine.shop.init(v);
                } else {
                    Engine.shop.close();
                    Engine.shop = new Shop();
                    Engine.shop.init(v, true);
                }
                if (id == superMarket) {
                    Engine.shop.callSuperMarket();
                }
            }
        },
        on_choose_outfit: function(v) {
            if (Engine.chooseOutfit) Engine.chooseOutfit.close();
            Engine.chooseOutfit = new ChooseOutfit();
            Engine.chooseOutfit.init();
            Engine.chooseOutfit.update(v);
        },
        on_game: function(v) {
            if (Engine.getInitLvl() == 4 && Engine.interface.getAlreadyInitialised()) {
                return;
            }
            getEngine().miniGames.initGame(v)
        },
        after_on_mails: function(v) {
            if (!Engine.mails) {
                Engine.mails = new MailsManager();
                Engine.mails.init();
            }
            Engine.mails.updateData(v);
        },
        on_recovery: function(v) {
            Engine.recoveryItems = new RecoveryItems();
            Engine.recoveryItems.init();
            Engine.recoveryItems.update(v);
        },
        on_friends: function(v) {
            const FRIEND = SocietyData.KIND.FRIEND;
            if (!Engine.society) {
                Engine.society = new Society();
                Engine.society.init();
                Engine.society.setVisible(FRIEND, true);
            }
            Engine.society.updateData(v, FRIEND);
        },
        on_enemies: function(v) {
            const ENEMY = SocietyData.KIND.ENEMY;
            if (!Engine.society) {
                Engine.society = new Society();
                Engine.society.init();
                Engine.society.setVisible(ENEMY, true);
            }
            Engine.society.updateData(v, ENEMY);
        },
        on_party: function(v, data) {
            if (!Engine.party) {
                Engine.party = new Party(data);
                Engine.party.init(data);
            }
            Engine.party.update(data);
        },
        // on_partyexp: function (v) {
        // 	Engine.party.setPercentAmount(v)
        // },
        // on_partygrpkill: function (v) {
        // 	Engine.party.setPartyGrpKill(v);
        // },
        on_trade: function(v) {
            if (!Engine.trade) {
                Engine.trade = new Trade(v.init);
                Engine.trade.init();
            }
            Engine.trade.update(v);
        },
        on_wanted: function(v) {
            if (!Engine.wantedController) {
                Engine.wantedController = new WantedController.WantedController();
                Engine.wantedController.init();
            }
            Engine.wantedController.updateList(v);
        },
        on_dead: function(v) {
            Engine.deadController.update(v);
        },
        // on_qtrack: function (v, data) {
        // 	if (!Engine.hero.d.hasOwnProperty('id') && isset(data.h)) {
        // 		Engine.hero.d.id = data.h.id;
        // 	}
        // 	//if (Engine.hero.d.hasOwnProperty('id')) {
        // 		if (!Engine.questTrack) {
        // 			Engine.questTrack = new QuestTracking();
        // 			Engine.questTrack.init();
        // 		}
        // 		Engine.questTrack.updateData(v, data);
        // 	//}
        // },
        // on_settrack: function (v) {
        // 	if (!Engine.questTrack) {
        // 		Engine.questTrack = new QuestTracking();
        // 		Engine.questTrack.init();
        // 	}
        // 	Engine.questTrack.startTracking(v, true);
        // },
        on_codeprom: function(v) {
            Engine.codeProm.initPrize(v);
        },
        on_registration: function(v) {
            if (!Engine.registration) {
                Engine.registration = new Registration();
                Engine.registration.init();
            }
            Engine.registration.update(v);
        },
        on_force_regcomplete: function() {
            Engine.interface.registrationCall();
        },
        on_rip: function(v) {
            Engine.map.rip.updateData(v);
        },
        on_auctions: function(v) {
            if (!Engine.auctions) {
                Engine.auctions = new AuctionManager();
                Engine.auctions.init();
            }
            Engine.auctions.updateData(v);

            //API.callEvent('auctions_update', v);
            API.callEvent(Engine.apiData.AUCTIONS_UPDATE, v);
        },
        // on_myah: function (v) {
        // 	// if (!Engine.auctions) {
        // 	// 	Engine.auctions = new Auctions();
        // 	// 	Engine.auctions.init();
        // 	// }
        // 	// Engine.auctions.update_myah(v);
        //
        // 	if (!Engine.auction) {
        // 		Engine.auction = new AuctionManager();
        // 		Engine.auction.init();
        // 	}
        // 	// Engine.auction.updateData(v);
        // 	Engine.auction.updateData(v, AuctionData.KIND_MY_AUCTION.MY_AUCTION_OFF);
        //
        // 	API.callEvent('ah_myah_update');
        // },
        // on_mybids: function (v) {
        // 	//if (!Engine.auctions) {
        // 	//	Engine.auctions = new Auctions();
        // 	//	Engine.auctions.init();
        // 	//}
        // 	//Engine.auctions.update_mybids(v);
        // 	if (!Engine.auction) {
        // 		Engine.auction = new AuctionManager();
        // 		Engine.auction.init();
        // 	}
        // 	Engine.auction.updateData(v, AuctionData.KIND_MY_AUCTION.MY_BID);
        // 	API.callEvent('ah_mybids_update');
        // },
        // on_ah: function (v) {
        // 	//if (!Engine.auctions) {
        // 	//	Engine.auctions = new Auctions();
        // 	//	Engine.auctions.init();
        // 	//}
        // 	//Engine.auctions.update_ah(v);
        // 	if (!Engine.auction) {
        // 		Engine.auction = new AuctionManager();
        // 		Engine.auction.init();
        // 	}
        // 	Engine.auction.updateData(v, AuctionData.KIND_OTHERS_AUCTION.ALL_AUCTION);
        // 	API.callEvent('ah_ah_update');
        // },
        // on_ahp: function (v) {
        // 	//if (!Engine.auctions) {
        // 	//	Engine.auctions = new Auctions();
        // 	//	Engine.auctions.init();
        // 	//}
        // 	//Engine.auctions.update_ahp(v);
        // 	if (!Engine.auction) {
        // 		Engine.auction = new AuctionManager();
        // 		Engine.auction.init();
        // 	}
        // 	console.log('ahp', v);
        // 	Engine.auction.updateData(v, AuctionData.UPDATE_PAGES);
        // 	API.callEvent('ah_ahp_update');
        // },
        after_on_depo_opentabs: function(v) {
            if (!getEngine().depo) {
                return
            }

            let depo = getEngine().depo;
            let depoOpenTabs = depo.getDepoOpenTabs();
            let beforeFirstUpdate = depoOpenTabs.getBeforeFirstUpdate();

            depoOpenTabs.updateData(v);
            depo.updateNotLoadedItemsCards();
            depo.hideLoadItemsOverlay();
            depo.searchDepoItem();
            depo.appendItemGrid();
            depo.manageMultiZeroZero();

            if (beforeFirstUpdate) {
                let tabToShow = depoOpenTabs.getTabToShow(v);
                depo.setVisible(tabToShow);
            }
        },
        on_depo: function(v) {
            if (!Engine.depo) {
                Engine.depo = new Depo(false);
                Engine.depo.init();
                //API.callEvent('depo_init');
                API.callEvent(Engine.apiData.DEPO_INIT);
            }
            Engine.depo.updateData(v);
            //API.callEvent('depo_update');
            API.callEvent(Engine.apiData.DEPO_UPDATE);
        },
        on_clan_depo: function(v) {
            if (!Engine.depo) {
                Engine.depo = new Depo(true);
                Engine.depo.init();
                //API.callEvent('clan_depo_init');
                API.callEvent(Engine.apiData.CLAN_DEPO_INIT);
            }
            Engine.depo.updateData(v);
            //API.callEvent('clan_depo_update');
            API.callEvent(Engine.apiData.CLAN_DEPO_UPDATE);
        },
        on_clanmap: function(v) {
            if (!Engine.clan) {
                Engine.clan = new Clan();
                Engine.clan.init();
            }
            Engine.clan.updateClanList(v);
        },
        on_myclan: function(v, allData) {
            if (!Engine.clan) {
                Engine.clan = new Clan();
                Engine.clan.init();
            }
            Engine.clan.update(v, allData);
            Engine.clan.updateClasses(v);
        },
        on_clan: function(v) { //after click on clan list
            Engine.clan.updateOtherClan(v);
            Engine.clan.updateOtherClanOfficialPage(v);
        },
        on_members: function(v) {
            if (!Engine.clan) {
                Engine.clan = new Clan();
                Engine.clan.init();
            }
            Engine.clan.updateMembers(v);
        },
        on_clan_fr: function(v, allData) {
            if (!Engine.clan) {
                Engine.clan = new Clan();
                Engine.clan.init();
            }
            Engine.clan.updateDiplomacy(v, 'Friend');
            if (isset(allData.myclan)) {
                Engine.clan.showChooseCard('clan', 'clan-diplomacy');
                Engine.clan.setActiveTab('diplomacy');
            }
        },
        on_clan_en: function(v, allData) {
            if (!Engine.clan) {
                Engine.clan = new Clan();
                Engine.clan.init();
            }
            Engine.clan.updateDiplomacy(v, 'Enemy');
            if (isset(allData.myclan)) {
                Engine.clan.showChooseCard('clan', 'clan-diplomacy');
                Engine.clan.setActiveTab('diplomacy');
            }
        },
        on_clan_skills: function(v) {
            Engine.clan.updateClanSkills(v);
        },
        on_clan_quests: function(v) {
            Engine.clan.updateClanQuests(v);
        },
        on_clan_skills_blessing: function(v) {
            Engine.clan.updateClanBless(v);
        },
        on_clan_applications: function(v) {
            Engine.clan.updateRecruit({
                'clan_applications': v
            });
        },
        on_clan_invitations: function(v) {
            Engine.clan.updateRecruit({
                'clan_invitations': v
            });
        },
        on_calendar: function(v) {
            if (!Engine.eventCalendar) {
                Engine.eventCalendar = new EventCalendar();
                Engine.eventCalendar.init();
            }
            Engine.eventCalendar.updateData(v);
        },
        // on_advent: function (v) {
        // 	if (!Engine.adventCalendar) {
        // 		Engine.adventCalendar = new AdventCalendar();
        // 		Engine.adventCalendar.init();
        // 	}
        // 	Engine.adventCalendar.updateData(v);
        // },
        on_player_reset: function(v) {
            if (Engine.characterReset) {
                Engine.characterReset.onClear();
            }

            Engine.characterReset = new CharacterReset();
            Engine.characterReset.init();
            Engine.characterReset.updateData(v);
        },
        on_book: function(v) {
            if (!Engine.book) {
                Engine.book = new Book();
                Engine.book.init();
            }
            Engine.book.updateData(v);
        },
        on_motel: function(v) {
            if (!Engine.motel) {
                Engine.motel = new Motel();
                Engine.motel.init();
            }
            Engine.motel.updateData(v);
        },
        on_world_time: function(v) {
            Engine.worldTime = v;
        },
        "on_conquer-stats": function(v) {
            if (!Engine.conquerStats) Engine.conquerStats = new ConquerStats();
            Engine.conquerStats.init(v);
        },
        on_gold_pricelist: function(v) {
            if (!Engine.goldShop) {
                Engine.goldShop = new GoldShop();
                Engine.goldShop.init();
            }
            Engine.goldShop.update(v);
        },
        on_skill_list: function(v, allData) {
            if (!Engine.skills) {
                Engine.skills = new Skills();
                Engine.skills.init();
            }
            if (Engine.skills.MBEditor) Engine.skills.MBEditor.saveAndClose();
            Engine.skills.update(v, allData);
        },
        on_skills_learnt: function(v) {
            if (!Engine.skills) Engine.skills = new Skills();
            Engine.skills.updateSkillsLearnt(v);
        },
        on_skills_total: function(v) {
            if (!Engine.skills) Engine.skills = new Skills();
            Engine.skills.updateSkillsTotal(v);
        },
        on_selectedskills: function(v) {
            Engine.skills.updateSelectedSkills(v);
        },
        on_freeskills_ts: function(v) {
            if (!Engine.skills) Engine.skills = new Skills();
            Engine.skills.updateFreeSkills(v);
        },
        on_battleskills: function(v) {
            if (Engine.skills) {
                if (!Engine.skills.MBEditor) Engine.skills.initBattleEditor();
                Engine.skills.MBEditor.updateEditor(v);
            }
        },
        //on_quests: function (v) {
        //before_on_quests: function (v, allData) {
        //	//console.log(v);
        //	if (!Engine.questsManager) Engine.questsManager = new QuestsManager();
        //	Engine.questsManager.update(v, allData);
        //	Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 5);
        //	Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 5);
        //},
        before_on_quests: function(v, allData) {
            let newData = {};
            for (let k in v) {
                newData[k] = v[k];
            }

            if (newData['track']) delete newData['track'];
            if (newData['set_track']) delete newData['set_track'];

            if (!Engine.questsManager) Engine.questsManager = new QuestsManager();
            Engine.questsManager.update(newData, allData);
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 5);
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 5);

        },
        after_on_quests: function(v, allData) {

            let setTrack = v['set_track'];
            let track = v['track'];

            //if (track) getEngine().questTracking.updateData(v['track'])

            if (track) {
                getEngine().questsManager.update({
                    update_data_track: track
                })
            }

            if (getEngine().isInitLoadTime()) {
                if (setTrack) {
                    //getEngine().questTracking.saveActiveQuestTrackingInStorage(setTrack)
                    getEngine().questsManager.update({
                        update_data_set_track: setTrack
                    })
                }


                if (getEngine().interface.getInterfaceStart()) {
                    getEngine().quests.refreshTrackQuestButtons();
                }

                return
            }

            if (setTrack) {
                getEngine().questsManager.update({
                    set_track: setTrack
                }, allData);
                //getEngine().quests.refreshTrackQuestButtons();
                return
            }

            if (track) {
                getEngine().questsManager.update({
                    track: track
                }, allData);
                //getEngine().questTracking.startTrackingIfActiveTrackingQuestExist();
                //getEngine().quests.refreshTrackQuestButtons();
            }
        },
        on_config: function(v) {
            Engine.serverStorage.updateData(v);
        },
        before_on_tutorial: function(v) {
            //console.log('on_tutorial');
            Engine.tutorialValue = v;
            if (Engine.settings && !isEn()) {
                Engine.settings.setLabelOfTutorialBtn();
            }
        },
        on_progressbar: function(v) {
            Engine.map.questProgressBar.updateData(v);
        },
        on_artisanship: function(v, allData) {
            if (v.open) {
                if (isset(allData.enhancement.usages_preview)) Engine.crafting.enhanceUsages = allData.enhancement.usages_preview;
                Engine.crafting.open(v.open);
            } else if (v.close) {
                Engine.crafting.close();
            }
        },
        on_recipes: function(v) {
            // if (!Engine.recipes) {
            // 	Engine.recipes = new Recipes();
            // 	Engine.recipes.init();
            // }
            // Engine.recipes.update(v);

            Engine.crafting.open('recipes', v);
        },
        before_on_settings: function(v) {
            Engine.settingsStorage.updateData(v);
        },
        on_settings: function(v) {
            Engine.settings.updateData();
        },
        on_enhancement: function(v) {
            if (Engine.crafting && Engine.crafting.enhancement) {
                Engine.crafting.enhancement.update(v);
            }
        },
        on_extractor: function(v) {
            if (Engine.crafting && Engine.crafting.extraction) {
                Engine.crafting.extraction.update(v);
            }
        },
        after_on_extractor: function(v) {
            if (Engine.crafting && Engine.crafting.extraction && isset(v.completed)) {
                Engine.crafting.extraction.update(v);
            }
        },
        on_salvager_preview: function(v) {
            if (isset(Engine.crafting.salvage)) {
                Engine.crafting.salvage.update(v);
            }
        },
        on_battle_summary: function(v, data) {
            //if (!Engine.battleSummary) Engine.battleSummary = new BattleSummary();
            //Engine.battleSummary.update(v);
            //API.callEvent('show_battle_summary', v);
        },
        on_n: function(v) {
            log(v);
        },
        on_minimap: function(data) {
            Engine.miniMapController.updateGlobalMap(data);
        },
        on_matchmaking_history: function(v) {
            Engine.matchmaking.updateHistory(v);
        },
        on_matchmaking_statistics: function(v) {
            Engine.matchmaking.updateStatistics(v);
        },
        on_matchmaking_ladder_global: function(v) {
            Engine.matchmaking.updateRanking(v, '.general-ranking-wnd', 'global');
        },
        on_matchmaking_ladder_clan: function(v) {
            Engine.matchmaking.updateRanking(v, '.clan-ranking-wnd', 'clan');
        },
        on_matchmaking_ladder_friends: function(v) {
            Engine.matchmaking.updateRanking(v, '.friends-ranking-wnd', 'friends');
        },
        on_matchmaking_state: function(v) {
            Engine.matchmaking.setMatchmakingState(v);
        },
        on_matchmaking_confirmation: function(v) {
            Engine.matchmaking.setMatchmakingConfirmation(v);
        },
        on_matchmaking_preparation: function(v) {
            Engine.matchmaking.setPreparation(v);
        },
        on_matchmaking_statistics_detailed: function(v) {
            Engine.matchmaking.updateStatisticsDetailed(v)
        },
        on_matchmaking_search: function(v) {
            Engine.matchmaking.updateSearch(v)
        },
        on_match_profile: function(v) {
            Engine.matchmaking.updateProgressPanel(v)
        },
        on_match_season: function(v) {
            Engine.matchmaking.updateSeasonPanel(v)
        },
        on_matchmaking_season_rewards: function(v) {
            Engine.matchmaking.matchmakingSeasonPosition(v)
        },
        on_match_summary: function(v) {
            Engine.matchmaking.summary.setShow(true);
            Engine.matchmaking.summary.updateSummary(v);
        },
        on_loot_preview: function(v) {
            if (Engine.preview) Engine.preview.close();
            Engine.preview = new Preview(previewType.LOOTBOX);
            Engine.preview.update(v);

            // if (Engine.lootPreview) Engine.lootPreview.close();
            // Engine.lootPreview = new LootPreview('lootbox');
            // Engine.lootPreview.init();
            // Engine.lootPreview.update(v);
        },
        on_recipe_preview: function(v) {
            if (Engine.preview) Engine.preview.close();
            Engine.preview = new Preview(previewType.RECIPE);
            Engine.preview.update(v);
            // if (Engine.lootPreview) Engine.lootPreview.close();
            // Engine.lootPreview = new LootPreview('recipe');
            // Engine.lootPreview.init();
            // Engine.lootPreview.update(v);
        },
        on_match_main: function(v) {
            Engine.matchmaking.warningPoints(v.warnings_cur, v.warnings_max);
            Engine.matchmaking.matchesPoints(v.matches_cur, v.matches_min);
        },
        on_promotions: function(v) {
            // if (_l() != 'pl') return;
            if (!isPl()) return;
            if (Engine.news) Engine.news.close();
            Engine.news = new News();
            Engine.news.init();
            Engine.news.update(v);
        },
        on_promotion_changed: function(v) {
            // if (_l() != 'pl') return;
            if (!isPl()) return;
            if (!Engine.news) return console.warn("NOOOOO!");
            Engine.news.updateChanged(v);
        },
        on_notices: function(v) {
            Engine.widgetNoticeManager.update(v);
        },
        on_choose_teleport: function(v) {
            if (isset(v.location_data)) {
                Engine.tpScroll.showLocation(v.location_data);
            } else {
                if (Engine.tpScroll) Engine.tpScroll.close();
                Engine.tpScroll = new TpScroll();
                Engine.tpScroll.init();
                Engine.tpScroll.update(v);
            }

        },
        on_rewards_calendar_active: function(v) {
            if (!Engine.interface.getAlreadyInitialised()) {
                Engine.rewardsCalendarActive = true;
            } else {

                if (!Engine.rewardsCalendarActive) {
                    Engine.rewardsCalendarActive = true;
                    Engine.widgetManager.rebuildWidgetButtons();
                }
            }

            //Engine.widgetManager.addRewardCalendarWidgetIfNotExist();
        },
        on_battle_pass_active: function(v) {
            Engine.battlePassActive = true;
        },
        on_rewards_calendar: function(v) {
            if (!Engine.rewardsCalendar) {
                Engine.rewardsCalendar = new RewardsCalendar();
                Engine.rewardsCalendar.init();
            }
            Engine.rewardsCalendar.update(v);
        },
        on_barter: function(v, d) {
            //if (!Engine.itemChanger) {
            //	Engine.itemChanger = new ItemChanger();
            //	Engine.itemChanger.init();
            //}
            //Engine.itemChanger.update(v, d);

            if (!Engine.barter) {
                Engine.barter = new Barter();
                Engine.barter.init();
            }
            Engine.barter.update(v, d);

        },
        before_on_builds: function(v, d) {
            getEngine().buildsManager.updateData(v);
        },
        on_captcha: function(v) {
            Engine.captcha.updateData(v);
        },
        on_login: function(v, allData) {
            if (!isset(allData.promotions)) {
                Engine.poll.init();
            }
        },
        on_choose_bonus_selector: (v) => {
            if (Engine.bonusSelectorWindow) Engine.bonusSelectorWindow.close();
            Engine.bonusSelectorWindow = new BonusSelectorWindow(v);
        },
        on_bonus_reselect: (v, d) => {
            if (isset(v.show)) {
                if (!Engine.bonusReselectWindow) {
                    Engine.bonusReselectWindow = new BonusReselectWindow();
                }
            }
            if (isset(v.status)) {
                if (!Engine.bonusReselectWindow) {
                    Engine.bonusReselectWindow = new BonusReselectWindow();
                }
                Engine.bonusReselectWindow.update(v);
            }
            if (isset(v.select)) {
                const fromReselect = true;
                const res = {
                    ...v.select,
                    fromReselect
                };
                if (Engine.bonusSelectorWindow) Engine.bonusSelectorWindow.close();
                Engine.bonusSelectorWindow = new BonusSelectorWindow(res);
            }
        },
        before_on_worldConfig: (v) => {
            Engine.worldConfig.update(v);
        },
        on_worldConfig: (v) => {
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 53);
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 53);
            if (!mobileCheck()) {
                Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 1);
            }
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 1);

            if (Engine.worldConfig.getPrivWorld() == 1) Engine.globalAddons.setVisibleOfTurnOnOffAddonButton(true);
            if (!Engine.characterList) Engine.characterList = new CharacterList.default();
        },
        on_play: (v) => {
            if (isset(v.path)) {
                Engine.soundManager.createTmpSound(v.path);
            }
            if (isset(v.stop)) {
                Engine.soundManager.finishPlayingTmpSound()
            }
        },
        on_huntingStatistics: (v) => {
            if (Engine.worldWindow.huntingStatistics) Engine.worldWindow.huntingStatistics.update(v)
        },
        on_handheld_minimap: (v) => {
            if (isset(v.hero_localizations) && v.hero_localizations.length > 0) {
                Engine.heroesRespManager.updateData(v.hero_localizations)
            }
        },
        on_chatModerator: (v) => {
            if (isset(v.open)) {
                if (!Engine.mcAddon) {
                    Engine.mcAddon = new MCAddon();
                    Engine.mcAddon.init();
                }
                Engine.mcAddon.update(v.open);
            }
        },
        on_activities: (v) => {
            if (isset(v.show)) {
                Engine.worldWindow.open('activities', v.show);
            }
            if (isset(v.observed)) {
                Engine.activityObserve.update(v.observed);
            }
        },
        on_socket: (v) => {
            if (Engine.crafting.socket_enchantment && (isset(v.injectPreview) || isset(v.inject))) {
                Engine.crafting.socket_enchantment.update(v);
            }
            if (Engine.crafting.socket_extraction && (isset(v.extractPreview) || isset(v.extract))) {
                Engine.crafting.socket_extraction.update(v);
            }
            if (Engine.crafting.socket_composition && (isset(v.composePreview) || isset(v.compose))) {
                Engine.crafting.socket_composition.update(v);
            }
        },
        before_on_socket: (v) => {
            if (isset(v.composePreviewRecipes)) {
                if (Engine.preview) Engine.preview.close();
                Engine.preview = new Preview(previewType.SOCKET_RECIPE);
                Engine.preview.update({
                    socketRecipes: [...v.composePreviewRecipes]
                });
            }
        }
    };
};