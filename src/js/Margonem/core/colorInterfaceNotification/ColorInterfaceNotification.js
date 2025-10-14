const ColorInterfaceNotificationData = require('@core/colorInterfaceNotification/ColorInterfaceNotificationData');

module.exports = function() {

    let active = false;
    //this.glow           = true;
    //this.shouldDraw     = true;

    let framesAmount = 20;
    let timePassed = 0;
    let activeFrame = 0;
    let increase = true;
    let canvasArray = [];
    let color = null;
    let blur = null;

    const init = function(_color, _blur) {
        setColor(_color);
        initAllCanvas();
        clearCanvasObjectToDraw();
        setBlur(_blur);
    };

    const setColor = (_color) => {
        color = _color;
    }

    const setBlur = (_blur) => {
        blur = _blur;
    }

    const initAllCanvas = () => {
        for (let i = 0; i != framesAmount; i++) {

            canvasArray.push({
                canvas: document.createElement('canvas'),
                toDraw: null
            })
        }

        setSizeInAllCanvas();
    }

    const getAlpha = () => {
        let diff = 0.05;

        return Math.floor(diff * activeFrame * 100) / 100;
    };

    const setSizeInAllCanvas = () => {
        let gameCanvas = getEngine().interface.get$GAME_CANVAS()[0];

        let w = gameCanvas.width;
        let h = gameCanvas.height;

        for (let k in canvasArray) {
            canvasArray[k].canvas.width = w;
            canvasArray[k].canvas.height = h;
        }
    };

    const clearCanvasObjectToDraw = () => {
        for (let k in canvasArray) {
            canvasArray[k].toDraw = false;
        }
    };

    const update = (dt) => {
        if (!active) {
            return;
        }

        //if (!getEngine().colorInterfaceNotificationManager.getBlink()) {
        //if (Engine.opt(8)) {
        if (!isSettingsOptionsInterfaceAnimationOn()) {
            return;
        }

        timePassed += dt * 80;

        const FRAME_TIME = ColorInterfaceNotificationData.DEFAULT_DATA.FRAME_TIME;

        if (timePassed < FRAME_TIME) {
            return
        }

        timePassed = timePassed - FRAME_TIME;

        if (increase) activeFrame++;
        else activeFrame--;

        if (activeFrame == 0 || activeFrame + 1 == canvasArray.length) {
            increase = !increase;
        }

    };

    const draw = (ctx) => {
        if (!active) {
            return;
        }

        setGlow(ctx);
    };

    //this.setBlink = (state) => {
    //    this.blink = state ? true : false;
    //};

    const setGlow = (ctx) => {
        let canvasData = canvasArray[activeFrame];
        let canvas = canvasData.canvas;

        if (!canvasData.toDraw) {
            drawFrameInArray();
        }

        ctx.drawImage(canvas, 0, 0);
    };

    const drawFrameInArray = () => {
        let canvasData = canvasArray[activeFrame];
        let canvas = canvasData.canvas;
        let ctx = canvas.getContext("2d");
        let left = 0;
        let top = 0;
        let w = canvas.width;
        let h = canvas.height;
        let margin = blur;

        ctx.clearRect(0, 0, w, h);
        //ctx.save();
        ctx.beginPath();
        ctx.rect(left - margin, top - margin, w + margin * 2, h + margin * 2);
        ctx.clip();

        ctx.globalAlpha = getAlpha();
        ctx.lineWidth = margin * 2;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = margin;
        ctx.shadowColor = color;

        ctx.strokeRect(left - margin, top - margin, w + margin * 2, h + margin * 2);
        //ctx.restore();

        ctx.shadowBlur = 0;

        canvasData.toDraw = true;
    }

    const onResize = () => {
        setSizeInAllCanvas();
        clearCanvasObjectToDraw();
    };

    const setActive = (_active) => {
        active = _active;
    };

    const getActive = () => {
        return active;
    };

    this.init = init;
    this.setActive = setActive;
    this.getActive = getActive;
    this.update = update;
    this.draw = draw;
    this.onResize = onResize;
};