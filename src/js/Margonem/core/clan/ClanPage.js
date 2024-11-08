// var wnd = require('core/Window');
var tpl = require('core/Templates');
module.exports = function(Par, which, $parent) {
    var self = this;
    var content;
    var $w;
    var menu;
    var bbCode;

    this.update = function(v) {
        this.updatePage(v);
        this.setClanName();
        this.hideOrShowEditBut();
        this.updateScroll();
    };

    this.updatePage = function(v) {
        if (v) bbCode = deletePositionFixed(v.official);
        else {
            var str = which == 'priv-page' ? 'info' : 'official';
            bbCode = Par.getProp(str);
        }
        const parsedContent = parseClanBB(bbCode);
        content.find('.page-content').html(parsedContent);
        this.imagesOnLoad(this.updateScroll);
    };

    this.imagesOnLoad = (fn) => {
        let $images = content.parent().find('.clan-' + which + '-content .page-content img'),
            preloaded = 0,
            total = $images.length;
        if (total === 0) {
            fn();
            return;
        }
        $images.on('load', () => {
            if (++preloaded === total) {
                fn();
            }
        });
    }

    this.hideOrShowEditBut = function() {
        if ($parent != 'clan') return;
        var allow = which == 'priv-page' ? 'priv' : 'official';
        var bool = this['allow' + allow + 'Edit']();
        var $b = $w.find('.clan-' + allow + '-page-content').find('.edit-page-but');
        $b.css('display', bool ? 'block' : 'none');
    };

    this.allowprivEdit = function() {
        var mR = Par.getProp('myrank');
        return mR & 32;
    };

    this.allowofficialEdit = function() {
        var mR = Par.getProp('myrank');
        return mR & 64;
    };

    this.updateScroll = function() {
        $('.scroll-wrapper', content).trigger('update');
    };

    this.init = function() {
        this.initWindow();
        this.initContent();
        this.initEditPageBut();
    };

    this.initWindow = function() {
        var bool = $parent == 'clan' ? 1 : 0;
        var t = [
            ['showcase', Par.getShowcaseWnd().$],
            ['clan', Par.wnd.$]
        ];
        menu = t[bool][0];
        $w = t[bool][1];
    };

    this.initContent = function() {
        content = tpl.get('clan-page-content');
        content.addClass('clan-' + which + '-content');
        $w.find('.card-content').append(content);
        $('.scroll-wrapper', content).addScrollBar({
            track: true
        });

        if (which == 'official-page') {
            var $banner = tpl.get('clan-banner-name');
            content.find('.clan-banner-name').remove();
            $banner.find('.edit-logo-but').html('');
            Par.createEditLogoBut();
            content.find('.clan-page-header').prepend($banner);
            content.find('.clan-desc').text(_t('clan_desc', null, 'clan'));
        }
    };

    this.setClanName = function() {
        var clanName = Par.getProp('name');
        content.find('.clan-page-header .clan-name').text(clanName);
    };

    this.showOtherClanOfficial = function() {
        var cards = Par.getShowcaseWnd().$.find('.card');
        Par.showChooseCard(menu, 'clan-' + which);
        cards.removeClass('active');
        cards.eq(0).addClass('active');
    };

    this.initEditPageBut = function() {
        if ($parent != 'clan') return;
        var $but = tpl.get('button').addClass('small green');
        var $where = content.find('.edit-page-but');
        $where.append($but);
        $but.tip(Par.tLang('redit_td'));
        $but.find('.label').html(Par.tLang('redit_td'));
        this.butClick($but);
    };

    this.butClick = function($b) {
        $b.click(function() {
            Par.showChooseCard(menu, 'clan-edit-' + which);
            if (which == 'official-page')
                Par.updateEditOfficialPage(bbCode);
            else
                Par.updateEditPrivPage(bbCode);
        });
    };

    //this.init();

};