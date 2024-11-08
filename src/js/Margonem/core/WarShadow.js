var WarShadow = function() {
    var self = this;
    var drawAble = false;
    this.mask = null;
    this.magin = 2;
    this.warRangeAndMargin = null;
    this.fw = null;
    this.fh = null;
    this.halffw = null;
    this.halfhh = null;
    this.globalComposition = 'xor';
    this.canDraw = false;
    var maskCanvas = null;
    var maskCanvasCtx = null;
    // var $GAME_CANVAS;

    this.init = function() {
        // $GAME_CANVAS = Engine.interface.get$GAME_CANVAS();
        this.createImg();
        this.createCanvas();
        //this.setWarRange(27);
        //this.setWarRange(9);
    };

    this.setWarRange = function(range) {
        this.canDraw = range > 0;
        this.warRangeAndMargin = range + this.magin;
        this.fw = 2 * this.warRangeAndMargin * 32;
        this.fh = 2 * this.warRangeAndMargin * 32;
        this.halffw = this.fw / 2;
        this.halfhh = this.fh / 2;
    };

    this.createCanvas = function() {
        maskCanvas = document.createElement("canvas");
        maskCanvasCtx = maskCanvas.getContext("2d");
    };

    this.setSizeCanvas = function() {
        let $GAME_CANVAS = Engine.interface.get$GAME_CANVAS();
        maskCanvas.width = $GAME_CANVAS.width();
        maskCanvas.height = $GAME_CANVAS.height();
    };

    this.getWarShadow = function() {
        //return !self.canDraw || !Engine.settings || Engine.settings.getLocOptById(24) ? [] : [self];
        //return !self.canDraw || Engine.opt(24) ? [] : [self];
        return self.canDraw && isSettingsOptionsWarShadowOn() ? [self] : [];
    };

    this.drawMask = function() {
        var w = maskCanvas.width;
        var h = maskCanvas.height;

        var leftView = self.rx * 32 - self.halffw + 16 - Engine.map.offset[0];
        var topView = self.ry * 32 - self.halfhh + 16 - Engine.map.offset[1];

        leftView = Math.round(leftView);
        topView = Math.round(topView);

        maskCanvasCtx.clearRect(0, 0, w, h);
        maskCanvasCtx.drawImage(self.mask, leftView, topView, self.fw, self.fh);
        maskCanvasCtx.globalCompositeOperation = self.globalComposition;
        maskCanvasCtx.fillRect(0, 0, w, h);
    };

    this.getOrder = function() {
        return getEngine().renderer.getWarShadowOrderWithoutSort();
    };

    this.update = function() {
        this.updatePos();
    };

    this.updatePos = function() {
        this.rx = Engine.hero.rx;
        this.ry = Engine.hero.ry;
    };

    this.createImg = function() {

        Engine.imgLoader.onload("../img/testmask9.png", false,
            (i) => {
                self.mask = i;
            },
            (i) => {
                drawAble = true;
            }
        );

    };

    this.checkCanDraw = function() {

    };

    this.draw = function(ctx) {
        if (maskCanvas.width < 1 || maskCanvas.height < 1) return;
        self.checkCanDraw();
        self.drawMask();
        ctx.globalAlpha = 0.7;

        //let clipImg     = Engine.map.clipObject(0, 0, maskCanvas.width, maskCanvas.height);
        //
        //if (!clipImg) {
        //	return
        //}

        ctx.drawImage(maskCanvas, 0, 0, maskCanvas.width, maskCanvas.height);
        //ctx.drawImage(
        //	maskCanvas,
        //	clipImg.backgroundPositionX, clipImg.backgroundPositionY,
        //	clipImg.width, clipImg.height,
        //	clipImg.left, clipImg.top,
        //	clipImg.width, clipImg.height
        //);
        ctx.globalAlpha = 1.0;
    };

    this.updateColor = function() {
        self.color = self.master.d.whoIsHere;
    };

    this.init();
};

module.exports = WarShadow;