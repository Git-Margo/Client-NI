let CanvasObjectCommons = require('@core/characters/CanvasObjectCommons.js');

module.exports = function() {


    let master = null;
    let dirCanvas = null;
    let color = null;
    let marginOutfit = null;
    let shadowBlur = null;

    const CANVAS_MARGIN = 10;
    const BLUR_DIRECTIONS = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1]
    ];


    const init = (_master, _color) => {
        setMaster(_master);
        setColor(_color);
        resetDirCanvas();
    };

    const getOrder = function() {
        return master.ry - 0.1;
    };

    const setColor = (_color) => {
        color = _color;
    };

    const resetDirCanvas = () => {
        dirCanvas = {};
    };

    const checkDirCanvas = (dir) => {
        return dirCanvas[dir] ? true : false
    };

    const createDirInCanvas = (dir) => {
        dirCanvas[dir] = {};
    };

    const createOneBlurInSpecificDirAndFrame = (dir, frameIndex, fw, fh) => {

        if (!checkDirCanvas(dir)) {
            createDirInCanvas(dir);
        }

        if (!checkCanvasDataInSpecificDirAndFrame(dir, frameIndex)) {

            let canvasData = createOneBlur(fw, fh);

            createCanvasDataInSpecificDirAndFrame(dir, frameIndex, canvasData);
        }
    };

    const createOneBlur = (fw, fh) => {

        let w = fw + marginOutfit * 2 + CANVAS_MARGIN * 2;
        let h = fh + marginOutfit * 2 + CANVAS_MARGIN * 2;
        let tmpCanvasData = createCanvasData(w, h);
        let finalCanvasData = createCanvasData(w, h);
        let canvas = tmpCanvasData.canvas;
        let ctx = tmpCanvasData.ctx;
        let finalCtx = finalCanvasData.ctx;
        let sprite = master.getSprite();
        let activeFrame = master.getActiveFrame();
        let bgX = master.getBgX();
        let bgY = master.getBgY();
        var height = fh;


        let rainbowGroups = getEngine().addonsPanel.getRainbowGroups();
        let opacity = rainbowGroups.getOpacityCharacterBlur() / 100;

        for (let k in BLUR_DIRECTIONS) {
            let direction = BLUR_DIRECTIONS[k];

            let x = marginOutfit + CANVAS_MARGIN * 2 - marginOutfit * direction[0];
            let y = marginOutfit + CANVAS_MARGIN * 2 - marginOutfit * direction[1];

            ctx.drawImage(
                sprite,
                bgX, bgY + (activeFrame * fh),
                fw, height,
                Math.round(x / 2), Math.round(y / 2),
                fw + marginOutfit, height + marginOutfit
            );
        }

        ctx.globalAlpha = opacity;
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';

        finalCtx.shadowBlur = shadowBlur;
        finalCtx.shadowColor = color;

        finalCtx.drawImage(canvas, 0, 0);

        return finalCanvasData;
    };

    const createCanvasDataInSpecificDirAndFrame = (dir, frameIndex, canvasData) => {
        dirCanvas[dir][frameIndex] = canvasData;
    };

    const checkCanvasDataInSpecificDirAndFrame = (dir, frameIndex) => {
        if (!dirCanvas[dir]) {
            return false
        }

        if (!dirCanvas[dir][frameIndex]) {
            return false
        }

        return true;
    };

    const getCanvasDataInSpecificDirAndFrame = (dir, frameIndex) => {
        return dirCanvas[dir][frameIndex];
    };

    const createCanvasData = (fw, fh) => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        setSizeCanvas(canvas, fw, fh);

        return {
            canvas: canvas,
            ctx: ctx
        };
    };

    const setSizeCanvas = (canvas, w, h) => {
        canvas.width = w;
        canvas.height = h;
    };

    const setMaster = (_master) => {
        master = _master;
    };

    const masterImLoaded = () => {
        return master.getImgLoaded();
    };

    const update = (dt) => {
        if (!masterImLoaded()) {
            return;
        }

        let dir = master.getDir();
        let activeFrame = master.getActiveFrame();
        let blurExist = checkCanvasDataInSpecificDirAndFrame(dir, activeFrame);

        if (!blurExist) {

            if (!getEngine().addonsPanel.checkRainbowGroups()) {
                return
            }

            let rainbowGroups = getEngine().addonsPanel.getRainbowGroups();

            setMarginOutfit(rainbowGroups.getMarginOutfitCharacterBlur());
            setShadowBlur(rainbowGroups.getShadowBlurCharacterBlur());

            createOneBlurInSpecificDirAndFrame(dir, activeFrame, master.getFw(), master.getFh());
        }

        this.rx = master.rx;
        this.ry = master.ry;
    };

    const setMarginOutfit = (_marginOutfit) => {
        marginOutfit = _marginOutfit;
    };

    const setShadowBlur = (_shadowBLur) => {
        shadowBlur = _shadowBLur;
    };

    const draw = (ctx) => {

        if (!masterImLoaded()) {
            return;
        }

        if (!getEngine().addonsPanel.checkRainbowGroups()) {
            return
        }

        let dir = master.getDir();
        let activeFrame = isSettingsOptionsInterfaceAnimationOn() ? master.getActiveFrame() : 0;
        let blurExist = checkCanvasDataInSpecificDirAndFrame(dir, activeFrame);

        if (!blurExist) {
            return;
        }

        drawBlur(ctx, dir, activeFrame);
    };

    const drawBlur = (ctx, dir, activeFrame) => {
        let canvasData = getCanvasDataInSpecificDirAndFrame(dir, activeFrame);
        let image = canvasData.canvas;
        let tileSize = CFG.tileSize;
        let halfTileSize = CFG.halfTileSize;
        let mapShift = Engine.mapShift.getShift();

        let fw = master.getFw();
        let fh = master.getFh();
        let offsetX = master.getOffsetX();
        let offsetY = master.getOffsetY();
        let halfFw = fw / 2;

        let left = Math.round(this.rx * tileSize + halfTileSize - halfFw + offsetX - Engine.map.offset[0] - mapShift[0]);
        let top = Math.round(this.ry * tileSize - fh + tileSize + offsetY - Engine.map.offset[1] - mapShift[1]);

        left -= marginOutfit;
        top -= marginOutfit;

        left -= CANVAS_MARGIN;
        top -= CANVAS_MARGIN;

        let clipImg = Engine.map.clipObject(left, top, image.width, image.height);

        if (!clipImg) {
            return
        }

        ctx.drawImage(
            image,
            clipImg.backgroundPositionX, clipImg.backgroundPositionY,
            clipImg.width, clipImg.height,
            clipImg.left, clipImg.top,
            clipImg.width, clipImg.height
        );
    };

    this.init = init;
    this.update = update;
    this.draw = draw;
    this.getOrder = getOrder;
    this.resetDirCanvas = resetDirCanvas;

};