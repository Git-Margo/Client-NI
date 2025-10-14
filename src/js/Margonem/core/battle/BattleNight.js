let FramesWithHoles = require('@core/FramesWithHoles');
let BehaviorDynamicLight = require('@core/night/BehaviorDynamicLight');
let DirDynamicLight = require('@core/night/DirDynamicLight.js');

module.exports = function() {

    let moduleData = {
        fileName: "BattleNight.js"
    };
    let battleNight = null;
    let battleNightCtx = null;
    let ready = false;

    let actualFrame = null;
    let framesOfNight = [];
    let frameTime = 0.2;
    let timePassed = 0;
    let nightFrameLength = 4;

    let extraLight = {};
    let behaviorDynamicLight = {};
    let dynamicDirCharacterLight = {};
    let cashedExtraLightList = null;
    let cashedBehaviorDynamicLight = null;
    let cashedDynamicDirCharacterLight = null;
    let cashedNightColor = null;

    let framesWithHoles;

    const init = () => {
        framesWithHoles = new FramesWithHoles();
        framesWithHoles.setRealXYPos(true);

        resetActualFrame();

        initBattleNight();
        initFramesOfNight();

        updateAllCanvasSize();

        setReady(true);
    };

    const setReady = (_ready) => {
        ready = _ready
    }

    const initBattleNight = () => {
        battleNight = Engine.battle.$.find('.battle-night2-layer')[0];
        battleNightCtx = battleNight.getContext('2d');
    };

    const updateAllCanvasSize = () => {
        let $b = getEngine().battle.$;
        let w = $b.width();
        let h = $b.height();

        updateBattleNightSize(w, h);
        updateFramesOfNightSize(w, h);
    };

    const initFramesOfNight = () => {
        for (let i = 0; i < nightFrameLength; i++) {
            let canvas = document.createElement('canvas');
            framesOfNight.push(canvas);
        }
    };

    const updateFramesOfNightSize = (w, h) => {
        for (let i = 0; i < nightFrameLength; i++) {
            framesOfNight[i].width = w;
            framesOfNight[i].height = h;
        }
    };

    const updateBattleNightSize = (w, h) => {
        battleNight.width = w;
        battleNight.height = h;
    };

    const update = (dt) => {
        if (framesOfNight.length > 1) {
            timePassed += dt;

            if (timePassed > frameTime) {
                timePassed = 0;
                actualFrame++;
                if (actualFrame + 1 > framesOfNight.length) {
                    //actualFrame = 0;
                    resetActualFrame();
                }
            }
        }


        let aBehaviorDynamicLight = getLightFromBehaviorDynamicLight();
        let aDynamicDirCharacterLight = getLightFromDynamicDirCharacterLight();

        if (aBehaviorDynamicLight.length) {

            for (let k in aBehaviorDynamicLight) {
                aBehaviorDynamicLight[k].update(dt, actualFrame);
            }

        }

        if (aDynamicDirCharacterLight.length) {

            for (let k in aDynamicDirCharacterLight) {
                aDynamicDirCharacterLight[k].update(dt, actualFrame);
            }

        }

        //for (let k in a) {
        //    a[k].update(dt, actualFrame);
        //}

    };

    const draw = () => {
        //ready = true;


        clearBatleNightCanvas();

        if (!checkCanDraw()) {
            return
        }

        //if (getEngine().nightController.checkNight()) {
        drawActualFrameOfNight();
        drawBehaviorDynamicLightHole();
        drawDynamicDirCharacterLightHole();
        //}

        drawExtraLight();
        drawBehaviorDynamicLight();
        drawDynamicDirCharacterLight();
    };

    const drawExtraLight = () => {
        let a = getLightFromExtraLight();

        for (let k in a) {
            a[k].draw(battleNightCtx);
        }
    };

    const drawBehaviorDynamicLightHole = () => {
        let a = getLightFromBehaviorDynamicLight();


        if (!a.length) {
            return;
        }

        battleNightCtx.save();
        battleNightCtx.globalCompositeOperation = 'destination-out';

        for (let k in a) {
            let oneBehaviorDynamic = a[k];


            oneBehaviorDynamic.draw(battleNightCtx, actualFrame);

            // let holes = oneBehaviorDynamic.getDynamicPoint();
            // if (holes[actualFrame]) {
            //     framesWithHoles.drawOneHole(holes[actualFrame], battleNightCtx, true);
            // }
        }

        battleNightCtx.restore();
    }

    const drawDynamicDirCharacterLightHole = () => {
        let a = getLightFromDynamicDirCharacterLight();


        if (!a.length) {
            return;
        }

        battleNightCtx.save();
        battleNightCtx.globalCompositeOperation = 'destination-out';

        for (let k in a) {
            let oneDynamicDirCharacter = a[k];


            oneDynamicDirCharacter.draw(battleNightCtx, actualFrame);

            // let holes = oneBehaviorDynamic.getDynamicPoint();
            // if (holes[actualFrame]) {
            //     framesWithHoles.drawOneHole(holes[actualFrame], battleNightCtx, true);
            // }
        }

        battleNightCtx.restore();
    }

    const drawBehaviorDynamicLight = () => {
        let a = getLightFromBehaviorDynamicLight();

        for (let k in a) {
            let oneLight = a[k].getLight();

            if (!oneLight) {
                continue;
            }

            oneLight.draw(battleNightCtx, actualFrame);
        }
    }

    const drawDynamicDirCharacterLight = () => {
        let a = getLightFromDynamicDirCharacterLight();

        for (let k in a) {
            let oneLight = a[k].getLight();

            if (!oneLight) {
                continue;
            }

            oneLight.draw(battleNightCtx, actualFrame);
        }
    }

    const clearBatleNightCanvas = () => {
        let w = battleNight.width;
        let h = battleNight.height;

        battleNightCtx.clearRect(0, 0, w, h);
    };

    const checkCanDraw = () => {
        const FUNC = "drawActualFrameOfNight";

        if (!framesOfNight[actualFrame]) {
            //errorReport(moduleData.fileName, FUNC, "framesOfNight[actualFrame] not exist!");
            return false
        }

        if (!battleNight.width) {
            //errorReport(moduleData.fileName, FUNC, "battleNight.width not exist!")
            return false
        }

        if (!battleNight.height) {
            //errorReport(moduleData.fileName, FUNC, "battleNight.height not exist!")
            return false
        }

        if (!isSettingsOptionsCycleDayAndNightOn()) {
            return false;
        }

        return true
    }

    const drawActualFrameOfNight = () => {
        //const FUNC = "drawActualFrameOfNight";
        //
        //if (!framesOfNight[actualFrame]) {
        //    errorReport(moduleData.fileName, FUNC, "framesOfNight[actualFrame] not exist!");
        //    return
        //}
        //
        //if (!battleNight.width) {
        //    errorReport(moduleData.fileName, FUNC, "battleNight.width not exist!")
        //    return
        //}
        //
        //if (!battleNight.height) {
        //    errorReport(moduleData.fileName, FUNC, "battleNight.height not exist!")
        //    return
        //}

        battleNightCtx.drawImage(framesOfNight[actualFrame], 0, 0);
    };

    const getLightFromExtraLight = () => {
        let a = [];
        //let isNight 	= getEngine().nightController.checkNight();
        let isNight = checkCanDraw();

        for (let k in extraLight) {
            let add = false;
            let onlyNight = extraLight[k].onlyNight;
            let oneExtraLight = extraLight[k].light;

            if (!oneExtraLight) continue;

            if (onlyNight) {

                if (isNight) add = true;

            } else add = true;


            if (add) a.push(extraLight[k].light);
        }

        return a;
    };

    const getLightFromBehaviorDynamicLight = () => {
        let a = [];
        //let isNight 	= getEngine().nightController.checkNight();
        let isNight = checkCanDraw();

        for (let k in behaviorDynamicLight) {
            let add = false;
            let onlyNight = behaviorDynamicLight[k].getOnlyNight();
            let oneExtraLight = behaviorDynamicLight[k].getLight();
            let alive = behaviorDynamicLight[k].getMaster().hpp > 0

            if (!alive) continue;

            if (!oneExtraLight) continue;

            if (onlyNight) {

                if (isNight) add = true;

            } else add = true;

            if (add) a.push(behaviorDynamicLight[k]);
        }

        return a;
    };

    const getLightFromDynamicDirCharacterLight = () => {
        let a = [];
        //let isNight 	= getEngine().nightController.checkNight();
        let isNight = checkCanDraw();

        for (let k in dynamicDirCharacterLight) {
            let add = false;
            let onlyNight = dynamicDirCharacterLight[k].getOnlyNight();
            let oneExtraLight = dynamicDirCharacterLight[k].getLight();
            let alive = dynamicDirCharacterLight[k].getMaster().hpp > 0;

            if (!alive) continue;

            if (!oneExtraLight) continue;

            if (onlyNight) {

                if (isNight) add = true;

            } else add = true;

            if (add) a.push(dynamicDirCharacterLight[k]);
        }

        return a;
    };

    const rebuildBattleNight = () => {
        updateAllCanvasSize();

        createBattleNight();
    };

    const getWarriors = () => {
        let o = {};
        for (let warriorId in Engine.battle.warriorsList) {
            let originalId = Engine.battle.warriorsList[warriorId].getOriginalId();
            o[originalId] = {
                warriorId: warriorId,
                originalId: originalId
            };
        }

        return o;
    };

    const createBattleNight = () => {


        getEngine().battle.warriors.resetActiveFrame();
        resetActualFrame();

        clearExtraLight();
        if (cashedBehaviorDynamicLight == null) clearBehaviorDynamicLight();
        if (cashedDynamicDirCharacterLight == null) clearDynamicDirCharacterLight();

        prepareAllExtraLight();
        if (cashedBehaviorDynamicLight == null) prepareAllBehaviorDynamicLight();
        if (cashedDynamicDirCharacterLight == null) prepareAllDynamicDirCharacterLight();
        drawEmptyNightOnCanvas();
        drawHolesOnFramesOfNight();
    };

    const drawHolesOnFramesOfNight = () => {
        for (let id in extraLight) {
            createOnePointOnExistFramesOfNight(id, framesOfNight);
        }
    };

    const setCashedExtraLightList = (a) => {
        cashedExtraLightList = a;
    };

    const setCashedBehaviorDynamicLightList = (a) => {
        cashedBehaviorDynamicLight = a;
    };

    const setCashedDynamicDirLightList = (a) => {
        cashedDynamicDirCharacterLight = a;
    };

    const setCashedNightColor = (_cashedNightColor) => {
        cashedNightColor = _cashedNightColor
    };

    const prepareAllExtraLight = () => {
        let warriors = getWarriors();
        // let a           = Engine.rajExtraLight.getExtraLightByNpcIdArray(warriors);
        let a;

        if (cashedExtraLightList) {
            a = [];

            for (let k in cashedExtraLightList) {
                let oneCashedExtraLight = cashedExtraLightList[k];
                let warriorId = oneCashedExtraLight.warriorId;

                if (Engine.battle.warriorsList[warriorId]) a.push(oneCashedExtraLight);
            }

        } else {
            a = Engine.rajExtraLight.getExtraLightByNpcIdArray(warriors);
            if (a.length) {
                setCashedExtraLightList(a);
            }
        }

        if (!a.length) return;

        for (let k in a) {
            let oneDataArrayToDrawHole = a[k];
            let master = oneDataArrayToDrawHole.extraLight.master;
            let warriorId = oneDataArrayToDrawHole.warriorId;
            let extraLightId = oneDataArrayToDrawHole.extraLight.id;

            if (master.kind == "NPC") {
                let npcWarrior = Engine.battle.warriorsList[warriorId];

                if (!npcWarrior) {
                    continue;
                }

                if (npcWarrior.hpp > 0) {
                    addExtraLight(extraLightId, oneDataArrayToDrawHole.extraLight, warriorId, npcWarrior.xPos, npcWarrior.yPos);
                }
            }
        }

    };

    const prepareAllBehaviorDynamicLight = () => {
        let warriors = getWarriors();
        //debugger
        //let a           = Engine.behaviorDynamicLightsManager.getBehaviorDynamicLightByNpcIdArray(warriors);
        let a = null;


        if (cashedBehaviorDynamicLight) {
            a = [];

            for (let k in cashedBehaviorDynamicLight) {
                let oneCashedBehaviorDynamicLight = cashedBehaviorDynamicLight[k];
                let warriorId = oneCashedBehaviorDynamicLight.warriorId;

                let npcWarrior = Engine.battle.warriorsList[warriorId];

                if (!npcWarrior) {
                    continue;
                }

                if (npcWarrior.hpp > 0) {
                    a.push(oneCashedBehaviorDynamicLight);
                }
            }

        } else {
            a = Engine.behaviorDynamicLightsManager.getBehaviorDynamicLightByNpcIdArray(warriors);
            if (a.length) {
                setCashedBehaviorDynamicLightList(a);
            }
        }

        if (!a.length) return;

        for (let k in a) {
            let oneDataArrayToDrawHole = a[k];
            let master = oneDataArrayToDrawHole.behaviorDynamicLight.getMaster();
            let warriorId = oneDataArrayToDrawHole.warriorId;
            let extraLightId = oneDataArrayToDrawHole.behaviorDynamicLight.getId();

            if (master.getCanvasObjectType() == "NPC") {
                let npcWarrior = Engine.battle.warriorsList[warriorId];
                if (!npcWarrior) continue;
                //addBehaviorDynamicLight(extraLightId, oneDataArrayToDrawHole.behaviorDynamicLight, warriorId, npcWarrior.xPos, npcWarrior.yPos);
                addBehaviorDynamicLight(extraLightId, oneDataArrayToDrawHole.behaviorDynamicLight, warriorId);
            }
        }

    };

    const prepareAllDynamicDirCharacterLight = () => {
        let warriors = getWarriors();
        let a = null;


        if (cashedDynamicDirCharacterLight) {
            a = [];

            for (let k in cashedDynamicDirCharacterLight) {
                let oneCashedDynamicDirCharacterLight = cashedDynamicDirCharacterLight[k];
                let warriorId = oneCashedDynamicDirCharacterLight.warriorId;

                if (warriorId <= 0) {
                    continue;
                }

                let npcWarrior = Engine.battle.warriorsList[warriorId];

                if (!npcWarrior) {
                    continue;
                }

                if (npcWarrior.hpp > 0) {
                    a.push(oneCashedDynamicDirCharacterLight);
                }
            }

        } else {
            a = Engine.dynamicDirCharacterLightsManager.getDynamicDirLightByNpcIdArray(warriors);
            if (a.length) {
                setCashedDynamicDirLightList(a);
            }
        }

        if (!a.length) return;

        for (let k in a) {
            let oneDataArrayToDrawHole = a[k];
            let master = oneDataArrayToDrawHole.dynamicDirLight.getMaster();
            let warriorId = oneDataArrayToDrawHole.warriorId;
            let extraLightId = oneDataArrayToDrawHole.dynamicDirLight.getId();

            if (master.getCanvasObjectType() == "HERO") {
                let characterWarrior = Engine.battle.warriorsList[warriorId];
                if (!characterWarrior) continue;

                addDynamicDirCharacterLight(extraLightId, oneDataArrayToDrawHole.dynamicDirLight, warriorId);
            }
        }

    };

    const drawEmptyNightOnCanvas = () => {
        let w = battleNight.width;
        let h = battleNight.height;
        //let nightColor  = getEngine().nightController.getCalculateStringNightColor();
        let nightColor;


        if (cashedNightColor == null) {
            nightColor = getEngine().nightController.getCalculateStringNightColor();
            nightColor = !nightColor ? false : nightColor;

            setCashedNightColor(nightColor);
        } else {
            nightColor = cashedNightColor;
        }


        if (!nightColor) nightColor = "0,0,0,0";

        let fillStyle = "rgba(" + nightColor + ")";

        for (let k in framesOfNight) {
            let ctx = framesOfNight[k].getContext("2d");
            ctx.fillStyle = fillStyle;

            ctx.clearRect(0, 0, w, h);
            ctx.fillRect(0, 0, w, h);
        }
    }

    const createOnePointOnExistFramesOfNight = (id, framesOfNight) => {

        let oneExtraLight = getExtraLight(id);

        for (let i = 0; i < framesOfNight.length; i++) {
            drawExtraLightOnFrameOfNight(oneExtraLight, framesOfNight[i], i);
        }
    };

    const getExtraLight = (id) => {
        return extraLight[id];
    };

    const drawExtraLightOnFrameOfNight = (oneExtraLight, frameOfNight, indexFrameOfNight) => {
        let ctx = frameOfNight.getContext("2d");
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        framesWithHoles.drawOneHole(oneExtraLight.onePointDataArrayHole[indexFrameOfNight], ctx, true);
        ctx.restore();
    };

    const addExtraLight = (id, data, warriorId, x, y) => {

        let engine = getEngine();
        let cloneRajData = GET_HARD_COPY_STRUCTURE(data.rajData);

        //let $battleArea     = engine.battle.getBattleArea();
        let scale = engine.battle.scaleBattle.getScale();
        //let top             = parseInt($battleArea.css('top'));
        //let position        = engine.battle.getBattleArea().position()

        x = x * scale;
        y = y * scale;

        y -= CFG.tileSize * scale / 2;

        //cloneRajData.x  = x + position.left;
        //cloneRajData.y  = y + position.top;
        cloneRajData.x = x;
        cloneRajData.y = y;
        cloneRajData.r *= scale;

        if (isset(cloneRajData.offsetX)) cloneRajData.offsetX *= scale;
        if (isset(cloneRajData.offsetY)) cloneRajData.offsetY *= scale;
        if (isset(cloneRajData.gradientPercent1)) cloneRajData.gradientPercent1 *= scale;
        if (isset(cloneRajData.gradientPercent2)) cloneRajData.gradientPercent2 *= scale;


        //let onePointDataArrayHole = framesWithHoles.getOnePoint(cloneRajData, nightFrameLength, true, false);

        extraLight[id] = {
            id: id,
            rajData: cloneRajData,
            //onePointDataArrayHole   : cloneOnePointDataArrayHole,
            onePointDataArrayHole: framesWithHoles.getOnePoint(cloneRajData, nightFrameLength, true, false),
            light: null,
            onlyNight: true,
            master: {
                id: warriorId,
                kind: "WARRIOR",
                originalId: data.master.id,
                originalKind: data.master.kind
            }
        }

        if (!data.light) return;

        let oneLightPoint = engine.nightController.createOneLightPoint(cloneRajData, true);

        if (!oneLightPoint) return;

        extraLight[id].light = oneLightPoint;

        if (!isset(data.light.onlyNight)) return;

        extraLight[id].onlyNight = data.light.onlyNight;
    }


    const addBehaviorDynamicLight = (id, dataObject, warriorId) => {

        let cloneRajData = GET_HARD_COPY_STRUCTURE(dataObject.getSrajData());
        let srajAdditionalData = GET_HARD_COPY_STRUCTURE(dataObject.getAdditionalData());
        let oneBehaviorDynamicLight = new BehaviorDynamicLight();

        cloneRajData.battle = true;

        let engine = getEngine();
        let scale = engine.battle.scaleBattle.getScale();

        if (!isset(cloneRajData.d.r)) {
            cloneRajData.d.r = framesWithHoles.getDefaultR();
        }

        cloneRajData.d.r *= scale;

        if (cloneRajData.master) {
            cloneRajData.master.id = warriorId;
            cloneRajData.master.kind = "WARRIOR";
        }

        behaviorDynamicLight[id] = oneBehaviorDynamicLight;

        oneBehaviorDynamicLight.init();
        oneBehaviorDynamicLight.setFramesWithHoles(framesWithHoles);
        oneBehaviorDynamicLight.updateData(id, cloneRajData, srajAdditionalData);
    };

    const addDynamicDirCharacterLight = (id, dataObject, warriorId) => {

        let cloneRajData = GET_HARD_COPY_STRUCTURE(dataObject.getSrajData());
        let srajAdditionalData = GET_HARD_COPY_STRUCTURE(dataObject.getAdditionalData());
        let oneDirDynamicLight = new DirDynamicLight();

        cloneRajData.battle = true;

        let engine = getEngine();
        let scale = engine.battle.scaleBattle.getScale();

        if (!isset(cloneRajData.d.r)) {
            cloneRajData.d.r = framesWithHoles.getDefaultR();
        }

        cloneRajData.d.r *= scale;

        if (cloneRajData.master) {
            cloneRajData.master.id = warriorId;
            cloneRajData.master.kind = "WARRIOR";
        }

        dynamicDirCharacterLight[id] = oneDirDynamicLight;

        oneDirDynamicLight.init();
        oneDirDynamicLight.updateData(id, cloneRajData, srajAdditionalData, framesWithHoles);
        //oneDirDynamicLight.setFramesWithHoles(framesWithHoles);
    };

    const getNight = () => {
        //if (!ready) [];

        if (!getEngine().nightController.getReady()) return [];

        let a = [];

        //for (let k in lightPointsList) {
        //    a.push(lightPointsList[k]);
        //}

        //let extraLight 					= Engine.rajExtraLight.getAllExtraLight();
        //let dynamicLight 				= Engine.dynamicLightsManager.getDynamicLightList();
        //let behaviorDynamicLightList 	= Engine.behaviorDynamicLightsManager.getBehaviorDynamicLightList();
        //let isNight 					= Engine.nightController.checkNight();
        let isNight = checkCanDraw();

        for (let k in extraLight) {
            let add = false;
            let onlyNight = extraLight[k].onlyNight;
            let oneExtraLight = extraLight[k].light;

            if (!oneExtraLight) continue;

            if (onlyNight) {

                if (isNight) add = true;

            } else add = true;


            if (add) a.push(extraLight[k].light);
        }

        return a;
    }

    const onClear = () => {
        clearExtraLight();
        clearBehaviorDynamicLight();
        clearDynamicDirCharacterLight();

        resetActualFrame();

        setCashedExtraLightList(null);
        setCashedBehaviorDynamicLightList(null);
        setCashedDynamicDirLightList(null);
        setCashedNightColor(null);
    }

    const resetActualFrame = () => {
        actualFrame = 0;
    };

    const clearExtraLight = () => {
        extraLight = {};
    };

    const clearBehaviorDynamicLight = () => {
        behaviorDynamicLight = {};
    };

    const clearDynamicDirCharacterLight = () => {
        dynamicDirCharacterLight = {};
    };

    this.getBehaviorDynamicLight = () => {
        return behaviorDynamicLight
    }

    this.init = init;
    //this.getDataArrayToDrawHole                     = getDataArrayToDrawHole;
    this.rebuildBattleNight = rebuildBattleNight;
    //this.setCashedExtraLightList                    = setCashedExtraLightList;
    //this.setCashedBehaviorDynamicLightList          = setCashedBehaviorDynamicLightList;
    //this.setCashedNightColor                        = setCashedNightColor;
    this.update = update;
    this.draw = draw;
    //this.createBattleNight                          = createBattleNight;
    this.onClear = onClear;
}