//let RajData      = require('@core/raj/RajData');

module.exports = function() {

    const defaultR = 30;
    const defaultVariation = 0;
    const defaultGradientPercent1 = 40;
    const defaultGradientPercent2 = 40;
    const defaultMiddleOfCanvas = false;

    let holeTimeout = null;

    let realXYPos = false;

    const init = () => {

    }

    const getDefaultR = () => {
        return defaultR;
    }

    const setRealXYPos = (_realXYPos) => {
        realXYPos = _realXYPos;
    }

    const createFrames = (holesList, filterColor, frameLength, fastFramesIdArray, finishOneFrameCallback) => {
        let i = 0;
        setTimeoutLoopToCreateFrames(holesList, filterColor, i, fastFramesIdArray, frameLength, finishOneFrameCallback);
    };

    const clearHoleTimeout = () => {
        if (holeTimeout) clearTimeout(holeTimeout)
        holeTimeout = null;
    }

    const setTimeoutLoopToCreateFrames = (holesList, filterColor, frameIndex, fastFramesIdArray, frameLength, finishOneFrameCallback) => {


        createOneFrame(holesList, filterColor, frameIndex, fastFramesIdArray, (oneFrame) => {

            finishOneFrameCallback(oneFrame);

            frameIndex++;

            if (frameIndex == frameLength) return;

            setTimeoutLoopToCreateFrames(holesList, filterColor, frameIndex, fastFramesIdArray, frameLength, finishOneFrameCallback);
        });

    };

    const createOneFrame = (holesList, filterColor, frameIndex, fastFramesIdArray, finishOneFrameCallback) => {
        let canvasData = createCanvasData();

        let canvas = canvasData.canvas;
        let ctx = canvasData.ctx;

        setSizeCanvas(canvas);
        setColorOfFrame(ctx, canvas, filterColor);

        if (!holesList.length) {
            finishOneFrameCallback(canvas);
            return
        }

        createMaskAndUseMaskOnCanvas(canvas, ctx, holesList, frameIndex, fastFramesIdArray, finishOneFrameCallback);
    };

    const drawAllHolesOnCanvasMask = (canvasMask, ctxMask, lightPointsList, nightFrameIndex, fastFramesIdArray, finishDrawHolesCallback) => {

        let holeIndex = 0;
        setTimeoutLoopToDrawHoles(ctxMask, lightPointsList, nightFrameIndex, fastFramesIdArray, holeIndex, finishDrawHolesCallback)
    };

    const setTimeoutLoopToDrawHoles = (ctxMask, lightPointsList, nightFrameIndex, fastFramesIdArray, holeIndex, finishDrawHolesCallback) => {
        clearHoleTimeout();

        let oneLightPoint = lightPointsList[holeIndex][nightFrameIndex];

        drawOneHole(oneLightPoint, ctxMask);

        holeIndex++;

        if (holeIndex == lightPointsList.length) {
            finishDrawHolesCallback();
            return;
        }

        //if (nightFrameIndex == 0) {
        if (fastFramesIdArray.indexOf(nightFrameIndex) > -1) {
            setTimeoutLoopToDrawHoles(ctxMask, lightPointsList, nightFrameIndex, fastFramesIdArray, holeIndex, finishDrawHolesCallback)
            return
        }

        holeTimeout = setTimeout(function() {
            setTimeoutLoopToDrawHoles(ctxMask, lightPointsList, nightFrameIndex, fastFramesIdArray, holeIndex, finishDrawHolesCallback)
        }, 0);
    }

    const drawOneHole = (oneLightPoint, ctxMask) => {

        let x;
        let y;

        if (realXYPos) {

            if (oneLightPoint.middleOfCanvas) {
                x = ctxMask.canvas.width / 2;
                y = ctxMask.canvas.height / 2;
            } else {
                let zoomFactor = Engine.zoomFactor == null ? 1 : Engine.zoomFactor;
                let battle = getEngine().battle;
                let positionLeft = battle.getBattleLeft() / zoomFactor;
                let positionTop = battle.getBattleTop() / zoomFactor;
                x = positionLeft + oneLightPoint.x;
                y = positionTop + oneLightPoint.y;
            }

        } else {
            x = oneLightPoint.x * CFG.tileSize + CFG.tileSize / 2;
            y = oneLightPoint.y * CFG.tileSize + CFG.tileSize / 2;
        }


        let r = oneLightPoint.r;
        let offsetX = oneLightPoint.offsetX;
        let offsetY = oneLightPoint.offsetY;

        x = x + offsetX;
        y = y + offsetY;

        let grd = ctxMask.createRadialGradient(x, y, 0, x, y, r);

        // // TODO: TO FIX!!!! startOpacity0, startOpacity1, startOpacity2

        grd.addColorStop(oneLightPoint.startOpacity0, oneLightPoint.stop0);
        grd.addColorStop(oneLightPoint.startOpacity1, oneLightPoint.stop1);
        grd.addColorStop(oneLightPoint.startOpacity2, oneLightPoint.stop2);

        // if (realXYPos) {
        //     ctxMask.fillStyle = "rgba(255, 0, 0, 0.1)";
        //     ctxMask.fillRect(0, 0, ctxMask.canvas.width, ctxMask.canvas.height);
        // }

        ctxMask.fillStyle = grd;
        ctxMask.beginPath();
        ctxMask.arc(x, y, r, 0, 2 * Math.PI);
        //ctxMask.shadowBlur = 5;
        //ctxMask.fillRect(r/2, r/2, r, r);
        ctxMask.fill();
    };

    const getOpacityOfGradient = (startVal, addVal) => {
        return Math.floor((startVal + Math.random() * addVal) * 100) / 100;
    };

    const createMaskAndUseMaskOnCanvas = (canvas, ctx, lightPointsList, nightFrameIndex, fastFramesIdArray, finishOneFrameCallback) => {
        let canvasData = createCanvasData();

        let canvasMask = canvasData.canvas;
        let ctxMask = canvasData.ctx;

        setSizeCanvas(canvasMask);
        drawAllHolesOnCanvasMask(canvasMask, ctxMask, lightPointsList, nightFrameIndex, fastFramesIdArray, function() {

            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.drawImage(canvasMask, 0, 0);
            ctx.restore();

            //console.log('finish one frame', nightFrameIndex);
            finishOneFrameCallback(canvas);
        });
    };

    const setColorOfFrame = (ctx, canvas, color) => {
        let w = canvas.width;
        let h = canvas.height;
        ctx.fillStyle = "rgba(" + color + ")";

        ctx.fillRect(0, 0, w, h);
    };

    const setSizeCanvas = function(canvas) {
        canvas.width = Engine.map.size.x * CFG.tileSize;
        canvas.height = Engine.map.size.y * CFG.tileSize;
    };

    const createCanvasData = () => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        return {
            canvas: canvas,
            ctx: ctx
        };
    };

    //const checkDataToCreateFrames = (v, file, module) => {
    //    if (!v instanceof Object) {
    //        errorReport(file, 'checkDataToCreateFrames', 'Incorrect Data! ' + module + ' data have to object! E.G. {"' + module + '":{action:"CREATE", "list":[{"x":5,y:5}]}} or {"' + module + '":{action:"REMOVE"}}', v);
    //        return false;
    //    }
    //
    //    if (!isset(v.action)) {
    //        errorReport(file, 'checkDataToCreateFrames', 'Attr action not exist!', v);
    //        v.action = RajData.action.CREATE;
    //        //return false;
    //    }
    //
    //    if (![RajData.action.CREATE, RajData.action.REMOVE].includes(v.action)) {
    //        errorReport(file, 'checkDataToCreateFrames', 'Attr action can be CREATE or REMOVE!', v);
    //        return false;
    //    }
    //
    //    if (!isset(v.list)) {
    //        if (v.action != "REMOVE") {
    //            errorReport(file, 'checkDataToCreateFrames', 'Attr list not exist!', v);
    //            return false;
    //        }
    //    }
    //
    //    if (isset(v.color)) {
    //        //let colorCorrect = Engine.weather.checkFilterDataCorrect(file, v);  // todo now I remove this, but in future need to check v.color in some way
    //        //if (!colorCorrect) return false;
    //    }
    //
    //
    //    return true;
    //};

    const getHolesList = (rayData, frameLength, file) => {
        let lightPointsList = [];

        for (let k in rayData.list) {

            let data = rayData.list[k];

            //if (!checkCorrectHoleData(data, rayData.list, file)) continue;

            //if (data.case && !Engine.rajCase.checkFullFillCase(data.case)) continue;
            if (!Engine.rajCase.checkFullFillCase(data.case)) continue;

            let onePoint = getOnePoint(data, frameLength, true);

            lightPointsList.push(onePoint);
        }

        return lightPointsList;
    };

    //const checkCorrectHoleData = (data, allData, file) => {
    //
    //    let fName = "checkCorrectHoleData";
    //
    //    if (!isset(data.x)) {
    //        errorReport(file, fName, 'Attr x not exist in lightPoint!', allData);
    //        return false;
    //    }
    //    if (!isset(data.y)) {
    //        errorReport(file, fName, 'Attr y not exist in lightPoint!', allData);
    //        return false;
    //    }
    //    if (isset(data.r)) {
    //        if (!isIntVal(data.r)) {
    //            errorReport(file, fName, 'Attr r have to integer', allData);
    //            return false;
    //        }
    //    }
    //    if (isset(data.gradientPercent1)) {
    //        let gradientPercent1 = data.gradientPercent1;
    //        if (!isIntVal(gradientPercent1)) {
    //            errorReport(file, fName, 'Attr gradientPercent1 have to integer', allData);
    //            return false;
    //        }
    //        if (gradientPercent1 < 0 || gradientPercent1 > 100) {
    //            errorReport(file, fName, 'Attr gradientPercent1 have to val 0 - 100', allData);
    //            return false;
    //        }
    //    }
    //    if (isset(data.gradientPercent2)) {
    //        let gradientPercent2 = data.gradientPercent2;
    //        if (!isIntVal(gradientPercent2)) {
    //            errorReport(file, fName, 'Attr gradientPercent2 have to integer', allData);
    //            return false;
    //        }
    //        if (gradientPercent2 < 0 || gradientPercent2 > 100) {
    //            errorReport(file, fName, 'Attr gradientPercent2 have to val 0 - 100', allData);
    //            return false;
    //        }
    //    }
    //    if (isset(data.offsetX)) {
    //        if (!isIntVal(data.offsetX)) {
    //            errorReport(file, fName, 'Attr offsetX have to integer', allData);
    //            return false;
    //        }
    //    }
    //    if (isset(data.offsetY)) {
    //        if (!isIntVal(data.offsetY)) {
    //            errorReport(file, fName, 'Attr offsetY have to integer', allData);
    //            return false;
    //        }
    //    }
    //
    //    return true
    //};

    const getOnePoint = (data, frameLength, hole, dataGradient) => {
        let variation = defaultVariation;
        //let r                 = data.r ? data.r : defaultR;
        let gradientPercent1 = isset(data.gradientPercent1) ? data.gradientPercent1 : defaultGradientPercent1;
        let gradientPercent2 = isset(data.gradientPercent2) ? data.gradientPercent2 : defaultGradientPercent2;
        let middleOfCanvas = isset(data.middleOfCanvas) ? data.middleOfCanvas : defaultMiddleOfCanvas;
        let offsetX = data.offsetX ? data.offsetX : 0;
        let offsetY = data.offsetY ? data.offsetY : 0;
        let x = data.x;
        let y = data.y;
        let r = null;

        let gradient = null;
        let light = null;

        if (hole) {
            r = data.r ? data.r : defaultR
            light = null;

            //let firstA = coverExtraLightDataHole ? coverExtraLightDataHole.opacity : 1.0;

            if (dataGradient) gradient = dataGradient;
            else gradient = [{
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 1.0
                },
                {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0.2
                },
                {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0.0
                }
            ];


        } else {
            let color = data.light.color ? data.light.color : {
                r: 235,
                g: 228,
                b: 255,
                a: 1.0
            };
            r = data.light.r ? data.light.r : (data.r ? data.r : defaultR);
            light = data.light;
            gradient = [{
                    r: color.r,
                    g: color.g,
                    b: color.b,
                    a: color.a
                },
                {
                    r: color.r,
                    g: color.g,
                    b: color.b,
                    a: 0.0
                }
            ];

        }

        let onePoint = [];

        for (let i = 0; i < frameLength; i++) {

            let oneHole = getOneHole(r, variation, gradientPercent1, gradientPercent2, x, y, offsetX, offsetY, light, gradient, middleOfCanvas);

            onePoint.push(oneHole)
        }

        return onePoint;
    };

    const getOneHole = (r, variation, gradientPercent1, gradientPercent2, x, y, offsetX, offsetY, light, gradient, middleOfCanvas) => {
        let o = {
            r: r + (Math.round(Math.random()) ? 1 : -1) * variation,
            gradientPercent1: gradientPercent1,
            gradientPercent2: gradientPercent2,
            //stop0             : "rgba(235,228,1,1.0)",
            //stop1             : "rgba(235,228,1,0.2)",
            //stop2             : "rgba(235,228,1,0.0)",
            middleOfCanvas: middleOfCanvas,
            x: x,
            y: y,
            offsetX: offsetX,
            offsetY: offsetY,
            light: light,
            gradientLength: gradient.length
        };


        let r1StartV = 0.5;
        let r2StartV = 0.9;
        let r1AddV = 0.199;
        let r2AddV = 0.099;

        for (let i = 0; i < gradient.length; i++) {
            let c = gradient[i];
            o['stop' + i] = `rgba(${c.r},${c.g},${c.b},${c.a})`;
            o['stop' + i + 'Data'] = {
                r: c.r,
                g: c.g,
                b: c.b,
                a: c.a
            };

            // TODO: This is the loop? THIS IS THE MADNESS!

            let startOpacityVal = null;

            if (i == 0) startOpacityVal = 0;
            if (i == 1) startOpacityVal = getOpacityOfGradient(r1StartV, r1AddV * gradientPercent1 / 100);
            if (i == 2) startOpacityVal = getOpacityOfGradient(r2StartV, r2AddV * gradientPercent2 / 100);

            o['startOpacity' + i] = startOpacityVal
        }

        //o.nightOpacity = Engine.nightController.getNightOpacity();

        return o;
    }

    const onClear = () => {
        //console.log('onClear framesWithHoles')
        clearHoleTimeout();
    }

    const getHoleObject = (r) => {
        let tileSize = CFG.tileSize;
        let halfTileSize = CFG.halfTileSize;
        let x = r / tileSize - halfTileSize / tileSize;
        let y = r / tileSize - halfTileSize / tileSize;

        return {
            x: x,
            y: y,
            r: r,
            offsetX: 0,
            offsetY: 0,
            startOpacity0: 0,
            startOpacity1: 0.51,
            startOpacity2: 0.91,
            stop0: "rgba(0,0,0,1)",
            stop1: "rgba(0,0,0,0.2)",
            stop2: "rgba(0,0,0,0)"
        }
    };

    const getDynamicHoleImg = (holeObjectData, _canvasData) => {
        let canvasData = _canvasData ? _canvasData : createCanvasData();
        let holeImgCtx = canvasData.ctx;

        let dynamicHoleImg = canvasData.canvas;
        let offsetX = holeObjectData.offsetX;
        let offsetY = holeObjectData.offsetY;
        let width = holeObjectData.r * 2 + Math.abs(offsetX) * 2;
        let height = holeObjectData.r * 2 + Math.abs(offsetY) * 2;

        if (dynamicHoleImg.width != width) dynamicHoleImg.width = width;
        if (dynamicHoleImg.height != height) dynamicHoleImg.height = height;

        drawOneHole(holeObjectData, holeImgCtx);

        return dynamicHoleImg;
    };

    this.init = init;
    this.getHolesList = getHolesList;
    //this.checkDataToCreateFrames    = checkDataToCreateFrames;
    this.createFrames = createFrames;
    this.getOnePoint = getOnePoint;
    this.drawOneHole = drawOneHole;
    this.createCanvasData = createCanvasData;
    this.setSizeCanvas = setSizeCanvas;
    this.getDynamicHoleImg = getDynamicHoleImg;
    this.onClear = onClear;
    this.getDefaultR = getDefaultR;
    this.setRealXYPos = setRealXYPos;

};