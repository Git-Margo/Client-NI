var Templates = require('core/Templates');
//var MyLocalStorage = require('core/Storage');
var EditColorPanel = require('core/whoIsHere/EditColorPanel');
var ColorMark = require('core/ColorMark');
//let WhoIsHereData = require('core/whoIsHere/WhoIsHereData');
let ServerStorageData = require('core/storage/ServerStorageData');
let StorageData = require('core/StorageData');
let StorageFuncWindow = require('core/window/StorageFuncWindow');
var SocietyData = require('core/society/SocietyData');
let HandHeldMiniMapData = require('core/map/handheldMiniMap/HandHeldMiniMapData');
let StorageFuncHandHeldMiniMap = require('core/map/StorageFuncHandHeldMiniMap');


module.exports = function() {
    var self = this;
    var list = {};
    //var open = false;
    var statesFromStorage = {};
    var defaultColors;
    var playerTypes;
    var playerTypesAll;

    let $playerList;
    let $infoIcon;
    let $playersNumber

    this.init = function() {
        this.initWindow();
        this.initEditControlPanelBtn();
        //this.initDefaultColors();
        this.initSearch();
        this.setStatesFromStorage();
        this.initScroll();
        this.initMargin();

        $infoIcon = self.wnd.$.find('.players-number .info-icon');
        $playerList = self.wnd.$.find('.player-list');
        $playersNumber = self.wnd.$.find('.players-number .num');

        this.setStateOfWhoIsHere();
        this.updatePlayersNumber();
        this.updateHeroGlow();

    };

    this.isShow = () => {
        return this.wnd.isShow();
    };

    this.updateWhoIsHereAfterSaveInServerStorage = () => {
        this.rebuildListAfterChangeStates();
        this.updateHeroGlow();
        this.playersNumberTipUpdate();
    };

    this.initMargin = function() {
        this.wnd.$.find('.content').css({
            'margin-top': '-12px',
            'margin-left': '-23px',
            'margin-right': '-23px',
            'margin-bottom': '-17px'
        });
    };
    /*
    	this.initDefaultColors = function () {
    		//defaultColors = {
    		//	[WhoIsHereData.NAME.HERO]			: "87fdff",
    		//	[WhoIsHereData.NAME.NORMAL_PLAYERS]	: "eaeaea",
    		//	[WhoIsHereData.NAME.FRIENDS]		: "46a31d",
    		//	[WhoIsHereData.NAME.ENEMIES]		: "c71618",
    		//	[WhoIsHereData.NAME.CLAN_MEMBERS]	: "4cfa4f",
    		//	[WhoIsHereData.NAME.CLAN_FRIENDS]	: "ffba37",
    		//	[WhoIsHereData.NAME.CLAN_ENEMIES]	: "fc3e40",
    		//	[WhoIsHereData.NAME.GROUPS]			: "93b900"
    		//};

    		let KIND 			= HandHeldMiniMapData.KIND;
    		let HERO 			= KIND.HERO;
    		let NORMAL_OTHER 	= KIND.NORMAL_OTHER;
    		let FRIEND 			= KIND.FRIEND;
    		let ENEMY 			= KIND.ENEMY;
    		let CLAN 			= KIND.CLAN;
    		let CLAN_FRIEND 	= KIND.CLAN_FRIEND;
    		let CLAN_ENEMY 		= KIND.CLAN_ENEMY;
    		let GROUP 			= KIND.GROUP;

    		let getDefaultColor = getEngine().handHeldMiniMapController.getDefaultColor;

    		defaultColors = {
    			[HERO]				: getDefaultColor(HERO),
    			[NORMAL_OTHER]		: getDefaultColor(NORMAL_OTHER),
    			[FRIEND]			: getDefaultColor(FRIEND),
    			[ENEMY]				: getDefaultColor(ENEMY),
    			[CLAN]				: getDefaultColor(CLAN),
    			[CLAN_FRIEND]		: getDefaultColor(CLAN_FRIEND),
    			[CLAN_ENEMY]		: getDefaultColor(CLAN_ENEMY),
    			[GROUP]				: getDefaultColor(GROUP)
    		};
    	};
    */
    //const addToDefaultColors

    this.getDefaultColor = function(name) {
        //return defaultColors[name];
        return getEngine().handHeldMiniMapController.getDefaultColor(name);
    };

    this.setStatesFromStorage = function() {
        statesFromStorage = getEngine().miniMapController.handHeldMiniMapController.getDataToWhoIsHere();

        playerTypes = Object.keys(statesFromStorage);
    };

    const getStateFromStorageByName = (name) => {
        return statesFromStorage[name];
    }

    //this.getVFromStorage = function (name) {
    //	var s = Engine.serverStorage.get(ServerStorageData.WHO_IS_HERE, name);
    //	if (s) return s;
    //	else {
    //		var defaultCl = isset(defaultColors[name]) ? defaultColors[name] : 'fff';
    //		var mapState = name == WhoIsHereData.NAME.NORMAL_PLAYERS ? false : true;
    //		let o = {
    //			[WhoIsHereData.ATTR.COLOR] 		: "#" + defaultCl,
    //			[WhoIsHereData.ATTR.STATE] 		: true,
    //			[WhoIsHereData.ATTR.MAP_STATE] 	: mapState,
    //		}
    //		return o;
    //	}
    //};

    this.initEditControlPanelBtn = function() {
        var $btn = Templates.get('settings-button');
        $btn.addClass('small green');
        $btn.find('.label').html('...');
        self.wnd.$.find('.open-edit-panel').append($btn);
        $btn.click(function(e) {
            //if (!self.editColorPanel) {
            //	self.editColorPanel = new EditColorPanel();
            //	self.editColorPanel.init();
            //	e.stopPropagation();
            //}
            //else self.editColorPanel.close();

            getEngine().miniMapController.handHeldMiniMapController.getHandHeldMiniMapWindow().createControllPanel();
        });
    };

    this.updateScroll = function() {
        if (!self.isShow()) return;

        $('.scroll-wrapper', self.wnd.$).trigger('update');
    };

    this.getList = function() {
        return list;
    };

    this.addToList = function(id, data, otherObj) {
        if (data.hasOwnProperty('del')) {
            self.removeFromList(id, data);
            return;
        }
        if (list[id]) {
            if (isset(data.relation)) {
                //self.removeFromList(id, data);  // it's not important but buggy count players when we have a group
            } else return;
        }
        list[id] = {
            'id': id,
            'nick': data.nick,
            'prof': data.prof,
            'lvl': data.lvl,
            'relation': self.getRelation(id, data.relation),
            'rights': data.rights,
            'wanted': data.wanted,
            'stasis': data.stasis,
            'stasisIncoming': data.stasis_incoming_seconds,
            'show': null,
            '$': null
        };
        this.createOnePerson(id, data, otherObj);
        this.addElements();
        this.checkEmpty();
        this.updateSearch();
    };

    this.updateSearch = function() {
        if (!self.isShow()) return;

        var searchValue = self.wnd.$.find(".search").val();
        if (searchValue != "") {
            self.searchItems(searchValue);
        }
    };

    this.checkEmpty = function() {
        self.updatePlayersNumber();
        if (!self.isShow()) return;

        for (let k in list) {
            if (list[k].show) {
                self.wnd.$.find('.empty').css('display', 'none');
                return;
            }
        }
        self.wnd.$.find('.empty').css('display', 'block');
        self.updateScroll();
    };

    this.getAmountVisibleOthers = () => {
        let count = 0;
        for (let k in list) {
            if (list[k].show) count++;
        }
        return count;
    };

    this.addElements = function() {
        //if (!self.isShow()) return;

        var $wrapper = self.wnd.$.find('.player-list').empty();

        // for (var id in list) {
        // 	$wrapper.append(list[id].$);
        // 	this.createMenuAction(list[id].$, list[id]['id']);
        // }

        const sortedPlayerList = this.getSortedPlayerList();
        for (const player of sortedPlayerList) {
            $wrapper.append(player.$);
            this.createMenuAction(player.$, player.id);
        }
    };

    this.getSortedPlayerList = () => {
        const playerArray = Object.values(list);
        return playerArray.sort((a, b) => {
            if (a.lvl !== b.lvl) {
                return b.lvl - a.lvl; // Sort 'lvl' descending
            } else {
                return a.nick.localeCompare(b.nick); // Sort 'nick' alphabetically
            }
        });
    }

    this.createOnePerson = function(id, data, otherObj) {
        var $div = Templates.get('one-other');
        var o = list[id];
        var name = o.nick;
        var lvl = o.lvl == 0 ? '' : '(' + o.lvl + o.prof + ')';
        var stasis = o.stasis;
        var stasisIncoming = o.stasisIncoming;
        var color = this.getPersonColor(o.relation);
        var visible = this.getPersonVisible(o.relation);
        var mapVisible = this.getMapPersonVisible(o.relation);
        //var $wrapper = self.wnd.$.find('.player-list');
        var $stasis = $div.find('.stasis');
        var $stasisIncoming = $div.find('.stasis-incoming');
        const $tipContainer = $div.find('.tip-container');
        const $tipWrapper = $('<div />');
        const avatar = $('<div class="avatar-icon" />');
        createImgStyle(avatar, CFG.a_opath + otherObj.d.icon);
        $tipWrapper.append(otherObj.createStrTip()).append(avatar);
        self.updateGlow(data, visible, otherObj, mapVisible, color);

        //$playerList.append($div);
        var $name = $div.find('.name .inner');
        $name.html(name);
        $tipContainer.tip($tipWrapper, 't_other');
        $div.attr('data-id', id);
        visible ? $div.removeClass('hidden') : $div.addClass('hidden');

        list[id].show = visible;

        $div.find('.center').css('color', color);
        $div.find('.lvl').html(lvl);
        stasis ? $stasis.addClass('active') : $stasis.removeClass('active');
        stasisIncoming > 0 ? $stasisIncoming.addClass('active') : $stasisIncoming.removeClass('active');
        $div.data('sort', o.lvl);
        list[id].$ = $div;

        $playerList.append($div);

        // this.createMenuAction($div, id);
        if (!o.wanted) return;
        stasis ? $stasis.addClass('with-wanted') : $stasis.removeClass('with-wanted');
        stasisIncoming > 0 ? $stasisIncoming.addClass('with-wanted') : $stasisIncoming.removeClass('with-wanted');
        var $wWrapper = Templates.get('wanted-skull-wrapper');
        $wWrapper.find('.skull').tip(_t('my_char_wanted', null, 'map'));
        $name.after($wWrapper);
    };

    this.updateGlow = function(data, visible, otherObj, mapVisible, color) {
        if (otherObj) {
            if (visible && mapVisible) {
                otherObj.whoIsHere = color;
                otherObj.d.whoIsHere = color;
                if (isset(otherObj.whoIsHereGlow)) otherObj.whoIsHereGlow.updateColor();
                else otherObj.updateWhoIsHereGlow();
                otherObj.tipUpdate();

            } else {
                delete otherObj.whoIsHere;
                delete otherObj.d.whoIsHere;
                delete otherObj.whoIsHereGlow;
            }
        } else if (visible && mapVisible) data.whoIsHere = color;
    };

    this.canShowActionMenu = function() {
        return !Engine.battle.getShow();
    };

    this.createMenuAction = function($div, id) {
        $div.on('click', function(e) {
            var other = Engine.others.getById(id);
            //Engine.chat.replyTo(other.d.nick);
            //Engine.interface.focusChat();
            Engine.chatController.getChatInputWrapper().setPrivateMessageProcedure(other.d.nick);
        });
        $div.on('contextmenu', function(e) {
            var other = Engine.others.getById(id);
            if (!other) return;
            if (!self.canShowActionMenu()) {
                //transformEPointerEventIfMobile(e);
                other.createBasicMenu(e);
                self.wnd.correctPositionMenuToRightEdgeOfWnd();
                return;
            }
            //self.correctPosition(e);
            //self.wnd.correctPositionMenuToRightEdgeOfWnd(e);
            //transformEPointerEventIfMobile(e);
            other.createMenu(e);
            self.wnd.correctPositionMenuToRightEdgeOfWnd();

        });
        $div.on('mouseenter', function() {
            var other = Engine.others.getById(id);
            if (!other) return;
            if (!other.colorMark && $('.popup-menu').length == 0) {
                other.colorMark = new ColorMark(id, 'green');
                other.colorMark.init();
                Engine.targets.addArrow(false, other.nick, other, 'Other', 'navigate');
            }
        });
        $div.on('mouseleave', function() {
            var other = Engine.others.getById(id);
            if (!other) return;
            if (other.colorMark && other.colorMark.color == 'green' && $('.popup-menu').length == 0) {
                delete(other.colorMark);
                Engine.targets.deleteArrow('Other-' + other.d.id);
            }
        });
    };

    //this.correctPosition = function (e) {
    //	var windowW = $(window).width();
    //	var w = self.wnd.$.position().left + 80;
    //
    //	if (w + 250 > windowW) e.clientX = w - 163;
    //	else 									 e.clientX = w + 220;
    //
    //	if (e.clientY < 100) e.clientY = 100;
    //	else {
    //		var h = $(window).height();
    //		if (h < e.clientY + 110)  e.clientY = h - 110;
    //	}
    //};

    this.getRelation = function(id, relation) {
        var kind;
        var p = Engine.party;

        let KIND = HandHeldMiniMapData.KIND

        // if (p && p.getMembers()[id]) kind = 'groups';
        if (p && p.getMembers()[id]) kind = KIND.GROUP;
        else {
            //switch (relation) {
            //	case '':
            //		kind = WhoIsHereData.NAME.NORMAL_PLAYERS;
            //		break;
            //	case 'fr':
            //		kind = WhoIsHereData.NAME.FRIENDS;
            //		break;
            //	case 'en':
            //		kind = WhoIsHereData.NAME.ENEMIES;
            //		break;
            //	case 'cl':
            //		kind = WhoIsHereData.NAME.CLAN_MEMBERS;
            //		break;
            //	case 'cl-en':
            //		kind = WhoIsHereData.NAME.CLAN_ENEMIES;
            //		break;
            //	case 'cl-fr':
            //		kind = WhoIsHereData.NAME.CLAN_FRIENDS;
            //		break;
            //	default:
            //		kind = WhoIsHereData.NAME.NORMAL_PLAYERS;
            //}
            switch (relation) {
                case SocietyData.RELATION.NONE:
                    kind = KIND.NORMAL_OTHER;
                    break;
                case SocietyData.RELATION.FRIEND:
                    kind = KIND.FRIEND;
                    break;
                case SocietyData.RELATION.ENEMY:
                    kind = KIND.ENEMY;
                    break;
                case SocietyData.RELATION.CLAN:
                    kind = KIND.CLAN;
                    break;
                case SocietyData.RELATION.CLAN_ENEMY:
                    kind = KIND.CLAN_ENEMY;
                    break;
                case SocietyData.RELATION.CLAN_ALLY:
                    kind = KIND.CLAN_FRIEND;
                    break;
                default:
                    kind = KIND.NORMAL_OTHER;
            }
        }
        return kind;
    };

    this.getList = function() {
        return list;
    };

    this.comparePartyMembers = function(oldMembers, newMembers) {
        var oldL = oldMembers.length;
        var newL = newMembers.length;
        var tableToAction = oldL < newL ? newMembers : oldMembers;
        var others = Engine.others.check();
        for (var i = 0; i < tableToAction.length; i++) {
            var id = tableToAction[i];
            if (!others[id]) continue; // block hero | In this moment Engine.hero.d.id NOT WORKING!
            self.addToList(id, others[id].d, others[id]);
        }
        self.updateScroll();
        self.updatePlayersNumber();
    };

    this.rebuildListAfterChangeStates = function() {
        this.setStatesFromStorage();
        for (var id in list) {
            this.rebuildOnePerson(id)
        }
        self.checkEmpty();
    };

    this.updateHeroGlow = function() {

        //let data = this.getVFromStorage(WhoIsHereData.NAME.HERO);
        let data = getStateFromStorageByName(HandHeldMiniMapData.KIND.HERO)
        let color = data.color;
        let mapBlur = data.mapBlur;
        let hero = Engine.hero;
        if (mapBlur) {
            hero.whoIsHere = color;
            hero.d.whoIsHere = color;
            if (isset(hero.whoIsHereGlow)) hero.whoIsHereGlow.updateColor(color);
            else hero.updateWhoIsHereGlow();
        } else {
            delete hero.whoIsHere;
            delete hero.whoIsHereGlow;
        }
    };

    this.rebuildOnePerson = function(id) {
        var r = list[id].relation;
        var color = self.getPersonColor(r);
        var visible = self.getPersonVisible(r);
        var mapVisible = self.getMapPersonVisible(r);

        var others = Engine.others.check();
        var other = others[id];
        if (visible && mapVisible) {
            other.whoIsHere = color;
            other.d.whoIsHere = color;
            if (isset(other.whoIsHereGlow)) other.whoIsHereGlow.updateColor();
            else other.updateWhoIsHereGlow();
        } else {
            self.removeWhoIsHere(id);
        }
        other.tipUpdate();
        Engine.miniMapController.updateWindowMiniMapOthersPos(others, true);
        visible ? list[id].$.removeClass('hidden') : list[id].$.addClass('hidden');
        list[id].$.find('.center').css('color', color);
        list[id].show = visible;
    };

    this.getPersonColor = function(relation) {
        if (!relation) return "#ffffff";

        //return statesFromStorage[relation][WhoIsHereData.ATTR.COLOR];
        return statesFromStorage[relation].color;
    };

    this.getPersonVisible = function(relation) {
        if (!relation) return true;
        //var visible = statesFromStorage[relation][WhoIsHereData.ATTR.STATE];
        var visible = statesFromStorage[relation].whoIsHere;

        return visible ? true : false;
    };

    this.getMapPersonVisible = function(relation) {
        if (!relation) return true;

        //return statesFromStorage[relation][WhoIsHereData.ATTR.MAP_STATE];
        return statesFromStorage[relation].mapBlur;
    };


    this.removeFromList = function(id, data) {
        if (!list[id]) return;
        self.wnd.$.find(`[data-id='${id}']`).remove();
        delete list[id];

        self.checkEmpty();

    };

    this.removeWhoIsHere = function(id) {
        var other = Engine.others.check()[id];
        var bool = isset(other) && isset(other.whoIsHere);
        if (bool) {
            delete other.whoIsHere;
            delete other.d.whoIsHere;
            delete other.whoIsHereGlow;
        }
    };

    this.updatePlayersNumber = function() {
        let i = self.getAmountVisibleOthers();
        let v = $playersNumber.html();

        if (v === '' || v != i) {
            $playersNumber.text(i);
            this.playersNumberTipUpdate();
        }
        this.updateAmountOnWidget(i);
    };

    this.updateAmountOnWidget = (amount) => {

        Engine.widgetManager.widgets.updateAmount(Engine.widgetsData.name.WHO_IS_HERE, amount);
    };

    this.countPlayerTypes = function() {
        var types = [];
        for (var id in list) {
            types.push(list[id]['relation']);
        }
        var map = types.reduce(function(prev, cur) {
            prev[cur] = (prev[cur] || 0) + 1;
            return prev;
        }, {});

        return map;
    };

    //this.playersNumberTipUpdateOld = function() {
    //	var playerTypesWithCount = this.countPlayerTypes();
    //	var $div = $('<div>');
    //	for (var i = 0; i < playerTypes.length; i++) {
    //		var $oneType = Templates.get('who-is-here-one-type'),
    //			amount = playerTypesWithCount[playerTypes[i]] && statesFromStorage[playerTypes[i]]['state'] ? playerTypesWithCount[playerTypes[i]] : 0;
    //		$oneType.find('.type').text(_t(playerTypes[i], null, 'whoIsHere'));
    //		$oneType.find('.amount').text(amount);
    //
    //		$oneType.css('color', statesFromStorage[playerTypes[i]][WhoIsHereData.ATTR.COLOR]);
    //		$div.append($oneType);
    //	}
    //	self.wnd.$.find('.players-number .info-icon').tip($div[0].outerHTML, 't-who-is-here');
    //};

    this.playersNumberTipUpdate = function() {
        let tipArray = [];
        let playerTypesWithCount = this.countPlayerTypes();
        const handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;

        tipArray.push('<div>');

        for (var i = 0; i < playerTypes.length; i++) {

            let type = playerTypes[i];
            let whoIsHere = handHeldMiniMapController.getWhoIsHereOfKindByName(type);

            if (type == HandHeldMiniMapData.KIND.HERO) {
                continue;
            }

            if (!whoIsHere) {
                continue;
            }

            let color = StorageFuncHandHeldMiniMap.getColorOfKindByName(type);
            let playerTypeWithCount = playerTypesWithCount[type];
            let typeLabel = _t(type, null, 'edit-panel-option');
            let amount;

            if (color == null) {
                color = handHeldMiniMapController.getDefaultColor(type);
            }

            //if (playerTypeWithCount && whoIsHere) 	amount = playerTypeWithCount;
            if (playerTypeWithCount) amount = playerTypeWithCount;
            else amount = 0;

            tipArray.push(
                `<div class="who-is-here-one-type clearfix" style="color:${color}">
					<div class="type">${typeLabel}</div>
					<div class="amount">${amount}</div>
				</div>`);


        }


        tipArray.push('</div>');

        let tip = tipArray.join('');

        $infoIcon.tip(tip, 't-who-is-here');
    };

    this.searchItems = (val) => {
        var $list = self.wnd.$.find('.player-list');
        $list.find('.one-other').each(function() {
            var $target = $(this),
                txt = $target.find('.name .inner').html().toLowerCase(),
                disp = txt.search(val.toLowerCase()) > -1 ? '' : 'none';

            $target.css('display', disp);
        });
        self.checkEmpty();
    };

    this.initSearch = () => {
        var $searchInput = self.wnd.$.find('.search'),
            $searchX = self.wnd.$.find('.search-x');

        $searchInput.on('input', function() {
            self.searchItems($(this).val());
        });
        $searchX.on('click', function() {
            $searchInput.val('')
                .blur()
                .trigger('input');
        });
    };

    this.initScroll = function() {
        self.wnd.$.find('.scroll-wrapper').addScrollBar({
            track: true
        });
    };

    this.createButton = function(name, cl, callback) {
        var $b = Templates.get('button').addClass(cl);
        $b.find('.label').html(name);
        $b.click(callback);
        self.wnd.$.append($b);
    };

    this.openPanel = function() {
        //open = true;
        //MyLocalStorage.set('whoIsHere/show', true);
        self.addElements();
        self.wnd.show();
        self.wnd.setWndOnPeak();
        self.checkEmpty();
        self.updateScroll();
        Engine.widgetManager.widgets.isActive(Engine.widgetsData.name.WHO_IS_HERE, true);
    };

    this.closePanel = function() {
        //open = false;
        //MyLocalStorage.set('whoIsHere/show', false);
        self.wnd.hide();
        Engine.widgetManager.widgets.isActive(Engine.widgetsData.name.WHO_IS_HERE, false);
    };

    this.managePanelVisible = function() {
        var visible = this.isShow();

        visible ? this.closePanel() : this.openPanel();
    };

    this.onInterfaceReady = function() {
        this.updatePlayersNumber();
        Engine.widgetManager.widgets.isActive(Engine.widgetsData.name.WHO_IS_HERE, self.isShow());
    };

    this.initWindow = function() {

        Engine.windowManager.add({
            content: Templates.get('who-is-here'),
            title: _t('players_on_map'),

            nameWindow: Engine.windowsData.name.WHO_IS_HERE,
            widget: Engine.widgetsData.name.WHO_IS_HERE,
            objParent: this,
            nameRefInParent: 'wnd',
            type: Engine.windowsData.type.TRANSPARENT,
            manageOpacity: 3,
            //lightModeCss      : ".who-is-here .search-wrapper {display:none}",
            manageShow: false,
            managePosition: {
                x: '251',
                y: '60'
            },
            onclose: () => {
                self.managePanelVisible();
            }
        });

        this.wnd.updatePos();
        this.wnd.$.addClass('whoishere-window');
        this.wnd.addToAlertLayer();
    };

    this.setStateOfWhoIsHere = function() {
        //var show = MyLocalStorage.get('whoIsHere/show');
        var show = StorageFuncWindow.getShowWindow(Engine.windowsData.name.WHO_IS_HERE);
        show && show != null ? this.openPanel() : this.closePanel();
    };

    this.onResize = function() {
        this.wnd.updatePos();
    };

};