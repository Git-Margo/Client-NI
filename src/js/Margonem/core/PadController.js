const tpl = require('@core/Templates');
const Input = require('@core/InputParser');
const HeroDirectionData = require('@core/characters/HeroDirectionData');
const StorageFuncWindow = require('@core/window/StorageFuncWindow');

module.exports = function() {
    var self = this;
    var content = null;
    var $pad;
    var $padBall;
    var zoom;
    const PAD_SIZE = 74;

    const init = () => {
        initWindow();

        $pad = this.wnd.$.find('.pad-bck');
        $padBall = this.wnd.$.find('.pad-ball');
    };

    const initWindow = () => {
        content = tpl.get('pad-controller');

        Engine.windowManager.add({
            content: content,
            nameWindow: Engine.windowsData.name.PAD_CONTROLLER,
            type: Engine.windowsData.type.TRANSPARENT,
            nameRefInParent: 'wnd',
            objParent: this,
            manageOpacity: 0,
            managePosition: {
                x: '251',
                y: '60'
            },
            title: '',
            addClass: 'pad-controller-window',
            //manageShow        : true,
            closeable: false,
            onclose: () => {
                //this.toggleVisible();
            }
        });

        this.wnd.hide();
        this.wnd.$.css('min-width', '0px');
        this.wnd.addToAlertLayer();
    };

    const show = (e) => {
        this.wnd.show();
        Engine.canvasTip.hide(e);
        Engine.interface.removePopupMenu();
    };

    const hide = () => {
        this.wnd.hide();
    };

    const isShow = () => {
        return this.wnd.isShow()
    };

    const touchstartEvent = (e) => {
        e.preventDefault();
        zoom = 1 / Engine.zoomFactor;
        self.calculateDir(e);
    };

    const touchmoveEvent = (e) => {
        e.preventDefault();
        self.calculateDir(e);
    };

    const touchendEvent = (e) => {
        e.preventDefault();
        Input.setMoveDirection(null);
    };

    const getPadSize = () => {
        return PAD_SIZE;
    }

    this.calculateDir = function(e) {
        var touches = e.targetTouches[0];

        var pLeft = touches.pageX * zoom;
        var pTop = touches.pageY * zoom;
        var pos = Engine.padController.wnd.$.position();

        var screenLeft = pos.left * zoom;
        var screenTop = pos.top * zoom;

        var l = pLeft - screenLeft;
        var t = pTop - screenTop;

        let centreOfPad = getPadSize() / 2;

        var xDiff = centreOfPad - l;
        var yDiff = centreOfPad - t;

        let posToDraw = getPoint(-xDiff, -yDiff, 30);

        let margin = 2;

        $padBall.css('left', centreOfPad + posToDraw[0] + margin);
        $padBall.css('top', centreOfPad + posToDraw[1] + margin);

        if (Math.abs(xDiff) < 10 && Math.abs(yDiff) < 10) {
            Engine.inputParser.setMoveDirection(null);
            return;
        }

        var xDiffIsMore = Math.abs(xDiff) > Math.abs(yDiff);

        if (xDiffIsMore) Engine.inputParser.setMoveDirection(xDiff > 0 ? HeroDirectionData.W : HeroDirectionData.E);
        else Engine.inputParser.setMoveDirection(yDiff > 0 ? HeroDirectionData.N : HeroDirectionData.S)

    };

    const getPoint = (x, y, radius) => {
        const distance = Math.sqrt(x * x + y * y);
        if (distance > radius) {
            const scale = radius / distance;
            x *= scale;
            y *= scale;
        }

        return [x, y]
    };

    const setPos = (x, y) => {
        this.wnd.setXPos(x);
        this.wnd.setYPos(y);
    };

    this.init = init;
    this.show = show;
    this.hide = hide;
    this.isShow = isShow;
    this.setPos = setPos;
    this.getPadSize = getPadSize;
    this.touchstartEvent = touchstartEvent;
    this.touchmoveEvent = touchmoveEvent;
    this.touchendEvent = touchendEvent;
};