let RajGetSpecificData = require('core/raj/RajGetSpecificData');
let ScreenEffectData = require('core/screenEffects/ScreenEffectData.js');

module.exports = function(screenEffect) {

    let actualRepeat = null;
    let repeat = null;
    let mode = null;
    let duration = null;
    let actualLifeTime = null;
    let maxLifeTime = null;
    let moduleData = {
        fileName: "ScreenBehaviour.js"
    };

    //this.alwaysDraw = true;
    let alwaysDraw;

    let transitionColor = {
        color0: {
            r: null,
            g: null,
            b: null,
            a: null
        },
        color1: {
            r: null,
            g: null,
            b: null,
            a: null
        }
    };

    let transitionHoles = [];

    let drawColor = {
        r: null,
        g: null,
        b: null,
        a: null
    };

    let drawHoles = [];

    const init = () => {
        setAlwaysDraw(true);
        setActualRepeat(ScreenEffectData.defaultData.BEHAVIOR_REPEAT);
        setRepeat(ScreenEffectData.defaultData.BEHAVIOR_REPEAT);
        setDuration(ScreenEffectData.defaultData.BEHAVIOR_DURATION);
        setActualLifeTime(0);
    };

    const getOrder = () => {
        return 1000 + screenEffect.getOrder();
    };

    const increaseActualLifeTime = (dt) => {
        setActualLifeTime(actualLifeTime + dt);
    };

    const increaseActualRepeat = () => {
        setActualRepeat(actualRepeat + 1);
    };

    const setColorFromTransition = (data) => {

        let _c0 = data.data.color0;
        let _c1 = data.data.color1;

        let c0 = transitionColor.color0;
        let c1 = transitionColor.color1;

        c0.r = _c0.r;
        c0.g = _c0.g;
        c0.b = _c0.b;
        c0.a = _c0.a;

        c1.r = _c1.r;
        c1.g = _c1.g;
        c1.b = _c1.b;
        c1.a = _c1.a;
    };

    const updateData = (data) => {
        if (data.mode) setMode(data.mode);
        if (data.repeat) setRepeat(data.repeat);
        if (data.duration) setDuration(data.duration);

        setMaxLifeTime(duration);

        updateDataByMode(data);
    };

    const updateDataByMode = (data) => {
        switch (mode) {
            case ScreenEffectData.mode.TRANSITION:
                updateTransitionData(data);
                break;
            case ScreenEffectData.mode.STATIC:
                updateStaticData(data);
                break;
            default:
                errorReport(moduleData.fileName, "updateDataByMode", `undefined mode ${mode}`, data);
        }
    };

    const updateStaticData = (data) => {
        setStaticColor(data.data.color);
        setStaticHolesToDraw(data.data.holes)
    };

    const updateTransitionData = (data) => {
        setColorFromTransition(data);
        setTransitionHoles(data.data.holes)
    };

    const setTransitionHoles = (holes) => {
        for (let k in holes) {
            transitionHoles.push(holes[k]);
        }
    }

    const update = (dt) => {

        increaseActualLifeTime(dt);

        if (checkTimeIsOver()) {
            timeIsOver();
            return;
        }

        if (mode == ScreenEffectData.mode.TRANSITION) manageTransition();
    };

    const manageTransition = () => {
        manageDrawColorWithTransition();
        managedrawHolesWithTransition();
    };

    const managedrawHolesWithTransition = () => {
        let percentOfLife = actualLifeTime / maxLifeTime;

        drawHoles = [];

        for (let k in transitionHoles) {
            let holesData = transitionHoles[k];
            let hole0 = holesData.hole0;
            let hole1 = holesData.hole1;
            let copy = GET_HARD_COPY_STRUCTURE(hole0);

            copy.x = getValFromTransition(percentOfLife, hole0.x, hole1.x);
            copy.y = getValFromTransition(percentOfLife, hole0.y, hole1.y);
            copy.r = getValFromTransition(percentOfLife, hole0.r, hole1.r);

            drawHoles.push(copy);
        }

    };

    const manageDrawColorWithTransition = () => {
        let percentOfLife = actualLifeTime / maxLifeTime;

        let c0 = transitionColor.color0;
        let c1 = transitionColor.color1;

        setRChannel(getValFromTransition(percentOfLife, c0.r, c1.r));
        setGChannel(getValFromTransition(percentOfLife, c0.g, c1.g));
        setBChannel(getValFromTransition(percentOfLife, c0.b, c1.b));
        setAChannel(getValFromTransition(percentOfLife, c0.a, c1.a));

    };

    const setStaticHolesToDraw = (holes) => {

        for (let k in holes) {
            drawHoles.push(holes[k]);
        }
    }

    const setStaticColor = (color) => {
        setRChannel(color.r);
        setGChannel(color.g);
        setBChannel(color.b);
        setAChannel(color.a);
    };

    const getValFromTransition = (percentOfLife, channelVal0, channelVal1) => {
        if (channelVal0 == channelVal1) return channelVal0;


        let val = Math.abs(channelVal0 - channelVal1) * percentOfLife;
        let result;

        if (channelVal0 < channelVal1) result = channelVal0 + val;
        else result = channelVal0 - val;

        return result;
    };



    const checkTimeIsOver = () => {
        return actualLifeTime > maxLifeTime;
    };

    const getPassedLifeTime = () => {
        return actualLifeTime - maxLifeTime;
    }

    const checkRepeatIsOver = () => {
        if (repeat === true) return false;

        return actualRepeat > repeat;
    };

    const timeIsOver = () => {

        increaseActualRepeat();

        let passedLifeTime = getPassedLifeTime();

        if (!checkRepeatIsOver()) {
            setActualLifeTime(passedLifeTime);
            //setActualLifeTime(0);
            return;
        }

        onFinish(passedLifeTime);
    };

    const onFinish = (passedLifeTime) => {
        screenEffect.setNextBehaviour(passedLifeTime);
    };

    const draw = (ctx) => {

        //if (drawColor.a == 0) return;

        let helpCanvas = screenEffect.getHelpCanvas();
        let helpCtx = screenEffect.getHelpCtx();

        let w = helpCanvas.width;
        let h = helpCanvas.height;

        helpCtx.save();

        let mapShift = Engine.mapShift.getShift();

        let leftEffect = null;
        let topEffect = null;
        let wEffect = null;
        let hEffect = null;

        let tileSize = CFG.tileSize;

        if (getEngine().map.config.getIsQuestFogEnabled()) {
            leftEffect = (Engine.map.offset[0] - mapShift[0]) * -1;
            topEffect = (Engine.map.offset[1] - mapShift[1]) * -1;
            wEffect = Engine.map.size.x * tileSize;
            hEffect = Engine.map.size.y * tileSize;
        } else {

            leftEffect = 0;
            topEffect = 0;
            wEffect = w;
            hEffect = h;

        }

        helpCtx.clearRect(0, 0, w, h);
        helpCtx.fillStyle = "rgba(" + drawColor.r + ',' + drawColor.g + "," + drawColor.b + "," + drawColor.a + ")";
        helpCtx.fillRect(
            leftEffect,
            topEffect,
            wEffect,
            hEffect
        );


        if (!drawHoles.length) {

            helpCtx.restore();
            ctx.drawImage(helpCanvas, 0, 0);

            return
        }

        helpCtx.globalCompositeOperation = 'destination-out';



        for (let k in drawHoles) {
            let data = drawHoles[k];
            let onePoint = screenEffect.getFramesWithHoles().getOnePoint(data, 1, true);
            let holeData = onePoint[0];

            holeData.x = RajGetSpecificData.getCharacterData(holeData.x);
            holeData.y = RajGetSpecificData.getCharacterData(holeData.y);

            holeData.offsetX -= Engine.map.offset[0] - mapShift[0];
            holeData.offsetY -= Engine.map.offset[1] - mapShift[1];

            screenEffect.getFramesWithHoles().drawOneHole(holeData, helpCtx);
        }

        helpCtx.restore();
        ctx.drawImage(helpCanvas, 0, 0);

    };

    const setActualLifeTime = (_actualLifeTime) => {
        actualLifeTime = _actualLifeTime;
    };
    const setMaxLifeTime = (_maxLifeTime) => {
        maxLifeTime = _maxLifeTime;
    };
    const setMode = (_mode) => {
        mode = _mode;
    };
    const setRepeat = (_repeat) => {
        repeat = _repeat;
    };
    const setActualRepeat = (_actualRepeat) => {
        actualRepeat = _actualRepeat;
    };
    const setDuration = (_duration) => {
        duration = _duration;
    };
    const setRChannel = (r) => {
        drawColor.r = r
    };
    const setGChannel = (g) => {
        drawColor.g = g
    };
    const setBChannel = (b) => {
        drawColor.b = b
    };
    const setAChannel = (a) => {
        drawColor.a = a
    };

    const getAlwaysDraw = () => {
        return alwaysDraw
    };

    const setAlwaysDraw = (_alwaysDraw) => {
        alwaysDraw = _alwaysDraw
    };

    this.getAlwaysDraw = getAlwaysDraw;
    this.setAlwaysDraw = setAlwaysDraw;

    this.init = init;
    this.draw = draw;
    this.update = update;
    this.updateData = updateData;
    this.getOrder = getOrder;
    this.setActualLifeTime = setActualLifeTime;
    this.setActualRepeat = setActualRepeat;
};