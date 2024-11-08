const RajActionManager = require('core/raj/rajAction/RajActionManager');
const RajActionData = require('core/raj/rajAction/RajActionData');

module.exports = function() {

    let moduleData = {
        fileName: "EarthQuakeManager.js"
    };
    let earthQuakeQuantity = 0;
    let earthQuakeDuration = 0;
    let earthQuakePower = 0;
    let earthQuakeInterval = null;
    let frequencyEarthQuakeInterval = null;
    let rajActionManager = null;

    const defaultData = {
        EARTH_QUAKE_POWER: 10
    };

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
                    duration: {
                        type: TYPE.NUMBER
                    },
                    quantity: {
                        type: TYPE.INT
                    },
                    frequency: {
                        type: TYPE.NUMBER
                    },
                    power: {
                        type: TYPE.NUMBER,
                        optional: true
                    }
                }
            },
            RajActionData.GROUP_NAME.OVERRIDE_OBJECT
        );
    };

    const startEarthQuake = (durationSec) => {
        if (earthQuakeInterval) clearEarthQuake();

        let count = 0;
        earthQuakeInterval = setInterval(() => {
            Engine.mapShift.setShift(getShake(), getShake());
            count++;
            if (count > durationSec * 100) clearEarthQuake()
        }, 10)
    };

    const clearEarthQuake = () => {
        if (!earthQuakeInterval) return;

        clearInterval(earthQuakeInterval);
        //clearFrequencyEarthQuakeInterval();
        earthQuakeInterval = null;
        Engine.mapShift.setShift(0, 0);
    };

    const clearFrequencyEarthQuakeInterval = () => {
        if (!frequencyEarthQuakeInterval) return;

        clearInterval(frequencyEarthQuakeInterval);
        frequencyEarthQuakeInterval = null;
    };

    const clearEarthQuakeQuantity = () => {
        earthQuakeQuantity = 0;
    };


    const updateData = (data, additionalData) => {
        if (!rajActionManager.checkCorrectMainData(data, additionalData)) return;

        //if (!checkCorrectData(data)) return;

        //if (!Engine.rajCase.checkFullFillCase(data.case)) return;

        rajActionManager.updateData(data);

        //manageEarthQuake(data);

    };

    //const checkCorrectData = (data) => {
    //	const FUNC = "updateData";
    //
    //	if (isset(data.clear)) return true;
    //
    //	if (!isset(data.duration))  {
    //		errorReport(moduleData.fileName, FUNC, 'Attr "duration" not exist in earthquake data!');
    //		return false;
    //	}
    //	if (!isset(data.quantity)) {
    //		errorReport(moduleData.fileName, FUNC, 'Attr "quantity" not exist in earthquake data!');
    //		return false
    //	}
    //	if (!isset(data.frequency)) {
    //		errorReport(moduleData.fileName, FUNC, 'Attr "frequency" not exist in earthquake data!');
    //		return false
    //	}
    //
    //	return true;
    //}

    const onClear = () => {
        clearFrequencyEarthQuakeInterval();
        clearEarthQuake();
        setEarthQuakePower(defaultData.EARTH_QUAKE_POWER);
    };

    //const manageEarthQuake = (data) => {
    //
    //	if (!Engine.rajCase.checkFullFillCase(data.case)) return;
    //
    //	clearFrequencyEarthQuakeInterval();
    //	clearEarthQuake();
    //	setEarthQuakePower(defaultData.EARTH_QUAKE_POWER);
    //
    //	setEarthQuakeQuantity(data.quantity);
    //	setEarthQuakeDuration(data.duration);
    //	setFrequencyEarthQuakeInterval(data.frequency);
    //
    //	if (isset(data.power)) setEarthQuakePower(data.power);
    //
    //	startEarthQuake(earthQuakeDuration);
    //};

    const createAction = (data) => {
        onClear();

        setEarthQuakeQuantity(data.quantity);
        setEarthQuakeDuration(data.duration);
        setFrequencyEarthQuakeInterval(data.frequency);

        if (isset(data.power)) setEarthQuakePower(data.power);

        startEarthQuake(earthQuakeDuration);
    };

    const clearAction = () => {
        onClear();
    };

    const setEarthQuakeQuantity = (quantity) => {
        earthQuakeQuantity = quantity
    };

    const setEarthQuakeDuration = (duration) => {
        earthQuakeDuration = duration
    };

    const setEarthQuakePower = (_earthQuakePower) => {
        earthQuakePower = _earthQuakePower
    };

    const setFrequencyEarthQuakeInterval = (frequency) => {

        if (frequency == 0) return;

        let count = 1;

        frequencyEarthQuakeInterval = setInterval(() => {
            if (earthQuakeQuantity == 0) {
                startEarthQuake(earthQuakeDuration);
                return
            }

            if (count >= earthQuakeQuantity) {
                clearFrequencyEarthQuakeInterval();
                return
            }

            startEarthQuake(earthQuakeDuration);
            count++;
        }, frequency * 1000)

    };

    const getShake = () => {
        let v = Math.random() * earthQuakePower;

        return Math.round(Math.random()) ? -v : v;
    };

    this.init = init;
    this.onClear = onClear;
    this.updateData = updateData;

};