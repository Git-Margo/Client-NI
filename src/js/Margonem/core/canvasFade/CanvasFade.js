var CanvasFadeData = require('@core/canvasFade/CanvasFadeData');

module.exports = function() {

    let moduleData = {
        fileName: "CanvasFade.js"
    };
    let action = null;
    let callback = null;
    let fadeValue = null;
    let finishAlpha = null;
    let startAlpha = null;

    let speed = null;

    const init = () => {
        finishAlpha = 1;
        setSpeed(0.5);
    };

    const setAction = (_action) => {
        action = _action;
    };

    const setCallback = (_callback) => {
        callback = _callback
    };

    const setFinishAlpha = (_finishAlpha) => {
        finishAlpha = _finishAlpha
    };

    const setStartAlpha = (_startAlpha) => {
        startAlpha = _startAlpha
    };

    const updateData = (data) => {
        setAction(data.action);
        setCallback(data.callback);
        if (isset(data.startAlpha)) setStartAlpha(data.startAlpha);
        if (isset(data.finishAlpha)) setFinishAlpha(data.finishAlpha);
        if (isset(data.speed)) setSpeed(data.speed);


        startAction();
    };

    const setSpeed = (_speed) => {
        speed = _speed;
    };

    const startAction = () => {


        switch (action) {
            case CanvasFadeData.action.FADE_IN:
                fadeValue = startAlpha ? startAlpha : 0;
                break;
            case CanvasFadeData.action.FADE_OUT:
                fadeValue = startAlpha ? startAlpha : 1;
                break;
            default:
                errorReport(moduleData.fileName, "startAction", "action not exist", action);
        }
    };

    const updateFadeIn = (dt) => {
        fadeValue += dt * speed;
    };

    const updateFadeOut = (dt) => {
        fadeValue -= dt * speed;
    };

    const update = (dt) => {

        switch (action) {
            case CanvasFadeData.action.FADE_IN:
                updateFadeIn(dt);
                break;
            case CanvasFadeData.action.FADE_OUT:
                updateFadeOut(dt);
                break;
            default:
                errorReport(moduleData.fileName, "update", "action not exist", action);
        }

        //console.log(fadeValue);

        if (!checkFinish()) return;

        callFinish();
    };

    const getFadeValue = () => {
        return fadeValue;
    };

    const checkFinish = () => {
        return fadeValue < 0 || fadeValue > finishAlpha
    };

    const callFinish = () => {
        callback();
    };

    const forceFinish = () => {
        callback();
    };

    this.init = init;
    this.getFadeValue = getFadeValue;
    this.forceFinish = forceFinish;
    this.update = update;
    this.updateData = updateData;

}