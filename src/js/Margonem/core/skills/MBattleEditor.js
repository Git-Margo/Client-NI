/**
 * Created by Michnik on 2015-09-24.
 */
var Tpl = require('@core/Templates');
const {
    getIconClose
} = require('@core/HelpersTS');
module.exports = function($content, Parent) {
    var self = this;
    var skillsLimit = 0;
    var list = [];
    var repeat = 0;
    var current = 0;
    var cost;
    var SkillsData = require('@core/skills/SkillsData');

    this.init = function() {
        self.changeScrollWrapperPos(76);
        self.fillLeftColumn();
        Parent.wnd.$.find('.MB-wrapper').css('display', 'none');
        Parent.wnd.$.find('.empty').css('display', 'none');
        Parent.wnd.$.find('.edit-header-label').text(_t('mbattle'));
    };

    this.changeScrollWrapperPos = function(pos) {
        Parent.wnd.$.find('.right-column').find('.scroll-wrapper').css('top', pos + 'px');
    };

    this.getButton = function(cssClass, html) {
        var $btn = Tpl.get('button').addClass(cssClass);
        $btn.find('.label').html(Parent.tLang(html));
        return $btn;
    };

    this.fillLeftColumn = function() {
        var $sPane = $content.find('.skills-wrapper > .scroll-pane');
        var $tab = [];
        var $skill = null;

        $tab.push($('<div/>', {
            class: 'description-wrapper',
            html: Parent.tLang('mb_add_to_list_desc')
        }));

        // $tab.push(Parent.createSkill('skill_-1', true));
        // $tab.push(Parent.createSkill('skill_-2', true));

        $tab.push(Parent.createSkill(Engine.skills.getNormalAttackSkillId(), true));
        $tab.push(Parent.createSkill(Engine.skills.getOneStepSkillId(), true));

        let skills = Engine.skills.getSkills();
        for (var i in skills) {
            let ignore = i == 'skill_106' || skills[i].type == 'passive' || skills[i].cLvl == 0;
            if (ignore) continue;
            $skill = Parent.createSkill(i, true, true);
            $tab.push($skill);
        }

        $sPane.html($tab);
        $('.skill.clickable').click(function() {
            if (current == 0) return mAlert(_t('bm_need_buy'));
            if (list.length > skillsLimit - 1) return mAlert(_t('bm_limit_reached', null, 'skills'));

            var id = $(this).attr('id').split('_').pop();

            var newId = id;
            list.push(newId);
            self.save();
        });
    };

    this.fillRightColumn = function() {
        var $innerContent = Tpl.get('MBEditor');
        var $clear = this.getButton('small green', 'clear-list');
        var $save = this.getButton('small green', 'save-btn');
        var $rightColumn = $content.find('.right-column');

        $('.description-wrapper', $rightColumn).html($innerContent);

        let firstDisable = true;
        var $list = [];
        var $singleRow = null;
        for (var i = 0; i < 20; i++) {
            $singleRow = Tpl.get('single-skill-row').attr('id', 'mb_list_' + i);
            $singleRow.find('.number').html((i + 1) + '.');

            if (i < current) $singleRow.addClass('usable');
            else {
                self.addBuyButtons($singleRow, i);

                if (firstDisable) firstDisable = false;
                else $singleRow.addClass('disable');
            }

            $list.push($singleRow);
            self.fillButtonsCallbacks($singleRow);
        }

        Parent.wnd.$.find('.skills-points-description').html(_t('mbattle'));
        Parent.wnd.$.find('.skills-points').addClass('d-none');
        $innerContent.find('.clear-btn').html($clear);
        $innerContent.find('.skills-list').html($list);
        $innerContent.find('.save-btn').html($save);
        $innerContent.find('.mb-box-input').removeClass('active').addClass(repeat == 1 ? 'active' : '');
        //this.fillButtonCallbacks($innerContent);
        this.setCheckboxCallback();

        $save.click(self.saveAndClose);
        $clear.click(self.clearList);
    };

    this.addBuyButtons = function($singleRow, i) {
        let $btn1 = Tpl.get('button').addClass('small green');
        let $btn2 = Tpl.get('button').addClass('small purple');

        let $costSpan1 = $('<span/>').addClass('small-money');
        let $costSpan2 = $('<span/>').addClass('small-draconite');

        let $label1 = $('<span/>').html(round(cost.gold[i])).addClass('buy-money-btn');
        let $label2 = $('<span/>').html(cost.credits[i]).addClass('buy-sl-btn');

        $btn1.find('.label').html([$label1, $costSpan1]);
        $btn2.find('.label').html([$label2, $costSpan2]);

        $btn1.click(function() {
            self.buyAlert(0, i)
        });
        $btn2.click(function() {
            self.buyAlert(1, i)
        });

        $singleRow.find('.money-buy').append($btn1);
        $singleRow.find('.sl-buy').append($btn2);
        $singleRow.find('.skill-name').html(_t('buy_skill_place'));
    };

    this.buyAlert = function(kind, index) {
        let str;
        let currencyIcon;
        let val;
        switch (kind) {
            case 0:
                currencyIcon = "/goldIconNormal.png";
                str = _t('confirm_upgrade_MBATLEforGold');
                val = round(cost.gold[index]);
                break;
            case 1:
                currencyIcon = "/draconite_small.gif";
                str = _t('confirm_upgrade_MBATLEforCredits');
                val = cost.credits[index];
                break;
            default:
                console.warn('[MBattleEditor.js, buyAlert] Bad type of currency :' + kind);
                return;
        }

        let data = {
            ik: "oimg",
            ip: currencyIcon,
            it: val,
            m: "yesno2",
            q: '<br>' + str,
            re: 'skills&battleaction=learn&credits=' + kind
        };
        askAlert(data);
    };

    this.saveAndClose = function() {
        //self.save();
        Parent.removeEditor(() => {
            self.changeScrollWrapperPos(42);
            Parent.wnd.$.find('.MB-wrapper').css('display', 'block');
            Parent.wnd.$.find('.skills-points-description').html(_t('skills_points_description', null, 'skills'));
            Parent.wnd.$.find('.edit-header-label').text(_t('clickSkills'));
            Parent.wnd.$.find('.right-column').find('.skills-points').removeClass('d-none');
        });
    };

    this.clearList = function() {
        list = [];
        self.save();
    };

    this.fillButtonCallbacks = function($innerContent) {
        $innerContent.find('.up-arrow').click(function() {
            self.arrowManager('up', $(this).parent());
        });
        $innerContent.find('.down-arrow').click(function() {
            self.arrowManager('down', $(this).parent());
        });
        $innerContent.find('.remove-cross').click(function() {
            self.arrowManager('cross', $(this).parent());
        });
        $('.mb-label, .mb-box-input', $content).click(function() {
            $('.mb-box-input').toggleClass('active');
            repeat = repeat ? 0 : 1;
            self.save();
        });
    };

    this.fillButtonsCallbacks = function($singleRow) {
        var $btn1 = Tpl.get('button').addClass('green small w30');
        var $btn2 = Tpl.get('button').addClass('green small w30');
        var $btn3 = Tpl.get('button').addClass('red small w30');

        self.addBck($btn1, 'up');
        self.addBck($btn2, 'down');
        // self.addBck($btn3, 'remove');
        $btn3.append(getIconClose(false));
        $singleRow.find('.up-arrow').append($btn1);
        $singleRow.find('.down-arrow').append($btn2);
        $singleRow.find('.remove-cross').append($btn3);

        $btn1.click(function() {
            self.arrowManager('up', $(this).parent().parent().parent());
        });
        $btn2.click(function() {
            self.arrowManager('down', $(this).parent().parent().parent());
        });
        $btn3.click(function() {
            self.arrowManager('cross', $(this).parent().parent().parent());
            self.hideArrows();
        });
    };

    this.addBck = function($but, cl) {
        $but.append($('<div>').addClass('add-bck ' + cl));
        var $label = $but.find('.label').html(0);
        $label.css('display', 'none');
    };

    this.setCheckboxCallback = function() {
        $('.mb-label, .mb-box-input', $content).click(function() {
            $('.mb-box-input').toggleClass('active');
            repeat = repeat ? 0 : 1;
            self.save();
        });
    };

    this.arrowManager = function(kind, $) {
        var currentPos = $.attr('id').split('_').pop();
        var nextPos = currentPos;
        switch (kind) {
            case 'up':
                nextPos--;
                break;
            case 'down':
                nextPos++;
                break;
            case 'cross':
                break;
        }
        if (nextPos == currentPos) { // remove element from list
            list.splice(nextPos, 1);
        } else { // swap elements
            list[nextPos] = list[nextPos] ^ list[currentPos];
            list[currentPos] = list[nextPos] ^ list[currentPos];
            list[nextPos] = list[nextPos] ^ list[currentPos];
        }
        this.save();
    };

    this.save = function() {
        _g('skills&battleaction=set&battleskills=' + (list.length ? list : 0) + '&rpt=' + repeat, function() {
            self.updateList();
        });
    };

    this.getSkillName = (skill) => {
        let skills = Engine.skills.getSkills();
        let skillName = '';
        switch (skill) {
            // case -1:
            case SkillsData.specificSkills.NORMAL_ATTACK_ID:
                skillName = Parent.tLang('bm_normal_attack');
                break;
                // case -2:
            case SkillsData.specificSkills.ONE_STEP_ID:
                skillName = Parent.tLang('step');
                break;
            default:
                skillName = skills['skill_' + skill].name
                break;
        }
        return skillName;
    }

    this.updateList = function() {
        var skillName = null;
        Engine.skills.wnd.$.find('.single-skill-row.usable').find('.skill-name').html(_t('empty'));
        for (var i = 0; i < list.length; i++) {
            skillName = this.getSkillName(list[i]);
            $('#mb_list_' + i).find('.skill-name').html(skillName);
        }
        $('.single-skill-row').hover(function() {
            $(this).find('.arrows-wrapper').css('visibility', 'visible');
            var id = $(this).attr('id').split('_').pop();
            self.showArrows(id);
        }, function() {
            self.hideArrows();
            $(this).find('.arrows-wrapper').css('visibility', 'hidden');
        });
    };

    this.showArrows = function(id) {
        if (id >= list.length) return;
        var $singleRow = $('#mb_list_' + id);
        $singleRow.find('.remove-cross').css('display', 'block');
        $singleRow.find('.down-arrow').css('display', 'block');
        $singleRow.find('.up-arrow').css('display', 'block');
        if (id == 0) {
            $singleRow.find('.up-arrow').css('display', 'none')
        }
        if (id == list.length - 1 || list.length == 1) {
            $singleRow.find('.down-arrow').css('display', 'none')
        }
    };

    this.hideArrows = function() {
        $('.single-skill-row').each(function() {
            $(this).find('.remove-cross').css('display', 'none');
            $(this).find('.up-arrow').css('display', 'none');
            $(this).find('.down-arrow').css('display', 'none');
        });
    };

    this.manageRepeatButton = function() {
        if (current > 0) $content.find('.checkbox-wrapper').removeClass('disabled');
        else $content.find('.checkbox-wrapper').addClass('disabled');
    }

    this.updateEditor = function(v) {
        skillsLimit = v.max;
        list = v.list;
        repeat = v.rpt == 1 ? 1 : 0;
        current = v.cur;
        cost = v.cost;
        this.fillRightColumn();
        this.updateList();
        this.hideArrows();
        this.manageRepeatButton();
        $('.scroll-wrapper', $content).trigger('update'); //.trigger('');
    };
};