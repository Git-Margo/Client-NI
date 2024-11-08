//var wnd = require('core/Window');
var tpl = require('core/Templates');
module.exports = function(Par) {
    var self = this;
    var content;
    this.amountPoint = 0;
    var percentSklis = [
        'expBonus',
        'healPower',
        'questExpBonus'
    ];
    var minSkils = [
        'timeTickets'
    ];

    this.update = function(v) {
        this.amountPoint = v.points;
        this.showOrHideResetBtn();
        this.clearContent();
        this.createSkills(v.quest_bonuses, v.quest_bonuses_use);
        this.updateHeader();
        this.updateHeadingText();
        this.showOrHideAddBtn();
        this.updateScroll();
    };

    this.skillsWithMinutes = function(name) {
        var bool = minSkils.indexOf(name) > -1;
        if (!bool) return '';
        return ' min';
    };

    this.skillsWithPercent = function(name, data) {
        var bool = percentSklis.indexOf(name) > -1;
        var val = data.val;
        if (!bool) return val;
        return (val * 100) + '%';
    };

    this.showOrHideResetBtn = function() {
        var bool = self.canUse();
        var $btn = content.find('.clan-skill-reset>.button');
        $btn.css('display', 'none');
        if (bool) $btn.css('display', 'block');
    };

    this.createSkills = function(skills, useData) {
        var $sp = content.find('.clan-skills-container');
        for (var k in skills) {
            this.createOneSkill(k, skills[k], useData, $sp);
        }
    };

    this.createOneSkill = function(name, data, useData, $par) {
        var $s = tpl.get('one-clan-skill');
        var $b = this.addPointBtn($s, name, data);
        var type = data.type;
        var skillState = useData[name];
        var skillVal = data.val;
        var val;

        val = this.skillsWithPercent(name, data);
        val += this.skillsWithMinutes(name, data);
        this.createSklillBckLevel($s, data);
        this.createProgresLevel($s, data);

        $s.addClass(name + '-skill');
        $s.find('.skill-icon').addClass(name);
        $s.find('.skill-clan-name').html(Par.tLang(name));
        $s.find('.skill-clan-description').html(Par.tLang(name + 'description'));
        $s.find('.skill-actual-val').html('<b>' + Par.tLang('skill-actual-val') + ' ' + val + '</b>');
        $s.find('.skill-clan-buts-add-point').append($b);


        switch (type) {
            case 0:
                break;
            case 1:
                var $btn = this.createShowBlessBtn(skillState);
                $s.find('.skill-increase-decrease').empty().append($btn);
                break;
            case 2:
                var $onOffBtn = this.onOffButton(name, data, skillState);
                $s.find('.skill-clan-buts-turn-on-off').append($onOffBtn);
                break;
            case 3:
                var $increaseDecreaseBtn = this.increaseDecreaseButton(name, data, skillState, skillVal);
                $s.find('.skill-increase-decrease').append($increaseDecreaseBtn);
                break;
        }
        $par.append($s);
    };

    this.createProgresLevel = function($skill, data) {
        var cur = data.lvl;
        var max = data.maxlvl;
        var $emptyWrapper = $skill.find('.skill-slots-wrapper');
        var $useWrapper = $skill.find('.skill-points-wrapper');
        for (var i = 0; i < max; i++) {
            var $one = tpl.get('empty-lvl');
            var cl = '';
            if (i == 0) cl = 'left';
            else {
                if (i != max - 1) cl = 'middle';
                else cl = 'right';
            }
            $one.addClass(cl);
            $emptyWrapper.append($one)
        }

        for (var i = 0; i < cur; i++) {
            var $one = tpl.get('use-lvl');
            $useWrapper.append($one);
        }
    };

    this.increaseDecreaseButton = function(name, data, skillState, skillVal) {
        var $btn = tpl.get('button');
        var tip = '';
        var disable = false;
        $btn.find('.label').html(Par.tLang('show_blesses'));
        $btn.addClass('green small');

        if (skillState) {
            disable = true;
            tip += _t('skillBonusUsed') + '<br>';
        }
        if (skillVal == 0) {
            disable = true;
            tip += _t('notBuySkill') + '<br>';
        }
        if (disable) {
            $btn.addClass('black');
            $btn.tip(tip);
            return $btn;
        }

        $btn.click(function() {
            var $content = tpl.get('increase-decrease-stamina');
            var $wrapper = $content.find('.stamina-pay-options');
            var $b1 = tpl.get('button').addClass('small green');
            var $b2 = tpl.get('button').addClass('small green');

            $wrapper.append($b2);
            $wrapper.append($b1);

            $b1.find('.label').html(_t('decrease'));
            $b2.find('.label').html(_t('increase'));

            mAlert($content, [{
                txt: _t('cancel'),
                hotkeyClass: 'alert-cancel-hotkey',
                callback: function() {
                    return true;
                }
            }], function(wnd) {
                self.initClick($b1, 'sub', name, 2, wnd);
                self.initClick($b2, 'add', name, 1, wnd);
            });

        });
        return $btn;
    };

    this.initClick = function($b1, kind, name, val, chooseWnd) {
        $b1.on('click', function(e) {
            e.stopPropagation();
            mAlert(_t('new_stamina_alert_' + kind), [{
                txt: _t('yes'),
                callback: function() {
                    _g('clan&a=skills_use&name=' + name + '&opt=' + val);
                    chooseWnd.close();
                    return true;
                }
            }, {
                txt: _t('cancel'),
                callback: function() {
                    return true;
                }
            }]);
        });
    };

    this.onOffButton = function(name, data, skillState) {
        var $btn = tpl.get('button').addClass('small');
        var opt;
        var notBuySkill = data.lvl == 0;

        if (skillState) {
            $btn.find('.label').html(_t('turn_off', null, 'loot'));
            opt = 2;
        } else {
            $btn.find('.label').html(_t('turn_on', null, 'loot'));
            $btn.addClass('green');
            opt = 1;
        }

        if (notBuySkill) {
            $btn.addClass('black');
            $btn.tip(_t('notBuySkill'));
            return $btn;
        }


        $btn.click(function() {
            _g('clan&a=skills_use&name=' + name + '&opt=' + opt);
        });
        return $btn;
    };

    this.createSklillBckLevel = function($skill, data) {
        var $bck = $skill.find('.skill-level-bck');
        var $lvl = $skill.find('.skill-level');
        var max = data.maxlvl;
        var lvl = data.lvl;
        var cl = Math.round(6 * lvl / max);
        var textCl = lvl > 0 ? 'chosen' : '';
        $lvl.html(lvl + '/' + max).addClass(textCl);
        $bck.addClass('cl-' + cl);
    };

    this.canUse = function() {
        var myRank = Par.getProp('myrank');
        return myRank & 1 ? 1 : 0;
    };

    this.addPointBtn = function($skill, name, data) {
        var canUse = self.canUse();
        var tip = '';
        var disable = false;
        var maxProgress = data.maxlvl == data.lvl;

        if (!canUse) {
            //$skill.find('.skill-clan-buts-label').css('display', 'none');
            disable = true;
            tip += Par.tLang('clan_skills_can_use');
            //return null;
        }
        if (maxProgress) {
            $skill.find('.skill-clan-buts-label').css('display', 'none');
            return null;
        }
        if (self.amountPoint == 0 && !maxProgress) {
            disable = true;
            tip += tip != '' ? '<br><br>' : '';
            tip += _t('skillPointsNotExist');
        }
        if (Par.getProp('gold') < data.nextcost) {
            disable = true;
            tip += tip != '' ? '<br><br>' : '';
            tip += _t('notEnoughGold');
        }


        //var disable = data.maxlvl == data.lvl || self.amountPoint == 0  || !canUse;
        var cl = disable ? 'black' : '';
        var $but = tpl.get('button').addClass('small green ' + cl);
        $but.tip(tip);
        $but.find('.label').html(_t('uprage_clan_skill') + '<span class="small-money"></span>' + round(data.nextcost, 2));
        if (disable) return $but;
        $but.click(function() {
            var callbacks = [{
                    txt: _t('yes', null, 'buttons'),
                    callback: function() {
                        _g('clan&a=skills_upgrade&name=' + name);
                        return true;
                    }
                },
                {
                    txt: _t('cancel'),
                    callback: function() {
                        return true;
                    }
                }
            ];
            var txt = _t('acceptSkillupgrade', {
                '%cost%': round(data.nextcost, 2)
            }, 'clan');
            mAlert(txt, callbacks, function(w) {});
        });
        return $but;
    };

    this.clearContent = function() {
        content.find('.clan-skills-container').empty();
    };

    this.updateScroll = function() {
        $('.scroll-wrapper', content).trigger('update');
    };

    this.init = function() {
        this.initContent();
        //this.resetSkillsBtn();
    };

    //this.resetSkillsBtn = function () {
    //	var str = 'clan-skills-reset';
    //	var $btn = tpl.get('button');
    //	var $div1 = $('<div>').addClass('small-draconite');
    //	var $div2 = $('<div>').addClass('cost').html('20k');
    //	var canUse = self.canUse();
    //	$btn.append($div2, $div1);
    //	$btn.addClass('small purple');
    //	$btn.find('.label').html(Par.tLang(str));
    //	if (!canUse) return;
    //	$btn.click(self.resetSkilsRequest);
    //	content.find('.clan-skill-reset').append($btn);
    //};

    this.resetSkilsRequest = function() {
        var bool = self.canUse();
        if (!bool) return;
        _g('clan&a=skills_reset');
    };

    this.showOrHideAddBtn = function() {
        var t = [
            'none', 'table-cell'
        ];
        var show = self.amountPoint > 0 ? t[1] : t[0];
        content.find('.skill-upgrade').css('display', show);
    };

    this.initContent = function() {
        content = tpl.get('clan-skills-content');
        Par.wnd.$.find('.card-content').append(content);
        $('.scroll-wrapper', content).addScrollBar({
            track: true
        });
    };

    this.updateHeader = function() {
        var header = content.find('.clan-skill-header');
        var cl = self.amountPoint > 0 ? 'green' : 'red';
        var span = '<span class="' + cl + '">' + self.amountPoint + '</span>';
        var $span = tpl.get('info-icon').addClass('small-header-info');
        var str = Par.tLang('points_left');
        $span.tip(_t('one_clan_skill_point'));
        header.html(str + span);
        header.append($span);
    };

    this.updateHeadingText = function() {
        var $headingText = content.find('.clan-skill-heading-text').hide();
        var $headingTextClone = $headingText.clone().show();
        var str;
        var canUse = this.canUse();
        if (canUse) {
            str = Par.tLang('choose_skillpoints');
        } else str = Par.tLang('only_leader');
        $headingTextClone.html(str);
        content.find('.clan-skills-container').prepend($headingTextClone);
    };

    this.createShowBlessBtn = function(skillState) {
        var label = Par.tLang('show_blesses');
        var $btn = tpl.get('button').addClass('small green');
        $btn.find('.label').html(label);
        $btn.click(self.showBless);
        return $btn;
    };

    this.showBless = function() {
        _g('clan&a=skills_use&name=blessing');
        var str = Par.tLang('clan_blesses');
        Par.showChooseCard('clan', 'clan-bless');
        Par.updateHeader(str);
    };

    //this.init();

};