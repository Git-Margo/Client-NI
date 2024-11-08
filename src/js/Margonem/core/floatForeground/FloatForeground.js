var CanvasFade = require('core/canvasFade/CanvasFade.js');
var CanvasFadeData = require('core/canvasFade/CanvasFadeData.js');
let RajObjectInterface = require('core/raj/RajObjectInterface');
let RajData = require('core/raj/RajData');

module.exports = function() {

    let moduleData = {
        fileName: "FloatForeground.js"
    };

    let imagePattern = null;
    let floatPatternsCanvas = null;
    let floatPatternsCtx = null;

    let floatForegroundData = null;

    //this.alwaysDraw             = true;
    let alwaysDraw;

    let bgX = null;
    let bgY = null;

    let id = null;
    let xVector = 0.2;
    let yVector = -0.1;
    let alpha = 1.0;
    let color = null;
    let ready = false;
    let canvasFade = null;

    const init = (data) => {
        implementRajInterface();
        this.updateDataRajObject(data);
        this.setAlwaysDraw(true);
        resetBgXBgY();
        initFloatForegroundData(data);
        loadImageAndCreateFloatForeground(data);
        initCanvasFade();
    };

    const implementRajInterface = () => {
        (new RajObjectInterface()).implementRajObject(this, RajData.FLOAT_FOREGROUND);
    };

    const initCanvasFade = () => {
        let data = {
            action: CanvasFadeData.action.FADE_IN,
            callback: () => {
                canvasFade = null;
            },
            finishAlpha: alpha
        };

        canvasFade = new CanvasFade();

        canvasFade.init();
        canvasFade.updateData(data);
    };

    const initFloatForegroundData = (data) => {
        floatForegroundData = data;

        id = data.id;

        if (isset(data.xVector)) xVector = data.xVector;
        if (isset(data.yVector)) yVector = data.yVector;

        if (isset(data.color)) {
            if (isset(data.color.r) && isset(data.color.g) && isset(data.color.b)) color = data.color;
            if (isset(data.color.a)) alpha = data.color.a;
        }
    };

    const update = (dt) => {
        if (!ready) return;

        if (canvasFade) canvasFade.update(dt);

        bgX += xVector * dt * 100;
        bgY += yVector * dt * 100;

        if (bgX > floatPatternsCanvas.width || bgX < -floatPatternsCanvas.width) bgX = 0;
        if (bgY > floatPatternsCanvas.height || bgY < -floatPatternsCanvas.height) bgY = 0;
    };

    const getOrder = () => {
        return 398;
    };

    const loadImageAndCreateFloatForeground = (data) => {
        //let url = "../img/environmentalEffects/fog/fog_0.png";
        //let url = "../img/environmentalEffects/fog/fog_1.png";
        let url;
        if (data.url) url = CFG.a_rajGraphics + data.url;
        else url = "../img/environmentalEffects/fog/fog_2.png";

        Engine.imgLoader.onload(url, false, false, (i) => {
            imagePattern = i;
            createFloatForeground();
            setReady(true);
        });

    };

    const drawFloatForeground = (ctx) => {

        let dataToDraw = createDataToDraw();
        let clip = Engine.map.getClip();

        if (!clip) return;

        fillHorizontalData(ctx, clip, dataToDraw);
        fillVerticalData(ctx, clip, dataToDraw);

        fillHorizontalAtrr(dataToDraw, 2, dataToDraw[0].left, dataToDraw[0].width, dataToDraw[0].bgX);
        fillVerticalAtrr(dataToDraw, 2, dataToDraw[1].top, dataToDraw[1].height, dataToDraw[1].bgY);

        fillHorizontalAtrr(dataToDraw, 3, dataToDraw[1].left, dataToDraw[1].width, dataToDraw[1].bgX);
        fillVerticalAtrr(dataToDraw, 3, dataToDraw[0].top, dataToDraw[0].height, dataToDraw[0].bgY);

        drawDataToDraw(ctx, dataToDraw);
    };

    const createDataToDraw = () => {
        return {
            0: {
                bgX: null,
                bgY: null,
                width: null,
                height: null,
                left: null,
                top: null
            },
            1: {
                bgX: null,
                bgY: null,
                width: null,
                height: null,
                left: null,
                top: null
            },
            2: {
                bgX: null,
                bgY: null,
                width: null,
                height: null,
                left: null,
                top: null
            },
            3: {
                bgX: null,
                bgY: null,
                width: null,
                height: null,
                left: null,
                top: null
            }
        }
    };

    const drawDataToDraw = (ctx, dataToDraw) => {

        let shouldUpdate = alpha != 1 || canvasFade;

        if (shouldUpdate) {
            let _alpha = canvasFade ? canvasFade.getFadeValue() : alpha;
            ctx.save();
            ctx.globalAlpha = _alpha;
        }

        for (let k in dataToDraw) {

            let e = dataToDraw[k];
            if (e.width < 0) continue;
            if (e.height < 0) continue;
            if (e.width == null) continue;
            if (e.height == null) continue;

            ctx.drawImage(
                floatPatternsCanvas,
                e.bgX, e.bgY,
                e.width, e.height,
                e.left, e.top,
                e.width, e.height
            );

        }

        if (shouldUpdate) ctx.restore();
    };

    const fillHorizontalData = (ctx, clip, dataToDraw) => {
        let mapShift = Engine.mapShift.getShift();

        var left = 0 * CFG.tileSize - Engine.map.offset[0];
        let leftBound = clip[0] + mapShift[0] - Engine.map.offset[0];
        let rightBound = clip[0] + clip[2] + mapShift[0] - Engine.map.offset[0];

        let isLeft = xVector >= 0;
        let clipLeftPos = null;
        let clipWidth = null;
        let _bgX = null;
        let leftPos = null;
        let maxWidth = null;

        if (isLeft) leftPos = left - bgX;
        else leftPos = left - bgX - floatPatternsCanvas.width;

        maxWidth = rightBound - leftBound;
        clipLeftPos = leftBound;
        clipWidth = (leftPos + floatPatternsCanvas.width) - clipLeftPos;

        let coverWidth = 0;

        if (clipWidth > maxWidth) {
            coverWidth = clipWidth - maxWidth;
            clipWidth = maxWidth;
        }

        _bgX = floatPatternsCanvas.width - clipWidth - coverWidth;

        if (clipWidth > 0) fillHorizontalAtrr(dataToDraw, 0, clipLeftPos, clipWidth, _bgX);

        if (isLeft) leftPos = left - bgX + floatPatternsCanvas.width;
        else leftPos = left - bgX;

        clipLeftPos = Math.max(leftBound, leftPos);
        clipWidth = (leftPos + floatPatternsCanvas.width) - clipLeftPos;
        maxWidth = rightBound - clipLeftPos;

        if (clipWidth > maxWidth) clipWidth = maxWidth;

        if (leftPos > 0) _bgX = 0;
        else _bgX = Math.abs(leftPos);

        if (clipWidth > 0) fillHorizontalAtrr(dataToDraw, 1, clipLeftPos, clipWidth, _bgX);
    };

    const fillVerticalData = (ctx, clip, dataToDraw) => {
        let mapShift = Engine.mapShift.getShift();

        var top = 0 * CFG.tileSize - Engine.map.offset[1];
        let topBound = clip[1] + mapShift[1] - Engine.map.offset[1];
        let bottomBound = clip[1] + clip[3] + mapShift[1] - Engine.map.offset[1];

        let isTop = yVector >= 0;
        let clipTopPos = null;
        let clipHeight = null;
        let _bgY = null;
        let topPos = null;
        let maxHeight = null;

        if (isTop) topPos = top - bgY;
        else topPos = top - bgY - floatPatternsCanvas.height;

        maxHeight = bottomBound - topBound;
        clipTopPos = topBound;
        clipHeight = (topPos + floatPatternsCanvas.height) - clipTopPos;

        let coverHeight = 0;

        if (clipHeight > maxHeight) {
            coverHeight = clipHeight - maxHeight;
            clipHeight = maxHeight;
        }

        _bgY = floatPatternsCanvas.height - clipHeight - coverHeight;

        if (clipHeight > 0) fillVerticalAtrr(dataToDraw, 0, clipTopPos, clipHeight, _bgY);

        if (isTop) topPos = top - bgY + floatPatternsCanvas.height;
        else topPos = top - bgY;

        clipTopPos = Math.max(topBound, topPos);
        clipHeight = (topPos + floatPatternsCanvas.height) - clipTopPos;
        maxHeight = bottomBound - clipTopPos;

        if (clipHeight > maxHeight) clipHeight = maxHeight;

        if (topPos > 0) _bgY = 0;
        else _bgY = Math.abs(topPos);

        if (clipHeight > 0) fillVerticalAtrr(dataToDraw, 1, clipTopPos, clipHeight, _bgY);
    };

    const fillHorizontalAtrr = (o, index, left, width, _bgX) => {
        let obj = o[index];

        obj.bgX = _bgX;
        obj.width = width;
        obj.left = left;
    };

    const fillVerticalAtrr = (o, index, top, height, _bgY) => {
        let obj = o[index];

        obj.bgY = _bgY;
        obj.height = height;
        obj.top = top;
    };

    const drawPartOfImage = (ctx, left, top, _bgX, _bgY, width, height) => {
        ctx.drawImage(
            floatPatternsCanvas,
            _bgX, _bgY,
            width, height,
            left, top,
            width, height
        );
    };

    const createFloatForeground = () => {
        floatPatternsCanvas = document.createElement('canvas');
        floatPatternsCtx = floatPatternsCanvas.getContext("2d");

        setFloatPatternsCanvasSize(Engine.map.size.x, Engine.map.size.y);

        floatPatternsCtx.fillStyle = floatPatternsCtx.createPattern(imagePattern, "repeat");
        floatPatternsCtx.fillRect(0, 0, floatPatternsCanvas.width, floatPatternsCanvas.height);

        if (color == null) return;

        floatPatternsCtx.globalCompositeOperation = 'source-in';
        //floatPatternsCtx.fillStyle                  = color;
        floatPatternsCtx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;

        floatPatternsCtx.fillRect(0, 0, floatPatternsCanvas.width, floatPatternsCanvas.height);
    };

    const setFloatPatternsCanvasSize = (tileX, tileY) => {

        let w = CFG.tileSize * tileX;
        let h = CFG.tileSize * tileY;

        let newW = (1 + Math.floor(w / imagePattern.width)) * imagePattern.width;
        let newH = (1 + Math.floor(h / imagePattern.height)) * imagePattern.height;

        floatPatternsCanvas.width = newW;
        floatPatternsCanvas.height = newH;
    };

    const setReady = (state) => {
        ready = state;
    };

    const draw = (ctx) => {
        if (!ready) return;
        drawFloatForeground(ctx);
    };

    const resetBgXBgY = () => {
        bgX = 0;
        bgY = 0;
    };

    const clearCanvasFadeIfExist = () => {
        if (!canvasFade) return;

        canvasFade = null;
    };

    const getActualAlpha = () => {
        if (canvasFade) return canvasFade.getFadeValue();

        return alpha;
    }

    //const getAlwaysDraw = () => {
    //    return alwaysDraw
    //};
    //
    //const setAlwaysDraw = (_alwaysDraw) => {
    //    alwaysDraw = _alwaysDraw
    //};
    //
    //this.getAlwaysDraw = getAlwaysDraw;
    //this.setAlwaysDraw = setAlwaysDraw;

    this.init = init;
    this.update = update;
    this.draw = draw;
    this.getOrder = getOrder;
    this.getActualAlpha = getActualAlpha;
    this.clearCanvasFadeIfExist = clearCanvasFadeIfExist;

}