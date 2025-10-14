var tpl = require('@core/Templates');
//var Interface = require('@core/Interface');
//var HeroEquipment = require('@core/items/HeroEquipment');

module.exports = function() {
    var content;
    var self = this;
    var hugeRewardTpl;
    var bigRewardTpl;
    var smallRewardTpl;

    this.init = function() {
        this.initWindow();
        this.initNextFightButton();
        this.initCloseButton();
        this.setShow(false);
        this.initFetch();
    };

    this.initFetch = function() {
        //Engine.tpls.fetch('d', self.newBattleSummaryItem);
        Engine.tpls.fetch(Engine.itemsFetchData.NEW_BATTLE_SUMMARY_TPL, self.newBattleSummaryItem);
    };

    this.initWindow = function() {
        content = tpl.get('matchmaking-summary');

        Engine.windowManager.add({
            content: content,
            //nameWindow        : 'matchmaking-summary',
            nameWindow: Engine.windowsData.name.MATCHMAKING_SUMMARY,
            nameRefInParent: 'wnd',
            objParent: this,
            title: _t('battle_summary', null, 'battle'),
            onclose: () => {
                self.setShow(false);
            }
        });
        this.wnd.addToAlertLayer();
    };

    //this.canPreviewStatMenu = function (stats, i, m) {
    //	m.push([_t('canpreview'), function () {
    //		_g('moveitem&st=2&tpl=' + i.id);
    //		Engine.tpls.deleteMessItemsByLoc('p');
    //		Engine.tpls.deleteMessItemsByLoc('s');
    //	}]);
    //};

    //this.canTakeItem = function ($wrapper, m) {
    //	var reward_stage = $wrapper.attr('reward_stage');
    //	if (reward_stage != null) {
    //		var idX = $wrapper.attr('reward_idx');
    //		m.push([self.tLang('take_reward'), function () {
    //			_g('match&a=summary&reward_stage=' + reward_stage + '&reward_idx=' + idX);
    //		}]);
    //	}
    //};

    this.newBattleSummaryItem = function(item) {
        var slots = self.wnd.$.find('.progress-tpl-slot-id-' + item.id);

        slots.each(function() {
            //var $clone = item.$.clone();
            //let $clone = Engine.tpls.createViewIcon(item.id, 'mm-battle-summary', 'd')[0];
            let $clone = Engine.tpls.createViewIcon(item.id, Engine.itemsViewData.MM_BATTLE_SUMMARY_VIEW, 'd')[0];
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

            //$clone.click(function () {
            //	self.createMenuToItem(item._cachedStats, item, $(this).parent(), {
            //		clientX: $clone.offset().left,
            //		clientY: $clone.offset().top
            //	});
            //});
        });
    };

    //this.createMenuToItem = function (stats, data, $wrapper, e) {
    //	var m = [];
    //	if (isset(stats.canpreview)) self.canPreviewStatMenu(stats, data, m);
    //	if ($wrapper) self.canTakeItem($wrapper, m);
    //
    //	if (m.length == 0) return;
    //	Interface.showPopupMenu(m, e);
    //};

    this.canTakeItem2 = function($wrapper) {
        var reward_stage = $wrapper.attr('reward_stage');
        if (reward_stage != null) {
            var idX = $wrapper.attr('reward_idx');
            var o = {
                txt: self.tLang('take_reward'),
                f: function() {
                    _g('match&a=summary&reward_stage=' + reward_stage + '&reward_idx=' + idX);
                }
            };
            return o;
        }
        return false;
    };

    this.initCloseButton = function() {
        var $close = tpl.get('button').addClass('green small');
        self.wnd.$.find('.close-wrapper').append($close);
        $close.find('.label').html(_t('close'));
        $close.click(function() {
            self.setShow(false);
        });
    };

    this.initNextFightButton = function() {
        var $nextFight = tpl.get('button').addClass('green small');
        self.wnd.$.find('.close-wrapper').append($nextFight);
        $nextFight.find('.label').html(_t('next_fight'));
        $nextFight.click(function() {
            self.setShow(false);
            _g('fight&a=nextmatch');
        });
    };

    this.setShow = function(state) {
        self.wnd.$.css('display', state ? 'block' : 'none');
    };

    this.updateSummary = function(v) {
        this.createRewardItems(v);
        var data = {
            result: self.getResult(v.result),
            name: Engine.hero.d.nick,
            lvl: getHeroLevel(),
            operationLevel: getEngine().hero.getOperationLevel(),
            prof: Engine.hero.d.prof,
            pr: v.rating,
            icon: Engine.hero.d.img

        };
        var data2 = {
            result: self.getResult(v.result, true),
            name: self.tLang('opponent'),
            lvl: v.opponent_lvl,
            operationLevel: v.opponent_oplvl,
            prof: v.opponent_prof,
            pr: v.opponent_rating,
            icon: v.opponent_icon

        };
        self.updateGreenHeader(data.result);

        self.updateOutfit('your', data);
        self.updateOutfit('enemy', data2);
        self.updateStars(v.difficulty_rank);
        self.updateClassificationMatch(v.placement_cur, v.placement_max);
        self.setArrow(data.result);
        self.setChangePr(data.result, v.rating_delta);
        self.setProgressPoints(v.points_gained);
        var r = v.daily_stage;
        self.setMachmakingProgressStage(r.id, r.points_cur, r.points_max, r.rewards_max, r.rewards_cur, r.rewards_last);
    };

    this.updateStars = function(amount) {
        self.wnd.$.find('.difficult-stars-val').find('.text').html(_t('fight_dificult'));
        var starWrapper = self.wnd.$.find('.difficult-stars-val').find('.stars-wrapper');
        starWrapper.empty();
        for (var i = 1; i < 11; i += 2) {
            //var $star = $('<div>').addClass('star');
            var $star = tpl.get('star-matchmaking');
            if (i < amount + 1) {

                if (i == amount && i % 2) $star.addClass('half-star');

            } else $star.addClass('empty-star');

            starWrapper.append($star);
        }
    };

    this.updateClassificationMatch = function(min, max) {
        if (min >= max) {
            self.wnd.$.find('.classification-match').css('display', 'none');
            return;
        }
        self.wnd.$.find('.classification-match-val').html(_t('classification_match') + ' ' + min + '/' + max);
    };

    this.getResult = function(result, invert) {
        var cl;
        switch (result) {
            case 1:
                if (invert) cl = 'win';
                else cl = 'lose';
                break;
            case 0:
                if (invert) cl = 'lose';
                else cl = 'win';
                break;
            case 2:
                cl = 'draw';
                break;
        }
        return cl;
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
        var $progressStage = tpl.get('matchmaking-progress-stage');
        var barW = 252;
        var first = [true];

        self.wnd.$.find('.current-stage').empty().append($progressStage);
        self.setTokenAmounts();

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
            $itemsChestSlot.attr('reward_stage', index);
            $itemsChestSlot.attr('reward_idx', (i - 1));
        }
        $border.addClass(cl);
        $itemsChestSlot.addClass(cl2);
        $itemsChestSlot.addClass('progress-tpl-slot-id-' + idTpl);
    };

    this.setProgressPoints = function(points) {
        self.wnd.$.find('.progress-points-val').html(_t('got_points', {
            '%val%': points
        }, 'matchmaking'));
    };

    this.setTokenAmounts = function() {};

    this.setChangePr = function(result, pr) {
        self.wnd.$.find('.pr-change').html(pr + ' PR').removeClass('win lose').addClass(result); //rating_delta
    };

    this.setArrow = function(result) {
        self.wnd.$.find('.arrow').removeClass('win lose').addClass(result);
    };

    this.updateGreenHeader = function(result) {
        // var str = '';
        // if (result == 'draw') str = 'battle_banner_none_header';
        // else str = result == 'win' ? 'battle_banner_win_header' : 'battle_banner_lose_header';
        // self.wnd.$.find('.edit-header-label').html(_t(str, null, 'battle'));
    };

    this.updateOutfit = function(side, data) {
        var $wrapper = self.wnd.$.find('.' + side + '-side');
        var url = CFG.a_opath + data.icon;

        let characterData = {
            //showNick 		: true,
            //nick 			: data.name,
            level: data.lvl,
            operationLevel: data.operationLevel,
            prof: data.prof,
            htmlElement: true
        };

        let characterInfo = getCharacterInfo(characterData);


        $wrapper.find('.' + side + '-result').html(_t(data.result + '_p', null, 'matchmaking')).removeClass('win lose').addClass(data.result);
        //$wrapper.find('.' + side + '-name-and-level').html(data.name + ' (' + data.lvl + data.prof + ')');
        //$wrapper.find('.' + side + '-name').html(data.name);
        cutTextAndAddTip($wrapper.find('.' + side + '-name'), data.name, 1);
        $wrapper.find('.' + side + '-level-and-prof').html(characterInfo);
        $wrapper.find('.' + side + '-pr').html(data.pr + ' PR').removeClass('win lose').addClass(data.result);

        const $outfitWrapper = self.wnd.$.find('.' + side + '-outfit-wrapper').find('.out-icon');
        createImgStyle($outfitWrapper, url)
    };

    this.tLang = function(name) {
        return _t(name, null, 'matchmaking');
    };

    //this.init();
};