let RajGetSpecificData = require('@core/raj/RajGetSpecificData');
let RajSequenceBehaviorData = require('@core/raj/rajSequence/RajSequenceBehaviorData.js');

module.exports = function(rajSequence) {

    let actualRepeat = null;
    let repeat = null;
    let duration = null;
    let delayBefore = null;

    let srajCase = null;

    let actualDelayBefore = null;

    let actualLifeTime = null;
    let maxLifeTime = null;
    let external_properties = null;
    let srayWasCall = null;
    let moduleData = {
        fileName: "RajSequenceBehavior.js"
    };

    //this.alwaysDraw = true;
    let alwaysDraw;

    const init = () => {
        setAlwaysDraw(true);
        setActualRepeat(RajSequenceBehaviorData.defaultData.REPEAT);
        setRepeat(RajSequenceBehaviorData.defaultData.REPEAT);
        setDuration(RajSequenceBehaviorData.defaultData.DURATION);
        setActualLifeTime(0);
        setDelayBefore(RajSequenceBehaviorData.defaultData.DELAY_BEFORE);
        setActualDelayBefore(RajSequenceBehaviorData.defaultData.DELAY_BEFORE);
        setSrayWasCall(false);
    };

    const increaseActualLifeTime = (dt) => {
        setActualLifeTime(actualLifeTime + dt);
    };

    const increaseActualDelayBefore = (dt) => {
        setActualDelayBefore(actualDelayBefore + dt);
    };

    const increaseActualRepeat = () => {
        setActualRepeat(actualRepeat + 1);
    };

    const updateData = (data) => {
        if (isset(data.repeat)) setRepeat(data.repeat);
        if (isset(data.duration)) setDuration(data.duration);
        if (isset(data.delayBefore)) setDelayBefore(data.delayBefore);
        if (isset(data.case)) setSrajCase(data.case);

        setMaxLifeTime(duration);
        setExternalProperties(data.external_properties);
    };

    const callSraj = () => {
        //Engine.rajController.parseObject(external_properties, [], {sequenceId: rajSequence.getId()});
        Engine.rajController.parseObject(external_properties, [], rajSequence.getAdditionalData());
    };

    const update = (dt) => {

        if (delayBefore != 0) {
            increaseActualDelayBefore(dt);

            if (!checkDelayBeforeIsOver()) return;
        }

        if (!srayWasCall) {
            callSraj();
            setSrayWasCall(true);
        }

        increaseActualLifeTime(dt);

        if (checkTimeIsOver()) {
            timeIsOver();
            return;
        }
    };

    const checkDelayBeforeIsOver = () => {
        return actualDelayBefore > delayBefore;
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
            setActualDelayBefore(RajSequenceBehaviorData.defaultData.DELAY_BEFORE);
            setSrayWasCall(false);
            return;
        }

        onFinish(passedLifeTime);
    };

    const onFinish = (passedLifeTime) => {
        rajSequence.setNextBehaviour(passedLifeTime);
    };

    const getSrajCase = () => srajCase;

    const setExternalProperties = (_external_properties) => {
        external_properties = _external_properties;
    };
    const setActualLifeTime = (_actualLifeTime) => {
        actualLifeTime = _actualLifeTime;
    };
    const setMaxLifeTime = (_maxLifeTime) => {
        maxLifeTime = _maxLifeTime;
    };
    const setDelayBefore = (_delayBefore) => {
        delayBefore = _delayBefore;
    };
    const setActualDelayBefore = (_actualDelayBefore) => {
        actualDelayBefore = _actualDelayBefore;
    };
    const setRepeat = (_repeat) => {
        repeat = _repeat;
    };
    const setActualRepeat = (_actualRepeat) => {
        actualRepeat = _actualRepeat;
    };
    const setSrajCase = (_srajCase) => {
        srajCase = _srajCase;
    };
    const setSrayWasCall = (_srayWasCall) => {
        srayWasCall = _srayWasCall;
    };
    const setDuration = (_duration) => {
        duration = _duration;
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
    this.update = update;
    this.updateData = updateData;
    this.setActualLifeTime = setActualLifeTime;
    this.setActualRepeat = setActualRepeat;
    this.setActualDelayBefore = setActualDelayBefore;
    this.setSrayWasCall = setSrayWasCall;
    this.getSrajCase = getSrajCase;
};