/**
 * Created by Michnik on 2015-12-29.
 */
var Tpl = require('core/Templates');
let ProfData = require('core/characters/ProfData');
var Warriors = require('core/battle/Warriors');
var MSG = require('core/battle/BattleMessages');
// var Storage = require('core/Storage');
var StorageFuncBattle = require('core/battle/StorageFuncBattle');
var tpl = require('core/Templates');
var SkillBattleMenu = require('core/battle/SkillBattleMenu');
var ScaleBattle = require('core/battle/ScaleBattle');
var SkillTip = require('core/skills/SkillTip');
var SkillsData = require('core/skills/SkillsData');
let BattleEffectsController = require('core/battle/battleEffects/BattleEffectsController');
const BattleNight = require('core/battle/BattleNight');
var TutorialData = require('core/tutorial/TutorialData');
const ItemData = require('core/items/data/ItemData');
// var TutorialData = require('core/tutorial/TutorialData');
const BattlePredictionHelpWindow = require('core/battle/BattlePredictionHelpWindow');

module.exports = function() {

    var self = this;
    var is_init_fight, teamIDs, start_move, warriorsKind, lastTimeMove; //simple vars
    var $timeProgressBar, $timeProgressBarWrapper, $timeWrapper, $timeSeconds, $battleController, $battleSkills, $addBattleSkills, $battleArea; //$
    var autoFightAfter = false;
    var BattleMessages; //obj
    var battleSkills, flist1, flist2, selectedWarriors; //arrays
    var blockAgainLeave = false;
    var checkTutorial = false;
    var markWarrior = null;
    var addSkillBarVisible = null;
    var canActionAgain = false;
    var yourMove = false;
    var canUseSkill = true;
    var canSendRequest = true;
    var comboPoints = null;
    var yourTurnTimeout = null;
    var intervalMove = null;
    var $predictionScrollbar = null;
    var turnList = null;

    let battlePredictionHelpWindow = null;

    let autoFightWasCallInBattle = null;
    let firstLogsExist = null;
    let disabledSkills = null;
    let isAutoFightForAllAvailable = null;

    let allProperWarriorImageLoaded = null;

    this.zoomMode = false;

    let battleAreaData = {
        width: 0,
        height: 0,
        scale: 0
    }

    let actualStateSize = null;

    let SMALL_SIZE = 'small';
    let NORMAL_SIZE = 'normal';
    let BIG_SIZE = 'big';
    let VERY_BIG_SIZE = 'veryBig'

    let battleControllerSize = [{
            name: SMALL_SIZE,
            height: 82
        },
        {
            name: NORMAL_SIZE,
            height: 200
        },
        {
            name: BIG_SIZE,
            height: 260
        },
        {
            name: VERY_BIG_SIZE,
            height: 340
        },
    ];


    var buffNames = [
        _t('deep_wound', null, 'buff'),
        _t('wound', null, 'buff'),
        _t('critical_deep_wound', null, 'buff'),
        _t('poisoned', null, 'buff'),
        _t('fire', null, 'buff'),
        _t('swow_down', null, 'buff'),
        _t('speed_up', null, 'buff'),
        _t('frostbite', null, 'buff'),
        _t('shock', null, 'buff')
    ];

    var tips = {
        'sw': _t('w_bastard', null, 'battle'),
        '1h': _t('w_onehanded', null, 'battle'),
        '2h': _t('w_twohanded', null, 'battle'),
        'bs': _t('w_bastard', null, 'battle'),
        'dis': _t('w_distance', null, 'battle'),
        'h': _t('w_helper', null, 'battle'),
        'icon-6': _t('w_wand', null, 'battle'),
        'orb': _t('w_rod', null, 'battle'),
        'sh': _t('w_shield', null, 'battle'),
        'fire': _t('w_fire', null, 'battle'),
        'light': _t('w_light', null, 'battle'),
        'frost': _t('w_frost', null, 'battle'),
        'poison': _t('w_poison', null, 'battle'),
        'phydis': _t('w_phydis', null, 'battle'),
        'wound': _t('w_wound', null, 'battle')
    };

    var iconTips = {
        'icon-1': _t('w_onehanded', null, 'eq_w'),
        'icon-2': _t('w_twohanded', null, 'eq_w'),
        'icon-3': _t('w_bastard', null, 'eq_w'),
        'icon-4': _t('w_distance', null, 'eq_w'),
        'icon-5': _t('w_helper', null, 'eq_w'),
        'icon-6': _t('w_wand', null, 'eq_w'),
        'icon-7': _t('w_rod', null, 'eq_w'),
        'icon-14': _t('w_shield', null, 'eq_w'),
        'icon-fire': _t('w_fire', null, 'eq_w'),
        'icon-light': _t('w_light', null, 'eq_w'),
        'icon-frost': _t('w_frost', null, 'eq_w'),
        'icon-poison': _t('w_poison', null, 'eq_w'),
        'icon-phydis': _t('w_phydis', null, 'eq_w'),
        'icon-wound': _t('w_wound', null, 'eq_w'),
        'icon-weapon': _t('w_weapon', null, 'eq_w')
    };

    var maps = {
        '002.jpg': 'm15.jpg',
        '003.jpg': 'm17.jpg',
        '004.jpg': 'm13.jpg',
        '005.jpg': 'm10.jpg',
        '006.jpg': 'm10.jpg',
        '007.jpg': 'm11.jpg',
        '07n.jpg': 'm11.jpg',
        '008.jpg': 'm13.jpg',
        '009.jpg': 'm9.jpg',
        '010.jpg': 'm8.jpg',
        '011.jpg': 'm5.jpg',
        '012.jpg': 'm7.jpg',
        '013.jpg': 'm18.jpg',
        '014.jpg': 'm6.jpg',
        '015.jpg': 'm14.jpg',
        '018.jpg': 'm2.jpg',
        '019.jpg': 'm1.jpg',
        '19n.jpg': 'm1.jpg',
        '021.jpg': 'm5.jpg',
        '027.jpg': 'm4.jpg',
        '27n.jpg': 'm17.jpg',
        '032.jpg': 'm3.jpg',
        '033.jpg': 'm2.jpg',
        '034.jpg': 'm1.jpg',
        '035.jpg': 'm11.jpg',
        '35n.jpg': 'm11.jpg',
        'aa1.jpg': 'm16.jpg',
        'aa2.jpg': 'm16.jpg',
        'bb.jpg': 'm16.jpg',
        'cc1.jpg': 'm14.jpg',
        'cc2.jpg': 'm14.jpg',
        'dd1.jpg': 'm12.jpg',
        'dd2.jpg': 'm16.jpg',
        'dd3.jpg': 'm16.jpg',
        'dd4.jpg': 'm18.jpg',
        'j.jpg': 'm15.jpg',
        'ee.jpg': 'm15.jpg',
        'f.jpg': 'm15.jpg',
        'g.jpg': 'm15.jpg',
        'h.jpg': 'm15.jpg',
        'i.jpg': 'm12.jpg',
        'k.jpg': 'm15.jpg',
        'l.jpg': 'm15.jpg',
        'matchmaking.jpg': 'matchmaking.jpg',
        '36.jpg': 'm24.jpg',
        '37.jpg': 'm26.jpg'
    };

    this.getfirstLogsExist = () => {
        return firstLogsExist
    };

    this.getIconTips = () => {
        return iconTips;
    }

    this.isOneStepId = (id) => {
        return id == SkillsData.specificSkills.ONE_STEP_ID;
    }

    this.isNormalAttackId = (id) => {
        return id == SkillsData.specificSkills.NORMAL_ATTACK_ID;
    }

    this.changeIconRegToTextReg = (text) => {
        let iconTips = this.getIconTips()
        for (let k in iconTips) {
            if (text.search('"' + k + '"') > -1) return '<span class="weapon-require">' + iconTips[k] + '</span>'
            // if (text.search(k) > -1) return '<span class="weapon-require">' + iconTips[k] + '</span>'
        }

        return text
    }

    this.initVariable = function() {
        is_init_fight = false;
        canActionAgain = true;
        teamIDs = {
            1: [],
            2: []
        };
        start_move = null;
        battleSkills = [];
        disabledSkills = null;
        selectedWarriors = [];
        warriorsKind = 2;
        flist1 = [];
        flist2 = [];
        this.takenQueue = {};
        this.warriorsList = {};
        this.forumLog = [];
        this.w_amount = 0;
        this.isAuto = false;
        this.myteam = null;
        this.endBattle = false;
        this.endBattleForMe = false;
        this.canLeaveBattle = false;
        this.selectedWarriorID = null;
        this.showedSkills = null;
        this.heroMana = null;
        this.heroEnergy = null;
        this.show = false;

        setAllProperWarriorImageLoaded(true);
    };

    this.init = function() {
        this.initVariable();
        this.initBattleWindow();
        this.initBattleController();
        this.initObjects();
        this.setPredictionScrollbar();
        //this.setTutorial();

        if (!this.zoomMode) $battleArea.css('transform', 'translateX(-50%)');

        battlePredictionHelpWindow = new BattlePredictionHelpWindow();
        battlePredictionHelpWindow.init();

        turnList = $battleController[0].querySelector('.turn-prediction');
    };

    this.getFlist1 = () => {
        return flist1;
    };

    this.getFlist2 = () => {
        return flist2;
    };

    this.getTeamIDs = () => {
        return teamIDs;
    };

    this.initProgressBars = function() {
        var $parent = $battleController.find('.stats-wrapper');
        this.createProgressBar($parent, 'hp-progress-bar red');
        this.createProgressBar($parent, 'ep-progress-bar yellow');
        this.createProgressBar($parent, 'mp-progress-bar blue');
    };

    this.initObjects = function() {
        this.skillBattleMenu = new SkillBattleMenu();
        this.warriors = new Warriors();
        this.scaleBattle = new ScaleBattle();
        this.battleEffectsController = new BattleEffectsController();
        this.battleEffectsController.init();
        this.battleNight = new BattleNight();
        this.battleNight.init();
        this.warriors.init();

        BattleMessages = new MSG();
        BattleMessages.init();
    };

    this.addAttackToBattleSkills = (hotSlot) => {
        battleSkills[SkillsData.specificSkills.NORMAL_ATTACK_ID] = {
            id: SkillsData.specificSkills.NORMAL_ATTACK_ID,
            name: _t('normal_atack', null, 'skills'),
            attr: '',
            cost: '-',
            require: '',
            regs: '',
            lvl: '1/1',
            // stats: 'norm-atack=1',
            kind: '',
            hotSlot: hotSlot,
            currentStatsIndex: 0,
            allStats: ['norm-atack=1']
        }
    }

    this.addOneStepToBattleSkills = (hotSlot) => {
        battleSkills[SkillsData.specificSkills.ONE_STEP_ID] = {
            id: SkillsData.specificSkills.ONE_STEP_ID,
            name: _t('step', null, 'skills'),
            attr: '',
            cost: '-',
            require: '',
            regs: '',
            lvl: '1/1',
            // stats: 'step=1',
            kind: '',
            hotSlot: hotSlot,
            currentStatsIndex: 0,
            allStats: ['step=1'],
        }
    }

    this.getBattleMessageShow = () => {
        return BattleMessages.getShow();
    }

    this.update = (data) => {

        let notCloseNow = !isset(data.close);

        if (isset(data.init)) {
            isAutoFightForAllAvailable = null;
            self.setDateTime();
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 5);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 5);
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 15);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 15);
            this.closeOtherWindows();
        }
        if (isset(data.is_auto_fight_for_all_available) && data.is_auto_fight_for_all_available) {
            isAutoFightForAllAvailable = data.is_auto_fight_for_all_available;
        }
        if (data.skills_disabled) self.setSkillsDisabled(data.skills_disabled)
        if (isset(data.myteam)) self.myteam = data.myteam;

        if (isset(data.start_move)) {
            start_move = data.start_move;

            if (start_move < 15 && notCloseNow) { // OMG...
                Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 7);
                //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 7);
            }

        }

        if (isset(data.move)) {
            if (data.move < 0) {
                self.setEndBattleForMe();

                if (notCloseNow) {
                    Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 8);
                    //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 8);
                }

            } else {
                self.setIntervalMove(data.move);
            }
        }
        if (isset(data.endBattle) && data.endBattle) {
            this.setEndBattle();
        }
        if (isset(data.skills)) {
            var hotSlot = -1;
            battleSkills = [];
            addSkillBarVisible = false;

            for (var i = 0; i < data.skills.length; i += 10) {
                var parseId = parseInt(data.skills[i]);
                hotSlot++;
                if (parseId == 0) continue;
                if (hotSlot > 7) addSkillBarVisible = true;

                // if (parseId == SkillsData.specificSkills.NORMAL_ATTACK_ID) {
                if (self.isNormalAttackId(parseId)) {
                    self.addAttackToBattleSkills(hotSlot);
                    continue;
                }
                // if (parseId == SkillsData.specificSkills.ONE_STEP_ID) {
                if (self.isOneStepId(parseId)) {
                    self.addOneStepToBattleSkills(hotSlot);
                    continue;
                }

                battleSkills[parseId] = {
                    id: parseId,
                    name: data.skills[i + 1],
                    attr: data.skills[i + 2],
                    cost: self.getFormCost(data.skills[i + 8]),
                    require: self.getRequire(data.skills[i + 1], data.skills[i + 6]),
                    regs: data.skills[i + 6],
                    lvl: data.skills[i + 7],
                    stats: data.skills[i + 8],
                    kind: data.skills[i + 9],
                    hotSlot: hotSlot,
                    currentStatsIndex: 0,
                    allStats: [data.skills[i + 8]],
                };
            }
            //$battleController.css('bottom', (addSkillBarVisible ? 60 : 45) + 'px');
            addSkillBarVisible ? $battleController.addClass('with-skills') : $battleController.removeClass('with-skills');
            //$battleController.find('.skill-hider').css('display', addSkillBarVisible ? 'none' : 'block');
            self.showSkills();
            //self.setWatchPosition();
            self.setButtonsClass();
            updateAutofightCancelBtn();
        }
        if (isset(data.w)) {
            self.updateWarriors(data.w);
            self.updateAutoButton();
            self.updateCanLeaveBattle();
        }
        self.setSurrenderButtonVisible();
        if (isset(data.current)) self.setCurrent(data.current);
        if (isset(data.battleground)) self.updateBattleground(data.battleground);
        if (isset(data.skills_combo_max)) self.updatecomboSkillsMax(data.skills_combo_max);

        if (isset(data.m)) {
            firstLogsExist = true;
            self.newTurn(data.current);
            this.takenQueue = {};
            if (isset(data.init) && data.init == '1') {
                let flist1Join = this.joinStrFromObjects(flist1, 'str', ', ');
                let flist2Join = this.joinStrFromObjects(flist2, 'str', ', ');
                BattleMessages.reload(flist1Join, flist2Join);
            }
            //self.battleEffectsController.updateFromBattleMessage(data.m)
            for (var i in data.m) {
                BattleMessages.battleMsg(data.m[i], !is_init_fight, data.m, i);
            }
            self.onResize();
            if (self.selectedWarriorID) self.infoUpdate();
        }
        if (isset(data.turns_warriors)) {
            self.turnPredictionUpdateAnimation(data.turns_warriors);
        }
        if (isset(data.close)) {
            self.close(data);
            return;
        }


        if (data.init) {
            let allLoaded = self.warriors.checkAllWarriorsProperWarriorImageLoaded();
            setAllProperWarriorImageLoaded(allLoaded);
        }

        if (isset(data.w) && data.init != "1") {
            Engine.battle.battleNight.rebuildBattleNight();
        }

        Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 6, data);
        //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 6, data);
    };

    this.getFormCost = (require) => {
        if (require == '') return '';

        let requireArray = require.split(';')
        let requireObj = {};

        for (let k in requireArray) {
            let keyValuePair = requireArray[k].split('=');
            requireObj[keyValuePair[0]] = keyValuePair[1];
        }

        if (isset(requireObj.energy)) return requireObj.energy.replace(/\*c?plvl/, '') + 'e';
        if (isset(requireObj.mana)) return requireObj.mana.replace(/\*c?plvl/, '') + 'm';

        return '';
    }

    this.setButtonsClass = () => {
        const $buttons = $('.buttons-wrapper .button');
        if (addSkillBarVisible) {
            $buttons.addClass('square');
        } else {
            $buttons.removeClass('square');
        }
    };

    this.setSkillsDisabled = (_disabledSkills) => {
        disabledSkills = _disabledSkills;
    };

    this.checkDisabled = (id) => {
        return disabledSkills.includes(parseInt(id));
    }

    this.getRequire = (skillName, require) => {
        // debugger;
        // console.log(require)
        // return '';

        if (require == '') return require;

        let requireArray = require.split(';');
        let reqwValue;

        for (let k in requireArray) {
            let nameAndValStr = requireArray[k];
            let d = nameAndValStr.split('=');
            if (d[0] == 'reqw') {
                reqwValue = d[1];
                break
            }
        }

        if (!reqwValue) return '';

        // console.log(skillName, reqwValue);

        return reqwValue;
    }

    this.turnPredictionUpdateAnimation = (turns_warriors) => {
        $(turnList).animate({
            opacity: 0
        }, 'fast', function() {
            self.updateTurnPredictions(turns_warriors);
            $(this).animate({
                opacity: 1
            }, 'fast');
        });
    };

    this.updateTurnPredictions = (turns) => {
        turnList.innerHTML = ''; //clear list
        battlePredictionHelpWindow.clear();
        for (let i in turns) {
            const
                id = turns[i],
                turnItem = tpl.get('turn-prediction__item')[0],
                turnItemName = turnItem.querySelector('.turn-prediction__name'),
                turnItemAv = turnItem.querySelector('.turn-prediction__av'),
                warriorType = this.getWarriorType(id), // type : 1-self, 2-friend, 3-enemy
                warrior = self.warriorsList[id];

            if (!warriorType) return;

            switch (warriorType) {
                case 1:
                    turnItemName.classList.add('turn-prediction__name--green');
                    break;
                case 2:
                    turnItemName.classList.add('turn-prediction__name--blue');
                    break;
                case 3:
                    turnItemName.classList.add('turn-prediction__name--red');
                    break;
            }
            turnItemName.innerHTML = parseContentBB(warrior.name);
            this.createAvatar(turnItemAv, warrior.icon, warrior.npc);
            battlePredictionHelpWindow.appendWarrior(turnItem, warrior.icon, warrior.npc);
            turnList.append(turnItem);
        }
        $predictionScrollbar.trigger('update');
        battlePredictionHelpWindow.updateScrollbar();
    };

    this.setPredictionScrollbar = () => {
        $predictionScrollbar = $battleController.find('.right-column .scroll-wrapper');
        $predictionScrollbar.addScrollBar({
            track: true
        });
    };

    this.createAvatar = (turnItemAv, avatarImg, isNpc) => {
        const
            path = isNpc ? CFG.a_npath : CFG.a_opath,
            bgSize = isNpc ? 'cover' : '400% 400%';
        createImgStyle($(turnItemAv), path + avatarImg, {
            'height': '28px',
            'width': '32px',
            'sprite': !isNpc
        }, {
            'background-size': bgSize
        }, 32);
    };

    this.getWarriorType = (id) => {
        const hId = Engine.hero.d.id;
        if (!isset(self.warriorsList[hId])) return false;
        const
            heroData = self.warriorsList[hId],
            warriorData = self.warriorsList[id];

        let type = 2; // type : 1-self, 2-friend, 3-enemy
        if (hId == id) type = 1;
        else if (warriorData.team != heroData.team) type = 3;

        return type;
    };

    this.getWarrior = (id) => {
        return this.warriorsList[id];
    };

    this.updateAutoButton = function() {
        const showAuto = this.isAutoFightActive();
        self.setVisibleAutofight(!showAuto);
        self.setVisibleAutofightCancel(showAuto);
    };

    this.isAutoFightActive = function() {
        const id = Engine.hero.d.id;
        const warriorExist = isset(self.warriorsList[id]);
        return warriorExist && self.warriorsList[id].fast > 0;
    }

    this.updateCanLeaveBattle = function() {
        var old = self.canLeaveBattle;
        var id = Engine.hero.d.id;
        var wExist = isset(self.warriorsList[id]);
        self.canLeaveBattle = wExist && self.warriorsList[id].hpp === 0;
        if (old !== self.canLeaveBattle) {
            self.showPanelActionsButs();
        }
    }

    this.updatecomboSkillsMax = function(data) {
        for (var i = 0; i < data.length; i++) {
            var oneSkill = data[i];
            //var $comboWrapper = $('<div>').addClass('combo-wrapper');
            var $comboWrapper = tpl.get('combo-wrapper');
            var amountPoint = oneSkill[1];

            for (var p = 0; p < amountPoint; p++) {
                //var $p = $('<div>').addClass('combo-point');
                var $p = tpl.get('combo-point');
                var cl = '';
                if (amountPoint == 1) cl = 'all';
                else {
                    if (p == 0) cl = 'left';
                    else {
                        if (p + 1 == amountPoint) cl = 'right';
                        else cl = 'middle';
                    }
                }
                $p.addClass(cl);
                $comboWrapper.append($p);
            }

            //$('.bottom.positioner').find('.icon-' + oneSkill[0]).parent().append($comboWrapper);
            Engine.interface.get$interfaceLayer().find('.bottom.positioner').find('.icon-' + oneSkill[0]).parent().append($comboWrapper);
        }
        self.setComboPointsOnSkill();
    };

    this.getBattleController = function() {
        return $battleController;
    };

    this.getComboPoints = function() {
        return comboPoints;
    };

    this.setComboPoints = function(points) {
        comboPoints = points;
    };

    this.setComboPointsOnSkill = function() {
        var botomSkillComboWrappers = Engine.interface.get$interfaceLayer().find('.bottom.positioner').find('.combo-wrapper');
        var menuComboWrappers = Engine.interface.get$popUpLayer().find('.menu-item').find('.combo-wrapper');
        this.manageComboPoits(botomSkillComboWrappers);
        this.manageComboPoits(menuComboWrappers);
    };

    this.manageComboPoits = function(comboWrappers) {
        comboWrappers.each(function() {
            $(this).find('.combo-point').removeClass('active');
            for (var i = 0; i < comboPoints; i++) {
                $(this).children('').eq(i).addClass('active');
            }
        });
    };

    this.setCurrent = function(id) {
        var current = self.warriorsList[id];
        if (!current) return;

        var $arrowWrapper = current.$.find('.current-arrow');
        if (Engine.party) {
            Engine.party.get$Wnd().find('.blink').removeClass('blink');
            Engine.party.get$Wnd().find('.other-party-id-' + id).find('.border-blink').addClass('blink');
        }

        if ($arrowWrapper.length < 1) {
            var $arrow = tpl.get('current-arrow');
            self.$.find('.current-arrow').remove();
            current.$.append($arrow);
            Engine.imgLoader.onload('/img/emo/battle.gif', false, false, (i) => {
                self.setCanvasArrow(i);
            });
        }
    };

    this.setCanvasArrow = function(img) {
        let $testCanvas = $('<canvas>').attr({
            'width': "16px",
            'height': "16px"
        });
        let ctx = $testCanvas[0].getContext("2d");
        ctx.drawImage(img, 0, 0);

        let dataURL = $testCanvas[0].toDataURL();
        self.$.find('.canvas-arrow').css({
            'background': 'url(' + dataURL + ')',
        });
    };

    this.animateUpAndDown = function($arrow, direction) {
        var nextDir = direction == '-' ? '+' : '-';
        $arrow.animate({
            top: direction + "=6"
        }, 500, function() {
            self.animateUpAndDown($arrow, nextDir);
        });
    };

    this.infoUpdate = function() {
        if (!Object.keys(self.warriorsList).length || !self.selectedWarriorID) return; //quick fight problem (|| !self.selectedWarriorID)
        if (self.warriorsList[self.selectedWarriorID].hpp > 0)
            self.clickCharacter(self.selectedWarriorID, {
                type: 'focus',
                preventDefault: function() {}
            });
    };

    this.updateData = function(data, allData) {
        if (isset(data.close) && !isset(data.init) && !this.isBattleShow()) return; // fix for unnecessary create battle, which has been closed but engine response close battle again

        var firstUpdate = !is_init_fight;
        if (isset(data.auto)) {
            self.isAuto = parseInt(data.auto);
            autoFightAfter = self.isAuto;
            if (autoFightAfter) autoFightWasCallInBattle = true;
        }
        if (firstUpdate) {
            getEngine().buildsManager.getBuildsWindow().closePanel();
            self.hideBattleLog();
            self.showBattlePanel();
            self.setComboPoints(null);
            self.skillBattleMenu.removeAllCooldown();
            if (Engine.hero.markOtherObj) Engine.hero.markOtherObj.deleteRedMark();
        }
        if (!self.show && !self.isAuto) {
            Engine.hero.markOtherObj = null;
            is_init_fight = true;
            self.show = true;

            const initBattle = isset(data.init) && data.init;
            const initLoot = isset(allData.loot) && isset(allData.loot.init);
            const lootIsShow = isset(Engine.loots) && Engine.loots.wnd.isShow();
            if (!(initBattle && initLoot) && lootIsShow) Engine.loots.deleteItemsAndCloseLootWindow();
            // above code solves issue with Loot init & Battle init in same request - e.g. reload or inactive tab
            // below code works only for reload

            //let lootIsShow = isset(Engine.loots) && Engine.loots.wnd.isShow();
            //if (lootIsShow && Engine.allInit) Engine.loots.deleteItemsAndCloseLootWindow();
            // if loot exist and go to another battle, item move to inventory automatically and close loot window
            // using allInit to prevent auto-close loot window if it's active and the user refreshes the page (on init4) or we are dead (reload from engine).
        }
        if (isset(data.init) && data.init) self.callCheckCanFinishExternalTutorialStartBattle();
        self.update(data);
        if (firstUpdate) {

            autoFightWasCallInBattle = false;
            if (autoFightAfter) autoFightWasCallInBattle = true;

            canUseSkill = true;
            canSendRequest = true;
            updateBattleAreaPosition();
            self.battleNight.rebuildBattleNight();
            self.clearMarkWarior();
            self.setFirstMarkObj();
            self.newTurn(data.current);
            self.showPanelActionsButs();
            $predictionScrollbar.trigger('scrollTop');
            if (data.auto == "1") self.callCheckCanFinishExternalTutorialHeroEndBattle();
        }
    };

    this.setWatchPosition = function() {
        // var watch = $battleController.find('.battle-watch');
        // watch.removeClass('middle right');
        // if (addSkillBarVisible) watch.addClass('middle');
        // else watch.addClass('right');
    };

    //this.setTutorial = function () {
    //	if (checkTutorial) return;
    //	checkTutorial = true;
    //	var store = Storage.get('tutorial/firstfight');
    //	if (!store) return;
    //	tutorialStart(23, 'firstfight');
    //};

    this.updateBattleground = function(path) {
        let $battleBackground = self.$.find('.battle-background');
        var file = maps[path] ? maps[path] : path.replace(/si/g, 'ni');
        var url = CFG.a_bpath + file;
        if (file == 'matchmaking.jpg') url = 'img/bg-match/matchmaking.jpg';
        //if (self.zoomMode) {
        //	$battleBackground.css('transform', 'translate(-50%,-50%) scale(2.0)');
        //} else {
        $battleBackground.css('transform', 'translate(-50%,-50%) scale(2.0)');
        //}
        //self.$.find('.battle-background').css('background', 'url(' + url + ') 50% 50%');

        Engine.imgLoader.onload(url, null, null, (img) => {
            $battleBackground.css('background', 'url(' + img.src + ')');
            self.onResize();
        });

        //$battleBackground.css('background', 'url(' + url + ')' );
        //self.onResize();
    };

    this.joinStrFromObjects = (obj, attr, seperator) => {
        let a = []
        for (let k in obj) {
            a.push(obj[k][attr])
        }
        return a.join(seperator)
    };

    this.updateWarriors = function(data) {
        if (!teamIDs['1'].length) {
            for (var i in data) {
                teamIDs[data[i].team].push(i);
                //if (data[i].team != 2) flist1.push(data[i].name + '(' + data[i].lvl + data[i].prof + ')');
                //else flist2.push(data[i].name + '(' + data[i].lvl + data[i].prof + ')');

                let o = {
                    id: i,
                    name: data[i].name,
                    lvl: data[i].lvl,
                    prof: data[i].prof,
                    str: data[i].name + '(' + data[i].lvl + data[i].prof + ')'
                };

                if (data[i].team != 2) flist1.push(o);
                else flist2.push(o);
            }

            let flist1Join = this.joinStrFromObjects(flist1, 'str', ', ');
            let flist2Join = this.joinStrFromObjects(flist2, 'str', ', ');

            BattleMessages.open();
            BattleMessages.clear();
            BattleMessages.battleMsg('0;0;txt=' + _t('battle_starts_between %grp1% %grp2%', {
                '%grp1%': flist1Join,
                '%grp2%': flist2Join
            }));
            battlePredictionHelpWindow.show();
        }
        var test = data;
        for (var j in test) {
            if (data.init) self.w_amount++;
            //var warriorData = $.extend(test[j], {id: parseInt(j)});
            test[j].id = parseInt(j);
            var warriorData = test[j];
            self.warriors.update(warriorData, self.isAuto);
        }

        var lines = self.warriors.getLines();
        self.warriors.resetStartSideLines();
        var startSideLines = self.warriors.getStartSideLines();
        for (var y = 0; y < lines.length; y++) {
            var row = lines[y];
            for (var x = 0; x < row.length; x++) {
                var warrior = row[x];
                warrior.sideLeft = x < row.length / 2;
                var alive = self.getAlive(warrior); //warrior.hpp > 0;
                if (warrior.sideLeft) {
                    if (alive) startSideLines[y].firstLeft = x;
                } else {

                    if (startSideLines[y].firstRight == null && alive) startSideLines[y].firstRight = x;

                }
            }
        }
        const dieMob = self.warriors.getDieMob();
        if (dieMob !== false && dieMob == Engine.battle.getMarkObject()) {
            Engine.battle.clearMarkWarior();
            Engine.battle.setFirstMarkObj();
        }
    };

    const setAllProperWarriorImageLoaded = (_allProperWarriorImageLoaded) => {
        allProperWarriorImageLoaded = _allProperWarriorImageLoaded
    };

    this.getAllProperWarriorImageLoaded = () => {
        return allProperWarriorImageLoaded
    };

    this.leaveTimeout = function() {
        if (!blockAgainLeave) self.leaveBattle();
        blockAgainLeave = true;
        setTimeout(function() {
            blockAgainLeave = false;
        }, 2000);
    };

    this.newTurn = function(currentId) {
        yourMove = currentId == Engine.hero.d.id;
        self.clearYourTurnTimeout();
        //self.clearIntervalMove();
        if (!yourMove) return;
        yourTurnTimeout = setTimeout(function() {
            var sm = Engine.soundManager;
            if (!sm.getStateSoundNotifById(7)) sm.createNotifSound(8);
        }, 5000)
    };

    this.clearYourTurnTimeout = function() {
        if (yourTurnTimeout) {
            clearTimeout(yourTurnTimeout);
            yourTurnTimeout = null;
        }
    };

    this.setEndBattleForMe = function() {
        if (!self.endBattleForMe) {
            self.endBattleForMe = true;
            self.canLeaveBattle = true;
            self.clearYourTurnTimeout();
            self.clearIntervalMove();
            //API.callEvent("show_close_battle");
            API.callEvent(Engine.apiData.SHOW_CLOSE_BATTLE);
            if (self.isAuto) return;
            self.$.find('.current-arrow').css('display', 'none');
            self.showPanelActionsButs();
            self.updateMoveTime(0);
            //self.showInterfaceItems();
            if (Engine.party) Engine.party.get$Wnd().find('.blink').removeClass('blink');
            self.callCheckCanFinishExternalTutorialHeroEndBattle();
        }
    };

    this.setEndBattle = () => {
        this.endBattle = true;
    };

    this.clearIntervalMove = () => {
        if (intervalMove != null) {
            clearInterval(intervalMove);
        }
    };

    this.setIntervalMove = (maxTime) => {
        let counter = maxTime;

        self.clearIntervalMove();
        self.updateMoveTime(counter); // first update

        intervalMove = setInterval(() => {
            counter--;
            if (counter === -1) {
                self.clearIntervalMove();
                return;
            }
            self.updateMoveTime(counter); // update by 1 sec
        }, 1000)
    };

    this.updateMoveTime = (time) => {
        const sec = _t('sec', null, 'battle');
        if (self.isAuto) {
            if ($timeProgressBarWrapper.hasClass('too-close')) {
                $timeProgressBarWrapper.removeClass('too-close');
            }
            return false;
        }
        //if (time < 2 && canActionAgain && !self.endBattleForMe) {
        //	this.autoActionAfterTimeOnTurn();
        //	canActionAgain = false;
        //}

        const value = !start_move || time < 0 ? 0 : (time / start_move) * 100;
        if (!isset(time) || time > lastTimeMove) {
            setPercentProgressBar($timeProgressBar, value);
            canActionAgain = true;
        } else {
            setPercentProgressBar($timeProgressBar, value);
        }

        $timeSeconds.html((self.endBattleForMe ? 0 : time) + ' ' + sec);
        if (time <= 5 && !self.endBattleForMe && yourMove && !autoFightAfter) {
            if (!$timeProgressBarWrapper.hasClass('too-close')) {
                $timeProgressBarWrapper.addClass('too-close');
            }
        } else {
            if ($timeProgressBarWrapper.hasClass('too-close')) {
                $timeProgressBarWrapper.removeClass('too-close');
            }
        }
        lastTimeMove = time;
    };

    this.autoActionAfterTimeOnTurn = function() {
        var hId = Engine.hero.d.id;
        if (hId == markWarrior || !isset(self.warriorsList[hId])) return;
        var herdoData = self.warriorsList[hId];
        var warriorData = self.warriorsList[markWarrior];

        var type = 1; // type : 0-self, 1-friend, 2-enemy
        if (warriorData == herdoData) type = 0;
        else if (warriorData.team != herdoData.team) type = 2;
        var isFriend = type == 1;
        if (isFriend) return;

        var heroY = herdoData.y;
        var markWarriorY = warriorData.y;

        var prof = Engine.hero.d.prof;
        // var distanceProf = prof == 't' || prof == 'h';
        // var mage = prof == 'm';

        var distanceProf = prof == ProfData.TRACKER || prof == ProfData.HUNTER;
        var mage = prof == ProfData.MAGE;

        var toofar = !(markWarriorY - heroY < 2);
        var hCanAtack = this.huntersCanAttack(distanceProf, toofar);
        var mCanAtack = this.mageCanAttack(mage, toofar);

        if (hCanAtack || mCanAtack) {
            _g("fight&a=strike&id=" + markWarrior);
        } else {
            if (toofar) _g('fight&a=move');
            else _g("fight&a=strike&id=" + markWarrior);
        }
    };

    this.createButton = function($par, text, addClass, callback) {
        var $btn = Tpl.get('button').addClass('green');
        $btn.find('.label').text(text);
        $btn.addClass(addClass);
        $btn.click(callback);
        $par.append($btn);
    };

    this.addControlButtons = function() {
        var t = [
            _t('quick_battle', null, 'battle'),
            _t('copy-battle-logs', null, 'battle'),
            _t('change_target_battle', null, 'battle'),
            _t('battle_logs', null, 'battle'),
            _t('battle_leave', null, 'battle'),
            _t('close_logs', null, 'battle'),
            _t('surrender', null, 'battle'),
            _t('cancel', null, 'buttons'),
            _t('cancel_quick_battle', null, 'battle')
        ];

        var $wrapper = $battleController.find('.buttons-wrapper');
        const cancelQuickBattleBtnTxt = addSkillBarVisible ? t[7] : t[8];

        $battleController.find('.surrender').click(() => {
            _g('fight&a=surrender');
        }).tip(_t('surrender', null, 'battle'));

        self.createButton($wrapper, t[0], 'auto-fight-btn small', this.canAutoFight);
        self.createButton($wrapper, cancelQuickBattleBtnTxt, 'auto-fight-cancel-btn small', this.canAutoFightCancel);
        self.createButton($wrapper, t[1], 'copy-battle-logs small', function() {
            BattleMessages.copyForumLog();
            mAlert(_t('copyToClipboard', null, 'battle'));
        });
        self.createButton($wrapper, t[4], 'close-battle-ground small', function() {
            self.canLeave();
        });
        self.createButton($wrapper, t[5], 'close-battle-logs small', function() {
            self.hideBattleLog();
        });
        self.createButton($wrapper, t[2], 'change-target-btn small', function() {
            self.selectWarrior(true);
        });
        $battleController.find('.toggle-battle').click(self.toggleBattlePanel);
        $battleController.find('.attach-battle-log-help-window').click(function() {
            BattleMessages.toggleAttachBattleLogHelpWindow();
        });
        $battleController.find('.attach-battle-prediction-help-window').click(function() {
            battlePredictionHelpWindow.toggleAttach();
        });
    };


    this.showPanelActionsButs = function() {
        var s = self.canLeaveBattle;
        if (!s) s = self.endBattleForMe;
        var bool = !s;
        var visible = bool ? '' : 'none';
        var revertVisible = bool ? 'none' : '';
        var $surrender = $battleController.find('.surrender');
        if (!Engine.worldConfig.getHardcore() && !self.endBattleForMe) {
            $surrender.css('display', 'inline-block');
        }
        $battleController.find('.change-target-btn').css('display', visible);
        self.setVisibleAutofight(bool);
        $battleController.find('.battle-end-layer').css('display', revertVisible);
        $battleController.find('.copy-battle-logs').css('display', revertVisible);
        $battleController.find('.close-battle-ground').css('display', revertVisible);
        if (s) $battleController.find('.close-battle-logs').css('display', 'none');
    };

    this.setVisibleAutofight = function(state) {
        var visible = state && !self.endBattleForMe && !self.canLeaveBattle ? '' : 'none';
        $battleController.find('.auto-fight-btn').css('display', visible);

        // this.setSurrenderButtonVisible(visible);
    };

    this.setVisibleAutofightCancel = function(state) {
        var visible = state && !self.endBattleForMe && !self.canLeaveBattle ? '' : 'none';
        $battleController.find('.auto-fight-cancel-btn').css('display', visible);

        // this.setSurrenderButtonVisible(visible);
    };

    this.setSurrenderButtonVisible = () => {
        const visible = !self.endBattleForMe && !Engine.worldConfig.getHardcore() ? '' : 'none';
        var $surrender = $battleController.find('.surrender');
        if ($surrender.css('display') !== 'none') {
            $surrender.css('display', visible);
        }
    }

    this.createProgressBar = function($parent, addClass, startLabel) {
        var $progresBar = tpl.get('progress-bar-wrapper').addClass(addClass);
        if (startLabel) $progresBar.find('.label').html(startLabel);
        $progresBar.css('display', 'none');
        $parent.append($progresBar);
    };

    this.deleteWarrior = function(id) {
        var ids = teamIDs["2"];
        for (var i = 0; i < ids.length; i++) {
            var wId = ids[i];
            if (wId == id) {
                ids.splice(i, 1);
                break;
            }
        }
        while (selectedWarriors.length) {
            selectedWarriors.pop();
        }
    };

    this.setDateTime = function() {
        $battleController.find('.battle-watch').html(ut_fulltime(ts() / 1000));
    };

    //this.selectWarrior = function (kind) {
    //	debugger;
    //	this.manageKindWarriorShowed(kind);
    //	var currentWarrior = null;
    //	var currentWarriorID = null;
    //	for (var i in teamIDs[kind]) {
    //		currentWarriorID = teamIDs[kind][i];
    //		currentWarrior = self.warriorsList[currentWarriorID];
    //
    //		if (!currentWarrior) return;
    //		if (currentWarrior["hpp"] == 0) delete teamIDs[kind][i];
    //		var teamsL = teamIDs[kind].length;
    //		var selectedL = selectedWarriors.length;
    //		if (teamsL == selectedL) selectedWarriors = [];
    //		if (selectedWarriors.indexOf(currentWarriorID) >= 0) continue;
    //
    //		selectedWarriors.push(currentWarriorID);
    //		self.clickCharacter(currentWarriorID, {
    //			type: 'focus', preventDefault: function () {
    //			}
    //		});
    //		break;
    //	}
    //};

    this.selectWarrior = function(next = true) {
        var b = Engine.battle;
        var idMark = b.getMarkObject();
        var lines = this.warriors.getLines();
        var y = b.warriorsList[idMark].y;
        var nextId = next ? this.getNextAliveById(lines[y], idMark) : this.getNextAliveById(lines[y], idMark, true);
        if (idMark != nextId) {
            self.setClickOnNewTarget(null, null, nextId);
            return;
        }

        y = this.getNextLine(lines, next, y);

        for (var count = 0; count < lines.length; count++) {
            var firstId = this.getFirstAliveIdChar(lines[y], !next);
            if (firstId) {
                self.setClickOnNewTarget(null, null, firstId);
                return;
            }
            y = this.getNextLine(lines, next, y);
        }
    };

    this.getNextLine = (lines, next, y) => { //find next or prev line
        if (!next) {
            if (y < 0) y = lines.length - 1;
            else y--;
        } else {
            if (y > lines.length - 1) y = 0;
            else y++;
        }
        return y;
    };

    this.getMarkObject = function() {
        return markWarrior;
    };

    this.lookForPosMarkWarrior = function(lines) {
        if (markWarrior == null) markWarrior = Engine.hero.d.id;
        if (!lines) lines = Engine.battle.warriors.getLines();

        for (var y = 0; y < lines.length; y++) {
            var row = lines[y];
            for (var x in row) {
                if (row[x].id != markWarrior) continue;
                return {
                    x: x,
                    y: y
                };
            }
        }
    };

    this.clearMarkWarior = function() {
        markWarrior = null;
    };

    this.getPosMarkObject = function(modX, modY) { //return true when change target
        var lines = Engine.battle.warriors.getLines();
        var pos = self.lookForPosMarkWarrior(lines);
        if (!pos) return;
        if (modX && modY) {
            console.warn('[Battle.js, getPosMarkObject] TARGET CHANGE TWO AXIS!!!');
            return false;
        }

        if (modY) {
            if (modY > 0) {
                for (var y = pos.y + 1; y < lines.length; y++) {
                    var alive = self.checkInThisRowEnemyAlive(lines[y]);
                    if (alive) {
                        var nearest = self.getNearestXAfterChangeLine(lines, y, pos.x, pos.y);
                        self.setClickOnNewTarget(nearest, y);
                        return true;
                    }
                }
                return false;
            } else {
                for (var y = pos.y - 1; y > -1; y--) {
                    var alive = self.checkInThisRowEnemyAlive(lines[y]);
                    if (alive) {
                        var nearest = self.getNearestXAfterChangeLine(lines, y, pos.x, pos.y);
                        self.setClickOnNewTarget(nearest, y);
                        return true;
                    }
                }
                return false;
            }
        }

        if (modX) {
            var row = lines[pos.y];
            var posXMarkObj = pos.x;
            var posYMarkObj = pos.y;
            if (!self.checkInThisRowEnemyAlive(row)) return false;

            var newX = modX < 0 && modX ? self.getPrevAliveChar(row, posXMarkObj) : self.getNextAliveChar(row, posXMarkObj);
            self.setClickOnNewTarget(newX, posYMarkObj);

            return posXMarkObj != newX;
        }
    };

    this.setFirstMarkObj = function() {
        self.warriors.setDieMob(false);
        if (this.getPosMarkObject(-1, 0)) return;
        if (this.getPosMarkObject(1, 0)) return;
        if (this.getPosMarkObject(0, 1)) return;
        if (this.getPosMarkObject(0, -1)) return;
    };

    this.setClickOnNewTarget = function(x, y, id) {
        var newId;
        if (id) newId = id;
        else newId = Engine.battle.warriors.getLines()[y][x].id;
        var o = {
            type: 'focus',
            preventDefault: function() {}
        };
        self.clickCharacter(newId, o);
    };

    this.checkInThisRowEnemyAlive = function(line) {
        var hero = self.warriorsList[Engine.hero.d.id];
        for (var x in line) {
            if (self.getAlive(line[x]) && line[x].team !== hero.team) return true;
        }
        return false;
    };

    this.getFirstAliveIdChar = function(row, reverse = false) {
        if (typeof row === 'undefined') return null;
        if (reverse) {
            row = [...row];
            row.reverse();
        }
        for (var x in row) {
            var alive = self.getAlive(row[x]); //row[x].hpp > 0;
            if (alive) return row[x].id
        }
        return null;
    };

    this.getNextAliveById = function(row, id, reverse = false) {
        var next = null;
        var prev = null;
        if (reverse) {
            row = [...row];
            row.reverse();
        }
        for (var x in row) {
            var currentRow = row[x];
            var currentId = currentRow.id;
            var alive = self.getAlive(currentRow); //currentRow.hpp > 0;
            if (next && alive) return currentId;
            if (currentId == id) next = true;
            if (alive) prev = currentId;
        }
        return id; // only when not exist next key
    };

    this.getNextAliveChar = function(row, key) {
        var next = null;
        var prev = null;
        for (var x in row) {

            var alive = self.getAlive(row[x]); //row[x].hpp > 0;
            if (next && alive) return x;
            if (x == key) next = true;
            if (alive) prev = x;
        }
        return key; // only when not exist next key
    };

    this.getPrevAliveChar = function(row, key) {
        var prev = null;
        for (var x in row) {
            var alive = self.getAlive(row[x]); //row[x].hpp > 0;
            if (x == key && prev) return prev;
            if (alive) prev = x;
        }
        return key; // only when not exist next key
    };

    this.getAlive = function(obj) {
        var type = 1; // type : 0-self, 1-friend, 2-enemy

        var hero = self.warriorsList[Engine.hero.d.id];
        if (obj == hero) type = 0;
        else if (obj.team != hero.team) type = 2;

        return obj.hpp > 0;
    };

    this.getNearestXAfterChangeLine = function(lines, yToFindTarget, posXMarkObj, posYMarkObj) {
        var rowToFindTarget = lines[yToFindTarget];
        var rowWithMarkObj = lines[posYMarkObj];
        var markObject = rowWithMarkObj[posXMarkObj];
        var sideLeftMarkObj = markObject.sideLeft;
        var idMarkObj = markObject.id;
        var xDependOfMiddle = null;

        var l = rowWithMarkObj.length;
        var firstAppearSide = 0;
        if (sideLeftMarkObj) {

            for (var x = l - 1; x > -1; x--) {
                if (rowWithMarkObj[x].sideLeft) firstAppearSide++;
                if (rowWithMarkObj[x].id == idMarkObj) {
                    xDependOfMiddle = firstAppearSide;
                    break;
                }
            }

        } else {

            for (var x = 0; x < l; x++) {
                if (!rowWithMarkObj[x].sideLeft) firstAppearSide++;
                if (rowWithMarkObj[x].id == idMarkObj) {
                    xDependOfMiddle = firstAppearSide;
                    break;
                }
            }
        }

        var l = rowToFindTarget.length;
        firstAppearSide = 0;
        var purposeX = null;
        if (sideLeftMarkObj) {

            for (var x = l - 1; x > -1; x--) {
                var alive = self.getAlive(rowToFindTarget[x]); //rowToFindTarget[x].hpp > 0;
                if (rowToFindTarget[x].sideLeft && alive) {
                    firstAppearSide++;
                    purposeX = x;
                }
                if (firstAppearSide == xDependOfMiddle) break;
            }

            if (firstAppearSide == 0) purposeX = self.warriors.getStartSideLines()[yToFindTarget].firstRight;

            return purposeX;
        } else {

            for (var x = 0; x < l; x++) {
                var alive = self.getAlive(rowToFindTarget[x]); //rowToFindTarget[x].hpp > 0;
                if (!rowToFindTarget[x].sideLeft && alive) {
                    firstAppearSide++;
                    purposeX = x;
                }
                if (firstAppearSide == xDependOfMiddle) break;
            }

            if (firstAppearSide == 0) purposeX = self.warriors.getStartSideLines()[yToFindTarget].firstLeft;

            return purposeX;
        }
    };

    this.manageKindWarriorShowed = function(kind) {
        if (warriorsKind == kind) return;
        while (selectedWarriors.length) {
            selectedWarriors.pop();
        }
        warriorsKind = kind;
    };

    this.getSkillName = (skillID) => {
        if (!battleSkills[skillID]) return null;
        return battleSkills[skillID].name
    }

    this.getSkill = function(skillName, request, cost, skillID, require) {
        var $skill = Tpl.get('battle-skill');
        // if (skillID == SkillsData.specificSkills.ONE_STEP_ID) $skill.find('.background').addClass('move-skill-bck');
        if (self.isOneStepId(skillID)) $skill.find('.background').addClass('move-skill-bck');
        this.setSkillTip($skill, skillName, cost, skillID);
        if (cost) self.setManaOrEnergySkill($skill, cost);
        if (require) $skill.addClass('require');
        var cl = 'skill-icon ' + _l() + ' icon-' + skillID;
        $skill.attr('battle-skill-id', skillID);
        $skill.find('.icon').addClass(cl);
        $skill.click(function() {
            if (self.endBattleForMe) return;

            //let USE_BATTLE_SKILL 	= TutorialData.ON_FINISH_REQUIRE.USE_BATTLE_SKILL;
            //let REQUIRE 			= TutorialData.ON_FINISH_TYPE.REQUIRE;
            //let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(USE_BATTLE_SKILL, REQUIRE, skillID);
            //
            //Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger);
            self.callCheckCanFinishExternalTutorialUseBattleSkill(skillID)


            self.sendRequest($skill, request, skillID);
        });
        return $skill;
    };

    this.callCheckCanFinishExternalTutorialUseBattleSkill = (skillId) => {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_REQUIRE.USE_BATTLE_SKILL,
            TutorialData.ON_FINISH_TYPE.REQUIRE,
            skillId
        );

        Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger);
    };

    this.callCheckCanFinishExternalTutorialHeroEndBattle = () => {
        //console.log('callCheckCanFinishExternalTutorialHeroEndBattle');
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_ABSOLUTE_FINISH.HERO_END_BATTLE,
            TutorialData.ON_FINISH_TYPE.ABSOLUTE_FINISH,
            true
        );

        Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger);
    };

    this.callCheckCanFinishExternalTutorialHeroLeaveBattleButtonOrHotkey = () => {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_REQUIRE.HERO_LEAVE_BATTLE_BUTTON_OR_HOTKEY,
            TutorialData.ON_FINISH_TYPE.REQUIRE,
            true
        );

        Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger);
    };

    this.callCheckCanFinishExternalTutorialCloseBattleWindow = () => {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_ABSOLUTE_FINISH.CLOSE_BATTLE_WINDOW,
            TutorialData.ON_FINISH_TYPE.ABSOLUTE_FINISH,
            true
        );

        Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger);
    };

    this.callCheckCanFinishExternalTutorialStartBattle = () => {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_ABSOLUTE_FINISH.START_BATTLE,
            TutorialData.ON_FINISH_TYPE.ABSOLUTE_FINISH,
            true
        );

        Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger);
    };

    this.setSkillTip = function($skill, name, cost, skillID) {
        // if (!cost) {
        // 	$skill.tip(name, 't_static');
        // 	return;
        // }
        // var type = cost[cost.length - 1];
        // var tip = cost ? name + ' <span class="' + type + '">(' + cost + ')</span>' : name;
        //console.log(tip);
        // if(skillID == -1 || skillID == -2) {
        // 	$skill.tip(name, 't_static');
        // 	return;
        // }


        SkillTip.setSkillTip($skill, battleSkills[skillID])
    };

    this.getGroupById = (id) => {
        for (let k in flist1) {
            if (flist1[k].id == id) return flist1
        }

        for (let kk in flist2) {
            if (flist2[kk].id == id) return flist2
        }

        errorReport('Battle.js', 'getGroupById', `id ${id} not exist in flist1 and flist2`, [flist1, flist2]);

        return []
    }

    this.getBattleSkillType = (strData) => {
        if (strData.search('e') > -1) return 'e';
        if (strData.search('m') > -1) return 'm';
        console.error('[Battle.js, getBattleSkillType] Bad type off skill:', strData);
        return '';
    };

    this.manageUseSkillAnimation = function($div) {
        //if (Engine.opt(8)) {
        if (!isSettingsOptionsInterfaceAnimationOn()) {
            setTimeout(function() {
                $div.remove();
            }, 200)
        } else {
            $div.fadeOut('slow', function() {
                $(this).remove();
            });
        }
    };

    this.sendRequest = function($skill, request, skillID) {

        // var id = skillID == SkillsData.specificSkills.ONE_STEP_ID ? '' : markWarrior; // -2 - move
        var id = self.isOneStepId(skillID) ? '' : markWarrior; // -2 - move
        var str = request + id;

        var left = $skill.position().left / Engine.zoomFactor + 4;
        //var $div = $("<div>");
        var $div = tpl.get('after-use-skill');
        var bool = $skill.hasClass('disabled');
        //var bool = $skill.hasClass('disabled') || $skill.hasClass('last-line'); // new system one step

        $skill.parent().append($div);
        //$div.addClass('after-use-skill');
        //$div.css('left', left);
        self.manageUseSkillAnimation($div);

        if (bool) {
            if ($skill.hasClass('die')) message(_t('bad-target', null, 'battle'));
            if ($skill.hasClass('not-enough-e')) message(_t('needE', null, 'battle'));
            if ($skill.hasClass('not-enough-m')) message(_t('needM', null, 'battle'));
            if ($skill.hasClass('too-far')) message(_t('too-far', null, 'battle'));
            if ($skill.hasClass('bad-target')) message(_t('bad-target', null, 'battle'));
            if ($skill.hasClass('mage-held-wand')) message(_t('mage-held-wand', null, 'battle'));
            if ($skill.hasClass('last-line')) message(_t('last-line', null, 'battle'));
            if ($skill.hasClass('hunter-can-not-one-step')) message(_t('hunter-without-arrow %prof%', {
                '%prof%': getAllProfName(Engine.hero.d.prof)
            }, 'battle'));
            if ($skill.hasClass('require')) {
                var require = battleSkills[skillID].require.split(",");
                for (var i = 0; i < require.length; i++) {
                    var key = require[i];
                    if (isset(tips[key])) message(tips[key]);
                    else message(key);
                }
            }
            return;
        }
        canSendRequest = false;
        _g(str, function() {
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 6);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 6);
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 7);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 7);
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 7);
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 7);
            canSendRequest = true;
        });
    };

    this.checkManaOrEnergy = function($skill, cost) {
        if (!cost) return false;
        var parseCost = parseInt(cost);
        var type = cost[cost.length - 1];
        var m = self.heroMana;
        var e = self.heroEnergy;
        $skill.addClass(type);
        var bool1 = type == 'm' && m < parseCost;
        var bool2 = type == 'e' && e < parseCost;

        if (bool1 || bool2) {
            $skill.addClass('not-enough-' + type);
            return true;
        }
        return false;
    };

    this.getBattleSkill = (id) => {
        return battleSkills[id];
    }

    this.getAllBattleSkill = () => {
        return battleSkills;
    }

    this.checkDisabledAndAddClass = function($skill, id) {
        // if (battleSkills[id].disabled) {
        if (self.checkDisabled(id)) {
            $skill.addClass('require');
            return true;
        }
        return false;
    };

    this.checkTooFar = function($skill, bits, tooFar) {
        if ((bits & 2) && tooFar) {
            $skill.addClass('too-far');
            return true;
        }
        return false;
    };

    this.setManaOrEnergySkill = function($skill, cost) {
        if (!cost) return false;
        var type = cost[cost.length - 1];
        $skill.addClass(type);
        $skill.find('.type').html(cost.slice(0, -1));
    };

    this.addToHotSlot = function($skill, id, request, place) {
        $battleSkills.add($addBattleSkills).find('[slot=' + place + ']').append($skill);
        var newPlace = place; //place  > 3 ? 7 - place + 4 : place;
        if (place > 7) return;
        self.showedSkills[newPlace] = [$skill, request, id];
    };

    this.addToshowedSkills = function(index, skillData) {
        var i = index; //index > 3 ?  7 - index + 4 : index;
        self.showedSkills[i] = skillData
    };

    this.addAttackSkill = function(place) {
        var name = _t('attack', null, 'battle');
        var request = "fight&a=strike&id=";
        var id = SkillsData.specificSkills.NORMAL_ATTACK_ID;
        var $skill = self.getSkill(name, request, false, id, '');
        self.addToHotSlot($skill, id, request, place);
    };

    this.addStepSkill = function(place) {
        var name = _t('move_forward', null, 'battle');
        var request = "fight&a=move";
        var id = SkillsData.specificSkills.ONE_STEP_ID;
        var $skill = self.getSkill(name, request, false, id, '');
        self.addToHotSlot($skill, id, request, place);
    };

    this.showSkills = function() {
        var $skill, request;

        self.removeHotSkills();
        self.showedSkills = {};

        for (var i in battleSkills) {
            var sk = battleSkills[i];
            // if (i == SkillsData.specificSkills.NORMAL_ATTACK_ID) {
            if (self.isNormalAttackId(i)) {
                this.addAttackSkill(sk.hotSlot);
                continue;
            }
            // if (i == -2) {
            if (self.isOneStepId(i)) {
                this.addStepSkill(sk.hotSlot);
                continue;
            }
            var require = battleSkills[i].require;
            let disabled = self.checkDisabled(i);

            request = "fight&a=spell&s=" + i + "&id=";
            $skill = self.getSkill(sk.name, request, sk.cost, i, disabled ? require : false);
            self.addToHotSlot($skill, i, request, sk.hotSlot);
        }
        if (!Engine.dead) $battleSkills.css('display', 'block');
    };

    this.removeHotSkills = function() {
        if (!$battleSkills) return; //quick fight problem
        self.showedSkills = null;
        $battleSkills.add($addBattleSkills).find('.battle-skill').remove();
    };

    this.initBattleController = function() {
        $battleController = Tpl.get('battle-controller');
        $battleSkills = Engine.interface.get$interfaceLayer().find('.skill-usable-slots');
        $addBattleSkills = $battleController.find('.skill-usable-add-slots');
        $timeWrapper = $battleController.find('.time');
        $timeSeconds = $battleController.find('.seconds');
        $timeProgressBarWrapper = $battleController.find('.time-progress-bar');
        $timeProgressBar = $battleController.find('.time-inner');
        self.addControlButtons();
        self.initProgressBars();
        Engine.interface.get$interfaceLayer().find('.bottom.positioner').prepend($battleController);
        Engine.hotKeys.replaceAutoAndChangeBtnsNames();
        Engine.hotKeys.replaceCloseFightBtnsNames();

        //updateBattleAreaPosition();
    };

    const updateBattleAreaPosition = () => {
        if (getEngine().battle.zoomMode) return;

        let margin = isAdditionalSkillsVisible() ? 0 : 15;
        let battleControllerHeight = $battleController.height();

        $battleArea.css('bottom', battleControllerHeight - margin);

    }

    this.setSizeOfBattlePanel = () => {
        let state = StorageFuncBattle.getBattlePanelState();
        let $toggleBattle = $battleController.find('.toggle-battle');

        $toggleBattle.tip(_t('toggleBattlePanel'));

        if (!state) {
            if (mobileCheck()) state = NORMAL_SIZE;
            else state = BIG_SIZE;
        }

        let index = this.getIndexByNameIBattleControllerSize(state);

        this.setActualSize(state);
        this['set' + state + 'Size']();
        this.setBattleControllerPanelHeight(index);
        this.manageShowMore(index);


        Engine.hotKeys.replaceToggleBattlePanelTipNames();
        //updateBattleAreaPosition();
    };

    this.setActualSize = (state) => {
        actualStateSize = state;
    };

    this.manageShowMore = (index) => {
        let $toggleBattle = $battleController.find('.toggle-battle');
        let cl = 'show-more';
        let addClass;

        if (battleControllerSize.length > index + 1) {

            let tooBig = this.checkBattleControllerIsTooBig(true);
            addClass = tooBig ? '' : cl;

        } else addClass = '';

        $toggleBattle.removeClass(cl).addClass(addClass);
    };

    this.initBattleWindow = function() {
        this.$ = Tpl.get('battle-window');
        $battleArea = this.$.find('.battle-area');
        //$('.game-layer').append(this.$);
        Engine.interface.get$gameLayer().append(this.$);
        //$('body').addClass('in-battle');
        self.onResize();
        this.$.on('mousewheel DOMMouseScroll', throttle(this.onScrollBattle, 300));
    };

    this.getBattleArea = () => {
        return $battleArea;
    };

    this.isBattleShow = () => {
        return isset(this.$) && this.$.css('display') === 'block';
    };

    //this.setBackgroundColorOfBattleNightLayer = (rgba) => {
    //	return
    //	this.$.find('.battle-night-layer').css("background-color", `rgba(${rgba})`);
    //};

    this.getBattleController = () => {
        return $battleController;
    };

    this.onScrollBattle = (e) => {
        let result = e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0;
        this.selectWarrior(result);
    };

    this.leaveBattle = function() {
        _g('fight&a=exit');
    };

    this.canAutoFight = () => {
        if (!this.isAutoFightActive()) {
            if (isAutoFightForAllAvailable) {
                autoFightForAllOrSelfConfirm(this.autoFightWithCheckWT, this.autoFight)
            } else {
                this.autoFight();
            }
        } else {
            this.canAutoFightCancel();
        }
    };

    this.autoFightWithCheckWT = () => {
        if (this.checkWT()) {
            autoFightConfirm(() => {
                if (this.show) this.autoFight(true);
            });
        } else {
            this.autoFight(true);
        }
    };

    this.canLeave = () => {
        if (self.checkWT() && !self.endBattle) {
            mAlert(_t('leave_alert', null, 'battle'), [{
                txt: _t('yes'),
                callback: function() {
                    self.leaveBattle();
                    return true;
                }
            }, {
                txt: _t('no'),
                callback: function() {
                    return true;
                }
            }]);
        } else {
            self.leaveBattle();
            return;
        }
    };

    this.checkWT = () => {
        if (this.warriorsList) {
            for (let i in this.warriorsList) {
                let wt = this.warriorsList[i].wt;
                if (isset(wt) && (wt >= 80)) {
                    return true;
                }
            }
        }
        return false;
    };

    this.autoFight = function(autoForAll = false) {
        // self.setVisibleAutofight(false);
        const request = !autoForAll ? 'fight&a=f&enabled=1' : 'fight&a=auto';
        _g(request, function(data) {
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 6);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 6);
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 7);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 7);
            // if (isset(data.alert)) self.setVisibleAutofight(true);
            autoFightAfter = true;
            autoFightWasCallInBattle = true;
        });
    };

    this.canAutoFightCancel = () => {
        if (isAutoFightForAllAvailable) {
            autoFightForAllOrCancel(() => {
                this.autoFight(true);
            }, this.autoFightCancel)
        } else {
            this.autoFightCancel();
        }
    }

    this.autoFightCancel = () => {
        _g('fight&a=f&enabled=0');
    }

    this.getAutoFightWasCallInBattle = () => {
        return autoFightWasCallInBattle;
    };

    this.clickCharacter = function(id, e) {
        if (self.isAuto) return;
        var w = self.warriorsList[(id).toString()];
        var hero = self.warriorsList[Engine.hero.d.id];
        markWarrior = id;

        if (e && e.type == 'contextmenu' && w.hpp > 0) {
            //if (hero == w) _g("fight&a=move");
            //else if (w.team != this.myteam) _g("fight&a=strike&id=" + id);
            self.skillBattleMenu.showMenuSkills(e, w, battleSkills);
        }

        self.setDisabledSkills(w);
        self.showWarriorInfo(w);

        //RIGHT CLICK
        //if (e && e.type == 'contextmenu') {
        //	if (hero == w) _g("fight&a=move");
        //	else if (w.team != this.myteam) _g("fight&a=strike&id=" + id);
        //	self.showMenuSkills(e);
        //}
        $('.progress-bar-wrapper', '.battle-area').css('z-index', 0);
        $('.selector', '.one-warrior').css('display', 'none').removeClass('selected');
        $('.one-warrior').removeClass('selected');
        w.$.find('.selector').css('display', (w.hpp == 0 ? 'none' : 'block'));
        w.hpp == 0 ? w.$.removeClass('selected') : w.$.addClass('selected');
        w.$.find('.progress-bar-wrapper').css('z-index', '+=1');

        //SHOW DEFAULT MENU IF CTRL IS CLICKED (FOR DEBUG PURPOSES)
        //if (!e.ctrlKey) e.preventDefault();
        //return e.ctrlKey
    };

    this.setDisabledSkills = function(w) {
        var hero = self.warriorsList[Engine.hero.d.id];
        var toofar = !(w.y - hero.y < 2);

        var type = 1; // type : 0-self, 1-friend, 2-enemy
        if (w == hero) type = 0;
        else if (w.team != hero.team) type = 2;

        //Engine.interface.$popUpLayer.find('.menu-item-skill').addClass('disabled');
        self.skillBattleMenu.addDisabledClassToAllMenuItems();
        $battleSkills.add($addBattleSkills).find('.battle-skill').addClass('disabled');
        $battleSkills.add($addBattleSkills).find('.battle-skill').removeClass('bad-target too-far not-enough-e not-enough-m die last-line mage-held-wand hunter-can-not-one-step');

        if (w.hpp == 0) return $battleSkills.add($addBattleSkills).find('.battle-skill').addClass('die');

        this.checkAttackAndMoveDisabled(toofar, type);

        for (var i in battleSkills) {
            // if (i == SkillsData.specificSkills.NORMAL_ATTACK_ID || i == SkillsData.specificSkills.ONE_STEP_ID) continue;
            if (self.isNormalAttackId(i) || self.isOneStepId(i)) continue;
            var sk = battleSkills[i],
                add = false,
                disabled = false;
            var cost = battleSkills[i].cost;
            var $skill = self.getSkillObjFromBars(i);

            if (self.checkManaOrEnergy($skill, cost)) disabled = true;
            if (self.checkDisabledAndAddClass($skill, i)) disabled = true;

            if ((sk.attr & 8) && !type) add = true;
            if ((sk.attr & 16) && type == 1) add = true;
            if (!(sk.attr & 24) && type == 2) add = true;

            if (self.checkTooFar($skill, sk.attr, toofar)) disabled = true;

            if (!add) $skill.addClass('bad-target');
            if (disabled) continue;

            if (add) {
                $skill.removeClass('disabled');
                //Engine.interface.$popUpLayer.find('.menu-item-skill-id-' + i).removeClass('disabled');
                self.skillBattleMenu.removeDisabledClassFromMenuSkill(i)
            }
        }
    };

    this.getSkillObjFromBars = function(i) {
        var obj = $battleSkills.add($addBattleSkills).find('.icon-' + i);
        return obj.parent();
    };

    this.checkAttackAndMoveDisabled = function(toofar, type) {
        var heroId = Engine.hero.d.id;
        var isHero = heroId == markWarrior;
        var isFriend = type == 1;
        var prof = Engine.hero.d.prof;
        // var distanceProf = prof == 't' || prof == 'h';
        // var mage = prof == 'm';

        var distanceProf = prof == ProfData.TRACKER || prof == ProfData.HUNTER;
        var mage = prof == ProfData.MAGE;

        var attackSkill = self.getSkillObjFromBars(SkillsData.specificSkills.NORMAL_ATTACK_ID);
        var moveSkill = self.getSkillObjFromBars(SkillsData.specificSkills.ONE_STEP_ID);
        var attackMenuSkill = self.skillBattleMenu.getMenuSkill(SkillsData.specificSkills.NORMAL_ATTACK_ID);
        var moveMenuSkill = self.skillBattleMenu.getMenuSkill(SkillsData.specificSkills.ONE_STEP_ID);
        var correctTarget = !isHero && !isFriend;

        var hCanAttack = this.huntersCanAttack(distanceProf, toofar);
        var mCanAttack = this.mageCanAttack(mage, toofar);
        var canNormalAttack = !toofar && correctTarget || (hCanAttack || mCanAttack) && correctTarget;

        if (canNormalAttack) {
            attackSkill.removeClass('disabled');
            attackMenuSkill.removeClass('disabled');
        } else {
            if (isHero || isFriend) attackSkill.addClass('bad-target');
            else if (toofar) attackSkill.addClass('too-far');
        }

        //old system one step
        //if (isHero) {
        //
        //	if (!this.mageCanOneStep(mage, toofar)) return moveSkill.addClass('mage-held-wand');
        //	if (!this.huntersCanOneStep(distanceProf, toofar)) return moveSkill.addClass('hunter-can-not-one-step');
        //
        //	var lastLine  = self.warriorsList[(markWarrior).toString()].y == 4;
        //	if (lastLine) return moveSkill.addClass('last-line');
        //
        //	moveSkill.removeClass('disabled');
        //} else {
        //	moveSkill.addClass('bad-target');
        //}
        //end old system one step

        //new system one step
        if (!this.mageCanOneStep(mage, toofar)) return moveSkill.addClass('mage-held-wand');
        if (!this.huntersCanOneStep(distanceProf, toofar)) return moveSkill.addClass('hunter-can-not-one-step');

        var lastLine = self.warriorsList[(heroId).toString()].y == 4;
        if (lastLine) return moveSkill.addClass('last-line');
        moveSkill.removeClass('disabled');
        moveMenuSkill.removeClass('disabled');

        //end new system one step
    };

    this.huntersCanAttack = function(distanceProf, tooFar) {
        if (!distanceProf) return;
        var haveBow = isset(Engine.heroEquipment.getEqItems()[ItemData.CL.DISTANCE_WEAPON]);
        var haveArrows = isset(Engine.heroEquipment.getEqItems()[ItemData.CL.QUIVER]);
        if (haveBow && haveArrows) return true;
        else return !tooFar;
    };

    this.mageCanAttack = function(mage, tooFar) {
        if (!mage) return;
        if (isset(Engine.heroEquipment.getEqItems()['magic'])) return true;
        else return !tooFar;
    };

    this.huntersCanOneStep = function(distanceProf) {
        if (!distanceProf) return true;
        var haveBow = isset(Engine.heroEquipment.getEqItems()[ItemData.CL.DISTANCE_WEAPON]);
        var haveArrows = isset(Engine.heroEquipment.getEqItems()[ItemData.CL.QUIVER]);
        return !(haveBow && haveArrows);
    };

    this.mageCanOneStep = function(mage) {
        if (!mage) return true;
        var mageHeldWand = isset(Engine.heroEquipment.getEqItems()['magic']);
        return !mageHeldWand;
    };

    this.showWarriorInfo = function(warrior) {
        if (self.isAuto) return;
        self.selectedWarriorID = warrior.id;

        //var $icon = $('<div>').addClass('profs-icon ' + warrior["prof"]);
        var $icon = tpl.get('profs-icon').addClass(warrior["prof"]);
        $battleController.find('.nick').html(warrior["name"]);
        $battleController.find('.level').html('(' + warrior['lvl'] + ')');
        $battleController.find('.prof-wrapper').html($icon);
        $icon.tip(getAllProfName(warrior["prof"]));

        var $buffsWrapper = $battleController.find('.buffs-wrapper');

        //var canUpdateEnergy = warrior.energy0 > 0 && warrior.prof != 'm';
        var canUpdateEnergy = warrior.energy0 > 0 && warrior.prof != ProfData.MAGE;
        // var canUpdateMana = warrior.mana0 > 0 && ['w', 'b', 'h'].indexOf(warrior.prof) < 0;
        var canUpdateMana = warrior.mana0 > 0 && [ProfData.WARRIOR, ProfData.BLADE_DANCER, ProfData.HUNTER].indexOf(warrior.prof) < 0;

        self.updateProgressBar(warrior.hpp, 'hp-progress-bar');
        self.updateWarriorBuffs($buffsWrapper, warrior.hpp, warrior.buffs);

        if (canUpdateEnergy) self.updateProgressBar(warrior.energy, 'ep-progress-bar', warrior.energy0);
        else $battleController.find('.ep-progress-bar').css('display', 'none');

        if (canUpdateMana) self.updateProgressBar(warrior.mana, 'mp-progress-bar', warrior.mana0);
        else $battleController.find('.mp-progress-bar').css('display', 'none');

    };

    //this.createWarriorIcon = function (warrior) {
    //	var $warrior = $(warrior).find('.warrior');
    //	var width = $warrior.width();
    //	var height = $warrior.height();
    //	var $avatar = $warrior.clone();
    //	$avatar.removeClass('warrior').html('').addClass('w-icon').css({
    //			'margin-left': 'auto',
    //			'left' : 0,
    //			'top': 0
    //		});
    //	if (width > 78 || height > 78) {
    //		var size = this.setAvatarBgSize($warrior, width, height);
    //		$avatar.css({
    //			'background-size': size[0] + 'px ' + size[1] + 'px',
    //			'width': size[0],
    //			'height': size[1]
    //		});
    //	}
    //	return $avatar;
    //};

    this.setAvatarBgSize = function($warrior, width, height) {
        var size = [width, height];
        if (width > height) {
            size[0] = 77;
            size[1] = Math.floor(height * 77 / width);
        } else {
            size[0] = Math.floor(width * 77 / height);
            size[1] = 77;
        }
        return size;
    };

    this.updateWarriorBuffs = function($buffsWrapper, warriorHPP, buffs) {
        //$buffsWrapper.html('');
        $buffsWrapper.empty();
        if (buffs && warriorHPP > 0) {
            var tmp = buffs;
            var amount = 0;
            while (tmp) {
                amount += tmp & 1;
                tmp >>= 1;
            }
            var kk = 0;
            for (var p = 0; p < 9; p++) {
                if (buffs >> p & 1) {
                    var row = Math.ceil((amount - kk) / 2) - 1;
                    //var $bf = $('<div class="buff _' + p + '"></div>');
                    var $bf = tpl.get('buff').addClass('_' + p);
                    $bf.tip(buffNames[p], 't_static');
                    $buffsWrapper.append($bf);
                    kk++;
                }
            }
        }
    };

    this.updateHpProgressBar = function(hpp) {
        var $progressBar = $battleController.find('.hp-progress-bar > .bar-percentage');
        var allWidth = $battleController.find('.hp-progress-bar > .background').width() + 16;
        var $text = $battleController.find('.hp-progress-bar > .label');
        var value = hpp / 100;
        $progressBar.css('display', hpp == 0 ? 'none' : 'block');
        $text.html(hpp + '%');
        //$progressBar.css('width', allWidth * value);
        //$progressBar.css('width', value + '%');
        setPercentProgressBar($progressBar, value)
    };

    this.updateProgressBar = function(stat, barName, max) {
        var cl = '.' + barName;
        var $progressBarWrapper = $battleController.find(cl);
        var $progressBar = $battleController.find(cl + ' > .bar-percentage');

        var cannot = ($battleController.hasClass('small')) && isset(max);

        if (cannot) $progressBarWrapper.css('display', 'none');
        else $progressBarWrapper.css('display', 'block');

        if (!isset(stat)) return $progressBarWrapper.css('display', 'none');

        //if (!isset(stat) || cannot) return $progressBarWrapper.css('display', 'none');
        //else $progressBarWrapper.css('display', 'block');

        var allWidth = 140;
        var $text = $battleController.find(cl + ' > .label');
        var value;

        if (max) {
            value = stat / max;
            $text.html(stat + '/' + max);
        } else {
            value = stat / 100;
            $text.html(stat + '%');
        }
        setPercentProgressBar($progressBar, value * 100);
        //$progressBar.css({
        //		//'width': (value * 100) + '%',
        //		'display': stat == 0 ? 'none' : 'block'
        //});
        $progressBar.css({
            'display': stat == 0 ? 'none' : 'block'
        });
    };

    this.clearDisabledSkills = () => {
        disabledSkills = null;
    }

    this.clearWarriorList = function() {
        for (var k in self.warriorsList) {
            delete self.warriorsList[k];
        }
        self.warriorsList = {};
        self.$.find('.one-warrior').remove();
    };

    this.clearTeamIDs = function() {
        for (var k in teamIDs) {
            delete teamIDs[k];
        }
        teamIDs = {};
    };

    this.hideBattlePanel = function() {
        Engine.interface.get$GAME_CANVAS().css('display', 'block');
        $battleController.css('display', 'none');
    };

    this.close = function(data) {
        Engine.lock.remove('battle');
        Engine.interface.heroElements.showElements('game');
        self.battleNight.onClear();
        self.battleEffectsController.clearAllEffects();
        BattleMessages.close();
        battlePredictionHelpWindow.hide();
        self.removeHotSkills();
        self.warriors.resetLines();
        self.warriors.clearCanvasWarriors();
        self.clearWarriorList();
        self.clearDisabledSkills()
        self.hideBattlePanel();
        self.w_amount = 0;
        is_init_fight = false;
        self.clearTeamIDs();
        self.showInterfaceItems();
        self.show = false;
        self.endBattleForMe = true;
        self.canLeaveBattle = true;
        if ($battleController) $battleController.removeClass('active');
        self.$.find('.warrior').remove();
        self.$.css('display', 'none');
        //API.callEvent('close_battle');
        API.callEvent(Engine.apiData.CLOSE_BATTLE);
        $('body').trigger('close_battle');
        $('body').removeClass('in-battle');
        Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 8);
        //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 8);
        Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 9);
        //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 9);  // ...Mother of God..

        self.callCheckCanFinishExternalTutorialHeroLeaveBattleButtonOrHotkey();

        self.callCheckCanFinishExternalTutorialCloseBattleWindow(); // RajData.event.BATTLE.ON_START_FIGHT_WITH_NPC
        //if (data.auto == '1' && self.checkIsOptWithAutoCloseBattleWindow()) self.callCheckCanFinishExternalTutorialCloseBattleWindow();		// RajData.event.BATTLE.ON_DIE_NPC
        if (data.auto == '1' && getEngine().settingsOptions.isAutoCloseBattleOn()) self.callCheckCanFinishExternalTutorialCloseBattleWindow(); // RajData.event.BATTLE.ON_DIE_NPC
    };

    this.showBattlePanel = function() {
        //API.callEvent('open_battle_window');
        API.callEvent(Engine.apiData.OPEN_BATTLE_WINDOW);
        Engine.lock.add('battle');
        self.initVariable();
        //self.deleteOldLoots();
        Engine.interface.get$GAME_CANVAS().css('display', 'none');
        $battleController.css('display', 'block');
        self.setSizeOfBattlePanel();
        Engine.interface.heroElements.showElements('battle');
        if (!Engine.dead) {
            self.hideInterfaceItems();
        }
        self.$.css('display', 'block');
        $('body').addClass('in-battle');
        if (self.isAuto) self.show = true;
    };

    //this.checkIsOptWithAutoCloseBattleWindow = () => {
    //	return Engine.opt(27) ? true : false;
    //}

    this.showBattleLog = function() {
        $battleController.css('display', 'block');
        const displayClass = $battleController.hasClass('with-skills') ? 'flex' : 'inline-block';
        $battleController.find('.close-battle-logs').css('display', displayClass);
        $battleController.find('.close-battle-ground').css('display', 'none');
        Engine.widgetManager.manageClassOfWidget(Engine.widgetsData.name.BATTLE_LOG, true);

        BattleMessages.showBattleLogHelpWindow();
        battlePredictionHelpWindow.show();
    };

    this.hideBattleLog = function() {
        $battleController.css('display', 'none');
        $battleController.find('.close-battle-logs').css('display', 'none');
        Engine.widgetManager.manageClassOfWidget(Engine.widgetsData.name.BATTLE_LOG, false);

        BattleMessages.hideBattleLogHelpWindow();
        battlePredictionHelpWindow.hide();
    };

    this.toogleBattleLogs = function() {
        if (self.show) return;
        if ($battleController.css('display') == 'block') self.hideBattleLog();
        else self.showBattleLog();
        BattleMessages.updateScroll();
    };

    this.getShow = () => {
        return this.show;
    };

    const updateBattleAreaData = () => {
        battleAreaData.width = $battleArea.width()
        battleAreaData.height = $battleArea.height()
        //battleAreaData.scale 	= $battleArea.scale()

        //console.log(battleAreaData.css('transition'));
    }

    const getBattleWidth = () => {
        return battleAreaData.width;
    }


    const getBattleHeight = () => {
        return battleAreaData.width;
    };

    const getBattleScale = () => {
        return battleAreaData.width;
    };

    const updateAutofightCancelBtn = () => {
        const text = addSkillBarVisible ? _t('cancel', null, 'buttons') : _t('cancel_quick_battle', null, 'battle');
        $battleController.find('.auto-fight-cancel-btn .label')[0].firstChild.textContent = text + ' ';
    }

    const autoFightConfirm = (clb) => {
        mAlert(_t('auto_fight_prompt', null, 'battle'), [{
            txt: _t('yes'),
            callback: function() {
                clb(); // don't send request after battle end
                return true;
            }
        }, {
            txt: _t('no'),
            callback: function() {
                return true;
            }
        }]);
    };

    const autoFightForAllOrSelfConfirm = (clb1, clb2) => {
        mAlert(_t('set_quick_fight', null, 'battle'), [{
            txt: _t('party', null, 'battle'),
            hotkeyClass: '',
            callback: function() {
                clb1();
                return true;
            }
        }, {
            txt: _t('for_myself', null, 'battle'),
            hotkeyClass: '',
            callback: function() {
                clb2();
                return true;
            }
        }, {
            txt: _t('cancel'),
            hotkeyClass: 'alert-cancel-hotkey',
            callback: function() {
                return true;
            }
        }]);
    };

    const autoFightForAllOrCancel = (clb1, clb2) => {
        mAlert(_t('change_fight_mode', null, 'battle') + ':', [{
            txt: _t('quick_fight_for_party', null, 'battle'),
            hotkeyClass: '',
            callback: function() {
                clb1();
                return true;
            }
        }, {
            txt: _t('fight_turn', null, 'battle'),
            hotkeyClass: '',
            callback: function() {
                clb2();
                return true;
            }
        }, {
            txt: _t('cancel'),
            hotkeyClass: 'alert-cancel-hotkey',
            callback: function() {
                // clb2();
                return true;
            }
        }]);
    };

    this.onResize = () => {
        if (!this.getShow()) return;



        updateBattleAreaData();

        if (this.scaleBattle) this.scaleBattle.manageBattleAreaPosition();

        if (this.battleEffectsController) this.battleEffectsController.getBattleBackgroundTintAction().onResize();

        this.warriors.updatePositions();

        if ($battleController && this.checkBattleControllerIsTooBig()) this.setPanelState(VERY_BIG_SIZE)

        if ($battleController) {
            let index = this.getIndexByNameIBattleControllerSize(actualStateSize);
            this.manageShowMore(index);
        }

        this.battleNight.rebuildBattleNight();
        Engine.characterEffectsBattleManager.onResize();
        //self.updateBattleAreaPos();

        //var bottom = $('.battle-controller').height();
        //var $battleArea = $('.battle-area', this.$);
        //
        //$('.battle-area', this.$).css({
        //	'bottom': bottom
        //});

        //var $bCon = Engine.interface.$iLayer.find('.battle-controller');
        //
        //$('.battle-area', self.$).css({
        //	//bottom: $bCon.height() - 30 + (this.$.height() - $bCon.height()) / 2
        //	bottom: $bCon.height()
        //});
        //this.updateBattleAreaPos()
    };

    this.updateBattleAreaPos = function() {
        var bHeight = $('body').height();
        var bottom;
        var minBody = 510;
        var b = 120;

        if (bHeight < minBody) bottom = b - (minBody - bHeight);
        else {
            if (bHeight < 540) bottom = b;
            else bottom = bHeight / 2 - 150;
        }
        $('.battle-area', self.$).css({
            bottom: bottom
        });
    };

    this.getYPosByLine = (y) => {
        if (this.zoomMode) return 384 - ((y - 3) * 35);
        else return 420 - ((y - 3) * 30);
    };

    this.doSkillAction = function(key) {
        var index = parseInt(key) - 1;
        if (self.showedSkills == null) return;
        if (!self.showedSkills[index]) return;
        //if (canUseSkill || canSendRequest) {
        if (canUseSkill) {
            canUseSkill = false;
            setTimeout(function() {
                canUseSkill = true;
            }, 300);
            var skill = self.showedSkills[index];
            var $skill = skill[0];
            var request = skill[1];
            var skillId = skill[2];

            self.callCheckCanFinishExternalTutorialUseBattleSkill(skillId);

            self.sendRequest($skill, request, skillId);
        }
    };

    this.hideInterfaceItems = function() {
        //$('.bottom-panel>.slots').css('display', 'none');
        //$('.skill-usable-slots').css('display', 'block');
        Engine.interface.get$interfaceLayer().find('.bottom-panel>.slots').css('display', 'none');
        Engine.interface.get$interfaceLayer().find('.skill-usable-slots').css('display', 'block');
        $battleController.find('.skill-usable-add-slots').css('display', 'block');
        if (Engine.hero.lvl > 299) {
            $('.end-game-overlay').removeClass('end-game-overlay');
        }
    };

    this.showInterfaceItems = function() {
        //$('.bottom-panel>.slots').css('display', 'block');
        //$('.skill-usable-slots').css('display', 'none');
        Engine.interface.get$interfaceLayer().find('.bottom-panel>.slots').css('display', 'block');
        Engine.interface.get$interfaceLayer().find('.skill-usable-slots').css('display', 'none');
        $battleController.find('.skill-usable-add-slots').css('display', 'none');
        Engine.interface.heroElements.checkAndSetEndGamePanel();
    };

    this.toggleBattlePanel = function() {
        self.setPanelState(actualStateSize);
    };

    this.setPanelState = (current) => {
        let index = this.getIndexByNameIBattleControllerSize(current);
        let newIndex = this.getNextIndexInBattleControllerSize(index);
        let newState = this.getNextStateByIndexInBattleControllerSize(index);

        this.setActualSize(newState);
        this['set' + newState + 'Size']();
        this.setBattleControllerPanelHeight(newIndex);
        // this.manageShowMore(newIndex);

        if (markWarrior && this.show) { //!self.show == only battle log
            let id = (markWarrior).toString();
            let w = this.warriorsList[id];
            this.showWarriorInfo(w);
        }

        BattleMessages.updateScroll();
        StorageFuncBattle.setBattlePanelState(newState);

        updateBattleAreaPosition();

        this.onResize();
    };

    this.getIndexByNameIBattleControllerSize = (name) => {
        for (let i = 0; i < battleControllerSize.length; i++) {
            if (battleControllerSize[i].name == name) return i;
        }
        console.error('[Battle.js, getIndexByNameIBattleControllerSize] NAME NOT EXIST:', name)
    };

    this.getNextIndexInBattleControllerSize = (currentIndex) => {
        currentIndex++;

        return battleControllerSize.length > currentIndex ? currentIndex : 0;
    };

    this.getNextStateByIndexInBattleControllerSize = (currentIndex) => {
        let nextIndex = this.getNextIndexInBattleControllerSize(currentIndex);

        return battleControllerSize[nextIndex].name;
    };

    this.getBattleControllerSize = (index) => {
        return battleControllerSize[index].height;
    };

    this.setBattleControllerPanelHeight = (index) => {
        let height = this.getBattleControllerSize(index);
        $battleController.height(height + 'px');
    };

    this.checkBattleControllerIsTooBig = (nextState) => {

        if (actualStateSize == SMALL_SIZE) return false;
        if (!nextState)
            if (actualStateSize == NORMAL_SIZE) return false;

        let index = this.getIndexByNameIBattleControllerSize(actualStateSize);
        if (nextState) index = this.getNextIndexInBattleControllerSize(index);
        let bCSHeight = this.getBattleControllerSize(index);

        let zoom = Engine.zoomFactor;
        let margin = $battleController.hasClass('with-skills') ? 0 : 15;
        let hBattleController = zoom * bCSHeight - margin;
        let hBottomBar = zoom * Engine.interface.getBottomPositioner().height();
        //let hWindow             = window.innerHeight ;
        let hInterfaceLayer = zoom * Engine.interface.get$InterfaceLayerHeight();

        return hBattleController + hBottomBar > hInterfaceLayer * 0.5
    };

    const isAdditionalSkillsVisible = () => {
        return addSkillBarVisible;
    }

    this.setbigSize = function() {
        $battleController.find('.left-column').css('display', 'block');
        $battleController.find('.right-column').css('display', 'block');
        $battleController.find('.buffs-wrapper').css('display', 'block');
        $battleController.find('.buttons-wrapper').css('display', 'block');
        $battleController.find('.buffs-wrapper').css('display', 'block');
    };
    this.setveryBigSize = function() {
        $battleController.find('.left-column').css('display', 'block');
        $battleController.find('.right-column').css('display', 'block');
        $battleController.find('.buffs-wrapper').css('display', 'block');
        $battleController.find('.buttons-wrapper').css('display', 'block');
        $battleController.find('.buffs-wrapper').css('display', 'block');
    };

    this.setnormalSize = function() {
        $battleController.find('.left-column').css('display', 'block');
        $battleController.find('.right-column').css('display', 'block');
        $battleController.find('.buffs-wrapper').css('display', 'block');
        $battleController.find('.buttons-wrapper').css('display', 'block');
        $battleController.find('.buffs-wrapper').css('display', 'none');
    };

    this.setsmallSize = function() {
        $battleController.find('.left-column').css('display', 'none');
        $battleController.find('.right-column').css('display', 'none');
        $battleController.find('.buffs-wrapper').css('display', 'none');
        $battleController.find('.buttons-wrapper').css('display', 'block');
        $battleController.find('.buffs-wrapper').css('display', 'none');
    };

    this.updateHeroOutfit = () => {
        if (this.show) Engine.battle.getWarrior(Engine.hero.d.id).updateIcon();
    }

    this.closeOtherWindows = () => {
        const v = Engine.windowsData.windowCloseConfig.BATTLE;
        Engine.windowCloseManager.callWindowCloseConfig(v)
    }

    //this.init();

};