let TextObject = require('core/canvasObject/TextObject');
let TextOffset = require('core/canvasObject/TextOffset');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');

module.exports = function() {

    this.rx = null;
    this.ry = null;

    let textImage = null;
    let master = null;
    let textObject = null;
    let dataToDraw = null;
    //let additionalOrder     = null;

    const moduleData = {
        fileName: "DataDrawer.js"
    };
    const textType = "px Arial regular";

    const init = (_master) => {
        initTextObject();
        setMaster(_master);
    };

    //const initOrder = () => {
    //    let canvasObjectType = master.getCanvasObjectType();
    //
    //    switch (canvasObjectType) {
    //        case CanvasObjectTypeData.NPC:
    //            additionalOrder = parseInt(master.getWt());
    //            break;
    //        case CanvasObjectTypeData.OTHER:
    //            additionalOrder = 0;
    //            break;
    //    }
    //}

    const initTextObject = () => {
        textObject = new TextObject();
    };

    const getOrder = () => {
        //return 500 + additionalOrder;
        return getEngine().renderer.getHighestOrderWithoutSort();
    };

    const setMaster = (_master) => {
        master = _master;
    };

    const update = (dt) => {

        if (!master) {
            errorReport(moduleData.fileName, "update", "master not exist!");
            return
        }

        this.rx = master.rx;
        this.ry = master.ry;
    };

    const getLevel = () => {
        const level = master.getLevel();
        const elasticLevel = master.getElasticLevel && master.getElasticLevel();

        if (!level && !elasticLevel) {
            return null;
        }

        if (level) {
            return level;
        }

        if (elasticLevel) {
            return elasticLevel
        }
    };

    const canCreateDataToDraw = () => {
        const nick = master.getNick();

        if (!nick) {
            errorReport(moduleData.fileName, "canCreateDataToDraw", "nick not exist", master);
            return false;
        }

        const kind = master.getKind();
        const handHeldMiniMapController = getEngine().miniMapController.handHeldMiniMapController;
        const drawNick = handHeldMiniMapController.getDataDrawerNickOfKindByName(kind);
        const drawProfAndLevel = handHeldMiniMapController.getDataDrawerProfAndLevelOfKindByName(kind);
        const level = getLevel();

        if (!drawNick && !drawProfAndLevel) {
            return false;
        }

        if (!drawNick && drawProfAndLevel && !level) {
            return false;
        }

        return true;
    };

    const draw = (ctx) => {
        if (dataToDraw === null) {
            manageDataToDrawWhenEmpty(ctx);
        }

        if (dataToDraw === false) {
            return;
        }

        drawDataDrawer(ctx);
    };

    const manageDataToDrawWhenEmpty = (ctx) => {
        if (!canCreateDataToDraw()) {
            setDataToDraw(false);
            return
        }

        setDataToDraw(createDataToDraw(ctx));
    };

    const drawDataDrawer = (ctx) => {

        const e = getEngine();
        const offsetLeft = 16;
        const mapShift = e.mapShift.getShift();
        const leftPosMod = (typeof(master.leftPosMod) != 'undefined' ? master.leftPosMod : 0);

        let offsetTop = 0;
        offsetTop += TextOffset.addOffsetOfEmo(master, dataToDraw.oneLine);
        offsetTop += TextOffset.addOffsetOfKillTimer(master, dataToDraw.oneLine);
        offsetTop += TextOffset.addOffsetOfCharacterTimer(master);

        let left = this.rx * CFG.tileSize - e.map.offset[0] - mapShift[0] + leftPosMod + offsetLeft;
        let top = this.ry * CFG.tileSize - e.map.offset[1] - mapShift[1] + CFG.tileSize - master.fh - offsetTop;

        if (!textImage) {
            textImage = createTextImage();
        }

        left = Math.round(left) - textImage.width / 2;
        top = Math.round(top) - textImage.height;

        ctx.drawImage(textImage, left, top);
    };

    const createTextImage = () => {
        const canvas = document.createElement('canvas');
        const canvasCtx = canvas.getContext("2d");
        const handHeldMiniMapController = getEngine().miniMapController.handHeldMiniMapController;
        const maxWidthBorder = parseInt(handHeldMiniMapController.getWidthDataDrawer());
        const fontSize = parseInt(getEngine().miniMapController.handHeldMiniMapController.getFontSizeDataDrawer());
        const color = handHeldMiniMapController.getColorByKind(master.getKind());

        const marginLeft = 2;
        const marginTop = 2;
        const safeWidthMargin = 20;
        const lineAmount = dataToDraw.oneLine ? 1 : 2;
        const topTrans = -1 * textObject.getTopTrans(fontSize, lineAmount, fontSize);

        canvas.width = maxWidthBorder + 2 * marginLeft + safeWidthMargin;
        canvas.height = topTrans + 2 * marginTop;

        let textTop = topTrans + marginTop;
        let textLeft = canvas.width / 2;

        //canvasCtx.fillStyle = "red";
        //canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        textObject.draw(canvasCtx, dataToDraw.txt, textLeft, textTop, fontSize, color, dataToDraw.maxWidthBorder, marginLeft, marginTop);

        return canvas;
    };

    const createDataToDraw = (ctx) => {
        const handHeldMiniMapController = getEngine().miniMapController.handHeldMiniMapController;
        const maxWidthBorder = parseInt(handHeldMiniMapController.getWidthDataDrawer());
        const fontSize = handHeldMiniMapController.getFontSizeDataDrawer();

        const nick = master.getNick();
        const kind = master.getKind();
        const prof = master.getProf();
        const level = getLevel();

        const drawNick = handHeldMiniMapController.getDataDrawerNickOfKindByName(kind);
        const drawProfAndLevel = handHeldMiniMapController.getDataDrawerProfAndLevelOfKindByName(kind);

        ctx.font = fontSize + textType;

        if (!drawNick && drawProfAndLevel) {
            return createDataDrawerOnlyLevel(ctx, level, prof, maxWidthBorder);
        }

        if (drawNick && !drawProfAndLevel) {
            return createDataDrawerOnlyNick(ctx, nick, maxWidthBorder);
        }

        return createFullDataDrawer(ctx, nick, level, prof, maxWidthBorder)
    };

    const createDataDrawerOnlyLevel = (ctx, level, prof, maxWidthBorder) => {
        let txt = `(${level}${prof ? prof : ''})`;
        let measureText = getMeasureTextWidthAndHeight(ctx, txt);

        return {
            txt: txt,
            width: measureText.width,
            height: measureText.height,
            maxWidthBorder: maxWidthBorder,
            oneLine: true
        };
    };

    const getMeasureTextWidthAndHeight = (ctx, txt) => {
        let mT = ctx.measureText(txt);

        return {
            width: mT.width,
            height: mT.actualBoundingBoxAscent + mT.actualBoundingBoxDescent
            //height: mT.fontBoundingBoxAscent + mT.fontBoundingBoxDescent
        }
    }

    const createDataDrawerOnlyNick = (ctx, nick, maxWidthBorder) => {
        let txt = nick;

        while (Math.ceil(ctx.measureText(txt).width) > maxWidthBorder) {
            txt = txt.slice(0, -1);
        }

        let measureText = getMeasureTextWidthAndHeight(ctx, txt);

        return {
            txt: txt,
            width: measureText.width,
            height: measureText.height,
            maxWidthBorder: maxWidthBorder,
            oneLine: true
        };
    };

    const createFullDataDrawer = (ctx, nick, level, prof, maxWidthBorder) => {
        let widthOnlyNick = null;
        let txt = nick;
        let tempText = txt;

        while (Math.ceil(ctx.measureText(txt).width) > maxWidthBorder) {
            txt = txt.slice(0, -1);
        }

        if (txt[txt.length - 1] == " ") txt = txt.slice(0, -1);

        if (level) {
            widthOnlyNick = Math.ceil(ctx.measureText(txt).width);
            txt += ` (${level}${prof ? prof : ''})`
        }

        let width = Math.ceil(ctx.measureText(txt).width);

        if (level && width < maxWidthBorder) { // lvl always to next line
            maxWidthBorder = widthOnlyNick;
        }

        if (txt == tempText) { // nick without level
            //debugger;
        }

        let measureText = getMeasureTextWidthAndHeight(ctx, txt);

        return {
            txt: txt,
            width: width,
            height: measureText.height,
            maxWidthBorder: maxWidthBorder,
            oneLine: false
        };
    };

    const setDataToDraw = (_dataToDraw) => {
        dataToDraw = _dataToDraw;
    };

    const clearDataToDraw = () => {
        setDataToDraw(null);
        textImage = null;
    };

    this.draw = draw;
    this.update = update;
    this.getOrder = getOrder;
    this.clearDataToDraw = clearDataToDraw;
    this.init = init;
    //this.initOrder          = initOrder;

};