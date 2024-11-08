var tpl = require('core/Templates');
//var Items = require('core/items/ItemsManager');
//var Item = require('core/items/Item');
var MatchmakingSummary = require('core/MatchmakingSummary');
//var HeroEquipment = require('core/items/HeroEquipment');
var Storage = require('core/Storage');
const OneBuild = require('core/builds/OneBuild.js');
const BuildsCommons = require('core/builds/BuildsCommons.js');
//var Interface = require('core/Interface');

module.exports = function() {
    var self = this;
    var content;
    var allRecipe = {};
    var searchTimer;
    var findPlayerAlertExist = null;
    var eqChooseInterval;
    var mainTitle = _t('coloseum', null, 'matchmaking');
    //var $normalOverlay = $('<div>').addClass('matchmaking-overlay');
    var $normalOverlay;
    var seazonRewardsLoaded = false;
    var endSeazonRewardsLoaded = false;
    var endSeazonRewardsExist = false;
    var chooseOutfit = null;
    var itemsTab = {
        r: {},
        d: {}
    };
    var historyPage = {
        current: null,
        max: null
    };
    var ladderPage = {
        current: null,
        max: null
    };
    var allSkillSets;
    var hugeRewardTpl;
    var bigRewardTpl;
    var smallRewardTpl;

    var matchmakingState = null

    let eqPanelOpen = false;

    //let buildList = null;
    let buildsCommons = null;
    let rewardsToGet = false;

    this.init = function() {
        initBuildsCommons();
        this.initWindow();
        this.hidePanel();

        $normalOverlay = tpl.get('matchmaking-overlay');

        this.createMainWndMatchmaking();
        this.createChooseEq();
        this.createStatsAndHistory();
        this.createProgressPanel();
        this.createRanking();
        this.createStatisticsDetailed();
        this.createDetailsWindow();
        this.createSeasonRewardMain();

        this.setGreenHeader(mainTitle);
        this.createBlinkerWaitIcon();
        this.showMainWnd('.matchmaking-menu');
        this.initFetch();
        this.initScroll();
        this.summary = new MatchmakingSummary();
        this.summary.init();
    };

    const initBuildsCommons = () => {
        buildsCommons = new BuildsCommons();
        buildsCommons.init(Engine.itemsFetchData.NEW_BATTLE_SET_EQ_ITEM);
    };

    this.initScroll = function() {
        this.wnd.$.find('.reward-wrapper').addScrollBar({
            track: true
        });
        this.wnd.$.find('.builds-wrapper').addScrollBar({
            track: true
        });
    };

    this.createSeasonRewardMain = function() {
        var $takeReward = tpl.get('button').addClass('small green');
        self.wnd.$.find('.take-reward').append($takeReward);
        $takeReward.find('.label').html(self.tLang('take_reward_in_next_time'));
        $takeReward.click(function() {
            self.showMatchmakingMenu();
        });
    };

    this.initFetch = function() {
        // Engine.tpls.fetch('r', self.newSeasonItem);
        // Engine.tpls.fetch('i', self.newSeasonRewardItem);
        // Engine.tpls.fetch('d', self.newProgressItem);

        Engine.tpls.fetch(Engine.itemsFetchData.NEW_SEASON_TPL, self.newSeasonItem);
        Engine.tpls.fetch(Engine.itemsFetchData.NEW_SEASON_REWARD_TPL, self.newSeasonRewardItem);
        Engine.tpls.fetch(Engine.itemsFetchData.NEW_PROGRESS_TPL, self.newProgressItem);
    };

    this.newProgressItem = function(item) {
        var slots = self.wnd.$.find('.progress-tpl-slot-id-' + item.id);
        slots.each(function() {
            //var $clone = item.$.clone();
            // var $clone = Engine.tpls.createViewIcon(item.id, 'progress-item', 'd')[0];
            var $clone = Engine.tpls.createViewIcon(item.id, Engine.itemsViewData.PROGRESS_ITEM_VIEW, 'd')[0];
            $(this).append($clone);

            //if (mobileCheck()) {
            //	$clone.click(function (e) {
            //		var o = self.canTakeItem2($(this).parent());
            //		item.createOptionMenu(e, o);
            //	});
            //} else {
            $clone.click(function() {
                var o = self.canTakeItem2($(this).parent());
                if (o) o.f();
            });
            $clone.contextmenu(function(e, mE) {
                var o = self.canTakeItem2($(this).parent());
                item.createOptionMenu(getE(e, mE), o);
                //e.preventDefault();
            });
            //}
        });
    };

    this.newSeasonRewardItem = function(i) {
        var $place = self.wnd.$.find('.season-reward-main').find('.tpl-' + i.id);
        $place.each(function() {
            $(this).empty();
            //var $clone = i.$.clone();
            //var $clone = Engine.tpls.createViewIcon(i.id, 'season-reward-item', 'i')[0];
            var $clone = Engine.tpls.createViewIcon(i.id, Engine.itemsViewData.SEASON_REWARD_ITEM_VIEW, 'i')[0];
            var amount = $(this).attr('data-amount');

            Engine.tpls.changeItemAmount(i, $clone, amount);
            $(this).append($clone);
            $clone.attr('data-tip-type', i.$.data('tipType'));
            $clone.attr('data-item-type', i.$.data('itemType'));

            //if (mobileCheck()) {
            //	$clone.click(function (e) {
            //		i.createOptionMenu(e);
            //	});
            //} else {
            $clone.contextmenu(function(e, mE) {
                i.createOptionMenu(getE(e, mE));
                //e.preventDefault();
            });
            //}
        });
    };

    this.newSeasonItem = function(i) {
        var $place = self.wnd.$.find('.season-wnd').find('.tpl-' + i.id);
        $place.each(function() {
            //var $clone = i.$.clone();
            //var $clone = Engine.tpls.createViewIcon(i.id, 'season-item', 'r')[0];
            var $clone = Engine.tpls.createViewIcon(i.id, Engine.itemsViewData.SEASON_ITEM_VIEW, 'r')[0];
            var amount = $(this).attr('data-amount');
            Engine.tpls.changeItemAmount(i, $clone, amount);
            $(this).html($clone);
            $clone.attr('data-tip-type', i.$.data('tipType'));
            $clone.attr('data-item-type', i.$.data('itemType'));

            $clone.contextmenu(function(e, mE) {
                i.createOptionMenu(getE(e, mE));
                //e.preventDefault();
            });
        });
    };

    this.canTakeItem2 = function($wrapper) {
        var reward_stage = $wrapper.attr('reward_stage');
        if (reward_stage != null) {
            var idX = $wrapper.attr('reward_idx');
            var o = {
                txt: self.tLang('take_reward'),
                f: function() {
                    _g('match&a=profile&reward_stage=' + reward_stage + '&reward_idx=' + idX);
                }
            };
            return o;
        }
        return false;
    };

    this.createHugeRewardTpl = function(v) {
        if (isset(hugeRewardTpl)) return;
        hugeRewardTpl = v;
    };

    this.createBigRewardTpl = function(v) {
        if (isset(bigRewardTpl)) return;
        bigRewardTpl = v;
    };

    this.createSmallRewardTpl = function(v) {
        if (isset(smallRewardTpl)) return;
        smallRewardTpl = v;
    };

    this.createDetailsWindow = function() {
        var $details = tpl.get('details-progress');
        $details.find('.details-txt').html(self.tLang('details_progress'));
        $details.find('.details-header').html(self.tLang('details'));

        Engine.windowManager.add({
            content: $details,
            //nameWindow        : 'detailsWndMatchmaking',
            nameWindow: Engine.windowsData.name.DETAILS_WND_MATCHMAKING,
            objParent: this,
            nameRefInParent: 'detailsWnd',
            type: Engine.windowsData.type.TRANSPARENT,
            addClass: 'mm-details-window',
            onclose: () => {
                self.detailsWnd.hide();
            }
        });
        //self.detailsWnd.$.addClass('mm-details-window');
        self.detailsWnd.hide();
        self.detailsWnd.addToAlertLayer();

    };

    this.toogleDetails = function(e) {
        e.stopPropagation();
        self.detailsWnd.setWndOnPeak();
        var visible = self.detailsWnd.$.css('display') == 'none';
        self.detailsWnd.$.css('display', visible ? 'block' : 'none');
    };

    this.createProgressPanel = function() {
        var $btn1 = tpl.get('button').addClass('small green');
        var $btn3 = tpl.get('button').addClass('small green');

        $btn1.find('.label').html(self.tLang('details'));
        $btn3.find('.label').html(self.tLang('champions-shop'));

        self.wnd.$.find('.progress-wnd').find('.details-btn').append($btn1);
        self.wnd.$.find('.progress-wnd').find('.go-to-shop-btn').append($btn3);

        $btn1.click(self.toogleDetails);
        $btn3.click(function() {
            if (Engine.shop) Engine.shop.close();
            self.hidePanel();
            _g('creditshop&npc=471');
        });
    };

    this.createBlinkerWaitIcon = function() {
        setInterval(function() {
            var $t = $('.matchmaking-timer');
            var c = 'green';
            var isGreen = $t.hasClass(c);
            if (isGreen) $t.removeClass(c);
            else $t.addClass(c);
        }, 2000);
    };

    this.updateSearch = function(v) {
        var since = v.since;
        if (searchTimer) {
            clearInterval(searchTimer);
            searchTimer = null;
        }
        searchTimer = setInterval(function() {
            var val = self.getDurationVal(v.avg_duration);
            var since2 = since < 60 ? since + 's' : Math.round(since / 60) + 'min';
            var str1 = '<div>' + _t('average_wait_time %val', {
                '%val%': val
            }, 'matchmaking') + '</div>';
            var str2 = '<div>' + _t('time_in_queue %val', {
                '%val%': since2
            }, 'matchmaking') + '</div>';
            $('.matchmaking-timer').tip(str1 + str2);
            since++;
        }, 1000);
    };

    this.getDurationVal = function(duration) {
        if (duration == 0) return '-';
        if (duration == 600) return '~10min';
        return '~' + ((duration < 60) ? duration + 's' : Math.round(duration / 60) + 'min');
    };

    this.setGreenHeader = function(txt) {
        self.wnd.$.find('.edit-header-label').html(txt);
    };

    this.createOneTile = function($wrapper, name, header, content, bLabel, clb) {
        var $tile = tpl.get('matchmaking-tile');
        $tile.addClass(name);
        $tile.find('.matchmaking-tile-bottom-label').addClass(name);

        if (header) {
            $tile.find('.matchmaking-tile-header-wrapper').css('display', 'block');
            $tile.find('.matchmaking-tile-header').html(self.tLang(header));
        }
        if (content) $tile.find('.matchmaking-tile-content').html(content);
        if (bLabel) $tile.find('.matchmaking-tile-bottom-label').html(bLabel);

        $tile.click(clb);
        //self.wnd.$.find(wrapper).append($tile);
        $wrapper.append($tile);
        return $tile;
    };

    this.createRanking = function() {
        var $wrapper = self.wnd.$.find('.matchmaking-ranking');
        self.newCard($wrapper, self.tLang('general'), function() {
            _g('match&a=ladder_global&page=1');
        });
        self.newCard($wrapper, self.tLang('clan'), function() {
            if (Engine.hero.d.clan == 0) {
                var $clanWnd = self.wnd.$.find('.clan-ranking-wnd');
                self.hideBottomBar($clanWnd, true);
            }
            _g('match&a=ladder_clan&page=1');
        });
        self.newCard($wrapper, self.tLang('friends'), function() {
            _g('match&a=ladder_friends&page=1');
        });

        self.createBottomRankingPanel('ladder_global');
        self.createBottomRankingPanel('ladder_clan');
        self.createBottomRankingPanel('ladder_friends');
    };

    this.createStatisticsDetailed = function() {
        this.createBottomStatistickDetailed();
    };

    this.createBottomStatistickDetailed = function() {
        var $backToMain = tpl.get('button').addClass('green small');
        var $card = self.wnd.$.find('.stats-and-history');
        $backToMain.find('.label').html(self.tLang('back'));
        $backToMain.click(function() {
            self.setVisibleStats($card, 1);
            self.setGreenHeader(self.tLang('yourstatistics'));
        });
        self.wnd.$.find('.statistics-detailed-bottom-panel').find('.back-to-main').append($backToMain);
    };

    this.setMatchmakingState = function(v) {
        var $queue = self.wnd.$.find('.queue');
        var $label = $queue.find('.matchmaking-tile-bottom-label');
        matchmakingState = v;
        switch (v) {
            case 0:
                $queue.removeClass('active');
                $label.html(self.tLang('lookforfight'));
                if (self.wnd.$.css('display') != 'none') self.showMatchmakingMenu();

                $('#matchmaking-timer').parent().parent().parent().remove();
                self.detachOverlay();
                findPlayerAlertExist = false;

                self.showTimerMatychmaking(false);
                break;
            case 1:
                $queue.addClass('active');
                $label.html(self.tLang('breaklookforfight'));
                if (self.wnd.$.find('.wait-for-opponent').css('display') == 'block') self.showMatchmakingMenu();
                self.detachOverlay();
                self.showTimerMatychmaking(true);
                break;
            case 2:
                //self.wnd.setWndOnPeak();
                //self.appendOverlay();
                //self.showPanel();
                //self.showMainWnd('.wait-for-opponent');
                break;
            case 3:
                self.wnd.setWndOnPeak();
                self.showPanel(false);
                self.showMainWnd('.choose-eq');
                self.deleteChosenAndDisableClassTile();
                self.wnd.$.find('.blink-wait-label').css('display', 'none');
                self.wnd.$.find('.fight-button').removeClass('disable');
                break;
            case 4:
                self.wnd.setWndOnPeak();
                self.showPanel(false);
                self.showMainWnd('.choose-eq');
                self.deleteChosenAndDisableClassTile();
                self.wnd.$.find('.blink-wait-label').css('display', 'block');
                self.wnd.$.find('.fight-button').addClass('disable');
                eqPanelOpen = true;
                break;
            case 5:
                self.deleteCloneEqItems();
                self.showMatchmakingMenu(false);
                //self.detachOverlay();
                self.hidePanel();
                eqPanelOpen = false;
                break;
        }
    };

    this.deleteCloneEqItems = () => {
        for (let egNr in allSkillSets) {
            let oneEq = allSkillSets[egNr].items;
            for (let i = 0; i < oneEq.length; i++) {
                let itemId = oneEq[i];
                if (itemId == 0) continue;
                let itemView = this.getItemView(egNr);
                Engine.items.deleteViewIcon(itemId, itemView);
            }
        }
    };

    this.getItemView = (eqNr) => {
        let parseEqNr = parseInt(eqNr);
        switch (parseEqNr) {
            case 0:
                return Engine.itemsViewData.CHANGE_EQ_ITEM_NR_0_VIEW;
            case 1:
                return Engine.itemsViewData.CHANGE_EQ_ITEM_NR_1_VIEW;
            case 2:
                return Engine.itemsViewData.CHANGE_EQ_ITEM_NR_2_VIEW;
            default: {
                warningReport('Matchmaking.js', "getItemView", 'EqNr not exist!' + parseEqNr);
                return Engine.itemsViewData.CHANGE_EQ_ITEM_NR_0_VIEW
            }
        }
        warningReport('Matchmaking.js', "getItemView", 'EqNr is not int!' + parseEqNr);
        return Engine.itemsViewData.CHANGE_EQ_ITEM_NR_0_VIEW
    }

    this.deleteChosenAndDisableClassTile = function() {
        Engine.matchmaking.wnd.$.find('.choose-eq').find('.matchmaking-tile').removeClass('chosen-tile disabled-tile')
    };

    this.isBlockedShowMatchmakingMenu = function() {
        return !!Engine.trade;
    };

    this.canToggleMatchmaking = function() {
        return !(self.wnd.$.find('.wait-for-opponent').css('display') == 'block' || self.wnd.$.find('.choose-eq').css('display') == 'block');
    };

    this.showTimerMatychmaking = function(state) {
        //$('.interface-layer').find('.matchmaking-timer').css('display', state ? 'block' : 'none');
        Engine.interface.get$interfaceLayer().find('.matchmaking-timer').css('display', state ? 'block' : 'none');
    };

    this.setMatchmakingConfirmation = function(data) {
        switch (data.accept) {
            case 0:
                if (!findPlayerAlertExist) {
                    findPlayerAlertExist = true;
                    self.createFindPlayerAlert();
                }
                $('#matchmaking-timer').html(Math.max(0, data.time_left) + 's');
                break;
            case 1:
                self.wnd.setWndOnPeak();
                self.detachOverlay();
                self.showPanel(false);
                self.showMainWnd('.wait-for-opponent');
                break;
        }
    };

    this.createFindPlayerAlert = function() {
        Engine.soundManager.createNotifSound(6);
        mAlert(self.tLang('findPlayer'), [{
            txt: self.tLang('fight'),
            callback: function() {
                _g('match&a=accept_opp&ans=1', function() {
                    findPlayerAlertExist = false;
                    $('#matchmaking-timer').parent().parent().parent().remove();
                    self.showMainWnd('.wait-for-opponent');
                });
                return true;
            }
        }, {
            txt: self.tLang('refuse'),
            callback: function() {
                _g('match&a=accept_opp&ans=0', function() {
                    findPlayerAlertExist = false;
                    $('#matchmaking-timer').parent().parent().parent().remove();
                });
                return true;
            }
        }]);
        self.appendOverlay();
    };

    this.appendOverlay = function() {
        var maxZIndex = parseInt(Engine.matchmaking.wnd.$.css('z-index'));
        $normalOverlay.css('z-index', maxZIndex - 1);
        //$('.alerts-layer').append($normalOverlay);
        Engine.interface.get$alertsLayer().append($normalOverlay);
    };

    this.detachOverlay = function() {
        $normalOverlay.detach();
    };

    this.setPreparation = function(v) {
        var time = v.time_left;
        //self.wnd.$.find('.eq-stots').removeClass('active');
        //self.wnd.$.find('.choose-eq').find('.eq-' + v.selected_battle_set).addClass('active');
        self.setGreenHeader(self.tLang('choose_your_eq'));
        //allSkillSets = v['battle_sets'];
        //self.setSkillsSets(allSkillSets);
        self.setVSPanel(v);
        eqPanelOpen = true;
        //Engine.items.fetch('g', self.newBatlleSetEqItem);
        getEngine().buildsManager.getBuildsWindow().closePanel();
        buildsCommons.clearItemsFetch();

        createBuilds();

        //Engine.items.removeCallback(Engine.itemsFetchData.NEW_BATTLE_SET_EQ_ITEM)
        //Engine.items.fetch(Engine.itemsFetchData.NEW_BATTLE_SET_EQ_ITEM, self.newBatlleSetEqItem);

        buildsCommons.initItemsFetch();

        if (eqChooseInterval) {
            clearInterval(eqChooseInterval);
            eqChooseInterval = null;
        }
        eqChooseInterval = setInterval(function() {
            self.wnd.$.find('.time').html(time-- + 's');
            if (time < 0) {
                clearInterval(eqChooseInterval);
                eqChooseInterval = null;
            }
        }, 1000);
        if (matchmakingState == 4) {
            //self.wnd.$.find('.choose-eq').find('.matchmaking-tile').each(function () {
            //	if ($(this).hasClass('active')) $(this).addClass('chosen-tile');
            //	else $(this).addClass('disabled-tile');
            //});
            self.wnd.$.find('.choose-eq').find('.one-build').addClass('disable')
        }
    };

    this.setActiveBuild = (id) => {
        var $wrapper = self.wnd.$.find('.choose-eq');
        $wrapper.find('.one-build').removeClass('active');
        $wrapper.find('.one-build').eq(parseInt(id) - 1).addClass('active');
    }

    const createBuilds = () => {
        let buildsManagerBuildsCommons = getEngine().buildsManager.getBuildsCommons();
        let data = buildsManagerBuildsCommons.getCrazyDataToMatchmaking();
        let currentId = buildsManagerBuildsCommons.getCurrentId();
        let $wrapper = self.wnd.$.find('.choose-eq').find('.builds-wrapper').find('.scroll-pane').empty();

        buildsCommons.clearBuilds();

        for (let id in data) {
            let oneBuild = new OneBuild();
            let oneData = data[id];

            buildsCommons.addOneBuildToBuildList(id, oneBuild);

            oneBuild.init(oneData);
            oneBuild.update(oneData);
            $wrapper.append(oneBuild.get$build());
        }

        $wrapper.trigger("update");
        $wrapper.trigger("scrollTop")

        self.setActiveBuild(currentId)
    };
    /*
    	const getItemByIdInBuilds = (idItem) => {
    		let obj = {};

    		for (let idBuild in buildList) {

    			let st = buildList[idBuild].getItemsIds()[idItem];

    			if (isset(st)) {
    				obj[idBuild] = st;
    			}
    		}

    		return lengthObject(obj) ? obj : null;
    	};
    */
    this.setSkillsSets = function() {
        for (var k in allSkillSets) {
            var skillSet = allSkillSets[k].skill_set;
            //var $skillSet = $('<div>').addClass('skill-set skill-set-' + skillSet);
            var $skillSet = tpl.get('skill-set-matchmaking').addClass('skill-set-' + skillSet);
            self.wnd.$.find('.choose-eq').find().remove('.skill-set');
            self.wnd.$.find('.eq-' + (parseInt(k) + 1)).find('.eq-items-set').append($skillSet);
        }
    };

    this.setVSPanel = function(d) {
        var $chooseEq = self.wnd.$.find('.choose-eq');
        var $you = $chooseEq.find('.you-info');
        var $opponent = $chooseEq.find('.opponent-info');
        var h = Engine.hero.d;
        self.setPlayersInfo({
            $wrapper: $you,
            nick: h.nick,
            icon: h.img,
            level: h.lvl,
            rating: d.rating
        });
        self.setPlayersInfo({
            $wrapper: $opponent,
            nick: getAllProfName(d.opponent_prof),
            icon: d.opponent_prof,
            level: d.opponent_lvl,
            rating: d.opponent_rating,
            opponent: true
        });
    };

    this.setOpponentCharacterIcon = ($avatarWrapper, prof) => {
        const $avatarIcon = $avatarWrapper.find('.avatar-icon');
        $avatarIcon.removeClassStartingWith('hidden-prof--');
        $avatarIcon.addClass(`hidden-prof--${prof}`);
    };

    this.setPlayersInfo = function({
        $wrapper,
        nick,
        icon,
        level,
        rating,
        opponent = false
    }) {
        var url = CFG.a_opath + icon;
        const $avatarWrapper = $wrapper.find('.avatar-wrapper');
        if (!opponent) {
            createImgStyle($avatarWrapper, url);
            $wrapper.find('.name').text(nick);
            $wrapper.find('.level-rating').text(level + ' lvl PR ' + rating);
        } else {
            this.setOpponentCharacterIcon($avatarWrapper, icon);
            $wrapper.find('.name').text(_t('opponent', null, 'matchmaking'));
            $wrapper.find('.level-rating').text(nick);
        }
    };

    this.createMainWndMatchmaking = function() {
        var $wrapper = self.wnd.$.find('.matchmaking-menu');
        this.createOneTile($wrapper, 'statistick', false, false, self.tLang('statistics'), function() {
            var $card = self.wnd.$.find('.stats-and-history');
            self.setGreenHeader(self.tLang('progress'));
            self.showMainWnd('.stats-and-history');
            self.setVisibleStats($card, 0);
            _g('match&a=profile');
            //_g('match&a=statistics');
        });
        var queue = this.createOneTile($wrapper, 'queue', false, false, self.tLang('lookforfight'), function() {
            var active = $(this).hasClass('active');
            active ? _g('match&a=signout') : _g('match&a=signin');
        });
        var $matches = tpl.get('completed-matches');
        $matches.tip(_t('matches_point_desc'));

        queue.append($matches);
        this.createOneTile($wrapper, 'history', false, false, self.tLang('ranking'), function() {
            var $card = self.wnd.$.find('.matchmaking-ranking');
            self.setGreenHeader(self.tLang('generalranking'));
            self.showMainWnd('.matchmaking-ranking');
            self.setVisibleStats($card, 0);
            _g('match&a=ladder_global&page=1')
        });
        var $goToTakeReward = tpl.get('button').addClass('green small');

        $goToTakeReward.find('.label').html(self.tLang('take_reward'));
        $wrapper.find('.show-reward-season-item').append($goToTakeReward);
        $goToTakeReward.click(function() {
            self.setGreenHeader(self.tLang('Congratulations'));
            self.showMainWnd('.season-reward-main');
            var outfitExist = self.wnd.$.find('.season-reward-main').find('.your-outfits').children().length > 0;
            if (outfitExist) self.blockTakeRewardButtonAndClearCheckbox();
        });
        this.createBottomMainWndMatchmaking();
    };

    this.createBottomMainWndMatchmaking = function() {
        var $checkbox = tpl.get('one-checkbox');
        self.wnd.$.find('.turn-on-off-tutorial').append($checkbox);
        $checkbox.find('.label').html(_t('dont_show', null, 'matchmaking-tutorial'));
        $checkbox.click(function() {
            var $check = $(this).find('.checkbox').toggleClass('active');
            var active = $check.hasClass('active');
            Storage.set('MM_Tutorial/status', active);
        })
    };

    this.createStatsAndHistory = function() {
        var $wrapper = self.wnd.$.find('.stats-and-history');
        self.newCard($wrapper, self.tLang('progress'), function() {
            _g('match&a=profile');
            Engine.tpls.deleteMessItemsByLoc('d');
        });
        self.newCard($wrapper, self.tLang('yourstatistics'), function() {
            _g('match&a=statistics')
        });
        self.newCard($wrapper, self.tLang('battlehistory'), function() {
            _g('match&a=history&page=1');
        });
        self.newCard($wrapper, self.tLang('season'), function() {

            _g('match&a=season');
        });
        self.createBottomProgressPanel();
        self.createBottomHistoryPanel();
        self.createBottomStatsPanel();
        self.createBottomSeasonPanel();

    };

    this.createBottomSeasonPanel = function() {
        var $backToMain = tpl.get('button').addClass('green small');
        $backToMain.find('.label').html(self.tLang('back'));
        $backToMain.click(function() {
            self.showMatchmakingMenu();
        });
        self.wnd.$.find('.season-bottom-panel').find('.back-to-main').append($backToMain);
    };

    this.newCard = function($par, label, clb) {
        var $card = tpl.get('card');
        //var $card = $('<div>').addClass('card');
        //var $label = $('<span>').addClass('label').html(label);
        $card.find('.label').html(label);
        $par.find('.cards-header').append($card);
        //$card.append($label);
        $card.click(function() {
            var index = $(this).index();
            var overlayExistInMenu = $par.find('.matchmaking-tutorial-overlay').length > 0;
            if (overlayExistInMenu) index--;
            self.setVisibleStats($par, index);
            self.wnd.$.find('.edit-header-label').html(label);
            if (clb) clb();
        });
    };

    this.setVisibleStats = function($parent, index) {
        var $allC = $parent.find('.card').removeClass('active');
        var $allS = $parent.find('.section').removeClass('active');
        $allC.eq(index).addClass('active');
        $allS.eq(index).addClass('active');
    };

    this.createChooseEq = function() {
        //var $wrapper = self.wnd.$.find('.choose-eq');
        //var $eqSlots = tpl.get('eq-items-set');
        //var $eq1 = this.createOneTile($wrapper, 'eq-stots', 'eq-1', $eqSlots, false, function() {
        //	_g('match&a=battleset&ans=1');
        //});
        //var $eq2 = this.createOneTile($wrapper, 'eq-stots', 'eq-2', $eqSlots.clone(), false, function() {
        //	_g('match&a=battleset&ans=2');
        //});
        //var $eq3 = this.createOneTile($wrapper, 'eq-stots', 'eq-3', $eqSlots.clone(), false, function() {
        //	_g('match&a=battleset&ans=3');
        //});
        //$eq1.addClass('eq-1');
        //$eq2.addClass('eq-2');
        //$eq3.addClass('eq-3');
        self.createBottomChooseEqPanel();
    };

    this.showMainWnd = function(name) {
        var $w = self.wnd.$;
        $w.find('.main-wnd').css('display', 'none');
        var $showWnd = $w.find(name).css('display', 'block');
        var noExit = $showWnd.hasClass('no-exit');
        var cl = 'no-exit-button';
        if (noExit) $w.addClass(cl);
        else $w.removeClass(cl);
    };
    /*
    	this.newBatlleSetEqItem = function (i) {
    		//for (var egNr in allSkillSets) {
    		//	var oneEq = allSkillSets[egNr].items;
    		//	for (var i = 0; i < oneEq.length; i++) {
    		//		var itemId = oneEq[i];
    		//		var itemSt = i + 1;
    		//		var parseEqNr = parseInt(egNr) + 1;
    		//		if (fetchItem.id == itemId) {
    		//			//var $clone = Engine.items.createViewIcon(fetchItem.id, 'change-eq-item-nr-' + egNr, 'g')[0];
    		//			let itemView = self.getItemView(egNr);
    		//			var $clone = Engine.items.createViewIcon(fetchItem.id, itemView, 'g')[0];
    		//			$clone.css({
    		//				'top': '1px',
    		//				'left': '2px'
    		//			});
    		//			self.wnd.$.find('.eq-' + parseEqNr).find('.st-' + itemSt).append($clone);
    		//		}
    		//	}
    		//}


    		let itemId              = i.id;
    		let buildsWithItems     = getItemByIdInBuilds(itemId);

    		if (!buildsWithItems) {
    			return
    		}

    		for (let buildId in buildsWithItems) {

    			let st              = buildsWithItems[buildId];
    			let buildData       = buildList[buildId];
    			let $oneBuild       = buildData.get$build();
    			let $itemsWrapper   = $oneBuild.find(".items");

    			createItem(itemId, st, $itemsWrapper)
    		}

    	};

    	const createItem = (id, st, $itemsWrapper) => {
    		let item        = getEngine().items.getItemById(id);
    		let iconData    = Engine.items.createViewIcon(id, Engine.itemsViewData.BUILDS_VIEW_MM);

    		if (!iconData || !item) {
    			console.log('none');
    			return
    		}

    		let $icon = iconData[0];

    		$icon.attr("data-st", parseInt(st) + 1);


    		$icon.contextmenu(function (e, mE) {
    			item.createOptionMenu(getE(e, mE), false, {
    				canPreview              : true,
    				use                     : true,
    				move                    : true,
    				destroy                 : true,
    				drop                    : true,
    				moveToEnhancement       : true,
    				bonus_not_selected      : true,
    				enhance      			: true
    			});
    		});

    		$itemsWrapper.append($icon);
    	};
    */
    this.initWindow = function() {
        content = tpl.get('matchmaking-panel');

        Engine.windowManager.add({
            content: content,
            title: self.tLang('matchmaking'),
            //nameWindow        : 'matchmaking',
            nameWindow: Engine.windowsData.name.MATCHMAKING,
            widget: Engine.widgetsData.name.MATCHMAKING,
            objParent: this,
            nameRefInParent: 'wnd',
            onclose: () => {
                self.hidePanel();
            }
        });
        this.wnd.addToAlertLayer();

    };

    this.toggle = function() {
        if (self.canToggleMatchmaking()) self.wnd.$.css('display') == 'none' ? self.showPanel() : self.hidePanel();
    };

    this.showPanel = (refreshStats = true) => {
        if (Engine.battle.getShow()) return;
        //this.wnd.$.css('display', 'block');
        self.wnd.show()
        //this.wnd.setDisplayBlockOfWindow();
        self.showMatchmakingMenu(refreshStats);
    };

    this.hidePanel = function() {
        //this.wnd.$.css('display', 'none');
        //this.wnd.setDisplayNoneOfWindow();
        this.wnd.hide();
        Engine.tpls.deleteMessItemsByLoc('d');
        // Engine.tpls.deleteMessItemsByLoc('i');
        Engine.tpls.deleteMessItemsByLoc('r');
    };

    this.nanana = function() {
        var data = {
            positions: {
                '1': {
                    result: 0,
                    rating_delta: -15,
                    start_ts: 1507223840,
                    opponent_lvl: 300,
                    opponent_prof: "b"
                },
                '2': {
                    result: 1,
                    rating_delta: -15,
                    start_ts: 1507223840,
                    opponent_lvl: 300,
                    opponent_prof: "b"
                },
                '3': {
                    result: 2,
                    rating_delta: -15,
                    start_ts: 1507223840,
                    opponent_lvl: 300,
                    opponent_prof: "b"
                },
                '4': {
                    result: 0,
                    rating_delta: -15,
                    start_ts: 1507223840,
                    opponent_lvl: 300,
                    opponent_prof: "b"
                },
                '5': {
                    result: 1,
                    rating_delta: -15,
                    start_ts: 1509223840,
                    opponent_lvl: 300,
                    opponent_prof: "b"
                },
                '6': {
                    result: 2,
                    rating_delta: -15,
                    start_ts: 1509223840,
                    opponent_lvl: 300,
                    opponent_prof: "b"
                },
                '7': {
                    result: 0,
                    rating_delta: -15,
                    start_ts: 1509223840,
                    opponent_lvl: 300,
                    opponent_prof: "b"
                },
                '8': {
                    result: 1,
                    rating_delta: -15,
                    start_ts: 1510223840,
                    opponent_lvl: 300,
                    opponent_prof: "b"
                },
                '9': {
                    result: 2,
                    rating_delta: -15,
                    start_ts: 1510223840,
                    opponent_lvl: 300,
                    opponent_prof: "b"
                },
                '10': {
                    result: 1,
                    rating_delta: -15,
                    start_ts: 1510223840,
                    opponent_lvl: 300,
                    opponent_prof: "b"
                }
            }
        }
        self.updateHistory(data);
    };

    this.createBottomRankingPanel = function(kind) {
        const $refresh = tpl.get('button').addClass('green small');
        $refresh.find('.label').html(_t('refresh', null, 'buttons'));
        $refresh.click(function() {
            const page = Math.max(1, ladderPage.current - 1);
            _g('match&a=' + kind + '&page=1');
        });

        var $backToMain = tpl.get('button').addClass('green small');
        $backToMain.find('.label').html(self.tLang('back'));
        $backToMain.click(function() {
            self.showMatchmakingMenu();
        });

        var $prev = tpl.get('button').addClass('green small');
        $prev.find('.label').html(self.tLang('previouspage'));
        $prev.click(function() {
            var page = Math.max(1, ladderPage.current - 1);
            _g('match&a=' + kind + '&page=' + page);
        });

        var $next = tpl.get('button').addClass('green small');
        $next.find('.label').html(self.tLang('nextpage'));
        $next.click(function() {
            var page = Math.min(ladderPage.current + 1, ladderPage.max);
            _g('match&a=' + kind + '&page=' + page);
        });

        const $ranking = self.wnd.$.find('.' + kind + '-bottom-panel');
        $ranking.find('.refresh').append($refresh);
        $ranking.find('.back-to-main').append($backToMain);
        $ranking.find('.prev-page').append($prev);
        $ranking.find('.next-page').append($next);

        let $pageNumber = $ranking.find('.page-number');

        $pageNumber.keypress(function(e) {
            if (e.which == 13) {
                var val = $(this).val();
                val = val < 1 ? 1 : Math.min(val, ladderPage.max);
                _g('match&a=' + kind + '&page=' + val);
            }
        });
        setOnlyPositiveNumberInInput($pageNumber)
    };

    this.createBottomProgressPanel = function() {
        var $backToMain = tpl.get('button').addClass('green small');
        $backToMain.find('.label').html(self.tLang('back'));
        $backToMain.click(function() {
            self.showMatchmakingMenu();
        });
        var $history = self.wnd.$.find('.progress-bottom-panel');
        $history.find('.back-to-main').append($backToMain);

        var $getAll = tpl.get('button').addClass('green small disable');
        $getAll.find('.label').html(self.tLang('get-all'));
        $getAll.click(() => {
            getAllRewards();
        });
        var $history = self.wnd.$.find('.progress-bottom-panel');
        $history.find('.get-all').append($getAll);
    };

    this.createBottomHistoryPanel = function() {
        var $backToMain = tpl.get('button').addClass('green small');
        $backToMain.find('.label').html(self.tLang('back'));
        $backToMain.click(function() {
            self.showMatchmakingMenu();
        });

        var $prev = tpl.get('button').addClass('green small');
        $prev.find('.label').html(self.tLang('previouspage'));
        $prev.click(function() {
            var page = Math.max(1, historyPage.current - 1);
            _g('match&a=history&page=' + page);
        });

        var $next = tpl.get('button').addClass('green small');
        $next.find('.label').html(self.tLang('nextpage'));
        $next.click(function() {
            var page = Math.min(historyPage.current + 1, historyPage.max);
            _g('match&a=history&page=' + page);
        });

        var $history = self.wnd.$.find('.history-bottom-panel');
        $history.find('.back-to-main').append($backToMain);
        $history.find('.prev-page').append($prev);
        $history.find('.next-page').append($next);

        let $pageNumber = $history.find('.page-number');

        $pageNumber.keypress(function(e) {
            if (e.which == 13) {
                var val = $(this).val();
                val = val < 1 ? 1 : Math.min(val, historyPage.max);
                _g('match&a=history&page=' + val);
            }
        });

        setOnlyPositiveNumberInInput($pageNumber)
    };

    this.createBottomStatsPanel = function() {
        var $backToMain = tpl.get('button').addClass('green small');
        $backToMain.find('.label').html(self.tLang('back'));
        $backToMain.click(function() {
            self.showMatchmakingMenu();
        });
        self.wnd.$.find('.stats-bottom-panel').find('.back-to-main').append($backToMain);
    };

    this.createBottomChooseEqPanel = function() {
        var $fight = tpl.get('button').addClass('green small');
        $fight.find('.label').html(self.tLang('fight2'));
        $fight.click(function() {
            //self.showMainWnd('.wait-for-opponent');
            //self.hidePanel();
            _g('match&a=prepared');
        });
        self.wnd.$.find('.choose-eq-bottom-panel').find('.fight-button').append($fight);
    };

    this.showMatchmakingMenu = function(refreshStats = true) {
        if (!endSeazonRewardsExist) Engine.matchmakingTutorial.setTutorialById(0);
        if (refreshStats) _g('match&a=main');

        if (self.isBlockedShowMatchmakingMenu()) {
            self.hidePanel();
            return false;
        }
        self.setGreenHeader(mainTitle);
        self.showMainWnd('.matchmaking-menu');
        self.wnd.setWndOnPeak();
    };



    this.warningPoints = function(cur, min) {
        self.wnd.$.find('.warning-points').find('.text').html(_t('warning_points') + ': ' + cur + '/' + min);
    };

    this.matchesPoints = function(cur, min) {
        var val = cur >= min ? min : cur;
        self.wnd.$.find('.completed-matches').find('.text').html(val + '/' + min);
        self.wnd.$.find('.completed-matches').css('display', min == 0 ? 'none' : 'block');
    };

    this.updatehistoryPageInfo = function(current, max) {
        historyPage.current = current;
        historyPage.max = max;
        self.wnd.$.find('.history-bottom-panel').find('.page-number').val(current);
        self.wnd.$.find('.history-bottom-panel').find('.page-info').html(self.tLang('page') + ' ' + current + '/' + max);
    };

    this.updateHistory = function(data) {
        Engine.matchmakingTutorial.setTutorialById(3);
        var oldDate;
        var rowspanEl;
        var sameDayRowsCounter = 0;
        this.updatehistoryPageInfo(data.cur_page, data.max_page);
        var $table = self.wnd.$.find('.history-table').empty();
        self.createHeaderOfHistoryTable($table);
        for (var pos in data.positions) {
            var $record;
            var rec = data.positions[pos];

            var startTs = rec['start_ts'];
            if (!oldDate) oldDate = self.getDateStr(startTs);
            var newDate = self.getDateStr(startTs);

            if (newDate == oldDate) sameDayRowsCounter++;
            else {
                rowspanEl.attr('rowspan', sameDayRowsCounter);
                oldDate = newDate;
                sameDayRowsCounter = 1;
            }

            if (sameDayRowsCounter == 1) {
                $record = self.createHistoryRecord(rec, startTs, newDate);
                rowspanEl = $record.children().last();
            } else $record = self.createHistoryRecord(rec, startTs);

            $table.append($record);
        }
        if (lengthObject(data.positions) > 0) rowspanEl.attr('rowspan', sameDayRowsCounter);
    };

    this.createHistoryRecord = function(rec, startTs, newDate) {
        var $result = self.getResult(rec.result);
        var profAndLvl = getAllProfName(rec.opponent_prof) + ' ' + rec.opponent_lvl + ' lvl';
        var ratingDelta = rec.rating_delta;
        var battleTime = rec.end_ts - startTs;
        var time = self.getHourStr(startTs);
        var $record;
        if (newDate) $record = self.createRecords(
            [
                $result,
                profAndLvl,
                ratingDelta,
                battleTime + ' s',
                time,
                newDate
            ],
            ['normal-td left', 'normal-td right', 'normal-td center', 'normal-td center', 'normal-td center', 'center date']);
        else $record = self.createRecords(
            [
                $result,
                profAndLvl,
                ratingDelta,
                battleTime + ' s',
                time
            ],
            ['normal-td left', 'normal-td right', 'normal-td center', 'normal-td center', 'normal-td center']);

        return $record
    };

    this.createHeaderOfHistoryTable = function($table) {
        $table.append(self.createRecords(
            [
                self.tLang('result'),
                self.tLang('prof-and-lvl'),
                self.cellWithSmallInfo('PR', self.tLang('rank-points')),
                self.tLang('battleTime'),
                self.tLang('time'),
                self.tLang('date')
            ],
            [
                'header-td italic big-height-td result',
                'header-td italic big-height-td prof-and-lvl',
                'header-td italic big-height-td rank-points',
                'header-td italic big-height-td battle-time',
                'header-td italic big-height-td time',
                'header-td italic big-height-td date'
            ]));
    };

    this.getResult = function(result) {
        var txt;
        var cl;
        switch (result) {
            case 1:
                txt = 'Lose';
                cl = 'lose';
                break;
            case 0:
                txt = 'Win';
                cl = 'win';
                break;
            case 2:
                txt = 'Draw';
                cl = 'draw';
                break;
        }
        //return $('<div>').html(self.tLang(txt)).addClass('result-' + cl);
        return tpl.get('fight-result').html(self.tLang(txt)).addClass('result-' + cl);
    };

    this.getHourStr = function(date) {
        var str = ut_fulltime(date.toString());
        return str.substr(str.indexOf(' ') + 1, str.length);
    };

    this.getDateStr = function(date) {
        var str = ut_fulltime(date.toString());
        return str.substr(0, str.indexOf(' '));
    };

    this.updateProgressPanel = function(v) {
        Engine.matchmakingTutorial.setTutorialById(1);
        this.createRewardItems(v);

        var $progressWnd = self.wnd.$.find('.progress-wnd');

        var url = CFG.a_opath + Engine.hero.d.img;

        $progressWnd.find('.char-info').text(`${Engine.hero.d.nick} (${Engine.hero.d.lvl}${Engine.hero.d.prof})`);

        createImgStyle($progressWnd.find('.outfit-wrapper'), url);

        $progressWnd.find('.right-side').empty();

        rewardsToGet = false
        for (var k in v.daily_stages) {
            var oneStage = v.daily_stages[k];
            self.setMachmakingProgressStage(oneStage.id, oneStage.points_cur, oneStage.points_max, oneStage.rewards_max, oneStage.rewards_cur, oneStage.rewards_last);
            getAllBtnSetState();
        }
    };

    this.updateSeasonPanel = function(v) {
        Engine.matchmakingTutorial.setTutorialById(4);
        self.updateRewardsInfo(v);
        self.createSeasonReward(v);
    };

    this.updateRewardsInfo = function(v) {
        const $sesonWnd = self.wnd.$.find('.season-wnd');
        const txtInfo = v.outfit_one && v.outfit_two ? 'txt-info-outfits' : 'txt-info';

        $sesonWnd.find('.played-battle').html(self.tLang('played-battle') + '?/?');
        $sesonWnd.find('.header-info').html(self.tLang('season-header-info'));
        $sesonWnd.find('.txt-info').html(self.tLang(txtInfo));
        $sesonWnd.find('.players-in-ranking-info').html(self.tLang('players-in-ranking-info') + '<span>' + v.players_cur + '/' + v.players_max + '</span>');
        $sesonWnd.find('.amount-players-got-outfit-info').html(self.tLang('amount-players-got-outfit-info') + '<span>' + v.outfits_cur_count + '</span>');

        $sesonWnd.find('.wrapper-outfit-info').empty();
        $sesonWnd.find('.wrapper-outfit-info').append(self.getOutfit(v.outfit_one));
        $sesonWnd.find('.wrapper-outfit-info').append(self.getOutfit(v.outfit_two));
        //$sesonWnd.find('.wrapper-outfit-info').append(self.getOutfit(Engine.hero.d.img));
        //$sesonWnd.find('.wrapper-outfit-info').append(self.getOutfit(Engine.hero.d.img));

        if (!(v.outfit_one && v.outfit_two)) {
            $sesonWnd.find('.outfits-wrapper').css('display', 'none');
        }

        $sesonWnd.find('.your-season-record').html(self.tLang('your-season-record') + ': ' + v.rating_best_season + ' PR');
        $sesonWnd.find('.your-career-record').html(self.tLang('your-career-record') + ': ' + v.rating_best_career + ' PR');
    };

    this.getOutfit = function(patch) {
        //var $out = $('<div>').addClass('season-outfit').css('background-image', 'url(' + CFG.opath + patch + ')');
        var $out = tpl.get('season-outfit').css('background-image', 'url(' + CFG.a_opath + patch + ')');
        return $out;
    };

    this.createSeasonReward = function(v) {
        if (seazonRewardsLoaded) return;
        seazonRewardsLoaded = true;
        self.wnd.$.find('.reward-wrapper').find('.scroll-pane').find('.rage-wrapper').remove();

        const {
            rewards
        } = v;
        const sortedKeys = Object.keys(rewards).sort((a, b) => {
            const aNum = parseInt(a.split('-')[0]) || parseInt(a);
            const bNum = parseInt(b.split('-')[0]) || parseInt(b);
            return aNum - bNum;
        });

        for (const k of sortedKeys) {
            var $wrapper = tpl.get('rage-wrapper').addClass('rage-wrapper');
            var $place = tpl.get('place-matchmaking').html('#' + k).addClass('place-' + k);

            for (var i = 0; i < rewards[k].length; i++) {
                var r = rewards[k][i];
                var itemWrapper = tpl.get('item-wrapper-matchmaking').addClass('tpl-' + r[0]);
                itemWrapper.attr('data-amount', r[1]);
                $wrapper.append(itemWrapper);
            }
            $wrapper.prepend($place);

            //self.wnd.$.find('.season-wnd').find('.reward-wrapper').append($wrapper);
            self.wnd.$.find('.season-wnd').find('.reward-wrapper').find('.scroll-pane').append($wrapper);
        }
        self.setSeasonScroll(v.rewards.length);
    };

    this.setSeasonScroll = function(length) {
        var $season = self.wnd.$.find('.season-wnd');
        $season.find('active').removeClass('active');
        if (length <= 6) return;
        $season.find('.reward-header').addClass('active');
        $season.find('.winners-header').addClass('active');
        $season.find('.winners-wrapper').addClass('active');
        $season.find('.middle-wood').addClass('active');
        $('.reward-wrapper', self.wnd.$).trigger('update');
    };

    this.createRewardItems = function(v) {
        self.createHugeRewardTpl(v.huge_reward_tpl);
        self.createBigRewardTpl(v.big_reward_tpl);
        self.createSmallRewardTpl(v.small_reward_tpl);
    };

    this.getRomeVal = function(v) {
        switch (v) {
            case 0:
                return 'I';
            case 1:
                return 'II';
            case 2:
                return 'III';
            case 3:
                return 'IV';
            case 4:
                return 'V';
            case 5:
                return 'VI';
        }
    };

    this.setMachmakingProgressStage = function(id, currentPoints, maxPoints, amountItems, rewards_cur, rewards_last) {
        var $progressWnd = self.wnd.$.find('.progress-wnd');
        var $progressStage = tpl.get('matchmaking-progress-stage');
        var barW = 252;
        var first = [true];
        $progressWnd.find('.right-side').append($progressStage);
        var w = barW / amountItems;
        var p = barW * (currentPoints / maxPoints);
        var $itemsWrapper = $progressStage.find('.items-wrapper');
        $progressStage.find('.background-bar').css('width', p);
        $progressStage.find('.stage').html(self.tLang('stage') + ' ' + self.getRomeVal(id));
        $progressStage.find('.ratio').html(currentPoints + '/' + maxPoints);
        for (var i = 1; i < amountItems + 1; i++) {
            //var $itemsChestSlot = $('<div>').addClass('item-chest-slot');
            var $itemsChestSlot = tpl.get('item-chest-slot-matchmaking');
            var pos = i * w;
            //var $border = $('<div>').addClass('item-chest-border');
            var $border = $itemsChestSlot.find('.item-chest-border');
            //$itemsChestSlot.append($border);
            self.appendPriceItemToSlot(first, $border, $itemsChestSlot, i, rewards_cur, rewards_last, amountItems, currentPoints, id);
            $itemsChestSlot.css('left', pos);
            $itemsWrapper.append($itemsChestSlot);
            if (i == amountItems) continue;
            //var $measure = $('<div>').addClass('measure');
            var $measure = tpl.get('measure-matchmaking');
            $measure.css('left', pos);
            $itemsWrapper.append($measure);
        }

        if (rewards_last < rewards_cur) rewardsToGet = true;
    };

    this.appendPriceItemToSlot = function(first, $border, $itemsChestSlot, i, rewards_cur, rewards_last, amountItems, currentPoints, index) {
        var cl = '';
        var available = false;
        var disabled = false;
        var cl2 = 'unavailable-level';
        var idTpl = smallRewardTpl;

        if (rewards_last >= i) {
            cl += 'disabled';
            cl2 = 'disabled ' + cl2;
            disabled = true;
        }

        if (currentPoints == 0 && rewards_cur == 0 && rewards_last == 0) {
            cl += 'disabled';
            cl2 = 'disabled ' + cl2;
            disabled = true;
        }

        if (!disabled && i <= rewards_cur) {
            cl += ' available-level';
            available = true;
        } else cl += ' unavailable-level';

        if (i == amountItems) {
            cl += '-last';
            cl2 += '-last';
            idTpl = bigRewardTpl;
        }

        if (i === 5 && index === 3) {
            idTpl = hugeRewardTpl;
        }

        if (self.wnd.$.find('.first').length == 0 && available && !disabled) {
            cl += ' first';
            //$itemsChestSlot.click(function () {
            //	_g('match&a=profile&reward_stage=' + index + '&reward_idx=' + (i - 1))
            //})
            $itemsChestSlot.attr('reward_stage', index);
            $itemsChestSlot.attr('reward_idx', (i - 1));
        }
        $border.addClass(cl);
        $itemsChestSlot.addClass(cl2);
        $itemsChestSlot.addClass('progress-tpl-slot-id-' + idTpl);
    };

    this.getChestItemCl = function(currentPoints, i, amountItems, itemPos, barWidth) {
        if (itemPos > barWidth) return i == amountItems ? 'unavailable-level-last' : 'unavailable-level';
        else return i == amountItems ? 'available-level-last' : 'available-level';
    };

    this.updateRanking = function(data, sectionSelector, kind) {
        var $section = self.wnd.$.find(sectionSelector);
        var $table = $section.find('.ranking-table').empty();
        var count = (data.cur_page - 1) * 10;

        switch (kind) {
            case 'friends':
                Engine.matchmakingTutorial.setTutorialById(7);
                var noFriend = data.cur_page == 1 && lengthObject(data['positions']) == 0;
                var $friendRankingWnd = self.wnd.$.find('.friends-ranking-wnd');
                self.hideBottomBar($friendRankingWnd, noFriend);
                break;
            case 'clan':
                Engine.matchmakingTutorial.setTutorialById(6);
                var noClan = data.cur_page == 1 && lengthObject(data['positions']) == 0;
                var $clanWnd = self.wnd.$.find('.clan-ranking-wnd');
                self.hideBottomBar($clanWnd, noClan);
                break;
            case 'global':
                Engine.matchmakingTutorial.setTutorialById(5);
                break;
        }

        this.updateRankingPageInfo(data.cur_page, data.max_page, $section);

        for (var k in data['positions']) {
            var rec = data['positions'][k];
            count++;
            var $rec = self.createRecords(
                [
                    rec.position + '.',
                    rec.nick + ` (${rec.lvl}${rec.prof})`,
                    rec.rating,
                    rec.wins_ratio + '%',
                    rec.wins + '/' + rec.losses + '/' + rec.draws
                ],
                ['normal-td left', 'normal-td left', 'normal-td right', 'normal-td center', 'normal-td center', 'normal-td center']);
            var p = CFG.a_opath + rec.ikona;

            const avatar = $('<div class="avatar-icon" />');
            createImgStyle(avatar, p);
            $rec.addClass('hover-tr');
            $rec.tip(avatar, 't_outfit');
            $table.append($rec);
        }

        self.createHeaderOfRankingTable($table);
    };

    this.hideBottomBar = function(sectionWnd, state) {
        sectionWnd.find('.text-info').css('display', !state ? "none" : 'block');
        sectionWnd.find('.page-info, .prev-page, .input-wrapper, .next-page').css('display', state ? "none" : 'block');
    };

    this.updateRankingPageInfo = function(current, max, $section) {
        ladderPage.current = current;
        ladderPage.max = max;
        $section.find('.page-number').val(current);
        $section.find('.page-info').html(self.tLang('page') + ' ' + current + '/' + max);
    };

    this.createHeaderOfRankingTable = function($table) {
        $table.prepend(self.createRecords(
            [
                self.tLang('lp'),
                self.tLang('playernick'),
                self.cellWithSmallInfo('PR', self.tLang('rank-points')),
                self.cellWithSmallInfo('PW', self.tLang('winsratio')),
                self.cellWithSmallInfo(self.tLang('WPR'), self.tLang('wpr_tip'))
            ],
            [
                'header-td italic big-height-td lp',
                'header-td italic big-height-td player-nick',
                'header-td italic big-height-td',
                'header-td italic big-height-td',
                'header-td italic big-height-td'
            ]));
    };

    this.updateStatistics = function(data) {
        Engine.matchmakingTutorial.setTutorialById(2);
        var $table = self.wnd.$.find('.stats-table').empty();
        var avgWinsRatio = 0;
        var sumWins = 0;
        var sumLosses = 0;
        var sumDraws = 0;
        var count = 0;
        for (var charName in data) {
            var rec = data[charName];
            var $firstCell = self.createAvatarNameLevelAndProfCell(rec, charName);
            var $record;


            avgWinsRatio += rec.wins_ratio;
            sumWins += rec.wins;
            sumLosses += rec.losses;
            sumDraws += rec.draws;

            if (rec.status != 0) {
                count++;
                $record = self.createRecords(
                    [
                        $firstCell,
                        rec.ladder_pos,
                        rec.rating,
                        rec.wins_ratio + '%',
                        rec.wins + '/' + rec.losses + '/' + rec.draws
                    ],
                    ['normal-td', 'normal-td ladder-pos center', 'normal-td rating center', 'normal-td wins-ratio center', 'normal-td w-p-r center']);
            } else {
                var txt = _t('in_classification %val%', {
                    '%val%': rec.placement_cur + '/' + rec.placement_max
                }, 'matchmaking');
                $record = self.createRecords(
                    [
                        $firstCell,
                        txt
                    ],
                    ['normal-td', 'normal-td center']);
                $record.children().last().attr('colspan', 4);
            }

            $table.append($record);
            $record.addClass('hover-tr')
            self.detailsClick(rec.playerId, $record);
        }
        if (count != 0) avgWinsRatio = Math.round(avgWinsRatio / count);

        self.createHeaderOfStatsTable($table, avgWinsRatio, sumWins, sumLosses, sumDraws);
    };

    this.detailsClick = function(id, $record) {
        $record.click(function() {
            _g('match&a=statistics_detailed&player_id=' + id);
        });
    };

    this.createAvatarNameLevelAndProfCell = function(rec, charName) {
        var $firstCell = tpl.get('first-cell-matchmaking');
        var $imgWrapper = $firstCell.find('.img-wrapper');
        var url = CFG.a_opath + rec.icon;
        createImgStyle($imgWrapper, url, {
            'height': '22px'
        }, {
            'background-size': '400% 800%'
        });
        $firstCell.find('.info').html('<b>' + charName + '</b>' + " <i>(" + rec.lvl + rec.prof + ")</i>");
        return $firstCell;
    };

    this.createHeaderOfStatsTable = function($table, avgWinsRatio, sumWins, sumLosses, sumDraws) {
        // var pl = _l() == "pl";
        var pl = isPl();
        var wR = avgWinsRatio.toString();
        var w = sumWins.toString();
        var l = sumLosses.toString();
        var d = sumDraws.toString();

        var txt0 = pl ? 'M' : 'P';
        var txt1 = pl ? 'PR' : 'RP';
        var txt2 = (pl ? 'PW' : '') + '<br>' + wR + '%';
        var txt3 = self.tLang('WPR') + '<br>' + w + '/' + l + '/' + d;

        $table.prepend(self.createRecords(
            [
                self.tLang('chardata'),
                self.cellWithSmallInfo(txt0, self.tLang('ranking_place')),
                self.cellWithSmallInfo(txt1, self.tLang('rank-points')),
                self.cellWithSmallInfo(txt2, self.tLang('winsratio')),
                self.cellWithSmallInfo(txt3, self.tLang('wpr_tip'))
            ],
            [
                'header-td big-height-td italic char-data',
                'header-td big-height-td italic place-data',
                'header-td big-height-td italic pr-data',
                'header-td big-height-td italic pw-data',
                'header-td big-height-td italic wpr-data'
            ]));
    };

    this.cellWithSmallInfo = function(label, tip) {
        //var $smallInfo = $('<div>').addClass('small-info info-icon');
        var $smallInfo = tpl.get('info-icon').addClass('small-info');
        var $label = $('<div>').addClass('label');
        $smallInfo.tip(tip);
        $label.html(label);
        return $label.append($smallInfo);
    };

    this.updateStatisticsDetailed = function(data) {
        var $table = self.wnd.$.find('.statistics-detailed-table').empty();
        var avgWinsRatio = 0;
        var sumWins = 0;
        var sumLosses = 0;
        var sumDraws = 0;
        var count = 0;

        var $card = self.wnd.$.find('.stats-and-history');

        for (var prof in data) {
            if (prof == 'all') continue;
            var rec = data[prof];

            count++;
            avgWinsRatio += rec.wins_ratio;
            sumWins += rec.wins;
            sumLosses += rec.losses;
            sumDraws += rec.draws;

            $table.append(self.createRecords(
                [
                    getAllProfName(prof),
                    rec.rating,
                    rec.wins_ratio + '%',
                    rec.wins + '/' + rec.losses + '/' + rec.draws
                ],
                ['big-td center', 'big-td center', 'big-td center', 'big-td center']));
        }
        //if (count != 0) avgWinsRatio = Math.round(avgWinsRatio / count);

        self.createHeaderOfStatisticsDetailed($table, data.all.wins_ratio, sumWins, sumLosses, sumDraws);
        self.setVisibleStats($card, 4);
        self.setGreenHeader(self.tLang('additionalstatistics'));
        self.wnd.$.find('.stats-and-history').find('.card').eq(1).addClass('active')
    };

    this.createHeaderOfStatisticsDetailed = function($table, avgWinsRatio, sumWins, sumLosses, sumDraws) {
        // var pl = _l() == "pl";
        var pl = isPl();
        var wR = avgWinsRatio.toString();
        var w = sumWins.toString();
        var l = sumLosses.toString();
        var d = sumDraws.toString();

        var txt1 = pl ? 'PR' : '';
        var txt2 = (pl ? 'PW' : '') + '<br>' + wR + '%';
        var txt3 = self.tLang('WPR') + '<br>' + w + '/' + l + '/' + d;

        $table.prepend(self.createRecords(
            [
                self.tLang('classopponents'),
                self.cellWithSmallInfo(txt1, self.tLang('rank-points')),
                self.cellWithSmallInfo(txt2, self.tLang('winsratio')),
                self.cellWithSmallInfo(txt3, self.tLang('wpr_tip'))
            ],
            [
                'header-td big-height-td italic prof-data-detail',
                'header-td big-height-td italic pr-detail',
                'header-td big-height-td italic pw-detail',
                'header-td big-height-td italic wpr-detail'
            ]));
    };

    this.matchmakingSeasonPosition = function(v) {
        if (v.ladder_position == 0) return;
        if (v.rewards.length == 0) return;
        endSeazonRewardsExist = true;

        self.showPanel();
        self.wnd.$.find('.show-reward-season-item').css('display', 'block');
        self.setGreenHeader(self.tLang('Congratulations'));
        self.showMainWnd('.season-reward-main');

        if (endSeazonRewardsLoaded) return;
        endSeazonRewardsLoaded = true;

        self.wnd.$.find('.season-reward-main').find('.your-place').html(_t('your_place %place%', {
            '%place%': '#' + v.ladder_position
        }, 'matchmaking'));
        self.createGetRewardButton();

        for (var k in v.rewards) {
            var r = v.rewards[k];
            //var itemWrapper = $('<div>').addClass('item-wrapper tpl-' + r[0]);
            var itemWrapper = tpl.get('item-wrapper-matchmaking').addClass('tpl-' + r[0]);
            itemWrapper.attr('data-amount', r[1]);
            self.wnd.$.find('.season-reward-main').find('.your-reward').append(itemWrapper);
        }

        if (!isset(v.outfit_one)) return;

        self.wnd.$.find('.season-reward-main').find('.your-outfits').append(self.outfitWrapperWithCheckbox(v.outfit_one, 'woman'));
        self.wnd.$.find('.season-reward-main').find('.your-outfits').append(self.outfitWrapperWithCheckbox(v.outfit_two, 'man'));
        self.blockTakeRewardButtonAndClearCheckbox();
    };

    this.blockTakeRewardButtonAndClearCheckbox = function() {
        chooseOutfit = null;
        self.wnd.$.find('.season-reward-main').find('.active').removeClass('active');
        self.wnd.$.find('.season-reward-main').find('.take-reward-now').find('.button').addClass('black');
    };

    this.createGetRewardButton = function() {
        var $wrapper = self.wnd.$.find('.season-reward-main').find('.take-reward-now');
        var $but = tpl.get('button').addClass('small green');
        $but.find('.label').html(_t('take_rewards_now'));
        $wrapper.append($but);
        $but.click(function() {
            if ($(this).hasClass('black')) return;

            var url = 'match&a=season&reward_season=1';
            url += chooseOutfit ? '&outfit_idx=' + chooseOutfit : '';

            _g(url, function(data) {
                if (isset(data.item)) {
                    self.wnd.$.find('.show-reward-season-item').css('display', 'none');
                    self.showMatchmakingMenu();
                    endSeazonRewardsExist = false;
                }
            });
        });
    };

    this.outfitWrapperWithCheckbox = function(patch, kind) {
        var $outfitCheckWrapper = $('<div>').addClass('outfit-check-wrapper ' + kind);
        var $outfitWrapper = $('<div>').addClass('outfit-wrapper');
        var $checkbox = tpl.get('one-checkbox');
        var $txt = $('<div>').html(_t(kind)).addClass('label');
        $outfitCheckWrapper.append($checkbox);
        $outfitCheckWrapper.append($outfitWrapper);
        $checkbox.click(function() {
            self.wnd.$.find('.season-reward-main').find('.black').removeClass('black');
            chooseOutfit = self.getOutfitIndex(kind);
            if ($(this).hasClass('active')) return;

            $(this).parent().parent().find('.active').removeClass('active');
            $(this).parent().find('.outfit-wrapper').addClass('active');
            $(this).parent().find('.checkbox').addClass('active');
        });
        $outfitWrapper.click(function() {
            self.wnd.$.find('.season-reward-main').find('.black').removeClass('black');
            chooseOutfit = self.getOutfitIndex(kind);
            if ($(this).hasClass('active')) return;

            $(this).parent().parent().find('.active').removeClass('active');
            $(this).parent().find('.outfit-wrapper').addClass('active');
            $(this).parent().find('.checkbox').addClass('active');
        });
        $outfitWrapper.append(self.getOutfit(patch));
        $outfitWrapper.append($txt);

        return $outfitCheckWrapper;
    };

    this.outfitWrapperWithCheckbox2 = function(patch, kind) {

        var test = tpl.get('outfit-check-wrapper');

        //var $outfitCheckWrapper = $('<div>').addClass('outfit-check-wrapper ' + kind);
        var $outfitCheckWrapper = tpl.get('outfit-check-wrapper').addClass(kind);
        //var $outfitWrapper = $('<div>').addClass('outfit-wrapper');
        var $outfitWrapper = $outfitCheckWrapper.find('.outfit-wrapper');
        //var $checkbox = tpl.get('one-checkbox');
        //var $txt = $('<div>').html(_t(kind)).addClass('label');
        $outfitCheckWrapper.find('.text-label').html(_t(kind));
        var $checkbox = $outfitCheckWrapper.find('.one-checkbox');
        //$outfitCheckWrapper.append($checkbox);
        //$outfitCheckWrapper.append($outfitWrapper);
        $checkbox.click(function() {
            self.wnd.$.find('.season-reward-main').find('.black').removeClass('black');
            chooseOutfit = self.getOutfitIndex(kind);
            if ($(this).hasClass('active')) return;

            $(this).parent().parent().find('.active').removeClass('active');
            $(this).parent().find('.outfit-wrapper').addClass('active');
            $(this).parent().find('.checkbox').addClass('active');
        });
        $outfitWrapper.click(function() {
            self.wnd.$.find('.season-reward-main').find('.black').removeClass('black');
            chooseOutfit = self.getOutfitIndex(kind);
            if ($(this).hasClass('active')) return;

            $(this).parent().parent().find('.active').removeClass('active');
            $(this).parent().find('.outfit-wrapper').addClass('active');
            $(this).parent().find('.checkbox').addClass('active');
        });
        $outfitWrapper.append(self.getOutfit(patch));
        //$outfitWrapper.append($txt);

        return $outfitCheckWrapper;
    };

    this.getOutfitIndex = function(kind) {
        switch (kind) {
            case 'woman':
                return 1;
            case 'man':
                return 2;
        }
    };

    this.createRecords = function(ob, addClass) {
        var $tr = $('<tr>');
        for (var i = 0; i < ob.length; i++) {
            var $td = $('<td>').html(ob[i]);
            if (typeof addClass == 'object') {
                $td.addClass(addClass[i]);
            } else {
                $td.addClass(addClass);
            }
            $tr.append($td);
        }
        return $tr;
    };

    const getAllRewards = () => {
        _g('match&a=collect');
    }

    const getAllBtnSetState = () => {
        const getAllBtn = self.wnd.$.find('.progress-bottom-panel .get-all .button');
        !rewardsToGet ? getAllBtn.addClass('disable') : getAllBtn.removeClass('disable');
    }

    this.tLang = function(name) {
        return _t(name, null, 'matchmaking');
    };

    this.getEqChooseOpen = () => {
        return eqPanelOpen;
    }

    //this.init();
};