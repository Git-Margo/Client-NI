/**
 * Created by Michnik on 2015-08-18.
 */
var Tpl = require('core/Templates');
var Parser = require('core/skills/SkillsParser');
var MBattleEditor = require('core/skills/MBattleEditor');
var SkillTip = require('core/skills/SkillTip');
var SkillsData = require('core/skills/SkillsData');
const Slider = require('../components/Slider');
//var Interface = require('core/Interface');
module.exports = function() {
    var self = this;
    var $content; // = Tpl.get('skills-window');
    var $additionalHotKeys; // = Tpl.get('additional-skill-panel');
    //var $bottomPanel = $('.bottom-panel');
    var $bottomPanel; // = Engine.interface.$iLayer.find('.bottom-panel');
    var allSkillsData = null;
    var skills = {};
    var basicSkills = {};
    var groupedSkills = {};
    var lastSkill = null;
    var changeLvl = false;
    var sliderLvl = null;
    var activeSkills = null;
    var eqDragOpts1 = null;
    var eqDragOpts2 = null;
    var $delSkillMiddleLayer = null;
    var $delSkillLefLayer = null;
    var $delSkillRightLayer = null;
    var timeInterval = null;
    var freeSkills = false;

    this.init = function() {
        $content = Tpl.get('skills-window');
        $additionalHotKeys = Tpl.get('additional-skill-panel');
        $bottomPanel = Engine.interface.get$interfaceLayer().find('.bottom-panel');
        this.createWindow();
        this.hideInterfaceItems();
        this.initAdditionalHotKeys();
        this.initBasicSkills();
        this.initEqDragOpts();
        this.initDroppable();
        this.initMBattleWrapper();
    };

    this.getOneStepSkillId = () => {
        return 'skill_' + SkillsData.specificSkills.ONE_STEP_ID;
    }

    this.getNormalAttackSkillId = () => {
        return 'skill_' + SkillsData.specificSkills.NORMAL_ATTACK_ID;
    }

    this.initMBattleWrapper = function() {
        let $but = Tpl.get('button').addClass('small green');
        $but.find('.label').html(_t('edit'));
        self.wnd.$.find('.MB-button').append($but);
        $but.click(function() {
            _g('skills&battleaction=show');
        });

        this.createResetButton(self.wnd.$.find('.bottom-right'));
    };

    this.getSkills = function() {
        return skills;
    };

    this.getGroupedSkills = function() {
        return groupedSkills;
    };

    this.getBasicSkills = function() {
        return basicSkills;
    };

    this.getActiveSkills = function() {
        return activeSkills;
    };

    this.initAdditionalHotKeys = function() {
        //$('.bottom-panel').prepend($additionalHotKeys);
        Engine.interface.get$interfaceLayer().find('.bottom-panel').prepend($additionalHotKeys);
    };

    this.hideInterfaceItems = function() {
        //$('.bottom-panel>.slots').css('display', 'none');
        //$('.skill-usable-slots').css('display', 'block');
        Engine.interface.get$interfaceLayer().find('.bottom-panel>.slots').css('display', 'none');
        Engine.interface.get$interfaceLayer().find('.skill-usable-slots').css('display', 'block');
        if (Engine.hero.lvl > 299) {
            $('.end-game-overlay').removeClass('end-game-overlay');
        }
    };

    this.showInterfaceItems = function() {
        //$('.bottom-panel>.slots').css('display', 'block');
        //$('.skill-usable-slots').css('display', 'none');
        Engine.interface.get$interfaceLayer().find('.bottom-panel>.slots').css('display', 'block');
        Engine.interface.get$interfaceLayer().find('.skill-usable-slots').css('display', 'none');
        Engine.interface.heroElements.checkAndSetEndGamePanel();
    };

    this.initDroppable = function() {
        for (var i = 0; i < 16; i++) {
            $bottomPanel.find('[slot=' + i + ']').droppable({
                drop: function(e, ui) {
                    if (!ui.helper.hasClass('battle-skill')) return;
                    self.dropSkillOnQuickBar(ui, $(this));
                }
            });
        }

        //$delSkillMiddleLayer = $('<div>').addClass('del-skill-middle-layer');
        //$delSkillLefLayer = $('<div>').addClass('del-skill-left-layer');
        //$delSkillRightLayer = $('<div>').addClass('del-skill-right-layer');

        $delSkillMiddleLayer = Tpl.get('del-skill-middle-layer');
        $delSkillLefLayer = Tpl.get('del-skill-left-layer');
        $delSkillRightLayer = Tpl.get('del-skill-right-layer');


        //$('.game-layer').prepend([$delSkillRightLayer, $delSkillLefLayer, $delSkillMiddleLayer]);
        Engine.interface.get$gameLayer().prepend([$delSkillRightLayer, $delSkillLefLayer, $delSkillMiddleLayer]);

        $delSkillRightLayer.add($delSkillLefLayer).add($delSkillMiddleLayer).droppable({
            drop: function(e, ui) {
                var $obj = ui.helper;
                if (!$obj.hasClass('battle-skill') || $obj.hasClass('first-drag')) return;
                self.deleteSkillDropOnMap(ui.helper.attr('hot-skill-id'));
            }
        });
    };

    this.dropSkillOnQuickBar = function(obj, slot) {
        var $newSkill = obj.helper.clone();
        //var newSkillStrId = $newSkill.attr('hot-skill-id');
        var newSkillIntId = self.parseId($newSkill.attr('hot-skill-id'));
        var oldSkillStrId = slot.find('.battle-skill').attr('hot-skill-id');
        var array = Engine.skills.getActiveSkills(); //range problem
        var changePlaceTwoSkils = false;


        if (oldSkillStrId) { //w tym slocie jest juz skill, wiec usuwamy
            var index = array.indexOf(self.parseId(oldSkillStrId));
            if ($newSkill.hasClass('first-drag')) {
                //array[index] = 0;
                return message(_t('place_is_not_empty'));
            } else {
                var oldIndexNewSkill = array.indexOf(newSkillIntId);
                changePlaceTwoSkils = true;
                array[index] = 0;
                array[oldIndexNewSkill] = self.parseId(oldSkillStrId);
            }
        }
        if (!changePlaceTwoSkils) {
            var oldIndexNewSkill = array.indexOf(newSkillIntId); //upuszczany skill byï¿½ juï¿½ w barze wiec trzeusunac
            if (oldIndexNewSkill > -1) array[oldIndexNewSkill] = 0;
        }

        var newIndexNewSkill = slot.attr('slot');
        array[newIndexNewSkill] = newSkillIntId;
        _g('skills&selectedskills=' + array);
    };

    this.deleteSkillDropOnMap = function(strId) {
        var array = Engine.skills.getActiveSkills();
        var index = array.indexOf(self.parseId(strId));
        if (index > -1) array[index] = 0;
        else return;
        var ids = array.join();
        _g('skills&selectedskills=' + ids);
    };

    this.parseId = function(strId) {
        return parseInt(strId.replace('skill_', ''));
    };

    this.tLang = function(name, param) {
        param = param || null;
        return _t(name, param, 'skills');
    };

    this.createHotSkill = function(objToCLone) {
        var $skilBck = objToCLone.find('.skill-background').clone();
        //var $bck = $('<div>').addClass('background');
        var $bck = Tpl.get('skill-background-tpl');
        var strId = objToCLone.attr('id');
        //var $skill = $('<div>').addClass('battle-skill');
        var $skill = Tpl.get('battle-skill-in-skill-panel');
        $skill.removeClass('first-drag');
        $skill.attr('hot-skill-id', strId);
        $skilBck.removeClass('skill-background').addClass('icon');
        self.getTipSkill(strId, $skill);
        return $skill.append([$bck, $skilBck]);
    };

    this.getTipSkill = function(strId, hotSkill) {
        var o1 = Engine.skills.getSkills()[strId];
        var o2 = Engine.skills.getBasicSkills()[strId];
        var o = o1 ? o1 : o2;
        //hotSkill.tip(o.name);
        SkillTip.setSkillTip(hotSkill, o);
    };

    this.initEqDragOpts = function() {
        eqDragOpts1 = {
            helper: function() {
                var $obj = self.createHotSkill($(this));
                $obj.addClass('first-drag');
                return $obj;
            },
            distance: 10,
            appendTo: 'body',
            cursorAt: {
                top: 16,
                left: 16
            },
            //containment: 'body',
            scroll: false,
            zIndex: 20
        };

        //setCursorAtInDraggable(16, 16, eqDragOpts1);

        eqDragOpts2 = {
            helper: 'clone',
            distance: 10,
            appendTo: 'body',
            cursorAt: {
                top: 16,
                left: 16
            },
            //containment: 'body',
            scroll: false,
            zIndex: 20
        }

        //setCursorAtInDraggable(16, 16, eqDragOpts2);
    };

    this.initBasicSkills = function() {
        basicSkills = {
            // 'skill_-1': {
            [self.getNormalAttackSkillId()]: {
                'id': SkillsData.specificSkills.NORMAL_ATTACK_ID,
                'name': self.tLang('normal_atack'),
                'type': 'active',
                'cLvl': '1',
                'mLvl': '1',
                'lvl': '1/1',
                // 'stats': 'norm-atack=1',
                'kind': 'unav',
                'desc': self.tLang('atack_desc'),
                'basic': '',
                'regs': 'lvl=1',
                'currentStatsIndex': 0,
                allStats: ['norm-atack=1'],
            },
            // 'skill_-2': {
            [self.getOneStepSkillId()]: {
                'id': SkillsData.specificSkills.ONE_STEP_ID,
                'name': self.tLang('step'),
                'type': 'active',
                'cLvl': '1',
                'mLvl': '1',
                'lvl': '1/1',
                // 'stats': 'step=1',
                'kind': 'unav',
                'desc': self.tLang('step_desc'),
                'basic': '',
                'regs': 'lvl=1',
                'currentStatsIndex': 0,
                allStats: ['step=1']
            }
        }
    };

    this.createWindow = function() {
        //this.wnd = new Wnd({
        //	title: self.tLang('skills_title'),
        //	content: $content,
        //	onclose: function () {
        //		self.close();
        //	}
        //});


        Engine.windowManager.add({
            content: $content,
            title: self.tLang('skills_title'),
            //nameWindow        : 'skills',
            nameWindow: Engine.windowsData.name.SKILLS,
            widget: Engine.widgetsData.name.SKILLS,
            objParent: this,
            nameRefInParent: 'wnd',
            startVH: 60,
            cssVH: 60,
            onclose: () => {
                this.close();
            }
        });


        //$('.alerts-layer').append(this.wnd.$);
        this.wnd.show();
        this.wnd.addToAlertLayer();
        //this.onResize();
        $('.skills-wrapper', $content).addScrollBar({
            track: true
        });
        $('.info-description', $content).addScrollBar({
            track: true
        });
        //this.wnd.$.show();
        this.wnd.center();
    };

    this.initVariable = function() {
        for (var i = 1; i <= 8; i++) {
            groupedSkills[i] = {
                skills: [],
                points: 0,
                requiredLvl: 0
            }
        }
    };

    this.refreshBMButton = function() {
        let $b = self.wnd.$.find('.MB-wrapper').find('.button');
        let $l = self.wnd.$.find('.MB-label-1');
        if (Engine.hero.d.lvl < 25) {
            $b.addClass('disable');
            $l.css('display', 'inline-block');
        } else {
            $b.removeClass('disable');
            $l.css('display', 'none');
        }
    };

    //id, name, attr, grp, xy, desc, reqs, lvl, stats, kind
    this.update = function(v, allData) {
        if (isset(this.MBEditor)) {
            this.MBEditor.update(v);
            return;
        }
        self.refreshBMButton();

        if (isset(allData.skill_data)) {
            allSkillsData = allData.skill_data;
        }

        // if (!this.wnd) this.createWindow();
        //this.initVariable();
        groupedSkills = {};

        // for (var i = 0; i < v.length; i += 10) {
        // 	skills['skill_' + v[i]] = {
        // 		id: v[i],
        // 		name: v[i + 1],
        // 		attr: v[i + 2],
        // 		grp: v[i + 3],
        // 		xy: v[i + 4],
        // 		desc: v[i + 5],
        // 		regs: v[i + 6],
        // 		lvl: v[i + 7],
        // 		stats: v[i + 8],
        // 		kind: v[i + 9],
        // 		type: (v[i + 2] & 1 ? 'active' : 'passive'),
        // 		cLvl: v[i + 7].split('/')[0], // current lvl
        // 		mLvl: v[i + 7].split('/')[1]  // max lvl
        // 	};
        // 	var index = v[i + 3] % 8;
        // 	this.checkIndexExist(index);
        // 	groupedSkills[index].points += parseInt(skills['skill_' + v[i]].cLvl);
        // 	groupedSkills[index].skills.push({slug: `skill_${v[i]}`, sort: parseInt(skills['skill_' + v[i]].xy)});
        // 	this.setRequiredLvl((v[i + 9] + '|' + v[i + 6]), index);
        // }

        for (let [id, skill] of Object.entries(allSkillsData)) {
            const {
                name,
                attr,
                xy,
                desc,
                pos,
                maxLvl,
                reqs,
                stats
            } = skill;
            const cLvl = v[id].lvl;
            const currentStatsIndex = cLvl > 0 ? cLvl - 1 : cLvl;
            const kind = v[id].isLearnable ? reqs + '|' + stats[cLvl] : 'unav';
            const _reqs = reqs;
            const _stats = stats[currentStatsIndex];

            skills['skill_' + id] = {
                id,
                name,
                attr,
                grp: pos,
                xy,
                desc,
                regs: _reqs,
                lvl: v[id].lvl + '/' + maxLvl,
                // stats: _stats,
                kind,
                type: (attr & 1 ? 'active' : 'passive'),
                cLvl: v[id].lvl,
                mLvl: maxLvl,
                currentStatsIndex,
                allStats: stats
            };

            var index = pos % 8;
            this.checkIndexExist(index);
            groupedSkills[index].points += skills['skill_' + id].cLvl;
            groupedSkills[index].skills.push({
                slug: `skill_${id}`,
                sort: skills['skill_' + id].xy
            });
            this.setRequiredLvl((kind + '|' + _reqs), index);
        }

        this.sortGroupedSkills();

        this.fillLeftColumn();
        this.fillRightColumn();
        $('.skills-wrapper', $content).trigger('update');
        $('.info-description', $content).trigger('update');
    };

    this.sortGroupedSkills = function() {
        for (let i in groupedSkills) {
            groupedSkills[i].skills.sort((a, b) => (a.sort > b.sort) ? 1 : -1)
        }
    };

    this.updateFreeSkills = function(time) {
        var $timer = self.wnd.$.find('.free-skills-label');
        if (time < 1) return $timer.css('display', 'none');
        $timer.css('display', 'block');
        self.wnd.$.find('.cost-value').addClass('cost-value-crossed');
        freeSkills = true;
        var t = time - unix_time();
        $timer.html(_t('free_skills') + getSecondLeft(t, {
            short: true
        }));
        if (timeInterval) self.clearTimeInterval();
        timeInterval = setInterval(function() {
            $timer.html(_t('free_skills') + getSecondLeft(t, {
                short: true
            }));
            if (t < 1 && timeInterval) {
                self.clearTimeInterval();
                self.wnd.$.find('.cost-value').removeClass('cost-value-crossed');
                $timer.css('display', 'none');
                freeSkills = false;
            }
            t--;
        }, 1000);
    };

    this.clearTimeInterval = function() {
        clearInterval(timeInterval);
        timeInterval = null;
    };

    this.checkIndexExist = function(index) {
        if (isset(groupedSkills[index])) return;
        groupedSkills[index] = {
            skills: [],
            points: 0,
            requiredLvl: 0
        }
    };

    this.createLastOpenSkill = function() {
        if (!lastSkill) return;
        self.wnd.$.find('#' + lastSkill).addClass('chosen');
        this.showSkill(lastSkill);
    };

    this.getSumOfPoints = function(to) {
        var sum = 0;
        for (var i = 1; i < to; i++)
            sum += groupedSkills[i].points;
        return sum;
    };

    this.setRequiredLvl = function(from, to) {
        var split = from.split('|');
        var fsplitted = null; // first split
        var ssplitted = null; // second split
        for (var i in split) {
            fsplitted = split[i].split(';');
            for (var j in fsplitted) {
                ssplitted = fsplitted[j].split('=');
                if (ssplitted[0] == 'lvl')
                    groupedSkills[to].requiredLvl = ssplitted[1];
            }
        }
    };

    this.createBasicSkills = function($tab) {
        //var $div = $('<div/>').addClass('description-wrapper').html(self.tLang('basicSkills'));
        var $div = Tpl.get('skills-description-wrapper').html(self.tLang('basicSkills'));
        $tab.push($div);
        // var atackId = 'skill_-1';
        // var stepId = 'skill_-2';
        var atackId = self.getNormalAttackSkillId()
        var stepId = self.getOneStepSkillId();
        var atack = this.createBasicSkill(atackId, basicSkills[atackId]);
        var step = this.createBasicSkill(stepId, basicSkills[stepId]);

        atack.draggable(eqDragOpts1);
        step.draggable(eqDragOpts1);
        $tab.push(atack);
        $tab.push(step);
    };

    this.fillLeftColumn = function() {
        var $sPane = $content.find('.skills-wrapper > .scroll-pane');
        var $tab = [];
        var clickable = true; // first skill's can by clickable
        var hLvl = Engine.hero.d.lvl; // hero's lvl
        var cSkills = null; //current skills
        var $skill = null;
        var points = 0;
        //var $firstDescription = $('<div/>', {
        //	class: 'description-wrapper',
        //	html: self.tLang('skill_req_desc')
        //});

        var $firstDescription = Tpl.get('skills-description-wrapper').html(self.tLang('skill_req_desc'));

        this.createBasicSkills($tab);
        $tab.push($firstDescription);
        for (var i in groupedSkills) {
            cSkills = groupedSkills[i];
            points = self.getSumOfPoints(i);
            clickable = ((hLvl >= cSkills.requiredLvl && points >= cSkills.requiredLvl - 25));
            if (i > 1) $tab.push(self.getDescription(cSkills.requiredLvl));
            for (var j in cSkills.skills) {
                // clickable = !this.checkIsUnav(cSkills.skills[j].slug) && clickable;
                $skill = self.createSkill(cSkills.skills[j].slug, clickable);
                var id = cSkills.skills[j].slug;
                if (skills[id]['type'] == 'active' && skills[id].cLvl > 0) $skill.draggable(eqDragOpts1);
                $tab.push($skill);
            }
        }

        $sPane.html($tab);
        $('.skill.clickable').on('mouseup', this.skillOnClick);
    };

    this.skillOnClick = (e) => {
        const $target = $(e.currentTarget);
        this.wnd.$.find('.empty').css('display', 'none');
        this.showSkill($target.attr('id'), $target.hasClass('disabled'));
        $('.skill').removeClass('chosen');
        $target.addClass('chosen');
    };

    this.checkIsUnav = function(id) {
        return skills[id].kind === 'unav';
    };

    this.getDescription = function(lvl) {
        //return $('<div/>', {
        //	'class': 'description-wrapper',
        //	'html': self.tLang('skill_req_desc_new %lvl% %points%', {
        //		'%lvl%': lvl,
        //		'%points%': lvl - 25
        //	})
        //});
        var str = self.tLang('skill_req_desc_new %lvl% %points%', {
            '%lvl%': lvl,
            '%points%': lvl - 25
        });
        return Tpl.get('skills-description-wrapper').html(str);
    };

    this.updateSkillsLearnt = function(v) {
        $content.find('.right-column').find('.skills-points').html(v + '/' + Math.max(0, Engine.hero.d.lvl - 24));
    };

    this.fillRightColumn = function() {
        $content.find('.right-column').find('.description-wrapper').html('');
    };

    this.createResetButton = function($wrapper) {
        var cost = 50;
        var $resetBtn = Tpl.get('button').addClass('purple small');
        //var langConst = _l() == 'pl' ? round(cost, 10) : 0;
        var langConst = round(cost, 10);
        var $reset = $('<span/>', {
            'class': 'reset',
            html: self.tLang('reset_btn') + ': ' + langConst
        });
        var $costSpan = $('<span/>').addClass('small-draconite');

        $resetBtn.find('.label').html([$reset, $costSpan]);
        $resetBtn.click(function() {
            _g('skills&reset=1');
        });
        $wrapper.html($resetBtn);
    };

    this.initBattleEditor = function() {
        if (!isset(self.MBEditor)) {
            self.MBEditor = new MBattleEditor($content, self);
            self.MBEditor.init();
        }
        //_g('skills');
    };

    this.getEditListBtn = function() {
        var $btn = Tpl.get('button').addClass('green small skills-queue');
        $btn.find('.label').html(self.tLang('edit_list'));
        $btn.click(this.initBattleEditor);
        return $btn;
    };

    this.showSkill = function(id, withoutBtn) {
        lastSkill = id;
        var basicSkill = !isset(skills[id]);
        var skill = basicSkill ? basicSkills[id] : skills[id];
        var $skill = basicSkill ? this.createBasicSkill(id) : this.createSkill(id, true);
        var $innerContent = Tpl.get('skill-description');
        var $buyBtn = Tpl.get('button').addClass(withoutBtn ? 'black small' : 'green small');
        var $description = $innerContent.find('.description');
        var $skillSliderWrapper = $innerContent.find('.skill-slider');

        if ($content.find(`.left-column #${id} .active`).hasClass('quick-skill')) {
            $skill.find('.active').addClass('quick-skill').tip(_t('skill-icon-active'));
        }

        $skill.tip('');

        self.createLearnButton($buyBtn);

        $content.find('.right-column').find('.description-wrapper').html($innerContent);
        self.createSkillSlider($skillSliderWrapper, skill, withoutBtn);
        self.createCost(withoutBtn ? 0 : 1);

        $description.html(skill.desc);
        $innerContent.find('.icon-wrapper').html($skill);
        $innerContent.find('.name').html(skill.name);
        if (!basicSkill) $content.find('.skill-learn-btn').html($buyBtn);
        let _skills = skills[id] ? skills : basicSkills
        this.showStats(SkillTip.getStats(skill), skill.cLvl);

        if (withoutBtn && !basicSkill) {
            if (!basicSkill) $content.find('.skill-learn-btn > .button').removeClass('green').addClass('black');
        } else {
            if (skill.cLvl != skill.mLvl) {
                this.addClickAction($buyBtn, $innerContent, id);
            } else {
                $innerContent.find('.skill-learn').css('display', 'none');
            }
        }

        //if (id == 'skill_106' && skill.cLvl > 0) {
        //	var $btn = this.getEditListBtn();
        //	$innerContent.find('.action-buttons-wrapper').append($btn);
        //	$innerContent.find('.requirements-wrapper').css('display', 'none');
        //} else {
        //	this.showRegs(id);
        //}

        this.showRegs(id);

        $('.info-description', $content).trigger('update');
    };

    this.updateStats = (skill, lvl) => {
        this.showStats(SkillTip.getStats(skill, lvl), skill.cLvl);
    }

    this.createCost = (countSkillsToLearn = 1) => {
        const cost = Math.floor(Math.pow(Engine.hero.d.lvl, 1.9)) * countSkillsToLearn;
        const enoughGold = Engine.hero.d.gold >= cost;
        const costTxt = round(cost, 1);
        const allClasses = 'cost-value' + (freeSkills ? ' cost-value-crossed' : !enoughGold ? ' cost-value-red' : '');
        const $cost = $(`<span class="${allClasses}">${costTxt}</span>`)
        $content.find('.skill-learn-price .price').html($cost);
    }

    this.createLearnButton = function($buyBtn) {
        $buyBtn.find('.label').text(self.tLang('learn_btn'));
    };

    this.addClickAction = function($btn, $iContent, id) {
        var stats = null;
        var skillId = id.split('_').pop();
        changeLvl = false;

        $btn.on('click', function() {
            if (changeLvl) return false;
            changeLvl = true;
            _g('skills&learn=' + skillId + '&lvl=' + sliderLvl, (v) => changeLvl = false);
        });
        if (skills[id].kind) {
            let _skills = skills[id] ? skills : basicSkills
            stats = SkillTip.getStats(skills[id]);
            $iContent.find('.next-level-wrapper').click(function() {
                self.showStats(stats, skills[id].cLvl);
            });
        }
    };

    // this.getStats = function (id) {
    // 	var stats = null;
    // 	var sk = skills[id] ? skills[id] : basicSkills[id];
    // 	var splitted = sk['kind'].split('|');
    // 	if (splitted[0] == 'unav') {
    // 		stats = sk['stats'] + '&' + splitted[1] + ';' + splitted[2];
    // 	} else {
    // 		stats = sk['stats'] + '&' + splitted[0] + ';' + splitted[1];
    // 	}
    // 	if (splitted.length == 1) {
    // 		stats = sk['stats'] + '&' + sk['stats'];
    // 	}
    // 	return stats;
    // };

    this.showStats = function(stats, lvl) {
        var $statsContent = this.wnd.$.find('.all-stats');
        $statsContent.html(Parser.getStats(stats, lvl));
    };

    this.showRegs = function(id) {
        var tips = Engine.battle.getIconTips();
        var $reqWrapper = $content.find('.requirements-wrapper');
        var $iconWrapper = $content.find('.requirements-wrapper > .icons');
        var skill = skills[id] ? skills[id] : basicSkills[id];
        var regs = null;
        var tmp = null;

        if (!skill.regs) {
            tmp = skill['kind'].split('|')[0];
            regs = Parser.getRegs(tmp)
        } else {
            regs = Parser.getRegs(skill.regs)
        }

        if (regs.length) {
            $iconWrapper.html(regs);
            $('.cl-icon', $iconWrapper).each(function() {
                const $target = $(this);
                var data = $(this).data('icon');
                data = data == 'icon-21' ? $(this).data('arrows') : tips[data];
                // $(this).tip(data);
                $target.html('- ' + data)
                $target.removeAttr('class');
                $target.addClass('text');
            });
        } else {
            $iconWrapper.html('<span>' + _t('depo_missing', null, 'depo') + '<span>');
        }

    };

    this.createSkillSlider = ($skillSliderWrapper, skill, disabled = false) => {
        const min = 0;
        const max = Number(skill.mLvl);
        const value = !disabled ? Number(skill.cLvl) + 1 : 0;

        const slider = new Slider.default({
            min,
            max,
            value,
            ...(disabled ? {
                disabled
            } : {}),
            showValue: true,
            blockValueBelowCurrent: true,
            onUpdate: (value) => {
                this.sliderUpdate(value, Number(skill.cLvl))
            }
        })
        $skillSliderWrapper.append($(slider.getElement()))
        sliderLvl = value;
    }

    this.sliderUpdate = (value, currentLvl, skill) => {
        sliderLvl = value;
        this.createCost(value - currentLvl);
        this.updateStats(skills[lastSkill], sliderLvl);
    }

    // this.setSkillTip = (skillId, $skill) => {
    //
    // 	let sections = Parser.getSections(skillId)
    // 	console.log(sections);
    // 	let text = this.getSkillTextBySectionsData(sections);
    //
    // 	console.log(text);
    //
    // 	if ($skill)$skill.tip(text.join())
    // };
    //
    // this.changeIconRegToTextReg = (text) => {
    // 	let iconTips = Engine.battle.getIconTips()
    // 	for (let k in iconTips) {
    // 		if (text.search(k) > -1) return '<span class="weapon-require">' + iconTips[k] + '</span>'
    // 	}
    //
    // 	return text
    // }
    //
    // this.getSkillTextBySectionsData = (sections) => {
    // 	let text = [];
    // 	for (let k in sections.attr) {
    // 		let oneSection = sections.attr[k];
    // 		if (!oneSection.length) continue;
    // 		for (let kk in oneSection) {
    // 			text.push(oneSection[kk])
    // 		}
    // 		text.push('<div class="line"></div>')
    // 	}
    // 	if (sections.regs.length) {
    // 		text.push('<div>' + _t('lower_requirements', null, 'skills') + '</div>')
    // 		for (let kk in sections.regs) {
    // 			text.push(sections.regs[kk])
    // 		}
    // 		text.push('<div class="line"></div>')
    // 	}
    //
    // 	if (sections.cost.length) {
    // 		text.push(sections.cost[0])
    // 	}
    //
    // 	if (sections.level) {
    // 		text.push(sections.level)
    // 	}
    //
    // 	return text;
    // }

    this.debugRefreshTip = () => {
        const skills = Engine.skills.getSkills();
        for (skill in skills) {
            const $skill = $(`#${skill}`);
            SkillTip.setSkillTip($skill.find('.skill-tip'), skills[skill]);
        }
    }

    this.createSkill = function(id, clickable, notif) {
        var $skill = Tpl.get('skill').attr('id', id);
        var cssID = id.split('_').pop();
        var skill = skills[id] ? skills[id] : basicSkills[id];
        var color = this.skillLvlColor(skill);
        var type = this.skillType(skill, id);
        $skill.addClass(!clickable ? 'disabled clickable' : 'clickable');
        $skill.find('.skill-background').addClass('skill-icon ' + _l() + ' icon-' + cssID);
        $skill.find('.label-wrapper label').html(skill.lvl);
        $skill.find('.label-wrapper').addClass(color);

        SkillTip.setSkillTip($skill.find('.skill-tip'), skill);
        // $skill.tip(skill.name);
        $skill.addClass(type);
        if (type === 'active') {
            $skill.find('.active').tip(_t('skill-icon-unactive'));
        }
        if (notif) {
            var stats = Parser.getObjStats(skill.allStats[skill.currentStatsIndex]);
            if (isset(stats.mana)) self.addNotif($skill, 'mana', stats.mana);
            if (isset(stats.energy)) self.addNotif($skill, 'energy', stats.energy);
        }
        return $skill;
    };

    this.addNotif = function($skill, kind, value) {
        //var $notif = $('<div>').html(value).addClass('notif ' + kind);
        var $notif = Tpl.get('skills-notif').html(value).addClass(kind);
        $skill.append($notif);
    };

    // this.createBasicSkill = function (strId, name) {
    this.createBasicSkill = function(strId, skillData) {
        var $skill = Tpl.get('skill').attr('id', strId);
        var id = strId.replace('skill_', '');
        $skill.addClass('clickable');
        $skill.find('.skill-background').addClass('skill-icon ' + _l() + ' icon-' + id); //0 step, 2-atack
        $skill.find('.label-wrapper label').html('1/1');
        $skill.find('.label-wrapper').addClass('cl-6');
        // if (name) $skill.tip(name);

        if (skillData) SkillTip.setSkillTip($skill.find('.skill-tip'), skillData);
        $skill.addClass('active');
        return $skill;
    };

    this.skillType = function(skill, id) {
        return skill.type; // == 'passive' ? return 'passive';
    };

    this.updateSelectedSkills = function(data) {
        activeSkills = [];
        $bottomPanel.find('.skill-usable-slot').empty();
        if (Engine.skills.MBEditor) return;
        for (var i = 0; i < data.length; i++) {
            var id = data[i];
            if (id == 0) {
                activeSkills[i] = 0;
                continue;
            }
            var skillInSkillPanel = this.wnd.$.find('#skill_' + id);
            var $hotSkill = self.createHotSkill(skillInSkillPanel);
            skillInSkillPanel.find('.active').addClass('quick-skill').tip(_t('skill-icon-active'));
            $hotSkill.draggable(eqDragOpts2);
            activeSkills[i] = id;
            $('.bottom-panel').find("[slot= " + i + "]").append($hotSkill);
        }
        this.createLastOpenSkill();
    };

    this.skillLvlColor = function(skill) {
        var skillLvl = parseInt(skill.lvl.split('/')[0]);
        var cl = 'chosen';
        switch (skillLvl) {
            case 0:
                cl = '';
                break;
            case 1:
            case 2:
                cl += ' cl-1';
                break;
            case 3:
            case 4:
                cl += ' cl-2';
                break;
            case 5:
            case 6:
                cl += ' cl-3';
                break;
            case 7:
            case 8:
                cl += ' cl-4';
                break;
            case 9:
                cl += ' cl-5';
                break;
            case 10:
                cl += ' cl-6';
                break;
        }
        return cl;
    };

    this.removeEditor = function(fn) {
        delete self.MBEditor;
        _g('skillshop', fn);
    };

    this.close = function() {
        self.showInterfaceItems();
        $additionalHotKeys.remove();
        $delSkillMiddleLayer.remove();
        $delSkillLefLayer.remove();
        $delSkillRightLayer.remove();
        Engine.skills = false;
        //self.wnd.$.remove();
        //delete (self.wnd);
        self.wnd.remove();
        //delete(self);
    };

    //this.init();

};