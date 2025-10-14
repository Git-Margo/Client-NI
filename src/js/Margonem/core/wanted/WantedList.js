/**
 * Created by Michnik on 2015-04-21.
 */
var Tpl = require('@core/Templates');
// var Window = require('@core/Window');
var Store = require('@core/Storage');
var StorageFuncWindow = require('@core/window/StorageFuncWindow');

module.exports = function() {
    var self = this;
    var content = null;

    this.init = function() {
        this.initContent();
        this.initWindow();
        this.initScroll();
        //this.wnd.updateElementsWithOpacity();
    };

    this.initWindow = function() {
        // var title = _t('wanted', null, 'pklist');
        // this.wnd = new Window({
        // 	title: title,
        // 	onclose: function () {
        // 		self.closePanel();
        // 	},
        // 	nameWindow:'wantedList',
        // 	type: 'transparent',
        // 	managePosition: {x:200,y:100},
        // 	manageOpacity: 3
        // });
        //this.wnd.setTransparentWindon();
        //this.wnd.setSavePosWnd('wantedList', 200, 100);
        // this.wnd.content(content);
        // $('.alerts-layer').append(self.wnd.$);
        // this.wnd.updatePos();
        // this.setStateOfWantedList();

        Engine.windowManager.add({
            content: content,
            //nameWindow        : 'wantedList',
            nameWindow: Engine.windowsData.name.WANTED_LIST,
            type: Engine.windowsData.type.TRANSPARENT,
            nameRefInParent: 'wnd',
            objParent: this,
            managePosition: {
                x: 200,
                y: 100
            },
            manageOpacity: 3,
            title: _t('wanted', null, 'pklist'),
            manageShow: true,
            onclose: () => {
                this.closePanel();
            }
        });

        this.wnd.addToAlertLayer();
        this.wnd.updatePos();
        this.setStateOfWantedList();
    };

    this.initContent = function() {
        content = Tpl.get('wanted-list');
    };

    this.onResize = function() {
        this.wnd.updatePos();
    };

    this.setSize = function() {
        var $children = self.wnd.$.find('.scroll-pane .one-wanted');
        var size = $children.length;
        content.css({
            'height': size * 25 - 25
        });
    };

    this.update = function(i, oneD) {
        var $oneW = Tpl.get('one-wanted').addClass('row-in-trans-window');
        self.wnd.$.find('.scroll-pane').append($oneW);

        var $city = $oneW.find('.city .inner');
        var city = oneD.town;
        $city.tip(city, 't_static');
        $city.html(city);

        var index = $oneW.index();
        $oneW.find('.nick .inner').html(oneD.nick);
        $oneW.find('.cords').html(' (' + oneD.x + ',' + oneD.y + ')');
        self.createWantedTip($oneW, oneD)
    };

    this.createWantedTip = function($oneW, oneD) {
        //var prof = isset(oneD.prof) ? oneD.prof : '';
        //var lvl = oneD.lvl == 0 ? '' : '(' + oneD.lvl + prof + ')';

        let charData = {
            showNick: true,
            nick: oneD.nick,
            level: oneD.lvl,
            prof: oneD.prof,
            operationLevel: oneD.oplvl,
            htmlElement: true
        };
        let info = getCharacterInfo(charData);

        var wanted = '<div class=wanted></div>';
        //var nick = '<div class="nick">' + oneD.nick + ' ' + lvl + '</div>';
        var nick = '<div class="nick">' + info + '</div>';
        const avatar = $('<div class="avatar-icon" />');
        createImgStyle(avatar, CFG.a_opath + oneD.icon);
        var wrapper = '<div class="info-wrapper">' + nick + '</div>';
        var buffs = '<div class="buffs-wrapper"><div class="wanted-i"></div></div>'
        $oneW.tip(wanted + wrapper + buffs + avatar.prop('outerHTML'), 't_other', null);
    };

    this.setVisibleEmptyRecord = function() {
        var bool = self.wnd.$.find('.scroll-pane').children().length > 1;
        self.wnd.$.find('.empty').css('display', bool ? 'none' : 'block');
    };

    this.initScroll = function() {
        var $scrollWrapper = self.wnd.$.find('.scroll-wrapper');
        self.wnd.$.find('.scroll-wrapper').addScrollBar({
            track: true
        });
        $scrollWrapper.css('position', 'absolute');
    };

    this.scrollUpdate = function() {
        $('.scroll-wrapper', content).trigger('update');
    };

    this.openPanel = function() {
        //Store.set('wantedList/show', true);
        //self.wnd.$.css('display', 'block');
        self.wnd.show();
        self.wnd.setWndOnPeak();
    };

    this.closePanel = function() {
        //Store.set('wantedList/show', false);
        //self.wnd.$.css('display', 'none');
        self.wnd.hide();
    };

    this.toggleVisible = function() {
        //var visible = this.wnd.$.css('display') == 'block';
        var visible = this.wnd.isShow();
        visible ? this.closePanel() : this.openPanel();
    };

    this.setStateOfWantedList = function() {
        //var show = Store.get('wantedList/show');
        var show = StorageFuncWindow.getShowWindow(Engine.windowsData.name.WANTED_LIST)
        show ? this.openPanel() : this.closePanel();
    };

    this.onResize = function() {
        self.wnd.updatePos();
    };

    //this.init();

};