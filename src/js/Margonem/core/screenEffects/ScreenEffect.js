var ScreenBehaviour = require('core/screenEffects/ScreenBehaviour.js');
let FramesWithHoles = require('core/FramesWithHoles');
let ScreenEffectData = require('core/screenEffects/ScreenEffectData.js');
let RajRandomElements = require('core/raj/RajRandomElements');
let RajObjectInterface = require('core/raj/RajObjectInterface');
let RajData = require('core/raj/RajData');

module.exports = function() {

    let actualBehaviourIndex;
    let behaviourList;
    let id;
    let order;
    let repeat;
    let actualRepeat;
    let helpCanvasData;
    let framesWithHoles;
    let moduleData = {
        fileName: "ScreenEffect.js"
    };


    const init = () => {
        implementRajInterface();
        framesWithHoles = new FramesWithHoles();
        initHelpCanvasData();
        resetStates();
        setOrder(ScreenEffectData.defaultData.ORDER);
        setRepeat(ScreenEffectData.defaultData.SCREEN_EFFECT_REPEAT);
        setActualRepeat(ScreenEffectData.defaultData.SCREEN_EFFECT_REPEAT);
    };

    const implementRajInterface = () => {
        (new RajObjectInterface()).implementRajObject(this, RajData.SCREEN_EFFECTS);
    }

    const initHelpCanvasData = () => {
        let $gameLayer = Engine.interface.get$gameLayer();
        let width = $gameLayer.width();
        let height = $gameLayer.height();

        helpCanvasData = framesWithHoles.createCanvasData();

        if (width == 0 && height == 0) return;

        let helpCanvas = helpCanvasData.canvas;

        helpCanvas.width = width;
        helpCanvas.height = height;
    };

    const getHelpCanvas = () => {
        return helpCanvasData.canvas;
    }

    const getHelpCtx = () => {
        return helpCanvasData.ctx;
    }

    const getFramesWithHoles = () => {
        return framesWithHoles
    }

    const updateData = (data) => {

        this.updateDataRajObject(data);
        setId(data.id);
        if (data.order) setOrder(data.order);
        if (data.behavior.repeat) setRepeat(data.repeat);

        //let list = data.behavior;
        let list = data.behavior.list;

        for (let k in list) {
            let screenBehaviour = new ScreenBehaviour(this);
            let oneBehaviorData = list[k];

            if (oneBehaviorData.data) {
                let d = oneBehaviorData.data;
                let holes = d.holes;

                if (d.color) RajRandomElements.manageRandomElementInObjectIfExist(d.color);
                if (d.color0) RajRandomElements.manageRandomElementInObjectIfExist(d.color0);
                if (d.color1) RajRandomElements.manageRandomElementInObjectIfExist(d.color1);

                if (holes) {
                    if (holes.hole0) RajRandomElements.manageRandomElementInObjectIfExist(holes.hole0);
                    if (holes.hole1) RajRandomElements.manageRandomElementInObjectIfExist(holes.hole1);
                }

            }

            addToBehaviourList(screenBehaviour);

            screenBehaviour.init();
            screenBehaviour.updateData(oneBehaviorData);
        }

    };

    const update = (dt) => {

        let multiUpdate = false; // create to synchronus screenEffects and sequence
        let tempActualBehaviourIndex;

        while (tempActualBehaviourIndex != actualBehaviourIndex) {

            tempActualBehaviourIndex = actualBehaviourIndex;

            if (!checkActualBehaviourExist()) return;

            if (multiUpdate) dt = 0;

            let actualBehaviour = getActualBehaviour();
            actualBehaviour.update(dt);

            multiUpdate = true;

            if (actualBehaviourIndex == null) return

        }

    };

    const resetStates = () => {
        setActualBehaviourIndex(0);
        clearBehaviourList();
    };

    const clearBehaviourList = () => {
        behaviourList = [];
    };

    const addToBehaviourList = (behaviour) => {
        behaviourList.push(behaviour);
    };

    const getBehaviourToRenderEffect = () => {
        if (actualBehaviourIndex == null) return null;
        if (!checkActualBehaviourExist()) return null;

        return getActualBehaviour();
    };

    const checkActualBehaviourExist = () => {

        if (behaviourList[actualBehaviourIndex]) return true;

        errorReport(moduleData.fileName, "checkActualBehaviourExist", `behaviour index ${actualBehaviourIndex} not exist!`, behaviourList);

        return false;
    };

    const setNextBehaviour = (passedLifeTime) => {

        if (checkActualBehaviourIsLast()) {

            increaseActualRepeat();

            if (checkRepeatIsOver()) {
                remove();
                return
            }

            setActualBehaviourIndex(0);
            resetLifeTimeInAllBehaviour();
            resetActualRepeatInAllBehaviour();

            return;
        }

        actualBehaviourIndex++;

        let actualBehavior = getActualBehaviour();
        if (actualBehavior) {
            actualBehavior.setActualLifeTime(passedLifeTime);
        }
    };

    const resetLifeTimeInAllBehaviour = () => {
        for (let k in behaviourList) {
            behaviourList[k].setActualLifeTime(0);
        }
    };

    const resetActualRepeatInAllBehaviour = () => {
        for (let k in behaviourList) {
            behaviourList[k].setActualRepeat(1);
        }
    };

    const checkActualBehaviourIsLast = () => {
        return behaviourList.length == actualBehaviourIndex + 1;
    };

    const remove = () => {
        Engine.screenEffectsManager.removeScreenEffect(id);
    };

    const checkRepeatIsOver = () => {
        if (repeat === true) return false;

        return actualRepeat > repeat;
    };

    const increaseActualRepeat = () => {
        setActualRepeat(actualRepeat + 1);
    };

    const resize = (width, height) => {
        helpCanvasData.canvas.width = width;
        helpCanvasData.canvas.height = height;
    };

    const getId = () => {
        return id;
    };
    const getOrder = () => {
        return order;
    };
    const getActualBehaviour = () => {
        return behaviourList[actualBehaviourIndex]
    };


    const setRepeat = (_repeat) => {
        repeat = _repeat;
    };
    const setActualRepeat = (_actualRepeat) => {
        actualRepeat = _actualRepeat;
    };
    const setOrder = (_order) => {
        order = _order;
    };
    const setId = (_id) => {
        id = _id;
    };
    const setActualBehaviourIndex = (_actualBehaviourIndex) => {
        actualBehaviourIndex = _actualBehaviourIndex
    };

    this.init = init;
    this.getOrder = getOrder;
    this.remove = remove;
    this.getBehaviourToRenderEffect = getBehaviourToRenderEffect;
    this.update = update;
    this.updateData = updateData;
    this.getId = getId;
    this.setNextBehaviour = setNextBehaviour;
    this.resize = resize;
    this.getHelpCanvas = getHelpCanvas;
    this.getHelpCtx = getHelpCtx;
    this.getFramesWithHoles = getFramesWithHoles;
}