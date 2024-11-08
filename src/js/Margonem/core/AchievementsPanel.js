// var wnd = require('core/Window');
var tpl = require('core/Templates');
//var Items = require('core/items/ItemsManager');
// var Storage = require('core/Storage');
module.exports = function() {
    var content;
    var self = this;

    this.init = function() {
        self.initWindow();
        self.addScrollBar();
    };

    this.initWindow = function() {
        content = tpl.get('achievement-panel');

        Engine.windowManager.add({
            content: content,
            //nameWindow        : 'achievements',
            nameWindow: Engine.windowsData.name.ACHIEVEMENTS,
            nameRefInParent: 'wnd',
            objParent: this,
            title: self.tLang('achievements'),
            startVH: 60,
            cssVH: 60,
            onclose: () => {
                self.hidePanel();
            }
        });
        this.hidePanel();
        this.wnd.addToAlertLayer();
    };

    this.callEvent = function() {
        var url = 'https://margonem.com/ajax/getAchievements';
        $.ajax({
            url: url,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(response) {
                self.wnd.$.find('.scroll-pane').find('.section').remove();
                self.wnd.$.find('.cards-header').empty();
                var json = JSON.parse(response);
                self.createCardsAndSeciotns(json['all_achievements']['ach_groups']);
                self.createAchievements(json['all_achievements']['ach']);
                $('.scroll-wrapper', content).trigger('update');
            },
            error: function(response) {
                console.error('[AchievementsPanel.js, callEvent] Achievement ajax error');
            }
        });
    };

    this.hidePanel = function() {
        //self.wnd.$.css('display', 'none')
        self.wnd.hide();
    };

    this.showPanel = function() {
        self.callEvent();
        // self.wnd.$.css('display', 'block');
        self.wnd.show();
    };

    this.toggle = function() {
        self.wnd.$.css('display') == 'block' ? self.hidePanel() : self.showPanel();
    };

    this.createCardsAndSeciotns = function(data) {
        for (var i = 0; i < data.length; i++) {
            var str = data[i] == "Fights with monsters" ? "PvE fight" : data[i];
            this.newCard(data[i], str, i);
        }
        this.activeSection('General');
    };

    this.newCard = function(data, label, index, clb) {
        var $card = tpl.get('card');
        var cl = data.replace(/\?/g, "");
        cl = cl.replace(/\s/g, "-");
        var $section = tpl.get('achievement-section').addClass('section ' + cl + ' grp-' + (index + 1));
        $card.attr('card-name', cl);
        $card.find('.label').html(label);
        self.wnd.$.find('.cards-header').append($card);
        self.wnd.$.find('.scroll-pane').append($section);

        $card.click(function() {
            var attr = $(this).attr('card-name');
            self.activeSection(attr);
            if (clb) clb();
        });
    };

    this.activeSection = function(attr) {
        var $w = self.wnd.$;
        var $card = $w.find("[card-name='" + attr + "']");
        var label = $card.find('.label').html();
        $w.find('.card').removeClass('active');
        $w.find('.section').removeClass('active');
        $card.addClass('active');
        self.wnd.$.find('.' + attr).addClass('active');
        $w.find('.edit-header-label').html(label);
        $('.scroll-wrapper', content).trigger('update');
        $('.scroll-wrapper', content).trigger('scrollTop');
    };

    this.setVisibleStats = function($parent, index) {
        var $allC = $parent.find('.card').removeClass('active');
        var $allS = $parent.find('.section').removeClass('active');
        $allC.eq(index).addClass('active');
        $allS.eq(index).addClass('active');
    };

    this.tLang = function(key) {
        return _t(key, null, 'achievement');
    };

    this.addScrollBar = function() {
        $('.scroll-wrapper', content).addScrollBar({
            track: true
        });
    };

    this.createAchievements = function(data) {
        for (var k in data) {
            this.createOneAchievement(data[k], k)
        }
        $('.scroll-wrapper', content).trigger('update');
    };

    this.createOneAchievement = function(data, index) {
        var $one = tpl.get('one-achievement').addClass('index-' + index);


        if (data.parent > 1) {
            var $section = self.wnd.$.find('.parent-' + data.parent);
            if ($section.length < 1) {
                $section = tpl.get('achievement-section').addClass('section name-' + data.parent + ' parent-' + data.parent);
                $section.attr('card-name', 'name-' + data.parent);
                self.wnd.$.find('.scroll-pane').append($section);
            }
            $section.append($one);
        } else self.wnd.$.find('.grp-' + data.grp).prepend($one);

        if (data.is_groupping) {
            var $btn = tpl.get('button').addClass('small green');
            $btn.find('.label').html('More');
            $one.append($btn);
            var clickName = 'name-' + index;
            $btn.click(function() {
                self.activeSection(clickName);
            });
        }


        $one.find('.achievement-title').html(data.name);
        $one.find('.description-wrapper').html(data.desc);

        if (data.done != 0) $one.find('.icon').css('background-position-y', -53 * (parseInt(index)));

        var wProgBarWrap = $one.find('.progress-bar-wrapper').css('width');

        if (!isset(data.mlvl)) {
            $one.find('.state-wrapper').html('<BR>');
            if (data.done == 2) $one.find('.progress-bar').css('width', parseInt(wProgBarWrap));
            return;
        }

        var max = data.mlvl;
        var cur = data.clvl;

        $one.find('.current').html(cur);
        $one.find('.max').html(max);
        $one.find('.progress-bar').css('width', cur / max * parseInt(wProgBarWrap));

        //if (data.todo) $one.find('.progress-bar-wrapper').attr('data-tip', data.now + ' of ' + data.todo);
        if (data.todo) $one.find('.progress-bar-wrapper').tip(data.now + ' of ' + data.todo);
        if (cur > 0) $one.find('.icon').css('background-position-y', -53 * (parseInt(index)));

        var mulipler;

        if (max < 3) return;
        if (cur == max) mulipler = 2;
        else {
            var evenNumber = !(max % 2);

            if (evenNumber) {
                if (cur > max / 2) mulipler = 1;
                else mulipler = 0;
            } else {
                var halfMax = Math.floor(max / 2) + 1;
                if (cur >= halfMax) mulipler = 1;
                else mulipler = 0;
            }
        }
        $one.find('.icon').css('background-position-x', -53 * mulipler);
    };

    this.createProgressBar = function() {

    };

    //this.init();

};