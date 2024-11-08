let RajActionManager = require('core/raj/rajAction/RajActionManager');
let RajActionData = require('core/raj/rajAction/RajActionData');

module.exports = function() {

    let moduleData = {
        fileName: "RajZoomManager.js"
    };
    let rajActionManager = null;
    let alphaFactor = null;

    const init = () => {
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        rajActionManager = new RajActionManager();

        const TYPE = RajActionData.TYPE;

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                clearFunc: clearAction,
                createRequire: {
                    alphaFactor: {
                        type: TYPE.FLOAT
                    }
                }
            },
            RajActionData.GROUP_NAME.OVERRIDE_OBJECT
        );
    };

    const updateData = (v, additionalData) => {
        if (!rajActionManager.checkCorrectMainData(v, additionalData)) return;

        rajActionManager.updateData(v);
    };

    const createAction = (v) => {
        //if (!Engine.rajCase.checkFullFillCase(v.case)) return;

        setAlphaFactor(v.alphaFactor);
        Engine.nightController.rebulitInterval();
    };

    const clearAction = (v) => {
        //if (!Engine.rajCase.checkFullFillCase(v.case)) return;

        setAlphaFactor(null);
        Engine.nightController.rebulitInterval();
    };

    const setAlphaFactor = (_aphaFactor) => {
        alphaFactor = _aphaFactor;
    };

    const isOverrideDayNightCycleExist = () => {
        return alphaFactor != null ? true : false;
    };

    const geNormalizeOverrideDayNightCycleAlpha = (minNightAlpha, nightAlpha) => {
        return minNightAlpha + (nightAlpha - minNightAlpha) * alphaFactor
    };

    const getAlphaFactor = () => {
        return alphaFactor;
    };

    this.init = init;
    this.updateData = updateData;
    this.getAlphaFactor = getAlphaFactor;
    this.isOverrideDayNightCycleExist = isOverrideDayNightCycleExist;
    this.geNormalizeOverrideDayNightCycleAlpha = geNormalizeOverrideDayNightCycleAlpha;
    this.geNormalizeOverrideDayNightCycleAlpha = geNormalizeOverrideDayNightCycleAlpha;

}