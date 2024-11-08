let VectorCalculate = require('core/VectorCalculate');


module.exports = function() {


    const moduleData = {
        fileName: "RajMoveNoise.js"
    };

    let xMoveNoise = null;
    let yMoveNoise = null;

    let xDestinyMoveNoise = null;
    let yDestinyMoveNoise = null;

    //let speedMoveNoise          = null;
    let repeatMoveNoise = null;
    let valsMoveNoise = null;
    let indexMoveNoise = null;
    let master = null;

    let durationMoveNoise = null;

    let xVectorMoveNoise = null;
    let yVectorMoveNoise = null;

    const init = (_master) => {
        setMaster(_master);

        setXMoveNoise(0);
        setYMoveNoise(0);
        //setSpeedMoveNoise(2);
        setDurationMoveNoise(5);
        setRepeatMoveNoise(1);
    };

    //const attachMoveNoiseManage = () => {
    //    let attachMoveNoise = getActualBehaviorAttachMoveNoise();
    //
    //    if (attachMoveNoise == null) return;
    //
    //    startMoveNoiseBehavior(true);
    //};

    //const startMoveNoiseBehavior = (fromAttachMoveNoiseData) => {
    const startMoveNoiseBehavior = () => {
        let actualBehaviorAttachMoveNoise = getActualBehaviorAttachMoveNoise();
        let vals = actualBehaviorAttachMoveNoise.vals;
        let attachMoveNoiseRepeatData = actualBehaviorAttachMoveNoise.repeat;

        if (attachMoveNoiseRepeatData != null) setRepeatMoveNoise(attachMoveNoiseRepeatData);

        setIndexMoveNoise(null);
        setValsMoveNoise(vals);
        setDataByActualIndexMoveNoise();
    };

    const setDataByActualIndexMoveNoise = () => {
        manageIndexMoveNoise();

        let actualValMoveNoise = getactualValMoveNoiseByindexMoveNoise();

        if (!actualValMoveNoise) return; // rajMoveNoise is destroy;

        //setXDestinyMoveNoise(actualValMoveNoise.x);
        //setYDestinyMoveNoise(actualValMoveNoise.y);


        if (isset(actualValMoveNoise.x) || isset(actualValMoveNoise.y)) {
            errorReport(moduleData.fileName, "setDataByActualIndexMoveNoise", "deprecated data x or y. Please use offsetX or offsetY", actualValMoveNoise, "id: " + (master.getId ? master.getId() : null));
        }

        if (isset(actualValMoveNoise.x)) setXDestinyMoveNoise(actualValMoveNoise.x);
        if (isset(actualValMoveNoise.y)) setYDestinyMoveNoise(actualValMoveNoise.y);

        if (isset(actualValMoveNoise.offsetX)) setXDestinyMoveNoise(actualValMoveNoise.offsetX / CFG.tileSize);
        if (isset(actualValMoveNoise.offsetY)) setYDestinyMoveNoise(actualValMoveNoise.offsetY / CFG.tileSize);

        let duration = isset(actualValMoveNoise.duration) ? actualValMoveNoise.duration : 5;
        setDurationMoveNoise(duration);

        updateVectors();
    };

    const updateVectors = () => {

        let data = VectorCalculate.getNewVectorsFromDestinyAndDuration({
                x: xMoveNoise,
                y: yMoveNoise
            }, {
                x: xDestinyMoveNoise,
                y: yDestinyMoveNoise
            },
            durationMoveNoise
        );

        setXVectorMoveNoise(data.newXVector);
        setYVectorMoveNoise(data.newYVector);
    };

    const manageIndexMoveNoise = () => {
        if (indexMoveNoise == null) {
            setIndexMoveNoise(0);
            return;
        }

        setIndexMoveNoise(indexMoveNoise + 1);

        if (valsMoveNoise.length < indexMoveNoise + 1) {

            if (repeatMoveNoise === true) { //  infinitive
                setIndexMoveNoise(0);
                return
            }

            setRepeatMoveNoise(repeatMoveNoise - 1);

            if (repeatMoveNoise <= 0) {
                //destroy();
                return
            }

            setIndexMoveNoise(0);

        }

    };

    const updateMoveNoise = (dt) => {

        if (xMoveNoise == null && yMoveNoise == null && xDestinyMoveNoise == null && yDestinyMoveNoise == null) {
            return;
        }

        let newPosition = VectorCalculate.getNewPositionFromVectorsCorrect(xMoveNoise, yMoveNoise, xVectorMoveNoise, yVectorMoveNoise, dt, 1);

        setXMoveNoise(newPosition.newX);
        setYMoveNoise(newPosition.newY);

        //let reach = VectorCalculate.checkReachCord(
        //    {x          : xMoveNoise,           y       : yMoveNoise},
        //    {x          : xDestinyMoveNoise,    y       : yDestinyMoveNoise},
        //    {xVector    : xVectorMoveNoise,     yVector : yVectorMoveNoise}
        //);

        //if (!reach) return;


        decreaseDurationMoveNoise(dt);

        if (durationMoveNoise > 0) {
            return;
        }

        setXMoveNoise(xDestinyMoveNoise);
        setYMoveNoise(yDestinyMoveNoise);


        setDataByActualIndexMoveNoise();
    };

    const getActualBehaviorAttachMoveNoise = () => {
        let b = master.getActualBehavior();
        if (!b) return null;

        return b.attachMoveNoise ? b.attachMoveNoise : null;
    };

    const increaseIndexMoveNoise = () => {
        setIndexMoveNoise(indexMoveNoise + 1);
    };

    const setIndexMoveNoise = (index) => {
        indexMoveNoise = index
    };

    const setValsMoveNoise = (vals) => {
        valsMoveNoise = vals;
    };

    const setXMoveNoise = (x) => {
        xMoveNoise = x;
    };

    const setYMoveNoise = (y) => {
        yMoveNoise = y;
    };

    const setDurationMoveNoise = (_durationMoveNoise) => {
        durationMoveNoise = _durationMoveNoise;
    };

    const decreaseDurationMoveNoise = (dt) => {
        let duration = durationMoveNoise - dt;
        setDurationMoveNoise(duration)
    };

    const setXDestinyMoveNoise = (x) => {
        xDestinyMoveNoise = x;
    };

    const setYDestinyMoveNoise = (y) => {
        yDestinyMoveNoise = y;
    };

    const setMaster = (_master) => {
        master = _master;
    };

    const setXVectorMoveNoise = (xVector) => {
        xVectorMoveNoise = xVector;
    };

    const setYVectorMoveNoise = (yVector) => {
        yVectorMoveNoise = yVector;
    };

    //const setSpeedMoveNoise = (speed) => {
    //    speedMoveNoise = speed;
    //};

    const setRepeatMoveNoise = (repeat) => {
        repeatMoveNoise = repeat;
    };

    const getactualValMoveNoiseByindexMoveNoise = () => {
        if (!valsMoveNoise) {
            return null;
        }

        return valsMoveNoise[indexMoveNoise];
    }

    const getXMoveNoise = () => xMoveNoise;
    const getYMoveNoise = () => yMoveNoise;

    const getXOffsetMoveNoise = () => xMoveNoise * CFG.tileSize;
    const getYOffsetMoveNoise = () => yMoveNoise * CFG.tileSize;

    this.init = init;
    this.getXMoveNoise = getXMoveNoise;
    this.getYMoveNoise = getYMoveNoise;
    this.getXOffsetMoveNoise = getXOffsetMoveNoise;
    this.getYOffsetMoveNoise = getYOffsetMoveNoise;
    this.startMoveNoiseBehavior = startMoveNoiseBehavior;
    this.updateMoveNoise = updateMoveNoise;


}