let RajSoundData = require('@core/raj/rajSound/RajSoundData.js');

module.exports = function() {

    let id = null;
    //let soundId             = null;
    let url = null;

    let actualRepeat = null;
    let repeat = null;

    let delayBefore = null;
    let delayAfter = null;

    let actualDelayBefore = null;
    let actualDelayAfter = null;

    let soundWasCall = false;
    let soundWasFinish = false;

    let source = null;
    let maxLength = null;

    let specificVolume = null;

    const init = () => {
        setRepeat(RajSoundData.defaultData.REPEAT);
        setActualRepeat(RajSoundData.defaultData.REPEAT);

        setDelayBefore(RajSoundData.defaultData.DELAY_BEFORE);
        setActualDelayBefore(RajSoundData.defaultData.DELAY_BEFORE);

        setDelayAfter(RajSoundData.defaultData.DELAY_AFTER);
        setActualDelayAfter(RajSoundData.defaultData.DELAY_AFTER);
    };

    const updateData = (data) => {

        if (isset(data.url)) {
            setUrl(data.url);
            Engine.soundManager.prepareSrajSound(url);
        }
        if (isset(data.id)) setId(data.id);
        if (isset(data.repeat)) setRepeat(data.repeat);
        if (isset(data.delayBefore)) setDelayBefore(data.delayBefore);
        if (isset(data.delayAfter)) setDelayAfter(data.delayAfter);
        if (isset(data.volume)) setSpecificVolume(data.volume);

        if (isset(data.source)) {
            setSource(data.source);
            setMaxLength(getCalculateMaxLength());
        }

    };

    const update = (dt) => {
        if (!soundWasCall && delayBefore != 0) {
            increaseActualDelayBefore(dt);

            if (!checkDelayBeforeIsOver()) return
        }

        if (!soundWasCall) {
            setSoundWasCall(true);
            callSound();
        }

        if (!soundWasFinish) return;

        if (delayAfter != 0) {
            increaseActualDelayAfter(dt);

            if (!checkDelayAfterIsOver()) return;
        }

        timeIsOver();

    };

    const checkDelayAfterIsOver = () => {
        return actualDelayAfter > delayAfter;
    };

    const checkDelayBeforeIsOver = () => {
        return actualDelayBefore > delayBefore;
    };

    const timeIsOver = () => {

        increaseActualRepeat();

        if (!checkRepeatIsOver()) {

            setActualDelayBefore(RajSoundData.defaultData.DELAY_BEFORE);
            setActualDelayAfter(RajSoundData.defaultData.DELAY_AFTER);
            setSoundWasCall(false);
            setSoundWasFinish(false);
            return;
        }

        onFinish();
    };

    const callSound = () => {
        Engine.soundManager.createSrajSound(url, this);
    };

    const finishSound = () => {
        setSoundWasFinish(true);
    };

    const onFinish = () => {
        Engine.rajSoundManager.removeRajSound(id)
    };

    const checkSource = () => {
        return source ? true : false;
    };

    const getSpecificVolume = () => {
        return specificVolume;
    };

    const setSpecificVolume = (_specificVolume) => {
        return specificVolume = _specificVolume;
    };

    const getLengthFromSource = (x, y) => {
        //return Math.sqrt(Math.pow(source.x - x, 2) + Math.pow(source.y - y, 2));

        return getEuclideanDistance(source.x, source.y, x, y);

    };

    const getVolumeForSourceSound = (x, y) => {
        let length = getLengthFromSource(x, y);
        if (length > maxLength) return 0;

        return Math.abs(Math.round((length / maxLength) * 100) - 100);
    };

    const getCalculateMaxLength = () => {
        return getLengthFromSource(source.x + source.range + 1, source.y)
    };

    const checkRepeatIsOver = () => {
        if (repeat === true) return false;

        return actualRepeat > repeat;
    };

    const increaseActualRepeat = () => {
        setActualRepeat(actualRepeat + 1);
    };

    const increaseActualDelayBefore = (dt) => {
        setActualDelayBefore(actualDelayBefore + dt);
    };

    const increaseActualDelayAfter = (dt) => {
        setActualDelayAfter(actualDelayAfter + dt);
    };

    //const getSoundId = () => soundId;

    const getId = () => id;

    const setUrl = (_url) => {
        url = _url;
    };
    const setId = (_id) => {
        id = _id;
    };
    const setSource = (_source) => {
        source = _source;
    };
    const setMaxLength = (_maxLength) => {
        maxLength = _maxLength;
    };
    //const setSoundId = (_soundId) => {
    //    soundId = _soundId;
    //};
    const setRepeat = (_repeat) => {
        repeat = _repeat;
    };
    const setActualRepeat = (_actualRepeat) => {
        actualRepeat = _actualRepeat;
    };
    const setDelayBefore = (_delayBefore) => {
        delayBefore = _delayBefore;
    };
    const setDelayAfter = (_delayAfter) => {
        delayAfter = _delayAfter;
    };
    const setActualDelayBefore = (_actualDelayBefore) => {
        actualDelayBefore = _actualDelayBefore;
    };
    const setActualDelayAfter = (_actualDelayAfter) => {
        actualDelayAfter = _actualDelayAfter;
    };
    const setSoundWasCall = (_soundWasCall) => {
        soundWasCall = _soundWasCall;
    };
    const setSoundWasFinish = (_soundWasFinish) => {
        soundWasFinish = _soundWasFinish;
    };


    this.init = init;
    this.checkSource = checkSource;
    this.getVolumeForSourceSound = getVolumeForSourceSound;
    this.getSpecificVolume = getSpecificVolume;
    this.finishSound = finishSound;
    //this.setSoundId                 = setSoundId;
    //this.getSoundId                 = getSoundId;
    this.getId = getId;
    this.update = update;
    this.updateData = updateData;
}