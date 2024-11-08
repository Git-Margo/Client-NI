let RajGetSpecificData = require('core/raj/RajGetSpecificData');
let LightData = require('core/night/LightData');


module.exports = function() {

    const moduleData = {
        fileName: "BehaviorDynamicCommons.js"
    };

    let dynamicPoint = null;
    let dynamicPointImg = null;
    let drawHoleIndex = 0;
    let master = null;
    let framesWithHoles = null;

    const setMaster = (id, masterData, kindDynamicLight, additionalData) => {
        let targetObject = RajGetSpecificData.getTargetObject(masterData, additionalData);

        if (!targetObject) {
            return;
        }

        master = targetObject;

        if (!kindDynamicLight) {
            return;
        }


        if (masterData.kind == "WARRIOR") {
            return
        }

        const DYNAMIC_LIGHT_KIND = LightData.DYNAMIC_LIGHT_KIND;

        let objectDynamicLightManager = master.getObjectDynamicLightManager();

        switch (kindDynamicLight) {
            case DYNAMIC_LIGHT_KIND.BEHAVIOR_DYNAMIC_LIGHT:
                objectDynamicLightManager.addDynamicBehaviorLightId(id);
                break;
            case DYNAMIC_LIGHT_KIND.DYNAMIC_DIR_CHARACTER_LIGHT:
                objectDynamicLightManager.addDynamicDirCharacterLightId(id);
                break;
            case DYNAMIC_LIGHT_KIND.DYNAMIC_LIGHT:
                objectDynamicLightManager.addDynamicLightId(id);
                break;
            default:
                errorReport(moduleData.fileName, "setMaster", `undefined kindDynamicLight`, kindDynamicLight)
        }
    };

    const getXY = (id, d) => {
        let tileSize = CFG.tileSize;
        let halfTileSize = CFG.halfTileSize;
        let r = isset(d.r) ? d.r : getFramesWithHoles().getDefaultR();
        let p = r / tileSize - halfTileSize / tileSize;
        let offsetX = isset(d.offsetX) ? d.offsetX : 0;
        let offsetY = isset(d.offsetY) ? d.offsetY : 0;

        return {
            x: p + (Math.abs(offsetX) / tileSize),
            y: p + (Math.abs(offsetY) / tileSize)
        }

    };

    const prepareDynamicPointAndDynamicPointImg = (d, dataGradient) => {
        let nightFrameLength = Engine.nightController.getNightFrameLength();
        dynamicPoint = getFramesWithHoles().getOnePoint(d, nightFrameLength, true, dataGradient);
        dynamicPointImg = [];

        drawAllHole();
    };

    const drawAllHole = () => {
        setTimeout(function() {
            drawHoleByFrame(drawHoleIndex);

            drawHoleIndex++;

            if (dynamicPoint[drawHoleIndex]) drawAllHole();
            else {

            }
        }, 0)
    };

    const createLight = (d, realXYPos) => {
        if (!d.light) return null;

        let oneLightPoint = Engine.nightController.createOneLightPoint(d, realXYPos);

        if (!oneLightPoint) return null;

        return oneLightPoint;
    };

    const getOnlyNight = (d) => {
        if (!d.light) return null;

        if (d.light.onlyNight) return true;

        return null
    }

    const getDynamicHoleImgBuActualFrame = (actualFrame) => {
        //let dynamicPointImg = dynamicLightCommons.getDynamicPointImg();

        return dynamicPointImg[actualFrame];
    }

    const getDynamicHoleRByFrame = (actualFrame) => {
        if (!dynamicPoint[actualFrame]) {
            errorReport(moduleData.fileName, "getDynamicHoleRByFrame", `dynamicPoint[${actualFrame}] not exist`, dynamicPoint);

            return null
        }

        return dynamicPoint[actualFrame].r;
    }

    const getDynamicHoleOffsetXByFrame = (actualFrame) => {
        if (!dynamicPoint[actualFrame]) {
            errorReport(moduleData.fileName, "getDynamicHoleOffsetXByFrame", `dynamicPoint[${actualFrame}] not exist`, dynamicPoint);

            return null
        }

        return dynamicPoint[actualFrame].offsetX;
    }

    const getDynamicHoleOffsetYByFrame = (actualFrame) => {
        if (!dynamicPoint[actualFrame]) {
            errorReport(moduleData.fileName, "getDynamicHoleOffsetYByFrame", `dynamicPoint[${actualFrame}] not exist`, dynamicPoint);

            return null
        }

        return dynamicPoint[actualFrame].offsetY;
    }

    const setDynamicHoleRByFrame = (actualFrame, _r) => {
        if (!dynamicPoint[actualFrame]) {
            errorReport(moduleData.fileName, "setDynamicHoleRByFrame", `dynamicPoint[${actualFrame}] not exist`, dynamicPoint);
            return
        }

        return dynamicPoint[actualFrame].r = _r;
    }

    const setDynamicHoleXByFrame = (actualFrame, _x) => {
        if (!dynamicPoint[actualFrame]) {
            errorReport(moduleData.fileName, "setDynamicHoleXByFrame", `dynamicPoint[${actualFrame}] not exist`, dynamicPoint);
            return
        }

        return dynamicPoint[actualFrame].x = _x;
    }

    const setDynamicHoleYByFrame = (actualFrame, _y) => {
        if (!dynamicPoint[actualFrame]) {
            errorReport(moduleData.fileName, "setDynamicHoleYByFrame", `dynamicPoint[${actualFrame}] not exist`, dynamicPoint);
            return
        }

        return dynamicPoint[actualFrame].y = _y;
    }

    const drawHoleByFrame = (drawHoleIndex) => {
        let data = dynamicPoint[drawHoleIndex];

        if (!data) {
            errorReport(moduleData.fileName, "drawHoleByFrame", `dynamicPoint[${drawHoleIndex}] not exist`, dynamicPoint);
            return
        }

        let canvasData = null;

        if (dynamicPointImg[drawHoleIndex]) {
            let canvas = dynamicPointImg[drawHoleIndex];
            canvasData = {
                canvas: canvas,
                ctx: canvas.getContext("2d")
            }
        }

        dynamicPointImg[drawHoleIndex] = getFramesWithHoles().getDynamicHoleImg(data, canvasData);
    };

    const drawDynamicHole = (mainNightCtx, actualFrame, xPos, yPos, xNoise, yNoise, realXYPos) => {
        let currentDynamicHoleImg = getDynamicHoleImgBuActualFrame(actualFrame);

        if (!currentDynamicHoleImg) {
            return;
        }

        let tileSize = CFG.tileSize;
        let halfTileSize = CFG.halfTileSize;

        let left;
        let top;

        let fw = currentDynamicHoleImg.width;
        let fh = currentDynamicHoleImg.height;


        if (realXYPos) {

            left = xPos - fw / 2;
            top = yPos - fh / 2;

        } else {

            let mapShift = Engine.mapShift.getShift();




            if (xPos != null || yPos != null || !master) {

                left = xPos * tileSize + halfTileSize - fw / 2 - Engine.map.offset[0] - mapShift[0];
                top = yPos * tileSize - fh / 2 + halfTileSize - Engine.map.offset[1] - mapShift[1];

            } else {

                if (!master) {
                    return;
                }

                left = master.rx * tileSize + halfTileSize - fw / 2 +
                    (isset(master.ofsetX) ? master.ofsetX : 0) -
                    Engine.map.offset[0] - mapShift[0] + (typeof(master.leftPosMod) != 'undefined' ? master.leftPosMod : 0);

                top = master.ry * tileSize - fh / 2 + halfTileSize - Engine.map.offset[1] - mapShift[1];

            }



        }



        if (xNoise) left += xNoise * tileSize;
        if (yNoise) top += yNoise * tileSize;

        // mainNightCtx.fillStyle = "blue";
        // mainNightCtx.fillRect(left, top, 10, 10);

        mainNightCtx.drawImage(
            currentDynamicHoleImg,
            left,
            top
        );
    };
    /*
        const drawDynamicHoleBattle = (mainNightCtx, actualFrame, xPos, yPos, xNoise, yNoise, scale, position) => {
            let currentDynamicHoleImg = getDynamicHoleImgBuActualFrame(actualFrame);

            if (!currentDynamicHoleImg) {
                return;
            }

            let tileSize 				= CFG.tileSize;
            let left;
            let top;

            left    = xPos;
            top     = yPos;

            //top -=  CFG.tileSize * scale / 2;

            //left    = left + position.left;
            //top     = top + position.top;


            if (xNoise) left += xNoise * tileSize;
            if (yNoise) top  += yNoise * tileSize;

            mainNightCtx.fillStyle = "blue";
            mainNightCtx.fillRect(left, top, 100, 100);

            mainNightCtx.drawImage(
                currentDynamicHoleImg,
                left,
                top
            );
        }
    */
    const setFramesWithHoles = (_framesWithHoles) => {
        framesWithHoles = _framesWithHoles
    }

    const getFramesWithHoles = () => {
        if (framesWithHoles) {
            return framesWithHoles;
        }

        return Engine.dynamicLightsManager.getframesWithHoles();
    }

    const getDynamicPoint = () => dynamicPoint;

    const getMaster = () => master;

    const getDynamicPointImg = () => dynamicPointImg;

    this.getXY = getXY;
    this.getOnlyNight = getOnlyNight;
    this.getDynamicPoint = getDynamicPoint;
    this.getDynamicPointImg = getDynamicPointImg;
    this.getDynamicHoleRByFrame = getDynamicHoleRByFrame;
    this.setDynamicHoleRByFrame = setDynamicHoleRByFrame;

    this.setMaster = setMaster;
    this.getMaster = getMaster;

    this.getDynamicHoleOffsetXByFrame = getDynamicHoleOffsetXByFrame;
    this.getDynamicHoleOffsetYByFrame = getDynamicHoleOffsetYByFrame;

    this.setDynamicHoleXByFrame = setDynamicHoleXByFrame;
    this.setDynamicHoleYByFrame = setDynamicHoleYByFrame;

    this.drawDynamicHole = drawDynamicHole;

    this.drawHoleByFrame = drawHoleByFrame;
    this.prepareDynamicPointAndDynamicPointImg = prepareDynamicPointAndDynamicPointImg;
    this.createLight = createLight;
    this.getDynamicHoleImgBuActualFrame = getDynamicHoleImgBuActualFrame;
    //this.drawDynamicHoleBattle                  = drawDynamicHoleBattle;
    this.setFramesWithHoles = setFramesWithHoles;
};