//var Storage = require('core/Storage');
let HotKeysData = require('core/hotKeys/HotKeysData');
//let WidgetsData = require('core/interface/WidgetsData');
let InputParser = require('core/InputParser');
let ServerStorageData = require('core/storage/ServerStorageData');
module.exports = function() {
    var self = this;
    var defaultHotKeys; // clbName: [keycode, selector]
    this.hotKeys = null; // keycode: clbName

    this.init = function() {
        this.initDefaultHotKeys();
        this.hotKeys = {};
        this.rebuildHotKeys();
    };

    this.initDefaultHotKeys = function() {

        //let wNames = Engine.interface.widgetNames;
        let wNames = Engine.widgetsData.name;

        defaultHotKeys = {

            [HotKeysData.name.move_up]: ["W", false, HotKeysData.type.LABEL, false, HotKeysData.group.MOVE],
            [HotKeysData.name.move_down]: ["S", false, HotKeysData.type.LABEL, false, HotKeysData.group.MOVE],
            [HotKeysData.name.move_left]: ["A", false, HotKeysData.type.LABEL, false, HotKeysData.group.MOVE],
            [HotKeysData.name.move_right]: ["D", false, HotKeysData.type.LABEL, false, HotKeysData.group.MOVE],


            [HotKeysData.name.showBuildWindow]: ["TAB", '.builds-interface', HotKeysData.type.TIP, false, HotKeysData.group.FIGHT], //tab
            [HotKeysData.name.hotAttackNearMob]: ["Q", '.widget-button:has(.icon.attack-near-mob):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.ATTACK_MOB, HotKeysData.group.FIGHT], //q
            [HotKeysData.name.autofightNearMob]: [false, '.widget-button:has(.icon.auto-fight-near-mob):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.ATTACK_MOB_AUTO, HotKeysData.group.FIGHT],
            [HotKeysData.name.hotAttackNearPlayer]: ["X", '.widget-button:has(.icon.attack-near-player):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.ATTACK_PLAYER, HotKeysData.group.FIGHT], //x
            [HotKeysData.name.hotChangeTarget]: [false, '.change-target-btn', HotKeysData.type.LABEL, false, HotKeysData.group.FIGHT],
            [HotKeysData.name.hotAutoFight]: ["F", '.auto-fight-btn, .auto-fight-cancel-btn', HotKeysData.type.LABEL, false, HotKeysData.group.FIGHT], //f
            [HotKeysData.name.hotAcceptLoot]: [false, '.bottom-wrapper>.table-wrapper>.accept-button>.button', HotKeysData.type.LABEL, false, HotKeysData.group.FIGHT],
            [HotKeysData.name.toggleBattlePanel]: ["B", '.toggle-battle', HotKeysData.type.TIP, false, HotKeysData.group.FIGHT], //b
            [HotKeysData.name.hotCloseFight]: ["Z", '.close-battle-ground', HotKeysData.type.LABEL, false, HotKeysData.group.FIGHT], //z
            [HotKeysData.name.showLog]: ["H", false, HotKeysData.type.TIP, wNames.BATTLE_LOG, HotKeysData.group.FIGHT], //h

            [HotKeysData.name.iconglobe]: ["M", '.widget-button:has(.icon.globe):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.MAP, HotKeysData.group.MAP], //m
            [HotKeysData.name.hotportablemap]: ["E", '.widget-button:has(.icon.portable-map-icon):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.MINI_MAP, HotKeysData.group.MAP], //e
            [HotKeysData.name.iconcompass]: [false, '.widget-button:has(.icon.compass):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.WHO_IS_HERE, HotKeysData.group.MAP],
            [HotKeysData.name.goGateway]: [false, '.widget-button:has(.icon.go-gateway):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.USE_DOOR, HotKeysData.group.MAP],
            [HotKeysData.name.hotTalkNearMob]: ["R", '.widget-button:has(.icon.npc-talk-icon):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.TALK, HotKeysData.group.MAP], //r

            [HotKeysData.name.iconchat]: ["C", '.widget-button:has(.icon.chat):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.CHAT, HotKeysData.group.SOCIAL], //c
            [HotKeysData.name.iconclans]: ["K", '.widget-button:has(.icon.clans):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.CLAN, HotKeysData.group.SOCIAL], //k
            [HotKeysData.name.iconfriends]: ["P", '.widget-button:has(.icon.friends):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.COMMUNITY, HotKeysData.group.SOCIAL], //p
            [HotKeysData.name.iconparty]: ["G", '.widget-button:has(.icon.party):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.PARTY, HotKeysData.group.SOCIAL], //g
            [HotKeysData.name.quickParty]: ["V", false, HotKeysData.type.TIP, wNames.QUICK_PARTY, HotKeysData.group.SOCIAL], //h
            [HotKeysData.name.clanSendMessage]: [false, '.widget-button:has(.icon.send-clan-msg):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.CLAN_MSG, HotKeysData.group.SOCIAL],

            [HotKeysData.name.iconconfig]: [false, '.widget-button:has(.icon.config):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.SETTINGS, HotKeysData.group.OTHER],
            //[HotKeysData.name.iconkeyboard]: 	   		  ["I",		 '.widget-button:has(.icon.keyboard):not(.from-settings-panel)', 										HotKeysData.type.TIP,		wNames.HELP,								HotKeysData.group.OTHER],						//i
            [HotKeysData.name.iconWindows]: [false, '.widget-button:has(.icon.windows):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.FULL_SCREEN, HotKeysData.group.OTHER],
            [HotKeysData.name.iconpuzzle]: [false, '.widget-button:has(.icon.puzzle):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.ADDONS, HotKeysData.group.OTHER],

            [HotKeysData.name.iconconsole]: ["`", '.widget-button:has(.icon.console):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.CONSOLE, HotKeysData.group.OTHER],
            [HotKeysData.name.eqcolumnshow]: [false, '.widget-button:has(.icon.eq-show-icon):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.EQ_TOGGLE, HotKeysData.group.OTHER],
            [HotKeysData.name.showhideStats]: [false, '.stats-expand', HotKeysData.type.LABEL, false, HotKeysData.group.OTHER],

            [HotKeysData.name.hotAuction]: [false, '.game-window-positioner .auctions-bar-put .put-button', HotKeysData.type.LABEL, false, HotKeysData.group.OTHER], //f
            [HotKeysData.name.iconphoto]: [false, '.widget-button:has(.icon.photo):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.CRAFTING, HotKeysData.group.OTHER],
            [HotKeysData.name.iconscroll]: ["T", '.widget-button:has(.icon.scroll):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.QUEST_LOG, HotKeysData.group.OTHER], //t
            [HotKeysData.name.iconskills]: ["U", '.widget-button:has(.icon.skills):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.SKILLS, HotKeysData.group.OTHER], //u
            [HotKeysData.name.iconexit]: ["L", '.widget-button:has(.icon.exit):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.EXIT, HotKeysData.group.OTHER],
            [HotKeysData.name.iconstar]: [false, '.widget-button:has(.icon.star):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.PREMIUM, HotKeysData.group.OTHER],
            [HotKeysData.name.world]: [false, '.widget-button:has(.icon.world-icon):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.WORLD, HotKeysData.group.SOCIAL]
        };

        if (isPl()) defaultHotKeys[HotKeysData.name.news] = [false, '.widget-button:has(.icon.news-icon):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.NEWS, HotKeysData.group.OTHER];
        if (isPl()) defaultHotKeys[HotKeysData.name.matchmaking] = ["O", '.widget-button:has(.icon.matchmaking-icon):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.MATCHMAKING, HotKeysData.group.SOCIAL]; //o
        if (!isPl()) defaultHotKeys[HotKeysData.name.achievements] = [false, '.widget-button:has(.icon.achievements-icon):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.ACHIEVEMENTS, HotKeysData.group.SOCIAL];
        if (isPl()) defaultHotKeys[HotKeysData.name.hotTakeGroundItem] = [false, false, HotKeysData.type.LABEL, wNames.PICK_UP_ITEM, HotKeysData.group.MAP];

        if (mobileCheck()) defaultHotKeys[HotKeysData.name.zoom] = [false, '.widget-button:has(.icon.zoom-in-out-panel):not(.from-settings-panel)', HotKeysData.type.TIP, wNames.ZOOM, HotKeysData.group.OTHER];


        self.checkNumberUnique();
    };

    this.checkNumberUnique = function() {
        var numbers = {};

        for (var k in defaultHotKeys) {
            var nr = defaultHotKeys[k][0];
            if (!nr) continue;
            if (!isset(numbers[nr])) {
                numbers[nr] = true;
            } else {
                console.log(nr + ' exist in defaultHotKeys');
            }
        }
    };

    this.checkKeyIsConsole = (key) => {
        let hotKey = Engine.hotKeys.hotKeys[key];

        if (!hotKey) return false;

        return hotKey == HotKeysData.name.iconconsole;
    };

    this.checkHotExist = function(clbName) {
        //var keyCode = Storage.get('hotKeys/' + clbName);
        //var keyCode = Engine.serverStorage.get('hotKeys', clbName);
        var key = Engine.serverStorage.get(ServerStorageData.HOTKEYS, clbName);
        if (key) this.hotKeys[correctKey(key)] = clbName;
        else {

            if (key == null) {
                let defaultKeyCode = defaultHotKeys[clbName][0];

                if (defaultKeyCode != false) {

                    key = defaultKeyCode;
                    this.hotKeys[key] = clbName;

                }
            }

        }

        //var char = keyCode ? getCharCode(keyCode) : '';
        var e = defaultHotKeys[clbName];
        if (e.length == 1) return; //ignore addon hotkey

        if (e && e[1] != false) this.changeName(e[1], e[2], key);
    };

    this.changeName = function(selector, type, char) {
        var $e = $(selector);
        var fName = 'set' + type;
        this[fName]($e, char);
    };

    this.setTip = function($e, char) {
        var tip = $e.getTipData();

        if (!tip) return;

        tip = self.removeBracket(tip)

        if (char != '') tip = this.createTagOrBrackets(tip, char);

        $e.tip(tip);
    };

    this.removeBracket = (str) => {
        let r = new RegExp('\<b class\=\"hot\-char\"\>+(.*)\<\/b\>?', "g");
        let newStr = str.replace(r, "");

        return newStr;
    }

    this.setLabel = function($e, char) {
        if (!$e.length) return;
        $e.each((index, item) => {
            var $label = $(item).find('.label');
            if (!$label.length) return;
            $label.find('.hot-char').remove();
            var str = $label.html();
            if (char != '') str = this.createTagOrBrackets(str, char);
            $label.html(str);
        })
    };

    this.createTagOrBrackets = function(tip, key) {
        if (!key) return tip;
        else return tip + ' <b class="hot-char">[' + correctKey(key) + ']</b>';
    };

    this.getKeyByClbName = (clbName) => {
        if (Engine.serverStorage.getDataLoaded()) {
            let key = Engine.serverStorage.get(ServerStorageData.HOTKEYS, clbName);

            if (key == null) return this.getDefaultHotkey(clbName);
            else return correctKey(key);
        }

        // if (!defaultHotKeys[clbName]) return null;
        // return defaultHotKeys[clbName][0];
        return this.getDefaultHotkey(clbName);
    };

    this.getDefaultHotkey = (clbName) => {
        if (!defaultHotKeys[clbName]) return null;
        return defaultHotKeys[clbName][0];
    }

    this.checkKey = function(kCode) {
        var clbName = this.hotKeys[kCode];
        if (!clbName) return;
        const widgetName = defaultHotKeys[this.hotKeys[kCode]][3];

        let block = Engine.tutorialManager.checkBlockHotKeys(clbName);

        if (block) return;

        if (widgetName === Engine.widgetsData.name.CONSOLE && !getAlreadyInitialised()) { // EXCEPTION!!! CAN USE HOTKEY CONSOLE BEFORE INIT WIDGETS IN Engine.interface.afterUnlock
            Engine.interface.clickConsole();
            return;
        }

        if (widgetName !== false) {
            const widgets = Engine.widgetManager.getDefaultWidgetSet();
            Engine.widgetManager.widgetOnClick({
                widgetData: widgets[widgetName],
                eventType: 'hot-key'
            });
        } else {
            let a = [HotKeysData.name.move_down, HotKeysData.name.move_up, HotKeysData.name.move_left, HotKeysData.name.move_right];
            if (a.includes(clbName)) return;
            self[clbName]();
        }
    };

    //this.checkCanChangeKeyCode = function (keyCode) {
    //	return !this.hotKeys[keyCode];
    //};

    this.checkForbidenChar = function(char) {
        //var reqPat = /[1-8wsad\s]/i;
        var reqPat = /[1-8\s]/i;
        var bool = reqPat.test(char);
        return !bool;
    };

    this.canChangeKey = (clbName, char) => {
        let str = _t('char') + ' ' + (char == ' ' ? 'space' : char);

        if (char.length > 1) {
            if (char == "ESCAPE") return false;

            let available = self.getAvailableTagKeys();

            if (!available.includes(char)) {
                mAlert(str + ' ' + _t('is_forbidden '));
                return false;
            }
        }

        let bool1 = this.checkForbidenChar(char);
        if (!bool1) {
            mAlert(str + ' ' + _t('is_forbidden '));
            return false;
        }

        return true;
    }

    this.getAvailableTagKeys = () => {
        return ["TAB"];
    }

    // this.getPrepareKeyCode = (char) => {
    // 	var upper                     = char.toUpperCase();
    // 	var keyCode                   = upper.charCodeAt(0);
    //
    // 	return keyCode;
    // };

    this.changeKey = (clbName, key, afterSaveServerStorageClb) => {
        //var upper                     = char.toUpperCase();
        //var keyCode                   = upper.charCodeAt(0);

        //console.log('changeKeyCode', char);

        //let keyCode                   = this.getPrepareKeyCode(char);
        let objToSendToServerStorage = {};

        this.overrideIfKeyExist(key, objToSendToServerStorage);

        objToSendToServerStorage[clbName] = !key ? false : key;

        Engine.serverStorage.sendData({
            [ServerStorageData.HOTKEYS]: objToSendToServerStorage
        }, () => {
            this.rebuildHotKeys();
            afterSaveServerStorageClb();
        });

    };

    this.overrideIfKeyExist = function(key, objToSendToServerStorage) {
        if (this.hotKeys[key]) {
            let clbName = this.hotKeys[key];
            //Storage.set('hotKeys/' + clbName, '');
            objToSendToServerStorage[clbName] = false;
        }
    };

    this.getSortedHotKeys = function() {
        var a = [];
        var clbNameKeyObj = self.changeClbNameWitchKey();
        for (var clbName in defaultHotKeys) {
            var key = clbNameKeyObj[clbName] ? clbNameKeyObj[clbName] : null;
            var icon = defaultHotKeys[clbName][3];
            var group = defaultHotKeys[clbName][4];
            a.push([key, clbName, icon, group]);
        }
        //a.sort(function(a, b) {
        //	var textA = _t(a[1]);
        //	var textB = _t(b[1]);
        //	return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        //});
        return a;
    };

    this.changeClbNameWitchKey = function() {
        var obj = {};
        for (var k in self.hotKeys) {
            var clb = self.hotKeys[k];
            obj[clb] = k;
        }
        return obj; // clb: keycode
    };

    this.rebuildHotKeys = function() {
        this.hotKeys = {};
        for (var k in defaultHotKeys) {
            this.checkHotExist(k);
        }
        InputParser.updateKeys();
    };

    this.resetHotKeys = function(afterSaveServerStorageClb) {

        let objToSendToServerStorage = {};

        for (var k in defaultHotKeys) {
            var e = defaultHotKeys[k];
            objToSendToServerStorage[k] = e[0];
        }

        Engine.serverStorage.sendData({
            [ServerStorageData.HOTKEYS]: objToSendToServerStorage
        }, () => {
            this.rebuildHotKeys();
            afterSaveServerStorageClb();
        });

    };

    this.replaceAutoAndChangeBtnsNames = function() {
        this.checkHotExist(HotKeysData.name.hotAutoFight);
        this.checkHotExist(HotKeysData.name.hotChangeTarget);
    };

    this.replaceToggleBattlePanelTipNames = function() {
        this.checkHotExist(HotKeysData.name.toggleBattlePanel);
    };

    this.replaceCreateAuctionBtnsNames = function() {
        this.checkHotExist(HotKeysData.name.hotAuction);
    };

    this.replaceCloseFightBtnsNames = function() {
        this.checkHotExist(HotKeysData.name.hotCloseFight);
    };

    this.replacehotAcceptLootBtnsNames = function() {
        this.checkHotExist(HotKeysData.name.hotAcceptLoot);
    };

    this.replaceshowhideStatsBtnsNames = function() {
        this.checkHotExist(HotKeysData.name.showhideStats);
    };

    this.replaceshowBuildWindowTipNames = function() {
        this.checkHotExist(HotKeysData.name.showBuildWindow);
    };

    //all callbacks

    this.hotAuction = function() {
        if (!Engine.auctions) return;
        Engine.auctions.exhibitItem();
    };

    this.showBuildWindow = function() {
        //if (getEngine().matchmaking.getEqChooseOpen()) {
        //	message(_t('window_not_available_now'));
        //	return
        //}
        getEngine().buildsManager.getBuildsWindow().managePanelVisible();
    };

    this.iconcalendar = function() {
        Engine.interface.clickEventCalendar();
    };

    this.toggleBattlePanel = function() {
        if (!Engine.battle.getShow()) return;
        Engine.battle.toggleBattlePanel();
    };

    this.hotAutoFight = function() {
        if (!Engine.battle.getShow()) return;
        Engine.battle.canAutoFight();
    };

    this.hotCloseFight = function() {
        if (!Engine.battle.getShow()) return;
        Engine.battle.canLeave();
    };

    this.showhideStats = function() {
        Engine.interface.clickMoreBtn()
    };

    this.hotChangeTarget = function() {
        if (!Engine.battle.getShow()) return;
        Engine.battle.selectWarrior();
    };

    this.hotAcceptLoot = function() {
        if (!Engine.loots) return;
        Engine.loots.acceptLoot();
    };

    this.checkCanCloseConsole = function() {
        //var c = require('core/Console');
        var c = Engine.console;
        if (c.isOpen) {
            c.close();
            return true;
        }
        return false;
    };

    this.checkCanRefuseLoot = function() {
        if (Engine.loots && Engine.loots.itemsDecisionExist()) {
            Engine.loots.refuseAllLoot();
            return true;
        }
        return false;
    };

    this.checkCanCloseMiniMap = function() {
        if (!Engine.miniMapController.getMiniMapShow()) return false;
        Engine.miniMapController.closeMiniMap();
        return true;
    };

    this.checkCanCloseTrade = function() {
        if (!Engine.trade) return false
        Engine.trade.$.find('.cancel-trade').click();
        return true;
    };

    this.checkCanCloseDialog = function() {
        if (Engine.dialogue) {
            var $lineExit = Engine.dialogue.$.find('.answer.dialogue-window-answer.line_exit');
            if (!$lineExit.length) return false;
            $lineExit.click();
            return true;
        }
        return false;
    };

    this.checkCanAcceptWindow = function() {
        let $wnd = self.getExistWnd();
        if ($wnd == null) return false;

        return self.checkInAlertExistAcceptHotkey($wnd);
    };

    this.checkCanAcceptAlert = function() {
        let alert = self.getExistAlert();
        if (alert == null) return false;
        if (self.checkInAlertExistAcceptHotkey(alert)) self.clickHotAcceptInAlert(alert);
        return true;
    };

    this.checkCanCancelAlert = function() {
        let alert = self.getExistAlert();
        if (alert == null) return false;
        if (self.checkInAlertExistCancelHotkey(alert)) self.clickHotCancelInAlert(alert);
        return true;
    };

    this.checkCanCloseWindow = function() {
        let $wnd = self.getExistWnd();
        if ($wnd == null) return false;

        const $openedMenus = $wnd.find('.menu-list .close-menu');
        if ($openedMenus.length > 0) {
            $openedMenus.closest('.menu-list').trigger({
                type: "close"
            })
        }

        self.clickWindowOnClose($wnd);
        return true;
    };

    this.checkCanBlurInput = function() {
        const $focusedInputs = $('input:focus');
        if ($focusedInputs.length <= 0) return false
        $focusedInputs.blur();
        return true;
    };

    this.clickWindowOnClose = function($wnd) {
        $wnd.find('.close-button-corner-decor').find('.close-button').click();
    };

    this.getExistAlert = function() {
        let $alerts = Engine.interface.get$mAlertLayer().find('.mAlert');
        let $alert = null;
        $alerts.each(function() {
            if ($alert === null) $alert = $(this);
            else {
                let oldZIndex = parseInt($alert.css('z-index'));
                let newZIndex = parseInt($(this).css('z-index'));
                if (newZIndex > oldZIndex) $alert = $(this);
            }
        });
        if ($alert === null) return;
        return $alert;
    };

    this.getExistWnd = function() {
        let $window = Engine.interface.get$alertsLayer().find('.border-window');
        let $one = null;
        $window.each(function() {
            if ($(this).css('display') == 'none') return;
            if ($(this).hasClass('transparent')) return;

            if ($(this).find('.close-button-corner-decor').find('.close-button').length) {
                if ($(this).find('.close-button-corner-decor').css('display') == 'none') return;
            } else return;

            if ($one === null) $one = $(this);
            else {
                let oldZIndex = parseInt($one.css('z-index'));
                let newZIndex = parseInt($(this).css('z-index'));
                if (newZIndex > oldZIndex) $one = $(this);
            }
        });
        if ($one === null) return;
        return $one;
    };

    this.checkInAlertExistAcceptHotkey = function($alert) {
        return $alert.find('.alert-accept-hotkey').length;
    };

    this.checkInAlertExistCancelHotkey = function($alert) {
        return $alert.find('.alert-cancel-hotkey').length;
    };

    this.clickHotAcceptInAlert = function($alert) {
        $alert.find('.alert-accept-hotkey').click();
    };

    this.clickHotCancelInAlert = function($alert) {
        $alert.find('.alert-cancel-hotkey').click();
    };

};