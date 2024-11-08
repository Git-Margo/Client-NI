//var wnd = require('core/Window');
var tpl = require('core/Templates');
//var Items = require('core/items/ItemsManager');

module.exports = function(Par) {
    var content;
    var blessLvl;
    var self = this;
    var tmpBlessArray = [];

    this.init = function() {
        this.initContent();
        this.initTexts();
        this.initBackBtn();
        this.initFetch();
    };

    this.update = function(v) {
        this.clearDisabled();
        this.setBlessLevel(v);
        this.updateScroll();
    };

    this.clearDisabled = function() {
        content.find('.clan-bless-container').find('.disabled').removeClass('disabled');
    };

    this.setBlessLevel = function(v) {
        blessLvl = v.bless_max;
    };

    this.newBlessItem = function(item, finish) {
        tmpBlessArray.push(item);
        if (finish) {
            tmpBlessArray.sort((a, b) => (a.id > b.id) ? 1 : -1);
            for (let bless of tmpBlessArray) {
                self.createOneBless(bless);
            }
            tmpBlessArray = [];
        }
    };

    this.createOneBless = function(item) {
        var $wrapper = content.find('.clan-bless-container');
        var lvl = $wrapper.children().length;
        var id = item['id'];

        if ($wrapper.find('.bless-' + id).length > 0) {
            const $existOneBless = $wrapper.find('.bless-' + id);
            lvl = $existOneBless.index();
            if (lvl + 1 > blessLvl) self.setDisabled($existOneBless);
            self.appendCloneItem(item, $existOneBless.find('.item-wrapper'));
            return;
        }

        var $oneBless = tpl.get('one-bless-skill');
        $oneBless.addClass('bless-' + id);

        var name = item['name'];
        var stats = item.parseStats();
        var description = stats['opis'];
        var duration = stats['ttl'];
        var price = item['pr'];
        var $btn = self.useBlessBtn(lvl, price);
        var str = Par.tLang('use_cost');

        self.appendCloneItem(item, $oneBless.find('.item-wrapper'));

        $oneBless.find('.bless-name').html(name);
        $oneBless.find('.bless-description').html(parseClanBB(description));
        $oneBless.find('.bless-duration').html(_t('battleTime', null, 'matchmaking') + ' ' + duration + 'min');
        $oneBless.find('.bless-use').prepend($btn);

        if (lvl + 1 > blessLvl) self.setDisabled($oneBless);
        $wrapper.append($oneBless);

        self.updateScroll();
    };

    this.createCloneItem = function(item) {
        //var $clone = $item.clone(false);
        // var $clone = Engine.tpls.createViewIcon(item.id,'clan-bless-item', 'b')[0];
        var $clone = Engine.tpls.createViewIcon(item.id, Engine.itemsViewData.CLAN_BLESS_ITEM_VIEW, 'b')[0];
        //var str = $clone.attr('data-tip');
        var tipData = $clone.getTipData();
        if (!tipData) return;
        tipData = tipData.replace('s-7', 's-7 left');
        $clone.tip(tipData);
        return $clone
    };

    this.appendCloneItem = function(item, $container) {
        var $clone = self.createCloneItem(item);
        $container.html($clone);
    };

    this.rebuiltDisabled = function() {
        var $allOneBless = content.find(".one-bless-skill");
        $allOneBless.removeClass('disabled');
        $allOneBless.each(function() {
            var lvl = $(this).index() + 1;
            if (lvl > blessLvl) self.setDisabled($(this));
        });
    };

    this.setDisabled = function($oneBless) {
        $oneBless.addClass('disabled');
    };

    this.useBlessBtn = function(lvl, cost) {
        var $btn = tpl.get('button').addClass('green small');
        var str = _t('use_it', null, 'item');
        $btn.find('.label').html(str + '<span class="small-money"></span>' + round(cost, 2));
        $btn.click(function() {
            //_g('clan&a=use_bless&lvl=' + (lvl + 1));
            _g('clan&a=skills_use&name=blessing&opt=' + (lvl + 1));
        });
        return $btn;
    };


    this.initFetch = function() {
        // Engine.tpls.fetch('b', self.newBlessItem);
        Engine.tpls.fetch(Engine.itemsFetchData.NEW_BLESS_TPL, self.newBlessItem);
    };

    this.initContent = function() {
        content = tpl.get('clan-bless-content');
        var headingText = content.find('.bless-header');
        Par.wnd.$.find('.card-content').append(content);
        content.find('.scroll-pane').prepend(headingText);
        $('.scroll-wrapper', content).addScrollBar({
            track: true
        });
    };

    this.initBackBtn = function() {
        var $btn = tpl.get('button').addClass('small green');
        var str = Par.tLang('back');
        $btn.find('.label').html(str);
        $btn.click(self.showSkils);
        content.find('.back-to-skill-btn').append($btn)
    };

    this.showSkils = function() {
        var str = Par.tLang('clan_skills');
        Par.showChooseCard('clan', 'clan-skills');
        Par.updateHeader(str);
    };

    this.updateScroll = function() {
        $('.scroll-wrapper', content).trigger('update');
    };

    this.initTexts = function() {
        var str = Par.tLang('bless-header');
        content.find('.bless-header').html(str);
    };


    //this.init();
};