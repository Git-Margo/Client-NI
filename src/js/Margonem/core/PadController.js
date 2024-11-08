const tpl = require('core/Templates');
const Input = require('core/InputParser');
const HeroDirectionData = require('core/characters/HeroDirectionData');
const StorageFuncWindow = require('core/window/StorageFuncWindow');

module.exports = function() {
    var self = this;
    var content = null;
    var $pad;
    var marginLeft;
    var marginTop;
    var zoom;

    this.init = function() {
        this.initWindow();
        this.initTouch('.pad-bck');
        this.setVisible();
        $pad = this.wnd.$.find('.pad-bck')

    };

    this.initWindow = function() {
        content = tpl.get('pad-controller');

        Engine.windowManager.add({
            content: content,
            nameWindow: Engine.windowsData.name.PAD_CONTROLLER,
            type: Engine.windowsData.type.TRANSPARENT,
            nameRefInParent: 'wnd',
            objParent: this,
            manageOpacity: 1,
            managePosition: {
                x: '251',
                y: '60'
            },
            title: '',
            addClass: 'pad-controller-window',
            manageShow: true,
            onclose: () => {
                this.toggleVisible();
            }
        });

        this.wnd.updatePos();
        this.wnd.$.css('min-width', '0px');

        this.wnd.addToAlertLayer();
    };

    this.toggleVisible = function() {
        var isOpen = self.wnd.isShow();
        isOpen ? self.wnd.hide() : self.wnd.show();
    };

    this.initTouch = function(name) {
        content.find(name)[0].addEventListener("touchstart", function(e) {
            e.preventDefault();
            zoom = 1 / Engine.zoomFactor;
            marginLeft = 10 * zoom;
            marginTop = 33 * zoom;
            self.calculateDir(e);
        }, false);
        content.find(name)[0].addEventListener("touchmove", function(e) {
            e.preventDefault();
            self.calculateDir(e);
        }, false);
        content.find(name)[0].addEventListener("touchend", function(e) {
            e.preventDefault();
            Input.setMoveDirection(null);
        }, false);
    };

    this.calculateDir = function(e) {
        var touches = e.targetTouches[0];

        var pLeft = touches.pageX * zoom;
        var pTop = touches.pageY * zoom;
        var pos = Engine.padController.wnd.$.position();

        var screenLeft = pos.left * zoom;
        var screenTop = pos.top * zoom;

        var l = pLeft - screenLeft - marginLeft;
        var t = pTop - screenTop - marginTop;

        let padWidth = 176;
        let centreOfPad = padWidth / 2;

        var xDiff = centreOfPad - l;
        var yDiff = centreOfPad - t;
        if (Math.abs(xDiff) < 10 && Math.abs(yDiff) < 10) return;

        var xDiffIsMore = Math.abs(xDiff) > Math.abs(yDiff);

        if (xDiffIsMore) Engine.inputParser.setMoveDirection(xDiff > 0 ? HeroDirectionData.W : HeroDirectionData.E);
        else Engine.inputParser.setMoveDirection(yDiff > 0 ? HeroDirectionData.N : HeroDirectionData.S)

    };

    this.setVisible = function() {
        var store = StorageFuncWindow.getShowWindow(Engine.windowsData.name.PAD_CONTROLLER);
        var show;
        if (store === null) {
            show = true;
            StorageFuncWindow.setShowWindow(show, Engine.windowsData.name.PAD_CONTROLLER);
        } else if (!store) self.wnd.hide();
    };
};