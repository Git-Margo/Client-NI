module.exports = function() {

    let id;
    let initTime;
    //let currentTime         = null;
    let oldTime = null;
    let blinkTime = null;
    let blinkFinish = null;

    const BLINK_MAP_TIMER = "blink-map-timer";

    const init = () => {
        getEngine().interface.show$mapTimer(true);
        addBlinkMapTimer();
        setBlinkFinish(false);
    };

    const updateData = (_id, _initTime) => {
        setId(_id);
        setInitTime(_initTime + addActualSeconds())
    };

    const addActualSeconds = () => {
        return Math.round(new Date().getTime() / 1000)
    }

    const update = (dt) => {
        let actualTs = addActualSeconds();
        let currentTime = initTime - actualTs;

        if (Engine.interfaceStart && !blinkTime) {
            blinkTime = actualTs + 3;
        }

        if (currentTime < 0) {
            remove();
            return;
        }

        let newVal = Math.round(currentTime);

        if (oldTime != newVal) {
            let formatedTime = getSecondLeft(newVal, {
                noVar: true
            });
            let color = getColor(newVal);
            let tip = `<div style="color:${color}">${formatedTime}</div>`;

            oldTime = newVal;

            updateMapTimerTip(tip);
            updateBlinkTime();
        }
    };

    const updateMapTimerTip = (v) => {
        getEngine().interface.setTip$mapTimer(v)
    }

    const updateBlinkTime = () => {
        if (blinkFinish) {
            return;
        }

        //if (blinkTime > oldTime + 3) {
        if (blinkTime != null && blinkTime < addActualSeconds()) {

            removeBlinkMapTimer();
            setBlinkFinish(true)
        }

    };

    const setBlinkFinish = (_blinkFinish) => {
        blinkFinish = _blinkFinish;
    }

    const getColor = (sec) => {
        if (sec > 60) return '#e6d6bf';
        if (sec > 0) return '#ffa500';

        return '#ff0000';
    };


    const setId = (_id) => {
        id = _id;
    };

    const setInitTime = (_initTime) => {
        initTime = _initTime
    };

    const addBlinkMapTimer = () => {
        getEngine().interface.addClassTo$mapTimer(BLINK_MAP_TIMER);
    }

    const removeBlinkMapTimer = () => {
        getEngine().interface.removeClassFrom$mapTimer(BLINK_MAP_TIMER);
    }

    const remove = () => {
        removeBlinkMapTimer();
        getEngine().interface.show$mapTimer(false);
        getEngine().interfaceTimerManager.removeTownTimer(id);
    }


    this.init = init;
    this.updateData = updateData;
    this.update = update;
}