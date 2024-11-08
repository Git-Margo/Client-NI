let BattlePassData = require('core/battlePass/BattlePassData.js');
let Templates = require('../Templates');

module.exports = function() {

    let showCard = 0;
    let wnd = null;
    let content = null;
    let timeInterval = null;

    let event = null;
    let levels = null;
    let missions = null;
    let profile = null;

    let items = {};

    let KIND = {
        PREMIUM: 'premium',
        STANDARD: 'standard'
    }

    const init = () => {
        initWindow();
        initCards();
        initRollMissionButton();
        initFetch();
        initScrollBar();
    };

    const initFetch = () => {
        Engine.tpls.fetch(Engine.itemsFetchData.NEW_BATTLE_PASS_TPL, createBattlePassItem);
    };

    const createBattlePassItem = (data, finish) => {
        items[data.id] = data;

        if (finish) updateIconItems();
    };

    const updateIconItems = () => {

        for (let k in items) {
            let data = items[k];

            setItemsInSlots(data);
        }
    };

    const setItemsInSlots = (data) => {
        let id = data.id;

        content.find('.reward-item-tpl-' + id).each(function() {
            let $clone = Engine.tpls.createViewIcon(id, Engine.itemsViewData.BATTLE_PASS_ITEM_VIEW, 'B')[0];
            let quantity = parseInt($(this).attr('quantity'));

            Engine.tpls.changeItemAmount(data, $clone, quantity);
            $clone.attr('data-tip-type', data.$.data('tipType'));
            $clone.attr('data-item-type', data.$.data('itemType'));
            $clone.data('item', data);

            $(this).append($clone)
        });
    };

    const initWindow = () => {
        content = Templates.get('battle-pass-window');
        //content.addClass('barter-content');

        wnd = Engine.windowManager.add({
            content: content,
            title: _t('path_of_hero'),
            nameWindow: Engine.windowsData.name.BATTLE_PASS,
            onclose: () => {
                close();
            }
        });

        wnd.addToAlertLayer();
        wnd.center();
    };

    const initRollMissionButton = () => {
        let $rollMissuibIcon = content.find('.roll-mission-icon');
        $rollMissuibIcon.click(function() {
            confirmWithCallback({
                msg: _t('roll_mission', {
                    '%cost%': 25
                }),
                clb: function() {
                    _g('battlepass&action=reroll');
                }
            });
        });
    };

    const initCards = () => {
        let con = content.find('.cards-header');
        let str1 = _t('battle_pass_chalanges') //'Wyzwania';
        let str2 = _t('battle_pass_rewards') //'Nagrody';

        newCard(con, str1, function() {});
        newCard(con, str2, function() {});

        setFirstCard();
    };

    const updateData = (v) => {
        console.log(v);
        refreshData(v);

        manageTimes();
        manageBanner();
        manageButton();

        createChalengesSection();
        createRewardsSection();

        manageYourPoints();
    };

    const manageTimes = () => {

        if (timeInterval) {
            clearInterval(timeInterval);
            timeInterval = null;
        }

        //console.log('start_time and end_time');
        //console.log(event.start_time, event.end_time)
        //console.log(getSecondLeft(event.end_time - event.start_time))

        setDailyTimeInHtml();
        setGlobalTimeInHtml();

        timeInterval = setInterval(function() {
            setDailyTimeInHtml();
            setGlobalTimeInHtml();
        }, 1000)

    };

    const setDailyTimeInHtml = () => {
        content.find('.daily-mission').find('.tiles-wrapper-header-time').html(getFormatedTime(event.time_daily_missions_end, {
            h: true,
            m: true,
            s: true
        }));
    };

    const setGlobalTimeInHtml = () => {
        content.find('.global-mission').find('.tiles-wrapper-header-time').html(getFormatedTime(event.activity_end_time, {
            d: true,
            h: true,
            m: true
        }));
    };

    const getFormatedTime = (time, opt) => {
        return getSecondLeft(time - Math.round(ts() / 1000), opt);
    };

    const manageBanner = () => {

        let bannerClass = null;
        let iconClass = null;

        switch (profile.access) {
            case 1:
                bannerClass = 'free-banner';
                iconClass = 'free-icon';
                break;
            case 2:
                bannerClass = 'premium-banner';
                iconClass = 'premium-icon';
                break;

            default:
                errorReport('BattlePass.js', "manageBanner", "unregistered access value", profile.access)
        }

        content.find('.battle-pass-icon-wrapper').find('.battle-pass-icon').removeClass('premium-icon free-icon').addClass(iconClass)
        content.find('.battle-pass-banner-graphic').removeClass('premium-banner free-banner').addClass(bannerClass)
        content.find('.battle-pass-banner-icon').removeClass('premium-banner free-banner').addClass(bannerClass)
    };

    const manageYourPoints = () => {
        content.find('.your-all-points-wrapper').find('.points').html(_t('sum_points') + ' ' + profile.points);
    };

    const manageButton = () => {
        let $buttonsWrapper = content.find('.battle-pass-buttons');
        $buttonsWrapper.empty();

        if (profile.access != 1) return;

        let $button = createButton('Aktywuj', ['small', 'green', 'active-battle-pass-button'], function() {
            confirmWithCallback({
                msg: _t('active_battle_pass', {
                    '%cost%': 250
                }),
                clb: function() {
                    _g("battlepass&action=buy_premium")
                }
            });
        });

        $buttonsWrapper.append($button)
    };

    const refreshData = (v) => {
        event = v.status.event;
        levels = v.status.levels;
        missions = v.status.missions;
        profile = v.status.profile;

        // missions.global[0].stages.push({
        // 	id: 9999,
        // 	max_progress: 1000,
        // 	reward: 1000,
        // })
        // profile.mission_progress.push({
        // 	finished: false,
        // 	id: 9999,
        // 	progress: 5
        // })
        //
        // missions.global[0].stages.push({
        // 	id: 8888,
        // 	max_progress: 2200,
        // 	reward: 1000,
        // })
        // profile.mission_progress.push({
        // 	finished: false,
        // 	id: 8888,
        // 	progress: 450
        // })
    };

    const createRewardsSection = () => {
        let $wrapper = content.find('.battle-pass-rewards').find('.scroll-pane');

        content.find('.battle-pass-reward-record').remove();

        for (let k in levels) {
            createBattlePassRewardRecord(levels[k], k, $wrapper, profile.access)
        }
    };


    const getCollectRewardStatus = (finishId) => {
        for (let k in profile.collected_rewards) {
            let id = profile.collected_rewards[k];
            if (finishId == id) return id
        }

        return false;
    };

    const createBattlePassRewardRecord = (data, level, $wrapper, access) => {
        let $t = Templates.get("battle-pass-reward-record");

        if (data.standard) createOneReward($t, level, data.threshold, data.standard, KIND.STANDARD, 'green', access);

        if (data.premium) createOneReward($t, level, data.threshold, data.premium, KIND.PREMIUM, 'purple', access)

        managePointsProgressBar($t, level, data);

        $wrapper.append($t);
    };

    const isDisable = (kind, access) => {
        return kind == KIND.PREMIUM && access == 1;
    }

    const checkRewardCanTakeTake = (_points, threshold) => {
        return _points >= threshold;
    }

    const checkRewardWasTake = (id) => {
        return profile.collected_rewards.includes(id);
    }

    const createOneReward = ($t, level, threshold, d, kind, color, access) => {

        let tplId = d.tplId;
        let quantity = d.quantity;
        let id = d.id;

        let btnClass = 'take-' + kind + '-reward-button'
        let $itemWrapper = $t.find('.' + kind + '-reward-item-ceil');
        let btnAllClass = ['small', color, btnClass]

        if (isDisable(kind, access)) btnAllClass.push('disable');
        if (checkRewardWasTake(id)) btnAllClass.push('disable');
        if (!checkRewardCanTakeTake(profile.points, threshold)) btnAllClass.push('disable');


        let $button = createButton(_t('take_mail'), btnAllClass, () => {
            _g('battlepass&action=collect_reward&level=' + level + '&type=' + kind);
        });

        $t.find('.' + kind + '-reward-button-ceil').append($button);

        $itemWrapper.addClass('visible');
        createRewardItemWrapper($itemWrapper, id, tplId, quantity, kind, access)
    }

    const managePointsProgressBar = ($t, level, data) => {
        let percent = this.calcPercent(profile.points, level, data.threshold);

        $t.find('.vertical-progress-bar-wrapper').find('.inner').css('height', percent + '%');
        $t.find('.threshold').html(data.threshold)
    }

    this.calcPercent = (_points, level, threshold) => {

        let levelThreshold = threshold / (parseInt(level) + 1);
        let points = _points - parseInt(level) * levelThreshold;

        return points / levelThreshold * 100;
    }

    const createRewardItemWrapper = ($wrapper, id, tplId, quantity, kind, access) => {

        let $slot = $wrapper.find('.reward-item-wrapper');

        $slot.addClass('reward-item-tpl-' + tplId).attr('quantity', quantity)

        if (checkRewardWasTake(id)) $slot.addClass('disable');

        if (!isDisable(kind, access)) return

        let $rewardItemLock = $('<div>').addClass('reward-item-lock');
        let $background = $('<div>').addClass('background');
        let $lock = $('<div>').addClass('lock');

        $rewardItemLock.append($background, $lock)
        $slot.append($rewardItemLock);
    }

    const createChalengesSection = () => {

        let $wrapper1 = content.find('.daily-mission').find('.tiles-wrapper').empty();
        let $wrapper2 = content.find('.global-mission').find('.tiles-wrapper').empty();

        createGroupTiles(missions.daily, $wrapper1);
        createGroupTiles(missions.global, $wrapper2);

        updateScroll();
    };

    const createGroupTiles = (data, $wrapper) => {
        for (let k in data) {
            createTile(data[k], $wrapper);
        }
    };

    const createTile = (missionData, $wrapper) => {
        let $t = Templates.get("battle-pass-mission-tile");

        saveAttrStageInTile($t, 0)
        createTillByStages($t, missionData);

        $wrapper.append($t)
    };

    const saveAttrStageInTile = ($t, stage) => {
        $t.attr('stage', stage);
    }

    const createTillByStages = ($t, missionData) => {

        if (missionData.stages.length > 1) manageTileWithMoreStage($t, missionData);

        showStage($t, missionData, 0);

    };

    const manageTileWithMoreStage = ($t, missionData) => {
        $t.addClass('choose-stages');

        let stages = missionData.stages;

        $t.find('.mission-prev-button').click(function() {
            let stageIndex = parseInt($t.attr('stage'));
            let newStageIndex = getNewStage(stageIndex - 1, stages);

            showStage($t, missionData, newStageIndex);
        });

        $t.find('.mission-next-button').click(function() {
            let stageIndex = parseInt($t.attr('stage'));
            let newStageIndex = getNewStage(stageIndex + 1, stages);

            showStage($t, missionData, newStageIndex);
        })
    };

    const getNewStage = (newStage, stages) => {
        if (newStage < 0) return stages.length - 1;

        if (newStage > stages.length - 1) return 0;

        return newStage;
    };

    const showStage = ($t, missionData, stageIndex) => {
        let $pb = Templates.get("mission-progress-bar");

        let objectiveEnum = missionData.objective;
        let objective = BattlePassData.missionObjectiveByKey[objectiveEnum];
        let stageId = missionData.stages[stageIndex].id;
        let stageMaxProgress = missionData.stages[stageIndex].max_progress;
        let stageReward = missionData.stages[stageIndex].reward;
        let stageProgress = getMissionProgress(stageId);
        let description = _t('battle_pass_' + objectiveEnum + '_' + objective, null, 'battlePassEnum');

        saveAttrStageInTile($t, stageIndex)

        // $t.find('.mission-header').html('HEADER LABEL');
        $t.find('.mission-description').html(description + ': [' + stageMaxProgress + ']');

        $t.find('.mission-reward-label').html('+' + stageReward);
        $t.find('.mission-stage').html(`${stageIndex + 1}/${missionData.stages.length}`);

        fillDataProgressBar($pb, stageProgress, stageMaxProgress);

        $t.find('.place-to-mission-progress-bar').empty().append($pb);
    };

    const fillDataProgressBar = ($pb, stageProgress, stageMaxProgress) => {
        let percent = Math.floor(stageProgress / stageMaxProgress * 100);

        let progressBarText = '';
        if (percent == 100) progressBarText = _t('finish_label');
        else progressBarText = `${stageProgress}/${stageMaxProgress}`;

        $pb.find('.text').html(progressBarText);
        $pb.find('.inner').attr('bar-percent', percent);
    }

    const getMissionProgress = (idStage) => {
        for (let k in profile.mission_progress) {
            if (idStage == profile.mission_progress[k].id) return profile.mission_progress[k].progress;
        }

        return 0;
    };

    const setFirstCard = () => {
        content.find('.section').eq(0).addClass('visible');
        content.find('.card').eq(0).addClass('active');
        updateScroll();
    };

    const newCard = ($par, label, clb) => {
        let $card = Templates.get('card');
        $card.find('.label').html(label);
        $par.append($card);
        $card.click(function() {
            let index = $(this).index();
            setVisible(index);
            updateScroll();
            content.find('.edit-header-label').html(label);
            if (clb) clb();
        });
    };


    const updateScroll = () => {
        $('.scroll-wrapper', content).trigger('update');
    };

    const setVisible = (index) => {
        var $allC = content.find('.card').removeClass('active');
        var $bottomBar = content.find('.bottom-bar');
        var $allS = content.find('.section').removeClass('visible');

        $allC.eq(index).addClass('active');
        $allS.eq(index).addClass('visible');

        $bottomBar.children().css('display', 'none');
        $bottomBar.children().eq(index).css('display', 'block');
        showCard = index;
    };

    const initScrollBar = () => {
        //$('.scroll-wrapper', tpl).addScrollBar({track: true});
        content.find('.battle-pass-challenges>.scroll-wrapper').addScrollBar({
            track: true
        });
        content.find('.battle-pass-rewards>.scroll-wrapper').addScrollBar({
            track: true
        });
    };

    const close = () => {
        wnd.remove();
        Engine.tpls.removeCallback(Engine.itemsFetchData.NEW_BATTLE_PASS_TPL);
        Engine.battlePass = false;
    }

    this.init = init;
    this.updateData = updateData;
    this.updateScroll = updateScroll;

}